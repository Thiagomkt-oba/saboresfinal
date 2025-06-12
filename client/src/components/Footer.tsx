import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-amber-900 text-amber-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif font-bold mb-2">Sabores de Minas</h2>
          <p className="text-amber-200">
            Produtos tradicionais direto da roça mineira para sua mesa.
          </p>
          <p className="text-amber-200">
            Entrega assegurada, qualidade comprovada e sabor acolhedor.
          </p>
        </div>
        
        <div className="border-t border-amber-700 pt-6 mt-6 text-center text-sm text-amber-300">
          <p>© 2025 Sabores de Minas. Todos os direitos reservados.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;