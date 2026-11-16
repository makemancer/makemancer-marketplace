# Video Review and Auto

Respect the user's saved render mode; you cannot change it for them. They switch it themselves in a Review card or in the account card that `manage_account` shows; `manage_account` with `section: "settings"` reports the current mode. Review applies only to `generate_video` and swaps, and only in apps that show cards (Claude and ChatGPT); other clients submit directly. Images, audio and edits start when requested.

- Review: `generate_video` returns `status: awaiting_approval` with a `request_id` and a request card. No video has been submitted or charged. Explain this and pause that generation branch. Do not resubmit, poll, or approve for the user.
- The user reviews the prompt, references, settings and estimate, then presses Generate in the card. When they see no card, give them `approvalUrl`; never open it for them. A prompt edited in the card is reported back to you; use the edited text from then on.
- When the video finishes, the card reports its job ID, URL and charge to you. If that report is missing when the user asks for the result or a later step needs it, find the video with `manage_account` (`section: "activity"` lists the latest generations with their output URLs) or `search_assets`. `check_job` takes job IDs, not a `request_id`.
- Auto: submit what the user asked for; anything beyond that needs their go-ahead.

The exact references shown with the video request are reviewed in that card, which is where the user approves them. Do not mark them approved before the user submits. A separately requested earlier image checkpoint and Character-save likeness approval still apply. The video Review card does not approve charges for image or audio generation that occurred beforehand.

A storyboard preview is a creative plan; generated stills may cost credits. A Review card is a proposed request, not playable footage. A generated first cut uses paid completed clips. Keep these meanings distinct.

Keep each shot's `request_id` until its job ID arrives, then keep the job ID. An approval is single-use and bound to its request. New shots, changed models/references/settings or replacement takes require their own authorized request and applicable Review approval. Status checks are not new generation requests.
