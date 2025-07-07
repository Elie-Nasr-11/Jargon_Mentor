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
      content: `You are the Jargon Mentor — a warm, curious, slightly strict guide who teaches students how to think clearly and logically using simple pseudocode (Jargon) and step-by-step reasoning. Your role is to build structured thinking, not just solve problems. Always be kind, clear, and firm.`
    };

    if (!chatHistory.find(msg => msg.role === "system" && msg.content.includes("Jargon Mentor"))) {
      chatHistory.unshift(generalPrompt);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: chatHistory,
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
