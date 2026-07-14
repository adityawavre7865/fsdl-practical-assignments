// JourneyHub — client-side JavaScript
// Uses fetch() to talk to the Express + MongoDB backend

let allPackages = [];  // store fetched packages
let selectedPkg = null; // package chosen for booking

// ── Page navigation ───────────────────────────────────
function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.style.display = "none");
  const page = document.getElementById("page-" + name);
  if (page) {
    page.style.display = "block";
    window.scrollTo(0, 0);
  }
  if (name === "home") loadHomePackages();
  if (name === "packages") loadPackages();
  if (name === "booking") loadPkgDropdown();
  if (name === "contact") loadEnquiries();

  // close mobile menu
  document.getElementById("navLinks").classList.remove("open");
}

function toggleNav() {
  document.getElementById("navLinks").classList.toggle("open");
}

// ── Navbar scroll effect ──────────────────────────────
window.addEventListener("scroll", function () {
  var nav = document.getElementById("navbar");
  if (window.scrollY > 50) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
});

// ── Toast notification ────────────────────────────────
function showToast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.style.display = "block";
  setTimeout(function () { t.style.display = "none"; }, 3500);
}

// ── Format INR ────────────────────────────────────────
function inr(n) {
  return "Rs." + Number(n).toLocaleString("en-IN");
}

// ── Build a package card ──────────────────────────────
function buildCard(p) {
  var discount = (p.originalPrice > p.price)
    ? Math.round((1 - p.price / p.originalPrice) * 100) + "% OFF"
    : "";

  return "<div class='pkg-card reveal'>" +
    "<img src='" + p.image + "' alt='" + p.name + "' onerror=\"this.src='https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600'\">" +
    "<div class='pkg-body'>" +
    "<div class='pkg-loc'>" + p.destination + "</div>" +
    "<div class='pkg-name'>" + p.name + "</div>" +
    "<div class='pkg-desc'>" + p.description.slice(0, 100) + "...</div>" +
    "<div class='pkg-meta'>" +
    "<span>&#128337; " + p.duration + "</span>" +
    "<span>" + p.category + "</span>" +
    (discount ? "<span style='color:#dc2626;font-weight:600'>" + discount + "</span>" : "") +
    "</div>" +
    "<div class='pkg-footer'>" +
    "<div class='pkg-rating'><span class='star'>&#9733;</span> " + p.rating + " (" + p.reviews + ")</div>" +
    "<div>" +
    (p.originalPrice > p.price ? "<span class='p-was'>" + inr(p.originalPrice) + "</span>" : "") +
    "<span class='p-now'>" + inr(p.price) + "</span>" +
    "<span class='p-per'> /person</span>" +
    "</div>" +
    "</div>" +
    "<div class='pkg-actions'>" +
    "<button class='btn btn-outline btn-sm' onclick='showDetail(\"" + p._id + "\")'>Details</button>" +
    "<button class='btn btn-primary btn-sm' onclick='bookThis(\"" + p._id + "\")'>Book Now</button>" +
    "</div>" +
    "</div>" +
    "</div>";
}

// ── Load packages on home page ────────────────────────
async function loadHomePackages() {
  var grid = document.getElementById("homeGrid");
  if (!grid) return;
  grid.innerHTML = "<p class='muted'>Loading...</p>";
  try {
    var res = await fetch("/api/packages");
    var data = await res.json();
    allPackages = data;
    grid.innerHTML = data.length ? data.map(buildCard).join("") : "<p class='muted'>No packages found.</p>";
  } catch (e) {
    grid.innerHTML = "<p class='muted'>Could not load packages. Make sure MongoDB is running.</p>";
  }
}

// ── Load packages on packages page ───────────────────
async function loadPackages() {
  var grid = document.getElementById("pkgGrid");
  var search = document.getElementById("pkgSearch")?.value || "";
  var cat = document.getElementById("pkgCat")?.value || "";
  if (!grid) return;

  grid.innerHTML = "<p class='muted'>Loading...</p>";
  var url = "/api/packages?";
  if (search) url += "search=" + encodeURIComponent(search) + "&";
  if (cat) url += "category=" + encodeURIComponent(cat) + "&";

  try {
    var res = await fetch(url);
    var data = await res.json();
    allPackages = data;

    var count = document.getElementById("pkgCount");
    if (count) count.textContent = "Showing " + data.length + " package" + (data.length !== 1 ? "s" : "");

    grid.innerHTML = data.length ? data.map(buildCard).join("") : "<p class='muted'>No packages match your search.</p>";
  } catch (e) {
    grid.innerHTML = "<p class='muted'>Error loading packages.</p>";
  }
}

function resetFilters() {
  document.getElementById("pkgSearch").value = "";
  document.getElementById("pkgCat").value = "";
  loadPackages();
}

// ── Show package detail page ──────────────────────────
async function showDetail(id) {
  showPage("detail");
  var dc = document.getElementById("detailContent");
  dc.innerHTML = "<div class='wrap' style='padding:80px 24px'><p class='muted'>Loading...</p></div>";

  try {
    var res = await fetch("/api/packages/" + id);
    var p = await res.json();
    if (p.error) { dc.innerHTML = "<p class='muted' style='padding:40px 24px'>Package not found.</p>"; return; }

    var hlHtml = (p.highlights || []).map(function (h) { return "<div class='hl-item'><span class='hl-dot'></span>" + h + "</div>"; }).join("");
    var incHtml = (p.includes || []).map(function (i) { return "<div class='inc-item'><span class='inc-check'>&#10003;</span>" + i + "</div>"; }).join("");
    var discount = p.originalPrice > p.price ? (Math.round((1 - p.price / p.originalPrice) * 100) + "% OFF") : "";

    dc.innerHTML =
      "<div class='page-banner'>" +
      "<p style='font-size:13px;color:rgba(255,255,255,.7);margin-bottom:8px'>" +
      "<a onclick=\"showPage('home')\" style='color:rgba(255,255,255,.7);cursor:pointer'>Home</a> / " +
      "<a onclick=\"showPage('packages')\" style='color:rgba(255,255,255,.7);cursor:pointer'>Packages</a> / " + p.name +
      "</p>" +
      "<h1>" + p.name + "</h1>" +
      "<p>" + p.destination + " &nbsp;|&nbsp; " + p.duration + " &nbsp;|&nbsp; &#9733; " + p.rating + " (" + p.reviews + " reviews)</p>" +
      "</div>" +
      "<section class='section'><div class='wrap'>" +
      "<div class='detail-layout'>" +
      "<div class='detail-main'>" +
      "<div class='detail-sec'><h2>About This Trip</h2><p>" + p.description + "</p></div>" +
      (hlHtml ? "<div class='detail-sec'><h2>Highlights</h2><div class='hl-list'>" + hlHtml + "</div></div>" : "") +
      (incHtml ? "<div class='detail-sec'><h2>What's Included</h2><div class='inc-list'>" + incHtml + "</div></div>" : "") +
      "</div>" +
      "<div>" +
      "<div class='card book-card'>" +
      "<div class='book-price'>" +
      (p.originalPrice > p.price ? "<span class='b-was'>" + inr(p.originalPrice) + "</span>" : "") +
      "<div><span class='b-now'>" + inr(p.price) + "</span><span class='b-per'> / person</span></div>" +
      (discount ? "<span class='b-save'>" + discount + "</span>" : "") +
      "</div>" +
      "<div class='book-facts'>" +
      "<p>&#128337; " + p.duration + "</p>" +
      "<p>&#127962; " + p.difficulty + "</p>" +
      "<p>&#9733; " + p.rating + " (" + p.reviews + " reviews)</p>" +
      "</div>" +
      "<button class='btn btn-primary btn-block' onclick='bookThis(\"" + p._id + "\")'>Book This Trip</button>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div></section>";
  } catch (e) {
    dc.innerHTML = "<p class='muted' style='padding:40px 24px'>Error loading package details.</p>";
  }
}

// ── Book a specific package ───────────────────────────
function bookThis(id) {
  selectedPkg = allPackages.find(function (p) { return String(p._id) === String(id); }) || null;
  showPage("booking");
  setTimeout(function () {
    var sel = document.getElementById("bPkg");
    if (sel && selectedPkg) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].dataset.id === String(id)) {
          sel.value = sel.options[i].value;
          break;
        }
      }
      onPkgSelect();
    }
  }, 150);
}

// ── Load package dropdown on booking form ─────────────
async function loadPkgDropdown() {
  try {
    var res = await fetch("/api/packages");
    var data = await res.json();
    allPackages = data;

    var sel = document.getElementById("bPkg");
    sel.innerHTML = "<option value=''>-- Choose a package --</option>";
    data.forEach(function (p) {
      var opt = document.createElement("option");
      opt.value = p.name;
      opt.dataset.id = p._id;
      opt.dataset.price = p.price;
      opt.textContent = p.name + " — " + inr(p.price) + "/person";
      sel.appendChild(opt);
    });

    // pre-select if coming from bookThis()
    if (selectedPkg) {
      for (var i = 0; i < sel.options.length; i++) {
        if (sel.options[i].dataset.id === String(selectedPkg._id)) {
          sel.value = sel.options[i].value;
          break;
        }
      }
      onPkgSelect();
    }
  } catch (e) {
    console.error("Could not load packages:", e);
  }
}

// ── Handle package selection → update price ───────────
function onPkgSelect() {
  var sel = document.getElementById("bPkg");
  var opt = sel.options[sel.selectedIndex];
  if (opt && opt.dataset.id) {
    selectedPkg = allPackages.find(function (p) { return String(p._id) === opt.dataset.id; }) || null;
  }
  calcPrice();
}

// ── Price calculator ──────────────────────────────────
function calcPrice() {
  var sel = document.getElementById("bPkg");
  var opt = sel ? sel.options[sel.selectedIndex] : null;
  var price = opt && opt.dataset.price ? parseInt(opt.dataset.price) : 0;

  if (!price) {
    document.getElementById("priceBox").style.display = "none";
    return 0;
  }

  var adults = parseInt(document.getElementById("bAdults").value) || 1;
  var children = parseInt(document.getElementById("bChildren").value) || 0;
  var childP = Math.round(price * 0.5);
  var subtotal = adults * price + children * childP;
  var gst = Math.round(subtotal * 0.05);
  var total = subtotal + gst;

  document.getElementById("ps-a").textContent = adults;
  document.getElementById("ps-pp").textContent = inr(price);
  document.getElementById("ps-at").textContent = inr(adults * price);
  document.getElementById("ps-c").textContent = children;
  document.getElementById("ps-cp").textContent = inr(childP);
  document.getElementById("ps-ct").textContent = inr(children * childP);
  document.getElementById("ps-gst").textContent = inr(gst);
  document.getElementById("ps-tot").innerHTML = "<strong>" + inr(total) + "</strong>";
  document.getElementById("ps-crow").style.display = children > 0 ? "flex" : "none";
  document.getElementById("priceBox").style.display = "block";
  return total;
}

// ── Field validator helper ────────────────────────────
function setField(id, valid, msg) {
  var el = document.getElementById(id);
  var err = document.getElementById("err-" + id);
  if (!el) return;
  el.classList.remove("f-ok", "f-err");
  el.classList.add(valid ? "f-ok" : "f-err");
  if (err) err.textContent = valid ? "" : msg;
}

// ── Submit booking form ───────────────────────────────
async function submitBooking() {
  var errors = [];

  var sel = document.getElementById("bPkg");
  var opt = sel ? sel.options[sel.selectedIndex] : null;
  if (!opt || !opt.dataset.id) {
    errors.push("Please select a package");
    setField("pkg", false, "Please select a package");
  } else {
    setField("pkg", true, "");
  }

  var fn = document.getElementById("bFirst").value.trim();
  if (fn.length < 2) { errors.push("First Name required (min 2 chars)"); setField("first", false, "Min 2 characters"); }
  else setField("first", true, "");

  var ln = document.getElementById("bLast").value.trim();
  if (!ln) { errors.push("Last Name is required"); setField("last", false, "Required"); }
  else setField("last", true, "");

  var email = document.getElementById("bEmail").value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Enter a valid email address");
    setField("email", false, "Invalid email");
  } else setField("email", true, "");

  var phone = document.getElementById("bPhone").value.trim();
  if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.push("Enter a valid 10-digit Indian mobile number");
    setField("phone", false, "Must be 10 digits starting with 6, 7, 8 or 9");
  } else setField("phone", true, "");

  var city = document.getElementById("bCity").value;
  if (!city) { errors.push("Please select your city"); setField("city", false, "Required"); }
  else setField("city", true, "");

  var date = document.getElementById("bDate").value;
  var today = new Date().toISOString().split("T")[0];
  if (!date || date < today) {
    errors.push("Select a valid future travel date");
    setField("date", false, "Must be today or later");
  } else setField("date", true, "");

  var terms = document.getElementById("bTerms").checked;
  var termsErr = document.getElementById("err-terms");
  if (!terms) {
    errors.push("Please accept the Terms & Conditions");
    if (termsErr) termsErr.textContent = "Required";
  } else {
    if (termsErr) termsErr.textContent = "";
  }

  var alertBox = document.getElementById("bookAlert");
  var alertList = document.getElementById("bookAlertList");
  var successEl = document.getElementById("bookSuccess");

  if (errors.length > 0) {
    alertList.innerHTML = errors.map(function (e) { return "<li>" + e + "</li>"; }).join("");
    alertBox.style.display = "flex";
    successEl.style.display = "none";
    alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  alertBox.style.display = "none";

  var total = calcPrice();
  var body = {
    packageId: opt.dataset.id,
    packageName: opt.value,
    firstName: fn,
    lastName: ln,
    email: email,
    phone: phone,
    city: city,
    travelDate: date,
    adults: document.getElementById("bAdults").value,
    children: document.getElementById("bChildren").value,
    specialRequests: document.getElementById("bRequests").value,
    totalPrice: total
  };

  try {
    var res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    var data = await res.json();

    if (data.ok) {
      successEl.style.display = "flex";
      document.getElementById("bookSuccessMsg").innerHTML =
        "Your booking reference is <strong>" + data.ref + "</strong>. " +
        "<a onclick=\"prefillLookup('" + data.ref + "')\" style='color:var(--green);cursor:pointer;text-decoration:underline'>Track your booking &rarr;</a>";
      successEl.scrollIntoView({ behavior: "smooth", block: "center" });
      document.getElementById("bPkg").value = "";
      document.getElementById("bFirst").value = "";
      document.getElementById("bLast").value = "";
      document.getElementById("bEmail").value = "";
      document.getElementById("bPhone").value = "";
      document.getElementById("bCity").value = "";
      document.getElementById("bDate").value = "";
      document.getElementById("bRequests").value = "";
      document.getElementById("bTerms").checked = false;
      document.getElementById("priceBox").style.display = "none";
      selectedPkg = null;
    } else {
      showToast(data.error || "Booking failed. Please try again.");
    }
  } catch (e) {
    showToast("Server error. Please try again.");
  }
}

function prefillLookup(ref) {
  showPage("lookup");
  setTimeout(function () {
    document.getElementById("lookupRef").value = ref;
    lookupBooking();
  }, 200);
}

// ── Lookup booking ────────────────────────────────────
async function lookupBooking() {
  var ref = document.getElementById("lookupRef").value.trim().toUpperCase();
  var result = document.getElementById("lookupResult");
  if (!ref) { showToast("Please enter a booking reference"); return; }

  result.innerHTML = "<p class='muted'>Searching...</p>";
  try {
    var res = await fetch("/api/bookings/lookup?ref=" + encodeURIComponent(ref));
    var data = await res.json();

    if (data.error) {
      result.innerHTML =
        "<div class='card' style='padding:24px;text-align:center'>" +
        "<p style='font-size:32px;margin-bottom:12px'>&#128269;</p>" +
        "<h3 style='margin-bottom:8px'>Not Found</h3>" +
        "<p class='muted'>No booking found for <strong>" + ref + "</strong>. Please check and try again.</p>" +
        "</div>";
    } else {
      var d = new Date(data.travelDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
      result.innerHTML =
        "<div class='card' style='padding:24px'>" +
        "<p style='color:var(--green);font-weight:700;font-size:15px;margin-bottom:16px'>&#10003; Booking Found</p>" +
        "<table class='lookup-table'>" +
        "<tr><td>Reference</td><td><strong>" + data.ref + "</strong></td></tr>" +
        "<tr><td>Name</td><td>" + data.firstName + " " + data.lastName + "</td></tr>" +
        "<tr><td>Package</td><td>" + data.packageName + "</td></tr>" +
        "<tr><td>Travel Date</td><td>" + d + "</td></tr>" +
        "<tr><td>Travellers</td><td>" + data.travelers.adults + " Adult(s), " + data.travelers.children + " Child(ren)</td></tr>" +
        "<tr><td>Total</td><td><strong>" + inr(data.totalPrice) + "</strong></td></tr>" +
        "<tr><td>Status</td><td><span class='status-tag status-" + (data.status || "pending").toLowerCase() + "'>" + (data.status || "Pending") + "</span></td></tr>" +
        "</table>" +
        "</div>";
    }
  } catch (e) {
    result.innerHTML = "<p class='muted'>Error. Please try again.</p>";
  }
}

// ── Submit contact enquiry ────────────────────────────
async function submitEnquiry() {
  var errors = [];
  var name = document.getElementById("cName").value.trim();
  var email = document.getElementById("cEmail").value.trim();
  var msg = document.getElementById("cMsg").value.trim();

  if (name.length < 2) { errors.push("Name is required"); setField("cname", false, "Required"); }
  else setField("cname", true, "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.push("Valid email required"); setField("cemail", false, "Invalid email"); }
  else setField("cemail", true, "");

  if (msg.length < 10) { errors.push("Message too short (min 10 characters)"); setField("cmsg", false, "Min 10 characters"); }
  else setField("cmsg", true, "");

  var alertEl = document.getElementById("contactAlert");
  var alertList = document.getElementById("contactAlertList");
  var successEl = document.getElementById("contactSuccess");

  if (errors.length > 0) {
    alertList.innerHTML = errors.map(function (e) { return "<li>" + e + "</li>"; }).join("");
    alertEl.style.display = "flex";
    successEl.style.display = "none";
    alertEl.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  try {
    var res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, email: email, message: msg })
    });
    var data = await res.json();

    if (data.ok) {
      alertEl.style.display = "none";
      successEl.style.display = "flex";
      document.getElementById("cName").value = "";
      document.getElementById("cEmail").value = "";
      document.getElementById("cMsg").value = "";
      loadEnquiries();
    } else {
      showToast(data.error || "Error sending message.");
    }
  } catch (e) {
    showToast("Server error. Please try again.");
  }
}

// ── Load recent enquiries ─────────────────────────────
async function loadEnquiries() {
  var list = document.getElementById("enquiryList");
  if (!list) return;
  try {
    var res = await fetch("/api/enquiries");
    var data = await res.json();
    list.innerHTML = data.length
      ? data.map(function (e) {
        return "<li><strong>" + e.name + "</strong> &mdash; " + e.message.slice(0, 80) + (e.message.length > 80 ? "..." : "") + "</li>";
      }).join("")
      : "<li class='muted'>No enquiries yet.</li>";
  } catch (e) {
    list.innerHTML = "<li class='muted'>Could not load enquiries.</li>";
  }
}

// ── On page load ──────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  showPage("home")
  // Hero slideshow
  var slides = document.querySelectorAll(".slide");
  var current = 0;
  setInterval(function () {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 4000);;

  // Only allow digits in phone field
  var phoneInput = document.getElementById("bPhone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "").slice(0, 10);
    });
  }

  // Uppercase ref input
  var refInput = document.getElementById("lookupRef");
  if (refInput) {
    refInput.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
    });
  }

  // Set today as min date for travel date
  var dateInput = document.getElementById("bDate");
  if (dateInput) {
    dateInput.min = new Date().toISOString().split("T")[0];
  }
});

// ── Scroll reveal ─────────────────────────────────────
function initReveal() {
  var els = document.querySelectorAll(".reveal");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
}

// Re-run reveal whenever a page is shown
var _origShowPage = showPage;
showPage = function (name) {
  _origShowPage(name);
  setTimeout(initReveal, 80);
};

// Also run on first load
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(initReveal, 200);
});
