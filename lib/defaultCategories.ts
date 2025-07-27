import { prisma } from './db';
import { DEFAULT_CATEGORIES } from '../constants';

export async function createDefaultCategoriesForUser(userId: string): Promise<void> {
  try {
    // 트랜잭션을 사용하여 모든 카테고리와 서브카테고리를 한 번에 생성
    await prisma.$transaction(async (tx) => {
      for (const category of DEFAULT_CATEGORIES) {
        // 카테고리 생성
        const createdCategory = await tx.category.create({
          data: {
            id: `${userId}_${category.id}`, // 사용자별 고유 ID
            name: category.name,
            color: category.color,
            userId: userId,
          },
        });

        // 서브카테고리 생성
        if (category.subCategories && category.subCategories.length > 0) {
          for (const subCategory of category.subCategories) {
            await tx.subCategory.create({
              data: {
                id: `${userId}_${subCategory.id}`, // 사용자별 고유 ID
                name: subCategory.name,
                categoryId: createdCategory.id,
              },
            });
          }
        }
      }
    });

    console.log(`Default categories created for user: ${userId}`);
  } catch (error) {
    console.error('Error creating default categories:', error);
    throw error;
  }
}

export async function hasExistingCategories(userId: string): Promise<boolean> {
  try {
    const count = await prisma.category.count({
      where: { userId: userId }
    });
    return count > 0;
  } catch (error) {
    console.error('Error checking existing categories:', error);
    return false;
  }
}