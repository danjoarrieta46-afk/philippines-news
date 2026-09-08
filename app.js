const FEEDS = [
  // Replace/add feeds here if a publisher changes its RSS endpoint.
  {name:"GMA News", url:"https://www.gmanetwork.com/news/rss/", category:"news"},
  {name:"Philstar.com", url:"https://www.philstar.com/rss/headlines", category:"news"},
  {name:"Manila Bulletin", url:"https://mb.com.ph/feed", category:"news"},
  {name:"BusinessWorld", url:"https://www.bworldonline.com/feed/", category:"business"}
];

// Public CORS-friendly RSS-to-JSON services are used only as a bridge.
// For a production deployment, point API_BASE at your own free serverless function.
const API_BASE = "https://api.rss2json.com/v1/api.json?rss_url=";
let articles=[];

const grid=document.querySelector("#grid"), status=document.querySelector("#status");
const search=document.querySelector("#search"), source=document.querySelector("#source"), category=document.querySelector("#category");

function esc(s=""){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function clean(s=""){const d=document.createElement("div");d.innerHTML=s;return (d.textContent||"").replace(/\s+/g," ").trim()}
function timeAgo(date){
  const n=(Date.now()-new Date(date).getTime())/1000;
  if(!isFinite(n)) return "";
  if(n<3600)return `${Math.max(1,Math.floor(n/60))}m ago`;
  if(n<86400)return `${Math.floor(n/3600)}h ago`;
  return `${Math.floor(n/86400)}d ago`;
}
function render(){
  const q=search.value.toLowerCase().trim(), s=source.value, c=category.value;
  const list=articles.filter(a=>(!q||`${a.title} ${a.description}`.toLowerCase().includes(q))&&(s==="all"||a.source===s)&&(c==="all"||a.category===c));
  grid.innerHTML=list.map(a=>`<article class="card">
    <div class="meta"><span class="source">${esc(a.source)}</span><span>${timeAgo(a.date)}</span></div>
    <h2>${esc(a.title)}</h2><p>${esc(clean(a.description).slice(0,170))}${clean(a.description).length>170?"…":""}</p>
    <a class="read" href="${esc(a.link)}" target="_blank" rel="noopener noreferrer">Read original →</a>
  </article>`).join("");
  document.querySelector("#empty").hidden=list.length!==0;
  status.textContent=`${list.length} article${list.length===1?"":"s"} shown · refreshed ${new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`;
}
async function load(){
  status.textContent="Loading latest headlines…";grid.innerHTML="";
  const results=await Promise.allSettled(FEEDS.map(async f=>{
    const r=await fetch(API_BASE+encodeURIComponent(f.url),{cache:"no-store"});
    if(!r.ok)throw new Error("Feed unavailable");
    const j=await r.json();
    if(j.status!=="ok")throw new Error("RSS error");
    return (j.items||[]).slice(0,12).map(x=>({...x,source:f.name,category:f.category,date:x.pubDate||x.published||""}));
  }));
  articles=results.flatMap(x=>x.status==="fulfilled"?x.value:[]).sort((a,b)=>new Date(b.date)-new Date(a.date));
  const names=[...new Set(articles.map(a=>a.source))];
  source.innerHTML='<option value="all">All sources</option>'+names.map(n=>`<option>${esc(n)}</option>`).join("");
  render();
  if(!articles.length) status.textContent="No feeds could be loaded right now. Try Refresh.";
}
[search,source,category].forEach(x=>x.addEventListener("input",render));
document.querySelector("#refresh").addEventListener("click",load);
load();
