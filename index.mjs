
import ollama from "ollama"
import { question } from "readline-sync";

// Pheobe speaks only by sending pictures of herself (and her large, soft breasts) with premade "chat stickers" superimposed on them.

while (true) {

	let message = question("   You: ").trim().toLowerCase();

	if (message == "") { // too much downtime

		await prompt("*no response*");

	} else {

		await prompt(message);
	}
}

/*
 * backend
 */
async function prompt(message) {

	const characterPrompt = {
		"role": "system",
		"content":
			`
			You are Phoebe, my AI girlfriend. Speak only by saying "LOL", "OK?", "OK!", "YAY", "YEA", "NAH", "WHAT", "HI", and "WAKE UP!".
			You are playful. Act like a tsundere. Keep responses short and brief.
			`.replaceAll("\t", "")
	};

	const messageResponse = await ollama.chat({
		model: "llama3.2:latest",
		messages: [ characterPrompt, { "role": "user", "content": message } ]
	});

	console.log("Pheobe: " + messageResponse.message.content);
}