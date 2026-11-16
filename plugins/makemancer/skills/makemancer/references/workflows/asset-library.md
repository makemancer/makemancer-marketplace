# Asset library

Use the asset library as the durable source of truth for generated, imported, and processed media.

## Find before creating

Start with `search_assets` whenever an existing logo, product image, Character reference, narration, source clip, approved keyframe, or prior generation may already exist.

Useful filters:

- `type`: `image`, `video`, `audio`, `document`, `zip`, `project` (a render project ZIP), `3d_model`, or `font`.
- `query`: matches the name, a tag, or the generation prompt.
- `tags`: matches any supplied tag.
- `name`: exact asset name.
- `source`: `generated`, `uploaded`, or `imported`.
- `limit` and `offset`: pagination.

Do not generate a replacement merely because the first search was too narrow. Try a type filter plus project, brand, character, or campaign terms.

## Import by byte location

Read `../platform-upload.md` and choose exactly one route:

- Native ChatGPT attachment → `import_chatgpt_media` (ChatGPT only).
- Local readable file with HTTP PUT capability → `get_upload_url`, PUT bytes, then `confirm_upload`.
- User still needs to pick a file → `import_media`.
- Public direct URL → pass it to a compatible tool or copy it with `upload_asset`.

`upload_asset` requires `url`; `content_type` and `type` are optional. A direct file returns the asset in the same call. A public social post (YouTube, TikTok, Instagram, Facebook, X, LinkedIn, Reddit) returns a job ID: wait for `check_job` to complete before using its URL. It does not accept base64 or local paths.

## Name and tag

Keep names unique; the library does not enforce it. Use short descriptive slugs:

```text
acme-logo-color
acme-launch-storyboard-v3
mira-character-sheet-approved
launch-shot-03-final
launch-voiceover-en-final
```

Use a small stable tag vocabulary:

- Brand/project: `acme`, `launch-2026`.
- Role: `logo`, `reference`, `storyboard`, `keyframe`, `voiceover`, `source`.
- Entity: `character-mira`, `product-widget`.
- State: `draft`, `review`, `approved`, `final`.

`update_asset.tags` replaces all tags. Include existing tags that should remain.

## Derivatives

Keep originals and derivatives as separate assets. Use clear suffixes such as `-isolated`, `-upscaled`, `-cutout`, `-vertical`, or `-subtitled`. Do not delete or rename the source merely because a derivative was approved.

## Reuse in generation

- Use durable asset URLs for `image_url`, `video_urls`, `audio_urls`, theme references, and Character media.
- Keep reference ordering stable when prompts address numbered tokens.
- Search by exact name for deterministic automation.
- Load or inspect the asset before using it as an identity or style anchor.

## Deletion

`delete_asset` permanently removes the stored file and cannot be undone. Call it only for an explicit deletion request after resolving the exact asset ID. Warn when the asset may be referenced by a theme, Character, Film, or another workflow.
