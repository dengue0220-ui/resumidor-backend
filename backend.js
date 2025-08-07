const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

app.post("/resumir", async (req, res) => {
  try {
    const { texto } = req.body;
    const respuesta = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: texto },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ resumen: respuesta.data[0]?.summary_text || "[Resumen vacío]" });
  } catch (error) {
    console.error("Error en el backend:", error.response?.data || error.message);
    res.status(500).json({ error: "Error al resumir" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});