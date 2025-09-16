import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = Router();

router.post(
  '/register',
  [
    body('nom').isString().trim().notEmpty(),
    body('prenom').isString().trim().notEmpty(),
    body('soldeCompte').isFloat({ min: 0 }).toFloat(),
    body('deviseCompte').isString().trim().isLength({ min: 1 }),
    body('soldeElec').isFloat({ min: 0 }).toFloat(),
    body('fraisDeblocage').isFloat({ min: 0 }).toFloat(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { nom, prenom, soldeCompte, deviseCompte, soldeElec, fraisDeblocage } = req.body;

      // Helper to generate an 8-digit numeric ID
      const genLoginId = () => String(Math.floor(10000000 + Math.random() * 90000000));
      // Helper to generate a 6-digit numeric password
      const genPassword = () => String(Math.floor(100000 + Math.random() * 900000));

      // Ensure unique loginId
      let loginId;
      for (let i = 0; i < 5; i++) {
        const candidate = genLoginId();
        const exists = await User.findOne({ loginId: candidate }).lean();
        if (!exists) { loginId = candidate; break; }
      }
      if (!loginId) {
        return res.status(500).json({ message: 'Impossible de générer un identifiant unique, veuillez réessayer.' });
      }

      const rawPassword = genPassword();
      const passwordHash = await bcrypt.hash(rawPassword, 10);

      const user = await User.create({
        nom,
        prenom,
        soldeCompte,
        deviseCompte,
        soldeElec,
        fraisDeblocage,
        loginId,
        passwordHash,
      });

      const base = process.env.FRONTEND_URL || 'http://localhost:3000';
      const loginUrl = `${base}/`;
      return res.status(201).json({
        user,
        loginId,
        password: rawPassword,
        loginUrl,
      });
    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
 
// Login with generated credentials
router.post(
  '/login',
  [
    body('loginId').isString().trim().notEmpty(),
    body('password').isString().trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { loginId, password } = req.body;
    try {
      const user = await User.findOne({ loginId });
      if (!user) return res.status(401).json({ message: 'Identifiants invalides' });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(401).json({ message: 'Identifiants invalides' });

      return res.json({
        message: 'Connexion réussie',
        user: {
          id: user._id,
          loginId: user.loginId,
          nom: user.nom,
          prenom: user.prenom,
          soldeCompte: user.soldeCompte,
          deviseCompte: user.deviseCompte,
          soldeElec: user.soldeElec,
          fraisDeblocage: user.fraisDeblocage,
        },
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);
