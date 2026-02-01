let currentContact = '';

function updateTime(){
  const d = new Date();
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2,'0');
  document.getElementById("current-time").textContent = `${h}:${m}`;
}

function closeAppAndReturnHome(){
  if(window.opener && !window.opener.closed){
    window.opener.focus();
  }
  window.close();
}

function formatContactName(name){
  if(name === "Mr. Ray") return "Misterray";
  return name.toLowerCase().replace(/[^a-z0-9]/g,'');
}

function openContact(name){
  const path = formatContactName(name);
  window.location.href =
    `https://projectsofkhan.github.io/Trail/apps/phone/contacts/${path}/index.html`;
}

function showPasswordPrompt(name){
  currentContact = name;
  document.getElementById("passwordContactName").textContent =
    `to access ${name}`;
  document.getElementById("passwordOverlay").style.display = "flex";
}

function closePasswordPrompt(){
  document.getElementById("passwordOverlay").style.display = "none";
  document.getElementById("passwordInput").value = "";
}

function checkPassword(){
  const val = document.getElementById("passwordInput").value;
  if(val.length > 0){
    openContact(currentContact);
  }
}

window.onload = () => {
  updateTime();
  setInterval(updateTime,60000);
  document.querySelector(".back-button").onclick = closeAppAndReturnHome;
};