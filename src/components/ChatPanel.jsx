import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Check } from 'lucide-react';
import { sanitizeInput } from '../utils/security';

function parseInline(str) {
  if (!str) return '';
  const parts = [];
  let keyIdx = 0;
  const regex = /(\*\*.*?\*\*|\*.*?\*)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      parts.push(<strong key={keyIdx++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      parts.push(<em key={keyIdx++}>{token.slice(1, -1)}</em>);
    } else {
      parts.push(token);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.slice(lastIndex));
  }

  return parts.length > 0 ? parts : str;
}

function FormattedText({ text }) {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <div className="msg-rich-content">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="msg-space" />;
        }

        if (trimmed.startsWith('#### ')) {
          return <h5 key={idx} className="msg-h4">{parseInline(trimmed.slice(5))}</h5>;
        }
        if (trimmed.startsWith('### ')) {
          return <h4 key={idx} className="msg-h3">{parseInline(trimmed.slice(4))}</h4>;
        }

        if (trimmed === '---' || trimmed === '***') {
          return <hr key={idx} className="msg-hr" />;
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="msg-li">
              <span className="msg-bullet">✦</span>
              <span>{parseInline(trimmed.slice(2))}</span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="msg-num-li">
              <span className="msg-num-badge">{numMatch[1]}</span>
              <span>{parseInline(numMatch[2])}</span>
            </div>
          );
        }

        return <p key={idx} className="msg-p">{parseInline(trimmed)}</p>;
      })}
    </div>
  );
}

export default function ChatPanel({
  isOpen,
  onClose,
  plan,
  messages,
  onSendMessage,
  isStreaming,
  streamingText,
  onApplyPlanUpdate,
  hasApiKey,
  onOpenApiKeyModal
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleSend = (e) => {
    e.preventDefault();
    const sanitized = sanitizeInput(inputText);
    if (!sanitized || isStreaming) return;
    onSendMessage(sanitized);
    setInputText('');
  };

  const handleChipClick = (suggestion) => {
    if (isStreaming) return;
    onSendMessage(suggestion);
  };

  const getEventSuggestions = () => {
    if (plan.eventType === 'wedding') {
      return [
        "📉 Suggest 3 ways to reduce catering & bar costs by 15%",
        "🎵 Recommend an entrance song and playlist vibe",
        "📸 Provide a minute-by-minute photography schedule",
        "💡 Brainstorm 3 romantic late-night dessert surprises"
      ];
    } else if (plan.eventType === 'birthday') {
      return [
        "🎮 What are 3 interactive party games for 60 guests?",
        "🍸 Invent 2 signature synthwave cocktails and 1 mocktail",
        "🔊 Create a high-energy DJ set timeline",
        "🎁 Recommend nostalgic party favors under $5 each"
      ];
    } else {
      return [
        "🌱 How can we make this community festival 100% zero-waste?",
        "🎪 Suggest 4 engaging maker booths for families and kids",
        "📢 Draft a local social media outreach announcement",
        "🚑 What safety and emergency checklist items do we need?"
      ];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-dock glass-panel" role="region" aria-label="CelebAI Event Assistant">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-title-group">
          <div className="chat-bot-avatar">
            <Sparkles size={16} />
          </div>
          <div>
            <h4>CelebAI Assistant</h4>
            <span className={`chat-status-text ${hasApiKey ? 'online' : 'demo'}`}>
              {isStreaming 
                ? 'Synthesizing response...' 
                : hasApiKey 
                  ? 'Gemini 2.5 Flash Online 🟢' 
                  : 'Interactive Demo Mode ⚡'}
            </span>
          </div>
        </div>
        <button className="btn-chat-close" onClick={onClose} aria-label="Minimize Chat">
          ✕
        </button>
      </div>

      {/* Demo Mode Notice Bar */}
      {!hasApiKey && (
        <div className="chat-demo-bar">
          <div className="demo-bar-text">
            <span>⚡ <strong>Demo Mode:</strong> Offline Intel active. Connect key for live Gemini streaming.</span>
          </div>
          <button type="button" className="btn-chat-add-key" onClick={onOpenApiKeyModal}>
            Connect Key
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="chat-messages-container" aria-live="polite">
        {messages.length === 0 && (
          <div className="chat-welcome-box">
            <div className="welcome-icon">✨</div>
            <h5>Plan Iteration & Conversational AI</h5>
            <p>
              Ask me to adjust budget numbers, expand your timeline, brainstorm custom themes, or curate vendor specifications.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble-row ${msg.role}`}>
            <div className="bubble-avatar">
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className="bubble-content">
              <div className="bubble-text">
                <FormattedText text={msg.text} />
              </div>
              {msg.isSimulated && (
                <div className="bubble-source-tag">
                  <span>⚡ Synthesized via CelebAI Offline Engine</span>
                </div>
              )}
              {msg.updatedPlan && (
                <div className="bubble-plan-card">
                  <div className="plan-card-header">
                    <Check size={14} className="text-emerald" />
                    <span>Updated Master Plan Synthesized</span>
                  </div>
                  <button 
                    className="btn-apply-plan"
                    onClick={() => onApplyPlanUpdate(msg.updatedPlan)}
                  >
                    Apply Changes to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Live Streaming Message */}
        {isStreaming && (
          <div className="chat-bubble-row model">
            <div className="bubble-avatar">
              <Bot size={14} />
            </div>
            <div className="bubble-content">
              <div className="bubble-text streaming">
                <FormattedText text={streamingText || 'Thinking and reasoning...'} />
                <span className="typing-cursor">▋</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestion Chips */}
      <div className="prompt-chips-tray" role="group" aria-label="Quick Prompt Suggestions">
        {getEventSuggestions().map((chip, idx) => (
          <button
            key={idx}
            className="prompt-chip"
            onClick={() => handleChipClick(chip)}
            disabled={isStreaming}
            aria-label={`Ask suggestion: ${chip}`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="chat-input-bar">
        <input
          type="text"
          placeholder="Ask CelebAI (e.g. trim budget, add floral ideas)..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isStreaming}
          aria-label="Message prompt to CelebAI"
        />
        <button 
          type="submit" 
          className="btn-send-chat" 
          disabled={!inputText.trim() || isStreaming}
          aria-label="Send message to CelebAI"
        >
          <Send size={15} />
        </button>
      </form>

      <style>{`
        .chat-dock {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 440px;
          height: 620px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          z-index: 90;
          background: rgba(17, 19, 34, 0.95);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65);
          overflow: hidden;
          animation: slideUp 200ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .chat-header {
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chat-bot-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          background: var(--primary-gradient);
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-title-group h4 {
          font-size: 0.95rem;
          color: #FFF;
          margin-bottom: 1px;
        }

        .chat-status-text {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          font-weight: 600;
        }

        .chat-status-text.online {
          color: #34D399;
        }

        .chat-status-text.demo {
          color: #FBBF24;
        }

        .chat-demo-bar {
          background: rgba(245, 158, 11, 0.12);
          border-bottom: 1px solid rgba(245, 158, 11, 0.25);
          padding: 8px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 0.74rem;
          color: #FDE68A;
        }

        .chat-demo-bar strong {
          color: #FFF;
        }

        .btn-chat-add-key {
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
          color: #111;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.72rem;
          white-space: nowrap;
          cursor: pointer;
          transition: opacity 150ms ease;
        }

        .btn-chat-add-key:hover {
          opacity: 0.9;
        }

        .bubble-source-tag {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
          margin-top: 2px;
          padding-left: 2px;
        }

        .btn-chat-close {
          color: var(--text-muted);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          transition: all var(--transition-fast);
        }

        .btn-chat-close:hover {
          color: #FFF;
          background: rgba(255, 255, 255, 0.08);
        }

        .chat-messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .chat-welcome-box {
          text-align: center;
          padding: 24px 16px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-lg);
          border: 1px dashed var(--border-subtle);
          margin-top: 20px;
        }

        .welcome-icon {
          font-size: 1.8rem;
          margin-bottom: 8px;
        }

        .chat-welcome-box h5 {
          font-size: 0.95rem;
          color: #FFF;
          margin-bottom: 4px;
        }

        .chat-welcome-box p {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .chat-bubble-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .chat-bubble-row.user {
          flex-direction: row-reverse;
        }

        .bubble-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 0.75rem;
        }

        .chat-bubble-row.user .bubble-avatar {
          background: var(--primary);
          color: #FFF;
        }

        .chat-bubble-row.model .bubble-avatar {
          background: rgba(255, 255, 255, 0.08);
          color: #C4B5FD;
        }

        .bubble-content {
          max-width: 82%;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .bubble-text {
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.84rem;
          line-height: 1.55;
          word-break: break-word;
        }

        .msg-rich-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .msg-space {
          height: 6px;
        }

        .msg-h3 {
          font-size: 0.94rem;
          font-weight: 800;
          color: var(--primary-light, #DDD6FE);
          margin-top: 4px;
          margin-bottom: 2px;
          line-height: 1.35;
        }

        .msg-h4 {
          font-size: 0.86rem;
          font-weight: 700;
          color: #FFF;
          margin-top: 3px;
          margin-bottom: 1px;
        }

        .msg-p {
          font-size: 0.84rem;
          line-height: 1.5;
          margin: 0;
        }

        .msg-hr {
          border: none;
          border-top: 1px solid var(--border-medium, rgba(255, 255, 255, 0.12));
          margin: 6px 0;
        }

        .msg-li, .msg-num-li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.83rem;
          line-height: 1.5;
          margin-left: 2px;
        }

        .msg-bullet {
          color: var(--primary, #8B5CF6);
          font-size: 0.62rem;
          margin-top: 4px;
          flex-shrink: 0;
        }

        .msg-num-badge {
          background: rgba(139, 92, 246, 0.2);
          color: #DDD6FE;
          border-radius: 4px;
          font-size: 0.68rem;
          font-family: var(--font-mono);
          font-weight: 700;
          padding: 0 4px;
          min-width: 16px;
          text-align: center;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .chat-bubble-row.user .bubble-text {
          background: var(--primary-gradient);
          color: #FFF;
          border-bottom-right-radius: 2px;
        }

        .chat-bubble-row.model .bubble-text {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
          border: 1px solid var(--border-subtle);
          border-bottom-left-radius: 2px;
        }

        .typing-cursor {
          display: inline-block;
          margin-left: 2px;
          color: var(--primary);
          animation: blink 1s infinite;
        }

        .bubble-plan-card {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: var(--radius-md);
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .plan-card-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #A7F3D0;
        }

        .btn-apply-plan {
          background: #10B981;
          color: #FFF;
          font-weight: 700;
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          transition: background var(--transition-fast);
        }

        .btn-apply-plan:hover {
          background: #059669;
        }

        .prompt-chips-tray {
          display: flex;
          overflow-x: auto;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid var(--border-subtle);
          white-space: nowrap;
        }

        .prompt-chip {
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.72rem;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .prompt-chip:hover:not(:disabled) {
          color: #FFF;
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--border-medium);
        }

        .chat-input-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-surface);
        }

        .chat-input-bar input {
          flex: 1;
          padding: 10px 14px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-pill);
          color: #FFF;
          font-size: 0.85rem;
        }

        .chat-input-bar input:focus {
          border-color: var(--primary);
        }

        .btn-send-chat {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--primary-gradient);
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-fast);
        }

        .btn-send-chat:hover:not(:disabled) {
          transform: scale(1.06);
        }

        .btn-send-chat:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @media (max-width: 600px) {
          .chat-dock {
            width: calc(100% - 32px);
            right: 16px;
            bottom: 16px;
          }
        }
      `}</style>
    </div>
  );
}
