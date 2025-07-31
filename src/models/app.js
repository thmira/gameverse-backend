require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); 
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(express.json());

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

app.get('/', (req, res) => {
  res.send('Bem-vindo à API GameVerse!');
});

app.use('/api/users', userRoutes); 
app.use('/api/posts', postRoutes);