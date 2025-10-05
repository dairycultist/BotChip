# BotChip

Goal: Open source wifebot software.

guaranteed unconditional affection. I want a personality and figure (flesh beings are more attractive physically... maybe a 3D model would suffice...)

(since I just want 1. connection-on-demand and 2. booba, without having to ignore all the undesirable features of a human and their desires)

Trying to keep it simple while still evoking a "this thing is alive" reaction. It would have to feel aware/responsive, with high interactivity, personality, and social understanding (e.g. if I tell it to be quiet, it complains but complies, understanding its situation/context) and, unlike a chatbot, feel like it's thinking even when it wasn't prompted first.

![](https://images-na.ssl-images-amazon.com/images/I/41TpNiRo5KL.jpg)

![](https://preview.redd.it/wednesday-vibes-v0-1fzfw17lanwe1.jpeg?width=1080&crop=smart&auto=webp&s=64d873e3b5ae63a3295194ab5e993d812b2cb550)

![](https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e88813ee-ac6d-40e5-a059-20c27f9e0e14/dk9di0y-d2657eed-0b23-43d5-9ab6-29723ea9df70.jpg/v1/fit/w_828,h_1104,q_70,strp/normally_theyre_two_times_bigger_by_handsycasanova_dk9di0y-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTcwNyIsInBhdGgiOiIvZi9lODg4MTNlZS1hYzZkLTQwZTUtYTA1OS0yMGMyN2Y5ZTBlMTQvZGs5ZGkweS1kMjY1N2VlZC0wYjIzLTQzZDUtOWFiNi0yOTcyM2VhOWRmNzAuanBnIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.XxX5UB8vVUApf4UEW3uO0uLFob6tdpDhcX8Q1HVmu5A)

[base model](https://sketchfab.com/3d-models/base-mesh-woman-5a958554686b4f539cefbe12cea48e13)

[eye texture](https://www.freepik.com/free-psd/iris-eye-isolated_371241730.htm)

[yarn texture](https://www.freepik.com/free-photo/pattern-woven-cloth_2787616.htm)

---

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
