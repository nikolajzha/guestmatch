
-- Create messages table for chat
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages in their conversations (via accepted contact_requests)
CREATE POLICY "Users can view their messages"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.contact_requests cr
    WHERE cr.id = conversation_id
    AND cr.status = 'accepted'
    AND (cr.sender_id = auth.uid() OR cr.receiver_id = auth.uid())
  )
);

-- Users can send messages in their conversations
CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.contact_requests cr
    WHERE cr.id = conversation_id
    AND cr.status = 'accepted'
    AND (cr.sender_id = auth.uid() OR cr.receiver_id = auth.uid())
  )
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
