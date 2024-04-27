const errormessageP = document.querySelector(".errormessage");
const registerForm = document.querySelector(".Registerfrom");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = {
        Fname: registerForm.querySelector("#Fname").value,
        Lname: registerForm.querySelector("#Lname").value,
        email: registerForm.querySelector("#email").value,
        password: registerForm.querySelector("#password").value,
        ConfirmPass: registerForm.querySelector("#ConfirmPass").value
    };
    try {
        const response = await fetch("/Register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const responseData = await response.text();
        if (response.ok) {
            window.location.href = "/Login";
        } else {
            errormessageP.textContent = responseData;
            errormessageP.classList.add("errorvisable");
        }
    } catch (error) {
        errormessageP.textContent = "Error registering user";
        errormessageP.classList.add("errorvisable");
    }
});