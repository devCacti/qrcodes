function createStarrySky() {
    const starrysky = document.getElementById('starrysky');
    const numStars = 200; // Number of stars

    // Generate stars
    function generateStars() {
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.classList.add('star');

            // Randomize star position and size
            const size = Math.random() * 3; // Star size between 0 and 3px
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.top = `${Math.random() * 100}%`; // Random vertical position
            star.style.left = `${Math.random() * 100}%`; // Random horizontal position

            // Randomize animation duration and delay
            const duration = Math.random() * 2 + 1; // Duration between 1s and 3s
            const delay = Math.random() * 5; // Delay between 0s and 5s
            star.style.animationDuration = `${duration}s`;
            star.style.animationDelay = `${delay}s`;

            starrysky.appendChild(star);
        }
    }

    generateStars(); // Generate stars once
}

createStarrySky();