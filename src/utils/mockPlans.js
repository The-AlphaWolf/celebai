export const MOCK_PLANS = {
  wedding: {
    title: "Golden Hour Botanical Wedding",
    eventType: "wedding",
    date: "October 24, 2026",
    guestCount: 150,
    budget: 28000,
    currency: "$",
    location: "Glasshouse Conservatory, Pacific Grove",
    theme: "Modern Botanical, Candlelight & Warm Gold",
    summary: "A romantic, nature-infused celebration emphasizing intimate guest experiences, sustainable floral installations, and an energetic live acoustic-to-DJ musical journey.",
    budgetItems: [
      { id: "b1", category: "Venue & Rentals", allocated: 8500, spent: 8500, percentage: 30, color: "#F59E0B" },
      { id: "b2", category: "Catering & Bar", allocated: 9800, spent: 9200, percentage: 35, color: "#10B981" },
      { id: "b3", category: "Photo & Cinema", allocated: 3600, spent: 3600, percentage: 13, color: "#8B5CF6" },
      { id: "b4", category: "Florals & Ambience", allocated: 2800, spent: 2400, percentage: 10, color: "#EC4899" },
      { id: "b5", category: "Live Music & Sound", allocated: 2000, spent: 1800, percentage: 7, color: "#06B6D4" },
      { id: "b6", category: "Attire & Beauty", allocated: 1300, spent: 1100, percentage: 5, color: "#F97316" }
    ],
    timeline: [
      { id: "t1", phase: "6 Months Prior", title: "Secure Glasshouse Venue & Primary Caterer", time: "Month -6", status: "completed", description: "Deposit submitted for conservatory grounds and initial tasting menu locked in." },
      { id: "t2", phase: "3 Months Prior", title: "Invitations & Floral Mockup", time: "Month -3", status: "completed", description: "Digital foil-press invitations dispatched; mock centerpiece approved with florist." },
      { id: "t3", phase: "1 Month Prior", title: "Final RSVP Count & Seating Topology", time: "Month -1", status: "in-progress", description: "142 confirmed RSVPs. Coordinate dietary allergies (vegan & gluten-free) with chef." },
      { id: "t4", phase: "Day-of: 02:00 PM", title: "First Look & Golden Hour Portraits", time: "02:00 PM", status: "upcoming", description: "Private couple photography in the botanical orchid gallery prior to guest arrival." },
      { id: "t5", phase: "Day-of: 04:30 PM", title: "Ceremony & String Trio Prelude", time: "04:30 PM", status: "upcoming", description: "Vows exchanged beneath cascading eucalyptus arch with live acoustic renditions." },
      { id: "t6", phase: "Day-of: 06:00 PM", title: "Cocktail Hour & Passed Canapés", time: "06:00 PM", status: "upcoming", description: "Signature lavender honey spritzers and artisanal charcuterie on the sunset terrace." },
      { id: "t7", phase: "Day-of: 07:30 PM", title: "Dinner, Speeches & First Dance", time: "07:30 PM", status: "upcoming", description: "Farm-to-table dinner followed by heartfelt toasts, cake cutting, and dance floor opening." }
    ],
    vendors: [
      { id: "v1", category: "Venue", name: "Pacific Conservatory Glasshouse", contact: "events@pacificglasshouse.com", cost: 8500, status: "Booked", priority: "Critical", notes: "Curfew at 11:30 PM; clean-up included." },
      { id: "v2", category: "Catering", name: "Artisan Hearth & Vine Catering", contact: "+1 (555) 234-8901", cost: 9800, status: "Booked", priority: "Critical", notes: "Includes bar service and 3 signature craft cocktails." },
      { id: "v3", category: "Photography", name: "Lumina Storytellers", contact: "hello@luminastories.photo", cost: 3600, status: "Booked", priority: "High", notes: "8 hours coverage, 2 shooters, drone footage included." },
      { id: "v4", category: "Florals", name: "Wildflower & Fern Studios", contact: "orders@wildflowerfern.design", cost: 2800, status: "Quote Received", priority: "Medium", notes: "Arch installation + 15 table garland centerpieces." },
      { id: "v5", category: "Entertainment", name: "Soundwave Collective (Trio + DJ)", contact: "booking@soundwave.live", cost: 2000, status: "Contract Pending", priority: "High", notes: "Needs wireless lapel mic for officiant and battery PA for garden." }
    ],
    creativeIdeas: [
      { id: "c1", category: "Interactive Décor", title: "Vintage Audio Guestbook", description: "Retro rotary phone station where guests record heartfelt voicemail memories instead of signing a paper book." },
      { id: "c2", category: "Signature Experience", title: "Sunset Espresso & Affogato Cart", description: "Post-dinner mobile barista serving fresh Italian gelato affogatos as late-night fuel for the dance floor." },
      { id: "c3", category: "Personalized Favor", title: "Custom Botanical Seed Packets", description: "Hand-stamped wildflower seed packets inscribed with 'Let Love Grow', tailored to local pollinators." },
      { id: "c4", category: "Seating Concept", title: "Polaroid Photo Wall Escort Cards", description: "A wooden pegboard featuring a candid photo of each guest paired with their table number assignment." }
    ]
  },

  birthday: {
    title: "Retro Neon Arcade 30th Birthday Bash",
    eventType: "birthday",
    date: "November 14, 2026",
    guestCount: 65,
    budget: 6500,
    currency: "$",
    location: "Loft 88 Urban Warehouse, Downtown",
    theme: "Synthwave, Neon Glow & 80s/90s Arcade Nostalgia",
    summary: "An electrifying milestone party with glowing neon installations, classic multiplayer cabinet tournaments, signature retro cocktails, and a high-energy DJ set.",
    budgetItems: [
      { id: "b1", category: "Space & Retro Arcade Rental", allocated: 2200, spent: 2200, percentage: 34, color: "#F43F5E" },
      { id: "b2", category: "Street Food & Craft Bar", allocated: 2100, spent: 1950, percentage: 32, color: "#8B5CF6" },
      { id: "b3", category: "DJ, Lighting & Neon FX", allocated: 1200, spent: 1200, percentage: 18, color: "#06B6D4" },
      { id: "b4", category: "Custom Cake & Desserts", allocated: 550, spent: 500, percentage: 9, color: "#F59E0B" },
      { id: "b5", category: "Prizes, Favors & Glow Merch", allocated: 450, spent: 400, percentage: 7, color: "#10B981" }
    ],
    timeline: [
      { id: "t1", phase: "3 Weeks Prior", title: "Cabinet Delivery & Electricity Map", time: "Week -3", status: "completed", description: "Confirm 4 rental arcade units (Pac-Man, Street Fighter II, NBA Jam, Dance Dance)." },
      { id: "t2", phase: "1 Week Prior", title: "DJ Playlist & Custom Neon Sign Check", time: "Week -1", status: "completed", description: "Delivered neon LED sign reading 'Level 30 Unlocked'." },
      { id: "t3", phase: "Day-of: 06:30 PM", title: "Doors Open & Neon Welcome Cocktails", time: "06:30 PM", status: "upcoming", description: "Guests receive glowing LED wristbands and neon-rimmed 'Pixel Punch'." },
      { id: "t4", phase: "Day-of: 07:30 PM", title: "Street Food Sliders & Taco Station", time: "07:30 PM", status: "upcoming", description: "Casual gourmet food truck catering inside warehouse courtyard." },
      { id: "t5", phase: "Day-of: 08:45 PM", title: "Multiplayer Tournament Championship", time: "08:45 PM", status: "upcoming", description: "Quick-fire Street Fighter & Mario Kart bracket on giant projector screen." },
      { id: "t6", phase: "Day-of: 10:00 PM", title: "Cake Cutting & Glitch Laser Drop", time: "10:00 PM", status: "upcoming", description: "Custom geometric cyberpunk cake followed by confetti blast and DJ dance set." }
    ],
    vendors: [
      { id: "v1", category: "Venue", name: "Loft 88 Industrial Arts Space", contact: "rentals@loft88.city", cost: 2200, status: "Booked", priority: "Critical", notes: "Allows outside catering and open till 2:00 AM." },
      { id: "v2", category: "Food & Bar", name: "Bao Bros & Slider Bar", contact: "hi@baobroskitchen.com", cost: 2100, status: "Booked", priority: "High", notes: "Includes 2 bartenders and custom mocktail taps." },
      { id: "v3", category: "Sound & Lights", name: "Pulse Laser & DJ Systems", contact: "+1 (555) 789-3210", cost: 1200, status: "Booked", priority: "High", notes: "Supplying 10 blacklights and wireless subwoofer array." },
      { id: "v4", category: "Bakery", name: "Glitch Sweet Lab", contact: "cakes@glitchsweets.io", cost: 550, status: "Deposit Paid", priority: "Medium", notes: "3-tier dark chocolate salted caramel with neon drip." }
    ],
    creativeIdeas: [
      { id: "c1", category: "Entertainment", title: "Mario Kart Giant Projection Tourney", description: "Hook up an emulator console to a 150-inch blank warehouse brick wall for 4-player spectator mayhem." },
      { id: "c2", category: "Social / Photos", title: "Infinity Mirror Neon Photo Booth", description: "An immersive mirror tunnel lined with addressable RGB LED strips for viral TikToks and souvenir strips." },
      { id: "c3", category: "Food Twist", title: "Glow-in-the-Dark Cotton Candy Station", description: "Fluffy spun sugar mounted on battery-operated glowing LED wands for a futuristic treat." },
      { id: "c4", category: "Interactive Game", title: "Trivia Quest: Decade of the Birthday Star", description: "Smartphone-based live pub trivia highlighting hilarious pop-culture milestones from the year they were born." }
    ]
  },

  community: {
    title: "EcoHarvest Community Makers Festival",
    eventType: "community",
    date: "September 19, 2026",
    guestCount: 450,
    budget: 14500,
    currency: "$",
    location: "Meadowbrook Civic Park & Amphitheater",
    theme: "Sustainability, Local Craft, Live Music & Family Fun",
    summary: "A zero-waste, all-ages neighborhood festival connecting local artisans, urban farmers, youth education workshops, and regional indie musicians.",
    budgetItems: [
      { id: "b1", category: "Park Permits & Municipal Services", allocated: 3800, spent: 3800, percentage: 26, color: "#6366F1" },
      { id: "b2", category: "Stage, Audio & Solar Generators", allocated: 4200, spent: 3900, percentage: 29, color: "#10B981" },
      { id: "b3", category: "Maker Booths & Shade Tents", allocated: 2800, spent: 2600, percentage: 19, color: "#F59E0B" },
      { id: "b4", category: "Signage, Wayfinding & Waste Sorting", allocated: 1900, spent: 1750, percentage: 13, color: "#EC4899" },
      { id: "b5", category: "Volunteer Hydration & Safety Ops", allocated: 1800, spent: 1500, percentage: 13, color: "#06B6D4" }
    ],
    timeline: [
      { id: "t1", phase: "2 Months Prior", title: "City Council Permit & Insurance Approval", time: "Month -2", status: "completed", description: "Public parks permit, amplified sound waiver, and EMS liaison confirmed." },
      { id: "t2", phase: "1 Month Prior", title: "Artisan & Food Truck Curation", time: "Month -1", status: "completed", description: "32 makers, 6 local farm stalls, and 4 zero-waste food vendors registered." },
      { id: "t3", phase: "1 Week Prior", title: "Volunteer Orientation & Safety Walkthrough", time: "Week -1", status: "in-progress", description: "Training 40 neighborhood volunteers across waste management and registration." },
      { id: "t4", phase: "Festival: 09:00 AM", title: "Vendor Setup & Solar Rig Ignition", time: "09:00 AM", status: "upcoming", description: "Silent clean solar batteries power stage soundcheck and craft booth check-ins." },
      { id: "t5", phase: "Festival: 11:00 AM", title: "Gates Open & Youth Maker Workshops", time: "11:00 AM", status: "upcoming", description: "Seed bomb crafting, solar cooker demos, and live acoustic regional artists." },
      { id: "t6", phase: "Festival: 03:00 PM", title: "Community Keynote & Sustainability Awards", time: "03:00 PM", status: "upcoming", description: "Recognizing local conservation pioneers and neighborhood garden leaders." },
      { id: "t7", phase: "Festival: 06:00 PM", title: "Headliner Band & Lantern Send-Off", time: "06:00 PM", status: "upcoming", description: "High-energy roots ensemble, community group photo, and compostable clean-up sweep." }
    ],
    vendors: [
      { id: "v1", category: "Permits", name: "Meadowbrook City Parks Dept", contact: "permits@meadowbrookparks.gov", cost: 3800, status: "Approved", priority: "Critical", notes: "Includes public restroom access and event recycling pickup." },
      { id: "v2", category: "Audio/Stage", name: "GreenPower Audio Solutions", contact: "info@greenpowersound.com", cost: 4200, status: "Booked", priority: "Critical", notes: "100% solar trailer stage with silent power backup." },
      { id: "v3", category: "Rentals", name: "Valley Event Rentals (Tents/Tables)", contact: "sales@valleyrentals.co", cost: 2800, status: "Booked", priority: "High", notes: "35 pop-up canopies, 60 folding tables, 150 chairs." },
      { id: "v4", category: "Waste Mgt", name: "ZeroWaste Volunteers Collective", contact: "team@zerowastecollective.org", cost: 1900, status: "Active", priority: "Medium", notes: "Providing 8 tripartite stations (Compost, Recycle, Landfill) + signage." }
    ],
    creativeIdeas: [
      { id: "c1", category: "Community Art", title: "Community Living Mural", description: "A 20-foot canvas where neighborhood attendees paint native botanical motifs guided by a local street artist." },
      { id: "c2", category: "Hands-on Workshop", title: "Seed-Bomb DIY Bar for Urban Pollinators", description: "Interactive booth for kids and families rolling clay, compost, and native wildflower seeds to plant around town." },
      { id: "c3", category: "Culinary Attraction", title: "Ugly Veggie Iron Chef Showcase", description: "Friendly culinary demo showing home cooks how to prepare five-star meals using cosmetically flawed farm surplus." },
      { id: "c4", category: "Zero-Waste Feature", title: "BYO Mug & Free Hydration Arcade", description: "Discounted artisanal iced tea and sparkling spring water refills for anyone bringing a reusable vessel." }
    ]
  }
};
