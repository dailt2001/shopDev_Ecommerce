import nodemailer from 'nodemailer'

export const transport = nodemailer.createTransport({
    host: 'email-smtp.ap-southeast-1.amazonaws.com',
    port: 465,
    secure: true,
    auth: {
        user: 'AKIA2WY7RI2JIJS3UMNY',
        pass: 'BMgkQqr2ZyO8VK0w/p4VQRAQ53kL+FNrS/Ug6YxypFxj',
    }
})