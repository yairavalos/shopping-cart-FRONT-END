// Variables Declaration that are Global

const API_URL = "http://localhost:8000/";

// Store GET Response
let myJSonList = []

// DOM Manipulation
let myForm = document.getElementById("loginForm")
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
  
        if (postResponse.ok) {

            const dataResult = await postResponse.json()
            console.log("Response status is: ", postResponse.status)
            console.log("Response data is: " , dataResult)

            dataResult["status"] = postResponse.statusText

            return dataResult

        } else {
            console.log("POST Response its NOT ok", postResponse.statusText)
        }

    } catch (error) {
        console.log("Error from postAPIData: ", error)
        console.log("postResponse Status: ", postResponse.statusText)
    }
}


const generateUserLogin = async() => {

    let myJSonUser = {
        username: myForm.querySelector("#floatingInput").value,
        password: myForm.querySelector("#floatingPassword").value
    }

    try{

        loginResponse = await postAPIData("api/login/", myJSonUser)
        console.log("generateUserLogin() Status: ", loginResponse.status)

        if(loginResponse.status == "OK"){

            localStorage.setItem("userID", loginResponse.id)
            localStorage.setItem("username", loginResponse.user)
            localStorage.setItem("token", loginResponse.token)

            myModal._dialog.querySelector(".btn-secondary").classList.value = "btn btn-secondary d-none"
            myModal._dialog.querySelector(".btn-primary").classList.value = "btn btn-primary"
            myModal._dialog.querySelector(".message-status").innerText = `Hola ${loginResponse.user} te estabamos esperando !!!`

        } else {
            myModal._dialog.querySelector(".btn-primary").classList.value = "btn btn-primary d-none"
            myModal._dialog.querySelector(".btn-secondary").classList.value = "btn btn-secondary"
            myModal._dialog.querySelector(".message-status").innerText = "Algo salio mal por favor revisa tus datos"
            console.log("generateUserLogin() Status is not OK")
        }

    } catch (error) {
        myModal._dialog.querySelector(".btn-primary").classList.value = "btn btn-primary d-none"
        myModal._dialog.querySelector(".btn-secondary").classList.value = "btn btn-secondary"
        myModal._dialog.querySelector(".message-status").innerText = "Algo salio mal por favor revisa tus datos"
        console.log("generateUserLogin() Error: ", error)
    }
}


myForm.addEventListener("submit", (event) => {

    event.preventDefault()
    event.stopPropagation()

    console.log("Event Listener: ", event)

    myModal.show()
    generateUserLogin()
    

})

