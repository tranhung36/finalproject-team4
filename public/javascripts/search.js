const searchList = document.querySelector('#search-list')
const searchInput = document.querySelector('#search-input')

const loadValue = async () => {
    try {
        // call api
        const searchJsonValue = await fetch('http://localhost:8080/sellerPage/searchValue')
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
                            <a href="${item._id}">
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

// CRUD-page handle delete Button
const btnDeleteProduct = document.querySelector('.delete-product')
btnDeleteProduct.onclick = (e) => {
    const result = confirm("Bạn có muốn xóa không?");
    if (result) {
        alert("Xóa thành công");
    } else {
        e.preventDefault()
    }
}