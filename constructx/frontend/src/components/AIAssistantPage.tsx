import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  MessageSquare, 
  Lightbulb, 
  Settings, 
  Loader2,
  Send,
  Archive,
  Plus,
  Search,
  Filter,
  Star,
  Bell,
  Zap,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { useToast } from './ui/use-toast';
import aiAssistantService from '../services/aiAssistantService';

// import AIConversationList from './AIConversationList';
// import AIConversationView from './AIConversationView';
// import AIMessageInput from './AIMessageInput';
// import AIActionCard from './AIActionCard';
// import AIInsightsList from './AIInsightsList';
// import AISettingsPanel from './AISettingsPanel';

interface AIAssistantPageProps {
  projectId?: string; // Optional - if provided, sets project context
}

const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [assistantConfig, setAssistantConfig] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadData();
  }, [projectId]);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
    }
  }, [activeConversation]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [conversationsResponse, insightsResponse, actionsResponse, configResponse] = await Promise.all([
        aiAssistantService.getConversations(projectId),
        aiAssistantService.getInsights(projectId),
        aiAssistantService.getActions(projectId),
        aiAssistantService.getAssistantConfig(),
      ]);

      setConversations(conversationsResponse);
      setInsights(insightsResponse);
      setActions(actionsResponse);
      setAssistantConfig(configResponse);

      if (conversationsResponse.length > 0 && !activeConversation) {
        setActiveConversation(conversationsResponse[0]);
      }

    } catch (error) {
      console.error('Error loading AI Assistant data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load AI Assistant data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoading(true);
    try {
      const messagesResponse = await aiAssistantService.getMessages(conversationId);
      setMessages(messagesResponse);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'User', content: messageContent, createdAt: new Date().toISOString() }]);

    try {
      await aiAssistantService.sendMessage(activeConversation.id, { content: messageContent, sender: 'User' });
      // In a real app, the assistant's response would come via a WebSocket or another API call
      // For now, simulate a response
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString() + '-ai', sender: 'Assistant', content: `I received your message: "${messageContent}". How can I help further?`, createdAt: new Date().toISOString() }]);
      }, 1000);
      toast({
        title: 'Message Sent',
        description: 'Your message has been sent to the AI Assistant.',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateNewConversation = async () => {
    setIsLoading(true);
    try {
      const newConv = await aiAssistantService.createConversation({ title: 'New Conversation', projectId: projectId });
      setConversations(prev => [newConv, ...prev]);
      setActiveConversation(newConv);
      setMessages([]);
      toast({
        title: 'Success',
        description: 'New conversation created.',
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new conversation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveConversation = async (conversationId: string) => {
    setIsLoading(true);
    try {
      await aiAssistantService.updateConversation(conversationId, { isArchived: true });
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      setActiveConversation(null);
      setMessages([]);
      toast({
        title: 'Success',
        description: 'Conversation archived.',
      });
    } catch (error) {
      console.error('Error archiving conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to archive conversation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptAction = async (actionId: string) => {
    setIsLoading(true);
    try {
      await aiAssistantService.acceptAction(actionId);
      toast({
        title: 'Success',
        description: 'AI Action accepted.',
      });
      loadData(); // Reload data to update action status
    } catch (error) {
      console.error('Error accepting action:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept AI Action. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkInsightAsRead = async (insightId: string) => {
    setIsLoading(true);
    try {
      await aiAssistantService.markInsightAsRead(insightId);
      toast({
        title: 'Success',
        description: 'Insight marked as read.',
      });
      loadData(); // Reload data to update insight status
    } catch (error) {
      console.error('Error marking insight as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark insight as read. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && conversations.length === 0 && insights.length === 0 && actions.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground">
            {projectId ? `AI insights for project ${projectId}` : 'Your intelligent assistant for all things construction'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <BookOpen className="h-4 w-4 mr-2" />
            Help
          </Button>
          <Button variant="outline" onClick={() => setActiveTab('settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="chat">
            <MessageSquare className="h-4 w-4 mr-2" /> Chat
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Lightbulb className="h-4 w-4 mr-2" /> Insights
          </TabsTrigger>
          <TabsTrigger value="actions">
            <Zap className="h-4 w-4 mr-2" /> Actions
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Conversation List */}
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Conversations</CardTitle>
                <Button size="sm" onClick={handleCreateNewConversation}>
                  <Plus className="h-4 w-4 mr-2" /> New Chat
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                {conversations.length > 0 ? (
                  conversations.map(conv => (
                    <div
                      key={conv.id}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer
                        ${activeConversation?.id === conv.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                      onClick={() => setActiveConversation(conv)}
                    >
                      <span className="text-sm font-medium truncate">{conv.title || 'Untitled Conversation'}</span>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleArchiveConversation(conv.id); }}>
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No conversations yet. Start a new chat!</p>
                )}
              </CardContent>
            </Card>

            {/* Chat View */}
            <Card className="lg:col-span-2 flex flex-col">
              <CardHeader>
                <CardTitle>{activeConversation?.title || 'Select a Conversation'}</CardTitle>
                <CardDescription>Project Context: {projectId || 'None'}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20 rounded-md">
                {messages.length > 0 ? (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'User' ? 'bg-primary text-primary-foreground' : 'bg-background shadow'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <span className="text-xs text-muted-foreground block text-right mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-10">
                    <MessageSquare className="mx-auto h-12 w-12 mb-4" />
                    <p>Start a conversation with your AI Assistant.</p>
                  </div>
                )}
              </CardContent>
              <div className="p-4 border-t flex items-center gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                  disabled={!activeConversation}
                />
                <Button onClick={handleSendMessage} disabled={!activeConversation || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search insights..."
                  value={''} // Placeholder
                  onChange={() => {}} // Placeholder
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={''} onValueChange={() => {}}> {/* Placeholder */}
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                </SelectContent>
              </Select>
              <Select value={''} onValueChange={() => {}}> {/* Placeholder */}
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Importance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Importance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.length > 0 ? (
              insights.map(insight => (
                <Card key={insight.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className={`text-xs font-semibold ${insight.importance === 'High' ? 'text-red-500' : insight.importance === 'Medium' ? 'text-orange-500' : 'text-green-500'}`}>
                        {insight.importance} Importance
                      </span>
                      <Button variant="outline" size="sm" onClick={() => handleMarkInsightAsRead(insight.id)} disabled={insight.isRead}>
                        {insight.isRead ? 'Read' : 'Mark as Read'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full p-8 text-center text-muted-foreground">
                <CardTitle>No Insights yet!</CardTitle>
                <CardDescription className="mt-2">
                  The AI Assistant will generate insights based on your project data.
                </CardDescription>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search actions..."
                  value={''} // Placeholder
                  onChange={() => {}} // Placeholder
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={''} onValueChange={() => {}}> {/* Placeholder */}
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.length > 0 ? (
              actions.map(action => (
                <Card key={action.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{action.title}</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className={`text-xs font-semibold ${action.status === 'Pending' ? 'text-orange-500' : action.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}`}>
                        Status: {action.status}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => handleAcceptAction(action.id)} disabled={action.status !== 'Pending'}>
                        Accept Action
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full p-8 text-center text-muted-foreground">
                <CardTitle>No Actions yet!</CardTitle>
                <CardDescription className="mt-2">
                  The AI Assistant will suggest actions based on your project data.
                </CardDescription>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant Settings</CardTitle>
              <CardDescription>Manage your AI Assistant preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">General Settings</h3>
                <div className="flex items-center justify-between mt-2">
                  <span>Enable AI Assistant</span>
                  {/* Placeholder for toggle switch */}
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    {assistantConfig?.isEnabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">Privacy Settings</h3>
                <p className="text-sm text-muted-foreground">Control how your data is used by the AI Assistant.</p>
                {/* Placeholder for privacy options */}
              </div>
              <div>
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">Choose when to receive notifications from the AI Assistant.</p>
                {/* Placeholder for notification options */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAssistantPage;


