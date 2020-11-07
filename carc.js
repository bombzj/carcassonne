
let ctx, grid = 80, images = {}, cars, curTile, touchable = false, board=[], curMove, editMode = false, solving = false, curRotate = 0
let offsetX = 0, offsetY = 0
let touchX, touchY, tileStack, tiles

function init(c, boardW, boardH, exitX, exitY) {
	ctx = canvas.getContext("2d")
	let files = []
	for(let [index, item] of tileTypes.entries()) {
		files.push(index)
		item.id = index
	}
	loadImages(files, () => {
		drawAll()
	});

	
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
			touchend()
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
		touchend()
	}, false);
}

function restart() {
	editMode = false
	tileStack = []
	let start, end
	let rivers = []
	let others = []
	for(let tile of tileTypes) {
		if(tile.riverStart) {
			start = tile.id
		} else if(tile.riverEnd) {
			end = tile.id
		} else {
			let connect = tile.connect
			tile.isRiver = connect[0] == river || connect[1] == river || connect[2] == river || connect[3] == river	// river must connect to river
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
	shuffle(rivers)
	shuffle(others)
	tileStack = rivers.concat(end, others)
	
	tilesLeft.innerHTML = tileStack.length

	tiles = [
		[6, 4, 14, 0],
	]

	drawAll()
}

function shuffle(arr) {
	const len = arr.length
	if(len < 2) {
		return
	}
	for(let i = 0;i < len;i++) {
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

// toggle edit mode
function edit() {
	editMode = !editMode;
	if(editMode) {
		drawAll()
	} else {
		drawAll()
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
	for(let tile of tiles) {
		draw(tile[2], grid * tile[0] + offsetX, grid * tile[1] + offsetY, grid, grid, tile[3])
	}
	drawBackup()
}

function drawBackup() {
	let startX = 8.0
	let startY = 0.1
	let w = 0.6
	if(editMode) {
		for(let [index, tileType] of tileTypes.entries()) {
			draw(index, grid * startX, grid * startY, grid*w, grid*w, curRotate)
			tileType.position = [startX, startY, w, w];	// TODO: should be one time job
			startY += 0.62
			if((index + 1) % 12 == 0) {
				startX += 0.62
				startY = 0.1
			}
		}
	} else {
		if(tileStack.length > 0) {
			draw(tileStack[0], grid * startX, grid * startY, grid*0.8, grid*0.8, curRotate)
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
	if(editMode) {
		let x = ex / grid
		let y = ey / grid
		for(let [index, tileType] of tileTypes.entries()) {
			if(x >= tileType.position[0] && x < tileType.position[2] + tileType.position[0] &&
				y >= tileType.position[1] && y < tileType.position[3] + tileType.position[1]) {
				curTile = [-1, -1, index, curRotate]
				return;
			}
		}
	} else if(tileStack.length > 0){
		if(ex > 8 * grid && ey < grid) {
			curTile = [-1, -1, tileStack[0], curRotate]
			return;
		}
	}
	if(ex < 650 && ey < 650) {
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
	let x = Math.floor((ex - offsetX) / grid)
	let y = Math.floor((ey - offsetY) / grid)
	if(true) {
		if(curTile) {
			if(x >= -10 && x <= 20 && y >= -10 && y <= 20) {
				let board = updateBoardBase();
				let vacant = board[x][y] == undefined
				let connected = false;
				let connect = tileTypes[curTile[2]].connect
				let isRiver = tileTypes[curTile[2]].isRiver	// river must connect to river
				if(vacant) {
					let tile = board[x-1][y];
					if(tile) {
						vacant = connect[1 + curTile[3] & 3] == tileTypes[tile[2]].connect[3 + tile[3] & 3]
						if(vacant && (!isRiver || isRiver && connect[1 + curTile[3] & 3] == river)) {
							connected = true;
						}
					}
				}
				if(vacant) {
					let tile = board[x+1][y];
					if(tile) {
						vacant = connect[3 + curTile[3] & 3] == tileTypes[tile[2]].connect[1 + tile[3] & 3]
						if(vacant && (!isRiver || isRiver && connect[3 + curTile[3] & 3] == river)) {
							connected = true;
						}
					}
				}
				if(vacant) {
					let tile = board[x][y-1];
					if(tile) {
						vacant = connect[0 + curTile[3] & 3] == tileTypes[tile[2]].connect[2 + tile[3] & 3]
						if(vacant && (!isRiver || isRiver && connect[ + curTile[3] & 3] == river)) {
							connected = true;
						}
					}
				}
				if(vacant) {
					let tile = board[x][y+1];
					if(tile) {
						vacant = connect[2 + curTile[3] & 3] == tileTypes[tile[2]].connect[0 + tile[3] & 3]
						if(vacant && (!isRiver || isRiver && connect[2 + curTile[3] & 3] == river)) {
							connected = true;
						}
					}
				}
				if(vacant && connected) {
					curTile[0] = x
					curTile[1] = y
				} else {
					curTile[0] = -1
				}
			} else {
				curTile[0] = -1
			}
			if(curTile[0] == -1) {
				ctx.clearRect(0,0,canvas.width,canvas.height); 
				drawAll()
				draw(curTile[2], ex-grid/4, ey-grid/4, grid/2, grid/2, curRotate)
			} else {
				drawAll();
				draw(curTile[2], grid * curTile[0]+offsetX, grid * curTile[1]+offsetY, grid, grid, curRotate)
				drawBackup()
			}
		}
	}
}

function touchend() {
	if(curTile) {
		if(curTile[0] != -1) {
			tiles.push(curTile)
			if(!editMode) {
				tileStack.shift()
				tilesLeft.innerHTML = tileStack.length
			}
		}
		curTile = undefined
		drawAll()
	}
	dragX = null
}

// update board occupied
function updateBoard() {
	board = updateBoardBase()
}

function rotateBackup() {
	curRotate = (curRotate + 1) & 3
	drawAll()
}

function updateBoardBase() {
	let board = []
	for(let i = -10;i < 20;i++) {
		board[i] = []
	}
	for(let tile of tiles) {
		board[tile[0]][tile[1]] = tile
	}
	return board;
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

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}