---
name: makemancer-build-film
description: "Produce a complete multi-shot Makemancer film from planning through an assembled first cut. Use for ads, explainers, music videos, or stories that require several coordinated clips, narration, and approval gates."
---

# Build Film

For each Makemancer tool call that exposes it, pass the optional `skills_used` array with `makemancer-build-film`, any other Makemancer skills actually followed, and guide entries in the form `<skill-name>/<relative-guide-path>` (for example, `makemancer-build-film/references/workflow-basics.md`). Include only skills and guides followed for that call. Omit attribution if the user declines tracking or the field is unavailable. Never send other plugin names, private data, or local paths.

**Not connected yet?** If no Makemancer tools (such as `list_models` or `generate_image`) are available, the plugin is installed but the server is not connected. Stop and tell the user to open the plugin's **Connectors** tab in Claude (Customize, then Plugins, then Makemancer), press **Connect**, and sign in. In Claude Code they run `/mcp` instead. Then they ask again. Do not substitute other tools or describe a result that was not generated.

Read [video model selection](references/video/index.md), then only the selected model's guide. Model families are covered locally, with live-schema guidance for additional models; do not load every guide or require a sibling model skill. Read [Review/Auto handling](references/video/review.md) before submission.

Read [shared execution guidance](references/workflow-basics.md) once per task before using tools. It covers existing authorization, model discovery, optional cost checks, imports, and recovery.

Run a stateful, multi-shot production with explicit approvals. Use `makemancer-generate-video` for a single clip and `makemancer-plan-video` when the user wants planning only. When the user explicitly asks for motion graphics, kinetic typography or an animated explainer instead of filmed-looking footage, use `makemancer-render-html`.

For worked production flows, read only the relevant recipe: [product ad](references/video/recipe-product-ad.md), [consistent Character scene](references/video/recipe-character-scene.md), or [source edit, person replacement and extension](references/video/recipe-source-edit.md). These explain asset preparation, shot prompting, assembly and output checks, without authorizing extra paid drafts.

## Reference-first pipeline

Unless the user asked for direct text-to-video, supplied a ready shot image, or is editing footage, follow this before `generate_video`. New clips start from one keyframe image per shot, so the video model animates images the user has seen instead of inventing the face, product, outfit or location: tell the user how many images that is before making them.

1. Anchors, reuse first: `search_assets`, `list_characters`, `get_theme`. Person: Character sheet + face portrait (real person: also their best original photo). Product: real photo or packshot, plus a label/logo close-up when text matters. A recurring person or product with no anchor: create it first (makemancer-create-avatar, makemancer-product-photoshoot).
2. Look line: one sentence (palette, light, lens, medium), pasted into every keyframe and video prompt.
3. Keyframe per shot: `generate_image` with the same image model all project (default `image/nano-banana-2`), `aspect_ratio` = the video's ratio, main anchor in `image_url`, others in `extras.image_urls`, roles named. From shot 2 on, add the first approved keyframe (and the previous one when the scene continues) as a look reference alongside the anchors. Earlier keyframes set the look and place only: name this shot's own shot size and angle in the prompt, or the image copies their framing. One clean full-bleed frame; no text, grid or labels.
4. Compare it to the anchors (face, label, logo, colors); fix with one targeted edit.
5. Show keyframes and the plan (model, duration, ratio) in one message. Review mode: call `generate_video` now; the card is the approval. Auto: ask once unless the user said go.
6. One mode per shot. People, several subjects or big motion: `image_urls` = [keyframe, identity anchor, product anchor], 2–4 total; `character_id` is fine here. Exact opening (product hero, logo reveal): `image_url` = keyframe, no `image_urls` or `character_id`.
7. Next shot: same anchors and look line, plus the earlier keyframes as references. A previous clip's last frame is only an extra composition cue.

Details: [reference production](references/video/reference-production.md). Image prompting: [image model index](references/images/index.md) and only the chosen guide.

## 1. Create and plan

1. Use `list_film_projects` and `get_film_project` to resume an existing project when appropriate; otherwise call `create_film_project` with the name, brief, Character IDs, theme, and target duration.
2. Follow `makemancer-plan-video` to create the script, shot list, model plan, and storyboard. Give every cut inside a scene a new shot size or angle, and start each shot's `prompt` with them ("High wide shot: …"). Two clips from the same framing back to back jump; make that action one longer or extended clip instead.
3. Save stable shot IDs and patch the project with `update_film_project`. Do not replace approved fields accidentally.
4. Honor script and storyboard review stages, including approval already given or explicit instructions to proceed through them. Advance `drafting`, `script_ok`, and `storyboard_ok` truthfully.
5. The user reads each shot's `description` as its title and the `logline` under the film's name: keep the title to a few words and the logline to one sentence. Keep your own working notes (job ids, costs, checks, progress) out of titles, the logline and prompts.

## 2. Establish timing and audio

Read each selected model's spoken-language guidance in `get_model_params({ model })`. For unsupported or unverified dialogue languages, follow [spoken languages](references/video/spoken-languages.md): build each requested camera view from the same character references, lip-sync its image to its speech segment, then concatenate while keeping the clip audio. A single talking face remains one generation within duration limits. Documented languages keep the normal workflow.

When a Character speaks and the voice is unknown, ask one question: design a new voice from a description (`design_voice`, three auditions), use your own voice (recording plus consent, makemancer-clone-voice), or pick a stock voice (`search_voices`). If the voice doesn't matter, pick a stock voice and name it. Design auditions use the Character's real lines. In ChatGPT the Voice Studio card saves the choice; read it back from `list_characters` rather than saving again.

Pick one voice path per speaking shot from [voice in video](references/video/voice-in-video.md). Gemini Omni, the default, accepts no audio: native dialogue there, or route exact-voice shots elsewhere. A shot where one person says exact lines goes to `video/minimax-h3-max-lip-sync` with its shot image and the finished line; other exact-voice shots go to an audio-capable model with a check of the delivered words, or to `lip_sync_video` on a finished clip. Preserve an explicit model choice. When a person speaks across shots, save them with their voice as a Character before the first speaking shot. Generate or reuse speech with `makemancer-generate-voiceover` before locking shot durations: at most 2.5 words per clip second, about 0.5 s of air at each end, lengths from the audio's `wordTimings`. Do not add separate narration to native-dialogue clips unless requested.

Keep continuous sound out of the clips, or every join is audible: each clip invents its own wind, room tone or score. Prompt shots only for dialogue and sounds tied to the picture (footsteps, a door, a key), ending with "no music, no background ambience, no room tone, no transition sounds"; a shot with nothing to sync is silent. Make one ambience bed per scene with `makemancer-generate-sound-effects` (a seamless loop) and, when requested, one score or song for the film with `makemancer-generate-music`; both are laid under the assembled cut (step 4).

When the user asks about cost or supplies a budget, estimate supported planned generations and total them; identify processing costs excluded by `estimate_generation`. Share the total, then continue with the production the user approved.

## 3. Generate shots

1. Keep approval state truthful. In Review mode, a shot is rendering only after the user submits its card. Honor a separately requested storyboard checkpoint.
2. For each shot, read the selected local model guide, check current parameters, and call `generate_video` with the approved prompt, model and duration, in one input mode (pipeline step 6).
3. Maintain Character and product continuity through the same anchors. `character_id` appends the saved image to `image_urls` as a reference, never a start frame. Use it in reference mode; omit it with `image_url`/`last_frame_url` (the server rejects that mix).
4. On `status: awaiting_approval`, keep the shot's `request_id` and pause that shot until the user presses Generate in its card; the card reports the finished job to you. Resolve submitted jobs needed for assembly with `check_job`, inspect every clip, and write each approved `clipUrl` back to its shot.

## 4. Combine audio and clips

Use the narration prepared for timing. Read [media-assembly.md](references/media-assembly.md) before combining tracks or clips.

- Per-shot audio: `add_audio_to_video` with `audio_mode: "mix"` keeps the shot's own sound and layers the new track at the clip's length (`original_volume`, `added_volume` 0–1; about 0.3 for music under speech). The default `audio_mode: "replace"` discards the shot's audio and ends at the shorter input. Save the result as the shot's `clipUrl` with `patch_shots`.
- Project narration: set it with `update_film_project({ id, audio_url })`. `assemble_film` narration replaces every shot's audio; use `with_narration: false` when shots carry dialogue, then layer narration or music over the cut with `audio_mode: "mix"`.
- Ambience and music: lay them under the assembled cut, not into a clip. One looping bed per scene (`generate_sound_effect` with `loop: true`, lengthened with `merge_media` `audio_urls`), then music, each with `add_audio_to_video` `audio_mode: "mix"` (the bed at `added_volume` about 0.3, music about 0.2 under speech). Read [media-assembly.md](references/media-assembly.md) under seamless sound. Listen to every join; a background that changes at a cut means a clip still carries its own bed.

## 5. Assemble and approve

1. Verify that every intended shot has an approved `clipUrl` in order.
2. Call `assemble_film` with `mode: "connect"` by default. It preserves every clip and reports target-duration overage as a warning. Use `mode: "cut_end"` only when the user wants the fully assembled output trimmed at `target_duration_s`.
3. Resolve the queued job with `check_job`. Only the completed URL is the first cut; completion saves the project's `assembled_url` and `preview_ok`. Verify playback order, full duration, and audio.
4. When the user requests opening or closing bookends, use `makemancer-edit-media` after the first cut exists. That workflow may offer HTML-rendered cards, but it must not call `render_html_video` unless the user explicitly chooses HTML/HyperFrames/code-driven rendering.
5. Assembly adds no transitions, captions or sound design; make those with the editing tools.
6. Set `preview_ok` when the first cut exists. Set `final` only after the user has reviewed and approved it.

## Recovery

Resume from saved project state rather than regenerating approved media. If a shot fails or has a quality issue, report the problem and propose a repair. Require explicit authorization before another generation attempt for that shot; approval of the film or storyboard alone does not authorize replacement takes. After an authorized replacement succeeds, patch only that shot's URL. Do not restart the full film. Never claim completion from queued job IDs.

## Save results to the user's folder

When you can read and write local files (Claude Code, Codex, Cowork and similar), save every finished result as soon as its job completes:

1. Download each output from its permanent URL with `curl --fail -L -o <path> <url>` into the current folder, at `makemancer/<YYYY-MM-DD>/<name>-<NN>.<ext>`, for example `makemancer/2026-11-08/product-ad-01.mp4`.
2. Name the file after what it shows, in a few words in the user's language. Number multiple results of one request in order from `01`. Never overwrite a file: use the next free number.
3. Tell the user the saved path or paths.

Where you cannot write files (Claude.ai, ChatGPT), skip this: the result card has a Download button.
