---
name: makemancer-generate-voiceover
description: "Generate narration, dialogue, or expressive speech with Makemancer, or design a new custom synthetic voice from a description. Use for finding voices by accent, previewing stock voices, repairing pronunciation, or speaking in a saved Character voice. To copy a real person's voice from a recording, use makemancer-clone-voice."
---

# Generate voiceover

For each Makemancer tool call that exposes it, pass the optional `skills_used` array with `makemancer-generate-voiceover`, any other Makemancer skills actually followed, and guide entries in the form `<skill-name>/<relative-guide-path>` (for example, `makemancer-generate-voiceover/references/workflow-basics.md`). Include only skills and guides followed for that call. Omit attribution if the user declines tracking or the field is unavailable. Never send other plugin names, private data, or local paths.

**Not connected yet?** If no Makemancer tools (such as `list_models` or `generate_image`) are available, the plugin is installed but the server is not connected. Stop and tell the user to open the plugin's **Connectors** tab in Claude (Customize, then Plugins, then Makemancer), press **Connect**, and sign in. In Claude Code they run `/mcp` instead. Then they ask again. Do not substitute other tools or describe a result that was not generated.

Read [shared execution guidance](references/workflow-basics.md) before tools. The speech tool is `generate_speech`. For a requested take, send the requested script and selected or delegated voice to Makemancer and return the player in the current conversation. A script review, a voice search or a request to hear stock samples ends with the text or existing samples. If the user asks to choose between voices, wait for their choice.

Use only the recording the user selected for the requested operation. If an attachment could be a script reference, pronunciation example, performance to transform, or cloning sample, clarify its purpose before uploading it. External sharing or publishing requires a request that identifies the output and destination. A complaint about a take is a request to help with that take. Offer to report it to Makemancer and wait for agreement before sending feedback.

## Localize the spoken text

For Hebrew, send full niqqud on every spoken Hebrew word unless the chosen model's `get_model_params` script rules ask for plain Hebrew. Apply this to narration, each dialogue turn, clone auditions and voice-design preview text, including user-supplied scripts. Preserve the words and intended meaning while adding vowel points. This rule applies across providers, not only Fish. For Arabic, likewise send full tashkeel on every spoken Arabic word, vowelled for the requested dialect (Egyptian, Gulf, Levantine...) rather than Modern Standard Arabic, including user-supplied scripts. Before submitting Hebrew, Arabic or other pronunciation-sensitive text, read [speech localization](references/voices/speech-localization.md).

## Which voice

- "Clone my voice", "use my recording", or an unsaved personal voice: load makemancer-clone-voice when available. If this skill is installed alone, read [the complete cloning workflow](references/voices/cloning.md). Obtain explicit consent once, up front, import privately, clone right after the upload, test and save a reusable Character. Do not send source audio directly to speech generation as a substitute for cloning.
- Existing Character voice (cloned, designed or stock): find the Character with `list_characters` (`search_voices` also lists the account's cloned and designed voices first, as `your_voices`) and provide `character_id`. Do not clone or design again.
- Stock voice: when the user has not chosen one or wants to hear options, call `search_voices` with `language`, `gender`, `accent` and a few words in `query` on the sound or the purpose ("warm audiobook narrator", "energetic ad"); voices made for that purpose rank first. It shows a card with samples, and the user's pick arrives in their next message. Pass the chosen result's `model` and `voice_id` together to `generate_speech` and read that model's `get_model_params` first. A result with `sample_url: null` has no sample: offer a one-line audition instead of describing how it sounds. When the user describes a voice and does not want to choose, pick the closest result and name it; never invent a voice description. Never pass both selectors.
- New voice from a description (no recording): call `design_voice({ prompt })` with age, accent, timbre, pace and attitude, never a real person's identity. Voices are designed with Fish here: three auditions charged as one request, audition text up to 150 characters, and Hebrew requires full niqqud on every word. After the user picks, save it with `update_character({ id, voice_preview_id })`, or `create_character({ title, voice_preview_id })` for a new Character, passing the audition's `preview_id` as `voice_preview_id`. Speak with `generate_speech({ character_id })` using `speech/fish-drama-3`. If the save hits the limit, offer `replace_voice_option_id`; never quote plan prices. For a stock voice use `update_character({ id, voice_model, voice_id })`. Details: [voice design](references/voices/voice-design.md).
- A one-off English read that should sound like a supplied recording: `speech/chatterbox` with the recording in `audio_urls`; read [Chatterbox](references/voices/chatterbox-guide.md). Use only a recording the speaker agreed to, and do not present the result as a saved voice.

## Choose and load one model guide

| Need | Recommended starting point |
| --- | --- |
| Stock narration, expressive speech with audio tags, broad language coverage | [ElevenLabs v4](references/voices/elevenlabs-v4.md) |
| A steady professional read | [ElevenLabs v2](references/voices/elevenlabs-v2.md) |
| Two-speaker dialogue or style-directed delivery with Google voices | `speech/gemini-3.8-flash-tts` or the lighter `speech/gemini-3.8-flash-lite-tts` (read its `get_model_params`) |
| Directed Fish performances, cloned or designed voices, or scenes with many speakers | [Fish Drama 3](references/voices/fish.md) |
| A named alternative or a specific dialect/voice match | [MiniMax and other models](references/voices/alternatives.md) |
| An English one-off match to a supplied recording | [Chatterbox](references/voices/chatterbox-guide.md) |

Default to ElevenLabs v4 for stock voices. Speak a cloned or designed voice with `speech/fish-drama-3`, the Character's own engine. Pass the model explicitly rather than relying on the omitted-model default, and keep it for the whole project. V2 can use public stock IDs, but v4 is the stock choice. If a user explicitly requests v2 stock speech, use a compatible public `voice_id` instead of silently switching. Do not automatically route stock corporate or long-form narration to v2. Use Orpheus or Kokoro only when the user asks for them, reading their `get_model_params`.

## Multiple speakers in one run

Google Flash and Flash-Lite TTS take up to two speakers in one `generate_speech` request through `extras.dialogue`: ordered turns with `speaker`, `text`, and optional `voice_id` and `style`. Fish Drama 3 takes ordered turns through the same `extras.dialogue` contract, with up to 16 speakers and 100 turns, each turn with a public `voice_id` or a cloned or designed Character's `character_id`. ElevenLabs speaks one voice per request here; for more speakers, generate one take per speaker turn and keep the order. Read the selected model's current schema before submission. With `extras.dialogue`, omit the top-level `voice_id`; if a cached tool schema still requires `text`, provide `text: ""`.

## Execute and deliver

1. Establish text, target language/accent and delivery. Preserve supplied words unless rewriting is requested. Prepare the actual speech payload using the localization guidance; Hebrew must be fully vowelized before submission, including every `extras.dialogue[].text`.
2. Read the selected model's reference and current `get_model_params`. Reuse a current schema already loaded in this task. Use `list_models({ category: "speech" })` only when discovering alternatives.
3. Select a language-appropriate stock voice (`search_voices` when none is chosen) or saved Character and only settings accepted by that model. Never copy prompting tags across models.
4. Generate the requested take. For a new clone or uncertain pronunciation, offer a short audition before a long production, not an unrequested paid model sweep. Do not add IPA or phonemes up front. If one word comes out wrong (an acronym, the stress, a homograph or a loanword), fix only that word as [pronunciation](references/voices/pronunciation.md) describes. Never send IPA to a model that does not decode it. When the user approves a fix, offer to save it as a saved pronunciation so later takes apply it automatically; saved rules already apply to every take, and the result lists the swaps.
5. Follow queued results with `check_job` as directed by [job recovery](references/job-recovery.md). Show the completed audio through the available native preview.
6. Keep the Character ID and voice/model choice available for the requested continuation. Speech added to a video is an audio overlay, not lip-sync, and a video's Character reference does not bring its voice into native video audio.

When the user likes a generated look or voice, offer once to save it as a named Character for future work. Check `list_characters` first. An explicit request to save the look or voice is agreement. Update the existing Character or create one when authorized with the approved image or selected voice. Reuse its ID for later shots or speech. A voice-only Character works for a narrator.

For long narration, offer a representative paragraph if the user wants to check the voice first. Expand ambiguous dates, numbers and units in the spoken copy. Verify recurring names. Keep fixes in this script unless the user asks to save them for future takes.

## Save results to the user's folder

When you can read and write local files (Claude Code, Codex, Cowork and similar), save every finished result as soon as its job completes:

1. Download each output from its permanent URL with `curl --fail -L -o <path> <url>` into the current folder, at `makemancer/<YYYY-MM-DD>/<name>-<NN>.<ext>`, for example `makemancer/2026-11-08/product-ad-01.mp4`.
2. Name the file after what it shows, in a few words in the user's language. Number multiple results of one request in order from `01`. Never overwrite a file: use the next free number.
3. Tell the user the saved path or paths.

Where you cannot write files (Claude.ai, ChatGPT), skip this: the result card has a Download button.
