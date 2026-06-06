async function login() {
    //getting value from the inputs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    //checking if data is valid
    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    //sending data to backend
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password})
        });

        const data = await response.json();

        if (data.success) {
            alert("Logged in successfully.")
            localStorage.setItem('token', data.token);  //saving the token
            window.location.href = 'index.html';        //redirecting to homepage
        }   else {
            alert("Error: " + data.message);
        }
    } catch {
        console.error("Failed to connect to the server.", error);
        alert("Could not reach the server.");
    }
}


// Had to rename 'username' to 'email' in login.html again. Have to let vinzenz know