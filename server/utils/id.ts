export function generateProjectId(name: string) {
  const base = name.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || "PROJ";
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const ts = Date.now().toString().slice(-4);
  return `${base}-${rand}-${ts}`;
}
