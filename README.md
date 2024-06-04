# AsReporter - Application Script Reporter

AsReporter is a business application that produces Office documents and PDF reports based on templates and JSON data. AsReporter is a Web app written in Google Apps Script, enabling any web application to generate your Office (Word, Excel, PowerPoint) and PDF-documents in no time and effort - AsReporter makes reporting in any application fast and easy.

## Architecture overview

![diagram](images/AsReporter.png?raw=true "AsReporter diagram")

## Installation and integration with your system - step by step 

### Create Apps Script Web App in Google Workspace

#### 1. Go to -> https://script.google.com/home

![picture1](images/1.png?raw=true "Apps Script")

#### 2. Click button "New project" to create a new project

![picture2](images/2.png?raw=true "Apps Script 2"):
you can name it -> ``AsReporter Office Print Server``

#### 3. Add Apps script code

Copy and Paste the code from file in this repo: [Code.gs.js](Code.gs.js) to the ``Code.gs`` file in Apps script:
![picture3](images/3.png?raw=true "Apps Script 3")

#### 4. Deploy Web app

Click a button ``Deploy`` -> ``New deployment`` to deploy the project:
![picture4](images/4.png?raw=true "Apps Script 4")

as a deployment type choice ``Web app``:
![picture5](images/5.png?raw=true "Apps Script 5")

you can add a description and you need to change the ``Who has access`` parameter to ``Anyone``
after this click the ``Deploy`` button:
![picture6](images/6.png?raw=true "Apps Script 6")

if you are doing this for the first time you need to ``Authorize access``:
![picture7](images/7.png?raw=true "Apps Script 7")

and allow AsReporter to manage Google Drive files:
![picture8](images/8.png?raw=true "Apps Script 8")

#### 4. Test Web app

After the deployment you can test your app - just copy the app URL:
![picture9](images/9.png?raw=true "Apps Script 9")

 and paste it to the browser - you will see the app info page
![picture10](images/10.png?raw=true "Apps Script 10")

### Create report template in Google Drive

#### 1. Copy the folder with demo template

Go to -> https://drive.google.com/
Copy and Paste the folder ``AsReporter Templates Files`` from this repo to the ``Google Drive`` -> ``AsReporter Templates Files``:
![picture11](images/11.png?raw=true "Apps Script 11")

#### 2. Review the demo template

In the folder ``Google Drive`` -> ``AsReporter Templates Files`` there is a file ``Demo report template`` open it in Google Docs to see how the template was written:
![picture12](images/12.png?raw=true "Apps Script 12")
You should easy see the text and table placeholders.

### Call report generation

#### 1. From Apps Script

In Apps script you can run or debug the ``doPost`` function:
![picture13](images/13.png?raw=true "Apps Script 13")
After ``doPost`` run or debug, you can open generated pdf file in Google Drive folder ``AsReporter Templates Files``:
![picture14](images/14.png?raw=true "Apps Script 14")

#### 2. From any web app - use ``BrowserAppCode.js`` to POST report rendering and download

Go to any page in the browser, for example ``https://google.com`` and open a browser console via ``F12``.
Now paste to the console code from the script ``BrowserAppCode.js`` and press ``Enter``:
![picture15](images/15.png?raw=true "Apps Script 15")

The report will be produced and downloaded in the browser - you will receive a prompt to save it:
![picture16](images/16.png?raw=true "Apps Script 16")

Now you can open the report from your disk to see the result:
![picture17](images/17.png?raw=true "Apps Script 17")
(as you can see my pdf viewer on Ubuntu can't handle the emoticons color... never mind)

#### 3. Use ``ApexAppCode.js`` in Oracle APEX to POST report rendering and download from Oracle APEX

If you wish to generate reports or documents from APEX then you can use sample ``ApexAppCode.js`` for this. Just copy this code and paste in the dynamic action after button do download report is clicked:
![picture18](images/18.png?raw=true "Apps Script 18")


Of course you can get JSON data from Oracle DB, for this:

a) Add ``Ajax Calback`` process named **GET_REPORT_JSON** on APEX page:
    ```
    DECLARE
        l_clob  clob;
        l_query varchar2(32767);
    BEGIN
        l_query := apex_application.g_x01;
        EXECUTE IMMEDIATE l_query
            INTO l_clob;
        htp.p(l_clob);
    END;
    ```

![picture19](images/19.png?raw=true "Apps Script 19")


b)  Add code from file: ``ApexAppCode_with_GetJson.js`` to the dynamic action type JS, executed after the button do download report is clicked:
![picture20](images/20.png?raw=true "Apps Script 20")

The important part is a JSON creation from SQL query, we need to have a special structure of the JSON that I’m using. To do this we can use this kind of query as below:

```
select JSON_OBJECT(key 'template' value 'APEX_TEPLATE_1',
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
  from dual
```

in retur we will receive a JSON like this:

```
{
   "template":"APEX_TEPLATE_1",
   "fileName":"APEX_REPORT_NEW.pdf",
   "fileType":"application/pdf",
   "data":{
      "placeholders":{
         "Name":"APEX_PUBLIC_USER",
         "Time":"2024-06-03T19:51:32"
      },
      "tables":{
         "0":[
            [
               "DUAL",
               "SYSTEM",
               "2021-04-28T22:04:15"
            ],
            [
               "MAP_OBJECT"
            ]
         ],
         "1":[
            [
               1,
               2,
               3
            ]
         ]
      }
   }
}
```

After this explanation and code snippets I hope, you can easily imagine how to add the next table or next placeholder in JSON and in template.


### Additional features

#### 1. Add images

To add an image to the template we simply replace the text placeholder with the image blob.
Images are sent to the ASReporter as base64 encoded string in array images, like below: 

```
{
   "template":"APEX_TEPLATE_1",
   "fileName":"APEX_REPORT_NEW.pdf",
   "fileType":"application/pdf",
   "data":{
      "placeholders":{
         "Name":"APEX_PUBLIC_USER",
         "Time":"2024-06-03T19:51:32"
      },
      "tables":{
         "0":[["DUAL", "SYSTEM", "2021-04-28T22:04:15"]]
      },
      images: [
          {"placeholderText": "IMAGE_1", "imageBase64": `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`, "imageWidth": 80}
        ]
   }
}
```

During the report/document rendering the ``placeholderText`` for example -> ``IMAGE_1`` will be replaced in the document by a decoded base64 element ``imageBase64`` and saved as a blob again in the document.

We are replacing all the occurrences of the placeholder **{IMAGE_1}** to image, so if we will have more then one placeholder of **{IMAGE_1}** in the document then we will receive more than one occurrence of image. Like on picture blow:
![picture21](images/21.png?raw=true "Apps Script 21")


> Oracle hint
To send blobs from Oracle DB to ASReporter you need to convert a BLOB datatype into a CLOB that is base64-encoded. For this you can use this function:

```
APEX_WEB_SERVICE.BLOB2CLOBBASE64
```