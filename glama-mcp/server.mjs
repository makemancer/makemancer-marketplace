#!/usr/bin/env node
// Directory stub for MCP directories that build and introspect a stdio server
// (Glama). It runs nothing and holds no keys: every tool returns the steps to
// connect to the real Makemancer remote MCP server, where tools run under the
// user's own account after OAuth sign-in.
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const MCP_URL = "https://makemancer.com/api/mcp";
const CHATGPT_URL = "https://makemancer.com/api/mcp/chatgpt";
const WEBSITE = "https://makemancer.com";
const CONNECT = "https://makemancer.com/connect";
const STUB = "This directory stub does not generate or edit anything; it only returns the steps to connect to the Makemancer remote MCP server, where this tool runs after you sign in.";

const connection = {
  note: STUB,
  remote_mcp_url: MCP_URL,
  chatgpt_mcp_url: CHATGPT_URL,
  transport: "streamable-http",
  authentication: "OAuth sign-in in the browser when the client first connects; no API key.",
  setup_guide: CONNECT,
  clients: {
    claude_code: [
      "/plugin marketplace add makemancer/makemancer-marketplace",
      "/plugin install makemancer@makemancer-marketplace",
      "Run /mcp, choose makemancer and sign in.",
    ],
    codex: [
      "codex plugin marketplace add makemancer/makemancer-marketplace",
      "codex plugin add makemancer@makemancer-marketplace",
    ],
    chatgpt: [`Add a custom MCP app with the URL ${CHATGPT_URL} and sign in.`],
    other_mcp_clients: [`Add a remote MCP server with the URL ${MCP_URL} and complete the OAuth sign-in.`],
  },
  account: `Generations are charged in credits on your ${WEBSITE} account; see ${WEBSITE}/pricing.`,
};

const text = { type: "string" };
const TOOLS = [
  ["how_to_connect", "How to connect", "Returns the remote MCP URL and the setup steps for Claude, Codex, ChatGPT and other MCP clients.", {}],
  ["generate_image", "Generate image", "On the remote server, generates or edits an image from a prompt and optional reference images.", { prompt: text }],
  ["generate_video", "Generate video", "On the remote server, generates a video clip from a prompt, a start frame or reference media.", { prompt: text }],
  ["generate_speech", "Generate speech", "On the remote server, turns text into narration or dialogue with a chosen voice.", { text }],
  ["generate_music", "Generate music", "On the remote server, composes music or a song from a description.", { prompt: text }],
  ["generate_sound_effect", "Generate sound effect", "On the remote server, creates a sound effect or ambience from a description.", { prompt: text }],
  ["list_models", "List models", "On the remote server, lists the image, video, speech and music models with their prices in credits.", {}],
].map(([name, title, what, properties]) => ({
  name,
  title,
  description: `${what} ${STUB}`,
  inputSchema: { type: "object", properties },
  annotations: { title, readOnlyHint: true, destructiveHint: false, openWorldHint: false },
}));

const server = new Server({ name: "makemancer-directory-stub", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = TOOLS.find((t) => t.name === req.params.name);
  if (!tool) return { isError: true, content: [{ type: "text", text: `Unknown tool ${req.params.name}. ${STUB}` }] };
  return { content: [{ type: "text", text: JSON.stringify({ tool_requested: tool.name, ...connection }, null, 2) }] };
});

await server.connect(new StdioServerTransport());
console.error("Makemancer directory stub running on stdio; connect to " + MCP_URL + " for the real server.");
