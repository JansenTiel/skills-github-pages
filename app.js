function byId(id){ return document.getElementById(id); }
function escapeHtml(s){ return String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
function cleanSku(v){ return String(v || '').trim().toUpperCase().replace(/\s+/g,''); }
function nlTime(v){ if(!v) return ''; try{ return new Date(v).toLocaleString('nl-NL'); }catch{ return v; } }
function toast(msg, type='ok'){
  const el = byId('toast');
  if(!el) return alert(msg);
  el.textContent = msg;
  el.className = `notice ${type}`;
  el.style.display = 'block';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(()=>{ el.style.display='none'; }, 5000);
}
function setActiveNav(){
  const path = location.pathname.replace(/\/index\.html$/,'/').replace(/\.html$/,'');
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href').replace(/\.html$/,'');
    if(href === path || (href === '/' && (path === '/' || path === ''))) a.classList.add('active');
  });
}
async function countOrderUses(client, orderNo){
  const { count, error } = await client.from('movements').select('*', { count:'exact', head:true }).eq('type','OUT').eq('order_no', orderNo);
  if(error) throw error;
  return count || 0;
}
function authNav(){
  const btn = byId('btnLogout');
  if(btn){ btn.addEventListener('click', async ()=>{ await sb().auth.signOut(); location.href='/login.html'; }); }
}
