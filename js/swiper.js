(function (e, fn) {
	"use strict";
	if (e.__proto__ === undefined) {
		e.SimSwiper = fn;
		return SimSwiper;
	} else {
		if (typeof module !== "undefined") {
			module.exports = fn;
		} else {
			e.__proto__.SimSwiper = fn;
		}
	}
})(this, function (el, conf) {
	"use strict";
	var root = el;
	if (!document.querySelector(el)) {
		console.error("找不到父容器", el);
		return;
	}
	var fun = function (el) {
		var _el = null;
		if (typeof el === 'string') {
			_el = document.querySelector(el);
		} else if (el.nodeType) {
			_el = el;
		}
		getStyle(_el, "top");
		return;
	};
	if (!conf) {
		var conf = {
			loop: true,
			duration: 300,
			autoplay: true,
			easing: "ease"
		}
	}
	var ArrayFind = function (arr, element) {
		var tag = false;
		if (arr.length) {
			arr.forEach(function (i) {
				if (i === element) {
					tag = true;
					return;
				}
			});
		}
		return tag;
	};
	/**
	 * 事件绑定
	 * __ {el:Document,event:String,fn,passive:bool}
	 */
	var events = ["visibilitychange", "scroll", "touchstart", "transitionend", "click", "touchmove", "touchend", "mouseup", "mousedown", "mouseleave", "mousemove", "mouseout", "resize", "keydown"];
	var bind = function (_el, event, fun, passive) {
		if (_el && typeof _el === 'object') {
			if (event && typeof event === 'string' && ArrayFind(events, event)) {
				_el.addEventListener(event, fun, {
					passive: passive || false
				});
			}
		}
	}
	/**
	 * 事件解绑
	 * __ {el:Document,event:String,fn}
	 */
	var unbind = function (_el, event, fun) {
		if (_el && typeof _el === 'object') {
			if (event && typeof event === 'string' && ArrayFind(events, event)) {
				_el.removeEventListener(event, fun, (/Trident/i.test(navigator.userAgent)) || is_mobile());
			}
		}
	}
	var toArray = function (o) {
		if (!o) {
			return []
		}
		var arrays = [];
		var i = 0;
		var len = o.length;
		for (; i < len; i++) {
			arrays.push(o[i]);
		}
		return arrays;
	}
	var getChild = function (el, name) {
		var res = {
			child: null,
			self: typeof el === 'string' ? document.querySelector(el) : el,
			wrap: null
		};
		if (!res.self) {
			return null;
		}
		var c = res.self.children;
		if (res.self) {
			for (var a = 0; a < c.length; a++) {
				var i = c[a];
				if (i.className === name.replace(".", "")) {
					var children = i.children;
					if (Array.from === undefined) {
						res.child = toArray(children)
					} else {
						res.child = Array.from(children);
					}
					res.wrap = i;
					break;
				}
			}
		}
		return res;
	}
	function renderNode(name, prop) {
		if (!name && !prop) {
			return document.createDocumentFragment();
		}
		var tag = document.createElement(name);
		if (prop) {
			for (var k in prop) {
				tag.setAttribute(k, prop[k]);
			}
		}
		return tag;
	}

	function is_blank(str) {
		return !str || str.trim() === '';
	}
	var is_mobile = function () {
		return (/Android|iPhone|iPad|X11/i.test(navigator.userAgent));
	}
	var is_firefox = function () {
		return (/Firefox/i.test(navigator.userAgent));
	}
	var con = document.querySelector(el),
		g_conf = conf,
		slider = null,
		page = null,
		duration = conf && conf.duration ? conf.duration : 300,
		easing = conf && conf.easing ? conf.easing : "ease",
		isCube = conf ? conf.effect && conf.effect === 'cube' : false,
		tm = getChild(el, ".swiper-wrapper"),
		_wc = tm.child;
	var th = null,
		setting = {
			index: 0,
			width: 0,
			height: 0,
			num: 1,
			duration: undefined,
			time: null,
			curIndex: 0,
			touchX: 0,
			position: 0,
			prevIndex: 0,
			offIndex: -1,
			loadEnd: false,
			prev: null,
			next: null,
			accelerate: true,
			timer: null,
			is_move: false,
			autoplay: function () {
				var time = typeof g_conf.autoplay === "number" ? g_conf.autoplay : 3500;
				th.time = setInterval(
					function () {
						th._next();
					},
					time > th.duration ? time : 1400
				);
			},
			init: function () {
				var _this = this;
				this.prev = this._prev;
				this.next = this._next;
				this.lastNode = slider.lastChild;
				th = this;
				th.duration = duration;
				th.num = _wc.length;
				th.width = getStyle(con, "width");
				th.height = getStyle(con, "height");
				if (th.is_horizontal()) {
					setStyle(slider, {
						width: isCube ? '100%' : this.width * ((conf && conf.loop) ? _wc.length + 1 : _wc.length) +
							"px"
					});
				} else {
					setStyle(slider, {
						height: this.height * (conf && conf.loop ? _wc.length + 1 : _wc.length) +
							"px"
					});
				}
				try {
					bind(window, "resize", function () {
						slider.style.transition = "all 0s";
					})
					if (conf && conf.button) {
						if (conf.button.prev) {
							bind(document.querySelector(
								(root) + ">" + conf.button["prev"]
							), "click", function () {
								_this._prev();
							});
						}
						if (conf && conf.button.next) {
							bind(document.querySelector(
								(root) + ">" + conf.button["next"]
							),
								"click",
								function () {
									_this._next();
								},
								false
							);
						}
						if (!is_blank(conf.button.prevKey)) {
							bind(document, "keydown", function (t) {
								if (conf.button.prevKey === t.key) {
									t.preventDefault();
									th._prev()
								} else if (!is_blank(conf.button.nextKey) && t.key === conf.button
									.nextKey) {
									t.preventDefault()
									th._next()
								}
							})
						}
					}
				} catch (e) {
					throw new Error(e);
				}
				if (g_conf.autoplay) {
					th.boot();
				}
				if (!conf.disabvarouch) {
					this.touch_init();
				}
				if (g_conf.pagination && page && g_conf.pagination["el"] !== undefined) {
					page.childNodes[th.curIndex].classList.add("pagination-items-active");
					if (g_conf.pagination["click"] && g_conf.pagination["click"] !== false) {
						var poc = page.childNodes;
						var i = 0;
						for (; i < poc.length; i++) {
							poc[i].index = i;
							poc[i].onclick = function () {
								th.index = th.curIndex = this.index;
								th.goto();
							};
						}
					}
				}
				if (conf.init !== undefined && typeof conf.init === "function") {
					conf.init({
						el: slider.childNodes[th.curIndex],
						index: th.curIndex
					});
				}
				this.add(slider.firstElementChild);
				if (conf && conf.loop) {
					this.add(slider.lastElementChild);
				}
				bind(window, "visibilitychange", function () {
					document.visibilityState === "visible" ? th.boot() : th.stop();
				});
				this.set_default_position();
				if (typeof conf.accelerate == 'boolean') {
					this.accelerate = conf.accelerate;
				};
				return this;
			},
			stop: function () {
				clearInterval(th.time);
			},
			boot: function () {
				if(g_conf && typeof g_conf.autoplay === 'boolean' && g_conf.autoplay===false){
					return;
				}
				if (th.time !== null) {
					clearInterval(th.time);
				}
				th.autoplay();
			},
			children: function (parent, name) {
				if (!parent) {
					return
				}
				var tagArr = [];
				function deep(_p) {
					var c = _p ? _p.children : parent.children;
					for (var it = 0; it < c.length; it++) {
						var ea = c[it];
						if (ea && ea.tagName.toLowerCase() === name) {
							tagArr.push(ea);
						} else if (ea) {
							deep(ea);
						}
					}
				}
				deep();
				return tagArr;
			},
			add: function (img_el) {
				if (th.loadEnd || !g_conf.lazy) {
					return;
				}
				if (!img_el) {
					return;
				} else {
					var t = null;
					clearTimeout(t);
					t = setTimeout(function () {
						var img = th.children(img_el, "img");
						if (img) {
							for (var i = 0; i < img.length; i++) {
								var _img = img[i];
								try {
									var at = _img.getAttribute('src');
									if (!at) {
										var prop = conf.lazy.prop || 'data-src';
										var url = _img.getAttribute(prop);
										_img.setAttribute('src', url);
										_img.removeAttribute(prop);
										_img.classList.remove('lazy');
									}
								} catch (e) {
									console.error(e);
									void (e)
								}
							}
							img_el.classList.remove('lazy')
							var path = root + ">.swiper-wrapper .lazy";
							var y = document.querySelectorAll(path).length;
							if (y <= 0) {
								th.loadEnd = true;
							}
						}
					}, Math.min((conf.duration || 0), 100))
				}
			},
			_prev: function () {
				var _ = this;
				_.index--;
				_.slide_to();
			},
			_next: function () {
				var _ = this;
				_.index++;
				_.slide_to();
			},
			play: function () {
				var _ = this;
				_.curIndex = _.index === _.num ? 0 : _.index;
				var c = slider.childNodes[th.curIndex];
				if (conf.pagination && page && conf.pagination.el) {
					var pc = page.childNodes;
					var i = 0;
					for (; i < pc.length; i++) {
						if (i === th.curIndex) {
							pc[i].classList.add("pagination-items-active");
						} else {
							pc[i].classList.remove("pagination-items-active");
						}
					}
				}
				if (conf.lazy) {
					_.add(c);
				}
				if (conf && conf.on && typeof conf.on.change === 'function') {
					clearTimeout(_.timer);
					_.timer = setTimeout(function () {
						conf.on.change(_.curIndex);
					}, 10);
				}
			},
			css: function (a, b, c) {
				if (!a || !b) {
					return
				}
				setStyle(a, b);
				if (c && typeof c === 'function') {
					c();
				}
			},
			slide_to: function () {
				var _t = this;
				var val;
				if (_t.index === _t.num + 1) {
					if (conf.loop) {
						val = 0;
						_t.transform(val, 0)
					}
					_t.index = 1;
					fun(root)
				} else if (_t.index < 0) {
					if (conf.loop) {
						val = _t.is_horizontal() ? _t.num * _t.width : _t.num * _t.height
						_t.transform(val, 0)
					}
					_t.index = _t.num - 1;
					fun(root);
				}
				_t.duration = duration;
				val = _t.is_horizontal() ? _t.index * _t.width : _t.index * _t.height
				_t.transform(val, _t.duration);
				th.setPosition();
				return _t;
			},
			is_horizontal: function () {
				return !conf.direction || conf.direction.toLowerCase() === 'horizontal';
			},
			set_default_position: function () {
				this.goto();
			},
			goto: function () {
				var __dis = this.index * (this.is_horizontal() ? this.width : this.height);
				this.transform(__dis, conf.duration || 300),
					this.position = __dis;
			},
			transform: function (x, delay) {
				var t = this;
				var _prop = null;
				if (t.accelerate) {
					var ts = t.is_horizontal() ? "translate3d(" + (-x) + "px,0px,0px)" : "translate3d(0px," + (-x) + "px,0px)"
					_prop = {
						transform: ts,
						position: 'absolute',
						left: 0,
						top: 0,
						backfaceVisibility: 'hidden',
						transition: "all " + delay + "ms " + easing,
					}
				} else {
					_prop = {
						transform: "translate3d(0px,0px,0px)",
						position: 'absolute',
						backfaceVisibility: 'hidden',
						transition: "all " + delay + "ms " + easing,
					}
					_prop[t.is_horizontal() ? 'left' : 'top'] = -x + "px";
				}
				t.css(slider, _prop, function () {
					t.play();
				});
			},
			touch_init: function () {
				bind(slider, "mousedown", th.start, false);
				bind(slider, "mouseleave", th.stop, false);
				bind(slider, "touchstart", th.start, false);
				bind(document, "mouseup", th.end, false);
				bind(document, "touchend", th.end, false);
			},
			link_handler: function (b) {
				var ar = th.children(slider, "a");
				for (var key in ar) {
					if (typeof ar[key] === "object") {
						if (b) {
							ar[key].onclick = function (e) {
								e.preventDefault()
							}
						} else {
							ar[key].onclick = function () {
								return void (undefined)
							}
						}
					}
				}
			},
			set_drab: function (b) {
				setStyle(slider, {
					cursor: b ? "grab" : "default"
				});
			},
			checked: function (n) {
				return !(Math.floor(n) === -1);
			},
			start: function (e) {
				if (!e || e.button!==0) { return }
				th.stop();
				if (is_firefox()) { e.preventDefault(); }
				var st = e.touches ? e.touches.length - 1 : 0;
				th.touchX = th.is_horizontal() ? (e.clientX || e.touches[st].clientX) : (e.clientY || e.clientY || e.touches[st].clientY);
				bind(slider, "touchmove", th.move, false);
				if (!is_mobile()) {
					th.link_handler(false);
					bind(document, "mousemove", th.move, false);
				}
				else if (!is_mobile() && e.button === 0) {
					e.preventDefault();
				}
				else {
					bind(slider, "mousemove", th.move, false);
				}
				th.set_drab(true);
				th.is_move = true;
			},
			move: function (e) {
				try {
					e.preventDefault();
					var x = th.is_horizontal() ? (e.clientX || (e.touches ? e.touches[0].clientX : 0)) : (e.clientY || (e.touches ? e.touches[0].clientY : 0));
					var a = x - th.touchX - th.position;
					var __h = (th.is_horizontal() ? th.width : th.height)
					var t, per = (x - th.touchX) / __h;
					if (th.checked(per)) {
						t = -__h / 10;
					} else {
						t = __h + 100;
					}
					if (th.min(x)) {
						var u = Math.abs(parseInt((a - t) / __h));
						if (u > th.num) {
							th.index = th.num;
						} else {
							th.index = u;
						}
						if (!is_mobile()) {
							th.link_handler(true);
						}
					}
					var p = Math.abs(a) >= th.num * __h;
					if (p) {
						th.position = 0;
						th.index = 0;
						th.transform(0, 0, 0);
					} else if (a > 0) {
						th.position = th.num * __h;
						th.transform(th.position, 0, 0);
						th.index = th.num;
					} else {
						th.transform(-a, 0);
					}
				} catch (er) {
					th.transform(-a, 0);
					void er;
				}
			},
			end: function () {
				th.transform(th.index * (th.is_horizontal() ? th.width : th.height), conf.duration || 300);
				th.prevIndex = th.index;
				th.setPosition();
				unbind(slider, "touchmove", th.move);
				unbind(document, "mousemove", th.move);
				unbind(slider, "mousemove", th.move);
				th.set_drab(false);
				th.boot();
			},
			min: function (x) {
				var c = Math.abs(x - this.touchX);
				return c >= 5;
			},
			setPosition: function () {
				this.position = this.index * (this.is_horizontal() ? this.width : this.height);
			},
		};
	var globa_this = null;
	(function () {
		var _vmNode = undefined;
		if (arguments.length !== 2) {
			el = ".simple-swiper-container";
		} else {
			g_conf = conf;
		}
		var _wrap = renderNode("div", {
			"class": "swiper-wrapper"
		}),
			_vmNode = renderNode(),
			_slider = renderNode("div", {
				"class": "swiper-slider"
			}),
			_ew = getStyle(con, 'width');
		if (!_wc) {
			return
		}
		try {
			for (var s in _wc) {
				var _i = _wc[s];
				if (setting.is_horizontal()) {
					setStyle(_i, {
						width: _ew + 'px',
						height: '100%',
						float: 'left'
					});
				} else {
					setStyle(_i, {
						width: _ew + 'px',
						height: getStyle(con, 'height') + 'px',
					});
				}
				_i.classList.add('lazy');
				_vmNode.appendChild(_i);
			}
		} catch (e) {
			void (e);
		}
		if (conf.loop) {
			var _c = _wc[0].cloneNode(true);
			_vmNode.appendChild(_c);
		}
		_slider.appendChild(_vmNode);
		_wrap.appendChild(_slider);
		con.replaceChild(_wrap, tm.wrap);
		slider = _slider;
		page = document.querySelector(conf && conf.pagination ? conf.pagination.el : null);
		if (page) {
			if (conf.pagination && conf.pagination.el) {
				var mx = tm.child.length,
					vo = renderNode(),
					p = 0;
				for (; p < mx; p++) {
					var p_el = renderNode("span", {
						"class": "pagination-items"
					});
					vo.appendChild(p_el);
				}
				page.appendChild(vo);
			}
		}
		globa_this = setting.init();
	})();
	function setStyle(el, props) {
		try {
			if (!el || !props) {
				return;
			}
			for (var key in props) {
				el.style[key] = props[key];
			}
		} catch (err) {
			void (err);
		}
	}
	function getStyle(el, prop) {
		return Math.ceil(parseFloat(window.getComputedStyle(el)[prop])) || el.getBoundingClientRect()[prop];
	};
	return globa_this;
});