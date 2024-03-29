const farm = 0
const road = 1
const city = 2
const river = 3
const cloister = 4
const placeName = ['field', 'road', 'city', 'river', 'monastery']

const starFlag = 1		// flag on a city
const starInn = 2		// inn on a road
const starCathedral = 3		// cathedrall in a city
const starPrincess = 4		// Princess in a city
const starVolcano = 5		// Volcano in a tile
const starPortal = 6		// Portal in a tile
const starDragon = 7		// Dragon in a tile
const starWine = 10		// goods wine in a city
const starGrain = 11		// goods grain in a city
const starCloth = 12		// goods cloth in a city

const expInn = 1
const expRiver = 2
const expRiver2 = 3
const expTrader = 4
const expDragon = 5
const expTower = 6
const expCatapult = 7
const expGeorge = 9999
const expTest = 10000

const goodsWine = 0
const goodsGrain = 1
const goodsCloth = 2

const tokenNormal = 0
const tokenLarge = 1
const tokenPig = 2
const tokenBuilder = 3
const tokenFairy = 4
const tokenPrincess = 5
const tokenName = ['meeple']

const initialTokenNumber = 7

const allColors = [
	'blue', 'red', 'green', 'yellow', 'black', 'pink'
]

const tileTypes = [
	{	// (0)	1 roads	
		count:	8,
		connect : [farm, road, farm, road],	// top left bottom right
		place: [
			[0.5, 0.25, farm, [0, 1, 2, 7]],	// x, y, type, direction, near which city(index)
			[0.5, 0.75, farm, [3, 4, 5, 6]],
			[0.5, 0.5, road, [1, 3]],
		]
	},
	{	// (1)	lake		
		count:	1,
		riverEnd : true,
		connect : [farm, river, farm, farm],
		exp : expRiver,
		volcano : true,
		place: [
			[0.2, 0.2, farm, [1,2,3,4,5,6,7,0]],
		]
	},
	{	// (2)	lake		
		count:	1,
		connect : [city, river, city, river],
		exp : expRiver,
		place: [
			[0.5, 0.15, city, [0]],
			[0.1, 0.3, farm, [2, 7], [0]],
			[0.1, 0.75, farm, [3, 6], [3]],
			[0.5, 0.87, city, [2]],
		]
	},
	{	// (3)	lake		
		count:	2,
		connect : [farm, river, river, farm],
		exp : expRiver,
		place: [
			[0.75, 0.3, farm, [0, 1, 2, 5, 6, 7]],
			[0.1, 0.85, farm, [3, 4]],
		]
	},
	{	// (4)	road+city
		count:	2,
		connect : [farm, road, city, road],
		place: [
			[0.5, 0.2, farm, [0, 1, 2, 7]],
			[0.5, 0.5, road, [1, 3]],
			[0.1, 0.7, farm, [3, 6], [3]],
			[0.5, 0.87, city, [2]],
		]
	},
	{	// (5)	turn road
		count:	9,
		connect : [farm, farm, road, road],
		place: [
			[0.3, 0.3, farm, [0,1,2,3,4,7]],
			[0.5, 0.5, road, [2, 3]],
			[0.8, 0.8, farm, [5,6]],
		]
	},
	{	// (6)	lake		
		count:	1,
		connect : [river, city, river, road],
		exp : expRiver,
		place: [
			[0.28, 0.15, farm, [1], [2]],
			[0.85, 0.2, farm, [0,7]],
			[0.15, 0.5, city, [1]],
			[0.5, 0.5, road, [3]],
			[0.3, 0.8, farm, [4], [2]],
			[0.8, 0.8, farm, [5,6]],
		]
	},
	{	// (7)	lake		
		count:	1,
		connect : [river, road, river, road],
		exp : expRiver,
		place: [
			[0.2, 0.2, farm, [1,2]],
			[0.8, 0.2, farm, [0,7]],
			[0.5, 0.5, road, [1, 3]],
			[0.25, 0.75, farm, [3,4]],
			[0.8, 0.75, farm, [5,6]],
		]
	},
	{	// (8)			
		count:	1,
		connect : [city, city, road, city],
		place: [
			[0.5, 0.3, city, [0, 1, 3]],
			[0.25, 0.85, farm, [4], [0]],
			[0.5, 0.8, road, [2]],
			[0.75, 0.85, farm, [5], [0]],
		]
	},
	{	// (9)			
		count:	2,
		connect : [city, farm, road, road],
		place: [
			[0.5, 0.2, city, [0]],
			[0.25, 0.7, farm, [2,3,4,7], [0]],
			[0.58, 0.58, road, [2, 3]],
			[0.8, 0.8, farm, [5,6]],
		]
	},
	{	// (10)			
		count:	2,
		connect : [road, city, city, road],
		place: [
			[0.85, 0.15, farm, [0,7]],
			[0.7, 0.3, road, [0, 3]],
			[0.5, 0.5, farm, [1,6], [3]],
			[0.2, 0.8, city, [1, 2]],
		]
	},
	{	// (11)			
		count:	1,
		connect : [city, city, city, city],
		place: [
			[0.5, 0.5, city, [0, 1, 2, 3], [], [starFlag]],
		]
	},
	{	// (12)			
		count:	2,
		connect : [city, city, road, road],
		place: [
			[0.3, 0.2, city, [0, 1], [], [starFlag]],
			[0.5, 0.5, farm, [4,7], [0]],
			[0.7, 0.7, road, [2, 3]],
			[0.85, 0.85, farm, [5,6]],
		]
	},
	{	// (13)			
		count:	1,
		connect : [farm, city, farm, city],
		place: [
			[0.5, 0.05, farm, [0,1], [1]],
			[0.5, 0.4, city, [1, 3], [], [starFlag]],
			[0.5, 0.87, farm, [4,5], [1]],
		]
	},
	{	// (14)	lake		
		count:	0,
		riverStart: true,
		connect : [farm, river, farm, farm],
		exp : expRiver,
		place: [
			[0.8, 0.2, farm, [1,2,3,4,5,6,7,0]]
		]
	},
	{	// (15)			
		count:	4,
		connect : [city, farm, farm, farm],
		place: [
			[0.5, 0.15, city, [0]],
			[0.5, 0.6, farm, [2,3,4,5,6,7] ,[0]],
		]
	},
	{	// (16)			
		count:	4,
		connect : [farm, farm, farm, farm],
		place: [
			[0.8, 0.8, farm, [0,1,2,3,4,5,6,7]],
			[0.5, 0.5, cloister, []],
		]
	},
	{	// (17)			
		count:	4,
		connect : [road, road, city, road],
		place: [
			[0.15, 0.15, farm, [1,2]],
			[0.85, 0.15, farm, [0,7]],
			[0.5, 0.53, farm, [3,6], [6]],
			[0.5, 0.15, road, [0]],
			[0.2, 0.4, road, [1]],
			[0.8, 0.43, road, [3]],
			[0.5, 0.85, city, [2]],
		]
	},
	{	// (18)			
		count:	4,
		connect : [city, farm, city, farm],
		place: [
			[0.5, 0.15, city, [0]],
			[0.5, 0.5, farm, [2,3,6,7], [0,2]],
			[0.5, 0.85, city, [2]],
		]
	},
	{	// (19)			
		count:	3,
		connect : [city, city, farm, city],
		place: [
			[0.5, 0.3, city, [0, 1, 3]],
			[0.5, 0.85, farm, [4,5], [0]],
		]
	},
	{	// (20)			
		count:	4,
		connect : [city, city, farm, farm],
		place: [
			[0.2, 0.3, city, [0, 1], [], [starFlag]],
			[0.7, 0.7, farm, [4,5,6,7], [0]],
		]
	},
	{	// (21)	crossing		
		count:	1,
		connect : [road, road, road, road],
		place: [
			[0.5, 0.2, road, [0]],
			[0.2, 0.5, road, [1]],
			[0.8, 0.5, road, [3]],
			[0.5, 0.8, road, [2]],
			[0.2, 0.2, farm, [1, 2]],
			[0.2, 0.8, farm, [3, 4]],
			[0.8, 0.8, farm, [5, 6]],
			[0.8, 0.2, farm, [7, 0]],
		]
	},
	{	// (22)			
		count:	2,
		connect : [city, city, road, city],
		place: [
			[0.5, 0.3, city, [0, 1, 3], [], [starFlag]],
			[0.25, 0.85, farm, [4], [0]],
			[0.5, 0.8, road, [2]],
			[0.75, 0.85, farm, [5], [0]],
		]
	},
	{	// (23)			
		count:	1,
		connect : [farm, city, farm, city],
		place: [
			[0.5, 0.05, farm, [0,1], [1]],
			[0.5, 0.4, city, [1, 3]],
			[0.5, 0.87, farm, [4,5], [1]],
		]
	},
	{	// (24)			
		count:	2,
		connect : [road, farm, city, road],
		place: [
			[0.85, 0.15, farm, [0,7]],
			[0.65, 0.35, road, [0, 3]],
			[0.3, 0.5, farm, [1,2,3,6], [3]],
			[0.5, 0.87, city, [2]],
		]
	},
	{	// (25)			
		count:	1,
		connect : [city, city, farm, city],
		place: [
			[0.5, 0.3, city, [0, 1, 3], [], [starFlag]],
			[0.5, 0.85, farm, [4,5], [0]],
		]
	},
	{	// (26)			
		count:	4,
		connect : [farm, road, road, road],
		place: [
			[0.5, 0.2, farm, [0,1,2,7]],
			[0.2, 0.8, farm, [3,4]],
			[0.8, 0.8, farm, [5,6]],
			[0.15, 0.5, road, [1]],
			[0.85, 0.5, road, [3]],
			[0.5, 0.8, road, [2]],
		]
	},
	{	// (27)			
		count:	2,
		connect : [farm, farm, road, farm],
		place: [
			[0.8, 0.2, farm, [1,2,3,4,5,6,7,0]],
			[0.45, 0.8, road, [2]],
			[0.5, 0.45, cloister, []],
		]
	},
	{	// (28)			
		count:	4,
		connect : [city, city, farm, farm],
		place: [
			[0.5, 0.15, city, [0]],
			[0.1, 0.5, city, [1]],
			[0.6, 0.8, farm, [4,5,6,7], [0,1]],
		]
	},
	{	// (29)	lake		
		count:	1,
		connect : [river, farm, river, farm],
		exp : expRiver,
		place: [
			[0.15, 0.5, farm, [1,2,3,4]],
			[0.85, 0.5, farm, [0,5,6,7]],
		]
	},
	{	// (30)	lake		
		count:	1,
		connect : [river, river, city, city],
		exp : expRiver,
		place: [
			[0.1, 0.1, farm, [1,2]],
			[0.5, 0.5, farm, [0,3], [2]],
			[0.80, 0.65, city, [2, 3], [], [starFlag]],
		]
	},
	{	// (31)	lake		
		count:	1,
		connect : [farm, river, road, river],
		exp : expRiver,
		place: [
			[0.15, 0.15, farm, [7,0,1,2]],
			[0.1, 0.9, farm, [3,4]],
			[0.9, 0.9, farm, [5,6]],
			[0.5, 0.75, road, [2]],
			[0.45, 0.4, cloister, []],
		]
	},
	{	// (32)	lake		
		count:	1,
		connect : [road, river, river, road],
		exp : expRiver,
		place: [
			[0.15, 0.85, farm, [3,4]],
			[0.3, 0.2, farm, [1,2,5,6]],
			[0.7, 0.3, road, [0, 3]],
			[0.85, 0.15, farm, [0,7]],
		]
	},
	{	// (33)	lake		
		count:	1,
		connect : [river, farm, river, farm],
		exp : expRiver,
		place: [
			[0.15, 0.5, farm, [1,2,3,4]],
			[0.85, 0.2, farm, [0,5,6,7]],
		]
	},
	{	// (34)	lake		
		count:	1,
		connect : [river, farm, farm, river],
		exp : expRiver2,
		place: [
			[0.3, 0.6, farm, [1,2,3,4,5,6]],
			[0.9, 0.1, farm, [0,7]],
		]
	},
	{	// (35)	lake		
		count:	1,
		connect : [river, city, river, city],
		exp : expRiver2,
		place: [
			[0.1, 0.5, city, [1, 3]],
			[0.28, 0.8, farm, [1,4], [0]],
			[0.80, 0.8, farm, [5,0], [0]],
		]
	},
	{	// (36)	lake		
		count:	0,
		connect : [river, river, farm, river],
		exp : expRiver2,
		place: [
			[0.2, 0.2, farm, [1,2]],
			[0.5, 0.8, farm, [3,4,5,6]],
			[0.8, 0.2, farm, [0,7]],
		]
	},
	{	// (37)	lake		
		count:	1,
		connect : [city, farm, river, farm],
		exp : expRiver2,
		place: [
			[0.5, 0.15, city, [0]],
			[0.2, 0.8, farm, [2,3,4], [0]],
			[0.8, 0.8, farm, [5,6,7], [0]],
		]
	},
	{	// (38)			
		count:	1,
		connect : [farm, city, farm, farm],
		exp : expInn,
		place: [
			[0.45, 0.45, city, [1]],
			[0.5, 0.15, farm, [0,1], [0]],
			[0.8, 0.8, farm, [4,5,6,7], [0]],
		]
	},
	{	// (39)			
		count:	1,
		connect : [city, city, farm, city],
		exp : expInn,
		place: [
			[0.5, 0.1, city, [0]],
			[0.15, 0.5, city, [1]],
			[0.85, 0.5, city, [3]],
			[0.5, 0.5, farm, [4,5], [0,1,2]],
		]
	},
	{	// (40)			
		count:	1,
		exp : expInn,
		connect : [city, farm, road, farm],
		place: [
			[0.5, 0.15, city, [0]],
			[0.2, 0.5, farm, [2,3,4], [0]],
			[0.8, 0.5, farm, [5,6,7], [0]],
			[0.5, 0.8, road, [2]],
		]
	},
	{	// (41)			
		count:	1,
		connect : [city, city, city, city],
		exp : expInn,
		place: [
			[0.5, 0.15, city, [0]],
			[0.1, 0.5, city, [1]],
			[0.5, 0.85, city, [2]],
			[0.9, 0.5, city, [3]],
			[0.5, 0.5, farm, [], [0,1,2,3]],
		]
	},
	{	// (42)			
		count:	1,
		exp : expInn,
		connect : [road, road, road, road],
		place: [
			[0.3, 0.3, road, [0, 1]],
			[0.6, 0.6, road, [2, 3]],
			[0.1, 0.1, farm, [1, 2]],
			[0.8, 0.2, farm, [0,3,4,7]],
			[0.85, 0.85, farm, [5,6]],
		]
	},
	{	// (43)			
		count:	1,
		exp : expInn,
		connect : [road, city, road, city],
		place: [
			[0.15, 0.5, city, [1]],
			[0.85, 0.5, city, [3]],
			[0.5, 0.15, road, [0]],
			[0.5, 0.85, road, [2]],
			[0.25, 0.1, farm, [1], [0]],
			[0.75, 0.1, farm, [0], [1]],
			[0.25, 0.9, farm, [4], [0]],
			[0.75, 0.9, farm, [5], [1]],
		]
	},
	{	// (44)			
		count:	4,
		connect : [city, city, farm, farm],
		place: [
			[0.2, 0.3, city, [0, 1]],
			[0.7, 0.7, farm, [4,5,6,7], [0]],
		]
	},
	{	// (45)			
		count:	0,
		connect : [river, river, river, river],
		exp : expGeorge,
		place: [
			[0.15, 0.15, farm, [1, 2]],
			[0.15, 0.85, farm, [3, 4]],
			[0.85, 0.85, farm, [5, 6]],
			[0.85, 0.15, farm, [7, 0]],
		]
	},
	{	// (46)	lake + ?	
		count:	1,
		connect : [river, farm, river, farm],
		exp : expRiver2,
		place: [
			[0.15, 0.5, farm, [1,2,3,4]],
			[0.85, 0.85, farm, [0,5,6,7]],
			[0.6, 0.45, cloister, []],
		]
	},
	{	// (47)	turn road
		count:	1,
		connect : [farm, farm, road, road],
		exp : expInn,
		place: [
			[0.2, 0.2, farm, [0,1,2,3,4,7]],
			[0.5, 0.5, road, [2, 3], [], [starInn]],
			[0.8, 0.8, farm, [5,6]],
		]
	},
	{	// (48)	1 roads	
		count:	1,
		connect : [farm, road, farm, road],	// top left bottom right
		exp : expInn,
		place: [
			[0.5, 0.25, farm, [0, 1, 2, 7]],
			[0.5, 0.75, farm, [3, 4, 5, 6]],
			[0.5, 0.5, road, [1, 3], [], [starInn]],
		]
	},
	{	// (49)			
		count:	1,
		connect : [farm, road, road, road],
		exp : expInn,
		place: [
			[0.5, 0.2, farm, [0,1,2,7]],
			[0.2, 0.8, farm, [3,4]],
			[0.8, 0.8, farm, [5,6]],
			[0.15, 0.5, road, [1]],
			[0.85, 0.5, road, [3], [], [starInn]],
			[0.5, 0.8, road, [2]],
		]
	},
	{	// (50)			
		count:	1,
		connect : [farm, road, farm, road],
		exp : expInn,
		place: [
			[0.8, 0.2, farm, [0,1,2,7]],
			[0.2, 0.8, farm, [3,4,5,6]],
			[0.15, 0.5, road, [1]],
			[0.85, 0.5, road, [3]],
			[0.5, 0.5, cloister, []],
		]
	},
	{	// (51)			
		count:	1,
		connect : [city, farm, road, city],
		exp : expInn,
		place: [
			[0.8, 0.2, city, [0,3]],
			[0.15, 0.6, farm, [2,3,4], [0]],
			[0.75, 0.9, farm, [5], [0]],
			[0.45, 0.7, road, [2]],
		]
	},
	{	// (52)			
		count:	2,
		connect : [city, city, city, city],
		exp : expInn,
		place: [
			[0.5, 0.5, city, [0, 1, 2, 3], [], [starCathedral]],
		]
	},
	{	// (53)			
		count:	1,
		connect : [city, city, road, road],
		exp : expInn,
		place: [
			[0.3, 0.2, city, [0, 1], [], [starFlag]],
			[0.5, 0.5, farm, [4,7], [0]],
			[0.7, 0.7, road, [2, 3], [], [starInn]],
			[0.9, 0.9, farm, [5,6]],
		]
	},
	{	// (54)			
		count:	1,
		connect : [road, farm, city, road],
		exp : expInn,
		place: [
			[0.85, 0.15, farm, [0,7]],
			[0.65, 0.35, road, [0, 3], [], [starInn]],
			[0.3, 0.5, farm, [1,2,3,6], [3]],
			[0.5, 0.87, city, [2]],
		]
	},
	{	// (55)			
		count:	1,
		connect : [city, city, road, farm],
		exp : expInn,
		place: [
			[0.2, 0.2, city, [0,1]],
			[0.2, 0.85, farm, [4], [0]],
			[0.8, 0.6, farm, [5,6,7], [0]],
			[0.5, 0.8, road, [2], [], [starInn]],
		]
	},
	{	// (56)			
		count:	1,
		connect : [city, city, city, farm],
		exp : expInn,
		place: [
			[0.2, 0.3, city, [0, 1], [], [starFlag]],
			[0.7, 0.5, farm, [6,7], [0,2]],
			[0.5, 0.85, city, [2]],
		]
	},
	{	// (57)			
		count:	1,
		connect : [road, city, road, city],
		exp : expInn,
		place: [
			[0.8, 0.05, farm, [0], [1]],
			[0.5, 0.4, city, [1, 3], [], [starFlag]],
			[0.2, 0.05, farm, [1], [1]],
			[0.2, 0.87, farm, [4], [1]],
			[0.8, 0.87, farm, [5], [1]],
			[0.5, 0.1, road, [0]],
			[0.5, 0.9, road, [2]],
		]
	},
	{	// (58)			
		count:	1,
		connect : [farm, road, road, road],
		exp : expTrader,
		place: [
			[0.5, 0.2, farm, [0,1,2,7]],
			[0.2, 0.8, farm, [3,4]],
			[0.8, 0.8, farm, [5,6]],
			[0.15, 0.5, road, [1]],
			[0.85, 0.5, road, [3]],
			[0.5, 0.8, road, [2]],
			[0.5, 0.5, cloister, []],
		]
	},
	{	// (59)			
		count:	1,
		connect : [city, farm, farm, road],
		exp : expTrader,
		place: [
			[0.5, 0.2, city, [0]],
			[0.25, 0.7, farm, [2,3,4,5,6], [0]],
			[0.6, 0.55, road, [3]],
			[0.85, 0.3, farm, [7]],
		]
	},
	{	// (60)			
		count:	1,
		connect : [city, road, road, farm],
		exp : expTrader,
		place: [
			[0.5, 0.15, city, [0]],
			[0.2, 0.8, farm, [2,3,4], [0]],
			[0.8, 0.8, farm, [5,6,7], [0]],
			[0.5, 0.8, road, [2]],
			[0.2, 0.5, road, [1]],
		]
	},
	{	// (61)	
		count:	1,
		connect : [road, road, road, road],
		exp : expTrader,
		place: [
			[0.15, 0.8, farm, [1,2,3,4]],
			[0.85, 0.8, farm, [0,5,6,7]],
			[0.5, 0.2, road, [0, 2]],
			[0.2, 0.5, road, [1, 3]],
		]
	},
	{	// (62)			
		count:	1,
		connect : [farm, city, city, city],
		exp : expTrader,
		place: [
			[0.5, 0.05, farm, [0,1], [1]],
			[0.5, 0.4, city, [1, 3], [], [starCloth]],
			[0.75, 0.75, farm, [], [1,3]],
			[0.5, 0.9, city, [2]],
		]
	},
	{	// (63)			
		count:	1,
		connect : [city, city, city, city],
		exp : expTrader,
		place: [
			[0.4, 0.2, city, [0, 1], [], [starCloth]],
			[0.55, 0.55, farm, [], [0,2,3]],
			[0.5, 0.85, city, [2]],
			[0.9, 0.5, city, [3]],
		]
	},
	{	// (64)			
		count:	1,
		connect : [city, city, city, road],
		exp : expTrader,
		place: [
			[0.5, 0.2, city, [0, 1], [], [starCloth]],
			[0.9, 0.7, farm, [6], [0,2]],
			[0.5, 0.85, city, [2]],
			[0.67, 0.52, road, [3]],
			[0.9, 0.3, farm, [7], [0,2]],
		]
	},
	{	// (65)			
		count:	1,
		connect : [city, farm, road, city],
		exp : expTrader,
		place: [
			[0.7, 0.2, city, [0,3], [], [starCloth]],
			[0.15, 0.6, farm, [2,3,4], [0]],
			[0.75, 0.9, farm, [5], [0]],
			[0.45, 0.7, road, [2]],
		]
	},
	{	// (66)			
		count:	1,
		connect : [city, city, road, road],
		exp : expTrader,
		place: [
			[0.2, 0.87, farm, [4], [1]],
			[0.4, 0.4, city, [0, 1], [], [starCloth]],
			[0.7, 0.87, farm, [5], [1]],
			[0.9, 0.7, farm, [6], [1]],
			[0.9, 0.2, farm, [7], [1]],
			[0.45, 0.9, road, [2]],
			[0.9, 0.45, road, [3]],
		]
	},
	{	// (67)			
		count:	1,
		connect : [city, city, city, road],
		exp : expTrader,
		place: [
			[0.5, 0.2, city, [0, 1], [], [starGrain]],
			[0.9, 0.7, farm, [6], [0,2]],
			[0.5, 0.85, city, [2]],
			[0.67, 0.52, road, [3]],
			[0.9, 0.3, farm, [7], [0,2]],
		]
	},
	{	// (68)			
		count:	1,
		connect : [city, city, road, farm],
		exp : expTrader,
		place: [
			[0.2, 0.87, farm, [4], [1]],
			[0.4, 0.4, city, [0, 1], [], [starGrain]],
			[0.7, 0.87, farm, [5], [1]],
			[0.9, 0.5, farm, [6,7], [1]],
			[0.45, 0.9, road, [2]],
		]
	},
	{	// (69)			
		count:	1,
		connect : [city, city, farm, city],
		exp : expTrader,
		place: [
			[0.5, 0.3, city, [0, 1, 3], [], [starGrain]],
			[0.5, 0.85, farm, [4,5], [0]],
		]
	},
	{	// (70)			
		count:	1,
		connect : [city, city, farm, farm],
		exp : expTrader,
		place: [
			[0.2, 0.3, city, [0, 1], [], [starGrain]],
			[0.7, 0.7, farm, [4,5,6,7], [0]],
		]
	},
	{	// (71)			
		count:	1,
		connect : [city, city, road, farm],
		exp : expTrader,
		place: [
			[0.2, 0.2, city, [0,1], [], [starGrain]],
			[0.2, 0.85, farm, [4], [0]],
			[0.8, 0.6, farm, [5,6,7], [0]],
			[0.5, 0.8, road, [2]],
		]
	},
	{	// (72)			
		count:	1,
		connect : [farm, city, road, city],
		exp : expTrader,
		place: [
			[0.5, 0.05, farm, [0,1], [1]],
			[0.5, 0.4, city, [1, 3], [], [starGrain]],
			[0.2, 0.87, farm, [4], [1]],
			[0.8, 0.87, farm, [5], [1]],
			[0.5, 0.9, road, [2]],
		]
	},
	{	// (73)			
		count:	1,
		exp : expTrader,
		connect : [city, city, farm, road],
		place: [
			[0.5, 0.87, farm, [4,5], [1]],
			[0.4, 0.4, city, [0, 1], [], [starWine]],
			[0.9, 0.7, farm, [6], [1]],
			[0.9, 0.2, farm, [7], [1]],
			[0.9, 0.45, road, [3]],
		]
	},
	{	// (74)			
		count:	1,
		connect : [city, city, road, city],
		exp : expTrader,
		place: [
			[0.5, 0.3, city, [0, 1, 3], [], [starWine]],
			[0.25, 0.85, farm, [4], [0]],
			[0.5, 0.8, road, [2]],
			[0.75, 0.85, farm, [5], [0]],
		]
	},
	{	// (75)			
		count:	1,
		connect : [city, city, road, road],
		exp : expTrader,
		place: [
			[0.2, 0.2, city, [0,1], [], [starWine]],
			[0.2, 0.85, farm, [4], [0]],
			[0.8, 0.8, farm, [5,6], [0]],
			[0.5, 0.8, road, [2]],
			[0.9, 0.25, farm, [7], [0]],
			[0.9, 0.5, road, [3]],
		]
	},
	{	// (76)			
		count:	1,
		connect : [city, city, farm, farm],
		exp : expTrader,
		place: [
			[0.2, 0.3, city, [0, 1], [], [starWine]],
			[0.7, 0.7, farm, [4,5,6,7], [0]],
		]
	},
	{	// (77)			
		count:	1,
		connect : [farm, city, road, city],
		exp : expTrader,
		place: [
			[0.5, 0.05, farm, [0,1], [1]],
			[0.5, 0.4, city, [1, 3], [], [starWine]],
			[0.2, 0.87, farm, [4], [1]],
			[0.8, 0.87, farm, [5], [1]],
			[0.5, 0.9, road, [2]],
		]
	},
	{	// (78)			
		count:	1,
		exp : expTrader,
		connect : [road, city, road, city],
		place: [
			[0.8, 0.05, farm, [0], [1]],
			[0.5, 0.4, city, [1, 3], [], [starWine]],
			[0.2, 0.05, farm, [1], [1]],
			[0.2, 0.87, farm, [4], [1]],
			[0.8, 0.87, farm, [5], [1]],
			[0.5, 0.1, road, [0]],
			[0.5, 0.9, road, [2]],
		]
	},
	{	// (79)			
		count:	1,
		connect : [farm, city, farm, city],
		exp : expTrader,
		place: [
			[0.5, 0.05, farm, [0,1], [1]],
			[0.5, 0.4, city, [1, 3], [], [starWine]],
			[0.5, 0.87, farm, [4,5], [1]],
		]
	},
	{	// (80)			
		count:	1,
		connect : [farm, city, city, city],
		exp : expTrader,
		place: [
			[0.5, 0.05, farm, [0,1], [1]],
			[0.5, 0.4, city, [1, 3], [], [starWine]],
			[0.75, 0.75, farm, [], [1,3]],
			[0.5, 0.9, city, [2]],
		]
	},
	{	// (81)			
		count:	1,
		connect : [city, city, city, city],
		exp : expTrader,
		place: [
			[0.4, 0.2, city, [0, 1], [], [starWine]],
			[0.55, 0.55, farm, [], [0,2]],
			[0.85, 0.85, city, [2, 3]],
		]
	},
	{	// (82)	lake		
		count:	1,
		connect : [farm, river, river, farm],
		exp : expRiver2,
		place: [
			[0.75, 0.3, farm, [0, 1, 2, 5, 6, 7]],
			[0.1, 0.85, farm, [3, 4]],
		]
	},
	{	// (83)	lake		
		count:	1,
		connect : [river, river, city, city],
		exp : expRiver2,
		place: [
			[0.1, 0.1, farm, [1,2]],
			[0.5, 0.5, farm, [0,3], [2]],
			[0.80, 0.65, city, [2, 3]],
		]
	},
	{	// (84)	lake		
		count:	1,
		connect : [road, river, river, road],
		exp : expRiver2,
		place: [
			[0.15, 0.85, farm, [3,4]],
			[0.3, 0.2, farm, [1,2,5,6]],
			[0.7, 0.3, road, [0, 3]],
			[0.85, 0.15, farm, [0,7]],
		]
	},
	{	// (85)	lake		
		count:	1,
		connect : [river, road, river, road],
		exp : expRiver2,
		place: [
			[0.2, 0.2, farm, [1,2]],
			[0.8, 0.2, farm, [0,7]],
			[0.5, 0.5, road, [1, 3], [], [starInn]],
			[0.25, 0.75, farm, [3,4]],
			[0.8, 0.75, farm, [5,6]],
		]
	},
	{	// (86)	lake		
		count:	1,
		connect : [river, city, river, road],
		exp : expRiver2,
		place: [
			[0.28, 0.15, farm, [1], [2]],
			[0.85, 0.2, farm, [0,7]],
			[0.15, 0.5, city, [1]],
			[0.5, 0.5, road, [3]],
			[0.3, 0.8, farm, [4], [2]],
			[0.8, 0.8, farm, [5,6]],
		]
	},
	{	// (87)			
		count:	1,
		exp : expDragon,
		template: 19,
		princess: true,
		connect : [city, city, farm, city],
		place: [
			[0.5, 0.3, city, [0, 1, 3], [], [starPrincess]],
			[0.5, 0.85, farm, [4,5], [0]],
		]
	},
	{	// (88)			
		count:	1,
		exp : expDragon,
		template: 17,
		princess: true,
		connect : [road, road, city, road],
		place: [
			[0.15, 0.15, farm, [1,2]],
			[0.85, 0.15, farm, [0,7]],
			[0.5, 0.53, farm, [3,6], [6]],
			[0.5, 0.15, road, [0]],
			[0.2, 0.4, road, [1]],
			[0.8, 0.43, road, [3]],
			[0.5, 0.85, city, [2], [], [starPrincess]],
		]
	},
	{	// (89)			
		count:	1,
		exp : expDragon,
		template: 44,
		princess: true,
		connect : [city, city, farm, farm],
		place: [
			[0.2, 0.3, city, [0, 1], [], [starPrincess]],
			[0.7, 0.7, farm, [4,5,6,7], [0]],
		]
	},
	{	// (90)			
		count:	1,
		exp : expDragon,
		princess: true,
		connect : [city, city, farm, farm],
		place: [
			[0.5, 0.87, farm, [4,5], [1]],
			[0.4, 0.4, city, [0, 1], [], [starPrincess]],
			[0.9, 0.5, farm, [6,7], [1]],
		]
	},
	{	// (91)			
		count:	1,
		exp : expDragon,
		template: 10,
		princess: true,
		connect : [road, city, city, road],
		place: [
			[0.85, 0.15, farm, [0,7]],
			[0.7, 0.3, road, [0, 3]],
			[0.5, 0.5, farm, [1,6], [3]],
			[0.2, 0.8, city, [1, 2], [], [starPrincess]],
		]
	},
	{	// (92)			
		count:	1,
		exp : expDragon,
		princess: true,
		connect : [city, farm, city, city],
		place: [
			[0.5, 0.2, city, [0], [], [starPrincess]],
			[0.55, 0.55, farm, [], [0,2]],
			[0.85, 0.85, city, [2, 3], [], [starFlag]],
			[0.1, 0.3, farm, [2,3], [0]],
		]
	},
	{	// (93)			
		count:	1,
		exp : expDragon,
		volcano: true,
		connect : [farm, farm, road, farm],
		place: [
			[0.8, 0.2, farm, [1,2,3,4,5,6,7,0]],
			[0.5, 0.8, road, [2]],
		]
	},
	{	// (94)			
		count:	1,
		exp : expDragon,
		template: 0,
		volcano: true,
		connect : [farm, road, farm, road],
		place: [
			[0.7, 0.25, farm, [0, 1, 2, 7]],
			[0.5, 0.85, farm, [3, 4, 5, 6]],
			[0.5, 0.6, road, [1, 3]],
		]
	},
	{	// (95)			
		count:	1,
		exp : expDragon,
		volcano: true,
		connect : [farm, farm, farm, farm],
		place: [
			[0.7, 0.3, farm, [1,2,3,4,5,6,7,0]],
		]
	},
	{	// (96)			
		count:	1,
		exp : expDragon,
		template: 5,
		volcano: true,
		connect : [farm, farm, road, road],
		place: [
			[0.8, 0.2, farm, [0,1,2,3,4,7]],
			[0.6, 0.6, road, [2, 3]],
			[0.8, 0.8, farm, [5,6]],
		]
	},
	{	// (97)			
		count:	1,
		exp : expDragon,
		template: 28,
		volcano: true,
		connect : [city, city, farm, farm],
		place: [
			[0.5, 0.15, city, [0]],
			[0.1, 0.5, city, [1]],
			[0.5, 0.6, farm, [4,5,6,7], [0,1]],
		]
	},
	{	// (98)			
		count:	1,
		exp : expDragon,
		template: 15,
		volcano: true,
		connect : [city, farm, farm, farm],
		place: [
			[0.5, 0.15, city, [0]],
			[0.7, 0.6, farm, [2,3,4,5,6,7] ,[0]],
		]
	},
	{	// (99)			
		count:	1,
		exp : expDragon,
		template: 25,
		portal: true,
		connect : [city, city, farm, city],
		place: [
			[0.5, 0.3, city, [0, 1, 3], [], [starFlag]],
			[0.5, 0.85, farm, [4,5], [0]],
		]
	},
	{	// (100)			
		count:	1,
		exp : expDragon,
		template: 24,
		portal: true,
		connect : [road, farm, city, road],
		place: [
			[0.85, 0.15, farm, [0,7]],
			[0.65, 0.35, road, [0, 3]],
			[0.3, 0.5, farm, [1,2,3,6], [3]],
			[0.5, 0.87, city, [2]],
		]
	},
	{	// (101)			
		count:	1,
		exp : expDragon,
		portal: true,
		connect : [farm, road, road, road],
		place: [
			[0.5, 0.2, farm, [0,1,2,7]],
			[0.2, 0.8, farm, [3,4]],
			[0.8, 0.8, farm, [5,6]],
			[0.15, 0.5, road, [1]],
			[0.85, 0.5, road, [3]],
			[0.5, 0.8, road, [2]],
		]
	},
	{	// (102)			
		count:	1,
		exp : expDragon,
		template: 10,
		portal: true,
		connect : [road, city, city, road],
		place: [
			[0.85, 0.15, farm, [0,7]],
			[0.7, 0.3, road, [0, 3]],
			[0.5, 0.5, farm, [1,6], [3]],
			[0.2, 0.8, city, [1, 2]],
		]
	},
	{	// (103)			
		count:	1,
		exp : expDragon,
		template: 9,
		portal: true,
		connect : [city, farm, road, road],
		place: [
			[0.5, 0.2, city, [0]],
			[0.25, 0.7, farm, [2,3,4,7], [0]],
			[0.58, 0.58, road, [2, 3]],
			[0.8, 0.8, farm, [5,6]],
		]
	},
	{	// (104)			
		count:	1,
		exp : expDragon,
		template: 42,
		portal: true,
		connect : [road, road, road, road],
		place: [
			[0.3, 0.3, road, [0, 1]],
			[0.6, 0.6, road, [2, 3]],
			[0.1, 0.1, farm, [1, 2]],
			[0.8, 0.2, farm, [0,3,4,7]],
			[0.85, 0.85, farm, [5,6]],
		]
	},
	{	// (105)			
		count:	1,
		exp : expDragon,
		template: 26,
		dragon: true,
		connect : [farm, road, road, road],
		place: [
			[0.5, 0.2, farm, [0,1,2,7]],
			[0.2, 0.8, farm, [3,4]],
			[0.8, 0.8, farm, [5,6]],
			[0.15, 0.5, road, [1]],
			[0.85, 0.5, road, [3]],
			[0.5, 0.8, road, [2]],
		]
	},
	{	// (106)			
		count:	1,
		exp : expDragon,
		dragon: true,
		connect : [city, city, farm, city],
		place: [
			[0.8, 0.4, city, [0, 1, 3]],
			[0.5, 0.85, farm, [4,5], [0]],
			[0.4, 0.5, cloister, []],
		]
	},
	{	// (107)
		count:	2,
		exp : expDragon,
		template: 5,
		dragon: true,
		connect : [farm, farm, road, road],
		place: [
			[0.3, 0.3, farm, [0,1,2,3,4,7]],
			[0.5, 0.5, road, [2, 3]],
			[0.8, 0.8, farm, [5,6]],
		]
	},
	{	// (108)			
		count:	1,
		exp : expDragon,
		dragon: true,
		connect : [road, city, road, city],
		place: [
			[0.8, 0.05, farm, [0,1], [1]],
			[0.5, 0.4, city, [1, 3]],
			[0.2, 0.87, farm, [4,5], [1]],
			[0.5, 0.1, road, [0, 2]],
		]
	},
	{	// (109)			
		count:	1,
		exp : expDragon,
		template: 15,
		dragon: true,
		connect : [city, farm, farm, farm],
		place: [
			[0.5, 0.15, city, [0]],
			[0.5, 0.6, farm, [2,3,4,5,6,7] ,[0]],
		]
	},
	{	// (110)			
		count:	1,
		exp : expDragon,
		template: 58,
		dragon: true,
		connect : [farm, road, road, road],
		place: [
			[0.5, 0.2, farm, [0,1,2,7]],
			[0.2, 0.8, farm, [3,4]],
			[0.8, 0.8, farm, [5,6]],
			[0.15, 0.5, road, [1]],
			[0.85, 0.5, road, [3]],
			[0.5, 0.8, road, [2]],
			[0.5, 0.5, cloister, []],
		]
	},
	{	// (111)
		count:	1,
		exp : expDragon,
		template: 0,
		dragon: true,
		connect : [farm, road, farm, road],	// top left bottom right
		place: [
			[0.5, 0.25, farm, [0, 1, 2, 7]],
			[0.5, 0.75, farm, [3, 4, 5, 6]],
			[0.5, 0.5, road, [1, 3]],
		]
	},
	{	// (112)			
		count:	1,
		exp : expDragon,
		template: 13,
		dragon: true,
		connect : [farm, city, farm, city],
		place: [
			[0.5, 0.05, farm, [0,1], [1]],
			[0.5, 0.4, city, [1, 3], [], [starFlag]],
			[0.5, 0.87, farm, [4,5], [1]],
		]
	},
	{	// (113)			
		count:	1,
		exp : expDragon,
		template: 24,
		dragon: true,
		connect : [road, farm, city, road],
		place: [
			[0.85, 0.15, farm, [0,7]],
			[0.65, 0.35, road, [0, 3]],
			[0.3, 0.5, farm, [1,2,3,6], [3]],
			[0.5, 0.87, city, [2]],
		]
	},
	{	// (114)			
		count:	1,
		exp : expDragon,
		template: 44,
		dragon: true,
		connect : [city, city, farm, farm],
		place: [
			[0.2, 0.3, city, [0, 1]],
			[0.7, 0.7, farm, [4,5,6,7], [0]],
		]
	},
	{	// (115)			
		count:	1,
		exp : expDragon,
		template: 9,
		dragon: true,
		connect : [city, farm, road, road],
		place: [
			[0.5, 0.2, city, [0]],
			[0.25, 0.7, farm, [2,3,4,7], [0]],
			[0.58, 0.58, road, [2, 3]],
			[0.8, 0.8, farm, [5,6]],
		]
	},

	{	// (116)			
		count:	1,
		exp : expCatapult,
		template: 50,
		circus: true,
		connect : [farm, road, farm, road],
		place: [
			[0.8, 0.2, farm, [0,1,2,7]],
			[0.2, 0.8, farm, [3,4,5,6]],
			[0.15, 0.5, road, [1]],
			[0.85, 0.5, road, [3]],
		]
	},
	{	// (117)			
		count:	1,
		exp : expCatapult,
		circus: true,
		connect : [farm, road, road, farm],
		place: [
			[0.8, 0.2, farm, [0,1,2,5,6,7]],
			[0.2, 0.8, farm, [3,4]],
			[0.15, 0.5, road, [1]],
			[0.5, 0.8, road, [2]],
		]
	},
	{	// (118)			
		count:	1,
		exp : expCatapult,
		circus: true,
		connect : [farm, road, road, road],
		place: [
			[0.8, 0.2, farm, [0,1,2,7,3,4]],
			[0.85, 0.85, farm, [5,6]],
			[0.15, 0.5, road, [1]],
			[0.65, 0.65, road, [2, 3]],
		]
	},
	{	// (119)			
		count:	1,
		exp : expCatapult,
		circus: true,
		connect : [road, road, farm, road],
		place: [
			[0.2, 0.2, farm, [1,2,3,4,5,6]],
			[0.85, 0.15, farm, [0,7]],
			[0.15, 0.5, road, [1]],
			[0.65, 0.3, road, [0, 3]],
		]
	},
	{	// (120)
		count:	1,
		exp : expCatapult,
		circus: true,
		connect : [farm, farm, farm, farm],
		place: [
			[0.8, 0.2, farm, [0,1,2,3,4,5,6,7]],
		]
	},
	{	// (121)
		count:	1,
		exp : expCatapult,
		circus: true,
		connect : [city, farm, city, farm],
		place: [
			[0.5, 0.15, city, [0]],
			[0.2, 0.5, farm, [2,3], [0,2]],
			[0.8, 0.5, farm, [6,7], [0,2]],
			[0.5, 0.85, city, [2]],
		]
	},
	{	// (122)			
		count:	1,
		exp : expCatapult,
		circus: true,
		connect : [city, city, city, city],
		place: [
			[0.5, 0.5, city, [0, 1, 2, 3]],
		]
	},
	{	// (123)			
		count:	1,
		exp : expCatapult,
		circus: true,
		connect : [farm, farm, farm, farm],
		place: [
			[0.85, 0.85, farm, [0,1,2,7]],
			[0.5, 0.5, cloister, []],
			[0.2, 0.2, farm, [3,4,5,6]],
		]
	},
	{	// (124)			
		count:	1,
		exp : expCatapult,
		circus: true,
		connect : [road, road, road, road],
		place: [
			[0.5, 0.2, road, [0, 1, 2, 3]],
			[0.2, 0.2, farm, [1, 2]],
			[0.2, 0.8, farm, [3, 4]],
			[0.8, 0.8, farm, [5, 6]],
			[0.8, 0.2, farm, [7, 0]],
		]
	},
	{	// (125)			
		count:	1,
		exp : expCatapult,
		circus: true,
		connect : [city, farm, farm, farm],
		place: [
			[0.5, 0.4, city, [0]],
			[0.1, 0.5, farm, [2,3], [0]],
			[0.8, 0.8, farm, [4,5,6,7], [0]],
		]
	},
	{	// (126)			
		count:	1,
		exp : expCatapult,
		circus: true,
		connect : [city, farm, farm, farm],
		place: [
			[0.5, 0.15, city, [0]],
			[0.5, 0.8, farm, [2,3,4,5,6,7], [0]],
		]
	},
	{	// (127)			
		count:	1,
		exp : expCatapult,
		circus: true,
		connect : [city, city, farm, farm],
		place: [
			[0.2, 0.3, city, [0, 1], [], [starFlag]],
			[0.7, 0.7, farm, [4,5,6,7], [0]],
		]
	},

	{	// (128)			
		count:	1,
		exp : expTower,	// 高塔扩展包
		tower: true,
		connect : [road, farm, city, road],
		place: [
			[0.85, 0.15, farm, [0,7]],
			[0.65, 0.35, road, [0, 3]],
			[0.85, 0.65, farm, [1,2,3,6], [3]],
			[0.5, 0.87, city, [2]],
		]
	},
	{	// (129)			
		count:	1,
		exp : expTower,
		tower: true,
		connect : [city, road, farm, road],
		place: [
			[0.5, 0.15, city, [0]],
			[0.8, 0.8, farm, [3,4,5,6], [0]],
			[0.8, 0.5, road, [1, 3]],
			[0.1, 0.3, farm, [2]],
			[0.9, 0.3, farm, [7]],
		]
	},
	{	// (130)			
		count:	1,
		exp : expTower,
		tower: true,
		connect : [city, city, farm, road],
		place: [
			[0.5, 0.87, farm, [4,5], [1]],
			[0.5, 0.4, city, [0, 1], [], [starWine]],
			[0.9, 0.7, farm, [6], [1]],
			[0.9, 0.2, farm, [7], [1]],
			[0.9, 0.45, road, [3]],
		]
	},
	{	// (131)			
		count:	1,
		exp : expTower,
		tower: true,
		connect : [city, city, farm, farm],
		place: [
			[0.2, 0.3, city, [0, 1]],
			[0.75, 0.4, farm, [4,5,6,7], [0]],
		]
	},
	{	// (132)			
		count:	1,
		exp : expTower,
		tower: true,
		connect : [road, city, road, city],
		place: [
			[0.8, 0.05, farm, [0], [1]],
			[0.8, 0.5, city, [1, 3], [], [starWine]],
			[0.2, 0.05, farm, [1], [1]],
			[0.2, 0.87, farm, [4], [1]],
			[0.8, 0.87, farm, [5], [1]],
			[0.55, 0.5, road, [0,2]],
		]
	},
	{	// (133)			
		count:	1,
		exp : expTower,
		tower: true,
		template: 8,
		connect : [city, city, road, city],
		place: [
			[0.3, 0.3, city, [0, 1, 3]],
			[0.25, 0.85, farm, [4], [0]],
			[0.5, 0.8, road, [2]],
			[0.75, 0.85, farm, [5], [0]],
		]
	},
	{	// (134)			
		count:	1,
		exp : expTower,
		tower: true,
		connect : [city, city, farm, city],
		place: [
			[0.5, 0.5, city, [0, 1, 3], [], [starFlag]],
			[0.5, 0.9, city, [2]],
			[0.75, 0.8, farm, [], [0,1]],
		]
	},
	{	// (135)			
		count:	1,
		exp : expTower,
		tower: true,
		connect : [farm, road, road, farm],
		place: [
			[0.5, 0.2, farm, [0,1,2,5,6,7]],
			[0.2, 0.8, farm, [3,4]],
			[0.15, 0.5, road, [1]],
			[0.5, 0.8, road, [2]],
		]
	},
	{	// (136)			
		count:	1,
		exp : expTower,
		tower: true,
		template: 42,
		connect : [road, road, road, road],
		place: [
			[0.3, 0.3, road, [0, 1]],
			[0.7, 0.7, road, [2, 3]],
			[0.1, 0.1, farm, [1, 2]],
			[0.2, 0.8, farm, [0,3,4,7]],
			[0.85, 0.85, farm, [5,6]],
		]
	},
	{	// (137)			
		count:	1,
		exp : expTower,
		tower: true,
		template: 26,
		connect : [farm, road, road, road],
		place: [
			[0.5, 0.2, farm, [0,1,2,7]],
			[0.2, 0.8, farm, [3,4]],
			[0.8, 0.8, farm, [5,6]],
			[0.15, 0.5, road, [1]],
			[0.85, 0.5, road, [3]],
			[0.5, 0.8, road, [2]],
		]
	},
	{	// (138)			
		count:	1,
		exp : expTower,
		tower: true,
		template: 21,
		connect : [road, road, road, road],
		place: [
			[0.5, 0.2, road, [0]],
			[0.2, 0.5, road, [1]],
			[0.8, 0.5, road, [3]],
			[0.5, 0.8, road, [2]],
			[0.2, 0.2, farm, [1, 2]],
			[0.2, 0.8, farm, [3, 4]],
			[0.8, 0.8, farm, [5, 6]],
			[0.8, 0.2, farm, [7, 0]],
		]
	},
	{	// (139)			
		count:	1,
		exp : expTower,
		tower: true,
		template: 120,
		connect : [farm, farm, farm, farm],
		place: [
			[0.8, 0.2, farm, [0,1,2,3,4,5,6,7]],
		]
	},
	{	// (140)			
		count:	1,
		exp : expTower,
		tower: true,
		template: 43,
		connect : [road, city, road, city],
		place: [
			[0.15, 0.5, city, [1]],
			[0.85, 0.5, city, [3]],
			[0.5, 0.15, road, [0]],
			[0.5, 0.85, road, [2]],
			[0.25, 0.1, farm, [1], [0]],
			[0.75, 0.1, farm, [0], [1]],
			[0.25, 0.9, farm, [4], [0]],
			[0.75, 0.9, farm, [5], [1]],
		]
	},
	{	// (141)			
		count:	1,
		exp : expTower,
		tower: true,
		template: 16,
		connect : [farm, farm, farm, farm],
		place: [
			[0.8, 0.8, farm, [0,1,2,3,4,5,6,7]],
			[0.5, 0.5, cloister, []],
		]
	},
	{	// (142)			
		count:	2,
		exp : expTower,
		tower: true,
		template: 15,
		connect : [city, farm, farm, farm],
		place: [
			[0.5, 0.15, city, [0]],
			[0.5, 0.6, farm, [2,3,4,5,6,7] ,[0]],
		]
	},
	{	// (143)			
		count:	1,
		exp : expTower,
		tower: true,
		template: 28,
		connect : [city, city, farm, farm],
		place: [
			[0.5, 0.15, city, [0]],
			[0.1, 0.5, city, [1]],
			[0.6, 0.8, farm, [4,5,6,7], [0,1]],
		]
	},
	{	// (144)			
		count:	1,
		exp : expTower,
		tower: true,
		template: 40,
		connect : [city, farm, road, farm],
		place: [
			[0.5, 0.15, city, [0]],
			[0.2, 0.5, farm, [2,3,4], [0]],
			[0.8, 0.5, farm, [5,6,7], [0]],
			[0.5, 0.8, road, [2]],
		]
	},
]

