const express = require('express');
const connetDb = require('./config/db');
const app = express();

//connect database
connetDb();

//Init Middleware( in order to work request.body in routes/api/users, we have to initialize the middleware for the body parser)
app.use(express.json({extended : false}));

app.get('/', (req,res)=> res.send('API Running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=> console.log(`Server started on port ${PORT}`));