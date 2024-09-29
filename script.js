// variables section
let page = 1;
let maxPage;
const [main] = document.getElementsByTagName("main");
const radio = document.getElementsByClassName("liveType");
const nextPage = document.getElementById("nextPage");
const previousPage = document.getElementById("previousPage");
const search = document.getElementById("filter");

// code section
nextPage.addEventListener("click", () => {
  page += 1;
  if (page > maxPage) {
    page = maxPage;
    return;
  }
  getCharacters(checked(), page, search.value);
});

previousPage.addEventListener("click", () => {
  page -= 1;
  if (page < 1) {
    page = 1;
    return;
  }
  getCharacters(checked(), page, search.value);
});

search.addEventListener("input", () => {
  page = 1;
  getCharacters(checked(), page, search.value);
});

for (let element of radio) {
  element.addEventListener("click", () => {
    page = 1;
    getCharacters(checked(), page, search.value);
  });
}

getCharacters(checked(), page, search.value);

// function section
function buildElement(typeElement, idElement, classElement, textElement, srcElement) {
  const element = document.createElement(typeElement);
  if (idElement) {
    element.id = idElement;
  }
  if (classElement) {
    element.className = classElement;
  }
  if (textElement) {
    element.textContent = textElement;
  }
  if (srcElement) {
    element.src = srcElement;
  }
  return element;
}

function createCharacter(name, status, species, image) {
  const characterBlock = buildElement("div", undefined, "character");
  const characterImage = buildElement("img", undefined, undefined, undefined, image);
  const characterName = buildElement("span", undefined, "name", name);
  const characterStats = buildElement("div", undefined, "stats");
  function makeStat(statName, statValue) {
    const stat = buildElement("div", undefined, "stat");
    const spanName = buildElement("span", undefined, undefined, statName);
    const spanValue = buildElement("span", undefined, undefined, statValue);
    stat.append(spanName, spanValue);
    return stat;
  }
  const characterStatus = makeStat("Status: ", status);
  const characterSpecies = makeStat("Gatunek: ", species);
  characterStats.append(characterStatus, characterSpecies);
  characterBlock.append(characterImage, characterName, characterStats);
  return characterBlock;
}

function checked() {
  const selectedOption = document.querySelector('input[name="liveType"]:checked').value;
  return selectedOption;
}

async function getCharacters(status, page, filter) {
  main.textContent = "";
  let URL = `https://rickandmortyapi.com/api/character?status=${status}&page=${page}`;
  if (filter) {
    URL = `${URL}&name=${filter}`;
  }
  try {
    const respons = await fetch(URL);
    const data = await respons.json();
    const info = data.info;
    maxPage = info.pages;
    const characters = data.results;
    for (let character of characters) {
      main.append(createCharacter(character.name, character.status, character.species, character.image));
    }
  } catch (err) {
    if (main.children.length === 0) {
      main.innerHTML = "Nie znaleziono postaci spełniających kryteria wyszukiwania.";
    }
  }
}
