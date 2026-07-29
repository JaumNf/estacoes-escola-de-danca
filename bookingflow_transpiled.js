export default function BookingFlow() {
    const [showPrices, setShowPrices] = useState(false);
    return /*#__PURE__*/ _jsxs("div", {
        id: "matricula",
        className: "max-w-3xl mx-auto my-12 relative px-4 md:px-0",
        children: [
            /*#__PURE__*/ _jsxs(Link, {
                href: "/",
                className: "inline-flex items-center gap-2 mb-6 text-[#a04e22] font-semibold hover:text-[#682c0b] transition-colors group",
                children: [
                    /*#__PURE__*/ _jsx(ArrowLeft, {
                        size: 20,
                        className: "group-hover:-translate-x-1 transition-transform"
                    }),
                    " Voltar para o in\xedcio"
                ]
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "bg-white rounded-[40px] shadow-[0_12px_40px_-15px_rgba(0,0,0,0.1)] border border-black/5 overflow-hidden p-8 md:p-12 text-center",
                children: [
                    /*#__PURE__*/ _jsx("span", {
                        className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fffcf5] text-[#d97706] text-sm font-bold tracking-widest uppercase border border-[#fcd34d] mb-6",
                        children: "✨ Terceiro Lote"
                    }),
                    /*#__PURE__*/ _jsx("h2", {
                        className: "text-4xl md:text-5xl font-display font-bold text-[#3d1c04] mb-4",
                        children: "Garanta seu lugar!"
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        className: "text-[#8c7438] mb-8 text-lg",
                        children: "Fa\xe7a sua inscri\xe7\xe3o direto pelo nosso formul\xe1rio e n\xe3o fique de fora do Curso Intensivo."
                    }),
                    !showPrices ? /*#__PURE__*/ _jsx("div", {
                        className: "mb-10 flex justify-center",
                        children: /*#__PURE__*/ _jsxs("button", {
                            onClick: ()=>setShowPrices(true),
                            className: "inline-flex items-center justify-center gap-2 bg-orange-50 text-orange-700 px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-orange-100 transition-all shadow-sm border border-orange-200",
                            children: [
                                /*#__PURE__*/ _jsx(Tag, {
                                    size: 16
                                }),
                                /*#__PURE__*/ _jsx("span", {
                                    children: "Consultar Valores"
                                })
                            ]
                        })
                    }) : /*#__PURE__*/ _jsxs(motion.div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10 max-w-4xl mx-auto",
                        children: [
                            /*#__PURE__*/ _jsxs("div", {
                                className: "bg-orange-50/50 md:bg-orange-50 border border-orange-100 rounded-[24px] md:rounded-3xl p-5 md:p-8 shadow-sm",
                                children: [
                                    /*#__PURE__*/ _jsx("h3", {
                                        className: "text-xl md:text-2xl font-display font-bold text-[#682c0b] mb-4",
                                        children: "Di\xe1ria"
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "flex justify-between items-center bg-white rounded-xl p-4 mb-3 border border-orange-100",
                                        children: [
                                            /*#__PURE__*/ _jsxs("div", {
                                                className: "flex items-center gap-2 text-gray-700",
                                                children: [
                                                    /*#__PURE__*/ _jsx(User, {
                                                        className: "text-orange-500 w-5 h-5"
                                                    }),
                                                    /*#__PURE__*/ _jsx("span", {
                                                        className: "font-bold",
                                                        children: "Por pessoa"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsx("span", {
                                                className: "text-xl font-display font-bold text-[#682c0b]",
                                                children: "R$ 45"
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "flex justify-between items-center bg-white rounded-xl p-4 border border-orange-100",
                                        children: [
                                            /*#__PURE__*/ _jsxs("div", {
                                                className: "flex items-center gap-2 text-gray-700",
                                                children: [
                                                    /*#__PURE__*/ _jsx(Users, {
                                                        className: "text-orange-500 w-5 h-5"
                                                    }),
                                                    /*#__PURE__*/ _jsx("span", {
                                                        className: "font-bold",
                                                        children: "Por dupla"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsx("span", {
                                                className: "text-xl font-display font-bold text-[#682c0b]",
                                                children: "R$ 65"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "bg-orange-100 md:bg-orange-100/80 border-2 border-orange-300 rounded-[24px] md:rounded-3xl p-5 md:p-8 shadow-md relative",
                                children: [
                                    /*#__PURE__*/ _jsx("div", {
                                        className: "absolute -top-3 right-4 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-widest border border-white",
                                        children: "MAIS VENDIDO"
                                    }),
                                    /*#__PURE__*/ _jsx("h3", {
                                        className: "text-xl md:text-2xl font-display font-bold text-[#682c0b] mb-4",
                                        children: "Pacote 3 Dias"
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "flex justify-between items-center bg-white rounded-xl p-4 mb-3 border border-orange-200",
                                        children: [
                                            /*#__PURE__*/ _jsxs("div", {
                                                className: "flex items-center gap-2 text-gray-700",
                                                children: [
                                                    /*#__PURE__*/ _jsx(User, {
                                                        className: "text-orange-600 w-5 h-5"
                                                    }),
                                                    /*#__PURE__*/ _jsxs("div", {
                                                        className: "flex flex-col text-left",
                                                        children: [
                                                            /*#__PURE__*/ _jsx("span", {
                                                                className: "font-bold leading-tight",
                                                                children: "Por pessoa"
                                                            }),
                                                            /*#__PURE__*/ _jsx("span", {
                                                                className: "text-[10px] font-bold text-orange-600 uppercase tracking-wider",
                                                                children: "+ Baile Incluso"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsx("span", {
                                                className: "text-xl font-display font-bold text-[#682c0b]",
                                                children: "R$ 100"
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "flex justify-between items-center bg-white rounded-xl p-4 border border-orange-200",
                                        children: [
                                            /*#__PURE__*/ _jsxs("div", {
                                                className: "flex items-center gap-2 text-gray-700",
                                                children: [
                                                    /*#__PURE__*/ _jsx(Users, {
                                                        className: "text-orange-600 w-5 h-5"
                                                    }),
                                                    /*#__PURE__*/ _jsxs("div", {
                                                        className: "flex flex-col text-left",
                                                        children: [
                                                            /*#__PURE__*/ _jsx("span", {
                                                                className: "font-bold leading-tight",
                                                                children: "Por dupla"
                                                            }),
                                                            /*#__PURE__*/ _jsx("span", {
                                                                className: "text-[10px] font-bold text-orange-600 uppercase tracking-wider",
                                                                children: "+ Baile Incluso"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsx("span", {
                                                className: "text-xl font-display font-bold text-[#682c0b]",
                                                children: "R$ 150"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "relative inline-block w-full md:w-auto mt-2",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "absolute inset-0 bg-gradient-to-r from-orange-400 to-[#d97706] blur-xl opacity-60 animate-pulse rounded-full"
                            }),
                            /*#__PURE__*/ _jsxs("a", {
                                href: "https://forms.gle/eNrECUruTq2c2US69",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "relative flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-orange-600 to-[#b55d05] text-white px-4 py-4 md:px-12 md:py-6 rounded-full font-bold tracking-wider md:tracking-widest uppercase hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl shadow-orange-900/30 hover:shadow-2xl hover:shadow-orange-700/40 w-full md:w-auto text-base md:text-xl border border-orange-500/50 group",
                                children: [
                                    /*#__PURE__*/ _jsx(Ticket, {
                                        size: 24,
                                        className: "md:w-8 md:h-8 shrink-0 group-hover:-rotate-12 transition-transform duration-300"
                                    }),
                                    /*#__PURE__*/ _jsx("span", {
                                        className: "whitespace-nowrap",
                                        children: "Se inscreva aqui!"
                                    }),
                                    /*#__PURE__*/ _jsx(ArrowRight, {
                                        size: 24,
                                        className: "md:w-8 md:h-8 shrink-0 hidden md:block group-hover:translate-x-2 transition-transform duration-300"
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        className: "text-sm text-gray-400 mt-8 font-medium",
                        children: "As vagas s\xe3o limitadas. Inscreva-se agora para n\xe3o perder sua vaga no lote atual."
                    })
                ]
            })
        ]
    });
}
