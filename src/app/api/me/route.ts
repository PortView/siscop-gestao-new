import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Lê o cookie access-token
  const token = req.cookies.get('access-token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Token não encontrado.' }, { status: 401 });
  }

  // Chama a API externa com o token Bearer
  const apiRes = await fetch(process.env.NEXT_PUBLIC_API_ME_URL!, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  if (!apiRes.ok) {
    return NextResponse.json({ message: 'Não autenticado.' }, { status: apiRes.status });
  }

  const data = await apiRes.json();
  return NextResponse.json(data);
}
