const jwt = require('jsonwebtoken');
const secretKey = '947089n*(&#)$(*#RHFJDvmbksduj'
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized!',
      });
  }
  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, secretKey);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
        status: 'fail',
        message: 'Unauthorized!',
      });
  }
};