import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

    // Propiedades
    private transporter;

    // Constructor
    constructor(){
        this.transporter = nodemailer.createTransport({
            // Tipo de servicio 
            service: 'Gmail',
            auth: {
                // Credenciales del correo electrónico 
                user: '',
                pass: ''
            }
        });
    }

    // Enviamos el correo electrónico correspondiente 
    async sendMail(to: string, subject: string, htmlContent: string): Promise<any>{
        const mailOptions = {
            from: '',
            to,
            subject,
            html: htmlContent
        };
        return await this.transporter.sendMail(mailOptions);
    }
}
