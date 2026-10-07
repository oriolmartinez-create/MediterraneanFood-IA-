import React, { useState, useEffect } from 'react';
import { RecipeDetail } from '../types';
import {
  ArrowLeft,
  Clock,
  Flame,
  Heart,
  Share2,
  Check,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChefHat,
  Leaf,
  Activity,
  Printer,
  Eye,
  Info,
} from 'lucide-react';
import freshBowlImg from '../assets/images/mediterranean_fresh_bowl_1791287640317.jpg';
import panDishImg from '../assets/images/mediterranean_pan_dish_1791287653082.jpg';
import bannerImg from '../assets/images/mediterranean_banner_1791287623353.jpg';

interface RecipeDetailViewProps {
  recipe: RecipeDetail;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({
  recipe,
  onBack,
  isFavorite,
  onToggleFavorite,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [activeTimerStep, setActiveTimerStep] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);

  // Timer interval handling
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play a gentle notification sound if supported
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        // audio context fallback
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  const handleStartTimer = (stepNumber: number, minutes: number) => {
    setActiveTimerStep(stepNumber);
    setTimerSecondsLeft(minutes * 60);
    setIsTimerRunning(true);
  };

  const handleToggleStepComplete = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const handleToggleIngredientCheck = (name: string) => {
    if (checkedIngredients.includes(name)) {
      setCheckedIngredients(checkedIngredients.filter((i) => i !== name));
    } else {
      setCheckedIngredients([...checkedIngredients, name]);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const macros = recipe.macronutrientsPerServing;
  const totalMacroGrams =
    (macros.proteinGrams || 0) + (macros.carbsGrams || 0) + (macros.healthyFatsGrams || 0);
  const proteinPercent = totalMacroGrams ? Math.round(((macros.proteinGrams || 0) / totalMacroGrams) * 100) : 25;
  const carbsPercent = totalMacroGrams ? Math.round(((macros.carbsGrams || 0) / totalMacroGrams) * 100) : 45;
  const fatsPercent = totalMacroGrams ? Math.round(((macros.healthyFatsGrams || 0) / totalMacroGrams) * 100) : 30;

  // Visual helper per step type
  const getStepBadgeColor = (stepType: string) => {
    switch (stepType) {
      case 'prep':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'cook':
        return 'bg-orange-100 text-orange-900 border-orange-200';
      case 'dress':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'plate':
        return 'bg-rose-100 text-rose-900 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-900 border-stone-200';
    }
  };

  const getStepImage = (stepIndex: number) => {
    if (stepIndex === 0) return freshBowlImg;
    if (stepIndex === 1) return panDishImg;
    return bannerImg;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EADBCC] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-[#8C4332] hover:text-[#2C2825] px-3.5 py-2 rounded-xl bg-white border border-[#EADBCC] hover:bg-[#FAF7F2] transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a los platos sugeridos</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-[#FFEBE5] border-[#F4A261] text-[#A63A24]'
                : 'bg-white border-[#EADBCC] text-[#5C5245] hover:bg-[#FAF7F2]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#E76F51] text-[#E76F51]' : ''}`} />
            <span>{isFavorite ? 'En Favoritos' : 'Guardar'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium bg-white border border-[#EADBCC] text-[#5C5245] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            title="Imprimir receta"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-[#EADBCC] overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Main info (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2A9D8F] mb-2">
                <Leaf className="w-4 h-4" />
                <span>Receta Saludable Generada con Gemini 3.8 Flash</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C2825] tracking-tight leading-tight">
                {recipe.title}
              </h1>
              <p className="text-base sm:text-lg text-[#6E6356] mt-4 leading-relaxed">
                {recipe.summary}
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#EADBCC]">
              <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EADBCC]/70">
                <span className="text-xs text-[#8C7A6B] block">Preparación</span>
                <span className="font-semibold text-sm sm:text-base text-[#2C2825]">
                  {recipe.prepTime}
                </span>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EADBCC]/70">
                <span className="text-xs text-[#8C7A6B] block">Cocción</span>
                <span className="font-semibold text-sm sm:text-base text-[#2C2825]">
                  {recipe.cookTime}
                </span>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EADBCC]/70">
                <span className="text-xs text-[#8C7A6B] block">Tiempo Total</span>
                <span className="font-semibold text-sm sm:text-base text-[#E76F51]">
                  {recipe.totalTime}
                </span>
              </div>
              <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EADBCC]/70">
                <span className="text-xs text-[#8C7A6B] block">Raciones</span>
                <span className="font-semibold text-sm sm:text-base text-[#2C2825]">
                  {recipe.servings} personas
                </span>
              </div>
            </div>
          </div>

          {/* Dish Imagery Showcase (5 cols) */}
          <div className="lg:col-span-5 relative min-h-[280px] bg-[#F4ECE1]">
            <img
              src={freshBowlImg}
              alt={recipe.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/20">
              <span className="font-semibold block text-amber-200">Emplatado mediterráneo</span>
              <span>{recipe.platingAndServingTip}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Macronutrientes por ración & Beneficios Mediterráneos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Macronutrientes Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EADBCC] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EADBCC]">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#E76F51]" />
              <h2 className="font-serif text-2xl font-semibold text-[#2C2825]">
                Macronutrientes por Ración
              </h2>
            </div>
            <span className="text-xs text-[#8C7A6B] bg-[#FAF0E6] px-3 py-1 rounded-full font-medium">
              Valores calculados por ración
            </span>
          </div>

          {/* Calorie & Key Macro Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Calories */}
            <div className="col-span-2 sm:col-span-1 p-4 bg-[#FFEFE9] border border-[#FADCD1] rounded-2xl text-center">
              <span className="text-xs text-[#A63A24] font-semibold block uppercase tracking-wider">
                Calorías
              </span>
              <span className="text-2xl font-bold text-[#E76F51] tabular-nums mt-0.5 block">
                {macros.caloriesKcal}
              </span>
              <span className="text-xs text-[#7A6F62]">kcal</span>
            </div>

            {/* Protein */}
            <div className="p-4 bg-[#F2F8F7] border border-[#D8ECE9] rounded-2xl text-center">
              <span className="text-xs text-[#1E6B62] font-semibold block uppercase tracking-wider">
                Proteínas
              </span>
              <span className="text-2xl font-bold text-[#2A9D8F] tabular-nums mt-0.5 block">
                {macros.proteinGrams}g
              </span>
              <span className="text-xs text-[#7A6F62]">~{proteinPercent}%</span>
            </div>

            {/* Carbs */}
            <div className="p-4 bg-[#FFF9EC] border border-[#FBEEC8] rounded-2xl text-center">
              <span className="text-xs text-[#9B7322] font-semibold block uppercase tracking-wider">
                Carbohidratos
              </span>
              <span className="text-2xl font-bold text-[#D4A373] tabular-nums mt-0.5 block">
                {macros.carbsGrams}g
              </span>
              <span className="text-xs text-[#7A6F62]">~{carbsPercent}%</span>
            </div>

            {/* Healthy Fats */}
            <div className="p-4 bg-[#FBF8EF] border border-[#F2EACD] rounded-2xl text-center">
              <span className="text-xs text-[#6F7327] font-semibold block uppercase tracking-wider">
                Grasas Sanas
              </span>
              <span className="text-2xl font-bold text-[#606C38] tabular-nums mt-0.5 block">
                {macros.healthyFatsGrams}g
              </span>
              <span className="text-xs text-[#7A6F62]">~{fatsPercent}%</span>
            </div>

            {/* Fiber */}
            <div className="p-4 bg-[#F7F4EF] border border-[#E8DEC8] rounded-2xl text-center">
              <span className="text-xs text-[#615447] font-semibold block uppercase tracking-wider">
                Fibra
              </span>
              <span className="text-2xl font-bold text-[#4A4E69] tabular-nums mt-0.5 block">
                {macros.fiberGrams}g
              </span>
              <span className="text-xs text-[#7A6F62]">Digestiva</span>
            </div>
          </div>

          {/* Visual Distribution Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-[#7A6F62] mb-1.5">
              <span>Distribución de Macronutrientes</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2A9D8F]" /> Proteína ({proteinPercent}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4A373]" /> Carbs ({carbsPercent}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#606C38]" /> Grasas ({fatsPercent}%)
                </span>
              </div>
            </div>
            <div className="w-full h-3 bg-[#EADBCC] rounded-full overflow-hidden flex">
              <div
                style={{ width: `${proteinPercent}%` }}
                className="bg-[#2A9D8F] h-full"
                title={`Proteína ${proteinPercent}%`}
              />
              <div
                style={{ width: `${carbsPercent}%` }}
                className="bg-[#D4A373] h-full"
                title={`Carbohidratos ${carbsPercent}%`}
              />
              <div
                style={{ width: `${fatsPercent}%` }}
                className="bg-[#606C38] h-full"
                title={`Grasas saludables ${fatsPercent}%`}
              />
            </div>
          </div>

          {/* Key Micronutrients */}
          {macros.keyMicronutrients && macros.keyMicronutrients.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7A6F62] block mb-2">
                Micronutrientes y Antioxidantes Destacados:
              </span>
              <div className="flex flex-wrap gap-2">
                {macros.keyMicronutrients.map((micro, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-[#FAF0E6] text-[#8D4B38] text-xs font-medium rounded-lg border border-[#F0D5C0]"
                  >
                    ✨ {micro}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Salud y Beneficios Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#FAF7F2] to-[#F4ECE1] rounded-3xl border border-[#EADBCC] p-6 sm:p-8 flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2A9D8F] mb-1">
              <ChefHat className="w-4 h-4" />
              <span>Ciencia y Longevidad</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2C2825]">
              Beneficios para tu Salud
            </h3>
            <p className="text-sm text-[#5C5245] leading-relaxed mt-3">
              {recipe.mediterraneanHealthBenefits}
            </p>
          </div>

          <div className="p-4 bg-white/80 backdrop-blur-xs rounded-2xl border border-[#EADBCC] space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E76F51] block">
              Pilar Mediterráneo
            </span>
            <p className="text-xs text-[#695D4F] leading-relaxed">
              La dieta mediterránea reduce la inflamación celular, protege la salud del endotelio
              vascular y aporta grasas monoinsaturadas cardiosaludables.
            </p>
          </div>
        </div>
      </div>

      {/* Ingredientes con medidas exactas */}
      <div className="bg-white rounded-3xl border border-[#EADBCC] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#EADBCC]">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#2C2825]">
              Ingredientes necesarios y cantidades
            </h2>
            <p className="text-xs text-[#7A6F62] mt-0.5">
              Calculados para {recipe.servings} raciones. Marca cada uno conforme los tengas listos.
            </p>
          </div>
          <span className="text-xs font-medium text-[#8C7A6B]">
            {checkedIngredients.length} de {recipe.ingredientsWithAmounts.length} preparados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recipe.ingredientsWithAmounts.map((ing, idx) => {
            const isChecked = checkedIngredients.includes(ing.name);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleToggleIngredientCheck(ing.name)}
                className={`p-3.5 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-[#F2F8F7] border-[#2A9D8F] text-[#1E6B62]'
                    : 'bg-[#FAF7F2] border-[#EADBCC] text-[#2C2825] hover:border-[#D6BEA6]'
                }`}
              >
                <div>
                  <span className={`text-sm font-semibold block ${isChecked ? 'line-through text-[#6E9E97]' : ''}`}>
                    {ing.name}
                  </span>
                  <span className="text-xs text-[#7A6F62] mt-0.5 block font-medium">
                    {ing.amount} {ing.isOptional && '(opcional)'}
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                    isChecked
                      ? 'bg-[#2A9D8F] border-[#2A9D8F] text-white'
                      : 'border-[#D4C3AF] bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Procedimientos Paso a Paso Ilustrados */}
      <div className="bg-white rounded-3xl border border-[#EADBCC] p-6 sm:p-10 space-y-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADBCC]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E76F51] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modo Cocina Paso a Paso</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#2C2825] tracking-tight">
              Procedimiento de Cocinado
            </h2>
            <p className="text-sm text-[#7A6F62] mt-1">
              Sigue las instrucciones ilustradas generadas por Gemini 3.8 Flash para conseguir la textura y sabor perfectos.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#FAF7F2] p-2 rounded-2xl border border-[#EADBCC]">
            <span className="text-xs font-semibold text-[#8C4332] px-2">
              Progreso: {completedSteps.length} / {recipe.steps.length} completados
            </span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-8">
          {recipe.steps.map((step, idx) => {
            const isCompleted = completedSteps.includes(step.stepNumber);
            const isTimerActiveForThis = activeTimerStep === step.stepNumber;
            const stepImage = getStepImage(idx);

            return (
              <div
                key={step.stepNumber}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isCompleted
                    ? 'bg-[#F9FAF9] border-[#A3B899] opacity-85'
                    : 'bg-white border-[#EADBCC] shadow-xs hover:border-[#E76F51]/40'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Step Information (8 cols) */}
                  <div className="lg:col-span-8 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Step Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#E76F51] border border-[#F0D5C0] font-bold text-sm flex items-center justify-center font-mono">
                            {step.stepNumber}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase tracking-wider border ${getStepBadgeColor(
                              step.stepType
                            )}`}
                          >
                            Fase: {step.stepType}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-xs text-[#7A6F62] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#EADBCC]">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            {step.minutes} min
                          </span>
                        </div>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2825]">
                        {step.title}
                      </h3>

                      {/* Main Instruction */}
                      <p className="text-sm sm:text-base text-[#4A4237] leading-relaxed">
                        {step.instruction}
                      </p>

                      {/* Chef Healthy Tip */}
                      <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EADBCC] flex items-start gap-3">
                        <ChefHat className="w-4 h-4 text-[#E76F51] shrink-0 mt-0.5" />
                        <div className="text-xs text-[#5C5245] leading-relaxed">
                          <strong className="text-[#2C2825]">Consejo del Chef: </strong>
                          {step.chefTip}
                        </div>
                      </div>
                    </div>

                    {/* Step Actions & Timer */}
                    <div className="pt-4 border-t border-[#EADBCC]/80 flex flex-wrap items-center justify-between gap-3">
                      {/* Timer Control */}
                      {step.minutes > 0 && (
                        <div className="flex items-center gap-2">
                          {isTimerActiveForThis ? (
                            <div className="flex items-center gap-2 bg-[#FFEFE9] border border-[#FADCD1] px-3.5 py-1.5 rounded-xl">
                              <span className="font-mono text-base font-bold text-[#E76F51]">
                                {formatTimer(timerSecondsLeft)}
                              </span>
                              <button
                                type="button"
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className="p-1 hover:bg-[#FCD8CD] rounded-lg text-[#E76F51] cursor-pointer"
                                title={isTimerRunning ? 'Pausar' : 'Reanudar'}
                              >
                                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTimerStep(null);
                                  setIsTimerRunning(false);
                                }}
                                className="p-1 hover:bg-[#FCD8CD] rounded-lg text-[#8C7A6B] cursor-pointer"
                                title="Detener temporizador"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleStartTimer(step.stepNumber, step.minutes)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE0] border border-[#EADBCC] text-xs font-semibold text-[#5C5245] rounded-xl transition-colors cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 text-[#E76F51]" />
                              <span>Iniciar cronómetro ({step.minutes}m)</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Step Complete Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleStepComplete(step.stepNumber)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-[#2A9D8F] text-white shadow-xs'
                            : 'bg-[#FAF0E6] text-[#8D4B38] border border-[#F0D5C0] hover:bg-[#F6E2D0]'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>{isCompleted ? 'Paso Completado' : 'Marcar como hecho'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Illustrated Step Card (4 cols) */}
                  <div className="lg:col-span-4 bg-[#FBF8F3] border-t lg:border-t-0 lg:border-l border-[#EADBCC] flex flex-col justify-between p-6">
                    <div className="relative h-44 rounded-2xl overflow-hidden border border-[#EADBCC] shadow-inner mb-4">
                      <img
                        src={stepImage}
                        alt={`Ilustración de paso: ${step.title}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-xs font-medium flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <span className="truncate">Visualización del proceso</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-[#EADBCC]">
                      <span className="text-xs font-semibold text-[#8C4332] block">
                        Estado visual esperado:
                      </span>
                      <p className="text-xs text-[#695D4F] leading-relaxed italic">
                        "{step.visualDescription}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Finishing Celebration Banner */}
        {completedSteps.length === recipe.steps.length && (
          <div className="p-6 bg-gradient-to-r from-[#2A9D8F]/15 to-[#F4A261]/20 rounded-3xl border border-[#2A9D8F]/30 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#2A9D8F] text-white flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2C2825]">
              ¡Enhorabuena! Tu plato mediterráneo está listo
            </h3>
            <p className="text-sm text-[#5C5245] max-w-xl mx-auto">
              {recipe.platingAndServingTip} Disfrútalo con tranquilidad y calma, pilares indispensables del bienestar mediterráneo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
