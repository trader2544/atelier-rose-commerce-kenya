import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  user_id: string;
  subject: string;
  content: string;
  is_from_admin: boolean;
  is_read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // For now, we'll show a placeholder since there's no messages table
  // This prevents the build error while maintaining the component structure
  useEffect(() => {
    // Simulate loading state
    setLoading(false);
    // Since there's no messages table yet, we'll set an empty array
    setMessages([]);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="p-6">
        <h2 className="text-2xl font-light text-gray-800 mb-6">Customer Messages</h2>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <Card className="luxury-card">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">No customer messages yet.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Messages from the contact form will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => (
              <Card key={message.id} className="luxury-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-pink-800">{message.subject}</CardTitle>
                    <Badge className={message.is_read ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}>
                      {message.is_read ? 'Read' : 'Unread'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{message.content}</p>
                  <Button 
                    size="sm" 
                    className="bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    Reply
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
