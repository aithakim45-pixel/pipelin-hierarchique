// SkyFlip - Hypixel SkyBlock Realistic Market Intelligence Engine
// Powered by open public Hypixel data & community endpoints

const STATE = {
    activeTab: 'bazaar', // 'bazaar', 'npc', 'craft', 'forge', 'simulator'
    category: 'ALL',     // 'ALL', 'MINING', 'FARMING', 'COMBAT', 'WOODS_FISH', 'ODDITIES'
    forgeCategory: 'ALL',// 'ALL', 'Refined Materials', 'Drill Upgrades', 'Armor of Divan', 'Mining Drills', 'Keys & Utilities', 'Perfect Gemstones'
    rawData: null,
    lowestBinData: {},   // Auction House Lowest BIN prices from Moulberry
    items: [],
    npcFlips: [],
    craftFlips: [],
    forgeFlips: [],
    loading: false,
    lowestBinLoading: false,
    lastUpdated: null,
    taxRate: 0.01125,    // Default Skyblock Bazaar tax: 1.125%
    ahFeeRate: 0.02,     // Default Auction House fee: 2%
    quickForgeLevel: 20, // Quick Forge Perk level (0 to 20; 20 = 30% reduction)
    quickForgeReduction: 0.30,
    forgeCostMode: 'order', // 'order' (Buy Order) or 'instant' (Instant Buy)
    budget: Infinity,
    minProfit: 500,
    minRoi: 1.0,
    minVolume: 20000,
    safeFlipsOnly: true, // Filter out manipulation traps & dead items
    searchQuery: '',
    sortBy: 'score',     // 'score', 'realisticHourly', 'profit', 'roi', 'volume', 'cost', 'speed', 'forgeHourly'
    sortOrder: 'desc',
    autoRefreshInterval: null,
    refreshSecondsLeft: 30,
    selectedItemForSim: null
};

// Public CORS Proxies & Local Bridge
const PROXIES = [
    (url) => window.location.protocol.startsWith('http') ? `${window.location.origin}/api/bazaar` : url,
    (url) => url,
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
];

const LOWEST_BIN_PROXIES = [
    (url) => window.location.protocol.startsWith('http') ? `${window.location.origin}/api/lowestbin` : url,
    (url) => url,
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
];

const HYPIXEL_BAZAAR_URL = 'https://api.hypixel.net/v2/skyblock/bazaar';
const MOULBERRY_LOWESTBIN_URL = 'https://moulberry.codes/lowestbin.json';

// Format coins neatly
function formatCoins(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return '0';
    const abs = Math.abs(amount);
    if (abs >= 1000000000) return (amount / 1000000000).toFixed(2) + 'B';
    if (abs >= 1000000) return (amount / 1000000).toFixed(2) + 'M';
    if (abs >= 10000) return (amount / 1000).toFixed(1) + 'k';
    return amount.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function formatNumber(num) {
    if (!num || isNaN(num)) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
}

function formatDuration(minutes) {
    if (minutes < 1) return `${Math.round(minutes * 60)}s`;
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs === 0) return `${mins}m`;
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
}

function cleanItemName(id) {
    return id.replace(/_/g, ' ')
             .replace(/:/g, ' ')
             .toLowerCase()
             .replace(/\b\w/g, c => c.toUpperCase());
}

// Identify SkyBlock Item Category
function getItemCategory(id) {
    const s = id.toUpperCase();
    if (s.includes('DIAMOND') || s.includes('IRON') || s.includes('GOLD') || s.includes('COAL') ||
        s.includes('LAPIS') || s.includes('REDSTONE') || s.includes('EMERALD') || s.includes('QUARTZ') ||
        s.includes('OBSIDIAN') || s.includes('GLOWSTONE') || s.includes('GRAVEL') || s.includes('FLINT') ||
        s.includes('ICE') || s.includes('MITHRIL') || s.includes('TITANIUM') || s.includes('GEMSTONE') ||
        s.includes('HARD_STONE') || s.includes('SAND') || s.includes('COBBLESTONE')) {
        return 'MINING';
    }
    if (s.includes('WHEAT') || s.includes('CARROT') || s.includes('POTATO') || s.includes('PUMPKIN') ||
        s.includes('MELON') || s.includes('SUGAR') || s.includes('CACTUS') || s.includes('COCOA') ||
        s.includes('MUSHROOM') || s.includes('NETHER_STALK') || s.includes('LEATHER') || s.includes('FEATHER') ||
        s.includes('MUTTON') || s.includes('PORK') || s.includes('BEEF') || s.includes('CHICKEN') || s.includes('EGG')) {
        return 'FARMING';
    }
    if (s.includes('ROTTEN_FLESH') || s.includes('BONE') || s.includes('STRING') || s.includes('SPIDER_EYE') ||
        s.includes('GUNPOWDER') || s.includes('ENDER_PEARL') || s.includes('GHAST_TEAR') || s.includes('SLIME') ||
        s.includes('MAGMA_CREAM') || s.includes('BLAZE') || s.includes('REVENANT') || s.includes('TARANTULA') ||
        s.includes('WOLF_TOOTH') || s.includes('NULL_') || s.includes('DERELICT') || s.includes('FRAGMENT')) {
        return 'COMBAT';
    }
    if (s.includes('LOG') || s.includes('WOOD') || s.includes('FISH') || s.includes('SALMON') ||
        s.includes('PRISMARINE') || s.includes('SPONGE') || s.includes('WATER_LILY') || s.includes('CLAY')) {
        return 'WOODS_FISH';
    }
    return 'ODDITIES';
}

// Fetch Bazaar Data
async function fetchBazaarData() {
    STATE.loading = true;
    updateStatusUI('Fetching live SkyBlock Bazaar & AH data...');

    let data = null;

    for (let i = 0; i < PROXIES.length; i++) {
        const proxyUrl = PROXIES[i](HYPIXEL_BAZAAR_URL);
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 7500);
            
            const response = await fetch(proxyUrl, {
                signal: controller.signal,
                headers: { 'Accept': 'application/json' }
            });
            clearTimeout(timeout);

            if (response.ok) {
                const json = await response.json();
                if (json && json.success && json.products) {
                    data = json;
                    break;
                }
            }
        } catch (err) {
            console.warn(`Bazaar fetch route ${i} failed, trying next...`, err.message);
        }
    }

    if (!data) {
        console.warn('Live Bazaar API unreachable; loading cached snapshot.');
        data = generateDemoMarketData();
        updateStatusUI('Using cached snapshot (Run start-server.ps1 for live stream)', true);
    } else {
        updateStatusUI(`Connected to Hypixel! Updated: ${new Date(data.lastUpdated).toLocaleTimeString()}`);
    }

    STATE.rawData = data;
    STATE.lastUpdated = data.lastUpdated || Date.now();
    STATE.loading = false;

    // Fetch AH lowest BIN data alongside Bazaar
    await fetchLowestBinData();
    processMarketData();
}

// Fetch Auction House Lowest BIN Data
async function fetchLowestBinData() {
    STATE.lowestBinLoading = true;
    let binData = null;

    for (let i = 0; i < LOWEST_BIN_PROXIES.length; i++) {
        const proxyUrl = LOWEST_BIN_PROXIES[i](MOULBERRY_LOWESTBIN_URL);
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 7000);
            
            const response = await fetch(proxyUrl, {
                signal: controller.signal,
                headers: { 'Accept': 'application/json' }
            });
            clearTimeout(timeout);

            if (response.ok) {
                const json = await response.json();
                if (json && typeof json === 'object') {
                    binData = json;
                    break;
                }
            }
        } catch (err) {
            console.warn(`Lowest BIN fetch route ${i} failed...`, err.message);
        }
    }

    if (!binData) {
        console.warn('AH lowest BIN unreachable; loading baseline AH values.');
        binData = generateDemoLowestBinData();
    }

    STATE.lowestBinData = binData;
    STATE.lowestBinLoading = false;
}

// Helper: Get item cost (from Bazaar or AH lowest BIN)
function getItemBuyCost(itemId, useOrder = true) {
    if (STATE.rawData && STATE.rawData.products && STATE.rawData.products[itemId]) {
        const qs = STATE.rawData.products[itemId].quick_status;
        if (qs) {
            const price = useOrder ? (qs.sellPrice || qs.buyPrice) : qs.buyPrice;
            if (price > 0) return { price, source: useOrder ? 'Bazaar Order' : 'Bazaar Insta' };
        }
    }
    // Check Auction House lowest BIN
    if (STATE.lowestBinData && STATE.lowestBinData[itemId]) {
        return { price: STATE.lowestBinData[itemId], source: 'AH Lowest BIN' };
    }
    return { price: 0, source: 'Unknown' };
}

// Helper: Get item sell value (highest of Bazaar sell offer or AH lowest BIN)
function getItemSellValue(itemId) {
    let bestNet = 0;
    let bestGross = 0;
    let bestSource = 'Unknown';

    // 1. Check Bazaar Sell Offer
    if (STATE.rawData && STATE.rawData.products && STATE.rawData.products[itemId]) {
        const qs = STATE.rawData.products[itemId].quick_status;
        if (qs && qs.buyPrice > 0) {
            const gross = qs.buyPrice;
            const net = gross * (1 - STATE.taxRate);
            if (net > bestNet) {
                bestNet = net;
                bestGross = gross;
                bestSource = 'Bazaar Offer';
            }
        }
    }

    // 2. Check Auction House Lowest BIN
    if (STATE.lowestBinData && STATE.lowestBinData[itemId]) {
        const gross = STATE.lowestBinData[itemId];
        const net = gross * (1 - STATE.ahFeeRate);
        if (net > bestNet) {
            bestNet = net;
            bestGross = gross;
            bestSource = 'AH Lowest BIN';
        }
    }

    return { grossPrice: bestGross, netPrice: bestNet, source: bestSource };
}

// Transform raw Bazaar & AH data into flips and Forge calculations
function processMarketData() {
    if (!STATE.rawData || !STATE.rawData.products) return;

    const products = STATE.rawData.products;
    const bazaarFlips = [];
    const npcFlips = [];

    for (const [id, product] of Object.entries(products)) {
        const qs = product.quick_status;
        if (!qs) continue;

        const buyOrderPrice = qs.sellPrice || 0;
        const sellOfferPrice = qs.buyPrice || 0;
        const buyMovingWeek = qs.buyMovingWeek || 0;
        const sellMovingWeek = qs.sellMovingWeek || 0;
        const totalVolume = buyMovingWeek + sellMovingWeek;
        const dailyVolume = Math.round(totalVolume / 7);

        const hourlyBuyFills = Math.round(sellMovingWeek / 168);
        const hourlySellFills = Math.round(buyMovingWeek / 168);
        const hourlyCycleVolume = Math.min(hourlyBuyFills, hourlySellFills);

        const activeBuyOrders = qs.buyOrders || 0;
        const activeSellOrders = qs.sellOrders || 0;
        const totalCompetition = activeBuyOrders + activeSellOrders;

        let isManipulated = false;
        let manipulationReason = '';

        if (product.sell_summary && product.sell_summary.length > 1) {
            const topBuy = product.sell_summary[0];
            const secondBuy = product.sell_summary[1];
            if (topBuy.amount <= 3 && secondBuy && (topBuy.pricePerUnit / secondBuy.pricePerUnit > 1.8)) {
                isManipulated = true;
                manipulationReason = 'Top buy order is only 1-3 items with inflated price';
            }
        }
        if (product.buy_summary && product.buy_summary.length > 1) {
            const topSell = product.buy_summary[0];
            const secondSell = product.buy_summary[1];
            if (topSell.amount <= 3 && secondSell && (secondSell.pricePerUnit / topSell.pricePerUnit > 1.8)) {
                isManipulated = true;
                manipulationReason = 'Top sell offer is only 1-3 items with deflated price';
            }
        }

        // 1. Realistic Bazaar Order Flipping Calculation
        if (buyOrderPrice > 0 && sellOfferPrice > buyOrderPrice) {
            const netSellPrice = sellOfferPrice * (1 - STATE.taxRate);
            const profitPerUnit = netSellPrice - buyOrderPrice;
            const roi = (profitPerUnit / buyOrderPrice) * 100;

            const competitionPenalty = 1 / (1 + (totalCompetition * 0.035));
            const marketShare = Math.min(0.12, Math.max(0.02, 0.08 * competitionPenalty));

            const realisticUnitsPerHour = Math.round(hourlyCycleVolume * marketShare);
            const realisticHourlyProfit = Math.round(realisticUnitsPerHour * profitPerUnit);

            const standardBatch = buyOrderPrice > 100000 ? 16 : (buyOrderPrice > 5000 ? 64 : 160);
            let fillTimeMinutes = Infinity;
            let fillTimeBadge = '🔴 > 1 hour';
            let speedBadgeColor = 'text-red-400 bg-red-500/10 border-red-500/20';

            if (hourlyCycleVolume > 0) {
                fillTimeMinutes = (standardBatch / Math.max(1, (hourlyCycleVolume * marketShare))) * 60;
                if (fillTimeMinutes <= 2) {
                    fillTimeBadge = '⚡ < 2 mins';
                    speedBadgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 font-bold';
                } else if (fillTimeMinutes <= 10) {
                    fillTimeBadge = '🟢 ~5 mins';
                    speedBadgeColor = 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20';
                } else if (fillTimeMinutes <= 30) {
                    fillTimeBadge = '🟡 ~15-30m';
                    speedBadgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                }
            }

            let score = 0;
            if (totalVolume >= 5000000) score += 40;
            else if (totalVolume >= 1000000) score += 32;
            else if (totalVolume >= 200000) score += 24;
            else if (totalVolume >= 50000) score += 15;
            else score += 5;

            if (realisticHourlyProfit >= 5000000) score += 25;
            else if (realisticHourlyProfit >= 2000000) score += 20;
            else if (realisticHourlyProfit >= 500000) score += 15;
            else if (realisticHourlyProfit >= 100000) score += 10;
            else score += 4;

            if (roi >= 20) score += 20;
            else if (roi >= 10) score += 16;
            else if (roi >= 5) score += 12;
            else if (roi >= 2) score += 7;
            else score += 2;

            if (totalCompetition <= 20) score += 15;
            else if (totalCompetition <= 50) score += 10;
            else if (totalCompetition <= 100) score += 6;
            else score += 2;

            if (isManipulated) score = Math.max(0, score - 50);

            let liquidity = 'High';
            let liquidityColor = 'text-emerald-400';
            if (totalVolume < 100000) {
                liquidity = 'Low';
                liquidityColor = 'text-red-400';
            } else if (totalVolume < 1000000) {
                liquidity = 'Medium';
                liquidityColor = 'text-yellow-400';
            }

            bazaarFlips.push({
                id,
                name: cleanItemName(id),
                category: getItemCategory(id),
                buyPrice: buyOrderPrice,
                sellPrice: sellOfferPrice,
                netSellPrice,
                profit: profitPerUnit,
                roi,
                realisticUnitsPerHour,
                realisticHourlyProfit,
                hourlyCycleVolume,
                fillTimeMinutes,
                fillTimeBadge,
                speedBadgeColor,
                score,
                isManipulated,
                manipulationReason,
                weeklyVolume: totalVolume,
                dailyVolume,
                buyOrders: activeBuyOrders,
                sellOrders: activeSellOrders,
                totalCompetition,
                liquidity,
                liquidityColor
            });
        }

        // 2. NPC Vendor Flips
        const npcPrice = NPC_PRICES[id];
        if (npcPrice && sellOfferPrice > 0) {
            const npcProfit = npcPrice - sellOfferPrice;
            if (npcProfit > 0) {
                const npcRoi = (npcProfit / sellOfferPrice) * 100;
                npcFlips.push({
                    id,
                    name: cleanItemName(id),
                    category: getItemCategory(id),
                    instantBuyPrice: sellOfferPrice,
                    npcPrice,
                    profit: npcProfit,
                    roi: npcRoi,
                    stockVolume: qs.buyVolume || 0,
                    weeklyVolume: totalVolume
                });
            }
        }
    }

    // 3. Bazaar Craft Flips
    const craftFlips = [];
    if (typeof CRAFT_RECIPES !== 'undefined') {
        for (const recipe of CRAFT_RECIPES) {
            const targetProd = products[recipe.output];
            if (!targetProd || !targetProd.quick_status) continue;

            let totalMaterialCostOrder = 0;
            let canCraft = true;

            for (const input of recipe.inputs) {
                const inProd = products[input.id];
                if (!inProd || !inProd.quick_status) {
                    canCraft = false;
                    break;
                }
                const inBuyOrder = inProd.quick_status.sellPrice || inProd.quick_status.buyPrice || 0;
                totalMaterialCostOrder += inBuyOrder * input.count;
            }

            if (!canCraft || totalMaterialCostOrder <= 0) continue;

            const targetSellOffer = targetProd.quick_status.buyPrice || 0;
            const targetNetSell = targetSellOffer * (1 - STATE.taxRate);
            const profitOrder = targetNetSell - totalMaterialCostOrder;
            const roiOrder = (profitOrder / totalMaterialCostOrder) * 100;

            if (profitOrder > 0) {
                const weeklyVolume = (targetProd.quick_status.buyMovingWeek || 0) + (targetProd.quick_status.sellMovingWeek || 0);
                craftFlips.push({
                    id: recipe.output,
                    name: recipe.name,
                    category: getItemCategory(recipe.output),
                    recipe,
                    materialCost: totalMaterialCostOrder,
                    targetSellOffer,
                    profit: profitOrder,
                    roi: roiOrder,
                    weeklyVolume
                });
            }
        }
    }

    // 4. FORGE RECIPES CALCULATION (Auction House + Bazaar Integration)
    const forgeFlips = [];
    if (typeof FORGE_RECIPES !== 'undefined') {
        const useOrder = STATE.forgeCostMode === 'order';

        for (const recipe of FORGE_RECIPES) {
            let totalCost = 0;
            const inputBreakdown = [];
            let canCalculate = true;

            for (const input of recipe.inputs) {
                const itemCostInfo = getItemBuyCost(input.id, useOrder);
                if (itemCostInfo.price <= 0) {
                    canCalculate = false;
                    break;
                }
                const itemTotalCost = itemCostInfo.price * input.count;
                totalCost += itemTotalCost;
                inputBreakdown.push({
                    id: input.id,
                    name: cleanItemName(input.id),
                    count: input.count,
                    unitPrice: itemCostInfo.price,
                    totalCost: itemTotalCost,
                    source: itemCostInfo.source
                });
            }

            if (!canCalculate || totalCost <= 0) continue;

            const sellInfo = getItemSellValue(recipe.id);
            if (sellInfo.netPrice <= 0) continue;

            const netProfit = sellInfo.netPrice - totalCost;
            const roi = (netProfit / totalCost) * 100;

            // Adjusted forge time factoring in Quick Forge perk level
            const adjustedDurationMinutes = recipe.durationMinutes * (1 - STATE.quickForgeReduction);
            const adjustedDurationHours = Math.max(0.008, adjustedDurationMinutes / 60);

            // Profit metrics
            const profitPerHour = netProfit / adjustedDurationHours;
            const profitPerDaySlot = profitPerHour * 24;
            const fiveSlotsDailyPotential = profitPerDaySlot * 5;

            forgeFlips.push({
                id: recipe.id,
                name: recipe.name,
                category: recipe.category,
                hotm: recipe.hotm,
                baseDurationMinutes: recipe.durationMinutes,
                adjustedDurationMinutes,
                adjustedDurationHours,
                totalCost,
                grossSellPrice: sellInfo.grossPrice,
                netSellPrice: sellInfo.netPrice,
                sellSource: sellInfo.source,
                netProfit,
                roi,
                profitPerHour,
                profitPerDaySlot,
                fiveSlotsDailyPotential,
                inputs: inputBreakdown
            });
        }
    }

    STATE.items = bazaarFlips;
    STATE.npcFlips = npcFlips;
    STATE.craftFlips = craftFlips;
    STATE.forgeFlips = forgeFlips;

    render();
}

// Render active view based on state
function render() {
    renderStatsSummary();

    if (STATE.activeTab === 'bazaar') {
        renderBazaarTable();
    } else if (STATE.activeTab === 'forge') {
        renderForgeTable();
    } else if (STATE.activeTab === 'npc') {
        renderNpcTable();
    } else if (STATE.activeTab === 'craft') {
        renderCraftTable();
    } else if (STATE.activeTab === 'simulator') {
        renderSimulator();
    }
}

function renderStatsSummary() {
    const totalFlips = STATE.items.length;
    const topHourly = [...STATE.items].sort((a,b) => b.realisticHourlyProfit - a.realisticHourlyProfit)[0];
    const topRoi = [...STATE.items].filter(i => i.weeklyVolume > 100000 && !i.isManipulated).sort((a,b) => b.roi - a.roi)[0];
    const topForge = [...STATE.forgeFlips].sort((a,b) => b.profitPerHour - a.profitPerHour)[0];

    document.getElementById('stat-total-flips').innerText = totalFlips.toLocaleString();
    
    const topHourlyEl = document.getElementById('stat-top-hourly');
    if (topHourlyEl) {
        topHourlyEl.innerText = topHourly ? `+${formatCoins(topHourly.realisticHourlyProfit)}/hr` : '-';
        document.getElementById('stat-top-hourly-item').innerText = topHourly ? `${topHourly.name} (realistic)` : '-';
    }

    const topForgeEl = document.getElementById('stat-top-forge');
    if (topForgeEl) {
        topForgeEl.innerText = topForge ? `+${formatCoins(topForge.profitPerHour)}/hr` : '-';
        document.getElementById('stat-top-forge-item').innerText = topForge ? `${topForge.name} (HOTM ${topForge.hotm})` : '-';
    }

    document.getElementById('stat-top-roi').innerText = topRoi ? `${topRoi.roi.toFixed(1)}% (${topRoi.name})` : '-';
}

// Render The Forge Tab (AH + Bazaar Fusion)
function renderForgeTable() {
    const container = document.getElementById('table-content');
    let list = [...STATE.forgeFlips];

    // Filter by Forge category
    if (STATE.forgeCategory !== 'ALL') {
        list = list.filter(item => item.category === STATE.forgeCategory);
    }

    // Filter by search query
    if (STATE.searchQuery.trim()) {
        const q = STATE.searchQuery.toLowerCase();
        list = list.filter(item => item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q));
    }

    // Filter by budget
    if (isFinite(STATE.budget) && STATE.budget > 0) {
        list = list.filter(item => item.totalCost <= STATE.budget);
    }

    // Sort
    list.sort((a, b) => {
        let diff = 0;
        if (STATE.sortBy === 'forgeHourly' || STATE.sortBy === 'score' || STATE.sortBy === 'realisticHourly') diff = a.profitPerHour - b.profitPerHour;
        else if (STATE.sortBy === 'profit') diff = a.netProfit - b.netProfit;
        else if (STATE.sortBy === 'roi') diff = a.roi - b.roi;
        else if (STATE.sortBy === 'cost') diff = a.totalCost - b.totalCost;
        else if (STATE.sortBy === 'speed') diff = a.adjustedDurationMinutes - b.adjustedDurationMinutes;
        return STATE.sortOrder === 'desc' ? -diff : diff;
    });

    document.getElementById('match-count').innerText = `${list.length} forge recipes active`;

    if (list.length === 0) {
        container.innerHTML = `
            <div class="py-16 text-center text-zinc-400">
                <i data-lucide="hammer" class="w-12 h-12 mx-auto mb-3 text-zinc-600"></i>
                <p class="text-lg font-medium text-zinc-300">No forge recipes match your filter</p>
                <p class="text-sm">Try expanding your budget or clearing the search query.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    let rowsHtml = '';
    list.forEach((item, index) => {
        const ingredientsTooltip = item.inputs.map(i => `${i.count}x ${i.name} (${formatCoins(i.totalCost)} via ${i.source})`).join('\n');
        const ingredientsBadges = item.inputs.slice(0, 3).map(i => `<span class="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300">${i.count}x ${i.name}</span>`).join(' ');
        const extraBadges = item.inputs.length > 3 ? `<span class="text-[10px] text-zinc-500 font-mono">+${item.inputs.length - 3} more</span>` : '';

        const sellSourceBadge = item.sellSource.includes('AH') 
            ? '<span class="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">AH LBIN</span>'
            : '<span class="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">Bazaar</span>';

        rowsHtml += `
            <tr class="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors">
                <td class="py-3 px-4">
                    <div class="flex items-center gap-1.5 font-mono text-xs">
                        <span class="text-zinc-500">#${index + 1}</span>
                        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            HOTM ${item.hotm}
                        </span>
                    </div>
                </td>
                <td class="py-3 px-4">
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-zinc-100 hover:text-amber-400 cursor-pointer" onclick="showForgeBreakdown('${item.id}')">${item.name}</span>
                            ${sellSourceBadge}
                        </div>
                        <div class="text-[11px] text-zinc-400 flex flex-wrap items-center gap-1 mt-1" title="${ingredientsTooltip}">
                            ${ingredientsBadges} ${extraBadges}
                        </div>
                    </div>
                </td>
                <td class="py-3 px-4 font-mono text-sm text-zinc-300">${formatCoins(item.totalCost)}</td>
                <td class="py-3 px-4 font-mono text-sm text-zinc-300">${formatCoins(item.grossSellPrice)}</td>
                <td class="py-3 px-4 font-mono text-sm font-bold ${item.netProfit > 0 ? 'text-emerald-400' : 'text-red-400'}">
                    +${formatCoins(item.netProfit)}
                </td>
                <td class="py-3 px-4">
                    <div class="flex flex-col">
                        <span class="font-mono text-sm font-extrabold text-amber-300">+${formatCoins(item.profitPerHour)}/hr</span>
                        <span class="text-[10px] text-zinc-500 font-mono">5 Slots: +${formatCoins(item.fiveSlotsDailyPotential)}/day</span>
                    </div>
                </td>
                <td class="py-3 px-4">
                    <div class="flex flex-col">
                        <span class="font-mono text-xs text-zinc-200">${formatDuration(item.adjustedDurationMinutes)}</span>
                        <span class="text-[10px] text-zinc-500">Base: ${formatDuration(item.baseDurationMinutes)}</span>
                    </div>
                </td>
                <td class="py-3 px-4 text-right">
                    <button onclick="showForgeBreakdown('${item.id}')" class="px-3 py-1.5 text-xs rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-zinc-950 transition-all font-semibold">
                        Breakdown
                    </button>
                </td>
            </tr>
        `;
    });

    container.innerHTML = `
        <div class="p-4 mb-4 bg-gradient-to-r from-amber-950/30 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-lg flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <i data-lucide="anvil" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-amber-300 flex items-center gap-2">
                        <span>The Forge Flipping Engine (Auction House + Bazaar Live Data)</span>
                    </h3>
                    <p class="text-xs text-zinc-400">Calculates exact ingredient costs across Bazaar & AH lowest BIN, then compares against final market sell prices per hour of forge time.</p>
                </div>
            </div>

            <!-- Quick Forge Level Slider -->
            <div class="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs">
                <span class="text-zinc-400 font-medium">Quick Forge Perk:</span>
                <input type="range" id="quick-forge-slider" min="0" max="20" value="${STATE.quickForgeLevel}" 
                       class="w-24 accent-amber-500 cursor-pointer" oninput="updateQuickForgePerk(this.value)">
                <span id="quick-forge-label" class="font-mono font-bold text-amber-400 w-12 text-right">Lvl ${STATE.quickForgeLevel} (-${Math.round(STATE.quickForgeReduction * 100)}%)</span>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-900/60">
                        <th class="py-3 px-4">Req.</th>
                        <th class="py-3 px-4">Forge Item & Recipe</th>
                        <th class="py-3 px-4 cursor-pointer hover:text-zinc-200" onclick="setSort('cost')">Craft Cost</th>
                        <th class="py-3 px-4">Sell Price</th>
                        <th class="py-3 px-4 cursor-pointer hover:text-zinc-200" onclick="setSort('profit')">Net Profit</th>
                        <th class="py-3 px-4 cursor-pointer hover:text-zinc-200" onclick="setSort('forgeHourly')">Profit / Hour ⚡</th>
                        <th class="py-3 px-4 cursor-pointer hover:text-zinc-200" onclick="setSort('speed')">Forge Time</th>
                        <th class="py-3 px-4 text-right">Details</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
    `;

    lucide.createIcons();
}

function updateQuickForgePerk(level) {
    const lvl = parseInt(level) || 0;
    STATE.quickForgeLevel = lvl;
    // Each level gives 1.5% reduction up to 30% at level 20
    STATE.quickForgeReduction = Math.min(0.30, lvl * 0.015);
    const label = document.getElementById('quick-forge-label');
    if (label) label.innerText = `Lvl ${lvl} (-${Math.round(STATE.quickForgeReduction * 100)}%)`;
    processMarketData();
}

function showForgeBreakdown(recipeId) {
    const item = STATE.forgeFlips.find(f => f.id === recipeId);
    if (!item) return;

    let inputsHtml = '';
    item.inputs.forEach(input => {
        inputsHtml += `
            <div class="flex items-center justify-between p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs">
                <div>
                    <span class="font-bold text-zinc-200">${input.count}x ${input.name}</span>
                    <span class="text-[10px] text-zinc-500 block font-mono">ID: ${input.id} &bull; Bought from ${input.source}</span>
                </div>
                <div class="text-right font-mono">
                    <span class="text-zinc-300 font-bold">${formatCoins(input.totalCost)} coins</span>
                    <span class="text-[10px] text-zinc-500 block">@ ${formatCoins(input.unitPrice)}/ea</span>
                </div>
            </div>
        `;
    });

    const container = document.getElementById('table-content');
    container.innerHTML = `
        <div class="max-w-3xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl space-y-6">
            <div class="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                    <div class="flex items-center gap-2">
                        <h2 class="text-xl font-bold text-zinc-100">${item.name}</h2>
                        <span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">HOTM ${item.hotm}</span>
                        <span class="px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-400">${item.category}</span>
                    </div>
                    <p class="text-xs text-zinc-400 mt-1">Full Forge Cost & Live Profit Breakdown</p>
                </div>
                <button onclick="setTab('forge')" class="px-3 py-1.5 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                    Back to Forge List
                </button>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <span class="text-[11px] text-zinc-400">Total Materials Cost</span>
                    <p class="text-base font-mono font-bold text-zinc-200 mt-1">${formatCoins(item.totalCost)}</p>
                </div>
                <div class="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <span class="text-[11px] text-zinc-400">Gross Market Sell Price</span>
                    <p class="text-base font-mono font-bold text-zinc-200 mt-1">${formatCoins(item.grossSellPrice)}</p>
                </div>
                <div class="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <span class="text-[11px] text-zinc-400">Net Profit per Forge</span>
                    <p class="text-base font-mono font-bold text-emerald-400 mt-1">+${formatCoins(item.netProfit)}</p>
                </div>
                <div class="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <span class="text-[11px] text-zinc-400">Profit / Hour</span>
                    <p class="text-base font-mono font-bold text-amber-300 mt-1">+${formatCoins(item.profitPerHour)}/hr</p>
                </div>
            </div>

            <div>
                <h4 class="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Required Materials (Live Market Costs):</h4>
                <div class="space-y-2">
                    ${inputsHtml}
                </div>
            </div>

            <div class="p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <div>
                    <span class="text-zinc-500 block">Craft Time with Quick Forge Lvl ${STATE.quickForgeLevel}:</span>
                    <span class="text-zinc-200 font-bold text-sm">${formatDuration(item.adjustedDurationMinutes)}</span>
                </div>
                <div>
                    <span class="text-zinc-500 block">1 Slot Daily Profit (24h):</span>
                    <span class="text-emerald-400 font-bold text-sm">+${formatCoins(item.profitPerDaySlot)} coins</span>
                </div>
                <div>
                    <span class="text-zinc-500 block">5 Slots Daily Potential:</span>
                    <span class="text-amber-300 font-bold text-sm">+${formatCoins(item.fiveSlotsDailyPotential)} coins</span>
                </div>
            </div>

            <div class="flex items-center justify-between pt-2">
                <button onclick="copyToClipboard('/bz ${item.name}')" class="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300">
                    Copy "/bz ${item.name}"
                </button>
                <button onclick="setTab('forge')" class="px-4 py-2 rounded bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400">
                    Done
                </button>
            </div>
        </div>
    `;

    lucide.createIcons();
}

// Render Main Bazaar Spread Table
function renderBazaarTable() {
    const container = document.getElementById('table-content');
    let list = [...STATE.items];

    if (STATE.category !== 'ALL') {
        list = list.filter(item => item.category === STATE.category);
    }
    if (STATE.searchQuery.trim()) {
        const q = STATE.searchQuery.toLowerCase();
        list = list.filter(item => item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q));
    }
    if (STATE.safeFlipsOnly) {
        list = list.filter(item => !item.isManipulated && item.weeklyVolume >= 50000);
    }
    if (isFinite(STATE.budget) && STATE.budget > 0) {
        list = list.filter(item => item.buyPrice <= STATE.budget);
    }
    if (STATE.minProfit > 0) {
        list = list.filter(item => item.profit >= STATE.minProfit);
    }
    if (STATE.minRoi > 0) {
        list = list.filter(item => item.roi >= STATE.minRoi);
    }
    if (STATE.minVolume > 0) {
        list = list.filter(item => item.weeklyVolume >= STATE.minVolume);
    }

    list.sort((a, b) => {
        let diff = 0;
        if (STATE.sortBy === 'score') diff = a.score - b.score;
        else if (STATE.sortBy === 'realisticHourly') diff = a.realisticHourlyProfit - b.realisticHourlyProfit;
        else if (STATE.sortBy === 'profit') diff = a.profit - b.profit;
        else if (STATE.sortBy === 'roi') diff = a.roi - b.roi;
        else if (STATE.sortBy === 'volume') diff = a.weeklyVolume - b.weeklyVolume;
        else if (STATE.sortBy === 'cost') diff = a.buyPrice - b.buyPrice;
        else if (STATE.sortBy === 'speed') diff = a.fillTimeMinutes - b.fillTimeMinutes;
        return STATE.sortOrder === 'desc' ? -diff : diff;
    });

    document.getElementById('match-count').innerText = `${list.length} realistic flips found`;

    if (list.length === 0) {
        container.innerHTML = `
            <div class="py-16 text-center text-zinc-400">
                <i data-lucide="search-x" class="w-12 h-12 mx-auto mb-3 text-zinc-600"></i>
                <p class="text-lg font-medium text-zinc-300">No flips match your strict filters</p>
                <p class="text-sm">Try unchecking "Safe Flips Only", lowering min profit, or expanding your budget.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    let rowsHtml = '';
    list.slice(0, 100).forEach((item, index) => {
        const manipWarning = item.isManipulated 
            ? `<span title="${item.manipulationReason}" class="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/40 font-bold ml-1">⚠️ TRAP</span>` 
            : '';

        rowsHtml += `
            <tr class="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors">
                <td class="py-3 px-4">
                    <div class="flex items-center gap-1.5 font-mono text-xs">
                        <span class="text-zinc-500">#${index + 1}</span>
                        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold ${item.score >= 70 ? 'bg-emerald-500/20 text-emerald-400' : item.score >= 45 ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-800 text-zinc-400'}">
                            ${item.score}
                        </span>
                    </div>
                </td>
                <td class="py-3 px-4">
                    <div class="flex flex-col">
                        <div class="flex items-center gap-1">
                            <span class="font-semibold text-zinc-100 hover:text-emerald-400 cursor-pointer" onclick="openSimulator('${item.id}')">${item.name}</span>
                            ${manipWarning}
                        </div>
                        <div class="text-[11px] text-zinc-500 flex items-center gap-1.5 font-mono mt-0.5">
                            <span class="px-1.5 py-0.2 rounded bg-zinc-800/80 text-[10px] text-zinc-400">${item.category}</span>
                            <span>${item.id}</span>
                            <button onclick="copyToClipboard('/bz ${item.name}')" title="Copy in-game /bz command" class="hover:text-emerald-300">
                                <i data-lucide="copy" class="w-3 h-3"></i>
                            </button>
                        </div>
                    </div>
                </td>
                <td class="py-3 px-4 font-mono text-sm text-zinc-300">${formatCoins(item.buyPrice)}</td>
                <td class="py-3 px-4 font-mono text-sm text-zinc-300">${formatCoins(item.sellPrice)}</td>
                <td class="py-3 px-4 font-mono text-sm font-bold text-emerald-400">+${formatCoins(item.profit)}</td>
                <td class="py-3 px-4 font-mono text-sm ${item.roi >= 15 ? 'text-emerald-400 font-bold' : item.roi >= 5 ? 'text-amber-400' : 'text-zinc-400'}">
                    ${item.roi.toFixed(1)}%
                </td>
                <td class="py-3 px-4">
                    <div class="flex flex-col">
                        <span class="font-mono text-sm font-bold text-teal-300">+${formatCoins(item.realisticHourlyProfit)}/hr</span>
                        <span class="text-[10px] text-zinc-500 font-mono">~${formatNumber(item.realisticUnitsPerHour)} units/hr</span>
                    </div>
                </td>
                <td class="py-3 px-4">
                    <div class="flex flex-col">
                        <span class="px-2 py-0.5 rounded text-[11px] border text-center font-mono ${item.speedBadgeColor}">
                            ${item.fillTimeBadge}
                        </span>
                        <span class="text-[10px] text-zinc-400 text-center mt-0.5">${formatNumber(item.weeklyVolume)}/wk</span>
                    </div>
                </td>
                <td class="py-3 px-4 text-right">
                    <button onclick="openSimulator('${item.id}')" class="px-3 py-1.5 text-xs rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-zinc-950 transition-all font-semibold">
                        Simulate
                    </button>
                </td>
            </tr>
        `;
    });

    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-900/60">
                        <th class="py-3 px-4 cursor-pointer hover:text-zinc-200" onclick="setSort('score')">Score</th>
                        <th class="py-3 px-4">Item Name</th>
                        <th class="py-3 px-4 cursor-pointer hover:text-zinc-200" onclick="setSort('cost')">Buy Order</th>
                        <th class="py-3 px-4">Sell Offer</th>
                        <th class="py-3 px-4 cursor-pointer hover:text-zinc-200" onclick="setSort('profit')">Margin/Unit</th>
                        <th class="py-3 px-4 cursor-pointer hover:text-zinc-200" onclick="setSort('roi')">ROI %</th>
                        <th class="py-3 px-4 cursor-pointer hover:text-zinc-200" onclick="setSort('realisticHourly')">Realistic Coins/Hr 💡</th>
                        <th class="py-3 px-4 cursor-pointer hover:text-zinc-200" onclick="setSort('speed')">Est. Fill Speed</th>
                        <th class="py-3 px-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
    `;

    lucide.createIcons();
}

// Render NPC Sell Flips
function renderNpcTable() {
    const container = document.getElementById('table-content');
    const list = [...STATE.npcFlips].sort((a,b) => b.profit - a.profit);

    if (list.length === 0) {
        container.innerHTML = `
            <div class="py-16 text-center text-zinc-400">
                <i data-lucide="check-circle-2" class="w-12 h-12 mx-auto mb-3 text-emerald-500"></i>
                <p class="text-lg font-medium text-zinc-300">No active NPC flips right now</p>
                <p class="text-sm">NPC flips occur when instant-buy prices dip below NPC shop payout.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    let rowsHtml = '';
    list.forEach((item, index) => {
        rowsHtml += `
            <tr class="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors">
                <td class="py-3 px-4 font-mono text-xs text-zinc-500">#${index + 1}</td>
                <td class="py-3 px-4 font-semibold text-zinc-100">${item.name}</td>
                <td class="py-3 px-4 font-mono text-sm text-zinc-300">${formatCoins(item.instantBuyPrice)}</td>
                <td class="py-3 px-4 font-mono text-sm text-amber-300 font-bold">${formatCoins(item.npcPrice)}</td>
                <td class="py-3 px-4 font-mono text-sm font-bold text-emerald-400">+${formatCoins(item.profit)}</td>
                <td class="py-3 px-4 font-mono text-sm text-emerald-400">${item.roi.toFixed(1)}%</td>
                <td class="py-3 px-4 font-mono text-xs text-zinc-400">${formatNumber(item.stockVolume)} avail</td>
                <td class="py-3 px-4 text-right">
                    <button onclick="copyToClipboard('/bz ${item.name}')" class="px-3 py-1 text-xs rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-zinc-950 transition-all font-medium">
                        Buy Instant
                    </button>
                </td>
            </tr>
        `;
    });

    container.innerHTML = `
        <div class="p-4 mb-4 bg-emerald-950/20 border border-emerald-500/30 rounded-lg flex items-center justify-between">
            <div class="flex items-center gap-3">
                <i data-lucide="shield-check" class="w-6 h-6 text-emerald-400"></i>
                <div>
                    <h3 class="text-sm font-bold text-emerald-300">100% Risk-Free NPC Flips</h3>
                    <p class="text-xs text-zinc-400">Instant-buy these items directly on Bazaar, then sell them to any NPC vendor for instant guaranteed coins!</p>
                </div>
            </div>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-900/60">
                        <th class="py-3 px-4">#</th>
                        <th class="py-3 px-4">Item Name</th>
                        <th class="py-3 px-4">Instant Buy Cost</th>
                        <th class="py-3 px-4">NPC Vendor Pays</th>
                        <th class="py-3 px-4">Guaranteed Profit</th>
                        <th class="py-3 px-4">ROI %</th>
                        <th class="py-3 px-4">Available Supply</th>
                        <th class="py-3 px-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
    `;

    lucide.createIcons();
}

// Render Craft Flips Table
function renderCraftTable() {
    const container = document.getElementById('table-content');
    const list = [...STATE.craftFlips].sort((a,b) => b.profit - a.profit);

    let rowsHtml = '';
    list.forEach((item, index) => {
        const recipeText = item.recipe.inputs.map(i => `${i.count}x ${cleanItemName(i.id)}`).join(' + ');
        rowsHtml += `
            <tr class="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors">
                <td class="py-3 px-4 font-mono text-xs text-zinc-500">#${index + 1}</td>
                <td class="py-3 px-4">
                    <div class="font-semibold text-zinc-100">${item.name}</div>
                    <div class="text-[11px] text-zinc-400">${recipeText}</div>
                </td>
                <td class="py-3 px-4 font-mono text-sm text-zinc-300">${formatCoins(item.materialCost)}</td>
                <td class="py-3 px-4 font-mono text-sm text-zinc-300">${formatCoins(item.targetSellOffer)}</td>
                <td class="py-3 px-4 font-mono text-sm font-bold text-emerald-400">+${formatCoins(item.profit)}</td>
                <td class="py-3 px-4 font-mono text-sm text-emerald-400">${item.roi.toFixed(1)}%</td>
                <td class="py-3 px-4 font-mono text-xs text-zinc-400">${formatNumber(item.weeklyVolume)}/wk</td>
            </tr>
        `;
    });

    container.innerHTML = `
        <div class="p-4 mb-4 bg-purple-950/20 border border-purple-500/30 rounded-lg flex items-center justify-between">
            <div class="flex items-center gap-3">
                <i data-lucide="hammer" class="w-6 h-6 text-purple-400"></i>
                <div>
                    <h3 class="text-sm font-bold text-purple-300">Bazaar Craft Flips</h3>
                    <p class="text-xs text-zinc-400">Buy base ingredients using Buy Orders, compact or craft them in your crafting grid, and sell the finished product using Sell Offers.</p>
                </div>
            </div>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-zinc-800 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-900/60">
                        <th class="py-3 px-4">#</th>
                        <th class="py-3 px-4">Craft Result & Recipe</th>
                        <th class="py-3 px-4">Material Cost</th>
                        <th class="py-3 px-4">Market Sell Offer</th>
                        <th class="py-3 px-4">Net Profit</th>
                        <th class="py-3 px-4">ROI %</th>
                        <th class="py-3 px-4">Demand</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>
    `;

    lucide.createIcons();
}

// Open Simulator
function openSimulator(itemId) {
    const item = STATE.items.find(i => i.id === itemId);
    if (!item) return;

    STATE.selectedItemForSim = item;
    setTab('simulator');
}

function renderSimulator() {
    const container = document.getElementById('table-content');
    const item = STATE.selectedItemForSim || STATE.items[0];

    if (!item) {
        container.innerHTML = `<div class="p-8 text-center text-zinc-400">Please select an item from the Bazaar tab to simulate.</div>`;
        return;
    }

    const defaultQty = Math.max(1, Math.min(1024, Math.floor(1000000 / item.buyPrice)));

    container.innerHTML = `
        <div class="max-w-4xl mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl">
            <div class="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                <div>
                    <h2 class="text-xl font-bold text-zinc-100 flex items-center gap-2">
                        <span>${item.name}</span>
                        <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">${item.id}</span>
                        <span class="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">${item.category}</span>
                    </h2>
                    <p class="text-xs text-zinc-400 mt-1">Realistic Profit Simulator & Fill Velocity Breakdown</p>
                </div>
                <button onclick="setTab('bazaar')" class="px-3 py-1.5 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                    Back to Table
                </button>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div class="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg">
                    <span class="text-[11px] text-zinc-400">Buy Order Price</span>
                    <p class="text-base font-mono font-bold text-zinc-200 mt-1">${formatCoins(item.buyPrice)}</p>
                </div>
                <div class="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg">
                    <span class="text-[11px] text-zinc-400">Sell Offer Price</span>
                    <p class="text-base font-mono font-bold text-zinc-200 mt-1">${formatCoins(item.sellPrice)}</p>
                </div>
                <div class="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg">
                    <span class="text-[11px] text-zinc-400">Net Profit / Unit</span>
                    <p class="text-base font-mono font-bold text-emerald-400 mt-1">+${formatCoins(item.profit)}</p>
                </div>
                <div class="p-3 bg-zinc-950/60 border border-zinc-800 rounded-lg">
                    <span class="text-[11px] text-zinc-400">Realistic Hourly Profit</span>
                    <p class="text-base font-mono font-bold text-teal-300 mt-1">+${formatCoins(item.realisticHourlyProfit)}/hr</p>
                </div>
            </div>

            <div class="p-4 bg-zinc-950/80 border border-zinc-800 rounded-lg mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                    <span class="text-zinc-500 block">Weekly Volume</span>
                    <span class="font-mono font-bold text-zinc-200">${formatNumber(item.weeklyVolume)} traded</span>
                </div>
                <div>
                    <span class="text-zinc-500 block">Competition</span>
                    <span class="font-mono font-bold text-zinc-200">${item.buyOrders} Buy Orders &bull; ${item.sellOrders} Sell Offers</span>
                </div>
                <div>
                    <span class="text-zinc-500 block">Estimated Fill Speed</span>
                    <span class="font-mono font-bold text-emerald-400">${item.fillTimeBadge}</span>
                </div>
                <div>
                    <span class="text-zinc-500 block">Flipping Score</span>
                    <span class="font-mono font-bold text-amber-300">${item.score}/100</span>
                </div>
            </div>

            <div class="p-5 bg-zinc-950 border border-zinc-800/80 rounded-lg mb-6">
                <label class="block text-xs font-semibold text-zinc-300 uppercase mb-2">Simulate Quantity to Flip:</label>
                <div class="flex items-center gap-4">
                    <input type="number" id="sim-quantity" value="${defaultQty}" min="1" max="71680" 
                           class="w-48 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-zinc-100 font-mono focus:border-emerald-500 focus:outline-none"
                           oninput="updateSimulatorCalc(${item.buyPrice}, ${item.sellPrice})">
                    <div class="flex flex-wrap gap-2 text-xs">
                        <button onclick="setSimQty(64, ${item.buyPrice}, ${item.sellPrice})" class="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">1 Stack (64)</button>
                        <button onclick="setSimQty(160, ${item.buyPrice}, ${item.sellPrice})" class="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">160</button>
                        <button onclick="setSimQty(1024, ${item.buyPrice}, ${item.sellPrice})" class="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">16 Stacks (1,024)</button>
                        <button onclick="setSimQty(71680, ${item.buyPrice}, ${item.sellPrice})" class="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300">Full Inventory</button>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800 font-mono">
                    <div>
                        <div class="text-[11px] text-zinc-400">Total Investment</div>
                        <div id="sim-investment" class="text-base font-bold text-zinc-100 mt-0.5">...</div>
                    </div>
                    <div>
                        <div class="text-[11px] text-zinc-400">Gross Return</div>
                        <div id="sim-gross" class="text-base font-bold text-zinc-100 mt-0.5">...</div>
                    </div>
                    <div>
                        <div class="text-[11px] text-zinc-400">Bazaar Tax Paid</div>
                        <div id="sim-tax" class="text-base font-bold text-red-400 mt-0.5">...</div>
                    </div>
                    <div>
                        <div class="text-[11px] text-zinc-400">Net Profit</div>
                        <div id="sim-net" class="text-base font-bold text-emerald-400 mt-0.5">...</div>
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/40 p-4 rounded-lg">
                <span class="flex items-center gap-1.5">
                    <i data-lucide="info" class="w-4 h-4 text-emerald-400"></i>
                    In-game recommendation: Place a Buy Order for this item, wait for it to fill, then list as a Sell Offer.
                </span>
                <button onclick="copyToClipboard('/bz ${item.name}')" class="px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-zinc-950 font-medium">
                    Copy "/bz ${item.name}"
                </button>
            </div>
        </div>
    `;

    lucide.createIcons();
    updateSimulatorCalc(item.buyPrice, item.sellPrice);
}

function setSimQty(qty, buyPrice, sellPrice) {
    const input = document.getElementById('sim-quantity');
    if (input) {
        input.value = qty;
        updateSimulatorCalc(buyPrice, sellPrice);
    }
}

function updateSimulatorCalc(buyPrice, sellPrice) {
    const qtyInput = document.getElementById('sim-quantity');
    if (!qtyInput) return;
    const qty = parseInt(qtyInput.value) || 0;

    const totalCost = buyPrice * qty;
    const grossReturn = sellPrice * qty;
    const tax = grossReturn * STATE.taxRate;
    const netReturn = grossReturn - tax;
    const netProfit = netReturn - totalCost;

    document.getElementById('sim-investment').innerText = `${formatCoins(totalCost)} coins`;
    document.getElementById('sim-gross').innerText = `${formatCoins(grossReturn)} coins`;
    document.getElementById('sim-tax').innerText = `-${formatCoins(tax)} coins`;
    document.getElementById('sim-net').innerText = `+${formatCoins(netProfit)} coins`;
}

// UI Controls
function setTab(tab) {
    STATE.activeTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.tab === tab) {
            btn.classList.add('bg-emerald-500/20', 'text-emerald-400', 'border-emerald-500/50');
            btn.classList.remove('text-zinc-400', 'border-transparent');
        } else {
            btn.classList.remove('bg-emerald-500/20', 'text-emerald-400', 'border-emerald-500/50');
            btn.classList.add('text-zinc-400', 'border-transparent');
        }
    });

    // Toggle category vs forge sub-navs
    const bazaarCats = document.getElementById('bazaar-categories');
    const forgeCats = document.getElementById('forge-categories');
    if (bazaarCats) bazaarCats.style.display = tab === 'bazaar' ? 'flex' : 'none';
    if (forgeCats) forgeCats.style.display = tab === 'forge' ? 'flex' : 'none';

    render();
}

function setCategory(cat) {
    STATE.category = cat;
    document.querySelectorAll('.cat-pill').forEach(btn => {
        if (btn.dataset.cat === cat) {
            btn.classList.add('bg-zinc-800', 'text-emerald-400', 'border-emerald-500/50');
            btn.classList.remove('text-zinc-400', 'border-transparent');
        } else {
            btn.classList.remove('bg-zinc-800', 'text-emerald-400', 'border-emerald-500/50');
            btn.classList.add('text-zinc-400', 'border-transparent');
        }
    });
    render();
}

function setForgeCategory(cat) {
    STATE.forgeCategory = cat;
    document.querySelectorAll('.forge-cat-pill').forEach(btn => {
        if (btn.dataset.forgecat === cat) {
            btn.classList.add('bg-zinc-800', 'text-amber-400', 'border-amber-500/50');
            btn.classList.remove('text-zinc-400', 'border-transparent');
        } else {
            btn.classList.remove('bg-zinc-800', 'text-amber-400', 'border-amber-500/50');
            btn.classList.add('text-zinc-400', 'border-transparent');
        }
    });
    render();
}

function setSort(col) {
    if (STATE.sortBy === col) {
        STATE.sortOrder = STATE.sortOrder === 'desc' ? 'asc' : 'desc';
    } else {
        STATE.sortBy = col;
        STATE.sortOrder = 'desc';
    }
    render();
}

function updateStatusUI(text, isWarning = false) {
    const el = document.getElementById('connection-status');
    if (el) {
        el.innerText = text;
        el.className = isWarning ? 'text-xs text-amber-400' : 'text-xs text-emerald-400';
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerText = `Copied "${text}" to clipboard!`;
        toast.classList.remove('opacity-0', 'pointer-events-none');
        setTimeout(() => toast.classList.add('opacity-0', 'pointer-events-none'), 2500);
    }
}

// Auto Refresh Timer
function startAutoRefresh() {
    STATE.refreshSecondsLeft = 30;
    if (STATE.autoRefreshInterval) clearInterval(STATE.autoRefreshInterval);

    STATE.autoRefreshInterval = setInterval(() => {
        STATE.refreshSecondsLeft--;
        const timerEl = document.getElementById('refresh-timer');
        if (timerEl) timerEl.innerText = `${STATE.refreshSecondsLeft}s`;

        if (STATE.refreshSecondsLeft <= 0) {
            STATE.refreshSecondsLeft = 30;
            fetchBazaarData();
        }
    }, 1000);
}

// Fallback Auction House Lowest BIN prices for Forge items
function generateDemoLowestBinData() {
    return {
        "DIVAN_HELMET": 29500000,
        "DIVAN_CHESTPLATE": 52000000,
        "DIVAN_LEGGINGS": 44000000,
        "DIVAN_BOOTS": 26000000,
        "GEMSTONE_CHAMBER": 7200000,
        "DRILL_ENGINE": 4800000,
        "RUBY_POLISHED_DRILL_ENGINE": 16500000,
        "SAPPHIRE_POLISHED_DRILL_ENGINE": 52000000,
        "AMBER_POLISHED_DRILL_ENGINE": 54000000,
        "MITHRIL_FUEL_TANK": 2200000,
        "TITANIUM_FUEL_TANK": 6800000,
        "GEMSTONE_FUEL_TANK": 14500000,
        "PERFECTLY_CUT_FUEL_TANK": 48000000,
        "MITHRIL_DRILL_1": 3100000,
        "TITANIUM_DRILL_1": 38000000,
        "RUBY_DRILL_1": 9200000,
        "GEMSTONE_DRILL_1": 21000000,
        "TUNGSTEN_KEY": 280000,
        "UMBER_KEY": 290000,
        "SKELETON_KEY": 4200000,
        "POWER_CRYSTAL": 240000,
        "BEJEWELED_COLLAR": 480000,
        "BLUE_CHEESE_GOBLIN_OMELETTE": 22000000,
        "SUNNY_SIDE_GOBLIN_OMELETTE": 4500000,
        "SPICY_GOBLIN_OMELETTE": 4200000,
        "DIVAN_FRAGMENT": 2800000,
        "WORM_MEMBRANE": 22000,
        "TREASURITE": 45000,
        "GLACITE_JEWEL": 55000,
        "SLUDGE_JUICE": 1850,
        "BLUE_EGG": 16000000,
        "GOBLIN_OMELETTE": 1500000,
        "YELLOW_GOBLIN_EGG": 25000,
        "RED_GOBLIN_EGG": 24000,
        "FLAWLESS_RUBY_GEM": 2800000,
        "FLAWLESS_SAPPHIRE_GEM": 2900000,
        "FLAWLESS_AMBER_GEM": 2850000,
        "FLAWLESS_JADE_GEM": 2750000,
        "FLAWLESS_AMETHYST_GEM": 2800000,
        "FLAWLESS_TOPAZ_GEM": 3100000,
        "FLAWLESS_JASPER_GEM": 4200000,
        "FLAWLESS_OPAL_GEM": 3400000
    };
}

// Fallback market snapshot
function generateDemoMarketData() {
    return {
        success: true,
        lastUpdated: Date.now(),
        products: {
            "ENCHANTED_DIAMOND_BLOCK": {
                product_id: "ENCHANTED_DIAMOND_BLOCK",
                quick_status: { buyPrice: 245000, sellPrice: 215000, buyMovingWeek: 850000, sellMovingWeek: 920000, buyOrders: 54, sellOrders: 42 }
            },
            "ENCHANTED_SLIME_BLOCK": {
                product_id: "ENCHANTED_SLIME_BLOCK",
                quick_status: { buyPrice: 165000, sellPrice: 138000, buyMovingWeek: 1200000, sellMovingWeek: 1100000, buyOrders: 75, sellOrders: 60 }
            },
            "BOOSTER_COOKIE": {
                product_id: "BOOSTER_COOKIE",
                quick_status: { buyPrice: 11200000, sellPrice: 10450000, buyMovingWeek: 340000, sellMovingWeek: 310000, buyOrders: 120, sellOrders: 95 }
            },
            "ENCHANTED_GOLD_BLOCK": {
                product_id: "ENCHANTED_GOLD_BLOCK",
                quick_status: { buyPrice: 135000, sellPrice: 112000, buyMovingWeek: 720000, sellMovingWeek: 810000, buyOrders: 40, sellOrders: 35 }
            },
            "ENCHANTED_IRON_BLOCK": {
                product_id: "ENCHANTED_IRON_BLOCK",
                quick_status: { buyPrice: 98000, sellPrice: 84000, buyMovingWeek: 650000, sellMovingWeek: 710000, buyOrders: 35, sellOrders: 30 }
            },
            "ENCHANTED_REDSTONE_BLOCK": {
                product_id: "ENCHANTED_REDSTONE_BLOCK",
                quick_status: { buyPrice: 42000, sellPrice: 35000, buyMovingWeek: 900000, sellMovingWeek: 950000, buyOrders: 50, sellOrders: 45 }
            },
            "ENCHANTED_MITHRIL": {
                product_id: "ENCHANTED_MITHRIL",
                quick_status: { buyPrice: 1200, sellPrice: 980, buyMovingWeek: 5500000, sellMovingWeek: 5800000, buyOrders: 110, sellOrders: 95 }
            },
            "REFINED_MITHRIL": {
                product_id: "REFINED_MITHRIL",
                quick_status: { buyPrice: 195000, sellPrice: 165000, buyMovingWeek: 950000, sellMovingWeek: 1050000, buyOrders: 65, sellOrders: 55 }
            },
            "ENCHANTED_TITANIUM": {
                product_id: "ENCHANTED_TITANIUM",
                quick_status: { buyPrice: 22000, sellPrice: 18500, buyMovingWeek: 1200000, sellMovingWeek: 1300000, buyOrders: 70, sellOrders: 60 }
            },
            "REFINED_TITANIUM": {
                product_id: "REFINED_TITANIUM",
                quick_status: { buyPrice: 420000, sellPrice: 345000, buyMovingWeek: 600000, sellMovingWeek: 640000, buyOrders: 48, sellOrders: 41 }
            },
            "GOLDEN_PLATE": {
                product_id: "GOLDEN_PLATE",
                quick_status: { buyPrice: 680000, sellPrice: 560000, buyMovingWeek: 420000, sellMovingWeek: 450000, buyOrders: 40, sellOrders: 35 }
            },
            "MITHRIL_PLATE": {
                product_id: "MITHRIL_PLATE",
                quick_status: { buyPrice: 2450000, sellPrice: 2050000, buyMovingWeek: 280000, sellMovingWeek: 310000, buyOrders: 35, sellOrders: 30 }
            },
            "GEMSTONE_MIXTURE": {
                product_id: "GEMSTONE_MIXTURE",
                quick_status: { buyPrice: 1450000, sellPrice: 1180000, buyMovingWeek: 520000, sellMovingWeek: 560000, buyOrders: 55, sellOrders: 48 }
            },
            "GLACITE_JEWEL": {
                product_id: "GLACITE_JEWEL",
                quick_status: { buyPrice: 58000, sellPrice: 48000, buyMovingWeek: 1800000, sellMovingWeek: 1900000, buyOrders: 85, sellOrders: 75 }
            },
            "SLUDGE_JUICE": {
                product_id: "SLUDGE_JUICE",
                quick_status: { buyPrice: 1950, sellPrice: 1650, buyMovingWeek: 12500000, sellMovingWeek: 13000000, buyOrders: 150, sellOrders: 130 }
            },
            "FINE_RUBY_GEM": {
                product_id: "FINE_RUBY_GEM",
                quick_status: { buyPrice: 34000, sellPrice: 28000, buyMovingWeek: 3200000, sellMovingWeek: 3400000, buyOrders: 90, sellOrders: 80 }
            },
            "FINE_AMBER_GEM": {
                product_id: "FINE_AMBER_GEM",
                quick_status: { buyPrice: 32000, sellPrice: 27000, buyMovingWeek: 2800000, sellMovingWeek: 3000000, buyOrders: 85, sellOrders: 75 }
            },
            "FINE_AMETHYST_GEM": {
                product_id: "FINE_AMETHYST_GEM",
                quick_status: { buyPrice: 31000, sellPrice: 26000, buyMovingWeek: 2700000, sellMovingWeek: 2900000, buyOrders: 80, sellOrders: 70 }
            },
            "FINE_JADE_GEM": {
                product_id: "FINE_JADE_GEM",
                quick_status: { buyPrice: 33000, sellPrice: 27500, buyMovingWeek: 2900000, sellMovingWeek: 3100000, buyOrders: 85, sellOrders: 75 }
            },
            "FINE_SAPPHIRE_GEM": {
                product_id: "FINE_SAPPHIRE_GEM",
                quick_status: { buyPrice: 32500, sellPrice: 27000, buyMovingWeek: 2850000, sellMovingWeek: 3050000, buyOrders: 82, sellOrders: 72 }
            },
            "FLAWLESS_RUBY_GEM": {
                product_id: "FLAWLESS_RUBY_GEM",
                quick_status: { buyPrice: 2850000, sellPrice: 2450000, buyMovingWeek: 450000, sellMovingWeek: 480000, buyOrders: 45, sellOrders: 40 }
            },
            "FLAWLESS_SAPPHIRE_GEM": {
                product_id: "FLAWLESS_SAPPHIRE_GEM",
                quick_status: { buyPrice: 2950000, sellPrice: 2550000, buyMovingWeek: 420000, sellMovingWeek: 450000, buyOrders: 42, sellOrders: 38 }
            },
            "FLAWLESS_AMBER_GEM": {
                product_id: "FLAWLESS_AMBER_GEM",
                quick_status: { buyPrice: 2900000, sellPrice: 2500000, buyMovingWeek: 430000, sellMovingWeek: 460000, buyOrders: 43, sellOrders: 39 }
            },
            "PERFECT_RUBY_GEM": {
                product_id: "PERFECT_RUBY_GEM",
                quick_status: { buyPrice: 17500000, sellPrice: 15200000, buyMovingWeek: 120000, sellMovingWeek: 130000, buyOrders: 30, sellOrders: 25 }
            },
            "HOT_POTATO_BOOK": {
                product_id: "HOT_POTATO_BOOK",
                quick_status: { buyPrice: 62000, sellPrice: 51000, buyMovingWeek: 1900000, sellMovingWeek: 2100000, buyOrders: 110, sellOrders: 90 }
            },
            "FUMING_POTATO_BOOK": {
                product_id: "FUMING_POTATO_BOOK",
                quick_status: { buyPrice: 890000, sellPrice: 775000, buyMovingWeek: 450000, sellMovingWeek: 480000, buyOrders: 35, sellOrders: 28 }
            },
            "ENCHANTED_CARROT": {
                product_id: "ENCHANTED_CARROT",
                quick_status: { buyPrice: 185, sellPrice: 145, buyMovingWeek: 8500000, sellMovingWeek: 9100000, buyOrders: 210, sellOrders: 180 }
            },
            "PACKED_ICE": {
                product_id: "PACKED_ICE",
                quick_status: { buyPrice: 3.8, sellPrice: 2.9, buyMovingWeek: 4500000, sellMovingWeek: 4200000, buyOrders: 85, sellOrders: 65 }
            }
        }
    };
}

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            STATE.searchQuery = e.target.value;
            render();
        });
    }

    const safeToggle = document.getElementById('toggle-safe-flips');
    if (safeToggle) {
        safeToggle.addEventListener('change', (e) => {
            STATE.safeFlipsOnly = e.target.checked;
            render();
        });
    }

    const budgetInput = document.getElementById('filter-budget');
    if (budgetInput) {
        budgetInput.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            STATE.budget = isNaN(val) || val <= 0 ? Infinity : val;
            render();
        });
    }

    const minProfitInput = document.getElementById('filter-min-profit');
    if (minProfitInput) {
        minProfitInput.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            STATE.minProfit = isNaN(val) ? 0 : val;
            render();
        });
    }

    const minVolInput = document.getElementById('filter-min-volume');
    if (minVolInput) {
        minVolInput.addEventListener('change', (e) => {
            STATE.minVolume = parseInt(e.target.value) || 0;
            render();
        });
    }

    const taxSelect = document.getElementById('tax-select');
    if (taxSelect) {
        taxSelect.addEventListener('change', (e) => {
            STATE.taxRate = parseFloat(e.target.value);
            processMarketData();
        });
    }

    fetchBazaarData();
    startAutoRefresh();
});
