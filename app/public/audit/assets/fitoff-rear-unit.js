(function(g){
const stage=g.auditStages.fitoff,ids=['kitchen','bathroom','outdoor','recycled','rainwater-taps','hws'];
for(const s of stage.sections)s.area='Main house';
const rear=ids.map(id=>{const source=stage.sections.find(s=>s.id===id),s=structuredClone(source);s.sourceId=id;s.id='rear-'+id;s.title='Rear unit / '+source.title;s.area='Rear unit';return s;});
const finish=stage.sections.find(s=>s.id==='finish');stage.sections.splice(stage.sections.indexOf(finish),1);finish.area='Site completion';stage.sections.push(...rear,finish);
g.auditStageForState=(stage,st)=>stage.id!=='fitoff'?stage:{...stage,sections:stage.sections.filter(s=>s.area!=='Rear unit'||(st.clientName==='Escape Homes'&&st.rearUnit==='Yes'))};
const previousCode=g.auditPhotoCode,prefixes={'rear-kitchen':'R-KIT','rear-bathroom':'R-BTH','rear-outdoor':'R-POT','rear-recycled':'R-REC','rear-rainwater-taps':'R-RW','rear-hws':'R-HWS'};
g.auditPhotoCode=(s,p,i)=>p.code||(prefixes[s.id]?prefixes[s.id]+'-'+String(i+1).padStart(2,'0'):previousCode(s,p,i));
})(typeof window!=='undefined'?window:globalThis);
