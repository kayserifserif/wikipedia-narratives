var createNarrativeBtn;
var compareNarrativesBtn;

function createNarrative() {
  // hide chain counter
  document.getElementById("chain-counter").style.display = "none";
  // transform article chain
  var articleChain = document.getElementById("article-chain");
  articleChain.classList.remove("constructing");
  articleChain.classList.add("narrativising");
  var nodes = document.getElementsByClassName("article-node");
  for (var i = 0; i < nodes.length - 1; i++) {
    // create editable text fields between nodes
    var inputSpan = document.createElement("span");
    inputSpan.classList.add("narrativeInput");
    inputSpan.contentEditable = true;
    inputSpan.onfocus = selectAllOnFocus;
    articleChain.insertBefore(inputSpan, nodes[i].nextSibling);
  }
  document.getElementsByClassName("narrativeInput")[0].focus();
  // insert period
  articleChain.append(document.createTextNode("."));

  // remove self
  // this.parentNode.removeChild(this);
  this.style.display = "none";
    compareNarrativesBtn.style.display = "block";
}

function selectAllOnFocus() {
  // this.select();
  // document.execCommand("selectAll", true, null);
}

function compareNarratives() {
  var paragraphs = document.getElementById("paragraphs");
  paragraphs.style.display = "block";
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
    if (parseInt(chainCount.textContent) == 10) {
      createNarrativeBtn.style.display = "block";
    }
  }

};