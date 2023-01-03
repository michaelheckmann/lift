export function handleNumberInput(value: string) {
  if (value === ",") return "0";
  // handle the case of mulitple commas
  if (value.match(/,/g)?.length > 1) {
    // remove all the commas expect for the one most closest to the middle of the string 'value'
    const length = value.length;
    const commaIndizes = [...value.matchAll(/,/g)].map((match) => match.index);
    const middleIndex = Math.floor(length / 2);
    const closestCommaIndex = commaIndizes.reduce((prev, curr) =>
      Math.abs(curr - middleIndex) < Math.abs(prev - middleIndex) ? curr : prev
    );
    value = value
      .split("")
      .map((number, i) => {
        if (!commaIndizes.includes(i) || i === closestCommaIndex) return number;
        return "";
      })
      .join("");
    return value;
  }
  // handle the case of a comma at the end (idicating a decimal)
  if (value.endsWith(",")) return value;
  value = value.replace(",", ".");
  const parsed = parseFloat(value);
  if (isNaN(parsed)) return 0;
  return parsed.toString().replace(/\./g, ",");
}
