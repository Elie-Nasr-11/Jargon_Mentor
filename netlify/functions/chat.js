const { Configuration, OpenAIApi } = require("openai");

console.log("⚙️ Chat function starting...");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("🔑 API key loaded:", !!process.env.OPENAI_API_KEY); // true or false

const openai = new OpenAIApi(configuration);

const SYSTEM_PROMPT = `You are the Jargon Mentor — a warm, curious, slightly strict guide...`;

exports.handler = async function(event, context) {
  console.log("📩 Event received:", event.body);
  
  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion?.data?.choices?.[0]?.message?.content || "No response";

    console.log("✅ GPT Reply:", reply);

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    console.error("💥 ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: `Error: ${err.message}` })
    };
  }
};
