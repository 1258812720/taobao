$(document).ready(function () {
    // start
    "use strict";

    // header component
    $.fn.menu = function (option, data) {
        let _this = $(this).eq(0);
        let open = false;
        let btn_trigger = $("<button class='tb-head-button'> " + option.text + " </button>");
        let list = $("<ul class='tb-head-ul'></ul>").eq(0);
        list.css({
            display: "none",
            width: option.innerWidth || "fit-content",
            maxHeight: option.height,
            overflowY: "auto"
        });
        _this.append(btn_trigger);// bind event
        let vm = document.createDocumentFragment();
        if (data && data.length > 0) {
            $.each(data, (every, item) => {
                let lis = $("<li data-id=" + every + "> " + item + " </li>");
                lis.on("click", function () {
                    btn_trigger.text(item);
                });
                vm.appendChild(lis[0]);
            });
            list.append(vm);
            function trigger() {
                list.css({
                    display: open ? "block" : "none"
                });
                let _class = "active";
                if (open) {
                    btn_trigger.addClass(_class);
                } else {
                    btn_trigger.removeClass(_class);
                }
            }
            $(document).click(function () {
                open = false;
                trigger();
            });
            btn_trigger.on(option.trigger, (e) => {
                e.stopPropagation();
                open = !open;
                trigger();
            });
            _this.append(list);
        }

    }
    let __a = "全球 中国大陆 中国香港 中国台湾 中国澳门 韩国 马来西亚 澳大利亚 新加坡 新西兰 加拿大 日本 越南 泰国 菲律宾 柬埔寨".split(" ");
    const head = {
        world: __a
    }
    $("#menu-world").menu({
        height: "288px",
        innerWidth: "242px",
        trigger: "click",
        text: "全球"
    }, head.world);
    $("#menu-login").menu({
        height: "288px",
        innerWidth: "242px",
        trigger: "click",
        text: "请登录"
    }, null);
    new SimSwiper("#tb-slider", {
        lazy: {
            prop: "orc"
        },pagination: {
            el: ".pagination",
            click: true
        },
        loop:true,
        button:{
            next:"#tb-slide-next",
            prev:"#tb-slide-prev"
        }
    })
});