// import express, { Express } from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectDB from './config/db';
// import formRoutes from './routes/forms';

// dotenv.config();

// const app: Express = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/forms', formRoutes);

// // Connect to MongoDB
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// });



import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import formRoutes from './routes/forms';
import responseRoutes from './routes/response';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/response', responseRoutes);

// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});