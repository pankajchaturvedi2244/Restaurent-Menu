import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { RestaurantSchema } from '@/lib/utils/validation';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const restaurants = await prisma.restaurant.findMany({
      where: { ownerId: session.userId },
      include: { categories: true },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = RestaurantSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, location } = validationResult.data;

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        location,
        ownerId: session.userId,
      },
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
