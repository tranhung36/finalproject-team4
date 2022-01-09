const searchList = document.querySelector('#search-list')
const searchInput = document.querySelector('#search-input')

const loadValue = async () => {
    try {
        const searchJsonValue = await fetch('http://localhost:3000/sellerPage/searchValue')
        const searchStringValue = await searchJsonValue.json()
        const productString = searchStringValue.product

        searchInput.oninput = (e) => {
            const searchInputValue = e.target.value
            console.log(searchInputValue);
            const filterSearchValue = productString.filter(value => {
                return value.name.includes(searchInputValue)
            })
            console.log(filterSearchValue);
            if (filterSearchValue.length > 0) {
                const htmlString = filterSearchValue.map(item => {
                    return `<li class="searchItem">
                    <a href="">
                    </a>
                    </li>`
                }).join(' ')
                searchList.innerHTML = htmlString
            } else {
                const htmlString = `<li class="searchItem"><h1></h1></li>`
                searchList.innerHTML = htmlString
            }
        }
    } catch (error) {
        console.log(error);
    }
}
loadValue();
