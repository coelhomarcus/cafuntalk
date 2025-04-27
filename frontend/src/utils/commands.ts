export function commands(localMsg: string): [boolean, string] {
  const gifs: Record<string, { isSystem: boolean; response: string }> = {
    "/oi": {
      isSystem: false,
      response: "https://media1.tenor.com/m/okxvhyfjFiIAAAAd/hi-babybeans.gif",
    },
    "/oi2": {
      isSystem: false,
      response: "https://media1.tenor.com/m/aCZk1Smf0ekAAAAd/hello-chat-grand-blue.gif",
    },
    "/danca": {
      isSystem: false,
      response: "https://media1.tenor.com/m/itoZJd9WL_4AAAAd/epico.gif",
    },
    "/danca2": {
      isSystem: false,
      response: "https://media1.tenor.com/m/VWYSQ2ZGdDwAAAAd/osaka-dance.gif",
    },
    "/hm": {
      isSystem: false,
      response: "https://media1.tenor.com/m/Gl8Km8aoBT0AAAAd/monkey-looking-sus-sus-monkey.gif",
    },
    "/cj": {
      isSystem: false,
      response: "https://media1.tenor.com/m/OJ5PjAaKcdEAAAAC/minecraft-minecraft-movie.gif",
    },
    "/house": {
      isSystem: false,
      response: "https://i.pinimg.com/736x/60/a2/1f/60a21f6d5debf2eae7b39b84802b0d6f.jpg",
    },
    "/cansei": {
      isSystem: false,
      response: "https://i.gifer.com/11th.gif",
    },
    "/lendo": {
      isSystem: false,
      response: "https://i.gifer.com/9Utr.gif",
    },
    "/xerin": {
      isSystem: false,
      response: "https://media.tenor.com/HRN4DnIh3AQAAAAj/kiss-love.gif",
    },
    "/comandos": {
      isSystem: true, // <- esse é do sistema!
      response: "/oi /oi2 /danca /danca2 /hm /cj /house /cansei /lendo /xerin",
    },
  };

  if (localMsg in gifs) {
    const { isSystem, response } = gifs[localMsg];
    return [isSystem, response];
  } else {
    return [false, localMsg];
  }
}
