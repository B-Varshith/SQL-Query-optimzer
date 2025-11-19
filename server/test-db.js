const db = require('./db');
(async () => {
    try {
        const res = await db.query('SELECT 1');
        console.log('DB Connection successful:', res.rows);
    } catch (err) {
        console.error('DB Connection failed:', err);
    } finally {
        await db.pool.end();
    }
})();
