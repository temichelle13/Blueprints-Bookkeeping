import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { getApiRoot } from "@/lib/api";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

type ChatAvailability = "unknown" | "checking" | "available" | "unavailable";

const OFFLINE_NOTICE =
  "Aria is temporarily offline right now. Please use the contact form, email tea@blueprintsandbookkeeping.com, or book a discovery call and Tea will follow up personally.";

const AVAILABILITY_CHECK_TIMEOUT_MS = 8000;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [availability, setAvailability] = useState<ChatAvailability>("unknown");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const apiBase = getApiRoot();

  const checkAvailability = useCallback(async () => {
    setAvailability((current) =>
      current === "available" ? current : "checking",
    );
    setStatusMessage(null);

    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      AVAILABILITY_CHECK_TIMEOUT_MS,
    );

    try {
      const response = await fetch(`${apiBase}/healthz`, {
        method: "GET",
        signal: controller.signal,
      });

      if (!response.ok) {
    setAvailability("available");
    setStatusMessage(null);
    return true;
  } else {
    throw new Error(); 
  }
} catch {
  setAvailability("unavailable");
  setStatusMessage(OFFLINE_NOTICE);
  return false;
}
  }, [apiBase]);

  useEffect(() => {
    if (open) {
      setHasNewMessage(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!open || availability === "available" || availability === "checking") {
      return;
    }

    void checkAvailability();
  }, [open, availability, checkAvailability]);

  const getOrCreateConversation = useCallback(async (): Promise<number> => {
    if (conversationId) return conversationId;

    const res = await fetch(`${apiBase}/openai/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Website Chat" }),
    });

    if (!res.ok) {
      if (res.status >= 500 || res.status === 404 || res.status === 405) {
        setAvailability("unavailable");
        setStatusMessage(OFFLINE_NOTICE);
      }
      throw new Error("Failed to create conversation");
    }
    const data = await res.json();
    setConversationId(data.id);
    return data.id;
  }, [conversationId, apiBase]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const isAvailable =
      availability === "available" ? true : await checkAvailability();

    if (!isAvailable) {
      return;
    }

    setInput("");
    setLoading(true);
    setStatusMessage(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const convId = await getOrCreateConversation();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", streaming: true },
      ]);

      const res = await fetch(
        `${apiBase}/openai/conversations/${convId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text }),
        },
      );

      if (!res.ok || !res.body) {
        if (res.status >= 500 || res.status === 404 || res.status === 405) {
          setAvailability("unavailable");
          setStatusMessage(OFFLINE_NOTICE);
        }
        throw new Error("Failed to send message");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const json = JSON.parse(line.slice(6));
            if (json.content) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + json.content,
                    streaming: true,
                  };
                }
                return updated;
              });
            }
            if (json.done) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = { ...last, streaming: false };
                }
                return updated;
              });
              if (!open) setHasNewMessage(true);
            }
            if (json.error) {
              setStatusMessage(json.error);
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: json.error,
                    streaming: false,
                  };
                }
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch {
      setStatusMessage(
        (current) =>
          current ?? "Sorry, something went wrong. Please try again.",
      );
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant" && last.streaming) {
          updated[updated.length - 1] = {
            ...last,
            content: "Sorry, something went wrong. Please try again.",
            streaming: false,
          };
        } else {
          updated.push({
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          });
        }
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }, [
    input,
    loading,
    availability,
    checkAvailability,
    getOrCreateConversation,
    open,
    apiBase,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const GREETING = messages.length === 0 && !loading;
  const chatUnavailable = availability === "unavailable";
  const chatChecking = availability === "checking";

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
        data-chat-widget
      >
        {open && (
          <div
            className="flex flex-col overflow-hidden"
            style={{
              width: "clamp(320px, 90vw, 420px)",
              height: "clamp(420px, 70vh, 580px)",
              background: "#161B2E",
              border: "1px solid #252B3D",
              borderRadius: "16px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Bot size={18} color="white" />
                </div>
                <div>
                  <div
                    style={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: 15,
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    Aria
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                    Blueprints & Bookkeeping Assistant
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Minimize chat"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: "50%",
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
                }
              >
                <ChevronDown size={16} color="white" />
              </button>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {GREETING && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Bot size={14} color="white" />
                  </div>
                  <div
                    style={{
                      background: "#1E2336",
                      borderRadius: "4px 12px 12px 12px",
                      padding: "10px 14px",
                      color: "#D8DCE4",
                      fontSize: 14,
                      lineHeight: 1.6,
                      maxWidth: "85%",
                    }}
                  >
                    <p style={{ margin: "0 0 8px" }}>
                      Hi! I'm <strong>Aria</strong>, Tea's assistant. I can
                      answer questions about our services, give you a price
                      estimate, or help you book a free discovery call.
                    </p>
                    <p style={{ margin: 0, color: "#8B91A0", fontSize: 13 }}>
                      {chatUnavailable
                        ? "I’m unavailable right now, but you can still reach Tea directly below."
                        : chatChecking
                          ? "Checking connection…"
                          : "What brings you in today?"}
                    </p>
                  </div>
                </div>
              )}

              {chatUnavailable && (
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(248, 113, 113, 0.35)",
                    borderRadius: 12,
                    padding: "14px 16px",
                    color: "#F3F4F6",
                  }}
                >
                  <p
                    style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.6 }}
                  >
                    {statusMessage ?? OFFLINE_NOTICE}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: 12,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => void checkAvailability()}
                      style={{
                        background: "#1E2336",
                        color: "#F3F4F6",
                        border: "1px solid #374151",
                        borderRadius: 999,
                        padding: "8px 12px",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      Retry chat
                    </button>
                    <a
                      href="/contact"
                      style={{
                        background: "#6366F1",
                        color: "#FFFFFF",
                        borderRadius: 999,
                        padding: "8px 12px",
                        fontSize: 12,
                        textDecoration: "none",
                      }}
                    >
                      Contact Tea
                    </a>
                    <a
                      href="mailto:tea@blueprintsandbookkeeping.com"
                      style={{
                        background: "#1E2336",
                        color: "#FFFFFF",
                        border: "1px solid #374151",
                        borderRadius: 999,
                        padding: "8px 12px",
                        fontSize: 12,
                        textDecoration: "none",
                      }}
                    >
                      Email Tea
                    </a>
                    <a
                      href="/schedule"
                      style={{
                        background: "#1E2336",
                        color: "#FFFFFF",
                        border: "1px solid #374151",
                        borderRadius: 999,
                        padding: "8px 12px",
                        fontSize: 12,
                        textDecoration: "none",
                      }}
                    >
                      Book a call
                    </a>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #252B3D, #1E2336)"
                          : "linear-gradient(135deg, #6366F1, #4F46E5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                      border:
                        msg.role === "user" ? "1px solid #252B3D" : "none",
                    }}
                  >
                    {msg.role === "user" ? (
                      <User size={14} color="#8B91A0" />
                    ) : (
                      <Bot size={14} color="white" />
                    )}
                  </div>
                  <div
                    style={{
                      background: msg.role === "user" ? "#6366F1" : "#1E2336",
                      borderRadius:
                        msg.role === "user"
                          ? "12px 4px 12px 12px"
                          : "4px 12px 12px 12px",
                      padding: "10px 14px",
                      color: msg.role === "user" ? "white" : "#D8DCE4",
                      fontSize: 14,
                      lineHeight: 1.6,
                      maxWidth: "85%",
                    }}
                  >
                    {!msg.content && msg.streaming ? (
                      <span
                        style={{
                          display: "flex",
                          gap: 4,
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            animation: "pulse 1s infinite",
                            opacity: 0.6,
                          }}
                        >
                          ●
                        </span>
                        <span
                          style={{
                            animation: "pulse 1s infinite 0.2s",
                            opacity: 0.6,
                          }}
                        >
                          ●
                        </span>
                        <span
                          style={{
                            animation: "pulse 1s infinite 0.4s",
                            opacity: 0.6,
                          }}
                        >
                          ●
                        </span>
                      </span>
                    ) : msg.role === "assistant" ? (
                      <div className="chat-markdown">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                        {msg.streaming && (
                          <span
                            style={{
                              display: "inline-block",
                              width: 2,
                              height: "1em",
                              background: "#6366F1",
                              marginLeft: 2,
                              verticalAlign: "text-bottom",
                              animation: "blink 0.8s step-end infinite",
                            }}
                          />
                        )}
                      </div>
                    ) : (
                      <span style={{ whiteSpace: "pre-wrap" }}>
                        {msg.content}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid #252B3D",
                display: "flex",
                gap: 10,
                alignItems: "flex-end",
                background: "#161B2E",
              }}
            >
              <label htmlFor="chat-input" className="sr-only">
                Chat message
              </label>
              <textarea
                ref={inputRef}
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything…"
                rows={1}
                style={{
                  flex: 1,
                  background: "#1E2336",
                  border: "1px solid #252B3D",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "#D8DCE4",
                  fontSize: 14,
                  resize: "none",
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.5,
                  maxHeight: 120,
                  overflowY: "auto",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6366F1")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#252B3D")}
                disabled={loading || chatUnavailable || chatChecking}
              />
              <button
                onClick={sendMessage}
                disabled={
                  !input.trim() || loading || chatUnavailable || chatChecking
                }
                aria-label="Send message"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background:
                    input.trim() &&
                    !loading &&
                    !chatUnavailable &&
                    !chatChecking
                      ? "linear-gradient(135deg, #6366F1, #4F46E5)"
                      : "#252B3D",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  flexShrink: 0,
                  transition: "background 0.15s, transform 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (input.trim() && !loading)
                    e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {loading ? (
                  <Loader2 size={16} color="#8B91A0" className="animate-spin" />
                ) : (
                  <Send size={16} color={input.trim() ? "white" : "#8B91A0"} />
                )}
              </button>
            </div>

            <div
              style={{
                padding: "8px 16px 10px",
                textAlign: "center",
                fontSize: 11,
                color: "#8B91A0",
                background: "#161B2E",
              }}
            >
              AI assistant — not Tea. For urgent matters:{" "}
              <a
                href="mailto:tea@blueprintsandbookkeeping.com"
                style={{ color: "#6366F1", textDecoration: "none" }}
              >
                email Tea directly
              </a>
            </div>

            <style>{`
              @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
              }
              @keyframes pulse {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
              }
              .chat-markdown p {
                margin: 0 0 8px 0;
              }
              .chat-markdown p:last-child {
                margin-bottom: 0;
              }
              .chat-markdown strong {
                color: #fff;
                font-weight: 600;
              }
              .chat-markdown em {
                font-style: italic;
              }
              .chat-markdown ul, .chat-markdown ol {
                margin: 6px 0 8px 0;
                padding-left: 18px;
              }
              .chat-markdown li {
                margin-bottom: 4px;
                line-height: 1.5;
              }
              .chat-markdown a {
                color: #818cf8;
                text-decoration: underline;
                word-break: break-all;
              }
              .chat-markdown a:hover {
                color: #a5b4fc;
              }
              .chat-markdown code {
                background: rgba(99,102,241,0.15);
                border-radius: 4px;
                padding: 1px 5px;
                font-size: 12px;
                font-family: 'JetBrains Mono', monospace;
                color: #a5b4fc;
              }
              .chat-markdown h1, .chat-markdown h2, .chat-markdown h3 {
                color: #fff;
                font-weight: 600;
                margin: 8px 0 4px;
                line-height: 1.3;
              }
              .chat-markdown h1 { font-size: 15px; }
              .chat-markdown h2 { font-size: 14px; }
              .chat-markdown h3 { font-size: 13px; }
              .chat-markdown hr {
                border: none;
                border-top: 1px solid #252B3D;
                margin: 10px 0;
              }
            `}</style>
          </div>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close chat" : "Open chat with Aria"}
          aria-expanded={open}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.boxShadow =
              "0 12px 40px rgba(99,102,241,0.55)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.4)";
          }}
          title="Chat with Aria, our AI assistant"
        >
          {open ? (
            <X size={22} color="white" />
          ) : (
            <MessageCircle size={22} color="white" />
          )}
          {hasNewMessage && !open && (
            <span
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 14,
                height: 14,
                background: "#EF4444",
                borderRadius: "50%",
                border: "2px solid #0E1118",
              }}
            />
          )}
        </button>
      </div>
    </>
  );
}
