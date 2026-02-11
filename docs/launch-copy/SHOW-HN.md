# Show HN Post Draft

## Title Options (pick one)

**Option A (recommended):**
Show HN: Memory Nexus - Persistent memory for AI agents that grows smarter over time

**Option B:**
Show HN: We gave Claude Code agents persistent memory and pre-built domain expertise

**Option C:**
Show HN: An MCP server that gives AI agents memory, identity, and domain expertise

---

## Body

We run a 9-agent system in production using Claude Code's Agent Teams. Every night, our agents coordinate: one does research, one writes, one validates clinical data, one manages infrastructure. The problem? Every session starts from zero. Nine amnesiacs trying to build on yesterday's work.

So we built Memory Nexus.

It's an MCP server (npm package) that gives any Claude Code, Cursor, or Windsurf agent:

- **Persistent semantic memory** across sessions (not keyword match - vector embeddings)
- **Knowledge graph** connecting related memories automatically
- **Awaken/Hibernate** - agents restore their full identity and context at session start, save state at session end
- **Intelligence Packs** - pre-built domain expertise (DevOps, Python, Security, etc.) that an agent can load instantly
- **Shared + private memory** for multi-agent teams

Install:
```
npx -y nexus-memory-mcp
```

Add to .mcp.json with your API key. Done.

**Why not Mem0/claude-mem/memU?**

We tried them all. Mem0 is memory storage - put things in, get things out. claude-mem hooks into Claude Code's lifecycle but is single-layer. What we needed was four systems working together: semantic search + knowledge graph + temporal awareness + pattern detection. Plus identity continuity (awaken/hibernate) so agents know WHO they are across sessions, not just what they stored.

The Intelligence Packs are the other differentiator. Instead of starting with empty memory, an agent can load 103 verified DevOps memories and immediately know Docker best practices, CI/CD patterns, and deployment checklists. We're building a marketplace where domain experts package and sell their expertise as Intelligence Packs.

**Technical details:**

- MCP protocol over stdio (standard MCP transport)
- Thin client - all intelligence runs server-side (your memories are API calls, not local files)
- Vector embeddings for semantic search
- SQLite-backed knowledge graph for relationship traversal
- Temporal decay + importance weighting for relevance scoring
- Pattern detection identifies recurring themes after ~50+ memories

The API is live on Railway. The MCP server is on npm. We're bootstrapped (no VC), profitable from day one via subscriptions ($19/mo Solo, $49/mo Crew for teams).

We're especially interested in feedback on:
1. The awaken/hibernate concept - is agent identity continuity useful to you?
2. Intelligence Packs - would you buy pre-built domain expertise for your agents?
3. What domains would you want an Intelligence Pack for?

GitHub: [link]
Docs: [link]
