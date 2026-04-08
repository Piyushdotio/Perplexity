import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { deletechat } from "../service/chat.api";

const starterConversations = [
  {
    id: 1,
    title: "Product strategy sync",
    messages: [
      {
        id: 11,
        role: "assistant",
        content:
          "Let's shape the strategy. Tell me the product, audience, and goal, and I'll help structure it.",
      },
    ],
  },
  {
    id: 2,
    title: "Landing page rewrite",
    messages: [
      {
        id: 21,
        role: "assistant",
        content:
          "I can rewrite headlines, improve clarity, or make the page more conversion-focused.",
      },
    ],
  },
  {
    id: 3,
    title: "API integration notes",
    messages: [
      {
        id: 31,
        role: "assistant",
        content:
          "Share the API shape or error and I'll help you wire it up step by step.",
      },
    ],
  },
];

const promptSuggestions = ["Code", "Learn", "Create", "Write", "Life stuff"];

const iconButtonClass =
  "flex h-9 w-9 items-center justify-center rounded-xl text-[#a8a29e] transition hover:bg-white/5 hover:text-[#f5f5f4]";

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="M9 5.5v13" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4 4" />
  </svg>
);

const LibraryIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 7.5h14M6 5h12a1 1 0 0 1 1 1v11.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 17.5V6a1 1 0 0 1 1-1Z" />
    <path d="M8 10h8M8 13h8" />
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M15.5 17H8.5a2 2 0 0 1-2-2v-.5l1.2-1.6V10a4.3 4.3 0 1 1 8.6 0v2.9l1.2 1.6V15a2 2 0 0 1-2 2Z" />
    <path d="M10 18.5a2.1 2.1 0 0 0 4 0" />
  </svg>
);

const BoxIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3.5 19 7v10l-7 3.5L5 17V7l7-3.5Z" />
    <path d="M5 7l7 4 7-4M12 11v9.5" />
  </svg>
);

const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
  </svg>
);

const PenIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="m4 20 4.5-1 9.6-9.6a2.1 2.1 0 0 0-3-3L5.5 16 4 20Z" />
    <path d="m13.5 7.5 3 3" />
  </svg>
);

const CupIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 7h10v6a5 5 0 0 1-5 5h0a5 5 0 0 1-5-5V7Z" />
    <path d="M16 9h1.5A2.5 2.5 0 0 1 20 11.5v0A2.5 2.5 0 0 1 17.5 14H16" />
    <path d="M8 21h8" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5a13 13 0 0 1 0 17M12 3.5a13 13 0 0 0 0 17" />
  </svg>
);

const sidebarIcons = [
  { id: "new", icon: PlusIcon, label: "New chat" },
  { id: "search", icon: SearchIcon, label: "Search" },
  { id: "library", icon: LibraryIcon, label: "Library" },
  { id: "alerts", icon: BellIcon, label: "Alerts" },
  { id: "spaces", icon: BoxIcon, label: "Spaces" },
  { id: "discover", icon: SparklesIcon, label: "Discover" },
  { id: "code", icon: CodeIcon, label: "Code" },
];

const promptIconMap = {
  Code: CodeIcon,
  Learn: GlobeIcon,
  Create: SparklesIcon,
  Write: PenIcon,
  "Life stuff": CupIcon,
};

const markdownClassName =
  "prose prose-invert max-w-none text-sm leading-7 prose-p:my-2 prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:bg-black/25 prose-pre:p-4 prose-code:rounded prose-code:bg-black/20 prose-code:px-1 prose-code:py-0.5 prose-headings:text-[#f5f5f4] prose-p:text-inherit prose-li:text-inherit prose-strong:text-[#fafaf9] prose-a:text-[#f59e72]";

const hideScrollbarClass =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="9" y="9" width="10" height="10" rx="2" />
    <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 7h16" />
    <path d="M10 11v6M14 11v6" />
    <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const AttachmentIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M8.5 12.5 14 7a3 3 0 1 1 4.2 4.2l-7.6 7.6a5 5 0 1 1-7.1-7.1L11 4.2" />
  </svg>
);

const MarkdownCodeBlock = ({ className, children, hideScrollbarClass, ...props }) => {
  const [copied, setCopied] = useState(false);
  const codeText = String(children).replace(/\n$/, "");
  const language = className?.replace("language-", "") || "code";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-white/10 bg-[#1b1a18] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      <div className="flex items-center justify-between border-b border-white/8 bg-[#23211f] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#a8a29e]">
        <span>{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] tracking-normal text-[#d6d3d1] transition hover:bg-white/10 hover:text-white"
          aria-label="Copy code"
          title="Copy code"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className={`overflow-x-auto p-4 text-[13px] leading-6 text-[#f5f5f4] ${hideScrollbarClass}`}>
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
};

const markdownComponents = {
  pre({ children }) {
    return children;
  },
  code({ inline, className, children, ...props }) {
    if (inline) {
      return (
        <code
          className="rounded-md bg-black/30 px-1.5 py-0.5 font-mono text-[0.9em] text-[#f8d7c5]"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <MarkdownCodeBlock
        className={className}
        hideScrollbarClass={hideScrollbarClass}
        {...props}
      >
        {children}
      </MarkdownCodeBlock>
    );
  },
};

const Rail = ({ onToggleSidebar, onNewChat, userName }) => {
  return (
    <div className="flex w-[56px] flex-col items-center border-r border-white/6 bg-[#23211d] py-3">
      <button onClick={onToggleSidebar} className={iconButtonClass} aria-label="Toggle sidebar">
        <MenuIcon />
      </button>

      <div className="mt-4 flex flex-col items-center gap-2">
        {sidebarIcons.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={id === "new" ? onNewChat : undefined}
            className={iconButtonClass}
            aria-label={label}
            title={label}
          >
            <Icon />
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-4">
        <div className="h-2 w-2 rounded-full bg-sky-500" />
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d6d3d1] text-sm font-semibold text-[#292524]"
          aria-label="User profile"
        >
          {userName?.[0]?.toUpperCase() || "P"}
        </button>
      </div>
    </div>
  );
};

const SidebarPanel = ({
  isOpen,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <aside className="absolute inset-y-0 left-[56px] z-20 w-[280px] border-r border-white/6 bg-[#26241f] px-3 py-4 lg:static lg:block">
      <div className="mb-4 flex items-center justify-between px-2">
        <p className="text-sm font-medium text-[#f5f5f4]">perplexity</p>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="rounded-lg border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-[#d6d3d1] transition hover:bg-white/10"
          >
            New
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/8 bg-white/5 px-2 py-1.5 text-xs text-[#d6d3d1] transition hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            X
          </button>
        </div>
      </div>

      <div className={`max-h-[calc(100vh-6.5rem)] space-y-1 overflow-y-auto pr-1 ${hideScrollbarClass}`}>
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId;

          return (
            <div
              key={conversation.id}
              className={`group flex items-start gap-2 rounded-xl px-3 py-3 text-left text-sm transition ${
                isActive
                  ? "bg-white/8 text-[#fafaf9]"
                  : "text-[#a8a29e] hover:bg-white/5 hover:text-[#f5f5f4]"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate font-medium">{conversation.title}</p>
                <p className="mt-1 truncate text-xs text-[#78716c]">
                  {conversation.messages[conversation.messages.length - 1]?.content}
                </p>
              </button>

              <button
                type="button"
                onClick={() => onDeleteConversation(conversation.id)}
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8f8a84] transition hover:bg-white/8 hover:text-[#fca5a5] ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
                aria-label="Delete chat"
                title="Delete chat"
              >
                <TrashIcon />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

const WelcomeScreen = ({
  userName,
  message,
  selectedFiles,
  onChange,
  onKeyDown,
  onSubmit,
  onPromptClick,
  onOpenFilePicker,
  onRemoveFile,
}) => {
  return (
    <div className={`flex min-h-0 flex-1 items-center justify-center overflow-y-auto px-4 py-8 sm:px-6 ${hideScrollbarClass}`}>
      {/* Welcome content alignment wrapper. */}
      <div className="flex w-full flex-col items-center">
        <div className="w-full max-w-3xl">
          {/* Top badge text and styling. */}
          <div className="mb-8 flex justify-center">
            <div className="rounded-xl bg-black/25 px-4 py-2 text-sm text-[#cfc7be]">
              Free plan <span className="px-1 text-[#6b655f]">·</span>{" "}
              <span className="underline underline-offset-2">Upgrade</span>
            </div>
          </div>

          {/* Main welcome heading. */}
          <h1 className="text-center font-serif text-3xl tracking-[-0.03em] text-[#d7d0c8] sm:text-5xl">
            <span className="mr-3 text-[#e67e50]">*</span>
            Good evening, {userName || "Piyush"}
          </h1>

          {/* Input card width, spacing, and actions. */}
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-8 flex w-full max-w-lg flex-col rounded-[24px] border border-white/8 bg-[#34322e] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.18)] sm:mt-10"
          >
            {selectedFiles.length > 0 ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedFiles.map((file) => (
                  <span
                    key={`${file.name}-${file.lastModified}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs text-[#d6d3d1]"
                  >
                    <AttachmentIcon />
                    <span className="max-w-[180px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveFile(file)}
                      className="text-[#a8a29e] transition hover:text-white"
                      aria-label={`Remove ${file.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : null}

            <textarea
              value={message}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={onKeyDown}
              rows={3}
              placeholder="How can I help you today?"
              className="w-full resize-none bg-transparent text-lg text-[#e7e5e4] outline-none placeholder:text-[#8d867f]"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={onOpenFilePicker}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#b8b1aa] transition hover:bg-white/5 hover:text-white"
                aria-label="Upload file"
                title="Upload file"
              >
                <AttachmentIcon />
              </button>

              <div className="flex items-center gap-4 text-sm text-[#b8b1aa]">
                <button type="button" className="transition hover:text-white">
                  Sonnet 4.6
                </button>
                <button type="submit" className="rounded-full bg-[#e67e50] px-4 py-2 font-medium text-[#1c1917] transition hover:brightness-110">
                  Send
                </button>
              </div>
            </div>
          </form>

          {/* Quick prompt suggestion buttons. */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {promptSuggestions.map((prompt) => {
              const Icon = promptIconMap[prompt];

              return (
                <button
                  key={prompt}
                  onClick={() => onPromptClick(prompt)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-[#2c2a26] px-4 py-2 text-sm text-[#d6d3d1] transition hover:bg-[#34322e] hover:text-white"
                >
                  <Icon />
                  {prompt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatView = ({
  conversation,
  message,
  selectedFiles,
  onChange,
  onKeyDown,
  onSubmit,
  onPromptClick,
  onOpenFilePicker,
  onRemoveFile,
}) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/6 px-4 py-2 sm:px-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#78716c]">
            perplexity
          </p>
          <h2 className="mt-0.5 text-sm font-medium text-[#f5f5f4]">
            {conversation.title}
          </h2>
        </div>
        <div className="text-[11px] text-[#a8a29e]">Ready</div>
      </div>

      <div className={`flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6 ${hideScrollbarClass}`}>
        {conversation.messages.map((entry) => (
          <div
            key={entry.id}
            className={`w-fit max-w-3xl rounded-[24px] border px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.16)] ${
              entry.role === "assistant" || entry.role === "ai"
                ? "border-white/6 bg-[#34322e] text-[#e7e5e4]"
                : "ml-auto max-w-[min(75%,32rem)] border-[#6ea4c8]/20 bg-gradient-to-br from-[#214257] to-[#162b38] text-[#f3fbff]"
            }`}
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#a8a29e]">
              {entry.role === "assistant" || entry.role === "ai" ? "perplexity" : "you"}
            </p>
            {entry.role === "assistant" || entry.role === "ai" ? (
              <div className={`mt-2 ${markdownClassName}`}>
                <ReactMarkdown components={markdownComponents}>
                  {entry.content || ""}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="mt-1 text-sm leading-6 text-inherit">{entry.content}</p>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-white/6 px-4 py-4 sm:px-6 sm:py-5">
        <form
          onSubmit={onSubmit}
          className="rounded-[28px] border border-white/8 bg-[#312f2b] px-4 py-3 shadow-[0_14px_36px_rgba(0,0,0,0.2)]"
        >
          {selectedFiles.length > 0 ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedFiles.map((file) => (
                <span
                  key={`${file.name}-${file.lastModified}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs text-[#d6d3d1]"
                >
                  <AttachmentIcon />
                  <span className="max-w-[180px] truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveFile(file)}
                    className="text-[#a8a29e] transition hover:text-white"
                    aria-label={`Remove ${file.name}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : null}

          <textarea
            value={message}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Ask follow-up questions..."
            className="min-h-[28px] w-full resize-none bg-transparent text-[15px] leading-6 text-[#e7e5e4] outline-none placeholder:text-[#8d867f]"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpenFilePicker}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-[#cfc7be] transition hover:bg-white/5 hover:text-white"
                aria-label="Upload file"
                title="Upload file"
              >
                <AttachmentIcon />
              </button>
              {promptSuggestions.slice(0, 3).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => onPromptClick(prompt)}
                  className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-[#cfc7be] transition hover:bg-white/5"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="rounded-full bg-[#e67e50] px-4 py-2 text-sm font-medium text-[#1c1917] shadow-[0_8px_20px_rgba(230,126,80,0.35)] transition hover:brightness-110"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { initializeSocketConnection, handleSendMessage: sendChatMessage } = useChat();
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [conversations, setConversations] = useState(starterConversations);
  const [activeConversationId, setActiveConversationId] = useState(null);

  useEffect(() => {
    initializeSocketConnection();
  }, [initializeSocketConnection]);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId
  );

  const handleNewChat = () => {
    const existingDraftConversation = conversations.find(
      (conversation) =>
        String(conversation.id).startsWith("temp-") &&
        conversation.messages.length === 0
    );

    if (existingDraftConversation) {
      setActiveConversationId(existingDraftConversation.id);
      setMessage("");
      return;
    }

    const newConversation = {
      id: `temp-${Date.now()}`,
      title: "New chat",
      messages: [],
    };

    setConversations((current) => [newConversation, ...current]);
    setActiveConversationId(newConversation.id);
    setMessage("");
  };

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
    setMessage("");
  };

  const handleDeleteConversation = async (conversationId) => {
    const nextConversations = conversations.filter(
      (conversation) => conversation.id !== conversationId
    );

    setConversations(nextConversations);

    if (activeConversationId === conversationId) {
      setActiveConversationId(nextConversations[0]?.id || null);
      setMessage("");
    }

    if (String(conversationId).startsWith("temp-")) {
      return;
    }

    try {
      await deletechat(conversationId);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handlePromptClick = (prompt) => {
    setMessage(prompt);
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const incomingFiles = Array.from(event.target.files || []);

    if (incomingFiles.length === 0) {
      return;
    }

    setSelectedFiles((current) => {
      const seen = new Set(current.map((file) => `${file.name}-${file.lastModified}`));
      const nextFiles = incomingFiles.filter(
        (file) => !seen.has(`${file.name}-${file.lastModified}`)
      );
      return [...current, ...nextFiles];
    });

    event.target.value = "";
  };

  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles((current) =>
      current.filter(
        (file) =>
          `${file.name}-${file.lastModified}` !==
          `${fileToRemove.name}-${fileToRemove.lastModified}`
      )
    );
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    const attachmentSummary = selectedFiles.length
      ? `\n\nAttached files:\n${selectedFiles.map((file) => `- ${file.name}`).join("\n")}`
      : "";
    const outgoingMessage = `${trimmedMessage}${attachmentSummary}`.trim();

    if (!trimmedMessage && selectedFiles.length === 0) {
      return;
    }

    try {
      const requestChatId =
        typeof activeConversationId === "string" && activeConversationId.startsWith("temp-")
          ? null
          : activeConversationId;

      const response = await sendChatMessage({
        message: outgoingMessage,
        chatId: requestChatId,
      });

      const savedChatId = response?.chat?._id || requestChatId || activeConversationId;
      const chatTitle =
        response?.chat?.title ||
        (trimmedMessage.length > 28
          ? `${trimmedMessage.slice(0, 28)}...`
          : trimmedMessage || selectedFiles[0]?.name || "New chat");
      const userEntry = {
        id: `user-${Date.now()}`,
        role: "user",
        content: outgoingMessage,
      };
      const assistantEntry = {
        id: response?.aiMessage?._id || `ai-${Date.now()}`,
        role: "assistant",
        content: response?.aiMessage?.content || "",
      };

      if (!activeConversationId || String(activeConversationId).startsWith("temp-")) {
        const newConversation = {
          id: savedChatId,
          title: chatTitle,
          messages: [userEntry, assistantEntry],
        };

        setConversations((current) => {
          const withoutTemp = current.filter(
            (conversation) => conversation.id !== activeConversationId
          );
          return [newConversation, ...withoutTemp];
        });
        setActiveConversationId(savedChatId);
        setMessage("");
        setSelectedFiles([]);
        return;
      }

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === activeConversationId
            ? {
                ...conversation,
                id: savedChatId,
                title: conversation.messages.length === 0 ? chatTitle : conversation.title,
                messages: [...conversation.messages, userEntry, assistantEntry],
              }
            : conversation
        )
      );
      setActiveConversationId(savedChatId);
      setMessage("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSendMessage(event);
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-[#2b2926] text-[#f5f5f4]">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="relative flex h-screen overflow-hidden border border-white/6 bg-[#2b2926]">
        {/* Left icon rail. */}
        <Rail
          onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
          onNewChat={handleNewChat}
          userName={user?.name}
        />

        {/* Conversation list sidebar. */}
        <SidebarPanel
          isOpen={isSidebarOpen}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onNewChat={handleNewChat}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Right content area for header + welcome/chat screen. */}
        <section className="flex min-h-0 flex-1 flex-col bg-[#2b2926]">
          {/* Top-right header action/icon. */}
          <div className="flex items-center justify-end px-4 py-2 sm:px-6 sm:py-2">
            <div className="text-[#b8b1aa]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6.5 16.5c.4-4.5 2.4-7 5.5-7s5.1 2.5 5.5 7" />
                <path d="M8.5 16.5v2l2-1.2 1.5 1.2 1.5-1.2 2 1.2v-2" />
                <path d="M9 9.5a3 3 0 1 1 6 0" />
              </svg>
            </div>
          </div>

          {/* Toggle between empty-state welcome screen and active chat screen here. */}
          {activeConversation ? (
            <ChatView
              conversation={activeConversation}
              message={message}
              selectedFiles={selectedFiles}
              onChange={setMessage}
              onKeyDown={handleKeyDown}
              onSubmit={handleSendMessage}
              onPromptClick={handlePromptClick}
              onOpenFilePicker={handleOpenFilePicker}
              onRemoveFile={handleRemoveFile}
            />
          ) : (
            <WelcomeScreen
              userName={user?.name}
              message={message}
              selectedFiles={selectedFiles}
              onChange={setMessage}
              onKeyDown={handleKeyDown}
              onSubmit={handleSendMessage}
              onPromptClick={handlePromptClick}
              onOpenFilePicker={handleOpenFilePicker}
              onRemoveFile={handleRemoveFile}
            />
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
