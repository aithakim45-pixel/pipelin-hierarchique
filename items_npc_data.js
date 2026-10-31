// Known Hypixel SkyBlock NPC vendor sell prices for Bazaar commodities
// Used to identify risk-free NPC Flips (where Instant Buy price on Bazaar is lower than NPC sell value)
const NPC_PRICES = {
    // Mining
    "COBBLESTONE": 1,
    "ENCHANTED_COBBLESTONE": 160,
    "COAL": 2,
    "ENCHANTED_COAL": 320,
    "ENCHANTED_COAL_BLOCK": 51200,
    "IRON_INGOT": 3,
    "ENCHANTED_IRON": 480,
    "ENCHANTED_IRON_BLOCK": 76800,
    "GOLD_INGOT": 4,
    "ENCHANTED_GOLD": 640,
    "ENCHANTED_GOLD_BLOCK": 102400,
    "DIAMOND": 8,
    "ENCHANTED_DIAMOND": 1280,
    "ENCHANTED_DIAMOND_BLOCK": 204800,
    "LAPIS_LAZULI": 1,
    "ENCHANTED_LAPIS_LAZULI": 160,
    "ENCHANTED_LAPIS_LAZULI_BLOCK": 25600,
    "REDSTONE": 1,
    "ENCHANTED_REDSTONE": 160,
    "ENCHANTED_REDSTONE_BLOCK": 25600,
    "EMERALD": 6,
    "ENCHANTED_EMERALD": 960,
    "ENCHANTED_EMERALD_BLOCK": 153600,
    "QUARTZ": 4,
    "ENCHANTED_QUARTZ": 640,
    "ENCHANTED_QUARTZ_BLOCK": 102400,
    "OBSIDIAN": 12,
    "ENCHANTED_OBSIDIAN": 1920,
    "GLOWSTONE_DUST": 2,
    "ENCHANTED_GLOWSTONE_DUST": 320,
    "ENCHANTED_GLOWSTONE": 61440,
    "GRAVEL": 3,
    "FLINT": 4,
    "ENCHANTED_FLINT": 640,
    "ICE": 0.5,
    "PACKED_ICE": 4.5,
    "ENCHANTED_ICE": 720,
    "ENCHANTED_PACKED_ICE": 115200,
    "NETHERRACK": 1,
    "SAND": 2,
    "ENCHANTED_SAND": 320,
    "RED_SAND": 3,
    "ENCHANTED_RED_SAND": 480,
    "MYCELIUM": 3,
    "ENCHANTED_MYCELIUM": 480,
    "HARD_STONE": 1,
    "ENCHANTED_HARD_STONE": 576,
    "CONCENTRATED_STONE": 331776,
    "MITHRIL_ORE": 5,
    "ENCHANTED_MITHRIL": 800,
    "REFINED_MITHRIL": 128000,
    "TITANIUM_ORE": 10,
    "ENCHANTED_TITANIUM": 1600,
    "REFINED_TITANIUM": 256000,

    // Farming
    "WHEAT": 1,
    "HAY_BLOCK": 9,
    "ENCHANTED_BREAD": 60,
    "ENCHANTED_HAY_BLOCK": 1296,
    "SEEDS": 0.5,
    "ENCHANTED_SEEDS": 80,
    "CARROT_ITEM": 1,
    "ENCHANTED_CARROT": 160,
    "ENCHANTED_GOLDEN_CARROT": 20480,
    "POTATO_ITEM": 1,
    "ENCHANTED_POTATO": 160,
    "ENCHANTED_BAKED_POTATO": 25600,
    "PUMPKIN": 4,
    "ENCHANTED_PUMPKIN": 640,
    "POLISHED_PUMPKIN": 102400,
    "MELON": 0.5,
    "ENCHANTED_MELON": 80,
    "ENCHANTED_MELON_BLOCK": 12800,
    "SUGAR_CANE": 2,
    "ENCHANTED_SUGAR": 320,
    "ENCHANTED_PAPER": 384,
    "ENCHANTED_SUGAR_CANE": 51200,
    "CACTUS": 1,
    "ENCHANTED_CACTUS_GREEN": 160,
    "ENCHANTED_CACTUS": 25600,
    "INK_SACK:3": 1, // Cocoa Beans
    "ENCHANTED_COCOA": 160,
    "MUSHROOM_COLLECTION": 4,
    "RED_MUSHROOM": 4,
    "BROWN_MUSHROOM": 4,
    "ENCHANTED_RED_MUSHROOM": 640,
    "ENCHANTED_BROWN_MUSHROOM": 640,
    "ENCHANTED_HUGE_MUSHROOM_1": 36864,
    "ENCHANTED_HUGE_MUSHROOM_2": 36864,
    "NETHER_STALK": 3,
    "ENCHANTED_NETHER_STALK": 480,
    "MUTANT_NETHER_STALK": 76800,

    // Foraging
    "LOG": 2,
    "ENCHANTED_OAK_LOG": 320,
    "LOG:1": 2,
    "ENCHANTED_SPRUCE_LOG": 320,
    "LOG:2": 2,
    "ENCHANTED_BIRCH_LOG": 320,
    "LOG:3": 2,
    "ENCHANTED_JUNGLE_LOG": 320,
    "LOG_2": 2,
    "ENCHANTED_ACACIA_LOG": 320,
    "LOG_2:1": 2,
    "ENCHANTED_DARK_OAK_LOG": 320,

    // Combat & Mobs
    "ROTTEN_FLESH": 2,
    "ENCHANTED_ROTTEN_FLESH": 320,
    "BONE": 2,
    "ENCHANTED_BONE": 320,
    "ENCHANTED_BONE_BLOCK": 51200,
    "STRING": 3,
    "ENCHANTED_STRING": 480,
    "SPIDER_EYE": 3,
    "ENCHANTED_SPIDER_EYE": 480,
    "ENCHANTED_FERMENTED_SPIDER_EYE": 480,
    "GUNPOWDER": 4,
    "ENCHANTED_GUNPOWDER": 640,
    "ENCHANTED_FIREWORK_ROCKET": 40960,
    "ENDER_PEARL": 10,
    "ENCHANTED_ENDER_PEARL": 200,
    "ENCHANTED_EYE_OF_ENDER": 3200,
    "SLIME_BALL": 5,
    "ENCHANTED_SLIME_BALL": 800,
    "ENCHANTED_SLIME_BLOCK": 128000,
    "MAGMA_CREAM": 8,
    "ENCHANTED_MAGMA_CREAM": 1280,
    "GHAST_TEAR": 16,
    "ENCHANTED_GHAST_TEAR": 800,
    "BLAZE_ROD": 9,
    "ENCHANTED_BLAZE_ROD": 144000,

    // Fishing
    "RAW_FISH": 6,
    "ENCHANTED_RAW_FISH": 960,
    "RAW_FISH:1": 10,
    "ENCHANTED_RAW_SALMON": 1600,
    "RAW_FISH:2": 15,
    "RAW_FISH:3": 20,
    "PRISMARINE_SHARD": 5,
    "ENCHANTED_PRISMARINE_SHARD": 800,
    "PRISMARINE_CRYSTALS": 5,
    "ENCHANTED_PRISMARINE_CRYSTALS": 800,
    "SPONGE": 50,
    "ENCHANTED_SPONGE": 2000,
    "ENCHANTED_WET_SPONGE": 80000,
    "WATER_LILY": 10,
    "ENCHANTED_WATER_LILY": 1600,
    "CLAY_BALL": 3,
    "ENCHANTED_CLAY_BALL": 480
};

// Crafting Recipe conversions for Bazaar Craft Flipping
// Maps output product ID to required input items { inputId: count }
const CRAFT_RECIPES = [
    {
        output: "ENCHANTED_DIAMOND_BLOCK",
        name: "Enchanted Diamond Block",
        inputs: [{ id: "ENCHANTED_DIAMOND", count: 160 }]
    },
    {
        output: "ENCHANTED_IRON_BLOCK",
        name: "Enchanted Iron Block",
        inputs: [{ id: "ENCHANTED_IRON", count: 160 }]
    },
    {
        output: "ENCHANTED_GOLD_BLOCK",
        name: "Enchanted Gold Block",
        inputs: [{ id: "ENCHANTED_GOLD", count: 160 }]
    },
    {
        output: "ENCHANTED_EMERALD_BLOCK",
        name: "Enchanted Emerald Block",
        inputs: [{ id: "ENCHANTED_EMERALD", count: 160 }]
    },
    {
        output: "ENCHANTED_LAPIS_LAZULI_BLOCK",
        name: "Enchanted Lapis Block",
        inputs: [{ id: "ENCHANTED_LAPIS_LAZULI", count: 160 }]
    },
    {
        output: "ENCHANTED_REDSTONE_BLOCK",
        name: "Enchanted Redstone Block",
        inputs: [{ id: "ENCHANTED_REDSTONE", count: 160 }]
    },
    {
        output: "ENCHANTED_COAL_BLOCK",
        name: "Enchanted Coal Block",
        inputs: [{ id: "ENCHANTED_COAL", count: 160 }]
    },
    {
        output: "ENCHANTED_SLIME_BLOCK",
        name: "Enchanted Slime Block",
        inputs: [{ id: "ENCHANTED_SLIME_BALL", count: 160 }]
    },
    {
        output: "ENCHANTED_PACKED_ICE",
        name: "Enchanted Packed Ice",
        inputs: [{ id: "ENCHANTED_ICE", count: 160 }]
    },
    {
        output: "ENCHANTED_SUGAR_CANE",
        name: "Enchanted Sugar Cane",
        inputs: [{ id: "ENCHANTED_SUGAR", count: 160 }]
    },
    {
        output: "ENCHANTED_BAKED_POTATO",
        name: "Enchanted Baked Potato",
        inputs: [{ id: "ENCHANTED_POTATO", count: 160 }]
    },
    {
        output: "POLISHED_PUMPKIN",
        name: "Polished Pumpkin",
        inputs: [{ id: "ENCHANTED_PUMPKIN", count: 160 }]
    },
    {
        output: "ENCHANTED_GOLDEN_CARROT",
        name: "Enchanted Golden Carrot",
        inputs: [{ id: "ENCHANTED_CARROT", count: 128 }, { id: "ENCHANTED_GOLD", count: 3 }]
    },
    {
        output: "HOT_POTATO_BOOK",
        name: "Hot Potato Book",
        inputs: [{ id: "ENCHANTED_BAKED_POTATO", count: 1 }, { id: "ENCHANTED_PAPER", count: 3 }]
    },
    {
        output: "FUMING_POTATO_BOOK",
        name: "Fuming Potato Book",
        inputs: [{ id: "HOT_POTATO_BOOK", count: 1 }] // + slayers / special
    },
    {
        output: "SUPER_COMPACTOR_3000",
        name: "Super Compactor 3000",
        inputs: [{ id: "ENCHANTED_COBBLESTONE", count: 448 }, { id: "ENCHANTED_REDSTONE_BLOCK", count: 1 }]
    }
];
