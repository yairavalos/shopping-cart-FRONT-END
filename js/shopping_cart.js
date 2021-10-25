
// Variables Declaration that are Global
const API_URL = "http://localhost:8000/";
let myGrandTotal = 0
let jobResponse = []

// Local Storage Retrieve
let myCatalog = JSON.parse(localStorage.catalog)
let myShoppingCart = JSON.parse(localStorage.ShoppingCart)

// DOM Manipulation
let btnPO = document.getElementById("generatePO")
let successMsg = document.getElementById("successMsg")
let alertMsg = document.getElementById("alertMsg")
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
  
        if (postResponse.ok) {

            const dataResult = await postResponse.json()
            console.log("Response status is: ", postResponse.status)
            console.log("Response data is: " , dataResult)

            dataResult["status"] = postResponse.statusText

            return dataResult

        } else {
            console.log("POST Response its NOT ok", postResponse.statusText)
        }

    } catch (error) {
        console.log("Error from postAPIData: ", error)
        console.log("postResponse Status: ", postResponse.statusText)
    }
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
        
        successMsgFunc(`Retrieved PO with Job Id is: ${localStorage.userJobID}`)

    } catch (error) {
        console.log("retrieveUserPO() Error: ", console.error())
        alertMsgFunc(`Retrieve PO Error is: ${error.message}`)
    }    

}


const generateUserBOM = async() => {

    try {

        if(localStorage.userJobID && localStorage.POStatus){

            for(let itemBOM of myShoppingCart){
                itemBOM["user_job"] = parseInt(localStorage.userJobID)
                itemBOM.user_product = parseInt(itemBOM.user_product) 
            }
        
            bomResponse = await postAPIData("api/users/shopping_cart/generate_bom/", myShoppingCart)
            console.log("generateUserBOM() Status: ", bomResponse.status)

            if(jobResponse.status == "Created"){
                successMsgFunc(`Generated PO with Job Id is: ${localStorage.userJobID} with ${ShoppingCart.length}`)
            } else {
                alertMsgFunc("generateUserBOM() last Status is NOT created")
            }

        }

    } catch (error) {

        console.log("generateUserBOM() Error: ", error)
        alertMsgFunc("generateUserBOM() Error")
    }

}


const generateUserPO = async() => {

    try{

        let myJSonJob = {
            user_profile: parseInt(localStorage.userID),
            user_job_status: 1 
        }

        jobResponse = await postAPIData("api/users/purchase_order/generate_job/", myJSonJob)
        console.log("generateUserPO() Status: ", jobResponse.status)

        if(jobResponse.status == "Created"){

            localStorage.setItem("userJobID", jobResponse.id)
            successMsgFunc(`Generated PO with Job Id is: ${localStorage.userJobID}`)

        } else {
            console.log("generateUserPO() Status is not OK")
            alertMsgFunc("Response status is not OK")
        }

    } catch (error) {
        console.log("generateUserPO() Error: ", error)
        alertMsgFunc(error.message)
    }
}

function disabledMsgFunc(){

    successMsg.classList.value = "d-none"
    alertMsg.classList.value = "d-none"

}

function successMsgFunc(textOK){

    alertMsg.classList.value = "d-none"
    successMsg.classList.value = "alert alert-success d-flex align-items-center"
    successMsg.querySelector("#successText").innerText = `Transaction was successfuly done with: ${textOK}`

}

function alertMsgFunc(textError){

    successMsg.classList.value = "d-none"
    alertMsg.classList.value = "alert alert-primary d-flex align-items-center"
    alertMsg.querySelector("#alertText").innerText = `Some problem was found Error: ${textError} , please refresh your page`

}


btnPO.addEventListener("click", (event) => {

    event.preventDefault()

    generateUserBOM()    

})


window.addEventListener("load", () => {

    disabledMsgFunc()

    myCatalog = JSON.parse(localStorage.catalog)
    myShoppingCart = JSON.parse(localStorage.ShoppingCart)

    printShoppingList()

    if(!localStorage.userJobID && !localStorage.POStatus){
        
        localStorage.setItem("POStatus","Launched")

        generateUserPO()

    } else if (!localStorage.userJobID && localStorage.POStatus == "Launched") {

        retrieveUserPO()

    } else if (localStorage.userJobID && localStorage.POStatus) {

        successMsgFunc(`Stored PO Job Id is: ${localStorage.userJobID}`)

    }

})


// Algorithm

// Load data from storage
// prind data into table
// Confirm and generate PO job id
// retrieve PO job id
// insert job id into shopping_cart json
// post shopping cart to django