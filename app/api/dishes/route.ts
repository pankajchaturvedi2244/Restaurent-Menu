import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { DishSchema } from '@/lib/utils/validation';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = DishSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, description, image, spiceLevel, categories , type, sellingRate} = validationResult.data;
    const { restaurantId } = body;

    // Verify ownership
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || restaurant.ownerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create dish with category relationships
    const dish = await prisma.dish.create({
      data: {
        name,
        description,
        image,
        spiceLevel: spiceLevel || null,
        type: type || "veg",
        sellingRate: sellingRate,
        restaurantId,
        categories: {
          create: categories.map(categoryId => ({
            category: { connect: { id: categoryId } },
          })),
        },
      },
      include: { categories: true },
    });
    

    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    console.error('Error creating dish:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    if (!restaurantId) {
      return NextResponse.json(
        { error: 'restaurantId query parameter is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || restaurant.ownerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const dishes = await prisma.dish.findMany({
      where: { restaurantId },
      include: { categories: true },
    });

    return NextResponse.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
