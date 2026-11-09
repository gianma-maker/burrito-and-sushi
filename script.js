/* ==========================================================
   SNAKKO – script.js
   Dito ang menu, ang cart at ang order list.
   ========================================================== */


/* ----------------------------------------------------------
   1. MENU
   Dito mo palitan ang pangalan, description at presyo.
   Para magdagdag ng bagong produkto, kopyahin ang isang
   { ... } block at ilagay sa ilalim (lagyan ng kuwit , sa pagitan).

   - image: pangalan ng image variable sa style.css (nasa :root sa taas)
   - sizes: listahan ng [pangalan ng size, presyo]
   ---------------------------------------------------------- */
var items = [
  {
    name: "Pork Burrito",
    description: "Savory pork with rice mixed with carrots, string beans, sweet corn and fresh bean sprouts, all wrapped in a warm tortilla.",
    image: "--ip",
    sizes: [
      ["Regular", 89],
      ["Jumbo", 139]
    ]
  },
  {
    name: "Pastil Gimbap",
    description: "A Filipino-Korean twist made with chicken pastil, fresh cucumber, carrots, egg and tomato, all rolled in seasoned rice and seaweed.",
    image: "--iq",
    sizes: [
      ["Regular", 109]
    ]
  }
];


/* ----------------------------------------------------------
   2. CART (ang mga napili ng customer)
   ---------------------------------------------------------- */
var cart = {};      // halimbawa: { "Pork Burrito (Jumbo)": { qty: 2, price: 139 } }
var itemCount = 0;  // ilang item lahat
var total = 0;      // kabuuang presyo

var grid = document.getElementById("grid");
var countEl = document.getElementById("count");

function addToCart(name, price) {
  itemCount++;
  total += price;

  if (!cart[name]) {
    cart[name] = { qty: 0, price: price };
  }
  cart[name].qty++;

  // i-update ang bar sa ibaba ng page
  countEl.textContent = itemCount + " item" + (itemCount > 1 ? "s" : "") + " · ₱" + total;

  // maliit na "bump" animation
  countEl.classList.remove("bump");
  void countEl.offsetWidth;
  countEl.classList.add("bump");
}


/* ----------------------------------------------------------
   3. IPAKITA ANG MGA PRODUKTO SA PAGE
   ---------------------------------------------------------- */
items.forEach(function (item) {
  var selected = 0; // index ng napiling size (0 = una)

  var card = document.createElement("article");
  card.className = "item";
  card.innerHTML =
    '<div class="pic" style="background-image:var(' + item.image + ')" role="img" aria-label="' + item.name + '"></div>' +
    '<span class="tag"></span>' +
    '<div class="info">' +
      "<h3>" + item.name + "</h3>" +
      "<p>" + item.description + "</p>" +
      '<div class="sizes"></div>' +
      '<button class="add" aria-label="Add ' + item.name + '">Add</button>' +
    "</div>";

  var priceTag = card.querySelector(".tag");
  var sizeBox = card.querySelector(".sizes");

  // iguhit ang mga size button at i-update ang presyo
  function drawSizes() {
    priceTag.textContent = "₱" + item.sizes[selected][1];
    sizeBox.innerHTML = "";

    item.sizes.forEach(function (size, index) {
      var button = document.createElement("button");
      button.className = "sz" + (item.sizes.length < 2 ? " one" : "");
      button.textContent = size[0];
      button.setAttribute("aria-pressed", selected === index);

      // kung may higit sa isang size, pwedeng pumili
      if (item.sizes.length > 1) {
        button.onclick = function () {
          selected = index;
          drawSizes();
        };
      }
      sizeBox.appendChild(button);
    });
  }
  drawSizes();

  // Add button
  card.querySelector(".add").onclick = function () {
    var size = item.sizes[selected];
    addToCart(item.name + " (" + size[0] + ")", size[1]);
  };

  grid.appendChild(card);
});


/* ----------------------------------------------------------
   4. ORDER SUMMARY (ang pop-up na kokopyahin ng customer)
   ---------------------------------------------------------- */
var dialog = document.getElementById("dlg");

// gumawa ng text na ipapadala sa Facebook message
function orderText() {
  if (!itemCount) {
    return "Your order is empty. Add something from the menu first.";
  }

  var lines = ["Hi Snakko, I would like to order:"];
  for (var name in cart) {
    var line = cart[name];
    lines.push(line.qty + " x " + name + " (₱" + line.qty * line.price + ")");
  }
  lines.push("Total: ₱" + total);

  return lines.join("\n");
}

// "Review order" button
document.getElementById("order").onclick = function () {
  document.getElementById("sum").textContent = orderText();
  dialog.showModal();
};

// "Close" button
document.getElementById("close").onclick = function () {
  dialog.close();
};

// "Copy order" button
document.getElementById("copy").onclick = function () {
  var button = this;
  try {
    navigator.clipboard.writeText(orderText()).then(function () {
      button.textContent = "Copied!";
    });
  } catch (error) {
    button.textContent = "Select the text and copy";
  }
};