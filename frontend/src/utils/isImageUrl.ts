export default function isImageUrl(text: string): boolean {
  try {
    const url = new URL(text);
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url.pathname);
  } catch {
    return false;
  }
}
