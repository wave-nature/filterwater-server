const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { globalErrorHandler } = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const deliveryRouter = require('./routes/deliveryRoutes');
const queryRouter = require('./routes/queryRoutes');
const contactRouter = require('./routes/contactRoutes');
const AppError = require('./utils/AppError');

const app = express();
app.enable('trust proxy');

app.use(morgan('dev'));
app.use(cors());

//BODY PARSER
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

app.use('/api/users', userRouter);
app.use('/api/deliveries', deliveryRouter);
app.use('/api/queries', queryRouter);
app.use('/api/contacts', contactRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`This url ${req.url} does not exist`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
