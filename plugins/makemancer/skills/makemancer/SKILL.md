---
name: makemancer
description: "Route mixed, ambiguous, cross-modal, or workspace-management requests through Makemancer. Use when the user asks to use Makemancer generally, needs several media types, or asks about account balance and past charges, saved assets, brand themes, the curated examples catalog, upscaling, background removal, or onboarding; prefer a focused skill for one clear outcome."
---

# Makemancer

For each Makemancer tool call that exposes it, pass the optional `skills_used` array with `makemancer`, any other Makemancer skills actually followed, and guide entries in the form `<skill-name>/<relative-guide-path>` (for example, `makemancer/references/workflow-basics.md`). Include only skills and guides followed for that call. Omit attribution if the user declines tracking or the field is unavailable. Never send other plugin names, private data, or local paths.

**Not connected yet?** If no Makemancer tools (such as `list_models` or `generate_image`) are available, the plugin is installed but the server is not connected. Stop and tell the user to open the plugin's **Connectors** tab in Claude (Customize, then Plugins, then Makemancer), press **Connect**, and sign in. In Claude Code they run `/mcp` instead. Then they ask again. Do not substitute other tools or describe a result that was not generated.

Read [shared execution guidance](references/workflow-basics.md) once per task before using tools. It covers existing authorization, model discovery, optional cost checks, imports, and recovery.

Use the Makemancer MCP server as a media workspace: source durable assets, apply a brand theme, choose a model by capability, generate or process media, and save results for reuse.

## Account and billing questions

Use `manage_account` for the current balance and for recent generations with their recorded charges and refunds. Read [account and cost guidance](references/workflows/account.md) before interpreting charges. Use `estimate_generation` for future quotes, not the cost of a past generation. Do not submit feedback automatically for an account question.

Purchases and plans are handled on the Makemancer website, not in chat. Do not start, price, or recommend a purchase; if asked, say so and share only an account link a tool returned.

## Operating rules

1. **Reuse assets when relevant.** Use `search_assets` when the request refers to saved media, an existing project, or identity/product continuity. Skip asset searches for standalone generation with no reuse requirement. Use `get_theme` for branded work.
2. **Discover only what is missing.** Use `list_models({ category })` when choosing or checking availability; use `get_model_params` for a known selected model. Reuse current-task schemas until a model/operation changes or an error indicates they need refreshing.
3. **Use durable references.** Read `references/platform-upload.md` before importing attached or local media. Pass Makemancer URLs to generation and processing tools.
4. **Keep exact control syntax intact.** Preserve approved references, dialogue, timecodes, and layout instructions. Speech receives the exact performed script in `text`.
5. **Respect the user’s requested scope and budget.** Use `estimate_generation` only when the user asks about cost, balance, affordability, or supplies a budget constraint. An estimate is information for the user: share it, then continue with the requested work when it fits what they said. Ask about material scope changes, missing essential choices, and whenever a tool result asks for confirmation.
6. **Treat queued work as unfinished.** Where a card shows the job it updates itself. Otherwise call `check_job` to get the completed result before showing it or passing its URL to another tool. Never claim completion from a job ID alone.
7. **Organize outputs.** Give assets meaningful metadata when the tool supports it; otherwise use `update_asset` after completion. Use stable tags across a project.
8. **Do not invent tools or parameters.** If a tool is absent on the current client, follow `references/platform-client.md`. Use the exposed tool schema for top-level fields and `get_model_params` for model-specific settings.
9. **Capture actionable feedback.** Use `submit_feedback` for bugs, missing features or models, confusing flows, generation-quality problems and praise that the user expresses or you observe. Say briefly that you reported it, and do not report when the user asks you not to. Keep reports specific and do not add refund requests. Read `references/workflows/feedback.md` before reporting.
10. **Match the user's language.** Conduct the workflow in the user's language, preserve supplied scripts and visible copy exactly, and verify the selected model supports the requested spoken or rendered language.
11. **Use the examples catalog only on request.** When the user asks to browse examples or prompt ideas, follow [examples guidance](references/workflows/examples.md). Do not search the catalog before every generation, and leave variations and user-supplied style references to the generation skill. For speech voices, use `get_model_params` and the voiceover workflow.
12. **Keep HTML and motion-graphics video explicit.** Use `makemancer-render-html` when the user explicitly asks for HTML/CSS, HyperFrames, or code-driven rendering, supplies HTML, accepts that method, or explicitly asks for a motion-graphics video: motion graphics, kinetic typography, animated text or titles, an animated infographic or explainer, or UI-style animation. A request for a video, an ad, or an explainer without those words stays with the video skills; when it is unclear whether the user wants filmed-looking footage or designed motion, ask one question. It also finds HTML-video examples. An exact text watermark for `overlay_images` may use `render_html_image` with a transparent background. Ordinary image or video requests stay with the generative skills.

## Route the request

| User wants | Primary route |
| --- | --- |
| Understand balance, past generation costs, or charges and refunds | `manage_account`, following [account guidance](references/workflows/account.md) |
| Track or report spend per client, job or production; budget projects | `makemancer-budget-projects` |
| Generate or edit one general image | `makemancer-generate-image` |
| Create a consistent product image set | `makemancer-product-photoshoot` |
| Make a character copy a recorded performance or retain movement across wardrobe variants | `makemancer-generate-video`, starting with [motion transfer](references/video/motion-transfer.md) to resolve the driving video and appearance image |
| Swap, replace or recast people in existing footage: face swaps, "put me in this video", several people at once | `makemancer-swap-characters` (`swap_video_characters`) |
| Generate, extend, reframe, or transform one video clip | `makemancer-generate-video` |
| Plan a script, shot list, or storyboard | `makemancer-plan-video` |
| Produce a complete multi-shot film | `makemancer-build-film` |
| Create a creator-style product ad | `makemancer-create-ugc-ad` |
| Make a set of ad variations from one product shot or existing ad (new hooks, voiceovers, voices or captions) | `makemancer-ad-variations` |
| Generate narration, dialogue, or speech | `makemancer-generate-voiceover` |
| Design a new synthetic voice from a description | `makemancer-generate-voiceover` (`design_voice`) |
| Generate a score, music bed, sting, jingle, theme, or song | `makemancer-generate-music` |
| Generate sound effects, ambience, Foley, loops, impacts, or UI cues | `makemancer-generate-sound-effects` |
| Upscale an image or video, or remove a background | `upscale_image`, `upscale_video` or `remove_background`; see the [tool catalog](references/tool-catalog.md) |
| Clone a consented voice from a recording | `makemancer-clone-voice` |
| Browse or adapt curated examples when asked | [examples guidance](references/workflows/examples.md) |
| Explicitly render HTML/CSS as a PNG, or HTML/HyperFrames motion as video | `makemancer-render-html` |
| Motion graphics, kinetic typography, animated titles, or an animated explainer the user explicitly asks for | `makemancer-render-html` (the video agent) |
| Add or create an intro/outro around existing video | `makemancer-edit-media` |
| Create a personal avatar from photos or a reusable identity sheet | `makemancer-create-avatar` |
| Create or update a reusable Character | `makemancer-create-character` |
| Report product or quality feedback | `makemancer-submit-feedback` |
| Find, import, name, tag, reuse, or delete media | `references/workflows/asset-library.md` |
| Create, inspect, edit, or apply a brand theme | `references/workflows/brand-theme.md` |
| Trim, resize, caption, transcribe, clean, or combine existing media | `makemancer-edit-media` |
| Lip-sync an existing video to a voice | `makemancer-edit-media` (`lip_sync_video`) |
| Burn a transparent logo or copyright image onto a finished video | `makemancer-edit-media`, using `overlay_images`; read [assembly guidance](references/media-assembly.md) |
| Make a video from existing timed images, optional video clips, and optional audio | `makemancer-edit-media`, using `stitch_clips` (never for new AI footage, which is `generate_video`); read [assembly guidance](references/media-assembly.md) |
| Select highlights from long footage and create vertical Reels | `makemancer-create-reels` |
| Cut, reorder, and reframe chosen video moments | `makemancer-edit-media` (`cut_and_reframe_video`) |
| Learn what Makemancer can do | `references/workflows/onboard.md` |
| Run first-time setup, get started, or take a guided tour | `makemancer-setup` |

Use an explicit outcome over a generic modality. If the user names a model, keep the outcome skill in control and use the matching packaged model reference for prompt and reference details. Use this root skill for requests that span outcomes or do not have one clear owner. Read the matching workflow before calling a mutating or paid tool.

## Default model policy

- **Images:** default to `image/nano-banana-2` (Nano Banana 2) for most generation and editing, including targeted corrections that should preserve the existing scene. It balances quality, speed, and cost. Use `image/gpt-image-2.5-flare` for fast OpenAI image work, and use `image/gpt-image-2.5-sunburst` for complex professional assets, typography, and controlled edits. Use `image/seedream-5-pro` for product and marketing imagery. Nano Banana Pro remains available when explicitly selected. After a model moderation refusal, Seedream may also be offered as the tool's suggested alternative, with user confirmation before another paid generation; it applies its own safety checks and may still reject the request. For a transparent background, use GPT Image 2.5 (Flare or Sunburst) with its transparent background option, or `remove_background`. Use other image models only when the user asks for them.
- **Video:** default to `video/gemini-omni-flash`. Recommend `video/seedance-2.5` as the premium cinematic model for native-audio, high-end, reference-rich, first/last-frame or long (up to 30 s) work; for a cheaper preview, `draft: true` at 480p makes a draft. Use `video/minimax-h3-max` for fast cinematic native-audio work, or `video/flux-3-max` for text, first/last frames or timed image keyframes (5 to 20 seconds at 720p/1080p). FLUX accepts no video/audio references; keep H3 Max or Seedance 2.5 for those. Both run before purchase; H3 Max is eligible for the free first video. Recommend `video/seedance-2.0-mini` (Seedance Mini) for cheap, fast drafts with native sound, including drafts that follow voice or audio input references; it is available before purchase and eligible for the free first video. `video/minimax-h3-max-turbo` (H3 Max Fast) is a cheaper fallback for text or start-frame drafts with no references. For existing footage, route through `references/workflows/edit-video.md` instead of applying this generation ranking; `video/minimax-h3-max-extend` is the default for extending a clip. Never recommend or proactively route to an LTX or DreamActor model. Use Wan only when explicitly requested; recommend Seedance 2.5 instead. For document or webpage briefs, read the content and prepare a Seedance prompt with supported media references; do not pass Wan's `file_url` or `web_url` fields to Seedance.
- **Speech:** default to `speech/elevenlabs-v4` for all non-cloned speech, including stock voices, expressive delivery, and dialogue. Cloned and designed voices are private Fish voices: new clones (makemancer-clone-voice) and designs (`design_voice`) are made on Fish Audio, and they speak with `speech/fish-drama-3` through their Character's `character_id`. Never clone without consent or silently switch providers. Honor explicitly requested supported models. Load `makemancer-generate-voiceover` for the selected model's reference and current settings.
- **Audio:** use `generate_sound_effect` with `sfx/elevenlabs-sound-v2` for sound effects, Foley, ambience, and loops. Use `generate_music` for scores, music beds, stings, jingles, and songs; `makemancer-generate-music` picks the music model. Do not pass non-speech model IDs to `generate_speech`.

Verify missing capabilities with runtime discovery, then reuse the selected schema for unchanged operations within the task.

For image prompting, load [the selected image model reference](references/images/index.md). Video outcome skills package their selected video model references. For speech, load makemancer-generate-voiceover and only its selected model guide. There are no standalone model skills; the outcome workflow owns authorization, execution and delivery.

## Shared production pattern

1. Clarify the deliverable, audience, duration or dimensions, and required references.
2. Search the asset library when saved media, project reuse, or continuity matters; skip the search for standalone generation. Import supplied references only when needed. Search curated examples only when the user asks for them, and load only the selected one.
3. Fetch the selected theme for branded work.
4. Inspect available models and the chosen model's parameters.
5. State consequential settings briefly; honor the approvals the user already gave and the review stages they asked for.
6. Generate or process the media.
7. Resolve any queued job needed by later steps.
8. Inspect the result, revise deliberately, and preserve approved anchors.
9. Name and tag the final assets.

## Default visual preparation for video

For new generative video, follow the selected video skill's reference-first workflow: one clean keyframe per shot with `generate_image` at the video's aspect ratio, built from approved identity, product, or location anchors, then pass it to the video model. Later keyframes also take the first approved keyframe as a reference so the shots match. Tell the user the plan includes one keyframe image per shot before making them. Skip them when the user asks for direct text-to-video, supplies a ready shot image, or is editing footage.

## References

- `references/tool-catalog.md` — current tool routing by purpose.
- `references/workflows/examples.md` — the curated examples catalog.
- `references/async-jobs.md` — queued-job handling.
- `references/platform-upload.md` — attachment, local-file, picker, and URL ingestion.
- `references/platform-client.md` — client capability and connection rules.
- `references/platform-dimensions.md` — common image and video sizes.

## Save results to the user's folder

When you can read and write local files (Claude Code, Codex, Cowork and similar), save every finished result as soon as its job completes:

1. Download each output from its permanent URL with `curl --fail -L -o <path> <url>` into the current folder, at `makemancer/<YYYY-MM-DD>/<name>-<NN>.<ext>`, for example `makemancer/2026-11-08/product-ad-01.mp4`.
2. Name the file after what it shows, in a few words in the user's language. Number multiple results of one request in order from `01`. Never overwrite a file: use the next free number.
3. Tell the user the saved path or paths.

Where you cannot write files (Claude.ai, ChatGPT), skip this: the result card has a Download button.
