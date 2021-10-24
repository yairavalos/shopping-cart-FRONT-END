
// Variables Declaration that are Global

const API_URL = "http://localhost:8000/";

let myCatalog = []
let myShoppingCart = []

// Ajax Standard Retrieve Comms

const retrieveAPIData = async(path) => {

    let urlPath = API_URL + path
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
            console.log("Response its NOT ok")
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



// print data

// load data

window.addEventListener("load", () => {

    myCatalog = JSON.parse(localStorage.catalog)
    myShoppingCart = JSON.parse(localStorage.ShoppingCart)

})


// Algorithm

// Load data from storage
// prind data into table
// Confirm and generate PO job id
// retrieve PO job id
// insert job id into shopping_cart json
// post shopping cart to django