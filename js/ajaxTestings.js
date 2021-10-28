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
        headers:{"Content-Type": "application/json;charset=UTF-8"}
    })
    .then(response => {
        return response.text()
    })
    .catch((error)=>{"createAPIData Error: ", console.log(error)})

}

const createAPIData3 = async (requestPath, payload) => {

    const postResponse = await fetch(requestPath, {
        method: "POST",
        headers: {
            "Content-Type":"application/json;charset=UTF-8"
        },
        body: JSON.stringify(payload)
    })

    let jsonResponse = await postResponse.json()
    
    return jsonResponse

}


// Processing Functions

function postDataFunction(dataInt1, dataInt2){

    let jsonData = {
        "user_profile": dataInt1,
        "user_job_status": dataInt2
    }

    let postResponse = createAPIData3("http://localhost:8000/api/users/purchase_order/generate_job/", jsonData)
    postResponse.then((jsonResponse)=>{console.log("postDataFunction() result: ", jsonResponse)})
    postResponse.then((jsonResponse)=>{localStorage.setItem("jsonResponse",JSON.stringify(jsonResponse))})
    postResponse.catch((err)=>{console.log("postDataFunction() error: ", err)})

}


// Event Handleres



// Main Script

