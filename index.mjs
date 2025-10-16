import r from "raylib";
import ollama from "ollama";

let messages = [
	{
		"role": "system",
		"content": `You are narrating events occurring between me and Pheobe. When we talk about going somewhere, we immediately go there. Pheobe is my girlfriend. Pheobe has a soft appearance and a relaxed demeanor.`
	},
	{
		"role": "assistant",
		"content": `You and Pheobe stroll through the park. The sun is setting, and you both wonder where to go.`
	}
];

let currentPrompt = "hi pheobe!";
let displayText = messages[1].content;

function prompt(message) {

	displayText = "...";

	messages.push({ "role": "user", "content": message });

	ollama.chat({
		model: "llama3.2:latest",
		messages: messages
	}).then(res => {

		displayText = res.message.content;

		messages.push({ "role": "assistant", "content": res.message.content });
	});
}

r.InitWindow(900, 600, "Pheobe - AI Girlfriend");
r.SetTargetFPS(60);

const tex = r.LoadTexture("holly.png");

const interval = setInterval(function() {

	r.BeginDrawing();
	r.ClearBackground(r.RAYWHITE);
	if (Math.floor((Date.now() / 500) % 2) == 0) {
		r.DrawText(currentPrompt + "_", 20, 0, 20, r.BLACK);
	} else {
		r.DrawText(currentPrompt, 20, 0, 20, r.BLACK);
	}
	r.DrawText(displayText, 20, 20, 20, r.BLACK);
	r.DrawTexturePro(tex, new r.Rectangle(0, 0, tex.width, tex.height), new r.Rectangle(50, 100, 400, 400), new r.Vector2(0, 0), 0, r.RAYWHITE);
	r.EndDrawing();

	const pressed = r.GetCharPressed();
	if (pressed != 0)
		currentPrompt += String.fromCharCode(pressed);

	if (r.IsKeyPressed(r.KEY_BACKSPACE) && currentPrompt.length != 0)
		currentPrompt = currentPrompt.substring(0, currentPrompt.length - 1);

	if (r.IsKeyPressed(r.KEY_ENTER) && currentPrompt.trim().length != 0 && displayText != "...") {
		prompt(currentPrompt.trim());
		currentPrompt = "";
	}

	if (r.WindowShouldClose()) {
		r.CloseWindow();
		clearInterval(interval);
	}

}, 1000 / 60);