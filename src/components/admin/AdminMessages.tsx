
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Eye, Reply } from 'lucide-react';
import { DatabaseMessage, DatabaseProfile } from '@/types/database';

interface MessageWithProfile extends DatabaseMessage {
  profiles?: DatabaseProfile;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
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
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
        <div className="love-shapes"></div>
        <div className="relative z-10 p-4 sm:p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-gray-50/30 to-purple-50/30 relative overflow-hidden">
      <div className="love-shapes"></div>
      
      <div className="relative z-10 p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-light text-gray-800">Messages</h2>
          <Badge className="bg-pink-100 text-pink-800">
            {messages.filter(m => !m.is_read).length} unread
          </Badge>
        </div>

        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className={`glassmorphic transition-all duration-300 ${!message.is_read ? 'border-pink-300' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg text-gray-800 mb-1">
                      {message.subject}
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-gray-600">
                      From: {message.profiles?.full_name || message.profiles?.email || 'Unknown'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!message.is_read && (
                      <Badge className="bg-pink-100 text-pink-800 text-xs">New</Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                  {message.content}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsRead(message.id)}
                    disabled={message.is_read}
                    className="text-xs"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    {message.is_read ? 'Read' : 'Mark as Read'}
                  </Button>
                  <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white text-xs">
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {messages.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-base sm:text-lg">No messages yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
