"use strict";

const $episodeContainer = $("#episodesList");
const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

// Step 3: Make AJAX request for Search
async function getShowsByTerm(term) {
  const res = await axios.get('http://api.tvmaze.com/search/shows', { 
    params: {
    q: term
    },
  });
  return res.data.map(results => {
    const show = results.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      // Step 4: Add Show Images
      // Explore the docs for the TVMaze API and find how we’d extract an image 
      // in the searchShows function. Add this image to the result object 
      // returned by this function.
      image: show.image ? show.image.medium : "https://tinyurl.com/missing-tv",
    };
  });
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    // Step 4: Add Show Images
    // Update populateShows to show the image. Be careful how you implement this.
    // Step 5: Add an "Episodes" button at the bottom of each show card
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}" 
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);
    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// Step 5: Add Episode Lists
// First, implement the getEpisodes function, which is given a show ID. It 
// should return an array of objects with basic information on the episodes 
// for that show.
async function getEpisodes(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return res.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));
}



/** Write a clear docstring for this function... */

// Step 5: Add Episode Lists
// Write a function, populateEpisodes, which is provided an array of episodes
// info, and populates that into the #episodes-list part of the DOM.
function populateEpisodes(episodes) {
  $episodeContainer.empty(); // Clears any existing episodes
  for (let episode of episodes){
    const $episodeItem = $(
      `<li>
        ${episode.name}
        (season ${episode.season}, episode ${episode.number})
      </li>`
    );
    $episodeContainer.append($episodeItem);
  }
  // Reveal the #episodes-area, which is inittially hidden
  $episodesArea.show();
 }

 // Add a click handler that listens for clicks on those buttons.
 async function handleClick(evt){
  const id = $(evt.target).closest(".Show").data("show-id");
  const episodes = await getEpisodes(id);
  populateEpisodes(episodes);
 }

 $showsList.on("click", ".Show-getEpisodes", handleClick);
