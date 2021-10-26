// Variables Declaration that are Global

const API_URL = "http://localhost:8000/";

// Store GET Response
let myJSonList = []

// DOM Manipulation
let myForm = document.getElementById("signUpForm")
var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
    keyboard: false
  })


// Ajax Standard Retrieve Comms

const retrieveAPIData = async(path, queryParam = "") => {

    let urlPath

    if (queryParam == "") {
        urlPath = API_URL + path
    } else {
        urlPath = API_URL + path + "?search=" + queryParam
    }

    console.log("retrieveAPIData() connecting to: ", urlPath)

    try {
        const response = await fetch(`${urlPath}`, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (response.ok) {
        
            const data = await response.json()
            console.log("Response status is: ", response.status)
            console.log("Response data is: " , data)

            return data
        
        } else {
            console.log("GET Response its NOT ok")
        }

    } catch (error) {
        console.log("ERROR from retrieveAPIData: ", error)
    }

}


// Ajax Standard Post-Create Comms

const postAPIData = async(path, postData) => {

    let urlPath = API_URL + path
    console.log("postAPIData() connecting to: ", urlPath)

    try{

        const postResponse = await fetch(`${urlPath}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            mode:'cors',
            body: JSON.stringify(postData)
        })

        const dataResult = await postResponse.json()
        console.log("Response status is: ", postResponse.status)
        console.log("Response data is: " , dataResult)
        
        return dataResult
    
    } catch (error) {
        console.log("Error from postAPIData: ", error)
        return false
    }
}


function generateUserSignUp(){

    let myJSonUser = {
        first_name: myForm.querySelector("#firstName").value,
        last_name: myForm.querySelector("#lastName").value,
        email: myForm.querySelector("#email").value,
        username: myForm.querySelector("#username").value,
        password: myForm.querySelector("#password").value
    }

    const userSignUpResponse = postAPIData("api/signup/", myJSonUser)
    console.log("generateUserSignUp() its in progress ...")

    if(userSignUpResponse.length > 0){

        localStorage.setItem("userID", loginResponse.id)
        localStorage.setItem("username", loginResponse.user)
        localStorage.setItem("token", loginResponse.token)

        myModal._dialog.querySelector(".btn-secondary").classList.value = "btn btn-secondary d-none"
        myModal._dialog.querySelector(".btn-primary").classList.value = "btn btn-primary"
        myModal._dialog.querySelector(".message-status").innerText = `Hola ${userSignUpResponse.user} por favor haz login para validar tu cuenta !!!`

    } else {
        myModal._dialog.querySelector(".btn-primary").classList.value = "btn btn-primary d-none"
        myModal._dialog.querySelector(".btn-secondary").classList.value = "btn btn-secondary"
        myModal._dialog.querySelector(".message-status").innerText = "Algo salio mal por favor revisa tus datos o tu conexión"
        console.log("generateUserSignUp() Status is not OK")
    }
}


myForm.addEventListener("submit", (event) => {

    event.preventDefault()
    event.stopPropagation()

    console.log("Event Listener: ", event)

    myModal.show()
    generateUserSignUp()

})
