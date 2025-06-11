const DashboardConfig = require("../models/dashboardConfig.model");
const Widget = require("../models/widget.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// --- Dashboard Configuration Controllers ---

// @desc    Get all dashboards for the current user
// @route   GET /api/dashboards
// @access  Private
const getDashboards = asyncHandler(async (req, res) => {
    // Assuming userId is available in req.user after authentication
    const dashboards = await DashboardConfig.find({ userId: req.user.id });
    res.status(200).json(new ApiResponse(200, dashboards, "Dashboards retrieved successfully"));
});

// @desc    Get a specific dashboard configuration
// @route   GET /api/dashboards/:id
// @access  Private
const getDashboardById = asyncHandler(async (req, res) => {
    const dashboard = await DashboardConfig.findOne({ _id: req.params.id, userId: req.user.id });
    if (!dashboard) {
        throw new ApiError(404, "Dashboard not found");
    }
    res.status(200).json(new ApiResponse(200, dashboard, "Dashboard retrieved successfully"));
});

// @desc    Create a new dashboard
// @route   POST /api/dashboards
// @access  Private
const createDashboard = asyncHandler(async (req, res) => {
    const { name, layout, projectId, isDefault } = req.body;

    if (!name || !layout) {
        throw new ApiError(400, "Name and layout are required");
    }

    // Handle default dashboard logic
    if (isDefault) {
        await DashboardConfig.updateMany(
            { userId: req.user.id, projectId: projectId || null }, // Match scope
            { $set: { isDefault: false } }
        );
    }

    const dashboard = await DashboardConfig.create({
        userId: req.user.id,
        companyId: req.user.companyId, // Assuming companyId is also in req.user
        projectId: projectId || null,
        name,
        layout,
        isDefault: isDefault || false,
    });

    res.status(201).json(new ApiResponse(201, dashboard, "Dashboard created successfully"));
});

// @desc    Update a dashboard configuration
// @route   PUT /api/dashboards/:id
// @access  Private
const updateDashboard = asyncHandler(async (req, res) => {
    const { name, layout, isDefault } = req.body;
    const dashboardId = req.params.id;

    const dashboard = await DashboardConfig.findOne({ _id: dashboardId, userId: req.user.id });

    if (!dashboard) {
        throw new ApiError(404, "Dashboard not found");
    }

    // Handle default dashboard logic if isDefault is being changed
    if (isDefault !== undefined && isDefault !== dashboard.isDefault) {
        if (isDefault) {
            // Set this one as default, unset others in the same scope
            await DashboardConfig.updateMany(
                { userId: req.user.id, projectId: dashboard.projectId, _id: { $ne: dashboardId } },
                { $set: { isDefault: false } }
            );
        } else {
            // If unsetting the default, ensure another default exists or handle accordingly
            // For simplicity, we allow unsetting without forcing another default here.
            // Consider adding logic if a default is always required.
        }
        dashboard.isDefault = isDefault;
    }

    if (name) dashboard.name = name;
    if (layout) dashboard.layout = layout;

    await dashboard.save();

    res.status(200).json(new ApiResponse(200, dashboard, "Dashboard updated successfully"));
});

// @desc    Delete a dashboard
// @route   DELETE /api/dashboards/:id
// @access  Private
const deleteDashboard = asyncHandler(async (req, res) => {
    const dashboardId = req.params.id;
    const dashboard = await DashboardConfig.findOne({ _id: dashboardId, userId: req.user.id });

    if (!dashboard) {
        throw new ApiError(404, "Dashboard not found");
    }

    // Prevent deleting the last default dashboard? (Optional logic)
    // if (dashboard.isDefault) {
    //     const otherDefaults = await DashboardConfig.countDocuments({ userId: req.user.id, projectId: dashboard.projectId, isDefault: true, _id: { $ne: dashboardId } });
    //     if (otherDefaults === 0) {
    //         throw new ApiError(400, "Cannot delete the last default dashboard");
    //     }
    // }

    // Also delete associated widgets
    await Widget.deleteMany({ dashboardId: dashboardId });

    await DashboardConfig.deleteOne({ _id: dashboardId });

    res.status(200).json(new ApiResponse(200, {}, "Dashboard deleted successfully"));
});

// @desc    Set a dashboard as default
// @route   PUT /api/dashboards/:id/default
// @access  Private
const setDefaultDashboard = asyncHandler(async (req, res) => {
    const dashboardId = req.params.id;
    const dashboard = await DashboardConfig.findOne({ _id: dashboardId, userId: req.user.id });

    if (!dashboard) {
        throw new ApiError(404, "Dashboard not found");
    }

    // Unset other defaults in the same scope
    await DashboardConfig.updateMany(
        { userId: req.user.id, projectId: dashboard.projectId, _id: { $ne: dashboardId } },
        { $set: { isDefault: false } }
    );

    // Set this one as default
    dashboard.isDefault = true;
    await dashboard.save();

    res.status(200).json(new ApiResponse(200, dashboard, "Dashboard set as default successfully"));
});

// --- Widget Controllers ---

// @desc    Get all widgets for a dashboard
// @route   GET /api/dashboards/:dashboardId/widgets
// @access  Private
const getWidgets = asyncHandler(async (req, res) => {
    const dashboardId = req.params.dashboardId;
    // Verify user owns the dashboard first
    const dashboard = await DashboardConfig.findOne({ _id: dashboardId, userId: req.user.id });
    if (!dashboard) {
        throw new ApiError(404, "Dashboard not found or access denied");
    }

    const widgets = await Widget.find({ dashboardId: dashboardId });
    res.status(200).json(new ApiResponse(200, widgets, "Widgets retrieved successfully"));
});

// @desc    Get a specific widget configuration
// @route   GET /api/widgets/:id
// @access  Private
const getWidgetById = asyncHandler(async (req, res) => {
    const widget = await Widget.findById(req.params.id).populate("dashboardId");

    if (!widget) {
        throw new ApiError(404, "Widget not found");
    }

    // Verify user owns the dashboard associated with the widget
    if (widget.dashboardId.userId.toString() !== req.user.id.toString()) {
        throw new ApiError(403, "Access denied to this widget");
    }

    res.status(200).json(new ApiResponse(200, widget, "Widget retrieved successfully"));
});

// @desc    Add a widget to a dashboard
// @route   POST /api/dashboards/:dashboardId/widgets
// @access  Private
const addWidget = asyncHandler(async (req, res) => {
    const dashboardId = req.params.dashboardId;
    const { type, title, dataSource, dataConfig, visualConfig, position, refreshInterval } = req.body;

    // Verify user owns the dashboard
    const dashboard = await DashboardConfig.findOne({ _id: dashboardId, userId: req.user.id });
    if (!dashboard) {
        throw new ApiError(404, "Dashboard not found or access denied");
    }

    if (!type || !title || !dataSource || !dataConfig || !visualConfig || !position) {
        throw new ApiError(400, "Missing required widget fields");
    }

    const widget = await Widget.create({
        dashboardId,
        type,
        title,
        dataSource,
        dataConfig,
        visualConfig,
        position,
        refreshInterval: refreshInterval || 300, // Default if not provided
    });

    res.status(201).json(new ApiResponse(201, widget, "Widget added successfully"));
});

// @desc    Update a widget configuration
// @route   PUT /api/widgets/:id
// @access  Private
const updateWidget = asyncHandler(async (req, res) => {
    const widgetId = req.params.id;
    const updates = req.body;

    const widget = await Widget.findById(widgetId).populate("dashboardId");

    if (!widget) {
        throw new ApiError(404, "Widget not found");
    }

    // Verify user owns the dashboard associated with the widget
    if (widget.dashboardId.userId.toString() !== req.user.id.toString()) {
        throw new ApiError(403, "Access denied to update this widget");
    }

    // Update allowed fields
    Object.keys(updates).forEach(key => {
        if (key !== "_id" && key !== "dashboardId" && key !== "createdAt" && key !== "updatedAt") {
            widget[key] = updates[key];
        }
    });

    await widget.save();

    res.status(200).json(new ApiResponse(200, widget, "Widget updated successfully"));
});

// @desc    Remove a widget from a dashboard
// @route   DELETE /api/widgets/:id
// @access  Private
const removeWidget = asyncHandler(async (req, res) => {
    const widgetId = req.params.id;
    const widget = await Widget.findById(widgetId).populate("dashboardId");

    if (!widget) {
        throw new ApiError(404, "Widget not found");
    }

    // Verify user owns the dashboard associated with the widget
    if (widget.dashboardId.userId.toString() !== req.user.id.toString()) {
        throw new ApiError(403, "Access denied to remove this widget");
    }

    await Widget.deleteOne({ _id: widgetId });

    res.status(200).json(new ApiResponse(200, {}, "Widget removed successfully"));
});

// @desc    Get data for a specific widget
// @route   GET /api/widgets/:id/data
// @access  Private
const getWidgetData = asyncHandler(async (req, res) => {
    const widgetId = req.params.id;
    const widget = await Widget.findById(widgetId).populate("dashboardId");

    if (!widget) {
        throw new ApiError(404, "Widget not found");
    }

    // Verify user owns the dashboard associated with the widget
    if (widget.dashboardId.userId.toString() !== req.user.id.toString()) {
        throw new ApiError(403, "Access denied to this widget's data");
    }

    // --- Data Fetching Logic ---
    // This is where you'd implement the logic to fetch data based on
    // widget.dataSource and widget.dataConfig.
    // This would likely involve calling functions from other controllers/services.
    // Example placeholder:
    let data = {};
    try {
        const [moduleName, functionName] = widget.dataSource.split('/');
        // Dynamically import or use a service registry to call the correct function
        // const dataService = require(`../services/${moduleName}.service`); // Example structure
        // data = await dataService[functionName](widget.dataConfig, req.user);
        data = { placeholder: `Data for ${widget.title} from ${widget.dataSource}`, config: widget.dataConfig }; // Replace with actual data fetching
    } catch (error) {
        console.error(`Error fetching data for widget ${widgetId}:`, error);
        throw new ApiError(500, `Failed to fetch data for widget: ${error.message}`);
    }
    // --- End Data Fetching Logic ---

    res.status(200).json(new ApiResponse(200, data, "Widget data retrieved successfully"));
});


module.exports = {
    getDashboards,
    getDashboardById,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    setDefaultDashboard,
    getWidgets,
    getWidgetById,
    addWidget,
    updateWidget,
    removeWidget,
    getWidgetData,
};

