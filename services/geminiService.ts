
import { GoogleGenAI, Type } from "@google/genai";
import { BudgetPlan, Country, IncomeRange, Language } from "../types";

// Simple in-memory cache to store results
// Key format: "COUNTRY_CODE-INCOME_MIN-INCOME_MAX-LANG_CODE"
const PLAN_CACHE = new Map<string, BudgetPlan>();

export const generateBudgetPlan = async (
  country: Country,
  incomeRange: IncomeRange,
  language: Language
): Promise<BudgetPlan> => {
  // 1. Check Cache First for Instant Load
  const cacheKey = `${country.code}-${incomeRange.min}-${incomeRange.max}-${language.code}`;
  if (PLAN_CACHE.has(cacheKey)) {
    console.log("Serving from cache:", cacheKey);
    return PLAN_CACHE.get(cacheKey)!;
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });

  const isUnemployed = incomeRange.min === 0 && incomeRange.max === 0;
  
  // Determine if income is low (<= baseScale)
  const isLowIncome = incomeRange.max !== null && incomeRange.max <= country.baseScale;

  // Determine target income for calculation (Max of range, or min if open-ended)
  const targetIncome = incomeRange.max || incomeRange.min || 0;
  
  let toneInstruction = "Professional and helpful.";
  if (isUnemployed || isLowIncome) {
    toneInstruction = "Tone: Highly motivational, compassionate, optimistic, and empowering. Focus on potential, future growth, and immediate survival wins. Make the user feel supported and hopeful.";
  }

  // optimized prompt based on income level
  const prompt = isUnemployed ? `
    Role: Compassionate Local Financial Advisor for ${country.name}.
    Task: Provide survival strategies and resources for an individual with Zero Income (Unemployed).
    Context: ${country.name} social safety nets and economy.
    Language: ${language.name} (${language.code}).
    ${toneInstruction}
    
    Output JSON with:
    - est. net income (should be 0 or potential welfare amount)
    - category breakdown (Allocate 0 for amounts. Categories: Housing, Food, Job Search, Essentials)
    - 2 sentence summary (Start with powerful encouragement. Emphasize that this is temporary and help is available).
    - 5 actionable tips (CRITICAL: Must be strictly specific to ${country.name}. Mention specific local government aid schemes, local NGOs, free food banks in ${country.name}, or local free upskilling platforms).
    - 1 paragraph investment advice (Title: "Your Path to Growth". Advice on finding work, gig economy, or learning high-demand skills in ${country.name}).
    - quote: An inspiring, famous quote about resilience, hope, or new beginnings.
    - lifeGoal: A specific, immediate financial goal to aim for (e.g., "Secure a part-time role within 30 days" or "Build a small emergency fund of ${country.currencySymbol}500").
  ` : `
    Role: Local Financial Advisor for ${country.name}.
    Task: Create an "Ideal Budget Allocation" based on a monthly income of ${targetIncome} ${country.currencyCode}.
    Context: ${country.name} economy.
    Language: ${language.name} (${language.code}).
    ${toneInstruction}
    
    Output JSON with:
    - est. net income (Use ${targetIncome} as the base, deduct approx taxes)
    - category breakdown (Calculate amounts so they sum to the net income. Categories: Housing, Food, Transport, Utilities, Savings, Personal, Health)
    - 2 sentence summary (Be motivating about what this income can achieve in ${country.name}).
    - 5 actionable local saving tips (CRITICAL: Must be strictly specific to ${country.name}. Mention specific local apps, bank account types, discount cards, or cultural money-saving habits unique to ${country.name}).
    - 1 paragraph investment advice ${isLowIncome ? '(Title: "Path to Financial Growth". Focus on increasing income, side hustles, and education)' : '(Focus on specific asset classes available in ' + country.name + ' like specific mutual funds, gold schemes, or property markets)'}.
    - quote: A famous, inspiring quote about wealth, success, or financial discipline.
    - lifeGoal: A specific, ambitious yet achievable "Financial Life Goal" for this income level in ${country.name} (e.g. "Save for a down payment on a flat in [Major City]" or "Build a portfolio of ${country.currencySymbol}10 Lakhs").
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          estimatedMonthlyIncome: { type: Type.NUMBER, description: "Net monthly income used for calculation" },
          currency: { type: Type.STRING },
          breakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                percentage: { type: Type.NUMBER },
                amount: { type: Type.NUMBER },
                color: { type: Type.STRING }
              },
              required: ["name", "percentage", "amount", "color"]
            }
          },
          summary: { type: Type.STRING },
          actionableTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          investmentAdvice: { type: Type.STRING },
          quote: { type: Type.STRING, description: "An inspiring quote relevant to the financial context" },
          lifeGoal: { type: Type.STRING, description: "A specific financial life goal to motivate the user" }
        },
        required: ["estimatedMonthlyIncome", "currency", "breakdown", "summary", "actionableTips", "investmentAdvice", "quote", "lifeGoal"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate content from Gemini.");
  }

  try {
    const result = JSON.parse(text) as BudgetPlan;
    // 2. Save to Cache
    PLAN_CACHE.set(cacheKey, result);
    return result;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Invalid response format from AI");
  }
};
