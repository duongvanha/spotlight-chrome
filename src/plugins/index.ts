import LoginAsPlugin from './login-as';
import FindDomainPlugin from './find-domain';
import CopyShopIdPlugin from './copy-shopId';
import CopyUserIdPlugin from './copy-userId';
import OpenHivePlugin from './open-hive';
import CollectionAllPlugin from './collection-all';
import ClearCheckoutPlugin from "./clear-data";
import ShareAdminUrlPlugin from "./copy-admin-url";
import SpayInfoPlugin from "./check-shopbase-payment";

const plugins = [
    LoginAsPlugin,
    FindDomainPlugin,
    CopyShopIdPlugin,
    CopyUserIdPlugin,
    OpenHivePlugin,
    CollectionAllPlugin,
    ClearCheckoutPlugin,
    ShareAdminUrlPlugin,
    SpayInfoPlugin
];

export default plugins;