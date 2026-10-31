// Hypixel SkyBlock Dwarven Mines & Crystal Hollows Forge Recipes Database
// Durations in minutes (base time without Quick Forge reduction)

const FORGE_RECIPES = [
    // --- Refined Materials ---
    {
        id: "REFINED_DIAMOND",
        name: "Refined Diamond",
        category: "Refined Materials",
        durationMinutes: 480, // 8h
        hotm: 2,
        inputs: [
            { id: "ENCHANTED_DIAMOND_BLOCK", count: 2 }
        ]
    },
    {
        id: "REFINED_MITHRIL",
        name: "Refined Mithril",
        category: "Refined Materials",
        durationMinutes: 360, // 6h
        hotm: 2,
        inputs: [
            { id: "ENCHANTED_MITHRIL", count: 160 }
        ]
    },
    {
        id: "REFINED_TITANIUM",
        name: "Refined Titanium",
        category: "Refined Materials",
        durationMinutes: 1440, // 24h
        hotm: 3,
        inputs: [
            { id: "ENCHANTED_TITANIUM", count: 16 }
        ]
    },
    {
        id: "REFINED_TUNGSTEN",
        name: "Refined Tungsten",
        category: "Refined Materials",
        durationMinutes: 360, // 6h
        hotm: 5,
        inputs: [
            { id: "ENCHANTED_TUNGSTEN", count: 160 }
        ]
    },
    {
        id: "REFINED_UMBER",
        name: "Refined Umber",
        category: "Refined Materials",
        durationMinutes: 360, // 6h
        hotm: 5,
        inputs: [
            { id: "ENCHANTED_UMBER", count: 160 }
        ]
    },
    {
        id: "GOLDEN_PLATE",
        name: "Golden Plate",
        category: "Refined Materials",
        durationMinutes: 360, // 6h
        hotm: 4,
        inputs: [
            { id: "ENCHANTED_GOLD_BLOCK", count: 2 },
            { id: "GLACITE_JEWEL", count: 5 },
            { id: "ENCHANTED_REDSTONE_BLOCK", count: 1 }
        ]
    },
    {
        id: "MITHRIL_PLATE",
        name: "Mithril Plate",
        category: "Refined Materials",
        durationMinutes: 1080, // 18h
        hotm: 5,
        inputs: [
            { id: "GOLDEN_PLATE", count: 1 },
            { id: "REFINED_MITHRIL", count: 5 },
            { id: "REFINED_TITANIUM", count: 1 },
            { id: "ENCHANTED_IRON_BLOCK", count: 1 }
        ]
    },
    {
        id: "GEMSTONE_MIXTURE",
        name: "Gemstone Mixture",
        category: "Refined Materials",
        durationMinutes: 240, // 4h
        hotm: 4,
        inputs: [
            { id: "FINE_AMBER_GEM", count: 4 },
            { id: "FINE_AMETHYST_GEM", count: 4 },
            { id: "FINE_JADE_GEM", count: 4 },
            { id: "FINE_SAPPHIRE_GEM", count: 4 },
            { id: "SLUDGE_JUICE", count: 320 }
        ]
    },
    {
        id: "GLACITE_AMALGAMATION",
        name: "Glacite Amalgamation",
        category: "Refined Materials",
        durationMinutes: 240, // 4h
        hotm: 7,
        inputs: [
            { id: "REFINED_TUNGSTEN", count: 1 },
            { id: "REFINED_UMBER", count: 1 },
            { id: "GLACITE_JEWEL", count: 1 }
        ]
    },

    // --- Components, Engines & Fuel Tanks ---
    {
        id: "BEJEWELED_HANDLE",
        name: "Bejeweled Handle",
        category: "Tools & Components",
        durationMinutes: 0.5, // 30 sec
        hotm: 2,
        inputs: [
            { id: "GLACITE_JEWEL", count: 3 }
        ]
    },
    {
        id: "DRILL_ENGINE",
        name: "Drill Engine",
        category: "Drill Upgrades",
        durationMinutes: 1440, // 24h
        hotm: 3,
        inputs: [
            { id: "ENCHANTED_IRON_BLOCK", count: 1 },
            { id: "ENCHANTED_REDSTONE_BLOCK", count: 10 },
            { id: "GOLDEN_PLATE", count: 1 },
            { id: "TREASURITE", count: 10 }
        ]
    },
    {
        id: "RUBY_POLISHED_DRILL_ENGINE",
        name: "Ruby-polished Drill Engine",
        category: "Drill Upgrades",
        durationMinutes: 1200, // 20h
        hotm: 6,
        inputs: [
            { id: "DRILL_ENGINE", count: 1 },
            { id: "FINE_RUBY_GEM", count: 10 },
            { id: "MITHRIL_PLATE", count: 2 }
        ]
    },
    {
        id: "SAPPHIRE_POLISHED_DRILL_ENGINE",
        name: "Sapphire-polished Drill Engine",
        category: "Drill Upgrades",
        durationMinutes: 1800, // 30h
        hotm: 7,
        inputs: [
            { id: "RUBY_POLISHED_DRILL_ENGINE", count: 1 },
            { id: "FLAWLESS_SAPPHIRE_GEM", count: 10 },
            { id: "MITHRIL_PLATE", count: 5 }
        ]
    },
    {
        id: "AMBER_POLISHED_DRILL_ENGINE",
        name: "Amber-polished Drill Engine",
        category: "Drill Upgrades",
        durationMinutes: 1800, // 30h
        hotm: 7,
        inputs: [
            { id: "RUBY_POLISHED_DRILL_ENGINE", count: 1 },
            { id: "FLAWLESS_AMBER_GEM", count: 10 },
            { id: "MITHRIL_PLATE", count: 5 }
        ]
    },
    {
        id: "MITHRIL_FUEL_TANK",
        name: "Mithril-Infused Fuel Tank",
        category: "Drill Upgrades",
        durationMinutes: 240, // 4h
        hotm: 3,
        inputs: [
            { id: "REFINED_MITHRIL", count: 2 }
        ]
    },
    {
        id: "TITANIUM_FUEL_TANK",
        name: "Titanium-Infused Fuel Tank",
        category: "Drill Upgrades",
        durationMinutes: 840, // 14h
        hotm: 4,
        inputs: [
            { id: "MITHRIL_FUEL_TANK", count: 1 },
            { id: "REFINED_TITANIUM", count: 4 }
        ]
    },
    {
        id: "GEMSTONE_FUEL_TANK",
        name: "Gemstone Fuel Tank",
        category: "Drill Upgrades",
        durationMinutes: 1440, // 24h
        hotm: 5,
        inputs: [
            { id: "TITANIUM_FUEL_TANK", count: 1 },
            { id: "GEMSTONE_MIXTURE", count: 1 }
        ]
    },
    {
        id: "PERFECTLY_CUT_FUEL_TANK",
        name: "Perfect Gemstone Fuel Tank",
        category: "Drill Upgrades",
        durationMinutes: 1800, // 30h
        hotm: 7,
        inputs: [
            { id: "GEMSTONE_FUEL_TANK", count: 1 },
            { id: "FLAWLESS_RUBY_GEM", count: 2 },
            { id: "MITHRIL_PLATE", count: 5 }
        ]
    },

    // --- Armor of Divan & Chambers ---
    {
        id: "DIVAN_HELMET",
        name: "Helmet of Divan",
        category: "Armor of Divan",
        durationMinutes: 1440, // 24h
        hotm: 6,
        inputs: [
            { id: "DIVAN_FRAGMENT", count: 5 },
            { id: "GEMSTONE_MIXTURE", count: 1 },
            { id: "FLAWLESS_RUBY_GEM", count: 1 }
        ]
    },
    {
        id: "DIVAN_CHESTPLATE",
        name: "Chestplate of Divan",
        category: "Armor of Divan",
        durationMinutes: 1440, // 24h
        hotm: 6,
        inputs: [
            { id: "DIVAN_FRAGMENT", count: 8 },
            { id: "GEMSTONE_MIXTURE", count: 1 },
            { id: "FLAWLESS_RUBY_GEM", count: 1 }
        ]
    },
    {
        id: "DIVAN_LEGGINGS",
        name: "Leggings of Divan",
        category: "Armor of Divan",
        durationMinutes: 1440, // 24h
        hotm: 6,
        inputs: [
            { id: "DIVAN_FRAGMENT", count: 7 },
            { id: "GEMSTONE_MIXTURE", count: 1 },
            { id: "FLAWLESS_RUBY_GEM", count: 1 }
        ]
    },
    {
        id: "DIVAN_BOOTS",
        name: "Boots of Divan",
        category: "Armor of Divan",
        durationMinutes: 1440, // 24h
        hotm: 6,
        inputs: [
            { id: "DIVAN_FRAGMENT", count: 4 },
            { id: "GEMSTONE_MIXTURE", count: 1 },
            { id: "FLAWLESS_RUBY_GEM", count: 1 }
        ]
    },
    {
        id: "GEMSTONE_CHAMBER",
        name: "Gemstone Chamber",
        category: "Armor of Divan",
        durationMinutes: 240, // 4h
        hotm: 6,
        inputs: [
            { id: "DIVAN_FRAGMENT", count: 1 },
            { id: "GEMSTONE_MIXTURE", count: 1 },
            { id: "WORM_MEMBRANE", count: 100 }
        ]
    },

    // --- Mining Drills ---
    {
        id: "MITHRIL_DRILL_1",
        name: "Mithril Drill SX-R226",
        category: "Mining Drills",
        durationMinutes: 240, // 4h
        hotm: 3,
        inputs: [
            { id: "REFINED_MITHRIL", count: 3 },
            { id: "BEJEWELED_HANDLE", count: 1 },
            { id: "DRILL_ENGINE", count: 1 }
        ]
    },
    {
        id: "RUBY_DRILL_1",
        name: "Ruby Drill TX-15",
        category: "Mining Drills",
        durationMinutes: 720, // 12h
        hotm: 4,
        inputs: [
            { id: "DRILL_ENGINE", count: 1 },
            { id: "MITHRIL_FUEL_TANK", count: 1 },
            { id: "FINE_RUBY_GEM", count: 10 }
        ]
    },
    {
        id: "GEMSTONE_DRILL_1",
        name: "Gemstone Drill LT-522",
        category: "Mining Drills",
        durationMinutes: 1440, // 24h
        hotm: 5,
        inputs: [
            { id: "RUBY_DRILL_1", count: 1 },
            { id: "GEMSTONE_MIXTURE", count: 1 },
            { id: "REFINED_TITANIUM", count: 5 }
        ]
    },
    {
        id: "TITANIUM_DRILL_1",
        name: "Titanium Drill DR-X355",
        category: "Mining Drills",
        durationMinutes: 1440, // 24h
        hotm: 5,
        inputs: [
            { id: "MITHRIL_DRILL_1", count: 1 },
            { id: "REFINED_TITANIUM", count: 6 },
            { id: "REFINED_MITHRIL", count: 5 },
            { id: "MITHRIL_PLATE", count: 1 }
        ]
    },

    // --- Keys & Utility ---
    {
        id: "TUNGSTEN_KEY",
        name: "Tungsten Key",
        category: "Keys & Utilities",
        durationMinutes: 0.5, // 30s
        hotm: 5,
        inputs: [
            { id: "ENCHANTED_TUNGSTEN", count: 192 },
            { id: "BEJEWELED_HANDLE", count: 1 }
        ]
    },
    {
        id: "UMBER_KEY",
        name: "Umber Key",
        category: "Keys & Utilities",
        durationMinutes: 0.5, // 30s
        hotm: 5,
        inputs: [
            { id: "ENCHANTED_UMBER", count: 192 },
            { id: "BEJEWELED_HANDLE", count: 1 }
        ]
    },
    {
        id: "SKELETON_KEY",
        name: "Skeleton Key",
        category: "Keys & Utilities",
        durationMinutes: 60, // 1h
        hotm: 7,
        inputs: [
            { id: "TUNGSTEN_KEY", count: 1 },
            { id: "UMBER_KEY", count: 1 },
            { id: "GLACITE_AMALGAMATION", count: 10 }
        ]
    },
    {
        id: "POWER_CRYSTAL",
        name: "Power Crystal",
        category: "Keys & Utilities",
        durationMinutes: 120, // 2h
        hotm: 4,
        inputs: [
            { id: "TREASURITE", count: 1 },
            { id: "ENCHANTED_REDSTONE", count: 10 }
        ]
    },
    {
        id: "BEJEWELED_COLLAR",
        name: "Bejeweled Collar",
        category: "Keys & Utilities",
        durationMinutes: 0.5, // 30s
        hotm: 2,
        inputs: [
            { id: "BEJEWELED_HANDLE", count: 2 },
            { id: "REFINED_MITHRIL", count: 1 }
        ]
    },
    {
        id: "BLUE_CHEESE_GOBLIN_OMELETTE",
        name: "Blue Cheese Goblin Omelette",
        category: "Keys & Utilities",
        durationMinutes: 1200, // 20h
        hotm: 5,
        inputs: [
            { id: "GOBLIN_OMELETTE", count: 1 },
            { id: "BLUE_EGG", count: 1 }
        ]
    },
    {
        id: "SUNNY_SIDE_GOBLIN_OMELETTE",
        name: "Sunny Side Goblin Omelette",
        category: "Keys & Utilities",
        durationMinutes: 1200, // 20h
        hotm: 5,
        inputs: [
            { id: "GOBLIN_OMELETTE", count: 1 },
            { id: "YELLOW_GOBLIN_EGG", count: 99 }
        ]
    },
    {
        id: "SPICY_GOBLIN_OMELETTE",
        name: "Spicy Goblin Omelette",
        category: "Keys & Utilities",
        durationMinutes: 1200, // 20h
        hotm: 5,
        inputs: [
            { id: "GOBLIN_OMELETTE", count: 1 },
            { id: "RED_GOBLIN_EGG", count: 99 }
        ]
    },

    // --- Perfect Gemstones ---
    {
        id: "PERFECT_RUBY_GEM",
        name: "Perfect Ruby Gemstone",
        category: "Perfect Gemstones",
        durationMinutes: 1200, // 20h
        hotm: 5,
        inputs: [
            { id: "FLAWLESS_RUBY_GEM", count: 5 }
        ]
    },
    {
        id: "PERFECT_JASPER_GEM",
        name: "Perfect Jasper Gemstone",
        category: "Perfect Gemstones",
        durationMinutes: 1200, // 20h
        hotm: 5,
        inputs: [
            { id: "FLAWLESS_JASPER_GEM", count: 5 }
        ]
    },
    {
        id: "PERFECT_SAPPHIRE_GEM",
        name: "Perfect Sapphire Gemstone",
        category: "Perfect Gemstones",
        durationMinutes: 1200, // 20h
        hotm: 5,
        inputs: [
            { id: "FLAWLESS_SAPPHIRE_GEM", count: 5 }
        ]
    },
    {
        id: "PERFECT_JADE_GEM",
        name: "Perfect Jade Gemstone",
        category: "Perfect Gemstones",
        durationMinutes: 1200, // 20h
        hotm: 5,
        inputs: [
            { id: "FLAWLESS_JADE_GEM", count: 5 }
        ]
    },
    {
        id: "PERFECT_AMBER_GEM",
        name: "Perfect Amber Gemstone",
        category: "Perfect Gemstones",
        durationMinutes: 1200, // 20h
        hotm: 5,
        inputs: [
            { id: "FLAWLESS_AMBER_GEM", count: 5 }
        ]
    },
    {
        id: "PERFECT_TOPAZ_GEM",
        name: "Perfect Topaz Gemstone",
        category: "Perfect Gemstones",
        durationMinutes: 1200, // 20h
        hotm: 5,
        inputs: [
            { id: "FLAWLESS_TOPAZ_GEM", count: 5 }
        ]
    },
    {
        id: "PERFECT_AMETHYST_GEM",
        name: "Perfect Amethyst Gemstone",
        category: "Perfect Gemstones",
        durationMinutes: 1200, // 20h
        hotm: 5,
        inputs: [
            { id: "FLAWLESS_AMETHYST_GEM", count: 5 }
        ]
    },
    {
        id: "PERFECT_OPAL_GEM",
        name: "Perfect Opal Gemstone",
        category: "Perfect Gemstones",
        durationMinutes: 1200, // 20h
        hotm: 5,
        inputs: [
            { id: "FLAWLESS_OPAL_GEM", count: 5 }
        ]
    }
];
