const selectedDropdowns = document.querySelectorAll('.dropdown-select')
const dropdownItems = document.querySelectorAll('.dropdown-select .sub-sidebar__control')

selectedDropdowns.forEach(selectedDropdown => {
    selectedDropdown.onclick = () => {

        const showDropdowns = document.querySelectorAll('.sub-sidebar__control')
        const showDropdownsI = document.querySelectorAll('.dropdown-select a p i')

        showDropdowns.forEach(showDropdown => {
            if (selectedDropdown.contains(showDropdown)) {

                showDropdown.classList.toggle('block-sidebar')

                showDropdownsI.forEach(showDropdownI => {
                    if (selectedDropdown.contains(showDropdownI)) {

                        showDropdownI.classList.toggle('rolateArrow')
                    }
                })
            }
        })
    }
})

const showNavAside = () => {
    const btnNavAside = document.querySelector('.btn-nav-aside')
    const mainSideBar = document.querySelector('.main-sidebar')
    const sidebarContent = document.querySelector('.sidebar-content')
    const btnCloseSideBar = document.querySelector('.close-sidebar')
    if(btnNavAside){
        btnNavAside.onclick = () => {
            mainSideBar.style.display = 'flex'
        }
        btnCloseSideBar.onclick = () => {
            mainSideBar.style.display = 'none'
        }
    }
}
showNavAside()

const checkValueImage = () => {
    const imageValue = document.querySelector('#image')
    const imageValues = document.querySelector('#images')
    const handleButton = document.querySelector('#handleButton')
    if (handleButton) {
        handleButton.onclick = (e) => {
            if (imageValue.value == '') {
                e.preventDefault()
                alert('Chưa nhập thumbnail cho sản phẩm')
            }
            if (imageValues.files.length < 2) {
                e.preventDefault()
                alert('Images cần 2 ảnh trở lên')
            }
        }
    }
}
// CRUD-page handle delete Button
const deleteBtns = document.querySelectorAll('.js-delete-alert')
if (deleteBtns) {
    deleteBtns.forEach(deleteBtn => {
        deleteBtn.onclick = (e) => {
            const result = confirm("Bạn có muốn xóa không?");
            if (result) {
                alert("Xóa thành công");
            } else {
                e.preventDefault()
            }
        }
    })
}
checkValueImage()
