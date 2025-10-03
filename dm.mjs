
import ollama from "ollama"
import { question } from "readline-sync";

let persistentMemory = [
	{
		"role": "system",
		"content":
			`You are a dungeon master. You are describing a homebrew medieval fantasy world. In this world, obesity grants women magical abilities at the expense of physical ability.
			Men cannot use magic. Speak briefly. Keep descriptions short. Ask vaguely what the user would like to do.`
			.replaceAll("\n", " ").replaceAll("\t", "")
	}
];

let sessionMemory = [
	{
		"role": "assistant",
		"content":
			`You are a male adventurer, whose travelling party consists of the severely obese and shy elven priestess Sina,
			and the mischievous kitsune swordswoman with huge breasts and wide hips, Mona. You've woken up after a long night's rest in
			an inn in a small village nestled within a grassy valley. Currently, you sit around a round table in the common
			area of the inn. What do you do?`
			.replaceAll("\n", " ").replaceAll("\t", "")
	}
];

console.log("  " + sessionMemory[0].content);

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

		console.log("\n" + await pollAI() + "\n");
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