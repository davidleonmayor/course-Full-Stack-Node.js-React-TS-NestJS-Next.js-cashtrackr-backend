import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../../mocks/budget";
import { BudgetController } from "../../../controllers/BudgetController";
import Budget from "../../../models/Budget";
import Expense from "../../../models/Expense";

jest.mock("../../../models/Budget", () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe("BudgetController.getAll", () => {
  beforeEach(() => {
    (Budget.findAll as jest.Mock).mockReset();
    (Budget.findAll as jest.Mock).mockImplementation((options) => {
      const updatedBudgets = budgets.filter(
        (budget) => budget.userId === options.where.userId
      );
      return Promise.resolve(updatedBudgets);
    });
  });

  it("should return 2 budgets for user with ID 1", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: {
        id: 1,
      },
    });
    const res = createResponse();
    await BudgetController.getAll(req, res);

    const data = res._getJSONData();
    expect(data.butgets).toHaveLength(2); // Verifica que los presupuestos sean los esperados
    expect(res.statusCode).toBe(200); // Verifica el código de estado
  });

  it("should return 1 budget for user with ID 2", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: {
        id: 2,
      },
    });
    const res = createResponse();

    await BudgetController.getAll(req, res);

    const data = res._getJSONData();
    expect(data.butgets).toHaveLength(1); // Verifica que hay 1 presupuesto
    expect(res.statusCode).toBe(200); // Verifica que el estado es 200
  });

  it("should return 0 budget for user with ID 7", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: {
        id: 10,
      },
    });
    const res = createResponse();

    await BudgetController.getAll(req, res);
    const data = res._getJSONData();

    expect(data.butgets).toHaveLength(0); // Verifica que hay 1 presupuesto
    expect(res.statusCode).toBe(200); // Verifica que el estado es 200
  });

  it("should return 500 if an error occurs", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets",
      user: {
        id: 100,
      },
    });
    const res = createResponse();

    // Forzamos un error en Budget.findAll
    (Budget.findAll as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );
    await BudgetController.getAll(req, res);

    expect(res.statusCode).toBe(500); // Verifica que el estado es 500
    expect(res._getData()).toBe("Internal server error"); // Verifica que el mensaje sea el esperado
  });
});

describe("BudgetController.create", () => {
  it("Should create a new budget and respond with statusCode 201", async () => {
    const budgetMock = {
      save: jest.fn().mockResolvedValue(true),
    };

    (Budget.create as jest.Mock).mockResolvedValue(budgetMock);
    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      user: { id: 1 },
      body: { name: "Presupuesto Prueba", amount: 1000 },
    });
    const res = createResponse();
    await BudgetController.create(req, res);

    const data = res._getJSONData();

    expect(res.statusCode).toBe(201);
    expect(data).toBe("Budget created");
    expect(budgetMock.save).toHaveBeenCalled();
    expect(budgetMock.save).toHaveBeenCalledTimes(1);
    expect(Budget.create).toHaveBeenCalledWith(req.body);
  });

  // errors
  it("should handle budget creation error", async () => {
    const req = createRequest({
      method: "POST",
      url: "/api/budgets",
      body: {
        name: "New Budget",
        amount: 1000,
        userId: 1,
      },
    });
    const res = createResponse();

    (Budget.create as jest.Mock).mockRejectedValue(new Error("Database error"));

    await BudgetController.create(req, res);

    const data = res._getData();
    expect(res.statusCode).toBe(500);
    expect(data).toBe("Internal server error");
  });
});

describe("BudgetController.getById", () => {
  beforeEach(() => {
    (Budget.findByPk as jest.Mock).mockImplementation((id) => {
      const budget = budgets.filter((b) => b.id === id)[0];
      return Promise.resolve(budget);
    });
  });

  it("should return a budget with ID 1 and 3 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/1",
      params: { budgetId: 1 },
      user: { id: 1 },
    });
    const res = createResponse();

    await BudgetController.getById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.expenses).toHaveLength(3);
    expect(Budget.findByPk).toHaveBeenCalled();
    expect(Budget.findByPk).toHaveBeenCalledTimes(1);
    expect(Budget.findByPk).toHaveBeenCalledWith(1, {
      include: [Expense],
    });
  });

  it("should return a budget with ID 2 and 2 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/2",
      params: { budgetId: 2 },
      user: { id: 1 },
    });
    const res = createResponse();

    await BudgetController.getById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.expenses).toHaveLength(2);
  });

  it("should return a budget with ID 3 and 0 expenses", async () => {
    const req = createRequest({
      method: "GET",
      url: "/api/budgets/3",
      params: { budgetId: 3 },
      user: { id: 2 },
    });
    const res = createResponse();

    await BudgetController.getById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.expenses).toHaveLength(0);
  });
});

describe("BudgetController.updateById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a budget and return a success message", async () => {
    const req = createRequest({
      method: "PUT",
      url: "/api/budget/1",
      params: { budgetId: 1 },
      body: {
        name: "Updated Budget Name",
        amount: 2000,
      },
      user: { id: 1 },
    });
    const res = createResponse();

    (Budget.update as jest.Mock).mockResolvedValue([1]);

    await BudgetController.updateById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.msg).toBe("Budget updated successfully");
    expect(Budget.update).toHaveBeenCalledWith(
      { name: "Updated Budget Name", amount: 2000 },
      { where: { id: 1 } }
    );
  });

  it("should handle update error", async () => {
    const req = createRequest({
      method: "PUT",
      url: "/api/budgets/1",
      params: { budgetId: 1 },
      body: {
        name: "Updated Budget Name",
        amount: 2000,
      },
      user: { id: 1 },
    });
    const res = createResponse();

    (Budget.update as jest.Mock).mockRejectedValue(new Error("Database error"));

    await BudgetController.updateById(req, res);

    const data = res._getData();
    expect(res.statusCode).toBe(500);
    expect(data).toBe("Internal server error");
  });
});

describe("BudgetController.deleteById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should remove a budget and return a success message", async () => {
    const req = createRequest({
      method: "DELETE",
      url: "/api/budget/1",
      params: { budgetId: 1 },
    });
    const res = createResponse();

    (Budget.destroy as jest.Mock).mockResolvedValue(1); // Simula que una fila fue eliminada

    await BudgetController.deleteById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(data.msg).toBe("Budget deleted successfully");
    expect(Budget.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should return 404 if the budget does not exist", async () => {
    const req = createRequest({
      method: "DELETE",
      url: "/api/budget/4",
      params: { budgetId: 4 },
    });
    const res = createResponse();

    (Budget.destroy as jest.Mock).mockResolvedValue(0); // Simula que ninguna fila fue eliminada

    await BudgetController.deleteById(req, res);

    const data = res._getJSONData();
    expect(res.statusCode).toBe(404);
    expect(data.msg).toBe("Budget not found");
  });

  it("should handle delete error", async () => {
    const req = createRequest({
      method: "DELETE",
      url: "/api/budget/1",
      params: { budgetId: 1 },
    });
    const res = createResponse();

    (Budget.destroy as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    await BudgetController.deleteById(req, res);

    const data = res._getData();
    expect(res.statusCode).toBe(500);
    expect(data).toBe("Internal server error");
  });
});
