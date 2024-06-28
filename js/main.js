$(document).ready(function () {
    // start
    "use strict";
    // 屏幕设置

    (function () {
        function isMobile() {
            return (/Android|iPhone|iPad|X11|MacOSX|/i.test(navigator.userAgent.replaceAll(" ", "")));
        }
        if (isMobile()) {
            return;
            $("html,body").css({
                width: window.innerWidth
            })
        }
    })();
    /**
     * 
     * dev
     * 
     */


    // 选择菜单组件
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
    // 页面滚动组件 监听元素显示在屏幕开始执行

    $.fn.scrollView = function (config) {
        let node = $(this);
        if (!config || !config.target) {
            return;
        }
        let target = $(config.target);
        let index = 0;
        let __fn = undefined;
        let win_height = window.innerHeight;
        $(window).on("resize", () => {
            win_height = window.innerHeight;
        });
        function isFun(f) {
            return typeof f === 'function';
        }
        function isVisible(a) {
            return a <= win_height;
        }
        function call() {
            if (isFun(config.accept)) {
                config.accept(index, target);
            }
        }
        function isBottom(a, b) {
            if (a >= b) {
                index += 1;
                if (index === config.count) {
                    node.off("scroll", __fn);
                    if (isFun(config.end)) {
                        config.end(true);
                    }
                }
                call();
            }
        }
        call();
        if (node[0] === window) {
            __fn = function () {
                let top = target.offset().top;
                if (isVisible(top)) {
                    let scroll_height = document.documentElement.scrollTop;
                    let doc_height = $(document).height();
                    isBottom(scroll_height + win_height, doc_height);
                }
            }
            __fn();
            if (isFun(config.init)) {
                config.init(true);
            }
        } else {
        }
        if (config.count > 0) {
            node.on("scroll", __fn);
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
        }],
        classification: [
            {
                icon: "",
                contents: ["女装", "内衣", "奢侈"]
            },
            {
                icon: "",
                contents: ["女鞋", "男鞋", "箱包"]
            },
            {
                icon: "",
                contents: ["美妆", "饰品", "洗护"]
            }, {
                icon: "",
                contents: ["男装", "运动", "百货"]
            }, {
                icon: "",
                contents: ["手机", "数码", "企业礼品"]
            }, {
                icon: "",
                contents: ["家装", "电器", "车品"]
            }, {
                icon: "",
                contents: ["食品", "生鲜", "母婴"]
            }, {
                icon: "",
                contents: ["医药", "保健", "进口"]
            }, {
                icon: "",
                contents: ["工业品", "商办家具", "定制"]
            }
        ],
        search: {
            hot_word: "背带裤",
            push: "鼠标垫 男装 潮流T恤 时尚女鞋 短裤 半身裙 男士外套 墙纸 行车记录仪 新款男鞋 耳机 时尚女包 沙发".split(" ")
        },
        user: {
            cart: [{
                text: 0,
                name: "购物车"
            }, {
                text: 10,
                name: "待收货"
            }, {
                text: 1,
                name: "待发货"
            }, {
                text: 3,
                name: "待付款"
            }, {
                text: 2,
                name: "待评价"
            }],
            buy_list: [{
                img: "https://gw.alicdn.com/bao/uploaded/i4/645804463/O1CN01WXa3jD1iq6YIOYcxc_!!0-item_pic.jpg_300x300q90.jpg",
                status: "已签收",
                logistics: "物流信息"
            }, {
                img: "https://gw.alicdn.com/bao/uploaded/i4/645804463/O1CN01WXa3jD1iq6YIOYcxc_!!0-item_pic.jpg_300x300q90.jpg",
                status: "派送中",
                logistics: "您的包裹已送货上门，放至家门口。服务由菜鸟驿站【上海市诸光路1355西郊家园店】提供。如有问题可致电13158369520。期待再次为您服务。"
            }],
            roles: [
                {
                    text: "全民制作人",
                    type: "【规则】"
                }
            ]
        }
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

    class taobao {
        _vm() {
            return document.createDocumentFragment();
        }
        constructor() {
            /**
             * @author cc
             * @param {*} rootElement 根元素
             * @param {*} data 数据
             * @param {*} call 回调
             */
            this.h = function (rootElement, _data, call) {
                if (data && call && typeof call === 'function') {
                    $.each(data, (a, b) => {
                        call(a, b);
                    });
                }
            }
            this.render_brand();
            this.render_types();
            this.render_search();
            this.render_cart();
            this.render_buy();
            this.render_role();
            this.load_list();
            let btn = $(".tb-toolkit-button:last-child")
            $(window).on("scroll", function (e) {
                let t = document.documentElement.scrollTop;
                btn.css({
                    display: (t >= 406) ? "block" : "none"
                })
            });
            btn.click(function () {
                $("html,body").animate({
                    scrollTop: 0
                })
            })
        }
        render_brand() {
            new SimSwiper("#tb-slider", {
                lazy: {
                    prop: "orc"
                },
                pagination: {
                    el: ".pagehelper",
                    click: true
                },
                autoplay: 3000,
                loop: true,
                button: {
                    next: "#tb-slide-next",
                    prev: "#tb-slide-prev"
                }
            });
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
        render_types() {
            let root = $(".tb-head-left-list");
            const vm = this._vm();
            $.each(data.classification, (i, b) => {
                let li = $(`<li class="link-classification" > <i class="i-font tb-font service-arrow">${b.icon}</i> </li>`);
                $.each(b.contents, (_c, d) => {
                    let a = $(`<a class="link-classification-a">${d}</a>`);
                    if (_c > 0 && _c <= d.length) {
                        let c = $(`<a class="pip"> / </a>`);
                        li.append(c);
                    }
                    li.append(a);
                });
                vm.appendChild(li[0]);
            });
            root.append(vm);
        }
        render_search() {
            let root = $(".search-hot");
            const vm = this._vm();
            $.each(data.search.push, (a, b) => {
                let link = $(`<a title="${b}" class="search-link">${b}</a>`)[0];
                vm.appendChild(link);
            });
            root.append(vm);
        }
        render_cart() {
            let root = $(".user-cart");
            const vm = this._vm();
            $.each(data.user.cart, (a, b) => {
                let el = $(`
                    <div class="cart-item">
                        <span class="cart-num"> ${b.text} </span>
                        <span> ${b.name} </span>
                    </div>
                `);
                vm.appendChild(el[0]);
            });
            root.append(vm);
        }
        render_buy() {
            let root = $("#user-buy-info> .swiper-wrapper");
            const vm = this._vm();
            $.each(data.user.buy_list, (a, b) => {
                let card = $(`<div class="swiper-items">
                                <a href="#1" class="buy-info" target="_blank" rel="noopener noreferrer">
                                    <img class="img_buy" ikun="${b.img}" alt=""/>
                                    <div class="buy-more">
                                    <span class="buy-status"> ${b.status} </span>
                                    <span class="buy-status-logistics"> ${b.logistics} </span>
                                    </div>
                                </a>
                            </div>`);
                vm.appendChild(card[0]);
            });
            root.append(vm);
            // init swiper
            new SimSwiper("#user-buy-info", {
                loop: true,
                autoplay: 3000,
                lazy: {
                    prop: "ikun"
                }
            })
        }
        render_role() {
            let root = $("#tb-role-list > .swiper-wrapper");
            const vm = this._vm();
            $.each(data.user.roles, (i, b) => {
                vm.appendChild($(`<div class="swiper-items tb-role">
                    <span class="tb-role-type">${b.type}</span>
                    ${b.text}
                </div>`)[0])
            });
            root.append(vm);
            new SimSwiper("#tb-role-list", {
                loop: true,
                autoplay: 3000
            })
        }
        load_list() {
            // 加载更多列表
            function h(img, id = 0, img_label = undefined, name, price = 0, index) {
                return $(`
                    <div class="more-item animated_fade_up" data-id="${id}" style="--delay:${index}00ms">
                        <a class="common-link" href="javascript:void(0)">
                            <div class="more-item-image clear">
                                <img src="${img}" alt="none">
                            </div>
                            <div class="more-item-detail clear">
                                <span class="more-item-name"> 
                                    ${img_label ? `<img src="${img_label}"/>` : ''}
                                    ${name}
                                </span>
                                <span class="more-item-price"> 
                                    ${price}
                                </span>
                            </div>
                        </a>
                    </div>
                `);
            }
            $(window).scrollView({
                target: "#more-item-list",
                count: 10,
                accept(e = 0, v) {
                    for (let i = 0; i < 6; i++) {
                        v.append(h(
                            'https://img.alicdn.com/bao/uploaded/i1/646406995/O1CN01jMo0G021XlOOZVXpG_!!646406995.jpg',
                            1,
                            'https://img.alicdn.com/bao/uploaded/i1/646406995/O1CN01jMo0G021XlOOZVXpG_!!646406995.jpg',
                            "意大利洋酒 阿佩罗开胃利口酒 APEROL SPRITZ 餐前酒 鸡尾酒调酒",
                            88,
                            i))
                    }
                },
                init() {
                    $(".bottom-tips").addClass("loading");
                },
                end() {
                    $(".bottom-tips").removeClass("loading").text("到底了~~");
                }
            });
        }
    }
    new taobao();
});