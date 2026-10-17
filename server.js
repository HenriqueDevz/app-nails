const express = require('express');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();
const { initDB } = require('./db');
const cors = require('cors')

app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://app-nails.onrender.com'
    : 'http://localhost:5173',
  credentials: true
}))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')))
  
  app.get('/{splat}', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'))
  })
} else {
  app.use(express.static(path.join(__dirname, 'public' )))

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
  })
}

const authRoutes = require('./routes/auth');
const financesRoutes = require('./routes/finances');
const storageRoutes = require('./routes/storage');

app.use('/api/auth', authRoutes);
app.use('/api/finances', financesRoutes);
app.use('/api/storage', storageRoutes);

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