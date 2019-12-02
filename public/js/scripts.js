var sampleConnections = ["was", "went to", "involved", "met", "created",
  "wanted", "found", "told", "said", "also known as", "is known for",
  "is caused by", "leads to", "features"];

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
  var nodes = document.getElementsByClassName("article-node");
  // add inputs
  var currentNodeConnection = 0;
  var addNodeConnection = function() {
    // create editable text fields between nodes
    var nodeConnection = document.createElement("span");
    nodeConnection.contentEditable = true;
    nodeConnection.classList.add("node-connection");
     // enable placeholder
    nodeConnection.classList.add("placeholder-connection");
    nodeConnection.textContent = "\u200b"; // zero-width space for firefox bug
    // random placehodler
    var placeholderText = sampleConnections[
      Math.floor(Math.random() * sampleConnections.length)] + "…";
    nodeConnection.setAttribute("placeholder", placeholderText);
    nodeConnection.addEventListener("focusin", function() {
      var connections = document.getElementsByClassName("node-connection");
      for (var i = 0; i < connections.length; i++) {
        connections[i].classList.remove("placeholder-connection");
      }
    });
    articleChain.insertBefore(nodeConnection, nodes[currentNodeConnection].nextSibling);
    currentNodeConnection++;
    if (currentNodeConnection < nodes.length - 1) {
      // short delay between each
      setTimeout(addNodeConnection, 100);
    } else {
      // document.getElementsByClassName("narrative-input")[0].focus();
    }
  }
  // wait until article chain transformed
  setTimeout(addNodeConnection, 800);
  // insert period
  articleChain.append(document.createTextNode("."));

  // disable self
  this.disabled = true;
  compareNarrativesBtn.disabled = false;
}

// function selectAllOnFocus() {
  // this.select();
  // document.execCommand("selectAll", true, null);
// }

function compareNarratives() {
  var paragraphs = document.getElementById("paragraphs").getElementsByTagName("p");;
  // paragraphs.style.display = "block";
  var currentPara = 0;
  var paragraphsFadeIn = function() {
    paragraphs[currentPara].style.display = "block";
    currentPara++;
    if (currentPara < paragraphs.length) {
      setTimeout(paragraphsFadeIn, 100);
    }
  }
  paragraphsFadeIn();
  // hide buttons
  createNarrativeBtn.style.display = "none";
  this.style.display = "none";
}

window.onload = function() {

  var links = document.getElementsByClassName("article-link");
  // staggered transitions code from
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
      // createNarrativeBtn.style.visibility = "visible";
      createNarrativeBtn.style.display = "block";
      createNarrativeBtn.disabled = false;
      compareNarrativesBtn.style.display = "block";
      compareNarrativesBtn.disabled = true;
    }
  }

};