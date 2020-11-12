const farm = 0
const road = 1
const city = 2
const river = 3
const cloister = 4

const allColors = [
	'blue', 'red', 'green', 'yellow', 'black'
]

const tileTypes = [
	{	// (0)	1 roads	
		count:	4,
		connect : [farm, road, farm, road],	// top left bottom right
		place: [
			[0.5, 0.25, farm, [0, 1, 2, 7]],
			[0.5, 0.75, farm, [3, 4, 5, 6]],
			[0.5, 0.5, road, [1, 3]],
		]
	},
	{	// (1)	lake		
		count:	1,
		riverEnd : true,
		connect : [farm, river, farm, farm],
		place: [
			[0.2, 0.2, farm, [1,2,3,4,5,6,7,0]],
		]
	},
	{	// (2)	lake		
		count:	1,
		connect : [city, river, city, river],
		place: [
			[0.5, 0.15, city, [0]],
			[0.1, 0.3, farm, [2, 7]],
			[0.1, 0.75, farm, [3, 6]],
			[0.5, 0.87, city, [2]],
		]
	},
	{	// (3)	lake		
		count:	1,
		connect : [farm, river, river, farm],
		place: [
			[0.75, 0.3, farm, [0, 1, 2, 5, 6, 7]],
			[0.1, 0.85, farm, [3, 4]],
		]
	},
	{	// (4)	road+city
		count:	4,
		connect : [farm, road, city, road],
		place: [
			[0.5, 0.2, farm, []],
			[0.5, 0.5, road, [1, 3]],
			[0.1, 0.7, farm, []],
			[0.5, 0.87, city, [2]],
		]
	},
	{	// (5)	turn road
		count:	4,
		connect : [farm, farm, road, road],
		place: [
			[0.3, 0.3, farm, []],
			[0.5, 0.5, road, [2, 3]],
			[0.8, 0.8, farm, []],
		]
	},
	{	// (6)	lake		
		count:	1,
		connect : [river, city, river, road],
		place: [
			[0.28, 0.15, farm, []],
			[0.85, 0.2, farm, []],
			[0.15, 0.5, city, [1]],
			[0.5, 0.5, road, [3]],
			[0.3, 0.8, farm, []],
			[0.8, 0.8, farm, []],
		]
	},
	{	// (7)	lake		
		count:	1,
		connect : [river, road, river, road],
		place: [
			[0.2, 0.2, farm, []],
			[0.8, 0.2, farm, []],
			[0.5, 0.5, road, [1, 3]],
			[0.25, 0.75, farm, []],
			[0.8, 0.75, farm, []],
		]
	},
	{	// (8)			
		count:	4,
		connect : [city, city, road, city],
		place: [
			[0.5, 0.3, city, [0, 1, 3]],
			[0.25, 0.85, farm, []],
			[0.5, 0.8, road, [2]],
			[0.75, 0.85, farm, []],
		]
	},
	{	// (9)			
		count:	4,
		connect : [city, farm, road, road],
		place: [
			[0.5, 0.2, city, [0]],
			[0.25, 0.7, farm, []],
			[0.58, 0.58, road, [2, 3]],
			[0.8, 0.8, farm, []],
		]
	},
	{	// (10)			
		count:	4,
		connect : [road, city, city, road],
		place: [
			[0.85, 0.15, farm, []],
			[0.7, 0.3, road, [0, 3]],
			[0.5, 0.5, farm, []],
			[0.2, 0.8, city, [1, 2]],
		]
	},
	{	// (11)			
		count:	1,
		connect : [city, city, city, city],
		star : true,
		place: [
			[0.5, 0.5, city, [0, 1, 2, 3]],
		]
	},
	{	// (12)			
		count:	4,
		connect : [city, city, road, road],
		star : true,
		place: [
			[0.15, 0.15, city, [0, 1]],
			[0.3, 0.3, farm, []],
			[0.5, 0.5, road, [2, 3]],
			[0.8, 0.8, farm, []],
		]
	},
	{	// (13)			
		count:	4,
		connect : [farm, city, farm, city],
		star : true,
		place: [
			[0.5, 0.05, farm, []],
			[0.5, 0.4, city, [1, 3]],
			[0.5, 0.87, farm, []],
		]
	},
	{	// (14)	lake		
		count:	0,
		riverStart: true,
		connect : [farm, river, farm, farm],
		place: [
			[0, 0, farm, [1,2,3,4,5,6,7,0]]
		]
	},
	{	// (15)			
		count:	4,
		connect : [city, farm, farm, farm],
		place: [
			[0.5, 0.15, city, [0]],
			[0.5, 0.6, farm, []],
		]
	},
	{	// (16)			
		count:	4,
		connect : [farm, farm, farm, farm],
		place: [
			[0.8, 0.8, farm, []],
			[0.5, 0.5, cloister, []],
		]
	},
	{	// (17)			
		count:	4,
		connect : [road, road, city, road],
		place: [
			[0.15, 0.15, farm, []],
			[0.85, 0.15, farm, []],
			[0.5, 0.53, farm, []],
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
			[0.5, 0.5, farm, []],
			[0.5, 0.85, city, [2]],
		]
	},
	{	// (19)			
		count:	4,
		connect : [city, city, farm, city],
		place: [
			[0.5, 0.3, city, [0, 1, 3]],
			[0.5, 0.85, farm, []],
		]
	},
	{	// (20)			
		count:	4,
		connect : [city, city, farm, farm],
		star : true,
		place: [
			[0.2, 0.3, city, [0, 1]],
			[0.7, 0.7, farm, []],
		]
	},
	{	// (21)			
		count:	4,
		connect : [farm, farm, city, farm],
		place: [
			[0.5, 0.35, farm, []],
			[0.5, 0.85, city, [2]],
		]
	},
	{	// (22)			
		count:	4,
		connect : [city, city, road, city],
		star : true,
		place: [
			[0.5, 0.3, city, [0, 1, 3]],
			[0.25, 0.85, farm, []],
			[0.5, 0.8, road, [2]],
			[0.75, 0.85, farm, []],
		]
	},
	{	// (23)			
		count:	4,
		connect : [farm, city, farm, city],
		place: [
			[0.5, 0.05, farm, []],
			[0.5, 0.4, city, [1, 3]],
			[0.5, 0.87, farm, []],
		]
	},
	{	// (24)			
		count:	4,
		connect : [road, farm, city, road],
		place: [
			[0.85, 0.15, farm, []],
			[0.65, 0.35, road, [0, 3]],
			[0.3, 0.5, farm, []],
			[0.5, 0.87, city, [2]],
		]
	},
	{	// (25)			
		count:	4,
		connect : [city, city, farm, city],
		star : true,
		place: [
			[0.5, 0.3, city, [0, 1, 3]],
			[0.5, 0.85, farm, []],
		]
	},
	{	// (26)			
		count:	4,
		connect : [farm, road, road, road],
		place: [
			[0.5, 0.2, farm, []],
			[0.2, 0.8, farm, []],
			[0.8, 0.8, farm, []],
			[0.15, 0.5, road, [1]],
			[0.85, 0.5, road, [3]],
			[0.5, 0.8, road, [2]],
		]
	},
	{	// (27)			
		count:	4,
		connect : [farm, farm, road, farm],
		place: [
			[0.8, 0.2, farm, []],
			[0.45, 0.8, road, [2]],
		]
	},
	{	// (28)			
		count:	4,
		connect : [city, city, farm, farm],
		place: [
			[0.5, 0.15, city, [0]],
			[0.1, 0.5, city, [1]],
			[0.6, 0.8, farm, []],
		]
	},
	{	// (29)	lake		
		count:	1,
		connect : [river, farm, river, farm],
		place: [
			[0.15, 0.5, farm, []],
			[0.85, 0.5, farm, []],
		]
	},
	{	// (30)	lake		
		count:	1,
		connect : [river, river, city, city],
		place: [
			[0.1, 0.1, farm, []],
			[0.5, 0.5, farm, []],
			[0.85, 0.85, city, [2, 3]],
		]
	},
	{	// (31)	lake		
		count:	1,
		connect : [farm, river, road, river],
		place: [
			[0.15, 0.15, farm, []],
			[0.1, 0.9, farm, []],
			[0.9, 0.9, farm, []],
			[0.5, 0.55, road, [2]],
		]
	},
	{	// (32)	lake		
		count:	1,
		connect : [road, river, river, road],
		place: [
			[0.15, 0.85, farm, []],
			[0.3, 0.2, farm, []],
			[0.7, 0.3, road, [0, 3]],
			[0.85, 0.15, farm, []],
		]
	},
	{	// (33)	lake		
		count:	1,
		connect : [river, farm, river, farm],
		place: [
			[0.15, 0.5, farm, []],
			[0.85, 0.2, farm, []],
		]
	},
	{	// (34)	lake		
		count:	1,
		connect : [river, farm, farm, river],
		place: [
			[0.3, 0.6, farm, []],
			[0.9, 0.1, farm, []],
		]
	},
]

