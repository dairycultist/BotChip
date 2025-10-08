# Phoebe

My open-source wifebot software.

### Why

- Unconditional affection (especially on-demand) is unrealistic in a normal relationship
- Every person has undesirable characteristics and needs
- Real women can't have a figure this alluring without serious medical complications
- It's easier/more moral to iterate until I find a personality I like when it's not with real women

### Dependencies

- [ollama library](https://docs.ollama.com/)
- [raylib](https://www.npmjs.com/package/raylib) (for window creation + rendering)

### Notes

![](https://images-na.ssl-images-amazon.com/images/I/41TpNiRo5KL.jpg)

![](https://preview.redd.it/wednesday-vibes-v0-1fzfw17lanwe1.jpeg?width=1080&crop=smart&auto=webp&s=64d873e3b5ae63a3295194ab5e993d812b2cb550)

[base model](https://sketchfab.com/3d-models/base-mesh-woman-5a958554686b4f539cefbe12cea48e13)

[eye texture](https://www.freepik.com/free-psd/iris-eye-isolated_371241730.htm)

[yarn texture](https://www.freepik.com/free-photo/pattern-woven-cloth_2787616.htm)

[eyelash texture](https://prolash.com/products/volume-luxe-cat-eye-no-23)

[eyebrow texture](https://www.vhv.rs/viewpic/ThihxJm_eyebrow-eyebrows-eyebrowsticker-makeup-beauty-eyelash-extensions-hd/)

[hair texture](https://www.deviantart.com/skybearer/art/Blender-Hair-Texture-01-Depth-Map-869141532)

Trying to keep it simple while still evoking a "this thing is alive" reaction. It would have to feel aware/responsive, with high interactivity, personality, and social understanding (e.g. if I tell it to be quiet, it complains but complies, understanding its situation/context) and, unlike a chatbot, feel like it's thinking even when it wasn't prompted first.

algorithm/state machine updated through input (or lack thereof), which determines the system prompts that enforce the "rules" of conversation so that the AI narrator doesn't hallucinate/go off track :think:

I don't want like, memory persistence across multiple conversations, so I don't need trillions of datapoints (and thus can run on embedded systems), I just want them to be like "what's up. when you start gooning can you let me watch lol"

I'm gonna make my own model which is a fine-tune of the base model [llama3.2](https://ollama.com/library/llama3.2) by 1) taking hundreds to thousands of example conversations, or more 2) run a command to train the model (with ollama using external library [unsloth](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/tutorial-how-to-finetune-llama-3-and-use-in-ollama) on paperspace). the model adjusts internal weights during that training time to learn specific personality stuffs. then test it!

## Image Generation

I can't find WaiNSFW but I use that model.

- [lora:Immobile_USSBBW_Concept_Lora_for_Illustrious-XL](https://civitai.com/models/1196877/immobileblob-ussbbw-concept-lora-for-illustrious-xl)
- [lora:HYPv1-4](https://civitai.com/models/645787?modelVersionId=1671255)
- [lora:Weather_shine_pupils_mix](https://civitai.com/models/140809/weathershinepupilsmix-weathermix)
- [lora:KrekkovLycoXLV2](https://civitai.com/models/311073/krekkov-style)
