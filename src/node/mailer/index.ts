import { createTransport } from 'nodemailer';

export default class Mailer {
  private user: string;

  private password: string;

  // TODO 暂时不支持邮件服务扩展
  private service: string = 'smtphz.qiye.163.com';

  private smtpTransport: any = null;

  constructor(
    user: string,
    password: string,
  ) {
    this.user = user;
    this.password = password;
    this.init();
  }

  static geInstance(
    user: string,
    password: string,
  ): Mailer {
    return new Mailer(user, password);
  }

  init(): void {
    this.smtpTransport = createTransport(
      `smtps://${encodeURIComponent(this.user)}:${this.password}@${this.service}`
    );
  }

  /**
   * 发邮件
   * @param param0 Object 发送邮件主体
   */
  send({
    subject,
    html,
    to = this.user,
  }: SendMailParam): Promise<any> {
    return this.smtpTransport.sendMail({
      from: this.user,
      to,
      subject,
      html,
    });
  }
}
