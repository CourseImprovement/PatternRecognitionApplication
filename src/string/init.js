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