import type { Request, Response } from "express";
import Expense from "../models/Expense";

export class ExpensesController {
  static create = async (req: Request, res: Response) => {
    try {
      const expense = await Expense.create(req.body);
      expense.budgetId = req.budget.id;
      await expense.save();
      res.status(201).json("Gasto Agregado Correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getById = async (req: Request, res: Response) => {
    res.status(200).json(req.expense);
  };

  static updateById = async (req: Request, res: Response) => {
    try {
      await req.expense.update(req.body);
      res.status(200).json("Se actualizó correctamente");
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el gasto" });
    }
  };

  static deleteById = async (req: Request, res: Response) => {
    try {
      await req.expense.destroy();
      res.status(200).json("Gasto eliminado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el gasto" });
    }
  };
}

// import { Request, Response } from "express";
// import Expense from "../models/Expense";

// export class ExpensesController {
//   static getAll = async (req: Request, res: Response) => {
//     try {
//       const expenses = await Expense.findAll({
//         order: [["createdAt", "ASC"]],
//       });
//       res.status(200).json({ expenses });
//     } catch (error) {
//       console.error("Error fetching expenses:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   };

//   static getById = async (req: Request, res: Response) => {
//     const { expense } = req;

//     try {
//       if (!expense) {
//         res.status(404).json({ error: "Expense not found" });
//         return;
//       }

//       res.status(200).json({ expense });
//     } catch (error) {
//       console.error("Error fetching expense:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   };

//   static create = async (req: Request, res: Response) => {
//     const { body, budget } = req;

//     try {
//       const expense = await Expense.create({
//         ...body,
//         budgetId: budget.id,
//       });

//       res.status(201).json({ message: "Expense created successfully" });
//     } catch (error) {
//       console.error("Error creating expense:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   };

//   static updateById = async (req: Request, res: Response) => {
//     const { body, expense } = req;

//     try {
//       const [updatedRows] = await Expense.update(body, {
//         where: { id: expense.id },
//       });
//       if (updatedRows === 0) {
//         res.status(400).json({ error: "No changes were made to the expense" });
//         return;
//       }

//       res.status(200).json({
//         message: "Expense updated successfully",
//         expense: { ...expense.toJSON(), ...body },
//       });
//     } catch (error) {
//       console.error("Error updating expense:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   };

//   static deleteById = async (req: Request, res: Response) => {
//     const { expense } = req;

//     try {
//       await Expense.destroy({ where: { id: expense.id } });
//       res.status(200).json({ message: "Expense deleted successfully" });
//     } catch (error) {
//       console.error("Error deleting expense:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   };
// }
