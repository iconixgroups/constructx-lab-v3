const express = require("express");
const {
    getProjectTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskDependencies,
    addTaskDependency,
    removeTaskDependency,
    getTaskComments,
    addTaskComment,
    getTaskAttachments,
    addTaskAttachment,
    removeTaskAttachment,
    getTaskTimeEntries,
    addTimeEntry,
    startTimeTracking,
    stopTimeTracking,
    updateTimeEntry,
    deleteTimeEntry,
    // Import controllers for getting statuses/priorities/dependency-types if needed
} = require("../controllers/task.controller");
const { protect } = require("../middleware/auth");
// Import file upload middleware (e.g., multer) if needed for attachments
// const upload = require("../middleware/upload"); // Example

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

// --- Task Routes ---
// Note: Task creation is nested under projects, but retrieval/update/delete use direct task ID
router.route("/projects/:projectId/tasks")
    .get(getProjectTasks)
    .post(createTask);

router.route("/tasks/:id")
    .get(getTaskById)
    .put(updateTask)
    .delete(deleteTask);

// --- Task Dependency Routes ---
router.route("/tasks/:taskId/dependencies")
    .get(getTaskDependencies)
    .post(addTaskDependency);

// Route for deleting a specific dependency by its ID
router.route("/tasks/dependencies/:id")
    .delete(removeTaskDependency);

// --- Task Comment Routes ---
router.route("/tasks/:taskId/comments")
    .get(getTaskComments)
    .post(addTaskComment);

// Routes for updating/deleting specific comments (implement controllers if needed)
// router.route("/tasks/comments/:id")
//     .put(updateTaskComment)
//     .delete(deleteTaskComment);

// --- Task Attachment Routes ---
router.route("/tasks/:taskId/attachments")
    .get(getTaskAttachments)
    // Apply upload middleware here if needed
    // .post(upload.single("attachmentFile"), addTaskAttachment);
    .post(addTaskAttachment); // Assuming upload handled elsewhere or simple path storage

// Route for downloading/deleting specific attachments
router.route("/tasks/attachments/:id")
    // .get(downloadTaskAttachment) // Controller needed for download logic
    .delete(removeTaskAttachment);

// --- Time Entry Routes ---
router.route("/tasks/:taskId/time-entries")
    .get(getTaskTimeEntries)
    .post(addTimeEntry); // For manual time entry

router.route("/tasks/:taskId/time-entries/start")
    .post(startTimeTracking);

// Routes for specific time entries (update, delete, stop)
router.route("/time-entries/:id")
    .put(updateTimeEntry)
    .delete(deleteTimeEntry);

router.route("/time-entries/:id/stop")
    .put(stopTimeTracking);

// Placeholder routes for fetching enums/types (implement controllers if needed)
// router.get("/tasks/statuses", getTaskStatuses);
// router.get("/tasks/priorities", getTaskPriorities);
// router.get("/tasks/dependency-types", getDependencyTypes);

module.exports = router;

