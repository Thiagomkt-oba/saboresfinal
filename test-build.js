#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔍 Testando build para Netlify...\n');

// Verificar se arquivos essenciais existem
const requiredFiles = [
  'netlify.toml',
  'vite.config.netlify.ts',
  'client/src/App.tsx',
  'netlify/functions/create-pix-payment.js',
  'netlify/functions/webhook-for4payments.js'
];

console.log('📁 Verificando arquivos essenciais...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANDO!`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n⚠️  Alguns arquivos estão faltando. Deploy pode falhar.');
  process.exit(1);
}

// Testar build
console.log('\n🏗️  Testando build...');
try {
  execSync('npx vite build --config vite.config.netlify.ts --outDir client/dist', { stdio: 'inherit' });
  console.log('✅ Build concluído com sucesso!');
} catch (error) {
  console.log('❌ Erro no build:');
  console.log(error.message);
  process.exit(1);
}

// Verificar se dist foi criado
if (fs.existsSync('client/dist/index.html')) {
  console.log('✅ Arquivos de build criados em client/dist/');
} else {
  console.log('❌ Build não gerou arquivos em client/dist/');
  process.exit(1);
}

console.log('\n🎉 Tudo pronto para deploy no Netlify!');
console.log('📖 Consulte NETLIFY_DEPLOY.md para próximos passos.');