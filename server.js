const express = require('express');
const dotenv = require('dotenv').config();
const admin = require('firebase-admin');
const { errorHandler }  = require('./middleware/errorMiddleware')

const app = express();
const PORT = process.env.PORT || 7000;

admin.initializeApp({
    credential : admin.credential.cert('./pedulipasal01-ServAcc.json'),
});

const db = admin.firestore();

app.use(express.json());
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/chats', require('./routes/chatRoutes'));
app.use(errorHandler);

app.listen(PORT , () => {
    console.log(`Server listening on port ${PORT}`);
});