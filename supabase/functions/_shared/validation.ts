export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isIntegerWithinRange(
  value: unknown,
  minimumValue: number,
  maximumValue: number,
): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= minimumValue &&
    value <= maximumValue
  );
}
