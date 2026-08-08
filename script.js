document.addEventListener("DOMContentLoaded", () => {
    const inputCode = document.getElementById("codeInput");
    const outputCode = document.getElementById("codeOutput");
    const convertBtn = document.getElementById("convertBtn");

    if (!convertBtn || !inputCode || !outputCode) return;

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
            // ส่งข้อมูลฝากไฟล์ที่ dpaste (ไม่มีปัญหา CORS)
            const response = await fetch("https://dpaste.com/api/v2/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    content: code,
                    syntax: "lua",
                    expiry_days: "365"
                })
            });

            if (response.ok) {
                const rawUrl = (await response.text()).trim() + ".txt";
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
                outputCode.value = `-- เซิร์ฟเวอร์ขัดข้อง (Code: ${response.status})`;
                outputCode.style.color = "#ff4d4d";
            }
        } catch (error) {
            outputCode.value = `-- เกิดข้อผิดพลาด: ${error.message}`;
            outputCode.style.color = "#ff4d4d";
        } finally {
            setTimeout(() => {
                convertBtn.innerText = originalBtnText;
                convertBtn.disabled = false;
            }, 2000);
        }
    });
});
