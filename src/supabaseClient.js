import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nafspezaagsjyzziqplz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZnNwZXphYWdzanl6emlxcGx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTI5NDYsImV4cCI6MjA3NTMyODk0Nn0.OPKrQmCEnScHRvFztxS4uI7PXBGVNihNt-V16aAhn34';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const checkUsernameUnique = async (username) => {
    const { data, error } = await supabase
      .from('perfiles')
      .select('nombre_de_usuario')
      .eq('nombre_de_usuario', username);

    if (error) {
      console.error('Error checking username:', error);
      return false;
    }

    return data.length === 0;
  };