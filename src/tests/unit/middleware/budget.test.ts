import { createRequest, createResponse, MockResponse } from "node-mocks-http";
import { Request, Response, NextFunction } from "express";
import {
  validateBudgetExists,
  validateBudgetOwnership,
} from "../../../middleware/butget";
import Budget from "../../../models/Budget";
import { budgets } from "../../mocks/budget";

jest.mock("../../../models/Budget");

describe("Middleware - validateBudgetExists", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = createRequest({
      method: "GET",
      url: "/api/budgets/1",
      params: { budgetId: "1" },
    }) as unknown as Request;
    res = createResponse() as Response;
    next = jest.fn();
  });

  it("should call next if budget exists", async () => {
    (Budget.findByPk as jest.Mock).mockImplementation((id) => {
      return Promise.resolve(
        budgets.find((budget) => budget.id === parseInt(id))
      );
    });

    await validateBudgetExists(req, res, next);

    expect(req.budget).toEqual(budgets[0]);
    expect(next).toHaveBeenCalled();
  });

  it("should return 404 if budget does not exist", async () => {
    (Budget.findByPk as jest.Mock).mockImplementation(() => {
      return Promise.resolve(null);
    });

    await validateBudgetExists(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(JSON.parse((res as MockResponse<Response>)._getData())).toEqual({
      error: "Budget not found",
    });
  });

  it("should handle errors and return 500", async () => {
    (Budget.findByPk as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await validateBudgetExists(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse((res as MockResponse<Response>)._getData())).toEqual({
      error: "Hubo un error",
    });
  });
});

describe("Middleware - validateBudgetOwnership", () => {
  let req: Request;
  let res: MockResponse<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = createRequest({
      method: "GET",
      params: { budgetId: "1" },
      user: { id: 1 },
    }) as unknown as Request;
    res = createResponse() as MockResponse<Response>;
    next = jest.fn();
  });

  it("should call next if user is owner of the budget", async () => {
    (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0]);

    await validateBudgetOwnership(req, res, next);

    expect(req.budget).toEqual(budgets[0]);
    expect(next).toHaveBeenCalled();
  });

  it("should return 404 if budget does not exist", async () => {
    (Budget.findByPk as jest.Mock).mockResolvedValue(null);

    await validateBudgetOwnership(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Budget not found",
    });
  });

  it("should return 403 if user is not owner of the budget", async () => {
    (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[2]); // Budget belongs to another user

    await validateBudgetOwnership(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Access denied",
    });
  });

  it("should handle errors and return 500", async () => {
    (Budget.findByPk as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await validateBudgetOwnership(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Internal server error",
    });
  });
});
