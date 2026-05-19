/*
  Requirement: Populate the "Weekly Course Breakdown" list page.

  Instructions:
  1. This file is already linked to `list.html` via:
         <script src="list.js" defer></script>

  2. In `list.html`, the <section id="week-list-section"> is the container
     that this script populates.

  3. Implement the TODOs below.
*/

// --- Element Selections ---
// TODO: Select the section for the week list using its id 'week-list-section'.
const weekListSection = document.getElementById('week-list-section');
// --- Functions ---

/**
 * TODO: Implement createWeekArticle.
 *
 * Parameters:
 *   week — one object from the API response with the shape:
 *     {
 *       id:          number,   // integer primary key from the weeks table
 *       title:       string,
 *       start_date:  string,   // "YYYY-MM-DD" — matches the SQL column name
 *       description: string,
 *       links:       string[]  // already decoded array of URL strings
 *     }
 *
 * Returns:
 *   An <article> element matching the structure shown in list.html:
 *     <article>
 *       <h2>{title}</h2>
 *       <p>Starts on: {start_date}</p>
 *       <p>{description}</p>
 *       <a href="details.html?id={id}">View Details & Discussion</a>
 *     </article>
 *
 * Important: the href MUST be "details.html?id=<id>" (integer id from
 * the weeks table) so that details.js can read the id from the URL.
 */
function createWeekArticle(week) {
  const article = document.createElement("article");
  article.className = "col-md-8  ";

  const card = document.createElement("div");
  card.className = "card week-card h-100 shadow-sm border-0";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body d-flex flex-column";

  const title = document.createElement("h2");
  title.className = "card-title h4 fw-bold";
  title.textContent = week.title;

  const startDate = document.createElement("p");
  startDate.className = "text-muted small mb-2";
  startDate.textContent = "Starts on: " + week.start_date;

  const description = document.createElement("p");
  description.className = "card-text";
  description.textContent = week.description;

  const link = document.createElement("a");
  link.href = `details.html?id=${week.id}`;
  link.className = "btn mt-auto custom-btn";
  link.textContent = "View Details & Discussion";

  cardBody.appendChild(title);
  cardBody.appendChild(startDate);
  cardBody.appendChild(description);
  cardBody.appendChild(link);

  card.appendChild(cardBody);
  article.appendChild(card);

  return article;
}

/**
 * TODO: Implement loadWeeks (async).
 *
 * It should:
 * 1. Use fetch() to GET data from './api/index.php'.
 *    The API returns JSON in the shape:
 *      { success: true, data: [ ...week objects ] }
 * 2. Parse the JSON response.
 * 3. Clear any existing content from the list section.
 * 4. Loop through the data array. For each week object:
 *    - Call createWeekArticle(week).
 *    - Append the returned <article> to the list section.
 */
async function loadWeeks() {
  // ... your implementation here ...
  const response=await fetch('./api/index.php');
  const result= await response.json();
  
  weekListSection.innerHTML="";

  if (!result.success || !Array.isArray(result.data)) {
    weekListSection.innerHTML = '<p class="text-danger">Unable to load weeks.</p>';
    return;
  }

  for(const week of result.data){
    const article= createWeekArticle(week);
    weekListSection.appendChild(article);
  }
}

// --- Initial Page Load ---
loadWeeks();
