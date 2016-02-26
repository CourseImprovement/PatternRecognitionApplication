function StringPra(){
	this.mainfest = {};
	this.processPair = [];
	this.current = null;
	this.isAnalyzed = false;
	this.analzedResults = {};
	this.pattern = {};
	this.common = {};
}

StringPra.tests = [];
StringPra.analyze = [];
StringPra.patterns = [];

StringPra.prototype.train = function(input, output){
	this.current = {input: input, output: output, results: {}};
	this.processPair.push(this.current);

	for (var i = 0; i < StringPra.tests.length; i++){
		this.common[StringPra.tests[i].alias] = [];
		var results = StringPra.tests[i].func(input, output);
		this.current.results[StringPra.tests[i].alias] = results;
	}
}

StringPra.registerTest = function(name, alias, func){
	StringPra.tests.push({
		name: name,
		func: func,
		alias: alias
	});
}

StringPra.registerPatternAnalyzer = function(name, func){
	StringPra.patterns.push({
		name: name,
		func: func
	})
}
/**
 * var pattern = {
 * 	 case: {
 * 	 	 0: 'upper'
 * 	 }
 * }
 */
StringPra.prototype.createRules = function(){
	for (var i = 0; i < StringPra.patterns.length; i++){
		this.pattern[StringPra.patterns[i].name] = StringPra.patterns[i].func(this.processPair);
	}
}

StringPra.prototype.analyze = function(input){
	if (!this.analyzed) this.createRules();
	var output = input;

	for (var i = 0; i < StringPra.analyze.length; i++){
		output = StringPra.analyze[i](output, this.pattern);
	}

	return output;
}
function getCase(letter){
	return letter.replace(/[a-z]/g, 'l').replace(/[A-Z]/g, 'u');
}

function isLetter(letter){
	return letter.match(/[a-zA-Z]/g) != undefined;
}

StringPra.registerTest('casePattern', 'c', function(input, output){
	// l for lowercase, u for uppercase
	var pattern = "";
	for (var i = 0; i < output.length; i++){
		pattern += getCase(output[i]);
	}
	for (var i = pattern.length - 2; i != 0; i--){
		if (pattern[i] != pattern[i + 1]) break;
		pattern = pattern.slice(0, pattern.length - 1);
	}
	return pattern;
});

StringPra.analyze.push(function(input, pattern){
	var output = '';
	var last = 'l';
	for (var i = 0; i < input.length; i++){
		if (pattern.case[i] == 'l'){
			output += input[i].toLowerCase();
			last = 'l';
		}
		else if (pattern.case[i] == 'u'){
			output += input[i].toUpperCase();
			last = 'u';
		}
		else if (last == 'l') output += input[i].toLowerCase();
		else if (last == 'u') output += input[i].toUpperCase();
	}
	return output;
});

StringPra.registerPatternAnalyzer('case', function(pairs){
	var pattern = {case: []};
	var caseCollect = {};
	for (var i = 0; i < pairs.length; i++){
		var pair = pairs[i];

		// check cases
		pattern.case.push(pair.results.c);
		if (!caseCollect[pair.results.c]) caseCollect[pair.results.c] = 0;
		caseCollect[pair.results.c]++;
	}
	var chosenKey;
	var size = 0;
	var keys = Object.keys(caseCollect);
	for (var i = 0; i < keys.length; i++){
		if (size < caseCollect[keys[i]]){
			size = caseCollect[keys[i]];
			chosenKey = keys[i];
		}
	}
	pattern.case = chosenKey;
	return pattern.case;
});
function isLetter(str){
	return str.match(/[a-zA-Z]/g) != undefined;
}

function isNumber(str){
	return str.match(/([0-9]{1,}\.[0-9]{1,})|([0-9])/g) != undefined;
}

function isPunc(str){
	return str.match(/\?|\.|\!|\,|\"|\'|\_|\-/g) != undefined;
}

function isSpace(str){
	return str.match(/ /g) != undefined;
}

function groupLikeCharacters(str, start, subs, txts){
	var len = 0;
	var idx = start;
	var type = '';
	var txt = '';
	if (isLetter(str[idx])) type = 'l';
	else if (isNumber(str[idx])) type = 'n';
	else if (isPunc(str[idx])) type = 'p';
	else if (isSpace(str[idx])) type = 's';
	var exit = false;
	while (true){
		if (str.length <= idx || exit) break;
		switch(type){
			case 'l': {
				if (!isLetter(str[idx])) exit = true;
				break;
			}
			case 'n': {
				if (!isNumber(str[idx])) exit = true;
				break;
			}
			case 'p': {
				if (!isPunc(str[idx])) exit = true;
				break;
			}
			case 's': {
				if (!isSpace(str[idx])) exit = true;
				break;
			}
			default: {
				break;
			}
		}
		if (!exit) txt += str[idx];
		idx++;
	}
	subs.push(type);
	txts.push(txt);
	sp.common.sa.push({type: type, val: txt});
	if (str.length > idx){
		return groupLikeCharacters(str, --idx, subs, txts);
	}
	return {subs: subs, text: txts};
}

StringPra.registerTest('substringAppend', 'sa', function(input, output){
	return groupLikeCharacters(output, 0, [], []).subs;
});

function getCommon(p){
	var vals = [];
	// rule is over 75%
	for (var i = 0; i < sp.common.sa.length; i++){
		if (sp.common.sa[i].type == p){
			vals.push(sp.common.sa[i].val);
		}
	}
	var sort = {};
	for (var i = 0; i < vals.length; i++){
		if (!sort[vals[i]]) sort[vals[i]] = 0;
		sort[vals[i]]++;
	}
	var chosenKey = null;
	var num = 0;
	var keys = Object.keys(sort);
	for (var i = 0; i < keys.length; i++){
		if (sort[keys[i]] > num){
			num = sort[keys[i]];
			chosenKey = keys[i];
		}
	}
	if ((sort[chosenKey] / vals.length) > 0.75) return chosenKey;
	return false;
}

StringPra.analyze.push(function(input, pattern){
	var group = groupLikeCharacters(input, 0, [], []);
	var result = '';

	for (var i = 0; i < pattern.substringAppend.length; i++){
		var common = getCommon(pattern.substringAppend[i]);
		if (group.subs[i] && group.subs[i] == pattern.substringAppend[i]){
			if (common){
				result += common;
			}
			else{
				result += group.text[i];
			}
		}
		else if (group.subs[i] == 's' && (i == 0 || i == pattern.substringAppend.length - 1)){ // trailing spaces
			group.subs.splice(i, 1);
			group.text.splice(i, 1);
			i--;
		}
		else if (common){
			result += common;
			group.subs.splice(i - 1, 0, pattern.substringAppend[i]);
			group.text.splice(i - 1, 0, common);
		}
	}
	return result;
});

StringPra.registerPatternAnalyzer('substringAppend', function(pairs){
	var pattern = {substringAppend: []};
	var caseCollect = {};
	for (var i = 0; i < pairs.length; i++){
		var pair = pairs[i];

		// check cases
		pattern.substringAppend.push(pair.results.sa);
		if (!caseCollect[pair.results.sa]) caseCollect[pair.results.sa] = 0;
		caseCollect[pair.results.sa]++;
	}
	var chosenKey;
	var size = 0;
	var keys = Object.keys(caseCollect);
	for (var i = 0; i < keys.length; i++){
		if (size < caseCollect[keys[i]]){
			size = caseCollect[keys[i]];
			chosenKey = keys[i];
		}
	}
	if (chosenKey.indexOf(',') > -1) chosenKey = chosenKey.split(',');
	pattern.substringAppend = chosenKey;
	return pattern.substringAppend;
});

var sp = new StringPra();
sp.train('BIO 265 - Fix', 'BIO 265');
sp.train('comm 120 - fix', 'COMM 120');
sp.train('ENg 100 - Fix', 'ENG 100');
var a1 = sp.analyze('Art 100 - fix');
// console.log(sp.analyze('Eng 106 - FIX'));
// console.log(sp.analyze('FdMaT108-Fix'));
// console.log(sp.analyze('ART 130-Fix'));
// console.log(sp.analyze('b100-Fix'));
// console.log(sp.analyze('fdrel    121-Fix  '));