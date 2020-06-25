// main variables
let slider = document.querySelector(".carousel-slide")
let sliderWindow = slider.getBoundingClientRect().width;
let slidesContainer = document.querySelector(".carousel-container");
let slides = slidesContainer.children;
let blurred = document.querySelector(".blurred");
let dots = document.querySelector(".dots");
let stopped = document.querySelector(".stopped");

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
];

// create slider engine
function SliderEngine(imgs) {
	this.imgs = imgs;
	this.counter = 1;
	this.overImg = false;
	this.transition = .4;
	this.nowYouAreFree = true;
	this.imgsMaker = function() {
		this.imgs.push(this.imgs[0]);
		this.imgs.unshift(this.imgs[this.imgs.length-2]);
		let holder = document.querySelector(".carousel-container");
		for (let i=0; i < this.imgs.length; i++) {
			let img = document.createElement("img");
			img.setAttribute("src", this.imgs[i]);
			img.setAttribute("id", i);
			holder.append(img);
		}
	};
	this.dotsMaker = function() {
		for (let i=0; i < slides.length-2; i++) {
			let div = document.createElement("div");
			div.setAttribute("class", "dot");
			div.setAttribute("id", i+1);
			dots.append(div);
		}
		dots.style.left = `calc(50% - ${dots.getBoundingClientRect().width/2}px)`;
		console.log("dots length", dots.children.length)
	};
	this.adjustPointer = function() {
		document.body.addEventListener("mousemove", (e) => {
			if (e.clientX >= (window.innerWidth/4 * 3) || e.clientX < (window.innerWidth/4)) {
				if (e.clientY >= (window.innerHeight/3) && e.clientY <= (window.innerHeight/3 * 2)) {
					return document.body.style.cursor = "pointer";
				}
			}
			document.body.style.cursor = "default";
		})
	};
	this.slideOnClick = function() {
		document.addEventListener("click", (e) => {
			if (e.clientX >= (window.innerWidth/4 * 3) && this.counter < 10 && this.nowYouAreFree) {
				if (e.clientY >= (window.innerHeight/3) && e.clientY <= (window.innerHeight/3 * 2)) {
					this.nowYouAreFree = false;
					console.log("click triggered", this.nowYouAreFree);
					this.counter++;
					this.adjustSlides();
				}
			}

			if (e.clientX < (window.innerWidth/4) && this.counter > 0 && this.nowYouAreFree) {
				if (e.clientY >= (window.innerHeight/3) && e.clientY <= (window.innerHeight/3 * 2)) {
					this.nowYouAreFree = false;
					console.log("click triggered", this.nowYouAreFree);
					this.counter--;
					this.adjustSlides();
				}
			}
		});
	};
	// slide when press left/right arrow keys
	this.slideOnKeyPress = function() {
		document.addEventListener("keydown", (e) => {
			if (e.keyCode == 39 && this.counter < 10 && this.nowYouAreFree) {
				this.nowYouAreFree = false;
				console.log("key triggered", this.nowYouAreFree);
				this.counter++;
				this.adjustSlides();
			}

			if (e.keyCode == 37 && this.counter > 0 && this.nowYouAreFree) {
				this.nowYouAreFree = false;
				console.log("key triggered", this.nowYouAreFree);
				this.counter--;
				this.adjustSlides();
			}
		})
	};
	// infinite scrolling by travelling to fitst (or last) image when reaches last (or first) image
	this.infiniteScrolling = function() {
		slidesContainer.addEventListener("transitionend", () => {
			this.nowYouAreFree = true;
			console.log("transitionend triggered", this.nowYouAreFree);
			if (this.counter == 10) {
				this.counter = 1;
				slidesContainer.style.transform = `translateX(-${sliderWindow * this.counter}px)`;
				slidesContainer.style.transition = `none`;
			}

			if (this.counter == 0) {
				this.counter = 9;
				slidesContainer.style.transform = `translateX(-${sliderWindow * this.counter}px)`;
				slidesContainer.style.transition = `none`;		
			}
		});
	};
	// highlighting the dot corrinsponding to the current image
	this.adjustDots = function() {
		const light = "rgba(255,255,255, .1)";
		const dark = "rgba(32, 32, 32, .8)";
		for (let i=0; i < dots.children.length; i++) {
			dots.children[i].style.background = light;
		}
		if (this.counter === 0) {
			dots.children[8].style.background = dark;
		}
		else if (this.counter === 10) {
			dots.children[0].style.background = dark;
		}
		else {
			dots.children[this.counter-1].style.background = dark;
		}
	};
	// sliding images by clicking dots
	this.slideOnDotsClicking = () => {
		for (let i=0; i < dots.children.length; i++) {
			dots.children[i].addEventListener("click", (e) => {
				this.counter = Number(e.target.id);
				this.adjustSlides();
			})
		}
	};
	// slide every 5 seconds
	this.autoSliding = function() {
		this.counter ++;
		this.adjustSlides();
	}
	// main function for sliding images
	this.adjustSlides = function() {
		slidesContainer.style.transform = `translateX(-${sliderWindow * this.counter}px)`;
		// transition here not to make it slide when initialize first image
		slidesContainer.style.transition = `${this.transition}s ease`;

		blurred.style.background = `url(${slides[this.counter].src}) center/cover no-repeat`;

		// clear the interval every time an image sliding commited and then reset the interval
		if (this.overImg) {
			clearInterval(this.interval);
		} else {
			clearInterval(this.interval);
			this.interval = setInterval(this.autoSliding, 4000);
		}

		this.adjustDots();
	};

	this.imgsMaker();
	this.dotsMaker();
	this.adjustPointer();
	this.slideOnClick();
	this.slideOnKeyPress();
	this.infiniteScrolling();
	this.slideOnDotsClicking();

	slider.addEventListener("mouseover", () => {
		stopped.innerHTML = "NOW STOPPED!";
		stopped.style.padding = "2px";
		this.overImg = !this.overImg;
		console.log(this.overImg);
		this.adjustSlides();
	})
	slider.addEventListener("mouseout", () => {
		stopped.innerHTML = "";
		stopped.style.padding = 0;
		this.overImg = !this.overImg;
		console.log(this.overImg);
		this.adjustSlides();
	})

	// initialize first image
	slidesContainer.style.transform = `translateX(-${sliderWindow * this.counter}px)`;
	// initialize first background image
	blurred.style.background = `url(${slides[this.counter].src}) center/cover no-repeat`;
	// initialize first dot
	dots.children[this.counter-1].style.background = "rgba(62, 62, 62, 0.9)";
	// initialize auto sliding
	this.interval = setInterval(this.autoSliding, 4000);
}
SliderEngine(imgs);

let closeBtn = document.querySelector(".close");
let openBtn = document.querySelector(".open");
let controlGuide = document.querySelector(".holder");
closeBtn.addEventListener("click", function() {
	controlGuide.style.display = "none";
	openBtn.style.display = "inline-block";
})
openBtn.addEventListener("click", function() {
	controlGuide.style.display = "block";
	openBtn.style.display = "none";
})
