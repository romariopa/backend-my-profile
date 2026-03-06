require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configurar CORS siguiendo buenas prácticas
const allowedOrigins = [
    'https://romarioparra.co',
    'https://www.romarioparra.co',
    'http://localhost:5173', // Para desarrollo local
    'http://localhost:3000'
];

const corsOptions = {
    origin: (origin, callback) => {
        // Permitir peticiones sin origen (como curl o Postman) para facilitar pruebas, 
        // o si es necesario, bloquearlas en producción estricta.
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());

// Endpoint público para verificar el estado de la API (Hello World)
app.get('/api/hello', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Hello World! La API está funcionando correctamente 🚀' 
    });
});

// Endpoint para recibir el formulario de contacto
app.post('/api/contact', async (req, res) => {
    const { nombre, email, descripcion } = req.body;

    // Validación básica
    if (!nombre || !email || !descripcion) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son obligatorios'
        });
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'El formato del email no es válido'
        });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error('Faltan las variables de entorno de Telegram');
        return res.status(500).json({
            success: false,
            message: 'Error de configuración del servidor'
        });
    }

    const message = `
Nuevo formulario recibido:

Nombre: ${nombre}
Email: ${email}
Descripción: ${descripcion}
    `;

    try {
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

        await axios.post(telegramUrl, {
            chat_id: chatId,
            text: message
        });

        console.log('Mensaje enviado a Telegram exitosamente');
        res.status(200).json({ success: true, message: 'Mensaje enviado correctamente' });

    } catch (error) {
        console.error('Error al enviar mensaje a Telegram:', error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el mensaje'
        });
    }
});

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.send('Servidor Backend funcionando correctamente');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
