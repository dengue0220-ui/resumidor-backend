const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors({
  origin: "https://qinti.site",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options('*', cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MAX_LONGITUD = 1500; // máximo caracteres para enviar a Huggingface

app.post("/resumir", async (req, res) => {
  console.log("Body recibido:", req.body);

  let { texto } = req.body;

  if (!texto || typeof texto !== 'string' || texto.trim().length === 0) {
    console.log("Texto inválido recibido:", texto);
    return res.status(400).json({ error: "No se recibió texto válido para resumir." });
  }

  texto = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (texto.length > MAX_LONGITUD) {
    texto = texto.slice(0, MAX_LONGITUD);
    console.log(`Texto truncado a ${MAX_LONGITUD} caracteres para Huggingface`);
  }

  try {
    const respuesta = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: texto },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000
      }
    );

    console.log("Respuesta Huggingface:", respuesta.data);

    if (!Array.isArray(respuesta.data) || respuesta.data.length === 0) {
      return res.status(500).json({ error: "Respuesta inesperada de Huggingface" });
    }

    if (respuesta.data.error) {
      return res.status(500).json({ error: respuesta.data.error });
    }

    res.json({ resumen: respuesta.data[0]?.summary_text || "[No se pudo generar resumen]" });

  } catch (error) {
    console.error("Error en el backend:", error.response?.data || error.message);
    res.status(500).json({ error: "Error procesando resumen" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
