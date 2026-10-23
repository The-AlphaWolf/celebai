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

  const trimmed = q.trim();

  // 0. GREETINGS & CASUAL BANTER
  const isGreeting = /^(hi|hello|hey|greetings|hola|howdy|good morning|good evening|good afternoon|yo|sup)[\s!.]*$/i.test(trimmed);
  if (isGreeting || trimmed === 'hi' || trimmed === 'hello' || trimmed === 'hey') {
    return {
      text: `### Hello! 👋 Welcome to CelebAI

I'm your personal **Celebration Architect & Planning Copilot**. I'm currently assisting you with your **"${title}"** (${theme}).

Here are some of the ways I can help elevate your event today:
- **💰 Budget Balancing:** Say *"Suggest 3 ways to reduce catering costs by 15%"* or ask how to optimize your venue spend.
- **⏱️ Timeline Architecture:** Ask for a *"Minute-by-minute photography schedule"* or ceremony run-of-show.
- **🍸 Signature Touches:** Request *"2 craft cocktails and a mocktail for our ${theme} theme"*.
- **🎵 Sound & Music:** Ask for *"Entrance song recommendations & reception playlist vibes"*.

Click any quick suggestion chip below, or ask me whatever is on your mind!`
    };
  }

  // INTRO / WHO ARE YOU / HELP
  if (q.includes('who are you') || q.includes('what can you do') || q.includes('help') || q.includes('what are you')) {
    return {
      text: `### ✨ About CelebAI

I am **CelebAI**, a GenAI celebration planning copilot designed for **weddings, milestone birthdays, and community festivals**.

#### What I Can Do For You:
1. **Dynamic Financial Modeling:** Automatically balance your budget across categories and contingency reserves.
2. **Interactive Timelines:** Build phased milestones from months prior down to day-of ceremony timing.
3. **Vendor Management:** Organize quotes, contract terms, booking statuses, and payment priorities.
4. **Experiential Ideation:** Brainstorm custom themes, interactive entertainment, and memorable guest touchpoints.

Whenever you want to modify your plan, just ask me and I'll synthesize live dashboard updates you can apply in one click!`
    };
  }

  // GRATITUDE
  if (q.includes('thank') || q.includes('thx') || q.includes('awesome') || q.includes('great') || q.includes('perfect')) {
    return {
      text: `### 🎉 You're Very Welcome!

I'm thrilled I could help make your **"${title}"** planning easier. 

Feel free to ask for more ideas, refine your vendor checklist, or click **Export Dossier** at the top right to download your complete event plan as a polished PDF!`
    };
  }

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

  // 8. CULINARY, RECIPES & BANQUET MENUS
  if (q.includes('mix veg') || q.includes('recipe') || q.includes('cook') || q.includes('dish') || q.includes('curry') || q.includes('vegetable')) {
    return {
      text: `### 🍲 Chef's Banquet Recipe: Royal Celebration Mixed Vegetable (*Shaahi Subz Melange*)

*Curated for celebratory banquets, wedding receptions, and milestone family dinners (Serves 8–10, scales easily for 50–100+ guests).*

---

#### 🥕 Fresh Ingredients & Jewel Medley:
- **Vegetables (Jewel Cut):** 1.5 cups fresh cauliflower florets, 1/2 cup diced carrots, 1/2 cup french green beans, 1/2 cup sweet green peas, 1/2 cup baby corn (halved).
- **Golden Protein:** 1 cup cubed *malai paneer* (or organic pressed firm tofu for a 100% vegan banquet).
- **Vibrant Crunch:** 1/2 cup tricolor sweet bell peppers (red, yellow, green) cut into 1-inch diamonds.
- **Aromatic Whole Spices:** 2 tbsp pure desi ghee (or cold-pressed coconut oil), 1 tsp cumin seeds, 2 green cardamom pods, 1 black cardamom, 1-inch cinnamon stick, 1 bay leaf.
- **Velvet Cashew-Tomato Gravy Base:** 
  - 2 medium sweet onions (finely minced)
  - 1.5 tbsp freshly pounded ginger-garlic paste
  - 3 large ripe Roma tomatoes puréed with 15 soaked raw cashews and 1 tbsp melon seeds (*magaz*)
- **Festive Spices:** 1/2 tsp turmeric powder, 1.5 tsp Kashmiri red chili powder (vibrant ruby color without aggressive heat), 1.5 tsp roasted coriander powder, 1/2 tsp *shahi garam masala*, 1 tsp crushed *kasuri methi* (sun-dried fenugreek leaves), salt to taste.
- **Garnish & Finish:** 2 tbsp light cream, fresh ginger juliennes, chopped fresh cilantro.

---

#### 👨‍🍳 Step-by-Step Banquet Cooking Method:
1. **Jewel Blanching (Color Lock):** Bring salted water to a rolling boil with a pinch of sugar. Parboil cauliflower, carrots, beans, and baby corn for **3 minutes**. Immediately transfer into an ice water bath. *(Pro Tip: This locks in the vivid green and orange jewel tones and keeps them crisp-tender inside chafing dishes).*
2. **Pan-Sear the Paneer & Peppers:** In a wide pan or karahi, heat 1 tsp ghee. Flash-sauté paneer cubes and bell peppers on high heat for 2 minutes until edges are kissed with gold. Remove and set aside.
3. **Aromatic Foundation:** Heat the remaining ghee in the karahi. Add the whole spices (cumin, cardamoms, cinnamon, bay leaf). When they crackle and release their fragrance, add the minced onions. Sauté patiently on medium heat until golden caramel. Add ginger-garlic paste and sauté for 60 seconds until fragrant.
4. **Velvet Gravy Simmer:** Pour in the tomato-cashew purée. Add turmeric, Kashmiri red chili powder, coriander powder, and salt. Cook on medium-low flame, stirring frequently, until the gravy thickens and droplets of fragrant ghee separate along the pan sides (about 8–10 minutes).
5. **Meld & Infuse:** Add 1/2 cup warm water to achieve a luxurious, velvety banquet consistency. Gently fold in the blanched vegetables, paneer cubes, and bell peppers. Cover and simmer gently for 4–5 minutes so the vegetables absorb the rich, spiced sauce without becoming mushy.
6. **Royal Finale:** Remove from heat. Sprinkle crushed *kasuri methi* and *shahi garam masala*. Drizzle a swirl of cream and finish with fresh ginger matchsticks and cilantro sprigs.

---

#### 🍽️ Catering & Banquet Service Logistics:
- **Buffet Holding:** Keep in heated chafing dishes at **65°C (150°F)**. For large-scale catering (50+ guests), keep par-cooked vegetables and cashew sauce separate, combining 20 minutes before serving.
- **Perfect Pairings:** Accompany with warm garlic butter naan, zafrani saffron jeera rice, and a crisp pomegranate-cucumber mint raita.`
    };
  }

  // 9. DESSERTS, SWEETS & CELEBRATION CAKES
  if (q.includes('dessert') || q.includes('cake') || q.includes('sweet') || q.includes('pastry') || q.includes('chocolate')) {
    return {
      text: `### 🎂 Curated Celebration Dessert Architecture for "${title}":

1. **Centerpiece Tiered Cake:**
   - *Flavor Profile:* Tahitian vanilla bean chiffon with layers of crushed raspberry reduction and whipped mascarpone champagne buttercream.
   - *Design Finish:* Semi-naked textured frosting with edible pressed florals and subtle brushed gold leaf accents.

2. **Artisanal Gelato & Warm Dessert Station:**
   - Small-batch pistachio cardamom gelato paired with warm dark chocolate lava bites and Belgian waffle crisps.

3. **Petite Confection Display (Late-Night Energy Boost):**
   - Lavender honey macarons, miniature passionfruit tarts, and dark chocolate sea-salt espresso truffles.`
    };
  }

  // 10. APPETIZERS & COCKTAIL HOUR HORS D'OEUVRES
  if (q.includes('appetizer') || q.includes('starter') || q.includes('finger food') || q.includes('canap') || q.includes('hors d')) {
    return {
      text: `### 🍢 4 High-End Cocktail Hour Canapés & Starters:

1. **Truffle & Wild Mushroom Arancini:**
   - Crisp arborio risotto spheres infused with black truffle emulsion and melted fontina cheese center.
2. **Whipped Ricotta & Fig Crostini:**
   - Toasted artisan sourdough topped with whipped thyme ricotta, caramelized mission figs, and aged balsamic glaze.
3. **Spiced Paneer Tikka / Chicken Skewers:**
   - Tender skewers marinated in Greek yogurt, smoked paprika, and mint chimichurri drizzle.
4. **Chilled Mango Avocado Ceviche Cups (Vegan):**
   - Diced mango, avocado, lime, and cilantro served in crispy wonton cups with toasted chili flakes.`
    };
  }

  // 11. EVENT PLANNING ARCHITECTURE (if relevant to events)
  const isEventRelated = /venue|decor|floral|invit|dress|attire|lighting|seating|table|speech|mc|host|video|celebrat|party|wedding|birthday|festival|plan/i.test(q);
  if (isEventRelated) {
    return {
      text: `### 💡 Event Architecture Insights for "${title}"

Regarding your request: **"${query}"** (Theme: *${theme}* | Target Budget: *$${(currentPlan.budget || budget).toLocaleString()} USD*):

1. **Aesthetic Synergy:** Align every detail with your core palette. Subtle atmospheric touches (warm uplighting, textured linens, custom stationery) create a much more memorable impression than excessive props.
2. **Guest Experience First:** Prioritize seamless guest transitions and interactive moments (signature cocktails, shared food stations) over lengthy formal pauses.
3. **Budget Flexibility:** Keep at least 8–10% of your budget in an unallocated contingency buffer to cover last-minute vendor overtime or unexpected equipment needs.

*You can ask me to reallocate budget categories, build a minute-by-minute timeline schedule, or curate vendor specifications!*`
    };
  }

  // 12. TRANSPARENT DEMO MODE FALLBACK (for off-topic or general inquiries)
  return {
    text: `### 💡 CelebAI Assistant

I noticed you asked: **"${query}"**.

Currently, CelebAI is running in **Interactive Demo Mode**, which is pre-trained with celebration intelligence for:
- 🍲 **Banquet & Catering Menus:** Ask for *"Give me the recipe for mix veg"*, *"Suggest cocktail hour appetizers"*, or *"Signature wedding cake flavors"*.
- 💰 **Budget Balancing:** Say *"Suggest 3 ways to reduce catering costs by 15%"* or ask how to optimize your venue spend.
- ⏱️ **Timelines & Run-of-Show:** Ask for a *"Minute-by-minute photography schedule"* or DJ reception timeline.
- 🎵 **Sound & Atmosphere:** Ask for *"Grand entrance songs & reception playlist vibe"*.
- 🍸 **Signature Drinks:** Ask for *"2 craft cocktails and a mocktail for our ${theme} theme"*.

---

#### 🚀 Want Open-Ended Conversational AI?
To ask unrestricted questions (including general coding, trivia, or custom creative requests), connect your free **Google Gemini 2.5 Flash API Key**:
1. Click the **Demo / Add Key** button in the top navigation bar.
2. Paste your free key from [Google AI Studio](https://aistudio.google.com/app/apikey).`
  };
}

