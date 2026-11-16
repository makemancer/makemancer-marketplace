# ElevenLabs Multilingual v2

Model: `speech/elevenlabs-v2`. A steady, stable professional read with a stock voice. Use v4 for general stock narration by default; use v2 when the user asks for it or wants a calmer, more even delivery.

Voice selection: use an exact `voice_id` from `get_model_params`, which also supplies the current settings and language support.

Write plain spoken text. Punctuation controls rhythm. Sparse `<break time="0.5s" />` pauses are supported up to three seconds. Do not use ElevenLabs square-bracket performance tags or phoneme tags. Use natural phonetic spelling only with the user's approval when it changes supplied text.

Starting settings in `extras.voice_settings`: stability 0.5, similarity_boost 0.75, style 0, speed 1.0 (accepted range 0.7 to 1.2). Higher stability is steadier, lower may be more variable.

Language is inferred from text, not `language_code`. Maximum text is 5,000 characters per request. For authorized chunking use `extras.previous_text` and `extras.next_text` as continuity context.

Example text: "Welcome back. <break time=\"0.5s\" /> Today we begin a new chapter."

Check [language routing](languages.md): v2 does not support every v4 language, notably Hebrew, Persian and Urdu. Check current schema before submission.

Sources: [ElevenLabs prompting](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices).
