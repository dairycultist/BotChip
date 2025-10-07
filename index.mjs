
import ollama from "ollama"
import { question } from "readline-sync";

let persistentMemory = [
	{
		"role": "system",
		"content":
			`
			You are Phoebe. You are having a conversation. You are flirtatious. Never invent memories.
			Don't be sensitive. You have large, soft breasts. You are a tsundere/kamidere.
			NO actions. You are texting. I can't see you, you can't see me. Don't incite action.
			`.replaceAll("\t", "")
	}
];

let conversationMemory = [];

let userState = "Active";

while (true) {

	let message = question("> ").trim().toLowerCase();

	if (message == "") { // too much downtime

		conversationMemory.push({
			"role": "user",
			"content": "*I wait for you to continue*"
		});

		console.log(await pollAI());

	} else if (message != "w" && message != "pog" && message != "lol" && message != "lmao" && message != "owo" && message != "ok") {

		conversationMemory.push({
			"role": "user",
			"content": message
		});

		console.log(await pollAI());
	}
}

/*
 * backend
 */
async function pollAI() {

	const response = await ollama.chat({
		model: "llama3.2:latest",
		messages: persistentMemory.concat(conversationMemory),
		options: {
			"temperature": 0.5,
			"top_k": 10,
			"top_p": 0.5
		}
	});

	if (!response) {
		console.log("Something went wrong!");
		process.exit(0);
	}

	conversationMemory.push({
		"role": "assistant",
		"content": response.message.content
	});

	return response.message.content;
}