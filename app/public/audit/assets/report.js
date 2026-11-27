(function(global){
function createAuditPdf(data,jsPDF){
const doc=new jsPDF({unit:'mm',format:'a4'});let y=0;
function header(title){doc.setFillColor(18,59,80);doc.rect(0,0,210,36,'F');doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('DIRECT FLOW  /  JOB AUDITS',16,13);doc.setFontSize(21);doc.text(title,16,26);doc.setTextColor(23,44,56);y=48;}
function page(){doc.addPage();header('Rough-in audit');}
function text(value,size=11,bold=false){doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);const lines=doc.splitTextToSize(String(value),178);for(const line of lines){if(y>274)page();doc.text(line,16,y);y+=size*.48;}y+=3;}
header('Rough-in audit');text('DEMO REPORT - Kitchen and Bathroom only',10,true);text('Job: '+data.job);text('Completed by: '+data.worker);text('Recorded: '+data.date);text('Recipient: dfpjobs@directflow.com.au',10);y+=3;
const defects=Object.values(data.answers).filter(v=>v==='No').length;text(defects?defects+' item(s) require attention':'All recorded checks passed or marked N/A',12,true);
for(const [room,questions] of Object.entries(data.sets)){if(y>230)page();y+=4;text(room[0].toUpperCase()+room.slice(1),14,true);questions.forEach((q,i)=>{const key=room+i;text((data.answers[key]||'Unanswered')+'  |  '+q,10);if(data.answers[key]==='No'&&data.notes[key])text('Action required: '+data.notes[key],10);});}
page();header('Photo index');text('Tap a thumbnail to open its full-page photo.',10);
const links=[];let total=0;Object.entries(data.photos).forEach(([room,list])=>list.forEach((p,i)=>{if(y>220)page();text(room[0].toUpperCase()+room.slice(1)+' - Photo '+(i+1),11,true);const h=48,w=Math.min(90,h*p.width/p.height);doc.addImage(p.data,'JPEG',16,y,w,h,undefined,'FAST');links.push({page:doc.getNumberOfPages(),x:16,y,w,h,photo:p,room,index:i});y+=h+10;total++;}));
for(const entry of links){page();header(entry.room[0].toUpperCase()+entry.room.slice(1)+' - Photo '+(entry.index+1));text('Full-page photo',10);const p=entry.photo;const scale=Math.min(178/p.width,210/p.height);const w=p.width*scale,h=p.height*scale;doc.addImage(p.data,'JPEG',(210-w)/2,y,w,h,undefined,'FAST');entry.target=doc.getNumberOfPages();}
for(const entry of links){doc.setPage(entry.page);doc.link(entry.x,entry.y,entry.w,entry.h,{pageNumber:entry.target});}
const pages=doc.getNumberOfPages();for(let i=1;i<=pages;i++){doc.setPage(i);doc.setFontSize(9);doc.setTextColor(95,112,121);doc.text('Direct Flow | Demo audit | '+i+' / '+pages,16,287);}
return doc;
}
global.createAuditPdf=createAuditPdf;
})(typeof window!=='undefined'?window:globalThis);
