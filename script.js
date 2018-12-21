$( document ).ready(function() {
	var $canvas = $('#canvas');
	var $current = 0;
	var $max = 5;
	var $colorset = ['rgba(193, 66, 66, 0.7)', 'rgba(63, 63, 191, 0.7)', 'rgba(204, 204, 81, 0.7)', 'rgba(81, 204, 81, 0.7)','rgba(204, 81, 204, 0.7)', 'rgba(231, 132, 33, 0.7)'];
	var $Shops = 0;
	var $i = 1;
	var $j = 0;
	var $filename = getParam('csv');
	var $save = [];

	document.getElementById("canvas").style = "background: url('data/" + getParam('csv') + ".jpg')"

    $.ajax({
            url: 'data/' + $filename + '.csv',
            type: 'get',
            dataType: 'text',
            mimeType: 'text/csv',
            async: false,
            success: function(test) {
	  				$Shops = $.csv.toArrays(test, {separator:';'});
            }
    });

	while($i <= $Shops.length-1){
		if($Shops[$i][17] != ''){
				$mesure = $Shops[$i][4].split('x');
				addShop($Shops[$i][0],$mesure[0],$mesure[1]);
		}
		$i++
	}
	console.log(localStorage.getItem(getParam('csv')));

		$canvas.addLayer({
		    type: 'rectangle',
		    fillStyle: 'grey',
		    draggable: false,
		    fromCenter: false,
		    x: 10,
		    y: 150,
		    width: 50,
		    height: 50,
		    click: function(layer) {
		    	console.log('save');
			    save();
			}
		})

		$canvas.addLayer({
		    type: 'rectangle',
		    fillStyle: 'red',
		    draggable: false,
		    fromCenter: false,
		    x: 10,
		    y: 220,
		    width: 50,
		    height: 50,
		    click: function(layer) {
		    	console.log('load');
			    load();
			}
		})
	function save(){
		while(typeof $canvas.getLayer($j) !== 'undefined'){
			if($canvas.getLayer($j).name !== null){
				$save[$j] = new Array(4);
				$save[$j][1] = $canvas.getLayer($j).name;
				$save[$j][2] = $canvas.getLayer($j).x;
				$save[$j][3] = $canvas.getLayer($j).y;
				$save[$j][4] = $canvas.getLayer($j).rotate;
			}
			$j++
		}
		localStorage.setItem(getParam('csv'),JSON.stringify($save));
	}

	function load(){
		var load = localStorage.getItem(getParam('csv'));
		var props = JSON.parse(load);
		i = 0;

		while(i <= props.length-1){
			if(props[i] !== null){
				console.log(props[i][1]);
				$canvas.animateLayer($canvas.getLayer(props[i][1]), {
					       rotate: props[i][4],
					    });

				$canvas.animateLayer($canvas.getLayer(props[i][1]), {
					       x: props[i][2],
					       y: props[i][3],
					    });

				$canvas.animateLayer($canvas.getLayer(props[i][1]+'t'), { //	 x: 50+(11.5*$x/2), y: 50+(11.5*$y/2),
					       x: props[i][2] + ($canvas.getLayer(props[i][1]).width/2),
					       y: props[i][3] + ($canvas.getLayer(props[i][1]).height/2),
					    });

			}
			i++;
		}
	}

	function getParam(name){
	    var results = new RegExp('[\?&]' + name + '=([^]*)').exec(window.location.href);
	    if (results==null){
	       return null;
	    }
	    else{
	       return results[1] || 0;
	    }
	}

	function getColor($c){
		if($c <= 6){
			return $colorset[$c-1];
		}else{
			return $colorset[$c%6];
		}
	}
	function addShop($c,$x,$y){
		$canvas.addLayer({
		    type: 'rectangle',
		    fillStyle: getColor($c),
		    name: [$c] + 'n',
		    groups: [$c],
		    dragGroups: [$c],
		    draggable: true,
		    fromCenter: false,
		    x: 50,
		    y: 50,
		    width: 11.5*$x,
		    height: 11.5*$y,

			mouseover: function(layer) {
				$("body").css("overflow", "hidden");
			 	$(this).on('mousewheel', function(event) {
				    $(this).animateLayer(layer, {
				       rotate: '+=' + event.deltaY*8
				    });
				});
			},

			mouseout: function(layer) {
				$("body").css("overflow", "scroll");
			    $(this).unbind('mousewheel');
			    $canvas.stopLayerGroup($c);

			  }

		})

		$canvas.drawText({
		  fillStyle: 'black',
		  strokeStyle: 'white',
		  strokeWidth: 1,
		  name: [$c] + 'nt',
		  groups: [$c],
		  dragGroups: [$c],
		  draggable: true,
		  x: 50+(11.5*$x/2), y: 50+(11.5*$y/2),
		  fontSize: 30,
		  fontFamily: 'Verdana, sans-serif',
		  text: $c
		});
	}
});