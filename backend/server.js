require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();


// ===============================
// CONFIGURACIÓN
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// VERIFICAR API KEY
// ===============================

console.log(
    "API Key cargada:",
    process.env.GEMINI_API_KEY ? "SI" : "NO"
);


// ===============================
// RUTA PRINCIPAL DEL CHAT
// ===============================

app.post("/api/chat", async (req, res) => {

    try {

        const userInput = req.body.message;

        // Verificar mensaje
        if (!userInput || !userInput.trim()) {

            return res.status(400).json({
                error: "El mensaje está vacío"
            });

        }


        // Verificar API Key
        if (!process.env.GEMINI_API_KEY) {

            return res.status(500).json({
                error: "GEMINI_API_KEY no está configurada"
            });

        }


        // ===============================
        // URL DE GEMINI
        // ===============================

        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;


        // ===============================
        // DATOS PARA GEMINI
        // ===============================

        const data = {

            contents: [

                {
                    parts: [

                        {
                            text: userInput
                        }

                    ]
                }

            ]

        };


        // ===============================
        // LLAMADA A GEMINI
        // ===============================

        const response = await fetch(url, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });


        const result = await response.json();


        console.log(
            "Respuesta de Gemini:",
            result
        );


        // ===============================
        // MANEJAR ERROR DE GEMINI
        // ===============================

        if (!response.ok) {

            return res.status(response.status).json({

                error:
                    result.error?.message ||
                    `Error HTTP ${response.status}`

            });

        }


        // ===============================
        // OBTENER RESPUESTA DE LA IA
        // ===============================

        const aiResponse =
            result.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No recibí respuesta de Gemini.";


        // ===============================
        // RESPONDER AL FRONTEND
        // ===============================

        res.json({

            response: aiResponse

        });


    } catch (error) {

        console.error(
            "Error en el servidor:",
            error
        );


        res.status(500).json({

            error: error.message

        });

    }

});


// ===============================
// INICIAR SERVIDOR
// ===============================

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Servidor ejecutándose en http://localhost:${PORT}`
    );

});