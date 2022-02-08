const jwt = require('jsonwebtoken');

module.exports = {
  isLoggedIn: (req, res, next) => {
    try {
      const userDetails = jwt.verify(
        req.headers.authorization.split(' ')[1],
        'rokas123',
      );
      req.headers.userDetails = userDetails;
      return next();
    } catch (e) {
      return res.status(401).send({ err: 'Incorect details' });
    }
  },
};
