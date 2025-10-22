# Steam Profile Widget for Scriptable

A sleek and informative iOS widget, built for the [Scriptable](https://scriptable.app/) app, that displays your Steam profile's vital statistics right on your Home Screen.

Never miss a beat with your gaming friends or keep a quick eye on your own Steam account with this elegant and data-rich widget.

![Widget Preview](https://raw.githubusercontent.com/SolsticeLeaf/Scriptable-Steam-Widget/refs/heads/master/.github/images/in_game.jpg?raw=true)

## 🖼️ Images

<details>
<summary><b>User offline</b></summary>

![Offline](https://raw.githubusercontent.com/SolsticeLeaf/Scriptable-Steam-Widget/refs/heads/master/.github/images/offline.jpg?raw=true)

</details>

<details>
<summary><b>User online</b></summary>

![Online](https://raw.githubusercontent.com/SolsticeLeaf/Scriptable-Steam-Widget/refs/heads/master/.github/images/online.jpg?raw=true)

</details>

<details>
<summary><b>User afk</b></summary>

![Away](https://raw.githubusercontent.com/SolsticeLeaf/Scriptable-Steam-Widget/refs/heads/master/.github/images/away.jpg?raw=true)

</details>

<details>
<summary><b>User playing game</b></summary>

![In Game](https://raw.githubusercontent.com/SolsticeLeaf/Scriptable-Steam-Widget/refs/heads/master/.github/images/in_game.jpg?raw=true)

</details>

## ✨ Features

This widget fetches and beautifully presents the following information from a public Steam profile:

- **Profile Identity:** User's avatar and profile frame.
- **Visual Flair:** The background image from their mini-profile.
- **Current Status:** Online, Offline, Away, or In-Game.
- **Last Logoff:** The last time the user was online.
- **Gaming Stats:** Total number of games owned and achievements unlocked.
- **Current Activity:** If the user is "In-Game," the widget will display which game they are currently playing.

## 🚀 Installation

### Prerequisites

1.  **Scriptable App:** You must have the [Scriptable App](https://apps.apple.com/us/app/scriptable/id1405459188) installed on your iOS device.
2.  **Steam Web API Key:** The widget requires a free API key from Steam.
    - Get your key here: [https://steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey)
    - Your Steam profile must be public (or the specific details you wish to show must be public) for the data to be accessible.

### Setup Steps

1.  **Get the Code:** Copy the raw source code from the [widget.js](https://raw.githubusercontent.com/SolsticeLeaf/Scriptable-Steam-Widget/refs/heads/master/widget.js) file in this repository.
2.  **Open Scriptable:** Tap the `+` icon in the top-right corner of the Scriptable app to create a new script.
3.  **Paste the Code:** Replace the default code with the code you copied.
4.  **Configure the Script:**
    - Open script code.
    - You need to provide two pieces of information in the following lines:
      ```javascript
      const API_KEY = 'YOUR_API_KEY'; // Replace with your Steam API Key
      const STEAM_ID = 'YOUR_STEAM_ID_64'; // Replace with your 64-bit Steam ID
      ```
      - **`STEAM_API_KEY`**: The API key you obtained from the prerequisites [https://steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey).
      - **`STEAM_ID_64`**: Your 17-digit SteamID64. You can find this easily on sites like [steamid.io](https://steamid.io/).
    - _Example:_
      ```javascript
      const API_KEY = '0DB815081051B5AD7180D02F78B8G712'; // Of course this is not valid key, don't try :)
      const STEAM_ID = '76561198207625457';
      ```
5.  **Save the Script:** Give your script a name (e.g., "Steam Widget") and save it.
6.  **Add to Home Screen:**
    - Run the script once inside the app to ensure it works.
    - On your Home Screen, enter "jiggle mode".
    - Tap the `+` button in the top-left corner.
    - Search for and select **"Scriptable"**.
    - Choose medium widget size.
    - Tap the widget on your Home Screen to edit it, and select the "Steam Widget" script.

## 🛠️ Configuration

The main configuration happens in the Scriptable parameter as described above. The widget is designed to work out-of-the-box. But you can edit the HEX color codes in the script to match your preferred theme.

## 📝 API Disclaimer

This widget is a third-party tool and is not affiliated with or endorsed by Valve Corporation. It uses the publicly available [Steam Web API](https://steamcommunity.com/dev). Data availability and accuracy depend on the user's privacy settings and the stability of the Steam API.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/SolsticeLeaf/Scriptable-Steam-Widget/issues) or open a pull request.

## 📜 License

This project is licensed under the **GNU License**. See the [LICENSE](https://raw.githubusercontent.com/SolsticeLeaf/Scriptable-Steam-Widget/refs/heads/master/LICENSE) file for details.

---

**Enjoy your new Steam widget!**

If you find this project helpful, please consider giving it a ⭐ on GitHub!
