// Load environment variables before any module reads configuration. This is
// important because email and CORS settings are evaluated during import time.
import "dotenv/config";

const defaultFrontendUrl = "http://localhost:5173";

// FRONTEND_URL may contain multiple comma-separated origins for deployments
// that serve the app from more than one trusted frontend.
const configuredFrontendUrls = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

const validateFrontendUrl = (value: string): string => {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(value);
  } catch {
    // Fail during startup instead of sending emails with a malformed link.
    throw new Error(`Invalid FRONTEND_URL: ${value}`);
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    // Verification and reset links must point to a web application, not an
    // arbitrary protocol such as file:, javascript:, or a custom scheme.
    throw new Error(`FRONTEND_URL must use http or https: ${value}`);
  }

  // Remove a trailing slash so callers can safely append application routes.
  return parsedUrl.toString().replace(/\/$/, "");
};

// Local development remains usable without a FRONTEND_URL, while production
// deployments can provide their public frontend origin through the environment.
export const allowedFrontendUrls = (
  configuredFrontendUrls.length > 0
    ? configuredFrontendUrls
    : [defaultFrontendUrl]
).map(validateFrontendUrl);

// Email links use the primary configured frontend; all configured URLs remain
// available above for CORS validation.
export const frontendUrl = allowedFrontendUrls[0];
