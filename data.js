const farm = 0
const road = 1
const city = 2
const river = 3
const cloister = 4

const starFlag = 1		// flag on a city
const starInn = 2		// inn on a road
const starCathedral = 3		// cathedrall in a city

const expInn = 1
const expRiver = 2
const expRiver2 = 3

const allColors = [
	'blue', 'red', 'green', 'yellow', 'black'
]

const tileTypes = [
	{	// (0)	1 roads	
		count:	8,
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
		exp : expRiver,
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
		count:	1,
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
			[0, 0, farm, [1,2,3,4,5,6,7,0]]
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
		exp : expRiver,
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
		connect : [city, farm, road, farm],
		exp : expInn,
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
		connect : [road, road, road, road],
		exp : expInn,
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
		connect : [road, city, road, city],
		exp : expInn,
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
			[0.3, 0.3, farm, [0,1,2,3,4,7]],
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
			[0.2, 0.6, farm, [2,3,4], [0]],
			[0.8, 0.9, farm, [5], [0]],
			[0.5, 0.7, road, [2]],
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
			[0.2, 0.05, farm, [0], [1]],
			[0.5, 0.4, city, [1, 3], [], [starFlag]],
			[0.8, 0.05, farm, [1], [1]],
			[0.2, 0.87, farm, [4], [1]],
			[0.8, 0.87, farm, [5], [1]],
			[0.5, 0.1, road, [0]],
			[0.5, 0.9, road, [2]],
		]
	},
]

