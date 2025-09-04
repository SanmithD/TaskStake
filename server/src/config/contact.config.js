import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "sanmithdevadiga91@gmail.com",
        pass: process.env.NODEMAILER_PASS
    }
});