import type { Craft } from "@/types";

export const crafts: Craft[] = [
  {
    id: "celadon-moon-jar",
    name: "청자 달항아리",
    craftType: "도자기",
    description:
      "은은한 비색 유약을 겹겹이 입혀 구워 낸 둥근 항아리입니다. 꽃 한 가지만 꽂아도 공간이 차분해집니다. (가상 상품)",
    price: 280000,
    image: {
      src: "/images/crafts/celadon-moon-jar.svg",
      alt: "청록빛 유약을 입힌 둥글고 풍성한 달항아리 일러스트",
    },
  },
  {
    id: "white-porcelain-tea-set",
    name: "백자 다기 세트",
    craftType: "도자기",
    description:
      "맑은 백자 찻주전자와 찻잔 두 개로 구성된 다기 세트입니다. 손에 닿는 곡선이 부드러워 매일의 차 시간에 어울립니다. (가상 상품)",
    price: 165000,
    image: {
      src: "/images/crafts/white-porcelain-tea-set.svg",
      alt: "흰 백자 찻주전자와 작은 찻잔 두 개가 나란히 놓인 다기 세트 일러스트",
    },
  },
  {
    id: "najeon-keepsake-box",
    name: "나전 문갑 소함",
    craftType: "나전칠기",
    description:
      "검은 옻칠 위에 조개껍데기 조각을 정성껏 박아 넣은 작은 함입니다. 빛이 닿을 때마다 은은한 무지갯빛이 번집니다. (가상 상품)",
    price: 390000,
    image: {
      src: "/images/crafts/najeon-keepsake-box.svg",
      alt: "검은 옻칠 바탕에 흰색과 연한 청록색 조개 조각이 박힌 작은 함 일러스트",
    },
  },
  {
    id: "jogakbo-wrapping-cloth",
    name: "조각보 보자기",
    craftType: "보자기",
    description:
      "자투리 천을 이어 붙여 만든 조각보 보자기입니다. 선물을 감싸거나 식탁 위 덮개로 쓰기 좋습니다. (가상 상품)",
    price: 48000,
    image: {
      src: "/images/crafts/jogakbo-wrapping-cloth.svg",
      alt: "청록, 베이지, 갈색, 먹색 네모 천을 이어 붙인 조각보 일러스트",
    },
  },
  {
    id: "zelkova-soban-table",
    name: "느티나무 소반",
    craftType: "목공예",
    description:
      "느티나무 결을 그대로 살려 깎은 작은 밥상입니다. 차 쟁반이나 침실 협탁으로도 쓸 수 있습니다. (가상 상품)",
    price: 220000,
    image: {
      src: "/images/crafts/zelkova-soban-table.svg",
      alt: "둥근 상판과 곡선 다리가 있는 갈색 나무 소반 일러스트",
    },
  },
  {
    id: "paulownia-pen-holder",
    name: "오동나무 필통",
    craftType: "목공예",
    description:
      "가볍고 결이 고운 오동나무로 만든 필통입니다. 책상 위에 두면 은은한 나무 향이 납니다. (가상 상품)",
    price: 36000,
    image: {
      src: "/images/crafts/paulownia-pen-holder.svg",
      alt: "연한 갈색 원통형 나무 필통에 펜 세 자루가 꽂혀 있는 일러스트",
    },
  },
];
