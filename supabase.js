window.SUPABASE_URL = 'https://auzrmzisuxslxpvybplc.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1enJtemlzdXhzbHhwdnlicGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NDUzMzAsImV4cCI6MjA4OTEyMTMzMH0.Z7n90wRem2IkP6ONYMvPHnFU2XdW94-WD4DlfXGEV7I';
window.RVD_DEFAULT_PROFILE_ID = '487877f0-14e7-43a9-86cd-93316c3b358c';
window.sb = function(){
  if(!window.supabase || !window.supabase.createClient) throw new Error('Supabase library niet geladen.');
  if(!window._sbClient){
    window._sbClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
  }
  return window._sbClient;
};
