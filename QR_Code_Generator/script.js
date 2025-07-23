function generateQRCode() {
    const text = document.getElementById("qrText").value.trim();
    const qrcodeContainer = document.getElementById("qrcode");
    const qrBox = document.getElementById("qrBox");
    const downloadBtn = document.getElementById("downloadBtn");

    qrcodeContainer.innerHTML = ""; // Clear previous QR

    if (!text) {
        alert("Please enter some text or URL.");
        qrBox.style.display = "none";
        return;
    }

    // Create QR Code
    const qr = new QRCode(qrcodeContainer, {
        text: text,
        width: 200,
        height: 200,
        correctLevel: QRCode.CorrectLevel.H,
    });

    // Wait a moment to allow canvas to render
    setTimeout(() => {
        const canvas = qrcodeContainer.querySelector("canvas");
        if (canvas) {
            const dataURL = canvas.toDataURL("image/png");
            downloadBtn.href = dataURL;
            qrBox.style.display = "flex";
        }
    }, 100); // short delay to let QR render
}
