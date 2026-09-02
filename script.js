const menu=document.querySelector("#menu"),nav=document.querySelector(".nav nav");
menu?.addEventListener("click",()=>{nav.style.display=nav.style.display==="flex"?"none":"flex";nav.style.position="absolute";nav.style.top="70px";nav.style.right="10px";nav.style.background="#09162c";nav.style.padding="18px";nav.style.flexDirection="column"});
const q=document.querySelector("#q"),cat=document.querySelector("#cat"),items=[...document.querySelectorAll("#docs article")];
function filterDocs(){const s=(q.value||"").toLowerCase();const c=cat.value;items.forEach(x=>{const okc=c==="all"||x.dataset.c===c;const okt=x.textContent.toLowerCase().includes(s);x.style.display=okc&&okt?"block":"none"})}
q?.addEventListener("input",filterDocs);cat?.addEventListener("change",filterDocs);