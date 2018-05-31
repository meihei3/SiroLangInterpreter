function run(){
    var doc = document.getElementById('source').value;
    document.getElementById('out').innerHTML = fuck(doc);
}

function fuck(docstr){
    var commands = cleanUp(docstr);
    if (commands == null)
        return "";
    var cmdSize = commands.length

    var cells = new Array(10000);
    cells.fill(0);
    var cellptr = 0;
    var cmdptr = 0;

    var output = "";

    function jumpRight(ptr){
    	var c = 1;
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
    	var c = 1;
    	while(ptr < cmdSize && c > 0){
    	    ptr--;
    	    if(commands[ptr] === '救済')
    	        c++;
    	    if(commands[ptr] === '白組さん')
    	        c--;
    	}
    	return ptr - 1;
    }

    var limit = 10000
    var cnt = 0

    for(;cmdptr < cmdSize; cmdptr++) {
        if (cnt > limit)
            return "RunTimeError: This is so complex code.";
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
    var result = src.match(/(いーねっ！|おほほい|ｷｭｰｲ|ぱいーん|白組さん|救済|なんて日だ！|ズンドコズンドコ♪)/g);
    return result;
}

function sampleCode() {
    var code = "おほほいおほほいおほほいおほほいおほほいおほほいおほほいおほほいおほほいおほほい白組さんいーねっ！"
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
