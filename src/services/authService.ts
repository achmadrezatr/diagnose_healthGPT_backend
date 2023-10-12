import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';
import { ISendEmailOptions } from '../models/userModel.js';

export const requestPasswordReset = async (email: string): Promise<{link: string}> => {
    const user = await User.findOneAndUpdate(
        { email },
        {
            token: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10),
        },
        {
            new: true,
        }
    );

    if (!user) throw new Error("Email does not exist");

    const link = `${process.env.CLIENT_URL}/passwordReset?token=${user.token}&id=${user._id}`;

    console.log(`token==> ${user.token}`)
    console.log(`id==> ${user._id}`)

    await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            payload: { 
                link:link,
                token: user.token,
                id: user._id 
            },
            template: "./template/requestResetPassword.handlebars"
    }as ISendEmailOptions);
    return {
        link
    };
};

export const resetPassword = async (userId: string, token: string, password: string): Promise<boolean> => {
    const passwordResetToken = await User.findOne({ _id: userId });

    if (!passwordResetToken) {
        throw new Error("Invalid or expired password reset token");
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    console.log(`token==> ${token}`)
    console.log(`passwordResetToken.token==> ${passwordResetToken.token}`)
        
    if (!isValid) {
        throw new Error("Invalid or expired password reset token");
    }

    const bcryptSalt = process.env.BCRYPT_SALT ?? "";
    const hash = await bcrypt.hash(password, Number(bcryptSalt));

    await User.findOneAndUpdate(
        { _id: passwordResetToken._id },
        { $set: { password: hash } },
        { new: true}
    );

    return true;
};
