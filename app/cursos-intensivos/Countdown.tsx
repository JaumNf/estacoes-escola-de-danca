'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Data alvo: 21 de junho de 2026 às 14:00
    const targetDate = new Date('2026-06-21T14:00:00-03:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const handleAddToCalendar = () => {
    const event = {
      title: 'Curso de Outono Estações (Namorados)',
      details: 'Não perca o curso intensivo focado em forró!',
      location: 'Escola de Dança Estações',
      dates: '20260621T170000Z/20260621T200000Z'
    };
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}&dates=${event.dates}`;
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full z-10 my-8">
      <div className="flex items-center gap-2 mb-6">
        <ClockIcon className="w-5 h-5 text-pink-200" />
        <span className="text-pink-200 font-bold tracking-widest uppercase text-sm md:text-base">COMEÇA EM</span>
      </div>
      
      <div className="flex gap-3 md:gap-4 mb-8">
        {[
          { value: timeLeft.days, label: 'DIAS' },
          { value: timeLeft.hours, label: 'HORAS' },
          { value: timeLeft.minutes, label: 'MIN' },
          { value: timeLeft.seconds, label: 'SEG' },
        ].map((unit, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="bg-rose-700 text-white rounded-2xl md:rounded-3xl w-16 h-20 md:w-20 md:h-24 flex items-center justify-center shadow-lg border border-rose-600 mb-3">
              <span className="text-3xl md:text-4xl font-display font-bold">
                {unit.value.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] md:text-xs uppercase font-bold tracking-widest text-rose-300">{unit.label}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={handleAddToCalendar}
        className="flex items-center gap-2 border border-white/20 hover:bg-white/10 text-rose-100 px-6 py-3 rounded-full text-sm font-medium transition-colors"
      >
        <Calendar size={18} className="text-pink-200" />
        Adicionar na Agenda do Google
      </button>
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
