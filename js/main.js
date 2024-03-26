$(document).ready(function () {
    // start
    "use strict";

    /**
     * 
     * dev
     * 
     */
    function dev() {
        $("#opacity").on("input", function () {
            let v = $(this).val() / 100;
            $(".cankao").css({
                opacity: v
            })
        });
        $("#visible").on("click", function () {
            $(".cankao").toggle()
        });
    }
    dev()


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
        world: __a,
    }
    const data = {
        brand: [{
            text: "天猫",
            color: "#FF0036"
        }, {
            text: "聚划算",
            color: "#FF0036"
        }, {
            text: "天猫超市",
            color: "#33c900"
        }, {
            text: "司法拍卖",
            color: null
        }, {
            text: "飞猪旅行",
            color: null
        }, {
            text: "淘宝直播",
            color: null
        }, {
            text: "春季采购节",
            color: null
        }]
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
        }, pagination: {
            el: ".pagination",
            click: true
        },
        loop: true,
        button: {
            next: "#tb-slide-next",
            prev: "#tb-slide-prev"
        }
    });
    class taobao {
        constructor() {
            this.render_brand();
        }
        render_brand() {
            let root = $(".tb-pinpai");
            const vm = document.createDocumentFragment();
            let max = data.brand.length;
            $.each(data.brand, (i, b) => {
                let a = $(`<a class="link-pinpai clear" href="javascript:void(0)" style="color:${b.color || 'black'}"> ${b.text} </a>`);
                if (i > 0 && i < max) {
                    let c = $(`<a class="pip clear">  </a>`);
                    vm.appendChild(c[0]);
                }
                vm.appendChild(a[0]);
            });
            root.append(vm);
        }
    }
    new taobao();

});