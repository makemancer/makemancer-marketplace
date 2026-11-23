---
name: makemancer-generate-image
description: "Generate or edit a single image with Makemancer and route it to the right image model. Use for image creation and edits, including requests naming a supported model. Use product-photoshoot for a coordinated campaign or create-avatar for a reusable identity."
---

# Generate Image

For each Makemancer tool call that exposes it, pass the optional `skills_used` array with `makemancer-generate-image`, any other Makemancer skills actually followed, and guide entries in the form `<skill-name>/<relative-guide-path>` (for example, `makemancer-generate-image/references/workflow-basics.md`). Include only skills and guides followed for that call. Omit attribution if the user declines tracking or the field is unavailable. Never send other plugin names, private data, or local paths.

**Not connected yet?** If no Makemancer tools (such as `list_models` or `generate_image`) are available, the plugin is installed but the server is not connected. Stop and tell the user to open the plugin's **Connectors** tab in Claude (Customize, then Plugins, then Makemancer), press **Connect**, and sign in. In Claude Code they run `/mcp` instead. Then they ask again. Do not substitute other tools or describe a result that was not generated.

Read [shared execution guidance](references/workflow-basics.md) once per task before using tools. It covers existing authorization, model discovery, optional cost checks, imports, and recovery.

Turn a brief and optional references into a finished image. This is the primary skill for a clear, general image-generation or image-editing request; the selected packaged model reference supplies deeper prompting advice. If the user explicitly requests HTML/CSS rendering or a deterministic code-based PNG, use `makemancer-render-html` instead.

## Workflow

1. Establish the subject, intended use, aspect ratio, style, text requirements, and which details must remain exact.
2. Use `search_assets` for likely reusable references. Import attachments or local files with the platform upload flow before generation. Preserve a supplied product or Character as the identity reference.
3. When the user asks for examples, inspiration, styles, or a close starting point, or an open brief would benefit from concrete choices, call `search_examples` for a small filtered set, then load only the chosen example with `search_examples({ id })`. Do not search automatically for an already precise brief.
4. For branded work, call `get_theme` and carry the relevant colors, typography, logo treatment, and visual rules into the prompt.
5. Use `list_models({ category: "image" })` when selection is unresolved; for a known choice, use `get_model_params` directly and reuse its current-task schema.
6. Generate one direction unless several were requested. Estimate with `operation: "image"` only for user-requested cost/budget help.
7. Call `generate_image`. Then call `check_job` until it completes and show the image from its URL; where a card shows the job it updates itself.
8. Inspect the result against the non-negotiables, revise the smallest failing element, and tag the approved asset.

## Model routing

Nano Banana 2 is the everyday default. GPT Image Sunburst is our highest-quality choice. Prefer `image/gpt-image-2.6-sunburst` for demanding likeness, detailed products, typography or tightly controlled edits. If the user dislikes a result, identify what missed, offer Sunburst with the original references and a focused correction, and run the revision when requested. Preserve an explicit model choice.

- Default to `image/nano-banana-2` (Nano Banana 2) for most generation and editing, including targeted corrections that should preserve the existing scene. Keep the source aspect ratio unless reframing is requested and inspect the result for unintended changes. Exact preservation outside the edited region requires compositing that region back into the original.
- Use `image/gpt-image-2.6-sunburst` for complex professional assets, demanding typography, multi-reference composition, or controlled edits. Nano Banana Pro remains available when explicitly selected.
- Use `image/gpt-image-2.6-sunburst` for layout corrections that move, scale, or re-space existing text and logos, such as a Story safe-zone fix. Nano Banana 2 tends to return that kind of edit with the layout unchanged. State target positions as percentages of the canvas height, then measure them on the result.
- Use `image/gpt-image-2.6-flare` for fast, high-quality everyday OpenAI image generation and editing.
- For a transparent background, use GPT Image 2.6 (Flare or Sunburst) with `extras.background: "transparent"`, or `remove_background` for an existing image.
- Honor an explicit model choice. Read [the selected image model guide](references/images/index.md) for exact prompting and reference syntax.

Use other image models only when the user asks for them.

## Prompt and reference contract

Build prompts in this order: deliverable and subject; composition; must-preserve facts; environment; lighting and camera; material detail; aesthetic; required text; exclusions.

Work in the user's language. Keep supplied visible copy verbatim, including spelling, punctuation, and script direction; verify the selected model's typography and language support when text accuracy matters.

- `image_url` is the primary reference. Additional reference support is model-specific, so inspect `get_model_params` instead of assuming a fixed count.
- Set the output shape with `aspect_ratio`; `size` is legacy.
- When the image tool exposes `character_ids`, supply the visible saved Characters there and name their placements in the prompt. The set image goes in `image_url` and other scene references in `extras.image_urls`. On a route without Character selectors, use the actual sheet URLs as supported image inputs.
- Video keyframes: use the same image model as the rest of the project, `aspect_ratio` = the video's ratio, anchors in `image_url` + `extras.image_urls` with roles named, one full-bleed frame with no text, grid or labels.
- Preserve exact quoted copy, reference labels, dialogue, timecodes, colors, and approved layout or edit constraints in the prompt.
- Never invent unsupported parameters. Use only fields returned by the tool schema and selected model.

## Completion standard

Confirm that subject identity or product geometry, composition, text, crop, and brand rules match the brief. A job ID is not a finished image. Name and tag approved outputs so later video or campaign work can retrieve them.

When the user likes a generated look or voice, offer once to save it as a named Character for future work. Check `list_characters` first. An explicit request to save the look or voice is agreement. Update the existing Character or create one when authorized with the approved image or selected voice. Reuse its ID for later shots or speech. A voice-only Character works for a narrator.

## Save results to the user's folder

When you can read and write local files (Claude Code, Codex, Cowork and similar), save every finished result as soon as its job completes:

1. Download each output from its permanent URL with `curl --fail -L -o <path> <url>` into the current folder, at `makemancer/<YYYY-MM-DD>/<name>-<NN>.<ext>`, for example `makemancer/2026-11-08/product-ad-01.mp4`.
2. Name the file after what it shows, in a few words in the user's language. Number multiple results of one request in order from `01`. Never overwrite a file: use the next free number.
3. Tell the user the saved path or paths.

Where you cannot write files (Claude.ai, ChatGPT), skip this: the result card has a Download button.
