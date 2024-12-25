const authService = require('../services/userServices');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await authService.login(email, password);
        res.status(200).json({ success: true, message: 'User login successful', token });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        await authService.signup(name, email, password);
        res.status(200).json({ success: true, message: 'User signed up successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { login, signup };
