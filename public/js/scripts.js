window.onload = function() {
  var links = document.getElementsByClassName('article-link');
  // staggered transitions code from
  // https://stackoverflow.com/a/19072639
  var currentLink = 0;
  var linksFadeIn = function() {
    links[currentLink].style.opacity = 1;
    currentLink++;
    if (currentLink < links.length) {
      setTimeout(linksFadeIn, 1);
    }
  }
  linksFadeIn();
};