const podcastXmlParser = require("podcast-xml-parser");

const getFeedMetaData = async (url) => {
  const feed = await podcastXmlParser(new URL(url), { itunes: true });
  return feed;
};

module.exports = getFeedMetaData;
