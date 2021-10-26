
// Variables Declaration that are Global
const API_URL = "http://localhost:8000/";
let myGrandTotal = 0
let jobResponse = []

// Local Storage Retrieve
let myCatalog = JSON.parse(localStorage.catalog)
let myShoppingCart = JSON.parse(localStorage.ShoppingCart)

// DOM Manipulation
let myContainerMsg = document.getElementById("containerMsg")
let myPOTable = document.getElementById("tablePO")
let myShoppingTable = document.getElementById("tableShoppingList")


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

        if (response.ok) { // Maybe so much protection is causing the problem ???
        
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
                'Authorization': `Token ${localStorage.token}`,
                'Content-Type': 'application/json;charset=UTF-8',
            },
            mode:'cors',
            body: JSON.stringify(postData)
        })
  
        //if (postResponse.ok) {

            const dataResult = await postResponse.json()
            console.log("Response status is: ", postResponse.status)
            console.log("Response data is: " , dataResult)

            dataResult["status"] = postResponse.statusText

            return dataResult

        //} else {
          //  console.log("POST Response its NOT ok", postResponse.statusText)
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

function createPOHeader(){

    let myPOTableBody = document.createElement("tbody")

    myPOTableBody.innerHTML = 
        `<tr>
            <th scope="row">User:</th>
            <td>${localStorage.username}</td>
        </tr>
        <tr>
            <th scope="row">Purchase Order:</th>
            <td>${localStorage.userJobID}</td>
        </tr>`

    myPOTable.append(myPOTableBody)

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

    document.querySelector("#grandTotal").innerText = `$ ${myGrandTotal} usd`

}


const generateUserBOM = async() => {

    localStorage.setItem("BOMStatus","Launched")

    try {

        if(localStorage.userJobID && localStorage.POStatus){

            for(let itemBOM of myShoppingCart){
                itemBOM["user_job"] = parseInt(localStorage.userJobID)
                itemBOM.user_product = parseInt(itemBOM.user_product) 
            }
        
            bomResponse = await postAPIData("api/users/shopping_cart/generate_bom/", myShoppingCart)
            console.log("generateUserBOM() Status: ", bomResponse.status)

            if(jobResponse.status == "Created"){
                createSucessMsgItem(`Generated PO with Job Id is: ${localStorage.userJobID} with ${ShoppingCart.length}`)
            } else {
                createAlertMsgItem("generateUserBOM() last Status is NOT created")
            }

        } else {
            console.log("generateUserBOM() couldn´t complete operation, check if conditions")
        }

    } catch (error) {

        console.log("generateUserBOM() Error: ", error)
        createAlertMsgItem("generateUserBOM() Error")
    }

}


window.addEventListener("load", (event) => {

    event.preventDefault()

    try{
        myCatalog = JSON.parse(localStorage.catalog)
        myShoppingCart = JSON.parse(localStorage.ShoppingCart)

        if(!localStorage.BOMStatus){
            generateUserBOM()
        }
        
        createPOHeader()
        printShoppingList()
    
    } catch (error) {
        console.log("Window Error Messgage: ", error)
    }    

})


// Containment
//
// Avoid Auto Trigger and Auto-Loading
// Fixed Alert Area
// Manual trigger if something fails
// Do a 2nd shoot for a retrieval just in case post fetch its cancelled
// Use flags to control page states, specially to run just the first time C.I.