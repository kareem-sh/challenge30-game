const SPECIAL_SHORTCUT_LABELS = {
  space: "Space",
  enter: "Enter",
  escape: "Esc",
  esc: "Esc",
  tab: "Tab",
  shift: "Shift",
  backspace: "Backspace",
};

export function normalizeShortcut(shortcut) {
  if (shortcut === null || shortcut === undefined) return "";

  const value = String(shortcut).trim().toLowerCase();

  if (value === " ") return "space";
  if (value === "spacebar") return "space";

  return value;
}

export function formatShortcutLabel(shortcut) {
  const value = normalizeShortcut(shortcut);

  if (!value) return "غير محدد";
  if (SPECIAL_SHORTCUT_LABELS[value]) return SPECIAL_SHORTCUT_LABELS[value];
  if (value.length === 1) return value.toUpperCase();

  return value;
}

export function eventMatchesShortcut(event, shortcut) {
  const normalizedShortcut = normalizeShortcut(shortcut);
  const normalizedKey = normalizeShortcut(event.key);

  if (!normalizedShortcut) return false;

  if (normalizedShortcut === "space") {
    return event.code === "Space" || normalizedKey === "space";
  }

  if (normalizedShortcut === "enter") {
    return event.key === "Enter" || normalizedKey === "enter";
  }

  if (normalizedShortcut === "escape" || normalizedShortcut === "esc") {
    return event.key === "Escape" || normalizedKey === "escape" || normalizedKey === "esc";
  }

  if (normalizedShortcut === "+") {
    return normalizedKey === "+" || normalizedKey === "=";
  }

  return normalizedKey === normalizedShortcut;
}
