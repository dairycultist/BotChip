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

// tamagotchi stats [0.0,1.0] (maybe dirtiness, boredom, tiredness?)
let hunger = 1.0;

let eatingAnimationTimer = 0.0;

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

const growthSound = r.LoadSound("res/growth.ogg");

const characterSprites = [
	r.LoadTexture("res/holly_slim.png"),
	r.LoadTexture("res/holly_chubby.png"),
	r.LoadTexture("res/holly_fat.png"),
	r.LoadTexture("res/holly_obese.png")
];

const actions = [
	{
		sprite: r.LoadTexture("res/smore.png"),
		attemptUse: () => {

			if (attemptPrompt("*Feeds you a big s'more*")) {
				r.PlaySound(growthSound);
				hunger = Math.max(0, hunger - 0.2);
				eatingAnimationTimer = 0;
			}
		}
	},
	{
		sprite: r.LoadTexture("res/cupcake.png"),
		attemptUse: () => {
			
			if (attemptPrompt("*Feeds you a big cupcake*")) {
				r.PlaySound(growthSound);
				hunger = Math.max(0, hunger - 0.2);
				eatingAnimationTimer = 0;
			}
		}
	},
	{
		sprite: r.LoadTexture("res/cookie.png"),
		attemptUse: () => {
			
			if (attemptPrompt("*Feeds you a big cookie*")) {
				r.PlaySound(growthSound);
				hunger = Math.max(0, hunger - 0.2);
				eatingAnimationTimer = 0;
			}
		}
	},
	{
		sprite: r.LoadTexture("res/brownie.png"),
		attemptUse: () => {
			
			if (attemptPrompt("*Feeds you a big brownie*")) {
				r.PlaySound(growthSound);
				hunger = Math.max(0, hunger - 0.2);
				eatingAnimationTimer = 0;
			}
		}
	},
	{
		sprite: r.LoadTexture("res/donut.png"),
		attemptUse: () => {
			
			if (attemptPrompt("*Feeds you a big donut*")) {
				r.PlaySound(growthSound);
				hunger = Math.max(0, hunger - 0.2);
				eatingAnimationTimer = 0;
			}
		}
	},
	{
		sprite: r.LoadTexture("res/beachball.png"),
		attemptUse: () => {

			attemptPrompt("*Starts playing with a beachball with you*");
		}
	}
	// TODO add blue sudsy sponge for cleaning
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
				break;
			}
		}

		if (!playing)
			r.PlaySound(speechSounds[Math.floor(Math.random() * speechSounds.length)]);
	}

	// draw character sprite
	eatingAnimationTimer += r.GetFrameTime();

	let width = 400;
	let height = 400;

	let fac = 2 / (1 + Math.pow(10, -eatingAnimationTimer)) - 1;
	width -= Math.sin(Date.now() / 200) * 5 * fac; // idle bobbing
	height += Math.sin(Date.now() / 200) * 5 * fac;

	width += (100 / (eatingAnimationTimer * 3 + 1)); // eating animation
	height -= (100 / (eatingAnimationTimer * 3 + 1));

	drawSprite(characterSprites[Math.floor((1 - hunger) * (characterSprites.length * 0.9))], width, height, 450, 600, 0.5, 1, Math.sin(Date.now() / 1000) * 10 * (1 - hunger));

	// draw current prompt input area
	if (Math.floor((Date.now() / 500) % 2) == 0) {
		r.DrawText(">" + currentPrompt + "_", 20, 0, 20, r.BLACK);
	} else {
		r.DrawText(">" + currentPrompt, 20, 0, 20, r.BLACK);
	}

	// draw response balloon + text
	drawTextFixedWidth(currentResponse, 100, 80, 20, 500);

	// action draw/logic
	const mousePos = r.GetMousePosition();
	let hovering = false;

	for (let i = 0; i < actions.length; i++) {

		const x = 40 + 60 * (i % 5);
		const y = 50 + Math.floor(i / 5) * 64;

		// shelf
		r.DrawRectangleGradientV(x - 24, y - 24, 48, 48, r.RAYWHITE, r.LIGHTGRAY);

		// hover logic
		if (Math.abs(mousePos.x - x) < 24 && Math.abs(mousePos.y - y) < 24) {

			hovering = true;

			if (r.IsMouseButtonPressed(r.MOUSE_BUTTON_LEFT))
				actions[i].attemptUse();

			drawSprite(actions[i].sprite, 72, 72, x, y, 0.5, 0.5, Math.sin(Date.now() / 150 - 0.5 * i) * 10);

		} else {

			drawSprite(actions[i].sprite, 64, 64, x, y, 0.5, 0.5, Math.sin(Date.now() / 150 - 0.5 * i) * 10);
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

	let construct = "";

	let line = text;
	let nextLine = "";

	while (line != "") {

		while (r.MeasureTextEx(r.GetFontDefault(), line, fontSize, 0).x > width) {

			let index = line.lastIndexOf(" ", line.lastIndexOf(" ") - 1) + 1;
			nextLine = line.substring(index) + nextLine;
			line = line.substring(0, index);
		}

		construct += line + "\n";
		line = nextLine;
		nextLine = "";
	}

	r.DrawText(construct, x, y, fontSize, r.BLACK);
}