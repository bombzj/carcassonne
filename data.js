const grass = 0
const road = 1
const city = 2
const river= 3

const tileTypes = [
	{	// (0)	1 roads	
		count:	4,
		connect : [grass, road, grass, road]	// top left bottom right
	},
	{	// (1)	lake		
		count:	1,
		riverEnd : true,
		connect : [grass, river, grass, grass]
	},
	{	// (2)	lake		
		count:	1,
		connect : [city, river, city, river]
	},
	{	// (3)	lake		
		count:	2,
		connect : [grass, river, river, grass]
	},
	{	// (4)	road+city
		count:	4,
		connect : [grass, road, city, road]
	},
	{	// (5)	turn road
		count:	4,
		connect : [grass, grass, road, road]
	},
	{	// (6)	lake		
		count:	1,
		connect : [river, city, river, road]
	},
	{	// (7)	lake		
		count:	1,
		connect : [river, road, river, road]
	},
	{	// (8)			
		count:	4,
		connect : [city, city, road, city]
	},
	{	// (9)			
		count:	4,
		connect : [city, grass, road, road]
	},
	{	// (10)			
		count:	4,
		connect : [road, city, city, road]
	},
	{	// (11)			
		count:	4,
		connect : [city, city, city, city]
	},
	{	// (12)			
		count:	4,
		connect : [city, city, road, road]
	},
	{	// (13)			
		count:	4,
		connect : [grass, city, grass, city]
	},
	{	// (14)	lake		
		count:	0,
		riverStart: true,
		connect : [grass, river, grass, grass]
	},
	{	// (15)			
		count:	4,
		connect : [city, grass, grass, grass]
	},
	{	// (16)			
		count:	4,
		connect : [grass, grass, grass, grass]
	},
	{	// (17)			
		count:	4,
		connect : [road, road, city, road]
	},
	{	// (18)			
		count:	4,
		connect : [city, grass, city, grass]
	},
	{	// (19)			
		count:	4,
		connect : [city, city, grass, city]
	},
	{	// (20)			
		count:	4,
		connect : [city, city, grass, grass]
	},
	{	// (21)			
		count:	4,
		connect : [grass, grass, city, grass]
	},
	{	// (22)			
		count:	4,
		connect : [city, city, road, city]
	},
	{	// (23)			
		count:	4,
		connect : [city, grass, city, grass]
	},
	{	// (24)			
		count:	4,
		connect : [road, grass, city, road]
	},
	{	// (25)			
		count:	4,
		connect : [city, city, grass, city]
	},
	{	// (26)			
		count:	4,
		connect : [grass, road, road, road]
	},
	{	// (27)			
		count:	4,
		connect : [grass, grass, road, grass]
	},
	{	// (28)			
		count:	4,
		connect : [city, city, grass, grass]
	},
	{	// (29)			
		count:	2,
		connect : [river, grass, river, grass]
	},
	{	// (30)			
		count:	1,
		connect : [river, river, city, city]
	},
	{	// (31)			
		count:	1,
		connect : [grass, river, road, river]
	},
	{	// (32)			
		count:	1,
		connect : [road, river, river, road]
	},
]

