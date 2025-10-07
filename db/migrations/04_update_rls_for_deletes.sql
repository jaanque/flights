CREATE POLICY "Allow individual delete access" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);