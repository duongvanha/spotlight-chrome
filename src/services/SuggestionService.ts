export default class SuggestionService {
    private state: Record<string, string[]>;

    constructor() {
        this.state = {};
    }

    setState(records: Record<string, string[]>) {
        this.state = records;
    }

    get(input: string): string {
        const keys = input.split('-');
        let key = keys[0].trim();
        if (keys.length === 1) {
            const rs = Object.keys(this.state).find(i => i.startsWith(input)) || ''
            if (rs === input) return ''
            return rs;
        }

        for (let i = 1; i < keys.length; i++) {
            key = key + '-';
        }

        if (!keys[keys.length - 1]) {
            return this.state[key][0];
        }

        const search = keys[keys.length - 1];
        const rs = this.state[key].find(i => i.startsWith(search))
        if (rs === search) return ''
        return rs
    }

    commit(input: string) {
        if (!input) return;
        const keys = input.split('-');
        let key = keys[0].trim();
        if (keys.length === 1) {
            return this.state[keys[0]] = [];
        }

        for (let i = 0; i < keys.length; i++) {

            this.state[key] = Array.from(new Set([keys[i].trim()].concat(this.state[key] || [])));
            key = key + '-';
        }
    }

    getState(): Record<string, string[]> {
        return this.state;
    }

}