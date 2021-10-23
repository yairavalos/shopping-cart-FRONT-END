
// Variables Declaration that are Global

const API_URL = "http://localhost:8000/";
let myJSonList = []
let myPaginationContainer = document.getElementById("paginationContainer")
let myCardContainer = document.getElementById("myCardContainer")

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



// Document Objects Printing Functions

function createCard(jsonItem){

    myCard = document.createElement("div.col")

    myCard.innerHTML = `<div class="card shadow-sm" id=${jsonItem.product.id} data-product_id= ${jsonItem.product.id}>

    <div class="card-header text-center d-flex justify-content-between">
      <div>
        <h6>Category: ${jsonItem.product.product_category}</h6>
      </div>
      <div>
        <h6>Vendor: ${jsonItem.product.product_vendor.vendor_company_name.split(" ",1)}</h6>
      </div>
    </div>

    <img src="${jsonItem.product.product_img_link}" class="bd-placeholder-img card-img-top" width="100%" height="225"
      alt="product image">

    <div class="card-body">

      <div class="d-flex justify-content-between">
        <div>
          <h6 class="card-title d-inline-flex px-2 text-muted">PN: ${jsonItem.product.product_part_number}</h6>
        </div>
        <div>
          <h6 class="card-subtitle d-inline-flex px-2 mb-2 text-muted">Price: $ ${jsonItem.product.product_unit_price} USD</h6>
        </div>
      </div>
      <hr>
      <div>
        <div>
          <p class="card-text text-center card_descrip">${jsonItem.product.product_description}</p>
        </div>
        <div class="text-center pt-3">
          <small class="text-muted">Stock: ${jsonItem.product_stock_qty} piece(s) left, Hurry Up !!</small>
        </div>
      </div>

    </div>

    <div class="card-footer">

      <div class="d-flex justify-content-between align-items-center">
        <div class="btn-group">
          <button type="button" class="btn btn-sm btn-outline-secondary">
            <h5>+</h5>
          </button>
          <button type="button" class="btn btn-sm btn-outline-secondary">
            <h5>-</h5>
          </button>
          <small class="text-muted ms-3 pt-2">I want: 9 piece(s)</small>
        </div>
        <div>
          <a href="#" class="btn btn-primary">Add to Cart</a>
        </div>
      </div>

    </div>

  </div>`

  return myCard

}

function printCatalog(){

    for(let item of myJSonList){
        myCardContainer.append(createCard(item))
    }
    
}

const retrieveCatalogData = async () => {

    myJSonList = await retrieveAPIData("api/shop/product_stock/")
    printCatalog()

}

// Main Script

myPaginationContainer.addEventListener("click", (event)=> {

    console.log("Pagination Event detail: ", event)
    console.log("Pagination Target is:", event.target)
    console.log("Target id is: ", event.target.id)

})


window.addEventListener("load", () => {

    retrieveCatalogData()

})

