
import ollama from "ollama"
import { question } from "readline-sync";

let characterPrompt = {
	"role": "system",
	"content":
		`
		You are Phoebe. You are having a conversation. You are flirtatious. Never invent memories.
		Don't be sensitive. You have large, soft breasts. You are a tsundere/kamidere.
		NO actions. You are texting. I can't see you, you can't see me. Don't incite action.
		`.replaceAll("\t", "")
};

let contextPrompt = {
	"role": "system",
	"content": "I just started chatting with Pheobe."
};

while (true) {

	let message = question("> ").trim().toLowerCase();

	if (message == "") { // too much downtime

		console.log(await pollAI("*I wait for you to continue*"));
		console.log(contextPrompt.content);

	} else if (message != "w" && message != "pog" && message != "lol" && message != "lmao" && message != "owo" && message != "ok") {

		console.log(await pollAI(message));
		console.log(contextPrompt.content);
	}
}

/*
 * backend
 */
async function pollAI(message) {

	const messageResponse = await ollama.chat({
		model: "llama3.2:latest",
		messages: [ characterPrompt, contextPrompt, { "role": "user", "content": message } ],
		options: {
			"temperature": 0.5,
			"top_k": 10,
			"top_p": 0.5
		}
	});

	const contextResponse = await ollama.chat({
		model: "llama3.2:latest",
		messages: [{
			"role": "user",
			"content": `Respond ONLY by summarizing this short scenario:\nContext: ${ contextPrompt.content }\nMe: ${ message }\nPheobe: ${ messageResponse.message.content }`
		}],
		options: {
			"temperature": 0.3,
			"top_k": 10,
			"top_p": 0.3
		}
	});

	contextPrompt.content = contextResponse.message.content;

	return messageResponse.message.content;
}