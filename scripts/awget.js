const input = document.querySelector('#input');

document.onkeydown = () => {
  input.focus();
};

const loadDisk = (disk, config = {}) => {
  // build default (DOM) configuration
  const defaults = {
    // retrieve user input (remove whitespace at beginning or end)
    getInput: () => input.value.trim(),
    // overwrite user input
    setInput: (str) => {
      input.value = str;
    },
    // render output
    println: (str, isImg = false) => {
      // bail if string is null or undefined
      if (!str) {
        return;
      }

      const output = document.querySelector('#output');
      
      const newLine = document.createElement('div');

      if (isImg) {
        newLine.classList.add('img');
      }

      output.appendChild(newLine).innerText = str;
      window.scrollTo(0, document.body.scrollHeight);
    },
    // prepare the environment
    setup: ({applyInput = (() => {}), navigateHistory = (() => {})}) => {
      input.onkeypress = (e) => {
        const ENTER = 13;

        if (e.keyCode === ENTER) {
          applyInput();
        }
      };

      input.onkeydown = (e) => {
        const UP = 38;
        const DOWN = 40;

        if (e.keyCode === UP) {
          navigateHistory('prev');
        } else if (e.keyCode === DOWN) {
          navigateHistory('next');
        }
      };
    }
  };

  const {getInput, setInput, println, setup} = Object.assign(defaults, config);

  // Disk -> Disk
  const init = (disk) => {
    const initializedDisk = Object.assign({}, disk);
    initializedDisk.rooms = disk.rooms.map((room) => {
      room.visits = 0;
      return room;
    });

    if (!initializedDisk.inventory) {
      initializedDisk.inventory = [];
    }

    return initializedDisk;
  };

  disk = init(disk);

  const inputs = ['']; // store all user commands
  let inputsPos = 0;

  // String -> Room
  const getRoom = (id) => disk.rooms.find(room => room.id === id);

  const enterRoom = (id) => {
    const room = getRoom(id);

    println(room.img, true);

    println(`[ ${room.name} ]`);

    if (room.visits === 0) {
      println(room.desc);
    }

    room.visits++;

    disk.roomId = id;

    if (typeof room.onEnter == 'function') {
      room.onEnter({disk, println, getRoom, enterRoom});
    }
  };

  const startGame = (disk) => {
    enterRoom(disk.roomId);
  };

  startGame(disk);

  const applyInput = () => {
    const input = getInput();
    inputs.push(input);
    inputsPos = inputs.length;
    println('> ' + input);

    const val = input.toLowerCase();
    setInput(''); // reset input field

    const exec = (cmd) => {
      if (cmd) {
        cmd();
      } else {
        println(`Console: command not found. Type HELP to get a list of available commands.`);
      }
    };

    const args = val.split(' ')
      // remove articles
      .filter(arg => arg !== 'a' && arg !== 'an' && arg != 'the');
    const cmd = args[0];
    const room = getRoom(disk.roomId);

    // nested strategy pattern
    // 1st tier based on # of args in user input
    // 2nd tier based on 1st arg (command)
    const strategy = {
      1() {
        const cmds = {
          inventory() {
            if (!disk.inventory.length) {
              println('You don\'t have any items in your inventory.')
              return;
            }
            println('You have the following items in your inventory:');
            disk.inventory.forEach(item => {
              println(`* ${item.name}`);
            });
          },
          look() {
            println(room.img, true);
            println(`[ ${room.name} ]`);
            println(room.desc);
          },
          go() {
            const exits = room.exits;
            if (!exits) {
              println('There\'s nowhere to go.');
              return;
            }
            println('Where would you like to go? Available directions are:');
            exits.forEach(exit => println(exit.dir));
          },
          help() {
            const instructions = `
            --- AVAILABLE COMMANDS ---\n
              INVENTORY
              LOOK
              LOOK AT [OBJECT]
              TAKE [OBJECT]
              GO [DIRECTION]
              USE [OBJECT]
              ABOUT
              HELP
            -------------------------
            `;
            println(instructions);
          },
          about(){
            const aboutTheProject = `
* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*                                                       *
* @author: Oscar Mellado                                *
* @date: October 2020                                   *
* @context: IronHack Full Stack Web Developer Bootcamp  *
* @see: https://github.com/oooscaaar                    *
*                                                       *
*                    /""\\      ,                        *
*                   <>^  L____/|                        *
*                    \`) /\`   , /                        *
*                     \\ \`---' /                         *
*                      \`'";\\)\`                          *
*                        _/_Y                           *            
*                                               1557798 *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
            `;
            println(aboutTheProject, true);
          }
        };
        exec(cmds[cmd]);
      },
      2() {
        const cmds = {
          look() {
            println(`You look at the ${args[1]}.`);
          },
          go() {
            const exits = room.exits;
            if (!exits) {
              println('There\'s nowhere to go.');
              return;
            }
            const nextRoom = exits.find(exit => exit.dir === args[1]);
            if (!nextRoom) {
              println('There is no exit in that direction.');
            } else {
              enterRoom(nextRoom.id);
            }
          },
          take() {
            const findItem = item => item.name === args[1];
            const itemIndex = room.items && room.items.findIndex(findItem);
            if (typeof itemIndex === 'number' && itemIndex > -1) {
              const item = room.items[itemIndex];
              if (item.isTakeable) {
                disk.inventory.push(item);
                room.items.splice(itemIndex, 1);
                println(`You took the ${item.name}.`);
              } else {
                println('You can\'t take that.');
              }
            } else {
              println('You don\'t see any such thing.');
            }
          },
          use() {
            const findItem = item => item.name === args[1];
            const item = (room.items && room.items.find(findItem)) || disk.inventory.find(findItem);

            if (item) {
              if (item.use) {
                const use = typeof item.use === 'string' ? eval(item.use) : item.use;
                use({disk, println, getRoom, enterRoom}); // use item and give it a reference to the game
                if(!item.uses){
                  var uses;
                  item.uses = 1;
                } else {
                  item.uses++;

                }
              } else {
                println('That item doesn\'t have a use.');
              }
            } else {
              println('You don\'t have that.');
            }
          }
        };
        exec(cmds[cmd]);
      },
      3() {
        const cmds = {
          look() {
            const findItem = item => item.name === args[2];
            const item = (room.items && room.items.find(findItem)) || disk.inventory.find(findItem);
            if (!item) {
              println('You don\'t see any such thing.');
            } else {
              println(item.img, true);
              println(item.desc);
            }
          },
        };
        exec(cmds[cmd]);
      }
    };

    if (args.length <= 3) {
      strategy[args.length]();
    } else {
      strategy[1]();
    }
  };

  const navigateHistory = (dir) => {
    if (dir === 'prev') {
      inputsPos--;
      if (inputsPos < 0) {
        inputsPos = 0;
      }
    } else if (dir === 'next') {
      inputsPos++;
      if (inputsPos > inputs.length) {
        inputsPos = inputs.length;
      }
    }

    setInput(inputs[inputsPos] || '');
  };

  setup({applyInput, navigateHistory});
};

// npm support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = loadDisk;
}
