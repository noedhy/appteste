/* Dose PS - Preencher APAC - geração local de PDF sem envio de dados.
   Modelo A4 em branco obtido da primeira página da APAC fornecida pelo usuário.
   Saída: PDF A4 de página única, com imagem do formulário e dados desenhados pelo navegador. */
(function(){
'use strict';
const blank=()=>({data_solicitacao:today()});
function today(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
let state=blank(),lastPdfUrl=null;
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const field=(id,label,help,placeholder='',opts={})=>{const value=h(state[id]||''); const name='apac_'+id; const extra=opts.max?' maxlength="'+opts.max+'"':'';const type=opts.type||'text';const required=opts.required?' <span class="apac-required" aria-label="obrigatório">* obrigatório</span>':'';
return `<div class="apac-field${opts.required?' apac-obrigatorio':''}"><label for="${name}"><b>${h(label)}</b>${required}</label><div class="apac-help">${h(help)}</div>${opts.multi?`<textarea id="${name}" data-apac="${id}" rows="${opts.rows||4}" placeholder="${h(placeholder)}"${extra}${opts.required?' required aria-required="true"':''}>${value}</textarea>`:`<input id="${name}" data-apac="${id}" type="${type}" ${opts.numeric?'inputmode="numeric"':''} ${opts.autocomplete?'autocomplete="'+opts.autocomplete+'"':'autocomplete="off"'} value="${value}" placeholder="${h(placeholder)}"${extra}${opts.required?' required aria-required="true"':''}>`}</div>`};
const select=(id,label,help,items,opts={})=>`<div class="apac-field${opts.required?' apac-obrigatorio':''}"><label for="apac_${id}"><b>${h(label)}</b>${opts.required?' <span class="apac-required">* obrigatório</span>':''}</label><div class="apac-help">${h(help)}</div><select id="apac_${id}" data-apac="${id}"${opts.required?' required aria-required="true"':''}><option value="">${opts.required?'Selecione o documento (obrigatório)':'Selecione, se aplicável'}</option>${items.map(x=>`<option value="${h(x)}"${state[id]===x?' selected':''}>${h(x)}</option>`).join('')}</select></div>`;
const section=(title,description,content)=>`<section class="card apac-card"><h3>${title}</h3><p class="mute apac-desc">${description}</p><div class="apac-fields">${content}</div></section>`;
const f=(id,label,help,placeholder,opts)=>field(id,label,help,placeholder,opts);
const cod=(id,label,help,placeholder,len,opts={})=>f(id,label,help,placeholder,{...opts,numeric:true,max:len});
/* ===== SIGTAP: tabela oficial carregada pelo usuário (local, sem envio) ===== */
const SIG_KEY='doseps.sigtap.v1';let SIG=null;
const sigNorm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const sigFmt=c=>String(c).replace(/^(\d{2})(\d{2})(\d{2})(\d{3})(\d)$/,'$1.$2.$3.$4-$5');
function sigLoad(){if(SIG)return SIG;try{const r=JSON.parse(localStorage.getItem(SIG_KEY)||'null');if(r&&Array.isArray(r.items)&&r.items.length>100){r.idx=r.items.map(x=>sigNorm(x[1]));SIG=r}}catch(e){}if(!SIG&&window.SIGTAP_BASE&&Array.isArray(SIGTAP_BASE.items)){const b=SIGTAP_BASE;SIG={comp:'',items:b.items,idx:b.items.map(x=>sigNorm(x[1])),base:true,fonte:b.fonte}}return SIG}
function sigReset(){try{localStorage.removeItem(SIG_KEY)}catch(e){}SIG=null;return sigLoad()}
function sigSave(r){r.idx=r.items.map(x=>sigNorm(x[1]));SIG=r;try{localStorage.setItem(SIG_KEY,JSON.stringify({comp:r.comp,items:r.items,at:r.at}));return true}catch(e){return false}}
function sigParse(text){const items=[],seen=new Set();let comp='';for(const line of text.split(/\r?\n/)){const m=line.match(/^(\d{10})(.*)$/);if(!m||seen.has(m[1]))continue;let name=/^[;\t,|]/.test(m[2])?m[2].slice(1).split(/[;\t|]/)[0]:m[2].slice(0,250);name=name.replace(/^"|"$/g,'').trim();if(!name)continue;seen.add(m[1]);items.push([m[1],name]);if(!comp){const c=line.slice(320,326);if(/^20\d{4}$/.test(c))comp=c}}return {items,comp}}
async function sigZipEntry(buf,wanted){const dv=new DataView(buf),u8=new Uint8Array(buf);let e=-1;for(let i=buf.byteLength-22;i>=Math.max(0,buf.byteLength-65557);i--){if(dv.getUint32(i,true)===0x06054b50){e=i;break}}if(e<0)return null;const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);for(let k=0;k<n;k++){if(dv.getUint32(p,true)!==0x02014b50)break;const method=dv.getUint16(p+10,true),csize=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lho=dv.getUint32(p+42,true);const name=new TextDecoder().decode(u8.subarray(p+46,p+46+nl));if(name.split('/').pop().toLowerCase()===wanted){const start=lho+30+dv.getUint16(lho+26,true)+dv.getUint16(lho+28,true),data=u8.subarray(start,start+csize);if(method===0)return data;if(method!==8||typeof DecompressionStream==='undefined')return null;return new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer())}p+=46+nl+xl+cl}return null}
function sigSearch(q){const s=sigLoad();if(!s)return[];const raw=String(q||'').trim(),digits=raw.replace(/\D/g,'');if(/^[\d.\-\s]+$/.test(raw)){if(digits.length<4)return[];const out=[];for(const it of s.items){if(it[0].startsWith(digits)){out.push(it);if(out.length>=8)break}}return out}const nq=sigNorm(raw);if(nq.length<3)return[];const toks=nq.split(/\s+/).filter(t=>t.length>1);if(!toks.length)return[];const sc=[];for(let i=0;i<s.items.length;i++){const n=s.idx[i];let ok=true;for(const t of toks)if(!n.includes(t)){ok=false;break}if(ok)sc.push([n.startsWith(toks[0])?0:1,s.items[i][1].length,s.items[i]])}sc.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);return sc.slice(0,8).map(x=>x[2])}
function sigtapBox(){return `<div class="apac-sigtap"><div id="apac-sigtap-status" class="apac-sigtap-status" aria-live="polite"></div><button type="button" class="btn sec" id="apac-sigtap-btn">Carregar tabela SIGTAP atualizada</button> <button type="button" class="btn sec" id="apac-sigtap-reset" hidden>Voltar à tabela do Anexo VIII</button><input type="file" id="apac-sigtap-file" accept=".zip,.txt,.csv" hidden><details><summary>Como funciona</summary><p class="mute">O app já traz como referência a tabela do <b>Anexo VIII · Tabela Nacional de Procedimentos SUS</b> (código e nome; sem valores). Se quiser a versão mais recente, baixe a Tabela Unificada (arquivo ZIP da competência mais recente) no site do SIGTAP/DATASUS e selecione o arquivo aqui, sem precisar extrair. Também aceita o <b>tb_procedimento.txt</b>. A leitura é feita neste aparelho; nada é enviado. Depois, ao digitar o nome ou o código do procedimento, o app sugere os correspondentes e preenche código e nome. Atualize a tabela quando sair nova competência.</p></details></div>`}
function sigPaint(){const el=document.getElementById('apac-sigtap-status');if(!el)return;const s=sigLoad(),n=s?s.items.length.toLocaleString('pt-BR'):'0';let html;if(!s)html='⚠️ Nenhuma tabela de procedimentos disponível. Carregue o arquivo do SIGTAP para receber sugestões.';else if(s.base)html=`✅ Tabela de referência embutida: <b>${n}</b> procedimentos (${h(s.fonte)}). Digite o nome ou o código nos campos abaixo.`;else{const comp=s.comp?` · competência ${s.comp.slice(4)}/${s.comp.slice(0,4)}`:'';html=`✅ Tabela SIGTAP carregada: <b>${n}</b> procedimentos${comp}. Digite o nome ou o código nos campos abaixo.`}el.innerHTML=html;const b=document.getElementById('apac-sigtap-btn');if(b)b.textContent=s&&!s.base?'Atualizar tabela SIGTAP':'Carregar tabela SIGTAP atualizada';const r=document.getElementById('apac-sigtap-reset');if(r)r.hidden=!(s&&!s.base)}
function setupSigtap(){
 sigPaint();const file=document.getElementById('apac-sigtap-file'),btn=document.getElementById('apac-sigtap-btn');if(!file||!btn)return;
 btn.onclick=()=>file.click();const rs=document.getElementById('apac-sigtap-reset');if(rs)rs.onclick=()=>{sigReset();sigPaint()};
 file.onchange=async()=>{const f=file.files[0];if(!f)return;const el=document.getElementById('apac-sigtap-status');el.textContent='Lendo a tabela…';try{const buf=await f.arrayBuffer();let u8=new Uint8Array(buf);if(u8[0]===0x50&&u8[1]===0x4b){u8=await sigZipEntry(buf,'tb_procedimento.txt');if(!u8)throw new Error('Não encontrei tb_procedimento.txt dentro do ZIP.')}const r=sigParse(new TextDecoder('iso-8859-1').decode(u8));if(r.items.length<100)throw new Error('Não encontrei a lista de procedimentos neste arquivo. Use o ZIP da Tabela Unificada ou o tb_procedimento.txt.');r.at=new Date().toISOString();const ok=sigSave(r);sigPaint();if(!ok)el.innerHTML+=' <br>Não foi possível guardar no aparelho; vale só até fechar esta página.'}catch(e){el.textContent='⚠️ '+(e.message||'Falha ao ler o arquivo.')}file.value=''};
 ['proc','s0','s1','s2','s3','s4'].forEach(p=>{
  const cod=document.getElementById('apac_'+p+'_cod'),nome=document.getElementById('apac_'+p+'_nome');if(!cod||!nome)return;
  const sug=document.createElement('div');sug.className='apac-sug';sug.hidden=true;sug.setAttribute('role','listbox');nome.closest('.apac-field').after(sug);
  const hint=document.createElement('div');hint.className='apac-help apac-sig-hint';hint.hidden=true;cod.after(hint);
  const hide=()=>{sug.hidden=true;sug.innerHTML=''};
  const pick=it=>{state[p+'_cod']=it[0];state[p+'_nome']=it[1];cod.value=it[0];nome.value=it[1];hint.hidden=true;hide();invalidatePDF()};
  const show=q=>{const r=sigLoad()?sigSearch(q):[];if(!r.length){if(sigLoad()&&String(q).trim().length>=3){sug.innerHTML='<div class="apac-sug-empty">Nenhum procedimento encontrado na tabela de referência.</div>';sug.hidden=false}else hide();return}sug.innerHTML=r.map((it,i)=>`<button type="button" class="apac-sug-item" role="option" data-i="${i}"><b>${h(sigFmt(it[0]))}</b><span>${h(it[1])}</span></button>`).join('');sug.hidden=false;sug.querySelectorAll('button').forEach(b=>b.onclick=()=>pick(r[Number(b.dataset.i)]))};
  nome.addEventListener('input',()=>show(nome.value));
  cod.addEventListener('input',()=>{const d=onlyDigits(cod.value),s=sigLoad();hint.hidden=true;if(!s){hide();return}if(d.length===10){hide();const it=s.items.find(x=>x[0]===d);if(it){hint.textContent='✔ '+it[1];hint.hidden=false;if(!nome.value.trim()){state[p+'_nome']=it[1];nome.value=it[1]}}else{hint.textContent='Código não encontrado na tabela de referência. Confira os 10 dígitos ou carregue o SIGTAP atualizado.';hint.hidden=false}}else if(d.length>=4)show(d);else hide()});
  nome.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
  [cod,nome].forEach(el=>el.addEventListener('blur',()=>setTimeout(hide,250)));
 });
}

function apacPage(){
 const chunks=[];
 chunks.push(`<div class="apac-hero"><h2>Preencher APAC</h2><p>Laudo para Solicitação/Autorização de Procedimento Ambulatorial, no mesmo modelo enviado. Preencha os campos e toque em <b>Gerar PDF</b>.</p><div class="apac-lock">🔒 Os dados são processados neste aparelho. Não são enviados ou salvos em servidores pelo gerador de PDF.</div></div><div class="apac-required-notice" role="note"><strong>🟨 ATENÇÃO: ÁREAS EM AMARELO CLARO SÃO DE PREENCHIMENTO OBRIGATÓRIO.</strong><div>Preencha todos os campos destacados antes de gerar o PDF. Os demais campos são opcionais nesta versão do formulário, mas o serviço autorizador pode exigir informações adicionais.</div></div><div class="warn"><b>Atenção:</b> o laudo preenchido não é uma autorização concedida. O profissional responsável deve assinar/carimbar o documento, e os campos de autorização cabem ao órgão ou profissional autorizador. O arquivo de referência contém somente a página 1 do modelo.</div>`);
 chunks.push(section('1. Estabelecimento de saúde solicitante','Dados da unidade que solicita o procedimento.',[
 f('estab','01 · Nome do estabelecimento de saúde solicitante','Nome oficial da unidade solicitante.','Ex.: UPA Itaberaba',{required:true}),cod('cnes_sol','02 · CNES da unidade','Número do Cadastro Nacional de Estabelecimentos de Saúde, geralmente com 7 dígitos.','Ex.: 1234567',7,{required:true})
 ].join('')));
 chunks.push(section('2. Identificação do paciente','Identifique corretamente o paciente. Campos que você não souber podem ficar em branco e ser preenchidos depois.',[
 f('paciente','03 · Nome completo do paciente','Nome sem abreviações, conforme documento/cartão SUS.','Ex.: Maria de Souza Silva',{required:true}),
 select('sexo','04 · Sexo (conforme o modelo impresso)','Marque a opção que consta na versão do formulário: masculino ou feminino.',['Masculino','Feminino']),
 f('prontuario','05 · Número do prontuário','Código do atendimento ou número do prontuário da unidade.','Ex.: 2026/001234'),
 cod('cns','06 · CNS do paciente','Número de 15 dígitos do Cartão Nacional de Saúde.','15 dígitos',15,{required:true}),
 f('nascimento','07 · Data de nascimento','Selecione a data de nascimento do paciente.','',{type:'date',required:true}),
 select('raca','08 · Raça/cor','Informação autodeclarada no cadastro.',['Branca','Preta','Parda','Amarela','Indígena','Ignorada']),
 f('etnia','08.1 · Etnia','Preencha quando aplicável, especialmente para paciente indígena.','Ex.: Pataxó'),
 f('mae','09 · Nome da mãe','Nome completo da mãe, como informado no cadastro.','Ex.: Ana Maria de Souza'),
 cod('contato_ddd','10 · DDD do telefone do paciente','Somente os 2 dígitos do DDD.','75',2),
 cod('contato_tel','10 · Número de contato do paciente','Telefone do paciente ou contato principal, sem DDD.','999999999',9),
 f('responsavel','11 · Nome do responsável','Responsável legal ou acompanhante, quando houver.','Ex.: João de Souza'),
 cod('resp_ddd','12 · DDD do responsável','Somente os 2 dígitos do DDD.','75',2),
 cod('resp_tel','12 · Número do telefone do responsável','Telefone do responsável, sem DDD.','999999999',9),
 f('endereco','13 · Endereço completo','Rua, número, complemento e bairro da residência.','Ex.: Rua das Flores, 120, Centro'),
 f('municipio','14 · Município de residência','Nome da cidade onde o paciente reside.','Ex.: Itaberaba'),
 cod('ibge','15 · Código IBGE do município','Código numérico oficial de 7 dígitos da cidade. Não confundir com CEP.','Ex.: 2900000',7),
 f('uf','16 · UF','Sigla de 2 letras do estado de residência.','BA',{max:2}),
 cod('cep','17 · CEP','Código de Endereçamento Postal com 8 dígitos.','46880000',8)
 ].join('')));
 chunks.push(section('3. Procedimento principal solicitado','Informe o procedimento de acordo com a tabela SIGTAP/SUS. O aplicativo não valida automaticamente o código ou a indicação.',[
 sigtapBox(),
 cod('proc_cod','18 · Código do procedimento principal','Código SIGTAP do procedimento solicitado (10 dígitos, quando aplicável).','Ex.: 0301010072',10,{required:true}),
 f('proc_nome','19 · Nome do procedimento principal','Descrição oficial do procedimento que se deseja solicitar.','Ex.: Nome do procedimento conforme SIGTAP',{required:true}),
 cod('proc_qtd','20 · Quantidade','Número de procedimentos solicitados.','Ex.: 1',5,{required:true})
 ].join('')));
 let extras='';for(let i=0;i<5;i++){
  const n=21+i*3;extras+=`<div class="apac-secondary"><h4>Procedimento secundário ${i+1} (opcional)</h4><div class="apac-fields">${cod('s'+i+'_cod',n+' · Código','Código SIGTAP do procedimento secundário.','10 dígitos',10)}${f('s'+i+'_nome',(n+1)+' · Nome do procedimento','Nome oficial do procedimento secundário.','Ex.: Procedimento complementar')}${cod('s'+i+'_qtd',(n+2)+' · Quantidade','Quantidade solicitada desse procedimento.','Ex.: 1',5)}</div></div>`
 }
 chunks.push(`<details class="card apac-card apac-details"><summary>Procedimentos secundários (21 a 35) · opcionais</summary><p class="mute">Abra apenas se houver procedimentos adicionais. São 5 linhas disponíveis no modelo.</p>${extras}</details>`);
 chunks.push(section('4. Justificativa clínica','Estas informações devem demonstrar a necessidade do procedimento solicitado.',[
 f('diagnostico','36 · Descrição do diagnóstico','Diagnóstico clínico por extenso.','Ex.: Pneumonia por microrganismo não especificado',{required:true}),
 f('cid1','37 · CID-10 principal','Código CID-10 do diagnóstico que motiva a solicitação.','Ex.: J18.9',{required:true,max:8}),
 f('cid2','38 · CID-10 secundário','CID-10 de condição secundária, se houver.','Ex.: I10',{max:8}),
 f('cid3','39 · CID-10 de causas associadas','CID-10 de outras doenças relacionadas, quando aplicável.','Ex.: E11.9',{max:12}),
 f('obs','40 · Observações / justificativa clínica','Descreva história, sinais/sintomas, exames relevantes, tratamento prévio, motivo técnico e necessidade do procedimento. O texto deve caber no espaço do formulário.', 'Ex.: Paciente com sintomas há 4 dias, exame físico compatível e radiografia demonstrando...', {multi:true,rows:6,required:true,max:1200})
 ].join('')));
 chunks.push(section('5. Profissional solicitante','Identificação do médico ou profissional que solicita o procedimento.',[
 f('sol_nome','41 · Nome completo do profissional solicitante','Nome completo do profissional responsável pelo pedido.','Ex.: Nome completo do médico',{required:true}),
 f('data_solicitacao','42 · Data da solicitação','Data em que o laudo está sendo solicitado.','',{type:'date',required:true}),
 select('sol_tipo','43 · Tipo de documento do solicitante','Informe se o número abaixo é CNS ou CPF.',['CNS','CPF'],{required:true}),
 cod('sol_doc','44 · Número do CNS ou CPF do solicitante','Somente os dígitos do documento selecionado acima.','CPF: 11 dígitos | CNS: 15 dígitos',15,{required:true}),
 `<div class="apac-hint"><b>45 · Assinatura e carimbo:</b> reservado para assinatura e identificação profissional no documento impresso. O app não insere assinaturas automaticamente.</div>`
 ].join('')));
 chunks.push(`<details class="card apac-card apac-details"><summary>6. Autorização · preencher somente se autorizado</summary><p class="mute">Estes campos não devem ser preenchidos pelo médico solicitante em nome do órgão autorizador. Deixe em branco se a APAC ainda não foi autorizada.</p><div class="apac-fields">${f('aut_nome','46 · Nome do profissional autorizador','Profissional que realmente autorizou o procedimento, se já houver autorização.','Nome do autorizador')}${f('aut_orgao','47 · Código do órgão emissor','Código do órgão competente, quando conhecido.','Ex.: Código do órgão emissor')}${select('aut_tipo','48 · Tipo de documento do autorizador','CNS ou CPF do profissional autorizador.',['CNS','CPF'])}${cod('aut_doc','49 · Documento do autorizador','Dígitos do CNS ou CPF do autorizador.','CPF: 11 dígitos | CNS: 15 dígitos',15)}${f('aut_data','50 · Data da autorização','Data da autorização, se efetivamente concedida.','',{type:'date'})}<div class="apac-hint"><b>51 · Assinatura e carimbo:</b> permanecem em branco para o autorizador.</div>${f('apac_num','52 · Número da autorização (APAC)','Número oficial informado pelo serviço regulador, se já emitido. Não inventar numeração.','Número da APAC emitida')}${f('valid_inicio','53 · Validade — data inicial','Início do período de validade oficialmente autorizado.','',{type:'date'})}${f('valid_fim','53 · Validade — data final','Término do período de validade oficialmente autorizado.','',{type:'date'})}</div></details>`);
 chunks.push(section('7. Estabelecimento executante','Unidade na qual o procedimento será realizado, se já definida.',[
 f('exec_nome','54 · Nome fantasia do estabelecimento executante','Nome da unidade onde o procedimento solicitado será realizado.','Ex.: Hospital / clínica executante'),
 cod('exec_cnes','55 · CNES do estabelecimento executante','CNES da unidade executante, quando definido.','7 dígitos',7)
 ].join('')));
 chunks.push(`<div class="card apac-actions"><p class="mute"><span class="apac-required">*</span> Campos em amarelo claro: obrigatórios para gerar o PDF. O PDF mantém a página A4 do modelo enviado; dados não preenchidos ficam em branco.</p><button class="btn" type="button" id="apac-generate">📄 Gerar PDF para imprimir</button> <button type="button" class="btn sec" id="apac-reset">Limpar formulário</button><div id="apac-status" role="status" aria-live="polite"></div><div id="apac-output" hidden><p><b>PDF pronto!</b> Toque em <b>Abrir PDF</b> no Safari e use Compartilhar → Imprimir, ou faça o download.</p><a id="apac-preview" class="btn" target="_blank" rel="noopener">Abrir PDF</a> <a id="apac-download" class="btn sec" download="Dose_PS_APAC.pdf">Baixar PDF</a></div></div>`);
 document.querySelector('#app').innerHTML='<div class="apac-page">'+chunks.join('')+'</div>';
 document.querySelectorAll('[data-apac]').forEach(el=>{el.addEventListener('input',()=>{state[el.dataset.apac]=el.value;invalidatePDF()});el.addEventListener('change',()=>{state[el.dataset.apac]=el.value;invalidatePDF()})});
 setupSigtap();
 document.getElementById('apac-generate').onclick=generate;
 document.getElementById('apac-reset').onclick=()=>{if(confirm('Limpar todos os campos desta APAC?')){state=blank();invalidatePDF();apacPage();window.scrollTo(0,0)}};
}
function invalidatePDF(){const out=document.getElementById('apac-output');if(out)out.hidden=true}
function onlyDigits(value){return String(value||'').replace(/\D/g,'')}
function validate(){
 const required=[['estab','Nome do estabelecimento solicitante'],['cnes_sol','CNES da unidade solicitante'],['paciente','Nome do paciente'],['cns','CNS do paciente'],['nascimento','Data de nascimento'],['proc_cod','Código SIGTAP do procedimento principal'],['proc_nome','Nome do procedimento principal'],['proc_qtd','Quantidade solicitada'],['diagnostico','Descrição do diagnóstico'],['cid1','CID-10 principal'],['obs','Observações / justificativa clínica'],['sol_nome','Nome do profissional solicitante'],['data_solicitacao','Data da solicitação'],['sol_tipo','Tipo de documento do solicitante'],['sol_doc','Número do documento do solicitante']];
 const missing=required.filter(([k])=>!(state[k]||'').trim());if(missing.length)throw Error('Preencha os campos essenciais: '+missing.map(x=>x[1]).join('; ')+'.');
 for(const [k,label,len] of [['cns','CNS do paciente',15],['cnes_sol','CNES solicitante',7],['exec_cnes','CNES executante',7],['ibge','Código IBGE',7],['cep','CEP',8],['contato_ddd','DDD do contato',2],['resp_ddd','DDD do responsável',2]]){
  if(state[k]&&onlyDigits(state[k]).length!==len)throw Error(label+' precisa ter '+len+' dígitos.');
 }
 for(const key of ['sol','aut']){if(state[key+'_doc']&&state[key+'_tipo']){const len=state[key+'_tipo']==='CPF'?11:15;if(onlyDigits(state[key+'_doc']).length!==len)throw Error('Documento '+(key==='sol'?'do solicitante':'do autorizador')+' precisa ter '+len+' dígitos.')}}
 if(state.valid_inicio&&state.valid_fim&&state.valid_inicio>state.valid_fim)throw Error('A validade inicial não pode ser posterior à data final.');
}
const boxes={
 estab:[34,90,419,15],cnes_sol:[460,90,101,14], paciente:[33,131,367,15], prontuario:[477,132,84,14],
 raca:[401,154,61,14],etnia:[469,154,91,14],mae:[33,179,367,15],contato_ddd:[405,184,29,11],contato_tel:[437,184,124,11],responsavel:[33,203,367,15],resp_ddd:[405,209,30,10],resp_tel:[437,209,124,10],endereco:[33,223,528,16],municipio:[33,248,320,16],ibge:[356,248,80,16],uf:[437,255,32,10],
 proc_nome:[216,289,278,17],proc_qtd:[499,289,54,17],diagnostico:[33,487,300,18],cid1:[336,487,61,18],cid2:[400,487,65,18],cid3:[467,487,93,18],obs:[33,518,526,78],
 sol_nome:[33,626,264,14],aut_nome:[33,697,253,11],aut_orgao:[287,697,90,11],apac_num:[392,706,165,47],exec_nome:[36,801,385,12],exec_cnes:[442,804,99,10],
};
for(let i=0;i<5;i++){const y= i===0?336:i===1?362:i===2?389:i===3?416:442;
 boxes['s'+i+'_nome']=[216,y-3,296,16];boxes['s'+i+'_qtd']=[515,y-2,45,15];}
const grids={cns:[33,158,262,15],cep:[470,254,92,8],proc_cod:[33,293,179,10],sol_doc:[146,653,234,15],aut_doc:[146,729,234,15],};
for(let i=0;i<5;i++){const y=[338,364,390,417,443][i];grids['s'+i+'_cod']=[33,y,178,10]}
const checks={sexo:{Masculino:[421,134,11,9],Feminino:[456,134,9,9]},sol_tipo:{CNS:[52,652,8,8],CPF:[104,653,8,8]},aut_tipo:{CNS:[52,730,8,8],CPF:[104,730,8,8]}};
const dates={nascimento:[[306.5,159,21,11],[333.4,159,18,11],[356.4,159,36,11]],data_solicitacao:[[302.5,630,19,11],[327.2,630,17,11],[350.3,630,31,11]],aut_data:[[34,765,24,11],[65,765,21,11],[92,765,25,11]],valid_inicio:[[386,768,24,9],[417,768,22,9],[445,768,26,9]],valid_fim:[[477,768,24,9],[507,768,22,9],[536,768,25,9]]};
function placeText(ctx,text,rect,key){if(!text)return;const [x,y,w,hh]=rect;const txt=String(text).replace(/\s+/g,' ').trim();if(!txt)return;const multi=key==='obs';let size=multi?9:Math.min(9.1,Math.max(7.7,hh*.66)),lines=[];let ok=false;
while(size>=(multi?6.4:6.2)){
 ctx.font=`${size}px Arial, sans-serif`;
 if(!multi){lines=[txt];ok=ctx.measureText(txt).width<=w-4;}
 else{lines=[];let row=''; for(const word of txt.split(' ')){const candidate=row?row+' '+word:word;if(ctx.measureText(candidate).width>w-5&&row){lines.push(row);row=word}else row=candidate;}if(row)lines.push(row);ok=lines.length*size*1.27<=hh-4&&lines.every(l=>ctx.measureText(l).width<=w-4)}
 if(ok)break;size-=.2;
 }
 if(!ok)throw Error('O texto de "'+(key==='obs'?'Observações / justificativa':'campo '+key)+'" não cabe no espaço da APAC. Resuma esse campo e gere novamente.');
 ctx.fillStyle='#101010';ctx.font=`${size}px Arial, sans-serif`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.save();ctx.beginPath();ctx.rect(x,y,w,hh);ctx.clip();
 if(multi){const lineHeight=size*1.27;lines.forEach((line,i)=>ctx.fillText(line,x+2,y+3+size*.6+i*lineHeight));}
 else ctx.fillText(txt,x+2,y+hh*.52);
 ctx.restore();
}
function placeGrid(ctx,value,rect,key){if(!value)return;const digits=onlyDigits(value);const [x,y,w,count]=rect;const cc=w/count;const size=key==='cns'?10.5:key==='cep'?9:9.2;ctx.font=`${size}px Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#121212';let rows=digits;if(digits.length>count)throw Error('O campo '+key+' ultrapassa a quantidade de dígitos permitida.');for(let i=0;i<rows.length;i++)ctx.fillText(rows[i],x+cc*(i+.5),y+6);}
function placeCheck(ctx,rect){const [x,y,w,hh]=rect;ctx.fillStyle='#171717';ctx.font='bold 9px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('X',x+w/2,y+hh/2);}
function placeDate(ctx,key,value){if(!value)return;const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value);if(!m)throw Error('Data inválida no campo '+key+'.');const parts=[m[3],m[2],m[1]];dates[key].forEach((r,i)=>placeText(ctx,parts[i],r,key+'_'+i))}
function fill(ctx){
 for(const [key,rect] of Object.entries(boxes)){let val=state[key];if(key==='uf')val=String(val||'').toUpperCase();placeText(ctx,val,rect,key)}
 for(const [key,rect] of Object.entries(grids)){placeGrid(ctx,state[key],rect,key)}
 for(const [key,choices] of Object.entries(checks))if(state[key]&&choices[state[key]])placeCheck(ctx,choices[state[key]]);
 for(const [key,val] of Object.entries(dates))placeDate(ctx,key,state[key]);
 // Não inserir marca gráfica ou assinatura nos campos 45 e 51.
}
function combine(arr){let n=0;for(const a of arr)n+=a.length;const b=new Uint8Array(n);let pos=0;for(const a of arr){b.set(a,pos);pos+=a.length}return b}
function makePdfFromJpeg(jpeg,width,height){const enc=new TextEncoder(),parts=[],offsets=[0],put=s=>{parts.push(enc.encode(s));};let size=0;function add(b){parts.push(b);size+=b.length}function txt(s){add(enc.encode(s))}function obj(i,s){offsets[i]=size;txt(i+' 0 obj\n'+s+'\nendobj\n')}
 txt('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
 obj(1,'<< /Type /Catalog /Pages 2 0 R >>');
 obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
 obj(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.276 841.89] /Resources << /XObject << /Img 4 0 R >> >> /Contents 5 0 R >>');
 offsets[4]=size;txt('4 0 obj\n<< /Type /XObject /Subtype /Image /Width '+width+' /Height '+height+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+jpeg.length+' >>\nstream\n');add(jpeg);txt('\nendstream\nendobj\n');
 const contents=enc.encode('q\n595.276 0 0 841.89 0 0 cm\n/Img Do\nQ\n');offsets[5]=size;txt('5 0 obj\n<< /Length '+contents.length+' >>\nstream\n');add(contents);txt('endstream\nendobj\n');
 const xref=size;txt('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)txt(String(offsets[i]).padStart(10,'0')+' 00000 n \n');txt('trailer\n<< /Root 1 0 R /Size 6 >>\nstartxref\n'+xref+'\n%%EOF\n');return new Blob(parts,{type:'application/pdf'});
}
function fromBase64(str){const binary=atob(str),out=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)out[i]=binary.charCodeAt(i);return out}
async function generate(){const status=document.getElementById('apac-status');const btn=document.getElementById('apac-generate');status.className='apac-status';try{
 validate();btn.disabled=true;status.textContent='Gerando PDF localmente…';
 const im=new Image();im.src='images/apac-formulario.jpg';if(im.decode)await im.decode();else await new Promise((resolve,reject)=>{im.onload=resolve;im.onerror=reject});
 const canvas=document.createElement('canvas');canvas.width=im.naturalWidth;canvas.height=im.naturalHeight;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Este navegador não conseguiu criar o PDF.');ctx.drawImage(im,0,0);const s=canvas.width/595.276;ctx.setTransform(s,0,0,s,0,0);fill(ctx);ctx.setTransform(1,0,0,1,0,0);
 const jpeg=fromBase64(canvas.toDataURL('image/jpeg',.93).split(',')[1]);const pdf=makePdfFromJpeg(jpeg,canvas.width,canvas.height);if(lastPdfUrl)URL.revokeObjectURL(lastPdfUrl);lastPdfUrl=URL.createObjectURL(pdf);
 document.getElementById('apac-preview').href=lastPdfUrl;document.getElementById('apac-download').href=lastPdfUrl;document.getElementById('apac-output').hidden=false;status.textContent='PDF A4 gerado. Abra para visualizar e imprimir.';
 // A abertura explícita do PDF funciona no Safari iOS sem depender de pop-ups automáticos.
 }catch(err){status.textContent=err?.message||'Não foi possível gerar o PDF.';status.className='apac-status apac-error';document.getElementById('apac-output').hidden=true;}finally{btn.disabled=false}
}
window.apacPage=apacPage;
})();
