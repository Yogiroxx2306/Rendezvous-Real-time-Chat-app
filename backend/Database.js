const mongoose = require('mongoose');
function DbConnect() {
    const DB_URL = process.env.DB_URL;
    mongoose.connect(DB_URL, { useNewUrlParser: true })
    const db = mongoose.connection
    db.once('open', _ => {
        console.log('Database connected:', DB_URL)
    })

    db.on('error', err => {
        console.error('connection error:', err)
    })
}

module.exports = DbConnect;