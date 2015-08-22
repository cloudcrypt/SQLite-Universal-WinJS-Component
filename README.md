# SQLite Universal WinJS Component
SQLite Universal WinJS Component for Javascript Windows Store Apps running on the Windows 10 Universal App Platform.

## Setup

_SQLite Universal WinJS_ consists of two parts: 1) WinRT C++ universal component named
_SQLite3Component_ and 2) A JavaScript file called _SQLiteHelper_ that builds
upon the component and simplifies use.

To use this component, copy the _SQLiteUniversalWinJS_ folder to the root of your app's solution folder.
Then in Visual Studio, go to File -> Add -> Existing Project, and choose the file _SQLiteUniversalWinJS.vcxproj_ found in
*[YourSolutionFolder]\SQLiteUniversalWinJS\*
<br>
Next, add a reference to the component in your app solution's main project in Visual Studio by going to Project -> Add Reference ... ,
where you go to Projects, and enable the _SQLiteUniversalWinJS_ project as a reference.
<br>
Finally, copy the JavaScript file _SQLiteHelper.js_ from the _WinRT Javascript Helper Files_ folder to the _js_ folder in your solution's
main project, and reference it in your _default.html_ file to use it.

#### Dependencies
This component uses the *SQLite for Universal App Platform* extension, by the SQLite Development Team.
(Current version = 3.8.11.1)
The extension is **required** for the component to work.

## Usage

One custom JavaScript method in _SQLiteHelper.js_ is _checkDatabaseAsync(databaseFolder, databaseFileName)_, which, will check
if a global database object is defined, and if not, will define one, before returning a WinJS.Promise object. 
<br>
To use, customize the _MyGlobals.database_ variable in it, to be the variable name you use for your global database object.

## Examples

```javascript
checkDatabaseAsync().then(function () {
    MyGlobals.database.executeAsync("SELECT * FROM Books").then(function (rows) {
        rows.forEach(function (row) {
            var book = {
                bookName: row.getFirstValueByName("bookName")
            };
            // do something after forEach here
        });
    });
});
```
<br>
```javascript
function createDB() {
  // Create the request to open the database, named BookDB. If it doesn't exist, create it.
  var database;

  SQLite.Database.openDatabaseInFolderAsync(Windows.Storage.ApplicationData.current.roamingFolder, "BookDB.sqlite").then(
      function (openedOrCreatedDatabase) {
          database = openedOrCreatedDatabase;
          return executeStatementsAsTransactionAsync(database, [
              "CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY UNIQUE, title TEXT, authorid INTEGER);",
              "CREATE TABLE IF NOT EXISTS authors (id INTEGER PRIMARY KEY UNIQUE, name TEXT);",
              "CREATE TABLE IF NOT EXISTS checkout (id INTEGER PRIMARY KEY UNIQUE, status INTEGER);"
          ]);
      }).then(function () {
          if (database) {
              database.close();
              database = null;
          }
      },
      function (err) {
          if (database) {
              database.close();
              database = null;
          }
          WinJS.log && WinJS.log("Database open failure: " + err, "sample", "error");
      });
}
```
## Credits
This is a port of the Windows 8.1 Component by Dave Risney found at https://code.msdn.microsoft.com/windowsapps/Universal-JavaScript-5728abdb
<br>
For more information, go to http://blogs.windows.com/buildingapps/2014/07/02/writing-a-sqlite-wrapper-component-for-universal-windows-apps/

			    
