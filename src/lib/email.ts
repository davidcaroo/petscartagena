import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

// Configuración del transportador de email con OAuth2
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
});

// Alternativa con SMTP personalizado
// const transporter = nodemailer.createTransporter({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT || '587'),
//   secure: false, // true para 465, false para otros puertos
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"PetsCartagena" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email enviado exitosamente a ${options.to}`);
    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
}

export function generateVerificationToken(userId: string): string {
  return jwt.sign(
    { 
      userId,
      type: 'email_verification',
      timestamp: Date.now()
    },
    JWT_SECRET,
    { expiresIn: '24h' } // Token válido por 24 horas
  );
}

export function verifyEmailToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.type !== 'email_verification') {
      return null;
    }
    
    return { userId: decoded.userId };
  } catch (error) {
    console.error('Error verificando token de email:', error);
    return null;
  }
}

export function generateVerificationEmailHTML(userName: string, verificationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verifica tu cuenta - PetsCartagena</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .container {
          background-color: white;
          border-radius: 10px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          width: 80px;
          height: 80px;
          background-color: #f97316;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          font-size: 30px;
        }
        h1 {
          color: #1f2937;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #6b7280;
          font-size: 18px;
        }
        .button {
          display: inline-block;
          background-color: #f97316;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
          transition: background-color 0.3s;
        }
        .button:hover {
          background-color: #ea580c;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .warning {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          color: #92400e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🐾</div>
          <h1>¡Bienvenido a PetsCartagena!</h1>
          <p class="subtitle">Por favor verifica tu dirección de email</p>
        </div>
        
        <p>Hola <strong>${userName}</strong>,</p>
        
        <p>¡Gracias por registrarte en PetsCartagena! Para completar tu registro y comenzar a conectar con mascotas que necesitan un hogar, necesitamos verificar tu dirección de email.</p>
        
        <div style="text-align: center;">
          <a href="${verificationUrl}" class="button">Verificar mi cuenta</a>
        </div>
        
        <div class="warning">
          <strong>⏰ Importante:</strong> Este enlace de verificación expirará en 24 horas por motivos de seguridad.
        </div>
        
        <p>Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:</p>
        <p style="word-break: break-all; color: #3b82f6;"><a href="${verificationUrl}">${verificationUrl}</a></p>
        
        <p>Una vez verificada tu cuenta, podrás:</p>
        <ul>
          <li>🏠 Explorar mascotas disponibles para adopción</li>
          <li>💬 Chatear con dueños de mascotas</li>
          <li>❤️ Marcar tus mascotas favoritas</li>
          <li>📝 Solicitar adopciones</li>
        </ul>
        
        <p>Si no creaste una cuenta en PetsCartagena, puedes ignorar este email.</p>
        
        <div class="footer">
          <p><strong>PetsCartagena</strong><br>
          Conectando corazones con mascotas que necesitan un hogar</p>
          <p>¿Necesitas ayuda? Responde a este email y te ayudaremos.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateVerificationEmailText(userName: string, verificationUrl: string): string {
  return `
    ¡Bienvenido a PetsCartagena!
    
    Hola ${userName},
    
    Gracias por registrarte en PetsCartagena. Para completar tu registro, por favor verifica tu dirección de email haciendo clic en el siguiente enlace:
    
    ${verificationUrl}
    
    Este enlace expirará en 24 horas por motivos de seguridad.
    
    Una vez verificada tu cuenta, podrás explorar mascotas disponibles para adopción, chatear con dueños y mucho más.
    
    Si no creaste una cuenta en PetsCartagena, puedes ignorar este email.
    
    Saludos,
    El equipo de PetsCartagena
  `;
}