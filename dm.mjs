
import ollama from "ollama"
import { question } from "readline-sync";

let persistentMemory = [
	{
		"role": "system",
		"content":
			`You are describing a homebrew medieval fantasy world. In this world, obesity grants women magical
			abilities at the expense of physical ability. Men cannot use magic. Speak briefly. Keep descriptions short.`
			.replaceAll("\n", " ").replaceAll("\t", "")
	},
	{
		"role": "assistant",
		"content":
			`The user, who is a male adventurer, has a travelling party that consists of:
			- Solara, a severely obese and shy elven priestess.`
			.replaceAll("\n", " ").replaceAll("\t", "")
	}
];

let sessionMemory = [
	{
		"role": "assistant",
		"content":
			`You've woken up after a long night's rest in an inn in a small village nestled within a grassy valley.
			Currently, you and your party member Solara sit around a round table in the common area of the inn.
			She seems anxious to get going. What do you do?`
			.replaceAll("\n", " ").replaceAll("\t", "")
	}
];

console.log("\x1b[0m" + sessionMemory[0].content);

while (true) {

	console.log("\x1b[32m");
	let message = question("> ").trim().toLowerCase();
	console.log("\x1b[0m");

	if (message == "exit") {
		process.exit(0);
	}

	if (message != "") {

		sessionMemory.push({
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
		messages: persistentMemory.concat(sessionMemory)
	});

	if (!response) {
		console.log("Something went wrong!");
		process.exit(0);
	}

	sessionMemory.push({
		"role": "assistant",
		"content": response.message.content
	});

	return response.message.content;
}