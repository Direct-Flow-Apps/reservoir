(function(g){
g.openAuditCamera=async function({title,onFile,fallback}){
const d=document.createElement('dialog');d.className='audit-camera';d.setAttribute('aria-label','Take multiple photos');
const heading=document.createElement('h3');heading.textContent=title;
const hint=document.createElement('p');hint.textContent='Take as many photos as needed, then tap Done. Each photo saves to this item.';
const video=document.createElement('video');video.autoplay=true;video.muted=true;video.playsInline=true;
const status=document.createElement('p');status.setAttribute('role','status');status.textContent='Opening camera…';
const strip=document.createElement('div');strip.className='camera-thumbnails';
const actions=document.createElement('div');actions.className='photo-actions';
function button(text){const b=document.createElement('button');b.type='button';b.textContent=text;b.className='photo-action';actions.appendChild(b);return b;}
const capture=button('Capture photo'),done=button('Done'),native=button('Use phone camera instead');capture.disabled=true;native.hidden=true;
d.append(heading,hint,video,status,strip,actions);document.body.appendChild(d);
let stream=null,closed=false,busy=false,count=0;
function stop(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}video.srcObject=null;}
function close(){if(busy)return;closed=true;stop();document.removeEventListener('visibilitychange',visibility);g.removeEventListener('pagehide',exit);if(d.open)d.close();d.remove();}
function visibility(){if(document.hidden){stop();capture.disabled=true;status.textContent='Camera paused. Tap Done and reopen it to continue.';}}
function exit(){stop();}
done.onclick=close;native.onclick=()=>{close();fallback();};
d.addEventListener('cancel',e=>{e.preventDefault();close();});
d.addEventListener('close',()=>{closed=true;stop();document.removeEventListener('visibilitychange',visibility);g.removeEventListener('pagehide',exit);d.remove();});
document.addEventListener('visibilitychange',visibility);g.addEventListener('pagehide',exit);
video.addEventListener('loadeddata',()=>{if(!closed&&stream&&!busy)capture.disabled=false;});
capture.onclick=async()=>{
if(busy||closed||!stream||!video.videoWidth||!video.videoHeight)return;
busy=true;capture.disabled=true;done.disabled=true;native.disabled=true;status.textContent='Saving photo…';
try{const canvas=document.createElement('canvas'),scale=Math.min(1,1800/Math.max(video.videoWidth,video.videoHeight));canvas.width=Math.round(video.videoWidth*scale);canvas.height=Math.round(video.videoHeight*scale);canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);
const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Camera image could not be captured.')),'image/jpeg',.85));
await onFile(new File([blob],'audit-camera-'+Date.now()+'.jpg',{type:'image/jpeg'}));
count++;const img=document.createElement('img');img.src=canvas.toDataURL('image/jpeg',.5);img.alt='Captured photo '+count;strip.appendChild(img);status.textContent=count+' photo'+(count===1?'':'s')+' saved on this device. Take another or tap Done.';
}catch(e){status.textContent='Photo not confirmed saved: '+e.message+' Check the audit saving message before continuing.';}
finally{busy=false;capture.disabled=!stream||closed;done.disabled=false;native.disabled=false;}
};
d.showModal();
try{if(!navigator.mediaDevices?.getUserMedia)throw new Error('Live camera is unavailable');
const opened=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1920},height:{ideal:1080}}});
if(closed){opened.getTracks().forEach(t=>t.stop());return;}stream=opened;video.srcObject=stream;await video.play();if(document.hidden){visibility();return;}capture.disabled=!video.videoWidth;status.textContent='Camera ready. Tap Capture photo for each shot.';
}catch(e){if(closed)return;stop();capture.disabled=true;native.hidden=false;status.textContent='Live camera could not open. Allow camera access in Chrome, or use the phone camera instead.';}
};
})(window);
