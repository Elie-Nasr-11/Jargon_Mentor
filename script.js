<script>
const lessonPrompts = {
  lesson1: { title: "Purpose", systemPrompt: "..." },
  lesson2: { title: "Systems & Signals", systemPrompt: "..." },
  lesson3: { title: "Signal Processing", systemPrompt: "..." },
  lesson4: { title: "Memory", systemPrompt: "..." },
  lesson5: { title: "Exchanging Signals", systemPrompt: "..." }
};

let currentLesson = "lesson1";
let chatHistory = [
  { role: "system", content: lessonPrompts[currentLesson].systemPrompt }
];

const chatContainer = document.getElementById("chat-container");
const inputField = document.getElementById("user-input");

function setLesson(lessonKey) {
  currentLesson = lessonKey;
  chatHistory = [
    { role: "system", content: lessonPrompts[lessonKey].systemPrompt }
  ];
  chatContainer.innerHTML = "";
  appendMessage("assistant", `You are now speaking to the mentor for ${lessonPrompts[lessonKey].title}.`);
}

document.getElementById("lessonSelector").addEventListener("change", (e) => {
  setLesson(e.target.value);
});

function appendMessage(role, text, animated = false) {
  const div = document.createElement("div");
  const label = (role === "user") ? "You: " : "Jargon Mentor: ";
  const className = (role === "user") ? "user" : "assistant";

  const previous = chatContainer.querySelectorAll("div");
  previous.forEach(el => el.classList.add("older"));

  div.className = className;
  div.textContent = label;

  const contentDiv = document.createElement("div");
  contentDiv.style.fontWeight = '300';
  contentDiv.style.whiteSpace = 'pre-wrap';

  let formattedText = text
    .replace(/```(\\w+)?\\n?([^`]+)```/gs, (_, lang, code) =>
      `<pre><code>${lang ? lang + '\\n' : ''}${code}</code></pre><button class='copy-button'>Copy</button>`)
    .replace(/`([^`]+)`/g, '<code>$1</code>');

  if (animated && role === "assistant") {
    let index = 0;
    const full = formattedText;
    chatContainer.classList.add("flash");

    function typeChar() {
      contentDiv.innerHTML = full.slice(0, index++);
      chatContainer.scrollTop = chatContainer.scrollHeight;
      if (index <= full.length) requestAnimationFrame(typeChar);
      else {
        chatContainer.classList.remove("flash");
        setTimeout(addCopyListeners, 100);
      }
    }

    requestAnimationFrame(typeChar);
  } else {
    contentDiv.innerHTML = formattedText;
    setTimeout(addCopyListeners, 100);
  }

  div.appendChild(contentDiv);
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addCopyListeners() {
  const buttons = document.querySelectorAll(".copy-button");
  buttons.forEach(btn => {
    btn.onclick = () => {
      const codeBlock = btn.previousElementSibling.querySelector("code");
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.innerText)
          .then(() => {
            btn.innerText = "Copied!";
            btn.style.borderColor = "var(--accent)";
            setTimeout(() => btn.innerText = "Copy", 1000);
          });
      }
    };
  });
}

async function sendMessage(event) {
  event.preventDefault();
  const message = inputField.value.trim();
  if (!message) return;

  inputField.value = "";

  appendMessage("user", message);
  chatHistory.push({ role: "user", content: message });

  inputField.value = "";
  inputField.classList.add("flash-border");
  setTimeout(() => inputField.classList.remove("flash-border"), 300);

  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: chatHistory })
  });

  const data = await response.json();
  const reply = data.reply;

  appendMessage("assistant", reply, true);
  chatHistory.push({ role: "assistant", content: reply });
}

document.getElementById("chat-form").addEventListener("submit", sendMessage);

inputField.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = Math.min(this.scrollHeight, 130) + "px";
});

inputField.addEventListener("keydown", function (e) {
  if (e.key === "Tab") {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    this.setRangeText("  ", start, end, "end");
  }
});
</script>
