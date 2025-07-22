const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware de Autenticação
const protect = async (req, res, next) => {
  let token;

  // 1. Verificar se o token existe no header de Autorização
  // O formato esperado é: Authorization: Bearer TOKEN
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obter o token do header (ignorar "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // Verificar o token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Encontrar o usuário pelo ID contido no token
      // e anexar o usuário (sem a senha) ao objeto de requisição (req.user)
      req.user = await User.findById(decoded.id).select('-password');

      // Se tudo deu certo, prosseguir para a próxima função middleware/rota
      next();
    } catch (error) {
      // Se o token for inválido, expirado ou houver qualquer erro na verificação
      console.error('Erro de autenticação:', error.message);
      return res.status(401).json({ message: 'Não autorizado, token falhou.' });
    }
  }

  // Se nenhum token for encontrado no header
  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, nenhum token.' });
  }
};

// Middleware de Autorização (para verificar a role do usuário)
const authorizeRoles = (...roles) => { // ...roles permite passar múltiplos roles (ex: 'admin', 'moderator')
  return (req, res, next) => {
    // Verificar se req.user (do middleware protect) existe e tem a role necessária
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Acesso negado. Usuário com role '${req.user ? req.user.role : 'desconhecida'}' não tem permissão para esta ação.`
      });
    }
    next(); // Se tiver a role, prosseguir
  };
};

module.exports = { protect, authorizeRoles };