# Phoebe

My open-source wifebot software.

### Why

- Unconditional affection (especially on-demand) is unrealistic in a normal relationship
- Every person has undesirable characteristics and needs
- Real women can't have a figure this alluring without serious medical complications
- It's easier/more moral to iterate until I find a personality I like when it's not with real women

Trying to keep it simple while still evoking a "this thing is alive" reaction. It would have to feel aware/responsive, with high interactivity, personality, and social understanding (e.g. if I tell it to be quiet, it complains but complies, understanding its situation/context) and, unlike a chatbot, feel like it's thinking even when it wasn't prompted first.

![](https://images-na.ssl-images-amazon.com/images/I/41TpNiRo5KL.jpg)

![](https://preview.redd.it/wednesday-vibes-v0-1fzfw17lanwe1.jpeg?width=1080&crop=smart&auto=webp&s=64d873e3b5ae63a3295194ab5e993d812b2cb550)

[base model](https://sketchfab.com/3d-models/base-mesh-woman-5a958554686b4f539cefbe12cea48e13)

[eye texture](https://www.freepik.com/free-psd/iris-eye-isolated_371241730.htm)

[yarn texture](https://www.freepik.com/free-photo/pattern-woven-cloth_2787616.htm)

---

algorithm that enforces the "rules" of conversation so that the AI narrator doesn't hallucinate/go off track

State machine that maintains what the user is doing (and thus, how to act). Updated through input. Examples of states include:

- Active (currently chatting)
  - Bot gets confused when radio-silent for a long time in this state, "you still there?"
- Idle (not currently chatting)
  - Switched to when the bot detects that an active conversation has ended.
  - Bot may make unprompted dialogue in attempts to start a conversation or otherwise request interaction, exhibit boredom, or talk to themself.
- Away/DND (chatting blocked)
  - Switched to when 1) told to stop bothering, 2) when their attempts to chat go unanswered, or 3) when told that the user is leaving.
  - Bot doesn't attempt to make unprompted dialogue.

Upon recieving and parsing audio input (video would improve life-likeness/responsiveness by reacting to non-verbal input, but is out of scope), BotChip performs **request prediction** (entirely algorithmic, no AI) to determine 1) if it necessitates a response and 2) if it is, how to respond. Responses also take as input the point in its behaviour tree it recieved the interrupt in.

- If it seems like the audio isn't addressing BotChip (or otherwise doesn't require a response, such as a "that's true"), it does nothing.
- If the request is simple, a response may be **rote** and thus retrievable from a predetermined response list for that request type (for example, responding to "hi" doesn't require an entire AI poll, just respond "hey").
- If the request is complex (and requires a poll to the AI backend), request prediction still serves the role of determining what sort of emote BotChip should perform between recieving the request and responding (due to AI backend latency). This could be looking down while lost in thought, looking forward puzzled, rolling their eyes, etc.

---

Uses the [ollama library](https://docs.ollama.com/).

I don't want like, memory persistence across multiple conversations, so I don't need trillions of datapoints (and thus can run on embedded systems), I just want them to be like "what's up. when you start gooning can you let me watch lol"

I'm gonna make my own model which is a fine-tune of the base model [llama3.2](https://ollama.com/library/llama3.2) by 1) taking hundreds to thousands of example conversations, or more 2) run a command to train the model (with ollama using external library [unsloth](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/tutorial-how-to-finetune-llama-3-and-use-in-ollama) on paperspace). the model adjusts internal weights during that training time to learn specific personality stuffs. then test it!
