const express = require("express");
const {
    // Dashboard
    getFinancialDashboard,
    updateFinancialDashboardLayout,
    getFinancialMetrics,

    // Budget
    getProjectBudgets,
    getBudgetById,
    createBudget,
    updateBudget,
    deleteBudget,
    approveBudget,
    getBudgetSummary,

    // Budget Categories & Items
    getBudgetCategories,
    createBudgetCategory,
    updateBudgetCategory,
    deleteBudgetCategory,
    getCategoryItems,
    createBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,

    // Expenses
    getProjectExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    approveExpense,
    rejectExpense,
    uploadExpenseReceipt,

    // Reports
    getFinancialReports,
    getFinancialReportById,
    generateFinancialReport,
    deleteFinancialReport,
    exportFinancialReport,
} = require("../controllers/financial.controller");
const { protect } = require("../middleware/auth");
// TODO: Add middleware for file uploads (e.g., multer) for receipts
// const upload = require("../middleware/upload"); // Example

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

// --- Financial Dashboard Routes ---
router.route("/projects/:projectId/financial-dashboard")
    .get(getFinancialDashboard)
    .put(updateFinancialDashboardLayout);

router.route("/projects/:projectId/financial-metrics")
    .get(getFinancialMetrics);

// --- Budget Routes ---
router.route("/projects/:projectId/budgets")
    .get(getProjectBudgets)
    .post(createBudget);

router.route("/budgets/:id")
    .get(getBudgetById)
    .put(updateBudget)
    .delete(deleteBudget);

router.route("/budgets/:id/approve")
    .put(approveBudget); // Requires specific permissions

router.route("/budgets/:id/summary")
    .get(getBudgetSummary);

// --- Budget Category Routes ---
router.route("/budgets/:budgetId/categories")
    .get(getBudgetCategories)
    .post(createBudgetCategory);

router.route("/budget-categories/:id")
    .put(updateBudgetCategory)
    .delete(deleteBudgetCategory);

// --- Budget Item Routes ---
router.route("/budget-categories/:categoryId/items")
    .get(getCategoryItems)
    .post(createBudgetItem);

router.route("/budget-items/:id")
    .put(updateBudgetItem)
    .delete(deleteBudgetItem);

// --- Expense Routes ---
router.route("/projects/:projectId/expenses")
    .get(getProjectExpenses)
    .post(createExpense);

router.route("/expenses/:id")
    .get(getExpenseById)
    .put(updateExpense)
    .delete(deleteExpense);

router.route("/expenses/:id/approve")
    .put(approveExpense); // Requires specific permissions

router.route("/expenses/:id/reject")
    .put(rejectExpense); // Requires specific permissions

// Example receipt upload route (requires upload middleware setup)
// router.route("/expenses/:id/receipt").post(upload.single("receipt"), uploadExpenseReceipt);
router.route("/expenses/:id/receipt").post(uploadExpenseReceipt); // Placeholder - needs upload middleware

// --- Financial Report Routes ---
router.route("/projects/:projectId/financial-reports")
    .get(getFinancialReports)
    .post(generateFinancialReport);

router.route("/financial-reports/:id")
    .get(getFinancialReportById)
    .delete(deleteFinancialReport);

router.route("/financial-reports/:id/export")
    .get(exportFinancialReport); // Requires format query param (pdf/excel)

module.exports = router;

