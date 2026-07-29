export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [mounted, setMounted] = useState(false);
    process.env.__NEXT_PRIVATE_MINIMIZE_MACRO_FALSE && useEffect(()=>{
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        // Data alvo: 23 de julho de 2026 às 18:40
        const targetDate = new Date('2026-07-23T18:40:00-04:00').getTime();
        const updateCountdown = ()=>{
            const now = new Date().getTime();
            const difference = targetDate - now;
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor(difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
                    minutes: Math.floor(difference % (1000 * 60 * 60) / (1000 * 60)),
                    seconds: Math.floor(difference % (1000 * 60) / 1000)
                });
            } else {
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                });
            }
        };
        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return ()=>clearInterval(timer);
    }, []);
    if (!mounted) return null;
    const handleAddToCalendar = ()=>{
        const event = {
            title: 'Curso de Inverno Estações (Julino)',
            details: 'Não perca o curso intensivo focado em dança para aquecer seu inverno!',
            location: 'Estações Escola de Dança',
            dates: '20260723T224000Z/20260724T014000Z'
        };
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}&dates=${event.dates}`;
        window.open(googleCalendarUrl, '_blank');
    };
    return /*#__PURE__*/ _jsxs("div", {
        className: "flex flex-col items-center justify-center w-full z-10 my-8",
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: "flex items-center gap-2 mb-6",
                children: [
                    /*#__PURE__*/ _jsx(ClockIcon, {
                        className: "w-5 h-5 text-orange-200"
                    }),
                    /*#__PURE__*/ _jsx("span", {
                        className: "text-orange-200 font-bold tracking-widest uppercase text-sm md:text-base",
                        children: "COME\xc7A EM"
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "flex gap-3 md:gap-4 mb-8",
                children: [
                    {
                        value: timeLeft.days,
                        label: 'DIAS'
                    },
                    {
                        value: timeLeft.hours,
                        label: 'HORAS'
                    },
                    {
                        value: timeLeft.minutes,
                        label: 'MIN'
                    },
                    {
                        value: timeLeft.seconds,
                        label: 'SEG'
                    }
                ].map((unit, idx)=>/*#__PURE__*/ _jsxs("div", {
                        className: "flex flex-col items-center",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "bg-orange-700 text-white rounded-2xl md:rounded-3xl w-16 h-20 md:w-20 md:h-24 flex items-center justify-center shadow-lg border border-orange-600 mb-3",
                                children: /*#__PURE__*/ _jsx("span", {
                                    className: "text-3xl md:text-4xl font-display font-bold",
                                    children: unit.value.toString().padStart(2, '0')
                                })
                            }),
                            /*#__PURE__*/ _jsx("span", {
                                className: "text-[10px] md:text-xs uppercase font-bold tracking-widest text-orange-300",
                                children: unit.label
                            })
                        ]
                    }, idx))
            }),
            /*#__PURE__*/ _jsxs("button", {
                onClick: handleAddToCalendar,
                className: "flex items-center gap-2 border border-white/20 hover:bg-white/10 text-orange-100 px-6 py-3 rounded-full text-sm font-medium transition-colors",
                children: [
                    /*#__PURE__*/ _jsx(Calendar, {
                        size: 18,
                        className: "text-orange-200"
                    }),
                    "Adicionar na Agenda do Google"
                ]
            })
        ]
    });
}
