
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseMessage } from '@/types/database';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const AdminMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<(DatabaseMessage & { profile: any })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<DatabaseMessage | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profile:profiles (*)
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

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          user_id: selectedMessage.user_id,
          admin_id: user.id,
          subject: `Re: ${selectedMessage.subject}`,
          content: replyContent,
          is_from_admin: true,
        }]);

      if (error) throw error;

      setReplyContent('');
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
    } finally {
      setSending(false);
    }
  };

  const groupedMessages = messages.reduce((groups, message) => {
    const key = `${message.user_id}-${message.subject.replace(/^Re: /, '')}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(message);
    return groups;
  }, {} as Record<string, typeof messages>);

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
      <div className="luxury-card">
        <div className="p-6 border-b border-rose-100">
          <h3 className="font-medium text-gray-800">Customer Messages</h3>
        </div>
        <div className="overflow-y-auto max-h-[500px]">
          {Object.entries(groupedMessages).map(([key, messageGroup]) => {
            const latestMessage = messageGroup[0];
            const unreadCount = messageGroup.filter(m => !m.is_read && !m.is_from_admin).length;
            
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedMessage(latestMessage);
                  if (!latestMessage.is_read && !latestMessage.is_from_admin) {
                    markAsRead(latestMessage.id);
                  }
                }}
                className={`w-full p-4 text-left border-b border-rose-100 hover:bg-rose-50 transition-colors ${
                  selectedMessage?.user_id === latestMessage.user_id && 
                  selectedMessage?.subject.replace(/^Re: /, '') === latestMessage.subject.replace(/^Re: /, '')
                    ? 'bg-rose-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-800">
                    {latestMessage.profile?.full_name || latestMessage.profile?.email}
                  </p>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <span className="bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                    {latestMessage.is_read ? (
                      <Eye className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-rose-500" />
                    )}
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {latestMessage.subject.replace(/^Re: /, '')}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {latestMessage.content}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(latestMessage.created_at).toLocaleDateString()}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message Details */}
      <div className="luxury-card">
        {selectedMessage ? (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-rose-100">
              <h3 className="font-medium text-gray-800">
                {selectedMessage.profile?.full_name || selectedMessage.profile?.email}
              </h3>
              <p className="text-sm text-gray-600">{selectedMessage.subject}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {/* Show conversation thread */}
              {groupedMessages[`${selectedMessage.user_id}-${selectedMessage.subject.replace(/^Re: /, '')}`]?.
                sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                .map((msg) => (
                  <div key={msg.id} className={`mb-4 ${msg.is_from_admin ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                      msg.is_from_admin 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>

            <div className="p-6 border-t border-rose-100">
              <div className="space-y-3">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Type your reply..."
                  rows={3}
                  className="resize-none"
                />
                <Button
                  onClick={sendReply}
                  disabled={!replyContent.trim() || sending}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{sending ? 'Sending...' : 'Send Reply'}</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a message to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
