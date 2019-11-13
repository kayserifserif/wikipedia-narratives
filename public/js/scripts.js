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

  // make "create a narrative" button appear
  var createNarrativeBtn = document.getElementById("createNarrative");
  createNarrativeBtn.addEventListener("click", function() {
    // hide chain counter and path form
    document.getElementById("chain-counter").style.display = "none";
    document.getElementById("pathForm").style.display = "none";
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
      articleChain.insertBefore(inputSpan, nodes[i].nextSibling);
    }
    // insert period
    articleChain.insertBefore(document.createTextNode("."), nodes[nodes.length - 1].nextSibling);
  });
};