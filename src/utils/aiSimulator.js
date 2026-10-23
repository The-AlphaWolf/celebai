/**
 * CelebAI Intelligent Event Simulation Engine
 * Provides context-aware, structured responses and real plan recalculations
 * when running in offline/demo mode or as a resilient fallback.
 */

export function simulateAiChatResponse(currentPlan, query) {
  const q = (query || '').toLowerCase();
  const theme = currentPlan.theme || 'Celebratory & Elegant';
  const eventType = currentPlan.eventType || 'wedding';
  const budget = currentPlan.budget || 25000;
  const title = currentPlan.title || 'Celebration';

  // 1. CATERING & BAR COST REDUCTION
  if (q.includes('catering') || q.includes('reduce') || q.includes('15%') || q.includes('save') || q.includes('trim budget') || q.includes('cut cost')) {
    // Clone and recalculate budget items
    const updatedBudgetItems = currentPlan.budgetItems.map(item => {
      if (item.category.toLowerCase().includes('catering') || item.category.toLowerCase().includes('food')) {
        const reduction = Math.round(item.allocated * 0.15);
        return {
          ...item,
          allocated: item.allocated - reduction,
          percentage: Math.round(((item.allocated - reduction) / budget) * 100),
          notes: 'Reduced by 15% via family-style format & curated bar'
        };
      }
      return item;
    });

    // Add or boost Reserve Buffer with savings
    const cateringItem = currentPlan.budgetItems.find(i => i.category.toLowerCase().includes('catering') || i.category.toLowerCase().includes('food'));
    const savings = cateringItem ? Math.round(cateringItem.allocated * 0.15) : Math.round(budget * 0.05);

    let hasBuffer = false;
    const finalBudgetItems = updatedBudgetItems.map(item => {
      if (item.category.toLowerCase().includes('reserve') || item.category.toLowerCase().includes('buffer') || item.category.toLowerCase().includes('contingency')) {
        hasBuffer = true;
        return {
          ...item,
          allocated: item.allocated + savings,
          percentage: Math.round(((item.allocated + savings) / budget) * 100)
        };
      }
      return item;
    });

    if (!hasBuffer) {
      finalBudgetItems.push({
        id: 'b-savings-' + Date.now(),
        category: 'Unallocated Savings & Buffer',
        allocated: savings,
        spent: 0,
        percentage: Math.round((savings / budget) * 100),
        color: '#10B981'
      });
    }

    const updatedPlan = {
      ...currentPlan,
      budgetItems: finalBudgetItems,
      summary: `${currentPlan.summary} (Optimized with a 15% catering cost reduction generating $${savings.toLocaleString()} in flexible contingency buffer).`
    };

    return {
      text: `### 📉 3 High-Impact Ways to Reduce Catering & Bar Costs by 15% ($${savings.toLocaleString()} saved):

1. **Pivot from Plated Multi-Course to Elevated Family-Style or Food Stations**
   - *Savings:* Reduces catering service staff from 1 server per 8 guests down to 1 per 16 guests, saving **18–22% on labor fees**.
   - *Guest Perk:* Encourages lively conversation as artisan platters and seasonal salads are shared across the tables.

2. **Curate 2 Signature Cocktails + Local Wine/Beer (Eliminate Top-Shelf Open Bar)**
   - *Savings:* Replaces costly 40-bottle open liquor bars with high-yield batch recipes (e.g., botanical gin sprig cocktail & smoked honey bourbon punch), saving **~25% on alcohol breakage and waste**.

3. **Time-Shift Late-Night Sweets to Interactive Food Carts**
   - *Savings:* Replace expensive plated dessert courses with an interactive espresso/gelato cart or warm churro station.

✨ **Dashboard Update Ready:** I've prepared an updated financial allocation trimming catering by $${savings.toLocaleString()} and moving it into your contingency reserve buffer!`,
      updatedPlan
    };
  }

  // 2. ENTRANCE SONG & PLAYLIST VIBE
  if (q.includes('song') || q.includes('playlist') || q.includes('entrance') || q.includes('music') || q.includes('dj') || q.includes('band')) {
    if (eventType === 'wedding') {
      return {
        text: `### 🎵 Curated Entrance Songs & Musical Arc for "${theme}":

#### 🌟 Grand Entrance Recommendations (Choose Your Vibe):
- **Upbeat & Joyful:** *"You've Got The Love"* — Florence + The Machine (drop the horns right as the doors part!)
- **Soulful & Timeless:** *"Texas Sun"* — Leon Bridges & Khruangbin
- **Modern Indie Groove:** *"Adore You"* — Harry Styles (warm, energetic, universally loved)
- **High-Energy Anthem:** *"Love On Top"* — Beyoncé

#### 🎧 4-Phase Reception Sound Architecture:
1. **Arrival & Welcome:** Acoustic guitar & gentle Bossa Nova covers of 90s/00s favorites.
2. **Dinner Vibe:** Cinematic string quartet renditions (Vitamin String Quartet) & vinyl jazz ballads.
3. **First Dances:** Emotional, uninterrupted vocal performance.
4. **Party Peak:** 70s disco funk transition to late 90s/2000s singalongs, culminating in euphoric indie dance anthems!`
      };
    } else if (eventType === 'birthday') {
      return {
        text: `### 🎵 Birthday Entrance & DJ Energy Arc for "${title}":

#### 🚀 Grand Entrance Tracks:
- **Synthwave Peak:** *"Midnight City"* — M83 (unbeatable synth drop!)
- **Electropop Hype:** *"Blinding Lights"* — The Weeknd
- **Retro Swagger:** *"24K Magic"* — Bruno Mars

#### 🎛️ Night Progression:
- **08:00 PM – Warmup:** Lo-fi beats, synthpop, and tropical house to loosen up early arrivals.
- **09:30 PM – Turning Point:** 90s hip-hop & throwback R&B singalongs.
- **11:00 PM – Peak Floor:** Fast-tempo dance, nu-disco, and festival bass drops!`
      };
    } else {
      return {
        text: `### 🎵 Community Festival Musical Programming:
- **Kickoff:** Local youth brass band or acoustic indie ensemble to welcome early attendees.
- **Mid-day:** World music, folk collectives, and family-friendly rhythm ensembles.
- **Sunset Finale:** High-energy regional cover band playing crowd-pleaser anthems that span generations!`
      };
    }
  }

  // 3. PHOTOGRAPHY SCHEDULE
  if (q.includes('photo') || q.includes('photography') || q.includes('schedule') || q.includes('camera') || q.includes('shot list')) {
    return {
      text: `### 📸 Minute-by-Minute Golden Hour Photography Schedule:

- **02:00 PM — Flat-Lay & Artifacts:** Rings, invitations, botanical florals, heirloom accents.
- **02:30 PM — Getting Ready & First Looks:** Private, emotional reveal in quiet shade.
- **03:15 PM — VIP & Wedding Party Group Shots:** High-energy group portraits while hair & makeup are flawless.
- **04:00 PM — Untouched Ceremony & Reception Architecture:** Wide-angle shots of tables, candle displays, and floral installations.
- **04:30 PM — Ceremony & Emotional Reaction:** Vows, ring exchange, and first recessional march.
- **05:15 PM — Family Formals:** Rapid-fire 10-group portrait checklist (max 20 minutes).
- **05:45 PM — Golden Hour Romantics (Golden 30 Minutes):** Soft sunset glow portraits away from the crowd.
- **06:45 PM — Grand Entrance & Night Action:** Speeches, first dances, and flash party candid photography.`
    };
  }

  // 4. SIGNATURE COCKTAILS & DRINKS
  if (q.includes('cocktail') || q.includes('drink') || q.includes('mocktail') || q.includes('bar menu')) {
    return {
      text: `### 🍸 2 Signature Craft Cocktails & 1 Artisan Mocktail for "${theme}":

1. **The Botanical Amber (Cocktail):**
   - *Ingredients:* Small-batch botanical gin, elderflower liqueur, freshly squeezed Meyer lemon juice, prosecco float.
   - *Garnish:* Charred rosemary sprig & edible gold leaf flake.

2. **Smoked Honey Old Fashioned (Cocktail):**
   - *Ingredients:* Straight rye bourbon, wildflower honey syrup, Angostura & orange bitters, expressed orange peel.
   - *Garnish:* Smoked applewood mist in chilled crystal tumbler.

3. **Sparkling Lavender Citrus Fizz (Zero-Proof Mocktail):**
   - *Ingredients:* Cold-pressed white peach purée, house lavender syrup, sparkling mineral water, fresh mint.
   - *Garnish:* Dehydrated blood orange wheel & fresh lavender blossom.`
    };
  }

  // 5. INTERACTIVE GAMES & ENTERTAINMENT
  if (q.includes('game') || q.includes('entertainment') || q.includes('activity') || q.includes('fun')) {
    return {
      text: `### 🎲 3 Engaging Experiential Activities for Your Guests:

1. **Custom "Celebration Trivia & Audio Quiz":**
   - Short 10-minute game hosted by the MC between dinner courses via QR code, projecting live leaderboard standings on screen with humorous custom questions.

2. **The Audio Guestbook Telephone Station:**
   - A vintage rotary telephone where guests pick up the receiver, hear your custom voice prompt, and leave hilarious/heartfelt voice messages recorded directly into high-fidelity MP3s.

3. **Interactive Polaroid Memory Mosaic Wall:**
   - Guests snap polaroids with color-themed instant cameras and pin them onto a numbered grid that reveals an artistic master silhouette of the occasion.`
    };
  }

  // 6. PARTY FAVORS UNDER $5
  if (q.includes('favor') || q.includes('gift') || q.includes('souvenir') || q.includes('takeaway')) {
    return {
      text: `### 🎁 4 Elegant Party Favors Under $5 Each:

1. **Wildflower Seed Matchbooks ($1.20 each):**
   - Custom-printed craft card matchbooks filled with native bee-friendly wildflower seeds stamped with your date and signature monogram.

2. **Artisan Mini Olive Oil / Honey Jars ($3.50 each):**
   - 2oz hexagonal glass jars with local clover honey or Tuscan rosemary-infused olive oil, tied with raw twine.

3. **Custom Enamel Monogram Lapel Pins ($2.20 each):**
   - Sleek minimalist geometric pin in brushed antique brass or matte black that guests can wear all evening.

4. **Fresh Warm Bakery Morning Scones ($2.80 each):**
   - Wrapped in greaseproof craft paper with a cute *"Midnight Snack / Morning Glow"* sticker as guests depart.`
    };
  }

  // 7. ZERO-WASTE & SUSTAINABILITY
  if (q.includes('waste') || q.includes('eco') || q.includes('green') || q.includes('sustainable')) {
    return {
      text: `### 🌱 4 Actionable Steps for a 100% Zero-Waste Event:

1. **Repurposed Floral Installations:**
   - Have staff transfer ceremony arch arrangements directly onto the head table and bar front during cocktail hour.
2. **Digital & Edible Signage:**
   - Digital bar menus on mirrors or framed chalk calligraphy instead of hundreds of single-use printed cards.
3. **Local Farm-to-Table Food Rescue:**
   - Partner with a verified local food rescue initiative to immediately collect any untouched prepared courses.
4. **Compostable & Real Linens Only:**
   - Eliminate all single-use plastics from bar straws to cocktail napkins.`
    };
  }

  // 8. GENERAL INTEL & CONSULTING ADVICE
  return {
    text: `### 💡 Strategic Recommendation for "${title}":

Regarding: *"${query}"*

1. **Aesthetic Consistency:** Ensure every touchpoint resonates with your **${theme}** palette. Subtle details (such as ambient candlelight or typography accents) deliver far greater emotional resonance than heavy-handed décor.
2. **Guest Flow & Pacing:** Keep transitions under 15 minutes. Long pauses between ceremonies, speeches, and dancing cause guest energy to dip.
3. **Financial Protection:** Always preserve your unallocated contingency reserve to cushion unexpected vendor overages or overtime requests.

*Tip: Connect your free Google Gemini API Key via "Demo / Add Key" in the top bar to enable live streaming reasoning with multimodal JSON synthesis!*`
  };
}
