const fs = require('fs');
let content = fs.readFileSync('app/cursos-intensivos/page.tsx', 'utf8');

content = content.replace(/bg-orange-50/g, 'bg-rose-50');
content = content.replace(/border-orange-50/g, 'border-rose-50');
content = content.replace(/text-orange-50/g, 'text-rose-50');
content = content.replace(/fill-orange-50/g, 'fill-rose-50');

content = content.replace(/bg-\[#e45a1c\]/g, 'bg-rose-600');
content = content.replace(/text-\[#e45a1c\]/g, 'text-rose-600');
content = content.replace(/border-\[#e45a1c\]/g, 'border-rose-600');

content = content.replace(/text-orange-100/g, 'text-rose-100');
content = content.replace(/text-orange-200/g, 'text-rose-200');
content = content.replace(/text-orange-950/g, 'text-rose-950');

// Icons and colors
content = content.replace(/text-\[#ea5d35\]/g, 'text-rose-600');
content = content.replace(/bg-\[#fae8d4\]/g, 'bg-rose-100');
content = content.replace(/text-\[#c45424\]/g, 'text-rose-700');

fs.writeFileSync('app/cursos-intensivos/page.tsx', content, 'utf8');
