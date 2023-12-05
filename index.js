document.addEventListener('DOMContentLoaded', function () {
    const gameListContainer = document.getElementById('game-list');
    const subscribeBtn = document.getElementById('subscribeBtn');

    // Sample game data (replace this with your actual game data)
    const games = [
        { title: 'Flappy Bird', imageUrl: 'flappy.png', link: 'flappy_bird.html' },
        { title: 'Wordle', imageUrl: 'worlde.jpg', link: 'word.html' },
        { title: 'Card Match', imageUrl: 'card.jpg', link: 'card.html' },
        { title: 'MAZE', imageUrl: 'maze.jpg', link: 'maze.html' },
        { title: 'Sliding Numbers', imageUrl: 'slid.jpg', link: 'slide.html' },
        { title: 'GuessTthe Word', imageUrl: 'guess.jpg', link: 'guess.html' },
        // Add more game data as needed
    ];

    // Create game cards and append them to the gameListContainer
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';

        const gameImage = document.createElement('img');
        gameImage.src = game.imageUrl;
        gameImage.alt = game.title;

        const gameTitle = document.createElement('div');
        gameTitle.className = 'game-title';
        gameTitle.textContent = game.title;

        gameCard.appendChild(gameImage);
        gameCard.appendChild(gameTitle);

        gameCard.addEventListener('click', function () {
            window.location.href = game.link;
        });

        gameListContainer.appendChild(gameCard);
    });

    // Subscribe button click event
    subscribeBtn.addEventListener('click', function () {
        alert('Thank you for subscribing!');
        // You can add logic to handle subscription here
    });
});


const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const navbg = document.querySelector('.nav-bg');
menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
    navbg.classList.toggle('active');
});





