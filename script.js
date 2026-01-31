const appGrid=document.getElementById("appGrid");
const timeEl=document.getElementById("current-time");
const bgMusic=document.getElementById("bgMusic");
const musicIcon=document.getElementById("musicIcon");
const qcApps=document.getElementById("qcApps");

const click=new Audio("click.mp3");
click.volume=.4;

document.addEventListener("click",e=>{
  if(e.target.closest(".qc-app")||e.target.closest(".app-icon")||e.target.closest(".music-icon")){
    click.currentTime=0;
    click.play().catch(()=>{});
  }
});

/* MUSIC */
let musicOn=false;
musicIcon.onclick=()=>{
  musicOn=!musicOn;
  if(musicOn){
    bgMusic.play().catch(()=>{});
    musicIcon.classList.add("on");
  }else{
    bgMusic.pause();
    musicIcon.classList.remove("on");
  }
};

/* TIME */
function updateTime(){
  const d=new Date();
  timeEl.textContent=d.getHours()+":"+d.getMinutes().toString().padStart(2,"0");
}
updateTime();
setInterval(updateTime,60000);

/* APPS */
const apps=[
 {n:"Messages",i:"💬",c:"#579AD9",f:"apps/messages/index.html"},
 {n:"Phone",i:"📞",c:"#6BBF6B",f:"apps/phone/index.html"},
 {n:"Gallery",i:"🌄",c:"#6A618F",f:"apps/gallery/index.html"},
 {n:"Insta",i:"📸",c:"#9B5BBE",f:"apps/instashan/index.html"},
 {n:"Diary",i:"📖",c:"#A08E77",f:"apps/diary/index.html"},
 {n:"Browser",i:"🌐",c:"#5D6B9C",f:"apps/browser/index.html"},
 {n:"Tasks",i:"📋",c:"#FF6B6B",f:"apps/task/index.html"},
 {n:"Settings",i:"⚙️",c:"#555",f:"apps/settings/index.html"}
];

/* HOME + SHUTTER */
apps.forEach(a=>{
  const el=document.createElement("a");
  el.className="app-icon";
  el.href=a.f;
  el.innerHTML=`
    <div class="app-icon-body" style="background:${a.c}">${a.i}</div>
    <div class="app-icon-label">${a.n}</div>`;
  appGrid.appendChild(el);

  const s=document.createElement("div");
  s.className="qc-app";
  s.innerHTML=`
    <div class="qc-app-icon" style="background:${a.c}">${a.i}</div>${a.n}`;
  s.onclick=()=>location.href=a.f;
  qcApps.appendChild(s);
});