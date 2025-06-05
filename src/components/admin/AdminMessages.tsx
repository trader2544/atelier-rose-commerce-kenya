
import React, { useState, useEffect } from 'react';
import { Search, Send, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  user_id: string;
  admin_id?: string;
  subject: string;
  content: string;
  is_from_admin: boolean;
  is_read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
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

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light text-gray-800">Messages</h2>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/70 border-pink-200"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className="glassmorphic">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-medium text-gray-800">
                    {message.subject}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Badge className={message.is_read ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {message.is_read ? 'Read' : 'Unread'}
                  </Badge>
                  <Badge className={message.is_from_admin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                    {message.is_from_admin ? 'From Admin' : 'From User'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm">{message.content}</p>
            </CardContent>
          </Card>
        ))}

        {filteredMessages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600">No messages found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
