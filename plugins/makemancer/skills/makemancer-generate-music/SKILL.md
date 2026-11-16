---
name: makemancer-generate-music
description: "Compose songs, instrumentals, scores, beds, jingles and stings with Makemancer, extend or cover a track, or replace the lyrics of one section of a generated song. Use for music, not speech or sound effects."
---

# Generate Music

For each Makemancer tool call that exposes it, pass the optional `skills_used` array with `makemancer-generate-music`, any other Makemancer skills actually followed, and guide entries in the form `<skill-name>/<relative-guide-path>` (for example, `makemancer-generate-music/references/workflow-basics.md`). Include only skills and guides followed for that call. Omit attribution if the user declines tracking or the field is unavailable. Never send other plugin names, private data, or local paths.

**Not connected yet?** If no Makemancer tools (such as `list_models` or `generate_image`) are available, the plugin is installed but the server is not connected. Stop and tell the user to open the plugin's **Connectors** tab in Claude (Customize, then Plugins, then Makemancer), press **Connect**, and sign in. In Claude Code they run `/mcp` instead. Then they ask again. Do not substitute other tools or describe a result that was not generated.

Read [shared execution guidance](references/workflow-basics.md) once per task before using tools. It covers existing authorization, model discovery, optional cost checks, imports, and recovery.

Create a finished music asset with `generate_music`. Route narration or dialogue to `makemancer-generate-voiceover`. Route Foley, ambience, impacts, transitions, UI cues, and other non-musical sounds to `makemancer-generate-sound-effects`.

## Pick the operation

Makemancer has one music engine, offered as four models. Call it by these IDs and do not name or guess the provider behind it.

| Need | Model | Notes |
| --- | --- | --- |
| New song, instrumental, score, bed, jingle or sting | `music/standard` (default) | Each request returns two tracks. Description mode: a `prompt` only, and the model writes lyrics and style. Custom mode: `style` and `title` (both required), plus `lyrics` for a vocal song. `duration` (10–360 s) is a target in custom mode only. |
| Continue a generated track | `music/standard-extend` | `audio_id` (or `task_id`) of the chosen track, optional `continue_at` in seconds, plus the same text fields for the new part. |
| Cover an existing song in a new style | `music/standard-cover` | `audio_url` of an uploaded song up to 8 minutes, plus `style`, `title` and optional `lyrics` to keep or replace the words. |
| Replace the lyrics of one section of a generated track | `music/standard-region-edit` | `audio_id` (or `task_id`) of the chosen track, the new `prompt`, `style`, `title`, `full_lyrics`, and the section as `infill_start_s` to `infill_end_s`. |

Fetch `get_model_params` for the selected model when its schema is not already known; it is the authority on field names and limits. A music result lists its tracks in `tracks`, each with its own `audio_id` and `task_id`; refer to the chosen track by those IDs, never by a guessed one.

## Workflow

1. Establish the track's purpose, duration, placement, genre, mood, tempo, instrumentation, energy arc, ending, and whether vocals are wanted. Ask only for missing choices that materially change the result.
2. Pick the model from the table, and description or custom mode for a new track: custom mode when the user supplied lyrics, a title, or exact style words; description mode for an open brief. Read [music prompting](references/music-prompting.md) before writing the prompt. Keep quoted lyrics and required timing exactly.
3. Use `estimate_generation` with `operation: "audio"` only when the user asks about cost, balance, affordability, or supplies a budget. An estimate-only request does not authorize generation.
4. State consequential settings briefly, then call `generate_music`. One requested track authorizes one generation, which returns two tracks. Resolve queued jobs with `check_job`, present both tracks, and ask the user to pick one; keep that track's `audio_id` and `task_id` for any extend, cover or lyric edit. Generate again only when the user asks for another take.
5. Listen for genre fit, tempo, instrumentation, vocal presence, lyric accuracy, energy arc, mix density, ending, and clipping. A defect can justify a proposed revision, not an unrequested paid regeneration.
6. Return the permanent audio asset of the chosen track (and the other one if the user wants both). Keep music for a video as a separate asset until the user approves it.

## Tool contract

- Pass only the fields the selected model supports. Do not send sound-effect fields such as `duration_seconds`, `loop`, or `prompt_influence`.
- For instrumental work, set `instrumental: true`, send no `lyrics` or `vocal_gender`, and say "instrumental, no vocals" in the style or prompt. For vocals, leave `instrumental` false and describe the vocal role; `vocal_gender` (`m` or `f`) is optional in custom mode.
- Put sounds to avoid in `negative_tags`, for example "spoken word, heavy distortion".
- Describe musical traits, never a named artist, band, song, or copyrighted lyrics.
- Do not invent stem, voice, reference-track, or exact-length parameters. Length is approximate; trim or fade in an editor when the cut must be exact.

## Completion standard

Return the permanent URL of the chosen track and identify the operation, mode (description or custom), vocal or instrumental setting, and intended use. Mention any important mismatch found during review, such as a length far from the target or lyrics that changed.

## Save results to the user's folder

When you can read and write local files (Claude Code, Codex, Cowork and similar), save every finished result as soon as its job completes:

1. Download each output from its permanent URL with `curl --fail -L -o <path> <url>` into the current folder, at `makemancer/<YYYY-MM-DD>/<name>-<NN>.<ext>`, for example `makemancer/2026-11-08/product-ad-01.mp4`.
2. Name the file after what it shows, in a few words in the user's language. Number multiple results of one request in order from `01`. Never overwrite a file: use the next free number.
3. Tell the user the saved path or paths.

Where you cannot write files (Claude.ai, ChatGPT), skip this: the result card has a Download button.
