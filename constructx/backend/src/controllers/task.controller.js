const Task = require("../models/task.model");
const Project = require("../models/project.model"); // To verify project access
const TaskDependency = require("../models/taskDependency.model");
const TaskComment = require("../models/taskComment.model");
const TaskAttachment = require("../models/taskAttachment.model");
const TimeEntry = require("../models/timeEntry.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
// Add file handling (e.g., multer for uploads) if not already configured globally

// Helper function to check project access
const checkProjectAccess = async (projectId, userId, companyId) => {
    const project = await Project.findOne({ _id: projectId, companyId: companyId });
    if (!project) {
        throw new ApiError(404, "Project not found or access denied");
    }
    // Add more granular permission checks based on ProjectMember if needed
    // const member = await ProjectMember.findOne({ projectId, userId });
    // if (!member) throw new ApiError(403, "User is not a member of this project");
    return project;
};

// Helper function to check task access (ensures task belongs to an accessible project)
const checkTaskAccess = async (taskId, userId, companyId) => {
    const task = await Task.findById(taskId).populate("projectId");
    if (!task) {
        throw new ApiError(404, "Task not found");
    }
    if (task.projectId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to this task");
    }
    // Add member check if needed
    return task;
};

// --- Task Controllers ---

// @desc    List all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getProjectTasks = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    // Add filtering (status, priority, assignedTo, phaseId), sorting, pagination
    const tasks = await Task.find({ projectId: projectId })
        .populate("assignedTo", "firstName lastName email")
        .populate("createdBy", "firstName lastName email")
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
});

// @desc    Get specific task details
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
    const task = await checkTaskAccess(req.params.id, req.user.id, req.user.companyId);

    // Populate related fields
    await task.populate([
        { path: "assignedTo", select: "firstName lastName email" },
        { path: "createdBy", select: "firstName lastName email" },
        { path: "phaseId", select: "name" },
        { path: "parentTaskId", select: "title" }
    ]);

    res.status(200).json(new ApiResponse(200, task, "Task retrieved successfully"));
});

// @desc    Create new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    const {
        phaseId, parentTaskId, title, description, status, priority,
        assignedTo, startDate, dueDate, estimatedHours, tags
    } = req.body;

    if (!title || !assignedTo || !startDate || !dueDate) {
        throw new ApiError(400, "Title, assigned user, start date, and due date are required");
    }

    const task = await Task.create({
        projectId,
        phaseId,
        parentTaskId,
        title,
        description,
        status: status || "Not Started",
        priority: priority || "Medium",
        assignedTo,
        createdBy: req.user.id,
        startDate,
        dueDate,
        estimatedHours,
        tags,
    });

    res.status(201).json(new ApiResponse(201, task, "Task created successfully"));
});

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const updates = req.body;
    const task = await checkTaskAccess(taskId, req.user.id, req.user.companyId);

    // Prevent updating certain fields
    delete updates.projectId;
    delete updates.createdBy;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.isDeleted;
    delete updates.deletedAt;
    delete updates.actualHours; // Should be updated via time entries

    // Handle completion percentage/date if status changes to Completed
    if (updates.status === "Completed" && task.status !== "Completed") {
        updates.completedDate = new Date();
        updates.completionPercentage = 100;
    } else if (updates.status && updates.status !== "Completed") {
        updates.completedDate = null; // Clear completed date if status changes from Completed
        // Optionally reset completionPercentage or handle it based on logic
    }

    Object.assign(task, updates);
    await task.save();

    res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

// @desc    Delete task (soft delete)
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const task = await checkTaskAccess(taskId, req.user.id, req.user.companyId);

    task.isDeleted = true;
    task.deletedAt = new Date();
    await task.save();

    // Optionally soft delete subtasks, comments, attachments, time entries, dependencies
    // await Task.updateMany({ parentTaskId: taskId }, { $set: { isDeleted: true, deletedAt: new Date() } });
    // ... similar updates for other related models

    res.status(200).json(new ApiResponse(200, {}, "Task deleted successfully"));
});

// --- Task Dependency Controllers ---

// @desc    List all dependencies for a task
// @route   GET /api/tasks/:taskId/dependencies
// @access  Private
const getTaskDependencies = asyncHandler(async (req, res) => {
    const taskId = req.params.taskId;
    await checkTaskAccess(taskId, req.user.id, req.user.companyId);

    const predecessors = await TaskDependency.find({ successorTaskId: taskId })
        .populate("predecessorTaskId", "title status");
    const successors = await TaskDependency.find({ predecessorTaskId: taskId })
        .populate("successorTaskId", "title status");

    res.status(200).json(new ApiResponse(200, { predecessors, successors }, "Task dependencies retrieved successfully"));
});

// @desc    Add dependency to task
// @route   POST /api/tasks/:taskId/dependencies
// @access  Private
const addTaskDependency = asyncHandler(async (req, res) => {
    const successorTaskId = req.params.taskId; // The task receiving the dependency
    const { predecessorTaskId, type, lag } = req.body;

    // Check access for both tasks
    await checkTaskAccess(successorTaskId, req.user.id, req.user.companyId);
    await checkTaskAccess(predecessorTaskId, req.user.id, req.user.companyId);

    if (!predecessorTaskId) {
        throw new ApiError(400, "Predecessor task ID is required");
    }

    if (predecessorTaskId === successorTaskId) {
        throw new ApiError(400, "A task cannot depend on itself");
    }

    // Check for circular dependencies (complex logic, potentially skip for basic implementation)

    const dependency = await TaskDependency.create({
        predecessorTaskId,
        successorTaskId,
        type: type || "Finish-to-Start",
        lag: lag || 0,
        createdBy: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, dependency, "Task dependency added successfully"));
});

// @desc    Remove dependency
// @route   DELETE /api/tasks/dependencies/:id
// @access  Private
const removeTaskDependency = asyncHandler(async (req, res) => {
    const dependencyId = req.params.id;

    const dependency = await TaskDependency.findById(dependencyId)
        .populate({ path: "successorTaskId", populate: { path: "projectId" } }); // Need project for access check

    if (!dependency) {
        throw new ApiError(404, "Dependency not found");
    }

    // Check access via the successor task
    if (dependency.successorTaskId.projectId.companyId.toString() !== req.user.companyId.toString()) {
        throw new ApiError(403, "Access denied to remove this dependency");
    }

    await TaskDependency.deleteOne({ _id: dependencyId });

    res.status(200).json(new ApiResponse(200, {}, "Task dependency removed successfully"));
});

// --- Task Comment Controllers ---

// @desc    List all comments for a task
// @route   GET /api/tasks/:taskId/comments
// @access  Private
const getTaskComments = asyncHandler(async (req, res) => {
    const taskId = req.params.taskId;
    await checkTaskAccess(taskId, req.user.id, req.user.companyId);

    const comments = await TaskComment.find({ taskId: taskId })
        .populate("createdBy", "firstName lastName email avatar")
        .sort({ createdAt: 1 }); // Sort oldest first

    res.status(200).json(new ApiResponse(200, comments, "Task comments retrieved successfully"));
});

// @desc    Add comment to task
// @route   POST /api/tasks/:taskId/comments
// @access  Private
const addTaskComment = asyncHandler(async (req, res) => {
    const taskId = req.params.taskId;
    const { content } = req.body;
    await checkTaskAccess(taskId, req.user.id, req.user.companyId);

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await TaskComment.create({
        taskId,
        content,
        createdBy: req.user.id,
    });

    // Populate createdBy before sending response
    await comment.populate("createdBy", "firstName lastName email avatar");

    res.status(201).json(new ApiResponse(201, comment, "Task comment added successfully"));
});

// --- Task Attachment Controllers ---
// Requires file upload middleware (e.g., multer) configured

// @desc    List all attachments for a task
// @route   GET /api/tasks/:taskId/attachments
// @access  Private
const getTaskAttachments = asyncHandler(async (req, res) => {
    const taskId = req.params.taskId;
    await checkTaskAccess(taskId, req.user.id, req.user.companyId);

    const attachments = await TaskAttachment.find({ taskId: taskId })
        .populate("uploadedBy", "firstName lastName email");

    res.status(200).json(new ApiResponse(200, attachments, "Task attachments retrieved successfully"));
});

// @desc    Upload attachment to task
// @route   POST /api/tasks/:taskId/attachments
// @access  Private
const addTaskAttachment = asyncHandler(async (req, res) => {
    const taskId = req.params.taskId;
    await checkTaskAccess(taskId, req.user.id, req.user.companyId);

    // Assuming multer middleware handles the upload and adds file info to req.file
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    const { originalname, size, mimetype, path } = req.file;

    const attachment = await TaskAttachment.create({
        taskId,
        fileName: originalname,
        fileSize: size,
        fileType: mimetype,
        filePath: path, // Path where multer stored the file (e.g., local path or S3 key)
        uploadedBy: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, attachment, "Attachment uploaded successfully"));
});

// @desc    Delete attachment
// @route   DELETE /api/tasks/attachments/:id
// @access  Private
const removeTaskAttachment = asyncHandler(async (req, res) => {
    const attachmentId = req.params.id;

    const attachment = await TaskAttachment.findById(attachmentId)
        .populate({ path: "taskId", populate: { path: "projectId" } });

    if (!attachment) {
        throw new ApiError(404, "Attachment not found");
    }

    // Check access via the task
    if (attachment.taskId.projectId.companyId.toString() !== req.user.companyId.toString()) {
        throw new ApiError(403, "Access denied to remove this attachment");
    }

    // TODO: Delete the actual file from storage (e.g., S3 or local filesystem)
    // fs.unlink(attachment.filePath, (err) => { ... });

    await TaskAttachment.deleteOne({ _id: attachmentId });

    res.status(200).json(new ApiResponse(200, {}, "Attachment removed successfully"));
});

// --- Time Entry Controllers ---

// @desc    List all time entries for a task
// @route   GET /api/tasks/:taskId/time-entries
// @access  Private
const getTaskTimeEntries = asyncHandler(async (req, res) => {
    const taskId = req.params.taskId;
    await checkTaskAccess(taskId, req.user.id, req.user.companyId);

    // Add filtering by user, date range
    const timeEntries = await TimeEntry.find({ taskId: taskId })
        .populate("userId", "firstName lastName email")
        .sort({ startTime: -1 });

    res.status(200).json(new ApiResponse(200, timeEntries, "Time entries retrieved successfully"));
});

// @desc    Create time entry for task (manual entry)
// @route   POST /api/tasks/:taskId/time-entries
// @access  Private
const addTimeEntry = asyncHandler(async (req, res) => {
    const taskId = req.params.taskId;
    const { description, startTime, endTime, duration, billable, userId } = req.body;
    await checkTaskAccess(taskId, req.user.id, req.user.companyId);

    const entryUserId = userId || req.user.id; // Allow admins to log time for others?

    if (!startTime || (!endTime && !duration)) {
        throw new ApiError(400, "Start time and either end time or duration are required for manual entry");
    }

    let entryDuration = duration;
    let entryEndTime = endTime;

    if (startTime && endTime) {
        entryDuration = Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60));
    } else if (startTime && duration) {
        entryEndTime = new Date(new Date(startTime).getTime() + duration * 60 * 1000);
    }

    const timeEntry = await TimeEntry.create({
        taskId,
        userId: entryUserId,
        description,
        startTime,
        endTime: entryEndTime,
        duration: entryDuration,
        billable: billable || false,
        isRunning: false, // Manual entries are never running
    });

    // Update task actualHours
    const task = await Task.findById(taskId);
    const totalDuration = await TimeEntry.aggregate([
        { $match: { taskId: mongoose.Types.ObjectId(taskId) } },
        { $group: { _id: null, totalMinutes: { $sum: "$duration" } } }
    ]);
    task.actualHours = totalDuration.length > 0 ? (totalDuration[0].totalMinutes / 60).toFixed(2) : 0;
    await task.save();

    res.status(201).json(new ApiResponse(201, timeEntry, "Time entry added successfully"));
});

// @desc    Start time tracking for a task
// @route   POST /api/tasks/:taskId/time-entries/start
// @access  Private
const startTimeTracking = asyncHandler(async (req, res) => {
    const taskId = req.params.taskId;
    await checkTaskAccess(taskId, req.user.id, req.user.companyId);

    // Stop any currently running timer for the user
    const runningTimer = await TimeEntry.findOneAndUpdate(
        { userId: req.user.id, isRunning: true },
        { $set: { endTime: new Date(), isRunning: false } },
        { new: true } // `new` option returns the modified document
    );

    // Manually trigger pre-save hook if needed or recalculate duration here
    if (runningTimer) {
        runningTimer.duration = Math.round((runningTimer.endTime.getTime() - runningTimer.startTime.getTime()) / (1000 * 60));
        await runningTimer.save();
        // Update the previous task's actual hours
        const prevTask = await Task.findById(runningTimer.taskId);
        if (prevTask) {
            const totalDuration = await TimeEntry.aggregate([
                { $match: { taskId: mongoose.Types.ObjectId(runningTimer.taskId) } },
                { $group: { _id: null, totalMinutes: { $sum: "$duration" } } }
            ]);
            prevTask.actualHours = totalDuration.length > 0 ? (totalDuration[0].totalMinutes / 60).toFixed(2) : 0;
            await prevTask.save();
        }
    }

    // Start new timer
    const newTimer = await TimeEntry.create({
        taskId,
        userId: req.user.id,
        startTime: new Date(),
        isRunning: true,
        billable: req.body.billable || false, // Optionally set billable on start
        description: req.body.description || "", // Optionally add description on start
    });

    res.status(201).json(new ApiResponse(201, newTimer, "Time tracking started successfully"));
});

// @desc    Stop time tracking for a specific entry
// @route   PUT /api/time-entries/:id/stop
// @access  Private
const stopTimeTracking = asyncHandler(async (req, res) => {
    const timeEntryId = req.params.id;

    const timer = await TimeEntry.findOne({ _id: timeEntryId, userId: req.user.id });

    if (!timer) {
        throw new ApiError(404, "Time entry not found or access denied");
    }

    if (!timer.isRunning) {
        throw new ApiError(400, "Timer is not running");
    }

    timer.endTime = new Date();
    timer.isRunning = false;
    // Duration is calculated in pre-save hook
    await timer.save();

    // Update task actualHours
    const task = await Task.findById(timer.taskId);
    if (task) {
        const totalDuration = await TimeEntry.aggregate([
            { $match: { taskId: mongoose.Types.ObjectId(timer.taskId) } },
            { $group: { _id: null, totalMinutes: { $sum: "$duration" } } }
        ]);
        task.actualHours = totalDuration.length > 0 ? (totalDuration[0].totalMinutes / 60).toFixed(2) : 0;
        await task.save();
    }

    res.status(200).json(new ApiResponse(200, timer, "Time tracking stopped successfully"));
});

// @desc    Update time entry (for manual entries or stopped timers)
// @route   PUT /api/time-entries/:id
// @access  Private
const updateTimeEntry = asyncHandler(async (req, res) => {
    const timeEntryId = req.params.id;
    const updates = req.body;

    const timeEntry = await TimeEntry.findOne({ _id: timeEntryId, userId: req.user.id });

    if (!timeEntry) {
        throw new ApiError(404, "Time entry not found or access denied");
    }

    if (timeEntry.isRunning) {
        throw new ApiError(400, "Cannot update a running timer. Stop it first.");
    }

    // Prevent updating certain fields
    delete updates.taskId;
    delete updates.userId;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.isRunning;

    Object.assign(timeEntry, updates);
    // Recalculate duration if start/end times changed
    if (updates.startTime || updates.endTime) {
        timeEntry.duration = Math.round((timeEntry.endTime.getTime() - timeEntry.startTime.getTime()) / (1000 * 60));
    }

    await timeEntry.save();

    // Update task actualHours
    const task = await Task.findById(timeEntry.taskId);
    if (task) {
        const totalDuration = await TimeEntry.aggregate([
            { $match: { taskId: mongoose.Types.ObjectId(timeEntry.taskId) } },
            { $group: { _id: null, totalMinutes: { $sum: "$duration" } } }
        ]);
        task.actualHours = totalDuration.length > 0 ? (totalDuration[0].totalMinutes / 60).toFixed(2) : 0;
        await task.save();
    }

    res.status(200).json(new ApiResponse(200, timeEntry, "Time entry updated successfully"));
});

// @desc    Delete time entry
// @route   DELETE /api/time-entries/:id
// @access  Private
const deleteTimeEntry = asyncHandler(async (req, res) => {
    const timeEntryId = req.params.id;

    const timeEntry = await TimeEntry.findOne({ _id: timeEntryId, userId: req.user.id });

    if (!timeEntry) {
        throw new ApiError(404, "Time entry not found or access denied");
    }

    if (timeEntry.isRunning) {
        throw new ApiError(400, "Cannot delete a running timer. Stop it first.");
    }

    const taskId = timeEntry.taskId;
    await TimeEntry.deleteOne({ _id: timeEntryId });

    // Update task actualHours
    const task = await Task.findById(taskId);
    if (task) {
        const totalDuration = await TimeEntry.aggregate([
            { $match: { taskId: mongoose.Types.ObjectId(taskId) } },
            { $group: { _id: null, totalMinutes: { $sum: "$duration" } } }
        ]);
        task.actualHours = totalDuration.length > 0 ? (totalDuration[0].totalMinutes / 60).toFixed(2) : 0;
        await task.save();
    }

    res.status(200).json(new ApiResponse(200, {}, "Time entry deleted successfully"));
});


module.exports = {
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
    // Add controllers for getting statuses/priorities/dependency-types if needed
};

