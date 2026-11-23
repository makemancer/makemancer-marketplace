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

For worked production flows, read only the relevant recipe: [product ad](references/video/recipe-product-ad.md), [consistent Character scene](references/video/recipe-character-scene.md), [source edit, person replacement and extension](references/video/recipe-source-edit.md), or [house tour from property photos](references/video/recipe-house-tour.md). These explain asset preparation, shot prompting, assembly and output checks, without authorizing extra paid drafts.

## Reference-first pipeline

Prepare the actual opening frame of every new shot before generating motion. Use an existing ready shot frame or make one at the delivery ratio. For a recurring location, reuse or design one set image and establish where everyone stands or sits in a wide frame. Build each shot image from that set, the sheet of every visible recurring Character (create missing sheets), and the established positions. Change the camera angle while preserving eyelines, wardrobe, props and positions unless the action moves them. Send the finished shot image to video as a literal start frame or a model-supported visual reference. Follow [reference production](references/video/reference-production.md) for the exact fields, including the approved start/end-frame route. Show the frames and let the user change them before any video: a still costs a fraction of a clip, and a clip made from text alone invents its own look on every attempt. Generate from text alone only when the user explicitly asks for it. To change existing footage, edit a frame first and send it with the clip, as [source edit](references/video/recipe-source-edit.md) describes; never send the clip with only a text instruction.

Group recurring locations by scene: every shot of a scene reuses its approved set image and the sheets of the visible cast, and each shot's prompt describes where they stand.

Choose the speaking workflow before selecting the general video model. For one visible presenter delivering a recording or a line in a chosen voice, use H3 Max Lip Sync (`video/minimax-h3-max-lip-sync`) with the approved shot image and finished speech; the words come out exactly as recorded. For interacting speakers or a shot driven by body or camera movement, use native dialogue, or Seedance 2.5, Seedance 2.0 Mini or H3 Max with the finished lines as voice references; these perform the lines anew, so check the words, and repair mouths with `lip_sync_video` when the user asks. Gemini Omni 1.2 Flash is the general choice when audio input is unnecessary. Native dialogue, where the model writes the voice itself, needs a language documented for the exact model in `get_model_params`; if it is unsupported or unverified, say so and offer H3 Max Lip Sync. See [voice in video](references/video/voice-in-video.md). When the same Character speaks in more than one clip, make the voice before the first speaking shot and generate every line in it; native dialogue invents a new voice in every clip.

Details: [reference production](references/video/reference-production.md). Image prompting: [image model index](references/images/index.md) and only the chosen guide.

## 1. Create and plan

1. Use `list_film_projects` and `get_film_project` to resume an existing project when appropriate; otherwise call `create_film_project` with the name, brief, Character IDs, theme, and target duration.
2. Follow `makemancer-plan-video` for the script, shot list, model plan and storyboard, then save the shot list with stable shot IDs in one `update_film_project({ id, shots })` call. Give every cut inside a scene a new shot size or angle, and start each shot's `prompt` with them ("High wide shot: …"). Two clips from the same framing back to back jump; make that action one longer or extended clip instead.
3. Edit the plan with `update_film_project` (`patch_shots` by id, or `shots` to insert, delete or reorder). Do not replace approved fields accidentally. Edits don't show the film: call `get_film_project` when the user should see it, once after a set of edits rather than after each one.
4. Honor script and storyboard review stages, including approval already given or explicit instructions to proceed through them. Advance `drafting`, `script_ok`, and `storyboard_ok` truthfully.
5. The user reads each shot's `description` as its title and the `logline` under the film's name: keep the title to a few words and the logline to one sentence. Keep your own working notes (job ids, costs, checks, progress) out of titles, the logline and prompts.

## 2. Establish timing and audio

Native dialogue needs a language documented in `get_model_params({ model })`. When it is unsupported or unverified, say so and offer H3 Max Lip Sync: make the lines first, then `video/minimax-h3-max-lip-sync` for one face in view, or `lip_sync_video` on the finished clip.

When a Character speaks and the voice is unknown, ask one question: design a new voice from a description (`design_voice`, three auditions), use your own voice (recording plus consent, makemancer-clone-voice), or pick a stock voice (`search_voices`). If the voice doesn't matter, pick a stock voice and name it. Pass one of the Character's lines (up to 150 characters) as the audition `text`. In ChatGPT the Voice Studio card saves the choice; read it back from `list_characters` rather than saving again.

Pick one voice path per speaking shot from [voice in video](references/video/voice-in-video.md). Gemini Omni, the default, accepts no audio: native dialogue there, or route exact-voice shots elsewhere. A shot where one person says exact lines goes to `video/minimax-h3-max-lip-sync` with its shot image and the finished line; other voiced scenes go to Seedance 2.5, Seedance 2.0 Mini or H3 Max with the lines in `audio_urls` as voice references, which perform them anew, so check the words. Preserve an explicit model choice. When a person speaks across shots, save them with their voice as a Character before the first speaking shot. Reuse a supplied recording as it is, or generate each new line once with `generate_speech` in the saved voice. Use their actual timings before rendering clips: at most 2.5 words per clip second, about 0.5 s of air at each end, lengths from the audio's `wordTimings`. Do not add separate narration to native-dialogue clips unless requested. If the user says a word sounds wrong (the stress, an acronym, a homograph or a loanword), fix only that word as [pronunciation](references/voices/pronunciation.md) describes and regenerate before suggesting feedback.

Render the clips once the lines exist. Seedance 2.5, Seedance 2.0 Mini and H3 Max take each shot's lines in `audio_urls` as voice references and perform them anew; any other model gets them laid over the clip, without matching mouths. Write each speaking shot's `prompt` as a timed shot plan for the whole clip, with the camera moving in every beat and the speaker's mouth in view while they talk, and keep its last beat, after the last line, silent: "nobody speaks", with any sound effect timed there. For an Omni clip with exact approved first and last frames, keep the sheets upstream and reuse the literal frames without reference arrays. Check the speaker, the words and the mouth timing. When a line changes, make the new line and redo that shot's clip. Run `lip_sync_video` on a finished clip only when the user asks for lip sync, and offer H3 Max Lip Sync when matching mouths matter for one face.

Keep continuous sound out of the clips, or every join is audible: each clip invents its own wind, room tone or score. Prompt shots only for dialogue and sounds tied to the picture (footsteps, a door, a key), ending with "no music, no background ambience, no room tone, no transition sounds"; a shot with nothing to sync is silent. Make one ambience bed per scene with `makemancer-generate-sound-effects` (a seamless loop) and, when requested, one score or song for the film with `makemancer-generate-music`; both go on the film's timeline as audio tracks (step 4).

When the user asks about cost or supplies a budget, estimate supported planned generations and total them; identify processing costs excluded by `estimate_generation`. Share the total, then continue with the production the user approved.

## 3. Generate shots

1. Keep approval state truthful. In Review mode, a shot is rendering only after the user submits its card. Honor a separately requested storyboard checkpoint.
2. For each shot, read the selected local model guide, check current parameters, and call `generate_video` with the approved prompt, model, duration and resolution, in one input mode.
3. Maintain Character and product continuity through the same anchors. `character_id` appends the saved image to `image_urls` as a reference, never a start frame. Use it in reference mode; omit it with `image_url`/`last_frame_url` (the server rejects that mix).
4. On `status: awaiting_approval`, keep the shot's `request_id` and pause that shot until the user presses Generate in its card; the card reports the finished job to you. Resolve finished work with `check_job`, inspect each clip, and report problems per shot. Attach each approved clip to its shot with `update_film_project({ id, add_take: { shot_id, job_id } })`; it becomes the shot's `clipUrl`. A storyboard frame attaches the same way, with `kind` set to storyboard. A clip from outside the library is imported first with `upload_asset` or `import_media`.

## 4. Combine audio and clips

Use the narration prepared for timing. Read [media-assembly.md](references/media-assembly.md) before combining tracks or clips.

- Per-shot audio: `add_audio_to_video` with `audio_mode: "mix"` keeps the shot's own sound and layers the new track at the clip's length (`original_volume`, `added_volume` 0–1; about 0.3 for music under speech). The default `audio_mode: "replace"` discards the shot's audio and ends at the shorter input. Attach the result to its shot with `add_take` (`url` set to the mixed clip).
- Project narration: set it with `update_film_project({ id, audio_url })`. `assemble_film` narration replaces every shot's audio; use `with_narration: false` when shots carry dialogue, then layer narration or music over the cut with `audio_mode: "mix"`.
- Ambience, music, narration and timed effects: put each on the film's timeline as an audio track, not into a clip. Call the generator with `film_track: { film_id, kind, label, start or at: { shot_id, offset_s }, volume, loop, duck }` and the result lands on the timeline by itself; attach audio you already have with `update_film_project` `add_tracks` (import an outside link first with `upload_asset` or `import_media`), move or re-level it with `patch_tracks` and take it off with `remove_tracks`. One looping bed per location (`loop: true`, volume about 0.3, ducked), music at about 0.2 under speech, effects `at` the shot they belong to so they move with it. Read the result's `timeline` for each shot's start and end before placing a sound. The film card lists the tracks, and `assemble_film` renders the mix. Read [media-assembly.md](references/media-assembly.md) under seamless sound. Listen to every join; a background that changes at a cut means a clip still carries its own bed.
- Several narration lines over continuous music: put each line on the timeline as its own narration track and one music track under all of them, ducked (`duck`). Never cut an already mixed soundtrack into pieces and join them: the music jumps at every join.
- Narration cut from footage that already has music under it: cut that excerpt out with `trim_video`, run `isolate_audio` on it and put the clean voice on the timeline, or the old music plays under the new score.
- The clips' own sound: `defaults: { clip_volume }` (0–1) lowers it under the tracks and `defaults: { clip_muted: true }` silences it; a shot's `clip_muted` silences one clip, for example one that already says a line that is also on the timeline.

## 5. Assemble and export

1. Call `get_film_project` and verify that every intended shot has an approved `clipUrl` in order. Clips and tracks must be assets in the user's library; import an outside link with `upload_asset` or `import_media` first. The film card lists the audio tracks; the cut with the tracks mixed in comes from the export.
2. When every intended shot has a clip, call `assemble_film` with `mode: "connect"` by default (exporting is free, so export again after a change; it mixes the audio tracks, ducking them under narration and dialogue); `mode: "cut_end"` only when the user wants the output trimmed at `target_duration_s`.
3. Resolve the queued job with `check_job`. Only the completed URL is the cut; completion saves the project's `assembled_url` and `preview_ok`. Verify playback order, full duration and audio, and relay any warning about tracks left out.
4. When the user requests opening or closing bookends, use `makemancer-edit-media` after the cut exists. That workflow may offer HTML-rendered cards, but it must not call `render_html_video` unless the user explicitly chooses HTML/HyperFrames/code-driven rendering.
5. Assembly adds no transitions, captions or sound design; make those with the editing tools.
6. Set `preview_ok` when the first cut exists. Set `final` only after the user has reviewed and approved it.

## Recovery

Resume from saved project state rather than regenerating approved media. If a shot fails or has a quality issue, report the problem and propose a repair. Require explicit authorization before another generation attempt for that shot; approval of the film or storyboard alone does not authorize replacement takes. After an authorized replacement succeeds, attach only that shot's new clip with `add_take`. Do not restart the full film. Never claim completion from queued job IDs.

## Save results to the user's folder

When you can read and write local files (Claude Code, Codex, Cowork and similar), save every finished result as soon as its job completes:

1. Download each output from its permanent URL with `curl --fail -L -o <path> <url>` into the current folder, at `makemancer/<YYYY-MM-DD>/<name>-<NN>.<ext>`, for example `makemancer/2026-11-08/product-ad-01.mp4`.
2. Name the file after what it shows, in a few words in the user's language. Number multiple results of one request in order from `01`. Never overwrite a file: use the next free number.
3. Tell the user the saved path or paths.

Where you cannot write files (Claude.ai, ChatGPT), skip this: the result card has a Download button.
