# Language and dialect routing

This is a routing snapshot from Makemancer's exposed schemas on 2026-09-22, not a promise of every upstream provider capability. get_model_params is authoritative for the current supported languages, selector names and voice IDs.

Choose language capability first, then a native-accent voice, then delivery. A multilingual model can speak a language without every voice sounding native. Cloned voices can carry the sample's original accent into other languages. For a stock voice in any language, call `search_voices` with `language` set to the language code first; the rows below cover models, clones and settings.

Before speech submission, follow [speech localization](speech-localization.md). Hebrew requires full niqqud on every spoken word unless the chosen model's get_model_params says otherwise, including narration, dialogue turns, clone tests and voice-design auditions. Preserve the intended wording while adding the points. Arabic always requires full tashkeel on every spoken word in the same places, vowelled for the requested dialect.

| Request | Starting choice and configuration |
| --- | --- |
| Hebrew | Stock voice: `search_voices` with `language: "he"`, then get_model_params for the returned model before writing the script. A cloned or designed voice: Fish Drama 3 through its Character, with full niqqud. Not v2. |
| Urdu | v4 with extras.language_code "ur" and a native Urdu voice. For requested Roman Urdu, preserve romanization and audition. Haseeb is a useful energetic candidate if returned by the current catalog. Not v2. |
| Persian | v4 with "fa"; MiniMax can use extras.language_boost "Persian". Not v2. |
| Bengali, Gujarati, Kannada, Malayalam, Marathi, Punjabi, Telugu | Check v4 with the exact returned language code and native voice. Do not choose v2 simply because it supports Hindi. |
| Cantonese | Check MiniMax with extras.language_boost "Chinese,Yue" and a matching voice. |
| Swedish | v4 with extras.language_code "sv" and a native Swedish voice, not an American shortlist voice. Sanna Hartfield or Olivia suit conversational and social copy, Elin suits commercials and clear narration, and Adam Composer or Ola Paulakoski suit warm narration. Audition a short line first. |
| Mixed languages | Check the selected model's automatic-language behavior. Audition a representative switch and proper names; a forced single-language code may hurt the second language. |

V2's current 29-language set: English, Japanese, Chinese, German, Hindi, French, Korean, Portuguese, Italian, Spanish, Indonesian, Dutch, Turkish, Filipino, Polish, Swedish, Bulgarian, Romanian, Arabic, Czech, Greek, Finnish, Croatian, Malay, Slovak, Danish, Tamil, Ukrainian and Russian.

Language selector differences matter:
- ElevenLabs v2: automatic detection from text, no language_code.
- ElevenLabs v4: extras.language_code using its own supported codes; never assume another model's enum is identical.
- MiniMax: extras.language_boost with names such as "Hebrew" or "Persian", not ISO codes.

Use native script unless the user requests romanization. Preserve approved wording, and audition names, numbers and acronyms. Adding required Hebrew niqqud or Arabic tashkeel does not require approval; ask before a phonetic rewrite that changes the words or intended reading. For an unsupported language, explain the limitation and offer a verified alternative rather than guessing a code.

Fish Drama 3 detects language from the transcript. `search_voices` offers Fish Official voices with masculine and feminine choices in all 27 catalog languages, including Hebrew stock voices Noa and Itai. Provider language labels do not establish a verified native accent. Use a suitable public voice or a consented clone and audition the target script, using full niqqud on every spoken Hebrew word and `extras.normalize: false`. Preserve the approved wording when adding vowel points. Language-switch tags are experimental on Drama 3. Fish preserves the supplied script and exposes `extras.normalize: false` when needed. Read [Fish guidance](fish.md), with 24 Drama 3 recipes, and current `get_model_params`. Do not send a language field.
