![badge](https://img.shields.io/github/watchers/wdpedroborges/guitar-scales?style=social)
![badge](https://img.shields.io/github/stars/wdpedroborges/guitar-scales?style=social)
![badge](https://img.shields.io/github/license/wdpedroborges/guitar-scales)
![badge](https://img.shields.io/badge/powered%20by-vite-blue)
![badge](https://img.shields.io/badge/powered%20by-react.js-blue)
![badge](https://img.shields.io/badge/powered%20by-typescript-blue)
![badge](https://img.shields.io/badge/powered%20by-sass-blue)

# Guitar Scales
## For those who want learn scales in a guitar

Guitar Scales provides a simple and intuitive interface for learning scales in a guitar. You can choose one of the many scales available and the app will display it in the guitar, for you to see exactly where to play each note. Besides that, you can also play each and everyone of the notes, with consideration to their respective octaves, regarding their position on the arm of the guitar. The app is also responsive, adapting to different screen sizes, and provides a seamless user experience on both desktop and mobile devices.

## Live Demo

wdpedroborges.github.io/guitar-scales

## Features

- Show each note of the scale on the guitar
- Play every note

## Tech

- Vite
- React.js
- Typescript
- Sass

## Installation

Clone the repository:

```bash
git clone https://github.com/wdpedroborges/guitar-scales
```

For production:

```sh
cd guitar-scales
npm install
npm run dev
```

Debug in Typescript:

```bash
tsc --noEmit --watch
```

Build:

```bash
npm run build
```

## Deploy

- Add to vite.config.js:

```bash
base: "/<repo>/"
```

- Then:

```bash
npm install gh-pages --save-dev
```

- Add to package.json

```bash
 "homepage": "https://<username>.github.io/<repo>/",
  ...
  "scripts": {
...
"build": "vite build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist",
...
```

## License

This project is licensed under the MIT License. Please see the LICENSE file for more details.