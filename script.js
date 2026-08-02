const button=document.getElementById("encrypt");

button.onclick=()=>{

button.innerHTML="✅ สำเร็จ";

button.style.background="linear-gradient(90deg,#00d26a,#00a94f)";

setTimeout(()=>{

button.innerHTML="🚀 เริ่มปกปิดสคริปต์";

button.style.background="linear-gradient(90deg,#29b5ff,#365cff)";

},2000);

};
