import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RegisterSchema } from '@/lib/utils/validation';
import { generateVerificationCode } from '@/lib/auth/verification';
import { sendVerificationEmail } from '@/lib/auth/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Reuse register validation (email required)
    const validationResult = RegisterSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { email, fullName, country } = validationResult.data;

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const now = new Date();

    // Update or create user (allow existing verified users as well)
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        fullName,
        country,
        verificationCode,
        verificationCodeSentAt: now,
      },
      create: {
        email,
        fullName,
        country,
        verificationCode,
        verificationCodeSentAt: now,
      },
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationCode);

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Verification code sent to your email',
      userId: user.id,
    });
  } catch (error) {
    console.error('Login (send code) error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
