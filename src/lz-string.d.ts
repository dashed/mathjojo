declare module "lz-string" {
  export function compress(input: string): string;
  export function decompress(compressed: string): string | null;
  export function compressToBase64(input: string): string;
  export function decompressFromBase64(compressed: string): string | null;
  export function compressToUTF16(input: string): string;
  export function decompressFromUTF16(compressed: string): string | null;
  export function compressToUint8Array(input: string): Uint8Array;
  export function decompressFromUint8Array(
    compressed: Uint8Array
  ): string | null;
  export function compressToEncodedURIComponent(input: string): string;
  export function decompressFromEncodedURIComponent(
    compressed: string
  ): string | null;
}
