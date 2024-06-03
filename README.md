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

1. Add ``Ajax Calback`` process on APEX page:
    ``
    DECLARE
        FUNCTION SQL2JSON(sql_statement VARCHAR2) RETURN VARCHAR2
        AS
            cur_sql SYS_REFCURSOR;
            p1_json VARCHAR2(32000);
        BEGIN
            OPEN cur_sql FOR sql_statement;
            apex_json.initialize_clob_output;
            apex_json.open_object;
            apex_json.write(cur_sql);
            apex_json.close_object;
            p1_json := apex_json.get_clob_output;
            apex_json.free_output;
            
            RETURN p1_json;
        END;
    BEGIN
        htp.p(SQL2JSON(apex_application.g_x01));
    END;

    ``

    2. 