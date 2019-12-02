var sampleConnections = ["was", "went to", "involved", "met", "created",
  "wanted", "found", "told", "said", "also known as", "is known for",
  "is caused by", "leads to", "features", "is a type of"];

var createNarrativeBtn;
var compareNarrativesBtn;

function createNarrative() {
  // hide chain counter
  document.getElementById("chain-counter").style.display = "none";
  document.getElementById("narrative-instruct").style.display = "block";
  // transform article chain
  var articleChain = document.getElementById("article-chain");
  articleChain.classList.remove("constructing");
  articleChain.classList.add("narrativising");
  // insert period
  articleChain.append(document.createTextNode("."));
  var nodes = document.getElementsByClassName("article-node");
  var currentNodeConnection = 0;
    // create editable text fields between nodes
  var addNodeConnection = function() {
    var nodeConnection = document.createElement("span");
    nodeConnection.contentEditable = true;
    nodeConnection.classList.add("node-connection");
     // enable placeholder
    nodeConnection.classList.add("placeholder-connection");
    nodeConnection.textContent = "\u200b"; // zero-width space for firefox bug
    //  get random placehodler text
    var placeholderText = sampleConnections[
      Math.floor(Math.random() * sampleConnections.length)] + "…";
    nodeConnection.setAttribute("placeholder", placeholderText);
    nodeConnection.addEventListener("focusin", function() {
      if (this.textContent != "\u200b") {
        if (this.textContent == "") {
          this.textContent = "\u200b";
        } else {
          // if there is text, select all
          // https://stackoverflow.com/a/6150060
          var range = document.createRange();
          range.selectNodeContents(this);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
      // remove all placeholder texts
      var connections = document.getElementsByClassName("node-connection");
      for (var i = 0; i < connections.length; i++) {
        connections[i].classList.remove("placeholder-connection");
      }
    });
    // add node connection to page
    articleChain.insertBefore(nodeConnection,
      nodes[currentNodeConnection].nextSibling);
    currentNodeConnection++;
    // short delay between each node connection
    if (currentNodeConnection < nodes.length - 1) {
      setTimeout(addNodeConnection, 100);
    }
  }
  // wait until article chain transformed
  setTimeout(addNodeConnection, 800);

  // disable create narratives button
  this.disabled = true;
  // enable cmompare narratives button
  compareNarrativesBtn.disabled = false;
}

function compareNarratives() {
  // var els = document.querySelectorAll("#paragraphs p");
  var els = document.querySelectorAll("#paragraphs > *");
  var currentEl = 0;
  var elsFadeIn = function() {
    els[currentEl].style.display = "block";
    currentEl++;
    if (currentEl < els.length) {
      setTimeout(elsFadeIn, 100);
    }
  }
  elsFadeIn();
  // hide buttons
  document.getElementById("narratives-form").style.display = "none";
}

window.onload = function() {

  var links = document.getElementsByClassName("article-link");
  // staggered transitions
  // https://stackoverflow.com/a/19072639
  if (links.length > 0) {
    var currentLink = 0;
    var linksFadeIn = function() {
      links[currentLink].style.opacity = 1;
      currentLink++;
      if (currentLink < links.length) {
        setTimeout(linksFadeIn, 1);
      }
    }
    linksFadeIn();
  }

  // create "create a narrative" button
  createNarrativeBtn = document.getElementById("create-narrative");
  if (createNarrativeBtn) {
    createNarrativeBtn.addEventListener("click", createNarrative);
  }

  // create "compare narratives" button
  compareNarrativesBtn = document.getElementById("compare-narratives");
  if (compareNarrativesBtn) {
    compareNarrativesBtn.addEventListener("click", compareNarratives);
  }

  // display "create narratives" button
  var chainCount = document.getElementById("chain-count");
  if (chainCount) {
    if (parseInt(chainCount.textContent) == 6) {
      createNarrativeBtn.style.display = "block";
      createNarrativeBtn.disabled = false;
      compareNarrativesBtn.style.display = "block";
      compareNarrativesBtn.disabled = true;
    }
  }

};