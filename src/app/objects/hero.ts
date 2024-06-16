export interface Hero {
    id: number;
    name: string;
    abilities: string[];
    image?: Blob;
    isImageDrawn?: boolean;
  }