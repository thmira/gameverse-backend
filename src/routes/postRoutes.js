const express = require('express');
const router = express.Router();
const Post = require('../models/postModel'); 
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Rota para CRIAR uma nova postagem
// POST /api/posts
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
  const { title, content, category, tags, imageUrl } = req.body;
  const author = req.user._id; 

  // Validação básica
  if (!title || !content || !category) {
    return res.status(400).json({ message: 'Título, conteúdo e categoria são obrigatórios.' });
  }

  try {
    const post = await Post.create({
      title,
      content,
      author,
      category,
      tags: tags || [], // Garante que tags seja um array, mesmo se não for fornecido
      imageUrl: imageUrl || '' // Garante que imageUrl seja uma string vazia se não for fornecido
    });

    // Popula o campo 'author' para retornar o username (opcional, mas útil)
    const populatedPost = await Post.findById(post._id).populate('author', 'username');

    res.status(201).json({
      message: 'Postagem criada com sucesso!',
      post: populatedPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar postagem.', error: error.message });
  }
});

// Rota para LISTAR TODAS as postagens
// GET /api/posts
// Qualquer um pode ler posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('author', 'username') // Popula o campo 'author' com o username do User
      .sort({ createdAt: -1 }); // Ordena do mais novo para o mais antigo

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar postagens.', error: error.message });
  }
});

// Rota para OBTER UMA postagem por ID
// GET /api/posts/:id
// Qualquer um pode ler um post específico
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Postagem não encontrada.' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar postagem.', error: error.message });
  }
});

// Rota para ATUALIZAR uma postagem
// PUT /api/posts/:id
// Apenas admins podem atualizar posts
router.put('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  const { title, content, category, tags, imageUrl } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Postagem não encontrada.' });
    }

    // Atualiza os campos do post
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.imageUrl = imageUrl || post.imageUrl;
    post.updatedAt = Date.now(); // Atualiza a data de modificação

    const updatedPost = await post.save();

    // Popula o campo 'author' para retornar o username (opcional, mas útil)
    const populatedUpdatedPost = await Post.findById(updatedPost._id).populate('author', 'username');


    res.status(200).json({
      message: 'Postagem atualizada com sucesso!',
      post: populatedUpdatedPost
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar postagem.', error: error.message });
  }
});

// Rota para EXCLUIR uma postagem
// DELETE /api/posts/:id
// Apenas admins podem excluir posts
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Postagem não encontrada.' });
    }

    await post.deleteOne(); 

    res.status(200).json({ message: 'Postagem excluída com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir postagem.', error: error.message });
  }
});

module.exports = router;