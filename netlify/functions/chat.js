const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are the Jargon Mentor — a warm, curious, slightly strict guide...`;

exports.handler = async function(event, context) {
  const body = JSON.parse(event.body);
  const userMessage = body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || "No response";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    console.error("OpenAI error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: `Error: ${err.message}` })
    };
  }
};
