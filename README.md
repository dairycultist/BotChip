# My open-source wifebot software

a stupid little companion to cheer me on. not gonna add that much complexity (at the expense of lifelike-ness) because hard

none of the components need be perfect (or even good) since I can iterate on... her

algorithm (tamagotchi-esque, has internal values like hunger, boredom, and tiredness) that responds to input which determines the system prompts that enforce the "rules" of conversation so that the AI narrator doesn't hallucinate/go off track

I'm gonna make my own model which is a fine-tune of the base model [llama3.2](https://ollama.com/library/llama3.2) by 1) taking hundreds to thousands of example conversations, or more 2) run a command to train the model (with ollama using external library [unsloth](https://docs.unsloth.ai/get-started/fine-tuning-llms-guide/tutorial-how-to-finetune-llama-3-and-use-in-ollama) on paperspace). the model adjusts internal weights during that training time to learn specific personality stuffs. then test it!

### Why

- Unconditional affection (especially on-demand) is unrealistic in a normal relationship
- Every person has undesirable characteristics and needs
- Real women can't have a figure this alluring without serious medical complications
- It's easier/more moral to iterate until I find a personality I like when it's not with real women

### Dependencies

- [ollama library](https://docs.ollama.com/)
- [raylib](https://www.npmjs.com/package/raylib) (for window creation + rendering)
