# Design a new voice

Use `design_voice` when the user wants a new synthetic voice from a description and has no recording to clone: "make me a new voice", "give my character a voice", a fictional narrator. It is not cloning, so no speaker recording or cloning consent is needed. Never design a voice to imitate a real person.

Makemancer designs voices with Fish Voice Design (`provider: "fish"`, the default; other design providers are not available here). A saved design is a private Fish voice that speaks with `speech/fish-drama-3`.

## Where each voice comes from

- A consenting speaker's recording → `clone_voice` (makemancer-clone-voice).
- A description → `design_voice`.
- A stock catalog voice → `update_character({ id, voice_model, voice_id })`. This saves the choice on the Character without generating anything.

## Preview

Prepare the audition text using [speech localization](speech-localization.md). Every Hebrew word must have full niqqud. Apply the same rule when speaking with the saved voice.

Call `design_voice({ prompt, text, character_id, language_code })`:
- `prompt` (20 to 2,000 characters): age, accent, timbre, pace, attitude and use. Describe the sound, never a real person's name or identity.
- `text` (1 to 150 characters): one of the Character's real lines. Omit it only when no script exists yet.
- `language_code`: the BCP-47 language, such as `"he-IL"` or `"en-GB"`.
- `character_id`: the Character that should get the voice, when known, or `character_name` for a new one.

Every request returns three auditions and is charged once; `estimate_generation` gives the price. The Voice Studio card plays them, saves the user's pick to a new or existing Character itself and offers Generate 3 more (another charged request with the same description); when it has saved, read the voice back with `list_characters` rather than saving again. Without the card, let the user pick one and save it as below. Auditions are kept for 7 days until one is saved.

## Save

`design_voice` only creates the auditions. Save the pick by passing the audition's `preview_id` as `voice_preview_id`:

- Existing Character: `update_character({ id, voice_preview_id })`. For an avatar, use the SAME Character `id` so its image and voice stay together.
- New voice-only Character: `create_character({ title, voice_preview_id })`.

A save keeps the Character's other voices and makes this one preferred for its speech model. If the save hits the limit, relay the tool's message, and offer `replace_voice_option_id` to replace a saved designed voice. Never quote plan prices. Do not generate new auditions just to save an approved one.

## Speak

Call `generate_speech({ character_id, model: "speech/fish-drama-3", text })`. Read the model's `get_model_params` first.

Provide `voice_option_id` to pick a saved voice that is not the preferred one; `list_characters` shows the options. Keep the same Character, model and settings for every line of a project.

## Fish design

The description allows up to 2,000 characters and the audition text must be 1 to 150 characters. Defaults: `guidance_scale: 2`, `instruct_guidance_scale: 0`, `speed: 1`, `num_step: 32`; an optional seed is supported. Pass them at the top level or in `extras`, and start with defaults. For Hebrew use `language_code: "he-IL"` and full niqqud on every spoken word.

```json
{"prompt":"Warm Israeli female narrator, expressive modern Hebrew, clear diction and an easy conversational pace.","text":"שָׁלוֹם, אֵיזֶה כֵּיף שֶׁאַתֶּם כָּאן. הַיּוֹם נַתְחִיל בְּסִפּוּר קָטָן.","language_code":"he-IL"}
```

Saving the selected preview with `update_character({ id, voice_preview_id })`, or `create_character({ title, voice_preview_id })` for a new Character, creates a private voice and a Drama 3 Character option. The Character retains its other model voices. Accepted saves with an unknown outcome must not be retried automatically.
