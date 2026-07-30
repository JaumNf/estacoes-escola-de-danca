const fs = require('fs');
let content = fs.readFileSync('app/cursos-intensivos/BookingFlow.tsx', 'utf8');

// replace orange hexes to rose
content = content.replace(/#ea5d35/g, '#e11d48'); // rose-600
content = content.replace(/#c44e2b/g, '#be123c'); // rose-700
content = content.replace(/#fae8d4/g, '#ffe4e6'); // rose-100

// replace tailwind orange
content = content.replace(/-orange-50/g, '-rose-50');
content = content.replace(/-orange-100/g, '-rose-100');
content = content.replace(/-orange-200/g, '-rose-200');
content = content.replace(/-orange-300/g, '-rose-300');
content = content.replace(/-orange-400/g, '-rose-400');
content = content.replace(/-orange-500/g, '-rose-500');
content = content.replace(/-orange-600/g, '-rose-600');
content = content.replace(/-orange-800/g, '-rose-800');
content = content.replace(/-orange-900/g, '-rose-900');

// "Mais Procurado" tag updates
content = content.replace(/🔥 Mais Procurado/g, '❤️ Vagas de Casal');
content = content.replace(/from-\[#e11d48\] to-\[#be123c\]/g, 'from-rose-500 to-pink-600');

fs.writeFileSync('app/cursos-intensivos/BookingFlow.tsx', content, 'utf8');
