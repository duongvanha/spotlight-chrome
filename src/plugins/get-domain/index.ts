import type AdapterPlugin from '../interface';

const FindDomainPlugin: AdapterPlugin = {
    id: 2,
    title: 'Find domain',
    subtitle: 'Find domain from shop',
    icon: '',
    hint: 'Find domain -shop_id (default current page)',
    async action({browser}, [param1, param2]): Promise<string> {
        return 'haduong.myshopbase.net'
    },
};

export default FindDomainPlugin;
