export default async (req) => {
  const { title, author } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response("API key not configured.", { status: 500 });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: "You write warm, spoiler-free book descriptions for a reading group. Write 2-3 engaging sentences that make the book sound appealing without revealing plot twists. No preamble, just the description.",
      messages: [{ role: "user", content: `Describe the book "${title}" by ${author}.` }]
    })
  });

  const data = await response.json();
  const text = data?.content?.[0]?.text ?? "No description available.";
  return new Response(text, { status: 200 });
};

export const config = {
  path: "/api/describe"
};
