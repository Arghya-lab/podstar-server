export default function removeTrailingSlash(url: string) {
  // Check if the last character of the URL is a slash '/'
  if (url.endsWith("/")) {
    // Remove the last character (slash) using slice
    return url.slice(0, -1);
  }
  // If the URL doesn't end with a slash, return it unchanged
  return url;
}
