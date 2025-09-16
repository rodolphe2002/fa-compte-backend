import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    soldeCompte: { type: Number, required: true, default: 0 },
    deviseCompte: { type: String, required: true, default: 'EUR' },
    soldeElec: { type: Number, required: true, default: 0 },
    fraisDeblocage: { type: Number, required: true, default: 0 },
    loginId: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
