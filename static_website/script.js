$(document).ready(function () {
    $("#navbar").load("header.html");
});

$(document).ready(function () {
    
    // ==========================================
    // 1. REGISTRATION FORM VALIDATION
    // ==========================================
    $(".register").on("submit", function (e) {
        let isValid = true;
        
        let name = $("input[name='name']").val().trim();
        let email = $("input[name='email']").val().trim();
        let password = $("input[name='password']").val().trim();
        let genderChecked = $("input[name='Gender']:checked").length > 0;
        let stateSelected = $(".state select").val();

        if (name === "") {
            alert("Please enter your full name.");
            isValid = false;
        } else if (email === "") {
            alert("Please enter your email address.");
            isValid = false;
        } else if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            isValid = false;
        } else if (!genderChecked) {
            alert("Please select your gender.");
            isValid = false;
        } else if (stateSelected === "") {
            alert("Please select your state.");
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault(); 
        } else {
            alert("Registration successful!");
        }
    });

    // ==========================================
    // 2. LOGIN FORM VALIDATION
    // ==========================================
    $(".login").on("submit", function (e) {
        let isValid = true;
        let username = $(".login input[type='text']").val().trim();
        let password = $(".login input[type='password']").val().trim();

        if (username === "") {
            alert("Please enter your username.");
            isValid = false;
        } else if (password === "") {
            alert("Please enter your password.");
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();
        } else {
            alert("Logged in successfully!");
        }
    });

    // ==========================================
    // 3. ADD TO CART FUNCTIONALITY WITH IMAGES & PRICE MAPPING
    // ==========================================
    $("div[class^='box'] button").on("click", function (e) {
        e.preventDefault();

        // Get the parent box layer container
        let productBox = $(this).closest("div");

        // Dynamically scrape the structural Name and Image path 
        let productName = productBox.find("p").text().trim();
        let productImage = productBox.find("img").attr("src");
        
        // Define distinct prices for your variations mapping dynamically
        let productPrice = 99; // baseline generic price
        if (productName === "Adidas Sneakers 11") productPrice = 110;
        else if (productName === "Adidas Sneakers 12") productPrice = 125;
        else if (productName === "Adidas Sneakers 13") productPrice = 130;
        else if (productName === "Adidas Sneakers 14") productPrice = 145;
        else if (productName === "Adidas Sneakers 15") productPrice = 150;
        else if (productName === "Adidas Sneakers 16") productPrice = 165;

        let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

        // Check if item already exists inside storage arrays
        let existingItem = cart.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ 
                name: productName, 
                price: productPrice, 
                image: productImage,
                quantity: 1 
            });
        }

        localStorage.setItem("shoppingCart", JSON.stringify(cart));
        alert(productName + " added to cart!");
        
        window.location.href = "cart.html";
    });

    // ==========================================
    // 4. DISPLAY CART ITEMS ON CART PAGE
    // ==========================================
    if (window.location.pathname.includes("cart.html")) {
        displayCart();
    }

    function displayCart() {
        let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
        let cartItemsContainer = $("#cart-items");
        let totalElement = $("#cart-total");
        
        cartItemsContainer.empty(); 
        let grandTotal = 0;

        if (cart.length === 0) {
            cartItemsContainer.append(`<tr><td colspan="5" style="text-align:center; padding: 20px;">Your cart is empty.</td></tr>`);
            totalElement.text("0");
            return;
        }

        cart.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;

            // Injected item.image layout configuration seamlessly
            let row = `
                <tr>
                    <td style="padding: 10px; text-align: center;">
                        <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 50px; object-fit: cover; border-radius: 4px;">
                    </td>
                    <td style="padding: 10px;">${item.name}</td>
                    <td style="padding: 10px;">$${item.price}</td>
                    <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                    <td style="padding: 10px; text-align: center;"><button class="remove-btn" data-index="${index}">Remove</button></td>
                </tr>
            `;
            cartItemsContainer.append(row);
        });

        totalElement.text(grandTotal);
    }

    // Remove single item line from Cart calculation array
    $(document).on("click", ".remove-btn", function () {
        let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
        let indexToRemove = $(this).data("index");

        cart.splice(indexToRemove, 1); 
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
        displayCart(); 
    });

    // Reset clean empty storage state completely 
    $("#clear-cart").on("click", function () {
        localStorage.removeItem("shoppingCart");
        displayCart();
    });
});