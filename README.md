# :compass:	SqueezeCompass

SqueezeCompass ranks, filters, and visualises S&P500 stocks based on metrics such as short interest.

It is available at: [sc.albertomh.com/SqueezeCompass](https://sc.albertomh.com/SqueezeCompass/)

[<img src="https://raw.githubusercontent.com/albertomh/SqueezeCompass/dist/assets/img/squeezecompass.gif" alt="SqueezeCompass" width="600">](https://sc.albertomh.com/SqueezeCompass/)

SqueezeCompass emerges in the wake of the `$GME` bubble of early 2021.  It is partly an attempt to delve into the 
fundamentals of a short squeeze, tracking indicators of one, as well as an opportunity to explore a couple of 
technologies I had been wanting to make something with.

Data derived from multiple sources including Morningstar and quarterly or annual reports. Inspired in part by [highshortinterest.com](https://www.highshortinterest.com/)

---

The project consists of two modules:
- A Python data fetcher that stores snapshots of the make up of the S&P500 and financial data for these constituents on a given day.
- An Angular application with which to display and browse this data.

---

## Data Fetcher

### Setup & configuration for development
The data fetcher requires Python 3.7+
1. Clone the project and navigate to the `data_fetcher` directory.
2. Create a virtual environment with `python3 -m venv .env`.
3. Activate it with `source .env/bin/activate`.
4. Install dependencies inside the virtual environment with `pip install -r requirements.txt`.
5. Run the data fetcher with `python3 src/main.py`.

`conf.py` can be edited to set configuration variables such as paths to data output directories. 


### Components
The data fetcher is composed of the following:
- `db.connection` Manages database connections and performs schema updates.
- `db.models` Uses the SQLAlchemy ORM to define SQLite table models. 
- `fetch.symbol_fetcher` Refreshes the constituents list when stale and is called as a service to inject symbols in other packages. 
- `fetch.data_fetcher` Given a list of symbols, fetches the required data, which is stored via the `db` package.


### Data

#### S&P500 symbols
S&P 500 constituents are rebalanced on a quarterly basis on the third Friday of March, June, September and December. 
Checks are in place such that every time the data fetcher runs, it verifies whether the existing list of constituents 
is stale and if so, assembles a fresh one.

#### Output
The data fetcher produces three streams of output:
1. Should the existing constituents file fail the initial freshness check, a new one is generated in 
   `conf.CONSTITUENTS_DATAFILE_DIR` (`data/constituents/` by default).
2. Then, as many rows as there are constituents are appended to the  `symbol_daily_snapshot` table in the SQLite database.  
3. Once the data fetcher finishes running, it produces a JSON snapshot of the collected data in `conf.JSON_SNAPSHOT_DIR` 
   (`data/snapshots/` by default).

Refer to the next section to see how the constituents and snapshot JSON files are ingested by the webapp.

---

## Web interface

SqueezeCompass' interface consists of an Angular 11 webapp with Bootstrap 5.

### Setup for development
Bear in mind that `npm` is favoured, strict type checking is enabled, the app uses default Angular 
routing, and SCSS is the preferred flavour for stylesheets.

1. Clone the project and run `npm i` from the `web/` directory. 
2. Run locally from this directory with `ng serve`.


### Data sources
The webapp ingests the data produced by the `data_fetched` module. 
It expects to find a copy of each relevant JSON datafile in `assets/constituents/` and `assets/snapshots/`.

In order to change the snapshot or constituents file, simply update the relevant paths in `environment.ts` and `environment.prod.ts`.

### Data structures
Three interfaces and an enum formalize the data structures fundamental to the application. These are:
- `Constituent` Stock metadata - used in the detail page for each equity.
- `ConstituentSnapshot` Financial data for a stock on a given day.
- `FilterQueryParams` Defines the keys for the query params that serialize the Constituents Grid's filter tray at a given moment.
- `FilterQueryParamValues` As above, for query param values.

### Angular components
**Visual chrome:** Navbar, footer, and homepage.  
**Data-driven:** Constituent grid, grid filter, and constituent detail page.  
The grid and detail page feature a data wrapper component to which data-fetching is delegated, only loading the child 
component when the JSON data has been received.


### Deployments
All necessary configuration is kept in `angular.json` and `package.json` instead of using Angular CLI flags. 
The existing config is intended for deployment to GitHub Pages.

Build a production-ready artefact with `npm run build`. Don't run `ng build --prod` directly since otherwise 
npm postbuild scripts will not run.   
The postbuild script calls `scripts/minify_json.py` on the JSON datafiles in the `dist` directory.

Originally built with Node 16. In order to build using Node 17+, the environment variable `NODE_OPTIONS=--openssl-legacy-provider` must be set.

The project used to be hosted on GitHub Pages, have since moved on to using Cloudflare Pages.
Use the following build configuration:  
- No framework preset.  
- Build command: `npm run build`.  
- Build output directory: `/dist`.  
- Root directory: `/web`.  

Environment variables:  

| Variable name | Value                     |
| ------------- | ------------------------- |
| NODE_VERSION  | 17.8.0                    |
| NODE_OPTIONS  | --openssl-legacy-provider |
