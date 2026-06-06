async function register() {
    // getting values from inputs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordRepeat = document.getElementById('password2').value;

    //checking if information is valid
    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== passwordRepeat) {
        alert("Passwords do not match");
        return;
    }

    //sending data to backend
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email, password: password})
        });

        const data = await response.json();

        if (data.success) {
            alert("Account created.");
            localStorage.setItem('token', data.token); //saving token to browsers local storage
            window.location.href = 'index.html'; //redirecting user to homepage
        }   else {
            alert("Error: " + data.message);
        }
    }   catch (error) {
        console.error("Failed to connect to the server.", error);
        alert("Could not reach the server.");
    }
}

//Talk to Vinzenz about naming in login.html and signup.html about 'username' and 'email' to avoid future naming misscommunications"