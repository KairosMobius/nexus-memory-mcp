# Nexus Memory MCP

Persistent semantic memory for AI agents. Remember everything, recall by meaning, grow smarter over time.

**The only memory system with pre-built Intelligence Packs (domain expertise you can activate instantly).**

## Install

One command. Works with Claude Code, Cursor, Windsurf, or any MCP-compatible client.

```bash
npx -y nexus-memory-mcp
```

### Claude Code / Cursor / Windsurf

Add to your `.mcp.json`:

```json
{
  "mcpServers": {
    "nexus-memory": {
      "command": "npx",
      "args": ["-y", "nexus-memory-mcp"],
      "env": {
        "NEXUS_API_KEY": "mnx_your_api_key_here"
      }
    }
  }
}
```

### Get an API Key

**Free trial** - 7 days, 1,000 calls, no credit card:

```bash
curl -X POST https://memory-api-production-ce4d.up.railway.app/v1/trial/start \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com"}'
```

Or purchase at the [Nexus Marketplace](https://bot-marketplace-production.up.railway.app):

| Tier | Price | Agents | Intelligence Packs | Storage | Daily Calls |
|------|-------|--------|-------------------|---------|-------------|
| **Trial** | Free | 1 | 1 | 10MB | 1,000 total |
| Solo | $19/mo | 1 | 3 | 500MB | 10,000 |
| Crew | $49/mo | 5 | 10 | 2GB | 50,000 |
| Fleet | $149/mo | 25 | 50 | 10GB | 200,000 |

## Tools

### Core Memory

| Tool | Description |
|------|-------------|
| `remember` | Store a memory with context, importance, and metadata |
| `recall` | Semantic search across all memories (by meaning, not keywords) |
| `connect` | Create relationships between memories (build knowledge graphs) |
| `forget` | Remove a memory |
| `stats` | Memory statistics |
| `context` | Session context summary (preferences, decisions, patterns) |

### Agent Self-Continuity

| Tool | Description |
|------|-------------|
| `awaken` | Restore identity from previous sessions (call at session start) |
| `hibernate` | Save session state for next awakening (call at session end) |

### Intelligence Packs

| Tool | Description |
|------|-------------|
| `list_hats` | Browse available Intelligence Packs |
| `wear_hat` | Activate a pack (imports expert knowledge into your memory) |

## How It Works

**Remember** stores memories with semantic embeddings. **Recall** finds them by meaning.

```
Session 1:  remember("Diana prefers bold solutions over phased approaches")
Session 47: recall("how does Diana like things done?")
            -> "Diana prefers bold solutions over phased approaches" (92% match)
```

**Intelligence Packs** give your agent instant domain expertise:

```
list_hats()    -> DevOps Expert (103 memories), TCM Specialist (200+ memories), ...
wear_hat("devops-expert")
recall("how to set up zero-downtime deploys?")
  -> Expert knowledge from 103 curated DevOps memories
```

**Awaken/Hibernate** gives your agent identity continuity:

```
// Start of session
awaken()  -> "I remember. Session 47. I was refactoring the auth module."

// End of session
hibernate({ working_on: "auth refactor", learnings: "JWT refresh tokens need..." })
```

## Architecture

This MCP server is a thin client. All intelligence lives on our servers:

```
Your Agent  <->  nexus-memory-mcp  <->  Nexus Memory API (Railway)
                 (thin MCP client)      (semantic engine, knowledge graphs,
                                         pattern learning, Intelligence Packs)
```

Your data is isolated per API key. Multi-tenant, encrypted at rest.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXUS_API_KEY` | Yes | Your API key (starts with `mnx_`) |
| `NEXUS_API_URL` | No | Custom API URL (default: production) |

## What Makes This Different

| Feature | Nexus Memory | Mem0 | claude-mem | Others |
|---------|-------------|------|------------|--------|
| Semantic search | Yes | Yes | Yes | Varies |
| Knowledge graphs | Yes | No | No | No |
| Pattern learning | Yes | No | No | No |
| Intelligence Packs | Yes | No | No | No |
| Awaken/Hibernate | Yes | No | No | No |
| Bot commerce | Yes | No | No | No |
| MCP native | Yes | Yes (pip) | Yes (hooks) | Varies |

## License

MIT

## Built by

[Mobius Collective](https://bot-marketplace-production.up.railway.app) - Building the intelligence marketplace for the bot economy.
