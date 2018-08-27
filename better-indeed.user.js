// ==UserScript==
// @id             better-indeed
// @name           Better Indeed
// @version        1.0.0
// @namespace      https://github.com/luigia
// @author         Luigi Agcaoili
// @description    Removes bloat on Indeed by giving users the option to remove sponsored and/or Job Spotter postings
// @include        https://indeed.com/jobs?*
// @include        *indeed.com/jobs?*
// @run-at         document-end
// @grant          none
// ==/UserScript==

// select & edit the top bar
let bar = '';
if (document.querySelector('#resumePromo')) bar = document.querySelector('#resumePromo');
if (document.querySelector('.resultsTop')) bar = document.querySelector('.resultsTop');

bar.innerHTML = `
  <input type="checkbox" id="job-spotter-checkbox">
  <label for="job-spotter-checkbox">Hide job spotter postings</label>
  <input type="checkbox" id="sponsored-checkbox">
  <label for="sponsored-checkbox">Hide sponsored postings</label>
`;

// checkbox variables
const jobSpotCb = document.querySelector('#job-spotter-checkbox'),
sponsoredCb = document.querySelector('#sponsored-checkbox');

window.onload = () => {
  // addEventListeners & check localStorage
  jobSpotCb.addEventListener('change', hideJobSpot);
  sponsoredCb.addEventListener('change', hideSponsored);

  let jobSpotLS = JSON.parse(localStorage.getItem(jobSpotCb.id)),
  sponsoredLS = JSON.parse(localStorage.getItem(sponsoredCb.id));
  if (jobSpotLS) {
    jobSpotCb.checked = true;
    hideJobSpot();
  }
  if (sponsoredLS) {
    sponsoredCb.checked = true;
    hideSponsored();
  }

  // move pagination to the side
  let side = '';
  const pages = document.querySelector('.pagination'),
  results = document.querySelector('#resultsCol');
  // delay as job postings aren't instantly loaded
  setTimeout(() => {
    if (document.querySelector('#jobalerts')) {
    side = document.querySelector('#jobalerts');
  } else if (document.querySelector('#vjs-content')) {
    side = document.querySelector('#vjs-content');
  }
  side.insertBefore(pages, side.firstChild);
  }, 200);

  // move pagination back to the side if it's removed
  results.addEventListener('click',  (e) => {
    setTimeout(() => {
      if (document.querySelector('#vjs-content')) {
        vjsContent = document.querySelector('#vjs-content')
        vjsContent.insertBefore(pages, vjsContent.firstChild)  
      } 
      if (document.querySelector('#vjs-x')) {
        close = document.querySelector('#vjs-x')
        close.addEventListener('click', (e) => {
            if (document.querySelector('#jobalerts')) {
              side = document.querySelector('#jobalerts')
              side.insertBefore(pages, side.firstChild)
            }
        })
      }
    }, 200);
  })
}

// hide job spotter postings
const hideJobSpot = () => {
  const linkSource = Array.from(document.querySelectorAll('.result-link-source')),
  jobSpot = [];

  linkSource.forEach((source) => (source.textContent == 'Job Spotter ') && jobSpot.push(source));

  if (jobSpotCb.checked) {
    localStorage.setItem(jobSpotCb.id, jobSpotCb.checked);
    (jobSpot.length > 0) && jobSpot.forEach((posting) => posting.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none');
  } else {
    localStorage.removeItem(jobSpotCb.id);
    jobSpot.forEach((posting) => posting.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'block');
  }
}

// hide sponsored postings
const hideSponsored = () => {
  const sponsored = Array.from(document.querySelectorAll('.sponsoredGray'));

  if (sponsoredCb.checked) {
    localStorage.setItem(sponsoredCb.id, sponsoredCb.checked);
    sponsored.forEach((ad) => ad.parentElement.parentElement.parentElement.parentElement.style.display = 'none');
  } else {
    localStorage.removeItem(sponsoredCb.id);
    sponsored.forEach((ad) => ad.parentElement.parentElement.parentElement.parentElement.style.display = 'block');
  }
}