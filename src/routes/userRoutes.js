const express = require('express');
const router = express.Router(); 
const User = require('../models/userModel'); 
const jwt = require('jsonwebtoken'); 

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '1h', 
  });
};

router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
  }

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Nome de usuário já existe.' });
    }

    const user = await User.create({
      username,
      password, 
      role: role || 'user' 
    });

    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id, user.role), 
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário.', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        message: 'Login bem-sucedido!',
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id, user.role), 
      });
    } else {
      res.status(401).json({ message: 'Nome de usuário ou senha inválidos.' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Erro ao tentar fazer login.', error: error.message });
  }
});

module.exports = router;