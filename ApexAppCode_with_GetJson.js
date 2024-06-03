// TODO Move this to APP Global settings
let url = 'https://script.google.com/macros/s/AKfycbx_V5pYTR9iTjcWpi4u1R8u2K850i8FFx6JoGH_1FpBr36SVJVkN_TPlVTIvguMLaxN/exec';
// ------------------------------
//
G_WaitPopup = apex.widget.waitPopup();
apex.message.showPageSuccess("PDF generation has started.");
setTimeout(function () {
    $('#APEX_SUCCESS_MESSAGE').fadeOut('fast');
}, 3000);

// Get JSON from Oracle DB via AJAX 
let sqlStatement = `select JSON_OBJECT(key 'template' value 'APEX_TEPLATE_1',
                   key 'fileName' value 'APEX_REPORT_NEW.pdf',
                   key 'fileType' value 'application/pdf',
                   key 'data' value
                   JSON_OBJECT(key 'placeholders'
                               value(JSON_OBJECT(key 'Name' value user,
                                                 key 'Time' value sysdate)),
                               key 'tables'
                               value(JSON_OBJECT(key '0' value
                                                 (select json_arrayagg(JSON_ARRAY(t.TABLE_NAME,
                                                                                  t.TABLESPACE_NAME,
                                                                                  t.LAST_ANALYZED)
                                                                       RETURNING CLOB)
                                                    from all_tables t),
                                                 key '1' value (select json_arrayagg(JSON_ARRAY(1,
                                                                                  2,
                                                                                  3)
                                                                       RETURNING CLOB)
                                                    from dual)
                                                 
                                                 RETURNING CLOB)) RETURNING CLOB)
                   RETURNING CLOB)
            INTO :into_bind
            from dual`;

apex.server.process(
    'GET_REPORT_JSON',
    { x01: sqlStatement },
    {
        success: function (pData) {
            console.log("GET_REPORT_JSON: " + pData);
            let json = JSON.parse(pData);
            fetchAsReport(json);
        },
        dataType: "text"
    }
);

function fetchAsReport(bodyData) {
    console.log("fetchAsReport:" + JSON.stringify(bodyData));

    fetch(url, { method: 'POST', redirect: 'follow', body: JSON.stringify(bodyData) })
        .then(response => response.text())
        .then((text) => {
            console.log("fetchAsReport text:" + text.length);
            downloadTheRaportResult(text, bodyData);
        })
        .catch(err => {
            console.log(err);
        }
    )
}
//
function downloadTheRaportResult(rawdata, bodyData) {
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