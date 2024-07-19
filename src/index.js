let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        const card = createToyCard(toy);
        toyCollection.appendChild(card);
      });
    })
    .catch(error => console.error('Error fetching toys:', error));

  function createToyCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';

    const h2 = document.createElement('h2');
    h2.textContent = toy.name;
    card.appendChild(h2);

    const img = document.createElement('img');
    img.src = toy.image;
    img.className = 'toy-avatar';
    card.appendChild(img);

    const p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;
    card.appendChild(p);

    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';
    likeBtn.textContent = 'Like ❤️';
    likeBtn.addEventListener('click', () => likeToy(toy, p));
    card.appendChild(likeBtn);

    return card;
  }

  function likeToy(toy, likeDisplay) {
    const newLikes = toy.likes + 1;
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
      .then(response => response.json())
      .then(updatedToy => {
        likeDisplay.textContent = `${updatedToy.likes} Likes`;
        toy.likes = updatedToy.likes; // Update local toy object
      })
      .catch(error => console.error('Error liking toy:', error));
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const toyForm = document.querySelector('.add-toy-form');

  toyForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(toyForm);
    const name = formData.get('name');
    const image = formData.get('image');
    const newToy = {
      name,
      image,
      likes: 0
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => {
        const card = createToyCard(toy);
        const toyCollection = document.getElementById('toy-collection');
        toyCollection.appendChild(card);
        toyForm.reset();
      })
      .catch(error => console.error('Error adding toy:', error));
  });

  // Remaining code for fetching toys and liking toys...
});

