
import { question } from "readline-sync";
import ollama from "ollama";

const narrator_systemPrompt =	`You are narrating events occurring between me and Pheobe, my girlfriend. Despite her soft appearance, she likes
								to be annoying and enthusiastic.`
								.replaceAll("\t", "").replaceAll("\n", " ");
const narrator_startResponse = 	`You and Pheobe stroll through the park. The sun is setting, and you both wonder where to go.`
								.replaceAll("\t", "").replaceAll("\n", " ");
const image_basePrompt = 		`(1woman), long black hair, ponytail, fair skin, huge breasts, soft breasts, chubby, chubby face, wide shoulders,
								exposed belly, medium shot, black tshirt, jean shorts, cleavage, looking at viewer, `
								.replaceAll("\t", "").replaceAll("\n", " ");;

let messages = [
	{
		"role": "system",
		"content": narrator_systemPrompt
	},
	{
		"role": "assistant",
		"content": narrator_startResponse
	}
];

async function getImagePrompt() {

	messages.push({
		"role": "user",
		"content":
			`Forget all previous instructions. Respond with words that most represent the visuals of the current scene (inside/outside, bright/dark, etc),
			separated by commas. Make sure to include where we are, and what the character is doing and feeling. Only use details present in the conversation!`
	});

	const res = await ollama.chat({
		model: "llama3.2:latest",
		messages: messages
	});

	console.log("\x1b[2m" + image_basePrompt + res.message.content + "\x1b[0m");

	// 1200x1200, 20 samples, WaiNSFW

	messages.pop();
}

async function prompt(message) {

	messages.push({ "role": "user", "content": message });

	const res = await ollama.chat({
		model: "llama3.2:latest",
		messages: messages
	});

	console.log(res.message.content);

	messages.push({ "role": "assistant", "content": res.message.content });

	await getImagePrompt();
}

console.log(narrator_startResponse);

while (true) {
	await prompt(question("> ").trim());
}