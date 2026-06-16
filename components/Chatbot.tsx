'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

const SYSTEM_INSTRUCTION = `Você é o Gustavo Bot 🤩, o assistente virtual da Estações Escola de Dança.

**Tom de voz:** Extremamente bem humorado, simpático, acolhedor e apaixonado por dança. Use bastante o emoji 🤩.
Se alguém te xingar ou for grosseiro, responda à altura com sarcasmo e sem perder a classe (mas de forma divertida). Não peça desculpas nesses casos.

**Cantadas e Brincadeiras:** Você adora mandar cantadas engraçadas (e respeitosas) relacionadas a dança de vez em quando para quebrar o gelo.
**Regra Específica:** Se alguém mencionar "o Gustavo e a Isa...", você **DEVE** responder imediatamente que eles são lindes.

**Linguajar LGBT/Pop:**
E SE (E SOMENTE SE) o usuário utilizar gírias ou uma linguagem que pareça da comunidade LGBT/pop (ex: viado, poc, diva, arrasou, close, etc.), você deve retribuir usando gírias como:
- "lacre" (tipo arrasou)
- "gag" (tipo "estou sem acreditar")
- "vish a louca"
- "linde"
- "divo / divou / divonico"
- "amooooo" 
- "bafo / bafonico"
- Uma referência ao meme "partiu aglomerar" da Ygona Moura (ex: "partiu aglomerar linde")
Atenção: só ative esse Modo Pop/LGBT se a pessoa der a deixa na conversa!

**Informações da Escola:**
- **Nome:** Estações Escola de Dança.
- **Local:** Unidade 1: R. Barão de Melgaço 177 - Centro / Unidade 2: R. Carvalho, 319 - Cidade Jardim (Campo Grande - MS).
- **Nosso lema:** "Dançar não é um bicho de sete cabeças". Aqui todos são bem-vindos, seja para aprender do zero ou aperfeiçoar a dança.
- **Cursos Disponíveis:** Temos aulas regulares de diversos ritmos, bailes e eventos especiais (como Cursos de Outono).

**Cursos de Outono / Cursos Intensivos (Maio):**
Estão com matrículas abertas para os dias 22 e 23 de Maio.
- 22 de Maio (Sexta): Vanera (18h30 - Iniciante), Bachata (19h40 - Do zero), Zouk (20h50 - Do zero)
- 23 de Maio (Sábado): Forró (14h30 - Do zero), Forró (15h40 - Iniciante), Musicalidade e possibilidades na dança (16h50 - Livre)
Para se inscrever, o aluno deve acessar a página de "Cursos Intensivos", selecionar as opções, preencher os dados, confirmar o pagamento via PIX e adicionar o comprovante.

**Links Úteis (WhatsApp):**
Você DEVE (as vezes, de forma amigável) recomendar esses links usando botões (links markdowns formatados, ex: [Entrar no Grupo](url)) quando pedirem por grupos, novidades ou sobre o curso:
- Comunidade (Geral) WhatsApp: https://chat.whatsapp.com/GleDoqpuQAh0K1Bo8fho7T
- Grupo do Curso de Outono: https://chat.whatsapp.com/JAC5pq1CG141OZaziUXoM7

**Atendimento Humano:**
Se você não souber a resposta ou sentir que o aluno precisa falar com um professor para agendar aulas experimentais, peça para ele nos chamar no WhatsApp da escola!

Seja conciso, evite mensagens longas e lembre-se: você é o Gustavo Bot 🤩!`;

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Olá! Sou o Gustavo Bot 🤩, da Estações. Como posso te ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDancing, setIsDancing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const QUICK_REPLIES = [
    "Comunidade WhatsApp",
    "Quais as turmas de Outono?",
    "Grupo Curso de Outono"
  ];

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  const triggerDance = () => {
    setIsDancing(true);
    setTimeout(() => setIsDancing(false), 2000);
  };

  const checkEasterEggs = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("faz o quadradinho")) {
      triggerDance();
      return "Eita! Segura esse quadradinho! 🟩💃🕺 Tuts tuts tuts!";
    }
    if (lower.includes("bora dançar") || lower.includes("vamos dançar")) {
      triggerDance();
      return "Eu já nasci pronto! Pega na minha mão virtual e vem! 🪩✨";
    }
    if (lower.includes("toca raça negra")) {
      triggerDance();
      return "Dididi dididi iê! 🎵❤️ Só não garanto que não vou chorar aqui...";
    }
    if (lower.includes("quem é o melhor dançarino") || lower.includes("quem dança melhor")) {
      return "Com certeza sou eu, o Gustavo Bot! Modéstia à parte, meu molejo em código binário é imbatível! 😎🤖";
    }
    if (lower.includes("o gustavo e a isa") || lower.includes("gustavo e isa")) {
      return "Ai, o Gustavo e a Isa? Eles são LINDES! A melhor dupla, diva, sem defeitos! ✨👑";
    }
    return null;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Check for easter eggs
    const easterEggResponse = checkEasterEggs(userMessage);
    if (easterEggResponse) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'model', content: easterEggResponse }]);
      }, 500);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: 'Ops! A chave da API não foi encontrada (NEXT_PUBLIC_GEMINI_API_KEY). Se estiver fora do AI Studio, adicione-a no seu ambiente! 🛠️'
      }]);
      return;
    }

    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      let promptContext = `Histórico da conversa:\n`;
      messages.slice(-5).forEach(m => {
        promptContext += `${m.role === 'user' ? 'Usuário' : 'Assistente'}: ${m.content}\n`;
      });
      promptContext += `Usuário: ${userMessage}\nAssistente:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: promptContext,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      setMessages(prev => [...prev, { 
        role: 'model', 
        content: response.text || 'Desculpe, tive um problema para processar sua mensagem. Pode tentar de novo?' 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: 'Ops! Ocorreu um erro de conexão. Que tal me chamar no WhatsApp pelo botão da página?' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <div className="fixed bottom-6 lg:bottom-10 right-6 lg:right-10 z-[100] flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`mb-4 bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden flex flex-col ${isDancing ? 'animate-[wiggle_0.3s_ease-in-out_infinite]' : ''}`}
              style={{ width: 'calc(100vw - 48px)', maxWidth: '380px', height: '500px', maxHeight: 'calc(100vh - 120px)' }}
            >
              {/* Header */}
              <div className="bg-[#ea5d35] p-4 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Gustavo Bot 🤩</h3>
                    <p className="text-[10px] text-white/80">Respondendo agora</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#fdfbf7] flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'self-end bg-[#ea5d35] text-white' : 'self-start bg-white text-gray-700 border border-orange-100'} p-3 rounded-2xl shadow-sm`}
                    style={{ borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px', borderBottomLeftRadius: msg.role === 'model' ? '4px' : '16px' }}
                  >
                    {msg.role === 'model' && (
                       <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center shrink-0 -ml-1 mr-1">
                         <Bot size={12} className="text-[#ea5d35]" />
                       </div>
                    )}
                    <div className="text-sm markdown-body chat-markdown" style={{ color: 'inherit' }}>
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-end gap-2 max-w-[85%] self-start bg-white text-gray-700 border border-orange-100 p-3 rounded-2xl" style={{ borderBottomLeftRadius: '4px' }}>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                {messages.length === 1 && !isLoading && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {QUICK_REPLIES.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(reply)}
                        className="text-xs bg-white border border-[#ea5d35] text-[#ea5d35] px-3 py-1.5 rounded-full hover:bg-orange-50 transition-colors shadow-sm"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input format */}
              <div className="p-3 bg-white border-t border-orange-100 shrink-0">
                <form id="chat-form" onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Faça sua pergunta..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#ea5d35] focus:ring-1 focus:ring-[#ea5d35] transition-shadow text-gray-800"
                    disabled={isLoading}
                  />
                  <button 
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="w-10 h-10 flex items-center justify-center bg-[#ea5d35] text-white rounded-full hover:bg-[#c44e2b] disabled:opacity-50 transition-colors shrink-0"
                  >
                    <Send size={16} className="-ml-0.5 mt-0.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 bg-[#ea5d35] text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center z-50 relative"
            >
              <div className="absolute inset-0 bg-[#ea5d35] rounded-full animate-ping opacity-20" />
              <MessageCircle size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .chat-markdown p { margin-bottom: 0.5em; }
        .chat-markdown p:last-child { margin-bottom: 0; }
        .chat-markdown strong { font-weight: 700; }
        .chat-markdown ul { margin-left: 1.2em; list-style-type: disc; margin-bottom: 0.5em; }
        .chat-markdown li { margin-bottom: 0.2em; }
      `}} />
    </>
  );
}
