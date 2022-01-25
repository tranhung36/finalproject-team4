const searchList = document.querySelector('#search-list')
const searchInput = document.querySelector('#search-input')
const serverPages = document.querySelector('.server-pg')
const clientPage = document.querySelector('.client-pg')
if(clientPage){
    clientPage.style.display = 'none'
}
const loadValue = async () => {
    try {
        // call api
        const searchJsonValue = await fetch('http://localhost:8080/search/searchValue')
        const searchStringValue = await searchJsonValue.json()
        const productString = searchStringValue.product
        // get product 
        searchInput.oninput = (e) => {
            const searchInputValue = e.target.value.toLowerCase()
            const filterSearchValue = productString.filter(value => {
                return searchInputValue === '' ? '' : value.name.toLowerCase().includes(searchInputValue)
            })
            // render search bar
            let htmlString = filterSearchValue.slice(0, 10).map(item => {
                const price = `${item.price.toLocaleString()}`
                return `<li class="search-item">
                            <a href="/products/${item.slug}">
                                <img src= "./../../images/${item.thumbnail}" alt="product Image" >
                                <div class="item-info">
                                    <p>${item.name}</p>
                                    <p>${price}đ</p>
                                </div>
                            </a>
                        </li>`
            })
            searchList.innerHTML = htmlString.join(' ')
        }
    } catch (error) {
        console.log(error);
    }
}
loadValue();

const loadSearchValue = async (key) => {
    const searchValue = await fetch(`http://localhost:8080/search/searchApi?key=${key}`)
    const searchStringValue = await searchValue.json()
    const searchData = searchStringValue.data
    const selections = document.querySelector('.sp-sort-by')
    selections.onchange = (e) => {
        if (e.target.value == 'priceAsc') {
            const sort = searchData.sort((a, b) => a.price > b.price ? 1 : -1)
            sortProduct(sort, searchData)
        } if (e.target.value == 'priceDesc') {
            const sort = searchData.sort((a, b) => a.price < b.price ? 1 : -1)
            sortProduct(sort, searchData)
        } if (e.target.value == 'dateDesc') {
            const sort = searchData.sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1)
            sortProduct(sort, searchData)
        } else {
            return 0
        }
    }
}

const sortProduct = (sort, searchData) => {
    serverPages.style.display = 'none'
    clientPage.style.display = 'block'
    const page = document.querySelector('.client-pg ul')
    const pages = Math.ceil(searchData.length / 8)
    let html = ``
    for (let i = 0; i < pages; i++) {
        html += `<li class="page-item"><input type="radio" hidden value="${i + 1}" name="radio" class="page-link radio-pg"></li>`
    }
    page.innerHTML = html
    for (let i = 0; i < pages; i++) {
        html += `<li class="page-item"><a class="page-link btn-page">${i + 1}</a></li>`
    }
    page.innerHTML = html
    const firstSelected = document.querySelector('.radio-pg')
    firstSelected.checked = true
    if(firstSelected.checked == true){
        const productHTML = sort.slice(8 * (1 - 1), 8 * (1)).map(s => {
            return `
            <div class="col-xl-3 col-lg-4 col-sm-6">
                <div class="product text-center">
                  <div class="position-relative mb-3">
                    <div class="badge text-white bg-"></div><a class="d-block" href="detail.html"><img class="img-fluid w-100"
                        src="/../images/${s.thumbnail}" alt="..."></a>
                    <div class="product-overlay">
                      <ul class="mb-0 list-inline">
                        <li class="list-inline-item m-0 p-0"><a class="btn btn-sm btn-outline-dark" href="#!"><i
                              class="far fa-heart"></i></a></li>
                        <li class="list-inline-item m-0 p-0"><a class="btn btn-sm btn-dark" href="/cart">Add to cart</a>
                        </li>
                        <li class="list-inline-item me-0"><a class="btn btn-sm btn-outline-dark" href="#productView"
                            data-bs-toggle="modal"><i class="fas fa-expand"></i></a></li>
                      </ul>
                    </div>
                  </div>
                  <h6> <a class="reset-anchor" href="detail.html">${s.name}</a></h6>
                  <p class="small text-muted">${s.price}</p>
                </div>
            </div>
            `
        })
        document.querySelector('.sp-right .row ').innerHTML = productHTML.join(' ')
    }
    const pageValue = document.querySelectorAll('.client-pg ul li a')
    pageValue.forEach(page => {
        page.onclick = () => {
            let value =  Number(page.innerText) 
            const productHTML = sort.slice(8 * (value - 1), 8 * (value)).map(s => {
                return `
                <div class="col-xl-3 col-lg-4 col-sm-6">
                    <div class="product text-center">
                      <div class="position-relative mb-3">
                        <div class="badge text-white bg-"></div><a class="d-block" href="detail.html"><img class="img-fluid w-100"
                            src="/../images/${s.thumbnail}" alt="..."></a>
                        <div class="product-overlay">
                          <ul class="mb-0 list-inline">
                            <li class="list-inline-item m-0 p-0"><a class="btn btn-sm btn-outline-dark" href="#!"><i
                                  class="far fa-heart"></i></a></li>
                            <li class="list-inline-item m-0 p-0"><a class="btn btn-sm btn-dark" href="/cart">Add to cart</a>
                            </li>
                            <li class="list-inline-item me-0"><a class="btn btn-sm btn-outline-dark" href="#productView"
                                data-bs-toggle="modal"><i class="fas fa-expand"></i></a></li>
                          </ul>
                        </div>
                      </div>
                      <h6> <a class="reset-anchor" href="detail.html">${s.name}</a></h6>
                      <p class="small text-muted">${s.price}</p>
                    </div>
                </div>
                `
            })
            document.querySelector('.sp-right .row ').innerHTML = productHTML.join(' ')
        }
    })

}
if(document.querySelector('.key')){
    loadSearchValue(document.querySelector('.key').innerText)
}

