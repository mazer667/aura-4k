self.onmessage = function(e) {
  const { xmlContent, consoleKey } = e.data;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, "text/xml");
    const games = [];
    const gameElements = doc.querySelectorAll("game");
    gameElements.forEach((gameEl) => {
      const enabled = gameEl.querySelector("enabled")?.textContent?.toLowerCase();
      if (enabled !== "yes" && enabled !== "true" && enabled !== "1") return;
      const title = gameEl.querySelector("title")?.textContent || "";
      const rom = gameEl.querySelector("rom")?.textContent || "";
      const cloneOf = gameEl.querySelector("cloneof")?.textContent || "";
      const driver = gameEl.querySelector("driver")?.getAttribute("status") || "good";
      if (!rom) return;
      const genreEl = gameEl.querySelector("category, genre");
      const genre = genreEl?.textContent || genreEl?.getAttribute("name") || "";
      const yearEl = gameEl.querySelector("year");
      const year = yearEl?.textContent || "";
      const publisherEl = gameEl.querySelector("manufacturer, publisher, company");
      const publisher = publisherEl?.textContent || "";
      const playersEl = gameEl.querySelector("players");
      const playersNum = playersEl ? parseInt(playersEl.textContent) || null : null;
      const resEl = gameEl.querySelector("res, resolution");
      const resolution = resEl?.textContent || "";
      games.push({
        title,
        rom,
        short: title.length > 18 ? title.substring(0, 16) + "\u2026" : title,
        console: consoleKey,
        genre,
        year,
        pub: publisher,
        playersNum,
        playersRange: null,
        isClone: !!cloneOf,
        driver,
        resolution
      });
    });
    self.postMessage({ success: true, games, count: games.length });
  } catch (error) {
    self.postMessage({ success: false, error: error instanceof Error ? error.message : String(error) });
  }
};
