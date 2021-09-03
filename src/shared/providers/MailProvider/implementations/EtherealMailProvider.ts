import IMailProvider from '../IMailProvider';

import nodemailer, { Transporter } from 'nodemailer';
import IMailProviderDTO from '../dtos/IMailProviderDTO';

class EtherealMailProvider implements IMailProvider {
    private client: Transporter;

    constructor() {
        nodemailer.createTestAccount().then(account => {
            this.client = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });
        });
    }

    public async sendMail(data: IMailProviderDTO): Promise<void> {
        const message = await this.client.sendMail({
            from: data.from
                ? `${data.from.name} <${data.from.email}>`
                : 'Equipe Tradelous <equipe@tradelous.com.br>',
            to: data.to.email,
            subject: data.subject,
            text: data.text,
        });

        console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}

export default EtherealMailProvider;
