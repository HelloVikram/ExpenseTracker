const SibApiV3Sdk = require('sib-api-v3-sdk');
const  User  = require('../models/signup');
const ForgetPassword = require('../models/forgetpassword');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const fogotpassword = async (email) => {
    if (!email) {
        throw new Error('Email is required');
    }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        throw new Error('User not found');
    }

    const id = uuid.v4();
    await ForgetPassword.create({
        userId: user.id,
        id: id,
        isactive: true
    });

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sender = { email: 'vikram.kumar.cs.2024@gmail.com', name: 'Vikram Kumar' };
    const receivers = [{ email: email }];

    const sendSmtpEmail = {
        sender,
        to: receivers,
        subject: 'Recover Your Password',
        htmlContent: `
            <p>Hello,</p>
            <p>We received a request to reset your password.</p>
            <a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>
            <p>If you did not request this, please ignore this email.</p>
        `,
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    return response;
};

const resetpassword = async (id) => {
    const reset = await ForgetPassword.findOne({ where: { id, isactive: true } });
    if (!reset) {
        throw new Error('Invalid or expired reset link');
    }

    return reset;
};

const updatepassword = async (id, newpassword) => {
    const resetpassword = await ForgetPassword.findOne({ where: { id } });
    if (!resetpassword || !resetpassword.isactive) {
        throw new Error('Cannot update password. Reset link is invalid');
    }

    const saltround = 10;
    const hash = await bcrypt.hash(newpassword, saltround);

    await User.update({ password: hash }, { where: { id: resetpassword.userId } });
    await ForgetPassword.update({ isactive: false }, { where: { id } });

    return 'Password changed successfully';
};

module.exports = { fogotpassword, resetpassword, updatepassword };
