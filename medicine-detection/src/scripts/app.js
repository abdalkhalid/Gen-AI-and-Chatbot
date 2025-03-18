const URL = "https://teachablemachine.withgoogle.com/models/3rEN_XQF9/";

let model, webcam, labelContainer, maxPredictions;
let cart = {}; // Stores medicines and counts

// Load model on page load
async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
}

loadModel(); // Load model when page loads

// Initialize webcam for live scanning
async function initWebcam() {
    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);
    document.getElementById("webcam-container").appendChild(webcam.canvas);
}

async function loop() {
    webcam.update();
    await predict(webcam.canvas);
    window.requestAnimationFrame(loop);
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            let img = new Image();
            img.src = e.target.result;
            img.onload = async function () {
                document.getElementById("image-preview").innerHTML = `<img src="${img.src}" class="rounded-lg max-w-full h-auto" />`;
                await predict(img);
            };
        };
        reader.readAsDataURL(file);
    }
}

async function handleImageUploadAndClearWebcam(event) {
    if (webcam) {
        await webcam.stop(); // Stop the camera completely
        webcam = null; // Clear the webcam instance
    }
    document.getElementById("webcam-container").innerHTML = ""; // Clear webcam feed

    // Proceed with image upload only after the camera is turned off
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            let img = new Image();
            img.src = e.target.result;
            img.onload = async function () {
                document.getElementById("image-preview").innerHTML = `<img src="${img.src}" class="rounded-lg max-w-full h-auto" />`;
                await predict(img);
            };
        };
        reader.readAsDataURL(file);
    }
}

// Prediction function (works for both webcam & uploaded images)
async function predict(imageSource) {
    const prediction = await model.predict(imageSource);
    labelContainer.innerHTML = ""; // Clear previous results

    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = prediction[i].probability.toFixed(2);
        const percentage = (probability * 100).toFixed(0);

        labelContainer.innerHTML += `
            <div class="space-y-1">
                <p>${className}: ${percentage}%</p>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-green-600 h-2 rounded-full" style="width: ${percentage}%"></div>
                </div>
            </div>`;

        // If confidence is 70% or more, add to cart
        if (probability >= 0.7) {
            if (cart[className]) {
                cart[className]++;
            } else {
                cart[className] = 1;
            }
            updateCart();
        }
    }
}

// Load cart from localStorage on page load
function loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart and save it to localStorage
function updateCart() {
    let cartList = document.getElementById("cart-list");
    cartList.innerHTML = ""; // Clear previous list

    for (const [medName, count] of Object.entries(cart)) {
        let listItem = document.createElement("li");
        listItem.innerHTML = `💊 ${medName} - Count: ${count}`;
        cartList.appendChild(listItem);
    }

    saveCart(); // Save the updated cart
}

// Clear cart and remove it from localStorage
function clearCart() {
    cart = {}; // Reset cart
    updateCart();
    localStorage.removeItem("cart"); // Remove cart from localStorage
}

async function initWebcamAndClearPreview() {
    if (webcam) {
        await webcam.stop(); // Stop the camera if already running
        webcam = null; // Clear the webcam instance
    }
    document.getElementById("image-preview").innerHTML = ""; // Clear uploaded image preview
    await initWebcam(); // Initialize webcam
}

// Load cart when the page loads
document.addEventListener("DOMContentLoaded", loadCart);
