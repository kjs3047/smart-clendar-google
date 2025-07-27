import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/db';

export async function PUT(request: NextRequest, context: { params: Promise<{ eventId: string }> }) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    let date: string = '';
    let categoryId: string = '';
    let subCategoryId: string | null = null;
    let eventData: any = {};
    try {
      const params = await context.params;
      const { eventId } = params;
      const requestData = await request.json();
      ({ date, categoryId, subCategoryId, ...eventData } = requestData);

      const existingEvent = await prisma.event.findFirst({ where: { id: eventId, userId: req.userId } });
      if (!existingEvent) {
        return NextResponse.json(
          { message: "Event not found or you don't have permission to edit it." },
          { status: 404 }
        );
      }

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

      const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: {
          ...eventData,
          categoryId,
          subCategoryId,
          date: new Date(date),
        },
      });
      return NextResponse.json({ ...updatedEvent, date: updatedEvent.date.toISOString().split('T')[0] });
    } catch (error) {
      console.error('Error updating event:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        userId: req.userId,
        requestData: { date, categoryId, subCategoryId, ...eventData }
      });
      return NextResponse.json({ 
        message: 'Failed to update event',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ eventId: string }> }) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    let eventId: string = '';
    try {
      const params = await context.params;
      eventId = params.eventId;
      const result = await prisma.event.deleteMany({ where: { id: eventId, userId: req.userId } });
      if (result.count === 0) {
        return NextResponse.json(
          { message: "Event not found or you don't have permission to delete it." },
          { status: 404 }
        );
      }
      return NextResponse.json({}, { status: 204 });
    } catch (error) {
      console.error('Error deleting event:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        userId: req.userId,
        eventId: eventId
      });
      return NextResponse.json({ 
        message: 'Failed to delete event',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  });
}
