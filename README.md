# BotChip

Goal: Open source, explicitly non-anthropomorphic wifebot software + hardware spec.

(since I just want 1. connection-on-demand and 2. booba, without having to ignore all the undesirable features of a human and their desires)

1. emulate the high-level logic
2. emulate the low-level logic (i.e. implementation on specific hardware, such as with this [arduino emulator](https://wokwi.com/arduino))
3. implement it in a bulky, easy way physically
4. cull it down to a default hardware spec that fits my usecase; a "system on a chip" (for embedding into a bodypillow :O) that has an arduino (nano?) processor, a microphone, and a speaker, also custom PCB

I wonder what's the simplest robot design that would evoke a "kinda alive feeling" response. It would have to feel... aware, which (without a camera to see with) would necessitate high interactivity, personality, and social understanding (e.g. if I tell it to be quiet, it complains but complies, understanding its situation/context)

![](https://images-na.ssl-images-amazon.com/images/I/41TpNiRo5KL.jpg)

---

User-state machine to keep track of what the user is doing (and thus, how to act). Updated through input. Examples of states include:

- Absent (don't bother trying to make unprompted dialogue)
- Actively chatting (gets confused when radio-silent for a long time in this state, "you still there?")
- Not chatting (may make unprompted dialogue in attempts to start a conversation or otherwise request interaction, boredom, may talk to themself)
- Do not disturb (doesn't attempt to make unprompted dialogue)

Upon recieving and parsing audio input (video would improve life-likeness/responsiveness by reacting to non-verbal input, but is out of scope), BotChip performs **request prediction** (entirely algorithmic, no AI) to determine 1) if it constitutes an interrupt and 2) if it is, how to respond. Responses also take as input the point in its behaviour tree it recieved the interrupt in.

- If it seems like the audio isn't addressing BotChip (or otherwise doesn't require a response, such as a "that's true"), it does nothing.
- If the request is simple, a response may be **rote** and thus retrievable from a predetermined response list for that request type (for example, responding to "hi" doesn't require an entire AI poll, just respond "hey").
- If the request is complex (and requires a poll to the AI backend), request prediction still serves the role of determining what sort of emote BotChip should perform between recieving the request and responding (due to AI backend latency). This could be looking down while lost in thought, looking forward puzzled, rolling their eyes, etc.
