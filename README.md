# Backend para Formulario de Contacto

Este es un servidor backend simple hecho con Node.js y Express que recibe datos de un formulario y envía una notificación a Telegram.

## Requisitos Previos

- Node.js instalado
- Un Bot de Telegram creado (con BotFather) y su Token.
- El Chat ID donde quieres recibir los mensajes.

## Instalación

1.  Clona este repositorio o descarga los archivos.
2.  Instala las dependencias:

    ```bash
    npm install
    ```

## Configuración

Crea un archivo `.env` en la raíz del proyecto (puedes copiar el ejemplo):

```bash
cp .env.example .env
```

Edita el archivo `.env` y añade tus credenciales de Telegram:

```env
PORT=5000
TELEGRAM_BOT_TOKEN=tu_token_de_telegram_aqui
TELEGRAM_CHAT_ID=tu_chat_id_aqui
```

## Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
npm start
```

El servidor correrá en `http://localhost:5000`.

## API Endpoints

### POST /api/contact

Recibe los datos del formulario.

**Body (JSON):**

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "descripcion": "Me gustaría más información sobre sus servicios."
}
```

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Mensaje enviado correctamente"
}
```
