import type AdapterPlugin from '../interface';
import {
    detectEnv,
    mapHiveEnv,
    shopBaseInfo
} from '../../services/shopBaseService';
import { getCache, parseShopId, setCache } from '../../services/Util';
import axios from 'axios';

const StaffAssignedPlugin: AdapterPlugin = {
    id: 8,
    title: 'Staff as',
    subtitle: 'Staff Assigned request login',
    icon: '🧿',
    hint: 'Staff Assigned -approver -reason',
    async action({browser}, [reason,approverEmail]): Promise<string> {

        const shopData = await shopBaseInfo();
        let shopId = parseShopId(shopData.shopId);

        if (!shopId) throw new Error('Cannot detect shop id');
        if (!reason) throw new Error('Reason cannot empty');

        const linkHive = mapHiveEnv[await detectEnv(null)];

        const body = await axios.get(`${linkHive}/admin/app/staffassigned/create`)

        let document = new DOMParser().parseFromString(body.data, "text/html");

        let form = document.querySelector('form')

        let key = "s26348aeec8"
        let keyApprover = "cache_approver"

        let res = form.action.match(/\/admin\/app\/staffassigned\/create\?uniqid=(.*)/);
        if (res && res[1]) {
            key = res[1]
        }

        // @ts-ignore
        let approver = [...form.querySelectorAll(`#${key}_approver option`)].find(approver => approver.innerText === approverEmail && approver.value)

        if (!approverEmail) {
            approver = await getCache(keyApprover)
        }

        if (!approver) throw new Error('Cannot detect approver info');

        const params = new URLSearchParams()
        params.append(`${key}[shop_domains]`, shopData.host)
        params.append(`${key}[user]`, document.querySelector(`#${key}_user option[selected="selected"]`)['value'])
        params.append(`${key}[roles][]`, 'ROLE_STAFF_SHOP_VIEW_ALL')
        params.append(`${key}[roles][]`, 'ROLE_STAFF_USER_VIEW_ALL')
        params.append(`${key}[roles][]`, 'ROLE_ALLOWED_TO_LOGIN_AS_SOME_USERS')
        params.append('expire_type', 'date')
        params.append('expire_after', '7days')
        params.append('expired_at', '')
        params.append(`${key}[approver]`, approver['value'])
        params.append(`${key}[reason]`, reason)
        params.append(`${key}[_token]`, document.getElementById(`${key}__token`)['value'])


        return axios.post(`${linkHive}/admin/app/staffassigned/create?uniqid=${key}`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(() => (setCache(keyApprover, {value: approver['value']}).catch(() => null))).then((): string => {
           return "request successfully"
        })
    },
};

export default StaffAssignedPlugin;
