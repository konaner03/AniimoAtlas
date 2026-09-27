const aniimo = [
 // Verified Aniimo entries will be added here from authoritative sources.
 // We intentionally do not publish invented stats, roles, abilities, or descriptions.
];

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
let owned=JSON.parse(localStorage.getItem("aniimo-owned")||"[]");
let builds=JSON.parse(localStorage.getItem("aniimo-builds")||"[]");

function save(){localStorage.setItem("aniimo-owned",JSON.stringify(owned));localStorage.setItem("aniimo-builds",JSON.stringify(builds));}
function go(id){
  $$(".screen").forEach(x=>x.classList.toggle("active",x.id===id));
  $$(".nav").forEach(x=>x.classList.toggle("active",x.dataset.go===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));

function card(a){
 return `<article class="dex-card"><div class="creature-art"><span>${a.icon}</span><i class="spark">✦</i><i class="spark" style="top:24px;left:30px">·</i></div><div class="dex-info"><h3>${a.name}</h3><div class="tags"><span class="tag ${a.element.toLowerCase()}">${a.element}</span><span class="tag">${a.role}</span></div><p style="color:var(--muted);line-height:1.5">${a.desc}</p><button class="secondary" style="width:100%" onclick="toggleOwned('${a.id}')">${owned.includes(a.id)?"✓ Collected":"Mark collected"}</button></div></article>`;
}
function renderDex(){
 const q=($("#search").value||"").toLowerCase(), e=$("#element").value;
 $("#dexGrid").innerHTML=aniimo.length ? aniimo.filter(a=>(!q||a.name.toLowerCase().includes(q))&&(e==="all"||a.element===e)).map(card).join("") : `<div class="build-card" style="grid-column:1/-1;text-align:center;padding:42px"><div style="font-size:42px">✦</div><h3>Verified field data is coming</h3><p>We are building the Atlas from confirmed information rather than filling it with guesses.</p><a class="secondary" style="display:inline-block;text-decoration:none" href="https://www.aniimo.com/en/" target="_blank" rel="noopener">Visit the official Aniimo site</a></div>`;
}
function toggleOwned(id){owned=owned.includes(id)?owned.filter(x=>x!==id):[...owned,id];save();renderAll();}
function renderCollection(){
 $("#collectionGrid").innerHTML=aniimo.length ? aniimo.map(a=>`<article class="collection-card"><div class="mini-art">${a.icon}</div><div><b>${a.name}</b><small>${a.element} · ${a.role}</small></div><button class="check ${owned.includes(a.id)?"on":""}" onclick="toggleOwned('${a.id}')" aria-label="Toggle collected">${owned.includes(a.id)?"✓":""}</button></article>`).join("") : `<div class="build-card" style="grid-column:1/-1;text-align:center;padding:38px"><h3>Your journal is ready</h3><p>Verified Aniimo entries will appear here as the Atlas grows.</p></div>`;
 const n=owned.length,p=Math.round(n/aniimo.length*100);
 $("#progressPill").textContent=`${n} / ${aniimo.length}`;$("#progressText").textContent=`${p}%`;$("#progressBar").style.width=p+"%";
}
function renderBuilds(){
 $("#buildList").innerHTML=builds.length?builds.map((b,i)=>`<article class="build-card"><header><div><small>BUILD PLAN</small><h3>${b.name}</h3></div><button class="delete-build" onclick="deleteBuild(${i})">Delete</button></header><div class="tags"><span class="tag">${b.aniimo}</span></div><p>${b.notes||"No notes yet."}</p></article>`).join(""):`<div class="build-card" style="grid-column:1/-1;text-align:center;padding:40px"><div style="font-size:42px">✦</div><h3>No builds yet</h3><p>Create your first plan and start shaping your team.</p></div>`;
}
function deleteBuild(i){builds.splice(i,1);save();renderBuilds();}
function renderAll(){renderDex();renderCollection();renderBuilds();}
$("#search").addEventListener("input",renderDex);$("#element").addEventListener("change",renderDex);

const dialog=$("#buildDialog");
$("#newBuild").addEventListener("click",()=>{ $("#buildAniimo").innerHTML=aniimo.length ? aniimo.map(a=>`<option>${a.name}</option>`).join("") : `<option>No verified Aniimo data yet</option>`;dialog.showModal();});
$("#buildForm").addEventListener("submit",e=>{e.preventDefault();builds.unshift({name:$("#buildName").value.trim(),aniimo:$("#buildAniimo").value,notes:$("#buildNotes").value.trim()});save();renderBuilds();dialog.close();e.target.reset();});
function toggleTheme(){document.body.classList.toggle("dark");localStorage.setItem("aniimo-theme",document.body.classList.contains("dark")?"dark":"light");}
if(localStorage.getItem("aniimo-theme")==="dark")document.body.classList.add("dark");
$("#themeBtn").addEventListener("click",toggleTheme);$("#themeBtn2").addEventListener("click",toggleTheme);
$("#clearData").addEventListener("click",()=>{if(confirm("Clear your local collection and builds?")){owned=[];builds=[];save();renderAll();}});
$("#termsBtn").addEventListener("click",()=>$("#termsDialog").showModal());
$("#closeTerms").addEventListener("click",()=>$("#termsDialog").close());
renderAll();
