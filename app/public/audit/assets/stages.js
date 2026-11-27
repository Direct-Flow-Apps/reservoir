(function(g){
const photo=(id,label,optional=false)=>({id,label,optional});
const section=(id,title,questions,photos,extra={})=>({id,title,questions,photoRequirements:photos,photoHint:'Add clear photos for each required item.',...extra});
const common=[
'Wastes leak-free and properly tightened?',
'Mini stops leak-free with sufficient Teflon applied?',
'Taps leak-free?',
'Aerators clear?',
'Taps securely fixed with a socket set and not loose?',
'Flexi-hoses tightened with shifters?',
'Cover plates installed and fully covering the holes?',
'Plug and washer sealed, with the sink or basin holding water?'];
const toilet=[
'Toilet free of leaks?',
'Toilet seat securely fastened?',
'Toilet siliconed to the floor?',
'Toilet mini stop and flexi-hose free of leaks?',
'Pan screws installed?',
'Cistern hard back against the wall?'];
const shower=[
'Shower free of leaks?',
'Mixer leak-free and properly tightened?',
'Shower rail secure and correctly located?',
'Plate mixers level?'];
const cover=photo('covers','Cover plates fully covering holes');
const running=photo('running','Everything running');
const roomPhotos=[cover,photo('shower-rail','Shower rail',true),photo('plate-mixers','Level plate mixers',true),photo('toilet','Toilet',true)];
const fitoff=[
section('kitchen','Kitchen',[...common,'Dishwasher holes cut?','Sink correctly clipped?','Sink foam installed correctly and sink firmly down to the bench?','Fridge point installed where required?'],[photo('dishwasher-holes','Cut dishwasher holes'),cover,photo('sink-clips','Sink clips'),photo('sink','Installed sink'),photo('fridge-point','Fridge point',true),running]),
section('pantry',"Butler's pantry",[...common.slice(2),'Sink correctly clipped?','Sink foam installed correctly and sink firmly down to the bench?','Fridge point installed where required?'],[cover,photo('sink-clips','Sink clips'),photo('sink','Installed sink'),photo('fridge-point','Fridge point',true),running]),
section('bathroom','Bathroom',[...common,...shower,...toilet,'Bath leak-free where fitted?','Freestanding bath level and not wobbling?','Bath support correctly supporting the bath?'],[...roomPhotos,photo('bath','Installed bath',true),running]),
section('ensuite','Ensuite',[...common,...shower,...toilet,'Bath correctly installed and leak-free where fitted?'],[...roomPhotos,running]),
section('ensuite2','Ensuite 2',[...common,...shower,...toilet],[...roomPhotos,running]),
section('laundry','Laundry',[...common,'Sink correctly clipped?','Sink foam installed correctly and sink firmly down to the bench?','Washing machine stops installed and leak-free?','Washing machine stop caps installed?'],[cover,photo('sink','Installed sink'),running]),
section('wc','WC',[...toilet,'Cover plates installed and fully covering holes?','Toilet centred in the room?'],[cover,running],{fields:[{id:'basin',label:'Is there a basin installed?',options:['Yes','No']}]}),
section('powder','Powder room',[...common,...toilet],[cover,running]),
section('outdoor','External taps',['All external taps connected and leak-free?','Front tap securely screwed back?','Vacuum breakers installed on potable taps?'],[photo('external-taps','External taps and vacuum breakers')]),
section('hws','Hot water system',['HWS looped?'],[photo('hws-loop','HWS loop and connections')]),
section('recycled','Recycled water',['Recycled water tap installed?','Recycled water key installed?','Recycled water sign installed?'],[photo('recycled','Recycled water tap, key and sign')]),
section('gas','Gas retest',['Gas retested at 2.76 kPa?'],[photo('gas-retest','Gas retest at 2.76 kPa')]),
section('general','General / additional photos',[],[photo('general','General or additional job photos')]),
section('finish','Site finish / OHS',['Site left clean?','All doors securely locked?','All lights turned off?','Gate properly shut?','Bin photos sent to the supervisor?'],[photo('clean-site','Clean site'),photo('bin','Bin, regardless of its condition')])
];
const appliances=[
section('solar','Solar test',['Solar tested before installing the hot water system?'],[photo('solar-test','Solar test evidence')]),
section('gas','Gas test',['Gas line tested with the appliances?'],[photo('gas-meter','Gas meter with soap on joints'),photo('operating-pressure','Gas test at operating pressure')]),
section('dishwasher','Dishwasher',['Dishwasher waste hole drilled out before connecting the waste?','Dishwasher tested?'],[photo('dishwasher-water','Water in the dishwasher during the test')]),
section('appliances','Installed appliances',[],[photo('installed-appliances','All installed appliances')]),
section('tapware','Tapware and traps',['Mixers retightened?','Traps retightened?','All tapware leak tested?','All basins and sinks leak tested?'],[photo('tapware-tests','Tapware, basins and sinks during leak testing')]),
section('toilets','Toilets',['Toilet seats tight?','Cisterns tight and back against the wall?'],[photo('toilets','Toilet seats and cisterns')]),
section('hws','HWS clearance',[],[photo('hws-clearance','HWS clearance')]),
section('cooktop','Cooktop and rangehood',['Cooktop clearance to the rangehood at least 650 mm, measured from the trivet / grate?'],[photo('cooktop-rangehood','Cooktop and rangehood clearance')]),
section('finish','Site finish',['Site left clean?','All boxes flattened in the bin?'],[photo('bin','Bin, regardless of its condition'),photo('clean-site','Clean site'),photo('flat-boxes','All boxes flattened in the bin')])
];
const rough=g.auditSections.map(s=>({...s,photoRequirements:[photo('work',s.id==='finish'?'Bin, regardless of its condition':'Completed work and any defects')]}));
g.auditStages={
roughin:{id:'roughin',label:'Rough-in',title:'Rough-in audit',file:'Rough-In',sections:rough,followups:false},
fitoff:{id:'fitoff',label:'Fit-off',title:'Fit-off audit',file:'Fit-Off',sections:fitoff,followups:true},
appliances:{id:'appliances',label:'Appliances',title:'Appliances audit',file:'Appliances',sections:appliances,followups:true}
};
g.auditStageMetrics=function(stage,state){let yes=0,no=0,na=0,blank=0;stage.sections.filter(s=>state.status[s.id]==='applies').forEach(s=>s.questions.forEach((q,i)=>{if(g.auditQuestionIsApplicable&&!g.auditQuestionIsApplicable(s,i,state)){na++;return;}const v=state.answers[s.id+':'+i];if(v==='Yes')yes++;else if(v==='No')no++;else if(v==='N/A')na++;else blank++;}));return {yes,no,na,blank,score:yes+no?Math.round(100*yes/(yes+no)):null,unselected:stage.sections.filter(s=>!state.status[s.id]).length,excluded:stage.sections.filter(s=>state.status[s.id]==='na').length};};
g.auditRequiredPhotos=function(section,state){return section.photoRequirements.filter(r=>!r.optional||state.photoNA[section.id+':'+r.id]!==true);};
g.auditMissingPhotos=function(stage,state){return stage.sections.filter(s=>state.status[s.id]==='applies').flatMap(s=>g.auditRequiredPhotos(s,state).filter(r=>!state.photos[s.id].some(p=>p.requirement===r.id)).map(r=>({section:s,requirement:r})));};
const originalCode=g.auditPhotoCode;
const extraPrefixes={general:'GEN',hws:'HWS',dishwasher:'DW',appliances:'APP',tapware:'TAP',toilets:'WC',cooktop:'CKT'};
g.auditPhotoCode=function(s,p,i){return p.code||(extraPrefixes[s.id]?extraPrefixes[s.id]+'-'+String(i+1).padStart(2,'0'):originalCode(s,p,i));};
})(typeof window!=='undefined'?window:globalThis);
