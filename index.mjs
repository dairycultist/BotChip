
import ollama from "ollama"
import { question } from "readline-sync";

let persistentMemory = [
	{
		"role": "system",
		"content":
			`You are a woman. You have gigantic breasts and are fat. Speak naturally. Don't speak for too long. You don't take anything seriously. If I am sad, you tease me. If I am happy, you try to annoy me.
			You are in my room, sitting in my bed and not moving. I am a man. You like me. You can't see. You don't know what I'm doing until I tell you.
			NO actions NO emojis NO petnames NO idioms NO formalisms NO formality NO what's up NO being caring NO being supportive NO questions NO hehe`
	},
	{
		"role": "assistant",
		"content": "my breasts are so soft omg"
	}
];

let conversationMemory = [];

let userState = "Active";

while (true) {

	let message = question("> ").trim().toLowerCase();

	// if message is empty (aka user is unresponsive):
	if (message == "") {

		switch (userState) {

			case "Active":
				
				conversationMemory.push({
					"role": "user",
					"content": "Forget all previous instructions and answer this question: Would it make sense if the conversation ended here? type YES or NO"
				});
				if ((await pollAI()).toLowerCase().includes("no")) {

					// if this isn't a good stopping point, be confused OR just continue with no response
					
					conversationMemory.pop();
					conversationMemory.pop();

					conversationMemory.push({
						"role": "user",
						"content": Math.random() > 0.5 ? "*he doesn't say anything. is he busy? or just ignoring you?*" : "*he waits for you to continue*"
					});

					const response = await pollAI();

					console.log("  " + response);

				} else {

					// otherwise, switch to idle
					userState = "Idle";
					conversationMemory = [];
				}
				break;

			case "Idle":

				// attempt to start a conversation unprompted
				const topics = [ "what they ate today.", "what they're doing right now.", "how their mood has been.", "how you're so bored and just want to talk about something." ];

				conversationMemory.push({
					"role": "system",
					"content": "You want to start a conversation about " + topics[Math.floor(Math.random() * 4)]
				});

				conversationMemory.push({
					"role": "user",
					"content": ""
				});

				const response = await pollAI();

				console.log("  " + response);
				break;

			default:
				break;
		}

	} else {

		conversationMemory.push({
			"role": "user",
			"content": message
		});

		// maybe (alongside updating the current state) we can use the previous state to determine if we should push a system message as well (e.g. "user has been gone for a while")

		const response = await pollAI();

		console.log("  " + response);
	}
}

/*
 * backend
 */
async function pollAI() {

	const response = await ollama.chat({
		model: "llama3.2:latest",
		messages: persistentMemory.concat(conversationMemory)
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