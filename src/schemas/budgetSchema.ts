import type { Schema } from "express-validator";

export const BudgetSchema: Schema = {
  name: {
    exists: {
      errorMessage: "Name is required",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
    isLength: {
      options: { max: 100 },
      errorMessage: "Name must not exceed 100 characters",
    },
    trim: true,
  },
  amount: {
    exists: {
      errorMessage: "Amount is required",
    },
    isDecimal: {
      errorMessage: "Amount must be a valid decimal number",
    },
    custom: {
      options: (value: string) => parseFloat(value) > 0,
      errorMessage: "Amount must be greater than zero",
    },
  },
};

export const BudgetIdSchema: Schema = {
  budgetId: {
    in: ["params"],
    exists: {
      errorMessage: "ID parameter is required",
    },
    isInt: {
      errorMessage: "ID must be an integer",
    },
    toInt: true, // Convierte el parámetro a un número entero
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "ID must be a positive number",
    },
  },
};

export const BudgePutSchema: Schema = {
  budgetId: {
    in: ["params"],
    exists: {
      errorMessage: "ID parameter is required",
    },
    isInt: {
      errorMessage: "ID must be an integer",
    },
    toInt: true, // Convierte el parámetro a un número entero
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "ID must be a positive number",
    },
  },
  name: {
    in: ["body"],
    exists: {
      errorMessage: "Name parameter is required",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  amount: {
    in: ["body"],
    exists: {
      errorMessage: "Amount parameter is required",
    },
    isFloat: {
      errorMessage: "Amount must be a valid decimal number",
    },
    toFloat: true, // Convierte el valor a float después de validarlo
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "Amount must be a positive decimal number",
    },
  },
};

export const BudgeDeleteSchema: Schema = {
  budgetId: {
    in: ["params"],
    exists: {
      errorMessage: "ID parameter is required",
    },
    isInt: {
      errorMessage: "ID must be an integer",
    },
    toInt: true, // Convierte el parámetro a un número entero
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "ID must be a positive number",
    },
  },
};
