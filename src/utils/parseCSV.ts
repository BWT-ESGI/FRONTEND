export function parseCSV(text: string): any[] {
  const lines = text.trim().split("\n");
  if (lines.length === 0) return [];
  const header = lines[0].split(",").map((h) => h.trim());
  const data = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const obj: any = {};
    header.forEach((key, index) => {
      obj[key] = values[index] || "";
    });
    return obj;
  });
  return data;
}
