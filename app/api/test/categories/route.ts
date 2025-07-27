import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  return withAuth(request, async (req: AuthenticatedRequest) => {
    try {
      console.log('=== CATEGORIES TEST START ===');
      
      // 간단한 카테고리 생성 테스트
      const testCategory = await prisma.category.create({
        data: {
          id: 'test-cat-' + Date.now(),
          name: '테스트 카테고리',
          color: '#FF0000',
          userId: req.userId
        }
      });
      console.log('Category created:', testCategory.id);
      
      // 서브카테고리 생성 테스트
      const testSubCategory = await prisma.subCategory.create({
        data: {
          id: 'test-sub-' + Date.now(),
          name: '테스트 서브카테고리',
          categoryId: testCategory.id
        }
      });
      console.log('SubCategory created:', testSubCategory.id);
      
      // 정리
      await prisma.subCategory.delete({ where: { id: testSubCategory.id } });
      await prisma.category.delete({ where: { id: testCategory.id } });
      console.log('Test data cleaned up');
      
      console.log('=== CATEGORIES TEST COMPLETED ===');
      
      return NextResponse.json({
        status: 'success',
        message: 'Categories CUD operations working',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('=== CATEGORIES TEST FAILED ===');
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        userId: req.userId
      });
      
      return NextResponse.json({
        status: 'error',
        message: 'Categories CUD test failed', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  });
}