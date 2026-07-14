function showNotice(text){const m=document.getElementById('noticeModal');const t=document.getElementById('noticeText'); if(t)t.textContent=text; if(m)m.style.display='flex';}
function closeNotice(){const m=document.getElementById('noticeModal'); if(m)m.style.display='none';}

const STOFBOEKEN = (window.DEOST_STOFBOEKEN || []).filter(b => b.actief !== false);
const STOFBOEK_MAP = new Map(STOFBOEKEN.map(boek => [boek.id, boek]));
const ARTIKELEN = (window.DEOST_ARTIKELEN || []).filter(artikel => artikel.actief !== false);

function normaliseerKennisTag(value){
  return String(value || '').trim().toLowerCase();
}

function relevanteArtikelenVoor(stof, boek){
  const tags = new Set([
    ...((stof && stof.kennisTags) || []),
    ...((boek && boek.kennisTags) || [])
  ].map(normaliseerKennisTag).filter(Boolean));

  if (!tags.size) return [];

  return ARTIKELEN.filter(artikel =>
    (artikel.tags || []).some(tag => tags.has(normaliseerKennisTag(tag)))
  ).slice(0, 2);
}

function verrijkStofMetBoek(stof){
  const boek = stof && stof.boekId ? STOFBOEK_MAP.get(stof.boekId) : null;

  const defaults = boek ? {
    leverancier: boek.leverancier,
    bunch: boek.naam,
    weving: boek.weving || boek.type,
    seizoen: boek.seizoen,
    uitstraling: boek.uitstraling,
    korteUitleg: boek.korteUitleg,
    advies: boek.advies,
    minderGeschiktVoor: boek.minderGeschiktVoor
  } : {};

  return {
    ...defaults,
    ...stof,
    stofboek: boek || null,
    kennisArtikelen: relevanteArtikelenVoor(stof, boek)
  };
}

const STOFFEN = (window.DEOST_STOFFEN || []).map(verrijkStofMetBoek).filter(s => s.actief !== false);
const state = {
  search: '',
  scope: 'aanbevolen',
  filters: { gebruik:'alle', materiaal:'alle', weving:'alle', patroon:'alle', kleur:'alle', leverancier:'alle', prijsGroep:'alle' },
  combo: []
};
const labels = { gebruik:'Alle toepassingen', materiaal:'Alle materialen', weving:'Alle wevingen', patroon:'Alle patronen', kleur:'Alle kleuren', leverancier:'Alle leveranciers', prijsGroep:'Alle prijsgroepen' };
const fields = { gebruik:'filterGebruik', materiaal:'filterMateriaal', weving:'filterWeving', patroon:'filterPatroon', kleur:'filterKleur', leverancier:'filterLeverancier', prijsGroep:'filterPrijs' };

function escapeHtml(value){return String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function valueList(stof, key){const v=stof[key]; return Array.isArray(v)?v.filter(Boolean):(v?[v]:[]);}
function uniqFor(key){
  const vals = new Set();
  STOFFEN.forEach(stof => valueList(stof,key).forEach(v => vals.add(v)));
  return [...vals].sort((a,b)=>String(a).localeCompare(String(b),'nl'));
}
function prettify(v){return String(v||'').replace(/_/g,' ').replace(/\b\w/g, c=>c.toUpperCase());}
function initFilters(){
  Object.entries(fields).forEach(([key,id])=>{
    const select = document.getElementById(id);
    select.innerHTML = `<option value="alle">${labels[key]}</option>` + uniqFor(key).map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(prettify(v))}</option>`).join('');
  });
}
function setFilter(key,value){ state.filters[key]=value; render(); }
function clearFilters(){
  state.search=''; document.getElementById('searchInput').value='';
  Object.keys(state.filters).forEach(k=>state.filters[k]='alle');
  Object.entries(fields).forEach(([k,id])=>document.getElementById(id).value='alle');
  render();
}
function matchFilter(stof,key,value){
  if(!value || value==='alle') return true;
  const v = stof[key];
  if(Array.isArray(v)) return v.includes(value);
  return String(v||'') === String(value);
}
function recommended(stof){
  if(state.scope==='alle') return true;
  const geschikt = valueList(stof,'geschiktVoor');
  const gebruik = valueList(stof,'gebruik');
  return geschikt.includes('pak_kostuum') || geschikt.includes('tenue_de_ville') || geschikt.includes('black_tie') || gebruik.includes('zakelijk') || gebruik.includes('bruiloft');
}
function filteredStoffen(){
  const q = state.search.trim().toLowerCase();
  return STOFFEN.filter(stof=>{
    if(!recommended(stof)) return false;
    for(const [key,val] of Object.entries(state.filters)){ if(!matchFilter(stof,key,val)) return false; }
    if(q){
      const hay = [stof.id, stof.naam, stof.leverancier, stof.bunch, stof.stofnummer, stof.samenstelling, stof.weving, stof.patroon, stof.kleur, stof.patroonkleur, stof.stofboek?.langeUitleg, ...(stof.klantLabels||[]), ...(stof.gebruik||[]), ...(stof.materiaal||[]), ...(stof.kennisTags||[]), ...((stof.kennisArtikelen||[]).map(a=>a.titel))].join(' ').toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
}
function comboIndex(id){ return state.combo.indexOf(id); }
function toggleCombo(id){
  const idx = comboIndex(id);
  if(idx >= 0) state.combo.splice(idx,1);
  else {
    if(state.combo.length >= 3){ showNotice('U kunt maximaal 3 stoffen tegelijk combineren.'); return; }
    state.combo.push(id);
  }
  render();
}
function getStof(id){return STOFFEN.find(s=>s.id===id);}
function stofImg(stof){return stof ? (stof.swatch || stof.closeup || '') : '';}
function fabricCard(stof){
  const idx = comboIndex(stof.id);
  const tags = [...valueList(stof,'materiaal'), stof.weving, stof.patroon, stof.kleur, stof.prijsGroep ? 'Prijsgroep '+stof.prijsGroep : ''].filter(Boolean).slice(0,5);
  return `<article class="fabric-card ${idx>=0?'selected-combo':''}" onclick="toggleCombo('${escapeHtml(stof.id)}')">
    <div class="swatch">
      ${stofImg(stof) ? `<img src="${escapeHtml(stofImg(stof))}" alt="${escapeHtml(stof.naam)}" onerror="this.outerHTML='<div class=&quot;swatch-fallback&quot;></div>'">` : '<div class="swatch-fallback"></div>'}
      <div class="badge">${escapeHtml(stof.stofnummer || stof.id)}</div>
      ${idx>=0 ? `<div class="combo-index">${idx+1}</div>` : ''}
    </div>
    <div class="card-body">
      <div class="meta">${escapeHtml(stof.leverancier || '')}${stof.bunch ? ' · '+escapeHtml(stof.bunch) : ''}</div>
      <div class="name">${escapeHtml(stof.naam || stof.id)}</div>
      <div class="details">${escapeHtml(stof.samenstelling || '')}${stof.gewicht ? ' · '+escapeHtml(stof.gewicht) : ''}<br>${escapeHtml(prettify(stof.weving||''))} · ${escapeHtml(prettify(stof.patroon||''))}</div>
      <div class="tags">${tags.map(t=>`<span class="tag">${escapeHtml(prettify(t))}</span>`).join('')}</div>
      <div class="card-actions">
        <button class="icon-btn dark" onclick="event.stopPropagation();toggleCombo('${escapeHtml(stof.id)}')"><i class="ti ${idx>=0?'ti-check':'ti-plus'}"></i>${idx>=0?'Gekozen':'Combineren'}</button>
        <button class="icon-btn" onclick="event.stopPropagation();openInfo('${escapeHtml(stof.id)}')"><i class="ti ti-info-circle"></i>Info</button>
        <a class="icon-btn" onclick="event.stopPropagation()" href="deoost_stijlconfigurator.html?stof=${encodeURIComponent(stof.id)}"><i class="ti ti-shirt"></i>Gebruik</a>
      </div>
    </div>
  </article>`;
}
function renderGrid(){
  const results = filteredStoffen();
  document.getElementById('resultCount').textContent = `${results.length} stof${results.length===1?'':'fen'} gevonden`;
  document.getElementById('fabricGrid').innerHTML = results.length ? results.map(fabricCard).join('') : '<div class="empty-state" style="grid-column:1/-1">Geen stoffen gevonden. Wis filters of kies “Alle stoffen”.</div>';
}
function renderComboSlots(){
  const slots=[];
  for(let i=0;i<3;i++){
    const stof = getStof(state.combo[i]);
    if(stof){
      slots.push(`<div class="slot"><img src="${escapeHtml(stofImg(stof))}" alt=""><div class="slot-text"><b>${i===0?'Jas / 1':i===1?'Broek / 2':'Gilet / 3'}</b>${escapeHtml(stof.naam)}</div><button class="slot-remove" onclick="removeCombo(${i})">×</button></div>`);
    } else {
      slots.push(`<div class="slot"><div class="slot-empty">${i+1}. Kies een stof</div></div>`);
    }
  }
  document.getElementById('comboSlots').innerHTML=slots.join('');
}
function removeCombo(i){state.combo.splice(i,1);render();}
function clearCombo(){state.combo=[];render();}
function renderSegments(){
  document.getElementById('segAanbevolen').className='seg'+(state.scope==='aanbevolen'?' active':'');
  document.getElementById('segAlle').className='seg'+(state.scope==='alle'?' active':'');
}
function comboUrl(){
  const params = new URLSearchParams();
  if(state.combo[0]) params.set('jasStof',state.combo[0]);
  if(state.combo[1]) params.set('broekStof',state.combo[1]);
  if(state.combo[2]) params.set('giletStof',state.combo[2]);
  return 'deoost_stijlconfigurator.html' + (params.toString() ? '?' + params.toString() : '');
}
function renderComboModal(){
  const stoffen = state.combo.map(getStof).filter(Boolean);
  document.getElementById('configuratorComboLink').href = comboUrl();
  document.getElementById('comboPreview').innerHTML = stoffen.length ? stoffen.map((stof,i)=>`<div class="preview-swatch"><img src="${escapeHtml(stofImg(stof))}" alt="${escapeHtml(stof.naam)}"><div class="preview-label"><b>${escapeHtml(i===0?'Jasstof / 1':i===1?'Broekstof / 2':'Giletstof / 3')}</b>${escapeHtml(stof.naam)}</div></div>`).join('') : '<div class="empty-state">Selecteer eerst één tot drie stoffen.</div>';
  document.getElementById('comboList').innerHTML = stoffen.map((stof,i)=>`<div class="combo-item"><b>${escapeHtml(stof.naam)}</b>${escapeHtml(stof.leverancier||'')} · ${escapeHtml(stof.stofnummer||'')}<br>${escapeHtml(stof.samenstelling||'')}<br>${escapeHtml(prettify(stof.kleur||''))} · ${escapeHtml(prettify(stof.weving||''))} · ${escapeHtml(prettify(stof.patroon||''))}</div>`).join('');
}
function openComboModal(){renderComboModal();document.getElementById('comboModal').style.display='flex';}
function closeComboModal(){document.getElementById('comboModal').style.display='none';}
async function copyComboLink(){
  const url = new URL(comboUrl(), window.location.href).href;
  try{ await navigator.clipboard.writeText(url); showNotice('Combinatielink gekopieerd.'); }
  catch(e){ prompt('Kopieer deze link:', url); }
}
function openInfo(id){
  const stof = getStof(id); if(!stof) return;
  const heroPath = stof.hero || stof.swatch || stof.closeup || '';
  const swatchPath = stof.swatch || stof.closeup || '';
  const closeupPath = stof.closeup || stof.swatch || '';
  const videoPath = stof.video || '';
  const externalVideo = stof.videoUrl || '';
  document.getElementById('infoTitle').textContent = stof.naam;
  document.getElementById('infoBody').innerHTML = `
    ${heroPath ? `<div class="info-hero">
      <div class="info-hero-label">Stofbeeld</div>
      <img class="info-hero-img" src="${escapeHtml(heroPath)}" alt="${escapeHtml(stof.naam)} stofbeeld" onerror="this.outerHTML='<div class=&quot;empty-state&quot;>Stofbeeld niet gevonden</div>'">
    </div>` : ''}
    <div class="info-media-grid ${videoPath ? '' : 'single'}">
      <div class="info-media-block">
        <div class="info-media-label">Close-up</div>
        ${closeupPath ? `<img class="info-modal-img" src="${escapeHtml(closeupPath)}" alt="${escapeHtml(stof.naam)} close-up" onerror="this.outerHTML='<div class=&quot;empty-state&quot;>Close-up niet gevonden</div>'">` : `<div class="empty-state">Geen close-up gekoppeld</div>`}
        ${closeupPath ? `<div class="info-media-actions"><a class="icon-btn" target="_blank" rel="noopener" href="${escapeHtml(closeupPath)}"><i class="ti ti-zoom-in"></i> Open close-up</a></div>` : ''}
      </div>
      ${videoPath ? `<div class="info-media-block">
        <div class="info-media-label">Lichtvideo</div>
        <video class="info-modal-video" controls muted loop playsinline preload="metadata">
          <source src="${escapeHtml(videoPath)}" type="video/mp4">
        </video>
        <div class="info-media-actions"><a class="icon-btn" target="_blank" rel="noopener" href="${escapeHtml(videoPath)}"><i class="ti ti-player-play"></i> Open video</a></div>
      </div>` : ''}
    </div>
    <div>
      <div class="meta">${escapeHtml(stof.leverancier||'')} · ${escapeHtml(stof.bunch||'')} · ${escapeHtml(stof.stofnummer||'')}</div>
      <div class="details" style="font-size:13px;margin-top:.5rem">Materiaal: ${escapeHtml(valueList(stof,'materiaal').map(prettify).join(', '))}<br>Weving: ${escapeHtml(prettify(stof.weving||''))}<br>Patroon: ${escapeHtml(prettify(stof.patroon||''))}<br>Kleur: ${escapeHtml(prettify(stof.kleur||''))}${stof.patroonkleur?'<br>Patroonkleur: '+escapeHtml(prettify(stof.patroonkleur)):''}</div>
      <p style="font-size:13px;color:var(--muted);line-height:1.6;margin-top:1rem">${escapeHtml(stof.korteUitleg || '')}</p>
      <p style="font-size:13px;color:var(--muted);line-height:1.6;margin-top:.6rem">${escapeHtml(stof.advies || '')}</p>

      ${stof.stofboek ? `
        <div style="margin-top:1.2rem;padding-top:1rem;border-top:1px solid var(--line)">
          <div class="meta">Over het stofboek</div>
          <div class="name" style="margin-top:.35rem">${escapeHtml(stof.stofboek.leverancier)} · ${escapeHtml(stof.stofboek.naam)}</div>
          <p style="font-size:13px;color:var(--muted);line-height:1.65;margin-top:.65rem">${escapeHtml(stof.stofboek.langeUitleg || '')}</p>
          <div class="details" style="font-size:13px;margin-top:.65rem">
            ${stof.stofboek.herkomst ? `Herkomst: ${escapeHtml(stof.stofboek.herkomst)}<br>` : ''}
            ${stof.stofboek.fabriek ? `Fabriek: ${escapeHtml(stof.stofboek.fabriek)}<br>` : ''}
            ${stof.stofboek.afwerking ? `Afwerking: ${escapeHtml(stof.stofboek.afwerking)}<br>` : ''}
            ${stof.stofboek.nummerreeks ? `Nummerreeks: ${escapeHtml(stof.stofboek.nummerreeks)}` : ''}
          </div>
        </div>` : ''}

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:1rem">
        <button class="btn" onclick="toggleCombo('${escapeHtml(stof.id)}');closeInfoModal()"><i class="ti ti-plus"></i> Toevoegen aan combinatie</button>
        <a class="btn secondary" href="deoost_stijlconfigurator.html?stof=${encodeURIComponent(stof.id)}"><i class="ti ti-shirt"></i> Gebruik in configurator</a>
        ${stof.blogUrl ? `<a class="btn secondary" target="_blank" rel="noopener" href="${escapeHtml(stof.blogUrl)}"><i class="ti ti-article"></i> ${escapeHtml(stof.blogTitel || 'Bekijk deze stof in de praktijk')}</a>` : ''}
        ${stof.stofboek && stof.stofboek.blogUrl ? `<a class="btn secondary" target="_blank" rel="noopener" href="${escapeHtml(stof.stofboek.blogUrl)}"><i class="ti ti-books"></i> ${escapeHtml(stof.stofboek.blogTitel || 'Lees meer over dit stofboek')}</a>` : ''}
        ${(stof.kennisArtikelen || []).map(artikel => `<a class="btn secondary" target="_blank" rel="noopener" href="${escapeHtml(artikel.url)}"><i class="ti ti-bulb"></i> ${escapeHtml(artikel.knopTekst || artikel.titel || 'Meer achtergrond')}</a>`).join('')}
        ${externalVideo ? `<a class="btn secondary" target="_blank" rel="noopener" href="${escapeHtml(externalVideo)}"><i class="ti ti-brand-youtube"></i> Externe video</a>` : ''}
      </div>
    </div>`;
  const infoModal = document.getElementById('infoModal');
  infoModal.style.display='flex';
  infoModal.scrollTop = 0;
}

function closeInfoModal(){document.getElementById('infoModal').style.display='none';}
function applyUrlParams(){
  const p = new URLSearchParams(window.location.search);
  ['gebruik','materiaal','weving','patroon','kleur','leverancier','prijsGroep'].forEach(k=>{ if(p.get(k)) state.filters[k]=p.get(k); });
  if(p.get('q')){state.search=p.get('q');document.getElementById('searchInput').value=state.search;}
  if(p.get('scope')) state.scope=p.get('scope') === 'alle' ? 'alle' : 'aanbevolen';
  ['jasStof','broekStof','giletStof','stof'].forEach(k=>{ const id=p.get(k); if(id && getStof(id) && !state.combo.includes(id) && state.combo.length<3) state.combo.push(id); });
}
function render(){renderSegments();renderGrid();renderComboSlots();renderComboModal();}
document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeComboModal(); closeInfoModal(); }});
initFilters(); applyUrlParams(); Object.entries(fields).forEach(([k,id])=>document.getElementById(id).value=state.filters[k]||'alle'); render();
