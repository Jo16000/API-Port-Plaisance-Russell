const mongoose = require('mongoose');
// ÉTAPE 2 : On utilise bcryptjs à la place de bcrypt pour éviter le crash sur Render
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Le nom d'utilisateur est obligatoire"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "L'adresse email est obligatoire"],
        unique: true, // Règle d'unicité demandée par le brief
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est obligatoire"],
        minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"] // Contrôle de longueur minimale
    }
}, { timestamps: true });

// Middleware Mongoose pour hacher le mot de passe automatiquement avant la sauvegarde
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode pour comparer les mots de passe lors de la connexion
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);