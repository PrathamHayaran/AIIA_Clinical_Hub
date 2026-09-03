const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'aiia_clinical_trial_hub_jwt_super_secret_key_2025_prod_grade';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  signToken,
  verifyToken,
};
