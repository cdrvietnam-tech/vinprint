// Thumbnail is a document preview, never an additional document page.
export function cdrPreviewFiles(zip) {
  const pages = new Map();
  for (const file of zip.file(/(?:^|\/)(?:previews|thumbnails)\/page\d+\.(png|bmp|jpe?g)$/i)) {
    const number = Number(file.name.match(/page(\d+)\./i)[1]);
    if (number < 1) continue;
    if (!pages.has(number) || /^previews\//i.test(file.name)) pages.set(number, file);
  }
  const thumbnail = zip.file(/(?:^|\/)thumbnail\.(png|bmp|jpe?g)$/i)[0];
  const ordered=[...pages.entries()].sort(([a],[b])=>a-b);
  const primary = pages.get(1) || thumbnail || ordered[0]?.[1] || null;
  const primaryNumber=pages.has(1)?1:thumbnail?null:ordered[0]?.[0]||null;
  return { primary, primaryNumber, additional: ordered.filter(([n]) => n!==primaryNumber).map(([pageNumber, file]) => ({ pageNumber, file })) };
}
export function previewFormat(name) { return /\.bmp$/i.test(name) ? 'bmp' : /\.jpe?g$/i.test(name) ? 'jpg' : 'png'; }
export function previewMime(format) { return format === 'bmp' ? 'image/bmp' : format === 'jpg' ? 'image/jpeg' : 'image/png'; }
