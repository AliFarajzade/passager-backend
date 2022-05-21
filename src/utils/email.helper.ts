import { createTransport } from 'nodemailer'

const sendEmail = async (options: {
    to: string
    subject: string
    text: string
}) => {
    const transport = createTransport({
        host: process.env.EMAIL_HOST as string,
        port: process.env.EMAIL_PORT as unknown as number,
        auth: {
            user: process.env.EMAIL_USERNAME as string,
            pass: process.env.EMAIL_PASSWORD as string,
        },
    })

    const mailOptions = {
        from: 'Ali <ali@email.com>',
        to: options.to,
        subject: options.subject,
        text: options.text,
    }

    await transport.sendMail(mailOptions)
}

export { sendEmail }
