
# 🎬 IMDb Movie Scraper

A robust Node.js web scraper using Puppeteer that extracts detailed movie information from [IMDb](https://www.imdb.com), based on dynamic genre input and customizable pagination. Outputs are generated in both JSON and CSV formats.

---

## 📌 Features with Bonus points

- ✅ **Data Extraction Accuracy**  
  Extracts key movie details including:
  - Title  
  - Release Year  
  - IMDb Rating  
  - Plot Summary  
  - Director(s)  
  - Cast (Stars)  
  - IMDb URL

- ✅ **Pagination Handling**  
  Dynamically scrapes a number of movies based on the `--pages` input (`pages × 10`), efficiently traversing multiple IMDb result pages without duplication or omission.

- ✅ **Selector Robustness**  
  Selectors are built to tolerate slight DOM changes and fallback conditions, ensuring consistent scraping even with layout variations.

- ✅ **Asynchronous Execution**  
  Uses `async/await` and a sequential scraping strategy to maintain performance and browser stability during deep page traversal.

- ✅ **Input Flexibility**  
  Users can specify genre or keyword, and desired movie count via CLI parameters.

- ✅ **Error Handling**  
  Comprehensive try-catch blocks and descriptive logging handle network issues, selector failures, or missing fields gracefully.

- ✅ **Code Modularity**  
  Logical separation into reusable utility files like `logger.js` and `storage.js`, keeping scraping, logging, and data writing responsibilities clean and organized.

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/imdb-scraper.git
cd imdb-scraper
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Scraper

```bash
node scraper.js --keyword <genre> --pages <number>
```

#### Example

```bash
node scraper.js --keyword action --pages 1
```

> This will scrape the top 10 movies from the *Action* genre.

---

## 🧾 Output

Scraped data will be stored in the `data/` directory in two formats:

- `data/movies.json` → JSON format  
- `data/movies.csv` → CSV format

### Example Movie Entry

```json
{
  "title": "The Dark Knight",
  "releaseYear": "2008",
  "imdbRating": "9.0",
  "plotSummary": "When the menace known as the Joker wreaks havoc...",
  "url": "https://www.imdb.com/title/tt0468569/",
  "director": "Christopher Nolan",
  "caste": "Christian Bale, Heath Ledger, Aaron Eckhart"
}
```

---

## 🧰 Tech Stack

| Tool          | Used For                                                   |
|---------------|------------------------------------------------------------|
| **Node.js**   | Server-side environment for running JavaScript             |
| **Puppeteer** | Headless browser automation to navigate and scrape IMDb    |
| **yargs**     | CLI argument parsing (`--keyword`, `--pages`)              |
| **fs**        | Writing output files (JSON and CSV)                        |
| **logger.js** | Centralized logging with status indicators and errors      |
| **storage.js**| Data writing utility (JSON/CSV) using reusable functions   |

---

## 📁 Project Structure

```
.
├── scraper.js          # Main scraping script
├── utils/
│   ├── logger.js       # Logging utility
│   └── storage.js      # Data writing utility (JSON/CSV)
├── data/               # Output files directory
├── package.json
└── README.md
```

---

## 🏆 Bonus Points — Implemented

### ✅ 1. Error Handling and Logging
- All navigation, selector, and field access operations are wrapped in try-catch blocks.
- Errors are logged using a centralized logger system.

### ✅ 2. Asynchronous or Multiprocessing Programming
- Script uses `async/await` for non-blocking scraping.
- Efficient scraping across multiple IMDb pages.

### ✅ 3. User Input
- Accepts `--keyword` and `--pages` via CLI using `yargs`.
- Easily extendable for config files or prompts.

---

## 📧 Contact

For feedback, support, or contributions:  
📬 [roshniraikwar97@gmail.com]

---

