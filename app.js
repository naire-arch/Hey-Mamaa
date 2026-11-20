/* ---------- storage (safe) ---------- */
const store={get(k,d){try{const v=localStorage.getItem('hm_'+k);return v?JSON.parse(v):d}catch(e){return mem[k]??d}},
set(k,v){try{localStorage.setItem('hm_'+k,JSON.stringify(v))}catch(e){mem[k]=v}}};
const mem={};
let S={user:store.get('user',null),cycle:store.get('cycle',{last:'',len:28,per:5,log:[]}),anthro:store.get('anthro',null),
msgs:store.get('msgs',[]),chat:store.get('chat',[]),late:store.get('late',null)};
const save=k=>store.set(k,S[k]);
const $=s=>document.querySelector(s);
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- content ---------- */
const PHASES={
menstrual:{name:'Menstrual',emoji:'🩸',days:'Days 1–5',hormones:'Oestrogen and progesterone are at their lowest, so the womb lining sheds. Iron is lost with the blood and energy can dip. Prostaglandins cause cramps.',
 diet:['Iron-rich foods: ndengu (green grams), omena, liver, managu, sukuma wiki, terere, spinach','Pair iron with vitamin C: oranges, passion fruit, tomatoes, lemon','Warm fluids: ginger tea, uji, warm water; plenty of water','Magnesium foods for cramps: pumpkin seeds, avocado, groundnuts, whole-grain ugali'],
 avoid:['Too much tea or coffee with meals (blocks iron absorption)','Very salty snacks and crisps (bloating)','Skipping meals'],
 dos:['Rest, use a warm compress','Gentle walking or stretching','Change pads/tampons every 4–6 hours','Track pain and flow'],
 donts:['Do not use dirty cloth or leave a tampon in over 8 hours','Do not take painkillers on an empty stomach','Do not douche'],
 meds:'For cramps, paracetamol or ibuprofen (with food) are commonly used if you have no allergy, ulcers or kidney problems. Ask a pharmacist or doctor first.',
 fun:['Watch a comfort series or movie','Gospel, Afrobeat or benga playlist','Journaling or a warm bath','Call a friend and laugh']},
follicular:{name:'Follicular',emoji:'🌱',days:'Days 6–13',hormones:'Oestrogen rises and the body prepares an egg. Energy, mood and appetite improve.',
 diet:['Lean protein: eggs, fish (tilapia), chicken, beans','Fresh vegetables and fruit: kales, carrots, mangoes, pawpaw','Fermented foods: mursik, maziwa lala (yoghurt)','Whole grains: millet, sorghum, brown ugali'],
 avoid:['Heavy sugary drinks','Too much deep-fried food'],
 dos:['Try harder exercise: jogging, dance, gym','Start new projects, you have energy','Drink water through the day'],
 donts:['Do not crash-diet; the body needs fuel for ovulation'],
 meds:'No routine medicines needed. If you take supplements (e.g. folic acid), keep taking them as advised.',
 fun:['Outdoor walks','Dance workouts','Meet friends, try new hobbies']},
ovulation:{name:'Ovulation',emoji:'🌼',days:'Days 14–16',hormones:'Oestrogen peaks, then LH surges and releases an egg. You are most fertile. Some feel mild one-sided pain, clear stretchy mucus or higher libido.',
 diet:['Zinc: pumpkin seeds, beef, groundnuts','Healthy fats: avocado, fish, nuts','Antioxidants: berries, tomatoes, green leafy vegetables','Plenty of water'],
 avoid:['Heavy alcohol','Smoking'],
 dos:['If you want a pregnancy, this is the fertile window','If you do not, use protection','Moderate exercise'],
 donts:['Do not rely on "safe days" alone to prevent pregnancy'],
 meds:'Mild ovulation pain usually passes in a day or two. Severe pain needs a clinic visit.',
 fun:['Social outings','Music and dancing','Creative projects']},
luteal:{name:'Luteal (PMS)',emoji:'🌙',days:'Days 17–28',hormones:'Progesterone rises, then falls if no pregnancy. This causes bloating, cravings, breast tenderness, mood swings and tiredness (PMS).',
 diet:['Complex carbs: sweet potato, arrow roots, brown ugali, oats','Calcium and magnesium: milk, yoghurt, sukuma wiki, groundnuts','Vitamin B6: bananas, chicken, fish, beans','Small, frequent meals; fibre: githeri, ndengu, vegetables'],
 avoid:['Excess salt (bloating)','Too much sugar, soda, caffeine','Alcohol'],
 dos:['Sleep 7–9 hours','Light exercise or yoga','Plan lighter workload','Stock iron-rich foods before your period'],
 donts:['Do not skip meals; low blood sugar worsens mood','Do not suffer silently with severe low mood. Talk to someone'],
 meds:'Calcium, magnesium or vitamin B6 supplements may help PMS. Ask a dietitian or doctor for doses. Seek care if mood symptoms are severe.',
 fun:['Cosy movie night','Soft music, reading','Self-care: massage, face mask','Talk to a trusted friend']}};

/* Kenyan meal plans by nutrition status */
const MEALS={
under:{label:'Underweight (BMI < 18.5)',note:'Goal: gentle weight gain with energy- and protein-dense foods. Eat 5–6 times a day.',
 plan:[['Breakfast','Uji with milk and groundnut paste + boiled egg + banana'],['Mid-morning','Mandazi (baked if possible) or avocado on bread'],['Lunch','Rice or ugali, beans/ndengu stew with oil, sukuma wiki, avocado'],['Snack','Maziwa lala + roasted groundnuts'],['Supper','Chapati, beef or fish stew, cabbage'],['Bedtime','Warm milk or porridge']]},
normal:{label:'Normal (BMI 18.5–24.9)',note:'Goal: balance. Half the plate vegetables/fruit, a quarter protein, a quarter starch.',
 plan:[['Breakfast','Porridge (millet/sorghum) + egg or arrow roots'],['Mid-morning','Fruit: orange, pawpaw or banana'],['Lunch','Ugali/rice, grilled tilapia or beans, managu/sukuma, kachumbari'],['Snack','Roasted maize or groundnuts'],['Supper','Githeri or chapati with lentil (ndengu) stew and cabbage']]},
over:{label:'Overweight (BMI 25–29.9)',note:'Goal: steady, moderate weight loss. Smaller starch portions, more fibre and protein, less oil and sugar.',
 plan:[['Breakfast','Unsweetened porridge or oats + boiled egg'],['Mid-morning','Apple, guava or cucumber'],['Lunch','Small ugali/brown rice, grilled fish/chicken, big serving of vegetables, kachumbari'],['Snack','Plain yoghurt or roasted groundnuts (handful)'],['Supper','Githeri (less oil) or lentil stew with steamed cabbage']]},
obese:{label:'Obese (BMI ≥ 30)',note:'Goal: gradual weight loss with a dietitian. Even 5–10% loss can help cycles and PCOS.',
 plan:[['Breakfast','Unsweetened sorghum porridge + egg'],['Mid-morning','Water, then a piece of fruit'],['Lunch','Vegetables first, then beans/fish and a small portion of whole-grain ugali'],['Snack','Cucumber, carrots or tomatoes'],['Supper','Vegetable and ndengu soup, or grilled chicken with greens']]}};

const SUPPS=[['Iron + vitamin C','During and after heavy periods, or if anaemic. Take with orange or passion fruit, not with tea.'],['Folic acid','If you may become pregnant, or as advised by a clinician.'],['Magnesium','May ease cramps, sleep and PMS.'],['Vitamin D','If you get little sun or have low levels.'],['Omega-3','Fish (omena, tilapia) or supplements may reduce inflammation.'],['Inositol (PCOS)','Sometimes used in PCOS. Only with a doctor or dietitian.']];
const bmiStatus=b=>b<18.5?'under':b<25?'normal':b<30?'over':'obese';

/* ---------- cycle maths ---------- */
const DAY=864e5;
function today(){const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function parse(s){const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)}
function fmt(d){return d.toLocaleDateString('en-KE',{weekday:'short',day:'numeric',month:'short'})}
function cycleInfo(){const c=S.cycle;if(!c.last)return null;const start=parse(c.last);const len=+c.len||28;const per=+c.per||5;
 let day=Math.floor((today()-start)/DAY)+1;const late=day>len;const d=late?day:((day-1)%len)+1;
 const ov=len-14;let ph=d<=per?'menstrual':d<ov-1?'follicular':d<=ov+1?'ovulation':'luteal';
 const next=new Date(start.getTime()+len*DAY*Math.max(1,Math.ceil((today()-start)/DAY/len+(late?0:0.0001))));
 const nextPeriod=late?new Date(start.getTime()+len*DAY):new Date(start.getTime()+len*DAY*(Math.floor((day-1)/len)+1));
 return{day:d,rawDay:day,late,daysLate:late?day-len-1:0,phase:ph,len,per,nextPeriod,ovDate:new Date(start.getTime()+(ov-1)*DAY),fertileStart:new Date(start.getTime()+(ov-5)*DAY)}}

/* ---------- views ---------- */
let tab='home';
const TABS=[['home','🏠','Home'],['meals','🥣','Meals'],['pcos','💗','PCOS'],['chat','💬','Ask'],['care','🩺','Care'],['fun','🎶','Relax'],['me','🔔','Me']];
function nav(){$('#nav').innerHTML=TABS.map(t=>`<button class="${tab===t[0]?'on':''}" onclick="go('${t[0]}')"><span>${t[1]}</span>${t[2]}</button>`).join('')}
function go(t){tab=t;render();window.scrollTo(0,0)}
function render(){nav();if(!S.user&&tab!=='me'){tab='me'}
 $('#app').innerHTML=({home,meals,pcos,chat,care,fun,me})[tab]();if(tab==='chat'){const b=$('#cbox');if(b)b.scrollTop=b.scrollHeight}}

function list(a,c=''){return '<ul class="'+c+'">'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'}

function home(){const ci=cycleInfo();const c=S.cycle;let h=`<div class="card"><h2>Hi ${esc(S.user.name)} 👋</h2>`;
 if(!ci){h+=`<p>Log your last period to get phase-by-phase guidance.</p>`}
 else{const P=PHASES[ci.phase];h+=`<p><span class="pill">Day ${ci.day} of ${ci.len}</span> <span class="pill">${P.emoji} ${P.name} phase</span></p>
 <div class="bar"><i style="width:${Math.min(100,ci.day/ci.len*100)}%"></i></div>
 <p class="small">Next period expected around <b>${fmt(ci.nextPeriod)}</b>. Likely fertile window starts ${fmt(ci.fertileStart)}; ovulation about ${fmt(ci.ovDate)}.</p>
 ${ci.late?`<div class="warn">Your period is about <b>${ci.daysLate+1} day(s) late</b>. Don't panic; see the <a href="#" onclick="go('pcos');return false">late period guide</a>.</div>`:''}`}
 h+=`</div><div class="card"><h2>Log your cycle</h2><label>First day of your last period</label><input type="date" id="last" value="${c.last}" max="${new Date().toISOString().slice(0,10)}">
 <div class="row"><div><label>Cycle length (days)</label><input type="number" id="len" min="21" max="45" value="${c.len}"></div><div><label>Period length (days)</label><input type="number" id="per" min="2" max="10" value="${c.per}"></div></div>
 <button onclick="saveCycle()">Save cycle</button></div>`;
 if(ci){const P=PHASES[ci.phase];h+=`<div class="card phase"><h2>${P.emoji} ${P.name} phase · ${P.days}</h2>
 <h3>What your hormones are doing</h3><p>${esc(P.hormones)}</p>
 <h3>Eat these</h3>${list(P.diet)}<h3>Go easy on</h3>${list(P.avoid)}
 <h3 class="do">✅ Do's</h3>${list(P.dos,'do')}<h3 class="dont">🚫 Don'ts</h3>${list(P.donts,'dont')}
 <h3>Medication</h3><p>${esc(P.meds)}</p></div>`}
 h+=`<div class="card"><h2>Symptom log</h2><label>How do you feel today?</label><select id="sym"><option>Good</option><option>Cramps</option><option>Bloating</option><option>Headache</option><option>Tired</option><option>Low mood</option><option>Acne</option><option>Heavy flow</option></select>
 <button class="alt" onclick="logSym()">Add to log</button>${c.log.slice(-5).reverse().map(l=>`<p class="small">${esc(l.d)} · ${esc(l.s)}</p>`).join('')}</div>`;
 return h}
function saveCycle(){const l=$('#last').value;if(!l){alert2('Please pick a date');return}
 S.cycle.last=l;S.cycle.len=+$('#len').value||28;S.cycle.per=+$('#per').value||5;save('cycle');render()}
function logSym(){S.cycle.log.push({d:new Date().toLocaleDateString('en-KE'),s:$('#sym').value});save('cycle');render()}
function alert2(t){const d=document.createElement('div');d.className='warn';d.textContent=t;$('#app').prepend(d);setTimeout(()=>d.remove(),2500)}

function meals(){const a=S.anthro;const ci=cycleInfo();
 let h=`<div class="card"><h2>Your nutrition status</h2><p class="small">Anthropometry sets your meal plan. Enter your details:</p>
 <div class="row"><div><label>Weight (kg)</label><input type="number" id="wt" value="${a?a.w:''}"></div><div><label>Height (cm)</label><input type="number" id="ht" value="${a?a.h:''}"></div></div>
 <div class="row"><div><label>Waist (cm, optional)</label><input type="number" id="wa" value="${a?a.wa||'':''}"></div><div><label>MUAC (cm, optional)</label><input type="number" id="mu" value="${a?a.mu||'':''}"></div></div>
 <button onclick="saveA()">Get my meal plan</button></div>`;
 if(a){const b=a.w/Math.pow(a.h/100,2);const st=bmiStatus(b);const M=MEALS[st];
 h+=`<div class="card"><h2>BMI ${b.toFixed(1)} <span class="pill">${M.label}</span></h2><p>${esc(M.note)}</p>
 ${a.wa&&a.wa>80?'<p class="warn">Waist above 80 cm raises metabolic risk (and is linked to PCOS and insulin resistance). Discuss with a dietitian.</p>':''}
 ${a.mu&&a.mu<23?'<p class="warn">MUAC below 23 cm may suggest undernutrition. Please see a dietitian.</p>':''}
 <h3>Sample Kenyan day</h3>${M.plan.map(p=>`<p><b>${p[0]}:</b> ${esc(p[1])}</p>`).join('')}</div>`;
 if(ci){h+=`<div class="card"><h2>Phase boost: ${PHASES[ci.phase].name}</h2>${list(PHASES[ci.phase].diet)}</div>`}}
 h+=`<div class="card"><h2>Supplementation</h2>${SUPPS.map(s=>`<p><b>${s[0]}:</b> ${esc(s[1])}</p>`).join('')}<p class="small">Doses depend on your blood tests and health. Confirm with a dietitian or doctor.</p></div>`;
 return h}
function saveA(){const w=+$('#wt').value,h=+$('#ht').value;if(!w||!h){alert2('Enter weight and height');return}
 S.anthro={w,h,wa:+$('#wa').value||0,mu:+$('#mu').value||0};save('anthro');render()}

function pcos(){const ci=cycleInfo();
 return `<div class="card"><h2>🕐 My period is late. Now what?</h2>
 ${ci&&ci.late?`<div class="warn">Your tracker shows you are about ${ci.daysLate+1} day(s) late.</div>`:''}
 <p><b>Don't panic.</b> Periods can be late because of stress, travel, illness, weight change, hard exercise, breastfeeding, contraception changes, PCOS or thyroid problems, or pregnancy.</p>
 <h3>Step by step</h3>${list(['If you have had sex since your last period, take a pregnancy test (best from the first day you are late)','Rest, sleep well, eat regular meals, drink water','Reduce stress where you can','Keep logging symptoms','If still no period after 7–10 days, or you tested positive, visit a clinic','See a doctor if you miss 3 periods in a row, or have periods that come less than 8 times a year'])}
 <h3>Go to hospital urgently if</h3>${list(['Severe one-sided abdominal pain or shoulder-tip pain','Very heavy bleeding (soaking a pad every hour)','Fainting, fever with pain or foul discharge'],'dont')}</div>
 <div class="card"><h2>💗 Living well with PCOS</h2><p>PCOS (polycystic ovary syndrome) means hormones, especially insulin and androgens, are out of balance. It can cause irregular or missed periods, acne, extra facial/body hair, hair thinning, weight gain and trouble conceiving.</p>
 <h3>Food</h3>${list(['Low-GI carbs: millet, sorghum, brown ugali, sweet potato, oats, githeri','Protein and fibre at every meal: beans, ndengu, eggs, fish, vegetables','Healthy fats: avocado, groundnuts, fish','Limit sugary drinks, white bread, mandazi and deep-fried foods','Spearmint tea, cinnamon and ginger are popular; evidence is limited'])}
 <h3>Lifestyle</h3>${list(['Move 150 min a week: brisk walking, dancing, strength work','Sleep 7–9 hours; manage stress','Even 5% weight loss can restore regular cycles','Keep clinic visits for blood sugar, lipids and hormone checks'])}
 <h3>Medication</h3><p>Doctors may use metformin, hormonal contraceptives or other treatment depending on your goals. Never start or stop these without a doctor.</p>
 <h3 class="dont">Avoid</h3>${list(['Crash diets and unproven "detox" teas','Herbal fertility mixes with unknown ingredients','Taking leftover hormone pills'],'dont')}</div>`}

/* chatbot: simple rule-based */
const KB=[
[/late|missed|no period|delay/,'A late period can be caused by stress, weight change, illness, PCOS, thyroid problems or pregnancy. Take a pregnancy test if you could be pregnant. If your period is more than 7–10 days late or you miss 3 in a row, see a clinic. Don\'t panic.'],
[/pcos|polycystic/,'PCOS is a hormone condition causing irregular periods, acne, extra hair growth and weight gain. Choose low-GI Kenyan foods (millet, sorghum, ndengu), move regularly, and see a doctor for tests and treatment. Check the PCOS tab for more.'],
[/cramp|pain|dysmenorr/,'For cramps try a warm compress, gentle walking, ginger tea, and magnesium foods (groundnuts, avocado). Paracetamol or ibuprofen with food can help if safe for you. See a doctor if pain stops you from daily life, or is worsening.'],
[/heavy|bleed|flood|clot/,'Soaking a pad every 1–2 hours, passing big clots, or bleeding over 7 days is heavy. Eat iron-rich foods (ndengu, liver, managu) and see a doctor, as you may need an iron check.'],
[/iron|anaemi|anemi|tired|fatigue/,'Iron-rich Kenyan foods: liver, omena, ndengu, beans, managu, terere and sukuma wiki. Pair with oranges or passion fruit and avoid tea with meals. If you feel dizzy or very tired, get your haemoglobin checked.'],
[/pregnan|fertile|ovulat|conceiv/,'Ovulation is usually about 14 days before your next period, and the fertile window is about 5 days before it plus the day of ovulation. Cycle tracking is approximate. For prevention, use contraception; for trying to conceive, take folic acid and see a clinician.'],
[/acne|pimple/,'Hormone changes cause acne before periods. Wash gently, limit sugary foods, drink water. If persistent or with irregular periods, check for PCOS.'],
[/mood|sad|anxi|depress|pms|irritab/,'PMS mood swings are common in the luteal phase. Sleep, exercise, regular meals and less caffeine help. If you feel hopeless or very low for days, please talk to a doctor or counsellor.'],
[/bloat|crav|sugar/,'Bloating and cravings are common before periods. Cut back on salt, soda and sugar; try bananas, yoghurt, githeri and plenty of water. Small frequent meals help.'],
[/exercise|workout|gym/,'Follicular: harder workouts. Ovulation: moderate. Luteal: light to moderate. Period: gentle walking or stretching. Listen to your body.'],
[/food|eat|diet|meal/,'See the Meals tab for Kenyan meals matched to your phase and weight status. In general: vegetables, ndengu/beans, fish or eggs, whole grains and water daily.'],
[/hi|hello|hey/,'Hello mamaa! 🌸 Ask me about periods, cramps, PCOS, food or supplements.']];
function reply(q){q=q.toLowerCase();for(const[r,a]of KB)if(r.test(q))return a+'\n\n(General information, not a diagnosis.)';
 return 'I\'m not sure about that one. Try asking about cramps, late periods, PCOS, heavy bleeding, iron or food. For personal advice use the Care tab to message a dietitian or doctor.'}
function chat(){return `<div class="card"><h2>💬 Ask Mamaa</h2><div id="cbox" style="max-height:52vh;overflow:auto">${S.chat.length?S.chat.map(m=>`<div class="msg ${m.r==='u'?'me':'bot'}">${esc(m.t)}</div>`).join(''):'<div class="msg bot">Hello! Ask me anything about your cycle, PCOS, food or symptoms.</div>'}</div>
 <div class="row" style="margin-top:8px"><input id="q" placeholder="Type a question…" onkeydown="if(event.key==='Enter')ask()"><button style="flex:0 0 70px;margin:0" onclick="ask()">Send</button></div>
 <p class="small">Quick: ${['Period is late','Cramps','PCOS','Iron foods'].map(x=>`<a href="#" onclick="ask('${x}');return false">${x}</a>`).join(' · ')}</p></div>`}
function ask(t){const q=t||$('#q').value.trim();if(!q)return;S.chat.push({r:'u',t:q},{r:'b',t:reply(q)});S.chat=S.chat.slice(-40);save('chat');render()}

function care(){return `<div class="card"><h2>🩺 When to see a dietitian</h2>${list(['You are underweight or overweight and want a safe plan','You have PCOS, diabetes, anaemia or thyroid issues','Severe PMS cravings or disordered eating worries','You want supplements, or a plan for pregnancy','Dramatic weight change without trying'])}</div>
 <div class="card"><h2>🏥 When to see a doctor</h2>${list(['No period for 3 months (and not pregnant)','Periods less often than every 35 days or more often than every 21','Bleeding over 7 days, or soaking a pad every 1–2 hours','Severe pain that stops daily activities','Bleeding between periods or after sex','Signs of PCOS: acne, extra hair, irregular periods','Fainting, dizziness, or a positive pregnancy test needing antenatal care'])}
 <p class="warn">Emergency: severe pain, heavy bleeding with dizziness, or fainting → go to the nearest hospital now.</p></div>
 <div class="card"><h2>✉️ Message a professional</h2>
 <label>To</label><select id="to"><option>Dietitian</option><option>Doctor</option></select>
 <label>Your message</label><textarea id="mt" rows="3" placeholder="Describe your concern…"></textarea><button onclick="sendMsg()">Send</button>
 <div style="margin-top:10px">${S.msgs.map(m=>`<div class="msg ${m.from==='me'?'me':'pro'}"><b>${esc(m.from==='me'?'To '+m.to:m.to)}</b><br>${esc(m.t)}<div class="small" style="color:inherit;opacity:.7">${esc(m.when)}</div></div>`).join('')||'<p class="small">No messages yet.</p>'}</div>
 <details style="margin-top:8px"><summary class="small">Professional view (demo)</summary><p class="small">In the live version, dietitians and doctors log in to see messages and reply. For this demo, type a reply as the professional:</p>
 <select id="rto"><option>Dietitian</option><option>Doctor</option></select><textarea id="rt" rows="2" placeholder="Reply as professional…"></textarea><button class="alt" onclick="proReply()">Send reply</button></details></div>`}
function sendMsg(){const t=$('#mt').value.trim();if(!t)return;S.msgs.push({from:'me',to:$('#to').value,t,when:new Date().toLocaleString('en-KE')});save('msgs');render()}
function proReply(){const t=$('#rt').value.trim();if(!t)return;S.msgs.push({from:'pro',to:$('#rto').value,t,when:new Date().toLocaleString('en-KE')});save('msgs');render()}

function fun(){const ci=cycleInfo();const P=ci?PHASES[ci.phase]:PHASES.menstrual;
 return `<div class="card"><h2>🎶 Relax & entertain</h2><p>Ideas for the <b>${P.name}</b> phase:</p>${list(P.fun)}</div>
 <div class="card"><h2>During your period</h2>${list(PHASES.menstrual.fun.concat(['Cook a comforting pot of uji or ginger tea','Light stretching or yoga videos','Read a favourite book','Early nights and extra rest']))}</div>`}

function me(){const u=S.user;
 if(!u)return `<div class="card"><h2>Welcome to Hey, Mamaa 🌸</h2><p>Log in with your name and phone number to get cycle alerts by SMS.</p>
 <label>Your name</label><input id="nm" placeholder="e.g. Wanjiru"><label>Phone number</label><input id="ph" inputmode="tel" placeholder="07XX XXX XXX">
 <button onclick="login()">Log in</button><p class="small">Demo: details stay on this device only.</p></div>`;
 const ci=cycleInfo();const al=[];
 if(ci){al.push(['Period expected',fmt(ci.nextPeriod),'Keep pads handy, eat iron-rich foods']);al.push(['Fertile window starts',fmt(ci.fertileStart),'']);al.push(['Ovulation (approx.)',fmt(ci.ovDate),''])}
 return `<div class="card"><h2>🔔 Alerts for ${esc(u.name)}</h2><p class="small">SMS to ${esc(u.phone)}</p>
 ${al.map(a=>`<p><b>${a[0]}:</b> ${a[1]}<br><span class="small">${esc(a[2])}</span></p>`).join('')||'<p>Log your cycle to see alerts.</p>'}
 ${ci?`<h3>Preview SMS</h3><div class="msg bot">Hey ${esc(u.name)}, you're on day ${ci.day} (${PHASES[ci.phase].name} phase). ${PHASES[ci.phase].diet[0]}. – Hey, Mamaa</div>`:''}
 <p class="warn">Real SMS sending needs an SMS service (e.g. Africa's Talking) and a backend. This demo shows what would be sent.</p>
 <button class="alt" onclick="logout()">Log out</button></div>
 <div class="card"><h2>Supplement & phase reminders</h2>${list(['Day 1: iron-rich meal plan reminder','Before ovulation: fertile window alert','5 days before period: PMS tips','Late period: gentle check-in'])}</div>
 <div class="card"><p class="small">Hey, Mamaa gives general health education, not diagnosis or treatment. Always consult a qualified health professional.</p></div>`}
function login(){const n=$('#nm').value.trim(),p=$('#ph').value.trim();if(n.length<2||p.replace(/\D/g,'').length<9){alert2('Enter your name and a valid phone number');return}
 S.user={name:n,phone:p};save('user');tab='home';render()}
function logout(){S.user=null;save('user');render()}
render();
