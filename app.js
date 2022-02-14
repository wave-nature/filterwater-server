const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { globalErrorHandler } = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/AppError');

const app = express();

app.use(morgan('dev'));
//BODY PARSER
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

app.use('/api/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`This url ${req.url} does not exist`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
