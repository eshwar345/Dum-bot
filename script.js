// Auto-reply function for basic conversations
async function autoReply(userMessage) {
    const messageText = userMessage.toLowerCase();
    
    try {
        const response = await fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messageText }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.response;
        
    } catch (error) {
        console.error('Error fetching bot response:', error);
        return "I'm sorry, I don't understand that. Can you ask something else?";
    }
}

function sendMessage() {
    var messageInput = document.getElementById('message-input');
    var message = messageInput.value.trim();
    if (message === '') {
        return; // Prevent sending empty messages
    }
    var currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    var messageContainer = document.getElementById('message-container');

    // Append user's message
    var userMessageHTML = '<div class="message outgoing"><span class="sender">You</span>: ' + message + '<span class="timestamp">' + currentTime + '</span><i class="fas fa-check-double double-tick"></i></div>';
    messageContainer.innerHTML += userMessageHTML;
    messageInput.value = '';
    messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to the bottom

    // Generate bot's reply after a short delay
    setTimeout(async function() {
        var botMessage = await autoReply(message);
        var botMessageHTML = '<div class="message incoming"><span class="sender">Bot</span>: ' + botMessage + '<span class="timestamp">' + currentTime + '</span></div>';
        messageContainer.innerHTML += botMessageHTML;
        messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to the bottom
    }, 1000); // 1 second delay for realism
}

function insertEmoji(emoji) {
    var messageInput = document.getElementById('message-input');
    messageInput.value += emoji;
}

function setWallpaper() {
    var wallpaperUrlInput = document.getElementById('wallpaperUrl');
    var container = document.getElementById('container');
    var wallpaperUrl = wallpaperUrlInput.value.trim();
    
    // Check if the URL is not empty
    if (wallpaperUrl !== '') {
        container.style.backgroundImage = 'url("' + wallpaperUrl + '")';
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
        document.getElementById('wallpaperInput').style.display = 'none';
    } else {
        alert("Please enter a valid image URL.");
    }
}

function showWallpaperInput() {
    document.getElementById('wallpaperInput').style.display = 'block';
}

function toggleDropdown() {
    var dropdownContent = document.getElementById('dropdownContent');
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
}

function toggleDarkMode() {
    var container = document.getElementById('container');
    container.classList.toggle('dark-mode');
}

// Function to handle Enter key press
document.getElementById("message-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
