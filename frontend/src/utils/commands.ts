export function commands(localMsg: string) {
  const gifs: Record<string, string> = {
    "/no":
      "https://i.pinimg.com/originals/1e/db/f1/1edbf144909f2bbfcff412393422984c.gif",
    "/hehe": "https://i.gifer.com/6mh.gif",
    "/hide": "https://i.gifer.com/4A9v.gif",
    "/dance":
      "https://gifsec.com/wp-content/uploads/2022/10/anime-dance-gif-21.gif",
    "/house":
      "https://i.pinimg.com/736x/60/a2/1f/60a21f6d5debf2eae7b39b84802b0d6f.jpg",
  };

  return gifs[localMsg] || localMsg;
}
