const countOccurrences = (str, value) => {
  var regExp = new RegExp(value, "gi");
  return (str.match(regExp) || []).length;
};

const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (err) {
    console.error("[ERROR] isJsonString failure, return false", {
      error: JSON.stringify(err),
    });
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
    console.log("sanitizeString failure, return original thing", {
      error: JSON.stringify(err),
    });
    return thing;
  }
};

module.exports = { countOccurrences, isJsonString, sanitizeString };
