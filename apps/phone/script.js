let currentContact='';

function updateTime(){
 const d=new Date();
 document.getElementById("current-time").textContent=
 d.getHours()+":"+String(d.getMinutes()).padStart(2,'0');
}

function closeAppAndReturnHome(){
 if(window.opener && !window.opener.closed){
   window.opener.focus();
 }
 window.close();
}

function formatContactName(n){
 if(n==="Mr. Ray") return "Misterray";
 return n.toLowerCase().replace(/[^a-z0-9]/g,'');
}

function openContact(n){
 location.href=`https://projectsofkhan.github.io/Trail/apps/phone/contacts/${formatContactName(n)}/index.html`;
}

function showPasswordPrompt(n){
 currentContact=n;
 document.getElementById("passwordContactName").textContent=`to access ${n}`;
 document.getElementById("passwordOverlay").style.display="flex";
}

function closePasswordPrompt(){
 document.getElementById("passwordOverlay").style.display="none";
}

function checkPassword(){
 const input=document.getElementById("passwordInput");
 if(input.value) openContact(currentContact);
}

window.onload=()=>{
 updateTime();
 setInterval(updateTime,60000);
 document.querySelector(".back-button").onclick=closeAppAndReturnHome;
};