import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
}

const Reviews: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  
  const reviews: Review[] = [
    {
      id: 1,
      name: "Vanessa Domingues",
      date: "Fev 2025",
      rating: 5,
      comment: "Excelente produto como tudo que adquiri até hoje no site! Grata!"
    },
    {
      id: 2,
      name: "Dênio Dinís",
      date: "Fev 2025",
      rating: 5,
      comment: "Parabéns a loja pelo bom atendimento e bom preço do produto, amei"
    },
    {
      id: 3,
      name: "Malu Cotrim",
      date: "Fev 2025",
      rating: 5,
      comment: "Perfeito e é idêntico a foto! Amei! Sem dúvidas é uma das melhores compras. Não vão se arrepender meninas! Obrigadaaaaa"
    },
    {
      id: 4,
      name: "Angélica Cunha",
      date: "Fev 2025",
      rating: 5,
      comment: "Recomendada por mim 🥰 😘"
    },
    {
      id: 5,
      name: "Anita Goulart",
      date: "Fev 2025",
      rating: 5,
      comment: "Excelente atendimento, produto de 1ª qualidade e NADA errado ou de surpresas no caminho. Comprarei novamente!"
    },
    {
      id: 6,
      name: "Wilma Crespo",
      date: "Fev 2025",
      rating: 5,
      comment: "Fui prontamente pega pela promoção pra comprar, o processo de envio foi rápido, em 15 dias recebi a mercadoria. Muito bem embalada .."
    }
  ];

  const displayedReviews = expanded ? reviews : reviews.slice(0, 6);
  const totalReviews = 167;
  const averageRating = 4.9;

  const ratingDistribution = [
    { stars: 5, count: 168, percentage: 100.59 },
    { stars: 4, count: 0, percentage: 0 },
    { stars: 3, count: 2, percentage: 1.19 },
    { stars: 2, count: 2, percentage: 1.19 },
    { stars: 1, count: 2, percentage: 1.19 }
  ];

  return (
    <section id="reviews" className="py-12 bg-[#F7F3EF]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#9B6647] mb-8 text-center">
            O que nossos clientes estão dizendo
          </h2>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Rating Summary */}
              <div className="md:w-1/3">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-[#9B6647] mb-2">{averageRating}</div>
                  <div className="flex justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-gray-600">
                    Baseado em {totalReviews} avaliações
                  </div>
                </div>

                <div className="space-y-2">
                  {ratingDistribution.map((rating) => (
                    <div key={rating.stars} className="flex items-center gap-2">
                      <span className="w-16 text-sm text-gray-600">{rating.stars} estrelas</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-yellow-400 rounded-full"
                          style={{ width: `${rating.percentage}%` }}
                        />
                      </div>
                      <span className="w-10 text-sm text-gray-600">{rating.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="md:w-2/3">
                <div className="grid grid-cols-1 gap-4">
                  {displayedReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-[#9B6647]">{review.name}</h4>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => setExpanded(!expanded)}
              className="bg-[#9B6647] hover:bg-[#825539] text-white font-medium py-2 px-6 rounded-full transition-colors"
            >
              {expanded ? 'Ver menos avaliações' : 'Ver mais avaliações'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;