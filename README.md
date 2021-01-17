# SqueezeCompass

Inspiration:  
https://www.youtube.com/watch?v=c1JKV0yv9qw  
https://www.highshortinterest.com/  


# SCRAPER
## Project setup
1. Navigate to the `scraper` directory.
2. Create a virtual environment with `python3 -m venv .env`.
3. Activate it with `source .env/bin/activate`.
4. Install dependencies inside the virtual environment with `pip install -r requirements.txt`.
5. Run the scraper with `python3 src/main.py`.

# TODO:
symbol_fetcher ->
data_scraper   ->
database

## Data

### Source of S&P500 symbols
"S&P 500 constituents are rebalanced on a quarterly basis on the third Friday of March, June, September and December"  
The last time the s&p500 constituents json was refreshed is stored and if one of the above fridays have passed since, the data is pulled again. 

The program will try to fetch a JSON file of the constituents of the S&P 500 using the 
`SP500_CONSTITUENTS_URL` configuration property as defined in `conf.py`.

Should this datasource be unavailable, the fallback `/data/s&p500.json` will be used instead.


### Scraping

All requests receive a random UserAgent string by having their headers set to `conf.random_header()`.

---

# WEB

1. Created a new Angular 11 app by running `ng new web` from the project's root directory.
   Enabled strict type checking, added Angular routing, and picked SCSS as the stylesheet format.
2.
3.
4.

Serve from the `/web` directory with `ng serve`

Build for hosting on GitHub pages with `ng build --prod --output-path dist --base-href /SqueezeCompass/`

