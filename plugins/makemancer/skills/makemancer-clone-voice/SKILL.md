---
name: makemancer-clone-voice
description: "Guide recording, private upload, cloning, testing, and reuse of a consented personal voice with Fish Audio. Use when someone asks to clone their voice, save it on a Character, or replace or audition a clone. Not for inventing a new voice from a description; use makemancer-generate-voiceover."
---

# Clone your voice

For each Makemancer tool call that exposes it, pass the optional `skills_used` array with `makemancer-clone-voice`, any other Makemancer skills actually followed, and guide entries in the form `<skill-name>/<relative-guide-path>` (for example, `makemancer-clone-voice/references/workflow-basics.md`). Include only skills and guides followed for that call. Omit attribution if the user declines tracking or the field is unavailable. Never send other plugin names, private data, or local paths.

**Not connected yet?** If no Makemancer tools (such as `list_models` or `generate_image`) are available, the plugin is installed but the server is not connected. Stop and tell the user to open the plugin's **Connectors** tab in Claude (Customize, then Plugins, then Makemancer), press **Connect**, and sign in. In Claude Code they run `/mcp` instead. Then they ask again. Do not substitute other tools or describe a result that was not generated.

Read [shared execution guidance](references/workflow-basics.md) before tools and [recording, upload, consent and reuse](references/voices/cloning.md) for this workflow.

Clone only the user's own voice, or a voice whose speaker has given explicit permission. Do not clone a public figure or anyone else without their permission. Without a consented recording, offer design_voice instead ([voice design](references/voices/voice-design.md)).

Makemancer clones on Fish Audio: every clone is a private Fish voice that speaks with `speech/fish-drama-3`. Providers are never switched silently; if the user asks for another provider, say it is not available here.

## Start without a recording

When the user wants to clone their voice and hasn't given you an audio file, call `clone_voice` without audio: `clone_voice({})`, plus `language` when you know it and `character_id` when the voice belongs on an existing Character. Its result is `status: awaiting_sample`: nothing is cloned or charged. It returns the consent statement to quote, the recording advice, the upload routes for the current app in `recoveryOptions`, and the account's voice limits in `voiceLimits`.

- If `voiceLimits.cloned.limit` is 0 or the account is at its limit, say so before asking for a recording (the result's `note` explains it), and offer design_voice instead.
- Otherwise follow the file route below: ask for consent and the language, upload the recording privately, then call `clone_voice` with the `audio_asset_id` and `consent: true`.
- Don't send the user to record with another app or a command line unless they have no recording; a clean phone voice memo is fine.

## When the user already has a recording

For an attached file, a local file or a link:

1. Identify the intended delivery and an existing Character, if any. Reuse an avatar's Character instead of creating a duplicate.
2. Ask for consent once, up front: name Fish Audio as the provider, quote the full consent statement with its terms and privacy links from [the reference](references/voices/cloning.md), and ask for the recording's language. One "I agree" plus the language covers both. Possessing a recording is not consent.
3. Import with purpose `voice_clone` to obtain a private `audio_asset_id`. Follow the reference for the current client's upload route.
4. As soon as the upload returns, call `clone_voice` with that asset, `consent: true` and the recording's `language` code (for example `he`; it defaults to `en`). Leave `provider` out (it is `fish`). Do not ask for consent or confirmation again. Use `character_id` for an existing Character or `character_name` for a new voice-only Character. The tool saves the clone automatically.
5. Audition using `generate_speech` and the returned `character_id`. Include a name, number and natural sentence in the intended language. Present the audio for approval before a longer production.

Reuse `character_id`, not the private source recording, for future speech. Never replace a saved voice merely to change speech models.

## Speak with the clone

A clone speaks with `speech/fish-drama-3`. `generate_speech` with that `character_id` and no `model` uses it, because it is the Character's own engine. Read [Fish guidance](references/voices/fish.md) and current `get_model_params` before submitting, and [language routing](references/voices/languages.md) for non-English speech, dialect requests, or mixed-language scripts.

A Character keeps one clone. Cloning again onto the same Character replaces the old clone and deletes its Fish voice and recording, so explain and confirm replacement first. Do not silently substitute a stock voice after a clone fails.

## Save results to the user's folder

When you can read and write local files (Claude Code, Codex, Cowork and similar), save every finished result as soon as its job completes:

1. Download each output from its permanent URL with `curl --fail -L -o <path> <url>` into the current folder, at `makemancer/<YYYY-MM-DD>/<name>-<NN>.<ext>`, for example `makemancer/2026-11-08/product-ad-01.mp4`.
2. Name the file after what it shows, in a few words in the user's language. Number multiple results of one request in order from `01`. Never overwrite a file: use the next free number.
3. Tell the user the saved path or paths.

Where you cannot write files (Claude.ai, ChatGPT), skip this: the result card has a Download button.
