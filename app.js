const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(morgan('dev'));
//BODY PARSER
app.use(express.json({ limit: '20kb' }));

app.use('/api/users', userRouter);

module.exports = app;
