// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import logger from 'morgan';

// import bodyParser from 'body-parser';
// import cors from 'cors'; //For cross domain error

// import cookieParser from 'cookie-parser';

// //db connections
// import sequelize from './config/sequelize';

// /* MAIN ROUTES */
// import router from './routes/main.route';

// // Load environment variables from .env file
// dotenv.config();

// // Initialize Express application
// const app = express();

// // Middleware
// app.use(cors());
// // app.use(
// //   cors({
// //     origin: ["http://localhost:5173","http://localhost:5174" , "http://localhost:3000"], // ✅ your frontend URL
// //     credentials: true,               // ✅ allow cookies to be sent
// //   })
// // );
// app.use(cookieParser()); // Parse cookies
// app.use(express.json()); // Parse JSON request bodies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// app.use(express.json());
// app.use(logger('dev'));

// app.use(
//   bodyParser.urlencoded({
//     extended: false,
//   }),
// );
// app.use(bodyParser.json());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(logger('combined')); // Just uncomment this line to show logs.



// function haltOnTimedout(req: any, res: any, next: any) {
//   if (!req.timedout) next();
// }

// /* MAIN ROUTES FOR APP */
// app.use('/api/v1', router);

// const PORT = process.env.PORT || 3000;

// // Import your models with associations
// import models from './models/index';
// import { initLanguage } from './constants/language';

// app.listen(PORT, async () => {
//   try {
//     await models.sequelize.authenticate();
//     console.log('✅ Database connection has been established successfully.');

//     // Sync all models and associations
//     await models.sequelize.sync({ alter: true });
//     console.log('✅ Database synced successfully.');

//         // ✅ Load language from global config table
//     await initLanguage();

//   } catch (error) {
//     console.error('❌ Unable to connect to the database or sync:', error);
//   }

//   console.log(`🚀 App is listening on port ${PORT} for demo Node server`);
// });


import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// DB connection
import sequelize from './config/sequelize';
import models from './models/index';
import { initLanguage } from './constants/language';

/* MAIN ROUTES */
import router from './routes/main.route';
import { handleStripeWebhook } from './controllers/webhook.controller';

// Initialize Express app
const app = express();

app.post(
  '/stripe/webhook', 
  // '/api/v1/payment/stripe/webhook', 
  bodyParser.raw({ type: 'application/json' }), // Required for Stripe signature verification
  handleStripeWebhook
);

// ✅ Proper CORS setup (must be before any routes or cookies)
app.use(
  cors({
    origin: ['http://localhost:5173'], // Add more origins as needed
    credentials: true,
  })
);
// ✅ Core Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ Logging
app.use(logger('dev'));

// ✅ Main API Routes
app.use('/api/v1', router);


// ✅ Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await models.sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');

    await models.sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully.');

    await initLanguage(); // Load language config
    console.log('✅ Global language configuration loaded.');
  } catch (error) {
    console.error('❌ Unable to connect to the database or sync:', error);
  }

  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
