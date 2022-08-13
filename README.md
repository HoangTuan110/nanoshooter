# Nanoshooter

![Nanoshooter logo](http://0x0.st/o2Ow.png)

Nanoshooter is a shitty top-down 2D shooter game. Created in ~4 hours using [KaboomJS](https://kaboomjs.com)

## Overview

- Player (a white square) has to shoot the enemy (the red square)
- No mouse-aiming used. The game automatically aims the enemy for you
  (Although this means that you sometimes will have to move to accurately
  shoot the enemy near you)
- The sound effect can be pretty loud
- Performance can be an issue
- Basic but effective UI
- Scores are included (but no high scores)

## Controls

- Arrow keys for moving the character
- <kbd>z</kbd> for shooting
- <kbd>r</kbd> for reloading

## Run this game locally

Install [Yarn](https://yarnpkg.com/) and [Python 3](https://www.python.org/), then:

```sh
git clone https://github.com/HoangTuan110/nanoshooter
yarn
yarn build; yarn serve
```

## License

This game is under the MIT license. See LICENSE for details
