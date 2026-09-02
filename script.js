const menu=document.querySelector("#menu"),nav=document.querySelector(".nav nav");
menu?.addEventListener("click",()=>{nav.style.display=nav.style.display==="flex"?"none":"flex";nav.style.position="absolute";nav.style.top="70px";nav.style.right="10px";nav.style.background="#09162c";nav.style.padding="18px";nav.style.flexDirection="column"});
const q=document.querySelector("#q"),cat=document.querySelector("#cat"),items=[...document.querySelectorAll("#docs article")];
function filterDocs(){const s=(q.value||"").toLowerCase();const c=cat.value;items.forEach(x=>{const okc=c==="all"||x.dataset.c===c;const okt=x.textContent.toLowerCase().includes(s);x.style.display=okc&&okt?"block":"none"})}
q?.addEventListener("input",filterDocs);cat?.addEventListener("change",filterDocs);
async function loadEvidence(){
  const box=document.querySelector("#docs");
  try{
    const data=await fetch("documents/manifest.json").then(r=>r.json());
    const q=document.querySelector("#q"), cat=document.querySelector("#cat");
    async function render(){
      const s=(q.value||"").toLowerCase().trim(), c=cat.value;
      const rows=data.filter(d=>{
        const okc=c==="all" || (c==="comp"&&d.category==="Compassionate Appointment") ||
          (c==="lod"&&d.category==="Line of Duty") || (c==="vig"&&d.category==="Vigilance") ||
          (c==="service"&&d.category==="Service / Death");
        return okc && (d.id+" "+d.date+" "+d.category+" "+d.title).toLowerCase().includes(s);
      });
      box.innerHTML=rows.map(d=>{
        const path="documents/"+encodeURIComponent(d.filename);
        return `<article class="doccard"><div class="doctop"><b>${d.id}</b><span>${d.category}</span></div>
        <small>${d.date}</small><h3>${d.title}</h3>
        <div class="docaction"><a class="pdfbtn" href="${path}" target="_blank" rel="noopener">View PDF</a>
        <span class="await">If the file is not uploaded yet, it will show as unavailable.</span></div>
        </article>`;
      }).join("") || "<p>No matching documents.</p>";
    }
    q.addEventListener("input",render); cat.addEventListener("change",render); render();
  }catch(e){box.innerHTML="<p>Evidence index could not be loaded.</p>"}
}
loadEvidence();
