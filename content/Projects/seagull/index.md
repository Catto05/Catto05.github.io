---
title: "Seagull"
date: 2025-10-11
showReadingTime: false
tags: ["Game Jam", "Godot", "GD Script"]
featureImage: "img/copertina_itch.png"
---
## 📸 Gallery
{{< carousel images="gallery/*" aspectRatio="5-3" interval="2500" >}}

---

## 📺 Video Demo
{{< video-slider >}}
  {{< video-slide caption = "Trailer"
  >}}
        {{< youtubeLite id="19d-DHL2Wu0" label="Blowfish-tools demo" >}}
    {{< /video-slide >}}
    {{< video-slide caption = "Gameplay">}}
        {{< video src="life_of_kengah.mov" >}}
    {{< /video-slide >}}
{{< /video-slider >}}

---

## 📝 General Description
### Project Overview
**Life of Kengah** is a fast-paced, high-stakes arcade action game developed in just 14 days for the **FAIL/SAFE JAM 2025**. Players take on the role of a hungry seagull with a bottomless stomach, diving into the vast ocean to feast on exotic marine life.

Created by the team of Lorenzo Cattolico, Marco Silvestri, Francesco Perino, and Nicolò Rizzo, the game centers on a compelling "push-your-luck" loop: how deep are you willing to go for a high score before the ocean claims you?

---

### Key Features
* **Risk vs. Reward Diving**: The deeper you plunge into the dark depths, the more valuable and rare the fish become. However, the journey back to the surface grows longer and more dangerous.

* **Oxygen Management**: Your air supply is your lifeline. It depletes constantly while underwater, forcing you to make split-second decisions between grabbing one last fish or heading for the surface.

* **Score Banking Mechanic**: Caught fish aren't "safe" until you return to your boat. Failing to surface before your oxygen runs out results in a total loss of your current haul.

* **Intuitive Arcade Controls**: Simple yet tight navigation using arrow keys, allowing players to focus entirely on the strategic timing of their dives.

---

## 🛠️ Technical Details
The project was built under the constraints of a 2-week game jam, focusing on polished core loops and responsive feedback:

* **Dynamic Scoring System**: Implemented logic that scales point values based on depth coordinates, incentivizing players to explore the "dark zone" of the map.

* **Resource Controller**: A precision-based oxygen system that serves as a natural timer, integrated with visual UI alerts to heighten tension as the bar empties.

* **State-Based Gameplay**: Developed a robust system to handle transitions between diving, catching, and "banking" scores at the boat to ensure data persistence during a run.

* **Rapid Prototyping**: Built using a collaborative workflow to balance asset integration (art and sound) with gameplay programming within the 14-day deadline.


---

## 🔗 Links
* [Github Code](https://github.com/Catto05/game_jam)
* [Play on Itch.io](https://catto05.itch.io/life-of-kengah)
