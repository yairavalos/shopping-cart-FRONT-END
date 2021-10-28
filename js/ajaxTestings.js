// Global Variables
const API_URL = "http://localhost:8000/";

let postResponse = ""

// DOM Manipulation



// AJAX Comms
const retrieveAPIData = async(requestPath, payload) => {

    const responseData = await fetch(requestPath,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })

    let responseResult = await responseData.json()
    return responseResult

}

const createAPIData = async(requestPath, payload) => {

    const responseData = fetch(requestPath,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })
    .then(response => {responseResult = response.json()})

    // after await the post was cancelled
    // setTimeOut has no effect because failure goes first
    //let responseResult = await responseData.json() 

    console.log("responseResult is: ", responseResult)

    return responseResult
}

const createAPIData2 = (requestPath, payload) => {

    fetch(requestPath,{
        method:"POST",
        body: JSON.stringify(payload),
        headers:{"Content-Type": "application/json; charset=UTF-8"}
    })
    .then(response => {
        return response.text()
    })
    .then((responseData) => {
        console.log("createAPIData2() result: ", responseData)
    })

}


// Processing Functions

function postDataFunction(dataInt1, dataInt2){

    let jsonData = {
        "user_profile": dataInt1,
        "user_job_status": dataInt2
    }

    const postResponse = createAPIData2("http://localhost:8000/api/users/purchase_order/generate_job/", jsonData)
    console.log("postDataFunction() result ", postResponse)

    return postResponse

}


// Event Handleres



// Main Script

