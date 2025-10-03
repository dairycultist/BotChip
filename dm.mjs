
import ollama from "ollama"
import { question } from "readline-sync";

let persistentMemory = [
	{
		"role": "system",
		"content":
			`You are describing a homebrew medieval fantasy world. In this world, extreme obesity grants women
			magical abilities at the expense of physical ability (priestesses can often barely walk, but they
			aren't sick, just tired, and they eat very energetically and happily). Magical
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
	{ name: "Shortsword", oneUse: false },
	{ name: "Pack of rations", oneUse: true },
	{ name: "Pack of rations", oneUse: true },
	{ name: "Pack of rations", oneUse: true }
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

	let input = question("1. speak\n2. use\n> ").trim().toLowerCase();
	console.log("\n");

	switch (input) {

		case "1":
		case "speak":

			input = question("What do you say? > ").trim().toLowerCase();
			console.log("\n");

			if (input != "") {

				await asyncPromptAI("The user says: " + input);
			}
			break;
		
		case "2":
		case "use":

			for (const i in inventory) {
				console.log((Number(i) + 1) + ". " + inventory[i].name);
			}

			input = question("Use which (index)? > ").trim().toLowerCase();
			console.log("\n");

			let index = Number(input);

			if (index != NaN && index >= 1 && index <= inventory.length) {

				index--;

				input = question("Use a " + inventory[index].name.toLowerCase() + " in order to...? > ").trim().toLowerCase();
				console.log("\n");

				await asyncPromptAI("The user uses a " + inventory[index].name.toLowerCase() + " to: " + input);

				if (inventory[index].oneUse) {

					console.log("\n\x1b[33m" + "The " + inventory[index].name.toLowerCase() + " was used up!" + "\x1b[0m\n");
					inventory.splice(index, 1);
				}
			}
			break;
		
	}
}

/*
 * backend
 */
async function asyncPromptAI(userPrompt) {

	sessionMemory.push({
		"role": "user",
		"content": userPrompt
	});

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

	console.log("\n\x1b[33m" + response.message.content + "\x1b[0m\n");
}