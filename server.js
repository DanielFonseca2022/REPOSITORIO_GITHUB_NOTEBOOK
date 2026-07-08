const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÃO DO BANCO DE DADOS ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       // Altere para seu usuário do MySQL
    password: 'sua_senha', // Altere para sua senha do MySQL
    database: 'loja_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao MySQL!');
});

// --- CONFIGURAÇÃO DO UPLOAD DE IMAGEM (Multer) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        // Nome único para o arquivo: timestamp + nome original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- ROTA DE CADASTRO ---
app.post('/api/products', upload.single('image'), (req, res) => {
    const { name, category, sku, price, stock, description } = req.body;
    
    // Pega o caminho da imagem salva pelo multer
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `INSERT INTO products (name, category, sku, price, stock, description, image_url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [name, category, sku, price, stock, description, imagePath];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao salvar no banco:', err);
            return res.status(500).json({ error: 'Erro ao cadastrar produto' });
        }
        res.status(201).json({ 
            message: 'Produto cadastrado com sucesso!', 
            productId: result.insertId 
        });
    });
});

// Servir arquivos estáticos (para exibir as imagens depois)
app.use('/uploads', express.static('uploads'));

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});