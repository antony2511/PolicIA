import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePoliceResponse } from '../services/geminiService';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';

export const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Soy el Asistente PolicIA. ¿En qué procedimiento policial o consulta del código puedo apoyarte hoy?',
      timestamp: new Date()
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await generatePoliceResponse(input, history);

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between p-4 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur border-b border-subtle-light dark:border-subtle-dark">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
          <span className="material-symbols-outlined text-gray-900 dark:text-white">arrow_back_ios_new</span>
        </button>
        <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Asistente PolicIA</h1>
            <span className="flex items-center gap-1 text-[10px] text-green-500 font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                En línea
            </span>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
          <span className="material-symbols-outlined text-gray-900 dark:text-white">more_vert</span>
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
              </div>
            )}

            <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-surface-light dark:bg-surface-dark text-gray-800 dark:text-gray-200 rounded-bl-none border border-subtle-light dark:border-subtle-dark'
                }`}
              >
                {msg.role === 'model' ? (
                  <ReactMarkdown 
                    className="prose dark:prose-invert prose-sm max-w-none prose-p:my-1 prose-li:my-0 prose-ul:my-1"
                    components={{
                        ul: ({node, ...props}) => <ul className="list-disc pl-4" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-4" {...props} />
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">
                {msg.role === 'user' ? 'Enviado' : 'Recibido'}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-gray-500 text-sm">person</span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
             <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>
              </div>
             <div className="bg-surface-light dark:bg-surface-dark px-4 py-3 rounded-2xl rounded-bl-none border border-subtle-light dark:border-subtle-dark flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
               <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-3 bg-surface-light dark:bg-surface-dark border-t border-subtle-light dark:border-subtle-dark">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <button className="h-10 w-10 shrink-0 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">add</span>
          </button>
          
          <div className="flex-1 bg-subtle-light dark:bg-subtle-dark rounded-2xl flex items-center min-h-[44px] px-4 py-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu consulta policial..."
              className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm max-h-32 resize-none placeholder-gray-500 text-gray-900 dark:text-white"
              rows={1}
              style={{height: 'auto', minHeight: '24px'}}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
          </div>

          <button 
            onClick={input.trim() ? handleSend : undefined}
            className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-all ${
              input.trim() 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
            }`}
          >
            <span className="material-symbols-outlined">
              {input.trim() ? 'arrow_upward' : 'mic'}
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
};