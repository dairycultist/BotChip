
import ollama from "ollama"
import { question } from "readline-sync";

let persistentMemory = [
	{
		"role": "system",
		"content":
			`You are describing a homebrew medieval fantasy world. In this world, extreme obesity grants women
			magical abilities at the expense of physical ability (priestesses can often barely walk). Magical
			abilities are rather weak, allowing for only simple spells. Men cannot use magic. Speak briefly.
			Keep descriptions short.`
			.replaceAll("\n", " ").replaceAll("\t", "")
	},
	{
		"role": "system",
		"content":
			`The user, who is a male adventurer, has a travelling party that consists of:
			- Solara, a severely obese and shy elven priestess.
			Solara knows these spells:
			- A healing spell which reverses minor wounds`
			.replaceAll("\n", " ").replaceAll("\t", "")
	}
];

let inventory = [
	"A shortsword",
	"A pack of rations",
	"A pack of rations",
	"A pack of rations"
];

// should add money system, silver coins

let sessionMemory = [
	{
		"role": "assistant",
		"content":
			`You've woken up after a long night's rest in an inn in a small village nestled within a grassy valley.
			Currently, you and your party member Solara sit around a round table in the common area of the inn.
			She seems anxious to get going.`
			.replaceAll("\n", " ").replaceAll("\t", "")
	}
];

console.log("\n\x1b[33m" + sessionMemory[0].content + "\x1b[0m\n");

while (true) {

	let message;

	switch (question("1. speak\n2. use\n").trim().toLowerCase()) {

		case "1":
		case "speak":

			message = question("What do you say? ").trim().toLowerCase();

			if (message != "") {

				sessionMemory.push({
					"role": "user",
					"content": "The user says: " + message
				});

				console.log("\n\x1b[33m" + await pollAI() + "\x1b[0m\n");
			}
			break;
		
		case "2":
		case "use":

			// use what?
			// use _ in order to...

			// "The user uses _ to: "
			break;
		
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