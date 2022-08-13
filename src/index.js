import kaboom from "kaboom"

// == Constants ==
const SPEED = 320,
      ENEMY_SPEED = 160,
      BULLET_SPEED = 100,
      BACKGROUND = [173, 166, 229], // #ADA6E5
      ENEMY_COLOR = [255, 17, 102] // #F16

kaboom({
  font: "apl386o",
  background: BACKGROUND,
})

// https://kaboomjs.com/play?demo=button
function addButton(txt, p, f) {
  const btn = add([
    text(txt),
    p,
    area({ cursor: "pointer", }),
    scale(1),
    origin("center"),
  ])
  btn.onClick(f)
  btn.onUpdate(() => {
    if (btn.isHovering()) {
      const t = time() * 10
      btn.color = rgb(
        wave(0, 255, t),
        wave(0, 255, t + 2),
        wave(0, 255, t + 4),
      )
      btn.scale = vec2(1.2)
    } else {
      btn.scale = vec2(1)
      btn.color = rgb()
    }
  })
}

scene("menu", () => {
  add([
    text("NanoShooter"),
    pos(200, 160)
  ])
  add([
    text("A shitty 2D shooter game"),
    pos(200, 220),
    color(193, 202, 218) // #C1CADA
  ])
  // This one needs special positioning for some reason
  addButton("Start", pos(310, 320), () => go("game"))
})

scene("game", () => {
  // == Variables ==
  let ammoAmount = 30
  let points = 0

  // == Load assets ==
  loadSound("shoot", "../assets/laserShoot.wav")
  loadSound("dead", "../assets/explosion.wav")

  // == Entities ==

  // Player
  const player = add([
    rect(50, 50),
    pos(120, 80),
    area(),
  ])

  // Bullet
  function spawnBullet() {
    if (get("enemy").length === 0 || (ammoAmount === 0)) return
    add([
			pos(player.pos),
      outline(4),
			rect(12, 12),
			area(),
			cleanup(),
			color(BLUE),
			"bullet",
		])
    ammoAmount--
    // == Handle bullet moving ==
    onUpdate("bullet", (bullet) => {
      const dir = get("enemy")[0].pos.sub(player.pos).unit()
      bullet.move(dir.scale(BULLET_SPEED))
    })
    onCollide("bullet", "enemy", (bullet, enemy) => {
      play("dead")
      destroy(bullet)
      destroy(enemy)
      addKaboom(enemy.pos)
      shake()
      points++
    })
    wait(1.0)
  }

  // Enemy
  function spawnEnemy() {
    const enemy = add([
      rect(20, 20),
      area(),
      outline(4),
      pos(rand(width(), 0), rand(height(), 0)),
      origin("botright"),
      color(...ENEMY_COLOR),
      "enemy"
    ])
    // Move to the direction of the player
    // https://kaboomjs.com/play?demo=ai
    enemy.onUpdate(() => {
      const dir = player.pos.sub(enemy.pos).unit()
      enemy.move(dir.scale(ENEMY_SPEED))
    })
    wait(rand(0.5, 1.5), () => spawnEnemy())
  }
  spawnEnemy()

  // == Displaying ==
  function display() {
    // Destroy all of the previous display elements
    while (get("display").length !== 0)
      destroy(get("display")[0])
    add([
      text(`Ammo: ${ammoAmount}`),
      pos(20, 20),
      fixed(),
      { update() { this.text = `Ammo: ${ammoAmount}` } },
      "display"
    ])
    add([
      text(`Points: ${points}`),
      pos(20, 80),
      fixed(),
      { update() { this.text = `Points: ${points}` } },
      "display"
    ])
  }
  display()

  // == Input handler ==

  // For the player
  // From https://kaboomjs.com/play?demo=ai
  onKeyDown("left", () => {
    player.move(-SPEED, 0)
  })
  onKeyDown("right", () => {
    player.move(SPEED, 0)
  })
  onKeyDown("up", () => {
    player.move(0, -SPEED)
  })
  onKeyDown("down", () => {
    player.move(0, SPEED)
  })
  onKeyPress("z", () => {
    play("shoot")
    spawnBullet()
  })
  onKeyPress("r", () => {
    wait(1.5)
    ammoAmount = 30
  }) 

  // == Destroy player on collision with opponent ==
  player.onCollide("enemy", (enemy) => {
    play("dead")
    destroy(player)
    destroy(enemy)
    addKaboom(enemy.pos)
    go("lose", points)
  })

  // == Camera should put player in the center ==
  player.onUpdate(() => {
    camPos(player.pos)
    camScale(vec2(0.9))
  })
})

scene("lose", (points) => {
  add([
    text("You lose!"),
    pos(180, 180),
  ])
  add([
    text(`Your point is: ${points}`),
    pos(180, 240),
  ])
  add([
    text("Press R to restart"),
    pos(180, 300),
  ])
  add([
    text("Or M to go back menu"),
    pos(180, 360),
  ])
  onKeyPress("r", () => go("game"))
  onKeyPress("m", () => go("menu"))
})

go("menu")
