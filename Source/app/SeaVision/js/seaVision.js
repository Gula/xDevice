window.addEvent('domready', function() {



  var grafo = new xDevice.Base('grafo', {
    height: 350
  });


  // Nodos de mediciones
  //Selection of nodes with class atribute = header (see index.html)
  var nodes = $$('.header'); //$$ is a selection function. The dot in '.header' means class atribute.
	
  var timer = '';
  var timerCounter = new Number;
	
  $('loadStart').addEvent('click', function(e) {
    e.stop();
    timer = loadData.periodical(timeRefresh); //timer is the identifier of the xxx.periodical() method.
  //When we want to cancel the periodical method, we $clear(timer)  (See below)
  });

  $('loadStop').addEvent('click', function(e) {
    e.stop();
    grafo.clear();
    timer = $clear(timer); //cancel the periodical method. In this case, stop loadData from being executed periodically.
  });

  // EXPLANATION:
  // channel1, channel2, ...
  // measure1, measure2, ...
  // unit1, unit2, ...
  // are tags in the index.html. What we do here is to generate a string that contains, separated by ';',
  // the instructions to substitue each tag with a field in the array "measurements" that lives in sensor01.json. For example, we'll have:
  // stringJS = $('channel1').set('text', $measurements[0].description); $('measure1').set('text', $measurements[0].value); $('unit1').set('text', $measurements[0].unit);
  //		  $('channel2').set('text', $measurements[1].description); $('measure2').set('text', $measurements[1].value); $('unit2').set('text', $measurements[1].unit);
  //		  ....
  // So the update of all values happens at once when this string is passed to the function eval in measureRefresh().
	
	
  var stringJS = '';
  nodes.each(function(node, iD) {
    stringJS += '$(\'channel' +(iD+1)+ '\').set(\'text\', $measurements[' +iD+ '].description);';
    stringJS += '$(\'measure' +(iD+1)+ '\').set(\'text\', $measurements[' +iD+ '].value);';
    stringJS += '$(\'unit' +(iD+1)+ '\').set(\'text\', $measurements[' +iD+ '].unit);';
  });


  //grafo.renderPoli();
  //grafo.clear();
  
	
  // Update of values from file. We also display a timer running.
  var loadData = function() {
    timerCounter += timeRefresh.toInt();
    $('count').set('text', timerCounter/1000);


    // The following  grabs the json object. I believe we need the random part in the URL so the page doesn't get cached by the browser
    // and actually gets updated. Once we have completed receiveing the json object, we call the measureRefresh() function.
    var request = new Request.JSON({
      url: dataPath + dataFile + '?rnd=' + $random(0,999999),
      method:'get',
      onComplete: function(jsonObj) {
        measureRefresh(jsonObj.measurements);
      }
    }).send();
  };
	
	
  // Update of values.
  var measureRefresh = function($measurements) {
    grafo.storeData($measurements[1].value)
    eval(stringJS);
  };


  // Sending commands
  $('command-form').addEvent('submit', function(e) {
    //Prevents the default submit event from loading a new page.
    e.stop();
    var serverResponse = $('server-response');

    //"this" refers to the $('myForm') element (to $('command-form'))
    this.set('send', {
      //	onFailure: function(xhr) {
      //		serverResponse.addClass('error');
      //		if (xhr.status == 404) serverResponse.set('html', '<p>Script <strong>'+$('command-form').get('action')+'</strong> no encontrado !</p>');
      //		else serverResponse.set('html', xhr.responseText);
      //	}
      //	},
      //	onComplete: function(response) {
      //		serverResponse.removeClass('error');
      //		serverResponse.set('html', response);
      //	}
      });
    //Send the form.
    this.send();
  });

});

