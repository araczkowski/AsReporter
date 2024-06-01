let url = 'https://script.google.com/macros/s/AKfycby1XlaeeK0lI4VLhTmk2k3en5d23x_-W2Gkuvj751gZKUj4eGRyWTDaxtZct02VPc_z/exec';
let bodyData = { template: "TemplateAPEX1", data: { AisGateId: "xxx123" } };
let fileType = "application/pdf";
let fileName = "filename.pdf";

fetch(url, { method: 'POST', redirect: 'follow', body: JSON.stringify(bodyData) })
    .then(response => response.text())
    .then((text) => {
        console.log(text.length);
        downloadTheRaportResult(text);
    })
    .catch(err => {
        console.log(err);
    }
    )

//
function downloadTheRaportResult(rawdata) {
    // decode base64 to bytes
    const base64ToDecode = atob(rawdata);
    const bytesArr = new Array(base64ToDecode.length);
    for (i = 0; i < base64ToDecode.length; i++) {
        bytesArr[i] = base64ToDecode.charCodeAt(i);
    }
    const bytes4Blob = new Uint8Array(bytesArr)
    const blob = new Blob([bytes4Blob], { "type": fileType });

    // create a link element, hide it, direct it towards the blob, and then 'click' it programatically
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = fileName;
    downloadLink.click();
    downloadLink.remove();
}