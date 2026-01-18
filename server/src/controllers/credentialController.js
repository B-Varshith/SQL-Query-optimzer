const { pool } = require('../../db');
const { encrypt, decrypt } = require('../utils/encryption');

const addCredential = async (req, res) => {
    const { connection_name, host, port, db_name, username, password } = req.body;
    const userId = req.user.id;

    if (!connection_name || !host || !port || !db_name || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const { iv, encryptedData } = encrypt(password);

        const newCredential = await pool.query(
            `INSERT INTO db_credentials 
       (user_id, connection_name, host, port, db_name, username, password_encrypted, iv) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, connection_name, host, port, db_name, username, created_at`,
            [userId, connection_name, host, port, db_name, username, encryptedData, iv]
        );

        res.status(201).json(newCredential.rows[0]);
    } catch (err) {
        console.error('Add credential error:', err);
        res.status(500).json({ error: 'Server error adding credential' });
    }
};

const getCredentials = async (req, res) => {
    const userId = req.user.id;

    try {
        const credentials = await pool.query(
            'SELECT id, connection_name, host, port, db_name, username, created_at FROM db_credentials WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(credentials.rows);
    } catch (err) {
        console.error('Get credentials error:', err);
        res.status(500).json({ error: 'Server error fetching credentials' });
    }
};

const deleteCredential = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await pool.query('DELETE FROM db_credentials WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Credential not found or unauthorized' });
        }

        res.json({ message: 'Credential deleted successfully' });
    } catch (err) {
        console.error('Delete credential error:', err);
        res.status(500).json({ error: 'Server error deleting credential' });
    }
};

module.exports = { addCredential, getCredentials, deleteCredential };
