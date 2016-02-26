var file = null;
var sp = new StringPra();

function runCSV(file, callback){
	var reader = new FileReader();

	reader.onload = function(e) {
	  var text = reader.result;
	  csv = Papa.parse(text);
	  callback(csv);
	}

	reader.readAsText(file, 'utf8');
}

var output = '';

function testCSV(){
	var file = document.getElementById('file').files[0];
	if (file != undefined) {
		runCSV(file, function(data){
			var set = data.data;
			for (var i = 0; i < set.length; i++) {
				if (set[i].length == 1) continue;
				if (set[i][1] != "") {
					sp.train(set[i][0], set[i][1]);
				} else {
					output += '<strong>old:&nbsp;</strong>' + set[i][0] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>new:&nbsp;</strong>' + sp.analyze(set[i][0]) + '<br><br>';
				}
			}
			document.body.innerHTML += output;
		});
	}
}