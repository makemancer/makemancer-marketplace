---
name: makemancer-create-avatar
description: "Create a reusable personal avatar or fictional Character from photos or a brief, generate and approve a consistent character sheet, save it in Characters, and optionally give it a voice (designed, cloned with consent, or stock)."
---

# Create your avatar

For each Makemancer tool call that exposes it, pass the optional `skills_used` array with `makemancer-create-avatar`, any other Makemancer skills actually followed, and guide entries in the form `<skill-name>/<relative-guide-path>` (for example, `makemancer-create-avatar/references/workflow-basics.md`). Include only skills and guides followed for that call. Omit attribution if the user declines tracking or the field is unavailable. Never send other plugin names, private data, or local paths.

**Not connected yet?** If no Makemancer tools (such as `list_models` or `generate_image`) are available, the plugin is installed but the server is not connected. Stop and tell the user to open the plugin's **Connectors** tab in Claude (Customize, then Plugins, then Makemancer), press **Connect**, and sign in. In Claude Code they run `/mcp` instead. Then they ask again. Do not substitute other tools or describe a result that was not generated.

Use this for a reusable identity, not an ordinary one-off portrait. Read [shared execution guidance](references/workflow-basics.md), [upload routing](references/platform-upload.md), and [avatar and character-sheet production](references/avatars/identity.md).

## Create and save

1. Search list_characters for an existing match. Reuse its ID when updating the same avatar; do not create duplicates.
2. For a personal avatar, ask for a few clear photos, ideally a front face, three-quarter/side view and useful body/wardrobe view. Use available photos if sufficient; do not demand a fixed count or invent unseen personal details. For a fictional Character, use the approved brief instead.
3. Import attached/local photos using the appropriate client route. Choose the strongest face anchor and assign other photos explicit identity, proportions or wardrobe roles.
4. Use generate_image and current model parameters to create one consistent character-sheet direction. The identity reference explains layout and prompting. Preserve approved likeness rather than beautifying or redesigning the person.
5. Show the completed sheet and ask for likeness/canonical-state approval before saving it as the Character visual. Honor approval already given for that exact result.
6. Save using `create_character({ title, description, image_url })`, or `update_character` with `id` plus changed fields for an existing Character. The description records stable appearance, not a temporary scene. Save the approved sheet as the canonical image and retain a clean face portrait and other views as named assets for downstream use. For a real person, keep their best original photo as an extra identity reference beside the sheet; generated sheets drift. Later video keyframes use one image model for the whole project (default `image/nano-banana-2`); the sheet stays a valid anchor whichever model made it.
7. Return the saved Character ID/name and explain that future requests can name it. State what was saved and any likeness limitations. Do not claim a trained visual identity model or guaranteed consistency.

## Optional voice

When the Character will speak and the voice is unknown, ask one question: design a new voice from a description (three auditions), use your own voice (recording plus consent), or pick a stock voice (`search_voices`). If the voice doesn't matter, pick a stock voice and name it. Save every choice to the SAME character_id.

- **Design** (fictional Character, or a voice that isn't the user's own): use `design_voice` and save the chosen preview to the SAME character_id; no recording or cloning consent is needed. Auditions use the Character's real lines. In ChatGPT the Voice Studio card saves the choice; read it back from `list_characters` rather than saving again. See [voice design](references/voices/voice-design.md).
- **Own voice:** use makemancer-clone-voice when available, or the packaged [cloning workflow](references/voices/cloning.md). Without an audio file, call `clone_voice({ character_id })`: it clones nothing and returns the consent statement and the upload routes in `recoveryOptions`. Then follow them: one up-front ask for speaker consent and the recording's language, at least one minute of clean recording, private upload, cloning right after it and a short audition. Never infer cloning permission from photos, uploads or avatar creation. Cloning again replaces the Character's clone and needs explicit direction.
- **Stock:** pick one with `search_voices` (or an exact voice ID from `get_model_params`), then `update_character({ id, voice_model, voice_id })`.

Each saved voice speaks with its own model: designed and cloned voices (Fish) → `speech/fish-drama-3`; stock → its saved model. Read the selected [Fish](references/voices/fish.md), [v4](references/voices/elevenlabs-v4.md) or [v2](references/voices/elevenlabs-v2.md) guide and [language routing](references/voices/languages.md).

## Reuse

For identity-guided images, resolve the sheet/portrait into the selected model's supported reference fields. For video, make a clean keyframe per shot from the sheet and portrait; a sheet grid is never a literal opening frame. `character_id` appends the saved image to `image_urls` as a reference, never a start frame. Use it in reference mode; omit it with `image_url`/`last_frame_url` (the server rejects that mix).

Visual and voice reuse are separate: a Character ID does not put its saved voice into native video dialogue. For speech in video, pick a path from [voice in video](references/video/voice-in-video.md).

## Save results to the user's folder

When you can read and write local files (Claude Code, Codex, Cowork and similar), save every finished result as soon as its job completes:

1. Download each output from its permanent URL with `curl --fail -L -o <path> <url>` into the current folder, at `makemancer/<YYYY-MM-DD>/<name>-<NN>.<ext>`, for example `makemancer/2026-11-08/product-ad-01.mp4`.
2. Name the file after what it shows, in a few words in the user's language. Number multiple results of one request in order from `01`. Never overwrite a file: use the next free number.
3. Tell the user the saved path or paths.

Where you cannot write files (Claude.ai, ChatGPT), skip this: the result card has a Download button.
