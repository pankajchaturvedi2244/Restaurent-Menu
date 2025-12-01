export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function isVerificationCodeValid(sentAt: Date | null): boolean {
  if (!sentAt) return false;
  const now = new Date();
  const diffInMinutes = (now.getTime() - sentAt.getTime()) / (1000 * 60);
  return diffInMinutes < 30; // Code valid for 30 minutes
}
