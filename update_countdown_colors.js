const fs = require('fs');
let content = fs.readFileSync('app/cursos-intensivos/Countdown.tsx', 'utf8');

content = content.replace(/text-orange-100/g, 'text-rose-100');
content = content.replace(/bg-\[#b34015\]/g, 'bg-rose-700');
content = content.replace(/border-\[#c95328\]/g, 'border-rose-600');
content = content.replace(/text-\[#d88961\]/g, 'text-rose-300');
content = content.replace(/text-\[#fcd34d\]/g, 'text-pink-200');

fs.writeFileSync('app/cursos-intensivos/Countdown.tsx', content, 'utf8');
