# SkyFlip - Hypixel SkyBlock Flipping & Forge Intelligence 💰🔥

A real-time market tracker and flipping engine for **Hypixel SkyBlock**. 
It combines live **Bazaar prices** with live **Auction House Lowest BIN (LBIN)** data to find the most profitable flips and passive **Forge** recipes in the game.

---

## 🚀 How to Run

### Option 1: Direct in Browser (Instant)
Double-click **`index.html`** in this folder to open it in any web browser (Chrome, Opera GX, Edge, Firefox).

### Option 2: High-Speed Local Bridge (Recommended)
1. Right-click **`start-server.ps1`** and choose **"Run with PowerShell"**.
2. It starts a lightweight local bridge that streams live Hypixel Bazaar & Auction House data with zero latency or rate-limiting.
3. Automatically opens `http://localhost:8080/`.

---

## 🛠️ Features Included

### 1. 🔥 The Forge Flipping Engine (Auction House + Bazaar Fusion)
* **What it does:** Scans every recipe in The Dwarven Mines Forge (Refined Materials, Divan's Armor, Drill Engines, Mining Drills, Perfect Gemstones, Keys, Omelettes).
* **Live Cost & Sell Calculations:**
  * Pulls raw ingredient costs from the Bazaar (Buy Order or Instant Buy).
  * Pulls finished item sell values from either Bazaar Sell Offers or **Auction House Lowest BIN (LBIN)**.
* **Profit / Hour:** Ranks recipes by actual profit generated per hour of real-world forge time.
* **5-Slot Daily Potential:** Shows how many millions you can generate passively every 24 hours running 5 forge slots.
* **Quick Forge Perk Slider:** Adjust your HOTM Quick Forge perk level (0 to 20) to see exact reduced craft times and increased hourly profits!

### 2. ⚡ Realistic Bazaar Spread Arbitrage
* Calculates true round-trip market flow using weekly moving buy and sell volumes.
* Undercut and competition-aware: calculates **Realistic Coins / Hr** based on real player market share.
* Anti-Manipulation Trap Shield (⚠️ **TRAP**) flags fake orders of 1 item with manipulated spreads.

### 3. 🛡️ 100% Risk-Free NPC Vendor Arbitrage
* Alerts whenever an item's instant-buy price on the Bazaar drops below what NPC shopkeepers pay, giving you instant risk-free coins.

### 4. 🔨 Craft Flips & Profit Simulator
* Test custom quantities, calculate net profit after taxes, and copy in-game `/bz <item>` commands with a single click.
