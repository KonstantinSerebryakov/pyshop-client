// interface IQSelectOption {
//   value: string;
//   label: string;
// }

// interface IQSelectOptionTmp extends IQSelectOption {
//   tmp: string;
// }

// export class QSelectOptionsBuilderCountryIo {
//   private data: Record<string, Iterable<[string, string]>>[] = {};
//   private options = [] as {}[];
//   append(fieldname: string, data: Iterable<[string, string]>) {
//     for (const pair in data) {
//       const key = pair[0];
//       if (!key) continue;
//       const value = pair[1];

//       const storedOption = this.options.find((option)=>option.value === );

//     }
//   }
// }

// // export class QSelectOptionsBase<T extends IQSelectOption> {
// //   options = [] as T[];

// //   constructor() {
// //     //
// //   }

// //   upsertLabels(data: [unknown, unknown][]) {
// //     for (const pair of data) {
// //       const key = data[0]?.toString();
// //       if (key) {
// //         const value = data[1]?.toString() ?? '';
// //         const storedPair = this.options.find((option) => option.value === key);
// //         if (storedPair) storedPair.value = value;
// //         else this.options.push({ value: key, label: value });
// //       }
// //     }
// //   }

// //   // Model: "{ "label": "Apple", "value": "Apple", "description": "iStuff", "icon": "golf_course" }"
// // }

// // const kek = new QSelectOptionsBase<IQSelectOptionTmp>();
// // kek.upsertLabels([{}]);
// // // kek

// // export class QSelectOptionsBuilderBase {
// //   private isActive = true;
// //   options = [] as {
// //     label: string;
// //     value: string;
// //   }[];
// //   keys = new Set<string>();

// //   constructor() {
// //     //
// //   }

// //   public abort() {
// //     this.isActive = false;
// //   }

// //   public upsertLabels<T, K>(pairs: Iterable<[T, K]>) {
// //     for (const pair in pairs) {
// //       const key = pair[0].toString();
// //       const value = pair[1].toString();

// //       const option = this.options.find((option, index) => {
// //         option.value === key;
// //       });
// //       if (option) {
// //         option.label = value;
// //       } else {
// //         this.options.push({
// //           label: value,
// //           value: key,
// //         });
// //       }
// //     }
// //     //
// //   }
// // }

// // export class QSelectOptionsBuilderCountries extends QSelectOptionsBuilderBase {
// //   options = [] as { label: string; value: string; cannotSelect: boolean }[];
// //   // keys = new Set();

// //   constructor() {
// //     super();
// //   }

// //   // async appendLabels(pairs:) {

// //   // }

// //   // async append(pairs:) {

// //   // }
// // }
