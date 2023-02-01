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
  picture.classList.add('hero-picture');
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

const isOfferValid = (start, end) => {

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
    childDiv.classList.add(`${childDiv.children[1].innerText}`);
    childDiv.children[0].classList.add('promotion-image');
    childDiv.children[1].style.display = 'none';
    let promotionPriceElement = document.createElement('div');
    promotionPriceElement.classList.add('promotion-price');
    let inner = document.createElement('div');
    inner.classList.add('inner');
    inner.innerHTML = `<p></p>`;
    promotionPriceElement.appendChild(inner);
    childDiv.insertBefore(promotionPriceElement, childDiv.children[0]);
  })
  let offers = main.querySelector('.offers');
  [...offers.children].forEach((childDiv) => {
    if (childDiv.children.length !== 3)
      return;
    childDiv.children[1].style.display = 'none';
    childDiv.children[2].style.display = 'none';
    childDiv.children[0].children[0].children[3].id = 'offer-animation';
    if (isOfferValid(childDiv.children[1].innerText, childDiv.children[2].innerText)) {
      childDiv.style.display = 'none';
    }
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

let prices = {};

const createMenu = (menublock, dataArray) => {
  for (let index = 1; index < dataArray.length; index++) {

    let rowData = dataArray[index];
    if (!rowData || rowData.length === 0) {
      continue;
    }
    let product = rowData.length > 0 ? rowData[0] : null;
    let sku = rowData.length > 1 ? rowData[1] : null;
    let price = rowData.length > 2 ? rowData[2] : null;
    let isOutOfStock = rowData.length > 3 ? rowData[3] : null;
    prices[sku] = price;
    if (product && !isOutOfStock && (!price || price === '')) {
      let heading = document.createElement('div');
      let headingWrapper = document.createElement('div');
      let productText = document.createElement('h4');
      productText.innerText = product;
      headingWrapper.appendChild(productText);
      heading.appendChild(headingWrapper);
      menublock.appendChild(heading)

      let counter = index+1;
      while (counter < dataArray.length) {
        let rowData2 = dataArray[counter];
        let product2 = rowData2.length > 0 ? rowData2[0] : null;
        let sku2 = rowData2.length > 1 ? rowData2[1] : null;
        let price2 = rowData2.length > 2 ? rowData2[2] : null;
        let isOutOfStock2 = rowData2.length > 3 ? rowData2[3] : null;
        prices[sku2] = price2;
        if (product2 && price2 && price2 !== '') {
          let heading = document.createElement('div');
          let name = document.createElement('div');
          name.classList.add(`${sku2}-name`);
          name.classList.add('menu-item');
          name.innerText = product2;
          let rate = document.createElement('div');
          rate.style['text-align'] = 'center';
          rate.style['white-space'] = 'pre';
          rate.classList.add(`${sku2}-price`);
          if(price2 < 10){
           price2 = price2+'  '; 
          }
          rate.innerText = '$ ' + price2;
          let productStatus = document.createElement('div');
          productStatus.classList.add('product-status');
          if (isOutOfStock2){
            name.classList.add('out-of-stock');
            rate.classList.add('out-of-stock');
            productStatus.classList.add('out-of-stock');
            let outOfStockImgElement = document.createElement('img');
            outOfStockImgElement.src = '../images/redcross.png';
            productStatus.appendChild(outOfStockImgElement);
          }
          heading.appendChild(productStatus);
          heading.appendChild(name);
          heading.appendChild(rate);
          menublock.appendChild(heading);
        } else {
          break;
        }
        counter++;
      }
    }
  }
}

const updatePromotionPrices = (promotions, dataArray) => {
  if (!promotions || promotions.length === 0) {
    return;
  }
  [...promotions].forEach((promotion) => {
    let product = promotion.children[2] ? promotion.children[2].innerText.toLowerCase() : null;
    if (product) {
      for (let index=0; index < dataArray.length; index++) {
        let rowData = dataArray[index];
        if (!rowData || rowData.length === 0) {
          continue;
        }
        let sku = rowData.length > 1 ? rowData[1].toLowerCase() : null;
        if (sku === product) {
          let price = rowData.length > 2 ? rowData[2] : null;
          if (price) {
            promotion.children[0].children[0].children[0].innerText = '$' + price;
          }
        }
      }
    }
  })
}

function personalizedContent(apiResponse, doc) {
  let dataArray = apiResponse.values;
  if (dataArray && dataArray.length > 0) {
    let menublock = doc.getElementsByClassName('main-menu')[0];
    menublock.innerHTML = '';
    createMenu(menublock, dataArray);
    let promotions = doc.getElementsByClassName('promotion-container');
    updatePromotionPrices(promotions, dataArray);
  }
}

const processMenuItemsPersonalization = (index, dataArray, doc) => {
  let counter = index + 2;
  while(counter < dataArray.length) {
    let rowData = dataArray[counter];
    if (!rowData || rowData.length === 0 || !rowData[0].includes('SKU')) {
      break;
    }
    let itemName = doc.getElementsByClassName(`${rowData[0]}-name`)[0];
    if (rowData.length > 2 && rowData[2]) {
      itemName.innerText = rowData[2];
    }
    if (rowData[1] && rowData[1].toLowerCase() === 'true') {
      itemName.classList.add('out-of-stock');
    }
    counter++;
  }
}

const processHeroBlockPersonalization = (index, dataArray, doc) => {
  let counter = index + 2;
  let rowData = dataArray[counter];
  if (!rowData || rowData.length < 2) {
    return;
  }
  let heroImage = doc.getElementsByClassName('hero-picture')[0];
  if (rowData[0]) {
    heroImage.children[0].srcset = rowData[0];
    heroImage.children[1].srcset = rowData[0];
    heroImage.children[2].srcset = rowData[0];
    heroImage.children[3].src = rowData[0];
  }
  let title = doc.getElementsByClassName('hero-text-background')[0];
  if (rowData[1]) {
    title.children[1].innerText = rowData[1];
  }
}

const processPromotionsPersonalization = (index, dataArray, doc) => {
  let counter = index + 2;
  while(counter < dataArray.length) {
    let rowData = dataArray[counter];
    if (!rowData || rowData.length < 2 || !rowData[1].includes('SKU')) {
      break;
    }
    let promotion = doc.getElementsByClassName(rowData[1])[0];
    if (promotion) {
      promotion.children[1].children[0].children[0].srcset = rowData[0];
      promotion.children[1].children[0].children[1].srcset = rowData[0];
      promotion.children[1].children[0].children[2].srcset = rowData[0];
      promotion.children[1].children[0].children[3].src = rowData[0];
    } else {
      let promotions = doc.getElementsByClassName('promotions')[0];
      if (promotions.children.length > 3) {
        promotions.children[0].children[0].children[0].children[0].innerText = '$' + prices[rowData[1]];
        promotions.children[0].children[1].children[0].children[0].srcset = rowData[0];
        promotions.children[0].children[1].children[0].children[1].srcset = rowData[0];
        promotions.children[0].children[1].children[0].children[2].srcset = rowData[0];
        promotions.children[0].children[1].children[0].children[3].src = rowData[0];
      } else {
        let promotions = doc.getElementsByClassName('promotions')[0];
        let newPromotion = promotions.children[0].cloneNode(true);
        newPromotion.children[0].children[0].children[0].children[0].innerText = '$' + prices[rowData[1]];
        newPromotion.children[0].children[1].children[0].children[0].srcset = rowData[0];
        newPromotion.children[0].children[1].children[0].children[1].srcset = rowData[0];
        newPromotion.children[0].children[1].children[0].children[2].srcset = rowData[0];
        newPromotion.children[0].children[1].children[0].children[3].src = rowData[0];
        newPromotion.insertBefore(promotions.children[0]);
      }
    }
    counter++;
  }
}

const processOffersBlockPersonalization = (index, dataArray, doc) => {
  let counter = index + 2;
  let rowData = dataArray[counter];
  if (!rowData || rowData.length < 1) {
    return;
  }
  let offer = doc.getElementsByClassName('offers')[0];
  if (rowData[0]) {
    offer.children[0].children[0].children[0].children[0].srcset = rowData[0];
    offer.children[0].children[0].children[0].children[1].srcset = rowData[0];
    offer.children[0].children[0].children[0].children[2].srcset = rowData[0];
    offer.children[0].children[0].children[0].children[3].src = rowData[0];
  }
}

const processNoticesPersonalization = (index, dataArray, doc) => {
  let counter = index + 1;
  const elements = document.getElementsByClassName('personalized-notice');
  while(elements.length > 0){
    elements[0].parentNode.parentNode.removeChild(elements[0].parentNode);
  }
  while(counter < dataArray.length) {
    let rowData = dataArray[counter];
    if (!rowData || rowData.length < 1) {
      break;
    }
    let notices = doc.getElementsByClassName('notices')[0];
    if (rowData[0]) {
      let newNotice = notices.children[0].cloneNode(true);
      newNotice.children[0].innerText = rowData[0];
      newNotice.children[0].classList.add('personalized-notice');
      if (rowData[0] !== notices.children[0].children[0].innerText) {
        notices.insertBefore(newNotice, notices.children[0]);
      }
    }
    counter++;
  }
}

const applyPersonalization = (apiResponse, doc) => {
  let dataArray = apiResponse.values;
  if (dataArray && dataArray.length > 0) {
    for (let index=0; index < dataArray.length; index++) {
      let rowData = dataArray[index];
      if (!rowData || rowData.length === 0) {
        continue;
      }
      if (rowData[0].toLowerCase().includes('menu') && rowData[0].toLowerCase().includes('item')) {
        processMenuItemsPersonalization(index, dataArray, doc);
      }
      if (rowData[0].toLowerCase().includes('hero') && rowData[0].toLowerCase().includes('block')) {
        processHeroBlockPersonalization(index, dataArray, doc);
      }
      if (rowData[0].toLowerCase().includes('promotions')) {
        processPromotionsPersonalization(index, dataArray, doc);
      }
      if (rowData[0].toLowerCase().includes('offers')) {
        processOffersBlockPersonalization(index, dataArray, doc);
      }
      if (rowData[0].toLowerCase().includes('notice')) {
        processNoticesPersonalization(index, dataArray, doc);
      }
    }
  }
};

async function pollAPI(fn1, fn2, url1, url2, doc) {
  try {
    let apiResponse1, apiResponse2;
    let response1 = await fetch(url1);
    if (response1.status === 200) {
      apiResponse1 = await response1.json();
      console.log(" API response received: " + JSON.stringify(apiResponse1));
    }
    let response2 = await fetch(url2);
    if (response2.status === 200) {
      apiResponse2 = await response2.json();
      console.log(" API response received: " + JSON.stringify(apiResponse2));
    }
    if (response1.status === 200) {
      fn1(apiResponse1, doc);
    }
    if (response2.status === 200) {
      fn2(apiResponse2, doc);
    }

  } catch (error) {
    console.log(JSON.stringify(error));
  }
  finally {
    setTimeout(function() {
      pollAPI(fn1, fn2, url1, url2, doc);
    }, 10000);
  }
}

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
  await pollAPI(personalizedContent, applyPersonalization, 'https://sheets.googleapis.com/v4/spreadsheets/1Iwke95E7vaAdfErTZPk-S5QXMQ0j3-BqCWvtI0zTn14/values/sheet1?key=AIzaSyBQRjtsLve-sGmkdMoOKypccTZEGaRK7E8', 'https://sheets.googleapis.com/v4/spreadsheets/1RP6Bm4xtcEwWMDP3J2TMRAlEN7_DyuZCaa47GCh_6ZU/values/sheet1?key=AIzaSyBQRjtsLve-sGmkdMoOKypccTZEGaRK7E8', doc);

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
