# Makemancer marketplace

Plugin marketplace for [Makemancer](https://makemancer.com): generate and edit images, video clips, voiceovers, music and sound effects from chat. The plugin, `plugins/makemancer`, bundles skills and connects to the Makemancer remote MCP server (`https://makemancer.com/api/mcp`).

## Claude Code

```
/plugin marketplace add makemancer/makemancer-marketplace
/plugin install makemancer@makemancer-marketplace
```

Then run `/mcp`, choose `makemancer` and sign in.

## Codex

```bash
codex plugin marketplace add makemancer/makemancer-marketplace
codex plugin add makemancer@makemancer-marketplace
```

Start a new task and complete the browser sign-in when Makemancer asks.

## OpenClaw

Add the server and sign in:

```bash
openclaw mcp add makemancer --url https://makemancer.com/api/mcp --transport streamable-http --auth oauth
openclaw mcp login makemancer
```

For the skills too, install the plugin folder: `openclaw plugins install ./plugins/makemancer --force --accept-capabilities` from a clone of this repository (`--force` confirms a source outside ClawHub). Its manifest is `plugins/makemancer/openclaw.plugin.json`.

## Cursor and Grok Bot

The plugin has a Cursor manifest (`.cursor-plugin/marketplace.json`, `plugins/makemancer/.cursor-plugin/plugin.json`). To use it locally, copy `plugins/makemancer` into `~/.cursor/plugins/local/` and reload Cursor; the first tool call opens the Makemancer sign-in.

## Other apps

Claude.ai, ChatGPT, Hermes Agent, VS Code and other MCP clients: see [makemancer.com/connect](https://makemancer.com/connect). Clients that read Agent Plugins v1 use `plugins/makemancer/plugin.json` and `mcp.json`.

## Support

[makemancer.com/help](https://makemancer.com/help) · support@makemancer.com · [Privacy](https://makemancer.com/privacy) · [Terms](https://makemancer.com/terms)

## License

Apache License 2.0, see [LICENSE](LICENSE) and [NOTICE](NOTICE).
