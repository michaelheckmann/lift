export function handleNumberInput(value: string) {
  // If the user entered a comma, return "0"
  if (value === ",") return "0";
  // If the user entered more than one comma, remove all commas but the one closest to the middle of the string
  if (value.match(/,/g)?.length > 1) {
    const length = value.length;
    // Find all comma indizes
    const commaIndizes = [...value.matchAll(/,/g)].map((match) => match.index);
    const middleIndex = Math.floor(length / 2);
    // Find the comma index closest to the middle of the string
    const closestCommaIndex = commaIndizes.reduce((prev, curr) =>
      Math.abs(curr - middleIndex) < Math.abs(prev - middleIndex) ? curr : prev
    );
    // Remove all commas but the closest one
    value = value
      .split("")
      .map((number, i) => {
        if (!commaIndizes.includes(i) || i === closestCommaIndex) return number;
        return "";
      })
      .join("");
    return value;
  }
  // If the user entered a comma at the end, return the string without the comma at the end
  if (value.endsWith(",")) return value;
  // Replace all commas with dots
  value = value.replace(",", ".");
  // Parse the string as a float
  const parsed = parseFloat(value);
  // If the parsed value is not a number, return "0"
  if (isNaN(parsed)) return 0;
  // Replace all dots with commas and return the string
  return parsed.toString().replace(/\./g, ",");
}
