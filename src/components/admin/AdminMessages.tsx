
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseMessage, DatabaseProfile } from '@/types/database';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface MessageWithProfile extends DatabaseMessage {
  profiles?: DatabaseProfile;
}

const AdminMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<MessageWithProfile | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles!messages_user_id_fkey (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyContent.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: selectedMessage.user_id,
          admin_id: user.id,
          subject: `Re: ${selectedMessage.subject}`,
          content: replyContent.trim(),
          is_from_admin: true,
          is_read: false,
        });

      if (error) throw error;

      setReplyContent('');
      setSelectedMessage(null);
      fetchMessages();

      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully.",
      });
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    }
  };

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectMessage = (message: MessageWithProfile) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
      {/* Messages List */}
      <div className="luxury-card flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => handleSelectMessage(message)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedMessage?.id === message.id ? 'bg-rose-50' : ''
              } ${!message.is_read && !message.is_from_admin ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800">
                    {message.profiles?.full_name || message.profiles?.email}
                  </span>
                  {!message.is_read && !message.is_from_admin && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(message.created_at).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-medium text-gray-800 mb-1">{message.subject}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
              {message.is_from_admin && (
                <span className="inline-block mt-2 px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded-full">
                  Admin Reply
                </span>
              )}
            </div>
          ))}
          
          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No messages found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search criteria.' : 'Messages will appear here.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Detail & Reply */}
      <div className="luxury-card flex flex-col">
        {selectedMessage ? (
          <>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">
                  {selectedMessage.profiles?.full_name || selectedMessage.profiles?.email}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{selectedMessage.subject}</h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
            </div>
            
            {!selectedMessage.is_from_admin && (
              <div className="p-4 border-t">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply..."
                  className="mb-3"
                  rows={4}
                />
                <Button
                  onClick={sendReply}
                  disabled={!replyContent.trim()}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Reply</span>
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Select a message to view details and reply</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
