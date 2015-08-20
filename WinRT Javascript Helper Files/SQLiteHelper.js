
function runPromisesInSerial(promiseFunctions) {
    return promiseFunctions.reduce(function (promiseChain, nextPromiseFunction) {
        return promiseChain.then(nextPromiseFunction);
    },
    WinJS.Promise.wrap());
};

function executeAsTransactionAsync(database, workItemAsyncFunction) {
    return database.executeAsync("BEGIN TRANSACTION").then(workItemAsyncFunction).then(
        function (result) {
            var successResult = result;
            return database.executeAsync("COMMIT").then(function () {
                return successResult;
            });
        },
        function (error) {
            var errorResult = error;
            return database.executeAsync("COMMIT").then(function () {
                throw errorResult;
            });
        });
};

function executeStatementsAsTransactionAsync(database, statements) {
    var executeStatementPromiseFunctions = statements.map(function statementToPromiseFunction(statement) {
        return database.executeAsync.bind(database, statement);
    });

    return executeAsTransactionAsync(database, function () {
        return runPromisesInSerial(executeStatementPromiseFunctions);
    });
};

function bindAndExecuteStatementsAsTransactionAsync(database, statementsAndParameters) {
    var bindAndExecuteStatementPromiseFunctions = statementsAndParameters.map(function (statementAndParameter) {
        return database.bindAndExecuteAsync.bind(database, statementAndParameter.statement, statementAndParameter.parameters);
    });

    return executeAsTransactionAsync(database, function () {
        return runPromisesInSerial(bindAndExecuteStatementPromiseFunctions);
    });
};

function checkDatabaseAsync(databaseFolder, databaseFileName) {
    return new WinJS.Promise(function (complete, error, progress) {
        databaseFolder = typeof databaseFolder !== 'undefined' ? databaseFolder : Windows.Storage.ApplicationData.current.localFolder;
        databaseFileName = typeof databaseFileName !== 'undefined' ? databaseFileName : "db.sqlite";
        if (MyGlobals.database) {
            complete(MyGlobals.database)
        } else {
            SQLite.Database.openDatabaseInFolderAsync(databaseFolder, databaseFileName).then(
                    function (openedDatabase) {
                        MyGlobals.database = openedDatabase;
                        complete(MyGlobals.database);
                    });
        };
    });
};