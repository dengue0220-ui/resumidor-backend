# Resumidor Backend (para qinti.site)

Este es el backend Node.js que actúa como proxy entre tu HTML y la API de Hugging Face.

## 🚀 Cómo desplegar en Render

1. Sube este proyecto a un repositorio GitHub (ej: `resumidor-backend`)
2. Entra a https://render.com y haz clic en "New Web Service"
3. Conecta tu cuenta GitHub y selecciona este repo
4. Configura:
   - Runtime: Node
   - Build Command: (déjalo vacío)
   - Start Command: `npm start`
5. En "Environment Variables" agrega:
   - `HUGGINGFACE_API_KEY` = tu_token_de_huggingface
6. Haz Deploy y copia la URL generada (ej: `https://resumidor-qinti.onrender.com`)

## ✅ Listo
Ahora edita tu HTML y cambia la URL del fetch al backend de Render.