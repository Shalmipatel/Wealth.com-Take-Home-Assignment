const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()

//read assets.json
const data = JSON.parse(fs.readFileSync('assets.json'))
const db = new sqlite3.Database('db.sqlite')

//db has 2 tables: assets and balances
db.serialize(()=>{
    // create table assets which stores the asset information (only attributes that are needed for the assignment)
    db.run(`
        CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        primaryCategory TEXT,
        wealthType TEXT,
        assetInfo TEXT
        );
    `);
    // create table balances which stores the snapshot of the asset balances with relation to the asset table
    db.run(`
        CREATE TABLE IF NOT EXISTS balances(
        assetId TEXT,
        balanceAsOf TEXT,
        balanceCurrent REAL,
        FOREIGN KEY(assetId) REFERENCES assets(id)
        );
    `);


    const insertAsset = db.prepare(
        `INSERT OR REPLACE INTO assets (id,primaryCategory,wealthType,assetInfo) VALUES (?,?,?,?)`
    );
    const insertBalance = db.prepare(`INSERT INTO balances (assetId, balanceAsOf,balanceCurrent) VALUES (?,?,?)`
    );

    // loop through the data and import it into the db 
    data.forEach(a => {
        insertAsset.run(
            a.assetId,
            a.primaryAssetCategory,
            a.wealthAssetType,
            JSON.stringify(JSON.parse(a.assetInfo))
        );
        insertBalance.run(
            a.assetId,
            a.balanceAsOf,
            a.balanceCurrent
        );
        
    });

    insertAsset.finalize();
    insertBalance.finalize();
});
 db.close(()=> console.log('Data imported successfully from json file'));