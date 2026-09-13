const express = require ('express');
const router = express.Router ();
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const { db } = require ('../db');

router.post ('/register', async (req, res) => {
    const { username , password } =  req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute({
            sql: 'INSERT INTO users (username, password) VALUES (?, ?)',
            args: [username, hashedPassword]
        });
        res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error registering user' });
    }
});

router.post ('/login', async (req, res) => {
    const { username , password } = req.body;
    try {
        const result = await db.execute({
            sql: 'SELECT * FROM users WHERE username = ?',
            args: [username]
        });
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn:'7d' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ success: true, message: 'Login successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logout successfully' });
});

module.exports = router;