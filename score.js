
var scores = {
    roadMap : undefined,
    cityMap : undefined,
    farmMap : undefined,
    cloisterMap : undefined,
    tileId : 0,

    initScore : function() {
        this.roadMap = new Map()
        this.cityMap = new Map()
        this.farmMap = new Map()
        this.cloisterMap = new Map()
        tileId = 0;
    },
    addTile : function(tile) {
        tile.id = tileId
        tileId++
        tile.unfinished = []    // this part needs how many connections to fix
        tile.groups = []
        let board = updateBoardBase()
        let places = tile.type.place

        
        for(let pt of nearRect) {
            let x = tile.x + pt[0]
            let y = tile.y + pt[1]
            if(board[x][y]) {
                if(board[x][y].unfinished[tile.type.cloisterIndex]) {
                    board[x][y].unfinished[tile.type.cloisterIndex]--
                }
            }
        }

        for(let [index, place] of places.entries()) {
            if(place[2] == cloister) {
                let sum = 0     // tiles around cloister
                for(let pt of nearRect) {
                    let x = tile.x + pt[0]
                    let y = tile.y + pt[1]
                    if(board[x][y]) {
                        sum++
                    }
                }
                tile.unfinished[tile.type.cloisterIndex] = 9 - sum
            } else if(place[2] == road || place[2] == city) {
                let group = undefined
                tile.unfinished[index] = place[3].length
                for(let con of place[3]) {
                    let conXY = connectRect[con + 4 - tile.rotate & 3]
                    let tile2 = board[tile.x + conXY[0]][tile.y + conXY[1]]
                    if(tile2) {
                        tile.unfinished[index]--
                        let index2 = tile2.type.roadCityConnect[(con + 6 - tile.rotate + tile2.rotate) & 3]
                        let group2 = tile2.groups[index2]
                        tile2.unfinished[index2]--
                        if(tile2.unfinished[index2] == 0) {
                            group2[0].unfinished--
                        }
                        if(group) {
                            // merge 2 groups
                            if(group != group2[0]) {
                                group.unfinished += group2[0].unfinished
                                group.hasToken |= group2[0].hasToken
                                group.members = group.members.concat(group2[0].members)
                                group2[0] = group
                            }
                        } else {
                            group = group2[0]
                            tile.groups[index] = group2
                            group.members.push([tile, index])
                            group.unfinished++
                        }
                    }
                }
                if(group) {
                    if(tile.unfinished[index] == 0) {
                        group.unfinished--
                    }
                } else {
                    tile.groups[index] = [{
                        type : place[2],
                        unfinished : 1,
                        hasToken : false,
                        members : [[tile, index]]
                    }]
                }
            } else if(place[2] == farm) {
                
            }
        }
    },
    initTileType : function() {
        for(let [index, type] of tileTypes.entries()) {
            type.id = index
            type.roadCityConnect = [];
            type.farmConnect = [];
            for(let [index, place] of type.place.entries()) {
                if(!place[3]) {
                    break;
                }
                for(let c of place[3]) {
                    if(place[2] == cloister) {
                        type.cloisterIndex = index
                    } else if(place[2] == road) {
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