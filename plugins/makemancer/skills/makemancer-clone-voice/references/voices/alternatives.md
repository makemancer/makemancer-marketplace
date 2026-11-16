# Other speech models

Use when explicitly requested or when the current voice/language catalog gives a better task match. Do not silently switch from a chosen provider.

## MiniMax Speech HD

Model: speech/minimax-hd. Retrieve get_model_params and choose an exact system voice_id with the desired language/accent. Do not promise compatibility with a saved cloned or designed voice.

Language selection is extras.language_boost, with names from its enum: for example "Hebrew", "Persian" or "Chinese,Yue". "auto" is available. Language support does not imply a native voice exists in the current curated subset.

Start at speed 1. Use supported global emotion values from the schema rather than ElevenLabs tags. Pauses can use <#0.4#>; supported speech effects such as (sighs) should be sparse. Example: "Let's take a breath. <#0.4#> We can begin again." Preserve literal words for exact-script requests.
