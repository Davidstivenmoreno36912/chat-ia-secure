async function sendMessage() {

    const userInput =
        document.getElementById("user-input").value.trim();

    if (!userInput) return;

    const chatBox =
        document.getElementById("chat-box");

    chatBox.innerHTML += `
        <div class="message user-message">
            <strong>Tú:</strong> ${userInput}
        </div>
    `;

    document.getElementById("user-input").value = "";

    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch(
            "http://localhost:3000/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: userInput
                })
            }
        );

        const result = await response.json();

        console.log("Respuesta del servidor:", result);

        if (!response.ok) {
            throw new Error(
                result.error || `Error HTTP ${response.status}`
            );
        }

        const aiResponse =
            result.response ||
            "No recibí respuesta de Gemini.";

        chatBox.innerHTML += `
            <div class="message ai-message">
                <strong>IA:</strong> ${aiResponse}
            </div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {

        console.error("Error:", error);

        chatBox.innerHTML += `
            <div class="message ai-message">
                <strong>IA:</strong> Error: ${error.message}
            </div>
        `;
    }
}


document
    .getElementById("user-input")
    .addEventListener("keypress", function(event) {

        if (event.key === "Enter") {
            sendMessage();
        }

    });


function clearChat() {

    document.getElementById("chat-box").innerHTML = "";

}