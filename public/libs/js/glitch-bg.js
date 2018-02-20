// https://codepen.io/kersley/pen/vJOQxz

// var wrapper = document.querySelector('.wrapper');
// var img = document.querySelector('.glitchme');
// var count = Number(img.dataset.glitchCount);
//
// img.addEventListener('load', function(){
// 	for(var i = 0; i < count; i++){
// 		var glitch = document.createElement('div');
//
// 		// add cloned image to div wrapper
// 		glitch.className += ' glitched glitch-'+i;
// 		glitch.style = 'background-image: url('+img.getAttribute('src')+'); width: '+img.width+'px; height:'+img.height+'px';
//
// 		wrapper.appendChild(glitch);
// 	}
// });
//
// setInterval(function(){
// 	var glitches = document.querySelectorAll('.glitched');
// 	for(var i = 0; i < glitches.length; i++){
// 		glitches[i].classList.toggle('glitch-pause');
// 	}
// }, 3000);