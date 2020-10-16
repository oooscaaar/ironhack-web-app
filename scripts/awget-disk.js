const unlimitedAdventure = {
  roomId: 'entrance',        // The room the player is currently in. Set this to the room you want the player to start in.
  inventory: [
    // Id desc Even if you look like a terrorist in that photo, this is your ID card.
    { name: 'id', desc: 'Even if you look like a terrorist in that photo, this is your NFC ID card.', img:`ID IMG`, use: ({disk, println, getRoom, enterRoom}) => {
      const room = getRoom(disk.roomId);
      if(room.id === 'entrance'){
        enterRoom('hall');
      } else if(room.id === 'chiefOffice'){
        enterRoom('chiefOffice');
      } else {
        println('Are you enjoying your terrible Id photo?');
      }
    }
  }
  ],             // You can add any items you want the player to start with here.
  rooms: [
    {
      name: 'NASA FACILITIES',     // This will be displayed each time the player enters the room.
      id: 'entrance',        // The unique identifier for this room. Entering a room will set the disk's roomId to this.
      img: `
* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*                                                       *
*                     ) ) )                        ___  *
*                      ( ( (                 |     | |  *      
*                     ) ) )                 / \\    |I|  *
*                  (~~~~~~~~~~)            |---|===|R|  *
*                   |  NASA  |             |---|   |O|  *
*                   |        |            /     \\  |N|  *
*                   I     ___|           |   U   | |H|  *
*                   I   /'   \`\\          |   S   |=|A|  *
*      __           I  |       |         |   A   | |C|  *
*   __|_@|___       f  |  |~~~~~~~~~~~|  |_______| |K|  *
* =|_ ____ __|=   .'   |  ||~~~~~~~~| |   |@| |@|  | |  *
* ___0____0_____/'_____|__||__###___|_|___|_|_|_|__|_|_ *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
      `,
      desc: `
        You are talking to a guard. He asks for an ID card in order to let you pass the security check and access to the NASA building. \n\nType HELP to get a list of available commands.\n
      `
    },
    {
      name: 'NASA HALL',
      id: 'hall',
      img: `
* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*                         NORTH                         *
*                      ___________                      *
*                     |           |                     *
*                     |  QUANTUM  |                     *
*                     |  COMPUTER |                     *
*                   __|____ . ____|__                   *
*                  |                 |                  *
*       ___________|                 |___________       *
*      |           |                 |           |      *
* WEST |  HUBBLE   .       HALL           YOUR   | EAST *
*      | TELESCOPE |                 |   OFFICE  |      *
*      |___________|                 |___________|      *
*                  |_______   _______|                  *
*                                                       *
*                         SOUTH                         *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   
`,
      desc: `
        The guard lets you access the building. You are in the main hall. It's quite a big building. Luckily you took a MAP so you can get to your office.
      `,
      onEnter: ({disk, println, getRoom}) => {
        const map = unlimitedAdventure.inventory.find(item => item.name === 'map');
        if(!map){
          const map = { name: 'map', desc: 'Map of the building', img:
          `
                        NORTH                         
                     ___________                     
                    |           |                    
                    |  QUANTUM  |                    
                    |  COMPUTER |                     
                  __|____ # ____|__                   
                 |                 |                  
      ___________|                 |___________       
     |           |                 |           |      
WEST |  HUBBLE   #       HALL           YOUR   | EAST 
     | TELESCOPE |                 |   OFFICE  |      
     |___________|                 |___________|      
                 |_______   _______|     

                        SOUTH       # = Locked Access 
          `, use: ({disk, println, getRoom}) => {
            println(map.img, true);
            println(map.desc);
          }};
          unlimitedAdventure.inventory.push(map);
        }
      },
      exits: [
        { dir: 'west', id: 'telescopeAccess' },
        { dir: 'telescope', id: 'telescopeAccess' },
        { dir: 'east', id: 'chiefOffice'},
        { dir: 'office', id: 'chiefOffice'},
        { dir: 'south', id: 'exitDoor' },
        { dir: 'exit', id: 'exitDoor'},
        { dir: 'north', id: 'computerRoomAccess' },
        { dir: 'computer', id: 'computerRoomAccess'}
      ]
    },
    {
      name: 'HUBBLE TELESCOPE',
      id: 'telescopeAccess',
      img: `
 _______________ 
|  ___________  |
| |   ACCESS  | |
| |    CODE   | |
|  ▔▔▔▔▔▔▔▔▔▔▔  | 
| | 7 | 8 | 9 | |
| | 4 | 5 | 6 | |
| | 1 | 2 | 3 | |
| | * | 0 | # | |
|_______________|

      `, // Will be a numcode in the chief office
      desc: `
        ACCESS RESTRICTED. You need a code to unlock this door.
      `,
      exits: [
        { dir: 'east', id: 'chiefOffice' },
        { dir: 'office', id: 'chiefOffice' },
        { dir: 'south', id: 'exitDoor' },
        { dir: 'exit', id: 'exitDoor' },
        { dir: 'north', id: 'computerRoomAccess' },
        { dir: 'computer', id: 'computerRoomAccess' }
      ]
    },
    {
        name: 'QUANTUM COMPUTER',
        id: 'computerRoomAccess',
        img: `
   _______________ 
  |  ___________  |
  | |   ACCESS  | |
  | |    CODE   | |
  |  ▔▔▔▔▔▔▔▔▔▔▔  | 
  | | 7 | 8 | 9 | |
  | | 4 | 5 | 6 | |
  | | 1 | 2 | 3 | |
  | | * | 0 | # | |
  |_______________|      
  `, // Will be a numcode in the chief office
              desc: `
                ACCESS RESTRICTED. You need a code to unlock this door.
                `,
      exits: [
        { dir: 'west', id: 'telescopeAccess' },
        { dir: 'telescope', id: 'telescopeAccess' },
        { dir: 'east', id: 'chiefOffice' },
        { dir: 'office', id: 'chiefOffice' },
        { dir: 'south', id: 'exitDoor' },
        { dir: 'exit', id: 'exitDoor'}
      ]
    },
    {
      name: 'YOUR OFFICE',
      id: 'chiefOffice',
      img: `
* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*                    _______                            *
*                 .'|.-----.|                           *
*               |  ||      ||                           *
*          _____|  ||      ||__________                 *
*         |\`.    \`..|'_____'|           \`.              *
*         || \`.     \\\`-------\`            \`.            *
*         ||   \`.___________________________\`.          *
*         ||    ||            ||     | .---. |          *
*         ||    ||            ||     |_______|          *
*         ||____||____________||     | .---. |          *
*               ||              \`.   |_______|          *
*               ||                \`. | .---. |          *
*               ||__________________\`|_______|          *
*                                                       *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
      `,
      desc: `
        This is your humble office. It's equiped with a COMPUTER, a desk and a huge american FLAG on the wall.
      `,
      items: [
        { name: 'flag',
          desc: '',
          img:`
 _____________________________________________
|* * * * * * * * * * OOOOOOOOOOOOOOOOOOOOOOOOO|
| * * * * * * * * *  :::::::::::::::::::::::::|
|* * * * * * * * * * OOOOOOOOOOOOOOOOOOOOOOOOO|
| * * * * * * * * *  :::::::::::::::::::::::::|
|* * * * * * * * * * OOOOOOOOOOOOOOOOOOOOOOOOO|
| * * * * * * * * *  ::::::::::::::::::::;::::|
|* * * * * * * * * * OOOOOOOOOOOOOOOOOOOOOOOOO|
|:::::::::::::::::::::::::::::::::::::::::::::|
|OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO|
|:::::::::::::::::::::::::::::::::::::::::::::|
|OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO|
|:::::::::::::::::::::::::::::::::::::::::::::|
|OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO|
 ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
        `
        },
        {
          name: 'computer',
          desc:'That is your computer. Maybe you should start the work day checking your email inbox...',
          img: `
      ._______________________.
      | .___________________. |
      | |                   | |
      | |                   | |
      | |                   | |
      | |                   | |
      | |                   | |
      | |                   | |
      | |                   | |
      | !___________________! |
      !_______________________!
     /                         \\
   /   [][][][][][][][][][][][]  \\
 /   [][][][][][][][][][][][][][]  \\
(   [][][][][____________][][][][]   )
  \\ ------------------------------- /
    \\_____________________________/
          `,
          use: ({disk, println, getRoom}) => {
            const room = getRoom(disk.roomId);
            // First time you run the computer
            if(!room.items[1].uses){
              println(room.items[1].img,true);
              println(`
              You boot the computer and check your email inbox.
              You have an email from the NASA Chief Scientist. You start reading and...
              WTF*ck! "The planet earth is at risk! Accoording to the predictions, some large asteroids are approaching to our planet!"
              \nIn the mail, the NASA Chief Scientist sent you a CODE to the Hubble telescope room so you can investigate what is really happening.
              You note the CODE on a paper, put it on your pocket and poweroff the computer.
              `);
              const code = { name: 'code', desc: 'Ultrasecret Access Code to the Hubble Telescope Room: 1234' };
              code.use = ({disk, println, getRoom, enterRoom}) => {
                const room = getRoom(disk.roomId);
                if(room.id === 'telescopeAccess'){
                  enterRoom('telescopeRoom');
                } else {
                  println(`This code doesn't work here.`);
                }
              };
              unlimitedAdventure.inventory.push(code);
            } else {
              room.items[1].img =`
    ._______________________.
    | .___________________. |
    | |                   | |
    | |    youTube        | |
    | |   |▔▔▔▔▔▔▔▔▔▔▔▔|  | |
    | |   |            |  | |
    | |   |____________|  | |
    | |                   | |
    | |                   | |
    | !___________________! |
    !_______________________!
   /                         \\
  /   [][][][][][][][][][][][]  \\
 /   [][][][][][][][][][][][][][] \\
(   [][][][][____________][][][][]  )
 \\ ------------------------------- /
   \\_____________________________/
              `;
              println(room.items[1].img, true);
              println(`
              Come on man, are you kidding?... Stop losing more time browsing YouTube and go save humanity!
              `)
            }

            }


        }
        ,
      ],
      exits: [
        { dir: 'west', id: 'hall' },
        { dir: 'hall', id: 'hall' },
      ]
    },
    {
      name: 'HUBBLE TELESCOPE',
      id: 'telescopeRoom',
      img: `
* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*                                                       *
*                     ,-.                               *
*                    / \\  \`.  __..-,O                   *
*                   :   \\ --''_..-'.'                   *
*                   |    . .-' \`. '.                    *
*                   :     .     .\`.'                    *
*                    \\     \`.  /  \`.                    *
*                     \\      \`.    '.                   *
*                      \`,       \`.   \\                  *
*                      ,|,\`.        \`-.\\                *
*                     '.||  \`\`-...__..-\`                *
*                      |  |                             *
*                      |__|                             *
*                      /||\\                             *
*                     //||\\\\                            *
*                    // || \\\\                           *
*                 __//__||__\\\\__                        *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
      `,
      desc: `
Finally, you mange to access the room. You see a huge TELESCOPE in the middle of the chamber. You are full of confidence, you can save the world.  
      `,
      onEnter: () => {
        getAsteroids();
        console.log('Asteroids Loaded!'); // Logs "Asteroids loaded"
      },
      items: [
        { name: 'telescope', desc: '', response:'', use: ({disk, println, getRoom}) => {
          println(unlimitedAdventure.rooms[5].items[0].response);
        }},
      ],
      exits: [
        { dir: 'east', id: 'hall' },
        { dir: 'hall', id: 'hall' },
      ]
    }
  ]
};
