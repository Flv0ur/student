---
layout: blogs 
title: Blogs
search_exclude: true
permalink: /blogs/
---


```yaml
#Changed the theme in config.yml

title: OpenCoding
description: "Class of 2026"
owner_name: Santiago Alvarado Puente
github_username: Flv0ur
github_repo: "student"
baseurl: ""
future: true

# Change theme here:
# For Midnight:
#remote_theme: pages-themes/midnight@v0.2.0
# For Cayman, uncomment this line instead:
remote_theme: pages-themes/cayman@v0.2.0
# For Architect, uncomment this line instead:
#remote_theme: pages-themes/architect@v0.2.0
# For Hacker, uncomment this line instead:
#remote_theme: pages-themes/hacker@v0.2.0
# For Slate, uncomment this line instead:
#remote_theme: pages-themes/slate@v0.2.0
# For Modernist, uncomment this line instead:
#remote_theme: pages-themes/modernist@v0.2.0

# Plugins required for remote themes and caching includes
plugins:
  - jekyll-remote-theme
  - jekyll-include-cache
header_pages:
  - navigation/blog.md
  - navigation/search.md
  - navigation/about.md
  - navigation/logintoolkit.md

# Social links — works if theme supports it, otherwise used in your own footer/header includes
social_links:
  - platform: github
    user_url: "https://github.com/open-coding-society"
  - platform: x
    user_url: "https://x.com/Open_Coding"
  - platform: youtube
    user_url: "https://www.youtube.com/@OpenCodingSociety"
```


      Cell In[3], line 3
        title: Open Coding
                    ^
    SyntaxError: invalid syntax




```yaml
#Ran into issues because repo was hard coded to the current theme so I fixed by making base.html in _layouts accept all themes

---
layout: default
---

{{ content }}

```


      Cell In[5], line 3
        ---
           ^
    SyntaxError: invalid syntax




```javascript
#Currently working on Cookie clicker game

// Dynamically create and add a Restart Game button only for this file
window.addEventListener('DOMContentLoaded', () => {
  const gameArea = document.getElementById('game-area') || document.body;
  const restartBtn = document.createElement('button');
  restartBtn.id = 'restart-btn';
  restartBtn.textContent = 'Restart Game';
  restartBtn.style.marginTop = '2rem';
  restartBtn.style.background = '#4c0affff';
  restartBtn.style.color = '#fff';
  restartBtn.style.border = 'none';
  restartBtn.style.padding = '0.75rem 2rem';
  restartBtn.style.borderRadius = '6px';
  restartBtn.style.fontSize = '1rem';
  restartBtn.style.cursor = 'pointer';
  restartBtn.addEventListener('mouseover', () => restartBtn.style.background = '#0d0054ff');
  restartBtn.addEventListener('mouseout', () => restartBtn.style.background = '#cccdffff');
  restartBtn.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
  });
  gameArea.appendChild(restartBtn);
});
const shopContainer = document.getElementById("shop-container");
const cookieButton = document.getElementById("cookie");
const cookieCountDisplay = document.getElementById("cookie-count");
const gameArea = document.getElementById("game-area");

const cookie = {
  cookieMulti: 1,
  cookies: 0,
  addCookies(amount) {
    this.cookies += amount;
    this.updateDisplay();
    localStorage.setItem("cookies", this.cookies);
  },
  updateDisplay() {
    cookieCountDisplay.innerHTML = this.cookies;
  },
  fetchStoredCookies() {
    const storedCookies = Number(localStorage.getItem("cookies"));
    if (storedCookies) {
      this.cookies = storedCookies;
      this.updateDisplay();
    }
  },
};

const shop = {
  upgrades: [],
  tab: "shop",
  forSale: [],
  updateShopDisplay() {
    shopContainer.innerHTML = "";
    const shopTitle = document.createElement("div");
    shopTitle.className = "text-xl font-bold mb-4 text-center";
    shopTitle.innerHTML = "SHOP";
    shopContainer.appendChild(shopTitle);
    const shopSwap = document.createElement("button");
    shopSwap.className = `bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 mb-2`;
    if (this.tab === "upgrades") shopSwap.innerHTML = "Switch to Shop";
    else shopSwap.innerHTML = "Switch to Upgrades";
    shopSwap.addEventListener("click", () => {
      if (this.tab === "upgrades") shop.switchTab("shop");
      else shop.switchTab("upgrades");
    });
    shopContainer.appendChild(shopSwap);
    if (this.tab === "upgrades")
      for (let i = 0; i < this.forSale.length; i++) {
        const forSaleItemInfo = this.forSale[i];

        const shopButton = document.createElement("button");
        shopButton.className = `bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 mb-2`;
        shopButton.innerHTML = `${forSaleItemInfo.emoji} ${forSaleItemInfo.name} (${forSaleItemInfo.price} 🍪)`;
        shopContainer.appendChild(shopButton);

        shopButton.addEventListener("click", () => {
          if (cookie.cookies < forSaleItemInfo.price) {
            alert("Insufficient Cookies");
            return;
          }
          cookie.addCookies(-1 * forSaleItemInfo.price);

          gameLoop.updateCookieMulti(
            forSaleItemInfo.name,
            forSaleItemInfo.multiplier,
          );

          shopButton.remove();
        });
      }
    else if (this.tab === "shop")
      for (let i = 0; i < this.forSale.length; i++) {
        const forSaleItemInfo = this.forSale[i];

        const shopButton = document.createElement("button");
        shopButton.className = `bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 mb-2`;
        shopButton.innerHTML = `${forSaleItemInfo.emoji} ${forSaleItemInfo.name} (${forSaleItemInfo.price} 🍪)`;
        shopContainer.appendChild(shopButton);

        shopButton.addEventListener("click", () => {
          if (cookie.cookies < forSaleItemInfo.price) {
            alert("Insufficient Cookies");
            return;
          }
          cookie.addCookies(-1 * forSaleItemInfo.price);

          gameLoop.addAutoClicker(
            forSaleItemInfo.name,
            forSaleItemInfo.cookiesPerSecond,
          );
          this.updateForSalePrice(
            Math.floor(
              forSaleItemInfo.originalPrice *
                (gameLoop.getAmount(forSaleItemInfo.name) + 1),
            ),
            i,
          );
        });
      }
  },
  addItemForSale(item) {
    this.forSale.push({
      ...item,
      originalPrice: item.price,
    });
    this.updateShopDisplay();
  },
  updateForSalePrice(newPrice, index) {
    this.forSale[index].price = newPrice;
    this.updateShopDisplay();
  },
  switchTab(newTab) {
    this.tab = newTab;
    this.forSale.splice(0, this.forSale.length);
    this.updateShopDisplay();
    if (newTab === "shop") {
      console.log(shopItems);
      for (let i = 0; i < shopItems.length; i++) {
        console.log(shopItems[i])
        this.addItemForSale({
          ...shopItems[i],
          price: shopItems[i].price * (gameLoop.getAmount(shopItems[i].name) + 1),
        });
      }
    } else if (newTab === "upgrades") {
      for (let i = 0; i < this.upgrades.length; i++) {
        if (gameLoop.upgrades[this.upgrades[i].name]) continue;
        this.addItemForSale(this.upgrades[i]);
      }
    }
  },
};

const gameLoop = {
  autoClickers: {},
  upgrades: {},
  cookiesPerSecond: 0,
  intervalId: -1,
  addAutoClicker(itemName, cps) {
    if (this.autoClickers[itemName]) {
      this.autoClickers[itemName] += 1;
    } else {
      this.autoClickers[itemName] = 1;
    }
    this.cookiesPerSecond += cps;
    const savedUpgrades = localStorage.getItem("savedUpgrades");
    localStorage.setItem("savedShop", JSON.stringify(this.autoClickers));
    this.runLoop();

    const purchased = shopItems.find(it => it.name === itemName);
    if (purchased) emojiBuddies.spawnEmoji(purchased.emoji);

  },
  updateCookieMulti(itemName, amt) {
    this.upgrades[itemName] = amt;
    localStorage.setItem("savedUpgrades", JSON.stringify(this.upgrades));
    cookie.cookieMulti += amt;
  },
  runLoop() {
    if (this.intervalId > 0) {
      clearInterval(this.intervalId);
      this.intervalId = 0;
    }
    this.intervalId = setInterval(() => {
      cookie.addCookies(this.cookiesPerSecond);
    }, 1000);
  },
  fetchSavedData() {
    const data = localStorage.getItem("savedShop");
    if (data) {
      // Get the Cookies in our shop
      const cookiePerSecondAndIndexMap = {};
      for (let i = 0; i < shop.forSale.length; i++) {
        cookiePerSecondAndIndexMap[shop.forSale[i].name] = {
          cps: shop.forSale[i].cookiesPerSecond,
          emoji: shop.forSale[i].emoji,
          index: i,
        };
      }

      //get saved autoclickers (local storage)
      const autoClickersData = JSON.parse(data);
      this.autoClickers = autoClickersData;

      //for every item in autoClickers data, find its corresponding cookie from the shop (by its name).
      const keys = Object.keys(this.autoClickers);
      for (let i = 0; i < keys.length; i++) {
        const upgradeName = keys[i];
        const amount = this.autoClickers[upgradeName];
        if (!amount) {
          console.warn(`${upgradeName} not found in the shop.`);
          continue;
        }

        this.cookiesPerSecond +=
          amount * cookiePerSecondAndIndexMap[upgradeName].cps;

        shop.updateForSalePrice(
          Math.floor(
            shop.forSale[cookiePerSecondAndIndexMap[upgradeName].index]
              .originalPrice *
              (amount + 1),
          ),
          cookiePerSecondAndIndexMap[upgradeName].index,
        );
        for (let i = 0; i < amount; i++) {
          emojiBuddies.spawnEmoji(
            cookiePerSecondAndIndexMap[upgradeName].emoji,
          );
        }
        this.runLoop();
      }
    }
    const upgradeData = localStorage.getItem("savedUpgrades");
    if (upgradeData) {
      this.upgrades = JSON.parse(upgradeData);
      cookie.cookieMulti += this.upgrades["2X Clicks"];
    }
  },
  getAmount(cookieName) {
    return this.autoClickers[cookieName];
  },
};

const emojiBuddies = {
  getBounds() {
    const rect = gameArea.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      right: rect.right + window.scrollX,
      bottom: rect.bottom + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
  },
  spawnEmoji(emojiString) {
    const bounds = this.getBounds();

    // Create emoji element
    const emoji = document.createElement("div");
    emoji.textContent = emojiString;
    emoji.style.position = "absolute";
    emoji.style.fontSize = "2rem";

    // Random start inside bounding box
    let x = bounds.left + Math.random() * (bounds.width - 32);
    let y = bounds.top + Math.random() * (bounds.height - 32);

    emoji.style.left = `${x}px`;
    emoji.style.top = `${y}px`;

    // Add emoji to body (not inside gameArea, since we're using page coords)
    document.body.appendChild(emoji);

    // Random velocity
    let dx = (Math.random() < 0.5 ? -1 : 1) * 2;
    let dy = (Math.random() < 0.5 ? -1 : 1) * 2;

    function animate() {
      x += dx;
      y += dy;

      // Bounce off actual bounds
      if (x <= bounds.left || x + 32 >= bounds.right) dx *= -1;
      if (y <= bounds.top || y + 32 >= bounds.bottom) dy *= -1;

      emoji.style.left = `${x}px`;
      emoji.style.top = `${y}px`;

      requestAnimationFrame(animate);
    }

    animate();
  },
};

// The code Bellow is for Main Shop

const grandma = {
  name: "Grandma",
  emoji: "👵",
  price: 69,
  priceIncrementer: 1.5,
  cookiesPerSecond: 1,
};

const factory = {
  name: "Factory",
  emoji: "🏭",
  price: 400,
  priceIncrementer: 1.4,
  cookiesPerSecond: 4,
};

const mangotemple = {
  name: "Mango Temple",
  emoji: "🛕",
  price: 2000,
  priceIncrementer: 1.2,
  cookiesPerSecond: 10,
};

const bank = {
  name: "Bank",
  emoji: "🏦",
  price: 6741,
  priceIncrementer: 1.1,
  cookiesPerSecond: 20,
};

const CookieIsland = {
  name: "Cookie Island",
  emoji: "🏝️",
  price: 10000,
  priceIncrementer: 1.1,
  cookiesPerSecond: 50,
};

const CookieMaster = {
  name: "Cookie Master",
  emoji: "🍪",
  price: 50000,
  priceIncrementer: 1.1,
  cookiesPerSecond: 100,
};

const CookiePlanet = {
  name: "Cookie Planet",
  emoji: "🌏",
  price: 200000,
  priceIncrementer: 1.0,
  cookiesPerSecond: 500,
};


const shopItems = [];

shopItems.push(grandma);
shopItems.push(factory);
shopItems.push(mangotemple);
shopItems.push(bank);
shopItems.push(CookieIsland);
shopItems.push(CookieMaster);
shopItems.push(CookiePlanet);

// The code Bellow is for Upgrades Shop

const x2Click = {
  name: "2X Clicks",
  emoji: "🖱",
  price: 150,
  itemEffected: "click",
  multiplier: 2,
};

const x3Click = {
  name: "3X Clicks",
  emoji: "🖱",
  price: 500,
  itemEffected: "click",
  multiplier: 3,
};

const FastFlippers = {
  name: "Fast Flippers",
  emoji: "🐬",
  price: 1000,
  itemEffected: "click",
  multiplier: 10,
};

const ThousandHands = {
  name: "Thousand Hands",
  emoji: "🖐️",
  price: 100000,
  itemEffected: "click",
  multiplier: 100,
};

shop.upgrades.push(x2Click);
shop.upgrades.push(x3Click);
shop.upgrades.push(FastFlippers);
shop.upgrades.push(ThousandHands);

shop.addItemForSale(grandma);
shop.addItemForSale(factory);
shop.addItemForSale(mangotemple);
shop.addItemForSale(bank);
shop.addItemForSale(CookieIsland);
shop.addItemForSale(CookieMaster);
shop.addItemForSale(CookiePlanet);
gameLoop.fetchSavedData();
cookie.fetchStoredCookies();
cookieButton.addEventListener("click", () => {
  console.log("COOKIE");
  if (cookie.cookieMulti) {
    cookie.addCookies(1 * cookie.cookieMulti);
  } else {
    cookie.addCookies(1);
  }
  console.log(cookie.cookies);
  gameLoop.getAmount("Grandma");
  gameLoop.getAmount("Factory");
  gameLoop.getAmount("MangoTemple");
  gameLoop.getAmount("Bank");
  gameLoop.getAmount("Cookie Island");
  gameLoop.getAmount("Cookie Master");
  gameLoop.getAmount("Cookie Planet");
});
```
