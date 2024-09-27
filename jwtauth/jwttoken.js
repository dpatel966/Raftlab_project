const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

class JWT {
  generateAccessToken(userId) {
    return jwt.sign({ userId }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
  }

  authenticateToken(req) {
    return new Promise((resolve, reject) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (token==null) {
        return resolve({ status: false, msg: "Token Missing!" });
      }

      jwt.verify(token, process.env.TOKEN_SECRET, (err, tokenData) => {
        if (err) {
          return resolve({ status: false, msg: "Invalid Token!" });
        }

        req.userId = tokenData.userId;
        resolve({ status: true, code: 200, user: req.userId });
      });
    });
  }
}

module.exports = new JWT();
