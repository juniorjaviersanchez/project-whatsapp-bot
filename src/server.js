const express = require('express'); // Para el servidor
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const fileUpload = require('express-fileupload'); // Se usa para usar formData
const qrcode = require('qrcode');
const xlsx = require('xlsx');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const SESSION_PATH = path.join(__dirname, '../.wwebjs_auth');
let isAuthenticated = false;

const apiUrl = process.env.VUE_APP_API_URL;

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
        console.log('QR Received', qr);
        app.locals.qrCode = url;
    });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('authenticated', (session) => {
    console.log('Authenticated');
    isAuthenticated = true; // Marca como autenticado
});

client.initialize();

app.get('/qr', (req, res) => {
    res.json({ qrCode: app.locals.qrCode });
});

app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    
    let media;

    // Verifica si hay una imagen en la solicitud
    if (req.files && req.files.image) {
        const image = req.files.image;
        media = new MessageMedia(image.mimetype, image.data.toString('base64'), image.name);
    }

    try {
        if (media) {
            // Enviar mensaje con imagen
            await client.sendMessage(`${number}@c.us`, media, { caption: message });
        } else {
            // Enviar solo texto
            await client.sendMessage(`${number}@c.us`, message);
        }

        res.json({ success: true });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

app.get('/session-status', (req, res) => {
    // Verifica si el directorio de sesión existe
    const sessionExists = fs.existsSync(SESSION_PATH) && isAuthenticated;
    res.json({ sessionExists });
});

app.post('/logout', (req, res) => {
    client.destroy().then(() => {
        console.log('Cliente de WhatsApp destruido.');

        setTimeout(() => {
            // Verifica si el directorio de sesión existe
            if (fs.existsSync(SESSION_PATH)) {
                try {
                    // Elimina el directorio de sesión
                    fs.rmSync(SESSION_PATH, { recursive: true, force: true });
                    console.log('Directorio de sesión eliminado.');

                    // Reinicia el cliente de WhatsApp
                    client.initialize();
                    isAuthenticated = false;
                    res.json({ success: true, message: 'Sesión cerrada y cliente reiniciado.' });
                } catch (err) {
                    console.error('Error al eliminar el directorio de sesión:', err);
                    res.status(500).json({ success: false, message: 'Error al eliminar el directorio de sesión.', error: err });
                }
            } else {
                res.json({ success: false, message: 'No hay sesión activa para cerrar.' });
            }
        }, 1000); // Espera de 1 segundo antes de intentar eliminar el directorio
    }).catch(err => {
        console.error('Error al destruir el cliente de WhatsApp:', err);
        res.status(500).json({ success: false, message: 'Error al destruir el cliente de WhatsApp.', error: err });
    });
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
