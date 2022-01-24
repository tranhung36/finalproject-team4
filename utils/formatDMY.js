const formatDMY = (dateString) => {
    let d = new Date(dateString)
    let date = d.getDate()
    let month = d.getMonth();
    let year = d.getFullYear()
    return `${date}/${month + 1}/${year}`
}
module.exports = formatDMY