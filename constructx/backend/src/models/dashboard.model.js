const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  name: {
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  layout: {
    columns: {
      type: Number,
      default: 3,
      min: 1,
      max: 4
    },
    widgets: [
      {
        type: {
          type: String,
          enum: [
            'project_summary',
            'task_status',
            'schedule_timeline',
            'budget_overview',
            'team_performance',
            'recent_activity',
            'upcoming_milestones',
            'risk_assessment',
            'weather_forecast',
            'document_activity',
            'quality_metrics',
            'safety_incidents',
            'custom_chart'
          ],
          required: true
        },
        title: {
          type: String,
          required: true
        },
        size: {
          width: {
            type: Number,
            default: 1,
            min: 1,
            max: 4
          },
          height: {
            type: Number,
            default: 1,
            min: 1,
            max: 4
          }
        },
        position: {
          x: {
            type: Number,
            default: 0
          },
          y: {
            type: Number,
            default: 0
          }
        },
        config: {
          type: Map,
          of: mongoose.Schema.Types.Mixed
        },
        dataSource: {
          type: String
        },
        refreshInterval: {
          type: Number,
          default: 300 // in seconds
        }
      }
    ]
  },
  sharedWith: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      permission: {
        type: String,
        enum: ['view', 'edit'],
        default: 'view'
      }
    }
  ],
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

// Index for faster queries
dashboardSchema.index({ project: 1, isDefault: 1 });
dashboardSchema.index({ company: 1 });
dashboardSchema.index({ 'sharedWith.user': 1 });

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

module.exports = Dashboard;
