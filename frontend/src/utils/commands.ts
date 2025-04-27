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
    "/hm": {
      isSystem: false,
      response: "https://media1.tenor.com/m/Gl8Km8aoBT0AAAAd/monkey-looking-sus-sus-monkey.gif",
    },
    "/house": {
      isSystem: false,
      response: "https://media.tenor.com/Q8KG0-6aTU0AAAAM/house-md-dr-house.gif",
    },
    "/beijo": {
      isSystem: false,
      response: "https://media.tenor.com/HRN4DnIh3AQAAAAj/kiss-love.gif",
    },
  };

  // Adiciona o comando /comandos dinamicamente
  const allCommands = Object.keys(gifs).join(" ");
  gifs["/comandos"] = {
    isSystem: true,
    response: allCommands,
  };

  if (localMsg in gifs) {
    const { isSystem, response } = gifs[localMsg];
    return [isSystem, response];
  } else {
    return [false, localMsg];
  }
}