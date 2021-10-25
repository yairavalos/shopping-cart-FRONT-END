
// Variables Declaration that are Global

const API_URL = "http://localhost:8000/";

// Store GET Response
let myJSonList = []

let myShoppingTable = document.getElementById("tablePOList")
let myGrandTotal = 0

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

function createListItem(posInt, jsonItem){

    let myRowItem = document.createElement("tr")
    
    myRowItem.innerHTML = 
        `<th scope="row">${posInt}</th>
        <td>${jsonItem.user_profile.username}</td>
        <td>Job ${jsonItem.id}</td>
        <td>${jsonItem.user_job_status.process_step}</td>
        <td>${jsonItem.user_job_purchase_date}</td>
        <td>${jsonItem.user_job_delivery_date}</td>`

    return myRowItem

}


function printPOList(){

    let counter = 0

    for(let jsonItem of myJSonList){
        counter += 1
        myShoppingTable.append(createListItem(counter, jsonItem))
    }
    
}

const retrievePurchaseData = async () => {

    myJSonList = await retrieveAPIData("api/users/purchase_order/", "3")
    printPOList()
    
}


window.addEventListener("load", () => {

    retrievePurchaseData()
    
})

