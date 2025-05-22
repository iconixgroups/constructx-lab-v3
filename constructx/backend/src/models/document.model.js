const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  category: {
    type: String,
    enum: [
      'contract', 
      'drawing', 
      'specification', 
      'submittal', 
      'rfi', 
      'change_order', 
      'meeting_minutes', 
      'schedule', 
      'budget', 
      'invoice', 
      'permit', 
      'safety', 
      'quality', 
      'photo', 
      'other'
    ],
    default: 'other'
  },
  tags: [String],
  file: {
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number, // in bytes
      required: true
    },
    thumbnailUrl: String
  },
  version: {
    number: {
      type: Number,
      default: 1
    },
    history: [{
      number: Number,
      fileUrl: String,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      updatedAt: {
        type: Date,
        default: Date.now
      },
      changeNotes: String
    }]
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvalStatus: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'not_required'],
      default: 'not_required'
    },
    approvers: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      comments: String,
      actionDate: Date
    }]
  },
  permissions: {
    viewableBy: {
      type: String,
      enum: ['all', 'team', 'specific_users'],
      default: 'team'
    },
    specificUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  comments: [{
    text: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
documentSchema.index({ project: 1, category: 1 });
documentSchema.index({ company: 1 });
documentSchema.index({ 'file.fileName': 'text', title: 'text', description: 'text' });
documentSchema.index({ tags: 1 });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
