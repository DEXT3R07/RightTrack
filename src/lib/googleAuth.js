const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let initialized = false;
let hiddenContainer = null;

// Sets up Google Identity Services once, with a callback that fires
// whenever the person completes sign-in, from any button on the page.
// Also renders Google's real button into a hidden off-screen container —
// we trigger a click on that instead of relying on the One Tap prompt,
// which browsers frequently suppress silently with no error at all.
export function initGoogleSignIn(onCredential) {
  if (initialized || !window.google || !CLIENT_ID) return;
  window.google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: (response) => onCredential(response.credential),
    use_fedcm_for_prompt: true,
  });

  hiddenContainer = document.createElement("div");
  hiddenContainer.style.position = "fixed";
  hiddenContainer.style.top = "-9999px";
  hiddenContainer.style.left = "-9999px";
  document.body.appendChild(hiddenContainer);
  window.google.accounts.id.renderButton(hiddenContainer, { type: "standard" });

  initialized = true;
}

// Opens Google's account picker. Prefers clicking the real hidden button
// (reliable, always shows) and falls back to the One Tap prompt if the
// hidden button hasn't finished rendering yet.
export function promptGoogleSignIn() {
  if (!window.google || !CLIENT_ID) {
    console.error("Google Identity Services not loaded, or VITE_GOOGLE_CLIENT_ID is missing.");
    return false;
  }

  const realButton = hiddenContainer?.querySelector('div[role="button"]');
  if (realButton) {
    realButton.click();
    return true;
  }

  window.google.accounts.id.prompt();
  return true;
}