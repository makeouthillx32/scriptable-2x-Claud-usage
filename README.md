# Claude 2x Usage Widget for Scriptable

A sleek and informative iOS widget, built for the [Scriptable](https://scriptable.app/) app, that displays whether Claude's double usage limits are currently active — right on your Home Screen.

Never miss your off-peak window again. Keep a quick eye on when you've got 2x tokens and make the most of every coding session.

![Widget Preview](https://raw.githubusercontent.com/makeouthillx32/scriptable-2x-Claud-usage/refs/heads/master/.github/images/in_game.jpg?raw=true)

## 🖼️ Images


## ✨ Features

This widget tracks Claude's off-peak double usage promotion and displays the following:

- **2x Active State:** Bold green badge with a fun rotating message when you're in the double usage window.
- **Peak Hours State:** Tells you you're in normal-limit territory and shows a live countdown to when 2x resumes.
- **Promotion Expired State:** Gracefully switches to an expired view after March 27, 2026 so it doesn't sit broken on your Home Screen.
- **Promo Countdown:** Shows how many days remain before the promotion ends.
- **Auto-refresh:** Updates every 5 minutes. Tapping the widget opens claude.ai.

## 🚀 Installation

### Prerequisites

1.  **Scriptable App:** You must have the [Scriptable App](https://apps.apple.com/us/app/scriptable/id1405459188) installed on your iOS device.
2.  No API key needed — this widget is fully self-contained.

### Setup Steps

1.  **Get the Code:** Copy the raw source code from the [widget.js](https://raw.githubusercontent.com/makeouthillx32/scriptable-2x-Claud-usage/refs/heads/master/widget.js) file in this repository.
2.  **Open Scriptable:** Tap the `+` icon in the top-right corner of the Scriptable app to create a new script.
3.  **Paste the Code:** Replace the default code with the code you copied.
4.  **Save the Script:** Give your script a name (e.g., "Claude 2x") and save it.
5.  **Add to Home Screen:**
    - Run the script once inside the app to ensure it works.
    - On your Home Screen, enter "jiggle mode".
    - Tap the `+` button in the top-left corner.
    - Search for and select **"Scriptable"**.
    - Choose **small** widget size.
    - Tap the widget on your Home Screen to edit it, and select the "Claude 2x" script.

## 🛠️ Configuration

The widget works out-of-the-box with no configuration required. If you want to tweak it:

- **Colors:** Edit the `COLOR_*` constants near the top of the script to match your preferred theme.
- **Messages:** Swap out the fun messages array in the `active` state with your own lines.
- **Time zone:** The peak window is calculated using `America/New_York` (ET) via `Intl` — DST is handled automatically.

## 📝 Promotion Details

- **Active:** March 13 – March 27, 2026
- **Off-peak (2x) on weekdays:** Outside 8 AM – 2 PM ET / 5 – 11 AM PT
- **Weekends:** 2x all day, every hour
- **Eligible plans:** Free, Pro, Max, and Team (Enterprise excluded)
- No opt-in needed — Anthropic applies it automatically

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/makeouthillx32/scriptable-2x-Claud-usage/issues) or open a pull request.

## 📜 License

This project is licensed under the **GNU License**. See the [LICENSE](https://raw.githubusercontent.com/makeouthillx32/scriptable-2x-Claud-usage/refs/heads/master/LICENSE) file for details.

---

**Enjoy your double tokens!**

If you find this project helpful, please consider giving it a ⭐ on GitHub!