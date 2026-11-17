/* Modelos de registro: campos em branco, sem preenchimento clínico automático. */
const documentTemplates = [
{ id:'em-admission', area:'emergency', title:'Admissão médica', description:'História, avaliação inicial, hipóteses e conduta.', text:`ADMISSÃO MÉDICA — EMERGÊNCIA
DATA/HORA: [PREENCHER]
IDENTIFICAÇÃO: [PREENCHER]
PROCEDÊNCIA / ACOMPANHANTE / FONTE DA HISTÓRIA: [PREENCHER]
QUEIXA PRINCIPAL: [PREENCHER]
HISTÓRIA DA DOENÇA ATUAL: [DESCREVER INÍCIO, EVOLUÇÃO, SINTOMAS ASSOCIADOS E MEDIDAS PRÉVIAS]
ANTECEDENTES / MEDICAÇÕES EM USO / ALERGIAS: [PREENCHER]
SINAIS VITAIS: PA [ ] MMHG; FC [ ] BPM; FR [ ] IRPM; SPO₂ [ ]%; TEMPERATURA [ ] °C; HGT [ ] MG/DL, SE AFERIDO.
EXAME FÍSICO: EG [ ]; NEUROLÓGICO / GLASGOW [ ]; AR [ ]; ACV [ ]; ABD [ ]; EXT [ ]; OUTROS ACHADOS [ ].
EXAMES COMPLEMENTARES: [RESULTADOS DISPONÍVEIS E PENDÊNCIAS]
HIPÓTESES DIAGNÓSTICAS / PROBLEMAS ATIVOS: [PREENCHER]
CONDUTA: [MEDIDAS REALIZADAS, MEDICAÇÕES COM DOSE/VIA/HORÁRIO, EXAMES E AVALIAÇÕES SOLICITADOS]
REAVALIAÇÃO / DESTINO: [RESPOSTA ÀS MEDIDAS, PLANO E HORÁRIO DE REAVALIAÇÃO]
MÉDICO / CRM: [PREENCHER]` },
{ id:'em-evolution', area:'emergency', title:'Evolução médica', description:'Evolução do plantão e reavaliação dos problemas ativos.', text:`EVOLUÇÃO MÉDICA — EMERGÊNCIA
DATA/HORA: [PREENCHER]
DIAGNÓSTICOS / PROBLEMAS ATIVOS: [PREENCHER]
EVOLUÇÃO: PACIENTE EM [SETOR/LEITO], EM ACOMPANHAMENTO POR [MOTIVO]. DESDE A ÚLTIMA AVALIAÇÃO, [RELATAR QUEIXAS, INTERCORRÊNCIAS E RESPOSTA AO TRATAMENTO].
SUPORTE ATUAL: [OXIGENOTERAPIA, VENTILAÇÃO, INFUSÕES E OUTROS, SE PRESENTES]
SINAIS VITAIS: [PREENCHER COM DADOS AFERIDOS]
EXAME FÍSICO: EG [ ]; NEURO [ ]; AR [ ]; ACV [ ]; ABD [ ]; EXT [ ].
DIURESE / BALANÇO, SE MONITORIZADOS: [PREENCHER]
EXAMES NOVOS / PENDÊNCIAS: [PREENCHER]
AVALIAÇÃO: [EVOLUÇÃO DOS PROBLEMAS E JUSTIFICATIVA DAS DECISÕES]
CONDUTA / REAVALIAÇÃO / DESTINO: [PREENCHER]
COMUNICAÇÃO COM PACIENTE / FAMILIAR: [REGISTRAR, SE REALIZADA]
MÉDICO / CRM: [PREENCHER]` },
{ id:'em-reassessment', area:'emergency', title:'Reavaliação após intervenção', description:'Registro da resposta ao tratamento e próximos passos.', text:`REAVALIAÇÃO MÉDICA
DATA/HORA: [PREENCHER]
MOTIVO DA REAVALIAÇÃO: [PREENCHER]
INTERVENÇÃO REALIZADA / HORÁRIO: [PREENCHER]
QUEIXAS E EVOLUÇÃO APÓS A INTERVENÇÃO: [PREENCHER]
SINAIS VITAIS E EXAME DIRECIONADO: [PREENCHER]
RESULTADOS DISPONÍVEIS: [PREENCHER]
AVALIAÇÃO DA RESPOSTA: [PREENCHER]
CONDUTA / NOVA REAVALIAÇÃO / DESTINO: [PREENCHER]
MÉDICO / CRM: [PREENCHER]` },
{ id:'em-transfer', area:'emergency', title:'Relatório para CER / transferência', description:'Resumo clínico, suporte atual e motivo da transferência.', text:`RELATÓRIO MÉDICO PARA REGULAÇÃO / TRANSFERÊNCIA
DATA/HORA: [PREENCHER]
PACIENTE / IDADE: [PREENCHER]
UNIDADE DE ORIGEM: [PREENCHER]
MOTIVO DA ADMISSÃO / DATA DE INÍCIO DO QUADRO: [PREENCHER]
RESUMO CLÍNICO E EVOLUÇÃO: [PREENCHER]
ANTECEDENTES / ALERGIAS: [PREENCHER]
ESTADO ATUAL / SINAIS VITAIS / GLASGOW: [PREENCHER]
SUPORTE EM USO: [OXIGÊNIO / VIA AÉREA / VENTILAÇÃO / INFUSÕES COM CONCENTRAÇÃO E VELOCIDADE, SE PRESENTES]
EXAMES RELEVANTES: [RESULTADOS E DATAS]
TRATAMENTO REALIZADO E RESPOSTA: [PREENCHER]
HIPÓTESES DIAGNÓSTICAS: [PREENCHER]
JUSTIFICATIVA DA TRANSFERÊNCIA / RECURSO NECESSÁRIO: [PREENCHER]
REGULAÇÃO / DESTINO / ACEITE: [REGISTRAR APENAS SE CONFIRMADOS, COM HORÁRIO E RESPONSÁVEL]
CONDIÇÕES E SUPORTE NECESSÁRIOS AO TRANSPORTE: [PREENCHER CONFORME AVALIAÇÃO]
PENDÊNCIAS / DOCUMENTOS ENCAMINHADOS: [PREENCHER]
MÉDICO / CRM / CONTATO PROFISSIONAL: [PREENCHER]` },
{ id:'em-discharge', area:'emergency', title:'Relatório de alta', description:'Resumo do atendimento, orientações e acompanhamento.', text:`RELATÓRIO DE ALTA — EMERGÊNCIA
DATA/HORA: [PREENCHER]
PACIENTE: [PREENCHER]
MOTIVO DO ATENDIMENTO: [PREENCHER]
DIAGNÓSTICO / HIPÓTESE NA ALTA: [PREENCHER]
RESUMO DO ATENDIMENTO / EXAMES / TRATAMENTO: [PREENCHER]
CONDIÇÃO CLÍNICA NA REAVALIAÇÃO DE ALTA: [PREENCHER]
PRESCRIÇÃO / RECONCILIAÇÃO MEDICAMENTOSA: [PREENCHER]
ORIENTAÇÕES ESPECÍFICAS E SINAIS DE ALARME PARA RETORNO: [PREENCHER CONFORME O CASO]
ACOMPANHAMENTO / PRAZO / LOCAL: [PREENCHER]
EXAMES PENDENTES / RESPONSÁVEL PELO SEGUIMENTO: [PREENCHER]
ORIENTAÇÕES TRANSMITIDAS A: [PREENCHER; REGISTRAR COMPREENSÃO SE VERIFICADA]
MÉDICO / CRM: [PREENCHER]` },
{ id:'em-procedure', area:'emergency', title:'Registro de procedimento', description:'Indicação, técnica realizada, intercorrências e resultado.', text:`REGISTRO DE PROCEDIMENTO
DATA/HORA / LOCAL: [PREENCHER]
PROCEDIMENTO / INDICAÇÃO: [PREENCHER]
OPERADOR / EQUIPE: [PREENCHER]
CONSENTIMENTO OU CONTEXTO DE EMERGÊNCIA: [DESCREVER O QUE OCORREU]
AVALIAÇÃO PRÉVIA / MONITORIZAÇÃO: [PREENCHER]
ANALGESIA / ANESTESIA / SEDAÇÃO, SE UTILIZADAS: [MEDICAÇÕES, DOSES, VIAS E HORÁRIOS]
TÉCNICA EFETIVAMENTE REALIZADA / SÍTIO / MATERIAIS / NÚMERO DE TENTATIVAS: [PREENCHER]
CONFIRMAÇÃO DO RESULTADO / POSICIONAMENTO, QUANDO APLICÁVEL: [PREENCHER]
INTERCORRÊNCIAS / COMPLICAÇÕES E MEDIDAS ADOTADAS: [PREENCHER]
CONDIÇÃO APÓS O PROCEDIMENTO / PLANO DE MONITORIZAÇÃO: [PREENCHER]
MÉDICO / CRM: [PREENCHER]` },
{ id:'icu-admission', area:'icu', title:'Admissão na UTI', description:'Contexto da internação e avaliação por sistemas.', text:`ADMISSÃO MÉDICA — UTI
DATA/HORA / DIA DE INTERNAÇÃO: [PREENCHER]
PACIENTE / PROCEDÊNCIA: [PREENCHER]
MOTIVO DA INTERNAÇÃO EM UTI: [PREENCHER]
HISTÓRIA CLÍNICA / TRATAMENTO PRÉVIO / EVOLUÇÃO ATÉ A ADMISSÃO: [PREENCHER]
ANTECEDENTES / FUNCIONALIDADE PRÉVIA / MEDICAÇÕES / ALERGIAS: [PREENCHER]
DIAGNÓSTICOS / PROBLEMAS ATIVOS: [PREENCHER]
SINAIS VITAIS: [PREENCHER]
NEUROLÓGICO / ANALGESIA / SEDAÇÃO: [EXAME, ESCALAS AFERIDAS, MEDICAÇÕES E METAS INDIVIDUALIZADAS]
RESPIRATÓRIO: [VIA AÉREA, SUPORTE, PARÂMETROS, EXAME E GASOMETRIA DISPONÍVEL]
HEMODINÂMICO: [PERFUSÃO, RITMO, PRESSÃO E INFUSÕES COM DOSE/CONCENTRAÇÃO/VELOCIDADE]
RENAL / METABÓLICO: [DIURESE, BALANÇO, FUNÇÃO RENAL E ELETRÓLITOS]
INFECCIOSO: [FOCO SUSPEITO/CONFIRMADO, CULTURAS E ANTIMICROBIANOS COM DATAS]
HEMATOLÓGICO: [ACHADOS E EXAMES]
GASTROINTESTINAL / NUTRICIONAL: [EXAME, VIA DE DIETA E TOLERÂNCIA]
PELE / EXTREMIDADES: [PREENCHER]
DISPOSITIVOS / SÍTIOS / DATAS DE INSERÇÃO: [PREENCHER]
EXAMES RELEVANTES / PENDÊNCIAS: [PREENCHER]
PLANO POR PROBLEMAS / METAS / REAVALIAÇÃO: [PREENCHER]
COMUNICAÇÃO COM FAMILIARES / PLANO DE CUIDADOS: [REGISTRAR SE REALIZADA]
MÉDICO / CRM: [PREENCHER]` },
{ id:'icu-evolution', area:'icu', title:'Evolução diária da UTI', description:'Intercorrências, suporte e plano por sistemas.', text:`EVOLUÇÃO MÉDICA — UTI
DATA/HORA / DIA DE UTI: [PREENCHER]
DIAGNÓSTICOS / PROBLEMAS ATIVOS: [PREENCHER]
INTERCORRÊNCIAS NAS ÚLTIMAS 24 HORAS: [PREENCHER]
SINAIS VITAIS / TENDÊNCIAS: [PREENCHER]
NEURO / ANALGESIA / SEDAÇÃO: [EXAME, ESCALAS AFERIDAS, INFUSÕES E METAS]
AR / VENTILAÇÃO: [EXAME, VIA AÉREA, MODO E PARÂMETROS, TROCAS GASOSAS]
ACV / HEMODINÂMICA: [EXAME, PERFUSÃO E DROGAS EM USO COM DOSES]
RENAL / BALANÇO: [DIURESE NO PERÍODO, ENTRADAS/SAÍDAS, FUNÇÃO RENAL, ELETRÓLITOS E SUPORTE, SE PRESENTE]
INFECCIOSO: [TEMPERATURA, CULTURAS, FOCO E ANTIMICROBIANOS COM DIA DE USO]
HEMATOLÓGICO: [EXAMES, SANGRAMENTOS OU TRANSFUSÕES, SE PRESENTES]
ABD / NUTRIÇÃO / GLICEMIA: [PREENCHER]
PELE / EXTREMIDADES / MOBILIDADE: [PREENCHER]
DISPOSITIVOS / NECESSIDADE DE MANUTENÇÃO: [PREENCHER]
EXAMES NOVOS / PENDÊNCIAS: [PREENCHER]
AVALIAÇÃO E PLANO POR PROBLEMAS: [PREENCHER]
MEDIDAS PREVENTIVAS / INDICAÇÕES E CONTRAINDICAÇÕES INDIVIDUALIZADAS: [PREENCHER]
METAS DO DIA / CRITÉRIOS DE REAVALIAÇÃO: [PREENCHER]
COMUNICAÇÃO COM PACIENTE / FAMÍLIA: [REGISTRAR SE REALIZADA]
MÉDICO / CRM: [PREENCHER]` },
{ id:'icu-event', area:'icu', title:'Intercorrência na UTI', description:'Mudança clínica, intervenções e resposta observada.', text:`INTERCORRÊNCIA MÉDICA — UTI
DATA/HORA DO EVENTO E DA AVALIAÇÃO: [PREENCHER]
MOTIVO DO ACIONAMENTO: [PREENCHER]
ESTADO PRÉVIO / CONTEXTO: [PREENCHER]
ACHADOS CLÍNICOS / SINAIS VITAIS / SUPORTE NO MOMENTO: [PREENCHER]
HIPÓTESES CONSIDERADAS: [PREENCHER]
MEDIDAS REALIZADAS COM DOSES, VIAS E HORÁRIOS: [PREENCHER]
EXAMES / AVALIAÇÕES SOLICITADOS: [PREENCHER]
RESPOSTA E CONDIÇÃO APÓS AS INTERVENÇÕES: [PREENCHER]
PLANO DE MONITORIZAÇÃO / REAVALIAÇÃO / PENDÊNCIAS: [PREENCHER]
COMUNICAÇÃO COM EQUIPE / FAMILIARES: [REGISTRAR SE REALIZADA]
MÉDICO / CRM: [PREENCHER]` },
{ id:'icu-handoff', area:'icu', title:'Passagem de plantão', description:'Resumo por paciente, prioridades e pendências.', text:`PASSAGEM DE PLANTÃO — UTI
DATA/HORA / LEITO / PACIENTE: [PREENCHER]
MOTIVO DA INTERNAÇÃO / DIA DE UTI: [PREENCHER]
PROBLEMAS ATIVOS E EVOLUÇÃO RECENTE: [PREENCHER]
NEURO / SEDAÇÃO: [PREENCHER]
VIA AÉREA / SUPORTE RESPIRATÓRIO: [PREENCHER]
HEMODINÂMICA / INFUSÕES COM DOSES: [PREENCHER]
DIURESE / FUNÇÃO RENAL / BALANÇO: [PREENCHER]
INFECÇÃO / ANTIMICROBIANOS / CULTURAS: [PREENCHER]
DIETA / GLICEMIA / OUTROS CUIDADOS: [PREENCHER]
DISPOSITIVOS: [PREENCHER]
INTERCORRÊNCIAS DO PLANTÃO: [PREENCHER]
PRIORIDADES / METAS / CONDUTAS JÁ DEFINIDAS: [PREENCHER]
EXAMES E AVALIAÇÕES PENDENTES / PRAZOS / RESPONSÁVEIS: [PREENCHER]
PLANO DE CUIDADOS E COMUNICAÇÕES RELEVANTES: [PREENCHER]
MÉDICOS RESPONSÁVEIS PELA PASSAGEM: [PREENCHER]` },
{ id:'icu-transfer', area:'icu', title:'Alta da UTI / transferência', description:'Resumo da internação e continuidade do cuidado.', text:`RELATÓRIO DE ALTA DA UTI / TRANSFERÊNCIA
DATA/HORA / PACIENTE: [PREENCHER]
PERÍODO NA UTI / DESTINO: [PREENCHER]
MOTIVO DA INTERNAÇÃO / DIAGNÓSTICOS: [PREENCHER]
RESUMO DA EVOLUÇÃO / PROCEDIMENTOS / INTERCORRÊNCIAS: [PREENCHER]
CONDIÇÃO ATUAL / EXAME FÍSICO / SINAIS VITAIS: [PREENCHER]
JUSTIFICATIVA DA TRANSFERÊNCIA: [PREENCHER]
SUPORTE AINDA NECESSÁRIO: [PREENCHER]
MEDICAÇÕES / RECONCILIAÇÃO / ANTIMICROBIANOS COM DATAS E PLANO: [PREENCHER]
DISPOSITIVOS EM USO / DATAS / CUIDADOS: [PREENCHER]
NUTRIÇÃO / MOBILIDADE / OUTRAS NECESSIDADES: [PREENCHER]
EXAMES PENDENTES / SEGUIMENTO / RESPONSÁVEL: [PREENCHER]
PLANO POR PROBLEMAS / CRITÉRIOS PARA REAVALIAÇÃO: [PREENCHER]
EQUIPE RECEPTORA / COMUNICAÇÃO / HORÁRIO: [PREENCHER SE CONFIRMADOS]
MÉDICO / CRM: [PREENCHER]` },
{ id:'icu-family', area:'icu', title:'Conversa com familiares', description:'Informações transmitidas, dúvidas e decisões discutidas.', text:`REGISTRO DE COMUNICAÇÃO COM FAMILIARES — UTI
DATA/HORA / LOCAL: [PREENCHER]
PARTICIPANTES / VÍNCULO COM O PACIENTE / EQUIPE PRESENTE: [PREENCHER]
PARTICIPAÇÃO DO PACIENTE / CAPACIDADE DE COMUNICAÇÃO: [PREENCHER]
INFORMAÇÕES TRANSMITIDAS SOBRE ESTADO CLÍNICO, EVOLUÇÃO E INCERTEZAS: [PREENCHER]
DÚVIDAS APRESENTADAS / ESCLARECIMENTOS: [PREENCHER]
PREFERÊNCIAS E VALORES RELATADOS PELO PACIENTE / REPRESENTANTE: [PREENCHER]
DECISÕES DISCUTIDAS / FUNDAMENTAÇÃO / PARTICIPANTES: [REGISTRAR APENAS O QUE FOI EFETIVAMENTE DISCUTIDO E DEFINIDO]
PENDÊNCIAS / PRÓXIMA ATUALIZAÇÃO: [PREENCHER]
MÉDICO / CRM: [PREENCHER]` }
];
const documentsState={area:'emergency',id:'',drafts:{}};
function documentsPage(){
 const s=documentsState;
 const selected=documentTemplates.find(t=>t.id===s.id&&t.area===s.area);
 app.innerHTML=`<h2>Documentos</h2><p class="mute">Modelos para preencher, revisar e copiar.</p><div class="document-tabs" role="group" aria-label="Área dos documentos">${[['emergency','Emergência'],['icu','UTI']].map(([id,label])=>`<button class="chip ${s.area===id?'sel':''}" data-document-area="${id}" aria-pressed="${s.area===id}">${label}</button>`).join('')}</div><div id="document-content"></div>`;
 document.querySelectorAll('[data-document-area]').forEach(b=>b.onclick=()=>{s.area=b.dataset.documentArea;s.id='';documentsPage()});
 const content=$('#document-content');
 if(!selected){content.innerHTML=`<h3>${s.area==='icu'?'UTI':'Emergência'}</h3><div class="topic-menu">${documentTemplates.filter(t=>t.area===s.area).map(t=>`<button class="topic-button" data-document-id="${t.id}"><b>${esc(t.title)}</b><small>${esc(t.description)}</small><span aria-hidden="true">›</span></button>`).join('')}</div>`;document.querySelectorAll('[data-document-id]').forEach(b=>b.onclick=()=>{s.id=b.dataset.documentId;documentsPage();scrollTo(0,0)});return}
 content.innerHTML=`<button class="chip" id="document-back">← Modelos de ${s.area==='icu'?'UTI':'Emergência'}</button><h3>${esc(selected.title)}</h3><p class="warn">Preencha os campos entre colchetes e revise antes de usar. Registre somente dados avaliados e ações realizadas. O texto editado fica apenas nesta sessão; não é salvo após fechar ou recarregar.</p><label for="document-editor">Texto do documento</label><textarea id="document-editor" class="document-editor" spellcheck="true">${esc(s.drafts[selected.id]??selected.text)}</textarea><div class="document-actions"><button class="btn" id="document-copy">Copiar texto</button><button class="btn sec" id="document-reset">Restaurar modelo</button></div><p id="document-status" role="status" aria-live="polite"></p>`;
 const editor=$('#document-editor'),status=$('#document-status');
 editor.oninput=()=>{s.drafts[selected.id]=editor.value;status.textContent=''};
 $('#document-back').onclick=()=>{s.id='';documentsPage()};
 $('#document-reset').onclick=()=>{if(editor.value!==selected.text&&!window.confirm('Descartar as alterações deste texto e restaurar o modelo?'))return;delete s.drafts[selected.id];editor.value=selected.text;status.textContent='Modelo restaurado.'};
 $('#document-copy').onclick=async()=>{try{await navigator.clipboard.writeText(editor.value);status.textContent='Texto copiado. Revise os campos antes de inserir no prontuário.'}catch(_){editor.focus();editor.select();status.textContent='Não foi possível copiar automaticamente. O texto está selecionado para você copiar.'}};
}
