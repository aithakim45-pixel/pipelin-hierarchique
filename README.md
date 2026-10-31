# SkyFlip - Hypixel SkyBlock Flipping Intelligence 💰

An instant, live market tracking and flipping intelligence web application for **Hypixel SkyBlock**. 
It calculates real-time profit margins, ROI %, and trade velocities across the entire Bazaar without requiring any private API keys.

---

## 🚀 How to Run

You have two simple ways to run this:

### Option 1: Direct in Browser (Instant)
1. Double-click **`index.html`** in this folder to open it in your web browser (Chrome, Opera GX, Edge, Firefox).
2. The app uses public multi-redundancy CORS proxies to fetch live Hypixel Bazaar data.

### Option 2: High-Speed Local Bridge (Recommended)
If you want ultra-fast updates without any public proxy latency or rate limits:
1. Right-click **`start-server.ps1`** and choose **"Run with PowerShell"**.
2. It will automatically start a lightweight local server and open `http://localhost:8080/` in your browser.
3. *Note: No Node.js or Python is required! This uses Windows built-in PowerShell .NET capabilities.*

---

## 🎯 Flip Categories Included

### 1. Bazaar Order Flipping (Spread Arbitrage)
* **How it works:** 
  * You place a **Buy Order** at the highest existing buy order price.
  * Once filled, you place a **Sell Offer** at the lowest existing sell offer price.
  * The app calculates your exact profit after deducting the SkyBlock Bazaar sales tax (1.125% - 1.25%).
* **Tips:** Pay attention to the **Speed / Volume** indicator. Items with > 1M weekly volume (like Enchanted Slime, Enchanted Diamonds, Booster Cookies) fill almost immediately.

### 2. Instant NPC Flips (100% Risk-Free)
* **How it works:**
  * When players dump large quantities of items on the Bazaar, instant-buy prices can temporarily drop *below* the fixed payout that NPC shopkeepers (Lumberjack, Mine Merchant, Farm Merchant) pay.
  * You simply Instant-Buy the items on the Bazaar and sell them directly to an NPC shop for free guaranteed profit.

### 3. Craft Flips
* **How it works:**
  * Compares the cost of buying raw materials (e.g. 160 Enchanted Diamonds) against the market sell offer of the crafted item (Enchanted Diamond Block, Super Compactor 3000, Hot Potato Books).
  * Automatically factors in Bazaar tax to tell you whether crafting the item yourself is worth the time.

### 4. Interactive Profit Simulator
* Test any item with custom quantities (1 stack, 160, 1024, or full inventory).
* View exact investment needed, gross revenue, tax paid, and clean net profit.
* Copy the `/bz <item>` command to your clipboard with one click.
