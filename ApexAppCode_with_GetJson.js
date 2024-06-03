// Copyright © 2024 SVIETE Andrzej Raczkowski
// Description: Script to get report from AsReporter - you can run it on Oracle APEX Page
// TODO Move this to APP Global settings
let url = 'https://script.google.com/macros/s/AKfycbx_V5pYTR9iTjcWpi4u1R8u2K850i8FFx6JoGH_1FpBr36SVJVkN_TPlVTIvguMLaxN/exec';
// ------------------------------
let date = new Date();
let time = date.toLocaleTimeString();

//
G_WaitPopup = apex.widget.waitPopup();
apex.message.showPageSuccess("PDF generation has started.");
setTimeout(function () {
    $('#APEX_SUCCESS_MESSAGE').fadeOut('fast');
}, 3000);


// Get JSON from Oracle DB via AJAX 
let sqlStatement = `SELECT 
                'APEX_TEPLATE_1' as "template", 
                'APEX_REPORT_2' as "fileName", 
                'application/pdf' as "fileType",
                cursor(select user as "Name" from dual) as "data"
                FROM DUAL`;
apex.server.process(
    'GET_REPORT_JSON',            
    { x01: sqlStatement },  
    {
        success: function (pData) {  
            console.log(pData);           
            let json = JSON.parse(pData);
            fetchAsReport(json.ret[0]);
        },
        dataType: "text"                   
    }
);




function fetchAsReport(bodyData) {
    console.log(bodyData);

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
}
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