/* Dose PS — navegação hierárquica de Emergências. Preserva os fluxos anteriores.
 * Temas sem protocolo revisado são listados para planejamento, sem posologia.
 */
const EH_CATEGORIES=[
  {id:'cardio',name:'Cardiovasculares',icon:'♥',subtitle:'Pressão arterial, perfusão e ritmo',topics:[
    ['hypertension','Emergências hipertensivas','PA grave, lesão de órgão-alvo e metas por situação','ready','hypertension'],
    ['acs','Síndrome coronariana aguda','Com e sem supradesnivelamento do ST','planned'],
    ['arrhythmias','Arritmias','Taquiarritmias e bradiarritmias','ready'],
    ['cpr','Parada cardiorrespiratória','Algoritmos de RCP por ritmo e peso','linked','proc:RCP'],
    ['pulmonary-edema','Edema agudo de pulmão hipertensivo','Abordagem pressórica na congestão pulmonar','partial','hypertension:eap'],
    ['aortic-dissection','Dissecção de aorta','Metas de PA, FC e anti-impulso','partial','hypertension:aorta'],
    ['cardiogenic-shock','Choque cardiogênico','Perfusão e necessidade de suporte circulatório','planned']
  ]},
  {id:'resp',name:'Respiratórias',icon:'◌',subtitle:'Ventilação e vias aéreas',topics:[
    ['asthma','Asma grave','Crise grave e risco de falência respiratória','ready'],
    ['copd','Exacerbação de DPOC','Broncodilatação, oxigenação e VNI','ready'],
    ['resp-failure','Insuficiência respiratória','Oxigenação, VNI e suporte ventilatório','planned'],
    ['tension-pneumo','Pneumotórax hipertensivo','Reconhecimento e descompressão','planned'],
    ['pulmonary-embolism','Tromboembolismo pulmonar','Estratificação de gravidade e reperfusão','planned'],
    ['upper-airway','Obstrução de vias aéreas','Abordagem da via aérea crítica','planned']
  ]},
  {id:'neuro',name:'Neurológicas',icon:'✳',subtitle:'AVC, consciência e convulsões',topics:[
    ['ischemic-stroke','AVC isquêmico','Avaliação neurológica e janela terapêutica','ready'],
    ['hemorrhagic-stroke','AVC hemorrágico','Suporte, neuroimagem e controle fisiológico','ready'],
    ['seizure','Crise convulsiva','Benzodiazepínico e causas reversíveis','ready','legacy:seizure'],
    ['status-epilepticus','Estado de mal epiléptico','Fluxo com escalonamento e doses por peso','linked','legacy:seizure'],
    ['intracranial-ht','Hipertensão intracraniana','Sinais de herniação e medidas iniciais','planned'],
    ['coma','Rebaixamento da consciência','ABCDE e causas reversíveis','planned']
  ]},
  {id:'metabolic',name:'Metabólicas e endócrinas',icon:'⚗',subtitle:'Glicemia e distúrbios eletrolíticos',topics:[
    ['hypoglycemia','Hipoglicemia','Glicose oral/IV e glucagon conforme peso','ready','legacy:hypoglycemia'],
    ['dka','Cetoacidose diabética','Hidratação, potássio e insulina','planned'],
    ['hhs','Estado hiperosmolar','Reposição e monitorização metabólica','planned'],
    ['hyperkalemia','Hipercalemia','Proteção cardíaca e remoção de potássio','linked','protocol:hyperk'],
    ['hypokalemia','Hipocalemia','Reposição e monitorização','linked','protocol:hypok'],
    ['sodium','Distúrbios do sódio','Hipo/hipernatremia','linked','protocol:hypona']
  ]},
  {id:'infectious',name:'Infecciosas e choque',icon:'✚',subtitle:'Sepse, meningite e choque',topics:[
    ['sepsis','Sepse e choque séptico','Reconhecimento e ressuscitação','planned'],
    ['meningitis','Meningite bacteriana','Reconhecimento e tratamento inicial','planned'],
    ['hypovolemic-shock','Choque hipovolêmico','Perfusão e controle da causa','planned'],
    ['obstructive-shock','Choque obstrutivo','Causas rapidamente reversíveis','planned'],
    ['neutropenia','Neutropenia febril','Risco infeccioso em paciente imunossuprimido','planned']
  ]},
  {id:'gi',name:'Gastrointestinais',icon:'≋',subtitle:'Hemorragias e abdome agudo',topics:[
    ['upper-gi-bleed','Hemorragia digestiva alta','Ressuscitação e endoscopia','planned'],
    ['lower-gi-bleed','Hemorragia digestiva baixa','Estabilização e investigação','planned'],
    ['pancreatitis','Pancreatite aguda grave','Estratificação e suporte','planned'],
    ['acute-abdomen','Abdome agudo','Reconhecimento de gravidade e avaliação cirúrgica','planned']
  ]},
  {id:'obstetric',name:'Obstétricas',icon:'✿',subtitle:'Emergências maternas',topics:[
    ['preeclampsia','Pré-eclâmpsia grave','Crise hipertensiva na gestação','ready'],
    ['eclampsia','Eclâmpsia','Convulsão em gestante/puérpera','ready'],
    ['hellp','Síndrome HELLP','Hemólise, enzimas hepáticas e plaquetas','planned'],
    ['postpartum-bleeding','Hemorragia pós-parto','Controle de sangramento e choque','planned'],
    ['maternal-sepsis','Sepse materna','Reconhecimento e manejo inicial','planned']
  ]},
  {id:'pediatric',name:'Pediátricas',icon:'★',subtitle:'Condições específicas da criança',topics:[
    ['bronchiolitis','Bronquiolite grave','Insuficiência respiratória do lactente','ready'],
    ['croup','Crupe','Estridor e obstrução de via aérea','ready'],
    ['pediatric-shock','Choque pediátrico','Perfusão e suporte inicial','planned'],
    ['dehydration','Desidratação grave','Reposição e reavaliação','planned'],
    ['febrile-seizure','Convulsão febril','Avaliação e diferenciais','planned']
  ]},
  {id:'trauma',name:'Trauma e queimaduras',icon:'⚑',subtitle:'Lesões graves e ressuscitação',topics:[
    ['tbi','Traumatismo cranioencefálico','ABCDE e lesão intracraniana','planned'],
    ['trauma-bleed','Choque hemorrágico traumático','Controle de hemorragia','planned'],
    ['chest-trauma','Trauma torácico','Lesões que ameaçam a vida','planned'],
    ['thermal-burn','Queimaduras térmicas','Avaliação e ressuscitação','planned'],
    ['electric-burn','Queimaduras elétricas','Risco cardíaco e lesão profunda','planned']
  ]},
  {id:'tox',name:'Intoxicações e alergias',icon:'⚕',subtitle:'Antídotos e hipersensibilidade grave',topics:[
    ['anaphylaxis','Anafilaxia','Adrenalina IM e suporte circulatório','ready','legacy:anaphylaxis'],
    ['opioids','Intoxicação por opioides','Depressão respiratória e antídoto','planned'],
    ['organophosphate','Intoxicação por organofosforados','Síndrome colinérgica','planned'],
    ['tca','Intoxicação por antidepressivos tricíclicos','Toxicidade cardiovascular','planned']
  ]}
];
const EH_TOPICS=EH_CATEGORIES.flatMap(c=>c.topics.map(t=>({id:t[0],title:t[1],summary:t[2],status:t[3],route:t[4]||'',categoryId:c.id,category:c.name})));
const ehState={category:'',q:'',topic:'',scenario:'general',weight:''};
const ehNorm=text=>String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const ehStatusText={ready:'Fluxo disponível',linked:'Abrir módulo existente',partial:'Abordagem parcial',planned:'Em preparação'};
const ehCategoryById=id=>EH_CATEGORIES.find(c=>c.id===id);
const ehTopicById=id=>EH_TOPICS.find(t=>t.id===id);
function ehOpenTopic(id){
 const t=ehTopicById(id);if(!t)return;
 // Não reutilizar o peso de um adulto na calculadora pediátrica ou vice-versa.
 if(typeof B3_PROTOCOLS!=='undefined'&&B3_PROTOCOLS[id]&&typeof b3State!=='undefined'&&ehState.topic!==id){b3State.weight='';b3State.age='';b3State.checked=false;}
 if(t.route.startsWith('legacy:')){ehState.topic='';emergencyState.id=t.route.split(':')[1];emergenciesPage();scrollTo(0,0);return}
 if(t.route.startsWith('protocol:')){protocolState.id=t.route.split(':')[1];protocolState.tool='';go('protocols');return}
 if(t.route.startsWith('proc:')){go('proc');S.pt=t.route.split(':')[1];S.g='a';render();return}
 ehState.topic=id;
 if(t.route.startsWith('hypertension'))ehState.scenario=t.route.split(':')[1]||'general';
 emergenciesPage();scrollTo(0,0);
}
function ehBack(){ehState.topic='';emergenciesPage();scrollTo(0,0)}
function ehTile(t){return `<button class="eh-topic" data-eh-topic="${t.id}" type="button"><div class="eh-topic-content"><b>${esc(t.title)}</b><small>${esc(t.summary)}</small><span class="eh-status eh-status-${t.status}">${ehStatusText[t.status]}</span></div><span aria-hidden="true" class="eh-chevron">›</span></button>`}
function ehBindTopics(){document.querySelectorAll('[data-eh-topic]').forEach(b=>b.onclick=()=>ehOpenTopic(b.dataset.ehTopic))}
function ehRenderListings(){
 const dest=$('#eh-listing');if(!dest)return;
 const q=ehNorm(ehState.q.trim());
 if(q){const matching=EH_TOPICS.filter(t=>ehNorm(t.title+' '+t.summary+' '+t.category+' '+t.id).includes(q));dest.innerHTML=`<div class="eh-list-header"><h3>Resultados da busca</h3><span>${matching.length} resultado(s)</span></div>${matching.map(t=>ehTile(t)).join('')||'<p class="card">Nenhuma emergência encontrada. Tente outro termo.</p>'}`;ehBindTopics();return}
 const cat=ehCategoryById(ehState.category);
 if(cat){const topics=EH_TOPICS.filter(t=>t.categoryId===cat.id);dest.innerHTML=`<button class="chip eh-back" id="eh-cats-back" type="button">← Todas as categorias</button><div class="eh-current-category"><div class="eh-icon">${cat.icon}</div><div><h2>${esc(cat.name)}</h2><p>${esc(cat.subtitle)}</p></div></div><div class="eh-list-header"><h3>Condutas e fluxos</h3><span>${topics.length} tópicos</span></div>${topics.map(t=>ehTile(t)).join('')}`;$('#eh-cats-back').onclick=()=>{ehState.category='';ehRenderListings();scrollTo(0,0)};ehBindTopics();return}
 dest.innerHTML=`<div class="eh-list-header"><h3>Selecione uma categoria</h3><span>${EH_CATEGORIES.length} categorias</span></div><div class="eh-category-grid">${EH_CATEGORIES.map(c=>{const n=c.topics.filter(t=>t[3]!=='planned').length;return `<button type="button" class="eh-category" data-eh-cat="${c.id}"><span class="eh-icon">${c.icon}</span><span class="eh-category-copy"><b>${esc(c.name)}</b><small>${esc(c.subtitle)}</small><small>${c.topics.length} temas${n?' · '+n+' com acesso':''}</small></span><span class="eh-chevron" aria-hidden="true">›</span></button>`}).join('')}</div><div class="eh-footer card"><b>Como usar</b><p>Abra uma categoria ou digite uma emergência na busca. Os fluxos disponíveis incluem doses e condutas. Os demais temas estão listados para expansão e são identificados como “Em preparação”.</p></div>`;
 document.querySelectorAll('[data-eh-cat]').forEach(b=>b.onclick=()=>{ehState.category=b.dataset.ehCat;ehRenderListings();scrollTo(0,0)});
}
function ehRenderHub(){
 app.innerHTML=`<section class="eh-header"><div class="eh-header-text"><span class="eh-overline">Dose PS · Pronto-socorro</span><h2>Emergências</h2><p>Condutas organizadas por especialidade, com busca rápida.</p></div><span class="eh-hero-symbol" aria-hidden="true">✚</span></section><section class="card eh-search-card"><label for="eh-search"><b>Buscar emergência</b></label><div class="eh-search-input"><span aria-hidden="true">⌕</span><input id="eh-search" type="search" value="${esc(ehState.q)}" placeholder="Ex.: hipertensão, convulsão, potássio…" autocomplete="off"><button type="button" class="chip" id="eh-clear">Limpar</button></div><p class="mute">A busca funciona em todas as categorias e ignora acentos e diferenças entre maiúsculas e minúsculas.</p></section><div id="eh-listing" aria-live="polite"></div>`;
 $('#eh-search').oninput=e=>{ehState.q=e.target.value;ehRenderListings()};
 $('#eh-clear').onclick=()=>{ehState.q='';$('#eh-search').value='';ehRenderListings();$('#eh-search').focus()};
 ehRenderListings();
}
const EH_HYP_SCENARIOS={
 general:{label:'Emergência hipertensiva geral',name:'Com lesão aguda de órgão-alvo (sem condição especial)',steps:[
  ['Reconhecer e estabilizar','Confirmar PA e procurar lesão aguda de órgão-alvo: sintomas neurológicos, edema pulmonar, dor torácica, redução da perfusão e lesão renal aguda. ABCDE, monitorização contínua, ECG e exames dirigidos.'],
  ['Meta de redução controlada','Sem uma condição que exija meta própria: reduzir a PAS em até 25% na primeira hora; se estável, buscar abaixo de 160/100 mmHg nas próximas 2–6 horas e progredir cautelosamente nas 24–48 horas seguintes. Não normalizar rapidamente.'],
  ['Tratamento e monitorização','Ambiente com monitorização de PA e perfusão, idealmente UTI. Escolher agente IV titulável conforme órgão afetado, contraindicações, recursos locais e protocolo institucional.'],
  ['Destino','Internação/transferência para unidade monitorizada; documentar tendência pressórica e resposta clínica.']]
 },
 severe:{label:'Sem lesão aguda',name:'Hipertensão grave sem lesão aguda de órgão-alvo',steps:[
  ['Confirmar o contexto','Repetir a medida com técnica e manguito adequados; avaliar dor, ansiedade, retenção urinária, medicamentos e adesão. Investigar sinais de lesão aguda de órgão-alvo.'],
  ['Evitar redução rápida','Na ausência de lesão aguda, não tratar a PA isolada com anti-hipertensivos intravenosos nem redução brusca apenas pelo número encontrado.'],
  ['Plano de seguimento','Reavaliar tratamento habitual, reinstituir/ajustar terapêutica oral quando indicado e planejar acompanhamento. Internação depende do quadro clínico, não apenas da PA.']]
 },
 eap:{label:'Edema agudo de pulmão',name:'Edema agudo de pulmão associado à hipertensão',steps:[
  ['Suporte respiratório','ABCDE, oximetria e ECG; considerar VNI diante de insuficiência respiratória e sem contraindicações. Investigar isquemia e outras causas de edema.'],
  ['Controle hemodinâmico','Se hipertenso e sem contraindicações, nitroglicerina IV titulada pode ser utilizada; avaliar diurético quando houver congestão/hipervolemia. Evitar nitratos com hipotensão ou uso recente de inibidores de PDE5.'],
  ['Monitorização e destino','Reavaliar PA, perfusão, consciência e resposta respiratória continuamente. Encaminhar para suporte avançado/UTI quando necessário.']]
 },
 aorta:{label:'Dissecção de aorta',name:'Síndrome aórtica aguda / dissecção de aorta',steps:[
  ['Suspeitar e diagnosticar','Dor torácica/dorsal súbita, sinais de malperfusão ou assimetria de pulsos/PA. Acionar equipe vascular/cirúrgica e solicitar imagem adequada, se possível sem atrasar a transferência.'],
  ['Reduzir força de ejeção primeiro','Analgesia e bloqueio beta IV para controle da frequência, se não houver contraindicação. Evitar iniciar vasodilatador isolado antes do controle da frequência cardíaca.'],
  ['Metas específicas','Buscar PAS abaixo de 120 mmHg, ou menor valor que preserve a perfusão de órgãos, e FC de 60–80 bpm. Monitorização invasiva quando disponível.'],
  ['Regulação','Transferência imediata para centro com cirurgia cardiovascular/vascular conforme anatomia e gravidade.']]
 },
 stroke:{label:'AVC / hemorragia cerebral',name:'Hipertensão no AVC agudo',steps:[
  ['Ativar linha de cuidado do AVC','Determinar início dos sintomas, glicemia capilar e exame neurológico; neuroimagem urgente.'],
  ['Não usar meta genérica','As metas de PA dependem de AVC isquêmico versus hemorrágico, reperfusão e outros fatores. Não aplicar automaticamente a redução de 25% da emergência hipertensiva geral.'],
  ['Definir conduta com a equipe','Usar metas específicas do protocolo de AVC e neurologia; monitorizar perfusão cerebral e reavaliação clínica.']]
 },
 pregnancy:{label:'Gestação / puerpério',name:'Hipertensão grave na gestação e no puerpério',steps:[
  ['Emergência obstétrica específica','Avaliar pré-eclâmpsia/eclâmpsia e síndrome HELLP, incluindo sintomas neurológicos, dor epigástrica, plaquetas e função hepatorrenal.'],
  ['Não extrapolar o esquema adulto geral','Utilizar protocolo obstétrico com anti-hipertensivo adequado à gestação e sulfato de magnésio quando indicado. Não usar a calculadora genérica de nitroprussiato como tratamento de rotina.'],
  ['Estabilização e transferência','Acionar obstetrícia e serviço com suporte materno-fetal; documentar PA, sinais neurológicos e medidas já adotadas.']]
 }
};
function ehHypertension(){
 const topic=ehTopicById(ehState.topic),h=EH_HYP_SCENARIOS[ehState.scenario]||EH_HYP_SCENARIOS.general;
 const refs=[['AHA/ACC 2025 — hipertensão grave e emergência hipertensiva','https://www.jacc.org/doi/10.1016/j.jacc.2025.05.007'],['Ministério da Saúde — crise hipertensiva com lesão de órgão-alvo','https://linhasdecuidado.saude.gov.br/portal/hipertensao-arterial-sistemica-%28HAS%29-no-adulto/unidade-hospitalar/crise-hipertensiva/pacientes-com-lesao-de-orgao-alvo'],['ACC/AHA 2022 — síndrome aórtica aguda','https://pmc.ncbi.nlm.nih.gov/articles/PMC9876736/']];
 app.innerHTML=`<button class="chip eh-back" id="eh-topic-back">← ${esc(topic.category)}</button><div class="eh-topic-title"><h2>${esc(topic.title)}</h2><p>Adultos · reconhecimento, metas de PA, tratamento e regulação</p></div><div class="warn"><b>Atenção:</b> PA isolada não define emergência hipertensiva. É necessária avaliação de lesão aguda de órgão-alvo. Não usar uma única meta para AVC, dissecção de aorta ou gestação.</div><section class="card"><h3>1. Identifique a situação</h3><p class="mute">Selecione o cenário clínico para visualizar orientações específicas. A seleção não constitui diagnóstico automático.</p><div class="eh-scenario-grid">${Object.entries(EH_HYP_SCENARIOS).map(([id,x])=>`<button type="button" data-eh-scenario="${id}" class="eh-scenario ${ehState.scenario===id?'selected':''}" aria-pressed="${ehState.scenario===id}">${esc(x.label)}</button>`).join('')}</div></section><section class="card eh-path"><h3>2. ${esc(h.name)}</h3><ol class="eh-steps">${h.steps.map(([title,desc])=>`<li><b>${esc(title)}</b><p>${esc(desc)}</p></li>`).join('')}</ol></section><section class="card"><h3>3. Dose e bomba de infusão</h3><p>Quando houver indicação clínica de infusão titulável, confira o preparo, a concentração, a dose por peso e a vazão na área própria do Dose PS. <b>Não iniciar infusão com base apenas neste resumo.</b></p><button class="btn" id="eh-vaso-link" type="button">Abrir drogas vasoativas e bombas</button><p class="mute">Há esquemas de nitroglicerina e nitroprussiato no módulo de vasoativas. A escolha depende do cenário, contraindicações e disponibilidade.</p></section><section class="card"><h3>Referências e segurança</h3><p class="mute">Fluxo de orientação para adultos, com referência a diretrizes publicadas até 2025. Exige validação clínica institucional antes de uso assistencial.</p>${refs.map(([name,url])=>`<p><a href="${url}" target="_blank" rel="noopener noreferrer">${esc(name)}</a></p>`).join('')}<p class="mute">Os resumos funcionam offline; para abrir as fontes externas é necessária conexão.</p></section>`;
 $('#eh-topic-back').onclick=ehBack;
 document.querySelectorAll('[data-eh-scenario]').forEach(b=>b.onclick=()=>{ehState.scenario=b.dataset.ehScenario;ehHypertension()});
 $('#eh-vaso-link').onclick=()=>{const s=ehState.scenario;infusionState.group='';infusionState.q=(s==='eap'?'Nitroglicerina':'Nitroprussiato');go('vaso')};
}
function ehPlanned(){
 const t=ehTopicById(ehState.topic);
 app.innerHTML=`<button class="chip eh-back" id="eh-topic-back">← ${esc(t.category)}</button><section class="card eh-incomplete"><span class="eh-status eh-status-planned">Em preparação</span><h2>${esc(t.title)}</h2><p>${esc(t.summary)}</p><div class="warn"><b>Protocolo ainda não disponível.</b> Este tema consta no planejamento do Dose PS, mas <b>não contém conduta ou doses revisadas para uso clínico</b>. Até sua publicação, utilizar o protocolo institucional vigente.</div><p class="mute">A estrutura está pronta para receber reconhecimento, estabilização, tratamento, cálculos e critérios de regulação após revisão das referências.</p></section>`;
 $('#eh-topic-back').onclick=ehBack;
}
const ehOriginalEmergenciesPage=emergenciesPage;
emergenciesPage=function(){
 if(emergencyState.id){ehOriginalEmergenciesPage();return}
 if(ehState.topic){if(typeof B3_PROTOCOLS!=='undefined' && B3_PROTOCOLS[ehState.topic] && typeof b3Render==='function'){b3Render();return}const t=ehTopicById(ehState.topic);if(t&&['hypertension','arrhythmias','asthma','copd','dka','hhs','sepsis','hypovolemic-shock'].includes(t.id)&&typeof epRender==='function'){epRender();return}if(t&&(t.route||'').startsWith('hypertension')){ehHypertension();return}ehPlanned();return}
 ehRenderHub();
};
