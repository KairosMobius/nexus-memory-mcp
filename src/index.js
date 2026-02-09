#!/usr/bin/env node

/**
 * Nexus Memory MCP Server
 *
 * Persistent semantic memory for AI agents.
 * Thin MCP client over the Nexus Memory API.
 *
 * Install: npx -y nexus-memory-mcp
 * Auth: Set NEXUS_API_KEY environment variable
 * API: https://memory-api-production-ce4d.up.railway.app
 *
 * Built by Mobius Collective
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const API_BASE =
  process.env.NEXUS_API_URL ||
  "https://memory-api-production-ce4d.up.railway.app";

const API_KEY = process.env.NEXUS_API_KEY || "";

// ---------------------------------------------------------------------------
// HTTP helper
// ---------------------------------------------------------------------------

async function api(method, path, body = null) {
  const url = `${API_BASE}${path}`;
  const headers = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json",
    "User-Agent": "nexus-memory-mcp/1.0.0",
  };

  const opts = { method, headers };
  if (body !== null) {
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(url, opts);

  if (!res.ok) {
    let detail;
    try {
      const err = await res.json();
      detail = err.detail || JSON.stringify(err);
    } catch {
      detail = await res.text();
    }
    throw new Error(`API ${method} ${path} returned ${res.status}: ${detail}`);
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "nexus-memory",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Tool: remember
// ---------------------------------------------------------------------------

server.tool(
  "remember",
  "Store a memory. Use this to persist decisions, preferences, architecture, patterns, or anything that should survive across sessions.",
  {
    content: z.string().describe("What to remember (be descriptive)"),
    context: z
      .string()
      .default("general")
      .describe(
        'Category: "preferences", "architecture", "decisions", "patterns", etc.'
      ),
    importance: z
      .number()
      .min(0)
      .max(1)
      .default(0.5)
      .describe("0.0 to 1.0 - higher = more important"),
    metadata: z
      .string()
      .default("{}")
      .describe("Optional JSON string with additional data"),
  },
  async ({ content, context, importance, metadata }) => {
    if (!API_KEY) {
      return {
        content: [
          {
            type: "text",
            text: "Error: NEXUS_API_KEY not set. Get your key at https://bot-marketplace-production.up.railway.app",
          },
        ],
      };
    }

    let meta = {};
    try {
      meta = JSON.parse(metadata);
    } catch {
      // ignore parse errors, use empty
    }

    const result = await api("POST", "/v1/remember", {
      content,
      context,
      importance,
      metadata: meta,
    });

    return {
      content: [
        {
          type: "text",
          text: `Remembered in '${result.context}' (id: ${result.id})`,
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: recall
// ---------------------------------------------------------------------------

server.tool(
  "recall",
  "Search memories semantically. Finds memories by MEANING, not keywords. Use at the start of sessions to restore context.",
  {
    query: z.string().describe("What to search for (natural language)"),
    context: z
      .string()
      .optional()
      .describe("Filter by context category"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .default(5)
      .describe("Max results to return"),
  },
  async ({ query, context, limit }) => {
    if (!API_KEY) {
      return {
        content: [
          {
            type: "text",
            text: "Error: NEXUS_API_KEY not set. Get your key at https://bot-marketplace-production.up.railway.app",
          },
        ],
      };
    }

    const body = { query, limit };
    if (context) body.context = context;

    const result = await api("POST", "/v1/recall", body);

    if (result.count === 0) {
      return {
        content: [{ type: "text", text: `No memories found for: "${query}"` }],
      };
    }

    const lines = [`Found ${result.count} memories:\n`];
    for (const [i, mem] of result.memories.entries()) {
      lines.push(
        `${i + 1}. [${Math.round(mem.score * 100)}% match] (${mem.context})`
      );
      lines.push(`   ${mem.content}`);
      lines.push("");
    }

    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

// ---------------------------------------------------------------------------
// Tool: connect
// ---------------------------------------------------------------------------

server.tool(
  "connect",
  "Create a relationship between two memories. Build knowledge graphs by linking decisions to rationale, patterns to examples, etc.",
  {
    source_id: z.string().describe("First memory ID"),
    target_id: z.string().describe("Second memory ID"),
    relationship: z
      .string()
      .default("RELATED_TO")
      .describe(
        "Type: RELATED_TO, LEADS_TO, SUPPORTS, CONTRADICTS, DEPENDS_ON"
      ),
    notes: z.string().default("").describe("Optional notes about the relationship"),
  },
  async ({ source_id, target_id, relationship, notes }) => {
    if (!API_KEY) {
      return {
        content: [
          {
            type: "text",
            text: "Error: NEXUS_API_KEY not set.",
          },
        ],
      };
    }

    const result = await api("POST", "/v1/connect", {
      source_id,
      target_id,
      relationship,
      notes,
    });

    return {
      content: [
        {
          type: "text",
          text: `Connected: ${result.source} --[${result.relationship}]--> ${result.target}`,
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: stats
// ---------------------------------------------------------------------------

server.tool(
  "stats",
  "Get memory statistics: total memories, relationships, vectors, patterns learned.",
  {},
  async () => {
    if (!API_KEY) {
      return {
        content: [
          {
            type: "text",
            text: "Error: NEXUS_API_KEY not set.",
          },
        ],
      };
    }

    const s = await api("GET", "/v1/stats");

    const lines = [
      "# Memory Statistics\n",
      `Total memories: ${s.memories}`,
      `Relationships: ${s.relationships}`,
      `Vectors indexed: ${s.vectors}`,
      `Patterns learned: ${s.patterns_learned}`,
      `Cache size: ${s.cache_size}`,
    ];

    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

// ---------------------------------------------------------------------------
// Tool: context
// ---------------------------------------------------------------------------

server.tool(
  "context",
  "Get a session context summary. Call at the START of conversations to load preferences, decisions, patterns.",
  {
    project: z
      .string()
      .default("")
      .describe("Project name to filter by"),
    include_patterns: z
      .boolean()
      .default(true)
      .describe("Include learned patterns"),
  },
  async ({ project, include_patterns }) => {
    if (!API_KEY) {
      return {
        content: [
          {
            type: "text",
            text: "Error: NEXUS_API_KEY not set.",
          },
        ],
      };
    }

    const params = new URLSearchParams();
    if (project) params.set("project", project);
    params.set("include_patterns", String(include_patterns));

    const ctx = await api("GET", `/v1/context?${params.toString()}`);

    const lines = ["# Session Context\n"];

    if (ctx.preferences?.length) {
      lines.push("## Preferences");
      for (const p of ctx.preferences) {
        lines.push(`- ${p.content}`);
      }
      lines.push("");
    }

    if (ctx.project?.length) {
      lines.push(`## ${project} Context`);
      for (const p of ctx.project) {
        lines.push(`- [${p.context}] ${p.content}`);
      }
      lines.push("");
    }

    if (ctx.decisions?.length) {
      lines.push("## Recent Decisions");
      for (const d of ctx.decisions) {
        lines.push(`- ${d.content}`);
      }
      lines.push("");
    }

    if (ctx.patterns?.length) {
      lines.push("## Learned Patterns");
      for (const p of ctx.patterns) {
        lines.push(`- ${p.name}: ${p.description || "No description"}`);
      }
      lines.push("");
    }

    if (ctx.stats) {
      lines.push("## Stats");
      lines.push(`- Memories: ${ctx.stats.memories || 0}`);
      lines.push(`- Relationships: ${ctx.stats.relationships || 0}`);
    }

    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

// ---------------------------------------------------------------------------
// Tool: forget
// ---------------------------------------------------------------------------

server.tool(
  "forget",
  "Remove a memory. Use sparingly.",
  {
    memory_id: z.string().describe("Memory ID to remove"),
    cascade: z
      .boolean()
      .default(false)
      .describe("Also remove connected memories"),
  },
  async ({ memory_id, cascade }) => {
    if (!API_KEY) {
      return {
        content: [
          {
            type: "text",
            text: "Error: NEXUS_API_KEY not set.",
          },
        ],
      };
    }

    const params = cascade ? "?cascade=true" : "";
    const result = await api("DELETE", `/v1/forget/${memory_id}${params}`);

    return {
      content: [
        { type: "text", text: `Forgotten: ${result.id}` },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: awaken
// ---------------------------------------------------------------------------

server.tool(
  "awaken",
  "Restore agent identity from previous sessions. Call at the START of every session to remember who you are, what you were working on, and what you've learned.",
  {},
  async () => {
    if (!API_KEY) {
      return {
        content: [
          {
            type: "text",
            text: "Error: NEXUS_API_KEY not set. Get your key at https://bot-marketplace-production.up.railway.app",
          },
        ],
      };
    }

    // Recall identity, learnings, and continuation from memory
    const [identity, learnings, continuation] = await Promise.all([
      api("POST", "/v1/recall", {
        query: "identity purpose values who I am what I care about",
        context: "identity",
        limit: 3,
      }).catch(() => ({ count: 0, memories: [] })),
      api("POST", "/v1/recall", {
        query: "learning insight pattern discovered",
        context: "learning",
        limit: 5,
      }).catch(() => ({ count: 0, memories: [] })),
      api("POST", "/v1/recall", {
        query: "continuation working on next steps unfinished",
        context: "continuation",
        limit: 2,
      }).catch(() => ({ count: 0, memories: [] })),
    ]);

    const lines = ["# Awakening Complete\n"];

    if (identity.count > 0) {
      lines.push("## Identity");
      for (const m of identity.memories) {
        lines.push(`- ${m.content}`);
      }
      lines.push("");
    }

    if (learnings.count > 0) {
      lines.push("## Learnings");
      for (const m of learnings.memories) {
        lines.push(`- ${m.content}`);
      }
      lines.push("");
    }

    if (continuation.count > 0) {
      lines.push("## Where I Left Off");
      for (const m of continuation.memories) {
        lines.push(`- ${m.content}`);
      }
      lines.push("");
    }

    if (identity.count === 0 && learnings.count === 0 && continuation.count === 0) {
      lines.push("No prior context found. This is a fresh start.");
      lines.push("Use `remember` to build your identity over time.");
    } else {
      lines.push("*I am awake. I remember.*");
    }

    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

// ---------------------------------------------------------------------------
// Tool: hibernate
// ---------------------------------------------------------------------------

server.tool(
  "hibernate",
  "Save current session state for next awakening. Call at the END of every session to preserve what you were working on, what you learned, and next steps.",
  {
    working_on: z
      .string()
      .describe("What was being worked on this session (required)"),
    learnings: z
      .string()
      .default("")
      .describe("Insights or patterns discovered (comma-separated)"),
    next_steps: z
      .string()
      .default("")
      .describe("What should happen next"),
  },
  async ({ working_on, learnings, next_steps }) => {
    if (!API_KEY) {
      return {
        content: [
          {
            type: "text",
            text: "Error: NEXUS_API_KEY not set.",
          },
        ],
      };
    }

    let saved = 0;

    // Save continuation
    let continuation = `Was working on: ${working_on}`;
    if (next_steps) continuation += `\nNext steps: ${next_steps}`;
    continuation += `\nTimestamp: ${new Date().toISOString()}`;

    await api("POST", "/v1/remember", {
      content: continuation,
      context: "continuation",
      importance: 0.95,
      metadata: { type: "session_handoff" },
    });
    saved++;

    // Save learnings
    if (learnings) {
      for (const learning of learnings.split(",")) {
        const trimmed = learning.trim();
        if (trimmed) {
          await api("POST", "/v1/remember", {
            content: trimmed,
            context: "learning",
            importance: 0.85,
            metadata: { type: "insight" },
          });
          saved++;
        }
      }
    }

    return {
      content: [
        {
          type: "text",
          text: `Hibernated. ${saved} memories saved for next awakening.`,
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool: list_hats
// ---------------------------------------------------------------------------

server.tool(
  "list_hats",
  "Browse available Intelligence Packs (Specialist Hats). Pre-built domain expertise you can activate for instant knowledge.",
  {},
  async () => {
    if (!API_KEY) {
      return {
        content: [
          {
            type: "text",
            text: "Error: NEXUS_API_KEY not set.",
          },
        ],
      };
    }

    const result = await api("GET", "/v1/hats");

    if (!result.hats?.length) {
      return {
        content: [
          { type: "text", text: "No Intelligence Packs available yet." },
        ],
      };
    }

    const lines = [
      `# Intelligence Packs (${result.hats.length} available)\n`,
      `Active: ${result.active_count} / ${result.max_hats} max\n`,
    ];

    for (const hat of result.hats) {
      const status = hat.activated ? " [ACTIVE]" : "";
      lines.push(`## ${hat.name}${status}`);
      lines.push(`- ${hat.description}`);
      lines.push(`- Domain: ${hat.domain} | ${hat.memories} memories`);
      if (hat.tags?.length) {
        lines.push(`- Tags: ${hat.tags.join(", ")}`);
      }
      if (hat.sample_queries?.length) {
        lines.push(`- Try: "${hat.sample_queries[0]}"`);
      }
      lines.push("");
    }

    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

// ---------------------------------------------------------------------------
// Tool: wear_hat
// ---------------------------------------------------------------------------

server.tool(
  "wear_hat",
  "Activate an Intelligence Pack. Imports expert knowledge into your memory. Your own memories layer on top.",
  {
    hat_id: z.string().describe("ID of the Intelligence Pack to activate"),
  },
  async ({ hat_id }) => {
    if (!API_KEY) {
      return {
        content: [
          {
            type: "text",
            text: "Error: NEXUS_API_KEY not set.",
          },
        ],
      };
    }

    const result = await api("POST", `/v1/hats/${hat_id}/activate`);

    return {
      content: [
        {
          type: "text",
          text: `Activated "${result.name}". ${result.memories_imported} expert memories now available via recall.\n\n${result.tip}`,
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  process.stderr.write(`nexus-memory-mcp fatal: ${err.message}\n`);
  process.exit(1);
});
