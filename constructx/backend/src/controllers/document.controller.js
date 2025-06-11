const Folder = require("../models/folder.model");
const Document = require("../models/document.model");
const DocumentVersion = require("../models/documentVersion.model");
const DocumentComment = require("../models/documentComment.model");
const DocumentApproval = require("../models/documentApproval.model");
const DocumentAccess = require("../models/documentAccess.model");
const Project = require("../models/project.model"); // To verify project access
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const mongoose = require("mongoose");
// Assume file storage service (e.g., S3 or local) is configured and available
// const storageService = require("../services/storage.service");
// Assume upload middleware (e.g., multer) is configured

// --- Helper Functions ---

// Check project access (similar to task controller)
const checkProjectAccess = async (projectId, userId, companyId) => {
    const project = await Project.findOne({ _id: projectId, companyId: companyId });
    if (!project) {
        throw new ApiError(404, "Project not found or access denied");
    }
    // Add member/role based permission checks here if needed
    return project;
};

// Check folder access
const checkFolderAccess = async (folderId, userId, companyId) => {
    const folder = await Folder.findById(folderId).populate("projectId");
    if (!folder) {
        throw new ApiError(404, "Folder not found");
    }
    if (folder.projectId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to this folder");
    }
    return folder;
};

// Check document access (basic - checks project ownership)
const checkDocumentAccess = async (documentId, userId, companyId) => {
    const document = await Document.findById(documentId).populate("projectId");
    if (!document) {
        throw new ApiError(404, "Document not found");
    }
    if (document.projectId.companyId.toString() !== companyId.toString()) {
        throw new ApiError(403, "Access denied to this document");
    }
    // TODO: Implement granular access check based on DocumentAccess model
    return document;
};

// --- Folder Controllers ---

// @desc    List all folders for a project (root or specific parent)
// @route   GET /api/projects/:projectId/folders?parentFolderId=...
// @access  Private
const getProjectFolders = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    const parentFolderId = req.query.parentFolderId || null; // null for root folders
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    const folders = await Folder.find({ projectId: projectId, parentFolderId: parentFolderId })
        .populate("createdBy", "firstName lastName");

    res.status(200).json(new ApiResponse(200, folders, "Folders retrieved successfully"));
});

// @desc    Create new folder
// @route   POST /api/projects/:projectId/folders
// @access  Private
const createFolder = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    const { name, description, parentFolderId } = req.body;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    if (!name) {
        throw new ApiError(400, "Folder name is required");
    }

    // If parentFolderId is provided, check access to parent folder
    if (parentFolderId) {
        await checkFolderAccess(parentFolderId, req.user.id, req.user.companyId);
    }

    const folder = await Folder.create({
        projectId,
        parentFolderId: parentFolderId || null,
        name,
        description,
        createdBy: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, folder, "Folder created successfully"));
});

// @desc    Update folder details
// @route   PUT /api/folders/:id
// @access  Private
const updateFolder = asyncHandler(async (req, res) => {
    const folderId = req.params.id;
    const { name, description } = req.body;
    const folder = await checkFolderAccess(folderId, req.user.id, req.user.companyId);

    if (name) folder.name = name;
    if (description !== undefined) folder.description = description;

    await folder.save();

    res.status(200).json(new ApiResponse(200, folder, "Folder updated successfully"));
});

// @desc    Delete folder (soft delete)
// @route   DELETE /api/folders/:id
// @access  Private
const deleteFolder = asyncHandler(async (req, res) => {
    const folderId = req.params.id;
    const folder = await checkFolderAccess(folderId, req.user.id, req.user.companyId);

    // TODO: Handle deletion of subfolders and documents within the folder (recursive soft delete?)
    // This requires careful implementation to avoid accidental data loss and manage dependencies.
    // For now, just soft-delete the folder itself.

    folder.isDeleted = true;
    folder.deletedAt = new Date();
    await folder.save();

    res.status(200).json(new ApiResponse(200, {}, "Folder deleted successfully"));
});

// --- Document Controllers ---

// @desc    List documents (in project root or specific folder)
// @route   GET /api/projects/:projectId/documents?folderId=...
// @access  Private
const getDocuments = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    const folderId = req.query.folderId || null; // null for project root
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    if (folderId) {
        await checkFolderAccess(folderId, req.user.id, req.user.companyId);
    }

    // Add filtering (category, status, tags), sorting, pagination
    const documents = await Document.find({ projectId: projectId, folderId: folderId })
        .populate("createdBy", "firstName lastName")
        .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, documents, "Documents retrieved successfully"));
});

// @desc    Get specific document details (latest version info)
// @route   GET /api/documents/:id
// @access  Private
const getDocumentById = asyncHandler(async (req, res) => {
    const document = await checkDocumentAccess(req.params.id, req.user.id, req.user.companyId);
    await document.populate([
        { path: "createdBy", select: "firstName lastName" },
        { path: "folderId", select: "name" }
    ]);
    res.status(200).json(new ApiResponse(200, document, "Document retrieved successfully"));
});

// @desc    Upload new document (creates Document and first DocumentVersion)
// @route   POST /api/projects/:projectId/documents
// @access  Private
const uploadDocument = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId;
    const { folderId, description, status, category, tags, metadata } = req.body;
    await checkProjectAccess(projectId, req.user.id, req.user.companyId);

    if (folderId) {
        await checkFolderAccess(folderId, req.user.id, req.user.companyId);
    }

    // Assuming multer middleware handles the upload and adds file info to req.file
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }
    const { originalname, size, mimetype, path } = req.file;

    // Use a transaction for creating multiple related documents
    const session = await mongoose.startSession();
    session.startTransaction();
    let document;
    try {
        document = new Document({
            projectId,
            folderId: folderId || null,
            name: originalname, // Use original file name initially
            description,
            fileSize: size,
            fileType: mimetype,
            filePath: path, // Path of the first version
            status: status || "Draft",
            category,
            tags: tags ? JSON.parse(tags) : [], // Assuming tags are sent as JSON string
            createdBy: req.user.id,
            latestVersionNumber: 1,
            metadata: metadata ? JSON.parse(metadata) : {},
        });
        await document.save({ session });

        const version = new DocumentVersion({
            documentId: document._id,
            versionNumber: 1,
            fileSize: size,
            filePath: path,
            changeDescription: "Initial upload",
            createdBy: req.user.id,
            status: document.status, // Initial version status matches document status
        });
        await version.save({ session });

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        // TODO: Clean up uploaded file if transaction fails
        // await storageService.deleteFile(path);
        throw new ApiError(500, `Failed to upload document: ${error.message}`);
    } finally {
        session.endSession();
    }

    res.status(201).json(new ApiResponse(201, document, "Document uploaded successfully"));
});

// @desc    Update document metadata (not file content)
// @route   PUT /api/documents/:id
// @access  Private
const updateDocumentMetadata = asyncHandler(async (req, res) => {
    const documentId = req.params.id;
    const updates = req.body;
    const document = await checkDocumentAccess(documentId, req.user.id, req.user.companyId);

    // Allow updating specific metadata fields
    const allowedUpdates = ["name", "description", "folderId", "status", "category", "tags", "metadata"];
    Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
            // Special handling for tags/metadata if needed (e.g., parsing JSON)
            if ((key === "tags" || key === "metadata") && typeof updates[key] === "string") {
                try {
                    document[key] = JSON.parse(updates[key]);
                } catch (e) { /* ignore parse error */ }
            } else {
                document[key] = updates[key];
            }
        }
    });

    // If status changes, potentially update latest version status?
    if (updates.status && updates.status !== document.status) {
        await DocumentVersion.findOneAndUpdate(
            { documentId: document._id, versionNumber: document.latestVersionNumber },
            { $set: { status: updates.status } }
        );
    }

    await document.save();

    res.status(200).json(new ApiResponse(200, document, "Document metadata updated successfully"));
});

// @desc    Delete document (soft delete)
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = asyncHandler(async (req, res) => {
    const documentId = req.params.id;
    const document = await checkDocumentAccess(documentId, req.user.id, req.user.companyId);

    document.isDeleted = true;
    document.deletedAt = new Date();
    await document.save();

    // Optionally soft delete versions, comments, approvals, access rules
    // await DocumentVersion.updateMany({ documentId }, { $set: { isDeleted: true, deletedAt: new Date() } });
    // ... etc.

    res.status(200).json(new ApiResponse(200, {}, "Document deleted successfully"));
});

// @desc    Download latest document file
// @route   GET /api/documents/:id/download
// @access  Private
const downloadDocument = asyncHandler(async (req, res) => {
    const document = await checkDocumentAccess(req.params.id, req.user.id, req.user.companyId);

    // TODO: Implement file download logic using storageService
    // Example: const fileStream = await storageService.getFileStream(document.filePath);
    // res.setHeader("Content-Disposition", `attachment; filename="${document.name}"`);
    // res.setHeader("Content-Type", document.fileType);
    // fileStream.pipe(res);

    res.status(501).json(new ApiResponse(501, null, "Download not implemented")); // Placeholder
});

// --- Document Version Controllers ---

// @desc    List all versions of a document
// @route   GET /api/documents/:documentId/versions
// @access  Private
const getDocumentVersions = asyncHandler(async (req, res) => {
    const documentId = req.params.documentId;
    await checkDocumentAccess(documentId, req.user.id, req.user.companyId);

    const versions = await DocumentVersion.find({ documentId: documentId })
        .populate("createdBy", "firstName lastName")
        .sort({ versionNumber: -1 });

    res.status(200).json(new ApiResponse(200, versions, "Document versions retrieved successfully"));
});

// @desc    Upload new version of a document
// @route   POST /api/documents/:documentId/versions
// @access  Private
const uploadNewVersion = asyncHandler(async (req, res) => {
    const documentId = req.params.documentId;
    const { changeDescription } = req.body;
    const document = await checkDocumentAccess(documentId, req.user.id, req.user.companyId);

    if (!req.file) {
        throw new ApiError(400, "No file uploaded for the new version");
    }
    const { originalname, size, mimetype, path } = req.file;

    const newVersionNumber = document.latestVersionNumber + 1;

    const session = await mongoose.startSession();
    session.startTransaction();
    let version;
    try {
        // Create new version entry
        version = new DocumentVersion({
            documentId: document._id,
            versionNumber: newVersionNumber,
            fileSize: size,
            filePath: path,
            changeDescription: changeDescription || `Version ${newVersionNumber} uploaded`,
            createdBy: req.user.id,
            status: "Draft", // New versions usually start as Draft
        });
        await version.save({ session });

        // Update the main document record
        document.latestVersionNumber = newVersionNumber;
        document.fileSize = size;
        document.fileType = mimetype;
        document.filePath = path;
        document.status = "Draft"; // Reset document status to Draft
        await document.save({ session });

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        // TODO: Clean up uploaded file if transaction fails
        // await storageService.deleteFile(path);
        throw new ApiError(500, `Failed to upload new version: ${error.message}`);
    } finally {
        session.endSession();
    }

    res.status(201).json(new ApiResponse(201, version, "New version uploaded successfully"));
});

// @desc    Download a specific document version
// @route   GET /api/documents/versions/:id/download
// @access  Private
const downloadVersion = asyncHandler(async (req, res) => {
    const versionId = req.params.id;
    const version = await DocumentVersion.findById(versionId).populate("documentId");

    if (!version) {
        throw new ApiError(404, "Document version not found");
    }
    // Check access via the parent document
    await checkDocumentAccess(version.documentId._id, req.user.id, req.user.companyId);

    // TODO: Implement file download logic using storageService for version.filePath
    // res.setHeader("Content-Disposition", `attachment; filename="${version.documentId.name}_v${version.versionNumber}"`);
    // res.setHeader("Content-Type", version.documentId.fileType); // Assuming type doesn't change drastically
    // fileStream.pipe(res);

    res.status(501).json(new ApiResponse(501, null, "Version download not implemented")); // Placeholder
});

// --- Document Comment Controllers ---

// @desc    List all comments for a document
// @route   GET /api/documents/:documentId/comments
// @access  Private
const getDocumentComments = asyncHandler(async (req, res) => {
    const documentId = req.params.documentId;
    await checkDocumentAccess(documentId, req.user.id, req.user.companyId);

    const comments = await DocumentComment.find({ documentId: documentId })
        .populate("createdBy", "firstName lastName email avatar")
        .sort({ createdAt: 1 });

    res.status(200).json(new ApiResponse(200, comments, "Document comments retrieved successfully"));
});

// @desc    Add comment to document
// @route   POST /api/documents/:documentId/comments
// @access  Private
const addDocumentComment = asyncHandler(async (req, res) => {
    const documentId = req.params.documentId;
    const { content, versionId, position } = req.body;
    await checkDocumentAccess(documentId, req.user.id, req.user.companyId);

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await DocumentComment.create({
        documentId,
        versionId, // Optional
        content,
        position, // Optional
        createdBy: req.user.id,
    });

    await comment.populate("createdBy", "firstName lastName email avatar");
    res.status(201).json(new ApiResponse(201, comment, "Document comment added successfully"));
});

// --- Document Approval Controllers ---

// @desc    List all approval requests for a document version
// @route   GET /api/documents/:documentId/approvals?versionId=...
// @access  Private
const getDocumentApprovals = asyncHandler(async (req, res) => {
    const documentId = req.params.documentId;
    const versionId = req.query.versionId; // Get approvals for a specific version
    await checkDocumentAccess(documentId, req.user.id, req.user.companyId);

    if (!versionId) {
        throw new ApiError(400, "Version ID is required to retrieve approvals");
    }

    const approvals = await DocumentApproval.find({ documentId, versionId })
        .populate("approverId", "firstName lastName email")
        .populate("requestedBy", "firstName lastName email");

    res.status(200).json(new ApiResponse(200, approvals, "Document approvals retrieved successfully"));
});

// @desc    Create approval request(s)
// @route   POST /api/documents/:documentId/approvals
// @access  Private
const requestDocumentApproval = asyncHandler(async (req, res) => {
    const documentId = req.params.documentId;
    const { versionId, approverIds, comments } = req.body; // Expect an array of approver user IDs
    const document = await checkDocumentAccess(documentId, req.user.id, req.user.companyId);

    if (!versionId || !approverIds || !Array.isArray(approverIds) || approverIds.length === 0) {
        throw new ApiError(400, "Version ID and at least one Approver ID are required");
    }

    // Verify the version exists
    const version = await DocumentVersion.findOne({ _id: versionId, documentId: documentId });
    if (!version) {
        throw new ApiError(404, "Document version not found");
    }

    const createdApprovals = [];
    for (const approverId of approverIds) {
        // Avoid duplicate requests for the same user/version
        const existing = await DocumentApproval.findOne({ versionId, approverId });
        if (!existing) {
            const approval = await DocumentApproval.create({
                documentId,
                versionId,
                approverId,
                comments, // Initial request comments
                requestedBy: req.user.id,
                status: "Pending",
            });
            createdApprovals.push(approval);
            // TODO: Send notification to approver
        }
    }

    // Update document/version status to "Under Review"
    version.status = "Under Review";
    await version.save();
    if (document.latestVersionNumber === version.versionNumber) {
        document.status = "Under Review";
        await document.save();
    }

    res.status(201).json(new ApiResponse(201, createdApprovals, "Approval requests created successfully"));
});

// @desc    Respond to an approval request
// @route   PUT /api/documents/approvals/:id
// @access  Private
const respondToApproval = asyncHandler(async (req, res) => {
    const approvalId = req.params.id;
    const { status, comments } = req.body;

    if (!status || !["Approved", "Rejected", "Revise"].includes(status)) {
        throw new ApiError(400, "Invalid approval status provided");
    }

    const approval = await DocumentApproval.findById(approvalId);
    if (!approval) {
        throw new ApiError(404, "Approval request not found");
    }

    // Check if the current user is the assigned approver
    if (approval.approverId.toString() !== req.user.id.toString()) {
        throw new ApiError(403, "You are not authorized to respond to this approval request");
    }

    if (approval.status !== "Pending") {
        throw new ApiError(400, "This approval request has already been responded to");
    }

    approval.status = status;
    approval.comments = comments;
    approval.respondedAt = new Date();
    await approval.save();

    // TODO: Check if all approvals for this version are complete and update document/version status accordingly
    // Example: If all approved -> set status to Approved
    // Example: If any rejected -> set status to Rejected
    // Example: If any revise -> set status back to Draft?

    res.status(200).json(new ApiResponse(200, approval, "Approval response submitted successfully"));
});

// --- Document Access Controllers ---
// TODO: Implement access control logic


module.exports = {
    getProjectFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    getDocuments,
    getDocumentById,
    uploadDocument,
    updateDocumentMetadata,
    deleteDocument,
    downloadDocument,
    getDocumentVersions,
    uploadNewVersion,
    downloadVersion,
    getDocumentComments,
    addDocumentComment,
    getDocumentApprovals,
    requestDocumentApproval,
    respondToApproval,
    // Add controllers for comments update/delete, approval cancel, access control
};

