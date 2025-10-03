
import ollama from "ollama"
import { question } from "readline-sync";

let inventory = [ // use() returns null if it does nothing, or a string containing the prompt to give the AI narrator if it does do something
	{
		name: "Shortsword",
		oneUse: false,
		use: () => {
			return null;
		},
		useResult: () => ""
	},
	{
		name: "Pack of rations",
		oneUse: true,
		use: () => {
			return "The user uses a pack of rations to feed their party member, Solara.";
		},
		useResult: () => "Solara regains 4 HP and gains 10lbs!"
	}
];

let location = "sitting around a round table in the common area of the inn";

let money = 20; // silver coins

// TODO maintain an internal state ; AI is only for narrative, which doesn't take in a huge dialogue but just information about the current state

console.log(`\x1b[33mYou've woken up after a long night's rest in an inn in a small village nestled within a grassy valley.
			Currently, you and your party member Solara sit around a round table in the common area of the inn.
			She seems anxious to get going.\x1b[0m`.replaceAll("\n", " ").replaceAll("\t", ""));

while (true) {

	let input = question("1. use\n2. go to\n> ").trim().toLowerCase();
	console.log("\n");

	switch (input) {
		
		case "1":
		case "use":

			for (const i in inventory) {
				console.log((Number(i) + 1) + ". " + inventory[i].name);
			}

			input = question("Use which (index)? > ").trim().toLowerCase();
			console.log("\n");

			let index = Number(input);

			if (index != NaN && index >= 1 && index <= inventory.length) {

				index--;

				const prompt = inventory[index].use();

				if (prompt != null) {

					await asyncPromptAI(prompt);

					console.log(inventory[index].useResult());

					if (inventory[index].oneUse) {

						console.log("The " + inventory[index].name.toLowerCase() + " was used up!");
						inventory.splice(index, 1);
					}
				}
			}
			break;
		
	}
}

/*
 * backend
 */
async function asyncPromptAI(userPrompt) {

	let messages = [
		{
			"role": "system",
			"content":
				`You are describing a homebrew medieval fantasy world. In this world, extreme obesity grants women
				magical abilities at the expense of physical ability (priestesses can often barely walk, but they
				aren't sick, just tired, and they always find the energy to eat and get fatter). Magical
				abilities are rather weak, allowing for only simple spells. Men cannot use magic. Speak briefly.
				Keep descriptions short. Do only what the user tells you to do.

				The user is a male adventurer. They travel with Solara, a severely obese and shy elven priestess.
				There are no other named characters.

				Solara knows these spells:
				- A healing spell which reverses minor wounds.

				The party is currently at: ${ location }

				`.replaceAll("\t", "")
		},
		{
			"role": "user",
			"content": userPrompt
		}
	];

	const response = await ollama.chat({
		model: "llama3.2:latest",
		messages: messages
	});

	if (!response) {
		console.log("Something went wrong!");
		process.exit(0);
	}

	console.log("\n\x1b[33m" + response.message.content + "\x1b[0m\n");
}