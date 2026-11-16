# Speech and audio workflow

Makemancer generates speech, sound effects, ambience, Foley, and music.

## Route the request

- New narration, dialogue, or character voice → `generate_speech`.
- Sound effect, Foley, transition, impact, ambience, or loop → use `makemancer-generate-sound-effects` and `generate_sound_effect` with `sfx/elevenlabs-sound-v2`.
- Music, score, bed, sting, jingle, or song → use `makemancer-generate-music` and `generate_music`: `music/standard` for new tracks (description mode, or custom mode with your own lyrics), `music/standard-extend` to continue one, `music/standard-cover` to restyle an uploaded song, and `music/standard-region-edit` to replace the words of one section.
- New reusable voice: consenting speaker's recording → `makemancer-clone-voice`; description → `design_voice` (`makemancer-generate-voiceover`); stock → `voice_model`/`voice_id` on `update_character` (existing Character) or `create_character` (new).
- Transcript and timings from audio, video, or a public YouTube URL → `transcribe`.
- Remove noise, music, or reverb from speech → `isolate_audio`.
- Add an existing voice/music track to video → `add_audio_to_video`. It replaces the clip's audio by default; `audio_mode: "mix"` keeps it and layers the new track.
- Concatenate audio files → `merge_media` with `audio_urls`.
- Build a video from timed images or clips with optional soundtrack → `stitch_clips`; see [assembly guidance](../media-assembly.md).

`generate_speech` cannot produce music or sound effects by changing its model ID. Use `generate_music` for music and `generate_sound_effect` for sound effects. Joining audio with `merge_media` concatenates clips and does not layer them into a mix.

Import source audio through `../platform-upload.md` first.

## Speech model picker

Call `list_models({ category: "speech" })` and `get_model_params` before generation.

| Need                                                            | Model                  | Use                                                                                           |
| --------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------- |
| Cloned or designed voices, directed performances, or many speakers | `speech/fish-drama-3` | Private Character voices or public Fish voices; bracketed directions; up to 16 speakers through `extras.dialogue`; priced by UTF-8 bytes. |
| Steady professional read | `speech/elevenlabs-v2` | 29 languages; punctuation and sparse SSML breaks, no square-bracket performance tags. |
| Default for stock speech, audio tags, broad language coverage, multi-speaker dialogue | `speech/elevenlabs-v4` | Contextual delivery and reactions. |
| Broad voice and language selection with global emotion controls | `speech/minimax-hd`    | 300+ voices and 30+ languages. Use minimax-speech model reference.                              |
| Alternative two-speaker dialogue in one call | Google Flash or Flash-Lite TTS | Read `get_model_params` for that model's dialogue schema and stock voices. |
| Emotive performance tags                                        | `speech/orpheus`       | Supports cues such as `<laugh>`, `<sigh>`, and `<gasp>`.                                      |

For one-off matching from an authorized reference recording, use `speech/chatterbox` with chatterbox model reference. Keep reusable Character voices in the consent-gated clone workflow.

## ElevenLabs Multilingual v2

V2 (`speech/elevenlabs-v2`) detects language from text and has no `language_code`. Provide `extras.voice_settings` with stability, similarity_boost, style and speed. V2 supports `extras.previous_text` and `next_text` for continuity between chunks.

## ElevenLabs v4

- Use sparse audible tags such as `[whispers]`, `[excited]`, `[laughs]`, or `[long pause]`. Test sound effects and pronunciation.
- V4 supports Stability and Similarity in `extras.voice_settings`; it does not support speed, style, speaker boost, or SSML in this route.
- V4 speaks one voice per request. For two speakers in one call use Google Flash or Flash-Lite TTS (`speech/gemini-3.8-flash-tts`) with `extras.dialogue`; otherwise generate one take per speaker turn.

## Voice cloning and design

Use `makemancer-clone-voice` for the complete consent, recording, import, replacement, cloning, and audition workflow. Without audio, `clone_voice` clones nothing and returns the consent statement and the upload routes. `clone_voice` makes a private Fish clone and saves it on a Character; without `character_id` it creates a voice-only Character. Reuse it with `generate_speech({ character_id, model: "speech/fish-drama-3", text })`.

For a new voice from a description, use `design_voice` (see `makemancer-generate-voiceover`): three auditions, then save the pick to a Character. Designed voices are Fish voices and speak with `speech/fish-drama-3`.

Never call `clone_voice` or set `consent: true` unless the user explicitly confirms that the voice is their own or the speaker authorized cloning and use. Do not silently replace an existing Character voice.

## Transcription and cleanup

1. Pass a public social post (YouTube, TikTok, Instagram, Facebook, X, LinkedIn, Reddit), a public Google Drive share link, or a public media file URL directly to `transcribe({ video_url })`. Import the file first only when it is attached, local, or the post is private.
2. Use `isolate_audio` first only when noise, music, or reverb will materially hurt transcription.
3. Resolve its queued job with `check_job({ job_id })` when the cleaned URL is required.
4. Use `transcribe` for text and timing. YouTube and TikTok links return the platform's captions, and Instagram, Facebook, X and LinkedIn their transcript: timed `segments` with no speakers, and `words` spread evenly over each line (`wordTimingApproximate`). When there is none, or it is not in `language_code`, the same job transcribes the audio with word-level timing and speakers. For exact word timing on a captioned video, import it with `upload_asset` and transcribe the imported file.
5. Preserve the original asset and save the cleaned/transcribed derivative with clear metadata.

## Quality gate

Listen for pronunciation, clipped words, unnatural pauses, incorrect language/accent, tag leakage, background artifacts, and loudness changes between chunks. Regenerate only the bad segment when possible, then join approved audio with `merge_media`.
