function StringPra(){
	this.mainfest = {};
	this.processPair = [];
	this.current = null;
	this.isAnalyzed = false;
	this.analzedResults = {};
	this.pattern = {};
}

StringPra.tests = [];
StringPra.analyze = [];
StringPra.patterns = [];

StringPra.prototype.train = function(input, output){
	this.current = {input: input, output: output, results: {}};
	this.processPair.push(this.current);

	for (var i = 0; i < StringPra.tests.length; i++){
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
	var match = letter.match(/[a-z]/g);
	return match != undefined && match.length == 1 ? 'l' : 'u';
}

function isLetter(letter){
	return letter.match(/[a-zA-Z]/g) != undefined;
}

StringPra.registerTest('casePattern', 'c', function(input, output){
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
	for (var key in caseCollect){
		if (size < caseCollect[key]){
			size = caseCollect[key];
			chosenKey = key;
		}
	}
	pattern.case = key;
	return pattern.case;
})