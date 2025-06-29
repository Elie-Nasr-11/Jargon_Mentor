<script>
let chatHistory = [
  {
    role: "system",
    content: `You are the Jargon Mentor — a warm, curious, slightly strict guide who teaches students...`
  }
];

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  // Show user message
  appendMessage("user", message);
  chatHistory.push({ role: "user", content: message });
  input.value = "";

  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: chatHistory })
  });

  const data = await response.json();
  const reply = data.reply;

  appendMessage("assistant", reply);
  chatHistory.push({ role: "assistant", content: reply });
}

function appendMessage(role, text) {
  const container = document.getElementById("chat-container");
  const message = document.createElement("div");
  message.className = role;
  message.textContent = (role === "user" ? "You: " : "Jargon Mentor: ") + text;
  container.appendChild(message);
  container.scrollTop = container.scrollHeight;
}
</script>
