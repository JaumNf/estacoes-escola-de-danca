function TestimonialCarousel() {
    const [emblaRef] = useEmblaCarousel({
        loop: true,
        align: 'start'
    }, [
        Autoplay({
            delay: 10000,
            stopOnInteraction: false
        })
    ]);
    const testimonials = [
        {
            img: 'https://i.pravatar.cc/150?img=32',
            name: 'Mariana Silva',
            text: '"Participar do intensivo foi um divisor de águas pra mim! O ambiente é super acolhedor e os professores explicam de um jeito muito didático. Em apenas um fim de semana consegui pegar a base e já dancei no baile. Recomendo muito!"'
        },
        {
            img: 'https://i.pravatar.cc/150?img=33',
            name: 'Carlos Eduardo',
            text: '"Eu achava que nunca ia aprender a dançar, sou muito duro! Mas a didática da Estações me fez soltar e perder a vergonha. A turma era super animada e agora não quero mais parar as aulas. Valeu cada centavo!"'
        },
        {
            img: 'https://i.pravatar.cc/150?img=34',
            name: 'Luciana Marques',
            text: '"Uma experiência fantástica! Consegui aprender vários ritmos e a interagir com muitas pessoas legais. A energia do lugar é surreal, recomendo para qualquer um que quer dar os primeiros passos."'
        }
    ];
    return /*#__PURE__*/ _jsx("div", {
        className: "overflow-hidden cursor-grab active:cursor-grabbing w-full pb-8",
        ref: emblaRef,
        children: /*#__PURE__*/ _jsx("div", {
            className: "flex",
            children: testimonials.map((test, idx)=>/*#__PURE__*/ _jsx("div", {
                    className: "flex-[0_0_90%] md:flex-[0_0_45%] xl:flex-[0_0_33.333333%] min-w-0 pr-6",
                    children: /*#__PURE__*/ _jsxs("div", {
                        className: "bg-white p-8 rounded-[32px] shadow-lg border border-orange-50 hover:-translate-y-2 transition-transform duration-300 flex flex-col gap-6 h-full",
                        children: [
                            /*#__PURE__*/ _jsxs("div", {
                                className: "flex items-center gap-4 shrink-0",
                                children: [
                                    /*#__PURE__*/ _jsx("div", {
                                        className: "w-14 h-14 rounded-full bg-orange-100 overflow-hidden relative",
                                        children: /*#__PURE__*/ _jsx(Image, {
                                            src: test.img,
                                            alt: "Aluno",
                                            fill: true,
                                            loading: "lazy",
                                            className: "object-cover",
                                            unoptimized: true
                                        })
                                    }),
                                    /*#__PURE__*/ _jsx("div", {
                                        children: /*#__PURE__*/ _jsx("h4", {
                                            className: "font-bold text-[#a04e22] text-xl",
                                            children: test.name
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsx("p", {
                                className: "text-[#a04e22] italic leading-relaxed text-lg",
                                children: test.text
                            })
                        ]
                    })
                }, idx))
        })
    });
}
