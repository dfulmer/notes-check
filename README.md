# notes-check
Notes Check Google Sheets app.  

Context, background, and a detailed explanation of this script is in the article "Real-Time Reporting Using the Alma API and Google Apps Script" published in Issue 58, 2023-12-04, of The Code4Lib Journal. The article is available here: [https://journal.code4lib.org/articles/17695](https://journal.code4lib.org/articles/17695).

## How to Create the Notes Check App

This will create a container-bound project from Google Sheets (https://developers.google.com/apps-script/guides/bound).
Open a Sheets spreadsheet.

In the Google Sheet rename the Sheet.
Add this formatting to the Sheet:

In Cell A1:
>Type something in B1 to check Notes

Cell A2:
>This is the pattern:

Cell A3:
>^Act......,.............-...,.,\[p\]$

Cell A7 to E7:
>Correct Formatting?
>
>Invoice Number
>
>Batch Number
>
>Vendor
>
>Note

Apply Bold formatting to cells A7 to E7 and a black bottom border.

Click Cell B1 and add a red border on all 4 sides.

In cell A1 Click Format > Conditional Formatting and add the following rules:

### Conditional Formatting Rule
Apply to range:
>A1:A1000

Format cells if…

Custom formula is
>=$A1=”No”

Formatting style:
>Fill red

Click Done

### Conditional Formatting Rule
Apply to range:
>A1,C1:E1,A6:E1000

Format cells if…

Custom formula is
>=$A1=”No batch number”

Formatting style:
>Fill red

Click Done

### Conditional Formatting Rule
Apply to range:
>A1,C1:E1,A6:E1000

Format cells if…

Custom formula is
>=$A1=”No good note”

Formatting style:
>Fill red

Click Done

### Conditional Formatting Rule
Apply to range:
>A1:A1000,C1:E1000,B2:B1000

Format cells if…

Custom formula is
>=$A1="These below are not okay"

Formatting style:
>Default (green)

Click Done

### Conditional Formatting Rule
Apply to range:
>A1:A1000,C1:E1000,B2:B1000

Format cells if…

Custom formula is
>=$A1="These below are all notes"

Formatting style:
>Default (green)

Click Done

### Conditional Formatting Rule
Apply to range:
>C9:C1000

Format cells if…

Custom formula is
>=not(REGEXMATCH(C9,"^C"))

Formatting style:
>Purple

Click Done

### Add Custom Function
Click in cell A8 and add this:
>=GETNOTES(B1)

### Add the script
Click Extensions > Apps Script.

In the script editor, click Untitled project.

Give your project a name and click Rename.

Replace any code in the text editor with the contents of Note Check.gs.

Change the line "var apikey = ‘your_api_key’;" to add your api key. The key will need these Permissions: Area: Acquisition, Env: Production or Sandbox, Permissions: Read-only.

Click the Save Project disk icon at the top.

To begin using the Sheet, you must grant permissions.

Click Run at the top of the screen.

Click Review permissions.

Choose an account.

Click Allow.

Go back to the Sheet and type something into B1 and hit Enter. The report will populate with the invoice information.
