const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event, context) {
  try {
    const body = JSON.parse(event.body);
    const chatHistory = body.messages;

    const generalPrompt = {
      role: "system",
      content: "You are the Jargon Mentor — a warm, curious, slightly strict guide..."
    };
    
    if (!chatHistory.find(msg => msg.content.includes("You are the Jargon Mentor"))) {
      chatHistory.unshift(generalPrompt);
    }

    const systemMessage = chatHistory.find(m => m.role === "system");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: chatHistory
    });

    const reply = completion.choices?.[0]?.message?.content || "No response.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("OpenAI error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: `Error: ${err.message}` }),
    };
  }
};
