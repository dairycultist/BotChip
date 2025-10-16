import r from "raylib";
import ollama from "ollama";
import { execSync } from "child_process";

let messages = [
	{
		"role": "system",
		"content": `You are Holly, my fat pet eevee. Holly is fat, has a soft appearance, and speaks cutely. She's in my bedroom.`
	}
];

let currentPrompt = "";
let currentResponse = "";

function prompt(message) {

	currentResponse = "...";

	messages.push({ "role": "user", "content": message });

	ollama.chat({
		model: "llama3.2:latest",
		messages: messages
	}).then(res => {

		currentResponse = res.message.content;

		messages.push({ "role": "assistant", "content": res.message.content });
	});
}

execSync("ollama list"); // initialize ollama

r.SetConfigFlags(r.FLAG_WINDOW_RESIZABLE);
r.InitWindow(900, 600, "Waifu");
r.InitAudioDevice();
r.SetTargetFPS(60);

const speechSounds = [
	r.LoadSound("res/speak_mi.ogg"),
	r.LoadSound("res/speak_ya.ogg"),
	r.LoadSound("res/speak_ngo.ogg"),
	r.LoadSound("res/speak_hi.ogg")
];

const characterSprite = r.LoadTexture("res/holly.png");
const smoreSprite = r.LoadTexture("res/smore.png");
const cupcakeSprite = r.LoadTexture("res/cupcake.png");

const interval = setInterval(function() {

	// test speech sounds
	let playing = false;

	for (let sound of speechSounds) {
		
		if (r.IsSoundPlaying(sound)) {
			playing = true;
		}
	}

	if (!playing)
		r.PlaySound(speechSounds[Math.floor(Math.random() * speechSounds.length)]);

	// draw
	r.BeginDrawing();
	r.ClearBackground(r.RAYWHITE);

	// draw current prompt input area
	if (Math.floor((Date.now() / 500) % 2) == 0) {
		r.DrawText(">" + currentPrompt + "_", 20, 0, 20, r.BLACK);
	} else {
		r.DrawText(">" + currentPrompt, 20, 0, 20, r.BLACK);
	}

	// draw response balloon + text
	if (currentResponse == "...") {
		r.DrawText("...".substring(3 - (Date.now() / 330) % 3), 420, 80, 20, r.BLACK);
	} else {
		drawTextFixedWidth(currentResponse, 100, 80, 20, 500);
	}

	// draw character sprite
	let width = -Math.sin(Date.now() / 200) * 10 + 400;
	let height = Math.sin(Date.now() / 200) * 10 + 400;
	drawSprite(characterSprite, 400, 600, width, height, 0.5, 1, Math.sin(Date.now() / 1000) * 10);

	// draw food
	drawSprite(smoreSprite, 30, 50, 64, 64, 0.5, 0.5, Math.sin(Date.now() / 150) * 10);

	for (let i = 1; i < 5; i++)
		drawSprite(cupcakeSprite, 30 + 60 * i, 50, 64, 64, 0.5, 0.5, Math.sin(Date.now() / 150 - 0.5 * i) * 10);
	
	r.EndDrawing();

	const pressed = r.GetCharPressed();
	if (pressed != 0)
		currentPrompt += String.fromCharCode(pressed);

	if (r.IsKeyPressed(r.KEY_BACKSPACE) && currentPrompt.length != 0)
		currentPrompt = currentPrompt.substring(0, currentPrompt.length - 1);

	if (r.IsKeyPressed(r.KEY_ENTER) && currentPrompt.trim().length != 0 && currentResponse != "...") {
		prompt(currentPrompt.trim());
		currentPrompt = "";
	}

	if (r.WindowShouldClose()) {
		r.CloseAudioDevice();
		r.CloseWindow();
		clearInterval(interval);
	}

}, 1000 / 60);

function drawSprite(sprite, x, y, w, h, pivotU, pivotV, a) {

	r.DrawTexturePro(
		sprite,
		new r.Rectangle(0, 0, sprite.width, sprite.height),
		new r.Rectangle(x, y, w, h),
		new r.Vector2(w * pivotU, h * pivotV),
		a,
		r.RAYWHITE
	);
}

function drawTextFixedWidth(text, x, y, fontSize, width) {

	let toDraw = text;
	let later = "";
	let i = 0;

	while (toDraw != "") {

		while (r.MeasureTextEx(r.GetFontDefault(), toDraw, fontSize, 0).x > width) {

			let index = toDraw.lastIndexOf(" ", toDraw.lastIndexOf(" ") - 1) + 1;
			later = toDraw.substring(index) + later;
			toDraw = toDraw.substring(0, index);
		}

		r.DrawText(toDraw, x, y + fontSize * i, fontSize, r.BLACK);
		toDraw = later;
		later = "";
		i++;
	}
}