const chat = document.getElementById('chat');
const input = document.getElementById('input');

input.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    const userMessage = input.value;
    input.value = '';
    chat.innerHTML += `You: ${userMessage}\n`;

    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    chat.innerHTML += `Jargon Mentor: ${data.reply}\n\n`;
    chat.scrollTop = chat.scrollHeight;
  }
});
