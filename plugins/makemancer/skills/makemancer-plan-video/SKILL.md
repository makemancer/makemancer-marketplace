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

For worked production flows, read only the relevant recipe: [product ad](references/video/recipe-product-ad.md), [consistent Character scene](references/video/recipe-character-scene.md), [source edit, person replacement and extension](references/video/recipe-source-edit.md), or [house tour from property photos](references/video/recipe-house-tour.md). These explain asset preparation, shot prompting, assembly and output checks, without authorizing extra paid drafts.

## Reference-first pipeline

For a text plan, specify the set, cast, blocking and required frame for each shot and stop there. When the user requests a visual storyboard, produce the frames below. Start video production only when requested.

Prepare the actual opening frame of every new shot before generating motion. Use an existing ready shot frame or make one at the delivery ratio. For a recurring location, reuse or design one set image and establish where everyone stands or sits in a wide frame. Build each shot image from that set, the sheet of every visible recurring Character (create missing sheets), and the established positions. Change the camera angle while preserving eyelines, wardrobe, props and positions unless the action moves them. Send the finished shot image to video as a literal start frame or a model-supported visual reference. Follow [reference production](references/video/reference-production.md) for the exact fields, including the approved start/end-frame route. Show the frames and let the user change them before any video: a still costs a fraction of a clip, and a clip made from text alone invents its own look on every attempt. Generate from text alone only when the user explicitly asks for it. To change existing footage, edit a frame first and send it with the clip, as [source edit](references/video/recipe-source-edit.md) describes; never send the clip with only a text instruction.

Choose the speaking workflow before selecting the general video model. For one visible presenter delivering a recording or a line in a chosen voice, use H3 Max Lip Sync (`video/minimax-h3-max-lip-sync`) with the approved shot image and finished speech; the words come out exactly as recorded. For interacting speakers or a shot driven by body or camera movement, use native dialogue, or Seedance 2.5, Seedance 2.0 Mini or H3 Max with the finished lines as voice references; these perform the lines anew, so check the words, and repair mouths with `lip_sync_video` when the user asks. Gemini Omni 1.2 Flash is the general choice when audio input is unnecessary. Native dialogue, where the model writes the voice itself, needs a language documented for the exact model in `get_model_params`; if it is unsupported or unverified, say so and offer H3 Max Lip Sync. See [voice in video](references/video/voice-in-video.md). When the same Character speaks in more than one clip, make the voice before the first speaking shot and generate every line in it; native dialogue invents a new voice in every clip.

Details: [reference production](references/video/reference-production.md). Image prompting: [image model index](references/images/index.md) and only the chosen guide.

## Plan the story

1. Define objective, audience, channel, aspect ratio, target runtime, brand, required Characters or products, audio approach, and call to action. Give each speaking shot a voice path (native dialogue, speech first, or voiceover) from [voice in video](references/video/voice-in-video.md), and note whose voice it is. A shot where one person says exact lines plans as speech first, then `video/minimax-h3-max-lip-sync` with that shot's image. A person who speaks in several shots gets a saved voice and Character first. Check the requested spoken language in `get_model_params({ model })`. For unsupported or unverified languages, plan the [spoken-language workflow](references/video/spoken-languages.md): one audio-driven talking shot when one is requested; consistent images from the same character references at the requested camera positions, per-shot speech and concatenation when multiple shots are requested. Keep the normal route for documented languages; planning does not authorize these generations.
2. Write a concise beat outline and script. Prefer a clear opening hook, progression, payoff, and ending.
3. Break the piece into shots. Each shot gets one primary action, one camera idea, a start state, end state, dialogue or narration, and a model-supported duration. Keep speech to at most 2.5 spoken words per clip second, with about 0.5 s of air at each end; lock durations from the audio's `wordTimings`. Plan a camera change at every cut. Two shots that join inside a scene differ in shot size (wide, medium, close-up) or angle (about 30° or more, a reverse, high, low, or an insert of a hand or object). Two clips of the same subject from the same framing back to back read as a jump cut: when the action must continue from one camera, make it one longer clip or extend the clip instead of cutting. Cut on action where you can: end a shot mid-movement and start the next on that movement from the new angle. Begin each shot prompt with its shot size and angle, for example "Low-angle close-up: …".
4. Choose likely models with `list_models` and inspect them with `get_model_params`. Duration and reference limits are per model; never impose a universal clip length.

Write the plan in the user's language and preserve approved dialogue or on-screen copy exactly.

## Build the storyboard

For a standalone visual storyboard use `generate_image`. A text-only plan does not require images; reuse approved frames and skip duplicate review boards when unnecessary:

- A review board or contact sheet for fast approval of composition, pacing, and continuity, only when useful.
- One clean, text-free keyframe per shot, made as in the pipeline above. Never feed a labeled grid to a video model.

Preserve Character identity, product geometry, wardrobe, palette, screen direction, time of day, and recurring locations across frames. Use one image model for the whole project, Nano Banana 2 by default.

## Optional Film project

For an intended Film, call `create_film_project`, then save the approved shots with stable IDs in one `update_film_project({ id, shots })` call, using the actual shot fields: `description`, `prompt`, `narration`, `storyboardUrl`, `durationS`, `model`, and `status`. Resume or patch an existing plan with `get_film_project` and `patch_shots`. Set the project to `script_ok` only after script approval and `storyboard_ok` only after storyboard approval. A plan-only request ends with the saved plan.

## Approval gate

Present the requested plan/storyboard and honor review stages and existing approval. Planning alone does not authorize video generation. When production is also requested and its applicable stage is approved, continue with `makemancer-build-film`.

## Save results to the user's folder

When you can read and write local files (Claude Code, Codex, Cowork and similar), save every finished result as soon as its job completes:

1. Download each output from its permanent URL with `curl --fail -L -o <path> <url>` into the current folder, at `makemancer/<YYYY-MM-DD>/<name>-<NN>.<ext>`, for example `makemancer/2026-11-08/product-ad-01.mp4`.
2. Name the file after what it shows, in a few words in the user's language. Number multiple results of one request in order from `01`. Never overwrite a file: use the next free number.
3. Tell the user the saved path or paths.

Where you cannot write files (Claude.ai, ChatGPT), skip this: the result card has a Download button.
