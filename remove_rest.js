const fs = require('fs');

function fixFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Remove handleFileChange definition
  const hfcRegex = /const handleFileChange = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?};\n/g;
  content = content.replace(hfcRegex, '');
  
  // Also remove the "anexe o comprovante de pagamento" from the alert
  content = content.replace(/e anexe o comprovante de pagamento\./g, '.');

  // Re-write the UI block to erase the Upload HTML but keep the form structure
  const uiRegex = /\{\/\* Comprovante Upload \*\/\}[\s\S]*?(?=<\/form>)/;
  content = content.replace(uiRegex, '');

  fs.writeFileSync(path, content, 'utf8');
}

fixFile('app/cursos-intensivos/BookingFlow.tsx');
