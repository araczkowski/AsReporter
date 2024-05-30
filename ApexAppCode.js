let url = 'https://script.google.com/macros/s/AKfycbz3vnY1th067-PFtY-onFkPv9O_6RGEoreHmPgS--5Dm_Vc1WkDAz0oinwfBMM-Ck_0/exec';
url = url + '?template=TemplateAPEX1&data='
url = url + btoa(JSON.stringify({"AisGateId":"xxx123"}));
console.log(url);

fetch(url, { method: 'GET', redirect: 'follow' })
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
    const base64ToDecode = atob(rawdata);
    const bytesArr = new Array(base64ToDecode.length);
    for (i = 0; i < base64ToDecode.length; i++) {
        bytesArr[i] = base64ToDecode.charCodeAt(i);
    }
    const bytes4Blob = new Uint8Array(bytesArr)
    const blob = new Blob([bytes4Blob], { "type": "application/pdf" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "filename.pdf";
    downloadLink.click(); // this will start the download instantly! 
    downloadLink.remove();
}

