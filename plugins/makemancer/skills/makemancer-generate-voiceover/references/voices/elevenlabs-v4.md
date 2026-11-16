# ElevenLabs v4

Model: `speech/elevenlabs-v4`. This is the default for stock narration and expressive speech. Read the [v4 production guide](elevenlabs-v4-guide.md) for scripts and runnable examples.

Call `get_model_params({ model: "speech/elevenlabs-v4" })` for the current voice catalog, language list, settings, and pricing before generation. Choose a voice that already suits the language and delivery.

Provide `text` and a public `voice_id`. Use concise `[whispers]`, `[laughs]`, `[long pause]`, or similar audible directions when useful. V4 supports Stability and Similarity inside `extras.voice_settings`; `extras.language_code` sets the language for a short or ambiguous script. Do not pass speed, style, speaker boost, or SSML.

This route speaks one voice per request. For two speakers in one call, use Google Flash or Flash-Lite TTS and inspect their current parameters; otherwise generate one take per speaker turn and keep the order.

V2 gives a steadier read. Preserve a requested model.
