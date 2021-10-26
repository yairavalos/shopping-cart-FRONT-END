
// Variables Declaration that are Global
const API_URL = "http://localhost:8000/";
let myGrandTotal = 0
let jobResponse = []

// Local Storage Retrieve
let myCatalog = JSON.parse(localStorage.catalog)
let myShoppingCart = JSON.parse(localStorage.ShoppingCart)

// DOM Manipulation
let myContainerMsg = document.getElementById("containerMsg")
let myShoppingTable = document.getElementById("tableShoppingList")

// Modal -> On-hold !!
var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
    keyboard: false
  })


// Ajax Standard Retrieve Comms

const retrieveAPIData = async(path, queryParam = "") => {

    let urlPath

    if (queryParam == "") {
        urlPath = API_URL + path
    } else {
        urlPath = API_URL + path + queryParam
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
    console.log("postAPIData() posting this: ", postData)

    try{

        const postResponse = await fetch(`${urlPath}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            mode:'cors',
            body: JSON.stringify(postData)
        })
  
        console.log("postResponse Fetch in progress ....")
        //if (postResponse.ok) {  // No hay un issue aquí ??

        const dataResult = await postResponse.json()
        console.log("Response status is: ", postResponse.status)
        console.log("Response data is: " , dataResult)

            //dataResult["status"] = postResponse.statusText // No hay un issue aquí ??

        return dataResult

        //} else {
            console.log("POST Response its NOT ok", postResponse.statusText)
        //}

    } catch (error) {
        console.log("Error from postAPIData: ", error)
        console.log("postResponse Status: ", postResponse.statusText)
    }
}


function createAlertMsgItem(){
    
    myMsgItem = document.createElement("div")
    myMsgItem.innerHTML = 
    `<div class="alert alert-primary d-flex align-items-center" role="alert">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
            <use xlink:href="#exclamation-triangle-fill" />
        </svg>
        <div>
            An example warning alert with an icon
        </div>
    </div>`

    myContainerMsg.append(myMsgItem)
}


function createSucessMsgItem(msgText){

    myMsgItem = document.createElement("div")
    myMsgItem.innerHTML = 
    `<div class="alert alert-success d-flex align-items-center" role="alert">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
            <use xlink:href="#check-circle-fill" />
        </svg>
        <div>
            ${msgText}
        </div>
    </div>`

    myContainerMsg.append(myMsgItem)

}


function createListItem(posInt, jsonItem, qtyInt){

    let myRowItem = document.createElement("tr")
    
    myRowItem.innerHTML = 
    `<th scope="row">${posInt}</th>
        <td>${jsonItem.product.product_vendor.vendor_company_name}</td>
        <td>${jsonItem.product.product_part_number}</td>
        <td>${jsonItem.product.product_description}</td>
        <td>$ ${jsonItem.product.product_unit_price} usd</td>
        <td>${qtyInt}</td>
        <td>$ ${jsonItem.product.product_unit_price * qtyInt} usd</td>`

    myGrandTotal += jsonItem.product.product_unit_price * qtyInt

    return myRowItem

}


function printShoppingList(){

    let counter = 0

    for(let catalogItem of myCatalog){
        for(let shoppingItem of myShoppingCart){
            if(catalogItem.product.id == shoppingItem.user_product){
        
                counter += 1
                myItem = createListItem(counter, catalogItem, shoppingItem.user_product_qty)
                console.log("myRowItem", myItem )
                myShoppingTable.append(myItem)
        
            }
        }
    }

    document.querySelector("table").querySelector("#grandTotal").innerText = `$ ${myGrandTotal} usd`

}


const retrieveUserPO = async() => {

    try{

        jobResponse = await retrieveAPIData("api/users/purchase_order/", `?ordering=-id&search=${localStorage.userID}`)
        localStorage.setItem("userJobID", jobResponse[0].id)
        
        createSucessMsgItem(`Retrieved PO with Job Id is: ${localStorage.userJobID}`)

    } catch (error) {
        console.log("retrieveUserPO() Error: ", console.error())
        createAlertMsgItem(`Retrieve PO Error is: ${error.message}`)
    }    

}


const generateUserPO = async() => {

    localStorage.setItem("POStatus","Launched")

    try{

        let myJSonJob = {
            user_profile: parseInt(localStorage.userID),
            user_job_status: 1 
        }

        jobResponse = await postAPIData("api/users/purchase_order/generate_job/", myJSonJob)
        console.log("generateUserPO() Status: ", jobResponse.status)

        if(jobResponse.length > 0){

            localStorage.setItem("userJobID", jobResponse.id)
            createSucessMsgItem(`Generated PO with Job Id is: ${localStorage.userJobID}`)

        } else {
            console.log("generateUserPO() Status is not OK")
            createAlertMsgItem("Response status is not OK")
        }

    } catch (error) {
        console.log("generateUserPO() Error: ", error)
        createAlertMsgItem(error.message)
    }
}


window.addEventListener("load", (event) => {

    event.preventDefault()

    try{
        myCatalog = JSON.parse(localStorage.catalog)
        myShoppingCart = JSON.parse(localStorage.ShoppingCart)
    
        printShoppingList()
    
    
        if(!localStorage.userJobID && !localStorage.POStatus){
    
            generateUserPO()
    
        } else if (!localStorage.userJobID && localStorage.POStatus == "Launched") {
            
            retrieveUserPO()
        
        } else if (localStorage.userJobID && localStorage.POStatus) {
    
            createSucessMsgItem(`Stored PO Job Id is: ${localStorage.userJobID}`)
    
        }
    
    } catch (error) {
        console.log("Window Error Messagage: ", error)
    }    

})


// Algorithm

// Load data from storage
// prind data into table
// Confirm and generate PO job id
// retrieve PO job id
// insert job id into shopping_cart json
// post shopping cart to django