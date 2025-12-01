import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: restaurantId } = await params;
    console.log('PUBLIC MENU API - restaurantId:', restaurantId);

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { id: true, name: true, location: true },
    });

    if (!restaurant) {
      console.log('PUBLIC MENU API - restaurant not found for id:', restaurantId);
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    console.log('PUBLIC MENU API - found restaurant:', restaurant);

    const categories = await prisma.category.findMany({
      where: { restaurantId },
      select: { id: true, name: true },
    });

    const dishes = await prisma.dish.findMany({
      where: { restaurantId },
      include: { categories: true },
    });

    console.log('PUBLIC MENU API - categories:', categories.length, 'dishes:', dishes.length);

    return NextResponse.json({
      restaurant,
      categories,
      dishes,
    });
  } catch (error) {
    console.error('PUBLIC MENU API ERROR:', error);
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
