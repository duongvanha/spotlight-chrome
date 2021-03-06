import type { Browser } from 'webextension-polyfill-ts';

type Context = { browser: Browser, ShopData: any }

type AdapterPlugin = {
    id: number,
    title: string,
    subtitle: string,
    icon: string,
    hint?: string,

    action(ctx: Context, params: string[]): Promise<string>,
    background?(),
    search?(...params: string[]): Promise<AdapterPlugin[]>,
}

export default AdapterPlugin;