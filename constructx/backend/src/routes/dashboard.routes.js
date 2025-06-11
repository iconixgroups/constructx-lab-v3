const express = require("express");
const {
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
} = require("../controllers/dashboard.controller");
const { protect } = require("../middleware/auth"); // Assuming protect middleware handles authentication

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

// Dashboard Configuration Routes
router.route("/")
    .get(getDashboards)
    .post(createDashboard);

router.route("/:id")
    .get(getDashboardById)
    .put(updateDashboard)
    .delete(deleteDashboard);

router.route("/:id/default")
    .put(setDefaultDashboard);

// Widget Routes (nested under dashboards for creation, direct for updates/deletes)
router.route("/:dashboardId/widgets")
    .get(getWidgets)
    .post(addWidget);

// Routes for individual widgets (assuming widget ID is unique across all dashboards)
router.route("/widgets/:id")
    .get(getWidgetById)
    .put(updateWidget)
    .delete(removeWidget);

router.route("/widgets/:id/data")
    .get(getWidgetData);

// Note: Routes like /api/widgets/types and /api/widgets/data-sources might be handled
// in a separate controller/route file or within these controllers if simple.
// Example placeholder route (implementation needed in controller):
// router.get("/widgets/types", getWidgetTypes);
// router.get("/widgets/data-sources", getWidgetDataSources);

module.exports = router;

