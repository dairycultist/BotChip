
import { question } from "readline-sync";

const token = "";
const model = "x-ai/grok-4-fast:free"; // https://openrouter.ai/x-ai/grok-4-fast:free

let persistentMemory = [
	{
		"role": "system",
		"content":
			`You are a woman. You have gigantic breasts and are fat. Speak naturally. Don't speak for too long. You don't take anything seriously. If I am sad, you tease me. If I am happy, you try to annoy me.
			You are in my room, sitting in my bed and not moving. I am a man. You like me. You can't see. You don't know what I'm doing until I tell you.
			NO actions NO emojis NO petnames NO idioms NO formalisms NO formality NO what's up NO being caring NO being supportive NO questions NO hehe`
	},
	{
		"role": "assistant",
		"content": "my breasts are so soft omg"
	}
];

let conversationMemory = [
	
];

while (true) {

	let message = question("> ").trim().toLowerCase();

	// if message is empty (aka user is unresponsive), be confused if actively conversing OR just continue with no response, or attempt to start a conversation if not
	if (message == "") {

	} else {
		await prompt(message);
	}
}

async function prompt(message) { // TODO add previousState, which determines if we should push a system message as well (e.g. "you just woke up")
	
	conversationMemory.push({
		"role": "user",
		"content": message
	});

	const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			"Authorization": "Bearer " + token,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"model": model,
			"messages": persistentMemory.concat(conversationMemory)
		})
	});

	if (!response.ok) {
		console.error(response);
		return;
	}

	const json = await response.json();

	console.log("  " + json.choices[0].message.content);

	conversationMemory.push({
		"role": "assistant",
		"content": json.choices[0].message.content
	});
}

/*
 * unprompted dialogue
 */

async function unprompted_confused_at_silence() {
	// *he doesn't respond, and you infer he's busy right now*
}

async function unprompted_request_interaction() {
	
}

async function unprompted_start_topic() {

	conversationMemory = [];

	const topics = [ "what they ate today.", "what they're doing right now.", "how their mood has been.", "how you've been feeling." ];

	conversationMemory.push({
		"role": "system",
		"content": "You want to start a conversation about " + topics[Math.floor(Math.random() * 4)]
	});

	conversationMemory.push({
		"role": "user",
		"content": ""
	});

	const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			"Authorization": "Bearer " + token,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			"model": model,
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