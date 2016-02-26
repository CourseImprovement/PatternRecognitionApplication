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