
// Variables Declaration that are Global
const API_URL = "http://localhost:8000/";
let myGrandTotal = 0

// Local Storage Retrieve
let myCatalog = JSON.parse(localStorage.catalog)
let myShoppingCart = JSON.parse(localStorage.ShoppingCart)

// DOM Manipulation
let btnPO = document.getElementById("generatePO")
let myShoppingTable = document.getElementById("tableShoppingList")
var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
    keyboard: false
  })

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
        //console.log("catalogItem", catalogItem)
        for(let shoppingItem of myShoppingCart){
            //console.log("shoppingItem", shoppingItem)
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

            myModal._dialog.querySelector(".btn-secondary").classList.value = "btn btn-secondary d-none"
            myModal._dialog.querySelector(".btn-primary").classList.value = "btn btn-primary"
            myModal._dialog.querySelector(".message-status").innerText = `Excelente Job ID: ${jobResponse.id} se ha generado !!!`

        } else {
            myModal._dialog.querySelector(".btn-primary").classList.value = "btn btn-primary d-none"
            myModal._dialog.querySelector(".btn-secondary").classList.value = "btn btn-secondary"
            myModal._dialog.querySelector(".message-status").innerText = "Algo salio mal por favor revisa tus datos o tu conexión"
            console.log("generateUserPO() Status is not OK")
        }

    } catch (error) {
        myModal._dialog.querySelector(".btn-primary").classList.value = "btn btn-primary d-none"
        myModal._dialog.querySelector(".btn-secondary").classList.value = "btn btn-secondary"
        myModal._dialog.querySelector(".message-status").innerText = "Algo salio mal por favor revisa tus datos o tu conexión"
        console.log("generateUserPO() Error: ", error)
    }
}



btnPO.addEventListener("click", (event) => {

    //event.preventDefault()
    //event.stopPropagation()
    //event.stopImmediatePropagation()

    //myModal.show()
    generateUserPO()

})

window.addEventListener("load", () => {

    myCatalog = JSON.parse(localStorage.catalog)
    myShoppingCart = JSON.parse(localStorage.ShoppingCart)

    printShoppingList()
})


// Algorithm

// Load data from storage
// prind data into table
// Confirm and generate PO job id
// retrieve PO job id
// insert job id into shopping_cart json
// post shopping cart to django