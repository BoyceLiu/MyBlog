// Simple Fuse.js search script
(function () {
  const searchInput = document.getElementById('search-query');
  const searchResults = document.getElementById('search-results');
  let fuse;
  let searchList;

  // 1. Fetch the search index
  fetch('/index.json')
    .then(response => response.json())
    .then(data => {
      searchList = data;
      // 2. Initialize Fuse.js
      const options = {
        keys: ['title', 'tags', 'summary'],
        includeScore: true,
        threshold: 0.4, // Be a bit more forgiving
        minMatchCharLength: 2,
        ignoreLocation: true,
      };
      fuse = new Fuse(searchList, options);
    })
    .catch(error => console.error('Error fetching search index:', error));

  // 3. Add event listener for search input
  searchInput.addEventListener('input', function () {
    const query = this.value;

    if (query.length < 2) {
      searchResults.innerHTML = '';
      searchResults.style.display = 'none';
      return;
    }

    const results = fuse.search(query);
    displayResults(results);
  });

  // 4. Function to display results
  function displayResults(results) {
    searchResults.innerHTML = '';

    if (results.length > 0) {
      const ul = document.createElement('ul');
      // Limit to top 10 results
      results.slice(0, 10).forEach(result => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = result.item.permalink;
        a.textContent = result.item.title;
        li.appendChild(a);
        ul.appendChild(li);
      });
      searchResults.appendChild(ul);
      searchResults.style.display = 'block';
    } else {
      searchResults.style.display = 'none';
    }
  }

  // Hide results when clicking outside
  document.addEventListener('click', function(event) {
    if (!searchResults.contains(event.target) && event.target !== searchInput) {
      searchResults.style.display = 'none';
    }
  });
})();
