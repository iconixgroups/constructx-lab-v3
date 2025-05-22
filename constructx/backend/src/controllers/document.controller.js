const Document = require('../models/document.model');
const Project = require('../models/project.model');
const { createError } = require('../utils/error');

// Upload a new document
exports.uploadDocument = async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      projectId, 
      category, 
      tags,
      fileName,
      fileUrl,
      fileType,
      fileSize,
      thumbnailUrl,
      version,
      approvalRequired,
      approvers,
      permissions
    } = req.body;
    
    // Check if project exists and belongs to user's company
    const project = await Project.findOne({
      _id: projectId,
      company: req.user.company
    });
    
    if (!project) {
      return next(createError(404, 'Project not found'));
    }
    
    // Create new document
    const document = new Document({
      title,
      description,
      project: projectId,
      company: req.user.company,
      category: category || 'other',
      tags: tags || [],
      file: {
        fileName,
        fileUrl,
        fileType,
        fileSize,
        thumbnailUrl
      },
      version: {
        number: version || 1,
        history: []
      },
      uploadedBy: req.user._id,
      approvalStatus: {
        status: approvalRequired ? 'pending' : 'not_required',
        approvers: approvers ? approvers.map(approverId => ({
          user: approverId,
          status: 'pending'
        })) : []
      },
      permissions: permissions || {
        viewableBy: 'team',
        specificUsers: []
      }
    });
    
    await document.save();
    
    // Populate document with user information
    await document.populate('uploadedBy', 'firstName lastName email');
    await document.populate('approvalStatus.approvers.user', 'firstName lastName email');
    
    res.status(201).json({
      success: true,
      document
    });
  } catch (error) {
    next(createError(500, 'Error uploading document: ' + error.message));
  }
};

// Get all documents for a project
exports.getProjectDocuments = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { category, search, sort, limit = 50, page = 1 } = req.query;
    
    // Check if project exists and belongs to user's company
    const project = await Project.findOne({
      _id: projectId,
      company: req.user.company
    });
    
    if (!project) {
      return next(createError(404, 'Project not found'));
    }
    
    // Build query
    const query = { 
      project: projectId,
      company: req.user.company,
      isActive: true,
      $or: [
        { 'permissions.viewableBy': 'all' },
        { 'permissions.viewableBy': 'team' },
        { 'permissions.specificUsers': req.user._id }
      ]
    };
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Search by title, description, or filename
    if (search) {
      query.$and = [
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { 'file.fileName': { $regex: search, $options: 'i' } }
          ]
        }
      ];
    }
    
    // Build sort options
    let sortOptions = { 'version.number': -1, createdAt: -1 }; // Default sort by version (newest first)
    if (sort) {
      const [field, order] = sort.split(':');
      if (field === 'version') {
        sortOptions = { 'version.number': order === 'desc' ? -1 : 1 };
      } else {
        sortOptions = { [field]: order === 'desc' ? -1 : 1 };
      }
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const documents = await Document.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('uploadedBy', 'firstName lastName email')
      .populate('approvalStatus.approvers.user', 'firstName lastName email');
    
    // Get total count for pagination
    const totalDocuments = await Document.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: documents.length,
      totalPages: Math.ceil(totalDocuments / limit),
      currentPage: parseInt(page),
      documents
    });
  } catch (error) {
    next(createError(500, 'Error fetching documents: ' + error.message));
  }
};

// Get document by ID
exports.getDocumentById = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    
    const document = await Document.findOne({
      _id: documentId,
      company: req.user.company,
      isActive: true,
      $or: [
        { 'permissions.viewableBy': 'all' },
        { 'permissions.viewableBy': 'team' },
        { 'permissions.specificUsers': req.user._id }
      ]
    })
      .populate('uploadedBy', 'firstName lastName email')
      .populate('approvalStatus.approvers.user', 'firstName lastName email')
      .populate('version.history.updatedBy', 'firstName lastName email')
      .populate('comments.author', 'firstName lastName email');
    
    if (!document) {
      return next(createError(404, 'Document not found or you do not have permission to view it'));
    }
    
    res.status(200).json({
      success: true,
      document
    });
  } catch (error) {
    next(createError(500, 'Error fetching document: ' + error.message));
  }
};

// Update document metadata
exports.updateDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { 
      title, 
      description, 
      category, 
      tags,
      permissions
    } = req.body;
    
    // Find document
    const document = await Document.findOne({
      _id: documentId,
      company: req.user.company,
      isActive: true
    });
    
    if (!document) {
      return next(createError(404, 'Document not found'));
    }
    
    // Check if user is authorized to update document
    if (document.uploadedBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'owner' && 
        req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to update this document'));
    }
    
    // Update document fields
    if (title) document.title = title;
    if (description !== undefined) document.description = description;
    if (category) document.category = category;
    if (tags) document.tags = tags;
    if (permissions) document.permissions = permissions;
    
    await document.save();
    
    // Populate document with user information
    await document.populate('uploadedBy', 'firstName lastName email');
    await document.populate('approvalStatus.approvers.user', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      document
    });
  } catch (error) {
    next(createError(500, 'Error updating document: ' + error.message));
  }
};

// Upload new version of document
exports.uploadNewVersion = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { 
      fileUrl,
      fileType,
      fileSize,
      thumbnailUrl,
      changeNotes,
      approvalRequired,
      approvers
    } = req.body;
    
    // Find document
    const document = await Document.findOne({
      _id: documentId,
      company: req.user.company,
      isActive: true
    });
    
    if (!document) {
      return next(createError(404, 'Document not found'));
    }
    
    // Check if user is authorized to update document
    if (document.uploadedBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'owner' && 
        req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to update this document'));
    }
    
    // Add current version to history
    document.version.history.push({
      number: document.version.number,
      fileUrl: document.file.fileUrl,
      updatedBy: document.uploadedBy,
      updatedAt: document.updatedAt,
      changeNotes: changeNotes || 'Version update'
    });
    
    // Update document with new version
    document.version.number += 1;
    document.file.fileUrl = fileUrl;
    document.file.fileType = fileType || document.file.fileType;
    document.file.fileSize = fileSize || document.file.fileSize;
    document.file.thumbnailUrl = thumbnailUrl || document.file.thumbnailUrl;
    document.uploadedBy = req.user._id;
    
    // Update approval status if required
    if (approvalRequired) {
      document.approvalStatus.status = 'pending';
      document.approvalStatus.approvers = approvers ? approvers.map(approverId => ({
        user: approverId,
        status: 'pending'
      })) : [];
    } else {
      document.approvalStatus.status = 'not_required';
      document.approvalStatus.approvers = [];
    }
    
    await document.save();
    
    // Populate document with user information
    await document.populate('uploadedBy', 'firstName lastName email');
    await document.populate('approvalStatus.approvers.user', 'firstName lastName email');
    await document.populate('version.history.updatedBy', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      document
    });
  } catch (error) {
    next(createError(500, 'Error uploading new version: ' + error.message));
  }
};

// Delete document
exports.deleteDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    
    // Find document
    const document = await Document.findOne({
      _id: documentId,
      company: req.user.company
    });
    
    if (!document) {
      return next(createError(404, 'Document not found'));
    }
    
    // Check if user is authorized to delete document
    if (document.uploadedBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'owner' && 
        req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to delete this document'));
    }
    
    // Soft delete document
    document.isActive = false;
    await document.save();
    
    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(createError(500, 'Error deleting document: ' + error.message));
  }
};

// Add comment to document
exports.addDocumentComment = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { text } = req.body;
    
    if (!text) {
      return next(createError(400, 'Comment text is required'));
    }
    
    // Find document
    const document = await Document.findOne({
      _id: documentId,
      company: req.user.company,
      isActive: true,
      $or: [
        { 'permissions.viewableBy': 'all' },
        { 'permissions.viewableBy': 'team' },
        { 'permissions.specificUsers': req.user._id }
      ]
    });
    
    if (!document) {
      return next(createError(404, 'Document not found or you do not have permission to view it'));
    }
    
    // Add comment
    document.comments.push({
      text,
      author: req.user._id
    });
    
    await document.save();
    
    // Get the newly added comment
    const newComment = document.comments[document.comments.length - 1];
    
    // Populate author information
    await document.populate('comments.author', 'firstName lastName email');
    
    res.status(201).json({
      success: true,
      comment: document.comments.id(newComment._id)
    });
  } catch (error) {
    next(createError(500, 'Error adding comment: ' + error.message));
  }
};

// Approve or reject document
exports.reviewDocument = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { status, comments } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return next(createError(400, 'Status must be either "approved" or "rejected"'));
    }
    
    // Find document
    const document = await Document.findOne({
      _id: documentId,
      company: req.user.company,
      isActive: true,
      'approvalStatus.status': 'pending',
      'approvalStatus.approvers.user': req.user._id
    });
    
    if (!document) {
      return next(createError(404, 'Document not found or you are not an approver'));
    }
    
    // Update approver status
    const approverIndex = document.approvalStatus.approvers.findIndex(
      approver => approver.user.toString() === req.user._id.toString()
    );
    
    if (approverIndex === -1) {
      return next(createError(404, 'You are not an approver for this document'));
    }
    
    document.approvalStatus.approvers[approverIndex].status = status;
    document.approvalStatus.approvers[approverIndex].comments = comments;
    document.approvalStatus.approvers[approverIndex].actionDate = new Date();
    
    // Check if all approvers have reviewed
    const allReviewed = document.approvalStatus.approvers.every(
      approver => approver.status !== 'pending'
    );
    
    // Check if any approver rejected
    const anyRejected = document.approvalStatus.approvers.some(
      approver => approver.status === 'rejected'
    );
    
    // Update overall status if all have reviewed
    if (allReviewed) {
      document.approvalStatus.status = anyRejected ? 'rejected' : 'approved';
    }
    
    await document.save();
    
    // Populate document with user information
    await document.populate('approvalStatus.approvers.user', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      message: `Document ${status}`,
      approvalStatus: document.approvalStatus
    });
  } catch (error) {
    next(createError(500, 'Error reviewing document: ' + error.message));
  }
};

// Get document categories and counts
exports.getDocumentCategoryCounts = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Check if project exists and belongs to user's company
    const project = await Project.findOne({
      _id: projectId,
      company: req.user.company
    });
    
    if (!project) {
      return next(createError(404, 'Project not found'));
    }
    
    // Get document counts by category
    const categoryCounts = await Document.aggregate([
      { 
        $match: { 
          project: mongoose.Types.ObjectId(projectId),
          company: mongoose.Types.ObjectId(req.user.company),
          isActive: true
        } 
      },
      { 
        $group: { 
          _id: '$category', 
          count: { $sum: 1 } 
        } 
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      categories: categoryCounts
    });
  } catch (error) {
    next(createError(500, 'Error fetching document categories: ' + error.message));
  }
};

// Get document version history
exports.getDocumentVersionHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    
    const document = await Document.findOne({
      _id: documentId,
      company: req.user.company,
      isActive: true,
      $or: [
        { 'permissions.viewableBy': 'all' },
        { 'permissions.viewableBy': 'team' },
        { 'permissions.specificUsers': req.user._id }
      ]
    }).populate('version.history.updatedBy', 'firstName lastName email');
    
    if (!document) {
      return next(createError(404, 'Document not found or you do not have permission to view it'));
    }
    
    // Add current version to the history for display
    const versionHistory = [
      ...document.version.history,
      {
        number: document.version.number,
        fileUrl: document.file.fileUrl,
        updatedBy: document.uploadedBy,
        updatedAt: document.updatedAt,
        isCurrent: true
      }
    ];
    
    res.status(200).json({
      success: true,
      versionHistory
    });
  } catch (error) {
    next(createError(500, 'Error fetching document version history: ' + error.message));
  }
};
