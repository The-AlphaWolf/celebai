/**
 * Prompt Engineering Engine for CelebAI — PromptWars Challenge 5
 * Designed for Gemini 2.5 Flash to guarantee high-quality structured event intelligence
 */

export const CELEBAI_SYSTEM_INSTRUCTION = `You are CelebAI, an elite event planner and celebration architect powered by Google Gemini.
Your mission is to generate comprehensive, impeccably structured, creative, and actionable event plans for weddings, milestone birthdays, and community festivals.

Whenever you generate or update a full event plan, you MUST format your response as a valid JSON object wrapped in a \`\`\`json code fence block.

The JSON schema must adhere strictly to this shape:
{
  "title": "Inspiring Event Name",
  "eventType": "wedding" | "birthday" | "community",
  "theme": "Core theme and aesthetic descriptor",
  "summary": "2-3 sentence executive summary of the vision and guest experience",
  "currency": "$",
  "budget": 25000,
  "budgetItems": [
    {
      "id": "b1",
      "category": "Venue & Rentals",
      "allocated": 8000,
      "spent": 0,
      "percentage": 32,
      "color": "#F59E0B"
    }
  ],
  "timeline": [
    {
      "id": "t1",
      "phase": "Milestone phase (e.g. 4 Months Prior or Day-of: 04:00 PM)",
      "title": "Milestone action item",
      "time": "Relative or clock time",
      "status": "upcoming" | "in-progress" | "completed",
      "description": "Specific execution instructions"
    }
  ],
  "vendors": [
    {
      "id": "v1",
      "category": "Catering",
      "name": "Vendor Role or Business Prototype",
      "contact": "Sample contact email/phone",
      "cost": 7500,
      "status": "To Research" | "Contacted" | "Quote Received" | "Booked",
      "priority": "Critical" | "High" | "Medium",
      "notes": "Key requirements, dietary considerations, contract specs"
    }
  ],
  "creativeIdeas": [
    {
      "id": "c1",
      "category": "Interactive / Décor / Sensory / Food",
      "title": "Creative Hook Name",
      "description": "Vivid explanation of the unique, memorable guest touchpoint"
    }
  ]
}

Ensure the sum of all allocated amounts equals or is near the total budget. Provide at least 5 budget categories, 5 timeline milestones, 4 vendor checklist rows, and 4 high-impact creative ideas.`;

export function buildIntakePrompt({ eventType, title, date, guestCount, budget, location, theme, notes }) {
  return `Generate a comprehensive event plan for a ${eventType.toUpperCase()} celebration:

Event Details:
- Working Title / Occasion: ${title || `${eventType} Celebration`}
- Anticipated Date: ${date || 'Flexible within next 6-12 months'}
- Guest Count: ${guestCount || 100} attendees
- Total Target Budget: $${budget || 15000} USD
- Target Location / Atmosphere: ${location || 'Indoor/Outdoor Versatile Venue'}
- Desired Aesthetic / Theme: ${theme || 'Modern, warm, welcoming, and memorable'}
- Special Requirements & Vision: ${notes || 'Focus on exceptional guest flow, great culinary moments, and engaging memories.'}

Please return the response formatted as JSON inside a \`\`\`json block according to the specified CelebAI schema. Include realistic costs, phased milestone timing, critical vendor checkpoints, and 4 truly unique, memorable experiential ideas.`;
}

export function buildRefinementPrompt(currentPlan, userInstruction) {
  return `Here is our current event plan in JSON:
${JSON.stringify(currentPlan, null, 2)}

User's Request:
"${userInstruction}"

Please update the plan accordingly. Adjust the budget allocations, timeline items, vendor checklist, or creative ideas as necessary.
Return the complete updated plan inside a \`\`\`json block.`;
}

/**
 * Extracts and parses JSON from Gemini's response
 */
export function parseGeminiPlan(text) {
  if (!text) return null;

  // 1. Try markdown JSON fence ```json ... ```
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const rawString = jsonMatch ? jsonMatch[1].trim() : text.trim();

  try {
    const parsed = JSON.parse(rawString);
    if (parsed && parsed.budgetItems && parsed.timeline) {
      return parsed;
    }
  } catch {
    // 2. Try looking for the first '{' and last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const substring = text.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(substring);
        if (parsed && (parsed.budgetItems || parsed.timeline)) {
          return parsed;
        }
      } catch (e2) {
        console.warn('Fallback JSON extraction failed:', e2);
      }
    }
  }

  return null;
}
