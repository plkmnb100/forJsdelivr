$(document).ready(function() {
    const sessid = localStorage.getItem('sessid');
    if (sessid) {
        location.href = "/order";
    }
})

$(".login-btn").click(function(){
    const username = $(".user-id").val();
    const password = $(".user-password").val();

    $.ajax({
        url: "/api/v1/login",
        method: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            username: username,
            password: password
        }),
        error: function(jqXHR, textStatus, errorThrown) {
            const error = jQuery.parseJSON(jqXHR.responseText);
            nativeToast({
                message: error.detail,
                type: "error",
                edge: true,
                closeOnClick: true
            })
        },
        success: function(data) {
            localStorage.setItem("sessid", data.sessid);
            location.href = "/order";
        }
    });
})