const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');

//GLOBALLY HANDLING UNCAUGHT ERROR
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT REJECTION 💥 Shutting Down...');
  console.log(err.name, err.message, err);
  process.exit(1);
});

const DB_URI = process.env.DB_URI.replace(
  '<password>',
  process.env.DB_PASSWORD
);
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected successfully'));

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log('app is running on port ' + PORT);
});

//GLOBALLY HANDLING REJECTED PROMISE ERROR
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION 💥 Shutting Down...');
  console.log(err.name, err.message);

  //Shutting down server and then exit the process gracefully
  server.close(() => {
    process.exit(1); //0:success ; 1:fail
  });
});
