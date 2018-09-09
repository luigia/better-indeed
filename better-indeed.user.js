// ==UserScript==
// @id             better-indeed
// @name           Better Indeed
// @version        1.0.3
// @namespace      https://github.com/luigia
// @author         Luigi Agcaoili
// @license        MIT - https://opensource.org/licenses/MIT
// @description    Removes bloat on Indeed by giving users the option to remove sponsored and/or Job Spotter postings
// @include        https://indeed.com/jobs?*
// @include        *indeed.com/jobs?*
// @updateURL      https://github.com/luigia/better-indeed/raw/master/better-indeed.user.js
// @run-at         document-end
// @grant          none
// ==/UserScript==

// select & edit the side bar
const filters = document.querySelector('#refineresults'),
  bar = document.createElement('div')

bar.innerHTML = `
  <h4 class="toggle-title">Toggle ads</h4>
  <input type="checkbox" id="job-spotter-checkbox">
  <label for="job-spotter-checkbox">Hide Job Spotter ads</label>
  <input type="checkbox" id="sponsored-checkbox">
  <label for="sponsored-checkbox">Hide sponsored ads</label>
  `
bar.style.marginBottom = '24px'
bar.style.marginLeft = '0'
bar.style.paddingLeft = '24px'
bar.style.color = '#2d2d2d'
bar.style.fontSize = '12px'
bar.style.maxWidth = '70%'
bar.firstElementChild.style.fontSize = '14px'
bar.firstElementChild.style.fontWeight = '500'
bar.firstElementChild.style.color = '#000'
filters.insertBefore(bar, filters.firstChild)

// checkbox variables
const jobSpotCb = document.querySelector('#job-spotter-checkbox'),
  sponsoredCb = document.querySelector('#sponsored-checkbox')

// addEventListeners & check localStorage
window.onload = () => {
  jobSpotCb.addEventListener('change', hideJobSpot)
  sponsoredCb.addEventListener('change', hideSponsored)

  let jobSpotLS = JSON.parse(localStorage.getItem(jobSpotCb.id)),
    sponsoredLS = JSON.parse(localStorage.getItem(sponsoredCb.id))

  if (jobSpotLS) {
    jobSpotCb.checked = true
    hideJobSpot()
  }

  if (sponsoredLS) {
    sponsoredCb.checked = true
    hideSponsored()
  }

  // move pagination to the side
  const pagination = document.querySelector('.pagination'),
    results = document.querySelector('#resultsCol')
  // delay as job postings aren't instantly loaded
  setTimeout(() => {
    let side = document.querySelector('#jobalerts') || document.querySelector('#vjs-content')
    side.insertBefore(pagination, side.firstChild)
  }, 200)

  // move pagination back to the side if it's removed
  results.addEventListener('click', (e) => {
    setTimeout(() => {
      if (document.querySelector('#vjs-content')) {
        let vjsContent = document.querySelector('#vjs-content')
        vjsContent.insertBefore(pagination, vjsContent.firstChild)
      }

      if (document.querySelector('#vjs-x')) {
        let close = document.querySelector('#vjs-x')
        close.addEventListener('click', (e) => {
          if (document.querySelector('#jobalerts')) {
            side = document.querySelector('#jobalerts')
            side.insertBefore(pagination, side.firstChild)
          }
        })
      }
    }, 200)
  })
}

// hide job spotter postings
const hideJobSpot = () => {
  const linkSource = Array.from(document.querySelectorAll('.result-link-source')),
    jobSpot = []

  linkSource.forEach((source) => (source.textContent == 'Job Spotter ') && jobSpot.push(source))

  if (jobSpotCb.checked) {
    localStorage.setItem(jobSpotCb.id, jobSpotCb.checked)
    ;(jobSpot.length > 0) && jobSpot.forEach((posting) => posting.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none')
  } else {
    localStorage.removeItem(jobSpotCb.id)
    jobSpot.forEach((posting) => posting.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'block')
  }
}

// hide sponsored postings
const hideSponsored = () => {
  let lastSponsored = Array.from(document.querySelectorAll('.sjlast'))

  if (sponsoredCb.checked) {
    localStorage.setItem(sponsoredCb.id, sponsoredCb.checked)
    if (lastSponsored.length === 1) {
      lastSponsored[0].parentElement.style.display = 'none'
    } else {
      lastSponsored.forEach((section) => {
        section.parentElement.style.display = 'none'
      })
    }
  } else {
    localStorage.removeItem(sponsoredCb.id)
    if (lastSponsored.length === 1) {
      lastSponsored[0].parentElement.style.display = 'block'
    } else {
      lastSponsored.forEach((section) => {
        section.parentElement.display = 'block'
      })
    }
  }
}
