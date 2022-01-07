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