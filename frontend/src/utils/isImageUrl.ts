export default function isImageUrl(text: string): boolean {
  return Boolean(text.match(/\.(jpeg|jpg|gif|png|webp)$/i));
}
