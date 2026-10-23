import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EventHeader from './components/EventHeader';
import BudgetPlanner from './components/BudgetPlanner';
import TimelinePlanner from './components/TimelinePlanner';
import VendorChecklist from './components/VendorChecklist';
import IdeaGenerator from './components/IdeaGenerator';
import ChatPanel from './components/ChatPanel';
import ApiKeyModal from './components/ApiKeyModal';
import IntakeFormModal from './components/IntakeFormModal';

import { MOCK_PLANS } from './utils/mockPlans';
import { exportPlanToPdf } from './utils/exportPdf';
import { 
  buildIntakePrompt, 
  buildRefinementPrompt, 
  parseGeminiPlan 
} from './utils/prompts';
import { 
  hasConfiguredApiKey, 
  generateWithGemini 
} from './config/gemini';
import { simulateAiChatResponse } from './utils/aiSimulator';

import { 
  DollarSign, 
  Calendar, 
  Users, 
  Sparkles, 
  MessageSquare, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [eventType, setEventType] = useState('wedding');
  const [activeTab, setActiveTab] = useState('budget');
  const [currentPlan, setCurrentPlan] = useState(MOCK_PLANS.wedding);
  
  // Modals & Panels
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // API & Generation State
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState(null);

  // Chat State
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "👋 Welcome! I'm CelebAI. I've initialized your Golden Hour Botanical Wedding master plan. Click 'Refine Plan' or any of the quick suggestions below to customize budgets, timelines, vendors, and creative concepts!"
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('celebai_theme') || 'cosmic';
  });

  // Check API Key and apply Theme on load
  useEffect(() => {
    setHasApiKey(hasConfiguredApiKey());
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, []);

  const handleSelectTheme = (themeId) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('celebai_theme', themeId);
    const themeNames = {
      'cosmic': 'Cosmic Twilight',
      'royal-gold': 'Champagne Royal',
      'emerald': 'Emerald Sanctuary',
      'cyberpunk': 'Cyberpunk Synthwave',
      'aurora-light': 'Pearl Aurora'
    };
    showNotification(`Theme updated to ${themeNames[themeId] || themeId}!`, 'info');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Switch Event Mode (Wedding / Birthday / Community)
  const handleSelectEventType = (type) => {
    setEventType(type);
    const selectedMock = MOCK_PLANS[type] || MOCK_PLANS.wedding;
    setCurrentPlan(selectedMock);
    
    // Add assistant announcement
    const typeLabel = type === 'wedding' ? 'Wedding' : type === 'birthday' ? 'Birthday' : 'Community Gathering';
    setMessages((prev) => [
      ...prev,
      {
        role: 'model',
        text: `Switched workspace to ${typeLabel}: "${selectedMock.title}". All budget categories, timeline milestones, and vendors updated!`
      }
    ]);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.15 }
    });
  };

  // Generate Master Plan via Intake Form
  const handleGeneratePlan = async (formData) => {
    setIsGenerating(true);
    setIsIntakeModalOpen(false);

    showNotification("Synthesizing celebration architecture with Gemini 2.5 Flash...", "info");

    try {
      if (hasConfiguredApiKey()) {
        const prompt = buildIntakePrompt(formData);
        const responseText = await generateWithGemini(prompt);
        const parsed = parseGeminiPlan(responseText);

        if (parsed) {
          setCurrentPlan(parsed);
          setEventType(parsed.eventType || formData.eventType);
          showNotification("Bespoke event plan successfully generated!", "success");
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.4 } });
          
          setMessages((prev) => [
            ...prev,
            {
              role: 'model',
              text: `✨ I have generated a comprehensive master plan for "${parsed.title}". You can inspect the updated financial allocations, milestones, and vendor checklist across the tabs.`
            }
          ]);
        } else {
          throw new Error('PLAN_PARSE_FAILED');
        }
      } else {
        // High-fidelity fallback synthesizer for instant evaluation without requiring API key
        await new Promise((r) => setTimeout(r, 1200));
        const base = MOCK_PLANS[formData.eventType] || MOCK_PLANS.wedding;
        const customPlan = {
          ...base,
          title: formData.title,
          date: formData.date,
          guestCount: formData.guestCount,
          budget: formData.budget,
          location: formData.location || base.location,
          theme: formData.theme || base.theme,
          summary: `A bespoke celebration designed for ${formData.guestCount} guests with a target budget of $${formData.budget.toLocaleString()} USD at ${formData.location || 'preferred location'}. ${formData.notes || ''}`
        };

        setCurrentPlan(customPlan);
        setEventType(formData.eventType);
        showNotification("Master plan synthesized! (Connect API key for live LLM reasoning)", "success");
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.4 } });
      }
    } catch (err) {
      console.error('Generation error:', err);
      showNotification(`Generation error: ${err.message || 'Please check your API key.'}`, "danger");
    } finally {
      setIsGenerating(false);
    }
  };

  // Conversational Refinement via AI Chat
  const handleSendMessage = async (userText) => {
    const userMessage = { role: 'user', text: userText };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    setStreamingText('');

    try {
      if (hasConfiguredApiKey()) {
        const prompt = buildRefinementPrompt(currentPlan, userText);
        let accumulated = '';

        await generateWithGemini(prompt, (chunk, full) => {
          accumulated = full;
          setStreamingText(full);
        });

        const parsedPlan = parseGeminiPlan(accumulated);
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            text: accumulated.replace(/```(?:json)?\s*[\s\S]*?\s*```/g, '').trim() || "I've synthesized the requested adjustments to your event plan.",
            updatedPlan: parsedPlan
          }
        ]);
      } else {
        // High-intelligence context-aware response for interactive demo mode
        await new Promise((r) => setTimeout(r, 700));
        const simResult = simulateAiChatResponse(currentPlan, userText);
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            text: simResult.text,
            updatedPlan: simResult.updatedPlan,
            isSimulated: true
          }
        ]);
      }
    } catch (err) {
      console.warn('Gemini chat error, falling back to simulation engine:', err);
      // Graceful fallback to rich offline engine
      const simResult = simulateAiChatResponse(currentPlan, userText);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: `${simResult.text}\n\n*(Notice: Live Gemini connection issue: "${err.message}". Seamlessly served by CelebAI Intelligence Engine)*`,
          updatedPlan: simResult.updatedPlan,
          isSimulated: true
        }
      ]);
    } finally {
      setIsStreaming(false);
      setStreamingText('');
    }
  };

  // AI Brainstorm More Ideas
  const handleAskAiMoreIdeas = () => {
    setIsChatOpen(true);
    handleSendMessage(`Please brainstorm 4 additional, highly innovative experiential moments tailored to our theme: "${currentPlan.theme}".`);
  };

  // Export PDF Dossier
  const handleExportPdf = () => {
    showNotification("Generating high-resolution event dossier PDF...", "info");
    try {
      exportPlanToPdf(currentPlan);
      showNotification("PDF Dossier downloaded successfully!", "success");
    } catch (err) {
      console.error('PDF export error:', err);
      showNotification("Failed to generate PDF. Please try again.", "danger");
    }
  };

  return (
    <div className="celebai-app">
      {/* Top Navbar */}
      <Navbar
        currentEventType={eventType}
        onSelectEventType={handleSelectEventType}
        hasApiKey={hasApiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onExportPdf={handleExportPdf}
        isGenerating={isGenerating}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Global Notification Banner */}
      {notification && (
        <div className={`notification-toast toast-${notification.type}`}>
          <Sparkles size={14} />
          <span>{notification.message}</span>
        </div>
      )}

      <main className="app-container">
        {/* Event Header Banner */}
        <EventHeader
          plan={currentPlan}
          onOpenIntake={() => setIsIntakeModalOpen(true)}
          onFocusChat={() => setIsChatOpen(true)}
          isGenerating={isGenerating}
        />

        {/* Navigation Tabs */}
        <div className="tabs-container glass-panel">
          <nav className="tabs-nav" aria-label="Planner Views">
            <button
              className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
              onClick={() => setActiveTab('budget')}
            >
              <DollarSign size={16} />
              <span>Budget Planner</span>
              <span className="tab-badge">${(currentPlan.budget || 0).toLocaleString()}</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              <Calendar size={16} />
              <span>Execution Timeline</span>
              <span className="tab-badge">{currentPlan.timeline?.length || 0}</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'vendors' ? 'active' : ''}`}
              onClick={() => setActiveTab('vendors')}
            >
              <Users size={16} />
              <span>Vendor Checklist</span>
              <span className="tab-badge">{currentPlan.vendors?.length || 0}</span>
            </button>

            <button
              className={`tab-btn ${activeTab === 'ideas' ? 'active' : ''}`}
              onClick={() => setActiveTab('ideas')}
            >
              <Sparkles size={16} />
              <span>Creative Concepts</span>
              <span className="tab-badge">{currentPlan.creativeIdeas?.length || 0}</span>
            </button>
          </nav>

          <button 
            className={`btn-chat-toggle ${isChatOpen ? 'chat-is-active' : ''}`}
            onClick={() => setIsChatOpen(!isChatOpen)}
            title="Open Gemini Conversational Assistant"
          >
            <MessageSquare size={16} />
            <span>AI Copilot</span>
            <span className="copilot-pulse" />
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="tab-view-content">
          {activeTab === 'budget' && (
            <BudgetPlanner
              plan={currentPlan}
              onUpdateBudget={(updatedBudget) => {
                setCurrentPlan({ ...currentPlan, budgetItems: updatedBudget });
                showNotification("Budget allocations updated.", "success");
              }}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelinePlanner
              plan={currentPlan}
              onUpdateTimeline={(updatedTimeline) => {
                setCurrentPlan({ ...currentPlan, timeline: updatedTimeline });
                showNotification("Milestones updated.", "success");
              }}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorChecklist
              plan={currentPlan}
              onUpdateVendors={(updatedVendors) => {
                setCurrentPlan({ ...currentPlan, vendors: updatedVendors });
                showNotification("Vendor checklist updated.", "success");
              }}
            />
          )}

          {activeTab === 'ideas' && (
            <IdeaGenerator
              plan={currentPlan}
              onUpdateIdeas={(updatedIdeas) => {
                setCurrentPlan({ ...currentPlan, creativeIdeas: updatedIdeas });
                showNotification("Creative ideas updated.", "success");
              }}
              onAskAiMoreIdeas={handleAskAiMoreIdeas}
              isGenerating={isGenerating}
            />
          )}
        </div>
      </main>

      {/* Docked AI Assistant Chat Panel */}
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        plan={currentPlan}
        messages={messages}
        onSendMessage={handleSendMessage}
        isStreaming={isStreaming}
        streamingText={streamingText}
        onApplyPlanUpdate={(newPlan) => {
          setCurrentPlan(newPlan);
          showNotification("AI updates merged into your dashboard!", "success");
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.3 } });
        }}
        hasApiKey={hasApiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Floating Chat Trigger button when chat is closed */}
      {!isChatOpen && (
        <button 
          className="floating-ai-trigger"
          onClick={() => setIsChatOpen(true)}
          title="Open CelebAI Assistant"
        >
          <Sparkles size={20} className="float-icon" />
          <span className="float-label">Ask CelebAI</span>
        </button>
      )}

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={() => {
          setHasApiKey(hasConfiguredApiKey());
          showNotification("Gemini API key updated!", "success");
        }}
      />

      <IntakeFormModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onGenerate={handleGeneratePlan}
        isGenerating={isGenerating}
      />

      <style>{`
        .celebai-app {
          min-height: 100vh;
          padding-bottom: 60px;
        }

        .notification-toast {
          position: fixed;
          top: 70px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
          z-index: 1000;
          animation: slideDown 200ms ease-out;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .toast-success {
          background: #065F46;
          color: #A7F3D0;
          border: 1px solid #10B981;
        }

        .toast-info {
          background: #312E81;
          color: #C7D2FE;
          border: 1px solid #6366F1;
        }

        .toast-danger {
          background: #7F1D1D;
          color: #FECDD3;
          border: 1px solid #EF4444;
        }

        .tabs-container {
          margin-bottom: 24px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          overflow-x: auto;
        }

        .tabs-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .tab-btn:hover {
          color: #FFF;
          background: rgba(255, 255, 255, 0.05);
        }

        .tab-btn.active {
          color: #FFF;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .tab-badge {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          padding: 2px 8px;
          border-radius: var(--radius-pill);
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-muted);
        }

        .tab-btn.active .tab-badge {
          background: var(--primary);
          color: #FFF;
        }

        .btn-chat-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.35);
          color: #DDD6FE;
          font-size: 0.82rem;
          font-weight: 700;
          transition: all var(--transition-fast);
          position: relative;
        }

        .btn-chat-toggle:hover {
          background: rgba(139, 92, 246, 0.25);
          transform: translateY(-1px);
        }

        .copilot-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
        }

        .tab-view-content {
          margin-bottom: 40px;
        }

        .floating-ai-trigger {
          position: fixed;
          bottom: 28px;
          right: 28px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 22px;
          border-radius: var(--radius-pill);
          background: var(--primary-gradient);
          color: #FFF;
          box-shadow: 0 10px 30px var(--primary-glow);
          font-weight: 700;
          font-size: 0.9rem;
          z-index: 80;
          transition: transform var(--transition-bounce), box-shadow var(--transition-fast);
        }

        .floating-ai-trigger:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 14px 40px var(--primary-glow);
        }

        @keyframes slideDown {
          from { transform: translateY(-15px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 768px) {
          .tabs-container {
            flex-direction: column;
            align-items: stretch;
          }
          .tabs-nav {
            overflow-x: auto;
          }
          .float-label {
            display: none;
          }
          .floating-ai-trigger {
            padding: 14px;
            border-radius: 50%;
          }
        }
      `}</style>
    </div>
  );
}
