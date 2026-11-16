# ElevenLabs v4 production guide

Use `speech/elevenlabs-v4` first for stock narration, acting and multilingual speech. Call `get_model_params({ model: "speech/elevenlabs-v4" })` for current voices, languages, settings and pricing. Use the [short model reference](elevenlabs-v4.md) when a brief reminder is enough.

## Cast the voice before writing directions

Pick a stock `voice_id` whose language, regional accent, age impression, and natural energy fit the brief. The same public ElevenLabs Voice Library IDs work with v4, as do the voices saved on a Character. An existing clone uses `character_id`; do not clone again just to change models. V4 can follow the source voice more faithfully than v3, including room noise, breathiness, and other source artifacts. A clean recording still matters. For an Instant Voice Clone, there is no extra v4 training step. Professional Voice Clones may need v4 fine-tuning through ElevenLabs.

Write the spoken words in the target language. Use `extras.language_code` for a short or ambiguous script, then audition the accent. V4 supports more than 90 languages. When a clone speaks a new language, it may adopt a fluent accent for that language rather than preserving the accent of the sample. Choose a native voice and test a sentence when accent is important.

## Shape a single speaker's performance

V4 uses the script's context, punctuation, and short square-bracket audio tags. Put a direction beside the line it affects. Keep tags sparse, and use wording that describes something audible. A tag is a cue, not a guaranteed instruction. If a user supplied exact words, preserve them and ask before adding spoken words or effects that would change the script.

| Goal | Original example text | Notes |
| --- | --- | --- |
| Quiet confidence | `We have time. Let's think this through.` | Start with natural punctuation; a tag may be unnecessary. |
| Whisper | `[whispers] The key is under the blue planter.` | The selected voice should suit quiet delivery. |
| Sudden realization | `Wait... [surprised] The lights are on upstairs!` | Ellipsis gives the turn a beat. |
| Warm relief | `[sighs] You're safe. I was starting to worry.` | Short nonverbal cue, then the spoken line. |
| Playful laugh | `[laughs] You named the cat Professor Buttons?` | Audition the laugh; it varies by voice. |
| Rising energy | `We made it. [excited] We actually made it!` | Put the tag at the emotional turn. |
| Measured reveal | `The answer was in the first photograph. [long pause] Look at the window.` | Use one pause where it changes the meaning. |
| Ambient effect | `[door slams] Nobody move.` | Sound effect interpretation can vary; test the result. |
| Pronunciation hint | `Welcome to /ˌbaɪoʊˈkemɪstri/ week.` | Inline IPA can guide a difficult word; verify the spoken output. |

Capitals and exclamation points can emphasize a phrase, but overuse can make a read shout. A written stage direction outside square brackets may be spoken aloud. V4 does not support SSML breaks or speed, style, and speaker boost controls in this Makemancer route. Use `extras.voice_settings.stability` and `similarity_boost` when needed. Start with defaults and adjust one setting after an audition. Lower Stability allows more variation; higher Stability favors consistency. Higher Similarity can strengthen identity but may also bring through source artifacts.

### Single speaker example

```json
{
  "model": "speech/elevenlabs-v4",
  "voice_id": "dXtC3XhB9GtPusIpNtQx",
  "text": "[whispers] Someone left a note by the door. [long pause] It has your name on it.",
  "extras": {
    "voice_settings": { "stability": 0.5, "similarity_boost": 0.75 },
    "timestamps": true
  }
}
```

For a saved clone, replace `voice_id` with `character_id`. The value must be an existing consented Character UUID.

## Production checks

- Audition a short passage when clone identity, accent, laughter, a sound effect, or pronunciation matters. Do not infer audio quality from metadata alone.
- Review the words in the completed result's `wordTimings`. Square-bracket directions may appear there because they are sent as delivery instructions. They are not intended as spoken words. If a tag is heard aloud, simplify or remove it and regenerate only after the user requests another take.
- For a long script, divide at sentence or paragraph boundaries. A v4 request allows up to 5,000 characters. For dialogue, ElevenLabs recommends at most 2,000 total characters; that is a reliability recommendation, not the limit.
- Estimate cost only when the user asks about cost or sets a budget.

## Provider references

- [ElevenLabs v4 overview](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4)
- [ElevenLabs speech prompting practices](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices)
- [ElevenLabs text to dialogue API](https://elevenlabs.io/docs/api-reference/text-to-dialogue/convert-with-timestamps)
