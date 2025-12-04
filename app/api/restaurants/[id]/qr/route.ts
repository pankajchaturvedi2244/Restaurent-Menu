import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET(
  request: NextRequest,
   context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
      const params = await context.params; // ← Fix for Next.js params Promise bug

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // The `params` object can be a promise in some Next.js configurations.
    const { id: restaurantId } = await params;

    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant ID is missing from the URL' }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    if (restaurant.ownerId !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error('Error: NEXT_PUBLIC_APP_URL is not set');
      return NextResponse.json(
        { error: 'Application URL is not configured' },
        { status: 500 }
      );
    }

    const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL}/menu/${restaurantId}`;

    return NextResponse.json({
      restaurantId,
      restaurantName: restaurant.name,
      menuUrl,
      qrCodeDataUrl: null, // Client-side generation
    });
  } catch (error) {
    console.error('Error generating QR code info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
