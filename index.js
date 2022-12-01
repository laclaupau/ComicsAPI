let mainSection = document.querySelector(".results")
let charactersSection = document.querySelector("#characters")
const firstPageBtn = document.querySelector(".first-page")
const lastPageBtn = document.querySelector(".last-page")
const nextPageBtn = document.querySelector(".next-page")
const previousPageBtn = document.querySelector(".previous-page")
const orderFilter = document.querySelector("#sort-filter")
const urlRoot = "https://gateway.marvel.com/v1/public/"
const apiKey = "022422e3db64b72d31e9d173153d4272"
const resultsPerPage = 20
let currentPage = 0
let comics = []



const getCharactersInComic = comic => {

  fetch(`${urlRoot}comics/${comic.dataset.id}/characters?apikey=${apiKey}`)
    .then(res => res.json())
    .then(dataComicCharacters => {
      characters = dataComicCharacters.data.results;
      charactersSection.innerHTML = ''
      characters.map(character => {
        console.log('esto es', character)

        charactersSection.innerHTML += `
            <article class="card" data-id="${character.id}">
  <div class="img-container">
    <img src="${character.thumbnail.path}.${character.thumbnail.extension}" class="character-thumbnail"/>
  </div>
    <h4 class="card__title">${character.name}</h4>
  <h5>Bio:<p>${character.description}</p></5>
  </article>
  `
      })
    })

}


const zoomInComic = comic => {

  fetch(`${urlRoot}comics/${comic.dataset.id}?apikey=${apiKey}`)
    .then(res => res.json())
    .then(dataComic => {
      detailed = dataComic.data.results[0]
      let date = ''
      dataComic.data.results.map(comic => {
        date = new Date(comic.modified)
      })
      mainSection.innerHTML = ''
      mainSection.innerHTML = `
<article class="card" data-id="${detailed.id}">
<div class="img-container">
<img src="${detailed.thumbnail.path}/portrait_uncanny.${detailed.thumbnail.extension}" alt="" class="comic-thumbnail" />
</div>
<h3 class="card__title">${detailed.title}</h3>
<div>
<h4>Published: ${date.toLocaleDateString() === "Invalid Date" ? "Not available" : date.toLocaleDateString()}</h4>
<h4>Writers:<p>
${detailed.creators.available === 0
          ? 'Not available'
          : detailed.creators.items.map(creator => creator.name)}
</p></h4>
<h4>Description:<p>${detailed.description || 'No description available'}</p></h4>
</div>
</article>
<h3 class="section-title">Characters</h3>
`

      getCharactersInComic(comic)

    })
  }


const showComics = currentPage => {
    fetch(`${urlRoot}comics?apikey=${apiKey}&offset=${currentPage * resultsPerPage}`)
      .then(res => res.json())
      .then((data) => {
        comics = data.data.results
        total = data.data.total
        console.log(data)
        mainSection.innerHTML = ''
        comics.map((comic) => {
          mainSection.innerHTML += `
      <article class="card comic" data-id="${comic.id}">
      <div class="img-container">
          <img src="${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}" alt="" class="comic-thumbnail" />
      </div>
      <h3 class="card__title">${comic.title}</h3>
      </article>`
        })

        const comicsHTML = document.querySelectorAll(".comic")
        comicsHTML.forEach(comic => {
          comic.onclick = () => {
            zoomInComic(comic)
          }
        })
        

        lastPageBtn.onclick = () => {
          const remainder = total % resultsPerPage
          if (remainder > 0){
            currentPage = (total - (total % resultsPerPage)) / resultsPerPage
          } else {
            currentPage = ((total - (total % resultsPerPage)) / resultsPerPage) - resultsPerPage
          }
        showComics(currentPage)
        }

      })
      .catch ((err) => {
        console.log(err)
        mainSection.textContent = "No matches were found."
      })
}


nextPageBtn.onclick = () => {
  currentPage++
  showComics(currentPage)
}

previousPageBtn.onclick = () => {
  currentPage--
  showComics(currentPage)
}

firstPageBtn.onclick = () => { 
  currentPage = 0
  showComics(currentPage)
}



showComics(currentPage)

const showCharacters = () => {
  fetch(`${urlRoot}characters?apikey=${apiKey}`)
  .then((res) => res.json())
  .then((charactersData) => {
      console.log(charactersData)
      characters = charactersData.data.results
      mainSection.innerHTML = ''
      characters.map((character) => {
        mainSection.innerHTML += `
        <article class="card">
        <div class="img-container">
        <img src="${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}" alt="" class="character-thumbnail" />
        </div>
        <h3 class="card__title">${character.name}</h3>
        </article>
        `

  })
})
}

const typeFilter = document.querySelector("#type-filter")
const sortFilter = document.querySelector("#sort-filter")
const userSearch = document.querySelector("#search-field")
const searchBtn = document.querySelector("#search-btn")

typeFilter.onchange = () => {
  typeFilter.value == 'characters' && showCharacters()
  typeFilter.value == 'comics' && showComics()
}


searchBtn.onclick = () => {
  if (typeFilter.value == 'comics') {
  fetch(`${urlRoot}comics?apikey=${apiKey}&offset=0&orderBy=title&titleStartsWith=${userSearch.value}`)
  .then(res => res.json())
  .then((data) => {
    comics = data.data.results
    mainSection.innerHTML = ''
    comics.map((comic) => {
      mainSection.innerHTML += `
  <article class="card" data-id="${comic.id}">
  <div class="img-container">
      <img src="${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}" alt="" class="comic-thumbnail" />
  </div>
  <h3 class="card__title">${comic.title}</h3>
  </article>`
    })
})

} else {
  fetch(`${urlRoot}characters?apikey=${apiKey}&offset=0&orderBy=name&nameStartsWith=${userSearch.value}`)
  .then(res => res.json())
  .then((charactersData) => {
    characters = charactersData.data.results
    mainSection.innerHTML = ''
    characters.map((character) => {
      mainSection.innerHTML += `
      <article class="card">
    <div class="img-container">
      <img src="${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension}" alt="" class="character-thumbnail" />
    </div>
      <h3 class="card__title">${character.name}</h3>
      </article>
      `
    })
})

}
}