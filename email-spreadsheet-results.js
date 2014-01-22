function sendEmails() {
  var emailAddress = "email@example.com"
  var sheet = SpreadsheetApp.getActiveSheet();
  var startRow = 3;  // First row of data to process (ignore headers)
  var numRows = 10000;   // MAX Number of rows to process - this is probably super hacky TODO: FIX THIS

  var dataRange = sheet.getRange(startRow, 1, numRows, 3)
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  var email = ""
  for (i in data) {
    var row = data[i];
    var timestamp = row[0];  // First column
    var pretty_timestamp = new Date(timestamp);
    //Logger.log("pretty:"+pretty_timestamp);

    var old = getWindow();

    // Only add to email if timestamp is within the last week, otherwise ignore
    if (pretty_timestamp > old) {
      var user = row[1];       // Second column
      var snippet = row[2];
      var update = user + "\n" + snippet + "\n\n";
      email = email + update;
    }
  }

  // Format subject line
  var now = new Date();
  var date = now.getMonth()+1+"-"+now.getDate()+"-"+now.getFullYear();
  var subject = "Updates for week ending "+date

  // Only send email if it is not blank
  if (email != "") {
    MailApp.sendEmail(emailAddress, subject, email);
    MailApp.sendEmail("brian@pocketgems.com", subject, email); //also email me!
  }
}

// TODO: switch this to JS Date instead of reading from now() in the spreadsheet
function getWindow() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet()
  var window = new Date(sheet.getRange("a1").getValues());
  return window;
}





/**
 * Adds a custom menu to the active spreadsheet, containing a single menu item
 * for invoking the readRows() function specified above.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function onOpen() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [{
    name : "Email Updates",
    functionName : "sendEmails"
  }];
  sheet.addMenu("Snippets", entries);
};