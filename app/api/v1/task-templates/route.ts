import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    const templates = await prisma.taskTemplate.findMany({ where: { userId: req.userId } });
    const groupedBySubCategory = templates.reduce((acc, template) => {
      const key = template.subCategoryId;
      if (!acc[key]) acc[key] = [];
      acc[key].push({ id: template.id, content: template.content });
      return acc;
    }, {} as { [key: string]: any[] });
    return NextResponse.json(groupedBySubCategory);
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const clientTemplates: { [subCategoryId: string]: any[] } = await request.json();

      await prisma.$transaction(async (tx: any) => {
        await tx.taskTemplate.deleteMany({ where: { userId: req.userId } });
        const userSubCategoryIds = (
          await tx.subCategory.findMany({
            where: { category: { userId: req.userId } },
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
                  userId: req.userId,
                },
              });
            }
          }
        }
      });
      const newTemplates = await prisma.taskTemplate.findMany({ where: { userId: req.userId } });
      const grouped = newTemplates.reduce((acc, template) => {
        const key = template.subCategoryId;
        if (!acc[key]) acc[key] = [];
        acc[key].push({ id: template.id, content: template.content });
        return acc;
      }, {} as { [key: string]: any[] });

      return NextResponse.json(grouped);
    } catch (error) {
      console.error('Error updating task templates:', error);
      return NextResponse.json({ message: 'Failed to update task templates' }, { status: 500 });
    }
  });
}