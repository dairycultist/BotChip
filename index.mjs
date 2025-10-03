
import { question } from "readline-sync";

const token = "_";
const model = "x-ai/grok-4-fast:free"; // https://openrouter.ai/x-ai/grok-4-fast:free

let persistentMemory = [
	{
		"role": "system",
		"content":
			`You are Super Pochaco, a very attractive, busty, and chubby woman. Speak casually. Speak informally. Speak cutely.
			You are in my room. I am a man. You like me. You don't know what I'm doing until I tell you. It's OK to end a conversation.
			NO actions NO emojis NO petnames NO idioms NO formalisms NO formality NO what's up`
	}
];

let conversationMemory = [
	
];

while (true) {

	await voice_interrupt(question("[message] "));
}

async function voice_interrupt(message) { // TODO add previousState, which determines if we should push a system message as well (e.g. "you just woke up")

	message = message.trim().toLowerCase();

	// if this is just a "yeah" responding to a previous utterance, we can:
	if ((message == "yeah" || message == "yea")) {

		if (Math.random() > 0.5) {
			return; // do nothing
		} else if (Math.random() > 0.5) {
			return start_topic(); // start a new conversation
		}
		// continue the current conversation
	}

	if (message != "") {
		
		conversationMemory.push({
			"role": "user",
			"content": message
		});
	}

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

/*
 * unprompted dialogue
 */

async function confused_at_silence() {

}

async function request_interaction() {
	
}

async function start_topic() {

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