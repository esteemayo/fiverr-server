/* eslint-disable */
import app from './app.js';
import connectDB from './config/db.js';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🔥 Shutting down...'.red.bold);
  console.log(err.name, err.message);
  process.exit(1);
});

app.set('port', process.env.PORT || 8800);

const server = app.listen(app.get('port'), async () => {
  await connectDB();
  console.log(`App listening on port → ${server.address().port}`.rainbow.bold);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 🔥 Shutting down...'.red.bold);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
