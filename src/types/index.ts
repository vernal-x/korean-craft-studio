export type CraftType = "도자기" | "나전칠기" | "보자기" | "목공예";

export interface ImageAsset {
  /** Path under /public, e.g. "/images/crafts/celadon-vase.svg" */
  src: string;
  /** Meaningful alt text describing the illustration */
  alt: string;
}

export interface Craft {
  id: string;
  name: string;
  craftType: CraftType;
  description: string;
  /** KRW */
  price: number;
  image: ImageAsset;
}

export interface CraftClass {
  id: string;
  name: string;
  description: string;
  /** KRW per person */
  price: number;
  durationMinutes: number;
  /** Maximum participants per session */
  capacity: number;
  image: ImageAsset;
}

export interface OrderInquiry {
  name: string;
  phone: string;
  craftId: string;
  quantity: number;
  note: string;
}

export interface ClassApplication {
  name: string;
  phone: string;
  classId: string;
  /** YYYY-MM-DD (local date) */
  date: string;
  headcount: number;
  note: string;
}

export type MockApiResult =
  | { success: true; receiptNumber: string; message: string }
  | { success: false; message: string };

export type SubmitStatus = "idle" | "submitting" | "success" | "error";
