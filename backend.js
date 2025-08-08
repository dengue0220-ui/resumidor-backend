// backend.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Configurar CORS para tu dominio
app.use(cors({
  origin: "https://qinti.site",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "50mb" })); // Aceptar JSON grande
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Ruta para resumir
app.post("/resumir", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto || texto.trim().length === 0) {
      return res.status(400).json({ error: "No se recibió texto válido para resumir." });
    }

    const respuesta = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: texto },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000 // 60s para evitar cortes
      }
    );

    res.json({ resumen: respuesta.data[0]?.summary_text || "[No se pudo generar resumen]" });
  } catch (error) {
    console.error("Error en el backend:", error.response?.data || error.message);
    res.status(500).json({ error: "Error procesando resumen" });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
