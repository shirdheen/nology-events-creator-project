export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  // Accepts a single parameter container, which is expected to be a HTMLElement (e.g., <div>)
  // Returns an array of all focusable elements inside the container
  const focusableSelectors = [
    "a[href]", // Anchor tags with a valid link
    "button:not([disabled])", // Buttons that are not diasabled
    "textarea:not([disabled])", // Interactive form elements
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])', // Any custom-focusable elements, excluding those intentionally removed from tab order
  ]; // Array holdss CSS selectors that match commonly focusable elementss

  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors.join(",")) // Searches inside the container for all elements matching any of the selectors
    // querySelectorAll returns a NodeList, so we need to use .from() to turn it into an actual array
  ).filter(
    // Removes elements that have disable attribute or elements that are typically hidden from screen-readers
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
  ); // Final array only contains visible, usable, interactive elements
}
