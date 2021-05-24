var deletedItems = new Map();
$(document).ready(async () => {
  $("#result").hide();
  var languages = await fetchLanguages();
  populateOptions(languages);
});
const fetchLanguages = async () => {
  var res = await fetch("/js/lang.json");
  var data = await res.json();
  return data;
};
const populateOptions = (data) => {
  var arr = $.map(
    data,
    (val, key) =>
      `<div class="option" id=${val.id} onclick="selectedItems(this)">${val.name}</div>`
  );
  $(".options").append(arr.join(" "));
};
const selectedItems = (ele) => {
  var x = $("#selectedItem");
  var clone = x.clone();
  clone.toggleClass("hide");
  clone.children(":nth-child(1)").text(ele.innerText);
  clone.prependTo($("#dropdown"));
  deletedItems.set(ele.innerText, ele);
  ele.classList.add("hide");
};

const removeItem = (ele) => {
  var lang = ele.parentElement.childNodes;
  var del = deletedItems.get(lang[0].innerText);
  del.classList.remove("hide");
  deletedItems.delete(lang[0].innerText);
  ele.parentElement.remove();
};

const matchSearch = async (query) => {
  var languages = await fetchLanguages();
  var matches = languages.filter((language) => {
    var regex = new RegExp(`^${query}`, "gi");
    return language.name.match(regex) && !deletedItems.has(language.name);
  });
  if (matches.length === 0) {
    $("#result").show();
    $(".options").hide();
  } else {
    $("#result").hide();
    $(".options").show();
  }
  if (query.length === 0 && deletedItems.size === 0) {
    var options = document.getElementsByClassName("option");
    console.log(options);
    for (const e of options) {
      e.classList.remove("hide");
    }
  } else if (query.length === 0 || deletedItems.size !== 0) {
    var options = document.getElementsByClassName("option");
    for (const e of options) {
      if (!deletedItems.has(e.innerText)) e.classList.remove("hide");
    }
  } else if (query.length !== 0 && matches.length > 0) {
    console.log(matches);
    var options = document.getElementsByClassName("option");
    for (const e of options) {
      var match = matches.find((m) => m.id === e.id && m.name === e.innerText);
      if (!match) {
        e.classList.add("hide");
      } else {
        e.classList.remove("hide");
      }
    }
  }
};

$("input[name=search]").on("input", (e) => {
  matchSearch(e.target.value);
});
