import type { Schema } from "express-validator";

export const ExpensePostSchema: Schema = {
  budgetId: {
    in: ["params"],
    exists: {
      errorMessage: "Budget ID is required",
    },
    isInt: {
      errorMessage: "Budget ID must be an integer",
    },
    toInt: true,
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "Budget ID must be a positive number",
    },
  },
  name: {
    in: ["body"],
    exists: {
      errorMessage: "Name is required",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: "Name must be between 1 and 100 characters",
    },
    trim: true,
  },
  amount: {
    in: ["body"],
    exists: {
      errorMessage: "Amount is required",
    },
    isFloat: {
      errorMessage: "Amount must be a valid decimal number",
    },
    toFloat: true,
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "Amount must be a positive decimal number",
    },
  },
};

export const ExpenseGetByIdSchema: Schema = {
  budgetId: {
    in: ["params"],
    exists: {
      errorMessage: "Budget ID is required",
    },
    isInt: {
      errorMessage: "Budget ID must be an integer",
    },
    toInt: true,
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "Budget ID must be a positive number",
    },
  },
  expenseId: {
    in: ["params"],
    exists: {
      errorMessage: "Expense ID is required",
    },
    isInt: {
      errorMessage: "Expense ID must be an integer",
    },
    toInt: true,
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "Expense ID must be a positive number",
    },
  },
};

export const ExpensePutSchema: Schema = {
  budgetId: {
    in: ["params"],
    exists: {
      errorMessage: "Budget ID is required",
    },
    isInt: {
      errorMessage: "Budget ID must be an integer",
    },
    toInt: true,
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "Budget ID must be a positive number",
    },
  },
  expenseId: {
    in: ["params"],
    exists: {
      errorMessage: "Expense ID is required",
    },
    isInt: {
      errorMessage: "Expense ID must be an integer",
    },
    toInt: true,
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "Expense ID must be a positive number",
    },
  },
  name: {
    in: ["body"],
    exists: {
      errorMessage: "Name is required",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: "Name must be between 1 and 100 characters",
    },
    trim: true,
  },
  amount: {
    in: ["body"],
    exists: {
      errorMessage: "Amount is required",
    },
    isFloat: {
      errorMessage: "Amount must be a valid decimal number",
    },
    toFloat: true,
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "Amount must be a positive decimal number",
    },
  },
};

export const ExpenseDeleteSchema: Schema = {
  budgetId: {
    in: ["params"],
    exists: {
      errorMessage: "Budget ID is required",
    },
    isInt: {
      errorMessage: "Budget ID must be an integer",
    },
    toInt: true,
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "Budget ID must be a positive number",
    },
  },
  expenseId: {
    in: ["params"],
    exists: {
      errorMessage: "Expense ID is required",
    },
    isInt: {
      errorMessage: "Expense ID must be an integer",
    },
    toInt: true,
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "Expense ID must be a positive number",
    },
  },
};
