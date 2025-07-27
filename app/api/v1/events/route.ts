import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    const events = await prisma.event.findMany({
      where: { userId: req.userId },
      orderBy: { date: 'asc' },
    });
    return NextResponse.json(events.map((e) => ({ ...e, date: e.date.toISOString().split('T')[0] })));
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      const { date, categoryId, subCategoryId, ...eventData } = await request.json();

      const category = await prisma.category.findFirst({ where: { id: categoryId, userId: req.userId } });
      if (!category) {
        return NextResponse.json({ message: 'Invalid category provided.' }, { status: 400 });
      }
      if (subCategoryId) {
        const subCategory = await prisma.subCategory.findFirst({ where: { id: subCategoryId, categoryId } });
        if (!subCategory) {
          return NextResponse.json({ message: 'Invalid sub-category provided.' }, { status: 400 });
        }
      }

      const newEvent = await prisma.event.create({
        data: {
          ...eventData,
          categoryId,
          subCategoryId,
          date: new Date(date),
          userId: req.userId,
        },
      });
      return NextResponse.json(
        { ...newEvent, date: newEvent.date.toISOString().split('T')[0] },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating event:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        userId: req.userId,
        requestData: { date, categoryId, subCategoryId, ...eventData }
      });
      return NextResponse.json({ 
        message: 'Failed to create event',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  });
}
