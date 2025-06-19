const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { writeToJSON, writeToCSV } = require("./utils/storage");
const logger = require("./utils/logger");

const argv = yargs(hideBin(process.argv))
  .option("keyword", {
    alias: "k",
    type: "string",
    description: "Genre or keyword to search",
    demandOption: true,
  })
  .option("pages", {
    alias: "p",
    type: "number",
    default: 1,
    description: "Number of movies to scrape in multiples of 10 (e.g., 1 = 10 movies, 2 = 20)",
  })
  .help().argv;

(async () => {
  const { keyword, pages } = argv;
  const totalToScrape = pages * 10;
  const baseUrl = `https://www.imdb.com/search/title/?genres=${keyword}`;

  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  const allMovies = [];

  let scrapedCount = 0;
  let imdbPage = 1;

  while (scrapedCount < totalToScrape) {
    const start = (imdbPage - 1) * 50 + 1;
    const url = `${baseUrl}&start=${start}&explore=title_type,genres`;

    logger.info(`🌐 Navigating to IMDb page ${imdbPage} → ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForSelector(".ipc-metadata-list-summary-item");

    const moviesOnPage = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".ipc-metadata-list-summary-item"))
        .map(el => {
          const title = el.querySelector(".ipc-title__text")?.innerText || "";
          const link = el.querySelector("a.ipc-title-link-wrapper")?.href || "";
          const releaseYear = el.querySelector(".dli-title-metadata-item")?.innerText || "";
          const imdbRating =
            el.querySelector('[data-testid="ratingGroup--imdb-rating"] .ipc-rating-star--rating')
              ?.innerText.trim() || "";
          const plotSummary =
            el.querySelector(".ipc-html-content-inner-div")?.innerText.trim() || "";

          return { title, releaseYear, imdbRating, plotSummary, url: link };
        });
    });

// Add only the required number of movies from this page
    const remaining = totalToScrape - scrapedCount;
    const selectedMovies = moviesOnPage.slice(0, remaining);

    logger.info(`🟡 IMDb page ${imdbPage}: Fetched ${selectedMovies.length} movie(s)`);

//movie's detail page
    for (const movie of selectedMovies) {
      try {
        await page.goto(movie.url, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.waitForSelector("body");

        const details = await page.evaluate(() => {
          const getText = (label) => {
            const li = Array.from(document.querySelectorAll("li"))
              .find(el => el.innerText.startsWith(label));
            return li ? Array.from(li.querySelectorAll("a")).map(a => a.innerText).join(", ") : "";
          };

          return {
            director: getText("Director") || getText("Directors"),
            stars: getText("Stars"),
          };
        });

        movie.director = details.director;
        movie.caste = details.stars;
      } catch (err) {
        logger.error(`❌ Error for "${movie.title}": ${err.message}`);
        movie.director = "";
        movie.caste = "";
      }
    }

    allMovies.push(...selectedMovies);
    scrapedCount += selectedMovies.length;
    imdbPage++;
  }

  await browser.close();

  fs.mkdirSync("data", { recursive: true });
  await writeToJSON(allMovies, "data/movies.json");
  await writeToCSV(allMovies, "data/movies.csv");
  console.log(allMovies)
  logger.info(`✅ Done. Scraped total ${allMovies.length} movies.`);
})();
