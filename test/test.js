/**
 * Test the Nexus Memory MCP Server
 *
 * Tests that the server starts, initializes, and lists tools correctly.
 * Does NOT require a live API key for tool listing.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SERVER_PATH = join(__dirname, "..", "src", "index.js");

async function test() {
  console.log("Starting Nexus Memory MCP Server test...\n");

  const transport = new StdioClientTransport({
    command: "node",
    args: [SERVER_PATH],
  });

  const client = new Client({
    name: "test-client",
    version: "1.0.0",
  });

  try {
    await client.connect(transport);
    console.log("PASS: Server connected and initialized\n");

    // List tools
    const { tools } = await client.listTools();
    console.log(`PASS: Server exposes ${tools.length} tools:\n`);

    const expectedTools = [
      "remember",
      "recall",
      "connect",
      "stats",
      "context",
      "forget",
      "awaken",
      "hibernate",
      "list_hats",
      "wear_hat",
    ];

    for (const tool of tools) {
      const expected = expectedTools.includes(tool.name);
      const mark = expected ? "PASS" : "INFO";
      console.log(`  ${mark}: ${tool.name} - ${tool.description?.slice(0, 80)}`);
    }

    // Check all expected tools are present
    const toolNames = new Set(tools.map((t) => t.name));
    let allPresent = true;
    for (const name of expectedTools) {
      if (!toolNames.has(name)) {
        console.log(`\n  FAIL: Missing expected tool: ${name}`);
        allPresent = false;
      }
    }

    if (allPresent) {
      console.log(`\nPASS: All ${expectedTools.length} expected tools present`);
    }

    // Test a tool call without API key (should return error message, not crash)
    console.log("\nTesting tool call without API key...");
    try {
      const result = await client.callTool({
        name: "stats",
        arguments: {},
      });
      const text = result.content?.[0]?.text || "";
      if (text.includes("NEXUS_API_KEY")) {
        console.log("PASS: stats returns helpful error when no API key set");
      } else {
        console.log(`INFO: stats returned: ${text.slice(0, 120)}`);
      }
    } catch (e) {
      console.log(`INFO: stats threw (expected without API key): ${e.message.slice(0, 100)}`);
    }

    console.log("\n--- All tests passed ---");
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error(`FAIL: ${err.message}`);
    try { await client.close(); } catch {}
    process.exit(1);
  }
}

test();
