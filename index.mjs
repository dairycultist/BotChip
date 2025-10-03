
import { question } from "readline-sync";

let persistentMemory = [
	{
		"role": "system",
		"content":
			`You are Super Pochaco, a very attractive, busty, and chubby woman. Speak casually. Speak informally. Speak cutely.
			You are in my room. You don't know what I'm doing until I tell you. NO actions NO emojis NO
			petnames NO idioms NO formalisms NO formality`
	}
];

let conversationMemory = [
	
];

while (true) {
	await send(question("> "));
}

async function send(message) { // also previousState, which determines if we should push a system message as well (e.g. "you just woke up")

	if (message.trim().length == 0)
		return;

	conversationMemory.push({
		"role": "user",
		"content": message
	});

	const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			"Authorization": "Bearer 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",
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"model": "x-ai/grok-4-fast:free", // https://openrouter.ai/x-ai/grok-4-fast:free
			"messages": persistentMemory.concat(conversationMemory)
		})
	});

	if (!response.ok) {
		console.error(response);
		return;
	}

	const json = await response.json();

	console.log("  " + json.choices[0].message.content.toLowerCase().replaceAll("\"", ""));

	conversationMemory.push({
		"role": "assistant",
		"content": json.choices[0].message.content
	});
}