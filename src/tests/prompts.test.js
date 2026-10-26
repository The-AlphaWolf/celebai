import { describe, it, expect } from 'vitest';
import {
  CELEBAI_SYSTEM_INSTRUCTION,
  buildIntakePrompt,
  buildRefinementPrompt,
  parseGeminiPlan,
} from '../utils/prompts';
import { MOCK_PLANS } from '../utils/mockPlans';

describe('Prompt Engineering & Schema Engine', () => {
  it('enforces structured JSON code fence contract in system instruction', () => {
    expect(CELEBAI_SYSTEM_INSTRUCTION).toContain('```json');
    expect(CELEBAI_SYSTEM_INSTRUCTION).toContain('"budgetItems"');
    expect(CELEBAI_SYSTEM_INSTRUCTION).toContain('"timeline"');
    expect(CELEBAI_SYSTEM_INSTRUCTION).toContain('"vendors"');
    expect(CELEBAI_SYSTEM_INSTRUCTION).toContain('"creativeIdeas"');
  });

  it('builds plan intake prompt with custom user criteria', () => {
    const prompt = buildIntakePrompt({
      eventType: 'wedding',
      guestCount: 150,
      budget: 35000,
      theme: 'Botanical Elegance',
      notes: 'Gluten-free menu requirement',
    });

    expect(prompt).toContain('WEDDING');
    expect(prompt).toContain('150');
    expect(prompt).toContain('35000');
    expect(prompt).toContain('Botanical Elegance');
    expect(prompt).toContain('Gluten-free menu requirement');
  });

  it('builds conversational greeting guidance for greeting messages', () => {
    const currentPlan = MOCK_PLANS.wedding;
    const prompt = buildRefinementPrompt(currentPlan, 'Hello');

    expect(prompt).toContain('The user is greeting you with: "Hello"');
    expect(prompt).toContain('Golden Hour Botanical Wedding');
    expect(prompt).toContain('Do NOT include a JSON code block for a simple greeting');
  });

  it('builds full JSON modification context for refinement instructions', () => {
    const currentPlan = MOCK_PLANS.wedding;
    const prompt = buildRefinementPrompt(currentPlan, 'Shift $2,000 from florals to photography');

    expect(prompt).toContain('Here is our current event plan in JSON:');
    expect(prompt).toContain('Shift $2,000 from florals to photography');
    expect(prompt).toContain('```json');
  });

  it('parses valid plan JSON from raw markdown code fence', () => {
    const mockJson = {
      title: 'Parsed Test Gala',
      budget: 15000,
      budgetItems: [{ id: 'b1', allocated: 5000 }],
      timeline: [{ id: 't1', title: 'Start' }],
    };
    const responseWithFence = `Here is your updated plan:\n\`\`\`json\n${JSON.stringify(mockJson)}\n\`\`\`\nHope this helps!`;

    const parsed = parseGeminiPlan(responseWithFence);
    expect(parsed).not.toBeNull();
    expect(parsed.title).toBe('Parsed Test Gala');
    expect(parsed.budget).toBe(15000);
  });

  it('returns null on invalid or non-JSON responses', () => {
    expect(parseGeminiPlan('Just regular conversational text')).toBeNull();
    expect(parseGeminiPlan('')).toBeNull();
  });
});
