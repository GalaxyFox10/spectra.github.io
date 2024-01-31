document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('loginBtn');
    const userInfoDiv = document.getElementById('userInfo');
    const usernameElem = document.getElementById('username');
    const profilePictureElem = document.getElementById('profilePicture');

    // Replace 'YOUR_CLIENT_ID' with your Discord application's actual client ID
    const clientId = '1140260247127212072';
    const redirectUri = 'https://galaxyfox10.io'; // Your redirect URL

    loginBtn.addEventListener('click', function () {
        // Create OAuth2 URL for authorization
        const authUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=identify`;

        // Open a new window for Discord authentication
        const authWindow = window.open(authUrl, '_blank', 'width=600,height=600');

        // Listen for changes in the URL of the new window
        const interval = setInterval(function () {
            try {
                if (authWindow.location.href.startsWith(redirectUri)) {
                    clearInterval(interval);
                    authWindow.close();

                    // Extract the access token from the URL
                    const accessToken = authWindow.location.hash.split('&')[0].substring(14);

                    // Use the access token to fetch user information
                    fetch('https://discord.com/api/users/@me', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    })
                        .then(response => response.json())
                        .then(data => {
                            // Display user information
                            usernameElem.textContent = data.username;
                            profilePictureElem.src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
                            userInfoDiv.style.display = 'block';
                        });
                }
            } catch (error) {
                // Suppress security error (due to cross-origin restriction)
            }
        }, 100);
    });
});
