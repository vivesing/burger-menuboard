import {
  sampleRUM,
  buildBlock,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    let heroBlock = buildBlock('hero', { elems: [picture] });
    if (h1) {
      let textBackgroundImgElement = document.createElement('img');
      textBackgroundImgElement.src = '../images/yellow-background.png';
      let textBackgroundImgWrapper = document.createElement('div');
      textBackgroundImgWrapper.className = 'hero-text-background';
      textBackgroundImgWrapper.appendChild(textBackgroundImgElement);
      textBackgroundImgWrapper.appendChild(h1);
      heroBlock.appendChild(textBackgroundImgWrapper);
    }
    section.append(heroBlock);
    main.prepend(section);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  editMenu(main);
}

const editMenu = (main) => {
  let menuItems = main.querySelector('.main-menu');
  [...menuItems.children].forEach((childDiv) => {
    if (childDiv && childDiv.children && childDiv.children.length === 2) {
      childDiv.children[1].style['text-align'] = 'center';
    }
  })
  let notices = main.querySelector('.notices');
  let menuNoticeContainer = document.createElement('div');
  menuNoticeContainer.classList.add('menu-notice-container');
  menuNoticeContainer.appendChild(menuItems);
  menuNoticeContainer.appendChild(notices);
  let promotions = main.querySelector('.promotions');
  [...promotions.children].forEach((childDiv) => {
    childDiv.classList.add('promotion-container');
    childDiv.children[0].classList.add('promotion-image');
    childDiv.children[1].style.display = 'none';
    childDiv.children[2].style.display = 'none';
    let promotionPriceElement = document.createElement('div');
    promotionPriceElement.classList.add('promotion-price');
    let inner = document.createElement('div');
    inner.classList.add('inner');
    if (childDiv.children[2]) {
      inner.innerHTML = `<p>${childDiv.children[2].innerText}</p>`;
    }
    promotionPriceElement.appendChild(inner);
    childDiv.insertBefore(promotionPriceElement, childDiv.children[0]);
  })
  let offers = main.querySelector('.offers');
  [...offers.children].forEach((childDiv) => {
    childDiv.children[1].style.display = 'none';
  })
  promotions.appendChild(offers);
  let container = document.createElement('div');
  container.classList.add('menu-container');
  let leftMargin = document.createElement('div');
  leftMargin.classList.add('menu-left-margin');
  container.appendChild(leftMargin);
  container.appendChild(menuNoticeContainer);
  container.appendChild(promotions);
  main.appendChild(container);
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  let main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

function personalizedContent(apiResponse, doc) {
  let dataArray = apiResponse.data;

  if (dataArray && dataArray.length > 0) {
    for (let index = 0; index < dataArray.length; index++) {
      var currentRowId = parseInt(dataArray[index].ID, 10);
      var menuSection = dataArray[index].Section;
      var isOutOfStock = dataArray[index]['isOutOfStock'];
      var totalElementsOnMenu = doc.getElementsByClassName("columns " + menuSection)[0].childElementCount;

      if (currentRowId < totalElementsOnMenu) {
        // Mutate the existing menu item
        doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[0].textContent = dataArray[index].Item;
        doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[1].textContent = dataArray[index].Tall;
        doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[2].textContent = dataArray[index].Grande;
        doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[3].textContent = dataArray[index].Venti;

        if (outOfStock === 'Yes') {
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[0].style.textDecoration = "line-through";
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[0].style.color = 'red';
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[1].style.textDecoration = "line-through";
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[1].style.color = 'red';
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[2].style.textDecoration = "line-through";
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[2].style.color = 'red';
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[3].style.textDecoration = "line-through";
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[3].style.color = 'red';
        }

        if (outOfStock !== 'Yes') {
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[0].style.textDecoration = "";
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[0].style.color = "";
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[1].style.textDecoration = "";
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[1].style.color = "";
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[2].style.textDecoration = "";
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[2].style.color = "";
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[3].style.textDecoration = "";
          doc.getElementsByClassName("columns " + menuSection)[0].children[currentRowId].children[3].style.color = "";
        }

      } else if (currentRowId >= totalElementsOnMenu) {

        // Add the new menu item
        const parentDiv = document.createElement("div");

        const itemDiv = document.createElement("div");
        itemDiv.textContent = dataArray[index].Item;
        parentDiv.appendChild(itemDiv);

        const tallDiv = document.createElement("div");
        tallDiv.textContent = dataArray[index].Tall;
        parentDiv.appendChild(tallDiv);

        const grandeDiv = document.createElement("div");
        grandeDiv.textContent = dataArray[index].Grande;
        parentDiv.appendChild(grandeDiv);

        const ventiDiv = document.createElement("div");
        ventiDiv.textContent = dataArray[index].Venti;
        parentDiv.appendChild(ventiDiv);

        doc.getElementsByClassName("columns " + menuSection)[0].appendChild(parentDiv);
      }
    }
  }
}

function applyPromo(response, doc) {
  if (response.promo && response.weather) {
    let isDisplayPromo = response.promo?.data[0]?.isDisplayPromo;
    if (isDisplayPromo === 'true') {
      // hide qr-code
      doc.getElementsByClassName('qr-code')[0].style.display = 'none';
      // weather based drink
      let temperature = response.weather?.data[0]?.temperature;
      if (temperature < 50) {
        // display hot beverage
        doc.getElementsByClassName("promo")[0].children[0].children[0].style.display = "block";
        doc.getElementsByClassName("promo")[0].children[0].children[1].style.display = "none";
      } else {
        // display cold beverage
        doc.getElementsByClassName("promo")[0].children[0].children[0].style.display = "none";
        doc.getElementsByClassName("promo")[0].children[0].children[1].style.display = "block";
      }
    } else {
      // display qr-code
      doc.getElementsByClassName("promo")[0].children[0].children[0].style.display = "none";
      doc.getElementsByClassName("promo")[0].children[0].children[1].style.display = "none";
      doc.getElementsByClassName('qr-code')[0].style.display = 'block';
    }
  }
}

async function pollAPI(fn, url, doc, interval) {
  try {
    let response = await fetch(url);
    if (response.status === 200) {
      let apiResponse = await response.json();
      console.log(" API response received: " + JSON.stringify(apiResponse));
      fn(apiResponse, doc);
    }
  } catch (error) {
    console.log(JSON.stringify(error));
  }
  finally {
    setTimeout(function() {
      pollAPI(fn, url, doc, interval);
    }, interval);
  }
}

const poll = ( fn, doc, url ) => {
  let targetApi = localStorage.getItem(url);
  if (!targetApi) {
    targetApi = 'https://main--screens-dmb--div8063.hlx.page/final-menu.json';
  }

  let interval = localStorage.getItem('franklinPollInterval');
  if (!interval) {
    interval = 5000;
  }
  console.log('Start poll...');
  setTimeout(function() {
    pollAPI(fn, targetApi, doc, interval);
  }, interval);
};

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? main.querySelector(hash) : false;
  if (hash && element) element.scrollIntoView();

  // loadHeader(doc.querySelector('header'));
  // loadFooter(doc.querySelector('footer'));
  poll(personalizedContent, doc, 'franklinTargetAPI');
  poll(applyPromo, doc, 'franklinPromoAPI');

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
