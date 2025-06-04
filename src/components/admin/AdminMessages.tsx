
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MessageWithProfile } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const AdminMessages = () => {
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageWithProfile | null>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles:user_id (
          id,
          email,
          full_name,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const sendReply = async () => {
    if (!selectedMessage || !reply.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        user_id: selectedMessage.user_id,
        admin_id: selectedMessage.admin_id,
        subject: `Re: ${selectedMessage.subject}`,
        content: reply,
        is_from_admin: true,
        is_read: false
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Reply sent successfully",
      });
      setReply('');
      setSelectedMessage(null);
      fetchMessages();
    }
  };

  if (loading) {
    return <div className="p-6">Loading messages...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="p-6">
        <h2 className="text-2xl font-light text-gray-800 mb-6">Customer Messages</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className="luxury-card cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => setSelectedMessage(message)}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-pink-800">
                    {message.subject}
                  </CardTitle>
                  <p className="text-xs text-gray-600">
                    From: {message.profiles?.full_name || message.profiles?.email || 'Unknown User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {message.content}
                  </p>
                  {!message.is_read && (
                    <span className="inline-block mt-2 px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                      New
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Message Detail & Reply */}
          {selectedMessage && (
            <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="text-pink-800">{selectedMessage.subject}</CardTitle>
                <p className="text-sm text-gray-600">
                  From: {selectedMessage.profiles?.full_name || selectedMessage.profiles?.email || 'Unknown User'}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Message:</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedMessage.content}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Reply:</h4>
                  <Textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply here..."
                    className="border-pink-200 focus:border-pink-400"
                    rows={4}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button onClick={sendReply} className="bg-pink-600 hover:bg-pink-700 text-white">
                    Send Reply
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedMessage(null)} className="border-pink-200 hover:bg-pink-50">
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
