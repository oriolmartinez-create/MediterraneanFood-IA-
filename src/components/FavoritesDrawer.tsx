import React from 'react';
import { SavedRecipe } from '../types';
import { X, Trash2, ChevronRight, Clock, Flame, Heart } from 'lucide-react';
import freshBowlImg from '../assets/images/mediterranean_fresh_bowl_1791287640317.jpg';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: SavedRecipe[];
  onSelectSavedRecipe: (recipe: SavedRecipe) => void;
  onRemoveFavorite: (id: string) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectSavedRecipe,
  onRemoveFavorite,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/35 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#EADBCC] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#EADBCC] flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-[#E76F51] fill-[#E76F51]" />
              <h3 className="font-serif text-xl font-bold text-[#2C2825]">
                Tus Recetas Favoritas
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#7A6F62] hover:text-[#2C2825] hover:bg-white rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {favorites.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF0E6] text-[#E76F51] flex items-center justify-center mx-auto border border-[#F0D5C0]">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-semibold text-[#2C2825]">
                  No tienes recetas guardadas
                </h4>
                <p className="text-xs text-[#7A6F62] max-w-xs mx-auto">
                  Cuando escojas y visualices un plato saludable, pulsa en "Guardar" para conservarlo en tu recetario personal.
                </p>
              </div>
            ) : (
              favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="group bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#EADBCC] rounded-2xl p-4 flex items-center justify-between gap-3 transition-all"
                >
                  <div
                    onClick={() => {
                      onSelectSavedRecipe(fav);
                      onClose();
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <h5 className="font-serif text-base font-bold text-[#2C2825] group-hover:text-[#E76F51] transition-colors">
                      {fav.title}
                    </h5>
                    <div className="flex items-center gap-3 text-xs text-[#7A6F62] mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {fav.recipeDetail.totalTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {fav.recipeDetail.macronutrientsPerServing.caloriesKcal} kcal
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onRemoveFavorite(fav.id)}
                      className="p-2 text-[#A89A89] hover:text-[#E76F51] transition-colors rounded-lg cursor-pointer"
                      title="Eliminar de favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectSavedRecipe(fav);
                        onClose();
                      }}
                      className="p-2 text-[#E76F51] hover:text-[#D45D40] cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {favorites.length > 0 && (
            <div className="p-4 bg-[#FAF7F2] border-t border-[#EADBCC] text-center text-xs text-[#7A6F62]">
              {favorites.length} {favorites.length === 1 ? 'receta guardada' : 'recetas guardadas'} en tu navegador
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
