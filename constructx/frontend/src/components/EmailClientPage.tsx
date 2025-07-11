import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Mail, 
  Send, 
  Archive, 
  Flag, 
  Link, 
  Folder, 
  Settings, 
  Loader2,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { useToast } from "./ui/use-toast";
// import EmailFolderTree from "./EmailFolderTree";
// import EmailList from "./EmailList";
// import EmailPreviewPane from "./EmailPreviewPane";
// import EmailComposeModal from "./EmailComposeModal";
// import EmailAccountSettings from "./EmailAccountSettings";

interface EmailClientPageProps {
  projectId?: string; // Optional - if provided, shows emails linked to specific project
}

const EmailClientPage: React.FC<EmailClientPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterReadStatus, setFilterReadStatus] = useState(""); // "read", "unread", "all"
  const [filterFlagged, setFilterFlagged] = useState(""); // "flagged", "unflagged", "all"
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [emails, setEmails] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  // Mock data for development
  const mockAccounts = [
    { id: "acc-1", emailAddress: "user@company.com", isDefault: true, status: "Connected" },
    { id: "acc-2", emailAddress: "project@company.com", isDefault: false, status: "Connected" },
  ];

  const mockFolders = [
    { id: "folder-1", name: "Inbox", unreadCount: 3, isSystemFolder: true, accountId: "acc-1" },
    { id: "folder-2", name: "Sent", unreadCount: 0, isSystemFolder: true, accountId: "acc-1" },
    { id: "folder-3", name: "Drafts", unreadCount: 1, isSystemFolder: true, accountId: "acc-1" },
    { id: "folder-4", name: "Project X", unreadCount: 0, isSystemFolder: false, accountId: "acc-1" },
    { id: "folder-5", name: "Inbox", unreadCount: 0, isSystemFolder: true, accountId: "acc-2" },
  ];

  const mockEmails = [
    {
      id: "email-1",
      accountId: "acc-1",
      projectId: "proj-1",
      subject: "Meeting Minutes - Project Alpha",
      fromAddress: "john.doe@example.com",
      toAddresses: ["user@company.com"],
      ccAddresses: [],
      bodyHtml: "<p>Please find attached the minutes from our last meeting.</p>",
      sentDate: "2025-06-15T10:00:00Z",
      receivedDate: "2025-06-15T10:05:00Z",
      isRead: false,
      isSent: false,
      isArchived: false,
      isFlagged: false,
      folderId: "folder-1",
      tags: ["Urgent", "Project Alpha"],
      linkedEntityType: "Project",
      linkedEntityId: "proj-1",
      attachments: [{ name: "minutes.pdf", fileSize: 102400, fileType: "application/pdf" }]
    },
    {
      id: "email-2",
      accountId: "acc-1",
      projectId: null,
      subject: "Weekly Report Request",
      fromAddress: "manager@example.com",
      toAddresses: ["user@company.com"],
      ccAddresses: [],
      bodyHtml: "<p>Please submit your weekly report by EOD Friday.</p>",
      sentDate: "2025-06-14T15:00:00Z",
      receivedDate: "2025-06-14T15:05:00Z",
      isRead: true,
      isSent: false,
      isArchived: false,
      isFlagged: true,
      folderId: "folder-1",
      tags: ["Action Required"],
      linkedEntityType: null,
      linkedEntityId: null,
      attachments: []
    },
    {
      id: "email-3",
      accountId: "acc-1",
      projectId: "proj-1",
      subject: "RFI-005 Response",
      fromAddress: "architect@example.com",
      toAddresses: ["user@company.com"],
      ccAddresses: [],
      bodyHtml: "<p>Response to RFI-005 is attached.</p>",
      sentDate: "2025-06-13T09:00:00Z",
      receivedDate: "2025-06-13T09:05:00Z",
      isRead: false,
      isSent: false,
      isArchived: false,
      isFlagged: false,
      folderId: "folder-1",
      tags: ["RFI"],
      linkedEntityType: "RFI",
      linkedEntityId: "rfi-005",
      attachments: [{ name: "RFI-005_Response.pdf", fileSize: 204800, fileType: "application/pdf" }]
    },
    {
      id: "email-4",
      accountId: "acc-1",
      projectId: null,
      subject: "Draft: Project Proposal",
      fromAddress: "user@company.com",
      toAddresses: ["client@example.com"],
      ccAddresses: [],
      bodyHtml: "<p>Here is the draft proposal for your review.</p>",
      sentDate: "2025-06-12T11:00:00Z",
      receivedDate: "2025-06-12T11:00:00Z",
      isRead: true,
      isSent: true,
      isArchived: false,
      isFlagged: false,
      folderId: "folder-3",
      tags: ["Draft"],
      linkedEntityType: null,
      linkedEntityId: null,
      attachments: []
    },
  ];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [projectId, selectedAccount, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // This will be replaced with actual API calls
      // const [accountsResponse, foldersResponse, emailsResponse] = await Promise.all([
      //   emailService.getEmailAccounts(),
      //   emailService.getFolders(selectedAccount || accounts[0]?.id),
      //   emailService.getEmails(selectedAccount || accounts[0]?.id, activeTab, { projectId, searchTerm, filterReadStatus, filterFlagged })
      // ]);
      
      // Mock data loading
      setTimeout(() => {
        setAccounts(mockAccounts);
        if (!selectedAccount && mockAccounts.length > 0) {
          setSelectedAccount(mockAccounts[0].id);
        }
        setFolders(mockFolders.filter(f => f.accountId === (selectedAccount || mockAccounts[0]?.id)));
        setEmails(mockEmails.filter(e => 
          (e.accountId === (selectedAccount || mockAccounts[0]?.id)) &&
          (projectId ? e.projectId === projectId : true) &&
          (activeTab === "inbox" ? e.folderId === "folder-1" : true) && // Simple folder logic
          (searchTerm ? e.subject.toLowerCase().includes(searchTerm.toLowerCase()) || e.bodyHtml.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
          (filterReadStatus === "read" ? e.isRead : filterReadStatus === "unread" ? !e.isRead : true) &&
          (filterFlagged === "flagged" ? e.isFlagged : filterFlagged === "unflagged" ? !e.isFlagged : true)
        ));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading email data:", error);
      toast({
        title: "Error",
        description: "Failed to load email data. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case "readStatus":
        setFilterReadStatus(value);
        break;
      case "flagged":
        setFilterFlagged(value);
        break;
    }
  };

  // Handle email actions (mark as read/unread, archive, flag, delete)
  const handleEmailAction = (action: string, emailId: string) => {
    // This will be replaced with actual API calls
    setEmails(prev => prev.map(email => {
      if (email.id === emailId) {
        switch (action) {
          case "read": return { ...email, isRead: true };
          case "unread": return { ...email, isRead: false };
          case "archive": return { ...email, isArchived: true };
          case "flag": return { ...email, isFlagged: true };
          case "unflag": return { ...email, isFlagged: false };
          case "delete": return null; // Filter out later
          default: return email;
        }
      }
      return email;
    }).filter(Boolean));

    toast({
      title: "Success",
      description: `Email ${action}ed successfully.`
    });
    setSelectedEmail(null); // Close preview if action affects current email
  };

  // Handle compose email
  const handleCompose = () => {
    setShowComposeModal(true);
  };

  // Handle compose submit
  const handleComposeSubmit = (emailData: any) => {
    // This will be replaced with actual API call
    const newEmail = {
      id: `email-${Date.now()}`,
      accountId: selectedAccount || mockAccounts[0].id,
      projectId: projectId || null,
      isSent: true,
      sentDate: new Date().toISOString(),
      receivedDate: new Date().toISOString(),
      isRead: true,
      isArchived: false,
      isFlagged: false,
      folderId: "folder-2", // Sent folder
      tags: [],
      linkedEntityType: null,
      linkedEntityId: null,
      attachments: [],
      ...emailData,
    };
    setEmails(prev => [...prev, newEmail]);
    toast({
      title: "Success",
      description: "Email sent successfully."
    });
    setShowComposeModal(false);
  };

  // Handle email selection for preview
  const handleEmailSelect = (email: any) => {
    setSelectedEmail(email);
    // Mark as read if unread
    if (!email.isRead) {
      handleEmailAction("read", email.id);
    }
  };

  if (isLoading && emails.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-10rem)]">
      {/* Left Pane: Folders and Accounts */}
      <Card className="w-64 flex-shrink-0 border-r rounded-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Mailboxes</CardTitle>
          <CardDescription>Manage your connected email accounts.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-60px)]">
          <div className="mb-4">
            <Label htmlFor="account-select" className="sr-only">Select Account</Label>
            <Select value={selectedAccount || ""} onValueChange={setSelectedAccount}>
              <SelectTrigger id="account-select">
                <SelectValue placeholder="Select an account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.emailAddress}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCompose} className="w-full mb-4">
            <Send className="h-4 w-4 mr-2" />
            Compose
          </Button>
          <div className="flex-grow overflow-y-auto">
            {/* <EmailFolderTree 
              folders={folders}
              onSelectFolder={(folderId) => setActiveTab(folderId)} // Simple mapping for now
              activeFolder={activeTab}
            /> */}
            <div className="space-y-1">
              {folders.map(folder => (
                <Button 
                  key={folder.id} 
                  variant={activeTab === folder.id ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setActiveTab(folder.id)}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  {folder.name} {folder.unreadCount > 0 && <Badge className="ml-auto">{folder.unreadCount}</Badge>}
                </Button>
              ))}
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start mt-4" onClick={() => setShowAccountSettings(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Button>
        </CardContent>
      </Card>

      {/* Middle Pane: Email List */}
      <Card className="flex-grow border-r rounded-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Inbox</CardTitle>
          <CardDescription>Your latest emails.</CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-60px)] flex flex-col">
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterReadStatus} onValueChange={(value) => handleFilterChange("readStatus", value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Read Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterFlagged} onValueChange={(value) => handleFilterChange("flagged", value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Flagged" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="unflagged">Unflagged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-grow overflow-y-auto">
            {/* <EmailList 
              emails={emails}
              onSelectEmail={handleEmailSelect}
              onAction={handleEmailAction}
              selectedEmailId={selectedEmail?.id}
            /> */}
            <div className="space-y-2">
              {emails.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No emails found.</div>
              ) : (
                emails.map(email => (
                  <Card 
                    key={email.id} 
                    className={cn(
                      "cursor-pointer hover:bg-accent",
                      email.id === selectedEmail?.id && "bg-accent",
                      !email.isRead && "font-semibold"
                    )}
                    onClick={() => handleEmailSelect(email)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold">{email.fromAddress}</span>
                        <span className="text-muted-foreground text-xs">{new Date(email.receivedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm truncate">{email.subject}</div>
                      <div className="text-xs text-muted-foreground truncate">{email.bodyText || email.bodyHtml.replace(/<[^>]*>?/gm, "")}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        {email.isFlagged && <Flag className="h-3 w-3 text-orange-500" />}
                        {email.attachments.length > 0 && <Paperclip className="h-3 w-3 text-muted-foreground" />}
                        {email.linkedEntityId && <Link className="h-3 w-3 text-blue-500" />}
                        {email.tags.map((tag: string) => <Badge key={tag} variant="secondary" className="h-4 px-1 text-xs">{tag}</Badge>)}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Pane: Email Preview */}
      <Card className="flex-grow rounded-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Email Preview</CardTitle>
          <CardDescription>View selected email details.</CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-60px)] flex flex-col">
          {selectedEmail ? (
            // <EmailPreviewPane 
            //   email={selectedEmail}
            //   onAction={handleEmailAction}
            // />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{selectedEmail.subject}</h3>
                  <p className="text-sm text-muted-foreground">From: {selectedEmail.fromAddress}</p>
                  <p className="text-sm text-muted-foreground">To: {selectedEmail.toAddresses.join(", ")}</p>
                  {selectedEmail.ccAddresses.length > 0 && <p className="text-sm text-muted-foreground">Cc: {selectedEmail.ccAddresses.join(", ")}</p>}
                  <p className="text-sm text-muted-foreground">Date: {new Date(selectedEmail.receivedDate).toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEmailAction("archive", selectedEmail.id)}><Archive className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleEmailAction(selectedEmail.isFlagged ? "unflag" : "flag", selectedEmail.id)}><Flag className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleEmailAction("delete", selectedEmail.id)}><Trash2 className="h-4 w-4" /></Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEmailAction("read", selectedEmail.id)}>Mark as Read</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEmailAction("unread", selectedEmail.id)}>Mark as Unread</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Reply</DropdownMenuItem>
                      <DropdownMenuItem>Reply All</DropdownMenuItem>
                      <DropdownMenuItem>Forward</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Link to Project Entity</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="border-t pt-4 overflow-y-auto flex-grow" dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }} />
              {selectedEmail.attachments.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmail.attachments.map((attachment: any) => (
                      <Badge key={attachment.name} variant="secondary" className="flex items-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        {attachment.name} ({Math.round(attachment.fileSize / 1024)} KB)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select an email to view its content.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compose Email Modal */}
      {showComposeModal && (
        // <EmailComposeModal
        //   onClose={() => setShowComposeModal(false)}
        //   onSubmit={handleComposeSubmit}
        // />
        <Dialog open={true} onOpenChange={setShowComposeModal}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Compose New Email</DialogTitle>
              <DialogDescription>Send a new email to project stakeholders.</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleComposeSubmit({}); }} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="to" className="text-right">To</Label>
                <Input id="to" name="to" className="col-span-3" placeholder="recipients@example.com" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">Subject</Label>
                <Input id="subject" name="subject" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="body" className="text-right">Body</Label>
                <Textarea id="body" name="body" className="col-span-3 min-h-[150px]" />
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowComposeModal(false)}>Cancel</Button>
              <Button type="submit" onClick={(e) => { e.preventDefault(); handleComposeSubmit({}); }}>Send</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Account Settings Modal */}
      {showAccountSettings && (
        // <EmailAccountSettings
        //   accounts={accounts}
        //   onClose={() => setShowAccountSettings(false)}
        //   onUpdate={() => loadData()} // Reload data after account changes
        // />
        <Dialog open={true} onOpenChange={setShowAccountSettings}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Email Account Settings</DialogTitle>
              <DialogDescription>Manage your connected email accounts.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {accounts.map(account => (
                <Card key={account.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md">{account.emailAddress}</CardTitle>
                    <Badge variant={account.status === "Connected" ? "default" : "destructive"}>{account.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{account.isDefault ? "Default Account" : ""}</p>
                    <div className="flex space-x-2 mt-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Sync Now</Button>
                      <Button variant="destructive" size="sm">Disconnect</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button className="w-full"><Plus className="h-4 w-4 mr-2" />Add New Account</Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAccountSettings(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmailClientPage;


