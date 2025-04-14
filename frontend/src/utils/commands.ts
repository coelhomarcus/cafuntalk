export function commands(localMsg: string) {
  const gifs: Record<string, string> = {
    "/oi": "https://media1.tenor.com/m/okxvhyfjFiIAAAAd/hi-babybeans.gif",
    "/oi2": "https://media1.tenor.com/m/aCZk1Smf0ekAAAAd/hello-chat-grand-blue.gif",
    "/danca": "https://media1.tenor.com/m/itoZJd9WL_4AAAAd/epico.gif",
    "/danca2": "https://media1.tenor.com/m/VWYSQ2ZGdDwAAAAd/osaka-dance.gif",
    "/hm": "https://media1.tenor.com/m/Gl8Km8aoBT0AAAAd/monkey-looking-sus-sus-monkey.gif",
    "/cj": "https://media1.tenor.com/m/OJ5PjAaKcdEAAAAC/minecraft-minecraft-movie.gif",
    "/house": "https://i.pinimg.com/736x/60/a2/1f/60a21f6d5debf2eae7b39b84802b0d6f.jpg",
    "/cansei": "https://i.gifer.com/11th.gif",
    "/lendo": "https://i.gifer.com/9Utr.gif",
    "/xerin": "https://media.tenor.com/HRN4DnIh3AQAAAAj/kiss-love.gif",

    "/comandos": "/oi /oi2 /danca /danca2 /hm /cj /house /cansei /lendo /xerin",
  };

  return gifs[localMsg] || localMsg;
}
