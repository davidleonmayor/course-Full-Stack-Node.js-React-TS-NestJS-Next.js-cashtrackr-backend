import type { Request, Response, NextFunction } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

declare global {
  namespace Express {
    interface Request {
      budget?: Budget;
    }
  }
}

export const validateBudgetExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { budgetId } = req.params;
    const budget = await Budget.findByPk(budgetId);

    if (!budget) {
      const error = new Error("Budget not found");
      res.status(404).json({ error: error.message });
      return;
    }
    req.budget = budget;

    next();
  } catch (error) {
    // console.log(error)
    res.status(500).json({ error: "Hubo un error" });
  }
};

export const validateBudgetOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, params } = req;

    // Buscar el presupuesto
    const budget = await Budget.findByPk(params.budgetId);

    if (!budget) {
      res.status(404).json({ error: "Budget not found" });
      return;
    }

    // Verificar propiedad
    if (budget.userId !== user.id) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    // Adjuntar el presupuesto al request para evitar otra consulta
    req.budget = budget;

    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
