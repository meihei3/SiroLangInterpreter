// enum commands
class CommandType {
    constructor(num, name) {
        this.num = num;
        this.name = name;
    }
}
const inc_ptr = new CommandType(0, 'いーねっ！');
const dec_ptr = new CommandType(1, 'ｷｭｰｲ');
const inc_val = new CommandType(2, 'おほほい');
const dec_val = new CommandType(3, 'ぱいーん');
const begin_loop = new CommandType(4, '白組さん');
const end_loop = new CommandType(5, '救済');
const std_input = new CommandType(6, 'ズンドコズンドコ♪');
const std_output = new CommandType(7, 'なんて日だ！');
const all_command_types = [inc_ptr, dec_ptr, inc_val, dec_val, begin_loop, end_loop, std_input, std_output];

class Command {
    constructor(type, jump_to=null) {
        this.type = type;
        this.jump_to = jump_to;
    }

    is(command_type) {
        return Object.is(this.type, command_type);
    }
}

function run(){
    const doc = document.getElementById('source').value;
    document.getElementById('out').innerHTML = fuck(doc);
}

function fuck(docstr){
    const commands = sourceToCommands(docstr);
    if (commands == null)
        return "";
    const cmdSize = commands.length

    const cells = new Array(10000);
    cells.fill(0);
    let cellptr = 0;
    let cmdptr = 0;

    let output = "";

    const limit = 10000;
    let cnt = 0;

    const startTime = Date.now();
    const maxConputationalTime = 1000; // unit: milliseconds

    for(;cmdptr < cmdSize; cmdptr++) {
        if (cnt > limit) {
            const deltaTime = Date.now() - startTime;
            if (deltaTime > maxConputationalTime) {
                return `RunTimeError: Computation timed out after ${maxConputationalTime} ms. May be infinite loop?`;
            }
        }
        cnt++;

        const command = commands[cmdptr];
        if (command.is(inc_val)) {
            cells[cellptr]++;
        } else if (command.is(dec_val)) {
            cells[cellptr]--;
        } else if (command.is(inc_ptr)) {
            cellptr++;
        } else if (command.is(dec_ptr)) {
            cellptr--;
        } else if (command.is(begin_loop)) {
            if (cells[cellptr] === 0) {
                cmdptr = command.jump_to;
            }
        } else if (command.is(end_loop)) {
            if (cells[cellptr] !== 0) {
                cmdptr = command.jump_to;
            }
        } else if (command.is(std_output)) {
            output += String.fromCharCode(cells[cellptr]);
        } else if (command.is(std_input)) {
            return `Sorry, the command ${ command.name } is currently not supported. Thanks!`;
        }
    }

    return output;
}

function jumpRight(commands, ptr){
    const cmdSize = commands.length;
    let c = 1;
    while(ptr < cmdSize && c > 0){
        ptr++;
        const command = commands[ptr];
        if (command.is(begin_loop)) {
            c++;
        }
        if (command.is(end_loop)) {
            c--;
        }
    }
    return ptr - 1;
}
function jumpLeft(commands, ptr){
    const cmdSize = commands.length;
    let c = 1;
    while(ptr < cmdSize && c > 0){
        ptr--;
        const command = commands[ptr];
        if (command.is(end_loop)) {
            c++;
        }
        if (command.is(begin_loop)) {
            c--;
        }
    }
    return ptr - 1;
}

function sourceToCommands(src){
    const all_names = all_command_types.map((command_type) => {return command_type.name});
    const pattern = RegExp(`(${ all_names.join('|') })`, 'g');
    const result_with_string = src.match(pattern);
    if (result_with_string === null) {
        return null;
    }
    // seems little bit ugly, but the computation cost is up to O(NM)
    // where N equals to # of commands and M equals to # of kind of commands
    function getCorrespondingCommand(name) {
        for (const command_type of all_command_types) {
            if (name === command_type.name) {
                return new Command(command_type);
            }
        }
        throw `ValueError: No such command ${ name }`;
    }
    const result_without_jump_info = result_with_string.map(getCorrespondingCommand);
    const result = addJumpInfoToCommands(result_without_jump_info);
    return result;
}

function addJumpInfoToCommands(commands) {
    for (let [command_ptr, command] of commands.entries()) {
        if (command.is(begin_loop)) {
	    command.jump_to = jumpRight(commands, command_ptr);
	} else if (command.is(end_loop)) {
	    command.jump_to = jumpLeft(commands, command_ptr);
	}
    }
    return commands;
}

function sampleCode() {
    const code = "おほほいおほほいおほほいおほほいおほほいおほほいおほほいおほほいおほほいおほほい白組さんいーねっ！"
          + "おほほいいーねっ！おほほいおほほいおほほいいーねっ！おほほいおほほいおほほいおほほいおほほいおほほいおほほいいーねっ！"
          + "おほほいおほほいおほほいおほほいおほほいおほほいおほほいおほほいおほほいおほほいｷｭｰｲｷｭｰｲｷｭｰｲｷｭｰｲぱいーん救済いーねっ！"
          + "いーねっ！いーねっ！おほほいおほほいなんて日だ！いーねっ！おほほいなんて日だ！おほほいおほほいおほほいおほほいおほほい"
          + "おほほいおほほいなんて日だ！なんて日だ！おほほいおほほいおほほいなんて日だ！ｷｭｰｲｷｭｰｲおほほいおほほいなんて日だ！いーねっ！"
          + "おほほいおほほいおほほいおほほいおほほいおほほいおほほいおほほいおほほいおほほいおほほいなんて日だ！いーねっ！"
          + "ぱいーんぱいーんぱいーんぱいーんぱいーんぱいーんなんて日だ！おほほいおほほいおほほいおほほいおほほいおほほいおほほい"
          + "おほほいおほほいなんて日だ！ぱいーんぱいーんぱいーんなんて日だ！ｷｭｰｲｷｭｰｲなんて日だ！いーねっ！おほほいおほほいおほほい"
          + "おほほいなんて日だ！いーねっ！なんて日だ！おほほいおほほいおほほいなんて日だ！ぱいーんぱいーんぱいーんぱいーんぱいーんぱいーん"
          + "なんて日だ！ぱいーんぱいーんぱいーんぱいーんぱいーんぱいーんぱいーんぱいーんなんて日だ！ｷｭｰｲｷｭｰｲおほほいなんて日だ！ｷｭｰｲなんて日だ！";
    document.getElementById('source').value = code;
}
