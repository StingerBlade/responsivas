const SUPABASE_URL = 'https://fskwiexuvaujtntpjcmd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZza3dpZXh1dmF1anRudHBqY21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDI3MDQsImV4cCI6MjA2NzQ3ODcwNH0.iEFYCesWPR9Jd-GjAFwfLNDEJqq0JCCkEvQRYBHfQks';

const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };

  
export const fetchSupabaseData = async (table) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
        headers
      });

      if (!response.ok) {
        throw new Error(`Error fetching ${table}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      throw err;
    }
  };