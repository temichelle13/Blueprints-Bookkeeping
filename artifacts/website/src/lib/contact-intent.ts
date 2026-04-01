export const BOOKKEEPER_INTENT = "bookkeeper-intake";
export const LEGACY_BOOKKEEPER_INTENT = "bookkeeper";

const BOOKKEEPER_INTENT_VALUES = new Set([
  BOOKKEEPER_INTENT,
  LEGACY_BOOKKEEPER_INTENT,
]);

export function isBookkeeperIntentParam(intent: string | null): boolean {
  if (!intent) {
    return false;
  }

  return BOOKKEEPER_INTENT_VALUES.has(intent);
}
