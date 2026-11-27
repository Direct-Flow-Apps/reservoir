(function(g){
const stage=g.auditStages.fitoff;
const photo=(id,label,fixture,optional=false)=>({id,label,fixture,optional});
for(const s of stage.sections){
const original=s.photoRequirements;s.fitoffFixtureControls=true;
if(['kitchen','pantry','laundry'].includes(s.id)){
s.photoRequirements=original.filter(r=>!['sink','running'].includes(r.id));
s.photoRequirements=s.photoRequirements.map(r=>r.id==='sink-clips'?{...r,fixture:'Sink'}:r.id==='dishwasher-holes'?{...r,fixture:'Dishwasher'}:r.id==='fridge-point'?{...r,fixture:'Fridge point'}:r);
s.photoRequirements.push(photo('fixture-sink-running','Sink installed and running / being tested','Sink'));
}
if(['bathroom','ensuite','ensuite2'].includes(s.id)){
s.photoRequirements=original.filter(r=>!['shower-rail','toilet','bath','running'].includes(r.id));
s.photoRequirements=s.photoRequirements.map(r=>r.id==='plate-mixers'?{...r,fixture:'Shower'}:r);
s.photoRequirements.push(photo('fixture-basin-running','Basin installed and running / being tested','Basin'));
s.photoRequirements.push(photo('fixture-toilet-running','Toilet installed and flushing / being tested','Toilet',true));
if(s.id!=='ensuite2')s.photoRequirements.push(photo('fixture-bath-running','Bath installed and running / being tested','Bath',true));
s.photoRequirements.push(photo('fixture-shower-running','Shower installed and running / being tested','Shower',true));
}
if(s.id==='powder'){
s.photoRequirements=original.filter(r=>r.id!=='running');
s.photoRequirements=s.photoRequirements.map(r=>r.id==='plate-mixers'?{...r,fixture:'Shower'}:r);
s.photoRequirements.push(photo('fixture-basin-running','Basin installed and running / being tested','Basin'));
s.photoRequirements.push(photo('fixture-toilet-running','Toilet installed and flushing / being tested','Toilet'));
}
if(s.id==='wc'){
s.photoRequirements=original.filter(r=>r.id!=='running');
s.photoRequirements.push(photo('fixture-toilet-running','Toilet installed and flushing / being tested','Toilet'));
s.photoRequirements.push(photo('fixture-basin-running','Basin installed and running / being tested','Basin',true));
}
if(s.id==='outdoor'){
s.title='Potable taps';s.questions[0]='All potable external taps connected and leak-free?';s.questions[1]='Front potable tap securely screwed back?';s.questionFixtures=s.questions.map(()=>'Potable taps');
s.photoRequirements=[photo('fixture-potable-running','Potable taps installed and running, showing vacuum breakers','Potable taps')];
}
if(s.id==='recycled'){
s.title='Recycled taps (if applicable)';s.questionFixtures=s.questions.map(()=>'Recycled taps');
s.photoRequirements=[photo('fixture-recycled-running','Recycled tap installed and running, with key and sign visible','Recycled taps')];
}
}
const rain={id:'rainwater-taps',title:'Rainwater taps (if applicable)',questions:['Rainwater taps installed where specified on the plans?','Rainwater taps connected and leak-free?','Rainwater sign fitted above each tap?'],questionFixtures:['Rainwater taps','Rainwater taps','Rainwater taps'],photoRequirements:[photo('fixture-rainwater-running','Rainwater tap installed and running, with sign above the tap visible','Rainwater taps')],fitoffFixtureControls:true,photoHint:'Show the rainwater tap running and its sign above it. Add more photos if needed.'};
stage.sections.splice(stage.sections.findIndex(s=>s.id==='recycled')+1,0,rain);const tapSections=['outdoor','recycled','rainwater-taps'].map(id=>stage.sections.find(s=>s.id===id)),tapIndex=stage.sections.findIndex(s=>s.id==='outdoor'),otherSections=stage.sections.filter(s=>!tapSections.includes(s));otherSections.splice(tapIndex,0,...tapSections);stage.sections.splice(0,stage.sections.length,...otherSections);
// Display applicability consistently in the UI and missing-evidence validation.
g.auditEvidenceFor=(s,st)=>s.photoRequirements.filter(r=>!st.fixtureNA?.[s.id+':'+r.fixture]).filter(r=>!(s.id==='wc'&&r.fixture==='Basin'&&st.fields['wc:basin']==='No')).map(r=>r.id.startsWith('fixture-')?{...r,optional:false}:r);
g.auditLegacyFixture=(s,p)=>s.fitoffFixtureControls?({sink:'Sink',toilet:'Toilet',bath:'Bath','shower-rail':'Shower','fridge-point':'Fridge point','sink-clips':'Sink','dishwasher-holes':'Dishwasher','plate-mixers':'Shower'}[p.requirement]):undefined;
g.auditQuestionIsApplicable=(s,i,st)=>!s.fitoffFixtureControls||(!st.fixtureNA?.[s.id+':'+s.questionFixtures?.[i]]&&!(s.id==='wc'&&s.questionFixtures?.[i]==='Basin'&&st.fields['wc:basin']==='No'));
const required=g.auditRequiredPhotos;
g.auditRequiredPhotos=(s,st)=>required({...s,photoRequirements:g.auditEvidenceFor(s,st)},st);
})(typeof window!=='undefined'?window:globalThis);
