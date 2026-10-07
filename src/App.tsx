import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { SearchAndLimitations } from './components/SearchAndLimitations';
import { RecipeSuggestionsList } from './components/RecipeSuggestionsList';
import { RecipeDetailView } from './components/RecipeDetailView';
import { NutritionGuideModal } from './components/NutritionGuideModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { RecipeSuggestion, RecipeDetail, SavedRecipe } from './types';
import {
  Sparkles,
  Heart,
  AlertTriangle,
  RefreshCw,
  Sun,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import bannerImg from './assets/images/mediterranean_banner_1791287623353.jpg';

export default function App() {
  const [ingredients, setIngredients] = useState<string[]>([
    'Tomates',
    'Pepino',
    'Aceite de oliva virgen extra',
    'Queso feta',
    'Orégano',
  ]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(['Vegetariano']);
  const [customNotes, setCustomNotes] = useState<string>('');

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [nutritionalAdvice, setNutritionalAdvice] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);

  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [loadingRecipeId, setLoadingRecipeId] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [favorites, setFavorites] = useState<SavedRecipe[]>(() => {
    try {
      const saved = localStorage.getItem('mediterranean_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // Sync favorites with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mediterranean_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Handle Search for Dishes using Gemini 3.8 Flash
  const handleSearchDishes = async () => {
    if (ingredients.length === 0) return;

    setIsSearching(true);
    setSearchError(null);
    setSelectedRecipe(null);

    try {
      const response = await fetch('/api/suggest-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          allergens: selectedAllergens,
          preferences: selectedPreferences,
          customNotes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status} al consultar recetas.`);
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setNutritionalAdvice(data.nutritionalAdvice || '');

      // Smooth scroll to suggestions
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error('Error buscando platos:', err);
      setSearchError(
        err.message || 'No se pudieron cargar las sugerencias con Gemini 3.8 Flash. Inténtalo de nuevo.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Selecting a Dish: Gemini 3.8 Flash generates full step-by-step & nutrition details
  const handleSelectRecipe = async (dish: RecipeSuggestion) => {
    setIsLoadingDetail(true);
    setLoadingRecipeId(dish.id);
    setDetailError(null);

    try {
      const response = await fetch('/api/recipe-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeTitle: dish.title,
          recipeId: dish.id,
          ingredients,
          allergens: selectedAllergens,
          preferences: selectedPreferences,
          servings: 2,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status} al obtener detalle de la receta.`);
      }

      const detailData: RecipeDetail = await response.json();
      setSelectedRecipe(detailData);

      // Smooth scroll to recipe detail
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: any) {
      console.error('Error cargando detalle de receta:', err);
      setDetailError(
        err.message || 'Error al obtener la receta paso a paso de Gemini 3.8 Flash. Por favor, reintenta.'
      );
    } finally {
      setIsLoadingDetail(false);
      setLoadingRecipeId(null);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = () => {
    if (!selectedRecipe) return;
    const exists = favorites.some((f) => f.title === selectedRecipe.title);
    if (exists) {
      setFavorites(favorites.filter((f) => f.title !== selectedRecipe.title));
    } else {
      const newFav: SavedRecipe = {
        id: Date.now().toString(),
        savedAt: new Date().toLocaleDateString('es-ES'),
        title: selectedRecipe.title,
        recipeDetail: selectedRecipe,
      };
      setFavorites([newFav, ...favorites]);
    }
  };

  const handleSelectSavedRecipe = (saved: SavedRecipe) => {
    setSelectedRecipe(saved.recipeDetail);
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const isCurrentFavorite = selectedRecipe
    ? favorites.some((f) => f.title === selectedRecipe.title)
    : false;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2825] flex flex-col font-sans selection:bg-[#E76F51]/20 selection:text-[#E76F51]">
      {/* Top Bar */}
      <Header
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        favoritesCount={favorites.length}
        onOpenGuide={() => setIsGuideOpen(true)}
        onResetToHome={() => {
          setSelectedRecipe(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Warm Mediterranean Hero Banner */}
        <section className="relative rounded-3xl overflow-hidden border border-[#EADBCC] shadow-sm bg-gradient-to-r from-[#FAF0E6] via-[#FAF7F2] to-[#EAF4F2]">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#EADBCC] text-xs font-semibold text-[#8C4332] shadow-2xs">
                <Sun className="w-3.5 h-3.5 text-[#F4A261]" />
                <span>Alimentación Saludable · Sabores del Mediterráneo</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#2C2825] tracking-tight leading-[1.15]">
                Cocina con calma y alegría usando <span className="text-[#E76F51]">lo que tienes</span>
              </h1>

              <p className="text-base sm:text-lg text-[#6E6356] leading-relaxed max-w-xl">
                Dinos qué alimentos tienes en tu despensa o frigorífico. MediterraneanFood IA y
                <strong> Gemini 3.8 Flash</strong> crearán recetas saludables basadas exclusivamente en tus
                ingredientes, con macronutrientes calculados y procedimientos ilustrados paso a paso.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#7A6F62]">
                <span className="flex items-center gap-1.5 font-medium text-[#2C2825]">
                  <CheckCircle className="w-4 h-4 text-[#2A9D8F]" />
                  Aprovechamiento 100%
                </span>
                <span className="flex items-center gap-1.5 font-medium text-[#2C2825]">
                  <ShieldCheck className="w-4 h-4 text-[#2A9D8F]" />
                  Filtro estricto de alérgenos
                </span>
                <span className="flex items-center gap-1.5 font-medium text-[#2C2825]">
                  <Sparkles className="w-4 h-4 text-[#E76F51]" />
                  Macronutrientes por ración
                </span>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 h-64 lg:h-full min-h-[300px] relative overflow-hidden">
              <img
                src={bannerImg}
                alt="Mesa mediterránea con ingredientes frescos y aceite de oliva"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#FAF7F2]/40 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        {/* Buscador de Alimentos + Panel de Limitaciones a la Derecha */}
        <section id="buscador">
          <SearchAndLimitations
            ingredients={ingredients}
            setIngredients={setIngredients}
            selectedAllergens={selectedAllergens}
            setSelectedAllergens={setSelectedAllergens}
            selectedPreferences={selectedPreferences}
            setSelectedPreferences={setSelectedPreferences}
            customNotes={customNotes}
            setCustomNotes={setCustomNotes}
            onSearch={handleSearchDishes}
            isLoading={isSearching}
          />
        </section>

        {/* Error notification if search fails */}
        {searchError && (
          <div className="p-4 bg-[#FFEFE9] border border-[#FADCD1] rounded-2xl flex items-center justify-between gap-4 text-[#A63A24] text-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{searchError}</span>
            </div>
            <button
              onClick={handleSearchDishes}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E76F51] text-white text-xs font-semibold rounded-xl hover:bg-[#D45D40] transition-colors cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reintentar</span>
            </button>
          </div>
        )}

        {/* Recipe Suggestions List (Platos Disponibles) */}
        <div ref={resultsRef}>
          {suggestions.length > 0 && !selectedRecipe && (
            <section id="platos-disponibles">
              <RecipeSuggestionsList
                suggestions={suggestions}
                nutritionalAdvice={nutritionalAdvice}
                onSelectRecipe={handleSelectRecipe}
                isLoadingDetail={isLoadingDetail}
                selectedRecipeId={loadingRecipeId}
              />
            </section>
          )}
        </div>

        {/* Error notification if recipe detail generation fails */}
        {detailError && (
          <div className="p-4 bg-[#FFEFE9] border border-[#FADCD1] rounded-2xl flex items-center justify-between gap-4 text-[#A63A24] text-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{detailError}</span>
            </div>
            <button
              onClick={() => {
                const current = suggestions.find((s) => s.id === loadingRecipeId);
                if (current) handleSelectRecipe(current);
              }}
              className="px-3 py-1.5 bg-[#E76F51] text-white text-xs font-semibold rounded-xl hover:bg-[#D45D40] transition-colors cursor-pointer shrink-0"
            >
              Reintentar detalle
            </button>
          </div>
        )}

        {/* Recipe Detail View (Solo al escoger un plato) */}
        <div ref={detailRef}>
          {selectedRecipe && (
            <section id="detalle-receta">
              <RecipeDetailView
                recipe={selectedRecipe}
                onBack={() => {
                  setSelectedRecipe(null);
                  resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                isFavorite={isCurrentFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            </section>
          )}
        </div>
      </main>

      {/* Warm Mediterranean Footer */}
      <footer className="border-t border-[#EADBCC] bg-[#FAF7F2] py-10 mt-16 text-sm text-[#7A6F62]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-lg text-[#2C2825]">
              MediterraneanFood IA
            </span>
            <span className="text-xs text-[#8C7A6B]">·</span>
            <span className="text-xs text-[#8C7A6B]">
              Comida sana, bienestar y tranquilidad
            </span>
          </div>

          <div className="text-xs text-[#8C7A6B] flex items-center gap-4">
            <span>Model: Gemini 3.8 Flash</span>
            <span>·</span>
            <span>Estilo de vida saludable</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <NutritionGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectSavedRecipe={handleSelectSavedRecipe}
        onRemoveFavorite={(id) => setFavorites(favorites.filter((f) => f.id !== id))}
      />
    </div>
  );
}
