/**
 * Script para obtener el Refresh Token de OAuth2 para Gmail
 * 
 * PASOS:
 * 1. Configura GMAIL_CLIENT_ID y GMAIL_CLIENT_SECRET en .env
 * 2. Ejecuta: node scripts/get-oauth-token.js
 * 3. Sigue las instrucciones para autorizar la aplicación
 * 4. Copia el refresh_token al .env
 */

const { google } = require('googleapis');
const readline = require('readline');

require('dotenv').config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'http://localhost:3000/auth/google/callback' // redirect URL
);

// Generar URL de autorización
const scopes = [
    'https://www.googleapis.com/auth/gmail.send'
];

const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

console.log('🔗 Ve a esta URL y autoriza la aplicación:');
console.log(url);
console.log('\n📋 Después de autorizar, copia el código de autorización y pégalo aquí:');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Código de autorización: ', (code) => {
    oauth2Client.getToken(code, (err, token) => {
        if (err) {
            console.error('❌ Error obteniendo el token:', err);
            rl.close();
            return;
        }

        console.log('\n✅ Token obtenido exitosamente!');
        console.log('\n📝 Agrega esto a tu archivo .env:');
        console.log(`GMAIL_REFRESH_TOKEN="${token.refresh_token}"`);

        rl.close();
    });
});