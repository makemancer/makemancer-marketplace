# Media import routing

Choose the route from where the file bytes are currently available. Do not substitute one route for another.

1. **Already pasted, attached, or generated in ChatGPT** → call `import_chatgpt_media` once per file. Pass the native ChatGPT file in `media_file`. Use the durable Makemancer URL returned by the tool. This tool exists only in ChatGPT; other clients do not have it.
2. **Readable local file in Codex, Claude Code, or another execution environment that can make an HTTP PUT** → call `get_upload_url` with the file's `content_type`, `type` and exact size in `bytes`, PUT the exact file bytes to `upload_url` with the returned headers within 15 minutes, then call `confirm_upload` with the returned asset ID. If the URL has expired, request a new one.
3. **The user still needs to choose a file from their device** → call `import_media` to open the interactive picker. Do not call it for a file already attached to the conversation.
4. **Public, directly downloadable HTTPS URL** → pass it directly to a compatible generation tool, or call `upload_asset` if it should be copied into the Makemancer library first. `upload_asset` returns the finished asset in the same call.
5. **Public social post** (YouTube, TikTok, Instagram, Facebook, X/Twitter, LinkedIn, Reddit) → `transcribe` takes it directly. For any other tool, call `upload_asset({ url })` (add `type: "audio"` for the audio only); it returns a job, so wait for `check_job` to complete and use the URL it returns. Private or deleted posts cannot be imported; other video sites are not supported, so ask the user for the file.

Never pass a local filesystem path or private conversation URL to `upload_asset`. Never call `confirm_upload` after `import_chatgpt_media`, `import_media`, or `upload_asset`; those routes already finalize the asset.

In ChatGPT, do not use `get_upload_url` for conversation attachments. The ChatGPT execution environment may be unable to resolve or reach the presigned upload host even though Makemancer itself can import the native file.
