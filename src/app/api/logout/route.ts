import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  // Remove o cookie HttpOnly
  const response = NextResponse.json({ success: true });
  response.cookies.set('access-token', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: true,
    maxAge: 0,
  });
  return response;
}
