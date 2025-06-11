const Schedule = require("../models/schedule.model");
const ScheduleItem = require("../models/scheduleItem.model");
const ScheduleDependency = require("../models/scheduleDependency.model");
const ScheduleBaseline = require("../models/scheduleBaseline.model");
const ScheduleCalendarEvent = require("../models/scheduleCalendarEvent.model");
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

// Check schedule access
const checkScheduleAccess = async (scheduleId, userId, companyId) => {
    const schedule = await Schedule.findById(scheduleId).populate("projectId");
    if (!schedule) {
        throw new ApiError(404, "Schedule not found");
    }
    if (schedule.projectId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to this schedule");
    }
    return schedule;
};

// Check schedule item access
const checkScheduleItemAccess = async (itemId, userId, companyId) => {
    const item = await ScheduleItem.findById(itemId).populate({ path: "scheduleId", populate: { path: "projectId" } });
    if (!item) {
        throw new ApiError(404, "Schedule item not found");
    }
    if (item.scheduleId.projectId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to this schedule item");
    }
    return item;
};

// --- Schedule Controllers ---

// @desc    List all schedules for a project
// @route   GET /api/projects/:projectId/schedules
// @access  Private
const getProjectSchedules = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    const schedules = await Schedule.find({ projectId: projectId })
        .populate("createdBy", "firstName lastName")
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, schedules, "Schedules retrieved successfully"));
});

// @desc    Get specific schedule details
// @route   GET /api/schedules/:id
// @access  Private
const getScheduleById = asyncHandler(async (req, res) => {
    const schedule = await checkScheduleAccess(req.params.id, req.user.id, req.user.companyId);
    await schedule.populate("createdBy", "firstName lastName");
    res.status(200).json(new ApiResponse(200, schedule, "Schedule retrieved successfully"));
});

// @desc    Create new schedule
// @route   POST /api/projects/:projectId/schedules
// @access  Private
const createSchedule = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    const { name, description, startDate, endDate, status } = req.body;

    if (!name || !startDate || !endDate) {
        throw new ApiError(400, "Schedule name, start date, and end date are required");
    }

    const schedule = await Schedule.create({
        projectId,
        name,
        description,
        startDate,
        endDate,
        status: status || "Draft",
        createdBy: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, schedule, "Schedule created successfully"));
});

// @desc    Update schedule details
// @route   PUT /api/schedules/:id
// @access  Private
const updateSchedule = asyncHandler(async (req, res) => {
    const scheduleId = req.params.id;
    const updates = req.body;
    const schedule = await checkScheduleAccess(scheduleId, req.user.id, req.user.companyId);

    // Allow updating specific fields
    const allowedUpdates = ["name", "description", "startDate", "endDate", "status"];
    Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
            schedule[key] = updates[key];
        }
    });

    await schedule.save();
    res.status(200).json(new ApiResponse(200, schedule, "Schedule updated successfully"));
});

// @desc    Delete schedule (soft delete)
// @route   DELETE /api/schedules/:id
// @access  Private
const deleteSchedule = asyncHandler(async (req, res) => {
    const scheduleId = req.params.id;
    const schedule = await checkScheduleAccess(scheduleId, req.user.id, req.user.companyId);

    // TODO: Handle deletion of related items (items, dependencies, baselines, events)
    // For now, just soft-delete the schedule itself.
    schedule.isDeleted = true;
    schedule.deletedAt = new Date();
    await schedule.save();

    res.status(200).json(new ApiResponse(200, {}, "Schedule deleted successfully"));
});

// @desc    Create schedule baseline
// @route   POST /api/schedules/:id/baseline
// @access  Private
const createScheduleBaseline = asyncHandler(async (req, res) => {
    const scheduleId = req.params.id;
    const { name, description } = req.body;
    const schedule = await checkScheduleAccess(scheduleId, req.user.id, req.user.companyId);

    if (!name) {
        throw new ApiError(400, "Baseline name is required");
    }

    // Fetch all current items for this schedule to create snapshot
    const itemsSnapshot = await ScheduleItem.find({ scheduleId: scheduleId }).lean();

    // Map to the baseline data structure
    const baselineData = itemsSnapshot.map(item => ({
        originalItemId: item._id,
        name: item.name,
        type: item.type,
        startDate: item.startDate,
        endDate: item.endDate,
        duration: item.duration,
        // Add other relevant fields as needed
    }));

    const baseline = await ScheduleBaseline.create({
        scheduleId,
        name,
        description,
        createdBy: req.user.id,
        baselineData,
    });

    // Optionally update the main schedule baseline dates
    schedule.baselineStartDate = schedule.startDate;
    schedule.baselineEndDate = schedule.endDate;
    await schedule.save();

    res.status(201).json(new ApiResponse(201, baseline, "Schedule baseline created successfully"));
});

// --- Schedule Item Controllers ---

// @desc    List all items in a schedule
// @route   GET /api/schedules/:scheduleId/items
// @access  Private
const getScheduleItems = asyncHandler(async (req, res) => {
    const scheduleId = req.params.scheduleId;
    await checkScheduleAccess(scheduleId, req.user.id, req.user.companyId);

    // Add filtering, sorting (by order), pagination
    const items = await ScheduleItem.find({ scheduleId: scheduleId })
        .populate("assignedTo", "firstName lastName")
        .populate("taskId", "title") // Populate linked task if exists
        .sort({ order: 1, createdAt: 1 });

    res.status(200).json(new ApiResponse(200, items, "Schedule items retrieved successfully"));
});

// @desc    Add item to schedule
// @route   POST /api/schedules/:scheduleId/items
// @access  Private
const addScheduleItem = asyncHandler(async (req, res) => {
    const scheduleId = req.params.scheduleId;
    await checkScheduleAccess(scheduleId, req.user.id, req.user.companyId);

    const {
        parentItemId, taskId, name, description, type, startDate, endDate,
        duration, completionPercentage, status, assignedTo, order
    } = req.body;

    if (!name || !type || !startDate || (!endDate && !duration)) {
        throw new ApiError(400, "Item name, type, start date, and either end date or duration are required");
    }

    // Calculate end date or duration if one is missing
    let itemStartDate = new Date(startDate);
    let itemEndDate = endDate ? new Date(endDate) : null;
    let itemDuration = duration;

    if (itemEndDate && !itemDuration) {
        const diffTime = Math.abs(itemEndDate.getTime() - itemStartDate.getTime());
        itemDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } else if (!itemEndDate && itemDuration) {
        // Calculate end date based on start date and duration (consider non-working days later)
        itemEndDate = new Date(itemStartDate.getTime() + (itemDuration - 1) * 24 * 60 * 60 * 1000);
    }

    // Determine order if not provided (append to the end of the current level)
    let itemOrder = order;
    if (itemOrder === undefined || itemOrder === null) {
        const lastItem = await ScheduleItem.findOne({ scheduleId, parentItemId: parentItemId || null }).sort({ order: -1 });
        itemOrder = lastItem ? lastItem.order + 1 : 0;
    }

    const newItem = await ScheduleItem.create({
        scheduleId,
        parentItemId: parentItemId || null,
        taskId,
        name,
        description,
        type,
        startDate: itemStartDate,
        endDate: itemEndDate,
        duration: itemDuration,
        completionPercentage: completionPercentage || 0,
        status: status || "Not Started",
        assignedTo,
        order: itemOrder,
        // createdBy: req.user.id, // Schema doesn't have createdBy, add if needed
    });

    res.status(201).json(new ApiResponse(201, newItem, "Schedule item added successfully"));
});

// @desc    Update schedule item
// @route   PUT /api/schedule-items/:id
// @access  Private
const updateScheduleItem = asyncHandler(async (req, res) => {
    const itemId = req.params.id;
    const updates = req.body;
    const item = await checkScheduleItemAccess(itemId, req.user.id, req.user.companyId);

    // Allow updating specific fields
    const allowedUpdates = [
        "parentItemId", "taskId", "name", "description", "type", "startDate", "endDate",
        "duration", "completionPercentage", "status", "assignedTo", "order"
    ];

    let datesChanged = false;
    Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
            if (key === "startDate" || key === "endDate") datesChanged = true;
            item[key] = updates[key];
        }
    });

    // Recalculate duration or end date if dates changed
    if (datesChanged) {
        if (updates.startDate && updates.endDate) {
            const diffTime = Math.abs(new Date(item.endDate).getTime() - new Date(item.startDate).getTime());
            item.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        } else if (updates.startDate && item.duration) {
            item.endDate = new Date(new Date(item.startDate).getTime() + (item.duration - 1) * 24 * 60 * 60 * 1000);
        } else if (updates.endDate && item.duration) {
            // Less common, maybe recalculate start date or duration?
        }
    }

    await item.save();
    res.status(200).json(new ApiResponse(200, item, "Schedule item updated successfully"));
});

// @desc    Remove item from schedule (soft delete)
// @route   DELETE /api/schedule-items/:id
// @access  Private
const deleteScheduleItem = asyncHandler(async (req, res) => {
    const itemId = req.params.id;
    const item = await checkScheduleItemAccess(itemId, req.user.id, req.user.companyId);

    // TODO: Handle deletion of child items and dependencies
    item.isDeleted = true;
    item.deletedAt = new Date();
    await item.save();

    res.status(200).json(new ApiResponse(200, {}, "Schedule item deleted successfully"));
});

// --- Schedule Dependency Controllers ---

// @desc    List all dependencies for an item
// @route   GET /api/schedule-items/:itemId/dependencies
// @access  Private
const getItemDependencies = asyncHandler(async (req, res) => {
    const itemId = req.params.itemId;
    await checkScheduleItemAccess(itemId, req.user.id, req.user.companyId);

    const predecessors = await ScheduleDependency.find({ successorId: itemId })
        .populate("predecessorId", "name type");
    const successors = await ScheduleDependency.find({ predecessorId: itemId })
        .populate("successorId", "name type");

    res.status(200).json(new ApiResponse(200, { predecessors, successors }, "Item dependencies retrieved successfully"));
});

// @desc    Add dependency
// @route   POST /api/schedule-items/:itemId/dependencies
// @access  Private
const addScheduleDependency = asyncHandler(async (req, res) => {
    const successorId = req.params.itemId; // The item receiving the dependency
    const { predecessorId, type, lag } = req.body;

    // Check access for both items
    const successorItem = await checkScheduleItemAccess(successorId, req.user.id, req.user.companyId);
    const predecessorItem = await checkScheduleItemAccess(predecessorId, req.user.id, req.user.companyId);

    // Ensure both items belong to the same schedule
    if (successorItem.scheduleId.toString() !== predecessorItem.scheduleId.toString()) {
        throw new ApiError(400, "Cannot create dependencies between items in different schedules");
    }

    if (!predecessorId) {
        throw new ApiError(400, "Predecessor item ID is required");
    }
    if (predecessorId === successorId) {
        throw new ApiError(400, "An item cannot depend on itself");
    }

    // TODO: Check for circular dependencies (complex logic)

    const dependency = await ScheduleDependency.create({
        predecessorId,
        successorId,
        type: type || "Finish-to-Start",
        lag: lag || 0,
        createdBy: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, dependency, "Schedule dependency added successfully"));
});

// @desc    Remove dependency
// @route   DELETE /api/schedule-dependencies/:id
// @access  Private
const removeScheduleDependency = asyncHandler(async (req, res) => {
    const dependencyId = req.params.id;

    const dependency = await ScheduleDependency.findById(dependencyId)
        .populate({ path: "successorId", populate: { path: "scheduleId", populate: { path: "projectId" } } });

    if (!dependency) {
        throw new ApiError(404, "Dependency not found");
    }

    // Check access via the successor item's schedule/project
    if (dependency.successorId.scheduleId.projectId.companyId.toString() !== req.user.companyId.toString()) {
        throw new ApiError(403, "Access denied to remove this dependency");
    }

    await ScheduleDependency.deleteOne({ _id: dependencyId });

    res.status(200).json(new ApiResponse(200, {}, "Schedule dependency removed successfully"));
});

// --- Schedule Calendar Event Controllers ---

// @desc    Get calendar events for schedule (within a date range)
// @route   GET /api/schedules/:scheduleId/calendar?startDate=...&endDate=...
// @access  Private
const getCalendarEvents = asyncHandler(async (req, res) => {
    const scheduleId = req.params.scheduleId;
    const { startDate, endDate } = req.query;
    await checkScheduleAccess(scheduleId, req.user.id, req.user.companyId);

    if (!startDate || !endDate) {
        throw new ApiError(400, "Start date and end date query parameters are required");
    }

    const query = {
        scheduleId: scheduleId,
        startDateTime: { $lte: new Date(endDate) },
        endDateTime: { $gte: new Date(startDate) },
    };

    const events = await ScheduleCalendarEvent.find(query)
        .populate("createdBy", "firstName lastName")
        .populate("scheduleItemId", "name")
        .sort({ startDateTime: 1 });

    res.status(200).json(new ApiResponse(200, events, "Calendar events retrieved successfully"));
});

// @desc    Add calendar event
// @route   POST /api/schedules/:scheduleId/calendar
// @access  Private
const addCalendarEvent = asyncHandler(async (req, res) => {
    const scheduleId = req.params.scheduleId;
    await checkScheduleAccess(scheduleId, req.user.id, req.user.companyId);

    const {
        scheduleItemId, title, description, startDateTime, endDateTime,
        allDay, location, type
    } = req.body;

    if (!title || !startDateTime || !endDateTime) {
        throw new ApiError(400, "Event title, start date/time, and end date/time are required");
    }

    const event = await ScheduleCalendarEvent.create({
        scheduleId,
        scheduleItemId,
        title,
        description,
        startDateTime,
        endDateTime,
        allDay: allDay || false,
        location,
        type,
        createdBy: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, event, "Calendar event added successfully"));
});

// @desc    Update calendar event
// @route   PUT /api/schedule-calendar/:id
// @access  Private
const updateCalendarEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.id;
    const updates = req.body;

    const event = await ScheduleCalendarEvent.findById(eventId)
        .populate({ path: "scheduleId", populate: { path: "projectId" } });

    if (!event) {
        throw new ApiError(404, "Calendar event not found");
    }

    // Check access via the schedule/project
    if (event.scheduleId.projectId.companyId.toString() !== req.user.companyId.toString()) {
        throw new ApiError(403, "Access denied to update this event");
    }

    // Allow updating specific fields
    const allowedUpdates = [
        "scheduleItemId", "title", "description", "startDateTime", "endDateTime",
        "allDay", "location", "type"
    ];
    Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
            event[key] = updates[key];
        }
    });

    await event.save();
    res.status(200).json(new ApiResponse(200, event, "Calendar event updated successfully"));
});

// @desc    Delete calendar event
// @route   DELETE /api/schedule-calendar/:id
// @access  Private
const deleteCalendarEvent = asyncHandler(async (req, res) => {
    const eventId = req.params.id;

    const event = await ScheduleCalendarEvent.findById(eventId)
        .populate({ path: "scheduleId", populate: { path: "projectId" } });

    if (!event) {
        throw new ApiError(404, "Calendar event not found");
    }

    // Check access via the schedule/project
    if (event.scheduleId.projectId.companyId.toString() !== req.user.companyId.toString()) {
        throw new ApiError(403, "Access denied to delete this event");
    }

    await ScheduleCalendarEvent.deleteOne({ _id: eventId });

    res.status(200).json(new ApiResponse(200, {}, "Calendar event deleted successfully"));
});


module.exports = {
    // Schedule
    getProjectSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    createScheduleBaseline,
    // getCriticalPath, // TODO: Implement critical path logic

    // Schedule Items
    getScheduleItems,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    // updateItemOrder, // TODO: Implement reordering logic
    // updateItemStatus, // Handled by updateScheduleItem
    // updateItemProgress, // Handled by updateScheduleItem

    // Schedule Dependencies
    getItemDependencies,
    addScheduleDependency,
    removeScheduleDependency,
    // getAllScheduleDependencies, // TODO: Implement if needed

    // Schedule Calendar
    getCalendarEvents,
    addCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
};

