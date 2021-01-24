export type ShopBaseStorage = {
    shopId: number
    productId: number
    host: string,
    userId: number,
}

let objData: ShopBaseStorage = JSON.parse(localStorage.getItem('spotlight-ext-sbase') || '{}')
let isShopBase = false
// @ts-ignore
if (window?.__INITIAL_STATE__?.bootstrap?.shopId) {
    isShopBase = true
    // @ts-ignore
    const state = window.__INITIAL_STATE__
    objData = Object.assign({
        host: window.location.host,
        shopId: state.bootstrap.shopId,
        productId: state.customProduct.product.id,
    }, objData)
}
// @ts-ignore
if (window?.app?.__vue__?.$store?.state?.shop) {
    isShopBase = true
    // @ts-ignore
    const state = window.app.__vue__.$store.state
    objData = Object.assign({
        host: window.location.host,
        shopId: state.shop.shop.id,
        userId: state.shop.shop.user_id
    }, objData)
}

console.log('is shopbase', isShopBase && localStorage.setItem('spotlight-ext-sbase', JSON.stringify(objData)))
