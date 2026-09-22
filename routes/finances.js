const express = require('express');
const router = express.Router();
const { db } = require('../db');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, async (req, res) => {
    const { procedure_id, price, type, date, notes, client_name } = req.body;
    try {
        await db.execute({
            sql: 'INSERT INTO finances (procedure_id, price, type, date, notes, client_name) VALUES (?, ?, ?, ?, ?, ?)',
            args: [procedure_id, price, type, date, notes, client_name]
    });
    res.json({ success: true, message: 'Service registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error registering service' });
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await db.execute(`
            SELECT finances.*, procedures.name as procedure_name
            FROM finances
            JOIN procedures ON finances.procedure_id = procedures.id
            ORDER BY date DESC
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error listing services' });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute({
            sql: 'DELETE FROM finances WHERE id= ?',
            args: [id]
        });
        res.json({ success: true, message: 'Service deleted successfully'});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting service' });
    }
});

router.post('/migrate', verifyToken, async (req, res) => {
    try {
        await db.execute(`ALTER TABLE finances ADD COLUMN client_name TEXT`);
        res.json({ success: true, message: 'Migration done' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;