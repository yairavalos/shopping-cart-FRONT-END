
const API_URL = "http://localhost:8000/";

// Ajax Standard Retrieve Comms

const retrieveAPIData = async() => {

    try {
        const response = await fetch(`${API_URL}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json()
        console.log(data)

        return data

    } catch (error) {
        console.log(error)
    }

}

// Ajax Standard Post-Create Comms

const postAPIData = async(postData) => {

    try{

        const data = await fetch(`${API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData)
        })
    
        const dataResult = await data.json()
        localStorage.setItem("user_planner_id", dataResult.id)
    
        return dataResult

    } catch (error) {
        console.log("Error from postAPIData: ", error)
    }
}

