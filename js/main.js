// main variables
let slider = document.querySelector(".carousel-slide")
let sliderWindow = slider.getBoundingClientRect().width;
let slidesContainer = document.querySelector(".carousel-container");
let slides = slidesContainer.children;
let blurred = document.querySelector(".blurred");
let dots = document.querySelector(".dots");


let imgs = [
	"imgs/forest.jpg",
	"imgs/wolf.jpg",
	"imgs/moon.jpg",
	"imgs/small-flowers.jpg",
	"imgs/window.jpg",
	"imgs/milkandapple.jpg",
	"imgs/mountain.jpg",
	"imgs/city-mountain.jpg",
	"imgs/green-mountain.jpg"
]

function imgsMaker(imgs) {
	imgs.push(imgs[0]);
	imgs.unshift(imgs[imgs.length-2]);

	let holder = document.querySelector(".carousel-container");
	for (let i=0; i < imgs.length; i++) {
		let img = document.createElement("img");
		img.setAttribute("src", imgs[i]);
		img.setAttribute("id", i);
		holder.append(img);
	}
	console.log("called")
}
imgsMaker(imgs);

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
	// initialize first background image
	blurred.style.background = `url(${slides[counter].src}) center/cover no-repeat`;
	// initialize first dot
	dots.children[counter-1].style.background = "rgba(62, 62, 62, 0.9)";

	// cursor pointer at left/right edges
	document.body.addEventListener("mousemove", (e) => {
		if (e.clientX >= (window.innerWidth/4 * 3) || e.clientX < (window.innerWidth/4)) {
			if (e.clientY >= (window.innerHeight/3) && e.clientY <= (window.innerHeight/3 * 2)) {
				return document.body.style.cursor = "pointer";
			}
		}
		document.body.style.cursor = "default";
	})

	// slide when click at left/right edges
	document.addEventListener("click", (e) => {
		if (e.clientX >= (window.innerWidth/4 * 3) && counter < 10) {
			if (e.clientY >= (window.innerHeight/3) && e.clientY <= (window.innerHeight/3 * 2)) {
				counter++;
				adjustSlides();
			}
		}

		if (e.clientX < (window.innerWidth/4) && counter > 0) {
			if (e.clientY >= (window.innerHeight/3) && e.clientY <= (window.innerHeight/3 * 2)) {
				counter--;
				adjustSlides();
			}
		}
	})

	// slide when press left/right arrow keys
	document.addEventListener("keydown", (e) => {
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
		const light = "rgba(255,255,255, .1)";
		const dark = "rgba(32, 32, 32, .8)";
		for (let i=0; i < dots.children.length; i++) {
			dots.children[i].style.background = light;
		}
		if (counter === 0) {
			dots.children[8].style.background = dark;
		}
		else if (counter === 10) {
			dots.children[0].style.background = dark;
		}
		else {
			dots.children[counter-1].style.background = dark;
		}
	}

	function adjustSlides() {
		slidesContainer.style.transform = `translateX(-${sliderWindow * counter}px)`;
		// transition here not to make it slide when initialize first image
		slidesContainer.style.transition = `.3s ease`;

		blurred.style.background = `url(${slides[counter].src}) center/cover no-repeat`;

		clearInterval(thisInterval);
		thisInterval = setInterval(autoSliding, 5000);

		adjustDots();
	}

	for (let i=0; i < dots.children.length; i++) {
		dots.children[i].addEventListener("click", function(e) {
			counter = Number(e.target.id);
			adjustSlides();
		})
	}

	// slide every 5 seconds
	function autoSliding() {
		counter ++;
		adjustSlides();
	}
	let thisInterval = setInterval(autoSliding, 5000);
}
sliderEngine()

let closeBtn = document.querySelector(".close");
closeBtn.addEventListener("click", function() {
	let controlGuide = document.querySelector(".control-guide");
	controlGuide.style.display = "none";
})
