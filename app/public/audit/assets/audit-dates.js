(function(g){
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
function valid(value,allowFuture=false){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const [y,m,d]=value.split('-').map(Number),date=new Date(y,m-1,d,12);return date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d&&(allowFuture||value<=today());}
g.auditDates={today,valid,format:value=>valid(value,true)?value.slice(8,10)+'/'+value.slice(5,7)+'/'+value.slice(0,4):'Not entered'};
})(typeof window!=='undefined'?window:globalThis);
