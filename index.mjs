
import r from "raylib";
import ollama from "ollama";
import { question } from "readline-sync";

let messages = [
	{
		"role": "system",
		"content": `You are Phoebe, my AI girlfriend. Speak only by saying "LOL", "OK?", "OK!", "YAY", "YEA", "NAH", "WHAT", "HI", "MEOW", "BOOBS", and "WAKE UP!".`
	}
];

async function prompt(message) {

	r.BeginDrawing();
    r.ClearBackground(r.RAYWHITE);
    r.DrawText("...", 20, 20, 20, r.BLACK);
    r.EndDrawing();

	messages.push({ "role": "user", "content": message });

	const messageResponse = await ollama.chat({
		model: "llama3.2:latest",
		messages: messages
	});

	r.BeginDrawing();
    r.ClearBackground(r.RAYWHITE);
    r.DrawText(messageResponse.message.content, 20, 20, 20, r.BLACK);
    r.EndDrawing();

	messages.push({ "role": "assistant", "content": messageResponse.message.content });
}

// Pheobe speaks only by sending pictures of herself (and her large, soft breasts) with premade "chat stickers" superimposed on them.
// There's also a "thinking" picture for when she's processing your input.

r.InitWindow(400, 400, "Pheobe - AI Girlfriend");
r.SetTargetFPS(60);

r.BeginDrawing();
r.ClearBackground(r.RAYWHITE);
r.DrawText("Run: ollama list", 20, 20, 20, r.BLACK);
r.EndDrawing();

while (!r.WindowShouldClose()) {

	let message = question("> ").trim().toLowerCase();

	if (message == "") { // too much downtime

		await prompt("*no response*");

	} else {

		await prompt(message);
	}
}
r.CloseWindow();