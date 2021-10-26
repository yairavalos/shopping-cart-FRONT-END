
// Variables Declaration that are Global
const API_URL = "http://localhost:8000/";
let myGrandTotal = 0
let bomResponse = []

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
  
        console.log("postResponse Fetch in progress ....")

        const dataResult = await postResponse.json()
        console.log("Response status is: ", postResponse.status)
        console.log("Response data is: " , dataResult)
       
        return dataResult

    } catch (error) {
        console.log("Error from postAPIData: ", error)
        return false
    }
}


function createAlertMsgItem(msgText){

    myContainerMsg.innerHTML = 
    `<div class="alert alert-primary d-flex align-items-center" role="alert">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
            <use xlink:href="#exclamation-triangle-fill" />
        </svg>
        <div>
            ${msgText}
        </div>
    </div>`

}


function createSucessMsgItem(msgText){

    myContainerMsg.innerHTML = 
    `<div class="alert alert-success d-flex align-items-center" role="alert">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
            <use xlink:href="#check-circle-fill" />
        </svg>
        <div>
            ${msgText}
        </div>
    </div>`

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

const retrieveUserBOM = async() => {

    bomResponse = await retrieveAPIData("api/users/purchase_order/", `?ordering=-id&search=${localStorage.userID}`)
    localStorage.setItem("userJobID", jobResponse[0].id)

    if(bomResponse.length > 0){
        
        createSucessMsgItem(`Retrieved PO with Job Id is: ${localStorage.userJobID}`)
        return true

    } else {

        console.log("retrieveUserPO() Error: ", console.error())
        createAlertMsgItem(`Retrieve PO Error is: ${error.message}`)

        return false
    }

}


const generateUserBOM = async() => {

    localStorage.setItem("BOMStatus","Launched")

    if(localStorage.userJobID && localStorage.POStatus){
        
        for(let itemBOM of myShoppingCart){
            itemBOM["user_job"] = parseInt(localStorage.userJobID)
            itemBOM.user_product = parseInt(itemBOM.user_product) 
        }
    
        bomResponse = await postAPIData("api/users/shopping_cart/generate_bom/", myShoppingCart)

        if(bomResponse.length > 0){
            createSucessMsgItem(`Generated PO with Job Id is: ${localStorage.userJobID} with ${ShoppingCart.length}`)
            return true

        } else {
            createAlertMsgItem("generateUserBOM() last Status is NOT created")
            return false
        }

    } else {
        console.log("generateUserBOM() couldn´t complete operation, check if conditions")
        return false
    }

}


window.addEventListener("load", (event) => {

    let statusPO

    myCatalog = JSON.parse(localStorage.catalog)
    myShoppingCart = JSON.parse(localStorage.ShoppingCart)

    if(!localStorage.BOMStatus){
        statusPO = generateUserBOM()
    }

    if(!statusPO){ 
        setTimeout(()=>{retrieveUserBOM()},900)
    }

    createPOHeader()
    printShoppingList()

})


// Containment
//
// Avoid Auto Trigger and Auto-Loading
// Fixed Alert Area
// Manual trigger if something fails
// Do a 2nd shoot for a retrieval just in case post fetch its cancelled
// Use flags to control page states, specially to run just the first time C.I.
// Avoid try/catch chaining instead contain behavior and handle messages
// Use try/catch over things you don´t have control
