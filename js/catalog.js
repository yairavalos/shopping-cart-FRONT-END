
// Variables Declaration that are Global

const API_URL = "http://localhost:8000/";
let myJSonList = []

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
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData)
        })
  
        const dataResult = await postResponse.json()
        console.log("Response status is: ", postResponse.status)
        console.log("Response data is: " , dataResult)
    
        return dataResult

    } catch (error) {
        console.log("Error from postAPIData: ", error)
    }
}


// Document Objects Printing Functions

const retrieveCatalogData = async () => {

    myJSonList = await retrieveAPIData("api/shop/product_stock/")

}

// Main Script

window.addEventListener("load", () => {

    retrieveCatalogData()

})

