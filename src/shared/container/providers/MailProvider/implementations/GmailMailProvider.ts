import { IMailProvider } from "../IMailProvider";
import nodemailer, { Transporter } from 'nodemailer'
import handlebars from "handlebars";
import fs from 'fs'

class GmailMailProvider implements IMailProvider{
  private client: Transporter

  constructor(){
    this.client = nodemailer.createTransport({
      host: process.env.GMAIL_HOST,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
      service: process.env.MAIL_SERVICE,
      port: Number(process.env.GMAIL_PORT)
    })
  }
  
  async sendMail(to: string, subject: string, variables: any, path: string): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString("utf-8")

    const templateParse = handlebars.compile(templateFileContent)

    const templateHTML = templateParse(variables)

    await this.client.sendMail({
      to,
      from: "Rentx <noreply@rentx.com.br>",
      subject,
      html: templateHTML
    })
  }

}

export { GmailMailProvider }