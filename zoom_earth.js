/*! Zoom Earth @author Neave Interactive, neave.com @copyright 2025 */
!(function () {
  "use strict";
  !(function (t, s, i) {
    ((t.requestIdleCallback =
      t.requestIdleCallback ||
      function (t) {
        return setTimeout(t, 10);
      }),
      (t.cancelIdleCallback =
        t.cancelIdleCallback ||
        function (t) {
          clearTimeout(t);
        }),
      (s.prototype.at =
        s.prototype.at ||
        function (t) {
          return (t < 0 && (t += this.length), this[t]);
        }),
      (i.prototype.replaceChildren =
        i.prototype.replaceChildren ||
        function (t) {
          for (; this.lastChild; ) this.removeChild(this.lastChild);
          void 0 !== t && this.appendChild(t);
        }));
  })(window, Array, Node);
  const t = "change",
    s = "click",
    i = "close",
    h = "contextmenu",
    e = "coordinate",
    n = "date",
    r = "details",
    o = "dblclick",
    a = "error",
    c = "favoriteselect",
    l = "fireselect",
    u = "geodotselect",
    d = "geolocation",
    f = "hide",
    m = "init",
    p = "intro",
    g = "labelselect",
    w = "link",
    v = "load",
    y = "locationselect",
    M = "measure",
    b = "measurehide",
    A = "mousedown",
    T = "mouseleave",
    x = "mousemove",
    E = "mouseout",
    D = "mouseover",
    I = "mouseup",
    S = "mousewheel",
    R = "move",
    k = "outage",
    L = "pause",
    N = "play",
    O = "progress",
    C = "propertychange",
    F = "recent",
    P = "record",
    z = "request",
    U = "search",
    W = "searchhide",
    G = "select",
    j = "show",
    _ = "singleclick",
    B = "stop",
    Z = "storm",
    H = "stormhide",
    Y = "stormselect",
    q = "time",
    $ = "toggle",
    V = "touchcancel",
    K = "touchend",
    J = "touchmove",
    X = "touchstart",
    Q = "update",
    tt = "visibilitychange",
    st = "wheel",
    it = (t, s) => Math.round(t * s) / s,
    ht = (t, s, i) => it(t, i) === it(s, i),
    et = (t, s, i) => Math.min(i, Math.max(s, t)),
    nt = (t, s) => ((t % s) + s) % s,
    rt = (t) => nt(t, 360),
    ot = (t) => t * t,
    at = 180 / Math.PI,
    ct = (t) => t * at,
    lt = (t) => t / at,
    ut = (t, s, i) => t + i * (s - t),
    dt = (t) => 1.8 * t + 32,
    ft = (t, s) => Math.sqrt(t * t + s * s),
    mt = (t, s, i, h) => {
      const e = i - t,
        n = h - s;
      return e * e + n * n;
    },
    pt = Object.freeze({
      GOES_WEST: "goes-west",
      GOES_EAST: "goes-east",
      MTG_ZERO: "mtg-zero",
      MSG_ZERO: "msg-zero",
      MSG_IODC: "msg-iodc",
      HIMAWARI: "himawari",
      GEO_KOMPSAT: "geo-kompsat",
    }),
    gt = Object.freeze(Object.values(pt)),
    wt = (t, s, i) =>
      i
        ? ((i[0] = t[0] - s),
          (i[1] = t[1] - s),
          (i[2] = t[2] + s),
          (i[3] = t[3] + s),
          i)
        : [t[0] - s, t[1] - s, t[2] + s, t[3] + s],
    vt = (t, s) =>
      s
        ? ((s[0] = t[0]), (s[1] = t[1]), (s[2] = t[2]), (s[3] = t[3]), s)
        : t.slice(),
    yt = (t, s) => bt(t, s[0], s[1]),
    Mt = (t, s) => t[0] <= s[0] && s[2] <= t[2] && t[1] <= s[1] && s[3] <= t[3],
    bt = (t, s, i) => t[0] <= s && s <= t[2] && t[1] <= i && i <= t[3],
    At = (t, s) => {
      const i = t[0],
        h = t[1],
        e = t[2],
        n = t[3],
        r = s[0],
        o = s[1];
      let a = 0;
      return (
        r < i ? (a |= 16) : r > e && (a |= 4),
        o < h ? (a |= 8) : o > n && (a |= 2),
        0 === a && (a = 1),
        a
      );
    },
    Tt = (t, s, i, h, e) =>
      e ? ((e[0] = t), (e[1] = s), (e[2] = i), (e[3] = h), e) : [t, s, i, h],
    xt = (t) => Tt(1 / 0, 1 / 0, -1 / 0, -1 / 0, t),
    Et = (t, s) =>
      t[0] === s[0] && t[2] === s[2] && t[1] === s[1] && t[3] === s[3],
    Dt = (t, s, i) => {
      ((t[0] = Math.min(t[0], s)),
        (t[1] = Math.min(t[1], i)),
        (t[2] = Math.max(t[2], s)),
        (t[3] = Math.max(t[3], i)));
    },
    It = (t) => [(t[0] + t[2]) / 2, (t[1] + t[3]) / 2],
    St = (t, s, i, h) => {
      const e = (s * i[0]) / 2,
        n = (s * i[1]) / 2,
        r = t[0] || 0,
        o = r - e,
        a = r + e,
        c = t[1] || 0,
        l = c - n,
        u = c + n;
      return Tt(
        Math.min(o, a),
        Math.min(l, u),
        Math.max(o, a),
        Math.max(l, u),
        h
      );
    },
    Rt = (t) => t[3] - t[1],
    kt = (t, s, i) => {
      const h = i || [1 / 0, 1 / 0, -1 / 0, -1 / 0];
      return (
        Ot(t, s)
          ? (t[0] > s[0] ? (h[0] = t[0]) : (h[0] = s[0]),
            t[1] > s[1] ? (h[1] = t[1]) : (h[1] = s[1]),
            t[2] < s[2] ? (h[2] = t[2]) : (h[2] = s[2]),
            t[3] < s[3] ? (h[3] = t[3]) : (h[3] = s[3]))
          : xt(h),
        h
      );
    },
    Lt = (t) => [t[0], t[3]],
    Nt = (t) => t[2] - t[0],
    Ot = (t, s) => t[0] <= s[2] && t[2] >= s[0] && t[1] <= s[3] && t[3] >= s[1],
    Ct = (t) => t[2] < t[0] || t[3] < t[1],
    Ft = (t, s) =>
      ((t, s) => {
        const i = ((t[2] - t[0]) / 2) * (s - 1),
          h = ((t[3] - t[1]) / 2) * (s - 1);
        return ((t[0] -= i), (t[2] += i), (t[1] -= h), (t[3] += h), t);
      })(vt(t), 2 ** -s),
    Pt = (t, s, i) => {
      const h = [t[0], t[1], t[0], t[3], t[2], t[1], t[2], t[3]];
      return (
        s(h, h),
        ((t, s, i) => {
          const h = Math.min.apply(null, t),
            e = Math.min.apply(null, s),
            n = Math.max.apply(null, t),
            r = Math.max.apply(null, s);
          return Tt(h, e, n, r, i);
        })([h[0], h[2], h[4], h[6]], [h[1], h[3], h[5], h[7]], i)
      );
    },
    zt = 6378137,
    Ut = zt * Math.PI,
    Wt = 2 * Ut,
    Gt = [-Ut, -Ut, Ut, Ut],
    jt = (t) => (
      (t[0] %= Wt),
      t[0] < -Ut && (t[0] += Wt),
      t[0] > Ut && (t[0] -= Wt),
      t
    ),
    _t = (t) => nt(t + 180, 360) - 180,
    Bt = (t, s) => (
      s < 0 && t[0] > 105 && (t[0] -= 360),
      s > 0 && t[0] < -105 && (t[0] += 360),
      t
    ),
    Zt = (t, s) => [
      t / 180,
      Math.log(Math.tan((Math.PI * (s + 90)) / 360)) / Math.PI,
    ],
    Ht = (t, s) => {
      const i = 180 * t,
        h = s * Math.PI;
      return [
        i,
        (180 / Math.PI) * Math.atan(0.5 * (Math.exp(h) - Math.exp(-h))),
      ];
    },
    Yt = (t) => {
      let [s, i] = Ht(t[0] / Ut, t[1] / Ut);
      return [_t(s), i];
    },
    qt = function (t, s, i, h, e) {
      void 0 === e && (e = 0.00001);
      const n = _t(i - t),
        r = h - s;
      return n * n + r * r <= e * e;
    },
    $t = Math.SQRT2 - 1,
    Vt = 1000,
    Kt = 1609.344,
    Jt = 3.28084,
    Xt = 4046.8564224,
    Qt = (t, s, i) => {
      const h = t.length,
        e = i > 1 ? i : 2;
      let n = s;
      void 0 === n && (n = e > 2 ? t.slice() : new Array(h));
      for (let s = 0; s < h; s += e)
        ((n[s] = (t[s] / 180) * Ut),
          (n[s + 1] = et(
            zt * Math.log(Math.tan((Math.PI * (t[s + 1] + 90)) / 360)),
            -Ut,
            Ut
          )));
      return n;
    },
    ts = (t, s, i) => {
      const h = t.length,
        e = i > 1 ? i : 2;
      let n = s;
      void 0 === n && (n = e > 2 ? t.slice() : new Array(h));
      for (let s = 0; s < h; s += e)
        ((n[s] = (180 * t[s]) / Ut),
          (n[s + 1] =
            (360 * Math.atan(Math.exp(t[s + 1] / zt))) / Math.PI - 90));
      return n;
    },
    ss = (t) => {
      const s = ts(t);
      return [_t(s[0]), s[1]];
    },
    is = (t, s) => {
      const i = jt(s);
      return (
        (t >= 90 || t < -90) &&
          (i[0] >= 0 && t < 0
            ? (i[0] -= Wt)
            : i[0] < 0 && t >= 0 && (i[0] += Wt)),
        i
      );
    },
    hs = (t, s, i) => {
      const h = [i[0] - s[0], i[1] - s[1]],
        e = [t[0] - s[0], t[1] - s[1]],
        n = (e[0] * h[0] + e[1] * h[1]) / (h[0] * h[0] + h[1] * h[1]);
      return {
        t: n,
        point: [s[0] + h[0] * n, s[1] + h[1] * n],
      };
    },
    es = (t, s) => {
      const i = t[0],
        h = 2 ** i,
        e = -1 - t[2];
      return {
        x: s ? nt(t[1], h) : t[1],
        y: e,
        z: i,
        size: h,
      };
    },
    ns = (t) =>
      t.replace(/[a-z]/gi, (t) => {
        const s = t.charCodeAt(0),
          i = (31 & s) - 1;
        return String.fromCharCode(s - i + ((i + 13) % 26));
      }),
    rs = new (class {
      ob(t) {
        return t;
      }
      i(t) {
        return ((t) => atob(ns(t)))(t);
      }
    })(),
    os = rs.i("Y2EuqTRi"),
    as = os + rs.i("MzylMKZi"),
    cs = os + rs.i("M2IiL29xMF8="),
    ls = os + rs.i("oT9aYj=="),
    us = os + rs.i("oz90nJMcL2S0nJ9hpl8="),
    ds = os + rs.i("o3I0LJqypl8="),
    fs = os + rs.i("pTyhMl8="),
    ms = os + rs.i("pTkuL2ImYj==");
  rs.i("pUImnP8=");
  const ps = os + rs.i("p2IupzAbYj=="),
    gs = os + rs.i("p3Eipz1mYj==");
  rs.i("p3Ivp2AlnKO0nJ9hYj==");
  const ws = os + rs.i("qTygMF8="),
    vs = os + rs.i("qzIlp2yiov8="),
    ys = rs.i("Y2Smp2I0pl9coJSaMKZinJAioaZi"),
    Ms = rs.i("nUE0pUZ6Yl90nJkypl56o29gYzIupaEbYj=="),
    bs = Ms + rs.i("pzSxLKViL292MKWuM2Hi"),
    As = Ms + rs.i("pzSxLKVipzIzoTIwqTy2nKE5Yj=="),
    Ts = Ms + rs.i("qTygMKZi");
  rs.i("Y3EcoTImYj==");
  const xs = rs.i("nUE0pUZ6Yl9upTxhrz9ioF5yLKW0nP8=") + rs.i("q2IuqTuypv8="),
    Es = rs.i(
      "nUE0pUZ6Yl9anJWmr30hMJSlqTuxLKEuYz5up2RhM292Y3qgqUZiMKOmMmZ4AGpiLzImqP8="
    ),
    Ds = 6000,
    Is = (window._ZE || {}).strings || {},
    Ss = (t) => Is.punctuation.percent.replace("%s", et(Math.round(t), 0, 100)),
    Rs = 300,
    ks = () => document.documentElement.clientWidth || innerWidth,
    Ls = () => document.documentElement.clientHeight || innerHeight,
    Ns = () => ks() <= 679 || Ls() <= 539,
    Os = 5.625,
    Cs = {};
  ((Cs[pt.GOES_WEST] = -135),
    (Cs[pt.GOES_EAST] = -16.875),
    (Cs.goesEastBeta = -28.125),
    (Cs[pt.MTG_ZERO] = 36.5625),
    (Cs[pt.MSG_ZERO] = 36.5625),
    (Cs[pt.MSG_IODC] = 90),
    (Cs[pt.HIMAWARI] = 180));
  const Fs = 66.51326044311186,
    Ps = -180 - Cs[pt.MSG_IODC],
    zs = 360 + Cs[pt.GOES_EAST],
    Us = (t, s, i, h) => Pt([t, i, s, h], Qt),
    Ws = {};
  ((Ws[pt.GOES_WEST] = Us(-177.1875, Cs[pt.GOES_WEST] + 2.8125, -Fs, Fs)),
    (Ws[pt.GOES_EAST] = Us(
      Cs[pt.GOES_WEST] + 2.8125,
      Cs[pt.GOES_EAST] + 2.8125,
      -Fs,
      Fs
    )),
    (Ws.goesEastBeta = Us(
      Cs[pt.GOES_WEST] + 2.8125,
      Cs.goesEastBeta + 2.8125,
      -Fs,
      Fs
    )),
    (Ws[pt.MTG_ZERO] = Us(Cs.goesEastBeta + 2.8125, Cs[pt.MTG_ZERO], -Fs, Fs)),
    (Ws[pt.MSG_ZERO] = Us(Cs[pt.GOES_EAST] + 2.8125, Cs[pt.MSG_ZERO], -Fs, Fs)),
    (Ws[pt.MSG_IODC] = Us(Cs[pt.MSG_ZERO], Cs[pt.MSG_IODC] - 2.8125, -Fs, Fs)),
    (Ws.msgAll = Us(
      Cs[pt.GOES_EAST] + 2.8125,
      Cs[pt.MSG_IODC] - 2.8125,
      -Fs,
      Fs
    )),
    (Ws.msgAllBeta = Us(Cs[pt.MTG_ZERO], Cs[pt.MSG_IODC] - 2.8125, -Fs, Fs)),
    (Ws[pt.HIMAWARI] = Us(Cs[pt.MSG_IODC] - 2.8125, 180, -Fs, Fs)),
    (Ws.himawariWrap = Us(-180, -177.1875, -Fs, Fs)));
  const Gs = {
      goesWest: Us(-180, Cs[pt.GOES_WEST] + Os, -Fs, Fs),
      goesWestWrap: Us(180, Cs[pt.GOES_WEST] + Os + 360, -Fs, Fs),
      goesEast: Us(Cs[pt.GOES_WEST], Cs[pt.GOES_EAST] + Os, -Fs, Fs),
      goesEastWrap: Us(Cs[pt.GOES_WEST] + 360, Cs[pt.GOES_EAST] + 360, -Fs, Fs),
      goesEastBeta: Us(Cs[pt.GOES_WEST], Cs.goesEastBeta + Os, -Fs, Fs),
      goesEastBetaWrap: Us(
        Cs[pt.GOES_WEST] + 360,
        Cs.goesEastBeta + 360,
        -Fs,
        Fs
      ),
      mtgZero: Us(Cs.goesEastBeta, Cs[pt.MTG_ZERO] + 2.8125, -Fs, Fs),
      msgZero: Us(Cs[pt.GOES_EAST], Cs[pt.MSG_ZERO] + 2.8125, -Fs, Fs),
      msgIodc: Us(Cs[pt.MSG_ZERO] - 2.8125, Cs[pt.MSG_IODC], -Fs, Fs),
      metAll: Us(Cs[pt.GOES_EAST], Cs[pt.MSG_IODC], -Fs, Fs),
      himawari: Us(Cs[pt.MSG_IODC] - Os, 185.625, -Fs, Fs),
      himawariWrap: Us(Ps, -174.375, -Fs, Fs),
      north: Us(Ps, zs, Fs, 90),
      south: Us(Ps, zs, -Fs, -90),
      wide: Us(Ps, zs, -90, 90),
      all: Us(-180, 180, -Fs, Fs),
    },
    js = Us(-900, 900, -90, 90),
    _s = {
      all: new Date(Date.UTC(2000, 0, 1)),
      aqua: new Date(Date.UTC(2002, 6, 4)),
      heat: new Date(Date.UTC(2020, 0, 1)),
    },
    Bs = (t, s) => (void 0 === t ? s : t),
    Zs = (t) => {
      for (let s in t) delete t[s];
    },
    Hs = (t) => {
      let s;
      for (s in t) return !1;
      return !s;
    },
    Ys = (t) => "object" == typeof t && null !== t,
    qs = (t) => "function" == typeof t,
    $s = Number.isFinite,
    Vs = (t) => !0 === t || !1 === t,
    Ks = (t, s) => Object.values(t).includes(s),
    Js = "Invalid data";
  class Xs {
    constructor() {
      ((this.timeoutID = 0), (this.controller = new AbortController()));
    }
    cancel() {
      (clearTimeout(this.timeoutID),
        this.controller && (this.controller.abort(), (this.controller = null)));
    }
    load(t) {
      const {
        url: s,
        params: i,
        formData: h,
        headers: e,
        method: n,
        validate: r,
        responseType: o,
        timeout: a,
      } = t;
      return new Promise((t, c) => {
        let l = !1,
          u = "";
        if (this.controller) {
          if (
            ((this.timeoutID = setTimeout(() => {
              ((l = !0), this.cancel());
            }, a || Ds)),
            i)
          ) {
            const t = new URLSearchParams(i).toString();
            t && (u = "?" + t);
          }
          fetch(s + u, {
            method: h ? "POST" : n || "GET",
            body: h,
            headers: e,
            signal: this.controller.signal,
          })
            .then((t) => {
              if (
                (clearTimeout(this.timeoutID),
                (this.controller = null),
                204 !== t.status)
              )
                return t.ok
                  ? ((this.modifiedTime = Date.parse(
                      t.headers.get("Last-Modified")
                    )),
                    "text" === o
                      ? t.text()
                      : "blob" === o
                        ? t.blob()
                        : -1 !== t.headers.get("Content-Type").indexOf("json")
                          ? t.json()
                          : Promise.reject())
                  : Promise.reject();
            })
            .then((s) => {
              if (Ys(s)) {
                if (s.error) return Promise.reject(new Error(s.error));
                if (Array.isArray(r))
                  for (let t = r.length; t--; )
                    if (null == s[r[t]]) return Promise.reject(new Error(Js));
              }
              t(s);
            })
            .catch((t) => {
              (!l && t && "AbortError" === t.name && "blob" !== o) ||
                c(
                  new Error(
                    l
                      ? "Timeout"
                      : navigator.onLine
                        ? (t && t.message) || Js
                        : "Network error"
                  )
                );
            });
        } else c(new Error("Error"));
      });
    }
  }
  const Qs = new (class {
      constructor() {
        ((this.log = []), (this.isEnabled = !1));
      }
      clear() {
        this.log.length = 0;
      }
      add(t, s) {
        if (
          this.log.length >= 10 ||
          (t &&
            /(Script error|getReadMode|vid_mate|Blocked a frame|chrome-extension)/.test(
              t
            )) ||
          (s &&
            /(timeout|network ?error|failed to fetch|load failed|cancelado|request aborted)/i.test(
              s
            ))
        )
          return;
        const i = (t || "") + (s ? ": " + s : "");
        this.log.push(i);
      }
      submit(t) {
        if (
          !this.isEnabled ||
          0 === this.log.length ||
          !navigator.onLine ||
          document.hidden
        )
          return;
        const s = new FormData();
        (s.append("v", t.app),
          s.append("e", this.log.join("\n")),
          new Xs()
            .load({
              url: ls,
              formData: s,
              responseType: "text",
            })
            .then((t) => {
              ((this.isEnabled = "1" === t), this.clear());
            })
            .catch((t) => {
              ((this.isEnabled = !1), this.clear());
            }));
      }
    })(),
    ti = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ],
    si = (t, s) => (
      t.setUTCMinutes(Math.round(t.getUTCMinutes() / s) * s, 0, 0),
      t
    ),
    ii = Object.freeze({
      PRECIPITATION: "precipitation",
      WIND_SPEED: "wind-speed",
      WIND_GUSTS: "wind-gusts",
      TEMPERATURE: "temperature",
      TEMPERATURE_FEEL: "temperature-feel",
      TEMPERATURE_WET_BULB: "temperature-wet-bulb",
      HUMIDITY: "humidity",
      DEW_POINT: "dew-point",
      PRESSURE: "pressure",
    }),
    hi = Object.freeze(Object.values(ii)),
    ei = Object.freeze({
      ABOVE_GROUND_10M: "10m",
      ABOVE_GROUND_2M: "2m",
      MEAN_SEA_LEVEL: "msl",
      SURFACE: "surface",
      ALL: "all",
    });
  Object.freeze(Object.values(ei));
  const ni = {};
  ((ni[ii.PRECIPITATION] = ei.SURFACE),
    (ni[ii.WIND_SPEED] = ei.ABOVE_GROUND_10M),
    (ni[ii.WIND_GUSTS] = ei.SURFACE),
    (ni[ii.TEMPERATURE] = ei.ABOVE_GROUND_2M),
    (ni[ii.TEMPERATURE_FEEL] = ei.ABOVE_GROUND_2M),
    (ni[ii.TEMPERATURE_WET_BULB] = ei.ABOVE_GROUND_2M),
    (ni[ii.HUMIDITY] = ei.ABOVE_GROUND_2M),
    (ni[ii.DEW_POINT] = ei.ABOVE_GROUND_2M),
    (ni[ii.PRESSURE] = ei.MEAN_SEA_LEVEL));
  const ri = Object.freeze({
      GFS: "gfs",
      ICON: "icon",
    }),
    oi = Object.freeze(Object.values(ri)),
    ai = {};
  ((ai[ri.GFS] = "v1"), (ai[ri.ICON] = "v1"));
  const ci = Object.freeze({
      NCEP: "ncep",
      DWD: "dwd",
    }),
    li = {};
  ((li[ri.GFS] = ci.NCEP), (li[ri.ICON] = ci.DWD));
  class ui {
    constructor(t, s) {
      ((this._min = t),
        (this._max = Math.max(t, s)),
        (this._span = this._max - this._min));
    }
    get min() {
      return this._min;
    }
    get max() {
      return this._max;
    }
    get span() {
      return this._span;
    }
  }
  const di = new ui(-32, 95.5),
    fi = 1.35,
    mi = 2451545,
    pi = 280.46061837,
    gi = -0.833,
    wi = Math.sin(lt(gi)),
    vi = (t) => (t - mi) / 36525,
    yi = (t) => {
      const s = vi(t);
      return (
        pi +
        360.98564736629 * (t - mi) +
        0.000387933 * s * s -
        (s * s * s) / 38710000
      );
    },
    Mi = (t) => {
      const s = vi(t);
      return lt(
        23.4392911111 + (((0.001813 * s - 0.00059) * s - 46.815) * s) / 3600
      );
    },
    bi = function (t, s, i) {
      return (void 0 === i && (i = 0), rt(ct(Math.atan2(s, t)) + i));
    };
  class Ai {
    constructor() {
      ((this.date = null),
        (this.julianDay = null),
        (this.ra = 0),
        (this.dec = 0),
        (this.gmst = 0));
    }
    compute(t) {
      ((this.date = t),
        (this.julianDay = ((t) => t.getTime() / 86400000 + 2440587.5)(t)));
      const s = this.julianDay - 2451543.5,
        i = 282.9404 + 0.0000470935 * s,
        h = 0.016709 - 1.151e-9 * s,
        e = lt(rt(356.047 + 0.9856002585 * s)),
        n = e + h * Math.sin(e) * (1 + h * Math.cos(e)),
        r = Math.cos(n) - h,
        o = Math.sqrt(1 - h * h) * Math.sin(n),
        a = ft(r, o),
        c = lt(bi(r, o, i)),
        l = a * Math.cos(c),
        u = a * Math.sin(c),
        d = Mi(this.julianDay),
        f = u * Math.cos(d),
        m = u * Math.sin(d);
      ((this.ra = bi(l, f)),
        (this.dec = ((t, s, i) => ct(Math.atan2(i, ft(t, s))))(l, f, m)),
        (this.gmst = yi(this.julianDay)));
    }
    computeAlt(t, s) {
      return ct(
        ((i = lt(rt(this.gmst + t - this.ra))),
        (h = lt(s)),
        (e = lt(this.dec)),
        Math.asin(
          Math.sin(h) * Math.sin(e) + Math.cos(h) * Math.cos(e) * Math.cos(i)
        ))
      );
      var i, h, e;
    }
    isNight(t, s) {
      return this.computeAlt(t, s) < gi;
    }
  }
  const Ti = (t, s) => (t > s ? 1 : t < s ? -1 : 0),
    xi = (t, s, i) => {
      const h = t.length;
      if (t[0] <= s) return 0;
      if (s <= t[h - 1]) return h - 1;
      if (i > 0) {
        for (let i = 1; i < h; i++) if (t[i] < s) return i - 1;
      } else if (i < 0) {
        for (let i = 1; i < h; i++) if (t[i] <= s) return i;
      } else
        for (let i = 1; i < h; i++) {
          if (t[i] === s) return i;
          if (t[i] < s) return t[i - 1] - s < s - t[i] ? i - 1 : i;
        }
      return h - 1;
    },
    Ei = (t, s, i) => {
      for (; s < i; ) {
        const h = t[s];
        ((t[s] = t[i]), (t[i] = h), s++, i--);
      }
    },
    Di = (t, s) => {
      const i = Array.isArray(s) ? s : [s];
      for (let s = 0, h = i.length; s < h; s++) t[t.length] = i[s];
    },
    Ii = (t, s) => {
      const i = t.indexOf(s),
        h = i > -1;
      return (h && t.splice(i, 1), h);
    },
    Si = (t, s) => {
      const i = t.length;
      if (i !== s.length) return !1;
      for (let h = 0; h < i; h++) if (t[h] !== s[h]) return !1;
      return !0;
    },
    Ri = function (t, s, i) {
      return (
        void 0 === i && (i = 1),
        t[(t.indexOf(s) + i + t.length) % t.length]
      );
    },
    ki = (t) => t.toString(16),
    Li = function (t, s) {
      return (void 0 === s && (s = 2), t.toString().padStart(s, "0"));
    },
    Ni = (t) =>
      "string" != typeof t ? "" : t.charAt(0).toUpperCase() + t.slice(1),
    Oi = (t) => (t || "").replace(/([A-Z])/g, "-$1").toLowerCase(),
    Ci = function (t, s, i) {
      return (
        void 0 === s && (s = ""),
        void 0 === i && (i = ""),
        "<" + t + (s ? ' class="' + s + '"' : "") + ">" + i + "</" + t + ">"
      );
    },
    Fi = (t, s) => Ci("div", t, s),
    Pi = (t, s) => Ci("span", t, s),
    zi = (t) =>
      '<span class="wind-arrow" style="transform:rotate(' + t + 'deg)"></span>',
    Ui = "data:image/svg+xml,%3csvg xmlns=%22http://www.w3.org/2000/svg%22",
    Wi = "anonymous",
    Gi = 35;
  class ji {
    constructor() {
      this._listeners = {};
    }
    addEventListener(t, s) {
      const i = this._listeners;
      (void 0 === i[t] && (i[t] = []), i[t].includes(s) || i[t].push(s));
    }
    dispatchEvent(t) {
      const s = this._listeners[t.type];
      if (void 0 !== s) {
        t.target = this;
        const i = s.slice(0);
        for (let s = 0, h = i.length; s < h; s++) i[s].call(this, t);
      }
    }
  }
  const _i = function (t, s, i, h) {
      (void 0 === h && (h = !1),
        t &&
          t.addEventListener(s, i, {
            passive: h,
          }));
    },
    Bi = function (t, s, i, h) {
      (void 0 === h && (h = !1), s.forEach((s) => _i(t, s, i, h)));
    },
    Zi = function (t, s, i) {
      void 0 === i && (i = 10);
      let h = !1,
        e = null,
        n = null;
      (_i(
        t,
        X,
        (t) => {
          ((h = !1),
            1 === t.touches.length
              ? ((e = t.touches[0].clientX), (n = t.touches[0].clientY))
              : ((e = n = null), (h = !0)));
        },
        !0
      ),
        _i(
          t,
          J,
          (t) => {
            if (null === e) return;
            const s = t.touches[0];
            (1 !== t.touches.length ||
              Math.abs(s.clientX - e) > i ||
              Math.abs(s.clientY - n) > i) &&
              (h = !0);
          },
          !0
        ),
        _i(
          t,
          V,
          () => {
            ((e = n = null), (h = !0));
          },
          !0
        ),
        _i(
          t,
          K,
          (r) => {
            (!h &&
              null !== e &&
              1 === r.changedTouches.length &&
              Math.abs(r.changedTouches[0].clientX - e) <= i &&
              Math.abs(r.changedTouches[0].clientY - n) <= i &&
              (th(r), s.call(t, r)),
              (e = n = null));
          },
          !1
        ));
    },
    Hi = (t, s) => {
      let i = !1,
        h = 0,
        e = 0,
        n = 0;
      (_i(
        t,
        X,
        (s) => {
          if (1 !== s.touches.length || t.scrollTop > 0) return void (i = !1);
          i = !0;
          const r = s.touches[0];
          ((h = r.pageX), (e = r.pageY), (n = s.timeStamp));
        },
        !0
      ),
        _i(t, V, () => {
          i = !1;
        }),
        _i(
          t,
          J,
          (s) => {
            i &&
              1 === s.touches.length &&
              s.touches[0].pageY - e > 0 &&
              0 === t.scrollTop &&
              th(s);
          },
          !1
        ),
        _i(t, K, (r) => {
          if (!i || 1 !== r.changedTouches.length) return;
          const o = r.changedTouches[0],
            a = o.pageX - h,
            c = o.pageY - e;
          ((i = !1),
            0 === t.scrollTop &&
              r.timeStamp &&
              r.timeStamp - n < 400 &&
              c > 100 &&
              Math.abs(a) < c / 2 &&
              s(r));
        }));
    },
    Yi = function (t, s, i, h) {
      (void 0 === h && (h = !1),
        t &&
          t.removeEventListener(s, i, {
            passive: h,
          }));
    },
    qi = (t, s) => t && t.querySelector(s),
    $i = (t, s) => (t && t.querySelectorAll(s)) || [],
    Vi = (t) => {
      t && t.parentNode && t.parentNode.removeChild(t);
    },
    Ki = (t, s) => (t.appendChild(s), s),
    Ji = function (t, s, i) {
      (void 0 === i && (i = "afterbegin"), t.insertAdjacentElement(i, s));
    },
    Xi = (t, s, i) => {
      if (!t) return document.createDocumentFragment();
      const h = document.createElement(t);
      return (
        s && (h.className = s),
        i && (i instanceof Node ? h.appendChild(i) : (h.textContent = i)),
        h
      );
    },
    Qi = (t) => {
      t && t.scrollTo && 0 !== t.scrollTop && t.scrollTo(0, 0);
    },
    th = (t) => {
      t.preventDefault();
    },
    sh = (t) => {
      t.stopPropagation();
    },
    ih = (t) => {
      t.stopImmediatePropagation();
    },
    hh = (t) => {
      _i(t, h, (t) => {
        (th(t), t.target && t.target.click());
      });
    },
    eh = (t) => {
      _i(t, X, (s) => {
        s.target === t && th(s);
      });
    },
    nh = (t) => {
      navigator.standalone ||
        _i(t, K, (t) => {
          t.target.disabled
            ? th(t)
            : !t.defaultPrevented &&
              t.cancelable &&
              (th(t), t.target.click && t.target.click());
        });
    },
    rh = (t) => "touch" === t.pointerType,
    oh = (t) => {
      if (!t) return;
      const s = t.firstChild;
      return s && !s.nextSibling && 3 === s.nodeType ? s.data : t.textContent;
    },
    ah = (t, s) => {
      if (!t) return;
      const i = t.firstChild;
      i && !i.nextSibling && 3 === i.nodeType
        ? (i.data = s)
        : (t.textContent = s);
    },
    ch = (t, s, i) => {
      const h = t && t.classList;
      if (h)
        if (Array.isArray(s)) {
          const t = s.filter((t) => /^\S+$/.test(t));
          if (0 === t.length) return;
          h[i](...t);
        } else h[i](s);
    },
    lh = (t, s) => {
      ch(t, s, "add");
    },
    uh = (t, s) => {
      ch(t, s, "remove");
    },
    dh = (t, s) => {
      const i = t && t.classList;
      return i && i.contains(s);
    },
    fh = {
      offset: 0,
      update: (t) => {
        const s = Math.abs(t);
        fh.offset = s < 300000 || s > 86400000 ? 0 : t;
      },
    },
    mh = () => Date.now() + fh.offset,
    ph = () => new Date(mh()),
    gh = (t, s) => {
      const i = new Date(t);
      return (
        isNaN(i.getTime()) || i.setTime(i.getTime() + (3600000 * s) / 15),
        i
      );
    },
    wh = (t, s) => {
      const i = new Date(t);
      return (isNaN(i.getTime()) || i.setUTCDate(i.getUTCDate() + s), i);
    },
    vh = (t) => wh(t, -1),
    yh = (t) => wh(t, 1),
    Mh = (t) => (t.setUTCHours(0, 0, 0, 0), t),
    bh = (t, s, i) => {
      const h = s.getTime();
      t.getTime() < h && t.setTime(h);
      const e = i.getTime();
      return (t.getTime() > e && t.setTime(e), t);
    },
    Ah = (t) => (0 == (t %= 12) && (t = 12), t),
    Th = function (t, s, i, h) {
      return (
        void 0 === i && (i = "AM"),
        void 0 === h && (h = "PM"),
        {
          hourText: s ? Ah(t) : Li(t),
          amPmText: s ? (t < 12 ? i : h) : "",
        }
      );
    },
    xh = function (t, s, i, h, e, n) {
      (void 0 === h && (h = "AM"), void 0 === e && (e = "PM"));
      const r = t.getUTCHours(),
        o = Ah(r),
        a = t.getUTCMinutes();
      let c = o;
      if (0 === a) {
        if (0 === r) return s.replace(h, Pi("am-pm", h));
        if (12 === r) return i.replace(e, Pi("am-pm", e));
      } else c += Pi("colon", ":") + Li(a);
      const l = Pi("am-pm", r < 12 ? h : e);
      let u = /^(ja|zh)/.test(n) ? l + c : c + " " + l;
      return ("ja" === n ? (u += "時") : "zh" === n && (u += "点"), u);
    },
    Eh = (t) => Li(t.getUTCHours()) + Pi("colon", ":") + Li(t.getUTCMinutes()),
    Dh = (t) => {
      let s;
      try {
        s = t.toISOString();
      } catch (t) {
        s = new Date().toISOString();
      }
      return s.substring(0, 10);
    },
    Ih = function (t, s) {
      let i;
      void 0 === s && (s = 10);
      try {
        i = t.toISOString();
      } catch (t) {
        i = si(new Date(), s).toISOString();
      }
      return (
        i.substring(0, 10) + "/" + i.substring(11, 13) + i.substring(14, 16)
      );
    },
    Sh = "en-GB",
    Rh = "2-digit",
    kh = ["year", "month", "day", "hour", "minute", "second"],
    Lh = {
      year: "numeric",
      month: Rh,
      day: Rh,
      hour: Rh,
      minute: Rh,
      second: Rh,
      hour12: !1,
    },
    Nh = function (t, s) {
      if ((void 0 === s && (s = ""), isNaN(t))) return 0;
      if (!s) return 60000 * t.getTimezoneOffset();
      let i;
      try {
        const h = new Intl.DateTimeFormat(Sh, {
          ...Lh,
          timeZone: s,
        })
          .formatToParts(t)
          .reduce(
            (t, s) => (kh.includes(s.type) && (t[s.type] = s.value), t),
            {}
          );
        i = Date.parse(
          `${h.year}-${h.month}-${h.day}T${h.hour}:${h.minute}:${h.second}Z`
        );
      } catch (t) {}
      if (!$s(i))
        try {
          const [h, e] = t
              .toLocaleString(Sh, {
                ...Lh,
                timeZone: s,
              })
              .split(/\s*,\s*/),
            [n, r, o] = h.split("/");
          i = Date.parse(`${o}-${r}-${n}T${e}Z`);
        } catch (t) {}
      const h = (Math.floor(t.getTime() / 1000) - i / 1000) / 60;
      return !$s(h) || h < -960 || h > 960
        ? 60000 * t.getTimezoneOffset()
        : 60000 * h;
    },
    Oh = window._ZE || {},
    Ch = document.documentElement.lang.substring(0, 2),
    Fh = "en" === Ch,
    Ph = "ar" === Ch ? "en" : Ch,
    zh = navigator || {},
    Uh = zh.userAgent,
    Wh = zh.userAgentData,
    Gh = window.devicePixelRatio || 1,
    jh = (() => {
      const t =
        Wh &&
        Wh.brands &&
        Wh.brands.find &&
        Wh.brands.find((t) => /Chrom(e|ium)/.test(t.brand));
      if (t) return parseFloat(t.version);
      const s = /Chrom(?:e|ium)\/(\d+)\./.exec(Uh);
      return s ? parseFloat(s[1]) : 0;
    })(),
    _h = jh > 0,
    Bh = /CriOS\//.test(Uh),
    Zh = /Firefox/.test(Uh),
    Hh = !_h && /Safari/.test(Uh),
    Yh = (() => {
      const t = /Version\/([\d\.]+).*Safari/.exec(Uh);
      if (t) return parseFloat(t[1]);
      const s = /OS (\d+_\d+(?:_\d+)?)/.exec(Uh);
      if (s) {
        const t = s[1].split("_");
        if (t.length > 1) return parseFloat(t[0] + "." + t[1]);
      }
      return 0;
    })(),
    qh = Hh || /Mac OS/.test(Uh),
    $h = /(Windows|Win64|CrOS)/.test(Uh),
    Vh = Oh.config.mobile,
    Kh = {
      lang: Ch,
      enLang: Fh,
      nonArabicLang: Ph,
      mobile: Vh,
      touch:
        Vh ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0 ||
        (window.matchMedia && matchMedia("(any-hover: none)").matches),
      apple: qh,
      chrome: _h,
      chromeiOS: Bh,
      chromeVersion: jh,
      safari: Hh,
      safariVersion: Yh,
      firefox: Zh,
      desktop: $h,
      pixelRatio: Gh,
      use2x: Gh >= 1.3 && (Vh || !Zh),
      canBlur:
        window.CSS &&
        CSS.supports &&
        (CSS.supports("backdrop-filter", "blur(2px)") ||
          CSS.supports("-webkit-backdrop-filter", "blur(2px)")),
      storage: ((t) => {
        try {
          const s = "_";
          return (t.setItem(s, s), t.removeItem(s), !0);
        } catch (t) {
          return !1;
        }
      })(window.localStorage),
    },
    Jh = {},
    Xh = (t) => "ze_" + t,
    Qh = (t, s, i) => {
      if (Kh.storage) {
        if (i) {
          let s;
          try {
            s = localStorage.getItem(Xh(i));
          } catch (t) {}
          if (s) {
            te(t, s, !0);
            try {
              localStorage.removeItem(Xh(i));
            } catch (t) {}
          }
        }
        let s;
        try {
          s = localStorage.getItem(Xh(t));
        } catch (t) {}
        if (s) return s;
      }
      return s;
    },
    te = (t, s, i) => {
      if (Kh.storage)
        if (i)
          try {
            localStorage.setItem(Xh(t), s);
          } catch (t) {}
        else
          (cancelIdleCallback(Jh[t]),
            (Jh[t] = requestIdleCallback(
              () => {
                try {
                  localStorage.setItem(Xh(t), s);
                } catch (t) {}
              },
              {
                timeout: 500,
              }
            )));
    },
    se = (t, s) => {
      if (!Kh.storage) return s;
      let i;
      try {
        i = sessionStorage.getItem(Xh(t));
      } catch (t) {}
      return i || s;
    },
    ie = (t, s) => {
      try {
        sessionStorage.setItem(Xh(t), s);
      } catch (t) {}
    },
    he = (t, s) => {
      if (!Kh.storage) return s;
      let i;
      try {
        i = localStorage.getItem(Xh(t));
      } catch (t) {}
      return "true" === i || ("false" !== i && s);
    },
    ee = te,
    ne = ie,
    re = te,
    oe = "overlay",
    ae = oe + "Clouds",
    ce = oe + "Coverage",
    le = oe + "Crosshair",
    ue = oe + "Fires",
    de = oe + "Heat",
    fe = oe + "Isolines",
    me = oe + "Labels",
    pe = oe + "LabelValues",
    ge = oe + "Lines",
    we = oe + "Precipitation",
    ve = oe + "Radar",
    ye = oe + "Storms",
    Me = oe + "Terminator",
    be = oe + "Wind";
  class Ae {
    constructor(t) {
      ((this._settings = t),
        (this._clouds = he(ae, !0)),
        (this._crosshair = he(le, !1)),
        (this._fires = he(ue, !1)),
        (this._heat = he(de, !1)),
        (this._isolines = he(fe, !0)),
        (this._labels = he(me, !0)),
        (this._labelValues = he(pe, !0)),
        (this._lines = he(ge, !0)),
        (this._precipitationAnimation = he(we, !0)),
        (this._radar = he(ve, !1)),
        (this._coverage = he(ce, !0)),
        (this._storms = he(ye, !0)),
        (this._terminator = he(Me, !0)),
        (this._windAnimation = he(be, !1)),
        (this.forecastWind = !0));
    }
    get clouds() {
      return this._clouds;
    }
    set clouds(t) {
      this._clouds !== t && Vs(t) && ((this._clouds = t), ee(ae, t));
    }
    get crosshair() {
      return this._crosshair;
    }
    set crosshair(t) {
      this._crosshair !== t && Vs(t) && ((this._crosshair = t), ee(le, t));
    }
    get fires() {
      return this._fires;
    }
    set fires(t) {
      this._fires !== t && Vs(t) && ((this._fires = t), ee(ue, t));
    }
    get heat() {
      return this._heat;
    }
    set heat(t) {
      this._heat !== t && Vs(t) && ((this._heat = t), ee(de, t));
    }
    get isolines() {
      return this._isolines;
    }
    set isolines(t) {
      this._isolines !== t && Vs(t) && ((this._isolines = t), ee(fe, t));
    }
    get labels() {
      return this._labels;
    }
    set labels(t) {
      this._labels !== t && Vs(t) && ((this._labels = t), ee(me, t));
    }
    get labelValues() {
      return this._labelValues;
    }
    set labelValues(t) {
      this._labelValues !== t && Vs(t) && ((this._labelValues = t), ee(pe, t));
    }
    get lines() {
      return this._lines;
    }
    set lines(t) {
      this._lines !== t && Vs(t) && ((this._lines = t), ee(ge, t));
    }
    get precipitationAnimation() {
      return this._precipitationAnimation;
    }
    set precipitationAnimation(t) {
      this._precipitationAnimation !== t &&
        Vs(t) &&
        ((this._precipitationAnimation = t), ee(we, t));
    }
    get radar() {
      return this._radar;
    }
    set radar(t) {
      this._radar !== t && Vs(t) && ((this._radar = t), ee(ve, t));
    }
    get coverage() {
      return this._coverage;
    }
    set coverage(t) {
      this._coverage !== t && Vs(t) && ((this._coverage = t), ee(ce, t));
    }
    get storms() {
      return this._storms;
    }
    set storms(t) {
      this._storms !== t && Vs(t) && ((this._storms = t), ee(ye, t));
    }
    get terminator() {
      return this._terminator;
    }
    set terminator(t) {
      this._terminator !== t && Vs(t) && ((this._terminator = t), ee(Me, t));
    }
    get windAnimation() {
      return (
        !this._settings.isHDLayer &&
        (this._settings.isWindLayer ? this.forecastWind : this._windAnimation)
      );
    }
    set windAnimation(t) {
      this._windAnimation !== t &&
        Vs(t) &&
        ((this._windAnimation = t), ee(be, t));
    }
  }
  const Te = Object.freeze({
      SUN_SHOWER: "sunShower",
      RAIN_VERY_LIGHT: "rainVeryLight",
      RAIN_LIGHT: "rainLight",
      RAIN_MODERATE: "rainModerate",
      RAIN_HEAVY: "rainHeavy",
      RAIN_EXTREME: "rainExtreme",
      HAIL: "hail",
      SNOW_LIGHT: "snowLight",
      SNOW_MODERATE: "snowModerate",
      SNOW_HEAVY: "snowHeavy",
      CLEAR_DAY: "clearDay",
      CLEAR_NIGHT: "clearNight",
      CLEAR_MOSTLY_DAY: "clearMostlyDay",
      CLEAR_MOSTLY_NIGHT: "clearMostlyNight",
      CLOUD_PARTLY_DAY: "cloudPartlyDay",
      CLOUD_PARTLY_NIGHT: "cloudPartlyNight",
      CLOUD_OVERCAST: "cloudOvercast",
      WIND_STRONG: "windStrong",
    }),
    xe = Object.freeze(Object.values(Te)),
    Ee = {};
  ((Ee[ii.PRECIPITATION] = [new ui(0, 100), new ui(0, 36), new ui(0, 36)]),
    (Ee[ii.WIND_SPEED] = [new ui(-63.5, 64), new ui(-63.5, 64)]),
    (Ee[ii.WIND_GUSTS] = [new ui(0, 63.75)]),
    (Ee[ii.TEMPERATURE] = Ee[ii.TEMPERATURE_FEEL] =
      [new ui(-89, -38), new ui(-40, 11), new ui(9, 60)]),
    (Ee[ii.TEMPERATURE_WET_BULB] = [new ui(-64, 38)]),
    (Ee[ii.HUMIDITY] = [new ui(0, 102)]),
    (Ee[ii.DEW_POINT] = [
      new ui(-95, -10),
      new ui(-12, 13.5),
      new ui(11.5, 37),
    ]),
    (Ee[ii.PRESSURE] = [
      new ui(859.5, 987),
      new ui(985, 1036),
      new ui(1034, 1085),
    ]));
  const De = Object.freeze({
      ANIMATION_DURATION: "animationDuration",
      ANIMATION_SPEED: "animationSpeed",
      ANIMATION_STYLE: "animationStyle",
      APPEARANCE: "appearance",
      AREA_UNIT: "areaUnit",
      FIRE_AREA_UNIT: "fireAreaUnit",
      COORDINATE_UNIT: "coordinateUnit",
      DISTANCE_UNIT: "distanceUnit",
      MTG: "mtg",
      PRECIPITATION_THEME: "precipitationTheme",
      PRECIPITATION_UNIT: "precipitationUnit",
      PRESSURE_UNIT: "pressureUnit",
      SUMMARY: "summary",
      TEMPERATURE_UNIT: "temperatureUnit",
      TIME_CONTROL: "timeControl",
      TIME_FORMAT: "timeFormat",
      TIME_ZONE: "timeZone",
      WIND_DIRECTION_UNIT: "windDirectionUnit",
      WIND_UNIT: "windUnit",
    }),
    Ie = Object.freeze({
      PRESCRIBED_BURN: "PB",
      COMPLEX: "CX",
    }),
    Se = Object.freeze({
      CLOUDS: "clouds",
      COVERAGE: "coverage",
      CROSSHAIR: "crosshair",
      FIRES: "fires",
      HEAT: "heat",
      ISOLINES: "isolines",
      LABELS: "labels",
      LABEL_VALUES: "label-values",
      LINES: "lines",
      PRECIPITATION_ANIMATION: "precipitation-animation",
      RADAR: "radar",
      STORMS: "storms",
      TERMINATOR: "terminator",
      WIND_ANIMATION: "wind-animation",
    }),
    Re = Object.freeze({
      SATELLITE: "satellite",
      SATELLITE_HD: "satellite-hd",
      RADAR: "radar",
      ...ii,
    }),
    ke = "-beta",
    Le = (t) => hi.includes(t),
    Ne = (t) =>
      t === Re.TEMPERATURE ||
      t === Re.TEMPERATURE_FEEL ||
      t === Re.TEMPERATURE_WET_BULB ||
      t === Re.DEW_POINT,
    Oe = (t) => t === Re.WIND_SPEED || t === Re.WIND_GUSTS,
    Ce = (t, s, i) => {
      const h = Array.isArray(s);
      return !i && t <= (h ? s[0] : s).min
        ? "< "
        : t >= (h ? s.at(-1) : s).max
          ? "> "
          : "";
    },
    Fe = Ee;
  Fe[Re.RADAR] = [new ui(0, 0), di, di];
  const Pe = {};
  for (let t = hi.length; t--; ) {
    const s = hi[t],
      i = Fe[s === Re.WIND_SPEED ? Re.WIND_GUSTS : s];
    Pe[s] = new ui(i[0].min, i.at(-1).max);
  }
  const ze = (t, s) => {
      const i = [],
        h = Fe[t];
      for (let t = 0, e = h.length; t < e; t++) {
        const { min: e, span: n } = h[t];
        i.push(et(((s - e) / n) * 255, 0, 255));
      }
      1 === i.length && (i[1] = i[2] = i[0]);
      const [e = 0, n = 0, r = 0] = i;
      return `rgba(${e},${n},${r},${254 / 255})`;
    },
    Ue = {};
  ((Ue[Re.RADAR] = Ue[Re.PRECIPITATION] = "#000"),
    (Ue[Re.WIND_SPEED] = ze(Re.WIND_SPEED, 0)),
    (Ue[Re.WIND_GUSTS] = ze(Re.WIND_GUSTS, 0)),
    (Ue[Re.TEMPERATURE] = Ue[Re.TEMPERATURE_FEEL] = ze(Re.TEMPERATURE, 14)),
    (Ue[Re.TEMPERATURE_WET_BULB] = ze(Re.TEMPERATURE_WET_BULB, 14)),
    (Ue[Re.HUMIDITY] = ze(Re.HUMIDITY, 50)),
    (Ue[Re.DEW_POINT] = ze(Re.DEW_POINT, 13)),
    (Ue[Re.PRESSURE] = ze(Re.PRESSURE, 1013)));
  const We = "#7f7f00",
    Ge = Object.freeze({
      STORM_WATCH: "watch-storm",
      STORM_WARNING: "warning-storm",
      HURRICANE_WATCH: "watch-hurricane",
      HURRICANE_WARNING: "warning-hurricane",
    }),
    je = function (t, s) {
      if ((void 0 === s && (s = 0.1), $s(t)))
        return t >= 2.5
          ? Te.SNOW_HEAVY
          : t >= 1.5
            ? Te.SNOW_MODERATE
            : t >= s
              ? Te.SNOW_LIGHT
              : void 0;
    },
    _e = function (t, s, i, h, e) {
      if ((void 0 === i && (i = 0.1), void 0 === h && (h = 100), $s(t)))
        return s && t >= 199.5
          ? Te.HAIL
          : t >= 49.5
            ? Te.RAIN_EXTREME
            : t >= 7.5
              ? Te.RAIN_HEAVY
              : t >= 2.54
                ? Te.RAIN_MODERATE
                : t >= 0.508
                  ? Te.RAIN_LIGHT
                  : t >= i
                    ? !e && $s(h) && h < 85
                      ? Te.SUN_SHOWER
                      : Te.RAIN_VERY_LIGHT
                    : void 0;
    },
    Be = (t, s) => {
      if ($s(t))
        return t < 35
          ? s
            ? Te.CLEAR_NIGHT
            : Te.CLEAR_DAY
          : t < 50
            ? s
              ? Te.CLEAR_MOSTLY_NIGHT
              : Te.CLEAR_MOSTLY_DAY
            : t < 85
              ? s
                ? Te.CLOUD_PARTLY_NIGHT
                : Te.CLOUD_PARTLY_DAY
              : Te.CLOUD_OVERCAST;
    },
    Ze = (t, s, i, h) =>
      (s > t ? je(s, 0.1) : _e(t, !1, 0.1, i, h)) || Be(i, h),
    He = {
      SLOW: "slow",
      MEDIUM: "medium",
      FAST: "fast",
    },
    Ye = {
      FAST: "fast",
      SMOOTH: "smooth",
    },
    qe = {
      IMPERIAL: "imperial",
      METRIC: "metric",
      ACRES: "acres",
      HECTARES: "hectares",
    },
    $e = {
      TRANSLUCENT: "translucent",
      OPAQUE: "opaque",
    },
    Ve = {
      HOUR12: "hour12",
      HOUR24: "hour24",
    },
    Ke = {
      DMS: "dms",
      DECIMAL: "decimal",
    },
    Je = {
      IMPERIAL: "imperial",
      METRIC: "metric",
      NAUTICAL: "nautical",
    },
    Xe = {
      ENABLED: "enabled",
      DISABLED: "disabled",
    },
    Qe = {
      LIGHT: "light",
      DARK: "dark",
    },
    tn = {
      MMH: "mmh",
      INH: "inh",
      DBZ: "dbz",
    },
    sn = {
      MB: "mb",
      HPA: "hpa",
      MMHG: "mmhg",
      INHG: "inhg",
    },
    hn = {
      DAILY: "daily",
      HOURLY: "hourly",
    },
    en = {
      CELSIUS: "celsius",
      FAHRENHEIT: "fahrenheit",
    },
    nn = {
      CLOCK: "clock",
      TIMELINE: "timeline",
    },
    rn = {
      LOCAL: "local",
      UTC: "utc",
    },
    on = {
      COMPASS: "compass",
      DEGREES: "degrees",
    },
    an = {
      BEAUFORT: "beaufort",
      MPH: "mph",
      MS: "ms",
      KMH: "kmh",
      KNOTS: "knots",
    },
    cn = "percent",
    ln = "precipitation",
    un = {};
  ((un[tn.MMH] = 1), (un[tn.INH] = 1 / 25.4));
  const dn = {};
  ((dn[sn.HPA] = 1),
    (dn[sn.MB] = 1),
    (dn[sn.MMHG] = 0.75006158),
    (dn[sn.INHG] = 0.02952998));
  const fn = {};
  ((fn[an.MS] = 1),
    (fn[an.KMH] = 3.6),
    (fn[an.KNOTS] = 3.6 / 1.852),
    (fn[an.MPH] = 2.23694));
  const mn = (t) => t / fn[an.KNOTS],
    pn = (t) => Math.round(Math.min(12, (t / 0.836) ** (2 / 3))),
    gn = (t, s) => it(t, et(10 ** Math.floor(s - 3), 10, 1000000)),
    wn = "−",
    vn = function (t, s) {
      return (
        void 0 === s && (s = "strong"),
        t.replace(/_(.+?)_/g, `<${s}>$1</${s}>`).replace(/_/g, "")
      );
    },
    yn = function (t, s) {
      return (void 0 === s && (s = 1), `rgba(${t[0]},${t[1]},${t[2]},${s})`);
    },
    Mn = (t, s) => {
      let i = 1;
      t < 0 && ((i = -1), (t = -t));
      let h = Math.floor(t),
        e = Math.floor(60 * (t - h)),
        n = (3600 * (t - h - e / 60)).toFixed(s);
      return (
        n >= 60 && ((n = 0), e++),
        e >= 60 && ((e = 0), h++),
        {
          sign: i,
          degrees: h,
          minutes: e,
          seconds: n,
        }
      );
    },
    bn = (t) =>
      $s(t) ? (t > 0 ? Math.floor(t) : Math.ceil(t)) : parseInt(t, 10),
    An = (t) => {
      let s = 5381;
      for (let i = 0, h = t.length; i < h; i++)
        s = ((s << 5) + s + t.charCodeAt(i)) >>> 0;
      return Li(ki(s), 8);
    },
    Tn = (t) => An(JSON.stringify(t)),
    xn = [He.SLOW, He.MEDIUM, He.FAST],
    En = [Je.METRIC, Je.IMPERIAL, Je.NAUTICAL],
    Dn = [tn.MMH, tn.INH, tn.DBZ],
    In = [sn.HPA, sn.MB, sn.MMHG, sn.INHG],
    Sn = [en.CELSIUS, en.FAHRENHEIT],
    Rn = [an.KMH, an.MS, an.MPH, an.KNOTS, an.BEAUFORT];
  class kn extends ji {
    constructor(t, s, i, h) {
      super();
      let e = /^(GU|LR|MM|PR|US|VI)$/.test(s),
        n = e || /^(GB|GG|GI|IM|JE)$/.test(s),
        r = /^(BH|BZ|FM|GU|KY|LR|MH|PR|PW|US|VI)$/.test(s),
        o =
          /^(CA|CO|CR|DO|GB|GG|GI|GT|GU|HN|IM|JE|KH|KP|MM|MY|NI|OM|PA|PH|PR|SA|SO|SV|US|VE|VI|VU|YE)$/.test(
            s
          );
      ((this._settings = t),
        (this._animationDuration = ((t) => {
          if (!Kh.storage) return 6;
          let s;
          try {
            s = parseFloat(localStorage.getItem(Xh(t)));
          } catch (t) {}
          return $s(s) ? s : 6;
        })(De.ANIMATION_DURATION)),
        (this._animationSpeed = Qh(De.ANIMATION_SPEED, He.MEDIUM)),
        (this._animationStyle = Qh(De.ANIMATION_STYLE, Ye.FAST)));
      const a =
          window.matchMedia &&
          matchMedia("(prefers-reduced-transparency: reduce)"),
        c = a && a.matches && "not all" !== a.media;
      ((this._appearance = Qh(
        De.APPEARANCE,
        !Kh.canBlur || c ? $e.OPAQUE : $e.TRANSLUCENT
      )),
        (this._areaUnit = Qh(
          De.AREA_UNIT,
          n ? qe.IMPERIAL : qe.METRIC,
          "unitArea"
        )),
        (this._fireAreaUnit = Qh(
          De.FIRE_AREA_UNIT,
          n ? qe.ACRES : qe.HECTARES,
          "unitFireArea"
        )),
        (this._coordinateUnit = Qh(
          De.COORDINATE_UNIT,
          Ke.DMS,
          "unitCoordinate"
        )),
        (this._distanceUnit = Qh(
          De.DISTANCE_UNIT,
          n ? Je.IMPERIAL : Je.METRIC,
          "unitDistance"
        )),
        (this._mtg = Vs(h) ? (h ? Xe.ENABLED : Xe.DISABLED) : Xe.ENABLED),
        (this._precipitationTheme = Qh(De.PRECIPITATION_THEME, Qe.LIGHT)),
        (this._precipitationUnit = Qh(
          De.PRECIPITATION_UNIT,
          e ? tn.INH : tn.MMH
        )),
        (this._pressureUnit = Qh(De.PRESSURE_UNIT, e ? sn.MB : sn.HPA)),
        (this._summary = Qh(De.SUMMARY, hn.DAILY)),
        (this._temperatureUnit = Qh(
          De.TEMPERATURE_UNIT,
          r ? en.FAHRENHEIT : en.CELSIUS,
          "unitTemperature"
        )),
        "kelvin" === this._temperatureUnit &&
          (this._temperatureUnit = en.CELSIUS),
        (this._timeControl = Qh(De.TIME_CONTROL, i ? nn.TIMELINE : nn.CLOCK)),
        (this._timeFormat = Qh(
          De.TIME_FORMAT,
          o ? Ve.HOUR12 : Ve.HOUR24,
          "clockFormat"
        )),
        (this._timeZone = Qh(De.TIME_ZONE, rn.LOCAL, "timezone")),
        (this._windDirectionUnit = Qh(
          De.WIND_DIRECTION_UNIT,
          on.COMPASS,
          "unitWindDirection"
        )),
        (this._windUnit = Qh(De.WIND_UNIT, n ? an.MPH : an.KMH, "unitWind")));
    }
    changed(s) {
      this.dispatchEvent({
        type: t,
        setting: s,
      });
    }
    getUnit(t) {
      switch (t) {
        case Re.RADAR:
        case Re.PRECIPITATION:
          return ln;
        case Re.WIND_SPEED:
        case Re.WIND_GUSTS:
          return this.windUnit;
        case Re.TEMPERATURE:
        case Re.TEMPERATURE_FEEL:
        case Re.TEMPERATURE_WET_BULB:
        case Re.DEW_POINT:
          return this.temperatureUnit;
        case Re.HUMIDITY:
          return cn;
        case Re.PRESSURE:
          return this.pressureUnit;
      }
      return "none";
    }
    getUnitString(t, s) {
      switch (t) {
        case Re.RADAR:
        case Re.PRECIPITATION:
          return s ? this.h() : Is.legend.rain.title;
        case Re.WIND_SPEED:
        case Re.WIND_GUSTS:
          return this.o();
        case Re.TEMPERATURE:
        case Re.TEMPERATURE_FEEL:
        case Re.TEMPERATURE_WET_BULB:
        case Re.DEW_POINT:
          return this.l();
        case Re.HUMIDITY:
          return Is.punctuation.percent.replace("%s", "").trim();
        case Re.PRESSURE:
          return this.u();
      }
      return "";
    }
    get animationDuration() {
      return this._animationDuration;
    }
    set animationDuration(t) {
      ((t = +t),
        this._animationDuration === t ||
          (3 !== t && 6 !== t && 12 !== t && 24 !== t) ||
          ((this._animationDuration = t),
          re(De.ANIMATION_DURATION, t),
          this.changed(De.ANIMATION_DURATION)));
    }
    get animationSpeed() {
      return this._animationSpeed;
    }
    set animationSpeed(t) {
      this._animationSpeed !== t &&
        Ks(He, t) &&
        ((this._animationSpeed = t),
        te(De.ANIMATION_SPEED, t),
        this.changed(De.ANIMATION_SPEED));
    }
    m() {
      this.animationSpeed = Ri(xn, this.animationSpeed);
    }
    get animationStyle() {
      return this._animationStyle;
    }
    set animationStyle(t) {
      this._animationStyle !== t &&
        Ks(Ye, t) &&
        ((this._animationStyle = t),
        te(De.ANIMATION_STYLE, t),
        this.changed(De.ANIMATION_STYLE));
    }
    get isFrameAnimator() {
      return this._animationStyle === Ye.SMOOTH;
    }
    get appearance() {
      return this._appearance;
    }
    set appearance(t) {
      if (this._appearance !== t && Ks($e, t)) {
        if (!Kh.canBlur && t === $e.TRANSLUCENT) return;
        ((this._appearance = t),
          te(De.APPEARANCE, t),
          this.changed(De.APPEARANCE));
      }
    }
    get useBlur() {
      return Kh.canBlur && this._appearance === $e.TRANSLUCENT;
    }
    get areaUnit() {
      return this._areaUnit;
    }
    set areaUnit(t) {
      this._areaUnit !== t &&
        Ks(qe, t) &&
        ((this._areaUnit = t), te(De.AREA_UNIT, t), this.changed(De.AREA_UNIT));
    }
    get fireAreaUnit() {
      return this._fireAreaUnit;
    }
    set fireAreaUnit(t) {
      this._fireAreaUnit !== t &&
        Ks(qe, t) &&
        ((this._fireAreaUnit = t),
        te(De.FIRE_AREA_UNIT, t),
        this.changed(De.FIRE_AREA_UNIT));
    }
    get timeFormat() {
      return this._timeFormat;
    }
    set timeFormat(t) {
      this._timeFormat !== t &&
        Ks(Ve, t) &&
        ((this._timeFormat = t),
        te(De.TIME_FORMAT, t),
        this.changed(De.TIME_FORMAT));
    }
    get is12HourTimeFormat() {
      return this._timeFormat === Ve.HOUR12;
    }
    get is24HourTimeFormat() {
      return this._timeFormat === Ve.HOUR24;
    }
    p() {
      this.timeFormat = this.is12HourTimeFormat ? Ve.HOUR24 : Ve.HOUR12;
    }
    M(t) {
      return this.is24HourTimeFormat
        ? Eh(t)
        : xh(
            t,
            Is.date.midnight,
            Is.date.noon,
            Is.date.am,
            Is.date.pm,
            Kh.lang
          );
    }
    get coordinateUnit() {
      return this._coordinateUnit;
    }
    set coordinateUnit(t) {
      this._coordinateUnit !== t &&
        Ks(Ke, t) &&
        ((this._coordinateUnit = t),
        te(De.COORDINATE_UNIT, t),
        this.changed(De.COORDINATE_UNIT));
    }
    A() {
      this.coordinateUnit =
        this.coordinateUnit === Ke.DMS ? Ke.DECIMAL : Ke.DMS;
    }
    get distanceUnit() {
      return this._distanceUnit;
    }
    set distanceUnit(t) {
      this._distanceUnit !== t &&
        Ks(Je, t) &&
        ((this._distanceUnit = t),
        te(De.DISTANCE_UNIT, t),
        this.changed(De.DISTANCE_UNIT));
    }
    T() {
      this.distanceUnit = Ri(En, this.distanceUnit);
    }
    get mtg() {
      return this._mtg;
    }
    set mtg(t) {
      this._mtg !== t &&
        Ks(Xe, t) &&
        ((this._mtg = t), te(De.MTG, t), this.changed(De.MTG));
    }
    get isMTGEnabled() {
      return this._mtg === Xe.ENABLED;
    }
    get precipitationTheme() {
      return this._precipitationTheme;
    }
    set precipitationTheme(t) {
      this._precipitationTheme !== t &&
        Ks(Qe, t) &&
        ((this._precipitationTheme = t),
        te(De.PRECIPITATION_THEME, t),
        this.changed(De.PRECIPITATION_THEME));
    }
    get isDarkTheme() {
      return this._precipitationTheme === Qe.DARK;
    }
    get precipitationUnit() {
      return this._precipitationUnit;
    }
    set precipitationUnit(t) {
      this._precipitationUnit !== t &&
        Ks(tn, t) &&
        ((this._precipitationUnit = t),
        te(De.PRECIPITATION_UNIT, t),
        this.changed(De.PRECIPITATION_UNIT));
    }
    D() {
      this.precipitationUnit = Ri(Dn, this.precipitationUnit);
    }
    h() {
      switch (this.precipitationUnit) {
        case tn.MMH:
          return Is.unit.mmh;
        case tn.INH:
          return Is.unit.inh;
        case tn.DBZ:
          return Is.unit.dbz;
      }
    }
    I(t, s, i) {
      (void 0 === s && (s = !1), void 0 === i && (i = !1));
      let h = t * (un[this.precipitationUnit] || 1);
      const e = i ? " " + this.h() : "";
      if (this.precipitationUnit === tn.DBZ) {
        const t = Math.round(
          s
            ? ((r = h), 10 * Math.log10(75 * r ** 2))
            : ((n = h), 10 * Math.log10(200 * n ** 1.6))
        );
        return t <= di.min ? "" : t.toString().replace("-", wn) + e;
      }
      var n, r;
      s && (h *= 10);
      const o = this.precipitationUnit === tn.INH;
      if (o || h < 1) {
        const t = o ? (h < 0.01 ? 1000 : 100) : h < 0.1 ? 100 : 10;
        return (Math.round(h * t) / t).toLocaleString(Kh.nonArabicLang) + e;
      }
      return Math.round(h) + e;
    }
    get pressureUnit() {
      return this._pressureUnit;
    }
    set pressureUnit(t) {
      this._pressureUnit !== t &&
        Ks(sn, t) &&
        ((this._pressureUnit = t),
        te(De.PRESSURE_UNIT, t),
        this.changed(De.PRESSURE_UNIT));
    }
    S() {
      this.pressureUnit = Ri(In, this.pressureUnit);
    }
    u() {
      switch (this.pressureUnit) {
        case sn.MB:
          return Is.unit.mb;
        case sn.HPA:
          return Is.unit.hpa;
        case sn.MMHG:
          return Is.unit.mmhg;
        case sn.INHG:
          return Is.unit.inhg;
      }
    }
    R(t, s) {
      void 0 === s && (s = !1);
      const i = t * (dn[this.pressureUnit] || 1),
        h = s ? " " + this.u() : "";
      return this.pressureUnit === sn.INHG
        ? (Math.round(100 * i) / 100).toLocaleString(Kh.nonArabicLang) + h
        : Math.round(i) + h;
    }
    get summary() {
      return this._summary;
    }
    set summary(t) {
      this._summary !== t &&
        Ks(hn, t) &&
        ((this._summary = t), te(De.SUMMARY, t), this.changed(De.SUMMARY));
    }
    get temperatureUnit() {
      return this._temperatureUnit;
    }
    set temperatureUnit(t) {
      this._temperatureUnit !== t &&
        Ks(en, t) &&
        ((this._temperatureUnit = t),
        te(De.TEMPERATURE_UNIT, t),
        this.changed(De.TEMPERATURE_UNIT));
    }
    k() {
      this.temperatureUnit = Ri(Sn, this.temperatureUnit);
    }
    l() {
      switch (this.temperatureUnit) {
        case en.CELSIUS:
          return Is.unit.celsius;
        case en.FAHRENHEIT:
          return Is.unit.fahrenheit;
      }
    }
    L(t, s) {
      switch (
        (void 0 === t && (t = 0),
        void 0 === s && (s = !1),
        this.temperatureUnit)
      ) {
        case en.CELSIUS:
          return (
            Math.round(t).toString().replace("-", wn) +
            (s ? Is.unit.celsius : Is.unit.degree)
          );
        case en.FAHRENHEIT:
          return (
            Math.round(dt(t)).toString().replace("-", wn) +
            (s ? Is.unit.fahrenheit : Is.unit.degree)
          );
      }
    }
    get timeControl() {
      return this._timeControl;
    }
    set timeControl(t) {
      !this._settings.isHDLayer &&
        this._timeControl !== t &&
        Ks(nn, t) &&
        ((this._timeControl = t),
        te(De.TIME_CONTROL, t),
        this.changed(De.TIME_CONTROL));
    }
    get isTimeline() {
      return this._timeControl === nn.TIMELINE;
    }
    N() {
      this.timeControl = this.isTimeline ? nn.CLOCK : nn.TIMELINE;
    }
    get timeZone() {
      return this._timeZone;
    }
    set timeZone(t) {
      this._timeZone !== t &&
        Ks(rn, t) &&
        ((this._timeZone = t), te(De.TIME_ZONE, t), this.changed(De.TIME_ZONE));
    }
    get isUTCTimeZone() {
      return this._timeZone === rn.UTC;
    }
    O() {
      this.timeZone = this.isUTCTimeZone ? rn.LOCAL : rn.UTC;
    }
    get isDailySummary() {
      return this._summary === hn.DAILY;
    }
    C() {
      this.summary = this.isDailySummary ? hn.HOURLY : hn.DAILY;
    }
    get windDirectionUnit() {
      return this._windDirectionUnit;
    }
    set windDirectionUnit(t) {
      this._windDirectionUnit !== t &&
        Ks(on, t) &&
        ((this._windDirectionUnit = t),
        te(De.WIND_DIRECTION_UNIT, t),
        this.changed(De.WIND_DIRECTION_UNIT));
    }
    get isWindCompass() {
      return this._windDirectionUnit === on.COMPASS;
    }
    get windUnit() {
      return this._windUnit;
    }
    set windUnit(t) {
      this._windUnit !== t &&
        Ks(an, t) &&
        ((this._windUnit = t), te(De.WIND_UNIT, t), this.changed(De.WIND_UNIT));
    }
    F() {
      this.windUnit = Ri(Rn, this.windUnit);
    }
    o(t) {
      switch (this.windUnit) {
        case an.MS:
          return Is.unit.ms;
        case an.KMH:
          return Is.unit.kmh;
        case an.KNOTS:
          return t ? Is.unit.knot : Is.unit.knots;
        case an.MPH:
          return Is.unit.mph;
        case an.BEAUFORT:
          return Is.unit.beaufort;
      }
    }
    P(t, s, i) {
      let h;
      if (
        (void 0 === t && (t = 0),
        void 0 === s && (s = 1),
        void 0 === i && (i = !1),
        this.windUnit === an.BEAUFORT)
      )
        h = pn(t);
      else {
        const i = fn[this.windUnit] || 1;
        h = it(t * i, 1 / s);
      }
      return i
        ? h.toLocaleString(Kh.nonArabicLang) + " " + this.o(1 === h)
        : h.toString();
    }
    nextUnit(t) {
      t !== Re.RADAR && t !== Re.PRECIPITATION
        ? Oe(t)
          ? this.F()
          : Ne(t)
            ? this.k()
            : t === Re.PRESSURE && this.S()
        : this.D();
    }
  }
  const Ln = 10,
    Nn = 15,
    On = [ri.ICON, ri.GFS],
    Cn = "consentHeat",
    Fn = "forecastModel",
    Pn = "home",
    zn = "introsLayer",
    Un = "introsModel",
    Wn = "introsNew",
    Gn = "layer",
    jn = "layersMenu",
    _n = "layersMenuOpen",
    Bn = "measure",
    Zn = "notifications",
    Hn = "welcome",
    Yn = new (class extends ji {
      init() {
        const t = window._ZE || {};
        ((Qs.isEnabled = t.config.useLog),
          fh.update(t.config.timeOffset || 0),
          (this.U = Date.now()),
          (this.W = this.U),
          (this.version = t.version || {}),
          (this.G = !1),
          (this.j = !0),
          (this._ = Kh.mobile ? 512 : 4096),
          (this.B = Ns()));
        const s = this.B ? 1 : 0;
        ((this.zooms = {
          min: 3 - s,
          max: 11,
          models: {
            gfs: 3,
            icon: 4,
          },
          animator: 4 - s,
          storms: 5 - s,
          stormsMin: 3 + $t,
          stormsMax: 6 - s,
          search: 8,
          blueMarble: 9,
          hd: 9,
          geocolor: {
            goes: 7,
            msg: 6,
            mtg: 7,
            himawari: 7,
          },
          radar: 7,
          coverage: 9,
          heat: 3 + $t,
          heatMin: 5,
          heatMax: 9,
          fires: 7,
          fireDotMin: 6,
          precipAnim: 6,
          isolines1: 4 + $t,
          isolines2: 6 + $t,
          geolocationMin: 6 - s,
          geolocationMax: 8 - s,
          favorite: 7,
          radarNotify: 6 + $t,
          radarAnim: 7,
          markerMin: 5,
          home: 6,
        }),
          (this.user = new kn(
            this,
            t.config.countryCode,
            Kh.touch && !Kh.desktop,
            t.config.useMTG
          )),
          (this.overlays = new Ae(this)));
        const i = t.tiles || {},
          h = i.geocolor || {},
          e = !!h.max,
          n = i.radar || {},
          r = !!n.max,
          o = (this.layers = {
            geocolor: {
              hasRange: e,
              date: ph(),
              minDate: new Date(e ? 1000 * h.min : mh() - 1209600000),
              maxDate: new Date(e ? 1000 * h.max : mh() - 1200000),
              times: {},
              enabled: {},
            },
            hd: {
              date: this.hdMaxDate,
              maxDate: null,
              isAM: !1,
              sourceTime: 0,
            },
            radar: {
              hasRange: r,
              date: ph(),
              minDate: new Date(r ? 1000 * n.min : mh() - 259200000),
              maxDate: new Date(r ? 1000 * n.max : mh() + 3900000),
              times: [],
              reflectivity: {},
              coverage: "",
              areas: [],
              attributions: [],
            },
            forecast: {
              date: ph(),
            },
          });
        for (let t = gt.length; t--; ) {
          const s = gt[t];
          ((o.geocolor.enabled[s] = !0), (o.geocolor.times[s] = []));
        }
        for (let t = oi.length; t--; ) {
          const s = oi[t];
          o.forecast[s] = {
            ranges: {},
            times: {},
          };
        }
        (e ||
          (o.geocolor.minDate.setUTCMinutes(0, 0, 0),
          si(o.geocolor.maxDate, 5)),
          r ||
            (o.radar.minDate.setUTCMinutes(0, 0, 0), si(o.geocolor.maxDate, 1)),
          (this.sun = new Ai()),
          (this.useTimeSync = !1),
          (this.timeZone = null),
          (this.isTimeAnimating = !1),
          (this.Z = !0),
          (this.isWithinMSG = !1),
          (this.H = !0),
          (this.Y = []),
          (this.$ = !0),
          (this.selectedFireID = null));
        const a = o.geocolor.maxDate.getTime();
        (o.geocolor.date.setTime(a),
          (o.hd.sourceTime = o.hd.date.getTime()),
          (this._heatConsent = ((t, s) => {
            if (!Kh.storage) return s;
            let i;
            try {
              i = sessionStorage.getItem(Xh(t));
            } catch (t) {}
            return "true" === i || ("false" !== i && s);
          })(Cn, !1)),
          (this._home = Qh(Pn, "")),
          (this._layerIntros = Qh(zn, "")),
          (this._layer = Qh(Gn, Re.SATELLITE)),
          Ks(Re, this._layer) || (this.layer = Re.SATELLITE),
          (this._layersMenu = se(jn, "{}")),
          (this._layersMenuOpen = he(_n, !0)),
          (this._measure = se(Bn, "{}")),
          (this._model = Qh(Fn, ri.ICON)),
          (this._modelIntros = Qh(Un, "")),
          (this._newIntros = Qh(Wn, "")),
          (this._notifications = Qh(Zn, "")),
          (this._welcome = he(Hn, !0)));
      }
      changed(s) {
        this.dispatchEvent({
          type: t,
          setting: s,
        });
      }
      get time() {
        return this.isGeocolorLayer
          ? this.layers.geocolor.date.getTime()
          : this.isHDLayer
            ? this.layers.hd.date.getTime()
            : this.isRadarLayer
              ? this.layers.radar.date.getTime()
              : this.layers.forecast.date.getTime();
      }
      set time(t) {
        $s(t) &&
          (this.layers.geocolor.date.setTime(t),
          this.layers.hd.date.setTime(t),
          this.layers.radar.date.setTime(t),
          this.layers.forecast.date.setTime(t));
      }
      getDate() {
        return new Date(this.time);
      }
      get minDate() {
        if (this.isGeocolorLayer) return this.layers.geocolor.minDate;
        if (this.isHDLayer) return _s.all;
        if (this.isRadarLayer) return this.layers.radar.minDate;
        const t = this.forecastRange;
        return t ? t.minDate : ph();
      }
      get maxDate() {
        if (this.isGeocolorLayer)
          return this.isWithinMSG
            ? si(new Date(this.layers.geocolor.maxDate.getTime()), Nn)
            : this.layers.geocolor.maxDate;
        if (this.isHDLayer) return this.hdMaxDate;
        if (this.isRadarLayer) return this.layers.radar.maxDate;
        const t = this.forecastRange;
        return t ? t.maxDate : ph();
      }
      V() {
        si(
          bh(
            this.layers.geocolor.date,
            this.layers.geocolor.minDate,
            this.layers.geocolor.maxDate
          ),
          this.isWithinMSG ? Nn : Ln
        );
      }
      K() {
        Mh(bh(this.layers.hd.date, _s.all, this.hdMaxDate));
      }
      J() {
        si(
          bh(
            this.layers.radar.date,
            this.layers.radar.minDate,
            this.layers.radar.maxDate
          ),
          this.isRadarLayer && (this.useTimeSync || this.user.isTimeline)
            ? 1
            : this.isRadarLayer
              ? 5
              : Ln
        );
      }
      X(t) {
        si(
          t,
          this.isRadarLayer
            ? 1
            : this.isGeocolorLayer && this.isWithinMSG
              ? Nn
              : this.isRadarLayer
                ? 5
                : Ln
        );
      }
      getForecastRange(t, s) {
        const i = this.layers.forecast[t];
        if (i) {
          const t = i.ranges[s];
          if (t) return t[ni[s]];
        }
      }
      get forecastRange() {
        return this.getForecastRange(this.model, this.layer);
      }
      tt() {
        const t = this.forecastRange;
        t && bh(this.layers.forecast.date, t.minDate, t.maxDate);
      }
      st() {
        if ((this.V(), this.K(), this.J(), this.isGeocolorLayer)) {
          const t = si(
            new Date(this.layers.geocolor.maxDate.getTime()),
            this.isWithinMSG ? Nn : Ln
          );
          this.useTimeSync = this.time >= t.getTime();
        } else this.isHDLayer && (this.useTimeSync = !1);
        const t = this.layers.forecast.date;
        (this.tt(), si(t, this.useTimeSync ? 1 : Ln));
      }
      isGeocolorDate(t) {
        return t.getTime() >= this.layers.geocolor.minDate.getTime();
      }
      isRadarDate(t) {
        return (
          t.getTime() >= this.layers.radar.minDate.getTime() &&
          t.getTime() <= this.layers.radar.maxDate.getTime()
        );
      }
      isForecastDate(t, s) {
        const i = this.getForecastRange(this.model, s || this.layer);
        return !i || t.getTime() >= i.minDate.getTime();
      }
      get hdMaxDate() {
        return this.layers && this.layers.hd.maxDate
          ? this.layers.hd.maxDate
          : Mh(new Date(mh() - 54000000));
      }
      get isGeocolorLayer() {
        return this._layer === Re.SATELLITE;
      }
      get isHDLayer() {
        return this._layer === Re.SATELLITE_HD;
      }
      get isRadarLayer() {
        return this._layer === Re.RADAR;
      }
      get isPrecipitationLayer() {
        return this._layer === Re.PRECIPITATION;
      }
      get isRainLayer() {
        return this._layer === Re.RADAR || this._layer === Re.PRECIPITATION;
      }
      get isPressureLayer() {
        return this._layer === Re.PRESSURE;
      }
      get isWindLayer() {
        return Oe(this._layer);
      }
      get isTemperatureLayer() {
        return Ne(this._layer);
      }
      get isForecastLayer() {
        return Le(this._layer);
      }
      get isTimeSyncLayer() {
        return this.isRadarLayer || this.isForecastLayer;
      }
      get heatConsent() {
        return this._heatConsent;
      }
      set heatConsent(t) {
        this._heatConsent !== t &&
          Vs(t) &&
          ((this._heatConsent = t), ne(Cn, t));
      }
      get home() {
        if (0 === this._home.length) return [];
        const t = this._home.split(",");
        return [parseFloat(t[0]), parseFloat(t[1])];
      }
      set home(t) {
        if (Array.isArray(t) && 2 === t.length && $s(t[0]) && $s(t[1])) {
          const s = t.map((t) => it(t, 1000000)).join(",");
          ((this._home = s), te(Pn, s));
        }
      }
      get layer() {
        return this._layer;
      }
      set layer(t) {
        this._layer !== t &&
          Ks(Re, t) &&
          ((this._layer = t), te(Gn, t === Re.SATELLITE_HD ? Re.SATELLITE : t));
      }
      get layerIntros() {
        return this._layerIntros.length > 0 ? this._layerIntros.split(",") : [];
      }
      set layerIntros(t) {
        if (Array.isArray(t)) {
          const s = t.join(",");
          ((this._layerIntros = s), te(zn, s, !0));
        }
      }
      get layersMenu() {
        try {
          return JSON.parse(this._layersMenu) || {};
        } catch (t) {
          return {};
        }
      }
      set layersMenu(t) {
        if (Ys(t)) {
          const s = JSON.stringify(t);
          this._layersMenu !== s && ((this._layersMenu = s), ie(jn, s));
        }
      }
      get layersMenuOpen() {
        return this._layersMenuOpen;
      }
      set layersMenuOpen(t) {
        this._layersMenuOpen !== t &&
          Vs(t) &&
          ((this._layersMenuOpen = t), ee(_n, t));
      }
      get measure() {
        try {
          return JSON.parse(this._measure) || {};
        } catch (t) {
          return {};
        }
      }
      set measure(t) {
        if (Ys(t)) {
          const s = JSON.stringify(t);
          this._measure !== s && ((this._measure = s), ie(Bn, s));
        }
      }
      get model() {
        return this._model;
      }
      set model(t) {
        this._model !== t &&
          Ks(ri, t) &&
          ((this._model = t), te(Fn, t), this.changed(Fn));
      }
      get modelIntros() {
        return this._modelIntros.length > 0 ? this._modelIntros.split(",") : [];
      }
      set modelIntros(t) {
        if (Array.isArray(t)) {
          const s = t.join(",");
          ((this._modelIntros = s), te(Un, s, !0));
        }
      }
      goToModel(t) {
        this.model = Ri(On, this.model, t);
      }
      get newIntros() {
        return this._newIntros.length > 0 ? this._newIntros.split(",") : [];
      }
      set newIntros(t) {
        if (Array.isArray(t)) {
          const s = t.join(",");
          ((this._newIntros = s), te(Wn, s, !0));
        }
      }
      get notifications() {
        return this._notifications.length > 0
          ? this._notifications.split(",")
          : [];
      }
      set notifications(t) {
        if (Array.isArray(t)) {
          const s = t.join(",");
          ((this._notifications = s), te(Zn, s, !0));
        }
      }
      dismissNotification(t) {
        const s = this.notifications;
        s.includes(t) || (s.unshift(t), (this.notifications = s));
      }
      get welcome() {
        return this._welcome;
      }
      set welcome(t) {
        this._welcome !== t && Vs(t) && ((this._welcome = t), ee(Hn, t));
      }
    })(),
    qn = "radar-beta";
  class $n extends ji {
    constructor() {
      (super(), (this.dom = qi(document, ".panel.intro-new")), nh(this.dom));
      const t = qi(this.dom, "button.dismiss");
      (hh(t),
        _i(t, s, (t) => {
          (this.dispatchEvent({
            type: i,
          }),
            this.dismiss());
        }));
      const h = qi(this.dom, "button.accept");
      (hh(h),
        _i(h, s, (t) => {
          (this.dispatchEvent({
            type: qn,
          }),
            this.dismiss());
        }));
    }
    dismiss() {
      const t = Yn.newIntros;
      t.includes(qn) || (t.unshift(qn), (Yn.newIntros = t));
    }
  }
  const Vn = rs.i("Jz9ioFOSLKW0nN=="),
    Kn = {
      maps: rs.i("Y21upUZi"),
      places: rs.i("Y3OfLJAypl8="),
      storms: rs.i("Y3A0o3Wgpl8="),
      fires: rs.i("Y2McpzImYj=="),
    },
    Jn = (t) => (t || "").replace(Kn.places, "").replace(/\/+$/, ""),
    Xn = " | ";
  let Qn, tr;
  const sr = (t) => {
      document.title = Qn = t;
    },
    ir = () => {
      const t = Yn.getDate(),
        s = Yn.isHDLayer || Yn.user.isUTCTimeZone ? 0 : Nh(t, Yn.timeZone);
      return (
        t.setTime(t.getTime() - s),
        {
          localDate: t,
          utcOffset: s,
        }
      );
    },
    hr = (t, s) => {
      if (Yn.isHDLayer)
        return (
          Dh(Yn.layers.hd.date) +
          (Yn.isHDLayer ? "," + (Yn.layers.hd.isAM ? "am" : "pm") : "")
        );
      const i =
        t.getUTCFullYear() +
        "-" +
        Li(t.getUTCMonth() + 1) +
        "-" +
        Li(t.getUTCDate());
      let h = Li(t.getUTCHours()) + ":" + Li(t.getUTCMinutes());
      if (!Yn.user.isUTCTimeZone && 0 !== s) {
        const t = s / -3600000;
        h += "," + (t < 0 ? "" : "+") + t;
      }
      return i + "," + h;
    },
    er = (t) => {
      if (((tr = rs.i("nUE0pUZ6Yl96o29gYzIupaEb") + t), !navigator.standalone))
        try {
          history.replaceState({}, null, t);
        } catch (s) {
          location.replace(t);
        }
    },
    nr = function (t) {
      void 0 === t && (t = {});
      const { view: s, isFire: i, allowMap: h, markerLonLat: e, date: n } = t,
        r = Yn.isGeocolorLayer,
        o = Yn.isRadarLayer,
        a = Yn.isForecastLayer;
      let c = h && !r ? Yn.layer : "";
      c && Yn.isHDLayer && !Yn.isGeocolorDate(Yn.layers.hd.date) && (c = "");
      const l = a ? Yn.model : "",
        u = [];
      (r && Yn.overlays.radar && u.push(Se.RADAR),
        Yn.overlays.windAnimation && !Yn.isWindLayer && u.push("wind"),
        !Yn.overlays.windAnimation && Yn.isWindLayer && u.push("wind:off"),
        !Yn.overlays.heat || o || a || i || u.push(Se.HEAT),
        Yn.overlays.heat || o || a || !i || u.push("heat:off"),
        Yn.overlays.fires && !i && u.push(Se.FIRES),
        Yn.overlays.labels || u.push("labels:off"),
        o || a || Yn.overlays.lines || u.push("lines:off"),
        o && !Yn.overlays.coverage && u.push("coverage:off"),
        Yn.isPrecipitationLayer && !Yn.overlays.clouds && u.push("clouds:off"),
        Yn.isPressureLayer &&
          Yn.$ &&
          !Yn.overlays.isolines &&
          u.push("isolines:off"),
        Yn.overlays.crosshair && u.push(Se.CROSSHAIR));
      const d = [];
      if (Ys(s)) {
        const { lon: t, lat: i, zoom: h } = s;
        d.push("view=" + gn(i, h) + "," + gn(t, h) + "," + it(h, 100) + "z");
      }
      return (
        Array.isArray(e) &&
          d.push("place=" + it(e[1], 1000000) + "," + it(e[0], 1000000)),
        c && d.push("map=" + c),
        l && d.push("model=" + l),
        n && d.push("date=" + n),
        u.length > 0 && d.push("overlays=" + u.join(",")),
        0 === d.length ? "" : "#" + d.join("/")
      );
    },
    rr = new (class {
      constructor() {
        this.place = {
          lonLat: [],
          zoom: null,
          path: null,
          title: null,
          isDefault: !1,
        };
      }
      get base() {
        return Kn.maps + Yn.layer + "/";
      }
      get url() {
        return tr || location.href;
      }
      get title() {
        return Qn || this.defaultTitle;
      }
      get defaultTitle() {
        return Vn + Xn + Is.layer.full.home;
      }
      get placeTitle() {
        const t = this.place.title;
        if (t && t.length > 1)
          return t + Xn + Is.layer.full[Yn.layer] + Xn + Vn;
      }
      parse(t, s, i) {
        const h = {
          lonLat: [],
          markerLonLat: void 0,
          zoom: void 0,
          layer: void 0,
          model: void 0,
          overlays: {
            clouds: void 0,
            crosshair: void 0,
            fires: void 0,
            heat: void 0,
            isolines: void 0,
            labels: void 0,
            lines: void 0,
            radar: void 0,
            coverage: void 0,
            wind: void 0,
          },
          date: void 0,
          isHDAM: void 0,
        };
        if (
          ((s = (s || "").replace("#", "")),
          !/(view|date|map|layers|overlays)=/.test(s) && s.length > 8)
        ) {
          const t = s.split(","),
            i = t[0],
            h = t[1],
            e = "globe" === t[2];
          s = `/view=${i},${h},${e ? Yn.zooms.min : t[2]}/date=${t[e ? 3 : 5]},${"am" === t[4] ? "am" : "pm"}${
            e || "map" !== t[3] ? "" : "/overlays=labels:off"
          }`;
        }
        const e = s.split("/");
        for (let t = 0, s = e.length; t < s; t++) {
          const s = e[t].split("="),
            i = s[1] ? s[1].split(",") : [];
          switch (s[0]) {
            case "view":
              ((h.lonLat = [
                _t(parseFloat(i[1])) || 0,
                et(parseFloat(i[0]), -90, 90) || 0,
              ]),
                (h.zoom = parseFloat(i[2])),
                (!$s(h.zoom) || h.zoom < Yn.zooms.min) &&
                  (h.zoom = Yn.zooms.min),
                Yn.B && h.zoom--);
              break;
            case "place":
              h.markerLonLat = [
                _t(parseFloat(i[1])) || 0,
                et(parseFloat(i[0]), -90, 90) || 0,
              ];
              break;
            case "date":
              const t = Yn.getDate(),
                s = Mh(new Date(i[0]));
              (s.setUTCHours(t.getUTCHours()),
                s.setUTCMinutes(t.getUTCMinutes()));
              const e = i[1];
              if ("am" === e || "pm" === e) h.isHDAM = "am" === e;
              else {
                const t = e ? e.split(":") : [];
                if (2 === t.length) {
                  const i = bn(t[0]),
                    h = bn(t[1]);
                  i >= 0 &&
                    i < 24 &&
                    h >= 0 &&
                    h < 60 &&
                    (s.setUTCHours(i), s.setUTCMinutes(h));
                }
              }
              const n = parseFloat(i[2]);
              $s(n) &&
                n > -16 &&
                n < 16 &&
                s.setTime(s.getTime() - 3600000 * n);
              const r = s.getTime();
              ($s(r) && (h.date = s),
                void 0 === h.isHDAM &&
                  h.date &&
                  h.date.getTime() < mh() - 86400000 &&
                  (h.isHDAM = !1));
              break;
            case "map":
              const o = i[0];
              if ("live" === o || "geocolor" === o) {
                h.layer = Re.SATELLITE;
                break;
              }
              if ("daily" === o) {
                h.layer = Re.SATELLITE_HD;
                break;
              }
              Ks(Re, o) && (h.layer = o);
              break;
            case "model":
              const a = i[0];
              Ks(ri, a) && (h.model = a);
              break;
            case "overlays":
              for (let t = i.length; t--; )
                switch (i[t]) {
                  case Se.CLOUDS:
                    h.overlays.clouds = !0;
                    break;
                  case "clouds:off":
                    h.overlays.clouds = !1;
                    break;
                  case Se.CROSSHAIR:
                    h.overlays.crosshair = !0;
                    break;
                  case Se.FIRES:
                    h.overlays.fires = !0;
                    break;
                  case Se.HEAT:
                    h.overlays.heat = !0;
                    break;
                  case "heat:off":
                    h.overlays.heat = !1;
                    break;
                  case Se.ISOLINES:
                    h.overlays.isolines = !0;
                    break;
                  case "isolines:off":
                    h.overlays.isolines = !1;
                    break;
                  case Se.LABELS:
                    h.overlays.labels = !0;
                    break;
                  case "labels:off":
                    h.overlays.labels = !1;
                    break;
                  case Se.LINES:
                    h.overlays.lines = !0;
                    break;
                  case "lines:off":
                    h.overlays.lines = !1;
                    break;
                  case Se.RADAR:
                    h.overlays.radar = !0;
                    break;
                  case "radar:off":
                    h.overlays.radar = !1;
                    break;
                  case Se.COVERAGE:
                    h.overlays.coverage = !0;
                    break;
                  case "coverage:off":
                    h.overlays.coverage = !1;
                    break;
                  case "wind":
                    h.overlays.wind = !0;
                    break;
                  case "wind:off":
                    h.overlays.wind = !1;
                }
              break;
            case "layers":
              for (let t = i.length; t--; )
                switch (i[t]) {
                  case "daily":
                    h.layer = Re.SATELLITE_HD;
                    break;
                  case "base":
                    h.layer = Re.RADAR;
                    break;
                  case "labels:off":
                  case "nolabels":
                    h.overlays.labels = !1;
                    break;
                  case "lines:off":
                    h.overlays.lines = !1;
                    break;
                  case "wind":
                    h.overlays.wind = !0;
                    break;
                  case "radar:off":
                    h.overlays.radar = !1;
                    break;
                  case "fires":
                    h.overlays.heat = !0;
                    break;
                  case "crosshairs":
                    h.overlays.crosshair = !0;
                }
          }
        }
        if (!h.layer) {
          const s = /^\/maps\/(.*)\//.exec(t),
            i = s && s[1];
          i && Ks(Re, i) && (h.layer = i);
        }
        return (
          ((t, s) => {
            (void 0 !== t.model && (Yn.model = t.model),
              void 0 !== t.isHDAM && (Yn.layers.hd.isAM = t.isHDAM),
              void 0 !== t.overlays.crosshair
                ? (Yn.overlays.crosshair = t.overlays.crosshair)
                : s && (Yn.overlays.crosshair = !1),
              void 0 !== t.overlays.clouds
                ? (Yn.overlays.clouds = t.overlays.clouds)
                : s && (Yn.overlays.clouds = !0),
              void 0 !== t.overlays.fires
                ? (Yn.overlays.fires = t.overlays.fires)
                : s && (Yn.overlays.fires = !1),
              void 0 !== t.overlays.heat
                ? (Yn.overlays.heat = t.overlays.heat)
                : s && (Yn.overlays.heat = !1),
              void 0 !== t.overlays.isolines
                ? (Yn.overlays.isolines = t.overlays.isolines)
                : s && (Yn.overlays.isolines = !0),
              void 0 !== t.overlays.labels
                ? (Yn.overlays.labels = t.overlays.labels)
                : s && (Yn.overlays.labels = !0),
              void 0 !== t.overlays.lines
                ? (Yn.overlays.lines = t.overlays.lines)
                : s && (Yn.overlays.lines = !0),
              void 0 !== t.overlays.radar
                ? (Yn.overlays.radar = t.overlays.radar)
                : s && (Yn.overlays.radar = !1),
              void 0 !== t.overlays.coverage
                ? (Yn.overlays.coverage = t.overlays.coverage)
                : s && (Yn.overlays.coverage = !0),
              void 0 !== t.overlays.wind
                ? Oe(t.layer)
                  ? (Yn.overlays.forecastWind = t.overlays.wind)
                  : (Yn.overlays.windAnimation = t.overlays.wind)
                : s && (Yn.overlays.windAnimation = !1));
          })(h, i),
          h
        );
      }
      update(t, s, i, h) {
        if (!(Array.isArray(t) && $s(t[0]) && $s(t[1]) && $s(s))) return;
        const e = Yn.isRadarLayer || Yn.isForecastLayer,
          n = e ? Is.layer.full[Yn.layer] + Xn : "";
        if (s < Yn.zooms.min + $t)
          return (sr(e ? n + Vn : this.defaultTitle), void er(this.base));
        Yn.B && s++;
        let r = this.placeTitle;
        const { localDate: o, utcOffset: a } = ir(),
          [c, l] = t;
        if (!r)
          if (h) {
            let t = o.getUTCHours(),
              s = Li(t) + ":" + Li(o.getUTCMinutes()),
              i = s;
            if (Yn.user.is12HourTimeFormat) {
              const h = t < 12 ? Is.date.am : Is.date.pm;
              ((t %= 12),
                0 === t && (t = 12),
                (i = t + s.substring(2) + " " + h));
            }
            let h =
              o.getUTCDate() +
              Is.date.dayExtra +
              " " +
              Is.date.monthsShort[o.getUTCMonth()];
            const e = o.getUTCFullYear();
            e !== ph().getUTCFullYear() && (h += " " + e);
            const a = 10;
            let u = it(Math.abs(c), a);
            try {
              u = u.toLocaleString(Kh.nonArabicLang);
            } catch (t) {}
            u +=
              Is.unit.degree + (c < 0 ? Is.direction.west : Is.direction.east);
            let d = it(Math.abs(l), a);
            try {
              d = d.toLocaleString(Kh.nonArabicLang);
            } catch (t) {}
            ((d +=
              Is.unit.degree +
              (l < 0 ? Is.direction.south : Is.direction.north)),
              (r =
                n +
                h +
                (Yn.isHDLayer
                  ? " " + (Yn.layers.hd.isAM ? Is.date.am : Is.date.pm)
                  : Is.punctuation.comma +
                    i +
                    (Yn.user.isUTCTimeZone ? " " + Is.unit.utc : "")) +
                Xn +
                d +
                " " +
                u +
                Xn +
                Vn));
          } else r = e ? n + Vn : this.defaultTitle;
        sr(r || this.defaultTitle);
        const u = h || Yn.isHDLayer ? hr(o, a) : "",
          d = nr({
            view: {
              lon: c,
              lat: l,
              zoom: s,
            },
            markerLonLat: i,
            date: u,
          });
        er(this.base + d);
      }
      updateStormTrack(t) {
        if (t && t.id) {
          const s = t.description ? `${t.description} ${t.name}` : t.title;
          sr(
            s
              ? (t.active
                  ? s + " " + Is.storm.liveTitle
                  : s + (t.season ? " " + t.season : "")) +
                  Xn +
                  Vn
              : this.defaultTitle
          );
          const i = nr({
              allowMap: !0,
            }),
            h = `${Kn.storms}${t.id}/`;
          er(h + i);
        }
      }
      updatePlace(t) {
        if (this.place.isDefault) return !0;
        if (0 === this.place.lonLat.length) return (this.clearPlace(), !1);
        const s = this.placeTitle;
        s && sr(s);
        const i = this.place.path,
          h = i && 0 === i.indexOf(Kn.fires);
        if (i && i.length > 2 && (0 === i.indexOf(Kn.places) || h)) {
          let s;
          if (t) {
            const { localDate: t, utcOffset: i } = ir();
            s = hr(t, i);
          }
          const e = $s(this.place.zoom)
            ? nr({
                isFire: h,
                allowMap: !0,
                date: s,
              })
            : "";
          return (er(i + e), !0);
        }
        return !1;
      }
      setPlace(t, s, i, h) {
        ((this.place.lonLat = t),
          (this.place.zoom = s),
          (this.place.path = i),
          (this.place.title = h),
          (this.place.isDefault = !1));
      }
      clearPlace() {
        this.setPlace([], null, null, null);
      }
      setLanguage(t) {
        location.href =
          location.pathname + "?lang=" + t + (location.hash || "");
      }
    })(),
    or = "favorites",
    ar = "remove",
    cr = (t) =>
      Ys(t)
        ? (Array.isArray(t.locations) &&
            (t.locations = t.locations.filter((t) => $s(t.lon) && $s(t.lat))),
          t)
        : {},
    lr = new (class extends ji {
      constructor() {
        (super(), (this.it = {}));
      }
      init() {
        try {
          this.it = cr(JSON.parse(Qh(or, "{}")) || {});
        } catch (t) {}
        this.changed(m);
      }
      changed(s) {
        this.dispatchEvent({
          type: t,
          action: s,
        });
      }
      ht() {
        try {
          te(or, JSON.stringify(this.it));
        } catch (t) {}
      }
      et() {
        return (this.it.locations || []).slice(-3);
      }
      nt(t) {
        Array.isArray(t) &&
          ((this.it.locations = t),
          (this.it = cr(this.it)),
          this.ht(),
          this.changed(Q));
      }
      get rt() {
        return this.et().length;
      }
      get ot() {
        return this.rt >= 3;
      }
      ct(t, s, i) {
        if (!$s(t) || !$s(s)) return;
        let h = i;
        Array.isArray(h) || (h = this.et());
        for (let i = h.length; i--; ) {
          const e = h[i];
          if (Ys(e) && qt(e.lon, e.lat, t, s)) return e;
        }
      }
      removeLocation(t, s) {
        const i = this.it;
        if (!Array.isArray(i.locations)) return;
        const h = this.ct(t, s);
        return !!h && (Ii(i.locations, h), this.ht(), this.changed(ar), !0);
      }
      addLocation(t) {
        if (this.ct(t.lon, t.lat)) return !1;
        const s = this.it;
        return (
          Array.isArray(s.locations) || (s.locations = []),
          s.locations.unshift(t),
          this.ht(),
          this.changed("add"),
          !0
        );
      }
    })(),
    ur = (t, s) => {
      for (let i = t.length; i--; ) if (t[i] !== s[i]) return !1;
      return !0;
    },
    dr = (t, s) => ((t[0] *= s), (t[1] *= s), t),
    fr = (t, s) => {
      const i = t[0] - s[0],
        h = t[1] - s[1];
      return i * i + h * h;
    },
    mr = (t) => 1 - ((t) => t ** 3)(1 - t),
    pr = (t) => (t < 0.5 ? t * t * 2 : 1 - (2 - 2 * t) ** 2 / 2),
    gr = (t) => t,
    wr = (t, s, i) => {
      const h = et((i - t) / (s - t), 0, 1);
      return h * h * (3 - 2 * h);
    },
    vr = "source-over",
    yr = "lighter",
    Mr = "multiply",
    br = "screen",
    Ar = (t, s) => {
      t.globalCompositeOperation = s;
    },
    Tr = (t, s, i) =>
      !(
        !t ||
        (t.width === s && t.height === i) ||
        ((t.width = s), (t.height = i), 0)
      ),
    xr = (t, s) => {
      const i = Xi("canvas");
      return ((t || s) && Tr(i, t, s), i);
    },
    Er = (t, s, i) => {
      const h = {};
      return (
        s || (h.alpha = !1),
        i && (h.willReadFrequently = !0),
        t.getContext("2d", h)
      );
    },
    Dr = function (t, s, i) {
      return (
        void 0 === t && (t = 1),
        void 0 === s && (s = 1),
        void 0 === i && (i = !1),
        Er(xr(t, s), !0, i)
      );
    },
    Ir = (t, s) => (
      t &&
        ((t.fillStyle = s), t.fillRect(0, 0, t.canvas.width, t.canvas.height)),
      t
    );
  let Sr = null;
  const Rr = (t, s, i, h) => {
    (Sr || (Sr = Dr(1, 1, !0)), Sr.clearRect(0, 0, 1, 1));
    try {
      Sr.drawImage(t, s, i, 1, 1, 0, 0, 1, 1);
    } catch (t) {}
    const e = Sr.getImageData(0, 0, 1, 1).data;
    if (h || e[3] > 0) return e;
  };
  let kr = null;
  const Lr = (t, s, i, h) =>
      ((1 - i) * (1 - h) * t[s] +
        i * (1 - h) * t[s + 4] +
        (1 - i) * h * t[s + 8] +
        i * h * t[s + 12]) /
      255,
    Nr = (t, s, i) => {
      (kr || (kr = Dr(2, 2, !0)), kr.clearRect(0, 0, 2, 2));
      const h = Math.floor(s),
        e = Math.floor(i);
      try {
        kr.drawImage(t, h, e, 2, 2, 0, 0, 2, 2);
      } catch (t) {}
      const n = kr.getImageData(0, 0, 2, 2).data,
        r = s - h,
        o = i - e;
      return {
        r: Lr(n, 0, r, o),
        g: Lr(n, 1, r, o),
        b: Lr(n, 2, r, o),
        isBlank: n[3] < 255,
      };
    },
    Or = "movestart",
    Cr = "moveend",
    Fr = "postrender",
    Pr = (t, s, i, h) => {
      let e;
      for (let n = 0, r = t.length; n < r; n++)
        if (((e = t[n]), e.listener === s && e.bindTo === i))
          return (h && (e.deleteIndex = n), e);
    },
    zr = (t, s) => {
      const i = Ur(t);
      return i ? i[s] : void 0;
    },
    Ur = (t, s) => {
      let i = t._lm;
      return (!i && s && (i = t._lm = {}), i);
    },
    Wr = (t, s) => {
      const i = zr(t, s);
      if (i) {
        for (let h = 0, e = i.length; h < e; h++)
          (t.removeEventListener(s, i[h].boundListener), Zs(i[h]));
        i.length = 0;
        const h = Ur(t);
        h && (delete h[s], 0 === Object.keys(h).length && delete t._lm);
      }
    },
    Gr = (t, s, i, h, e) => {
      const n = Ur(t, !0);
      let r = n[s];
      r || (r = n[s] = []);
      let o = Pr(r, i, h, !1);
      return (
        o
          ? e || (o.callOnce = !1)
          : ((o = {
              bindTo: h,
              callOnce: !!e,
              listener: i,
              target: t,
              type: s,
            }),
            t.addEventListener(
              s,
              ((t) => {
                const s = function (s) {
                  const i = t.listener,
                    h = t.bindTo || t.target;
                  return (t.callOnce && Br(t), i.call(h, s));
                };
                return ((t.boundListener = s), s);
              })(o),
              {
                passive: !1,
              }
            ),
            r.push(o)),
        o
      );
    },
    jr = (t, s, i, h) => Gr(t, s, i, h, !0),
    _r = (t, s, i, h) => {
      const e = zr(t, s);
      if (e) {
        const t = Pr(e, i, h, !0);
        t && Br(t);
      }
    },
    Br = (t) => {
      if (t && t.target) {
        t.target.removeEventListener(t.type, t.boundListener);
        const s = zr(t.target, t.type);
        if (s) {
          const i = "deleteIndex" in t ? t.deleteIndex : s.indexOf(t);
          (-1 !== i && s.splice(i, 1), 0 === s.length && Wr(t.target, t.type));
        }
        Zs(t);
      }
    },
    Zr = (t, s) =>
      Array.isArray(t)
        ? t
        : (void 0 === s ? (s = [t, t]) : (s[0] = s[1] = t), s);
  new Array(6);
  const Hr = (t, s) => (
      (t[0] = s[0]),
      (t[1] = s[1]),
      (t[2] = s[2]),
      (t[3] = s[3]),
      (t[4] = s[4]),
      (t[5] = s[5]),
      t
    ),
    Yr = (t, s) => {
      const i = s[0],
        h = s[1];
      return (
        (s[0] = t[0] * i + t[2] * h + t[4]),
        (s[1] = t[1] * i + t[3] * h + t[5]),
        s
      );
    },
    qr = (t, s, i, h, e, n, r) => (
      (t[0] = h),
      (t[1] = 0),
      (t[2] = 0),
      (t[3] = e),
      (t[4] = n * h + s),
      (t[5] = r * e + i),
      t
    );
  let $r = 0;
  const Vr = (t) => t.uid || (t.uid = String(++$r));
  class Kr {
    constructor(t) {
      ((this.propagationStopped = !1), (this.type = t), (this.target = null));
    }
    preventDefault() {
      this.propagationStopped = !0;
    }
    stopPropagation() {
      this.propagationStopped = !0;
    }
  }
  class Jr {
    constructor() {
      this.isDisposed = !1;
    }
    disposeInternal() {}
    dispose() {
      this.isDisposed || ((this.isDisposed = !0), this.disposeInternal());
    }
  }
  const Xr = () => {};
  class Qr extends Jr {
    constructor() {
      (super(),
        (this.pendingRemovals = {}),
        (this.dispatching = {}),
        (this.listeners = {}));
    }
    addEventListener(t, s) {
      let i = this.listeners[t];
      (i || (i = this.listeners[t] = []), -1 === i.indexOf(s) && i.push(s));
    }
    dispatchEvent(t) {
      const s = t.type;
      let i;
      t.target = this;
      const h = this.listeners[s];
      if (h) {
        (s in this.dispatching ||
          ((this.dispatching[s] = 0), (this.pendingRemovals[s] = 0)),
          this.dispatching[s]++);
        for (let s = 0, e = h.length; s < e; s++)
          if (!1 === h[s].call(this, t) || t.propagationStopped) {
            i = !1;
            break;
          }
        if ((this.dispatching[s]--, 0 === this.dispatching[s])) {
          let t = this.pendingRemovals[s];
          for (delete this.pendingRemovals[s]; t--; )
            this.removeEventListener(s, Xr);
          delete this.dispatching[s];
        }
        return i;
      }
    }
    disposeInternal() {
      ((t) => {
        const s = Ur(t);
        if (s) for (let i in s) Wr(t, i);
      })(this);
    }
    getListeners(t) {
      return this.listeners[t];
    }
    hasListener(t) {
      return t ? t in this.listeners : Object.keys(this.listeners).length > 0;
    }
    removeEventListener(t, s) {
      const i = this.listeners[t];
      if (i) {
        const h = i.indexOf(s);
        t in this.pendingRemovals
          ? ((i[h] = Xr), this.pendingRemovals[t]++)
          : (i.splice(h, 1), 0 === i.length && delete this.listeners[t]);
      }
    }
  }
  class to extends Qr {
    constructor() {
      (super(), (this.revision = 0));
    }
    changed() {
      (this.revision++, this.dispatchEvent(new Kr(t)));
    }
    on(t, s) {
      if (Array.isArray(t)) {
        const i = t.length,
          h = new Array(i);
        for (let e = 0; e < i; e++) h[e] = Gr(this, t[e], s);
        return h;
      }
      return Gr(this, t, s);
    }
  }
  const so = {},
    io = (t) => (so.hasOwnProperty(t) ? so[t] : (so[t] = "change:" + t));
  class ho extends Kr {
    constructor(t, s, i) {
      (super(t), (this.key = s), (this.oldValue = i));
    }
  }
  class eo extends to {
    constructor(t) {
      (super(),
        Vr(this),
        (this.values = {}),
        void 0 !== t && this.setProperties(t));
    }
    get(t) {
      let s;
      return (this.values.hasOwnProperty(t) && (s = this.values[t]), s);
    }
    getKeys() {
      return Object.keys(this.values);
    }
    getProperties() {
      return {
        ...this.values,
      };
    }
    notify(t, s) {
      (this.dispatchEvent(new ho(io(t), t, s)),
        this.dispatchEvent(new ho(C, t, s)));
    }
    set(t, s, i) {
      if (i) this.values[t] = s;
      else {
        const i = this.values[t];
        ((this.values[t] = s), i !== s && this.notify(t, i));
      }
    }
    setProperties(t, s) {
      for (let i in t) this.set(i, t[i], s);
    }
  }
  const no = "length",
    ro = "add",
    oo = "remove";
  class ao extends Kr {
    constructor(t, s) {
      (super(t), (this.element = s));
    }
  }
  class co extends eo {
    constructor(t) {
      (void 0 === t && (t = []),
        super(),
        (this.array = t),
        this.updateLength());
    }
    clear() {
      for (; this.getLength() > 0; ) this.pop();
    }
    forEach(t) {
      const s = this.array;
      for (let i = 0, h = s.length; i < h; i++) t(s[i], i, s);
    }
    getLength() {
      return this.get(no);
    }
    insertAt(t, s) {
      (this.array.splice(t, 0, s),
        this.updateLength(),
        this.dispatchEvent(new ao(ro, s)));
    }
    pop() {
      return this.removeAt(this.getLength() - 1);
    }
    push(t) {
      const s = this.getLength();
      return (this.insertAt(s, t), this.getLength());
    }
    remove(t) {
      const s = this.array;
      for (let i = 0, h = s.length; i < h; i++)
        if (s[i] === t) return this.removeAt(i);
    }
    removeAt(t) {
      const s = this.array[t];
      return (
        this.array.splice(t, 1),
        this.updateLength(),
        this.dispatchEvent(new ao(oo, s)),
        s
      );
    }
    updateLength() {
      this.set(no, this.array.length);
    }
  }
  class lo extends eo {
    constructor(t) {
      (super(),
        (this.id = t.id),
        (this.element = Xi(t.link ? "a" : "div", t.className, t.childElement)),
        t.link &&
          ((this.element.href = t.link),
          (this.clickHandler = (t) => {
            th(t);
          })),
        (this.childElement = t.childElement),
        (this.snapToPixel = !0 === t.snapToPixel),
        (this.coordinate = [0, 0]),
        (this.pixel = null),
        (this.offset = t.offset ? t.offset.slice() : [0, 0]),
        (this.map = null),
        (this.mapPostRenderID = null));
    }
    addToMap(t, i) {
      ((this.map = t),
        t &&
          ((this.mapPostRenderID = Gr(t, Fr, this.updatePosition, this)),
          Ki(i, this.element),
          this.clickHandler && _i(this.element, s, this.clickHandler),
          this.updateSize(),
          this.updatePosition()));
    }
    removeFromMap() {
      ((this.map = null),
        this.mapPostRenderID &&
          (this.clickHandler && Yi(this.element, s, this.clickHandler),
          Vi(this.element),
          Br(this.mapPostRenderID),
          (this.mapPostRenderID = null)));
    }
    moveTo(t, s, i) {
      ((this.coordinate[0] = t[0]),
        (this.coordinate[1] = t[1]),
        void 0 !== s &&
          void 0 !== i &&
          ((this.offset[0] = s), (this.offset[1] = i)),
        this.updatePosition());
    }
    updateSize() {
      ((this.width = this.element.offsetWidth),
        (this.height = this.element.offsetHeight));
    }
    updatePosition() {
      const t = this.map;
      if (!t || !t.frameState) return;
      if (
        ((this.pixel = t.getPixelFromCoordinate(this.coordinate)), !this.pixel)
      )
        return;
      let s = this.pixel[0] + this.offset[0] - this.width / 2,
        i = this.pixel[1] + this.offset[1] - this.height / 2;
      (this.snapToPixel &&
        ((s = Math.round(s * Kh.pixelRatio) / Kh.pixelRatio),
        (i = Math.round(i * Kh.pixelRatio) / Kh.pixelRatio)),
        (this.element.style.transform = `translate3d(${s}px,${i}px,0)`));
    }
  }
  const uo = () => !1;
  class fo extends eo {
    constructor(t) {
      (void 0 === t && (t = {}),
        super(),
        t.handleEvent && (this.handleEvent = t.handleEvent),
        (this.map = null),
        this.setActive(!0));
    }
    getActive() {
      return this.get("active");
    }
    handleEvent(t) {
      return !0;
    }
    setActive(t) {
      this.set("active", t);
    }
    setMap(t) {
      this.map = t;
    }
  }
  const mo = (t, s, i, h) => {
    if (s) {
      const e = t.getResolution(),
        n = t.getCenter();
      void 0 !== e && n && s !== e && h
        ? t.animate({
            resolution: s,
            anchor: i,
            duration: h,
            easing: mr,
          })
        : (i && t.setCenter(t.calculateCenterZoom(s, i)), t.setResolution(s));
    }
  };
  class po {
    constructor() {
      ((this.decay = -0.009),
        (this.minVelocity = 0.05),
        (this.delay = 100),
        (this.points = []),
        (this.angle = 0),
        (this.initialVelocity = 0));
    }
    start() {
      ((this.points.length = 0), (this.angle = 0), (this.initialVelocity = 0));
    }
    update(t, s) {
      this.points.push(t, s, Date.now());
    }
    stop() {
      if (this.points.length < 6) return !1;
      const t = Date.now() - this.delay,
        s = this.points.length - 3;
      if (this.points[s + 2] < t) return !1;
      let i = s - 3;
      for (; i > 0 && this.points[i + 2] > t; ) i -= 3;
      const h = this.points[s + 2] - this.points[i + 2];
      if (h < 1000 / 60) return !1;
      const e = this.points[s] - this.points[i],
        n = this.points[s + 1] - this.points[i + 1];
      return (
        (this.angle = Math.atan2(n, e)),
        (this.initialVelocity = Math.sqrt(e * e + n * n) / h),
        this.initialVelocity > this.minVelocity
      );
    }
    get distance() {
      return (this.minVelocity - this.initialVelocity) / this.decay;
    }
  }
  const go = "pointercancel",
    wo = "pointerdown",
    vo = "pointerdrag",
    yo = "pointerenter",
    Mo = "pointerleave",
    bo = "pointermove",
    Ao = "pointerout",
    To = "pointerover",
    xo = "pointerup";
  class Eo extends fo {
    constructor(t) {
      (void 0 === t && (t = {}),
        super(t),
        t.handleDownEvent && (this.handleDownEvent = t.handleDownEvent),
        t.handleDragEvent && (this.handleDragEvent = t.handleDragEvent),
        t.handleMoveEvent && (this.handleMoveEvent = t.handleMoveEvent),
        t.handleUpEvent && (this.handleUpEvent = t.handleUpEvent),
        t.stopDown && (this.stopDown = t.stopDown),
        (this.lt = !1),
        (this.trackedPointers = {}),
        (this.targetPointers = []));
    }
    handleEvent(t) {
      if (!t.pointerEvent) return !0;
      let s = !1;
      if ((this.ut(t), this.lt)) {
        if (t.type === vo) this.handleDragEvent(t);
        else if (t.type === xo) {
          const s = this.handleUpEvent(t);
          this.lt = s && this.targetPointers.length > 0;
        }
      } else if (t.type === wo) {
        const i = this.handleDownEvent(t);
        (i && t.preventDefault(), (this.lt = i), (s = this.stopDown(i)));
      } else t.type === bo && this.handleMoveEvent(t);
      return !s;
    }
    handleMoveEvent(t) {}
    handleDownEvent(t) {
      return !1;
    }
    handleDragEvent(t) {}
    handleUpEvent(t) {
      return !1;
    }
    stopDown(t) {
      return t;
    }
    ut(t) {
      const { type: s, pointerEvent: i } = t;
      if (s === wo || s === vo || s === xo) {
        const t = i.pointerId + "";
        (s === xo
          ? delete this.trackedPointers[t]
          : (s === wo || t in this.trackedPointers) &&
            (this.trackedPointers[t] = i),
          (this.targetPointers = Object.values(this.trackedPointers)));
      }
    }
    dt() {
      ((this.lt = !1),
        (this.trackedPointers = {}),
        (this.targetPointers = []),
        this.handleUpEvent({
          map: this.map,
        }));
    }
  }
  const Do = (t) => {
    const s = t.length;
    let i = 0,
      h = 0;
    for (let e = 0; e < s; e++) ((i += t[e].clientX), (h += t[e].clientY));
    return [i / s, h / s];
  };
  class Io extends Eo {
    constructor() {
      (super({
        stopDown: uo,
      }),
        (this.kinetic = new po()),
        (this.centroid = null),
        (this.pointersCount = -1),
        (this.isPanning = !1),
        (this.noKinetic = !1));
    }
    handleDownEvent(t) {
      if (0 === this.targetPointers.length) return !1;
      this.centroid = null;
      const s = t.map.view;
      return (
        s.hints.isAnimating && s.setCenter(t.frameState.viewState.center),
        this.kinetic.start(),
        (this.noKinetic = this.targetPointers.length > 1),
        !0
      );
    }
    handleDragEvent(t) {
      if (this.map.view.hints.isDragZooming) return;
      this.isPanning ||
        ((this.isPanning = !0), (this.map.view.hints.isInteracting = !0));
      const s = this.targetPointers,
        i = Do(s);
      if (s.length === this.pointersCount) {
        if ((this.kinetic.update(i[0], i[1]), this.centroid)) {
          let s = [this.centroid[0] - i[0], i[1] - this.centroid[1]];
          const n = t.map.view;
          (dr(s, n.getResolution()),
            (h = s),
            (e = n.getCenter()),
            (h[0] += e[0]),
            (h[1] += e[1]),
            (s = n.constrainCenter(s)),
            n.setCenter(s));
        }
      } else this.kinetic.start();
      var h, e;
      ((this.centroid = i), (this.pointersCount = s.length));
    }
    handleUpEvent(t) {
      if (0 === this.targetPointers.length) {
        const s = t.map,
          i = s.view;
        if (!this.noKinetic && this.kinetic.stop()) {
          const t = this.kinetic.distance,
            h = this.kinetic.angle,
            e = i.getCenter(),
            n = s.getPixelFromCoordinate(e);
          i.animate({
            center: i.constrainCenter(
              s.getCoordinateFromPixel([
                n[0] - t * Math.cos(h),
                n[1] - t * Math.sin(h),
              ])
            ),
            duration: 400,
            easing: mr,
          });
        }
        return (
          this.isPanning &&
            ((this.isPanning = !1), (i.hints.isInteracting = !1), s.render()),
          !1
        );
      }
      return (this.kinetic.start(), (this.centroid = null), !0);
    }
  }
  class So extends Kr {
    constructor(t, s, i) {
      (super(t), (this.originalEvent = s));
      const h = i || {};
      ((this.bubbles = "bubbles" in h && h.bubbles),
        (this.button = "button" in h ? h.button : 0),
        (this.cancelable = "cancelable" in h && h.cancelable),
        (this.clientX = "clientX" in h ? h.clientX : 0),
        (this.clientY = "clientY" in h ? h.clientY : 0),
        (this.detail = "detail" in h ? h.detail : null),
        (this.isPrimary = "isPrimary" in h && h.isPrimary),
        (this.pointerId = "pointerId" in h ? h.pointerId : 0),
        (this.pointerType = "pointerType" in h ? h.pointerType : ""),
        (this.screenX = "screenX" in h ? h.screenX : 0),
        (this.screenY = "screenY" in h ? h.screenY : 0),
        (this.relatedTarget = "relatedTarget" in h ? h.relatedTarget : null),
        s.preventDefault &&
          (this.preventDefault = () => {
            s.preventDefault();
          }));
    }
  }
  class Ro {
    constructor(t, s) {
      ((this.dispatcher = t), (this.mapping = s));
    }
    getEvents() {
      return Object.keys(this.mapping);
    }
    getHandlerForEvent(t) {
      return this.mapping[t];
    }
  }
  class ko extends Ro {
    constructor(t) {
      const s = (t) => {
        this.dispatcher.firePointerEvent(t);
      };
      super(t, {
        pointerdown: s,
        pointermove: s,
        pointerup: s,
        pointerout: s,
        pointerover: s,
        pointercancel: s,
      });
    }
  }
  class Lo extends Qr {
    constructor(t) {
      (super(),
        (this.element = t),
        (this.pointerMap = {}),
        (this.eventMap = {}),
        (this.eventSources = []),
        this.registerSource(new ko(this)),
        this.register());
    }
    registerSource(t) {
      const s = t.getEvents();
      s &&
        (s.forEach(
          function (s) {
            const i = t.getHandlerForEvent(s);
            i && (this.eventMap[s] = i.bind(t));
          }.bind(this)
        ),
        this.eventSources.push(t));
    }
    register() {
      for (let t = 0, s = this.eventSources.length; t < s; t++)
        this.addEvents(this.eventSources[t].getEvents());
    }
    unregister() {
      for (let t = 0, s = this.eventSources.length; t < s; t++)
        this.removeEvents(this.eventSources[t].getEvents());
    }
    eventHandler(t) {
      const s = this.eventMap[t.type];
      s && s(t);
    }
    addEvents(t) {
      t.forEach(
        function (t) {
          Gr(this.element, t, this.eventHandler, this);
        }.bind(this)
      );
    }
    removeEvents(t) {
      t.forEach(
        function (t) {
          _r(this.element, t, this.eventHandler, this);
        }.bind(this)
      );
    }
    down(t, s) {
      this.fireEvent(wo, t, s);
    }
    move(t, s) {
      this.fireEvent(bo, t, s);
    }
    up(t, s) {
      this.fireEvent(xo, t, s);
    }
    enter(t, s) {
      ((t.bubbles = !1), this.fireEvent(yo, t, s));
    }
    leave(t, s) {
      ((t.bubbles = !1), this.fireEvent(Mo, t, s));
    }
    over(t, s) {
      ((t.bubbles = !0), this.fireEvent(To, t, s));
    }
    out(t, s) {
      ((t.bubbles = !0), this.fireEvent(Ao, t, s));
    }
    cancel(t, s) {
      this.fireEvent(go, t, s);
    }
    makeEvent(t, s, i) {
      return new So(t, i, s);
    }
    fireEvent(t, s, i) {
      this.dispatchEvent(this.makeEvent(t, s, i));
    }
    firePointerEvent(t) {
      this.dispatchEvent(this.makeEvent(t.type, t, t));
    }
    disposeInternal() {
      (this.unregister(), super.disposeInternal());
    }
  }
  class No extends Kr {
    constructor(t, s, i) {
      (super(t), (this.map = s), (this.frameState = Bs(i, null)));
    }
  }
  class Oo extends No {
    constructor(t, s, i, h, e) {
      (super(t, s, e),
        (this.originalEvent = i),
        (this.pixel = s.getEventPixel(i)),
        (this.coordinate = s.getCoordinateFromPixel(this.pixel)),
        (this.dragging = Bs(h, !1)));
    }
    preventDefault() {
      (super.preventDefault(), th(this.originalEvent));
    }
    stopPropagation() {
      (super.stopPropagation(), sh(this.originalEvent));
    }
  }
  class Co extends Oo {
    constructor(t, s, i, h, e) {
      (super(t, s, i.originalEvent, h, e), (this.pointerEvent = i));
    }
  }
  class Fo extends Qr {
    constructor(t, s) {
      (super(),
        (this.map = t),
        this.clickTimeoutID,
        (this.emulateClicks = !1),
        (this.isDragging = !1),
        (this.dragListenerKeys = []),
        (this.moveTolerance = s ? s * Kh.pixelRatio : Kh.pixelRatio),
        (this.downEvent = null),
        (this.activePointers = 0),
        (this.trackedTouches = {}),
        (this.pointerEventHandler = new Lo(this.map.viewport)),
        (this.documentPointerEventHandler = null),
        (this.pointerdownListenerKey = Gr(
          this.pointerEventHandler,
          wo,
          this.handlePointerDown,
          this
        )),
        (this.relayedListenerKey = Gr(
          this.pointerEventHandler,
          bo,
          this.relayEvent,
          this
        )),
        (this.firstPoint = void 0));
    }
    emulateClick(t) {
      if (
        (this.dispatchEvent(new Co(s, this.map, t)),
        void 0 !== this.clickTimeoutID)
      ) {
        (clearTimeout(this.clickTimeoutID), (this.clickTimeoutID = void 0));
        let s = 0;
        (this.firstPoint &&
          ((s = ft(
            t.clientX - this.firstPoint[0],
            t.clientY - this.firstPoint[1]
          )),
          (this.firstPoint = void 0)),
          s <= 50 && this.dispatchEvent(new Co(o, this.map, t)));
      } else
        ((this.firstPoint = [t.clientX, t.clientY]),
          (this.clickTimeoutID = setTimeout(() => {
            ((this.clickTimeoutID = void 0),
              this.dispatchEvent(new Co(_, this.map, t)));
          }, 250)));
    }
    updateActivePointers(t) {
      (t.type === wo
        ? (this.trackedTouches[t.pointerId] = !0)
        : delete this.trackedTouches[t.pointerId],
        (this.activePointers = Object.keys(this.trackedTouches).length));
    }
    ft() {
      ((this.trackedTouches = {}),
        (this.activePointers = 0),
        this.handlePointerUp());
    }
    handlePointerUp(t) {
      if (t) {
        this.updateActivePointers(t);
        const s = new Co(xo, this.map, t);
        (this.dispatchEvent(s),
          !this.emulateClicks ||
            s.propagationStopped ||
            this.isDragging ||
            0 !== t.button ||
            this.emulateClick(this.downEvent));
      }
      0 === this.activePointers &&
        (this.dragListenerKeys.forEach(Br),
        (this.dragListenerKeys.length = 0),
        (this.isDragging = !1),
        (this.downEvent = null),
        this.documentPointerEventHandler &&
          (this.documentPointerEventHandler.dispose(),
          (this.documentPointerEventHandler = null)));
    }
    handlePointerDown(t) {
      ((this.emulateClicks = 0 === this.activePointers),
        this.updateActivePointers(t),
        this.dispatchEvent(new Co(wo, this.map, t)),
        (this.downEvent = t),
        0 === this.dragListenerKeys.length &&
          ((this.documentPointerEventHandler = new Lo(document)),
          this.dragListenerKeys.push(
            Gr(
              this.documentPointerEventHandler,
              bo,
              this.handlePointerMove,
              this
            ),
            Gr(
              this.documentPointerEventHandler,
              xo,
              this.handlePointerUp,
              this
            ),
            Gr(this.pointerEventHandler, go, this.handlePointerUp, this)
          )));
    }
    handlePointerMove(t) {
      (this.isMoving(t) &&
        ((this.isDragging = !0),
        this.dispatchEvent(new Co(vo, this.map, t, this.isDragging))),
        th(t));
    }
    relayEvent(t) {
      const s = !(!this.downEvent || !this.isMoving(t));
      this.dispatchEvent(new Co(t.type, this.map, t, s));
    }
    isMoving(t) {
      return (
        this.isDragging ||
        Math.abs(t.clientX - this.downEvent.clientX) > this.moveTolerance ||
        Math.abs(t.clientY - this.downEvent.clientY) > this.moveTolerance
      );
    }
    disposeInternal() {
      (this.relayedListenerKey &&
        (Br(this.relayedListenerKey), (this.relayedListenerKey = null)),
        this.pointerdownListenerKey &&
          (Br(this.pointerdownListenerKey),
          (this.pointerdownListenerKey = null)),
        this.dragListenerKeys.forEach(Br),
        (this.dragListenerKeys.length = 0),
        this.documentPointerEventHandler &&
          (this.documentPointerEventHandler.dispose(),
          (this.documentPointerEventHandler = null)),
        this.pointerEventHandler &&
          (this.pointerEventHandler.dispose(),
          (this.pointerEventHandler = null)),
        super.disposeInternal());
    }
  }
  class Po extends Eo {
    constructor() {
      (super({
        stopDown: uo,
      }),
        (this.startY = 0),
        (this.firstPoint = void 0),
        (this.distance = 1),
        (this.hasTapped = !1),
        (this.isZooming = !1),
        (this.timeoutID = 0));
    }
    handleEvent(t) {
      return (
        !this.hasTapped &&
          t.type === s &&
          rh(t.pointerEvent) &&
          ((this.hasTapped = !0),
          (this.firstPoint = t.pixel),
          clearTimeout(this.timeoutID),
          (this.timeoutID = setTimeout(() => {
            this.hasTapped = !1;
          }, 250))),
        super.handleEvent(t)
      );
    }
    handleDownEvent(t) {
      if (1 !== this.targetPointers.length) return !1;
      if (!this.hasTapped) return !1;
      if (this.firstPoint) {
        const s = ft(
          t.pixel[0] - this.firstPoint[0],
          t.pixel[1] - this.firstPoint[1]
        );
        if (((this.firstPoint = void 0), s > 50))
          return ((this.hasTapped = !1), void clearTimeout(this.timeoutID));
      }
      ((this.startY = this.targetPointers[0].clientY), (this.distance = 1));
      const s = t.map.view;
      return (
        s.hints.isAnimating && s.setCenter(t.frameState.viewState.center),
        !0
      );
    }
    handleDragEvent(t) {
      const s = this.targetPointers;
      if (s.length > 1) return void this.dt();
      if (!this.hasTapped) return;
      (clearTimeout(this.timeoutID),
        this.isZooming ||
          ((this.isZooming = !0),
          (this.map.view.hints.isInteracting = !0),
          (this.map.view.hints.isDragZooming = !0)));
      const i = this.startY - s[0].clientY,
        h = this.distance - i;
      this.distance = i;
      const e = t.map.view;
      e.setZoom(e.getZoom() + 0.012 * h);
    }
    handleUpEvent(t) {
      if (0 === this.targetPointers.length) {
        if (this.isZooming) {
          const s = t.map;
          ((this.isZooming = !1),
            (this.hasTapped = !1),
            clearTimeout(this.timeoutID),
            (s.view.hints.isInteracting = !1),
            (s.view.hints.isDragZooming = !1),
            s.render());
        }
        return !1;
      }
      return !0;
    }
  }
  class zo extends Eo {
    constructor() {
      (super({
        stopDown: uo,
      }),
        (this.isPressing = !1),
        (this.didLongPress = !1),
        (this.timeoutID = 0));
    }
    handleEvent(t) {
      return (
        !rh(t.originalEvent) ||
        (this.ut(t),
        t.type === wo && 1 === this.targetPointers.length
          ? (clearTimeout(this.timeoutID),
            (this.isPressing = !0),
            (this.didLongPress = !1),
            (this.timeoutID = setTimeout(() => {
              ((this.didLongPress = !0), (t.type = s), this.dispatchEvent(t));
            }, 500)),
            !0)
          : (this.isPressing &&
              t.type !== h &&
              (clearTimeout(this.timeoutID),
              (this.isPressing = !1),
              this.didLongPress && ((this.didLongPress = !1), sh(t))),
            !0))
      );
    }
  }
  const Uo = "trackpad";
  class Wo extends fo {
    constructor() {
      (super(),
        (this.mode = void 0),
        (this.delta = 0),
        (this.anchor = null),
        (this.startTime = void 0),
        (this.trackpadTimeoutID = void 0),
        (this.wheelTimeoutID = void 0));
    }
    handleEvent(t) {
      const s = t.type;
      if (s !== st && s !== S) return !0;
      t.preventDefault();
      const i = t.map,
        h = t.originalEvent;
      let e;
      if (((this.anchor = t.coordinate), t.type === st)) {
        const t = h.deltaMode;
        ((e = h.deltaY),
          Kh.firefox && t === WheelEvent.DOM_DELTA_PIXEL && (e *= 1.5),
          t === WheelEvent.DOM_DELTA_LINE && (e *= 40));
      } else t.type === S && ((e = -h.wheelDeltaY), Kh.safari && (e /= 3));
      if (0 === e) return !1;
      const n = Date.now();
      if (
        (void 0 === this.startTime && (this.startTime = n),
        (!this.mode || n - this.startTime > 400) &&
          (this.mode = Math.abs(e) < 4 ? Uo : "wheel"),
        this.mode === Uo)
      ) {
        Kh.safari && t.type === st && (e *= 1.5);
        const s = i.view;
        (this.trackpadTimeoutID
          ? clearTimeout(this.trackpadTimeoutID)
          : (s.hints.isInteracting = !0),
          (this.trackpadTimeoutID = setTimeout(() => {
            ((this.trackpadTimeoutID = void 0),
              (s.hints.isInteracting = !1),
              i.render());
          }, 400)));
        let h = s.getResolution() * 2 ** (e / 300);
        const r = s.minResolution,
          o = s.maxResolution;
        let a = 0;
        (h < r
          ? ((h = Math.max(h, r / 1.25)), (a = 1))
          : h > o && ((h = Math.min(h, 1.25 * o)), (a = -1)),
          this.anchor &&
            s.setCenter(
              s.constrainCenter(s.calculateCenterZoom(h, this.anchor))
            ),
          s.setResolution(h),
          0 !== a &&
            s.animate({
              resolution: a > 0 ? r : o,
              easing: mr,
              anchor: this.anchor,
              duration: 500,
            }),
          (this.startTime = n));
      } else
        ((this.delta += e),
          clearTimeout(this.wheelTimeoutID),
          (this.wheelTimeoutID = setTimeout(
            () => {
              const t = i.view;
              (t.hints.isAnimating && t.cancelAnimations(),
                ((t, s, i) => {
                  const h = t.getResolution();
                  let e = t.constrainResolution(h, s, 0);
                  if (void 0 !== e) {
                    const s = t.resolutions;
                    e = et(
                      e,
                      t.minResolution || s.at(-1),
                      t.maxResolution || s[0]
                    );
                  }
                  if (i && void 0 !== e && e !== h) {
                    const s = t.getCenter();
                    let n = t.calculateCenterZoom(e, i);
                    ((n = t.constrainCenter(n)),
                      (i = [
                        (e * s[0] - h * n[0]) / (e - h),
                        (e * s[1] - h * n[1]) / (e - h),
                      ]));
                  }
                  mo(t, e, i, 250);
                })(t, et(-this.delta, -1, 1), this.anchor),
                (this.mode = void 0),
                (this.delta = 0),
                (this.anchor = null),
                (this.startTime = void 0));
            },
            Math.max(0, this.startTime - n + 80)
          )));
      return !1;
    }
  }
  class Go extends Eo {
    constructor() {
      (super({
        stopDown: uo,
      }),
        (this.anchor = null),
        (this.distance = void 0),
        (this.scaleDelta = 1));
    }
    handleDownEvent(t) {
      return !(
        this.targetPointers.length < 2 ||
        t.map.view.hints.isDragZooming ||
        ((this.anchor = null),
        (this.distance = void 0),
        (this.scaleDelta = 1),
        this.lt || (t.map.view.hints.isInteracting = !0),
        0)
      );
    }
    handleDragEvent(t) {
      const s = this.targetPointers,
        i = s.length;
      if (2 !== i) return void (i > 2 && this.dt());
      const h = ft(s[0].clientX - s[1].clientX, s[0].clientY - s[1].clientY);
      let e = void 0 === this.distance ? 1 : this.distance / h;
      this.distance = h;
      const n = t.map,
        r = n.view,
        o = r.getResolution(),
        a = r.minResolution,
        c = r.maxResolution;
      let l = o * e;
      (l > c ? ((e = c / o), (l = c)) : l < a && ((e = a / o), (l = a)),
        1 !== e && (this.scaleDelta = e));
      const u = n.viewport.getBoundingClientRect(),
        d = Do(s);
      ((d[0] -= u.left),
        (d[1] -= u.top),
        (this.anchor = n.getCoordinateFromPixel(d)),
        mo(r, l, this.anchor),
        n.render());
    }
    handleUpEvent(t) {
      if (this.targetPointers.length < 2) {
        const s = t.map,
          i = s.view;
        ((i.hints.isInteracting = !1), s.render());
        const h = i.getResolution();
        if (h < i.minResolution || h > i.maxResolution) {
          const t = this.scaleDelta - 1;
          ((t, s, i, h, e) => {
            ((s = t.constrainResolution(s, 0, e)), mo(t, s, i, 400));
          })(i, h, this.anchor, 0, t);
        }
        return !1;
      }
      return !0;
    }
  }
  const jo = "ready",
    _o = "extent",
    Bo = "inverted",
    Zo = "maxResolution",
    Ho = "minResolution",
    Yo = "opacity",
    qo = "source",
    $o = "visible",
    Vo = "zIndex";
  class Ko extends eo {
    constructor(t) {
      super();
      const s = {
        ...t,
      };
      ((s[Yo] = Bs(t.opacity, 1)),
        (s[$o] = Bs(t.visible, !0)),
        (s[Vo] = t.zIndex),
        (s[Zo] = Bs(t.maxResolution, 1 / 0)),
        (s[Ho] = Bs(t.minResolution, 0)),
        this.setProperties(s),
        (this.state = null));
    }
    getLayerState() {
      const t = this.state || {
        layer: this,
        managed: !0,
      };
      return (
        (t.opacity = et(this.getOpacity(), 0, 1)),
        (t.sourceState = this.getSourceState()),
        (t.visible = this.getVisible()),
        (t.extent = this.getExtent()),
        (t.zIndex = this.getZIndex() || 0),
        (t.maxResolution = this.getMaxResolution()),
        (t.minResolution = Math.max(this.getMinResolution(), 0)),
        (this.state = t),
        t
      );
    }
    getLayersArray(t) {}
    getLayerStatesArray(t) {}
    getSourceState() {}
    getExtent() {
      return this.get(_o);
    }
    setExtent(t) {
      this.set(_o, t);
    }
    getMaxResolution() {
      return this.get(Zo);
    }
    getMinResolution() {
      return this.get(Ho);
    }
    getOpacity() {
      return this.get(Yo);
    }
    setOpacity(t) {
      this.set(Yo, t);
    }
    getVisible() {
      return this.get($o);
    }
    setVisible(t) {
      this.set($o, t);
    }
    getInverted() {
      return this.get(Bo);
    }
    setInverted(t) {
      this.set(Bo, t);
    }
    getZIndex() {
      return this.get(Vo);
    }
  }
  const Jo = "layers";
  class Xo extends Ko {
    constructor(t) {
      void 0 === t && (t = {});
      const s = {
        ...t,
      };
      (delete s.layers,
        super(s),
        (this.layersListenerKeys = []),
        (this.listenerKeys = {}),
        Gr(this, io(Jo), this.handleLayersChanged, this),
        this.setLayers(new co((t.layers || []).slice())));
    }
    handleLayersChanged() {
      (this.layersListenerKeys.forEach(Br),
        (this.layersListenerKeys.length = 0));
      const s = this.getLayers();
      this.layersListenerKeys.push(
        Gr(s, ro, this.handleLayersAdd, this),
        Gr(s, oo, this.handleLayersRemove, this)
      );
      for (let t in this.listenerKeys) this.listenerKeys[t].forEach(Br);
      Zs(this.listenerKeys);
      const i = s.array;
      for (let s = 0, h = i.length; s < h; s++) {
        const h = i[s];
        this.listenerKeys[Vr(h)] = [
          Gr(h, C, this.changed, this),
          Gr(h, t, this.changed, this),
        ];
      }
      this.changed();
    }
    handleLayersAdd(s) {
      const i = s.element;
      ((this.listenerKeys[Vr(i)] = [
        Gr(i, C, this.changed, this),
        Gr(i, t, this.changed, this),
      ]),
        this.changed());
    }
    handleLayersRemove(t) {
      const s = t.element,
        i = Vr(s);
      (this.listenerKeys[i].forEach(Br),
        delete this.listenerKeys[i],
        this.changed());
    }
    getLayers() {
      return this.get(Jo);
    }
    setLayers(t) {
      this.set(Jo, t);
    }
    getLayersArray(t) {
      const s = t || [];
      return (
        this.getLayers().forEach((t) => {
          t.getLayersArray(s);
        }),
        s
      );
    }
    getLayerStatesArray(t) {
      const s = t || [],
        i = s.length;
      this.getLayers().forEach(function (t) {
        t.getLayerStatesArray(s);
      });
      const h = this.getLayerState();
      for (let t = i, e = s.length; t < e; t++) {
        const i = s[t];
        ((i.opacity *= h.opacity),
          (i.visible = i.visible && h.visible),
          (i.maxResolution = Math.min(i.maxResolution, h.maxResolution)),
          (i.minResolution = Math.max(i.minResolution, h.minResolution)),
          void 0 !== h.extent &&
            (void 0 !== i.extent
              ? (i.extent = kt(i.extent, h.extent))
              : (i.extent = h.extent)));
      }
      return s;
    }
    getSourceState() {
      return jo;
    }
  }
  const Qo = "precompose",
    ta = "postcompose",
    sa = "rendercomplete";
  class ia {
    constructor(t, s) {
      ((this.priorityFunction = function (s) {
        return t.apply(null, s);
      }),
        (this.keyFunction = function (t) {
          return t[0].getKey();
        }),
        (this.elements = []),
        (this.priorities = []),
        (this.queuedElements = {}),
        (this.tileChangeCallback = s),
        (this.tilesLoading = 0),
        (this.tilesLoadingKeys = {}));
    }
    clear() {
      ((this.elements.length = 0),
        (this.priorities.length = 0),
        Zs(this.queuedElements));
    }
    dequeue() {
      const t = this.elements,
        s = this.priorities,
        i = t[0];
      1 === t.length
        ? ((t.length = 0), (s.length = 0))
        : ((t[0] = t.pop()), (s[0] = s.pop()), this.siftUp(0));
      const h = this.keyFunction(i);
      return (delete this.queuedElements[h], i);
    }
    enqueue(s) {
      const i = this.priorityFunction(s);
      i !== 1 / 0 &&
        (this.elements.push(s),
        this.priorities.push(i),
        (this.queuedElements[this.keyFunction(s)] = !0),
        this.siftDown(0, this.elements.length - 1),
        Gr(s[0], t, this.handleTileChange, this));
    }
    handleTileChange(s) {
      const i = s.target,
        h = i.state;
      if (2 === h || 3 === h || 4 === h || 5 === h) {
        _r(i, t, this.handleTileChange, this);
        const s = i.getKey();
        (s in this.tilesLoadingKeys &&
          (delete this.tilesLoadingKeys[s], this.tilesLoading--),
          this.tileChangeCallback());
      }
    }
    getLeftChildIndex(t) {
      return 2 * t + 1;
    }
    getRightChildIndex(t) {
      return 2 * t + 2;
    }
    getParentIndex(t) {
      return (t - 1) >> 1;
    }
    isEmpty() {
      return 0 === this.elements.length;
    }
    isKeyQueued(t) {
      return t in this.queuedElements;
    }
    siftUp(t) {
      const s = this.elements,
        i = this.priorities,
        h = s.length,
        e = s[t],
        n = i[t],
        r = t;
      for (; t < h >> 1; ) {
        const e = this.getLeftChildIndex(t),
          n = this.getRightChildIndex(t),
          r = n < h && i[n] < i[e] ? n : e;
        ((s[t] = s[r]), (i[t] = i[r]), (t = r));
      }
      ((s[t] = e), (i[t] = n), this.siftDown(r, t));
    }
    siftDown(t, s) {
      const i = this.elements,
        h = this.priorities,
        e = i[s],
        n = h[s];
      for (; s > t; ) {
        const t = this.getParentIndex(s);
        if (!(h[t] > n)) break;
        ((i[s] = i[t]), (h[s] = h[t]), (s = t));
      }
      ((i[s] = e), (h[s] = n));
    }
    prioritize() {
      const t = this.priorityFunction,
        s = this.elements,
        i = this.priorities;
      let h = 0;
      for (let e = 0, n = s.length; e < n; e++) {
        const n = s[e],
          r = t(n);
        r === 1 / 0
          ? delete this.queuedElements[this.keyFunction(n)]
          : ((i[h] = r), (s[h++] = n));
      }
      ((s.length = h), (i.length = h));
      for (let t = h >> 1; t--; ) this.siftUp(t);
    }
    loadTiles(t) {
      this.prioritize();
      let s = !1,
        i = 0;
      for (; this.tilesLoading < t && i < t && this.elements.length > 0; ) {
        const t = this.dequeue()[0],
          h = t.getKey(),
          e = t.state;
        5 === e
          ? (s = !0)
          : 0 !== e ||
            h in this.tilesLoadingKeys ||
            ((this.tilesLoadingKeys[h] = !0),
            this.tilesLoading++,
            i++,
            t.load());
      }
      s && 0 === i && this.tileChangeCallback();
    }
  }
  const ha = {
      CLICK: s,
      SINGLE_CLICK: _,
      DOUBLE_CLICK: o,
      POINTER_DRAG: vo,
      POINTER_CANCEL: go,
      POINTER_DOWN: wo,
      POINTER_ENTER: yo,
      POINTER_LEAVE: Mo,
      POINTER_MOVE: bo,
      POINTER_OUT: Ao,
      POINTER_OVER: To,
      POINTER_UP: xo,
    },
    ea = (t, s) => t.visible && s >= t.minResolution && s < t.maxResolution;
  class na extends Ko {
    constructor(t) {
      const s = {
        ...t,
      };
      (delete s.source,
        super(s),
        (this.mapPrecomposeKey = null),
        (this.mapRenderKey = null),
        (this.sourceChangeKey = null),
        t.map && this.setMap(t.map),
        Gr(this, io(qo), this.handleSourcePropertyChange, this),
        this.setSource(t.source || null));
    }
    getLayersArray(t) {
      const s = t || [];
      return (s.push(this), s);
    }
    getLayerStatesArray(t) {
      const s = t || [];
      return (s.push(this.getLayerState()), s);
    }
    getSource() {
      return this.get(qo) || null;
    }
    getSourceState() {
      const t = this.getSource();
      return t ? t.state : "undefined";
    }
    handleSourceChange() {
      this.changed();
    }
    handleSourcePropertyChange() {
      this.sourceChangeKey &&
        (Br(this.sourceChangeKey), (this.sourceChangeKey = null));
      const s = this.getSource();
      (s && (this.sourceChangeKey = Gr(s, t, this.handleSourceChange, this)),
        this.changed());
    }
    setMap(s) {
      (this.mapPrecomposeKey &&
        (Br(this.mapPrecomposeKey), (this.mapPrecomposeKey = null)),
        s || this.changed(),
        this.mapRenderKey &&
          (Br(this.mapRenderKey), (this.mapRenderKey = null)),
        s &&
          ((this.mapPrecomposeKey = Gr(
            s,
            Qo,
            function (t) {
              const s = this.getLayerState();
              ((s.managed = !1),
                void 0 === this.getZIndex() && (s.zIndex = 1 / 0),
                t.frameState.layerStatesArray.push(s),
                (t.frameState.layerStates[Vr(this)] = s));
            },
            this
          )),
          (this.mapRenderKey = Gr(this, t, s.render, s)),
          this.changed()));
    }
    setSource(t) {
      this.set(qo, t);
    }
  }
  class ra extends Kr {
    constructor(t, s, i, h) {
      (super(t),
        (this.frameState = s),
        (this.context = i),
        (this.layerContext = h));
    }
  }
  const oa = (t, s) => t.zIndex - s.zIndex;
  class aa {
    constructor(t) {
      ((this.map = t),
        (this.context = Dr()),
        (this.canvas = this.context.canvas),
        Ji(t.viewport, this.canvas));
    }
    dispatchRenderEvent(t, s) {
      this.map.hasListener(t) &&
        this.map.dispatchEvent(new ra(t, s, this.context));
    }
    renderFrame(t) {
      if (!t) return;
      const s = this.canvas,
        i = this.context,
        h = t.viewState,
        e = t.pixelRatio,
        n = Math.round(t.size[0] * e),
        r = Math.round(t.size[1] * e);
      (s.width !== n || s.height !== r
        ? ((s.width = n), (s.height = r))
        : i.clearRect(0, 0, n, r),
        qr(
          t.coordinateToPixelTransform,
          t.size[0] / 2,
          t.size[1] / 2,
          1 / h.resolution,
          -1 / h.resolution,
          -h.center[0],
          -h.center[1]
        ),
        ((t) => {
          const s = (i = t)[0] * i[3] - i[1] * i[2];
          var i;
          const h = t[0],
            e = t[1],
            n = t[2],
            r = t[3],
            o = t[4],
            a = t[5];
          ((t[0] = r / s),
            (t[1] = -e / s),
            (t[2] = -n / s),
            (t[3] = h / s),
            (t[4] = (n * a - r * o) / s),
            (t[5] = -(h * a - e * o) / s));
        })(Hr(t.pixelToCoordinateTransform, t.coordinateToPixelTransform)),
        this.dispatchRenderEvent(Qo, t));
      const o = t.layerStatesArray;
      ((t, s) => {
        const i = t.length,
          h = Array(t.length);
        for (let s = 0; s < i; s++)
          h[s] = {
            index: s,
            value: t[s],
          };
        h.sort((t, i) => s(t.value, i.value) || t.index - i.index);
        for (let s = 0; s < t.length; s++) t[s] = h[s].value;
      })(o, oa);
      const a = t.viewState.resolution;
      for (let s = 0, h = o.length; s < h; s++) {
        const h = o[s];
        h.sourceState === jo &&
          ea(h, a) &&
          h.layer.renderer.prepareFrame(t, h) &&
          h.layer.renderer.composeFrame(i, t, h);
      }
      this.dispatchRenderEvent(ta, t);
    }
    forEachFeatureAtCoordinate(t, s, i, h, e, n) {
      const r = s.viewState,
        o = (t, e) => {
          const n = s.layerStates[Vr(e)].managed;
          if (!(Vr(t) in s.skippedFeatureUids) || n)
            return i.call(h, t, n ? e : null);
        };
      let a = t;
      const c = t[0];
      (c < -Ut || c > Ut) && (a = [c + Wt * Math.ceil((-Ut - c) / Wt), t[1]]);
      const l = s.layerStatesArray;
      for (let i = l.length; i--; ) {
        const h = l[i],
          c = h.layer;
        if (e.call(n, c) && ea(h, r.resolution)) {
          const i = c.getSource();
          if (i) {
            const h = c.renderer.forEachFeatureAtCoordinate(
              i.wrapX ? a : t,
              s,
              o
            );
            if (h) return h;
          }
        }
      }
    }
    forEachLayerAtPixel(t, s, i, h) {
      if (!Array.isArray(t) || !s) return;
      const e = s.viewState,
        n = s.layerStatesArray,
        r = Yr(s.pixelToCoordinateTransform, t.slice());
      for (let t = n.length; t--; ) {
        const o = n[t],
          a = o.layer,
          c = a.getExtent();
        if (h(a) && ea(o, e.resolution) && (!c || Ot(s.extent, c))) {
          const t = a.renderer.getPixelAtCoordinate(r, s);
          t && i(a, t);
        }
      }
    }
  }
  const ca = 256,
    la = (t, s, i) => t + "/" + s + "/" + i,
    ua = (t) => la(t[0], t[1], t[2]),
    da = (t, s) =>
      function (i) {
        if (i)
          return t
            .replace(/\{z\}/g, i[0].toString())
            .replace(/\{x\}/g, i[1].toString())
            .replace(/\{y\}/g, (-1 - i[2]).toString())
            .replace(/\{-y\}/g, () => {
              const t = i[0];
              return (s.getFullTileRange(t).getHeight() + i[2]).toString();
            });
      };
  class fa extends Qr {
    constructor(t, s) {
      (super(),
        (this.tileCoord = t),
        (this._state = s),
        (this.interimTile = null),
        (this.key = ""));
    }
    changed() {
      this.dispatchEvent(new Kr(t));
    }
    getKey() {
      return this.key + "/" + this.tileCoord;
    }
    getInterimTile() {
      if (!this.interimTile) return this;
      let t = this.interimTile;
      do {
        if (2 === t.state) return t;
        t = t.interimTile;
      } while (t);
      return this;
    }
    refreshInterimChain() {
      if (!this.interimTile) return;
      let t = this.interimTile,
        s = this;
      do {
        if (2 === t.state) {
          t.interimTile = null;
          break;
        }
        (1 === t.state
          ? (s = t)
          : 0 === t.state
            ? (s.interimTile = t.interimTile)
            : (s = t),
          (t = s.interimTile));
      } while (t);
    }
    get state() {
      return this._state;
    }
    set state(t) {
      ((this._state = t), this.changed());
    }
    getImage() {
      return null;
    }
    load() {}
  }
  class ma {
    constructor(t, s, i, h) {
      (void 0 === t && (t = 0),
        void 0 === s && (s = 0),
        void 0 === i && (i = 0),
        void 0 === h && (h = 0),
        (this.minX = t),
        (this.maxX = s),
        (this.minY = i),
        (this.maxY = h));
    }
    contains(t) {
      return this.containsXY(t[1], t[2]);
    }
    containsTileRange(t) {
      return (
        this.minX <= t.minX &&
        t.maxX <= this.maxX &&
        this.minY <= t.minY &&
        t.maxY <= this.maxY
      );
    }
    containsXY(t, s) {
      return (
        this.minX <= t && t <= this.maxX && this.minY <= s && s <= this.maxY
      );
    }
    equals(t) {
      return (
        this.minX === t.minX &&
        this.minY === t.minY &&
        this.maxX === t.maxX &&
        this.maxY === t.maxY
      );
    }
    extend(t) {
      (t.minX < this.minX && (this.minX = t.minX),
        t.maxX > this.maxX && (this.maxX = t.maxX),
        t.minY < this.minY && (this.minY = t.minY),
        t.maxY > this.maxY && (this.maxY = t.maxY));
    }
    getHeight() {
      return this.maxY - this.minY + 1;
    }
    getSize() {
      return [this.getWidth(), this.getHeight()];
    }
    getWidth() {
      return this.maxX - this.minX + 1;
    }
    intersects(t) {
      return (
        this.minX <= t.maxX &&
        this.maxX >= t.minX &&
        this.minY <= t.maxY &&
        this.maxY >= t.minY
      );
    }
  }
  const pa = (t, s, i, h, e) =>
      void 0 !== e
        ? ((e.minX = t), (e.maxX = s), (e.minY = i), (e.maxY = h), e)
        : new ma(t, s, i, h),
    ga = [0, 0, 0];
  class wa {
    constructor(t) {
      (void 0 === t && (t = {}),
        (this.minZoom = Bs(t.minZoom, 0)),
        (this.resolutions =
          t.resolutions ||
          ((t, s, i) => {
            const h = Bs(s, 12),
              e = Rt(t),
              n = Nt(t),
              r = Zr(Bs(i, ca)),
              o = Math.max(n / r[0], e / r[1]),
              a = h + 1,
              c = new Array(a);
            for (let t = 0; t < a; t++) c[t] = o / 2 ** t;
            return c;
          })(Gt, t.maxZoom, t.tileSize)),
        (this.maxZoom = this.resolutions.length - 1),
        (this.origin = Lt(Gt)),
        (this.tileSize = Bs(t.tileSize, ca)),
        (this.tempSize = [0, 0]));
      const s = this.resolutions.length,
        i = new Array(s);
      for (let t = this.minZoom; t < s; t++)
        i[t] = this.getTileRangeForExtentAndZ(Gt, t);
      this.fullTileRanges = i;
    }
    forEachTileCoord(t, s, i) {
      const h = this.getTileRangeForExtentAndZ(t, s);
      for (let t = h.minX, e = h.maxX; t <= e; t++)
        for (let e = h.minY, n = h.maxY; e <= n; e++) i([s, t, e]);
    }
    forEachTileCoordParentTileRange(t, s, i, h) {
      let e,
        n = t[0] - 1,
        r = t[1],
        o = t[2];
      for (; n >= this.minZoom; ) {
        if (
          ((r = Math.floor(r / 2)),
          (o = Math.floor(o / 2)),
          (e = pa(r, r, o, o, h)),
          s.call(i, n, e))
        )
          return !0;
        n--;
      }
      return !1;
    }
    getResolution(t) {
      return this.resolutions[t];
    }
    getTileCoordChildTileRange(t, s) {
      if (t[0] < this.maxZoom) {
        const i = 2 * t[1],
          h = 2 * t[2];
        return pa(i, i + 1, h, h + 1, s);
      }
      return null;
    }
    getTileRangeExtent(t, s, i) {
      const h = this.origin,
        e = this.getResolution(t),
        n = Zr(this.tileSize, this.tempSize),
        r = h[0] + s.minX * n[0] * e,
        o = h[0] + (s.maxX + 1) * n[0] * e,
        a = h[1] + s.minY * n[1] * e,
        c = h[1] + (s.maxY + 1) * n[1] * e;
      return Tt(r, a, o, c, i);
    }
    getTileRangeForExtentAndZ(t, s, i) {
      const h = ga;
      this.getTileCoordForXYAndZ(t[0], t[1], s, !1, h);
      const e = h[1],
        n = h[2];
      return (
        this.getTileCoordForXYAndZ(t[2], t[3], s, !0, h),
        pa(e, h[1], n, h[2], i)
      );
    }
    getTileCoordCenter(t) {
      const s = this.origin,
        i = this.getResolution(t[0]),
        h = Zr(this.tileSize, this.tempSize);
      return [s[0] + (t[1] + 0.5) * h[0] * i, s[1] + (t[2] + 0.5) * h[1] * i];
    }
    getTileCoordExtent(t, s) {
      const i = this.origin,
        h = this.getResolution(t[0]),
        e = Zr(this.tileSize, this.tempSize),
        n = i[0] + t[1] * e[0] * h,
        r = i[1] + t[2] * e[1] * h,
        o = n + e[0] * h,
        a = r + e[1] * h;
      return Tt(n, r, o, a, s);
    }
    getTileCoordForXYAndZ(t, s, i, h, e) {
      const n = this.origin,
        r = this.getResolution(i),
        o = Zr(this.tileSize, this.tempSize),
        a = h ? 0.5 : 0,
        c = h ? 0 : 0.5,
        l = Math.floor((t - n[0]) / r + a),
        u = Math.floor((s - n[1]) / r + c);
      let d = l / o[0],
        f = u / o[1];
      return (
        h
          ? ((d = Math.ceil(d) - 1), (f = Math.ceil(f) - 1))
          : ((d = Math.floor(d)), (f = Math.floor(f))),
        ((t, s, i, h) =>
          void 0 !== h ? ((h[0] = t), (h[1] = s), (h[2] = i), h) : [t, s, i])(
          i,
          d,
          f,
          e
        )
      );
    }
    getTileCoordForCoordAndZ(t, s, i) {
      return this.getTileCoordForXYAndZ(t[0], t[1], s, !1, i);
    }
    getFullTileRange(t) {
      return this.fullTileRanges ? this.fullTileRanges[t] : null;
    }
    getZForResolution(t) {
      return et(xi(this.resolutions, t, 0), this.minZoom, this.maxZoom);
    }
  }
  const va = "center",
    ya = "resolution";
  class Ma extends eo {
    constructor(t) {
      (super(),
        (this.hints = {
          isAnimating: !1,
          isInteracting: !1,
          isDragZooming: !1,
        }),
        (this.animations = []),
        this.rafID,
        this.applyOptions(t));
    }
    applyOptions(t) {
      const s = {};
      s[va] = Bs(t.center, [0, 0]);
      const i = Aa(t);
      ((this.maxResolution = i.maxResolution),
        (this.minResolution = i.minResolution),
        (this.zoomFactor = i.zoomFactor),
        (this.resolutions = t.resolutions),
        (this.minZoom = i.minZoom),
        (this.constraints = {
          center: (s) =>
            s
              ? [
                  et(s[0], t.extent[0], t.extent[2]),
                  et(s[1], t.extent[1], t.extent[3]),
                ]
              : void 0,
          resolution: i.constraint,
        }),
        (s[ya] = this.constrainResolution(
          this.maxResolution,
          t.zoom - this.minZoom
        )),
        this.resolutions &&
          (s[ya] = et(
            Number(this.getResolution() || s[ya]),
            this.minResolution,
            this.maxResolution
          )),
        this.setProperties(s),
        (this.options = t));
    }
    animate(t) {
      let s,
        i = arguments.length;
      if (
        (i > 1 && qs(arguments[i - 1]) && ((s = arguments[i - 1]), i--),
        !this.isDef())
      ) {
        const t = arguments[i - 1];
        return (
          t.center && this.setCenter(t.center),
          void 0 !== t.zoom && this.setZoom(t.zoom),
          void (s && ba(s, !0))
        );
      }
      let h = Date.now(),
        e = this.getCenter().slice(),
        n = this.getResolution();
      const r = [];
      for (let t = 0; t < i; t++) {
        const i = arguments[t],
          o = {
            start: h,
            complete: !1,
            anchor: i.anchor,
            duration: Bs(i.duration, 1000),
            easing: Bs(i.easing, pr),
          };
        (i.center &&
          ((o.sourceCenter = e),
          (o.targetCenter = i.center),
          (e = o.targetCenter)),
          void 0 !== i.zoom
            ? ((o.sourceResolution = n),
              (o.targetResolution = this.constrainResolution(
                this.maxResolution,
                i.zoom - this.minZoom,
                0
              )),
              (n = o.targetResolution))
            : i.resolution &&
              ((o.sourceResolution = n),
              (o.targetResolution = i.resolution),
              (n = o.targetResolution)),
          (o.callback = s),
          Ta(o) ? (o.complete = !0) : (h += o.duration),
          r.push(o));
      }
      (this.animations.push(r),
        (this.hints.isAnimating = !0),
        this.updateAnimations());
    }
    cancelAnimations() {
      this.hints.isAnimating = !1;
      for (let t = 0, s = this.animations.length; t < s; t++) {
        const s = this.animations[t];
        s[0].callback && ba(s[0].callback, !1);
      }
      this.animations.length = 0;
    }
    updateAnimations() {
      if (
        (void 0 !== this.rafID &&
          (cancelAnimationFrame(this.rafID), (this.rafID = void 0)),
        !this.hints.isAnimating)
      )
        return;
      const t = Date.now();
      let s = !1;
      for (let i = this.animations.length; i--; ) {
        const h = this.animations[i];
        let e = !0;
        for (let i = 0, n = h.length; i < n; i++) {
          const n = h[i];
          if (n.complete) continue;
          const r = t - n.start;
          let o = n.duration > 0 ? r / n.duration : 1;
          o >= 1 ? ((n.complete = !0), (o = 1)) : (e = !1);
          const a = n.easing(o);
          if (n.sourceCenter) {
            const [t, s] = n.sourceCenter,
              [i, h] = n.targetCenter,
              e = t + a * (i - t),
              r = s + a * (h - s);
            this.set(va, [e, r]);
          }
          if (n.sourceResolution && n.targetResolution) {
            const t =
              1 === a
                ? n.targetResolution
                : n.sourceResolution +
                  a * (n.targetResolution - n.sourceResolution);
            (n.anchor && this.set(va, this.calculateCenterZoom(t, n.anchor)),
              this.set(ya, t));
          }
          if (((s = !0), !n.complete)) break;
        }
        if (e) {
          this.animations[i] = null;
          const t = h[0].callback;
          t && ba(t, !0);
        }
      }
      ((this.animations = this.animations.filter(Boolean)),
        s &&
          void 0 === this.rafID &&
          (this.rafID = requestAnimationFrame(() => {
            this.updateAnimations();
          })),
        s || ((this.hints.isAnimating = !1), this.dispatchEvent(new ho(C))));
    }
    calculateCenterZoom(t, s) {
      const i = this.getCenter(),
        h = this.getResolution();
      if (void 0 !== i && void 0 !== h)
        return [s[0] - (t * (s[0] - i[0])) / h, s[1] - (t * (s[1] - i[1])) / h];
    }
    constrainCenter(t) {
      return this.constraints.center(t);
    }
    constrainResolution(t, s, i) {
      return (
        void 0 === s && (s = 0),
        void 0 === i && (i = 0),
        this.constraints.resolution(t, s, i)
      );
    }
    getCenter() {
      return this.get(va) || [0, 0];
    }
    getHints(t) {
      return void 0 === t
        ? {
            isAnimating: this.hints.isAnimating,
            isInteracting: this.hints.isInteracting,
          }
        : ((t.isAnimating = this.hints.isAnimating),
          (t.isInteracting = this.hints.isInteracting),
          t);
    }
    calculateExtent(t) {
      return St(this.getCenter(), this.getResolution(), t);
    }
    getResolution() {
      return this.get(ya) || this.maxResolution;
    }
    getResolutionForExtent(t, s) {
      return Math.max(Nt(t) / s[0], Rt(t) / s[1]);
    }
    getResolutionForValueFunction(t) {
      void 0 === t && (t = 2);
      const s = this.maxResolution,
        i = Math.log(s / this.minResolution) / Math.log(t);
      return (h) => s / t ** (h * i);
    }
    getValueForResolutionFunction(t) {
      const s = t || 2,
        i = this.maxResolution,
        h = this.minResolution,
        e = Math.log(i / h) / Math.log(s);
      return (t) => Math.log(i / t) / Math.log(s) / e;
    }
    getState(t) {
      const s = this.getCenter(),
        i = this.getResolution(),
        h = i / t;
      return {
        center: [Math.round(s[0] / h) * h, Math.round(s[1] / h) * h],
        resolution: i,
        zoom: this.getZoom(),
      };
    }
    getZoom() {
      const t = this.getResolution();
      if (void 0 !== t) return this.getZoomForResolution(t);
    }
    getZoomForResolution(t) {
      let s,
        i,
        h = this.minZoom || 0;
      if (this.resolutions) {
        const e = xi(this.resolutions, t, 1);
        ((h = e),
          (s = this.resolutions[e]),
          (i =
            e === this.resolutions.length - 1
              ? 2
              : s / this.resolutions[e + 1]));
      } else ((s = this.maxResolution), (i = this.zoomFactor));
      return h + Math.log(s / t) / Math.log(i);
    }
    getResolutionForZoom(t) {
      return this.constrainResolution(this.maxResolution, t - this.minZoom, 0);
    }
    fit(t, s) {
      void 0 === s && (s = {});
      const i = s.size,
        h =
          void 0 === s.maxZoom
            ? 0
            : this.constrainResolution(
                this.maxResolution,
                s.maxZoom - this.minZoom,
                0
              ),
        e = s.padding || [0, 0, 0, 0];
      let n = this.getResolutionForExtent(t, [
        i[0] - e[1] - e[3],
        i[1] - e[0] - e[2],
      ]);
      n = isNaN(n) ? h : Math.max(n, h);
      let r = this.constrainResolution(n, 0, 0);
      if (
        (r < n && (r = this.constrainResolution(r, -1, 0)),
        (n = r),
        s.returnZoom)
      )
        return this.getZoomForResolution(n);
      const o = [
        (t[0] + t[2]) / 2 + ((e[1] - e[3]) / 2) * n,
        (t[1] + t[3]) / 2 + ((e[0] - e[2]) / 2) * n,
      ];
      (this.setCenter(o), this.setResolution(n));
    }
    isDef() {
      return this.getCenter() && void 0 !== this.getResolution();
    }
    setCenter(t) {
      (this.set(va, t), this.hints.isAnimating && this.cancelAnimations());
    }
    setResolution(t) {
      (this.set(ya, t), this.hints.isAnimating && this.cancelAnimations());
    }
    setZoom(t) {
      this.setResolution(this.getResolutionForZoom(t));
    }
  }
  const ba = (t, s) => {
      setTimeout(() => {
        t(s);
      }, Gi);
    },
    Aa = (t) => {
      let s,
        i,
        h,
        e = Bs(t.minZoom, 0),
        n = Bs(t.maxZoom, 12);
      const r = Bs(t.zoomFactor, 2);
      if (void 0 !== t.resolutions) {
        const r = t.resolutions;
        ((i = r[e]), (h = Bs(r[n], r.at(-1))), (s = xa(r)));
      } else {
        const o = Wt / ca,
          a = o / 4096;
        ((i = t.maxResolution),
          void 0 !== i ? (e = 0) : (i = o / r ** e),
          (h = t.minResolution),
          void 0 === h &&
            (h =
              void 0 !== t.maxZoom
                ? void 0 !== t.maxResolution
                  ? i / r ** n
                  : o / r ** n
                : a),
          (n = e + Math.floor(Math.log(i / h) / Math.log(r))),
          (h = i / r ** (n - e)),
          (s = Ea(r, i, n - e)));
      }
      return {
        constraint: s,
        maxResolution: i,
        minResolution: h,
        minZoom: e,
        zoomFactor: r,
      };
    },
    Ta = (t) =>
      !(
        t.sourceCenter &&
        t.targetCenter &&
        !ur(t.sourceCenter, t.targetCenter)
      ) && t.sourceResolution === t.targetResolution,
    xa = (t) => (s, i, h) => {
      if (void 0 !== s) {
        let e = xi(t, s, h);
        e = et(e + i, 0, t.length - 1);
        const n = Math.floor(e);
        if (e !== n && n < t.length - 1) {
          const s = t[n] / t[n + 1];
          return t[n] / s ** (e - n);
        }
        return t[n];
      }
    },
    Ea = (t, s, i) => (h, e, n) => {
      if (void 0 !== h) {
        const r = 0.5 - n / 2,
          o = Math.floor(Math.log(s / h) / Math.log(t) + r);
        let a = Math.max(o + e, 0);
        return (void 0 !== i && (a = Math.min(a, i)), s / t ** a);
      }
    },
    Da = 1 / 0,
    Ia = () => !0;
  class Sa extends eo {
    constructor(s) {
      (super(),
        (this.view = s.view),
        (this.layerGroup = new Xo({
          layers: s.layers,
        })),
        (this.target = s.target),
        (this.size = [0, 0]),
        (this.pixelRatio = s.pixelRatio),
        this.rafID,
        (this.renderDelay = () => {
          ((this.rafID = void 0), this.renderFrame());
        }),
        (this.coordinateToPixelTransform = [1, 0, 0, 1, 0, 0]),
        (this.pixelToCoordinateTransform = [1, 0, 0, 1, 0, 0]),
        (this.frameIndex = 0),
        (this.frameState = null),
        (this.previousExtent = null),
        (this.viewport = Ki(s.target, Xi("div", "viewport notranslate"))),
        (this.container = Ki(this.viewport, Xi("div"))),
        Ki(this.container, Xi("div", "map-crosshair")),
        (this.marker = Ki(this.container, Xi("div", "map-marker"))),
        (this.favorites = Ki(this.container, Xi("div", "map-favorites"))),
        (this.labels = Ki(this.container, Xi("div", "map-labels"))),
        (this.storms = Ki(this.container, Xi("div", "map-storms"))),
        (this.geo = Ki(this.container, Xi("div", "map-geo"))),
        (this.measures = Ki(this.container, Xi("div", "map-measures"))),
        (this.mapBrowserEventHandler = new Fo(this, s.moveTolerance)));
      for (let t in ha)
        Gr(
          this.mapBrowserEventHandler,
          ha[t],
          this.handleMapBrowserEvent,
          this
        );
      (Gr(this.viewport, h, this.handleBrowserEvent, this),
        Gr(this.viewport, st, this.handleBrowserEvent, this),
        Gr(this.viewport, S, this.handleBrowserEvent, this),
        (this.renderer = new aa(this)),
        (this.postRenderFunctions = []),
        (this.tileQueue = new ia(
          this.getTilePriority.bind(this),
          this.render.bind(this)
        )),
        (this.skippedFeatureUids = {}),
        Gr(this.layerGroup, C, this.render, this),
        Gr(this.layerGroup, t, this.render, this),
        Gr(this.view, C, this.render, this),
        (this.interactions = new co()),
        Gr(this.interactions, ro, (t) => {
          t.element.setMap(this);
        }),
        Gr(this.interactions, oo, (t) => {
          t.element.setMap(null);
        }),
        (this.longPress = new zo()),
        new co([
          new Wo(),
          new Io(),
          new Go(),
          new Po(),
          this.longPress,
        ]).forEach((t) => {
          this.interactions.push(t);
        }),
        (this.overlays = new co()),
        this.addOverlays(new co(s.overlays || [])),
        Gr(this.overlays, oo, (t) => {
          t.element.removeFromMap();
        }),
        (this.labelOverlays = new co()),
        this.updateSize());
    }
    addInteraction(t) {
      this.interactions.push(t);
    }
    gt() {
      (this.interactions.forEach((t) => {
        qs(t.dt) && t.dt();
      }),
        this.mapBrowserEventHandler.ft());
    }
    addOverlay(t, s) {
      (this.overlays.push(t), t.addToMap(this, s || this.container));
    }
    addOverlays(t, s) {
      const i = Xi();
      (t.forEach((t) => {
        ((s ? this.labelOverlays : this.overlays).push(t), t.addToMap(this, i));
      }),
        Ki(s ? this.labels : this.container, i),
        t.forEach((t) => {
          t.updateSize();
        }));
    }
    removeOverlay(t, s) {
      ((s ? this.labelOverlays : this.overlays).remove(t), t.removeFromMap());
    }
    forEachFeatureAtPixel(t, s, i) {
      if ((void 0 === i && (i = {}), !this.frameState)) return;
      const h = this.getCoordinateFromPixel(t),
        e = Bs(i.layerFilter, Ia);
      return this.renderer.forEachFeatureAtCoordinate(
        h,
        this.frameState,
        s,
        null,
        e,
        null
      );
    }
    getFeaturesAtPixel(t, s) {
      const i = [];
      return (
        this.forEachFeatureAtPixel(
          t,
          (t) => {
            i.push(t);
          },
          s
        ),
        i
      );
    }
    getEventCoordinate(t) {
      return this.getCoordinateFromPixel(this.getEventPixel(t));
    }
    getEventPixel(t) {
      const s = this.viewport.getBoundingClientRect(),
        i = "changedTouches" in t ? t.changedTouches[0] : t;
      return [i.clientX - s.left, i.clientY - s.top];
    }
    getCoordinateFromPixel(t) {
      const s = this.frameState;
      return s ? Yr(s.pixelToCoordinateTransform, t.slice()) : null;
    }
    getLayerStates() {
      return this.layerGroup.getLayerStatesArray();
    }
    getLoading() {
      const t = this.getLayerStates();
      for (let s = 0, i = t.length; s < i; ++s) {
        const i = t[s].layer;
        if (i) {
          const t = i.getSource();
          if (t && t.isLoading) return !0;
        }
      }
      return !1;
    }
    getPixelFromCoordinate(t) {
      const s = this.frameState;
      return s ? Yr(s.coordinateToPixelTransform, t.slice(0, 2)) : null;
    }
    getTilePriority(t, s, i, h) {
      const e = this.frameState;
      if (!e || !(s in e.wantedTiles)) return 1 / 0;
      if (!e.wantedTiles[s][t.getKey()]) return 1 / 0;
      const n = i[0] - e.viewState.center[0],
        r = i[1] - e.viewState.center[1];
      return 65536 * Math.log(h) + Math.sqrt(n * n + r * r) / h;
    }
    handleBrowserEvent(t, s) {
      const i = s || t.type,
        h = new Oo(i, this, t);
      this.handleMapBrowserEvent(h);
    }
    handleMapBrowserEvent(t) {
      if (!this.frameState) return;
      t.frameState = this.frameState;
      const s = this.interactions.array;
      if (!1 !== this.dispatchEvent(t))
        for (let i = s.length - 1; i >= 0; i--) {
          const h = s[i];
          if (h.getActive() && !h.handleEvent(t)) break;
        }
    }
    handlePostRender() {
      const t = this.frameState,
        s = this.tileQueue;
      if (!s.isEmpty()) {
        if (!navigator.onLine) return;
        let i;
        ((i =
          (t &&
            (t.viewHints.isInteracting || t.viewHints.isAnimating) &&
            Date.now() - t.time > 4) ||
          Yn.G
            ? 8
            : Yn.j
              ? Da
              : 32),
          s.tilesLoading < i && s.loadTiles(i));
      }
      t &&
        this.hasListener(sa) &&
        s.tilesLoading < 1 &&
        !this.getLoading() &&
        this.renderer.dispatchRenderEvent(sa, t);
      const i = this.postRenderFunctions;
      for (let s = 0, h = i.length; s < h; ++s) i[s](this, t);
      i.length = 0;
    }
    render() {
      void 0 === this.rafID &&
        (this.rafID = requestAnimationFrame(this.renderDelay));
    }
    renderFrame() {
      const t = Date.now(),
        s = this.size,
        i = this.view,
        h = [1 / 0, 1 / 0, -1 / 0, -1 / 0],
        e = this.frameState;
      let n,
        r = null;
      if (void 0 !== s && ((t) => t[0] > 0 && t[1] > 0)(s) && i && i.isDef()) {
        const e = i.getHints(
            this.frameState ? this.frameState.viewHints : void 0
          ),
          o = this.getLayerStates(),
          a = {};
        for (let t = 0, s = o.length; t < s; ++t) a[Vr(o[t].layer)] = o[t];
        ((n = i.getState(this.pixelRatio)),
          (r = {
            coordinateToPixelTransform: this.coordinateToPixelTransform,
            extent: h,
            index: this.frameIndex++,
            layerStates: a,
            layerStatesArray: o,
            pixelRatio: this.pixelRatio,
            pixelToCoordinateTransform: this.pixelToCoordinateTransform,
            postRenderFunctions: [],
            size: s,
            skippedFeatureUids: this.skippedFeatureUids,
            tileQueue: this.tileQueue,
            time: t,
            usedTiles: {},
            viewState: n,
            viewHints: e,
            wantedTiles: {},
          }));
      }
      (r && (r.extent = St(n.center, n.resolution, r.size, h)),
        (this.frameState = r),
        this.renderer.renderFrame(r),
        r &&
          (Array.prototype.push.apply(
            this.postRenderFunctions,
            r.postRenderFunctions
          ),
          e &&
            (!this.previousExtent ||
              (!Ct(this.previousExtent) &&
                !Et(r.extent, this.previousExtent))) &&
            (this.dispatchEvent(new No(Or, this, e)),
            (this.previousExtent = xt(this.previousExtent))),
          this.moveEndTimeoutID ||
            !this.previousExtent ||
            r.viewHints.isAnimating ||
            r.viewHints.isInteracting ||
            Et(r.extent, this.previousExtent) ||
            (this.moveEndTimeoutID = setTimeout(() => {
              ((this.moveEndTimeoutID = void 0),
                this.dispatchEvent(new No(Cr, this, r)),
                vt(r.extent, this.previousExtent));
            }, 0))),
        this.dispatchEvent(new No(Fr, this, r)),
        this.postRenderTimeoutID ||
          (this.postRenderTimeoutID = setTimeout(() => {
            ((this.postRenderTimeoutID = void 0), this.handlePostRender());
          }, 0)));
    }
    skipFeature(t) {
      ((this.skippedFeatureUids[Vr(t)] = !0), this.render());
    }
    unskipFeature(t) {
      (delete this.skippedFeatureUids[Vr(t)], this.render());
    }
    setSize(t, s) {
      ((this.size[0] = t), (this.size[1] = s));
    }
    updateSize() {
      const t = this.target;
      (t && this.setSize(t.offsetWidth, t.offsetHeight),
        this.overlays.forEach((t) => {
          (t.updateSize(), t.updatePosition());
        }),
        this.labelOverlays.forEach((t) => {
          (t.updateSize(), t.updatePosition());
        }),
        this.render());
    }
  }
  const Ra = {};
  ((Ra[He.SLOW] = 0.25), (Ra[He.MEDIUM] = 0.75), (Ra[He.FAST] = 1.5));
  class ka extends ji {
    constructor(t) {
      (super(),
        (this.map = t),
        (this.mapCanvas = this.map.renderer.canvas),
        (this.canvas = null),
        (this.context = null),
        (this.frames = []),
        (this.frame = 0),
        (this.frameInterval = 1),
        (this.frameTimes = []),
        (this.step = 0),
        (this.maxFrames = 0),
        (this.endFrames = 0),
        (this.alpha = 0),
        (this.time = 0),
        (this.isRecording = !1),
        (this.isPlaying = !1),
        (this.wt = Kh.chrome || !Kh.mobile),
        this.map.on(Or, (t) => {
          this.stop();
        }),
        (this.timeoutID = 0),
        this.map.on(sa, (t) => {
          this.isRecording &&
            Yn.isGeocolorLayer &&
            (clearTimeout(this.timeoutID),
            (this.timeoutID = setTimeout(() => {
              this.drawFrame();
            }, Gi)));
        }));
    }
    get isActive() {
      return this.isRecording || this.isPlaying;
    }
    get date() {
      if (this.isRecording && this.frame > 0) {
        const t = this.frameTimes[Math.min(this.frame - 1, this.maxFrames)];
        return new Date(t);
      }
      if (this.isPlaying) {
        const t = this.frameTimes[Math.min(this.frame, this.maxFrames)],
          s = this.frameTimes[Math.min(this.frame + 1, this.maxFrames)];
        return t === s && this.alpha >= 50
          ? new Date(this.frameTimes[0])
          : new Date(ut(t, s, this.alpha / 100));
      }
    }
    start() {
      if (this.isRecording || this.isPlaying) return void this.stop();
      const t = Math.min(
          Yn.user.animationDuration,
          (Yn.maxDate.getTime() - Yn.minDate.getTime()) / 3600000
        ),
        s = Yn.isWithinMSG;
      this.frameInterval =
        t > 12 || (!s && this.map.view.getZoom() < Yn.zooms.animator) ? 2 : 1;
      const i = (s ? 4 : 6) / this.frameInterval;
      ((this.maxFrames = Math.floor(i * t)),
        (this.endFrames = Math.floor(i * (t > 6 ? 1.5 : 1))),
        (this.step =
          100 /
          ((s ? 6 : 4) * (t > 12 ? 0.5 : t > 6 ? 1 : 1.5)) /
          this.frameInterval),
        0 === this.frames.length ? this.record() : this.play());
    }
    record() {
      if (this.isRecording) return;
      let t;
      try {
        t = this.canvas = xr();
      } catch (t) {}
      if (!t || !t.width) return (this.stop(), void (this.wt = !1));
      const s = this.mapCanvas;
      ((t.className = "animator"),
        Tr(t, Math.round(s.width), Math.round(s.height)));
      try {
        (this.context = Ir(Er(t), "#000")).drawImage(
          s,
          0,
          0,
          s.width,
          s.height,
          0,
          0,
          t.width,
          t.height
        );
      } catch (t) {
        return (
          this.stop(),
          (this.wt = !1),
          (Yn.user.animationStyle = Ye.FAST),
          void Qs.add("animator", t.message)
        );
      }
      (Ji(s, t, "afterend"),
        (this.isRecording = !0),
        (this.frame = 0),
        this.dispatchEvent({
          type: P,
        }),
        this.loadFrame(-this.maxFrames * this.frameInterval));
    }
    loadFrame(t) {
      this.isRecording &&
        this.dispatchEvent({
          type: n,
          delta: t,
        });
    }
    drawFrame() {
      if (!this.isRecording || !this.canvas) return;
      if (!navigator.onLine) return void this.stop();
      let t, s;
      try {
        t = this.wt ? xr() : new Image();
      } catch (t) {
        Qs.add("animator", t.message);
      }
      (!this.wt || (t && t.width) || ((this.wt = !1), (t = new Image())),
        (t.width = this.canvas.width),
        (t.height = this.canvas.height));
      try {
        ((s = Ir(this.wt ? Er(t) : this.context, "#000")),
          s.drawImage(
            this.mapCanvas,
            0,
            0,
            this.mapCanvas.width,
            this.mapCanvas.height,
            0,
            0,
            t.width,
            t.height
          ));
      } catch (t) {
        return (
          this.stop(),
          (this.wt = !1),
          void Qs.add("animator", t.message)
        );
      }
      (this.wt ||
        this.canvas.toBlob(
          (s) => {
            try {
              const i = URL.createObjectURL(s);
              ((t.onload = () => {
                URL.revokeObjectURL(i);
              }),
                (t.src = i));
            } catch (t) {}
          },
          "image/jpeg",
          1
        ),
        this.frames.push(t),
        this.frameTimes.push(Yn.layers.geocolor.date.getTime()));
      try {
        this.context.drawImage(t, 0, 0);
      } catch (t) {}
      if (
        (this.dispatchEvent({
          type: O,
          progress: (this.frame + 1) / (this.maxFrames + 1),
        }),
        this.frame < this.maxFrames)
      )
        return (this.frame++, void this.loadFrame(this.frameInterval));
      ((this.isRecording = !1), this.play());
    }
    play() {
      !this.isPlaying && this.canvas
        ? (clearTimeout(this.timeoutID),
          (this.isPlaying = !0),
          this.canvas.parentNode || Ji(this.mapCanvas, this.canvas, "afterend"),
          (this.frame = 0),
          (this.alpha = 0),
          (this.time = 0),
          this.dispatchEvent({
            type: N,
          }),
          this.animate())
        : this.stop();
    }
    animate(t) {
      if (!this.isPlaying || !this.canvas) return;
      const s = Yn.user.animationSpeed,
        i = t ? et(1000 / (t - this.time), 10, 120) : 60,
        h = ((60 * this.step) / i) * Ra[s];
      if (
        ((this.time = t || mh()),
        this.alpha < 99 - h
          ? (this.alpha = Math.min(100, this.alpha + h))
          : ((this.alpha = 0),
            this.frame++,
            (this.frame %= this.maxFrames + this.endFrames)),
        this.frame < this.maxFrames)
      ) {
        if (
          (this.dispatchEvent({
            type: n,
          }),
          (this.context.globalAlpha = 1),
          this.context.drawImage(this.frames[this.frame], 0, 0),
          this.alpha > 0)
        ) {
          this.context.globalAlpha = this.alpha / 100;
          const t =
            this.frames[(this.frame + 1) % (this.maxFrames + this.endFrames)];
          t && this.context.drawImage(t, 0, 0);
        }
      } else
        (0 === this.alpha &&
          this.frame === this.maxFrames &&
          (this.dispatchEvent({
            type: n,
          }),
          (this.context.globalAlpha = 1),
          this.context.drawImage(this.frames[this.maxFrames], 0, 0)),
          this.alpha > 0 &&
            this.frame === this.maxFrames + this.endFrames - 1 &&
            (this.dispatchEvent({
              type: n,
            }),
            (this.context.globalAlpha = 1),
            this.context.drawImage(this.frames[this.maxFrames], 0, 0),
            (this.context.globalAlpha = this.alpha / 100),
            this.context.drawImage(this.frames[0], 0, 0)));
      requestAnimationFrame((t) => {
        this.animate(t);
      });
    }
    stop() {
      if (this.isActive && (clearTimeout(this.timeoutID), this.canvas)) {
        (Vi(this.canvas),
          Tr(this.canvas, 0, 0),
          (this.canvas = null),
          (this.context = null),
          this.isRecording &&
            this.dispatchEvent({
              type: n,
              delta: (this.maxFrames - this.frame) * this.frameInterval,
            }));
        for (let t = frames.length; t--; )
          (this.wt && this.frames[t] && Tr(this.frames[t], 0, 0),
            (this.frames[t] = null));
        ((this.frames = []),
          (this.frameTimes = []),
          (this.frame = 0),
          (this.alpha = 0),
          (this.time = 0),
          (this.isRecording = !1),
          (this.isPlaying = !1),
          this.dispatchEvent({
            type: B,
          }));
      }
    }
  }
  class La extends ji {
    constructor() {
      (super(),
        (this.vt = []),
        (this.pingTime = 0),
        (this.geocolorTime = 0),
        (this.radarTime = 0),
        (this.modelTimes = {}),
        (this.modelTimes[ri.ICON] = 0),
        (this.modelTimes[ri.GFS] = 0),
        (this.geocolorLoader = null),
        (this.radarLoader = null),
        (this.gibsLoader = null));
    }
    yt(t) {
      if (!navigator.onLine) return;
      void 0 !== t &&
        (this.vt.unshift(mh() - t), this.vt.length > 4 && this.vt.pop());
      const s = ((t) => {
          if (0 === t.length) return;
          const s = [...t].sort(Ti),
            i = Math.floor(s.length / 2);
          return s.length % 2 == 0 ? (s[i - 1] + s[i]) / 2 : s[i];
        })(this.vt),
        i = navigator.connection;
      ((Yn.G =
        s > 4000 || (i && (i.downlink < 0.4 || /2g/.test(i.effectiveType)))),
        (Yn.j = !Yn.G && s < 200),
        this.dispatchEvent({
          type: "latency",
        }));
    }
    ping() {
      if (!navigator.onLine || document.hidden) return;
      if (mh() - this.pingTime < Ds) return;
      const t = (this.pingTime = mh());
      new Xs()
        .load({
          url: fs,
          method: "HEAD",
          responseType: "text",
        })
        .then((s) => {
          this.yt(t);
        })
        .catch((s) => {
          this.yt(t);
        });
    }
    Mt() {
      const t = mh(),
        s = Ts + "geocolor.json";
      let i;
      (this.geocolorLoader && (i = this.geocolorLoader.modifiedTime),
        (this.geocolorLoader = new Xs()),
        this.geocolorLoader
          .load({
            url: s,
          })
          .then((s) => {
            const h = this.geocolorLoader.modifiedTime;
            ((!i || (h && h > i)) &&
              ((Yn.layers.geocolor.times = s), this.bt()),
              this.yt(t));
          })
          .catch((s) => {
            Qs.add("geocolorLatest", s.message);
            const i = ph();
            i.setUTCHours(i.getUTCHours() - 1, 0, 0, 0);
            const h = i.getTime() / 1000;
            let e = !1;
            for (let t in Yn.layers.geocolor.times)
              0 === Yn.layers.geocolor.times[t].length &&
                ((e = !0), (Yn.layers.geocolor.times[t] = [h]));
            (e && this.bt(), this.yt(t));
          }));
    }
    bt() {
      let t = mh(),
        s = 0;
      for (let i in Yn.layers.geocolor.times) {
        if (i === (Yn.user.isMTGEnabled ? pt.MSG_ZERO : pt.MTG_ZERO)) continue;
        const h = Yn.layers.geocolor.times[i];
        if (Array.isArray(h) && h.length > 0) {
          t = Math.min(t, 1000 * h[0]);
          const i = 1000 * h.at(-1);
          s = Math.max(s, i);
        }
      }
      0 === s ||
        t > s ||
        (Yn.layers.geocolor.minDate.setTime(t),
        Yn.layers.geocolor.maxDate.setTime(s),
        (Yn.layers.geocolor.hasRange = !0),
        this.dispatchEvent({
          type: "geocolor",
        }));
    }
    At(t) {
      const s = mh(),
        i = Ts + "radar.json";
      let h;
      (this.radarLoader && (h = this.radarLoader.modifiedTime),
        (this.radarLoader = new Xs()),
        this.radarLoader
          .load({
            url: i,
            params: {},
            validate: ["reflectivity", "coverage"],
          })
          .then((i) => {
            const e = this.radarLoader.modifiedTime;
            if (t || !h || (e && e > h)) {
              const t = 300,
                h = i.reflectivity || {},
                e = i.coverage || {};
              ((Yn.layers.radar.times = Object.keys(h)
                .filter((s) => bn(s) % t == 0)
                .sort()),
                (Yn.layers.radar.reflectivity = h),
                (Yn.layers.radar.coverage =
                  e[
                    Object.keys(e)
                      .sort((t, s) => bn(t) - bn(s))
                      .at(-1)
                  ] || ""),
                (Yn.layers.radar.areas = i.areas || []),
                (Yn.layers.radar.attributions = i.attributions || []),
                this.Tt(),
                this.yt(s));
            }
          })
          .catch((t) => {
            (Qs.add("radarLatest", t.message), this.Tt(), this.yt(s));
          }));
    }
    Tt() {
      let t = mh(),
        s = 0;
      const i = Yn.layers.radar.times;
      (Array.isArray(i) &&
        i.length > 0 &&
        ((t = Math.min(t, 1000 * bn(i[0]))),
        (s = Math.max(s, 1000 * bn(i.at(-1))))),
        0 === s ||
          t > s ||
          (Yn.layers.radar.minDate.setTime(t),
          Yn.layers.radar.maxDate.setTime(s),
          (Yn.layers.radar.hasRange = !0),
          this.dispatchEvent({
            type: "radar",
          })));
    }
    xt(t, s) {
      s = s || Yn.model;
      const i = mh(),
        h = Ts + (s + ".json"),
        e = this.modelTimes[s],
        n = new Xs();
      n.load({
        url: h,
        params: {},
      })
        .then((h) => {
          const r = n.modifiedTime;
          ((t || !e || (r && r > e)) &&
            ((this.modelTimes[s] = r),
            (Yn.layers.forecast[s].times = h),
            this.Et(s)),
            this.yt(i));
        })
        .catch((t) => {
          (Qs.add(s + "Latest", t.message), this.yt(i));
        });
    }
    Dt(t) {
      [...oi]
        .sort((t) => (t === Yn.model ? -1 : 1))
        .forEach((s) => this.xt(t, s));
    }
    Et(t) {
      const s = Yn.layers.forecast[t];
      if (!s) return;
      const i = 1000 * Math.round((mh() + 432000000) / 3600000) * 60 * 60;
      for (let t in s.times) {
        const h = s.times[t];
        if (Le(t) && h)
          for (let e in h) {
            const n = h[e];
            let r = 1 / 0,
              o = 0;
            for (let t in n) {
              const s = n[t];
              if (Array.isArray(s) && s.length > 0) {
                const i = 1000 * bn(t);
                ((r = Math.min(r, i + 3600000 * s[0])),
                  (o = Math.max(o, i + 3600000 * s.at(-1))));
              }
            }
            ((o = Math.min(o, i)), o < r && (o = r));
            const a = s.ranges;
            (a[t] || (a[t] = {}),
              (a[t][e] = {
                minDate: new Date(r),
                maxDate: new Date(o),
              }));
          }
      }
      t === Yn.model &&
        this.dispatchEvent({
          type: "model",
        });
    }
    It() {
      const t = mh(),
        s = Ts + "gibs.json";
      let i;
      (this.gibsLoader && (i = this.gibsLoader.modifiedTime),
        (this.gibsLoader = new Xs()),
        this.gibsLoader
          .load({
            url: s,
          })
          .then((s) => {
            const h = this.gibsLoader.modifiedTime;
            if (!i || (h && h > i)) {
              let i = s.hd ? new Date(1000 * s.hd) : null;
              (null !== i && isNaN(i.getTime()) && (i = null),
                (Yn.layers.hd.maxDate = i),
                this.dispatchEvent({
                  type: "gibs",
                }),
                this.yt(t));
            }
          })
          .catch((s) => {
            (Qs.add("gibsLatest", s.message), this.yt(t));
          }));
    }
  }
  const Na = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA",
    Oa = new Image();
  Oa.src =
    Na + "AEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII=";
  const Ca = 512,
    Fa = Na + "gAAAAABCAIAAAAn2YEhAAAB",
    Pa = {};
  ((Pa[Re.RADAR] = Pa[Re.PRECIPITATION] =
    Na +
    "gAAAAACCAIAAAChTfOPAAACoklEQVR4AWLc8+T3l5//PwGoFAOcCGIohPLbjmbvf1ndLSC/E1UT8gJ5PP2xkXwS3NjCpskQTDK3JSRuRtmG/rMt44z0LRCWM71lJgjx8m+XQC3qwddjP9/NN3Qun5QWuMrhhdOb6V7F1YcoXcVwmBMe0PzOOOfhM8v34Uf1LE9HKa6G/xJdVAOYxj1LNdF9GuWafUAO4byna6V/FVcFKm5DMUza/3/gfqW0sfaMniMIl1sGg8s6I8my7TqUs6eaujaxBntQm9vTYtOrP1VoQA8aP1cTdCRAYeJWVgpiD+gV0YlfjTu2wu5Ox7YNHX8PIJdOU/ZUY+5yA1qxf+OxOfrjpzEJKQqatyo1g2yhBtgnewBOQ2PraCADJNvA1FMyFNOKY5DBVghIU+W2njS1W/cO1whksdkf8cy3jg5SkoFLXH5OmT5RDPxfobaNGEoZOOjMZormLfgsBq7Iea/74Iv7x2/8wG/95/wGT/wQ8NSv4DHcUT//wX9vuAP8/Xq9gZe04lv6CMf6AAafQgENpEM8qo7S56j1abCp43HiZQsorcR7EcF/DqpUwoqmW69GrUumxhKcWk7YAalBARui5YJ0UktQ6VRUcKZTpjop4JTN2AAYfFJzx+pYIiD77QGyHuKfKdYxBqebus/8s66ZmMJNJLp/QiuyPkOJIWNinFM5C9lOl8rWGIxHmUHMiXhxzmBiDIZTMJtYiOKu2d/YjWa4Dc7ZjpmUbkOyVfQAs5kOxmnly3vOF0vVNmSNMpiUhDy6u2ccKoLjtPZgf7nGeEe4UW2A7DP9jf7p/fLJPRnxu3sq93S4vt8MDR49KeHmntkzfuvKPheDJJB5vy255DxXgeR2p+dffi/IgO/ebwy5D5kmuL7f3DP757Ez++f3TvwBpdbVL1j6EogAAAAASUVORK5CYII="),
    (Pa[Re.WIND_SPEED] =
      Fa +
      "m0lEQVR4AWKMdlsBqJwMVOQGYhgqydf+/wdf7GJFySwcLTQsQtY8ezzAQhwRJUjW9fMoqw4Qhv1V3FNZqQIEFsFhkQUQLKi4uXLKVayKTpzfjR5mZsgBWxqoxaFGdZG9R9EYPQnQqnNqDV+Y4ghdXLMlUorzhRHtnRf6t/oFvD78mvm6fRIu/5G4ncUl/Wu5Sxz0YBC9hjNoTA8b678NXGHYnyTmam6OBdzo3vAesuo8Y2MM8EkO87062xvFPfgxcLglML2JuQD9D95lZmKBuYzBvNeZ6J1zxTpmPrCU8TvtZhgSfJK3nAZhoGd5AO/8+LHCjT0D4tw7eO6awyf/yV995+OVDrmatWcG6c17M9zOZG5J7iC9J4+GXA38P/v/jXdofgGWKKhYvwSb5y9J5/EqhHTOoormpRsukJC08EKUCNHWKr1AVVF8S1qoCJwfgKTFxlSMliTxMd+j0rv5TVYmOznzAdyNd5iLTMbnwzLmbd4UH2T2yTB/5g/sjc7OCc1R4TMtBczQfDoSGQMm2xjwc5RLYcD4z33+AMFotg7Iv5ZiAAAAAElFTkSuQmCC"),
    (Pa[Re.WIND_GUSTS] =
      Fa +
      "p0lEQVR4AWKMdl0BqHtMsCOLQRgo4eT+F86HgXqf554tCymJstNWuCxHVLhZtk7IUjdMSlbw+C1ck2bm/uxBv7FZwfSxQ/T1ThqZ1VHzjeNz9suiHx4o6fFw2UnMZrluY5qeliOJsqvZfrcT17fyuEL1baB6iqZOy1XDriMmAluYCPhIlrrfd/NjTyNW1jrDvEyu8Y0jzqqSWa5SSpkquRo6Vj3lLpkdfZtsuaF+cuXRCpj4o+YR9h6NpnoSH6bHYYtTzJzGVTil4VRTZrNgfuB8GtDSHLyrOS4XpziLiSapeBBkHsH9A7/NKnh8HD5YbazyKFt2o722AGGWjAzTrM9nuyVXrfDM2pwzjbjQybtERDZT+y4R6RF4lwBhwD25Z32a+188gKC7xa/7XnifCYAu5PuuC4pjRc843zbg4wj7yJZPRMOxwzETvxlHRHqP00W3MStm2CK8zQDC+WpbG3eL/3nqjSCTaBhd3mmvdlnrx2Fieq9dgQXl/27WXz4lxfr8oTghvX1D0MsEy/eLzqvhDNy1tr8+N4M0+8E+/bhO4LNCIkK/AOcouA5l24GrAAAAAElFTkSuQmCC"),
    (Pa[Re.TEMPERATURE] = Pa[Re.TEMPERATURE_FEEL] =
      Fa +
      "qklEQVR4Xp2N0a7kMAxCIZ35/w9uAms7bqPRfVvJPQKMU9qGIYkoDezkEHjtq3+3BfnQPiv/tW6iCdA2S1VYH6t/QhfBY/m7BHZWq6dvkjB8Ls9Bj1/U7d/365x8l91onH4fuCzBJvzzXwKu1dP+eWhLW8pF0Q4sZUPlDC3BsGpVkWUI2l59iA1ZEroJ98utk68FrGPP6hDwn4Jd1utpZtKUMmnhTLCkGDuEpW6uaqyYVTYb78pTEmq7m0awNexBEUEMekCky3oU2WRzkG1J4iKCiTzf7CQFwNGHJEdMF9jcM7KZLyP1IEr89vt3HOhCCjzWI1cdjg+uL2PGhRjGDI+RrKRFJklj+BprcI7kKs5r3AyWJcJGR4Mx2bnomA9xgcEPcBU/ZHAAX7K2RSM7naT4en3pJjS06Jua9IRyCNGLiFxBeGHZa0GG5CVKkENg6clTF+25uPvLXPJsEcz+PbfImaLkGRqeEbIEtkj92qBa72Zqlb0NPf15ziXIWDl5cQsTLBE2RFnhLlHJCYsWmOfyMp+nkHmJzTOZc1bBgNAU9FiXPdpt9X/9fxEIzV/p6TJtAAAAAElFTkSuQmCC"),
    (Pa[Re.TEMPERATURE_WET_BULB] =
      Fa +
      "sElEQVR4XnWNi67jIBBDbdL+//feBMY7YyioqlZC1vFjEkqCEBGEGZjJUWDbzd+tJXRUOpV+7LldagCBzZLoeema+OpsxBP/7m2cAxvIE4ugQ2fnyv2qsN+y+m/ytZctT/vzfShMUcvkCEHm1DDFYukAFiBGbHa+vmBNc/Y1nrnBag5Xe5MkfO1hFUPyYF/Jg/BSU8e09haMyTGtei4C4SRxpBWsaVdoVQ85dAVXy2KotHpShBoFoOFjAXIxhbaZ3lSLEiK5Dmle1uB2Lxv1u3dj6/3XEjLvH+0Tbxq4lQBRCnojf6pyX2jvV8LiNWtsAIFWyGuylxfaBc7XcL2Z2l6skEptznms0hbUuXylxmgtiJ7aONKSg+wTKkTqALIVoFQuMKOsWxDBVFcX8CYvKPWV7wBehJVvwMlankc16WWYCaMTggYVW/FhIlQqonTmBRH5NAJDGGNxlJUtQqg21AcrtPbgM5LRfTXEngPDGgfSduoBnqnQDWVyF2cVt7LyQw4i824WYr1EjEAH/oJ3qIuP8CiZf8JtuMFsn7QDT+ST9WNlTVYMaOBoXzpSJ4ThH0e6oXEUKmIeAAAAAElFTkSuQmCC"),
    (Pa[Re.HUMIDITY] =
      Fa +
      "ZElEQVR4AWJs99YE1EUGKpDEMAg1+f8/vtt6yKMyUG7oZoxRN0NnJGl37qNACXw5z+7OJaXZvDcVXH26Bi4DKd30X169OyJ/43zzhYr80EmQpQG3xkWVaBuRzmw2K6yuC/3VCj38R68c9GkN4N9F2rPPwNNJO8Xldaso3ZmFSc+vmuLyeWzPLOJU9/thpnIMRjfNdzD9PPkay1xeU7oPSc8++LBAt2WBfsveC128Ei3JU1LUNNg7aotmqj/K+Wn+Crx/tD/pB5+zYARXNrY1Y+WxZQXSfkj4kXTsbug8oaMZRNdFLEBNwz5NDsZlNOMKgvXqj8khdRBcr2rnM9z86ht49cb+/3385BN+qCFV1wkLjvccsKiQkZF/7f1Y7JmyqlM/+ZBdRkzvtQXyQ69oDuGMfUBUDpg3gnpdJa/qKwMQFAzA8CXBac8wsjI7adRLFXrDy8mPnnPgpdMLm9RJmyqlC9A/AEGBS8orS8IAAAAASUVORK5CYII="),
    (Pa[Re.DEW_POINT] =
      Fa +
      "hklEQVR4AWI0kOIH0EUGKBKEQAys6vn/mz1oSaN4uwBorGQSFtYCAVDp8yiITSi6tdxBufiErLUUEW8+QJQ1xJHOkAezaJeawLcOJ3nyqw+zbdF6XFlw9z8Kr+n53958aHB4+dcFz4DlY1DIbQbM3oe/9kLs91LvD3jwP/q7WM/ei281rXTyDWcezp46yngxJTOPyRwcwuMEOo6TDDF/69idt/QUJ5lgY5+naXuKiXUHijoDKVW/Mj9KgdoKq6oMtvW5lrLPYDnGfsXoJm0DX8XlFaVwX8shMbz7Ax2yr0iVtOjMC1NfJQ7BT91P4evgoQ6Azu9J1cyH7vPWocUAfWjmK6vG293m8P01KR4mEERBCHVD/91umuCcP8GByDNoVW84Hhzvdj44Xww/vHavzbkHGhi3qMO5ecAd5ojYLJq/jvvD50Mlj6BbZjAklzI9kVmxJPYYDC9ElbHkSTZlaurAVM/mjGLKUZqCAqZ4lBLYP73R9PfnBHnNieuP9VczpipiHbT+AB92TBc2ugyLAAAAAElFTkSuQmCC"),
    (Pa[Re.PRESSURE] =
      Fa +
      "oUlEQVR4AWK0ZvAAVEaGu3HEIBAGYzVpfvb9X/Ru10zNYIS6uj91LDQD346JTkQgovuvjqgK2oTDEUIMKL46wZMjpSjBhGr3KY1MbaDztckITM0PaMFwlm2SS8soPPfnrPcHuwzr/POtcP8P+1A3n7qB5mu9tL1P8/LY57l/vsj6Kb/Xq/2p/pt/7NM/PeS5f/IEAgGFQiVtaaYNYdXCxDMkYe0c2tBJsl928CEGukAjrfnSzWNo7Sbn8316w9S9z65KnVOtqFNPAgJKYNtRwBbUGrWa1Nl88vnuyBc5YtWsbI4teOlAi8E0s+gP/oNjHxvkQ5hFHXtKYbxz7qrTsqoFILtu/Wval9nXtO85v2cK+z3nzxg/Znn/TLP1mnhPf9t6+/Va7xeu97p2Deu73pff967Ydd1+XVhL7oW6slhvp+6K5RS3LATzupNnk6P1L+9wEXdABFtAACzQAh41mh4duJMRNM8RpynkaMZSalrhwQlEaiGTTSSfOpQWj7RnWkC+nnyP2lLUK04DoC0XQ7e1X+l9ms9OjryYB3lyMp/nL1JSso42d5kWAAAAAElFTkSuQmCC"));
  const za = {};
  Object.keys(Pa).forEach((t) => {
    const s = new Image();
    ((s.onload = () => {
      za[t] = s;
    }),
      (s.src = Pa[t]));
  });
  const Ua = (t, s) => {
    const i = Pe[t],
      h = za[t];
    let e = s,
      n = 1,
      r = 30,
      o = 40;
    switch (t) {
      case Re.WIND_SPEED:
      case Re.WIND_GUSTS:
        ((n = 1.15), (r = 40), (o = 105), e > 35 && (r += 2 * (e - 35)));
        break;
      case Re.TEMPERATURE:
      case Re.TEMPERATURE_FEEL:
        ((r = 35),
          s > 32.5 ? (r += 5 * (s - 32.5)) : s < -2.5 && (r += 3 * (-2.5 - s)));
        break;
      case Re.TEMPERATURE_WET_BULB:
        ((r = 35),
          s > 25.5 ? (r += 6 * (s - 25.5)) : s < -2.5 && (r += 3 * (-2.5 - s)));
        break;
      case Re.HUMIDITY:
        s > 85 && (r += 2 * (s - 85));
        break;
      case Re.DEW_POINT:
        ((r = 40),
          s > 20 ? (r += 8 * (s - 20)) : s < -10 && (r += 2 * (-10 - s)),
          (o = 100));
        break;
      case Re.PRESSURE:
        ((e = et(s, 980, 1040)),
          e > 1013 ? (r = 30) : ((n = 1.3), (r = 50)),
          (o = 120));
    }
    const a =
      h && Rr(h, et(((e - i.min) / i.span) * h.width, 0, h.width - 1), 0);
    if (a) {
      for (let t = a.length - 1; t--; ) a[t] = et(a[t] * n + r, o, 255);
      return "#" + Li(ki(((c = a)[0] << 16) | (c[1] << 8) | c[2]), 6);
    }
    var c;
    return "#fff";
  };
  let Wa;
  const Ga = (t) => et(Math.floor(511 * Math.pow(t * fi, 5.5)), 0, 511),
    ja = (t, s) => 4 * (t * Ca + s),
    _a = () => {
      if (!Wa)
        try {
          const t = Er(xr(Ca, 2), !0, !1);
          (t.drawImage(za[Re.RADAR], 0, 0, Ca, 2),
            (Wa = t.getImageData(0, 0, Ca, 2).data));
        } catch (t) {}
      return Wa;
    },
    Ba = (t, s, i, h) => {
      for (let e = 0, n = i.length; e < n; e++) {
        const n = i[e];
        for (let i = 0; i < h; i++) t[s++] = n[i];
      }
      return s;
    },
    Za = (t, s, i, h, e) => {
      const n = e || [];
      let r = 0;
      for (let e = 0, o = i.length; e < o; e++) {
        const o = Ba(t, s, i[e], h);
        ((n[r++] = o), (s = o));
      }
      return ((n.length = r), n);
    },
    Ha = (t, s, i, h, e) => {
      const n = Bs(e, []);
      let r = 0;
      for (let e = s; e < i; e += h) n[r++] = t.slice(e, e + h);
      return ((n.length = r), n);
    },
    Ya = (t, s, i, h, e) => {
      const n = Bs(e, []);
      let r = 0;
      for (let e = 0, o = i.length; e < o; e++) {
        const o = i[e];
        ((n[r++] = Ha(t, s, o, h, n[r])), (s = o));
      }
      return ((n.length = r), n);
    },
    qa = (t, s, i, h, e, n) => {
      let r = NaN,
        o = NaN;
      const a = (i - s) / h;
      if (1 === a) ((r = t[s]), (o = t[s + 1]));
      else if (2 === a)
        ((r = (1 - e) * t[s] + e * t[s + h]),
          (o = (1 - e) * t[s + 1] + e * t[s + h + 1]));
      else if (0 !== a) {
        let n = t[s],
          a = t[s + 1],
          c = 0;
        const l = [0];
        for (let e = s + h; e < i; e += h) {
          const s = t[e],
            i = t[e + 1];
          ((c += Math.sqrt((s - n) * (s - n) + (i - a) * (i - a))),
            l.push(c),
            (n = s),
            (a = i));
        }
        const u = e * c,
          d = ((t, s) => {
            let i,
              h,
              e = 0,
              n = t.length,
              r = !1;
            for (; e < n; )
              ((i = e + ((n - e) >> 1)),
                (h = +Ti(t[i], s)),
                h < 0 ? (e = i + 1) : ((n = i), (r = !h)));
            return r ? e : ~e;
          })(l, u);
        if (d < 0) {
          const i = (u - l[-d - 2]) / (l[-d - 1] - l[-d - 2]),
            e = s + (-d - 2) * h;
          ((r = ut(t[e], t[e + h], i)), (o = ut(t[e + 1], t[e + h + 1], i)));
        } else ((r = t[s + d * h]), (o = t[s + d * h + 1]));
      }
      return n ? ((n[0] = r), (n[1] = o), n) : [r, o];
    },
    $a = (t, s, i, h, e, n) => {
      let r = 0,
        o = t[i - h],
        a = t[i - h + 1];
      for (; s < i; s += h) {
        const i = t[s],
          h = t[s + 1];
        (a <= n
          ? h > n && (i - o) * (n - a) - (e - o) * (h - a) > 0 && r++
          : h <= n && (i - o) * (n - a) - (e - o) * (h - a) < 0 && r--,
          (o = i),
          (a = h));
      }
      return 0 !== r;
    },
    Va = (t, s, i, h, e, n) => {
      if (0 === i.length) return !1;
      if (!$a(t, s, i[0], h, e, n)) return !1;
      for (let s = 1, r = i.length; s < r; s++)
        if ($a(t, i[s - 1], i[s], h, e, n)) return !1;
      return !0;
    },
    Ka = (t, s, i, h, e, n) => {
      const r = e - i,
        o = n - h;
      if (0 !== r || 0 !== o) {
        const a = ((t - i) * r + (s - h) * o) / (r * r + o * o);
        a > 1 ? ((i = e), (h = n)) : a > 0 && ((i += r * a), (h += o * a));
      }
      return mt(t, s, i, h);
    },
    Ja = (t, s, i, h, e, n, r) => {
      const o = (i - s) / h;
      if (o < 3) {
        for (; s < i; s += h) ((n[r++] = t[s]), (n[r++] = t[s + 1]));
        return r;
      }
      const a = new Array(o);
      ((a[0] = 1), (a[o - 1] = 1));
      const c = [s, i - h];
      let l = 0;
      for (; c.length > 0; ) {
        const i = c.pop(),
          n = c.pop();
        let r = 0;
        const o = t[n],
          u = t[n + 1],
          d = t[i],
          f = t[i + 1];
        for (let s = n + h; s < i; s += h) {
          const i = t[s],
            h = t[s + 1],
            e = Ka(i, h, o, u, d, f);
          e > r && ((l = s), (r = e));
        }
        r > e &&
          ((a[(l - s) / h] = 1),
          n + h < l && c.push(n, l),
          l + h < i && c.push(l, i));
      }
      for (let i = 0; i < o; i++)
        a[i] && ((n[r++] = t[s + i * h]), (n[r++] = t[s + i * h + 1]));
      return r;
    },
    Xa = (t, s) => Math.round(t / s) * s,
    Qa = (t, s, i, h, e, n, r) => {
      if (s === i) return r;
      let o,
        a,
        c = Xa(t[s], e),
        l = Xa(t[s + 1], e);
      ((s += h), (n[r++] = c), (n[r++] = l));
      do {
        if (((o = Xa(t[s], e)), (a = Xa(t[s + 1], e)), (s += h) === i))
          return ((n[r++] = o), (n[r++] = a), r);
      } while (o == c && a == l);
      for (; s < i; ) {
        const i = Xa(t[s], e),
          u = Xa(t[s + 1], e);
        if (((s += h), i == o && u == a)) continue;
        const d = o - c,
          f = a - l,
          m = i - c,
          p = u - l;
        d * p == f * m &&
        ((d < 0 && m < d) || d == m || (d > 0 && m > d)) &&
        ((f < 0 && p < f) || f == p || (f > 0 && p > f))
          ? ((o = i), (a = u))
          : ((n[r++] = o), (n[r++] = a), (c = o), (l = a), (o = i), (a = u));
      }
      return ((n[r++] = o), (n[r++] = a), r);
    },
    tc = "XY",
    sc = "XYM",
    ic = "XYZM",
    hc = "LineString",
    ec = "Polygon",
    nc = "MultiLineString",
    rc = (t, s, i, h, e, n) => {
      const r = n || [];
      let o = 0;
      for (let n = s; n < i; n += h) {
        const s = t[n],
          i = t[n + 1];
        ((r[o++] = e[0] * s + e[2] * i + e[4]),
          (r[o++] = e[1] * s + e[3] * i + e[5]));
      }
      return (n && r.length !== o && (r.length = o), r);
    };
  class oc extends eo {
    constructor() {
      (super(),
        (this.extent = [1 / 0, 1 / 0, -1 / 0, -1 / 0]),
        (this.extentRevision = -1),
        (this.simplifiedGeometryCache = {}),
        (this.simplifiedGeometryMaxMinSquaredTolerance = 0),
        (this.simplifiedGeometryRevision = 0));
    }
    clone() {}
    containsXY(t, s) {
      return !1;
    }
    computeExtent(t) {}
    getExtent(t) {
      return (
        this.extentRevision !== this.revision &&
          ((this.extent = this.computeExtent(this.extent)),
          (this.extentRevision = this.revision)),
        ((t, s) =>
          s
            ? ((s[0] = t[0]), (s[1] = t[1]), (s[2] = t[2]), (s[3] = t[3]), s)
            : t)(this.extent, t)
      );
    }
    scale(t, s, i) {}
    getSimplifiedGeometry(t) {}
    getType() {}
    applyTransform(t) {}
    translate(t, s) {}
    toGeodeticArray() {
      return (this.applyTransform(ts), this);
    }
    toWebMercator() {
      return (this.applyTransform(Qt), this);
    }
  }
  const ac = (t) => {
    let s;
    return (
      t === tc
        ? (s = 2)
        : "XYZ" === t || t === sc
          ? (s = 3)
          : t === ic && (s = 4),
      s
    );
  };
  class cc extends oc {
    constructor() {
      (super(),
        (this.layout = tc),
        (this.stride = 2),
        (this.flatCoordinates = null));
    }
    computeExtent(t) {
      return (
        (s = this.flatCoordinates),
        (i = this.flatCoordinates.length),
        (h = this.stride),
        ((t, s, i, h, e) => {
          for (; i < h; i += e) Dt(t, s[i], s[i + 1]);
          return t;
        })(xt(t), s, 0, i, h)
      );
      var s, i, h;
    }
    getCoordinates() {}
    getFirstCoordinate() {
      return this.flatCoordinates.slice(0, this.stride);
    }
    getFlatCoordinates() {
      return this.flatCoordinates;
    }
    getLastCoordinate() {
      return this.flatCoordinates.slice(
        this.flatCoordinates.length - this.stride
      );
    }
    getLayout() {
      return this.layout;
    }
    getSimplifiedGeometry(t) {
      if (
        (this.simplifiedGeometryRevision !== this.revision &&
          (Zs(this.simplifiedGeometryCache),
          (this.simplifiedGeometryMaxMinSquaredTolerance = 0),
          (this.simplifiedGeometryRevision = this.revision)),
        t < 0 ||
          (0 !== this.simplifiedGeometryMaxMinSquaredTolerance &&
            t <= this.simplifiedGeometryMaxMinSquaredTolerance))
      )
        return this;
      const s = t.toString();
      if (this.simplifiedGeometryCache.hasOwnProperty(s))
        return this.simplifiedGeometryCache[s];
      const i = this.getSimplifiedGeometryInternal(t);
      return i.getFlatCoordinates().length < this.flatCoordinates.length
        ? ((this.simplifiedGeometryCache[s] = i), i)
        : ((this.simplifiedGeometryMaxMinSquaredTolerance = t), this);
    }
    getSimplifiedGeometryInternal(t) {
      return this;
    }
    getStride() {
      return this.stride;
    }
    setFlatCoordinates(t, s) {
      ((this.stride = ac(t)), (this.layout = t), (this.flatCoordinates = s));
    }
    setCoordinates(t, s) {}
    setLayout(t, s, i) {
      let h;
      if (t) h = ac(t);
      else {
        for (let t = 0; t < i; t++) {
          if (0 === s.length)
            return ((this.layout = tc), void (this.stride = 2));
          s = s[0];
        }
        ((h = s.length),
          (t = ((t) => {
            let s;
            return (
              2 === t ? (s = tc) : 3 === t ? (s = "XYZ") : 4 === t && (s = ic),
              s
            );
          })(h)));
      }
      ((this.layout = t), (this.stride = h));
    }
    applyTransform(t) {
      this.flatCoordinates &&
        (t(this.flatCoordinates, this.flatCoordinates, this.stride),
        this.changed());
    }
    scale(t, s, i) {
      let h = s;
      void 0 === h && (h = t);
      let e = i;
      e || (e = It(this.getExtent()));
      const n = this.getFlatCoordinates();
      if (n) {
        const s = this.getStride();
        (((t, s, i, h, e, n, r, o) => {
          const a = o || [],
            c = r[0],
            l = r[1];
          let u = 0;
          for (let s = 0; s < i; s += h) {
            const i = t[s] - c,
              r = t[s + 1] - l;
            ((a[u++] = c + e * i), (a[u++] = l + n * r));
            for (let i = s + 2; i < s + h; i++) a[u++] = t[i];
          }
          o && a.length !== u && (a.length = u);
        })(n, 0, n.length, s, t, h, e, n),
          this.changed());
      }
    }
    translate(t, s) {
      const i = this.getFlatCoordinates();
      if (i) {
        const h = this.getStride();
        (((t, s, i, h, e, n, r) => {
          const o = r || [];
          let a = 0;
          for (let s = 0; s < i; s += h) {
            ((o[a++] = t[s] + e), (o[a++] = t[s + 1] + n));
            for (let i = s + 2; i < s + h; i++) o[a++] = t[i];
          }
          r && o.length !== a && (o.length = a);
        })(i, 0, i.length, h, t, s, i),
          this.changed());
      }
    }
  }
  class lc extends cc {
    constructor(t, s) {
      (super(),
        (this.flatMidpoint = null),
        (this.flatMidpointRevision = -1),
        (this.maxDelta = -1),
        (this.maxDeltaRevision = -1),
        void 0 === s || Array.isArray(t[0])
          ? this.setCoordinates(t, s)
          : this.setFlatCoordinates(s, t));
    }
    appendCoordinate(t) {
      (this.flatCoordinates
        ? Di(this.flatCoordinates, t)
        : (this.flatCoordinates = t.slice()),
        this.changed());
    }
    clone() {
      return new lc(this.flatCoordinates.slice(), this.layout);
    }
    forEachSegment(t) {
      return ((t, s, i, h, e) => {
        const n = [t[s], t[s + 1]],
          r = [];
        let o;
        for (; s + h < i; s += h) {
          if (
            ((r[0] = t[s + h]),
            (r[1] = t[s + h + 1]),
            (o = e.call(void 0, n, r)),
            o)
          )
            return o;
          ((n[0] = r[0]), (n[1] = r[1]));
        }
        return !1;
      })(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t);
    }
    getCoordinateAtM(t, s) {
      return this.layout !== sc && this.layout !== ic
        ? null
        : ((t, s, i, h, e, n) => {
            if (0 === i) return null;
            let r;
            if (e < t[0 + h - 1])
              return n ? ((r = t.slice(0, 0 + h)), (r[h - 1] = e), r) : null;
            if (t[i - 1] < e)
              return n ? ((r = t.slice(i - h, i)), (r[h - 1] = e), r) : null;
            if (e === t[0 + h - 1]) return t.slice(0, 0 + h);
            let o = 0 / h,
              a = i / h;
            for (; o < a; ) {
              const s = (o + a) >> 1;
              e < t[(s + 1) * h - 1] ? (a = s) : (o = s + 1);
            }
            const c = t[o * h - 1];
            if (e === c) return t.slice((o - 1) * h, (o - 1) * h + h);
            const l = (e - c) / (t[(o + 1) * h - 1] - c);
            r = [];
            for (let s = 0; s < h - 1; s++)
              r.push(ut(t[(o - 1) * h + s], t[o * h + s], l));
            return (r.push(e), r);
          })(
            this.flatCoordinates,
            0,
            this.flatCoordinates.length,
            this.stride,
            t,
            Bs(s, !1)
          );
    }
    getCoordinates() {
      return Ha(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride
      );
    }
    getCoordinateAt(t, s) {
      return qa(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        t,
        s
      );
    }
    getLength() {
      return ((t, s, i, h) => {
        let e = t[0],
          n = t[1],
          r = 0;
        for (let s = 0 + h; s < i; s += h) {
          const i = t[s],
            h = t[s + 1];
          ((r += Math.sqrt((i - e) * (i - e) + (h - n) * (h - n))),
            (e = i),
            (n = h));
        }
        return r;
      })(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
    }
    getFlatMidpoint() {
      return (
        this.flatMidpointRevision !== this.revision &&
          ((this.flatMidpoint = this.getCoordinateAt(0.5, this.flatMidpoint)),
          (this.flatMidpointRevision = this.revision)),
        this.flatMidpoint
      );
    }
    getSimplifiedGeometryInternal(t) {
      const s = [];
      return (
        (s.length = Ja(
          this.flatCoordinates,
          0,
          this.flatCoordinates.length,
          this.stride,
          t,
          s,
          0
        )),
        new lc(s, tc)
      );
    }
    getType() {
      return hc;
    }
    setCoordinates(t, s) {
      (this.setLayout(s, t, 1),
        this.flatCoordinates || (this.flatCoordinates = []),
        (this.flatCoordinates.length = Ba(
          this.flatCoordinates,
          0,
          t,
          this.stride
        )),
        this.changed());
    }
  }
  class uc extends cc {
    constructor(t, s, i) {
      if (
        (super(),
        (this.ends = []),
        (this.maxDelta = -1),
        (this.maxDeltaRevision = -1),
        Array.isArray(t[0]))
      )
        this.setCoordinates(t, s);
      else if (void 0 !== s && i)
        (this.setFlatCoordinates(s, t), (this.ends = i));
      else {
        let s = this.getLayout();
        const i = [],
          h = [];
        for (let e = 0, n = t.length; e < n; e++) {
          const n = t[e];
          (0 === e && (s = n.getLayout()),
            Di(i, n.getFlatCoordinates()),
            h.push(i.length));
        }
        (this.setFlatCoordinates(s, i), (this.ends = h));
      }
    }
    appendLineString(t) {
      (this.flatCoordinates
        ? Di(this.flatCoordinates, t.getFlatCoordinates().slice())
        : (this.flatCoordinates = t.getFlatCoordinates().slice()),
        this.ends.push(this.flatCoordinates.length),
        this.changed());
    }
    clone() {
      return new uc(
        this.flatCoordinates.slice(),
        this.layout,
        this.ends.slice()
      );
    }
    getCoordinates() {
      return Ya(this.flatCoordinates, 0, this.ends, this.stride);
    }
    getEnds() {
      return this.ends;
    }
    getLineString(t) {
      return t < 0 || this.ends.length <= t
        ? null
        : new lc(
            this.flatCoordinates.slice(
              0 === t ? 0 : this.ends[t - 1],
              this.ends[t]
            ),
            this.layout
          );
    }
    getLineStrings() {
      const t = this.flatCoordinates,
        s = this.ends,
        i = this.layout,
        h = [];
      let e = 0;
      for (let n = 0, r = s.length; n < r; n++) {
        const r = s[n],
          o = new lc(t.slice(e, r), i);
        (h.push(o), (e = r));
      }
      return h;
    }
    getFlatMidpoints() {
      const t = [],
        s = this.flatCoordinates;
      let i = 0;
      const h = this.ends,
        e = this.stride;
      for (let n = 0, r = h.length; n < r; n++) {
        const r = h[n],
          o = qa(s, i, r, e, 0.5);
        (Di(t, o), (i = r));
      }
      return t;
    }
    getSimplifiedGeometryInternal(t) {
      const s = [],
        i = [];
      return (
        (s.length = ((t, s, i, h, e, n, r, o) => {
          for (let a = 0, c = i.length; a < c; a++) {
            const c = i[a];
            ((r = Ja(t, s, c, h, e, n, r)), o.push(r), (s = c));
          }
          return r;
        })(this.flatCoordinates, 0, this.ends, this.stride, t, s, 0, i)),
        new uc(s, tc, i)
      );
    }
    getType() {
      return nc;
    }
    setCoordinates(t, s) {
      (this.setLayout(s, t, 2),
        this.flatCoordinates || (this.flatCoordinates = []));
      const i = Za(this.flatCoordinates, 0, t, this.stride, this.ends);
      ((this.flatCoordinates.length = 0 === i.length ? 0 : i.at(-1)),
        this.changed());
    }
  }
  const dc = (t, s, i, h) => {
      let e = 0,
        n = t[i - h],
        r = t[i - h + 1];
      for (; s < i; s += h) {
        const i = t[s],
          h = t[s + 1];
        ((e += r * i - n * h), (n = i), (r = h));
      }
      return e / 2;
    },
    fc = (t, s, i, h) => {
      for (; s < i - h; ) {
        for (let e = 0; e < h; e++) {
          const n = t[s + e];
          ((t[s + e] = t[i - h + e]), (t[i - h + e] = n));
        }
        ((s += h), (i -= h));
      }
    },
    mc = (t, s, i, h) => {
      let e = 0,
        n = t[i - h],
        r = t[i - h + 1];
      for (; s < i; s += h) {
        const i = t[s],
          h = t[s + 1];
        ((e += (i - n) * (h + r)), (n = i), (r = h));
      }
      return e > 0;
    },
    pc = (t, s, i, h, e) => {
      const n = Bs(e, !1);
      for (let e = 0, r = i.length; e < r; e++) {
        const r = i[e],
          o = mc(t, s, r, h);
        ((0 === e ? (n && o) || (!n && !o) : (n && !o) || (!n && o)) &&
          fc(t, s, r, h),
          (s = r));
      }
      return s;
    };
  class gc extends cc {
    constructor(t, s) {
      (super(),
        (this.maxDelta = -1),
        (this.maxDeltaRevision = -1),
        void 0 === s || Array.isArray(t[0])
          ? this.setCoordinates(t, s)
          : this.setFlatCoordinates(s, t));
    }
    clone() {
      return new gc(this.flatCoordinates.slice(), this.layout);
    }
    getArea() {
      return dc(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride
      );
    }
    getCoordinates() {
      return Ha(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride
      );
    }
    getSimplifiedGeometryInternal(t) {
      const s = [];
      return (
        (s.length = Ja(
          this.flatCoordinates,
          0,
          this.flatCoordinates.length,
          this.stride,
          t,
          s,
          0
        )),
        new gc(s, tc)
      );
    }
    getType() {
      return "LinearRing";
    }
    setCoordinates(t, s) {
      (this.setLayout(s, t, 1),
        this.flatCoordinates || (this.flatCoordinates = []),
        (this.flatCoordinates.length = Ba(
          this.flatCoordinates,
          0,
          t,
          this.stride
        )),
        this.changed());
    }
  }
  class wc extends cc {
    constructor(t, s) {
      (super(), this.setCoordinates(t, s));
    }
    clone() {
      return new wc(this.flatCoordinates.slice(), this.layout);
    }
    getCoordinates() {
      return this.flatCoordinates ? this.flatCoordinates.slice() : [];
    }
    computeExtent(t) {
      return ((t, s) => {
        const i = t[0],
          h = t[1];
        return Tt(i, h, i, h, s);
      })(this.flatCoordinates, t);
    }
    getType() {
      return "Point";
    }
    setCoordinates(t, s) {
      (this.setLayout(s, t, 0),
        this.flatCoordinates || (this.flatCoordinates = []),
        (this.flatCoordinates.length = ((t, s, i) => {
          for (let h = 0, e = i.length; h < e; h++) t[s++] = i[h];
          return s;
        })(this.flatCoordinates, 0, t, this.stride)),
        this.changed());
    }
  }
  class vc extends cc {
    constructor(t, s, i) {
      (super(),
        (this.ends = []),
        (this.flatInteriorPointRevision = -1),
        (this.flatInteriorPoint = null),
        (this.maxDelta = -1),
        (this.maxDeltaRevision = -1),
        (this.orientedRevision = -1),
        (this.orientedFlatCoordinates = null),
        void 0 !== s && i
          ? (this.setFlatCoordinates(s, t), (this.ends = i))
          : this.setCoordinates(t, s));
    }
    clone() {
      return new vc(
        this.flatCoordinates.slice(),
        this.layout,
        this.ends.slice()
      );
    }
    containsXY(t, s) {
      return Va(
        this.getOrientedFlatCoordinates(),
        0,
        this.ends,
        this.stride,
        t,
        s
      );
    }
    getArea() {
      return ((t, s, i, h) => {
        let e = 0;
        for (let n = 0, r = i.length; n < r; n++) {
          const r = i[n];
          ((e += dc(t, s, r, h)), (s = r));
        }
        return e;
      })(this.getOrientedFlatCoordinates(), 0, this.ends, this.stride);
    }
    getCoordinates(t) {
      let s;
      return (
        void 0 !== t
          ? ((s = this.getOrientedFlatCoordinates().slice()),
            pc(s, 0, this.ends, this.stride, t))
          : (s = this.flatCoordinates),
        Ya(s, 0, this.ends, this.stride)
      );
    }
    getEnds() {
      return this.ends;
    }
    getFlatInteriorPoint() {
      if (this.flatInteriorPointRevision !== this.revision) {
        const t = It(this.getExtent());
        ((this.flatInteriorPoint = ((t, s, i, h, e) => {
          let n, r, o, a, c, l, u;
          const d = e[1],
            f = [];
          for (let s = 0, e = i.length; s < e; s++) {
            const e = i[s];
            for (a = t[e - h], l = t[e - h + 1], n = 0; n < e; n += h)
              ((c = t[n]),
                (u = t[n + 1]),
                ((d <= l && u <= d) || (l <= d && d <= u)) &&
                  ((o = ((d - l) / (u - l)) * (c - a) + a), f.push(o)),
                (a = c),
                (l = u));
          }
          let m = NaN,
            p = -1 / 0;
          for (f.sort(Ti), a = f[0], n = 1, r = f.length; n < r; n++) {
            c = f[n];
            const s = Math.abs(c - a);
            (s > p &&
              ((o = (a + c) / 2), Va(t, 0, i, h, o, d) && ((m = o), (p = s))),
              (a = c));
          }
          return (isNaN(m) && (m = e[0]), [m, d, p]);
        })(this.getOrientedFlatCoordinates(), 0, this.ends, this.stride, t)),
          (this.flatInteriorPointRevision = this.revision));
      }
      return this.flatInteriorPoint;
    }
    getInteriorPoint() {
      return new wc(this.getFlatInteriorPoint(), sc);
    }
    getLinearRingCount() {
      return this.ends.length;
    }
    getLinearRing(t) {
      return t < 0 || this.ends.length <= t
        ? null
        : new gc(
            this.flatCoordinates.slice(
              0 === t ? 0 : this.ends[t - 1],
              this.ends[t]
            ),
            this.layout
          );
    }
    getOrientedFlatCoordinates() {
      if (this.orientedRevision !== this.revision) {
        const t = this.flatCoordinates;
        (((t, s, i, h) => {
          const e = Bs(void 0, !1);
          for (let n = 0, r = i.length; n < r; n++) {
            const r = i[n],
              o = mc(t, s, r, h);
            if (0 === n) {
              if ((e && o) || (!e && !o)) return !1;
            } else if ((e && !o) || (!e && o)) return !1;
            s = r;
          }
          return !0;
        })(t, 0, this.ends, this.stride)
          ? (this.orientedFlatCoordinates = t)
          : ((this.orientedFlatCoordinates = t.slice()),
            (this.orientedFlatCoordinates.length = pc(
              this.orientedFlatCoordinates,
              0,
              this.ends,
              this.stride
            ))),
          (this.orientedRevision = this.revision));
      }
      return this.orientedFlatCoordinates;
    }
    getSimplifiedGeometryInternal(t) {
      const s = [],
        i = [];
      return (
        (s.length = ((t, s, i, h, e, n, r, o) => {
          for (let a = 0, c = i.length; a < c; a++) {
            const c = i[a];
            ((r = Qa(t, s, c, h, e, n, r)), o.push(r), (s = c));
          }
          return r;
        })(
          this.flatCoordinates,
          0,
          this.ends,
          this.stride,
          Math.sqrt(t),
          s,
          0,
          i
        )),
        new vc(s, tc, i)
      );
    }
    getType() {
      return ec;
    }
    setCoordinates(t, s) {
      (this.setLayout(s, t, 2),
        this.flatCoordinates || (this.flatCoordinates = []));
      const i = Za(this.flatCoordinates, 0, t, this.stride, this.ends);
      ((this.flatCoordinates.length = 0 === i.length ? 0 : i.at(-1)),
        this.changed());
    }
  }
  const yc = (t, s) => {
      let i,
        h = t + s,
        e = h - s,
        n = h - e;
      return (
        (e -= t),
        (n -= s),
        (i = -(e + n)),
        {
          s: h,
          t: i,
        }
      );
    },
    Mc = (t, s, i, h) => {
      let e = t < 0 ? 0 : s[i++];
      for (; --t >= 0; ) e = e * h + s[i++];
      return e;
    },
    bc = (t) => {
      if (0 === t) return t;
      const s = 1 / 16;
      let i = Math.abs(t);
      return ((i = i < s ? s - (s - i) : i), t < 0 ? -i : i);
    },
    Ac = (t, s) => ((t %= s) < -s / 2 ? t + s : t < s / 2 ? t : t - s),
    Tc = (t) => (-180 === (t = Ac(t, 360)) ? 180 : t),
    xc = (t) => (Math.abs(t) > 90 ? NaN : t),
    Ec = (t, s) => {
      const i = yc(Tc(-t), Tc(s)),
        h = Tc(i.s),
        e = i.t;
      return yc(180 === h && e > 0 ? -180 : h, e);
    },
    Dc = (t) => {
      let s, i, h, e, n, r;
      switch (
        ((s = t % 360),
        (i = 0 + Math.round(s / 90)),
        (s -= 90 * i),
        (s /= at),
        (h = Math.sin(s)),
        (e = Math.cos(s)),
        3 & i)
      ) {
        case 0:
          ((n = h), (r = e));
          break;
        case 1:
          ((n = e), (r = -h));
          break;
        case 2:
          ((n = -h), (r = -e));
          break;
        default:
          ((n = -e), (r = h));
      }
      return (
        0 !== t && ((n += 0), (r += 0)),
        {
          s: n,
          c: r,
        }
      );
    },
    Ic = (t, s) => {
      let i,
        h,
        e = 0;
      switch (
        (Math.abs(t) > Math.abs(s) && ((i = s), (s = t), (t = i), (e = 2)),
        s < 0 && ((s = -s), e++),
        (h = Math.atan2(t, s) * at),
        e)
      ) {
        case 1:
          h = (t >= 0 ? 180 : -180) - h;
          break;
        case 2:
          h = 90 - h;
          break;
        case 3:
          h = -90 + h;
      }
      return h;
    },
    Sc = 0.5 ** 52,
    Rc = 200 * Sc,
    kc = Math.sqrt(Sc),
    Lc = Sc * Rc,
    Nc = 1000 * kc,
    Oc = [1, 4, 64, 0, 256],
    Cc = [
      -1, 6, -16, 32, -9, 64, -128, 2048, 9, -16, 768, 3, -5, 512, -7, 1280, -7,
      2048,
    ],
    Fc = [
      205, -432, 768, 1536, 4005, -4736, 3840, 12288, -225, 116, 384, -7173,
      2695, 7680, 3467, 7680, 38081, 61440,
    ],
    Pc = [-11, -28, -192, 0, 256],
    zc = [
      1, 2, 16, 32, 35, 64, 384, 2048, 15, 80, 768, 7, 35, 512, 63, 1280, 77,
      2048,
    ],
    Uc = [-3, 128, -2, -3, 64, -1, -3, -1, 16, 3, -1, -2, 8, 1, -1, 2, 1, 1],
    Wc = [
      3, 128, 2, 5, 128, -1, 3, 3, 64, -1, 0, 1, 8, -1, 1, 4, 5, 256, 1, 3, 128,
      -3, -2, 3, 64, 1, -3, 2, 32, 7, 512, -10, 9, 384, 5, -9, 5, 192, 7, 512,
      -14, 7, 512, 21, 2560,
    ],
    Gc = [
      97, 15015, 1088, 156, 45045, -224, -4784, 1573, 45045, -10656, 14144,
      -4576, -858, 45045, 64, 624, -4576, 6864, -3003, 15015, 100, 208, 572,
      3432, -12012, 30030, 45045, 1, 9009, -2944, 468, 135135, 5792, 1040,
      -1287, 135135, 5952, -11648, 9152, -2574, 135135, -64, -624, 4576, -6864,
      3003, 135135, 8, 10725, 1856, -936, 225225, -8448, 4992, -1144, 225225,
      -1440, 4160, -4576, 1716, 225225, -136, 63063, 1024, -208, 105105, 3584,
      -3328, 1144, 315315, -128, 135135, -2560, 832, 405405, 128, 99099,
    ],
    jc = Math.sqrt(Number.MIN_VALUE),
    _c = 1025,
    Bc = 1929,
    Zc = 2051,
    Hc = 4101,
    Yc = 8197,
    qc = 16400,
    $c = 32768,
    Vc = 65408,
    Kc = (t, s, i, h) => {
      var e = h.length,
        n = e - (t ? 1 : 0),
        r = 2 * (i - s) * (i + s),
        o = 1 & n ? h[--e] : 0,
        a = 0;
      for (n = Math.floor(n / 2); n--; )
        o = r * (a = r * o - a + h[--e]) - o + h[--e];
      return t ? 2 * s * i * o : i * (o - a);
    },
    Jc = (t) => {
      const s = Math.floor(3);
      return (Mc(s, Oc, 0, ot(t)) / Oc[s + 1] + t) / (1 - t);
    },
    Xc = (t, s) => {
      const i = ot(t);
      let h = t,
        e = 0;
      for (let n = 1; n <= 6; n++) {
        const r = Math.floor((6 - n) / 2);
        ((s[n] = (h * Mc(r, Cc, e, i)) / Cc[e + r + 1]),
          (e += r + 2),
          (h *= t));
      }
    },
    Qc = (t) => {
      const s = Math.floor(3);
      return (Mc(s, Pc, 0, ot(t)) / Pc[s + 1] - t) / (1 + t);
    },
    tl = (t, s) => {
      const i = ot(t);
      let h = t,
        e = 0;
      for (let n = 1; n <= 6; n++) {
        const r = Math.floor((6 - n) / 2);
        ((s[n] = (h * Mc(r, zc, e, i)) / zc[e + r + 1]),
          (e += r + 2),
          (h *= t));
      }
    };
  class sl {
    constructor(t, s, i, h, e, n, r) {
      var o, a, c, l, u, d;
      (e || (e = 3979),
        (this.a = t.a),
        (this.f = t.f),
        (this._b = t._b),
        (this._c2 = t._c2),
        (this._f1 = t._f1),
        (this.caps = 640 | e | $c),
        (this.lat1 = xc(s)),
        (this.lon1 = i),
        void 0 === n || void 0 === r
          ? ((this.azi1 = Tc(h)),
            (o = Dc(bc(this.azi1))),
            (this.salp1 = o.s),
            (this.calp1 = o.c))
          : ((this.azi1 = h), (this.salp1 = n), (this.calp1 = r)),
        (o = Dc(bc(this.lat1))),
        (c = this._f1 * o.s),
        (a = o.c),
        (c /= o = Math.hypot(c, a)),
        (a /= o),
        (a = Math.max(jc, a)),
        (this._dn1 = Math.sqrt(1 + t._ep2 * ot(c))),
        (this._salp0 = this.salp1 * a),
        (this._calp0 = Math.hypot(this.calp1, this.salp1 * c)),
        (this._ssig1 = c),
        (this._somg1 = this._salp0 * c),
        (this._csig1 = this._comg1 =
          0 !== c || 0 !== this.calp1 ? a * this.calp1 : 1),
        (o = Math.hypot(this._ssig1, this._csig1)),
        (this._ssig1 /= o),
        (this._csig1 /= o),
        (this._k2 = ot(this._calp0) * t._ep2),
        (l = this._k2 / (2 * (1 + Math.sqrt(1 + this._k2)) + this._k2)),
        1 & this.caps &&
          ((this._A1m1 = Jc(l)),
          (this._C1a = new Array(7)),
          Xc(l, this._C1a),
          (this._B11 = Kc(!0, this._ssig1, this._csig1, this._C1a)),
          (u = Math.sin(this._B11)),
          (d = Math.cos(this._B11)),
          (this._stau1 = this._ssig1 * d + this._csig1 * u),
          (this._ctau1 = this._csig1 * d - this._ssig1 * u)),
        2 & this.caps &&
          ((this._C1pa = new Array(7)),
          ((t, s) => {
            const i = ot(t);
            let h = t,
              e = 0;
            for (let n = 1; n <= 6; n++) {
              const r = Math.floor((6 - n) / 2);
              ((s[n] = (h * Mc(r, Fc, e, i)) / Fc[e + r + 1]),
                (e += r + 2),
                (h *= t));
            }
          })(l, this._C1pa)),
        4 & this.caps &&
          ((this._A2m1 = Qc(l)),
          (this._C2a = new Array(7)),
          tl(l, this._C2a),
          (this._B21 = Kc(!0, this._ssig1, this._csig1, this._C2a))),
        8 & this.caps &&
          ((this._C3a = new Array(6)),
          t.c3f(l, this._C3a),
          (this._A3c = -this.f * this._salp0 * t.a3f(l)),
          (this._B31 = Kc(!0, this._ssig1, this._csig1, this._C3a))),
        16 & this.caps &&
          ((this._C4a = new Array(6)),
          t.c4f(l, this._C4a),
          (this._A4 = ot(this.a) * this._calp0 * this._salp0 * t._e2),
          (this._B41 = Kc(!1, this._ssig1, this._csig1, this._C4a))),
        (this.a13 = this.s13 = NaN));
    }
    genPosition(t, s, i) {
      var h,
        e,
        n,
        r,
        o,
        a,
        c,
        l,
        u,
        d,
        f,
        m,
        p,
        g,
        w,
        v,
        y,
        M,
        b,
        A,
        T,
        x,
        E,
        D,
        I,
        S,
        R,
        k = {};
      return (
        i ? i === $c && (i |= Bc) : (i = Bc),
        (i &= this.caps & Vc),
        (k.lat1 = this.lat1),
        (k.azi1 = this.azi1),
        (k.lon1 = i & $c ? this.lon1 : Tc(this.lon1)),
        t ? (k.a12 = s) : (k.s12 = s),
        t || this.caps & Zc & Vc
          ? ((r = 0),
            (o = 0),
            t
              ? ((h = s / at), (e = (E = Dc(s)).s), (n = E.c))
              : ((l = s / (this._b * (1 + this._A1m1))),
                (u = Math.sin(l)),
                (d = Math.cos(l)),
                (h =
                  l -
                  ((r = -Kc(
                    !0,
                    this._stau1 * d + this._ctau1 * u,
                    this._ctau1 * d - this._stau1 * u,
                    this._C1pa
                  )) -
                    this._B11)),
                (e = Math.sin(h)),
                (n = Math.cos(h)),
                Math.abs(this.f) > 0.01 &&
                  ((a = this._ssig1 * n + this._csig1 * e),
                  (c = this._csig1 * n - this._ssig1 * e),
                  (r = Kc(!0, a, c, this._C1a)),
                  (h -=
                    ((1 + this._A1m1) * (h + (r - this._B11)) - s / this._b) /
                    Math.sqrt(1 + this._k2 * ot(a))),
                  (e = Math.sin(h)),
                  (n = Math.cos(h)))),
            (a = this._ssig1 * n + this._csig1 * e),
            (c = this._csig1 * n - this._ssig1 * e),
            (b = Math.sqrt(1 + this._k2 * ot(a))),
            13317 & i &&
              ((t || Math.abs(this.f) > 0.01) && (r = Kc(!0, a, c, this._C1a)),
              (o = (1 + this._A1m1) * (r - this._B11))),
            (p = this._calp0 * a),
            0 === (g = Math.hypot(this._salp0, this._calp0 * c)) &&
              (g = c = jc),
            (y = this._salp0),
            (M = this._calp0 * c),
            t && i & _c && (k.s12 = this._b * ((1 + this._A1m1) * h + o)),
            264 & i &&
              ((w = this._salp0 * a),
              (v = c),
              (R = this._salp0),
              (m = Math.abs(1) * (R < 0 || (0 === R && 1 / R < 0) ? -1 : 1)),
              (f =
                ((i & $c
                  ? m *
                    (h -
                      (Math.atan2(a, c) -
                        Math.atan2(this._ssig1, this._csig1)) +
                      (Math.atan2(m * w, v) -
                        Math.atan2(m * this._somg1, this._comg1)))
                  : Math.atan2(
                      w * this._comg1 - v * this._somg1,
                      v * this._comg1 + w * this._somg1
                    )) +
                  this._A3c * (h + (Kc(!0, a, c, this._C3a) - this._B31))) *
                at),
              (k.lon2 = i & $c ? this.lon1 + f : Tc(Tc(this.lon1) + Tc(f)))),
            128 & i && (k.lat2 = Ic(p, this._f1 * g)),
            512 & i && (k.azi2 = Ic(y, M)),
            12293 & i &&
              ((A = Kc(!0, a, c, this._C2a)),
              (T = (1 + this._A2m1) * (A - this._B21)),
              (x = (this._A1m1 - this._A2m1) * h + (o - T)),
              i & Hc &&
                (k.m12 =
                  this._b *
                  (b * (this._csig1 * a) -
                    this._dn1 * (this._ssig1 * c) -
                    this._csig1 * c * x)),
              i & Yc &&
                ((E =
                  (this._k2 * (a - this._ssig1) * (a + this._ssig1)) /
                  (this._dn1 + b)),
                (k.M12 = n + ((E * a - c * x) * this._ssig1) / this._dn1),
                (k.M21 = n - ((E * this._ssig1 - this._csig1 * x) * a) / b))),
            i & qc &&
              ((D = Kc(!1, a, c, this._C4a)),
              0 === this._calp0 || 0 === this._salp0
                ? ((I = y * this.calp1 - M * this.salp1),
                  (S = M * this.calp1 + y * this.salp1))
                : ((I =
                    this._calp0 *
                    this._salp0 *
                    (n <= 0
                      ? this._csig1 * (1 - n) + e * this._ssig1
                      : e * ((this._csig1 * e) / (1 + n) + this._ssig1))),
                  (S = ot(this._salp0) + ot(this._calp0) * this._csig1 * c)),
              (k.S12 =
                this._c2 * Math.atan2(I, S) + this._A4 * (D - this._B41))),
            t || (k.a12 = h * at),
            k)
          : ((k.a12 = NaN), k)
      );
    }
    position(t, s) {
      return this.genPosition(!1, t, s);
    }
    genSetDistance(t, s) {
      t ? this.setArc(s) : this.setDistance(s);
    }
    setDistance(t) {
      this.s13 = t;
      const s = this.genPosition(!1, this.s13, 64);
      this.a13 = 0 + s.a12;
    }
    setArc(t) {
      this.a13 = t;
      const s = this.genPosition(!0, this.a13, _c);
      this.s13 = 0 + s.s12;
    }
  }
  class il {
    constructor(t) {
      this.set(t);
    }
    set(t) {
      (t || (t = 0),
        t.constructor === il
          ? ((this.s = t.s), (this.t = t.t))
          : ((this.s = t), (this.t = 0)));
    }
    add(t) {
      let s = yc(t, this.t),
        i = yc(s.s, this.s);
      ((s = s.t),
        (this.s = i.s),
        (this.t = i.t),
        0 === this.s ? (this.s = s) : (this.t += s));
    }
    sum(t) {
      if (!t) return this.s;
      const s = new il(this);
      return (s.add(t), s.s);
    }
    negate() {
      ((this.s *= -1), (this.t *= -1));
    }
    remainder(t) {
      ((this.s = Ac(this.s, t)), this.add(0));
    }
  }
  const hl = (t, s) => {
    ((t = Tc(t)), (s = Tc(s)));
    const i = Ec(t, s).s;
    return t <= 0 && s > 0 && i > 0 ? 1 : s <= 0 && t > 0 && i < 0 ? -1 : 0;
  };
  class el {
    constructor(t) {
      ((this.geod = t),
        (this.a = this.geod.a),
        (this.f = this.geod.f),
        (this.area0 = 4 * Math.PI * t._c2),
        (this.mask = 50585),
        (this.areaSum = new il(0)),
        (this.perimeterSum = new il(0)),
        this.clear());
    }
    clear() {
      ((this.num = 0),
        (this.crossings = 0),
        this.areaSum.set(0),
        this.perimeterSum.set(0),
        (this.lat0 = this.lon0 = this.lat = this.lon = NaN));
    }
    addPoint(t, s) {
      if (0 === this.num)
        ((this.lat0 = this.lat = t), (this.lon0 = this.lon = s));
      else {
        const i = this.geod.inverse(this.lat, this.lon, t, s, this.mask);
        (this.perimeterSum.add(i.s12),
          this.areaSum.add(i.S12),
          (this.crossings += hl(this.lon, s)),
          (this.lat = t),
          (this.lon = s));
      }
      this.num++;
    }
    compute(t, s) {
      let i = {
        number: this.num,
      };
      if (this.num < 2) return ((i.perimeter = 0), (i.area = 0), i);
      const h = this.geod.inverse(
        this.lat,
        this.lon,
        this.lat0,
        this.lon0,
        this.mask
      );
      i.perimeter = this.perimeterSum.sum(h.s12);
      const e = new il(this.areaSum);
      return (
        e.add(h.S12),
        (i.area = ((t, s, i, h, e) => (
          t.remainder(s),
          1 & i && t.add(((t.sum() < 0 ? 1 : -1) * s) / 2),
          h || t.negate(),
          e
            ? t.sum() > s / 2
              ? t.add(-s)
              : t.sum() <= -s / 2 && t.add(+s)
            : t.sum() >= s
              ? t.add(-s)
              : t.sum() < 0 && t.add(+s),
          0 + t.sum()
        ))(e, this.area0, this.crossings + hl(this.lon, this.lon0), t, s)),
        i
      );
    }
  }
  const nl = new (class {
      constructor(t, s) {
        ((this.a = t),
          (this.f = s),
          (this._f1 = 1 - this.f),
          (this._e2 = this.f * (2 - this.f)),
          (this._ep2 = this._e2 / ot(this._f1)),
          (this._n = this.f / (2 - this.f)),
          (this._b = this.a * this._f1),
          (this._c2 =
            (ot(this.a) +
              ot(this._b) *
                (0 === this._e2
                  ? 1
                  : (this._e2 > 0
                      ? Math.atanh(Math.sqrt(this._e2))
                      : Math.atan(Math.sqrt(-this._e2))) /
                    Math.sqrt(Math.abs(this._e2)))) /
            2),
          (this._etol2 =
            (0.1 * kc) /
            Math.sqrt(
              (Math.max(0.001, Math.abs(this.f)) *
                Math.min(1, 1 - this.f / 2)) /
                2
            )),
          (this._A3x = new Array(6)),
          (this._C3x = new Array(15)),
          (this._C4x = new Array(21)),
          this.a3coeff(),
          this.c3coeff(),
          this.c4coeff());
      }
      a3coeff() {
        var t,
          s,
          i = 0,
          h = 0;
        for (t = 6; t--; )
          ((s = Math.min(6 - t - 1, t)),
            (this._A3x[h++] = Mc(s, Uc, i, this._n) / Uc[i + s + 1]),
            (i += s + 2));
      }
      c3coeff() {
        var t,
          s,
          i,
          h = 0,
          e = 0;
        for (t = 1; t < 6; ++t)
          for (s = 5; s >= t; s--)
            ((i = Math.min(6 - s - 1, s)),
              (this._C3x[e++] = Mc(i, Wc, h, this._n) / Wc[h + i + 1]),
              (h += i + 2));
      }
      c4coeff() {
        var t,
          s,
          i,
          h = 0,
          e = 0;
        for (t = 0; t < 6; ++t)
          for (s = 5; s >= t; s--)
            ((i = 6 - s - 1),
              (this._C4x[e++] = Mc(i, Gc, h, this._n) / Gc[h + i + 1]),
              (h += i + 2));
      }
      a3f(t) {
        return Mc(5, this._A3x, 0, t);
      }
      c3f(t, s) {
        var i,
          h,
          e = 1,
          n = 0;
        for (i = 1; i < 6; ++i)
          ((h = 6 - i - 1),
            (e *= t),
            (s[i] = e * Mc(h, this._C3x, n, t)),
            (n += h + 1));
      }
      c4f(t, s) {
        var i,
          h,
          e = 1,
          n = 0;
        for (i = 0; i < 6; ++i)
          ((h = 6 - i - 1),
            (s[i] = e * Mc(h, this._C4x, n, t)),
            (n += h + 1),
            (e *= t));
      }
      lengths(t, s, i, h, e, n, r, o, a, c, l, u, d) {
        var f,
          m,
          p,
          g,
          w = {},
          v = 0,
          y = 0,
          M = 0,
          b = 0;
        if (
          (13317 & (l &= Vc) &&
            ((M = Jc(t)),
            Xc(t, u),
            12293 & l && ((b = Qc(t)), tl(t, d), (v = M - b), (b = 1 + b)),
            (M = 1 + M)),
          l & _c)
        )
          ((f = Kc(!0, n, r, u) - Kc(!0, i, h, u)),
            (w.s12b = M * (s + f)),
            12293 & l &&
              (y = v * s + (M * f - b * (Kc(!0, n, r, d) - Kc(!0, i, h, d)))));
        else if (12293 & l) {
          for (m = 1; m <= 6; ++m) d[m] = M * u[m] - b * d[m];
          y = v * s + (Kc(!0, n, r, d) - Kc(!0, i, h, d));
        }
        return (
          l & Hc &&
            ((w.m0 = v), (w.m12b = o * (h * n) - e * (i * r) - h * r * y)),
          l & Yc &&
            ((p = h * r + i * n),
            (g = (this._ep2 * (a - c) * (a + c)) / (e + o)),
            (w.M12 = p + ((g * n - r * y) * i) / e),
            (w.M21 = p - ((g * i - h * y) * n) / o)),
          w
        );
      }
      inverseStart(t, s, i, h, e, n, r, o, a, c, l) {
        var u,
          d,
          f,
          m,
          p,
          g,
          w,
          v,
          y,
          M,
          b,
          A,
          T,
          x,
          E,
          D,
          I,
          S,
          R,
          k,
          L = {},
          N = h * s - e * t,
          O = e * s + h * t;
        return (
          (L.sig12 = -1),
          (u = h * s),
          (u += e * t),
          (d = O >= 0 && N < 0.5 && e * r < 0.5)
            ? ((m = ot(t + h)),
              (m /= m + ot(s + e)),
              (L.dnm = Math.sqrt(1 + this._ep2 * m)),
              (f = r / (this._f1 * L.dnm)),
              (p = Math.sin(f)),
              (g = Math.cos(f)))
            : ((p = o), (g = a)),
          (L.salp1 = e * p),
          (L.calp1 =
            g >= 0
              ? N + (e * t * ot(p)) / (1 + g)
              : u - (e * t * ot(p)) / (1 - g)),
          (v = Math.hypot(L.salp1, L.calp1)),
          (y = t * h + s * e * g),
          d && v < this._etol2
            ? ((L.salp2 = s * p),
              (L.calp2 = N - s * h * (g >= 0 ? ot(p) / (1 + g) : 1 - g)),
              (w = Math.hypot(L.salp2, L.calp2)),
              (L.salp2 /= w),
              (L.calp2 /= w),
              (L.sig12 = Math.atan2(v, y)))
            : Math.abs(this._n) > 0.1 ||
              y >= 0 ||
              v >= 6 * Math.abs(this._n) * Math.PI * ot(s) ||
              ((k = Math.atan2(-o, -a)),
              this.f >= 0
                ? ((x =
                    (T = ot(t) * this._ep2) / (2 * (1 + Math.sqrt(1 + T)) + T)),
                  (M = k / (A = this.f * s * this.a3f(x) * Math.PI)),
                  (b = u / (A * s)))
                : ((E = e * s - h * t),
                  (D = Math.atan2(u, E)),
                  (b =
                    r /
                    (A =
                      ((M =
                        (I = this.lengths(
                          this._n,
                          Math.PI + D,
                          t,
                          -s,
                          i,
                          h,
                          e,
                          n,
                          s,
                          e,
                          Hc,
                          c,
                          l
                        )).m12b /
                          (s * e * I.m0 * Math.PI) -
                        1) < -0.01
                        ? u / M
                        : -this.f * ot(s) * Math.PI) / s))),
              b > -Rc && M > -1 - Nc
                ? this.f >= 0
                  ? ((L.salp1 = Math.min(1, -M)),
                    (L.calp1 = -Math.sqrt(1 - ot(L.salp1))))
                  : ((L.calp1 = Math.max(M > -Rc ? 0 : -1, M)),
                    (L.salp1 = Math.sqrt(1 - ot(L.calp1))))
                : ((S = ((t, s) => {
                    var i,
                      h,
                      e,
                      n,
                      r,
                      o,
                      a,
                      c,
                      l,
                      u,
                      d,
                      f,
                      m = ot(t),
                      p = ot(s),
                      g = (m + p - 1) / 6;
                    return (
                      0 === p && g <= 0
                        ? (i = 0)
                        : ((o = g),
                          (r =
                            (h = (m * p) / 4) *
                            (h + 2 * (n = g * (e = ot(g))))) >= 0
                            ? ((a = h + n),
                              (a += a < 0 ? -Math.sqrt(r) : Math.sqrt(r)),
                              (o += (c = Math.cbrt(a)) + (0 !== c ? e / c : 0)))
                            : ((l = Math.atan2(Math.sqrt(-r), -(h + n))),
                              (o += 2 * g * Math.cos(l / 3))),
                          (u = Math.sqrt(ot(o) + p)),
                          (f =
                            ((d = o < 0 ? p / (u - o) : o + u) - p) / (2 * u)),
                          (i = d / (Math.sqrt(d + ot(f)) + f))),
                      i
                    );
                  })(M, b)),
                  (R =
                    A *
                    (this.f >= 0 ? (-M * S) / (1 + S) : (-b * (1 + S)) / S)),
                  (p = Math.sin(R)),
                  (g = -Math.cos(R)),
                  (L.salp1 = e * p),
                  (L.calp1 = u - (e * t * ot(p)) / (1 - g)))),
          L.salp1 <= 0
            ? ((L.salp1 = 1), (L.calp1 = 0))
            : ((w = Math.hypot(L.salp1, L.calp1)),
              (L.salp1 /= w),
              (L.calp1 /= w)),
          L
        );
      }
      lambda12(t, s, i, h, e, n, r, o, a, c, l, u, d, f) {
        var m,
          p,
          g,
          w,
          v,
          y,
          M,
          b,
          A,
          T,
          x,
          E,
          D,
          I = {};
        return (
          0 === t && 0 === o && (o = -jc),
          (p = r * s),
          (g = Math.hypot(o, r * t)),
          (I.ssig1 = t),
          (w = p * t),
          (I.csig1 = v = o * s),
          (m = Math.hypot(I.ssig1, I.csig1)),
          (I.ssig1 /= m),
          (I.csig1 /= m),
          (I.salp2 = e !== s ? p / e : r),
          (I.calp2 =
            e !== s || Math.abs(h) !== -t
              ? Math.sqrt(
                  ot(o * s) + (s < -t ? (e - s) * (s + e) : (t - h) * (t + h))
                ) / e
              : Math.abs(o)),
          (I.ssig2 = h),
          (y = p * h),
          (I.csig2 = M = I.calp2 * e),
          (m = Math.hypot(I.ssig2, I.csig2)),
          (I.ssig2 /= m),
          (I.csig2 /= m),
          (I.sig12 = Math.atan2(
            Math.max(0, I.csig1 * I.ssig2 - I.ssig1 * I.csig2),
            I.csig1 * I.csig2 + I.ssig1 * I.ssig2
          )),
          (b = Math.max(0, v * y - w * M)),
          (A = v * M + w * y),
          (x = Math.atan2(b * c - A * a, A * c + b * a)),
          (E = ot(g) * this._ep2),
          (I.eps = E / (2 * (1 + Math.sqrt(1 + E)) + E)),
          this.c3f(I.eps, f),
          (T = Kc(!0, I.ssig2, I.csig2, f) - Kc(!0, I.ssig1, I.csig1, f)),
          (I.domg12 = -this.f * this.a3f(I.eps) * p * (I.sig12 + T)),
          (I.lam12 = x + I.domg12),
          l &&
            (0 === I.calp2
              ? (I.dlam12 = (-2 * this._f1 * i) / t)
              : ((D = this.lengths(
                  I.eps,
                  I.sig12,
                  I.ssig1,
                  I.csig1,
                  i,
                  I.ssig2,
                  I.csig2,
                  n,
                  s,
                  e,
                  Hc,
                  u,
                  d
                )),
                (I.dlam12 = D.m12b),
                (I.dlam12 *= this._f1 / (I.calp2 * e)))),
          I
        );
      }
      inverse(t, s, i, h, e) {
        var n, r;
        return (
          e || (e = Bc),
          e === $c && (e |= Bc),
          (e &= Vc),
          (r = (n = this.inverseInt(t, s, i, h, e)).vals),
          512 & e &&
            ((r.azi1 = Ic(n.salp1, n.calp1)), (r.azi2 = Ic(n.salp2, n.calp2))),
          r
        );
      }
      inverseInt(t, s, i, h, e) {
        var n,
          r,
          o,
          a,
          c,
          l,
          u,
          d,
          f,
          m,
          p,
          g,
          w,
          v,
          y,
          M,
          b,
          A,
          T,
          x,
          E,
          D,
          I,
          S,
          R,
          k,
          L,
          N,
          O,
          C,
          F,
          P,
          z,
          U,
          W,
          G,
          j,
          _,
          B,
          Z,
          H,
          Y,
          q,
          $,
          V,
          K,
          J,
          X,
          Q,
          tt,
          st,
          it,
          ht,
          et,
          nt,
          rt,
          ct,
          lt,
          ut,
          dt,
          ft,
          mt,
          pt,
          gt,
          wt,
          vt = {};
        if (
          ((vt.lat1 = t = xc(t)),
          (vt.lat2 = i = xc(i)),
          (t = bc(t)),
          (i = bc(i)),
          (r = (n = Ec(s, h)).t),
          (n = n.s),
          e & $c
            ? ((vt.lon1 = s), (vt.lon2 = s + n + r))
            : ((vt.lon1 = Tc(s)), (vt.lon2 = Tc(h))),
          (n = (o = n >= 0 ? 1 : -1) * bc(n)),
          (r = bc(180 - n - o * r)),
          (y = n / at),
          (M = (a = Dc(n > 90 ? r : n)).s),
          (b = (n > 90 ? -1 : 1) * a.c),
          (c = Math.abs(t) < Math.abs(i) ? -1 : 1) < 0 &&
            ((o *= -1), (a = t), (t = i), (i = a)),
          (i *= l = t < 0 ? 1 : -1),
          (a = Dc((t *= l))),
          (u = this._f1 * a.s),
          (d = a.c),
          (u /= a = Math.hypot(u, d)),
          (d /= a),
          (d = Math.max(jc, d)),
          (a = Dc(i)),
          (f = this._f1 * a.s),
          (m = a.c),
          (f /= a = Math.hypot(f, m)),
          (m /= a),
          (m = Math.max(jc, m)),
          d < -u
            ? m === d && (f = f < 0 ? u : -u)
            : Math.abs(f) === -u && (m = d),
          (w = Math.sqrt(1 + this._ep2 * ot(u))),
          (v = Math.sqrt(1 + this._ep2 * ot(f))),
          (I = new Array(7)),
          (S = new Array(7)),
          (R = new Array(6)),
          (k = -90 === t || 0 === M) &&
            ((x = M),
            (D = 0),
            (N = u),
            (O = (T = b) * d),
            (C = f),
            (F = (E = 1) * m),
            (A = Math.atan2(Math.max(0, O * C - N * F), O * F + N * C)),
            (p = (L = this.lengths(
              this._n,
              A,
              N,
              O,
              w,
              C,
              F,
              v,
              d,
              m,
              e | _c | Hc,
              I,
              S
            )).s12b),
            (g = L.m12b),
            e & Yc && ((vt.M12 = L.M12), (vt.M21 = L.M21)),
            A < 1 || g >= 0
              ? (A < 3 * jc && (A = g = p = 0),
                (g *= this._b),
                (p *= this._b),
                (vt.a12 = A * at))
              : (k = !1)),
          (ct = 2),
          !k && 0 === u && (this.f <= 0 || r >= 180 * this.f))
        )
          ((T = E = 0),
            (x = D = 1),
            (p = this.a * y),
            (A = z = y / this._f1),
            (g = this._b * Math.sin(A)),
            e & Yc && (vt.M12 = vt.M21 = Math.cos(A)),
            (vt.a12 = n / this._f1));
        else if (!k)
          if (
            ((A = (L = this.inverseStart(u, d, w, f, m, v, y, M, b, I, S))
              .sig12),
            (x = L.salp1),
            (T = L.calp1),
            A >= 0)
          )
            ((D = L.salp2),
              (E = L.calp2),
              (U = L.dnm),
              (p = A * this._b * U),
              (g = ot(U) * this._b * Math.sin(A / U)),
              e & Yc && (vt.M12 = vt.M21 = Math.cos(A / U)),
              (vt.a12 = A * at),
              (z = y / (this._f1 * U)));
          else {
            for (
              W = 0, G = jc, j = 1, _ = jc, B = -1, Z = !1, H = !1;
              W < 83 &&
              ((Y = (L = this.lambda12(
                u,
                d,
                w,
                f,
                m,
                v,
                x,
                T,
                M,
                b,
                W < 20,
                I,
                S,
                R
              )).lam12),
              (D = L.salp2),
              (E = L.calp2),
              (A = L.sig12),
              (N = L.ssig1),
              (O = L.csig1),
              (C = L.ssig2),
              (F = L.csig2),
              (P = L.eps),
              (ut = L.domg12),
              (q = L.dlam12),
              !H && Math.abs(Y) >= (Z ? 8 : 1) * Sc);
              ++W
            )
              (Y > 0 && (W < 20 || T / x > B / _)
                ? ((_ = x), (B = T))
                : Y < 0 && (W < 20 || T / x < j / G) && ((G = x), (j = T)),
                W < 20 &&
                q > 0 &&
                (($ = -Y / q),
                (V = Math.sin($)),
                (J = x * (K = Math.cos($)) + T * V) > 0 &&
                  Math.abs($) < Math.PI)
                  ? ((T = T * K - x * V),
                    (x = J),
                    (x /= a = Math.hypot(x, T)),
                    (T /= a),
                    (Z = Math.abs(Y) <= 16 * Sc))
                  : ((x = (G + _) / 2),
                    (T = (j + B) / 2),
                    (x /= a = Math.hypot(x, T)),
                    (T /= a),
                    (Z = !1),
                    (H =
                      Math.abs(G - x) + (j - T) < Lc ||
                      Math.abs(x - _) + (T - B) < Lc)));
            ((X = e | (12293 & e ? _c : 0)),
              (p = (L = this.lengths(P, A, N, O, w, C, F, v, d, m, X, I, S))
                .s12b),
              (g = L.m12b),
              e & Yc && ((vt.M12 = L.M12), (vt.M21 = L.M21)),
              (g *= this._b),
              (p *= this._b),
              (vt.a12 = A * at),
              e & qc &&
                ((gt = Math.sin(ut)),
                (ct = M * (wt = Math.cos(ut)) - b * gt),
                (lt = b * wt + M * gt)));
          }
        return (
          e & _c && (vt.s12 = 0 + p),
          e & Hc && (vt.m12 = 0 + g),
          e & qc &&
            ((Q = x * d),
            0 !== (tt = Math.hypot(T, x * u)) && 0 !== Q
              ? ((N = u),
                (O = T * d),
                (C = f),
                (F = E * m),
                (P =
                  (it = ot(tt) * this._ep2) /
                  (2 * (1 + Math.sqrt(1 + it)) + it)),
                (ht = ot(this.a) * tt * Q * this._e2),
                (N /= a = Math.hypot(N, O)),
                (O /= a),
                (C /= a = Math.hypot(C, F)),
                (F /= a),
                (et = new Array(6)),
                this.c4f(P, et),
                (nt = Kc(!1, N, O, et)),
                (rt = Kc(!1, C, F, et)),
                (vt.S12 = ht * (rt - nt)))
              : (vt.S12 = 0),
            !k && ct > 1 && ((ct = Math.sin(z)), (lt = Math.cos(z))),
            !k && lt > -0.7071 && f - u < 1.75
              ? ((ut = 1 + lt),
                (dt = 1 + d),
                (ft = 1 + m),
                (st =
                  2 *
                  Math.atan2(ct * (u * ft + f * dt), ut * (u * f + dt * ft))))
              : ((pt = E * T + D * x),
                0 == (mt = D * T - E * x) &&
                  pt < 0 &&
                  ((mt = jc * T), (pt = -1)),
                (st = Math.atan2(mt, pt))),
            (vt.S12 += this._c2 * st),
            (vt.S12 *= c * o * l),
            (vt.S12 += 0)),
          c < 0 &&
            ((a = x),
            (x = D),
            (D = a),
            (a = T),
            (T = E),
            (E = a),
            e & Yc && ((a = vt.M12), (vt.M12 = vt.M21), (vt.M21 = a))),
          {
            vals: vt,
            salp1: (x *= c * o),
            calp1: (T *= c * l),
            salp2: (D *= c * o),
            calp2: (E *= c * l),
          }
        );
      }
      genDirect(t, s, i, h, e, n) {
        return (
          n ? n === $c && (n |= Bc) : (n = Bc),
          h || (n |= Zc),
          new sl(this, t, s, i, n).genPosition(h, e, n)
        );
      }
      direct(t, s, i, h, e) {
        return this.genDirect(t, s, i, !1, h, e);
      }
      genDirectLine(t, s, i, h, e, n) {
        (n || (n = 3979), h || (n |= Zc));
        const r = new sl(this, t, s, i, n);
        return (r.genSetDistance(h, e), r);
      }
      inverseLine(t, s, i, h, e) {
        e || (e = 3979);
        const n = this.inverseInt(t, s, i, h, 64),
          r = Ic(n.salp1, n.calp1);
        2048 & e && (e |= _c);
        const o = new sl(this, t, s, r, e, n.salp1, n.calp1);
        return (o.setArc(n.vals.a12), o);
      }
      polygon() {
        return new el(this);
      }
    })(zt, 1 / 298.257223563),
    rl = (t) => {
      const s = [];
      return (
        t
          .clone()
          .toGeodeticArray()
          .forEachSegment((t, i) => {
            const h = nl.inverseLine(t[1], t[0], i[1], i[0]),
              e = Math.ceil(h.s13 / 10000);
            for (let t = 0; t <= e; t++) {
              const i = h.position(Math.min(10000 * t, h.s13), $c);
              s.push([i.lon2, i.lat2]);
            }
          }),
        new uc([s]).toWebMercator()
      );
    },
    ol = function (t, s, i) {
      void 0 === i && (i = 1);
      const h = t / i;
      return it(
        h,
        s ||
          (h < 1
            ? 100
            : h < 10
              ? 10
              : h < 1000
                ? 1
                : h < 10000
                  ? 0.1
                  : h < 100000
                    ? 0.01
                    : h < 1000000
                      ? 0.001
                      : h < 10000000
                        ? 0.0001
                        : 0.00001)
      ).toLocaleString(Kh.nonArabicLang);
    },
    al = (t, s, i, h) => {
      if ($s(t))
        switch (s) {
          case qe.METRIC:
            return ol(t, i, 1000000) + " " + Is.unit.km2;
          case qe.IMPERIAL:
            return ol(10.7639111056 * t, i, 27878400) + " " + Is.unit.miles2;
          case qe.ACRES:
            const s = ol(t, i, Xt);
            return (
              s +
              " " +
              (h ? Is.unit.acreShort : "1" === s ? Is.unit.acre : Is.unit.acres)
            );
          case qe.HECTARES:
            const e = ol(t, i, 10000);
            return (
              e +
              " " +
              (h
                ? Is.unit.hectareShort
                : "1" === e
                  ? Is.unit.hectare
                  : Is.unit.hectares)
            );
        }
    },
    cl = (t) => t.getGeometry(),
    ll = (t) => {
      if (qs(t)) return t;
      const s = Array.isArray(t) ? t : [t];
      return () => s;
    };
  class ul {
    constructor(t) {
      (void 0 === t && (t = {}),
        (this.geometry = null),
        (this.geometryFunction = cl),
        void 0 !== t.geometry && this.setGeometry(t.geometry),
        (this.fill = Bs(t.fill, null)),
        (this.image = Bs(t.image, null)),
        (this.stroke = Bs(t.stroke, null)),
        (this.zIndex = t.zIndex));
    }
    getGeometry() {
      return this.geometry;
    }
    setGeometry(t) {
      ((this.geometry = t),
        qs(t)
          ? (this.geometryFunction = t)
          : (this.geometryFunction = t ? () => t : cl));
    }
  }
  const dl = new ul();
  class fl extends eo {
    constructor(t) {
      (super(),
        (this.id = void 0),
        (this.geometryName = "geometry"),
        (this.style = null),
        (this.styleFunction = void 0),
        (this.geometryChangeKey = null),
        Gr(this, io(this.geometryName), this.handleGeometryChanged, this),
        t &&
          (qs(t.getSimplifiedGeometry)
            ? this.setGeometry(t)
            : this.setProperties(t)));
    }
    clone() {
      const t = new fl(this.getProperties());
      t.setGeometryName(this.geometryName);
      const s = this.getGeometry();
      s && t.setGeometry(s.clone());
      const i = this.style;
      return (i && t.setStyle(i), t);
    }
    getGeometry() {
      return this.get(this.geometryName);
    }
    handleGeometryChange() {
      this.changed();
    }
    handleGeometryChanged() {
      this.geometryChangeKey &&
        (Br(this.geometryChangeKey), (this.geometryChangeKey = null));
      const s = this.getGeometry();
      (s &&
        (this.geometryChangeKey = Gr(s, t, this.handleGeometryChange, this)),
        this.changed());
    }
    setGeometry(t) {
      this.set(this.geometryName, t);
    }
    setStyle(t) {
      ((this.style = t),
        (this.styleFunction = t ? ll(t) : void 0),
        this.changed());
    }
    setGeometryName(t) {
      (_r(this, io(this.geometryName), this.handleGeometryChanged, this),
        (this.geometryName = t),
        Gr(this, io(this.geometryName), this.handleGeometryChanged, this),
        this.handleGeometryChanged());
    }
  }
  const ml = [5],
    pl = [6],
    gl = [3],
    wl = [4],
    vl = [1 / 0, 1 / 0, -1 / 0, -1 / 0],
    yl = Kh.safari && Kh.safariVersion >= 16 && Kh.safariVersion <= 16.2;
  class Ml {
    constructor(t, s, i, h) {
      ((this.tolerance = t),
        (this.maxExtent = s),
        (this.pixelRatio = h),
        (this.maxLineWidth = 0),
        (this.resolution = i),
        (this.beginGeometryInstruction1 = null),
        (this.beginGeometryInstruction2 = null),
        (this.bufferedMaxExtent = null),
        (this.instructions = []),
        (this.coordinates = []),
        (this.renderedTransform = [1, 0, 0, 1, 0, 0]),
        (this.hitDetectionInstructions = []),
        (this.pixelCoordinates = null),
        (this.state = {}));
    }
    renderImage(t, s, i, h, e, n, r, o, a, c, l, u, d) {
      ((s -= e *= l), (i -= n *= l));
      const f = d + a > h.width ? h.width - a : d,
        m = r + c > h.height ? h.height - c : r;
      if (
        (Tt(s, i, s + f * l, i + m * l, vl),
        vl[0] <= t.canvas.width &&
          vl[2] >= 0 &&
          vl[1] <= t.canvas.height &&
          vl[3] >= 0)
      ) {
        let e;
        (1 !== o && ((e = t.globalAlpha), (t.globalAlpha = e * o)),
          u && ((s = Math.round(s)), (i = Math.round(i))));
        try {
          t.drawImage(h, a, c, f, m, s, i, f * l, m * l);
        } catch (t) {}
        e && (t.globalAlpha = e);
      }
    }
    appendFlatCoordinates(t, s, i, h, e, n) {
      let r = this.coordinates.length;
      const o = this.getBufferedMaxExtent();
      n && (s += h);
      const a = [t[s], t[s + 1]],
        c = [NaN, NaN];
      let l,
        u,
        d,
        f = !0;
      for (l = s + h; l < i; l += h)
        ((c[0] = t[l]),
          (c[1] = t[l + 1]),
          (d = At(o, c)),
          d !== u
            ? (f &&
                ((this.coordinates[r++] = a[0]),
                (this.coordinates[r++] = a[1])),
              (this.coordinates[r++] = c[0]),
              (this.coordinates[r++] = c[1]),
              (f = !1))
            : 1 === d
              ? ((this.coordinates[r++] = c[0]),
                (this.coordinates[r++] = c[1]),
                (f = !1))
              : (f = !0),
          (a[0] = c[0]),
          (a[1] = c[1]),
          (u = d));
      return (
        ((e && f) || l === s + h) &&
          ((this.coordinates[r++] = a[0]), (this.coordinates[r++] = a[1])),
        r
      );
    }
    beginGeometry(t, s) {
      ((this.beginGeometryInstruction1 = [1, s, 0]),
        this.instructions.push(this.beginGeometryInstruction1),
        (this.beginGeometryInstruction2 = [1, s, 0]),
        this.hitDetectionInstructions.push(this.beginGeometryInstruction2));
    }
    finish() {}
    render(t, s, i, h) {
      this._render(t, s, i, this.instructions, h);
    }
    renderHitDetection(t, s, i, h, e) {
      return this._render(t, s, i, this.hitDetectionInstructions, !0, h, e);
    }
    _render(t, s, i, h, e, n, r) {
      let o;
      this.pixelCoordinates && Si(s, this.renderedTransform)
        ? (o = this.pixelCoordinates)
        : (this.pixelCoordinates || (this.pixelCoordinates = []),
          (o = rc(
            this.coordinates,
            0,
            this.coordinates.length,
            2,
            s,
            this.pixelCoordinates
          )),
          Hr(this.renderedTransform, s));
      const a = !Hs(i);
      let c = 0;
      const l = h.length;
      let u,
        d,
        f,
        m,
        p,
        g,
        w,
        v,
        y,
        M = 0;
      for (; c < l; ) {
        const s = h[c];
        switch (s[0]) {
          case 1:
            ((w = s[1]),
              (a && i[Vr(w)]) || !w.getGeometry()
                ? (c = s[2])
                : void 0 === r || Ot(r, w.getGeometry().getExtent())
                  ? c++
                  : (c = s[2] + 1));
            break;
          case 3:
            (t.beginPath(), (d = f = void 0), c++);
            break;
          case 4:
            (t.closePath(), c++);
            break;
          case 0:
            ((u = s[2]), (g = s[3]));
            const h = s[4],
              l = s[5],
              b = s[7],
              A = s[8],
              T = s[9],
              x = s[10],
              E = s[13],
              D = s[14];
            for (M = s[1]; M < u; M += 2)
              this.renderImage(t, o[M], o[M + 1], g, h, l, b, A, T, x, E, e, D);
            c++;
            break;
          case 2:
            if (void 0 !== n) {
              w = s[1];
              const t = n(w);
              if (t) return t;
            }
            c++;
            break;
          case 5:
            (t.fill(), c++);
            break;
          case 9:
            for (
              M = s[1],
                u = s[2],
                v = o[M],
                y = o[M + 1],
                m = (v + 0.5) | 0,
                p = (y + 0.5) | 0,
                (m === d && p === f) || (t.moveTo(v, y), (d = m), (f = p)),
                M += 2;
              M < u;
              M += 2
            )
              ((v = o[M]),
                (y = o[M + 1]),
                (m = (v + 0.5) | 0),
                (p = (y + 0.5) | 0),
                (M !== u - 2 && m === d && p === f) ||
                  (t.lineTo(v, y), (d = m), (f = p)));
            c++;
            break;
          case 7:
            ((t.fillStyle = s[1]), c++);
            break;
          case 8:
            ((t.strokeStyle = s[1]),
              (t.lineWidth = s[2]),
              yl &&
                void 0 !== t.lineWidth &&
                (t.lineWidth += 0.001 * (Math.random() - 0.5)),
              (t.lineCap = s[3]),
              (t.lineJoin = s[4]),
              (t.miterLimit = s[5]),
              t.setLineDash && t.setLineDash(s[6]),
              (t.lineDashOffset = s[7]),
              c++);
            break;
          case 6:
            (t.stroke(), c++);
            break;
          default:
            c++;
        }
      }
    }
    reverseHitDetectionInstructions() {
      const t = this.hitDetectionInstructions;
      t.reverse();
      let s = -1;
      for (let i = 0, h = t.length; i < h; i++) {
        const h = t[i],
          e = h[0];
        2 === e
          ? (s = i)
          : 1 === e &&
            ((h[2] = i), Ei(this.hitDetectionInstructions, s, i), (s = -1));
      }
    }
    setFillStrokeStyle(t, s) {
      const i = this.state;
      ((i.fillStyle = t ? t.color || "#000" : void 0),
        s
          ? ((i.strokeStyle = s.color || "#000"),
            (i.lineCap = s.lineCap || "round"),
            (i.lineDash = (s.lineDash || []).slice()),
            (i.lineDashOffset = s.lineDashOffset || 0),
            (i.lineJoin = s.lineJoin || "round"),
            (i.lineWidth = Bs(s.width, 1)),
            (i.miterLimit = Bs(s.miterLimit, 10)),
            i.lineWidth > this.maxLineWidth &&
              ((this.maxLineWidth = i.lineWidth),
              (this.bufferedMaxExtent = null)))
          : ((i.strokeStyle = void 0),
            (i.lineCap = void 0),
            (i.lineDash = null),
            (i.lineDashOffset = void 0),
            (i.lineJoin = void 0),
            (i.lineWidth = void 0),
            (i.miterLimit = void 0)));
    }
    applyStroke(t) {
      const s = this.pixelRatio;
      this.instructions.push([
        8,
        t.strokeStyle,
        t.lineWidth * s,
        t.lineCap,
        t.lineJoin,
        t.miterLimit,
        1 === s ? t.lineDash : t.lineDash.map((t) => t * s),
        t.lineDashOffset * s,
      ]);
    }
    endGeometry(t, s) {
      ((this.beginGeometryInstruction1[2] = this.instructions.length),
        (this.beginGeometryInstruction1 = null),
        (this.beginGeometryInstruction2[2] =
          this.hitDetectionInstructions.length),
        (this.beginGeometryInstruction2 = null));
      const i = [2, s];
      (this.instructions.push(i), this.hitDetectionInstructions.push(i));
    }
    getBufferedMaxExtent() {
      if (
        !this.bufferedMaxExtent &&
        ((this.bufferedMaxExtent = vt(this.maxExtent)), this.maxLineWidth > 0)
      ) {
        const t = (this.resolution * (this.maxLineWidth + 1)) / 2;
        wt(this.bufferedMaxExtent, t, this.bufferedMaxExtent);
      }
      return this.bufferedMaxExtent;
    }
  }
  const bl = "Image",
    Al = "LineString",
    Tl = "Polygon",
    xl = [Tl, Al, bl, "Default"],
    El = {
      Default: Ml,
      Image: class extends Ml {
        constructor(t, s, i, h) {
          (super(t, s, i, h, !0),
            (this.hitDetectionImage = null),
            (this.image = null),
            (this.anchorX = void 0),
            (this.anchorY = void 0),
            (this.height = void 0),
            (this.opacity = void 0),
            (this.originX = void 0),
            (this.originY = void 0),
            (this.scale = void 0),
            (this.width = void 0));
        }
        drawCoordinates(t, s, i, h) {
          return this.appendFlatCoordinates(t, s, i, h, !1, !1);
        }
        drawPoint(t, s) {
          if (!this.image) return;
          this.beginGeometry(t, s);
          const i = t.getFlatCoordinates(),
            h = t.getStride(),
            e = this.coordinates.length,
            n = this.drawCoordinates(i, 0, i.length, h);
          (this.instructions.push([
            0,
            e,
            n,
            this.image,
            this.anchorX,
            this.anchorY,
            null,
            this.height,
            this.opacity,
            this.originX,
            this.originY,
            !1,
            0,
            this.scale * this.pixelRatio,
            this.width,
          ]),
            this.hitDetectionInstructions.push([
              0,
              e,
              n,
              this.hitDetectionImage,
              this.anchorX,
              this.anchorY,
              null,
              this.height,
              this.opacity,
              this.originX,
              this.originY,
              !1,
              0,
              this.scale,
              this.width,
            ]),
            this.endGeometry(t, s));
        }
        finish() {
          (this.reverseHitDetectionInstructions(),
            (this.anchorX = void 0),
            (this.anchorY = void 0),
            (this.hitDetectionImage = null),
            (this.image = null),
            (this.height = void 0),
            (this.scale = void 0),
            (this.opacity = void 0),
            (this.originX = void 0),
            (this.originY = void 0),
            (this.width = void 0));
        }
        setImageStyle(t) {
          const s = t.getAnchor(),
            i = t.getSize(),
            h = t.getHitDetectionImage(1),
            e = t.getImage(1),
            n = t.getOrigin();
          ((this.anchorX = s[0]),
            (this.anchorY = s[1]),
            (this.hitDetectionImage = h),
            (this.image = e),
            (this.height = i[1]),
            (this.opacity = t.opacity),
            (this.originX = n[0]),
            (this.originY = n[1]),
            (this.scale = t.scale),
            (this.width = i[0]));
        }
      },
      LineString: class extends Ml {
        drawFlatCoordinates(t, s, i, h) {
          const e = [
            9,
            this.coordinates.length,
            this.appendFlatCoordinates(t, s, i, h, !1, !1),
          ];
          return (
            this.instructions.push(e),
            this.hitDetectionInstructions.push(e),
            i
          );
        }
        drawLineString(t, s) {
          const i = this.state;
          if (void 0 === i.strokeStyle || void 0 === i.lineWidth) return;
          (this.applyStroke(i),
            this.beginGeometry(t, s),
            this.hitDetectionInstructions.push(
              [
                8,
                i.strokeStyle,
                i.lineWidth,
                i.lineCap,
                i.lineJoin,
                i.miterLimit,
                i.lineDash,
                i.lineDashOffset,
              ],
              gl
            ));
          const h = t.getFlatCoordinates();
          (this.drawFlatCoordinates(h, 0, h.length, t.getStride()),
            this.hitDetectionInstructions.push(pl),
            this.endGeometry(t, s));
        }
        drawMultiLineString(t, s) {
          const i = this.state;
          if (void 0 === i.strokeStyle || void 0 === i.lineWidth) return;
          (this.applyStroke(i),
            this.beginGeometry(t, s),
            this.hitDetectionInstructions.push(
              [
                8,
                i.strokeStyle,
                i.lineWidth,
                i.lineCap,
                i.lineJoin,
                i.miterLimit,
                i.lineDash,
                i.lineDashOffset,
              ],
              gl
            ));
          const h = t.getEnds(),
            e = t.getFlatCoordinates(),
            n = t.getStride();
          let r = 0;
          for (let t = 0, s = h.length; t < s; t++)
            r = this.drawFlatCoordinates(e, r, h[t], n);
          (this.hitDetectionInstructions.push(pl), this.endGeometry(t, s));
        }
        finish() {
          const t = this.state;
          (void 0 !== t.lastStroke &&
            t.lastStroke !== this.coordinates.length &&
            this.instructions.push(pl),
            this.reverseHitDetectionInstructions(),
            (this.state = null));
        }
        applyStroke(t) {
          (void 0 !== t.lastStroke &&
            t.lastStroke !== this.coordinates.length &&
            this.instructions.push(pl),
            (t.lastStroke = 0),
            super.applyStroke(t),
            this.instructions.push(gl));
        }
      },
      Polygon: class extends Ml {
        drawFlatCoordinatess(t, s, i, h) {
          const e = this.state,
            n = void 0 !== e.fillStyle,
            r = void 0 !== e.strokeStyle;
          (this.instructions.push(gl), this.hitDetectionInstructions.push(gl));
          for (let e = 0, n = i.length; e < n; e++) {
            const n = i[e],
              o = [
                9,
                this.coordinates.length,
                this.appendFlatCoordinates(t, s, n, h, !0, !r),
              ];
            (this.instructions.push(o),
              this.hitDetectionInstructions.push(o),
              r &&
                (this.instructions.push(wl),
                this.hitDetectionInstructions.push(wl)),
              (s = n));
          }
          return (
            n &&
              (this.instructions.push(ml),
              this.hitDetectionInstructions.push(ml)),
            r &&
              (this.instructions.push(pl),
              this.hitDetectionInstructions.push(pl)),
            s
          );
        }
        drawPolygon(t, s) {
          const i = this.state;
          (void 0 === i.fillStyle && void 0 === i.strokeStyle) ||
            (this.setFillStrokeStyles(),
            this.beginGeometry(t, s),
            void 0 !== i.fillStyle &&
              this.hitDetectionInstructions.push([7, "#000"]),
            void 0 !== i.strokeStyle &&
              this.hitDetectionInstructions.push([
                8,
                i.strokeStyle,
                i.lineWidth,
                i.lineCap,
                i.lineJoin,
                i.miterLimit,
                i.lineDash,
                i.lineDashOffset,
              ]),
            this.drawFlatCoordinatess(
              t.getOrientedFlatCoordinates(),
              0,
              t.getEnds(),
              t.getStride()
            ),
            this.endGeometry(t, s));
        }
        finish() {
          (this.reverseHitDetectionInstructions(), (this.state = null));
          const t = this.tolerance;
          if (0 !== t) {
            const s = this.coordinates;
            for (let i = 0, h = s.length; i < h; i++) s[i] = Xa(s[i], t);
          }
        }
        setFillStrokeStyles() {
          const t = this.state;
          if (void 0 !== t.fillStyle) {
            const s = t.fillStyle;
            ("string" == typeof s && t.currentFillStyle === s) ||
              (void 0 !== s && this.instructions.push([7, s]),
              (t.currentFillStyle = s));
          }
          void 0 !== t.strokeStyle && this.applyStroke(t);
        }
      },
    };
  let Dl = null;
  class Il {
    constructor(t, s, i, h, e) {
      ((this.tolerance = t),
        (this.maxExtent = s),
        (this.pixelRatio = h),
        (this.resolution = i),
        (this.renderBuffer = e),
        (this.renderers = {}),
        (this.hitDetectionTransform = [1, 0, 0, 1, 0, 0]));
    }
    clip(t, s) {
      const i = this.getClipCoords(s);
      (t.beginPath(),
        t.moveTo(i[0], i[1]),
        t.lineTo(i[2], i[3]),
        t.lineTo(i[4], i[5]),
        t.lineTo(i[6], i[7]),
        t.clip());
    }
    finish() {
      for (let t in this.renderers) {
        const s = this.renderers[t];
        for (let t in s) s[t].finish();
      }
    }
    forEachFeatureAtCoordinate(t, s, i, h) {
      const e = Kh.touch ? 16 : 12,
        n = 2 * e + 1,
        r = qr(
          this.hitDetectionTransform,
          e + 0.5,
          e + 0.5,
          1 / s,
          -1 / s,
          -t[0],
          -t[1]
        );
      let o;
      (Dl || (Dl = Dr(n, n, !0)),
        Dl.canvas.width !== n || Dl.canvas.height !== n
          ? ((Dl.canvas.width = n), (Dl.canvas.height = n))
          : Dl.clearRect(0, 0, n, n),
        void 0 !== this.renderBuffer &&
          ((o = [1 / 0, 1 / 0, -1 / 0, -1 / 0]),
          ((t, s) => {
            (s[0] < t[0] && (t[0] = s[0]),
              s[0] > t[2] && (t[2] = s[0]),
              s[1] < t[1] && (t[1] = s[1]),
              s[1] > t[3] && (t[3] = s[1]));
          })(o, t),
          wt(o, s * (this.renderBuffer + e), o)));
      const a = kl(e),
        c = (t) => {
          if (t.ignore) return void Dl.clearRect(0, 0, n, n);
          if (t.preciseTolerance) {
            if (Dl.getImageData(n / 2 - 0.5, n / 2 - 0.5, 1, 1).data[3] > 0) {
              const s = h(t);
              if (s) return s;
              Dl.clearRect(0, 0, n, n);
            }
            return;
          }
          const s = Dl.getImageData(0, 0, n, n).data;
          for (let i = 0; i < n; i++)
            for (let e = 0; e < n; e++)
              if (a[i][e] && s[4 * (e * n + i) + 3] > 0)
                return h(t) || void Dl.clearRect(0, 0, n, n);
        },
        l = Object.keys(this.renderers).map(Number);
      let u;
      l.sort(Ti);
      for (let t = l.length; t--; ) {
        const s = l[t].toString(),
          h = this.renderers[s];
        for (let t = xl.length; t--; ) {
          u = xl[t];
          const s = h[u];
          if (void 0 !== s) {
            const t = s.renderHitDetection(Dl, r, i, c, o);
            if (t) return t;
          }
        }
      }
    }
    getClipCoords(t) {
      const s = this.maxExtent,
        i = s[0],
        h = s[1],
        e = s[2],
        n = s[3],
        r = [i, h, i, n, e, n, e, h];
      return (rc(r, 0, 8, 2, t, r), r);
    }
    getRenderer(t, s) {
      const i = void 0 !== t ? t.toString() : "0";
      let h = this.renderers[i];
      void 0 === h && ((h = {}), (this.renderers[i] = h));
      let e = h[s];
      return (
        void 0 === e &&
          ((e = new (0, El[s])(
            this.tolerance,
            this.maxExtent,
            this.resolution,
            this.pixelRatio
          )),
          (h[s] = e)),
        e
      );
    }
    isEmpty() {
      return Hs(this.renderers);
    }
    render(t, s, i, h, e) {
      const n = Object.keys(this.renderers).map(Number);
      (n.sort(Ti), t.save(), this.clip(t, s));
      const r = e || xl;
      for (let e = 0, o = n.length; e < o; e++) {
        const o = n[e].toString(),
          a = this.renderers[o];
        for (let e = 0, n = r.length; e < n; e++) {
          const n = a[r[e]];
          void 0 !== n && n.render(t, s, i, h);
        }
      }
      t.restore();
    }
  }
  const Sl = {
      0: [[!0]],
    },
    Rl = (t, s, i) => {
      let h;
      const e = Math.floor(t.length / 2);
      if (s >= e) for (h = e; h < s; h++) t[h][i] = !0;
      else if (s < e) for (h = s + 1; h < e; h++) t[h][i] = !0;
    },
    kl = (t) => {
      if (void 0 !== Sl[t]) return Sl[t];
      const s = 2 * t + 1,
        i = new Array(s);
      for (let t = 0; t < s; t++) i[t] = new Array(s);
      let h = t,
        e = 0,
        n = 0;
      for (; h >= e; )
        (Rl(i, t + h, t + e),
          Rl(i, t + e, t + h),
          Rl(i, t - e, t + h),
          Rl(i, t - h, t + e),
          Rl(i, t - h, t - e),
          Rl(i, t - e, t - h),
          Rl(i, t + e, t - h),
          Rl(i, t + h, t - e),
          e++,
          (n += 1 + 2 * e),
          2 * (n - h) + 1 > 0 && ((h -= 1), (n += 1 - 2 * h)));
      return ((Sl[t] = i), i);
    };
  class Ll extends Qr {
    constructor(t, s, i, h, e) {
      (super(),
        (this.hitDetectionImage = null),
        (this.image = t || new Image()),
        null !== h && (this.image.crossOrigin = h),
        (this.imageListenerKeys = null),
        (this.imageState = e),
        (this.size = i),
        (this.url = s));
    }
    dispatchChangeEvent() {
      this.dispatchEvent(new Kr(t));
    }
    handleImageError() {
      ((this.imageState = 3), this.unlistenImage(), this.dispatchChangeEvent());
    }
    handleImageLoad() {
      ((this.imageState = 2),
        this.size &&
          ((this.image.width = this.size[0]),
          (this.image.height = this.size[1])),
        (this.size = [this.image.width, this.image.height]),
        this.unlistenImage(),
        this.dispatchChangeEvent());
    }
    getImage(t) {
      return this.image;
    }
    getImageState() {
      return this.imageState;
    }
    getHitDetectionImage(t) {
      return (
        this.hitDetectionImage || (this.hitDetectionImage = this.image),
        this.hitDetectionImage
      );
    }
    getSize() {
      return this.size;
    }
    load() {
      if (0 === this.imageState) {
        ((this.imageState = 1),
          (this.imageListenerKeys = [
            jr(this.image, a, this.handleImageError, this),
            jr(this.image, v, this.handleImageLoad, this),
          ]));
        try {
          this.image.src = this.url;
        } catch (t) {
          this.handleImageError();
        }
      }
    }
    unlistenImage() {
      (this.imageListenerKeys.forEach(Br), (this.imageListenerKeys = null));
    }
  }
  class Nl {
    constructor(t) {
      ((this.layer = t), (this.transform = [1, 0, 0, 1, 0, 0]));
    }
    renderIfReadyAndVisible() {
      this.layer.getVisible() &&
        this.layer.getSourceState() === jo &&
        this.layer.changed();
    }
    clip(t, s, i) {
      const h = s.pixelRatio,
        e = Lt(i),
        n = ((t) => [t[2], t[3]])(i),
        r = ((t) => [t[2], t[1]])(i),
        o = ((t) => [t[0], t[1]])(i);
      (Yr(s.coordinateToPixelTransform, e),
        Yr(s.coordinateToPixelTransform, n),
        Yr(s.coordinateToPixelTransform, r),
        Yr(s.coordinateToPixelTransform, o),
        t.save(),
        t.beginPath(),
        t.moveTo(e[0] * h, e[1] * h),
        t.lineTo(n[0] * h, n[1] * h),
        t.lineTo(r[0] * h, r[1] * h),
        t.lineTo(o[0] * h, o[1] * h),
        t.clip());
    }
    dispatchComposeEvent(t, s, i) {
      this.layer.hasListener(t) &&
        this.layer.dispatchEvent(new ra(t, i, s, this.context));
    }
    forEachFeatureAtCoordinate() {}
    getPixelAtCoordinate() {}
    postCompose(t, s) {
      this.dispatchComposeEvent(ta, t, s);
    }
    preCompose(t, s) {
      this.dispatchComposeEvent(Qo, t, s);
    }
    dispatchRenderEvent(t, s) {
      this.dispatchComposeEvent("render", t, s);
    }
    getTransform(t, s) {
      const i = t.viewState,
        h = t.pixelRatio,
        e = (h * t.size[0]) / 2,
        n = (h * t.size[1]) / 2,
        r = h / i.resolution,
        o = -r,
        a = -i.center[0] + s,
        c = -i.center[1];
      return qr(this.transform, e, n, r, o, a, c);
    }
    disposeInternal() {
      (this.context &&
        (this.context.canvas.width = this.context.canvas.height = 0),
        super.disposeInternal());
    }
  }
  const Ol = (t, s) => parseInt(Vr(t), 10) - parseInt(Vr(s), 10),
    Cl = (t, s) => {
      const i = Fl(t, s);
      return i * i;
    },
    Fl = (t, s) => (0.5 * t) / s,
    Pl = (t, s, i, h, e, n) => {
      let r = !1;
      const o = i && i.image;
      if (o) {
        let t = o.getImageState();
        2 === t || 3 === t
          ? o.unlistenImageChange(e, n)
          : (0 === t && o.load(),
            (t = o.getImageState()),
            o.listenImageChange(e, n),
            (r = !0));
      }
      return (zl(t, s, i, h), r);
    },
    zl = (t, s, i, h) => {
      if (!i) return;
      const e = i.geometryFunction(s);
      if (!e) return;
      const n = e.getSimplifiedGeometry(h);
      (0, Ul[n.getType()])(t, n, i, s);
    },
    Ul = {
      Point: (t, s, i, h) => {
        const e = i.image;
        if (e) {
          if (2 !== e.getImageState()) return;
          const n = t.getRenderer(i.zIndex, bl);
          (n.setImageStyle(e), n.drawPoint(s, h));
        }
      },
      LineString: (t, s, i, h) => {
        const e = i.stroke;
        if (e) {
          const n = t.getRenderer(i.zIndex, Al);
          (n.setFillStrokeStyle(null, e), n.drawLineString(s, h));
        }
      },
      Polygon: (t, s, i, h) => {
        const e = i.fill,
          n = i.stroke;
        if (e || n) {
          const r = t.getRenderer(i.zIndex, Tl);
          (r.setFillStrokeStyle(e, n), r.drawPolygon(s, h));
        }
      },
      MultiLineString: (t, s, i, h) => {
        const e = i.stroke;
        if (e) {
          const n = t.getRenderer(i.zIndex, Al);
          (n.setFillStrokeStyle(null, e), n.drawMultiLineString(s, h));
        }
      },
    };
  class Wl extends Nl {
    constructor(t) {
      (super(t),
        (this.isDirty = !1),
        (this.renderedRevision = -1),
        (this.renderedResolution = NaN),
        (this.renderedExtent = [1 / 0, 1 / 0, -1 / 0, -1 / 0]),
        (this.renderedRenderOrder = null),
        (this.rendererGroup = null),
        (this.context = null));
    }
    composeFrame(t, s, i) {
      (this.preCompose(t, s), this.compose(t, s, i), this.postCompose(t, s));
    }
    compose(t, s, i) {
      const h = s.extent,
        e = i.managed ? s.skippedFeatureUids : {},
        n = this.layer.getSource();
      let r = this.getTransform(s, 0);
      const o = i.extent,
        a = void 0 !== o;
      a && this.clip(t, s, o);
      const c = this.rendererGroup;
      if (c && !c.isEmpty()) {
        const o = 1 !== i.opacity;
        let a;
        o
          ? (this.context || (this.context = Dr()),
            (this.context.canvas.width = t.canvas.width),
            (this.context.canvas.height = t.canvas.height),
            (a = this.context))
          : (a = t);
        const l = a.globalAlpha;
        o || (a.globalAlpha = i.opacity);
        const u = s.viewHints,
          d = !(u.isAnimating || u.isInteracting);
        if ((c.render(a, r, e, d), n.wrapX && !Mt(Gt, h))) {
          let t,
            i = h[0],
            n = 0;
          for (; i < -Ut; )
            (n--,
              (t = Wt * n),
              (r = this.getTransform(s, t)),
              c.render(a, r, e, d),
              (i += Wt));
          for (n = 0, i = h[2]; i > Ut; )
            (n++,
              (t = Wt * n),
              (r = this.getTransform(s, t)),
              c.render(a, r, e, d),
              (i -= Wt));
        }
        if (a !== t && a.canvas)
          if (o) {
            const s = t.globalAlpha;
            t.globalAlpha = i.opacity;
            try {
              t.drawImage(a.canvas, 0, 0);
            } catch (t) {}
            t.globalAlpha = s;
          } else
            try {
              t.drawImage(a.canvas, 0, 0);
            } catch (t) {}
        o || (a.globalAlpha = l);
      }
      a && t.restore();
    }
    prepareFrame(t) {
      const s = this.layer;
      if (
        (!this.isDirty && t.viewHints.isAnimating && !s.updateWhileAnimating) ||
        (t.viewHints.isInteracting && !s.updateWhileInteracting)
      )
        return !0;
      const i = t.extent,
        h = t.viewState.resolution,
        e = s.revision,
        n = s.renderOrder || Ol,
        r = s.getSource(),
        o = wt(i, s.renderBuffer * h);
      if (r.wrapX && !Mt(Gt, i)) {
        const t = Math.max(Nt(o) / 2, Wt);
        ((o[0] = -Ut - t), (o[2] = Ut + t));
      }
      if (
        !this.isDirty &&
        this.renderedResolution === h &&
        this.renderedRevision === e &&
        this.renderedRenderOrder === n &&
        Mt(this.renderedExtent, o)
      )
        return !0;
      ((this.rendererGroup = null), (this.isDirty = !1));
      const a = t.pixelRatio,
        c = new Il(Fl(h, a), o, h, a, s.renderBuffer),
        l = (t) => {
          const i = t.styleFunction || s.styleFunction;
          if (i) {
            const s = i(t, h),
              e = this.renderFeature(t, h, a, s, c);
            this.isDirty = this.isDirty || e;
          }
        },
        u = [];
      (r.forEachFeatureInExtent(o, (t) => {
        u.push(t);
      }),
        u.sort(n));
      for (let t = 0, s = u.length; t < s; t++) l(u[t]);
      return (
        c.finish(),
        (this.renderedResolution = h),
        (this.renderedRevision = e),
        (this.renderedRenderOrder = n),
        (this.renderedExtent = o),
        (this.rendererGroup = c),
        !0
      );
    }
    renderFeature(t, s, i, h, e) {
      if (!h) return !1;
      let n = !1;
      if (Array.isArray(h))
        for (let r = 0, o = h.length; r < o; r++)
          n = Pl(e, t, h[r], Cl(s, i), this.renderIfReadyAndVisible, this) || n;
      else n = Pl(e, t, h, Cl(s, i), this.renderIfReadyAndVisible, this);
      return n;
    }
    forEachFeatureAtCoordinate(t, s, i, h) {
      if (!this.rendererGroup) return;
      const e = s.viewState.resolution,
        n = this.layer,
        r = {};
      return this.rendererGroup.forEachFeatureAtCoordinate(
        t,
        e,
        {},
        (t) => {
          const s = Vr(t);
          if (!(s in r)) return ((r[s] = !0), i.call(h, t, n));
        },
        null
      );
    }
  }
  class Gl extends na {
    constructor(t) {
      void 0 === t && (t = {});
      const s = {
        ...t,
      };
      (delete s.style,
        delete s.renderBuffer,
        delete s.updateWhileAnimating,
        delete s.updateWhileInteracting,
        super(s),
        (this.renderBuffer = Bs(t.renderBuffer, 0)),
        (this.renderOrder = t.renderOrder),
        (this.style = null),
        (this.styleFunction = void 0),
        t.style && this.setStyle(t.style),
        (this.updateWhileAnimating = Bs(t.updateWhileAnimating, !0)),
        (this.updateWhileInteracting = Bs(t.updateWhileInteracting, !0)),
        (this.renderer = new Wl(this)));
    }
    setStyle(t) {
      ((this.style = t),
        (this.styleFunction = null === t ? void 0 : ll(this.style)),
        this.changed());
    }
  }
  const jl = (t, s) => {
    if (!t || !s) return;
    const i = t.getSource(),
      h = i.urls;
    Array.isArray(s)
      ? (h && h[0] === s[0]) || i.setURLs(s)
      : (h && h[0] === s) || i.setURL(s);
  };
  class _l extends eo {
    constructor(t) {
      (void 0 === t && (t = {}),
        super(),
        (this.isLoading = !1),
        (this.state = Bs(t.state, jo)),
        (this.wrapX = Bs(t.wrapX, !1)));
    }
    refresh() {
      this.changed();
    }
  }
  const Bl = "addfeature",
    Zl = "removefeature";
  class Hl extends Kr {
    constructor(t, s) {
      (super(t), (this.feature = s));
    }
  }
  class Yl extends _l {
    constructor(t) {
      let s, i;
      (void 0 === t && (t = {}),
        super({
          state: jo,
          wrapX: Bs(t.wrapX, !0),
        }),
        (this.nullGeometryFeatures = {}),
        (this.idIndex = {}),
        (this.idNoneIndex = {}),
        (this.featureChangeKeys = {}),
        (this.featuresCollection = null),
        Array.isArray(t.features)
          ? (i = t.features)
          : t.features && ((s = t.features), (i = s.array)),
        void 0 === s && (s = new co(i)),
        void 0 !== i && this.addFeaturesInternal(i),
        void 0 !== s && this.bindFeaturesCollection(s));
    }
    addFeature(t) {
      (this.addFeatureInternal(t), this.changed());
    }
    addFeatureInternal(t) {
      const s = Vr(t);
      this.addToIndex(s, t) &&
        (this.setupChangeEvents(s, t),
        t.getGeometry() || (this.nullGeometryFeatures[s] = t),
        this.dispatchEvent(new Hl(Bl, t)));
    }
    setupChangeEvents(s, i) {
      this.featureChangeKeys[s] = [
        Gr(i, t, this.handleFeatureChange, this),
        Gr(i, C, this.handleFeatureChange, this),
      ];
    }
    addToIndex(t, s) {
      let i = !0;
      const h = s.id;
      return (
        void 0 !== h
          ? h.toString() in this.idIndex
            ? (i = !1)
            : (this.idIndex[h.toString()] = s)
          : (this.idNoneIndex[t] = s),
        i
      );
    }
    addFeatures(t) {
      (this.addFeaturesInternal(t), this.changed());
    }
    addFeaturesInternal(t) {
      const s = [];
      for (let i = 0, h = t.length; i < h; i++) {
        const h = t[i],
          e = Vr(h);
        this.addToIndex(e, h) && s.push(h);
      }
      for (let t = 0, i = s.length; t < i; t++) {
        const i = s[t],
          h = Vr(i);
        this.setupChangeEvents(h, i);
        const e = i.getGeometry();
        e ? e.getExtent() : (this.nullGeometryFeatures[h] = i);
      }
      for (let t = 0, i = s.length; t < i; t++)
        this.dispatchEvent(new Hl(Bl, s[t]));
    }
    bindFeaturesCollection(t) {
      let s = !1;
      (Gr(this, Bl, function (i) {
        s || ((s = !0), t.push(i.feature), (s = !1));
      }),
        Gr(this, Zl, function (i) {
          s || ((s = !0), t.remove(i.feature), (s = !1));
        }),
        Gr(
          t,
          ro,
          function (t) {
            s || ((s = !0), this.addFeature(t.element), (s = !1));
          },
          this
        ),
        Gr(
          t,
          oo,
          function (t) {
            s || ((s = !0), this.removeFeature(t.element), (s = !1));
          },
          this
        ),
        (this.featuresCollection = t));
    }
    clear(t) {
      if (t) {
        for (let t in this.featureChangeKeys) {
          const s = this.featureChangeKeys[t];
          s && s.forEach(Br);
        }
        this.featuresCollection ||
          ((this.featureChangeKeys = {}),
          (this.idIndex = {}),
          (this.idNoneIndex = {}));
      }
      (this.featuresCollection && this.featuresCollection.clear(),
        (this.nullGeometryFeatures = {}),
        this.dispatchEvent(new Hl("clear")),
        this.changed());
    }
    forEachFeature(t) {
      this.featuresCollection && this.featuresCollection.forEach(t);
    }
    forEachFeatureInExtent(t, s) {
      this.featuresCollection && this.featuresCollection.forEach(s);
    }
    getFeatures() {
      if (this.featuresCollection) return this.featuresCollection.array;
    }
    getFeatureByID(t) {
      return this.idIndex[t.toString()] || null;
    }
    handleFeatureChange(t) {
      const s = t.target,
        i = Vr(s);
      s.getGeometry()
        ? i in this.nullGeometryFeatures && delete this.nullGeometryFeatures[i]
        : i in this.nullGeometryFeatures || (this.nullGeometryFeatures[i] = s);
      const h = s.id;
      if (void 0 !== h) {
        const t = h.toString();
        i in this.idNoneIndex
          ? (delete this.idNoneIndex[i], (this.idIndex[t] = s))
          : this.idIndex[t] !== s &&
            (this.removeFromIDIndex(s), (this.idIndex[t] = s));
      } else
        i in this.idNoneIndex ||
          (this.removeFromIDIndex(s), (this.idNoneIndex[i] = s));
      (this.changed(), this.dispatchEvent(new Hl("changefeature", s)));
    }
    hasFeature(t) {
      const s = t.id;
      return void 0 !== s ? s in this.idIndex : Vr(t) in this.idNoneIndex;
    }
    removeFeature(t) {
      const s = Vr(t);
      (s in this.nullGeometryFeatures && delete this.nullGeometryFeatures[s],
        this.removeFeatureInternal(t),
        this.changed());
    }
    removeFeatureInternal(t) {
      const s = Vr(t),
        i = this.featureChangeKeys[s];
      i && (i.forEach(Br), delete this.featureChangeKeys[s]);
      const h = t.id;
      (void 0 !== h
        ? delete this.idIndex[h.toString()]
        : delete this.idNoneIndex[s],
        this.dispatchEvent(new Hl(Zl, t)));
    }
    removeFromIDIndex(t) {
      for (let s in this.idIndex)
        if (this.idIndex[s] === t) return (delete this.idIndex[s], !0);
      return !1;
    }
  }
  class ql {
    constructor(t) {
      this.color = Bs(t, null);
    }
  }
  class $l {
    constructor(t) {
      (void 0 === t && (t = {}),
        (this.opacity = Bs(t.opacity, 1)),
        (this.scale = Bs(t.scale, 1)),
        (this.anchor = Bs(t.anchor, [0.5, 0.5])),
        (this.sizedAnchor = null),
        (this.crossOrigin = Bs(t.crossOrigin, null)));
      const s = Bs(t.img, null),
        i = Bs(t.imgSize, null);
      let h = t.url;
      (!s || (void 0 !== h && 0 !== h.length) || (h = s.src || Vr(s)),
        (this.iconImage = new Ll(
          s,
          h,
          i,
          this.crossOrigin,
          void 0 !== t.url ? 0 : 2
        )),
        (this.offset = Bs(t.offset, [0, 0])),
        (this.origin = null),
        (this.size = Bs(t.size, null)));
    }
    getAnchor() {
      if (this.sizedAnchor) return this.sizedAnchor;
      const t = this.getSize();
      return t
        ? ((this.sizedAnchor = [this.anchor[0] * t[0], this.anchor[1] * t[1]]),
          this.sizedAnchor)
        : null;
    }
    setAnchor(t) {
      ((this.anchor = t), (this.sizedAnchor = null));
    }
    getImage(t) {
      return this.iconImage.getImage(t);
    }
    getImageSize() {
      return this.iconImage.getSize();
    }
    getHitDetectionImageSize() {
      return this.getImageSize();
    }
    getImageState() {
      return this.iconImage.getImageState();
    }
    getHitDetectionImage(t) {
      return this.iconImage.getHitDetectionImage(t);
    }
    getOrigin() {
      return (this.origin || (this.origin = this.offset), this.origin);
    }
    getSize() {
      return this.size || this.getImageSize();
    }
    listenImageChange(s, i) {
      return Gr(this.iconImage, t, s, i);
    }
    load() {
      this.iconImage.load();
    }
    unlistenImageChange(s, i) {
      _r(this.iconImage, t, s, i);
    }
  }
  class Vl {
    constructor(t) {
      (void 0 === t && (t = {}),
        (this.color = Bs(t.color, null)),
        (this.lineCap = t.lineCap),
        (this.lineDash = Bs(t.lineDash, null)),
        (this.lineDashOffset = t.lineDashOffset),
        (this.lineJoin = t.lineJoin),
        (this.miterLimit = t.miterLimit),
        (this.width = t.width));
    }
  }
  class Kl extends lo {
    constructor(t, s, i) {
      const h = Xi("div", "dot");
      (Ki(h, Xi("div", "ring")),
        Ki(h, Xi("div", "icon")),
        super({
          childElement: h,
          className: "storm-dot rank-3",
          link: Kn.storms + s + "/",
        }),
        (this.id = s),
        (this.index = i),
        (this.rank = -3),
        (this.element.stormID = s),
        (this.map = t),
        t.addOverlay(this, t.storms));
    }
    updateRank(t, s) {
      const i = this.element;
      (this.rank !== t &&
        (t > 0 ? lh(i, "cyclone") : uh(i, "cyclone"),
        this.coordinate[1] < 0 ? lh(i, "shem") : uh(i, "shem"),
        uh(i, "rank" + this.rank),
        (this.rank = t),
        lh(i, "rank" + t)),
        (this.index = s));
    }
  }
  const Jl = 43200000,
    Xl = 129600000,
    Ql = (t) => (t < 40 ? "low" : t > 60 ? "high" : "medium"),
    tu = {
      "-2": "72f",
      "-1": "0a84ff",
      0: "00f060",
      1: "fc0",
      2: "ff9400",
      3: "ff5900",
      4: "f02",
      5: "f5b",
    },
    su = 1 / 3,
    iu = new ul({
      fill: new ql("#eee"),
    }),
    hu = {
      low: new ul({
        fill: new ql("#" + tu[1]),
      }),
      medium: new ul({
        fill: new ql("#" + tu[3]),
      }),
      high: new ul({
        fill: new ql("#" + tu[4]),
      }),
    },
    eu = new ul({
      stroke: new Vl({
        color: "#808080",
        width: 2,
      }),
      zIndex: 1,
    }),
    nu = new ul({
      stroke: new Vl({
        color: "#222",
        width: 2,
      }),
      zIndex: 1,
    }),
    ru = {};
  class ou extends ji {
    constructor(t, s) {
      super();
      const i = ks(),
        h = i < 400 ? i : i < 1400 ? 400 : 0;
      ((this.layers = {
        tracks: new Gl({
          source: new Yl(),
          extent: Gs.wide,
          maxResolution: t,
          zIndex: 2,
        }),
        ww: new Gl({
          source: new Yl(),
          extent: Gs.wide,
          maxResolution: t,
          opacity: 0.5,
        }),
        cones: new Gl({
          source: new Yl(),
          extent: Gs.wide,
          maxResolution: t,
          updateWhileInteracting: !1,
          opacity: su,
          renderBuffer: h,
          zIndex: 1,
        }),
      }),
        (this.trackSource = this.layers.tracks.getSource()),
        (this.wwSource = this.layers.ww.getSource()),
        (this.coneSource = this.layers.cones.getSource()),
        (this.getResolution = s),
        (this.map = null),
        (this.dateCache = {}),
        (this.loading = {}),
        (this.data = {}),
        (this.trackFeatures = {}),
        (this.wwFeatures = {}),
        (this.coneFeatures = {}),
        (this.lines = {}),
        (this.dateDots = {}),
        (this.selectedID = null),
        (this.selectedIndex = null),
        (this.closestIndex = null));
    }
    get selectedData() {
      return this.data[this.selectedID];
    }
    get extent() {
      const t = this.selectedData;
      if (!t || !Array.isArray(t.track)) return [];
      const s = [];
      Array.isArray(t.cone) && s.push(...t.cone);
      const i = t.track.length;
      let h = 0;
      i > 0 &&
        t.active &&
        !t.invest &&
        !t.disturbance &&
        Yn.time > mh() - Jl &&
        (h = this.St(t.track, new Date(mh() - Xl)));
      for (let e = Math.max(0, Math.min(h, i - 5)); e < i; e++)
        s.push(t.track[e].coordinates);
      return Qt(new vc([s]).getExtent());
    }
    setMap(t) {
      this.map = t;
    }
    loadDates(t, s, i) {
      const h = [];
      let e;
      if (Yn.isHDLayer) {
        h.push(Dh(Yn.layers.hd.date));
        const s = (180 * t[0]) / Ut,
          i = (180 * t[2]) / Ut;
        (s <= -180 && i <= -90 && h.push(Dh(yh(Yn.layers.hd.date))),
          i >= 180 && s >= 90 && h.push(Dh(vh(Yn.layers.hd.date))),
          (e = 24));
      } else {
        const t = i ? new Date(i.getTime()) : Yn.getDate();
        if (!t.getTime()) return;
        (t.setUTCHours(6 * Math.floor(t.getUTCHours() / 6) - 6, 0, 0, 0),
          h.push(t.toISOString().substring(0, 16) + "Z"),
          (e = 12));
      }
      let n = 0,
        r = [];
      const o = (t) => {
        ((r = r.concat(this.dateCache[t])),
          n++,
          n === h.length &&
            (this.dispatchEvent({
              type: v,
            }),
            this.update(r, s)));
      };
      for (let t = 0, i = h.length; t < i; t++) {
        const i = h[t],
          n = i + (e ? "," + e : "");
        !s && this.dateCache[n]
          ? o(n)
          : this.loading[n] ||
            ((this.loading[n] = !0),
            new Xs()
              .load({
                url: gs,
                params: {
                  date: i,
                  to: e,
                },
                validate: ["storms", "disturbances"],
              })
              .then((t) => {
                ((this.dateCache[n] = [...t.storms, ...t.disturbances]),
                  (this.loading[n] = !1),
                  o(n));
              })
              .catch((t) => {
                (Qs.add("stormDates", t.message),
                  (this.loading[n] = !1),
                  this.dispatchEvent({
                    type: v,
                  }));
              }));
      }
    }
    updateSelected(t) {
      const s = this.extent;
      var i, h;
      Array.isArray(s) &&
        s.length > 0 &&
        Array.isArray(t) &&
        t.length > 0 &&
        !(
          Ot((i = s), (h = t)) ||
          Ot([i[0] - Wt, i[1], i[2] - Wt, i[3]], h) ||
          Ot([i[0] + Wt, i[1], i[2] + Wt, i[3]], h)
        ) &&
        this.dispatchEvent({
          type: f,
        });
    }
    update(t, s) {
      if (!Yn.overlays.storms || !t) return;
      const i = t.filter((s, i) => t.indexOf(s) === i),
        h = Object.keys(this.trackFeatures),
        e = h.filter((t) => !i.includes(t)),
        n = s ? i : i.filter((t) => !h.includes(t));
      if (e.length > 0) {
        for (let t = e.length; t--; ) this.remove(e[t], !1);
        this.dispatchEvent({
          type: Q,
        });
      }
      if (n.length > 0) {
        let t = 0;
        const i = () => {
          (t++,
            t === n.length &&
              this.dispatchEvent({
                type: Q,
              }));
        };
        for (let t = n.length; t--; ) this.load(n[t], s, i);
      }
      this.layers.cones.setOpacity(su);
    }
    load(t, s, i) {
      if (!s && this.data[t])
        return (this.add(this.data[t], this.data[t].hash), void (qs(i) && i()));
      const h = {
        id: t,
      };
      (Kh.enLang || (h.lang = Kh.lang),
        new Xs()
          .load({
            url: gs,
            params: h,
            validate: ["id", "track"],
          })
          .then((h) => {
            const e = Tn(h);
            if (s) {
              if (
                this.trackFeatures[t] &&
                this.data[t] &&
                this.data[t].hash === e
              )
                return void (qs(i) && i());
              (this.remove(t, !0), this.Rt());
            }
            ((this.data[t] = h), this.add(h, e), qs(i) && i());
          })
          .catch((t) => {
            (Qs.add("stormTrack", t.message), qs(i) && i());
          }));
    }
    remove(t, s) {
      const i = this.trackFeatures[t];
      if (i) for (let t = i.length; t--; ) this.trackSource.removeFeature(i[t]);
      const h = this.wwFeatures[t];
      if (h) for (let t = h.length; t--; ) this.wwSource.removeFeature(h[t]);
      const e = this.coneFeatures[t];
      if (e) for (let t = e.length; t--; ) this.coneSource.removeFeature(e[t]);
      const n = this.dateDots[t];
      (n && this.map && this.map.removeOverlay(n),
        s ||
          this.selectedID !== t ||
          this.dispatchEvent({
            type: f,
          }),
        delete this.trackFeatures[t],
        delete this.wwFeatures[t],
        delete this.coneFeatures[t],
        delete this.dateDots[t],
        delete this.lines[t]);
    }
    Rt() {
      this.dateCache = {};
    }
    kt() {
      if (Yn.overlays.storms)
        for (let t in this.dateDots)
          this.map.addOverlay(this.dateDots[t], this.map.storms);
    }
    Lt() {
      for (let t in this.dateDots) this.map.removeOverlay(this.dateDots[t]);
    }
    add(t, s) {
      if (!(Yn.overlays.storms && t && t.id && t.track && 0 !== t.track.length))
        return;
      t.hash = s || Tn(t);
      const i = t.id;
      if ((this.data[i] || (this.data[i] = t), this.trackFeatures[i])) return;
      const h = t.disturbance,
        e = t.invest,
        n = t.active,
        r = [],
        o = [],
        a = t.track[t.forecast].rank + (i.charCodeAt(h ? 2 : 1) % 10) / 10 + 3,
        c = this.St(t.track, new Date(mh() - Xl));
      this.lines[i] = [];
      for (let s = 0, u = t.track.length; s < u; s++) {
        const d = t.track[s];
        if (!Array.isArray(d.coordinates) || 1 === u) continue;
        const f = jt(Qt(d.coordinates));
        if ((o.push(f), s > 0)) {
          const l = o[s - 1];
          f[0] - l[0] > Ut ? (l[0] += Wt) : f[0] - l[0] < -Ut && (l[0] -= Wt);
          const u = Array.isArray(d.spline),
            m = u ? Math.sign(d.spline[0][0]) : 0,
            p = new fl({
              stormID: i,
              index: s - 1,
            });
          ((p.id = `line-${s}-${i}`),
            p.setGeometry(
              new lc(u ? d.spline.map((t) => Qt(Bt(t, m))) : [l, f])
            ));
          const g = t.track[s - 1].rank,
            w = new ul({
              stroke: new Vl({
                color: "#" + tu[g],
                width: 2.5,
                lineCap: "round",
              }),
              zIndex: a,
            });
          (p.setStyle(() =>
            (this.selectedID && this.selectedID !== i) ||
            (n && !e && !h && !d.forecast && s < c + 1 && Yn.time > mh() - Jl)
              ? dl
              : w
          ),
            r.push(p),
            this.lines[i].push(p));
        }
        const m = new fl({
          stormID: i,
          index: s,
        });
        ((m.id = `dot-${s}-${i}`), m.setGeometry(new wc(f)));
        const p = t.track[s === t.track.length - 1 ? s : s + 1],
          g =
            ((l = d.rank),
            ru[l]
              ? ru[l]
              : (ru[l] = new $l({
                  url: `${Ui} width=%229%22 height=%229%22 viewBox=%220 0 9 9%22%3e%3ccircle cx=%224.5%22 cy=%224.5%22 r=%224.5%22 fill=%22%23${tu[l]}%22/%3e%3c/svg%3e`,
                  imgSize: [9, 9],
                }))),
          w = new ul({
            image: g,
            zIndex: a,
          });
        (m.setStyle(() =>
          (this.selectedID && this.selectedID !== i) ||
          (n && !e && !h && !p.forecast && s < c && Yn.time > mh() - Jl)
            ? dl
            : ((g.scale = et(
                (Yn.B ? 2445.9849 : 1222.9925) / this.getResolution(),
                1,
                1.25
              )),
              w)
        ),
          r.push(m));
      }
      var l;
      const u = [];
      if (
        (t.watches &&
          (this.Nt(i, u, "#f88", 10, Ge.HURRICANE_WATCH, t.watches.hurricane),
          this.Nt(i, u, "#fc0", 5, Ge.STORM_WATCH, t.watches.storm)),
        t.warnings &&
          (this.Nt(i, u, "#04f", 5, Ge.STORM_WARNING, t.warnings.storm),
          this.Nt(
            i,
            u,
            "#f00",
            10,
            Ge.HURRICANE_WARNING,
            t.warnings.hurricane
          )),
        this.wwSource.addFeatures(u),
        (this.wwFeatures[i] = u),
        this.trackSource.addFeatures(r),
        (this.trackFeatures[i] = r),
        Array.isArray(t.cone))
      ) {
        const s = Math.sign(t.cone[0][0]),
          h = new fl(new vc([t.cone.map((t) => Bt(t, s))]).toWebMercator()),
          e = h.clone();
        ((e.ignore = !0),
          e.setStyle(eu),
          e.setStyle(() =>
            this.selectedID && this.selectedID !== i
              ? dl
              : n &&
                  this.selectedID &&
                  this.selectedID === i &&
                  $s(t.chance7day)
                ? nu
                : eu
          ),
          this.coneSource.addFeature(e));
        const n = !(!t.invest && !t.disturbance);
        ((h.id = `cone-${i}`),
          (h.preciseTolerance = !0),
          h.setStyle(() =>
            this.selectedID && this.selectedID !== i
              ? dl
              : n &&
                  this.selectedID &&
                  this.selectedID === i &&
                  $s(t.chance7day)
                ? hu[Ql(t.chance7day)]
                : iu
          ),
          h.set("name", n ? t.title : t.name),
          h.set("invest", n),
          h.set("stormID", i),
          this.coneSource.addFeature(h),
          (this.coneFeatures[i] = [h, e]));
      }
      t.centroid || (this.dateDots[i] = new Kl(this.map, i, 0));
    }
    Nt(t, s, i, h, e, n) {
      if (!n) return;
      const r = new fl(new uc(n).toWebMercator());
      (r.setStyle(() =>
        this.selectedID && this.selectedID !== t
          ? dl
          : new ul({
              stroke: new Vl({
                color: i,
                width: Math.max(h, (3200 * h) / this.getResolution()),
              }),
            })
      ),
        r.set("ww", e),
        s.push(r));
    }
    St(t, s) {
      const i = s.getTime();
      let h = 1 / 0,
        e = 0;
      for (let s = 0, n = t.length; s < n; s++) {
        const n = t[s];
        if (n) {
          const t = Date.parse(n.date),
            r = Math.abs(t - i);
          r < h && ((h = r), (e = s));
        }
      }
      return e;
    }
    Ot(t, s) {
      const i = s.getTime(),
        h = this.St(t, s),
        e = t[h],
        n = Date.parse(e.date),
        r = Math.sign(i - n),
        o = t[h + r] || e,
        a = Date.parse(o.date);
      if (n === a) return e.coordinates.slice();
      const c = (i - Math.min(n, a)) / Math.abs(n - a),
        l = r < 0 ? e : o,
        u = r < 0 ? o : e,
        d = Math.sign(t[0].coordinates[0]),
        f = (
          Array.isArray(l.spline) && l.spline.length > 1
            ? l.spline
            : [u.coordinates, l.coordinates]
        ).map((t) => Qt(Bt(t, d))),
        m = f.length - 1,
        p = [0];
      let g = 0;
      for (let t = 0; t < m; t++) {
        const s = f[t],
          i = f[t + 1];
        ((g += Math.sqrt(mt(s[0], s[1], i[0], i[1]))), p.push(g));
      }
      for (let t = 0; t < m; t++)
        if (p[t + 1] / g >= c) {
          const s = f[t],
            i = f[t + 1],
            h = p[t] / g,
            e = (c - h) / (p[t + 1] / g - h),
            n = ut(s[0], i[0], e),
            r = ut(s[1], i[1], e);
          return ss([n, r]);
        }
      return e.coordinates.slice();
    }
    Ct(t, s, i) {
      const h = this.dateDots[t],
        e = this.data[t];
      if (!h || !e) return;
      const n = Yn.isHDLayer,
        r = i || Yn.getDate();
      n && r.setUTCHours(Yn.layers.hd.isAM ? 10 : 13, 30, 0, 0);
      let o,
        a = 0,
        c = 1 / 0;
      for (let t = 0, i = e.track.length; t < i; t++) {
        const i = e.track[t],
          h = _t(i.coordinates[0]),
          o = n ? gh(i.date, h) : new Date(i.date);
        if (!isNaN(o.getTime())) {
          n &&
            (s >= 75 || s < -75) &&
            (h >= 25 && s < 25
              ? o.setUTCDate(o.getUTCDate() - 1)
              : h < 25 && s >= 25 && o.setUTCDate(o.getUTCDate() + 1));
          let i = r.getTime() - o.getTime();
          n
            ? ((i = Math.abs(i)), i < c && ((c = i), (a = t)))
            : i >= 0 && i < c && ((c = i), (a = t));
        }
      }
      if (((o = e.track[a]), !o)) return;
      const l = is(s, Qt(n ? o.coordinates.slice() : this.Ot(e.track, r)));
      return (
        h.moveTo(l),
        h.updateRank(o.rank, a),
        this.selectedID === t && (this.closestIndex = a),
        l
      );
    }
  }
  const au = [
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
    ],
    cu = 10;
  let lu = [],
    uu = "",
    du = [];
  const fu = Math.sqrt(3),
    mu = (t, s) => {
      s.push(Fi("ww " + t, Is.storm[t]));
    };
  class pu extends lo {
    constructor() {
      const t = Xi("div", "tooltip");
      (super({
        childElement: t,
        className: "map-tooltip",
        snapToPixel: !0,
      }),
        this.element.setAttribute("role", "tooltip"),
        (this.text = Ki(t, Xi("span", "text"))),
        Ki(t, Xi("span", "anchor")),
        (this.content = ""),
        (this.featureID = null),
        (this.event = null),
        (this.features = null),
        (this.rafID = 0),
        (this.clickID = 0),
        (this.windVector = null));
      const s = Is.direction;
      ((lu = au.map((t) =>
        t
          .replace(/N/g, s.north)
          .replace(/S/g, s.south)
          .replace(/E/g, s.east)
          .replace(/W/g, s.west)
      )),
        (uu =
          " " + Is.punctuation.parenthesis.replace("%s", Is.storm.forecast)));
    }
    get isInfo() {
      return /^info/.test(this.featureID);
    }
    get isGeoDot() {
      return "info geo" === this.featureID;
    }
    showStorm(t, s, i, h, e) {
      if (!h) return;
      const n = h.track[e];
      if (!n) return;
      const r = new Date(n.date);
      if (isNaN(r.getTime())) return;
      (r.setTime(r.getTime() - (Yn.user.isUTCTimeZone ? 0 : Nh(r))),
        (this.event = null),
        (this.features = null));
      const o = Ns(),
        a = h.disturbance,
        c = h.invest || a,
        l = h.active && n.forecast && null === n.pressure && r.getTime() > mh(),
        u = Yn.user.P(mn(n.wind), 5, !0) + (l ? uu : "");
      let d = "",
        f = 0;
      if ("dot-date" === t)
        if (
          ((d = c ? h.title : h.name),
          (f = -38),
          !o && c && ($s(h.chance2day) || $s(h.chance7day)))
        ) {
          const t = h.chance2day;
          $s(t) &&
            ((d += Fi(
              "invest",
              Is.storm.chance.day2.replace("%s", Pi("chance " + Ql(t), Ss(t)))
            )),
            (f -= cu));
          const s = h.chance7day;
          $s(s) &&
            ((d += Fi(
              "invest",
              Is.storm.chance.day7.replace("%s", Pi("chance " + Ql(s), Ss(s)))
            )),
            (f -= cu));
        } else {
          const t = h.chance;
          (!o &&
            c &&
            t &&
            ((d += Fi(
              "invest",
              Is.storm.chance.hours24.replace(
                "%s",
                Pi("chance " + t, Is.storm.chance[t])
              )
            )),
            (f -= cu)),
            a || ((d += Fi("wind", u)), (f -= cu)));
        }
      else {
        const s = l
            ? Is.date.days[r.getUTCDay()]
            : Is.date.months[r.getUTCMonth()],
          i = Yn.user.is24HourTimeFormat
            ? Eh(r)
            : xh(
                r,
                Is.date.midnight,
                Is.date.noon,
                Is.date.am,
                Is.date.pm,
                Kh.lang
              );
        ((d = Ni(
          (l ? "" : r.getUTCDate() + Is.date.dayExtra + " ") +
            s +
            Is.punctuation.comma +
            i
        )),
          (f = "dot-selected" === t ? -38 : -32),
          (d += Fi("wind", u)),
          (f -= cu));
      }
      (o || c || ((d += Fi("extra", n.description)), (f -= cu)),
        this.setHTML(d),
        i > 90 && s[0] < 0 ? (s[0] += Wt) : i < -90 && s[0] > 0 && (s[0] -= Wt),
        this.show(s, f, "storm rank" + n.rank, t));
    }
    showFire(t, s) {
      if (!s) return;
      const i = s.get("data");
      if (!i) return;
      ((this.event = null), (this.features = null));
      let h = i.name;
      if (h) {
        let e = -28,
          n = "";
        const r = i.hectares;
        if ($s(r)) ((n = al(10000 * r, Yn.user.fireAreaUnit, 1)), (e -= cu));
        else {
          const t = i.acres;
          $s(t) && ((n = al(t * Xt, Yn.user.fireAreaUnit, 1)), (e -= cu));
        }
        let o = "";
        const a = Is.fire,
          c = i.control && a.control && a.control[i.control.toLowerCase()];
        if (c) ((o = `${n ? "<br>" : ""}${c}`), (e -= cu));
        else {
          const t = i.contained;
          $s(t) &&
            ((o = `${n ? "<br>" : ""}${Is.punctuation.percent.replace("%s", t)} ${a.contained}`),
            (e -= cu));
        }
        let l = "";
        const u = i.type === Ie.PRESCRIBED_BURN;
        u &&
          -1 !== h.indexOf(Is.fire.prescribedBurn) &&
          ((h = h.replace(Is.fire.prescribedBurn, "").trim()),
          (l = Fi("bold", Is.fire.prescribedBurn)),
          (e -= cu));
        let d = "";
        ((n || o) && (d = Fi("extra", n + o)),
          this.setHTML(h + l + d),
          this.show(
            s.getGeometry().getCoordinates(),
            e - 9 * s.get("scale"),
            "fire" + (u ? " prescribed" : ""),
            t
          ),
          i.id !== Yn.selectedFireID && (Yn.selectedFireID = null));
      }
    }
    showInfo(t, s, i, h, e, n, r, o, a, c) {
      du.length = 0;
      const l =
        !o &&
        a &&
        a.length > 0 &&
        !(
          Yn.isGeocolorLayer &&
          Yn.user.animationStyle === Ye.SMOOTH &&
          Yn.isTimeAnimating
        );
      let u = !1;
      if (r)
        du.push(
          Fi(
            "heat",
            Is.info.heat +
              " " +
              Is.punctuation.parenthesis.replace("%s", Is.info.notLive)
          )
        );
      else if (i)
        n = ((t) => {
          if (!t || t.length < 3) return;
          const s = ((t) => {
            let s = 1 / 0,
              i = -1;
            for (let h = 0, e = Wa.length; h < e; h += 4)
              if (t[3] > 127) {
                const e = Math.hypot(
                  t[0] - Wa[h],
                  t[1] - Wa[h + 1],
                  t[2] - Wa[h + 2]
                );
                if (e < s && ((s = e), (i = h / 4), 0 === s)) return i;
              }
            return s < 25 ? i : -1;
          })(t);
          if (-1 === s) return;
          const i = s >= Ca,
            h = Math.pow((s % Ca) / 511, 1 / 5.5) / fi,
            e = di.min + h * (di.max - di.min);
          return {
            rain: i ? 0 : e,
            snow: i ? e : 0,
          };
        })(i);
      else if (l) {
        const t = {};
        for (let s = a.length; s--; ) {
          const i = a[s].get("ww");
          i && ((t[i] = !0), (u = !0));
        }
        t[Ge.HURRICANE_WARNING]
          ? mu(Ge.HURRICANE_WARNING, du)
          : t[Ge.HURRICANE_WATCH] || t[Ge.STORM_WARNING]
            ? (t[Ge.HURRICANE_WATCH] && mu(Ge.HURRICANE_WATCH, du),
              t[Ge.STORM_WARNING] && mu(Ge.STORM_WARNING, du))
            : t[Ge.STORM_WATCH] && mu(Ge.STORM_WATCH, du);
      }
      if (!u) {
        if (l) {
          const t = [],
            s = [];
          for (let i = a.length; i--; ) {
            const h = a[i],
              e = (h && h.id) || "";
            if (/^cone/.test(e)) {
              const i = h.get("name");
              h.get("invest") ? s.push(i) : t.push(i);
            }
          }
          (t.length > 0 &&
            du.push(
              Fi("bold", t.join(Is.punctuation.comma)),
              Fi("cone", Is.storm.cone)
            ),
            s.length > 0 &&
              du.push(
                Fi("bold", s.join(Is.punctuation.comma)),
                Fi("cone", Is.storm.investArea)
              ));
        }
        if (void 0 !== n) {
          const t = i ? Re.RADAR : Yn.layer,
            s = Fe[t];
          switch (t) {
            case Re.RADAR:
              let t, i, h;
              const r = n.snow > n.rain;
              (r
                ? ((d = n.snow),
                  (t = Math.sqrt(10 ** (d / 10) / 75)),
                  (i = je(t, 0.025)),
                  (h = i ? n.snow : 0))
                : ((t = ((t) => (10 ** (t / 10) / 200) ** 0.625)(n.rain)),
                  (i = _e(t, !0, 0.006)),
                  (h = i ? n.rain : 0),
                  i === Te.HAIL &&
                    Yn.user.precipitationUnit !== tn.DBZ &&
                    (t /= 10)),
                h &&
                  (i &&
                    du.push(
                      Fi(Oi(i), Pi("condition-icon") + Is.info.condition[i])
                    ),
                  du.push(Fi(Oi(i), Ce(h, s, !0) + Yn.user.I(t, r, !0)))));
              break;
            case Re.PRECIPITATION:
              let o, a, l;
              const [u, f] = ss(c),
                m = Yn.sun.isNight(u, f),
                p = n.snow > n.rain;
              (p
                ? ((o = je(n.snow, 0.06)), (a = s[2]), (l = o ? n.snow : 0))
                : ((o = _e(
                    n.rain,
                    !1,
                    0.06,
                    Yn.overlays.clouds ? n.cloud : 100,
                    m
                  )),
                  (a = s[1]),
                  (l = o ? n.rain : 0)),
                !o && Yn.overlays.clouds && (o = Be(n.cloud, m)),
                o &&
                  du.push(
                    Fi(Oi(o), Pi("condition-icon") + Is.info.condition[o])
                  ),
                (l || (!o && !Yn.overlays.clouds)) &&
                  (0 === l
                    ? ((o = "none"),
                      du.push(Fi(o, Is.info.condition.noPrecipitation)))
                    : du.push(Fi(Oi(o), Ce(l, a, !0) + Yn.user.I(l, p, !0)))));
              break;
            case Re.WIND_SPEED:
              e = n;
              break;
            case Re.WIND_GUSTS:
              (((e = e || {}).speed = n),
                !e.direction &&
                  Yn.overlays.windAnimation &&
                  this.windVector &&
                  this.windVector.direction &&
                  (e.direction = this.windVector.direction));
              break;
            case Re.TEMPERATURE:
              du.push(Fi("", Ce(n, s) + Yn.user.L(n, !0)));
              break;
            case Re.TEMPERATURE_FEEL:
              du.push(
                Fi(
                  "",
                  Is.info.feelsLike.replace("%s", Ce(n, s) + Yn.user.L(n, !0))
                )
              );
              break;
            case Re.TEMPERATURE_WET_BULB:
              const g = ((t) => {
                if (!$s(t)) return;
                const s = Is.info.wetBulb;
                return t < 23.5
                  ? s.none
                  : t < 25.5
                    ? s.slight
                    : t < 27.5
                      ? s.moderate
                      : t < 29.5
                        ? s.strong
                        : t < 31.5
                          ? s.veryStrong
                          : t < 34.5
                            ? s.extreme
                            : s.lethal;
              })(n);
              du.push(
                Fi("", Ce(n, s) + Yn.user.L(n, !0) + (g ? Pi("extra", g) : ""))
              );
              break;
            case Re.HUMIDITY:
              du.push(Fi("", Ss(n)));
              break;
            case Re.DEW_POINT:
              const w = ((t) => {
                if (!$s(t)) return;
                const s = Is.info.dewPoint,
                  i = Math.round(dt(t));
                return i < 11
                  ? s.extremelyDry
                  : i < 41
                    ? s.veryDry
                    : i < 55
                      ? s.dry
                      : i < 61
                        ? s.slightlyHumid
                        : i < 71
                          ? s.humid
                          : i < 76
                            ? s.veryHumid
                            : s.extremelyHumid;
              })(n);
              du.push(
                Fi("", Ce(n, s) + Yn.user.L(n, !0) + (w ? Pi("extra", w) : ""))
              );
              break;
            case Re.PRESSURE:
              const v = Math.round(n),
                y = v > 1014 ? "high" : v < 1012 ? "low" : "mean";
              du.push(
                Fi(
                  "",
                  Ce(n, s) +
                    Yn.user.R(n, !0) +
                    Pi("pressure " + y, Is.info.pressure[y])
                )
              );
          }
        } else if (!i && !r && !o && t && t.length > 0 && 2 === c.length) {
          const [s, i] = ss(c);
          if (Yn.sun.computeAlt(s, i) < 9) {
            const s = t[0] / 255,
              i = t[1] / 255,
              h = t[2] / 255,
              e = rt(ct(Math.atan2((i - h) * fu, 2 * s - i - h)));
            if (e > 209 && e < 217)
              du.push(Fi("fog", Pi("condition-icon") + Is.info.condition.fog));
            else {
              const t = (s + i + h) / 3;
              ((t > 0.25 && e > 26 && e < 42) ||
                (t > 0.4 && ((e > 20 && e < 42) || e > 320))) &&
                du.push(
                  Fi(
                    "city-lights",
                    Is.info.cityLights +
                      " " +
                      Is.punctuation.parenthesis.replace("%s", Is.info.notLive)
                  )
                );
            }
          }
        }
      }
      var d;
      if (
        void 0 !== h &&
        0 === du.length &&
        ((o && h) ||
          du.push(
            Fi(
              "none",
              h
                ? Is.info.condition.noCoverage
                : Is.info.condition.noPrecipitation
            )
          ),
        !h)
      ) {
        const t = Yn.user.I(0, !1, !0);
        t && du.push(Fi("none", t));
      }
      if (
        (o ||
          !1 !== s ||
          0 !== du.length ||
          du.push(Fi("none", Is.info.noImagery)),
        Yn.overlays.windAnimation || (this.windVector = null),
        !e && this.windVector && (e = this.windVector),
        e)
      ) {
        this.windVector = e;
        let t = Yn.user.P(e.speed, 1, !0);
        const s = /^0 /.test(t);
        if (!s && $s(e.direction)) {
          const s = Yn.user.isWindCompass
            ? lu[Math.round(((e.direction + 360) % 360) / 22.5) % 16]
            : rt(Math.round(e.direction + 180)) + Is.unit.degree;
          t += Pi(
            "wind-direction",
            '<span class="arrow" style="transform:rotate(' +
              e.direction +
              'deg)"></span>' +
              s
          );
        }
        (Yn.user.windUnit !== an.BEAUFORT ||
          Ns() ||
          du.push(Fi("beaufort", Is.info["beaufort" + Li(pn(e.speed))])),
          (s && (Yn.isGeocolorLayer || Yn.isRadarLayer)) || du.push(t));
      }
      if (
        (o && 0 === du.length && du.unshift(Fi("", Is.info.geolocation)),
        du.length > 0)
      ) {
        ((Yn.selectedFireID = null), this.setHTML(du.join("")));
        const t = o ? "info geo" : "info";
        this.show(c, (o ? -36 : -29) - (du.length - 1) * cu, t, t);
      } else
        (Yn.isGeocolorLayer ||
          Yn.isHDLayer ||
          (Yn.isRadarLayer && !Yn.overlays.coverage)) &&
          this.hide();
    }
    setHTML(t) {
      this.content !== t && ((this.content = t), (this.text.innerHTML = t));
    }
    show(t, s, i, h) {
      (this.isGeoDot,
        (this.featureID = h),
        (this.element.children[0].className = "tooltip " + i),
        lh(this.element, j),
        (this.yOffset = s),
        this.updateSize(),
        this.moveTo(t, 0, s));
    }
    hide(t) {
      (!t && Yn.selectedFireID) ||
        (cancelAnimationFrame(this.rafID),
        (this.featureID = null),
        (this.event = null),
        (this.features = null),
        uh(this.element, j));
    }
  }
  const gu = {};
  ((gu[He.SLOW] = 0.2), (gu[He.MEDIUM] = 0.4), (gu[He.FAST] = 0.8));
  const wu = {};
  ((wu[He.SLOW] = 0.075), (wu[He.MEDIUM] = 0.15), (wu[He.FAST] = 0.25));
  const vu = {};
  ((vu[He.SLOW] = 0.25), (vu[He.MEDIUM] = 1), (vu[He.FAST] = 2));
  class yu extends ji {
    constructor() {
      (super(),
        (this.isPlaying = !1),
        (this.isPaused = !1),
        (this.windHour = -1),
        (this.timeoutID = 0),
        (this.time = 0));
    }
    start() {
      if (this.isPlaying) return void this.stop();
      if (
        ((this.minDate = Yn.minDate),
        (this.maxDate = Yn.maxDate),
        !this.minDate || !this.maxDate)
      )
        return;
      ((this.isPlaying = !0),
        (this.isPaused = !1),
        (this.date = Yn.getDate()),
        (this.windHour = -1),
        (this.time = 0));
      const t = ph();
      (t.setUTCHours(t.getUTCHours(), 0, 0, 0), (this.startTime = t.getTime()));
      const s = this.maxDate.getTime(),
        i = Yn.isRadarLayer
          ? mh() - 1800000
          : s - 3600000 * (Yn.isGeocolorLayer ? Yn.user.animationDuration : 6);
      (this.startTime >= i &&
        (this.startTime = Math.max(i, this.minDate.getTime())),
        this.date.getTime() >= s && this.date.setTime(this.startTime),
        this.dispatchEvent({
          type: N,
        }),
        this.animate());
    }
    animate(t) {
      if (
        ((this.minDate = Yn.minDate),
        (this.maxDate = Yn.maxDate),
        !this.isPlaying || !this.minDate || !this.maxDate)
      )
        return;
      const s = t ? et(1000 / (t - this.time), 10, 120) : 60;
      this.time = t || mh();
      let i = !1;
      if (!this.isPaused && (Yn.Z || !Ns())) {
        const t = this.maxDate.getTime();
        if (this.date.getTime() < t) {
          let t = Yn.user.animationSpeed;
          t !== He.FAST || Yn.j || (t = He.MEDIUM);
          const i = Yn.isGeocolorLayer
            ? gu[t] / (Yn.overlays.radar ? 1.2 : 1)
            : Yn.isRadarLayer
              ? wu[t]
              : vu[t];
          this.date.setTime(this.date.getTime() + (3600000 / s) * i);
        } else (this.date.setTime(t), (i = !0));
        let h = !1;
        const e = new Date(this.date.getTime() + 1800000).getUTCHours();
        (this.windHour !== e && ((this.windHour = e), (h = !0)),
          this.dispatchEvent({
            type: n,
            date: this.date,
            updateWind: h,
          }));
      }
      i
        ? (this.timeoutID = setTimeout(() => {
            (this.date.setTime(this.startTime),
              this.dispatchEvent({
                type: n,
                date: this.date,
                updateWind: !0,
              }),
              (this.timeoutID = setTimeout(() => {
                this.animate();
              }, 250)));
          }, 1000))
        : requestAnimationFrame((t) => {
            this.animate(t);
          });
    }
    pause() {
      this.isPlaying && (this.isPaused = !0);
    }
    resume() {
      this.isPaused = !1;
    }
    stop() {
      this.isPlaying &&
        (clearTimeout(this.timeoutID),
        (this.isPlaying = !1),
        (this.isPaused = !1),
        this.dispatchEvent({
          type: n,
          date: this.date,
          updateWind: !0,
        }),
        this.dispatchEvent({
          type: B,
        }));
    }
  }
  const Mu = "NOAA/NESDIS/STAR",
    bu = "EUMETSAT",
    Au = "JMA/NOAA/CIRA",
    Tu = "OpenStreetMap",
    xu = {};
  ((xu[ri.GFS] = "NCEP/NWS/GFS"), (xu[ri.ICON] = "DWD/ICON"));
  class Eu extends Qr {
    constructor(t) {
      (super(),
        (this.max = Bs(t, 1024)),
        (this.count = 0),
        (this.entries = {}),
        (this.oldest = null),
        (this.newest = null));
    }
    get canExpire() {
      return this.count > this.max;
    }
    expireTiles(t) {
      for (; this.canExpire; ) {
        const s = this.oldest.value,
          i = s.tileCoord[0].toString();
        if (i in t && t[i].contains(s.tileCoord)) break;
        this.pop().dispose();
      }
    }
    clear() {
      ((this.count = 0),
        (this.entries = {}),
        (this.oldest = null),
        (this.newest = null),
        this.dispatchEvent(new Kr("clear")));
    }
    containsKey(t) {
      return this.entries.hasOwnProperty(t);
    }
    forEach(t, s) {
      let i = this.oldest;
      for (; i; ) (t.call(s, i.value, i.key, this), (i = i.newer));
    }
    get(t) {
      const s = this.entries[t];
      return (
        s === this.newest ||
          (s === this.oldest
            ? ((this.oldest = this.oldest.newer), (this.oldest.older = null))
            : ((s.newer.older = s.older), (s.older.newer = s.newer)),
          (s.newer = null),
          (s.older = this.newest),
          (this.newest.newer = s),
          (this.newest = s)),
        s.value
      );
    }
    remove(t) {
      const s = this.entries[t];
      return (
        s === this.newest
          ? ((this.newest = s.older), this.newest && (this.newest.newer = null))
          : s === this.oldest
            ? ((this.oldest = s.newer),
              this.oldest && (this.oldest.older = null))
            : ((s.newer.older = s.older), (s.older.newer = s.newer)),
        delete this.entries[t],
        this.count--,
        s.value
      );
    }
    pop() {
      const t = this.oldest;
      return (
        delete this.entries[t.key],
        t.newer && (t.newer.older = null),
        (this.oldest = t.newer),
        this.oldest || (this.newest = null),
        this.count--,
        t.value
      );
    }
    replace(t, s) {
      (this.get(t), (this.entries[t].value = s));
    }
    set(t, s) {
      const i = {
        key: t,
        newer: null,
        older: this.newest,
        value: s,
      };
      (this.newest ? (this.newest.newer = i) : (this.oldest = i),
        (this.newest = i),
        (this.entries[t] = i),
        this.count++);
    }
    prune() {
      for (; this.canExpire; ) this.pop();
    }
    pruneBlob() {
      for (; this.canExpire; ) {
        const t = this.pop();
        /^blob:/.test(t) && URL.revokeObjectURL(t);
      }
    }
    pruneTilesZ() {
      if (0 === this.count) return;
      const t = (() => this.newest.key.split("/").map(Number))()[0];
      this.forEach(function (s) {
        s.tileCoord[0] !== t && (this.remove(ua(s.tileCoord)), s.dispose());
      }, this);
    }
  }
  class Du extends Kr {
    constructor(t, s) {
      (super(t), (this.tile = s));
    }
  }
  class Iu extends _l {
    constructor(t) {
      (super({
        state: t.state,
        wrapX: t.wrapX,
      }),
        (this.isOpaque = Bs(t.isOpaque, !0)),
        (this.tilePixelRatio = Bs(t.tilePixelRatio, 1)),
        (this.tileGrid = Bs(t.tileGrid, null)),
        (this.tileCache = new Eu(t.cacheSize)),
        (this.tempSize = [0, 0]),
        (this.key = t.key || ""));
    }
    expireCache(t) {
      this.tileCache.expireTiles(t);
    }
    forEachLoadedTile(t, s, i) {
      const h = this.tileCache;
      let e = !0,
        n = !1;
      for (let r = s.minX; r <= s.maxX; r++)
        for (let o = s.minY; o <= s.maxY; o++) {
          const s = la(t, r, o);
          if (((n = !1), h.containsKey(s))) {
            const t = h.get(s);
            ((n = 2 === t.state), n && (n = !1 !== i(t)));
          }
          n || (e = !1);
        }
      return e;
    }
    getKey() {
      return this.key;
    }
    setKey(t) {
      this.key !== t && ((this.key = t), this.changed());
    }
    getTile(t, s, i, h) {}
    getTilePixelSize() {
      const t = this.tilePixelRatio,
        s = Zr(this.tileGrid.tileSize, this.tempSize);
      return 1 === t
        ? s
        : ((i = s),
          (h = t),
          void 0 === (e = this.tempSize) && (e = [0, 0]),
          (e[0] = (i[0] * h + 0.5) | 0),
          (e[1] = (i[1] * h + 0.5) | 0),
          e);
      var i, h, e;
    }
    getTileCoordForTileURLFunction(t) {
      const s = this.tileGrid;
      return (
        this.wrapX &&
          (t = ((t, s) => {
            const i = t.getTileCoordCenter(s);
            return yt(Gt, i)
              ? s
              : ((i[0] += Wt * Math.ceil((-Ut - i[0]) / Wt)),
                t.getTileCoordForCoordAndZ(i, s[0]));
          })(s, t)),
        ((t, s) => {
          const [i, h, e] = t;
          if (s.minZoom > i || i > s.maxZoom) return !1;
          const n = s.getTileRangeForExtentAndZ(Gt, i);
          return !n || n.containsXY(h, e);
        })(t, s)
          ? t
          : null
      );
    }
    refresh() {
      (this.tileCache.clear(), this.changed());
    }
    useTile(t, s, i) {}
  }
  class Su extends Nl {
    constructor(t) {
      (super(t),
        (this.imageTransform = [1, 0, 0, 1, 0, 0]),
        (this.coordinateToCanvasPixelTransform = [1, 0, 0, 1, 0, 0]));
    }
    composeFrame(t, s, i) {
      (this.preCompose(t, s), this.compose(t, s, i), this.postCompose(t, s));
    }
    compose(t, s, i) {
      const h = this.getImage();
      if (h) {
        const e = i.extent,
          n = void 0 !== e && !Mt(e, s.extent) && Ot(e, s.extent);
        n && this.clip(t, s, e);
        const r = i.opacity;
        let o;
        (1 !== r && ((o = t.globalAlpha), (t.globalAlpha = r)),
          t.setTransform.apply(t, this.imageTransform));
        try {
          t.drawImage(h, 0, 0);
        } catch (t) {}
        (t.setTransform(1, 0, 0, 1, 0, 0),
          1 !== r && (t.globalAlpha = o),
          n && t.restore());
      }
    }
    getPixelAtCoordinate(t, s) {
      const i = this.getImage();
      if (!i) return;
      const h = dr(
        Yr(this.coordinateToCanvasPixelTransform, t.slice()),
        s.viewState.resolution / this.renderedResolution
      );
      return Rr(i, h[0], h[1]);
    }
  }
  class Ru extends Su {
    constructor(t) {
      (super(t),
        (this.context = Dr()),
        this.oversampling,
        (this.renderedExtent = null),
        this.renderedRevision,
        (this.renderedTiles = []),
        (this.hasNewTiles = !1),
        (this.tempExtent = [1 / 0, 1 / 0, -1 / 0, -1 / 0]),
        (this.tempTileRange = new ma()),
        (this.viewResolution = 0));
    }
    isDrawableTile(t) {
      const s = t.state;
      return (
        2 === s || 4 === s || (3 === s && !this.layer.useInterimTilesOnError)
      );
    }
    getTile(t, s, i, h) {
      const e = this.layer;
      let n = e.getSource().getTile(t, s, i, h);
      return (
        3 === n.state &&
          (e.useInterimTilesOnError
            ? e.preload > 0 && (this.hasNewTiles = !0)
            : (n.state = 2)),
        this.isDrawableTile(n) || (n = n.getInterimTile()),
        n
      );
    }
    scheduleExpireCache(t, s) {
      s.tileCache.canExpire &&
        t.postRenderFunctions.push((t, i) => {
          const h = Vr(s);
          h in i.usedTiles && s.expireCache(i.usedTiles[h]);
        });
    }
    updateUsedTiles(t, s, i, h) {
      const e = Vr(s),
        n = i.toString();
      e in t
        ? n in t[e]
          ? t[e][n].extend(h)
          : (t[e][n] = h)
        : ((t[e] = {}), (t[e][n] = h));
    }
    manageTilePyramid(t, s, i, h, e, n, r, o, a) {
      const c = Vr(s);
      c in t.wantedTiles || (t.wantedTiles[c] = {});
      const l = t.wantedTiles[c],
        u = t.tileQueue;
      let d;
      for (let t = i.minZoom; t <= n; t++) {
        d = i.getTileRangeForExtentAndZ(e, t, d);
        const f = i.getResolution(t);
        for (let e = d.minX; e <= d.maxX; e++)
          for (let m = d.minY; m <= d.maxY; m++)
            if (n - t <= r) {
              const n = s.getTile(t, e, m, h);
              (0 === n.state &&
                ((l[n.getKey()] = !0),
                u.isKeyQueued(n.getKey()) ||
                  u.enqueue([n, c, i.getTileCoordCenter(n.tileCoord), f])),
                void 0 !== o && o.call(a, n));
            } else s.useTile(t, e, m);
      }
    }
    prepareFrame(t, s) {
      const i = this.layer,
        h = t.viewHints;
      if (
        (h.isAnimating && !i.updateWhileAnimating) ||
        (h.isInteracting && !i.updateWhileInteracting)
      )
        return !1;
      let e = t.extent;
      if ((void 0 !== s.extent && (e = kt(e, s.extent)), Ct(e))) return !1;
      const n = h.isAnimating || h.isInteracting,
        r = t.pixelRatio,
        o = t.size,
        a = t.viewState,
        c = a.resolution,
        l = a.center,
        u = i.getSource(),
        d = u.revision,
        f = u.tileGrid,
        m = f.getZForResolution(c),
        p = f.getResolution(m),
        g = f.getTileRangeForExtentAndZ(e, m),
        w = f.getTileRangeExtent(m, g),
        v = u.tilePixelRatio;
      let y = Math.round(c / p) || 1;
      const M = {};
      M[m] = {};
      const b = (t, s) =>
          u.forEachLoadedTile(t, s, (s) => {
            (M[t] || (M[t] = {}), (M[t][s.tileCoord.toString()] = s));
          }),
        A = this.tempExtent,
        T = this.tempTileRange;
      this.hasNewTiles = !1;
      for (let t = g.minX; t <= g.maxX; t++)
        for (let s = g.minY; s <= g.maxY; s++) {
          const i = this.getTile(m, t, s, r);
          if (this.isDrawableTile(i)) {
            (Vr(this),
              2 === i.state &&
                ((M[m][i.tileCoord.toString()] = i),
                this.hasNewTiles ||
                  -1 !== this.renderedTiles.indexOf(i) ||
                  (this.hasNewTiles = !0)));
            continue;
          }
          let h = !1;
          const e = f.getTileCoordChildTileRange(i.tileCoord, T);
          (e && (h = b(m + 1, e)),
            h || f.forEachTileCoordParentTileRange(i.tileCoord, b, null, T));
        }
      const x = ((p * r) / v) * y;
      if (
        !(
          this.renderedResolution &&
          n &&
          (c !== this.viewResolution || Date.now() - t.time > 4)
        ) &&
        (this.hasNewTiles ||
          this.oversampling !== y ||
          this.renderedRevision !== d ||
          (this.renderedResolution !== x && !n) ||
          !this.renderedExtent ||
          !Mt(this.renderedExtent, e))
      ) {
        const t = this.context;
        if (t) {
          const s = u.getTilePixelSize(),
            i = Math.round((g.getWidth() * s[0]) / y),
            h = Math.round((g.getHeight() * s[1]) / y),
            e = t.canvas;
          e.width !== i || e.height !== h
            ? ((this.oversampling = y), (e.width = i), (e.height = h))
            : ((this.renderedRevision !== d ||
                (this.renderedExtent && !Et(this.renderedExtent, w))) &&
                t.clearRect(0, 0, i, h),
              (y = this.oversampling));
        }
        this.renderedTiles.length = 0;
        const s = Object.keys(M).map(Number);
        s.sort(Ti);
        const h = v / (p * y),
          e = this.layer.getSource();
        for (let n = 0, r = s.length; n < r; n++) {
          const r = s[n],
            o = u.getTilePixelSize(),
            a = f.getResolution(r) / p,
            c = M[r];
          for (let s in c) {
            const n = c[s],
              r = f.getTileCoordExtent(n.tileCoord, A),
              l = Math.round((r[0] - w[0]) * h),
              u = Math.round((w[3] - r[3]) * h),
              d = (o[0] * a) / y,
              m = (o[1] * a) / y,
              p = n.getImage();
            if (p) {
              e.isOpaque || t.clearRect(l, u, d, m);
              try {
                t.drawImage(p, 0, 0, p.width, p.height, l, u, d, m);
              } catch (t) {}
              i.getInverted() &&
                (Ar(t, "difference"),
                (t.fillStyle = "#fff"),
                t.fillRect(l, u, d, m),
                Ar(t, vr));
            }
            this.renderedTiles.push(n);
          }
        }
        ((this.renderedRevision = d),
          (this.renderedResolution = x),
          (this.renderedExtent = w));
      }
      this.viewResolution = c;
      const E = this.renderedResolution / c,
        D = qr(
          this.imageTransform,
          (r * o[0]) / 2,
          (r * o[1]) / 2,
          E,
          E,
          ((this.renderedExtent[0] - l[0]) / this.renderedResolution) * r,
          ((l[1] - this.renderedExtent[3]) / this.renderedResolution) * r
        );
      return (
        qr(
          this.coordinateToCanvasPixelTransform,
          (r * o[0]) / 2 - D[4],
          (r * o[1]) / 2 - D[5],
          r / c,
          -r / c,
          -l[0],
          -l[1]
        ),
        this.updateUsedTiles(t.usedTiles, u, m, g),
        this.manageTilePyramid(t, u, f, r, e, m, i.preload),
        this.scheduleExpireCache(t, u),
        this.renderedTiles.length > 0
      );
    }
    getImage() {
      const t = this.context;
      return t ? t.canvas : null;
    }
  }
  class ku extends na {
    constructor(t) {
      void 0 === t && (t = {});
      const s = {
        ...t,
      };
      (delete s.preload,
        delete s.useInterimTilesOnError,
        super(s),
        (this.preload = Bs(t.preload, 0)),
        (this.useInterimTilesOnError = Bs(t.useInterimTilesOnError, !1)),
        (this.updateWhileAnimating = Bs(t.updateWhileAnimating, !0)),
        (this.updateWhileInteracting = Bs(t.updateWhileInteracting, !0)),
        (this.renderer = new Ru(this)));
    }
  }
  const Lu = new Eu(12288),
    Nu = (t) => Lu.containsKey(t),
    Ou = (t, s) =>
      !!(t && t.naturalWidth && t.naturalHeight) &&
      (t.noCache ||
        /^blob:/.test(s) ||
        (Nu(s) && Lu.remove(s), Lu.set(s, t), Lu.prune()),
      !0);
  class Cu extends fa {
    constructor(t, s, i, h, e) {
      (super(t, s),
        (this.crossOrigin = h),
        (this.url = i),
        (this.image = new Image()),
        null !== h && (this.image.crossOrigin = h),
        (this.imageListenerKeys = null),
        (this.tileLoadFunction = e));
    }
    disposeInternal() {
      (1 === this.state && (this.unlistenImage(), (this.image = Oa)),
        this.interimTile && this.interimTile.dispose(),
        (this.state = 5),
        super.disposeInternal());
    }
    getImage() {
      return this.image;
    }
    getKey() {
      return this.url;
    }
    handleImageError() {
      (this.unlistenImage(), (this.image = Oa), (this.state = 3));
    }
    handleImageLoad() {
      const t = this.image;
      (Ou(t, this.url) ? (this.state = 2) : (this.state = 4),
        this.unlistenImage(),
        this.changed());
    }
    loadCachedImage(t, s) {
      Nu(t)
        ? (this.unlistenImage(),
          (this.image = Lu.get(t)),
          (this.state = 2),
          s && s())
        : (s && (this.image.onload = s), (this.image.src = t));
    }
    load() {
      (3 === this.state &&
        ((this.image = new Image()),
        null !== this.crossOrigin &&
          (this.image.crossOrigin = this.crossOrigin),
        (this.state = 0)),
        0 === this.state &&
          ((this.state = 1),
          (this.imageListenerKeys = [
            jr(this.image, a, this.handleImageError, this),
            jr(this.image, v, this.handleImageLoad, this),
          ]),
          this.tileLoadFunction(this, this.url)));
    }
    unlistenImage() {
      this.imageListenerKeys &&
        (this.imageListenerKeys.forEach(Br), (this.imageListenerKeys = null));
    }
  }
  class Fu extends Iu {
    constructor(t) {
      (super({
        cacheSize: t.cacheSize,
        isOpaque: t.isOpaque,
        state: t.state,
        tileGrid: t.tileGrid,
        tilePixelRatio: t.tilePixelRatio,
        wrapX: t.wrapX,
        key: t.key,
      }),
        (this.tileLoadFunction = t.tileLoadFunction),
        (this.tileURLFunction = t.tileURLFunction
          ? t.tileURLFunction.bind(this)
          : function () {}),
        (this.hasTileURLFunction = !t.tileURLFunction),
        (this.urls = null),
        t.urls ? this.setURLs(t.urls) : t.url && this.setURL(t.url),
        (this.tileLoadingKeys = {}));
    }
    handleTileChange(t) {
      const s = t.target,
        i = Vr(s),
        h = s.state;
      let e;
      (1 === h
        ? ((this.tileLoadingKeys[i] = !0), (e = "tileloadstart"))
        : i in this.tileLoadingKeys &&
          (delete this.tileLoadingKeys[i],
          (e =
            3 === h
              ? "tileloaderror"
              : 2 === h || 5 === h
                ? "tileloadend"
                : void 0)),
        void 0 !== e && this.dispatchEvent(new Du(e, s)));
    }
    setTileLoadFunction(t) {
      (this.tileCache.clear(), (this.tileLoadFunction = t), this.changed());
    }
    setTileURLFunction(t, s) {
      ((this.tileURLFunction = t),
        this.tileCache.pruneTilesZ(),
        void 0 !== s ? this.setKey(s) : this.changed());
    }
    setURL(t) {
      this.setURLs(
        ((t) => {
          const s = [];
          let i = /\{([a-z])-([a-z])\}/.exec(t);
          if (i) {
            const h = i[1].charCodeAt(0),
              e = i[2].charCodeAt(0);
            for (let n = h; n <= e; ++n)
              s.push(t.replace(i[0], String.fromCharCode(n)));
            return s;
          }
          if (((i = /\{(\d+)-(\d+)\}/.exec(t)), i)) {
            const h = parseInt(i[2], 10);
            for (let e = parseInt(i[1], 10); e <= h; e++)
              s.push(t.replace(i[0], e.toString()));
            return s;
          }
          return (s.push(t), s);
        })(t)
      );
    }
    setURLs(t) {
      if (this.urls && Si(this.urls, t)) return;
      this.urls = t;
      const s = t.join("\n");
      this.hasTileURLFunction
        ? this.setTileURLFunction(
            ((t, s) => {
              const i = t.length,
                h = new Array(i);
              for (let e = 0; e < i; e++) h[e] = da(t[e], s);
              return 1 === h.length
                ? h[0]
                : (t, s) =>
                    t
                      ? h[nt(((t) => (t[1] << t[0]) + t[2])(t), h.length)](t, s)
                      : void 0;
            })(t, this.tileGrid),
            s
          )
        : this.setKey(s);
    }
    useTile(t, s, i) {
      const h = la(t, s, i);
      this.tileCache.containsKey(h) && this.tileCache.get(h);
    }
  }
  const Pu = (t, s) => {
    t.loadCachedImage(s);
  };
  class zu extends Fu {
    constructor(t) {
      (super({
        cacheSize: t.cacheSize,
        isOpaque: t.isOpaque,
        state: t.state,
        tileGrid: t.tileGrid,
        tileLoadFunction: t.tileLoadFunction || Pu,
        tilePixelRatio: t.tilePixelRatio,
        tileURLFunction: t.tileURLFunction,
        url: t.url,
        urls: t.urls,
        wrapX: t.wrapX,
        key: t.key,
      }),
        (this.crossOrigin = Bs(t.crossOrigin, Wi)));
    }
    createTile(s, i, h, e, n) {
      const r = [s, i, h],
        o = this.getTileCoordForTileURLFunction(r),
        a = o ? this.tileURLFunction(o, e) : void 0,
        c = new Cu(
          r,
          void 0 !== a ? 0 : 4,
          void 0 !== a ? a : "",
          this.crossOrigin,
          this.tileLoadFunction
        );
      return ((c.key = n), Gr(c, t, this.handleTileChange, this), c);
    }
    getTile(t, s, i, h) {
      let e = null;
      const n = la(t, s, i),
        r = this.getKey();
      if (this.tileCache.containsKey(n)) {
        if (((e = this.tileCache.get(n)), e.key !== r)) {
          const o = e;
          ((e = this.createTile(t, s, i, h, r)),
            0 === o.state
              ? (e.interimTile = o.interimTile)
              : (e.interimTile = o),
            e.refreshInterimChain(),
            this.tileCache.replace(n, e));
        }
      } else ((e = this.createTile(t, s, i, h, r)), this.tileCache.set(n, e));
      return e;
    }
  }
  const Uu = new Eu(2048);
  class Wu extends zu {
    constructor(t) {
      void 0 === t && (t = {});
      const s =
        t.tileGrid ||
        new wa({
          minZoom: t.minZoom,
          maxZoom: t.maxZoom,
          tileSize: t.tileSize,
        });
      super({
        cacheSize: t.cacheSize,
        crossOrigin: t.crossOrigin,
        isOpaque: t.isOpaque,
        tileGrid: s,
        tileLoadFunction: t.tileLoadFunction,
        tilePixelRatio: t.tilePixelRatio,
        tileURLFunction: t.tileURLFunction,
        url: t.url,
        urls: t.urls,
        wrapX: Bs(t.wrapX, !0),
      });
    }
    getOrder(t, s, i) {
      const h = It(t),
        e = [];
      for (let t = i.minX; t <= i.maxX; t++)
        for (let n = i.minY; n <= i.maxY; n++)
          e.push({
            x: t,
            y: n,
            v: fr(h, this.tileGrid.getTileCoordCenter([s, t, n])),
          });
      return (e.sort((t, s) => t.v - s.v), e);
    }
    getClosest(t) {}
    getURL(t) {}
    preload(t, s, i, h) {
      void 0 === h && (h = 0);
      const e = this.getClosest(i);
      if (!e) return;
      const n = this.tileGrid,
        r = da(this.getURL(e), n),
        o =
          ((a = wt(t, h))[1] < -Ut && (a[1] = -Ut),
          a[3] > Ut && (a[3] = Ut),
          a);
      var a;
      const c = this.getOrder(o, s, n.getTileRangeForExtentAndZ(o, s)),
        l = 2 ** s;
      for (let t = 0, i = c.length; t < i; t++) {
        const { x: i, y: h } = c[t],
          e = r([s, nt(i, l), h]);
        if (!Uu.containsKey(e) && !Nu(e)) {
          const t = new Image();
          ((t.crossOrigin = Wi),
            t.decode && !Kh.safari
              ? ((t.src = e),
                t
                  .decode()
                  .then(() => {
                    Ou(t, e);
                  })
                  .catch((t) => {}))
              : ((t.onload = (s) => {
                  Ou(t, e);
                }),
                (t.src = e)),
            Uu.set(e),
            Uu.prune());
        }
      }
    }
  }
  class Gu extends ku {
    constructor() {
      (super({
        source: new Wu({
          minZoom: 0,
          maxZoom: Yn.zooms.blueMarble,
          cacheSize: Yn._,
          tilePixelRatio: 1,
        }),
        useInterimTilesOnError: !0,
      }),
        this.on(Qo, (t) => {
          Ar(t.context, br);
        }),
        this.on(ta, (t) => {
          (Ar(t.context, vr), Ir(t.context, "rgba(0,0,0,0.1)"));
        }));
    }
    updateSource() {
      const t = ti[Yn.getDate().getUTCMonth()];
      jl(this, `${Ms}static/bluemarble/${t}/{z}/{y}/{x}.jpg`);
    }
  }
  const ju = function (t) {
    return (
      void 0 === t && (t = 1),
      `${Ms}static/fill/${Yn.version.fill}/${t}x/webp/{z}/{y}/{x}.webp`
    );
  };
  class _u extends ku {
    constructor() {
      (super({
        source: new Wu({
          minZoom: 0,
          maxZoom: Yn.zooms.max,
          cacheSize: Yn._,
          isOpaque: !1,
          tilePixelRatio: 1,
          url: ju(1),
        }),
        useInterimTilesOnError: !0,
      }),
        this.on(Qo, (t) => {
          const s = Yn.isHDLayer;
          Ir(
            t.context,
            s ? "#000" : Yn.user.isDarkTheme ? "#283344" : "#1a3c5a"
          );
          const i = t.layerContext;
          i &&
            (Ar(i, "source-in"),
            Ir(i, s ? "#333" : Yn.user.isDarkTheme ? "#141a22" : "#2f6e48"),
            Ar(i, vr));
        }));
    }
  }
  const Bu = new Eu();
  let Zu, Hu;
  class Yu extends Wu {
    constructor(t, s, i) {
      const h = !i && Kh.use2x ? 2 : 1;
      (super({
        minZoom: 0,
        maxZoom: t,
        cacheSize: Yn._,
        isOpaque: i,
        tileSize: ca / h,
        tilePixelRatio: h,
        tileLoadFunction: (t, s) => {
          i ? t.loadCachedImage(s) : this.loadTile(t, s);
        },
      }),
        (this.id = s),
        (this.mixes = {}),
        Zu || ((Zu = xr(ca, ca)), (Hu = Er(Zu, !0))));
    }
    loadTile(t, s) {
      const i = /fill/.test(s),
        h = t.getImage();
      i && (h.noCache = !0);
      const { x: e, size: n } = es(t.tileCoord, !0),
        r = s.replace(RegExp(Ms + "(archive/)?(geocolor/)?"), ""),
        o = /^blob:/.test(s);
      if (o)
        h.onload = () => {
          URL.revokeObjectURL(s);
        };
      else {
        const i = r.replace(/(\/\d{4})\/.+/, "$1"),
          e = this.mixes[i];
        if (e) {
          const n = new Image();
          n.crossOrigin = Wi;
          const r = new Image();
          r.crossOrigin = Wi;
          let o = 0;
          const a = () => {
            if ((o++, !(o < 2) && Hu)) {
              (Ir(Hu, "#000"), (Hu.globalAlpha = 1));
              try {
                (Hu.drawImage(r, 0, 0), (Hu.globalAlpha = e.ratio));
              } catch (t) {}
              try {
                Hu.drawImage(n, 0, 0);
              } catch (t) {}
              ((Hu.globalAlpha = 1),
                Zu.toBlob(
                  (s) => {
                    let i;
                    try {
                      i = URL.createObjectURL(s);
                    } catch (t) {
                      return void (h.src = n.src);
                    }
                    this.loadTile(t, i);
                  },
                  "image/jpeg",
                  0.9
                ));
            }
          };
          return (
            (n.onerror = a),
            (n.onload = a),
            (n.src = s.replace(i, e.before)),
            (r.onerror = a),
            (r.onload = a),
            void (r.src = s.replace(i, e.after))
          );
        }
      }
      if (Bu.containsKey(r)) return void (h.src = Bu.get(r));
      const a = 4 * n;
      let c = Cs[this.id],
        l = 0,
        u = 1;
      switch (this.id) {
        case pt.GOES_WEST:
          e / n < 0.015625 && ((c = -180), (l = 1), (u = 0));
          break;
        case pt.GOES_EAST:
          Yn.user.isMTGEnabled && (c = Cs.goesEastBeta);
          break;
        case pt.MTG_ZERO:
        case pt.MSG_ZERO:
          c -= 2.8125;
          break;
        case pt.HIMAWARI:
          ((c = Cs[pt.MSG_IODC] - Os), (l = 1), (u = 0));
      }
      const d = ((c / 360 + 0.5) * n - e) * ca;
      if (d + a <= 0 || d >= ca) {
        if (i) {
          const i = new Image();
          ((i.crossOrigin = Wi),
            (i.onerror = (i) => {
              ((t.state = 3), (h.src = s));
            }),
            (i.onload = (e) => {
              (Ir(Hu, "#000"),
                (Hu.globalAlpha = 0.2),
                Hu.drawImage(i, 0, 0),
                (Hu.globalAlpha = 1),
                Zu.toBlob(
                  (i) => {
                    try {
                      h.src = URL.createObjectURL(i);
                    } catch (i) {
                      ((t.state = 3), (h.src = s));
                    }
                  },
                  "image/jpeg",
                  1
                ));
            }),
            (i.src = s));
        } else t.loadCachedImage(s);
        return;
      }
      const f = new Image();
      ((f.crossOrigin = Wi),
        (f.onerror = (i) => {
          ((t.state = 3), (h.src = s));
        }),
        (f.onload = (e) => {
          try {
            (Ar(Hu, vr),
              i
                ? (Ir(Hu, "#000"),
                  (Hu.globalAlpha = 0.2),
                  Hu.drawImage(f, 0, 0),
                  (Hu.globalAlpha = 1))
                : Hu.drawImage(f, 0, 0));
            const t = Hu.createLinearGradient(d, 0, d + a, 0);
            (t.addColorStop(l, "rgba(255,255,255,0)"),
              t.addColorStop(u, "rgba(255,255,255,1)"),
              Ar(Hu, "destination-out"),
              Ir(Hu, t),
              Ar(Hu, vr));
          } catch (i) {
            return ((t.state = 3), void (h.src = s));
          }
          Zu.toBlob(
            (e) => {
              try {
                const t = URL.createObjectURL(e);
                (o
                  ? (h.onload = () => {
                      (URL.revokeObjectURL(t), URL.revokeObjectURL(s));
                    })
                  : (Bu.containsKey(r) && Bu.remove(r),
                    i || Bu.set(r, t),
                    Bu.pruneBlob()),
                  (h.src = t));
              } catch (i) {
                ((t.state = 3), (h.src = s));
              }
            },
            "image/webp",
            0.9
          );
        }),
        (f.src = s));
    }
    getClosest(t) {
      const s = Yn.layers.geocolor.times[this.id];
      if (!Array.isArray(s) || 0 === s.length) return;
      t /= 1000;
      let i = s.at(-1),
        h = 1 / 0;
      for (let e = s.length; e--; ) {
        const n = s[e],
          r = Math.abs(n - t);
        r < h && ((h = r), (i = n));
      }
      return new Date(1000 * i);
    }
    getMapZoom(t) {
      return et(
        Math.ceil(t - $t + (Kh.use2x ? 1 : 0)),
        this.tileGrid.minZoom,
        this.tileGrid.maxZoom
      );
    }
    getPath(t) {
      return this.id + "/" + Ih(t);
    }
    getURL(t) {
      return Ms + "geocolor/" + this.getPath(t) + "/{z}/{y}/{x}.jpg";
    }
    preload(t, s, i) {
      const h = this.id === pt.MSG_IODC || this.id === pt.MSG_ZERO ? Nn : Ln;
      super.preload(
        t,
        this.getMapZoom(s),
        Yn.layers.geocolor.date.getTime() + 60000 * h * i
      );
    }
    clearCache() {
      (Lu.clear(), Bu.clear(), this.refresh());
    }
  }
  class qu extends ku {
    constructor(t, s, i) {
      const h = "outer" === i;
      (super({
        source: new Yu(t, i, h),
        extent: s,
        useInterimTilesOnError: !0,
      }),
        (this.id = i),
        (this.tooltipEnabled = !h),
        h && (this.setOpacity(0.2), jl(this, ju())));
    }
    updateSource(t) {
      let s = Yn.layers.geocolor.times[this.id];
      Array.isArray(s) || (s = [0]);
      const i = Yn.layers.geocolor.date.getTime() / 1000;
      let h,
        e = 1 / 0,
        n = 1 / 0,
        r = -1 / 0;
      for (let o = s.length; o--; ) {
        const a = s[o],
          c = a - i,
          l = Math.abs(c);
        (l < e && ((e = l), t && c >= 0 && (n = c), (h = a)),
          t && c <= 0 && c > r && (r = c));
      }
      const o = new Date(1000 * h);
      if (
        isNaN(o.getTime()) ||
        Math.abs(o.getTime() - Yn.layers.geocolor.date.getTime()) > 14400000
      )
        return void (
          s.length > 0 &&
          ((Yn.layers.geocolor.enabled[this.id] = !1), jl(this, ju()))
        );
      Yn.layers.geocolor.enabled[this.id] = !0;
      const a = this.getSource();
      if (t && 0 !== r && 0 !== n && r > -3600 && n < 3600) {
        const t = n / (Math.abs(r) + n),
          s = new Date(1000 * (i + r)),
          h = new Date(1000 * (i + n));
        if (!isNaN(s.getTime()) && !isNaN(h.getTime())) {
          const e = new Date(1000 * i);
          return (
            (a.mixes[a.getPath(e)] = {
              before: a.getPath(s),
              after: a.getPath(h),
              ratio: t,
            }),
            void jl(this, a.getURL(e))
          );
        }
      }
      (t || (a.mixes = {}), jl(this, a.getURL(o)));
    }
  }
  const $u = 32,
    Vu = new Eu();
  class Ku extends ku {
    constructor() {
      const t = Kh.use2x ? 2 : 1;
      (super({
        source: new Wu({
          minZoom: 0,
          maxZoom: Yn.zooms.hd,
          cacheSize: Yn._,
          isOpaque: !1,
          tileSize: ca / t,
          tilePixelRatio: t,
          tileLoadFunction: (t, s) => {
            this.loadTile(t, s);
          },
        }),
        extent: js,
        useInterimTilesOnError: !0,
      }),
        (this.tooltipEnabled = !0),
        (this.loaders = {}));
    }
    cancel() {
      for (let t in this.loaders) this.loaders[t].cancel();
      this.loaders = {};
    }
    initCanvas() {
      if (!this.canvas) {
        ((this.canvas = xr(ca, ca)), (this.context = Er(this.canvas, !0, !0)));
        const t = xr($u, $u);
        this.blackContext = Er(t, !1, !0);
      }
    }
    updateSource() {
      jl(
        this,
        ((t) => [
          t.replace("{}", ""),
          t.replace("{}", "-a"),
          t.replace("{}", "-b"),
          t.replace("{}", "-c"),
        ])(
          `${Es}MODIS_${Yn.layers.hd.isAM ? "Terra" : "Aqua"}_CorrectedReflectance_TrueColor/default/${Dh(Yn.layers.hd.date)}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`
        )
      );
    }
    loadTile(t, s, i) {
      void 0 === i && (i = 0);
      const h = t.getImage(),
        { x: e, y: n, z: r, size: o } = es(t.tileCoord, !1),
        a = new Date(Yn.layers.hd.date.getTime());
      if (0 === i) {
        const t = /\/default\/\d{4}-\d{2}-\d{2}\//;
        if (e < 0) s = s.replace(t, `/default/${Dh(yh(a))}/`);
        else if (e >= o) {
          const i = mh();
          (a.getTime() > i && a.setTime(i),
            (s = s.replace(t, `/default/${Dh(vh(a))}/`)));
        }
      }
      let c;
      if (a.getTime() < Yn.hdMaxDate.getTime()) {
        const t = /\/default\/(\d{4}-\d{2}-\d{2})\//.exec(s);
        t &&
          t[1] &&
          (c = `${Yn.layers.hd.isAM ? "am" : "pm"}/${t[1]}/${r}/${n}/${e}`);
      }
      if (c && Vu.containsKey(c)) return void (h.src = Vu.get(c));
      this.initCanvas();
      const l = new Xs();
      ((this.loaders[s] = l),
        l
          .load({
            url: s,
            responseType: "blob",
            timeout: 12000,
          })
          .then((i) => {
            if ((delete this.loaders[s], i)) {
              let e;
              try {
                e = URL.createObjectURL(i);
              } catch (i) {
                return ((t.state = 3), void (h.src = s));
              }
              this.blackContext && e
                ? this.checkBlack(t, e, c)
                : (c &&
                    (Vu.containsKey(c) && Vu.remove(c),
                    Vu.set(c, e),
                    Vu.pruneBlob()),
                  (h.src = e));
            } else t.state = 3;
          })
          .catch((e) => {
            (delete this.loaders[s],
              4 === i
                ? ((t.state = 3), (h.src = Oa.src))
                : this.loadTile(t, s, i + 1));
          }));
    }
    checkBlack(t, s, i) {
      const h = t.getImage(),
        e = new Image();
      ((e.crossOrigin = Wi),
        (e.onerror = (i) => {
          ((t.state = 3), (h.src = s));
        }),
        (e.onload = () => {
          let n = !1;
          try {
            this.blackContext.drawImage(e, 0, 0, $u, $u);
            const t = this.blackContext.getImageData(0, 0, $u, $u).data;
            for (let s = 1, i = t.length; s < i; s += 4)
              if (t[s] < 6) {
                n = !0;
                break;
              }
          } catch (t) {}
          n
            ? this.threshold(t, s, e, i)
            : (i &&
                (Vu.containsKey(i) && Vu.remove(i),
                Vu.set(i, s),
                Vu.pruneBlob()),
              (h.src = s));
        }),
        (e.src = s));
    }
    threshold(t, s, i, h) {
      const e = t.getImage(),
        n = this.context;
      try {
        n.drawImage(i, 0, 0);
        const t = n.getImageData(0, 0, ca, ca),
          s = t.data;
        for (let t = 0, i = s.length; t < i; t += 4)
          s[t + 1] < 6 && (s[t + 3] = 0);
        n.putImageData(t, 0, 0);
      } catch (i) {
        return ((t.state = 3), void (e.src = s));
      }
      this.canvas.toBlob(
        (i) => {
          try {
            const t = URL.createObjectURL(i);
            (URL.revokeObjectURL(s),
              h &&
                (Vu.containsKey(h) && Vu.remove(h),
                Vu.set(h, t),
                Vu.pruneBlob()),
              (e.src = t));
          } catch (i) {
            ((t.state = 3), (e.src = s));
          }
        },
        "image/webp",
        0.9
      );
    }
  }
  class Ju extends ku {
    constructor() {
      const t = Kh.use2x ? 2 : 1,
        s = `${Ms}static/land/${Yn.version.land}/${t}x/webp/{z}/{y}/{x}.webp`;
      (super({
        source: new Wu({
          minZoom: 0,
          maxZoom: Yn.zooms.max,
          cacheSize: Yn._,
          tilePixelRatio: t,
          url: s,
        }),
        useInterimTilesOnError: !0,
      }),
        this.on(Qo, (t) => {
          Ar(t.context, this.getInverted() ? br : Mr);
        }),
        this.on(ta, (t) => {
          Ar(t.context, vr);
        }),
        this.on(C, (t) => {
          this.getSource().changed();
        }));
    }
  }
  class Xu extends Su {
    constructor(t) {
      (super(t), (this.image = null));
    }
    getImage() {
      return this.image.canvas;
    }
    prepareFrame(t, s) {
      const i = this.layer,
        h = i.getSource(),
        e = t.viewHints,
        n = void 0 === s.extent ? t.extent : kt(t.extent, s.extent),
        r = t.viewState.resolution,
        o = t.pixelRatio;
      let a = !Ct(n);
      (e.isAnimating && (a = a && i.updateWhileAnimating),
        e.isInteracting && (a = a && i.updateWhileInteracting),
        a && (this.image = h.getImage(n, r)));
      const c = this.image;
      if (c) {
        const s = c.resolution,
          i = c.extent,
          h = t.viewState.center,
          e = t.size,
          n = (o * s) / r,
          a = qr(
            this.imageTransform,
            (o * e[0]) / 2,
            (o * e[1]) / 2,
            n,
            n,
            (i[0] - h[0]) / s,
            (h[1] - i[3]) / s
          );
        (qr(
          this.coordinateToCanvasPixelTransform,
          (o * e[0]) / 2 - a[4],
          (o * e[1]) / 2 - a[5],
          o / r,
          -o / r,
          -h[0],
          -h[1]
        ),
          (this.renderedResolution = s * o));
      }
      return !!c;
    }
  }
  class Qu extends na {
    constructor(t) {
      (void 0 === t && (t = {}),
        super(t),
        (this.updateWhileAnimating = Bs(t.updateWhileAnimating, !0)),
        (this.updateWhileInteracting = Bs(t.updateWhileInteracting, !0)),
        (this.renderer = new Xu(this)));
    }
  }
  const td = Math.log(Wt / ca);
  class sd extends _l {
    constructor(t) {
      (super(),
        (this.getCanvas = t),
        (this.image = {}),
        (this.renderedRevision = 0));
    }
    getImage(t, s) {
      return (
        (this.renderedRevision === this.revision &&
          this.image.resolution === s &&
          Mt(this.image.extent, t)) ||
          ((this.image.canvas = this.getCanvas({
            extent: t,
            zoom: (td - Math.log(s)) * Math.LOG2E,
            width: Math.round(Nt(t) / s),
            height: Math.round(Rt(t) / s),
          })),
          (this.image.extent = t),
          (this.image.resolution = s),
          (this.renderedRevision = this.revision)),
        this.image
      );
    }
  }
  const id = (t, s, i) => {
    const h = t.createShader(s);
    if (!h) throw "Compilation error";
    return (t.shaderSource(h, i), t.compileShader(h), h);
  };
  class hd extends Jr {
    constructor(t, s) {
      (super(), (this.gl = t), (this.program = t.createProgram()));
      const i = id(
          t,
          t.VERTEX_SHADER,
          "attribute vec2 aVertex,aCoord;varying vec2 coord;void main(){coord=aCoord;gl_Position=vec4(aVertex*2.0-1.0,0.0,1.0);}"
        ),
        h = id(
          t,
          t.FRAGMENT_SHADER,
          "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nuniform sampler2D texture;varying vec2 coord;" +
            (s || "void main(){gl_FragColor=texture2D(texture,coord);}")
        );
      if (
        (t.attachShader(this.program, i),
        t.attachShader(this.program, h),
        t.linkProgram(this.program),
        t.deleteShader(i),
        t.deleteShader(h),
        t.isContextLost() || t.getProgramParameter(this.program, t.LINK_STATUS))
      )
        ((this.vertex = t.getAttribLocation(this.program, "aVertex")),
          t.enableVertexAttribArray(this.vertex),
          (this.coord = t.getAttribLocation(this.program, "aCoord")),
          t.enableVertexAttribArray(this.coord));
      else {
        let s;
        try {
          s = t.getProgramInfoLog(this.program);
        } catch (t) {}
        Qs.add("webgl", "Link error" + (s ? ": " + s : ""));
      }
    }
    setUniforms(t) {
      this.gl.useProgram(this.program);
      for (let s in t) {
        const i = this.gl.getUniformLocation(this.program, s);
        if (null !== i && -1 !== i) {
          const h = t[s];
          $s(h)
            ? this.gl.uniform1f(i, h)
            : Vs(h)
              ? this.gl.uniform1i(i, h ? 1 : 0)
              : Array.isArray(h) &&
                h.length > 0 &&
                h.length < 5 &&
                this.gl[`uniform${h.length}fv`](i, new Float32Array(h));
        }
      }
    }
    setTextures(t) {
      this.gl.useProgram(this.program);
      for (let s in t)
        this.gl.uniform1i(this.gl.getUniformLocation(this.program, s), t[s]);
    }
    draw() {
      const t = this.gl;
      (t.useProgram(this.program),
        t.bindBuffer(t.ARRAY_BUFFER, t.vertexBuffer),
        t.vertexAttribPointer(this.vertex, 2, t.FLOAT, !1, 0, 0),
        t.bindBuffer(t.ARRAY_BUFFER, t.coordBuffer),
        t.vertexAttribPointer(this.coord, 2, t.FLOAT, !1, 0, 0),
        t.drawArrays(t.TRIANGLE_STRIP, 0, 4));
    }
    disposeInternal() {
      try {
        this.gl.deleteProgram(this.program);
      } catch (t) {}
      this.program = null;
    }
  }
  const ed = function (t, s, i) {
    return (
      void 0 === s && (s = 0),
      void 0 === i && (i = 0),
      new nd(t, s, i, t.RGBA, t.UNSIGNED_BYTE)
    );
  };
  class nd extends Jr {
    constructor(t, s, i, h, e) {
      (super(),
        (this.gl = t),
        (this.format = h),
        (this.type = e),
        (this.id = t.createTexture()),
        this.bind(),
        t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE),
        t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE),
        t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR),
        t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR),
        s &&
          i &&
          t.texImage2D(
            t.TEXTURE_2D,
            0,
            this.format,
            s,
            i,
            0,
            this.format,
            this.type,
            null
          ));
    }
    bind() {
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    }
    bindFramebuffer(t) {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, t);
    }
    upload(t, s) {
      return (
        this.use(s),
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.format,
          this.format,
          this.type,
          t
        ),
        this
      );
    }
    use(t) {
      (void 0 === t && (t = 0),
        this.gl.activeTexture(this.gl.TEXTURE0 + t),
        this.bind());
    }
    startDraw() {
      const t = this.gl;
      (this.bindFramebuffer(t.framebuffer),
        t.framebufferTexture2D(
          t.FRAMEBUFFER,
          t.COLOR_ATTACHMENT0,
          t.TEXTURE_2D,
          this.id,
          0
        ));
    }
    stopDraw() {
      this.bindFramebuffer(null);
    }
    swap(t) {
      let s = t.id;
      ((t.id = this.id), (this.id = s));
      let i = t.format;
      ((t.format = this.format), (this.format = i));
    }
    disposeInternal() {
      try {
        this.gl.deleteTexture(this.id);
      } catch (t) {}
      ((this.id = null), this.bind());
    }
  }
  const rd = (t) => {
    const s = t.createBuffer();
    return (
      t.bindBuffer(t.ARRAY_BUFFER, s),
      t.bufferData(
        t.ARRAY_BUFFER,
        new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]),
        t.STATIC_DRAW
      ),
      s
    );
  };
  class od extends Jr {
    constructor(t, s) {
      (super(), (this.canvas = xr(t, s)));
      const i = {
        depth: !1,
        premultipliedAlpha: !1,
      };
      let h;
      try {
        h =
          this.canvas.getContext("webgl", i) ||
          this.canvas.getContext("experimental-webgl", i);
      } catch (t) {
        h = null;
      }
      h &&
        !h.isContextLost() &&
        ((Yn.$ = !!h.getExtension("OES_standard_derivatives")),
        (this.gl = h),
        (h.framebuffer = h.createFramebuffer()),
        (h.vertexBuffer = rd(h)),
        (h.coordBuffer = rd(h)),
        h.pixelStorei(h.UNPACK_FLIP_Y_WEBGL, !0),
        (this.shader = new hd(h)),
        this.initTextures(t, s));
    }
    initTextures(t, s) {
      const i = this.gl;
      i &&
        (i.viewport(0, 0, t, s),
        (this.texture = ed(i, t, s)),
        (this.swapTexture = ed(i, t, s)),
        (this.texture1 = ed(i, t, s)),
        (this.texture2 = ed(i, t, s)));
    }
    drawTexture(t) {
      const s = this.gl;
      t &&
        s &&
        (t.use(),
        this.texture.startDraw(),
        this.shader.draw(),
        this.texture.stopDraw(),
        Kh.safari && s.getError() === s.INVALID_VALUE && this.loseContext());
    }
    drawShader(t, s) {
      t &&
        this.gl &&
        (this.texture.use(),
        this.swapTexture.startDraw(),
        t.setUniforms(s),
        t.draw(),
        this.swapTexture.stopDraw(),
        this.swapTexture.swap(this.texture));
    }
    update() {
      (this.texture.use(), this.shader.draw());
    }
    resize(t, s) {
      (this.canvas.width === t && this.canvas.height === s) ||
        (this.disposeTextures(),
        (this.canvas.width = t),
        (this.canvas.height = s),
        this.initTextures(t, s));
    }
    loseContext() {
      (this.gl && this.gl.getExtension("WEBGL_lose_context").loseContext(),
        (Yn.overlays.precipitationAnimation = !1),
        (Yn.overlays.isolines = !1),
        (Yn.overlays.windAnimation = !1));
    }
    disposeTextures() {
      (this.texture && this.texture.dispose(),
        this.swapTexture && this.swapTexture.dispose(),
        this.texture1 && this.texture1.dispose(),
        this.texture2 && this.texture2.dispose());
    }
    disposeInternal() {
      (this.disposeTextures(),
        this.shader && this.shader.dispose(),
        (this.canvas.width = 0),
        (this.canvas.height = 0),
        (this.gl = null));
    }
  }
  var ad =
    "uniform vec3 span;uniform vec2 overlap;float index(vec3 c){return c.r*span.r+max(0.,c.g-overlap.x)*span.g+max(0.,c.b-overlap.y)*span.b;}void main(){vec2 p=coord*scale+offset;vec4 c1=texture2D(texture,p),c2=texture2D(texture2,p);float z=sign(c1.a+c2.a),i=mix(index(c2.rgb),index(c1.rgb),ratio);gl_FragColor=vec4(z*texture2D(palette,vec2(i,.5)).rgb,1.);}";
  const cd = {};
  class ld extends hd {
    constructor(t, s) {
      (super(
        t,
        ((t) =>
          rs.i(
            "qJ5cMz9loFOmLJ1joTIlZxDtqTI4qUIlMGVfpTSfMKE0MGg1ozyzo3WgVUMyLmVtp2AuoTHfo2Mzp2I0B3IhnJMipz0tMzkiLKDtpzS0nJ87"
          ) +
          ((t) => {
            switch (t) {
              case Re.RADAR:
              case Re.PRECIPITATION:
                return "uniform vec2 size,center;uniform float fade,clouds,radar,time;float raindrops(vec2 uv){float v=cos(uv.x-mod(uv.x,2.))*.15+.85;return min(1.,.03/fract(uv.y*4e-3+time*v));}float N11(float n){return fract(sin(n*871.213)*3134.422);}float N21(vec2 uv){return N11(N11(uv.x)+uv.y);}float snow(vec2 uv,float t){uv.y+=t*.5;vec2 p=fract(uv*12.),id=floor(uv*12.);p.x+=sin(N21(id)*128.+t)*.4,p.y+=sin(N11(N21(id))*128.+t)*.4;return smoothstep(.04,.02,distance(vec2(.5),p));}float blizzard(vec2 uv){float t=time*.2,s=0.;for(float i=0.;i<=1.;i+=.1){float z=mix(1.,.5,i);vec2 o=vec2(N11(i),N11(N11(i)));s+=snow((uv/600.+o)*z,t);if(s>=1.)break;}return s;}void main(){vec2 p=coord*scale+offset;vec4 c1=texture2D(texture,p),c2=texture2D(texture2,p);float z=sign(c1.a+c2.a);vec3 c=mix(c2.rgb,c1.rgb,ratio);float r=c.r*(1.-radar),g=c.g,b=c.b,m=max(g,b),i=mix(pow(m,PRECIPITATION_POWER),pow(m*RADAR_SCALE,RADAR_POWER),radar);vec3 precip=texture2D(palette,vec2(i+PRECIPITATION_OFFSET,.5+(g-b)*8.)).rgb;vec2 uv=coord*size+center;float rain=0.,snow=0.;if(fade>0.){if(g>.05)rain=fade*min(1.,g*.3*raindrops(uv));if(b>.05)snow=fade*min(1.,b*1.3*blizzard(uv));}float pa=smoothstep(.0,.00025,i),a=min(1.,pa*pa+clouds*r*r*r*r+1.-z);gl_FragColor=vec4(z*mix(vec3(.95),precip+vec3(clouds*r*.025),pa*(1.-rain-snow)),a);}"
                  .replace(/RADAR_SCALE/g, fi)
                  .replace(/RADAR_POWER/g, 5.5)
                  .replace(/PRECIPITATION_POWER/g, "8.")
                  .replace(/PRECIPITATION_OFFSET/g, 0.00275);
              case Re.WIND_SPEED:
                return "vec2 uv(vec2 c){return vec2((c.r-.5)*2.,(c.g-.5)*2.);}void main(){vec2 p=coord*scale+offset;vec4 c1=texture2D(texture,p),c2=texture2D(texture2,p);float z=sign(c1.a+c2.a),i=length(mix(uv(c2.rg),uv(c1.rg),ratio));gl_FragColor=vec4(z * texture2D(palette,vec2(i,.5)).rgb,1.);}";
              case Re.PRESSURE:
                return Yn.$
                  ? "uniform vec3 span;uniform vec2 overlap,size;uniform int isolines;uniform float fullSpan,radius,base,interval;\n#extension GL_OES_standard_derivatives:enable\nfloat l(vec2 a){return exp((a.y*a.y-a.x*a.x)/18.)/56.548668;}vec4 k(sampler2D c,vec2 d,vec2 g){vec2 b;float a=l(b);vec4 e=texture2D(c,d)*a;float f=a;for(int h=0;h<7;h++)for(int i=1;i<7;i++)b=vec2(h,i),a=l(b),e+=texture2D(c,d+g*b)*a,f+=a,e+=texture2D(c,d-g*b)*a,f+=a,b=vec2(-i,h),e+=texture2D(c,d+g*b)*a,f+=a,e+=texture2D(c,d-g*b)*a,f+=a;return e/f;}float j(vec3 a){return a.r*span.r+max(0.,a.g-overlap.x)*span.g+max(0.,a.b-overlap.y)*span.b;}void main(){vec2 p=coord*scale+offset;vec4 c1=texture2D(texture,p),c2=texture2D(texture2,p);float z=sign(c1.a+c2.a),i=mix(j(c2.rgb),j(c1.rgb),ratio);vec3 c=texture2D(palette,vec2(i,.5)).rgb;if(isolines==1){vec2 r=radius/size*scale;vec4 c1a=k(texture,p,r);vec4 c2a=k(texture2,p,r);i=mix(j(c2a.rgb),j(c1a.rgb),ratio)*fullSpan;float a=step(0.9999,mix(c2a.a,c1a.a,ratio));float d=length(vec2(dFdx(i),dFdy(i)));float v=abs(mod(i+base,interval)-.5)/d;c+=a*smoothstep(1.33,.0,v)*.25;}gl_FragColor=vec4(z*c,1.);}"
                  : ad;
            }
            return Fe[t].length > 1
              ? ad
              : "void main(){vec2 p=coord*scale+offset;vec4 c1=texture2D(texture,p),c2=texture2D(texture2,p);float z=sign(c1.a+c2.a),i=mix(c2.r,c1.r,ratio);gl_FragColor=vec4(z*texture2D(palette,vec2(i,.5)).rgb,1.);}";
          })(t))(s)
      ),
        (this.paletteURL = Pa[s]),
        (this.paletteImage = null),
        (this.paletteTexture = ed(t, Ca, 1)),
        this.Ft(),
        this.setTextures({
          texture: 1,
          texture2: 2,
          palette: 3,
        }));
    }
    Ft(t) {
      if (this.paletteImage)
        return void this.paletteTexture.upload(this.paletteImage, 3);
      const s = new Image();
      ((s.onload = () => {
        ((this.paletteImage = s), t && (this.paletteTexture.upload(s, 3), t()));
      }),
        (s.src = this.paletteURL));
    }
  }
  const ud = new Eu();
  let dd;
  const fd = (t, s) => `${As}${Ih(t, 5)}/${s}/{z}/{y}/{x}.webp`;
  class md extends Wu {
    constructor() {
      super({
        minZoom: 0,
        maxZoom: Yn.zooms.radar,
        cacheSize: Yn._,
        isOpaque: !1,
        tileLoadFunction: (t, s) => {
          this.loadTile(t, s);
        },
      });
    }
    getClosest(t) {
      const s = Yn.layers.radar.times;
      if (!Array.isArray(s) || 0 === s.length) return;
      const i = t / 1000;
      let h = s.at(-1),
        e = 1 / 0;
      for (let t = s.length; t--; ) {
        const n = s[t],
          r = Math.abs(n - i);
        r < e && ((e = r), (h = n));
      }
      const n = Yn.layers.radar.reflectivity[h];
      return !n || e > 1200
        ? void 0
        : {
            date: new Date(1000 * h),
            hash: n,
          };
    }
    getURL(t) {
      if (!t) return;
      const { date: s, hash: i } = t;
      return fd(s, i);
    }
    getMapZoom(t) {
      return et(
        Math.ceil(t - $t),
        this.tileGrid.minZoom,
        this.tileGrid.maxZoom
      );
    }
    preload(t, s, i) {
      const h = Yn.isWithinMSG ? Nn : Ln;
      super.preload(
        t,
        this.getMapZoom(s),
        Yn.layers.geocolor.date.getTime() + 60000 * h * i
      );
    }
    loadTile(t, s) {
      const i = t.getImage();
      i.noCache = !0;
      const h = s.replace(Ms, "");
      if (ud.containsKey(h)) return void (i.src = ud.get(h));
      const e = new Image();
      ((e.crossOrigin = Wi),
        (e.onerror = (s) => {
          t.state = 3;
        }),
        (e.onload = (s) => {
          if (!dd)
            try {
              dd = Er(xr(ca, ca), !0, !0);
            } catch (t) {}
          if (dd) {
            const s = _a();
            let n,
              r = 0;
            dd.clearRect(0, 0, ca, ca);
            try {
              (dd.drawImage(e, 0, 0), (n = dd.getImageData(0, 0, ca, ca)));
              const t = n.data;
              for (let i = 0, h = t.length; i < h; i += 4) {
                const h = t[i + 1] / 255,
                  e = t[i + 2] / 255;
                r += h + e;
                const n = ja(0, Ga(h)),
                  o = ja(1, Ga(e)),
                  a = et(0.5 + 8 * (h - e), 0, 1),
                  c = 1 - a,
                  l = wr(0, 0.4, h * a + e * c);
                (l > 0 &&
                  ((t[i] = s[n] * a + s[o] * c + 0.5),
                  (t[i + 1] = s[n + 1] * a + s[o + 1] * c + 0.5),
                  (t[i + 2] = s[n + 2] * a + s[o + 2] * c + 0.5)),
                  (t[i + 3] = 255 * l + 0.5));
              }
            } catch (t) {}
            if (0 === r) return void (i.src = Oa.src);
            try {
              dd.putImageData(n, 0, 0);
            } catch (t) {}
            dd.canvas.toBlob(
              (s) => {
                try {
                  const t = URL.createObjectURL(s);
                  (ud.containsKey(h) && ud.remove(h),
                    ud.set(h, t),
                    ud.pruneBlob(),
                    (i.src = t));
                } catch (s) {
                  t.state = 3;
                }
              },
              "image/webp",
              1
            );
          }
        }),
        (e.src = s));
    }
  }
  const pd = 100000;
  class gd extends Wu {
    constructor(t) {
      (void 0 === t && (t = 0),
        super({
          minZoom: Yn.zooms.min,
          maxZoom: Yn.zooms.max,
          tileLoadFunction: (t, s) => {
            t.loadCachedImage(s, () => {
              this.changed();
            });
          },
        }),
        (this.timeDelta = t),
        (this.timeStep = 0),
        (this.layer = null),
        (this.date = null),
        (this.newDate = null),
        (this.runText = ""),
        (this.canvas = xr(1, 1)),
        (this.context = null),
        (this.extent = [1 / 0, 1 / 0, -1 / 0, -1 / 0]),
        (this.mapZoom = -1),
        (this.mapScale = 0),
        (this.drawnExtent = [1 / 0, 1 / 0, -1 / 0, -1 / 0]),
        (this.tileRange = new ma()));
    }
    get isRadarLayer() {
      return this.layer === Re.RADAR;
    }
    getMapZoom(t) {
      return et(
        Math.ceil(t - $t - (this.isRadarLayer ? 1 : 0)),
        this.tileGrid.minZoom,
        this.tileGrid.maxZoom
      );
    }
    getClosest(t) {
      let s;
      t /= 1000;
      let i = 1 / 0;
      if (this.isRadarLayer) {
        const h = Yn.layers.radar.times;
        if (!Array.isArray(h) || 0 === h.length) return;
        for (let e = h.length; e--; ) {
          const n = h[e],
            r = Math.abs(n - t - (this.timeDelta * this.timeStep) / 2);
          r < i && ((i = r), (s = n));
        }
        const e = Yn.layers.radar.reflectivity[s];
        if (!e) return;
        return {
          date: new Date(1000 * s),
          hash: e,
          minDelta: i,
        };
      }
      const h = this.layer,
        e = Yn.model,
        n = Yn.layers.forecast[e],
        r = n && n.times[h] && n.times[h][ni[h]];
      if (!r) return;
      const o = Object.keys(r).sort();
      if (0 === o.length) return;
      let a = 0;
      for (let h = o.length; h--; ) {
        const e = bn(o[h]),
          n = r[e];
        for (let h = n.length; h--; ) {
          const r = e + n[h] * this.timeStep;
          if (
            0 === this.timeDelta ||
            (this.timeDelta > 0 && r >= t) ||
            (this.timeDelta < 0 && r <= t)
          ) {
            const o = Math.abs(
              r - t - (this.timeDelta * this.timeStep) / 2 - 1
            );
            o < i && ((i = o), (s = e), (a = n[h]));
          }
        }
      }
      const c = new Date(1000 * s),
        l = new Date(c.getTime());
      return (
        l.setUTCHours(l.getUTCHours() + a),
        {
          date: l,
          runDate: c,
          forecastHour: a,
        }
      );
    }
    getURL(t) {
      if (this.isRadarLayer)
        return !t || isNaN(t.date.getTime()) || t.minDelta > 2 * this.timeStep
          ? As + "blank.png"
          : fd(t.date, t.hash);
      {
        const s = Yn.model,
          i = Yn.version[s],
          h = this.layer;
        return !t || isNaN(t.runDate.getTime())
          ? `${Ms}${s}/${i}/${h}/blank.png`
          : `${Ms}${s}/${i}/${h}/webp/${ni[h]}/${Ih(t.runDate)}/f${Li(t.forecastHour, 3)}/{z}/{y}/{x}.webp`;
      }
    }
    update() {
      const t = this.isRadarLayer;
      ((this.tileGrid.maxZoom = t ? Yn.zooms.radar : Yn.zooms.models[Yn.model]),
        (this.timeStep = 60 * (t ? 5 : 60)));
      const s = this.getClosest(Yn.time);
      ((this.runText =
        !s || isNaN(s.runDate) || t
          ? ""
          : Li(s.runDate.getUTCDate()) +
            "/" +
            Li(s.runDate.getUTCHours()) +
            "Z"),
        (this.newDate = s && !isNaN(s.date) ? s.date : null),
        this.setURL(this.getURL(s)));
    }
    clear() {
      this.context &&
        (Ir(this.context, Ue[this.layer]),
        this.draw(this.extent, this.mapZoom, !0));
    }
    preload(t, s, i) {
      super.preload(
        t,
        this.getMapZoom(s),
        Yn.time + 1000 * this.timeStep * i,
        pd
      );
    }
    draw(t, s, i, h) {
      const e = wt(t, pd),
        n = this.getMapZoom(s),
        r = this.tileGrid,
        o = r.getTileRangeForExtentAndZ(e, n, this.tileRange),
        [a, c] = o.getSize();
      if (Kh.safari && a * c >= 256) return (Tr(this.canvas, 0, 0), !0);
      r.getTileRangeExtent(n, o, this.extent);
      const l = this.mapZoom === n && Et(this.extent, this.drawnExtent);
      if (!i && l) return !1;
      (vt(this.extent, this.drawnExtent),
        (this.mapZoom = n),
        (this.mapScale = (2 ** n * ca) / 2 / Ut),
        this.tileCache.prune(),
        (this.context &&
          !Tr(this.canvas, Math.max(1, a) * ca, Math.max(1, c) * ca) &&
          l) ||
          (this.context = Ir(Er(this.canvas, !0, !1), h || Ue[this.layer])));
      const u = [
        {
          z: n,
          e: e,
        },
      ];
      Yn.j &&
        (n < r.maxZoom &&
          u.push({
            z: n + 1,
            e: Ft(t, 1),
          }),
        n > r.minZoom &&
          s < r.maxZoom + 1 + $t &&
          u.push({
            z: n - 1,
            e: t,
          }),
        !Yn.isTimeAnimating &&
          n + 1 < r.maxZoom &&
          u.push({
            z: n + 2,
            e: Ft(t, 2),
          }));
      const d = this.context;
      let f = 0;
      for (let t = 0, s = u.length; t < s; t++) {
        const { z: s, e: i } = u[t],
          h = this.getOrder(i, s, r.getTileRangeForExtentAndZ(i, s));
        s === n && (f = h.length);
        for (let t = 0, i = Math.min(h.length, f); t < i; t++) {
          const { x: i, y: e } = h[t],
            a = this.getTile(s, i, e, 1),
            c = (i - o.minX) * ca,
            l = (o.maxY - e) * ca,
            u = -1 - e;
          if (u < 0 || u >= 2 ** s) {
            d.clearRect(c, l, ca, ca);
            continue;
          }
          const m = a.interimTile;
          m && this.Pt(m, c, l, ca);
          const p = a.interimParts;
          if ((p && this.zt(p, c, l, ca), 2 !== a.state)) {
            a.load();
            continue;
          }
          if (s !== n) continue;
          f--;
          const g = a.getImage();
          try {
            d.drawImage(g, c, l);
          } catch (t) {}
          (m && (m.dispose(), (a.interimTile = void 0)),
            (a.interimParts = void 0));
          const w = s + 1;
          if (w <= r.maxZoom) {
            const t = 2 * i,
              s = 2 * e;
            for (let i = 0; i < 4; i++) {
              const h = i % 2,
                e = Math.floor(i / 2);
              this.Ut(g, w, t + h, s + e, h, e);
            }
          }
          const v = s - 1;
          v >= r.minZoom &&
            this.Wt(
              g,
              v,
              Math.floor(i / 2),
              Math.floor(e / 2),
              nt(i, 2),
              nt(e, 2)
            );
        }
      }
      return (0 === f && (this.date = this.newDate), !0);
    }
    Ut(t, s, i, h, e, n) {
      const r = this.getTile(s, i, h, 1);
      2 !== r.state &&
        (r.interimTile ||
          ((r.interimTile = this.createTile(s, i, h, 1)),
          (r.interimTile.ix = e),
          (r.interimTile.iy = n),
          (r.interimTile.interimImage = t)));
    }
    Pt(t, s, i, h) {
      const e = h / 2,
        n = t.ix * e,
        r = (1 - t.iy) * e;
      try {
        this.context.drawImage(t.interimImage, n, r, e, e, s, i, h, h);
      } catch (t) {}
    }
    Wt(t, s, i, h, e, n) {
      const r = this.getTile(s, i, h, 1);
      2 !== r.state &&
        (Array.isArray(r.interimParts) || (r.interimParts = []),
        (r.interimParts[2 * n + e] = {
          image: t,
          ix: e,
          iy: n,
        }));
    }
    zt(t, s, i, h) {
      if (!Array.isArray(t) || 0 === t.length) return;
      const e = h / 2;
      for (let n = t.length; n--; ) {
        const r = t[n];
        if (!r) continue;
        const { image: o, ix: a, iy: c } = r,
          l = s + a * e,
          u = i + (1 - c) * e;
        try {
          this.context.drawImage(o, 0, 0, h, h, l, u, e, e);
        } catch (t) {}
      }
    }
  }
  const wd = 100;
  class vd extends Qu {
    constructor() {
      super({
        source: new sd((t) => this.getCanvas(t)),
      });
      const s = (t) => {
        (cancelAnimationFrame(this.rafID),
          (this.rafID = requestAnimationFrame(() => {
            (this.draw(!0), this.changed());
          })));
      };
      ((this.frameRateID = 0),
        (this.animID = 0),
        (this.rafID = 0),
        (this.tileSource1 = new gd(-1)),
        this.tileSource1.on(t, s),
        (this.tileSource2 = new gd(1)),
        this.tileSource2.on(t, s),
        (this.layer = null),
        (this.filter = null),
        (this.extent = [1 / 0, 1 / 0, -1 / 0, -1 / 0]),
        (this.zoom = 0),
        (this.resolution = 0),
        (this.center = [0, 0]),
        (this.width = 0),
        (this.height = 0),
        (this.scale = null),
        (this.offset = null),
        (this.overlap = null),
        (this.ratio = 1),
        (this.isAnimating = !1),
        (this.needsPalette = !1),
        (this.hasClouds = Yn.overlays.clouds),
        (this.cloudsFade = 0),
        this.on(Qo, (t) => {
          ((this.isAnimating = t.frameState.viewHints.isAnimating),
            Ar(
              t.context,
              this.isRadarLayer || this.isPrecipitationLayer ? vr : Mr
            ));
        }),
        this.on(ta, (t) => {
          Ar(t.context, vr);
        }),
        this.on(C, (t) => {
          this.getVisible() ||
            (clearTimeout(this.frameRateID),
            cancelAnimationFrame(this.animID),
            cancelAnimationFrame(this.rafID));
        }));
    }
    get isRadarLayer() {
      return this.layer === Re.RADAR;
    }
    get isPrecipitationLayer() {
      return this.layer === Re.PRECIPITATION;
    }
    getCanvas(t) {
      const { extent: s, zoom: i, width: h, height: e } = t;
      if (
        (vt(s, this.extent),
        (this.zoom = i),
        this.filter && this.width === h && this.height === e)
      )
        this.draw();
      else {
        if (((this.width = h), (this.height = e), this.filter))
          this.filter.resize(h, e);
        else {
          let t = (this.filter = new od(h, e));
          if (!t.gl)
            return (
              t.dispose(),
              void this.dispatchEvent({
                type: a,
                message: "No context",
              })
            );
          _i(t.canvas, "webglcontextlost", (s) => {
            (th(s),
              t &&
                t.gl &&
                (t.dispose(),
                this.dispatchEvent({
                  type: a,
                  message: "Lost context",
                })));
          });
        }
        this.draw(!0);
      }
      if (!this.filter || this.filter.gl) return this.filter.canvas;
      this.dispatchEvent({
        type: a,
        message: "No context",
      });
    }
    resize(t) {
      (this.width === t[0] && this.height === t[1]) ||
        this.getSource().changed();
    }
    draw(t) {
      const s = this.filter;
      if (!s || !s.gl) return;
      const i = this.tileSource1,
        h = this.tileSource2,
        e = this.extent,
        n = i.extent,
        r = i.draw(e, this.zoom, t),
        o = h.draw(e, this.zoom, t);
      if (i.date && h.date && !this.isAnimating) {
        const t = i.date.getTime(),
          s = h.date.getTime();
        if (t === s) this.ratio = 1;
        else {
          const i = (s - Yn.time) / (s - t);
          i > 0 && i <= 1 && (this.ratio = i);
        }
      }
      (r && s.drawTexture(s.texture1.upload(i.canvas, 1)),
        o && s.drawTexture(s.texture2.upload(h.canvas, 2)));
      const a = ((c = s.gl), (l = this.layer), cd[l] || (cd[l] = new ld(c, l)));
      var c, l;
      if (!a) return;
      this.needsPalette &&
        ((this.needsPalette = !1),
        a.Ft(() => {
          this.draw();
        }));
      const u = Nt(e),
        d = {
          scale: [u / Nt(n), Rt(e) / Rt(n)],
          offset: [
            ((e[0] - n[0]) * i.mapScale) / i.canvas.width,
            ((e[1] - n[1]) * i.mapScale) / i.canvas.height,
          ],
          ratio: this.ratio,
        };
      (clearTimeout(this.frameRateID), cancelAnimationFrame(this.animID));
      const f = this.isRadarLayer;
      if (f || this.isPrecipitationLayer) {
        d.size = [this.width, this.height];
        const t = It(e),
          i = u / this.width,
          h = [t[0] / i, t[1] / i];
        (ht(i, this.resolution, 1000000)
          ? ((this.center = h), (d.center = h))
          : (d.center = this.center),
          (this.resolution = i),
          (d.fade = Yn.overlays.precipitationAnimation
            ? it(
                et(
                  this.zoom - (f ? Yn.zooms.radarAnim : Yn.zooms.precipAnim),
                  0,
                  1
                ),
                100
              )
            : 0),
          (d.radar = f ? 1 : 0),
          this.hasClouds !== Yn.overlays.clouds &&
            ((this.hasClouds = Yn.overlays.clouds), (this.cloudsFade = 0)));
        const n = () => {
          const t = this.cloudsFade < 1;
          (t && (this.cloudsFade = Math.min(1, this.cloudsFade + 0.1)),
            (d.clouds =
              (this.hasClouds ? this.cloudsFade : 1 - this.cloudsFade) *
              (Yn.user.isDarkTheme ? 1 / 3 : 0.75)),
            (!Yn.Z && Ns()) ||
              !(t || d.fade > 0) ||
              ((d.time = (Date.now() - Yn.U) / 1000 + 100),
              s.drawShader(a, d),
              s.update(),
              this.changed()),
            t
              ? (this.animID = requestAnimationFrame(n))
              : (this.frameRateID = setTimeout(() => {
                  this.animID = requestAnimationFrame(n);
                }, 1000 / 30)));
        };
        n();
      } else {
        const t = Fe[this.layer];
        if (t.length > 1 && this.layer !== Re.WIND_SPEED) {
          const [s, i, h] = t,
            e = h.max - s.min;
          if (
            ((d.span = [s.span / e, i.span / e, h.span / e]),
            (this.overlap = d.overlap =
              [(s.max - i.min) / i.span, (i.max - h.min) / h.span]),
            this.layer === Re.PRESSURE)
          ) {
            const t = this.zoom;
            ((d.isolines = Yn.$ && Yn.overlays.isolines),
              (d.fullSpan = e),
              (d.size = [this.width, this.height]),
              (d.radius = 2 ** t / 10));
            const i = Yn.user.pressureUnit,
              h = dn[i];
            switch (i) {
              case sn.HPA:
              case sn.MB:
                ((d.base = 0.015),
                  (d.interval =
                    t < Yn.zooms.isolines1
                      ? 4
                      : t < Yn.zooms.isolines2
                        ? 2
                        : 1));
                break;
              case sn.MMHG:
                ((d.base = 1 - ((s.min / h) % 1)),
                  (d.interval =
                    (t < Yn.zooms.isolines1
                      ? 4
                      : t < Yn.zooms.isolines2
                        ? 2
                        : 1) / h));
                break;
              case sn.INHG:
                ((d.base = (s.min / h) % 1),
                  (d.interval = (t < Yn.zooms.isolines2 ? 0.1 : 0.05) / h));
            }
          }
        } else this.overlap = null;
      }
      (s.drawShader(a, d), s.update());
    }
    clear() {
      (this.tileSource1.clear(), this.tileSource2.clear());
    }
    update() {
      const t = this.tileSource1,
        s = this.tileSource2,
        i = Yn.layer;
      (this.layer !== i &&
        ((this.needsPalette = Pa[this.layer] !== Pa[i]),
        (this.layer = i),
        (t.layer = i),
        (s.layer = i),
        t.clear(),
        s.clear()),
        t.update(),
        s.update());
    }
    getValues(t) {
      const s = Fe[this.layer];
      if (!Array.isArray(s)) return;
      const i = this.tileSource1,
        h = this.tileSource2;
      if (0 === i.canvas.width || 0 === h.canvas.width) return;
      const [e, n] = (function (t, s) {
          void 0 === s && (s = 1000000);
          let [i, h] = Ht(t[0] / Ut, t[1] / Ut),
            [e, n] = Zt(it(i, s), it(h, s));
          return [e * Ut, n * Ut];
        })(t),
        r = Nr(
          i.canvas,
          (e - i.extent[0]) * i.mapScale - 0.5,
          (i.extent[3] - n) * i.mapScale - 0.5
        ),
        o = Nr(
          h.canvas,
          (e - h.extent[0]) * h.mapScale - 0.5,
          (h.extent[3] - n) * h.mapScale - 0.5
        );
      if (r.isBlank || o.isBlank) return;
      const [a, c, l] = s,
        u = this.ratio,
        d = a.min + ut(o.r, r.r, u) * a.span;
      if (this.layer === Re.WIND_SPEED) {
        const t = c.min + ut(o.g, r.g, u) * c.span;
        return {
          speed: it(ft(d, t), wd),
          direction: ct(Math.atan2(d, t)),
        };
      }
      if (this.layer === Re.WIND_GUSTS) return d;
      if (this.isRadarLayer)
        return {
          rain: c.min + ut(o.g, r.g, u) * c.span,
          snow: l.min + ut(o.b, r.b, u) * l.span,
        };
      if (this.isPrecipitationLayer) {
        const t = Math.round(d),
          s = c.min + ut(o.g, r.g, u) ** 8 * c.span,
          i = s > 0 ? it(s + 0.001375 * c.span, wd) : 0,
          h = l.min + ut(o.b, r.b, u) ** 8 * l.span;
        return {
          cloud: t,
          rain: i,
          snow: h > 0 ? it(h + 0.001375 * l.span, wd) : 0,
        };
      }
      if (s.length > 1) {
        if (!this.overlap) return;
        return it(
          d +
            Math.max(0, ut(o.g, r.g, u) - this.overlap[0]) * c.span +
            Math.max(0, ut(o.b, r.b, u) - this.overlap[1]) * l.span,
          wd
        );
      }
      return it(d, wd);
    }
  }
  class yd extends lo {
    constructor(t, s, i) {
      (super({
        className: "favorite",
      }),
        t.addOverlay(this, t.favorites),
        (this.location = i),
        this.moveTo(is(s, Qt([i.lon, i.lat]))));
    }
  }
  const Md = new $l({
      url: ys + "fire.1.png",
      imgSize: [45, 45],
    }),
    bd = new ul({
      image: Md,
    }),
    Ad = new $l({
      url: ys + "fire-complex.1.png",
      imgSize: [45, 45],
    }),
    Td = new ul({
      image: Ad,
    }),
    xd = new $l({
      url: ys + "fire-prescribed.1.png",
      imgSize: [45, 45],
    }),
    Ed = new ul({
      image: xd,
    }),
    Dd = (t, s) => {
      const i = new fl();
      ((i.id = "dot-fire-" + t.id), i.set("data", t));
      const h = Is.fire;
      return (
        (t.name = t.name
          .replace(/\band\b/g, h.and)
          .replace(/\bFires\b/g, h.fires)
          .replace(/\bFire\b/g, h.fire)
          .replace(/\bComplex\b/g, h.complex)
          .replace(/\bPrescribed Burn\b/g, h.prescribedBurn)),
        i.setStyle(() => {
          let h = t.acres;
          (!$s(h) && $s(t.hectares) && (h = 2.47105 * t.hectares),
            $s(h) || (h = 0));
          const e = s();
          if (
            t.id !== Yn.selectedFireID &&
            ((h < 10000 && e > 7342.146) || (h < 1000 && e > 1835.5365))
          )
            return dl;
          const n = 1 - Math.min(25, t.contained || 0) / 100,
            r = 1.25 * et(4892 / e, 0.48, 1),
            o =
              h < 1000
                ? 0.6
                : et(((((h * n) / 40000) * 1223) / e) ** 0.1, 0.6, r);
          return (
            i.set("scale", o),
            t.type === Ie.COMPLEX
              ? ((Ad.scale = 0.4 * o), Td)
              : t.type === Ie.PRESCRIBED_BURN
                ? ((xd.scale = 0.4 * o), Ed)
                : ((Md.scale = 0.4 * o), bd)
          );
        }),
        i.setGeometry(new wc(Qt(t.coordinate))),
        i
      );
    };
  class Id extends Gl {
    constructor(t) {
      (super({
        source: new Yl({
          wrapX: !1,
        }),
        zIndex: 3,
      }),
        (this.getResolution = t),
        (this.tooltipEnabled = !0),
        (this.hash = ""));
    }
    update(t) {
      const s = Tn(t);
      if (this.hash === s) return !1;
      this.hash = s;
      const i = this.getSource();
      i.clear();
      const h = [];
      for (let s = 0, i = t.length; s < i; s++)
        h.push(Dd(t[s], this.getResolution));
      return (i.addFeatures(h), !0);
    }
    updateVisibility() {
      const t = this.getVisible(),
        s = Yn.overlays.fires && (!Yn.isHDLayer || Yn.time > mh() - 1209600000);
      (this.setVisible(s),
        t &&
          !s &&
          this.dispatchEvent({
            type: f,
          }));
    }
  }
  const Sd = "active";
  class Rd extends lo {
    constructor() {
      (super({
        className: "geo",
      }),
        Ki(this.element, Xi("div", "pulse")),
        Ki(this.element, Xi("div", "dot")));
    }
    hide() {
      this.removeFromMap();
    }
    show(t, s, i) {
      (this.moveTo(i), this.map || t.addOverlay(this, s));
    }
    hideActive() {
      uh(this.element, Sd);
    }
    showActive() {
      lh(this.element, Sd);
    }
  }
  const kd = new Eu();
  class Ld extends ku {
    constructor(t) {
      (super({
        source: new Wu({
          minZoom: Yn.zooms.heatMin,
          maxZoom: Yn.zooms.heatMax,
          cacheSize: Yn._,
          tileURLFunction: (t) => this.getSourceURL(t),
          tileLoadFunction: (t, s) => {
            this.loadTile(t, s);
          },
        }),
        maxResolution: t,
        extent: Gs.wide,
      }),
        (kd.max = Kh.mobile ? 32 : 64),
        this.on(Qo, (t) => {
          const s = t.layerContext;
          (s &&
            (Ar(s, yr),
            Ir(s, "#000"),
            Ar(s, "darken"),
            Ir(s, "#ff8018"),
            Ar(s, vr)),
            Ar(t.context, yr));
        }),
        this.on(ta, (t) => {
          Ar(t.context, vr);
        }),
        (this.dateString = ""),
        (this.tooltipEnabled = !0),
        (this.loaders = {}));
    }
    cancel() {
      for (let t in this.loaders) this.loaders[t].cancel();
      this.loaders = {};
    }
    initCanvas() {
      this.canvas ||
        ((this.canvas = xr(ca, ca)), (this.context = Er(this.canvas)));
    }
    getSourceURL(t, s) {
      if (!this.dateString) return;
      const i = this.getSource()
        .tileGrid.getTileCoordExtent(t)
        .map((t) => Math.round(1000000 * t) / 1000000)
        .join(",");
      return `${Ms}proxy/heat/${s || this.dateString}/${i}.jpg`;
    }
    updateSource(t) {
      ((this.dateString = Dh(new Date(Math.min(mh() - 10800000, t.getTime())))),
        this.setVisible(
          Yn.overlays.heat &&
            (Yn.isGeocolorLayer || Yn.isHDLayer) &&
            Yn.time >= _s.heat.getTime()
        ),
        this.getSource().tileCache.clear());
    }
    loadTile(t, s, i, h) {
      const e = t.getImage(),
        n = h || s.replace(Ms, "");
      if (kd.containsKey(n)) return void (e.src = kd.get(n));
      this.initCanvas();
      const r = new Xs();
      ((this.loaders[s] = r),
        r
          .load({
            url: s,
            responseType: "blob",
            timeout: 12000,
          })
          .then((h) => {
            if ((delete this.loaders[s], h)) {
              let r;
              try {
                r = URL.createObjectURL(h);
              } catch (i) {
                return ((t.state = 3), void (e.src = s));
              }
              const o = Date.parse(this.dateString);
              this.context && r
                ? i
                  ? this.composite(t, i, r, n)
                  : this.loadTile(
                      t,
                      this.getSourceURL(t.tileCoord, Dh(vh(o))),
                      r,
                      n
                    )
                : (kd.containsKey(n) && kd.remove(n),
                  kd.set(n, r),
                  kd.pruneBlob(),
                  (e.src = r));
            } else t.state = 3;
          })
          .catch((i) => {
            (delete this.loaders[s], (t.state = 3));
          }));
    }
    composite(t, s, i, h) {
      const e = t.getImage(),
        n = new Image();
      ((n.crossOrigin = Wi),
        (n.onerror = (i) => {
          ((t.state = 3), (e.src = s));
        }),
        (n.onload = () => {
          const r = new Image();
          ((r.crossOrigin = Wi),
            (r.onerror = (i) => {
              ((t.state = 3), (e.src = s));
            }),
            (r.onload = () => {
              try {
                const t = this.context;
                ((t.globalAlpha = 1),
                  Ar(t, vr),
                  t.drawImage(n, 0, 0),
                  (t.globalAlpha = 0.5),
                  Ar(t, "lighten"),
                  t.drawImage(r, 0, 0));
              } catch (i) {
                return ((t.state = 3), void (e.src = s));
              }
              this.canvas.toBlob(
                (n) => {
                  try {
                    const t = URL.createObjectURL(n);
                    (URL.revokeObjectURL(s),
                      URL.revokeObjectURL(i),
                      kd.containsKey(h) && kd.remove(h),
                      kd.set(h, t),
                      kd.pruneBlob(),
                      (e.src = t));
                  } catch (i) {
                    ((t.state = 3), (e.src = s));
                  }
                },
                "image/jpeg",
                0.9
              );
            }),
            (r.src = i));
        }),
        (n.src = s));
    }
  }
  class Nd extends ku {
    constructor() {
      const t = Kh.use2x ? 2 : 1,
        s = `${Ms}static/line/${Yn.version.line}/${t}x/webp/{z}/{y}/{x}.webp`;
      super({
        source: new Wu({
          minZoom: 0,
          maxZoom: Yn.zooms.max,
          cacheSize: 256,
          isOpaque: !1,
          tilePixelRatio: t,
          url: s,
        }),
        zIndex: 1,
      });
    }
  }
  const Od = "active";
  class Cd extends lo {
    constructor() {
      (super({
        className: "marker",
      }),
        Ki(this.element, Xi("div", "pulse")),
        Ki(this.element, Xi("div", "dot")));
    }
    hide() {
      (this.map && this.map.removeOverlay(this), uh(this.element, Od));
    }
    show(t, s, i) {
      (this.map && ur(this.coordinate, i) && dh(this.element, Od)) ||
        (this.moveTo(i),
        this.map || t.addOverlay(this, s),
        uh(this.element, Od),
        requestAnimationFrame(() => {
          lh(this.element, Od);
        }));
    }
    get lonLat() {
      if (this.map) return ss(this.coordinate);
    }
  }
  class Fd extends ku {
    constructor() {
      const t = Kh.use2x ? 2 : 1;
      (super({
        source: new Wu({
          minZoom: 0,
          maxZoom: Yn.zooms.coverage,
          cacheSize: Yn._,
          tileSize: 512 / t,
          tilePixelRatio: t,
        }),
        useInterimTilesOnError: !0,
      }),
        this.setOpacity(1 / 3),
        this.on(Qo, (t) => {
          Ar(t.context, Mr);
        }),
        (this.tooltipEnabled = !0),
        (this.hash = ""));
    }
    updateSource() {
      const t = Yn.layers.radar.coverage;
      t &&
        this.hash !== t &&
        ((this.hash = t),
        jl(this, `${bs}${t}/{z}/{y}/{x}.webp`),
        this.getSource().refresh());
    }
  }
  class Pd extends ku {
    constructor() {
      (super({
        source: new md(),
        useInterimTilesOnError: !0,
      }),
        (this.tooltipEnabled = !0));
    }
    updateSource() {
      const t = this.getSource();
      let s;
      Yn.isGeocolorLayer &&
        ((s = t.getURL(t.getClosest(Yn.layers.geocolor.date.getTime()))),
        jl(this, s));
      const i = !!s && Yn.overlays.radar;
      (this.setVisible(i), i || t.refresh());
    }
  }
  const zd = new ul({
      stroke: new Vl({
        color: "#fff",
        width: 2.5,
        lineCap: "butt",
      }),
    }),
    Ud = new ul({
      fill: new ql("#113"),
    }),
    Wd = {};
  ((Wd[Re.RADAR] = 0.25), (Wd[Re.PRECIPITATION] = 1 / 3));
  const Gd = {};
  Gd[Re.SATELLITE] = 0.2;
  class jd extends Gl {
    constructor() {
      (super({
        source: new Yl(),
        extent: Gs.wide,
      }),
        (this.feature = new fl()),
        this.getSource().addFeature(this.feature),
        (this.layerType = null));
    }
    update(t) {
      if (Yn.isHDLayer) return;
      const s = Yn.getDate();
      if ((Yn.sun.compute(s), !this.getVisible())) return;
      const i = Yn.isGeocolorLayer,
        h = !(
          i ||
          (Yn.user.isDarkTheme && (Yn.isRadarLayer || Yn.isPrecipitationLayer))
        ),
        e = Yn.layer;
      (t || this.layerType !== e) &&
        ((this.layerType = e),
        this.setStyle(h ? Ud : zd),
        this.setOpacity((h ? Wd[e] : Gd[e]) || 0.125));
      const n = [],
        r =
          ((t) => {
            const s = t - mi,
              i = pi + 0.98564736629 * s,
              h = 125.04452 - 0.052954 * s;
            return rt(
              yi(t) +
                Math.cos(Mi(t)) *
                  (-0.004785 * Math.sin(lt(h)) - 0.00036 * Math.sin(lt(2 * i)))
            );
          })(Yn.sun.julianDay) - Yn.sun.ra,
        o = lt(Yn.sun.dec),
        a = Math.tan(o),
        c = Math.sin(o),
        l = Math.cos(o),
        u = Math.abs(a) < 0.01 ? 2 : 1;
      for (let t = 0, s = 360 * u; t <= s; t++) {
        const s = t / u - 180,
          h = Math.cos(lt(r + s)),
          e = Math.atan(-h / a),
          o = et(
            ct(e - (i ? 0 : wi / (Math.sin(e) * l * h - Math.cos(e) * c))),
            -90,
            90
          );
        n.push([s, o]);
      }
      (h &&
        (o < 0
          ? (n.unshift([-180, 90]), n.push([180, 90]))
          : (n.unshift([-180, -90]), n.push([180, -90])),
        n.push(n[0])),
        this.feature.setGeometry(
          (h ? new vc([n]) : new lc(n)).toWebMercator()
        ));
    }
  }
  const _d = "fade",
    Bd = "favorite";
  class Zd extends lo {
    constructor(t, s) {
      (super({
        className: "label " + _d,
        link: t.place ? Kn.places + t.place + "/" : "",
      }),
        (this.text = t.text),
        (this.admins = t.admins),
        (this.place = t.place),
        (this.style = t.style),
        (this.path = t.path),
        (this.zoom = t.z || []),
        (this.tileCoord = s),
        (this.distance = 0),
        t.anchor &&
          !/^b/.test(t.style) &&
          ((this.anchor = t.anchor),
          (this.anchorElement = Ki(this.element, Xi("div", "anchor")))));
      const i = /\n/.test(t.text);
      ((this.textElement = Xi(
        "div",
        "text" +
          (i ? " wrap" : "") +
          (t.anchor ? " " + t.anchor : "") +
          (t.style ? " " + t.style : "")
      )),
        i
          ? (this.textElement.innerHTML = t.text
              .split("\n")
              .map((t) => Pi("", t))
              .join("<br>"))
          : ah(this.textElement, t.text),
        Ki(this.element, this.textElement),
        /^[bc]/.test(t.style) ||
          ((this.valueElement = Ki(this.element, Xi("div", "value " + _d))),
          (this.value = "")),
        requestAnimationFrame(() => {
          uh(this.element, _d);
        }));
    }
    updateDistance(t) {
      this.distance = fr(t, this.coordinate);
    }
    updateValue(t, s, i) {
      (void 0 === t && (t = ""),
        void 0 === s && (s = ""),
        void 0 === i && (i = !1),
        (this.value === t && this.valueElement.style.backgroundColor === s) ||
          ("" === this.value
            ? requestAnimationFrame(() => {
                uh(this.valueElement, _d);
              })
            : "" === t && lh(this.valueElement, _d),
          (this.value = t),
          i ? (this.valueElement.innerHTML = t) : ah(this.valueElement, t),
          (this.valueElement.style.backgroundColor = s)));
    }
    updateStyle(t, s) {
      (/^b/.test(t) ||
        (s
          ? this.anchorElement ||
            ((this.anchorElement = Xi("div", "anchor")),
            Ji(this.element, this.anchorElement),
            lh(this.textElement, s),
            (this.anchor = s))
          : (this.anchor &&
              (uh(this.textElement, this.anchor),
              (this.anchor = void 0),
              this.updateValue()),
            Vi(this.anchorElement),
            (this.anchorElement = void 0))),
        uh(this.textElement, this.style),
        t && lh(this.textElement, t),
        (this.style = t),
        this.updateSize(),
        this.updatePosition());
    }
    Gt() {
      return !!dh(this.element, Bd) && (uh(this.element, Bd), !0);
    }
    jt() {
      return !dh(this.element, Bd) && (lh(this.element, Bd), !0);
    }
  }
  class Hd extends Fu {
    constructor(t) {
      const s = new wa(t);
      let i = `${Ms}static/labels/${Yn.version.labels}/${Kh.lang}/{z}/{y}/{x}.json`;
      super({
        cacheSize: 0,
        tileGrid: s,
        tileLoadFunction: t.tileLoadFunction,
        url: i,
      });
    }
    getTile(t, s, i) {
      const h = la(t, s, i);
      if (this.tileCache.containsKey(h)) return this.tileCache.get(h);
      const e = new fa([t, s, i], 1);
      return (
        this.tileCache.set(h, e),
        this.tileLoadFunction(e, this.tileURLFunction([t, nt(s, 2 ** t), i])),
        e
      );
    }
  }
  const Yd = new Eu();
  class qd extends ku {
    constructor() {
      (super({
        source: new Hd({
          minZoom: Yn.zooms.min,
          maxZoom: Yn.zooms.max,
          tileLoadFunction: (t, s) => {
            this.loadTile(t, s);
          },
        }),
        useInterimTilesOnError: !0,
        updateWhileAnimating: !1,
        updateWhileInteracting: !1,
      }),
        (this.map = null),
        (this.labels = []),
        (this.labelsExtent = [1 / 0, 1 / 0, -1 / 0, -1 / 0]),
        (this.tileRanges = [...this.getSource().tileGrid.fullTileRanges]),
        (this.previousZoom = -1),
        (this.dataLayer = null),
        (this.forecastLabels = []),
        (this.forecastIndex = 0),
        (this.forecastUpdateID = 0),
        (this.isMoving = !1),
        this.on(ta, (t) => {
          this._t(t.frameState.extent);
        }),
        (this.changedID = 0),
        this.on(t, (t) => {
          (cancelAnimationFrame(this.changedID),
            (this.changedID = requestAnimationFrame(() => {
              this.Bt();
            })));
        }),
        this.setVisible(Yn.overlays.labels));
    }
    setMap(t) {
      ((this.map = t),
        (this.labels = t.labelOverlays.array),
        t.on(Fr, (t) => {
          const s = this.mapZoom,
            i = t.frameState ? t.frameState.viewHints : {};
          if (
            ((this.isMoving = i.isAnimating || i.isInteracting), this.isMoving)
          ) {
            if (this.previousZoom > s && s - Math.floor(s) < $t) {
              this.previousZoom = s;
              for (let t = this.labels.length; t--; ) {
                const i = this.labels[t];
                i.zoom.includes(s) || this.map.removeOverlay(i, !0);
              }
            }
          } else this.previousZoom = s;
        }));
    }
    setDataLayer(s) {
      this.dataLayer ||
        ((this.dataLayer = s),
        s.on(t, (t) => {
          this.Bt();
        }));
    }
    Bt() {
      !this.isMoving &&
        Yn.overlays.labelValues &&
        !Yn.isRainLayer &&
        Yn.isForecastLayer &&
        (cancelAnimationFrame(this.forecastUpdateID),
        (this.forecastLabels = this.labels
          .filter((t) => !/^[bc]/.test(t.style))
          .sort((t, s) => t.distance - s.distance)),
        Yn.isTimeAnimating
          ? this.Zt()
          : (this.forecastUpdateID = requestAnimationFrame(() => {
              ((this.forecastIndex = 0), this.Zt());
            })));
    }
    Zt() {
      if (
        this.isMoving ||
        !Yn.overlays.labelValues ||
        Yn.isRainLayer ||
        !Yn.isForecastLayer
      )
        return;
      const t = this.forecastLabels.length,
        s = this.forecastIndex,
        i = s + (Yn.isTimeAnimating ? 2 : Ns() ? 4 : 8),
        h = Yn.layer,
        e = Pe[h];
      for (let n = s, r = Math.min(t, i); n < r; n++) {
        const t = this.forecastLabels[n],
          s = this.dataLayer.getValues(t.coordinate);
        if (void 0 === s) continue;
        let i,
          r = s,
          o = !1;
        switch (h) {
          case Re.WIND_SPEED:
            ((r = s.speed),
              (i = Yn.user.P(s.speed)),
              !/^0/.test(i) &&
                $s(s.direction) &&
                ((i += zi(s.direction)), (o = !0)));
            break;
          case Re.WIND_GUSTS:
            i = Yn.user.P(s);
            break;
          case Re.TEMPERATURE:
          case Re.TEMPERATURE_FEEL:
          case Re.TEMPERATURE_WET_BULB:
          case Re.DEW_POINT:
            i = Ce(s, e) + Yn.user.L(s);
            break;
          case Re.HUMIDITY:
            i = Ss(s);
            break;
          case Re.PRESSURE:
            i = Ce(s, e) + Yn.user.R(s);
        }
        t.updateValue(i, Ua(h, r), o);
      }
      i < t
        ? (this.forecastUpdateID = requestAnimationFrame(() => {
            ((this.forecastIndex = i), this.Zt());
          }))
        : (this.forecastIndex = 0);
    }
    Ht() {
      for (let t = this.forecastLabels.length; t--; )
        this.forecastLabels[t].updateValue();
    }
    get mapZoom() {
      return Math.ceil(this.map.view.getZoom() - $t);
    }
    setVisible(t) {
      (super.setVisible(t),
        this.map &&
          (t ? this.getSource().refresh() : this.remove(this.labels)));
    }
    loadTile(t, s) {
      const i = ua(t.tileCoord);
      Yd.containsKey(i)
        ? this.addTile(t, Yd.get(i))
        : new Xs()
            .load({
              url: s,
            })
            .then((s) => {
              const h = s || [];
              (Yd.containsKey(i) && Yd.remove(i),
                Yd.set(i, h),
                Yd.prune(),
                this.addTile(t, h));
            })
            .catch((s) => {
              t.state = 3;
            });
    }
    addTile(t, s) {
      t.state = 2;
      const [i, h] = t.tileCoord;
      if (i !== this.mapZoom) return;
      let e = this.labels.length;
      if (e > 800) return;
      const n = [],
        r = this.getSource()
          .tileGrid.getTileCoordExtent(t.tileCoord)
          .map((t) => it(t, 100));
      for (let t = e; t--; ) {
        const s = this.labels[t],
          i = it(s.coordinate[0], 100),
          h = it(s.coordinate[1], 100);
        i >= r[0] && i < r[2] && h >= r[1] && h < r[3] && n.push(s);
      }
      const o = [],
        a = et(Math.floor(h / 2 ** i), -1, 1) * Wt,
        c = this.map.view.getCenter();
      for (let i = 0, h = s.length; i < h; i++) {
        const h = s[i];
        h.style || (h.style = "a0");
        const r = [h.x + a, h.y];
        let l = !0;
        for (let s = n.length; s--; ) {
          const i = n[s];
          if (
            i.text === h.text &&
            i.coordinate[0] === r[0] &&
            i.coordinate[1] === r[1]
          ) {
            ((i.tileCoord = t.tileCoord),
              (i.zoom = h.z || []),
              n.splice(s, 1),
              (l = !1),
              i.style !== h.style && i.updateStyle(h.style, h.anchor));
            break;
          }
        }
        if (l) {
          const s = new Zd(h, t.tileCoord);
          if ((s.moveTo(r), s.updateDistance(c), o.push(s), e++, e > 800))
            break;
        }
      }
      (this.remove(n),
        this.map.addOverlays(o, !0),
        this.Yt(),
        this.getSource().changed());
    }
    _t(t) {
      if (Et(this.labelsExtent, t)) return;
      kt(Gs.wide, t, this.labelsExtent);
      for (let t = Yn.zooms.min; t <= Yn.zooms.max; t++)
        this.getSource().tileGrid.getTileRangeForExtentAndZ(
          this.labelsExtent,
          t,
          this.tileRanges[t]
        );
      const s = [],
        i = this.map.view.getCenter();
      for (let t = this.labels.length; t--; ) {
        const h = this.labels[t],
          [e, n, r] = h.tileCoord,
          o = this.tileRanges[e],
          a = o.minX,
          c = o.maxX;
        n < a || n > c || r < o.minY || r > o.maxY
          ? s.push(h)
          : h.updateDistance(i);
      }
      s.length > 0 && (this.remove(s), this.getSource().changed());
    }
    Yt(t) {
      void 0 === t && (t = !1);
      let s = t;
      const i = lr.et();
      for (let t = this.labels.length; t--; ) {
        const h = this.labels[t],
          [e, n] = Yt(h.coordinate);
        (lr.ct(e, n, i) ? h.jt() && (s = !0) : h.Gt() && (s = !0),
          s && h.updateSize());
      }
      s && this.getSource().changed();
    }
    remove(t) {
      for (let s = t.length; s--; ) this.map.removeOverlay(t[s], !0);
    }
  }
  const $d = "LineString",
    Vd = "Polygon";
  class Kd extends Kr {
    constructor(t, s) {
      (super(t), (this.feature = s));
    }
  }
  const Jd = "drawstart",
    Xd = "drawend";
  class Qd extends Eo {
    constructor(t) {
      const s = t;
      let i, h;
      switch (
        (s.stopDown || (s.stopDown = uo),
        super(s),
        (this.shouldHandle = !1),
        (this.downPixel = null),
        this.downTimeout,
        this.lastDragTime,
        (this.source = t.source),
        (this.type = t.type),
        this.type)
      ) {
        case hc:
        case nc:
          ((i = $d), (h = lc));
          break;
        case ec:
          ((i = Vd), (h = vc));
      }
      ((this.mode = i),
        (this.geometryConstructor = h),
        (this.minPoints = this.mode === Vd ? 3 : 2),
        (this.dragVertexDelay = 500),
        (this.finishCoordinate = null),
        (this.sketchFeature = null),
        (this.sketchPoint = null),
        (this.sketchCoords = null),
        (this.sketchLine = null),
        (this.sketchLineCoords = null),
        (this.squaredClickTolerance = 36),
        (this.overlay = new Gl({
          source: new Yl({
            wrapX: !!t.wrapX && t.wrapX,
          }),
          style: t.style,
        })),
        Gr(this, io("active"), this.updateState, this));
    }
    setMap(t) {
      (super.setMap(t), this.updateState());
    }
    getGeometry(t, s) {
      let i = s;
      return (
        i
          ? this.mode === Vd
            ? t[0].length
              ? i.setCoordinates([t[0].concat([t[0][0]])])
              : i.setCoordinates([])
            : i.setCoordinates(t)
          : (i = new this.geometryConstructor(t)),
        i
      );
    }
    handleEvent(t) {
      let s = t.type === bo,
        i = !0;
      return (
        this.lastDragTime &&
          t.type === vo &&
          (Date.now() - this.lastDragTime >= this.dragVertexDelay
            ? ((this.downPixel = t.pixel), (this.shouldHandle = !0), (s = !0))
            : (this.lastDragTime = void 0),
          this.shouldHandle &&
            void 0 !== this.downTimeout &&
            (clearTimeout(this.downTimeout), (this.downTimeout = void 0))),
        s && this.targetPointers.length < 2
          ? ((i = t.type === bo),
            ("mouse" === t.pointerEvent.pointerType ||
              (t.type === vo && void 0 === this.downTimeout)) &&
              this.handlePointerMove(t))
          : t.type === o && (i = !1),
        super.handleEvent(t) && i
      );
    }
    handleDownEvent(t) {
      return (
        !t.originalEvent.defaultPrevented &&
        ((this.shouldHandle = !0),
        (this.lastDragTime = Date.now()),
        (this.downPixel = t.pixel),
        (this.downTimeout = setTimeout(() => {
          this.handlePointerMove(
            new Co(bo, t.map, t.pointerEvent, !1, t.frameState)
          );
        }, this.dragVertexDelay)),
        !0)
      );
    }
    handleUpEvent(t) {
      let s = !0;
      return (
        this.downTimeout &&
          (clearTimeout(this.downTimeout), (this.downTimeout = void 0)),
        this.handlePointerMove(t),
        this.shouldHandle &&
          (this.finishCoordinate
            ? this.atFinish(t)
              ? this.finishDrawing()
              : this.addToDrawing(t)
            : this.startDrawing(t),
          (s = !1)),
        s
      );
    }
    handlePointerMove(t) {
      if (this.shouldHandle && Array.isArray(this.downPixel)) {
        const s = this.downPixel,
          i = t.pixel;
        if (
          Array.isArray(i) &&
          ((this.shouldHandle =
            mt(s[0], s[1], i[0], i[1]) <= this.squaredClickTolerance),
          !this.shouldHandle)
        )
          return !0;
      }
      return (
        this.finishCoordinate
          ? this.modifyDrawing(t)
          : this.createOrUpdateSketchPoint(t),
        !0
      );
    }
    checkDone() {
      if (!this.sketchFeature)
        return {
          isDone: !1,
          coordinates: [],
        };
      const t = this.sketchCoords;
      let s = !1,
        i = [this.finishCoordinate];
      return (
        this.mode === $d
          ? (s = t.length > this.minPoints)
          : this.mode === Vd &&
            ((s = t[0].length > this.minPoints),
            (i = [t[0][0], t[0][t[0].length - 2]])),
        {
          isDone: s,
          coordinates: i,
        }
      );
    }
    atFinish(t) {
      let s = !1;
      if (this.sketchFeature) {
        const { isDone: i, coordinates: h } = this.checkDone();
        if (i) {
          const i = t.pixel;
          if (!Array.isArray(i)) return s;
          const e = Kh.touch ? 20 : 12;
          for (let n = 0, r = h.length; n < r; n++) {
            const r = h[n],
              o = t.map.getPixelFromCoordinate(r),
              a = i[0] - o[0],
              c = i[1] - o[1];
            if (((s = ft(a, c) <= e), s)) {
              this.finishCoordinate = r;
              break;
            }
          }
        }
      }
      return s;
    }
    createOrUpdateSketchPoint(t) {
      if (!Array.isArray(t.coordinate)) return;
      const s = t.coordinate.slice();
      this.sketchPoint
        ? this.sketchPoint.getGeometry().setCoordinates(s)
        : ((this.sketchPoint = new fl(new wc(s))), this.updateSketchFeatures());
    }
    startDrawing(t) {
      const s = t.coordinate;
      Array.isArray(s) &&
        ((this.finishCoordinate = s.slice()),
        this.mode === Vd
          ? ((this.sketchCoords = [[s.slice(), s.slice()]]),
            (this.sketchLineCoords = this.sketchCoords[0]))
          : (this.sketchCoords = [s.slice(), s.slice()]),
        this.sketchLineCoords &&
          (this.sketchLine = new fl(new lc(this.sketchLineCoords))),
        (this.sketchFeature = new fl(this.getGeometry(this.sketchCoords))),
        this.updateSketchFeatures(),
        this.dispatchEvent(new Kd(Jd, this.sketchFeature)));
    }
    modifyDrawing(t) {
      let s = t.coordinate;
      if (!Array.isArray(s)) return;
      const i = this.sketchFeature.getGeometry();
      let h, e, n;
      if (
        (this.mode === Vd
          ? ((h = this.sketchCoords[0]),
            (e = h.at(-1)),
            this.atFinish(t) && (s = this.finishCoordinate.slice()))
          : ((h = this.sketchCoords), (e = h.at(-1))),
        (e[0] = s[0]),
        (e[1] = s[1]),
        this.getGeometry(this.sketchCoords, i),
        this.sketchPoint && this.sketchPoint.getGeometry().setCoordinates(s),
        i.getType() === ec && this.mode !== Vd)
      ) {
        this.sketchLine || (this.sketchLine = new fl());
        const t = i.getLinearRing(0);
        ((n = this.sketchLine.getGeometry()),
          n
            ? (n.setFlatCoordinates(t.getLayout(), t.getFlatCoordinates()),
              n.changed())
            : ((n = new lc(t.getFlatCoordinates(), t.getLayout())),
              this.sketchLine.setGeometry(n)));
      } else
        this.sketchLineCoords &&
          ((n = this.sketchLine.getGeometry()),
          n.setCoordinates(this.sketchLineCoords));
      this.updateSketchFeatures();
    }
    addToDrawing(t) {
      const s = t.coordinate;
      if (!Array.isArray(s)) return;
      const i = this.sketchFeature.getGeometry();
      let h;
      (this.mode === $d
        ? ((this.finishCoordinate = s.slice()),
          (h = this.sketchCoords),
          h.push(s.slice()),
          this.getGeometry(h, i))
        : this.mode === Vd &&
          ((h = this.sketchCoords[0]),
          h.push(s.slice()),
          this.getGeometry(this.sketchCoords, i)),
        this.updateSketchFeatures());
    }
    removeLastPoint() {
      if (!this.sketchFeature) return;
      const t = this.sketchFeature.getGeometry();
      let s, i;
      (this.mode === $d
        ? ((s = this.sketchCoords),
          s.splice(-2, 1),
          this.getGeometry(s, t),
          s.length >= 2 && (this.finishCoordinate = s[s.length - 2].slice()))
        : this.mode === Vd &&
          ((s = this.sketchCoords[0]),
          s.splice(-2, 1),
          (i = this.sketchLine.getGeometry()),
          i.setCoordinates(s),
          this.getGeometry(this.sketchCoords, t)),
        0 === s.length && (this.finishCoordinate = null),
        this.updateSketchFeatures());
    }
    finishDrawing() {
      const t = this.abortDrawing();
      if (!t) return;
      let s = this.sketchCoords;
      const i = t.getGeometry();
      (this.mode === $d
        ? (s.pop(), this.getGeometry(s, i))
        : this.mode === Vd &&
          (s[0].pop(), this.getGeometry(s, i), (s = i.getCoordinates())),
        this.dispatchEvent(new Kd(Xd, t)),
        this.source && this.source.addFeature(t));
    }
    abortDrawing() {
      this.finishCoordinate = null;
      const t = this.sketchFeature;
      return (
        t &&
          ((this.sketchFeature = null),
          (this.sketchPoint = null),
          (this.sketchLine = null),
          this.overlay.getSource().clear(!0)),
        t
      );
    }
    extend(t) {
      const s = t.getGeometry();
      ((this.sketchFeature = t), (this.sketchCoords = s.getCoordinates()));
      const i = this.sketchCoords.at(-1);
      ((this.finishCoordinate = i.slice()),
        this.sketchCoords.push(i.slice()),
        this.updateSketchFeatures(),
        this.dispatchEvent(new Kd(Jd, this.sketchFeature)));
    }
    updateSketchFeatures() {
      const t = [];
      (this.sketchFeature && t.push(this.sketchFeature),
        this.sketchLine && t.push(this.sketchLine),
        this.sketchPoint && t.push(this.sketchPoint));
      const s = this.overlay.getSource();
      (s.clear(!0), s.addFeatures(t));
    }
    updateState() {
      const t = this.map,
        s = this.getActive();
      ((t && s) || this.abortDrawing(), this.overlay.setMap(s ? t : null));
    }
  }
  const tf = "cancel",
    sf = "start",
    hf = (t) => t instanceof vc,
    ef = (t) => {
      const s = t.getGeometry();
      return hf(s)
        ? ((t) => {
            const s = [],
              i = t.clone().toGeodeticArray().getCoordinates()[0],
              h = i.length - 1;
            for (let t = 0; t < h; t++) {
              const h = nl.inverseLine(
                  i[t][1],
                  i[t][0],
                  i[t + 1][1],
                  i[t + 1][0]
                ),
                e = Math.ceil(h.s13 / 10000);
              for (let t = 0; t <= e; t++) {
                const i = h.position(Math.min(10000 * t, h.s13), $c);
                s.push([i.lon2, i.lat2]);
              }
            }
            return new vc([s]).toWebMercator();
          })(s)
        : s instanceof lc
          ? rl(s)
          : s;
    },
    nf = new $l({
      url: `${Ui} width=%2214%22 height=%2214%22 viewBox=%220 0 14 14%22%3e%3ccircle cx=%227%22 cy=%227%22 r=%227%22 fill=%22%23000%22/%3e%3ccircle cx=%227%22 cy=%227%22 r=%225%22 fill=%22%23fff%22/%3e%3c/svg%3e`,
      imgSize: [14, 14],
    }),
    rf = new ql("rgba(255,255,255,0.2)"),
    of = new Vl({
      color: "#000",
      lineJoin: "round",
      width: 5,
    });
  class af extends lo {
    constructor(t, s) {
      super({
        childElement: Xi(
          "div",
          (t ? "active" : "") + (s ? " hidden" : ""),
          Xi("span")
        ),
        className: "measure-label",
      });
    }
    updateText(t) {
      let s, i;
      var h, e;
      (hf(t)
        ? ((h = t),
          (e = Yn.user.areaUnit),
          (s = al(
            ((t) => {
              const s = t.getCoordinates()[0];
              if (s.length < 3) return 0;
              const i = nl.polygon();
              s.forEach((t) => i.addPoint(t[1], t[0]));
              const { area: h } = i.compute(!1, !0);
              return Math.abs(h);
            })(h.clone().toGeodeticArray()),
            e
          )),
          (i = t.getInteriorPoint().getCoordinates()))
        : ((s = ((t, s) =>
            ((t, s, i) => {
              if ($s(t))
                switch (s) {
                  case Je.METRIC:
                    return ol(t, i, Vt) + " " + Is.unit.km;
                  case Je.IMPERIAL:
                    return ol(t * Jt, i, 5280) + " " + Is.unit.miles;
                  case Je.NAUTICAL:
                    return ol(t, i, 1852) + " " + Is.unit.nm;
                }
            })(
              ((t) => {
                let s = 0;
                return (
                  t.forEachSegment((t, i) => {
                    const h = nl.inverse(t[1], t[0], i[1], i[0]);
                    s += h.s12;
                  }),
                  s
                );
              })(t.clone().toGeodeticArray()),
              s
            ))(t, Yn.user.distanceUnit)),
          (i = rl(t).getFlatMidpoints())),
        s &&
          (ah(this.childElement.children[0], s),
          this.updateSize(),
          this.moveTo(i),
          uh(this.childElement, "hidden")));
    }
  }
  class cf extends ji {
    constructor() {
      (super(),
        (this.layer = new Gl({
          source: new Yl({
            wrapX: !1,
          }),
          style: [
            new ul({
              fill: rf,
              stroke: of,
              geometry: ef,
            }),
            new ul({
              stroke: new Vl({
                color: "#fff",
                width: 2.5,
                lineJoin: "round",
              }),
              geometry: ef,
            }),
          ],
          zIndex: 3,
        })),
        (this.map = null),
        (this.overlay = null),
        (this.session = Yn.measure),
        Ys(this.session) || (this.session = {}),
        (this.type = null),
        (this.draw = null),
        (this.drawListener = null),
        (this.removeEvent = null),
        (this.features = {}),
        (this.overlays = {}),
        (this.isActive = !1),
        (this.isEnding = !1));
    }
    start(s) {
      ((this.type = s),
        (this.isActive = !0),
        (this.overlay = new af(!0, !0)),
        (this.draw = new Qd({
          source: this.layer.getSource(),
          type: "area" === this.type ? "Polygon" : "LineString",
          style: [
            new ul({
              fill: rf,
              stroke: of,
              geometry: ef,
            }),
            new ul({
              stroke: new Vl({
                color: "#fff",
                width: 2.5,
                lineJoin: "round",
                lineCap: "butt",
                lineDash: [8, 10],
              }),
              image: nf,
              geometry: ef,
            }),
          ],
        })),
        this.draw.on(Jd, (s) => {
          this.drawListener = s.feature.getGeometry().on(t, (t) => {
            this.overlay.updateText(t.target);
          });
        }),
        this.draw.on(Xd, (t) => {
          const s = t.feature.getGeometry();
          (this.add(s.uid, t.feature, this.overlay),
            this.saveSession(s),
            this.end());
        }),
        this.dispatchEvent({
          type: sf,
          measure: this.type,
        }));
    }
    complete() {
      this.draw.checkDone().isDone ? this.draw.finishDrawing() : this.cancel();
    }
    end() {
      ((this.isEnding = !0),
        ((t) => {
          if (Array.isArray(t))
            for (let s = 0, i = t.length; s < i; s++) Br(t[s]);
          else Br(t);
        })(this.drawListener),
        (this.drawListener = null),
        (this.overlay.childElement.className = ""),
        this.dispatchEvent({
          type: "end",
          measure: this.type,
        }),
        (this.isActive = !1),
        (this.draw = null),
        (this.overlay = null),
        this.qt(),
        setTimeout(() => {
          this.isEnding = !1;
        }, 300));
    }
    cancel() {
      this.isActive &&
        (this.dispatchEvent({
          type: tf,
          measure: this.type,
        }),
        this.end());
    }
    hide() {
      this.layer.setVisible(!1);
    }
    show() {
      this.layer.setVisible(!0);
    }
    add(t, s, i) {
      ((this.features[t] = s), (this.overlays[t] = i));
      const h = Ki(i.childElement, Xi("button", "remove", Xi("span")));
      (h.setAttribute("aria-label", Is.button.remove),
        _i(h, wo, (t) => {
          (th(t), (this.removeEvent = t));
        }),
        _i(h, bo, (t) => {
          this.removeEvent &&
            ft(
              t.clientX - this.removeEvent.clientX,
              t.clientY - this.removeEvent.clientY
            ) > 2 &&
            (this.removeEvent = null);
        }),
        _i(h, xo, (s) => {
          this.removeEvent && ((this.removeEvent = null), this.remove(t));
        }));
    }
    remove(t) {
      this.isEnding = !0;
      const s = this.features[t];
      (s && (this.layer.getSource().removeFeature(s), delete this.features[t]),
        this.map.removeOverlay(this.overlays[t]),
        delete this.overlays[t],
        delete this.session.areas[t],
        delete this.session.distances[t],
        this.updateSession(),
        setTimeout(() => {
          this.isEnding = !1;
        }, 300));
    }
    addSession(t) {
      const s = new fl({
        geometry: t,
      });
      this.layer.getSource().addFeature(s);
      const i = new af(!1, !1);
      i.updateText(t);
      const h = t.uid;
      return (this.add(h, s, i), this.map.addOverlay(i, this.map.measures), h);
    }
    loadSession(t) {
      this.map = t;
      let s = {};
      if (this.session.areas)
        for (let t in this.session.areas) {
          const i = this.session.areas[t];
          s[this.addSession(new vc(i))] = i;
        }
      let i = {};
      if (this.session.distances)
        for (let t in this.session.distances) {
          const s = this.session.distances[t];
          i[this.addSession(new lc(s))] = s;
        }
      ((this.session.areas = s),
        (this.session.distances = i),
        this.updateSession());
    }
    saveSession(t) {
      const s = t.getCoordinates(),
        i = t.uid;
      (hf(t) ? (this.session.areas[i] = s) : (this.session.distances[i] = s),
        this.updateSession());
    }
    updateSession() {
      Yn.measure = this.session;
    }
    qt() {
      for (const t in this.overlays) {
        const s = this.features[t].getGeometry();
        (this.overlays[t].updateText(s), s.changed());
      }
    }
  }
  class lf {
    constructor(t, s) {
      this.reset(t, s);
    }
    reset(t, s) {
      ((this.x = Math.random() * t),
        (this.y = Math.random() * s),
        (this.age = Math.floor(200 * Math.random())));
    }
    pan(t, s, i, h) {
      ((this.x = nt(this.x + t, i)), (this.y = nt(this.y + s, h)));
    }
    update(t, s, i, h, e, n, r) {
      this.age > 200 && this.reset(h, e);
      const o = t && t[Math.round(this.y * i)],
        a = o && o[Math.round(this.x * i)];
      if (a) {
        const t = this.x + a[0] * n,
          i = this.y - a[1] * n;
        (s.moveTo(this.x, this.y), s.lineTo(t, i), (this.x = t), (this.y = i));
      } else this.age = 200;
      this.age += r;
    }
  }
  class uf extends gd {
    constructor() {
      (super(),
        (this.layer = Re.WIND_SPEED),
        (this.fieldCanvas = xr()),
        (this.fieldContext = null),
        (this.field = [[]]),
        (this.canvasScale = 0.5));
    }
    draw(t, s, i, h) {
      if (!(t && s && i && h)) return;
      super.draw(t, s, !0, We);
      const e = Math.ceil(i * this.canvasScale),
        n = Math.ceil(h * this.canvasScale);
      (Tr(this.fieldCanvas, e, n),
        (this.fieldContext = Ir(Er(this.fieldCanvas, !1, !0), We)));
      const r = 2 ** (s - this.mapZoom) * this.canvasScale,
        o = (t[0] - this.extent[0]) * this.mapScale,
        a = (this.extent[3] - t[3]) * this.mapScale;
      try {
        this.fieldContext.drawImage(
          this.canvas,
          o,
          a,
          e / r,
          n / r,
          0,
          0,
          e,
          n
        );
      } catch (t) {}
      let c;
      try {
        c = this.fieldContext.getImageData(0, 0, e, n).data;
      } catch (t) {
        return;
      }
      let l = 0;
      if (this.field.length === n && this.field[0].length === e)
        for (let t = 0; t < n; t++) {
          const s = this.field[t];
          for (let t = 0; t < e; t++)
            ((s[t][0] = c[l] / 2 - 63.5),
              (s[t][1] = c[l + 1] / 2 - 63.5),
              (l += 4));
        }
      else {
        this.field = new Array(n);
        for (let t = 0; t < n; t++) {
          const s = new Array(e);
          for (let t = 0; t < e; t++)
            ((s[t] = [c[l] / 2 - 63.5, c[l + 1] / 2 - 63.5]), (l += 4));
          this.field[t] = s;
        }
      }
    }
    getWind(t) {
      if (!this.fieldContext || this.field.length < 2) return;
      const s = Math.floor(t[0] * this.canvasScale),
        i = Math.floor(t[1] * this.canvasScale),
        h = this.field[i],
        e = h && h[s];
      if (!e) return;
      const [n, r] = e;
      return {
        speed: ft(n, r),
        direction: ct(Math.atan2(n, r)),
      };
    }
    reset() {
      (Tr(this.fieldCanvas, 0, 0),
        (this.fieldContext = null),
        Tr(this.canvas, 0, 0),
        (this.context = null),
        (this.field = [[]]),
        this.tileCache.clear());
    }
  }
  const df = Kh.safari && Kh.safariVersion < 16,
    ff = {};
  ((ff[Re.SATELLITE] = 1), (ff[Re.PRESSURE] = 2 / 3));
  const mf = 2 / 3;
  class pf extends Qu {
    constructor() {
      (super({
        source: new sd((t) => this.getCanvas(t)),
        updateWhileAnimating: !1,
        updateWhileInteracting: !1,
      }),
        (this.tileSource = new uf()),
        this.tileSource.on(t, (t) => {
          this.start();
        }),
        (this.canvas = xr()),
        (this.context = null),
        (this.wipeCanvas = xr()),
        (this.wipeContext = null),
        (this.extent = null),
        (this.oldExtent = null),
        (this.zoom = 0),
        (this.width = 0),
        (this.height = 0),
        (this.particles = []),
        (this.wipe = 0),
        (this.time = 0),
        (this.rafID = 0),
        (this.fade = 0),
        (this.isReady = !1),
        (this.isPaused = !1),
        this.on(Qo, (t) => {
          (1 === this.getOpacity() &&
            (this.fade < 10 && this.fade++,
            Ir(t.context, `rgba(0,0,0,${0.00625 * this.fade})`)),
            Ar(t.context, yr));
        }),
        this.on(ta, (t) => {
          Ar(t.context, vr);
        }));
    }
    getCanvas(t) {
      const { extent: s, zoom: i, width: h, height: e } = t;
      return (
        (this.oldExtent = this.extent),
        (this.extent = s),
        (this.zoom = i),
        (this.context && this.width === h && this.height === e) ||
          ((this.canvas.width = this.width = h),
          (this.canvas.height = this.height = e),
          (this.context = Ir(Er(this.canvas), "#000")),
          (this.context.strokeStyle = "#c3ddfa"),
          Tr(this.wipeCanvas, h, e),
          (this.wipeContext = Ir(Er(this.wipeCanvas), "#000"))),
        this.setOpacity(Yn.user.isDarkTheme ? mf : ff[Yn.layer] || 0.8),
        this.stop(),
        this.pan(),
        this.start(),
        this.canvas
      );
    }
    resize(t) {
      (this.width === t[0] && this.height === t[1]) ||
        this.getSource().changed();
    }
    pan() {
      let t, s;
      if (this.context && this.oldExtent && this.extent) {
        const i = Nt(this.oldExtent),
          h = Rt(this.oldExtent),
          e = Nt(this.extent),
          n = Rt(this.extent);
        if (ht(i, e, 100) && ht(h, n, 100)) {
          const i = jt(It(this.oldExtent)),
            h = jt(It(this.extent));
          if (
            (i[0] < Ut / -2 && h[0] > Ut / 2
              ? (i[0] += Wt)
              : i[0] > Ut / 2 && h[0] < Ut / -2 && (i[0] -= Wt),
            (t = Math.round(((i[0] - h[0]) / n) * this.height)),
            (s = Math.round(((h[1] - i[1]) / n) * this.height)),
            t || s)
          ) {
            const i = this.context.getImageData(0, 0, this.width, this.height);
            (this.context.fillRect(0, 0, this.width, this.height),
              this.context.putImageData(i, t, s));
          }
        } else this.context.fillRect(0, 0, this.width, this.height);
      }
      const i = et(
        4 * Math.round((this.width * this.height * 0.0025) / 4),
        500,
        8000
      );
      if (t || s || this.particles.length === i)
        for (let h = i; h--; )
          this.particles[h].pan(t, s, this.width, this.height);
      else {
        this.particles = [];
        for (let t = i; t--; )
          this.particles.push(new lf(this.width, this.height));
      }
    }
    start() {
      this.extent &&
        this.canvas &&
        this.width &&
        this.height &&
        (this.stop(),
        (this.rafID = requestAnimationFrame((t) => {
          Yn.overlays.windAnimation &&
            (this.tileSource.draw(
              this.extent,
              this.zoom,
              this.width,
              this.height
            ),
            this.isReady || ((this.isReady = !0), this.draw(t)),
            this.dispatchEvent({
              type: "ready",
            }));
        })));
    }
    draw(t) {
      if (this.context && !this.isPaused && (Yn.Z || !Ns())) {
        const s = 60 / (t ? et(1000 / (t - this.time), 10, 120) : 60);
        if (
          ((this.time = t || mh()),
          (this.context.globalAlpha = 0.08 * s),
          this.context.fillRect(0, 0, this.width, this.height),
          (this.context.globalAlpha = 1),
          this.wipe++,
          this.wipe > 3)
        ) {
          this.wipe = 0;
          try {
            (Ar(this.wipeContext, vr),
              this.wipeContext.drawImage(this.canvas, 0, 0),
              Ar(this.wipeContext, "saturation"),
              Ir(this.wipeContext, "#fff"),
              Ar(this.wipeContext, "color-burn"),
              Ir(this.wipeContext, "#f9f9f9"),
              Ar(this.wipeContext, "color-dodge"),
              Ir(this.wipeContext, "#fff"),
              Ar(this.context, Mr),
              this.context.drawImage(this.wipeCanvas, 0, 0),
              Ar(this.context, vr));
          } catch (t) {}
        }
        const i = Yn.layer === Re.WIND_GUSTS,
          h = this.particles.length / 4,
          e = df && Ns() && Kh.pixelRatio > 2 ? 1.25 : 2.25,
          n = (0.075 * s) / Math.max(1, 5 - this.zoom);
        for (let t = 0; t < 4; t++) {
          ((this.context.lineWidth = (e * (t + 1)) / 4),
            this.context.beginPath());
          const r = t * h;
          for (let t = 0; t < h; t++) {
            const h = this.particles[r + t];
            h.update(
              this.tileSource.field,
              this.context,
              this.tileSource.canvasScale,
              this.width,
              this.height,
              n * (i ? (h.age / 160) ** 3 : 1),
              s
            );
          }
          this.context.stroke();
        }
        this.changed();
      }
      this.rafID = requestAnimationFrame((t) => {
        this.draw(t);
      });
    }
    stop() {
      ((this.isReady = !1), cancelAnimationFrame(this.rafID));
    }
    reset() {
      (this.stop(),
        Tr(this.canvas, 0, 0),
        Tr(this.wipeCanvas, 0, 0),
        (this.context = null),
        (this.wipeContext = null),
        (this.width = 0),
        (this.height = 0),
        (this.extent = null),
        (this.oldExtent = null),
        (this.particles = []),
        (this.fade = 0),
        this.tileSource.reset());
    }
  }
  class gf extends ji {
    constructor(t, s) {
      let i;
      (super(),
        (i = t && $s(t[0]) && $s(t[1]) ? Qt(t) : Qt([-35, Ns() ? -2.5 : 25])),
        s || (s = Yn.zooms.min + (Ls() > 768 ? 1 : 0)));
      const h = new Ma({
          center: i,
          zoom: s,
          extent: [-1 / 0, -Ut, 1 / 0, Ut],
          minZoom: Yn.zooms.min,
          maxZoom: Yn.zooms.max,
        }),
        e = (this.layers = {
          geocolor: {
            goesWest: new qu(Yn.zooms.geocolor.goes, Gs.goesWest, pt.GOES_WEST),
            goesWestWrap: new qu(
              Yn.zooms.geocolor.goes,
              Gs.goesWestWrap,
              pt.GOES_WEST
            ),
            goesEast: new qu(
              Yn.zooms.geocolor.goes,
              Gs.goesEastBeta,
              pt.GOES_EAST
            ),
            goesEastWrap: new qu(
              Yn.zooms.geocolor.goes,
              Gs.goesEastBetaWrap,
              pt.GOES_EAST
            ),
            mtgZero: new qu(Yn.zooms.geocolor.mtg, Gs.mtgZero, pt.MTG_ZERO),
            msgZero: new qu(Yn.zooms.geocolor.msg, Gs.msgZero, pt.MSG_ZERO),
            msgIodc: new qu(Yn.zooms.geocolor.msg, Gs.msgIodc, pt.MSG_IODC),
            himawari: new qu(
              Yn.zooms.geocolor.himawari,
              Gs.himawari,
              pt.HIMAWARI
            ),
            himawariWrap: new qu(
              Yn.zooms.geocolor.himawari,
              Gs.himawariWrap,
              pt.HIMAWARI
            ),
            north: new qu(Yn.zooms.max, Gs.north, "outer"),
            south: new qu(Yn.zooms.max, Gs.south, "outer"),
          },
          hd: new Ku(),
          land: new Ju(),
          fill: new _u(),
          blueMarble: new Gu(),
          data: new vd(),
        }),
        n = (this.overlays = {
          radar: new Pd(),
          coverage: new Fd(),
          heat: new Ld(h.getResolutionForZoom(Yn.zooms.heat)),
          fires: new Id(() => h.getResolution()),
          wind: new pf(),
          terminator: new jd(),
          lines: new Nd(),
          labels: new qd(),
        });
      ((this.loader = new La()),
        (this.storms = new ou(h.getResolutionForZoom(Yn.zooms.stormsMin), () =>
          h.getResolution()
        )),
        (this.marker = new Cd()),
        (this.geoDot = new Rd()),
        (this.tooltip = new pu()),
        (this.measure = new cf()),
        (this.object = new Sa({
          view: h,
          target: document.getElementById("map"),
          pixelRatio: Kh.firefox && !Kh.mobile ? 1 : Kh.pixelRatio,
          overlays: [this.tooltip],
          layers: [
            e.fill,
            e.blueMarble,
            e.geocolor.north,
            e.geocolor.south,
            e.geocolor.msgIodc,
            e.geocolor.mtgZero,
            e.geocolor.msgZero,
            e.geocolor.himawari,
            e.geocolor.himawariWrap,
            e.geocolor.goesEast,
            e.geocolor.goesEastWrap,
            e.geocolor.goesWest,
            e.geocolor.goesWestWrap,
            n.terminator,
            n.coverage,
            n.radar,
            e.data,
            e.land,
            e.hd,
            this.storms.layers.cones,
            this.storms.layers.ww,
            n.lines,
            n.heat,
            n.wind,
            this.storms.layers.tracks,
            this.measure.layer,
            n.fires,
            n.labels,
          ],
        })),
        n.wind.on("ready", (t) => {
          this.$t();
        }),
        n.labels.setMap(this.object),
        n.labels.setDataLayer(e.data),
        this.storms.setMap(this.object),
        (this.favorites = []),
        this.measure.loadSession(this.object),
        (this.frameAnimator = new ka(this.object)),
        (this.timeAnimator = new yu()),
        this.measure.qt(),
        this.updateLabels(),
        this.updateLayers());
    }
    get zoom() {
      return this.object.view.getZoom();
    }
    set zoom(t) {
      $s(t) && this.object.view.setZoom(t);
    }
    get center() {
      return this.object.view.getCenter();
    }
    set center(t) {
      if (Array.isArray(t)) {
        const [s, i] = t;
        $s(s) && $s(i) && this.object.view.setCenter([s, i]);
      }
    }
    get wrappedCenter() {
      return jt(this.center);
    }
    get lonLat() {
      return ss(this.wrappedCenter);
    }
    get mapLon() {
      return this.lonLat[0];
    }
    get mapExtent() {
      return this.object.view.calculateExtent(this.object.size);
    }
    get attributionText() {
      return ((t, s, i, h) => {
        const e = ["© " + Vn],
          n = Yn.Y;
        switch (Yn.layer) {
          case Re.SATELLITE:
            const i = Yn.layers.geocolor.enabled;
            if (s < Yn.zooms.min + 1) {
              e.push(Mu, bu, Au.replace("JMA", Is.agency.jma));
              break;
            }
            if (i[pt.GOES_WEST] && yt(Ws[pt.GOES_WEST], t)) {
              e.push(Mu, Is.satellite[pt.GOES_WEST]);
              break;
            }
            if (Yn.user.isMTGEnabled) {
              if (i[pt.GOES_EAST] && yt(Ws.goesEastBeta, t)) {
                e.push(Mu, Is.satellite[pt.GOES_EAST]);
                break;
              }
              if (i[pt.MTG_ZERO] && yt(Ws[pt.MTG_ZERO], t)) {
                e.push(bu, Is.satellite[pt.MTG_ZERO]);
                break;
              }
            } else {
              if (i[pt.GOES_EAST] && yt(Ws[pt.GOES_EAST], t)) {
                e.push(Mu, Is.satellite[pt.GOES_EAST]);
                break;
              }
              if (i[pt.MSG_ZERO] && yt(Ws[pt.MSG_ZERO], t)) {
                e.push(bu, Is.satellite[pt.MSG_ZERO]);
                break;
              }
            }
            if (i[pt.MSG_IODC] && yt(Ws[pt.MSG_IODC], t)) {
              e.push(bu, Is.satellite[pt.MSG_IODC]);
              break;
            }
            if (
              i[pt.HIMAWARI] &&
              (yt(Ws[pt.HIMAWARI], t) || yt(Ws.himawariWrap, t))
            ) {
              e.push(
                Au.replace("JMA", Is.agency.jma),
                Is.satellite[pt.HIMAWARI]
              );
              break;
            }
            break;
          case Re.SATELLITE_HD:
            e.push(
              "NASA/GSFC/EOSDIS".replace("NASA", Is.agency.nasa),
              Yn.layers.hd.isAM ? "Terra MODIS" : "Aqua MODIS"
            );
            break;
          case Re.RADAR:
            (e.push(Tu), Array.isArray(n) && e.push(...n));
        }
        const r = Yn.isForecastLayer,
          o = xu[Yn.model];
        return (
          r
            ? e.push(Tu, o + (h ? " " + h : ""))
            : !Yn.overlays.windAnimation ||
              (Yn.isGeocolorLayer &&
                Yn.user.isFrameAnimator &&
                Yn.isTimeAnimating) ||
              e.push(o),
          !Yn.overlays.heat || r || Yn.isRadarLayer || e.push("FIRMS"),
          Yn.overlays.radar &&
            Yn.isGeocolorLayer &&
            Array.isArray(n) &&
            e.push(...n),
          Yn.overlays.storms && i && e.push(i),
          e.length > 5 && Ns() && Ii(e, Tu),
          e.join(Is.punctuation.comma)
        );
      })(
        this.center,
        this.zoom,
        this.storms.selectedData && this.storms.selectedData.agencies,
        this.layers.data.tileSource1.runText
      );
    }
    get isWithinGeocolor() {
      return yt(Gs.all, this.center);
    }
    updateExtents() {
      const t = this.center,
        s = Yn.user.isMTGEnabled;
      Yn.isWithinMSG = yt(s ? Ws.msgAllBeta : Ws.msgAll, t);
      const i = Yn.layers.radar.areas,
        h = Yn.layers.radar.attributions,
        e = Yn.Y;
      if (
        ((e.length = 0),
        Yn.layers.radar.hasRange &&
          Array.isArray(i) &&
          Array.isArray(h) &&
          h.length > 0)
      ) {
        Yn.H = !1;
        for (let s = 0, n = i.length; s < n; s++) {
          const n = i[s];
          if (Array.isArray(n)) {
            const i = Qt(n);
            $a(i, 0, i.length, 2, t[0], t[1]) && ((Yn.H = !0), e.push(h[s]));
          }
        }
        e.sort();
      }
      (this.layers.geocolor.goesEast.setExtent(
        s ? Gs.goesEastBeta : Gs.goesEast
      ),
        this.layers.geocolor.goesEastWrap.setExtent(
          s ? Gs.goesEastBetaWrap : Gs.goesEastWrap
        ));
    }
    hasGeocolorOutage(t, s) {
      return (
        Yn.isGeocolorLayer &&
        !Yn.layers.geocolor.enabled[t] &&
        yt(
          Yn.user.isMTGEnabled && t === pt.GOES_EAST ? Ws.goesEastBeta : Ws[t],
          s || this.center
        )
      );
    }
    connectEvents() {
      const t = this.object.target.style;
      (this.object.on(bo, (s) => {
        if (
          (this.updateCoordinate(s.pixel, Kh.touch),
          Kh.touch || this.measure.isActive)
        )
          return;
        const i = s.originalEvent.target,
          h = i.stormID;
        if (h)
          return void (this.frameAnimator.isActive ||
          this.timeAnimator.isPlaying
            ? this.tooltip.hide()
            : this.showStormTooltip(h, "dot-date"));
        const e = this.object.getFeaturesAtPixel(s.pixel),
          n = e[0],
          r = (n && n.id) || "",
          o = /^dot/.test(r),
          a = i === this.marker.element,
          c = i === this.geoDot.element,
          l = s.dragging;
        ((t.cursor = l
          ? "move"
          : o || a || c || /^(line|cone)/.test(r)
            ? "pointer"
            : ""),
          (this.object.labels.style.pointerEvents =
            this.object.favorites.style.pointerEvents =
            this.object.measures.style.pointerEvents =
              l ? "none" : ""));
        const u = this.object.frameState;
        if (
          !(l || (u && (u.viewHints.isAnimating || u.viewHints.isInteracting)))
        )
          return c
            ? ((s.isGeoDot = !0),
              (s.coordinate = this.geoDot.coordinate),
              (s.pixel = this.geoDot.pixel),
              void this.$t(s, e))
            : void (o
                ? this.tooltip.featureID !== r
                  ? /^dot-fire/.test(r)
                    ? this.tooltip.showFire(r, n)
                    : this.showStormTooltip(h, r, n)
                  : this.tooltip.updatePosition()
                : (cancelAnimationFrame(this.tooltip.rafID),
                  (this.tooltip.rafID = requestAnimationFrame(() => {
                    this.$t(s, e);
                  }))));
        this.tooltip.hide();
      }),
        this.object.on(vo, (t) => {
          (this.updateCoordinate(t.pixel, rh(t.originalEvent)),
            this.tooltip.hide());
        }),
        this.object.on(xo, (s) => {
          t.cursor = "";
        }),
        _i(this.object.target, T, (t) => {
          (this.updateCoordinate(), Kh.touch || this.tooltip.hide());
        }));
      const i = (t, s, i, h) => {
        const e = this.storms.data[t];
        e &&
          (this.frameAnimator.stop(),
          this.timeAnimator.stop(),
          (this.storms.selectedID = t),
          "dot-date" === s
            ? (this.tooltip.hide(),
              this.panToStorm(h, () => {
                (this.showStormTooltip(t, s),
                  this.dispatchEvent({
                    type: Y,
                    data: e,
                    index: i,
                  }));
              }))
            : this.panToStormIndex(i, () => {
                this.dispatchEvent({
                  type: Y,
                  data: e,
                  index: i,
                });
              }),
          this.Vt());
      };
      (this.object.on(s, (s) => {
        if (this.measure.isActive || this.measure.isEnding) return;
        clearTimeout(this.tooltip.clickID);
        const h = s.originalEvent.target,
          e = h.stormID;
        if (e) {
          if (this.frameAnimator.isActive) this.tooltip.hide();
          else {
            const t = this.storms.dateDots[e];
            t && i(e, "dot-date", t.index, t.coordinate);
          }
          return;
        }
        this.tooltip.hide();
        const r = this.object.getFeaturesAtPixel(s.pixel),
          o = r[0],
          a = (o && o.id) || "";
        if (((t.cursor = ""), h === this.geoDot.element)) {
          const t = is(this.mapLon, this.geoDot.coordinate.slice());
          return (
            this.moveTo({
              center: t,
              zoom: Math.max(this.zoom, Yn.zooms.geolocationMin),
              callback: () => {
                ((s.isGeoDot = !0),
                  (s.coordinate = t),
                  (s.pixel = this.geoDot.pixel),
                  this.$t(s, r));
              },
            }),
            void this.dispatchEvent({
              type: u,
              coordinate: t,
            })
          );
        }
        if (dh(h.parentElement, "label") || dh(h, "favorite")) return;
        if (h === this.marker.element)
          return void this.moveTo({
            center: is(this.mapLon, this.marker.coordinate.slice()),
            zoom: Math.max(this.zoom, Yn.zooms.markerMin),
          });
        if (!a)
          return void (this.tooltip.clickID = setTimeout(
            () => {
              ((Yn.selectedFireID = null),
                this.$t(s, r),
                Kh.touch ||
                  this.dispatchEvent({
                    type: y,
                    coordinate: s.coordinate,
                  }));
            },
            Kh.touch ? 50 : 285
          ));
        const c = o.getGeometry();
        if (!c) return;
        const d = c.getCoordinates();
        if (/^dot-fire/.test(a)) {
          this.moveTo({
            center: d,
            zoom: Math.max(this.zoom, Yn.zooms.fireDotMin),
            callback: () => {
              this.tooltip.showFire(a, o);
            },
          });
          const t = o.get("data");
          this.dispatchEvent({
            type: l,
            data: {
              id: t.id,
              title: t.name + (t.admin ? ", " + t.admin : ""),
              lonLat: ss(d),
            },
          });
        } else if (/^dot/.test(a)) i(o.get("stormID"), a, o.get("index"), d);
        else {
          if (/^line/.test(a)) {
            const t = o.get("stormID"),
              i = this.storms.data[t];
            if (!i) return;
            this.storms.selectedID = t;
            const h = o.get("index"),
              e = Date.parse(i.track[h].date),
              r = Date.parse(i.track[h + 1].date);
            if (isNaN(e) || isNaN(r)) return;
            const a = jt(s.coordinate);
            let c;
            for (let t = 0, s = d.length - 1; t < s; t++) {
              const s = hs(a, d[t], d[t + 1]);
              if (s.t >= 0 && s.t <= 1) {
                c = s;
                break;
              }
            }
            const l = hs(a, d[0], d.at(-1));
            return (
              c || (c = l),
              this.panToStorm(c.t >= 0 && c.t <= 1 ? c.point : a, () => {
                this.dispatchEvent({
                  type: Y,
                  data: i,
                  index: h,
                });
              }),
              this.dispatchEvent({
                type: n,
                calendar: "time",
                time: ut(e, r, et(l.t, 0, 1)),
              }),
              void this.updateSources()
            );
          }
          if (/^cone/.test(a)) {
            let t = o.get("stormID"),
              i = this.storms.data[t];
            if (!i) return;
            const h = this.object.getFeaturesAtPixel(s.pixel);
            if (i.invest || i.disturbance) {
              let s = -1;
              for (let e = h.length; e--; ) {
                const n = h[e].get("stormID"),
                  r = this.storms.data[n],
                  o = r ? r.chance7day : void 0;
                void 0 !== o &&
                  o > s &&
                  ((s = o), (t = n), (i = this.storms.data[t]));
              }
            }
            ((this.storms.selectedID = t),
              this.Vt(),
              this.$t(s, h),
              this.dispatchEvent({
                type: Y,
                data: i,
                index: this.storms.closestIndex,
              }));
          }
        }
      }),
        this.object.on(_, (t) => {
          if (
            this.measure.isActive ||
            this.measure.isEnding ||
            t.pointerEvent.propagationStopped ||
            t.map.view.hints.isDragZooming
          )
            return;
          const s = t.originalEvent.target,
            i = s.parentElement;
          if (dh(i, "label")) {
            const t = this.object.labelOverlays.array;
            for (let s = t.length; s--; ) {
              const h = t[s];
              if (h.element === i)
                return (
                  this.moveTo({
                    center: h.coordinate,
                  }),
                  void this.dispatchEvent({
                    type: g,
                    label: h,
                  })
                );
            }
          } else if (dh(s, "favorite")) {
            const t = this.favorites;
            for (let i = t.length; i--; ) {
              const h = t[i];
              if (h.element === s)
                return (
                  this.moveTo({
                    center: h.coordinate,
                  }),
                  void this.dispatchEvent({
                    type: c,
                    location: h.location,
                  })
                );
            }
          }
        }),
        this.object.on(o, (t) => {
          if ((th(t), this.measure.isActive || this.measure.isEnding)) return;
          (clearTimeout(this.tooltip.clickID), this.tooltip.hide());
          const s = Math.round(this.zoom + 1);
          let i;
          if (Yn.overlays.crosshair) i = t.coordinate;
          else {
            const h = this.object.view.getResolutionForZoom(s),
              e = this.object.size;
            i = [
              t.coordinate[0] - (t.pixel[0] - e[0] / 2) * h,
              t.coordinate[1] + (t.pixel[1] - e[1] / 2) * h,
            ];
          }
          this.moveTo({
            center: i,
            zoom: s,
          });
        }),
        this.object.longPress.on(s, (t) => {
          this.measure.isActive ||
            this.measure.isEnding ||
            (clearTimeout(this.tooltip.clickID),
            this.tooltip.hide(),
            this.dispatchEvent({
              type: y,
              coordinate: t.coordinate,
            }));
        }));
    }
    updateLabels() {
      this.overlays.labels.setVisible(Yn.overlays.labels);
    }
    updateLayers() {
      const t = Yn.isGeocolorLayer,
        s = Yn.isHDLayer,
        i = Yn.isRadarLayer,
        h = Yn.isRainLayer,
        e = Yn.user.isDarkTheme,
        n = Yn.isForecastLayer,
        r = Yn.user.isMTGEnabled;
      (this.layers.geocolor.goesWest.setVisible(t),
        this.layers.geocolor.goesWestWrap.setVisible(t),
        this.layers.geocolor.goesEast.setVisible(t),
        this.layers.geocolor.goesEastWrap.setVisible(t),
        this.layers.geocolor.mtgZero.setVisible(t && r),
        this.layers.geocolor.msgZero.setVisible(t && !r),
        this.layers.geocolor.msgIodc.setVisible(t),
        this.layers.geocolor.himawari.setVisible(t),
        this.layers.geocolor.himawariWrap.setVisible(t),
        this.layers.geocolor.north.setVisible(t),
        this.layers.geocolor.south.setVisible(t),
        this.layers.hd.setVisible(s),
        this.layers.blueMarble.setVisible(h && !e),
        this.layers.fill.setVisible(s || h),
        this.layers.land.setVisible(i || n),
        this.layers.land.setInverted(h && e),
        this.layers.land.setOpacity(h && e ? 2 / 3 : 1),
        this.layers.data.setVisible(i || n),
        this.overlays.lines.setVisible(!i && !n && Yn.overlays.lines),
        this.overlays.radar.updateSource(),
        this.overlays.coverage.setVisible(i && Yn.overlays.coverage),
        this.updateData(),
        this.updateWind(),
        this.updateTerminator());
    }
    updateSources() {
      const t = Yn.layers.hd.date.getTime();
      Yn.layers.hd.sourceTime !== t &&
        ((Yn.layers.hd.sourceTime = t),
        this.layers.hd.cancel(),
        this.overlays.heat.cancel());
      const s = Yn.isGeocolorLayer ? Gs.wide : void 0;
      if (
        (this.overlays.lines.setExtent(s),
        this.overlays.heat.setExtent(s),
        this.overlays.radar.setExtent(s),
        Yn.isHDLayer && this.layers.hd.updateSource(),
        this.layers.blueMarble.updateSource(),
        Yn.isGeocolorLayer)
      ) {
        const t =
          this.frameAnimator.isRecording &&
          this.frameAnimator.frame < this.frameAnimator.maxFrames;
        (this.layers.geocolor.goesWest.updateSource(t),
          this.layers.geocolor.goesWestWrap.updateSource(t),
          this.layers.geocolor.goesEast.updateSource(t),
          this.layers.geocolor.goesEastWrap.updateSource(t),
          this.layers.geocolor.mtgZero.updateSource(t),
          this.layers.geocolor.msgZero.updateSource(t),
          this.layers.geocolor.msgIodc.updateSource(t),
          this.layers.geocolor.himawari.updateSource(t),
          this.layers.geocolor.himawariWrap.updateSource(t));
      }
      (this.updateData(),
        this.updateWind(),
        this.overlays.radar.updateSource(),
        this.overlays.coverage.updateSource(),
        this.overlays.heat.updateSource(
          Yn.isHDLayer ? Yn.layers.hd.date : gh(Yn.time, this.mapLon)
        ),
        Yn.overlays.heat && this.object.render(),
        this.overlays.fires.updateVisibility());
    }
    wrapDateLine() {
      if (!Yn.isHDLayer) return;
      const t = this.center,
        s = t[0];
      if (((this.center = jt(t)), Yn.isHDLayer)) {
        if (s > Ut)
          return void this.dispatchEvent({
            type: n,
            calendar: "day",
            delta: -1,
          });
        s < -Ut &&
          this.dispatchEvent({
            type: n,
            calendar: "day",
            delta: 1,
          });
      }
    }
    updateCoordinate(t, s) {
      let i;
      i =
        !t || Yn.overlays.crosshair || s
          ? this.center
          : this.object.getCoordinateFromPixel(t);
      const h = ss(i);
      h &&
        $s(h[0]) &&
        $s(h[1]) &&
        this.dispatchEvent({
          type: e,
          lonLat: h,
          zoom: this.zoom,
        });
    }
    updateData() {
      (Yn.isRadarLayer || Yn.isForecastLayer) &&
        (this.layers.data.update(), this.layers.data.getSource().changed());
    }
    Kt(t) {
      if (!Yn.j) return;
      const s = this.mapExtent,
        i = this.zoom;
      if (Yn.isGeocolorLayer)
        return (
          this.layers.geocolor.goesWest
            .getSource()
            .preload(kt(s, Gs.goesWest), i, t),
          this.layers.geocolor.goesEast
            .getSource()
            .preload(
              kt(s, Yn.user.isMTGEnabled ? Gs.goesEastBeta : Gs.goesEast),
              i,
              t
            ),
          Yn.user.isMTGEnabled
            ? this.layers.geocolor.mtgZero
                .getSource()
                .preload(kt(s, Gs.mtgZero), i, t)
            : this.layers.geocolor.msgZero
                .getSource()
                .preload(kt(s, Gs.msgZero), i, t),
          this.layers.geocolor.msgIodc
            .getSource()
            .preload(kt(s, Gs.msgIodc), i, t),
          this.layers.geocolor.himawari
            .getSource()
            .preload(kt(s, Gs.himawari), i, t),
          void (
            Yn.overlays.radar &&
            this.overlays.radar.getSource().preload(s, i, t)
          )
        );
      (Yn.isRadarLayer || Yn.isForecastLayer) &&
        this.layers.data.tileSource2.preload(s, i, t);
    }
    updateWind() {
      Yn.overlays.windAnimation && !this.frameAnimator.isActive
        ? (this.overlays.wind.tileSource.update(),
          this.overlays.wind.getSource().changed(),
          this.overlays.wind.setVisible(!0))
        : (this.overlays.wind.reset(), this.overlays.wind.setVisible(!1));
    }
    $t(t, s) {
      if (!(t = t || this.tooltip.event)) return;
      ((s = s || this.tooltip.features),
        (this.tooltip.event = t),
        (this.tooltip.features = s));
      const i = t.coordinate,
        h = i[1];
      if (
        this.measure.isActive ||
        this.frameAnimator.isActive ||
        Math.abs(h) > Ut
      )
        return void this.tooltip.hide();
      let e;
      Yn.overlays.windAnimation &&
        this.overlays.wind.isReady &&
        (e = this.overlays.wind.tileSource.getWind(t.pixel));
      const n = Yn.isGeocolorLayer,
        r = Yn.isHDLayer,
        o = Yn.isRadarLayer;
      let a, c, l, u;
      (o || Yn.isForecastLayer) && (a = this.layers.data.getValues(i));
      let d = !n && !r && void 0,
        f = (!o || !Yn.overlays.coverage) && void 0;
      if (
        ((n || r || o) &&
          this.object.renderer.forEachLayerAtPixel(
            t.pixel,
            this.object.frameState,
            (t, s) => {
              if (t instanceof qu)
                !c && h > Gs.all[1] && h < Gs.all[3] && ((c = s), (d = !0));
              else
                switch (t) {
                  case this.layers.hd:
                    d = !0;
                    break;
                  case this.overlays.radar:
                    l = s;
                    break;
                  case this.overlays.coverage:
                    f = s[0] < 128;
                    break;
                  case this.overlays.heat:
                    u = s[0] > 28;
                }
            },
            (t) => t.tooltipEnabled
          ),
        d && n)
      )
        for (let t = gt.length; t--; ) {
          const s = gt[t];
          if (
            s !== (Yn.user.isMTGEnabled ? pt.MSG_ZERO : pt.MTG_ZERO) &&
            this.hasGeocolorOutage(s, i)
          ) {
            d = !1;
            break;
          }
        }
      this.tooltip.showInfo(c, d, l, f, e, a, u, t.isGeoDot, s, i);
    }
    updateTerminator() {
      (this.overlays.terminator.setVisible(
        Yn.overlays.terminator &&
          !this.frameAnimator.isRecording &&
          !Yn.isHDLayer
      ),
        this.timeAnimator.isPlaying || this.overlays.terminator.update());
    }
    Vt(t) {
      if (!Yn.overlays.storms) return;
      const s = this.mapLon;
      for (let i in this.storms.dateDots) this.storms.Ct(i, s, t);
      t ||
        (this.storms.trackSource.changed(),
        this.storms.wwSource.changed(),
        this.storms.coneSource.changed());
    }
    Jt(t, s) {
      const i = Yn.overlays.storms;
      (this.storms.layers.tracks.setVisible(i),
        this.storms.layers.ww.setVisible(
          i && (Yn.isGeocolorLayer || Yn.isHDLayer)
        ),
        this.storms.layers.cones.setVisible(i),
        i && this.storms.loadDates(this.mapExtent, t, s));
    }
    Xt(t) {
      const s = this.storms.data[t];
      if (!s) return !1;
      ((this.storms.selectedID = t),
        s.active
          ? (this.storms.selectedIndex = s.track.length - 1)
          : (this.storms.selectedIndex = Bs(s.forecast, s.max)),
        (this.zoom = Yn.zooms.storms),
        this.selectStormDate(!1));
      const i = this.storms.extent;
      (Array.isArray(i) &&
        $s(i[0]) &&
        this.object.view.fit(i, {
          size: this.object.size,
          padding: this.storms.activePadding,
        }),
        (this.center = this.storms.Ct(t, this.mapLon)));
      const h =
        Yn.zooms.storms + (Yn.isGeocolorLayer && !Yn.isWithinMSG ? 2 : 1);
      this.zoom < h && (this.zoom = h);
      const e = Yn.zooms.stormsMax;
      return (this.zoom > e && (this.zoom = e), this.updateSources(), !0);
    }
    panToStorm(t, s) {
      const i = this.storms.selectedData;
      if (!i) return;
      if (!t && null === this.storms.selectedIndex) return;
      const h = is(
        this.mapLon,
        t || Qt(i.track[this.storms.selectedIndex].coordinates)
      );
      let e = this.zoom;
      const n = Math.round(e) - e;
      (Math.abs(n) < 0.2 && (e = Math.round(this.zoom + n)),
        this.moveTo({
          center: h,
          zoom: Math.max(e, Yn.zooms.storms + (Yn.B ? 1 : 0)),
          callback: s,
        }),
        this.updateSources());
    }
    panToStormIndex(t, s) {
      ((this.storms.selectedIndex = t),
        this.selectStormDate(!0),
        this.Vt(),
        this.panToStorm(void 0, () => {
          (this.showStormTooltip(this.storms.selectedID), qs(s) && s());
        }));
    }
    selectStormDate(t) {
      const s = this.storms.selectedData;
      if (!s) return;
      const i = this.storms.selectedIndex,
        h = s.track[i];
      if (!h) return;
      const e = mh(),
        r = new Date(s.active && !t && i === s.track.length - 1 ? e : h.date);
      if (isNaN(r.getTime())) return;
      const o = Yn.isHDLayer,
        a = _t(h.coordinates[0]),
        c = o ? gh(h.date, a) : r;
      if (isNaN(c.getTime())) return;
      const l = Yn.forecastRange,
        u = o
          ? gh(e - 43200000, a)
          : t && l && Yn.isForecastLayer
            ? l.maxDate
            : new Date(e);
      if ((c.getTime() > u.getTime() && c.setTime(u.getTime()), o)) {
        const t = s.track.at(-1);
        if (t) {
          const s = Date.parse(t.date);
          !isNaN(s) && c.getTime() > s && c.setTime(s);
        }
        const i = s.track[0];
        if (i) {
          const t = Date.parse(i.date);
          !isNaN(t) && c.getTime() < t && c.setTime(t);
        }
      }
      Yn.layers.hd.isAM =
        c.getUTCHours() < 12 || c.getTime() < _s.aqua.getTime();
      const d = c.getTime();
      d === e
        ? this.dispatchEvent({
            type: n,
            calendar: "recent",
          })
        : this.dispatchEvent({
            type: n,
            calendar: "time",
            time: d,
          });
    }
    showStormTooltip(t, s, i) {
      if (this.frameAnimator.isPlaying) return;
      !t && i && (t = i.get("stormID"));
      const h = this.storms.data[t];
      if (!h) return;
      const e = this.storms.dateDots[t];
      if (e)
        if ("dot-date" !== s) {
          if (
            (i ||
              ((s = `dot-${this.storms.selectedIndex}-${t}`),
              (i = this.storms.trackSource.getFeatureByID(s))),
            i)
          ) {
            const t = i.getGeometry().getCoordinates();
            this.tooltip.showStorm(
              ur(t, e.coordinate) ? "dot-selected" : s,
              t,
              this.mapLon,
              h,
              i.get("index")
            );
          }
        } else this.tooltip.showStorm(s, e.coordinate, this.mapLon, h, e.index);
    }
    showFireTooltip(t) {
      const s = "dot-fire-" + t,
        i = this.overlays.fires.getSource().getFeatureByID(s);
      if (i)
        return (
          setTimeout(() => {
            this.tooltip.showFire(s, i);
          }, 300),
          !0
        );
    }
    zoomBy(t, s, i) {
      (void 0 === t && (t = 1),
        void 0 === s && (s = !1),
        0 !== t &&
          (this.tooltip.hide(),
          this.moveTo({
            zoom: s ? Math.round(this.zoom + t) : this.zoom + t,
            duration: Bs(i, 200 * (Math.abs(t) > 1 ? 2 : 1)),
          })));
    }
    panBy(t, s, i) {
      if (
        (void 0 === t && (t = 0), void 0 === s && (s = 0), 0 === t && 0 === s)
      )
        return;
      const h = this.object.getPixelFromCoordinate(this.center);
      h &&
        ((h[0] += t),
        (h[1] += s),
        this.tooltip.hide(),
        this.moveTo({
          center: this.object.getCoordinateFromPixel(h),
          easing: gr,
          duration: i,
        }));
    }
    moveTo(t) {
      let {
        center: s,
        zoom: i,
        duration: h = Rs,
        easing: e,
        immediate: n = !1,
        callback: r,
      } = t;
      ((s && $s(s[0]) && $s(s[1])) || (s = this.center),
        (s[1] = et(s[1], -Ut, Ut)),
        $s(i) || (i = this.zoom),
        this.frameAnimator.isRecording && this.frameAnimator.stop(),
        this.object.view.cancelAnimations(),
        this.object.gt(),
        n ||
        (fr(this.center, s) < 5000000 && this.zoom === i) ||
        !yt(wt(this.mapExtent, 100000), s)
          ? setTimeout(() => {
              ((this.center = s),
                (this.zoom = i),
                qs(r) &&
                  setTimeout(() => {
                    r();
                  }, Gi));
            }, 50)
          : ((this.overlays.wind.isPaused = Yn.overlays.windAnimation),
            this.object.view.animate(
              {
                center: s,
                zoom: i,
                duration: h,
                easing: e,
              },
              () => {
                ((this.overlays.wind.isPaused = !1), qs(r) && r());
              }
            )));
    }
    Qt() {
      const t = this.mapExtent,
        s = Gs.all,
        i = this.center;
      if (t[3] - t[1] > s[3] - s[1])
        return (
          this.object.view.fit([t[0], s[1], t[2], s[3]], {
            size: this.object.size,
          }),
          this.lonLat
        );
      const h = s[3] - t[3];
      if (h < 0) return ((this.center = [i[0], i[1] + h]), this.lonLat);
      const e = s[1] - t[1];
      return e > 0 ? ((this.center = [i[0], i[1] + e]), this.lonLat) : void 0;
    }
    startMeasure(t) {
      this.measure.isActive
        ? this.measure.cancel()
        : (this.measure.start(t),
          this.measure.overlay &&
            this.measure.draw &&
            (this.object.addOverlay(this.measure.overlay, this.object.measures),
            this.object.addInteraction(this.measure.draw)));
    }
    cancelMeasure() {
      this.measure.overlay && this.object.overlays.remove(this.measure.overlay);
    }
    endMeasure() {
      this.measure.draw && this.object.interactions.remove(this.measure.draw);
    }
    ts() {
      (this.geoDot.hideActive(), this.marker.hide());
    }
    ss(t, s) {
      s
        ? (this.marker.hide(), this.geoDot.showActive())
        : (this.tooltip.hide(!0),
          this.geoDot.hideActive(),
          Array.isArray(t) &&
            this.marker.show(
              this.object,
              this.object.marker,
              is(this.mapLon, t)
            ));
    }
    hs() {
      this.marker.map && is(this.mapLon, this.marker.coordinate);
    }
    es() {
      this.geoDot.map && is(this.mapLon, this.geoDot.coordinate);
    }
    ns() {
      for (let t = this.favorites.length; t--; )
        this.object.removeOverlay(this.favorites[t]);
      this.favorites.length = 0;
      const t = lr.et();
      for (let s = t.length; s--; )
        this.favorites.push(new yd(this.object, this.mapLon, t[s]));
      this.overlays.labels.Yt();
    }
  }
  const wf = Object.freeze({
    SLOW: "slow",
    OFFLINE: "warning offline",
    GRAPHICS: "warning graphics button",
    OUTAGE_PREFIX: "warning outage-",
    MAX_ZOOM: "max-zoom",
    SATELLITE: "satellite",
    SATELLITE_HD: "satellite-hd",
    PRECIPITATION: "precipitation",
    RADAR: "radar",
    RAIN: "rain",
    WIND: "wind",
    STORM_SIMILAR_PREFIX: "warning storm-similar-",
    UPDATE: "update button",
  });
  class vf extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".notifications")),
        (this.elements = {}),
        (this.hidden = []),
        (this.local = []),
        (this.showing = []),
        (this.delayIDs = {}),
        (this.durationIDs = {}));
    }
    get total() {
      return Object.keys(this.elements).length;
    }
    update(t) {
      let s = [];
      for (let i in t) {
        const h = t[i],
          e = h.id;
        e &&
          (this.show(h, {
            isRemote: !0,
            canDismiss: !0,
          }),
          s.push(e));
      }
      const i = Object.keys(this.elements).filter(
        (t) => !s.includes(t) && !this.local.includes(t)
      );
      for (let t in i) this.hide(i[t], !1);
    }
    hide(t, s) {
      if ((void 0 === s && (s = !1), !t)) return;
      const i = this.delayIDs[t];
      i && (clearTimeout(i), delete this.delayIDs[t]);
      const h = this.durationIDs[t];
      (h && (clearTimeout(h), delete this.durationIDs[t]), Ii(this.showing, t));
      const e = this.elements[t];
      e && (Vi(e.panel), delete this.elements[t], s && this.hidden.push(t));
    }
    hideAll(t) {
      for (let s = t.length; s--; ) this.hide(t[s], !1);
    }
    dismiss(t) {
      (this.hide(t, !0), Yn.dismissNotification(t));
    }
    has(t) {
      return !!this.elements[t];
    }
    show(t, i) {
      const h = t.id;
      if (
        !h ||
        !t.message ||
        this.hidden.includes(h) ||
        this.showing.includes(h) ||
        Yn.notifications.includes(h)
      )
        return;
      const {
        isRemote: e = !1,
        canRepeat: n = !1,
        canDismiss: r = !1,
        hideAfterDuration: o,
        lowPriority: a = !1,
        delayPredicate: c,
      } = i;
      if (!Kh.storage && !n && r) return;
      if ((this.showing.push(h), t.delay))
        return (
          clearTimeout(this.delayIDs[h]),
          (this.delayIDs[h] = setTimeout(() => {
            (Ii(this.showing, h), (qs(c) && !c()) || this.show(t, i));
          }, 1000 * t.delay)),
          t.duration &&
            (clearTimeout(this.durationIDs[h]),
            (this.durationIDs[h] = setTimeout(
              () => {
                this.hide(h, void 0 === o ? !n : o);
              },
              1000 * (t.delay + t.duration)
            )),
            (t.duration = 0)),
          void (t.delay = 0)
        );
      if (this.elements[h]) {
        if (this.elements[h].message === t.message) return;
        this.hide(h, !1);
      }
      const l = Xi("div", "panel new id-" + h),
        u = Xi("p", r ? "dismiss" : "");
      u.innerHTML = vn(t.message);
      const d = t.url;
      let f = !1;
      if (d) {
        f = !0;
        const t = /^#map=(.*)/.exec(d);
        let i = t && t[1];
        if (
          (Ks(Re, i) || (i = void 0),
          i === Yn.layer || (!t && "/" !== d && -1 !== rr.url.indexOf(d)))
        )
          return;
        const e = /^#model=(.*)/.exec(d);
        let r = e && e[1];
        Ks(ri, r) || (r = void 0);
        const o = Xi("a"),
          a = /^http/.test(d);
        a
          ? ((o.href = d), (o.target = "_blank"), (o.rel = "noopener"))
          : (o.href = d);
        const c = /\/storms\/(.*)\//.exec(d),
          m = c && c[1];
        (_i(
          o,
          s,
          (t) => (
            "/" === d ? (th(t), location.reload()) : this.hide(h, !n),
            i
              ? (th(t),
                void this.dispatchEvent({
                  type: "layer",
                  layer: i,
                }))
              : r
                ? (th(t),
                  void this.dispatchEvent({
                    type: "model",
                    model: r,
                  }))
                : m
                  ? (th(t),
                    void this.dispatchEvent({
                      type: Z,
                      id: m,
                    }))
                  : void (
                      a ||
                      (th(t),
                      this.dispatchEvent({
                        type: w,
                        url: d,
                      }))
                    )
          )
        ),
          Ki(Ki(l, o), u));
      } else if (t.outage) {
        f = !0;
        const i = Xi("a");
        (_i(i, s, (s) => {
          this.dispatchEvent({
            type: k,
            id: t.outage,
          });
        }),
          Ki(Ki(l, i), u));
      } else Ki(l, u);
      if (r) {
        const t = Ki(l, Xi("button", "close", Xi("span")));
        (t.setAttribute("aria-label", Is.button.dismiss),
          _i(t, s, (t) => {
            e ? this.dismiss(h) : this.hide(h, !n);
          }));
      }
      if ((f || r || lh(l, "inert"), /\bwarning\b/.test(h))) Ji(this.dom, l);
      else if (a || /\bsocial\b/.test(h)) Ji(this.dom, l, "beforeend");
      else {
        const t = Array.prototype.slice
          .call($i(this.dom, ".panel.id-warning"))
          .at(-1);
        t ? Ji(t, l, "afterend") : Ji(this.dom, l);
      }
      (setTimeout(() => {
        uh(l, "new");
      }, Gi),
        t.duration &&
          (clearTimeout(this.delayIDs[h]),
          (this.delayIDs[h] = setTimeout(() => {
            this.hide(h, void 0 === o ? !n : o);
          }, 1000 * t.duration))),
        (this.elements[h] = {
          panel: l,
          message: t.message,
        }),
        e || this.local.push(h));
    }
  }
  let yf = !1;
  class Mf extends ji {
    init() {
      dh(document.body, "ad-pause")
        ? setTimeout(() => {
            this.init();
          }, 10000)
        : setTimeout(() => {
            if (qi(document, ".fc-consent-root"))
              return ((yf = !0), void this.init());
            let t = !window.adsbygoogle || !adsbygoogle.loaded;
            this.swappingAd = qi(
              document,
              Kh.mobile ? ".panel.ad-footer" : ".panel.ad-header"
            );
            const s = qi(this.swappingAd, ".swap1");
            if ((t || (t = !this.swappingAd || !s), !t)) {
              const i = qi(s, ".adsbygoogle"),
                h = i && i.dataset && "filled" === i.dataset.adStatus,
                e = qi(this.swappingAd, ".swap2 .adsbygoogle"),
                n = e && e.dataset && "filled" === e.dataset.adStatus;
              h && n
                ? this.rs(!1, !0)
                : !h && n
                  ? this.rs(!0, !1)
                  : h || n || (t = !0);
            }
            t &&
              !yf &&
              this.dispatchEvent({
                type: a,
              });
          }, 10000);
    }
    rs(t, s) {
      (t ? lh(this.swappingAd, "swap") : uh(this.swappingAd, "swap"),
        s &&
          setTimeout(() => {
            this.rs(!t, !0);
          }, 30000));
    }
  }
  const bf = (t, s, i) => {
    let h = "",
      e = "";
    (s || (s = 11), i || (i = Yn.user.coordinateUnit));
    const n = gn(t[0], s),
      r = gn(t[1], s),
      o = Is.unit.degree;
    if (i === Ke.DECIMAL) {
      const t = et(s - 4, 1, 6);
      try {
        ((h = n.toLocaleString(Kh.nonArabicLang, {
          minimumFractionDigits: t,
          maximumFractionDigits: t,
        })),
          (e = r.toLocaleString(Kh.nonArabicLang, {
            minimumFractionDigits: t,
            maximumFractionDigits: t,
          })));
      } catch (s) {
        try {
          ((h = n.toFixed(t)), (e = r.toFixed(t)));
        } catch (t) {}
      }
      return [h.replace("-", wn) + o, e.replace("-", wn) + o];
    }
    const a = s > 14 ? 2 : s > 11 ? 1 : 0,
      c = Mn(n, a);
    let l = c.seconds;
    try {
      l = l.toLocaleString(Kh.nonArabicLang);
    } catch (t) {}
    const u = -1 === c.sign ? Is.direction.west : Is.direction.east;
    h = `${c.degrees}${o} ${Li(c.minutes)}′ ${s >= 6 ? Li(l, a > 0 ? a + 3 : 2) + "″ " : ""}${u}`;
    const d = Mn(r, a);
    let f = d.seconds;
    try {
      f = f.toLocaleString(Kh.nonArabicLang);
    } catch (t) {}
    const m = -1 === d.sign ? Is.direction.south : Is.direction.north;
    return (
      (e = `${d.degrees}${o} ${Li(d.minutes)}′ ${s >= 6 ? Li(f, a > 0 ? a + 3 : 2) + "″ " : ""}${m}`),
      [h, e]
    );
  };
  class Af {
    constructor() {
      ((this.dom = qi(document, ".footer-coordinate")),
        (this.lon = qi(this.dom, ".lon")),
        (this.lat = qi(this.dom, ".lat")),
        _i(this.dom, s, (t) => {
          Yn.user.A();
        }));
    }
    update(t, s) {
      if (t && s) {
        const [i, h] = bf(t, s);
        (ah(this.lon, i), ah(this.lat, h));
      }
    }
  }
  const Tf = "located";
  class xf extends ji {
    constructor() {
      (super(),
        (this.button = qi(document, "button.geolocation")),
        _i(this.button, s, (t) => {
          (this.dispatchEvent({
            type: W,
          }),
            this.request());
        }),
        hh(this.button),
        (this.isLocating = !1),
        (this.os = null),
        (this.cs = null),
        (this.ls = 0));
    }
    us(t, s, i) {
      ((this.isLocating = !1),
        this.dispatchEvent({
          type: d,
          lonLat: t,
          accurate: s,
          update: i,
        }));
    }
    request() {
      this.isLocating ||
        ((this.isLocating = !0),
        this.dispatchEvent({
          type: z,
        }),
        navigator.geolocation && navigator.geolocation.getCurrentPosition
          ? navigator.geolocation.getCurrentPosition(
              (t) => {
                this.us([t.coords.longitude, t.coords.latitude], !0);
              },
              (t) => {
                this.ds(!1);
              },
              {
                enableHighAccuracy: !1,
                timeout: 8000,
                maximumAge: Kh.mobile ? 30000 : 3600000,
              }
            )
          : this.ds(!1));
    }
    hideLocated() {
      uh(this.button, Tf);
    }
    showLocated() {
      lh(this.button, Tf);
    }
    ds(t) {
      this.cs && Date.now() - this.ls < 600000
        ? this.us(this.cs, t)
        : (this.os && this.os.cancel(),
          (this.os = new Xs()),
          this.os
            .load({
              url: cs,
              validate: ["lon", "lat"],
            })
            .then((s) => {
              ((this.cs = [s.lon, s.lat]),
                (this.ls = Date.now()),
                this.us(this.cs, t));
            })
            .catch((t) => {
              ((this.isLocating = !1),
                this.dispatchEvent({
                  type: a,
                }));
            }));
    }
  }
  class Ef {
    constructor() {
      ((this.dom = qi(document, ".hud")),
        (this.panel = qi(this.dom, ".panel")),
        (this.timeoutID = 0));
    }
    hide() {
      (clearTimeout(this.timeoutID), uh(this.dom, j));
    }
    show(t) {
      t &&
        (clearTimeout(this.timeoutID),
        (this.panel.innerHTML = t),
        lh(this.dom, j),
        (this.timeoutID = setTimeout(() => {
          this.hide();
        }, 2500)));
    }
    showLayer(t) {
      this.show(Is.layer.name[t.replace(ke, "")]);
    }
    showOverlay(t, s) {
      this.show(Is.hud.overlay[t][s ? "on" : "off"]);
    }
    showModel() {
      this.show(Is.hud.model.replace("%s", Is.model[Yn.model]));
    }
    showRecent() {
      this.show(
        si(Yn.getDate(), 1).getTime() === si(ph(), 1).getTime()
          ? Is.date.relative.now
          : Is.date.relative.latest
      );
    }
    showSetting(t, s) {
      this.show(Is.punctuation.colon.replace("%s", Is.settings[t]) + s);
    }
  }
  class Df {
    constructor(t, s, i, h, e, n) {
      ((this.step = t),
        (this.count = s),
        (this.first = i),
        (this.min = h),
        (this.max = e),
        (this.values = n));
      const r = this.count * t;
      ((this.last = i + r), (this.span = e - h), (this.scale = this.span / r));
    }
    get html() {
      let t = "";
      const s = this.values ? this.values.length : this.count + 1;
      for (let i = 0; i < s; i++) {
        const h = this.values
            ? this.values[i]
            : (this.first + i * this.step).toString().replace("-", wn),
          e = Math.floor((100 / (s - 1)) * 100000) / 100000;
        t +=
          '<div style="' +
          (i === s - 1 ? "position:absolute;" : "width:" + e + "%") +
          '">' +
          h +
          "</div>";
      }
      return t;
    }
  }
  const If = (t, s) => t + "~" + s,
    Sf = {},
    Rf = Pe[Re.WIND_GUSTS].max;
  ((Sf[If(Re.WIND_GUSTS, an.MS)] = new Df(10, 6, 0, 0, Rf)),
    (Sf[If(Re.WIND_SPEED, an.MS)] = new Df(5, 7, 0, 0, Rf)),
    (Sf[If(Re.WIND_GUSTS, an.KMH)] = new Df(30, 7, 0, 0, Rf * fn[an.KMH])),
    (Sf[If(Re.WIND_SPEED, an.KMH)] = new Df(20, 6, 0, 0, Rf * fn[an.KMH])),
    (Sf[If(Re.WIND_GUSTS, an.KNOTS)] = new Df(20, 6, 0, 0, Rf * fn[an.KNOTS])),
    (Sf[If(Re.WIND_SPEED, an.KNOTS)] = new Df(10, 7, 0, 0, Rf * fn[an.KNOTS])),
    (Sf[If(Re.WIND_GUSTS, an.MPH)] = new Df(20, 7, 0, 0, Rf * fn[an.MPH])),
    (Sf[If(Re.WIND_SPEED, an.MPH)] = new Df(10, 8, 0, 0, Rf * fn[an.MPH])),
    (Sf[If(Re.WIND_GUSTS, an.BEAUFORT)] = Sf[If(Re.WIND_SPEED, an.BEAUFORT)] =
      new Df(6, 1, 0, 0, 11, [0, 3, 5, 7, 9, 10, 11, 12])));
  const kf = Pe[Re.TEMPERATURE];
  ((Sf[If(Re.TEMPERATURE, en.CELSIUS)] = Sf[
    If(Re.TEMPERATURE_FEEL, en.CELSIUS)
  ] =
    new Df(10, 8, -30, kf.min, kf.max)),
    (Sf[If(Re.TEMPERATURE, en.FAHRENHEIT)] = Sf[
      If(Re.TEMPERATURE_FEEL, en.FAHRENHEIT)
    ] =
      new Df(20, 7, -20, dt(kf.min), dt(kf.max))));
  const Lf = Pe[Re.TEMPERATURE_WET_BULB];
  ((Sf[If(Re.TEMPERATURE_WET_BULB, en.CELSIUS)] = new Df(
    10,
    7,
    -30,
    Lf.min,
    Lf.max
  )),
    (Sf[If(Re.TEMPERATURE_WET_BULB, en.FAHRENHEIT)] = new Df(
      20,
      7,
      -30,
      dt(Lf.min),
      dt(Lf.max)
    )));
  const Nf = Pe[Re.DEW_POINT];
  ((Sf[If(Re.DEW_POINT, en.CELSIUS)] = new Df(10, 6, -30, Nf.min, Nf.max)),
    (Sf[If(Re.DEW_POINT, en.FAHRENHEIT)] = new Df(
      15,
      7,
      -20,
      dt(Nf.min),
      dt(Nf.max)
    )));
  const Of = Pe[Re.HUMIDITY];
  Sf[If(Re.HUMIDITY, cn)] = new Df(25, 4, 0, Of.min, Of.max);
  const Cf = Pe[Re.PRESSURE],
    Ff = Cf.min,
    Pf = Cf.max;
  ((Sf[If(Re.PRESSURE, sn.MB)] = Sf[If(Re.PRESSURE, sn.HPA)] =
    new Df(15, 5, 970, Ff, Pf)),
    (Sf[If(Re.PRESSURE, sn.MMHG)] = new Df(
      10,
      5,
      730,
      Ff * dn[sn.MMHG],
      Pf * dn[sn.MMHG]
    )),
    (Sf[If(Re.PRESSURE, sn.INHG)] = new Df(
      0.5,
      5,
      28.5,
      Ff * dn[sn.INHG],
      Pf * dn[sn.INHG]
    )));
  const zf = Fe[Re.PRECIPITATION][1].min,
    Uf = Fe[Re.PRECIPITATION][1].max;
  Sf[If(Re.RADAR, ln)] = Sf[If(Re.PRECIPITATION, ln)] = new Df(
    11,
    1,
    0.5,
    zf,
    Uf,
    [Is.legend.rain.light, Is.legend.rain.moderate, Is.legend.rain.heavy]
  );
  const Wf = {},
    Gf = (t, s, i) =>
      Rr(t, et(((i - s.min) / s.span) * t.width, 0, t.width - 1), 0, !0);
  class jf {
    constructor() {
      ((this.dom = qi(document, ".legend")),
        _i(this.dom, s, (t) => {
          Yn.isRainLayer || (Yn.user.nextUnit(Yn.layer), this.update());
        }),
        hh(this.dom),
        (this.wrap = qi(this.dom, ".wrap.primary")),
        (this.bar = qi(this.wrap, ".bar")),
        (this.unit = qi(this.bar, ".unit")),
        (this.values = qi(this.bar, ".values")),
        (this.first = qi(this.wrap, ".first")),
        (this.last = qi(this.wrap, ".last")),
        (this.wrap2 = qi(this.dom, ".wrap.secondary")),
        (this.bar2 = qi(this.wrap2, ".bar")),
        (this.unit2 = qi(this.bar2, ".unit")),
        (this.valuesHTML = null),
        (this.unitRange = null));
    }
    set barColor(t) {
      if (t) {
        const s = yn(t.first),
          i = Ns()
            ? yn(
                Yn.isRainLayer ? [40, 51, 68] : t.first,
                Yn.user.useBlur ? 0.5 : 0.85
              )
            : s;
        ((this.wrap.style.backgroundColor = i),
          (this.wrap2.style.backgroundColor = i),
          (this.unit.style.backgroundColor = s),
          (this.first.style.backgroundColor = s),
          (this.last.style.backgroundColor = yn(t.last)));
      } else
        ((this.wrap.style.backgroundColor = ""),
          (this.wrap2.style.backgroundColor = ""),
          (this.bar.style.backgroundImage = ""),
          (this.bar2.style.backgroundImage = ""),
          (this.unit.style.backgroundColor = ""),
          (this.first.style.backgroundColor = ""),
          (this.last.style.backgroundColor = ""));
    }
    update() {
      const t = Yn.layer,
        s = Yn.user.getUnit(t);
      ((this.dom.className = "legend " + s),
        ah(this.unit, Yn.user.getUnitString(t)),
        ah(this.unit2, Yn.isRainLayer ? Is.legend.snow : ""));
      const i = If(t, s),
        h = Sf[i],
        e = h ? h.html : "";
      (this.valuesHTML !== e && (this.values.innerHTML = this.valuesHTML = e),
        (this.unitRange = h));
      const n = Pa[t],
        r = Wf[i];
      if (r) this.barColor = r;
      else if (n) {
        const t = new Image();
        ((t.onload = (s) => {
          h &&
            !Wf[i] &&
            (this.barColor = Wf[i] =
              {
                first: Gf(t, h, h.first),
                last: Gf(t, h, h.last),
              });
        }),
          (t.src = n));
      } else this.barColor = null;
      const o = n ? `url(${n})` : "";
      ((this.bar.style.backgroundImage = o),
        (this.bar2.style.backgroundImage = Yn.isRainLayer ? o : ""),
        requestAnimationFrame(() => {
          this.resize();
        }));
    }
    resize() {
      const t = this.unitRange,
        s = this.bar.style;
      if (!t || !s.backgroundImage) return void (this.barColor = null);
      const i = getComputedStyle(this.values),
        h = parseFloat(i.paddingLeft),
        e = parseFloat(i.width) - h - parseFloat(i.paddingRight);
      s.backgroundSize = `${e * t.scale}px ${Yn.isRainLayer ? 2 : 1}00%`;
      const n = e / t.count,
        r = ((t.min - t.first) / t.step) * n;
      s.backgroundPosition =
        Math.round((h + r) * Kh.pixelRatio) / Kh.pixelRatio + "px 0";
    }
  }
  const _f = [1, 2, 5];
  class Bf {
    constructor() {
      ((this.dom = qi(document, ".scale-line")),
        (this.line = qi(this.dom, "div")),
        (this.state = {
          resolution: 0,
          center: [],
          unit: Yn.user.distanceUnit,
        }),
        _i(this.dom, s, (t) => {
          Yn.user.T();
        }));
    }
    update(t) {
      t || (t = this.state);
      const s = Yn.user.distanceUnit;
      if (
        !t ||
        (s === this.state.unit &&
          t.resolution === this.state.resolution &&
          t.center.toString() === this.state.center.toString())
      )
        return;
      ((this.state.resolution = t.resolution),
        (this.state.center = t.center),
        (this.state.unit = s));
      let i = t.resolution / Math.cosh(t.center[1] / zt);
      const h = 48 * i;
      let e = "";
      switch (s) {
        case Je.METRIC:
          h < Vt ? (e = Is.unit.meters) : ((i /= Vt), (e = Is.unit.km));
          break;
        case Je.IMPERIAL:
          h < Kt
            ? ((i *= Jt), (e = Is.unit.feet))
            : ((i /= Kt), (e = Is.unit.miles));
          break;
        case Je.NAUTICAL:
          ((i /= 1852), (e = Is.unit.nm));
      }
      let n = 0,
        r = 0;
      for (
        let t = 3 * Math.floor(Math.log(48 * i) / Math.log(10));
        t < 20;
        t++
      ) {
        if (
          ((n = _f[((t % 3) + 3) % 3] * 10 ** Math.floor(t / 3)),
          (r = Math.round(n / i)),
          isNaN(r))
        )
          return;
        if (r >= 48) break;
      }
      (ah(this.line, n + " " + e), (this.line.style.width = r + "px"));
    }
  }
  const Zf = "bottom",
    Hf = "right";
  class Yf {
    constructor() {
      ((this.dom = qi(document, ".main-tooltip")),
        (this.text = qi(this.dom, ".tooltip .text")),
        _i(document.body, T, (t) => {
          this.hide();
        }));
    }
    add(t, i, h) {
      (_i(t, D, (s) => {
        if (!this.dom || Kh.touch) return;
        const e = t.getAttribute("aria-label");
        e &&
          (ah(this.text, e),
          (this.dom.className = `main-tooltip ${i} ${h} show`));
      }),
        _i(t, E, (t) => {
          this.hide();
        }),
        _i(t, s, (t) => {
          this.hide();
        }));
    }
    hide() {
      this.dom && uh(this.dom, j);
    }
  }
  class qf extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".panel.about")),
        _i(this.dom, s, (t) => {
          t.target && "P" === t.target.tagName && th(t);
        }),
        hh(this.dom),
        Hi(qi(this.dom, ".content"), () => {
          Ns() && this.toggle();
        }),
        (this.content = qi(this.dom, ".content>div")),
        (this.button = qi(document, "button.about")),
        _i(this.button, s, (t) => {
          this.toggle();
        }),
        hh(this.button),
        _i(qi(this.dom, "button.close"), s, (t) => {
          this.toggle();
        }));
    }
    toggle() {
      (this.dispatchEvent({
        type: $,
      }),
        this.resize());
    }
    resize() {
      this.dom.style.maxHeight = Ns()
        ? ""
        : Math.round(parseFloat(getComputedStyle(this.content).height) + 80) +
          "px";
    }
  }
  const $f = "menu-icon",
    Vf = {
      SATELLITE: "satellite",
      RADAR: "radar",
      PRECIPITATION: "precipitation",
      WIND: "wind",
      TEMPERATURE: "temperature",
      HUMIDITY: "humidity",
      PRESSURE: "pressure",
    },
    Kf = Object.values(Vf),
    Jf = {};
  ((Jf[Vf.SATELLITE] = [Re.SATELLITE, Re.SATELLITE_HD]),
    (Jf[Vf.RADAR] = [Re.RADAR]),
    (Jf[Vf.PRECIPITATION] = [Re.PRECIPITATION]),
    (Jf[Vf.WIND] = [Re.WIND_SPEED, Re.WIND_GUSTS]),
    (Jf[Vf.TEMPERATURE] = [
      Re.TEMPERATURE,
      Re.TEMPERATURE_FEEL,
      Re.TEMPERATURE_WET_BULB,
    ]),
    (Jf[Vf.HUMIDITY] = [Re.HUMIDITY, Re.DEW_POINT]),
    (Jf[Vf.PRESSURE] = [Re.PRESSURE]));
  const Xf = (t, s) => {
      const i = Jf[t];
      return i && i.includes(s);
    },
    Qf = (t) => {
      for (let s in Jf) if (Xf(s, t)) return s;
    },
    tm = (t, s, i, h) => {
      const e = Xi("div", "menu-item " + s),
        n = s + "-" + i,
        r = Xi("input");
      ((r.type = "radio"), (r.name = s), (r.id = n), nh(r), Ki(e, r));
      const o = Xi("label");
      ((o.htmlFor = n), Ki(e, o));
      const a = Xi("span", "item", Xi("span", "menu-icon " + i));
      return (Ki(o, a), Ki(a, Xi("span", "text", h)), Ki(t, e), r);
    };
  class sm extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".panel.layers")),
        eh(this.dom),
        (this.form = qi(this.dom, "form")),
        eh(this.form),
        (this.content = qi(this.dom, "form>div")),
        (this.layer = void 0),
        (this.selectedLayers = Yn.layersMenu),
        (this.button = qi(document, "button.layers")),
        hh(this.button),
        _i(this.button, s, (t) => {
          (th(t),
            this.dispatchEvent({
              type: $,
            }));
        }),
        (this.buttonIcon = qi(this.button, "." + $f)));
      const i = qi(this.dom, "button.arrow");
      (hh(i),
        _i(i, s, (t) => {
          (th(t),
            this.dispatchEvent({
              type: $,
            }));
        }));
      const h = qi(document, "button.layers-dropdown");
      (hh(h),
        _i(h, s, (t) => {
          (th(t),
            this.dispatchEvent({
              type: $,
            }));
        }),
        (this.dropdownIcon = qi(h, "." + $f)),
        (this.dropdownText = qi(h, ".text")),
        (this.categories = {}),
        (this.categoryElements = {}),
        (this.categoryHeight = 40 * Kf.length),
        (this.layers = {}));
      for (let i = 0, h = Kf.length; i < h; i++) {
        const h = Kf[i],
          e = (this.categories[h] = tm(
            this.content,
            "category",
            h,
            Is.layer.category[h] || Is.layer.short[h]
          ));
        (_i(e, t, (s) => {
          e.blur();
          let i = this.selectedLayers[h] || Jf[h][0];
          this.dispatchEvent({
            type: t,
            layer: i,
          });
        }),
          _i(e, s, (t) => {
            (e.blur(),
              (this.selectedLayers[h] || Jf[h][0]) === Yn.layer &&
                this.dispatchEvent({
                  type: p,
                }));
          }));
        const n = Jf[h];
        if (n.length < 2) continue;
        const r = Xi("section", h);
        this.categoryElements[h] = r;
        for (let i = 0, h = n.length; i < h; i++) {
          const h = n[i],
            e = (this.layers[h] = tm(r, "layer", h, Is.layer.short[h]));
          (_i(e, t, (s) => {
            (e.blur(),
              this.dispatchEvent({
                type: t,
                layer: h,
              }));
          }),
            _i(e, s, (t) => {
              (e.blur(),
                h === Yn.layer &&
                  this.dispatchEvent({
                    type: p,
                  }));
            }));
        }
        Ki(this.content, r);
      }
    }
    update() {
      const t = Yn.layer,
        s = this.layers[t];
      s && (s.checked = !0);
      const i = Qf(t);
      ((this.selectedLayers[i] = t), (Yn.layersMenu = this.selectedLayers));
      const h = this.categories[i];
      if ((h && (h.checked = !0), this.layer !== t)) {
        ((this.layer = t), (this.dom.className = "panel layers select-" + i));
        const s = $f + " " + i;
        ((this.buttonIcon.className = s),
          (this.dropdownIcon.className = s),
          ah(this.dropdownText, Is.layer.dropdown[t]));
      }
      this.resize();
    }
    resize() {
      this.dom.style.width =
        Math.round(parseFloat(getComputedStyle(this.content).width) + 12) +
        "px";
      const t = Qf(Yn.layer),
        s = Jf[t],
        i = s ? s.length : 0;
      this.dom.style.maxHeight =
        28 + (this.categoryHeight + 20 + (1 === i ? 0 : 40 * i + 10)) + "px";
      for (let s in this.categoryElements) {
        const h = this.categoryElements[s];
        h && (h.style.height = s === t ? 40 * i + 10 + "px" : "");
      }
    }
  }
  class im extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".group.measure")),
        (this.distance = qi(this.dom, "button.distance")),
        (this.area = qi(this.dom, "button.area")),
        (this.doneButton = qi(document, ".panel.measure button.done")),
        _i(this.distance, s, (t) => {
          this.dispatchEvent({
            type: M,
            measure: "distance",
          });
        }),
        _i(this.area, s, (t) => {
          this.dispatchEvent({
            type: M,
            measure: "area",
          });
        }),
        hh(this.distance),
        hh(this.area));
    }
  }
  class hm extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".panel.model")),
        eh(this.dom),
        hh(this.dom),
        (this.button = qi(document, "button.model")),
        hh(this.button),
        (this.buttonText = qi(this.button, ".text")),
        (this.form = qi(this.dom, "form")),
        eh(this.form),
        eh(qi(document, ".hit-model")),
        (this.model = void 0),
        (this.models = {}));
      for (let i = oi.length; i--; ) {
        const h = oi[i],
          e = qi(this.dom, "#model-" + h);
        e &&
          (nh(e),
          _i(e, t, (s) => {
            (e.blur(),
              this.dispatchEvent({
                type: t,
                model: h,
              }));
          }),
          _i(e, s, (t) => {
            (e.blur(),
              h === Yn.model &&
                this.dispatchEvent({
                  type: p,
                }));
          }),
          (this.models[h] = e));
      }
      this.update();
    }
    update() {
      const t = Yn.model;
      this.model !== t &&
        oi.includes(t) &&
        (uh(this.button, this.model),
        (this.model = t),
        lh(this.button, this.model),
        (this.models[this.model].checked = !0));
    }
  }
  const em = [
      Se.RADAR,
      Se.COVERAGE,
      Se.CLOUDS,
      Se.ISOLINES,
      Se.WIND_ANIMATION,
      Se.HEAT,
    ],
    nm = [
      Se.RADAR,
      Se.COVERAGE,
      Se.CLOUDS,
      Se.ISOLINES,
      Se.PRECIPITATION_ANIMATION,
      Se.WIND_ANIMATION,
      Se.HEAT,
      Se.FIRES,
      Se.STORMS,
      Se.LABELS,
      Se.LABEL_VALUES,
      Se.LINES,
      Se.TERMINATOR,
      Se.CROSSHAIR,
    ],
    rm = (t, s, i, h) => {
      const e = Xi("div", "menu-item " + i),
        n = Ki(e, Xi("div")),
        r = s + "-" + i,
        o = Xi("input");
      ((o.type = "checkbox"), (o.id = r), nh(o), Ki(n, o));
      const a = Xi("label");
      return (
        (a.htmlFor = r),
        Ki(n, a),
        Ki(a, Xi("span", "menu-icon " + i)),
        Ki(a, Xi("span", "text", h)),
        Ki(e, Xi("kbd", "hotkey", Is.key[i])),
        Ki(t, e),
        o
      );
    };
  class om extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".panel.overlays")),
        eh(this.dom),
        (this.form = qi(this.dom, "form")),
        eh(this.form),
        (this.content = qi(this.dom, "form>div")),
        eh(qi(this.dom, "h4")));
      const i = qi(document, ".group.overlays");
      ((this.groupButton = qi(i, "button.more")),
        hh(this.groupButton),
        (this.buttons = {}));
      for (let h = em.length; h--; ) {
        const e = em[h],
          n = qi(i, "button." + e);
        n &&
          (hh(n),
          e === Se.HEAT
            ? _i(n, s, (s) => {
                this.dispatchEvent({
                  type: t,
                  overlay: Se.HEAT,
                  fires: !0,
                });
              })
            : _i(n, s, (s) => {
                this.dispatchEvent({
                  type: t,
                  overlay: e,
                });
              }),
          (this.buttons[e] = n));
      }
      this.overlays = {};
      for (let s = 0, i = nm.length; s < i; s++) {
        const i = nm[s],
          h = (this.overlays[i] = rm(
            this.content,
            "overlay",
            i,
            Is.overlay[i]
          ));
        _i(h, t, (s) => {
          (h.blur(),
            this.dispatchEvent({
              type: t,
              overlay: i,
            }));
        });
      }
    }
    update(t, s) {
      const i = this.overlays[t];
      i && (i.checked = s);
      const h = this.buttons[t];
      h && (h.dataset.state = s ? "on" : "off");
    }
    resize() {
      const t = getComputedStyle(this.content);
      ((this.dom.style.width = Math.round(parseFloat(t.width) + 12) + "px"),
        (this.dom.style.maxHeight =
          Math.round(parseFloat(t.height) + 20) + "px"));
    }
  }
  let am,
    cm = null,
    lm = null,
    um = 0,
    dm = 0,
    fm = 0,
    mm = 0;
  const pm = (t) => {
      if (!cm || (t.touches && t.touches.length > 1)) return;
      if (((lm = dh(t.target, "handle") ? t.target.parentElement : null), !lm))
        return;
      const s = t.touches && t.touches[0];
      ((dm = s ? s.clientX : t.clientX),
        (fm = s ? s.clientY : t.clientY),
        (mm = lm.getBoundingClientRect().y));
      const [i, h] = cm.children;
      um = h
        ? h.getBoundingClientRect().top - i.getBoundingClientRect().bottom
        : 0;
      const e = [...cm.children],
        n = e.indexOf(lm);
      ((am = e.filter((t) => t !== lm)),
        am.forEach((t, s) => {
          t.order = s < n ? 1 : -1;
        }),
        lh(lm, "dragging"),
        _i(document, x, gm),
        _i(document, J, gm),
        _i(document, I, wm),
        _i(document, K, wm));
    },
    gm = (t) => {
      if (!lm || (t.touches && t.touches.length > 1)) return;
      th(t);
      const s = t.touches && t.touches[0],
        i = (s || t).clientX - dm,
        h = (s || t).clientY - fm;
      lm.style.transform = `translate(${i}px, ${h}px)`;
      const { top: e, height: n } = lm.getBoundingClientRect(),
        r = e + n / 2,
        o = n + um;
      am.forEach((t) => {
        const { top: s, height: i } = t.getBoundingClientRect(),
          h = (s + i / 2 - r) * t.order >= 0;
        t.willMove = h;
        const e = t.style.transform,
          n = h ? `translateY(${t.order * o}px)` : "";
        e !== n && (t.style.transform = n);
      });
    },
    wm = (t) => {
      if (!lm) return;
      (Yi(document, x, gm),
        Yi(document, J, gm),
        Yi(document, I, wm),
        Yi(document, K, wm));
      const s = [...cm.children],
        i = [];
      s.forEach((t, s) => {
        (t !== lm && (i[s + (t.willMove ? t.order : 0)] = t),
          i[s] || (i[s] = lm));
      });
      const h = [];
      (i.forEach((t) => {
        (cm.appendChild(t),
          (t.style.transform = ""),
          (t.willMove = !1),
          Ys(t.favorite) && h.push(t.favorite));
      }),
        lr.nt(h),
        (lm.style.transform = ""),
        (um = 0));
      const e = lm.getBoundingClientRect().y,
        n = t.changedTouches && t.changedTouches[0],
        r = (n || t).clientX - dm,
        o = (n || t).clientY - fm;
      ((lm.style.transform = `translate(${r}px, ${o + mm - e}px)`),
        requestAnimationFrame(() => {
          ((lm.style.transform = ""), uh(lm, "dragging"), (lm = null));
        }));
    },
    vm = (t) => {
      ((cm = t), _i(cm, A, pm), _i(cm, X, pm));
    },
    ym = () => {
      (Yi(cm, A, pm), Yi(cm, X, pm), (cm = null));
    },
    Mm = "searchQuery",
    bm = "searchRecent",
    Am = "coordinate",
    Tm = "editing",
    xm = "error",
    Em = "favorites",
    Dm = "handle",
    Im = "hidden",
    Sm = "loading",
    Rm = "located",
    km = "locating",
    Lm = "query-results",
    Nm = "reorder",
    Om = "wait";
  class Cm extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".panel.search")),
        (this.form = qi(this.dom, "form")),
        (this.input = qi(this.form, 'input[type="search"]')),
        Kh.safari && (this.input.style.height = "49px"),
        (this.button = qi(document, "button.search")),
        _i(this.button, s, (t) => {
          this.toggle();
        }),
        hh(this.button));
      const t = qi(this.dom, "header.search");
      (_i(qi(t, "button.close"), s, (t) => {
        this.toggle();
      }),
        _i(qi(t, "button.geolocation-search"), s, (t) => {
          this.dispatchEvent({
            type: d,
          });
        }),
        _i(qi(t, "button.geolocation-remove"), s, (t) => {
          this.dispatchEvent({
            type: "geolocationremove",
          });
        }));
      const i = qi(this.dom, ".news");
      (Hi(i, (t) => {
        Ns() && !dh(t.target, Dm) && this.toggle();
      }),
        (this.user = qi(i, ".results.user")),
        (this.news = qi(i, ".results.remote")),
        (this.newsData = null),
        (this.newsTime = 0));
      const h = qi(this.dom, ".query");
      (Hi(h, () => {
        Ns() && this.toggle();
      }),
        (this.query = qi(h, ".results")),
        (this.queryCache = new Eu(20)),
        (this.suggestCache = new Eu(50)),
        (this.suggestTimeoutID = 0),
        (this.loading = []),
        (this.minQueryLength = /^(ja|zh|ko)/.test(Kh.lang) ? 1 : 2),
        _i(this.dom, "submit", (t) => {
          (th(t), clearTimeout(this.suggestTimeoutID), this.fs(!1));
        }),
        Kh.mobile ||
          _i(this.dom, "transitionend", (t) => {
            "visibility" === t.propertyName &&
              "visible" === getComputedStyle(this.dom).visibility &&
              this.input.select();
          }),
        _i(this.input, "input", (t) => {
          (this.ps(),
            clearTimeout(this.suggestTimeoutID),
            (this.suggestTimeoutID = setTimeout(() => {
              this.fs(!0);
            }, 400)),
            this.queryValue.length < this.minQueryLength && this.fs(!0));
        }),
        (this.activity = qi(i, ".activity")),
        _i(qi(this.activity, "button"), s, (t) => {
          this.gs(!0);
        }));
      const e = se(bm);
      this.recentQueries = e ? decodeURI(e).split("") : [];
      const n = se(Mm);
      (n && ((this.queryValue = decodeURI(n)), this.fs(!0)),
        (this.newsLoader = null),
        (this.queryLoader = null),
        (this.locateTimeoutID = 0),
        this.ws());
    }
    set queryValue(t) {
      this.form.q.value = t;
    }
    get queryValue() {
      return (this.form.q.value || "").trim();
    }
    toggle() {
      this.dispatchEvent({
        type: $,
      });
    }
    ws() {
      (this.clear(this.user),
        Array.isArray(this.recentQueries) &&
          this.recentQueries.length > 0 &&
          this.vs(this.user, {
            title: Is.search.recent,
            clear: !0,
            items: this.recentQueries.map((t) => ({
              query: t,
              remove: !0,
            })),
          }));
      const t = lr.et();
      if (t.length > 0) {
        const s = t
          .map((t) => {
            const { title: s, place: i, lon: h, lat: e } = t;
            if ($s(h) && $s(e))
              return {
                favorite: t,
                remove: !0,
                marker: !0,
                title: s,
                path: i ? Kn.places + i + "/" : void 0,
                lon: h,
                lat: e,
                zoom: Yn.zooms.favorite,
              };
          })
          .filter(Boolean);
        s.length > 0 &&
          this.vs(this.user, {
            title: Is.search.favorites,
            edit: !0,
            items: s,
          });
      }
    }
    ys() {
      (this.clear(this.news),
        uh(this.activity, [xm, Om]),
        lh(this.activity, Im));
    }
    Ms() {
      (this.clear(this.news),
        uh(this.activity, [Om, Im]),
        lh(this.activity, xm));
    }
    showNewsLoading() {
      (this.clear(this.news),
        uh(this.activity, [xm, Im]),
        lh(this.activity, Om));
    }
    gs(t) {
      if (Date.now() - this.newsTime < 20000) return void (t && this.bs());
      (this.newsLoader && this.newsLoader.cancel(), this.showNewsLoading());
      const s = new FormData();
      (s.append("news", 1),
        Kh.enLang || s.append("lang", Kh.lang),
        (this.newsLoader = new Xs()),
        this.newsLoader
          .load({
            url: ps,
            formData: s,
          })
          .then((t) => {
            ((this.newsTime = Date.now()), (this.newsData = t), this.bs());
          })
          .catch((t) => {
            Array.isArray(this.newsData)
              ? this.bs()
              : (this.Ms(), Qs.add("news", t.message));
          }));
    }
    bs() {
      (this.ys(),
        Array.isArray(this.newsData) &&
          this.newsData.forEach((t) => {
            this.vs(this.news, t);
          }));
    }
    ps() {
      uh(this.dom, xm);
    }
    As() {
      lh(this.dom, xm);
    }
    Ts() {
      (this.loading.forEach((t) => {
        uh(t, Sm);
      }),
        (this.loading.length = 0),
        uh(this.dom, Sm));
    }
    xs() {
      lh(this.dom, Sm);
    }
    fs(t, s, i) {
      (void 0 === t && (t = !1),
        void 0 === s && (s = ""),
        void 0 === i && (i = ""),
        this.ps(),
        this.Ts());
      const h = this.queryValue,
        e = encodeURI(h) + s;
      if ((ie(Mm, encodeURI(h)), h.length < this.minQueryLength))
        return void (t ? this.Es() : this.input.select());
      if (t && h.length > 120) return void this.Ds([], h);
      const n = ((t) => {
        if (!/\d/.test(t)) return;
        let s, i, h, e;
        const n =
          /^\s*([+-]?(?:(?:\d+[\.,]?\d*)|(?:\.\d+)))([°º]? ?[NSZ]?)[\s,]+([+-]?(?:(?:\d+[\.,]?\d*)|(?:\.\d+)))([°º]? ?[EWO]?)[\s]*$/i.exec(
            t
          );
        if (n)
          ((s = parseFloat(n[1].replace(",", "."))),
            (h = n[2]),
            (i = parseFloat(n[3].replace(",", "."))),
            (e = n[4]));
        else {
          const n =
            /^\s*0?(\d{1,3})\.?\d*?[°º]?\s*(\d{1,2}[\.,]?\d*?)['′´ ]\s*([NSZ])[ ,;]+0?(\d{1,3})\.?\d*?[°º]?\s*(\d{1,2}[\.,]?\d*?)['′´ ]\s*([EWO])/i.exec(
              t
            );
          if (n)
            ((s = bn(n[1]) + parseFloat(n[2]) / 60),
              (h = n[3]),
              (i = bn(n[4]) + parseFloat(n[5]) / 60),
              (e = n[6]));
          else {
            const n =
              /^\s*0?(\d{1,3})\.?\d*?[°º]?\s*(\d{1,2})[\.,]?\d*['′´ ]\s*(\d{1,2}(?:[\.,]\d*)?)(?:"|″|'')?\s*([NSZ])[ ,;]+0?(\d{1,3})\.?\d*?[°º]?\s*(\d{1,2})[\.,]?\d*['′´ ]\s*(\d{1,2}(?:[\.,]\d*)?)(?:"|″|'')?\s*([EWO])/i.exec(
                t
              );
            n &&
              ((s =
                bn(n[1]) +
                bn(n[2]) / 60 +
                parseFloat(n[3].replace(",", ".")) / 3600),
              (h = n[4]),
              (i =
                bn(n[5]) +
                bn(n[6]) / 60 +
                parseFloat(n[7].replace(",", ".")) / 3600),
              (e = n[8]));
          }
        }
        return (
          s > 0 && /[SZ]/i.test(h) && (s *= -1),
          i > 0 && /[WO]/i.test(e) && (i *= -1),
          $s(s) && $s(i)
            ? (s > 90 || s < -90) && i <= 90 && i >= -90
              ? [_t(s), et(i, -90, 90)]
              : [_t(i), et(s, -90, 90)]
            : void 0
        );
      })(h);
      if (n) {
        const s = {
          coordinate: {
            lon: n[0],
            lat: n[1],
            marker: !0,
          },
        };
        return (this.Ds([s], h), void (t || this.Is(s.coordinate)));
      }
      if (t) {
        if (this.suggestCache.containsKey(e))
          return void this.Ds(this.suggestCache.get(e), h);
      } else {
        if (!s) {
          if (/^(my )?(house|home|location)$/i.test(h))
            return void this.dispatchEvent({
              type: d,
            });
          if (
            /^(wildfires?|fires?|feux?|fuegos?|inc(e|ê)ndio?s?|incendies?)$/i.test(
              h
            )
          )
            return (
              this.toggle(),
              void this.dispatchEvent({
                type: "fires",
              })
            );
          if (/^(19|20)\d\d$/.test(h)) return void this.As();
        }
        if (this.queryCache.containsKey(e))
          return void this.Is(this.queryCache.get(e));
      }
      (this.queryLoader && this.queryLoader.cancel(), this.xs());
      const r = new FormData();
      (r.append("q", h),
        Kh.enLang || r.append("lang", Kh.lang),
        t && r.append("suggest", 1),
        s && r.append("key", s),
        (this.queryLoader = new Xs()),
        this.queryLoader
          .load({
            url: ps,
            formData: r,
            timeout: t ? 1500 : Ds,
          })
          .then((s) => {
            this.Ts();
            let n = !1;
            if (s && s.length > 0)
              for (let t = s.length; t--; )
                if (s[t].recent) {
                  n = !0;
                  break;
                }
            if (t)
              return (
                n ||
                  (this.suggestCache.containsKey(e)
                    ? this.suggestCache.replace(e, s)
                    : (this.suggestCache.set(e, s), this.suggestCache.prune())),
                void this.Ds(s, h)
              );
            (n ||
              (this.queryCache.containsKey(e)
                ? this.queryCache.replace(e, s)
                : (this.queryCache.set(e, s), this.queryCache.prune())),
              i && (s.title = i),
              this.Is(s),
              this.fs(!0));
          })
          .catch((s) => {
            (this.Ts(), t || (this.As(), Qs.add("search", s.message)));
          }));
    }
    Es() {
      (this.clear(this.query, !0), uh(this.dom, Lm));
    }
    Ss() {
      (this.Es(), ie(Mm, ""));
    }
    Ds(t, s) {
      Array.isArray(t)
        ? (this.clear(this.query, !0),
          this.Rs(this.query, t, s),
          lh(this.dom, Lm))
        : this.Es();
    }
    ks(t) {
      const s = this.recentQueries.indexOf(t);
      -1 !== s && this.recentQueries.splice(s, 1);
    }
    Ls() {
      ie(bm, encodeURI(this.recentQueries.join("")));
    }
    Is(t) {
      if (void 0 !== t.marker) {
        const t = this.queryValue;
        (t.length >= this.minQueryLength &&
          (this.ks(t),
          this.recentQueries.unshift(t),
          this.recentQueries.length > 5 && this.recentQueries.pop()),
          this.Ls());
      }
      this.dispatchEvent({
        type: R,
        data: t,
      });
    }
    clear(t, s) {
      (s && Qi(t.parentElement),
        ah(t, ""),
        s &&
          setTimeout(() => {
            Qi(t.parentElement);
          }, Gi));
    }
    vs(t, i) {
      if (!t || !Ys(i)) return;
      const h = Ki(t, Xi("h4", "", i.title));
      if (i.clear) {
        const i = Ki(t, Xi("button", "clear", Is.button.clear));
        _i(i, s, (t) => {
          ((this.recentQueries.length = 0), this.Ls(), this.ws());
        });
      }
      let e;
      i.edit && (e = Ki(t, Xi("button", "edit", Is.button.edit)));
      const n = this.Rs(t, i.items);
      e &&
        _i(e, s, (t) => {
          dh(n, Tm)
            ? (uh(n, [Tm, Nm]),
              ah(e, Is.button.edit),
              uh(h, Nm),
              ah(h, i.title),
              ym())
            : (lh(n, Tm),
              ah(e, Is.button.done),
              [...n.children].length > 1 &&
                (lh(n, Nm), lh(h, Nm), ah(h, Is.search.drag), vm(n)));
        });
    }
    Rs(t, s, i) {
      if (!t || !Array.isArray(s)) return;
      const h = Xi("ul"),
        e = s.length;
      if (0 === e)
        this.Ns(
          h,
          {
            none: !0,
          },
          i
        );
      else {
        const t = s[0];
        Ys(t) && (t.query ? lh(h, "queries") : t.favorite && lh(h, Em));
        for (let t = 0; t < e; t++) this.Ns(h, s[t], i);
      }
      return (Ki(t, h), h);
    }
    Ns(t, i, h) {
      if ((void 0 === h && (h = ""), !t || !Ys(i))) return;
      const e = Ki(t, Xi("li"));
      if (i.none) return ((e.className = "none"), void ah(e, Is.search.none));
      const n = Ki(e, Xi("a")),
        r = i.coordinate;
      if (r) {
        const [t, h] = bf([r.lon, r.lat], null, Ke.DECIMAL);
        return (
          (n.innerHTML =
            Pi("extra", Is.search.coordinate) +
            " " +
            h +
            Is.punctuation.comma +
            t),
          lh(n, Am),
          void _i(n, s, (t) => {
            this.Is(i.coordinate);
          })
        );
      }
      if (i.remove) {
        const t = Xi("button", "remove", Xi("span"));
        (Ji(e, t),
          _i(t, s, (t) => {
            if (i.query) return (this.ks(i.query), this.Ls(), void this.ws());
            i.favorite &&
              lr.removeLocation(i.lon, i.lat) &&
              (Vi(t.target.parentElement),
              (0 !== lr.et().length &&
                0 !== $i(this.user, "." + Em + ">li").length) ||
                this.ws());
          }));
      }
      (i.favorite || i.query || i.storm || i.fire) && (n.className = "icon");
      let o = "";
      if (
        (i.favorite &&
          (Ki(e, Xi("div", Dm)),
          (o = Pi("favorite")),
          (e.favorite = i.favorite)),
        i.query && (o = Pi("query")),
        i.storm)
      ) {
        $s(i.rank) &&
          (o = Fi(
            "storm-dot" +
              (i.rank > 0 ? " cyclone" : "") +
              (i.shem ? " shem" : "") +
              " rank" +
              i.rank,
            Fi("dot", Fi("ring") + Fi("icon"))
          ));
        const t = i.chance;
        if (t) o += Fi("chance-badge", Pi("chance " + t, Is.storm.chance[t]));
        else {
          const t = i.chance2day,
            s = i.chance7day;
          $s(t) &&
            $s(s) &&
            (o += Fi(
              "chance-badge",
              Pi("chance day2 " + Ql(t), Ss(t)) +
                Pi("chance day7 " + Ql(s), Ss(s))
            ));
        }
      }
      if (i.fire) {
        o = Pi(
          "fire" +
            (i.type === Ie.COMPLEX
              ? " complex"
              : i.type === Ie.PRESCRIBED_BURN
                ? " prescribed"
                : "")
        );
        const t = i.acres;
        $s(t) &&
          t > 0 &&
          (o += Fi("fire-size", al(t * Xt, Yn.user.fireAreaUnit, 1, !0)));
      }
      let a = (i.title || i.query || "").replace(/_/g, "");
      if (h.length > 1) {
        const t = h.replace(/ +/g, " ").trim().split(" ");
        for (let s = t.length; s--; )
          a = a.replace(
            new RegExp(
              "(" + t[s].replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")",
              "i"
            ),
            "_$1_"
          );
      }
      if (((a = vn(a)), i.place && (a += ", " + i.place), i.query)) o += a;
      else {
        const t = Is.punctuation.comma;
        if (i.favorite && !i.title) {
          const [s, h] = bf(
            [i.lon, i.lat],
            Yn.user.coordinateUnit === Ke.DMS ? 5 : 7
          );
          ((o += h + t + s), lh(n, Am));
        } else {
          const s = a.split(", "),
            i = s.slice(1).join(t);
          o += s[0] + (0 === i.length ? "" : Pi("extra", t + i));
        }
      }
      return (
        (n.innerHTML = o),
        i.storm || i.fire || i.path
          ? (i.storm
              ? (n.href = Kn.storms + i.storm + "/")
              : i.fire
                ? (n.href = Kn.fires + i.fire + "/")
                : i.path && (n.href = i.path),
            n.href && (n.target = "_top"),
            void _i(n, s, (t) => {
              (th(t), lh(n, Sm), this.loading.push(n), this.Is(i));
            }))
          : i.favorite
            ? (i.path && i.title && ((n.href = i.path), (n.target = "_top")),
              void _i(n, s, (t) => {
                (th(t),
                  this.dispatchEvent({
                    type: R,
                    data: i,
                  }));
              }))
            : void (i.key
                ? _i(n, s, (t) => {
                    this.fs(!1, i.key, i.title);
                  })
                : i.query &&
                  _i(n, s, (t) => {
                    ((this.queryValue = i.query), this.fs(!0));
                  }))
      );
    }
    hideLocating() {
      (clearTimeout(this.locateTimeoutID),
        (this.locateTimeoutID = setTimeout(() => {
          uh(this.dom, [km, Rm]);
        }, 200)));
    }
    showLocating() {
      (clearTimeout(this.locateTimeoutID), uh(this.dom, Rm), lh(this.dom, km));
    }
    showLocated() {
      (clearTimeout(this.locateTimeoutID),
        (this.locateTimeoutID = setTimeout(() => {
          (uh(this.dom, km), lh(this.dom, Rm));
        }, 200)));
    }
  }
  class Fm extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".panel.settings")),
        eh(this.dom),
        (this.form = qi(this.dom, "form")),
        Hi(this.form, () => {
          Ns() && this.toggle();
        }),
        (this.content = qi(this.dom, "form>div")),
        (this.button = qi(document, "button.settings")),
        _i(this.button, s, (t) => {
          this.toggle();
        }),
        hh(this.button),
        _i(qi(this.dom, "button.close"), s, (t) => {
          this.toggle();
        }),
        _i(this.form, t, (t) => {
          const { name: s, value: i, checked: h } = t.target;
          "language" === s ? rr.setLanguage(i) : (Yn.user[s] = i);
        }));
      const i = Object.values(De);
      for (let t = i.length; t--; ) this.update(i[t]);
      if (!Kh.canBlur) {
        const t = $i(this.content, ".custom");
        for (var h = t.length; h--; ) t[h].style.display = "none";
      }
    }
    update(t) {
      const s = this.form[t];
      s && (s.value = Yn.user[t]);
    }
    toggle() {
      (this.dispatchEvent({
        type: $,
      }),
        this.resize());
    }
    resize() {
      this.dom.style.maxHeight = Ns()
        ? ""
        : Math.round(
            parseFloat(getComputedStyle(this.content).height) + 54 + 16
          ) + "px";
    }
  }
  class Pm {
    constructor() {
      ((this.dom = qi(document, ".panel.share")),
        eh(this.dom),
        (this.button = qi(document, "button.share")),
        hh(this.button),
        (this.link = qi(this.dom, "input")),
        _i(this.link, o, (t) => {
          this.link.select();
        }),
        _i(this.dom, "submit", (t) => {
          th(t);
        }),
        (this.copiedTimeoutID = 0),
        (this.copyButton = qi(this.dom, "button.copy")),
        _i(this.copyButton, s, (t) => {
          try {
            navigator.clipboard
              ? navigator.clipboard.writeText(this.link.value)
              : (this.link.select(), document.execCommand("copy"));
          } catch (t) {
            return;
          }
          (getSelection().removeAllRanges(),
            lh(this.copyButton, "copied"),
            clearTimeout(this.copiedTimeoutID),
            (this.copiedTimeoutID = setTimeout(() => {
              uh(this.copyButton, "copied");
            }, 2500)));
        }),
        (this.social = $i(this.dom, ".social a")));
    }
    update() {
      if (Ns() || !this.link) return;
      const t = (this.link.value = rr.url),
        s = encodeURIComponent(t),
        i = encodeURIComponent(rr.title);
      for (let t = this.social.length; t--; ) {
        const h = this.social[t];
        if (h) {
          const t = h.dataset.template;
          t && (h.href = t.replace(/{url}/g, s).replace(/{text}/g, i));
        }
      }
    }
    showNative() {
      const t = rr.title,
        s = rr.url;
      try {
        navigator.share({
          title: t,
          text: t,
          url: s,
        });
      } catch (t) {}
    }
  }
  class zm extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".panel.title")),
        eh(this.dom),
        (this.button = qi(document, "button.title")),
        hh(this.button),
        (this.form = qi(this.dom, "form")),
        eh(this.form),
        (this.content = qi(this.dom, "form>div")),
        eh(qi(document, ".hit-title")),
        _i(qi(this.dom, ".settings"), s, (t) => {
          this.dispatchEvent({
            type: "settings",
          });
        }),
        _i(qi(this.dom, ".about"), s, (t) => {
          this.dispatchEvent({
            type: "about",
          });
        }));
      const t = qi(this.dom, ".share");
      (navigator.share
        ? _i(t, s, (t) => {
            this.dispatchEvent({
              type: "share",
            });
          })
        : Vi(t),
        _i(qi(this.dom, ".distance"), s, (t) => {
          this.dispatchEvent({
            type: M,
            measure: "distance",
          });
        }),
        _i(qi(this.dom, ".area"), s, (t) => {
          this.dispatchEvent({
            type: M,
            measure: "area",
          });
        }),
        this.resize());
    }
    resize() {
      const t = getComputedStyle(this.content);
      ((this.dom.style.width = Math.round(parseFloat(t.width) + 12) + "px"),
        (this.dom.style.maxHeight =
          Math.round(parseFloat(t.height) + 20) + "px"));
    }
  }
  const Um = Object.freeze({
    CONDITION: "condition",
    WIND_SPEED: "windSpeed",
    WIND_DIRECTION: "windDirection",
    WIND_GUSTS: "windGusts",
    TEMPERATURE: "temperature",
    TEMPERATURE_FEEL: "temperatureFeel",
    TEMPERATURE_WET_BULB: "temperatureWetBulb",
    HUMIDITY: "humidity",
    DEW_POINT: "dewPoint",
    PRESSURE: "pressure",
  });
  Object.freeze(Object.values(Um));
  const Wm = Object.freeze({
      CLOUD: "cloud",
      RAIN: "rain",
      SNOW: "snow",
      WIND_SPEED: "windSpeed",
      WIND_DIRECTION: "windDirection",
      WIND_GUSTS: "windGusts",
      TEMPERATURE: "temperature",
      TEMPERATURE_FEEL: "temperatureFeel",
      TEMPERATURE_WET_BULB: "temperatureWetBulb",
      HUMIDITY: "humidity",
      DEW_POINT: "dewPoint",
      PRESSURE: "pressure",
    }),
    Gm = Object.freeze(Object.values(Wm)),
    jm = ["fr", "nl", "ru"],
    _m = "changeable",
    Bm = "coordinate",
    Zm = "daily",
    Hm = "error",
    Ym = "favorite",
    qm = "hourly",
    $m = "loading",
    Vm = "long",
    Km = "saved",
    Jm = "saving",
    Xm = "selected",
    Qm = "wait",
    tp = Object.freeze({
      DAY: "day",
      TIME: "time",
      SUMMARY: "summary",
      CONDITION: "condition",
      WIND_DIRECTION: "wind-direction",
      ...ii,
    }),
    sp = {};
  ((sp.default = [tp.CONDITION, tp.TEMPERATURE]),
    (sp[Re.WIND_SPEED] = [tp.WIND_DIRECTION, tp.WIND_SPEED]),
    (sp[Re.WIND_GUSTS] = [tp.WIND_DIRECTION, tp.WIND_GUSTS]),
    (sp[Re.TEMPERATURE_FEEL] = [tp.CONDITION, tp.TEMPERATURE_FEEL]),
    (sp[Re.TEMPERATURE_WET_BULB] = [tp.CONDITION, tp.TEMPERATURE_WET_BULB]),
    (sp[Re.HUMIDITY] = [tp.CONDITION, tp.HUMIDITY]),
    (sp[Re.DEW_POINT] = [tp.CONDITION, tp.DEW_POINT]),
    (sp[Re.PRESSURE] = [tp.CONDITION, tp.PRESSURE]));
  const ip = {};
  ((ip.default = [Um.CONDITION, Um.TEMPERATURE]),
    (ip[Re.WIND_SPEED] = [Um.WIND_DIRECTION, Um.WIND_SPEED]),
    (ip[Re.WIND_GUSTS] = [Um.WIND_DIRECTION, Um.WIND_GUSTS]),
    (ip[Re.TEMPERATURE_FEEL] = [Um.CONDITION, Um.TEMPERATURE_FEEL]),
    (ip[Re.TEMPERATURE_WET_BULB] = [Um.CONDITION, Um.TEMPERATURE_WET_BULB]),
    (ip[Re.HUMIDITY] = [Um.CONDITION, Um.HUMIDITY]),
    (ip[Re.DEW_POINT] = [Um.CONDITION, Um.DEW_POINT]),
    (ip[Re.PRESSURE] = [Um.CONDITION, Um.PRESSURE]));
  const hp = {};
  ((hp[Re.WIND_SPEED] = 20 / 3.6),
    (hp[Re.WIND_GUSTS] = 40 / 3.6),
    (hp[Re.HUMIDITY] = 99));
  const ep = {};
  ep[Re.HUMIDITY] = 1;
  const np = {};
  ((np.default = [tp.CONDITION, tp.TEMPERATURE, tp.WIND_SPEED]),
    (np[Re.RADAR] = np[Re.PRECIPITATION] =
      [tp.CONDITION, tp.PRECIPITATION, tp.WIND_SPEED]),
    (np[Re.WIND_SPEED] = np[Re.WIND_GUSTS] =
      [tp.CONDITION, tp.WIND_SPEED, tp.WIND_GUSTS]),
    (np[Re.TEMPERATURE] = np[Re.TEMPERATURE_FEEL] =
      [tp.CONDITION, tp.TEMPERATURE, tp.TEMPERATURE_FEEL]),
    (np[Re.TEMPERATURE_WET_BULB] = [
      tp.CONDITION,
      tp.TEMPERATURE,
      tp.TEMPERATURE_WET_BULB,
    ]),
    (np[Re.HUMIDITY] = np[Re.DEW_POINT] =
      [tp.CONDITION, tp.HUMIDITY, tp.DEW_POINT]),
    (np[Re.PRESSURE] = [tp.CONDITION, tp.PRESSURE, tp.WIND_SPEED]));
  const rp = {};
  ((rp.default = tp.TEMPERATURE),
    (rp[Re.WIND_SPEED] = tp.WIND_SPEED),
    (rp[Re.WIND_GUSTS] = tp.WIND_GUSTS),
    (rp[Re.TEMPERATURE_FEEL] = tp.TEMPERATURE_FEEL),
    (rp[Re.TEMPERATURE_WET_BULB] = tp.TEMPERATURE_WET_BULB),
    (rp[Re.HUMIDITY] = tp.HUMIDITY),
    (rp[Re.DEW_POINT] = tp.DEW_POINT),
    (rp[Re.PRESSURE] = tp.PRESSURE));
  const op = [
      tp.SUMMARY,
      tp.PRECIPITATION,
      tp.WIND_SPEED,
      tp.WIND_GUSTS,
      tp.TEMPERATURE,
      tp.TEMPERATURE_FEEL,
      tp.TEMPERATURE_WET_BULB,
      tp.DEW_POINT,
      tp.PRESSURE,
    ],
    ap = (t) => t + (op.includes(t) ? " " + _m : ""),
    cp = (t, s) =>
      s > t ? s - 1000 * Math.ceil((s - t) / 86400000) * 60 * 60 * 24 : s,
    lp = (t, s) => {
      t.style.backgroundImage = `linear-gradient(to right,${s})`;
    };
  class up extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".panel.weather")),
        (this.title = qi(this.dom, "h2")),
        (this.table = qi(this.dom, "table")),
        (this.activity = qi(this.dom, ".activity")),
        (this.closeButton = qi(this.dom, "button.close")),
        (this.config = {
          isGeolocation: !1,
          title: "",
          place: "",
          longitude: null,
          latitude: null,
          sunriseDate: null,
          sunsetDate: null,
        }),
        (this.tbody = null),
        (this.thead = null),
        (this.loader = null),
        (this.data = null),
        (this.hash = ""),
        (this.cache = new Eu(10)),
        (this.gradientCache = new Eu(100)),
        (this.sun = new Ai()),
        (this.rows = []),
        (this.bars = []),
        (this.maxCells = []),
        (this.tz = null),
        (this.selectedRow = null),
        (this.loadTimeoutID = 0),
        (this.scrollTimeoutID = 0));
      const t = qi(this.dom, "button.save");
      (_i(t, s, (t) => {
        this.Os() ? this.Cs() : this.Fs() && lh(this.dom, Jm);
      }),
        _i(qi(t, ".icon"), "animationend", (t) => {
          uh(this.dom, Jm);
        }));
      const i = (t) => {
          const s = t.target,
            i = s.date;
          if (isNaN(i)) return;
          const h = Yn.maxDate;
          if (i.getTime() <= h.getTime())
            (this.dispatchEvent({
              type: n,
              date: i,
            }),
              this.selectRow(s));
          else {
            const t = s.dayDate;
            !isNaN(t) &&
              t.getTime() <= h.getTime() &&
              (this.dispatchEvent({
                type: n,
                date: h,
              }),
              this.selectRow(s));
          }
        },
        h = Kh.safari && Kh.touch;
      (h && Zi(this.table, i),
        _i(this.table, s, (t) => {
          const s = t.target;
          if (dh(s, _m)) {
            ih(t);
            const i = s.classList[0];
            switch (i) {
              case tp.SUMMARY:
                return void Yn.user.C();
              case tp.TIME:
                return void Yn.user.O();
              default:
                return void Yn.user.nextUnit(i);
            }
          }
          h || i(t);
        }),
        _i(qi(this.activity, "button"), s, (t) => {
          this.load(!0);
        }));
    }
    init(t) {
      if (
        (t.coordinate && (t.lonLat = Yt(t.coordinate)),
        !Array.isArray(t.lonLat) || 2 !== t.lonLat.length)
      )
        return;
      const s = it(_t(t.lonLat[0]), 1000000),
        i = it(t.lonLat[1], 1000000);
      if (!$s(s) || !$s(i)) return;
      const h = !!t.isGeolocation,
        e = (t.title || "").replace(/-\n/g, "-").replace(/\n/g, " ").trim(),
        n = this.config.longitude,
        r = this.config.latitude;
      ((this.config = {
        isGeolocation: h,
        title: e,
        place: t.place || "",
        longitude: s,
        latitude: i,
        sunriseDate: null,
        sunsetDate: null,
      }),
        this.updateTitle(),
        this.load(s !== n || i !== r, t.domTime));
    }
    update() {
      (this.updateTitle(), this.updateHead(), this.updateBody());
    }
    load(t, s, i) {
      void 0 === i && (i = 1);
      let { isGeolocation: h, longitude: e, latitude: n } = this.config;
      if (!$s(e) || !$s(n)) return;
      (this.loader && this.loader.cancel(),
        this.hideError(),
        1 === i &&
          this.dispatchEvent({
            type: j,
            coordinate: Qt([e, n]),
            isGeolocation: h,
          }),
        (e = it(e, 1000)),
        (n = it(n, 1000)));
      const r = {
        longitude: e,
        latitude: n,
        timeZone: !0,
      };
      let o;
      const a = Yn.user.isDailySummary;
      if (a) {
        const t = ip[Yn.layer] || ip.default;
        ((r.daily = {
          days: t,
          conditions: t.includes(Um.CONDITION) ? xe : [],
        }),
          (o = [...t, e, n]));
      } else {
        const t = Yn.model;
        ((r.hourly = {
          hours: Gm,
          sunrise: !0,
          sunset: !0,
          model: t,
          modelVersion: Yn.version[Yn.model],
        }),
          (o = [t, e, n]));
      }
      const c = o.join("~");
      if (this.cache.containsKey(c)) {
        const t = this.cache.get(c),
          s = new Date();
        if (
          (s.setTime(s.getTime() - Nh(s, t.metadata.timeZone)),
          t.metadata.responseTime >
            Date.now() -
              (a &&
              !((t) => {
                const s = 60 * t.getUTCHours() + t.getUTCMinutes();
                return s <= 15 || s >= 1425;
              })(s)
                ? 600000
                : 55000))
        )
          return void this.Ps(t);
      }
      (t || dh(this.dom, $m)) && this.showLoading();
      const l = mh(),
        u = {};
      var d;
      ((u[rs.i("HzIkqJImqP1GnJqhLKE1pzH=")] =
        ((d = [
          An([e, n, l].join("~")),
          Li(ki(l), 12),
          Li(ki((256 * Math.random()) | 0)),
        ].join(".")),
        ns(btoa(d)))),
        (this.loader = new Xs()),
        this.loader
          .load({
            url: xs,
            formData: JSON.stringify(r),
            headers: u,
            validate: ["metadata", a ? "daily" : "hourly"],
          })
          .then((t) => {
            ((t.metadata.responseTime = Date.now()),
              this.cache.containsKey(c) && this.cache.remove(c),
              this.cache.set(c, t),
              this.cache.prune(),
              clearTimeout(this.loadTimeoutID),
              (this.loadTimeoutID = setTimeout(
                () => {
                  try {
                    this.Ps(t);
                  } catch (t) {
                    (this.showError(), Qs.add("weather", t.message));
                  }
                },
                et((s || 0) - Date.now(), 0, 500)
              )));
          })
          .catch((t) => {
            (clearTimeout(this.loadTimeoutID),
              this.cache.containsKey(c)
                ? this.Ps(this.cache.get(c))
                : !/^(Invalid|Missing|Bad)/.test((t && t.message) || "") &&
                    i < 3 &&
                    navigator.onLine
                  ? (this.loadTimeoutID = setTimeout(() => {
                      this.load(!0, 0, i + 1);
                    }, 1000 * i))
                  : (this.showError(), Qs.add("weather", t.message)));
          }));
    }
    hideError() {
      uh(this.activity, [Hm, Qm]);
    }
    showError() {
      (uh(this.activity, Qm), lh(this.activity, Hm));
    }
    hideLoading() {
      (Yn.user.isDailySummary
        ? (uh(this.dom, qm), lh(this.dom, Zm))
        : (uh(this.dom, Zm), lh(this.dom, qm)),
        uh(this.dom, $m),
        uh(this.activity, Qm));
    }
    showLoading() {
      (lh(this.dom, $m), uh(this.activity, Hm), lh(this.activity, Qm));
    }
    Ps(t) {
      if (!t || !t.metadata) return;
      const s = Yn.user.isDailySummary,
        i = Yn.timeZone,
        h = (Yn.timeZone = t.metadata.timeZone || null),
        e = Tn({
          type: s ? "daily" : (t.hourly && t.hourly.model) || Yn.model,
          lon: t.metadata.longitude,
          lat: t.metadata.latitude,
          tz: h,
          data: s ? t.daily : t.hourly,
        });
      (this.hash === e
        ? (this.hideLoading(), this.updateSelected(!0))
        : ((this.data = t),
          (this.hash = e),
          s && this.tbody && (this.tbody.scrollTop = 0),
          this.updateHead(),
          this.updateBody()),
        this.zs(),
        i !== h &&
          this.dispatchEvent({
            type: Q,
          }));
    }
    updateFavorite() {
      const t = this.Os();
      (t
        ? (t.title && (this.config.title = t.title), lh(this.dom, Km))
        : uh(this.dom, Km),
        !Kh.storage || this.config.isGeolocation || (!t && lr.ot)
          ? uh(this.dom, Ym)
          : lh(this.dom, Ym));
    }
    updateTitle() {
      if (
        (this.updateFavorite(), uh(this.title, Vm), this.config.isGeolocation)
      )
        ah(this.title, Is.info.geolocation);
      else {
        let t = (this.config.title || "")
          .split(Is.punctuation.comma.replace(/ /g, ""))[0]
          .split(",")[0]
          .trim();
        const { longitude: s, latitude: i } = this.config;
        if (!t && $s(s) && $s(i)) {
          const [h, e] = bf([s, i], Yn.user.coordinateUnit === Ke.DMS ? 5 : 7);
          ((t = e + Is.punctuation.comma + h), lh(this.title, Bm));
        } else uh(this.title, Bm);
        (ah(this.title, t),
          this.title.scrollWidth > this.title.offsetWidth &&
            lh(this.title, Vm));
      }
    }
    updateHead() {
      Vi(this.thead);
      const t = (this.thead = Xi("thead")),
        s = Ki(t, Ki(t, Xi("tr", "title"))),
        i = Ki(t, Ki(t, Xi("tr", "units"))),
        h = Yn.user.isDailySummary;
      ((Ki(
        s,
        Xi("th", ap(tp.SUMMARY), h ? Is.info.title.daily : Is.info.title.hourly)
      ).colSpan = 2),
        (this.tz = Ki(i, Xi("td", tp.TIME))),
        this.Us());
      const e = h ? sp : np,
        n = e[Yn.layer] || e.default;
      for (let t = 0, e = n.length; t < e; t++) {
        const e = n[t];
        (t > 0 && Ki(s, Xi("th", e + (h ? " range" : ""), Is.layer.abbr[e])),
          Ki(i, Xi("td", ap(e), Yn.user.getUnitString(e, !0))));
      }
      Ki(this.table, t);
    }
    Us() {
      const t = Yn.user.isUTCTimeZone && !Yn.user.isDailySummary,
        s = t ? 0 : Nh(Yn.getDate(), Yn.timeZone) / -3600000,
        i = Is.unit.utc + (t ? "" : (s < 0 ? wn : "+") + Math.abs(s));
      ah(this.tz, i);
    }
    updateBody() {
      if (!this.data) return;
      const t = Yn.user.isDailySummary;
      let s,
        i = null,
        h = null;
      if (t) {
        const t = this.data.daily;
        t && (s = t.days);
      } else {
        const t = this.data.hourly;
        t &&
          ((s = t.hours),
          (i = this.config.sunriseDate =
            t.sunrise ? new Date(t.sunrise) : null),
          (h = this.config.sunsetDate = t.sunset ? new Date(t.sunset) : null));
      }
      if (!Array.isArray(s)) return;
      ((this.rows.length = 0),
        (this.bars.length = 0),
        (this.maxCells.length = 0));
      const e = this.tbody ? this.tbody.scrollTop : 0;
      Vi(this.tbody);
      const n = (this.tbody = Xi("tbody")),
        r = Yn.user.isUTCTimeZone,
        o = mh() - 3600000;
      let a = "";
      for (let e = 0, n = s.length; e < n; e++) {
        const n = s[e],
          c = new Date(n.date),
          l = c.getTime();
        if (isNaN(l) || (!t && (l < o || l > o + 90000000))) continue;
        const u = new Date(l - (r ? 0 : Nh(c, Yn.timeZone)));
        if (t)
          this.addDayRow({
            entry: n,
            utcDate: c,
            localDate: u,
          });
        else {
          (null !== i &&
            l >= i.getTime() &&
            (this.addSunRow({
              sunriseDate: i,
            }),
            (i = null)),
            null !== h &&
              l >= h.getTime() &&
              (this.addSunRow({
                sunsetDate: h,
              }),
              (h = null)));
          const t = Ni(
            Is.date.days[u.getUTCDay()] +
              Is.punctuation.space +
              u.getUTCDate() +
              Is.date.dayExtra +
              Is.punctuation.space +
              Is.date.months[u.getUTCMonth()]
          );
          (t !== a &&
            (a &&
              this.addDateRow({
                dateText: t,
                utcDate: c,
              }),
            (a = t)),
            this.addHourRow({
              entry: n,
              utcDate: c,
              localDate: u,
            }));
        }
      }
      if (t) {
        const t = Yn.layer;
        t === Re.PRESSURE && lh(n, "compact");
        const s = new ui(
          Math.min(
            ep[t] || 1 / 0,
            ...this.bars.map((t) => t.range.min).filter($s)
          ),
          Math.max(
            hp[t] || -1 / 0,
            ...this.bars.map((t) => t.range.max).filter($s)
          )
        );
        for (let t = this.bars.length; t--; ) {
          const i = this.bars[t];
          let h = et(((i.range.min - s.min) / s.span) * 100, 0, 100),
            e = et(((s.max - i.range.max) / s.span) * 100, 0, 100);
          const n = h + e;
          if (n > 92.5) {
            const t = 92.5 / n;
            ((h *= t), (e *= t));
          }
          ((i.style.marginLeft = et(h, 0, 100) + "%"),
            (i.style.marginRight = et(e, 0, 100) + "%"));
        }
      }
      if ((Ki(this.table, n), n && (n.scrollTop = e), t)) {
        const t = et(
          Math.max(
            ...this.maxCells.map((t) => t.getBoundingClientRect().width)
          ),
          0,
          42
        );
        if ($s(t))
          for (let s = this.maxCells.length; s--; ) {
            const i = this.maxCells[s];
            i.parentElement && (i.parentElement.style.width = t + "px");
          }
      }
      (this.hideLoading(), this.updateSelected(!0));
    }
    addRow(t) {
      if ((void 0 === t && (t = !1), !this.tbody)) return;
      const s = Ki(this.tbody, Xi("tr"));
      return (t && lh(s, "dark"), s);
    }
    addDayRow(t) {
      if (this.rows.length >= 5) return;
      const { entry: s, utcDate: i } = t,
        h = ph();
      h.setTime(h.getTime() - Nh(h, Yn.timeZone));
      const e = Dh(h) === Dh(i);
      if (!e && i.getTime() < h.getTime()) return;
      const n = this.addRow();
      if (!n) return;
      const r =
        e && !jm.includes(Kh.lang)
          ? Is.date.relative.today
          : Ni(Is.date.daysShort[i.getUTCDay()]);
      Ki(n, Xi("td", tp.DAY, r));
      const o = new Date(i.getTime());
      (o.setUTCHours(12, 0, 0, 0),
        o.setTime(o.getTime() + Nh(o, Yn.timeZone)),
        (n.date = o));
      const a = Mh(new Date(i.getTime()));
      (a.setTime(a.getTime() + Nh(a, Yn.timeZone)), (n.dayDate = a));
      const c = sp[Yn.layer] || sp.default;
      let l, u, d;
      for (let t = 0, i = c.length; t < i; t++) {
        const i = c[t];
        switch (i) {
          case tp.CONDITION:
            const t = Ki(n, Xi("td", i));
            (lh(t, [i, Oi(s[Um.CONDITION])]),
              Ki(t, Xi("span", "condition-icon")));
            break;
          case tp.WIND_DIRECTION:
            const h = Ki(n, Xi("td", i)),
              e = s[Um.WIND_DIRECTION];
            $s(e) && (h.innerHTML = zi(e + 180));
            break;
          case tp.WIND_SPEED:
            ((l = Re.WIND_SPEED), (u = s[Um.WIND_SPEED]), (d = Yn.user.P));
            break;
          case tp.WIND_GUSTS:
            ((l = Re.WIND_GUSTS), (u = s[Um.WIND_GUSTS]), (d = Yn.user.P));
            break;
          case tp.TEMPERATURE:
            ((l = Re.TEMPERATURE), (u = s[Um.TEMPERATURE]), (d = Yn.user.L));
            break;
          case tp.TEMPERATURE_FEEL:
            ((l = Re.TEMPERATURE),
              (u = s[Um.TEMPERATURE_FEEL]),
              (d = Yn.user.L));
            break;
          case tp.TEMPERATURE_WET_BULB:
            ((l = Re.TEMPERATURE),
              (u = s[Um.TEMPERATURE_WET_BULB]),
              (d = Yn.user.L));
            break;
          case tp.HUMIDITY:
            ((l = Re.HUMIDITY), (u = s[Um.HUMIDITY]), (d = Ss));
            break;
          case tp.DEW_POINT:
            ((l = Re.DEW_POINT), (u = s[Um.DEW_POINT]), (d = Yn.user.L));
            break;
          case tp.PRESSURE:
            ((l = Re.PRESSURE), (u = s[Um.PRESSURE]), (d = Yn.user.R));
        }
      }
      if (u && void 0 !== u.min && void 0 !== u.max) {
        if (qs(d)) {
          let t = d.call(Yn.user, u.min);
          (/\d/.test(t) || (t = ""), Ki(n, Xi("td", "min", t)));
        }
        const t = Ki(n, Xi("td", "range")),
          s = Ki(t, Xi("span", "track")),
          i = Ki(s, Xi("span", "bar"));
        if (((i.range = u), this.bars.push(i), l)) {
          const t = [l, u.min, u.max].join("~");
          this.gradientCache.containsKey(t)
            ? lp(i, this.gradientCache.get(t))
            : setTimeout(() => {
                const s = [];
                for (let t = 0; t <= 8; t++)
                  s.push(Ua(l, ut(u.min, u.max, t / 8)));
                const h = s.join(",");
                (this.gradientCache.set(t, h),
                  this.gradientCache.prune(),
                  lp(i, h));
              }, 0);
        }
        if (qs(d)) {
          let t = d.call(Yn.user, u.max);
          /\d/.test(t) || (t = "");
          const s = Xi("span", "", t);
          (this.maxCells.push(s), Ki(n, Xi("td", "max", s)));
        }
      }
      this.rows.push(n);
    }
    addSunRow(t) {
      const s = this.addRow();
      if (!s) return;
      lh(s, "sun");
      const { sunriseDate: i, sunsetDate: h } = t,
        e = !!i,
        n = e ? i : h;
      Ki(s, Xi("td", tp.TIME)).innerHTML = Yn.user.M(
        new Date(n.getTime() - (Yn.user.isUTCTimeZone ? 0 : Nh(n, Yn.timeZone)))
      );
      const r = tp.CONDITION,
        o = Ki(s, Xi("td", r));
      (lh(o, [r, e ? "sunrise" : "sunset"]),
        Ki(o, Xi("span", "condition-icon")),
        (Ki(
          s,
          Xi(
            "td",
            "text",
            e ? Is.info.condition.sunrise : Is.info.condition.sunset
          )
        ).colSpan = 2));
    }
    isNight(t) {
      if (null !== this.config.sunriseDate && null !== this.config.sunsetDate) {
        const s = t.getTime();
        return (
          cp(s, this.config.sunsetDate.getTime()) >
          cp(s, this.config.sunriseDate.getTime())
        );
      }
      return (
        this.sun.compute(t),
        this.sun.isNight(this.config.longitude, this.config.latitude)
      );
    }
    addDateRow(t) {
      const { dateText: s = "", utcDate: i } = t,
        h = this.addRow(this.isNight(i));
      h && (lh(h, "date"), (Ki(h, Xi("th", "text", s)).colSpan = 4));
    }
    addHourRow(t) {
      if (this.rows.length > 24) return;
      const { entry: s, utcDate: i, localDate: h } = t,
        e = this.isNight(i),
        n = this.addRow(e);
      if (!n) return;
      ((Ki(n, Xi("td", tp.TIME)).innerHTML = Yn.user.M(h)), (n.date = i));
      const r = np[Yn.layer] || np.default;
      for (let t = 0, i = r.length; t < i; t++) {
        const i = r[t],
          h = Ki(n, Xi("td", i));
        let o,
          a,
          c = !1;
        switch (i) {
          case tp.CONDITION:
            (lh(h, [i, Oi(Ze(s[Wm.RAIN], s[Wm.SNOW], s[Wm.CLOUD], e))]),
              Ki(h, Xi("span", "condition-icon")));
            break;
          case tp.PRECIPITATION:
            const t = s[Wm.RAIN],
              n = s[Wm.SNOW],
              r = n > t;
            ((o = r ? n : t),
              (a = o < 0.1 ? "0" : Yn.user.I(o, r)),
              lh(h, Oi(Ze(t, n) || "zero")));
            break;
          case tp.WIND_SPEED:
            ((o = s[Wm.WIND_SPEED]),
              (a = Yn.user.P(o)),
              !/^0/.test(a) &&
                $s(s.windDirection) &&
                ((a += zi(s.windDirection + 180)), (c = !0)));
            break;
          case tp.WIND_GUSTS:
            ((o = s[Wm.WIND_GUSTS]), (a = Yn.user.P(o)));
            break;
          case tp.TEMPERATURE:
            ((o = s[Wm.TEMPERATURE]), (a = Yn.user.L(o)));
            break;
          case tp.TEMPERATURE_FEEL:
            ((o = s[Wm.TEMPERATURE_FEEL]), (a = Yn.user.L(o)));
            break;
          case tp.TEMPERATURE_WET_BULB:
            ((o = s[Wm.TEMPERATURE_WET_BULB]), (a = Yn.user.L(o)));
            break;
          case tp.HUMIDITY:
            ((o = s[Wm.HUMIDITY]), (a = Ss(o)));
            break;
          case tp.DEW_POINT:
            ((o = s[Wm.DEW_POINT]), (a = Yn.user.L(o)));
            break;
          case tp.PRESSURE:
            ((o = s[Wm.PRESSURE]), (a = Yn.user.R(o)));
        }
        if ($s(o))
          if (i === (rp[Yn.layer] || rp.default)) {
            const t = Xi("span", "value");
            (c ? (t.innerHTML = a) : ah(t, a),
              (t.style.backgroundColor = Ua(i, o)),
              Ki(h, t));
          } else c ? (h.innerHTML = a) : ah(h, a);
      }
      this.rows.push(n);
    }
    updateSelected(t) {
      (clearTimeout(this.scrollTimeoutID),
        t
          ? this.selectClosestRow(t)
          : (this.scrollTimeoutID = setTimeout(() => {
              this.selectClosestRow(t);
            }, 400)));
    }
    getClosestRow() {
      const t = Yn.time;
      let s = 1 / 0,
        i = null;
      for (let h = 0, e = this.rows.length; h < e; h++) {
        const e = this.rows[h],
          n = (e.dayDate || e.date).getTime();
        if (n > t) break;
        const r = Math.abs(t - n);
        ((r < s && e.dayDate) || r < 3600000) && ((s = r), (i = e));
      }
      return i;
    }
    selectClosestRow(t) {
      if (!Yn.isForecastLayer) return (this.selectRow(), void Qi(this.tbody));
      const s = this.getClosestRow();
      if ((this.selectRow(s), s)) {
        if (s.scrollIntoView)
          try {
            return void s.scrollIntoView({
              behavior: t ? "instant" : "smooth",
              block: "nearest",
            });
          } catch (t) {}
        if (s.scrollIntoViewIfNeeded)
          try {
            s.scrollIntoViewIfNeeded(!0);
          } catch (t) {}
      }
    }
    selectRow(t) {
      (uh(this.selectedRow, Xm),
        (this.selectedRow = Yn.isForecastLayer ? t : null),
        this.selectedRow && lh(t, Xm),
        this.Us());
    }
    zs() {
      if (!Yn.user.isDailySummary) return;
      const t = Yn.forecastRange,
        s = t ? t.maxDate.getTime() : mh() + 216000000;
      for (let t = this.rows.length; t--; ) {
        const i = this.rows[t];
        i.style.pointerEvents = i.dayDate.getTime() > s ? "none" : "";
      }
    }
    Os() {
      return lr.ct(this.config.longitude, this.config.latitude);
    }
    Cs() {
      return lr.removeLocation(this.config.longitude, this.config.latitude);
    }
    Fs() {
      if (!Kh.storage) return !1;
      if (lr.ot) return !1;
      const { title: t, place: s, longitude: i, latitude: h } = this.config;
      if (!$s(i) || !$s(h)) return !1;
      const e = {
        lon: i,
        lat: h,
      };
      s && (e.place = s);
      const n = (function (t, s) {
        if (
          (void 0 === t && (t = ""),
          void 0 === s && (s = 128),
          (t = t.trim()).length <= s)
        )
          return t.replace(/,\s*$/, "");
        const i = t.lastIndexOf(" ", s);
        return t.slice(0, i > -1 ? i : s).replace(/,\s*$/, "");
      })(t);
      return (
        n && (e.title = n),
        !!lr.addLocation(e) &&
          (navigator.storage &&
            navigator.storage.persisted &&
            navigator.storage
              .persisted()
              .then((t) => {
                !t &&
                  navigator.storage.persist &&
                  navigator.storage.persist().catch((t) => {});
              })
              .catch((t) => {}),
          !0)
      );
    }
    hide() {
      (this.showLoading(),
        (Yn.timeZone = null),
        clearTimeout(this.loadTimeoutID),
        this.loader && this.loader.cancel(),
        this.dispatchEvent({
          type: f,
        }));
    }
    resize() {
      (this.updateTitle(), this.updateSelected(!0));
    }
  }
  class dp extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".group.zoom")),
        nh(this.dom),
        (this.in = qi(this.dom, "button.in")),
        (this.out = qi(this.dom, "button.out")),
        _i(this.in, s, (s) => {
          this.dispatchEvent({
            type: t,
            delta: 1,
          });
        }),
        _i(this.out, s, (s) => {
          this.dispatchEvent({
            type: t,
            delta: -1,
          });
        }),
        hh(this.in),
        hh(this.out));
    }
    update(t) {
      ((this.in.disabled = t === Yn.zooms.max),
        (this.out.disabled = t === Yn.zooms.min));
    }
  }
  class fp {
    constructor() {
      ((this.dom = qi(document, ".panel.consent-heat")),
        nh(this.dom),
        (this.button = qi(this.dom, "button.dialog")),
        hh(this.button),
        (this.closeButton = qi(this.dom, "button.close")));
    }
  }
  class mp extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".panel.intro-layer")),
        nh(this.dom),
        (this.button = qi(this.dom, "button.accent")),
        hh(this.button),
        (this.layer = void 0));
      const t = $i(this.dom, "a");
      for (let i = t.length; i--; ) {
        const h = t[i];
        _i(h, s, (t) => {
          (th(t),
            this.dispatchEvent({
              type: "layer",
              layer: h.href.split("#map=")[1],
            }));
        });
      }
    }
    update() {
      this.layer !== Yn.layer &&
        (this.layer && uh(this.dom, this.layer),
        (this.layer = Yn.layer),
        lh(this.dom, this.layer));
    }
    dismiss() {
      let t = Yn.layer;
      t === Re.RADAR && (t += ke);
      const s = Yn.layerIntros;
      !s.includes(t) &&
        Ks(Re, t.replace(ke, "")) &&
        (s.unshift(t), (Yn.layerIntros = s));
    }
  }
  class pp extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".panel.intro-model")),
        nh(this.dom),
        (this.button = qi(this.dom, "button")),
        hh(this.button),
        (this.model = void 0));
    }
    update() {
      this.model !== Yn.model &&
        (this.model && uh(this.dom, this.model),
        (this.model = Yn.model),
        lh(this.dom, this.model));
    }
    dismiss() {
      const t = this.model,
        s = Yn.modelIntros;
      !s.includes(t) && Ks(ri, t) && (s.unshift(t), (Yn.modelIntros = s));
    }
  }
  class gp extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".panel.outage")),
        nh(this.dom),
        (this.button = qi(this.dom, "button")),
        hh(this.button),
        (this.description = qi(this.dom, ".description")),
        (this.reason = qi(this.dom, ".reason")),
        (this.data = []));
    }
    update(t) {
      const i = Yn.time,
        [h] = this.data.filter((s) => {
          if (s.id !== t) return !1;
          const h = Date.parse(s.from),
            e = Date.parse(s.to);
          return (isNaN(h) || i >= h) && (isNaN(e) || i <= e);
        }),
        e = Is.satellite[t];
      (ah(this.description, e ? Is.outage.description.replace("%s", e) : ""),
        h && h.message
          ? ((this.reason.innerHTML = vn(h.message, "a")),
            _i(qi(this.reason, "a"), s, (t) => {
              this.dispatchEvent({
                type: w,
                url: h.url,
              });
            }))
          : ah(this.reason, Is.outage.reason));
    }
  }
  class wp extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".panel.welcome")),
        nh(this.dom),
        (this.isLocation = dh(this.dom, "location")));
      const t = qi(this.dom, "button.close");
      _i(t, s, (t) => {
        this.dispatchEvent({
          type: i,
        });
      });
      const h = qi(this.dom, "button.continue");
      (hh(h),
        _i(h, s, (t) => {
          this.dispatchEvent({
            type: i,
          });
        }));
      const e = qi(this.dom, "button.geolocation-welcome");
      (hh(e),
        _i(e, s, (t) => {
          this.dispatchEvent({
            type: d,
          });
        }));
      const n = qi(this.dom, "button.search-welcome");
      (hh(n),
        _i(n, s, (t) => {
          this.dispatchEvent({
            type: U,
          });
        }));
    }
  }
  const vp = "error",
    yp = "loading",
    Mp = "wait";
  class bp extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".panel.storm-details")),
        ((t) => {
          if (!navigator.standalone) {
            let s = 0,
              i = 0,
              h = 0;
            (_i(t, X, (t) => {
              if (1 !== t.touches.length) return;
              const e = t.touches[0],
                n = Math.abs(i - e.clientX),
                r = Math.abs(h - e.clientY);
              (t.timeStamp &&
                t.timeStamp - s < 600 &&
                n < 50 &&
                r < 50 &&
                (th(t), t.target.click()),
                (s = t.timeStamp));
            }),
              _i(t, K, (t) => {
                const s = t.changedTouches[0];
                ((i = s.clientX), (h = s.clientY));
              }));
          }
        })(this.dom),
        (this.title = qi(this.dom, "h1")),
        (this.lastMod = qi(this.dom, ".lastmod")),
        (this.content = qi(this.dom, "section")),
        Hi(this.content, () => {
          Ns() && this.toggle();
        }),
        _i(qi(this.dom, "button.close"), s, (t) => {
          this.toggle();
        }),
        (this.activity = qi(this.dom, ".activity")),
        (this.titleText = ""),
        (this.nameText = ""),
        (this.loader = null),
        (this.id = null),
        (this.cache = new Eu(5)),
        _i(qi(this.activity, "button"), s, (t) => {
          this.load(this.id);
        }));
    }
    load(t) {
      if (!t) return;
      (this.loader && this.loader.cancel(),
        this.hideError(),
        this.showLoading(),
        (this.id = t),
        ah(this.lastMod, ""),
        this.dom.removeAttribute("style"));
      const s = {
        details: t,
      };
      (Kh.enLang || (s.lang = Kh.lang),
        (this.loader = new Xs()),
        this.loader
          .load({
            url: gs,
            params: s,
            validate: ["details"],
          })
          .then((s) => {
            (this.cache.containsKey(t) && this.cache.remove(t),
              this.cache.set(t, s),
              this.cache.prune(),
              this.show(s));
          })
          .catch((s) => {
            this.cache.containsKey(t)
              ? this.show(this.cache.get(t))
              : (this.showError(), Qs.add("stormDetails", s.message));
          }));
    }
    hideError() {
      uh(this.activity, [vp, Mp]);
    }
    showError() {
      (uh(this.activity, Mp), lh(this.activity, vp));
    }
    hideLoading() {
      (uh(this.dom, yp), uh(this.activity, Mp));
    }
    showLoading() {
      (ah(this.content, ""),
        lh(this.dom, yp),
        uh(this.activity, vp),
        lh(this.activity, Mp));
    }
    show(t) {
      this.hideLoading();
      const i = new Date(t.date);
      if (!i || isNaN(i.getTime())) ah(this.lastMod, "");
      else {
        const t = Xi("time");
        ((t.dateTime = i.toISOString()),
          (t.innerHTML =
            Eh(i) +
            Is.punctuation.comma +
            i.getUTCDate() +
            Is.date.dayExtra +
            Is.punctuation.space +
            Is.date.months[i.getUTCMonth()] +
            " " +
            i.getUTCFullYear() +
            " " +
            Is.unit.utc),
          ah(this.lastMod, Is.storm.lastMod + " "),
          Ki(this.lastMod, t));
      }
      this.content.innerHTML = Fi("text", t.details);
      const h = $i(this.content, 'a[href^="/');
      for (let t = h.length; t--; ) {
        const i = h[t],
          e = i.getAttribute("href");
        _i(i, s, (t) => {
          (th(t),
            this.dispatchEvent({
              type: "path",
              path: e,
            }));
        });
      }
      this.resize();
    }
    toggle() {
      (this.dispatchEvent({
        type: $,
      }),
        this.resize());
    }
    resize() {
      const t = qi(this.content, ".text");
      t &&
        (this.dom.style.maxHeight = Ns()
          ? ""
          : Math.round(parseFloat(getComputedStyle(t).height) + 96) + "px");
    }
  }
  const Ap = "active",
    Tp = "disturbance",
    xp = "invest",
    Ep = "selected";
  class Dp extends ji {
    constructor() {
      (super(),
        (this.dom = qi(document, ".panel.storm")),
        (this.title = qi(this.dom, "h2")),
        (this.table = qi(this.dom, "table")),
        (this.timeZone = qi(this.dom, "thead td.date")),
        (this.wind = qi(this.dom, "thead td.wind")),
        (this.pressure = qi(this.dom, "thead td.pressure")),
        (this.closeButton = qi(this.dom, "button.close")),
        (this.tbody = null),
        (this.tbodyHeight = 0));
      const t = qi(this.dom, "footer");
      ((this.footerType = qi(t, ".text-type")),
        (this.footerAlt = qi(t, ".text-alt")),
        (this.isInvest = !1),
        (this.details = new bp()),
        (this.data = null),
        (this.stormID = null),
        (this.stormHash = null),
        (this.rows = []),
        (this.selectedIndex = null),
        (this.selectedRow = null),
        (this.scrollTimeoutID = 0),
        _i(this.title, s, (t) => {
          th(t);
        }),
        _i(this.wind, s, (t) => {
          (ih(t), Yn.user.F(), this.update());
        }),
        _i(this.pressure, s, (t) => {
          (ih(t), Yn.user.S(), this.update());
        }));
      const i = (t) => {
        const s = this.rows.indexOf(t.target);
        s > -1 &&
          this.dispatchEvent({
            type: G,
            id: this.stormID,
            index: s,
          });
      };
      (Kh.safari && Kh.touch ? Zi(this.table, i) : _i(this.table, s, i),
        _i(qi(this.dom, ".details"), s, (t) => {
          this.dispatchEvent({
            type: r,
            id: this.stormID,
          });
        }));
    }
    show(t, s) {
      if (!t || (!s && this.stormID === t.id && this.stormHash === t.hash))
        return;
      ((this.data = t),
        (this.stormID = t.id),
        (this.stormHash = t.hash),
        (this.rows.length = 0),
        t.active ? lh(this.dom, Ap) : uh(this.dom, Ap));
      const i = t.description ? t.description + " " + t.name : "",
        h = t.title,
        e = t.name;
      (i && ah(this.title, i),
        (!i || this.title.scrollWidth > this.title.offsetWidth) &&
          (ah(this.title, h),
          this.title.scrollWidth > this.title.offsetWidth &&
            ah(this.title, e)));
      const n = t.season ? " " + t.season : "",
        r = h + n;
      (ah(this.details.title, i ? i + n : r),
        (this.details.titleText = r),
        (this.details.nameText = e + n),
        ah(this.wind, Yn.user.o()),
        ah(this.pressure, Yn.user.u()));
      const o = this.tbody || qi(this.table, "tbody");
      (o && this.table.removeChild(o), (this.tbodyHeight = 0));
      const a = t.disturbance;
      if (a) this.tbody = null;
      else {
        const s = Xi();
        this.tbody = Ki(s, Xi("tbody"));
        for (let s = t.track.length; s--; )
          this.rows[s] = this.addRow(this.tbody, t.track[s]);
        Ki(this.table, s);
      }
      if (((this.isInvest = !(!t.invest && !a)), this.isInvest)) {
        let t = "";
        const s = this.data.chance;
        if (s)
          t = Is.storm.chance.hours24.replace(
            "%s",
            Pi("chance " + s, Is.storm.chance[s])
          );
        else {
          const s = this.data.chance2day;
          $s(s) &&
            (t = Is.storm.chance.day2.replace(
              "%s",
              Pi("chance " + Ql(s), Ss(s))
            ));
          const i = this.data.chance7day;
          $s(i) &&
            (t && (t += Is.punctuation.comma),
            (t += Is.storm.chance.day7.replace(
              "%s",
              Pi("chance " + Ql(i), Ss(i))
            )));
        }
        (t ||
          (t = Is.storm.chance.hours24.replace(
            "%s",
            Pi("chance low", Is.storm.chance.low)
          )),
          (this.footerType.innerHTML = Is.punctuation.colon.replace(
            "%s",
            Is.storm.chance.development
          )),
          (this.footerAlt.innerHTML = t),
          lh(this.dom, xp),
          a ? lh(this.dom, Tp) : uh(this.dom, Tp));
      } else
        ((this.footerType.innerHTML = ""),
          (this.footerAlt.innerHTML = ""),
          uh(this.dom, [xp, Tp]));
      (this.Us(),
        (this.dom.dataset.rows = a ? 0 : this.rows.length),
        this.resize());
    }
    addRow(t, s) {
      const i = Ki(t, Xi("tr", "rank" + s.rank));
      (s.forecast && !s.pressure && lh(i, "rank-forecast"),
        s.description && (i.dataset.title = s.description));
      const h = new Date(s.date);
      (h.setTime(h.getTime() - (Yn.user.isUTCTimeZone ? 0 : Nh(h))),
        Ki(
          i,
          Xi(
            "td",
            "date",
            h.getUTCDate() +
              Is.date.dayExtra +
              " " +
              Is.date.monthsShort[h.getUTCMonth()]
          )
        ),
        (Ki(i, Xi("td", "time")).innerHTML = Yn.user.M(h)));
      const e = Ki(i, Xi("td", "type"));
      (Ki(e, Xi("span", "icon", s.code || "-")),
        Ki(i, Xi("td", "wind", s.wind ? Yn.user.P(mn(s.wind), 5) : "")));
      const n = Ki(
        i,
        Xi(
          "td",
          "pressure",
          s.pressure
            ? Yn.user.R(s.pressure)
            : s.forecast
              ? Is.storm.forecast
              : ""
        )
      );
      return (!s.pressure && s.forecast && lh(n, "forecast"), i);
    }
    select(t) {
      const s = this.rows[t];
      if (s && this.selectedRow !== s) {
        if (
          (this.selectedRow && uh(this.selectedRow, Ep),
          this.scrollToSelectedRow(!0),
          (this.selectedIndex = t),
          (this.selectedRow = s),
          lh(s, Ep),
          !this.isInvest)
        ) {
          ((this.footerType.className = "text-type " + s.classList[0]),
            (this.footerType.innerHTML =
              Pi("icon", oh(qi(s, ".icon"))) + (s.dataset.title || "")));
          const t = dh(s, "rank-forecast")
              ? Is.punctuation.colon.replace("%s", Is.storm.forecast)
              : "",
            i = qi(s, ".wind"),
            h = bn(oh(i)) || 0,
            e = Yn.user.o(Kh.enLang),
            n =
              Yn.user.windUnit === an.BEAUFORT
                ? h +
                  " " +
                  e +
                  " " +
                  Is.punctuation.parenthesis.replace(
                    "%s",
                    Is.info["beaufort" + Li(h)]
                  )
                : Is.storm.winds.replace("%s", h + " " + e);
          this.footerAlt.innerHTML = Ni(t + n);
        }
        this.Us();
      }
    }
    scrollToSelectedRow(t) {
      const s = this.tbody ? this.tbody.getBoundingClientRect().height : 0;
      (t || this.tbodyHeight !== s) &&
        ((this.tbodyHeight = s),
        clearTimeout(this.scrollTimeoutID),
        (this.scrollTimeoutID = setTimeout(() => {
          const t = this.selectedRow;
          if (t) {
            if (t.scrollIntoView)
              try {
                return void t.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              } catch (t) {}
            if (t.scrollIntoViewIfNeeded)
              try {
                t.scrollIntoViewIfNeeded(!0);
              } catch (t) {}
          }
        }, 400)));
    }
    Us() {
      let t;
      ($s(this.selectedIndex) &&
        this.data &&
        this.data.track &&
        this.data.track[this.selectedIndex] &&
        (t = new Date(this.data.track[this.selectedIndex].date)),
        (t && !isNaN(t.getTime())) || (t = Yn.getDate()));
      const s = Yn.user.isUTCTimeZone ? 0 : t.getTimezoneOffset() / -60;
      ah(
        this.timeZone,
        Is.unit.utc +
          (Yn.user.isUTCTimeZone ? "" : (s < 0 ? wn : "+") + Math.abs(s))
      );
    }
    update() {
      const t = this.tbody ? this.tbody.scrollTop : 0;
      (this.show(this.data, !0),
        this.select(this.selectedIndex, !1),
        this.tbody && (this.tbody.scrollTop = t));
    }
    resize() {
      (this.scrollToSelectedRow(!1), this.details.resize());
    }
  }
  const Ip = "indeterminate",
    Sp = "recording";
  class Rp extends ji {
    constructor(t) {
      (super(),
        (this.dom = qi(document, ".panel.time." + t)),
        hh(this.dom),
        eh(qi(document, ".hit-" + t)),
        (this.progressBar = qi(this.dom, ".progress .bar")),
        (this.recordTimeoutID = 0),
        (this.progressTimeoutID = 0),
        (this.buttons = {}),
        this.addButtons({
          pause: qi(this.dom, "button.pause"),
          play: qi(this.dom, "button.play"),
          latest: qi(this.dom, "button.recent.latest"),
          now: qi(this.dom, "button.recent.now"),
        }));
    }
    addButtons(t) {
      for (let s in t) {
        const i = (this.buttons[s] = t[s]);
        hh(i);
      }
      return this.buttons;
    }
    set progress(t) {
      (clearTimeout(this.recordTimeoutID),
        clearTimeout(this.progressTimeoutID),
        uh(this.dom, Ip),
        this.progressBar &&
          (this.progressBar.style.strokeDashoffset = Math.round(
            100 * (1 - t)
          )));
    }
    hideRecording() {
      (clearTimeout(this.progressTimeoutID),
        uh(this.dom, Sp),
        (this.progressTimeoutID = setTimeout(() => {
          this.progress = 0;
        }, 200)));
    }
    showRecording() {
      (clearTimeout(this.recordTimeoutID),
        lh(this.dom, Sp),
        (this.recordTimeoutID = setTimeout(() => {
          lh(this.dom, Ip);
        }, 800)));
    }
  }
  class kp extends Rp {
    constructor() {
      (super("clock"), nh(this.dom));
      const t = qi(this.dom, ".clock-live"),
        i = qi(this.dom, ".clock-hd"),
        h = qi(t, ".date"),
        e = qi(t, ".hour"),
        n = qi(t, ".minute"),
        r = qi(i, ".year"),
        o = qi(i, ".month"),
        a = qi(i, ".day"),
        c = qi(i, ".am-pm");
      this.text = {
        date: qi(h, ".text"),
        hour: qi(e, ".text"),
        colon: qi(t, ".text.colon"),
        minute: qi(n, ".text"),
        amPmSmall: qi(t, ".text.am-pm"),
        year: qi(r, ".text"),
        month: qi(o, ".text"),
        day: qi(a, ".text"),
        amPm: qi(c, ".text"),
      };
      const l = this.addButtons({
        dateUp: qi(h, "button.up"),
        dateDown: qi(h, "button.down"),
        hourUp: qi(e, "button.up"),
        hourDown: qi(e, "button.down"),
        minuteUp: qi(n, "button.up"),
        minuteDown: qi(n, "button.down"),
        yearUp: qi(r, "button.up"),
        yearDown: qi(r, "button.down"),
        monthUp: qi(o, "button.up"),
        monthDown: qi(o, "button.down"),
        dayUp: qi(a, "button.up"),
        dayDown: qi(a, "button.down"),
        amPmUp: qi(c, "button.up"),
        amPmDown: qi(c, "button.down"),
      });
      this.repeatID = 0;
      const u = (t, i, h) => {
        _i(t, s, (t) => {
          this.dispatchDateEvent(i, h);
        });
        const e = () => {
          document.hidden ||
            (this.repeatID = setTimeout(() => {
              t.disabled || (this.dispatchDateEvent(i, h), e());
            }, 150));
        };
        (_i(t, X, (s) => {
          (th(s),
            clearTimeout(this.repeatID),
            t.disabled ||
              (this.dispatchDateEvent(i, h),
              (this.repeatID = setTimeout(() => {
                e();
              }, 350))));
        }),
          _i(t, K, (t) => {
            (th(t), clearTimeout(this.repeatID));
          }));
      };
      (_i(document, tt, (t) => {
        clearTimeout(this.repeatID);
      }),
        _i(l.pause, s, (t) => {
          (clearTimeout(this.repeatID),
            this.dispatchEvent({
              type: L,
            }));
        }),
        _i(l.play, s, (t) => {
          (clearTimeout(this.repeatID),
            this.dispatchEvent({
              type: N,
            }));
        }),
        u(l.dateUp, "day", 1),
        u(l.dateDown, "day", -1),
        u(l.hourUp, "hour", 1),
        u(l.hourDown, "hour", -1),
        u(l.minuteUp, "minute", 1),
        u(l.minuteDown, "minute", -1),
        u(l.yearUp, "year", 1),
        u(l.yearDown, "year", -1),
        u(l.monthUp, "month", 1),
        u(l.monthDown, "month", -1),
        u(l.dayUp, "day", 1),
        u(l.dayDown, "day", -1),
        u(l.amPmUp, "ampm", 1),
        u(l.amPmDown, "ampm", -1),
        _i(l.latest, s, (t) => {
          (clearTimeout(this.repeatID), this.dispatchDateEvent("recent"));
        }),
        _i(l.now, s, (t) => {
          (clearTimeout(this.repeatID), this.dispatchDateEvent("recent"));
        }));
    }
    dispatchDateEvent(t, s) {
      this.dispatchEvent({
        type: n,
        calendar: t,
        delta: s,
      });
    }
    update(t) {
      const s = Yn.isHDLayer,
        i = t || Yn.getDate();
      if ((Yn.user.isTimeline && !s) || isNaN(i)) return;
      const h = Yn.isRadarLayer,
        e = Yn.isForecastLayer,
        n = Yn.user.isUTCTimeZone,
        r = s || n ? 0 : Nh(i, Yn.timeZone),
        o = new Date(i.getTime() - r);
      t ? Yn.X(o) : !n && e && o.setTime(o.getTime() + (r % 600000));
      const a = o.getUTCFullYear(),
        c = o.getUTCMonth(),
        l = o.getUTCDate(),
        u = _s.all,
        d = Yn.hdMaxDate;
      ((this.buttons.yearUp.disabled = a >= d.getUTCFullYear()),
        (this.buttons.yearDown.disabled = a <= u.getUTCFullYear()),
        (this.buttons.monthUp.disabled =
          this.buttons.yearUp.disabled && c >= d.getUTCMonth()),
        (this.buttons.monthDown.disabled =
          this.buttons.yearDown.disabled && c <= u.getUTCMonth()));
      const f = Is.date.monthsShort[c];
      ((this.buttons.dayUp.disabled =
        this.buttons.monthUp.disabled && l >= d.getUTCDate()),
        (this.buttons.dayDown.disabled =
          this.buttons.monthDown.disabled && l <= u.getUTCDate()));
      const m = l + Is.date.dayExtra;
      ((this.buttons.amPmUp.disabled =
        this.buttons.dayUp.disabled && !Yn.layers.hd.isAM),
        (this.buttons.amPmDown.disabled =
          this.buttons.dayDown.disabled && Yn.layers.hd.isAM),
        ah(this.text.year, a),
        ah(this.text.month, f),
        ah(this.text.day, m),
        ah(this.text.amPm, Yn.layers.hd.isAM ? Is.date.am : Is.date.pm));
      const p = new Date(Yn.minDate.getTime() - r),
        g = p.getTime(),
        w = new Date(Yn.maxDate.getTime() - r),
        v = w.getTime(),
        y = e
          ? !Yn.forecastRange
          : !(h ? Yn.layers.radar.hasRange : Yn.layers.geocolor.hasRange),
        M = new Date(Yn.time - r);
      (M.setUTCDate(M.getUTCDate() + 1),
        (this.buttons.dateUp.disabled =
          y ||
          (e
            ? M.getTime() > v
            : M.getTime() > v && M.getUTCDate() !== w.getUTCDate())));
      const b = new Date(Yn.time - r);
      (b.setUTCDate(b.getUTCDate() - 1),
        (this.buttons.dateDown.disabled =
          y || (b.getTime() < g && b.getUTCDate() !== p.getUTCDate())));
      const A = new Date(Yn.time - r);
      (A.setUTCHours(A.getUTCHours() + 1),
        (this.buttons.hourUp.disabled =
          y ||
          (this.buttons.dateUp.disabled &&
            A.getTime() > v &&
            A.getUTCHours() !== w.getUTCHours())));
      const T = new Date(Yn.time - r);
      (T.setUTCHours(T.getUTCHours() - 1),
        (this.buttons.hourDown.disabled =
          y ||
          (this.buttons.dateDown.disabled &&
            T.getTime() < g &&
            T.getUTCHours() !== p.getUTCHours())));
      const x = h ? 5 : Ln,
        E = new Date(Yn.time - r);
      (E.setUTCMinutes(E.getUTCMinutes() + x),
        (this.buttons.minuteUp.disabled =
          y || (this.buttons.hourUp.disabled && E.getTime() > v)));
      const D = new Date(Yn.time - r);
      (D.setUTCMinutes(D.getUTCMinutes() - x),
        (this.buttons.minuteDown.disabled =
          y || (this.buttons.hourDown.disabled && D.getTime() < g)));
      const I = !t && Yn.useTimeSync;
      (I ? lh(this.text.colon, "blink") : uh(this.text.colon, "blink"),
        (this.text.date.innerHTML =
          Pi("day-number", m) + Is.punctuation.space + Pi("month", f)));
      const { hourText: S, amPmText: R } = Th(
        o.getUTCHours(),
        Yn.user.is12HourTimeFormat,
        Is.date.am,
        Is.date.pm
      );
      (ah(this.text.hour, S), ah(this.text.amPmSmall, R));
      const k = Li(o.getUTCMinutes());
      ah(this.text.minute, k);
      const L = mh();
      (i.getTime() > L
        ? lh(this.buttons.now, "reverse")
        : uh(this.buttons.now, "reverse"),
        (this.buttons.latest.disabled = s ? this.buttons.amPmUp.disabled : I),
        (this.buttons.now.disabled = I));
    }
  }
  const Lp = 3600000,
    Np = "active",
    Op = "dark-odd",
    Cp = "recent",
    Fp = "reverse";
  class Pp extends Rp {
    constructor() {
      (super("timeline"),
        (this.tooltip = qi(this.dom, ".time-tooltip .text")),
        (this.tooltipHTML = ""),
        (this.initTimeoutID = 0),
        (this.activeTimeoutID = 0),
        (this.rafID = 0),
        (this.updateTimeoutID = 0),
        (this.oldScrollOffset = -1),
        (this.mouseX = -1),
        (this.mouseOffset = -1),
        (this.recentOffset = -1),
        (this.targetRecentOffset = -1),
        (this.observer = void 0),
        (this.hourWidth = 0),
        (this.dayWidths = []),
        (this.hourText = ""),
        (this.dayText = ""),
        (this.timeFades = []),
        (this.maxScrollRate = 0),
        (this.fastMaxScrollRate = 0),
        (this.minTime = 0),
        (this.maxTime = 0),
        (this.isPressed = !1),
        (this.isInit = !1),
        (this.isForcingTime = !1),
        (this.isSyncingTime = !1),
        (this.isScrollingToRecent = !1),
        (this.isWithinMSG = !1),
        (this.isOddDark = void 0),
        (this.scroll = qi(this.dom, ".scroll")),
        nh(this.scroll),
        (this.pad = qi(this.scroll, ".pad")),
        (this.times = qi(this.scroll, ".times")),
        (this.recent = qi(this.pad, ".recent-indicator")),
        _i(this.scroll, "scroll", (t) => {
          if (this.isForcingTime) return;
          if ((clearTimeout(this.updateTimeoutID), this.isSyncingTime))
            return void (this.isSyncingTime = !1);
          if (this.isInit) return;
          if (
            this.isScrollingToRecent &&
            Math.abs(this.targetRecentOffset - this.scrollOffset) < 1
          )
            return (
              this.dispatchEvent({
                type: F,
              }),
              void (this.updateTimeoutID = setTimeout(() => {
                ((this.isScrollingToRecent = !1),
                  this.dispatchEvent({
                    type: F,
                  }),
                  this.hideActive());
              }, 100))
            );
          (this.isActive &&
            this.dispatchEvent({
              type: q,
              time: this.time,
            }),
            this.update());
          const s = Math.abs(this.scrollOffset - this.oldScrollOffset);
          this.oldScrollOffset = this.scrollOffset;
          const i = Yn.G
            ? 500
            : s > (Yn.j ? this.fastMaxScrollRate : this.maxScrollRate)
              ? Gi
              : 0;
          0 === i
            ? (cancelAnimationFrame(this.rafID),
              (this.rafID = requestAnimationFrame(() => {
                this.dispatchEvent({
                  type: Q,
                });
              })))
            : (this.updateTimeoutID = setTimeout(() => {
                this.dispatchEvent({
                  type: Q,
                });
              }, i));
        }),
        Bi(this.scroll, [s, D, x], (t) => {
          this.isPressed || Kh.touch || this.showActive();
        }),
        _i(this.scroll, A, (t) => {
          this.isScrollingToRecent ||
            Kh.touch ||
            ((this.isPressed = !0),
            (this.mouseX = t.clientX),
            (this.mouseOffset = this.scrollOffset),
            this.showActive(this.isForcingTime));
        }),
        _i(document.body, x, (t) => {
          this.isPressed &&
            -1 !== this.mouseOffset &&
            -1 !== this.mouseX &&
            ((Yn.useTimeSync = !1),
            (this.scrollOffset = this.mouseOffset + this.mouseX - t.clientX));
        }),
        Bi(document.body, [I, T], (t) => {
          (this.hideActive(), (this.isPressed = !1));
        }),
        _i(this.scroll, E, (t) => {
          this.isPressed || this.hideActive(this.isForcingTime);
        }),
        Bi(this.scroll, [S, st], (t) => {
          ((Yn.useTimeSync = !1), this.isPressed || this.showActive(!0));
        }),
        _i(this.scroll, X, (t) => {
          ((this.isPressed = !0),
            (this.isScrollingToRecent = !1),
            this.showActive(!0));
        }),
        _i(this.scroll, J, (t) => {
          ((this.isPressed = !0),
            (this.isScrollingToRecent = !1),
            Yn.useTimeSync && Yn.isTimeSyncLayer && (Yn.useTimeSync = !1));
        }),
        _i(this.scroll, K, (t) => {
          (this.hideActive(), (this.isPressed = !1));
        }));
      const t = this.buttons;
      (_i(t.pause, s, (t) => {
        this.dispatchEvent({
          type: L,
        });
      }),
        _i(t.play, s, (t) => {
          (this.dispatchEvent({
            type: N,
          }),
            this.hideActive(!0),
            (this.isPressed = !1));
        }),
        _i(t.latest, s, (t) => {
          this.scrollToRecent();
        }),
        _i(t.now, s, (t) => {
          this.scrollToRecent();
        }));
    }
    get scrollOffset() {
      return this.scroll.scrollLeft;
    }
    set scrollOffset(t) {
      this.scroll.scrollLeft = this.isForcingTime ? t : Math.floor(t);
    }
    get time() {
      return (
        this.minTime + (Math.round(this.scrollOffset) / this.hourWidth) * Lp
      );
    }
    set time(t) {
      this.scrollOffset = ((t - this.minTime) * this.hourWidth) / Lp;
    }
    init() {
      if (!Yn.user.isTimeline || Yn.isHDLayer) return;
      const t = Yn.minDate,
        s = Yn.maxDate;
      if (!t || !s) return;
      if (
        ((this.isWithinMSG = Yn.isWithinMSG),
        clearTimeout(this.initTimeoutID),
        this.isPressed)
      )
        return void (this.initTimeoutID = setTimeout(() => {
          this.init();
        }, 1000));
      this.hourWidth > 0 &&
        this.time > this.maxTime &&
        this.isActive &&
        (this.time = this.maxTime);
      const i = Yn.isGeocolorLayer,
        h = Yn.isRadarLayer,
        e = !i && !h,
        n = Yn.user.isUTCTimeZone;
      if (((this.minTime = Math.floor(t.getTime() / Lp) * Lp), !n)) {
        const s = Nh(t, Yn.timeZone) % Lp;
        0 !== s && (this.minTime += s + Lp);
      }
      this.maxTime = s.getTime();
      const r = Math.max(0, (this.maxTime - this.minTime) / Lp);
      if (r > 960) return;
      let o, a, c, l, u;
      ((this.isInit = !0),
        i
          ? ((this.maxScrollRate = 0),
            (this.fastMaxScrollRate = 3),
            this.isWithinMSG
              ? ((o = 3), (a = 2), (c = 3))
              : ((o = 2), (a = 3), (c = 3)))
          : ((this.maxScrollRate = 5),
            (this.fastMaxScrollRate = 20),
            h ? ((o = 0.5), (a = 12), (c = 1)) : ((o = 5), (a = 1), (c = 6))),
        (this.hourWidth = 60 / o));
      let d = 0;
      ((this.dayWidths.length = 0),
        (this.timeFades.length = 0),
        window.IntersectionObserver &&
          (this.observer && this.observer.disconnect(),
          (this.observer = new IntersectionObserver(
            (t) => {
              t.forEach((t) => {
                t.isIntersecting
                  ? this.timeFades.push(t.target)
                  : Ii(this.timeFades, t.target);
              });
            },
            {
              root: this.scroll,
              rootMargin: "0px",
              threshold: 0,
            }
          ))));
      const f = mh() - 60000 * (i ? 120 : 20),
        p = Xi(),
        g = () => {
          const t = this.dayWidths.at(-1) || 0;
          (l && (l.style.width = t + "px"),
            u &&
              ((u.innerHTML = u.props
                ? (t < 48 ? "" : u.props.dayNumber) +
                  "&nbsp;" +
                  (t < 120 ? "" : u.props.month)
                : "&nbsp;"),
              delete u.props));
        };
      for (let t = 0; t <= r; t++) {
        const s = this.minTime + t * Lp,
          h = new Date(s),
          r = new Date(s - (n ? 0 : Nh(h, Yn.timeZone))),
          o = r.getUTCHours(),
          m = Is.date.months[r.getUTCMonth()];
        if (
          ((0 !== t && 0 !== o) ||
            (t > 0 && this.dayWidths.push(this.hourWidth * d),
            g(),
            (l = Ki(p, Xi("div", "day"))),
            (u = Ki(l, Xi("span", "text"))),
            (u.props = {
              dayNumber: Pi("day-number", r.getUTCDate() + Is.date.dayExtra),
              month: Pi("month", m),
            }),
            (Ki(l, Xi("div", "ticks")).style.backgroundSize =
              this.hourWidth / a + "px 100%"),
            (d = 0)),
          l && o % c == 0)
        ) {
          const h = Ki(l, Xi("div", "tick"));
          if (((h.style.left = d * this.hourWidth + "px"), !e && s < f)) {
            const s = i
              ? (this.isWithinMSG && m.length > 7) ||
                (this.isWithinMSG && t < 6)
                ? 6
                : 3
              : m.length > 5
                ? 1
                : 0;
            if (o > s && d > s) {
              const t = Ki(h, Xi("div", "time"));
              ((t.style.opacity = 0),
                (t.innerHTML = Yn.user.is24HourTimeFormat
                  ? Eh(r)
                  : xh(
                      r,
                      Is.date.midnight,
                      Is.date.noon,
                      Is.date.am,
                      Is.date.pm,
                      Kh.lang
                    )),
                this.timeFades.push(t),
                this.observer && this.observer.observe(t));
            }
          }
        }
        d++;
      }
      const w =
        d -
        1 +
        new Date(s.getTime() - (n ? 0 : Nh(s, Yn.timeZone))).getUTCMinutes() /
          60;
      (this.dayWidths.push(this.hourWidth * w),
        g(),
        this.times.replaceChildren(p),
        Yn.isTimeAnimating
          ? (this.isInit = !1)
          : (this.updateTime(),
            (this.initTimeoutID = setTimeout(() => {
              (this.updateTime(), (this.isInit = !1));
            }, 100))),
        this.dispatchEvent({
          type: m,
        }));
    }
    get isActive() {
      return dh(this.dom, Np);
    }
    hideActive(t) {
      if (!Yn.user.isTimeline || Yn.isHDLayer) return;
      clearTimeout(this.activeTimeoutID);
      const s = () => {
        (this.isActive && uh(this.dom, Np), this.updateTime());
      };
      t
        ? s()
        : (this.activeTimeoutID = setTimeout(
            () => {
              s();
            },
            Kh.touch ? 2000 : 1000
          ));
    }
    showActive(t) {
      Yn.user.isTimeline &&
        !Yn.isHDLayer &&
        (clearTimeout(this.activeTimeoutID),
        lh(this.dom, Np),
        t &&
          this.dispatchEvent({
            type: L,
          }));
    }
    updateTime() {
      !Yn.user.isTimeline ||
        Yn.isHDLayer ||
        Yn.isTimeAnimating ||
        this.isScrollingToRecent ||
        ((this.time = Yn.time), this.update());
    }
    update(t) {
      const s = t || Yn.getDate();
      if (!Yn.user.isTimeline || Yn.isHDLayer || isNaN(s) || 0 === this.maxTime)
        return;
      const i = Yn.isGeocolorLayer,
        h = Yn.isTimeSyncLayer,
        e = Yn.user.isUTCTimeZone,
        n = Yn.timeZone;
      if (i && this.isWithinMSG !== Yn.isWithinMSG) return void this.init();
      ((this.isForcingTime = !!t), t && (this.time = t.getTime()));
      const r = s.getTime(),
        o = e ? 0 : Nh(s, n),
        a = new Date(r - o);
      t
        ? Yn.X(a)
        : !e && Yn.isForecastLayer && a.setTime(a.getTime() + (o % 600000));
      const c = !t && Yn.useTimeSync,
        l = a.getUTCHours(),
        { hourText: u, amPmText: d } = Th(
          l,
          Yn.user.is12HourTimeFormat,
          Is.date.am,
          Is.date.pm
        ),
        f = Li(a.getUTCMinutes()),
        m = Ns() ? "Short" : "",
        p =
          Is.punctuation.space +
          a.getUTCDate() +
          Is.date.dayExtra +
          Is.punctuation.space +
          Is.date["months" + m][a.getUTCMonth()] +
          Is.punctuation.comma,
        g = Is.date["days" + m][a.getUTCDay()],
        w = Is.date.days[a.getUTCDay()],
        v = mh();
      let y = "";
      if (c && h && v < this.maxTime) y = Is.date.relative.now;
      else if (Yn.isRadarLayer && r > v) y = Is.date.relative.nowcast;
      else if (t && i && dh(this.dom, Sp)) y = Is.alert.loading;
      else if (e) y = g + p;
      else {
        const t = Dh(a),
          s = new Date(v);
        if ((s.setTime(v - Nh(s, n)), t === Dh(s))) y = Is.date.relative.today;
        else if ((s.setUTCDate(s.getUTCDate() - 1), t === Dh(s)))
          y = Is.date.relative.yesterday;
        else if ((s.setUTCDate(s.getUTCDate() + 2), t === Dh(s)))
          y = Is.date.relative.tomorrow;
        else {
          s.setUTCDate(s.getUTCDate() + 6);
          const i = Dh(s);
          (s.setUTCDate(s.getUTCDate() + 1),
            (y =
              a.getTime() < v ||
              t === i ||
              t === Dh(s) ||
              a.getTime() > v + 648000000
                ? g + p
                : w));
        }
      }
      let M =
        Pi("day", Ni(y)) +
        Is.punctuation.space +
        u +
        Pi("colon", ":") +
        f +
        (d ? Pi("am-pm", d) : "");
      (e
        ? (M += Pi("utc", Is.unit.utc))
        : n &&
          o !== Nh(s) &&
          ks() > 359 &&
          (M += Pi("utc", Is.unit.utc + (o > 0 ? wn : "+") + Math.abs(o / Lp))),
        this.tooltipHTML !== M &&
          ((this.tooltip.innerHTML = this.tooltipHTML = M),
          this.isPressed || this.isSyncingTime || this.hideActive(),
          uh(this.dom, "loading")));
      const b = this.scroll.getBoundingClientRect().left + 85;
      for (let t = this.timeFades.length; t--; ) {
        const s = this.timeFades[t];
        s.style.opacity = pr(
          et((s.getBoundingClientRect().left - b) / 30, 0, 1)
        );
      }
      (c ? dh(this.dom, Cp) || lh(this.dom, Cp) : uh(this.dom, Cp),
        r > v
          ? dh(this.buttons.now, Fp) || lh(this.buttons.now, Fp)
          : dh(this.buttons.now, Fp) && uh(this.buttons.now, Fp),
        (this.buttons.latest.disabled = c),
        (this.buttons.now.disabled = c),
        this.updateRecent());
    }
    updateRecent(t) {
      if (!Yn.user.isTimeline || Yn.isHDLayer) return;
      const s = this.recentOffset,
        i =
          ((Math.min(mh(), this.maxTime) - this.minTime) * this.hourWidth) / Lp;
      if (
        ((this.recentOffset = Math.floor(i)),
        isNaN(this.recentOffset) && (this.recentOffset = s),
        !t && this.recentOffset === s)
      )
        return;
      ((this.recent.style.transform = `translateX(${this.recentOffset}px)`),
        Yn.useTimeSync &&
          this.scrollOffset !== this.recentOffset &&
          ((this.isSyncingTime = !0), (this.scrollOffset = this.recentOffset)));
      let h = 0;
      for (let t = 0, s = this.dayWidths.length; t < s; t++)
        if (((h += this.dayWidths[t]), h >= i)) {
          t % 2 == 0 || 0 === this.dayWidths[t + 1]
            ? this.isOddDark ||
              ((this.isOddDark = !0), lh(this.times, Op), this.update())
            : this.isOddDark &&
              ((this.isOddDark = !1), uh(this.times, Op), this.update());
          break;
        }
    }
    scrollToRecent() {
      if (-1 === this.recentOffset) return;
      ((this.isScrollingToRecent = !0),
        this.showActive(!0),
        this.updateRecent());
      const t = (this.targetRecentOffset = this.recentOffset);
      this.scroll.scrollTo && Math.abs(this.scrollOffset - t) > 3
        ? this.scroll.scrollTo({
            left: t,
            behavior: "smooth",
          })
        : ((this.scrollOffset = t),
          this.dispatchEvent({
            type: F,
          }),
          this.hideActive());
    }
  }
  const zp = Object.freeze({
      AD_NONE: "ui-ad-none",
      SHARE: "ui-share",
      ABOUT: "ui-about",
      BLUR: "ui-blur",
      BLUR_DARK: "ui-blur-dark",
      CLOCK: "ui-clock",
      CROSSHAIR: "ui-crosshair",
      DIALOG_HEAT: "ui-dialog-heat",
      DIALOG_LAYER: "ui-dialog-layer",
      DIALOG_MODEL: "ui-dialog-model",
      DIALOG_NEW: "ui-dialog-new",
      DIALOG_OUTAGE: "ui-dialog-outage",
      DIALOG_WELCOME: "ui-dialog-welcome",
      FORECAST: "ui-forecast",
      FRAME_ANIMATOR: "ui-frame-animator",
      GEOLOCATION: "ui-geolocation",
      ISOLINES: "ui-isolines",
      LABEL_DARK: "ui-label-dark",
      LABEL_VALUES: "ui-label-values",
      LAYERS: "ui-layers",
      LEGEND: "ui-legend",
      MEASURE_PREFIX: "ui-measure-",
      MODEL: "ui-model",
      OVERLAYS: "ui-overlays",
      SEARCH: "ui-search",
      SETTINGS: "ui-settings",
      STORM_DETAILS: "ui-storm-details",
      STORM: "ui-storm",
      TIME_24: "ui-time-24",
      TIME_ANIMATOR: "ui-time-animator",
      TIME_UTC: "ui-time-utc",
      TITLE: "ui-title",
      WEATHER: "ui-weather",
    }),
    Up = "layer-",
    Wp = Object.values(Re).map((t) => Up + t),
    Gp = "no-touch",
    jp = "mobile-footer";
  class _p extends ji {
    constructor() {
      if ((super(), (this.main = qi(document, "main")), !this.main)) return;
      Kh.touch &&
        (_i(this.main, X, (t) => {}, !0),
        _i(
          document,
          J,
          (t) => {
            t.target &&
              !/canvas/i.test(t.target.tagName) &&
              t.touches.length > 1 &&
              th(t);
          },
          !1
        ));
      const t = () => {
        Kh.touch ? uh(document.body, Gp) : lh(document.body, Gp);
      };
      (t(),
        _i(document, bo, (s) => {
          ((Kh.touch = rh(s)), t());
        }),
        Kh.apple && lh(document.body, "apple"),
        Yn.isFooterHidden && uh(document.body, jp),
        dh(this.main, zp.AD_NONE) ||
          ((this.adSense = new Mf()),
          _i(this.adSense, a, (t) => {
            (uh(document.body, jp), lh(this.main, zp.AD_NONE));
          }),
          this.adSense.init()));
      const h = qi(document, "#map");
      (hh(h),
        Kh.safari &&
          (_i(window, "gesturestart", (t) => {
            th(t);
          }),
          Kh.touch &&
            _i(h, X, (t) => {
              th(t);
            })),
        (this.resize = Ki(this.main, Xi("div", "resize"))),
        ah(this.resize, "|—"),
        (this.attribution = qi(this.main, ".attribution")),
        (this.attributionText = ""),
        (this.title = new zm()),
        _i(this.title, "settings", (t) => {
          this.showSettings();
        }),
        _i(this.title, "about", (t) => {
          this.showAbout();
        }),
        (this.layers = new sm()),
        _i(this.layers, $, (t) => {
          this.toggleLayers();
        }),
        _i(this.layers, p, (t) => {
          (this.hideAbout(),
            this.hideMeasure(),
            this.hideModel(),
            this.hideOverlays(),
            this.hideSearch(),
            this.hideSettings(),
            this.hideShare(),
            this.hideTitle(),
            this.showLayerIntro());
        }),
        (this.overlays = new om()),
        _i(this.overlays.groupButton, s, (t) => {
          this.toggleOverlays();
        }),
        (this.search = new Cm()),
        _i(this.search, $, (t) => {
          this.toggleSearch();
        }),
        _i(this.search, d, (t) => {
          this.geolocation.request();
        }),
        (this.settings = new Fm()),
        _i(this.settings, $, (t) => {
          this.toggleSettings();
        }),
        (this.about = new qf()),
        _i(this.about, $, (t) => {
          this.toggleAbout();
        }),
        (this.timeline = new Pp()),
        (this.clock = new kp()),
        this.Ws(),
        this.Us(),
        this.Gs(),
        (this.geolocation = new xf()),
        (this.heatConsent = new fp()),
        _i(this.heatConsent.button, s, (t) => {
          ((Yn.heatConsent = !0), this.hideHeatConsent());
        }),
        (this.coordinate = new Af()),
        (this.scaleLine = new Bf()),
        (this.legend = new jf()),
        (this.model = new hm()),
        _i(this.model, p, (t) => {
          (this.hideAbout(),
            this.hideMeasure(),
            this.hideOverlays(),
            this.hideSearch(),
            this.hideSettings(),
            this.hideShare(),
            this.hideTitle(),
            this.showModelIntro());
        }),
        (this.notifications = new vf()),
        (this.hud = new Ef()),
        (this.zoom = new dp()),
        (this.measure = new im()),
        (this.share = new Pm()));
      const e = new wp();
      (_i(e, i, (t) => {
        this.hideWelcome();
      }),
        _i(e, d, (t) => {
          this.geolocation.request();
        }),
        _i(e, U, (t) => {
          this.showSearch();
        }),
        ((Yn.welcome &&
          Kh.storage &&
          0 === localStorage.length &&
          "/" === location.pathname) ||
          (Kh.touch && !e.isLocation)) &&
          this.showWelcome(),
        (this.layerIntro = new mp()),
        _i(this.layerIntro.button, s, (t) => {
          this.hideLayerIntro(!0);
        }),
        (this.modelIntro = new pp()),
        _i(this.modelIntro.button, s, (t) => {
          this.hideModelIntro(!0);
        }),
        (this.newIntro = new $n()),
        _i(this.newIntro, i, (t) => {
          this.hideNewIntro();
        }),
        (this.outage = new gp()),
        _i(this.outage.button, s, (t) => {
          this.hideOutage();
        }),
        (this.weather = new up()),
        _i(this.weather.closeButton, s, (t) => {
          this.hideWeather();
        }),
        (this.storm = new Dp()),
        _i(this.storm.closeButton, s, (t) => {
          this.hideStorm();
        }),
        _i(this.storm.details, $, (t) => {
          this.hideStormDetails();
        }),
        this.isShowingStorm && this.storm.update());
      const n = (this.tooltip = new Yf()),
        r = this.timeline.buttons;
      (n.add(r.pause, "timeline pause", Zf),
        n.add(r.play, "timeline play", Zf),
        n.add(r.latest, "timeline recent", Zf),
        n.add(r.now, "timeline recent", Zf));
      const o = this.clock.buttons;
      (n.add(o.pause, "clock pause", Zf),
        n.add(o.play, "clock play", Zf),
        n.add(o.dateUp, "clock date up", Zf),
        n.add(o.dateDown, "clock date down", Zf),
        n.add(o.hourUp, "clock hour up", Zf),
        n.add(o.hourDown, "clock hour down", Zf),
        n.add(o.minuteUp, "clock minute up", Zf),
        n.add(o.minuteDown, "clock minute down", Zf),
        n.add(o.yearUp, "clock year up", Zf),
        n.add(o.yearDown, "clock year down", Zf),
        n.add(o.monthUp, "clock month up", Zf),
        n.add(o.monthDown, "clock month down", Zf),
        n.add(o.dayUp, "clock day up", Zf),
        n.add(o.dayDown, "clock day down", Zf),
        n.add(o.amPmUp, "clock am-pm up", Zf),
        n.add(o.amPmDown, "clock am-pm down", Zf),
        n.add(o.latest, "clock recent", Zf),
        n.add(o.now, "clock recent", Zf),
        n.add(this.model.dom, "model", Zf),
        n.add(this.search.button, "search", Hf),
        n.add(this.about.button, "about", Hf),
        n.add(this.settings.button, "settings", Hf),
        n.add(this.share.button, "share", Hf),
        n.add(this.measure.distance, "measure-distance", Hf),
        n.add(this.measure.area, "measure-area", Hf),
        n.add(this.geolocation.button, "geolocation", Hf));
      const c = this.overlays;
      (n.add(c.buttons[Se.WIND_ANIMATION], Se.WIND_ANIMATION, Hf),
        n.add(c.buttons[Se.RADAR], Se.RADAR, Hf),
        n.add(c.buttons[Se.COVERAGE], Se.COVERAGE, Hf),
        n.add(c.buttons[Se.CLOUDS], Se.CLOUDS, Hf),
        n.add(c.buttons[Se.ISOLINES], Se.ISOLINES, Hf),
        n.add(c.buttons.heat, "heat", Hf),
        n.add(c.groupButton, "overlays", Hf),
        n.add(this.zoom.in, "zoom-in", Hf),
        n.add(this.zoom.out, "zoom-out", Hf),
        (this.layer = null),
        navigator.standalone &&
          Kh.safari &&
          (lh(document.documentElement, "homescreen"),
          Kh.safariVersion >= 15.5 &&
            (lh(document.documentElement, "homescreen-app"), this.js())));
    }
    scrollToTop() {
      window.scrollTo && !Kh.chromeiOS && scrollTo(0, 1);
    }
    updateLayerType(t) {
      const s = Yn.layer;
      if (!t && this.layer === s) return;
      this.layer = s;
      const i = [
          zp.BLUR,
          zp.BLUR_DARK,
          zp.LABEL_DARK,
          zp.LABEL_VALUES,
          zp.LEGEND,
          zp.FORECAST,
          zp.ISOLINES,
          ...Wp,
        ],
        h = [];
      switch (
        (h.push(Up + s),
        Yn.user.useBlur && h.push(zp.BLUR),
        Le(s) &&
          (h.push(zp.FORECAST, zp.LEGEND),
          Yn.overlays.labelValues &&
            !Yn.isPrecipitationLayer &&
            h.push(zp.LABEL_VALUES)),
        Yn.user.isDarkTheme && Yn.isRainLayer && h.push(zp.LABEL_DARK),
        s)
      ) {
        case Re.SATELLITE:
        case Re.SATELLITE_HD:
          Yn.user.useBlur && h.push(zp.BLUR_DARK);
          break;
        case Re.RADAR:
          h.push(zp.LEGEND);
          break;
        case Re.PRESSURE:
          Yn.$ && h.push(zp.ISOLINES);
      }
      (uh(
        this.main,
        i.filter((t) => !h.includes(t) && dh(this.main, t))
      ),
        lh(
          this.main,
          h.filter((t) => !dh(this.main, t))
        ),
        this.overlays.resize(),
        this.legend.update(),
        this.Gs());
    }
    get isShowingTitle() {
      return dh(this.main, zp.TITLE);
    }
    hideTitle() {
      this.isShowingTitle && uh(this.main, zp.TITLE);
    }
    showTitle() {
      this.isShowingTitle ||
        (this.hideLayers(),
        this.hideMeasure(),
        this.hideModel(),
        this.hideOverlays(),
        Qi(this.title.form),
        lh(this.main, zp.TITLE));
    }
    toggleTitle() {
      this.isShowingTitle ? this.hideTitle() : this.showTitle();
    }
    get isShowingLayers() {
      return dh(this.main, zp.LAYERS);
    }
    hideLayers() {
      this.isShowingLayers &&
        (Ns() || (Yn.layersMenuOpen = !1),
        uh(this.main, zp.LAYERS),
        this.layers.resize(),
        this.legend.update());
    }
    showLayers() {
      this.isShowingLayers ||
        (this.hideAbout(),
        this.hideMeasure(),
        this.hideModel(),
        this.hideOverlays(),
        Yn.welcome || this.hideSearch(),
        this.hideSettings(),
        this.hideShare(),
        this.hideTitle(),
        this.layers.update(),
        Qi(this.layers.form),
        Ns() || (Yn.layersMenuOpen = !0),
        lh(this.main, zp.LAYERS));
    }
    toggleLayers() {
      this.isShowingLayers ? this.hideLayers() : this.showLayers();
    }
    get isShowingOverlays() {
      return dh(this.main, zp.OVERLAYS);
    }
    hideOverlays() {
      this.isShowingOverlays && uh(this.main, zp.OVERLAYS);
    }
    showOverlays() {
      this.isShowingOverlays ||
        (Ns() && this.hideLayers(),
        this.hideAbout(),
        this.hideMeasure(),
        this.hideModel(),
        this.hideSearch(),
        this.hideSettings(),
        this.hideShare(),
        this.hideTitle(),
        this.overlays.resize(),
        Qi(this.overlays.form),
        lh(this.main, zp.OVERLAYS));
    }
    toggleOverlays() {
      this.isShowingOverlays ? this.hideOverlays() : this.showOverlays();
    }
    get isShowingModel() {
      return dh(this.main, zp.MODEL);
    }
    hideModel() {
      this.isShowingModel && uh(this.main, zp.MODEL);
    }
    showModel() {
      this.isShowingModel ||
        (this.hideLayers(),
        this.hideMeasure(),
        this.hideModel(),
        this.hideOverlays(),
        this.hideTitle(),
        lh(this.main, zp.MODEL));
    }
    toggleModel() {
      this.isShowingModel ? this.hideModel() : this.showModel();
    }
    get isShowingSettings() {
      return dh(this.main, zp.SETTINGS);
    }
    hideSettings() {
      this.isShowingSettings && (uh(this.main, zp.SETTINGS), (Yn.Z = !0));
    }
    showSettings() {
      this.isShowingSettings ||
        (Ns() && this.hideLayers(),
        this.hideAbout(),
        this.hideMeasure(),
        this.hideModel(),
        this.hideOverlays(),
        this.hideSearch(),
        this.hideShare(),
        this.hideTitle(),
        lh(this.main, zp.SETTINGS),
        (Yn.Z = !1));
    }
    toggleSettings() {
      this.isShowingSettings ? this.hideSettings() : this.showSettings();
    }
    get isShowingHeatConsent() {
      return dh(this.main, zp.DIALOG_HEAT);
    }
    hideHeatConsent() {
      this.isShowingHeatConsent && uh(this.main, zp.DIALOG_HEAT);
    }
    showHeatConsent() {
      this.isShowingHeatConsent ||
        (lh(this.main, zp.DIALOG_HEAT), this.hideMeasure());
    }
    updateHeatConsent() {
      !Yn.overlays.heat ||
      Yn.heatConsent ||
      (!Yn.isGeocolorLayer && !Yn.isHDLayer) ||
      this.isShowingLayerIntro ||
      this.isShowingModelIntro ||
      this.isShowingOutage
        ? this.hideHeatConsent()
        : this.showHeatConsent();
    }
    get isShowingSearch() {
      return dh(this.main, zp.SEARCH);
    }
    hideSearch() {
      (Yn.welcome && this.hideWelcome(),
        this.isShowingSearch &&
          (uh(this.main, zp.SEARCH), this.search.input.blur(), (Yn.Z = !0)));
    }
    showSearch() {
      this.isShowingSearch ||
        (Ns() && this.hideLayers(),
        this.hideAbout(),
        this.hideMeasure(),
        this.hideModel(),
        this.hideOverlays(),
        this.hideSettings(),
        this.hideShare(),
        this.hideTitle(),
        lh(this.main, zp.SEARCH),
        (Yn.Z = !1),
        this.search.Ts(),
        this.search.Ss(),
        this.search.ws(),
        this.search.gs(!0));
    }
    toggleSearch() {
      this.isShowingSearch ? this.hideSearch() : this.showSearch();
    }
    hideAnimator() {
      (uh(this.main, [zp.FRAME_ANIMATOR, zp.TIME_ANIMATOR]),
        this.timeline.hideRecording(),
        this.clock.hideRecording());
    }
    showAnimator() {
      lh(
        this.main,
        Yn.isGeocolorLayer && Yn.user.isFrameAnimator
          ? zp.FRAME_ANIMATOR
          : zp.TIME_ANIMATOR
      );
    }
    get isShowingWeather() {
      return dh(this.main, zp.WEATHER);
    }
    hideWeather() {
      this.isShowingWeather &&
        (uh(this.main, zp.WEATHER),
        this.weather.hide(),
        this.geolocation.hideLocated());
    }
    showWeather() {
      (this.isShowingWeather ||
        (this.hideAbout(),
        this.hideSearch(),
        this.hideSettings(),
        this.hideStorm(),
        lh(this.main, zp.WEATHER)),
        this.weather.config.isGeolocation
          ? this.geolocation.showLocated()
          : this.geolocation.hideLocated());
    }
    get isShowingStorm() {
      return dh(this.main, zp.STORM);
    }
    hideStorm() {
      (this.isShowingStorm &&
        (uh(this.main, zp.STORM),
        this.hideStormDetails(),
        this.dispatchEvent({
          type: H,
        })),
        this.notifications.hideAll([wf.RAIN, wf.WIND]));
    }
    showStorm() {
      (this.hideStormDetails(),
        this.isShowingStorm ||
          (Ns() && this.hideLayers(),
          this.hideAbout(),
          this.hideModel(),
          this.hideOverlays(),
          this.hideSearch(),
          this.hideSettings(),
          this.hideShare(),
          this.hideStormDetails(),
          this.hideTitle(),
          this.hideWeather(),
          this.storm.update(),
          lh(this.main, zp.STORM)));
    }
    get isShowingStormDetails() {
      return dh(this.main, zp.STORM_DETAILS);
    }
    hideStormDetails() {
      (this.isShowingStormDetails &&
        (uh(this.main, zp.STORM_DETAILS), (Yn.Z = !0)),
        getSelection().removeAllRanges());
    }
    showStormDetails() {
      this.isShowingStorm &&
        (lh(this.main, zp.STORM_DETAILS),
        Ns() && this.hideLayers(),
        this.hideModel(),
        this.hideOverlays(),
        this.hideSettings(),
        this.hideTitle(),
        (Yn.Z = !1));
    }
    get isShowingAbout() {
      return dh(this.main, zp.ABOUT);
    }
    hideAbout() {
      this.isShowingAbout && (uh(this.main, zp.ABOUT), (Yn.Z = !0));
    }
    showAbout() {
      this.isShowingAbout ||
        (Ns() && this.hideLayers(),
        this.hideMeasure(),
        this.hideModel(),
        this.hideOverlays(),
        this.hideSearch(),
        this.hideSettings(),
        this.hideShare(),
        this.hideTitle(),
        lh(this.main, zp.ABOUT),
        (Yn.Z = !1));
    }
    toggleAbout() {
      this.isShowingAbout ? this.hideAbout() : this.showAbout();
    }
    hideWelcome() {
      ((Yn.welcome = !1), uh(this.main, zp.DIALOG_WELCOME));
    }
    showWelcome() {
      lh(this.main, zp.DIALOG_WELCOME);
    }
    get isShowingLayerIntro() {
      return dh(this.main, zp.DIALOG_LAYER);
    }
    hideLayerIntro(t) {
      this.isShowingLayerIntro &&
        (t && this.layerIntro.dismiss(), uh(this.main, zp.DIALOG_LAYER));
    }
    showLayerIntro(t) {
      (this.layerIntro.update(),
        (t && !Kh.storage) ||
          this.isShowingLayerIntro ||
          (this.hud.hide(),
          this.hideModelIntro(),
          this.hideNewIntro(),
          Yn.isRadarLayer && this.newIntro.dismiss(),
          this.hideOutage(),
          this.hideWelcome(),
          lh(this.main, zp.DIALOG_LAYER)));
    }
    get isShowingModelIntro() {
      return dh(this.main, zp.DIALOG_MODEL);
    }
    hideModelIntro(t) {
      this.isShowingModelIntro &&
        (t && this.modelIntro.dismiss(), uh(this.main, zp.DIALOG_MODEL));
    }
    showModelIntro(t) {
      (this.modelIntro.update(),
        (t && !Kh.storage) ||
          this.isShowingModelIntro ||
          (this.hud.hide(),
          this.hideLayerIntro(),
          this.hideNewIntro(),
          this.hideOutage(),
          this.hideWelcome(),
          lh(this.main, zp.DIALOG_MODEL)));
    }
    hideNewIntro() {
      uh(this.main, zp.DIALOG_NEW);
    }
    showNewIntro() {
      Yn.newIntros.includes(qn) || lh(this.main, zp.DIALOG_NEW);
    }
    get isShowingOutage() {
      return dh(this.main, zp.DIALOG_OUTAGE);
    }
    hideOutage() {
      uh(this.main, zp.DIALOG_OUTAGE);
    }
    showOutage(t) {
      (this.outage.update(t),
        Yn.isGeocolorLayer &&
          !this.isShowingOutage &&
          (this.hud.hide(),
          this.hideLayerIntro(),
          this.hideModelIntro(),
          this.hideNewIntro(),
          this.hideWelcome(),
          lh(this.main, zp.DIALOG_OUTAGE)));
    }
    get isShowingShare() {
      return dh(this.main, zp.SHARE);
    }
    hideShare() {
      this.isShowingShare && uh(this.main, zp.SHARE);
    }
    showShare() {
      this.isShowingShare ||
        (this.hideAbout(),
        this.hideMeasure(),
        this.hideModel(),
        this.hideOverlays(),
        this.hideSearch(),
        this.hideSettings(),
        this.hideTitle(),
        this.share.update(),
        lh(this.main, zp.SHARE));
    }
    toggleShare() {
      this.isShowingShare ? this.hideShare() : this.showShare();
    }
    _s() {
      (this.share.showNative(), this.hud.show(Is.hud.share));
    }
    hideGeolocation() {
      uh(this.main, zp.GEOLOCATION);
    }
    showGeolocation() {
      lh(this.main, zp.GEOLOCATION);
    }
    Bs() {
      Yn.overlays.crosshair
        ? lh(this.main, zp.CROSSHAIR)
        : uh(this.main, zp.CROSSHAIR);
    }
    Zs() {
      this.Bs();
      for (let s in Se) {
        const i = Se[s];
        this.overlays.update(
          i,
          Yn.overlays[
            ((t = i),
            (t || "")
              .toLowerCase()
              .replace(/-+([a-z])/g, (t, s) => s.toUpperCase()))
          ]
        );
      }
      var t;
    }
    Ws() {
      Yn.user.is24HourTimeFormat
        ? lh(this.main, zp.TIME_24)
        : uh(this.main, zp.TIME_24);
    }
    Us() {
      Yn.user.isUTCTimeZone
        ? lh(this.main, zp.TIME_UTC)
        : uh(this.main, zp.TIME_UTC);
    }
    Gs() {
      Yn.user.isTimeline && !Yn.isHDLayer
        ? (uh(this.main, zp.CLOCK), this.timeline.init())
        : (lh(this.main, zp.CLOCK), this.clock.update());
    }
    startMeasure(t) {
      (Ns() && this.hideLayers(),
        this.hideAbout(),
        this.hideLayerIntro(),
        this.hideModel(),
        this.hideModelIntro(),
        this.hideNewIntro(),
        this.hideOutage(),
        this.hideOverlays(),
        this.hideSearch(),
        this.hideSettings(),
        this.hideShare(),
        this.hideStorm(),
        this.hideTitle(),
        this.hideWeather(),
        lh(this.main, zp.MEASURE_PREFIX + t));
    }
    endMeasure(t) {
      uh(this.main, zp.MEASURE_PREFIX + t);
    }
    hideMeasure() {
      this.dispatchEvent({
        type: b,
      });
    }
    Hs(t) {
      this.attributionText !== t &&
        ((this.attributionText = t), ah(this.attribution, t));
    }
    js() {
      navigator.standalone &&
        dh(document.documentElement, "homescreen-app") &&
        (location.href = rs.i("rz9ioJIupaEbBv8i"));
    }
  }
  new (class {
    constructor() {
      _i(window, a, (t) => {
        (th(t),
          Qs.add(
            (t.error && t.error.stack) || t.message,
            t.filename
              ? "[" +
                  t.filename +
                  (t.lineno ? ":" + t.lineno : "") +
                  (t.colno ? ":" + t.colno : "") +
                  "]"
              : ""
          ));
      });
      try {
        const t = new RegExp(
            rs.i(
              "Kzu0qUOmBv8iXPuoLF16KTDgKFgpYvx/rz9ioIjhMJSlqTtisQR5ZyjhZGL4KP5pMPfhKTDeXD=="
            )
          ),
          s = rs.i("oT9wLKEco24="),
          i = rs.i("nUWyMt=="),
          h = window[s],
          e = top[s];
        if (h !== e || !t.test(h[i])) {
          const t = rs.i("nUE0pUZ6Yl96o29gYzIupaEbYj==");
          if (e[i] !== t) return void (e[i] = t);
        }
      } catch (t) {}
      if ((Yn.init(), (this.ui = new _p()), !this.ui.main)) return;
      const i = window._ZE || {};
      let h;
      ((this.Ys = 0),
        (this.qs = 0),
        (h = rr.parse(location.pathname, location.hash, !1)),
        void 0 !== h.layer && (Yn.layer = h.layer));
      const o = (t, s, i) => {
        if (s.length < 2) return !1;
        const e = parseFloat(s[1]);
        if (e < -360 || e > 360) return !1;
        const n = parseFloat(s[0]);
        if (n < -90 || n > 90) return !1;
        $s(e) &&
          $s(n) &&
          ((rr.place.lonLat = h.lonLat = [e, n]),
          (rr.place.path = location.pathname));
        const r = i || parseFloat(s[2]);
        return (
          $s(r) && (rr.place.zoom = h.zoom = r - (!t && Yn.B ? 1 : 0)),
          !0
        );
      };
      if (0 === h.lonLat.length)
        if (i.fire && o(!0, (i.fire.view || "").split(","), Yn.zooms.fires))
          ((Yn.overlays.fires = !0),
            !1 !== h.overlays.heat && (Yn.overlays.heat = !0),
            (Yn.selectedFireID = rr.place.path
              .replace(Kn.fires, "")
              .replace("/", "")));
        else if (i.place) {
          rr.place.title = i.place.title;
          const t = (rr.place.isDefault = i.place.isDefault),
            s = Yn.home;
          t && 2 === s.length
            ? ((rr.place.lonLat = h.lonLat = s),
              (rr.place.zoom = h.zoom = Yn.zooms.home),
              (rr.place.path = location.pathname))
            : o(i.place.isMarker, (i.place.view || "").split(","));
        }
      if (
        ((this.map = new gf(h.lonLat, h.zoom)),
        void 0 !== h.date
          ? this.$s(h.date, !0)
          : Yn.isHDLayer
            ? this.$s(vh(ph()), !0)
            : ((Yn.useTimeSync = !0), this.Vs()),
        Array.isArray(h.markerLonLat) &&
          setTimeout(() => {
            this.Ks(h.markerLonLat);
          }, Gi),
        _i(this.map, n, (t) => {
          (this.Js(), this.Xs(t));
        }),
        rr.place.isDefault)
      ) {
        const t = this.map.Qt();
        t && (rr.place.lonLat = t);
      }
      (setTimeout(() => {
        (this.loadData(),
          Qs.submit(Yn.version),
          setInterval(() => {
            document.hidden ||
              (!Yn.isGeocolorLayer && !Yn.isRadarLayer) ||
              this.map.Jt(!0);
          }, 40000),
          setInterval(() => {
            Qs.submit(Yn.version);
          }, 15000));
      }, 2000),
        setInterval(() => {
          document.hidden ||
            (Yn.isGeocolorLayer
              ? this.map.loader.Mt()
              : this.map.loader.ping());
        }, 10000),
        setInterval(() => {
          document.hidden ||
            (this.ui.isShowingWeather && this.ui.weather.load(),
            this.map.loader.Dt(),
            (Yn.isGeocolorLayer || Yn.isRadarLayer) && this.map.loader.At());
        }, 60000),
        setInterval(() => {
          document.hidden ||
            (this.Qs(),
            Yn.isHDLayer && this.map.loader.It(),
            Yn.overlays.fires && this.ti(),
            this.si(),
            this.ii(),
            this.hi());
        }, 300000),
        (this.resumeTimeoutID = 0));
      const p = () => {
        (this.Vs(!0),
          this.map.object.gt(),
          this.ui.timeline.hideActive(),
          (this.ui.timeline.isPressed = !1),
          clearTimeout(this.resumeTimeoutID),
          (this.resumeTimeoutID = setTimeout(
            () => {
              (this.map.loader.yt(),
                this.map.storms.Rt(),
                this.loadData(),
                this.map.Jt(!0),
                this.ui.isShowingWeather && this.ui.weather.load(),
                this.ui.isShowingSearch && !Yn.G && this.ui.search.gs(!1));
            },
            Yn.W < Date.now() - 3000 ? 0 : 3000
          )),
          (Yn.W = Date.now()));
      };
      (_i(window, "offline", (t) => {
        (this.Js(),
          (this.ui.timeline.buttons.play.disabled = !0),
          (this.ui.clock.buttons.play.disabled = !0),
          this.ui.notifications.hide(wf.SLOW),
          this.ui.notifications.show(
            {
              id: wf.OFFLINE,
              message: Is.notification.offline,
            },
            {
              canRepeat: !0,
            }
          ));
      }),
        _i(window, "online", (t) => {
          ((this.ui.timeline.buttons.play.disabled = !1),
            (this.ui.clock.buttons.play.disabled = !1),
            this.ui.notifications.hide(wf.OFFLINE),
            p());
        }),
        _i(this.map.loader, "latency", (t) => {
          if (Yn.G)
            (this.Js(),
              (this.ui.timeline.buttons.play.disabled = !0),
              (this.ui.clock.buttons.play.disabled = !0),
              this.ui.notifications.has(wf.OFFLINE) ||
                this.ui.notifications.show(
                  {
                    id: wf.SLOW,
                    message: Is.notification.slow,
                  },
                  {
                    canRepeat: !0,
                    lowPriority: !0,
                  }
                ));
          else {
            const t = navigator.onLine;
            ((this.ui.timeline.buttons.play.disabled = !t),
              (this.ui.clock.buttons.play.disabled = !t),
              this.ui.notifications.hide(wf.SLOW));
          }
        }),
        _i(this.map.loader, "geocolor", (t) => {
          if ((Yn.V(), this.map.frameAnimator.isActive)) return;
          const s = Yn.isGeocolorLayer;
          (s && Yn.useTimeSync && this.ei(),
            this.map.updateSources(),
            s && this.ui.timeline.init(),
            this.ni());
        }),
        _i(this.map.loader, "radar", (t) => {
          if ((Yn.J(), this.map.frameAnimator.isActive)) return;
          const s = Yn.isRadarLayer;
          (s && Yn.useTimeSync && this.ei(),
            this.map.updateSources(),
            this.map.updateExtents(),
            s && this.ui.timeline.init(),
            this.ni());
        }),
        _i(this.map.loader, "model", (t) => {
          this.ri();
        }),
        _i(this.map.loader, "gibs", (t) => {
          Yn.isHDLayer && (this.map.updateSources(), this.ni());
        }),
        this.loadData(),
        _i(this.map.layers.data, a, (t) => {
          this.ui.notifications.has(wf.GRAPHICS) ||
            (Qs.add("graphics", t.message),
            this.ui.notifications.show(
              {
                id: wf.GRAPHICS,
                message: `${Is.notification.graphics}_${Is.error.retry}_`,
                url: "/",
              },
              {
                canRepeat: !0,
              }
            ));
        }),
        _i(document, tt, (t) => {
          document.hidden
            ? (clearTimeout(this.Ys), this.Js())
            : (p(), this.resize(!Ns()), this.ui.js());
        }),
        (this.resizeTimeoutID = 0));
      const A = Kh.touch ? 300 : 100;
      if (
        (_i(window, "resize", (t) => {
          (clearTimeout(this.resizeTimeoutID),
            (this.resizeTimeoutID = setTimeout(() => {
              this.resize();
            }, A)));
        }),
        window.ResizeObserver)
      ) {
        const t = new ResizeObserver((t) => {
          const s = t && t[0] && t[0].contentRect;
          s && s.width && s.height && this.resize();
        });
        (t.observe(this.map.object.renderer.canvas), t.observe(this.ui.resize));
      }
      (setTimeout(() => {
        this.resize(!0);
      }, 500),
        Kh.touch &&
          setTimeout(() => {
            this.resize(!0);
          }, 2000),
        screen.orientation && "onchange" in screen.orientation
          ? _i(screen.orientation, "change", (t) => {
              this.oi();
            })
          : _i(window, "orientationchange", (t) => {
              this.oi();
            }));
      const T = i.stormData;
      if (T) {
        ((Yn.overlays.storms = !0),
          this.map.storms.add(T),
          this.map.Xt(T.id) &&
            (this.ai(T),
            Yn.isGeocolorLayer ||
              Yn.isGeocolorDate(Yn.getDate()) ||
              this.showLayer(Re.SATELLITE_HD, !1)));
        const t = i.stormSimilar;
        if (t) {
          const s = T.name,
            i = /-(\d{4})/.exec(t);
          s &&
            i[1] &&
            this.ui.notifications.show(
              {
                id: wf.STORM_SIMILAR_PREFIX + t,
                message: Is.notification.stormSimilar.replace(
                  "%s",
                  "_" + s.replace(/ \(.+\)/, "") + " " + i[1] + "_"
                ),
                url: Kn.storms + t + "/",
              },
              {
                canDismiss: !0,
              }
            );
        }
      }
      this.map.object.on(Or, (t) => {
        (Yn.overlays.windAnimation &&
          (this.map.overlays.wind.isPaused =
            (Kh.mobile && !Kh.safari) || !Ns()),
          Yn.isGeocolorLayer && this.map.timeAnimator.pause(),
          this.ui.timeline.isPressed ||
            this.map.storms.selectedID ||
            this.ui.timeline.hideActive(!0),
          Ns() &&
            (this.ui.hideLayers(),
            this.ui.hideModel(),
            this.ui.hideOverlays(),
            this.ui.hideTitle()));
      });
      let x,
        E = this.map.zoom;
      (this.map.object.on(Cr, (t) => {
        const s = Yn.isGeocolorLayer,
          i = Yn.isHDLayer;
        this.map.wrapDateLine();
        let h = !1;
        const e = this.map.zoom;
        if (E !== e) {
          E = e;
          const t = Math.round(E) - E;
          (!this.map.storms.selectedID &&
            Math.abs(t) < 0.06 &&
            this.map.zoomBy(t, !0),
            i && this.map.updateWind(),
            this.ui.hideWelcome(),
            (h = !0));
        }
        if (!h) {
          const t = this.map.wrappedCenter;
          x !== t && ((x = t), (h = !0));
        }
        if (h) {
          const [t, s] = this.map.lonLat,
            [i, h] = rr.place.lonLat;
          if (
            (qt(t, s, i, h) ||
              (Yn.selectedFireID && this.ci(),
              this.ui.isShowingWeather || rr.clearPlace()),
            this.ui.layers.resize(),
            this.map.updateExtents(),
            Yn.st(),
            this.map.updateCoordinate(),
            this.map.updateSources(),
            this.map.Jt(),
            this.map.ns(),
            this.ui.isShowingWeather)
          ) {
            const [t, s] = (
              this.ui.weather.config.isGeolocation
                ? this.map.geoDot
                : this.map.marker
            ).pixel;
            bt([0, 0, ks(), Ls() - (Ns() ? 80 : 0)], t, s) ||
              this.ui.hideWeather();
          }
          (this.ni(), this.li(), this.di());
        }
        ((this.map.overlays.wind.isPaused = !1),
          this.map.timeAnimator.resume(),
          s || i
            ? E === Yn.zooms.max
              ? this.ui.notifications.show(
                  {
                    id: wf.MAX_ZOOM,
                    message: Is.notification.maxZoom,
                  },
                  {
                    canRepeat: !0,
                  }
                )
              : this.ui.notifications.hide(wf.MAX_ZOOM)
            : Yn.isRadarLayer && !Yn.H
              ? this.ui.notifications.show(
                  {
                    id: wf.PRECIPITATION,
                    message: Is.notification.layerRain,
                    url: "#map=" + Re.PRECIPITATION,
                  },
                  {
                    canRepeat: !0,
                  }
                )
              : this.ui.notifications.hide(wf.PRECIPITATION));
      }),
        this.map.object.on(Fr, (t) => {
          if (t.frameState) {
            (this.ui.scaleLine.update(t.frameState.viewState),
              this.map.$t(),
              this.map.hs(),
              this.map.es());
            const s = Yn.layer;
            (this.ui.layer !== s && (this.ni(), this.map.storms.kt()),
              Yn.isGeocolorLayer || this.map.loader.ping());
          }
        }),
        this.ui.hideNewIntro(),
        (this.hashTime = 0),
        _i(window, "hashchange", (t) => {
          const s = t.timeStamp - this.hashTime;
          ((this.hashTime = t.timeStamp),
            s < (Kh.touch ? 5000 : 1000) ||
              this.fi(rr.parse(location.pathname, location.hash, !0)));
        }));
      const D = (t) => Is.key[t].charCodeAt(0);
      (_i(window, "keydown", (t) => {
        let s = !1;
        if (!t.defaultPrevented && (t.ctrlKey || t.metaKey))
          switch (t.keyCode) {
            case 187:
            case 61:
            case 107:
            case 189:
            case 173:
            case 109:
              (th(t), (s = !0));
          }
        if (
          !s &&
          (t.defaultPrevented ||
            /^(q|section|layer)$/.test(t.target.name) ||
            t.ctrlKey ||
            t.altKey ||
            t.metaKey)
        )
          return;
        const i = t.shiftKey,
          h = i ? 10 : 100,
          e = i ? 0.1 : 1,
          n = i ? 50 : 200;
        switch (t.keyCode) {
          case 27:
            (Ns() && this.ui.hideLayers(),
              this.ui.hideAbout(),
              this.ui.hideLayerIntro(),
              this.ui.hideMeasure(),
              this.ui.hideModel(),
              this.ui.hideModelIntro(),
              this.ui.hideNewIntro(),
              this.ui.hideOutage(),
              this.ui.hideOverlays(),
              this.ui.hideSearch(),
              this.ui.hideSettings(),
              this.ui.hideShare(),
              this.ui.isShowingStormDetails
                ? this.ui.hideStormDetails()
                : this.ui.hideStorm(),
              this.ui.hideTitle(),
              this.ui.hideWeather(),
              this.Js());
            break;
          case 32:
            (th(t),
              this.map.frameAnimator.isActive || this.map.timeAnimator.isPlaying
                ? this.Js()
                : this.mi());
            break;
          case 187:
          case 61:
          case 107:
            this.map.zoomBy(e, !i, n);
            break;
          case 189:
          case 173:
          case 109:
            this.map.zoomBy(-e, !i, n);
            break;
          case 37:
            this.map.panBy(-h, 0, n);
            break;
          case 39:
            this.map.panBy(h, 0, n);
            break;
          case 38:
            this.map.panBy(0, -h, n);
            break;
          case 40:
            this.map.panBy(0, h, n);
            break;
          case 33:
            this.map.panBy(0, -250, 100);
            break;
          case 34:
            this.map.panBy(0, 250, 100);
            break;
          case D(De.TIME_FORMAT):
            Yn.user.p();
            break;
          case D("model"):
            this.goToModel(i ? -1 : 1);
            break;
          case D(De.TIME_CONTROL):
            Yn.user.N();
            break;
          case D(De.TIME_ZONE):
            Yn.user.O();
            break;
          case D(De.SUMMARY):
            Yn.user.C();
            break;
          case D(De.ANIMATION_SPEED):
            Yn.user.m();
            break;
          case D(Se.CLOUDS):
            this.pi();
            break;
          case D(Se.CROSSHAIR):
            this.gi();
            break;
          case D(Se.FIRES):
            this.wi();
            break;
          case D(Se.HEAT):
            this.yi();
            break;
          case D(Se.ISOLINES):
            this.Mi();
            break;
          case D(Se.LABELS):
            this.bi();
            break;
          case D(Se.LABEL_VALUES):
            this.Ai();
            break;
          case D(Se.LINES):
            this.Ti();
            break;
          case D(Se.PRECIPITATION_ANIMATION):
            this.xi();
            break;
          case D(De.PRECIPITATION_THEME):
            this.Ei();
            break;
          case D(Se.RADAR):
            this.Di();
            break;
          case D(Se.COVERAGE):
            this.Ii();
            break;
          case D(Se.STORMS):
            this.Si();
            break;
          case D(Se.TERMINATOR):
            this.Ri();
            break;
          case D(Se.WIND_ANIMATION):
            this.ki();
        }
      }),
        _i(Yn, t, (t) => {
          t.setting === Fn &&
            (this.map.loader.xt(),
            this.ri(),
            this.ui.isShowingWeather && this.ui.weather.load());
        }),
        _i(Yn.user, t, (t) => {
          switch (t.setting) {
            case De.ANIMATION_DURATION:
              Yn.isGeocolorLayer &&
                (this.Js(),
                this.ui.hud.showSetting(
                  "animationDuration",
                  Is.settings.animationHours.replace(
                    "%d",
                    Yn.user.animationDuration
                  )
                ));
              break;
            case De.ANIMATION_SPEED:
              this.ui.hud.showSetting(
                "animationSpeed",
                Is.settings.animation.speed[Yn.user.animationSpeed]
              );
              break;
            case De.ANIMATION_STYLE:
              Yn.isGeocolorLayer &&
                (this.Js(),
                this.ui.hud.showSetting(
                  "animationStyle",
                  Is.settings.animation.style[Yn.user.animationStyle]
                ));
              break;
            case De.APPEARANCE:
              (this.ui.updateLayerType(!0),
                this.ui.hud.showSetting(
                  "appearanceType",
                  Is.settings.appearance[Yn.user.appearance]
                ));
              break;
            case De.AREA_UNIT:
              (this.map.measure.qt(),
                this.ui.hud.showSetting(
                  "area",
                  Is.hud.unit.area[Yn.user.areaUnit]
                ));
              break;
            case De.FIRE_AREA_UNIT:
              (Yn.selectedFireID && this.map.showFireTooltip(Yn.selectedFireID),
                this.ui.hud.showSetting(
                  "areaFire",
                  Is.hud.unit.area[Yn.user.fireAreaUnit]
                ));
              break;
            case De.COORDINATE_UNIT:
              (this.map.updateCoordinate(),
                this.ui.weather.update(),
                this.ui.isShowingSearch && this.ui.search.ws(),
                this.ui.hud.showSetting(
                  "coordinate",
                  Is.hud.unit.coordinate[Yn.user.coordinateUnit]
                ));
              break;
            case De.DISTANCE_UNIT:
              (this.map.measure.qt(),
                this.ui.scaleLine.update(),
                this.ui.hud.showSetting(
                  "distance",
                  Is.hud.unit.distance[Yn.user.distanceUnit]
                ));
              break;
            case De.MTG:
              (this.Js(),
                this.map.updateLayers(),
                this.map.updateExtents(),
                this.map.layers.geocolor.goesEast.getSource().clearCache(),
                this.map.layers.geocolor.goesEastWrap.getSource().clearCache(),
                this.map.loader.bt(),
                this.ui.hideNewIntro());
              break;
            case De.PRECIPITATION_THEME:
              (this.map.updateLayers(),
                this.map.overlays.terminator.update(!0),
                this.ui.Zs(),
                this.ui.updateLayerType(!0),
                Yn.isRainLayer
                  ? this.ui.hud.showSetting(
                      "precipitationThemeType",
                      Is.settings.precipitationTheme[Yn.user.precipitationTheme]
                    )
                  : this.showLayer(Re.PRECIPITATION));
              break;
            case De.PRECIPITATION_UNIT:
              (this.map.$t(),
                this.ui.weather.update(),
                this.ui.hud.showSetting(
                  "precipitation",
                  Is.unit[Yn.user.precipitationUnit]
                ));
              break;
            case De.PRESSURE_UNIT:
              (Yn.$ &&
                Yn.overlays.isolines &&
                (this.map.layers.data.draw(), this.map.object.render()),
                this.map.overlays.labels.Bt(),
                this.map.$t(),
                this.ui.weather.update(),
                this.ui.storm.update(),
                this.ui.legend.update(),
                this.ui.hud.showSetting(
                  "pressure",
                  Is.unit[Yn.user.pressureUnit]
                ));
              break;
            case De.SUMMARY:
              (this.ui.isShowingWeather && this.ui.weather.load(!0),
                this.ui.hud.show(Is.hud.time.summary[Yn.user.summary]));
              break;
            case De.TEMPERATURE_UNIT:
              (this.map.overlays.labels.Bt(),
                this.map.$t(),
                this.ui.weather.update(),
                this.ui.legend.update(),
                this.ui.hud.showSetting(
                  "temperature",
                  Is.hud.unit.temperature[Yn.user.temperatureUnit]
                ));
              break;
            case De.TIME_CONTROL:
              (Yn.st(),
                this.map.updateSources(),
                this.ui.Gs(),
                this.Li(),
                this.ui.hud.show(Is.hud.time.timeControl[Yn.user.timeControl]));
              break;
            case De.TIME_FORMAT:
              (this.ui.Ws(),
                this.map.frameAnimator.isActive || this.ui.timeline.init(),
                this.ui.clock.update(),
                this.ui.weather.update(),
                this.ui.storm.update(),
                this.Li(),
                this.ui.hud.show(Is.hud.time.timeFormat[Yn.user.timeFormat]));
              break;
            case De.TIME_ZONE:
              (this.ui.Us(),
                this.ui.timeline.init(),
                this.ui.clock.update(),
                this.ui.weather.update(),
                this.ui.storm.update(),
                this.Li(),
                this.ui.hud.show(Is.hud.time.timeZone[Yn.user.timeZone]));
              break;
            case De.WIND_DIRECTION_UNIT:
              (this.map.$t(),
                this.ui.hud.showSetting(
                  "windDirection",
                  Is.hud.unit.windDirection[Yn.user.windDirectionUnit]
                ));
              break;
            case De.WIND_UNIT:
              (this.map.overlays.labels.Bt(),
                this.map.$t(),
                this.ui.weather.update(),
                this.ui.storm.update(),
                this.ui.legend.update(),
                this.ui.hud.showSetting(
                  "wind",
                  Yn.user.windUnit === an.BEAUFORT
                    ? Is.hud.unit.wind.beaufort
                    : Is.unit[Yn.user.windUnit]
                ));
          }
          (this.ui.settings.update(t.setting),
            this.map.tooltip.isInfo || this.map.tooltip.hide());
        }),
        _i(lr, t, (t) => {
          (this.map.ns(),
            this.ui.isShowingWeather && this.ui.weather.updateFavorite(),
            (t.action !== m && "external" !== t.action) ||
              !this.ui.isShowingSearch ||
              this.ui.search.ws(),
            ("add" !== t.action && t.action !== ar) ||
              this.ui.hud.show(Is.hud.favorite[t.action]));
        }),
        lr.init(),
        _i(this.ui.layerIntro, "layer", (t) => {
          (this.map.tooltip.hide(), this.showLayer(t.layer));
        }),
        _i(this.ui.notifications, "layer", (t) => {
          this.map.tooltip.hide();
          const s = Yn.isHDLayer;
          (this.showLayer(t.layer), s && t.layer === Re.SATELLITE && this.ei());
        }),
        _i(this.ui.notifications, "model", (t) => {
          Yn.isForecastLayer &&
            ((Yn.model = t.model),
            Yn.modelIntros.includes(t.model)
              ? this.ui.hud.showModel()
              : this.ui.showModelIntro());
        }),
        _i(this.ui.notifications, Z, (t) => {
          this.Ni(t.id);
        }),
        _i(this.ui.notifications, k, (t) => {
          (this.Js(), this.ui.showOutage(t.id));
        }),
        _i(this.ui.notifications, w, (t) => {
          this.Oi(t.url);
        }),
        _i(this.ui.outage, w, (t) => {
          this.Oi(t.url);
        }),
        _i(this.ui, H, (t) => {
          ((this.map.storms.selectedID = null),
            (this.map.storms.selectedIndex = null),
            this.map.Vt(),
            this.Ci(),
            this.Li());
        }),
        _i(this.ui.measure, M, (t) => {
          this.map.startMeasure(t.measure);
        }),
        _i(this.ui.measure.doneButton, s, (t) => {
          this.map.measure.complete();
        }),
        _i(this.ui, b, (t) => {
          this.map.measure.cancel();
        }),
        _i(this.ui.zoom, t, (t) => {
          (this.ui.hideWelcome(),
            t.delta
              ? this.map.zoomBy(t.delta, !0)
              : this.map.zoomBy(t.zoom - this.map.zoom, !0));
        }),
        _i(this.ui.layers, t, (t) => {
          t.layer !== Yn.layer &&
            (this.map.object.gt(), this.showLayer(t.layer));
        }),
        _i(this.ui.overlays, t, (t) => {
          switch (t.overlay) {
            case Se.CLOUDS:
              this.pi();
              break;
            case Se.CROSSHAIR:
              this.gi();
              break;
            case Se.FIRES:
              this.wi();
              break;
            case Se.HEAT:
              this.yi(t.fires);
              break;
            case Se.ISOLINES:
              this.Mi();
              break;
            case Se.LABELS:
              this.bi();
              break;
            case Se.LABEL_VALUES:
              this.Ai();
              break;
            case Se.LINES:
              this.Ti();
              break;
            case Se.PRECIPITATION_ANIMATION:
              this.xi();
              break;
            case Se.RADAR:
              this.Di();
              break;
            case Se.COVERAGE:
              this.Ii();
              break;
            case Se.STORMS:
              this.Si();
              break;
            case Se.TERMINATOR:
              this.Ri();
              break;
            case Se.WIND_ANIMATION:
              this.ki();
          }
        }),
        _i(this.ui.model, t, (t) => {
          this.map.layers.data.needsPalette = !0;
          const s = (Yn.model = t.model);
          Yn.modelIntros.includes(s)
            ? (this.ui.hideModelIntro(),
              this.ui.hideNewIntro(),
              this.ui.hud.showModel())
            : (this.ui.showModelIntro(!0),
              Ns() && this.ui.isShowingLayers && this.ui.hud.showModel());
        }),
        _i(this.ui.model.button, s, (t) => {
          this.ui.toggleModel();
        }),
        _i(this.ui.timeline.scroll, s, (t) => {
          (Ns() && this.ui.hideLayers(),
            this.ui.hideModel(),
            this.ui.hideOverlays(),
            this.ui.hideTitle());
        }),
        _i(this.ui.timeline, m, (t) => {
          this.Vs(!0);
        }),
        _i(this.ui.timeline, L, (t) => {
          this.Js();
        }),
        _i(this.ui.timeline, N, (t) => {
          this.mi();
        }),
        _i(this.ui.timeline, q, (t) => {
          (this.map.tooltip.isInfo || this.map.tooltip.hide(),
            this.map.frameAnimator.stop());
          const s = Yn.time;
          if (
            ((Yn.time = t.time),
            Yn.st(),
            this.li(),
            this.di(),
            Yn.isGeocolorLayer)
          ) {
            const i = (t.time - s) / 120000;
            0 !== i && Math.abs(i) < 3 && this.map.Kt(i);
          } else {
            const i = t.time > s ? 1 : -1;
            (this.map.Kt(i), -1 === i && this.map.Kt(-2));
          }
          (this.ui.hideOutage(), this.ai(), this.Fi());
        }),
        _i(this.ui.timeline, Q, (t) => {
          (this.map.overlays.terminator.update(),
            this.map.updateData(),
            this.map.updateWind(),
            this.map.updateSources(),
            this.map.Jt(),
            this.Ci(),
            this.Li());
        }),
        _i(this.ui.timeline, F, (t) => {
          (this.map.object.gt(),
            this.ei(),
            this.ui.hud.showRecent(),
            this.li(),
            this.ai(),
            this.Fi(!0));
        }),
        _i(this.ui.clock, L, (t) => {
          this.Js();
        }),
        _i(this.ui.clock, N, (t) => {
          this.mi();
        }),
        _i(this.ui.clock, n, (t) => {
          this.Js();
          const s = Yn.time;
          if ((this.Xs(t), "recent" === t.calendar))
            (this.ui.hud.showRecent(), this.li());
          else if (
            (this.map.tooltip.isInfo || this.map.tooltip.hide(),
            this.li(),
            this.di(),
            Yn.isGeocolorLayer)
          ) {
            const t = (Yn.time - s) / (60000 * (Yn.isWithinMSG ? Nn : Ln));
            1 === Math.abs(t) && this.map.Kt(t);
          }
          (this.ui.hideOutage(), this.ai(), this.Fi(!0));
        }),
        _i(this.ui.weather, n, (t) => {
          if (isNaN(t.date)) return;
          this.Js();
          const s = t.date.getTime();
          (s < mh()
            ? (this.ei(), this.ui.timeline.updateTime())
            : s <= Yn.maxDate.getTime() &&
              this.Xs({
                calendar: "time",
                time: s,
              }),
            this.map.updateSources(),
            this.map.Jt(),
            this.map.updateTerminator(),
            this.ui.clock.update(),
            this.li(),
            this.Ci(),
            this.Li());
        }),
        _i(this.ui.weather, f, (t) => {
          (this.map.ts(),
            this.ui.timeline.init(),
            this.ui.clock.update(),
            rr.clearPlace(),
            this.Li());
        }),
        _i(this.ui.weather, j, (t) => {
          (this.map.ss(t.coordinate, t.isGeolocation), this.ui.showWeather());
        }),
        _i(this.ui.weather, Q, (t) => {
          (this.ui.timeline.init(), this.ui.clock.update());
        }),
        this.map.object.on(s, (t) => {
          const s = Ns() && this.ui.isShowingLayers;
          (rh(t.originalEvent) &&
            (s ||
              this.ui.isShowingOverlays ||
              this.ui.isShowingTitle ||
              this.ui.isShowingModel ||
              this.ui.isShowingSettings ||
              this.ui.isShowingSearch ||
              this.ui.isShowingAbout) &&
            (sh(t), sh(t.pointerEvent)),
            !this.ui.timeline.isPressed &&
              this.ui.timeline.isActive &&
              (this.ui.timeline.hideActive(!0), sh(t)),
            s && this.ui.hideLayers(),
            this.ui.hideAbout(),
            this.ui.hideModel(),
            this.ui.hideOverlays(),
            this.ui.hideSearch(),
            this.ui.hideSettings(),
            this.ui.hideShare(),
            this.ui.hideTitle(),
            this.ui.tooltip.hide());
        }),
        _i(this.map.frameAnimator, n, (t) => {
          if (t.delta)
            this.Xs({
              calendar: "minute",
              delta: t.delta,
            });
          else {
            const t = this.map.frameAnimator.date;
            (this.map.Jt(!1, t),
              this.map.Vt(t),
              this.ui.timeline.update(t),
              this.ui.clock.update(t));
          }
        }),
        _i(this.map.frameAnimator, P, (t) => {
          ((Yn.isTimeAnimating = !0),
            this.map.measure.cancel(),
            this.map.measure.hide(),
            this.map.tooltip.hide(),
            this.map.object.gt(),
            this.map.updateWind(),
            this.map.updateTerminator(),
            this.ui.timeline.showRecording(),
            this.ui.clock.showRecording(),
            this.ui.showAnimator(),
            this.ui.hud.show(Is.alert.loading));
        }),
        _i(this.map.frameAnimator, O, (t) => {
          ((this.ui.timeline.progress = t.progress),
            (this.ui.clock.progress = t.progress));
        }),
        _i(this.map.frameAnimator, N, (t) => {
          ((Yn.isTimeAnimating = !0),
            this.ui.timeline.hideRecording(),
            this.ui.clock.hideRecording(),
            this.ui.showAnimator());
        }),
        _i(this.map.frameAnimator, B, (t) => {
          ((Yn.isTimeAnimating = !1),
            this.map.updateWind(),
            this.map.measure.show(),
            this.map.tooltip.hide(),
            this.ui.timeline.updateTime(),
            this.ui.hideAnimator());
          const s = !navigator.onLine;
          ((this.ui.timeline.buttons.play.disabled = s),
            (this.ui.clock.buttons.play.disabled = s),
            this.ui.hud.hide(),
            this.ni());
        }),
        _i(this.map.timeAnimator, n, (t) => {
          const s = t.date;
          if (Yn.isGeocolorLayer) {
            const t = Yn.time;
            ((Yn.time = s.getTime()),
              this.map.Jt(),
              Yn.st(),
              t !== Yn.time &&
                (this.map.overlays.terminator.update(),
                this.map.updateSources(),
                this.map.Kt(1),
                this.Ci()));
          } else
            ((Yn.time = s.getTime()),
              Yn.tt(),
              this.map.overlays.terminator.update(),
              this.map.Jt(),
              this.map.updateData(),
              this.map.Kt(1),
              this.Ci());
          (t.updateWind && this.map.updateWind(),
            this.ui.timeline.update(s),
            this.ui.clock.update(s),
            this.ai(),
            this.Fi());
        }),
        _i(this.map.timeAnimator, N, (t) => {
          ((Yn.isTimeAnimating = !0),
            this.map.object.gt(),
            this.ui.showAnimator());
        }),
        _i(this.map.timeAnimator, B, (t) => {
          ((Yn.isTimeAnimating = !1),
            this.ui.timeline.updateTime(),
            this.ui.hideAnimator(),
            this.Li());
        }),
        _i(this.map.overlays.fires, f, (t) => {
          Yn.selectedFireID && this.ci();
        }),
        _i(this.map.storms, f, (t) => {
          this.ui.hideStorm();
        }),
        _i(this.map.storms, v, (t) => {
          this.map.Vt();
        }),
        _i(this.map.storms, Q, (t) => {
          (this.map.Vt(), this.Li(), this.ai(this.map.storms.selectedData));
        }),
        _i(this.map, Y, (t) => {
          if (
            (this.ui.timeline.isActive && !this.ui.timeline.isPressed
              ? this.ui.timeline.hideActive(!0)
              : setTimeout(() => {
                  this.ui.timeline.updateTime();
                }, 100),
            Yn.overlays.heat && this.yi(!0),
            this.Li(),
            this.ui.storm.show(t.data),
            this.ui.storm.select(t.index),
            this.ui.showStorm(),
            void 0 === t.index)
          )
            return;
          const s = t.data.track[t.index];
          s && s.forecast && t.data.active && !Yn.isForecastLayer
            ? Yn.isRadarLayer
              ? Yn.layerIntros.includes(Re.PRECIPITATION) ||
                this.ui.notifications.show(
                  {
                    id: wf.RAIN,
                    message: Is.notification.layerRain,
                    url: "#map=" + Re.PRECIPITATION,
                    duration: 60,
                  },
                  {
                    canRepeat: !0,
                  }
                )
              : Yn.layerIntros.includes(Re.WIND_GUSTS) ||
                this.ui.notifications.show(
                  {
                    id: wf.WIND,
                    message: Is.notification.layerWind,
                    url: "#map=" + Re.WIND_GUSTS,
                    duration: 60,
                  },
                  {
                    canRepeat: !0,
                  }
                )
            : this.ui.notifications.hideAll([wf.RAIN, wf.WIND]);
        }),
        _i(this.ui.storm, G, (t) => {
          (this.ui.timeline.isActive &&
            !this.ui.timeline.isPressed &&
            this.ui.timeline.hideActive(!0),
            !this.map.storms.selectedID &&
              t.id &&
              (this.map.storms.selectedID = t.id),
            this.map.tooltip.hide(),
            this.map.panToStormIndex(t.index, () => {
              setTimeout(() => {
                this.ui.timeline.updateTime();
              }, 100);
            }),
            this.ui.storm.select(t.index),
            this.ni());
        }),
        _i(this.ui.storm, r, (t) => {
          (this.map.tooltip.hide(),
            this.ui.storm.details.load(t.id),
            this.ui.showStormDetails());
        }),
        _i(this.ui.storm.details, "path", (t) => {
          const s = t.path,
            i = rr.parse(s, "", !0);
          0 !== s.indexOf(Kn.places)
            ? 0 === s.indexOf(Kn.storms) &&
              this.Ni(s.replace(Kn.storms, "").replace(/\//g, ""), i)
            : this.Pi(Jn(s), i, s, !1);
        }),
        _i(this.map, g, (t) => {
          const s = [t.label.text, ...(t.label.admins || [])]
              .join(Is.punctuation.comma)
              .replace(/-\n/g, "-")
              .replace(/\n/g, " ")
              .trim(),
            i = t.label.place,
            h = t.label.coordinate;
          (rr.setPlace(
            Yt(h),
            Yn.zooms.favorite,
            i ? Kn.places + i + "/" : "",
            s
          ),
            this.Li(),
            this.map.ss(h),
            this.ui.weather.init({
              title: s,
              place: i,
              coordinate: h,
              domTime: Date.now() + Rs + Gi,
            }));
        }),
        _i(this.map, c, (t) => {
          const { title: s, place: i, lon: h, lat: e } = t.location,
            n = Qt([h, e]);
          (rr.setPlace(
            [h, e],
            Yn.zooms.favorite,
            i ? Kn.places + i + "/" : "",
            s
          ),
            this.Li(),
            this.map.ss(n),
            this.ui.weather.init({
              title: s,
              place: i,
              coordinate: n,
              domTime: Date.now() + Rs + Gi,
            }));
        }),
        _i(this.map, y, (t) => {
          (Ns() &&
            (this.ui.hideLayers(), this.ui.hideModel(), this.ui.hideTitle()),
            this.ui.hideOverlays(),
            this.ui.hideShare(),
            rr.clearPlace(),
            this.Li(),
            this.ui.weather.init({
              coordinate: t.coordinate,
            }));
        }),
        _i(this.map, u, (t) => {
          (rr.clearPlace(),
            this.ui.weather.init({
              coordinate: t.coordinate,
              isGeolocation: !0,
            }));
        }),
        _i(this.map, l, (t) => {
          (this.map.tooltip.hide(!0),
            this.ui.hideStorm(),
            this.ui.hideWeather(),
            rr.setPlace(
              t.data.lonLat,
              Yn.zooms.fires,
              Kn.fires + t.data.id + "/",
              t.data.title
            ),
            this.Li(),
            (Yn.selectedFireID = t.data.id));
        }),
        _i(this.ui.search.input, "focus", (t) => {
          this.map.measure.cancel();
        }),
        _i(this.ui.search, "fires", (t) => {
          this.zi();
        }),
        _i(this.ui.search, R, (t) => {
          const s = t.data;
          if (!s) return;
          const i = s.storm;
          if (i) return (Yn.overlays.heat && this.yi(!0), void this.Ni(i));
          const { lon: h, lat: e } = s,
            n = [h, e],
            r = Qt(n),
            o = s.fire,
            a = s.marker;
          let c;
          o
            ? (c = Yn.zooms.fires)
            : s.zoom
              ? (c = et(
                  s.zoom - (!a && Yn.B ? 1 : 0),
                  Yn.zooms.min,
                  Yn.zooms.max
                ))
              : s.box &&
                (c = this.map.object.view.fit(Pt(s.box, Qt), {
                  size: this.map.object.size,
                  maxZoom: Yn.zooms.search,
                  returnZoom: !0,
                }));
          let l = s.path;
          (o
            ? ((l = Kn.fires + o + "/"),
              this.showLayer(Re.SATELLITE),
              this.zi(o))
            : this.map.tooltip.hide(),
            this.ui.hideStorm(),
            this.ui.hideSearch());
          const u = s.title;
          (a
            ? this.ui.weather.init({
                lonLat: n,
                title: u,
                place: Jn(l),
              })
            : this.ui.hideWeather(),
            this.map.moveTo({
              center: r,
              zoom: c,
              callback: () => {
                (a ? this.map.ss(r) : this.map.ts(),
                  this.ui.timeline.updateTime(),
                  this.ni(),
                  rr.setPlace(n, c, l, u),
                  this.Li());
              },
            }));
        }),
        _i(this.ui.title.button, s, (t) => {
          Ns() ? this.ui.toggleTitle() : this.ui.toggleAbout();
        }),
        _i(this.ui.title, "share", (t) => {
          (this.Js(), this.ui._s());
        }),
        _i(this.ui.title, M, (t) => {
          this.map.startMeasure(t.measure);
        }),
        _i(this.ui.share.button, s, (t) => {
          (this.map.object.gt(),
            Ns()
              ? this.ui._s()
              : (this.ui.toggleShare(), this.ui.isShowingShare && this.Js()));
        }),
        _i(this.ui.heatConsent.closeButton, s, (t) => {
          this.Ui();
        }),
        _i(this.ui.newIntro, qn, (t) => {
          this.showLayer(Re.RADAR);
        }),
        _i(this.ui.geolocation, z, (t) => {
          (this.Js(),
            this.map.measure.cancel(),
            this.map.object.gt(),
            this.ui.hideAbout(),
            this.ui.showGeolocation(),
            this.ui.search.showLocating());
        }),
        _i(this.ui.geolocation, a, (t) => {
          (this.ui.hideGeolocation(), this.ui.search.hideLocating());
        }),
        _i(this.ui.geolocation, W, (t) => {
          this.ui.hideSearch();
        }),
        _i(this.ui.geolocation, d, (t) => {
          const s = t.lonLat,
            i = Qt(s),
            h = et(
              Math.round(this.map.zoom),
              Yn.zooms.geolocationMin,
              t.accurate ? Yn.zooms.max : Yn.zooms.geolocationMax
            );
          ((Yn.home = s), rr.clearPlace());
          const e = !t.update || !1;
          (e &&
            (this.map.tooltip.hide(),
            this.map.moveTo({
              center: i,
              zoom: h,
              callback: () => {
                t.accurate &&
                  (this.ni(),
                  this.ui.isShowingLayerIntro ||
                    this.map.$t({
                      originalEvent: {},
                      coordinate: i,
                      pixel: this.map.geoDot.pixel,
                      isGeoDot: !0,
                    }));
              },
            })),
            t.update ||
              (Ns() &&
                (this.ui.hideLayers(),
                this.ui.hideModel(),
                this.ui.hideOverlays(),
                this.ui.hideTitle()),
              this.ui.hideStorm(),
              this.ui.hideSearch()),
            this.ui.hideGeolocation(),
            t.accurate
              ? (this.map.geoDot.show(this.map.object, this.map.object.geo, i),
                this.ui.search.showLocated(),
                e &&
                  (this.ui.geolocation.showLocated(),
                  this.ui.weather.init({
                    coordinate: i,
                    isGeolocation: !0,
                  }),
                  t.update || this.ui.hud.show(Is.hud.geolocation.success)))
              : (this.map.geoDot.hide(),
                this.ui.search.hideLocating(),
                this.ui.hideWeather(),
                this.ui.geolocation.hideLocated(),
                e && this.ui.hud.show(Is.hud.geolocation.approximate),
                setTimeout(() => {
                  this.ni();
                }, Gi)));
        }),
        _i(this.ui.search, "geolocationremove", (t) => {
          this.ui.geolocation.isLocating ||
            (this.map.geoDot.hide(),
            this.map.tooltip.isInfo && this.map.tooltip.hide(),
            this.ui.hideSearch(),
            this.ui.search.hideLocating(),
            this.ui.hideWeather(),
            this.ui.hud.show(Is.hud.geolocation.removed));
        }),
        _i(this.map.measure, sf, (t) => {
          (this.map.frameAnimator.stop(),
            this.map.tooltip.hide(),
            this.ui.tooltip.hide(),
            this.ui.isShowingHeatConsent && this.Ui(),
            this.ui.startMeasure(t.measure));
        }),
        _i(this.map.measure, tf, (t) => {
          this.map.cancelMeasure();
        }),
        _i(this.map.measure, "end", (t) => {
          (this.map.endMeasure(), this.ui.endMeasure(t.measure));
        }),
        _i(this.map, e, (t) => {
          this.ui.coordinate.update(t.lonLat, t.zoom);
        }),
        this.map.updateExtents(),
        Yn.st(),
        this.map.connectEvents(),
        this.map.updateSources(),
        this.ni(),
        this.resize(),
        i.place &&
          i.place.isMarker &&
          this.ui.weather.init({
            lonLat: rr.place.lonLat,
            title: rr.place.title,
            place: Jn(rr.place.path),
          }),
        delete window._ZE);
    }
    resize(t) {
      (this.map.object.updateSize(),
        Yn.isForecastLayer && this.map.layers.data.resize(this.map.object.size),
        Yn.overlays.windAnimation &&
          this.map.overlays.wind.resize(this.map.object.size),
        this.ui.scrollToTop(),
        this.ui.settings.resize(),
        this.ui.about.resize(),
        this.ui.weather.resize(),
        this.ui.storm.resize(),
        this.ui.layers.resize(),
        this.ui.overlays.resize(),
        this.ui.legend.resize(),
        Ns()
          ? t ||
            (this.ui.hideLayers(),
            this.ui.hideModel(),
            this.ui.hideOverlays(),
            this.ui.hideTitle())
          : !t && Yn.layersMenuOpen && this.ui.showLayers(),
        (Yn.isGeocolorLayer || Yn.isRadarLayer) && this.ui.timeline.update());
    }
    oi() {
      (this.resize(),
        clearTimeout(this.resizeTimeoutID),
        (this.resizeTimeoutID = setTimeout(() => {
          this.resize(!0);
        }, 500)));
    }
    fi(t, s) {
      (void 0 === s && (s = !0),
        t &&
          (this.map.tooltip.hide(!0),
          this.map.moveTo({
            center: Qt(t.lonLat),
            zoom: t.zoom,
            immediate: s,
          }),
          t.layer && this.showLayer(t.layer),
          void 0 !== t.date && ((Yn.useTimeSync = !1), this.$s(t.date, !0)),
          this.map.updateLayers(),
          this.map.updateSources(),
          this.map.Jt(),
          this.ni(),
          this.resize(),
          Array.isArray(t.markerLonLat) && this.Ks(t.markerLonLat)));
    }
    Oi(t) {
      if (!t) return;
      const [s, i] = t.split("#");
      this.fi(rr.parse(s, i, !0));
    }
    Ks(t) {
      (this.map.ss(
        ((t) => {
          let [s, i] = Zt(t[0], t[1]);
          return [s * Ut, et(i * Ut, -Ut, Ut)];
        })(t)
      ),
        this.ui.weather.init({
          lonLat: t,
        }));
    }
    showLayer(t, s) {
      (void 0 === s && (s = !0),
        "geocolor" === t
          ? (t = Re.SATELLITE)
          : "daily" === t && (t = Re.SATELLITE_HD),
        this.Js());
      const i = Yn.getDate();
      let h = !1;
      switch (t) {
        case Re.SATELLITE:
          Yn.isGeocolorLayer || Yn.isGeocolorDate(i) || (h = !0);
          break;
        case Re.SATELLITE_HD:
          s &&
            Yn.isGeocolorLayer &&
            Yn.layers.geocolor.date.getUTCDate() === ph().getUTCDate() &&
            ((Yn.layers.hd.isAM = !1), this.$s(vh(Yn.layers.geocolor.date)));
          break;
        case Re.RADAR:
          Yn.isRadarLayer || Yn.isRadarDate(i) || (h = !0);
      }
      (s &&
        Yn.isHDLayer &&
        t !== Re.SATELLITE_HD &&
        (i.setUTCHours(Yn.layers.hd.isAM ? 10 : 13, 30, 0, 0),
        this.$s(gh(i.getTime(), -this.map.mapLon))),
        Le(t)
          ? (Yn.isForecastLayer || Yn.isForecastDate(i, t) || (h = !0),
            Oe(t) && !Yn.isWindLayer && (Yn.overlays.forecastWind = !0))
          : this.map.tooltip.isInfo || this.map.tooltip.hide(),
        (Yn.layer = t),
        s && ((h || Yn.useTimeSync) && this.ei(), Yn.st()),
        this.map.layers.data.clear(),
        this.map.updateLayers(),
        this.map.updateSources(),
        this.map.Jt(!0),
        this.map.storms.Ct(this.map.storms.selectedID, this.map.mapLon),
        this.ai(),
        this.Fi(!0),
        this.ni(),
        this.map.overlays.labels.Ht(),
        this.map.overlays.labels.Yt(!0),
        this.ui.isShowingWeather &&
          (Yn.user.isDailySummary
            ? this.ui.weather.load(!0)
            : this.ui.weather.update()),
        this.ui.hideModelIntro(),
        this.ui.hideNewIntro(),
        this.ui.hideOutage(),
        t === Re.RADAR && (t += ke),
        Yn.layerIntros.includes(t)
          ? (this.ui.hideLayerIntro(), this.ui.hud.showLayer(t))
          : (this.ui.showLayerIntro(!0),
            Ns() && this.ui.isShowingLayers && this.ui.hud.showLayer(t)),
        this.ui.notifications.hideAll([
          wf.MAX_ZOOM,
          wf.SATELLITE,
          wf.SATELLITE_HD,
          wf.PRECIPITATION,
          wf.RADAR,
          wf.RAIN,
          wf.WIND,
        ]));
    }
    goToModel(t) {
      Yn.isForecastLayer && (Yn.goToModel(t), this.ui.hud.showModel());
    }
    ri() {
      const t = Yn.isForecastLayer;
      ((t || Yn.overlays.windAnimation) && (Yn.tt(), this.map.updateSources()),
        t && (this.map.Jt(), this.ui.timeline.init(), this.ni()));
    }
    Xs(t) {
      Yn.useTimeSync = !1;
      const s = Yn.getDate();
      switch (t.calendar) {
        case "year":
          s.setUTCFullYear(s.getUTCFullYear() + t.delta);
          break;
        case "month":
          s.setUTCMonth(s.getUTCMonth() + t.delta);
          break;
        case "day":
          s.setUTCDate(s.getUTCDate() + t.delta);
          break;
        case "ampm":
          ((Yn.layers.hd.isAM = !Yn.layers.hd.isAM),
            ((!Yn.layers.hd.isAM && t.delta < 0) ||
              (Yn.layers.hd.isAM && t.delta > 0)) &&
              s.setUTCDate(s.getUTCDate() + t.delta));
          break;
        case "hour":
          s.setUTCHours(s.getUTCHours() + t.delta);
          break;
        case "minute":
          s.setUTCMinutes(
            s.getUTCMinutes() +
              t.delta *
                (Yn.isGeocolorLayer && Yn.isWithinMSG
                  ? Nn
                  : Yn.isRadarLayer
                    ? 5
                    : Ln)
          );
          break;
        case "recent":
          (s.setTime(mh()),
            (Yn.useTimeSync = !0),
            (Yn.layers.hd.isAM = !1),
            Yn.isHDLayer &&
              this.ui.notifications.show(
                {
                  id: wf.SATELLITE,
                  message: Is.notification.layerLive,
                  url: "#map=" + Re.SATELLITE,
                },
                {
                  canRepeat: !0,
                  canDismiss: !0,
                }
              ));
          break;
        case "time":
          s.setTime(t.time);
      }
      (("day" !== t.calendar && "hour" !== t.calendar) ||
        !Yn.isForecastLayer ||
        (!Yn.user.isUTCTimeZone && 0 !== nt(Nh(s, Yn.timeZone) / 3600000, 1)) ||
        si(s, 60),
        this.$s(s, "time" === t.calendar));
    }
    $s(t, s) {
      if ((void 0 === s && (s = !1), isNaN(t))) return;
      const i = Yn.time;
      ((Yn.time = t.getTime()),
        Yn.st(),
        i === Yn.time ||
          ((!Yn.isGeocolorLayer || this.map.tooltip.isGeoDot) &&
            this.map.tooltip.isInfo) ||
          this.map.tooltip.hide(),
        s
          ? (this.Ci(),
            Yn.isForecastLayer &&
              !Yn.isForecastDate(t) &&
              this.showLayer(
                Yn.isGeocolorDate(t) ? Re.SATELLITE : Re.SATELLITE_HD
              ),
            Yn.isGeocolorLayer &&
              !Yn.isGeocolorDate(t) &&
              this.showLayer(Re.SATELLITE_HD),
            (this.ui.timeline.time = Yn.time))
          : (this.map.updateSources(), this.map.Jt(), this.ni()),
        this.Vs());
    }
    Vs(t) {
      (clearTimeout(this.Ys),
        (this.Ys = setTimeout(
          () => {
            Yn.isTimeSyncLayer &&
              (Yn.useTimeSync && this.ei(),
              this.ui.timeline.updateRecent(t),
              this.Vs());
          },
          t ? 0 : Ns() ? 1000 : 2000
        )));
    }
    ei() {
      this.Xs({
        calendar: "recent",
      });
    }
    Js() {
      if (!this.map) return;
      const t = this.map.frameAnimator.isActive;
      (t && this.map.frameAnimator.stop(),
        this.map.timeAnimator.stop(),
        Yn.st(),
        t ? this.ui.timeline.updateTime() : this.ui.timeline.update(),
        clearTimeout(this.ui.clock.repeatID),
        this.ui.clock.update());
    }
    mi() {
      (Ns() && this.ui.hideLayers(),
        this.ui.hideAbout(),
        this.ui.hideModel(),
        this.ui.hideOutage(),
        this.ui.hideOverlays(),
        this.ui.hideSearch(),
        this.ui.hideShare(),
        this.ui.hideTitle(),
        this.map.storms.selectedID &&
          !this.map.tooltip.isInfo &&
          this.map.tooltip.hide(),
        (Yn.useTimeSync = !1));
      const t = Yn.isGeocolorLayer;
      (t && Yn.user.isFrameAnimator
        ? this.map.frameAnimator.start()
        : this.map.timeAnimator.start(),
        this.ui.notifications.hide(wf.RADAR),
        t &&
          this.ui.notifications.hideAll([
            wf.SATELLITE,
            wf.SATELLITE_HD,
            wf.PRECIPITATION,
          ]),
        this.Li());
    }
    gi() {
      const t = (Yn.overlays.crosshair = !Yn.overlays.crosshair);
      (this.map.updateCoordinate(),
        this.ui.Zs(),
        this.ui.hud.showOverlay(Se.CROSSHAIR, t),
        this.Li());
    }
    pi() {
      if (!Yn.isPrecipitationLayer) return;
      const t = (Yn.overlays.clouds = !Yn.overlays.clouds);
      (this.map.layers.data.draw(),
        this.map.object.render(),
        this.ui.Zs(),
        this.ui.hud.showOverlay(Se.CLOUDS, t),
        this.Li());
    }
    wi() {
      const t = (Yn.overlays.fires = !Yn.overlays.fires);
      (t || this.ci(),
        Yn.user.isFrameAnimator && this.Js(),
        this.map.updateSources(),
        this.ui.Zs(),
        this.ui.hud.showOverlay(Se.FIRES, t),
        this.Li());
    }
    yi(t) {
      if (!Yn.isGeocolorLayer && !Yn.isHDLayer) return;
      const s = (Yn.overlays.heat = !Yn.overlays.heat);
      ((this.ui.heatConsentFires = t),
        t && (Yn.overlays.fires = s),
        Yn.user.isFrameAnimator && this.Js(),
        s || this.map.overlays.heat.cancel(),
        this.map.updateSources(),
        this.ui.Zs(),
        this.ui.updateHeatConsent(),
        this.ui.hud.showOverlay(t ? "heat-fires" : Se.HEAT, s),
        this.Ci(),
        this.Li());
    }
    Ui() {
      ((Yn.heatConsent = !1),
        this.ui.hideHeatConsent(),
        this.yi(this.ui.heatConsentFires));
    }
    Mi() {
      if (!Yn.isPressureLayer || !Yn.$) return;
      const t = (Yn.overlays.isolines = !Yn.overlays.isolines);
      (this.map.layers.data.draw(),
        this.map.object.render(),
        this.ui.Zs(),
        this.ui.hud.showOverlay(Se.ISOLINES, t),
        this.Li());
    }
    bi() {
      const t = (Yn.overlays.labels = !Yn.overlays.labels);
      (this.map.updateLabels(),
        this.ui.Zs(),
        this.ui.hud.showOverlay(Se.LABELS, t),
        this.Li());
    }
    Ai() {
      if (Yn.isPrecipitationLayer || !Yn.isForecastLayer) return;
      const t = (Yn.overlays.labelValues = !Yn.overlays.labelValues);
      (Yn.overlays.labelValues && (Yn.overlays.labels = !0),
        this.map.updateLabels(),
        this.ui.Zs(),
        this.ui.updateLayerType(!0),
        this.ui.hud.showOverlay(Se.LABEL_VALUES, t),
        this.Li());
    }
    Ti() {
      if (!Yn.isGeocolorLayer && !Yn.isHDLayer) return;
      const t = (Yn.overlays.lines = !Yn.overlays.lines);
      (Yn.user.isFrameAnimator && this.Js(),
        this.map.updateLayers(),
        this.ui.Zs(),
        this.ui.hud.showOverlay(Se.LINES, t),
        this.Li());
    }
    xi() {
      if (!Yn.isRadarLayer && !Yn.isPrecipitationLayer) return;
      const t = (Yn.overlays.precipitationAnimation =
        !Yn.overlays.precipitationAnimation);
      (this.map.layers.data.draw(),
        this.map.object.render(),
        this.ui.Zs(),
        this.ui.hud.showOverlay(Se.PRECIPITATION_ANIMATION, t));
    }
    Ei() {
      (Yn.isRadarLayer || Yn.isPrecipitationLayer) &&
        (Yn.user.precipitationTheme = Yn.user.isDarkTheme ? Qe.LIGHT : Qe.DARK);
    }
    Di() {
      if (!Yn.isGeocolorLayer) return;
      const t = (Yn.overlays.radar = !Yn.overlays.radar);
      (Yn.user.isFrameAnimator && this.Js(),
        this.map.overlays.radar.updateSource(),
        this.map.tooltip.hide(),
        this.ui.Zs(),
        this.ui.hud.showOverlay(Se.RADAR, t),
        this.Ci(),
        this.Li());
    }
    Ii() {
      if (!Yn.isRadarLayer) return;
      const t = (Yn.overlays.coverage = !Yn.overlays.coverage);
      (this.map.updateLayers(),
        this.ui.hud.showOverlay(Se.COVERAGE, t),
        this.ui.Zs(),
        this.Li());
    }
    Si() {
      const t = (Yn.overlays.storms = !Yn.overlays.storms);
      (this.map.frameAnimator.stop(),
        this.map.Jt(),
        t
          ? this.map.storms.kt()
          : (this.map.tooltip.hide(),
            this.map.storms.Lt(),
            this.ui.hideStorm()),
        this.ui.Zs(),
        this.ui.hud.showOverlay(Se.STORMS, t),
        this.Ci(),
        this.Li());
    }
    Ni(t, s) {
      Yn.overlays.storms || this.Si();
      const i = Yn.layer;
      this.map.storms.load(t, !0, () => {
        if (this.map.Xt(t)) {
          if (
            (this.map.selectStormDate(!1),
            this.ui.hideSearch(),
            this.ci(),
            this.Js(),
            this.fi(s),
            ((Yn.isHDLayer && Yn.isGeocolorDate(Yn.layers.hd.date)) ||
              (Yn.isRadarLayer &&
                Yn.layers.geocolor.date.getTime() <
                  Yn.layers.radar.minDate.getTime())) &&
              this.showLayer(Re.SATELLITE, !1),
            this.map.Xt(t))
          ) {
            const t = this.map.storms.selectedData;
            (this.fi(s),
              setTimeout(
                () => {
                  t
                    ? (this.ai(t),
                      this.ui.showStorm(),
                      this.ui.timeline.updateTime())
                    : this.ui.hideStorm();
                },
                Yn.layer === i ? 0 : 200
              ));
          }
        } else this.ui.search.Ts();
      });
    }
    ci() {
      (Yn.selectedFireID && ((Yn.selectedFireID = null), rr.clearPlace()),
        this.map.tooltip.hide());
    }
    zi(t) {
      (this.ei(),
        this.ui.hideStorm(),
        this.ui.hideSearch(),
        Yn.overlays.heat || this.yi(),
        Yn.overlays.fires || this.wi(),
        t &&
          (this.map.tooltip.hide(!0),
          (Yn.selectedFireID = t),
          this.map.showFireTooltip(t) || this.ti()));
    }
    Pi(t, s, i, h) {
      void 0 === h && (h = !0);
      const e = {
        id: t,
      };
      (Kh.enLang || (e.lang = Kh.lang),
        new Xs()
          .load({
            url: ms,
            params: e,
            validate: ["id"],
          })
          .then((t) => {
            (this.ci(), this.Js(), this.ui.hideStorm(), this.ui.hideSearch());
            const e = (s.lonLat = [t.lon, t.lat]),
              n = t.title;
            ((s.zoom = t.zoom - (!t.marker && Yn.B ? 1 : 0)),
              rr.setPlace(e, t.zoom, i, n),
              /^([^/]+\/){2}$/.test(i.replace(Kn.places, "")) &&
                this.ui.weather.init({
                  lonLat: e,
                  title: n,
                  place: Jn(i),
                }),
              this.fi(s, h));
          })
          .catch((t) => {
            Qs.add("place", t.message);
          }));
    }
    Ri() {
      if (Yn.isHDLayer) return;
      const t = (Yn.overlays.terminator = !Yn.overlays.terminator);
      (this.map.frameAnimator.stop(),
        this.map.updateTerminator(),
        this.ui.Zs(),
        this.ui.hud.showOverlay(Se.TERMINATOR, t));
    }
    ki() {
      if (Yn.isHDLayer) return;
      let t;
      ((t = Yn.isWindLayer
        ? (Yn.overlays.windAnimation = Yn.overlays.forecastWind =
            !Yn.overlays.forecastWind)
        : (Yn.overlays.windAnimation = !Yn.overlays.windAnimation)),
        this.map.frameAnimator.stop(),
        this.map.updateWind(),
        this.map.$t(),
        this.ui.Zs(),
        this.ui.hud.showOverlay(Se.WIND_ANIMATION, t),
        this.Ci(),
        this.Li());
    }
    Ci() {
      this.map && this.ui.Hs(this.map.attributionText);
    }
    Li() {
      this.map.frameAnimator.isRecording ||
        (clearTimeout(this.qs),
        (this.qs = setTimeout(() => {
          const t = !Yn.useTimeSync && !this.map.timeAnimator.isPlaying;
          if (rr.updatePlace(t)) this.ui.share.update();
          else {
            if (Yn.overlays.storms) {
              this.map.storms.updateSelected(this.map.mapExtent);
              const t = this.map.storms.selectedData;
              if (t)
                return (rr.updateStormTrack(t), void this.ui.share.update());
            }
            (rr.update(
              this.map.lonLat,
              this.map.zoom,
              this.map.marker.lonLat,
              t
            ),
              this.ui.share.update());
          }
        }, 100)));
    }
    ai(t) {
      (this.ui.storm.show(t),
        this.map.storms.selectedID &&
          this.ui.storm.select(this.map.storms.closestIndex));
    }
    Fi(t) {
      this.ui.isShowingWeather &&
        this.ui.weather.updateSelected(
          t ||
            !Yn.user.isTimeline ||
            (Yn.user.isDailySummary && this.ui.timeline.isActive) ||
            this.map.timeAnimator.isPlaying
        );
    }
    Wi() {
      if (this.map.frameAnimator.isActive) return;
      let t = !0;
      for (let s = gt.length; s--; ) {
        const i = gt[s],
          h = i === (Yn.user.isMTGEnabled ? pt.MSG_ZERO : pt.MTG_ZERO),
          e = wf.OUTAGE_PREFIX + i;
        !h && this.map.hasGeocolorOutage(i)
          ? (this.ui.notifications.show(
              {
                id: e,
                message: Is.notification.outage,
                outage: i,
              },
              {
                canRepeat: !0,
              }
            ),
            (t = !1))
          : this.ui.notifications.hide(e);
      }
      t && this.ui.hideOutage();
    }
    Gi() {
      !Yn.welcome &&
      !Yn.isRadarLayer &&
      Yn.H &&
      Yn.layers.radar.times.length > 0 &&
      Date.now() - Yn.U > 2000 &&
      !this.map.frameAnimator.isActive &&
      !this.ui.timeline.isPressed &&
      !this.ui.isShowingLayerIntro &&
      !this.ui.isShowingModelIntro &&
      Kh.storage
        ? this.ui.showNewIntro()
        : this.ui.hideNewIntro();
    }
    li() {
      const t = mh();
      Yn.isPrecipitationLayer &&
      Yn.H &&
      this.map.zoom >= Yn.zooms.radarNotify &&
      Yn.layers.radar.hasRange &&
      Yn.layers.radar.maxDate.getTime() > t &&
      Math.abs(Yn.time - t) < 3600000
        ? this.ui.notifications.show(
            {
              id: wf.RADAR,
              message: Is.notification.layerRadar,
              url: "#map=" + Re.RADAR,
              delay: 1.5,
              duration: 30,
            },
            {
              canRepeat: !0,
            }
          )
        : this.ui.notifications.hide(wf.RADAR);
    }
    di() {
      const t = Yn.isTimeAnimating,
        s = Yn.layers.geocolor;
      !t &&
      navigator.onLine &&
      Yn.isGeocolorLayer &&
      s.hasRange &&
      (!this.map.isWithinGeocolor ||
        (s.maxDate.getTime() - s.minDate.getTime() > 86400000 &&
          s.date.getTime() <=
            s.minDate.getTime() + 3600000 * (Yn.user.isTimeline ? 3 : 12)))
        ? this.ui.notifications.show(
            {
              id: wf.SATELLITE_HD,
              message: Is.notification.layerHD,
              url: "#map=" + Re.SATELLITE_HD,
            },
            {
              canRepeat: !0,
              canDismiss: !0,
            }
          )
        : this.ui.notifications.hide(wf.SATELLITE_HD);
    }
    ni() {
      (this.map.updateLabels(),
        this.map.updateTerminator(),
        this.ui.layers.update(),
        this.ui.model.update(),
        this.ui.Zs(),
        this.ui.zoom.update(this.map.zoom));
      const t = this.map.frameAnimator.date;
      (this.ui.timeline.update(t),
        this.ui.clock.update(t),
        this.ui.updateLayerType(),
        this.ui.updateHeatConsent(),
        this.Ci(),
        this.Li(),
        this.Wi(),
        this.Gi());
    }
    loadData() {
      (this.Qs(),
        this.map.loader.Mt(),
        this.map.loader.At(),
        this.map.loader.Dt(),
        this.map.loader.It(),
        this.ti(),
        this.si(),
        this.ii(),
        this.hi());
    }
    Qs() {
      new Xs()
        .load({
          url: ws,
          validate: ["time"],
        })
        .then((t) => {
          fh.update(1000 * t.time - Date.now());
        })
        .catch((t) => {
          Qs.add("timeOffset", t.message);
        });
    }
    ti(t) {
      new Xs()
        .load({
          url: as + "latest.json",
        })
        .then((s) => {
          (this.map.overlays.fires.update(s) &&
            this.ui.search.suggestCache.clear(),
            Yn.selectedFireID && this.map.showFireTooltip(Yn.selectedFireID),
            t && t(s));
        })
        .catch((t) => {
          Qs.add("firesLatest", t.message);
        });
    }
    si() {
      const t = {};
      (Kh.enLang || (t.lang = Kh.lang),
        new Xs()
          .load({
            url: us,
            params: t,
          })
          .then((t) => {
            this.ui.notifications.update(t);
          })
          .catch((t) => {
            Qs.add("notifications", t.message);
          }));
    }
    ii() {
      const t = {};
      (Kh.enLang || (t.lang = Kh.lang),
        new Xs()
          .load({
            url: ds,
            params: t,
            validate: ["outages"],
          })
          .then((t) => {
            ((this.ui.outage.data = t.outages),
              (Yn.user.mtg = t.mtg || Xe.ENABLED));
          })
          .catch((t) => {
            Qs.add("outages", t.message);
          }));
    }
    hi() {
      if (Date.now() - Yn.U < 86400000) return;
      const t = {};
      (Kh.enLang || (t.lang = Kh.lang),
        new Xs()
          .load({
            url: vs,
            params: t,
          })
          .then((t) => {
            t.app !== Yn.version.app &&
              this.ui.notifications.show(
                {
                  id: wf.UPDATE,
                  message: Is.notification.update,
                  url: "/",
                },
                {
                  canRepeat: !0,
                }
              );
          })
          .catch((t) => {
            Qs.add("version", t.message);
          }));
    }
  })();
})();
