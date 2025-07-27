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

      // 중복 content 검사
      const duplicateContents: string[] = [];
      for (const subCatId in clientTemplates) {
        const contents = clientTemplates[subCatId].map(t => t.content);
        const uniqueContents = new Set(contents);
        if (contents.length !== uniqueContents.size) {
          const duplicates = contents.filter((content, index) => contents.indexOf(content) !== index);
          duplicateContents.push(...duplicates);
        }
      }

      if (duplicateContents.length > 0) {
        return NextResponse.json(
          { 
            message: 'DUPLICATE_CONTENT',
            duplicates: [...new Set(duplicateContents)]
          }, 
          { status: 400 }
        );
      }

      await prisma.$transaction(async (tx) => {
        console.log('Starting task templates transaction for user:', req.userId);
        console.log('Client templates data:', JSON.stringify(clientTemplates, null, 2));
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
    } catch (error: any) {
      console.error('Error updating task templates:', error);
      
      // Prisma unique constraint 에러 처리
      if (error.code === 'P2002') {
        return NextResponse.json(
          { 
            message: 'DUPLICATE_CONTENT',
            details: '동일한 내용의 태스크 템플릿이 이미 존재합니다.'
          }, 
          { status: 400 }
        );
      }
      
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        code: error.code || 'No code',
        userId: req.userId
      });
      
      return NextResponse.json({ 
        message: 'Failed to update task templates',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  });
}