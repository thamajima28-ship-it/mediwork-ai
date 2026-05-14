export async function POST(request) {
  try {
    const { systemPrompt } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return Response.json({ error: "API key not found" }, { status: 500 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        "model": "claude-3-5-sonnet-20241022",
        max_tokens: 2000,
        messages: [{ role: "user", content: systemPrompt }],
      }),
    });

    const text = await response.text();
    console.log("API Response status:", response.status);
    console.log("API Response body:", text);

    if (!response.ok) {
      return Response.json({ error: `API Error: ${text}` }, { status: 500 });
    }

    const data = JSON.parse(text);
    const content = data?.content?.[0]?.text || "生成に失敗しました";
    return Response.json({ content });

  } catch (error) {
    console.log("Catch error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
