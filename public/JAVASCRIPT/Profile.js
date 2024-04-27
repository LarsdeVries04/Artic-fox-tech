const response = await fetch("/Profile", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
});

//show name in /Profile//
const usernameP = document.querySelector(".username")
const responseData = await response.json();
if(responseData){
    usernameP.innerHTML = `Welcome ${responseData.Fname}!`
}
//show name in /Profile//

//Profile info update//
const accinfodiv = document.querySelector(".accinfodiv");
const profileinfolink = document.querySelector(".Profileinfolink");
profileinfolink.addEventListener("click", ()=>{
    profileinfolink.classList.add("activelink");
    accinfodiv.innerHTML = `<form class="Profileinfoform" action="Profile_info" method="POST">
    <div class="Profileinfotitle">Personal info</div>
    <div class="profileinfoinput">
    <div>
        <label for="Fname">First name:</label>
        <input type="text" id="Fname" name="Fname" class="FnameAcc" placeholder="First name" value="${responseData.Fname}">
    </div> 
    <div>
        <label for="Lname">Last name:</label>
        <input type="text" id="Lname" name="Lname" class="LnameAcc" placeholder="Last name" value="${responseData.Lname}">
    </div>
    <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" class="emailAcc" placeholder="Email address" value="${responseData.Email}">
    </div>
    </div>
        <div class="Profileinfotitle">Address details</div>
        <div class="Addressinfoinput">
            <div>
        <label for="postcode">Postcode:</label>
        <input type="text" id="postcode" name="postcode" class="Postcode" placeholder="1234 XX" value="${responseData.Postcode}"></div>
        <div>
        <label for="address">Address:</label>
        <input type="text" id="address" name="address" class="address" placeholder="First street 1" value="${responseData.Address}"></div>
    </div>
    <div class="errormessagediv"></div>
   
    <div class="editBTNdiv">
        <button type="submit" class="editBTN">Save</button>
    </div>
</form>`
});
//Profile info update//