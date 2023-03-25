const quoteList = document.querySelector('#quote-list')
const form = document.querySelector('#new-quote-form')

// Get quotes from the API and add them to the page
fetch('http://localhost:3000/quotes?_embed=likes')
  .then(response => response.json())
  .then(quotes => {
    quotes.forEach(quote => {
      renderQuote(quote)
    })
  })

// Add a new quote to the API and add it to the page
form.addEventListener('submit', event => {
  event.preventDefault()

  const quote = {
    quote: event.target.quote.value,
    author: event.target.author.value
  }

  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quote)
  })
    .then(response => response.json())
    .then(newQuote => {
      renderQuote(newQuote)
    })

  form.reset()
})

// Delete a quote from the API and remove it from the page
quoteList.addEventListener('click', event => {
  if (event.target.matches('.btn-danger')) {
    const quoteCard = event.target.closest('.quote-card')
    const quoteId = quoteCard.dataset.id

    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: 'DELETE'
    })
      .then(() => {
        quoteCard.remove()
      })
  }
})

// Add a like for a quote to the API and update the number of likes in the DOM
quoteList.addEventListener('click', event => {
  if (event.target.matches('.btn-success')) {
    const quoteCard = event.target.closest('.quote-card')
    const quoteId = quoteCard.dataset.id
    const likesCount = quoteCard.querySelector('span')

    fetch('http://localhost:3000/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteId: parseInt(quoteId)
      })
    })
      .then(response => response.json())
      .then(like => {
        likesCount.textContent = like.length
      })
  }
})

// Render a quote to the page
function renderQuote(quote) {
  const quoteCard = document.createElement('li')
  quoteCard.classList.add('quote-card')
  quoteCard.dataset.id = quote.id

  quoteCard.innerHTML = `
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  `

  quoteList.append(quoteCard)
}
 
  