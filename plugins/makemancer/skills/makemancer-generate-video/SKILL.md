---
name: makemancer-generate-video
description: "Generate, animate, extend, reframe, or transform one video clip with Makemancer. Use for a clear single-clip request when the user has not asked for a storyboard, UGC ad, or complete multi-shot film."
---

# Generate Video

For each Makemancer tool call that exposes it, pass the optional `skills_used` array with `makemancer-generate-video`, any other Makemancer skills actually followed, and guide entries in the form `<skill-name>/<relative-guide-path>` (for example, `makemancer-generate-video/references/workflow-basics.md`). Include only skills and guides followed for that call. Omit attribution if the user declines tracking or the field is unavailable. Never send other plugin names, private data, or local paths.

**Not connected yet?** If no Makemancer tools (such as `list_models` or `generate_image`) are available, the plugin is installed but the server is not connected. Stop and tell the user to open the plugin's **Connectors** tab in Claude (Customize, then Plugins, then Makemancer), press **Connect**, and sign in. In Claude Code they run `/mcp` instead. Then they ask again. Do not substitute other tools or describe a result that was not generated.

Read [video model selection](references/video/index.md), then only the selected model's guide. Model families are covered locally, with live-schema guidance for additional models; do not load every guide or require a sibling model skill. For Kling 4, use [the Kling 4 prompting reference](references/video/kling-4.md) for reference roles, timed scenes, dialogue, source edits and the exact integration limits. Read [Review/Auto handling](references/video/review.md) before submission.

Read [shared execution guidance](references/workflow-basics.md) once per task before using tools. It covers existing authorization, model discovery, optional cost checks, imports, and recovery.

Create one controlled video clip from an approved start frame, an optional end frame or other model-supported references; from text alone only when the user asks for that. Use the planning, UGC, or film skills when the deliverable is a larger production. Use `makemancer-render-html` only when the user explicitly requests HTML/HyperFrames/code-driven rendering, or motion graphics, kinetic typography or animated titles instead of filmed-looking footage; use `makemancer-edit-media` for video bookends.

For a permanent watermark on a finished video or a sequence assembled from existing images, video clips, and optional audio, use `overlay_images` or `stitch_clips` through `makemancer-edit-media`; neither generates footage. Read [assembly guidance](references/media-assembly.md). Preserve the existing media instead of generating replacement footage.

For worked production flows, read only the relevant recipe: [product ad](references/video/recipe-product-ad.md), [consistent Character scene](references/video/recipe-character-scene.md), [source edit, person replacement and extension](references/video/recipe-source-edit.md), or [house tour from property photos](references/video/recipe-house-tour.md). These explain asset preparation, shot prompting, assembly and output checks, without authorizing extra paid drafts.

For “the same movement,” a copied performance, or a wardrobe variant that should retain an earlier animation, read [motion transfer](references/video/motion-transfer.md) before model selection or image preparation. Resolve the driving video first.

## Reference-first pipeline

Prepare the actual opening frame of every new shot before generating motion. Use an existing ready shot frame or make one at the delivery ratio. For a recurring location, reuse or design one set image and establish where everyone stands or sits in a wide frame. Build each shot image from that set, the sheet of every visible recurring Character (create missing sheets), and the established positions. Change the camera angle while preserving eyelines, wardrobe, props and positions unless the action moves them. Send the finished shot image to video as a literal start frame or a model-supported visual reference. Follow [reference production](references/video/reference-production.md) for the exact fields, including the approved start/end-frame route. Edit any incorrect lettering or logo on the anchor image before animation. Show the frames and let the user change them before any video: a still costs a fraction of a clip, and a clip made from text alone invents its own look on every attempt. Generate from text alone only when the user explicitly asks for it. To change existing footage, edit a frame first and send it with the clip, as [source edit](references/video/recipe-source-edit.md) describes; never send the clip with only a text instruction.

Choose the speaking workflow before selecting the general video model. For one visible presenter delivering a recording or a line in a chosen voice, use H3 Max Lip Sync (`video/minimax-h3-max-lip-sync`) with the approved shot image and finished speech; the words come out exactly as recorded. For interacting speakers or a shot driven by body or camera movement, use native dialogue, or Seedance 2.5, Seedance 2.0 Mini or H3 Max with the finished lines as voice references; these perform the lines anew, so check the words, and repair mouths with `lip_sync_video` when the user asks. Gemini Omni 1.2 Flash is the general choice when audio input is unnecessary. Native dialogue, where the model writes the voice itself, needs a language documented for the exact model in `get_model_params`; if it is unsupported or unverified, say so and offer H3 Max Lip Sync. See [voice in video](references/video/voice-in-video.md). When the same Character speaks in more than one clip, make the voice before the first speaking shot and generate every line in it; native dialogue invents a new voice in every clip.

Details: [reference production](references/video/reference-production.md). Image prompting: [image model index](references/images/index.md) and only the chosen guide.

## Voices

Before choosing native dialogue, read the selected model's spoken-language guidance in `get_model_params({ model })`. For a talking face in an unsupported or unverified language, use [spoken languages](references/video/spoken-languages.md): one image and one audio-driven generation for a single talking face; consistent character images from the same references and per-shot speech, then concatenation, only for requested multiple shots. Keep the normal workflow for documented languages.

When a Character speaks and the voice is unknown, ask one question: design a new voice from a description (`design_voice`, three auditions), use your own voice (recording plus consent, makemancer-clone-voice), or pick a stock voice (`search_voices`). If the voice doesn't matter, pick a stock voice and name it. Pass one of the Character's lines (up to 150 characters) as the audition `text`. In ChatGPT the Voice Studio card saves the choice; read it back from `list_characters` rather than saving again. When the same person will speak in more than one shot or video, including a real person from a supplied photo, settle the voice before the first speaking shot and offer once to save that person with their face and voice as a Character.

Then pick one path per speaking shot from [voice in video](references/video/voice-in-video.md):
- **One person saying exact lines, to camera or clearly in view, in any language:** make the line first with `generate_speech`, then `video/minimax-h3-max-lip-sync` with the approved shot image in `image_url` and the line in `extras.audio_url` (at least 5 seconds). The words come out exactly as recorded. `video/heygen-avatar-4` takes the same image and the line in `audio_urls` when it is selected. A voice sample or audio cut from an earlier clip is not the line.
- **Several speakers, or a shot led by body performance or camera movement:** speech first with a supported audio-reference model (Seedance 2.5, Seedance 2.0 Mini or H3 Max, the lines in `audio_urls`), then check the result's words, since these models can add, drop or repeat them; offer `lip_sync_video` when the mouths must match.
- **A one-off where the voice may vary:** native dialogue in a documented language.
- **A finished clip that needs new or corrected speech, or mouths matched to a voice:** `lip_sync_video`, not `generate_video`, with the clip in `video_url` and the speech in `audio_url`, or no `audio_url` when the clip already has the voice. Leave `model` out.

Preserve an explicit model choice. Quote only the spoken words in a prompt for a model that speaks; keep scene numbers and production notes out, since the model can read them aloud. Gemini Omni, the default, accepts no audio on the current route: don't make speech first for an Omni shot. Keep lines to at most 2.5 words per clip second.

## Workflow

1. Define the clip's purpose, aspect ratio, duration, subject, one primary action, camera move, visual continuity, dialogue or sound, and required end state.
2. Follow the reference-first pipeline above and show the frames before `generate_video`, unless the user explicitly asked for text-to-video or supplied a ready shot image. To change existing footage, edit a frame first ([source edit](references/video/recipe-source-edit.md)). Import media the user referred to first.
3. When the user asks for examples, styles, or similar concepts, or an open brief would benefit from concrete directions, call `search_examples` with `output_type: "video"`, then load only the chosen result with `search_examples({ id })`. Do not search before every clip.
4. Use `list_models({ category: "video" })` when choosing a model; for a known selection, use `get_model_params` directly. Reuse its current-task durations, resolutions, operations, and reference contract.
5. When a tool result shows `freeVideo.status: "available"`, the account's first video is free with `freeVideo.models` within `freeVideo.maxDurationSeconds`, the listed `freeVideo.resolutions`, at most `freeVideo.maxReferenceImages` reference images and no input video; leaving `model` out uses `freeVideo.defaultModel`. Tell the user before submitting that this video costs no credits, and when they name a model that is charged, mention the free option once and keep their choice. Use `estimate_generation` with `operation: "video"` only when the user asks about cost, balance, affordability, or sets a budget. Use the actual reference clip and requested output duration and resolution so source-priced work is included. Treat returned alternatives as options; preserve explicitly chosen models, durations, and quality. Estimate-only requests do not authorize generation.
6. State consequential settings briefly and proceed within the requested scope, honoring a generation the user already requested or a production stage they approved.
7. Write one chronological prompt: opening frame, subject action, camera behavior, environmental motion, audio or dialogue, ending frame, and exclusions.
8. Call `generate_video`; then, unless a card shows the job, use `check_job` to get the completed video URL. If the result has `status: awaiting_approval`, nothing has run: the user presses Generate in the card, or opens `approvalUrl` if they see no card.
9. Inspect identity, anatomy, product fidelity, timing, camera motion, dialogue sync, and ending continuity. Deliver the result and describe any shortcomings. Suggest a focused revision, but do not generate another take without an explicit user request for that additional generation.

## Authorization for additional videos

A request for one video authorizes one generation attempt, not repeated attempts until the agent considers it good enough. For an explicitly requested batch or approved film shot list, generate only the requested number of clips, once each.

Before another take, replacement, model comparison, extension, or generative repair, require an explicit request for that additional video. A complaint, a request to inspect or diagnose a problem, or the agent noticing a defect does not authorize generation. If "fix it" could mean editing existing footage or generating again, explain the proposed repair and ask before generating again. An unused budget, a failed job, a refund, or `retryable: true` does not grant permission for another attempt.

An explicit "generate another version" or "retry once" covers that one additional attempt. For "keep trying until perfect," agree on a finite attempt limit before starting further generations. Stop when the requested attempts finish and let the user decide what comes next.

Continue status checks, retrieval, inspection, and drafting revised prompts without creating another video. Correct and resubmit a rejected input only when it is confirmed that no generation job was accepted or started and the service confirms there was no charge. For timeouts or uncertain submissions, follow [job recovery](references/job-recovery.md) before considering any replacement.

## Model routing

- Default to `video/gemini-omni-flash` for general generation and short source edits that do not need voice input.
- Use `video/seedance-2.5`, the premium cinematic model, for high-end, reference-rich or long clips (up to 30 s). For a cheaper preview, `draft: true` at 480p makes a draft; a draft cannot be finalized, so a later 1080p render is a new take.
- Use `video/minimax-h3-max` for fast cinematic motion and native-audio work.
- Use `video/minimax-h3-max-lip-sync` when one person must say exact lines on camera: the finished line from `generate_speech` drives the approved shot image, so no word is added or changed.
- Use `video/flux-3-max` alongside H3 Max for text, first/last frames or up to 10 timed image keyframes, 5 to 20 seconds at 720p/1080p with generated audio. It accepts no video/audio references; use H3 Max or Seedance 2.5 for those. Check availability for the connected account.
- Recommend `video/seedance-2.0-mini`, presented as **Seedance Mini**, for the cheapest fast drafts and iteration with native sound, including drafts that follow voice or audio input references. Check availability for the connected account.
- Use `video/minimax-h3-max-turbo`, presented as **H3 Max Fast**, only when the user wants the H3 look or asks for it; it costs more than Seedance Mini.
- Recommend `video/seedance-2.5` instead of Wan for native-audio, long single-pass, first/last-frame, or mixed-reference clips. Use Wan only when explicitly requested. For a document or webpage brief, read the content and prepare a Seedance prompt with supported media references; do not pass Wan's `file_url` or `web_url` fields to Seedance.
- Honor an explicit model request, and load its local guide from the model-selection index for exact prompt and reference syntax.

For existing footage, do not apply the general generation ranking blindly:

- To swap, replace or recast a person in existing footage (whole character or face only), use `makemancer-swap-characters` (`swap_video_characters`), not `generate_video`. Use Kling Motion Control Pro or H3 Max Recast for a swap only when the user names that model, following [Kling Motion Control Pro](references/video/kling-motion-control.md) or [H3 Max Recast](references/video/h3-max-recast.md).
- For recorded performance transfer (a Character copying a movement in a new scene), recommend Kling Motion Control Pro, starting with [motion transfer](references/video/motion-transfer.md). Offer one preferred model for the requested job.
- To extend a clip, default to `video/minimax-h3-max-extend`; it keeps the source's characters, setting, motion, and look. Use one source of 1.625–60 seconds in `video_urls`, a `duration` of 5–15 seconds for the new footage, keep `aspect_ratio: "auto"` unless cropping was requested, and describe what happens next. Its default `extras.output: "extended"` returns the source plus new footage; `"continuation"` returns only the new segment. Use `video/seedance-2.5` `extend` only for heavy references or a long continuation.
- To replace an interval inside a clip with new footage, use `video/minimax-h3-max-insert`: one source in `video_urls`, `extras.start_time` where the new scene begins and `extras.resume_time` where the original resumes, both on the source timeline. `duration` sets the new scene's length.
- For any change to the footage, edit a frame first and send it in `image_urls` beside the clip ([source edit](references/video/recipe-source-edit.md)). When the clip was generated from a still, animate the edited still again instead.
- Up to 10 seconds, prefer `video/gemini-omni-flash` for a targeted source edit.
- From 4–30 seconds, prefer `video/seedance-2.5` for a full source edit.
- When the user wants the original left unchanged with new footage added, generate only the new continuation (with H3 Max Extend, `extras.output: "continuation"`) and merge it with the untouched original.
- Never recommend or proactively route to an LTX or DreamActor model.

## Reference rules

- For ordinary generation, `image_url` is the literal start frame. Kling Motion Control is an exception: its one image defines character appearance and scene; prefer `image_urls` for that reference.
- For ordinary generation, `image_url` is only the literal start frame. It selects image-to-video and makes the supplied image frame zero. `last_frame_url` is the desired end frame when the selected model exposes it.
- `image_urls`, `video_urls`, and `audio_urls` are model-specific reference arrays. If a supplied image should guide identity, style, character, product, or composition instead of becoming frame zero, use `image_urls`, even for exactly one image. Use 2 to 4 strong references when supported; respect specialist limits such as Kling Motion Control's single character image.
- `character_id` appends the saved image to `image_urls` as a reference, never a start frame. Use it in reference mode; omit it with `image_url`/`last_frame_url` (the server rejects that mix). For literal-frame animation, build identity into the approved frame and omit reference arrays.
- Preserve exact quoted copy, reference labels, dialogue, timecodes, colors, and approved layout or edit constraints in the prompt.
- Discover transformation support on the selected model and connected tool schema. Do not assume a generic top-level `operation` selector exists; use only currently exposed fields and model-supported `extras` controls. Never silently switch an explicitly chosen model to obtain a transformation.

## Prompt shape

Prefer one subject action and one camera idea per clip. Describe what happens over time, not a pile of adjectives. Include exact spoken words only when needed, and specify what must not change. For a multi-shot piece, plan it with `makemancer-plan-video`.

Conduct the workflow in the user's language and preserve quoted dialogue exactly. Confirm the chosen model supports the requested spoken language before relying on native audio.

## Save results to the user's folder

When you can read and write local files (Claude Code, Codex, Cowork and similar), save every finished result as soon as its job completes:

1. Download each output from its permanent URL with `curl --fail -L -o <path> <url>` into the current folder, at `makemancer/<YYYY-MM-DD>/<name>-<NN>.<ext>`, for example `makemancer/2026-11-08/product-ad-01.mp4`.
2. Name the file after what it shows, in a few words in the user's language. Number multiple results of one request in order from `01`. Never overwrite a file: use the next free number.
3. Tell the user the saved path or paths.

Where you cannot write files (Claude.ai, ChatGPT), skip this: the result card has a Download button.
