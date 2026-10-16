import Clarity from "@microsoft/clarity";

/**
 * Starts Microsoft Clarity (session recordings + heatmaps) in production builds
 * when VITE_CLARITY_PROJECT_ID is set. Dev sessions are skipped so local testing
 * doesn't show up in the dashboard.
 */
export const initAnalytics = () => {
  const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
  if (!import.meta.env.PROD || !projectId) return;
  Clarity.init(projectId);
};
