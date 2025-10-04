
import ollama from "ollama"
import { question } from "readline-sync";

/*
 * types
 */

class UseResult {

	constructor(prompt, result, usedUp) {
		this.prompt = prompt; // the prompt to give the AI narrator
		this.result = result; // a string that reports its effects after being used. should be descriptive, since the AI doesn't give concrete details like variable changes
		this.usedUp = usedUp; // if the item should be removed from the inventory (since it was used)
	}
}

class DoResult {

	constructor(prompt, result) {
		this.prompt = prompt;
		this.result = result;
	}
}

class Action {

	constructor(displayName, onActionPerformed) {
		this.displayName = displayName;
		this.onActionPerformed = onActionPerformed; // function that defines what happens when the Action is used (i.e. state updates), and returns a UseResult/DoResult (or null to signify the action was cancelled)
	}

	async asyncUse(index) { // inventory Actions are "used"

		const useResult = this.onActionPerformed();

		if (useResult != null) {

			await asyncNarrate(useResult.prompt);

			console.log(useResult.result);

			if (useResult.usedUp) {

				console.log("The " + this.displayName.toLowerCase() + " was used up!");
				inventory.splice(index, 1);
			}

			smartQuestion();
		}
	}

	async asyncDo() { // location Actions are "done"

		const doResult = this.onActionPerformed();

		if (doResult != null) {

			await asyncNarrate(doResult.prompt);

			console.log(doResult.result);

			smartQuestion();
		}
	}
}

class Location {

	constructor(displayName, prompt, actions) {
		this.displayName = displayName;
		this.prompt = prompt;
		this.actions = actions; // list of Actions
	}
}

/*
 * singletons
 */

const SHORT_SWORD = new Action("Shortsword", () => null);

const PACK_OF_RATIONS = new Action("Pack of rations", () => {
		
	return new UseResult(
		"I use a pack of rations to feed my party member, Solara.",
		"Solara regains 4 HP and gains 10lbs!",
		true
	);
});

const MINOR_HEALING_SPELL = new Action("Minor healing spell", () => {

	const input = smartQuestion("Use on 1:Solara or 2:yourself? > ");

	if (input == "1") {
		return new UseResult(
			"Solara uses a healing spell which reverses minor wounds on herself.",
			"Solara regains 4 HP!",
			false
		);
	} else if (input == "2") {
		return new UseResult(
			"Solara uses a healing spell which reverses minor wounds on me.",
			"You regain 4 HP!",
			false
		);
	} else {
		return null;
	}
});

const VILLAGE = new Location("Village", "out in the village proper, where villagers are going about their day", [
	new Action("Enter the inn", () => {

		location = INN;

		return new DoResult(
			"The party heads into the nearby inn from the village proper",
			"You are now in the inn."
		);
	})
]);

const INN = new Location("Inn", "sitting around a round table in the common area of the inn", [
	new Action("Rest for the night (-10 silver coins, restore all HP/MP)", () => {

		if (money - 10 >= 0) {

			money -= 10;

			return new DoResult(
				"I rent a room from the innkeeper. That night, Solara and I have an intimate moment.", // TODO just make it pick a random party member
				"All party member's HP/MP restored to full, -10 silver coins"
			);

		} else {

			return new DoResult(
				"I attempt to rent a room from the innkeeper, but I don't have enough silver coins and am turned away without resistance.",
				"Sorry Link, I can't give credit. Come back when you're a little, mmmm... richer!"
			);
		}
	}),
	new Action("Buy pack of rations from innkeeper (-5 silver coins)", () => {

		if (money - 5 >= 0) {

			inventory.push(PACK_OF_RATIONS);
			money -= 5;

			return new DoResult(
				"I buy a pack of rations from the innkeeper for 5 silver coins, which Solara is eager to stow away in her pack for later.",
				"+1 pack of rations, -5 silver coins"
			);

		} else {

			return new DoResult(
				"I attempt to buy a pack of rations from the innkeeper, but I don't have enough silver coins and am turned away without resistance.",
				"Sorry Link, I can't give credit. Come back when you're a little, mmmm... richer!"
			);
		}
	}),
	new Action("Leave the inn", () => {

		location = VILLAGE;

		return new DoResult(
			"The party heads out of the dark inn into the bright village proper.",
			"You are now in the village."
		);
	})
]);

/*
 * maintain the internal game state
 */

// TODO genericize party logic
// (I can just include every character's personality alongside the prompt, and hope the AI makes good characterization,
// + if something needs a specific character to do something just pick a random one or smth)

let inventory = [ SHORT_SWORD, MINOR_HEALING_SPELL ];

let location = INN;

let money = 20;

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
		
		// actions involving items/spells in the inventory, which can be performed anywhere
		case "1":
		case "use":
			await actionUse();
			break;

		// location-specific actions (e.g. shopping in towns, changing locations, entering battles which are technically just a type of location)
		case "2":
		case "do":
			await actionDo();
			break;

		// see inventory, party information, current location
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

	if (index != NaN && index >= 1 && index <= inventory.length)
		await inventory[index - 1].asyncUse(index - 1);
}

async function actionDo() {

	for (const i in location.actions)
		console.log((Number(i) + 1) + ". " + location.actions[i].displayName);

	let index = Number(smartQuestion("\nDo which (index)? > "));

	if (index != NaN && index >= 1 && index <= location.actions.length)
		await location.actions[index - 1].asyncDo();
}

async function actionInfo() {

	console.log("Current location: " + location.displayName + "\n");

	console.log("Silver coins: " + money + "\n");

	console.log("Items and Spells:");
	for (const item of inventory)
		console.log("- " + item.displayName);

	console.log("\nParty member   HP      MP      Weight");
	console.log("You            15/15   -       -");
	console.log("Solara         10/10   5/5     300lbs");

	smartQuestion();
}

function smartQuestion(prompt = "\n[press enter]") {

	const input = question(prompt).trim().toLowerCase();

	console.clear();

	return input;
}

/*
 * AI backend (AI is only for narrative, which doesn't take in a huge dialogue but just information about
 * the current game state, and doesn't determine what happens, just makes it sound pretty)
 */

async function asyncNarrate(situationDescription) {

	console.log("\x1b[2m\x1b[5mLoading...\x1b[0m");

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
					
					Do only what I tell you to do.

					I am a male adventurer. I travel with:
					- Solara, a severely obese and shy elven priestess. She wears a simple white robe, cinched at the waist by a wide leather belt, and her dark hair is neatly braided under a hood that keeps it from falling loose in the breeze.
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

	console.clear();

	if (!response) {
		console.error("Something went wrong!");
		process.exit(0);
	}

	console.log("\x1b[33m" + response.message.content + "\x1b[0m\n");
}