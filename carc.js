
let ctx, grid = 80, images = {}, cars, curTile, touchable = false, board=[], curMove, editMode = false, solving = false, curRotate
let offsetX, offsetY
let touchX, touchY, tileStack, tiles
let players
let curPlayer
let curTile4Token
let lastTile	// token can place here only
let tokens
let gameMode

function init(c, boardW, boardH, exitX, exitY) {
	btnDelete.disabled = true
	scores.initTileType()
	ctx = canvas.getContext("2d")
	let files = []
	for(let [index, item] of tileTypes.entries()) {
		files.push(index)
		item.id = index
		let connect = item.connect
		item.isRiver = connect[0] == river || connect[1] == river || connect[2] == river || connect[3] == river	// river must connect to river
	}
	for(let c of allColors) {
		files.push(c)
	}
	loadImages(files, () => {
		drawAll()
	});

	
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

	loadAllGame()
	restart()
}

function restart(playerNumber = 2, clear = false, mode = 'classic') {
	let game = games[gameId]
	if(clear) {
		game = undefined
	}
	scores.initScore()
	lastTile = undefined
	curRotate = 0

	if(game) {
		gameMode = game.mode || 'classic'
		players = game.players.map(item => {
			return {
				id : item.id,
				color: allColors[item.id],
				token: 7,
				score: item.score,
				score2: 0
			}
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
			let token = {
				tile : tile,
				index : item.index,
				player : player,
				type : item.type
			}
			tokens.push(token)
			if(!tile.tokens) {
				tile.tokens = []
			}
			tile.tokens[item.index] = item.player

			if(group) {
				group.tokens.push(token)
			}
			player.token--
		}
		tileStack = game.stack
		curPlayer = game.curPlayer
	} else {
		gameMode = mode
		players = []
		let crossingTile = 21
		for(let i = 0;i < playerNumber;i++) {
			players.push({
					id : i,
					color: allColors[i],
					token: 7,
					score: 0,
					score2: 0
				},)
		}
		let initTile
		if(gameMode == 'classic') {
			initTile = {
				x : boardWidth / 2,
				y : boardWidth / 2,
				type : tileTypes[21], 
				rotate : 2
			}
		} else if(gameMode == 'river') {
			initTile = {
				x : boardWidth / 2,
				y : boardWidth / 2,
				type : tileTypes[14], 
				rotate : 2
			}
		} else if(gameMode == 'river2') {
			initTile = {
				x : boardWidth / 2,
				y : boardWidth / 2,
				type : tileTypes[14], 
				rotate : 2
			}
		}
		tiles = [ initTile ]
		if(gameMode == 'george') {
			initTile = {
				x : boardWidth / 2,
				y : boardWidth / 2,
				type : tileTypes[14], 
				rotate : 2
			}
			let initTile2 = {
				x : boardWidth / 2 + 1,
				y : boardWidth / 2 - 1,
				type : tileTypes[14], 
				rotate : 3
			}
			tiles = [ initTile, initTile2 ]
		}
		scores.addTiles(tiles)
		curPlayer = 0

		tileStack = []
		tokens = []
		let start, end
		let rivers = []
		let others = []
		for(let tile of tileTypes) {
			if(tile.riverStart) {
				start = tile.id
			} else if(tile.riverEnd) {
				end = tile.id
			} else if(tile.id == crossingTile) {
				// start for classic version
			} else {
				if(tile.isRiver) {
					for(let i = 0;i < tile.count;i++) {
						rivers.push(tile.id)
					}
				} else {
					for(let i = 0;i < tile.count;i++) {
						others.push(tile.id)
					}
				}
			}
		}
		if(gameMode == 'river') {
			rivers = [2, 3, 6, 7, 29, 30, 31, 32, 33, 34]
			shuffle(rivers)
			others.push(crossingTile)
			shuffle(others)
			tileStack = rivers.concat(end, others)
		} else if(gameMode == 'river2') {
			rivers = [3, 6, 7, 30, 32, 34, 35, 37, 46]
			shuffle(rivers)
			others.push(crossingTile)
			shuffle(others)
			tileStack = [36].concat(rivers, end, others)
		} else if(gameMode == 'george') {
			shuffle(rivers)
			others.push(crossingTile)
			shuffle(others)
			tileStack = [45].concat(rivers, end, others)
		} else {	// classic
			shuffle(others)
			tileStack = others
		}
		
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
	}
	for(let i = players.length;i < 5;i++) {
		document.getElementById("scorebox" + i).style.display = 'none'
	}
	drawAll()

	checkFinish()
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
	if(lastTile) {
		scores.checkToken()
		for(let i = 0;i < players.length;i++) {
			document.getElementById("score" + i).innerHTML = players[i].score
		}
		lastTile = undefined
		curPlayer = (curPlayer + 1) % players.length
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

function drawAll(c) {
	ctx.clearRect(0,0,canvas.width,canvas.height); 
	if(!lastTile) {
		ctx.fillStyle='#CCCCCC'
		// draw all possible places
		for(let so of scores.solutions) {
			if(so.rotates.indexOf(curRotate) != -1) {
				ctx.fillRect(grid * so.x + offsetX, grid * so.y + offsetY, grid, grid)
			}
		}
	}
	for(let tile of tiles) {
		draw(tile.type.id, grid * tile.x + offsetX, grid * tile.y + offsetY, grid, grid, tile.rotate)
		if(tile.tokens) {
			let place = tile.type.place
			for(let [index, token] of tile.tokens.entries()) {
				let tokenPlace = rotate(place[index], tile.rotate)
				if(players[token]) {
					draw(players[token].color, 
						grid * (tile.x + tokenPlace[0]) + offsetX - grid/6, 
						grid * (tile.y + tokenPlace[1]) + offsetY - grid/6, 
						grid/3, grid/3)
				}
			}
		}
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


const zoomTile = 2;
function drawTokenPlace(tile, ex, ey) {
	let x = grid * tile.x + offsetX
	let y = grid * tile.y + offsetY
	draw(tile.type.id, x, y, grid * zoomTile, grid * zoomTile, tile.rotate)
	if(tile.type.place) {
		for(let place of tile.type.place) {
			let placeR = rotate(place, tile.rotate)
			let px = x + grid * placeR[0] * zoomTile
			let py = y + grid * placeR[1] * zoomTile
			if(Math.abs(ex - px) < grid / 3 &&
					Math.abs(ey - py) < grid / 3) {
				
			} else {
				ctx.globalAlpha = 0.5
			}
			draw(players[curPlayer].color, 
				px - grid / 3, 
				py - grid / 3,
				grid / 1.5, grid / 1.5)
			ctx.globalAlpha = 1
		}
	}
}

function placeToken(tile, ex, ey) {
	let player = players[curPlayer]
	if(!editMode && player.token == 0) {
		return
	}
	let x = grid * tile.x + offsetX
	let y = grid * tile.y + offsetY
	if(tile.type.place) {
		for(let [index, place] of tile.type.place.entries()) {
			let placeR = rotate(place, tile.rotate)
			let px = x + grid * placeR[0] * zoomTile
			let py = y + grid * placeR[1] * zoomTile
			if(Math.abs(ex - px) < grid / 3 &&
					Math.abs(ey - py) < grid / 3) {

				let group = tile.groups[index]
				if(group && group.tokens.length > 0) {
					return
				}
				
				if(!tile.tokens) {
					tile.tokens = [];
				}
				tile.tokens[index] = curPlayer
				let token = {tile : tile, index : index, player : player, type : place[2]}
				tokens.push(token)
				if(group) {
					group.tokens.push(token)
				}
				if(!editMode) {
					player.token--
					next()
				}
				return
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
			ctx.globalAlpha = 0.5
			draw(player.color, grid * startX, grid * startY, grid/4, grid/4)
			ctx.globalAlpha = 1
			startX += 0.3
			for(let i = 0;i < player.token;i++) {
				draw(player.color, grid * startX, grid * startY, grid/4, grid/4)
				startX += 0.3
				if(i == 2) {
					startX = backupStartX
					startY += 0.3
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

let dragX = null, dragY
function touchstart(ex, ey) {
	let x = ex / grid
	let y = ey / grid
	
	if(curTile4Token) {	// place token or cancel
		placeToken(curTile4Token, ex, ey)
		curTile4Token = undefined
		drawAll()
		return
	}

	if(editMode) {
		for(let [index, tileType] of tileTypes.entries()) {
			if(x >= tileType.position[0] && x < tileType.position[2] + tileType.position[0] &&
				y >= tileType.position[1] && y < tileType.position[3] + tileType.position[1]) {
				curTile = {x : -1, y : -1, type : tileTypes[index], rotate : curRotate}
				return
			}
		}
	} else if(tileStack.length > 0 && !lastTile){
		if(ex > backupStartX * grid && ey < grid) {
			curTile = {x : -1, y : -1, type : tileTypes[tileStack[0]], rotate : curRotate}
			return
		}
		let x = Math.floor((ex - offsetX) / grid)
		let y = Math.floor((ey - offsetY) / grid)
		// click on a possible place
		let so = scores.solutionBoard[x] && scores.solutionBoard[x][y]
		if(so) {
			let r = so.rotates.indexOf(curRotate)
			if(r != -1) {
				curTile = {x : x, y : y, type : tileTypes[tileStack[0]], rotate : so.rotates[r]}
				drawAll()
				return
			}
		}
	}
	
	let ox = x - offsetX / grid
	let oy = y - offsetY / grid
	for(let tile of tiles) {
		if(ox >= tile.x && ox < tile.x + 1 &&
			oy >= tile.y && oy < tile.y + 1) {

			if(!editMode) {
				if(!lastTile || lastTile != tile) {
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

	if(ex < 850 && ey < 850) {
		dragX = ex - offsetX
		dragY = ey - offsetY
	}
}

function touchmove(ex, ey) {
	if(dragX != null) {
		offsetX = ex - dragX
		offsetY = ey - dragY
		drawAll()
		return
	}
	if(curTile4Token) {
		drawTokenPlace(curTile4Token, ex, ey)
	}
	let x = Math.floor((ex - offsetX) / grid)
	let y = Math.floor((ey - offsetY) / grid)
	if(true) {
		if(curTile) {
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
	}
}

function touchend(ex, ey) {
	if(tileStack.length > 0 && !lastTile && !editMode){
		if(ex > 8 * grid && ey < grid) {
			rotateBackup()
		}
	}
	if(curTile) {
		if(curTile.x != -1) {
			tiles.push(curTile)
			scores.addTile(curTile)
			if(!editMode) {
				tileStack.shift()
				tilesLeft.innerHTML = tileStack.length
				lastTile = curTile
				if(players[curPlayer].token == 0) {
					next()
				} else {
					btnNext.disabled = false
				}
			} else {
				saveGame()
			}
		}
		curTile = undefined
		drawAll()
	}
	dragX = null
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
			players : players.map(item => {
				return {
					id : item.id,
					score : item.score
				}
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
					type : item.type
				}
			}),
			stack : tileStack,
			curPlayer : curPlayer
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
		images[src] = new Image(src);
		images[src].onload = images[src].onerror = function(){
			if(++count >= imgNum){
				callback(images)
			}
		};

		images[src].src = 'res/' + src + '.png'
	}
}

function switchGame(delta) {
	gameId += delta
	if(gameId < 0) {
		gameId = 0
	}
	restart()
	localStorage.setItem("gameId", gameId);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

