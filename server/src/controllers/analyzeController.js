const { Client } = require('pg');
const db = require('../../db'); // App's DB for fetching credentials
const { decrypt } = require('../utils/encryption');

const analyzeQuery = async (req, res, next) => {
    const { userQuery, credentialId } = req.body;
    const userId = req.user.id;

    if (!userQuery) {
        return res.status(400).json({ error: 'Query is required.' });
    }

    if (!credentialId) {
        return res.status(400).json({ error: 'Credential ID is required.' });
    }

    let targetClient = null;

    try {
        // 1. Fetch credentials from the app's database
        const credResult = await db.query(
            'SELECT * FROM db_credentials WHERE id = $1 AND user_id = $2',
            [credentialId, userId]
        );

        if (credResult.rows.length === 0) {
            return res.status(404).json({ error: 'Database credential not found or unauthorized.' });
        }

        const cred = credResult.rows[0];
        const password = decrypt({ iv: cred.iv, encryptedData: cred.password_encrypted });

        // 2. Connect to the target database
        targetClient = new Client({
            user: cred.username,
            host: cred.host,
            database: cred.db_name,
            password: password,
            port: cred.port,
        });

        await targetClient.connect();

        // 3. Run the analysis in a transaction
        await targetClient.query('BEGIN');

        // We use EXPLAIN (FORMAT JSON, ANALYZE) to get the execution plan
        // This actually runs the query, so we MUST be in a transaction that we rollback.
        const analysisQuery = `EXPLAIN (FORMAT JSON, ANALYZE) ${userQuery}`;
        const result = await targetClient.query(analysisQuery);

        await targetClient.query('ROLLBACK');

        const queryPlan = result.rows[0]['QUERY PLAN'];
        res.json(queryPlan);

    } catch (err) {
        if (targetClient) {
            try {
                await targetClient.query('ROLLBACK');
            } catch (rollbackErr) {
                console.error('Error rolling back target transaction:', rollbackErr);
            }
        }
        // Pass to error handler
        next(err);
    } finally {
        if (targetClient) {
            try {
                await targetClient.end();
            } catch (endErr) {
                console.error('Error closing target connection:', endErr);
            }
        }
    }
};

module.exports = {
    analyzeQuery
};
