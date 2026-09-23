const express = require ('express');
const router = express.Router();
const { db } = require ('../db');
const verifyToken = require ('../middleware/auth');

// PROCEDURES - PROCEDIMENTOS ----->
router.post('/procedures', verifyToken, async (req, res) => {
    const { name } = req.body;
    try {
        await db.execute({
            sql: 'INSERT INTO procedures (name) VALUES (?)',
            args: [name]
        });
        res.json({ success: true, message: 'Procedure added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding procedure' });
    }
});

router.get('/procedures', verifyToken, async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM procedures');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error listing procedures' });
    }
});

router.delete('/procedures/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute({
            sql: 'DELETE FROM procedures WHERE id = ?',
            args: [id]
        });
        res.json({ success: true, message: 'Procedure deleted successfully' });
    } catch (error) {
            res.status(500).json ({ success: false, message: 'Error deleting procedure' });
    }
});

// PRODUCTS - PRODUTOS ----->
router.post('/products', verifyToken, async (req, res) => {
    const { name, quantity , min_quantity , unit , capacity } = req.body;
    try {
        await db.execute({
            sql: 'INSERT INTO products (name , quantity, min_quantity, unit, capacity) VALUES (?, ?, ?, ?, ?)',
            args: [name, quantity, min_quantity, unit, capacity]
        });
        res.json({ success: true, message: 'Product added successfully' });
    } catch (error) {
        console.error('Erro ao Adicionar Produto:', error);
        res.status(500).json({ success: false, message: 'Error adding product' });
    }
});

router.get('/products', verifyToken, async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM products');
        res.json({success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error listing products' });
    }
});

router.delete('/products/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute({
            sql: 'DELETE FROM procedure_products WHERE product_id = ?',
            args:[id]
        });
        await db.execute({
            sql: 'DELETE FROM products WHERE id =?',
            args: [id]
        });
        
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch(error){
        res.status(500).json({ success: false, message: 'Error deleting product' });
    }
});

// - PROCEDURE PRODUCTS - RECEITAS ----->
router.post('/procedure-products', verifyToken, async (req, res) => {
    const { procedure_id, product_id } = req.body;
    try {
        await db.execute({
            sql:'INSERT INTO procedure_products (procedure_id, product_id) VALUES (?,?)',
            args: [procedure_id, product_id]
        });
        res.json({ success: true, message: 'Product added to procedure successfully' });
    } catch(error) {
        res.status(500).json({success: false, message: 'Error adding product to procedure' });
    }
});

router.get('/procedure-products/:procedure_id', verifyToken, async (req, res) => {
    const { procedure_id } = req.params;
    try {
        const result = await db.execute({
            sql:`SELECT procedure_products.*, products.name, products.quantity, products.unit
                FROM procedure_products
                JOIN products ON procedure_products.product_id = products.id
                WHERE procedure_products.procedure_id = ?`,
            args: [procedure_id]
        });
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error listing procedure products' });
    }
});

router.delete('/procedure-products/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute({
            sql: 'DELETE FROM procedure_products WHERE id = ?',
            args: [id] 
        });
        res.json({ success: true, message: 'Product removed from procedure successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing product from procedure' });
    }
});

router.post('/migrate', verifyToken, async (req, res) => {
    try {
        await db.execute(`ALTER TABLE products ADD COLUMN capacity TEXT`)
        res.json({ success: true, message: 'Migration done' });
    } catch(error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router