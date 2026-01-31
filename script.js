const bgMusic=document.getElementById("bgMusic");
const musicIcon=document.getElementById("musicIcon");

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

/* SHUTTER APPS */
const qcApps=document.getElementById("qcApps");

const apps=[
 {n:"Msg",i:"💬",c:"#579AD9",f:"apps/messages/index.html"},
 {n:"Call",i:"📞",c:"#6BBF6B",f:"apps/phone/index.html"},
 {n:"Gal",i:"🌄",c:"#6A618F",f:"apps/gallery/index.html"},
 {n:"Insta",i:"📸",c:"#9B5BBE",f:"apps/instashan/index.html"},
 {n:"Diary",i:"📖",c:"#A08E77",f:"apps/diary/index.html"},
 {n:"Web",i:"🌐",c:"#5D6B9C",f:"apps/browser/index.html"},
 {n:"Task",i:"📋",c:"#FF6B6B",f:"apps/task/index.html"},
 {n:"Set",i:"⚙️",c:"#555",f:"apps/settings/index.html"}
];

apps.forEach(a=>{
  const d=document.createElement("div");
  d.className="qc-app";
  d.innerHTML=`
    <div class="qc-app-icon" style="background:${a.c}">${a.i}</div>
    ${a.n}`;
  d.onclick=()=>location.href=a.f;
  qcApps.appendChild(d);
});