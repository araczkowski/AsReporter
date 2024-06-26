// Copyright © 2024 SVIETE Andrzej Raczkowski
// Description: Script to get report from AsReporter - you can run it on Oracle APEX Page
// ------------------------------
// TODO Move this to APP Global settings
let url = 'https://script.google.com/macros/s/AKfycbx_V5pYTR9iTjcWpi4u1R8u2K850i8FFx6JoGH_1FpBr36SVJVkN_TPlVTIvguMLaxN/exec';
// ------------------------------
let date = new Date();
let time = date.toLocaleTimeString();
let bodyData = {
    template:"Demo report template",
    fileName: "APEX_REPORT_" + time + ".pdf",
    fileType: "application/pdf",
    data:{
        placeholders:{
            Name:"Oracle APEX ❤️",
            TemplatePlaceholder1:"This is imporant data from JSON",
            DYN_COL_2: "Column 2"
         },
         tables:{
            0: [
              ['r1c1', 'r1c2', 'r1c3', 'r1c4'],
              ['r2c1', 'r2c2', 'r2c3', 'r2c4']
            ],
            1: [['❤️', '☠️☠️'], ['👍👍👍', '👏👏👏👏']]
         }
    }
 }


G_WaitPopup = apex.widget.waitPopup();
apex.message.showPageSuccess("PDF generation has started."); 
setTimeout(function() {
    $('#APEX_SUCCESS_MESSAGE').fadeOut('fast');
}, 3000);

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
    const blob = new Blob([bytes4Blob], { "type": bodyData.fileType });

    // create a link element, hide it, direct it towards the blob, and then 'click' it programatically
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = bodyData.fileName;
    downloadLink.click();
    downloadLink.remove();

    G_WaitPopup.remove();
}