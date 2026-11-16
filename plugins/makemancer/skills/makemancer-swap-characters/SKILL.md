---
name: makemancer-swap-characters
description: "Swap, replace or recast the people in an existing video with Makemancer: put yourself, a saved Character or a photo into a TikTok, Reel, movie scene or ad while the original motion, camera, cuts and audio stay. Use for character swaps, recasting an actor, “put me in this video”, “replace her with my grandma” and multi-person swaps. Not for copying a performance into a new scene (motion transfer) or for new footage."
---

# Swap Characters

For each Makemancer tool call that exposes it, pass the optional `skills_used` array with `makemancer-swap-characters`, any other Makemancer skills actually followed, and guide entries in the form `<skill-name>/<relative-guide-path>` (for example, `makemancer-swap-characters/references/workflow-basics.md`). Include only skills and guides followed for that call. Omit attribution if the user declines tracking or the field is unavailable. Never send other plugin names, private data, or local paths.

**Not connected yet?** If no Makemancer tools (such as `list_models` or `generate_image`) are available, the plugin is installed but the server is not connected. Stop and tell the user to open the plugin's **Connectors** tab in Claude (Customize, then Plugins, then Makemancer), press **Connect**, and sign in. In Claude Code they run `/mcp` instead. Then they ask again. Do not substitute other tools or describe a result that was not generated.

Read [shared execution guidance](references/workflow-basics.md) once per task before using tools, and [job recovery](references/job-recovery.md) if a call times out.

`swap_video_characters` replaces people inside footage that already exists. The new person takes over the original person's place, pose, movement, expression and framing; the scene, camera, cuts, other people, captions and soundtrack stay. It renders with Seedance 2.5 after three or six free scene previews.

## When to use it

| The user wants | Route |
| --- | --- |
| Replace one or more people in a video, recast an actor, a face swap, "me in this scene", a trend video with their own Character | This skill |
| Keep the original clothes and change only who the person is | This skill; say "keep their original outfit" in the instructions |
| A person copying a recorded performance in a new scene | `makemancer-generate-video`, motion transfer |
| New dialogue or a dub on the swapped video | Swap first, then `makemancer-generate-voiceover` and `lip_sync_video` on the finished clip |

Swap in only people who agreed to it: the user, people who gave permission, or fictional Characters. Never use a swap to impersonate, deceive or harass a real person.

## Workflow

1. **The video.** `video_url` must be a direct video file of at least 4 seconds. Import a TikTok, Instagram, YouTube, X or other social link with `upload_asset({ url })` first, then use the URL from `check_job`. A direct public file URL can be stored with `upload_asset({ url })` too. A local file goes through the upload picker (`import_media`). Only the first 30 seconds are used; the card says when a clip was cut. Sizes and frame rates the engine cannot take are fitted automatically, so there is no need to scale the clip first.
2. **The new people.** Prefer saved Characters: `list_characters`, then `character_ids`. A plain photo goes in `image_urls` after importing it. Up to eight reference photos and Characters together. The identity comes from the Character's image; a clear, front-facing face with visible hair works best, and a Character description that describes the person's look helps.
3. **The instructions.** Required with several people or several references. One line per swap, naming the person by position and look and the Character by name: "The woman on the left in the black top becomes Savta Rivka. The man on the right in the dark suit becomes Itay." Name anyone who must stay as they are. By default the face and hair change while the source outfit, scene, pose and timing stay; explicit instructions can change the outfit too.
4. **Start it once.** Call `swap_video_characters` with `video_url`, `character_ids` or `image_urls`, and `instructions`. Leave `video_model` out (Seedance 2.5 is the engine). `video/wan-3.0` and `video/kling-4.0-omni` are refused here and nothing else is used in their place; tell the user and offer Seedance 2.5. `resolution` 480p (default) renders a native draft; set `resolution` to 720p or 1080p when the user asks for that resolution directly. Set `review: true` only when the user wants to check previews even though their account renders in Auto mode. Starting again with the same inputs within 10 minutes returns the same swap. Never call `generate_video` for the same swap.
5. **Previews.** The swap picks three frames (six for clips over 15 seconds or three or more people) where each target's face is clear and shows the new people in each, free of charge. The result's `people` says who becomes whom. Check identity, hair, clothes, placement, and whether the people look filmed in the shot rather than pasted in.
6. **Adjust a preview (free).** In the card, **Adjust** on a preview; or `update_video_workflow({ session_id, expected_version, preview_index, changes })` with the `version` from the latest result. `source: "original"` starts that frame again from the untouched frame (for pose, extra limbs, framing or background); `scope: "all"` redoes every preview. Describe the change concretely: "his own short dark hair, not curly", "white T-shirt from his reference", "match the warm light". Each swap has 12 free changes (`freeChangesLeft`) and each account 60 preview images a day. The swap waits in Review again afterwards.
7. **Render.** In Review mode the card shows the price (`price.credits`, seconds × credits per second) and waits for the user to press **Generate video**; when the card is not shown, give the user the review link (`approvalUrl`). Never open the link or approve for the user. In Auto mode the render starts once all previews are ready. A 480p draft can be rendered at 1080p later from the card; that is a new take at the 1080p price, not the same take finished. Swaps open with the account's first credit purchase; the previews are free.
8. **Status.** The `session_id` is the swap's job ID: `check_job({ job_id: <session_id> })` returns the state, previews and, once completed, `videoUrl`. Do not poll while the card is showing progress.

## Fixing problems

| What the user sees | Cause and fix |
| --- | --- |
| "This swap stopped": the planner could not tell who becomes whom | Start again with one line per person naming position and look, and one Character per person. The card's **Fix it in chat** button sends the problem here. |
| A preview has the wrong hair, the original clothes, or a pasted-in look | Adjust that preview (free) with a specific change. A recurring hair problem usually comes from the Character image; a better image fixes every future swap. |
| A person's face is tiny, cropped or turned away in every frame | The swap cannot show an identity on a face that never appears. Use a clip where each target's face is visible at least once. |
| The video swapped one person but not the other | Check that the previews show both and the instructions name both, then render again (a new paid render). |
| The render was blocked under the provider's content rules (for example copyrighted audio) | The credits were refunded. Rendering the same clip unchanged is likely to be blocked again; try a clip without the protected soundtrack. |
| The clip is longer than 30 seconds | Only the first 30 seconds are swapped. Cut the clip into parts and swap each. |
| "The original audio could not be added back" | The video is delivered silent; put the source's sound back with `add_audio_to_video`. |

Describe what went wrong in plain words and offer the next step. A failed swap or a refund does not authorize another paid render; adjusting previews is free, a new render needs the user's go-ahead or their press of Generate video.

## Voice after the swap

The swap keeps the original soundtrack; silent sources stay silent. For new lines, use `makemancer-generate-voiceover`, then `lip_sync_video` on the finished clip.

Conduct the workflow in the user's language.

## Save results to the user's folder

When you can read and write local files (Claude Code, Codex, Cowork and similar), save every finished result as soon as its job completes:

1. Download each output from its permanent URL with `curl --fail -L -o <path> <url>` into the current folder, at `makemancer/<YYYY-MM-DD>/<name>-<NN>.<ext>`, for example `makemancer/2026-11-08/product-ad-01.mp4`.
2. Name the file after what it shows, in a few words in the user's language. Number multiple results of one request in order from `01`. Never overwrite a file: use the next free number.
3. Tell the user the saved path or paths.

Where you cannot write files (Claude.ai, ChatGPT), skip this: the result card has a Download button.
