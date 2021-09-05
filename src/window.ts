import { Env } from "./types";

export type ShopBaseStorage = {
    shopId: number
    productId: number
    host: string,
    userId: number,
    env: Env,
    accessToken: string,
    userInfo: object,
    email: string
}

function detectEnv(): Env {
    const host = window.location.host;
    if (host.includes("stag.myshopbase.net") || host.includes(".sbasestag.tk")) {
        return Env.stag
    }

    if (host.includes(".myshopbase.net") || host.includes(".sbasedev.tk")) {
        return Env.dev
    }

    return Env.prod
}


let objData: ShopBaseStorage = {} as ShopBaseStorage
try {
    JSON.parse(localStorage.getItem('spotlight-ext-sbase') || '{}')
} catch (e) {
    console.error(e)
}
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
        env: detectEnv()
    }, objData)
}


// @ts-ignore
if (window?.__INITIAL_STATE__?.shop?.id) {
    isShopBase = true
    // @ts-ignore
    const state = window.__INITIAL_STATE__
    objData = Object.assign({
        host: window.location.host,
        shopId: state.shop.id,
        productId: state.product?.product.id,
        env: detectEnv(),
    }, objData)
}

// @ts-ignore
if (window?.app?.__vue__?.$store?.state?.shop) {
    isShopBase = true

    const userInfo = null
    try {
        JSON.parse(decodeURI(atob(JSON.parse(window.localStorage['sbase_auth']))))
    }catch (e) {}
    // @ts-ignore
    const state = window.app.__vue__.$store.state
    objData = Object.assign({
        host: window.location.host,
        shopId: state.shop.shop.id,
        userId: state.shop.shop.user_id,
        env: detectEnv(),
        accessToken: JSON.parse(window.localStorage['sbase_shop-access-token']),
        userInfo: userInfo,
        email: state.shop.shop.email
    }, objData)
}

console.log('is shopbase', isShopBase && localStorage.setItem('spotlight-ext-sbase', JSON.stringify(objData)))
