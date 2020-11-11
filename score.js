
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
        let board = updateBoardBase()
        let places = tileTypes[tile[2]].place
        for(let [index, place] of places.entries()) {
            if(place[2] == cloister) {
                let sum = 0     // tiles around cloister
                for(let pt of nearRect) {
                    let x = tile[0] + pt[0]
                    let y = tile[1] + pt[1]
                    if(board[x][y]) {
                        sum++
                    }
                }
            } else if(place[2] == road) {
                
            } else if(place[2] == city) {
                
            } else if(place[2] == farm) {
                
            }
        }
    },
    initTileType : function() {
        for(let type of tileTypes) {
            type.roadConnect = [];
            type.cityConnect = [];
            type.farmConnect = [];
            for(let [index, place] of type.place.entries()) {
                if(place[3]) {
                    break;
                }
                for(let c of place[3]) {
                    if(place[2] == cloister) {
                        
                    } else if(place[2] == road) {
                        type.roadConnect[c] = index
                    } else if(place[2] == city) {
                        type.cityConnect[c] = index
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