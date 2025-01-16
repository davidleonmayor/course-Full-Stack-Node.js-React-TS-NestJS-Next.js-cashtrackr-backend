import { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";

export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    const { user } = req;

    try {
      const butgets = await Budget.findAll({
        order: [["createdAt", "ASC"]],
        where: { userId: user.id },
      });
      res.status(200).json({ butgets });
    } catch (error) {
      // console.log(error);
      res.status(500).send("Internal server error");
    }
  };

  static getById = async (req: Request, res: Response) => {
    const { user } = req;

    try {
      const budget = await Budget.findByPk(req.params.budgetId, {
        include: [Expense],
      });

      if (!budget) {
        res.status(404).json({ error: "Budget not found" });
        return;
      }

      if (budget.userId !== user.id) {
        res.status(403).json({ error: "Access denied" });
        return;
      }

      res.json(budget);
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  };

  static create = async (req: Request, res: Response) => {
    const { body } = req;
    // console.log(body);

    try {
      const budget = await Budget.create(req.body);
      budget.userId = req.user.id;
      await budget.save();
      res.status(201).json("Budget created");
    } catch (error) {
      // console.log(error);
      res.status(500).send("Internal server error");
    }
  };

  static updateById = async (req: Request, res: Response) => {
    const { body, params } = req;

    try {
      // Actualizar el presupuesto
      const [updatedRows] = await Budget.update(body, {
        where: { id: params.budgetId },
      });
      if (updatedRows === 0) {
        res.status(400).send("No changes were made to the budget");
        return;
      }

      res.status(200).json({ msg: "Budget updated successfully" });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  };

  static deleteById = async (req: Request, res: Response) => {
    const { params } = req;

    try {
      const deletedRows = await Budget.destroy({
        where: { id: params.budgetId },
      });
      if (deletedRows === 0) {
        res.status(404).json({ msg: "Budget not found" });
        return;
      }
      res.status(200).json({ msg: "Budget deleted successfully" });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  };
}
