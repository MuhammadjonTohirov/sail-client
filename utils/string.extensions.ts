
declare global {
  interface String {
    nillIfEmpty(): string | null;
    capitalize(): string;
    getIfEmpty(value: string | null | undefined): string | null | undefined;
  }
}
export {};

String.prototype.nillIfEmpty = function (): string | null {
    return this.length === 0 ? null : this.toString();
}

String.prototype.getIfEmpty = function (value: string | null | undefined): string | null | undefined{
    return this.length === 0 ? value : this.toString();
}

String.prototype.capitalize = function (): string {
    if (this.length === 0) return this.toString();
    return this.charAt(0).toUpperCase() + this.slice(1);
}