export const avatars = [
  "https://i.pinimg.com/736x/6c/74/10/6c74100c2039f9352bfc2bcbb766d813.jpg",
  "https://tr.rbxcdn.com/180DAY-596e34a607016d245c74aa2976662af6/420/420/Hat/Webp/noFilter",
  "https://tr.rbxcdn.com/b26e419134c49a0f6c2bbfc24aaf9c8a/420/420/Hat/Png",
  "https://tr.rbxcdn.com/180DAY-f98adbee32f29755aa3a0f09a35d71df/420/420/Hat/Png/noFilter",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Hnnmn8d6CCWP0eYNnRxZwl6GfkbO6hfwRg&s",
];

export const getRandomAvatar = () => {
  const index = Math.floor(Math.random() * avatars.length);
  return avatars[index];
};

export async function isValidImageUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" }); // HEAD evita baixar o conteúdo inteiro
    const contentType = res.headers.get("Content-Type") || "";

    return res.ok && contentType.startsWith("image/");
  } catch (err) {
    console.log(err);
    return false;
  }
}
