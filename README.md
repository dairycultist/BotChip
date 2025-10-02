# BotChip

Goal: Open source, explicitly non-anthropomorphic wifebot software + hardware spec.

(since I just want Connection and Booba without having to ignore all the undesirable features of a human and their desires)

https://www.youtube.com/shorts/VLrRbZY5q3w

camera https://www.adafruit.com/product/5841

screen https://tronixstuff.com/2019/10/15/a-tiny-tiny-0-49-64-x-32-graphic-i2c-oled-display-with-arduino/

1. emulate the high-level logic
2. emulate the low-level logic (i.e. implementation on specific hardware, such as with this [arduino emulator](https://wokwi.com/arduino))
3. implement it in a bulky, easy way physically
4. cull it down to a default hardware spec that fits my usecase; a "system on a chip" (for embedding into a bodypillow :O) that has an arduino (nano?) processor, a microphone, and a speaker, also custom PCB

I wonder what's the simplest robot design that would evoke a "kinda alive feeling" response. It would have to feel... aware, which (without a camera to see with) would necessitate high interactivity, personality, and social understanding (e.g. if I tell it to be quiet, it complains but complies, understanding its situation/context)

![](https://images-na.ssl-images-amazon.com/images/I/41TpNiRo5KL.jpg)

---

Behaviour tree (state machine) with interrupts for input (audio; video would improve life-likeness/responsiveness by reacting to non-verbal input, but is out of scope). Examples of states include:

- Sleep (i.e. keeping the screen off to prevent burn-in)
- Actively in conversation (i.e. the state it enters right after responding; when kept in this state for too long, may unpromptedly respond with confusion, e.g. "you still there?")
- Idly looking around curiously/watching you for a while without dialogue
- Boredom (unprompted dialogue, "talking to self," requests for interaction)

Upon recieving and parsing audio input, BotChip performs **request prediction** (entirely algorithmic, no AI) to determine 1) if it constitutes an interrupt and 2) if it is, how to respond. Responses also take as input the point in its behaviour tree it recieved the interrupt in.

- If it seems like the audio isn't addressing BotChip (or otherwise doesn't require a response, such as a "that's true"), it does nothing.
- If the request is simple, a response may be **rote** and thus retrievable from a predetermined response list for that request type (for example, responding to "hi" doesn't require an entire AI poll, just respond "hey").
- If the request is complex (and requires a poll to the AI backend), request prediction still serves the role of determining what sort of emote BotChip should perform between recieving the request and responding (due to AI backend latency). This could be looking down while lost in thought, looking forward puzzled, rolling their eyes, etc.
