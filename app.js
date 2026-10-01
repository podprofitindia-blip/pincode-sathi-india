const API = "https://api.pincodeapi.in/api/v1";
const pinForm = document.getElementById("pinForm");
const textForm = document.getElementById("textForm");
const pinInput = document.getElementById("pin");
const qInput = document.getElementById("q");
const statusBox = document.getElementById("status");
const resultArea = document.getElementById("resultArea");

function setStatus(msg, error=false){
  statusBox.textContent = msg;
  statusBox.className = "status" + (error ? " error" : "");
}
function clearStatus(){ statusBox.className = "status hidden"; statusBox.textContent = ""; }

function esc(v){
  return String(v ?? "—").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}
function val(o, ...keys){
  for(const k of keys){ if(o && o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k]; }
  return "—";
}
function deliveryClass(v){
  const s=String(v||"").toLowerCase();
  return s.includes("delivery") && !s.includes("non") ? "yes" : (s.includes("non") ? "no" : "");
}
function deliveryLabel(v){
  if(!v || v==="—") return "Not available";
  return v;
}
function mapUrl(o){
  const office=val(o,"office_name","officename","name");
  const district=val(o,"district","District");
  const state=val(o,"state","statename","StateName");
  return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(`${office}, ${district}, ${state}, India`);
}
function addressText(o){
  return `${val(o,"office_name","officename","name")}, ${val(o,"district","District")}, ${val(o,"state","statename","StateName")} - ${val(o,"pincode","Pincode")}, India`;
}
function renderCards(items, title, pin=""){
  if(!Array.isArray(items) || !items.length){
    resultArea.innerHTML = '<div class="card"><strong>No results found.</strong><p>नाम/Pincode थोड़ा बदलकर फिर कोशिश करें।</p></div>';
    return;
  }
  resultArea.innerHTML = `
    <div class="pin-head">
      <div><h2>${esc(title)}</h2><p>Postal information • India</p></div>
      <div class="count">${items.length} result${items.length>1?'s':''}</div>
    </div>
    <div class="cards">${items.map((o,i)=>card(o,i)).join("")}</div>`;
  document.querySelectorAll("[data-copy]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const text=btn.getAttribute("data-copy");
      try{await navigator.clipboard.writeText(text); btn.textContent="✓ Copied"; setTimeout(()=>btn.textContent="📋 Copy",1200);}
      catch(e){alert("Copy नहीं हो पाया। Address को manually select करें.");}
    });
  });
}
function card(o,i){
  const office=val(o,"office_name","officename","name");
  const type=val(o,"office_type","officetype","OfficeType");
  const pin=val(o,"pincode","Pincode");
  const district=val(o,"district","District");
  const state=val(o,"state","statename","StateName");
  const delivery=val(o,"delivery_status","delivery","DeliveryStatus");
  const circle=val(o,"circle","circlename","CircleName");
  const region=val(o,"region","regionname","RegionName");
  const division=val(o,"division","divisionname","DivisionName");
  const addr=addressText(o);
  const dc=deliveryClass(delivery);
  return `<article class="card">
    <h3>🏤 ${esc(office)}</h3>
    <div class="row"><span>Pincode</span><strong>${esc(pin)}</strong></div>
    <div class="row"><span>Office Type</span><strong>${esc(type)}</strong></div>
    <div class="row"><span>District</span><strong>${esc(district)}</strong></div>
    <div class="row"><span>State</span><strong>${esc(state)}</strong></div>
    <div class="row"><span>Delivery</span><strong><span class="delivery ${dc}">${esc(deliveryLabel(delivery))}</span></strong></div>
    <div class="row"><span>Circle</span><strong>${esc(circle)}</strong></div>
    <div class="row"><span>Region</span><strong>${esc(region)}</strong></div>
    <div class="row"><span>Division</span><strong>${esc(division)}</strong></div>
    <div class="actions">
      <button class="copy" data-copy="${esc(addr)}">📋 Copy</button>
      <a href="${mapUrl(o)}" target="_blank" rel="noopener">🧭 Map</a>
    </div>
  </article>`;
}
async function getJSON(url){
  const r=await fetch(url,{headers:{"Accept":"application/json"}});
  if(!r.ok) throw new Error("HTTP "+r.status);
  return await r.json();
}
async function lookupPin(pin){
  clearStatus(); resultArea.innerHTML="";
  if(!/^\d{6}$/.test(pin)){setStatus("कृपया सही 6-digit Pincode डालें।",true);return;}
  setStatus("Pincode खोजा जा रहा है…");
  try{
    const json=await getJSON(`${API}/pincode/${encodeURIComponent(pin)}`);
    if(json.success===false) throw new Error(json.message||"Pincode नहीं मिला");
    const items=json?.data?.post_offices || json?.data?.postOffices || [];
    clearStatus();
    renderCards(items, `Pincode ${pin}`, pin);
    history.replaceState(null,"",`#pincode-${pin}`);
  }catch(e){
    setStatus("Search नहीं हो पाया। Internet connection या API थोड़ी देर बाद फिर try करें।",true);
  }
}
async function searchText(q){
  clearStatus(); resultArea.innerHTML="";
  if(q.trim().length<2){setStatus("कम-से-कम 2 अक्षर डालें।",true);return;}
  setStatus("Search किया जा रहा है…");
  try{
    const json=await getJSON(`${API}/search?q=${encodeURIComponent(q.trim())}`);
    if(json.success===false) throw new Error(json.message||"No result");
    const items=json?.data?.results || json?.data?.post_offices || [];
    clearStatus();
    renderCards(items, `Search: ${q.trim()}`);
  }catch(e){
    setStatus("Search नहीं हो पाया। कृपया फिर try करें।",true);
  }
}
pinForm.addEventListener("submit",e=>{e.preventDefault();lookupPin(pinInput.value.trim())});
textForm.addEventListener("submit",e=>{e.preventDefault();searchText(qInput.value)});
document.querySelectorAll("[data-pin]").forEach(b=>b.addEventListener("click",()=>{pinInput.value=b.dataset.pin;lookupPin(b.dataset.pin)}));

const hash=location.hash.match(/^#pincode-(\d{6})$/);
if(hash) lookupPin(hash[1]);
