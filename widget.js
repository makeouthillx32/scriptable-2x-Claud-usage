// Steam Account Widget for Scriptable
// Displays Steam account info: avatar, name, level, games count, online status, etc.
// Author: SolsticeLeaf
// Note: You need a Steam API Key from https://steamcommunity.com/dev/apikey
// Replace 'YOUR_API_KEY' and 'YOUR_STEAM_ID' with your actual values.
// Steam ID is the 64-bit ID (e.g., from steamid.io).

const API_KEY = 'YOUR_API_KEY'; // Replace with your Steam API Key
const STEAM_ID = 'YOUR_STEAM_ID_64'; // Replace with your 64-bit Steam ID

const BASE_IMAGE_URL = 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/';

// URLs for Steam API endpoints
const PLAYER_SUMMARY_URL = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${API_KEY}&steamids=${STEAM_ID}`;
const OWNED_GAMES_URL = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${STEAM_ID}&format=json&include_appinfo=false&include_played_free_games=true`;
const LEVEL_URL = `http://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${API_KEY}&steamid=${STEAM_ID}`;
const ANIMATED_AVATAR_URL = `https://api.steampowered.com/IPlayerService/GetAnimatedAvatar/v1/?key=${API_KEY}&steamid=${STEAM_ID}`;
const AVATAR_FRAME_URL = `https://api.steampowered.com/IPlayerService/GetAvatarFrame/v1/?key=${API_KEY}&steamid=${STEAM_ID}`;
const BG_URL = `https://api.steampowered.com/IPlayerService/GetMiniProfileBackground/v1/?key=${API_KEY}&steamid=${STEAM_ID}`;

// Function to fetch data from URL
async function fetchJSON(url) {
  const req = new Request(url);
  req.method = 'GET';
  return await req.loadJSON();
}

// Main function to build the widget
async function createWidget() {
  // Fetch base data
  const [summaryData, gamesData, levelData, animatedAvatarData, frameData, bgData] = await Promise.all([
    fetchJSON(PLAYER_SUMMARY_URL),
    fetchJSON(OWNED_GAMES_URL),
    fetchJSON(LEVEL_URL),
    fetchJSON(ANIMATED_AVATAR_URL),
    fetchJSON(AVATAR_FRAME_URL),
    fetchJSON(BG_URL),
  ]);

  const player = summaryData.response.players[0];
  const gamesCount = gamesData.response.game_count || 0;
  const level = levelData.response.player_level || 0;

  // Get appids for achievements
  const appids = gamesData.response.games ? gamesData.response.games.map((g) => g.appid) : [];

  // Achievements URL
  let achievementsUrl = `https://api.steampowered.com/IPlayerService/GetTopAchievementsForGames/v1/?key=${API_KEY}&steamid=${STEAM_ID}&language=en&max_achievements=10000000`;
  appids.forEach((id, i) => {
    achievementsUrl += `&appids[${i}]=${id}`;
  });

  const achievementsData = await fetchJSON(achievementsUrl);

  let totalAchievements = 0;
  if (achievementsData.response && achievementsData.response.games) {
    for (const game of achievementsData.response.games) {
      totalAchievements += 'achievements' in game ? game.total_achievements : 0;
    }
  }

  // Check if playing a game
  let isPlaying = !!player.gameextrainfo;
  let status = getOnlineStatus(player.personastate);
  let gameHeaderUrl = '';
  if (isPlaying) {
    const gameDetailsUrl = `https://store.steampowered.com/api/appdetails?appids=${player.gameid}`;
    const gameData = await fetchJSON(gameDetailsUrl);
    if (gameData[player.gameid] && gameData[player.gameid].success) {
      gameHeaderUrl = gameData[player.gameid].data.header_image;
    }
    status = `In Game`;
  }

  // Get avatar and frame URLs
  let avatarUrl = player.avatarfull; // Fallback to static from summary
  let frameUrl = '';
  if (animatedAvatarData.response && animatedAvatarData.response.avatar) {
    avatarUrl = BASE_IMAGE_URL + animatedAvatarData.response.avatar.image_large; // Use static large for compositing
  }
  if (frameData.response && frameData.response.avatar_frame) {
    frameUrl = BASE_IMAGE_URL + frameData.response.avatar_frame.image_large;
  }

  // Composite avatar with frame
  let avatarImage = await getFramedAvatar(avatarUrl, frameUrl);

  // Create widget
  let widget = new ListWidget();
  widget.setPadding(0, 0, 0, 0);

  // Set background
  let bgImage = null;
  if (bgData.response && bgData.response.profile_background && bgData.response.profile_background.image_large) {
    let bgUrl = BASE_IMAGE_URL + bgData.response.profile_background.image_large;
    bgImage = await loadImage(bgUrl);
  }
  if (bgImage) {
    widget.backgroundImage = bgImage;
  } else {
    // Fallback gradient
    let gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [new Color('#0F2027'), new Color('#2C5364')];
    widget.backgroundGradient = gradient;
  }

  // Darken entire widget if playing
  if (isPlaying) {
    widget.backgroundColor = new Color('#000000', 0.5);
  } else {
    widget.backgroundColor = new Color('#1A1A1A', 0.5); // Semi-transparent
  }

  // Content stack horizontal
  let contentStack = widget.addStack();
  contentStack.layoutHorizontally();

  // New left container with darkening and no external padding
  let leftContainer = contentStack.addStack();
  leftContainer.layoutVertically();
  leftContainer.cornerRadius = 20;
  leftContainer.backgroundColor = new Color('#000000', 0.5);
  leftContainer.setPadding(10, 10, 10, 10); // Internal padding for content

  // Info stack inside left container
  let infoStack = leftContainer;

  // Add avatar stack
  let avatarStack = infoStack.addStack();
  avatarStack.layoutHorizontally();

  let avatar = avatarStack.addImage(avatarImage);
  avatar.imageSize = new Size(60, 60);

  avatarStack.addSpacer(10);

  // Name and level stack
  let nameLevelStack = avatarStack.addStack();
  nameLevelStack.layoutVertically();

  // Name
  let nameText = nameLevelStack.addText(player.personaname);
  nameText.font = Font.boldSystemFont(18);
  nameText.textColor = Color.white();

  // Level
  let levelText = nameLevelStack.addText(`Level: ${level}`);
  levelText.font = Font.mediumSystemFont(14);
  levelText.textColor = getLevelColor(level);

  infoStack.addSpacer(10);

  // Status
  let statusText = infoStack.addText(`Status: ${status}`);
  statusText.font = Font.semiboldSystemFont(16);
  statusText.textColor = getStatusColor(player.personastate);

  infoStack.addSpacer(5);

  // Games
  let gamesText = infoStack.addText(`Games: ${gamesCount}`);
  gamesText.font = Font.mediumSystemFont(14);
  gamesText.textColor = Color.white();

  infoStack.addSpacer(5);

  // Achievements
  let achText = infoStack.addText(`Achievements: ${totalAchievements}`);
  achText.font = Font.mediumSystemFont(14);
  achText.textColor = Color.white();

  infoStack.addSpacer();

  if (player.personastate < 1) {
    // Last online
    let lastLogoff = new Date(player.lastlogoff * 1000).toLocaleString();
    let lastText = infoStack.addText(`Last online: ${lastLogoff}`);
    lastText.font = Font.lightSystemFont(12);
    lastText.textColor = new Color('#d2d2d2ff');
  }

  // Push to left when not playing
  if (!isPlaying) {
    contentStack.addSpacer();
  }

  // If playing, add game image on right
  if (isPlaying && gameHeaderUrl) {
    contentStack.addSpacer(8);

    let gameImgStack = contentStack.addStack();
    gameImgStack.setPadding(0, 0, 0, 0);
    gameImgStack.layoutVertically();
    gameImgStack.centerAlignContent(); // Center horizontally

    // Top spacer
    gameImgStack.addSpacer();

    let gameImage = await loadImage(gameHeaderUrl);
    if (gameImage) {
      let gameImg = gameImgStack.addImage(gameImage);
      gameImg.si;
      gameImg.cornerRadius = 5;
    }

    // Game name
    let isPlaying = !!player.gameextrainfo;
    if (isPlaying) {
      const gameDetailsUrl = `https://store.steampowered.com/api/appdetails?appids=${player.gameid}`;
      const gameData = await fetchJSON(gameDetailsUrl);
      if (gameData[player.gameid] && gameData[player.gameid].success) {
        let gameInfoStack = gameImgStack.addStack();
        gameInfoStack.setPadding(0, 0, 0, 0);
        gameInfoStack.backgroundColor = new Color('#000000', 0.5);
        gameInfoStack.cornerRadius = 5;
        gameInfoStack.layoutHorizontally();

        // Left spacer
        gameInfoStack.addSpacer();

        let gameNameText = gameInfoStack.addText(player.gameextrainfo);
        gameNameText.font = Font.mediumSystemFont(16);
        gameNameText.textColor = new Color('#3aea43ff');

        // Right spacer
        gameInfoStack.addSpacer();
      }
    }

    // Bottom spacer
    gameImgStack.addSpacer();

    contentStack.addSpacer(8);
  }

  return widget;
}

// Helper function to load image with error handling
async function loadImage(url) {
  try {
    let req = new Request(url);
    return await req.loadImage();
  } catch (e) {
    console.log(`Error loading image from ${url}: ${e}`);
    return null;
  }
}

// Function to composite avatar and frame
async function getFramedAvatar(avatarUrl, frameUrl) {
  let avatarImg = await loadImage(avatarUrl);
  if (!avatarImg) {
    return new Image(); // Empty
  }

  let ctx = new DrawContext();
  ctx.size = new Size(184, 184);
  ctx.opaque = false;

  ctx.drawImageInRect(avatarImg, new Rect(0, 0, 184, 184));

  if (frameUrl) {
    let frameImg = await loadImage(frameUrl);
    if (frameImg) {
      ctx.drawImageInRect(frameImg, new Rect(-13, -13, 210, 210));
    }
  }

  return ctx.getImage();
}

// Helper for online status
function getOnlineStatus(state) {
  const states = ['Offline', 'Online', 'Busy', 'Away', 'Snooze', 'Looking to Trade', 'Looking to Play'];
  return states[state] || 'Unknown';
}

function getStatusColor(state) {
  if (state === 1) return new Color('#3aea43ff'); // Online green
  if (state > 1) return new Color('#FFA000'); // Busy/Away orange
  return new Color('#d2d2d2ff'); // Offline
}

// Helper for level color (based on Steam level colors)
function getLevelColor(level) {
  const tier = Math.floor(level / 10);
  switch (tier) {
    case 0:
      return new Color('#B0C3D9'); // 0-9 gray
    case 1:
      return new Color('#EB4B4B'); // 10-19 red
    case 2:
      return new Color('#D4A53A'); // 20-29 orange
    case 3:
      return new Color('#EEDD82'); // 30-39 yellow
    case 4:
      return new Color('#23ee2dff'); // 40-49 green
    case 5:
      return new Color('#67C1F5'); // 50-59 blue
    case 6:
      return new Color('#855DC1'); // 60-69 purple
    default:
      return new Color('#EB4B4B'); // Higher levels
  }
}

// Scriptable setup
if (!config.runsInWidget) {
  let widget = await createWidget();
  await widget.presentMedium();
} else {
  let widget = await createWidget();
  Script.setWidget(widget);
}
Script.complete();
