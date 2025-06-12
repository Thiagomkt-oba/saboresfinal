import React from 'react';
import CountdownTimer from './CountdownTimer';
import { ShoppingCart, ArrowDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeroProps {
  onCheckout: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCheckout }) => {
  const { totalPrice, totalOriginalPrice } = useCart();
  const [selectedImage, setSelectedImage] = React.useState(0);
  
  const images = [
    'https://i.imgur.com/PaTOyu4.jpg',
    'https://i.imgur.com/qvKOkAE.jpg',
    'https://i.imgur.com/pMX10xg.jpg',
    'https://i.imgur.com/47gors6.jpg'
  ];

  const savings = totalOriginalPrice - totalPrice;

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-[#F7F3EF]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="aspect-square mb-4">
                  <img
                    src={images[selectedImage]}
                    alt="Manteiga Tradicional"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square border-2 rounded-lg overflow-hidden ${
                        selectedImage === index ? 'border-[#9B6647]' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="inline-block px-3 py-1 bg-[#9B6647] text-white text-sm rounded-full mb-4">
                Oferta Limitada
              </div>
              
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#9B6647] mb-3">
                Conjunto 3 Manteigas Tradicionais Premium
              </h1>
              
              <p className="text-lg text-[#9B6647] mb-6">
                Sabor genuíno da tradição mineira, preparado com leite fresco e receita familiar
              </p>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <CountdownTimer />
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl text-gray-400 line-through">R${totalOriginalPrice.toFixed(2)}</span>
                    <span className="text-4xl font-bold text-[#9B6647]">R${totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-green-600 font-semibold">Desconto de R${savings.toFixed(2)}</p>
                  <p className="text-gray-600">ou 12x de R${(totalPrice / 12).toFixed(2)} sem juros</p>
                </div>
              </div>
              
              <button
                onClick={onCheckout}
                className="bg-[#9B6647] hover:bg-[#825539] text-white text-xl font-bold py-4 px-8 rounded-full transition-colors text-center mb-4 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-6 h-6" />
                COMPRAR AGORA
              </button>
              
              <button
                onClick={scrollToProducts}
                className="bg-white hover:bg-gray-50 text-[#9B6647] border-2 border-[#9B6647] text-lg font-bold py-3 px-8 rounded-full transition-colors text-center flex items-center justify-center gap-2"
              >
                <ArrowDown className="w-5 h-5" />
                VER MAIS PRODUTOS
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;