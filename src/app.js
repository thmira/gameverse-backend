// Import dos Módulos
require('dotenv').config(); // Chamada das variáveis de ambiente do arquivo .env
const express = require('express');
const mongoose = require('mongoose');

// Chamada do Express
const app = express();
const PORT = process.env.PORT || 3000; 

// Middlewares 
app.use(express.json()); // Habilita o Express a entender JSON no corpo das requisições

// Conexão com MongoDB
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

// Rota de Teste
app.get('/', (req, res) => {
  res.send('Bem-vindo à API GameVerse!');
});
