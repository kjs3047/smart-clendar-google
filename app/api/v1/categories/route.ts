import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/db';
import { Category } from '@/types';
import { createDefaultCategoriesForUser } from '@/lib/defaultCategories';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    const categories = await prisma.category.findMany({
      where: { userId: req.userId },
      include: { subCategories: true },
      orderBy: { name: 'asc' },
    });

    if (categories.length === 0) {
      try {
        await createDefaultCategoriesForUser(req.userId);
        const newCategories = await prisma.category.findMany({
          where: { userId: req.userId },
          include: { subCategories: true },
          orderBy: { name: 'asc' },
        });
        return NextResponse.json(newCategories);
      } catch (error) {
        console.error('Failed to create default categories:', error);
        return NextResponse.json({ message: 'Failed to create default categories' }, { status: 500 });
      }
    }
    return NextResponse.json(categories);
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const clientCategories: Category[] = await request.json();

      await prisma.$transaction(async (tx) => {
        console.log('Starting transaction for user:', req.userId);
        console.log('Client categories count:', clientCategories.length);
        
        const existingCatIds = (
          await tx.category.findMany({ where: { userId: req.userId }, select: { id: true } })
        ).map((c) => c.id);
        const clientCatIds = clientCategories.map((c) => c.id);
        console.log('Existing categories:', existingCatIds);
        console.log('Client categories:', clientCatIds);

        const catsToDelete = existingCatIds.filter((id) => !clientCatIds.includes(id));
        if (catsToDelete.length > 0) {
          console.log('Deleting categories:', catsToDelete);
          await tx.category.deleteMany({ where: { id: { in: catsToDelete }, userId: req.userId } });
        }

        for (const cat of clientCategories) {
          console.log('Processing category:', cat.id, cat.name);
          
          const upsertedCategory = await tx.category.upsert({
            where: { id: cat.id },
            update: { name: cat.name, color: cat.color },
            create: { id: cat.id, name: cat.name, color: cat.color, userId: req.userId },
          });
          
          if (cat.subCategories && cat.subCategories.length > 0) {
            console.log('Processing subcategories for:', cat.id);
            
            const existingSubCatIds = (
              await tx.subCategory.findMany({ where: { categoryId: upsertedCategory.id }, select: { id: true } })
            ).map((sc) => sc.id);
            const clientSubCatIds = cat.subCategories.map((sc) => sc.id);
            const subCatsToDelete = existingSubCatIds.filter((id) => !clientSubCatIds.includes(id));

            if (subCatsToDelete.length > 0) {
              console.log('Deleting subcategories:', subCatsToDelete);
              await tx.subCategory.deleteMany({ where: { id: { in: subCatsToDelete } } });
            }

            for (const sub of cat.subCategories) {
              console.log('Processing subcategory:', sub.id, sub.name);
              await tx.subCategory.upsert({
                where: { id: sub.id },
                update: { name: sub.name },
                create: { id: sub.id, name: sub.name, categoryId: upsertedCategory.id },
              });
            }
          }
        }
        
        console.log('Transaction completed successfully');
      }, {
        timeout: 10000, // 10초 타임아웃
      });
      const updatedCategories = await prisma.category.findMany({
        where: { userId: req.userId },
        include: { subCategories: true },
      });
      return NextResponse.json(updatedCategories);
    } catch (error) {
      console.error('Error updating categories:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        userId: req.userId,
        clientCategoriesCount: clientCategories ? clientCategories.length : 'undefined'
      });
      return NextResponse.json({ 
        message: 'Failed to update categories',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
      
    }
  });
}
