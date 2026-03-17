// Claude 2x Usage Widget
// by skill · for iOS Scriptable
// Promo: March 13–27, 2026
// 2x on weekdays OUTSIDE 8AM–2PM ET (5–11AM PT)
// 2x ALL DAY on weekends

// ─── CONFIG ───────────────────────────────────────────
const PROMO_END = new Date("2026-03-28T00:00:00-05:00"); // March 27 end of day ET

// Peak window in ET hours (24h)
const PEAK_START_ET = 8;  // 8 AM ET
const PEAK_END_ET   = 14; // 2 PM ET

// Colors
const COLOR_BG_ACTIVE   = new LinearGradient();
COLOR_BG_ACTIVE.locations = [0, 1];
COLOR_BG_ACTIVE.colors = [new Color("#0f0c29"), new Color("#302b63")];

const COLOR_BG_PEAK = new LinearGradient();
COLOR_BG_PEAK.locations = [0, 1];
COLOR_BG_PEAK.colors = [new Color("#1a1a2e"), new Color("#16213e")];

const COLOR_BG_EXPIRED = new LinearGradient();
COLOR_BG_EXPIRED.locations = [0, 1];
COLOR_BG_EXPIRED.colors = [new Color("#1a1a1a"), new Color("#2d2d2d")];

const COLOR_ACCENT  = new Color("#cc785c"); // Claude orange-ish
const COLOR_WHITE   = new Color("#ffffff");
const COLOR_DIM     = new Color("#aaaaaa");
const COLOR_GREEN   = new Color("#4ade80");
const COLOR_YELLOW  = new Color("#facc15");
const COLOR_GRAY    = new Color("#666666");
// ──────────────────────────────────────────────────────

function getETHour(date) {
  // ET = UTC-5 (EST) or UTC-4 (EDT)
  // Use Intl to correctly resolve ET including DST
  const etString = date.toLocaleString("en-US", { timeZone: "America/New_York", hour: "numeric", hour12: false });
  return parseInt(etString, 10);
}

function isWeekend(date) {
  // Day of week in ET
  const day = parseInt(
    date.toLocaleString("en-US", { timeZone: "America/New_York", weekday: "short" })
      .replace("Sun", "0").replace("Mon", "1").replace("Tue", "2")
      .replace("Wed", "3").replace("Thu", "4").replace("Fri", "5").replace("Sat", "6"),
    10
  );
  // Simpler: use numeric
  const etDay = new Date(date.toLocaleString("en-US", { timeZone: "America/New_York" })).getDay();
  return etDay === 0 || etDay === 6;
}

function getStatus(now) {
  if (now >= PROMO_END) return "expired";
  if (isWeekend(now)) return "active";
  const etHour = getETHour(now);
  if (etHour >= PEAK_START_ET && etHour < PEAK_END_ET) return "peak";
  return "active";
}

function timeUntilNextWindow(now) {
  // Returns ms until next 2x window starts
  // If we're in peak, next window is at 2PM ET today
  const etHour = getETHour(now);
  if (!isWeekend(now) && etHour >= PEAK_START_ET && etHour < PEAK_END_ET) {
    // Next 2x starts at PEAK_END_ET
    const next = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    next.setHours(PEAK_END_ET, 0, 0, 0);
    // Convert back — approximate offset
    const diff = next - new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    return diff;
  }
  return 0;
}

function formatCountdown(ms) {
  if (ms <= 0) return "now";
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function daysUntilExpiry(now) {
  const diff = PROMO_END - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ─── BUILD WIDGET ──────────────────────────────────────
async function createWidget() {
  const now = new Date();
  const status = getStatus(now);

  const widget = new ListWidget();
  widget.setPadding(14, 16, 14, 16);

  // Refresh every 5 minutes
  const nextRefresh = new Date(now.getTime() + 5 * 60 * 1000);
  widget.refreshAfterDate = nextRefresh;

  // Background
  if (status === "active") {
    widget.backgroundGradient = COLOR_BG_ACTIVE;
  } else if (status === "peak") {
    widget.backgroundGradient = COLOR_BG_PEAK;
  } else {
    widget.backgroundGradient = COLOR_BG_EXPIRED;
  }

  // Open Claude when tapped
  widget.url = "https://claude.ai";

  if (status === "expired") {
    // ── EXPIRED STATE ──
    const emoji = widget.addText("💤");
    emoji.font = Font.systemFont(28);
    emoji.centerAlignText();

    widget.addSpacer(6);

    const title = widget.addText("Promo Ended");
    title.font = Font.boldSystemFont(15);
    title.textColor = COLOR_DIM;
    title.centerAlignText();

    widget.addSpacer(4);

    const sub = widget.addText("Back to normal limits");
    sub.font = Font.systemFont(11);
    sub.textColor = COLOR_GRAY;
    sub.centerAlignText();

  } else if (status === "active") {
    // ── ACTIVE / 2X STATE ──

    // Top badge row
    const badgeStack = widget.addStack();
    badgeStack.layoutHorizontally();
    badgeStack.centerAlignContent();

    const badgeText = badgeStack.addText("2×");
    badgeText.font = Font.boldSystemFont(36);
    badgeText.textColor = COLOR_GREEN;
    badgeStack.addSpacer(8);

    const labelStack = badgeStack.addStack();
    labelStack.layoutVertically();
    const labelTop = labelStack.addText("USAGE");
    labelTop.font = Font.boldSystemFont(11);
    labelTop.textColor = COLOR_GREEN;
    const labelBot = labelStack.addText("ACTIVE");
    labelBot.font = Font.boldSystemFont(11);
    labelBot.textColor = COLOR_GREEN;

    widget.addSpacer(8);

    // Fun message
    const msgs = [
      "Time to cook. 🍳",
      "Ship something. 🚀",
      "Go build. ⚡",
      "Double tokens, no cap. 🔥",
      "Max out. Now. 💪",
      "The window is open. 🪟",
    ];
    const msg = msgs[new Date().getMinutes() % msgs.length];
    const funText = widget.addText(msg);
    funText.font = Font.mediumSystemFont(13);
    funText.textColor = COLOR_WHITE;
    funText.minimumScaleFactor = 0.7;

    widget.addSpacer(6);

    // Expiry countdown
    const days = daysUntilExpiry(now);
    const expiryRow = widget.addStack();
    expiryRow.layoutHorizontally();
    expiryRow.centerAlignContent();

    const dot = expiryRow.addText("●");
    dot.font = Font.systemFont(8);
    dot.textColor = COLOR_YELLOW;
    expiryRow.addSpacer(4);

    const expires = expiryRow.addText(
      days === 1 ? "Ends tomorrow" : `Ends in ${days} days`
    );
    expires.font = Font.systemFont(10);
    expires.textColor = COLOR_YELLOW;

  } else {
    // ── PEAK (normal limits) STATE ──

    const emojiText = widget.addText("⏳");
    emojiText.font = Font.systemFont(28);
    emojiText.centerAlignText();

    widget.addSpacer(4);

    const peakLabel = widget.addText("Peak Hours");
    peakLabel.font = Font.boldSystemFont(14);
    peakLabel.textColor = COLOR_DIM;
    peakLabel.centerAlignText();

    widget.addSpacer(4);

    const normalLabel = widget.addText("Normal limits now");
    normalLabel.font = Font.systemFont(11);
    normalLabel.textColor = COLOR_GRAY;
    normalLabel.centerAlignText();

    widget.addSpacer(6);

    // Show when 2x resumes
    const msUntil = timeUntilNextWindow(now);
    const countdownStr = formatCountdown(msUntil);
    const resumeRow = widget.addStack();
    resumeRow.layoutHorizontally();
    resumeRow.centerAlignContent();

    const resumeLabel = resumeRow.addText(`2× resumes in ${countdownStr}`);
    resumeLabel.font = Font.mediumSystemFont(11);
    resumeLabel.textColor = COLOR_ACCENT;
    resumeLabel.centerAlignText();
  }

  return widget;
}

// ─── RUN ──────────────────────────────────────────────
const widget = await createWidget();

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  // Preview in app — try small first, it fits best
  await widget.presentSmall();
}

Script.complete()