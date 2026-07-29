export default function CursosIntensivos() {
    return /*#__PURE__*/ _jsxs("main", {
        className: "min-h-screen bg-orange-50 relative",
        children: [
            /*#__PURE__*/ _jsx(Header, {}),
            /*#__PURE__*/ _jsxs("section", {
                className: "relative min-h-[90vh] flex flex-col items-center justify-center bg-[#120400] text-orange-50 overflow-hidden",
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        className: "absolute inset-0 z-0",
                        children: /*#__PURE__*/ _jsx(Image, {
                            src: "https://lh3.googleusercontent.com/d/1URzYQjUA6RL0bn783UvqPyQ2txodm-kB",
                            alt: "Curso de Inverno - Esta\xe7\xf5es",
                            fill: true,
                            className: "object-cover",
                            priority: true,
                            unoptimized: true
                        })
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "absolute inset-0 bg-black/60 pointer-events-none"
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "absolute inset-0 bg-gradient-to-t from-[#120400] via-black/40 to-transparent pointer-events-none"
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "max-w-4xl w-full mx-auto text-center relative z-10 px-6 py-16 flex flex-col items-center justify-center h-full",
                        children: [
                            /*#__PURE__*/ _jsxs("h1", {
                                className: "text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-white leading-tight mt-8",
                                children: [
                                    "Curso de Inverno:",
                                    /*#__PURE__*/ _jsx("br", {
                                        className: "hidden md:block"
                                    }),
                                    " 1\xaa Edi\xe7\xe3o"
                                ]
                            }),
                            /*#__PURE__*/ _jsx("p", {
                                className: "text-xl md:text-2xl text-[#fcd34d] font-bold max-w-2xl mx-auto mb-10",
                                children: "Dias 23, 24 e 25 de Julho. Venha aquecer o inverno dan\xe7ando com a gente!"
                            }),
                            /*#__PURE__*/ _jsx(Countdown, {}),
                            /*#__PURE__*/ _jsx("button", {
                                onClick: ()=>{
                                    var _document_getElementById;
                                    return (_document_getElementById = document.getElementById('matricula')) === null || _document_getElementById === void 0 ? void 0 : _document_getElementById.scrollIntoView({
                                        behavior: 'smooth'
                                    });
                                },
                                className: "bg-[#fbbf24] text-[#682c0b] px-8 py-5 rounded-xl font-bold tracking-widest hover:bg-[#f59e0b] shadow-xl transition-all duration-300 w-full md:w-auto mt-4 text-lg md:text-xl uppercase",
                                children: "GARANTIR MINHA VAGA"
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "absolute bottom-0 left-0 w-full z-20",
                        children: /*#__PURE__*/ _jsx(WaveDivider, {
                            position: "bottom",
                            colorClass: "fill-orange-50"
                        })
                    })
                ]
            }),
            /*#__PURE__*/ _jsx(motion.section, {
                initial: {
                    opacity: 0,
                    y: 50
                },
                whileInView: {
                    opacity: 1,
                    y: 0
                },
                viewport: {
                    once: true,
                    margin: "-100px"
                },
                transition: {
                    duration: 0.6
                },
                className: "relative py-16 px-6 bg-orange-50",
                children: /*#__PURE__*/ _jsxs("div", {
                    className: "max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center",
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            className: "space-y-6 text-left order-1",
                            children: [
                                /*#__PURE__*/ _jsxs("h2", {
                                    className: "text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#682c0b] leading-tight mb-4 shrink-0",
                                    children: [
                                        "Mais do que passos:",
                                        /*#__PURE__*/ _jsx("br", {}),
                                        " confian\xe7a e movimento",
                                        /*#__PURE__*/ _jsx("br", {}),
                                        " para todos."
                                    ]
                                }),
                                /*#__PURE__*/ _jsx("p", {
                                    className: "text-[#645c58] text-lg md:text-xl leading-relaxed font-medium shrink-0",
                                    children: "Acreditamos que a dan\xe7a n\xe3o deve ser dif\xedcil; o passo mais desafiador \xe9 simplesmente vir praticar."
                                }),
                                /*#__PURE__*/ _jsx("p", {
                                    className: "text-[#645c58] text-lg md:text-xl leading-relaxed font-medium shrink-0",
                                    children: "Nosso ambiente \xe9 pensado para que ningu\xe9m fique de fora: acolhemos quem nunca dan\xe7ou com seguran\xe7a e desafiamos quem j\xe1 dan\xe7a a evoluir."
                                }),
                                /*#__PURE__*/ _jsx("blockquote", {
                                    className: "bg-[#fcf8f2] border-l-[4px] border-orange-600 p-4 text-orange-700 font-medium italic text-lg md:text-xl rounded-r-lg shadow-sm my-4 shrink-0",
                                    children: '"Priorizamos o movimento sobre a teoria e a divers\xe3o sobre a rigidez."'
                                }),
                                /*#__PURE__*/ _jsx("p", {
                                    className: "text-[#645c58] text-base leading-relaxed font-medium",
                                    children: "Queremos que cada aluno saia daqui se sentindo capaz, leve e parte de uma comunidade vibrante. Para n\xf3s, quando a experi\xeancia \xe9 prazerosa e o ambiente \xe9 acolhedor, aprender acontece naturalmente."
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            className: "relative h-[300px] md:h-[600px] w-full mb-8 md:mb-0 block order-2",
                            children: [
                                /*#__PURE__*/ _jsx("div", {
                                    className: "absolute top-4 -right-4 md:top-8 md:-right-8 w-full h-[80%] bg-[#e8a32a] rounded-[40px] md:rounded-[60px]"
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "relative h-[80%] w-full rounded-[40px] md:rounded-[60px] overflow-hidden border-4 border-orange-50 bg-gray-200",
                                    children: /*#__PURE__*/ _jsx(Image, {
                                        src: "https://i.ibb.co/5XDbwVrd/Screenshot-20260129-194726-Instagram-2.jpg",
                                        alt: "Turma Esta\xe7\xf5es",
                                        fill: true,
                                        loading: "lazy",
                                        className: "object-cover",
                                        unoptimized: true
                                    })
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ _jsx(motion.section, {
                initial: {
                    opacity: 0,
                    y: 50
                },
                whileInView: {
                    opacity: 1,
                    y: 0
                },
                viewport: {
                    once: true,
                    margin: "-100px"
                },
                transition: {
                    duration: 0.6
                },
                className: "relative py-16 px-6 bg-orange-50/50",
                children: /*#__PURE__*/ _jsxs("div", {
                    className: "max-w-6xl mx-auto",
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            className: "text-center shrink-0",
                            children: [
                                /*#__PURE__*/ _jsx("h2", {
                                    className: "text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#682c0b] mb-4",
                                    children: "Cronograma do Evento"
                                }),
                                /*#__PURE__*/ _jsxs("p", {
                                    className: "text-lg md:text-xl text-[#645c58] font-medium max-w-2xl mx-auto flex items-center justify-center gap-2",
                                    children: [
                                        /*#__PURE__*/ _jsx(Sparkles, {
                                            className: "text-[#e8a32a] fill-[#e8a32a]",
                                            size: 24
                                        }),
                                        "No Teatro do Mundo, 3 dias incr\xedveis para aquecer o inverno dan\xe7ando!",
                                        /*#__PURE__*/ _jsx(Sparkles, {
                                            className: "text-[#e8a32a] fill-[#e8a32a]",
                                            size: 24
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            className: "relative max-w-4xl mx-auto mt-8 md:mt-12 space-y-6 md:space-y-8 relative z-10",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "bg-orange-50/80 rounded-2xl md:rounded-[32px] p-5 md:p-8 shadow-sm border border-orange-100",
                                    children: [
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "flex items-center gap-4 mb-5 border-b border-orange-200/50 pb-4",
                                            children: [
                                                /*#__PURE__*/ _jsxs("div", {
                                                    className: "bg-[#682c0b] text-white px-4 py-2 rounded-xl text-center shrink-0 shadow-sm",
                                                    children: [
                                                        /*#__PURE__*/ _jsx("span", {
                                                            className: "block text-2xl font-display font-bold leading-none",
                                                            children: "23"
                                                        }),
                                                        /*#__PURE__*/ _jsx("span", {
                                                            className: "block text-[10px] uppercase tracking-wider font-bold mt-1 text-orange-200",
                                                            children: "JUL"
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsxs("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsx("h3", {
                                                            className: "text-xl md:text-2xl font-display font-bold text-[#682c0b]",
                                                            children: "Quinta-feira"
                                                        }),
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "text-orange-700 text-sm hidden md:block",
                                                            children: "In\xedcio do intensivo"
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4",
                                            children: [
                                                /*#__PURE__*/ _jsxs("button", {
                                                    onClick: ()=>{
                                                        var _document_getElementById;
                                                        return (_document_getElementById = document.getElementById('matricula')) === null || _document_getElementById === void 0 ? void 0 : _document_getElementById.scrollIntoView({
                                                            behavior: 'smooth'
                                                        });
                                                    },
                                                    className: "flex flex-col text-left bg-white rounded-xl p-4 shadow-sm border border-orange-100 cursor-pointer hover:border-orange-300 hover:-translate-y-1 transition-all group",
                                                    children: [
                                                        /*#__PURE__*/ _jsxs("div", {
                                                            className: "flex justify-between items-start mb-2",
                                                            children: [
                                                                /*#__PURE__*/ _jsxs("div", {
                                                                    className: "flex items-center gap-1.5 text-orange-600 text-xs font-bold",
                                                                    children: [
                                                                        /*#__PURE__*/ _jsx(Clock, {
                                                                            size: 14
                                                                        }),
                                                                        /*#__PURE__*/ _jsx("span", {
                                                                            children: "18:40 \xe0s 20:00"
                                                                        })
                                                                    ]
                                                                }),
                                                                /*#__PURE__*/ _jsx("span", {
                                                                    className: "inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded uppercase tracking-wider",
                                                                    children: "Do Zero"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ _jsx("h4", {
                                                            className: "text-base md:text-lg font-bold text-[#682c0b] group-hover:text-orange-700 transition-colors",
                                                            children: "Zouk Brasileiro"
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsxs("button", {
                                                    onClick: ()=>{
                                                        var _document_getElementById;
                                                        return (_document_getElementById = document.getElementById('matricula')) === null || _document_getElementById === void 0 ? void 0 : _document_getElementById.scrollIntoView({
                                                            behavior: 'smooth'
                                                        });
                                                    },
                                                    className: "flex flex-col text-left bg-white rounded-xl p-4 shadow-sm border border-orange-100 cursor-pointer hover:border-orange-300 hover:-translate-y-1 transition-all group",
                                                    children: [
                                                        /*#__PURE__*/ _jsxs("div", {
                                                            className: "flex justify-between items-start mb-2",
                                                            children: [
                                                                /*#__PURE__*/ _jsxs("div", {
                                                                    className: "flex items-center gap-1.5 text-orange-600 text-xs font-bold",
                                                                    children: [
                                                                        /*#__PURE__*/ _jsx(Clock, {
                                                                            size: 14
                                                                        }),
                                                                        /*#__PURE__*/ _jsx("span", {
                                                                            children: "20:20 \xe0s 21:40"
                                                                        })
                                                                    ]
                                                                }),
                                                                /*#__PURE__*/ _jsx("span", {
                                                                    className: "inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded uppercase tracking-wider",
                                                                    children: "Do Zero"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ _jsx("h4", {
                                                            className: "text-base md:text-lg font-bold text-[#682c0b] group-hover:text-orange-700 transition-colors",
                                                            children: "Bachata Brasileira"
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "bg-orange-50/80 rounded-2xl md:rounded-[32px] p-5 md:p-8 shadow-sm border border-orange-100",
                                    children: [
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "flex items-center gap-4 mb-5 border-b border-orange-200/50 pb-4",
                                            children: [
                                                /*#__PURE__*/ _jsxs("div", {
                                                    className: "bg-[#682c0b] text-white px-4 py-2 rounded-xl text-center shrink-0 shadow-sm",
                                                    children: [
                                                        /*#__PURE__*/ _jsx("span", {
                                                            className: "block text-2xl font-display font-bold leading-none",
                                                            children: "24"
                                                        }),
                                                        /*#__PURE__*/ _jsx("span", {
                                                            className: "block text-[10px] uppercase tracking-wider font-bold mt-1 text-orange-200",
                                                            children: "JUL"
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsxs("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsx("h3", {
                                                            className: "text-xl md:text-2xl font-display font-bold text-[#682c0b]",
                                                            children: "Sexta-feira"
                                                        }),
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "text-orange-700 text-sm hidden md:block",
                                                            children: "Noite do Forr\xf3"
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4",
                                            children: [
                                                /*#__PURE__*/ _jsxs("button", {
                                                    onClick: ()=>{
                                                        var _document_getElementById;
                                                        return (_document_getElementById = document.getElementById('matricula')) === null || _document_getElementById === void 0 ? void 0 : _document_getElementById.scrollIntoView({
                                                            behavior: 'smooth'
                                                        });
                                                    },
                                                    className: "flex flex-col text-left bg-white rounded-xl p-4 shadow-sm border border-orange-100 cursor-pointer hover:border-orange-300 hover:-translate-y-1 transition-all group",
                                                    children: [
                                                        /*#__PURE__*/ _jsxs("div", {
                                                            className: "flex justify-between items-start mb-2",
                                                            children: [
                                                                /*#__PURE__*/ _jsxs("div", {
                                                                    className: "flex items-center gap-1.5 text-orange-600 text-xs font-bold",
                                                                    children: [
                                                                        /*#__PURE__*/ _jsx(Clock, {
                                                                            size: 14
                                                                        }),
                                                                        /*#__PURE__*/ _jsx("span", {
                                                                            children: "18:40 \xe0s 20:00"
                                                                        })
                                                                    ]
                                                                }),
                                                                /*#__PURE__*/ _jsx("span", {
                                                                    className: "inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded uppercase tracking-wider",
                                                                    children: "Do Zero"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ _jsx("h4", {
                                                            className: "text-base md:text-lg font-bold text-[#682c0b] group-hover:text-orange-700 transition-colors",
                                                            children: "Forr\xf3"
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsxs("button", {
                                                    onClick: ()=>{
                                                        var _document_getElementById;
                                                        return (_document_getElementById = document.getElementById('matricula')) === null || _document_getElementById === void 0 ? void 0 : _document_getElementById.scrollIntoView({
                                                            behavior: 'smooth'
                                                        });
                                                    },
                                                    className: "flex flex-col text-left bg-white rounded-xl p-4 shadow-sm border border-orange-100 cursor-pointer hover:border-orange-300 hover:-translate-y-1 transition-all group",
                                                    children: [
                                                        /*#__PURE__*/ _jsxs("div", {
                                                            className: "flex justify-between items-start mb-2",
                                                            children: [
                                                                /*#__PURE__*/ _jsxs("div", {
                                                                    className: "flex items-center gap-1.5 text-orange-600 text-xs font-bold",
                                                                    children: [
                                                                        /*#__PURE__*/ _jsx(Clock, {
                                                                            size: 14
                                                                        }),
                                                                        /*#__PURE__*/ _jsx("span", {
                                                                            children: "20:20 \xe0s 21:40"
                                                                        })
                                                                    ]
                                                                }),
                                                                /*#__PURE__*/ _jsx("span", {
                                                                    className: "inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded uppercase tracking-wider",
                                                                    children: "Do Zero"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ _jsx("h4", {
                                                            className: "text-base md:text-lg font-bold text-[#682c0b] group-hover:text-orange-700 transition-colors",
                                                            children: "Forr\xf3 Eletr\xf4nico"
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "bg-orange-50/80 rounded-2xl md:rounded-[32px] p-5 md:p-8 shadow-sm border border-orange-100",
                                    children: [
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "flex items-center gap-4 mb-5 border-b border-orange-200/50 pb-4",
                                            children: [
                                                /*#__PURE__*/ _jsxs("div", {
                                                    className: "bg-[#682c0b] text-white px-4 py-2 rounded-xl text-center shrink-0 shadow-sm",
                                                    children: [
                                                        /*#__PURE__*/ _jsx("span", {
                                                            className: "block text-2xl font-display font-bold leading-none",
                                                            children: "25"
                                                        }),
                                                        /*#__PURE__*/ _jsx("span", {
                                                            className: "block text-[10px] uppercase tracking-wider font-bold mt-1 text-orange-200",
                                                            children: "JUL"
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsxs("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsx("h3", {
                                                            className: "text-xl md:text-2xl font-display font-bold text-[#682c0b]",
                                                            children: "S\xe1bado"
                                                        }),
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "text-orange-700 text-sm hidden md:block",
                                                            children: "Encerramento e Baile"
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4",
                                            children: [
                                                /*#__PURE__*/ _jsxs("button", {
                                                    onClick: ()=>{
                                                        var _document_getElementById;
                                                        return (_document_getElementById = document.getElementById('matricula')) === null || _document_getElementById === void 0 ? void 0 : _document_getElementById.scrollIntoView({
                                                            behavior: 'smooth'
                                                        });
                                                    },
                                                    className: "flex flex-col text-left bg-white rounded-xl p-4 shadow-sm border border-orange-100 cursor-pointer hover:border-orange-300 hover:-translate-y-1 transition-all group",
                                                    children: [
                                                        /*#__PURE__*/ _jsxs("div", {
                                                            className: "flex justify-between items-start mb-2",
                                                            children: [
                                                                /*#__PURE__*/ _jsxs("div", {
                                                                    className: "flex items-center gap-1.5 text-orange-600 text-xs font-bold",
                                                                    children: [
                                                                        /*#__PURE__*/ _jsx(Clock, {
                                                                            size: 14
                                                                        }),
                                                                        /*#__PURE__*/ _jsx("span", {
                                                                            children: "14:40 \xe0s 16:00"
                                                                        })
                                                                    ]
                                                                }),
                                                                /*#__PURE__*/ _jsx("span", {
                                                                    className: "inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded uppercase tracking-wider",
                                                                    children: "Do Zero"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ _jsx("h4", {
                                                            className: "text-base md:text-lg font-bold text-[#682c0b] group-hover:text-orange-700 transition-colors",
                                                            children: "Samba de Gafieira"
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsxs("button", {
                                                    onClick: ()=>{
                                                        var _document_getElementById;
                                                        return (_document_getElementById = document.getElementById('matricula')) === null || _document_getElementById === void 0 ? void 0 : _document_getElementById.scrollIntoView({
                                                            behavior: 'smooth'
                                                        });
                                                    },
                                                    className: "flex flex-col text-left bg-white rounded-xl p-4 shadow-sm border border-orange-100 cursor-pointer hover:border-orange-300 hover:-translate-y-1 transition-all group",
                                                    children: [
                                                        /*#__PURE__*/ _jsxs("div", {
                                                            className: "flex justify-between items-start mb-2",
                                                            children: [
                                                                /*#__PURE__*/ _jsxs("div", {
                                                                    className: "flex items-center gap-1.5 text-orange-600 text-xs font-bold",
                                                                    children: [
                                                                        /*#__PURE__*/ _jsx(Clock, {
                                                                            size: 14
                                                                        }),
                                                                        /*#__PURE__*/ _jsx("span", {
                                                                            children: "16:20 \xe0s 17:40"
                                                                        })
                                                                    ]
                                                                }),
                                                                /*#__PURE__*/ _jsx("span", {
                                                                    className: "inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded uppercase tracking-wider",
                                                                    children: "Intermedi\xe1rio"
                                                                })
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ _jsx("h4", {
                                                            className: "text-base md:text-lg font-bold text-[#682c0b] group-hover:text-orange-700 transition-colors",
                                                            children: "Forr\xf3"
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsxs("div", {
                                                    className: "flex flex-col text-left bg-orange-600/10 rounded-xl p-4 shadow-sm border border-orange-200 relative overflow-hidden sm:col-span-2 lg:col-span-1",
                                                    children: [
                                                        /*#__PURE__*/ _jsxs("div", {
                                                            className: "absolute top-2 right-2 bg-orange-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-widest flex items-center gap-1 z-10",
                                                            children: [
                                                                /*#__PURE__*/ _jsx(Music, {
                                                                    size: 10,
                                                                    className: "fill-white"
                                                                }),
                                                                "Aberto ao P\xfablico"
                                                            ]
                                                        }),
                                                        /*#__PURE__*/ _jsxs("div", {
                                                            className: "relative z-10 mt-4 md:mt-0",
                                                            children: [
                                                                /*#__PURE__*/ _jsxs("div", {
                                                                    className: "flex items-center gap-1.5 text-orange-800 text-xs font-bold mb-1",
                                                                    children: [
                                                                        /*#__PURE__*/ _jsx(Clock, {
                                                                            size: 14
                                                                        }),
                                                                        /*#__PURE__*/ _jsx("span", {
                                                                            children: "Das 19:00 \xe0s 00:00"
                                                                        })
                                                                    ]
                                                                }),
                                                                /*#__PURE__*/ _jsx("h4", {
                                                                    className: "text-base font-bold text-[#682c0b] mb-1",
                                                                    children: "Baile Edi\xe7\xe3o Julina"
                                                                }),
                                                                /*#__PURE__*/ _jsx("p", {
                                                                    className: "text-xs text-orange-800 font-medium leading-snug",
                                                                    children: "Com feira de festa julina na parte de fora!"
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ _jsxs("section", {
                className: "relative py-16 w-full bg-orange-600",
                children: [
                    /*#__PURE__*/ _jsx("svg", {
                        viewBox: "0 0 1440 100",
                        className: "absolute top-0 left-0 w-full h-[4vh] md:h-[4vh] -translate-y-[99%] text-orange-600 fill-current preserve-3d",
                        preserveAspectRatio: "none",
                        children: /*#__PURE__*/ _jsx("path", {
                            d: "M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z"
                        })
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "max-w-6xl mx-auto",
                        children: [
                            /*#__PURE__*/ _jsxs("div", {
                                className: "text-center mb-12 shrink-0",
                                children: [
                                    /*#__PURE__*/ _jsx("h2", {
                                        className: "text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 uppercase tracking-wide",
                                        children: "Festa, Arte e Liberdade"
                                    }),
                                    /*#__PURE__*/ _jsx("p", {
                                        className: "text-lg md:text-xl text-orange-100 font-medium max-w-2xl mx-auto",
                                        children: "Mergulhe na folia criativa e no aprendizado divertido."
                                    }),
                                    /*#__PURE__*/ _jsx("p", {
                                        className: "text-orange-200 text-xs mt-3 font-bold uppercase tracking-widest animate-pulse",
                                        children: "Arraste para os lados para ver mais"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsx(FestaCarousel, {})
                        ]
                    }),
                    /*#__PURE__*/ _jsx("svg", {
                        viewBox: "0 0 1440 100",
                        className: "absolute bottom-0 left-0 w-full h-[4vh] md:h-[4vh] translate-y-[99%] text-orange-600 fill-current preserve-3d",
                        preserveAspectRatio: "none",
                        children: /*#__PURE__*/ _jsx("path", {
                            d: "M0,0 L1440,0 L1440,50 Q1080,0 720,50 T0,50 Z"
                        })
                    })
                ]
            }),
            /*#__PURE__*/ _jsx(motion.section, {
                initial: {
                    opacity: 0,
                    y: 50
                },
                whileInView: {
                    opacity: 1,
                    y: 0
                },
                viewport: {
                    once: true,
                    margin: "-100px"
                },
                transition: {
                    duration: 0.6
                },
                className: "relative py-16 px-6 bg-orange-50/50",
                children: /*#__PURE__*/ _jsxs("div", {
                    className: "max-w-6xl mx-auto",
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            className: "text-center shrink-0",
                            children: [
                                /*#__PURE__*/ _jsx("h2", {
                                    className: "text-4xl md:text-5xl font-display font-bold text-[#682c0b] mb-4",
                                    children: "Espa\xe7o do evento"
                                }),
                                /*#__PURE__*/ _jsx("p", {
                                    className: "text-lg md:text-xl text-[#645c58] font-medium max-w-2xl mx-auto",
                                    children: "F\xe1cil de chegar, imposs\xedvel de n\xe3o se apaixonar."
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            className: "grid md:grid-cols-2 gap-8 mt-12",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "bg-white rounded-3xl shadow-lg border border-orange-100 p-8 flex flex-col",
                                    children: [
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "flex items-center gap-4 mb-4 shrink-0",
                                            children: [
                                                /*#__PURE__*/ _jsx("div", {
                                                    className: "w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shrink-0",
                                                    children: /*#__PURE__*/ _jsx(MapPin, {
                                                        className: "text-white w-6 h-6"
                                                    })
                                                }),
                                                /*#__PURE__*/ _jsxs("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsx("h3", {
                                                            className: "text-2xl font-display font-bold text-[#682c0b]",
                                                            children: "Localiza\xe7\xe3o"
                                                        }),
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "text-gray-500 font-bold tracking-widest uppercase text-[9px]",
                                                            children: "Unidade 1 - Centro"
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "flex items-start gap-3 mb-3 shrink-0",
                                            children: [
                                                /*#__PURE__*/ _jsx("div", {
                                                    className: "mt-1",
                                                    children: /*#__PURE__*/ _jsx(MapPin, {
                                                        size: 16,
                                                        className: "text-[#d97706]"
                                                    })
                                                }),
                                                /*#__PURE__*/ _jsx("div", {
                                                    children: /*#__PURE__*/ _jsx("p", {
                                                        className: "text-sm text-[#645c58] font-medium",
                                                        children: "Rua Bar\xe3o de Melga\xe7o, 177"
                                                    })
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsx("div", {
                                            className: "flex-1 rounded-2xl overflow-hidden shadow-inner border border-gray-100 mb-4 min-h-[150px] relative",
                                            children: /*#__PURE__*/ _jsx("iframe", {
                                                src: "https://maps.google.com/maps?q=Rua%20Bar%C3%A3o%20de%20Melga%C3%A7o%2C%20177%2C%20Campo%20Grande%20-%20MS&t=&z=15&ie=UTF8&iwloc=&output=embed",
                                                width: "100%",
                                                height: "100%",
                                                style: {
                                                    border: 0
                                                },
                                                allowFullScreen: true,
                                                loading: "lazy",
                                                referrerPolicy: "no-referrer-when-downgrade",
                                                className: "absolute inset-0"
                                            })
                                        }),
                                        /*#__PURE__*/ _jsxs("a", {
                                            href: "https://maps.google.com/?q=Rua+Barao+de+Melgaco,+177,+Campo+Grande+-+MS",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-[#c45424] transition-colors flex justify-center items-center gap-2 shrink-0 text-sm",
                                            children: [
                                                /*#__PURE__*/ _jsx(MapPin, {
                                                    size: 18
                                                }),
                                                " TRA\xc7AR ROTA"
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "bg-white rounded-3xl shadow-lg border border-orange-100 p-8 flex flex-col",
                                    children: [
                                        /*#__PURE__*/ _jsx("h3", {
                                            className: "text-2xl font-display font-bold text-[#682c0b] mb-6",
                                            children: "Tira D\xfavidas"
                                        }),
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "space-y-6 flex-1",
                                            children: [
                                                /*#__PURE__*/ _jsxs("div", {
                                                    className: "relative pl-4 border-l-2 border-orange-600/30",
                                                    children: [
                                                        /*#__PURE__*/ _jsx("div", {
                                                            className: "absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-orange-600"
                                                        }),
                                                        /*#__PURE__*/ _jsx("h4", {
                                                            className: "text-orange-700 font-bold mb-1 text-sm",
                                                            children: "Preciso saber dan\xe7ar?"
                                                        }),
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "text-gray-500 text-xs shadow-none",
                                                            children: "N\xe3o. O curso \xe9 para iniciantes e experi\xeantes."
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsxs("div", {
                                                    className: "relative pl-4 border-l-2 border-orange-600/30",
                                                    children: [
                                                        /*#__PURE__*/ _jsx("div", {
                                                            className: "absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-orange-600"
                                                        }),
                                                        /*#__PURE__*/ _jsx("h4", {
                                                            className: "text-orange-700 font-bold mb-1 text-sm",
                                                            children: "Preciso levar parceiro(a)?"
                                                        }),
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "text-gray-500 text-xs",
                                                            children: "N\xe3o precisa. Pode vir sozinho(a)."
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsxs("div", {
                                                    className: "relative pl-4 border-l-2 border-orange-600/30",
                                                    children: [
                                                        /*#__PURE__*/ _jsx("div", {
                                                            className: "absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-orange-600"
                                                        }),
                                                        /*#__PURE__*/ _jsx("h4", {
                                                            className: "text-orange-700 font-bold mb-1 text-sm",
                                                            children: "As aulas s\xe3o dif\xedceis?"
                                                        }),
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "text-gray-500 text-xs",
                                                            children: "N\xe3o. S\xe3o divertidas e respeitam seu tempo."
                                                        })
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsxs("div", {
                                                    className: "relative pl-4 border-l-2 border-orange-600/30",
                                                    children: [
                                                        /*#__PURE__*/ _jsx("div", {
                                                            className: "absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-orange-600"
                                                        }),
                                                        /*#__PURE__*/ _jsx("h4", {
                                                            className: "text-orange-700 font-bold mb-1 text-sm",
                                                            children: "Que roupa usar?"
                                                        }),
                                                        /*#__PURE__*/ _jsx("p", {
                                                            className: "text-gray-500 text-xs",
                                                            children: "Roupas confort\xe1veis que n\xe3o limitem o movimento."
                                                        })
                                                    ]
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsx("div", {
                                            className: "mt-4 pt-4 border-t border-gray-100 flex flex-col items-center shrink-0",
                                            children: /*#__PURE__*/ _jsx("a", {
                                                href: "https://wa.me/5567992630948?text=Ol%C3%A1%21%20Tenho%20uma%20d%C3%BAvida%20sobre%20os%20Cursos%20Intensivos.",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "px-6 py-2 rounded-full border-2 border-green-200 text-green-600 font-bold hover:bg-green-50 transition-colors text-sm",
                                                children: "Falar no WhatsApp"
                                            })
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ _jsxs("section", {
                id: "matricula",
                className: "relative py-16 px-6 bg-[#3d1c04]",
                children: [
                    /*#__PURE__*/ _jsx(WaveDivider, {
                        position: "top",
                        colorClass: "fill-[#3d1c04]"
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "max-w-6xl mx-auto relative z-10",
                        children: /*#__PURE__*/ _jsx("div", {
                            className: "w-full bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-sm",
                            children: /*#__PURE__*/ _jsx(BookingFlow, {})
                        })
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("section", {
                className: "relative py-16 px-6 bg-[#fffdf0]",
                children: /*#__PURE__*/ _jsxs("div", {
                    className: "max-w-6xl mx-auto",
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            className: "text-center mb-12 shrink-0",
                            children: [
                                /*#__PURE__*/ _jsx("h2", {
                                    className: "text-4xl md:text-5xl font-display font-bold text-[#682c0b] mb-4",
                                    children: "O que dizem os alunos"
                                }),
                                /*#__PURE__*/ _jsx("p", {
                                    className: "text-orange-950/60 text-xs mt-3 font-bold uppercase tracking-widest animate-pulse",
                                    children: "Arraste para os lados para ler mais"
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsx(TestimonialCarousel, {})
                    ]
                })
            }),
            /*#__PURE__*/ _jsx(Footer, {})
        ]
    });
}
