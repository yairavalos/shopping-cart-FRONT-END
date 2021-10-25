
const API_URL = "http://localhost:8000/";

// Ajax Standard Retrieve Comms

const retrieveAPIData = async(path) => {

    let urlPath = API_URL + path
    console.log("retrieveAPIData() connecting to: ", urlPath)

    try {
        const response = await fetch(`${urlPath}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json()
        console.log("Response status is: ", response.status)
        console.log("Response data is: " , data)

        return data

    } catch (error) {
        console.log(error)
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


window.addEventListener("load", () => {

    localStorage.clear()

})
