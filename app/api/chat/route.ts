import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { SYSTEM_INSTRUCTION } from '@/lib/chatbot-prompt';

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY = 5;

interface Message {
  role: 'user' | 'model';
  content: string;
}

export async function POST(request: Request) {
  // Sem prefixo NEXT_PUBLIC_: a chave só existe no servidor, nunca vai para o navegador.
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'O chat está indisponível no momento. Chama a gente no WhatsApp! 🤩' },
      { status: 503 }
    );
  }

  let body: { history?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: 'Mensagem vazia ou longa demais.' }, { status: 400 });
  }

  const history = (Array.isArray(body.history) ? body.history : [])
    .filter(
      (m): m is Message =>
        !!m &&
        (m.role === 'user' || m.role === 'model') &&
        typeof m.content === 'string'
    )
    .slice(-MAX_HISTORY);

  let promptContext = `Histórico da conversa:\n`;
  history.forEach(m => {
    promptContext += `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content.slice(0, MAX_MESSAGE_LENGTH)}\n`;
  });
  promptContext += `Usuário: ${message}\nAssistente:`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: promptContext,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return NextResponse.json({ text: response.text ?? '' });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Ops! Ocorreu um erro de conexão. Que tal me chamar no WhatsApp pelo botão da página?' },
      { status: 502 }
    );
  }
}
