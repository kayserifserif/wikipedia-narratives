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
  var currentInputSpan = 0;
  var addInputSpan = function() {
    // create editable text fields between nodes
    var inputSpan = document.createElement("span");
    inputSpan.classList.add("narrative-input");
    inputSpan.contentEditable = true;
    // insert zero-width space for firefox bug
    inputSpan.append(document.createTextNode("\u200b"));
    inputSpan.onfocus = selectAllOnFocus;
    articleChain.insertBefore(inputSpan, nodes[currentInputSpan].nextSibling);
    currentInputSpan++;
    if (currentInputSpan < nodes.length - 1) {
      // short delay between each
      setTimeout(addInputSpan, 100);
    } else {
      document.getElementsByClassName("narrative-input")[0].focus();
    }
  }
  // wait until article chain transformed
  setTimeout(addInputSpan, 800);
  // insert period
  articleChain.append(document.createTextNode("."));

  // disable self
  this.disabled = true;
  compareNarrativesBtn.disabled = false;
}

function selectAllOnFocus() {
  // this.select();
  // document.execCommand("selectAll", true, null);
}

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