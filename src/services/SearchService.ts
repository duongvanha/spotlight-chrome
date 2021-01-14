// export default class SearchService {
//   private readonly state: Record<string, string[]>;
//
//   constructor(records = {}) {
//     this.state = records;
//   }
//
//   get(input: string): string | undefined {
//     const keys = input.split('-');
//     let key = keys[0].trim()
//     if (keys.length === 1) {
//       return Object.keys(this.state).find(i => i.startsWith(input));
//     }
//
//     for (let i = 1; i < keys.length; i++) {
//       key = key + '-';
//     }
//
//     if (!keys[keys.length - 1]) {
//       return this.state[key][0]
//     }
//
//     const search = keys[keys.length - 1]
//     return this.state[key].find(i => i.startsWith(search));
//   }
//
//   commit(input: string) {
//     if (!input) return;
//     const keys = input.split('-');
//     let key = keys[0].trim()
//     if (keys.length === 1) {
//       return this.state[keys[0]] = [];
//     }
//
//     for (let i = 0; i < keys.length; i++) {
//       // @ts-ignore
//       this.state[key] = [keys[i].trim()].concat(this.state[key] || []);
//       key = key + '-';
//     }
//   }
//
//   getState(): Record<string, string[]> {
//     return this.state;
//   }
//
// }