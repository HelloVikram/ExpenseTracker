const passwordService = require('../services/passwordServices');

const fogotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        await passwordService.fogotpassword(email);
        res.status(200).json({ success: true, message: 'Password reset email sent successfully.' });
    } catch (error) {
        console.error('Error in fogotpassword function:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const resetpassword = async (req, res) => {
    try {
        const { id } = req.params;
        await passwordService.resetpassword(id);
        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Reset Password</title>
            </head>
            <body>
                <form action="/password/updatepassword/${id}" method="get">
                    <label for="newpassword">Enter New Password:</label>
                    <input type="password" id="newpassword" name="newpassword" required />
                    <button type="submit">Reset Password</button>
                </form>
            </body>
            </html>
        `);
    } catch (err) {
        console.log('Error in resetting password', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const updatepassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newpassword } = req.query;

        const message = await passwordService.updatepassword(id, newpassword);
        res.status(201).json({ success: true, message });
    } catch (err) {
        console.log('Error in updating password', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { fogotpassword, resetpassword, updatepassword };
