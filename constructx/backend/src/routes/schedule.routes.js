const express = require("express");
const {
    // Schedule
    getProjectSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    createScheduleBaseline,
    // getCriticalPath,

    // Schedule Items
    getScheduleItems,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    // updateItemOrder,
    // updateItemStatus,
    // updateItemProgress,

    // Schedule Dependencies
    getItemDependencies,
    addScheduleDependency,
    removeScheduleDependency,
    // getAllScheduleDependencies,

    // Schedule Calendar
    getCalendarEvents,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
} = require("../controllers/schedule.controller");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

// --- Schedule Routes ---
router.route("/projects/:projectId/schedules")
    .get(getProjectSchedules)
    .post(createSchedule);

router.route("/schedules/:id")
    .get(getScheduleById)
    .put(updateSchedule)
    .delete(deleteSchedule);

router.route("/schedules/:id/baseline")
    .post(createScheduleBaseline);
// router.route("/schedules/:id/critical-path").get(getCriticalPath); // Controller not implemented

// --- Schedule Item Routes ---
router.route("/schedules/:scheduleId/items")
    .get(getScheduleItems)
    .post(addScheduleItem);
// router.route("/schedules/:scheduleId/items/reorder").put(updateItemOrder); // Controller not implemented

router.route("/schedule-items/:id")
    // .get(getScheduleItemById) // Controller not implemented, add if needed
    .put(updateScheduleItem)
    .delete(deleteScheduleItem);
// router.route("/schedule-items/:id/status").put(updateItemStatus); // Handled by updateScheduleItem
// router.route("/schedule-items/:id/progress").put(updateItemProgress); // Handled by updateScheduleItem

// --- Schedule Dependency Routes ---
router.route("/schedule-items/:itemId/dependencies")
    .get(getItemDependencies)
    .post(addScheduleDependency);

router.route("/schedule-dependencies/:id")
    .delete(removeScheduleDependency);
// router.route("/schedules/:scheduleId/dependencies").get(getAllScheduleDependencies); // Controller not implemented

// --- Schedule Calendar Routes ---
router.route("/schedules/:scheduleId/calendar")
    .get(getCalendarEvents) // Requires startDate & endDate query params
    .post(addCalendarEvent);

router.route("/schedule-calendar/:id")
    .put(updateCalendarEvent)
    .delete(deleteCalendarEvent);

module.exports = router;

