const apiKey = 'wmavSUACrLbBlJogHqOsfBKlUduZ1uEoEFHd4TSN';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function getParks(query, maxResults = 10) {
  const params = {
    api_key: apiKey,
    limit: maxResults,
    stateCode: query
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  // console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array

  for (let i = 0; i < responseJson.data.length; i++) {
    let park = responseJson.data[i];
    // console.log(park.description);
    $('#results-list').append(`
    <li><h3>${park.name}</h3>
    <p>${park.description}</p >
    <p><a href="${park.url}">${park.url}</a></p>
    </li > `);
    $('#results').removeClass('hidden');
  }

}

function searchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const state = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParks(state, maxResults);
  });
}

$(searchForm);