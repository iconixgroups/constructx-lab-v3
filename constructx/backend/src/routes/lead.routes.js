const express = require("express");
const {
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
    // Import controllers for updating/deleting activities and notes if implemented
} = require("../controllers/lead.controller");
const { protect } = require("../middleware/auth"); // Assuming protect middleware handles authentication

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

// Lead Routes
router.route("/")
    .get(getLeads)
    .post(createLead);

router.route("/:id")
    .get(getLeadById)
    .put(updateLead)
    .delete(deleteLead);

// Lead Conversion Route
router.route("/:id/convert-to-project")
    .post(convertLeadToProject);

// Lead Contact Routes (nested under leads for creation, direct for updates/deletes)
router.route("/:leadId/contacts")
    .get(getLeadContacts)
    .post(addLeadContact);

// Routes for individual contacts (assuming contact ID is unique)
// Note: The controller uses /api/leads/contacts/:id, adjust if needed
router.route("/contacts/:id")
    // .get(getLeadContactById) // Controller not implemented, add if needed
    .put(updateLeadContact)
    .delete(removeLeadContact);
// router.route("/contacts/:id/primary").put(setPrimaryContact); // Controller not implemented, add if needed

// Lead Activity Routes
router.route("/:leadId/activities")
    .get(getLeadActivities)
    .post(addLeadActivity);

// Routes for individual activities (assuming activity ID is unique)
// router.route("/activities/:id")
    // .get(getLeadActivityById) // Controller not implemented, add if needed
    // .put(updateLeadActivity) // Controller not implemented, add if needed
    // .delete(deleteLeadActivity); // Controller not implemented, add if needed

// Lead Note Routes
router.route("/:leadId/notes")
    .get(getLeadNotes)
    .post(addLeadNote);

// Routes for individual notes (assuming note ID is unique)
// router.route("/notes/:id")
    // .put(updateLeadNote) // Controller not implemented, add if needed
    // .delete(deleteLeadNote); // Controller not implemented, add if needed

// Placeholder routes for fetching enums/types (implement controllers if needed)
// router.get("/statuses", getLeadStatuses);
// router.get("/sources", getLeadSources);
// router.get("/activity-types", getActivityTypes);

module.exports = router;

