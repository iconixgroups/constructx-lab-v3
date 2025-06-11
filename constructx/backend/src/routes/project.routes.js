const express = require("express");
const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectPhases,
    addProjectPhase,
    updateProjectPhase,
    removeProjectPhase,
    getProjectMembers,
    addProjectMember,
    updateProjectMember,
    removeProjectMember,
    getProjectMetrics,
    addProjectMetric,
    updateProjectMetric,
    removeProjectMetric,
    // Import controllers for reordering phases, getting roles/statuses/types etc. if needed
} = require("../controllers/project.controller");
const { protect } = require("../middleware/auth"); // Assuming protect middleware handles authentication

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

// --- Project Routes ---
router.route("/")
    .get(getProjects)
    .post(createProject);

router.route("/:id")
    .get(getProjectById)
    .put(updateProject)
    .delete(deleteProject);

// --- Project Phase Routes ---
router.route("/:projectId/phases")
    .get(getProjectPhases)
    .post(addProjectPhase);

// Routes for individual phases (assuming phase ID is unique)
router.route("/phases/:id")
    // .get(getProjectPhaseById) // Controller not implemented, add if needed
    .put(updateProjectPhase)
    .delete(removeProjectPhase);
// router.route("/:projectId/phases/reorder").put(reorderProjectPhases); // Controller not implemented

// --- Project Member Routes ---
router.route("/:projectId/members")
    .get(getProjectMembers)
    .post(addProjectMember);

// Routes for individual members (assuming member ID is unique)
router.route("/members/:id")
    // .get(getProjectMemberById) // Controller not implemented, add if needed
    .put(updateProjectMember)
    .delete(removeProjectMember);

// --- Project Metric Routes ---
router.route("/:projectId/metrics")
    .get(getProjectMetrics)
    .post(addProjectMetric);

// Routes for individual metrics (assuming metric ID is unique)
router.route("/metrics/:id")
    // .get(getProjectMetricById) // Controller not implemented, add if needed
    .put(updateProjectMetric)
    .delete(removeProjectMetric);

// Placeholder routes for fetching enums/types (implement controllers if needed)
// router.get("/statuses", getProjectStatuses);
// router.get("/types", getProjectTypes);
// router.get("/roles", getProjectRoles);
// router.get("/metric-categories", getMetricCategories);

module.exports = router;

