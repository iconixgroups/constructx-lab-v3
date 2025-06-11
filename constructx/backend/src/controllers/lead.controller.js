const Lead = require("../models/lead.model");
const LeadContact = require("../models/leadContact.model");
const LeadActivity = require("../models/leadActivity.model");
const LeadNote = require("../models/leadNote.model");
const Project = require("../models/project.model"); // Needed for conversion
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// --- Lead Controllers ---

// @desc    Get all leads with filtering and pagination
// @route   GET /api/leads
// @access  Private
const getLeads = asyncHandler(async (req, res) => {
    // Basic implementation - add filtering, sorting, pagination as needed
    const leads = await Lead.find({ companyId: req.user.companyId })
        .populate("assignedTo", "firstName lastName email")
        .populate("createdBy", "firstName lastName email")
        .sort({ createdAt: -1 }); // Example sort

    res.status(200).json(new ApiResponse(200, leads, "Leads retrieved successfully"));
});

// @desc    Get specific lead details
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = asyncHandler(async (req, res) => {
    const lead = await Lead.findOne({ _id: req.params.id, companyId: req.user.companyId })
        .populate("assignedTo", "firstName lastName email")
        .populate("createdBy", "firstName lastName email")
        .populate("clientCompanyId", "name"); // Populate client company if needed

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }
    res.status(200).json(new ApiResponse(200, lead, "Lead retrieved successfully"));
});

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
const createLead = asyncHandler(async (req, res) => {
    const { name, clientCompanyId, source, description, estimatedValue, estimatedStartDate, estimatedDuration, status, probability, assignedTo, tags } = req.body;

    if (!name || !assignedTo) {
        throw new ApiError(400, "Lead name and assigned user are required");
    }

    const lead = await Lead.create({
        companyId: req.user.companyId,
        name,
        clientCompanyId,
        source,
        description,
        estimatedValue,
        estimatedStartDate,
        estimatedDuration,
        status: status || "New",
        probability: probability || 0,
        assignedTo,
        createdBy: req.user.id,
        lastActivityAt: new Date(), // Set initial activity time
        tags,
    });

    // Optionally create an initial activity log
    await LeadActivity.create({
        leadId: lead._id,
        type: "Note", // Or "Created"
        title: "Lead Created",
        description: `Lead '${name}' created by ${req.user.firstName} ${req.user.lastName}`,
        performedBy: req.user.id,
        performedAt: new Date(),
    });

    res.status(201).json(new ApiResponse(201, lead, "Lead created successfully"));
});

// @desc    Update lead details
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = asyncHandler(async (req, res) => {
    const leadId = req.params.id;
    const updates = req.body;

    const lead = await Lead.findOne({ _id: leadId, companyId: req.user.companyId });

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    // Prevent updating certain fields directly if needed (e.g., companyId, createdBy)
    delete updates.companyId;
    delete updates.createdBy;
    delete updates.createdAt;
    delete updates.updatedAt;

    // Update fields
    Object.assign(lead, updates);
    lead.lastActivityAt = new Date(); // Update last activity timestamp

    await lead.save();

    // Optionally log the update as an activity
    await LeadActivity.create({
        leadId: lead._id,
        type: "Note", // Or "Updated"
        title: "Lead Updated",
        description: `Lead details updated by ${req.user.firstName} ${req.user.lastName}`,
        performedBy: req.user.id,
        performedAt: new Date(),
    });

    res.status(200).json(new ApiResponse(200, lead, "Lead updated successfully"));
});

// @desc    Delete lead (soft delete or actual delete)
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = asyncHandler(async (req, res) => {
    const leadId = req.params.id;

    const lead = await Lead.findOne({ _id: leadId, companyId: req.user.companyId });

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    // Consider soft delete by adding an `isDeleted` flag to the model
    // For now, performing actual delete. Also delete related entities.
    await LeadContact.deleteMany({ leadId: leadId });
    await LeadActivity.deleteMany({ leadId: leadId });
    await LeadNote.deleteMany({ leadId: leadId });
    // Add deletion for other related entities if necessary

    await Lead.deleteOne({ _id: leadId });

    res.status(200).json(new ApiResponse(200, {}, "Lead deleted successfully"));
});

// --- Lead Contact Controllers ---

// @desc    List all contacts for a lead
// @route   GET /api/leads/:leadId/contacts
// @access  Private
const getLeadContacts = asyncHandler(async (req, res) => {
    const leadId = req.params.leadId;
    // Verify lead exists and belongs to user's company
    const lead = await Lead.findOne({ _id: leadId, companyId: req.user.companyId });
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    const contacts = await LeadContact.find({ leadId: leadId });
    res.status(200).json(new ApiResponse(200, contacts, "Lead contacts retrieved successfully"));
});

// @desc    Add contact to lead
// @route   POST /api/leads/:leadId/contacts
// @access  Private
const addLeadContact = asyncHandler(async (req, res) => {
    const leadId = req.params.leadId;
    const { firstName, lastName, email, phone, position, isPrimary, notes } = req.body;

    // Verify lead exists and belongs to user's company
    const lead = await Lead.findOne({ _id: leadId, companyId: req.user.companyId });
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    if (!firstName || !lastName) {
        throw new ApiError(400, "First name and last name are required");
    }

    // Handle primary contact logic
    if (isPrimary) {
        await LeadContact.updateMany({ leadId: leadId }, { $set: { isPrimary: false } });
    }

    const contact = await LeadContact.create({
        leadId,
        firstName,
        lastName,
        email,
        phone,
        position,
        isPrimary: isPrimary || false,
        notes,
    });

    lead.lastActivityAt = new Date();
    await lead.save();

    res.status(201).json(new ApiResponse(201, contact, "Lead contact added successfully"));
});

// @desc    Update contact details
// @route   PUT /api/leads/contacts/:id
// @access  Private
const updateLeadContact = asyncHandler(async (req, res) => {
    const contactId = req.params.id;
    const updates = req.body;

    const contact = await LeadContact.findById(contactId).populate("leadId");
    if (!contact || contact.leadId.companyId.toString() !== req.user.companyId.toString()) {
        throw new ApiError(404, "Lead contact not found or access denied");
    }

    // Handle primary contact logic
    if (updates.isPrimary !== undefined && updates.isPrimary !== contact.isPrimary) {
        if (updates.isPrimary) {
            await LeadContact.updateMany({ leadId: contact.leadId._id, _id: { $ne: contactId } }, { $set: { isPrimary: false } });
        }
        contact.isPrimary = updates.isPrimary;
    }

    // Update other fields
    Object.keys(updates).forEach(key => {
        if (key !== "_id" && key !== "leadId" && key !== "createdAt" && key !== "updatedAt" && key !== "isPrimary") {
            contact[key] = updates[key];
        }
    });

    await contact.save();

    contact.leadId.lastActivityAt = new Date();
    await contact.leadId.save();

    res.status(200).json(new ApiResponse(200, contact, "Lead contact updated successfully"));
});

// @desc    Remove contact from lead
// @route   DELETE /api/leads/contacts/:id
// @access  Private
const removeLeadContact = asyncHandler(async (req, res) => {
    const contactId = req.params.id;

    const contact = await LeadContact.findById(contactId).populate("leadId");
    if (!contact || contact.leadId.companyId.toString() !== req.user.companyId.toString()) {
        throw new ApiError(404, "Lead contact not found or access denied");
    }

    await LeadContact.deleteOne({ _id: contactId });

    contact.leadId.lastActivityAt = new Date();
    await contact.leadId.save();

    res.status(200).json(new ApiResponse(200, {}, "Lead contact removed successfully"));
});

// --- Lead Activity Controllers ---

// @desc    List all activities for a lead
// @route   GET /api/leads/:leadId/activities
// @access  Private
const getLeadActivities = asyncHandler(async (req, res) => {
    const leadId = req.params.leadId;
    // Verify lead exists and belongs to user's company
    const lead = await Lead.findOne({ _id: leadId, companyId: req.user.companyId });
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    const activities = await LeadActivity.find({ leadId: leadId })
        .populate("performedBy", "firstName lastName email")
        .sort({ performedAt: -1 });

    res.status(200).json(new ApiResponse(200, activities, "Lead activities retrieved successfully"));
});

// @desc    Add activity to lead
// @route   POST /api/leads/:leadId/activities
// @access  Private
const addLeadActivity = asyncHandler(async (req, res) => {
    const leadId = req.params.leadId;
    const { type, title, description, performedAt, scheduledAt, outcome, documentId } = req.body;

    // Verify lead exists and belongs to user's company
    const lead = await Lead.findOne({ _id: leadId, companyId: req.user.companyId });
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    if (!type) {
        throw new ApiError(400, "Activity type is required");
    }

    const activity = await LeadActivity.create({
        leadId,
        type,
        title,
        description,
        performedBy: req.user.id,
        performedAt: performedAt || new Date(),
        scheduledAt,
        outcome,
        documentId,
    });

    lead.lastActivityAt = new Date();
    await lead.save();

    res.status(201).json(new ApiResponse(201, activity, "Lead activity added successfully"));
});

// --- Lead Note Controllers ---

// @desc    List all notes for a lead
// @route   GET /api/leads/:leadId/notes
// @access  Private
const getLeadNotes = asyncHandler(async (req, res) => {
    const leadId = req.params.leadId;
    // Verify lead exists and belongs to user's company
    const lead = await Lead.findOne({ _id: leadId, companyId: req.user.companyId });
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    const notes = await LeadNote.find({ leadId: leadId })
        .populate("createdBy", "firstName lastName email")
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, notes, "Lead notes retrieved successfully"));
});

// @desc    Add note to lead
// @route   POST /api/leads/:leadId/notes
// @access  Private
const addLeadNote = asyncHandler(async (req, res) => {
    const leadId = req.params.leadId;
    const { content } = req.body;

    // Verify lead exists and belongs to user's company
    const lead = await Lead.findOne({ _id: leadId, companyId: req.user.companyId });
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    if (!content) {
        throw new ApiError(400, "Note content is required");
    }

    const note = await LeadNote.create({
        leadId,
        content,
        createdBy: req.user.id,
    });

    lead.lastActivityAt = new Date();
    await lead.save();

    // Optionally create an activity log entry for the note
    await LeadActivity.create({
        leadId: lead._id,
        type: "Note",
        title: "Note Added",
        description: content.substring(0, 100) + (content.length > 100 ? "..." : ""), // Truncate description
        performedBy: req.user.id,
        performedAt: new Date(),
    });

    res.status(201).json(new ApiResponse(201, note, "Lead note added successfully"));
});

// --- Lead Conversion Controller ---

// @desc    Convert lead to project
// @route   POST /api/leads/:id/convert-to-project
// @access  Private
const convertLeadToProject = asyncHandler(async (req, res) => {
    const leadId = req.params.id;
    const { projectName, projectStatus, projectStartDate, projectEndDate /* other project fields */ } = req.body;

    const lead = await Lead.findOne({ _id: leadId, companyId: req.user.companyId });

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    if (lead.status === "Won") {
        throw new ApiError(400, "Lead has already been converted or marked as Won");
    }
    if (lead.status === "Lost") {
        throw new ApiError(400, "Cannot convert a Lost lead");
    }

    // Create the project
    const project = await Project.create({
        companyId: lead.companyId,
        name: projectName || lead.name, // Default project name to lead name
        description: lead.description,
        clientCompanyId: lead.clientCompanyId,
        status: projectStatus || "Planning", // Default status
        startDate: projectStartDate || lead.estimatedStartDate,
        endDate: projectEndDate,
        estimatedValue: lead.estimatedValue,
        leadOriginId: lead._id, // Link back to the original lead
        createdBy: req.user.id,
        // Add other necessary project fields based on Project model
    });

    // Update lead status to Won
    lead.status = "Won";
    lead.lastActivityAt = new Date();
    await lead.save();

    // Optionally: Transfer contacts, notes, documents, activities to the project
    // This requires more complex logic based on how these are stored in the Project module

    // Log conversion activity
    await LeadActivity.create({
        leadId: lead._id,
        type: "Note", // Or "Conversion"
        title: "Lead Converted to Project",
        description: `Converted to project: ${project.name} (ID: ${project._id}) by ${req.user.firstName} ${req.user.lastName}`,
        performedBy: req.user.id,
        performedAt: new Date(),
    });

    res.status(201).json(new ApiResponse(201, { lead, project }, "Lead converted to project successfully"));
});


module.exports = {
    getLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
    getLeadContacts,
    addLeadContact,
    updateLeadContact,
    removeLeadContact,
    getLeadActivities,
    addLeadActivity,
    getLeadNotes,
    addLeadNote,
    convertLeadToProject,
    // Add controllers for updating/deleting activities and notes if needed
};

