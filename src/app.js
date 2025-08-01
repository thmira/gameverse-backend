// 1. Importar Módulos
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <-- Adicione esta linha
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

// 2. Inicializar o Express
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Middlewares Essenciais
app.use(cors()); // <-- Adicione esta linha para habilitar CORS
app.use(express.json());

// 4. Conexão com o Banco de Dados MongoDB
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('🚀 Conectado ao MongoDB!');
    app.listen(PORT, () => {
      console.log(`✨ Servidor GameVerse rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro de conexão com o MongoDB:', error.message);
    process.exit(1);
  });

// 5. Rota de Teste
app.get('/', (req, res) => {
  res.send('Bem-vindo à API GameVerse!');
});

// 6. Usar Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);