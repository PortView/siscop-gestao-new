import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // DEBUG: log início da requisição
  console.log('[API][LOGIN] Iniciando autenticação...');
  try {
    const { email, password } = await req.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_AUTH_URL!;
    console.log('[API][LOGIN] URL de autenticação:', apiUrl);
    const apiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    console.log('[API][LOGIN] Status da resposta externa:', apiRes.status);

    let apiBody: any = {};
    try {
      apiBody = await apiRes.json();
      console.log('[API][LOGIN] Corpo da resposta externa:', apiBody);
    } catch (e) {
      console.error('[API][LOGIN] Erro ao converter resposta externa para JSON:', e);
      return NextResponse.json({ message: 'Erro inesperado na resposta da API.' }, { status: 502 });
    }

    if (!apiRes.ok) {
      console.error('[API][LOGIN] Erro da API externa:', apiBody);
      return NextResponse.json({ message: apiBody?.message || 'Usuário ou senha inválidos.' }, { status: apiRes.status });
    }

    // Aceitar tanto 'access_token' quanto 'access-token'
    const token = apiBody['access-token'] || apiBody['access_token'];
    if (!token) {
      console.error('[API][LOGIN] Token não recebido:', apiBody);
      return NextResponse.json({ message: 'Token não recebido.' }, { status: 500 });
    }

    // Setar cookie HttpOnly
    const response = NextResponse.json({ success: true });
    response.cookies.set('access-token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true,
      maxAge: 60 * 60 * 8, // 8 horas
    });
    return response;
  } catch (error: any) {
    console.error('[API][LOGIN] Erro inesperado:', error);
    return NextResponse.json({ message: error?.message || 'Erro interno inesperado.' }, { status: 500 });
  }
}

