const express = require('express');
const app = express();
require('dotenv').config();
const schoolRoutes = require('./routes/school.routes');
const serverless = require('serverless-http');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', schoolRoutes);

exports.handler = serverless(app);

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });