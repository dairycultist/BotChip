import r from "raylib";
import ollama from "ollama";
import { execSync } from "child_process";

let messages = [
	{
		"role": "system",
		"content": `You are Holly, my fat pet eevee. Holly is fat, has a soft appearance, and speaks cutely.`
	}
];

let currentPrompt = "";
let currentResponse = "";
let responding = false;

function attemptPrompt(message) { // returns true if it was able to prompt, false if it's in the middle of processing a previous prompt

	if (responding)
		return false;

	currentResponse = "";
	responding = true;

	messages.push({ "role": "user", "content": message });

	ollama.chat({
		model: "llama3.2:latest",
		messages: messages,
		stream: true
	}).then(async (asyncGenerator) => {

		for await (const part of asyncGenerator) {
			currentResponse += part.message.content;
		}

		messages.push({ "role": "assistant", "content": currentResponse });
		responding = false;
	});

	return true;
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

const foods = [
	{ sprite: r.LoadTexture("res/smore.png"), name: "s'more" },
	{ sprite: r.LoadTexture("res/cupcake.png"), name: "cupcake" },
	{ sprite: r.LoadTexture("res/cookie.png"), name: "cookie" },
	{ sprite: r.LoadTexture("res/brownie.png"), name: "brownie" },
	{ sprite: r.LoadTexture("res/donut.png"), name: "donut" },
];

const interval = setInterval(function() {

	r.BeginDrawing();
	r.ClearBackground(r.RAYWHITE);

	// speech sounds
	if (responding && currentResponse != "") {

		let playing = false;

		for (let sound of speechSounds) {
			
			if (r.IsSoundPlaying(sound)) {
				playing = true;
			}
		}

		if (!playing)
			r.PlaySound(speechSounds[Math.floor(Math.random() * speechSounds.length)]);
	}

	// draw character sprite
	let width = -Math.sin(Date.now() / 200) * 10 + 400;
	let height = Math.sin(Date.now() / 200) * 10 + 400;
	drawSprite(characterSprite, width, height, 450, 600, 0.5, 1, Math.sin(Date.now() / 1000) * 10);

	// draw current prompt input area
	if (Math.floor((Date.now() / 500) % 2) == 0) {
		r.DrawText(">" + currentPrompt + "_", 20, 0, 20, r.BLACK);
	} else {
		r.DrawText(">" + currentPrompt, 20, 0, 20, r.BLACK);
	}

	// draw response balloon + text
	drawTextFixedWidth(currentResponse, 100, 80, 20, 500);

	// action draw/logic
	// TODO add sudsy sponge for cleaning
	// TODO add toy for playing
	const mousePos = r.GetMousePosition();
	let hovering = false;

	for (let i = 0; i < foods.length; i++) {

		const x = 40 + 60 * i;
		const y = 50;

		r.DrawRectangle(x - 24, y - 24, 48, 48, r.LIGHTGRAY);
		drawSprite(foods[i].sprite, 64, 64, x, y, 0.5, 0.5, Math.sin(Date.now() / 150 - 0.5 * i) * 10);

		if (Math.abs(mousePos.x - x) < 24 && Math.abs(mousePos.y - y) < 24) {

			hovering = true;

			if (r.IsMouseButtonPressed(r.MOUSE_BUTTON_LEFT))
				attemptPrompt("*Feeds you a big " + foods[i].name + "*");
		}
	}

	r.SetMouseCursor(hovering ? r.MOUSE_CURSOR_POINTING_HAND : r.MOUSE_CURSOR_DEFAULT);
	
	r.EndDrawing();

	// typing logic
	const pressed = r.GetCharPressed();
	if (pressed != 0)
		currentPrompt += String.fromCharCode(pressed);

	if (r.IsKeyPressed(r.KEY_BACKSPACE) && currentPrompt.length != 0)
		currentPrompt = currentPrompt.substring(0, currentPrompt.length - 1);

	if (r.IsKeyPressed(r.KEY_ENTER) && currentPrompt.trim().length != 0 && attemptPrompt(currentPrompt.trim()))
		currentPrompt = "";

	if (r.WindowShouldClose()) {
		r.CloseAudioDevice();
		r.CloseWindow();
		clearInterval(interval);
	}

}, 1000 / 60);

function drawSprite(sprite, w, h, pivotX, pivotY, pivotU = 0.5, pivotV = 0.5, a = 0) {

	r.DrawTexturePro(
		sprite,
		new r.Rectangle(0, 0, sprite.width, sprite.height),
		new r.Rectangle(pivotX, pivotY, w, h),
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