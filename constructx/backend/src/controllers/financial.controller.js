const FinancialDashboard = require("../models/financialDashboard.model");
const Budget = require("../models/budget.model");
const BudgetCategory = require("../models/budgetCategory.model");
const BudgetItem = require("../models/budgetItem.model");
const Expense = require("../models/expense.model");
const FinancialReport = require("../models/financialReport.model");
const FinancialMetric = require("../models/financialMetric.model");
const Project = require("../models/project.model"); // To verify project access
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const mongoose = require("mongoose");

// --- Helper Functions ---

// Check project access
const checkProjectAccess = async (projectId, userId, companyId) => {
    const project = await Project.findOne({ _id: projectId, companyId: companyId });
    if (!project) {
        throw new ApiError(404, "Project not found or access denied");
    }
    return project;
};

// Check budget access
const checkBudgetAccess = async (budgetId, userId, companyId) => {
    const budget = await Budget.findById(budgetId).populate("projectId");
    if (!budget || budget.isDeleted) {
        throw new ApiError(404, "Budget not found");
    }
    if (budget.projectId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to this budget");
    }
    return budget;
};

// Check budget category access
const checkBudgetCategoryAccess = async (categoryId, userId, companyId) => {
    const category = await BudgetCategory.findById(categoryId).populate({ path: "budgetId", populate: { path: "projectId" } });
    if (!category) {
        throw new ApiError(404, "Budget category not found");
    }
    if (category.budgetId.projectId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to this budget category");
    }
    return category;
};

// Check budget item access
const checkBudgetItemAccess = async (itemId, userId, companyId) => {
    const item = await BudgetItem.findById(itemId).populate({ path: "categoryId", populate: { path: "budgetId", populate: { path: "projectId" } } });
    if (!item) {
        throw new ApiError(404, "Budget item not found");
    }
    if (item.categoryId.budgetId.projectId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to this budget item");
    }
    return item;
};

// Check expense access
const checkExpenseAccess = async (expenseId, userId, companyId) => {
    const expense = await Expense.findById(expenseId).populate("projectId");
    if (!expense || expense.isDeleted) {
        throw new ApiError(404, "Expense not found");
    }
    if (expense.projectId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to this expense");
    }
    return expense;
};

// Check financial report access
const checkFinancialReportAccess = async (reportId, userId, companyId) => {
    const report = await FinancialReport.findById(reportId).populate("projectId");
    if (!report || report.isDeleted) {
        throw new ApiError(404, "Financial report not found");
    }
    if (report.projectId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to this financial report");
    }
    return report;
};

// --- Financial Dashboard Controllers ---

// @desc    Get financial dashboard for a project
// @route   GET /api/projects/:projectId/financial-dashboard
// @access  Private
const getFinancialDashboard = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    let dashboard = await FinancialDashboard.findOne({ projectId: projectId });

    // If dashboard doesn't exist, create a default one
    if (!dashboard) {
        dashboard = await FinancialDashboard.create({
            projectId: projectId,
            createdBy: req.user.id,
            // Add default layout if needed
        });
    }

    res.status(200).json(new ApiResponse(200, dashboard, "Financial dashboard retrieved successfully"));
});

// @desc    Update financial dashboard layout
// @route   PUT /api/projects/:projectId/financial-dashboard
// @access  Private
const updateFinancialDashboardLayout = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    const { layout } = req.body;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    const dashboard = await FinancialDashboard.findOneAndUpdate(
        { projectId: projectId },
        { layout: layout },
        { new: true, upsert: true, setDefaultsOnInsert: true } // Create if not exists
    );

    res.status(200).json(new ApiResponse(200, dashboard, "Financial dashboard layout updated successfully"));
});

// @desc    Get financial metrics for a project
// @route   GET /api/projects/:projectId/financial-metrics
// @access  Private
const getFinancialMetrics = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    // TODO: Implement logic to calculate/retrieve relevant metrics
    // Example: Fetch latest metrics stored in FinancialMetric collection
    const metrics = await FinancialMetric.find({ projectId: projectId })
        .sort({ date: -1 }); // Or group by name and get latest

    // Placeholder for calculated metrics
    const calculatedMetrics = {
        totalBudget: 0,
        totalExpenses: 0,
        budgetVariance: 0,
        // ... other metrics
    };

    // Example: Calculate total budget
    const budgets = await Budget.find({ projectId: projectId, status: "Approved" });
    calculatedMetrics.totalBudget = budgets.reduce((sum, budget) => sum + budget.totalAmount, 0);

    // Example: Calculate total expenses
    const expenses = await Expense.find({ projectId: projectId, approvalStatus: "Approved" });
    calculatedMetrics.totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    calculatedMetrics.budgetVariance = calculatedMetrics.totalBudget - calculatedMetrics.totalExpenses;

    // Combine stored and calculated metrics
    const responseData = {
        storedMetrics: metrics,
        calculatedMetrics: calculatedMetrics,
    };

    res.status(200).json(new ApiResponse(200, responseData, "Financial metrics retrieved successfully"));
});

// --- Budget Controllers ---

// @desc    List all budgets for a project
// @route   GET /api/projects/:projectId/budgets
// @access  Private
const getProjectBudgets = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    const budgets = await Budget.find({ projectId: projectId })
        .populate("createdBy", "firstName lastName")
        .populate("approvedBy", "firstName lastName")
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, budgets, "Budgets retrieved successfully"));
});

// @desc    Get specific budget details
// @route   GET /api/budgets/:id
// @access  Private
const getBudgetById = asyncHandler(async (req, res) => {
    const budget = await checkBudgetAccess(req.params.id, req.user.id, req.user.companyId);
    await budget.populate("createdBy", "firstName lastName");
    await budget.populate("approvedBy", "firstName lastName");
    res.status(200).json(new ApiResponse(200, budget, "Budget retrieved successfully"));
});

// @desc    Create new budget
// @route   POST /api/projects/:projectId/budgets
// @access  Private
const createBudget = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    const { name, description, totalAmount, startDate, endDate } = req.body;

    if (!totalAmount) {
        throw new ApiError(400, "Total budget amount is required");
    }

    const budget = await Budget.create({
        projectId,
        name,
        description,
        totalAmount,
        startDate,
        endDate,
        status: "Draft",
        createdBy: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, budget, "Budget created successfully"));
});

// @desc    Update budget details
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = asyncHandler(async (req, res) => {
    const budgetId = req.params.id;
    const updates = req.body;
    const budget = await checkBudgetAccess(budgetId, req.user.id, req.user.companyId);

    // Only allow updating certain fields, especially if approved
    const allowedUpdates = ["name", "description", "totalAmount", "startDate", "endDate"];
    if (budget.status !== "Draft") {
        // Restrict updates after approval if needed
        // delete updates.totalAmount;
    }

    Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
            budget[key] = updates[key];
        }
    });

    await budget.save();
    res.status(200).json(new ApiResponse(200, budget, "Budget updated successfully"));
});

// @desc    Delete budget (soft delete)
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = asyncHandler(async (req, res) => {
    const budgetId = req.params.id;
    const budget = await checkBudgetAccess(budgetId, req.user.id, req.user.companyId);

    if (budget.status !== "Draft") {
        throw new ApiError(400, "Cannot delete an approved or active budget.");
    }

    // TODO: Handle deletion of related categories and items?
    budget.isDeleted = true;
    budget.deletedAt = new Date();
    await budget.save();

    res.status(200).json(new ApiResponse(200, {}, "Budget deleted successfully"));
});

// @desc    Approve budget
// @route   PUT /api/budgets/:id/approve
// @access  Private (Requires specific role/permission)
const approveBudget = asyncHandler(async (req, res) => {
    // TODO: Add role/permission check
    const budgetId = req.params.id;
    const budget = await checkBudgetAccess(budgetId, req.user.id, req.user.companyId);

    if (budget.status !== "Draft") {
        throw new ApiError(400, `Budget is already ${budget.status}.`);
    }

    budget.status = "Approved";
    budget.approvedBy = req.user.id;
    budget.approvedAt = new Date();
    await budget.save();

    res.status(200).json(new ApiResponse(200, budget, "Budget approved successfully"));
});

// @desc    Get budget summary with actuals
// @route   GET /api/budgets/:id/summary
// @access  Private
const getBudgetSummary = asyncHandler(async (req, res) => {
    const budgetId = req.params.id;
    const budget = await checkBudgetAccess(budgetId, req.user.id, req.user.companyId);

    // Fetch categories and items for the budget
    const categories = await BudgetCategory.find({ budgetId: budgetId }).lean();
    const items = await BudgetItem.find({ categoryId: { $in: categories.map(c => c._id) } }).lean();

    // Fetch related expenses
    const expenses = await Expense.find({
        projectId: budget.projectId._id,
        approvalStatus: "Approved",
        budgetItemId: { $in: items.map(i => i._id) }
        // Or filter by budgetCategoryId if items aren't used
    }).lean();

    // Calculate actuals
    const itemActuals = {};
    expenses.forEach(expense => {
        if (expense.budgetItemId) {
            const itemIdStr = expense.budgetItemId.toString();
            itemActuals[itemIdStr] = (itemActuals[itemIdStr] || 0) + expense.amount;
        }
    });

    const categoryActuals = {};
    items.forEach(item => {
        const categoryIdStr = item.categoryId.toString();
        const itemActual = itemActuals[item._id.toString()] || 0;
        categoryActuals[categoryIdStr] = (categoryActuals[categoryIdStr] || 0) + itemActual;
        item.actualAmount = itemActual; // Add actual to item data
    });

    categories.forEach(category => {
        category.actualAmount = categoryActuals[category._id.toString()] || 0; // Add actual to category data
    });

    const totalActual = Object.values(categoryActuals).reduce((sum, amount) => sum + amount, 0);

    const summary = {
        budgetId: budget._id,
        budgetName: budget.name,
        totalBudgetAmount: budget.totalAmount,
        totalActualAmount: totalActual,
        variance: budget.totalAmount - totalActual,
        categories: categories, // Now include actual amounts
        items: items,         // Now include actual amounts
    };

    res.status(200).json(new ApiResponse(200, summary, "Budget summary retrieved successfully"));
});

// --- Budget Category & Item Controllers ---

// @desc    List all categories for a budget
// @route   GET /api/budgets/:budgetId/categories
// @access  Private
const getBudgetCategories = asyncHandler(async (req, res) => {
    const budgetId = req.params.budgetId;
    await checkBudgetAccess(budgetId, req.user.id, req.user.companyId);

    const categories = await BudgetCategory.find({ budgetId: budgetId })
        .sort({ parentCategoryId: 1, order: 1 }); // Sort for hierarchy

    res.status(200).json(new ApiResponse(200, categories, "Budget categories retrieved successfully"));
});

// @desc    Create new budget category
// @route   POST /api/budgets/:budgetId/categories
// @access  Private
const createBudgetCategory = asyncHandler(async (req, res) => {
    const budgetId = req.params.budgetId;
    await checkBudgetAccess(budgetId, req.user.id, req.user.companyId);

    const { name, description, amount, parentCategoryId, order } = req.body;

    if (!name || amount === undefined) {
        throw new ApiError(400, "Category name and amount are required");
    }

    const category = await BudgetCategory.create({
        budgetId,
        name,
        description,
        amount,
        parentCategoryId: parentCategoryId || null,
        order: order || 0,
    });

    res.status(201).json(new ApiResponse(201, category, "Budget category created successfully"));
});

// @desc    Update budget category
// @route   PUT /api/budget-categories/:id
// @access  Private
const updateBudgetCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const updates = req.body;
    const category = await checkBudgetCategoryAccess(categoryId, req.user.id, req.user.companyId);

    // Prevent changing budgetId
    delete updates.budgetId;

    Object.assign(category, updates);
    await category.save();

    res.status(200).json(new ApiResponse(200, category, "Budget category updated successfully"));
});

// @desc    Delete budget category
// @route   DELETE /api/budget-categories/:id
// @access  Private
const deleteBudgetCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await checkBudgetCategoryAccess(categoryId, req.user.id, req.user.companyId);

    // Check if category has items or subcategories
    const itemsCount = await BudgetItem.countDocuments({ categoryId: categoryId });
    const subCategoriesCount = await BudgetCategory.countDocuments({ parentCategoryId: categoryId });

    if (itemsCount > 0 || subCategoriesCount > 0) {
        throw new ApiError(400, "Cannot delete category with existing items or subcategories.");
    }

    await BudgetCategory.deleteOne({ _id: categoryId });

    res.status(200).json(new ApiResponse(200, {}, "Budget category deleted successfully"));
});

// @desc    List all items in a category
// @route   GET /api/budget-categories/:categoryId/items
// @access  Private
const getCategoryItems = asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;
    await checkBudgetCategoryAccess(categoryId, req.user.id, req.user.companyId);

    const items = await BudgetItem.find({ categoryId: categoryId })
        .sort({ order: 1 });

    res.status(200).json(new ApiResponse(200, items, "Budget items retrieved successfully"));
});

// @desc    Create new budget item
// @route   POST /api/budget-categories/:categoryId/items
// @access  Private
const createBudgetItem = asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;
    await checkBudgetCategoryAccess(categoryId, req.user.id, req.user.companyId);

    const { name, description, quantity, unit, unitPrice, order } = req.body;

    if (!name || quantity === undefined || !unit || unitPrice === undefined) {
        throw new ApiError(400, "Item name, quantity, unit, and unit price are required");
    }

    const item = await BudgetItem.create({
        categoryId,
        name,
        description,
        quantity,
        unit,
        unitPrice,
        // totalPrice is calculated by pre-save hook
        order: order || 0,
    });

    res.status(201).json(new ApiResponse(201, item, "Budget item created successfully"));
});

// @desc    Update budget item
// @route   PUT /api/budget-items/:id
// @access  Private
const updateBudgetItem = asyncHandler(async (req, res) => {
    const itemId = req.params.id;
    const updates = req.body;
    const item = await checkBudgetItemAccess(itemId, req.user.id, req.user.companyId);

    // Prevent changing categoryId
    delete updates.categoryId;

    Object.assign(item, updates);
    await item.save(); // Pre-save hook recalculates totalPrice

    res.status(200).json(new ApiResponse(200, item, "Budget item updated successfully"));
});

// @desc    Delete budget item
// @route   DELETE /api/budget-items/:id
// @access  Private
const deleteBudgetItem = asyncHandler(async (req, res) => {
    const itemId = req.params.id;
    await checkBudgetItemAccess(itemId, req.user.id, req.user.companyId);

    // Check if item has linked expenses
    const expenseCount = await Expense.countDocuments({ budgetItemId: itemId });
    if (expenseCount > 0) {
        throw new ApiError(400, "Cannot delete budget item with linked expenses. Reassign expenses first.");
    }

    await BudgetItem.deleteOne({ _id: itemId });

    res.status(200).json(new ApiResponse(200, {}, "Budget item deleted successfully"));
});

// --- Expense Controllers ---

// @desc    List all expenses for a project
// @route   GET /api/projects/:projectId/expenses
// @access  Private
const getProjectExpenses = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    // Add filtering (date range, status, category), sorting, pagination
    const query = { projectId: projectId };
    if (req.query.startDate) query.date = { ...query.date, $gte: new Date(req.query.startDate) };
    if (req.query.endDate) query.date = { ...query.date, $lte: new Date(req.query.endDate) };
    if (req.query.approvalStatus) query.approvalStatus = req.query.approvalStatus;
    if (req.query.paymentStatus) query.paymentStatus = req.query.paymentStatus;
    if (req.query.budgetCategoryId) query.budgetCategoryId = req.query.budgetCategoryId;

    const expenses = await Expense.find(query)
        .populate("createdBy", "firstName lastName")
        .populate("approvedBy", "firstName lastName")
        .populate("budgetCategoryId", "name")
        .populate("budgetItemId", "name")
        .sort({ date: -1 });

    res.status(200).json(new ApiResponse(200, expenses, "Expenses retrieved successfully"));
});

// @desc    Get specific expense details
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = asyncHandler(async (req, res) => {
    const expense = await checkExpenseAccess(req.params.id, req.user.id, req.user.companyId);
    await expense.populate("createdBy", "firstName lastName");
    await expense.populate("approvedBy", "firstName lastName");
    await expense.populate("budgetCategoryId", "name");
    await expense.populate("budgetItemId", "name");
    res.status(200).json(new ApiResponse(200, expense, "Expense retrieved successfully"));
});

// @desc    Create new expense
// @route   POST /api/projects/:projectId/expenses
// @access  Private
const createExpense = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    const {
        budgetCategoryId, budgetItemId, description, amount, date,
        vendor, receiptUrl, paymentMethod, paymentStatus
    } = req.body;

    if (!description || amount === undefined || !date) {
        throw new ApiError(400, "Expense description, amount, and date are required");
    }

    // Validate category/item IDs if provided
    if (budgetItemId) await checkBudgetItemAccess(budgetItemId, req.user.id, req.user.companyId);
    else if (budgetCategoryId) await checkBudgetCategoryAccess(budgetCategoryId, req.user.id, req.user.companyId);

    const expense = await Expense.create({
        projectId,
        budgetCategoryId,
        budgetItemId,
        description,
        amount,
        date,
        vendor,
        receiptUrl,
        paymentMethod,
        paymentStatus: paymentStatus || "Pending",
        approvalStatus: "Pending", // Default to pending approval
        createdBy: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, expense, "Expense created successfully"));
});

// @desc    Update expense details
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
    const expenseId = req.params.id;
    const updates = req.body;
    const expense = await checkExpenseAccess(expenseId, req.user.id, req.user.companyId);

    if (expense.approvalStatus === "Approved" && req.user.id !== expense.approvedBy?.toString()) {
        // Restrict updates after approval, except maybe by the approver or admin
        // throw new ApiError(403, "Cannot update an approved expense.");
    }

    // Prevent changing key IDs or approval status directly here
    delete updates.projectId;
    delete updates.createdBy;
    delete updates.approvedBy;
    delete updates.approvedAt;
    delete updates.approvalStatus;
    delete updates.isDeleted;
    delete updates.deletedAt;

    Object.assign(expense, updates);
    await expense.save();

    res.status(200).json(new ApiResponse(200, expense, "Expense updated successfully"));
});

// @desc    Delete expense (soft delete)
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
    const expenseId = req.params.id;
    const expense = await checkExpenseAccess(expenseId, req.user.id, req.user.companyId);

    if (expense.approvalStatus === "Approved") {
        throw new ApiError(400, "Cannot delete an approved expense.");
    }

    expense.isDeleted = true;
    expense.deletedAt = new Date();
    await expense.save();

    res.status(200).json(new ApiResponse(200, {}, "Expense deleted successfully"));
});

// @desc    Approve expense
// @route   PUT /api/expenses/:id/approve
// @access  Private (Requires specific role/permission)
const approveExpense = asyncHandler(async (req, res) => {
    // TODO: Add role/permission check
    const expenseId = req.params.id;
    const expense = await checkExpenseAccess(expenseId, req.user.id, req.user.companyId);

    if (expense.approvalStatus !== "Pending") {
        throw new ApiError(400, `Expense is already ${expense.approvalStatus}.`);
    }

    expense.approvalStatus = "Approved";
    expense.approvedBy = req.user.id;
    expense.approvedAt = new Date();
    await expense.save();

    res.status(200).json(new ApiResponse(200, expense, "Expense approved successfully"));
});

// @desc    Reject expense
// @route   PUT /api/expenses/:id/reject
// @access  Private (Requires specific role/permission)
const rejectExpense = asyncHandler(async (req, res) => {
    // TODO: Add role/permission check
    const expenseId = req.params.id;
    const expense = await checkExpenseAccess(expenseId, req.user.id, req.user.companyId);

    if (expense.approvalStatus !== "Pending") {
        throw new ApiError(400, `Expense is already ${expense.approvalStatus}.`);
    }

    expense.approvalStatus = "Rejected";
    expense.approvedBy = req.user.id; // Record who rejected it
    expense.approvedAt = new Date();
    await expense.save();

    res.status(200).json(new ApiResponse(200, expense, "Expense rejected successfully"));
});

// @desc    Upload receipt for expense
// @route   POST /api/expenses/:id/receipt
// @access  Private
const uploadExpenseReceipt = asyncHandler(async (req, res) => {
    const expenseId = req.params.id;
    const expense = await checkExpenseAccess(expenseId, req.user.id, req.user.companyId);

    // --- File Upload Logic --- 
    // Use middleware like multer to handle file uploads
    // Example assumes file is uploaded and URL is available in req.file.path or similar
    if (!req.file) {
        throw new ApiError(400, "No receipt file uploaded.");
    }
    const receiptUrl = req.file.path; // Replace with actual path/URL from upload storage
    // --- End File Upload Logic ---

    expense.receiptUrl = receiptUrl;
    await expense.save();

    res.status(200).json(new ApiResponse(200, { receiptUrl }, "Receipt uploaded successfully"));
});

// --- Financial Report Controllers ---

// @desc    List all reports for a project
// @route   GET /api/projects/:projectId/financial-reports
// @access  Private
const getFinancialReports = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    const reports = await FinancialReport.find({ projectId: projectId })
        .populate("createdBy", "firstName lastName")
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, reports, "Financial reports retrieved successfully"));
});

// @desc    Get specific report details
// @route   GET /api/financial-reports/:id
// @access  Private
const getFinancialReportById = asyncHandler(async (req, res) => {
    const report = await checkFinancialReportAccess(req.params.id, req.user.id, req.user.companyId);
    await report.populate("createdBy", "firstName lastName");
    res.status(200).json(new ApiResponse(200, report, "Financial report retrieved successfully"));
});

// @desc    Generate new report
// @route   POST /api/projects/:projectId/financial-reports
// @access  Private
const generateFinancialReport = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    const { type, name, description, dateRange } = req.body;

    if (!type || !name || !dateRange || !dateRange.startDate || !dateRange.endDate) {
        throw new ApiError(400, "Report type, name, and date range are required");
    }

    // --- Report Generation Logic --- 
    let reportData = {};
    // Example: Generate Budget Summary
    if (type === "Budget Summary") {
        const budget = await Budget.findOne({ projectId: projectId, status: "Approved" }); // Find the primary approved budget
        if (budget) {
            const summary = await getBudgetSummaryData(budget._id, req.user.id, req.user.companyId); // Reuse summary logic
            reportData = summary;
        } else {
            reportData = { message: "No approved budget found for this project." };
        }
    }
    // TODO: Add logic for other report types (Expense Report, Cash Flow, P/L)
    else {
        reportData = { message: `Report type '${type}' generation not yet implemented.` };
    }
    // --- End Report Generation Logic ---

    const report = await FinancialReport.create({
        projectId,
        type,
        name,
        description,
        dateRange,
        data: reportData,
        createdBy: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, report, "Financial report generated successfully"));
});

// Helper for report generation (extracted from getBudgetSummary)
const getBudgetSummaryData = async (budgetId, userId, companyId) => {
    const budget = await checkBudgetAccess(budgetId, userId, companyId);
    const categories = await BudgetCategory.find({ budgetId: budgetId }).lean();
    const items = await BudgetItem.find({ categoryId: { $in: categories.map(c => c._id) } }).lean();
    const expenses = await Expense.find({
        projectId: budget.projectId._id,
        approvalStatus: "Approved",
        budgetItemId: { $in: items.map(i => i._id) }
    }).lean();

    const itemActuals = {};
    expenses.forEach(expense => {
        if (expense.budgetItemId) {
            const itemIdStr = expense.budgetItemId.toString();
            itemActuals[itemIdStr] = (itemActuals[itemIdStr] || 0) + expense.amount;
        }
    });
    const categoryActuals = {};
    items.forEach(item => {
        const categoryIdStr = item.categoryId.toString();
        const itemActual = itemActuals[item._id.toString()] || 0;
        categoryActuals[categoryIdStr] = (categoryActuals[categoryIdStr] || 0) + itemActual;
        item.actualAmount = itemActual;
    });
    categories.forEach(category => {
        category.actualAmount = categoryActuals[category._id.toString()] || 0;
    });
    const totalActual = Object.values(categoryActuals).reduce((sum, amount) => sum + amount, 0);

    return {
        budgetId: budget._id,
        budgetName: budget.name,
        totalBudgetAmount: budget.totalAmount,
        totalActualAmount: totalActual,
        variance: budget.totalAmount - totalActual,
        categories: categories,
        items: items,
    };
};

// @desc    Delete report (soft delete)
// @route   DELETE /api/financial-reports/:id
// @access  Private
const deleteFinancialReport = asyncHandler(async (req, res) => {
    const reportId = req.params.id;
    const report = await checkFinancialReportAccess(reportId, req.user.id, req.user.companyId);

    report.isDeleted = true;
    report.deletedAt = new Date();
    await report.save();

    res.status(200).json(new ApiResponse(200, {}, "Financial report deleted successfully"));
});

// @desc    Export report (PDF, Excel)
// @route   GET /api/financial-reports/:id/export?format=pdf
// @access  Private
const exportFinancialReport = asyncHandler(async (req, res) => {
    const reportId = req.params.id;
    const format = req.query.format || "pdf"; // Default to PDF
    const report = await checkFinancialReportAccess(reportId, req.user.id, req.user.companyId);

    // --- Export Logic --- 
    // Use libraries like fpdf2/reportlab (Python) or pdfkit/exceljs (Node)
    // to generate the file based on report.data
    if (format === "pdf") {
        // Generate PDF
        // Example: const pdfBuffer = await generatePdfFromReportData(report.data);
        // res.contentType("application/pdf");
        // res.send(pdfBuffer);
        res.status(501).json(new ApiError(501, "PDF export not implemented yet."));

    } else if (format === "excel") {
        // Generate Excel
        // Example: const excelBuffer = await generateExcelFromReportData(report.data);
        // res.contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        // res.setHeader("Content-Disposition", `attachment; filename=${report.name}.xlsx`);
        // res.send(excelBuffer);
        res.status(501).json(new ApiError(501, "Excel export not implemented yet."));

    } else {
        throw new ApiError(400, "Invalid export format specified. Use 'pdf' or 'excel'.");
    }
    // --- End Export Logic ---
});


module.exports = {
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
};

