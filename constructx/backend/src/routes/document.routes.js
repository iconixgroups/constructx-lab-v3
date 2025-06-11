const express = require("express");
const {
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
    // Import controllers for comments update/delete, approval cancel, access control if implemented
} = require("../controllers/document.controller");
const { protect } = require("../middleware/auth");
// Import file upload middleware (e.g., multer) if needed
// const upload = require("../middleware/upload"); // Example

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

// --- Folder Routes ---
router.route("/projects/:projectId/folders")
    .get(getProjectFolders) // Handles root folders (no parentFolderId query) and subfolders (with parentFolderId query)
    .post(createFolder); // Creates root folder

// Note: Creating subfolders might use POST /api/folders/:parentId/folders or POST /api/projects/:projectId/folders with parentFolderId in body
// The current controller uses the latter approach.

router.route("/folders/:id")
    // .get(getFolderById) // Controller not implemented, add if needed
    .put(updateFolder)
    .delete(deleteFolder);
// router.route("/folders/:id/documents").get(getDocumentsInFolder); // Controller not implemented, handled by GET /documents?folderId=
// router.route("/folders/:id/subfolders").get(getSubfolders); // Controller not implemented, handled by GET /folders?parentFolderId=

// --- Document Routes ---
router.route("/projects/:projectId/documents")
    .get(getDocuments) // Handles root documents (no folderId query) and folder documents (with folderId query)
    // Apply upload middleware here if needed
    // .post(upload.single("documentFile"), uploadDocument);
    .post(uploadDocument);

router.route("/documents/:id")
    .get(getDocumentById)
    .put(updateDocumentMetadata)
    .delete(deleteDocument);

router.route("/documents/:id/download")
    .get(downloadDocument);
// router.route("/documents/:id/preview").get(getDocumentPreview); // Controller not implemented

// --- Document Version Routes ---
router.route("/documents/:documentId/versions")
    .get(getDocumentVersions)
    // Apply upload middleware here if needed
    // .post(upload.single("versionFile"), uploadNewVersion);
    .post(uploadNewVersion);

router.route("/documents/versions/:id/download")
    .get(downloadVersion);
// router.route("/documents/versions/:id/preview").get(getVersionPreview); // Controller not implemented
// router.route("/documents/:documentId/versions/:id/restore").put(restoreVersion); // Controller not implemented

// --- Document Comment Routes ---
router.route("/documents/:documentId/comments")
    .get(getDocumentComments)
    .post(addDocumentComment);

// Routes for updating/deleting specific comments (implement controllers if needed)
// router.route("/documents/comments/:id")
//     .put(updateDocumentComment)
//     .delete(deleteDocumentComment);

// --- Document Approval Routes ---
router.route("/documents/:documentId/approvals")
    .get(getDocumentApprovals) // Requires versionId query param
    .post(requestDocumentApproval);

router.route("/documents/approvals/:id")
    .put(respondToApproval);
//     .delete(cancelApprovalRequest); // Controller not implemented
// router.route("/documents/approvals/pending").get(getMyPendingApprovals); // Controller not implemented

// --- Document Access Routes (implement controllers if needed) ---
// router.route("/documents/:documentId/access")
//     .get(getDocumentAccess)
//     .post(grantDocumentAccess);
// router.route("/documents/access/:id")
//     .put(updateDocumentAccess)
//     .delete(revokeDocumentAccess);

// Placeholder routes for fetching enums/types (implement controllers if needed)
// router.get("/documents/categories", getDocumentCategories);
// router.get("/documents/statuses", getDocumentStatuses);

module.exports = router;

