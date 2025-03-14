# Writes to google sheet through JS and App Script

## Initialization

```
    <script src="https://cdn.jsdelivr.net/gh/hitchcliff/google-spreadsheet/public/bundle.js"></script>

<script>

	// Form element
	const form = document.querySelector("#form-target");

	// Handle submit
	form.addEventListener("submit", (event) => {
		event.preventDefault();

		// Input fields
		const name = document.querySelector("#input-name").value;
		const email = document.querySelector("#input-email").value;

		// Instantiate
		const spreadsheet = new Spreadsheet();

		// Spreadsheet values
		spreadsheet.data = {name, email};
		spreadsheet.endpoint = "https://script.google.com/macros/s/AKfycbxde2w_Nevs_bx3x3UV_fjbGHGFTMg-1pEEfuGQe9mKJHvHeX6PMyXicBX4oSUfBs6n/exec";
		spreadsheet.success = () => alert("success!");
    spreadsheet.error = () => alert("error!");

		// Submits the spreadsheet
		spreadsheet.submit(); // submits the form
	});
</script>
```

## GSheet Endpoint

`https://docs.google.com/spreadsheets/d/1jMb2u6XjqzfGmtYt4M1PsCt10bBFApDsMfgdLaNNEnM/edit?usp=sharing`

## Apps Script

```
function doGet(e){
  return handleResponse(e);
}

function doPost(e){
  return handleResponse(e);
}

//  Enter sheet name where data is to be written below
var SHEET_NAME = "Sheet1";

var SCRIPT_PROP = PropertiesService.getScriptProperties(); // new property service

function handleResponse(e) {
  // shortly after my original solution Google announced the LockService[1]
  // this prevents concurrent access overwritting data
  // [1] http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html
  // we want a public lock, one that locks for all invocations
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.

  try {
    // next set where we write the data - you could write to multiple/alternate destinations
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);

    // we'll assume header is in row 1 but you can override with header_row in GET/POST data
    var headRow = e.parameter.header_row || 1;
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1; // get next row
    var row = [];

    // loop through the header columns
    for (i in headers){
      if (headers[i] == "Timestamp"){ // special case if you include a 'Timestamp' column
        row.push(new Date());
      } else { // else use header name to get data\
        row.push(e.parameter[headers[i]]);
      }
    }
    // more efficient to set values as [][] array than individually
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    // return json success results
    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
          .setMimeType(ContentService.MimeType.JSON);
  } catch(e){
    // if error return this
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally { //release lock
    lock.releaseLock();
  }
}

function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
}
```

### Example

Look for `/example` folder for basic example
