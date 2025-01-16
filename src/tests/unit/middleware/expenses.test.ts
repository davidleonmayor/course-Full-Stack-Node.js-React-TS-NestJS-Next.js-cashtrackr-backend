import { createRequest, createResponse, MockResponse } from "node-mocks-http";
import { Request, Response, NextFunction } from "express";
import {
  validateExpenseOwnership,
  validateExpensesExists,
} from "../../../middleware/expenses";
import Expense from "../../../models/Expense";
import Budget from "../../../models/Budget";
import { expenses } from "../../mocks/expenses";
import { budgets } from "../../mocks/budget";

jest.mock("../../../models/Expense");
jest.mock("../../../models/Budget");

describe("Middleware - validateExpensesExists", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = createRequest({
      method: "GET",
      url: "/api/expenses/1",
      params: { expenseId: "1" },
    }) as unknown as Request;
    res = createResponse() as Response;
    next = jest.fn();
  });

  it("should call next if expense exists", async () => {
    (Expense.findByPk as jest.Mock).mockImplementation((id) => {
      return Promise.resolve(
        expenses.find((expense) => expense.id === parseInt(id))
      );
    });

    await validateExpensesExists(req, res, next);

    expect(req.expense).toEqual(expenses[0]);
    expect(next).toHaveBeenCalled();
  });

  it("should return 404 if expense does not exist", async () => {
    (Expense.findByPk as jest.Mock).mockImplementation(() => {
      return Promise.resolve(null);
    });

    await validateExpensesExists(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(JSON.parse((res as MockResponse<Response>)._getData())).toEqual({
      error: "Expense no encontrado",
    });
  });

  it("should handle errors and return 500", async () => {
    (Expense.findByPk as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await validateExpensesExists(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse((res as MockResponse<Response>)._getData())).toEqual({
      error: "Hubo un error",
    });
  });
});

describe("Middleware - validateExpenseOwnership", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = createRequest({
      method: "GET",
      url: "/api/expenses/1",
      params: { expenseId: "1" },
      user: { id: 1 },
    }) as unknown as Request;
    res = createResponse() as Response;
    next = jest.fn();
  });

  it("should call next if user owns the associated budget", async () => {
    (Expense.findByPk as jest.Mock).mockImplementation((id) => {
      return Promise.resolve(
        expenses.find((expense) => expense.id === parseInt(id))
      );
    });

    (Budget.findByPk as jest.Mock).mockImplementation((id) => {
      return Promise.resolve(
        budgets.find((budget) => budget.id === parseInt(id))
      );
    });

    await validateExpenseOwnership(req, res, next);

    expect(req.expense).toEqual(expenses[0]);
    expect(next).toHaveBeenCalled();
  });

  it("should return 404 if expense does not exist", async () => {
    (Expense.findByPk as jest.Mock).mockImplementation(() => {
      return Promise.resolve(null);
    });

    await validateExpenseOwnership(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(JSON.parse((res as MockResponse<Response>)._getData())).toEqual({
      error: "Expense not found",
    });
  });

  it("should return 403 if user does not own the associated budget", async () => {
    (Expense.findByPk as jest.Mock).mockImplementation((id) => {
      return Promise.resolve(
        expenses.find((expense) => expense.id === parseInt(id))
      );
    });

    (Budget.findByPk as jest.Mock).mockImplementation((id) => {
      return Promise.resolve(
        budgets.find(
          (budget) =>
            budget.id === parseInt(id) && budget.userId !== req.user.id
        )
      );
    });

    await validateExpenseOwnership(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(JSON.parse((res as MockResponse<Response>)._getData())).toEqual({
      error: "Access denied",
    });
  });

  it("should handle errors and return 500", async () => {
    (Expense.findByPk as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await validateExpenseOwnership(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse((res as MockResponse<Response>)._getData())).toEqual({
      error: "Internal server error",
    });
  });
});
