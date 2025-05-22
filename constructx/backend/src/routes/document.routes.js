const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Upload a new document
router.post('/', documentController.uploadDocument);

// Get all documents for a project
router.get('/project/:projectId', documentController.getProjectDocuments);

// Get document by ID
router.get('/:documentId', documentController.getDocumentById);

// Update document metadata
router.put('/:documentId', documentController.updateDocument);

// Upload new version of document
router.post('/:documentId/versions', documentController.uploadNewVersion);

// Delete document
router.delete('/:documentId', documentController.deleteDocument);

// Add comment to document
router.post('/:documentId/comments', documentController.addDocumentComment);

// Approve or reject document
router.post('/:documentId/review', documentController.reviewDocument);

// Get document categories and counts
router.get('/categories/project/:projectId', documentController.getDocumentCategoryCounts);

// Get document version history
router.get('/:documentId/versions', documentController.getDocumentVersionHistory);

module.exports = router;
