import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { PlusCircle, Edit, Trash2, Star, Mail, Phone } from "lucide-react";

// Mock API (replace with actual API calls)
const mockApi = {
    getLeadContacts: async (leadId) => {
        console.log("Fetching contacts for lead:", leadId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return [
            { id: "contact1", leadId: leadId, firstName: "John", lastName: "Doe", email: "john.doe@example.com", phone: "555-1234", position: "Project Manager", isPrimary: true, notes: "Main point of contact" },
            { id: "contact2", leadId: leadId, firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", phone: "555-5678", position: "Architect", isPrimary: false, notes: "Handles technical details" },
        ];
    },
    addLeadContact: async (leadId, contactData) => {
        console.log("Adding contact:", leadId, contactData);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { ...contactData, id: `contact${Math.random().toString(36).substring(7)}`, leadId: leadId };
    },
    updateLeadContact: async (contactId, contactData) => {
        console.log("Updating contact:", contactId, contactData);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { ...contactData, id: contactId };
    },
    deleteLeadContact: async (contactId) => {
        console.log("Deleting contact:", contactId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    },
    setPrimaryContact: async (contactId) => {
        console.log("Setting primary contact:", contactId);
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }
};

// Helper to get initials
const getInitials = (firstName, lastName) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return `${first}${last}`.toUpperCase() || "?";
};

// Contact Form Component (can be extracted to its own file)
const ContactForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phone: "", position: "", isPrimary: false, notes: ""
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.firstName || "",
                lastName: initialData.lastName || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
                position: initialData.position || "",
                isPrimary: initialData.isPrimary || false,
                notes: initialData.notes || "",
            });
        } else {
            setFormData({ firstName: "", lastName: "", email: "", phone: "", position: "", isPrimary: false, notes: "" });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.lastName) {
            alert("First Name and Last Name are required.");
            return;
        }
        onSave({ ...formData, id: initialData?.id });
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">First Name*</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">Last Name*</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">Position</Label>
                <Input id="position" name="position" value={formData.position} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Input id="notes" name="notes" value={formData.notes} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isPrimary" className="text-right">Primary Contact</Label>
                <Checkbox id="isPrimary" name="isPrimary" checked={formData.isPrimary} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrimary: checked }))} className="col-span-3 justify-self-start" />
            </div>
            <div className="flex justify-end gap-2 mt-4 col-span-4">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{initialData ? "Save Changes" : "Add Contact"}</Button>
            </div>
        </form>
    );
};

const LeadContactsList = ({ leadId }) => {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            if (!leadId) return;
            setIsLoading(true);
            setError(null);
            try {
                const data = await mockApi.getLeadContacts(leadId);
                setContacts(data);
            } catch (err) {
                console.error("Error fetching contacts:", err);
                setError("Failed to load contacts.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchContacts();
    }, [leadId]);

    const handleFormSave = async (contactData) => {
        try {
            let savedContact;
            if (editingContact) {
                savedContact = await mockApi.updateLeadContact(editingContact.id, contactData);
                setContacts(prev => prev.map(c => c.id === savedContact.id ? savedContact : c));
            } else {
                savedContact = await mockApi.addLeadContact(leadId, contactData);
                setContacts(prev => [...prev, savedContact]);
            }
            // Handle setting primary contact if checked
            if (savedContact.isPrimary) {
                await handleSetPrimary(savedContact.id, true); // Update UI optimistically
            }
            setIsFormOpen(false);
            setEditingContact(null);
        } catch (err) {
            console.error("Error saving contact:", err);
            alert("Failed to save contact.");
        }
    };

    const handleEdit = (contact) => {
        setEditingContact(contact);
        setIsFormOpen(true);
    };

    const handleDelete = async (contactId) => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            try {
                await mockApi.deleteLeadContact(contactId);
                setContacts(prev => prev.filter(c => c.id !== contactId));
            } catch (err) {
                console.error("Error deleting contact:", err);
                alert("Failed to delete contact.");
            }
        }
    };

    const handleSetPrimary = async (contactId, forceSet = false) => {
        // Prevent unsetting the only primary contact directly
        const currentPrimary = contacts.find(c => c.isPrimary);
        if (!forceSet && currentPrimary?.id === contactId) {
            alert("To change the primary contact, set another contact as primary.");
            return;
        }

        try {
            await mockApi.setPrimaryContact(contactId);
            // Update UI optimistically
            setContacts(prev => prev.map(c => ({ ...c, isPrimary: c.id === contactId })));
        } catch (err) {
            console.error("Error setting primary contact:", err);
            alert("Failed to set primary contact.");
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Contacts</CardTitle>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setEditingContact(null)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Contact
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingContact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
                        </DialogHeader>
                        <ContactForm
                            initialData={editingContact}
                            onSave={handleFormSave}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {isLoading && <div className="text-center">Loading contacts...</div>}
                {error && <div className="text-center text-red-500">{error}</div>}
                {!isLoading && !error && contacts.length === 0 && (
                    <div className="text-center text-muted-foreground">No contacts added yet.</div>
                )}
                {!isLoading && !error && contacts.length > 0 && (
                    <div className="space-y-4">
                        {contacts.map(contact => (
                            <div key={contact.id} className="flex items-start gap-4 p-3 border rounded-lg">
                                <Avatar className="h-10 w-10 border">
                                    {/* <AvatarImage src={contact.avatarUrl} /> */}
                                    <AvatarFallback>{getInitials(contact.firstName, contact.lastName)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow text-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="font-medium">{contact.firstName} {contact.lastName}</span>
                                            {contact.isPrimary && <Star className="inline-block ml-1 h-3 w-3 text-yellow-500 fill-yellow-400" title="Primary Contact"/>}
                                            <p className="text-xs text-muted-foreground">{contact.position}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(contact)} title="Edit">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(contact.id)} title="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    {contact.email && <a href={`mailto:${contact.email}`} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3"/>{contact.email}</a>}
                                    {contact.phone && <a href={`tel:${contact.phone}`} className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary"><Phone className="h-3 w-3"/>{contact.phone}</a>}
                                    {contact.notes && <p className="text-xs mt-1 text-muted-foreground">Notes: {contact.notes}</p>}
                                    {!contact.isPrimary && (
                                        <Button variant="link" size="sm" className="h-auto p-0 text-xs mt-1" onClick={() => handleSetPrimary(contact.id)}>
                                            Set as Primary
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LeadContactsList;

