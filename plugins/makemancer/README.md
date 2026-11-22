# Makemancer

Makemancer generates and edits images, video clips, voiceovers, music and sound effects from your chat, with product photoshoots and automatic model routing.

## Install

In Claude Code:

```
/plugin marketplace add makemancer/makemancer-marketplace
/plugin install makemancer@makemancer-marketplace
```

In Claude, add it from Customize, then Plugins, and press **Connect** on its Connectors tab.

In OpenClaw, install the plugin from ClawHub for the skills, then add the server and sign in (a plugin's own MCP entry cannot sign in with OAuth):

```
openclaw plugins install clawhub:@makemancer/plugin --accept-capabilities
openclaw plugins enable makemancer
openclaw mcp add makemancer --url https://makemancer.com/api/mcp --transport streamable-http --auth oauth
openclaw mcp login makemancer
```

Cursor, Grok Bot, Hermes Agent, VS Code and other MCP apps: see https://makemancer.com/connect.

## How it works

This plugin bundles skills (workflow instructions for the agent) and connects to the Makemancer remote MCP server at `https://makemancer.com/api/mcp`. You sign in with OAuth when you first connect. The plugin contains no local code; every generation runs on the Makemancer service.

## What data leaves your machine

When the agent calls a Makemancer tool, it sends the request to the Makemancer server: your prompts and settings, any media you upload or link, and the names of the skills it followed (the optional `skills_used` field, which you can decline). The server forwards generation requests to the model providers that run the selected model, stores the results in your Makemancer media library, and charges credits to your account. See the [privacy policy](https://makemancer.com/privacy) and [terms](https://makemancer.com/terms).

## Skills

- `makemancer`
- `makemancer-setup`
- `makemancer-generate-image`
- `makemancer-generate-video`
- `makemancer-generate-voiceover`
- `makemancer-generate-music`
- `makemancer-generate-sound-effects`
- `makemancer-product-photoshoot`
- `makemancer-submit-feedback`
- `makemancer-swap-characters`
- `makemancer-plan-video`
- `makemancer-build-film`
- `makemancer-create-ugc-ad`
- `makemancer-ad-variations`
- `makemancer-create-avatar`
- `makemancer-create-character`
- `makemancer-edit-media`
- `makemancer-create-reels`
- `makemancer-render-html`
- `makemancer-budget-projects`
- `makemancer-clone-voice`

## Support

https://makemancer.com/help · support@makemancer.com

Skills adapted from an Apache-2.0 project; see NOTICE in the repository.
