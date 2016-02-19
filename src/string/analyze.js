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