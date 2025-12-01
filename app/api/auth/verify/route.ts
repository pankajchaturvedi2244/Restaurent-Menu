import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { VerifyCodeSchema } from '@/lib/utils/validation';
import { isVerificationCodeValid } from '@/lib/auth/verification';
import { createSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = VerifyCodeSchema.safeParse(body);
console.log(validationResult.error,"validationResult >>>>>>>>>>>>>>>>>")

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { email, code } = validationResult.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
console.log(user,"userss >>>>>>>>>>>>>>>>>")
    // Verify code
    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    if (!user.verificationCodeSentAt || !isVerificationCodeValid(user.verificationCodeSentAt)) {
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      );
    }

    // Update user as verified
    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationCodeSentAt: null,
      },
    });

    // Create session
    await createSession(user.id, user.email);

    const response = NextResponse.json({
      message: 'Email verified successfully',
      userId: user.id,
    });

    return response;
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
