
let boardWidth = 50
var scores = {
    roadMap : undefined,
    cityMap : undefined,
    farmMap : undefined,
    cloisterMap : undefined,
    tileId : 0,
    board : [],
    solutions : [],         // list of solutions
    solutionBoard: [],      // board of solutions in 2d array

    initScore : function() {
        this.roadMap = new Map()
        this.cityMap = new Map()
        this.farmMap = new Map()
        this.cloisterMap = new Map()
        tileId = 0
        for(let i = 0;i < boardWidth;i++) {
            this.board[i] = []
        }
    },
    addTiles : function(tiles) {
        for(let t of tiles) {
            this.addTile(t)
        }
    },
    addTile : function(tile) {
        this.board[tile.x][tile.y] = tile        // update board occupied
        tile.id = tileId
        tileId++
        tile.unfinished = []    // this part needs how many connections to fix
        tile.groups = []
        let places = tile.type.place

        
        for(let pt of nearRect) {
            let x = tile.x + pt[0]
            let y = tile.y + pt[1]
            let tile2 = this.board[x][y]
            if(tile2) {
                if(tile2.unfinished[tile2.type.cloisterIndex]) {
                    tile2.unfinished[tile2.type.cloisterIndex]--
                }
            }
        }
        // create a new group or merge with former groups
        for(let [index, place] of places.entries()) {
            if(place[2] == cloister) {
                let sum = 0     // tiles around cloister
                for(let pt of nearRect) {
                    let x = tile.x + pt[0]
                    let y = tile.y + pt[1]
                    if(this.board[x][y]) {
                        sum++
                    }
                }
                tile.unfinished[index] = 8 - sum
            } else if(place[2] == road || place[2] == city) {
                let group = undefined
                tile.unfinished[index] = place[3].length
                for(let con of place[3]) {
                    let conRotate = con + 4 - tile.rotate & 3
                    let conXY = connectRect[conRotate]
                    let tile2 = this.board[tile.x + conXY[0]][tile.y + conXY[1]]
                    if(tile2) {
                        tile.unfinished[index]--
                        let index2 = tile2.type.roadCityConnect[(oppositeCon4[conRotate] + tile2.rotate) & 3]
                        let group2 = tile2.groups[index2]
                        tile2.unfinished[index2]--
                        if(tile2.unfinished[index2] == 0) {
                            group2.unfinished--
                        }
                        if(group) {
                            // merge 2 groups
                            if(group != group2) {
                                group.unfinished += group2.unfinished
                                group.tokens = group.tokens.concat(group2.tokens)
                                group.members = group.members.concat(group2.members)
                                if(group2.inn) {
                                    group.inn = true
                                }
                                if(group2.cathedral) {
                                    group.cathedral = true
                                }
                                for(let item of group2.members) {
                                    item.tile.groups[item.index] = group
                                }
                            }
                        } else {
                            // merge one group
                            group = group2
                            tile.groups[index] = group2
                            group.members.push({tile : tile, index : index})
                            group.unfinished++
                            if(place.inn) {
                                group.inn = true
                            }
                            if(place.cathedral) {
                                group.cathedral = true
                            }
                        }
                    }
                }
                if(group) {
                    if(tile.unfinished[index] == 0) {
                        group.unfinished--
                        if(group.unfinished == 0 && gameExps.trader && place[2] == city && curPlayer >= 0) {
                            // grant goods to the player who finished the city, should avoid during loading (curPlayer is undefined)
                            let player = players[curPlayer]
                            for(let m of group.members) {
                                let place = m.tile.type.place[m.index]
                                if(place.wine) {
                                    player.goods[goodsWine]++
                                }
                                if(place.grain) {
                                    player.goods[goodsGrain]++
                                }
                                if(place.cloth) {
                                    player.goods[goodsCloth]++
                                }
                            }
                        }
                    }
                } else {
                    // create a new group
                    tile.groups[index] = group = {
                        type : place[2],
                        unfinished : 1,
                        members : [{tile : tile, index : index}],
                        tokens : []
                    }
                    if(place.inn) {
                        group.inn = true
                    }
                    if(place.cathedral) {
                        group.cathedral = true
                    }
                }
                if(gameExps.trader && curPlayer >= 0) {
                    // test the builder feature
                    if(group.tokens.some(t => t.player.id == curPlayer && t.type2 == tokenBuilder)) {
                        if(secondTile < 2) {
                            secondTile = 1
                        }
                    }
                }
            } else if(place[2] == farm) {
                let group = undefined
                for(let con of place[3]) {
                    let conRotate = con + 8 - (tile.rotate << 1) & 7
                    let conXY = connectRect[conRotate >> 1]
                    let tile2 = this.board[tile.x + conXY[0]][tile.y + conXY[1]]
                    if(tile2) {
                        let index2 = tile2.type.farmConnect[(oppositeCon8[conRotate] + (tile2.rotate << 1)) & 7]
                        let group2 = tile2.groups[index2]
                        if(group) {
                            // merge 2 groups
                            if(group != group2) {
                                group.tokens = group.tokens.concat(group2.tokens)
                                group.members = group.members.concat(group2.members)
                                for(let item of group2.members) {
                                    item.tile.groups[item.index] = group
                                }
                            }
                        } else {
                            group = group2
                            tile.groups[index] = group2
                            group.members.push({tile : tile, index : index})
                        }
                    }
                }
                if(group) {

                } else {
                    tile.groups[index] = {
                        type : place[2],
                        members : [{tile : tile, index : index}],
                        tokens : []
                    }
                }
            }
        }
    },

    // check completion for token
    checkToken : function () {
        tokens = tokens.filter(token => {
            if(token.done) {    // already calculated
                return false
            }
            if(token.type == farm) {
                return true
            }
            let tile = token.tile
            if(token.type == cloister) {
                if(tile.unfinished[token.index] == 0) {
                    token.player.score += 9
                    token.player.token++
                    // token.tile.tokens[token.index] = undefined
                    return false
                }
                return true
            }
            let group = tile.groups[token.index]

            let finished = group.unfinished == 0
            if(finished) {
                let members = group.members
                let number = new Set(members.map(x => x.tile.id)).size
                let addScore;
                if(token.type == road) {
                    if(group.inn) {
                        addScore = number * 2
                    } else {
                        addScore = number
                    }
                } else if(token.type == city) {
                    if(number == 2) {
                        if(group.cathedral) {
                            addScore = number * 2
                        } else {
                            addScore = number
                        }
                    } else {
                        for(let m of members) {
                            let place = m.tile.type.place[m.index]
                            if(place.flag) {
                                number++
                            }
                        }
                        if(group.cathedral) {
                            addScore = number * 3
                        } else {
                            addScore = number * 2
                        }
                    }
                }
                let tokenPlayers = []
                for(let token2 of group.tokens) {
                    // put back tokens
                    postRemoveTokenBase(token2)
                    // score 3 due to fairy
                    if(fairyToken && fairyToken == token2) {
                        fairyToken.player.score += 3
                    }
                    // token2.tile.tokens[token2.index] = undefined
                    token2.done = true
                    tokenPlayers.push(token2.player)
                    if(token2.type2 == tokenLarge) {    // a large meeple is twice as a normal one
                        tokenPlayers.push(token2.player)
                    }
                }
                // scoring
                tokenPlayers = getTopNumber(tokenPlayers)
                for(let player of tokenPlayers) {
                    player.score += addScore
                    addLog(player.color + ' completes a ' + placeName[token.type])
                    addLog(player.color + ' scores ' + addScore + ' score(s)')
                }
            }
            return !finished
        })
    },
    // find all possible places
    updateSolution(curType) {
        this.solutionBoard = []
        for(let i = 0;i < boardWidth;i++) {
            this.solutionBoard[i] = []
        }
        this.solutions = []
        for(let tile of tiles) {
            for(let c of connectRect) {
                let rotates = []
                let x = tile.x + c[0]
                let y = tile.y + c[1]
                if(this.solutionBoard[x][y]) {
                    continue
                }
                for(let rotate = 0;rotate < 4;rotate++) {
                    if(this.testPlace(x, y, curType, rotate)) {
                        rotates.push(rotate)
                    }
                }
                if(rotates.length != 0) {
                    let so = {
                        x: x,
                        y: y,
                        rotates: rotates
                    }
                    this.solutionBoard[x][y] = so
                    this.solutions.push(so)
                }
            }
        }
    },
    testPlace(x, y, type, rotate) {
        if(this.board[x][y] != undefined) {
            return false
        }
        let vacant = this.board[x][y] == undefined
        let connected = false
        let connect = type.connect
        let isRiver = type.isRiver	// river must connect to river
        if(vacant) {
            let tile = this.board[x-1][y];
            if(tile) {
                vacant = connect[1 + rotate & 3] == tile.type.connect[3 + tile.rotate & 3]
                if(vacant && (!isRiver || isRiver && connect[1 + rotate & 3] == river)) {
                    connected = true;
                }
            }
        }
        if(vacant) {
            let tile = this.board[x+1][y];
            if(tile) {
                vacant = connect[3 + rotate & 3] == tile.type.connect[1 + tile.rotate & 3]
                if(vacant && (!isRiver || isRiver && connect[3 + rotate & 3] == river)) {
                    connected = true;
                }
            }
        }
        if(vacant) {
            let tile = this.board[x][y-1];
            if(tile) {
                vacant = connect[0 + rotate & 3] == tile.type.connect[2 + tile.rotate & 3]
                if(vacant && (!isRiver || isRiver && connect[ + rotate & 3] == river)) {
                    connected = true;
                }
            }
        }
        if(vacant) {
            let tile = this.board[x][y+1];
            if(tile) {
                vacant = connect[2 + rotate & 3] == tile.type.connect[0 + tile.rotate & 3]
                if(vacant && (!isRiver || isRiver && connect[2 + rotate & 3] == river)) {
                    connected = true;
                }
            }
        }
        return vacant && connected
    },
    // check final score when endgame
    checkFinalToken : function () {
        for(let token of tokens) {
            if(token.done) {    // already calculated
                continue
            }
            let tile = token.tile
            if(token.type == cloister) {
                token.player.score2 += 9 - tile.unfinished[token.index]
                token.done = true
                continue
            }
            let group = tile.groups[token.index]

            let members = group.members
            let number = new Set(members.map(x => x.tile.id)).size
            let addScore = 0;
            if(token.type == road) {
                if(!group.inn) {
                    addScore = number
                }
            } else if(token.type == city) {
                for(let m of members) {
                    let place = m.tile.type.place[m.index]
                    if(place.flag) {
                        number++
                    }
                }
                if(!group.cathedral) {
                    addScore = number
                }
            } else if(token.type == farm) {
                let citys = new Set()   // add group here
                for(let m of members) {
                    let place = m.tile.type.place[m.index]
                    if(place[4]) {  // connect to city
                        for(let c of place[4]) {
                            if(m.tile.groups[c].unfinished == 0) {
                                citys.add(m.tile.groups[c])
                            }
                        }
                    }
                }
                addScore = citys.size
            }
            let tokenPlayers = []
            for(let token2 of group.tokens) {
                token2.done = true
                tokenPlayers.push(token2.player)
                if(token2.type2 == tokenLarge) {    // a large meeple is twice as a normal one
                    tokenPlayers.push(token2.player)
                }
            }
            tokenPlayers = getTopNumber(tokenPlayers)
            for(let player of tokenPlayers) {
                if(token.type == farm) {
                    if(group.tokens.some(t => t.player == player && t.type2 == tokenPig)) {
                        player.score2 += addScore * 4
                    } else {
                        player.score2 += addScore * 3
                    }
                } else {
                    player.score2 += addScore
                }
            }
        }
        if(gameExps.trader) {
            for(let g = 0;g < 3;g++) {
                // each goods, players with most goods get 10 score
                let maxPlayers = players.reduce((max, p) => {
                    if(max.length != 0) {
                        if(p.goods[g] > max[0].goods[g]) {
                            return [p]
                        } else if(p.goods[g] == max[0].goods[g]) {
                            return max.concat(p)
                        } else {
                            return max
                        }
                    } else {
                        if(p.goods[g] > 0) {
                            return [p]
                        } else {
                            return max
                        }
                    }
                }, [])
                for(let p of maxPlayers) {
                    p.score2 += 10
                }
            }
        }
    },

    initTileType : function() {
        for(let [index, type] of tileTypes.entries()) {
            type.id = index
            type.roadCityConnect = [];
            type.farmConnect = [];
            for(let [index, place] of type.place.entries()) {
                place.x = place[0]  // convert array data to object variables
                place.y = place[1]
                if(place[5]) {
                    for(let star of place[5]) {
                        if(star == starFlag) {
                            place.flag = true
                        } else if(star == starInn) {
                            place.inn = true
                        } else if(star == starCathedral) {
                            place.cathedral = true
                        } else if(star == starPrincess) {
                            place.princess = true
                        } else if(star == starWine) {
                            place.wine = true
                        } else if(star == starGrain) {
                            place.grain = true
                        } else if(star == starCloth) {
                            place.cloth = true
                        }
                    }
                }
                if(place[2] == cloister) {
                    type.cloisterIndex = index
                }
                if(!place[3]) {
                    break;
                }
                for(let c of place[3]) {
                    if(place[2] == road) {
                        type.roadCityConnect[c] = index
                    } else if(place[2] == city) {
                        type.roadCityConnect[c] = index
                    } else if(place[2] == farm) {
                        type.farmConnect[c] = index
                    }
                }
            }
        }
    }
}

const nearRect = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
]

const connectRect = [
    [0, -1],
    [-1, 0],
    [0, 1],
    [1, 0],
]

const oppositeCon4 = [2, 3, 0, 1]
const oppositeCon8 = [5, 4, 7, 6, 1, 0, 3, 2]

// 1 1 1 2 2 3 4 4 4 -> 1 4
function getTopNumber(arr) {
    let res = []
    for(let i of arr) {
        if(res[i.id]) {
            res[i.id].cnt++
        } else {
            res[i.id] = {id : i, cnt : 1}
        }
    }
    let max = res.reduce((res, y) => {
        return res > y.cnt ? res : y.cnt
    }, 0)
    return res.filter(x => {
        return x.cnt == max
    }).map(x => {
        return x.id
    })
}