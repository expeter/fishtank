/** Original Little Fishtank playthings. Coordinates are relative to the floor. */
export const toyDecorations = [
  ["Pineapple cottage", "Ananashäuschen", "aquarium", 0, 25],
  ["Bubble hoop", "Blasenreifen", "aquarium", 0, 15],
  ["Pip's submarine", "Pips U-Boot", "aquarium", 1, 45],
  ["Rainbow slide", "Regenbogenrutsche", "aquarium", 1, 35],
  ["Mushroom hideaway", "Pilzversteck", "aquarium", 2, 60],
  ["Explorer's helmet", "Taucherhelm", "aquarium", 2, 70],
  ["Pebble lighthouse", "Kieselleuchtturm", "sea", 0, 25],
  ["Kelp maze", "Tanglabyrinth", "sea", 0, 20],
  ["Shell swing", "Muschelschaukel", "sea", 1, 40],
  ["Whale mailbox", "Walbriefkasten", "sea", 1, 35],
  ["Moon observatory", "Mondsternwarte", "sea", 2, 80],
  ["Coral merry-go-round", "Korallenkarussell", "sea", 2, 75],
].map(([en, de, habitat, tier, price], i) => ({
  id: `d${24 + i}`,
  en: String(en),
  de: String(de),
  habitat: habitat as "aquarium" | "sea",
  tier: Number(tier),
  price: Number(price),
  kind: 24 + i,
}));

export function drawToy(
  c: CanvasRenderingContext2D,
  id: string,
  time = 0,
): boolean {
  const n = Number(id.slice(1));
  if (n < 24 || n > 35 || !/^d\d+$/.test(id)) return false;
  c.save();
  c.lineJoin = "round";
  c.lineCap = "round";
  c.lineWidth = 3;
  c.strokeStyle = "#284b50";
  const oval = (
    x: number,
    y: number,
    rx: number,
    ry: number,
    color: string,
  ) => {
    c.fillStyle = color;
    c.beginPath();
    c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
  };
  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    r = 5,
  ) => {
    c.fillStyle = color;
    c.beginPath();
    c.roundRect(x, y, w, h, r);
    c.fill();
    c.stroke();
  };
  const path = (points: number[][], color: string, width = 3, fill = false) => {
    c.beginPath();
    points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    if (fill) {
      c.closePath();
      c.fillStyle = color;
      c.fill();
    } else {
      c.strokeStyle = color;
      c.lineWidth = width;
      c.stroke();
    }
    c.strokeStyle = "#284b50";
    c.lineWidth = 3;
  };
  const window = (x: number, y: number, r = 9) => {
    oval(x, y, r, r, "#92f5df");
    c.strokeStyle = "#efffe1";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(x - r * 0.3, y - r * 0.35);
    c.lineTo(x + r * 0.35, y - r * 0.35);
    c.stroke();
    c.strokeStyle = "#284b50";
    c.lineWidth = 3;
  };
  const bubbles = (x: number, y: number) => {
    c.strokeStyle = "#afeedc";
    c.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const p = (time * 0.35 + i * 0.33) % 1;
      c.beginPath();
      c.arc(x + Math.sin(time + i * 3) * 5, y - p * 23, 2 + p * 2, 0, 7);
      c.stroke();
    }
    c.strokeStyle = "#284b50";
    c.lineWidth = 3;
  };
  oval(0, 1, 42, 6, "#407a69");
  if (n === 24) {
    oval(0, -29, 29, 34, "#ffbc34");
    c.save();
    c.beginPath();
    c.ellipse(0, -29, 28, 33, 0, 0, Math.PI * 2);
    c.clip();
    for (let i = -2; i <= 2; i++) {
      path(
        [
          [i * 10 - 14, -52],
          [i * 10 + 16, -6],
        ],
        "#db891d",
        1.5,
      );
      path(
        [
          [i * 10 + 14, -52],
          [i * 10 - 16, -6],
        ],
        "#db891d",
        1.5,
      );
    }
    c.restore();
    path(
      [
        [-19, -57],
        [-25, -78],
        [-8, -68],
        [-4, -87],
        [7, -67],
        [25, -78],
        [18, -57],
      ],
      "#52a64a",
      3,
      true,
    );
    box(-9, -23, 18, 24, "#48676c", 9);
    window(0, -42, 8);
    oval(4, -11, 2, 2, "#ffdc64");
  } else if (n === 25) {
    path(
      [
        [-24, 0],
        [-24, -18],
      ],
      "#f0914d",
      8,
    );
    path(
      [
        [24, 0],
        [24, -18],
      ],
      "#f0914d",
      8,
    );
    c.strokeStyle = "#ffcb45";
    c.lineWidth = 8;
    c.beginPath();
    c.ellipse(0, -35, 27, 31, 0, 0, 7);
    c.stroke();
    c.strokeStyle = "#284b50";
    c.lineWidth = 2;
    c.beginPath();
    c.ellipse(0, -35, 32, 36, 0, 0, 7);
    c.stroke();
    bubbles(2, -20);
  } else if (n === 26) {
    path(
      [
        [-35, -17],
        [-51, -32],
        [-51, -9],
      ],
      "#ed7661",
      3,
      true,
    );
    box(-30, -43, 66, 35, "#ffc84c", 17);
    box(-9, -54, 20, 12, "#ee8d32");
    path(
      [
        [0, -54],
        [0, -63],
        [10, -63],
      ],
      "#64bec7",
      6,
    );
    window(-13, -27, 9);
    window(14, -27, 9);
    box(-24, -8, 46, 7, "#da8241");
    bubbles(42, -25);
  } else if (n === 27) {
    path(
      [
        [-31, 0],
        [-31, -57],
      ],
      "#ffc45c",
      6,
    );
    path(
      [
        [-12, 0],
        [-12, -57],
      ],
      "#ffc45c",
      6,
    );
    for (let y = -9; y > -52; y -= 13)
      path(
        [
          [-31, y],
          [-12, y],
        ],
        "#9dd8c5",
        4,
      );
    c.strokeStyle = "#e8769b";
    c.lineWidth = 13;
    c.beginPath();
    c.moveTo(-23, -58);
    c.bezierCurveTo(21, -60, -2, -5, 38, -8);
    c.stroke();
    c.strokeStyle = "#ffe3a1";
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(-23, -61);
    c.bezierCurveTo(21, -63, -2, -8, 38, -11);
    c.stroke();
  } else if (n === 28) {
    box(-21, -44, 42, 44, "#ffe6aa", 9);
    box(-8, -25, 16, 25, "#487f7a", 8);
    path(
      [
        [-40, -40],
        [-34, -59],
        [-19, -75],
        [0, -80],
        [20, -73],
        [34, -57],
        [40, -40],
      ],
      "#e65d66",
      3,
      true,
    );
    for (const [x, y] of [
      [-21, -53],
      [0, -67],
      [22, -50],
    ])
      oval(x, y, 5, 4, "#ffeecb");
    window(-12, -33, 5);
    oval(9, -12, 2, 2, "#ffcf59");
  } else if (n === 29) {
    oval(0, -28, 28, 31, "#d79c42");
    box(-31, -6, 62, 9, "#aa783d");
    window(0, -29, 19);
    path(
      [
        [-12, -41],
        [12, -17],
      ],
      "#b8853d",
      3,
    );
    path(
      [
        [12, -41],
        [-12, -17],
      ],
      "#b8853d",
      3,
    );
    for (const x of [-27, 27]) box(x - 5, -36, 10, 18, "#dfb562", 3);
    bubbles(28, -41);
  } else if (n === 30) {
    path(
      [
        [-23, 0],
        [-15, -63],
        [15, -63],
        [23, 0],
      ],
      "#eee5bc",
      3,
      true,
    );
    path(
      [
        [-19, -19],
        [19, -19],
        [17, -32],
        [-17, -32],
      ],
      "#e76e50",
      3,
      true,
    );
    box(-18, -77, 36, 17, "#ffe389");
    window(0, -68, 6);
    path(
      [
        [-23, -78],
        [0, -92],
        [23, -78],
      ],
      "#457f87",
      3,
      true,
    );
    box(-5, -15, 10, 16, "#3f696c");
    c.globalAlpha = 0.13 + Math.sin(time) * 0.04;
    path(
      [
        [0, -69],
        [68, -82],
        [68, -55],
      ],
      "#fff6af",
      3,
      true,
    );
    c.globalAlpha = 1;
  } else if (n === 31) {
    for (let i = 0; i < 5; i++) {
      let x = (i - 2) * 18;
      let h = 35 + (i % 3) * 15;
      let bend = Math.sin(time * 0.8 + i) * 5;
      path(
        [
          [x, 0],
          [x + bend, -h],
        ],
        "#3e8d5b",
        4,
      );
      for (let j = 1; j < 4; j++) {
        let y = (-h * j) / 4;
        oval(x + (bend * j) / 4 + (j % 2 ? 7 : -7), y, 9, 4, "#83c65b");
      }
    }
    oval(-12, 0, 7, 4, "#ffd786");
    oval(22, 1, 10, 4, "#acd1b0");
  } else if (n === 32) {
    path(
      [
        [-33, 0],
        [-24, -64],
        [24, -64],
        [33, 0],
      ],
      "#b1865b",
      6,
    );
    let sway = Math.sin(time * 1.4) * 6;
    path(
      [
        [-15, -61],
        [-15 + sway, -24],
      ],
      "#e0d5a0",
      2,
    );
    path(
      [
        [15, -61],
        [15 + sway, -24],
      ],
      "#e0d5a0",
      2,
    );
    oval(sway, -19, 23, 9, "#f49da1");
    for (let x = -12; x <= 12; x += 8)
      path(
        [
          [sway + x, -25],
          [sway, -13],
        ],
        "#c76b83",
        1.5,
      );
    oval(-24, -65, 5, 5, "#81ba7c");
  } else if (n === 33) {
    box(-5, -26, 10, 27, "#b78858");
    oval(0, -40, 29, 19, "#62b9cc");
    path(
      [
        [24, -41],
        [42, -55],
        [40, -35],
        [31, -29],
      ],
      "#62b9cc",
      3,
      true,
    );
    oval(-17, -43, 2, 3, "#203e54");
    path(
      [
        [-24, -34],
        [-14, -32],
      ],
      "#244e61",
      2,
    );
    box(-9, -44, 21, 4, "#275c71", 2);
    path(
      [
        [12, -54],
        [12, -69],
        [24, -69],
        [24, -59],
        [12, -59],
      ],
      "#f8c44d",
      3,
      true,
    );
    bubbles(-7, -61);
  } else if (n === 34) {
    box(-28, -36, 56, 36, "#7777b5");
    oval(0, -37, 31, 26, "#94b9cd");
    box(-28, -37, 56, 8, "#dbb75d");
    c.save();
    c.translate(5, -52);
    c.rotate(-0.45);
    box(0, -6, 34, 12, "#e9ca72", 3);
    box(30, -9, 7, 18, "#6da7b8", 2);
    c.restore();
    box(-8, -20, 16, 21, "#384d74", 8);
    oval(-16, -11, 3, 3, "#ffe490");
  } else if (n === 35) {
    oval(0, -5, 39, 10, "#d975a1");
    path(
      [
        [0, -7],
        [0, -65],
      ],
      "#e7bf61",
      5,
    );
    path(
      [
        [-39, -52],
        [0, -76],
        [39, -52],
      ],
      "#f18c8e",
      3,
      true,
    );
    path(
      [
        [-39, -52],
        [39, -52],
      ],
      "#ffe094",
      5,
    );
    for (let i = 0; i < 3; i++) {
      const x = Math.sin(time * 0.55 + i * 2.09) * 27;
      path(
        [
          [x, -50],
          [x, -18],
        ],
        "#b9e0c1",
        2,
      );
      oval(x, -18, 9, 5, ["#8fdac7", "#ffd67f", "#bab4f4"][i]);
    }
    oval(0, -78, 4, 4, "#ffe094");
  }
  c.restore();
  return true;
}
