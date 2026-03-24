async function requireAuth(){
  const client = sb();
  const { data, error } = await client.auth.getSession();
  if(error) throw error;
  const session = data.session;
  if(!session){ location.href = '/login.html'; return null; }
  const emailEl = document.getElementById('userEmail');
  if(emailEl) emailEl.textContent = session.user.email || '';
  return session;
}

document.addEventListener('DOMContentLoaded', async ()=>{
  const page = document.body.dataset.page || '';
  if(['dashboard','products','scan','stock','outscans'].includes(page)){
    try{ await requireAuth(); authNav(); }catch(e){ console.error(e); location.href='/login.html'; }
  }
  if(page === 'login') initLogin();
  if(page === 'reset-password') initResetPassword();
  if(page === 'update-password') initUpdatePassword();
});

function initLogin(){
  const form = document.getElementById('loginForm');
  form?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = byId('email').value.trim();
    const password = byId('password').value;
    try{
      const { error } = await sb().auth.signInWithPassword({ email, password });
      if(error) throw error;
      location.href = '/index.html';
    }catch(err){ toast(err.message || String(err), 'err'); }
  });
}

function initResetPassword(){
  const form = document.getElementById('resetForm');
  form?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = byId('email').value.trim();
    const redirectTo = `${location.origin}/update-password.html`;
    try{
      const { error } = await sb().auth.resetPasswordForEmail(email, { redirectTo });
      if(error) throw error;
      toast('Reset e-mail verzonden. Controleer je inbox.', 'ok');
    }catch(err){ toast(err.message || String(err), 'err'); }
  });
}

function initUpdatePassword(){
  const form = document.getElementById('updatePasswordForm');
  form?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const p1 = byId('password').value;
    const p2 = byId('password2').value;
    if(p1.length < 6) return toast('Wachtwoord moet minimaal 6 tekens zijn.', 'err');
    if(p1 !== p2) return toast('Wachtwoorden zijn niet gelijk.', 'err');
    try{
      const { error } = await sb().auth.updateUser({ password: p1 });
      if(error) throw error;
      toast('Wachtwoord bijgewerkt. Je kunt nu inloggen.', 'ok');
      setTimeout(()=> location.href='/login.html', 1200);
    }catch(err){ toast(err.message || String(err), 'err'); }
  });
}
