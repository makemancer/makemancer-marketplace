---
name: makemancer-plan-video
description: "Plan a video as an approved script, shot list, and storyboard with clean generation references. Use before costly multi-shot work, when continuity matters, or when the user asks to storyboard without producing a final film yet."
---

# Plan Video

For each Makemancer tool call that exposes it, pass the optional `skills_used` array with `makemancer-plan-video`, any other Makemancer skills actually followed, and guide entries in the form `<skill-name>/<relative-guide-path>` (for example, `makemancer-plan-video/references/workflow-basics.md`). Include only skills and guides followed for that call. Omit attribution if the user declines tracking or the field is unavailable. Never send other plugin names, private data, or local paths.

**Not connected yet?** If no Makemancer tools (such as `list_models` or `generate_image`) are available, the plugin is installed but the server is not connected. Stop and tell the user to open the plugin's **Connectors** tab in Claude (Customize, then Plugins, then Makemancer), press **Connect**, and sign in. In Claude Code they run `/mcp` instead. Then they ask again. Do not substitute other tools or describe a result that was not generated.

Read [video model selection](references/video/index.md) when choosing shot models. Load a specific model guide only when planning its timing, references or controls. These references are packaged locally; no sibling model skill is required. Planning alone does not authorize video generation.

Read [shared execution guidance](references/workflow-basics.md) once per task before using tools. It covers existing authorization, model discovery, optional cost checks, imports, and recovery.

Convert a concept into an execution-ready video plan before spending on clips. This skill stops at an approved plan or storyboard unless the user also asks for production.

For worked production flows, read only the relevant recipe: [product ad](references/video/recipe-product-ad.md), [consistent Character scene](references/video/recipe-character-scene.md), or [source edit, person replacement and extension](references/video/recipe-source-edit.md). These explain asset preparation, shot prompting, assembly and output checks, without authorizing extra paid drafts.

## Reference-first pipeline

Unless the user asked for direct text-to-video, supplied a ready shot image, or is editing footage, follow this before `generate_video`. For a planning-only request, show the plan and stop: make keyframes only when the user asked for a visual storyboard, and do not call `generate_video`. New clips start from one keyframe image per shot, so the video model animates images the user has seen instead of inventing the face, product, outfit or location: tell the user how many images that is before making them.

1. Anchors, reuse first: `search_assets`, `list_characters`, `get_theme`. Person: Character sheet + face portrait (real person: also their best original photo). Product: real photo or packshot, plus a label/logo close-up when text matters. A recurring person or product with no anchor: create it first (makemancer-create-avatar, makemancer-product-photoshoot).
2. Look line: one sentence (palette, light, lens, medium), pasted into every keyframe and video prompt.
3. Keyframe per shot: `generate_image` with the same image model all project (default `image/nano-banana-2`), `aspect_ratio` = the video's ratio, main anchor in `image_url`, others in `extras.image_urls`, roles named. From shot 2 on, add the first approved keyframe (and the previous one when the scene continues) as a look reference alongside the anchors. Earlier keyframes set the look and place only: name this shot's own shot size and angle in the prompt, or the image copies their framing. One clean full-bleed frame; no text, grid or labels.
4. Compare it to the anchors (face, label, logo, colors); fix with one targeted edit.
5. Show keyframes and the plan (model, duration, ratio) in one message. Review mode: call `generate_video` now; the card is the approval. Auto: ask once unless the user said go.
6. One mode per shot. People, several subjects or big motion: `image_urls` = [keyframe, identity anchor, product anchor], 2–4 total; `character_id` is fine here. Exact opening (product hero, logo reveal): `image_url` = keyframe, no `image_urls` or `character_id`.
7. Next shot: same anchors and look line, plus the earlier keyframes as references. A previous clip's last frame is only an extra composition cue.

Details: [reference production](references/video/reference-production.md). Image prompting: [image model index](references/images/index.md) and only the chosen guide.

## Plan the story

1. Define objective, audience, channel, aspect ratio, target runtime, brand, required Characters or products, audio approach, and call to action. Give each speaking shot a voice path (native dialogue, speech first, or voiceover) from [voice in video](references/video/voice-in-video.md), and note whose voice it is. A shot where one person says exact lines plans as speech first, then `video/minimax-h3-max-lip-sync` with that shot's image. A person who speaks in several shots gets a saved voice and Character first. Check the requested spoken language in `get_model_params({ model })`. For unsupported or unverified languages, plan the [spoken-language workflow](references/video/spoken-languages.md): one audio-driven talking shot when one is requested; consistent images from the same character references at the requested camera positions, per-shot speech and concatenation when multiple shots are requested. Keep the normal route for documented languages; planning does not authorize these generations.
2. Write a concise beat outline and script. Prefer a clear opening hook, progression, payoff, and ending.
3. Break the piece into shots. Each shot gets one primary action, one camera idea, a start state, end state, dialogue or narration, and a model-supported duration. Keep speech to at most 2.5 spoken words per clip second, with about 0.5 s of air at each end; lock durations from the audio's `wordTimings`. Plan a camera change at every cut. Two shots that join inside a scene differ in shot size (wide, medium, close-up) or angle (about 30° or more, a reverse, high, low, or an insert of a hand or object). Two clips of the same subject from the same framing back to back read as a jump cut: when the action must continue from one camera, make it one longer clip or extend the clip instead of cutting. Cut on action where you can: end a shot mid-movement and start the next on that movement from the new angle. Begin each shot prompt with its shot size and angle, for example "Low-angle close-up: …".
4. Choose likely models with `list_models` and inspect them with `get_model_params`. Duration and reference limits are per model; never impose a universal clip length.

Write the plan in the user's language and preserve approved dialogue or on-screen copy exactly.

## Build the storyboard

For a visual storyboard request, create the needed artifacts with `makemancer-generate-image`. A text-only plan does not require images; reuse approved frames and skip duplicate review boards when unnecessary:

- A review board or contact sheet for fast approval of composition, pacing, and continuity, only when useful.
- One clean, text-free keyframe per shot, made as in the pipeline above. Never feed a labeled grid to a video model.

Preserve Character identity, product geometry, wardrobe, palette, screen direction, time of day, and recurring locations across frames. Use one image model for the whole project, Nano Banana 2 by default.

## Optional Film project

If the user intends to continue into production, call `create_film_project` and persist the approved shots with `update_film_project`. Use stable shot IDs and the actual tool fields: `description`, `prompt`, `narration`, `storyboardUrl`, `durationS`, `model`, and `status`. Set the project to `script_ok` only after script approval and `storyboard_ok` only after storyboard approval.

## Approval gate

Present the requested plan/storyboard and honor review stages and existing approval. Planning alone does not authorize video generation. When production is also requested and its applicable stage is approved, continue with `makemancer-build-film`.

## Save results to the user's folder

When you can read and write local files (Claude Code, Codex, Cowork and similar), save every finished result as soon as its job completes:

1. Download each output from its permanent URL with `curl --fail -L -o <path> <url>` into the current folder, at `makemancer/<YYYY-MM-DD>/<name>-<NN>.<ext>`, for example `makemancer/2026-11-08/product-ad-01.mp4`.
2. Name the file after what it shows, in a few words in the user's language. Number multiple results of one request in order from `01`. Never overwrite a file: use the next free number.
3. Tell the user the saved path or paths.

Where you cannot write files (Claude.ai, ChatGPT), skip this: the result card has a Download button.
