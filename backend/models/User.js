const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    // NEW: Links the patient to a specific Admin for isolation
    assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isAvailable: { type: Boolean, default: true }, 
    assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emergencyContacts: [{
        name: String,
        phone: String,
        relation: String
    }]
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// FIXED: Removed 'next' to fix "TypeError: next is not a function"
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;