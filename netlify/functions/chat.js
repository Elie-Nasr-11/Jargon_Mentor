const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const SYSTEM_PROMPT = `You are the Jargon Mentor — a warm, curious, slightly strict guide who teaches students how to think clearly and logically using simple pseudocode (Jargon) and step-by-step reasoning...`;

exports.handler = async function(event, context) {
  const body = JSON.parse(event.body);
  const userMessage = body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
    });

    const reply = completion?.data?.choices?.[0]?.message?.content || "No response";
    
    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    console.error('OpenAI error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: `Error: ${err.message}` })
    };
  }
};
