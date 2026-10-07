import React from 'react';
import { RecipeSuggestion } from '../types';
import { Clock, Flame, ChevronRight, CheckCircle2, Sparkles, Utensils } from 'lucide-react';
import freshBowlImg from '../assets/images/mediterranean_fresh_bowl_1791287640317.jpg';
import panDishImg from '../assets/images/mediterranean_pan_dish_1791287653082.jpg';

interface RecipeSuggestionsListProps {
  suggestions: RecipeSuggestion[];
  nutritionalAdvice: string;
  onSelectRecipe: (suggestion: RecipeSuggestion) => void;
  isLoadingDetail: boolean;
  selectedRecipeId: string | null;
}

export const RecipeSuggestionsList: React.FC<RecipeSuggestionsListProps> = ({
  suggestions,
  nutritionalAdvice,
  onSelectRecipe,
  isLoadingDetail,
  selectedRecipeId,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-6 pt-4">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EADBCC] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E76F51] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sugerencias de Gemini 3.8 Flash</span>
          </div>
          <h2 className="font-serif text-3xl font-semibold text-[#2C2825] tracking-tight">
            Platos disponibles con tus ingredientes
          </h2>
          <p className="text-sm text-[#7A6F62] mt-1">
            Escoge el plato que más te apetezca para descubrir su elaboración paso a paso, ilustraciones y macronutrientes.
          </p>
        </div>
        <div className="text-xs text-[#8C7A6B] bg-[#FAF0E6] px-3.5 py-1.5 rounded-full border border-[#F0D5C0] font-medium self-start sm:self-auto">
          {suggestions.length} opciones saludables encontradas
        </div>
      </div>

      {/* Warm Mediterranean Nutritionist Advice Card */}
      {nutritionalAdvice && (
        <div className="p-4 sm:p-5 bg-[#FAF7F2] border border-[#EADBCC] rounded-2xl flex items-start gap-3.5 text-[#5C5245]">
          <div className="w-9 h-9 rounded-xl bg-[#2A9D8F]/15 flex items-center justify-center shrink-0 text-[#2A9D8F] mt-0.5">
            <Utensils className="w-5 h-5" />
          </div>
          <div className="text-sm space-y-1">
            <span className="font-semibold text-[#2C2825] block">
              Consejo de nutrición mediterránea para tus alimentos:
            </span>
            <p className="text-[#695D4F] leading-relaxed">{nutritionalAdvice}</p>
          </div>
        </div>
      )}

      {/* Grid of Available Dishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((dish, index) => {
          const isSelected = selectedRecipeId === dish.id && isLoadingDetail;
          const isFresh = dish.category.toLowerCase().includes('ensalada') || index % 2 === 0;
          const fallbackImg = isFresh ? freshBowlImg : panDishImg;

          return (
            <div
              key={dish.id}
              onClick={() => !isLoadingDetail && onSelectRecipe(dish)}
              className={`group bg-white rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#E76F51] ring-2 ring-[#E76F51]/30 shadow-md'
                  : 'border-[#EADBCC] hover:border-[#E76F51]/50 hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              <div>
                {/* Visual Header / Thumbnail */}
                <div className="relative h-44 overflow-hidden bg-[#F4ECE1]">
                  <img
                    src={fallbackImg}
                    alt={dish.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Category Chip & Time */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-semibold text-[#2C2825]">
                      {dish.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-center gap-4 text-xs font-medium text-white/90">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-300" />
                        {dish.prepTimeMinutes} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        ~{dish.caloriesEstimate} kcal
                      </span>
                      <span>· {dish.difficulty}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#2C2825] group-hover:text-[#E76F51] transition-colors">
                      {dish.title}
                    </h3>
                    <p className="text-sm text-[#7A6F62] mt-1 line-clamp-2">
                      {dish.tagline}
                    </p>
                  </div>

                  {/* Health Highlight */}
                  <div className="p-3 bg-[#FBF8F3] rounded-xl border border-[#EADBCC]/80 flex items-start gap-2 text-xs text-[#5C5245]">
                    <CheckCircle2 className="w-4 h-4 text-[#2A9D8F] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#2C2825] font-semibold">Beneficio saludable: </strong>
                      <span>{dish.healthHighlight}</span>
                    </div>
                  </div>

                  {/* Ingredients Used */}
                  <div>
                    <span className="text-xs font-medium text-[#8C7A6B] block mb-1.5">
                      Tus ingredientes aprovechados:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dish.mainIngredientsUsed.map((ing, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-[#FAF0E6] text-[#783D2D] text-xs rounded-md font-medium"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 sm:px-6 bg-[#FAF7F2] border-t border-[#EADBCC] flex items-center justify-between">
                <span className="text-xs text-[#7A6F62] italic">
                  {dish.flavorProfile}
                </span>

                <button
                  type="button"
                  disabled={isLoadingDetail}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#E76F51] group-hover:text-[#D45D40] transition-colors cursor-pointer"
                >
                  {isSelected ? (
                    <span className="flex items-center gap-2 text-[#E76F51]">
                      <div className="w-4 h-4 border-2 border-[#E76F51]/30 border-t-[#E76F51] rounded-full animate-spin" />
                      Preparando receta...
                    </span>
                  ) : (
                    <>
                      <span>Cocinar este plato</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
