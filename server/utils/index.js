const countOccurrences = (str, value) => {
  var regExp = new RegExp(value, "gi");
  return (str.match(regExp) || []).length;
};

const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (err) {
    console.error("[ERROR] isJsonString failure", err);
    return false;
  }
  return true;
};

const sanitizeString = (thing) => {
  // Thing = can be valid json object or a string encoded json object
  try {
    // Looksrare contains invalid JSON (actually a .txt file) in their IPFS metadata and makes this fails everytime
    // Here is some regex to santize trailing commas out of arrays
    let sanitizedString = thing
      .replace(/(\r\n|\n|\r)/gm, "")
      // eslint-disable-next-line no-regex-spaces
      .replace(/(   |  )/gm, "");
    if (countOccurrences(sanitizedString, "},]") > 0) {
      sanitizedString = sanitizedString.replaceAll("},]", "}]");
    }
    return sanitizedString;
  } catch (err) {
    console.log("sanitizeString failure", err);
    return thing;
  }
};

const startsWith = (str, substr) =>
  typeof str === "string" && str.substring(0, substr.length) === substr;

const sanitizeIpfsUri = (uri) => {
  let [, sanitizedUri] = uri.split("ipfs://");
  sanitizedUri = sanitizedUri.replace("ipfs/", "");
  return `https://ipfs.io/ipfs/${sanitizedUri}`;
};

module.exports = {
  startsWith,
  countOccurrences,
  isJsonString,
  sanitizeString,
  sanitizeIpfsUri,
};
