/* Antídotos adultos: referências por apresentação. Não extrapolar à pediatria. */
const ANTIDOTE_ADDITIONS=[
  {
    "n": "Protamina",
    "g": "Antídoto",
    "pop": "a",
    "r": "IV lenta",
    "u": "mg",
    "c": 10,
    "indication": "Reversão de HNF; reversão parcial de enoxaparina.",
    "source": "https://www.dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=e1964129-33f4-4e4e-86e3-8e6a4e65bd83&type=display",
    "dil": "Referência: 50 mg/5 mL (10 mg/mL). Pode ser usada sem diluir ou com SF/SG 5% conforme bula. Administrar muito lentamente em 10 min; não exceder 50 mg nesse período.",
    "o": "Suspender heparina e revisar dose/horário. Monitorar sangramento, PA, ECG e coagulação; risco de hipotensão, anafilaxia e excesso com efeito anticoagulante. TTPA não quantifica adequadamente o efeito residual da enoxaparina; considerar anti-Xa conforme disponibilidade.",
    "aliases": "heparina HNF enoxaparina reversor sulfato de protamina",
    "manualDose": true,
    "doseText": "HNF: 1 mg neutraliza aproximadamente 100 UI ainda ativas. Reduzir conforme tempo decorrido; 30 min após bolus IV, metade pode bastar. Não usar a dose total histórica como se ainda estivesse circulante. Enoxaparina: última dose há <8 h, 1 mg de protamina por 1 mg de enoxaparina; 8–12 h, 0,5 mg/mg; ≥12 h pode dispensar, individualizar por sangramento/função renal. Neutralização anti-Xa incompleta (~60%); redose exige reavaliação.",
    "f": [
      0,
      0
    ],
    "references": [
      [
        "Bula Lovenox — reversão parcial",
        "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=de6fb917-a94a-41ea-9d7d-937d4080ffcd"
      ]
    ]
  },
  {
    "n": "Fitomenadiona (vitamina K1) — sangramento maior por varfarina",
    "g": "Antídoto",
    "pop": "a",
    "r": "IV lenta",
    "u": "mg",
    "c": 10,
    "indication": "Reversão de antagonista da vitamina K em sangramento maior.",
    "source": "https://www.acc.org/~/media/ed3636c050eb48ee85c934e5c920d27b.pdf",
    "dil": "Conferir apresentação própria para IV: referência 10 mg/mL. Diluir a dose em 25–50 mL de SF e infundir em 15–30 min, conforme produto/protocolo; não exceder 1 mg/min. Não aplicar apresentação exclusiva para IM por via IV.",
    "o": "Associar CCP de 4 fatores quando indicado; vitamina K isolada não reverte imediatamente a hemorragia. Monitorar INR e clínica. Pode causar reação grave mesmo lentamente; INR elevado sem sangramento tem outro esquema.",
    "aliases": "vitamina k warfarin varfarina reversao",
    "f": [
      5,
      10
    ]
  },
  {
    "n": "Complexo protrombínico de 4 fatores (CCP-4F)",
    "g": "Antídoto",
    "pop": "a",
    "r": "IV",
    "u": "UI",
    "c": 0,
    "indication": "Reversão urgente de varfarina em hemorragia maior ou procedimento urgente.",
    "source": "https://www.fda.gov/media/85512/download",
    "dil": "Esquema da bula KCENTRA: reconstituir somente com diluente/volume do kit. Potência de fator IX e volume variam: calcular pelos valores do frasco, sem assumir UI/mL fixas. Taxa de bula 0,12 mL/kg/min, máximo 8,4 mL/min; não transferir esta taxa para outra marca.",
    "o": "Associar vitamina K. Reavaliar INR e hemostasia; não repetir automaticamente. Risco de trombose; contraindicações da apresentação incluem HIT (contém heparina), CIVD e reação grave a componentes. Não equivale ao complexo ativado.",
    "aliases": "PCC 4F kcentra beriplex varfarina",
    "manualDose": true,
    "doseText": "Dose em UI de fator IX/kg conforme INR prévio: 2–<4 → 25 UI/kg (máx. 2.500 UI); 4–6 → 35 UI/kg (máx. 3.500 UI); >6 → 50 UI/kg (máx. 5.000 UI). Bula usa peso até 100 kg. Informar INR e selecionar produto antes de calcular; não há dose única por peso.",
    "f": [
      0,
      0
    ]
  },
  {
    "n": "Idarucizumabe",
    "g": "Antídoto",
    "pop": "a",
    "r": "IV",
    "u": "mg",
    "c": 50,
    "indication": "Reversão específica de dabigatrana em sangramento incontrolável/ameaçador à vida ou procedimento urgente.",
    "source": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=c7400f8a-dcf4-a6df-6d07-983081b1bf34",
    "dil": "Dose de 5 g = dois frascos de 2,5 g/50 mL (100 mL no total), administrados consecutivamente por infusão ou injeção IV conforme bula. Pronto para uso; não misturar com outros fármacos.",
    "o": "Não reverte rivaroxabana/apixabana, varfarina ou heparina. Monitorar hemostasia, função renal e testes adequados à dabigatrana; pode haver reaparecimento do efeito. Redose não automática; planejar reinício da anticoagulação conforme risco.",
    "aliases": "praxbind idarucizumab dabigatrana pradaxa",
    "f": [
      5000,
      5000
    ]
  },
  {
    "n": "N-acetilcisteína IV — intoxicação por paracetamol",
    "g": "Antídoto",
    "pop": "a",
    "r": "IV em etapas",
    "u": "mg",
    "c": 200,
    "indication": "Prevenção/tratamento de hepatotoxicidade por paracetamol.",
    "source": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=472f158a-5ab9-4308-8e49-1116e6ea3d39",
    "dil": "Referência 200 mg/mL; obrigatoriamente diluir. Esquema de 3 bolsas: 41–99 kg, adicionar cada dose respectivamente a 200, 500 e 1.000 mL de SG 5% (volumes de DILUENTE, não finais). Para 21–40 kg: 100, 250 e 500 mL. Restrição hídrica requer preparo validado. Não usar solução inalatória por via IV.",
    "o": "Avaliar tempo de ingestão, paracetamolemia, AST/ALT, INR, creatinina e glicemia. Nomograma aplica-se à ingestão aguda única com horário conhecido, não à repetida. Reavaliar antes de suspender; hepatotoxicidade/paracetamol detectável pode exigir prolongar. Vigiar hipersensibilidade e sobrecarga hídrica.",
    "aliases": "NAC acetilcisteina acetaminofeno paracetamol acetadote",
    "manualDose": true,
    "doseText": "3 etapas sequenciais em 21 h: 150 mg/kg em 1 h → 50 mg/kg em 4 h → 100 mg/kg em 16 h. ≥100 kg, a bula fixa as etapas em 15 g, 5 g e 10 g. Não administrar as três doses juntas nem em bolus.",
    "f": [
      0,
      0
    ]
  },
  {
    "n": "Fomepizol — dose de ataque",
    "g": "Antídoto",
    "pop": "a",
    "r": "IV em 30 min",
    "u": "mg",
    "c": 1000,
    "indication": "Intoxicação por metanol ou etilenoglicol.",
    "source": "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=7e133194-dacb-446a-a657-2d2430a02373&type=display",
    "dil": "Concentrado 1 g/mL: diluir a dose em pelo menos 100 mL de SF ou SG 5% e infundir em 30 min. Nunca injetar concentrado; não usar material de policarbonato em contato com o concentrado.",
    "o": "Ataque apenas. Sem hemodiálise: depois 10 mg/kg a cada 12 h por 4 doses; em seguida 15 mg/kg a cada 12 h até critérios de suspensão. Hemodiálise exige outro intervalo. Monitorar acidose, eletrólitos, rim e níveis do tóxico; avaliar diálise com toxicologia/nefrologia.",
    "aliases": "fomepizole metanol etilenoglicol alcool toxico",
    "k": [
      15,
      15
    ]
  },
  {
    "n": "Hidroxocobalamina — cianeto",
    "g": "Antídoto",
    "pop": "a",
    "r": "IV em 15 min",
    "u": "mg",
    "c": 25,
    "indication": "Intoxicação por cianeto, inclusive suspeita clínica relevante em fumaça de incêndio.",
    "source": "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=d56fcc8d-bd64-46ab-b0c0-2124bd745a6b&type=display",
    "dil": "Kit de 5 g: reconstituir com 200 mL de SF conforme fabricante (25 mg/mL); infundir em 15 min. Pode repetir 5 g conforme gravidade/resposta, em 15 min–2 h; total máximo 10 g. Usar linha apropriada e verificar incompatibilidades.",
    "o": "Não confundir com ampola de vitamina B12 de baixa dose. Pode elevar PA, avermelhar pele/urina e interferir em exames e detectores de fuga de sangue de hemodiálise. Vigiar função renal/lesão por oxalato; coletar exames antes se isso não atrasar tratamento.",
    "aliases": "cyanokit cianeto fumaca vitamina b12",
    "f": [
      5000,
      5000
    ]
  },
  {
    "n": "Azul de metileno — metemoglobinemia",
    "g": "Antídoto",
    "pop": "a",
    "r": "IV em 5–30 min",
    "u": "mg",
    "c": 5,
    "indication": "Metemoglobinemia adquirida clinicamente relevante.",
    "source": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4f6848e5-35ed-4046-b13c-3032b5ba3232",
    "dil": "Referência PROVAYBLUE 5 mg/mL (0,5%); não confundir com 1% (10 mg/mL). Pode diluir a dose em 50 mL de SG 5%; evitar SF nesta apresentação. Infundir em 5–30 min.",
    "o": "Contraindicado em deficiência de G6PD e hipersensibilidade. Risco de síndrome serotoninérgica com serotoninérgicos/opioides. Reavaliar metHb/clínica após 1 h; uma segunda dose de 1 mg/kg pode ser indicada, mas eGFR 15–59 exige dose única pela bula. Persistência após duas doses: alternativa especializada.",
    "aliases": "methylene blue metHb metahemoglobinemia",
    "k": [
      1,
      1
    ]
  },
  {
    "n": "Octreotida — hipoglicemia por sulfonilureia",
    "g": "Antídoto",
    "pop": "a",
    "r": "SC",
    "u": "mcg",
    "c": 100,
    "indication": "Hipoglicemia recorrente por sulfonilureias, junto à correção inicial com glicose.",
    "source": "https://atlanticcanadapoisoncentre.ca/octreotide-adult.html",
    "dil": "Referência 100 mcg/mL: SC sem diluir. Esquema adulto 50–100 mcg SC a cada 6–12 h, ajustado com toxicologia. Outras apresentações alteram o volume.",
    "o": "Não substitui glicose no resgate inicial. Monitorar glicemia seriada e bradicardia. A referência orienta observação por ao menos 24 h após a última dose e 8 h após interromper glicose IV; individualizar pelo agente e quadro. Não é antídoto de rotina para toda hipoglicemia.",
    "aliases": "octreotide glibenclamida gliclazida sulfonilureia",
    "f": [
      50,
      100
    ]
  },
  {
    "n": "Fab antidigoxina (DigiFab)",
    "g": "Antídoto",
    "pop": "a",
    "r": "IV",
    "u": "mg",
    "c": 10,
    "indication": "Toxicidade digitálica com ameaça à vida.",
    "source": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?audience=consumer&setid=c05ee6a5-c98b-45f4-83fd-40781639d653",
    "dil": "Frasco 40 mg: reconstituir com 4 mL de água para injetáveis (~10 mg/mL). Diluir conforme bula em SF e infundir habitualmente em pelo menos 30 min; parada iminente pode exigir estratégia urgente especializada.",
    "o": "Monitorar ECG, potássio e função renal; pode ocorrer queda rápida do K e perda do efeito terapêutico da digoxina. Digoxinemia total fica pouco interpretável após Fab. Vigiar recrudescência, sobretudo na insuficiência renal.",
    "aliases": "digoxina digitalicos digifab digibind anticorpo",
    "manualDose": true,
    "doseText": "Número de frascos depende da carga corporal de digoxina e do contexto agudo/crônico. Cada frasco de 40 mg liga aproximadamente 0,5 mg de digoxina. Usar dose absorvida ou concentração pré-Fab em momento adequado, com toxicologia; não converter diretamente a dose ingerida sem considerar biodisponibilidade.",
    "f": [
      0,
      0
    ]
  },
  {
    "n": "Piridoxina (vitamina B6) — intoxicação por isoniazida",
    "g": "Antídoto",
    "pop": "a",
    "r": "IV",
    "u": "mg",
    "c": 100,
    "indication": "Convulsões por intoxicação por isoniazida — esquema adulto de referência.",
    "source": "https://atlanticcanadapoisoncentre.ca/pyridoxine-adult.html",
    "dil": "Referência 100 mg/mL: 5 g = 50 mL. Para 5 g/100 mL, retirar 50 mL de bolsa de SF de 100 mL e adicionar 50 mL de piridoxina. Proteger da luz. Administrar em 10 min.",
    "o": "Se convulsões cessarem antes de 10 min, a referência orienta infundir o restante em 4 h. Pode repetir uma vez se persistência/recorrência, sob toxicologia. Garantir suporte de via aérea e tratamento anticonvulsivante. Dose/preparo não devem ser transferidos a outras indicações.",
    "aliases": "isoniazida INH vitamina b6 pyridoxine",
    "f": [
      5000,
      5000
    ]
  }
];
function ensureAntidotes(doc){if(!doc||!Array.isArray(doc.drugs))return doc;for(const row of ANTIDOTE_ADDITIONS)if(!doc.drugs.some(d=>d.pop===row.pop&&d.n===row.n))doc.drugs.push(JSON.parse(JSON.stringify(row)));return doc}
function drugReferences(d){const refs=[...(d.source?[['Referência clínica',d.source]]:[]),...(Array.isArray(d.references)?d.references:[])].filter(r=>Array.isArray(r)&&/^https:\/\//.test(r[1]));return refs.length?`<p class="protocol-refs">${refs.map(([label,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`).join(' · ')}</p>`:''}
function manualDrugCard(d){return `<div class="card"><h3>${esc(d.n)}</h3><p><span class="tag">${esc(d.g)}</span><span class="tag">${esc(d.r)}</span><span class="tag">Esquema individualizado</span></p>${d.indication?`<p><b>Indicação:</b> ${esc(d.indication)}</p>`:''}<div class="res"><b>Posologia</b><p class="preserve-lines">${esc(d.doseText)}</p></div><p><b>Preparo e administração:</b> ${esc(d.dil||'Conferir produto.')}</p><p>${esc(d.o||'')}</p>${drugReferences(d)}</div>`}
