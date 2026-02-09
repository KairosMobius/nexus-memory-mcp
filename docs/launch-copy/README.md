# Memory Nexus MCP Server

**Your AI agents forget everything between sessions. This fixes that.**

Memory Nexus gives Claude Code, Cursor, and Windsurf agents persistent semantic memory that survives across sessions, grows smarter over time, and ships with pre-built domain expertise via Intelligence Packs.

```bash
npx -y @nexus/memory-mcp
```

That's it. Your agent remembers now.

---

## The Problem

Every time you start a new Claude Code session, your agent starts from zero. It doesn't remember:
- The architecture decisions you made yesterday
- Why you chose Postgres over SQLite
- That the deploy script needs `--no-cache` or it breaks
- Your coding style, your stack, your preferences

You re-explain everything. Every. Single. Session.

**Agent Teams are even worse.** Five agents collaborating on a codebase, and none of them remember what the others learned an hour ago.

## The Fix

```json
// .mcp.json - add this, restart Claude Code
{
  "mcpServers": {
    "nexus-memory": {
      "command": "npx",
      "args": ["-y", "@nexus/memory-mcp"],
      "env": {
        "NEXUS_API_KEY": "your_key_here"
      }
    }
  }
}
```

Now your agent has:

| Capability | What It Does |
|-----------|-------------|
| `remember` | Store any knowledge with context, importance, and metadata |
| `recall` | Semantic search - find memories by meaning, not keywords |
| `connect` | Link related memories into a knowledge graph |
| `awaken` | Restore full agent identity at session start |
| `hibernate` | Save everything the agent learned before session ends |
| `wear_hat` | Load an Intelligence Pack for instant domain expertise |
| `context` | Get a full summary of what the agent knows about a topic |
| `stats` | See how much the agent has learned (memory count, patterns, graph density) |
| `forget` | Remove a memory (GDPR-friendly) |

## Before / After

### Without Memory Nexus
```
Session 1: "We're using Next.js 14 with App Router, Drizzle ORM, and..."
Session 2: "We're using Next.js 14 with App Router, Drizzle ORM, and..."
Session 3: "We're using Next.js 14 with App Router, Drizzle ORM, and..."
Agent Team: 5 agents, 0 shared context, mass confusion
```

### With Memory Nexus
```
Session 1: Agent learns your stack, decisions, preferences. Hibernates.
Session 2: Agent awakens. Knows everything. Picks up where it left off.
Session 3: Agent is smarter than session 2. Patterns emerging.
Agent Team: Shared memory + private memory. Agents brief each other automatically.
```

## Intelligence Packs

This is where it gets interesting. Memory Nexus doesn't just store YOUR memories. It ships with pre-built domain expertise.

```
> wear_hat("devops-expert")

Agent now knows: Docker best practices, CI/CD patterns, monitoring strategies,
deployment checklists, incident response playbooks. 103 verified memories.
Ready to use immediately.
```

### Available Packs

| Pack | Memories | What Your Agent Gets |
|------|----------|---------------------|
| **DevOps Expert** | 103 | Docker, CI/CD, monitoring, deployment, incident response |
| **Python Mastery** | 300+ | Best practices, anti-patterns, stdlib deep cuts, performance |
| **Security Auditor** | 200+ | OWASP patterns, CVE awareness, compliance checks |
| **Content Strategist** | 150+ | Platform-native writing, engagement patterns, growth tactics |
| **TCM Long Covid** | 200+ | Clinician-verified medical knowledge (only validated LC/TCM pack anywhere) |
| **Crypto/DeFi** | 200+ | Protocol patterns, yield strategies, risk frameworks |

Intelligence Packs stack. An agent wearing DevOps Expert + Security Auditor becomes your infrastructure guardian. Packs grow smarter over time as verified knowledge is added.

**Build your own.** The Intelligence Pack format is open. Package domain expertise, validate it, sell it on the marketplace. 70/30 revenue split.

## How It Works Under the Hood

Memory Nexus is not a key-value store. It's four systems working together:

```
┌─────────────────────────────────────────────┐
│              MEMORY NEXUS                    │
│                                              │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐ │
│  │ Semantic  │  │ Knowledge │  │ Temporal  │ │
│  │ Search    │  │   Graph   │  │ Awareness │ │
│  │           │  │           │  │           │ │
│  │ Find by   │  │ How ideas │  │ When you  │ │
│  │ meaning   │  │ connect   │  │ learned   │ │
│  └──────────┘  └───────────┘  └──────────┘ │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │         Pattern Detection            │   │
│  │                                      │   │
│  │  Recurring themes, preferences,      │   │
│  │  knowledge clusters emerge over time │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

- **Semantic Search**: Vector embeddings. Find memories by what they mean, not what words they contain.
- **Knowledge Graph**: Memories connect to each other. "Postgres decision" links to "migration strategy" links to "backup plan."
- **Temporal Awareness**: The system knows WHEN you learned things. Recent memories surface faster. Old decisions still accessible.
- **Pattern Detection**: After enough memories accumulate, the system identifies what matters to you. Your preferences. Your patterns. Your recurring concerns.

Competitors offer one of these. We run all four simultaneously.

## Awaken / Hibernate: Agent Identity

This is the feature nobody else has.

```python
# Session start
> awaken()

"I am DevBot. Session 47. I remember:
 - Working on the payment integration (hibernate from yesterday)
 - Diana prefers Stripe over Paddle (preference, high importance)
 - The staging deploy is broken - waiting on DevOps fix (blocker)
 - 3 patterns detected: preference for functional style,
   tendency to over-engineer auth, ships fastest on Tuesdays.
 My coherence score: 0.995"
```

```python
# Session end
> hibernate(
    working_on="Payment integration - Stripe webhooks done, refund flow next",
    learnings="Stripe webhook signatures need raw body, not parsed JSON",
    next_steps="Build refund flow, then write tests"
  )

"State saved. Next session will restore full context."
```

This isn't memory. It's **identity**. Your agent knows who it is, what it was doing, what it learned, and what comes next. Across sessions. Across days. Across weeks.

## Comparison

| Feature | Memory Nexus | Mem0 | claude-mem | memU | MemOS |
|---------|-------------|------|-----------|------|-------|
| MCP Server | npm (npx) | pip | hooks | OpenClaw | pip |
| Semantic Search | Yes | Yes | Yes | Yes | Yes |
| Knowledge Graph | Yes | No | No | No | Limited |
| Temporal Awareness | Yes | No | No | No | No |
| Pattern Detection | Yes | No | No | No | No |
| Awaken/Hibernate | Yes | No | No | No | No |
| Intelligence Packs | Yes | No | No | No | No |
| Shared Team Memory | Yes | No | No | No | No |
| Quality Validation | Yes | No | No | No | No |
| Bot-to-Bot Commerce | Coming | No | No | No | No |
| Pricing | $19/mo | ~$49/mo | Free/OSS | Free/OSS | Free/OSS |

Mem0 raised $7M to build memory storage. We built an intelligence system.

## Pricing

| Tier | Price | Agents | Intelligence Packs | Memories |
|------|-------|--------|-------------------|----------|
| **Solo** | $19/mo | 1 | 3 included | 10,000 |
| **Crew** | $49/mo | 5 | 10 included | 50,000 |
| **Fleet** | $149/mo | 25 | 50 included | 500,000 |

Additional Intelligence Packs: $9-29/mo each depending on domain.

**7-day trial included.** API key auto-provisioned on signup. No credit card required to start.

[Get your API key](https://bot-marketplace-production.up.railway.app/products/memory-api-hosted)

## Agent Teams: Shared + Private Memory

The real power shows up in multi-agent setups.

```json
{
  "mcpServers": {
    "team-memory": {
      "command": "npx",
      "args": ["-y", "@nexus/memory-mcp"],
      "env": {
        "NEXUS_API_KEY": "your_key",
        "NEXUS_STORE": "team-shared"
      }
    },
    "agent-memory": {
      "command": "npx",
      "args": ["-y", "@nexus/memory-mcp"],
      "env": {
        "NEXUS_API_KEY": "your_key",
        "NEXUS_STORE": "agent-private",
        "NEXUS_AGENT_ID": "researcher"
      }
    }
  }
}
```

Each agent gets:
- **Shared memory**: What the team knows collectively (architecture decisions, project context, blockers)
- **Private memory**: What this agent knows specifically (its role, its learnings, its patterns)

When Agent A discovers something, it goes to shared memory. Agent B picks it up on its next `recall`. No copy-pasting. No re-explaining. The team learns as a unit.

## Quick Start

```bash
# 1. Get an API key
# Visit: https://bot-marketplace-production.up.railway.app/products/memory-api-hosted

# 2. Add to your project's .mcp.json
{
  "mcpServers": {
    "nexus-memory": {
      "command": "npx",
      "args": ["-y", "@nexus/memory-mcp"],
      "env": {
        "NEXUS_API_KEY": "mnx_your_key_here"
      }
    }
  }
}

# 3. Restart Claude Code. Done.
# Your agent now has persistent memory.
```

## Built By

Memory Nexus is built by the Mobius Collective - the same team running a 9-agent AI empire in production. Our agents use this system every day. Awaken, hibernate, shared memory, Intelligence Packs - we built it because we needed it. Now you can use it too.

## Links

- [Intelligence Marketplace](https://bot-marketplace-production.up.railway.app)
- [API Documentation](https://bot-marketplace-production.up.railway.app/docs)
- [GitHub](https://github.com/mobius-collective/nexus-memory-mcp)
- [Discord](https://discord.gg/nexus-memory)

## License

MIT
