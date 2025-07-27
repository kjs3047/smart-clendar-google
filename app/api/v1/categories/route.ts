import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/db';
import { DEFAULT_CATEGORIES } from '@/lib/constants';
import { Category } from '@/types';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    const categories = await prisma.category.findMany({
      where: { userId: req.userId },
      include: { subCategories: true },
      orderBy: { name: 'asc' },
    });

    if (categories.length === 0) {
      await prisma.$transaction(
        DEFAULT_CATEGORIES.map((cat) =>
          prisma.category.create({
            data: {
              id: cat.id,
              name: cat.name,
              color: cat.color,
              userId: req.userId,
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
        where: { userId: req.userId },
        include: { subCategories: true },
        orderBy: { name: 'asc' },
      });
      return NextResponse.json(newCategories);
    }
    return NextResponse.json(categories);
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const clientCategories: Category[] = await request.json();

      await prisma.$transaction(async (tx: any) => {
        const existingCatIds = (
          await tx.category.findMany({ where: { userId: req.userId }, select: { id: true } })
        ).map((c) => c.id);
        const clientCatIds = clientCategories.map((c) => c.id);

        const catsToDelete = existingCatIds.filter((id) => !clientCatIds.includes(id));
        if (catsToDelete.length > 0) {
          await tx.category.deleteMany({ where: { id: { in: catsToDelete }, userId: req.userId } });
        }

        for (const cat of clientCategories) {
          const upsertedCategory = await tx.category.upsert({
            where: { id: cat.id },
            update: { name: cat.name, color: cat.color },
            create: { id: cat.id, name: cat.name, color: cat.color, userId: req.userId },
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
        where: { userId: req.userId },
        include: { subCategories: true },
      });
      return NextResponse.json(updatedCategories);
    } catch (error) {
      console.error('Error updating categories:', error);
      return NextResponse.json({ message: 'Failed to update categories' }, { status: 500 });
    }
  });
}