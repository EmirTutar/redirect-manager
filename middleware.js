
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
  
    // Überprüfen Sie hier den Token (zum Beispiel mit einem vordefinierten Token)
    if (token === 'IhrBearerToken') {
      next(); // Fortsetzen mit der nächsten Middleware oder Route
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
  
  module.exports = authenticate;
  