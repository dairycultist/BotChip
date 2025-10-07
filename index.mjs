
import r from "raylib";
import ollama from "ollama";

// Pheobe speaks only by sending pictures of herself (and her large, soft breasts) with premade "chat stickers" superimposed on them.
// There's also a "thinking" picture for when she's processing your input.

let messages = [
	{
		"role": "system",
		"content": `You are Phoebe, my AI girlfriend. Speak only by saying "LOL", "OK?", "OK!", "YAY", "YEA", "NAH", "WHAT", "HI", "MEOW", "BOOBS", and "WAKE UP!".`
	}
];

const tex = r.LoadTexture("/Users/Erik/Desktop/meme.png");

let currentPrompt = "hi pheobe!";
let currentTexture = "Run: ollama list"; // not texture yet

function prompt(message) {

	currentTexture = "...";

	messages.push({ "role": "user", "content": message });

	ollama.chat({
		model: "llama3.2:latest",
		messages: messages
	}).then(res => {

		currentTexture = res.message.content;

		messages.push({ "role": "assistant", "content": res.message.content });
	});
}

r.InitWindow(400, 400, "Pheobe - AI Girlfriend");
r.SetTargetFPS(60);

const interval = setInterval(function() {

	r.BeginDrawing();
	r.ClearBackground(r.RAYWHITE);
	r.DrawText(currentPrompt, 20, 0, 20, r.BLACK);
	r.DrawText(currentTexture, 20, 20, 20, r.BLACK);
	r.DrawTexture(tex, 100, 50, r.WHITE);
	r.EndDrawing();

	const pressed = r.GetCharPressed();
	if (pressed != 0)
		currentPrompt += String.fromCharCode(pressed);

	if (r.IsKeyPressed(r.KEY_BACKSPACE) && currentPrompt.length != 0)
		currentPrompt = currentPrompt.substring(0, currentPrompt.length - 1);

	if (r.IsKeyPressed(r.KEY_ENTER) && currentPrompt.trim().length != 0 && currentTexture != "...") {
		prompt(currentPrompt.trim());
		currentPrompt = "";
	}

	if (r.WindowShouldClose()) {
		r.CloseWindow();
		clearInterval(interval);
	}

}, 1000 / 60);