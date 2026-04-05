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

function normalizeCode(code) {
  if (!code) return "";

  if (code.startsWith("Key")) return code.slice(3).toLowerCase();
  if (code.startsWith("Digit")) return code.slice(5).toLowerCase();
  if (code.startsWith("Numpad")) {
    const suffix = code.slice(6);

    if (/^\d$/.test(suffix)) return suffix;
    if (suffix === "Add") return "+";
    if (suffix === "Subtract") return "-";
    if (suffix === "Decimal") return ".";
    if (suffix === "Enter") return "enter";
  }

  if (code === "Space") return "space";
  if (code === "Enter") return "enter";
  if (code === "Escape") return "escape";
  if (code === "Minus") return "-";
  if (code === "Equal") return "=";

  return code.toLowerCase();
}

export function formatShortcutLabel(shortcut) {
  const value = normalizeShortcut(shortcut);

  if (!value) return "غير محدد";
  if (SPECIAL_SHORTCUT_LABELS[value]) return SPECIAL_SHORTCUT_LABELS[value];
  if (value.length === 1) return value.toUpperCase();

  return value;
}

export function shouldIgnoreShortcutEvent(event) {
  const target = event.target;

  if (!target) return false;

  if (target.isContentEditable) return true;

  const tagName = target.tagName?.toUpperCase();
  return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
}

export function eventMatchesShortcut(event, shortcut) {
  const normalizedShortcut = normalizeShortcut(shortcut);
  const normalizedKey = normalizeShortcut(event.key);
  const normalizedCode = normalizeCode(event.code);

  if (!normalizedShortcut) return false;

  if (normalizedShortcut === "space") {
    return normalizedCode === "space" || normalizedKey === "space";
  }

  if (normalizedShortcut === "enter") {
    return normalizedCode === "enter" || normalizedKey === "enter";
  }

  if (normalizedShortcut === "escape" || normalizedShortcut === "esc") {
    return (
      normalizedCode === "escape" ||
      normalizedKey === "escape" ||
      normalizedKey === "esc"
    );
  }

  if (normalizedShortcut === "+") {
    return normalizedKey === "+" || normalizedKey === "=" || normalizedCode === "+";
  }

  if (normalizedShortcut === "-") {
    return normalizedKey === "-" || normalizedCode === "-";
  }

  if (normalizedShortcut.length === 1) {
    return normalizedKey === normalizedShortcut || normalizedCode === normalizedShortcut;
  }

  return normalizedKey === normalizedShortcut;
}
