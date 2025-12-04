import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
    const params = await context.params; // ← Fix for Next.js params Promise bug

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dishId = params.id;

    const dish = await prisma.dish.findUnique({
      where: { id: dishId },
      include: { restaurant: true },
    });

    if (!dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }

    if (dish.restaurant.ownerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.dish.delete({
      where: { id: dishId },
    });

    return NextResponse.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
