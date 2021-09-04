import IMailProvider from '../IMailProvider';

import nodemailer, { Transporter } from 'nodemailer';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/providers/MailTemplateProvider/IMailTemplateProvider';
import { inject, injectable } from 'tsyringe';

@injectable()
class EtherealMailProvider implements IMailProvider {
    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider,
    ) {
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

    public async sendMail(data: ISendMailDTO): Promise<void> {
        const message = await this.client.sendMail({
            from: {
                name: data.from?.name || 'Equipe Tradelous',
                address: data.from?.email || 'equipe@tradelous.com.br',
            },
            to: {
                name: data.to.name,
                address: data.to.email,
            },
            subject: data.subject,
            html: await this.mailTemplateProvider.parseTemplate(
                data.templateData,
            ),
        });

        console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}

export default EtherealMailProvider;
