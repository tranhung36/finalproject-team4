const searchList = document.querySelector('#search-list')
const searchInput = document.querySelector('#search-input')

const loadValue = async () => {
    try {
        const searchJsonValue = await fetch('http://localhost:8080/sellerPage/searchValue')
        const searchStringValue = await searchJsonValue.json()
        const productString = searchStringValue.product
        const abc = productString
        searchInput.oninput = (e) => {
            const searchInputValue = e.target.value
            const filterSearchValue = abc.filter(value => {
                if(searchInputValue === ''){
                    return ''
                }else{
                    return value.name.includes(searchInputValue)
                }
            })
            if (filterSearchValue != []) {
                const htmlString = filterSearchValue.slice(0, 10).map(item => {
                    return `<li class="search-item">
                                <a href="${item._id}">
                                    <img src= "./../../images/${item.thumbnail}" alt="product Image" >
                                    <div class="item-info">
                                        <p>${item.name}</p>
                                        <p>${item.price}</p>
                                    </div>
                                </a>
                            </li>`
                })
                
                searchList.innerHTML = htmlString.join(' ')
            } else {
                const htmlStringg = `<li class="searchItem"></li>`
                searchList.innerHTML = htmlStringg
            }
        }
    } catch (error) {
        console.log(error);
    }
}
loadValue();
