const errormessageP = document.querySelector(".errormessage");
const LoginForm = document.querySelector(".Loginfrom");

LoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = {
        email: LoginForm.querySelector("#email").value,
        password: LoginForm.querySelector("#password").value,
    };
    try {
        const response = await fetch("/Login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const responseData = await response.text();
        if (response.ok) {
            window.location.href = "/Profile";
        } else {
            errormessageP.textContent = responseData;
            errormessageP.classList.add("errorvisable");
        }
    } catch (error) {
        console.error(error);
        errormessageP.textContent = "Error Login user";
        errormessageP.classList.add("errorvisable");
    }
});