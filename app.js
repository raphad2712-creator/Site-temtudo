(() => {
  'use strict';
  const products = window.PRODUCTS || [];
  const $ = (s) => document.querySelector(s);
  const grid = $('#products');
  const search = $('#search');
  const sort = $('#sort');
  const detail = $('#detail');
  const imageViewer = $('#image-viewer');
  const listDialog = $('#list-dialog');
  const PER_PAGE = 24;
  const formatter = new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'});
  let category = 'all';
  let page = 1;
  let selected = new Set();
  try { selected = new Set(JSON.parse(localStorage.getItem('temdetudo-list') || '[]')); } catch {}

  function group(name) {
    const s = name.toLowerCase();
    if (/pet|c[aã]es|gato|cachorro|ra[cç][aã]o|coleira|aqu[aá]rio|passar|animal|veterin|shampoo|pulga/.test(s)) return 'pet';
    if (/jardim|adubo|planta|flor|terra vegetal|vaso|semente|mangueira|piscina|grama/.test(s)) return 'jardim';
    if (/alicate|chave|parafuso|broca|serra|furadeira|martelo|ferrament|abra[cç]adeira|pregos|lixa|trena/.test(s)) return 'ferramentas';
    if (/casa|cozinha|panela|copo|garrafa|prato|caneca|pote|balde|escova|lixeira|tapete|l[aâ]mpada|tomada|vassoura|pano/.test(s)) return 'casa';
    return 'outros';
  }
  const labels = {pet:'Pet',casa:'Casa & utilidades',jardim:'Jardim',ferramentas:'Ferramentas',outros:'Outros'};
  function money(raw) { return formatter.format(Number(raw.replace(/\./g,'').replace(',','.'))); }
  function price(raw) { return Number(raw.replace(/\./g,'').replace(',','.')); }
  function escapeHTML(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function thumbnail(item) { return item[3] ? `<span class="atlas-image" role="img" aria-label="${escapeHTML(item[1])}" style="background-image:url('${item[3]}');background-position:${item[4]/15*100}% ${item[5]/7*100}%"></span>` : '<span class="placeholder" aria-hidden="true">T</span>'; }
  function save() { try { localStorage.setItem('temdetudo-list', JSON.stringify([...selected])); } catch {} $('#list-count').textContent=selected.size; }
  function toggle(code) { selected.has(code) ? selected.delete(code) : selected.add(code); save(); render(); if(listDialog.open) renderList(); }
  function findItem(code) { return products.find(p => p[0]===code); }
  function card(item) {
    const [code,name,amount] = item;
    const saved = selected.has(code);
    return `<article class="card"><div class="thumb">${thumbnail(item)}<span class="code">Cód. ${escapeHTML(code)}</span></div><div class="card-body"><p class="card-category">${labels[group(name)]}</p><h3>${escapeHTML(name)}</h3><p class="price">${money(amount)}</p><div class="card-actions"><button type="button" class="more" data-detail="${code}">Saiba mais</button><button type="button" class="add ${saved?'saved':''}" data-add="${code}" aria-label="${saved?'Remover da lista':'Adicionar à lista'}: ${escapeHTML(name)}">${saved?'Na minha lista':'Adicionar à lista'}</button></div></div></article>`;
  }
  function currentItems() {
    const query=search.value.trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    let result=products.filter(p => (category==='all'||group(p[1])===category) && (!query||(`${p[0]} ${p[1]}`).toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(query)));
    if(sort.value==='price-asc') result.sort((a,b)=>price(a[2])-price(b[2]));
    else if(sort.value==='price-desc') result.sort((a,b)=>price(b[2])-price(a[2]));
    else if(!query&&category==='all') result.sort((a,b)=>Number(Boolean(b[3]))-Number(Boolean(a[3])) || a[1].localeCompare(b[1],'pt-BR'));
    return result;
  }
  function render() {
    const result=currentItems(), pages=Math.max(1,Math.ceil(result.length/PER_PAGE));
    page=Math.min(page,pages);
    grid.innerHTML=result.slice((page-1)*PER_PAGE,page*PER_PAGE).map(card).join('');
    $('#empty').hidden=result.length>0;
    $('#result-count').textContent=`${result.length.toLocaleString('pt-BR')} produtos`;
    $('#page-label').textContent=`Página ${page} de ${pages}`;
    $('#prev').disabled=page===1;
    $('#next').disabled=page===pages;
  }
  function showDetail(code) {
    const item=findItem(code); if(!item)return;
    $('#detail-content').innerHTML=`<div class="detail-photo">${thumbnail(item)}<button type="button" class="image-expand" data-full="${code}" aria-label="Ampliar imagem"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></svg></button></div><p class="card-category">${labels[group(item[1])]}</p><h2 class="detail-title">${escapeHTML(item[1])}</h2><p class="detail-code">Código ${escapeHTML(code)}</p><p class="detail-price">${money(item[2])}</p><p class="detail-description">${escapeHTML(window.productDescription(item))}</p><button type="button" class="detail-add" data-add="${code}">${selected.has(code)?'Remover da minha lista':'Adicionar à minha lista'}</button>`;
    detail.showModal();
  }
  function showFullImage(code) {
    const item=findItem(code); if(!item)return;
    $('#full-image').innerHTML=thumbnail(item);
    imageViewer.showModal();
  }
  function renderList() {
    const entries=[...selected].map(findItem).filter(Boolean);
    $('#list-items').innerHTML=entries.length ? entries.map(item=>`<div class="list-row">${thumbnail(item)}<div><strong>${escapeHTML(item[1])}</strong><small>Cód. ${item[0]} · ${money(item[2])}</small></div><button type="button" data-remove="${item[0]}">Remover</button></div>`).join('') : '<p class="empty">Sua lista está vazia. Explore o catálogo e adicione os produtos que gostar.</p>';
    $('#share-list').disabled=!entries.length;
  }
  grid.addEventListener('click',e=>{const add=e.target.closest('[data-add]'),more=e.target.closest('[data-detail]');if(add)toggle(add.dataset.add);else if(more)showDetail(more.dataset.detail);});
  detail.addEventListener('click',e=>{const full=e.target.closest('[data-full]'),add=e.target.closest('[data-add]');if(full)showFullImage(full.dataset.full);else if(add){toggle(add.dataset.add);showDetail(add.dataset.add);}});
  $('#list-items').addEventListener('click',e=>{const remove=e.target.closest('[data-remove]');if(remove)toggle(remove.dataset.remove);});
  document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>$('#'+btn.dataset.close).close()));
  for(const dialog of [detail,listDialog,imageViewer])dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  $('#open-list').addEventListener('click',()=>{renderList();listDialog.showModal();});
  $('#share-list').addEventListener('click',()=>{const entries=[...selected].map(findItem).filter(Boolean);if(!entries.length)return;const lines=entries.map(item=>`• Cód. ${item[0]} — ${item[1]} — ${money(item[2])}`);const message=`Olá! Gostaria de consultar os seguintes produtos da Temdetudo Atacado:\n\n${lines.join('\n')}\n\nPode confirmar preços e disponibilidade?`;window.open('https://api.whatsapp.com/send?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');});
  search.addEventListener('input',()=>{page=1;render();});sort.addEventListener('change',()=>{page=1;render();});
  document.querySelectorAll('.chip').forEach(chip=>chip.addEventListener('click',()=>{document.querySelector('.chip.active')?.classList.remove('active');chip.classList.add('active');category=chip.dataset.category;page=1;render();}));
  $('#prev').addEventListener('click',()=>{if(page>1){page--;render();$('#catalogo').scrollIntoView();}});
  $('#next').addEventListener('click',()=>{page++;render();$('#catalogo').scrollIntoView();});
  $('#total-hero').textContent=products.length.toLocaleString('pt-BR');
  save();render();
})();
