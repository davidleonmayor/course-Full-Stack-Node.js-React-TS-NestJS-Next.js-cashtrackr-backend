import type { Request, Response, NextFunction } from "express";
import Expense from "../models/Expense";
import Budget from "../models/Budget";

declare global {
  namespace Express {
    interface Request {
      expense?: Expense;
    }
  }
}

export const validateExpensesExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req.params);
    const { expenseId } = req.params;
    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      const error = new Error("Expense no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }
    req.expense = expense;

    next();
  } catch (error) {
    // console.log(error)
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const validateExpenseOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, params } = req;

    // Buscar el gasto
    const expense = await Expense.findByPk(params.expenseId);

    if (!expense) {
      res.status(404).json({ error: "Expense not found" });
      return;
    }

    // Verificar si el presupuesto asociado pertenece al usuario
    const budget = await Budget.findByPk(expense.budgetId);

    if (!budget || budget.userId !== user.id) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    // Adjuntar el gasto al request para evitar otra consulta
    req.expense = expense;

    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
