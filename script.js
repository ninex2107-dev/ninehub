const inputCode = document.getElementById("codeInput");
const outputCode = document.getElementById("codeOutput");
const convertBtn = document.getElementById("convertBtn");

convertBtn.addEventListener("click", async () => {
    const code = inputCode.value.trim();
    
    if (!code) {
        outputCode.value = "-- กรุณาวางโค้ด Lua ก่อนกดแปลง!";
        outputCode.style.color = "#ff4d4d";
        return;
    }

    const originalBtnText = convertBtn.innerText;
    convertBtn.innerText = "กำลังแปลงและอัปโหลด...";
    convertBtn.disabled = true;
    outputCode.value = "-- กำลังเชื่อมต่อเซิร์ฟเวอร์...";
    outputCode.style.color = "#66d9ef";

    try {
        // เปลี่ยนมาใช้การส่งข้อมูลแบบ JSON ที่ปรับโครงสร้างให้รองรับ API 
        const response = await fetch("https://pastefy.app/api/v2/paste", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: code,
                title: "Script",
                visibility: "UNLISTED"
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            const pasteId = data.paste.id;
            const rawUrl = `https://pastefy.app/${pasteId}/raw`;
            const finalLoadstring = `loadstring(game:HttpGet("${rawUrl}"))()`;
            
            outputCode.value = finalLoadstring;
            outputCode.style.color = "#4caf50";
            
            try {
                await navigator.clipboard.writeText(finalLoadstring);
                convertBtn.innerText = "คัดลอกแล้ว!";
            } catch (err) {
                convertBtn.innerText = "แปลงสำเร็จ!";
            }
        } else {
            // แสดงข้อผิดพลาดที่ส่งกลับมาจากเซิร์ฟเวอร์ตรงๆ
            outputCode.value = `-- เซิร์ฟเวอร์ปฏิเสธคำขอ (Error): ${data.message || response.status}`;
            outputCode.style.color = "#ff4d4d";
            convertBtn.innerText = "ล้มเหลว";
        }
    } catch (error) {
        outputCode.value = `-- เกิดข้อผิดพลาดในการเชื่อมต่อ: ${error.message}`;
        outputCode.style.color = "#ff4d4d";
        convertBtn.innerText = "ล้มเหลว";
    } finally {
        setTimeout(() => {
            convertBtn.innerText = originalBtnText;
            convertBtn.disabled = false;
        }, 2000);
    }
});
