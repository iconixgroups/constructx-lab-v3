const express = require("express");
const {
    // Resources
    getResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,

    // Allocations
    getAllocations,
    createAllocation,
    updateAllocation,
    deleteAllocation,

    // Availability
    getAvailability,
    addAvailability,
    updateAvailability,
    deleteAvailability,

    // Utilization
    getUtilization,
    recordUtilization,
    updateUtilization,
    deleteUtilization,
} = require("../controllers/resource.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

// --- Resource Routes ---
router.route("/resources")
    .get(getResources)
    .post(createResource);

router.route("/resources/:id")
    .get(getResourceById)
    .put(updateResource)
    .delete(deleteResource);

// --- Resource Allocation Routes ---
// Get allocations for a specific resource
router.route("/resources/:resourceId/allocations")
    .get(getAllocations)
    .post(createAllocation);

// Get allocations for a specific project
router.route("/projects/:projectId/allocations")
    .get(getAllocations);

// Update/Delete specific allocation by its ID
router.route("/allocations/:id")
    // .get(getAllocationById) // Controller not implemented, add if needed
    .put(updateAllocation)
    .delete(deleteAllocation);

// --- Resource Availability Routes ---
router.route("/resources/:resourceId/availability")
    .get(getAvailability)
    .post(addAvailability);

// Update/Delete specific availability record by its ID
router.route("/availability/:id")
    .put(updateAvailability)
    .delete(deleteAvailability);

// --- Resource Utilization Routes ---
// Get utilization for a specific resource
router.route("/resources/:resourceId/utilization")
    .get(getUtilization)
    .post(recordUtilization);

// Get utilization for a specific project
router.route("/projects/:projectId/utilization")
    .get(getUtilization);

// Update/Delete specific utilization record by its ID
router.route("/utilization/:id")
    .put(updateUtilization)
    .delete(deleteUtilization);

// Placeholder routes for fetching enums/types (implement controllers if needed)
// router.get("/resources/types", getResourceTypes);
// router.get("/resources/categories", getResourceCategories);
// router.get("/resources/statuses", getResourceStatuses);
// router.get("/allocations/statuses", getAllocationStatuses);

module.exports = router;

