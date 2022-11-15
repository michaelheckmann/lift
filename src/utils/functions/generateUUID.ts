// https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
// The UUID prefix is generated based on the first 3 consonants of the database type
// If the word has three characters or less, the first 3 characters are used
export function generateUUID(prefix: string) {
  let d = new Date().getTime();
  const id = "xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //random number between 0 and 16
    r = (d + r) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  const number = Math.floor(Math.random() * 100).toString();
  return `${prefix}_${id}_${number}`;
}

// This is only relevant if the file is called from /scripts directory
if (process?.argv && process.argv.length > 1) {
  const prefix = process.argv[2];
  if (prefix) {
    console.log(generateUUID(prefix));
  }
}
