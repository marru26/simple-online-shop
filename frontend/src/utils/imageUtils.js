export const getImageUrl = (url) => {
  const defaultImage = "/placeholder.svg";
  if (!url) return defaultImage;
  if (url.startsWith("http")) return url;
  return `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}${url}`;
};