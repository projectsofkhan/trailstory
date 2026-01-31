const panel=document.getElementById("controlPanel");
const bar=document.getElementById("statusBar");

let startY=0,drag=false;

bar.addEventListener("touchstart",e=>{
  startY=e.touches[0].clientY;
  drag=true;
});

bar.addEventListener("touchmove",e=>{
  if(!drag) return;
  if(e.touches[0].clientY-startY>55){
    panel.classList.add("open");
    drag=false;
  }
});

bar.addEventListener("touchend",()=>drag=false);

document.addEventListener("touchstart",e=>{
  if(panel.classList.contains("open") &&
     !panel.contains(e.target) &&
     !bar.contains(e.target)){
    panel.classList.remove("open");
  }
});