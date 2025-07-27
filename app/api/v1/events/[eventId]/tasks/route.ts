import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/db';
import { Task } from '@/types';

export async function GET(request: NextRequest, context: { params: Promise<{ eventId: string }> }) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    const params = await context.params;
    const { eventId } = params;
    const event = await prisma.event.findFirst({ where: { id: eventId, userId: req.userId } });
    if (!event) {
      return NextResponse.json({ message: 'Event not found or not owned by user.' }, { status: 404 });
    }

    const tasks = await prisma.task.findMany({
      where: { eventId },
      include: { comments: { include: { author: true }, orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'asc' },
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
    return NextResponse.json(formattedTasks);
  });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ eventId: string }> }) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const params = await context.params;
      const { eventId } = params;
      const clientTasks: Task[] = await request.json();

      const event = await prisma.event.findFirst({ where: { id: eventId, userId: req.userId } });
      if (!event) {
        return NextResponse.json({ message: 'Event not found or not owned by user.' }, { status: 404 });
      }

      await prisma.$transaction(async (tx: any) => {
        const existingTaskIds = (await tx.task.findMany({ where: { eventId }, select: { id: true } })).map(
          (t) => t.id
        );
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
                    authorId: req.userId,
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
        include: { comments: { include: { author: true }, orderBy: { createdAt: 'asc' } } },
        orderBy: { createdAt: 'asc' },
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
      return NextResponse.json(formattedTasks);
    } catch (error) {
      console.error('Error updating tasks:', error);
      return NextResponse.json({ message: 'Failed to update tasks' }, { status: 500 });
    }
  });
}