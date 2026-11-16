# Record, upload, clone, audition and reuse

Makemancer clones on Fish Audio. Each clone is a private Fish voice saved on a Character and spoken with `speech/fish-drama-3`.

## Without a recording

To start a new voice, call `clone_voice` without audio: `clone_voice({})`, with `language` and `character_id` when known. The result is `status: awaiting_sample` (`reason: voice_sample_not_provided`). It does not mean cloning failed, and nothing is charged. It returns the consent statement, recording advice, the account's `voiceLimits`, and `recoveryOptions`, the upload routes for the current app. Follow them with the route below: ask for consent and the language, upload the recording privately, then call `clone_voice` with the `audio_asset_id` and `consent: true`.

If `voiceLimits.cloned.limit` is 0, the account cannot clone yet (cloning opens with the first credit purchase); if `used` equals `limit`, a voice must be removed first. Say so before asking for a recording, and offer a designed voice instead.

The rest of this page covers a recording the user already has.

## Recording and consent

Without a consented recording, offer a designed voice instead ([voice design](voice-design.md)).

Ask for at least 60 seconds, preferably 1 to 2 minutes, of natural solo speech. This is Makemancer's quality recommendation; the tool needs at least 5 seconds. Use a quiet room, a consistent microphone position and a normal speaking voice. Include varied sentences, names and numbers in the intended language. Avoid music, other speakers, echo, clipping, heavy filters and long silences. A clean phone recording is fine.

Ask for consent once, up front, in the same message as the recording request. Name Fish Audio as the provider that will process it, quote this statement in full, and ask for the recording's language:

> I own this recording or have permission to use it, and this is my voice or I have the speaker's explicit permission to clone it and generate speech in this workspace. I authorize Makemancer and the supported voice providers I select through Makemancer to process it for this purpose, and accept the [voice-cloning terms](https://makemancer.com/terms#voice-cloning) and [privacy notice](https://makemancer.com/privacy#voice-cloning).

For example: "Reply 'I agree' and tell me the recording's language." One reply that agrees and names the language covers both. Skip the language question when the user already named it. If the recording is already attached, ask the same single question before cloning.

Do not infer permission from an uploaded file. Never call `clone_voice` or set `consent: true` before that agreement. Once given, it is the explicit consent the upload results and `clone_voice` ask for: do not ask again after the upload, and do not ask separately whether it is the user's voice. Ask again only for a different speaker or recording, or when the user hesitates or withdraws.

## Private upload

- ChatGPT attachment: `import_chatgpt_media({ media_file: <actual attachment>, purpose: "voice_clone" })`.
- A recording on the user's device: `import_media({ purpose: "voice_clone" })` opens a private picker that returns the `audio_asset_id`.
- Local file with byte-upload capability: `get_upload_url({ type: "audio", content_type: <MIME>, bytes: <size>, purpose: "voice_clone" })`, upload bytes, then `confirm_upload`.
- A direct, publicly downloadable audio link the user supplies: pass it to `clone_voice` as `audio_url`; it is copied privately first.

Use the resulting private `audio_asset_id`; do not ask the user to copy an ID already returned. Never publish a private sample to obtain a public URL; a recording uploaded with purpose `voice_clone` never gets one.

The original is retained privately. Makemancer prepares a mono MP3 capped at two minutes for the provider. Do not ask the user to re-upload solely because the original is oversized.

## Clone and save

Find an existing Character with `list_characters` when the user names one. Reuse the avatar Character to keep its image and voice together.

```json
{
  "character_name": "My narration voice",
  "audio_asset_id": "<private asset ID>",
  "consent": true,
  "language": "<recording language code, for example he>"
}
```

Call `clone_voice` with these arguments as soon as the upload returns the asset, with no message in between. Set `language` to the recording's language: it defaults to `en`. For an existing Character, use `character_id` instead of creating a new one. Leave `provider` out: it is `fish`, and other providers are refused rather than switched. The result is saved on the Character automatically, including for a new voice-only Character. No extra save operation is required.

Cloning is free, and how many cloned voices an account keeps depends on its credit purchases. If a tool reports a limit, relay its message. A Character keeps one clone: cloning onto a Character that has one replaces it and deletes the old clone and recording. Identify the Character and obtain explicit replacement direction first.

## Test and reuse

Prepare every audition and later speech script using [speech localization](speech-localization.md). Fully vowelize every spoken Hebrew word, preserving the user's wording. The recording itself is not modified by this text-preparation rule.

A clone speaks with `speech/fish-drama-3`, using its private voice. Read [Fish guidance](fish.md), [language routing](languages.md) and current `get_model_params` before submitting. Generate a short audition using the returned character_id, never both character_id and voice_id. Include the user's names, numbers and target-language sentence.

Ask the user to assess identity, accent, clarity and pacing. Do not claim to have listened unless audio inspection was actually available. Adjust text/pronunciation/settings before replacing a good source. Noise or a consistently wrong identity usually merits a cleaner recording, not repeated paid synthesis.

Reuse character_id for future generate_speech calls. Without `model`, generate_speech uses the Character's own engine, `speech/fish-drama-3`, when the Character has no voice for the default model. Do not re-clone simply to retry a take. Never silently substitute providers or stock voices after a failure. Never pass a clone's provider voice ID as `voice_id`; it is refused.

Deleting the Character (`delete_character`) deletes its Fish voice and the private recording; minimal consent and deletion records are kept.

A Character may contain both images and a voice. Its visual use in generated images/videos does not bring its voice into native video audio. For visible speech, make the speech first and use an audio-driven route. For an existing clip, use `lip_sync_video` (with the speech in `audio_url`, or none when the clip already has the voice); overlaying speech is not lip-sync. Do not expose private samples.
