//GQL resolver for asset queries
const sqlite3 = require('sqlite3');
const { resolvers: jsonResolvers } = require('./schema');

module.exports = {
    ...jsonResolvers,
    Query: {
        assets: (_, { asOf }) =>
            new Promise((resolve, reject) => {
                const db = new sqlite3.Database('db.sqlite');
                const dateCond = asOf ? `AND balanceAsOf <= '${asOf}'` : '';
                const sql = `
                    SELECT a.id, a.primaryCategory, a.wealthType, a.assetInfo, b.balanceCurrent, b.balanceAsOf
                    FROM assets a
                    JOIN balances b ON b.assetId = a.id
                    WHERE b.balanceAsOf = (
                        SELECT MAX(balanceAsOf)
                        FROM balances
                        WHERE assetId = a.id
                            ${dateCond}
                    )
                `;
                db.all(sql, (err, rows) => {
                    db.close();
                    if (err) return reject(err);
                    resolve(rows.map(r => ({
                        ...r,
                        assetInfo: JSON.parse(r.assetInfo)
                    })));
                });
            }) 
    }
};