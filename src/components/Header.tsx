import React from 'react';
import { Heart, Sparkles, BookOpen, UtensilsCrossed } from 'lucide-react';
import saladIconImg from '../assets/images/salad_app_icon_1791287608900.jpg';

interface HeaderProps {
  onOpenFavorites: () => void;
  favoritesCount: number;
  onOpenGuide: () => void;
  onResetToHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenFavorites,
  favoritesCount,
  onOpenGuide,
  onResetToHome,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EADFCF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Lockup */}
        <button
          onClick={onResetToHome}
          className="flex items-center gap-3.5 group text-left cursor-pointer focus:outline-none"
          title="MediterraneanFood IA - Inicio"
        >
          {/* Salad Icon */}
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-[#E3D1BE] bg-white flex items-center justify-center transition-transform group-hover:scale-105">
            <img
              src={saladIconImg}
              alt="MediterraneanFood IA Ensalada Fresca"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Inline SVG fallback if image cannot load
                const target = e.currentTarget;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('svg')) {
                  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                  svg.setAttribute('viewBox', '0 0 24 24');
                  svg.setAttribute('class', 'w-7 h-7 text-[#2A9D8F]');
                  svg.innerHTML = `
                    <path fill="#588157" d="M12 2C8 2 4 6 4 10c0 4 8 12 8 12s8-8 8-12c0-4-4-8-8-8z"/>
                    <circle cx="12" cy="9" r="3" fill="#E76F51"/>
                  `;
                  parent.appendChild(svg);
                }
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#2C2825] group-hover:text-[#E76F51] transition-colors">
                MediterraneanFood <span className="text-[#E76F51] font-sans font-semibold text-lg">IA</span>
              </span>
            </div>
            <p className="text-xs text-[#7A6F62] hidden sm:block">
              Cocina saludable y alegre con los alimentos de tu hogar
            </p>
          </div>
        </button>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#5C5245] hover:text-[#2C2825] hover:bg-[#F2ECE0] rounded-xl transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#2A9D8F]" />
            <span className="hidden md:inline">Filosofía Mediterránea</span>
            <span className="md:hidden">Guía</span>
          </button>

          <button
            onClick={onOpenFavorites}
            className="relative flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#5C5245] hover:text-[#2C2825] hover:bg-[#F2ECE0] rounded-xl transition-all cursor-pointer"
            title="Ver recetas guardadas"
          >
            <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'text-[#E76F51] fill-[#E76F51]' : 'text-[#7A6F62]'}`} />
            <span className="hidden sm:inline">Favoritos</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs font-semibold text-white bg-[#E76F51] rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-[#E2D5C3] text-xs text-[#7A6F62]">
            <Sparkles className="w-3.5 h-3.5 text-[#E76F51]" />
            <span>Impulsado por <strong className="text-[#2C2825] font-semibold">Gemini 3.8 Flash</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
};
