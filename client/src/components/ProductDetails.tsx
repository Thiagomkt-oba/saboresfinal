import React, { useState } from 'react';
import { Gift, Truck, Clock } from 'lucide-react';

interface ProductDetailsProps {
  onCheckout: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ onCheckout }) => {
  const [flavor, setFlavor] = useState<'withSalt' | 'noSalt'>('withSalt');

  return (
    <section id="products\" className="py-12 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Product Info */}
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-900 mb-4">
              Conjunto com 3 Manteigas Tradicionais – Oferta: Pague 1, Receba 3
            </h2>
            
            <div className="bg-white rounded-lg p-6 shadow-md mb-6">
              <h3 className="text-lg font-bold text-amber-800 mb-3">Informações do Produto</h3>
              <p className="text-amber-700 mb-3">Tamanho: 3 Potes de 500g</p>
              
              <div className="mb-6">
                <p className="text-amber-700 mb-2">Sabor disponível:</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setFlavor('withSalt')}
                    className={`px-4 py-2 rounded-md ${
                      flavor === 'withSalt' 
                        ? 'bg-amber-800 text-white' 
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    } transition-colors`}
                  >
                    Com Sal
                  </button>
                  <button 
                    onClick={() => setFlavor('noSalt')}
                    className={`px-4 py-2 rounded-md ${
                      flavor === 'noSalt' 
                        ? 'bg-amber-800 text-white' 
                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    } transition-colors`}
                  >
                    Sem Sal
                  </button>
                </div>
              </div>
              
              <div className="border-t border-amber-200 pt-4 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <Gift className="text-red-600 mt-1 flex-shrink-0" size={20} />
                  <p className="text-amber-700">
                    <span className="font-bold">Brinde especial:</span> adquirindo nos próximos 29 minutos, 
                    você recebe 1 Doce de Abóbora com Coco 400g gratuitamente.
                  </p>
                </div>
              </div>
              
              <div className="border-t border-amber-200 pt-4 mb-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl text-gray-400 line-through">R$218,90</span>
                    <span className="text-4xl font-bold text-red-600">R$69,90</span>
                  </div>
                  <p className="text-green-600 font-bold">Desconto: R$149,00</p>
                  <p className="text-amber-600 text-sm italic">Desconto aplicado automaticamente no carrinho</p>
                </div>
              </div>
              
              <div className="border-t border-amber-200 pt-4 mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <Truck className="text-green-600 mt-1 flex-shrink-0" size={20} />
                  <p className="text-amber-700">
                    <span className="font-bold">Envio gratuito</span> para todo o brasil</p>
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <Clock className="text-amber-600 mt-1 flex-shrink-0" size={20} />
                  <p className="text-amber-700">
                    <span className="font-bold">Receba brinde especial</span> adquirindo nas próximas 29 minutos
                  </p>
                </div>
                <p className="text-amber-700 text-sm ml-8">Produto enviado em embalagem térmica</p>
              </div>
              
              <button 
                onClick={onCheckout}
                className="block w-full bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-4 px-6 rounded-md shadow-lg transition transform hover:scale-105 text-center"
              >
                COMPRAR AGORA
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="aspect-video w-full mb-6">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/IV7lWZoIX4I"
                  title="Vídeo do Produto"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>

              <h3 className="text-lg font-bold text-amber-800 mb-3">Descrição do Produto</h3>
              <p className="text-amber-700 mb-4">
                Produto elaborado em Turvo-MG, seguindo receita tradicional de família.
                Sabor caseiro que desperta memórias afetivas, café no fogão à lenha e carinho familiar.
              </p>
              
              <h4 className="font-bold text-amber-800 mb-2">Características:</h4>
              <ul className="list-disc pl-5 text-amber-700 space-y-2 mb-6">
                <li>Elaborado com leite fresco, sem conservantes</li>
                <li>Perfeito para pão quente, carnes e receitas típicas</li>
                <li>Produto com validade até Outubro de 2025</li>
                <li>Envio com embalagem térmica para manter o frescor</li>
                <li>Envio gratuito para todo o Brasil</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;