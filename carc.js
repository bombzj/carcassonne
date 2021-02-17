
let ctx, grid = 80, images = {}, cars, curTile, touchable = false, board=[], curMove, editMode = false, solving = false, curRotate
let offsetX, offsetY
let touchX, touchY, tileStack, tiles
let players
let curPlayer
let curTokenType	// current token type to place, default is normal meeple
let curTile4Token
let lastTile	// token can place here only
let tokens
let gameMode
let beginTime	// begin time of this game
let gameExps
let secondTile		// builder feature, now it is the second tile, 1-got a chance 2-used
let isPortal		// the portal is now open
let dragonTile		// which tile is dragon on
let dragonMoves		// tiles of dragon's path, undefined if not started
let fairyToken		// which token fairy is protecting

function init() {
	btnDelete.disabled = true
	scores.initTileType()
	ctx = canvas.getContext("2d")
	let files = []
	for(let [index, item] of tileTypes.entries()) {
		files.push(index + '.png')
		item.id = index
		let connect = item.connect
		item.isRiver = connect[0] == river || connect[1] == river || connect[2] == river || connect[3] == river	// river must connect to river
	}
	for(let c of allColors) {
		files.push(c + '.png')
		// files.push(c + tokenLarge + '.png')
		files.push(c + tokenPig + '.png')
		files.push(c + tokenBuilder + '.png')
	}
	files.push('dragon' + '.png')
	files.push('princess' + '.png')
	files.push('fairy' + '.png')
	loadImages(files, () => {
		for(let c of allColors) {
			images[c + tokenLarge] = images[c]
		}
		initFinished()
	});

	loadAllGame()
}

function initFinished() {
	offsetX = -grid * (boardWidth / 2 - 2)
	offsetY = -grid * (boardWidth / 2 - 3)

	canvas.addEventListener("mousedown", function (event) {
		if(!touchable) {
			touchstart(event.offsetX, event.offsetY)
		}
	}, false);
	canvas.addEventListener("mousemove", function (event) {
		if(!touchable) {
			touchmove(event.offsetX, event.offsetY)
		}
	}, false);
	window.addEventListener("mouseup", function (event) {
		if(!touchable) {
			touchend(event.offsetX, event.offsetY)
		}
	}, false);
	
	canvas.addEventListener("touchstart", function (event) {
		touchable = true
		event.preventDefault(); 
		var bcr = event.target.getBoundingClientRect();
		touchstart(event.touches[0].clientX - bcr.x, event.touches[0].clientY - bcr.y)
	}, false);
	canvas.addEventListener("touchmove", function (event) {
		event.preventDefault(); 
		var bcr = event.target.getBoundingClientRect();
		touchmove(event.touches[0].clientX - bcr.x, event.touches[0].clientY - bcr.y)
	}, false);
	window.addEventListener("touchend", function (event) {
		var bcr = event.target.getBoundingClientRect();
		touchend(event.changedTouches[0].clientX - bcr.x, event.changedTouches[0].clientY - bcr.y)
	}, false);

	restart()
}

function restart(playerNumber = 2, clear = false, mode = 'base') {
	let game = games[gameId]
	if(clear) {
		game = undefined
	}
	scores.initScore()
	lastTile = undefined
	curTile4Token = undefined
	curPlayer = undefined
	curRotate = 0
	secondTile = 0
	isPortal = false
	dragonTile = undefined
	dragonMoves = undefined
	fairyToken = undefined

	if(game) {
		setMode(game.mode || 'base')
		beginTime = game.beginTime
		if(game.secondTile == 2) {
			secondTile = 2
		}
		players = game.players.map(item => {
			let player = {
				id : item.id,
				color: allColors[item.id],
				token: initialTokenNumber,
				score: item.score,
				score2: 0,
				tokens: []		// extra tokens from expansions
			}
			if(gameExps.trader) {
				player.goods = item.goods || [0, 0, 0]
				player.tokens[tokenPig] = 1
				player.tokens[tokenBuilder] = 1
			}
			if(gameExps.inn) {
				player.tokens[tokenLarge] = 1
			}
			return player
		})
		tiles = []
		for(let item of game.tiles) {
			let tile = {
				x : item.x,
				y : item.y,
				type : tileTypes[item.type], 
				rotate : item.rotate
			}
			scores.addTile(tile)
			tiles.push(tile)
		}

		tokens = []
		for(let item of game.tokens) {
			let tile = tiles[item.tile]
			if(!tile) {
				continue
			}
			let player = players[item.player]
			let group = tile.groups[item.index]
			let tokenPlace = rotate(tile.type.place[item.index], tile.rotate)
			let token = {
				tile : tile,
				index : item.index,
				player : player,
				type : item.type,
				type2 : item.type2,
				x : tile.x + tokenPlace[0],
				y : tile.y + tokenPlace[1],
			}
			tokens.push(token)
			// if(!tile.tokens) {
			// 	tile.tokens = []
			// }
			// tile.tokens[item.index] = item.player

			if(group) {
				group.tokens.push(token)
			}
			if(token.type2) {
				player.tokens[token.type2]--
			} else {
				player.token--
			}
		}
		if(game.dragonTile) {
			dragonTile = tiles[game.dragonTile]
		}
		tileStack = game.stack
		curPlayer = game.curPlayer
	} else {
		setMode(mode)
		beginTime = new Date().toISOString()
		players = []
		let crossingTile = 21
		for(let i = 0;i < playerNumber;i++) {
			let player = {
					id : i,
					color: allColors[i],
					token: initialTokenNumber,
					score: 0,
					score2: 0,
					tokens: []		// extra tokens from expansions
				}
			if(gameExps.trader) {
				player.goods = [0, 0, 0]
				player.tokens[tokenPig] = 1
				player.tokens[tokenBuilder] = 1
			}
			if(gameExps.inn) {
				player.tokens[tokenLarge] = 1
			}
			players.push(player)
		}

		let initX = boardWidth / 2
		let initY = boardWidth / 2
		if(gameExps.george) {
			tiles = [
				newTile(initX, initY, 14, 2),
				newTile(initX+1, initY-1, 14, 3)
			]
		} else if(gameExps.test) {
			tiles = [
				newTile(initX, initY, 14, 2), 
				newTile(initX+1, initY, 6, 1), 
				newTile(initX+2, initY, 7, 1), 
				newTile(initX+3, initY, 30, 0), 
			]
		} else if(gameExps.river || gameExps.river2) {
			tiles = [newTile(initX, initY, 14, 2)]
		} else {
			tiles = [newTile(initX, initY, 21, 2)]
		}
		
		scores.addTiles(tiles)
		curPlayer = 0

		tileStack = []
		tokens = []
		let riverStart, riverEnd
		let rivers = []
		let beforeRiver = []
		let afterRiver = []
		let others = []
		let basicTiles = []
		let innTiles = []
		let traderTiles = []
		let riverTiles = []
		let river2Tiles = []
		let dragonTiles = []
		for(let tile of tileTypes) {
			if(tile.riverStart) {
				riverStart = tile.id
			} else if(tile.riverEnd) {
				riverEnd = tile.id
			} else if(tile.id == crossingTile) {
				// start for base version
			} else {
				for(let i = 0;i < tile.count;i++) {
					if(tile.exp == expRiver) {
						riverTiles.push(tile.id)
					} else if(tile.exp == expRiver2) {
						river2Tiles.push(tile.id)
					} else if(tile.exp == expInn) {
						innTiles.push(tile.id)
					} else if(tile.exp == expTrader) {
						traderTiles.push(tile.id)
					} else if(tile.exp == expDragon) {
						dragonTiles.push(tile.id)
					} else {
						basicTiles.push(tile.id)
					}
				}
			}
		}
		if(gameExps.inn) {
			others = others.concat(innTiles)
		}
		if(gameExps.trader) {
			others = others.concat(traderTiles)
		}
		if(gameExps.dragon) {
			others = others.concat(dragonTiles)
		}
		if(gameExps.base) {
			others = others.concat(basicTiles)
		}
		if(gameExps.river) {
			rivers = rivers.concat(riverTiles)
			afterRiver = [riverEnd]
		}
		if(gameExps.river2) {
			rivers = rivers.concat(river2Tiles)
			afterRiver = [riverEnd]
			beforeRiver = [36]
		}
		if(gameExps.george) {
			beforeRiver = [45]
		}

		shuffle(rivers)
		shuffle(others)
		tileStack = tileStack.concat(beforeRiver, rivers, afterRiver, others)
		
		offsetX = -grid * (boardWidth / 2 - 2)
		offsetY = -grid * (boardWidth / 2 - 3)
	}
	if(tileStack.length != 0) {
		scores.updateSolution(tileTypes[tileStack[0]])
	}

	tilesLeft.innerHTML = tileStack.length
	for(let i = 0;i < players.length;i++) {
		document.getElementById("score" + i).innerHTML = players[i].score
		document.getElementById("scorep"  + i).innerHTML = ""
		document.getElementById("scorebox" + i).style.display = ''
		if(gameExps.trader) {
			for(let g = 0;g < 3;g++) {
				tableScore.rows[i + 1].cells[3+g].innerHTML = players[i].goods[g]
			}
		}
	}
	for(let i = 0;i <= players.length;i++) {
		if(gameExps.trader) {
			for(let g = 0;g < 3;g++) {
				tableScore.rows[i].cells[3+g].style.display=""
			}
		} else {
			for(let g = 0;g < 3;g++) {
				tableScore.rows[i].cells[3+g].style.display="none"
			}
		}
	}
	for(let i = players.length;i < allColors.length;i++) {
		document.getElementById("scorebox" + i).style.display = 'none'
	}
	drawAll()

	checkFinish()
}

function setMode(mode) {
	gameMode = mode
	gameExps = {}
	for(let m of mode.split('|')) {
		gameExps[m] = true
	}
}

function newTile(x, y, tileId, rotate) {
	return {
		x : x,
		y : y,
		type : tileTypes[tileId], 
		rotate : rotate
	}
}

function checkFinish() {
	if(tileStack.length == 0) {
		scores.checkFinalToken()
		for(let i = 0;i < players.length;i++) {
			document.getElementById("scorep" + i).innerHTML = "+" .concat( players[i].score2)
		}
	}
}

function shuffle(arr) {
	const len = arr.length
	if(len < 2) {
		return
	}
	for(let i = 0;i < len * 5;i++) {
		let a = Math.floor(Math.random() * len)
		let b = Math.floor(Math.random() * len)
		if(a == b) {
			i--
			continue
		}
		let s = arr[a]
		arr[a] = arr[b]
		arr[b] = s
	}
}

function next() {
	curTile4Token = undefined
	isPortal = false
	if(lastTile) {
		scores.checkToken()
		lastTile = undefined
		// next player, if builder, get an extra turn
		if(secondTile == 1) {
			secondTile = 2
		} else {
			secondTile = 0
			curPlayer = (curPlayer + 1) % players.length
			// add one score due to fairy
			if(fairyToken && fairyToken.player.id == curPlayer) {
				fairyToken.player.score++
			}
		}
		btnNext.disabled = true
		let need = true
		while(need && tileStack.length != 0) {
			scores.updateSolution(tileTypes[tileStack[0]])
			if(scores.solutions.length > 0) {
				need = false
			} else {	// no where to place
				tileStack.shift()
			}
		}
		drawAll()
		saveGame()
		for(let i = 0;i < players.length;i++) {
			document.getElementById("score" + i).innerHTML = players[i].score
			if(gameExps.trader) {
				for(let g = 0;g < 3;g++) {
					tableScore.rows[i + 1].cells[3+g].innerHTML = players[i].goods[g]
				}
			}
		}
	}
	checkFinish()
}

// toggle edit mode
function edit() {
	editMode = !editMode;
	if(editMode) {
		drawAll()
		btnDelete.disabled = false
	} else {
		drawAll()
		btnDelete.disabled = true
	}
}

// delete selected tile
function deleteTile() {
	if(curTile4Token) {
		let id = curTile4Token.id
		let game = games[gameId]
		if(game && id > 0) {
			curTile4Token = undefined
			game.tiles.splice(id, 1)
			restart()
		}
	}
}

// remove all cars
function empty() {
	cars = []
	drawAll()
	if(editMode) {
		drawBackup()
	}
}

function drawAll() {
	ctx.clearRect(0,0,canvas.width,canvas.height); 
	if(!lastTile && !editMode && !dragonMoves) {
		ctx.fillStyle='#E0E0F0'
		// draw all possible places of this rotate
		for(let so of scores.solutions) {
			if(so.rotates.indexOf(curRotate) != -1) {
				ctx.fillRect(grid * so.x + offsetX, grid * so.y + offsetY, grid, grid)
			}
		}
		ctx.fillStyle='#EEEEEE'
		// draw all possible places
		for(let so of scores.solutions) {
			if(so.rotates.indexOf(curRotate) == -1) {
				ctx.fillRect(grid * so.x + offsetX, grid * so.y + offsetY, grid, grid)
			}
		}
	}
	for(let tile of tiles) {
		draw(tile.type.id, grid * tile.x + offsetX, grid * tile.y + offsetY, grid, grid, tile.rotate)
	}
	if(fairyToken) {
		draw('fairy', 
			grid * fairyToken.x + offsetX - grid/6 + grid/4, 
			grid * fairyToken.y + offsetY - grid/6, 
			grid/4, grid/3)
	}
	for(let token of tokens) {
		if(token.type2) {
			draw(token.player.color + token.type2, 
				grid * token.x + offsetX - grid/4, 
				grid * token.y + offsetY - grid/4, 
				grid/2, grid/2)
		} else {
			draw(token.player.color, 
				grid * token.x + offsetX - grid/6, 
				grid * token.y + offsetY - grid/6, 
				grid/3, grid/3)
		}
	}
	if(dragonTile) {
		if(!dragonMoves || lastTile) {
			ctx.globalAlpha = 0.7
		}
		draw('dragon', 
			grid * (dragonTile.x + 0.5) + offsetX - grid/3, 
			grid * (dragonTile.y + 0.5) + offsetY - grid/3, 
			grid/1.5, grid/1.5)
		ctx.globalAlpha = 1
	}
	// mouse over positions for token
	if(curTile4Token) {
		drawTokenPlace(curTile4Token)
	}
	drawBackup()
}

function rotate(arr, r) {
	if(r == 0) {
		return arr
	} else if(r == 1) {
		return [1 - arr[1], arr[0]]
	} else if(r == 2) {
		return [1 - arr[0], 1 - arr[1]]
	} else if(r == 3) {
		return [arr[1], 1 - arr[0]]
	}
}

// test if the place can put the token
function testToken(playerId, group, tokenType, isLastTile) {
	if(tokenType == tokenFairy) {
		return false
	}
	if(group) {
		if(tokenType > 1) {
			if(!editMode && !isLastTile) {
				return false
			}
			if(tokenType == tokenPig) {
				if(group.type != farm || !group.tokens.some(t => t.player.id == playerId)) {
					return false
				}
			} else if(tokenType == tokenBuilder) {
				if(group.type != city && group.type != road || !group.tokens.some(t => t.player.id == playerId)) {
					return false
				}
			}
		} else {
			if(group.tokens.length > 0) {	// normal/large meeple
				return false
			}
			if(!editMode && !isLastTile) {
				if(!isPortal) {
					return false
				}
				// when portal opened, only incompleted feature can be placed
				if(!group || group.unfinished == 0) {
					return false
				}
			}
		}
	} else {
		if(!editMode && !isLastTile) {
			return false
		}
		if(tokenType == tokenPig || tokenType == tokenBuilder) {
			return false
		}
	}
	return true
}

const zoomTile = 2;
// draw all token positions of this tile
function drawTokenPlace(tile, ex = -1000, ey = -1000) {
	if(curTokenType == tokenPrincess || curTokenType == tokenFairy) {
		return
	}
	let x = grid * tile.x + offsetX - grid / 2
	let y = grid * tile.y + offsetY - grid / 2
	draw(tile.type.id, x, y, grid * zoomTile, grid * zoomTile, tile.rotate)
	if(tile.type.place) {
		for(let [index, place] of tile.type.place.entries()) {
			// don't draw if this position is invalid
			let group = tile.groups[index]
			if(!testToken(curPlayer, group, curTokenType, tile == lastTile)) {
				continue
			}
			let placeR = rotate(place, tile.rotate)
			let px = x + grid * placeR[0] * zoomTile
			let py = y + grid * placeR[1] * zoomTile
			if(Math.abs(ex - px) < grid / 4 &&
					Math.abs(ey - py) < grid / 4) {
				
			} else {
				ctx.globalAlpha = 0.5
			}
			if(curTokenType) {
				draw(players[curPlayer].color + curTokenType, 
					px - grid / 3, 
					py - grid / 3,
					grid / 1.5, grid / 1.5)
			} else {
				draw(players[curPlayer].color, 
					px - grid / 3, 
					py - grid / 3,
					grid / 1.5, grid / 1.5)
			}
			ctx.globalAlpha = 1
		}
	}
}

function placeToken(tile, ex, ey) {
	let player = players[curPlayer]
	if(!editMode) {
		if(curTokenType == 0) {
			if(player.token <= 0) {
				return false
			}
		} else {
			if(!player.tokens[curTokenType]) {
				return false
			}
		}
	}
	let x = grid * tile.x + offsetX - grid / 2
	let y = grid * tile.y + offsetY - grid / 2
	if(tile.type.place) {
		for(let [index, place] of tile.type.place.entries()) {
			let placeR = rotate(place, tile.rotate)
			let px = x + grid * placeR[0] * zoomTile
			let py = y + grid * placeR[1] * zoomTile
			if(Math.abs(ex - px) < grid / 4 &&
					Math.abs(ey - py) < grid / 4) {

				let group = tile.groups[index]
				if(!testToken(curPlayer, group, curTokenType, tile == lastTile)) {
					continue
				}
				
				// if(!tile.tokens) {
				// 	tile.tokens = [];
				// }
				// tile.tokens[index] = curPlayer
				let token = {
					tile : tile, index : index, player : player, type : place[2],
					x : tile.x + placeR[0],
					y : tile.y + placeR[1],
				}
				if(curTokenType) {
					token.type2 = curTokenType
				}
				tokens.push(token)
				if(group) {
					group.tokens.push(token)
				}
				if(!editMode) {
					if(token.type2) {
						player.tokens[token.type2]--
					} else {
						player.token--
					}
					next()
				}
				curTile4Token = undefined
				return true
			}
		}
	}
}

const backupStartX = 8
function drawBackup() {
	let startX = backupStartX
	let startY = 0
	let w = 0.5
	if(editMode) {
		startX = backupStartX - 1.5
		for(let [index, tileType] of tileTypes.entries()) {
			draw(index, grid * startX, grid * startY, grid*w, grid*w, curRotate)
			tileType.position = [startX, startY, w, w];	// TODO: should be one time job
			startY += w + 0.02
			if((index + 1) % 16 == 0) {
				startX += w + 0.02
				startY = 0
			}
		}
	} else {
		if(tileStack.length > 0) {
			if(!lastTile) {
				draw(tileStack[0], grid * startX, grid * startY, grid*0.8, grid*0.8, curRotate)
			}
			let player = players[curPlayer]

			startX = backupStartX
			startY = 1.1
			// ctx.globalAlpha = 0.5
			// draw(player.color, grid * startX, grid * startY, grid/4, grid/4)
			// ctx.globalAlpha = 1
			// startX += 0.3
			for(let i = 0;i < initialTokenNumber;i++) {
				if(i < player.token) {
					draw(player.color, grid * startX, grid * startY, grid/4, grid/4)
				} else {
					ctx.globalAlpha = 0.5
					draw(player.color, grid * startX, grid * startY, grid/4, grid/4)
					ctx.globalAlpha = 1
				}
				startX += 0.3
				if(i == 3) {
					startX = backupStartX
					startY += 0.3
				}
			}
			initialTokenNumber
			for(let tokenType = 1;tokenType < 4;tokenType++) {
				if(player.tokens[tokenType] > 0) {
					draw(player.color + tokenType, grid * (backupStartX-0.5 + 0.4 * tokenType), grid * 2, grid/3, grid/3)
				} else if(player.tokens[tokenType] == 0) {
					ctx.globalAlpha = 0.5
					draw(player.color + tokenType, grid * (backupStartX-0.5 + 0.4 * tokenType), grid * 2, grid/3, grid/3)
					ctx.globalAlpha = 1
				}
			}
			if(gameExps.dragon) {
				draw('fairy', grid * (backupStartX-0.5 + 0.4 * 4), grid * 2, grid/3, grid/3)
				if(lastTile && lastTile.type.princess) {
					draw('princess', grid * (backupStartX-0.5 + 0.4 * 5), grid * 2, grid/3, grid/3)
				}
			}
		}
	}
}

const rotateDegree = [0, Math.PI/2, Math.PI, Math.PI*3/2]
function draw(file, x, y, w = grid, h = grid, rotate = 0) {
	if(rotate > 0) {
		ctx.save()
		ctx.translate(x+w/2, y+h/2)
		ctx.rotate(rotateDegree[rotate])
		ctx.translate(-x-w/2, -y-h/2)
	}
	ctx.drawImage(images[file], x, y, w, h)
	if(rotate > 0) {
		ctx.restore()
	}
}

let dragX = null, dragY, dragging = false
function touchstart(ex, ey) {
	let x = ex / grid
	let y = ey / grid

	if(editMode) {
		// start dragging a new tile from list of tiles
		for(let [index, tileType] of tileTypes.entries()) {
			if(x >= tileType.position[0] && x < tileType.position[2] + tileType.position[0] &&
				y >= tileType.position[1] && y < tileType.position[3] + tileType.position[1]) {
				curTile = {x : -1, y : -1, type : tileTypes[index], rotate : curRotate}
				dragX = ex
				dragY = ey
				return
			}
		}
	} else if(tileStack.length > 0 && !lastTile){
		// start dragging a new tile from tile stack
		if(ex > backupStartX * grid && ey < grid) {
			curTile = {x : -1, y : -1, type : tileTypes[tileStack[0]], rotate : curRotate}
			dragX = ex
			dragY = ey
			return
		}
	}

	if(ex < 850 && ey < 850) {
		dragX = ex - offsetX
		dragY = ey - offsetY
	}
}

function touchmove(ex, ey) {
	if(curTile) {
		if(dragX != null && !dragging) {
			let dx = ex - dragX
			let dy = ey - dragY
			if(dx**2 + dy**2 >= 100) {
				dragging = true
			}
		}
		if(dragging) {
			// dragging a new tile
			let x = Math.floor((ex - offsetX) / grid)
			let y = Math.floor((ey - offsetY) / grid)
			if(x >= 0 && x <= boardWidth && y >= 0 && y <= boardWidth) {
				if(scores.testPlace(x, y, curTile.type, curTile.rotate)) {
					curTile.x = x
					curTile.y = y
				} else {
					curTile.x = -1
				}
			} else {
				curTile.x = -1
			}
			if(curTile.x == -1) {
				ctx.clearRect(0,0,canvas.width,canvas.height); 
				drawAll()
				draw(curTile.type.id, ex-grid/4, ey-grid/4, grid/2, grid/2, curRotate)
			} else {
				drawAll();
				draw(curTile.type.id, grid * curTile.x+offsetX, grid * curTile.y+offsetY, grid, grid, curRotate)
				drawBackup()
			}
		}
		return
	}

	// dragging the whole canvas
	if(dragX != null && !dragging) {
		let dx = ex - dragX - offsetX
		let dy = ey - dragY - offsetY
		if(dx**2 + dy**2 >= 100) {
			dragging = true
		}
	}
	if(dragging) {
		offsetX = ex - dragX
		offsetY = ey - dragY
		drawAll()
		return
	}
	// mouse over positions for token
	if(curTile4Token) {
		drawTokenPlace(curTile4Token, ex, ey)
	}
}

function placeTile(tile) {
	tiles.push(tile)
	scores.addTile(tile)
	curTokenType = 0
	tileStack.shift()
	tilesLeft.innerHTML = tileStack.length
	lastTile = tile
	btnNext.disabled = false
	if(tile.type.portal) {
		isPortal = true
	}
	if(tile.type.volcano) {
		dragonTile = tile
	}
	if(tile.type.dragon && dragonTile) {
		dragonMoves = [dragonTile]
	}
	if(!isPortal && !tile.type.volcano) {
		curTile4Token = tile
	}
}

function touchend(ex, ey) {
	if(curTile) {
		if(dragging) {
			if(curTile.x != -1) {
				if(!editMode) {
					placeTile(curTile)
					drawAll()
				} else {
					tiles.push(curTile)
					scores.addTile(curTile)
					saveGame()
				}
			} else {
				drawAll()
			}
		}
		curTile = undefined
	}
	dragX = null
	if(dragging) {
		dragging = false
		return
	}
	if(!lastTile && dragonMoves) {
		// time to move the dragon!! 6 times and no same tiles
		let x = Math.floor((ex - offsetX) / grid)
		let y = Math.floor((ey - offsetY) / grid)
		// click on a possible place
		let tile = scores.board[x] && scores.board[x][y]
		if(tile && dragonMoves.indexOf(tile) == -1) {
			if(Math.abs(x- dragonTile.x) + Math.abs(y- dragonTile.y) == 1) {
				dragonMoves.push(tile)
				dragonTile = tile
				// kick all tokens from this tile
				tokens = tokens.filter(token => {
					if(token.tile == tile) {
						if(token.type2) {
							token.player.tokens[token.type2]++
						} else {
							token.player.token++
						}
						// remove it from group as well
						let group = token.tile.groups[token.index]
						if(group) {
							group.tokens = group.tokens.filter(t => t != token)
						}
						return false
					}
					return true
				})
				// end of moves
				if(dragonMoves.length > 6 || dragonDeadEnd()) {
					dragonMoves = undefined
				}
				drawAll()
			}
		}
		return
	}
	if(curTile4Token) {	// place token or cancel
		if(placeToken(curTile4Token, ex, ey)) {
			if(editMode) {
				drawAll()
			}
			return
		}
		if(editMode || isPortal) {
			curTile4Token = false
		}
		drawAll()
	}
	
	// click on normal token or extra tokens
	if(ex > 8 * grid && ey > 1 * grid && ey < 2 * grid) {
		curTokenType = 0
		drawAll()
		return
	} else if(ex > 8 * grid && ey > 2 * grid && ey < 2.5 * grid) {
		let player = players[curPlayer]
		if(ex < 8.4 * grid) {
			if(player.tokens[tokenLarge]) {
				curTokenType = tokenLarge
			}
			drawAll()
			return
		} else if(ex < 8.8 * grid) {
			if(player.tokens[tokenPig]) {
				curTokenType = tokenPig
			}
			drawAll()
			return
		} else if(ex < 9.2 * grid) {
			if(player.tokens[tokenBuilder]) {
				curTokenType = tokenBuilder
			}
			drawAll()
			return
		} else if(ex < 9.6 * grid) {
			if(gameExps.dragon) {
				curTokenType = tokenFairy
			}
			drawAll()
			return
		} else if(ex < 10 * grid) {
			if(gameExps.dragon) {
				curTokenType = tokenPrincess
			}
			drawAll()
			return
		}
	}

	if(curTokenType == tokenFairy || curTokenType == tokenPrincess) {
		let x = (ex - offsetX) / grid
		let y = (ey - offsetY) / grid
		let token = tokenByXY(x, y)
		// click on an existing token to place fairy
		if(curTokenType == tokenFairy) {
			if(token && token.player.id == curPlayer) {
				fairyToken = token
				next()
				return
			}
		}
		// click on an existing token to kick
		if(curTokenType == tokenPrincess) {
			if(token && lastTile) {
				let pass = false
				for(let [index, place] of lastTile.type.place.entries()) {
					if(place.princess) {
						if(lastTile.groups[index].tokens.indexOf(token) != -1) {
							pass = true
						}
					}
				}
				if(pass) {
					tokens = tokens.filter(t => {
						if(t == token) {
							if(token.type2) {
								token.player.tokens[token.type2]++
							} else {
								token.player.token++
							}
							// remove it from group as well
							let group = token.tile.groups[token.index]
							if(group) {
								group.tokens = group.tokens.filter(t => t != token)
							}
							return false
						}
						return true
					})
					next()
					return
				}
			}
		}
	}

	if(tileStack.length > 0 && !lastTile && !editMode){
		// click on the tile stack
		if(ex > 8 * grid && ey < grid) {
			rotateBackup()
			return
		}
		let x = Math.floor((ex - offsetX) / grid)
		let y = Math.floor((ey - offsetY) / grid)
		// click on a possible place
		let so = scores.solutionBoard[x] && scores.solutionBoard[x][y]
		if(so) {
			let r = so.rotates.indexOf(curRotate)
			if(r != -1) {
				// put a tile directly
				let tile = {x : x, y : y, type : tileTypes[tileStack[0]], rotate : so.rotates[r]}
				placeTile(tile)
				drawAll()
				return
			}
		}
	}
	// click on a tile to place token
	if(!curTile4Token) {
		let ox = (ex - offsetX) / grid
		let oy = (ey - offsetY) / grid
		for(let tile of tiles) {
			if(ox >= tile.x && ox < tile.x + 1 &&
				oy >= tile.y && oy < tile.y + 1) {
	
				if(!editMode && !isPortal) {
					if(!lastTile || lastTile != tile || tile.type.volcano) {
						break
					}
				} else {
					// tiles.pop()
					// drawAll()
					// break;
				}
				curTile4Token = tile
				drawTokenPlace(tile)
				return
			}
		}
	}

}

let tokenDis = 0.1
function tokenByXY(x, y) {
	for(let token of tokens) {
		if((token.x - x)**2 + (token.y - y)**2 < tokenDis) {
			return token
		}
	}
}

// test if dragon is in a dead end
function dragonDeadEnd() {
	for(let dir of connectRect) {
		let tile = scores.board[dir[0] + dragonTile.x][dir[1] + dragonTile.y]
		if(tile && dragonMoves.indexOf(tile) == -1) {
			return false
		}
	}
	return true
}

function rotateBackup() {
	curRotate = (curRotate + 1) & 3
	drawAll()
}

let gameId = -1
let games = []
function saveGame() {
	try {
		let game = {
			id : gameId,
			mode : gameMode,
			beginTime : beginTime,
			secondTile : secondTile,
			players : players.map(item => {
				let player = {
					id : item.id,
					score : item.score,
				}
				if(gameExps.trader) {
					player.goods = item.goods
				}
				return player
			}),
			tiles : tiles.map(item => {
				return {
					x : item.x,
					y : item.y,
					type : item.type.id,
					rotate : item.rotate
				}
			}),
			tokens : tokens.map(item => {
				return {
					tile : item.tile.id,
					index : item.index,
					player : item.player.id,
					type : item.type,
					type2 : item.type2
				}
			}),
			stack : tileStack,
			curPlayer : curPlayer
		}
		if(dragonTile) {
			game.dragonTile = dragonTile.id
		}
		localStorage.setItem("game"+gameId, JSON.stringify(game));
		games[gameId] = game
	} catch(e) { console.log(e) }
}

function loadAllGame() {
	gameId = -1
	try {
		let jsonString
		while(jsonString = localStorage.getItem("game"+(gameId + 1))) {
			gameId++
			games[gameId] = JSON.parse(jsonString)
		}
	} catch(e) { console.log(e) }
	gameId = localStorage.getItem("gameId");
	if(gameId == undefined) {
		gameId = 0
	} else {
		gameId = parseInt(gameId)
	}
}


function loadImages(sources, callback){
	var count = 0,
		imgNum = 0
	for(let src of sources){
		imgNum++
	}
	for(let src of sources){
		let name = src.split('.')[0]
		images[name] = new Image(src);
		images[name].onload = images[name].onerror = function(){
			if(++count >= imgNum){
				callback(images)
			}
		};

		images[name].src = 'res/' + src
	}
}

function switchGame(delta) {
	gameId += delta
	if(gameId < 0) {
		gameId = 0
	} else if(gameId > games.length) {	// no need to create more game if the last one is not yet started/saved
		gameId = games.length
	} 
	if(gameId < games.length) {	// reset from local storage
		games[gameId] = JSON.parse(localStorage.getItem("game"+gameId))
	}
	restart()
	localStorage.setItem("gameId", gameId);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

