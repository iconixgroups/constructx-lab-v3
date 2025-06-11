const Project = require("../models/project.model");
const ProjectPhase = require("../models/projectPhase.model");
const ProjectMember = require("../models/projectMember.model");
const ProjectMetric = require("../models/projectMetric.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// --- Project Controllers ---

// @desc    Get all projects with filtering and pagination
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
    // Basic implementation - add filtering (status, type, manager), sorting, pagination
    const projects = await Project.find({ companyId: req.user.companyId })
        .populate("projectManager", "firstName lastName email")
        .populate("clientId", "name") // Populate client company name
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, projects, "Projects retrieved successfully"));
});

// @desc    Get specific project details
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findOne({ _id: req.params.id, companyId: req.user.companyId })
        .populate("projectManager", "firstName lastName email")
        .populate("clientId", "name")
        .populate("contractId"); // Populate contract if needed

    if (!project) {
        throw new ApiError(404, "Project not found");
    }
    res.status(200).json(new ApiResponse(200, project, "Project retrieved successfully"));
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
    const {
        name, code, description, clientId, contractId, status,
        startDate, targetCompletionDate, budget, location, address,
        gpsCoordinates, projectType, projectManager, tags, customFields
    } = req.body;

    // Basic validation
    if (!name || !code || !clientId || !startDate || !targetCompletionDate || !budget || !projectManager) {
        throw new ApiError(400, "Missing required project fields");
    }

    // Check if project code is unique for the company
    const existingProject = await Project.findOne({ code: code, companyId: req.user.companyId });
    if (existingProject) {
        throw new ApiError(400, `Project code '${code}' already exists for this company.`);
    }

    const project = await Project.create({
        companyId: req.user.companyId,
        name,
        code,
        description,
        clientId,
        contractId,
        status: status || "Planning",
        startDate,
        targetCompletionDate,
        budget,
        location,
        address,
        gpsCoordinates,
        projectType,
        projectManager,
        createdBy: req.user.id,
        tags,
        customFields,
    });

    // Add the creator/project manager as a project member automatically
    await ProjectMember.create({
        projectId: project._id,
        userId: projectManager, // Assuming projectManager is the user ID
        role: "Project Manager", // Default role
        createdBy: req.user.id,
    });
    // If creator is different from PM and should also be added:
    if (req.user.id.toString() !== projectManager.toString()) {
         await ProjectMember.create({
            projectId: project._id,
            userId: req.user.id,
            role: "Creator", // Or another default role
            createdBy: req.user.id,
        });
    }

    res.status(201).json(new ApiResponse(201, project, "Project created successfully"));
});

// @desc    Update project details
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const updates = req.body;

    const project = await Project.findOne({ _id: projectId, companyId: req.user.companyId });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Prevent updating certain fields
    delete updates.companyId;
    delete updates.createdBy;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.code; // Usually project code shouldn't be changed
    delete updates.isDeleted;
    delete updates.deletedAt;

    // Check if project manager is being changed and update ProjectMember if necessary
    if (updates.projectManager && updates.projectManager !== project.projectManager.toString()) {
        // Remove old PM role (or update)
        await ProjectMember.findOneAndUpdate(
            { projectId: projectId, userId: project.projectManager, role: "Project Manager" },
            { removedAt: new Date() } // Or delete, depending on requirements
        );
        // Add new PM role
        await ProjectMember.findOneAndUpdate(
            { projectId: projectId, userId: updates.projectManager },
            { role: "Project Manager", removedAt: null, $setOnInsert: { createdBy: req.user.id, joinedAt: new Date() } },
            { upsert: true, new: true }
        );
    }

    Object.assign(project, updates);
    await project.save();

    res.status(200).json(new ApiResponse(200, project, "Project updated successfully"));
});

// @desc    Delete project (soft delete)
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
    const projectId = req.params.id;

    const project = await Project.findOne({ _id: projectId, companyId: req.user.companyId });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    project.isDeleted = true;
    project.deletedAt = new Date();
    await project.save();

    // Optionally: Soft delete related items like phases, members, metrics, tasks, documents etc.
    // This depends on cascading delete requirements.

    res.status(200).json(new ApiResponse(200, {}, "Project deleted successfully"));
});

// --- Project Phase Controllers ---

// @desc    List all phases for a project
// @route   GET /api/projects/:projectId/phases
// @access  Private
const getProjectPhases = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    // Verify project access
    const project = await Project.findOne({ _id: projectId, companyId: req.user.companyId });
    if (!project) throw new ApiError(404, "Project not found");

    const phases = await ProjectPhase.find({ projectId: projectId }).sort({ order: 1 });
    res.status(200).json(new ApiResponse(200, phases, "Project phases retrieved successfully"));
});

// @desc    Add phase to project
// @route   POST /api/projects/:projectId/phases
// @access  Private
const addProjectPhase = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    const { name, description, order, startDate, endDate, status, budget } = req.body;

    // Verify project access
    const project = await Project.findOne({ _id: projectId, companyId: req.user.companyId });
    if (!project) throw new ApiError(404, "Project not found");

    if (!name || !startDate || !endDate) {
        throw new ApiError(400, "Phase name, start date, and end date are required");
    }

    // Determine order if not provided
    let phaseOrder = order;
    if (phaseOrder === undefined) {
        const lastPhase = await ProjectPhase.findOne({ projectId }).sort({ order: -1 });
        phaseOrder = lastPhase ? lastPhase.order + 1 : 0;
    }

    const phase = await ProjectPhase.create({
        projectId,
        name,
        description,
        order: phaseOrder,
        startDate,
        endDate,
        status: status || "Not Started",
        budget,
    });

    res.status(201).json(new ApiResponse(201, phase, "Project phase added successfully"));
});

// @desc    Update phase details
// @route   PUT /api/projects/phases/:id
// @access  Private
const updateProjectPhase = asyncHandler(async (req, res) => {
    const phaseId = req.params.id;
    const updates = req.body;

    const phase = await ProjectPhase.findById(phaseId).populate("projectId");
    if (!phase || phase.projectId.companyId.toString() !== req.user.companyId.toString()) {
        throw new ApiError(404, "Project phase not found or access denied");
    }

    delete updates.projectId; // Cannot change project ID
    delete updates.createdAt;
    delete updates.updatedAt;

    Object.assign(phase, updates);
    await phase.save();

    res.status(200).json(new ApiResponse(200, phase, "Project phase updated successfully"));
});

// @desc    Remove phase from project
// @route   DELETE /api/projects/phases/:id
// @access  Private
const removeProjectPhase = asyncHandler(async (req, res) => {
    const phaseId = req.params.id;

    const phase = await ProjectPhase.findById(phaseId).populate("projectId");
    if (!phase || phase.projectId.companyId.toString() !== req.user.companyId.toString()) {
        throw new ApiError(404, "Project phase not found or access denied");
    }

    // Consider implications: delete related tasks? For now, just delete the phase.
    await ProjectPhase.deleteOne({ _id: phaseId });

    res.status(200).json(new ApiResponse(200, {}, "Project phase removed successfully"));
});

// --- Project Member Controllers ---

// @desc    List all members for a project
// @route   GET /api/projects/:projectId/members
// @access  Private
const getProjectMembers = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    // Verify project access
    const project = await Project.findOne({ _id: projectId, companyId: req.user.companyId });
    if (!project) throw new ApiError(404, "Project not found");

    const members = await ProjectMember.find({ projectId: projectId, removedAt: null })
        .populate("userId", "firstName lastName email avatar"); // Populate user details

    res.status(200).json(new ApiResponse(200, members, "Project members retrieved successfully"));
});

// @desc    Add member to project
// @route   POST /api/projects/:projectId/members
// @access  Private
const addProjectMember = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    const { userId, role, permissions } = req.body;

    // Verify project access
    const project = await Project.findOne({ _id: projectId, companyId: req.user.companyId });
    if (!project) throw new ApiError(404, "Project not found");

    if (!userId || !role) {
        throw new ApiError(400, "User ID and role are required");
    }

    // Check if member already exists (and potentially reactivate if removed)
    let member = await ProjectMember.findOne({ projectId, userId });

    if (member) {
        // If member exists but was removed, reactivate and update role/permissions
        if (member.removedAt) {
            member.role = role;
            member.permissions = permissions || {};
            member.removedAt = null;
            member.joinedAt = new Date(); // Reset joined date or keep original?
            await member.save();
            return res.status(200).json(new ApiResponse(200, member, "Project member reactivated successfully"));
        } else {
            // Member already active
            throw new ApiError(400, "User is already a member of this project");
        }
    } else {
        // Create new member
        member = await ProjectMember.create({
            projectId,
            userId,
            role,
            permissions: permissions || {},
            createdBy: req.user.id,
        });
    }

    res.status(201).json(new ApiResponse(201, member, "Project member added successfully"));
});

// @desc    Update member details/role
// @route   PUT /api/projects/members/:id
// @access  Private
const updateProjectMember = asyncHandler(async (req, res) => {
    const memberId = req.params.id;
    const { role, permissions } = req.body;

    const member = await ProjectMember.findById(memberId).populate("projectId");
    if (!member || member.projectId.companyId.toString() !== req.user.companyId.toString()) {
        throw new ApiError(404, "Project member not found or access denied");
    }

    if (member.removedAt) {
        throw new ApiError(400, "Cannot update a removed member. Reactivate first.");
    }

    if (role) member.role = role;
    if (permissions) member.permissions = permissions;

    await member.save();

    res.status(200).json(new ApiResponse(200, member, "Project member updated successfully"));
});

// @desc    Remove member from project (soft delete)
// @route   DELETE /api/projects/members/:id
// @access  Private
const removeProjectMember = asyncHandler(async (req, res) => {
    const memberId = req.params.id;

    const member = await ProjectMember.findById(memberId).populate("projectId");
    if (!member || member.projectId.companyId.toString() !== req.user.companyId.toString()) {
        throw new ApiError(404, "Project member not found or access denied");
    }

    // Prevent removing the last Project Manager? (Optional logic)
    // if (member.role === "Project Manager") {
    //     const otherPms = await ProjectMember.countDocuments({ projectId: member.projectId, role: "Project Manager", removedAt: null, _id: { $ne: memberId } });
    //     if (otherPms === 0) {
    //         throw new ApiError(400, "Cannot remove the last Project Manager");
    //     }
    // }

    member.removedAt = new Date();
    await member.save();

    res.status(200).json(new ApiResponse(200, {}, "Project member removed successfully"));
});

// --- Project Metric Controllers ---

// @desc    List all metrics for a project
// @route   GET /api/projects/:projectId/metrics
// @access  Private
const getProjectMetrics = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    // Verify project access
    const project = await Project.findOne({ _id: projectId, companyId: req.user.companyId });
    if (!project) throw new ApiError(404, "Project not found");

    // Add filtering by category, date range etc.
    const metrics = await ProjectMetric.find({ projectId: projectId }).sort({ date: -1, category: 1 });
    res.status(200).json(new ApiResponse(200, metrics, "Project metrics retrieved successfully"));
});

// @desc    Add metric to project
// @route   POST /api/projects/:projectId/metrics
// @access  Private
const addProjectMetric = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    const { name, category, value, target, unit, date } = req.body;

    // Verify project access
    const project = await Project.findOne({ _id: projectId, companyId: req.user.companyId });
    if (!project) throw new ApiError(404, "Project not found");

    if (!name || !category || value === undefined) {
        throw new ApiError(400, "Metric name, category, and value are required");
    }

    const metric = await ProjectMetric.create({
        projectId,
        name,
        category,
        value,
        target,
        unit,
        date: date || new Date(),
    });

    res.status(201).json(new ApiResponse(201, metric, "Project metric added successfully"));
});

// @desc    Update metric details
// @route   PUT /api/projects/metrics/:id
// @access  Private
const updateProjectMetric = asyncHandler(async (req, res) => {
    const metricId = req.params.id;
    const updates = req.body;

    const metric = await ProjectMetric.findById(metricId).populate("projectId");
    if (!metric || metric.projectId.companyId.toString() !== req.user.companyId.toString()) {
        throw new ApiError(404, "Project metric not found or access denied");
    }

    delete updates.projectId; // Cannot change project ID
    delete updates.createdAt;
    delete updates.updatedAt;

    Object.assign(metric, updates);
    await metric.save();

    res.status(200).json(new ApiResponse(200, metric, "Project metric updated successfully"));
});

// @desc    Remove metric from project
// @route   DELETE /api/projects/metrics/:id
// @access  Private
const removeProjectMetric = asyncHandler(async (req, res) => {
    const metricId = req.params.id;

    const metric = await ProjectMetric.findById(metricId).populate("projectId");
    if (!metric || metric.projectId.companyId.toString() !== req.user.companyId.toString()) {
        throw new ApiError(404, "Project metric not found or access denied");
    }

    await ProjectMetric.deleteOne({ _id: metricId });

    res.status(200).json(new ApiResponse(200, {}, "Project metric removed successfully"));
});


module.exports = {
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
    // Add controllers for reordering phases, getting roles/statuses/types etc. if needed
};

