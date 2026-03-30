// Dark Mode Add
$('.modes span:first-child, .dark-light p:first-child').click(function () {
    localStorage.setItem('dark', 'dark')
    location.reload()
})
$('.modes span:last-child, .dark-light p:last-child').click(function () {
    localStorage.removeItem('dark')
    location.reload()
})
if (localStorage.getItem('dark') === 'dark') {
    $('#dark').attr('href', '/css/dark.css')
}
// Hide and Show Border in Dashboard Page
if (localStorage.getItem('dark')) {
    $('.dashboard-titles .nav-link').not($('.dashboard-titles .nav-pills .nav-link:last-child')).click(function () {
        $('.left-dasboard').css('border-bottom', '1px solid #404040')
    })
} else {
    $('.dashboard-titles .nav-link').not($('.dashboard-titles .nav-pills .nav-link:last-child')).click(function () {
        $('.left-dasboard').css('border-bottom', '1px solid #eee')
    })
}
