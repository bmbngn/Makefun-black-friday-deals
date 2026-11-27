# Bargain Friday — Black Friday Deal Finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/bmbngn/Makefun-black-friday-deals/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/bmbngn/Makefun-black-friday-deals/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

Bargain Friday is a deal finder of real, verified Black Friday and Cyber Monday deals — 37 deals across Electronics, Home & kitchen, Toys & games and Fashion, each with store link, sale price, usual price, discount and check time, researched live on Black Friday. It was built for make.fun's ["Build the best real Black Friday deal finder" bounty](https://make.fun/bounty/black-friday-deal-finder-01). It runs on a desktop and on a phone.

## How to run it

The site is plain static files under `app/` with no build step. Serve `app/` with any static HTTP server, for example:

```sh
npx serve app
```

then open http://localhost:3000. `app/index.html` is the entry point; everything the site loads is a file under `app/`, and it makes no network requests.
