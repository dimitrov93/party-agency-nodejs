const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

exports.dbInit = () => {
    mongoose.connect(process.env.DB_QUERY_STRING);
    
    return mongoose.connection.on('open', () => console.log('DB is connected!'));
}