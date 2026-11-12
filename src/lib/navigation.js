export function homeSection(id) {
  return window.location.protocol === "file:" ? `/?section=${encodeURIComponent(id)}` : `/#${id}`;
}
