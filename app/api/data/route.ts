import { NextResponse } from 'next/server';
import { generateBurst } from '@/lib/dataGenerator';

export const runtime = 'edge';

export async function GET() {
  const now = Date.now();
  const data = generateBurst(now, 1);
  return NextResponse.json({ data });
}
