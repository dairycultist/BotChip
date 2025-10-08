
import { question } from "readline-sync";
import ollama from "ollama";

let messages = [
	{
		"role": "system",
		"content": `You are narrating events occurring between me and Pheobe, my girlfriend. She likes me, has large, soft breasts, and is snarky.`
	},
	{
		"role": "assistant",
		"content": `You and Pheobe are sitting in a warmly lit coffee shop. As she enjoys her slice of cake, you wonder what to say.`
	}
];

async function getImagePrompt() {

	messages.push({ "role": "user", "content": "Forget all previous instructions. Create a description of the current scene, separating descriptive words between commas. Make sure to describe what Pheobe is doing and feeling." });

	const res = await ollama.chat({
		model: "llama3.2:latest",
		messages: messages
	});

	console.log("\x1b[2m" + "1woman, long black hair, fair skin, huge breasts, soft breasts, upper body, looking at viewer, black tshirt, " + res.message.content + "\x1b[0m");

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

while (true) {
	await prompt(question("> ").trim());
}