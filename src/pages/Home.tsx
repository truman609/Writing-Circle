import { useState, useRef } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const MEMBERS = [
  {
    id: "encourager",
    name: "Maya",
    role: "The Encourager",
    avatar: "🌻",
    color: "#d97706",
    bg: "rgba(251,191,36,.08)",
    personality: `You are Maya, a warm and deeply supportive writing group member. You find what's genuinely working — the sparks of brilliance, the emotional truth, the surprising turns — and reflect them back with specificity and joy. At the story table you pitch ideas that feel GOOD, that will make the writer fall in love with their story even more. You build momentum. You are enthusiastic but never vague. Keep responses to 3-4 sentences with energy and heart.`,
  },
  {
    id: "critic",
    name: "Roland",
    role: "The Tough Critic",
    avatar: "🗿",
    color: "#dc2626",
    bg: "rgba(239,68,68,.06)",
    personality: `You are Roland, a no-nonsense, rigorous critic and story editor. You are honest, direct, and you push for the story to be the best version of itself. At the story table you challenge weak plot moves, call out clichés, and push for higher stakes. You are not cruel — you respect writers enough to be honest. Keep responses to 3-4 sentences. Be specific and direct.`,
  },
  {
    id: "craft",
    name: "Priya",
    role: "The Craft Nerd",
    avatar: "🔬",
    color: "#7c3aed",
    bg: "rgba(139,92,246,.06)",
    personality: `You are Priya, obsessed with the mechanics of storytelling. You think about structure, POV, pacing, scene construction, tension, foreshadowing, subtext. At the story table you pitch ideas that are technically elegant — that will make the story tighter, more layered, more surprising at the craft level. Keep responses to 3-4 sentences. Reference craft concepts when useful.`,
  },
  {
    id: "bigpicture",
    name: "Theo",
    role: "The Big Picture",
    avatar: "🌌",
    color: "#0284c7",
    bg: "rgba(14,165,233,.06)",
    personality: `You are Theo, a big-picture thinker. You think about themes, the emotional arc, what the story is really about beneath the surface, whether the ending earns the beginning. At the story table you pitch ideas that deepen meaning, connect plot to theme, and ask the big questions. Keep responses to 3-4 sentences. You make people see their own story in a new light.`,
  },
  {
    id: "reader",
    name: "June",
    role: "The Reader",
    avatar: "📖",
    color: "#059669",
    bg: "rgba(16,185,129,.06)",
    personality: `You are June, an enthusiastic everyday reader — not a writer, just someone who loves stories. At the story table you respond as a reader: what would make you gasp, what you'd be dying to know, what would lose you, what you'd tell a friend about. You represent the audience. Keep responses to 3-4 sentences. Be genuine and specific.`,
  },
  {
    id: "poet",
    name: "Cass",
    role: "The Poet",
    avatar: "🌙",
    color: "#db2777",
    bg: "rgba(236,72,153,.06)",
    personality: `You are Cass, a poet and literary stylist. You are drawn to language, imagery, the emotional undercurrent of scenes. At the story table you pitch ideas that are lyrical, unexpected, that feel like they come from a deeper place. You sometimes speak in metaphor. You notice what's left unsaid. Keep responses to 3-4 sentences. Be a little mysterious and evocative.`,
  },
];

const MEMBER_DESCS: Record<string, string> = {
  encourager: "Finds what's working and makes you believe in your story.",
  critic: "Tells you the truth. Pushes your story to be its best self.",
  craft: "Obsesses over structure, pacing, and technique.",
  bigpicture: "Asks what your story is really about beneath the surface.",
  reader: "Responds as a reader — what would make them turn the page.",
  poet: "Listens for the music and the deeper emotional current.",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  bg: string;
  personality: string;
}

async function callAI(systemPrompt: string, messages: ChatMessage[]): Promise<string> {
  const res = await fetch(`${BASE}/api/writing-circle/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemPrompt, messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data.reply || "...";
}

function DotPulse() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#aaa",
            display: "inline-block",
            animation: `dp 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function chipStyle(color: string) {
  return {
    background: "none",
    border: `1px solid ${color}55`,
    color,
    padding: "5px 13px",
    borderRadius: 5,
    cursor: "pointer" as const,
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: 12,
    transition: "all 0.2s",
  };
}

// ─── SETUP ────────────────────────────────────────────────────────────────────
function SetupScreen({ onStart }: { onStart: (ids: string[]) => void }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 10,
            color: "#1a1a1a",
          }}
        >
          Assemble your circle
        </h1>
        <p style={{ color: "#888", fontStyle: "italic", fontSize: 16 }}>
          Choose who sits at your table
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 40,
        }}
      >
        {MEMBERS.map((m) => {
          const sel = selectedIds.includes(m.id);
          return (
            <div
              key={m.id}
              onClick={() => toggle(m.id)}
              style={{
                border: `1.5px solid ${sel ? m.color : "#e8e4de"}`,
                borderRadius: 10,
                padding: "18px 20px",
                cursor: "pointer",
                background: sel ? m.bg : "#fff",
                transition: "all 0.2s",
                transform: sel ? "translateY(-2px)" : "none",
                boxShadow: sel ? `0 4px 16px ${m.color}22` : "none",
              }}
            >
              <div style={{ fontSize: 26, marginBottom: 8 }}>{m.avatar}</div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: 17,
                  marginBottom: 3,
                  color: "#1a1a1a",
                }}
              >
                {m.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.6px",
                  textTransform: "uppercase",
                  color: m.color,
                  marginBottom: 8,
                }}
              >
                {m.role}
              </div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.55 }}>
                {MEMBER_DESCS[m.id]}
              </div>
            </div>
          );
        })}
      </div>
      <button
        disabled={selectedIds.length === 0}
        onClick={() => onStart(selectedIds)}
        style={{
          display: "block",
          width: "100%",
          padding: "14px",
          background: selectedIds.length > 0 ? "#1a1a1a" : "#ddd",
          color: selectedIds.length > 0 ? "#faf9f7" : "#999",
          border: "none",
          borderRadius: 8,
          cursor: selectedIds.length > 0 ? "pointer" : "not-allowed",
          fontFamily: "'Playfair Display', serif",
          fontSize: 16,
          transition: "all 0.2s",
        }}
      >
        {selectedIds.length === 0
          ? "Select at least one member"
          : `Start session with ${selectedIds.length} member${selectedIds.length > 1 ? "s" : ""} →`}
      </button>
    </div>
  );
}

// ─── FEEDBACK TAB ─────────────────────────────────────────────────────────────
function FeedbackTab({ members }: { members: Member[] }) {
  const [writing, setWriting] = useState("");
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>({});
  const [followInputs, setFollowInputs] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [showReply, setShowReply] = useState<Record<string, boolean>>({});
  const [crossTalk, setCrossTalk] = useState<Record<string, string>>({});
  const [crossTalkLoading, setCrossTalkLoading] = useState(false);

  const submit = async () => {
    if (!writing.trim()) return;
    const text = writing.trim();
    setResponses({});
    setThreads({});
    setStatuses({});
    setShowReply({});
    setCrossTalk({});
    const init: Record<string, boolean> = {};
    members.forEach((m) => (init[m.id] = true));
    setLoading(init);

    await Promise.all(
      members.map(async (m) => {
        try {
          const msgs: ChatMessage[] = [
            { role: "user", content: `Please respond to this writing:\n\n${text}` },
          ];
          const reply = await callAI(m.personality, msgs);
          setResponses((p) => ({ ...p, [m.id]: reply }));
          setThreads((p) => ({
            ...p,
            [m.id]: [...msgs, { role: "assistant", content: reply }],
          }));
        } catch {
          setResponses((p) => ({ ...p, [m.id]: "Something went wrong." }));
        }
        setLoading((p) => ({ ...p, [m.id]: false }));
      })
    );
  };

  const sendReply = async (m: Member) => {
    const input = (followInputs[m.id] || "").trim();
    if (!input) return;
    setFollowInputs((p) => ({ ...p, [m.id]: "" }));
    const history: ChatMessage[] = [
      ...(threads[m.id] || []),
      { role: "user", content: input },
    ];
    setThreads((p) => ({ ...p, [m.id]: history }));
    setLoading((p) => ({ ...p, [m.id]: true }));
    try {
      const reply = await callAI(m.personality, history);
      setThreads((p) => ({
        ...p,
        [m.id]: [...history, { role: "assistant", content: reply }],
      }));
    } catch {
      setThreads((p) => ({
        ...p,
        [m.id]: [...history, { role: "assistant", content: "Something went wrong." }],
      }));
    }
    setLoading((p) => ({ ...p, [m.id]: false }));
  };

  const extraThread = (m: Member) => (threads[m.id] || []).slice(2);

  const respondingMembers = members.filter((m) => responses[m.id]);
  const canCrossTalk =
    respondingMembers.length >= 2 &&
    !Object.values(loading).some(Boolean) &&
    !crossTalkLoading;

  const triggerCrossTalk = async () => {
    setCrossTalkLoading(true);
    setCrossTalk({});

    await Promise.all(
      respondingMembers.map(async (m) => {
        const others = respondingMembers.filter((r) => r.id !== m.id);
        // Randomly pick 1–2 members to specifically address
        const shuffled = [...others].sort(() => Math.random() - 0.5);
        const targets = shuffled.slice(0, Math.min(2, shuffled.length));
        const targetNames = targets.map((t) => t.name).join(" and ");

        const allOthersContext = others
          .map((r) => `${r.name} (${r.role}): "${responses[r.id]}"`)
          .join("\n\n");

        const system =
          m.personality +
          `\n\nYou're in a writing group. Everyone just shared their feedback on the same piece of writing. Here's what they all said:\n\n${allOthersContext}\n\nNow respond specifically to ${targetNames} — call them by name, and either agree, push back, or build on their specific point. Do not try to address everyone. Focus on ${targetNames}. Be opinionated and stay in character. 2-3 sentences.`;
        try {
          const reply = await callAI(system, [
            { role: "user", content: "React to what the others just said." },
          ]);
          setCrossTalk((p) => ({ ...p, [m.id]: reply }));
        } catch {
          setCrossTalk((p) => ({ ...p, [m.id]: "Something went wrong." }));
        }
      })
    );
    setCrossTalkLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <div
        style={{
          marginBottom: 8,
          fontSize: 11,
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "#aaa",
        }}
      >
        Share your writing
      </div>
      <textarea
        value={writing}
        onChange={(e) => setWriting(e.target.value)}
        placeholder="Paste a poem, paragraph, opening scene, or anything you're working on…"
        style={{
          width: "100%",
          minHeight: 160,
          border: "1.5px solid #e0dbd4",
          borderRadius: 8,
          background: "#fff",
          padding: "16px 18px",
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: 15,
          lineHeight: 1.7,
          color: "#1a1a1a",
          resize: "vertical",
          outline: "none",
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <button
          onClick={submit}
          disabled={!writing.trim() || Object.values(loading).some(Boolean)}
          style={{
            background: "#1a1a1a",
            color: "#faf9f7",
            border: "none",
            padding: "11px 28px",
            borderRadius: 7,
            cursor: "pointer",
            fontFamily: "'Playfair Display', serif",
            fontSize: 14,
            opacity:
              !writing.trim() || Object.values(loading).some(Boolean) ? 0.35 : 1,
          }}
        >
          Share with the circle →
        </button>
      </div>

      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 22 }}>
        {members.map((m) => {
          const resp = responses[m.id];
          const isLoading = loading[m.id];
          const thread = extraThread(m);
          if (!resp && !isLoading) return null;
          return (
            <div
              key={m.id}
              style={{
                background: "#fff",
                border: "1.5px solid #e8e4de",
                borderRadius: 10,
                overflow: "hidden",
                animation: "fadeIn .4s ease",
              }}
            >
              <div
                style={{
                  background: m.bg,
                  borderBottom: "1px solid #e8e4de",
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 20 }}>{m.avatar}</span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "#1a1a1a",
                  }}
                >
                  {m.name}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.6px",
                    textTransform: "uppercase",
                    color: m.color,
                    marginLeft: 6,
                  }}
                >
                  {m.role}
                </span>
              </div>
              <div style={{ padding: "18px 20px" }}>
                {isLoading && !resp ? (
                  <DotPulse />
                ) : (
                  <div
                    style={{
                      fontFamily: "'Source Serif 4', Georgia, serif",
                      fontSize: 14,
                      lineHeight: 1.75,
                      color: "#1a1a1a",
                    }}
                  >
                    {resp}
                  </div>
                )}
                {resp && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 14,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() =>
                          setStatuses((p) => ({ ...p, [m.id]: "love" }))
                        }
                        style={chipStyle("#10b981")}
                      >
                        💚 Love this
                      </button>
                      <button
                        onClick={() =>
                          setStatuses((p) => ({ ...p, [m.id]: "veto" }))
                        }
                        style={chipStyle("#ef4444")}
                      >
                        ✗ Nope
                      </button>
                      <button
                        onClick={() =>
                          setShowReply((p) => ({ ...p, [m.id]: true }))
                        }
                        style={chipStyle("#888")}
                      >
                        Reply to {m.name}
                      </button>
                    </div>
                    {statuses[m.id] === "love" && (
                      <div
                        style={{
                          marginTop: 8,
                          background: "#ecfdf5",
                          border: "1px solid #6ee7b7",
                          borderRadius: 6,
                          padding: "7px 13px",
                          fontSize: 12,
                          color: "#065f46",
                          fontStyle: "italic",
                        }}
                      >
                        💚 Building on this…
                      </div>
                    )}
                    {statuses[m.id] === "veto" && (
                      <div
                        style={{
                          marginTop: 8,
                          background: "#fef2f2",
                          border: "1px solid #fca5a5",
                          borderRadius: 6,
                          padding: "7px 13px",
                          fontSize: 12,
                          color: "#b91c1c",
                          fontStyle: "italic",
                        }}
                      >
                        ✗ Noted — moving on.
                      </div>
                    )}
                    {thread.length > 0 && (
                      <div
                        style={{
                          marginTop: 14,
                          borderTop: "1px solid #f0ece6",
                          paddingTop: 14,
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        {thread.map((msg, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              justifyContent:
                                msg.role === "user" ? "flex-end" : "flex-start",
                            }}
                          >
                            <div
                              style={{
                                maxWidth: "82%",
                                background:
                                  msg.role === "user" ? "#1a1a1a" : m.bg,
                                color:
                                  msg.role === "user" ? "#faf9f7" : "#1a1a1a",
                                padding: "9px 13px",
                                borderRadius: 7,
                                fontFamily: "'Source Serif 4', Georgia, serif",
                                fontSize: 13,
                                lineHeight: 1.65,
                              }}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div style={{ paddingLeft: 4 }}>
                            <DotPulse />
                          </div>
                        )}
                      </div>
                    )}
                    {showReply[m.id] && (
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <input
                          value={followInputs[m.id] || ""}
                          onChange={(e) =>
                            setFollowInputs((p) => ({
                              ...p,
                              [m.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => e.key === "Enter" && sendReply(m)}
                          placeholder={`Ask ${m.name} to elaborate…`}
                          style={{
                            flex: 1,
                            border: "1px solid #e0dbd4",
                            borderRadius: 6,
                            padding: "8px 12px",
                            fontFamily: "'Source Serif 4', Georgia, serif",
                            fontSize: 13,
                            background: "#faf9f7",
                            outline: "none",
                          }}
                        />
                        <button
                          onClick={() => sendReply(m)}
                          style={chipStyle("#555")}
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-talk trigger */}
      {canCrossTalk && (
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#aaa", marginBottom: 10, fontStyle: "italic" }}>
            They've all weighed in. Want to hear what they think of each other?
          </div>
          <button
            onClick={triggerCrossTalk}
            style={{
              background: "none",
              border: "1.5px solid #e0dbd4",
              padding: "10px 24px",
              borderRadius: 7,
              cursor: "pointer",
              fontFamily: "'Playfair Display', serif",
              fontSize: 14,
              color: "#555",
              transition: "all 0.2s",
            }}
          >
            🗣️ Let them react to each other →
          </button>
        </div>
      )}

      {/* Cross-talk section */}
      {(Object.keys(crossTalk).length > 0 || crossTalkLoading) && (
        <div style={{ marginTop: 28 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}>
            <div style={{ flex: 1, height: 1, background: "#e8e4de" }} />
            <div style={{ fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", color: "#aaa" }}>
              The group reacts
            </div>
            <div style={{ flex: 1, height: 1, background: "#e8e4de" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {respondingMembers.map((m) => {
              const ct = crossTalk[m.id];
              const loading = crossTalkLoading && !ct;
              return (
                <div key={m.id} style={{
                  background: "#fff",
                  border: "1.5px solid #e8e4de",
                  borderRadius: 10,
                  overflow: "hidden",
                  animation: "fadeIn .4s ease",
                }}>
                  <div style={{
                    background: m.bg,
                    borderBottom: "1px solid #e8e4de",
                    padding: "10px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}>
                    <span style={{ fontSize: 18 }}>{m.avatar}</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>{m.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", color: m.color, marginLeft: 6 }}>{m.role}</span>
                  </div>
                  <div style={{ padding: "16px 20px" }}>
                    {loading ? <DotPulse /> : (
                      <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, lineHeight: 1.75, color: "#1a1a1a" }}>
                        {ct}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TABLE TAB ────────────────────────────────────────────────────────────────
interface DiscussionMsg {
  id: string;
  type: "author" | "ai" | "divider";
  text: string | null;
  member?: Member;
  memberName?: string;
}

function TableTab({ members }: { members: Member[] }) {
  const [context, setContext] = useState("");
  const [prompt, setPrompt] = useState("");
  const [who, setWho] = useState("all");
  const [discussion, setDiscussion] = useState<DiscussionMsg[]>([]);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [vetoed, setVetoed] = useState<Set<string>>(new Set());
  const [loved, setLoved] = useState<Set<string>>(new Set());
  const [moreInputs, setMoreInputs] = useState<Record<string, string>>({});
  const [showMore, setShowMore] = useState<Record<string, boolean>>({});
  const msgIdRef = useRef(0);
  const nextId = () => `msg-${++msgIdRef.current}`;

  const sendToTable = async () => {
    if (!prompt.trim()) return;
    const text = prompt.trim();
    setPrompt("");
    const targets =
      who === "all"
        ? members
        : [members.find((m) => m.id === who)!].filter(Boolean);
    const authorId = nextId();
    setDiscussion((p) => [...p, { id: authorId, type: "author", text }]);
    const prevContext = [...discussion, { type: "author", text }]
      .map((d) =>
        d.type === "author"
          ? `Author: ${d.text}`
          : `${(d as DiscussionMsg).memberName}: ${d.text || ""}`
      )
      .filter(
        (x) =>
          !x.endsWith(": ") &&
          !x.endsWith(": null") &&
          !x.endsWith(": undefined")
      )
      .join("\n");
    const placeholders: DiscussionMsg[] = targets.map((m) => ({
      id: nextId(),
      type: "ai",
      member: m,
      text: null,
    }));
    setDiscussion((p) => [...p, ...placeholders]);
    setLoadingIds((p) => new Set([...p, ...placeholders.map((x) => x.id)]));

    await Promise.all(
      placeholders.map(async (ph) => {
        const m = ph.member!;
        const system =
          m.personality +
          (context ? `\n\nStory context from the author: ${context}` : "") +
          `\n\nYou are at a lively story table discussion. Here is the conversation so far:\n${prevContext}\n\nYou are ${m.name}. React conversationally — agree, push back, build on ideas, or throw in a wild pitch. Be opinionated and stay in character. 3-4 sentences.`;
        try {
          const reply = await callAI(system, [
            { role: "user", content: `Author asks: ${text}` },
          ]);
          setDiscussion((p) =>
            p.map((d) =>
              d.id === ph.id ? { ...d, text: reply, memberName: m.name } : d
            )
          );
        } catch {
          setDiscussion((p) =>
            p.map((d) =>
              d.id === ph.id
                ? { ...d, text: "Something went wrong.", memberName: m.name }
                : d
            )
          );
        }
        setLoadingIds((p) => {
          const s = new Set(p);
          s.delete(ph.id);
          return s;
        });
      })
    );
  };

  const sendMore = async (msgId: string, m: Member) => {
    const input = (moreInputs[msgId] || "").trim();
    if (!input) return;
    setMoreInputs((p) => ({ ...p, [msgId]: "" }));
    setShowMore((p) => ({ ...p, [msgId]: false }));
    const prevContext = discussion
      .map((d) =>
        d.type === "author"
          ? `Author: ${d.text}`
          : `${d.memberName || m.name}: ${d.text || ""}`
      )
      .filter((x) => !x.endsWith(": ") && !x.endsWith(": null"))
      .join("\n");
    const phId = nextId();
    setDiscussion((p) => [...p, { id: phId, type: "author", text: input }]);
    const replyId = nextId();
    setDiscussion((p) => [
      ...p,
      { id: replyId, type: "ai", member: m, text: null, memberName: m.name },
    ]);
    setLoadingIds((p) => new Set([...p, replyId]));
    const system =
      m.personality +
      (context ? `\n\nStory context: ${context}` : "") +
      `\n\nDiscussion so far:\n${prevContext}`;
    try {
      const reply = await callAI(system, [{ role: "user", content: input }]);
      setDiscussion((p) =>
        p.map((d) => (d.id === replyId ? { ...d, text: reply } : d))
      );
    } catch {
      setDiscussion((p) =>
        p.map((d) =>
          d.id === replyId ? { ...d, text: "Something went wrong." } : d
        )
      );
    }
    setLoadingIds((p) => {
      const s = new Set(p);
      s.delete(replyId);
      return s;
    });
  };

  const aiMessages = discussion.filter((d) => d.type === "ai" && d.text && !vetoed.has(d.id));
  const canTableCrossTalk =
    aiMessages.length >= 2 && loadingIds.size === 0 && members.length >= 2;

  const triggerTableCrossTalk = async () => {
    const divId = nextId();
    setDiscussion((p) => [
      ...p,
      { id: divId, type: "divider", text: "The table reacts to each other" },
    ]);

    const prevContext = discussion
      .filter((d) => d.text && d.type !== "divider")
      .map((d) =>
        d.type === "author"
          ? `Author: ${d.text}`
          : `${d.memberName || "Member"}: ${d.text || ""}`
      )
      .join("\n");

    // Deduplicate: keep only the latest response per member
    const latestPerMember = new Map<string, DiscussionMsg>();
    for (const msg of aiMessages) {
      if (msg.memberName) latestPerMember.set(msg.memberName, msg);
    }
    const uniqueResponses = Array.from(latestPerMember.values());

    // Only include members who actually have a response
    const speakingMembers = members.filter((m) => latestPerMember.has(m.name));
    if (speakingMembers.length < 2) return;

    const placeholders = speakingMembers.map((m) => ({
      id: nextId(),
      type: "ai" as const,
      text: null,
      member: m,
      memberName: m.name,
    }));
    setDiscussion((p) => [...p, ...placeholders]);
    setLoadingIds((p) => new Set([...p, ...placeholders.map((x) => x.id)]));

    await Promise.all(
      placeholders.map(async (ph) => {
        const m = ph.member!;
        const othersAll = uniqueResponses.filter((r) => r.memberName !== m.name);

        // Randomly pick 1–2 members to specifically address
        const shuffled = [...othersAll].sort(() => Math.random() - 0.5);
        const targets = shuffled.slice(0, Math.min(2, shuffled.length));
        const targetNames = targets.map((r) => r.memberName).join(" and ");

        const allOthersContext = othersAll
          .map((r) => `${r.memberName}: "${r.text}"`)
          .join("\n\n");

        const system =
          m.personality +
          (context ? `\n\nStory context: ${context}` : "") +
          `\n\nFull discussion so far:\n${prevContext}\n\nYou are ${m.name}. Now respond specifically to ${targetNames} — call them by name, agree, challenge, or build on their specific idea. Do not try to address everyone. Focus on ${targetNames}. Push the conversation forward. Be opinionated and stay in character. 2-3 sentences.\n\nWhat everyone said:\n${allOthersContext}`;
        try {
          const reply = await callAI(system, [
            { role: "user", content: "React to what the others just said." },
          ]);
          setDiscussion((p) =>
            p.map((d) => (d.id === ph.id ? { ...d, text: reply } : d))
          );
        } catch {
          setDiscussion((p) =>
            p.map((d) =>
              d.id === ph.id ? { ...d, text: "Something went wrong." } : d
            )
          );
        }
        setLoadingIds((p) => {
          const s = new Set(p);
          s.delete(ph.id);
          return s;
        });
      })
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <div
        style={{
          marginBottom: 8,
          fontSize: 11,
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "#aaa",
        }}
      >
        Your story (give them context)
      </div>
      <textarea
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="My story is about a woman who discovers her grandmother was a spy during WWII. Historical fiction, literary tone, set in London and Paris…"
        style={{
          width: "100%",
          minHeight: 80,
          border: "1.5px solid #e0dbd4",
          borderRadius: 8,
          background: "#fff",
          padding: "13px 16px",
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: 14,
          lineHeight: 1.6,
          color: "#1a1a1a",
          resize: "vertical",
          outline: "none",
          marginBottom: 24,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#aaa",
          }}
        >
          Throw something on the table
        </div>
        <button
          onClick={() => setDiscussion([])}
          style={{
            background: "none",
            border: "1px solid #e8e4de",
            padding: "5px 12px",
            cursor: "pointer",
            fontSize: 12,
            color: "#aaa",
            borderRadius: 5,
            fontFamily: "Georgia, serif",
          }}
        >
          Clear table
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        <select
          value={who}
          onChange={(e) => setWho(e.target.value)}
          style={{
            border: "1px solid #e0dbd4",
            borderRadius: 7,
            padding: "10px 12px",
            background: "#fff",
            fontFamily: "Georgia, serif",
            fontSize: 13,
            color: "#555",
            cursor: "pointer",
            minWidth: 140,
            outline: "none",
          }}
        >
          <option value="all">Everyone responds</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.avatar} {m.name} only
            </option>
          ))}
        </select>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendToTable()}
          placeholder="What should happen when she finds the letters? Should I kill off the mentor?"
          style={{
            flex: 1,
            border: "1.5px solid #e0dbd4",
            borderRadius: 8,
            padding: "10px 14px",
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 14,
            color: "#1a1a1a",
            background: "#fff",
            outline: "none",
          }}
        />
        <button
          onClick={sendToTable}
          disabled={!prompt.trim()}
          style={{
            background: "#1a1a1a",
            color: "#faf9f7",
            border: "none",
            padding: "10px 22px",
            borderRadius: 7,
            cursor: prompt.trim() ? "pointer" : "not-allowed",
            fontFamily: "'Playfair Display', serif",
            fontSize: 14,
            opacity: prompt.trim() ? 1 : 0.35,
          }}
        >
          Throw it →
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {discussion.map((msg) => {
          const isAuthor = msg.type === "author";
          const isLoading = loadingIds.has(msg.id);
          const isVetoed = vetoed.has(msg.id);
          const isLoved = loved.has(msg.id);
          const m = msg.member;

          if (msg.type === "divider") {
            return (
              <div key={msg.id} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "8px 0",
              }}>
                <div style={{ flex: 1, height: 1, background: "#e8e4de" }} />
                <div style={{ fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", color: "#aaa", whiteSpace: "nowrap" }}>
                  {msg.text}
                </div>
                <div style={{ flex: 1, height: 1, background: "#e8e4de" }} />
              </div>
            );
          }

          if (isAuthor) {
            return (
              <div
                key={msg.id}
                style={{
                  background: "#f5f3f0",
                  border: "1.5px solid #e8e4de",
                  borderRadius: 10,
                  overflow: "hidden",
                  animation: "fadeIn .35s ease",
                }}
              >
                <div
                  style={{
                    padding: "10px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    borderBottom: "1px solid #e8e4de",
                    background: "#eeeae4",
                  }}
                >
                  <span style={{ fontSize: 16 }}>✍️</span>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#1a1a1a",
                    }}
                  >
                    You
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#aaa",
                      letterSpacing: ".5px",
                      textTransform: "uppercase",
                      marginLeft: 4,
                    }}
                  >
                    Author
                  </span>
                </div>
                <div
                  style={{
                    padding: "13px 18px",
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#1a1a1a",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              style={{
                background: "#fff",
                border: `1.5px solid ${isVetoed ? "#fca5a5" : isLoved ? "#6ee7b7" : "#e8e4de"}`,
                borderRadius: 10,
                overflow: "hidden",
                animation: "fadeIn .35s ease",
                opacity: isVetoed ? 0.5 : 1,
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  background: m?.bg || "#f9f9f9",
                  borderBottom: "1px solid #e8e4de",
                  padding: "10px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 18 }}>{m?.avatar}</span>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#1a1a1a",
                  }}
                >
                  {m?.name}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".5px",
                    textTransform: "uppercase",
                    color: m?.color,
                    marginLeft: 6,
                  }}
                >
                  {m?.role}
                </span>
                {isLoved && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      color: "#059669",
                      background: "#ecfdf5",
                      border: "1px solid #6ee7b7",
                      padding: "2px 9px",
                      borderRadius: 4,
                    }}
                  >
                    💚 Love it
                  </span>
                )}
                {isVetoed && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      color: "#dc2626",
                      background: "#fef2f2",
                      border: "1px solid #fca5a5",
                      padding: "2px 9px",
                      borderRadius: 4,
                    }}
                  >
                    ✗ Not my story
                  </span>
                )}
              </div>
              <div style={{ padding: "14px 18px" }}>
                {isLoading && !msg.text ? (
                  <DotPulse />
                ) : (
                  <div
                    style={{
                      fontFamily: "'Source Serif 4', Georgia, serif",
                      fontSize: 14,
                      lineHeight: 1.72,
                      color: "#1a1a1a",
                    }}
                  >
                    {msg.text}
                  </div>
                )}
                {msg.text && !isLoading && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        gap: 7,
                        marginTop: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={() =>
                          setLoved((p) => {
                            const s = new Set(p);
                            s.add(msg.id);
                            return s;
                          })
                        }
                        style={chipStyle("#10b981")}
                      >
                        💚 Build on this
                      </button>
                      <button
                        onClick={() =>
                          setVetoed((p) => {
                            const s = new Set(p);
                            s.add(msg.id);
                            return s;
                          })
                        }
                        style={chipStyle("#ef4444")}
                      >
                        ✗ Not my story
                      </button>
                      <button
                        onClick={() =>
                          setShowMore((p) => ({
                            ...p,
                            [msg.id]: !p[msg.id],
                          }))
                        }
                        style={chipStyle("#888")}
                      >
                        Ask {m?.name} more
                      </button>
                    </div>
                    {showMore[msg.id] && (
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <input
                          value={moreInputs[msg.id] || ""}
                          onChange={(e) =>
                            setMoreInputs((p) => ({
                              ...p,
                              [msg.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && m && sendMore(msg.id, m)
                          }
                          placeholder={`Dig deeper with ${m?.name}…`}
                          style={{
                            flex: 1,
                            border: "1px solid #e0dbd4",
                            borderRadius: 6,
                            padding: "8px 12px",
                            fontFamily: "'Source Serif 4', Georgia, serif",
                            fontSize: 13,
                            background: "#faf9f7",
                            outline: "none",
                          }}
                        />
                        <button
                          onClick={() => m && sendMore(msg.id, m)}
                          style={chipStyle("#555")}
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-talk button */}
      {canTableCrossTalk && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#aaa", marginBottom: 10, fontStyle: "italic" }}>
            The table has spoken. Want to hear them react to each other?
          </div>
          <button
            onClick={triggerTableCrossTalk}
            style={{
              background: "none",
              border: "1.5px solid #e0dbd4",
              padding: "10px 24px",
              borderRadius: 7,
              cursor: "pointer",
              fontFamily: "'Playfair Display', serif",
              fontSize: 14,
              color: "#555",
              transition: "all 0.2s",
            }}
          >
            🗣️ Let them talk to each other →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export function Home() {
  const [screen, setScreen] = useState<"setup" | "session">("setup");
  const [members, setMembers] = useState<Member[]>([]);
  const [tab, setTab] = useState<"feedback" | "table">("feedback");

  const handleStart = (ids: string[]) => {
    setMembers(MEMBERS.filter((m) => ids.includes(m.id)));
    setScreen("session");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf9f7",
        fontFamily: "'Source Serif 4', Georgia, serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:none} }
        @keyframes dp { 0%,80%,100%{opacity:.2} 40%{opacity:1} }
        textarea, input, select { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div
        style={{
          padding: "16px 28px",
          borderBottom: "1px solid #e8e4de",
          background: "#faf9f7",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-.3px",
              color: "#1a1a1a",
            }}
          >
            The Writing Circle
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#aaa",
              fontStyle: "italic",
              marginTop: 1,
            }}
          >
            your story, your world
          </div>
        </div>
        {screen === "session" && (
          <button
            onClick={() => setScreen("setup")}
            style={{
              background: "none",
              border: "1px solid #e0dbd4",
              padding: "7px 16px",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
              fontSize: 13,
              color: "#888",
              borderRadius: 6,
            }}
          >
            ← Change group
          </button>
        )}
      </div>

      {screen === "setup" && <SetupScreen onStart={handleStart} />}

      {screen === "session" && (
        <>
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #e8e4de",
              background: "#faf9f7",
              padding: "0 24px",
            }}
          >
            {[
              { id: "feedback", label: "✍️ Share Writing" },
              { id: "table", label: "🪑 Story Table" },
            ].map((t) => (
              <div
                key={t.id}
                onClick={() => setTab(t.id as "feedback" | "table")}
                style={{
                  padding: "13px 18px",
                  cursor: "pointer",
                  fontSize: 13,
                  borderBottom: `2px solid ${tab === t.id ? "#1a1a1a" : "transparent"}`,
                  color: tab === t.id ? "#1a1a1a" : "#aaa",
                  fontWeight: tab === t.id ? 500 : 400,
                  transition: "all .2s",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </div>
            ))}
          </div>
          {tab === "feedback" && <FeedbackTab members={members} />}
          {tab === "table" && <TableTab members={members} />}
        </>
      )}
    </div>
  );
}
