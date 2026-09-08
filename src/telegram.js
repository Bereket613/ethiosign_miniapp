const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : null;

export function initTelegram() {
  if (!tg) {
    return { inTelegram: false, user: null, colorScheme: "dark" };
  }
  try {
    tg.ready();
    tg.expand();
    tg.enableClosingConfirmation?.();
    try {
      tg.setHeaderColor("#ffffff");
      tg.setBackgroundColor("#f3f6fa");
    } catch {
      tg.setHeaderColor?.("bg_color");
      tg.setBackgroundColor?.("secondary_bg_color");
    }
  } catch {
    /* Telegram API unavailable */
  }
  return {
    inTelegram: true,
    user: tg.initDataUnsafe?.user ?? null,
    colorScheme: tg.colorScheme ?? "dark",
  };
}

export function isTelegram() {
  return Boolean(tg);
}

export function haptic(style = "light") {
  try {
    if (!tg?.HapticFeedback) return;
    if (["light", "medium", "heavy", "rigid", "soft"].includes(style)) {
      tg.HapticFeedback.impactOccurred(style);
    } else {
      tg.HapticFeedback.notificationOccurred(style);
    }
  } catch {
    /* ignore */
  }
}

let backButtonHandler = null;

export function showBackButton(onClick) {
  if (!tg?.BackButton) return;
  try {
    if (backButtonHandler) tg.BackButton.offClick(backButtonHandler);
    backButtonHandler = onClick;
    tg.BackButton.onClick(backButtonHandler);
    tg.BackButton.show();
  } catch {
    /* ignore */
  }
}

export function hideBackButton() {
  if (!tg?.BackButton) return;
  try {
    if (backButtonHandler) tg.BackButton.offClick(backButtonHandler);
    backButtonHandler = null;
    tg.BackButton.hide();
  } catch {
    /* ignore */
  }
}
