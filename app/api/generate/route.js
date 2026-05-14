export async function POST(request) {
  try {
    const { systemPrompt } = await request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: systemPrompt,
          },
        ],
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      return Response.json({ error: text }, { status: 500 });
    }

    const data = JSON.parse(text);
    const content = data?.content?.[0]?.text || "生成に失敗しました";

    return Response.json({ content });

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
