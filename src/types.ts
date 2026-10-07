export interface RecipeSuggestion {
  id: string;
  title: string;
  tagline: string;
  category: string;
  prepTimeMinutes: number;
  difficulty: string;
  caloriesEstimate: number;
  mainIngredientsUsed: string[];
  pantryAdditions?: string[];
  healthHighlight: string;
  flavorProfile: string;
}

export interface Macronutrients {
  caloriesKcal: number;
  proteinGrams: number;
  carbsGrams: number;
  healthyFatsGrams: number;
  fiberGrams: number;
  sodiumMg?: number;
  keyMicronutrients: string[];
}

export interface IngredientAmount {
  name: string;
  amount: string;
  isOptional?: boolean;
}

export interface CookingStep {
  stepNumber: number;
  title: string;
  instruction: string;
  chefTip: string;
  minutes: number;
  stepType: 'prep' | 'cook' | 'dress' | 'plate' | string;
  visualDescription: string;
}

export interface RecipeDetail {
  title: string;
  summary: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  difficulty: string;
  macronutrientsPerServing: Macronutrients;
  ingredientsWithAmounts: IngredientAmount[];
  steps: CookingStep[];
  mediterraneanHealthBenefits: string;
  platingAndServingTip: string;
}

export interface SavedRecipe {
  id: string;
  savedAt: string;
  title: string;
  recipeDetail: RecipeDetail;
}
