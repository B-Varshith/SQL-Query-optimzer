require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_prod',
    jwtExpiresIn: '24h',
};
