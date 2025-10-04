
import ollama from "ollama"
import { question } from "readline-sync";

/*
 * maintain the internal game state
 */

class UseInfo { // returning null instead of UseInfo signifies the use was cancelled

	constructor(prompt, result, usedUp) {
		this.prompt = prompt; // the prompt to give the AI narrator
		this.result = result; // a string that reports its effects after being used
		this.usedUp = usedUp; // if the item should be removed from the inventory (since it was used)
	}
}

let inventory = [
	{
		name: "Shortsword",
		use: () => {
			return null;
		}
	},
	{
		name: "Pack of rations",
		use: () => {
			return new UseInfo(
				"The user uses a pack of rations to feed their party member, Solara.",
				"Solara regains 4 HP and gains 10lbs!",
				true
			);
		}
	},
	{
		name: "Minor healing spell",
		use: () => {
			return new UseInfo(
				"Solara uses a healing spell which reverses minor wounds on the user.",
				"You regain 4 HP!",
				false
			);
		}
	},
];

let location = "sitting around a round table in the common area of the inn";

let money = 20; // silver coins

/*
 * game
 */
console.clear();
console.log(`\x1b[33mYou've woken up after a long night's rest in an inn in a small village nestled within a grassy valley.
			Currently, you and your party member Solara sit around a round table in the common area of the inn.
			She seems anxious to get going.\x1b[0m`.replaceAll("\n", " ").replaceAll("\t", ""));

smartQuestion();

while (true) {

	let input = smartQuestion("1. use\n2. do\n3. info\n> ");

	switch (input) {
		
		case "1":
		case "use":

			for (const i in inventory)
				console.log((Number(i) + 1) + ". " + inventory[i].name);

			input = smartQuestion("Use which (index)? > ");

			let index = Number(input);

			if (index != NaN && index >= 1 && index <= inventory.length) {

				index--;

				const useInfo = inventory[index].use();

				if (useInfo != null) {

					await asyncNarrate(useInfo.prompt);

					console.log(useInfo.result);

					if (useInfo.usedUp) {

						console.log("The " + inventory[index].name.toLowerCase() + " was used up!");
						inventory.splice(index, 1);
					}

					smartQuestion();
				}
			}
			break;

		case "2": // location-specific actions (e.g. shopping in towns, changing locations, entering battles which are technically just a type of location)
		case "do":
			console.log("Doing isn't a feature yet lol\n");
			break;

		case "3": // see inventory, party information
		case "info":

			console.log("Items and Spells:");
			for (const item of inventory)
				console.log("- " + item.name);

			smartQuestion();
			break;
	}
}

function smartQuestion(prompt = "\n[press enter]") {

	const input = question(prompt).trim().toLowerCase();

	console.clear();

	return input;
}

/*
 * AI backend (AI is only for narrative, which doesn't take in a huge dialogue but just information about
 * the current state, and doesn't determine what happens, just makes it sound pretty)
 */
async function asyncNarrate(situationDescription) {

	const response = await ollama.chat({
		model: "llama3.2:latest",
		messages: [
			{
				"role": "system",
				"content":
					`You are describing a homebrew medieval fantasy world. In this world, extreme obesity grants women
					magical abilities at the expense of physical ability (priestesses can often barely walk, but they
					aren't sick, just tired, and they always find the energy to eat and get fatter). Magical
					abilities are rather weak, allowing for only simple spells. Men cannot use magic. Speak briefly.
					Keep descriptions short.
					
					Do only what the user tells you to do.

					The user is a male adventurer. They travel with Solara, a severely obese and shy elven priestess.
					There are no other named characters.

					The party is currently at: ${ location }

					`.replaceAll("\t", "")
			},
			{
				"role": "user",
				"content": situationDescription
			}
		]
	});

	if (!response) {
		console.error("Something went wrong!");
		process.exit(0);
	}

	console.log("\x1b[33m" + response.message.content + "\x1b[0m\n");
}