(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  33525,
  (e, t, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "warnOnce", {
        enumerable: !0,
        get: function () {
          return r;
        },
      }));
    let r = (e) => {};
  },
  18581,
  (e, t, n) => {
    "use strict";
    (Object.defineProperty(n, "__esModule", { value: !0 }),
      Object.defineProperty(n, "useMergedRef", {
        enumerable: !0,
        get: function () {
          return i;
        },
      }));
    let r = e.r(71645);
    function i(e, t) {
      let n = (0, r.useRef)(null),
        i = (0, r.useRef)(null);
      return (0, r.useCallback)(
        (r) => {
          if (null === r) {
            let e = n.current;
            e && ((n.current = null), e());
            let t = i.current;
            t && ((i.current = null), t());
          } else (e && (n.current = s(e, r)), t && (i.current = s(t, r)));
        },
        [e, t],
      );
    }
    function s(e, t) {
      if ("function" != typeof e)
        return (
          (e.current = t),
          () => {
            e.current = null;
          }
        );
      {
        let n = e(t);
        return "function" == typeof n ? n : () => e(null);
      }
    }
    ("function" == typeof n.default ||
      ("object" == typeof n.default && null !== n.default)) &&
      void 0 === n.default.__esModule &&
      (Object.defineProperty(n.default, "__esModule", { value: !0 }),
      Object.assign(n.default, n),
      (t.exports = n.default));
  },
  18566,
  (e, t, n) => {
    t.exports = e.r(76562);
  },
  6923,
  (e) => {
    "use strict";
    e.s(["PageOpacityWrapper", () => o, "shouldFadeOut", () => s]);
    var t = e.i(43476),
      n = e.i(71645),
      r = e.i(18566),
      i = e.i(89970);
    e.i(94194);
    let s = (0, e.i(68278).signal)(!1),
      o = (e) => {
        let { children: o } = e,
          a = (0, n.useRef)(null),
          [l, u] = (0, n.useState)(!1),
          c = (0, r.usePathname)();
        return (
          (0, n.useEffect)(() => {
            u(!0);
          }, []),
          (0, n.useEffect)(() => {
            if (l)
              return s.subscribe((e) => {
                e && a.current && i.gsap.set(a.current, { opacity: 0 });
              });
          }, [l]),
          (0, n.useEffect)(() => {
            if (!l || !a.current) return;
            let e = setTimeout(() => {
              a.current &&
                (i.gsap.to(a.current, {
                  opacity: 1,
                  duration: 0.5,
                  ease: "power2.out",
                }),
                (s.value = !1));
            }, 500);
            return () => clearTimeout(e);
          }, [c, l]),
          (0, t.jsx)("div", { ref: a, children: o })
        );
      };
  },
  37107,
  (e) => {
    "use strict";
    e.s(["Navigation", () => u]);
    var t = e.i(43476),
      n = e.i(71645),
      r = e.i(22016),
      i = e.i(18566),
      s = e.i(65747),
      o = e.i(89970),
      a = e.i(6923);
    let l = [
        { name: "Home", href: "/" },
        { name: "Work", href: "/work" },
        { name: "About", href: "/about" },
      ],
      u = () => {
        let e = (0, i.usePathname)(),
          u = (0, i.useRouter)(),
          c = (0, n.useRef)(null),
          d = (0, n.useRef)(null),
          f = (0, n.useRef)([]),
          [h, p] = (0, n.useState)(!1);
        return (
          (0, s.useGSAP)(() => {
            o.gsap.from(c.current, {
              y: -100,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
            });
          }, []),
          (0, n.useEffect)(() => {
            let t = l.findIndex((t) => t.href === e),
              n = f.current[t],
              r = d.current;
            if (n && r) {
              let { offsetLeft: e, offsetWidth: t } = n,
                i = o.gsap.to(r, {
                  x: e,
                  width: t,
                  duration: 0.6,
                  ease: "power3.out",
                });
              return (
                p(!1),
                () => {
                  i.kill();
                }
              );
            }
            p(!1);
          }, [e]),
          (0, t.jsx)("nav", {
            ref: c,
            className:
              "fixed top-0 left-0 p-2 xl:p-0 xl:top-6 xl:left-auto xl:right-8 z-50",
            children: (0, t.jsxs)("div", {
              className:
                "relative flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-2 shadow-2xl",
              children: [
                (0, t.jsx)("div", {
                  ref: d,
                  className:
                    "absolute bg-white rounded-full h-[calc(100%-16px)] top-2 left-0",
                  style: { zIndex: 0 },
                }),
                l.map((n, i) => {
                  let s = e === n.href;
                  return (0, t.jsx)(
                    r.default,
                    {
                      ref: (e) => {
                        f.current[i] = e;
                      },
                      href: n.href,
                      onClick: (t) =>
                        ((t, n) => {
                          n === e ||
                            h ||
                            (t.preventDefault(),
                            p(!0),
                            (a.shouldFadeOut.value = !0),
                            u.push(n));
                        })(t, n.href),
                      className:
                        "relative px-6 py-2 rounded-full font-oxanium text-sm font-medium transition-colors duration-300 z-10 ".concat(
                          s ? "text-black" : "text-white/70 hover:text-white",
                        ),
                      children: n.name,
                    },
                    n.href,
                  );
                }),
              ],
            }),
          })
        );
      };
  },
  1383,
  (e) => {
    "use strict";
    e.s(["PageTransition", () => u, "directionNav", () => a], 1383);
    var t = e.i(43476),
      n = e.i(71645),
      r = e.i(18566),
      i = e.i(89970);
    e.i(94194);
    var s = e.i(68278);
    let o = (e) => {
        var r, i, s, o, a, l;
        let {
            className: u = "w-full h-32 ",
            color: c = "white",
            gradientStops: d = {
              start: { offset: "0%", opacity: "0" },
              middle: { offset: "50%", opacity: "1" },
              end: { offset: "100%", opacity: "0" },
            },
            glowIntensity: f = 2,
          } = e,
          h = (0, n.useId)(),
          p = "threadGradient-".concat(h),
          m = "glow-".concat(h);
        return (0, t.jsxs)("svg", {
          className: u,
          viewBox: "0 0 1000 100",
          preserveAspectRatio: "none",
          children: [
            (0, t.jsxs)("defs", {
              children: [
                (0, t.jsxs)("linearGradient", {
                  id: p,
                  x1: "0%",
                  y1: "0%",
                  x2: "100%",
                  y2: "0%",
                  children: [
                    (0, t.jsx)("stop", {
                      offset:
                        (null == (r = d.start) ? void 0 : r.offset) || "0%",
                      stopColor: c,
                      stopOpacity:
                        (null == (i = d.start) ? void 0 : i.opacity) || "0",
                    }),
                    (0, t.jsx)("stop", {
                      offset:
                        (null == (s = d.middle) ? void 0 : s.offset) || "50%",
                      stopColor: c,
                      stopOpacity:
                        (null == (o = d.middle) ? void 0 : o.opacity) || "1",
                    }),
                    (0, t.jsx)("stop", {
                      offset:
                        (null == (a = d.end) ? void 0 : a.offset) || "100%",
                      stopColor: c,
                      stopOpacity:
                        (null == (l = d.end) ? void 0 : l.opacity) || "0",
                    }),
                  ],
                }),
                (0, t.jsxs)("filter", {
                  id: m,
                  children: [
                    (0, t.jsx)("feGaussianBlur", {
                      stdDeviation: f,
                      result: "coloredBlur",
                    }),
                    (0, t.jsxs)("feMerge", {
                      children: [
                        (0, t.jsx)("feMergeNode", { in: "coloredBlur" }),
                        (0, t.jsx)("feMergeNode", { in: "SourceGraphic" }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, t.jsx)("path", {
              d: "M 0,50 Q 250,30 500,50 T 1000,50",
              stroke: "url(#".concat(p, ")"),
              strokeWidth: "3",
              fill: "none",
              filter: "url(#".concat(m, ")"),
              className: "animate-[wave_2s_ease-in-out_infinite]",
            }),
            (0, t.jsx)("path", {
              d: "M 0,50 Q 250,70 500,50 T 1000,50",
              stroke: "url(#".concat(p, ")"),
              strokeWidth: "2",
              fill: "none",
              opacity: "0.5",
              filter: "url(#".concat(m, ")"),
              className: "animate-[wave_2s_ease-in-out_infinite_reverse]",
            }),
          ],
        });
      },
      a = (0, s.signal)("right"),
      l = { transform: "translateX(100%)" },
      u = (e) => {
        let { children: s } = e,
          u = (0, r.usePathname)(),
          c = (0, n.useRef)(null),
          d = (0, n.useRef)(null);
        return (
          (0, n.useEffect)(() => {
            let e = c.current,
              t = d.current;
            if (!e || !t) return;
            let n = "left" === a.value ? "100%" : "-100%",
              r = "left" === a.value ? "-100%" : "100%",
              s = i.gsap.timeline({
                onComplete: () => {
                  (i.gsap.set(e, { x: n }),
                    "/" === u
                      ? (a.value = "left")
                      : "/about" === u && (a.value = "right"));
                },
              });
            return (
              s
                .set(e, { x: n })
                .to(e, { x: "0%", duration: 0.5, ease: "sine.inOut" })
                .to(e, { x: r, duration: 0.5, ease: "sine.inOut" }),
              () => {
                s.kill();
              }
            );
          }, [u]),
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)("div", {
                ref: c,
                className:
                  "fixed inset-0 z-[100]  pointer-events-none flex items-center justify-center bg-transparent",
                style: l,
                children: (0, t.jsx)(o, {}),
              }),
              (0, t.jsx)("div", { ref: d, children: s }),
            ],
          })
        );
      };
  },
  70641,
  (e) => {
    "use strict";
    e.s(["TransitionProvider", () => i, "useTransition", () => s]);
    var t = e.i(43476),
      n = e.i(71645);
    let r = (0, n.createContext)(null),
      i = (e) => {
        let { children: i } = e,
          s = (0, n.useRef)(null);
        return (0, t.jsx)(r.Provider, { value: { timeline: s }, children: i });
      },
      s = () => {
        let e = (0, n.useContext)(r);
        if (!e)
          throw Error("useTransition must be used within TransitionProvider");
        return e;
      };
  },
  93568,
  (e) => {
    "use strict";
    e.s(["BorderFrame", () => r]);
    var t = e.i(43476),
      n = e.i(71645);
    let r = () => {
      let [e, r] = (0, n.useState)({ width: 0, height: 0 });
      if (
        ((0, n.useEffect)(() => {
          let e = () => {
            r({ width: window.innerWidth, height: window.innerHeight });
          };
          return (
            e(),
            window.addEventListener("resize", e),
            () => window.removeEventListener("resize", e)
          );
        }, []),
        0 === e.width)
      )
        return null;
      let i = e.width,
        s = e.height,
        o = i - 10,
        a = window.innerWidth <= 1024 ? 32 : 10,
        l = s - 10;
      return (0, t.jsx)("div", {
        className: "fixed inset-0 pointer-events-none z-30 w-screen h-screen",
        style: { overflow: "clip" },
        children: (0, t.jsx)("div", {
          className: "absolute inset-0 w-full h-full",
          style: { transform: "scaleX(-1)", transformOrigin: "center" },
          children: (0, t.jsx)("svg", {
            width: i,
            height: s,
            viewBox: "0 0 ".concat(i, " ").concat(s),
            className: "absolute inset-0",
            xmlns: "http://www.w3.org/2000/svg",
            preserveAspectRatio: "xMidYMid meet",
            style: { overflow: "visible", maxWidth: "100%", maxHeight: "100%" },
            children: (0, t.jsx)("path", {
              d: (() => {
                let e = Math.max(
                    10 +
                      (window.innerWidth >= 768
                        ? 0.3 * window.innerWidth
                        : 0.15 * i),
                    60,
                  ),
                  t = Math.min(o - 0.15 * i - 50, o - 40 - 50),
                  n = Math.max(t - 40, 110);
                return [
                  "M ".concat(30, " ").concat(a),
                  "L ".concat(e, " ").concat(a),
                  "L ".concat(e + 40, " ").concat(a + 40),
                  "L ".concat(o - 20, " ").concat(a + 40),
                  "Q "
                    .concat(o, " ")
                    .concat(a + 40, " ")
                    .concat(o, " ")
                    .concat(a + 40 + 20),
                  "L ".concat(o, " ").concat(l - 40 - 20),
                  "Q "
                    .concat(o, " ")
                    .concat(l - 40, " ")
                    .concat(o - 20, " ")
                    .concat(l - 40),
                  "L ".concat(t, " ").concat(l - 40),
                  "L ".concat(n, " ").concat(l),
                  "L ".concat(30, " ").concat(l),
                  "Q "
                    .concat(10, " ")
                    .concat(l, " ")
                    .concat(10, " ")
                    .concat(l - 20),
                  "L ".concat(10, " ").concat(a + 20),
                  "Q ".concat(10, " ").concat(a, " ").concat(30, " ").concat(a),
                ].join(" ");
              })(),
              fill: "none",
              stroke: "rgba(255, 255, 255, 0.2)",
              strokeWidth: "1",
              vectorEffect: "non-scaling-stroke",
            }),
          }),
        }),
      });
    };
  },
  99503,
  (e) => {
    "use strict";
    e.s(["ViewportHeightHandler", () => n]);
    var t = e.i(71645);
    let n = () => (
      (0, t.useEffect)(() => {
        let e = () => {
          let e = 0.01 * window.innerHeight;
          document.documentElement.style.setProperty(
            "--vh",
            "".concat(e, "px"),
          );
        };
        return (
          e(),
          window.addEventListener("resize", e),
          window.addEventListener("orientationchange", () => {
            setTimeout(e, 300);
          }),
          () => {
            (window.removeEventListener("resize", e),
              window.removeEventListener("orientationchange", e));
          }
        );
      }, []),
      null
    );
  },
  16015,
  (e, t, n) => {},
  98547,
  (e, t, n) => {
    var r = e.i(47167);
    e.r(16015);
    var i = e.r(71645),
      s = (function (e) {
        return e && "object" == typeof e && "default" in e ? e : { default: e };
      })(i),
      o = void 0 !== r.default && r.default.env && !0,
      a = function (e) {
        return "[object String]" === Object.prototype.toString.call(e);
      },
      l = (function () {
        function e(e) {
          var t = void 0 === e ? {} : e,
            n = t.name,
            r = void 0 === n ? "stylesheet" : n,
            i = t.optimizeForSpeed,
            s = void 0 === i ? o : i;
          (u(a(r), "`name` must be a string"),
            (this._name = r),
            (this._deletedRulePlaceholder = "#" + r + "-deleted-rule____{}"),
            u("boolean" == typeof s, "`optimizeForSpeed` must be a boolean"),
            (this._optimizeForSpeed = s),
            (this._serverSheet = void 0),
            (this._tags = []),
            (this._injected = !1),
            (this._rulesCount = 0));
          var l =
            "undefined" != typeof window &&
            document.querySelector('meta[property="csp-nonce"]');
          this._nonce = l ? l.getAttribute("content") : null;
        }
        var t,
          n = e.prototype;
        return (
          (n.setOptimizeForSpeed = function (e) {
            (u(
              "boolean" == typeof e,
              "`setOptimizeForSpeed` accepts a boolean",
            ),
              u(
                0 === this._rulesCount,
                "optimizeForSpeed cannot be when rules have already been inserted",
              ),
              this.flush(),
              (this._optimizeForSpeed = e),
              this.inject());
          }),
          (n.isOptimizeForSpeed = function () {
            return this._optimizeForSpeed;
          }),
          (n.inject = function () {
            var e = this;
            if (
              (u(!this._injected, "sheet already injected"),
              (this._injected = !0),
              "undefined" != typeof window && this._optimizeForSpeed)
            ) {
              ((this._tags[0] = this.makeStyleTag(this._name)),
                (this._optimizeForSpeed = "insertRule" in this.getSheet()),
                this._optimizeForSpeed ||
                  (o ||
                    console.warn(
                      "StyleSheet: optimizeForSpeed mode not supported falling back to standard mode.",
                    ),
                  this.flush(),
                  (this._injected = !0)));
              return;
            }
            this._serverSheet = {
              cssRules: [],
              insertRule: function (t, n) {
                return (
                  "number" == typeof n
                    ? (e._serverSheet.cssRules[n] = { cssText: t })
                    : e._serverSheet.cssRules.push({ cssText: t }),
                  n
                );
              },
              deleteRule: function (t) {
                e._serverSheet.cssRules[t] = null;
              },
            };
          }),
          (n.getSheetForTag = function (e) {
            if (e.sheet) return e.sheet;
            for (var t = 0; t < document.styleSheets.length; t++)
              if (document.styleSheets[t].ownerNode === e)
                return document.styleSheets[t];
          }),
          (n.getSheet = function () {
            return this.getSheetForTag(this._tags[this._tags.length - 1]);
          }),
          (n.insertRule = function (e, t) {
            if (
              (u(a(e), "`insertRule` accepts only strings"),
              "undefined" == typeof window)
            )
              return (
                "number" != typeof t && (t = this._serverSheet.cssRules.length),
                this._serverSheet.insertRule(e, t),
                this._rulesCount++
              );
            if (this._optimizeForSpeed) {
              var n = this.getSheet();
              "number" != typeof t && (t = n.cssRules.length);
              try {
                n.insertRule(e, t);
              } catch (t) {
                return (
                  o ||
                    console.warn(
                      "StyleSheet: illegal rule: \n\n" +
                        e +
                        "\n\nSee https://stackoverflow.com/q/20007992 for more info",
                    ),
                  -1
                );
              }
            } else {
              var r = this._tags[t];
              this._tags.push(this.makeStyleTag(this._name, e, r));
            }
            return this._rulesCount++;
          }),
          (n.replaceRule = function (e, t) {
            if (this._optimizeForSpeed || "undefined" == typeof window) {
              var n =
                "undefined" != typeof window
                  ? this.getSheet()
                  : this._serverSheet;
              if (
                (t.trim() || (t = this._deletedRulePlaceholder), !n.cssRules[e])
              )
                return e;
              n.deleteRule(e);
              try {
                n.insertRule(t, e);
              } catch (r) {
                (o ||
                  console.warn(
                    "StyleSheet: illegal rule: \n\n" +
                      t +
                      "\n\nSee https://stackoverflow.com/q/20007992 for more info",
                  ),
                  n.insertRule(this._deletedRulePlaceholder, e));
              }
            } else {
              var r = this._tags[e];
              (u(r, "old rule at index `" + e + "` not found"),
                (r.textContent = t));
            }
            return e;
          }),
          (n.deleteRule = function (e) {
            if ("undefined" == typeof window)
              return void this._serverSheet.deleteRule(e);
            if (this._optimizeForSpeed) this.replaceRule(e, "");
            else {
              var t = this._tags[e];
              (u(t, "rule at index `" + e + "` not found"),
                t.parentNode.removeChild(t),
                (this._tags[e] = null));
            }
          }),
          (n.flush = function () {
            ((this._injected = !1),
              (this._rulesCount = 0),
              "undefined" != typeof window
                ? (this._tags.forEach(function (e) {
                    return e && e.parentNode.removeChild(e);
                  }),
                  (this._tags = []))
                : (this._serverSheet.cssRules = []));
          }),
          (n.cssRules = function () {
            var e = this;
            return "undefined" == typeof window
              ? this._serverSheet.cssRules
              : this._tags.reduce(function (t, n) {
                  return (
                    n
                      ? (t = t.concat(
                          Array.prototype.map.call(
                            e.getSheetForTag(n).cssRules,
                            function (t) {
                              return t.cssText === e._deletedRulePlaceholder
                                ? null
                                : t;
                            },
                          ),
                        ))
                      : t.push(null),
                    t
                  );
                }, []);
          }),
          (n.makeStyleTag = function (e, t, n) {
            t &&
              u(a(t), "makeStyleTag accepts only strings as second parameter");
            var r = document.createElement("style");
            (this._nonce && r.setAttribute("nonce", this._nonce),
              (r.type = "text/css"),
              r.setAttribute("data-" + e, ""),
              t && r.appendChild(document.createTextNode(t)));
            var i = document.head || document.getElementsByTagName("head")[0];
            return (n ? i.insertBefore(r, n) : i.appendChild(r), r);
          }),
          (t = [
            {
              key: "length",
              get: function () {
                return this._rulesCount;
              },
            },
          ]),
          (function (e, t) {
            for (var n = 0; n < t.length; n++) {
              var r = t[n];
              ((r.enumerable = r.enumerable || !1),
                (r.configurable = !0),
                "value" in r && (r.writable = !0),
                Object.defineProperty(e, r.key, r));
            }
          })(e.prototype, t),
          e
        );
      })();
    function u(e, t) {
      if (!e) throw Error("StyleSheet: " + t + ".");
    }
    var c = function (e) {
        for (var t = 5381, n = e.length; n; ) t = (33 * t) ^ e.charCodeAt(--n);
        return t >>> 0;
      },
      d = {};
    function f(e, t) {
      if (!t) return "jsx-" + e;
      var n = String(t),
        r = e + n;
      return (d[r] || (d[r] = "jsx-" + c(e + "-" + n)), d[r]);
    }
    function h(e, t) {
      "undefined" == typeof window && (t = t.replace(/\/style/gi, "\\/style"));
      var n = e + t;
      return (
        d[n] || (d[n] = t.replace(/__jsx-style-dynamic-selector/g, e)),
        d[n]
      );
    }
    var p = (function () {
        function e(e) {
          var t = void 0 === e ? {} : e,
            n = t.styleSheet,
            r = void 0 === n ? null : n,
            i = t.optimizeForSpeed,
            s = void 0 !== i && i;
          ((this._sheet =
            r || new l({ name: "styled-jsx", optimizeForSpeed: s })),
            this._sheet.inject(),
            r &&
              "boolean" == typeof s &&
              (this._sheet.setOptimizeForSpeed(s),
              (this._optimizeForSpeed = this._sheet.isOptimizeForSpeed())),
            (this._fromServer = void 0),
            (this._indices = {}),
            (this._instancesCounts = {}));
        }
        var t = e.prototype;
        return (
          (t.add = function (e) {
            var t = this;
            (void 0 === this._optimizeForSpeed &&
              ((this._optimizeForSpeed = Array.isArray(e.children)),
              this._sheet.setOptimizeForSpeed(this._optimizeForSpeed),
              (this._optimizeForSpeed = this._sheet.isOptimizeForSpeed())),
              "undefined" == typeof window ||
                this._fromServer ||
                ((this._fromServer = this.selectFromServer()),
                (this._instancesCounts = Object.keys(this._fromServer).reduce(
                  function (e, t) {
                    return ((e[t] = 0), e);
                  },
                  {},
                ))));
            var n = this.getIdAndRules(e),
              r = n.styleId,
              i = n.rules;
            if (r in this._instancesCounts) {
              this._instancesCounts[r] += 1;
              return;
            }
            var s = i
              .map(function (e) {
                return t._sheet.insertRule(e);
              })
              .filter(function (e) {
                return -1 !== e;
              });
            ((this._indices[r] = s), (this._instancesCounts[r] = 1));
          }),
          (t.remove = function (e) {
            var t = this,
              n = this.getIdAndRules(e).styleId;
            if (
              ((function (e, t) {
                if (!e) throw Error("StyleSheetRegistry: " + t + ".");
              })(n in this._instancesCounts, "styleId: `" + n + "` not found"),
              (this._instancesCounts[n] -= 1),
              this._instancesCounts[n] < 1)
            ) {
              var r = this._fromServer && this._fromServer[n];
              (r
                ? (r.parentNode.removeChild(r), delete this._fromServer[n])
                : (this._indices[n].forEach(function (e) {
                    return t._sheet.deleteRule(e);
                  }),
                  delete this._indices[n]),
                delete this._instancesCounts[n]);
            }
          }),
          (t.update = function (e, t) {
            (this.add(t), this.remove(e));
          }),
          (t.flush = function () {
            (this._sheet.flush(),
              this._sheet.inject(),
              (this._fromServer = void 0),
              (this._indices = {}),
              (this._instancesCounts = {}));
          }),
          (t.cssRules = function () {
            var e = this,
              t = this._fromServer
                ? Object.keys(this._fromServer).map(function (t) {
                    return [t, e._fromServer[t]];
                  })
                : [],
              n = this._sheet.cssRules();
            return t.concat(
              Object.keys(this._indices)
                .map(function (t) {
                  return [
                    t,
                    e._indices[t]
                      .map(function (e) {
                        return n[e].cssText;
                      })
                      .join(e._optimizeForSpeed ? "" : "\n"),
                  ];
                })
                .filter(function (e) {
                  return !!e[1];
                }),
            );
          }),
          (t.styles = function (e) {
            var t, n;
            return (
              (t = this.cssRules()),
              void 0 === (n = e) && (n = {}),
              t.map(function (e) {
                var t = e[0],
                  r = e[1];
                return s.default.createElement("style", {
                  id: "__" + t,
                  key: "__" + t,
                  nonce: n.nonce ? n.nonce : void 0,
                  dangerouslySetInnerHTML: { __html: r },
                });
              })
            );
          }),
          (t.getIdAndRules = function (e) {
            var t = e.children,
              n = e.dynamic,
              r = e.id;
            if (n) {
              var i = f(r, n);
              return {
                styleId: i,
                rules: Array.isArray(t)
                  ? t.map(function (e) {
                      return h(i, e);
                    })
                  : [h(i, t)],
              };
            }
            return { styleId: f(r), rules: Array.isArray(t) ? t : [t] };
          }),
          (t.selectFromServer = function () {
            return Array.prototype.slice
              .call(document.querySelectorAll('[id^="__jsx-"]'))
              .reduce(function (e, t) {
                return ((e[t.id.slice(2)] = t), e);
              }, {});
          }),
          e
        );
      })(),
      m = i.createContext(null);
    function v() {
      return new p();
    }
    function y() {
      return i.useContext(m);
    }
    m.displayName = "StyleSheetContext";
    var w = s.default.useInsertionEffect || s.default.useLayoutEffect,
      g = "undefined" != typeof window ? v() : void 0;
    function _(e) {
      var t = g || y();
      return (
        t &&
          ("undefined" == typeof window
            ? t.add(e)
            : w(
                function () {
                  return (
                    t.add(e),
                    function () {
                      t.remove(e);
                    }
                  );
                },
                [e.id, String(e.dynamic)],
              )),
        null
      );
    }
    ((_.dynamic = function (e) {
      return e
        .map(function (e) {
          return f(e[0], e[1]);
        })
        .join(" ");
    }),
      (n.StyleRegistry = function (e) {
        var t = e.registry,
          n = e.children,
          r = i.useContext(m),
          o = i.useState(function () {
            return r || t || v();
          })[0];
        return s.default.createElement(m.Provider, { value: o }, n);
      }),
      (n.createStyleRegistry = v),
      (n.style = _),
      (n.useStyleRegistry = y));
  },
  37902,
  (e, t, n) => {
    t.exports = e.r(98547).style;
  },
  70216,
  (e) => {
    "use strict";
    e.s(["BlackholeLoader", () => l]);
    var t = e.i(43476),
      n = e.i(37902),
      r = e.i(71645),
      i = e.i(89970),
      s = e.i(31221),
      o = e.i(18566);
    let a = () =>
        (0, t.jsxs)("svg", {
          width: "240",
          height: "100",
          viewBox: "0 0 240 100",
          className: "jsx-fadc7542b94384f6 audio-wave-heart",
          children: [
            Array.from({ length: 20 }).map((e, n) => {
              let r = 10 + 11 * n,
                i = 0.04 * n,
                s = Math.floor(10),
                o = Math.abs(n - s);
              return (0, t.jsx)(
                "rect",
                {
                  x: r,
                  y: "42",
                  width: "3",
                  height: "16",
                  rx: "1.5",
                  fill: "white",
                  style: {
                    animation: "heartbeat 0.8s ease-in-out ".concat(
                      i,
                      "s infinite",
                    ),
                    transformOrigin: "".concat(r + 1.5, "px 50px"),
                    opacity: 0.7 + 0.3 * (1 - (o / s) * 0.4),
                  },
                  className: "jsx-fadc7542b94384f6",
                },
                n,
              );
            }),
            (0, t.jsx)(n.default, {
              id: "fadc7542b94384f6",
              children:
                "@keyframes heartbeat{0%,to{opacity:.5;transform:scaleY(.8)}50%{opacity:1;transform:scaleY(3.2)}}",
            }),
          ],
        }),
      l = () => {
        let [e, n] = (0, r.useState)(!0),
          l = (0, r.useRef)(null),
          u = (0, r.useRef)(null),
          c = (0, r.useRef)(null),
          d = (0, o.usePathname)();
        return ((0, r.useEffect)(() => {
          let e = Date.now(),
            t = "/" === d,
            r = "true" === sessionStorage.getItem("hasSeenWelcome"),
            o = () => {
              if (!l.current) return;
              let n = l.current,
                s = u.current,
                o = c.current,
                d = Date.now() - e,
                f = t && !r;
              setTimeout(
                () => {
                  s &&
                    i.gsap.to(s, {
                      opacity: 0,
                      scale: 0.8,
                      duration: 0.5,
                      ease: "power2.in",
                      onComplete: () => {
                        if (f && o) {
                          let e = o.querySelectorAll(".letter");
                          (sessionStorage.setItem("hasSeenWelcome", "true"),
                            i.gsap.fromTo(
                              e,
                              { opacity: 0, y: 20 },
                              {
                                opacity: 1,
                                y: 0,
                                duration: 0.3,
                                stagger: 0.08,
                                ease: "power2.out",
                                onComplete: () => {
                                  i.gsap.to(e, {
                                    opacity: 0,
                                    duration: 0.4,
                                    stagger: 0.05,
                                    delay: 0.5,
                                    ease: "power2.in",
                                    onComplete: () => {
                                      a(n);
                                    },
                                  });
                                },
                              },
                            ));
                        } else a(n);
                      },
                    });
                },
                Math.max(0, 1500 - d),
              );
            },
            a = (e) => {
              let t = { radius: 0 };
              i.gsap.to(t, {
                radius: 150,
                duration: 1.2,
                ease: "power2.inOut",
                onUpdate: () => {
                  if (e) {
                    let n = "radial-gradient(circle at center, transparent "
                      .concat(t.radius, "%, black ")
                      .concat(t.radius, "%)");
                    ((e.style.background = n),
                      t.radius >= 20 &&
                        !s.loaderHalfDone.value &&
                        (s.loaderHalfDone.value = !0));
                  }
                },
                onComplete: () => {
                  n(!1);
                },
              });
            };
          if ("complete" !== document.readyState)
            return (
              window.addEventListener("load", o),
              () => window.removeEventListener("load", o)
            );
          o();
        }, [d]),
        e)
          ? (0, t.jsxs)(t.Fragment, {
              children: [
                (0, t.jsx)("div", {
                  ref: l,
                  className: "fixed inset-0 z-[9999]",
                  style: {
                    pointerEvents: "none",
                    background:
                      "radial-gradient(circle at center, transparent 0%, black 0%)",
                  },
                }),
                (0, t.jsx)("div", {
                  ref: u,
                  className:
                    "fixed inset-0 z-[10000] flex items-center justify-center",
                  style: { pointerEvents: "none" },
                  children: (0, t.jsx)(a, {}),
                }),
                (0, t.jsx)("div", {
                  ref: c,
                  className:
                    "fixed inset-0 z-[10000] flex items-center justify-center",
                  style: { pointerEvents: "none" },
                  children: (0, t.jsx)("div", {
                    className:
                      "text-white text-4xl md:text-5xl lg:text-6xl font-oxanium-light tracking-wider",
                    children: "Hi, Welcome"
                      .split("")
                      .map((e, n) =>
                        (0, t.jsx)(
                          "span",
                          {
                            className: "letter inline-block opacity-0",
                            style: { whiteSpace: " " === e ? "pre" : "normal" },
                            children: e,
                          },
                          n,
                        ),
                      ),
                  }),
                }),
              ],
            })
          : null;
      };
  },
  2355,
  (e) => {
    "use strict";
    e.s(["Analytics", () => c]);
    var t = e.i(47167),
      n = e.i(71645),
      r = e.i(18566);
    function i() {
      return "undefined" != typeof window;
    }
    function s() {
      return "production";
    }
    function o() {
      return "development" === ((i() ? window.vam : s()) || "production");
    }
    function a(e) {
      return new RegExp(
        "/".concat(e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "(?=[/?#]|$)"),
      );
    }
    function l(e) {
      return (
        (0, n.useEffect)(() => {
          var t;
          e.beforeSend &&
            (null == (t = window.va) ||
              t.call(window, "beforeSend", e.beforeSend));
        }, [e.beforeSend]),
        (0, n.useEffect)(() => {
          var n;
          !(function () {
            var e;
            let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : { debug: !0 };
            if (!i()) return;
            (!(function () {
              let e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : "auto";
              if ("auto" === e) {
                window.vam = s();
                return;
              }
              window.vam = e;
            })(t.mode),
              window.va ||
                (window.va = function () {
                  for (
                    var e = arguments.length, t = Array(e), n = 0;
                    n < e;
                    n++
                  )
                    t[n] = arguments[n];
                  (window.vaq = window.vaq || []).push(t);
                }),
              t.beforeSend &&
                (null == (e = window.va) ||
                  e.call(window, "beforeSend", t.beforeSend)));
            let n = t.scriptSrc
              ? t.scriptSrc
              : o()
                ? "https://va.vercel-scripts.com/v1/script.debug.js"
                : t.basePath
                  ? "".concat(t.basePath, "/insights/script.js")
                  : "/_vercel/insights/script.js";
            if (document.head.querySelector('script[src*="'.concat(n, '"]')))
              return;
            let r = document.createElement("script");
            ((r.src = n),
              (r.defer = !0),
              (r.dataset.sdkn =
                "@vercel/analytics" +
                (t.framework ? "/".concat(t.framework) : "")),
              (r.dataset.sdkv = "1.5.0"),
              t.disableAutoTrack && (r.dataset.disableAutoTrack = "1"),
              t.endpoint
                ? (r.dataset.endpoint = t.endpoint)
                : t.basePath &&
                  (r.dataset.endpoint = "".concat(t.basePath, "/insights")),
              t.dsn && (r.dataset.dsn = t.dsn),
              (r.onerror = () => {
                let e = o()
                  ? "Please check if any ad blockers are enabled and try again."
                  : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
                console.log(
                  "[Vercel Web Analytics] Failed to load script from "
                    .concat(n, ". ")
                    .concat(e),
                );
              }),
              o() && !1 === t.debug && (r.dataset.debug = "false"),
              document.head.appendChild(r));
          })({
            framework: e.framework || "react",
            basePath:
              null != (n = e.basePath)
                ? n
                : (function () {
                    if (void 0 !== t.default && void 0 !== t.default.env)
                      return t.default.env
                        .REACT_APP_VERCEL_OBSERVABILITY_BASEPATH;
                  })(),
            ...(void 0 !== e.route && { disableAutoTrack: !0 }),
            ...e,
          });
        }, []),
        (0, n.useEffect)(() => {
          e.route &&
            e.path &&
            (function (e) {
              var t;
              let { route: n, path: r } = e;
              null == (t = window.va) ||
                t.call(window, "pageview", { route: n, path: r });
            })({ route: e.route, path: e.path });
        }, [e.route, e.path]),
        null
      );
    }
    function u(e) {
      let { route: i, path: s } = (() => {
        let e = (0, r.useParams)(),
          t = (0, r.useSearchParams)(),
          n = (0, r.usePathname)();
        return e
          ? {
              route: (function (e, t) {
                if (!e || !t) return e;
                let n = e;
                try {
                  let e = Object.entries(t);
                  for (let [t, r] of e)
                    if (!Array.isArray(r)) {
                      let e = a(r);
                      e.test(n) && (n = n.replace(e, "/[".concat(t, "]")));
                    }
                  for (let [t, r] of e)
                    if (Array.isArray(r)) {
                      let e = a(r.join("/"));
                      e.test(n) && (n = n.replace(e, "/[...".concat(t, "]")));
                    }
                  return n;
                } catch (t) {
                  return e;
                }
              })(
                n,
                Object.keys(e).length ? e : Object.fromEntries(t.entries()),
              ),
              path: n,
            }
          : { route: null, path: n };
      })();
      return n.default.createElement(l, {
        path: s,
        route: i,
        ...e,
        basePath: (function () {
          if (void 0 !== t.default && void 0 !== t.default.env)
            return t.default.env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_BASEPATH;
        })(),
        framework: "next",
      });
    }
    function c(e) {
      return n.default.createElement(
        n.Suspense,
        { fallback: null },
        n.default.createElement(u, { ...e }),
      );
    }
  },
]);
