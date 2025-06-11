const Resource = require("../models/resource.model");
const LaborResource = require("../models/laborResource.model");
const EquipmentResource = require("../models/equipmentResource.model");
const MaterialResource = require("../models/materialResource.model");
const ResourceAllocation = require("../models/resourceAllocation.model");
const ResourceAvailability = require("../models/resourceAvailability.model");
const ResourceUtilization = require("../models/resourceUtilization.model");
const Company = require("../models/company.model"); // To verify company access
const Project = require("../models/project.model"); // To verify project access for allocations/utilization
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const mongoose = require("mongoose");

// --- Helper Functions ---

// Check company access (ensure resource belongs to user's company)
const checkResourceAccess = async (resourceId, companyId) => {
    const resource = await Resource.findOne({ _id: resourceId, companyId: companyId });
    if (!resource) {
        throw new ApiError(404, "Resource not found or access denied");
    }
    return resource;
};

// Check project access (for allocations/utilization)
const checkProjectAccess = async (projectId, companyId) => {
    const project = await Project.findOne({ _id: projectId, companyId: companyId });
    if (!project) {
        throw new ApiError(404, "Project not found or access denied");
    }
    return project;
};

// --- Resource Controllers ---

// @desc    List all resources for the company
// @route   GET /api/resources
// @access  Private
const getResources = asyncHandler(async (req, res) => {
    const companyId = req.user.companyId;
    // Add filtering (type, category, status), sorting, pagination
    const query = { companyId: companyId };
    if (req.query.type) query.type = req.query.type;
    if (req.query.status) query.status = req.query.status;
    if (req.query.category) query.category = req.query.category;

    const resources = await Resource.find(query)
        .populate("createdBy", "firstName lastName")
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, resources, "Resources retrieved successfully"));
});

// @desc    Get specific resource details
// @route   GET /api/resources/:id
// @access  Private
const getResourceById = asyncHandler(async (req, res) => {
    const resource = await checkResourceAccess(req.params.id, req.user.companyId);
    await resource.populate("createdBy", "firstName lastName");
    // Populate userId for LaborResource if needed
    if (resource.type === "Labor" && resource.userId) {
        await resource.populate("userId", "firstName lastName email");
    }
    res.status(200).json(new ApiResponse(200, resource, "Resource retrieved successfully"));
});

// @desc    Create new resource (determines type from request body)
// @route   POST /api/resources
// @access  Private
const createResource = asyncHandler(async (req, res) => {
    const companyId = req.user.companyId;
    const { type, ...resourceData } = req.body;

    if (!type || !["Labor", "Equipment", "Material"].includes(type)) {
        throw new ApiError(400, "Invalid or missing resource type");
    }

    let ResourceModel;
    switch (type) {
        case "Labor": ResourceModel = LaborResource; break;
        case "Equipment": ResourceModel = EquipmentResource; break;
        case "Material": ResourceModel = MaterialResource; break;
        default: throw new ApiError(400, "Invalid resource type"); // Should not happen
    }

    const resource = await ResourceModel.create({
        ...resourceData,
        type: type, // Ensure type is set for discriminator
        companyId: companyId,
        createdBy: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, resource, "Resource created successfully"));
});

// @desc    Update resource details
// @route   PUT /api/resources/:id
// @access  Private
const updateResource = asyncHandler(async (req, res) => {
    const resourceId = req.params.id;
    const updates = req.body;
    const resource = await checkResourceAccess(resourceId, req.user.companyId);

    // Prevent changing type or companyId
    delete updates.type;
    delete updates.companyId;
    delete updates.createdBy;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.isDeleted;
    delete updates.deletedAt;

    Object.assign(resource, updates);
    await resource.save();

    res.status(200).json(new ApiResponse(200, resource, "Resource updated successfully"));
});

// @desc    Delete resource (soft delete)
// @route   DELETE /api/resources/:id
// @access  Private
const deleteResource = asyncHandler(async (req, res) => {
    const resourceId = req.params.id;
    const resource = await checkResourceAccess(resourceId, req.user.companyId);

    // TODO: Check for active allocations before deleting?
    // const activeAllocations = await ResourceAllocation.countDocuments({ resourceId: resourceId, status: { $in: ["Confirmed", "In Use"] } });
    // if (activeAllocations > 0) {
    //     throw new ApiError(400, "Cannot delete resource with active allocations.");
    // }

    resource.isDeleted = true;
    resource.deletedAt = new Date();
    await resource.save();

    // Optionally soft delete related allocations, availability, utilization?

    res.status(200).json(new ApiResponse(200, {}, "Resource deleted successfully"));
});

// --- Resource Allocation Controllers ---

// @desc    List allocations (for a resource or project)
// @route   GET /api/resources/:resourceId/allocations
// @route   GET /api/projects/:projectId/allocations
// @access  Private
const getAllocations = asyncHandler(async (req, res) => {
    const companyId = req.user.companyId;
    let query = {};

    if (req.params.resourceId) {
        await checkResourceAccess(req.params.resourceId, companyId);
        query.resourceId = req.params.resourceId;
    } else if (req.params.projectId) {
        await checkProjectAccess(req.params.projectId, companyId);
        query.projectId = req.params.projectId;
    } else {
        throw new ApiError(400, "Resource ID or Project ID must be provided");
    }

    // Add filtering by date range, status
    if (req.query.startDate) query.startDate = { $gte: new Date(req.query.startDate) };
    if (req.query.endDate) query.endDate = { $lte: new Date(req.query.endDate) };
    if (req.query.status) query.status = req.query.status;

    const allocations = await ResourceAllocation.find(query)
        .populate("resourceId", "name type")
        .populate("projectId", "name")
        .populate("taskId", "title")
        .populate("scheduleItemId", "name")
        .populate("createdBy", "firstName lastName")
        .sort({ startDate: 1 });

    res.status(200).json(new ApiResponse(200, allocations, "Allocations retrieved successfully"));
});

// @desc    Create new allocation
// @route   POST /api/resources/:resourceId/allocations
// @access  Private
const createAllocation = asyncHandler(async (req, res) => {
    const resourceId = req.params.resourceId;
    const companyId = req.user.companyId;
    await checkResourceAccess(resourceId, companyId);

    const {
        projectId, taskId, scheduleItemId, startDate, endDate,
        quantity, utilization, notes, status
    } = req.body;

    if (!projectId || !startDate || !endDate) {
        throw new ApiError(400, "Project ID, start date, and end date are required");
    }
    await checkProjectAccess(projectId, companyId);

    // TODO: Add conflict checking with ResourceAvailability and other allocations

    const allocation = await ResourceAllocation.create({
        resourceId,
        projectId,
        taskId,
        scheduleItemId,
        startDate,
        endDate,
        quantity: quantity || 1,
        utilization,
        notes,
        status: status || "Planned",
        createdBy: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, allocation, "Allocation created successfully"));
});

// @desc    Update allocation details
// @route   PUT /api/allocations/:id
// @access  Private
const updateAllocation = asyncHandler(async (req, res) => {
    const allocationId = req.params.id;
    const updates = req.body;
    const companyId = req.user.companyId;

    const allocation = await ResourceAllocation.findById(allocationId)
        .populate({ path: "resourceId", select: "companyId" });

    if (!allocation) {
        throw new ApiError(404, "Allocation not found");
    }
    if (allocation.resourceId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to update this allocation");
    }

    // Prevent changing key IDs
    delete updates.resourceId;
    delete updates.projectId;
    delete updates.createdBy;
    delete updates.createdAt;
    delete updates.updatedAt;

    // TODO: Add conflict checking if dates/resource change

    Object.assign(allocation, updates);
    await allocation.save();

    res.status(200).json(new ApiResponse(200, allocation, "Allocation updated successfully"));
});

// @desc    Delete allocation
// @route   DELETE /api/allocations/:id
// @access  Private
const deleteAllocation = asyncHandler(async (req, res) => {
    const allocationId = req.params.id;
    const companyId = req.user.companyId;

    const allocation = await ResourceAllocation.findById(allocationId)
        .populate({ path: "resourceId", select: "companyId" });

    if (!allocation) {
        throw new ApiError(404, "Allocation not found");
    }
    if (allocation.resourceId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to delete this allocation");
    }

    await ResourceAllocation.deleteOne({ _id: allocationId });

    res.status(200).json(new ApiResponse(200, {}, "Allocation deleted successfully"));
});

// --- Resource Availability Controllers ---

// @desc    Get availability exceptions for a resource
// @route   GET /api/resources/:resourceId/availability
// @access  Private
const getAvailability = asyncHandler(async (req, res) => {
    const resourceId = req.params.resourceId;
    await checkResourceAccess(resourceId, req.user.companyId);

    // Add date range filtering
    const query = { resourceId: resourceId };
    if (req.query.startDate) query.startDate = { $gte: new Date(req.query.startDate) };
    if (req.query.endDate) query.endDate = { $lte: new Date(req.query.endDate) };

    const availability = await ResourceAvailability.find(query)
        .populate("createdBy", "firstName lastName")
        .sort({ startDate: 1 });

    res.status(200).json(new ApiResponse(200, availability, "Availability retrieved successfully"));
});

// @desc    Add availability exception
// @route   POST /api/resources/:resourceId/availability
// @access  Private
const addAvailability = asyncHandler(async (req, res) => {
    const resourceId = req.params.resourceId;
    await checkResourceAccess(resourceId, req.user.companyId);

    const { startDate, endDate, reason, notes } = req.body;

    if (!startDate || !endDate || !reason) {
        throw new ApiError(400, "Start date, end date, and reason are required");
    }

    // TODO: Check for conflicts with existing allocations

    const availability = await ResourceAvailability.create({
        resourceId,
        startDate,
        endDate,
        reason,
        notes,
        createdBy: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, availability, "Availability exception added successfully"));
});

// @desc    Update availability exception
// @route   PUT /api/availability/:id
// @access  Private
const updateAvailability = asyncHandler(async (req, res) => {
    const availabilityId = req.params.id;
    const updates = req.body;
    const companyId = req.user.companyId;

    const availability = await ResourceAvailability.findById(availabilityId)
        .populate({ path: "resourceId", select: "companyId" });

    if (!availability) {
        throw new ApiError(404, "Availability record not found");
    }
    if (availability.resourceId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to update this availability record");
    }

    // Prevent changing key IDs
    delete updates.resourceId;
    delete updates.createdBy;
    delete updates.createdAt;
    delete updates.updatedAt;

    // TODO: Check for conflicts if dates change

    Object.assign(availability, updates);
    await availability.save();

    res.status(200).json(new ApiResponse(200, availability, "Availability exception updated successfully"));
});

// @desc    Delete availability exception
// @route   DELETE /api/availability/:id
// @access  Private
const deleteAvailability = asyncHandler(async (req, res) => {
    const availabilityId = req.params.id;
    const companyId = req.user.companyId;

    const availability = await ResourceAvailability.findById(availabilityId)
        .populate({ path: "resourceId", select: "companyId" });

    if (!availability) {
        throw new ApiError(404, "Availability record not found");
    }
    if (availability.resourceId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to delete this availability record");
    }

    await ResourceAvailability.deleteOne({ _id: availabilityId });

    res.status(200).json(new ApiResponse(200, {}, "Availability exception deleted successfully"));
});

// --- Resource Utilization Controllers ---

// @desc    Get utilization records (for resource or project)
// @route   GET /api/resources/:resourceId/utilization
// @route   GET /api/projects/:projectId/utilization
// @access  Private
const getUtilization = asyncHandler(async (req, res) => {
    const companyId = req.user.companyId;
    let query = {};

    if (req.params.resourceId) {
        await checkResourceAccess(req.params.resourceId, companyId);
        query.resourceId = req.params.resourceId;
    } else if (req.params.projectId) {
        await checkProjectAccess(req.params.projectId, companyId);
        query.projectId = req.params.projectId;
    } else {
        // Maybe allow fetching all utilization for the company?
        // query["resourceId.companyId"] = companyId; // Requires population or lookup
        throw new ApiError(400, "Resource ID or Project ID must be provided");
    }

    // Add date range filtering
    if (req.query.startDate) query.date = { ...query.date, $gte: new Date(req.query.startDate) };
    if (req.query.endDate) query.date = { ...query.date, $lte: new Date(req.query.endDate) };

    const utilization = await ResourceUtilization.find(query)
        .populate("resourceId", "name type")
        .populate("projectId", "name")
        .populate("taskId", "title")
        .populate("createdBy", "firstName lastName")
        .sort({ date: -1 });

    res.status(200).json(new ApiResponse(200, utilization, "Utilization records retrieved successfully"));
});

// @desc    Record utilization
// @route   POST /api/resources/:resourceId/utilization
// @access  Private
const recordUtilization = asyncHandler(async (req, res) => {
    const resourceId = req.params.resourceId;
    await checkResourceAccess(resourceId, req.user.companyId);

    const { projectId, taskId, date, hours, quantity, notes } = req.body;

    if (!date || (!hours && !quantity)) {
        throw new ApiError(400, "Date and either hours or quantity are required");
    }
    if (projectId) {
        await checkProjectAccess(projectId, req.user.companyId);
    }

    const utilization = await ResourceUtilization.create({
        resourceId,
        projectId,
        taskId,
        date,
        hours,
        quantity,
        notes,
        createdBy: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, utilization, "Utilization recorded successfully"));
});

// @desc    Update utilization record
// @route   PUT /api/utilization/:id
// @access  Private
const updateUtilization = asyncHandler(async (req, res) => {
    const utilizationId = req.params.id;
    const updates = req.body;
    const companyId = req.user.companyId;

    const utilization = await ResourceUtilization.findById(utilizationId)
        .populate({ path: "resourceId", select: "companyId" });

    if (!utilization) {
        throw new ApiError(404, "Utilization record not found");
    }
    if (utilization.resourceId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to update this utilization record");
    }

    // Prevent changing key IDs
    delete updates.resourceId;
    delete updates.createdBy;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.resourceType; // Should not be changed manually

    Object.assign(utilization, updates);
    await utilization.save();

    res.status(200).json(new ApiResponse(200, utilization, "Utilization record updated successfully"));
});

// @desc    Delete utilization record
// @route   DELETE /api/utilization/:id
// @access  Private
const deleteUtilization = asyncHandler(async (req, res) => {
    const utilizationId = req.params.id;
    const companyId = req.user.companyId;

    const utilization = await ResourceUtilization.findById(utilizationId)
        .populate({ path: "resourceId", select: "companyId" });

    if (!utilization) {
        throw new ApiError(404, "Utilization record not found");
    }
    if (utilization.resourceId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to delete this utilization record");
    }

    await ResourceUtilization.deleteOne({ _id: utilizationId });

    res.status(200).json(new ApiResponse(200, {}, "Utilization record deleted successfully"));
});


module.exports = {
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
};

