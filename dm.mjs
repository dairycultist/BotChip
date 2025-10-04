
import ollama from "ollama"
import { question } from "readline-sync";

/*
 * maintain the internal game state
 */

class UseResult { // inventory Actions are "used"

	constructor(prompt, result, usedUp) {
		this.prompt = prompt; // the prompt to give the AI narrator
		this.result = result; // a string that reports its effects after being used
		this.usedUp = usedUp; // if the item should be removed from the inventory (since it was used)
	}
}

class DoResult { // location Actions are "done"

}

class Action {

	constructor(displayName, perform) {
		this.displayName = displayName;
		this.perform = perform; // function that defines what happens when the Action is used (i.e. state updates), and returns a UseResult/DoResult (or null to signify the action was cancelled)
	}
}

let inventory = [
	new Action("Shortsword", () => null),
	new Action("Pack of rations", () => {
		
		return new UseResult(
			"The user uses a pack of rations to feed their party member, Solara.",
			"Solara regains 4 HP and gains 10lbs!",
			true
		);
	}),
	new Action("Minor healing spell", () => {

		const input = smartQuestion("Use on 1:Solara or 2:yourself? > ");

		if (input == "1") {
			return new UseResult(
				"Solara uses a healing spell which reverses minor wounds on herself.",
				"Solara regains 4 HP!",
				false
			);
		} else if (input == "2") {
			return new UseResult(
				"Solara uses a healing spell which reverses minor wounds on the user.",
				"You regain 4 HP!",
				false
			);
		} else {
			return null;
		}
	})
];

class Location {

	constructor(displayName, prompt, actions) {
		this.displayName = displayName;
		this.prompt = prompt; // the prompt to give the AI narrator
		this.actions = actions; // list of Actions
	}
}

let location = new Location("Inn", "sitting around a round table in the common area of the inn", [
	new Action("Do nothing", () => null),
	new Action("Do nothing but more", () => null),
]);

let money = 20; // silver coins

/*
 * game action choice system
 */
console.clear();
console.log(`\x1b[33mYou've woken up after a long night's rest in an inn in a small village nestled within a grassy valley.
			Currently, you and your party member Solara sit around a round table in the common area of the inn.
			She seems anxious to get going.\x1b[0m`.replaceAll("\n", " ").replaceAll("\t", ""));

smartQuestion();

while (true) {

	switch (smartQuestion("1. use\n2. do\n3. info\n> ")) {
		
		case "1":
		case "use":
			await actionUse();
			break;

		case "2":
		case "do":
			await actionDo();
			break;

		case "3":
		case "info":
			await actionInfo();
			break;
	}
}

async function actionUse() {

	for (const i in inventory)
		console.log((Number(i) + 1) + ". " + inventory[i].displayName);

	let index = Number(smartQuestion("\nUse which (index)? > "));

	if (index != NaN && index >= 1 && index <= inventory.length) {

		index--;

		const useResult = inventory[index].perform();

		if (useResult != null) {

			await asyncNarrate(useResult.prompt);

			console.log(useResult.result);

			if (useResult.usedUp) {

				console.log("The " + inventory[index].displayName.toLowerCase() + " was used up!");
				inventory.splice(index, 1);
			}

			smartQuestion();
		}
	}
}

// location-specific actions (e.g. shopping in towns, changing locations, entering battles which are technically just a type of location)
async function actionDo() {

	for (const i in location.actions)
		console.log((Number(i) + 1) + ". " + location.actions[i].displayName);

	let index = Number(smartQuestion("\nDo which (index)? > "));

	if (index != NaN && index >= 1 && index <= location.actions) {

		index--;

		const doResult = inventory[index].perform();

		if (doResult != null) {

			// await asyncNarrate(useResult.prompt);

			// console.log(useResult.result);

			// if (useResult.usedUp) {

			// 	console.log("The " + inventory[index].displayName.toLowerCase() + " was used up!");
			// 	inventory.splice(index, 1);
			// }

			// smartQuestion();
		}
	}
}

// see inventory, party information, current location
async function actionInfo() {

	console.log("Current location: " + location.displayName + "\n");

	console.log("Silver coins: " + money + "\n");

	console.log("Items and Spells:");
	for (const item of inventory)
		console.log("- " + item.displayName);

	smartQuestion();
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

					The party is currently at: ${ location.prompt }

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