let url = 'https://script.google.com/macros/s/AKfycbxX_YBYcnIlxc9kO7EaX9QjV8qHYJchu5C5kHE2esbA3UvOf0ypOVCYCFqBmnhUWLiB/exec?data={"AisGateId":"xxx123"}&template=TemplateAPEX1';
//
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

