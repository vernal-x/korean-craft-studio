import type { CraftClass } from "@/types";

export const classes: CraftClass[] = [
  {
    id: "pottery-handbuilding",
    name: "도자기 만들기",
    description:
      "흙을 손으로 빚어 나만의 찻잔이나 접시를 만드는 수작업 클래스입니다. 물레 없이 손의 감각으로 형태를 잡고, 가상의 공방 선생님이 단계마다 곁에서 도와 드립니다.",
    price: 55000,
    durationMinutes: 180,
    capacity: 6,
    image: {
      src: "/images/classes/pottery-handbuilding.svg",
      alt: "두 손이 둥근 흙그릇을 빚고 있고 옆에 물레와 완성된 청자색 그릇이 놓인 도자기 클래스 그림",
    },
  },
  {
    id: "bojagi-patchwork",
    name: "보자기 만들기",
    description:
      "자투리 천을 이어 붙이는 조각보 방식으로 작은 보자기를 완성합니다. 색을 고르고 바느질을 익히며 포장에도 쓸 수 있는 보자기를 만들어 봅니다.",
    price: 40000,
    durationMinutes: 120,
    capacity: 8,
    image: {
      src: "/images/classes/bojagi-patchwork.svg",
      alt: "베이지와 청자색 정사각형 천 조각을 이어 붙인 조각보와 바늘, 실패가 놓인 보자기 클래스 그림",
    },
  },
  {
    id: "najeon-keyring",
    name: "나전 키링 만들기",
    description:
      "얇게 다듬은 자개 조각을 작은 나무판에 붙여 나전 키링을 만듭니다. 은은하게 빛나는 무늬를 직접 배치하며 나만의 작은 소품을 완성합니다.",
    price: 65000,
    durationMinutes: 150,
    capacity: 5,
    image: {
      src: "/images/classes/najeon-keyring.svg",
      alt: "자개 꽃무늬가 박힌 작은 나무 키링과 고리, 옆에 놓인 자개 조각 상자를 그린 나전 키링 클래스 그림",
    },
  },
];
