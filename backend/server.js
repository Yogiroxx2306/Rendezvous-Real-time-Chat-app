require('dotenv').config();
const express = require('express');
const router = require('./routes');
const DbConnect = require('./Database')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();  
app.use(cookieParser());
app.use(express.json({limit: '8mb'}));    
app.use('/storage',express.static('storage'));
app.get('/',(req,res)=>{
    res.send('Hello from Express js');
});
const corsOption = {
    credentials: true,
    origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));
app.use(router);
const PORT = process.env.PORT || 5500;
DbConnect();
app.listen(PORT,()=>console.log(`Listening on PORT ${PORT}`));