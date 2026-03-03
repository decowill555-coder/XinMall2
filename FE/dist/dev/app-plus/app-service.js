if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const _sfc_main$11 = /* @__PURE__ */ vue.defineComponent({
    __name: "UiIcon",
    props: {
      name: { type: String, required: true },
      size: { type: [String, Number], required: false, default: 48 },
      color: { type: String, required: false, default: "#000000" },
      bold: { type: Boolean, required: false, default: false }
    },
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const parsedSize = vue.computed(() => {
        return typeof props.size === "number" ? `${props.size}rpx` : props.size;
      });
      const encodedColor = vue.computed(() => {
        return encodeURIComponent(props.color);
      });
      const svgIcons = {
        "arrow-left": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,
        "arrow-right": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
        "arrow-up": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`,
        "arrow-down": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`,
        "home": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
        "home-fill": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>`,
        "search": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`,
        "search-fill": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
        "heart": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
        "heart-fill": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
        "heart-outline": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
        "star": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
        "star-fill": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
        "star-outline": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
        "user": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        "user-fill": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`,
        "message": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
        "message-fill": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`,
        "cart": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>`,
        "cart-fill": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
        "plus": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
        "minus": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
        "close": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
        "check": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>`,
        "check-circle": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16,10 10,16 8,14"/></svg>`,
        "check-circle-fill": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
        "circle": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`,
        "info": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        "info-circle": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        "warning": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        "warning-circle": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        "error": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
        "error-circle": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
        "success": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>`,
        "success-circle": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16,10 10,16 8,14"/></svg>`,
        "phone": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>`,
        "email": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
        "location": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
        "map-pin": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
        "camera": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
        "image": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>`,
        "video": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23,7 16,12 23,17"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
        "file": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13,2 13,9 20,9"/></svg>`,
        "file-text": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>`,
        "folder": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>`,
        "trash": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>`,
        "edit": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
        "copy": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
        "share": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
        "link": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`,
        "download": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
        "upload": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
        "refresh": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23,4 23,10 17,10"/><polyline points="1,20 1,14 7,14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>`,
        "settings": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
        "filter": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>`,
        "sort": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="16" y2="12"/><line x1="4" y1="18" x2="12" y2="18"/></svg>`,
        "more": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
        "more-vertical": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`,
        "eye": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
        "eye-off": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
        "lock": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
        "unlock": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 019.9-1"/></svg>`,
        "shield": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        "bell": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`,
        "bell-fill": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>`,
        "calendar": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
        "time": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`,
        "clock": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`,
        "credit-card": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
        "wallet": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2z"/><path d="M1 10h22"/></svg>`,
        "money": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
        "gift": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,12 20,22 4,22 4,12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>`,
        "coupon": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a2 2 0 012-2h16a2 2 0 012 2v1a2 2 0 000 4v1a2 2 0 01-2 2H4a2 2 0 01-2-2v-1a2 2 0 000-4V9z"/><line x1="9" y1="7" x2="9" y2="17"/><line x1="15" y1="7" x2="15" y2="17"/></svg>`,
        "tag": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
        "tags": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
        "store": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
        "shop": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>`,
        "goods": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
        "package": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
        "truck": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
        "global": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
        "globe": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
        "scan": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 012-2h2"/><path d="M17 3h2a2 2 0 012 2v2"/><path d="M21 17v2a2 2 0 01-2 2h-2"/><path d="M7 21H5a2 2 0 01-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>`,
        "qrcode": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
        "type": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,7 4,4 20,4 20,7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
        "help-circle": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        "question-circle": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        "like": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>`,
        "like-fill": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>`,
        "dislike": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/></svg>`,
        "comment": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
        "comment-fill": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`,
        "forward": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5,4 15,12 5,20"/><line x1="19" y1="5" x2="19" y2="19"/></svg>`,
        "back": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19,20 9,12 19,4"/><line x1="5" y1="19" x2="5" y2="5"/></svg>`,
        "shopping-cart": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>`
      };
      const iconSrc = vue.computed(() => {
        const svg = svgIcons[props.name];
        if (!svg) {
          return "";
        }
        const coloredSvg = svg.replace(/currentColor/g, props.color);
        const encoded = encodeURIComponent(coloredSvg);
        return `data:image/svg+xml,${encoded}`;
      });
      const __returned__ = { props, emit, parsedSize, encodedColor, svgIcons, iconSrc };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  function _sfc_render$11(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("image", {
      class: "ui-icon-svg",
      src: $setup.iconSrc,
      style: vue.normalizeStyle({
        width: $setup.parsedSize,
        height: $setup.parsedSize
      }),
      mode: "aspectFit",
      onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("click"))
    }, null, 12, ["src"]);
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$11, [["render", _sfc_render$11], ["__scopeId", "data-v-261f3a7c"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/atoms/UiIcon.vue"]]);
  const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __easycom_0$1
  }, Symbol.toStringTag, { value: "Module" }));
  const ON_SHOW = "onShow";
  const ON_HIDE = "onHide";
  const ON_LAUNCH = "onLaunch";
  const ON_READY = "onReady";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const createLifeCycleHook = (lifecycle, flag = 0) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createLifeCycleHook(
    ON_SHOW,
    1 | 2
    /* HookFlags.PAGE */
  );
  const onHide = /* @__PURE__ */ createLifeCycleHook(
    ON_HIDE,
    1 | 2
    /* HookFlags.PAGE */
  );
  const onLaunch = /* @__PURE__ */ createLifeCycleHook(
    ON_LAUNCH,
    1
    /* HookFlags.APP */
  );
  const onReady = /* @__PURE__ */ createLifeCycleHook(
    ON_READY,
    2
    /* HookFlags.PAGE */
  );
  function set(target, key, val) {
    if (Array.isArray(target)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val;
    }
    target[key] = val;
    return val;
  }
  function del(target, key) {
    if (Array.isArray(target)) {
      target.splice(key, 1);
      return;
    }
    delete target[key];
  }
  function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget() {
    return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : {};
  }
  const isProxyAvailable = typeof Proxy === "function";
  const HOOK_SETUP = "devtools-plugin:setup";
  const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
  let supported;
  let perf;
  function isPerformanceSupported() {
    var _a;
    if (supported !== void 0) {
      return supported;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported = true;
      perf = window.performance;
    } else if (typeof globalThis !== "undefined" && ((_a = globalThis.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
      supported = true;
      perf = globalThis.perf_hooks.performance;
    } else {
      supported = false;
    }
    return supported;
  }
  function now() {
    return isPerformanceSupported() ? perf.now() : Date.now();
  }
  class ApiProxy {
    constructor(plugin, hook) {
      this.target = null;
      this.targetQueue = [];
      this.onQueue = [];
      this.plugin = plugin;
      this.hook = hook;
      const defaultSettings = {};
      if (plugin.settings) {
        for (const id in plugin.settings) {
          const item = plugin.settings[id];
          defaultSettings[id] = item.defaultValue;
        }
      }
      const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
      let currentSettings = Object.assign({}, defaultSettings);
      try {
        const raw = localStorage.getItem(localSettingsSaveId);
        const data = JSON.parse(raw);
        Object.assign(currentSettings, data);
      } catch (e) {
      }
      this.fallbacks = {
        getSettings() {
          return currentSettings;
        },
        setSettings(value) {
          try {
            localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
          } catch (e) {
          }
          currentSettings = value;
        },
        now() {
          return now();
        }
      };
      if (hook) {
        hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
          if (pluginId === this.plugin.id) {
            this.fallbacks.setSettings(value);
          }
        });
      }
      this.proxiedOn = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target.on[prop];
          } else {
            return (...args) => {
              this.onQueue.push({
                method: prop,
                args
              });
            };
          }
        }
      });
      this.proxiedTarget = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target[prop];
          } else if (prop === "on") {
            return this.proxiedOn;
          } else if (Object.keys(this.fallbacks).includes(prop)) {
            return (...args) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve: () => {
                }
              });
              return this.fallbacks[prop](...args);
            };
          } else {
            return (...args) => {
              return new Promise((resolve) => {
                this.targetQueue.push({
                  method: prop,
                  args,
                  resolve
                });
              });
            };
          }
        }
      });
    }
    async setRealTarget(target) {
      this.target = target;
      for (const item of this.onQueue) {
        this.target.on[item.method](...item.args);
      }
      for (const item of this.targetQueue) {
        item.resolve(await this.target[item.method](...item.args));
      }
    }
  }
  function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const descriptor = pluginDescriptor;
    const target = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
      hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    } else {
      const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
      const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
      list.push({
        pluginDescriptor: descriptor,
        setupFn,
        proxy
      });
      if (proxy) {
        setupFn(proxy.proxiedTarget);
      }
    }
  }
  /*!
   * pinia v2.3.1
   * (c) 2025 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia) => activePinia = pinia;
  const piniaSymbol = Symbol("pinia");
  function isPlainObject(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  const IS_CLIENT = typeof window !== "undefined";
  const _global = /* @__PURE__ */ (() => typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : typeof globalThis === "object" ? globalThis : { HTMLElement: null })();
  function bom(blob, { autoBom = false } = {}) {
    if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
      return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
    }
    return blob;
  }
  function download(url, name, opts) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = function() {
      saveAs(xhr.response, name, opts);
    };
    xhr.onerror = function() {
      console.error("could not download file");
    };
    xhr.send();
  }
  function corsEnabled(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, false);
    try {
      xhr.send();
    } catch (e) {
    }
    return xhr.status >= 200 && xhr.status <= 299;
  }
  function click(node) {
    try {
      node.dispatchEvent(new MouseEvent("click"));
    } catch (e) {
      const evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
      node.dispatchEvent(evt);
    }
  }
  const _navigator = typeof navigator === "object" ? navigator : { userAgent: "" };
  const isMacOSWebView = /* @__PURE__ */ (() => /Macintosh/.test(_navigator.userAgent) && /AppleWebKit/.test(_navigator.userAgent) && !/Safari/.test(_navigator.userAgent))();
  const saveAs = !IS_CLIENT ? () => {
  } : (
    // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
    typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? downloadSaveAs : (
      // Use msSaveOrOpenBlob as a second approach
      "msSaveOrOpenBlob" in _navigator ? msSaveAs : (
        // Fallback to using FileReader and a popup
        fileSaverSaveAs
      )
    )
  );
  function downloadSaveAs(blob, name = "download", opts) {
    const a = document.createElement("a");
    a.download = name;
    a.rel = "noopener";
    if (typeof blob === "string") {
      a.href = blob;
      if (a.origin !== location.origin) {
        if (corsEnabled(a.href)) {
          download(blob, name, opts);
        } else {
          a.target = "_blank";
          click(a);
        }
      } else {
        click(a);
      }
    } else {
      a.href = URL.createObjectURL(blob);
      setTimeout(function() {
        URL.revokeObjectURL(a.href);
      }, 4e4);
      setTimeout(function() {
        click(a);
      }, 0);
    }
  }
  function msSaveAs(blob, name = "download", opts) {
    if (typeof blob === "string") {
      if (corsEnabled(blob)) {
        download(blob, name, opts);
      } else {
        const a = document.createElement("a");
        a.href = blob;
        a.target = "_blank";
        setTimeout(function() {
          click(a);
        });
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name);
    }
  }
  function fileSaverSaveAs(blob, name, opts, popup) {
    popup = popup || open("", "_blank");
    if (popup) {
      popup.document.title = popup.document.body.innerText = "downloading...";
    }
    if (typeof blob === "string")
      return download(blob, name, opts);
    const force = blob.type === "application/octet-stream";
    const isSafari = /constructor/i.test(String(_global.HTMLElement)) || "safari" in _global;
    const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
    if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onloadend = function() {
        let url = reader.result;
        if (typeof url !== "string") {
          popup = null;
          throw new Error("Wrong reader.result type");
        }
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
        if (popup) {
          popup.location.href = url;
        } else {
          location.assign(url);
        }
        popup = null;
      };
      reader.readAsDataURL(blob);
    } else {
      const url = URL.createObjectURL(blob);
      if (popup)
        popup.location.assign(url);
      else
        location.href = url;
      popup = null;
      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 4e4);
    }
  }
  function toastMessage(message, type) {
    const piniaMessage = "🍍 " + message;
    if (typeof __VUE_DEVTOOLS_TOAST__ === "function") {
      __VUE_DEVTOOLS_TOAST__(piniaMessage, type);
    } else if (type === "error") {
      console.error(piniaMessage);
    } else if (type === "warn") {
      console.warn(piniaMessage);
    } else {
      console.log(piniaMessage);
    }
  }
  function isPinia(o) {
    return "_a" in o && "install" in o;
  }
  function checkClipboardAccess() {
    if (!("clipboard" in navigator)) {
      toastMessage(`Your browser doesn't support the Clipboard API`, "error");
      return true;
    }
  }
  function checkNotFocusedError(error) {
    if (error instanceof Error && error.message.toLowerCase().includes("document is not focused")) {
      toastMessage('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn");
      return true;
    }
    return false;
  }
  async function actionGlobalCopyState(pinia) {
    if (checkClipboardAccess())
      return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(pinia.state.value));
      toastMessage("Global state copied to clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to serialize the state. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalPasteState(pinia) {
    if (checkClipboardAccess())
      return;
    try {
      loadStoresState(pinia, JSON.parse(await navigator.clipboard.readText()));
      toastMessage("Global state pasted from clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to deserialize the state from clipboard. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalSaveState(pinia) {
    try {
      saveAs(new Blob([JSON.stringify(pinia.state.value)], {
        type: "text/plain;charset=utf-8"
      }), "pinia-state.json");
    } catch (error) {
      toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  let fileInput;
  function getFileOpener() {
    if (!fileInput) {
      fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
    }
    function openFile() {
      return new Promise((resolve, reject) => {
        fileInput.onchange = async () => {
          const files = fileInput.files;
          if (!files)
            return resolve(null);
          const file = files.item(0);
          if (!file)
            return resolve(null);
          return resolve({ text: await file.text(), file });
        };
        fileInput.oncancel = () => resolve(null);
        fileInput.onerror = reject;
        fileInput.click();
      });
    }
    return openFile;
  }
  async function actionGlobalOpenStateFile(pinia) {
    try {
      const open2 = getFileOpener();
      const result = await open2();
      if (!result)
        return;
      const { text, file } = result;
      loadStoresState(pinia, JSON.parse(text));
      toastMessage(`Global state imported from "${file.name}".`);
    } catch (error) {
      toastMessage(`Failed to import the state from JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  function loadStoresState(pinia, state) {
    for (const key in state) {
      const storeState = pinia.state.value[key];
      if (storeState) {
        Object.assign(storeState, state[key]);
      } else {
        pinia.state.value[key] = state[key];
      }
    }
  }
  function formatDisplay(display) {
    return {
      _custom: {
        display
      }
    };
  }
  const PINIA_ROOT_LABEL = "🍍 Pinia (root)";
  const PINIA_ROOT_ID = "_root";
  function formatStoreForInspectorTree(store) {
    return isPinia(store) ? {
      id: PINIA_ROOT_ID,
      label: PINIA_ROOT_LABEL
    } : {
      id: store.$id,
      label: store.$id
    };
  }
  function formatStoreForInspectorState(store) {
    if (isPinia(store)) {
      const storeNames = Array.from(store._s.keys());
      const storeMap = store._s;
      const state2 = {
        state: storeNames.map((storeId) => ({
          editable: true,
          key: storeId,
          value: store.state.value[storeId]
        })),
        getters: storeNames.filter((id) => storeMap.get(id)._getters).map((id) => {
          const store2 = storeMap.get(id);
          return {
            editable: false,
            key: id,
            value: store2._getters.reduce((getters, key) => {
              getters[key] = store2[key];
              return getters;
            }, {})
          };
        })
      };
      return state2;
    }
    const state = {
      state: Object.keys(store.$state).map((key) => ({
        editable: true,
        key,
        value: store.$state[key]
      }))
    };
    if (store._getters && store._getters.length) {
      state.getters = store._getters.map((getterName) => ({
        editable: false,
        key: getterName,
        value: store[getterName]
      }));
    }
    if (store._customProperties.size) {
      state.customProperties = Array.from(store._customProperties).map((key) => ({
        editable: true,
        key,
        value: store[key]
      }));
    }
    return state;
  }
  function formatEventData(events) {
    if (!events)
      return {};
    if (Array.isArray(events)) {
      return events.reduce((data, event) => {
        data.keys.push(event.key);
        data.operations.push(event.type);
        data.oldValue[event.key] = event.oldValue;
        data.newValue[event.key] = event.newValue;
        return data;
      }, {
        oldValue: {},
        keys: [],
        operations: [],
        newValue: {}
      });
    } else {
      return {
        operation: formatDisplay(events.type),
        key: formatDisplay(events.key),
        oldValue: events.oldValue,
        newValue: events.newValue
      };
    }
  }
  function formatMutationType(type) {
    switch (type) {
      case MutationType.direct:
        return "mutation";
      case MutationType.patchFunction:
        return "$patch";
      case MutationType.patchObject:
        return "$patch";
      default:
        return "unknown";
    }
  }
  let isTimelineActive = true;
  const componentStateTypes = [];
  const MUTATIONS_LAYER_ID = "pinia:mutations";
  const INSPECTOR_ID = "pinia";
  const { assign: assign$1 } = Object;
  const getStoreType = (id) => "🍍 " + id;
  function registerPiniaDevtools(app, pinia) {
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia 🍍",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app
    }, (api) => {
      if (typeof api.now !== "function") {
        toastMessage("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.");
      }
      api.addTimelineLayer({
        id: MUTATIONS_LAYER_ID,
        label: `Pinia 🍍`,
        color: 15064968
      });
      api.addInspector({
        id: INSPECTOR_ID,
        label: "Pinia 🍍",
        icon: "storage",
        treeFilterPlaceholder: "Search stores",
        actions: [
          {
            icon: "content_copy",
            action: () => {
              actionGlobalCopyState(pinia);
            },
            tooltip: "Serialize and copy the state"
          },
          {
            icon: "content_paste",
            action: async () => {
              await actionGlobalPasteState(pinia);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Replace the state with the content of your clipboard"
          },
          {
            icon: "save",
            action: () => {
              actionGlobalSaveState(pinia);
            },
            tooltip: "Save the state as a JSON file"
          },
          {
            icon: "folder_open",
            action: async () => {
              await actionGlobalOpenStateFile(pinia);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Import the state from a JSON file"
          }
        ],
        nodeActions: [
          {
            icon: "restore",
            tooltip: 'Reset the state (with "$reset")',
            action: (nodeId) => {
              const store = pinia._s.get(nodeId);
              if (!store) {
                toastMessage(`Cannot reset "${nodeId}" store because it wasn't found.`, "warn");
              } else if (typeof store.$reset !== "function") {
                toastMessage(`Cannot reset "${nodeId}" store because it doesn't have a "$reset" method implemented.`, "warn");
              } else {
                store.$reset();
                toastMessage(`Store "${nodeId}" reset.`);
              }
            }
          }
        ]
      });
      api.on.inspectComponent((payload, ctx) => {
        const proxy = payload.componentInstance && payload.componentInstance.proxy;
        if (proxy && proxy._pStores) {
          const piniaStores = payload.componentInstance.proxy._pStores;
          Object.values(piniaStores).forEach((store) => {
            payload.instanceData.state.push({
              type: getStoreType(store.$id),
              key: "state",
              editable: true,
              value: store._isOptionsAPI ? {
                _custom: {
                  value: vue.toRaw(store.$state),
                  actions: [
                    {
                      icon: "restore",
                      tooltip: "Reset the state of this store",
                      action: () => store.$reset()
                    }
                  ]
                }
              } : (
                // NOTE: workaround to unwrap transferred refs
                Object.keys(store.$state).reduce((state, key) => {
                  state[key] = store.$state[key];
                  return state;
                }, {})
              )
            });
            if (store._getters && store._getters.length) {
              payload.instanceData.state.push({
                type: getStoreType(store.$id),
                key: "getters",
                editable: false,
                value: store._getters.reduce((getters, key) => {
                  try {
                    getters[key] = store[key];
                  } catch (error) {
                    getters[key] = error;
                  }
                  return getters;
                }, {})
              });
            }
          });
        }
      });
      api.on.getInspectorTree((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          let stores = [pinia];
          stores = stores.concat(Array.from(pinia._s.values()));
          payload.rootNodes = (payload.filter ? stores.filter((store) => "$id" in store ? store.$id.toLowerCase().includes(payload.filter.toLowerCase()) : PINIA_ROOT_LABEL.toLowerCase().includes(payload.filter.toLowerCase())) : stores).map(formatStoreForInspectorTree);
        }
      });
      globalThis.$pinia = pinia;
      api.on.getInspectorState((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
          if (!inspectedStore) {
            return;
          }
          if (inspectedStore) {
            if (payload.nodeId !== PINIA_ROOT_ID)
              globalThis.$store = vue.toRaw(inspectedStore);
            payload.state = formatStoreForInspectorState(inspectedStore);
          }
        }
      });
      api.on.editInspectorState((payload, ctx) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
          if (!inspectedStore) {
            return toastMessage(`store "${payload.nodeId}" not found`, "error");
          }
          const { path } = payload;
          if (!isPinia(inspectedStore)) {
            if (path.length !== 1 || !inspectedStore._customProperties.has(path[0]) || path[0] in inspectedStore.$state) {
              path.unshift("$state");
            }
          } else {
            path.unshift("state");
          }
          isTimelineActive = false;
          payload.set(inspectedStore, path, payload.state.value);
          isTimelineActive = true;
        }
      });
      api.on.editComponentState((payload) => {
        if (payload.type.startsWith("🍍")) {
          const storeId = payload.type.replace(/^🍍\s*/, "");
          const store = pinia._s.get(storeId);
          if (!store) {
            return toastMessage(`store "${storeId}" not found`, "error");
          }
          const { path } = payload;
          if (path[0] !== "state") {
            return toastMessage(`Invalid path for store "${storeId}":
${path}
Only state can be modified.`);
          }
          path[0] = "$state";
          isTimelineActive = false;
          payload.set(store, path, payload.state.value);
          isTimelineActive = true;
        }
      });
    });
  }
  function addStoreToDevtools(app, store) {
    if (!componentStateTypes.includes(getStoreType(store.$id))) {
      componentStateTypes.push(getStoreType(store.$id));
    }
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia 🍍",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app,
      settings: {
        logStoreChanges: {
          label: "Notify about new/deleted stores",
          type: "boolean",
          defaultValue: true
        }
        // useEmojis: {
        //   label: 'Use emojis in messages ⚡️',
        //   type: 'boolean',
        //   defaultValue: true,
        // },
      }
    }, (api) => {
      const now2 = typeof api.now === "function" ? api.now.bind(api) : Date.now;
      store.$onAction(({ after, onError, name, args }) => {
        const groupId = runningActionId++;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🛫 " + name,
            subtitle: "start",
            data: {
              store: formatDisplay(store.$id),
              action: formatDisplay(name),
              args
            },
            groupId
          }
        });
        after((result) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              title: "🛬 " + name,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name),
                args,
                result
              },
              groupId
            }
          });
        });
        onError((error) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              logType: "error",
              title: "💥 " + name,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name),
                args,
                error
              },
              groupId
            }
          });
        });
      }, true);
      store._customProperties.forEach((name) => {
        vue.watch(() => vue.unref(store[name]), (newValue, oldValue) => {
          api.notifyComponentUpdate();
          api.sendInspectorState(INSPECTOR_ID);
          if (isTimelineActive) {
            api.addTimelineEvent({
              layerId: MUTATIONS_LAYER_ID,
              event: {
                time: now2(),
                title: "Change",
                subtitle: name,
                data: {
                  newValue,
                  oldValue
                },
                groupId: activeAction
              }
            });
          }
        }, { deep: true });
      });
      store.$subscribe(({ events, type }, state) => {
        api.notifyComponentUpdate();
        api.sendInspectorState(INSPECTOR_ID);
        if (!isTimelineActive)
          return;
        const eventData = {
          time: now2(),
          title: formatMutationType(type),
          data: assign$1({ store: formatDisplay(store.$id) }, formatEventData(events)),
          groupId: activeAction
        };
        if (type === MutationType.patchFunction) {
          eventData.subtitle = "⤵️";
        } else if (type === MutationType.patchObject) {
          eventData.subtitle = "🧩";
        } else if (events && !Array.isArray(events)) {
          eventData.subtitle = events.type;
        }
        if (events) {
          eventData.data["rawEvent(s)"] = {
            _custom: {
              display: "DebuggerEvent",
              type: "object",
              tooltip: "raw DebuggerEvent[]",
              value: events
            }
          };
        }
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: eventData
        });
      }, { detached: true, flush: "sync" });
      const hotUpdate = store._hotUpdate;
      store._hotUpdate = vue.markRaw((newStore) => {
        hotUpdate(newStore);
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🔥 " + store.$id,
            subtitle: "HMR update",
            data: {
              store: formatDisplay(store.$id),
              info: formatDisplay(`HMR update`)
            }
          }
        });
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
      });
      const { $dispose } = store;
      store.$dispose = () => {
        $dispose();
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
        api.getSettings().logStoreChanges && toastMessage(`Disposed "${store.$id}" store 🗑`);
      };
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
      api.getSettings().logStoreChanges && toastMessage(`"${store.$id}" store installed 🆕`);
    });
  }
  let runningActionId = 0;
  let activeAction;
  function patchActionForGrouping(store, actionNames, wrapWithProxy) {
    const actions = actionNames.reduce((storeActions, actionName) => {
      storeActions[actionName] = vue.toRaw(store)[actionName];
      return storeActions;
    }, {});
    for (const actionName in actions) {
      store[actionName] = function() {
        const _actionId = runningActionId;
        const trackedStore = wrapWithProxy ? new Proxy(store, {
          get(...args) {
            activeAction = _actionId;
            return Reflect.get(...args);
          },
          set(...args) {
            activeAction = _actionId;
            return Reflect.set(...args);
          }
        }) : store;
        activeAction = _actionId;
        const retValue = actions[actionName].apply(trackedStore, arguments);
        activeAction = void 0;
        return retValue;
      };
    }
  }
  function devtoolsPlugin({ app, store, options }) {
    if (store.$id.startsWith("__hot:")) {
      return;
    }
    store._isOptionsAPI = !!options.state;
    if (!store._p._testing) {
      patchActionForGrouping(store, Object.keys(options.actions), store._isOptionsAPI);
      const originalHotUpdate = store._hotUpdate;
      vue.toRaw(store)._hotUpdate = function(newStore) {
        originalHotUpdate.apply(this, arguments);
        patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions), !!store._isOptionsAPI);
      };
    }
    addStoreToDevtools(
      app,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      store
    );
  }
  function createPinia() {
    const scope = vue.effectScope(true);
    const state = scope.run(() => vue.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia = vue.markRaw({
      install(app) {
        setActivePinia(pinia);
        {
          pinia._a = app;
          app.provide(piniaSymbol, pinia);
          app.config.globalProperties.$pinia = pinia;
          if (IS_CLIENT) {
            registerPiniaDevtools(app, pinia);
          }
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && true) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    if (IS_CLIENT && typeof Proxy !== "undefined") {
      pinia.use(devtoolsPlugin);
    }
    return pinia;
  }
  function patchObject(newState, oldState) {
    for (const key in oldState) {
      const subPatch = oldState[key];
      if (!(key in newState)) {
        continue;
      }
      const targetValue = newState[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        newState[key] = patchObject(targetValue, subPatch);
      } else {
        {
          newState[key] = subPatch;
        }
      }
    }
    return newState;
  }
  const noop = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && vue.getCurrentScope()) {
      vue.onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn) => fn();
  const ACTION_MARKER = Symbol();
  const ACTION_NAME = Symbol();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    } else if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = Symbol("pinia:skipHydration");
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o) {
    return !!(vue.isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia.state.value[id];
    let store;
    function setup() {
      if (!initialState && !hot) {
        {
          pinia.state.value[id] = state ? state() : {};
        }
      }
      const localState = hot ? (
        // use ref() to unwrap refs inside state TODO: check if this is still necessary
        vue.toRefs(vue.ref(state ? state() : {}).value)
      ) : vue.toRefs(pinia.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        if (name in localState) {
          console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`);
        }
        computedGetters[name] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia);
          const store2 = pinia._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    if (!pinia._e.active) {
      throw new Error("Pinia destroyed");
    }
    const $subscribeOptions = { deep: true };
    {
      $subscribeOptions.onTrigger = (event) => {
        if (isListening) {
          debuggerEvents = event;
        } else if (isListening == false && !store._hotUpdating) {
          if (Array.isArray(debuggerEvents)) {
            debuggerEvents.push(event);
          } else {
            console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.");
          }
        }
      };
    }
    let isListening;
    let isSyncListening;
    let subscriptions = [];
    let actionSubscriptions = [];
    let debuggerEvents;
    const initialState = pinia.state.value[$id];
    if (!isOptionsStore && !initialState && !hot) {
      {
        pinia.state.value[$id] = {};
      }
    }
    const hotState = vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      {
        debuggerEvents = [];
      }
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      vue.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
      /* istanbul ignore next */
      () => {
        throw new Error(`🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().`);
      }
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia._s.delete($id);
    }
    const action = (fn, name = "") => {
      if (ACTION_MARKER in fn) {
        fn[ACTION_NAME] = name;
        return fn;
      }
      const wrappedAction = function() {
        setActivePinia(pinia);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name: wrappedAction[ACTION_NAME],
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = fn.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
      wrappedAction[ACTION_MARKER] = true;
      wrappedAction[ACTION_NAME] = name;
      return wrappedAction;
    };
    const _hmrPayload = /* @__PURE__ */ vue.markRaw({
      actions: {},
      getters: {},
      state: [],
      hotState
    });
    const partialStore = {
      _p: pinia,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = vue.reactive(assign(
      {
        _hmrPayload,
        _customProperties: vue.markRaw(/* @__PURE__ */ new Set())
        // devtools custom properties
      },
      partialStore
      // must be added later
      // setupStore
    ));
    pinia._s.set($id, store);
    const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
    const setupStore = runWithContext(() => pinia._e.run(() => (scope = vue.effectScope()).run(() => setup({ action }))));
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (hot) {
          set(hotState.value, key, vue.toRef(setupStore, key));
        } else if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia.state.value[$id][key] = prop;
          }
        }
        {
          _hmrPayload.state.push(key);
        }
      } else if (typeof prop === "function") {
        const actionValue = hot ? prop : action(prop, key);
        {
          setupStore[key] = actionValue;
        }
        {
          _hmrPayload.actions[key] = prop;
        }
        optionsForPlugin.actions[key] = prop;
      } else {
        if (isComputed(prop)) {
          _hmrPayload.getters[key] = isOptionsStore ? (
            // @ts-expect-error
            options.getters[key]
          ) : prop;
          if (IS_CLIENT) {
            const getters = setupStore._getters || // @ts-expect-error: same
            (setupStore._getters = vue.markRaw([]));
            getters.push(key);
          }
        }
      }
    }
    {
      assign(store, setupStore);
      assign(vue.toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => hot ? hotState.value : pinia.state.value[$id],
      set: (state) => {
        if (hot) {
          throw new Error("cannot set hotState");
        }
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    {
      store._hotUpdate = vue.markRaw((newStore) => {
        store._hotUpdating = true;
        newStore._hmrPayload.state.forEach((stateKey) => {
          if (stateKey in store.$state) {
            const newStateTarget = newStore.$state[stateKey];
            const oldStateSource = store.$state[stateKey];
            if (typeof newStateTarget === "object" && isPlainObject(newStateTarget) && isPlainObject(oldStateSource)) {
              patchObject(newStateTarget, oldStateSource);
            } else {
              newStore.$state[stateKey] = oldStateSource;
            }
          }
          set(store, stateKey, vue.toRef(newStore.$state, stateKey));
        });
        Object.keys(store.$state).forEach((stateKey) => {
          if (!(stateKey in newStore.$state)) {
            del(store, stateKey);
          }
        });
        isListening = false;
        isSyncListening = false;
        pinia.state.value[$id] = vue.toRef(newStore._hmrPayload, "hotState");
        isSyncListening = true;
        vue.nextTick().then(() => {
          isListening = true;
        });
        for (const actionName in newStore._hmrPayload.actions) {
          const actionFn = newStore[actionName];
          set(store, actionName, action(actionFn, actionName));
        }
        for (const getterName in newStore._hmrPayload.getters) {
          const getter = newStore._hmrPayload.getters[getterName];
          const getterValue = isOptionsStore ? (
            // special handling of options api
            vue.computed(() => {
              setActivePinia(pinia);
              return getter.call(store, store);
            })
          ) : getter;
          set(store, getterName, getterValue);
        }
        Object.keys(store._hmrPayload.getters).forEach((key) => {
          if (!(key in newStore._hmrPayload.getters)) {
            del(store, key);
          }
        });
        Object.keys(store._hmrPayload.actions).forEach((key) => {
          if (!(key in newStore._hmrPayload.actions)) {
            del(store, key);
          }
        });
        store._hmrPayload = newStore._hmrPayload;
        store._getters = newStore._getters;
        store._hotUpdating = false;
      });
    }
    if (IS_CLIENT) {
      const nonEnumerable = {
        writable: true,
        configurable: true,
        // avoid warning on devtools trying to display this property
        enumerable: false
      };
      ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p) => {
        Object.defineProperty(store, p, assign({ value: store[p] }, nonEnumerable));
      });
    }
    pinia._p.forEach((extender) => {
      if (IS_CLIENT) {
        const extensions = scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        }));
        Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
        assign(store, extensions);
      } else {
        assign(store, scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        })));
      }
    });
    if (store.$state && typeof store.$state === "object" && typeof store.$state.constructor === "function" && !store.$state.constructor.toString().includes("[native code]")) {
      console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${store.$id}".`);
    }
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
      if (typeof id !== "string") {
        throw new Error(`[🍍]: "defineStore()" must be passed a store id as its first argument.`);
      }
    }
    function useStore(pinia, hot) {
      const hasContext = vue.hasInjectionContext();
      pinia = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia || (hasContext ? vue.inject(piniaSymbol, null) : null);
      if (pinia)
        setActivePinia(pinia);
      if (!activePinia) {
        throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
This will fail in production.`);
      }
      pinia = activePinia;
      if (!pinia._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia);
        } else {
          createOptionsStore(id, options, pinia);
        }
        {
          useStore._pinia = pinia;
        }
      }
      const store = pinia._s.get(id);
      if (hot) {
        const hotId = "__hot:" + id;
        const newStore = isSetupStore ? createSetupStore(hotId, setup, options, pinia, true) : createOptionsStore(hotId, assign({}, options), pinia, true);
        hot._hotUpdate(newStore);
        delete pinia.state.value[hotId];
        pinia._s.delete(hotId);
      }
      if (IS_CLIENT) {
        const currentInstance = vue.getCurrentInstance();
        if (currentInstance && currentInstance.proxy && // avoid adding stores that are just built for hot module replacement
        !hot) {
          const vm = currentInstance.proxy;
          const cache = "_pStores" in vm ? vm._pStores : vm._pStores = {};
          cache[id] = store;
        }
      }
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  const useAppStore = /* @__PURE__ */ defineStore("app", () => {
    const isLoading = vue.ref(false);
    const loadingMessage = vue.ref("");
    const loadingCount = vue.ref(0);
    const toast = vue.ref(null);
    const toastTimer = vue.ref(null);
    const modal = vue.ref(null);
    const modalVisible = vue.ref(false);
    const actionSheet = vue.ref(null);
    const actionSheetVisible = vue.ref(false);
    const networkType = vue.ref("unknown");
    const isConnected = vue.ref(true);
    const pageLoading = vue.ref({});
    const pullDownRefreshing = vue.ref(false);
    const safeAreaInsets = vue.ref({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    });
    const systemInfo = vue.ref(null);
    const platform = vue.ref("unknown");
    const isH5 = vue.computed(() => {
      const sys = systemInfo.value;
      if (!sys)
        return false;
      const uniPlatform = sys.uniPlatform || "";
      return uniPlatform === "h5" || typeof window !== "undefined";
    });
    const isPageLoading = vue.computed(
      () => Object.values(pageLoading.value).some((loading) => loading)
    );
    const hasSafeArea = vue.computed(
      () => safeAreaInsets.value.bottom > 0
    );
    const showLoading = (options = {}) => {
      loadingCount.value += 1;
      isLoading.value = true;
      loadingMessage.value = options.message || "加载中...";
      uni.showLoading({
        title: loadingMessage.value,
        mask: options.mask !== false
      });
    };
    const hideLoading = (force = false) => {
      if (force) {
        loadingCount.value = 0;
      } else {
        loadingCount.value = Math.max(0, loadingCount.value - 1);
      }
      if (loadingCount.value === 0) {
        isLoading.value = false;
        loadingMessage.value = "";
        uni.hideLoading();
      }
    };
    const showToast = (options) => {
      const opts = typeof options === "string" ? { message: options } : options;
      if (toastTimer.value) {
        clearTimeout(toastTimer.value);
      }
      toast.value = {
        message: opts.message,
        type: opts.type || "info",
        duration: opts.duration || 2e3,
        icon: opts.icon,
        position: opts.position || "center"
      };
      uni.showToast({
        title: opts.message,
        icon: opts.type === "success" ? "success" : opts.type === "error" ? "error" : "none",
        duration: opts.duration || 2e3,
        position: opts.position || "center"
      });
      toastTimer.value = setTimeout(() => {
        toast.value = null;
        toastTimer.value = null;
      }, opts.duration || 2e3);
    };
    const hideToast = () => {
      if (toastTimer.value) {
        clearTimeout(toastTimer.value);
        toastTimer.value = null;
      }
      toast.value = null;
      uni.hideToast();
    };
    const showModal = (options) => {
      return new Promise((resolve) => {
        modal.value = {
          ...options,
          confirmText: options.confirmText || "确定",
          cancelText: options.cancelText || "取消",
          showCancel: options.showCancel !== false,
          onConfirm: () => {
            modalVisible.value = false;
            modal.value = null;
            resolve(true);
          },
          onCancel: () => {
            modalVisible.value = false;
            modal.value = null;
            resolve(false);
          }
        };
        modalVisible.value = true;
      });
    };
    const hideModal = () => {
      modalVisible.value = false;
      modal.value = null;
    };
    const showActionSheet = (options) => {
      return new Promise((resolve) => {
        actionSheet.value = {
          ...options,
          cancelText: options.cancelText || "取消",
          onSelect: (value) => {
            actionSheetVisible.value = false;
            actionSheet.value = null;
            resolve(value);
          },
          onCancel: () => {
            actionSheetVisible.value = false;
            actionSheet.value = null;
            resolve(null);
          }
        };
        actionSheetVisible.value = true;
      });
    };
    const hideActionSheet = () => {
      actionSheetVisible.value = false;
      actionSheet.value = null;
    };
    const setPageLoading = (pageKey, loading) => {
      pageLoading.value[pageKey] = loading;
    };
    const setPullDownRefreshing = (refreshing) => {
      pullDownRefreshing.value = refreshing;
    };
    const updateNetworkStatus = () => {
      uni.getNetworkType({
        success: (res) => {
          networkType.value = res.networkType;
          isConnected.value = res.networkType !== "none";
        }
      });
    };
    const updateSafeArea = () => {
      var _a, _b, _c, _d;
      const sys = uni.getSystemInfoSync();
      systemInfo.value = sys;
      platform.value = sys.uniPlatform || sys.platform || "unknown";
      safeAreaInsets.value = {
        top: ((_a = sys.safeAreaInsets) == null ? void 0 : _a.top) || 0,
        bottom: ((_b = sys.safeAreaInsets) == null ? void 0 : _b.bottom) || 0,
        left: ((_c = sys.safeAreaInsets) == null ? void 0 : _c.left) || 0,
        right: ((_d = sys.safeAreaInsets) == null ? void 0 : _d.right) || 0
      };
    };
    const alert = (message, title) => {
      return showModal({
        title: title || "提示",
        content: message,
        showCancel: false
      });
    };
    const confirm = (message, title) => {
      return showModal({
        title: title || "确认",
        content: message,
        showCancel: true
      });
    };
    const success = (message) => {
      showToast({ message, type: "success" });
    };
    const error = (message) => {
      showToast({ message, type: "error" });
    };
    const warning = (message) => {
      showToast({ message, type: "warning" });
    };
    const info = (message) => {
      showToast({ message, type: "info" });
    };
    const init = () => {
      updateNetworkStatus();
      updateSafeArea();
      uni.onNetworkStatusChange((res) => {
        networkType.value = res.networkType;
        isConnected.value = res.isConnected;
      });
    };
    init();
    return {
      isLoading,
      loadingMessage,
      loadingCount,
      toast,
      modal,
      modalVisible,
      actionSheet,
      actionSheetVisible,
      networkType,
      isConnected,
      pageLoading,
      pullDownRefreshing,
      safeAreaInsets,
      systemInfo,
      platform,
      isH5,
      isPageLoading,
      hasSafeArea,
      showLoading,
      hideLoading,
      showToast,
      hideToast,
      showModal,
      hideModal,
      showActionSheet,
      hideActionSheet,
      setPageLoading,
      setPullDownRefreshing,
      updateNetworkStatus,
      updateSafeArea,
      alert,
      confirm,
      success,
      error,
      warning,
      info,
      init
    };
  });
  const _sfc_main$10 = /* @__PURE__ */ vue.defineComponent({
    __name: "TheTabbar",
    props: {
      current: { type: String, required: false, default: "index" }
    },
    emits: ["change", "centerClick"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const appStore = useAppStore();
      const currentIndex = vue.computed(() => {
        return tabList.value.findIndex((item) => item.name === props.current);
      });
      const safeAreaBottom = vue.computed(() => appStore.safeAreaInsets.bottom);
      const tabList = vue.ref([
        {
          pagePath: "pages/index/index",
          text: "推荐",
          selectedText: "推荐",
          icon: "home",
          selectedIcon: "home",
          name: "index"
        },
        {
          pagePath: "pages/follow/index",
          text: "关注",
          selectedText: "关注",
          icon: "star",
          selectedIcon: "star",
          name: "follow"
        },
        {
          pagePath: "",
          text: "",
          icon: "",
          isCenter: true,
          name: "publish"
        },
        {
          pagePath: "pages/message/index",
          text: "消息",
          selectedText: "消息",
          icon: "bell",
          selectedIcon: "bell",
          badge: 0,
          name: "message"
        },
        {
          pagePath: "pages/my/index",
          text: "我的",
          selectedText: "我的",
          icon: "user",
          selectedIcon: "user",
          name: "my"
        }
      ]);
      const handleClick = (index, item) => {
        if (item.isCenter) {
          emit("centerClick");
          return;
        }
        if (currentIndex.value === index)
          return;
        emit("change", index, item);
        if (item.pagePath) {
          uni.switchTab({
            url: "/" + item.pagePath
          });
        }
      };
      const updateBadge = (name, badge) => {
        const item = tabList.value.find((t) => t.name === name);
        if (item) {
          item.badge = badge;
        }
      };
      __expose({
        updateBadge
      });
      const __returned__ = { props, emit, appStore, currentIndex, safeAreaBottom, tabList, handleClick, updateBadge };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$10(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_UiIcon = resolveEasycom(vue.resolveDynamicComponent("UiIcon"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "the-tabbar",
        style: vue.normalizeStyle({ paddingBottom: $setup.safeAreaBottom + "px" })
      },
      [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.tabList, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: vue.normalizeClass(["tabbar-item", { "is-active": $setup.currentIndex === index, "is-center": item.isCenter }]),
              onClick: ($event) => $setup.handleClick(index, item)
            }, [
              item.isCenter ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "center-button"
              }, [
                vue.createElementVNode("view", { class: "center-icon-wrapper" }, [
                  vue.createVNode(_component_UiIcon, {
                    name: "plus",
                    ":size": 40,
                    color: "#FFFFFF"
                  })
                ])
              ])) : (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                { key: 1 },
                [
                  vue.createElementVNode("view", { class: "tabbar-icon" }, [
                    vue.createVNode(_component_UiIcon, {
                      name: $setup.currentIndex === index ? item.selectedIcon : item.icon,
                      size: item.iconSize || 22
                    }, null, 8, ["name", "size"]),
                    item.badge && item.badge > 0 ? (vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        key: 0,
                        class: "tabbar-badge"
                      },
                      vue.toDisplayString(item.badge > 99 ? "99+" : item.badge),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true)
                  ]),
                  vue.createElementVNode(
                    "text",
                    { class: "tabbar-text" },
                    vue.toDisplayString($setup.currentIndex === index ? item.selectedText || item.text : item.text),
                    1
                    /* TEXT */
                  )
                ],
                64
                /* STABLE_FRAGMENT */
              ))
            ], 10, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        vue.createElementVNode("view", { class: "tabbar-safe-line" })
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$10, [["render", _sfc_render$10], ["__scopeId", "data-v-15009eb6"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/components/layout/TheTabbar.vue"]]);
  const _sfc_main$$ = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const appStore = useAppStore();
      const keyword = vue.ref("");
      const activeTab = vue.ref(0);
      const loading = vue.ref(false);
      const safeAreaTop = vue.computed(() => appStore.safeAreaInsets.top);
      const safeAreaBottom = vue.computed(() => appStore.safeAreaInsets.bottom);
      const isH5 = vue.computed(() => appStore.isH5);
      const headerExtraTop = vue.computed(() => isH5.value ? 12 : 0);
      const headerHeight = vue.ref(0);
      const scrollHeight = vue.ref(0);
      const calcLayout = () => {
        const systemInfo = uni.getSystemInfoSync();
        const screenWidth = systemInfo.screenWidth || 375;
        const rpxToPx = (rpx) => rpx * screenWidth / 750;
        const tabbarHeight = rpxToPx(100);
        const query = uni.createSelectorQuery();
        query.select(".fixed-header").boundingClientRect((rect) => {
          if (rect && rect.height > 0) {
            headerHeight.value = rect.height;
            scrollHeight.value = systemInfo.windowHeight - rect.height - tabbarHeight - safeAreaBottom.value;
          }
        }).exec();
      };
      onReady(() => {
        vue.nextTick(() => {
          calcLayout();
        });
      });
      vue.onMounted(() => {
        const systemInfo = uni.getSystemInfoSync();
        const screenWidth = systemInfo.screenWidth || 375;
        const rpxToPx = (rpx) => rpx * screenWidth / 750;
        const estimatedHeader = rpxToPx(200) + safeAreaTop.value + headerExtraTop.value;
        const tabbarHeight = rpxToPx(100);
        headerHeight.value = estimatedHeader;
        scrollHeight.value = systemInfo.windowHeight - estimatedHeader - tabbarHeight - safeAreaBottom.value;
      });
      const categoryList = vue.ref([
        { name: "推荐" },
        { name: "手机" },
        { name: "电脑" },
        { name: "平板" },
        { name: "耳机" },
        { name: "相机" },
        { name: "游戏" },
        { name: "配件" }
      ]);
      const bannerList = [
        { image: "https://picsum.photos/100/100?random=u1", title: "新品上市", link: "/pages/product/1" },
        { image: "https://picsum.photos/100/100?random=u2", title: "限时特惠", link: "/pages/product/2" }
      ];
      const goodsList = vue.ref([
        {
          id: 1,
          cover: "https://picsum.photos/400/400?random=1",
          title: "iPhone 15 Pro Max 256GB 钛金属",
          price: 7999,
          sales: 128,
          tags: ["99新", "在保"],
          userAvatar: "https://picsum.photos/100/100?random=u1",
          userName: "数码达人",
          likeCount: 128
        },
        {
          id: 2,
          cover: "https://picsum.photos/400/400?random=2",
          title: "MacBook Pro 14寸 M3芯片",
          price: 12999,
          sales: 56,
          tags: ["全新未拆", "官方质保"],
          userAvatar: "https://picsum.photos/100/100?random=u2",
          userName: "科技博主",
          likeCount: 256
        },
        {
          id: 3,
          cover: "https://picsum.photos/400/400?random=3",
          title: "iPad Pro 12.9寸 256G WiFi版",
          price: 6999,
          sales: 89,
          tags: ["95新", "送配件"],
          userAvatar: "https://picsum.photos/100/100?random=u3",
          userName: "苹果控",
          likeCount: 89
        },
        {
          id: 4,
          cover: "https://picsum.photos/400/400?random=4",
          title: "AirPods Pro 第二代",
          price: 1399,
          sales: 256,
          tags: ["全新", "正品"],
          userAvatar: "https://picsum.photos/100/100?random=u4",
          userName: "耳机控",
          likeCount: 256
        },
        {
          id: 5,
          cover: "https://picsum.photos/400/400?random=5",
          title: "Sony WH-1000XM5 降噪耳机",
          price: 2199,
          sales: 78,
          tags: ["9成新", "箱说全"],
          userAvatar: "https://picsum.photos/100/100?random=u5",
          userName: "音乐发烧友",
          likeCount: 78
        },
        {
          id: 6,
          cover: "https://picsum.photos/400/400?random=6",
          title: "Nintendo Switch OLED 续航版",
          price: 1899,
          sales: 167,
          tags: ["99新", "双系统"],
          userAvatar: "https://picsum.photos/100/100?random=u6",
          userName: "游戏玩家",
          likeCount: 167
        },
        {
          id: 7,
          cover: "https://picsum.photos/400/400?random=7",
          title: "佳能 EOS R6 Mark II 机身",
          price: 15999,
          sales: 23,
          tags: ["95新", "国行"],
          userAvatar: "https://picsum.photos/100/100?random=u7",
          userName: "摄影师老李",
          likeCount: 23
        },
        {
          id: 8,
          cover: "https://picsum.photos/400/400?random=8",
          title: "ROG 游戏本 魔霸7 Plus",
          price: 11999,
          sales: 45,
          tags: ["全新未拆", "学生优惠"],
          userAvatar: "https://picsum.photos/100/100?random=u8",
          userName: "电竞达人",
          likeCount: 45
        },
        {
          id: 9,
          cover: "https://picsum.photos/400/400?random=9",
          title: "Apple Watch Series 9 45mm",
          price: 2899,
          sales: 198,
          tags: ["GPS", "全新"],
          userAvatar: "https://picsum.photos/100/100?random=u9",
          userName: "智能穿戴",
          likeCount: 198
        },
        {
          id: 10,
          cover: "https://picsum.photos/400/400?random=10",
          title: "三星 Galaxy S23 Ultra 512G",
          price: 5999,
          sales: 67,
          tags: ["99新", "在保"],
          userAvatar: "https://picsum.photos/100/100?random=u10",
          userName: "安卓粉",
          likeCount: 67
        },
        {
          id: 11,
          cover: "https://picsum.photos/400/400?random=11",
          title: "小米 13 Ultra 256G",
          price: 4599,
          sales: 112,
          tags: ["95新", "送碎屏险"],
          userAvatar: "https://picsum.photos/100/100?random=u11",
          userName: "米粉一枚",
          likeCount: 112
        },
        {
          id: 12,
          cover: "https://picsum.photos/400/400?random=12",
          title: "华为 Mate 60 Pro 512G",
          price: 6999,
          sales: 234,
          tags: ["全新未拆", "官方正品"],
          userAvatar: "https://picsum.photos/100/100?random=u12",
          userName: "华为铁粉",
          likeCount: 234
        }
      ]);
      const goSearch = () => {
        uni.navigateTo({ url: "/pages-sub/trade/search/index" });
      };
      const goDetail = (item) => {
        uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.id}` });
      };
      const goUser = (item) => {
        uni.navigateTo({ url: `/pages-sub/content/user/index?id=${item.userId}` });
      };
      const onBannerClick = ({ item, index }) => {
        if (item.link) {
          uni.navigateTo({ url: item.link });
        }
      };
      const loadMore = () => {
        if (loading.value)
          return;
        loading.value = true;
        setTimeout(() => {
          const newList = goodsList.value.map((item) => ({
            ...item,
            id: item.id + goodsList.value.length,
            price: Math.floor(Math.random() * 1e4) + 1e3
          }));
          goodsList.value = [...goodsList.value, ...newList];
          loading.value = false;
        }, 1e3);
      };
      const __returned__ = { appStore, keyword, activeTab, loading, safeAreaTop, safeAreaBottom, isH5, headerExtraTop, headerHeight, scrollHeight, calcLayout, categoryList, bannerList, goodsList, goSearch, goDetail, goUser, onBannerClick, loadMore };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$$(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_search = vue.resolveComponent("ui-search");
    const _component_ui_tabs = vue.resolveComponent("ui-tabs");
    const _component_ui_swiper = vue.resolveComponent("ui-swiper");
    const _component_ui_goods_card = vue.resolveComponent("ui-goods-card");
    const _component_ui_waterfalls = vue.resolveComponent("ui-waterfalls");
    const _component_ui_divider = vue.resolveComponent("ui-divider");
    const _component_TheTabbar = resolveEasycom(vue.resolveDynamicComponent("TheTabbar"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "index-page" }, [
      vue.createElementVNode(
        "view",
        {
          class: "fixed-header",
          style: vue.normalizeStyle({ paddingTop: $setup.safeAreaTop + $setup.headerExtraTop + "px" })
        },
        [
          vue.createElementVNode("view", { class: "search-bar" }, [
            vue.createVNode(_component_ui_search, {
              modelValue: $setup.keyword,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.keyword = $event),
              placeholder: "搜索数码产品型号...",
              disabled: true,
              onClick: $setup.goSearch
            }, null, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { class: "category-tabs" }, [
            vue.createVNode(_component_ui_tabs, {
              modelValue: $setup.activeTab,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.activeTab = $event),
              list: $setup.categoryList,
              type: "capsule"
            }, null, 8, ["modelValue", "list"])
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "page-content",
          style: vue.normalizeStyle({ paddingTop: $setup.headerHeight + "px" })
        },
        [
          vue.createElementVNode(
            "scroll-view",
            {
              "scroll-y": "",
              class: "goods-scroll",
              style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" }),
              onScrolltolower: $setup.loadMore
            },
            [
              vue.createElementVNode("view", { class: "swiper" }, [
                vue.createVNode(_component_ui_swiper, {
                  list: $setup.bannerList,
                  height: "360rpx",
                  onClick: $setup.onBannerClick
                })
              ]),
              vue.createElementVNode("view", { class: "goods-list" }, [
                vue.createVNode(_component_ui_waterfalls, {
                  list: $setup.goodsList,
                  columns: 2,
                  gap: 12,
                  onClick: $setup.goDetail
                }, {
                  item: vue.withCtx(({ item }) => [
                    vue.createVNode(_component_ui_goods_card, {
                      data: item,
                      mode: "waterfall",
                      onClick: $setup.goDetail,
                      onUserClick: $setup.goUser
                    }, null, 8, ["data"])
                  ]),
                  _: 1
                  /* STABLE */
                }, 8, ["list"])
              ]),
              $setup.goodsList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "load-more"
              }, [
                vue.createVNode(_component_ui_divider, {
                  text: $setup.loading ? "加载中..." : "上拉加载更多"
                }, null, 8, ["text"])
              ])) : vue.createCommentVNode("v-if", true)
            ],
            36
            /* STYLE, NEED_HYDRATION */
          )
        ],
        4
        /* STYLE */
      ),
      vue.createVNode(_component_TheTabbar, { current: "index" })
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$$, [["render", _sfc_render$$], ["__scopeId", "data-v-83a5a03c"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages/index/index.vue"]]);
  function usePageLayout(options = {}) {
    const {
      hasTabbar = false,
      hasSubNavbar = false,
      headerSelector = ".page-header",
      headerEstimatedHeight = 88
    } = options;
    const appStore = useAppStore();
    const safeAreaTop = vue.computed(() => appStore.safeAreaInsets.top);
    const safeAreaBottom = vue.computed(() => appStore.safeAreaInsets.bottom);
    const isH5 = vue.computed(() => appStore.isH5);
    const headerExtraTop = vue.computed(() => isH5.value ? 12 : 0);
    const headerHeight = vue.ref(0);
    const scrollHeight = vue.ref(0);
    const rpxToPx = (rpx) => {
      const systemInfo = uni.getSystemInfoSync();
      const screenWidth = systemInfo.screenWidth || 375;
      return rpx * screenWidth / 750;
    };
    const calcLayout = () => {
      const systemInfo = uni.getSystemInfoSync();
      const tabbarHeight = hasTabbar ? rpxToPx(100) : 0;
      if (hasSubNavbar) {
        const navBarHeight = 44;
        const totalNavHeight = safeAreaTop.value + navBarHeight;
        headerHeight.value = totalNavHeight;
        scrollHeight.value = systemInfo.windowHeight - totalNavHeight - tabbarHeight - safeAreaBottom.value;
        return;
      }
      const query = uni.createSelectorQuery();
      query.select(headerSelector).boundingClientRect((rect) => {
        if (rect && rect.height > 0) {
          headerHeight.value = rect.height;
          scrollHeight.value = systemInfo.windowHeight - rect.height - tabbarHeight - safeAreaBottom.value;
        }
      }).exec();
    };
    const initLayout = () => {
      const systemInfo = uni.getSystemInfoSync();
      const tabbarHeight = hasTabbar ? rpxToPx(100) : 0;
      if (hasSubNavbar) {
        const navBarHeight = 44;
        const totalNavHeight = safeAreaTop.value + navBarHeight;
        headerHeight.value = totalNavHeight;
        scrollHeight.value = systemInfo.windowHeight - totalNavHeight - tabbarHeight - safeAreaBottom.value;
        return;
      }
      const estimatedHeader = rpxToPx(headerEstimatedHeight) + safeAreaTop.value + headerExtraTop.value;
      headerHeight.value = estimatedHeader;
      scrollHeight.value = systemInfo.windowHeight - estimatedHeader - tabbarHeight - safeAreaBottom.value;
    };
    vue.onMounted(() => {
      initLayout();
    });
    onReady(() => {
      vue.nextTick(() => {
        calcLayout();
      });
    });
    return {
      safeAreaTop,
      safeAreaBottom,
      isH5,
      headerExtraTop,
      headerHeight,
      scrollHeight,
      rpxToPx,
      calcLayout,
      initLayout
    };
  }
  const _sfc_main$_ = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaTop, headerExtraTop, headerHeight, scrollHeight } = usePageLayout({
        hasTabbar: true,
        headerSelector: ".page-header",
        headerEstimatedHeight: 120
      });
      const loading = vue.ref(false);
      const postList = vue.ref([
        {
          id: 1,
          cover: "https://picsum.photos/400/400?random=101",
          title: "iPhone 15 Pro 深度测评：性能与影像全面升级",
          userName: "数码达人",
          userAvatar: "https://picsum.photos/100/100?random=1",
          likeCount: 128,
          isLiked: false,
          isVideo: false
        },
        {
          id: 2,
          cover: "https://picsum.photos/400/500?random=102",
          title: "MacBook Pro M3 开箱体验：性能怪兽来了",
          userName: "科技博主",
          userAvatar: "https://picsum.photos/100/100?random=2",
          likeCount: 256,
          isLiked: true,
          isVideo: false
        },
        {
          id: 3,
          cover: "https://picsum.photos/400/400?random=103",
          title: "AirPods Pro 2 开箱测评：降噪天花板级别",
          userName: "耳机控",
          userAvatar: "https://picsum.photos/100/100?random=3",
          likeCount: 89,
          isLiked: false,
          isVideo: false
        },
        {
          id: 4,
          cover: "https://picsum.photos/400/600?random=104",
          title: "2024年最值得入手的数码好物推荐",
          userName: "好物推荐官",
          userAvatar: "https://picsum.photos/100/100?random=4",
          likeCount: 167,
          isLiked: false,
          isVideo: true
        },
        {
          id: 5,
          cover: "https://picsum.photos/400/400?random=105",
          title: "iPad Pro 创作利器：设计师必备神器",
          userName: "设计师小王",
          userAvatar: "https://picsum.photos/100/100?random=5",
          likeCount: 234,
          isLiked: true,
          isVideo: false
        },
        {
          id: 6,
          cover: "https://picsum.photos/400/500?random=106",
          title: "Sony 相机入门指南：如何拍出好照片",
          userName: "摄影师老李",
          userAvatar: "https://picsum.photos/100/100?random=6",
          likeCount: 78,
          isLiked: false,
          isVideo: false
        }
      ]);
      const goPostDetail = (item) => {
        uni.navigateTo({ url: `/pages-sub/content/post/detail?id=${item.id}` });
      };
      const goUser = (item) => {
        uni.navigateTo({ url: `/pages-sub/content/user/index?id=${item.userId}` });
      };
      const loadMore = () => {
        if (loading.value)
          return;
        loading.value = true;
        setTimeout(() => {
          const newList = postList.value.map((item) => ({
            ...item,
            id: item.id + postList.value.length,
            likeCount: Math.floor(Math.random() * 200)
          }));
          postList.value = [...postList.value, ...newList];
          loading.value = false;
        }, 1e3);
      };
      const __returned__ = { safeAreaTop, headerExtraTop, headerHeight, scrollHeight, loading, postList, goPostDetail, goUser, loadMore };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$_(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_text = vue.resolveComponent("ui-text");
    const _component_ui_card = vue.resolveComponent("ui-card");
    const _component_ui_goods_card = vue.resolveComponent("ui-goods-card");
    const _component_ui_waterfalls = vue.resolveComponent("ui-waterfalls");
    const _component_ui_divider = vue.resolveComponent("ui-divider");
    const _component_TheTabbar = resolveEasycom(vue.resolveDynamicComponent("TheTabbar"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "follow-page" }, [
      vue.createElementVNode(
        "view",
        {
          class: "page-header",
          style: vue.normalizeStyle({ paddingTop: $setup.safeAreaTop + $setup.headerExtraTop + "px" })
        },
        [
          vue.createVNode(_component_ui_card, {
            glass: true,
            shadow: true,
            radius: "lg",
            padding: "lg",
            class: "header-card"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_ui_text, {
                size: "xl",
                weight: "bold",
                color: "main"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("关注")
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createVNode(_component_ui_text, {
                size: "sm",
                color: "sub",
                class: "subtitle"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("发现好物好价")
                ]),
                _: 1
                /* STABLE */
              })
            ]),
            _: 1
            /* STABLE */
          })
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "page-content",
          style: vue.normalizeStyle({ paddingTop: $setup.headerHeight + "px" })
        },
        [
          vue.createElementVNode(
            "scroll-view",
            {
              "scroll-y": "",
              class: "content-scroll",
              style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" }),
              onScrolltolower: $setup.loadMore
            },
            [
              vue.createElementVNode("view", { class: "post-list" }, [
                vue.createVNode(_component_ui_waterfalls, {
                  list: $setup.postList,
                  columns: 2,
                  gap: 12,
                  onClick: $setup.goPostDetail
                }, {
                  item: vue.withCtx(({ item }) => [
                    vue.createVNode(_component_ui_goods_card, {
                      data: {
                        ...item,
                        price: null,
                        likeCount: item.likeCount
                      },
                      mode: "waterfall",
                      onClick: $setup.goPostDetail,
                      onUserClick: $setup.goUser
                    }, null, 8, ["data"])
                  ]),
                  _: 1
                  /* STABLE */
                }, 8, ["list"])
              ]),
              $setup.postList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "load-more"
              }, [
                vue.createVNode(_component_ui_divider, {
                  text: $setup.loading ? "加载中..." : "上拉加载更多"
                }, null, 8, ["text"])
              ])) : vue.createCommentVNode("v-if", true)
            ],
            36
            /* STYLE, NEED_HYDRATION */
          )
        ],
        4
        /* STYLE */
      ),
      vue.createVNode(_component_TheTabbar, { current: "follow" })
    ]);
  }
  const PagesFollowIndex = /* @__PURE__ */ _export_sfc(_sfc_main$_, [["render", _sfc_render$_], ["__scopeId", "data-v-f295973f"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages/follow/index.vue"]]);
  const _sfc_main$Z = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaTop, headerExtraTop, headerHeight, scrollHeight } = usePageLayout({
        hasTabbar: true,
        headerSelector: ".page-header",
        headerEstimatedHeight: 180
      });
      const activeTab = vue.ref(0);
      const tabList = vue.ref([
        { name: "交易" },
        { name: "通知" },
        { name: "互动" }
      ]);
      const tradeMessages = vue.ref([
        {
          id: 1,
          avatar: "https://picsum.photos/100/100?random=20",
          title: "卖家：数码达人",
          lastMessage: "好的，明天发货，请注意查收",
          time: "刚刚",
          unread: 2
        },
        {
          id: 2,
          avatar: "https://picsum.photos/100/100?random=21",
          title: "买家：小明",
          lastMessage: "请问这个还在吗？可以便宜点吗？",
          time: "10分钟前",
          unread: 0
        },
        {
          id: 3,
          avatar: "https://picsum.photos/100/100?random=22",
          title: "卖家：科技博主",
          lastMessage: "已经为您安排发货了，单号：SF123456789",
          time: "1小时前",
          unread: 1
        },
        {
          id: 4,
          avatar: "https://picsum.photos/100/100?random=23",
          title: "系统客服",
          lastMessage: "您的订单已签收，请确认收货",
          time: "昨天",
          unread: 0
        }
      ]);
      const systemMessages = vue.ref([
        {
          id: 1,
          icon: "check-circle",
          iconColor: "#00C853",
          title: "订单发货通知",
          content: "您购买的 iPhone 15 Pro Max 已发货，预计3天内送达",
          time: "2小时前"
        },
        {
          id: 2,
          icon: "info-circle",
          iconColor: "#00B8D4",
          title: "实名认证成功",
          content: "恭喜您完成实名认证，现在可以发布商品了",
          time: "昨天"
        },
        {
          id: 3,
          icon: "close-circle",
          iconColor: "#FF3D00",
          title: "商品审核未通过",
          content: '您发布的商品"测试商品"因信息不完整被驳回，请补充后重新提交',
          time: "3天前"
        }
      ]);
      const interactMessages = vue.ref([
        {
          id: 1,
          avatar: "https://picsum.photos/100/100?random=30",
          userName: "数码爱好者",
          content: "赞了你的帖子《iPhone 15 Pro 深度测评》",
          time: "30分钟前"
        },
        {
          id: 2,
          avatar: "https://picsum.photos/100/100?random=31",
          userName: "科技小白",
          content: "关注了你",
          time: "1小时前"
        },
        {
          id: 3,
          avatar: "https://picsum.photos/100/100?random=32",
          userName: "摄影师老李",
          content: "评论了你的帖子：拍得真好！请问用的什么镜头？",
          time: "2小时前"
        }
      ]);
      const isEmpty = vue.computed(() => {
        if (activeTab.value === 0)
          return tradeMessages.value.length === 0;
        if (activeTab.value === 1)
          return systemMessages.value.length === 0;
        if (activeTab.value === 2)
          return interactMessages.value.length === 0;
        return false;
      });
      const goChat = (item) => {
        uni.showToast({ title: "聊天功能开发中", icon: "none" });
      };
      const handleSystemMessage = (item) => {
        uni.showToast({ title: item.title, icon: "none" });
      };
      const handleInteract = (item) => {
        uni.navigateTo({ url: `/pages-sub/content/user/index?id=${item.id}` });
      };
      const __returned__ = { safeAreaTop, headerExtraTop, headerHeight, scrollHeight, activeTab, tabList, tradeMessages, systemMessages, interactMessages, isEmpty, goChat, handleSystemMessage, handleInteract };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$Z(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_text = vue.resolveComponent("ui-text");
    const _component_ui_card = vue.resolveComponent("ui-card");
    const _component_ui_tabs = vue.resolveComponent("ui-tabs");
    const _component_ui_avatar = vue.resolveComponent("ui-avatar");
    const _component_ui_badge = vue.resolveComponent("ui-badge");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_TheTabbar = resolveEasycom(vue.resolveDynamicComponent("TheTabbar"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "message-page" }, [
      vue.createElementVNode(
        "view",
        {
          class: "page-header",
          style: vue.normalizeStyle({ paddingTop: $setup.safeAreaTop + $setup.headerExtraTop + "px" })
        },
        [
          vue.createVNode(_component_ui_card, {
            glass: true,
            shadow: true,
            radius: "lg",
            padding: "lg",
            class: "header-card"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_ui_text, {
                size: "xl",
                weight: "bold",
                color: "main"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("消息")
                ]),
                _: 1
                /* STABLE */
              })
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createElementVNode("view", { class: "message-tabs" }, [
            vue.createVNode(_component_ui_tabs, {
              modelValue: $setup.activeTab,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.activeTab = $event),
              list: $setup.tabList,
              type: "line"
            }, null, 8, ["modelValue", "list"])
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "page-content",
          style: vue.normalizeStyle({ paddingTop: $setup.headerHeight + "px" })
        },
        [
          vue.createElementVNode(
            "scroll-view",
            {
              "scroll-y": "",
              class: "message-list",
              style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
            },
            [
              $setup.activeTab === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "message-group"
              }, [
                vue.createVNode(_component_ui_card, {
                  glass: true,
                  shadow: false,
                  radius: "lg",
                  padding: "none",
                  class: "group-card"
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "group-title" }, [
                      vue.createVNode(_component_ui_text, {
                        size: "sm",
                        color: "sub"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("交易消息")
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ]),
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($setup.tradeMessages, (item) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: item.id,
                          class: "message-item",
                          onClick: ($event) => $setup.goChat(item)
                        }, [
                          vue.createElementVNode("view", { class: "item-left" }, [
                            vue.createVNode(_component_ui_avatar, {
                              src: item.avatar,
                              size: 88
                            }, null, 8, ["src"]),
                            item.unread > 0 ? (vue.openBlock(), vue.createBlock(_component_ui_badge, {
                              key: 0,
                              value: item.unread,
                              "is-dot": ""
                            }, null, 8, ["value"])) : vue.createCommentVNode("v-if", true)
                          ]),
                          vue.createElementVNode("view", { class: "item-content" }, [
                            vue.createElementVNode("view", { class: "item-header" }, [
                              vue.createVNode(
                                _component_ui_text,
                                {
                                  size: "md",
                                  weight: "medium",
                                  color: "main"
                                },
                                {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode(
                                      vue.toDisplayString(item.title),
                                      1
                                      /* TEXT */
                                    )
                                  ]),
                                  _: 2
                                  /* DYNAMIC */
                                },
                                1024
                                /* DYNAMIC_SLOTS */
                              ),
                              vue.createVNode(
                                _component_ui_text,
                                {
                                  size: "xs",
                                  color: "placeholder"
                                },
                                {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode(
                                      vue.toDisplayString(item.time),
                                      1
                                      /* TEXT */
                                    )
                                  ]),
                                  _: 2
                                  /* DYNAMIC */
                                },
                                1024
                                /* DYNAMIC_SLOTS */
                              )
                            ]),
                            vue.createElementVNode("view", { class: "item-desc" }, [
                              vue.createVNode(
                                _component_ui_text,
                                {
                                  size: "sm",
                                  color: "sub",
                                  class: "item-message"
                                },
                                {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode(
                                      vue.toDisplayString(item.lastMessage),
                                      1
                                      /* TEXT */
                                    )
                                  ]),
                                  _: 2
                                  /* DYNAMIC */
                                },
                                1024
                                /* DYNAMIC_SLOTS */
                              ),
                              item.unread > 0 ? (vue.openBlock(), vue.createBlock(_component_ui_badge, {
                                key: 0,
                                value: item.unread
                              }, null, 8, ["value"])) : vue.createCommentVNode("v-if", true)
                            ])
                          ])
                        ], 8, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  _: 1
                  /* STABLE */
                })
              ])) : vue.createCommentVNode("v-if", true),
              $setup.activeTab === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "message-group"
              }, [
                vue.createVNode(_component_ui_card, {
                  glass: true,
                  shadow: false,
                  radius: "lg",
                  padding: "none",
                  class: "group-card"
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "group-title" }, [
                      vue.createVNode(_component_ui_text, {
                        size: "sm",
                        color: "sub"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("系统通知")
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ]),
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($setup.systemMessages, (item) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: item.id,
                          class: "message-item system-item",
                          onClick: ($event) => $setup.handleSystemMessage(item)
                        }, [
                          vue.createElementVNode("view", { class: "system-icon" }, [
                            vue.createVNode(_component_ui_icon, {
                              name: item.icon,
                              size: 40,
                              color: item.iconColor
                            }, null, 8, ["name", "color"])
                          ]),
                          vue.createElementVNode("view", { class: "item-content" }, [
                            vue.createElementVNode("view", { class: "item-header" }, [
                              vue.createVNode(
                                _component_ui_text,
                                {
                                  size: "md",
                                  weight: "medium",
                                  color: "main"
                                },
                                {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode(
                                      vue.toDisplayString(item.title),
                                      1
                                      /* TEXT */
                                    )
                                  ]),
                                  _: 2
                                  /* DYNAMIC */
                                },
                                1024
                                /* DYNAMIC_SLOTS */
                              ),
                              vue.createVNode(
                                _component_ui_text,
                                {
                                  size: "xs",
                                  color: "placeholder"
                                },
                                {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode(
                                      vue.toDisplayString(item.time),
                                      1
                                      /* TEXT */
                                    )
                                  ]),
                                  _: 2
                                  /* DYNAMIC */
                                },
                                1024
                                /* DYNAMIC_SLOTS */
                              )
                            ]),
                            vue.createVNode(
                              _component_ui_text,
                              {
                                size: "sm",
                                color: "sub",
                                class: "item-message"
                              },
                              {
                                default: vue.withCtx(() => [
                                  vue.createTextVNode(
                                    vue.toDisplayString(item.content),
                                    1
                                    /* TEXT */
                                  )
                                ]),
                                _: 2
                                /* DYNAMIC */
                              },
                              1024
                              /* DYNAMIC_SLOTS */
                            )
                          ])
                        ], 8, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  _: 1
                  /* STABLE */
                })
              ])) : vue.createCommentVNode("v-if", true),
              $setup.activeTab === 2 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 2,
                class: "message-group"
              }, [
                vue.createVNode(_component_ui_card, {
                  glass: true,
                  shadow: false,
                  radius: "lg",
                  padding: "none",
                  class: "group-card"
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "group-title" }, [
                      vue.createVNode(_component_ui_text, {
                        size: "sm",
                        color: "sub"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("互动消息")
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ]),
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($setup.interactMessages, (item) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: item.id,
                          class: "message-item",
                          onClick: ($event) => $setup.handleInteract(item)
                        }, [
                          vue.createElementVNode("view", { class: "item-left" }, [
                            vue.createVNode(_component_ui_avatar, {
                              src: item.avatar,
                              size: 88
                            }, null, 8, ["src"])
                          ]),
                          vue.createElementVNode("view", { class: "item-content" }, [
                            vue.createElementVNode("view", { class: "item-header" }, [
                              vue.createVNode(
                                _component_ui_text,
                                {
                                  size: "md",
                                  weight: "medium",
                                  color: "main"
                                },
                                {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode(
                                      vue.toDisplayString(item.userName),
                                      1
                                      /* TEXT */
                                    )
                                  ]),
                                  _: 2
                                  /* DYNAMIC */
                                },
                                1024
                                /* DYNAMIC_SLOTS */
                              ),
                              vue.createVNode(
                                _component_ui_text,
                                {
                                  size: "xs",
                                  color: "placeholder"
                                },
                                {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode(
                                      vue.toDisplayString(item.time),
                                      1
                                      /* TEXT */
                                    )
                                  ]),
                                  _: 2
                                  /* DYNAMIC */
                                },
                                1024
                                /* DYNAMIC_SLOTS */
                              )
                            ]),
                            vue.createVNode(
                              _component_ui_text,
                              {
                                size: "sm",
                                color: "sub",
                                class: "item-message"
                              },
                              {
                                default: vue.withCtx(() => [
                                  vue.createTextVNode(
                                    vue.toDisplayString(item.content),
                                    1
                                    /* TEXT */
                                  )
                                ]),
                                _: 2
                                /* DYNAMIC */
                              },
                              1024
                              /* DYNAMIC_SLOTS */
                            )
                          ])
                        ], 8, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  _: 1
                  /* STABLE */
                })
              ])) : vue.createCommentVNode("v-if", true),
              $setup.isEmpty ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 3,
                class: "empty-state"
              }, [
                vue.createVNode(_component_ui_icon, {
                  name: "message",
                  size: 80,
                  color: "#A1A1A6"
                }),
                vue.createVNode(_component_ui_text, {
                  size: "md",
                  color: "placeholder",
                  class: "empty-text"
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("暂无消息")
                  ]),
                  _: 1
                  /* STABLE */
                })
              ])) : vue.createCommentVNode("v-if", true)
            ],
            4
            /* STYLE */
          )
        ],
        4
        /* STYLE */
      ),
      vue.createVNode(_component_TheTabbar, { current: "message" })
    ]);
  }
  const PagesMessageIndex = /* @__PURE__ */ _export_sfc(_sfc_main$Z, [["render", _sfc_render$Z], ["__scopeId", "data-v-bdafde18"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages/message/index.vue"]]);
  const _sfc_main$Y = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaTop, headerExtraTop, headerHeight, scrollHeight } = usePageLayout({
        hasTabbar: true,
        headerSelector: ".page-header",
        headerEstimatedHeight: 280
      });
      const userInfo = vue.ref({
        avatar: "https://picsum.photos/200/200?random=100",
        name: "数码达人",
        signature: "专注数码产品测评与分享",
        isVerified: true,
        isSeller: true,
        followers: 2568,
        following: 128,
        likes: 8999
      });
      const orderCounts = vue.ref({
        pending: 2,
        shipped: 1,
        received: 3,
        reviewed: 1,
        refund: 0
      });
      const goProfile = () => {
        uni.showToast({ title: "个人资料功能开发中", icon: "none" });
      };
      const goFollowers = () => {
        uni.showToast({ title: "粉丝列表", icon: "none" });
      };
      const goFollowing = () => {
        uni.showToast({ title: "关注列表", icon: "none" });
      };
      const goLikes = () => {
        uni.showToast({ title: "获赞记录", icon: "none" });
      };
      const goOrders = (type) => {
        const url = type ? `/pages-sub/trade/order/list?type=${type}` : "/pages-sub/trade/order/list";
        uni.navigateTo({ url });
      };
      const goShop = () => {
        uni.navigateTo({ url: "/pages-sub/seller/shop/index" });
      };
      const goMyPublish = () => {
        uni.navigateTo({ url: "/pages-sub/seller/goods/list" });
      };
      const goCollection = () => {
        uni.navigateTo({ url: "/pages-sub/user/collection/index" });
      };
      const goHistory = () => {
        uni.navigateTo({ url: "/pages-sub/user/history/index" });
      };
      const goAddress = () => {
        uni.navigateTo({ url: "/pages-sub/user/address/list" });
      };
      const goWallet = () => {
        uni.navigateTo({ url: "/pages-sub/user/wallet/index" });
      };
      const goAuth = () => {
        uni.navigateTo({ url: "/pages-sub/auth/real-name/index" });
      };
      const goHelp = () => {
        uni.showToast({ title: "帮助中心", icon: "none" });
      };
      const goFeedback = () => {
        uni.showToast({ title: "意见反馈", icon: "none" });
      };
      const goSettings = () => {
        uni.navigateTo({ url: "/pages-sub/user/settings/index" });
      };
      const __returned__ = { safeAreaTop, headerExtraTop, headerHeight, scrollHeight, userInfo, orderCounts, goProfile, goFollowers, goFollowing, goLikes, goOrders, goShop, goMyPublish, goCollection, goHistory, goAddress, goWallet, goAuth, goHelp, goFeedback, goSettings };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$Y(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_avatar = vue.resolveComponent("ui-avatar");
    const _component_ui_text = vue.resolveComponent("ui-text");
    const _component_ui_tag = vue.resolveComponent("ui-tag");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_card = vue.resolveComponent("ui-card");
    const _component_ui_badge = vue.resolveComponent("ui-badge");
    const _component_ui_cell = vue.resolveComponent("ui-cell");
    const _component_TheTabbar = resolveEasycom(vue.resolveDynamicComponent("TheTabbar"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "my-page" }, [
      vue.createElementVNode(
        "view",
        {
          class: "page-header",
          style: vue.normalizeStyle({ paddingTop: $setup.safeAreaTop + $setup.headerExtraTop + "px" })
        },
        [
          vue.createElementVNode("view", { class: "user-header" }, [
            vue.createElementVNode("view", {
              class: "user-info",
              onClick: $setup.goProfile
            }, [
              vue.createVNode(_component_ui_avatar, {
                src: $setup.userInfo.avatar,
                size: 120,
                bordered: true
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "user-detail" }, [
                vue.createVNode(_component_ui_text, {
                  size: "xl",
                  weight: "bold",
                  color: "white"
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(
                      vue.toDisplayString($setup.userInfo.name),
                      1
                      /* TEXT */
                    )
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_ui_text, {
                  size: "sm",
                  color: "white",
                  class: "user-desc"
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(
                      vue.toDisplayString($setup.userInfo.signature),
                      1
                      /* TEXT */
                    )
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createElementVNode("view", { class: "user-tags" }, [
                  $setup.userInfo.isVerified ? (vue.openBlock(), vue.createBlock(_component_ui_tag, {
                    key: 0,
                    type: "success",
                    size: "sm"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("已认证")
                    ]),
                    _: 1
                    /* STABLE */
                  })) : vue.createCommentVNode("v-if", true),
                  $setup.userInfo.isSeller ? (vue.openBlock(), vue.createBlock(_component_ui_tag, {
                    key: 1,
                    type: "primary",
                    size: "sm"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("卖家")
                    ]),
                    _: 1
                    /* STABLE */
                  })) : vue.createCommentVNode("v-if", true)
                ])
              ]),
              vue.createVNode(_component_ui_icon, {
                name: "arrow-right",
                ":size": 40,
                color: "rgba(255,255,255,0.8)"
              })
            ]),
            vue.createVNode(_component_ui_card, {
              glass: true,
              shadow: false,
              radius: "lg",
              padding: "md",
              class: "stats-card"
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { class: "user-stats" }, [
                  vue.createElementVNode("view", {
                    class: "stat-item",
                    onClick: $setup.goFollowers
                  }, [
                    vue.createVNode(_component_ui_text, {
                      size: "xl",
                      weight: "bold",
                      color: "white"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(
                          vue.toDisplayString($setup.userInfo.followers),
                          1
                          /* TEXT */
                        )
                      ]),
                      _: 1
                      /* STABLE */
                    }),
                    vue.createVNode(_component_ui_text, {
                      size: "xs",
                      color: "white"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("粉丝")
                      ]),
                      _: 1
                      /* STABLE */
                    })
                  ]),
                  vue.createElementVNode("view", { class: "stat-divider" }),
                  vue.createElementVNode("view", {
                    class: "stat-item",
                    onClick: $setup.goFollowing
                  }, [
                    vue.createVNode(_component_ui_text, {
                      size: "xl",
                      weight: "bold",
                      color: "white"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(
                          vue.toDisplayString($setup.userInfo.following),
                          1
                          /* TEXT */
                        )
                      ]),
                      _: 1
                      /* STABLE */
                    }),
                    vue.createVNode(_component_ui_text, {
                      size: "xs",
                      color: "white"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("关注")
                      ]),
                      _: 1
                      /* STABLE */
                    })
                  ]),
                  vue.createElementVNode("view", { class: "stat-divider" }),
                  vue.createElementVNode("view", {
                    class: "stat-item",
                    onClick: $setup.goLikes
                  }, [
                    vue.createVNode(_component_ui_text, {
                      size: "xl",
                      weight: "bold",
                      color: "white"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(
                          vue.toDisplayString($setup.userInfo.likes),
                          1
                          /* TEXT */
                        )
                      ]),
                      _: 1
                      /* STABLE */
                    }),
                    vue.createVNode(_component_ui_text, {
                      size: "xs",
                      color: "white"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("获赞")
                      ]),
                      _: 1
                      /* STABLE */
                    })
                  ])
                ])
              ]),
              _: 1
              /* STABLE */
            })
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "page-content",
          style: vue.normalizeStyle({ paddingTop: $setup.headerHeight + "px" })
        },
        [
          vue.createElementVNode(
            "scroll-view",
            {
              "scroll-y": "",
              class: "content-scroll",
              style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
            },
            [
              vue.createVNode(_component_ui_card, {
                glass: true,
                shadow: true,
                radius: "lg",
                padding: "md",
                class: "order-section"
              }, {
                header: vue.withCtx(() => [
                  vue.createElementVNode("view", { class: "section-header" }, [
                    vue.createVNode(_component_ui_text, {
                      size: "lg",
                      weight: "bold",
                      color: "main"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("我的订单")
                      ]),
                      _: 1
                      /* STABLE */
                    }),
                    vue.createElementVNode("view", {
                      class: "section-more",
                      onClick: $setup.goOrders
                    }, [
                      vue.createVNode(_component_ui_text, {
                        size: "sm",
                        color: "sub"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("全部订单")
                        ]),
                        _: 1
                        /* STABLE */
                      }),
                      vue.createVNode(_component_ui_icon, {
                        name: "arrow-right",
                        ":size": 32,
                        color: "#6E6E73"
                      })
                    ])
                  ])
                ]),
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", { class: "order-tabs" }, [
                    vue.createElementVNode("view", {
                      class: "order-item",
                      onClick: _cache[0] || (_cache[0] = ($event) => $setup.goOrders("pending"))
                    }, [
                      vue.createElementVNode("view", { class: "order-icon" }, [
                        $setup.orderCounts.pending > 0 ? (vue.openBlock(), vue.createBlock(_component_ui_badge, {
                          key: 0,
                          value: $setup.orderCounts.pending
                        }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_ui_icon, {
                              name: "wallet",
                              ":size": 40
                            })
                          ]),
                          _: 1
                          /* STABLE */
                        }, 8, ["value"])) : (vue.openBlock(), vue.createBlock(_component_ui_icon, {
                          key: 1,
                          name: "wallet",
                          ":size": 40
                        }))
                      ]),
                      vue.createVNode(_component_ui_text, {
                        size: "xs",
                        color: "sub"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("待付款")
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ]),
                    vue.createElementVNode("view", {
                      class: "order-item",
                      onClick: _cache[1] || (_cache[1] = ($event) => $setup.goOrders("shipped"))
                    }, [
                      vue.createElementVNode("view", { class: "order-icon" }, [
                        $setup.orderCounts.shipped > 0 ? (vue.openBlock(), vue.createBlock(_component_ui_badge, {
                          key: 0,
                          value: $setup.orderCounts.shipped
                        }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_ui_icon, {
                              name: "truck",
                              ":size": 40
                            })
                          ]),
                          _: 1
                          /* STABLE */
                        }, 8, ["value"])) : (vue.openBlock(), vue.createBlock(_component_ui_icon, {
                          key: 1,
                          name: "truck",
                          ":size": 40
                        }))
                      ]),
                      vue.createVNode(_component_ui_text, {
                        size: "xs",
                        color: "sub"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("待发货")
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ]),
                    vue.createElementVNode("view", {
                      class: "order-item",
                      onClick: _cache[2] || (_cache[2] = ($event) => $setup.goOrders("received"))
                    }, [
                      vue.createElementVNode("view", { class: "order-icon" }, [
                        $setup.orderCounts.received > 0 ? (vue.openBlock(), vue.createBlock(_component_ui_badge, {
                          key: 0,
                          value: $setup.orderCounts.received
                        }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_ui_icon, {
                              name: "package",
                              ":size": 40
                            })
                          ]),
                          _: 1
                          /* STABLE */
                        }, 8, ["value"])) : (vue.openBlock(), vue.createBlock(_component_ui_icon, {
                          key: 1,
                          name: "package",
                          ":size": 40
                        }))
                      ]),
                      vue.createVNode(_component_ui_text, {
                        size: "xs",
                        color: "sub"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("待收货")
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ]),
                    vue.createElementVNode("view", {
                      class: "order-item",
                      onClick: _cache[3] || (_cache[3] = ($event) => $setup.goOrders("reviewed"))
                    }, [
                      vue.createElementVNode("view", { class: "order-icon" }, [
                        $setup.orderCounts.reviewed > 0 ? (vue.openBlock(), vue.createBlock(_component_ui_badge, {
                          key: 0,
                          value: $setup.orderCounts.reviewed
                        }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_ui_icon, {
                              name: "star",
                              ":size": 40
                            })
                          ]),
                          _: 1
                          /* STABLE */
                        }, 8, ["value"])) : (vue.openBlock(), vue.createBlock(_component_ui_icon, {
                          key: 1,
                          name: "star",
                          ":size": 40
                        }))
                      ]),
                      vue.createVNode(_component_ui_text, {
                        size: "xs",
                        color: "sub"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("待评价")
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ]),
                    vue.createElementVNode("view", {
                      class: "order-item",
                      onClick: _cache[4] || (_cache[4] = ($event) => $setup.goOrders("refund"))
                    }, [
                      vue.createElementVNode("view", { class: "order-icon" }, [
                        $setup.orderCounts.refund > 0 ? (vue.openBlock(), vue.createBlock(_component_ui_badge, {
                          key: 0,
                          value: $setup.orderCounts.refund
                        }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_ui_icon, {
                              name: "refresh",
                              ":size": 40
                            })
                          ]),
                          _: 1
                          /* STABLE */
                        }, 8, ["value"])) : (vue.openBlock(), vue.createBlock(_component_ui_icon, {
                          key: 1,
                          name: "refresh",
                          ":size": 40
                        }))
                      ]),
                      vue.createVNode(_component_ui_text, {
                        size: "xs",
                        color: "sub"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("退款/售后")
                        ]),
                        _: 1
                        /* STABLE */
                      })
                    ])
                  ])
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createElementVNode("view", { class: "menu-section" }, [
                vue.createVNode(_component_ui_card, {
                  glass: true,
                  shadow: false,
                  radius: "lg",
                  padding: "sm",
                  class: "menu-group"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_ui_cell, {
                      title: "我的店铺",
                      icon: "store",
                      "is-link": "",
                      separated: "",
                      onClick: $setup.goShop
                    }),
                    vue.createVNode(_component_ui_cell, {
                      title: "我的发布",
                      icon: "edit",
                      "is-link": "",
                      separated: "",
                      onClick: $setup.goMyPublish
                    }),
                    vue.createVNode(_component_ui_cell, {
                      title: "我的收藏",
                      icon: "heart",
                      "is-link": "",
                      separated: "",
                      onClick: $setup.goCollection
                    }),
                    vue.createVNode(_component_ui_cell, {
                      title: "浏览足迹",
                      icon: "eye",
                      "is-link": "",
                      separated: "",
                      onClick: $setup.goHistory
                    })
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_ui_card, {
                  glass: true,
                  shadow: false,
                  radius: "lg",
                  padding: "sm",
                  class: "menu-group"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_ui_cell, {
                      title: "地址管理",
                      icon: "map-pin",
                      "is-link": "",
                      separated: "",
                      onClick: $setup.goAddress
                    }),
                    vue.createVNode(_component_ui_cell, {
                      title: "我的钱包",
                      icon: "credit-card",
                      "is-link": "",
                      separated: "",
                      onClick: $setup.goWallet
                    }),
                    vue.createVNode(_component_ui_cell, {
                      title: "实名认证",
                      icon: "shield",
                      "is-link": "",
                      separated: "",
                      onClick: $setup.goAuth
                    }, {
                      "right-icon": vue.withCtx(() => [
                        vue.createVNode(_component_ui_text, {
                          size: "sm",
                          color: $setup.userInfo.isVerified ? "success" : "sub"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode(
                              vue.toDisplayString($setup.userInfo.isVerified ? "已认证" : "未认证"),
                              1
                              /* TEXT */
                            )
                          ]),
                          _: 1
                          /* STABLE */
                        }, 8, ["color"])
                      ]),
                      _: 1
                      /* STABLE */
                    })
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_ui_card, {
                  glass: true,
                  shadow: false,
                  radius: "lg",
                  padding: "sm",
                  class: "menu-group"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_ui_cell, {
                      title: "帮助中心",
                      icon: "help-circle",
                      "is-link": "",
                      separated: "",
                      onClick: $setup.goHelp
                    }),
                    vue.createVNode(_component_ui_cell, {
                      title: "意见反馈",
                      icon: "message",
                      "is-link": "",
                      separated: "",
                      onClick: $setup.goFeedback
                    }),
                    vue.createVNode(_component_ui_cell, {
                      title: "设置",
                      icon: "settings",
                      "is-link": "",
                      separated: "",
                      onClick: $setup.goSettings
                    })
                  ]),
                  _: 1
                  /* STABLE */
                })
              ])
            ],
            4
            /* STYLE */
          )
        ],
        4
        /* STYLE */
      ),
      vue.createVNode(_component_TheTabbar, { current: "my" })
    ]);
  }
  const PagesMyIndex = /* @__PURE__ */ _export_sfc(_sfc_main$Y, [["render", _sfc_render$Y], ["__scopeId", "data-v-276ac604"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages/my/index.vue"]]);
  const _sfc_main$X = /* @__PURE__ */ vue.defineComponent({
    __name: "placeholder",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaTop, headerExtraTop } = usePageLayout({
        hasTabbar: true
      });
      const __returned__ = { safeAreaTop, headerExtraTop };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$X(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_TheTabbar = resolveEasycom(vue.resolveDynamicComponent("TheTabbar"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "page-container",
        style: vue.normalizeStyle({ paddingTop: $setup.safeAreaTop + $setup.headerExtraTop + "px" })
      },
      [
        vue.createElementVNode("view", { class: "empty-content" }, [
          vue.createElementVNode("text", { class: "empty-text" }, "发布页面"),
          vue.createElementVNode("text", { class: "empty-tip" }, "点击中间按钮发布商品")
        ]),
        vue.createVNode(_component_TheTabbar, { current: 2 })
      ],
      4
      /* STYLE */
    );
  }
  const PagesPublishPlaceholder = /* @__PURE__ */ _export_sfc(_sfc_main$X, [["render", _sfc_render$X], ["__scopeId", "data-v-d6aab3e5"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages/publish/placeholder.vue"]]);
  const _sfc_main$W = /* @__PURE__ */ vue.defineComponent({
    __name: "detail",
    setup(__props, { expose: __expose }) {
      __expose();
      const appStore = useAppStore();
      const safeAreaTop = vue.computed(() => appStore.safeAreaInsets.top);
      const safeAreaBottom = vue.computed(() => appStore.safeAreaInsets.bottom);
      const scrollHeight = vue.computed(() => {
        const systemInfo = uni.getSystemInfoSync();
        const navBarHeight = 44;
        const bottomActionHeight = 60;
        return systemInfo.windowHeight - safeAreaTop.value - navBarHeight - bottomActionHeight - safeAreaBottom.value;
      });
      const product = vue.ref({
        id: 1,
        title: "iPhone 14 Pro Max 256GB 远峰蓝 99新",
        price: 6999,
        originalPrice: 8999,
        condition: "99新",
        warranty: true,
        invoice: true,
        specs: {
          "型号": "iPhone 14 Pro Max",
          "内存": "256GB",
          "颜色": "远峰蓝",
          "版本": "国行"
        },
        description: "自用 iPhone 14 Pro Max，99新，无任何划痕、磕碰。配件齐全，盒子、充电器、数据线都在。电池健康度 95%。可小刀。",
        images: [
          "https://picsum.photos/750/750?random=1",
          "https://picsum.photos/750/750?random=2",
          "https://picsum.photos/750/750?random=3"
        ]
      });
      const seller = vue.ref({
        avatar: "https://picsum.photos/200/200?random=10",
        name: "数码达人",
        desc: "诚信经营，品质保证",
        sales: 128,
        followers: 2568,
        rating: 98
      });
      const isCollected = vue.ref(false);
      const handleCollect = () => {
        isCollected.value = !isCollected.value;
        uni.showToast({
          title: isCollected.value ? "收藏成功" : "取消收藏",
          icon: "none"
        });
      };
      const handleMessage = () => {
        uni.showToast({ title: "跳转私信页面", icon: "none" });
      };
      const handleChat = () => {
        uni.showToast({ title: "联系卖家", icon: "none" });
      };
      const handleBuy = () => {
        uni.showToast({ title: "立即购买", icon: "none" });
      };
      const __returned__ = { appStore, safeAreaTop, safeAreaBottom, scrollHeight, product, seller, isCollected, handleCollect, handleMessage, handleChat, handleBuy };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$W(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_price = vue.resolveComponent("ui-price");
    const _component_ui_tag = vue.resolveComponent("ui-tag");
    const _component_ui_avatar = vue.resolveComponent("ui-avatar");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "product-detail-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "商品详情" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "detail-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("swiper", {
            class: "product-swiper",
            "indicator-dots": true,
            autoplay: false
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.product.images, (img, index) => {
                return vue.openBlock(), vue.createElementBlock("swiper-item", { key: index }, [
                  vue.createElementVNode("image", {
                    class: "swiper-image",
                    src: img,
                    mode: "aspectFill"
                  }, null, 8, ["src"])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "product-info" }, [
            vue.createElementVNode("view", { class: "price-row" }, [
              vue.createVNode(_component_ui_price, {
                value: $setup.product.price,
                type: "main",
                size: 48
              }, null, 8, ["value"]),
              $setup.product.originalPrice ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "original-price"
                },
                " ¥" + vue.toDisplayString($setup.product.originalPrice),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createElementVNode(
              "view",
              { class: "product-title" },
              vue.toDisplayString($setup.product.title),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "tags-row" }, [
              vue.createVNode(_component_ui_tag, {
                type: "primary",
                size: "sm"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(
                    vue.toDisplayString($setup.product.condition),
                    1
                    /* TEXT */
                  )
                ]),
                _: 1
                /* STABLE */
              }),
              $setup.product.warranty ? (vue.openBlock(), vue.createBlock(_component_ui_tag, {
                key: 0,
                type: "success",
                size: "sm"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("在保")
                ]),
                _: 1
                /* STABLE */
              })) : vue.createCommentVNode("v-if", true),
              $setup.product.invoice ? (vue.openBlock(), vue.createBlock(_component_ui_tag, {
                key: 1,
                type: "info",
                size: "sm"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("有发票")
                ]),
                _: 1
                /* STABLE */
              })) : vue.createCommentVNode("v-if", true)
            ]),
            $setup.product.specs ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "specs-info"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.product.specs, (value, key) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "specs-item",
                    key
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "specs-label" },
                      vue.toDisplayString(key) + ":",
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "specs-value" },
                      vue.toDisplayString(value),
                      1
                      /* TEXT */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("view", { class: "seller-card" }, [
            vue.createElementVNode("view", { class: "seller-header" }, [
              vue.createVNode(_component_ui_avatar, {
                src: $setup.seller.avatar,
                ":size": 80
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "seller-info" }, [
                vue.createElementVNode(
                  "view",
                  { class: "seller-name" },
                  vue.toDisplayString($setup.seller.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "seller-desc" },
                  vue.toDisplayString($setup.seller.desc),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "seller-stats" }, [
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode(
                  "text",
                  { class: "stat-value" },
                  vue.toDisplayString($setup.seller.sales),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "stat-label" }, "卖出")
              ]),
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode(
                  "text",
                  { class: "stat-value" },
                  vue.toDisplayString($setup.seller.followers),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "stat-label" }, "粉丝")
              ]),
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode(
                  "text",
                  { class: "stat-value" },
                  vue.toDisplayString($setup.seller.rating),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "stat-label" }, "好评")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "description-card" }, [
            vue.createElementVNode("view", { class: "card-title" }, "商品描述"),
            vue.createElementVNode(
              "view",
              { class: "description-content" },
              vue.toDisplayString($setup.product.description),
              1
              /* TEXT */
            )
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "bottom-action" }, [
        vue.createElementVNode("view", { class: "action-icons" }, [
          vue.createElementVNode("view", {
            class: "icon-item",
            onClick: $setup.handleCollect
          }, [
            vue.createVNode(_component_ui_icon, {
              name: $setup.isCollected ? "heart" : "heart-outline",
              ":size": 40
            }, null, 8, ["name"]),
            vue.createElementVNode("text", null, "收藏")
          ]),
          vue.createElementVNode("view", {
            class: "icon-item",
            onClick: $setup.handleMessage
          }, [
            vue.createVNode(_component_ui_icon, {
              name: "message",
              ":size": 40
            }),
            vue.createElementVNode("text", null, "私信")
          ])
        ]),
        vue.createElementVNode("view", { class: "action-btns" }, [
          vue.createVNode(_component_ui_button, {
            class: "btn-chat",
            onClick: $setup.handleChat
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("联系卖家")
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_ui_button, {
            class: "btn-buy",
            type: "primary",
            onClick: $setup.handleBuy
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("立即购买")
            ]),
            _: 1
            /* STABLE */
          })
        ])
      ])
    ]);
  }
  const PagesSubTradeProductDetail = /* @__PURE__ */ _export_sfc(_sfc_main$W, [["render", _sfc_render$W], ["__scopeId", "data-v-4fbb2fe7"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/trade/product/detail.vue"]]);
  const _sfc_main$V = /* @__PURE__ */ vue.defineComponent({
    __name: "list",
    setup(__props, { expose: __expose }) {
      __expose();
      const sortType = vue.ref(0);
      const loading = vue.ref(false);
      const sortList = vue.ref([
        { name: "综合" },
        { name: "最新" },
        { name: "价格" },
        { name: "销量" }
      ]);
      const productList = vue.ref([
        { id: 1, cover: "https://picsum.photos/400/400?random=201", title: "iPhone 15 Pro Max 256GB 钛金属原色", price: 7999, sales: 128, tags: ["99新", "在保"] },
        { id: 2, cover: "https://picsum.photos/400/400?random=202", title: "MacBook Pro 14寸 M3芯片 16G+512G", price: 12999, sales: 56, tags: ["全新", "官方质保"] },
        { id: 3, cover: "https://picsum.photos/400/400?random=203", title: "iPad Pro 12.9寸 M2芯片 256G WiFi", price: 6999, sales: 89, tags: ["95新", "送配件"] },
        { id: 4, cover: "https://picsum.photos/400/400?random=204", title: "AirPods Pro 第二代 USB-C", price: 1399, sales: 256, tags: ["全新", "正品"] },
        { id: 5, cover: "https://picsum.photos/400/400?random=205", title: "Sony WH-1000XM5 头戴式降噪耳机", price: 2199, sales: 78, tags: ["9成新", "箱说全"] },
        { id: 6, cover: "https://picsum.photos/400/400?random=206", title: "Nintendo Switch OLED 白色续航版", price: 1899, sales: 167, tags: ["99新", "双系统"] }
      ]);
      const goDetail = (item) => {
        uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.id}` });
      };
      const loadMore = () => {
        if (loading.value)
          return;
        loading.value = true;
        setTimeout(() => {
          loading.value = false;
        }, 1e3);
      };
      const __returned__ = { sortType, loading, sortList, productList, goDetail, loadMore };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$V(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_tabs = vue.resolveComponent("ui-tabs");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_tag = vue.resolveComponent("ui-tag");
    const _component_ui_price = vue.resolveComponent("ui-price");
    return vue.openBlock(), vue.createElementBlock("view", { class: "product-list-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "商品列表" }),
      vue.createElementVNode("view", { class: "filter-bar" }, [
        vue.createVNode(_component_ui_tabs, {
          modelValue: $setup.sortType,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.sortType = $event),
          list: $setup.sortList,
          type: "line"
        }, null, 8, ["modelValue", "list"])
      ]),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "product-scroll",
          onScrolltolower: $setup.loadMore
        },
        [
          vue.createElementVNode("view", { class: "product-grid" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.productList, (item) => {
                var _a;
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "product-item",
                  onClick: ($event) => $setup.goDetail(item)
                }, [
                  vue.createVNode(_component_ui_image, {
                    src: item.cover,
                    width: "100%",
                    height: "340rpx",
                    radius: "12rpx"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "product-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "product-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "product-tags" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList((_a = item.tags) == null ? void 0 : _a.slice(0, 2), (tag) => {
                          return vue.openBlock(), vue.createBlock(
                            _component_ui_tag,
                            {
                              key: tag,
                              type: "primary",
                              size: "sm"
                            },
                            {
                              default: vue.withCtx(() => [
                                vue.createTextVNode(
                                  vue.toDisplayString(tag),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              _: 2
                              /* DYNAMIC */
                            },
                            1024
                            /* DYNAMIC_SLOTS */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ]),
                    vue.createElementVNode("view", { class: "product-bottom" }, [
                      vue.createVNode(_component_ui_price, {
                        value: item.price,
                        type: "main",
                        ":size": 40
                      }, null, 8, ["value"]),
                      vue.createElementVNode(
                        "text",
                        { class: "sales" },
                        vue.toDisplayString(item.sales) + "人付款",
                        1
                        /* TEXT */
                      )
                    ])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "load-more" }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($setup.loading ? "加载中..." : "上拉加载更多"),
              1
              /* TEXT */
            )
          ])
        ],
        32
        /* NEED_HYDRATION */
      )
    ]);
  }
  const PagesSubTradeProductList = /* @__PURE__ */ _export_sfc(_sfc_main$V, [["render", _sfc_render$V], ["__scopeId", "data-v-de971856"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/trade/product/list.vue"]]);
  const _sfc_main$U = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true
      });
      const cartList = vue.ref([
        { id: 1, cover: "https://picsum.photos/200/200?random=301", title: "iPhone 15 Pro Max 256GB", spec: "钛金属原色", price: 7999, quantity: 1, selected: true },
        { id: 2, cover: "https://picsum.photos/200/200?random=302", title: "AirPods Pro 第二代", spec: "USB-C", price: 1399, quantity: 2, selected: true },
        { id: 3, cover: "https://picsum.photos/200/200?random=303", title: "MacBook Pro 14寸", spec: "M3芯片 16G+512G", price: 12999, quantity: 1, selected: false }
      ]);
      const isAllSelected = vue.computed(() => cartList.value.every((item) => item.selected));
      const selectedCount = vue.computed(() => cartList.value.filter((item) => item.selected).length);
      const totalPrice = vue.computed(() => {
        return cartList.value.filter((item) => item.selected).reduce((sum, item) => sum + item.price * item.quantity, 0);
      });
      const toggleSelect = (item) => {
        item.selected = !item.selected;
      };
      const toggleSelectAll = () => {
        const newState = !isAllSelected.value;
        cartList.value.forEach((item) => item.selected = newState);
      };
      const goShopping = () => {
        uni.switchTab({ url: "/pages/index/index" });
      };
      const goConfirm = () => {
        uni.navigateTo({ url: "/pages-sub/trade/order/confirm" });
      };
      const __returned__ = { safeAreaBottom, scrollHeight, cartList, isAllSelected, selectedCount, totalPrice, toggleSelect, toggleSelectAll, goShopping, goConfirm };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$U(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_button = vue.resolveComponent("ui-button");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_price = vue.resolveComponent("ui-price");
    const _component_ui_stepper = vue.resolveComponent("ui-stepper");
    return vue.openBlock(), vue.createElementBlock("view", { class: "cart-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "购物车" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "cart-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          $setup.cartList.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createVNode(_component_ui_icon, {
              name: "shopping-cart",
              size: 80,
              color: "#A1A1A6"
            }),
            vue.createElementVNode("text", { class: "empty-text" }, "购物车空空如也"),
            vue.createVNode(_component_ui_button, {
              type: "primary",
              size: "sm",
              onClick: $setup.goShopping
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("去逛逛")
              ]),
              _: 1
              /* STABLE */
            })
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "cart-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.cartList, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "cart-item"
                }, [
                  vue.createElementVNode("view", {
                    class: "item-check",
                    onClick: ($event) => $setup.toggleSelect(item)
                  }, [
                    vue.createVNode(_component_ui_icon, {
                      name: item.selected ? "check-circle-fill" : "circle",
                      ":size": 40,
                      color: item.selected ? "#1ABC9C" : "#A1A1A6"
                    }, null, 8, ["name", "color"])
                  ], 8, ["onClick"]),
                  vue.createVNode(_component_ui_image, {
                    src: item.cover,
                    width: "180rpx",
                    height: "180rpx",
                    radius: "12rpx"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "item-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "item-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "item-spec" },
                      vue.toDisplayString(item.spec),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "item-bottom" }, [
                      vue.createVNode(_component_ui_price, {
                        value: item.price,
                        type: "main",
                        size: 28
                      }, null, 8, ["value"]),
                      vue.createVNode(_component_ui_stepper, {
                        modelValue: item.quantity,
                        "onUpdate:modelValue": ($event) => item.quantity = $event,
                        min: 1,
                        max: 99
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]))
        ],
        4
        /* STYLE */
      ),
      $setup.cartList.length > 0 ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: "cart-footer",
          style: vue.normalizeStyle({ paddingBottom: $setup.safeAreaBottom + 12 + "px" })
        },
        [
          vue.createElementVNode("view", { class: "footer-left" }, [
            vue.createElementVNode("view", {
              class: "check-all",
              onClick: $setup.toggleSelectAll
            }, [
              vue.createVNode(_component_ui_icon, {
                name: $setup.isAllSelected ? "check-circle-fill" : "circle",
                ":size": 40,
                color: $setup.isAllSelected ? "#1ABC9C" : "#A1A1A6"
              }, null, 8, ["name", "color"]),
              vue.createElementVNode("text", null, "全选")
            ])
          ]),
          vue.createElementVNode("view", { class: "footer-right" }, [
            vue.createElementVNode("view", { class: "total-price" }, [
              vue.createElementVNode("text", { class: "label" }, "合计："),
              vue.createVNode(_component_ui_price, {
                value: $setup.totalPrice,
                type: "main",
                size: 36
              }, null, 8, ["value"])
            ]),
            vue.createVNode(_component_ui_button, {
              type: "primary",
              disabled: $setup.selectedCount === 0,
              onClick: $setup.goConfirm
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(
                  " 结算(" + vue.toDisplayString($setup.selectedCount) + ") ",
                  1
                  /* TEXT */
                )
              ]),
              _: 1
              /* STABLE */
            }, 8, ["disabled"])
          ])
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesSubTradeCartIndex = /* @__PURE__ */ _export_sfc(_sfc_main$U, [["render", _sfc_render$U], ["__scopeId", "data-v-ed7b7cc2"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/trade/cart/index.vue"]]);
  const _sfc_main$T = /* @__PURE__ */ vue.defineComponent({
    __name: "list",
    setup(__props, { expose: __expose }) {
      __expose();
      const { scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 176
      });
      const activeTab = vue.ref(0);
      const tabList = vue.ref([
        { name: "全部" },
        { name: "待付款" },
        { name: "待发货" },
        { name: "待收货" },
        { name: "待评价" }
      ]);
      const orderList = vue.ref([
        {
          id: 1,
          shopName: "数码达人小店",
          status: "pending",
          statusText: "待付款",
          statusClass: "warning",
          totalPrice: 9398,
          goods: [
            { id: 1, cover: "https://picsum.photos/200/200?random=401", title: "iPhone 15 Pro Max 256GB", spec: "钛金属原色", price: 7999, quantity: 1 },
            { id: 2, cover: "https://picsum.photos/200/200?random=402", title: "AirPods Pro 第二代", spec: "USB-C", price: 1399, quantity: 1 }
          ]
        },
        {
          id: 2,
          shopName: "科技好物",
          status: "shipped",
          statusText: "待发货",
          statusClass: "info",
          totalPrice: 12999,
          goods: [
            { id: 3, cover: "https://picsum.photos/200/200?random=403", title: "MacBook Pro 14寸 M3", spec: "深空黑 16G+512G", price: 12999, quantity: 1 }
          ]
        },
        {
          id: 3,
          shopName: "正品数码",
          status: "received",
          statusText: "待收货",
          statusClass: "primary",
          totalPrice: 2199,
          goods: [
            { id: 4, cover: "https://picsum.photos/200/200?random=404", title: "Sony WH-1000XM5", spec: "黑色", price: 2199, quantity: 1 }
          ]
        },
        {
          id: 4,
          shopName: "耳机专营",
          status: "reviewed",
          statusText: "待评价",
          statusClass: "success",
          totalPrice: 1399,
          goods: [
            { id: 5, cover: "https://picsum.photos/200/200?random=405", title: "AirPods Pro 第二代", spec: "USB-C", price: 1399, quantity: 1 }
          ]
        }
      ]);
      const goDetail = (order) => {
        uni.navigateTo({ url: `/pages-sub/trade/order/detail?id=${order.id}` });
      };
      const handlePay = (order) => {
        uni.navigateTo({ url: `/pages-sub/trade/pay/index?id=${order.id}` });
      };
      const handleConfirm = (order) => {
        uni.showModal({
          title: "确认收货",
          content: "确认已收到商品吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({ title: "确认成功", icon: "success" });
            }
          }
        });
      };
      const goEvaluate = (order) => {
        uni.navigateTo({ url: `/pages-sub/trade/evaluate/index?id=${order.id}` });
      };
      const __returned__ = { scrollHeight, activeTab, tabList, orderList, goDetail, handlePay, handleConfirm, goEvaluate };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$T(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_tabs = vue.resolveComponent("ui-tabs");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_price = vue.resolveComponent("ui-price");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "order-list-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "我的订单" }),
      vue.createElementVNode("view", { class: "order-tabs" }, [
        vue.createVNode(_component_ui_tabs, {
          modelValue: $setup.activeTab,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.activeTab = $event),
          list: $setup.tabList,
          type: "line"
        }, null, 8, ["modelValue", "list"])
      ]),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "order-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          $setup.orderList.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createVNode(_component_ui_icon, {
              name: "file-text",
              size: 80,
              color: "#A1A1A6"
            }),
            vue.createElementVNode("text", { class: "empty-text" }, "暂无订单")
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "order-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.orderList, (order) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: order.id,
                  class: "order-item",
                  onClick: ($event) => $setup.goDetail(order)
                }, [
                  vue.createElementVNode("view", { class: "order-header" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "shop-name" },
                      vue.toDisplayString(order.shopName),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["order-status", order.statusClass])
                      },
                      vue.toDisplayString(order.statusText),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(order.goods, (item) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        key: item.id,
                        class: "order-goods"
                      }, [
                        vue.createVNode(_component_ui_image, {
                          src: item.cover,
                          width: "160rpx",
                          height: "160rpx",
                          radius: "8rpx"
                        }, null, 8, ["src"]),
                        vue.createElementVNode("view", { class: "goods-info" }, [
                          vue.createElementVNode(
                            "text",
                            { class: "goods-title" },
                            vue.toDisplayString(item.title),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            { class: "goods-spec" },
                            vue.toDisplayString(item.spec),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode("view", { class: "goods-bottom" }, [
                            vue.createVNode(_component_ui_price, {
                              value: item.price,
                              ":size": 40
                            }, null, 8, ["value"]),
                            vue.createElementVNode(
                              "text",
                              { class: "goods-quantity" },
                              "x" + vue.toDisplayString(item.quantity),
                              1
                              /* TEXT */
                            )
                          ])
                        ])
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  vue.createElementVNode("view", { class: "order-footer" }, [
                    vue.createElementVNode("view", { class: "order-total" }, [
                      vue.createElementVNode(
                        "text",
                        null,
                        "共" + vue.toDisplayString(order.goods.length) + "件商品",
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("text", { class: "total-text" }, [
                        vue.createTextVNode("实付 "),
                        vue.createVNode(_component_ui_price, {
                          value: order.totalPrice,
                          size: 28
                        }, null, 8, ["value"])
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "order-actions" }, [
                      order.status === "pending" ? (vue.openBlock(), vue.createBlock(_component_ui_button, {
                        key: 0,
                        size: "sm",
                        onClick: vue.withModifiers(($event) => $setup.handlePay(order), ["stop"])
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("立即付款")
                        ]),
                        _: 2
                        /* DYNAMIC */
                      }, 1032, ["onClick"])) : vue.createCommentVNode("v-if", true),
                      order.status === "received" ? (vue.openBlock(), vue.createBlock(_component_ui_button, {
                        key: 1,
                        size: "sm",
                        type: "primary",
                        onClick: vue.withModifiers(($event) => $setup.handleConfirm(order), ["stop"])
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("确认收货")
                        ]),
                        _: 2
                        /* DYNAMIC */
                      }, 1032, ["onClick"])) : vue.createCommentVNode("v-if", true),
                      order.status === "reviewed" ? (vue.openBlock(), vue.createBlock(_component_ui_button, {
                        key: 2,
                        size: "sm",
                        type: "primary",
                        onClick: vue.withModifiers(($event) => $setup.goEvaluate(order), ["stop"])
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("去评价")
                        ]),
                        _: 2
                        /* DYNAMIC */
                      }, 1032, ["onClick"])) : vue.createCommentVNode("v-if", true)
                    ])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]))
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesSubTradeOrderList = /* @__PURE__ */ _export_sfc(_sfc_main$T, [["render", _sfc_render$T], ["__scopeId", "data-v-f5a8a0da"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/trade/order/list.vue"]]);
  const _sfc_main$S = /* @__PURE__ */ vue.defineComponent({
    __name: "detail",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 120
      });
      const order = vue.ref({
        id: 1,
        orderNo: "XM202401150001",
        shopName: "数码达人小店",
        status: "received",
        createTime: "2024-01-15 10:30:00",
        payMethod: "微信支付",
        goodsTotal: 9398,
        freight: 0,
        totalPrice: 9398,
        goods: [
          { id: 1, cover: "https://picsum.photos/200/200?random=501", title: "iPhone 15 Pro Max 256GB", spec: "钛金属原色", price: 7999, quantity: 1 },
          { id: 2, cover: "https://picsum.photos/200/200?random=502", title: "AirPods Pro 第二代", spec: "USB-C", price: 1399, quantity: 1 }
        ]
      });
      const address = vue.ref({
        name: "张三",
        phone: "138****8888",
        detail: "北京市朝阳区建国路88号SOHO现代城A座1201室"
      });
      const statusConfig = vue.computed(() => {
        const configs = {
          pending: { icon: "clock", color: "#FF9500", text: "待付款", desc: "请在30分钟内完成付款" },
          shipped: { icon: "package", color: "#007AFF", text: "待发货", desc: "商家正在准备发货" },
          received: { icon: "truck", color: "#1ABC9C", text: "待收货", desc: "商品正在配送中" },
          completed: { icon: "check-circle", color: "#34C759", text: "已完成", desc: "订单已完成" }
        };
        return configs[order.value.status] || configs.pending;
      });
      const handlePay = () => {
        uni.navigateTo({ url: `/pages-sub/trade/pay/index?id=${order.value.id}` });
      };
      const handleConfirm = () => {
        uni.showModal({
          title: "确认收货",
          content: "确认已收到商品吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({ title: "确认成功", icon: "success" });
            }
          }
        });
      };
      const goEvaluate = () => {
        uni.navigateTo({ url: `/pages-sub/trade/evaluate/index?id=${order.value.id}` });
      };
      const __returned__ = { safeAreaBottom, scrollHeight, order, address, statusConfig, handlePay, handleConfirm, goEvaluate };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$S(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_price = vue.resolveComponent("ui-price");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "order-detail-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "订单详情" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "detail-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "status-card" }, [
            vue.createElementVNode("view", { class: "status-icon" }, [
              vue.createVNode(_component_ui_icon, {
                name: $setup.statusConfig.icon,
                size: 48,
                color: $setup.statusConfig.color
              }, null, 8, ["name", "color"])
            ]),
            vue.createElementVNode(
              "text",
              { class: "status-text" },
              vue.toDisplayString($setup.statusConfig.text),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "status-desc" },
              vue.toDisplayString($setup.statusConfig.desc),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "address-card" }, [
            vue.createElementVNode("view", { class: "address-header" }, [
              vue.createVNode(_component_ui_icon, {
                name: "map-pin",
                ":size": 40
              }),
              vue.createElementVNode(
                "text",
                { class: "address-name" },
                vue.toDisplayString($setup.address.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "address-phone" },
                vue.toDisplayString($setup.address.phone),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode(
              "text",
              { class: "address-detail" },
              vue.toDisplayString($setup.address.detail),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "goods-card" }, [
            vue.createElementVNode("view", { class: "shop-header" }, [
              vue.createVNode(_component_ui_icon, {
                name: "store",
                ":size": 40
              }),
              vue.createElementVNode(
                "text",
                { class: "shop-name" },
                vue.toDisplayString($setup.order.shopName),
                1
                /* TEXT */
              )
            ]),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.order.goods, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "goods-item"
                }, [
                  vue.createVNode(_component_ui_image, {
                    src: item.cover,
                    width: "160rpx",
                    height: "160rpx",
                    radius: "8rpx"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "goods-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "goods-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "goods-spec" },
                      vue.toDisplayString(item.spec),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "goods-bottom" }, [
                      vue.createVNode(_component_ui_price, {
                        value: item.price,
                        ":size": 40
                      }, null, 8, ["value"]),
                      vue.createElementVNode(
                        "text",
                        { class: "goods-quantity" },
                        "x" + vue.toDisplayString(item.quantity),
                        1
                        /* TEXT */
                      )
                    ])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "info-card" }, [
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("text", { class: "info-label" }, "订单编号"),
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($setup.order.orderNo),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("text", { class: "info-label" }, "下单时间"),
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($setup.order.createTime),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("text", { class: "info-label" }, "支付方式"),
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($setup.order.payMethod),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "price-card" }, [
            vue.createElementVNode("view", { class: "price-item" }, [
              vue.createElementVNode("text", { class: "price-label" }, "商品总额"),
              vue.createElementVNode(
                "text",
                { class: "price-value" },
                "¥" + vue.toDisplayString($setup.order.goodsTotal),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "price-item" }, [
              vue.createElementVNode("text", { class: "price-label" }, "运费"),
              vue.createElementVNode(
                "text",
                { class: "price-value" },
                "¥" + vue.toDisplayString($setup.order.freight),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "price-item total" }, [
              vue.createElementVNode("text", { class: "price-label" }, "实付款"),
              vue.createVNode(_component_ui_price, {
                value: $setup.order.totalPrice,
                ":size": 40
              }, null, 8, ["value"])
            ])
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "detail-footer",
          style: vue.normalizeStyle({ paddingBottom: $setup.safeAreaBottom + 12 + "px" })
        },
        [
          $setup.order.status === "pending" ? (vue.openBlock(), vue.createBlock(_component_ui_button, {
            key: 0,
            type: "primary",
            block: "",
            onClick: $setup.handlePay
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("立即付款")
            ]),
            _: 1
            /* STABLE */
          })) : vue.createCommentVNode("v-if", true),
          $setup.order.status === "received" ? (vue.openBlock(), vue.createBlock(_component_ui_button, {
            key: 1,
            type: "primary",
            block: "",
            onClick: $setup.handleConfirm
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("确认收货")
            ]),
            _: 1
            /* STABLE */
          })) : vue.createCommentVNode("v-if", true),
          $setup.order.status === "completed" ? (vue.openBlock(), vue.createBlock(_component_ui_button, {
            key: 2,
            block: "",
            onClick: $setup.goEvaluate
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("去评价")
            ]),
            _: 1
            /* STABLE */
          })) : vue.createCommentVNode("v-if", true)
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesSubTradeOrderDetail = /* @__PURE__ */ _export_sfc(_sfc_main$S, [["render", _sfc_render$S], ["__scopeId", "data-v-d9c06de8"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/trade/order/detail.vue"]]);
  const _sfc_main$R = /* @__PURE__ */ vue.defineComponent({
    __name: "confirm",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 180
      });
      const showRemark = vue.ref(false);
      const remark = vue.ref("");
      const address = vue.ref({
        id: 1,
        name: "张三",
        phone: "138****8888",
        detail: "北京市朝阳区建国路88号SOHO现代城A座1201室"
      });
      const order = vue.ref({
        shopName: "数码达人小店",
        goodsTotal: 9398,
        freight: 0,
        totalPrice: 9398,
        goods: [
          { id: 1, cover: "https://picsum.photos/200/200?random=601", title: "iPhone 15 Pro Max 256GB", spec: "钛金属原色", price: 7999, quantity: 1 },
          { id: 2, cover: "https://picsum.photos/200/200?random=602", title: "AirPods Pro 第二代", spec: "USB-C", price: 1399, quantity: 1 }
        ]
      });
      const selectAddress = () => {
        uni.navigateTo({ url: "/pages-sub/user/address/list?select=1" });
      };
      const handleSubmit = () => {
        if (!address.value) {
          uni.showToast({ title: "请选择收货地址", icon: "none" });
          return;
        }
        uni.showLoading({ title: "提交中..." });
        setTimeout(() => {
          uni.hideLoading();
          uni.redirectTo({ url: "/pages-sub/trade/pay/index?id=1" });
        }, 1e3);
      };
      const __returned__ = { safeAreaBottom, scrollHeight, showRemark, remark, address, order, selectAddress, handleSubmit };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$R(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_price = vue.resolveComponent("ui-price");
    const _component_ui_button = vue.resolveComponent("ui-button");
    const _component_ui_popup = vue.resolveComponent("ui-popup");
    return vue.openBlock(), vue.createElementBlock("view", { class: "confirm-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "确认订单" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "confirm-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("view", {
            class: "address-card",
            onClick: $setup.selectAddress
          }, [
            $setup.address ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "address-content"
            }, [
              vue.createElementVNode("view", { class: "address-header" }, [
                vue.createVNode(_component_ui_icon, {
                  name: "map-pin",
                  ":size": 40
                }),
                vue.createElementVNode(
                  "text",
                  { class: "address-name" },
                  vue.toDisplayString($setup.address.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "address-phone" },
                  vue.toDisplayString($setup.address.phone),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode(
                "text",
                { class: "address-detail" },
                vue.toDisplayString($setup.address.detail),
                1
                /* TEXT */
              )
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "address-empty"
            }, [
              vue.createVNode(_component_ui_icon, {
                name: "plus",
                ":size": 40
              }),
              vue.createElementVNode("text", null, "添加收货地址")
            ])),
            vue.createVNode(_component_ui_icon, {
              name: "arrow-right",
              ":size": 40
            })
          ]),
          vue.createElementVNode("view", { class: "goods-card" }, [
            vue.createElementVNode("view", { class: "shop-header" }, [
              vue.createVNode(_component_ui_icon, {
                name: "store",
                ":size": 40
              }),
              vue.createElementVNode(
                "text",
                { class: "shop-name" },
                vue.toDisplayString($setup.order.shopName),
                1
                /* TEXT */
              )
            ]),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.order.goods, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "goods-item"
                }, [
                  vue.createVNode(_component_ui_image, {
                    src: item.cover,
                    width: "160rpx",
                    height: "160rpx",
                    radius: "8rpx"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "goods-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "goods-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "goods-spec" },
                      vue.toDisplayString(item.spec),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "goods-bottom" }, [
                      vue.createVNode(_component_ui_price, {
                        value: item.price,
                        ":size": 40
                      }, null, 8, ["value"]),
                      vue.createElementVNode(
                        "text",
                        { class: "goods-quantity" },
                        "x" + vue.toDisplayString(item.quantity),
                        1
                        /* TEXT */
                      )
                    ])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "info-card" }, [
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("text", { class: "info-label" }, "配送方式"),
              vue.createElementVNode("text", { class: "info-value" }, "快递包邮")
            ]),
            vue.createElementVNode("view", {
              class: "info-item",
              onClick: _cache[0] || (_cache[0] = ($event) => $setup.showRemark = true)
            }, [
              vue.createElementVNode("text", { class: "info-label" }, "订单备注"),
              vue.createElementVNode("view", { class: "info-right" }, [
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($setup.remark || "选填"),
                  1
                  /* TEXT */
                ),
                vue.createVNode(_component_ui_icon, {
                  name: "arrow-right",
                  ":size": 32
                })
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "price-card" }, [
            vue.createElementVNode("view", { class: "price-item" }, [
              vue.createElementVNode("text", { class: "price-label" }, "商品总额"),
              vue.createElementVNode(
                "text",
                { class: "price-value" },
                "¥" + vue.toDisplayString($setup.order.goodsTotal),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "price-item" }, [
              vue.createElementVNode("text", { class: "price-label" }, "运费"),
              vue.createElementVNode(
                "text",
                { class: "price-value" },
                "¥" + vue.toDisplayString($setup.order.freight),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "price-item total" }, [
              vue.createElementVNode("text", { class: "price-label" }, "合计"),
              vue.createVNode(_component_ui_price, {
                value: $setup.order.totalPrice,
                ":size": 40
              }, null, 8, ["value"])
            ])
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "confirm-footer",
          style: vue.normalizeStyle({ paddingBottom: $setup.safeAreaBottom + 12 + "px" })
        },
        [
          vue.createElementVNode("view", { class: "footer-left" }, [
            vue.createElementVNode("text", { class: "total-label" }, "实付款："),
            vue.createVNode(_component_ui_price, {
              value: $setup.order.totalPrice,
              type: "main",
              size: 36
            }, null, 8, ["value"])
          ]),
          vue.createVNode(_component_ui_button, {
            type: "primary",
            onClick: $setup.handleSubmit
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("提交订单")
            ]),
            _: 1
            /* STABLE */
          })
        ],
        4
        /* STYLE */
      ),
      vue.createVNode(_component_ui_popup, {
        modelValue: $setup.showRemark,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.showRemark = $event),
        position: "bottom",
        round: ""
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "remark-popup" }, [
            vue.createElementVNode("view", { class: "popup-header" }, [
              vue.createElementVNode("text", { class: "popup-title" }, "订单备注"),
              vue.createElementVNode("text", {
                class: "popup-confirm",
                onClick: _cache[1] || (_cache[1] = ($event) => $setup.showRemark = false)
              }, "确定")
            ]),
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.remark = $event),
                class: "remark-input",
                placeholder: "请输入备注信息（选填）",
                maxlength: 100
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.remark]
            ])
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"])
    ]);
  }
  const PagesSubTradeOrderConfirm = /* @__PURE__ */ _export_sfc(_sfc_main$R, [["render", _sfc_render$R], ["__scopeId", "data-v-67503707"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/trade/order/confirm.vue"]]);
  const _sfc_main$Q = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaTop, safeAreaBottom } = usePageLayout({
        hasSubNavbar: true
      });
      const amount = vue.ref("9398.00");
      const orderInfo = vue.ref("iPhone 15 Pro Max 256GB 等2件商品");
      const selectedMethod = vue.ref("wechat");
      const paying = vue.ref(false);
      const countdown = vue.ref(1800);
      let timer = null;
      const payMethods = vue.ref([
        { id: "wechat", name: "微信支付", icon: "message", color: "#07C160" },
        { id: "alipay", name: "支付宝", icon: "credit-card", color: "#1677FF" }
      ]);
      const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
      };
      const handlePay = () => {
        paying.value = true;
        setTimeout(() => {
          paying.value = false;
          uni.showToast({ title: "支付成功", icon: "success" });
          setTimeout(() => {
            uni.redirectTo({ url: "/pages-sub/trade/order/detail?id=1" });
          }, 1500);
        }, 2e3);
      };
      vue.onMounted(() => {
        timer = setInterval(() => {
          if (countdown.value > 0) {
            countdown.value--;
          } else {
            if (timer)
              clearInterval(timer);
          }
        }, 1e3);
      });
      vue.onUnmounted(() => {
        if (timer)
          clearInterval(timer);
      });
      const __returned__ = { safeAreaTop, safeAreaBottom, amount, orderInfo, selectedMethod, paying, countdown, get timer() {
        return timer;
      }, set timer(v) {
        timer = v;
      }, payMethods, formatTime, handlePay };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$Q(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "pay-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "支付" }),
      vue.createElementVNode(
        "view",
        {
          class: "pay-content",
          style: vue.normalizeStyle({ paddingTop: $setup.safeAreaTop + "px" })
        },
        [
          vue.createElementVNode("view", { class: "amount-card" }, [
            vue.createElementVNode("text", { class: "amount-label" }, "支付金额"),
            vue.createElementVNode("view", { class: "amount-value" }, [
              vue.createElementVNode("text", { class: "currency" }, "¥"),
              vue.createElementVNode(
                "text",
                { class: "number" },
                vue.toDisplayString($setup.amount),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "order-info" }, [
            vue.createElementVNode("text", { class: "info-label" }, "订单信息"),
            vue.createElementVNode(
              "text",
              { class: "info-value" },
              vue.toDisplayString($setup.orderInfo),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "pay-methods" }, [
            vue.createElementVNode("text", { class: "section-title" }, "选择支付方式"),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.payMethods, (method) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: method.id,
                  class: vue.normalizeClass(["method-item", { active: $setup.selectedMethod === method.id }]),
                  onClick: ($event) => $setup.selectedMethod = method.id
                }, [
                  vue.createElementVNode("view", { class: "method-left" }, [
                    vue.createVNode(_component_ui_icon, {
                      name: method.icon,
                      ":size": 40,
                      color: method.color
                    }, null, 8, ["name", "color"]),
                    vue.createElementVNode(
                      "text",
                      { class: "method-name" },
                      vue.toDisplayString(method.name),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createVNode(_component_ui_icon, {
                    name: $setup.selectedMethod === method.id ? "check-circle-fill" : "circle",
                    ":size": 40,
                    color: $setup.selectedMethod === method.id ? "#1ABC9C" : "#A1A1A6"
                  }, null, 8, ["name", "color"])
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          $setup.countdown > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "countdown"
          }, [
            vue.createElementVNode(
              "text",
              null,
              "支付剩余时间 " + vue.toDisplayString($setup.formatTime($setup.countdown)),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true)
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "pay-footer",
          style: vue.normalizeStyle({ paddingBottom: $setup.safeAreaBottom + 12 + "px" })
        },
        [
          vue.createVNode(_component_ui_button, {
            type: "primary",
            block: "",
            loading: $setup.paying,
            onClick: $setup.handlePay
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(
                " 立即支付 ¥" + vue.toDisplayString($setup.amount),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          }, 8, ["loading"])
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesSubTradePayIndex = /* @__PURE__ */ _export_sfc(_sfc_main$Q, [["render", _sfc_render$Q], ["__scopeId", "data-v-5064f069"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/trade/pay/index.vue"]]);
  const _sfc_main$P = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 120
      });
      const content = vue.ref("");
      const images = vue.ref([]);
      const selectedTags = vue.ref([]);
      const ratings = vue.ref({
        desc: 5,
        logistics: 5,
        service: 5
      });
      const goodsList = vue.ref([
        { id: 1, cover: "https://picsum.photos/200/200?random=701", title: "iPhone 15 Pro Max 256GB", spec: "钛金属原色" },
        { id: 2, cover: "https://picsum.photos/200/200?random=702", title: "AirPods Pro 第二代", spec: "USB-C" }
      ]);
      const tagList = vue.ref([
        "质量很好",
        "发货很快",
        "包装精美",
        "价格实惠",
        "描述相符",
        "服务态度好",
        "物流给力",
        "性价比高"
      ]);
      const canSubmit = vue.computed(() => content.value.trim().length >= 10);
      const toggleTag = (tag) => {
        const index = selectedTags.value.indexOf(tag);
        if (index > -1) {
          selectedTags.value.splice(index, 1);
        } else {
          selectedTags.value.push(tag);
        }
      };
      const handleSubmit = () => {
        if (!canSubmit.value) {
          uni.showToast({ title: "请输入至少10个字", icon: "none" });
          return;
        }
        uni.showLoading({ title: "提交中..." });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({ title: "评价成功", icon: "success" });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }, 1e3);
      };
      const __returned__ = { safeAreaBottom, scrollHeight, content, images, selectedTags, ratings, goodsList, tagList, canSubmit, toggleTag, handleSubmit };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$P(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_rate = vue.resolveComponent("ui-rate");
    const _component_ui_upload = vue.resolveComponent("ui-upload");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "evaluate-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "评价" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "evaluate-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "goods-card" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.goodsList, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "goods-item"
                }, [
                  vue.createVNode(_component_ui_image, {
                    src: item.cover,
                    width: "120rpx",
                    height: "120rpx",
                    radius: "8rpx"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "goods-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "goods-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "goods-spec" },
                      vue.toDisplayString(item.spec),
                      1
                      /* TEXT */
                    )
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "rating-card" }, [
            vue.createElementVNode("text", { class: "section-title" }, "商品评分"),
            vue.createElementVNode("view", { class: "rating-item" }, [
              vue.createElementVNode("text", { class: "rating-label" }, "描述相符"),
              vue.createVNode(_component_ui_rate, {
                modelValue: $setup.ratings.desc,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.ratings.desc = $event)
              }, null, 8, ["modelValue"])
            ]),
            vue.createElementVNode("view", { class: "rating-item" }, [
              vue.createElementVNode("text", { class: "rating-label" }, "物流服务"),
              vue.createVNode(_component_ui_rate, {
                modelValue: $setup.ratings.logistics,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.ratings.logistics = $event)
              }, null, 8, ["modelValue"])
            ]),
            vue.createElementVNode("view", { class: "rating-item" }, [
              vue.createElementVNode("text", { class: "rating-label" }, "服务态度"),
              vue.createVNode(_component_ui_rate, {
                modelValue: $setup.ratings.service,
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.ratings.service = $event)
              }, null, 8, ["modelValue"])
            ])
          ]),
          vue.createElementVNode("view", { class: "content-card" }, [
            vue.createElementVNode("text", { class: "section-title" }, "评价内容"),
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.content = $event),
                class: "content-input",
                placeholder: "分享你的购物体验吧~",
                maxlength: 500
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.content]
            ]),
            vue.createElementVNode(
              "text",
              { class: "word-count" },
              vue.toDisplayString($setup.content.length) + "/500",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "image-card" }, [
            vue.createElementVNode("text", { class: "section-title" }, "上传图片（选填）"),
            vue.createVNode(_component_ui_upload, {
              modelValue: $setup.images,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.images = $event),
              "max-count": 9
            }, null, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { class: "tags-card" }, [
            vue.createElementVNode("text", { class: "section-title" }, "快捷标签"),
            vue.createElementVNode("view", { class: "tags-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.tagList, (tag) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: tag,
                    class: vue.normalizeClass(["tag-item", { active: $setup.selectedTags.includes(tag) }]),
                    onClick: ($event) => $setup.toggleTag(tag)
                  }, vue.toDisplayString(tag), 11, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "evaluate-footer",
          style: vue.normalizeStyle({ paddingBottom: $setup.safeAreaBottom + 12 + "px" })
        },
        [
          vue.createVNode(_component_ui_button, {
            type: "primary",
            block: "",
            disabled: !$setup.canSubmit,
            onClick: $setup.handleSubmit
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(" 提交评价 ")
            ]),
            _: 1
            /* STABLE */
          }, 8, ["disabled"])
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesSubTradeEvaluateIndex = /* @__PURE__ */ _export_sfc(_sfc_main$P, [["render", _sfc_render$P], ["__scopeId", "data-v-e7f5ae20"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/trade/evaluate/index.vue"]]);
  const _sfc_main$O = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaTop, headerExtraTop, scrollHeight } = usePageLayout({
        hasSubNavbar: false,
        headerEstimatedHeight: 100
      });
      const keyword = vue.ref("");
      const hasSearched = vue.ref(false);
      const historyList = vue.ref([
        "iPhone 15",
        "MacBook Pro",
        "AirPods",
        "Sony 耳机"
      ]);
      const hotList = vue.ref([
        { keyword: "iPhone 15 Pro Max", isHot: true },
        { keyword: "MacBook Pro M3", isHot: true },
        { keyword: "AirPods Pro 2", isHot: false },
        { keyword: "iPad Pro", isHot: false },
        { keyword: "Nintendo Switch", isHot: false },
        { keyword: "Sony 相机", isHot: false },
        { keyword: "华为 Mate 60", isHot: true },
        { keyword: "小米 14", isHot: false }
      ]);
      const resultList = vue.ref([
        { id: 1, cover: "https://picsum.photos/200/200?random=801", title: "iPhone 15 Pro Max 256GB 钛金属原色", price: 7999, sales: 128, tags: ["99新", "在保"] },
        { id: 2, cover: "https://picsum.photos/200/200?random=802", title: "iPhone 15 Pro 128GB 蓝色钛金属", price: 6999, sales: 89, tags: ["全新", "官方"] },
        { id: 3, cover: "https://picsum.photos/200/200?random=803", title: "iPhone 15 Plus 256GB 粉色", price: 5999, sales: 56, tags: ["95新", "送壳"] }
      ]);
      const handleSearch = () => {
        if (!keyword.value.trim())
          return;
        if (!historyList.value.includes(keyword.value)) {
          historyList.value.unshift(keyword.value);
          if (historyList.value.length > 10) {
            historyList.value.pop();
          }
        }
        hasSearched.value = true;
      };
      const searchByKeyword = (word) => {
        keyword.value = word;
        handleSearch();
      };
      const clearHistory = () => {
        historyList.value = [];
      };
      const goBack = () => {
        uni.navigateBack();
      };
      const goDetail = (item) => {
        uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.id}` });
      };
      const __returned__ = { safeAreaTop, headerExtraTop, scrollHeight, keyword, hasSearched, historyList, hotList, resultList, handleSearch, searchByKeyword, clearHistory, goBack, goDetail };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$O(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_search = vue.resolveComponent("ui-search");
    const _component_ui_tag = vue.resolveComponent("ui-tag");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_price = vue.resolveComponent("ui-price");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "search-page",
        style: vue.normalizeStyle({ paddingTop: $setup.safeAreaTop + $setup.headerExtraTop + "px" })
      },
      [
        vue.createElementVNode("view", { class: "search-header" }, [
          vue.createVNode(_component_ui_search, {
            modelValue: $setup.keyword,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.keyword = $event),
            placeholder: "搜索数码产品型号...",
            focus: true,
            onSearch: $setup.handleSearch
          }, null, 8, ["modelValue"]),
          vue.createElementVNode("text", {
            class: "cancel-btn",
            onClick: $setup.goBack
          }, "取消")
        ]),
        vue.createElementVNode(
          "scroll-view",
          {
            "scroll-y": "",
            class: "search-scroll",
            style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
          },
          [
            !$setup.hasSearched ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "search-default"
            }, [
              $setup.historyList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "history-section"
              }, [
                vue.createElementVNode("view", { class: "section-header" }, [
                  vue.createElementVNode("text", { class: "section-title" }, "搜索历史"),
                  vue.createElementVNode("text", {
                    class: "clear-btn",
                    onClick: $setup.clearHistory
                  }, "清空")
                ]),
                vue.createElementVNode("view", { class: "history-list" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($setup.historyList, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("text", {
                        key: index,
                        class: "history-item",
                        onClick: ($event) => $setup.searchByKeyword(item)
                      }, vue.toDisplayString(item), 9, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "hot-section" }, [
                vue.createElementVNode("text", { class: "section-title" }, "热门搜索"),
                vue.createElementVNode("view", { class: "hot-list" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($setup.hotList, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        key: index,
                        class: "hot-item",
                        onClick: ($event) => $setup.searchByKeyword(item.keyword)
                      }, [
                        vue.createElementVNode(
                          "text",
                          {
                            class: vue.normalizeClass(["hot-rank", { top: index < 3 }])
                          },
                          vue.toDisplayString(index + 1),
                          3
                          /* TEXT, CLASS */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "hot-keyword" },
                          vue.toDisplayString(item.keyword),
                          1
                          /* TEXT */
                        ),
                        item.isHot ? (vue.openBlock(), vue.createBlock(_component_ui_tag, {
                          key: 0,
                          type: "danger",
                          size: "xs"
                        }, {
                          default: vue.withCtx(() => [
                            vue.createTextVNode("热")
                          ]),
                          _: 1
                          /* STABLE */
                        })) : vue.createCommentVNode("v-if", true)
                      ], 8, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "search-result"
            }, [
              vue.createElementVNode("view", { class: "result-header" }, [
                vue.createElementVNode(
                  "text",
                  { class: "result-count" },
                  "找到 " + vue.toDisplayString($setup.resultList.length) + " 个商品",
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "result-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.resultList, (item) => {
                    var _a;
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: item.id,
                      class: "result-item",
                      onClick: ($event) => $setup.goDetail(item)
                    }, [
                      vue.createVNode(_component_ui_image, {
                        src: item.cover,
                        width: "180rpx",
                        height: "180rpx",
                        radius: "8rpx"
                      }, null, 8, ["src"]),
                      vue.createElementVNode("view", { class: "item-info" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "item-title" },
                          vue.toDisplayString(item.title),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("view", { class: "item-tags" }, [
                          (vue.openBlock(true), vue.createElementBlock(
                            vue.Fragment,
                            null,
                            vue.renderList((_a = item.tags) == null ? void 0 : _a.slice(0, 2), (tag) => {
                              return vue.openBlock(), vue.createBlock(
                                _component_ui_tag,
                                {
                                  key: tag,
                                  type: "primary",
                                  size: "sm"
                                },
                                {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode(
                                      vue.toDisplayString(tag),
                                      1
                                      /* TEXT */
                                    )
                                  ]),
                                  _: 2
                                  /* DYNAMIC */
                                },
                                1024
                                /* DYNAMIC_SLOTS */
                              );
                            }),
                            128
                            /* KEYED_FRAGMENT */
                          ))
                        ]),
                        vue.createElementVNode("view", { class: "item-bottom" }, [
                          vue.createVNode(_component_ui_price, {
                            value: item.price,
                            type: "main",
                            size: 28
                          }, null, 8, ["value"]),
                          vue.createElementVNode(
                            "text",
                            { class: "item-sales" },
                            vue.toDisplayString(item.sales) + "人付款",
                            1
                            /* TEXT */
                          )
                        ])
                      ])
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ]))
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesSubTradeSearchIndex = /* @__PURE__ */ _export_sfc(_sfc_main$O, [["render", _sfc_render$O], ["__scopeId", "data-v-480a0fb1"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/trade/search/index.vue"]]);
  const _sfc_main$N = /* @__PURE__ */ vue.defineComponent({
    __name: "entry",
    setup(__props, { expose: __expose }) {
      __expose();
      const form = vue.ref({
        title: "",
        description: "",
        images: [],
        category: "",
        condition: "",
        price: "",
        canBargin: false,
        specs: ""
      });
      const conditions = ["全新", "99新", "95新", "9新", "85新", "8新及以下"];
      const showCategoryPicker = vue.ref(false);
      const handlePublish = () => {
        if (!form.value.title) {
          uni.showToast({ title: "请输入商品标题", icon: "none" });
          return;
        }
        if (!form.value.description) {
          uni.showToast({ title: "请输入商品描述", icon: "none" });
          return;
        }
        if (!form.value.price) {
          uni.showToast({ title: "请输入商品价格", icon: "none" });
          return;
        }
        uni.showLoading({ title: "发布中..." });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({ title: "发布成功", icon: "success" });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }, 1e3);
      };
      const __returned__ = { form, conditions, showCategoryPicker, handlePublish };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$N(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_input = vue.resolveComponent("ui-input");
    const _component_ui_upload = vue.resolveComponent("ui-upload");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_switch = vue.resolveComponent("ui-switch");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "publish-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "发布闲置" }),
      vue.createElementVNode("view", { class: "publish-container" }, [
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "form-label" }, "商品标题"),
          vue.createVNode(_component_ui_input, {
            modelValue: $setup.form.title,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.form.title = $event),
            placeholder: "标题越详细越容易卖出",
            maxlength: 50
          }, null, 8, ["modelValue"])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "form-label" }, "商品描述"),
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              class: "desc-textarea",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.form.description = $event),
              placeholder: "描述商品的来源、使用情况、优缺点等...",
              maxlength: 500
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.form.description]
          ]),
          vue.createElementVNode(
            "text",
            { class: "word-count" },
            vue.toDisplayString($setup.form.description.length) + "/500",
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "form-label" }, "上传图片"),
          vue.createVNode(_component_ui_upload, {
            modelValue: $setup.form.images,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.form.images = $event),
            "max-count": 9
          }, null, 8, ["modelValue"])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "form-label" }, "商品分类"),
          vue.createElementVNode("view", {
            class: "category-select",
            onClick: _cache[3] || (_cache[3] = ($event) => $setup.showCategoryPicker = true)
          }, [
            vue.createElementVNode(
              "text",
              {
                class: vue.normalizeClass({ placeholder: !$setup.form.category })
              },
              vue.toDisplayString($setup.form.category || "请选择分类"),
              3
              /* TEXT, CLASS */
            ),
            vue.createVNode(_component_ui_icon, {
              name: "arrow-right",
              ":size": 32
            })
          ])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "form-label" }, "商品成色"),
          vue.createElementVNode("view", { class: "condition-list" }, [
            (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.conditions, (item) => {
                return vue.createElementVNode("view", {
                  key: item,
                  class: vue.normalizeClass(["condition-item", { active: $setup.form.condition === item }]),
                  onClick: ($event) => $setup.form.condition = item
                }, vue.toDisplayString(item), 11, ["onClick"]);
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "form-label" }, "出售价格"),
          vue.createElementVNode("view", { class: "price-input" }, [
            vue.createElementVNode("text", { class: "price-symbol" }, "¥"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "digit",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.form.price = $event),
                placeholder: "0",
                class: "price-field"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.form.price]
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "form-label" }, "是否支持议价"),
          vue.createVNode(_component_ui_switch, {
            modelValue: $setup.form.canBargin,
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.form.canBargin = $event)
          }, null, 8, ["modelValue"])
        ]),
        vue.createElementVNode("view", { class: "form-section" }, [
          vue.createElementVNode("view", { class: "form-label" }, "商品规格 (选填)"),
          vue.createVNode(_component_ui_input, {
            modelValue: $setup.form.specs,
            "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.form.specs = $event),
            placeholder: "如: iPhone 13 Pro Max / 256G / 远峰蓝"
          }, null, 8, ["modelValue"])
        ]),
        vue.createElementVNode("view", { class: "publish-btn-wrapper" }, [
          vue.createVNode(_component_ui_button, {
            block: "",
            onClick: $setup.handlePublish
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("发布闲置")
            ]),
            _: 1
            /* STABLE */
          })
        ])
      ])
    ]);
  }
  const PagesSubSellerPublishEntry = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["render", _sfc_render$N], ["__scopeId", "data-v-08e20129"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/seller/publish/entry.vue"]]);
  const _sfc_main$M = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 120
      });
      const shopInfo = vue.ref({
        logo: "https://picsum.photos/200/200?random=shop",
        name: "数码达人小店",
        desc: "专注正品数码，诚信经营",
        isVerified: true,
        goodsCount: 56,
        salesCount: 1289,
        followers: 3680
      });
      const orderCounts = vue.ref({
        pending: 5,
        shipped: 12,
        completed: 89,
        refund: 2
      });
      const goodsList = vue.ref([
        { id: 1, cover: "https://picsum.photos/200/200?random=g1", title: "iPhone 15 Pro Max", price: 7999, stock: 10 },
        { id: 2, cover: "https://picsum.photos/200/200?random=g2", title: "MacBook Pro 14", price: 12999, stock: 5 },
        { id: 3, cover: "https://picsum.photos/200/200?random=g3", title: "AirPods Pro 2", price: 1399, stock: 30 },
        { id: 4, cover: "https://picsum.photos/200/200?random=g4", title: "iPad Pro 12.9", price: 6999, stock: 8 }
      ]);
      const goPublish = () => {
        uni.navigateTo({ url: "/pages-sub/seller/publish/entry" });
      };
      const goGoodsList = () => {
        uni.navigateTo({ url: "/pages-sub/seller/goods/list" });
      };
      const goOrderList = (type) => {
        const url = type ? `/pages-sub/seller/order/list?type=${type}` : "/pages-sub/seller/order/list";
        uni.navigateTo({ url });
      };
      const goAfterSale = () => {
        uni.navigateTo({ url: "/pages-sub/seller/after-sale/list" });
      };
      const goEdit = (item) => {
        uni.navigateTo({ url: `/pages-sub/seller/goods/edit?id=${item.id}` });
      };
      const __returned__ = { safeAreaBottom, scrollHeight, shopInfo, orderCounts, goodsList, goPublish, goGoodsList, goOrderList, goAfterSale, goEdit };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$M(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_avatar = vue.resolveComponent("ui-avatar");
    const _component_ui_tag = vue.resolveComponent("ui-tag");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_price = vue.resolveComponent("ui-price");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "shop-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "我的店铺" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "shop-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "shop-header" }, [
            vue.createElementVNode("view", { class: "shop-info" }, [
              vue.createVNode(_component_ui_avatar, {
                src: $setup.shopInfo.logo,
                size: 120
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "shop-detail" }, [
                vue.createElementVNode(
                  "text",
                  { class: "shop-name" },
                  vue.toDisplayString($setup.shopInfo.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "shop-desc" },
                  vue.toDisplayString($setup.shopInfo.desc),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "shop-tags" }, [
                  $setup.shopInfo.isVerified ? (vue.openBlock(), vue.createBlock(_component_ui_tag, {
                    key: 0,
                    type: "success",
                    size: "sm"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("已认证")
                    ]),
                    _: 1
                    /* STABLE */
                  })) : vue.createCommentVNode("v-if", true),
                  vue.createVNode(_component_ui_tag, {
                    type: "primary",
                    size: "sm"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("营业中")
                    ]),
                    _: 1
                    /* STABLE */
                  })
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "shop-stats" }, [
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode(
                  "text",
                  { class: "stat-value" },
                  vue.toDisplayString($setup.shopInfo.goodsCount),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "stat-label" }, "商品")
              ]),
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode(
                  "text",
                  { class: "stat-value" },
                  vue.toDisplayString($setup.shopInfo.salesCount),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "stat-label" }, "销量")
              ]),
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode(
                  "text",
                  { class: "stat-value" },
                  vue.toDisplayString($setup.shopInfo.followers),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "stat-label" }, "粉丝")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "quick-actions" }, [
            vue.createElementVNode("view", {
              class: "action-item",
              onClick: $setup.goPublish
            }, [
              vue.createElementVNode("view", { class: "action-icon" }, [
                vue.createVNode(_component_ui_icon, {
                  name: "plus",
                  ":size": 40
                })
              ]),
              vue.createElementVNode("text", { class: "action-text" }, "发布商品")
            ]),
            vue.createElementVNode("view", {
              class: "action-item",
              onClick: $setup.goGoodsList
            }, [
              vue.createElementVNode("view", { class: "action-icon" }, [
                vue.createVNode(_component_ui_icon, {
                  name: "package",
                  ":size": 40
                })
              ]),
              vue.createElementVNode("text", { class: "action-text" }, "商品管理")
            ]),
            vue.createElementVNode("view", {
              class: "action-item",
              onClick: $setup.goOrderList
            }, [
              vue.createElementVNode("view", { class: "action-icon" }, [
                vue.createVNode(_component_ui_icon, {
                  name: "file-text",
                  ":size": 40
                })
              ]),
              vue.createElementVNode("text", { class: "action-text" }, "订单管理")
            ]),
            vue.createElementVNode("view", {
              class: "action-item",
              onClick: $setup.goAfterSale
            }, [
              vue.createElementVNode("view", { class: "action-icon" }, [
                vue.createVNode(_component_ui_icon, {
                  name: "refresh",
                  ":size": 40
                })
              ]),
              vue.createElementVNode("text", { class: "action-text" }, "售后管理")
            ])
          ]),
          vue.createElementVNode("view", { class: "order-overview" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "订单概览"),
              vue.createElementVNode("text", {
                class: "section-more",
                onClick: $setup.goOrderList
              }, "查看全部")
            ]),
            vue.createElementVNode("view", { class: "order-tabs" }, [
              vue.createElementVNode("view", {
                class: "order-item",
                onClick: _cache[0] || (_cache[0] = ($event) => $setup.goOrderList("pending"))
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "order-count" },
                  vue.toDisplayString($setup.orderCounts.pending),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "order-label" }, "待发货")
              ]),
              vue.createElementVNode("view", {
                class: "order-item",
                onClick: _cache[1] || (_cache[1] = ($event) => $setup.goOrderList("shipped"))
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "order-count" },
                  vue.toDisplayString($setup.orderCounts.shipped),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "order-label" }, "已发货")
              ]),
              vue.createElementVNode("view", {
                class: "order-item",
                onClick: _cache[2] || (_cache[2] = ($event) => $setup.goOrderList("completed"))
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "order-count" },
                  vue.toDisplayString($setup.orderCounts.completed),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "order-label" }, "已完成")
              ]),
              vue.createElementVNode("view", {
                class: "order-item",
                onClick: $setup.goAfterSale
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "order-count" },
                  vue.toDisplayString($setup.orderCounts.refund),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "order-label" }, "售后")
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "goods-section" }, [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("text", { class: "section-title" }, "在售商品"),
              vue.createElementVNode("text", {
                class: "section-more",
                onClick: $setup.goGoodsList
              }, "管理商品")
            ]),
            vue.createElementVNode("scroll-view", {
              "scroll-x": "",
              class: "goods-scroll"
            }, [
              vue.createElementVNode("view", { class: "goods-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.goodsList, (item) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: item.id,
                      class: "goods-item",
                      onClick: ($event) => $setup.goEdit(item)
                    }, [
                      vue.createVNode(_component_ui_image, {
                        src: item.cover,
                        width: "200rpx",
                        height: "200rpx",
                        radius: "8rpx"
                      }, null, 8, ["src"]),
                      vue.createElementVNode(
                        "text",
                        { class: "goods-title" },
                        vue.toDisplayString(item.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "goods-bottom" }, [
                        vue.createVNode(_component_ui_price, {
                          value: item.price,
                          ":size": 40
                        }, null, 8, ["value"]),
                        vue.createElementVNode(
                          "text",
                          { class: "goods-stock" },
                          "库存" + vue.toDisplayString(item.stock),
                          1
                          /* TEXT */
                        )
                      ])
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "shop-footer",
          style: vue.normalizeStyle({ paddingBottom: $setup.safeAreaBottom + 12 + "px" })
        },
        [
          vue.createVNode(_component_ui_button, {
            type: "primary",
            block: "",
            onClick: $setup.goPublish
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("发布新商品")
            ]),
            _: 1
            /* STABLE */
          })
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesSubSellerShopIndex = /* @__PURE__ */ _export_sfc(_sfc_main$M, [["render", _sfc_render$M], ["__scopeId", "data-v-9ee3e74a"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/seller/shop/index.vue"]]);
  const _sfc_main$L = /* @__PURE__ */ vue.defineComponent({
    __name: "manage",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 120
      });
      const showCategory = vue.ref(false);
      const shopInfo = vue.ref({
        logo: "https://picsum.photos/200/200?random=shop",
        name: "数码达人小店",
        id: "XM88888",
        desc: "专注正品数码，诚信经营，假一赔十",
        phone: "138****8888",
        wechat: "digital_master",
        category: "数码产品",
        address: "北京市朝阳区建国路88号",
        isOpen: true,
        autoAccept: false
      });
      const editLogo = () => {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            shopInfo.value.logo = res.tempFilePaths[0];
          }
        });
      };
      const handleSave = () => {
        uni.showLoading({ title: "保存中..." });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
        }, 1e3);
      };
      const __returned__ = { safeAreaBottom, scrollHeight, showCategory, shopInfo, editLogo, handleSave };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$L(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_avatar = vue.resolveComponent("ui-avatar");
    const _component_ui_button = vue.resolveComponent("ui-button");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_switch = vue.resolveComponent("ui-switch");
    return vue.openBlock(), vue.createElementBlock("view", { class: "shop-manage-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "店铺管理" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "manage-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "shop-card" }, [
            vue.createVNode(_component_ui_avatar, {
              src: $setup.shopInfo.logo,
              size: 100
            }, null, 8, ["src"]),
            vue.createElementVNode("view", { class: "shop-info" }, [
              vue.createElementVNode(
                "text",
                { class: "shop-name" },
                vue.toDisplayString($setup.shopInfo.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "shop-id" },
                "店铺ID: " + vue.toDisplayString($setup.shopInfo.id),
                1
                /* TEXT */
              )
            ]),
            vue.createVNode(_component_ui_button, {
              size: "sm",
              onClick: $setup.editLogo
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("修改头像")
              ]),
              _: 1
              /* STABLE */
            })
          ]),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "店铺名称"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.shopInfo.name = $event),
                  placeholder: "请输入店铺名称"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.shopInfo.name]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "店铺简介"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  class: "form-textarea",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.shopInfo.desc = $event),
                  placeholder: "请输入店铺简介",
                  maxlength: 200
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.shopInfo.desc]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "联系电话"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.shopInfo.phone = $event),
                  placeholder: "请输入联系电话",
                  type: "tel"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.shopInfo.phone]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "微信号"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.shopInfo.wechat = $event),
                  placeholder: "请输入微信号"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.shopInfo.wechat]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "经营类目"),
              vue.createElementVNode("view", {
                class: "form-select",
                onClick: _cache[4] || (_cache[4] = ($event) => $setup.showCategory = true)
              }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass({ placeholder: !$setup.shopInfo.category })
                  },
                  vue.toDisplayString($setup.shopInfo.category || "请选择类目"),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createVNode(_component_ui_icon, {
                  name: "arrow-right",
                  ":size": 32
                })
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "发货地址"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.shopInfo.address = $event),
                  placeholder: "请输入发货地址"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.shopInfo.address]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "switch-section" }, [
            vue.createElementVNode("view", { class: "switch-item" }, [
              vue.createElementVNode("text", { class: "switch-label" }, "店铺营业"),
              vue.createVNode(_component_ui_switch, {
                modelValue: $setup.shopInfo.isOpen,
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.shopInfo.isOpen = $event)
              }, null, 8, ["modelValue"])
            ]),
            vue.createElementVNode("view", { class: "switch-item" }, [
              vue.createElementVNode("text", { class: "switch-label" }, "自动接单"),
              vue.createVNode(_component_ui_switch, {
                modelValue: $setup.shopInfo.autoAccept,
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.shopInfo.autoAccept = $event)
              }, null, 8, ["modelValue"])
            ])
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "manage-footer",
          style: vue.normalizeStyle({ paddingBottom: $setup.safeAreaBottom + 12 + "px" })
        },
        [
          vue.createVNode(_component_ui_button, {
            type: "primary",
            block: "",
            onClick: $setup.handleSave
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("保存修改")
            ]),
            _: 1
            /* STABLE */
          })
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesSubSellerShopManage = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["render", _sfc_render$L], ["__scopeId", "data-v-5562ac6d"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/seller/shop/manage.vue"]]);
  const _sfc_main$K = /* @__PURE__ */ vue.defineComponent({
    __name: "list",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 208
      });
      const activeTab = vue.ref(0);
      const tabList = vue.ref([
        { name: "全部" },
        { name: "在售" },
        { name: "下架" }
      ]);
      const goodsList = vue.ref([
        { id: 1, cover: "https://picsum.photos/200/200?random=l1", title: "iPhone 15 Pro Max 256GB 钛金属原色", price: 7999, stock: 10, status: "on", isRecommend: true },
        { id: 2, cover: "https://picsum.photos/200/200?random=l2", title: "MacBook Pro 14寸 M3芯片", price: 12999, stock: 5, status: "on", isRecommend: false },
        { id: 3, cover: "https://picsum.photos/200/200?random=l3", title: "AirPods Pro 第二代", price: 1399, stock: 30, status: "on", isRecommend: true },
        { id: 4, cover: "https://picsum.photos/200/200?random=l4", title: "iPad Pro 12.9寸 M2", price: 6999, stock: 0, status: "off", isRecommend: false }
      ]);
      const goPublish = () => {
        uni.navigateTo({ url: "/pages-sub/seller/publish/entry" });
      };
      const handleEdit = (item) => {
        uni.navigateTo({ url: `/pages-sub/seller/goods/edit?id=${item.id}` });
      };
      const handleToggle = (item) => {
        const action = item.status === "on" ? "下架" : "上架";
        uni.showModal({
          title: "提示",
          content: `确定${action}该商品吗？`,
          success: (res) => {
            if (res.confirm) {
              item.status = item.status === "on" ? "off" : "on";
              uni.showToast({ title: `${action}成功`, icon: "success" });
            }
          }
        });
      };
      const handleDelete = (item) => {
        uni.showModal({
          title: "提示",
          content: "确定删除该商品吗？删除后无法恢复",
          success: (res) => {
            if (res.confirm) {
              const index = goodsList.value.findIndex((g) => g.id === item.id);
              if (index > -1) {
                goodsList.value.splice(index, 1);
                uni.showToast({ title: "删除成功", icon: "success" });
              }
            }
          }
        });
      };
      const __returned__ = { safeAreaBottom, scrollHeight, activeTab, tabList, goodsList, goPublish, handleEdit, handleToggle, handleDelete };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$K(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_tabs = vue.resolveComponent("ui-tabs");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_button = vue.resolveComponent("ui-button");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_tag = vue.resolveComponent("ui-tag");
    const _component_ui_price = vue.resolveComponent("ui-price");
    return vue.openBlock(), vue.createElementBlock("view", { class: "goods-list-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "商品管理" }),
      vue.createElementVNode("view", { class: "filter-bar" }, [
        vue.createVNode(_component_ui_tabs, {
          modelValue: $setup.activeTab,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.activeTab = $event),
          list: $setup.tabList,
          type: "line"
        }, null, 8, ["modelValue", "list"])
      ]),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "goods-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          $setup.goodsList.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createVNode(_component_ui_icon, {
              name: "package",
              size: 80,
              color: "#A1A1A6"
            }),
            vue.createElementVNode("text", { class: "empty-text" }, "暂无商品"),
            vue.createVNode(_component_ui_button, {
              type: "primary",
              size: "sm",
              onClick: $setup.goPublish
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("发布商品")
              ]),
              _: 1
              /* STABLE */
            })
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "goods-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.goodsList, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "goods-item"
                }, [
                  vue.createVNode(_component_ui_image, {
                    src: item.cover,
                    width: "160rpx",
                    height: "160rpx",
                    radius: "8rpx"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "goods-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "goods-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "goods-tags" }, [
                      vue.createVNode(_component_ui_tag, {
                        type: item.status === "on" ? "success" : "warning",
                        size: "sm"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(
                            vue.toDisplayString(item.status === "on" ? "在售" : "下架"),
                            1
                            /* TEXT */
                          )
                        ]),
                        _: 2
                        /* DYNAMIC */
                      }, 1032, ["type"]),
                      item.isRecommend ? (vue.openBlock(), vue.createBlock(_component_ui_tag, {
                        key: 0,
                        type: "primary",
                        size: "sm"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("推荐")
                        ]),
                        _: 1
                        /* STABLE */
                      })) : vue.createCommentVNode("v-if", true)
                    ]),
                    vue.createElementVNode("view", { class: "goods-bottom" }, [
                      vue.createVNode(_component_ui_price, {
                        value: item.price,
                        ":size": 40
                      }, null, 8, ["value"]),
                      vue.createElementVNode(
                        "text",
                        { class: "goods-stock" },
                        "库存" + vue.toDisplayString(item.stock),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "goods-actions" }, [
                    vue.createElementVNode("text", {
                      class: "action-btn",
                      onClick: ($event) => $setup.handleEdit(item)
                    }, "编辑", 8, ["onClick"]),
                    vue.createElementVNode("text", {
                      class: "action-btn",
                      onClick: ($event) => $setup.handleToggle(item)
                    }, vue.toDisplayString(item.status === "on" ? "下架" : "上架"), 9, ["onClick"]),
                    vue.createElementVNode("text", {
                      class: "action-btn danger",
                      onClick: ($event) => $setup.handleDelete(item)
                    }, "删除", 8, ["onClick"])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]))
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "list-footer",
          style: vue.normalizeStyle({ paddingBottom: $setup.safeAreaBottom + 12 + "px" })
        },
        [
          vue.createVNode(_component_ui_button, {
            type: "primary",
            block: "",
            onClick: $setup.goPublish
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("发布新商品")
            ]),
            _: 1
            /* STABLE */
          })
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesSubSellerGoodsList = /* @__PURE__ */ _export_sfc(_sfc_main$K, [["render", _sfc_render$K], ["__scopeId", "data-v-550ae608"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/seller/goods/list.vue"]]);
  const _sfc_main$J = /* @__PURE__ */ vue.defineComponent({
    __name: "edit",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 120
      });
      const conditions = ["全新", "99新", "95新", "9新", "85新", "8新及以下"];
      const goodsInfo = vue.ref({
        images: [
          "https://picsum.photos/400/400?random=e1",
          "https://picsum.photos/400/400?random=e2"
        ],
        title: "iPhone 15 Pro Max 256GB 钛金属原色",
        description: "自用 iPhone 15 Pro Max，99新，无任何划痕、磕碰。配件齐全，盒子、充电器、数据线都在。电池健康度 95%。",
        category: "手机",
        condition: "99新",
        spec: "256GB / 钛金属原色",
        price: "7999",
        originalPrice: "9999",
        stock: "10",
        canBargin: true,
        isRecommend: true
      });
      const handleSaveDraft = () => {
        uni.showToast({ title: "已保存草稿", icon: "success" });
      };
      const handleSubmit = () => {
        if (!goodsInfo.value.title) {
          uni.showToast({ title: "请输入商品标题", icon: "none" });
          return;
        }
        if (!goodsInfo.value.price) {
          uni.showToast({ title: "请输入商品价格", icon: "none" });
          return;
        }
        uni.showLoading({ title: "保存中..." });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }, 1e3);
      };
      const __returned__ = { safeAreaBottom, scrollHeight, conditions, goodsInfo, handleSaveDraft, handleSubmit };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$J(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_upload = vue.resolveComponent("ui-upload");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_switch = vue.resolveComponent("ui-switch");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "goods-edit-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "编辑商品" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "edit-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "商品图片"),
              vue.createVNode(_component_ui_upload, {
                modelValue: $setup.goodsInfo.images,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.goodsInfo.images = $event),
                "max-count": 9
              }, null, 8, ["modelValue"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "商品标题"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.goodsInfo.title = $event),
                  placeholder: "请输入商品标题",
                  maxlength: 50
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.goodsInfo.title]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "商品描述"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  class: "form-textarea",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.goodsInfo.description = $event),
                  placeholder: "请输入商品描述",
                  maxlength: 500
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.goodsInfo.description]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "商品分类"),
              vue.createElementVNode("view", { class: "form-select" }, [
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString($setup.goodsInfo.category || "请选择分类"),
                  1
                  /* TEXT */
                ),
                vue.createVNode(_component_ui_icon, {
                  name: "arrow-right",
                  ":size": 32
                })
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "商品成色"),
              vue.createElementVNode("view", { class: "condition-list" }, [
                (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.conditions, (item) => {
                    return vue.createElementVNode("view", {
                      key: item,
                      class: vue.normalizeClass(["condition-item", { active: $setup.goodsInfo.condition === item }]),
                      onClick: ($event) => $setup.goodsInfo.condition = item
                    }, vue.toDisplayString(item), 11, ["onClick"]);
                  }),
                  64
                  /* STABLE_FRAGMENT */
                ))
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "商品规格"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.goodsInfo.spec = $event),
                  placeholder: "如: 256GB / 钛金属原色"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.goodsInfo.spec]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-row" }, [
              vue.createElementVNode("view", { class: "form-item half" }, [
                vue.createElementVNode("text", { class: "form-label" }, "售价"),
                vue.createElementVNode("view", { class: "price-input" }, [
                  vue.createElementVNode("text", { class: "price-symbol" }, "¥"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "digit",
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.goodsInfo.price = $event),
                      placeholder: "0"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $setup.goodsInfo.price]
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item half" }, [
                vue.createElementVNode("text", { class: "form-label" }, "库存"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "number",
                    class: "form-input",
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.goodsInfo.stock = $event),
                    placeholder: "0"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.goodsInfo.stock]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "原价（选填）"),
              vue.createElementVNode("view", { class: "price-input" }, [
                vue.createElementVNode("text", { class: "price-symbol" }, "¥"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "digit",
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.goodsInfo.originalPrice = $event),
                    placeholder: "0"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $setup.goodsInfo.originalPrice]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "switch-section" }, [
              vue.createElementVNode("view", { class: "switch-item" }, [
                vue.createElementVNode("text", { class: "switch-label" }, "支持议价"),
                vue.createVNode(_component_ui_switch, {
                  modelValue: $setup.goodsInfo.canBargin,
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.goodsInfo.canBargin = $event)
                }, null, 8, ["modelValue"])
              ]),
              vue.createElementVNode("view", { class: "switch-item" }, [
                vue.createElementVNode("text", { class: "switch-label" }, "推荐商品"),
                vue.createVNode(_component_ui_switch, {
                  modelValue: $setup.goodsInfo.isRecommend,
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.goodsInfo.isRecommend = $event)
                }, null, 8, ["modelValue"])
              ])
            ])
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "edit-footer",
          style: vue.normalizeStyle({ paddingBottom: $setup.safeAreaBottom + 12 + "px" })
        },
        [
          vue.createVNode(_component_ui_button, {
            block: "",
            onClick: $setup.handleSaveDraft
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("存草稿")
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_ui_button, {
            type: "primary",
            block: "",
            onClick: $setup.handleSubmit
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("保存商品")
            ]),
            _: 1
            /* STABLE */
          })
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesSubSellerGoodsEdit = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["render", _sfc_render$J], ["__scopeId", "data-v-c08b7465"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/seller/goods/edit.vue"]]);
  const _sfc_main$I = /* @__PURE__ */ vue.defineComponent({
    __name: "list",
    setup(__props, { expose: __expose }) {
      __expose();
      const { scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 176
      });
      const activeTab = vue.ref(0);
      const tabList = vue.ref([
        { name: "全部" },
        { name: "待处理" },
        { name: "处理中" },
        { name: "已完成" }
      ]);
      const afterSaleList = vue.ref([
        {
          id: 1,
          orderNo: "XM202401150001",
          goodsCover: "https://picsum.photos/200/200?random=a1",
          goodsTitle: "iPhone 15 Pro Max 256GB",
          goodsSpec: "钛金属原色",
          type: "退货退款",
          reason: "商品与描述不符",
          status: "pending",
          statusText: "待处理",
          statusClass: "warning",
          createTime: "2024-01-15 10:30"
        },
        {
          id: 2,
          orderNo: "XM202401140002",
          goodsCover: "https://picsum.photos/200/200?random=a2",
          goodsTitle: "AirPods Pro 第二代",
          goodsSpec: "USB-C",
          type: "仅退款",
          reason: "质量问题",
          status: "processing",
          statusText: "处理中",
          statusClass: "primary",
          createTime: "2024-01-14 15:20"
        },
        {
          id: 3,
          orderNo: "XM202401130003",
          goodsCover: "https://picsum.photos/200/200?random=a3",
          goodsTitle: "MacBook Pro 14寸",
          goodsSpec: "M3芯片 16G+512G",
          type: "换货",
          reason: "收到商品有划痕",
          status: "completed",
          statusText: "已完成",
          statusClass: "success",
          createTime: "2024-01-13 09:15"
        }
      ]);
      const goDetail = (item) => {
        uni.navigateTo({ url: `/pages-sub/seller/after-sale/detail?id=${item.id}` });
      };
      const handleAgree = (item) => {
        uni.showModal({
          title: "确认",
          content: "确定同意该售后申请吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({ title: "已同意", icon: "success" });
            }
          }
        });
      };
      const handleReject = (item) => {
        uni.showModal({
          title: "拒绝原因",
          editable: true,
          placeholderText: "请输入拒绝原因",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({ title: "已拒绝", icon: "success" });
            }
          }
        });
      };
      const __returned__ = { scrollHeight, activeTab, tabList, afterSaleList, goDetail, handleAgree, handleReject };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$I(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_tabs = vue.resolveComponent("ui-tabs");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "after-sale-list-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "售后管理" }),
      vue.createElementVNode("view", { class: "filter-bar" }, [
        vue.createVNode(_component_ui_tabs, {
          modelValue: $setup.activeTab,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.activeTab = $event),
          list: $setup.tabList,
          type: "line"
        }, null, 8, ["modelValue", "list"])
      ]),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "list-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          $setup.afterSaleList.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createVNode(_component_ui_icon, {
              name: "refresh",
              size: 80,
              color: "#A1A1A6"
            }),
            vue.createElementVNode("text", { class: "empty-text" }, "暂无售后记录")
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "after-sale-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.afterSaleList, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "after-sale-item",
                  onClick: ($event) => $setup.goDetail(item)
                }, [
                  vue.createElementVNode("view", { class: "item-header" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "order-no" },
                      "订单号: " + vue.toDisplayString(item.orderNo),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["status", item.statusClass])
                      },
                      vue.toDisplayString(item.statusText),
                      3
                      /* TEXT, CLASS */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "item-goods" }, [
                    vue.createVNode(_component_ui_image, {
                      src: item.goodsCover,
                      width: "100rpx",
                      height: "100rpx",
                      radius: "8rpx"
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", { class: "goods-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "goods-title" },
                        vue.toDisplayString(item.goodsTitle),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "goods-spec" },
                        vue.toDisplayString(item.goodsSpec),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "item-info" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "售后类型"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value" },
                      vue.toDisplayString(item.type),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "item-info" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "申请原因"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value" },
                      vue.toDisplayString(item.reason),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "item-info" }, [
                    vue.createElementVNode("text", { class: "info-label" }, "申请时间"),
                    vue.createElementVNode(
                      "text",
                      { class: "info-value" },
                      vue.toDisplayString(item.createTime),
                      1
                      /* TEXT */
                    )
                  ]),
                  item.status === "pending" ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "item-actions"
                  }, [
                    vue.createVNode(_component_ui_button, {
                      size: "sm",
                      onClick: vue.withModifiers(($event) => $setup.handleReject(item), ["stop"])
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("拒绝")
                      ]),
                      _: 2
                      /* DYNAMIC */
                    }, 1032, ["onClick"]),
                    vue.createVNode(_component_ui_button, {
                      size: "sm",
                      type: "primary",
                      onClick: vue.withModifiers(($event) => $setup.handleAgree(item), ["stop"])
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("同意")
                      ]),
                      _: 2
                      /* DYNAMIC */
                    }, 1032, ["onClick"])
                  ])) : vue.createCommentVNode("v-if", true)
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]))
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesSubSellerAfterSaleList = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["render", _sfc_render$I], ["__scopeId", "data-v-029bba7d"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/seller/after-sale/list.vue"]]);
  const _sfc_main$H = /* @__PURE__ */ vue.defineComponent({
    __name: "detail",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 120
      });
      const afterSale = vue.ref({
        id: 1,
        type: "退货退款",
        reason: "商品与描述不符，实际成色与描述有差异",
        refundAmount: 7999,
        status: "pending",
        createTime: "2024-01-15 10:30:00",
        goodsCover: "https://picsum.photos/200/200?random=ad1",
        goodsTitle: "iPhone 15 Pro Max 256GB",
        goodsSpec: "钛金属原色",
        goodsPrice: 7999
      });
      const timeline = vue.ref([
        { title: "买家发起售后申请", time: "2024-01-15 10:30" },
        { title: "等待商家处理", time: "2024-01-15 10:30" }
      ]);
      const statusConfig = vue.computed(() => {
        const configs = {
          pending: { icon: "clock", color: "#FF9500", text: "待处理", desc: "请在48小时内处理" },
          processing: { icon: "refresh", color: "#007AFF", text: "处理中", desc: "请等待买家退货" },
          completed: { icon: "check-circle", color: "#34C759", text: "已完成", desc: "售后已完成" }
        };
        return configs[afterSale.value.status] || configs.pending;
      });
      const handleAgree = () => {
        uni.showModal({
          title: "确认",
          content: "确定同意该售后申请吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({ title: "已同意", icon: "success" });
            }
          }
        });
      };
      const handleReject = () => {
        uni.showModal({
          title: "拒绝原因",
          editable: true,
          placeholderText: "请输入拒绝原因",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({ title: "已拒绝", icon: "success" });
            }
          }
        });
      };
      const __returned__ = { safeAreaBottom, scrollHeight, afterSale, timeline, statusConfig, handleAgree, handleReject };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$H(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_price = vue.resolveComponent("ui-price");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "after-sale-detail-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "售后详情" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "detail-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "status-card" }, [
            vue.createElementVNode("view", { class: "status-icon" }, [
              vue.createVNode(_component_ui_icon, {
                name: $setup.statusConfig.icon,
                size: 40,
                color: $setup.statusConfig.color
              }, null, 8, ["name", "color"])
            ]),
            vue.createElementVNode(
              "text",
              { class: "status-text" },
              vue.toDisplayString($setup.statusConfig.text),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "status-desc" },
              vue.toDisplayString($setup.statusConfig.desc),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-card" }, [
            vue.createElementVNode("view", { class: "card-title" }, "售后信息"),
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("text", { class: "info-label" }, "售后类型"),
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($setup.afterSale.type),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("text", { class: "info-label" }, "申请原因"),
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($setup.afterSale.reason),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("text", { class: "info-label" }, "退款金额"),
              vue.createVNode(_component_ui_price, {
                value: $setup.afterSale.refundAmount,
                size: 28
              }, null, 8, ["value"])
            ]),
            vue.createElementVNode("view", { class: "info-item" }, [
              vue.createElementVNode("text", { class: "info-label" }, "申请时间"),
              vue.createElementVNode(
                "text",
                { class: "info-value" },
                vue.toDisplayString($setup.afterSale.createTime),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "goods-card" }, [
            vue.createElementVNode("view", { class: "card-title" }, "商品信息"),
            vue.createElementVNode("view", { class: "goods-item" }, [
              vue.createVNode(_component_ui_image, {
                src: $setup.afterSale.goodsCover,
                width: "120rpx",
                height: "120rpx",
                radius: "8rpx"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "goods-info" }, [
                vue.createElementVNode(
                  "text",
                  { class: "goods-title" },
                  vue.toDisplayString($setup.afterSale.goodsTitle),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "goods-spec" },
                  vue.toDisplayString($setup.afterSale.goodsSpec),
                  1
                  /* TEXT */
                ),
                vue.createVNode(_component_ui_price, {
                  value: $setup.afterSale.goodsPrice,
                  ":size": 40
                }, null, 8, ["value"])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "timeline-card" }, [
            vue.createElementVNode("view", { class: "card-title" }, "处理进度"),
            vue.createElementVNode("view", { class: "timeline" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.timeline, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "timeline-item"
                  }, [
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["timeline-dot", { active: index === 0 }])
                      },
                      null,
                      2
                      /* CLASS */
                    ),
                    vue.createElementVNode("view", { class: "timeline-content" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "timeline-title" },
                        vue.toDisplayString(item.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "timeline-time" },
                        vue.toDisplayString(item.time),
                        1
                        /* TEXT */
                      )
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ],
        4
        /* STYLE */
      ),
      $setup.afterSale.status === "pending" ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: "detail-footer",
          style: vue.normalizeStyle({ paddingBottom: $setup.safeAreaBottom + 12 + "px" })
        },
        [
          vue.createVNode(_component_ui_button, {
            block: "",
            onClick: $setup.handleReject
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("拒绝")
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_ui_button, {
            type: "primary",
            block: "",
            onClick: $setup.handleAgree
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("同意")
            ]),
            _: 1
            /* STABLE */
          })
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesSubSellerAfterSaleDetail = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["render", _sfc_render$H], ["__scopeId", "data-v-bac67d0f"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/seller/after-sale/detail.vue"]]);
  const _sfc_main$G = /* @__PURE__ */ vue.defineComponent({
    __name: "detail",
    setup(__props, { expose: __expose }) {
      __expose();
      const commentText = vue.ref("");
      const showComments = vue.ref(false);
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 100
      });
      const post = vue.ref({
        id: 1,
        authorAvatar: "https://picsum.photos/100/100?random=author",
        authorName: "数码达人",
        createTime: "2小时前",
        isFollowed: false,
        title: "iPhone 15 Pro Max 深度测评：性能与影像全面升级",
        content: "作为一名资深数码爱好者，今天给大家带来 iPhone 15 Pro Max 的深度测评。这款手机搭载了全新的 A17 Pro 芯片，性能提升明显，影像系统也有了很大升级。下面从几个方面详细说说使用感受...",
        images: [
          "https://picsum.photos/800/800?random=p1",
          "https://picsum.photos/800/800?random=p2",
          "https://picsum.photos/800/800?random=p3"
        ],
        tags: ["iPhone15", "数码测评", "科技好物"],
        isLiked: true,
        likeCount: 256,
        commentCount: 32,
        relatedGoods: {
          id: 1,
          cover: "https://picsum.photos/200/200?random=rg",
          title: "iPhone 15 Pro Max 256GB",
          price: 7999
        }
      });
      const comments = vue.ref([
        { id: 1, avatar: "https://picsum.photos/100/100?random=c1", userName: "科技小白", time: "1小时前", content: "写得很详细，学习了！", isLiked: false, likeCount: 12 },
        { id: 2, avatar: "https://picsum.photos/100/100?random=c2", userName: "数码爱好者", time: "30分钟前", content: "请问续航怎么样？日常使用能坚持一天吗？", isLiked: true, likeCount: 5 },
        { id: 3, avatar: "https://picsum.photos/100/100?random=c3", userName: "摄影师老李", time: "10分钟前", content: "影像部分的测评很专业，赞一个", isLiked: false, likeCount: 3 }
      ]);
      const goUser = () => {
        uni.navigateTo({ url: "/pages-sub/content/user/index?id=1" });
      };
      const toggleFollow = () => {
        post.value.isFollowed = !post.value.isFollowed;
        uni.showToast({ title: post.value.isFollowed ? "关注成功" : "已取消关注", icon: "none" });
      };
      const toggleLike = () => {
        post.value.isLiked = !post.value.isLiked;
        post.value.likeCount += post.value.isLiked ? 1 : -1;
      };
      const handleShare = () => {
        uni.showToast({ title: "分享功能开发中", icon: "none" });
      };
      const previewImage = (index) => {
        uni.previewImage({
          current: index,
          urls: post.value.images
        });
      };
      const goTopic = (tag) => {
        uni.navigateTo({ url: `/pages-sub/content/topic/index?name=${tag}` });
      };
      const goGoods = () => {
        var _a;
        uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${(_a = post.value.relatedGoods) == null ? void 0 : _a.id}` });
      };
      const likeComment = (item) => {
        item.isLiked = !item.isLiked;
        item.likeCount += item.isLiked ? 1 : -1;
      };
      const replyComment = (item) => {
        commentText.value = `@${item.userName} `;
      };
      const submitComment = () => {
        if (!commentText.value.trim())
          return;
        comments.value.unshift({
          id: Date.now(),
          avatar: "https://picsum.photos/100/100?random=me",
          userName: "我",
          time: "刚刚",
          content: commentText.value,
          isLiked: false,
          likeCount: 0
        });
        post.value.commentCount++;
        commentText.value = "";
        uni.showToast({ title: "评论成功", icon: "success" });
      };
      const __returned__ = { commentText, showComments, safeAreaBottom, scrollHeight, post, comments, goUser, toggleFollow, toggleLike, handleShare, previewImage, goTopic, goGoods, likeComment, replyComment, submitComment };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$G(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_avatar = vue.resolveComponent("ui-avatar");
    const _component_ui_button = vue.resolveComponent("ui-button");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_price = vue.resolveComponent("ui-price");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    return vue.openBlock(), vue.createElementBlock("view", { class: "post-detail-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "帖子详情" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "detail-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "author-card" }, [
            vue.createElementVNode("view", {
              class: "author-info",
              onClick: $setup.goUser
            }, [
              vue.createVNode(_component_ui_avatar, {
                src: $setup.post.authorAvatar,
                ":size": 80
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "author-detail" }, [
                vue.createElementVNode(
                  "text",
                  { class: "author-name" },
                  vue.toDisplayString($setup.post.authorName),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "author-time" },
                  vue.toDisplayString($setup.post.createTime),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createVNode(_component_ui_button, {
              size: "sm",
              type: $setup.post.isFollowed ? "default" : "primary",
              onClick: $setup.toggleFollow
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(
                  vue.toDisplayString($setup.post.isFollowed ? "已关注" : "关注"),
                  1
                  /* TEXT */
                )
              ]),
              _: 1
              /* STABLE */
            }, 8, ["type"])
          ]),
          vue.createElementVNode("view", { class: "post-content" }, [
            vue.createElementVNode(
              "text",
              { class: "post-title" },
              vue.toDisplayString($setup.post.title),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "post-text" },
              vue.toDisplayString($setup.post.content),
              1
              /* TEXT */
            ),
            ((_a = $setup.post.images) == null ? void 0 : _a.length) ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "post-images"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.post.images, (img, index) => {
                  return vue.openBlock(), vue.createBlock(_component_ui_image, {
                    key: index,
                    src: img,
                    width: "100%",
                    height: "400rpx",
                    radius: "8rpx",
                    mode: "aspectFill",
                    onClick: ($event) => $setup.previewImage(index)
                  }, null, 8, ["src", "onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "post-tags" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.post.tags, (tag) => {
                  return vue.openBlock(), vue.createElementBlock("text", {
                    key: tag,
                    class: "tag-item",
                    onClick: ($event) => $setup.goTopic(tag)
                  }, "#" + vue.toDisplayString(tag), 9, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            $setup.post.relatedGoods ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "post-goods"
            }, [
              vue.createElementVNode("text", { class: "goods-label" }, "相关商品"),
              vue.createElementVNode("view", {
                class: "goods-card",
                onClick: $setup.goGoods
              }, [
                vue.createVNode(_component_ui_image, {
                  src: $setup.post.relatedGoods.cover,
                  width: "120rpx",
                  height: "120rpx",
                  radius: "8rpx"
                }, null, 8, ["src"]),
                vue.createElementVNode("view", { class: "goods-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "goods-title" },
                    vue.toDisplayString($setup.post.relatedGoods.title),
                    1
                    /* TEXT */
                  ),
                  vue.createVNode(_component_ui_price, {
                    value: $setup.post.relatedGoods.price,
                    size: 28
                  }, null, 8, ["value"])
                ])
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("view", { class: "interact-bar" }, [
            vue.createElementVNode("view", {
              class: "interact-item",
              onClick: $setup.toggleLike
            }, [
              vue.createVNode(_component_ui_icon, {
                name: $setup.post.isLiked ? "heart-fill" : "heart",
                ":size": 40,
                color: $setup.post.isLiked ? "#FF3D00" : "#6E6E73"
              }, null, 8, ["name", "color"]),
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($setup.post.likeCount),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", {
              class: "interact-item",
              onClick: _cache[0] || (_cache[0] = ($event) => $setup.showComments = true)
            }, [
              vue.createVNode(_component_ui_icon, {
                name: "message",
                ":size": 40
              }),
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($setup.post.commentCount),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", {
              class: "interact-item",
              onClick: $setup.handleShare
            }, [
              vue.createVNode(_component_ui_icon, {
                name: "share",
                ":size": 40
              }),
              vue.createElementVNode("text", null, "分享")
            ])
          ]),
          vue.createElementVNode("view", { class: "comment-section" }, [
            vue.createElementVNode(
              "text",
              { class: "section-title" },
              "评论 (" + vue.toDisplayString($setup.comments.length) + ")",
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "comment-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.comments, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item.id,
                    class: "comment-item"
                  }, [
                    vue.createVNode(_component_ui_avatar, {
                      src: item.avatar,
                      size: 64
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", { class: "comment-content" }, [
                      vue.createElementVNode("view", { class: "comment-header" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "comment-name" },
                          vue.toDisplayString(item.userName),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "comment-time" },
                          vue.toDisplayString(item.time),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode(
                        "text",
                        { class: "comment-text" },
                        vue.toDisplayString(item.content),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "comment-actions" }, [
                        vue.createElementVNode("view", {
                          class: "action-item",
                          onClick: ($event) => $setup.likeComment(item)
                        }, [
                          vue.createVNode(_component_ui_icon, {
                            name: item.isLiked ? "heart-fill" : "heart",
                            size: 32,
                            color: item.isLiked ? "#FF3D00" : "#A1A1A6"
                          }, null, 8, ["name", "color"]),
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(item.likeCount),
                            1
                            /* TEXT */
                          )
                        ], 8, ["onClick"]),
                        vue.createElementVNode("text", {
                          class: "action-item",
                          onClick: ($event) => $setup.replyComment(item)
                        }, "回复", 8, ["onClick"])
                      ])
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "comment-input" }, [
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "input-field",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.commentText = $event),
            placeholder: "说点什么..."
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $setup.commentText]
        ]),
        vue.createVNode(_component_ui_button, {
          size: "sm",
          type: "primary",
          disabled: !$setup.commentText,
          onClick: $setup.submitComment
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("发送")
          ]),
          _: 1
          /* STABLE */
        }, 8, ["disabled"])
      ])
    ]);
  }
  const PagesSubContentPostDetail = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["render", _sfc_render$G], ["__scopeId", "data-v-c49b43fe"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/content/post/detail.vue"]]);
  const _sfc_main$F = /* @__PURE__ */ vue.defineComponent({
    __name: "publish",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 120
      });
      const content = vue.ref("");
      const images = vue.ref([]);
      const selectedTopic = vue.ref("");
      const relatedGoods = vue.ref(null);
      const syncToFeed = vue.ref(true);
      const allowComment = vue.ref(true);
      const showTopicPicker = vue.ref(false);
      const hotTopics = vue.ref([
        "iPhone15",
        "数码测评",
        "科技好物",
        "开箱体验",
        "摄影技巧",
        "游戏装备",
        "办公神器",
        "学生党必看"
      ]);
      const canPublish = vue.computed(() => content.value.trim().length >= 10);
      const selectGoods = () => {
        uni.navigateTo({
          url: "/pages-sub/seller/goods/list?select=1",
          events: {
            onGoodsSelected: (goods) => {
              relatedGoods.value = goods;
            }
          }
        });
      };
      const handlePublish = () => {
        if (!canPublish.value) {
          uni.showToast({ title: "请输入至少10个字", icon: "none" });
          return;
        }
        uni.showLoading({ title: "发布中..." });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({ title: "发布成功", icon: "success" });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }, 1e3);
      };
      const __returned__ = { safeAreaBottom, scrollHeight, content, images, selectedTopic, relatedGoods, syncToFeed, allowComment, showTopicPicker, hotTopics, canPublish, selectGoods, handlePublish };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$F(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_upload = vue.resolveComponent("ui-upload");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_switch = vue.resolveComponent("ui-switch");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "publish-post-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "发布帖子" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "publish-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "content-section" }, [
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                class: "content-input",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.content = $event),
                placeholder: "分享你的数码生活...",
                maxlength: 2e3
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $setup.content]
            ]),
            vue.createElementVNode(
              "text",
              { class: "word-count" },
              vue.toDisplayString($setup.content.length) + "/2000",
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "image-section" }, [
            vue.createVNode(_component_ui_upload, {
              modelValue: $setup.images,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.images = $event),
              "max-count": 9
            }, null, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { class: "option-section" }, [
            vue.createElementVNode("view", {
              class: "option-item",
              onClick: _cache[2] || (_cache[2] = ($event) => $setup.showTopicPicker = true)
            }, [
              vue.createElementVNode("text", { class: "option-label" }, "话题"),
              vue.createElementVNode("view", { class: "option-value" }, [
                $setup.selectedTopic ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  { key: 0 },
                  "#" + vue.toDisplayString($setup.selectedTopic),
                  1
                  /* TEXT */
                )) : (vue.openBlock(), vue.createElementBlock("text", {
                  key: 1,
                  class: "placeholder"
                }, "选择话题")),
                vue.createVNode(_component_ui_icon, {
                  name: "arrow-right",
                  ":size": 32
                })
              ])
            ]),
            vue.createElementVNode("view", {
              class: "option-item",
              onClick: $setup.selectGoods
            }, [
              vue.createElementVNode("text", { class: "option-label" }, "关联商品"),
              vue.createElementVNode("view", { class: "option-value" }, [
                $setup.relatedGoods ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  { key: 0 },
                  vue.toDisplayString($setup.relatedGoods.title),
                  1
                  /* TEXT */
                )) : (vue.openBlock(), vue.createElementBlock("text", {
                  key: 1,
                  class: "placeholder"
                }, "选择商品")),
                vue.createVNode(_component_ui_icon, {
                  name: "arrow-right",
                  ":size": 32
                })
              ])
            ]),
            vue.createElementVNode("view", { class: "option-item" }, [
              vue.createElementVNode("text", { class: "option-label" }, "同步到动态"),
              vue.createVNode(_component_ui_switch, {
                modelValue: $setup.syncToFeed,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.syncToFeed = $event)
              }, null, 8, ["modelValue"])
            ]),
            vue.createElementVNode("view", { class: "option-item" }, [
              vue.createElementVNode("text", { class: "option-label" }, "允许评论"),
              vue.createVNode(_component_ui_switch, {
                modelValue: $setup.allowComment,
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.allowComment = $event)
              }, null, 8, ["modelValue"])
            ])
          ]),
          $setup.hotTopics.length ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "hot-topics"
          }, [
            vue.createElementVNode("text", { class: "section-title" }, "热门话题"),
            vue.createElementVNode("view", { class: "topic-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.hotTopics, (topic) => {
                  return vue.openBlock(), vue.createElementBlock("text", {
                    key: topic,
                    class: "topic-item",
                    onClick: ($event) => $setup.selectedTopic = topic
                  }, " #" + vue.toDisplayString(topic), 9, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "publish-footer" }, [
        vue.createVNode(_component_ui_button, {
          type: "primary",
          block: "",
          disabled: !$setup.canPublish,
          onClick: $setup.handlePublish
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode(" 发布 ")
          ]),
          _: 1
          /* STABLE */
        }, 8, ["disabled"])
      ])
    ]);
  }
  const PagesSubContentPostPublish = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["render", _sfc_render$F], ["__scopeId", "data-v-039c674c"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/content/post/publish.vue"]]);
  const _sfc_main$E = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 368
      });
      const topicName = vue.ref("数码测评");
      const sortType = vue.ref(0);
      const topicInfo = vue.ref({
        desc: "分享 iPhone 15 系列使用体验、技巧和问题",
        postCount: 12580,
        viewCount: 89e4
      });
      const sortList = vue.ref([
        { name: "最新" },
        { name: "最热" }
      ]);
      const postList = vue.ref([
        {
          id: 1,
          userAvatar: "https://picsum.photos/100/100?random=t1",
          userName: "数码达人",
          time: "2小时前",
          title: "iPhone 15 Pro Max 深度测评：性能与影像全面升级",
          images: ["https://picsum.photos/200/200?random=ti1", "https://picsum.photos/200/200?random=ti2"],
          likeCount: 256,
          commentCount: 32
        },
        {
          id: 2,
          userAvatar: "https://picsum.photos/100/100?random=t2",
          userName: "科技博主",
          time: "5小时前",
          title: "iPhone 15 和 iPhone 14 该怎么选？看完这篇就懂了",
          images: ["https://picsum.photos/200/200?random=ti3"],
          likeCount: 189,
          commentCount: 45
        },
        {
          id: 3,
          userAvatar: "https://picsum.photos/100/100?random=t3",
          userName: "小白用户",
          time: "昨天",
          title: "iPhone 15 Pro 的钛金属边框真的不沾指纹吗？",
          images: [],
          likeCount: 67,
          commentCount: 23
        }
      ]);
      const goDetail = (item) => {
        uni.navigateTo({ url: `/pages-sub/content/post/detail?id=${item.id}` });
      };
      const loadMore = () => {
        uni.showToast({ title: "加载更多...", icon: "none" });
      };
      const __returned__ = { scrollHeight, topicName, sortType, topicInfo, sortList, postList, goDetail, loadMore };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$E(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_tabs = vue.resolveComponent("ui-tabs");
    const _component_ui_avatar = vue.resolveComponent("ui-avatar");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    return vue.openBlock(), vue.createElementBlock("view", { class: "topic-page" }, [
      vue.createVNode(_component_ui_sub_navbar, {
        title: "#" + $setup.topicName
      }, null, 8, ["title"]),
      vue.createElementVNode("view", { class: "topic-header" }, [
        vue.createElementVNode(
          "text",
          { class: "topic-name" },
          "#" + vue.toDisplayString($setup.topicName),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "text",
          { class: "topic-desc" },
          vue.toDisplayString($setup.topicInfo.desc),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "topic-stats" }, [
          vue.createElementVNode("view", { class: "stat-item" }, [
            vue.createElementVNode(
              "text",
              { class: "stat-value" },
              vue.toDisplayString($setup.topicInfo.postCount),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "stat-label" }, "帖子")
          ]),
          vue.createElementVNode("view", { class: "stat-item" }, [
            vue.createElementVNode(
              "text",
              { class: "stat-value" },
              vue.toDisplayString($setup.topicInfo.viewCount),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", { class: "stat-label" }, "浏览")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "filter-bar" }, [
        vue.createVNode(_component_ui_tabs, {
          modelValue: $setup.sortType,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.sortType = $event),
          list: $setup.sortList,
          type: "line"
        }, null, 8, ["modelValue", "list"])
      ]),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "post-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" }),
          onScrolltolower: $setup.loadMore
        },
        [
          vue.createElementVNode("view", { class: "post-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.postList, (item) => {
                var _a;
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "post-item",
                  onClick: ($event) => $setup.goDetail(item)
                }, [
                  vue.createElementVNode("view", { class: "post-header" }, [
                    vue.createVNode(_component_ui_avatar, {
                      src: item.userAvatar,
                      size: 64
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", { class: "user-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "user-name" },
                        vue.toDisplayString(item.userName),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "post-time" },
                        vue.toDisplayString(item.time),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode(
                    "text",
                    { class: "post-title" },
                    vue.toDisplayString(item.title),
                    1
                    /* TEXT */
                  ),
                  ((_a = item.images) == null ? void 0 : _a.length) ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "post-images"
                  }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(item.images.slice(0, 3), (img, idx) => {
                        return vue.openBlock(), vue.createBlock(_component_ui_image, {
                          key: idx,
                          src: img,
                          width: "200rpx",
                          height: "200rpx",
                          radius: "8rpx"
                        }, null, 8, ["src"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode("view", { class: "post-footer" }, [
                    vue.createElementVNode("view", { class: "stat-item" }, [
                      vue.createVNode(_component_ui_icon, {
                        name: "heart",
                        size: 32
                      }),
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(item.likeCount),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "stat-item" }, [
                      vue.createVNode(_component_ui_icon, {
                        name: "message",
                        size: 32
                      }),
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(item.commentCount),
                        1
                        /* TEXT */
                      )
                    ])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])
        ],
        36
        /* STYLE, NEED_HYDRATION */
      )
    ]);
  }
  const PagesSubContentTopicIndex = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["render", _sfc_render$E], ["__scopeId", "data-v-2318d30d"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/content/topic/index.vue"]]);
  const _sfc_main$D = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { scrollHeight } = usePageLayout({
        hasSubNavbar: true
      });
      const activeTab = vue.ref(0);
      const tabList = vue.ref([
        { name: "帖子" },
        { name: "商品" }
      ]);
      const userInfo = vue.ref({
        avatar: "https://picsum.photos/200/200?random=other",
        name: "数码达人",
        signature: "专注数码产品测评与分享",
        followers: 2568,
        following: 128,
        likes: 8999,
        isFollowed: false
      });
      const postList = vue.ref([
        { id: 1, cover: "https://picsum.photos/400/400?random=up1", title: "iPhone 15 Pro Max 深度测评", likeCount: 256, commentCount: 32 },
        { id: 2, cover: "https://picsum.photos/400/400?random=up2", title: "MacBook Pro M3 开箱体验", likeCount: 189, commentCount: 28 },
        { id: 3, cover: "https://picsum.photos/400/400?random=up3", title: "AirPods Pro 2 使用感受", likeCount: 167, commentCount: 45 }
      ]);
      const goodsList = vue.ref([
        { id: 1, cover: "https://picsum.photos/400/400?random=ug1", title: "iPhone 15 Pro Max 256GB", price: 7999 },
        { id: 2, cover: "https://picsum.photos/400/400?random=ug2", title: "MacBook Pro 14寸 M3", price: 12999 },
        { id: 3, cover: "https://picsum.photos/400/400?random=ug3", title: "AirPods Pro 第二代", price: 1399 }
      ]);
      const toggleFollow = () => {
        userInfo.value.isFollowed = !userInfo.value.isFollowed;
        uni.showToast({ title: userInfo.value.isFollowed ? "关注成功" : "已取消关注", icon: "none" });
      };
      const goChat = () => {
        uni.showToast({ title: "私信功能开发中", icon: "none" });
      };
      const showFollowers = () => {
        uni.showToast({ title: "粉丝列表", icon: "none" });
      };
      const showFollowing = () => {
        uni.showToast({ title: "关注列表", icon: "none" });
      };
      const goPost = (item) => {
        uni.navigateTo({ url: `/pages-sub/content/post/detail?id=${item.id}` });
      };
      const goGoods = (item) => {
        uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.id}` });
      };
      const __returned__ = { scrollHeight, activeTab, tabList, userInfo, postList, goodsList, toggleFollow, goChat, showFollowers, showFollowing, goPost, goGoods };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$D(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_avatar = vue.resolveComponent("ui-avatar");
    const _component_ui_button = vue.resolveComponent("ui-button");
    const _component_ui_tabs = vue.resolveComponent("ui-tabs");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_price = vue.resolveComponent("ui-price");
    return vue.openBlock(), vue.createElementBlock("view", { class: "user-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "Ta的主页" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "user-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "user-header" }, [
            vue.createVNode(_component_ui_avatar, {
              src: $setup.userInfo.avatar,
              size: 120
            }, null, 8, ["src"]),
            vue.createElementVNode(
              "text",
              { class: "user-name" },
              vue.toDisplayString($setup.userInfo.name),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "user-desc" },
              vue.toDisplayString($setup.userInfo.signature),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "user-stats" }, [
              vue.createElementVNode("view", {
                class: "stat-item",
                onClick: $setup.showFollowers
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "stat-value" },
                  vue.toDisplayString($setup.userInfo.followers),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "stat-label" }, "粉丝")
              ]),
              vue.createElementVNode("view", {
                class: "stat-item",
                onClick: $setup.showFollowing
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "stat-value" },
                  vue.toDisplayString($setup.userInfo.following),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "stat-label" }, "关注")
              ]),
              vue.createElementVNode("view", { class: "stat-item" }, [
                vue.createElementVNode(
                  "text",
                  { class: "stat-value" },
                  vue.toDisplayString($setup.userInfo.likes),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("text", { class: "stat-label" }, "获赞")
              ])
            ]),
            vue.createElementVNode("view", { class: "user-actions" }, [
              vue.createVNode(_component_ui_button, {
                type: $setup.userInfo.isFollowed ? "default" : "primary",
                size: "sm",
                onClick: $setup.toggleFollow
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(
                    vue.toDisplayString($setup.userInfo.isFollowed ? "已关注" : "关注"),
                    1
                    /* TEXT */
                  )
                ]),
                _: 1
                /* STABLE */
              }, 8, ["type"]),
              vue.createVNode(_component_ui_button, {
                size: "sm",
                onClick: $setup.goChat
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("私信")
                ]),
                _: 1
                /* STABLE */
              })
            ])
          ]),
          vue.createElementVNode("view", { class: "tabs-bar" }, [
            vue.createVNode(_component_ui_tabs, {
              modelValue: $setup.activeTab,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.activeTab = $event),
              list: $setup.tabList,
              type: "line"
            }, null, 8, ["modelValue", "list"])
          ]),
          vue.createElementVNode("view", { class: "content-area" }, [
            $setup.activeTab === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "post-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.postList, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item.id,
                    class: "post-item",
                    onClick: ($event) => $setup.goPost(item)
                  }, [
                    vue.createVNode(_component_ui_image, {
                      src: item.cover,
                      width: "100%",
                      height: "300rpx",
                      radius: "8rpx"
                    }, null, 8, ["src"]),
                    vue.createElementVNode(
                      "text",
                      { class: "post-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "post-stats" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "stat" },
                        vue.toDisplayString(item.likeCount) + "赞",
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "stat" },
                        vue.toDisplayString(item.commentCount) + "评论",
                        1
                        /* TEXT */
                      )
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : vue.createCommentVNode("v-if", true),
            $setup.activeTab === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "goods-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.goodsList, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item.id,
                    class: "goods-item",
                    onClick: ($event) => $setup.goGoods(item)
                  }, [
                    vue.createVNode(_component_ui_image, {
                      src: item.cover,
                      width: "100%",
                      height: "300rpx",
                      radius: "8rpx"
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", { class: "goods-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "goods-title" },
                        vue.toDisplayString(item.title),
                        1
                        /* TEXT */
                      ),
                      vue.createVNode(_component_ui_price, {
                        value: item.price,
                        size: 28
                      }, null, 8, ["value"])
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesSubContentUserIndex = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["render", _sfc_render$D], ["__scopeId", "data-v-29821f84"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/content/user/index.vue"]]);
  const _sfc_main$C = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const phone = vue.ref("");
      const password = vue.ref("");
      const showPassword = vue.ref(false);
      const agreed = vue.ref(false);
      const canLogin = vue.computed(() => phone.value.length === 11 && password.value.length >= 6 && agreed.value);
      const handleLogin = () => {
        if (!canLogin.value)
          return;
        uni.showLoading({ title: "登录中..." });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({ title: "登录成功", icon: "success" });
          setTimeout(() => {
            uni.switchTab({ url: "/pages/my/index" });
          }, 1500);
        }, 1e3);
      };
      const goRegister = () => {
        uni.showToast({ title: "注册功能开发中", icon: "none" });
      };
      const goForgot = () => {
        uni.showToast({ title: "找回密码功能开发中", icon: "none" });
      };
      const loginByWechat = () => {
        if (!agreed.value) {
          uni.showToast({ title: "请先同意用户协议", icon: "none" });
          return;
        }
        uni.showToast({ title: "微信登录", icon: "none" });
      };
      const loginByAlipay = () => {
        if (!agreed.value) {
          uni.showToast({ title: "请先同意用户协议", icon: "none" });
          return;
        }
        uni.showToast({ title: "支付宝登录", icon: "none" });
      };
      const goAgreement = (type) => {
        uni.showToast({ title: `${type === "user" ? "用户协议" : "隐私政策"}`, icon: "none" });
      };
      const __returned__ = { phone, password, showPassword, agreed, canLogin, handleLogin, goRegister, goForgot, loginByWechat, loginByAlipay, goAgreement };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _imports_0 = "/assets/logo.46719607.png";
  function _sfc_render$C(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_button = vue.resolveComponent("ui-button");
    const _component_ui_divider = vue.resolveComponent("ui-divider");
    const _component_ui_checkbox = vue.resolveComponent("ui-checkbox");
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-page" }, [
      vue.createElementVNode("view", { class: "login-header" }, [
        vue.createElementVNode("image", {
          class: "logo",
          src: _imports_0,
          mode: "aspectFit"
        }),
        vue.createElementVNode("text", { class: "app-name" }, "XinMall"),
        vue.createElementVNode("text", { class: "app-desc" }, "数码好物 闲置流转")
      ]),
      vue.createElementVNode("view", { class: "login-form" }, [
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createVNode(_component_ui_icon, {
            name: "phone",
            ":size": 40
          }),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "number",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.phone = $event),
              placeholder: "请输入手机号",
              maxlength: "11"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.phone]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createVNode(_component_ui_icon, {
            name: "lock",
            ":size": 40
          }),
          vue.withDirectives(vue.createElementVNode("input", {
            password: !$setup.showPassword,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.password = $event),
            placeholder: "请输入密码"
          }, null, 8, ["password"]), [
            [vue.vModelText, $setup.password]
          ]),
          vue.createVNode(_component_ui_icon, {
            name: $setup.showPassword ? "eye" : "eye-off",
            ":size": 40,
            onClick: _cache[2] || (_cache[2] = ($event) => $setup.showPassword = !$setup.showPassword)
          }, null, 8, ["name"])
        ]),
        vue.createVNode(_component_ui_button, {
          type: "primary",
          block: "",
          disabled: !$setup.canLogin,
          onClick: $setup.handleLogin
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("登录")
          ]),
          _: 1
          /* STABLE */
        }, 8, ["disabled"]),
        vue.createElementVNode("view", { class: "form-footer" }, [
          vue.createElementVNode("text", {
            class: "link",
            onClick: $setup.goRegister
          }, "注册账号"),
          vue.createElementVNode("text", {
            class: "link",
            onClick: $setup.goForgot
          }, "忘记密码？")
        ])
      ]),
      vue.createElementVNode("view", { class: "other-login" }, [
        vue.createVNode(_component_ui_divider, null, {
          default: vue.withCtx(() => [
            vue.createTextVNode("其他登录方式")
          ]),
          _: 1
          /* STABLE */
        }),
        vue.createElementVNode("view", { class: "login-icons" }, [
          vue.createElementVNode("view", {
            class: "icon-item",
            onClick: $setup.loginByWechat
          }, [
            vue.createVNode(_component_ui_icon, {
              name: "message",
              ":size": 40,
              color: "#07C160"
            }),
            vue.createElementVNode("text", null, "微信")
          ]),
          vue.createElementVNode("view", {
            class: "icon-item",
            onClick: $setup.loginByAlipay
          }, [
            vue.createVNode(_component_ui_icon, {
              name: "credit-card",
              ":size": 40,
              color: "#1677FF"
            }),
            vue.createElementVNode("text", null, "支付宝")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "agreement" }, [
        vue.createVNode(_component_ui_checkbox, {
          modelValue: $setup.agreed,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.agreed = $event)
        }, null, 8, ["modelValue"]),
        vue.createElementVNode("text", { class: "agreement-text" }, [
          vue.createTextVNode(" 登录即表示同意 "),
          vue.createElementVNode("text", {
            class: "link",
            onClick: _cache[4] || (_cache[4] = ($event) => $setup.goAgreement("user"))
          }, "《用户协议》"),
          vue.createTextVNode(" 和 "),
          vue.createElementVNode("text", {
            class: "link",
            onClick: _cache[5] || (_cache[5] = ($event) => $setup.goAgreement("privacy"))
          }, "《隐私政策》")
        ])
      ])
    ]);
  }
  const PagesSubUserLoginIndex = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["render", _sfc_render$C], ["__scopeId", "data-v-716f2f88"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/user/login/index.vue"]]);
  const _sfc_main$B = /* @__PURE__ */ vue.defineComponent({
    __name: "list",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 120
      });
      const addressList = vue.ref([
        {
          id: 1,
          name: "张三",
          phone: "138****8888",
          province: "北京市",
          city: "朝阳区",
          district: "建国路",
          detail: "88号SOHO现代城A座1201室",
          isDefault: true
        },
        {
          id: 2,
          name: "李四",
          phone: "139****9999",
          province: "上海市",
          city: "浦东新区",
          district: "陆家嘴",
          detail: "金融中心B座2002室",
          isDefault: false
        }
      ]);
      const goAdd = () => {
        uni.navigateTo({ url: "/pages-sub/user/address/edit" });
      };
      const goEdit = (item) => {
        uni.navigateTo({ url: `/pages-sub/user/address/edit?id=${item.id}` });
      };
      const selectAddress = (item) => {
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        if (prevPage) {
          uni.$emit("addressSelected", item);
          uni.navigateBack();
        }
      };
      const setDefault = (item) => {
        addressList.value.forEach((addr) => addr.isDefault = false);
        item.isDefault = true;
        uni.showToast({ title: "设置成功", icon: "success" });
      };
      const handleDelete = (item) => {
        uni.showModal({
          title: "提示",
          content: "确定删除该地址吗？",
          success: (res) => {
            if (res.confirm) {
              const index = addressList.value.findIndex((a) => a.id === item.id);
              if (index > -1) {
                addressList.value.splice(index, 1);
                uni.showToast({ title: "删除成功", icon: "success" });
              }
            }
          }
        });
      };
      const __returned__ = { safeAreaBottom, scrollHeight, addressList, goAdd, goEdit, selectAddress, setDefault, handleDelete };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$B(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_button = vue.resolveComponent("ui-button");
    const _component_ui_tag = vue.resolveComponent("ui-tag");
    return vue.openBlock(), vue.createElementBlock("view", { class: "address-list-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "收货地址" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "address-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          $setup.addressList.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createVNode(_component_ui_icon, {
              name: "map-pin",
              size: 80,
              color: "#A1A1A6"
            }),
            vue.createElementVNode("text", { class: "empty-text" }, "暂无收货地址"),
            vue.createVNode(_component_ui_button, {
              type: "primary",
              size: "sm",
              onClick: $setup.goAdd
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("添加地址")
              ]),
              _: 1
              /* STABLE */
            })
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "address-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.addressList, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "address-item",
                  onClick: ($event) => $setup.selectAddress(item)
                }, [
                  vue.createElementVNode("view", { class: "address-content" }, [
                    vue.createElementVNode("view", { class: "address-header" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "name" },
                        vue.toDisplayString(item.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "phone" },
                        vue.toDisplayString(item.phone),
                        1
                        /* TEXT */
                      ),
                      item.isDefault ? (vue.openBlock(), vue.createBlock(_component_ui_tag, {
                        key: 0,
                        type: "primary",
                        size: "xs"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("默认")
                        ]),
                        _: 1
                        /* STABLE */
                      })) : vue.createCommentVNode("v-if", true)
                    ]),
                    vue.createElementVNode(
                      "text",
                      { class: "address-detail" },
                      vue.toDisplayString(item.province) + vue.toDisplayString(item.city) + vue.toDisplayString(item.district) + vue.toDisplayString(item.detail),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "address-actions" }, [
                    vue.createElementVNode("view", {
                      class: "action-item",
                      onClick: vue.withModifiers(($event) => $setup.setDefault(item), ["stop"])
                    }, [
                      vue.createVNode(_component_ui_icon, {
                        name: item.isDefault ? "check-circle-fill" : "circle",
                        ":size": 40,
                        color: item.isDefault ? "#1ABC9C" : "#A1A1A6"
                      }, null, 8, ["name", "color"]),
                      vue.createElementVNode("text", null, "默认")
                    ], 8, ["onClick"]),
                    vue.createElementVNode("view", {
                      class: "action-item",
                      onClick: vue.withModifiers(($event) => $setup.goEdit(item), ["stop"])
                    }, [
                      vue.createVNode(_component_ui_icon, {
                        name: "edit",
                        ":size": 40
                      }),
                      vue.createElementVNode("text", null, "编辑")
                    ], 8, ["onClick"]),
                    vue.createElementVNode("view", {
                      class: "action-item",
                      onClick: vue.withModifiers(($event) => $setup.handleDelete(item), ["stop"])
                    }, [
                      vue.createVNode(_component_ui_icon, {
                        name: "trash",
                        ":size": 40
                      }),
                      vue.createElementVNode("text", null, "删除")
                    ], 8, ["onClick"])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]))
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "list-footer" }, [
        vue.createVNode(_component_ui_button, {
          type: "primary",
          block: "",
          onClick: $setup.goAdd
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("新增地址")
          ]),
          _: 1
          /* STABLE */
        })
      ])
    ]);
  }
  const PagesSubUserAddressList = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["render", _sfc_render$B], ["__scopeId", "data-v-97f4edbf"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/user/address/list.vue"]]);
  const _sfc_main$A = /* @__PURE__ */ vue.defineComponent({
    __name: "edit",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 120
      });
      const isEdit = vue.ref(false);
      const tagList = vue.ref(["家", "公司", "学校"]);
      const form = vue.ref({
        name: "",
        phone: "",
        region: "",
        detail: "",
        tag: "",
        isDefault: false
      });
      const chooseLocation = () => {
        uni.chooseLocation({
          success: (res) => {
            form.value.region = res.name || "";
          }
        });
      };
      const handleSave = () => {
        if (!form.value.name) {
          uni.showToast({ title: "请输入收货人姓名", icon: "none" });
          return;
        }
        if (!form.value.phone || form.value.phone.length !== 11) {
          uni.showToast({ title: "请输入正确的手机号", icon: "none" });
          return;
        }
        if (!form.value.region) {
          uni.showToast({ title: "请选择所在地区", icon: "none" });
          return;
        }
        if (!form.value.detail) {
          uni.showToast({ title: "请输入详细地址", icon: "none" });
          return;
        }
        uni.showLoading({ title: "保存中..." });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({ title: "保存成功", icon: "success" });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }, 1e3);
      };
      const __returned__ = { safeAreaBottom, scrollHeight, isEdit, tagList, form, chooseLocation, handleSave };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$A(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_switch = vue.resolveComponent("ui-switch");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "address-edit-page" }, [
      vue.createVNode(_component_ui_sub_navbar, {
        title: $setup.isEdit ? "编辑地址" : "新增地址"
      }, null, 8, ["title"]),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "edit-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "收货人"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.form.name = $event),
                  placeholder: "请输入收货人姓名"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.form.name]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "手机号"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  type: "tel",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.form.phone = $event),
                  placeholder: "请输入手机号",
                  maxlength: "11"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.form.phone]
              ])
            ]),
            vue.createElementVNode("view", {
              class: "form-item",
              onClick: $setup.chooseLocation
            }, [
              vue.createElementVNode("text", { class: "form-label" }, "所在地区"),
              vue.createElementVNode("view", { class: "form-select" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass({ placeholder: !$setup.form.region })
                  },
                  vue.toDisplayString($setup.form.region || "请选择省市区"),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createVNode(_component_ui_icon, {
                  name: "arrow-right",
                  ":size": 32
                })
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "详细地址"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  class: "form-textarea",
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.form.detail = $event),
                  placeholder: "请输入详细地址（街道、楼栋、门牌号）"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.form.detail]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "地址标签"),
              vue.createElementVNode("view", { class: "tag-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.tagList, (tag) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: tag,
                      class: vue.normalizeClass(["tag-item", { active: $setup.form.tag === tag }]),
                      onClick: ($event) => $setup.form.tag = tag
                    }, vue.toDisplayString(tag), 11, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "switch-section" }, [
            vue.createElementVNode("view", { class: "switch-item" }, [
              vue.createElementVNode("text", { class: "switch-label" }, "设为默认地址"),
              vue.createVNode(_component_ui_switch, {
                modelValue: $setup.form.isDefault,
                "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.form.isDefault = $event)
              }, null, 8, ["modelValue"])
            ])
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "edit-footer" }, [
        vue.createVNode(_component_ui_button, {
          type: "primary",
          block: "",
          onClick: $setup.handleSave
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("保存")
          ]),
          _: 1
          /* STABLE */
        })
      ])
    ]);
  }
  const PagesSubUserAddressEdit = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", _sfc_render$A], ["__scopeId", "data-v-fe3df131"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/user/address/edit.vue"]]);
  const _sfc_main$z = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 176
      });
      const activeTab = vue.ref(0);
      const tabList = vue.ref([
        { name: "商品" },
        { name: "帖子" }
      ]);
      const collectionList = vue.ref([
        { id: 1, cover: "https://picsum.photos/200/200?random=col1", title: "iPhone 15 Pro Max 256GB 钛金属原色", price: 7999, tags: ["99新", "在保"], collectTime: "3天前" },
        { id: 2, cover: "https://picsum.photos/200/200?random=col2", title: "MacBook Pro 14寸 M3芯片", price: 12999, tags: ["全新", "官方"], collectTime: "5天前" },
        { id: 3, cover: "https://picsum.photos/200/200?random=col3", title: "AirPods Pro 第二代", price: 1399, tags: ["全新", "正品"], collectTime: "1周前" }
      ]);
      const goDetail = (item) => {
        uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.id}` });
      };
      const cancelCollect = (item) => {
        uni.showModal({
          title: "提示",
          content: "确定取消收藏吗？",
          success: (res) => {
            if (res.confirm) {
              const index = collectionList.value.findIndex((c) => c.id === item.id);
              if (index > -1) {
                collectionList.value.splice(index, 1);
                uni.showToast({ title: "已取消收藏", icon: "success" });
              }
            }
          }
        });
      };
      const __returned__ = { safeAreaBottom, scrollHeight, activeTab, tabList, collectionList, goDetail, cancelCollect };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$z(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_tabs = vue.resolveComponent("ui-tabs");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_tag = vue.resolveComponent("ui-tag");
    const _component_ui_price = vue.resolveComponent("ui-price");
    return vue.openBlock(), vue.createElementBlock("view", { class: "collection-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "我的收藏" }),
      vue.createElementVNode("view", { class: "filter-bar" }, [
        vue.createVNode(_component_ui_tabs, {
          modelValue: $setup.activeTab,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.activeTab = $event),
          list: $setup.tabList,
          type: "line"
        }, null, 8, ["modelValue", "list"])
      ]),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "collection-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          $setup.collectionList.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createVNode(_component_ui_icon, {
              name: "heart",
              size: 80,
              color: "#A1A1A6"
            }),
            vue.createElementVNode("text", { class: "empty-text" }, "暂无收藏")
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "collection-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.collectionList, (item) => {
                var _a;
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "collection-item",
                  onClick: ($event) => $setup.goDetail(item)
                }, [
                  vue.createVNode(_component_ui_image, {
                    src: item.cover,
                    width: "180rpx",
                    height: "180rpx",
                    radius: "8rpx"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "item-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "item-title" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "item-tags" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList((_a = item.tags) == null ? void 0 : _a.slice(0, 2), (tag) => {
                          return vue.openBlock(), vue.createBlock(
                            _component_ui_tag,
                            {
                              key: tag,
                              type: "primary",
                              size: "sm"
                            },
                            {
                              default: vue.withCtx(() => [
                                vue.createTextVNode(
                                  vue.toDisplayString(tag),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              _: 2
                              /* DYNAMIC */
                            },
                            1024
                            /* DYNAMIC_SLOTS */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ]),
                    vue.createElementVNode("view", { class: "item-bottom" }, [
                      vue.createVNode(_component_ui_price, {
                        value: item.price,
                        size: 28
                      }, null, 8, ["value"]),
                      vue.createElementVNode(
                        "text",
                        { class: "item-time" },
                        vue.toDisplayString(item.collectTime),
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", {
                    class: "item-action",
                    onClick: vue.withModifiers(($event) => $setup.cancelCollect(item), ["stop"])
                  }, [
                    vue.createVNode(_component_ui_icon, {
                      name: "heart-fill",
                      ":size": 40,
                      color: "#FF3D00"
                    })
                  ], 8, ["onClick"])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]))
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesSubUserCollectionIndex = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$z], ["__scopeId", "data-v-2546e59a"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/user/collection/index.vue"]]);
  const _sfc_main$y = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 120
      });
      const historyList = vue.ref([
        {
          date: "今天",
          list: [
            { id: 1, cover: "https://picsum.photos/200/200?random=h1", title: "iPhone 15 Pro Max 256GB 钛金属原色", price: 7999, tags: ["99新", "在保"], viewTime: "10:30" },
            { id: 2, cover: "https://picsum.photos/200/200?random=h2", title: "MacBook Pro 14寸 M3芯片", price: 12999, tags: ["全新", "官方"], viewTime: "09:15" }
          ]
        },
        {
          date: "昨天",
          list: [
            { id: 3, cover: "https://picsum.photos/200/200?random=h3", title: "AirPods Pro 第二代", price: 1399, tags: ["全新", "正品"], viewTime: "18:20" },
            { id: 4, cover: "https://picsum.photos/200/200?random=h4", title: "iPad Pro 12.9寸 M2", price: 6999, tags: ["95新", "送配件"], viewTime: "14:30" }
          ]
        },
        {
          date: "3天前",
          list: [
            { id: 5, cover: "https://picsum.photos/200/200?random=h5", title: "Sony WH-1000XM5 降噪耳机", price: 2199, tags: ["9成新", "箱说全"], viewTime: "20:45" }
          ]
        }
      ]);
      const goDetail = (item) => {
        uni.navigateTo({ url: `/pages-sub/trade/product/detail?id=${item.id}` });
      };
      const clearHistory = () => {
        uni.showModal({
          title: "提示",
          content: "确定清空所有浏览记录吗？",
          success: (res) => {
            if (res.confirm) {
              historyList.value = [];
              uni.showToast({ title: "已清空", icon: "success" });
            }
          }
        });
      };
      const __returned__ = { safeAreaBottom, scrollHeight, historyList, goDetail, clearHistory };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_tag = vue.resolveComponent("ui-tag");
    const _component_ui_price = vue.resolveComponent("ui-price");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "history-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "浏览足迹" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "history-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          $setup.historyList.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createVNode(_component_ui_icon, {
              name: "eye",
              size: 80,
              color: "#A1A1A6"
            }),
            vue.createElementVNode("text", { class: "empty-text" }, "暂无浏览记录")
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "history-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.historyList, (group) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: group.date,
                  class: "history-group"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "group-date" },
                    vue.toDisplayString(group.date),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "group-list" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(group.list, (item) => {
                        var _a;
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: item.id,
                          class: "history-item",
                          onClick: ($event) => $setup.goDetail(item)
                        }, [
                          vue.createVNode(_component_ui_image, {
                            src: item.cover,
                            width: "160rpx",
                            height: "160rpx",
                            radius: "8rpx"
                          }, null, 8, ["src"]),
                          vue.createElementVNode("view", { class: "item-info" }, [
                            vue.createElementVNode(
                              "text",
                              { class: "item-title" },
                              vue.toDisplayString(item.title),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode("view", { class: "item-tags" }, [
                              (vue.openBlock(true), vue.createElementBlock(
                                vue.Fragment,
                                null,
                                vue.renderList((_a = item.tags) == null ? void 0 : _a.slice(0, 2), (tag) => {
                                  return vue.openBlock(), vue.createBlock(
                                    _component_ui_tag,
                                    {
                                      key: tag,
                                      type: "primary",
                                      size: "sm"
                                    },
                                    {
                                      default: vue.withCtx(() => [
                                        vue.createTextVNode(
                                          vue.toDisplayString(tag),
                                          1
                                          /* TEXT */
                                        )
                                      ]),
                                      _: 2
                                      /* DYNAMIC */
                                    },
                                    1024
                                    /* DYNAMIC_SLOTS */
                                  );
                                }),
                                128
                                /* KEYED_FRAGMENT */
                              ))
                            ]),
                            vue.createElementVNode("view", { class: "item-bottom" }, [
                              vue.createVNode(_component_ui_price, {
                                value: item.price,
                                ":size": 40
                              }, null, 8, ["value"]),
                              vue.createElementVNode(
                                "text",
                                { class: "item-time" },
                                vue.toDisplayString(item.viewTime),
                                1
                                /* TEXT */
                              )
                            ])
                          ])
                        ], 8, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]))
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "history-footer" }, [
        vue.createVNode(_component_ui_button, {
          block: "",
          onClick: $setup.clearHistory
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode("清空浏览记录")
          ]),
          _: 1
          /* STABLE */
        })
      ])
    ]);
  }
  const PagesSubUserHistoryIndex = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$y], ["__scopeId", "data-v-44d80927"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/user/history/index.vue"]]);
  const _sfc_main$x = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { scrollHeight } = usePageLayout({
        hasSubNavbar: true
      });
      const goAccount = () => uni.showToast({ title: "账号与安全", icon: "none" });
      const goPrivacy = () => uni.showToast({ title: "隐私设置", icon: "none" });
      const goNotification = () => uni.showToast({ title: "通知设置", icon: "none" });
      const goGeneral = () => uni.showToast({ title: "通用设置", icon: "none" });
      const goLanguage = () => uni.showToast({ title: "语言设置", icon: "none" });
      const goFontSize = () => uni.showToast({ title: "字体大小", icon: "none" });
      const goAbout = () => uni.showToast({ title: "关于我们", icon: "none" });
      const goAgreement = () => uni.showToast({ title: "用户协议", icon: "none" });
      const goPrivacyPolicy = () => uni.showToast({ title: "隐私政策", icon: "none" });
      const goHelp = () => uni.showToast({ title: "帮助与反馈", icon: "none" });
      const clearCache = () => {
        uni.showModal({
          title: "提示",
          content: "确定清除缓存吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({ title: "清除中..." });
              setTimeout(() => {
                uni.hideLoading();
                uni.showToast({ title: "清除成功", icon: "success" });
              }, 1e3);
            }
          }
        });
      };
      const checkUpdate = () => {
        uni.showLoading({ title: "检查中..." });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({ title: "已是最新版本", icon: "success" });
        }, 1e3);
      };
      const handleLogout = () => {
        uni.showModal({
          title: "提示",
          content: "确定退出登录吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({ title: "已退出登录", icon: "success" });
              setTimeout(() => {
                uni.redirectTo({ url: "/pages-sub/user/login/index" });
              }, 1500);
            }
          }
        });
      };
      const __returned__ = { scrollHeight, goAccount, goPrivacy, goNotification, goGeneral, goLanguage, goFontSize, goAbout, goAgreement, goPrivacyPolicy, goHelp, clearCache, checkUpdate, handleLogout };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_cell = vue.resolveComponent("ui-cell");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "settings-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "设置" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "settings-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "settings-group" }, [
            vue.createVNode(_component_ui_cell, {
              title: "账号与安全",
              icon: "shield",
              "is-link": "",
              onClick: $setup.goAccount
            }),
            vue.createVNode(_component_ui_cell, {
              title: "隐私设置",
              icon: "lock",
              "is-link": "",
              onClick: $setup.goPrivacy
            }),
            vue.createVNode(_component_ui_cell, {
              title: "通知设置",
              icon: "bell",
              "is-link": "",
              onClick: $setup.goNotification
            })
          ]),
          vue.createElementVNode("view", { class: "settings-group" }, [
            vue.createVNode(_component_ui_cell, {
              title: "通用设置",
              icon: "settings",
              "is-link": "",
              onClick: $setup.goGeneral
            }),
            vue.createVNode(_component_ui_cell, {
              title: "语言",
              icon: "globe",
              value: "简体中文",
              "is-link": "",
              onClick: $setup.goLanguage
            }),
            vue.createVNode(_component_ui_cell, {
              title: "字体大小",
              icon: "type",
              value: "标准",
              "is-link": "",
              onClick: $setup.goFontSize
            })
          ]),
          vue.createElementVNode("view", { class: "settings-group" }, [
            vue.createVNode(_component_ui_cell, {
              title: "清除缓存",
              icon: "trash",
              value: "12.5MB",
              onClick: $setup.clearCache
            }),
            vue.createVNode(_component_ui_cell, {
              title: "关于我们",
              icon: "info-circle",
              "is-link": "",
              onClick: $setup.goAbout
            }),
            vue.createVNode(_component_ui_cell, {
              title: "用户协议",
              icon: "file-text",
              "is-link": "",
              onClick: $setup.goAgreement
            }),
            vue.createVNode(_component_ui_cell, {
              title: "隐私政策",
              icon: "file-text",
              "is-link": "",
              onClick: $setup.goPrivacyPolicy
            })
          ]),
          vue.createElementVNode("view", { class: "settings-group" }, [
            vue.createVNode(_component_ui_cell, {
              title: "检查更新",
              icon: "refresh",
              value: "v1.0.0",
              onClick: $setup.checkUpdate
            }),
            vue.createVNode(_component_ui_cell, {
              title: "帮助与反馈",
              icon: "help-circle",
              "is-link": "",
              onClick: $setup.goHelp
            })
          ]),
          vue.createElementVNode("view", { class: "logout-section" }, [
            vue.createVNode(_component_ui_button, {
              type: "danger",
              plain: "",
              block: "",
              onClick: $setup.handleLogout
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("退出登录")
              ]),
              _: 1
              /* STABLE */
            })
          ]),
          vue.createElementVNode("view", { class: "version-info" }, [
            vue.createElementVNode("text", null, "当前版本 v1.0.0")
          ])
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesSubUserSettingsIndex = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$x], ["__scopeId", "data-v-daf51fb5"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/user/settings/index.vue"]]);
  const _sfc_main$w = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 468
      });
      const balance = vue.ref(8888.88);
      const frozenAmount = vue.ref(500);
      const income = vue.ref(3580);
      const expense = vue.ref(1200);
      const transactions = vue.ref([
        { id: 1, type: "income", title: "商品销售收入", amount: 7999, time: "2024-01-15 10:30" },
        { id: 2, type: "expense", title: "提现", amount: 5e3, time: "2024-01-14 15:20" },
        { id: 3, type: "income", title: "商品销售收入", amount: 1399, time: "2024-01-13 09:15" },
        { id: 4, type: "expense", title: "平台服务费", amount: 50, time: "2024-01-12 18:00" },
        { id: 5, type: "income", title: "商品销售收入", amount: 2199, time: "2024-01-11 14:30" }
      ]);
      const handleWithdraw = () => {
        uni.showToast({ title: "提现功能开发中", icon: "none" });
      };
      const handleRecharge = () => {
        uni.showToast({ title: "充值功能开发中", icon: "none" });
      };
      const goBankCard = () => {
        uni.showToast({ title: "银行卡管理", icon: "none" });
      };
      const goAllTransactions = () => {
        uni.showToast({ title: "全部交易记录", icon: "none" });
      };
      const __returned__ = { safeAreaBottom, scrollHeight, balance, frozenAmount, income, expense, transactions, handleWithdraw, handleRecharge, goBankCard, goAllTransactions };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    return vue.openBlock(), vue.createElementBlock("view", { class: "wallet-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "我的钱包" }),
      vue.createElementVNode("view", { class: "wallet-header" }, [
        vue.createElementVNode("text", { class: "balance-label" }, "账户余额（元）"),
        vue.createElementVNode(
          "text",
          { class: "balance-value" },
          vue.toDisplayString($setup.balance.toFixed(2)),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "wallet-actions" }, [
          vue.createElementVNode("view", {
            class: "action-item",
            onClick: $setup.handleWithdraw
          }, [
            vue.createVNode(_component_ui_icon, {
              name: "arrow-up",
              ":size": 40
            }),
            vue.createElementVNode("text", null, "提现")
          ]),
          vue.createElementVNode("view", {
            class: "action-item",
            onClick: $setup.handleRecharge
          }, [
            vue.createVNode(_component_ui_icon, {
              name: "arrow-down",
              ":size": 40
            }),
            vue.createElementVNode("text", null, "充值")
          ]),
          vue.createElementVNode("view", {
            class: "action-item",
            onClick: $setup.goBankCard
          }, [
            vue.createVNode(_component_ui_icon, {
              name: "credit-card",
              ":size": 40
            }),
            vue.createElementVNode("text", null, "银行卡")
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "quick-stats" }, [
        vue.createElementVNode("view", { class: "stat-item" }, [
          vue.createElementVNode(
            "text",
            { class: "stat-value" },
            vue.toDisplayString($setup.frozenAmount.toFixed(2)),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "stat-label" }, "冻结金额")
        ]),
        vue.createElementVNode("view", { class: "stat-item" }, [
          vue.createElementVNode(
            "text",
            { class: "stat-value" },
            vue.toDisplayString($setup.income.toFixed(2)),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "stat-label" }, "本月收入")
        ]),
        vue.createElementVNode("view", { class: "stat-item" }, [
          vue.createElementVNode(
            "text",
            { class: "stat-value" },
            vue.toDisplayString($setup.expense.toFixed(2)),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "stat-label" }, "本月支出")
        ])
      ]),
      vue.createElementVNode("view", { class: "transaction-section" }, [
        vue.createElementVNode("view", { class: "section-header" }, [
          vue.createElementVNode("text", { class: "section-title" }, "交易记录"),
          vue.createElementVNode("text", {
            class: "section-more",
            onClick: $setup.goAllTransactions
          }, "全部")
        ]),
        vue.createElementVNode(
          "scroll-view",
          {
            "scroll-y": "",
            class: "transaction-scroll",
            style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
          },
          [
            $setup.transactions.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-state"
            }, [
              vue.createVNode(_component_ui_icon, {
                name: "file-text",
                size: 80,
                color: "#A1A1A6"
              }),
              vue.createElementVNode("text", { class: "empty-text" }, "暂无交易记录")
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "transaction-list"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.transactions, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item.id,
                    class: "transaction-item"
                  }, [
                    vue.createElementVNode("view", { class: "item-left" }, [
                      vue.createVNode(_component_ui_icon, {
                        name: item.type === "income" ? "arrow-down" : "arrow-up",
                        ":size": 40,
                        color: item.type === "income" ? "#1ABC9C" : "#FF3D00"
                      }, null, 8, ["name", "color"]),
                      vue.createElementVNode("view", { class: "item-info" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "item-title" },
                          vue.toDisplayString(item.title),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "item-time" },
                          vue.toDisplayString(item.time),
                          1
                          /* TEXT */
                        )
                      ])
                    ]),
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["item-amount", item.type])
                      },
                      vue.toDisplayString(item.type === "income" ? "+" : "-") + vue.toDisplayString(item.amount.toFixed(2)),
                      3
                      /* TEXT, CLASS */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]))
          ],
          4
          /* STYLE */
        )
      ])
    ]);
  }
  const PagesSubUserWalletIndex = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$w], ["__scopeId", "data-v-7c3f1ea1"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/user/wallet/index.vue"]]);
  const _sfc_main$v = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 120
      });
      const agreed = vue.ref(false);
      const form = vue.ref({
        realName: "",
        idCard: "",
        frontImage: "",
        backImage: ""
      });
      const canSubmit = vue.computed(() => {
        return form.value.realName && form.value.idCard && form.value.frontImage && form.value.backImage && agreed.value;
      });
      const uploadImage = (type) => {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            if (type === "front") {
              form.value.frontImage = res.tempFilePaths[0];
            } else {
              form.value.backImage = res.tempFilePaths[0];
            }
          }
        });
      };
      const goAgreement = () => {
        uni.showToast({ title: "实名认证服务协议", icon: "none" });
      };
      const handleSubmit = () => {
        if (!canSubmit.value)
          return;
        uni.showLoading({ title: "提交中..." });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({ title: "提交成功，请等待审核", icon: "success" });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }, 1500);
      };
      const __returned__ = { safeAreaBottom, scrollHeight, agreed, form, canSubmit, uploadImage, goAgreement, handleSubmit };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_checkbox = vue.resolveComponent("ui-checkbox");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "real-name-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "实名认证" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "auth-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "auth-tips" }, [
            vue.createVNode(_component_ui_icon, {
              name: "shield",
              ":size": 40,
              color: "#1ABC9C"
            }),
            vue.createElementVNode("text", { class: "tips-text" }, "实名认证后可发布商品、提现等功能")
          ]),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "真实姓名"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.form.realName = $event),
                  placeholder: "请输入身份证上的姓名"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.form.realName]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "身份证号"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.form.idCard = $event),
                  placeholder: "请输入身份证号码",
                  maxlength: "18"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.form.idCard]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "upload-section" }, [
            vue.createElementVNode("text", { class: "section-title" }, "身份证照片"),
            vue.createElementVNode("view", { class: "upload-list" }, [
              vue.createElementVNode("view", {
                class: "upload-item",
                onClick: _cache[2] || (_cache[2] = ($event) => $setup.uploadImage("front"))
              }, [
                !$setup.form.frontImage ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "upload-placeholder"
                }, [
                  vue.createVNode(_component_ui_icon, {
                    name: "camera",
                    ":size": 40
                  }),
                  vue.createElementVNode("text", null, "上传身份证人像面")
                ])) : (vue.openBlock(), vue.createBlock(_component_ui_image, {
                  key: 1,
                  src: $setup.form.frontImage,
                  width: "100%",
                  height: "100%",
                  radius: "8rpx"
                }, null, 8, ["src"]))
              ]),
              vue.createElementVNode("view", {
                class: "upload-item",
                onClick: _cache[3] || (_cache[3] = ($event) => $setup.uploadImage("back"))
              }, [
                !$setup.form.backImage ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "upload-placeholder"
                }, [
                  vue.createVNode(_component_ui_icon, {
                    name: "camera",
                    ":size": 40
                  }),
                  vue.createElementVNode("text", null, "上传身份证国徽面")
                ])) : (vue.openBlock(), vue.createBlock(_component_ui_image, {
                  key: 1,
                  src: $setup.form.backImage,
                  width: "100%",
                  height: "100%",
                  radius: "8rpx"
                }, null, 8, ["src"]))
              ])
            ]),
            vue.createElementVNode("text", { class: "upload-tips" }, "请确保证照片清晰、完整、无遮挡")
          ]),
          vue.createElementVNode("view", { class: "agreement-section" }, [
            vue.createVNode(_component_ui_checkbox, {
              modelValue: $setup.agreed,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.agreed = $event)
            }, null, 8, ["modelValue"]),
            vue.createElementVNode("text", { class: "agreement-text" }, [
              vue.createTextVNode(" 我已阅读并同意 "),
              vue.createElementVNode("text", {
                class: "link",
                onClick: $setup.goAgreement
              }, "《实名认证服务协议》")
            ])
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "auth-footer",
          style: vue.normalizeStyle({ paddingBottom: $setup.safeAreaBottom + 12 + "px" })
        },
        [
          vue.createVNode(_component_ui_button, {
            type: "primary",
            block: "",
            disabled: !$setup.canSubmit,
            onClick: $setup.handleSubmit
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(" 提交认证 ")
            ]),
            _: 1
            /* STABLE */
          }, 8, ["disabled"])
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesSubAuthRealNameIndex = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$v], ["__scopeId", "data-v-3e370b20"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/auth/real-name/index.vue"]]);
  const _sfc_main$u = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { safeAreaBottom, scrollHeight } = usePageLayout({
        hasSubNavbar: true,
        headerEstimatedHeight: 120
      });
      const agreed = vue.ref(false);
      const showCategoryPicker = vue.ref(false);
      const form = vue.ref({
        shopName: "",
        shopDesc: "",
        category: "",
        licenseImage: "",
        legalPerson: "",
        phone: "",
        address: ""
      });
      const canSubmit = vue.computed(() => {
        return form.value.shopName && form.value.category && form.value.licenseImage && form.value.legalPerson && form.value.phone && form.value.address && agreed.value;
      });
      const uploadLicense = () => {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            form.value.licenseImage = res.tempFilePaths[0];
          }
        });
      };
      const goAgreement = () => {
        uni.showToast({ title: "店铺认证服务协议", icon: "none" });
      };
      const handleSubmit = () => {
        if (!canSubmit.value)
          return;
        uni.showLoading({ title: "提交中..." });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({ title: "提交成功，请等待审核", icon: "success" });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }, 1500);
      };
      const __returned__ = { safeAreaBottom, scrollHeight, agreed, showCategoryPicker, form, canSubmit, uploadLicense, goAgreement, handleSubmit };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_sub_navbar = vue.resolveComponent("ui-sub-navbar");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_checkbox = vue.resolveComponent("ui-checkbox");
    const _component_ui_button = vue.resolveComponent("ui-button");
    return vue.openBlock(), vue.createElementBlock("view", { class: "shop-auth-page" }, [
      vue.createVNode(_component_ui_sub_navbar, { title: "店铺认证" }),
      vue.createElementVNode(
        "scroll-view",
        {
          "scroll-y": "",
          class: "auth-scroll",
          style: vue.normalizeStyle({ height: $setup.scrollHeight + "px" })
        },
        [
          vue.createElementVNode("view", { class: "auth-tips" }, [
            vue.createVNode(_component_ui_icon, {
              name: "store",
              ":size": 40,
              color: "#1ABC9C"
            }),
            vue.createElementVNode("text", { class: "tips-text" }, "店铺认证后可开通店铺、发布商品等功能")
          ]),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "店铺名称"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.form.shopName = $event),
                  placeholder: "请输入店铺名称",
                  maxlength: "20"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.form.shopName]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "店铺简介"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  class: "form-textarea",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.form.shopDesc = $event),
                  placeholder: "请输入店铺简介",
                  maxlength: "200"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.form.shopDesc]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "经营类目"),
              vue.createElementVNode("view", {
                class: "form-select",
                onClick: _cache[2] || (_cache[2] = ($event) => $setup.showCategoryPicker = true)
              }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass({ placeholder: !$setup.form.category })
                  },
                  vue.toDisplayString($setup.form.category || "请选择经营类目"),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createVNode(_component_ui_icon, {
                  name: "arrow-right",
                  ":size": 32
                })
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "upload-section" }, [
            vue.createElementVNode("text", { class: "section-title" }, "营业执照"),
            vue.createElementVNode("view", {
              class: "upload-item",
              onClick: $setup.uploadLicense
            }, [
              !$setup.form.licenseImage ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "upload-placeholder"
              }, [
                vue.createVNode(_component_ui_icon, {
                  name: "camera",
                  ":size": 40
                }),
                vue.createElementVNode("text", null, "上传营业执照")
              ])) : (vue.openBlock(), vue.createBlock(_component_ui_image, {
                key: 1,
                src: $setup.form.licenseImage,
                width: "100%",
                height: "100%",
                radius: "8rpx"
              }, null, 8, ["src"]))
            ]),
            vue.createElementVNode("text", { class: "upload-tips" }, "请确保营业执照清晰、完整、在有效期内")
          ]),
          vue.createElementVNode("view", { class: "form-section" }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "法人姓名"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.form.legalPerson = $event),
                  placeholder: "请输入法人姓名"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.form.legalPerson]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "联系电话"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  type: "tel",
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.form.phone = $event),
                  placeholder: "请输入联系电话",
                  maxlength: "11"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.form.phone]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("text", { class: "form-label" }, "经营地址"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "form-input",
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.form.address = $event),
                  placeholder: "请输入经营地址"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $setup.form.address]
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "agreement-section" }, [
            vue.createVNode(_component_ui_checkbox, {
              modelValue: $setup.agreed,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.agreed = $event)
            }, null, 8, ["modelValue"]),
            vue.createElementVNode("text", { class: "agreement-text" }, [
              vue.createTextVNode(" 我已阅读并同意 "),
              vue.createElementVNode("text", {
                class: "link",
                onClick: $setup.goAgreement
              }, "《店铺认证服务协议》")
            ])
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: "auth-footer",
          style: vue.normalizeStyle({ paddingBottom: $setup.safeAreaBottom + 12 + "px" })
        },
        [
          vue.createVNode(_component_ui_button, {
            type: "primary",
            block: "",
            disabled: !$setup.canSubmit,
            onClick: $setup.handleSubmit
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(" 提交认证 ")
            ]),
            _: 1
            /* STABLE */
          }, 8, ["disabled"])
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesSubAuthShopAuthIndex = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$u], ["__scopeId", "data-v-c1c19908"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/pages-sub/auth/shop-auth/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/follow/index", PagesFollowIndex);
  __definePage("pages/message/index", PagesMessageIndex);
  __definePage("pages/my/index", PagesMyIndex);
  __definePage("pages/publish/placeholder", PagesPublishPlaceholder);
  __definePage("pages-sub/trade/product/detail", PagesSubTradeProductDetail);
  __definePage("pages-sub/trade/product/list", PagesSubTradeProductList);
  __definePage("pages-sub/trade/cart/index", PagesSubTradeCartIndex);
  __definePage("pages-sub/trade/order/list", PagesSubTradeOrderList);
  __definePage("pages-sub/trade/order/detail", PagesSubTradeOrderDetail);
  __definePage("pages-sub/trade/order/confirm", PagesSubTradeOrderConfirm);
  __definePage("pages-sub/trade/pay/index", PagesSubTradePayIndex);
  __definePage("pages-sub/trade/evaluate/index", PagesSubTradeEvaluateIndex);
  __definePage("pages-sub/trade/search/index", PagesSubTradeSearchIndex);
  __definePage("pages-sub/seller/publish/entry", PagesSubSellerPublishEntry);
  __definePage("pages-sub/seller/shop/index", PagesSubSellerShopIndex);
  __definePage("pages-sub/seller/shop/manage", PagesSubSellerShopManage);
  __definePage("pages-sub/seller/goods/list", PagesSubSellerGoodsList);
  __definePage("pages-sub/seller/goods/edit", PagesSubSellerGoodsEdit);
  __definePage("pages-sub/seller/after-sale/list", PagesSubSellerAfterSaleList);
  __definePage("pages-sub/seller/after-sale/detail", PagesSubSellerAfterSaleDetail);
  __definePage("pages-sub/content/post/detail", PagesSubContentPostDetail);
  __definePage("pages-sub/content/post/publish", PagesSubContentPostPublish);
  __definePage("pages-sub/content/topic/index", PagesSubContentTopicIndex);
  __definePage("pages-sub/content/user/index", PagesSubContentUserIndex);
  __definePage("pages-sub/user/login/index", PagesSubUserLoginIndex);
  __definePage("pages-sub/user/address/list", PagesSubUserAddressList);
  __definePage("pages-sub/user/address/edit", PagesSubUserAddressEdit);
  __definePage("pages-sub/user/collection/index", PagesSubUserCollectionIndex);
  __definePage("pages-sub/user/history/index", PagesSubUserHistoryIndex);
  __definePage("pages-sub/user/settings/index", PagesSubUserSettingsIndex);
  __definePage("pages-sub/user/wallet/index", PagesSubUserWalletIndex);
  __definePage("pages-sub/auth/real-name/index", PagesSubAuthRealNameIndex);
  __definePage("pages-sub/auth/shop-auth/index", PagesSubAuthShopAuthIndex);
  const _sfc_main$t = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props, { expose: __expose }) {
      __expose();
      formatAppLog("log", "at App.vue:12", "App setup running");
      onLaunch(() => {
        formatAppLog("log", "at App.vue:15", "App Launch");
      });
      onShow(() => {
        formatAppLog("log", "at App.vue:19", "App Show");
      });
      onHide(() => {
        formatAppLog("log", "at App.vue:23", "App Hide");
      });
      const __returned__ = {};
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "app-container" }, [
      vue.createElementVNode("view", { class: "test-content" }, [
        vue.createElementVNode("text", { class: "title" }, "✓ XinMall 正常运行")
      ])
    ]);
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$t], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/App.vue"]]);
  const _sfc_main$s = /* @__PURE__ */ vue.defineComponent({
    __name: "UiAvatar",
    props: {
      src: { type: String, required: false },
      text: { type: String, required: false },
      size: { type: Number, required: false, default: 80 },
      shape: { type: String, required: false, default: "circle" },
      bordered: { type: Boolean, required: false, default: true },
      bg: { type: String, required: false, default: "#B0B5C1" }
    },
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const loadError = vue.ref(false);
      vue.watch(() => props.src, () => {
        loadError.value = false;
      });
      const textSize = vue.computed(() => props.size * 0.45);
      const handleError = () => {
        loadError.value = true;
      };
      const __returned__ = { props, emit, loadError, textSize, handleError };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-avatar", [
          `shape-${$props.shape}`,
          { "is-bordered": $props.bordered }
        ]]),
        style: vue.normalizeStyle({
          width: $props.size + "rpx",
          height: $props.size + "rpx",
          backgroundColor: $props.bg
        }),
        onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("click"))
      },
      [
        $props.src && !$setup.loadError ? (vue.openBlock(), vue.createElementBlock("image", {
          key: 0,
          class: "avatar-img",
          src: $props.src,
          mode: "aspectFill",
          onError: $setup.handleError
        }, null, 40, ["src"])) : $props.text ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 1,
            class: "avatar-text",
            style: vue.normalizeStyle({ fontSize: $setup.textSize + "rpx" })
          },
          vue.toDisplayString($props.text.charAt(0).toUpperCase()),
          5
          /* TEXT, STYLE */
        )) : (vue.openBlock(), vue.createBlock(_component_ui_icon, {
          key: 2,
          name: "user",
          color: "#FFFFFF",
          size: $setup.textSize
        }, null, 8, ["size"]))
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const UiAvatar = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$s], ["__scopeId", "data-v-7a13af65"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/atoms/UiAvatar.vue"]]);
  const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiAvatar
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$r = /* @__PURE__ */ vue.defineComponent({
    __name: "UiBadge",
    props: {
      value: { type: [Number, String], required: false },
      max: { type: Number, required: false, default: 99 },
      isDot: { type: Boolean, required: false, default: false },
      type: { type: String, required: false, default: "error" },
      color: { type: String, required: false },
      offset: { type: Array, required: false }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const show = vue.computed(() => {
        if (props.isDot)
          return true;
        if (typeof props.value === "number")
          return props.value > 0;
        return !!props.value;
      });
      const displayValue = vue.computed(() => {
        if (typeof props.value === "number" && props.value > props.max) {
          return `${props.max}+`;
        }
        return props.value;
      });
      const customStyle = vue.computed(() => {
        const style = {};
        if (props.color)
          style.backgroundColor = props.color;
        if (props.offset) {
          style.right = `${props.offset[0]}rpx`;
          style.top = `${props.offset[1]}rpx`;
        }
        return style;
      });
      const __returned__ = { props, show, displayValue, customStyle };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "ui-badge-wrapper" }, [
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
      $setup.show ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: vue.normalizeClass(["ui-badge", [
            $props.type,
            { "is-dot": $props.isDot, "is-fixed": !!_ctx.$slots.default }
          ]]),
          style: vue.normalizeStyle($setup.customStyle)
        },
        [
          !$props.isDot ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              class: "badge-text"
            },
            vue.toDisplayString($setup.displayValue),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true)
        ],
        6
        /* CLASS, STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const UiBadge = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$r], ["__scopeId", "data-v-9f8e60b0"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/atoms/UiBadge.vue"]]);
  const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiBadge
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$q = /* @__PURE__ */ vue.defineComponent({
    __name: "UiButton",
    props: {
      label: { type: String, required: false },
      variant: { type: String, required: false, default: "primary" },
      size: { type: String, required: false, default: "md" },
      block: { type: Boolean, required: false, default: false },
      disabled: { type: Boolean, required: false, default: false },
      loading: { type: Boolean, required: false, default: false }
    },
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const handleClick = (e) => {
        if (!props.disabled && !props.loading) {
          emit("click", e);
        }
      };
      const __returned__ = { props, emit, handleClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("button", {
      class: vue.normalizeClass(["ui-btn", [
        `ui-btn--${$props.variant}`,
        `ui-btn--${$props.size}`,
        { "ui-btn--block": $props.block },
        { "ui-btn--disabled": $props.disabled || $props.loading }
      ]]),
      "hover-class": !$props.disabled && !$props.loading ? "ui-btn--hover" : "",
      disabled: $props.disabled || $props.loading,
      onClick: $setup.handleClick
    }, [
      $props.loading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "ui-btn__loading"
      })) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("text", { class: "ui-btn__text" }, [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          vue.createTextVNode(
            vue.toDisplayString($props.label),
            1
            /* TEXT */
          )
        ], true)
      ])
    ], 10, ["hover-class", "disabled"]);
  }
  const UiButton = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$q], ["__scopeId", "data-v-bd85617b"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/atoms/UiButton.vue"]]);
  const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiButton
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$p = /* @__PURE__ */ vue.defineComponent({
    __name: "UiDivider",
    props: {
      text: { type: String, required: false },
      vertical: { type: Boolean, required: false },
      dashed: { type: Boolean, required: false, default: false },
      lineColor: { type: String, required: false },
      textColor: { type: String, required: false },
      margin: { type: String, required: false, default: "32rpx 0" }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const wrapperStyle = vue.computed(() => ({
        margin: props.vertical ? "0 16rpx" : props.margin
      }));
      const lineStyle = vue.computed(() => {
        const color = props.lineColor || "rgba(0, 0, 0, 0.06)";
        return {
          borderTop: props.dashed ? `1px dashed ${color}` : `1px solid ${color}`
        };
      });
      const __returned__ = { props, wrapperStyle, lineStyle };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-divider", { "is-vertical": $props.vertical }]),
        style: vue.normalizeStyle($setup.wrapperStyle)
      },
      [
        !$props.vertical ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: "line",
            style: vue.normalizeStyle($setup.lineStyle)
          },
          null,
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true),
        $props.text && !$props.vertical ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 1,
            class: "text",
            style: vue.normalizeStyle({ color: $props.textColor })
          },
          vue.toDisplayString($props.text),
          5
          /* TEXT, STYLE */
        )) : vue.createCommentVNode("v-if", true),
        !$props.vertical && $props.text ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 2,
            class: "line",
            style: vue.normalizeStyle($setup.lineStyle)
          },
          null,
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const UiDivider = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$p], ["__scopeId", "data-v-93d0cac1"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/atoms/UiDivider.vue"]]);
  const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiDivider
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$o = /* @__PURE__ */ vue.defineComponent({
    __name: "UiImage",
    props: {
      src: { type: String, required: true },
      width: { type: String, required: false, default: "100%" },
      height: { type: String, required: false, default: "100%" },
      radius: { type: String, required: false, default: "16rpx" },
      mode: { type: String, required: false, default: "aspectFill" }
    },
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const loading = vue.ref(true);
      const loaded = vue.ref(false);
      const error = vue.ref(false);
      vue.watch(() => props.src, () => {
        loading.value = true;
        loaded.value = false;
        error.value = false;
      });
      const onLoad = () => {
        loading.value = false;
        loaded.value = true;
      };
      const onError = () => {
        loading.value = false;
        error.value = true;
      };
      const __returned__ = { props, emit, loading, loaded, error, onLoad, onError };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "ui-image",
        style: vue.normalizeStyle({
          width: $props.width,
          height: $props.height,
          borderRadius: $props.radius
        }),
        onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("click"))
      },
      [
        $setup.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "placeholder loading"
        }, [
          vue.createElementVNode("view", { class: "skeleton-shimmer" })
        ])) : vue.createCommentVNode("v-if", true),
        $setup.error ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "placeholder error"
        }, [
          vue.createVNode(_component_ui_icon, {
            name: "image-off",
            size: 48,
            color: "#A1A1A6"
          })
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("image", {
          class: vue.normalizeClass(["real-image", { "fade-in": $setup.loaded }]),
          src: $props.src,
          mode: $props.mode,
          "lazy-load": true,
          onLoad: $setup.onLoad,
          onError: $setup.onError
        }, null, 42, ["src", "mode"])
      ],
      4
      /* STYLE */
    );
  }
  const UiImage = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$o], ["__scopeId", "data-v-4246ba24"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/atoms/UiImage.vue"]]);
  const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiImage
  }, Symbol.toStringTag, { value: "Module" }));
  const formatPrice = (value, decimals = 2, symbol = "¥") => {
    const num = Number(value);
    if (isNaN(num))
      return `${symbol}0.00`;
    const parts = num.toFixed(decimals).toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${symbol}${parts.join(".")}`;
  };
  const splitPrice = (value) => {
    const priceStr = formatPrice(value, 2, "");
    const [integer, decimal] = priceStr.split(".");
    return {
      symbol: "¥",
      integer,
      decimal,
      full: `¥${priceStr}`
    };
  };
  const _sfc_main$n = /* @__PURE__ */ vue.defineComponent({
    __name: "UiPrice",
    props: {
      value: {
        type: [Number, String],
        required: true,
        default: 0
      },
      type: {
        type: String,
        default: "main"
      },
      size: {
        type: Number,
        default: 36
      },
      color: {
        type: String,
        default: ""
      },
      bold: {
        type: Boolean,
        default: true
      },
      decimalDigits: {
        type: Number,
        default: 2
      },
      showSymbol: {
        type: Boolean,
        default: true
      },
      mode: {
        type: String,
        default: "normal"
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const priceParts = vue.computed(() => {
        const rawParts = splitPrice(props.value);
        return {
          integer: rawParts.integer,
          decimal: rawParts.decimal.substring(0, props.decimalDigits)
        };
      });
      const finalColor = vue.computed(() => {
        if (props.color)
          return props.color;
        if (props.type === "del")
          return "#A1A1A6";
        if (props.type === "main")
          return "#FF3D00";
        return "#1D1D1F";
      });
      const intSize = vue.computed(() => props.type === "del" ? props.size * 0.8 : props.size);
      const symbolSize = vue.computed(() => intSize.value * 0.65);
      const decimalSize = vue.computed(() => intSize.value * 0.7);
      const __returned__ = { props, priceParts, finalColor, intSize, symbolSize, decimalSize };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-price", [
          { "is-del": $props.type === "del" },
          $props.mode
        ]]),
        style: vue.normalizeStyle({ color: $setup.finalColor })
      },
      [
        $props.showSymbol ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 0,
            class: "symbol",
            style: vue.normalizeStyle({ fontSize: $setup.symbolSize + "rpx" })
          },
          "¥",
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode(
          "text",
          {
            class: "integer",
            style: vue.normalizeStyle({
              fontSize: $setup.intSize + "rpx",
              fontWeight: $props.bold ? 600 : 400
            })
          },
          vue.toDisplayString($setup.priceParts.integer),
          5
          /* TEXT, STYLE */
        ),
        $props.decimalDigits > 0 ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 1,
            class: "decimal",
            style: vue.normalizeStyle({ fontSize: $setup.decimalSize + "rpx" })
          },
          "." + vue.toDisplayString($setup.priceParts.decimal),
          5
          /* TEXT, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const UiPrice = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$n], ["__scopeId", "data-v-1d91717f"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/atoms/UiPrice.vue"]]);
  const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiPrice
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$m = /* @__PURE__ */ vue.defineComponent({
    __name: "UiSkeleton",
    props: {
      width: { type: String, required: false, default: "100%" },
      height: { type: String, required: false, default: "32rpx" },
      circle: { type: Boolean, required: false },
      radius: { type: String, required: false, default: "8rpx" },
      animate: { type: Boolean, required: false, default: true },
      marginBottom: { type: String, required: false, default: "0" },
      marginTop: { type: String, required: false, default: "0" }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const __returned__ = { props };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-skeleton", { "is-animate": $props.animate }]),
        style: vue.normalizeStyle({
          width: $props.width,
          height: $props.height,
          borderRadius: $props.circle ? "50%" : $props.radius,
          marginTop: $props.marginTop,
          marginBottom: $props.marginBottom
        })
      },
      null,
      6
      /* CLASS, STYLE */
    );
  }
  const UiSkeleton = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$m], ["__scopeId", "data-v-c6e6dbea"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/atoms/UiSkeleton.vue"]]);
  const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiSkeleton
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$l = /* @__PURE__ */ vue.defineComponent({
    __name: "UiTag",
    props: {
      type: { type: String, required: false, default: "primary" },
      size: { type: String, required: false, default: "sm" },
      plain: { type: Boolean, required: false, default: false },
      round: { type: Boolean, required: false, default: false }
    },
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const __returned__ = { props, emit };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-tag", [
          `ui-tag--${$props.type}`,
          `ui-tag--${$props.size}`,
          { "ui-tag--plain": $props.plain },
          { "ui-tag--round": $props.round }
        ]]),
        onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("click"))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      2
      /* CLASS */
    );
  }
  const UiTag = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$l], ["__scopeId", "data-v-18a481d6"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/atoms/UiTag.vue"]]);
  const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiTag
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$k = /* @__PURE__ */ vue.defineComponent({
    __name: "UiText",
    props: {
      size: { type: String, required: false, default: "md" },
      color: { type: String, required: false, default: "main" },
      weight: { type: String, required: false, default: "regular" },
      price: { type: Boolean, required: false, default: false },
      lineThrough: { type: Boolean, required: false, default: false }
    },
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const __returned__ = { props, emit };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        class: vue.normalizeClass(["ui-text", [
          `ui-text--${$props.size}`,
          `ui-text--${$props.color}`,
          `ui-text--weight-${$props.weight}`,
          { "ui-text--price": $props.price },
          { "ui-text--line-through": $props.lineThrough }
        ]]),
        onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("click"))
      },
      [
        $props.price ? (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          { key: 0 },
          [
            vue.createTextVNode("¥")
          ],
          64
          /* STABLE_FRAGMENT */
        )) : vue.createCommentVNode("v-if", true),
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      2
      /* CLASS */
    );
  }
  const UiText = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$k], ["__scopeId", "data-v-2d5a8336"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/atoms/UiText.vue"]]);
  const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiText
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$j = /* @__PURE__ */ vue.defineComponent({
    __name: "UiCell",
    props: {
      title: { type: String, required: true },
      value: { type: String, required: false },
      label: { type: String, required: false },
      icon: { type: String, required: false },
      iconColor: { type: String, required: false, default: "#1D1D1F" },
      isLink: { type: Boolean, required: false, default: false },
      url: { type: String, required: false },
      border: { type: Boolean, required: false, default: true },
      glass: { type: Boolean, required: false, default: false },
      separated: { type: Boolean, required: false, default: false },
      customClass: { type: String, required: false },
      valueColor: { type: String, required: false }
    },
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const handleClick = () => {
        emit("click");
        if (props.url) {
          uni.navigateTo({ url: props.url });
        }
      };
      const __returned__ = { props, emit, handleClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-cell", [
          { "is-glass": $props.glass },
          { "no-border": !$props.border },
          { "is-separated": $props.separated }
        ]]),
        onClick: $setup.handleClick
      },
      [
        vue.createElementVNode("view", { class: "cell-left" }, [
          $props.icon ? (vue.openBlock(), vue.createBlock(_component_ui_icon, {
            key: 0,
            name: $props.icon,
            ":size": 40,
            color: $props.iconColor,
            class: "cell-icon"
          }, null, 8, ["name", "color"])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "cell-title-group" }, [
            vue.createElementVNode(
              "text",
              { class: "cell-title" },
              vue.toDisplayString($props.title),
              1
              /* TEXT */
            ),
            $props.label ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                class: "cell-label"
              },
              vue.toDisplayString($props.label),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        vue.createElementVNode("view", { class: "cell-right" }, [
          vue.createElementVNode(
            "text",
            {
              class: "cell-value",
              style: vue.normalizeStyle({ color: $props.valueColor })
            },
            vue.toDisplayString($props.value),
            5
            /* TEXT, STYLE */
          ),
          vue.renderSlot(_ctx.$slots, "right-icon", {}, () => [
            $props.isLink ? (vue.openBlock(), vue.createBlock(_component_ui_icon, {
              key: 0,
              name: "arrow-right",
              ":size": 40,
              color: "#A1A1A6",
              class: "arrow"
            })) : vue.createCommentVNode("v-if", true)
          ], true)
        ])
      ],
      2
      /* CLASS */
    );
  }
  const UiCell = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$j], ["__scopeId", "data-v-bc9e3452"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/molecules/UiCell.vue"]]);
  const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiCell
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$i = /* @__PURE__ */ vue.defineComponent({
    __name: "UiCheckbox",
    props: {
      modelValue: { type: Boolean, required: true, default: false },
      label: { type: String, required: false },
      shape: { type: String, required: false, default: "round" },
      disabled: { type: Boolean, required: false, default: false },
      color: { type: String, required: false }
    },
    emits: ["update:modelValue", "change"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const checkedStyle = vue.computed(() => {
        if (!props.modelValue)
          return {};
        return {
          backgroundColor: props.color || "#1ABC9C",
          borderColor: props.color || "#1ABC9C"
        };
      });
      const toggle = () => {
        if (props.disabled)
          return;
        const newValue = !props.modelValue;
        emit("update:modelValue", newValue);
        emit("change", newValue);
      };
      const __returned__ = { props, emit, checkedStyle, toggle };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-checkbox", { "is-disabled": $props.disabled }]),
        onClick: vue.withModifiers($setup.toggle, ["stop"])
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["checkbox-icon", { "is-checked": $props.modelValue, "is-round": $props.shape === "round" }]),
            style: vue.normalizeStyle($setup.checkedStyle)
          },
          [
            $props.modelValue ? (vue.openBlock(), vue.createBlock(_component_ui_icon, {
              key: 0,
              name: "check",
              size: 40,
              color: "#FFFFFF"
            })) : vue.createCommentVNode("v-if", true)
          ],
          6
          /* CLASS, STYLE */
        ),
        $props.label ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 0,
            class: "checkbox-label"
          },
          vue.toDisplayString($props.label),
          1
          /* TEXT */
        )) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const UiCheckbox = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$i], ["__scopeId", "data-v-7b562f4c"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/molecules/UiCheckbox.vue"]]);
  const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiCheckbox
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$h = /* @__PURE__ */ vue.defineComponent({
    __name: "UiInput",
    props: {
      modelValue: { type: [String, Number], required: true },
      type: { type: String, required: false, default: "text" },
      placeholder: { type: String, required: false, default: "请输入" },
      disabled: { type: Boolean, required: false },
      clearable: { type: Boolean, required: false, default: true },
      maxlength: { type: Number, required: false, default: 140 },
      error: { type: Boolean, required: false, default: false }
    },
    emits: ["update:modelValue", "confirm", "clear"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const isFocused = vue.ref(false);
      const showPassword = vue.ref(false);
      const inputType = vue.computed(() => {
        if (props.type === "password") {
          return showPassword.value ? "text" : "password";
        }
        return props.type;
      });
      const handleInput = (e) => {
        emit("update:modelValue", e.detail.value);
      };
      const handleClear = () => {
        emit("update:modelValue", "");
        emit("clear");
      };
      const togglePassword = () => {
        showPassword.value = !showPassword.value;
      };
      const __returned__ = { props, emit, isFocused, showPassword, inputType, handleInput, handleClear, togglePassword };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_UiIcon = resolveEasycom(vue.resolveDynamicComponent("UiIcon"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-input-wrapper", {
          "is-focus": $setup.isFocused,
          "is-disabled": $props.disabled,
          "is-error": $props.error
        }])
      },
      [
        _ctx.$slots.prefix ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "ui-input__prefix"
        }, [
          vue.renderSlot(_ctx.$slots, "prefix", {}, void 0, true)
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("input", {
          class: "ui-input__inner",
          type: $setup.inputType,
          value: $props.modelValue,
          placeholder: $props.placeholder,
          "placeholder-class": "ui-input-placeholder",
          disabled: $props.disabled,
          maxlength: $props.maxlength,
          onInput: $setup.handleInput,
          onFocus: _cache[0] || (_cache[0] = ($event) => $setup.isFocused = true),
          onBlur: _cache[1] || (_cache[1] = ($event) => $setup.isFocused = false),
          onConfirm: _cache[2] || (_cache[2] = ($event) => $setup.emit("confirm"))
        }, null, 40, ["type", "value", "placeholder", "disabled", "maxlength"]),
        vue.createElementVNode("view", { class: "ui-input__actions" }, [
          $props.clearable && $props.modelValue && $setup.isFocused ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "ui-input__icon-btn",
            onClick: vue.withModifiers($setup.handleClear, ["stop"])
          }, [
            vue.createVNode(_component_UiIcon, {
              name: "close-circle-fill",
              color: "#A1A1A6",
              size: 40
            })
          ])) : vue.createCommentVNode("v-if", true),
          $props.type === "password" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "ui-input__icon-btn",
            onClick: vue.withModifiers($setup.togglePassword, ["stop"])
          }, [
            vue.createVNode(_component_UiIcon, {
              name: $setup.showPassword ? "eye" : "eye-off",
              color: "#6E6E73",
              size: "36"
            }, null, 8, ["name"])
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        _ctx.$slots.suffix ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "ui-input__suffix"
        }, [
          vue.renderSlot(_ctx.$slots, "suffix", {}, void 0, true)
        ])) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const UiInput = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$h], ["__scopeId", "data-v-bd629416"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/molecules/UiInput.vue"]]);
  const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiInput
  }, Symbol.toStringTag, { value: "Module" }));
  const IOS_NAV_BAR_HEIGHT = 44;
  const ANDROID_NAV_BAR_HEIGHT = 48;
  const DEFAULT_STATUS_BAR_HEIGHT = 20;
  const DEFAULT_SCREEN_WIDTH = 375;
  const DEFAULT_SCREEN_HEIGHT = 667;
  function getPlatform() {
    const systemInfo = uni.getSystemInfoSync();
    const platform = systemInfo.platform || "";
    const uniPlatform = systemInfo.uniPlatform || "";
    if (uniPlatform === "mp-weixin" || platform === "mp-weixin") {
      return "mp-weixin";
    }
    if (uniPlatform === "h5" || typeof window !== "undefined") {
      if (platform === "ios")
        return "ios";
      if (platform === "android")
        return "android";
      return "h5";
    }
    if (uniPlatform === "app" || platform === "ios" || platform === "android") {
      return platform === "ios" ? "ios" : "android";
    }
    return "unknown";
  }
  function getIOSStatusBarHeight() {
    const systemInfo = uni.getSystemInfoSync();
    const model = systemInfo.model || "";
    const statusBarHeight = systemInfo.statusBarHeight || 0;
    if (statusBarHeight > 0) {
      return statusBarHeight;
    }
    const notchModels = ["iPhone X", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15"];
    const hasNotch = notchModels.some((m) => model.includes(m)) || model.includes("iPhone");
    if (hasNotch && model.includes("iPhone")) {
      return 44;
    }
    return DEFAULT_STATUS_BAR_HEIGHT;
  }
  function getAndroidStatusBarHeight() {
    const systemInfo = uni.getSystemInfoSync();
    return systemInfo.statusBarHeight || 24;
  }
  function getMPNavBarHeight() {
    return IOS_NAV_BAR_HEIGHT;
  }
  function getH5NavBarHeight() {
    return IOS_NAV_BAR_HEIGHT;
  }
  function getAppNavBarHeight(platform) {
    return platform === "ios" ? IOS_NAV_BAR_HEIGHT : ANDROID_NAV_BAR_HEIGHT;
  }
  function getSafeArea() {
    const systemInfo = uni.getSystemInfoSync();
    const safeArea = systemInfo.safeArea || {
      top: 0,
      bottom: systemInfo.screenHeight || DEFAULT_SCREEN_HEIGHT,
      left: 0,
      right: systemInfo.screenWidth || DEFAULT_SCREEN_WIDTH
    };
    return {
      top: safeArea.top || 0,
      bottom: safeArea.bottom || systemInfo.screenHeight || DEFAULT_SCREEN_HEIGHT,
      left: safeArea.left || 0,
      right: safeArea.right || systemInfo.screenWidth || DEFAULT_SCREEN_WIDTH
    };
  }
  function getBottomSafeHeight(platform, screenHeight, safeAreaBottom) {
    if (platform === "h5") {
      return 0;
    }
    const bottomSafe = screenHeight - safeAreaBottom;
    return bottomSafe > 0 ? bottomSafe : 0;
  }
  function getMPCapsuleInfo() {
    try {
      if (uni.getMenuButtonBoundingClientRect) {
        const rect = uni.getMenuButtonBoundingClientRect();
        return {
          width: rect.width || 87,
          height: rect.height || 32,
          right: rect.right || 0,
          top: rect.top || 0
        };
      }
    } catch {
      formatAppLog("warn", "at composables/useScreen.ts:144", "获取胶囊按钮信息失败");
    }
    return {
      width: 87,
      height: 32,
      right: 7,
      top: 4
    };
  }
  function checkHasNotch(platform, statusBarHeight) {
    if (platform === "ios") {
      return statusBarHeight >= 44;
    }
    if (platform === "android") {
      return statusBarHeight >= 28;
    }
    return false;
  }
  function useScreen() {
    const statusBarHeight = vue.ref(DEFAULT_STATUS_BAR_HEIGHT);
    const navBarHeight = vue.ref(IOS_NAV_BAR_HEIGHT);
    const totalNavHeight = vue.ref(64);
    const screenWidth = vue.ref(DEFAULT_SCREEN_WIDTH);
    const screenHeight = vue.ref(DEFAULT_SCREEN_HEIGHT);
    const windowHeight = vue.ref(DEFAULT_SCREEN_HEIGHT);
    const windowWidth = vue.ref(DEFAULT_SCREEN_WIDTH);
    const safeAreaTop = vue.ref(0);
    const safeAreaBottom = vue.ref(DEFAULT_SCREEN_HEIGHT);
    const safeAreaLeft = vue.ref(0);
    const safeAreaRight = vue.ref(DEFAULT_SCREEN_WIDTH);
    const pixelRatio = vue.ref(1);
    const platform = vue.ref("unknown");
    const bottomSafeHeight = vue.ref(0);
    const capsuleWidth = vue.ref(87);
    const capsuleHeight = vue.ref(32);
    const capsuleRight = vue.ref(7);
    const capsuleTop = vue.ref(4);
    const isIOS = vue.computed(() => platform.value === "ios");
    const isAndroid = vue.computed(() => platform.value === "android");
    const isMP = vue.computed(() => platform.value === "mp-weixin");
    const isH5 = vue.computed(() => platform.value === "h5");
    const isApp = vue.computed(() => isIOS.value || isAndroid.value);
    const hasNotch = vue.computed(() => checkHasNotch(platform.value, statusBarHeight.value));
    const safeArea = vue.computed(() => ({
      top: safeAreaTop.value,
      bottom: safeAreaBottom.value,
      left: safeAreaLeft.value,
      right: safeAreaRight.value,
      width: safeAreaRight.value - safeAreaLeft.value,
      height: safeAreaBottom.value - safeAreaTop.value
    }));
    const contentHeight = vue.computed(() => {
      return windowHeight.value - totalNavHeight.value - bottomSafeHeight.value;
    });
    const screenInfo = vue.computed(() => ({
      statusBarHeight: statusBarHeight.value,
      navBarHeight: navBarHeight.value,
      totalNavHeight: totalNavHeight.value,
      screenWidth: screenWidth.value,
      screenHeight: screenHeight.value,
      windowHeight: windowHeight.value,
      windowWidth: windowWidth.value,
      safeAreaTop: safeAreaTop.value,
      safeAreaBottom: safeAreaBottom.value,
      safeAreaLeft: safeAreaLeft.value,
      safeAreaRight: safeAreaRight.value,
      pixelRatio: pixelRatio.value,
      platform: platform.value,
      isIOS: isIOS.value,
      isAndroid: isAndroid.value,
      isMP: isMP.value,
      isH5: isH5.value,
      isApp: isApp.value,
      hasNotch: hasNotch.value,
      bottomSafeHeight: bottomSafeHeight.value,
      capsuleWidth: capsuleWidth.value,
      capsuleHeight: capsuleHeight.value,
      capsuleRight: capsuleRight.value,
      capsuleTop: capsuleTop.value
    }));
    function initScreenInfo() {
      const systemInfo = uni.getSystemInfoSync();
      const currentPlatform = getPlatform();
      platform.value = currentPlatform;
      screenWidth.value = systemInfo.screenWidth || DEFAULT_SCREEN_WIDTH;
      screenHeight.value = systemInfo.screenHeight || DEFAULT_SCREEN_HEIGHT;
      windowWidth.value = systemInfo.windowWidth || screenWidth.value;
      windowHeight.value = systemInfo.windowHeight || screenHeight.value;
      pixelRatio.value = systemInfo.pixelRatio || 1;
      const safeAreaInfo = getSafeArea();
      safeAreaTop.value = safeAreaInfo.top;
      safeAreaBottom.value = safeAreaInfo.bottom;
      safeAreaLeft.value = safeAreaInfo.left;
      safeAreaRight.value = safeAreaInfo.right;
      switch (currentPlatform) {
        case "ios":
          statusBarHeight.value = getIOSStatusBarHeight();
          navBarHeight.value = getAppNavBarHeight("ios");
          break;
        case "android":
          statusBarHeight.value = getAndroidStatusBarHeight();
          navBarHeight.value = getAppNavBarHeight("android");
          break;
        case "mp-weixin":
          statusBarHeight.value = systemInfo.statusBarHeight || DEFAULT_STATUS_BAR_HEIGHT;
          navBarHeight.value = getMPNavBarHeight();
          const capsuleInfo = getMPCapsuleInfo();
          capsuleWidth.value = capsuleInfo.width;
          capsuleHeight.value = capsuleInfo.height;
          capsuleRight.value = capsuleInfo.right;
          capsuleTop.value = capsuleInfo.top;
          break;
        case "h5":
          statusBarHeight.value = 0;
          navBarHeight.value = getH5NavBarHeight();
          break;
        default:
          statusBarHeight.value = systemInfo.statusBarHeight || DEFAULT_STATUS_BAR_HEIGHT;
          navBarHeight.value = IOS_NAV_BAR_HEIGHT;
      }
      totalNavHeight.value = statusBarHeight.value + navBarHeight.value;
      bottomSafeHeight.value = getBottomSafeHeight(
        currentPlatform,
        screenHeight.value,
        safeAreaBottom.value
      );
    }
    function pxToRpx(px) {
      return px * (750 / screenWidth.value);
    }
    function rpxToPx(rpx) {
      return rpx * (screenWidth.value / 750);
    }
    function getNavStyle() {
      return {
        paddingTop: `${statusBarHeight.value}px`,
        height: `${navBarHeight.value}px`,
        lineHeight: `${navBarHeight.value}px`,
        totalHeight: `${totalNavHeight.value}px`
      };
    }
    function getSafeAreaStyle() {
      return {
        paddingTop: `${safeAreaTop.value}px`,
        paddingBottom: `${bottomSafeHeight.value}px`,
        paddingLeft: `${safeAreaLeft.value}px`,
        paddingRight: `${safeAreaRight.value - windowWidth.value}px`
      };
    }
    function getMPCapsuleStyle() {
      if (!isMP.value) {
        return null;
      }
      return {
        width: `${capsuleWidth.value}px`,
        height: `${capsuleHeight.value}px`,
        right: `${capsuleRight.value}px`,
        top: `${capsuleTop.value}px`
      };
    }
    function getCustomNavStyle() {
      return {
        statusBarHeight: `${statusBarHeight.value}px`,
        navBarHeight: `${navBarHeight.value}px`,
        totalHeight: `${totalNavHeight.value}px`,
        bottomSafe: `${bottomSafeHeight.value}px`,
        capsuleRight: isMP.value ? `${capsuleRight.value}px` : "0",
        capsuleWidth: isMP.value ? `${capsuleWidth.value}px` : "0"
      };
    }
    let resizeCallback = null;
    function onScreenResize(callback) {
      resizeCallback = callback;
      uni.onWindowResize(() => {
        initScreenInfo();
        if (resizeCallback) {
          resizeCallback();
        }
      });
    }
    function offScreenResize() {
      resizeCallback = null;
      uni.offWindowResize(() => {
      });
    }
    vue.onMounted(() => {
      initScreenInfo();
    });
    vue.onUnmounted(() => {
      offScreenResize();
    });
    return {
      statusBarHeight,
      navBarHeight,
      totalNavHeight,
      screenWidth,
      screenHeight,
      windowHeight,
      windowWidth,
      safeAreaTop,
      safeAreaBottom,
      safeAreaLeft,
      safeAreaRight,
      pixelRatio,
      platform,
      bottomSafeHeight,
      capsuleWidth,
      capsuleHeight,
      capsuleRight,
      capsuleTop,
      isIOS,
      isAndroid,
      isMP,
      isH5,
      isApp,
      hasNotch,
      safeArea,
      contentHeight,
      screenInfo,
      pxToRpx,
      rpxToPx,
      getNavStyle,
      getSafeAreaStyle,
      getMPCapsuleStyle,
      getCustomNavStyle,
      onScreenResize,
      offScreenResize,
      initScreenInfo
    };
  }
  const _sfc_main$g = /* @__PURE__ */ vue.defineComponent({
    __name: "UiNavbar",
    props: {
      title: { type: String, required: false, default: "" },
      color: { type: String, required: false, default: "#000" },
      background: { type: String, required: false, default: "transparent" },
      fixed: { type: Boolean, required: false, default: true },
      placeholder: { type: Boolean, required: false, default: true },
      glass: { type: Boolean, required: false, default: false },
      back: { type: Boolean, required: false, default: true }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const { statusBarHeight, navBarHeight, totalNavHeight } = useScreen();
      const props = __props;
      const handleBack = () => {
        if (props.back) {
          const pages = getCurrentPages();
          if (pages.length > 1) {
            uni.navigateBack();
          } else {
            uni.switchTab({ url: "/pages/index/index" });
          }
        }
      };
      const __returned__ = { statusBarHeight, navBarHeight, totalNavHeight, props, handleBack };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_UiIcon = resolveEasycom(vue.resolveDynamicComponent("UiIcon"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["ui-navbar", { "ui-navbar--fixed": $props.fixed, "ui-navbar--glass": $props.glass }]),
            style: vue.normalizeStyle({ height: $setup.totalNavHeight + "px", background: $props.background })
          },
          [
            vue.createElementVNode(
              "view",
              {
                style: vue.normalizeStyle({ height: $setup.statusBarHeight + "px" })
              },
              null,
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "view",
              {
                class: "ui-navbar__content",
                style: vue.normalizeStyle({ height: $setup.navBarHeight + "px" })
              },
              [
                vue.createElementVNode("view", {
                  class: "ui-navbar__left",
                  onClick: $setup.handleBack
                }, [
                  vue.renderSlot(_ctx.$slots, "left", {}, () => [
                    $props.back ? (vue.openBlock(), vue.createBlock(_component_UiIcon, {
                      key: 0,
                      name: "arrow-left",
                      size: 48,
                      color: $props.color
                    }, null, 8, ["color"])) : vue.createCommentVNode("v-if", true)
                  ], true)
                ]),
                vue.createElementVNode("view", { class: "ui-navbar__center" }, [
                  vue.renderSlot(_ctx.$slots, "center", {}, () => [
                    vue.createElementVNode(
                      "text",
                      {
                        class: "ui-navbar__title",
                        style: vue.normalizeStyle({ color: $props.color })
                      },
                      vue.toDisplayString($props.title),
                      5
                      /* TEXT, STYLE */
                    )
                  ], true)
                ]),
                vue.createElementVNode("view", { class: "ui-navbar__right" }, [
                  vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
                ])
              ],
              4
              /* STYLE */
            )
          ],
          6
          /* CLASS, STYLE */
        ),
        $props.fixed && $props.placeholder ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            style: vue.normalizeStyle({ height: $setup.totalNavHeight + "px" })
          },
          null,
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const UiNavbar = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$g], ["__scopeId", "data-v-948c4de6"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/molecules/UiNavbar.vue"]]);
  const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiNavbar
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
    __name: "UiRate",
    props: {
      modelValue: { type: Number, required: true, default: 0 },
      count: { type: Number, required: false, default: 5 },
      size: { type: Number, required: false, default: 32 },
      activeColor: { type: String, required: false, default: "#FFAB00" },
      voidColor: { type: String, required: false, default: "#E5E5E5" },
      readonly: { type: Boolean, required: false, default: false },
      showScore: { type: Boolean, required: false, default: false }
    },
    emits: ["update:modelValue", "change"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const onRate = (index) => {
        if (props.readonly)
          return;
        emit("update:modelValue", index);
        emit("change", index);
      };
      const __returned__ = { props, emit, onRate };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    return vue.openBlock(), vue.createElementBlock("view", { class: "ui-rate" }, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($props.count, (index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: index,
            class: "star-item",
            onClick: ($event) => $setup.onRate(index)
          }, [
            vue.createVNode(_component_ui_icon, {
              name: index <= $props.modelValue ? "star-fill" : "star",
              size: $props.size,
              color: index <= $props.modelValue ? $props.activeColor : $props.voidColor
            }, null, 8, ["name", "size", "color"])
          ], 8, ["onClick"]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      $props.showScore ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 0,
          class: "rate-score",
          style: vue.normalizeStyle({ color: $props.activeColor })
        },
        vue.toDisplayString($props.modelValue.toFixed(1)),
        5
        /* TEXT, STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const UiRate = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$f], ["__scopeId", "data-v-7ad8dbf3"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/molecules/UiRate.vue"]]);
  const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiRate
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
    __name: "UiSearch",
    props: {
      modelValue: { type: String, required: false, default: "" },
      placeholder: { type: String, required: false, default: "搜索数码产品型号..." },
      disabled: { type: Boolean, required: false, default: false }
    },
    emits: ["update:modelValue", "search", "click", "clear"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const isFocus = vue.ref(false);
      const handleInput = (e) => {
        emit("update:modelValue", e.detail.value);
      };
      const handleConfirm = () => {
        emit("search", props.modelValue);
      };
      const handleClear = () => {
        emit("update:modelValue", "");
        emit("clear");
      };
      const handleClick = () => {
        if (props.disabled) {
          emit("click");
        }
      };
      const __returned__ = { props, emit, isFocus, handleInput, handleConfirm, handleClear, handleClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_UiIcon = resolveEasycom(vue.resolveDynamicComponent("UiIcon"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-search", { "is-focus": $setup.isFocus }]),
        onClick: $setup.handleClick
      },
      [
        vue.createVNode(_component_UiIcon, {
          name: "search",
          color: "#A1A1A6",
          size: 40,
          class: "ui-search__icon"
        }),
        !$props.disabled ? (vue.openBlock(), vue.createElementBlock("input", {
          key: 0,
          class: "ui-search__input",
          placeholder: $props.placeholder,
          value: $props.modelValue,
          onInput: $setup.handleInput,
          onConfirm: $setup.handleConfirm,
          onFocus: _cache[0] || (_cache[0] = ($event) => $setup.isFocus = true),
          onBlur: _cache[1] || (_cache[1] = ($event) => $setup.isFocus = false)
        }, null, 40, ["placeholder", "value"])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "ui-search__placeholder"
        }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($props.placeholder),
            1
            /* TEXT */
          )
        ])),
        $props.modelValue && !$props.disabled ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "ui-search__clear",
          onClick: vue.withModifiers($setup.handleClear, ["stop"])
        }, [
          vue.createVNode(_component_UiIcon, {
            name: "close-circle-fill",
            color: "#A1A1A6",
            size: 40
          })
        ])) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const UiSearch = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e], ["__scopeId", "data-v-eff221b0"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/molecules/UiSearch.vue"]]);
  const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiSearch
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
    __name: "UiStepper",
    props: {
      modelValue: { type: Number, required: true, default: 1 },
      min: { type: Number, required: false, default: 1 },
      max: { type: Number, required: false, default: 99 },
      step: { type: Number, required: false, default: 1 }
    },
    emits: ["update:modelValue", "change"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const onMinus = () => {
        if (props.modelValue <= props.min)
          return;
        const val = props.modelValue - props.step;
        emit("update:modelValue", val);
        emit("change", val);
      };
      const onPlus = () => {
        if (props.modelValue >= props.max)
          return;
        const val = props.modelValue + props.step;
        emit("update:modelValue", val);
        emit("change", val);
      };
      const __returned__ = { props, emit, onMinus, onPlus };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    return vue.openBlock(), vue.createElementBlock("view", { class: "ui-stepper" }, [
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["stepper-btn minus", { "disabled": $props.modelValue <= $props.min }]),
          onClick: vue.withModifiers($setup.onMinus, ["stop"])
        },
        [
          vue.createVNode(_component_ui_icon, {
            name: "minus",
            size: 40,
            color: _ctx.$color - _ctx.text - _ctx.main
          }, null, 8, ["color"])
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "view",
        { class: "stepper-value" },
        vue.toDisplayString($props.modelValue),
        1
        /* TEXT */
      ),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["stepper-btn plus", { "disabled": $props.modelValue >= $props.max }]),
          onClick: vue.withModifiers($setup.onPlus, ["stop"])
        },
        [
          vue.createVNode(_component_ui_icon, {
            name: "plus",
            size: 40,
            color: _ctx.$color - _ctx.text - _ctx.main
          }, null, 8, ["color"])
        ],
        2
        /* CLASS */
      )
    ]);
  }
  const UiStepper = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d], ["__scopeId", "data-v-2337ed6b"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/molecules/UiStepper.vue"]]);
  const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiStepper
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
    __name: "UiSubNavbar",
    props: {
      title: { type: String, required: false, default: "" },
      color: { type: String, required: false, default: "#000" },
      background: { type: String, required: false, default: "transparent" },
      fixed: { type: Boolean, required: false, default: true },
      placeholder: { type: Boolean, required: false, default: true },
      glass: { type: Boolean, required: false, default: false }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const { statusBarHeight, navBarHeight, totalNavHeight } = useScreen();
      const props = __props;
      const handleBack = () => {
        const pages = getCurrentPages();
        if (pages.length > 1) {
          uni.navigateBack();
        } else {
          uni.switchTab({ url: "/pages/index/index" });
        }
      };
      const __returned__ = { statusBarHeight, navBarHeight, totalNavHeight, props, handleBack };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_UiIcon = resolveEasycom(vue.resolveDynamicComponent("UiIcon"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["sub-navbar", { "sub-navbar--fixed": $props.fixed, "sub-navbar--glass": $props.glass }]),
            style: vue.normalizeStyle({ height: $setup.totalNavHeight + "px", background: $props.background })
          },
          [
            vue.createElementVNode(
              "view",
              {
                style: vue.normalizeStyle({ height: $setup.statusBarHeight + "px" })
              },
              null,
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "view",
              {
                class: "sub-navbar__content",
                style: vue.normalizeStyle({ height: $setup.navBarHeight + "px" })
              },
              [
                vue.createElementVNode("view", {
                  class: "sub-navbar__left",
                  onClick: $setup.handleBack
                }, [
                  vue.renderSlot(_ctx.$slots, "left", {}, () => [
                    vue.createVNode(_component_UiIcon, {
                      name: "arrow-left",
                      size: 48,
                      color: $props.color
                    }, null, 8, ["color"])
                  ], true)
                ]),
                vue.createElementVNode("view", { class: "sub-navbar__center" }, [
                  vue.renderSlot(_ctx.$slots, "center", {}, () => [
                    vue.createElementVNode(
                      "text",
                      {
                        class: "sub-navbar__title",
                        style: vue.normalizeStyle({ color: $props.color })
                      },
                      vue.toDisplayString($props.title),
                      5
                      /* TEXT, STYLE */
                    )
                  ], true)
                ]),
                vue.createElementVNode("view", { class: "sub-navbar__right" }, [
                  vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
                ])
              ],
              4
              /* STYLE */
            )
          ],
          6
          /* CLASS, STYLE */
        ),
        $props.fixed && $props.placeholder ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            style: vue.normalizeStyle({ height: $setup.totalNavHeight + "px" })
          },
          null,
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const UiSubNavbar = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c], ["__scopeId", "data-v-d1fcb6d4"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/molecules/UiSubNavbar.vue"]]);
  const __vite_glob_0_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiSubNavbar
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    __name: "UiSwiper",
    props: {
      list: { type: Array, required: true, default: () => [] },
      height: { type: String, required: false, default: "320rpx" },
      radius: { type: String, required: false, default: "24rpx" },
      autoplay: { type: Boolean, required: false, default: true },
      interval: { type: Number, required: false, default: 3e3 },
      duration: { type: Number, required: false, default: 500 },
      circular: { type: Boolean, required: false, default: true },
      showIndicator: { type: Boolean, required: false, default: true },
      indicatorPosition: { type: String, required: false, default: "center" },
      indicatorColor: { type: String, required: false, default: "rgba(255, 255, 255, 0.5)" },
      indicatorActiveColor: { type: String, required: false, default: "#ffffff" }
    },
    emits: ["click", "change"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const currentIndex = vue.ref(0);
      vue.watch(() => props.list, () => {
        currentIndex.value = 0;
      });
      const onSwiperChange = (e) => {
        currentIndex.value = e.detail.current;
        emit("change", {
          current: currentIndex.value,
          item: props.list[currentIndex.value]
        });
      };
      const onIndicatorClick = (index) => {
        currentIndex.value = index;
      };
      const onItemClick = (item, index) => {
        emit("click", { item, index });
      };
      const __returned__ = { props, emit, currentIndex, onSwiperChange, onIndicatorClick, onItemClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_image = vue.resolveComponent("ui-image");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "ui-swiper",
        style: vue.normalizeStyle({ height: $props.height, borderRadius: $props.radius })
      },
      [
        vue.createElementVNode("swiper", {
          class: "swiper-container",
          "indicator-dots": false,
          autoplay: $props.autoplay,
          interval: $props.interval,
          duration: $props.duration,
          circular: $props.circular,
          current: $setup.currentIndex,
          onChange: $setup.onSwiperChange
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($props.list, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("swiper-item", { key: index }, [
                vue.createElementVNode("view", {
                  class: "swiper-item",
                  onClick: ($event) => $setup.onItemClick(item, index)
                }, [
                  vue.createVNode(_component_ui_image, {
                    src: item.image,
                    width: "100%",
                    height: "100%",
                    radius: $props.radius,
                    mode: "aspectFill"
                  }, null, 8, ["src", "radius"]),
                  item.title ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "swiper-title"
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "title-text" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    )
                  ])) : vue.createCommentVNode("v-if", true)
                ], 8, ["onClick"])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ], 40, ["autoplay", "interval", "duration", "circular", "current"]),
        $props.showIndicator ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass(["swiper-indicators", [`indicator-${$props.indicatorPosition}`]])
          },
          [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($props.list, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: vue.normalizeClass(["indicator-dot", { "is-active": $setup.currentIndex === index }]),
                  style: vue.normalizeStyle({ backgroundColor: $setup.currentIndex === index ? $props.indicatorActiveColor : $props.indicatorColor }),
                  onClick: ($event) => $setup.onIndicatorClick(index)
                }, null, 14, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          2
          /* CLASS */
        )) : vue.createCommentVNode("v-if", true)
      ],
      4
      /* STYLE */
    );
  }
  const UiSwiper = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__scopeId", "data-v-b7c16d26"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/molecules/UiSwiper.vue"]]);
  const __vite_glob_0_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiSwiper
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    __name: "UiSwitch",
    props: {
      modelValue: { type: Boolean, required: true, default: false },
      activeColor: { type: String, required: false, default: "#1ABC9C" },
      inactiveColor: { type: String, required: false, default: "#CCCCCC" },
      disabled: { type: Boolean, required: false, default: false }
    },
    emits: ["update:modelValue", "change"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const toggle = () => {
        if (props.disabled)
          return;
        const val = !props.modelValue;
        emit("update:modelValue", val);
        emit("change", val);
      };
      const __returned__ = { props, emit, toggle };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-switch", { "is-active": $props.modelValue, "is-disabled": $props.disabled }]),
        style: vue.normalizeStyle({ backgroundColor: $props.modelValue ? $props.activeColor : $props.inactiveColor }),
        onClick: $setup.toggle
      },
      [
        vue.createElementVNode("view", { class: "switch-node" })
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const UiSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__scopeId", "data-v-abfb389d"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/molecules/UiSwitch.vue"]]);
  const __vite_glob_0_19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiSwitch
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "UiTabs",
    props: {
      list: { type: Array, required: true, default: () => [] },
      modelValue: { type: Number, required: true, default: 0 },
      type: { type: String, required: false, default: "line" }
    },
    emits: ["update:modelValue", "change"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const onClick = (index) => {
        emit("update:modelValue", index);
        emit("change", props.list[index]);
      };
      const __returned__ = { props, emit, onClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "ui-tabs-container" }, [
      vue.createElementVNode("scroll-view", {
        "scroll-x": "",
        class: "ui-tabs-scroll",
        "scroll-into-view": `tab-${$props.modelValue}`,
        "scroll-with-animation": true,
        "show-scrollbar": false,
        enhanced: "",
        "enable-flex": true
      }, [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["ui-tabs-nav", [`style-${$props.type}`]])
          },
          [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($props.list, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  id: `tab-${index}`,
                  class: vue.normalizeClass(["tab-item", { "is-active": $props.modelValue === index }]),
                  onClick: ($event) => $setup.onClick(index)
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "tab-text" },
                    vue.toDisplayString(item.name),
                    1
                    /* TEXT */
                  ),
                  $props.type === "line" && $props.modelValue === index ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "tab-line"
                  })) : vue.createCommentVNode("v-if", true)
                ], 10, ["id", "onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          2
          /* CLASS */
        )
      ], 8, ["scroll-into-view"])
    ]);
  }
  const UiTabs = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__scopeId", "data-v-7b188a1d"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/molecules/UiTabs.vue"]]);
  const __vite_glob_0_20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiTabs
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "UiUpload",
    props: {
      fileList: { type: Array, required: true },
      maxCount: { type: Number, required: false, default: 9 }
    },
    emits: ["update:fileList", "after-read", "delete"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const onChoose = () => {
        uni.chooseImage({
          count: props.maxCount - props.fileList.length,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            emit("after-read", res.tempFilePaths);
          }
        });
      };
      const onRemove = (index) => {
        const newList = [...props.fileList];
        newList.splice(index, 1);
        emit("update:fileList", newList);
        emit("delete", index);
      };
      const onPreview = (index) => {
        const urls = props.fileList.map((item) => item.url);
        uni.previewImage({
          current: urls[index],
          urls
        });
      };
      const __returned__ = { props, emit, onChoose, onRemove, onPreview };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    return vue.openBlock(), vue.createElementBlock("view", { class: "ui-upload" }, [
      vue.createElementVNode("view", { class: "upload-grid" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($props.fileList, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: "upload-item"
            }, [
              vue.createElementVNode("image", {
                class: "preview-img",
                src: item.url,
                mode: "aspectFill",
                onClick: ($event) => $setup.onPreview(index)
              }, null, 8, ["src", "onClick"]),
              vue.createElementVNode("view", {
                class: "delete-btn",
                onClick: vue.withModifiers(($event) => $setup.onRemove(index), ["stop"])
              }, [
                vue.createVNode(_component_ui_icon, {
                  name: "close",
                  size: 40,
                  color: "#FFFFFF"
                })
              ], 8, ["onClick"]),
              item.status === "uploading" ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "status-layer"
              }, [
                vue.createVNode(_component_ui_icon, {
                  name: "loading",
                  size: 40,
                  color: "#FFFFFF",
                  class: "spin"
                })
              ])) : vue.createCommentVNode("v-if", true)
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $props.fileList.length < $props.maxCount ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "upload-btn",
          onClick: $setup.onChoose
        }, [
          vue.createVNode(_component_ui_icon, {
            name: "camera",
            size: "48",
            color: _ctx.$color - _ctx.text - _ctx.placeholder
          }, null, 8, ["color"]),
          vue.createElementVNode("text", { class: "upload-text" }, "添加图片")
        ])) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const UiUpload = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__scopeId", "data-v-16ebcc1e"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/molecules/UiUpload.vue"]]);
  const __vite_glob_0_21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiUpload
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "UiActionSheet",
    props: {
      show: { type: Boolean, required: true, default: false },
      title: { type: String, required: false },
      description: { type: String, required: false },
      actions: { type: Array, required: false, default: () => [] },
      showCancel: { type: Boolean, required: false, default: true },
      cancelText: { type: String, required: false, default: "取消" },
      closeOnClickAction: { type: Boolean, required: false, default: true }
    },
    emits: ["update:show", "select", "close"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const onClose = () => {
        emit("update:show", false);
        emit("close");
      };
      const onSelect = (item, index) => {
        if (item.disabled || item.loading)
          return;
        emit("select", item, index);
        if (props.closeOnClickAction) {
          onClose();
        }
      };
      const __returned__ = { props, emit, onClose, onSelect };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-action-sheet", { "is-show": $props.show }]),
        onTouchmove: _cache[0] || (_cache[0] = vue.withModifiers(() => {
        }, ["stop", "prevent"]))
      },
      [
        vue.createElementVNode("view", {
          class: "sheet-mask",
          onClick: $setup.onClose
        }),
        vue.createElementVNode("view", { class: "sheet-panel safe-area-bottom" }, [
          $props.title || $props.description ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "sheet-header"
          }, [
            $props.title ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 0,
                class: "title"
              },
              vue.toDisplayString($props.title),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true),
            $props.description ? (vue.openBlock(), vue.createElementBlock(
              "text",
              {
                key: 1,
                class: "desc"
              },
              vue.toDisplayString($props.description),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true)
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "sheet-body" }, [
            $props.actions.length > 0 ? (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              { key: 0 },
              vue.renderList($props.actions, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: vue.normalizeClass(["action-item", { "disabled": item.disabled }]),
                  style: vue.normalizeStyle({ color: item.color || "#1D1D1F" }),
                  onClick: ($event) => $setup.onSelect(item, index)
                }, [
                  vue.createElementVNode("view", { class: "item-content" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "item-name" },
                      vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    ),
                    item.subname ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 0,
                        class: "item-subname"
                      },
                      vue.toDisplayString(item.subname),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true)
                  ]),
                  item.loading ? (vue.openBlock(), vue.createBlock(_component_ui_icon, {
                    key: 0,
                    name: "loading",
                    spin: "",
                    class: "item-loading"
                  })) : vue.createCommentVNode("v-if", true)
                ], 14, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            )) : vue.renderSlot(_ctx.$slots, "default", { key: 1 }, void 0, true)
          ]),
          $props.showCancel ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "sheet-cancel",
            onClick: $setup.onClose
          }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($props.cancelText),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ],
      34
      /* CLASS, NEED_HYDRATION */
    );
  }
  const UiActionSheet = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__scopeId", "data-v-98a59f5f"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/organisms/UiActionSheet.vue"]]);
  const __vite_glob_0_22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiActionSheet
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "UiCard",
    props: {
      title: { type: String, required: false },
      glass: { type: Boolean, required: false, default: true },
      shadow: { type: Boolean, required: false, default: true },
      interactive: { type: Boolean, required: false, default: false },
      radius: { type: String, required: false, default: "md" },
      padding: { type: String, required: false, default: "md" }
    },
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const handleClick = () => {
        if (props.interactive)
          emit("click");
      };
      const __returned__ = { props, emit, handleClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-card", [
          `radius-${$props.radius}`,
          `padding-${$props.padding}`,
          { "is-glass": $props.glass },
          { "has-shadow": $props.shadow },
          { "is-interactive": $props.interactive }
        ]]),
        onClick: $setup.handleClick
      },
      [
        $props.title || _ctx.$slots.header ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "ui-card__head"
        }, [
          vue.createElementVNode("view", { class: "ui-card__title" }, [
            vue.renderSlot(_ctx.$slots, "title", {}, () => [
              vue.createTextVNode(
                vue.toDisplayString($props.title),
                1
                /* TEXT */
              )
            ], true)
          ]),
          vue.createElementVNode("view", { class: "ui-card__extra" }, [
            vue.renderSlot(_ctx.$slots, "extra", {}, void 0, true)
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "ui-card__content" }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ])
      ],
      2
      /* CLASS */
    );
  }
  const UiCard = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__scopeId", "data-v-043a2a77"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/organisms/UiCard.vue"]]);
  const __vite_glob_0_23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiCard
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "UiDialog",
    props: {
      show: { type: Boolean, required: true, default: false },
      title: { type: String, required: false },
      message: { type: String, required: false },
      messageAlign: { type: String, required: false, default: "center" },
      showCancel: { type: Boolean, required: false, default: false },
      cancelText: { type: String, required: false, default: "取消" },
      cancelColor: { type: String, required: false, default: "#6E6E73" },
      confirmText: { type: String, required: false, default: "确认" },
      confirmColor: { type: String, required: false, default: "#1ABC9C" },
      buttonLayout: { type: String, required: false, default: "horizontal" },
      loading: { type: Boolean, required: false, default: false },
      beforeClose: { type: Function, required: false }
    },
    emits: ["update:show", "confirm", "cancel"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const handleClose = () => {
        emit("update:show", false);
      };
      const onCancel = () => {
        if (props.loading)
          return;
        emit("cancel");
        handleClose();
      };
      const onConfirm = async () => {
        if (props.loading)
          return;
        if (props.beforeClose) {
          const result = await props.beforeClose("confirm");
          if (result !== false) {
            emit("confirm");
            handleClose();
          }
        } else {
          emit("confirm");
          handleClose();
        }
      };
      const __returned__ = { props, emit, handleClose, onCancel, onConfirm };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-dialog-wrapper", { "is-show": $props.show }]),
        onTouchmove: _cache[0] || (_cache[0] = vue.withModifiers(() => {
        }, ["stop", "prevent"]))
      },
      [
        vue.createElementVNode("view", { class: "dialog-mask" }),
        vue.createElementVNode("view", { class: "dialog-content" }, [
          $props.title ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "dialog-header"
          }, [
            vue.createElementVNode(
              "text",
              { class: "title-text" },
              vue.toDisplayString($props.title),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode(
            "view",
            {
              class: "dialog-body",
              style: vue.normalizeStyle({ textAlign: $props.messageAlign })
            },
            [
              vue.renderSlot(_ctx.$slots, "default", {}, () => [
                vue.createElementVNode(
                  "text",
                  { class: "message-text" },
                  vue.toDisplayString($props.message),
                  1
                  /* TEXT */
                )
              ], true)
            ],
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["dialog-footer", { "vertical": $props.showCancel && $props.buttonLayout === "vertical" }])
            },
            [
              $props.showCancel ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "btn btn-cancel",
                  style: vue.normalizeStyle({ color: $props.cancelColor }),
                  onClick: $setup.onCancel
                },
                vue.toDisplayString($props.cancelText),
                5
                /* TEXT, STYLE */
              )) : vue.createCommentVNode("v-if", true),
              $props.showCancel && $props.buttonLayout === "horizontal" ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "btn-divider"
              })) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode(
                "view",
                {
                  class: "btn btn-confirm",
                  style: vue.normalizeStyle({ color: $props.confirmColor }),
                  onClick: $setup.onConfirm
                },
                [
                  $props.loading ? (vue.openBlock(), vue.createBlock(_component_ui_icon, {
                    key: 0,
                    name: "loading",
                    spin: ""
                  })) : (vue.openBlock(), vue.createElementBlock(
                    "text",
                    { key: 1 },
                    vue.toDisplayString($props.confirmText),
                    1
                    /* TEXT */
                  ))
                ],
                4
                /* STYLE */
              )
            ],
            2
            /* CLASS */
          )
        ])
      ],
      34
      /* CLASS, NEED_HYDRATION */
    );
  }
  const UiDialog = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__scopeId", "data-v-ef492455"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/organisms/UiDialog.vue"]]);
  const __vite_glob_0_24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiDialog
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "UiGoodsCard",
    props: {
      data: { type: Object, required: true },
      mode: { type: String, required: false, default: "list" }
    },
    emits: ["click", "user-click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const onClick = () => {
        emit("click", props.data.id);
      };
      const toUser = () => {
        emit("user-click", props.data);
      };
      const __returned__ = { props, emit, onClick, toUser };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    const _component_ui_image = vue.resolveComponent("ui-image");
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    const _component_ui_avatar = vue.resolveComponent("ui-avatar");
    const _component_ui_price = vue.resolveComponent("ui-price");
    const _component_ui_tag = vue.resolveComponent("ui-tag");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-goods-card", [`mode-${$props.mode}`]]),
        onClick: vue.withModifiers($setup.onClick, ["stop"])
      },
      [
        $props.mode === "waterfall" ? (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          { key: 0 },
          [
            vue.createElementVNode("view", { class: "card-image-box" }, [
              vue.createVNode(_component_ui_image, {
                src: $props.data.cover,
                width: "100%",
                height: "100%",
                radius: "16rpx 16rpx 0 0"
              }, null, 8, ["src"]),
              $props.data.isVideo ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "video-tag"
              }, [
                vue.createVNode(_component_ui_icon, {
                  name: "play",
                  size: 40,
                  color: "#FFFFFF"
                })
              ])) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createElementVNode("view", { class: "card-content" }, [
              vue.createElementVNode(
                "text",
                { class: "goods-title" },
                vue.toDisplayString($props.data.title),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "card-footer" }, [
                vue.createElementVNode("view", {
                  class: "user-info",
                  onClick: vue.withModifiers($setup.toUser, ["stop"])
                }, [
                  vue.createVNode(_component_ui_avatar, {
                    src: $props.data.userAvatar,
                    ":size": 40,
                    bordered: false
                  }, null, 8, ["src"]),
                  vue.createElementVNode(
                    "text",
                    { class: "user-name" },
                    vue.toDisplayString($props.data.userName),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "action-info" }, [
                  $props.data.price ? (vue.openBlock(), vue.createBlock(_component_ui_price, {
                    key: 0,
                    value: $props.data.price,
                    size: 28,
                    bold: true
                  }, null, 8, ["value"])) : (vue.openBlock(), vue.createElementBlock("view", {
                    key: 1,
                    class: "like-box"
                  }, [
                    vue.createVNode(_component_ui_icon, {
                      name: "heart",
                      size: 40,
                      color: "#6E6E73"
                    }),
                    vue.createElementVNode(
                      "text",
                      { class: "like-count" },
                      vue.toDisplayString($props.data.likeCount),
                      1
                      /* TEXT */
                    )
                  ]))
                ])
              ])
            ])
          ],
          64
          /* STABLE_FRAGMENT */
        )) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "list-layout"
        }, [
          vue.createElementVNode("view", { class: "list-image" }, [
            vue.createVNode(_component_ui_image, {
              src: $props.data.cover,
              width: "220rpx",
              height: "220rpx",
              radius: "12rpx"
            }, null, 8, ["src"]),
            $props.data.condition ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "condition-tag"
              },
              vue.toDisplayString($props.data.condition),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createElementVNode("view", { class: "list-info" }, [
            vue.createElementVNode(
              "text",
              { class: "goods-title" },
              vue.toDisplayString($props.data.title),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "goods-specs" }, [
              vue.createElementVNode(
                "text",
                { class: "spec-text" },
                vue.toDisplayString($props.data.specs || "暂无规格信息"),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "goods-tags" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList((_a = $props.data.tags) == null ? void 0 : _a.slice(0, 3), (tag) => {
                  return vue.openBlock(), vue.createBlock(_component_ui_tag, {
                    key: tag,
                    text: tag,
                    type: "primary",
                    plain: "",
                    size: "mini",
                    class: "tag-item"
                  }, null, 8, ["text"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createElementVNode("view", { class: "list-footer" }, [
              vue.createVNode(_component_ui_price, {
                value: $props.data.price,
                size: 36,
                color: "#FF3D00"
              }, null, 8, ["value"]),
              vue.createElementVNode(
                "text",
                { class: "post-time" },
                vue.toDisplayString($props.data.timeStr),
                1
                /* TEXT */
              )
            ])
          ])
        ]))
      ],
      2
      /* CLASS */
    );
  }
  const UiGoodsCard = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-5b98f505"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/organisms/UiGoodsCard.vue"]]);
  const __vite_glob_0_25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiGoodsCard
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "UiModal",
    props: {
      modelValue: { type: Boolean, required: true, default: false },
      title: { type: String, required: false, default: "提示" },
      content: { type: String, required: false, default: "" },
      showCancel: { type: Boolean, required: false, default: true },
      cancelText: { type: String, required: false, default: "取消" },
      confirmText: { type: String, required: false, default: "确定" },
      confirmColor: { type: String, required: false, default: "#1ABC9C" },
      maskClosable: { type: Boolean, required: false, default: true }
    },
    emits: ["update:modelValue", "confirm", "cancel"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const show = vue.ref(false);
      const animateShow = vue.ref(false);
      vue.watch(() => props.modelValue, (val) => {
        if (val) {
          show.value = true;
          setTimeout(() => {
            animateShow.value = true;
          }, 50);
        } else {
          animateShow.value = false;
          setTimeout(() => {
            show.value = false;
          }, 300);
        }
      });
      const close = () => {
        emit("update:modelValue", false);
      };
      const handleMaskClick = () => {
        if (props.maskClosable) {
          handleCancel();
        }
      };
      const handleCancel = () => {
        emit("cancel");
        close();
      };
      const handleConfirm = () => {
        emit("confirm");
        close();
      };
      const __returned__ = { props, emit, show, animateShow, close, handleMaskClick, handleCancel, handleConfirm };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return $setup.show ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: "ui-modal-wrapper",
        onTouchmove: _cache[0] || (_cache[0] = vue.withModifiers(() => {
        }, ["stop", "prevent"]))
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["ui-modal-mask", { "is-show": $setup.animateShow }]),
            onClick: $setup.handleMaskClick
          },
          null,
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["ui-modal", { "is-show": $setup.animateShow }])
          },
          [
            $props.title ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "ui-modal__header"
            }, [
              vue.createElementVNode(
                "text",
                { class: "ui-modal__title" },
                vue.toDisplayString($props.title),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "ui-modal__content" }, [
              vue.renderSlot(_ctx.$slots, "default", {}, () => [
                vue.createTextVNode(
                  vue.toDisplayString($props.content),
                  1
                  /* TEXT */
                )
              ], true)
            ]),
            vue.createElementVNode("view", { class: "ui-modal__footer" }, [
              $props.showCancel ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "ui-modal__btn ui-modal__btn--cancel",
                  onClick: $setup.handleCancel
                },
                vue.toDisplayString($props.cancelText),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode(
                "view",
                {
                  class: "ui-modal__btn ui-modal__btn--confirm",
                  style: vue.normalizeStyle({ color: $props.confirmColor }),
                  onClick: $setup.handleConfirm
                },
                vue.toDisplayString($props.confirmText),
                5
                /* TEXT, STYLE */
              )
            ])
          ],
          2
          /* CLASS */
        )
      ],
      32
      /* NEED_HYDRATION */
    )) : vue.createCommentVNode("v-if", true);
  }
  const UiModal = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-9de910fb"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/organisms/UiModal.vue"]]);
  const __vite_glob_0_26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiModal
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "UiPopup",
    props: {
      show: { type: Boolean, required: true },
      position: { type: String, required: false, default: "center" },
      zIndex: { type: Number, required: false, default: 500 },
      maskClosable: { type: Boolean, required: false, default: true },
      round: { type: Boolean, required: false, default: false },
      closeable: { type: Boolean, required: false, default: false },
      safeAreaInsetBottom: { type: Boolean, required: false, default: true },
      bgColor: { type: String, required: false },
      glass: { type: Boolean, required: false, default: false }
    },
    emits: ["update:show", "close", "open"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const customStyle = vue.computed(() => {
        const style = {};
        if (props.bgColor)
          style.backgroundColor = props.bgColor;
        if (props.glass) {
          style.backgroundColor = "rgba(255, 255, 255, 0.85)";
          style.backdropFilter = "blur(16px)";
          style.webkitBackdropFilter = "blur(16px)";
        }
        return style;
      });
      const onMaskClick = () => {
        if (props.maskClosable) {
          close();
        }
      };
      const close = () => {
        emit("update:show", false);
        emit("close");
      };
      const __returned__ = { props, emit, customStyle, onMaskClick, close };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-popup", [
          `pos-${$props.position}`,
          { "is-show": $props.show, "is-round": $props.round }
        ]]),
        style: vue.normalizeStyle({ zIndex: $props.zIndex }),
        onTouchmove: _cache[1] || (_cache[1] = vue.withModifiers(() => {
        }, ["stop", "prevent"]))
      },
      [
        vue.createElementVNode("view", {
          class: "popup-mask",
          onClick: $setup.onMaskClick
        }),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["popup-content", { "safe-bottom": $props.safeAreaInsetBottom && $props.position === "bottom" }]),
            style: vue.normalizeStyle($setup.customStyle),
            onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
            }, ["stop"]))
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
            $props.closeable ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "close-icon",
              onClick: $setup.close
            }, [
              vue.createVNode(_component_ui_icon, {
                name: "close",
                size: 40,
                color: "#A1A1A6"
              })
            ])) : vue.createCommentVNode("v-if", true)
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      38
      /* CLASS, STYLE, NEED_HYDRATION */
    );
  }
  const UiPopup = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-d53aca56"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/organisms/UiPopup.vue"]]);
  const __vite_glob_0_27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiPopup
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "UiToast",
    setup(__props, { expose: __expose }) {
      const visible = vue.ref(false);
      const message = vue.ref("");
      const type = vue.ref("text");
      const zIndex = vue.ref(9999);
      let timer = null;
      const iconName = vue.computed(() => {
        switch (type.value) {
          case "success":
            return "check-circle";
          case "error":
            return "close-circle";
          case "warning":
            return "info-circle";
          default:
            return "";
        }
      });
      const show = (options) => {
        const opts = typeof options === "string" ? { message: options } : options;
        message.value = opts.message || "";
        type.value = opts.type || "text";
        if (timer)
          clearTimeout(timer);
        visible.value = true;
        if (type.value !== "loading") {
          const duration = opts.duration || 2e3;
          timer = setTimeout(() => {
            visible.value = false;
          }, duration);
        }
      };
      const hide = () => {
        visible.value = false;
        if (timer)
          clearTimeout(timer);
      };
      __expose({ show, hide });
      const __returned__ = { visible, message, type, zIndex, get timer() {
        return timer;
      }, set timer(v) {
        timer = v;
      }, iconName, show, hide };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_ui_icon = vue.resolveComponent("ui-icon");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ui-toast", { "is-show": $setup.visible }]),
        style: vue.normalizeStyle({ zIndex: $setup.zIndex })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["toast-content", [`type-${$setup.type}`]])
          },
          [
            $setup.type !== "text" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "toast-icon"
            }, [
              $setup.type === "loading" ? (vue.openBlock(), vue.createBlock(_component_ui_icon, {
                key: 0,
                name: "loading",
                spin: "",
                size: "64",
                color: "#FFFFFF"
              })) : (vue.openBlock(), vue.createBlock(_component_ui_icon, {
                key: 1,
                name: $setup.iconName,
                size: "64",
                color: "#FFFFFF"
              }, null, 8, ["name"]))
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode(
              "text",
              { class: "toast-text" },
              vue.toDisplayString($setup.message),
              1
              /* TEXT */
            )
          ],
          2
          /* CLASS */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const UiToast = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-e36d2cae"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/organisms/UiToast.vue"]]);
  const __vite_glob_0_28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiToast
  }, Symbol.toStringTag, { value: "Module" }));
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "UiWaterfalls",
    props: {
      list: { type: Array, required: true, default: () => [] },
      columns: { type: Number, required: false, default: 2 },
      gap: { type: Number, required: false, default: 16 }
    },
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const columnData = vue.ref([]);
      const columns = vue.computed(() => {
        const result = Array.from({ length: props.columns }, () => []);
        props.list.forEach((item, index) => {
          const colIndex = index % props.columns;
          result[colIndex].push(item);
        });
        return result;
      });
      const handleClick = (item) => {
        emit("click", item);
      };
      const __returned__ = { props, emit, columnData, columns, handleClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "ui-waterfalls" }, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($setup.columns, (column, colIndex) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: "waterfalls-column",
            key: colIndex
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(column, (item, itemIndex) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "waterfalls-item",
                  key: item.id || itemIndex,
                  onClick: ($event) => $setup.handleClick(item)
                }, [
                  vue.renderSlot(_ctx.$slots, "item", {
                    item,
                    index: itemIndex
                  }, void 0, true)
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const UiWaterfalls = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1bdaad2c"], ["__file", "C:/Users/willdc/Documents/WorkPlace/XinMall/XinMall2/FE/src/ui-kit/organisms/UiWaterfalls.vue"]]);
  const __vite_glob_0_29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: UiWaterfalls
  }, Symbol.toStringTag, { value: "Module" }));
  const uiKitComponents = /* @__PURE__ */ Object.assign({ "../ui-kit/atoms/UiAvatar.vue": __vite_glob_0_0, "../ui-kit/atoms/UiBadge.vue": __vite_glob_0_1, "../ui-kit/atoms/UiButton.vue": __vite_glob_0_2, "../ui-kit/atoms/UiDivider.vue": __vite_glob_0_3, "../ui-kit/atoms/UiIcon.vue": __vite_glob_0_4, "../ui-kit/atoms/UiImage.vue": __vite_glob_0_5, "../ui-kit/atoms/UiPrice.vue": __vite_glob_0_6, "../ui-kit/atoms/UiSkeleton.vue": __vite_glob_0_7, "../ui-kit/atoms/UiTag.vue": __vite_glob_0_8, "../ui-kit/atoms/UiText.vue": __vite_glob_0_9, "../ui-kit/molecules/UiCell.vue": __vite_glob_0_10, "../ui-kit/molecules/UiCheckbox.vue": __vite_glob_0_11, "../ui-kit/molecules/UiInput.vue": __vite_glob_0_12, "../ui-kit/molecules/UiNavbar.vue": __vite_glob_0_13, "../ui-kit/molecules/UiRate.vue": __vite_glob_0_14, "../ui-kit/molecules/UiSearch.vue": __vite_glob_0_15, "../ui-kit/molecules/UiStepper.vue": __vite_glob_0_16, "../ui-kit/molecules/UiSubNavbar.vue": __vite_glob_0_17, "../ui-kit/molecules/UiSwiper.vue": __vite_glob_0_18, "../ui-kit/molecules/UiSwitch.vue": __vite_glob_0_19, "../ui-kit/molecules/UiTabs.vue": __vite_glob_0_20, "../ui-kit/molecules/UiUpload.vue": __vite_glob_0_21, "../ui-kit/organisms/UiActionSheet.vue": __vite_glob_0_22, "../ui-kit/organisms/UiCard.vue": __vite_glob_0_23, "../ui-kit/organisms/UiDialog.vue": __vite_glob_0_24, "../ui-kit/organisms/UiGoodsCard.vue": __vite_glob_0_25, "../ui-kit/organisms/UiModal.vue": __vite_glob_0_26, "../ui-kit/organisms/UiPopup.vue": __vite_glob_0_27, "../ui-kit/organisms/UiToast.vue": __vite_glob_0_28, "../ui-kit/organisms/UiWaterfalls.vue": __vite_glob_0_29 });
  function registerUiKit(app) {
    Object.entries(uiKitComponents).forEach(([path, module]) => {
      const fileName = path.split("/").pop() || "";
      const componentName = fileName.replace(".vue", "");
      if (componentName.startsWith("Ui") || componentName.startsWith("The")) {
        app.component(componentName, module.default);
      }
    });
  }
  const UiKitPlugin = {
    install(app) {
      registerUiKit(app);
    }
  };
  function createApp() {
    const app = vue.createVueApp(App);
    app.use(createPinia());
    app.use(UiKitPlugin);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
