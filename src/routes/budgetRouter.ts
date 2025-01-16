import { Router } from "express";

// Budget
import { BudgetController } from "../controllers/BudgetController";
import { validateResource } from "../middleware/validateResource";
import {
  validateBudgetExists,
  validateBudgetOwnership,
} from "../middleware/butget";
import {
  BudgetSchema,
  BudgetIdSchema,
  BudgePutSchema,
  BudgeDeleteSchema,
} from "../schemas/budgetSchema";

// Expenses
import { ExpensesController } from "../controllers/ExpensesController";
import {
  validateExpensesExists,
  validateExpenseOwnership,
} from "../middleware/expenses";

import {
  ExpensePostSchema,
  ExpenseGetByIdSchema,
  ExpensePutSchema,
  ExpenseDeleteSchema,
} from "../schemas/expensesSchema";
import { isAuthenticatedUser } from "../middleware/auth";

const router = Router();

// Budget routes
router.get(
  "/",
  isAuthenticatedUser, // Validar autenticación
  BudgetController.getAll
);

router.get(
  "/:budgetId",
  validateResource(BudgetIdSchema), // Validar esquema
  isAuthenticatedUser, // Validar autenticación
  validateBudgetOwnership, // Validar propiedad
  BudgetController.getById
);

router.post(
  "/",
  validateResource(BudgetSchema),
  isAuthenticatedUser, // Validar autenticación
  BudgetController.create
);

router.put(
  "/:budgetId",
  validateResource(BudgePutSchema), // Validar esquema
  isAuthenticatedUser, // Validar autenticación
  validateBudgetOwnership, // Validar propiedad
  BudgetController.updateById
);

router.delete(
  "/:budgetId",
  validateResource(BudgeDeleteSchema), // Validar esquema
  isAuthenticatedUser, // Validar autenticación
  validateBudgetOwnership, // Validar propiedad
  BudgetController.deleteById
);

// Expenses routes
router.post(
  "/:budgetId/expenses",
  validateResource(ExpensePostSchema),
  isAuthenticatedUser,
  validateBudgetExists,
  validateBudgetOwnership, // Validar propiedad del presupuesto
  validateExpenseOwnership, // Validar propiedad del gasto
  ExpensesController.create
);
router.put(
  "/:budgetId/expenses/:expenseId",
  validateResource(ExpensePutSchema), // Validar esquema
  isAuthenticatedUser, // Validar autenticación
  validateBudgetOwnership, // Validar propiedad del presupuesto
  validateExpenseOwnership, // Validar propiedad del gasto
  ExpensesController.updateById
);
router.get(
  "/:budgetId/expenses/:expenseId",
  validateResource(ExpenseGetByIdSchema),
  isAuthenticatedUser,
  validateBudgetExists,
  validateExpensesExists,
  validateBudgetOwnership, // Validar propiedad del presupuesto
  validateExpenseOwnership, // Validar propiedad del gasto
  ExpensesController.getById
);
router.put(
  "/:budgetId/expenses/:expenseId",
  validateResource(ExpensePutSchema),
  isAuthenticatedUser,
  validateBudgetExists,
  validateExpensesExists,
  validateBudgetOwnership, // Validar propiedad del presupuesto
  validateExpenseOwnership, // Validar propiedad del gasto
  ExpensesController.updateById
);
router.delete(
  "/:budgetId/expenses/:expenseId",
  validateResource(ExpenseDeleteSchema),
  isAuthenticatedUser,
  validateBudgetExists,
  validateExpensesExists,
  validateBudgetOwnership, // Validar propiedad del presupuesto
  validateExpenseOwnership, // Validar propiedad del gasto
  ExpensesController.deleteById
);

export default router;
