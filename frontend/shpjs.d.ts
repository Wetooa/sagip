declare module "shpjs" {
  export function parseShp(buffer: Buffer | ArrayBuffer): any;
  export function parseDbf(buffer: Buffer | ArrayBuffer): any;
  export function combine(parts: any[]): any;
}
