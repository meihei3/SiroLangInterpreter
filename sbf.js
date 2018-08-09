function run(){
    const doc = document.getElementById('source').value;
    document.getElementById('out').innerHTML = fuck(doc);
}

function fuck(docstr){
    const commands = cleanUp(docstr);
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
    	    if(commands[ptr] === '白組さん')
    	        c++;
    	    if(commands[ptr] === '救済')
    	        c--;
    	}
    	return ptr - 1;
    }

    function jumpLeft(ptr){
    	let c = 1;
    	while(ptr < cmdSize && c > 0){
    	    ptr--;
    	    if(commands[ptr] === '救済')
    	        c++;
    	    if(commands[ptr] === '白組さん')
    	        c--;
    	}
    	return ptr - 1;
    }

    const limit = 10000
    let cnt = 0

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

        switch(commands[cmdptr]) {
        case "おほほい":
            cells[cellptr]++;
            break;

        case "ぱいーん":
            cells[cellptr]--;
            break;

        case "いーねっ！":
            cellptr++;
            break;

        case "ｷｭｰｲ":
            cellptr--;
            break;

        case "なんて日だ！":
            output += String.fromCharCode(cells[cellptr]);
            break;

        case "白組さん":
            if (cells[cellptr] === 0)
                cmdptr = jumpRight(cmdptr);
            break;

        case "救済":
            if (cells[cellptr] !== 0)
                cmdptr = jumpLeft(cmdptr);
            break;

        default:
            break;
        }
    }

    return output;
}

function cleanUp(src){
    const result = src.match(/(いーねっ！|おほほい|ｷｭｰｲ|ぱいーん|白組さん|救済|なんて日だ！|ズンドコズンドコ♪)/g);
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
