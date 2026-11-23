# Additional video models

Use this guide for an explicitly selected model outside the primary guides. Always fetch get_model_params for that exact model; the notes below describe the local integration, not every upstream capability. Read [reference production](reference-production.md) and [Review handling](review.md). Do not infer capability from a similar model name or transplant its reference tokens.

| Model | Input and prompting guidance |
| --- | --- |
| video/grok-imagine-1.5 | A literal first frame in `image_url`, or one reference image in `image_urls`, not both. Describe the motion and keep the image's identity and composition roles separate. |
| video/flux-3 | Text, or one literal opening image in `image_url`. Describe the motion from that frame; native audio is on by default (`generate_audio`). Do not send keyframe arrays or video references. |
| video/minimax-h3 | This is not H3 Max. Read its current schema for image, video and audio reference limits and resolutions. Separate literal frames from references and assign each reference a role; do not borrow Max's pricing or resolution values. |
| video/hailuo-02-pro | Text or supported first/last-frame animation. Describe subject motion, camera and physical continuity. Do not assume native audio or arbitrary reference arrays. |
| video/hailuo-2.3-fast | Requires an opening image. Describe what moves after that image; do not promise text-only or end-frame support. |
| video/happyhorse-1.0, video/happyhorse-1.1 | 1.0: text, or one literal first frame in `image_url`. 1.1 (after the first credit purchase): a literal first frame, or 1 to 9 reference images in `image_urls` cited as [Image 1], [Image 2] in array order; 3 to 15 seconds at 720p or 1080p with joint audio and lip-sync. Check spoken-language support before writing dialogue. |
| video/heygen-avatar-4 | Talking photo: a clear face in `image_url`. `audio_urls` = [finished speech] makes the words exact and overrides the script; otherwise `prompt` is the script, read with a HeyGen `voice`. 720p or 1080p, `aspect_ratio` (`auto` keeps the photo's framing) and `talking_style` (`stable` or `expressive`). Use finished speech, never a private voice sample. |
| video/minimax-h3-max-lip-sync | Recommended talking photo, driven by finished speech: `image_url` plus `extras.audio_url`, at least 5 seconds long. One generation for one talking face within duration limits. For unsupported or unverified native-dialogue languages, follow [spoken languages](spoken-languages.md); multiple requested shots use consistent images from the same character references, per-shot speech, then concatenation. |
| video/pixverse-lipsync | PixVerse lip sync, the default model of `lip_sync_video`; use that tool for existing-video lip sync. Directly through `generate_video` it lip-syncs one finished clip in `video_urls` to one speech file in `audio_urls`, charged per second of the clip. |
| video/sync-3 | Only when Sync 3 is named. Use `lip_sync_video` with `model: "sync-3"`; [voice in video](voice-in-video.md) has its inputs. Directly through `generate_video` it lip-syncs one finished clip to prepared speech: one clip in `video_urls`, one speech file in `audio_urls`. Match the clip and speech lengths first; audio longer than the clip is cut off. Charged per second of the clip. |
| video/heygen-video-1 | HeyGen's general video model: text, a literal first frame in `image_url`, or image, video and audio references, with native audio. 480p or 768p, `aspect_ratio` and `prompt_enhancement`. It is not the audio-driven Avatar 4 talking photo; for exact speech on one face use H3 Max Lip Sync or Avatar 4. Read its limits with `get_model_params`. |

## Explicit-request-only routes

Do not proactively recommend or route to LTX or DreamActor. If explicitly requested and currently available:
- video/ltx-2.3-fast: read its current schema for the supported source media, resolution and frame rate. Do not invent a top-level operation selector.
- video/dreamactor-v2: motion transfer from one driving video (`video_urls`) onto the person in `image_url`, covering body motion, facial expression and lip movement. It is not a generic text-to-video model.

For a newly available or explicitly requested legacy model not listed here, use the live model schema and Usage. Do not substitute a recommended model silently or revive hidden models in discovery recommendations.

For a named HappyHorse 1.1 request, check its live settings. It offers 480p, 720p and 1080p.
