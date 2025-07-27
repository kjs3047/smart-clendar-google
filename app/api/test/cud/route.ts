import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST() {
  try {
    console.log('=== CUD TEST START ===');
    
    // 1. CREATE 테스트
    console.log('Step 1: Testing CREATE operation');
    const testUser = await prisma.user.create({
      data: {
        id: 'test-' + Date.now(),
        googleId: 'test-google-' + Date.now(),
        email: 'test@example.com',
        name: 'Test User'
      }
    });
    console.log('CREATE success:', testUser.id);
    
    // 2. UPDATE 테스트
    console.log('Step 2: Testing UPDATE operation');
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { name: 'Updated Test User' }
    });
    console.log('UPDATE success:', updatedUser.name);
    
    // 3. DELETE 테스트
    console.log('Step 3: Testing DELETE operation');
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('DELETE success');
    
    console.log('=== CUD TEST COMPLETED SUCCESSFULLY ===');
    
    return NextResponse.json({ 
      status: 'success',
      message: 'All CUD operations working properly',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('=== CUD TEST FAILED ===');
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return NextResponse.json({ 
      status: 'error',
      message: 'CUD operations failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log('=== READ TEST START ===');
    
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    const categories = await prisma.category.findMany({
      take: 5,
      include: { subCategories: true }
    });
    console.log('Categories found:', categories.length);
    
    console.log('=== READ TEST COMPLETED SUCCESSFULLY ===');
    
    return NextResponse.json({
      status: 'success',
      message: 'READ operations working',
      data: {
        userCount,
        categoriesCount: categories.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('=== READ TEST FAILED ===');
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return NextResponse.json({
      status: 'error', 
      message: 'READ operations failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}