# Voice in video: one path per speaking shot

Choose from the material already available. One presenter image and finished speech go to H3 Max Lip Sync. For a new scene with interacting speakers or substantial body or camera movement, use native dialogue in a documented language, or Seedance 2.5, Seedance 2.0 Mini or H3 Max with the finished lines as voice references, and check the words. Existing footage with visible speech goes to `lip_sync_video` when the mouths need matching. Gemini Omni 1.2 Flash generates native sound and accepts no audio input. Mix off-screen narration over the footage.

## Whose voice

When a Character speaks and the voice is unknown and matters, ask one question:
- **Design** a new voice from a description: `design_voice`, three auditions. Pass one of the Character's lines (up to 150 characters) as the audition `text`.
- **Your own voice:** a consenting speaker's recording, cloned with `clone_voice` (makemancer-clone-voice); without audio it clones nothing and returns the consent statement and the upload routes.
- **Stock voice:** use `search_voices` for the spoken language and requested accent. Use the selected model and voice ID together. With the user's agreement, save the selection with `update_character({ id, voice_model, voice_id })`.

If the voice doesn't matter, pick a stock voice and name it. In ChatGPT the Voice Studio card saves the choice; read it back with `list_characters` rather than saving again.

Save the voice on the Character. Every line reuses `character_id` + `voice_option_id` + the same speech model and settings:
- Designed or cloned voice (Fish) → `speech/fish-drama-3`
- Stock voice → its saved model

**A recurring speaker becomes a Character.** When the same person will speak in more than one shot or video (a presenter, founder, doctor, creator or host, including a real person from a supplied photo), settle the voice before the first speaking shot, then offer once to save that person with their face references and the chosen voice as a Character (`create_character`, then the voice as above). Save only when the user agrees. Every later line and video then reuses the same face and voice instead of rebuilding them.

**Voices first for continuity.** When the user wants the same people across clips, make the voices before the video: settle each speaker's voice, generate every line with `generate_speech` in that voice, and send it with the shot (path B below: H3 Max Lip Sync for one person in view, otherwise Seedance 2.5, Seedance 2.0 Mini or H3 Max with the lines as voice references, then `lip_sync_video` if the mouths drift and the user asks). Native dialogue (path A) invents a new voice in every clip, and Gemini Omni takes no audio, so neither carries a recurring speaker.

When the user likes a generated look or voice, offer once to save it as a named Character for future work. Check `list_characters` first. A request to save already gives agreement. When authorized, update the existing Character or create one with the approved image or selected voice. Reuse its ID for later shots or speech. A voice-only Character works for a narrator.

## Pacing

At most 2.5 spoken words per clip second, with about 0.5 s of air at each end (5 s ≈ 10 words, 8 s ≈ 17). Lock clip durations from the speech result's `wordTimings`. Audition the shot's real first line with `generate_speech` and get it approved before paid video.

## Choose the path

First read the selected model's spoken-language guidance from `get_model_params({ model })`. Native dialogue (path A) needs a documented language. Finished speech driving H3 Max Lip Sync or `lip_sync_video` (path B) works in any language. For a talking face in an unsupported or unverified language, follow [spoken languages](spoken-languages.md).

**A. Native dialogue** (a native-audio model with documented support for the requested spoken language): quote the line and name the speaker. The model invents the voice, which can change between clips. Suitable only for a one-off where that variation is acceptable, never for a speaker who appears in another clip.

**B. Exact words or an exact voice with visible lips:** make the speech first. The speech is the finished line itself: `generate_speech` with the chosen voice, or a recording the user supplies. A voice sample, or audio cut from an earlier clip, is not the line; if that is all there is, clone or design the voice from it first, then generate each line. Then choose by what is on screen:
- **One person speaking, to camera or clearly in view** (presenter, doctor, founder, creator, spokesperson) → `video/minimax-h3-max-lip-sync`, in any language: `image_url` = the approved shot image with the face clearly visible, `extras.audio_url` = the finished line. The video is exactly as long as the audio and keeps it as the soundtrack, so the words come out exactly as recorded. Framing, wardrobe and setting come from the image; its prompt does not direct the acting or camera. The audio must be at least 5 seconds long; check its other limits with `get_model_params`. `video/heygen-avatar-4` takes the same image and the line in `audio_urls` when it is selected.
- **Several people in frame, a conversation, or a shot led by body performance or camera movement** → Seedance 2.5, Seedance 2.0 Mini or H3 Max with the finished lines in `audio_urls` plus an image or video reference, only when the requested language is documented for the selected model. These models perform the lines again from the reference: they can add, drop or repeat words even when the line is quoted, so check the result's words before using it, and offer `lip_sync_video` when the mouths must match. Check the model's own tokens and limits.
- **An existing video whose mouths must match a voice** (new or corrected speech, a dub, a voice that drifted; real people, cartoons, 3D characters or animals; one speaker or several) → `lip_sync_video`, not `generate_video`: `video_url` = the clip, `audio_url` = the finished line or full track, which replaces the video's audio, or no `audio_url` when the video already has the voice in it. Lengths need not match: a longer voice holds the last frame. Music in the track is fine. Leave `model` out; use `model: "sync-3"` only when the user asks for Sync 3. Only the speaking character's lower face changes, one line at a time. When the voice is shorter than the video and belongs at a set moment, `audio_start_seconds` says where it starts; only that stretch is lip-synced. It follows Review and Auto and finishes through `check_job`: a short clip takes about a minute and a half, a minute of dialogue about five minutes. Never silently replace a model the user selected.

In any prompt for a model that speaks, quote only the words to be said. Keep production labels (scene numbers, "ONLY", notes about other shots) out of the prompt: speaking models can read them aloud.

Gemini Omni accepts no audio input on the current route. Don't pay for speech first and then send the shot to Omni; use path A, or a model above. If a generated performance drifts from the prepared recording, replacing its soundtrack does not fix mouth timing. Use a requested lip-sync repair with `lip_sync_video`, preserving an explicit model choice, or an authorized new audio-driven take. Add an audio overlay alone only for voiceover without visible speech or when matching lip timing has actually been verified.

**C. Voiceover, no visible speaker:** prompt "no dialogue, no music", then lay the speech over the clip with `add_audio_to_video` (`audio_mode: "mix"` keeps the clip's own sound).

**D. UGC creator:** A for a quick one-off; B when the creator recurs or the script is exact.

## Mix

- `add_audio_to_video` with `audio_mode: "mix"` keeps the clip's own sound and layers the new track over it at the video's length. Set `original_volume` and `added_volume` (0–1; about 0.3 for music under speech). `start_offset` delays the new track.
- `audio_mode: "replace"` (the default) discards the clip's audio and ends at the shorter input.
- `stitch_clips` with one clip plus `audio: { url, start_delay_seconds }` layers the track at full level and can run past the clip's end.
- `assemble_film` narration replaces every shot's audio. Set `with_narration: false` when shots carry dialogue.

## Order

Dialogue per shot (no music or background ambience in the clips) → `assemble_film` (`with_narration: false` if shots speak) → `add_subtitles` → scene ambience bed, then music, each with `add_audio_to_video` `audio_mode: "mix"` ([media assembly](../media-assembly.md)) → check the duration, that the dialogue survived and that no join changes background.
