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

  var chainCount = document.getElementById("chain-count");
  if (chainCount) {
    if (parseInt(chainCount.textContent) == 10) {
      // create "create a narrative" button
      var createNarrativeBtn = document.createElement("button");
      createNarrativeBtn.id = "createNarrative";
      createNarrativeBtn.append(document.createTextNode("Create a narrative"));
      document.body.append(createNarrativeBtn);
      createNarrativeBtn.addEventListener("click", function() {
        console.log("click");
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
          articleChain.insertBefore(inputSpan, nodes[i].nextSibling);
        }
        // insert period
        articleChain.append(document.createTextNode("."));

        // create "compare narratives" button
        var compareNarrativesBtn = document.createElement("button");
        compareNarrativesBtn.id = "compareNarratives";
        compareNarrativesBtn.append(document.createTextNode("Compare narratives"));
        document.body.append(compareNarrativesBtn);

        // remove self
        this.parentNode.removeChild(this);
      });
    }
  }
};