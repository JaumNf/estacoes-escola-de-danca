const fs = require('fs');

function fixFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Remove state
  content = content.replace(/const \[arquivo, setArquivo\] = useState.*?;\n/g, '');

  // Remove touched
  content = content.replace(/arquivo: false,?\n/g, '');
  content = content.replace(/arquivo: true,?\n/g, '');
  content = content.replace(/arquivo,/g, '');

  // Remove validation
  content = content.replace(/if \(!arquivo\) errs\.arquivo = 'Anexe o comprovante\.';\n/g, '');

  content = content.replace(/let comprovanteUrl = '';\n\s*if \(arquivo\).*?{[\s\S]*?comprovanteUrl = await getDownloadURL\(snapshot\.ref\);\n\s*}/g, "let comprovanteUrl = '';");

  // In app/cursos-intensivos/BookingFlow.tsx
  // Find the exact block to remove for UI
  const uiRegex = /<div className="pt-4 mt-6 border-t border-\[#e8c09a\]">[\s\S]*?<Upload size=\{14\} className="inline mr-1" \/> Comprovante de Pagamento[\s\S]*?<\/div>/;
  content = content.replace(uiRegex, '');

  fs.writeFileSync(path, content, 'utf8');
}

fixFile('app/cursos-intensivos/BookingFlow.tsx');
