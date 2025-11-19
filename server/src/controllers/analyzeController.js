const db = require('../../db');

const analyzeQuery = async (req, res, next) => {
    const { userQuery } = req.body;

    if (!userQuery) {
        return res.status(400).json({ error: 'Query is required.' });
    }

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // We use EXPLAIN (FORMAT JSON, ANALYZE) to get the execution plan
        // This actually runs the query, so we MUST be in a transaction that we rollback.
        const analysisQuery = `EXPLAIN (FORMAT JSON, ANALYZE) ${userQuery}`;
        const result = await client.query(analysisQuery);

        await client.query('ROLLBACK');

        const queryPlan = result.rows[0]['QUERY PLAN'];
        res.json(queryPlan);
    } catch (err) {
        await client.query('ROLLBACK');
        // Pass to error handler
        next(err);
    } finally {
        client.release();
    }
};

module.exports = {
    analyzeQuery
};
