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

    function jumpRight(ptr){
    	let c = 1;
    	while(ptr < cmdSize && c > 0){
    	    ptr++;
	    const command = commands[ptr];
    	    if (Object.is(command, begin_loop)) {
		c++;
	    }
	    if (Object.is(command, end_loop)) {
		c--;
	    }
    	}
    	return ptr - 1;
    }

    function jumpLeft(ptr){
    	let c = 1;
    	while(ptr < cmdSize && c > 0){
    	    ptr--;
	    const command = commands[ptr];
	    if (Object.is(command, end_loop)) {
		c++;
	    }
	    if (Object.is(command, begin_loop)) {
		c--;
	    }
    	}
    	return ptr - 1;
    }

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
	if (Object.is(command, inc_val)) {
	    cells[cellptr]++;
	} else if (Object.is(command, dec_val)) {
	    cells[cellptr]--;
	} else if (Object.is(command, inc_ptr)) {
	    cellptr++;
	} else if (Object.is(command, dec_ptr)) {
	    cellptr--;
	} else if (Object.is(command, begin_loop)) {
	    if (cells[cellptr] === 0) {
		cmdptr = jumpRight(cmdptr);
	    }
	} else if (Object.is(command, end_loop)) {
	    if (cells[cellptr] !== 0) {
		cmdptr = jumpLeft(cmdptr);
	    }
	} else if (Object.is(command, std_output)) {
	    output += String.fromCharCode(cells[cellptr]);
	} else if (Object.is(command, std_input)) {
	    return `Sorry, the command ${ command.name } is currently not supported. Thanks!`;
	}
    }

    return output;
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
		return command_type;
	    }
	}
	throw `ValueError: No such command ${ name }`;
    }
    const result = result_with_string.map(getCorrespondingCommand);
    return result;
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
