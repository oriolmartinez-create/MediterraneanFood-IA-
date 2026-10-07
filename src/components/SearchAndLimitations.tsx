import React, { useState } from 'react';
import {
  Search,
  Plus,
  X,
  ShieldAlert,
  Sparkles,
  SlidersHorizontal,
  Leaf,
  Check,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

interface SearchAndLimitationsProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAllergens: string[];
  setSelectedAllergens: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPreferences: string[];
  setSelectedPreferences: React.Dispatch<React.SetStateAction<string[]>>;
  customNotes: string;
  setCustomNotes: (notes: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const COMMON_MEDITERRANEAN_STAPLES = [
  'Tomates',
  'Aceite de oliva virgen extra',
  'Ajo',
  'Cebolla',
  'Garbanzos',
  'Pepino',
  'Huevos',
  'Espinacas',
  'Limón',
  'Atún',
  'Pimientos',
  'Calabacín',
  'Orégano',
  'Lentejas',
  'Queso feta',
  'Arroz',
];

const COMMON_ALLERGENS = [
  'Gluten',
  'Lactosa / Lácteos',
  'Frutos secos',
  'Pescado / Marisco',
  'Huevo',
  'Soja',
  'Sésamo',
  'Mostaza',
];

const COMMON_PREFERENCES = [
  'Vegetariano',
  'Vegano',
  'Bajo en carbohidratos',
  'Sin sal añadida',
  'Hipocalórico / Ligero',
  'Alto en proteína',
];

export const SearchAndLimitations: React.FC<SearchAndLimitationsProps> = ({
  ingredients,
  setIngredients,
  selectedAllergens,
  setSelectedAllergens,
  selectedPreferences,
  setSelectedPreferences,
  customNotes,
  setCustomNotes,
  onSearch,
  isLoading,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [customAllergen, setCustomAllergen] = useState('');
  const [showAddAllergen, setShowAddAllergen] = useState(false);

  const handleAddIngredient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Allow multiple ingredients separated by commas
    const parts = trimmed
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const next = [...ingredients];
    parts.forEach((item) => {
      const lower = item.toLowerCase();
      if (!next.some((existing) => existing.toLowerCase() === lower)) {
        next.push(item);
      }
    });

    setIngredients(next);
    setInputValue('');
  };

  const handleRemoveIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, idx) => idx !== indexToRemove));
  };

  const handleTogglePantryItem = (item: string) => {
    const exists = ingredients.some((ing) => ing.toLowerCase() === item.toLowerCase());
    if (exists) {
      setIngredients(ingredients.filter((ing) => ing.toLowerCase() !== item.toLowerCase()));
    } else {
      setIngredients([...ingredients, item]);
    }
  };

  const handleToggleAllergen = (allergen: string) => {
    if (selectedAllergens.includes(allergen)) {
      setSelectedAllergens(selectedAllergens.filter((a) => a !== allergen));
    } else {
      setSelectedAllergens([...selectedAllergens, allergen]);
    }
  };

  const handleAddCustomAllergen = (e: React.FormEvent) => {
    e.preventDefault();
    const val = customAllergen.trim();
    if (val && !selectedAllergens.includes(val)) {
      setSelectedAllergens([...selectedAllergens, val]);
      setCustomAllergen('');
      setShowAddAllergen(false);
    }
  };

  const handleTogglePreference = (pref: string) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleClearAll = () => {
    setIngredients([]);
    setSelectedAllergens([]);
    setSelectedPreferences([]);
    setCustomNotes('');
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EADBCC] shadow-sm overflow-hidden transition-all">
      {/* Upper Banner Accent */}
      <div className="bg-gradient-to-r from-[#F4A261]/15 via-[#E76F51]/10 to-[#2A9D8F]/15 px-6 sm:px-8 py-4 border-b border-[#EADBCC] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-[#8D4B38]">
          <Leaf className="w-5 h-5 text-[#2A9D8F]" />
          <span className="text-sm font-semibold tracking-wide">
            Recetas basadas exclusivamente en tus alimentos disponibles
          </span>
        </div>

        {ingredients.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-xs text-[#8C7A6B] hover:text-[#E76F51] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer todo</span>
          </button>
        )}
      </div>

      {/* Grid: Left = Ingredient Search, Right = Limitations & Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#EADBCC]">
        {/* LEFT COLUMN: Buscador de alimentos (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
          <div>
            <label
              htmlFor="ingredient-input"
              className="block font-serif text-2xl font-semibold text-[#2C2825] tracking-tight mb-1"
            >
              Introduce los alimentos con los que cuentas
            </label>
            <p className="text-sm text-[#7A6F62] leading-relaxed">
              Escribe los ingredientes frescos o de despensa que tienes a mano. MediterraneanFood IA
              diseñará platos saludables usando <span className="font-medium text-[#2C2825]">únicamente</span> lo que tengas.
            </p>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleAddIngredient} className="relative">
            <div className="flex items-center gap-2 p-1.5 bg-[#FAF7F2] border-2 border-[#E5D7C7] focus-within:border-[#E76F51] focus-within:ring-2 focus-within:ring-[#E76F51]/20 rounded-2xl transition-all">
              <div className="pl-3 text-[#A89A89]">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="ingredient-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ej. Tomates, calabacín, garbanzos, queso, aceite..."
                className="w-full py-2.5 px-2 bg-transparent text-sm sm:text-base text-[#2C2825] placeholder-[#9E9080] focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-2.5 bg-[#E76F51] hover:bg-[#D45D40] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir</span>
              </button>
            </div>
            <p className="mt-1.5 text-xs text-[#9E9080]">
              Consejo: Puedes separar varios ingredientes con comas (ej. <em>pepino, aceitunas, limón</em>).
            </p>
          </form>

          {/* Active Ingredients List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7A6F62]">
                Tus Alimentos Seleccionados ({ingredients.length})
              </span>
              {ingredients.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIngredients([])}
                  className="text-xs text-[#A89A89] hover:text-[#E76F51] transition-colors cursor-pointer"
                >
                  Vaciar cesta
                </button>
              )}
            </div>

            {ingredients.length === 0 ? (
              <div className="p-5 border border-dashed border-[#DECEBC] rounded-2xl bg-[#FDFBF7] text-center">
                <p className="text-sm text-[#8C7A6B]">
                  Aún no has añadido alimentos. Escríbelos arriba o pulsa los ingredientes habituales a continuación.
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ing, idx) => (
                  <span
                    key={`${ing}-${idx}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF0E6] text-[#783D2D] border border-[#F0D5C0] rounded-xl text-sm font-medium animate-fadeIn"
                  >
                    <span>{ing}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-0.5 hover:bg-[#E8C2A8] text-[#8D4B38] rounded-full transition-colors cursor-pointer"
                      title={`Eliminar ${ing}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Mediterranean Quick Staples Selector */}
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#7A6F62] mb-2">
              Ingredientes frecuentes de la huerta y despensa mediterránea:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_MEDITERRANEAN_STAPLES.map((staple) => {
                const isSelected = ingredients.some(
                  (i) => i.toLowerCase() === staple.toLowerCase()
                );
                return (
                  <button
                    key={staple}
                    type="button"
                    onClick={() => handleTogglePantryItem(staple)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2A9D8F] text-white shadow-xs'
                        : 'bg-[#F4ECE1] text-[#695D4F] hover:bg-[#EADDCF] hover:text-[#2C2825]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {staple}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Limitaciones como alérgenos y preferencias (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#FCFAF7] space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EADBCC]">
            <SlidersHorizontal className="w-4 h-4 text-[#E76F51]" />
            <h3 className="font-serif text-lg font-semibold text-[#2C2825]">
              Limitaciones y Preferencias
            </h3>
          </div>

          {/* Section: Alérgenos a evitar */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7A6F62]">
              <ShieldAlert className="w-3.5 h-3.5 text-[#E76F51]" />
              <span>Alérgenos a excluir</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_ALLERGENS.map((allergen) => {
                const checked = selectedAllergens.includes(allergen);
                return (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => handleToggleAllergen(allergen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                      checked
                        ? 'bg-[#FFEBE5] border-[#F4A261] text-[#A63A24] font-semibold'
                        : 'bg-white border-[#EADBCC] text-[#5C5245] hover:border-[#D6BEA6]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                        checked
                          ? 'bg-[#E76F51] border-[#E76F51] text-white'
                          : 'border-[#D4C3AF] bg-white'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                    <span className="truncate">{allergen}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Allergen Form */}
            {showAddAllergen ? (
              <form onSubmit={handleAddCustomAllergen} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={customAllergen}
                  onChange={(e) => setCustomAllergen(e.target.value)}
                  placeholder="Otro alérgeno (ej. Piñones)..."
                  className="w-full text-xs py-1.5 px-3 bg-white border border-[#EADBCC] rounded-lg focus:outline-none focus:border-[#E76F51]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#E76F51] text-white text-xs font-medium rounded-lg cursor-pointer"
                >
                  OK
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAllergen(false)}
                  className="px-2 py-1.5 text-xs text-[#7A6F62] hover:text-[#2C2825] cursor-pointer"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddAllergen(true)}
                className="text-xs text-[#996245] hover:text-[#E76F51] underline font-medium cursor-pointer pt-0.5"
              >
                + Añadir otro alérgeno específico
              </button>
            )}
          </div>

          {/* Section: Preferencias Personales */}
          <div className="space-y-2.5 pt-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#7A6F62]">
              Preferencias dietéticas y estilo
            </span>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_PREFERENCES.map((pref) => {
                const active = selectedPreferences.includes(pref);
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => handleTogglePreference(pref)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[#EBF7F5] border-[#2A9D8F] text-[#1E6B62] font-semibold'
                        : 'bg-white border-[#EADBCC] text-[#5C5245] hover:border-[#D6BEA6]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                        active
                          ? 'bg-[#2A9D8F] border-[#2A9D8F] text-white'
                          : 'border-[#D4C3AF] bg-white'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                    <span className="truncate">{pref}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Notes */}
          <div className="space-y-1.5 pt-1">
            <label
              htmlFor="custom-notes"
              className="block text-xs font-semibold uppercase tracking-wider text-[#7A6F62]"
            >
              Detalles o notas culinarias
            </label>
            <input
              id="custom-notes"
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Ej. 'Platos rápidos de menos de 15 min' o 'Sin picante'..."
              className="w-full text-xs py-2 px-3 bg-white border border-[#EADBCC] rounded-xl text-[#2C2825] placeholder-[#A69888] focus:outline-none focus:border-[#E76F51]"
            />
          </div>
        </div>
      </div>

      {/* Primary Search Action Bar */}
      <div className="bg-[#FAF7F2] p-6 border-t border-[#EADBCC] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#7A6F62]">
          {ingredients.length === 0 ? (
            <span className="flex items-center gap-1.5 text-[#B25D48]">
              <AlertCircle className="w-4 h-4" />
              Introduce al menos un alimento para que Gemini 3.8 Flash genere tus recetas.
            </span>
          ) : (
            <span className="text-[#5C5245]">
              Listo para buscar con <strong>{ingredients.length}</strong> alimentos y{' '}
              <strong>{selectedAllergens.length + selectedPreferences.length}</strong> preferencias.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onSearch}
          disabled={isLoading || ingredients.length === 0}
          className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base shadow-sm transition-all cursor-pointer ${
            ingredients.length === 0 || isLoading
              ? 'bg-[#E3D7C8] text-[#9E9080] cursor-not-allowed opacity-80'
              : 'bg-gradient-to-r from-[#E76F51] to-[#F4A261] hover:from-[#DF6244] hover:to-[#EB9652] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Consultando a Gemini 3.8 Flash...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5 stroke-[2.5]" />
              <span>Buscar Platos Disponibles</span>
              <Sparkles className="w-4 h-4 text-amber-200" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
