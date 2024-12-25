const db = require('../models/signup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

const login = async (email, password) => {
    try{
        const user = await db.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found');
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
        throw new Error('Password is incorrect');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    return token;
    }catch(err){
        throw new Error('Signup problem');
    }
    
};

const signup = async (name, email, password) => {
    const saltrounds = 10;
    
    const hashedPassword = await bcrypt.hash(password, saltrounds);
    
    try {
        await db.create({
            name: name,
            email: email,
            password: hashedPassword,
        });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            throw new Error('Email already exists');
        }
        throw new Error('Internal server error');
    }
};

module.exports = { login, signup };
