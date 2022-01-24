function onClick() {
  document
    .getElementById("purchase")
    .getElementsByTagName("ul")
    .item(0).onclick = function (e) {
      let el = e.target;
      while (el != document.body && el.tagName.toLowerCase() != "li") {
        el = el.parentNode;
      }
      let index = [].indexOf.call(el.parentNode.children, el);
      for (
        let i = 0; i < document.getElementById("purchase").getElementsByClassName("nav-item").length;
        ++i
      ) {
        document
          .getElementById("purchase")
          .getElementsByClassName("nav-item")
          .item(i).style.borderBottom = "none";
      }

      document
        .getElementById("purchase")
        .getElementsByClassName("nav-item")
        .item(index).style.borderBottom = "2px solid black";
    };
}