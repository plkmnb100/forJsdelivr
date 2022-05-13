$(document).ready(function() {
    const sessid = localStorage.getItem('sessid');
    if (sessid) {
        location.href = "/order";
    }
})

$(".register-btn").click(function(){
    const username = $(".user-id").val();
    const password = $(".user-password").val();
    const password_repeat = $(".passwd-rpt").val();

    if (password !== password_repeat) {
        nativeToast({
            message: "비밀번호 확인이 일치하지 않습니다.",
            type: "error",
            edge: true,
            closeOnClick: true
        })
        return
    }

    $.ajax({
        url: "/api/v1/users",
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