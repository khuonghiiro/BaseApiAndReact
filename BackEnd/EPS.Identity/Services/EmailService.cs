using Azure.Core;
using MailKit.Net.Smtp;
using MimeKit;

namespace EPS.Identity.Services
{
    public class EmailService
    {
        private IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            // Cấu hình SMTP
            var _smtpServer = _configuration["Smtp:Server"];
            var _smtpPort = int.Parse(_configuration["Smtp:Port"]);
            var _smtpUser = _configuration["Smtp:User"];
            var _smtpPass = _configuration["Smtp:Pass"];
            var _smtpName = _configuration["Smtp:Name"];

            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_smtpName, _smtpUser));
            emailMessage.To.Add(new MailboxAddress("", toEmail));
            emailMessage.Subject = subject;
            //emailMessage.Body = new TextPart("plain") { Text = message };

            var bodyBuilder = new BodyBuilder
            {
                TextBody = "This is the plain text version of the message.",
                HtmlBody = htmlMessage
            };

            emailMessage.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                client.CheckCertificateRevocation = false;
                await client.ConnectAsync(_smtpServer, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_smtpUser, _smtpPass);
                await client.SendAsync(emailMessage);
                await client.DisconnectAsync(true);
            }
        }
    }
}
