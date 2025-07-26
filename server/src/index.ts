import express, { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
const { prisma } = require("./db");
import { Category, Task } from "./types";
import { DEFAULT_CATEGORIES } from "./constants";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
  console.error("FATAL ERROR: Google OAuth environment variables are not set.");
  (process as any).exit(1);
}

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

// Define a custom interface for authenticated requests
interface AuthRequest extends ExpressRequest {
  userId?: string;
  session: {
    userId?: string;
    frontendOrigin?: string;
  } | null;
}

app.use(
  cors({
    origin: true, // Reflect the request origin, suitable for dev environments with dynamic URLs
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_SESSION_SECRET || "super-secret-key-please-change"],
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
);

// --- Auth Routes ---
app.get("/api/auth/google", (req: ExpressRequest, res: ExpressResponse) => {
  const authReq = req as AuthRequest;
  // Store the frontend's origin from the Referer header to redirect back to it later
  const referer = req.get("Referer");
  if (authReq.session && referer) {
    try {
      const refererUrl = new URL(referer);
      authReq.session.frontendOrigin = refererUrl.origin;
    } catch (e) {
      console.warn("Could not parse Referer URL:", referer);
    }
  }

  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
    prompt: "consent",
  });
  res.redirect(authorizeUrl);
});

app.get("/api/auth/google/callback", async (req: ExpressRequest, res: ExpressResponse) => {
  const authReq = req as AuthRequest;
  // Determine redirect URL: from session, or fallback to env var/default
  const redirectUrl = authReq.session?.frontendOrigin || FRONTEND_URL;

  try {
    const { code } = req.query;
    if (!code) {
      return res.redirect(`${redirectUrl}?error=auth_failed&message=Missing_authorization_code`);
    }

    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email || !payload.name) {
      return res.redirect(`${redirectUrl}?error=auth_failed&message=Failed_to_get_user_profile`);
    }

    const user = await prisma.user.upsert({
      where: { googleId: payload.sub },
      update: {
        email: payload.email,
        name: payload.name,
        avatarUrl: payload.picture,
      },
      create: {
        id: payload.sub,
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatarUrl: payload.picture,
      },
    });

    if (authReq.session) {
      authReq.session.userId = user.id;
    } else {
      // This case should not happen with cookie-session if it's set up correctly
      authReq.session = { userId: user.id };
    }
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google Auth Callback Error:", error);
    res.redirect(`${redirectUrl}?error=auth_failed`);
  }
});

app.post("/api/auth/logout", (req: ExpressRequest, res: ExpressResponse) => {
  const authReq = req as AuthRequest;
  authReq.session = null;
  res.status(204).send();
});

app.get("/api/auth/user", async (req: ExpressRequest, res: ExpressResponse) => {
  const authReq = req as AuthRequest;
  if (!authReq.session?.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const user = await prisma.user.findUnique({ where: { id: authReq.session.userId } });
  if (user) {
    res.json({ name: user.name, avatarUrl: user.avatarUrl });
  } else {
    authReq.session = null; // Clear invalid session
    res.status(401).json({ message: "User not found" });
  }
});

// Middleware to ensure user is authenticated for all following API routes
const ensureAuthenticated = (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
  const authReq = req as AuthRequest;
  if (!authReq.session?.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  authReq.userId = authReq.session.userId;
  next();
};

const apiV1Router = express.Router();
apiV1Router.use(ensureAuthenticated);
app.use("/api/v1", apiV1Router);

// --- API Routes (Protected) ---

// Categories
apiV1Router.get("/categories", async (req: ExpressRequest, res: ExpressResponse) => {
  const { userId } = req as AuthRequest;
  const categories = await prisma.category.findMany({
    where: { userId: userId! },
    include: { subCategories: true },
    orderBy: { name: "asc" },
  });

  if (categories.length === 0) {
    await prisma.$transaction(
      DEFAULT_CATEGORIES.map((cat) =>
        prisma.category.create({
          data: {
            id: cat.id,
            name: cat.name,
            color: cat.color,
            userId: userId!,
            subCategories: {
              create: cat.subCategories.map((sub) => ({
                id: sub.id,
                name: sub.name,
              })),
            },
          },
        })
      )
    );
    const newCategories = await prisma.category.findMany({
      where: { userId: userId! },
      include: { subCategories: true },
      orderBy: { name: "asc" },
    });
    return res.json(newCategories);
  }
  res.json(categories);
});

apiV1Router.put("/categories", async (req: ExpressRequest, res: ExpressResponse) => {
  const clientCategories: Category[] = req.body;
  const { userId } = req as AuthRequest;

  try {
    await prisma.$transaction(async (tx) => {
      const existingCatIds = (await tx.category.findMany({ where: { userId: userId! }, select: { id: true } })).map(
        (c) => c.id
      );
      const clientCatIds = clientCategories.map((c) => c.id);

      const catsToDelete = existingCatIds.filter((id) => !clientCatIds.includes(id));
      if (catsToDelete.length > 0) {
        await tx.category.deleteMany({ where: { id: { in: catsToDelete }, userId: userId! } });
      }

      for (const cat of clientCategories) {
        const upsertedCategory = await tx.category.upsert({
          where: { id: cat.id },
          update: { name: cat.name, color: cat.color },
          create: { id: cat.id, name: cat.name, color: cat.color, userId: userId! },
        });
        if (cat.subCategories) {
          const existingSubCatIds = (
            await tx.subCategory.findMany({ where: { categoryId: upsertedCategory.id }, select: { id: true } })
          ).map((sc) => sc.id);
          const clientSubCatIds = cat.subCategories.map((sc) => sc.id);
          const subCatsToDelete = existingSubCatIds.filter((id) => !clientSubCatIds.includes(id));

          if (subCatsToDelete.length > 0) {
            await tx.subCategory.deleteMany({ where: { id: { in: subCatsToDelete } } });
          }

          for (const sub of cat.subCategories) {
            await tx.subCategory.upsert({
              where: { id: sub.id },
              update: { name: sub.name },
              create: { id: sub.id, name: sub.name, categoryId: upsertedCategory.id },
            });
          }
        }
      }
    });
    const updatedCategories = await prisma.category.findMany({
      where: { userId: userId! },
      include: { subCategories: true },
    });
    res.json(updatedCategories);
  } catch (error) {
    console.error("Error updating categories:", error);
    res.status(500).json({ message: "Failed to update categories" });
  }
});

// Events
apiV1Router.get("/events", async (req: ExpressRequest, res: ExpressResponse) => {
  const { userId } = req as AuthRequest;
  const events = await prisma.event.findMany({
    where: { userId: userId! },
    orderBy: { date: "asc" },
  });
  res.json(events.map((e) => ({ ...e, date: e.date.toISOString().split("T")[0] })));
});

apiV1Router.post("/events", async (req: ExpressRequest, res: ExpressResponse) => {
  const { date, categoryId, subCategoryId, ...eventData } = req.body;
  const { userId } = req as AuthRequest;

  const category = await prisma.category.findFirst({ where: { id: categoryId, userId: userId! } });
  if (!category) {
    return res.status(400).json({ message: "Invalid category provided." });
  }
  if (subCategoryId) {
    const subCategory = await prisma.subCategory.findFirst({ where: { id: subCategoryId, categoryId } });
    if (!subCategory) {
      return res.status(400).json({ message: "Invalid sub-category provided." });
    }
  }

  const newEvent = await prisma.event.create({
    data: {
      ...eventData,
      categoryId,
      subCategoryId,
      date: new Date(date),
      userId: userId!,
    },
  });
  res.status(201).json({ ...newEvent, date: newEvent.date.toISOString().split("T")[0] });
});

apiV1Router.put("/events/:id", async (req: ExpressRequest, res: ExpressResponse) => {
  const { id } = req.params;
  const { date, categoryId, subCategoryId, ...eventData } = req.body;
  const { userId } = req as AuthRequest;
  try {
    const existingEvent = await prisma.event.findFirst({ where: { id, userId: userId! } });
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found or you don't have permission to edit it." });
    }

    const category = await prisma.category.findFirst({ where: { id: categoryId, userId: userId! } });
    if (!category) {
      return res.status(400).json({ message: "Invalid category provided." });
    }
    if (subCategoryId) {
      const subCategory = await prisma.subCategory.findFirst({ where: { id: subCategoryId, categoryId } });
      if (!subCategory) {
        return res.status(400).json({ message: "Invalid sub-category provided." });
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...eventData,
        categoryId,
        subCategoryId,
        date: new Date(date),
      },
    });
    res.json({ ...updatedEvent, date: updatedEvent.date.toISOString().split("T")[0] });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Failed to update event" });
  }
});

apiV1Router.delete("/events/:id", async (req: ExpressRequest, res: ExpressResponse) => {
  const { id } = req.params;
  const { userId } = req as AuthRequest;
  try {
    const result = await prisma.event.deleteMany({ where: { id, userId: userId! } });
    if (result.count === 0) {
      return res.status(404).json({ message: "Event not found or you don't have permission to delete it." });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
});

// Tasks for an Event
apiV1Router.get("/events/:eventId/tasks", async (req: ExpressRequest, res: ExpressResponse) => {
  const { eventId } = req.params;
  const { userId } = req as AuthRequest;
  const event = await prisma.event.findFirst({ where: { id: eventId, userId: userId! } });
  if (!event) {
    return res.status(404).json({ message: "Event not found or not owned by user." });
  }

  const tasks = await prisma.task.findMany({
    where: { eventId },
    include: { comments: { include: { author: true }, orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "asc" },
  });
  const formattedTasks = tasks.map((task) => ({
    id: task.id,
    content: task.content,
    status: task.status,
    comments: task.comments.map((c) => ({
      id: c.id,
      author: c.author.name,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
    })),
  }));
  res.json(formattedTasks);
});

apiV1Router.put("/events/:eventId/tasks", async (req: ExpressRequest, res: ExpressResponse) => {
  const { eventId } = req.params;
  const clientTasks: Task[] = req.body;
  const { userId } = req as AuthRequest;

  const event = await prisma.event.findFirst({ where: { id: eventId, userId: userId! } });
  if (!event) {
    return res.status(404).json({ message: "Event not found or not owned by user." });
  }

  await prisma.$transaction(async (tx) => {
    const existingTaskIds = (await tx.task.findMany({ where: { eventId }, select: { id: true } })).map((t) => t.id);
    const clientTaskIds = clientTasks.map((t) => t.id);
    const taskIdsToDelete = existingTaskIds.filter((id) => !clientTaskIds.includes(id));

    if (taskIdsToDelete.length > 0) {
      await tx.task.deleteMany({ where: { id: { in: taskIdsToDelete } } });
    }

    for (const task of clientTasks) {
      const { comments, ...taskData } = task;
      const upsertedTask = await tx.task.upsert({
        where: { id: task.id },
        create: { ...taskData, eventId: eventId },
        update: { content: taskData.content, status: taskData.status },
      });

      if (comments && comments.length > 0) {
        const existingCommentIds = (
          await tx.comment.findMany({ where: { taskId: upsertedTask.id }, select: { id: true } })
        ).map((c) => c.id);
        for (const comment of comments) {
          if (!existingCommentIds.includes(comment.id)) {
            await tx.comment.create({
              data: {
                id: comment.id,
                content: comment.content,
                taskId: upsertedTask.id,
                authorId: userId!,
                createdAt: new Date(comment.createdAt),
              },
            });
          }
        }
      }
    }
  });

  const finalTasks = await prisma.task.findMany({
    where: { eventId },
    include: { comments: { include: { author: true }, orderBy: { createdAt: "asc" } } },
    orderBy: { createdAt: "asc" },
  });
  const formattedTasks = finalTasks.map((task) => ({
    id: task.id,
    content: task.content,
    status: task.status,
    comments: task.comments.map((c) => ({
      id: c.id,
      author: c.author.name,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
    })),
  }));
  res.json(formattedTasks);
});

// Task Templates
apiV1Router.get("/task-templates", async (req: ExpressRequest, res: ExpressResponse) => {
  const { userId } = req as AuthRequest;
  const templates = await prisma.taskTemplate.findMany({ where: { userId: userId! } });
  const groupedBySubCategory = templates.reduce((acc, template) => {
    const key = template.subCategoryId;
    if (!acc[key]) acc[key] = [];
    acc[key].push({ id: template.id, content: template.content });
    return acc;
  }, {} as { [key: string]: any[] });
  res.json(groupedBySubCategory);
});

apiV1Router.put("/task-templates", async (req: ExpressRequest, res: ExpressResponse) => {
  const clientTemplates: { [subCategoryId: string]: any[] } = req.body;
  const { userId } = req as AuthRequest;

  await prisma.$transaction(async (tx) => {
    await tx.taskTemplate.deleteMany({ where: { userId: userId! } });
    const userSubCategoryIds = (
      await tx.subCategory.findMany({
        where: { category: { userId: userId! } },
        select: { id: true },
      })
    ).map((sc) => sc.id);

    for (const subCatId in clientTemplates) {
      if (userSubCategoryIds.includes(subCatId)) {
        for (const template of clientTemplates[subCatId]) {
          await tx.taskTemplate.create({
            data: {
              content: template.content,
              subCategoryId: subCatId,
              userId: userId!,
            },
          });
        }
      }
    }
  });
  const newTemplates = await prisma.taskTemplate.findMany({ where: { userId: userId! } });
  const grouped = newTemplates.reduce((acc, template) => {
    const key = template.subCategoryId;
    if (!acc[key]) acc[key] = [];
    acc[key].push({ id: template.id, content: template.content });
    return acc;
  }, {} as { [key: string]: any[] });

  res.json(grouped);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
