import React from 'react';
import { Shield, Check, Truck, Clock, ShieldCheck } from 'lucide-react';

const Benefits: React.FC = () => {
  return (
    <section className="py-12 bg-amber-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-900 mb-8 text-center">
          Por que escolher a Sabores de Minas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="text-amber-800" size={28} />
            </div>
            <h3 className="text-lg font-bold text-amber-800 mb-2">Loja verificada no Reclame Aqui</h3>
            <p className="text-amber-700">
              Compromisso com a sua satisfação e segurança em todas as aquisições.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Check className="text-green-600" size={28} />
            </div>
            <h3 className="text-lg font-bold text-amber-800 mb-2">Nota RA10 com 100% das entregas</h3>
            <p className="text-amber-700">
              Reconhecimento de qualidade e confiabilidade no mercado brasileiro.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Truck className="text-amber-800" size={28} />
            </div>
            <h3 className="text-lg font-bold text-amber-800 mb-2">Entrega em embalagem térmica</h3>
            <p className="text-amber-700">
              Asseguramos a qualidade e frescor dos produtos até a sua casa.
            </p>
          </div>
        </div>
        
        <div className="mt-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-4 text-center">
              Sobre a Empresa
            </h3>
            
            <p className="text-amber-700 mb-4 text-center">
              A Sabores de Minas é uma empresa 100% brasileira especializada em produtos tradicionais da roça.
              Mais de 10.000 pedidos entregues com qualidade, cuidado e rastreamento.
              Nosso compromisso é com a sua experiência – do sabor à entrega.
            </p>
            
            <div className="bg-amber-100 p-4 rounded-lg">
              <p className="font-bold text-amber-800 text-center">
                Oferta por tempo limitado!<br />
                Promoção válida até 25 de maio de 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;