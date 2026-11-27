(function(global){
function createAuditPdf(data,jsPDF){
const rectification=data.reportType==='rectification';
if(rectification){const answers={},notes={};const selected=data.sections.filter(s=>data.status[s.id]==='applies').map(s=>{const failed=s.questions.map((q,i)=>({q,key:s.id+':'+i})).filter(x=>data.answers[x.key]==='No');failed.forEach((x,i)=>{answers[s.id+':'+i]='No';notes[s.id+':'+i]=data.notes[x.key]||''});return {...s,questions:failed.map(x=>x.q)}}).filter(s=>s.questions.length);data={...data,sections:selected,answers,notes};}
const auditTitle=data.auditTitle||'Rough-in audit';const reportTitle=rectification?(data.stageLabel?data.stageLabel+' rectification':'Rectification report'):auditTitle;
const doc=new jsPDF({unit:'mm',format:'a4'});let y=0;const active=data.sections.filter(s=>data.status[s.id]==='applies');
function header(title){
doc.setFillColor(255,255,255);doc.rect(0,0,210,45,'F');
if(global.auditReportLogo){doc.addImage(global.auditReportLogo,'PNG',16,6,74,18.5);}else{doc.setTextColor(35,39,43);doc.setFont('helvetica','bold');doc.setFontSize(11);doc.text('DIRECT FLOW PLUMBING',16,17);}
doc.setTextColor(35,39,43);doc.setFont('helvetica','bold');doc.setFontSize(20);doc.text(title,16,36);
doc.setDrawColor(235,112,63);doc.setLineWidth(.6);doc.line(16,44,194,44);y=56;
}
function page(title=reportTitle){doc.addPage();header(title);}
function text(value,size=11,bold=false){doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);const lines=doc.splitTextToSize(String(value),178);for(const line of lines){if(y>272){page();doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size)}doc.text(line,16,y);y+=size*.48;}y+=3;}
header(reportTitle);text('Job: '+data.job,12,true);text('Completed by: '+data.worker);text('Recorded: '+data.date);text('Recipient: dfpjobs@directflow.com.au',10);y+=3;
const t=data.stats;if(!rectification){text('AUDIT SCORE: '+(t.score===null?'N/A':t.score+'%')+(t.blank||t.unselected?' (provisional)':''),18,true);text(t.yes+' Yes | '+t.no+' No | '+t.na+' N/A checks | '+t.blank+' unanswered',10);text('Score = Yes / (Yes + No). N/A items and sections are excluded.',9);text(t.no?t.no+' item(s) require attention. See defect notes below.':'No failed checks recorded.',11,true);text(active.length+' applicable sections',10);
text('Checklist based on the supplied '+(data.stageLabel||'rough-in')+' report. The score records worker answers; required photos must also be supplied.',9);}else{text('FAILED ITEMS: '+t.no,18,true);text('Open defects requiring rectification. Reference photos are from the affected sections.',10);text('Report issued: '+data.date,10);text('Rectification status: OPEN - completion is not recorded in this report.',10,true);}
if(data.general){y+=3;text('Other job notes',12,true);text(data.general,10)}
if(data.followups){const f=data.followups;y+=4;text('Completion / return visit',12,true);text('Return visit required: '+(f.returnVisit||'Not recorded'),10);if(f.returnVisit==='Yes'&&f.returnDetails)text('Completed / outstanding: '+f.returnDetails,10);if(f.builderBlockers)text('Builder-related blockers / other problems: '+f.builderBlockers,10);if(f.recycledJob){text('Recycled-water job: '+f.recycledJob,10);if(f.recycledJob==='Yes')text('R3 inspection booking required - office to arrange.',10);}}

const photoLinks=[];
function photoCode(s,p,i){return global.auditPhotoCode?global.auditPhotoCode(s,p,i):(p.code||s.id.toUpperCase()+'-'+String(i+1).padStart(2,'0'));}
for(const s of active){
page(reportTitle);text(s.title,17,true);for(const f of s.fields||[]){const value=(data.sectionDetails||{})[s.id+':'+f.id];if(value)text(f.label+' '+value,10);}
s.questions.forEach((q,i)=>{const key=s.id+':'+i;if(y>260){page();text(s.title+' (continued)',13,true)}text((data.answers[key]||'Unanswered')+'  |  '+q,10);if(data.answers[key]==='No'&&data.notes[key])text('ACTION REQUIRED: '+data.notes[key],10,true);if(rectification){text('Rectified: [ ]    Completed by: __________________________',10);text('Date: ______________    Verified by: ____________________',10);y+=4;}});
if(y>209){page();text(s.title+' - Photo thumbnails',14,true)}else{y+=6;text(s.title+' - Photo thumbnails',14,true)}
text('Match the code to the larger area photos at the end. Tap a thumbnail to jump there.',9);
const photos=data.photos[s.id]||[];
for(let start=0;start<photos.length;start+=3){
if(y+64>272){page();text(s.title+' - Photo thumbnails (continued)',13,true)}
for(let col=0;col<3&&start+col<photos.length;col++){
const i=start+col,p=photos[i],code=photoCode(s,p,i),x=16+col*61;
doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text(code,x,y+4);doc.setFont('helvetica','normal');doc.setFontSize(8);const caption=doc.splitTextToSize(p.requirementLabel||'',54).slice(0,2);if(caption.length)doc.text(caption,x,y+9);
const scale=Math.min(54/p.width,36/p.height),w=p.width*scale,h=p.height*scale;
doc.addImage(p.data,'JPEG',x+(54-w)/2,y+19+(36-h)/2,w,h,undefined,'FAST');
photoLinks.push({section:s,photo:p,code,page:doc.getNumberOfPages(),x,y,w:54,h:56});
}y+=64;
}
if(!photos.length)text('No photos supplied.',10);
}
// Larger photos are collected after every checklist, grouped by their original area.
for(const s of active){
const areaPhotos=photoLinks.filter(entry=>entry.section.id===s.id);
for(const entry of areaPhotos){
page('Photo gallery');text(s.title+' photos',16,true);text(entry.code+' - '+s.title,12,true);if(entry.photo.requirementLabel)text(entry.photo.requirementLabel,10);
const p=entry.photo,scale=Math.min(178/p.width,(259-y)/p.height),w=p.width*scale,h=p.height*scale;
doc.addImage(p.data,'JPEG',(210-w)/2,y,w,h,undefined,'FAST');
entry.target=doc.getNumberOfPages();
doc.setFont('helvetica','normal');doc.setFontSize(10);doc.setTextColor(173,66,0);doc.text('Back to '+entry.code+' thumbnail',16,271);doc.link(16,266,100,8,{pageNumber:entry.page});doc.setTextColor(35,39,43);
}
}
for(const entry of photoLinks){doc.setPage(entry.page);doc.link(entry.x,entry.y,entry.w,entry.h,{pageNumber:entry.target});}
const pages=doc.getNumberOfPages();for(let i=1;i<=pages;i++){doc.setPage(i);doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(95,102,109);doc.text('Direct Flow Plumbing | '+reportTitle+' | '+i+' / '+pages,16,287);}return doc;
}
global.createAuditPdf=createAuditPdf;
})(typeof window!=='undefined'?window:globalThis);
