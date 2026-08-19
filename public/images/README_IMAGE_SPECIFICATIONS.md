# SK Limo - Website Image Specifications & Asset Catalog

This directory contains all image assets for the SK Limo website. Every file is explicitly named with its **descriptive content** and **recommended pixel dimension** (`WIDTHxHEIGHT`) so you can easily replace them with your authentic photos.

---

## 📸 Image Catalog & Replacement Guide

### 1. Destinations & Sightseeing Tours (`/destinations` & `/destinations/[id]`)

| Current Filename | Purpose & Location | Recommended Dimensions | Aspect Ratio |
| :--- | :--- | :--- | :--- |
| `dest-fuji-kawaguchiko-1376x768.jpg` | Mount Fuji & Lake Kawaguchiko Card & Hero | **1376 × 768 px** (or 1920×1080) | 16:9 / ~16:9 |
| `dest-hakone-lake-ashi-1376x768.jpg` | Hakone Onsen & Lake Ashi Torii Gate | **1376 × 768 px** (or 1920×1080) | 16:9 / ~16:9 |
| `dest-kamakura-enoshima-1376x768.jpg` | Kamakura Great Buddha & Enoshima Coast | **1376 × 768 px** (or 1920×1080) | 16:9 / ~16:9 |
| `dest-nikko-unesco-1376x768.jpg` | UNESCO Nikko Toshogu Shrine & Kegon Falls | **1376 × 768 px** (or 1920×1080) | 16:9 / ~16:9 |
| `dest-yokohama-bay-4662x5828.jpg` | Yokohama Minato Mirai Skyline & Chinatown | **1920 × 1080 px** (or 4:5 vertical) | 16:9 or 4:5 |
| `dest-karuizawa-resort-1500x1001.jpg` | Karuizawa Alpine Resort & Shiraito Falls | **1500 × 1000 px** (or 1920×1080) | 3:2 / 16:9 |

---

### 2. Airport Transfers (`/tours` & `/tours/airport-transfer`)

| Current Filename | Purpose & Location | Recommended Dimensions | Aspect Ratio |
| :--- | :--- | :--- | :--- |
| `airport-transfer-vip-alphard-1376x768.jpg` | Airport Transfer Hero Card & Chauffeur Waiting | **1376 × 768 px** (or 1920×1080) | 16:9 / ~16:9 |

---

### 3. Winter Ski Charters (`/tours/winter`)

| Current Filename | Purpose & Location | Recommended Dimensions | Aspect Ratio |
| :--- | :--- | :--- | :--- |
| `winter-ski-trails-powder-5947x3965.jpg` | Winter Ski Hero Landscape & Background | **1920 × 1080 px** (or High-Res) | 16:9 / 3:2 |
| `winter-ski-nagano-resort-1500x1001.jpg` | Hakuba Valley Ski Resort Card | **1500 × 1000 px** | 3:2 / 16:9 |
| `winter-ski-snow-mountain-1500x1000.jpg` | Nozawa Onsen / Winter Snow Mountain Card | **1500 × 1000 px** | 3:2 / 16:9 |
| `winter-ski-hokkaido-overview-4096x3072.jpg` | Hokkaido / Shiga Kogen Alpine Overview | **1920 × 1080 px** (or 4:3) | 16:9 / 4:3 |

---

### 4. Executive Fleet Gallery (`Alphard`, `Granace`, `HiAce`)

| Current Filename | Purpose & Location | Recommended Dimensions | Aspect Ratio |
| :--- | :--- | :--- | :--- |
| `fleet-toyota-alphard-exterior-1477x1108.jpg` | Toyota Alphard Exterior View | **1477 × 1108 px** (or 1200×800) | 4:3 / 3:2 |
| `fleet-toyota-alphard-interior-1477x1108.jpg` | Toyota Alphard Executive VIP Interior | **1477 × 1108 px** (or 1200×800) | 4:3 / 3:2 |
| `fleet-toyota-alphard-trunk-1477x1108.jpg` | Toyota Alphard Luggage Trunk View | **1477 × 1108 px** (or 1200×800) | 4:3 / 3:2 |
| `fleet-toyota-granace-exterior-4032x3024.jpg` | Toyota Granace Premium Lounge Exterior | **4032 × 3024 px** (or 1200×800) | 4:3 / 3:2 |
| `fleet-toyota-granace-interior-1477x1108.jpg` | Toyota Granace 6-Seater Cabin Interior | **1477 × 1108 px** (or 1200×800) | 4:3 / 3:2 |
| `fleet-toyota-granace-trunk-1477x1108.jpg` | Toyota Granace Trunk & Luggage Space | **1477 × 1108 px** (or 1200×800) | 4:3 / 3:2 |
| `fleet-toyota-hiace-exterior-1477x1108.jpg` | Toyota HiAce Grand Cabin Exterior | **1477 × 1108 px** (or 1200×800) | 4:3 / 3:2 |
| `fleet-toyota-hiace-interior-1477x1108.jpg` | Toyota HiAce 9-Passenger Interior | **1477 × 1108 px** (or 1200×800) | 4:3 / 3:2 |
| `fleet-toyota-hiace-trunk-1477x1108.jpg` | Toyota HiAce Massive Luggage Trunk | **1477 × 1108 px** (or 1200×800) | 4:3 / 3:2 |

---

### 5. Official Brand Assets

| Current Filename | Purpose & Location | Recommended Dimensions | Format |
| :--- | :--- | :--- | :--- |
| `brand-sklimo-official-logo-250x250.png` | Official SK Limo Brand Header/Footer Logo | **250 × 250 px** (or SVG/PNG) | Transparent PNG |

---

## 🛠️ How to Replace Images Later:

1. Prepare your authentic image file with high quality.
2. Either overwrite the file with the **exact same filename** (e.g., replace `public/images/dest-fuji-kawaguchiko-1376x768.jpg`), OR
3. If you name your new image with new dimensions (e.g. `dest-fuji-kawaguchiko-1920x1080.jpg`), simply update the string in [`lib/destinations-data.ts`](file:///Users/acekh/Desktop/work/lib/destinations-data.ts) or the respective page.
