// Select DOM elements
const allMatchesContainer = document.querySelector(".all-matches");
const addMatchBtn = document.querySelector(".lws-addMatch");
const resetBtn = document.querySelector(".lws-reset");

// Initial State
const initialState = {
  matches: [{ id: 1, score: 0 }],
};

// Reducer function
const scoreboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_MATCH":
      return {
        ...state,
        matches: [
          ...state.matches,
          {
            id: state.matches.length + 1,
            score: 0,
          },
        ],
      };
    case "DELETE_MATCH":
      return {
        ...state,
        matches: state.matches.filter((match) => match.id !== action.payload),
      };
    case "INCREMENT_SCORE":
      return {
        ...state,
        matches: state.matches.map((match) =>
          match.id === action.payload
            ? { ...match, score: match.score + action.value }
            : match
        ),
      };
    case "DECREMENT_SCORE":
      return {
        ...state,
        matches: state.matches.map((match) =>
          match.id === action.payload
            ? {
                ...match,
                score: Math.max(0, match.score - action.value),
              }
            : match
        ),
      };
    case "RESET_SCORE":
      return {
        ...state,
        matches: state.matches.map((match) => ({ ...match, score: 0 })),
      };
    default:
      return state;
  }
};

// Create store
const store = Redux.createStore(scoreboardReducer);

// Function to render matches in DOM
const renderMatches = () => {
  allMatchesContainer.innerHTML = "";

  store.getState().matches.forEach((match) => {
    // Create sigle match element
    const matchElement = document.createElement("div");
    matchElement.className = "match";

    // Create wrapper element
    const wrapperElement = document.createElement("div");
    wrapperElement.classList.add("wrapper");

    // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("lws-delete");
    deleteBtn.innerHTML = `<img src="./image/delete.svg" alt="" /> `;
    deleteBtn.addEventListener("click", () => {
      store.dispatch({ type: "DELETE_MATCH", payload: match.id });
    });

    // Create match heading
    const matchName = document.createElement("h3");
    matchName.classList.add("lws-matchName");
    matchName.innerText = `Match ${match.id}`;

    // Create increment decrement container
    const incDecContainer = document.createElement("div");
    incDecContainer.classList.add("inc-dec");

    // Create increment form
    const incrementForm = document.createElement("form");
    incrementForm.classList.add("incrementForm");

    const incFormName = document.createElement("h4");
    incFormName.innerText = "Increment";

    const incrementInput = document.createElement("input");
    incrementInput.classList.add("lws-increment");
    incrementInput.setAttribute("type", "number");
    incrementInput.setAttribute("name", "increment");
    incrementInput.addEventListener("keypress", (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        store.dispatch({
          type: "INCREMENT_SCORE",
          payload: match.id,
          value: parseInt(incrementInput.value),
        });
      }
    });

    // create decrement form
    const decrementForm = document.createElement("form");
    decrementForm.classList.add("decrementForm");

    const decFormName = document.createElement("h4");
    decFormName.innerText = "Decrement";

    const decrementInput = document.createElement("input");
    decrementInput.classList.add("lws-decrement");
    decrementInput.setAttribute("type", "number");
    decrementInput.setAttribute("name", "decrement");
    decrementInput.addEventListener("keypress", (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        store.dispatch({
          type: "DECREMENT_SCORE",
          payload: match.id,
          value: parseInt(decrementInput.value),
        });
      }
    });

    // create result container
    const resultContainer = document.createElement("div");
    resultContainer.classList.add("numbers");
    resultContainer.innerHTML = `<h2 class="lws-singleResult">${match.score}</h2>`;

    // Appending childs
    wrapperElement.appendChild(deleteBtn);
    wrapperElement.appendChild(matchName);
    matchElement.appendChild(wrapperElement);

    incrementForm.appendChild(incFormName);
    incrementForm.appendChild(incrementInput);
    incDecContainer.appendChild(incrementForm);

    decrementForm.appendChild(decFormName);
    decrementForm.appendChild(decrementInput);
    incDecContainer.appendChild(decrementForm);

    matchElement.appendChild(incDecContainer);
    matchElement.appendChild(resultContainer);

    allMatchesContainer.appendChild(matchElement);
  });
};

// Render DOM initially
renderMatches();

// Subscribe to the store
store.subscribe(renderMatches);

// Event listeners
addMatchBtn.addEventListener("click", () => {
  store.dispatch({ type: "ADD_MATCH" });
});

resetBtn.addEventListener("click", () => {
  store.dispatch({
    type: "RESET_SCORE",
  });
});
