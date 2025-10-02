# BotChip

https://www.youtube.com/shorts/VLrRbZY5q3w

camera https://www.adafruit.com/product/5841

screen https://tronixstuff.com/2019/10/15/a-tiny-tiny-0-49-64-x-32-graphic-i2c-oled-display-with-arduino/

1. emulate the high-level logic
2. emulate the low-level logic (i.e. implementation on specific hardware, such as with this [arduino emulator](https://wokwi.com/arduino))
3. implement it in a bulky, easy way physically
4. cull it down to a default hardware spec; a "system on a chip" that has an arduino (nano?) processor, a tiny screen (that displays eyes when idle, and text when speaking), a camera, and a microphone (but no physical eyes or speaker or anything, but does have an I/O interface for auxilliaries) also custom PCB

what if I made an open source robo with hardware and AI software interacting with an abstraction layer for behaviours like eye-tracking and such

open-source wifebot (since I just want Connection and Booba without having to ignore all the undesirable features of a human and their desires)

I wonder what's the simplest robot design that would evoke a "kinda alive feeling" response

responsiveness is pretty important

I bet if you stuck digital eyes onto a roomba that looked forward, unless it saw you, in which case it'd look at you, it'd feel pretty alive/emotive

research animation, since that's just Animating life right

embed a camera (for reacting to non-verbal input), screen (for a facial personality), microphone, and speaker into a bodypillow

![](https://images-na.ssl-images-amazon.com/images/I/41TpNiRo5KL.jpg)

---

behaviour state tree with interrupts for input (video/audio)
- sleep (i.e. keeping the screen off to prevent burn-in)
- actively in conversation (i.e. the state it enters right after responding)
- idly looking around curiously/watching you for a while without dialogue

Upon recieving and parsing video/audio input, BotChip performs **request prediction** (entirely algorithmic, no AI) to determine 1) if it constitutes an interrupt and 2) if it is, how to respond.

- If it seems like the audio isn't addressing BotChip (or otherwise doesn't require a response, such as a "that's true"), it does nothing.
- If the request is simple, a response may be **rote** and thus retrievable from a predetermined response list for that request type (for example, responding to "hi" doesn't require an entire AI poll, just respond "hey").
- If the request is complex (and requires a poll to the AI backend), request prediction still serves the role of determining what sort of emote BotChip should perform between recieving the request and responding (due to AI backend latency). This could be looking down while lost in thought, looking forward puzzled, rolling their eyes, etc.

Responses should ideally also take into account the point in its behaviour tree it recieved the interrupt in.
