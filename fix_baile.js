const fs = require('fs');

function fixFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Remove state
  content = content.replace(/const \[arquivo, setArquivo\] = useState.*?;\n/g, '');
  content = content.replace(/const \[fileError, setFileError\] = useState.*?;\n/g, '');


  // Remove upload block
  content = content.replace(/let comprovanteUrl = '';\n\s*if \(formaPagamento === 'pix' && arquivo\) {[\s\S]*?comprovanteUrl = await getDownloadURL\(snapshot\.ref\);\n\s*}/g, "let comprovanteUrl = '';");

  // Remove validation
  content = content.replace(/if \(formaPagamento === 'pix' && !arquivo\) \{\n\s*setFileError\('Anexe o comprovante do Pix\.'\);\n\s*hasError = true;\n\s*\}/g, '');
  content = content.replace(/if \(e\.target\.files.*?\) \{\n\s*setArquivo\(e\.target\.files\[0\]\);\n\s*setFileError\(''\);\n\s*\}/g, '');

  const uiRegex = /<div className="pt-2 border-t border-orange-200">[\s\S]*?<label className="text-sm font-bold text-\[#874c2e\] uppercase tracking-wide mb-2 block">Comprovante PIX<\/label>[\s\S]*?<\/div>/;
  content = content.replace(uiRegex, '');

  fs.writeFileSync(path, content, 'utf8');
}

fixFile('app/baile/page.tsx');
