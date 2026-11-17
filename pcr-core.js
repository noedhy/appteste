/* Dose PS · clinical decision support, AHA 2025 / PRN-SBP 2026.
   Pure calculations and state transitions: no intervention is inferred from a timer. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PCRCore=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const RHYTHMS={fv:'Fibrilação ventricular',tv:'TV sem pulso',asystole:'Assistolia',pea:'AESP'};
const round=n=>Math.round((n+Number.EPSILON)*10000)/10000;
function weight(mode,value){if(value===''||value==null)return null;const n=Number(String(value).replace(',','.'));return Number.isFinite(n)&&n>0&&n<=(mode==='neo'?10:250)?n:null}
function dose(mode,w,amioCount=0){const kg=weight(mode,w);if(mode!=='adult'&&!kg)return null;
const epi=mode==='adult'?1:mode==='ped'?Math.min(.01*kg,1):.02*kg;
const amio=mode==='neo'?null:mode==='adult'?(amioCount===0?300:amioCount===1?150:null):(amioCount<3?Math.min(5*kg,amioCount===0?300:150):null);
return {epi:round(epi),epiMl:round(epi/.1),amio,et:mode==='neo'?round(.1*kg):null,etMl:mode==='neo'?round(kg):null};}
function shock(mode,w,count,adultMax){if(mode==='neo')return null;if(mode==='adult')return {text:'Bifásico: energia do fabricante (inicial geralmente 120–200 J); se desconhecida, máxima disponível. Próximos: mesma energia ou maior. Monofásico: 360 J.'};const kg=weight(mode,w),max=Number(adultMax);if(!kg||!Number.isFinite(max)||max<=0||max>360)return null;return {joules:round(Math.min((count===0?2:4)*kg,max)),max:round(Math.min(10*kg,max)),later:count>=2};}
function create(mode='adult'){if(!['adult','ped','neo'].includes(mode))throw Error('Perfil inválido');return {version:1,mode,weight:null,adultMax:null,gest:'',rhythm:null,phase:mode==='neo'?'initial':'assess',started:null,ended:null,cycle:null,cycleSeconds:mode==='neo'?60:120,shocks:0,amio:0,epiTimes:[],events:[],outcome:null};}
function elapsed(s,now){return s.started==null?0:Math.max(0,Math.floor(((s.ended??now)-s.started)/1000))}
function remaining(s,now){return s.cycle==null?null:s.cycleSeconds-Math.max(0,Math.floor(((s.ended??now)-s.cycle)/1000))}
function log(s,now,text){s.events.push({at:now,text});}
function running(s){return s.started!==null&&s.ended===null}
function start(s,now){if(s.started!==null)return false;s.started=now;s.cycle=now;log(s,now,'Atendimento iniciado · '+s.mode);return true}
function rhythm(s,key,now){if(!running(s)||s.mode==='neo'||!RHYTHMS[key])return false;s.rhythm=key;s.phase=key==='fv'||key==='tv'?'shock':'cpr';if(s.phase==='cpr'){s.cycle=now;s.cycleSeconds=120}log(s,now,'Ritmo confirmado: '+RHYTHMS[key]);return true}
function recordShock(s,now){if(!running(s)||s.phase!=='shock'||!['fv','tv'].includes(s.rhythm))return false;if(s.mode==='ped'&&!shock(s.mode,s.weight,s.shocks,s.adultMax))return false;s.shocks++;s.phase='cpr';s.cycle=now;s.cycleSeconds=120;log(s,now,'Choque '+s.shocks+' confirmado; RCP retomada');return true}
function epiReady(s,now){if(!running(s))return false;if(s.mode==='neo'&&s.phase!=='meds')return false;return !s.epiTimes.length||now-s.epiTimes[s.epiTimes.length-1]>=180000}
function recordEpi(s,now){const d=dose(s.mode,s.weight,s.amio);if(!d||!epiReady(s,now))return false;s.epiTimes.push(now);log(s,now,'Adrenalina IV/IO confirmada: '+d.epi+' mg ('+d.epiMl+' mL a 0,1 mg/mL)');return true}
function recordAmio(s,now){const d=dose(s.mode,s.weight,s.amio);if(!running(s)||s.shocks<3||!['fv','tv'].includes(s.rhythm)||d?.amio==null||s.amioShock===s.shocks)return false;s.amioShock=s.shocks;s.amio++;log(s,now,'Amiodarona IV/IO confirmada: '+d.amio+' mg');return true}
function neonatal(s,phase,now){if(!running(s)||s.mode!=='neo')return false;const transitions={initial:['vent','care'],vent:['vent','compress','care'],compress:['vent','meds','care'],meds:['vent','meds','care'],care:['vent']};if(!transitions[s.phase]?.includes(phase))return false;
if(phase==='compress'&&(s.phase!=='vent'||remaining(s,now)>0))return false;
if(phase==='meds'&&s.phase==='compress'&&remaining(s,now)>0)return false;
s.phase=phase;s.cycle=now;s.cycleSeconds=phase==='vent'?30:60;log(s,now,'Etapa neonatal: '+({vent:'VPP efetiva',compress:'Compressões + VPP 3:1',meds:'FC <60 após compressões e ventilação efetivas',care:'FC ≥100 e respiração espontânea adequada'}[phase]));return true}
function finish(s,now,outcome){if(!running(s))return false;s.ended=now;s.outcome=outcome;log(s,now,outcome);return true}
return {RHYTHMS,weight,dose,shock,create,elapsed,remaining,running,start,rhythm,recordShock,epiReady,recordEpi,recordAmio,neonatal,finish,log};
});
