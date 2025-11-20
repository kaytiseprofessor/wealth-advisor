
export enum AppStep {
  SELECT_COUNTRY = 'SELECT_COUNTRY',
  SELECT_INCOME = 'SELECT_INCOME',
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
}

export interface Country {
  code: string;
  name: string;
  flag: string; // Emoji flag
  currencyCode: string;
  currencySymbol: string;
  region: string;
  baseScale: number; // Used to calculate income ranges (e.g. 1000 for USD, 10000 for INR)
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface IncomeRange {
  min: number;
  max: number | null; // null means "and above"
  label: string;
}

export interface BudgetCategory {
  name: string;
  percentage: number;
  amount: number;
  color: string;
}

export interface BudgetPlan {
  estimatedMonthlyIncome: number;
  currency: string;
  breakdown: BudgetCategory[];
  summary: string;
  actionableTips: string[];
  investmentAdvice: string;
  quote: string;
  lifeGoal: string;
}

export interface AppState {
  step: AppStep;
  selectedCountry: Country | null;
  selectedIncomeRange: IncomeRange | null;
  budgetPlan: BudgetPlan | null;
  isLoading: boolean;
  error: string | null;
}
