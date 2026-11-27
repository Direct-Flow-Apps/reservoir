(function(g){
const room=[
'Water point locations match plans?',
'Waste points correctly positioned?',
'Basin and bath wastes reduced to 40 mm?',
'Pipes sealed with silicone?',
'Pipes securely clipped to prevent water hammer?',
'Toilet waste correctly located?',
'Toilet ring pan installed?',
'Noggins installed for wall-hung basins?',
'Wall waste 150 mm below basin bottom?',
'Plate mixers installed level?',
'In-wall cistern installed correctly?',
'In-wall cistern free of debris and user guides?'];
const basic=['Water point locations match plans?','Waste correctly positioned and reduced to 50 mm?','Pipes sealed with silicone?','Pipes securely clipped to prevent water hammer?'];
const wc=['Toilet water point correctly located?','Checked for water leaks?','Toilet waste correctly positioned?','Pipes sealed with silicone?','Pipes securely clipped to prevent water hammer?','In-wall cistern installed correctly?','In-wall cistern free of debris and user guides?'];
const sections=[
['kitchen','Kitchen',basic],
['fridge','Fridge point',['Fridge water point required on plans?','Water point installed to plans?','Water point tested and working?']],
['pantry',"Butler's pantry",basic],
['bathroom','Bathroom',room],['bathroom2','Bathroom 2',room],['ensuite','Ensuite',room],['ensuite2','Ensuite 2',room],
['laundry','Laundry',basic],['wc','Standalone WC',wc],
['powder','Powder room',[...wc,'Wall-hung basin noggins at correct height and to specifications?','Wall waste 150 mm below basin bottom or to bottle-trap specifications?']],
['sewer','Sewer vent',['Vent installed and passing through top plate?','Sarking taped around vent?','MiTek plate installed?','Vent flashed?']],
['extraction','Extraction vents',['Hydro vents installed?','Roof vents installed correctly?','Sarking taped around vents?']],
['double','Double storey',['Stack complete?','100 mm pipe clipped at 1200 mm horizontal and 1800 mm vertical spacing?','I.O. cap tightened and water tested?','Traps and pipes water tested with no leaks?','Junctions installed with 15-degree bends?']],
['evap','Evap point',['Evap point run to correct location?']],
['mixers','Mixers',['All mixers installed?','All mixers installed to plans or specifications?']],
['outdoor','Outdoor water points',['Hot, cold and gas lines correctly run to HWS?','External taps installed and clear of downpipes?','Taps on the same wall at matching heights?']],
['water-test','Bucket pumped / water test',['Water tested to 1500 kPa?','Walk-through completed while on test, with no water leaks?']],
['gas','Gas',['Gas tested to 7 kPa?','Cooktop gas point required and correctly positioned?','Anti-tilt noggin installed for freestanding oven?','Copper pipe to cooktop positioned just below top plate?','Minimum 1200 mm clearance from gas meter up wall?','1200 mm from HWS and correct connections to appliances?','MiTek plate installed where hole exceeds 25 mm?','Gas pipe clipped to requirements?','Gas meter point located to plans?','Number of gas crimps checked and crimps secure?']],
['temporary','Temporary downpipes',['Temporary downpipes run and taped to risers?']],
['tank','Tank water',['Points correctly run to WCs and tank location?']],
['recycled','Recycled water',['Meter looped to test recycled line?','Recycled water tap installed to plan?','Recycled lines run to toilets?','Recycled line clear of other pipes?','Recycled line clipped correctly?','Recycled line sealed with silicone?','Recycled washing machine point installed where required by plan?']],
['solar','Solar panels',['Solar panels installed?','Solar lines installed?','Solar lines tested?']],
['finish','Site finish',['All doors locked?','Gate shut?','Bin photo taken, regardless of whether bin is full?']]
];
g.auditSections=sections.map(([id,title,questions])=>({id,title,questions:[...questions],photoHint:id==='finish'?'Include a clear bin photo, whether full or empty.':'Show the completed work and any defects clearly.'}));
})(typeof window!=='undefined'?window:globalThis);

(function(g){
const prefixes={kitchen:'KIT',fridge:'FRG',pantry:'PAN',bathroom:'BTH',bathroom2:'BTH2',ensuite:'ENS',ensuite2:'ENS2',laundry:'LAU',wc:'WC',powder:'PWD',sewer:'VNT',extraction:'EXT',double:'DBL',evap:'EVP',mixers:'MIX',outdoor:'OUT','water-test':'WTR',gas:'GAS',temporary:'TDP',tank:'TNK',recycled:'REC',solar:'SOL',finish:'SITE'};
g.auditPhotoCode=function(section,photo,index){return photo.code||((prefixes[section.id]||section.id.toUpperCase())+'-'+String(index+1).padStart(2,'0'));};
})(typeof window!=='undefined'?window:globalThis);
