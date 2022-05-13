const category_mother = $(".category-select");
const quantity_mother = $(".quantity-mother");
const product_mother = $(".prod-select");
const quantity_select = $(".quantity-select");
var services;

function update_quantity(){
    const service = services.filter(function(obj){
        if (obj.id == product_mother[0].value) {
            return true;
        }else{
            return false;
        }
    })[0]

    quantity_mother.empty();
    const child = document.createElement("input");
    child.setAttribute("oninput", "this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\\..*)\\./g, '$1');")
    if (service.minimum == service.maximum){
        child.setAttribute("class", "form-control quantity-select");
        child.setAttribute("disabled", "");
        child.setAttribute("value", service.minimum);
    }else{
        child.setAttribute("class", "form-control quantity-select");
        child.setAttribute("placeholder", `최소 ${service.minimum}개,  최대 ${service.maximum}개`);
    }
    quantity_mother[0].appendChild(child);
}

function update_products(){
    const category = category_mother[0].value
    const services_list = services.filter(function(obj){
        if (obj.category == category) {
            return true;
        }else{
            return false;
        }
    })
    product_mother.empty();
    services_list.forEach(function(obj){
        const child = document.createElement("option");
        child.setAttribute("value", obj.id)
        child.innerHTML = obj.name;
        product_mother[0].appendChild(child);
    })
}

function update_labels(){
    const service = services.filter(function(obj){
        if (obj.id == product_mother[0].value) {
            return true;
        }else{
            return false;
        }
    })[0]

    const service_price = service.price
    $(".service-price")[0].innerHTML = `서비스 가격: 개당 ${service_price}원`;
}

$(document).ready(function() {
    const sessid = localStorage.getItem('sessid');
    if (!sessid) {
        location.href = "/login";
    }

    $.ajax({
        url: "/api/v1/services",
        method: "GET",
        headers: {"Authorization": sessid},
        error: function(jqXHR, textStatus, errorThrown) {
            jQuery.parseJSON(jqXHR.responseText);
            localStorage.removeItem('sessid');
            location.href = "/login";
        },
        success: function(data) {
            data.categories.forEach(function(element){
                const child = document.createElement("option");
                child.setAttribute("value", element)
                child.innerHTML = element;
                category_mother[0].appendChild(child);
            })

            services = data.services;
            update_products();
            update_quantity();
            update_labels();
            $('.loading').hide();
        }
    });

    category_mother.change(function() {
        update_products();
        update_quantity();
        update_labels();
    })

    product_mother.change(function() {
        update_quantity();
        update_labels();
    })
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