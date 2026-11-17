/* Dose PS - Atenção Primária. Clinical rules and original WHO LMS tables, reviewed 2026-11-14. */
(function(root){
'use strict';
const riskHigh=['Pré-eclâmpsia em gestação anterior','Gestação múltipla','Obesidade pré-gestacional (IMC > 30 kg/m²)','Hipertensão arterial crônica','Diabetes tipo 1 ou 2 pré-gestacional','Doença renal crônica','Doença autoimune (ex.: lúpus ou SAF)','Gestação por fertilização in vitro'];
const riskModerate=['Nuliparidade','Mãe ou irmã com pré-eclâmpsia','Idade materna ≥ 35 anos','Intervalo > 10 anos desde a última gestação','Condição socioeconômica desfavorável','Raça/cor preta ou parda (marcador de desigualdade social, não biológico)','Gestação prévia com disfunção placentária/desfecho adverso (DPP, RCF, prematuridade ou óbito fetal)'];
function ageDays(birth,assessment){
 const parse=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s||''))throw Error('Informe as duas datas.');const [y,m,d]=s.split('-').map(Number),dt=new Date(Date.UTC(y,m-1,d));if(dt.getUTCFullYear()!==y||dt.getUTCMonth()!==m-1||dt.getUTCDate()!==d)throw Error('Data inválida.');return dt.getTime();};
 const n=(parse(assessment)-parse(birth))/86400000;if(n<0)throw Error('A avaliação não pode ser anterior ao nascimento.');return n;
}
function tableFor(kind,sex,days,data=root.APS_WHO){
 if(!data||!['boys','girls'].includes(sex)||!Number.isFinite(days)||days<0)throw Error('Dados inválidos ou tabelas indisponíveis.');
 let key=kind+'_'+sex,x=days;
 if(days>1856){key=kind+'5_'+sex;x=days/30.4375;}
 const table=data[key];
 if(!table||x<table.rows[0][0]||x>table.rows[table.rows.length-1][0])throw Error(kind==='hcfa'?'Perímetro cefálico: referência disponível até 60 meses completos.':kind==='wfa'?'Peso/idade: referência disponível somente até 10 anos.':'Fora do intervalo da referência OMS (até 19 anos).');
 const a=table.rows;let lo=0,hi=a.length-1;while(lo<hi){const mid=Math.floor((lo+hi)/2);if(a[mid][0]<x)lo=mid+1;else hi=mid;}
 let row=a[lo];if(row[0]!==x&&lo>0){const prev=a[lo-1],t=(x-prev[0])/(row[0]-prev[0]);row=row.map((v,i)=>i===0?x:prev[i]+t*(v-prev[i]));}
 return{key,x,row,table};
}
function measurementAt(row,z){const [,L,M,S]=row;if(Math.abs(z)<=3)return Math.abs(L)<1e-8?M*Math.exp(S*z):M*Math.pow(1+L*S*z,1/L);const sign=z>0?1:-1,a=measurementAt(row,sign*3),b=measurementAt(row,sign*2);return a+(Math.abs(z)-3)*(a-b);}
function zscore(value,row){
 const [,L,M,S]=row;if(!(value>0))throw Error('A medida deve ser maior que zero.');
 let z=Math.abs(L)<1e-8?Math.log(value/M)/S:(Math.pow(value/M,L)-1)/(L*S);
 if(z>3){const a=measurementAt(row,3),b=measurementAt(row,2);z=3+(value-a)/(a-b);}
 if(z< -3){const a=measurementAt(row,-3),b=measurementAt(row,-2);z=-3+(value-a)/(b-a);}
 return z;
}
function percentile(z){const t=1/(1+.2316419*Math.abs(z));const p=1-Math.exp(-z*z/2)/Math.sqrt(2*Math.PI)*t*(.319381530+t*(-.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));return 100*(z<0?1-p:p);}
function classify(kind,z,months){
 if(kind==='wfa')return z< -3?'Muito baixo peso para a idade':z< -2?'Baixo peso para a idade':z<=2?'Peso adequado para a idade':'Peso elevado para a idade';
 if(kind==='lhfa')return z< -3?'Muito baixa estatura para a idade':z< -2?'Baixa estatura para a idade':'Estatura adequada para a idade';
 if(kind==='hcfa')return z< -2?'Perímetro cefálico abaixo de −2 Z: avaliar':z>2?'Perímetro cefálico acima de +2 Z: avaliar':'Perímetro cefálico na faixa −2 a +2 Z';
 if(z< -3)return 'Magreza acentuada';if(z< -2)return 'Magreza';
 if(months<60)return z<=1?'Eutrofia':z<=2?'Risco de sobrepeso':z<=3?'Sobrepeso':'Obesidade';
 return z<=1?'Eutrofia':z<=2?'Sobrepeso':z<=3?'Obesidade':'Obesidade grave';
}
function growth(input,data=root.APS_WHO){
 const days=ageDays(input.birth,input.date),months=days/30.4375,kind=input.kind;
 if(!['wfa','lhfa','bfa','hcfa'].includes(kind))throw Error('Selecione o indicador.');
 if(input.premature)throw Error('As curvas desta calculadora usam idade cronológica para crianças a termo. Para prematuros, avalie idade corrigida e referência específica antes de classificar.');
 if(input.edema&&['wfa','bfa'].includes(kind))throw Error('Edema altera o peso: não classificar peso/IMC automaticamente.');
 const table=tableFor(kind,input.sex,days,data);let value,adjusted=null;
 if(kind==='lhfa'||kind==='bfa'){
  const h=Number(input.height);if(!(h>=30&&h<=230))throw Error('Confira a medida em centímetros (30 a 230 cm).');
  if(!['lying','standing'].includes(input.position))throw Error('Informe se a medida foi deitada ou em pé.');
  adjusted=h+(days<731&&input.position==='standing'?.7:days>=731&&input.position==='lying'?-.7:0);
 }
 if(['wfa','bfa'].includes(kind)){if(!(Number(input.weight)>=.5&&Number(input.weight)<=300))throw Error('Confira o peso em kg (0,5 a 300 kg).');value=kind==='wfa'?Number(input.weight):Number(input.weight)/Math.pow(adjusted/100,2);}
 if(kind==='lhfa')value=adjusted;
 if(kind==='hcfa'){value=Number(input.head);if(!(value>=20&&value<=65))throw Error('Confira o perímetro cefálico em cm (20 a 65 cm).');}
 const z=zscore(value,table.row),limits=kind==='lhfa'?[-6,6]:kind==='hcfa'?[-5,5]:kind==='wfa'?[-6,5]:[-5,5];
 if(z<limits[0]||z>limits[1])throw Error('Medida fora dos limites de plausibilidade OMS. Confira datas, unidade e técnica; não emitir classificação automática.');
 return{...table,kind,days,months,value,z,percentile:percentile(z),classification:classify(kind,z,input.date < String(Number(input.birth.slice(0,4))+5)+input.birth.slice(4)?59:60),adjusted,input};
}
function prevention(input){
 const weeks=Number(input.weeks),days=Number(input.days);if(input.weeks===''||input.days===''||!Number.isInteger(weeks)||!Number.isInteger(days)||weeks<0||weeks>42||days<0||days>6)throw Error('Informe IG válida em semanas completas e dias (0 a 6).');
 const ig=weeks+days/7,high=input.high||[],moderate=input.moderate||[];
 if(high.length!==riskHigh.length||moderate.length!==riskModerate.length||[...high,...moderate].some(v=>v!=='yes'&&v!=='no'))throw Error('Avalie todos os fatores de risco. Use “não” somente após conferir a história.');
 if(!['yes','no'].includes(input.pe)||!['yes','no'].includes(input.using)||!['yes','no'].includes(input.asaSafety)||!['yes','no'].includes(input.calciumSafety))throw Error('Complete a revisão de segurança e o uso atual de AAS.');
 if(!['ms','2026'].includes(input.protocol))throw Error('Selecione o protocolo de cálcio adotado pelo serviço.');
 const nh=high.filter(v=>v==='yes').length,nm=moderate.filter(v=>v==='yes').length,indicated=nh>=1||nm>=2;let asa;
 if(input.pe==='yes')asa='Pré-eclâmpsia já diagnosticada: AAS não trata a doença. A RBEHG orienta suspender AAS profilático nesse cenário; avaliar e conduzir o caso obstétrico.';
 else if(input.asaSafety==='yes')asa='Há contraindicação ou precaução relevante: não emitir recomendação automática de AAS. Revisar alergia/broncoespasmo por AINE, sangramento/úlcera ativa, coagulopatia e tratamentos associados.';
 else if(!indicated)asa='Não há indicação de iniciar AAS pelos fatores clínicos preenchidos. Isso não exclui indicação por rastreio combinado ou outra condição avaliada pelo obstetra; não suspender tratamento existente apenas por este resultado.';
 else if(ig<12)asa='Há indicação pelos fatores clínicos. Planejar AAS a partir de 12 semanas, preferencialmente antes de 16 semanas, após prescrição e revisão clínica.';
 else if(ig>=36)asa='IG ≥ 36 semanas: não iniciar AAS profilático. Se em uso para esta finalidade, a RBEHG orienta suspensão com 36 semanas; confirmar a conduta assistente.';
 else if(input.using==='yes')asa='Há indicação pelos fatores clínicos. Se em uso e sem contraindicações, manter o esquema prescrito até 36 semanas conforme RBEHG 2025.';
 else if(ig>20)asa='Há indicação pelos fatores clínicos, mas a IG está além da janela de início recomendada pela RBEHG (até 20 semanas). Individualizar com obstetra; não iniciar automaticamente.';
 else asa='Indicação de AAS pelos fatores clínicos: esquema RBEHG 2025 de 100 mg VO à noite, até 36 semanas. Iniciar preferencialmente entre 12 e 16 semanas; o protocolo admite início até 20 semanas.';
 let calcium=input.protocol==='2026'?'RBEHG/FEBRASGO, março de 2026: não recomendar cálcio exclusivamente para prevenção de pré-eclâmpsia. Avaliar indicação nutricional ou outras indicações individualmente.':ig<12?'Ministério da Saúde, NT 251/2024: suplementação universal a partir de 12 semanas até o parto. Planejar início; não antecipar automaticamente.':'Ministério da Saúde, NT 251/2024: 1.000 mg/dia de cálcio elementar até o parto. Exemplo: carbonato de cálcio 1.250 mg (500 mg elementar) por comprimido, 1 comprimido 2 vezes/dia. Separar do ferro por pelo menos 2 horas.';
 if(input.calciumSafety==='yes')calcium='Há contraindicação/precaução (ex.: hipercalcemia, doença renal ou litíase): individualizar antes de suplementar. '+calcium;
 return{nh,nm,indicated,asa,calcium,ig,protocol:input.protocol};
}
root.DosePSAPS={ageDays,tableFor,measurementAt,zscore,percentile,classify,growth,prevention,riskHigh,riskModerate};
})(typeof window==='undefined'?globalThis:window);
