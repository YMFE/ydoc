console.log('app.js');

var $menu = document.getElementById('js-menu');
var $panel = document.getElementById('js-panel');
var $header = document.getElementById('js-header');
var $summaryItems = Array.prototype.slice.call(document.querySelectorAll('#js-menu .href'));

var utils = {
	debounce: function(func, wait) {
		var timeout;
		return function () {
			clearTimeout(timeout);
			timeout = setTimeout(func, wait);
		};
	}
};

// Add 'active' to summary item
function itemAddActive() {
	var locationHref = window.location.href;
	$summaryItems.map(function (item, index) {
		if (item.href === locationHref) {
			// add 'active' for present summary item.
			item.parentElement.classList.add('active');
		} else {
			item.parentElement.classList.remove('active');
		}
	});
}

// Add EventListener
function addEvents() {
	$panel.onscroll = function(e) {
		itemAddActive();
		if (e.target.scrollTop > 0) {
			$header.classList.add('moved');
		} else {
			$header.classList.remove('moved');
		}
	};
}

// initial components
function initComponents() {
	// nav
	var navigation = responsiveNav('.js-nav', {
		customToggle: '#js-nav-btn'
	});

	// summary
	if ($menu) {
		var slideout = new Slideout({
			'panel': document.getElementById('js-panel'),
			'menu': document.getElementById('js-menu'),
			'padding': 256,
			'tolerance': 70
		});
	}
}

window.onload = function() {
	addEvents();
	initComponents();
	itemAddActive();
};

// Toggle button
// document.querySelector('.js-slide-btn').addEventListener('click', function () {
// 	slideout.toggle();
// });

// function close(eve) {
// 	eve.preventDefault();
// 	slideout.close();
// }

// slideout
// 	.on('beforeopen', function () {
// 		this.panel.classList.add('m-panel-open');
// 	})
// 	.on('open', function () {
// 		this.panel.addEventListener('click', close);
// 	})
// 	.on('beforeclose', function () {
// 		this.panel.classList.remove('m-panel-open');
// 		this.panel.removeEventListener('click', close);
// 	});

// translate the fixed header
// var fixed = document.querySelector('.js-header');
// slideout.on('translate', function (translated) {
// 	fixed.style.transform = 'translateX(' + translated + 'px)';
// });
// slideout.on('beforeopen', function () {
// 	fixed.style.transition = 'transform 300ms ease';
// 	fixed.style.transform = 'translateX(256px)';
// });
// slideout.on('beforeclose', function () {
// 	fixed.style.transition = 'transform 300ms ease';
// 	fixed.style.transform = 'translateX(0px)';
// });
// slideout.on('open', function () {
// 	fixed.style.transition = '';
// });
// slideout.on('close', function () {
// 	fixed.style.transition = '';
// });