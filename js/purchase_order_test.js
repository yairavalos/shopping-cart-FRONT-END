
// Variables Declaration that are Global

const API_URL = "http://localhost:8000/";

// Store GET Response
let myJSonList = []
// Store POST Response
let myJSonListCreate = []

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
    
            myJSonListCreate = dataResult

            return dataResult

        } else {
            console.log("POST Response its NOT ok", postResponse.statusText)
        }

    } catch (error) {
        console.log("Error from postAPIData: ", error)
        console.log("postResponse Status: ", postResponse.statusText)
    }
}

function generateJSON (userInt, statusInt, dateStr) {

    let myJSonDict = {
        "user_profile": userInt,
        "user_job_status": statusInt,
        "user_job_delivery_date": dateStr
    }

    return myJSonDict

}

// Document Objects Printing Functions

const retrievePurchaseData = async () => {

    myJSonList = await retrieveAPIData("api/users/purchase_order/", "1")

}

const createPurchaseData = async (dataToPOST) => {

    try{
        myJSonListCreate = await postAPIData("api/users/purchase_order/generate_job/", dataToPOST)

    } catch (error) {
        console.log("createPurchaseData Error: ", error)
    }  

}

function myTest(myParam){
    console.log("Vengo de fuera y que ??...", myParam)
}

// Main Script

window.addEventListener("load", () => {

    retrievePurchaseData()

})

