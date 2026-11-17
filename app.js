let D=null;
const DOSEPS_BUILD='2026-11-17.1';
async function load(){let d=null;
// Catálogo do ZIP é sempre a fonte de verdade das doses: não permitir que
// Supabase ou localStorage antigo sobreponham correções farmacológicas.
try{const r=await fetch('data/drugs.json',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);d=await r.json();if(!Array.isArray(d.drugs)||d.drugs.length<100)throw Error('Catálogo incompleto');try{localStorage.setItem('doseps-bundle-20261115v1',JSON.stringify(d))}catch(e){}}catch(e){
try{d=JSON.parse(localStorage.getItem('doseps-bundle-20261115v1')||'null')}catch(err){}
if(!d||!Array.isArray(d.drugs)){app.innerHTML='<div class="warn">Não foi possível carregar o catálogo. Conecte-se à internet na primeira abertura e atualize a página.</div>';return;}}
try{const published=JSON.parse(localStorage.getItem('doseps-published-20261115')||'null');if(published?.bundleRelease==='2026-11-15.1'){validateCatalog(published);d=published}}catch{}
if(typeof ensureAntidotes==='function')ensureAntidotes(d);if(typeof ensureIotFentanyl==='function')ensureIotFentanyl(d);
d.procs=(d.procs||[]).filter(p=>p.t!='RCP'&&p.t!='IOT');d.drugs.forEach(x=>{if(x.g==='Alergia')x.g='Antialérgico'});
D=d;syncRuntimeContent(D);render();initAuth();
refreshPublishedCatalog();
if('serviceWorker' in navigator&&!(window.Capacitor&&typeof Capacitor.isNativePlatform==='function'&&Capacitor.isNativePlatform())){navigator.serviceWorker.register('sw.js').then(reg=>reg.update()).catch(()=>{});}
}
let S={v:"home",wa:70,wp:10,wn:3.5,wv:70,wt:70,tt:null,vf:"",g:"p",rit:"s",pt:null,q:"",adm:false,pv:null};
const $=s=>document.querySelector(s),app=$("#app");
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const f=x=>{x=+x;return String(x>=100?Math.round(x):x>=10?Math.round(x*10)/10:Math.round(x*100)/100).replace(".",",")};
const T={pcr:"MODO PCR",workspace:"Meu espaço",wounds:"Feridas e curativos",news:"Novidades",primarycare:"Atenção Primária",apac:"Preencher APAC",emergencies:"Emergências",documents:"Documentos",obstetrics:"Obstetrícia",protocols:"Protocolos",home:"Início",a:"Doses adulto",p:"Doses pediátricas",proc:"Procedimentos",vaso:"Drogas vasoativas",admin:"Painel administrativo",contribute:"Contribuir",clinical:"Calculadoras clínicas",vent:"Ventilação mecânica",trombo:"Trombólise",conta:"Minha conta",about:"Sobre"};
function openMain(v){if(v==="vaso"){infusionState.group="";infusionState.q=""}if(v==="protocols"){protocolState.id="";protocolState.q=""}if(v==="obstetrics"){obstetricState.tab="menu";obstetricState.id="";obstetricState.q=""}go(v)}
function go(v){if(v==="rx")v="home";S.v=v;S.pv=null;S.pt=null;$("#drawer").classList.remove("open");$("#shade").classList.remove("open");render();scrollTo(0,0)}
function calc(d,w){if(d.manualDose)return [];const r=[0,1].map(i=>{let m=d.k?d.k[i]*w:d.f[i];let cap=false;if(d.mx&&m>d.mx){m=d.mx;cap=true}return{m,ml:m/d.c,cap}});return r}
function rng(a,b,u){u=esc(u);return a==b?f(a)+" "+u:f(a)+"–"+f(b)+" "+u}
function pediatricOralDisplay(d,w,r){
 const bg='<div class="res">',end='</div>';
 if(d.volumeBands){
   const band=d.volumeBands.find(b=>Math.round(w)<=b[0]);
   if(!band||w<5)return '<div class="warn">Fora da faixa pediátrica de 5–53 kg da bula desta apresentação. Avaliar idade, peso e bula antes da dose.</div>';
   const a=band[1],b=band[2];
   return bg+'<span class="mute">Solução oral 50 mg/mL · dosagem pela faixa de peso da bula</span><br>Volume VO: <b>'+rng(a,b,'mL')+'</b><br><span class="mute">Equivalente: '+rng(a*d.c,b*d.c,'mg')+' · até 4 tomadas/24 h</span>'+end;
 }
 if(d.gt&&d.doseMode==='drops'){
   if(d.dropBands){
     const band=d.dropBands.find(b=>Math.round(w)<=b[0]);
     if(!band||w<5)return '<div class="warn">Fora da tabela pediátrica de 5–53 kg do fabricante. Avaliar bula e idade; não calcular gotas automaticamente.</div>';
     const a=band[1],b=band[2];
     return bg+'<span class="mute">Gotas VO · faixa por peso da bula</span><br>Dose: <b>'+a+'–'+b+' gotas</b><br><span class="mute">Equivalente: '+rng(a*d.c/d.gt,b*d.c/d.gt,'mg')+' · até 4 tomadas/24 h</span>'+end;
   }
   if(d.dropsPerKg){
     const gotas=Math.max(1,Math.min(d.maxDrops||Infinity,Math.round(w*d.dropsPerKg)));
     const mg=gotas*d.c/d.gt;
     const alert=w<11?'<div class="warn" style="margin-top:8px">Atenção: abaixo de 11 kg ou 2 anos, a bula exige avaliação médica. Idade não informada nesta calculadora.</div>':'';
     return bg+'<span class="mute">1 gota/kg por dose · VO</span><br>Dose: <b>'+gotas+' gotas</b> <strong>VO de 6/6 h, se necessário</strong><br><span class="mute">Equivalente: '+f(mg)+' mg ('+f(gotas/d.gt)+' mL) · máx. '+d.maxDrops+' gotas/dose · até 5 tomadas/24 h</span>'+end+alert;
   }
   const a=Math.max(1,Math.min(d.maxDrops||Infinity,Math.round(r[0].m/d.c*d.gt)));
   const b=Math.max(a,Math.min(d.maxDrops||Infinity,Math.round(r[1].m/d.c*d.gt)));
   return bg+'<span class="mute">'+rng(d.k[0],d.k[1],d.u+'/kg')+'</span><br>Dose VO: <b>'+(a===b?a:a+'–'+b)+' gotas</b><br><span class="mute">Equivalente: '+rng(a*d.c/d.gt,b*d.c/d.gt,'mg')+' ('+rng(a/d.gt,b/d.gt,'mL')+') · confirmar gotas/mL do fabricante</span>'+end;
 }
 return null;
}
function ipratropiumDisplay(d){
 // Posologia por faixa etária (bula): o seletor de peso não permite inferir idade.
 const start='<div class="res">',end='</div>';
 const foot='<div class="mute" style="margin-top:7px">Concentração: 0,25 mg/mL; <b>20 gotas = 1 mL</b>. Diluir com SF 0,9% até <b>volume final de 3–4 mL</b>, conforme bula. Conferir capacidade do nebulizador e protocolo local.</div>';
 if(d.pop==='a')return start+'<span class="mute">Dose habitual adulta, independente do peso</span><br>Dose para nebulizar: <b>40 gotas</b><br><span class="mute">Equivalente a 0,5 mg (2 mL de ipratrópio)</span>'+end+foot;
 return start+'<span class="mute">Dose pediátrica definida pela <b>idade</b>, não pelo peso</span><br><b>Menores de 6 anos:</b> 8–20 gotas<br><b>6 a 12 anos:</b> 20 gotas<br><b>Acima de 12 anos:</b> 40 gotas (dose adulta)<br><span class="mute">8–20 gotas = 0,1–0,25 mg; 40 gotas = 0,5 mg. Crianças menores de 12 anos: supervisão médica.</span>'+end+foot;
}
function card(d,w){if(d.manualDose)return manualDrugCard(d).replace(/<\/div>$/,drugTools(d)+'</div>');const r=calc(d,w);const cap=r.some(x=>x.cap);
const special=d.doseMode==='ipratropium-nebulization'?ipratropiumDisplay(d):(d.pop==='p'&&d.r==='VO'?pediatricOralDisplay(d,w,r):null);
const standard='<div class="res">'+(d.k?'<span class="mute">'+rng(d.k[0],d.k[1],d.u+'/kg')+(d.mx?' · máx. '+f(d.mx)+' '+d.u:'')+'</span><br>':'')+'Dose: <b>'+rng(r[0].m,r[1].m,d.u)+'</b>'+(d.c>0?'<br>Volume: <b>'+rng(r[0].ml,r[1].ml,'mL')+'</b>':'')+(cap?'<br><span class="mute">Limitado à dose máxima.</span>':'')+'</div>';
return '<div class="card"><h3>'+esc(d.n)+'</h3><div><span class="tag">'+esc(d.g)+'</span><span class="tag">'+esc(d.r)+'</span>'+(d.c>0?'<span class="tag">'+f(d.c)+' '+esc(d.u)+'/mL</span>':'<span class="tag">sem volume (sólido)</span>')+'</div>'+(d.indication?'<p><b>Indicação:</b> '+esc(d.indication)+'</p>':'')+(special||standard)+'<div class="mute" style="margin-top:6px"><b>Apresentação/preparo:</b> '+esc(d.dil||'Não precisa diluir.')+(d.o?'<br>'+esc(d.o):'')+'</div>'+(typeof drugReferences==='function'?drugReferences(d):'')+drugTools(d)+'</div>';
}
function listOld(pop){const k=pop+"w",w=S["w"+pop];const ped=pop=="p";
let h=`<div class="warn">Apoio à decisão. Confirme sempre dose, diluição e via com o protocolo do serviço e com a farmácia antes de administrar.</div>
<div class="wbar"><div class="row"><input class="big" id="w" type="number" inputmode="decimal" min="0.5" max="250" step="0.1" value="${S["w"+pop]}" aria-label="Peso em kg"><span style="flex:0 0 auto">kg</span><input id="q" placeholder="Buscar medicamento" value="${esc(S.q)}"></div>`;
if(ped)h+=`<div class="row" style="margin-top:6px;overflow-x:auto;flex-wrap:nowrap">${[3,5,8,10,15,20,30,40].map(x=>`<button class="chip" data-w="${x}">${x} kg</button>`).join("")}</div>`;
h+=`</div><div id="l"></div>`;app.innerHTML=h;
const draw=()=>{const w=parseFloat($("#w").value)||0;S["w"+pop]=w;const q=$("#q").value.toLowerCase();S.q=q;
$("#l").innerHTML=w>0?D.drugs.filter(d=>d.pop==pop&&searchNorm([d.n,d.g,d.aliases,d.indication].join(' ')).includes(searchNorm(q))).sort((a,b)=>a.n.localeCompare(b.n)).map(d=>card(d,w)).join("")||'<p class="mute">Nenhum medicamento encontrado.</p>':'<p class="mute">Informe o peso para calcular.</p>'};
$("#w").oninput=draw;$("#q").oninput=draw;document.querySelectorAll("[data-w]").forEach(b=>b.onclick=()=>{$("#w").value=b.dataset.w;draw()});draw()}
function procOld(){if(S.pv!=null){const p=D.procs[S.pv];app.innerHTML=`<button class="btn sec" id="bk">← Voltar</button><h2>${esc(p.t)} · ${esc(p.s)}</h2><div class="card"><ol>${p.st.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>`;$("#bk").onclick=()=>{S.pv=null;render()};return}
const cats=[...new Set(D.procs.map(p=>p.t))];
app.innerHTML=cats.map(c=>`<h2>${esc(c)}</h2>`+D.procs.map((p,i)=>p.t==c?`<div class="card" data-i="${i}" style="cursor:pointer"><h3>${esc(p.s)}</h3><span class="mute">${p.st.length} passos</span></div>`:"").join("")).join("");
document.querySelectorAll("[data-i]").forEach(e=>e.onclick=()=>{S.pv=+e.dataset.i;render()})}
let generalSearchState={q:'',type:''};
const searchNorm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
function generalSearchIndex(){const rows=[],add=(type,title,description,target,keywords='')=>rows.push({type,title,description,target,text:searchNorm(title+' '+description+' '+keywords)});
add('Emergências','MODO PCR','Reanimação guiada, cronômetros e ritmos',{kind:'pcr'},'rcp parada cardiorrespiratoria reanimacao neonatal pediatrica desfibrilador');
add('Protocolos','Feridas e curativos','Avaliação e seleção de coberturas',{kind:'wounds'},'pomada hidrogel alginato espuma necrose lesao pressao');
for(const d of window.APS_DOCUMENTS||[])add('Documentos',d.title,'PDF para baixar · Atenção Primária · '+d.description,{kind:'apsDocument',id:d.id},'documento formulario imprimir download baixar '+({'mrpa':'monitorizacao residencial pressao arterial mapa pressao hipertensao','mapa-glicemia-adulto':'controle glicemico diabetes glicemia capilar hgt','mapa-glicemia-gestante-1h':'controle glicemico gestacional gestantes diabetes hgt','mapa-glicemia-gestante-2h':'controle glicemico gestacional gestantes diabetes hgt','higiene-do-sono':'orientacoes insonia dormir'}[d.id]||''));
for(const d of typeof documentTemplates==='undefined'?[]:documentTemplates)add('Documentos',d.title,(d.area==='icu'?'UTI':'Emergência')+' · Modelo de texto · '+d.description,{kind:'documentTemplate',id:d.id,area:d.area},'documento modelo copiar');
for(const d of D?.drugs||[])add('Medicamentos',d.n,(d.iotGroup==='n'?'Neonatal':d.pop==='p'?'Pediatria':'Adulto')+' · '+d.g+' · '+d.r,d.iotGroup?{kind:'iotDrug',group:d.iotGroup}:{kind:'drug',pop:d.pop,name:d.n},[d.aliases,d.indication,d.doseText,d.o,d.dil].filter(Boolean).join(' '));
for(const [i,p] of (D?.procs||[]).entries())add('Procedimentos',p.s||p.t,p.t,{kind:'procedure',index:i},(p.st||[]).join(' '));
for(const [id,title,description,keywords] of [['IOT','Intubação orotraqueal','Procedimento · preparo e sequência de intubação','iot via aerea tubo sedacao'],['RCP','Ressuscitação cardiopulmonar','Procedimento · adulto, pediatria e neonatal','rcp pcr parada cardiorrespiratoria reanimacao'],['VM','Ventilação mecânica','Procedimento · parâmetros iniciais e ajustes','vm ventilador peep dpoc asma pneumonia covid sdra neonatal pediatrico'],['CVC','Acesso venoso central','Procedimento · jugular interna, subclávia e femoral','cvc acesso central seldinger marcos anatomicos jugular subclavia femoral cateter ultrassom'],['SED','Sedação contínua','Procedimento · adulto, pediátrico e neonatal; preparo e bomba','sedacao manutencao midazolam fentanil morfina dexmedetomidina cetamina propofol remifentanil clonidina sufentanil']])add('Procedimentos',title,description,{kind:'builtin',id},keywords);
for(const x of typeof protocolCatalog==='undefined'?[]:protocolCatalog)add('Protocolos',x.title,x.summary,{kind:'protocol',id:x.id},x.cat+' '+x.sections.map(s=>s.title+' '+s.html.replace(/<[^>]*>/g,' ')).join(' '));
for(const x of typeof emergencyCatalog==='undefined'?[]:emergencyCatalog)add('Emergências',x.title,x.description,{kind:'emergency',id:x.id},x.keywords);
if(typeof obstetricDating==='function')add('Obstetrícia','Idade gestacional e DPP','Calculadora por DUM / USG e comparação',{kind:'obdating'},'gestacao semanas ultima menstruacao ultrassom ultrassonografia data provavel parto');
for(const x of typeof clinicalCatalog==='undefined'?[]:clinicalCatalog)add('Calculadoras',x.name,x.cat,{kind:'calculator',id:x.id},(x.aliases||'')+' '+x.note);
for(const x of typeof VS==='undefined'?[]:VS)add('Infusões',x.n,x.cls+' · Drogas vasoativas / sedoanalgesia',{kind:'vaso',name:x.n,cls:x.cls},[x.q,...(x.prep||[])].join(' '));
if(typeof infusionEntries==='function')for(const x of infusionEntries(70))if(!VS.some(y=>y.n===x.name||y.n===x.name+' (infusão)'))add('Infusões',x.name,x.group,{kind:'vaso',name:x.name},'infusao bomba manutencao');
add('Trombólise','AVC isquêmico','Trombólise · doses, indicação e acompanhamento',{kind:'thrombo',id:'avc'},'alteplase tenecteplase acidente vascular cerebral');add('Trombólise','Infarto com supra de ST','Trombólise · doses e reperfusão',{kind:'thrombo',id:'iam'},'iam estreptoquinase alteplase tenecteplase');
return rows}
function generalSearchFind(index,query,type=''){const terms=searchNorm(query).split(' ').filter(Boolean);if(!terms.length)return [];return index.filter(x=>(!type||x.type===type)&&terms.every(t=>x.text.includes(t))).map(x=>({...x,score:terms.reduce((n,t)=>n+(searchNorm(x.title).startsWith(t)?5:searchNorm(x.title).includes(t)?3:0),0)})).sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title,'pt-BR')||a.description.localeCompare(b.description,'pt-BR'))}
function generalSearchOpen(t){if(typeof personalRemember==='function')personalRemember(t);if(t.kind==='pcr'){go('pcr');return;}if(t.kind==='wounds'){go('wounds');return;}if(t.kind==='apsDocument'){go('primarycare');window.APS.openDocument(t.id)}else if(t.kind==='documentTemplate'){documentsState.id=t.id;documentsState.area=t.area;go('documents')}else if(t.kind==='emergency'){emergencyState.id=t.id;go('emergencies')}else if(t.kind==='iotDrug'){go('proc');S.g=t.group;S.pt='IOT';render()}else if(t.kind==='drug'){S.q=t.name;S['g'+t.pop]='';go(t.pop)}else if(t.kind==='obdating'){obstetricState.tab='dating';go('obstetrics')}else if(t.kind==='protocol'){protocolState.id=t.id;protocolState.q='';protocolState.tool='';go('protocols')}else if(t.kind==='calculator'){clinicalState.id=t.id;clinicalState.q='';clinicalState.cat='';go('clinical');$('#cform')?.scrollIntoView({block:'start'})}else if(t.kind==='procedure'||t.kind==='builtin'){go('proc');if(t.kind==='procedure')S.pv=t.index;else S.pt=t.id;render()}else if(t.kind==='vaso'){infusionState.group='';infusionState.q=t.name.replace(/ \(infusão\)/,'');go('vaso')}else if(t.kind==='thrombo'){S.tt=t.id;go('trombo')}}
function generalSearchMarkup(){return `<section class="card general-search" aria-labelledby="general-search-title"><h2 id="general-search-title">Buscar no app</h2><label for="general-query">Medicamentos, documentos, procedimentos, protocolos e calculadoras</label><div class="general-search-row"><input type="search" id="general-query" placeholder="Ex.: MRPA, glicemia, dipirona, HEART…" value="${esc(generalSearchState.q)}" autocomplete="off"><button class="chip" id="general-clear" aria-label="Limpar busca geral">Limpar</button></div><label for="general-type">Categoria</label><select id="general-type"><option value="">Todas as categorias</option>${['Documentos','Emergências','Medicamentos','Procedimentos','Protocolos','Obstetrícia','Calculadoras','Infusões','Trombólise'].map(x=>`<option ${generalSearchState.type===x?'selected':''}>${esc(x)}</option>`).join('')}</select><p id="general-count" class="mute" role="status"></p><div id="general-results"></div></section>`}
function bindGeneralSearch(){const index=generalSearchIndex();let shown=30;const draw=()=>{const matches=generalSearchFind(index,generalSearchState.q,generalSearchState.type);$('#general-count').textContent=generalSearchState.q.trim()?`${matches.length} resultado${matches.length===1?'':'s'}`:'Digite para buscar em todas as áreas do app. A busca ignora acentos e diferenças entre maiúsculas e minúsculas.';const visible=matches.slice(0,shown),groups=[...new Set(visible.map(x=>x.type))];$('#general-results').innerHTML=groups.map(type=>`<h3>${esc(type)} <small>(${matches.filter(x=>x.type===type).length})</small></h3>${visible.map((x,i)=>x.type===type?`<button class="general-result" data-search-result="${i}"><b>${esc(x.title)}</b><small>${esc(x.description)}</small><span aria-hidden="true">›</span></button>`:'').join('')}`).join('')+(matches.length>shown?'<button class="chip" id="general-more">Mostrar mais resultados</button>':'')+(generalSearchState.q.trim()&&!matches.length?'<p>Nenhum resultado encontrado. Tente o princípio ativo, outro termo ou a opção “Todas as categorias”.</p>':'');document.querySelectorAll('[data-search-result]').forEach(b=>b.onclick=()=>generalSearchOpen(visible[Number(b.dataset.searchResult)].target));if($('#general-more'))$('#general-more').onclick=()=>{shown+=30;draw()}};$('#general-query').oninput=e=>{generalSearchState.q=e.target.value;shown=30;draw()};$('#general-type').onchange=e=>{generalSearchState.type=e.target.value;shown=30;draw()};$('#general-clear').onclick=()=>{generalSearchState.q='';generalSearchState.type='';$('#general-query').value='';$('#general-type').value='';shown=30;draw();$('#general-query').focus()};draw()}

function home(){
const index=generalSearchIndex();
const icons={workspace:'▣',wounds:'✚',primarycare:'⌂',emergencies:'⚡',obstetrics:'♀',protocols:'≣',clinical:'∑',a:'💊',p:'P',trombo:'◌',vaso:'♥',proc:'✚'};
const tiles=[["emergencies","Emergências","Fluxos e condutas","g1"],["a","Doses","Medicamentos e cálculos","g2"],["clinical","Calculadoras","Escores e parâmetros","g3"],["proc","Procedimentos","IOT, CVC e ventilação","g4"]];
const recent=PERSONAL?.ready&&PERSONAL.data.recent.length?PERSONAL.data.recent.slice(0,3).map(x=>({title:x.title,target:x.target})):['convulsão','hipercalemia'].map(q=>generalSearchFind(index,q)[0]).filter(Boolean).map(x=>({title:x.title,target:x.target}));
app.innerHTML=`<section class="home-panel">
<div class="home-welcome"><div><span class="home-eyebrow">DOSE PS · PRONTO-SOCORRO</span><h2>Acesso rápido ao que você precisa</h2></div><span class="home-offline">● Funciona offline</span></div>
<div class="home-search"><label for="home-query">Buscar dose, protocolo ou medicamento</label><div class="home-search-row"><span aria-hidden="true">⌕</span><input id="home-query" type="search" placeholder="Ex.: convulsão, noradrenalina…" autocomplete="off"><button id="home-search-clear" type="button" aria-label="Limpar busca" hidden>×</button></div><div id="home-results" class="home-results" hidden></div></div>
<button class="home-pcr" data-home-page="pcr"><span class="home-pcr-icon" aria-hidden="true">♥</span><span><b>MODO PCR</b><small>Reanimação guiada · adulto, pediátrica e neonatal</small></span><span class="home-arrow" aria-hidden="true">›</span></button>
<section class="home-shortcuts" aria-label="Atalhos principais">${tiles.map(([v,title,sub,cl])=>`<button class="home-tile ${cl}" data-home-page="${v}"><span class="home-tile-icon" aria-hidden="true">${icons[v]}</span><b>${title}</b><small>${sub}</small></button>`).join('')}</section>
<section class="home-recent"><div class="home-section-title"><h3>${PERSONAL?.ready&&PERSONAL.data.recent.length?'Acessados recentemente':'Acessos frequentes'}</h3><button class="home-see-all" data-home-page="workspace">Ver histórico ›</button></div>${recent.length?recent.map(x=>`<button class="home-recent-row" data-home-target="${esc(JSON.stringify(x.target))}"><span class="home-recent-icon" aria-hidden="true">⌕</span><b>${esc(x.title)}</b><span class="home-arrow">›</span></button>`).join(''):'<p class="mute">Os itens que você abrir aparecerão aqui.</p>'}</section>
<div class="home-safety">Doses de referência. Confira sempre o contexto clínico, a apresentação disponível e o protocolo do serviço.</div></section>${contributionWidget()}`;
const q=$('#home-query'),results=$('#home-results'),clear=$('#home-search-clear');
function draw(){const term=q.value.trim();clear.hidden=!term;if(!term){results.hidden=true;results.innerHTML='';return}const rows=generalSearchFind(index,term).slice(0,6);results.hidden=false;results.innerHTML=rows.length?rows.map((x,i)=>`<button class="home-result" data-home-result="${i}"><span><b>${esc(x.title)}</b><small>${esc(x.type)} · ${esc(x.description)}</small></span><span class="home-arrow">›</span></button>`).join(''):'<p class="home-no-result">Nenhum resultado. Tente outro termo.</p>';results.querySelectorAll('[data-home-result]').forEach(b=>b.onclick=()=>generalSearchOpen(rows[Number(b.dataset.homeResult)].target))}
q.oninput=draw;clear.onclick=()=>{q.value='';draw();q.focus()};
document.querySelectorAll('[data-home-page]').forEach(b=>b.onclick=()=>openMain(b.dataset.homePage));
document.querySelectorAll('[data-home-target]').forEach(b=>b.onclick=()=>generalSearchOpen(JSON.parse(b.dataset.homeTarget)));
bindContributionWidget()}
function about(){app.innerHTML=`<div class="card"><h3>Sobre o Doses PS</h3><p>O Doses PS é um <b>aplicativo gratuito</b>, criado com o intuito de ajudar profissionais de saúde no cálculo de doses e no manejo dos pacientes.</p><p>Desenvolvido pelo médico <b>Cláudio Coelho</b>.</p><h3>Responsabilidade profissional</h3><p>O aplicativo é um guia de apoio e não um definidor de conduta. A avaliação do paciente, a escolha do tratamento e a responsabilidade pela prescrição permanecem com o profissional.</p><p>Mantenha atenção ao que prescreve: confira indicação, dose, apresentação, concentração, diluição, via, contraindicações e condições individuais do paciente. Utilize seu julgamento clínico e os protocolos atualizados do serviço.</p><p class="mute">Para instalar no celular: abra o link no navegador e escolha “Adicionar à tela inicial”.</p></div>`}
const TM={"Atropina":"IV rápido (bolus)","Fentanil":"IV lento em 2–3 min","Etomidato":"IV em 30–60 s","Cetamina":"IV em 60 s","Rocurônio":"IV rápido em 10–15 s (efeito em 45–60 s)","Succinilcolina":"IV rápido em 10–15 s (efeito em 30–45 s)","Adrenalina (PCR)":"bolus IV/IO rápido, seguido de flush de SF","Amiodarona":"bolus rápido na PCR","Amiodarona (FV/TV sem pulso)":"bolus rápido na PCR"};
const dc=(n,pp,w)=>{const d=D.drugs.find(x=>x.n==n&&x.pop==pp);return d?card(d,w).replace("<b>Diluição:</b>",`<b>Administrar:</b> ${TM[n]||"IV"}<br><b>Diluição:</b>`):`<div class="card mute">${esc(n)} não está cadastrado.</div>`};
const box=(t,a,u)=>{const k=u?"ul":"ol";return `<div class="card"><h3>${t}</h3><${k}>${a.map(i=>`<li>${i}</li>`).join("")}</${k}></div>`};
const r5=x=>Math.round(x*2)/2;
const RG={n:[0.5,5,0.1],p:[3,60,0.5],a:[30,150,1],v:[10,200,1],t:[30,200,1]};
function wb(g){const r=RG[g];return `<div class="row"><input class="big" id="w" type="number" inputmode="decimal" step="0.1" min="0.5" max="250" value="${S["w"+g]}" aria-label="Peso em kg"><span style="flex:0 0 auto">kg</span></div><input type="range" id="ws" min="${r[0]}" max="${r[1]}" step="${r[2]}" value="${S["w"+g]}" aria-label="Deslizar para escolher o peso"><div class="mute" style="display:flex;justify-content:space-between"><span>${r[0]} kg</span><span>${r[1]} kg</span></div>`}
function bw(g,cb){const w=$("#w"),s=$("#ws");w.oninput=()=>{const v=parseFloat(w.value);if(v>0){S["w"+g]=v;s.value=v;cb()}};s.oninput=()=>{w.value=s.value;S["w"+g]=+s.value;cb()}}
function list(pop){const G=[...new Set(D.drugs.filter(d=>d.pop==pop&&d.iotGroup!=='n').map(d=>d.g))].sort((a,b)=>a.localeCompare(b)),gk="g"+pop;S[gk]=S[gk]||"";
app.innerHTML=`<div class="warn">Apoio à decisão. Confirme sempre dose, diluição e via com o protocolo do serviço e com a farmácia antes de administrar.</div><div class="wbar"><div id="dose-weight">${wb(pop)}</div><input id="q" placeholder="Buscar medicamento" value="${esc(S.q)}" style="margin-top:6px"><div class="row" id="gc" style="margin-top:6px;overflow-x:auto;flex-wrap:nowrap"></div></div><div id="l"></div>`;
const chips=()=>{$("#gc").innerHTML=[["","Todos"]].concat(G.map(x=>[x,x])).map(x=>`<button class="chip${S[gk]==x[0]?" sel":""}" data-g="${esc(x[0])}">${esc(x[1])}</button>`).join("");document.querySelectorAll("#gc [data-g]").forEach(b=>b.onclick=()=>{S[gk]=b.dataset.g;chips();draw()})};
const draw=()=>{const w=S["w"+pop],q=$("#q").value.toLowerCase();S.q=q;const L=D.drugs.filter(d=>d.pop==pop&&d.iotGroup!=='n'&&(!S[gk]||d.g==S[gk])&&searchNorm([d.n,d.g,d.aliases,d.indication].join(' ')).includes(searchNorm(q))).sort((a,b)=>a.g.localeCompare(b.g)||a.n.localeCompare(b.n));const weightBox=$("#dose-weight");if(weightBox)weightBox.hidden=L.length>0&&L.every(d=>d.manualDose);let h="",cur="";L.forEach(d=>{if(!S[gk]&&d.g!=cur){cur=d.g;h+=`<h2>${esc(cur)} <span class="mute">(${L.filter(x=>x.g==cur).length})</span></h2>`}h+=card(d,w)});$("#l").innerHTML=h||'<p class="mute">Nenhum medicamento encontrado.</p>'};
bw(pop,draw);$("#q").oninput=draw;chips();draw();const ver=document.createElement('div');ver.className='catalog-version';ver.textContent='Dose PS · catálogo local '+DOSEPS_BUILD;app.appendChild(ver)}
function tube(g,w){let h;
if(g=="n"){const t=w<1?"2,5":w<2?"3,0":w<3?"3,5":"3,5–4,0";h=[`Tubo: <b>${t}</b> sem cuff`,`Fixar em <b>${f(w+6)} cm</b> na rima labial (peso + 6)`,`Lâmina reta <b>${w<1?"00":w<3?"0":"0–1"}</b>`]}
else if(g=="p"){const c=w<6?3:w<10?3.5:r5((w/2-4)/4+3.5);h=[`Tubo com cuff: <b>${f(c)}</b> · sem cuff: <b>${f(c+.5)}</b>`,`Fixar em <b>${f(c*3)} cm</b> na rima labial (diâmetro do tubo × 3)`,`Lâmina <b>${w<10?"reta 1":w<20?"reta ou curva 2":w<40?"curva 2–3":"curva 3"}</b>`,"Deixar tubos 0,5 acima e abaixo preparados."]}
else h=["Tubo: <b>7,0–7,5</b> (mulher) · <b>7,5–8,0</b> (homem)","Fixar em <b>20–21 cm</b> (mulher) ou <b>22–23 cm</b> (homem) na rima labial","Lâmina curva <b>3</b> (ou <b>4</b> em paciente grande)","Cuff: insuflar até 20–30 cmH₂O."];
return `<h2>Etapa 6 · Tubo e posicionamento</h2>`+box("Sugestão para "+f(w)+" kg",h,1)+`<div class="mute">Rima labial: marca do tubo alinhada aos lábios (incisivos). Confirmar com capnografia, ausculta e radiografia.</div>`}
function iot(g,w){const pp=g=="a"?"a":"p";const d=n=>dc(n,pp,w);
let h=`<h2>Etapa 1 · Preparo</h2>`+box("Antes de medicar",["Monitor, acesso IV/IO, aspiração, capnografia e bolsa-válvula-máscara testados","Material do tubo e lâmina (ver Etapa 6), guia/bougie e plano B (máscara laríngea)","Pré-oxigenar com O₂ 100% por 3 min (ou 8 respirações profundas)","Otimizar posição e hemodinâmica; separar as drogas já calculadas"],1);
if(g!="a")h+=`<h2>Etapa 2 · Pré-tratamento (se indicado)</h2><div class="mute">Atropina em lactentes, bradicardia ou antes de succinilcolina.</div>`+d("Atropina");
h+=`<h2>Etapa 3 · Analgesia / adjuvante (se indicado)</h2>`+iotFentanyl(g,w);
h+=`<h2>Etapa 4 · Sedação / indução</h2><div class="mute">Escolher uma droga e administrar logo em seguida.</div>`+d("Etomidato")+d("Cetamina");
h+=`<h2>Etapa 5 · Bloqueio neuromuscular</h2><div class="mute">Escolher um. Aguardar o tempo de efeito antes de laringoscopia.</div>`+d("Rocurônio")+d("Succinilcolina");
return h+tube(g,w)+`<h2>Etapa 7 · Confirmação</h2>`+box("Após passar o tubo",["Capnografia com onda (padrão-ouro), expansão simétrica e ausculta","Fixar na rima labial e insuflar o cuff","Iniciar sedação e analgesia contínuas; radiografia de tórax"],1)}
function neo(w){const adr=`<div class="card"><h3>Adrenalina 1:10.000 (0,1 mg/mL)</h3><div class="res">IV/IO: <b>${f(.01*w)}–${f(.03*w)} mg</b> = <b>${f(.1*w)}–${f(.3*w)} mL</b> (0,01–0,03 mg/kg)<br>Traqueal: <b>${f(.05*w)}–${f(.1*w)} mg</b> = <b>${f(.5*w)}–${f(w)} mL</b> (0,05–0,1 mg/kg)</div><div class="mute" style="margin-top:6px"><b>Administrar:</b> bolus rápido seguido de 3 mL de SF; repetir a cada 3–5 min.<br><b>Diluição:</b> 1 mL (1 mg/mL) + 9 mL de SF.</div></div>`;
const sf=`<div class="card"><h3>Expansor (SF 0,9%)</h3><div class="res">Volume: <b>${f(10*w)} mL</b> (10 mL/kg)</div><div class="mute" style="margin-top:6px"><b>Administrar:</b> em 5–10 min. Não precisa diluir.</div></div>`;
return box("Metas",["Ventilação com pressão positiva: <b>40–60 ventilações/min</b>","Compressões: <b>3:1</b> (90 compressões + 30 ventilações/min), 1/3 do diâmetro AP do tórax, técnica dos 2 polegares","FC alvo: acima de 100 bpm","SatO₂ pré-ductal: 1 min 60–65% · 2 min 65–70% · 3 min 70–75% · 4 min 75–80% · 5 min 80–85% · 10 min 85–95%"],1)
+`<h2>Sequência</h2>`+box("Por frequência cardíaca",["Primeiros 30 s: aquecer, posicionar, aspirar se necessário, secar e estimular","Apneia ou FC &lt; 100: VPP com ar ambiente (≥ 35 sem) ou O₂ 21–30% (&lt; 35 sem) e oxímetro","FC &lt; 100 após 30 s: corrigir técnica (máscara, posição, aspirar, boca aberta, pressão, O₂) e considerar IOT ou máscara laríngea","FC &lt; 60 após 30 s de VPP efetiva com via aérea segura: <b>compressões 3:1</b> e O₂ 100%","Acesso venoso umbilical ou IO","FC &lt; 60 após 60 s de compressões: <b>adrenalina</b> (abaixo)","Suspeita de hipovolemia: expansor de volume"])+adr+sf}
function rcp(g,w){if(g=="n")return neo(w);
const A=g=="a",pp=A?"a":"p",ch=S.rit=="s";
const sh=A?"<b>120–200 J</b> bifásico (ou máximo do aparelho)":`1º <b>${f(2*w)} J</b> (2 J/kg) · 2º <b>${f(4*w)} J</b> (4 J/kg) · seguintes ≥ ${f(4*w)} J, até <b>${f(Math.min(10*w,200))} J</b> (máx. 10 J/kg ou dose adulta)`;
const am=A?"Amiodarona":"Amiodarona (FV/TV sem pulso)";
let h=box("Metas",A?["Compressões: <b>100–120/min</b>, <b>5–6 cm</b>, retorno total do tórax, terço inferior do esterno","Interromper o mínimo possível; trocar o compressor a cada 2 min","Sem via aérea avançada: <b>30:2</b>, 1 s por ventilação com elevação visível do tórax","Com via aérea avançada: compressões contínuas e <b>1 ventilação a cada 6 s</b> (10/min), O₂ 100%","Capnografia: ETCO₂ &gt; 10 mmHg; aumento súbito sugere retorno da circulação","Pós-ROSC: SpO₂ 92–98%, PAS ≥ 90 mmHg, PaCO₂ 35–45 mmHg, ECG"]:["Compressões: <b>100–120/min</b>, profundidade de 1/3 do diâmetro AP (≈ 5 cm criança, 4 cm lactente)","Lactente: 2 polegares (2 socorristas) ou 2 dedos; criança: 1 ou 2 mãos","Sem via aérea avançada: <b>15:2</b> (2 socorristas) ou 30:2 (1 socorrista)","Com via aérea avançada: <b>1 ventilação a cada 2–3 s</b> (20–30/min), compressões contínuas","Capnografia: ETCO₂ ≥ 15–20 mmHg","Pós-ROSC: SpO₂ 94–99%, evitar hipotensão e hiperóxia"],1);
h+=`<h2>Ritmo</h2><div class="row"><button class="chip${ch?" sel":""}" data-r="s">Chocável (FV / TV sem pulso)</button><button class="chip${ch?"":" sel"}" data-r="n">Não chocável (AESP / assistolia)</button></div>`;
h+=ch?box("Sequência",["Iniciar RCP até o desfibrilador estar pronto","Choque: "+sh,"RCP imediata por 2 min e obter acesso IV/IO","Checar ritmo: se persistir chocável, <b>2º choque</b> e RCP por 2 min","Após o 2º choque: <b>adrenalina</b>, repetida a cada 3–5 min","Após o 3º choque: <b>amiodarona</b>; considerar via aérea avançada","Se ritmo organizado, checar pulso; sem pulso, seguir como não chocável"])+dc("Adrenalina (PCR)",pp,w)+dc(am,pp,w):box("Sequência",["RCP imediata de alta qualidade e acesso IV/IO","<b>Adrenalina o mais precoce possível</b>, repetida a cada 3–5 min","Checar ritmo a cada 2 min; se virar FV/TV, seguir o ritmo chocável","Considerar via aérea avançada e capnografia"])+dc("Adrenalina (PCR)",pp,w);
return h+box("Causas reversíveis",["Hipovolemia, hipóxia, acidose, hipo/hipercalemia, hipotermia","Pneumotórax hipertensivo, tamponamento, toxinas, trombose pulmonar ou coronária"],1)}
function procPage(){const g=S.g;app.innerHTML=`<button class="btn sec" id="bk">← Voltar</button><h2 style="margin-top:10px">${S.pt=="IOT"?"Intubação orotraqueal":"Ressuscitação cardiopulmonar"}</h2><div class="wbar"><div class="row" style="margin-bottom:6px">${[["n","Neonatal"],["p","Pediátrico"],["a","Adulto"]].map(x=>`<button class="chip${g==x[0]?" sel":""}" data-g="${x[0]}">${x[1]}</button>`).join("")}</div>${wb(g)}</div><div id="pc"></div>`;
const draw=()=>{const w=S["w"+g];$("#pc").innerHTML=(S.pt=="IOT"?iot:rcp)(g,w);document.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{S.rit=b.dataset.r;draw()})};
$("#bk").onclick=()=>{S.pt=null;render()};document.querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>{S.g=b.dataset.g;procPage()});bw(g,draw);draw()}
function proc(){if(S.pv!=null)return procOld();if(S.pt==="VM")return ventilation();if(S.pt==="SED")return sedationPage();if(S.pt==="CVC")return cvcPage();if(S.pt)return procPage();procOld();
app.innerHTML=`<h2>Protocolos</h2>${[["VM","Ventilação mecânica","Adulto, pediatria e neonatal · parâmetros e reavaliação"],["RCP","Ressuscitação cardiopulmonar","Neonatal, pediátrico e adulto, por ritmo e peso"],["IOT","Intubação orotraqueal","Drogas por etapa, doses, tempo e tubo"],["SED","Sedação contínua","Adulto, pediátrico e neonatal · doses, soluções e cuidados"],["CVC","Acesso venoso central","Jugular interna, subclávia e femoral · marcos anatômicos e passo a passo"]].map(x=>`<div class="card" data-pt="${x[0]}" style="cursor:pointer"><h3>${x[1]}</h3><span class="mute">${x[2]}</span></div>`).join("")}`+app.innerHTML;
document.querySelectorAll("[data-pt]").forEach(e=>e.onclick=()=>{S.pt=e.dataset.pt;S.g=S.g||"p";render()});
document.querySelectorAll("[data-i]").forEach(e=>e.onclick=()=>{S.pv=+e.dataset.i;render()})}

const VS=[
{n:"Noradrenalina",cls:"Vasopressor",k:"p",u:"mcg/kg/min",w:1,c:64,cc:"64 mcg/mL",via:"Acesso central preferencial",q:"4 ampolas (16 mg) + 234 mL de SG 5% = 250 mL",
rng:[{l:"Faixa usual",lo:0.05,hi:0.5,t:"início 0,05"},{l:"Choque refratário",lo:0.5,hi:3}],
prep:["Ampola de 4 mL (2 mg/mL de hemitartarato = 1 mg/mL de noradrenalina base; 4 mg base por ampola).","Aspirar 16 mL (4 ampolas = 16 mg).","Completar com 234 mL de SG 5% até 250 mL.","Concentração final: 64 mcg/mL.","Bomba de infusão, acesso central; trocar a solução a cada 24 h.","Não misturar com bicarbonato (inativa em pH alcalino)."],
ef:["Isquemia e necrose de extremidades","Extravasamento causa necrose tecidual (infiltrar fentolamina)","Arritmias e bradicardia reflexa","Hipertensão excessiva","Redução da perfusão renal e esplâncnica","Cefaleia e ansiedade"]},
{n:"Adrenalina (infusão)",cls:"Vasopressor",k:"p",u:"mcg/kg/min",w:1,c:16,cc:"16 mcg/mL",via:"Acesso central preferencial",q:"4 ampolas (4 mg) + 246 mL de SG 5% = 250 mL",
rng:[{l:"Efeito beta (inotrópico)",lo:0.01,hi:0.1},{l:"Efeito alfa e beta (vasopressor)",lo:0.1,hi:0.5}],
prep:["Ampola de 1 mg/mL.","Aspirar 4 mL (4 mg).","Completar com 246 mL de SG 5% (ou SF) até 250 mL.","Concentração final: 16 mcg/mL.","Bomba de infusão; inativada em solução alcalina."],
ef:["Taquicardia e arritmias","Hipertensão","Aumento de lactato (hiperlactatemia)","Hiperglicemia e hipocalemia","Isquemia periférica e esplâncnica","Tremor e ansiedade"]},
{n:"Dopamina · dose dopaminérgica (D1)",cls:"Vasopressor",k:"p",u:"mcg/kg/min",w:1,c:1000,cc:"1.000 mcg/mL",via:"Acesso central preferencial",q:"5 ampolas (250 mg) + 200 mL de SG 5% = 250 mL",
rng:[{l:"Dose dopaminérgica (D1)",lo:1,hi:3,t:"sem proteção renal comprovada"}],
prep:["Ampola de 50 mg/10 mL (5 mg/mL).","Aspirar 50 mL (5 ampolas = 250 mg).","Completar com 200 mL de SG 5% até 250 mL.","Concentração final: 1.000 mcg/mL (1 mg/mL).","Bomba de infusão; não misturar com bicarbonato."],
ef:["Náuseas e vômitos","Taquicardia e taquiarritmias","Cefaleia","Extravasamento causa necrose tecidual","Supressão de prolactina e do eixo hipofisário"]},
{n:"Dopamina · dose beta (inotrópica)",cls:"Inotrópico",k:"i",u:"mcg/kg/min",w:1,c:1000,cc:"1.000 mcg/mL",via:"Acesso central preferencial",q:"Mesma solução: 5 ampolas (250 mg) + 200 mL de SG 5%",
rng:[{l:"Dose beta (β1): ↑ contratilidade e FC",lo:3,hi:10}],
prep:["Mesma solução da dopamina dopaminérgica (1.000 mcg/mL).","Aumento de contratilidade e frequência cardíaca."],
ef:["Taquicardia e arritmias (atriais e ventriculares)","Aumento do consumo de O₂ do miocárdio","Isquemia miocárdica","Náuseas","Extravasamento causa necrose"]},
{n:"Dopamina · dose alfa (vasopressora)",cls:"Vasopressor",k:"p",u:"mcg/kg/min",w:1,c:1000,cc:"1.000 mcg/mL",via:"Acesso central obrigatório",q:"Mesma solução: 5 ampolas (250 mg) + 200 mL de SG 5%",
rng:[{l:"Dose alfa (α1): vasoconstrição",lo:10,hi:20,t:"máx. 20"}],
prep:["Mesma solução da dopamina (1.000 mcg/mL).","Acima de 10 mcg/kg/min predomina a vasoconstrição.","Acima de 20 mcg/kg/min: preferir noradrenalina."],
ef:["Vasoconstrição intensa e isquemia de extremidades","Taquiarritmias","Hipertensão","Redução da perfusão renal e esplâncnica","Necrose por extravasamento"]},
{n:"Dobutamina",cls:"Inotrópico",k:"i",u:"mcg/kg/min",w:1,c:1000,cc:"1.000 mcg/mL",via:"Acesso periférico calibroso ou central",q:"1 ampola (250 mg/20 mL) + 230 mL de SG 5% ou SF = 250 mL",
rng:[{l:"Inotrópico usual",lo:2.5,hi:10},{l:"Dose alta",lo:10,hi:20}],
prep:["Ampola de 250 mg/20 mL (12,5 mg/mL).","Aspirar 20 mL (1 ampola).","Completar com 230 mL de SG 5% ou SF até 250 mL.","Concentração final: 1.000 mcg/mL.","Bomba de infusão; usar a solução em até 24 h."],
ef:["Taquicardia e arritmias ventriculares","Hipotensão (vasodilatação β2)","Isquemia miocárdica","Hipocalemia","Tolerância após 48–72 h","Tremor e cefaleia"]},
{n:"Milrinona",cls:"Inotrópico",k:"i",u:"mcg/kg/min",w:1,c:200,cc:"200 mcg/mL",via:"Periférico ou central",q:"1 ampola (20 mg/20 mL) + 80 mL de SF = 100 mL",
rng:[{l:"Inotrópico e vasodilatador",lo:0.25,hi:0.75,t:"reduzir na insuficiência renal"}],
prep:["Ampola de 20 mg/20 mL (1 mg/mL).","Aspirar 20 mL e completar com 80 mL de SF ou SG 5% (100 mL).","Concentração final: 200 mcg/mL.","Evitar bolus em paciente instável."],
ef:["Hipotensão","Arritmias ventriculares","Trombocitopenia","Cefaleia","Acúmulo na insuficiência renal"]},
{n:"Vasopressina",cls:"Vasopressor",k:"p",u:"U/min",w:0,c:0.2,cc:"0,2 U/mL",via:"Acesso central preferencial",q:"1 ampola (20 U) + 99 mL de SF = 100 mL",
rng:[{l:"Choque séptico",lo:0.01,hi:0.04,t:"usual 0,03"}],
prep:["Ampola de 20 U/mL.","Aspirar 1 mL (20 U) e completar com 99 mL de SF (100 mL).","Concentração final: 0,2 U/mL.","Dose fixa, não titular pelo peso; não passar de 0,04 U/min."],
ef:["Isquemia mesentérica, cutânea, digital e coronária","Hiponatremia","Redução do débito cardíaco e bradicardia","Aumento de enzimas hepáticas","Necrose cutânea por extravasamento"]},
{n:"Nitroprussiato de sódio",cls:"Vasodilatador",k:"d",u:"mcg/kg/min",w:1,c:200,cc:"200 mcg/mL",via:"Acesso exclusivo, monitorar PA invasiva",q:"1 ampola (50 mg) + 250 mL de SG 5%, protegida da luz",
rng:[{l:"Início e uso usual",lo:0.3,hi:3},{l:"Dose alta (curto prazo)",lo:3,hi:10,t:"máx. 10 por até 10 min"}],
prep:["Ampola de 50 mg (pó).","Reconstituir com 2 mL de SG 5%.","Diluir em 250 mL de SG 5% (concentração final 200 mcg/mL).","Proteger da luz (frasco e equipo fotoprotegidos).","Usar em até 24 h; descartar se mudar de cor.","Titular com monitorização contínua da PA."],
ef:["Hipotensão excessiva","Intoxicação por cianeto e tiocianato (acidose lática, confusão, convulsão), sobretudo acima de 2 mcg/kg/min por mais de 24–48 h ou na insuficiência renal","Taquicardia reflexa","Metemoglobinemia","Aumento da PIC e piora de shunt pulmonar"]},
{n:"Nitroglicerina",cls:"Vasodilatador",k:"d",u:"mcg/min",w:0,c:200,cc:"200 mcg/mL",via:"Periférico ou central",q:"1 ampola (50 mg/10 mL) + 240 mL de SG 5% = 250 mL",
rng:[{l:"Início",lo:5,hi:20},{l:"Usual",lo:20,hi:100},{l:"Dose alta",lo:100,hi:200}],
prep:["Ampola de 50 mg/10 mL (5 mg/mL).","Aspirar 10 mL e completar com 240 mL de SG 5% (250 mL).","Concentração final: 200 mcg/mL.","Usar frasco de vidro e equipo próprio (adsorve no PVC).","Dose fixa em mcg/min, não depende do peso."],
ef:["Cefaleia","Hipotensão","Taquicardia reflexa","Tolerância com uso prolongado","Piora da hipoxemia (shunt)","Metemoglobinemia rara"]},
{n:"Dexmedetomidina",cls:"Sedoanalgesia",k:"s",u:"mcg/kg/h",w:1,h:1,c:4,cc:"4 mcg/mL",via:"Periférico ou central",q:"1 ampola (200 mcg/2 mL) + 48 mL de SF = 50 mL",
rng:[{l:"Sedação contínua",lo:0.2,hi:1.4,t:"iniciar com 0,2–0,7"}],
prep:["Ampola de 100 mcg/mL, 2 mL (200 mcg).","Aspirar 2 mL e completar com 48 mL de SF (50 mL).","Concentração final: 4 mcg/mL.","Bomba de infusão. Evitar bolus em paciente instável."],
ef:["Bradicardia e BAV","Hipotensão (e hipertensão transitória no bolus)","Boca seca","Pouco efeito sobre a respiração, mas sem amnésia garantida","Retirada abrupta pode causar rebote"]},
{n:"Midazolam (infusão)",cls:"Sedoanalgesia",k:"s",u:"mg/kg/h",w:1,h:1,c:1,cc:"1 mg/mL",via:"Periférico ou central",q:"1 ampola (50 mg/10 mL) + 40 mL de SF = 50 mL",
rng:[{l:"Sedação contínua",lo:0.02,hi:0.2}],
prep:["Ampola de 5 mg/mL, 10 mL (50 mg).","Aspirar 10 mL e completar com 40 mL de SF (50 mL).","Concentração final: 1 mg/mL.","Bomba de infusão."],
ef:["Depressão respiratória","Hipotensão","Acúmulo em obesos, idosos e na insuficiência renal ou hepática","Tolerância e abstinência","Delirium"]},
{n:"Fentanil (infusão)",cls:"Sedoanalgesia",k:"s",u:"mcg/kg/h",w:1,h:1,c:10,cc:"10 mcg/mL",via:"Periférico ou central",q:"1 ampola (500 mcg/10 mL) + 40 mL de SF = 50 mL",
rng:[{l:"Analgesia contínua",lo:1,hi:3}],
prep:["Ampola de 0,05 mg/mL, 10 mL (500 mcg).","Aspirar 10 mL e completar com 40 mL de SF (50 mL).","Concentração final: 10 mcg/mL.","Bomba de infusão."],
ef:["Depressão respiratória","Bradicardia e hipotensão","Rigidez torácica em bolus rápido","Náuseas, íleo e retenção urinária","Tolerância e abstinência"]},
{n:"Propofol (infusão)",cls:"Sedoanalgesia",k:"s",u:"mg/kg/h",w:1,h:1,c:10,cc:"10 mg/mL",via:"Acesso exclusivo, periférico ou central",q:"Sem diluir (10 mg/mL), em seringa ou frasco",
rng:[{l:"Sedação contínua",lo:0.3,hi:3,t:"evitar acima de 4"}],
prep:["Ampola de 10 mg/mL, 20 mL.","Usar sem diluir, com técnica asséptica.","Trocar frasco e equipo a cada 12 h.","Considerar as calorias dos lipídios e os triglicerídeos."],
ef:["Hipotensão e bradicardia","Depressão respiratória","Hipertrigliceridemia e pancreatite","Síndrome da infusão do propofol (altas doses por mais de 48 h)","Dor à injeção"]}
];
function vcard(d,w){const k=d.w?w:1,r=x=>f(x*k*(d.h?1:60)/d.c);
return `<div class="card v v-${d.k}"><h3>${esc(d.n)}</h3><div><span class="tag">${esc(d.cls)}</span><span class="tag">${esc(d.cc)}</span><span class="tag">${esc(d.via)}</span></div>
<div class="sol"><b>Solução:</b> ${esc(d.q)}</div>
${d.rng.map(x=>`<div class="rr"><div><b>${esc(x.l)}</b><br><span class="mute">${f(x.lo)}–${f(x.hi)} ${d.u}${x.t?" · "+esc(x.t):""}</span></div><div class="rt"><b>${r(x.lo)}–${r(x.hi)}</b> mL/h</div></div>`).join("")}
${d.w?"":'<div class="mute">Dose fixa, não depende do peso.</div>'}
<details><summary>Como montar a solução</summary><ol>${d.prep.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></details>
<details><summary>Efeitos colaterais e cuidados</summary><ul>${d.ef.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details></div>`}
function vaso(){return infusionDashboard()}

function dc2(t,rows,notes){return `<div class="card v v-i"><h3>${t}</h3>${rows.map(r=>`<div class="rr"><div><b>${r[0]}</b><br><span class="mute">${r[1]}</span></div><div class="rt"><b>${r[2]}</b></div></div>`).join("")}<div class="mute" style="margin-top:6px">${notes.join("<br>")}</div></div>`}
function avc(w){const A=Math.min(.9*w,90),b=A*.1,i=A-b,T=Math.min(.25*w,25);
return box("Janela e metas de tempo",["Início dos sintomas (ou <b>última vez visto bem</b>) há <b>até 4,5 h</b>.","Porta-TC: até 25 min. <b>Porta-agulha: até 60 min</b> (quanto antes, melhor).","Não atrasar a trombólise para aguardar exames de coagulação, salvo suspeita de coagulopatia ou uso de anticoagulante."],1)
+box("Exames e avaliações obrigatórios antes",["<b>Glicemia capilar</b>: excluir hipoglicemia (menor que 50 mg/dL) e tratar.","<b>TC de crânio sem contraste</b>: afastar hemorragia e grande área hipodensa.","<b>Pressão arterial abaixo de 185×110 mmHg</b> antes de iniciar.","<b>NIHSS</b> com déficit neurológico incapacitante.","Checar medicamentos em uso (anticoagulantes, DOAC) e cirurgia, trauma ou sangramento recentes.","Recomendados, sem atrasar: ECG, hemograma e plaquetas, TP/INR, TTPA, creatinina. Obrigatórios se suspeita de coagulopatia ou uso de anticoagulante."])
+dc2("Alteplase (rt-PA)",[["Dose total","0,9 mg/kg (máx. 90 mg)",f(A)+" mg"],["1) Bolus","10% da dose, IV em 1 min",f(b)+" mg = "+f(b)+" mL"],["2) Infusão","90% da dose, em 60 min",f(i)+" mg = "+f(i)+" mL/h"]],["<b>Diluição:</b> reconstituir com o diluente do fabricante até <b>1 mg/mL</b> (frasco 50 mg + 50 mL). Misturar girando devagar, sem agitar.","Bomba de infusão, acesso exclusivo. Ao fim, lavar o equipo com SF 0,9% para infundir o que ficou na linha."])
+dc2("Tenecteplase (conforme protocolo do serviço)",[["Dose","0,25 mg/kg (máx. 25 mg), bolus único em 5–10 s",f(T)+" mg = "+f(T/5)+" mL"]],["<b>Diluição:</b> frasco 50 mg + 10 mL de AD = 5 mg/mL.","Lavar a via com SF antes e depois. Confirme se a indicação para AVC está aprovada no seu serviço."])
+box("Contraindicações à trombólise",["TC com hemorragia intracraniana ou grande área hipodensa","Sintomas com mais de 4,5 h ou horário de início desconhecido","PA acima de 185×110 mmHg sem controle","Glicemia abaixo de 50 mg/dL (corrigir e reavaliar)","AVC isquêmico ou TCE grave nos últimos 3 meses","História de hemorragia intracraniana, MAV, aneurisma ou neoplasia intracraniana","Cirurgia de grande porte nos últimos 14 dias","Sangramento gastrointestinal ou urinário nos últimos 21 dias","Punção arterial em local não compressível nos últimos 7 dias","DOAC nas últimas 48 h ou heparina de baixo peso em dose terapêutica nas últimas 24 h","INR acima de 1,7, TTPA alterado ou plaquetas abaixo de 100.000/mm³","Endocardite infecciosa ou suspeita de dissecção de aorta","Déficit leve, isolado ou em melhora rápida (avaliar caso a caso)"],1)
+box("Metas de pressão arterial",["<b>Antes de iniciar:</b> abaixo de 185×110 mmHg.","<b>Durante e por 24 h após:</b> abaixo de 180×105 mmHg.","Se acima da meta: labetalol 10–20 mg IV em 1–2 min (pode repetir) ou nicardipina 5 mg/h, aumentando 2,5 mg/h a cada 5–15 min (máx. 15 mg/h). Nitroprussiato é alternativa.","Se não controlar a PA antes do bolus, não iniciar."],1)
+box("Após a trombólise: acompanhamento",["Internar em UTI ou unidade de AVC.","PA e avaliação neurológica a cada <b>15 min por 2 h</b>, a cada <b>30 min por 6 h</b> e a cada <b>1 h até completar 24 h</b>.","Evitar sonda vesical, sonda nasogástrica, punção arterial e anticoagulantes ou antiagregantes por 24 h.","TC de crânio ou RM em 24 h, antes de iniciar antiagregante ou anticoagulante.","Cabeceira plana ou conforme tolerância, glicemia entre 140 e 180 mg/dL, normotermia e jejum até avaliar a deglutição."])
+box("Complicações",["<b>Suspeita de hemorragia intracraniana</b> (cefaleia intensa, vômito, piora neurológica, queda da consciência, PA elevada): <b>parar a infusão</b>, TC urgente, coletar hemograma, TP/TTPA, fibrinogênio e tipagem.","Crioprecipitado 10 U em 10–30 min se fibrinogênio baixo, ácido tranexâmico 1 g IV em 10 min e avaliação da neurocirurgia.","<b>Angioedema orolingual:</b> parar a infusão, proteger via aérea, anti-histamínico, corticoide e adrenalina conforme a gravidade."])}
function iam(w){const t=w<60?30:w<70?35:w<80?40:w<90?45:50,a2=Math.min(.75*w,50),a3=Math.min(.5*w,35),eb=Math.min(w,100),ee=Math.min(.75*w,75),hb=Math.min(60*w,4000),hi=Math.min(12*w,1000);
return box("Indicação, tempo e metas",["Elevação de ST em 2 derivações contíguas (V2–V3: 2 mm em homens, 1,5 mm em mulheres; demais derivações: 1 mm) ou <b>BRE novo</b>.","Sintomas há <b>até 12 h</b> (12–24 h só se isquemia persistente e grande área em risco, com cardiologista).","Indicar quando a <b>angioplastia primária não puder ser feita em até 120 min</b> do primeiro contato médico.","<b>Meta porta-agulha: até 30 min.</b> ECG em até 10 min da chegada."],1)
+box("Exames e avaliações obrigatórios antes",["<b>ECG de 12 derivações</b> (e posteriores/direitas se parede inferior).","Horário de início dos sintomas confirmado.","PA nos dois braços e FC; excluir dissecção de aorta (dor súbita, assimetria de pulsos ou PA).","Checar todas as contraindicações abaixo.","Coletar, sem aguardar o resultado: troponina, hemograma, coagulograma, creatinina, potássio e tipagem, glicemia capilar."])
+dc2("Tenecteplase (preferencial)",[["Dose por faixa de peso","30 mg (menos de 60 kg) a 50 mg (90 kg ou mais)",f(t)+" mg = "+f(t/5)+" mL"]],["Bolus único IV em <b>5–10 s</b>. <b>Diluição:</b> frasco 50 mg + 10 mL de AD = 5 mg/mL.","<b>Idade 75 anos ou mais:</b> usar metade da dose ("+f(t/2)+" mg = "+f(t/10)+" mL).","Faixas: abaixo de 60 kg 30 mg; 60–69 kg 35 mg; 70–79 kg 40 mg; 80–89 kg 45 mg; 90 kg ou mais 50 mg."])
+dc2("Alteplase acelerada (GUSTO)",[["1) Bolus","15 mg IV em 1–2 min","15 mg = 15 mL"],["2) 0,75 mg/kg","máx. 50 mg, em 30 min",f(a2)+" mg = "+f(a2*2)+" mL/h"],["3) 0,5 mg/kg","máx. 35 mg, em 60 min",f(a3)+" mg = "+f(a3)+" mL/h"]],["<b>Diluição:</b> 1 mg/mL (frasco 50 mg + 50 mL de diluente). Dose total máxima: 100 mg."])
+dc2("Estreptoquinase",[["Dose fixa","1.500.000 UI em 30–60 min","100 mL em 30–60 min"]],["<b>Diluição:</b> 1,5 milhão UI em 100 mL de SF 0,9% (100–200 mL/h).","Não depende do peso. Causa hipotensão e reação alérgica: monitorar PA. <b>Não usar</b> se já usada nos últimos 5 dias a 2 anos."])
+dc2("Terapia associada",[["AAS","160–325 mg mastigado, imediato","1 dose"],["Clopidogrel","300 mg (até 75 anos) ou 75 mg (acima de 75 anos)","1 dose"],["Enoxaparina (com tenecteplase ou alteplase)","Até 75 anos: 30 mg IV + 1 mg/kg SC em 15 min, a cada 12 h (máx. 100 mg nas 2 primeiras doses)",f(eb)+" mg SC = "+f(eb/100)+" mL"],["Enoxaparina","75 anos ou mais: sem bolus, 0,75 mg/kg SC a cada 12 h (máx. 75 mg nas 2 primeiras doses)",f(ee)+" mg SC = "+f(ee/100)+" mL"],["Heparina não fracionada (alternativa)","60 U/kg IV em bolus (máx. 4.000 U) e 12 U/kg/h (máx. 1.000 U/h)",f(hb)+" U e "+f(hi)+" U/h"]],["Enoxaparina: seringa 40 mg/0,4 mL (100 mg/mL). Com estreptoquinase, preferir enoxaparina ou fondaparinux."])
+box("Contraindicações à fibrinólise",["<b>Absolutas:</b> hemorragia intracraniana prévia; AVC isquêmico nos últimos 3 meses; neoplasia, MAV ou aneurisma cerebral; trauma craniofacial grave nos últimos 3 meses; sangramento ativo; suspeita de dissecção de aorta; coagulopatia.","<b>Relativas:</b> PA acima de 180×110 mmHg sem controle; AVC isquêmico antigo (mais de 3 meses); uso de anticoagulante; RCP traumática ou acima de 10 min; cirurgia de grande porte em 3 semanas; sangramento interno em 2–4 semanas; úlcera péptica ativa; gestação; punção vascular não compressível.","Estreptoquinase: exposição prévia ou alergia."],1)
+box("Avaliação da reperfusão (60–90 min)",["<b>Sinais de sucesso:</b> queda de ST de <b>50% ou mais</b> na derivação de maior supra, alívio da dor e estabilidade elétrica e hemodinâmica.","Arritmias de reperfusão (ritmo idioventricular acelerado, extrassístoles) são esperadas.","<b>Sem reperfusão (ST caiu menos de 50%, dor persistente, instabilidade):</b> transferir para <b>angioplastia de resgate imediata</b>. Não repetir o fibrinolítico.","Choque cardiogênico, ICC grave ou instabilidade elétrica: transferência imediata para hemodinâmica."],1)
+box("Após a fibrinólise: acompanhamento",["Internar em UCO/UTI com monitorização contínua de ECG.","ECG de 12 derivações aos 60–90 min e depois de acordo com a evolução.","Sinais vitais a cada 15 min na primeira hora, depois a cada hora; observar sangramentos e estado neurológico.","<b>Cateterismo entre 2 e 24 h</b>, mesmo com sucesso (estratégia fármaco-invasiva).","Evitar injeção intramuscular e punção arterial ou venosa em local não compressível.","Dor de cabeça, alteração neurológica ou queda do nível de consciência: suspender anticoagulantes e fazer TC de crânio urgente."])}
function trombo(){if(!S.tt){app.innerHTML=`<div class="warn">Protocolos de apoio. Confirme indicação, doses e contraindicações com o protocolo do serviço e com a equipe antes de trombolisar.</div>${[["avc","AVC isquêmico","Alteplase e tenecteplase, exames obrigatórios, metas de PA e acompanhamento."],["iam","Infarto com supra de ST","Tenecteplase, alteplase e estreptoquinase, janela, reperfusão e conduta."]].map(x=>`<div class="card" data-t="${x[0]}" style="cursor:pointer"><h3>${x[1]}</h3><span class="mute">${x[2]}</span></div>`).join("")}`;
document.querySelectorAll("[data-t]").forEach(e=>e.onclick=()=>{S.tt=e.dataset.t;trombo()});return}
app.innerHTML=`<button class="btn sec" id="bk">← Voltar</button><h2 style="margin-top:10px">${S.tt=="avc"?"Trombólise no AVC isquêmico":"Fibrinólise no infarto (IAMCSST)"}</h2><div class="wbar">${wb("t")}</div><div id="tc"></div>`;
const draw=()=>{$("#tc").innerHTML=(S.tt=="avc"?avc:iam)(S.wt)};$("#bk").onclick=()=>{S.tt=null;trombo()};bw("t",draw);draw()}

const GATE=new Set(["proc","vaso","trombo"]);
const AU={t:null,u:null,prem:false,adm:false,verifiedAdmin:false,until:null,exp:0};
const X=(n,pop,kind,c,o)=>Object.assign({n,pop,kind,c},o);
const RX=[
X("Dipirona gotas 500 mg/mL","p","l",500,{k:15,mx:1000,fr:6,dy:3,vol:10,prn:1,gt:20}),
X("Paracetamol gotas 200 mg/mL","p","l",200,{k:200/15,mx:750,fr:6,dy:3,vol:15,prn:1,gt:15}),
X("Ibuprofeno gotas 50 mg/mL","p","l",50,{k:7.5,mx:400,fr:8,dy:3,vol:30,prn:1}),
X("Amoxicilina suspensão 250 mg/5 mL","p","l",50,{k:16.7,mx:1000,fr:8,dy:7,vol:150}),
X("Amoxicilina + clavulanato susp. 400/57 mg/5 mL","p","l",80,{k:22.5,mx:1000,fr:12,dy:7,vol:70}),
X("Azitromicina suspensão 200 mg/5 mL","p","l",40,{k:10,mx:500,fr:24,dy:3,vol:15}),
X("Cefalexina suspensão 250 mg/5 mL","p","l",50,{k:12.5,mx:500,fr:6,dy:7,vol:100}),
X("Prednisolona solução 3 mg/mL","p","l",3,{k:1,mx:60,fr:24,dy:5,vol:60}),
X("Dexclorfeniramina solução 0,4 mg/mL","p","l",0.4,{k:0.04,mx:2,fr:8,dy:5,vol:120}),
X("Desloratadina xarope 0,5 mg/mL","p","l",0.5,{t:[[20,1.25],[999,2.5]],fr:24,dy:5,vol:60}),
X("Loratadina xarope 1 mg/mL","p","l",1,{t:[[30,5],[999,10]],fr:24,dy:5,vol:100}),
X("Domperidona suspensão 1 mg/mL","p","l",1,{k:0.3,mx:10,fr:8,dy:3,vol:100}),
X("Ondansetrona solução 0,8 mg/mL","p","l",0.8,{k:0.15,mx:4,fr:8,dy:2,vol:50,prn:1}),
X("Nitazoxanida suspensão 20 mg/mL","p","l",20,{k:7.5,mx:500,fr:12,dy:3,vol:45}),
X("Albendazol suspensão 40 mg/mL","p","l",40,{d:400,fr:24,dy:1,vol:10,one:1}),
X("Salbutamol spray 100 mcg/jato","p","x",0,{tx:"Fazer 4 jatos com espaçador, a cada 6 horas, por 5 dias (se falta de ar ou chiado).",q:"1 frasco",rt:"INALATÓRIO"}),
X("Soro fisiológico 0,9% nasal","p","x",0,{tx:"Pingar 3 a 5 gotas em cada narina, até 6 vezes ao dia, para limpeza do nariz.",q:"1 frasco",rt:"NASAL"}),
X("Sais de reidratação oral","p","x",0,{tx:"Dissolver 1 envelope em 1 litro de água potável e oferecer em pequenos goles após cada evacuação ou vômito.",q:"4 envelopes"}),
X("Dipirona 500 mg comprimido","a","t",500,{d:500,fr:6,dy:3,prn:1}),
X("Paracetamol 750 mg comprimido","a","t",750,{d:750,fr:6,dy:3,prn:1}),
X("Ibuprofeno 600 mg comprimido","a","t",600,{d:600,fr:8,dy:3,prn:1}),
X("Diclofenaco potássico 50 mg comprimido","a","t",50,{d:50,fr:8,dy:3,prn:1}),
X("Tramadol 50 mg cápsula","a","t",50,{d:50,fr:8,dy:3,prn:1}),
X("Amoxicilina 500 mg cápsula","a","t",500,{d:500,fr:8,dy:7}),
X("Amoxicilina + clavulanato 875/125 mg comprimido","a","t",875,{d:875,fr:12,dy:7}),
X("Azitromicina 500 mg comprimido","a","t",500,{d:500,fr:24,dy:3}),
X("Cefalexina 500 mg cápsula","a","t",500,{d:500,fr:6,dy:7}),
X("Metronidazol 250 mg comprimido","a","t",250,{d:500,fr:8,dy:7}),
X("Nitazoxanida 500 mg comprimido","a","t",500,{d:500,fr:12,dy:3}),
X("Albendazol 400 mg comprimido","a","t",400,{d:400,fr:24,dy:1,one:1}),
X("Ivermectina 6 mg comprimido","a","t",6,{k:0.2,fr:24,dy:1,one:1,jej:1}),
X("Prednisona 20 mg comprimido","a","t",20,{d:40,fr:24,dy:5}),
X("Loratadina 10 mg comprimido","a","t",10,{d:10,fr:24,dy:5}),
X("Desloratadina 5 mg comprimido","a","t",5,{d:5,fr:24,dy:5}),
X("Omeprazol 20 mg cápsula","a","t",20,{d:20,fr:24,dy:14,jej:1}),
X("Ondansetrona 8 mg comprimido","a","t",8,{d:8,fr:8,dy:2,prn:1}),
X("Metoclopramida 10 mg comprimido","a","t",10,{d:10,fr:8,dy:3,prn:1}),
X("Hioscina 10 mg comprimido","a","t",10,{d:10,fr:8,dy:3,prn:1}),
X("Salbutamol spray 100 mcg/jato","a","x",0,{tx:"Fazer 2 a 4 jatos, a cada 6 horas, por 5 dias (se falta de ar ou chiado).",q:"1 frasco",rt:"INALATÓRIO"}),
X("Aciclovir 200 mg comprimido","a","t",200,{"d": 400, "fr": 8, "dy": 7}),
X("Amoxicilina + clavulanato 500/125 mg comprimido","a","t",500,{"d": 500, "fr": 8, "dy": 7}),
X("Amoxicilina + clavulanato susp. 250/62,5 mg/5 mL","p","l",50,{"k": 13.3, "mx": 500, "fr": 8, "dy": 7, "vol": 75}),
X("Ciprofloxacino 500 mg comprimido","a","t",500,{"d": 500, "fr": 12, "dy": 7}),
X("Clindamicina 300 mg cápsula","a","t",300,{"d": 300, "fr": 6, "dy": 7}),
X("Nitrofurantoína 100 mg cápsula","a","t",100,{"d": 100, "fr": 6, "dy": 5}),
X("Sulfametoxazol + trimetoprima 400/80 mg comprimido","a","t",400,{"d": 800, "fr": 12, "dy": 7}),
X("Sulfametoxazol + trimetoprima susp. 200/40 mg/5 mL","p","l",40,{"k": 20, "mx": 800, "fr": 12, "dy": 7, "vol": 100}),
X("Paracetamol 500 mg comprimido","a","t",500,{"d": 1000, "fr": 6, "dy": 3, "prn": 1}),
X("Ibuprofeno 300 mg comprimido","a","t",300,{"d": 300, "fr": 8, "dy": 3, "prn": 1}),
X("Prometazina 25 mg comprimido","a","t",25,{"d": 25, "fr": 12, "dy": 3, "prn": 1}),
X("Furosemida 40 mg comprimido","a","t",40,{"d": 40, "fr": 24, "dy": 30}),
X("Atenolol 50 mg comprimido","a","t",50,{"d": 50, "fr": 24, "dy": 30}),
X("Propranolol 40 mg comprimido","a","t",40,{"d": 40, "fr": 12, "dy": 30}),
X("Hidroclorotiazida 25 mg comprimido","a","t",25,{"d": 25, "fr": 24, "dy": 30}),
X("Captopril 25 mg comprimido","a","t",25,{"d": 25, "fr": 8, "dy": 30}),
X("Sinvastatina 20 mg comprimido","a","t",20,{"d": 20, "fr": 24, "dy": 30, "al": "à noite"}),
X("Metformina 850 mg comprimido","a","t",850,{"d": 850, "fr": 12, "dy": 30, "al": "junto às refeições"}),
X("Glibenclamida 5 mg comprimido","a","t",5,{"d": 5, "fr": 24, "dy": 30, "al": "antes do café da manhã"}),
X("Sulfato ferroso 40 mg (ferro) comprimido","a","t",40,{"d": 40, "fr": 8, "dy": 30, "al": "longe das refeições"}),
X("Carbonato de cálcio 500 mg comprimido","a","t",500,{"d": 500, "fr": 12, "dy": 30, "al": "com as refeições"}),
X("Permetrina 5% loção (escabiose)","p","x",0,{"tx": "Aplicar do pescoço aos pés à noite, deixar agir por 8 a 14 horas e lavar. Repetir após 7 dias.", "q": "1 frasco", "rt": "TÓPICO"}),
X("Permetrina 5% loção (escabiose)","a","x",0,{"tx": "Aplicar do pescoço aos pés à noite, deixar agir por 8 a 14 horas e lavar. Repetir após 7 dias.", "q": "1 frasco", "rt": "TÓPICO"}),
X("Permetrina 1% solução (pediculose)","p","x",0,{"tx": "Aplicar nos cabelos úmidos após o xampu, deixar por 10 minutos e enxaguar. Repetir após 7 a 10 dias.", "q": "1 frasco", "rt": "TÓPICO"}),
X("Permetrina 1% solução (pediculose)","a","x",0,{"tx": "Aplicar nos cabelos úmidos após o xampu, deixar por 10 minutos e enxaguar. Repetir após 7 a 10 dias.", "q": "1 frasco", "rt": "TÓPICO"}),
X("Dexametasona 1 mg/g creme","p","x",0,{"tx": "Aplicar camada fina nas lesões, 2 vezes ao dia, por 5 a 7 dias.", "q": "1 bisnaga", "rt": "TÓPICO"}),
X("Dexametasona 1 mg/g creme","a","x",0,{"tx": "Aplicar camada fina nas lesões, 2 vezes ao dia, por 5 a 7 dias.", "q": "1 bisnaga", "rt": "TÓPICO"}),
X("Mometasona 0,1% creme","p","x",0,{"tx": "Aplicar camada fina nas lesões, 1 vez ao dia, por até 7 dias.", "q": "1 bisnaga", "rt": "TÓPICO"}),
X("Mometasona 0,1% creme","a","x",0,{"tx": "Aplicar camada fina nas lesões, 1 vez ao dia, por até 7 dias.", "q": "1 bisnaga", "rt": "TÓPICO"}),
X("Nistatina 100.000 UI/mL suspensão","p","x",0,{"tx": "Aplicar 2 a 4 mL na boca, mantendo antes de engolir, de 6/6 horas, por 7 a 14 dias.", "q": "1 frasco", "rt": "ORAL"}),
X("Nistatina 25.000 UI/g creme vaginal","a","x",0,{"tx": "Aplicar 1 aplicador na vagina ao deitar, por 14 dias.", "q": "1 bisnaga", "rt": "VAGINAL"}),
X("Metronidazol 100 mg/g geleia vaginal","a","x",0,{"tx": "Aplicar 1 aplicador na vagina ao deitar, por 7 a 10 dias.", "q": "1 bisnaga", "rt": "VAGINAL"}),
X("Salmeterol + fluticasona 25/125 mcg spray","p","x",0,{"tx": "Fazer 2 jatos, 2 vezes ao dia, com espaçador, e enxaguar a boca depois.", "q": "1 frasco", "rt": "INALATÓRIO"}),
X("Salmeterol + fluticasona 25/125 mcg spray","a","x",0,{"tx": "Fazer 2 jatos, 2 vezes ao dia, com espaçador, e enxaguar a boca depois.", "q": "1 frasco", "rt": "INALATÓRIO"})
];
// Apresentações adicionais: doses herdadas apenas quando há equivalência direta.
RX.push(
 X("Dipirona solução oral (xarope) 50 mg/mL","p","l",50,{k:15,mx:1000,fr:6,dy:3,vol:100,prn:1,minW:5,note:"Não utilizar em menores de 3 meses. Cálculo pelo peso; conferir contraindicações."}),
 X("Dipirona solução oral (xarope) 50 mg/mL","a","l",50,{d:500,fr:6,dy:3,vol:100,prn:1}),
 X("Ivermectina 6 mg comprimido — escabiose","p","t",6,{k:.2,fr:24,dy:1,one:1,repeat:7,minW:15,iverm:1}),
 X("Ivermectina 6 mg comprimido — escabiose","a","t",6,{k:.2,fr:24,dy:1,one:1,repeat:7,minW:15,iverm:1})
);
const variants=[
 ["Paracetamol gotas 200", "Paracetamol solução oral 32 mg/mL",32,60],
 ["Ibuprofeno gotas 50", "Ibuprofeno gotas 100 mg/mL",100,20],
 ["Amoxicilina suspensão 250", "Amoxicilina suspensão 400 mg/5 mL",80,100],
 ["Cefalexina suspensão 250", "Cefalexina suspensão 125 mg/5 mL",25,100],
 ["Prednisolona solução 3", "Prednisolona solução 1 mg/mL",1,100],
 ["Dipirona 500 mg comprimido", "Dipirona 1 g comprimido",1000,0],
 ["Ibuprofeno 600 mg", "Ibuprofeno 400 mg comprimido",400,0]
];
variants.forEach(([key,n,c,vol])=>{const base=RX.find(x=>x.n.startsWith(key));const v={...base,n,c,vol};if(v.kind==='t')v.d=c;RX.push(v)});
// Catálogo manual: nenhuma posologia é presumida para indicação não informada.
const manual=[
 ["Losartana 50 mg comprimido","Cardiovascular"],
 ["Anlodipino 5 mg comprimido","Cardiovascular"],
 ["Enalapril 10 mg comprimido","Cardiovascular"],
 ["Espironolactona 25 mg comprimido","Cardiovascular"],
 ["Metformina 500 mg comprimido","Diabetes"],
 ["Pantoprazol 40 mg comprimido","Gastrointestinal"],
 ["Doxiciclina 100 mg comprimido","Antimicrobianos"],
 ["Fluconazol 150 mg cápsula","Antimicrobianos"],
 ["Cetoconazol 20 mg/g creme","Dermatologia","TÓPICO"],
 ["Miconazol 20 mg/g creme","Dermatologia","TÓPICO"],
 ["Clotrimazol 10 mg/g creme","Dermatologia","TÓPICO"],
 ["Mupirocina 20 mg/g pomada","Dermatologia","TÓPICO"],
 ["Hidrocortisona 10 mg/g creme","Dermatologia","TÓPICO"],
 ["Dexpantenol 50 mg/g pomada","Dermatologia","TÓPICO"],
 ["Cetirizina 10 mg comprimido","Alergia"],
 ["Fexofenadina 120 mg comprimido","Alergia"],
 ["Budesonida 32 mcg/dose spray nasal","Respiratório","NASAL"],
 ["Beclometasona 50 mcg/dose aerossol","Respiratório","INALATÓRIO"],
 ["Polietilenoglicol 3350 pó oral","Gastrointestinal"],
 ["Lactulose 667 mg/mL solução oral","Gastrointestinal"]
];
manual.forEach(([n,cat,rt])=>RX.push(X(n,'a','x',0,{manual:1,cat,rt:rt||'ORAL',tx:'',q:''})));
// Catálogo psiquiátrico adulto: apresentação e via explícitas, esquema individualizado.
const RX_PSY = [{"n": "Risperidona 1 mg comprimido", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Risperdal Risperidon psicose mania", "rt": "ORAL", "note": "Individualizar dose e titulação conforme indicação e tratamento prévio. Não calcular automaticamente somente pelo peso.", "source": "https://www.cristalia.com.br/produto/371/bula-profissional"}, {"n": "Risperidona 2 mg comprimido", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Risperdal Risperidon psicose mania", "rt": "ORAL", "note": "Individualizar dose e titulação conforme indicação e tratamento prévio. Não calcular automaticamente somente pelo peso.", "source": "https://www.cristalia.com.br/produto/371/bula-profissional"}, {"n": "Risperidona 3 mg comprimido", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Risperdal Risperidon psicose mania", "rt": "ORAL", "note": "Individualizar dose e titulação conforme indicação e tratamento prévio. Não calcular automaticamente somente pelo peso.", "source": "https://www.cristalia.com.br/produto/371/bula-profissional"}, {"n": "Risperidona solução oral 1 mg/mL", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Risperdal Risperidon psicose mania", "rt": "ORAL", "note": "Medir em mL com seringa dosadora. Não presumir equivalência em gotas.", "source": "https://www.cristalia.com.br/produto/371/bula-profissional"}, {"n": "Haloperidol 1 mg comprimido", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Haldol Halo agitação psicose", "rt": "ORAL", "note": "Avaliar QT, interações, sintomas extrapiramidais e contraindicações.", "source": "https://www.cristalia.com.br/produto/195/bula-profissional"}, {"n": "Haloperidol 5 mg comprimido", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Haldol Halo agitação psicose", "rt": "ORAL", "note": "Avaliar QT, interações, sintomas extrapiramidais e contraindicações.", "source": "https://www.cristalia.com.br/produto/195/bula-profissional"}, {"n": "Haloperidol gotas 2 mg/mL", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Haldol Halo psicose", "rt": "ORAL", "note": "Conferir o fator gotas/mL da apresentação dispensada; não converter automaticamente em gotas.", "source": "https://www.cristalia.com.br/produto/195/bula-profissional"}, {"n": "Haloperidol injetável 5 mg/mL — ampola 1 mL", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Haldol Halo agitação ação imediata", "rt": "INTRAMUSCULAR", "note": "Ação imediata, diferente do decanoato. Uso em serviço de saúde; monitorar consciência, sinais vitais, QT e efeitos extrapiramidais.", "source": "https://www.cristalia.com.br/produtos?L=h"}, {"n": "Decanoato de haloperidol 50 mg/mL — ampola 1 mL (Haldol Decanoato)", "cat": "Psiquiatria · Depósito / manutenção", "aliases": "Halo depot Haldol decanoato", "rt": "INTRAMUSCULAR", "note": "DEPÓSITO: manutenção de paciente previamente estabilizado; não é medicação de resgate para agitação aguda. Confirmar esquema anterior, última aplicação, dose e intervalo. Somente IM profunda; nunca IV. Aplicação por profissional de saúde.", "source": "https://www.cristalia.com.br/produto/321/bula-profissional"}, {"n": "Clorpromazina 25 mg comprimido", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Amplictil Longactil psicose agitação", "rt": "ORAL", "note": "Risco de hipotensão, sedação, prolongamento do QT e efeitos anticolinérgicos.", "source": "https://www.cristalia.com.br/produto/322/bula-paciente"}, {"n": "Clorpromazina 100 mg comprimido", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Amplictil Longactil psicose agitação", "rt": "ORAL", "note": "Risco de hipotensão, sedação, prolongamento do QT e efeitos anticolinérgicos.", "source": "https://www.cristalia.com.br/produto/322/bula-paciente"}, {"n": "Clorpromazina injetável 5 mg/mL — ampola 5 mL (25 mg)", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Amplictil Longactil agitação", "rt": "INTRAMUSCULAR", "note": "Uso em serviço de saúde. Monitorar pressão arterial e sedação; risco importante de hipotensão.", "source": "https://www.cristalia.com.br/produtos?L=l&busca=&categorias=&page=2"}, {"n": "Olanzapina 5 mg comprimido", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Zyprexa psicose mania", "rt": "ORAL", "note": "Apresentação oral. Individualizar dose; avaliar sedação e riscos metabólicos.", "source": "https://www.cristalia.com.br/produto/75/bula-profissional"}, {"n": "Olanzapina 10 mg comprimido", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Zyprexa psicose mania", "rt": "ORAL", "note": "Apresentação oral. Individualizar dose; avaliar sedação e riscos metabólicos.", "source": "https://www.cristalia.com.br/produto/75/bula-profissional"}, {"n": "Quetiapina 25 mg comprimido de liberação imediata", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Seroquel Quetipin psicose mania", "rt": "ORAL", "note": "Liberação imediata: não intercambiar automaticamente com liberação prolongada. Individualizar titulação; avaliar hipotensão e sedação.", "source": "https://www.cristalia.com.br/produto/149/bula-profissional"}, {"n": "Quetiapina 100 mg comprimido de liberação imediata", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Seroquel Quetipin psicose mania", "rt": "ORAL", "note": "Liberação imediata: não intercambiar automaticamente com liberação prolongada. Individualizar titulação; avaliar hipotensão e sedação.", "source": "https://www.cristalia.com.br/produto/149/bula-profissional"}, {"n": "Quetiapina 200 mg comprimido de liberação imediata", "cat": "Psiquiatria · Antipsicóticos", "aliases": "Seroquel Quetipin psicose mania", "rt": "ORAL", "note": "Liberação imediata: não intercambiar automaticamente com liberação prolongada. Individualizar titulação; avaliar hipotensão e sedação.", "source": "https://www.cristalia.com.br/produto/149/bula-profissional"}, {"n": "Clonazepam 0,5 mg comprimido", "cat": "Psiquiatria · Benzodiazepínicos", "aliases": "Rivotril Clopam ansiedade", "rt": "ORAL", "note": "Risco de sedação e dependência; associação com álcool, opioides e outros sedativos aumenta risco respiratório.", "source": "https://www.cristalia.com.br/produto/190/bula-profissional"}, {"n": "Clonazepam 2 mg comprimido", "cat": "Psiquiatria · Benzodiazepínicos", "aliases": "Rivotril Clopam ansiedade", "rt": "ORAL", "note": "Risco de sedação e dependência; associação com álcool, opioides e outros sedativos aumenta risco respiratório.", "source": "https://www.cristalia.com.br/produto/190/bula-profissional"}, {"n": "Clonazepam gotas 2,5 mg/mL", "cat": "Psiquiatria · Benzodiazepínicos", "aliases": "Rivotril Clopam ansiedade", "rt": "ORAL", "note": "Conferir fator gotas/mL na bula do produto. Risco de sedação e depressão respiratória em associações.", "source": "https://www.cristalia.com.br/produto/190/bula-profissional"}, {"n": "Diazepam 5 mg comprimido", "cat": "Psiquiatria · Benzodiazepínicos", "aliases": "Valium Compaz abstinência ansiedade", "rt": "ORAL", "note": "Individualizar conforme indicação; avaliar intoxicação por depressores do SNC, função respiratória e risco de quedas.", "source": "https://www.cristalia.com.br/produto/208/bula-profissional"}, {"n": "Diazepam 10 mg comprimido", "cat": "Psiquiatria · Benzodiazepínicos", "aliases": "Valium Compaz abstinência ansiedade", "rt": "ORAL", "note": "Individualizar conforme indicação; avaliar intoxicação por depressores do SNC, função respiratória e risco de quedas.", "source": "https://www.cristalia.com.br/produto/208/bula-profissional"}, {"n": "Diazepam injetável 5 mg/mL — ampola 2 mL (10 mg)", "cat": "Psiquiatria · Benzodiazepínicos", "aliases": "Valium Compaz abstinência convulsão", "rt": "INTRAVENOSO", "note": "Uso em ambiente monitorizado, administração IV lenta conforme bula/protocolo. Especificar dose, velocidade e critérios de reavaliação. Risco de depressão respiratória.", "source": "https://www.cristalia.com.br/produto/208/bula-profissional"}, {"n": "Biperideno 2 mg comprimido", "cat": "Psiquiatria · Adjuvantes", "aliases": "Akineton Cinetol extrapiramidal distonia", "rt": "ORAL", "note": "Não é sedativo de rotina. Avaliar indicação para efeitos extrapiramidais e contraindicações anticolinérgicas.", "source": "https://www.gov.br/saude/pt-br/composicao/sectics/rename/rename-2017.pdf"}, {"n": "Biperideno injetável 5 mg/mL — ampola 1 mL", "cat": "Psiquiatria · Adjuvantes", "aliases": "Akineton Cinetol extrapiramidal distonia", "rt": "INTRAMUSCULAR", "note": "Para indicação específica, como distonia aguda; não associar automaticamente a todo antipsicótico. Conferir bula e reavaliar resposta.", "source": "https://www.cristalia.com.br/produtos?L=c"}, {"n": "Prometazina injetável 25 mg/mL — ampola 2 mL (50 mg)", "cat": "Psiquiatria · Adjuvantes", "aliases": "Fenergan agitação", "rt": "INTRAMUSCULAR", "note": "Somente IM profunda neste modelo. Uso em serviço de saúde; risco de sedação, hipotensão e efeitos anticolinérgicos. Não usar por via intra-arterial ou subcutânea.", "source": "https://linhasdecuidado.saude.gov.br/portal/depressao/servico-de-atendimento-movel/manejo-inicial/"}];
RX_PSY.forEach(x=>RX.push(X(x.n,'a','x',0,{...x,manual:1,psy:1,tx:'',q:'',note:x.note+' Preencher dose, intervalo, duração e quantidade. Conferir o receituário exigido para a dispensação.'})));
RX.filter(x=>x.n==='Prometazina 25 mg comprimido').forEach(x=>Object.assign(x,{cat:'Psiquiatria · Adjuvantes',aliases:'Fenergan',note:'Individualizar indicação; avaliar sedação, hipotensão e efeitos anticolinérgicos.'}));
const rxNorm=v=>String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/(\d),(\d)/g,'$1.$2').replace(/\s+/g,'');
function rxCategory(x){return x.cat||(/escabiose|pediculose|ivermectina|albendazol|nitazoxanida/i.test(x.n)?'Parasitoses':/creme|pomada|geleia/i.test(x.n)?'Dermatologia':/amoxicilina|azitromicina|cefalexina|ciprofloxacino|clindamicina|nitrofurantoina|metronidazol|sulfametoxazol|aciclovir/i.test(rxNorm(x.n))?'Antimicrobianos':/dipirona|paracetamol|ibuprofeno|diclofenaco|tramadol/i.test(x.n)?'Dor e febre':'Outros')}
const RX_SOURCES={dipirona:'https://www.geolab.com.br/wp-content/uploads/2021/05/Dipirona-Mono-50mg-Profissional.pdf',escabiose:'https://www.cdc.gov/scabies/hcp/clinical-care/index.html'};
// Evita duas opções de ivermectina com instruções conflitantes.
const oldIverm=RX.find(x=>x.n==='Ivermectina 6 mg comprimido');
Object.assign(oldIverm,{hidden:1});
RX.filter(x=>x.n.includes('Permetrina 5%')).forEach(x=>{x.minAge=2;x.note='A partir de 2 meses. Em crianças pequenas, avaliar aplicação também em couro cabeludo e pescoço, evitando olhos e mucosas. Tratar contatos simultaneamente e higienizar roupas e roupa de cama.'});
function rxCheck(x,w){
 if((x.k||x.t)&&(!Number.isFinite(w)||w<=0))return 'Informe um peso válido.';
 if(!Number.isFinite(w)||w<=0||w>250)return 'Informe um peso válido entre 0 e 250 kg.';
 if(x.minW&&w<x.minW)return 'Peso mínimo para este modelo: '+x.minW+' kg.';
 if(x.dropBands&&w>53)return 'Fora da tabela pediátrica por peso (5–53 kg); individualizar esquema.';
 if(x.volumeBands&&w>53)return 'Fora da tabela pediátrica por peso (5–53 kg); individualizar esquema.';
 if(x.iverm&&S.rxgest!==false)return 'Confirme ausência de gestação para usar este modelo de ivermectina.';
 return '';
}
function rxItem(it){const x=RX[it.i],problem=rxCheck(x,S['w'+S.rp]);if(problem)return {nm:x.n,rt:x.rt||'ORAL',q:'PENDENTE',tx:problem};const c=rxCalc(x,S['w'+S.rp],it.d);return {...c,...it.edit}}
function rxReady(){if(!S.rxs.length){alert('Adicione ao menos um medicamento.');return false}for(const it of S.rxs){const x=RX[it.i],error=rxCheck(x,S['w'+S.rp]);if(error){alert(x.n+': '+error);return false}const c=rxItem(it);if(!c.tx.trim()||!c.q.trim()){alert('Preencha posologia e quantidade de '+x.n);return false}}return true}
const RXD={ff:"Arial",fs:12,bn:1,ni:0,bp:0,ip:0,cm:14.8,cl:60,hdr:"",dr:"Dr(a). ______________________  CRM ________"};
let RXS=Object.assign({},RXD);try{Object.assign(RXS,JSON.parse(localStorage.getItem("psrx")||"{}"))}catch(e){}
const rxSave=()=>{try{localStorage.setItem("psrx",JSON.stringify(RXS))}catch(e){}};
function rxCalc(x,w,dy){
if(x.kind==="x")return{nm:x.n,tx:x.tx||"",q:x.q||"",rt:x.rt||"ORAL"};
if(x.iverm){const u=w<=24?.5:w<=35?1:w<=50?1.5:w<=65?2:w<=79?2.5:Math.round(w*.2/6*2)/2;return {nm:x.n,rt:"ORAL",q:`${Math.ceil(u*2)} comprimidos`,tx:`Tomar ${f(u)} comprimido(s) por via oral, com alimento, em dose única. Repetir a mesma dose após 7 dias. Esquema para escabiose clássica. Tratar os contatos simultaneamente e higienizar roupas e roupa de cama.`}}if(x.kind=="x")return{nm:x.n,tx:x.tx,q:x.q,rt:x.rt||"ORAL"};
let mg=x.k?x.k*w:x.t?x.t.find(r=>w<=r[0])[1]:x.d;if(x.mx&&mg>x.mx)mg=x.mx;
const nd=24/x.fr*(x.one?1:dy),fq=x.fr==24?"1 vez ao dia":"de "+x.fr+"/"+x.fr+" horas";let dose,q;
if(x.kind==="l"&&x.dropBands){const band=x.dropBands.find(b=>Math.round(w)<=b[0]);if(!band||w<5)return{nm:x.n,rt:'ORAL',q:'PENDENTE',tx:'Fora da tabela pediátrica do fabricante; conferir bula.'};const gotas=band[1];const ml=gotas/x.gt;dose=`${gotas} gotas (${f(gotas*x.c/x.gt)} mg; ${f(ml)} mL; faixa ${band[1]}–${band[2]} gotas)`;q=`${Math.ceil(ml*nd/x.vol)} frasco(s) de ${x.vol} mL`}
else if(x.kind==="l" && x.gt){const gotas=Math.max(1,Math.min(x.maxDrops||Infinity,Math.round(mg/x.c*x.gt))),ml=gotas/x.gt;dose=`${gotas} gotas (${f(gotas*x.c/x.gt)} mg; ${f(ml)} mL)`;const n=Math.ceil(ml*nd/x.vol);q=`${n} frasco${n>1?"s":""} de ${x.vol} mL`}
else if(x.kind==="l"&&x.volumeBands){const band=x.volumeBands.find(b=>Math.round(w)<=b[0]);if(!band||w<5)return{nm:x.n,rt:'ORAL',q:'PENDENTE',tx:'Fora da faixa pediátrica da bula, reavaliar.'};const ml=band[1];dose=`${f(ml)} mL (${f(ml*x.c)} mg; faixa ${f(band[1])}–${f(band[2])} mL)`;q=`${Math.ceil(ml*nd/x.vol)} frasco(s) de ${x.vol} mL`}
else if(x.kind=="l"){let ml=mg/x.c;ml=ml<10?Math.round(ml*10)/10:Math.round(ml*2)/2;mg=ml*x.c;dose=`${f(ml)} mL (${f(mg)} mg)`+(x.gt?` = ${Math.round(ml*x.gt)} gotas`:"");const n=Math.ceil(ml*nd/x.vol);q=`${n} frasco${n>1?"s":""} de ${x.vol} mL`}
else{const u=Math.max(.5,Math.round(mg/x.c*2)/2),wd=x.n.includes("cápsula")?"cápsula":"comprimido",tt=Math.ceil(u*nd);dose=`${f(u)} ${wd}${u>1?"s":""}`;q=`${tt} ${wd}${tt>1?"s":""}`}
const dur=x.one?"em dose única":`por ${dy} ${dy>1?"dias":"dia"}`;
return{nm:x.n,q,rt:"ORAL",tx:`Tomar ${dose} por via oral${x.jej?", em jejum":""}${x.al?", "+x.al:""}, ${x.one?"":fq+(x.prn?", se necessário":"")+", "}${dur}.`}}
const rxGroups=()=>{const w=S["w"+S.rp],G={};S.rxs.forEach(it=>{const c=rxItem(it);(G[c.rt]=G[c.rt]||[]).push(c)});return["ORAL","INALATÓRIO","NASAL","TÓPICO","VAGINAL","OFTÁLMICO","OTOLÓGICO","RETAL","INTRAMUSCULAR","INTRAVENOSO"].filter(k=>G[k]).map(k=>({rt:k,items:G[k]}))};
const rxWrap=(s,n,ind)=>{const o=[];let l="";s.split(" ").forEach(w=>{if((l+" "+w).trim().length>n-ind.length&&l){o.push(ind+l);l=w}else l=(l+" "+w).trim()});if(l)o.push(ind+l);return o};
function rxText(){const w=S["w"+S.rp],n=RXS.cl,L=[];if(RXS.hdr)L.push(...rxWrap(RXS.hdr,n,""));L.push("RECEITUÁRIO","Paciente: "+(S.rxn||"______________")+"  Peso: "+f(w)+" kg  Data: "+new Date().toLocaleDateString("pt-BR"),"");let k=0;
rxGroups().forEach(g=>{L.push("USO "+g.rt);g.items.forEach(c=>{L.push(...rxWrap(++k+") "+c.nm+" - "+c.q,n,""));L.push(...rxWrap(c.tx,n,"   "),"")})});L.push("",RXS.dr);return L.join("\n")}
function rxPaper(){const w=S["w"+S.rp],b=v=>v?"font-weight:700":"font-weight:400",i=v=>v?"font-style:italic":"font-style:normal";let k=0;
const body=rxGroups().map(g=>`<div style="margin-top:10px;font-weight:700">USO ${g.rt}</div>`+g.items.map(c=>`<div style="margin-top:8px"><div style="display:flex;justify-content:space-between;gap:10px;${b(RXS.bn)};${i(RXS.ni)}"><span>${++k}) ${esc(c.nm)}</span><span style="white-space:nowrap">${esc(c.q)}</span></div><div style="margin-left:14px;${b(RXS.bp)};${i(RXS.ip)}">${esc(c.tx)}</div></div>`).join("")).join("")||'<p style="color:#777">Adicione medicamentos acima.</p>';
$("#rxw").innerHTML=`<div id="rxp" style="width:${RXS.cm}cm;font-family:'${RXS.ff}',sans-serif;font-size:${RXS.fs}px">${RXS.hdr?`<div style="text-align:center;font-weight:700">${esc(RXS.hdr)}</div>`:""}<div style="text-align:center;font-weight:700;letter-spacing:.08em;margin:6px 0">RECEITUÁRIO</div><div>Paciente: <b>${esc(S.rxn)||"______________"}</b> &nbsp; Peso: ${f(w)} kg &nbsp; Data: ${new Date().toLocaleDateString("pt-BR")}</div><hr>${body}<div style="margin-top:34px">${esc(RXS.dr)}</div></div>`}
function render(){$("#ttl").textContent=T[S.v];const accountLink=$('#drawer [data-v="conta"]');if(accountLink)accountLink.textContent=AU.u?"Minha conta":"Entrar / criar conta";const fr=!!(window.CFG&&CFG.freeAccess);if(GATE.has(S.v)&&!AU.prem&&!fr){document.querySelectorAll("#drawer a").forEach(a=>a.classList.toggle("on",a.dataset.v==S.v));return paywall()}document.querySelectorAll("#drawer a").forEach(a=>a.classList.toggle("on",a.dataset.v==S.v));
({pcr:pcrPage,workspace:personalPage,wounds:woundsPage,news:newsPage,primarycare:primaryCarePage,apac:apacPage,emergencies:emergenciesPage,documents:documentsPage,obstetrics:()=>obstetricsPage(),protocols:protocolsPage,home,a:()=>list("a"),p:()=>list("p"),clinical:clinicalCalculators,vent:ventilation,admin:adminPanel,contribute,vaso,proc,trombo,conta,about})[S.v]();if(typeof PCR!=="undefined")PCR.navigation()}
document.querySelectorAll("#drawer a").forEach(a=>a.onclick=()=>openMain(a.dataset.v));
{const ab=document.querySelector(".app-brand");if(ab)ab.onclick=()=>go("home")}$("#mb").onclick=()=>{$("#drawer").classList.add("open");$("#shade").classList.add("open")};
$("#shade").onclick=()=>{$("#drawer").classList.remove("open");$("#shade").classList.remove("open")};
load();
