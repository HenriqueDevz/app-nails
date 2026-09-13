const express = require('express');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();
const { initDB } = require('./db');

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public' )));

const authRoutes = require('./routes/auth');
const financesRoutes = require('./routes/finances');
const storageRoutes = require('./routes/storage');

app.use('/api/auth', authRoutes);
app.use('/api/finances', financesRoutes);
app.use('/api/storage', storageRoutes);

app.get('/', (req, res ) => {
  res.sendFile(path.join(__dirname,'public', 'login.html'));
});

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await initDB();
        console.log("Database connect and ready");
        app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Acesse a http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error or connect a database", err);
    process.exit(1);
  }
}

start();