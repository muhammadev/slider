// main variables
let slider = document.querySelector(".carousel-slide")
let sliderWindow = slider.getBoundingClientRect().width;
let slidesContainer = document.querySelector(".carousel-container");
let slides = slidesContainer.children;
let blurred = document.querySelector(".blurred");
let dots = document.querySelector(".dots");

// add first/last images
function firstLast() {
let firstImgSrc = slides[0].src;
let firstToLast = document.createElement("img");
firstToLast.setAttribute("src", firstImgSrc);
firstToLast.setAttribute("alt", "first-img-at-the-end");
firstToLast.setAttribute("id", "firstToLast");
slidesContainer.append(firstToLast);

let lastImgSrc = slides[slides.length-2].src;
let lastToFirst = document.createElement("img");
lastToFirst.setAttribute("src", lastImgSrc);
lastToFirst.setAttribute("alt", "last-img-at-the-top");
lastToFirst.setAttribute("id", "lastToFirst");
slidesContainer.insertBefore(lastToFirst, slidesContainer.firstChild);	
}
firstLast();

// create images dots
function imgsDots() {
	for (let i=0; i < slides.length-2; i++) {
		let div = document.createElement("div");
		div.setAttribute("class", "dot");
		div.setAttribute("id", i+1);
		dots.append(div);
	}
	dots.style.left = `calc(50% - ${dots.getBoundingClientRect().width/2}px)`;
	console.log("dots length", dots.children.length)
}
imgsDots();

// create slider engine
function sliderEngine() {
	let counter = 1;
	
	// initialize first image
	slidesContainer.style.transform = `translateX(-${sliderWindow * counter}px)`;
	// initialize first dot
	dots.children[counter-1].style.background = "#6f6f6f";

	// cursor pointer at left/right edges
	document.body.addEventListener("mousemove", (e) => {
		if (e.clientX >= (window.innerWidth/3 * 2) || e.clientX < (window.innerWidth/3)) {
			return document.body.style.cursor = "pointer";
		}
		document.body.style.cursor = "default";
	})

	// slide when click at left/right edges
	document.addEventListener("click", (e) => {
		if (e.clientX >= (window.innerWidth/3 * 2) && counter < 10) {
			counter++;
			adjustSlides();
		}

		if (e.clientX < (window.innerWidth/3) && counter > 0) {
			counter--;
			adjustSlides();
		}
	})

	// slide when press left/right arrow keys
	document.addEventListener("keyup", (e) => {
		if (e.keyCode == 39 && counter < 10) {
			counter++;
			adjustSlides();
		}

		if (e.keyCode == 37 && counter > 0) {
			counter--;
			adjustSlides();
		}
	})

	// infinite scrolling by travelling to fitst (or last) image when reaches last (or first) image
	slidesContainer.addEventListener("transitionend", () => {
		if (counter == 10) {
			counter = 1;
			slidesContainer.style.transform = `translateX(-${sliderWindow * counter}px)`;
			slidesContainer.style.transition = `none`;		
		}

		if (counter == 0) {
			counter = 9;
			slidesContainer.style.transform = `translateX(-${sliderWindow * counter}px)`;
			slidesContainer.style.transition = `none`;		
		}
	})

	function adjustDots() {
		for (let i=0; i < dots.children.length; i++) {
			dots.children[i].style.background = "rgba(255,255,255, .1)";
		}
		if (counter === 0) {
			dots.children[8].style.background = "rgba(62, 62, 62, 0.8)";
		}
		else if (counter === 10) {
			dots.children[0].style.background = "rgba(62, 62, 62, 0.8)";
		}
		else {
			dots.children[counter-1].style.background = "rgba(62, 62, 62, 0.8)";
		}
	}

	function adjustSlides() {
		slidesContainer.style.transform = `translateX(-${sliderWindow * counter}px)`;
		// transition here not to make it slide when initialize first image
		slidesContainer.style.transition = `.3s ease`;

		// timeout to make it nicer ** without timeout it lags a bit **
		setTimeout(function() {
			blurred.style.background = `url(${slides[counter].src}) center/cover no-repeat`
		}, 250);

		adjustDots();
	}

	for (let i=0; i < dots.children.length; i++) {
		dots.children[i].addEventListener("click", function(e) {
			counter = Number(e.target.id);
			adjustSlides();
		})
	}
}
sliderEngine()
