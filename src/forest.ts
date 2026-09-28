import { drawApartment } from "./apartment";
import { celestialPosition, noise, type WorldEnvironment } from "./environment";
import { visitorPhase } from "./cleanup";

/** Hand-drawn woodland: irregular silhouettes, seed-specific trees and little neighbours. */
export function drawShore(
  c: CanvasRenderingContext2D,
  w: number,
  surface: number,
  t: number,
  sea: boolean,
  theme = 0,
  environment?: WorldEnvironment,
) {
  c.save();
  const day = environment?.daylight ?? 1,
    dusk = environment?.dusk ?? 0;
  const mix = (a: number[], b: number[], n: number) =>
    `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * n)).join(",")})`;
  const sky = c.createLinearGradient(0, 0, 0, surface);
  sky.addColorStop(
    0,
    mix(
      [20, 29, 66],
      theme === 2
        ? [119, 159, 186]
        : theme === 1
          ? [85, 165, 205]
          : [68, 168, 190],
      day,
    ),
  );
  sky.addColorStop(
    1,
    mix(
      [69, 69, 105],
      [194 + dusk * 40, 225 - dusk * 58, 185 - dusk * 42],
      day,
    ),
  );
  c.fillStyle = sky;
  c.fillRect(0, 0, w, surface);
  const oval = (
    x: number,
    y: number,
    rx: number,
    ry: number,
    color: string,
    rotate = 0,
  ) => {
    c.fillStyle = color;
    c.beginPath();
    c.ellipse(x, y, rx, ry, rotate, 0, Math.PI * 2);
    c.fill();
  };
  if (!sea) {
    drawApartment(c, w, surface, theme, environment);
    c.restore();
    return;
  }
  // Celestial details stay above the far ridge, never behind the game controls.
  if (day < 0.8)
    for (let i = 0; i < w / 20; i++) {
      c.globalAlpha = (1 - day) * (0.4 + noise(i + 9) * 0.6);
      oval(
        noise(i + 1) * w,
        noise(i + 4) * surface * 0.55,
        0.6 + noise(i) * 0.7,
        0.8,
        "#fef3cb",
      );
    }
  c.globalAlpha = 1;
  const body = celestialPosition(environment?.hour ?? 9);
  const sunX = w * body.x,
    sunY = surface * body.y;
  const radius = Math.max(9, Math.min(19, surface * 0.105));
  const glow = c.createRadialGradient(sunX, sunY, 0, sunX, sunY, radius * 2.8);
  glow.addColorStop(0, body.sun ? "#fff0ab88" : "#e7eeff55");
  glow.addColorStop(1, "#ffffff00");
  c.fillStyle = glow;
  c.fillRect(sunX - radius * 3, sunY - radius * 3, radius * 6, radius * 6);
  oval(sunX, sunY, radius, radius, body.sun ? "#fff0ac" : "#fff3ce");
  if (!body.sun) {
    oval(
      sunX - radius * 0.3,
      sunY - radius * 0.2,
      radius * 0.17,
      radius * 0.23,
      "#d3d2c3",
    );
    oval(
      sunX + radius * 0.3,
      sunY + radius * 0.35,
      radius * 0.22,
      radius * 0.17,
      "#dedaca",
    );
  }
  const cloud = environment?.cloud ?? 0.12;
  c.globalAlpha = 0.35 + cloud * 0.5;
  for (let i = 0; i < Math.ceil(w / 200) + 1; i++) {
    const x =
      ((i * 227 + noise(i) * 90 + t * (1 + noise(i + 6))) % (w + 160)) - 80;
    const y = surface * (0.12 + noise(i + 17) * 0.2);
    const col = cloud > 0.5 ? "#a9bdc4" : "#f8f1d9";
    oval(x, y, 34, 6, col);
    oval(x - 10, y - 4, 16, 8, col);
    oval(x + 11, y - 3, 19, 9, col);
  }
  c.globalAlpha = 1;
  // Irregular distant hills with a clear gap for the bridge and sky.
  for (let layer = 0; layer < 2; layer++) {
    c.fillStyle = layer ? "#538b77" : "#80ada0";
    c.beginPath();
    c.moveTo(0, surface);
    for (let x = 0; x <= w + 20; x += 20)
      c.lineTo(
        x,
        surface * (0.7 + layer * 0.1) -
          Math.sin(x * 0.013 + layer) * surface * 0.1 -
          Math.sin(x * 0.033) * 4,
      );
    c.lineTo(w, surface);
    c.fill();
  }
  {
    // Position and species vary: pointed fir, airy birch, broad oak, willow.
    for (let i = 0; i < Math.ceil(w / 73); i++) {
      const x = 14 + i * 73 + noise(i + 28) * 35;
      if (x > w * 0.37 && x < w * 0.67) continue;
      const ht = surface * (0.47 + noise(i + 39) * 0.42),
        y = surface - 10;
      const species = Math.floor(noise(i + 72) * 4);
      const sway = Math.sin(t * 0.45 + i * 2) * 1.4;
      c.strokeStyle = species === 1 ? "#d8d5aa" : "#785239";
      c.lineWidth = species === 2 ? 9 : 5;
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x - 3, y - ht * 0.5, x + sway, y - ht);
      c.stroke();
      if (species === 0) {
        for (let j = 0; j < 4; j++) {
          const top = y - ht + j * ht * 0.19,
            half = 11 + j * 6;
          c.fillStyle = ["#347d63", "#246a52", "#215d45", "#2e734b"][j];
          c.beginPath();
          c.moveTo(x + sway, top - 8);
          c.lineTo(x + half, top + ht * 0.32);
          c.quadraticCurveTo(x, top + ht * 0.25, x - half, top + ht * 0.32);
          c.closePath();
          c.fill();
        }
      } else {
        for (let j = 0; j < 7; j++) {
          const angle = j * 2.4,
            spread = species === 2 ? 24 : 17;
          const lx = x + Math.cos(angle) * spread + sway,
            ly = y - ht + 12 + Math.sin(angle) * ht * 0.18;
          c.strokeStyle = "#80633e";
          c.lineWidth = 2;
          c.beginPath();
          c.moveTo(x, y - ht * 0.5);
          c.lineTo(lx, ly);
          c.stroke();
          oval(
            lx,
            ly,
            12 + noise(i * 10 + j) * 10,
            species === 3 ? 22 : 13,
            ["#286548", "#458b48", "#80aa50", "#639d46"][(i + j) % 4],
            angle * 0.1,
          );
          if (species === 3) {
            c.strokeStyle = "#8fb559";
            c.lineWidth = 1.5;
            c.beginPath();
            c.moveTo(lx, ly);
            c.quadraticCurveTo(lx + 10, ly + 15, lx + 4, ly + 33);
            c.stroke();
          }
        }
      }
    }
    // Mossy banks dotted with individual flowers, fern fronds and little fungi.
    for (const side of [0, 1]) {
      const start = side ? w * 0.66 : 0,
        end = side ? w : w * 0.36;
      c.fillStyle = "#426d3d";
      c.beginPath();
      c.moveTo(start, surface);
      c.quadraticCurveTo((start + end) / 2, surface - 31, end, surface);
      c.fill();
      for (let i = 0; i < (end - start) / 19; i++) {
        const x = start + i * 19 + noise(i + side * 11) * 10,
          y =
            surface -
            3 -
            Math.sin(((x - start) / (end - start)) * Math.PI) * 12;
        c.strokeStyle = "#9dbb57";
        c.lineWidth = 1.4;
        c.beginPath();
        c.moveTo(x, y);
        c.quadraticCurveTo(x - 5, y - 7, x - 2, y - 11);
        c.moveTo(x, y);
        c.lineTo(x + 5, y - 7);
        c.stroke();
        if (i % 3 === 0) {
          oval(x - 2, y - 11, 3, 2.5, i % 2 ? "#f7cc60" : "#eeb9ad");
          oval(x - 2, y - 11, 1, 1, "#ffed9d");
        }
        if (i % 5 === 0) {
          c.fillStyle = "#ead7af";
          c.fillRect(x + 7, y - 4, 2, 5);
          oval(x + 8, y - 5, 5, 2.5, "#d47a53");
        }
      }
    }
    const left = w * 0.34,
      right = w * 0.69;
    const bridge = (offset: number) => {
      c.beginPath();
      c.moveTo(left, surface - offset);
      c.quadraticCurveTo(
        w * 0.515,
        surface - 49 - offset,
        right,
        surface - offset,
      );
      c.stroke();
    };
    c.strokeStyle = "#503d31";
    c.lineWidth = 12;
    bridge(1);
    c.strokeStyle = "#d4a262";
    c.lineWidth = 7;
    bridge(3);
    for (let i = 0; i <= 13; i++) {
      const q = i / 13,
        x = left + (right - left) * q,
        y = surface - 3 - 98 * q * (1 - q);
      c.strokeStyle = "#795535";
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(x, y + 3);
      c.lineTo(x, y - (i % 3 === 0 ? 22 : 2));
      c.stroke();
    }
    c.strokeStyle = "#c69357";
    c.lineWidth = 3;
    bridge(25);
    // Small fox friend, with a curled white-tipped tail and curious face.
    const elapsed = environment?.time ?? t;
    const foxVisit = visitorPhase("fox", elapsed),
      birdVisit = visitorPhase("bird", elapsed),
      beaverVisit = visitorPhase("beaver", elapsed);
    if (foxVisit !== null) {
      const foxPhase = foxVisit;
      const foxWalk =
        foxPhase < 0.2
          ? foxPhase / 0.2
          : foxPhase < 0.65
            ? 1
            : foxPhase < 0.85
              ? 1 - (foxPhase - 0.65) / 0.2
              : 0;
      const foxMoving = foxPhase < 0.2 || (foxPhase > 0.65 && foxPhase < 0.85);
      const fx = -35 + (w * 0.23 + 35) * foxWalk,
        fy =
          surface -
          15 +
          (foxMoving ? Math.sin(t * 7) * 1.2 : Math.sin(t * 1.4) * 0.4);
      oval(fx + 15, fy - 5, 18, 8, "#dc793b", -0.25);
      oval(fx + 27, fy - 9, 6, 5, "#ffedcf", -0.4);
      oval(fx, fy - 10, 9, 13, "#e68d49");
      oval(fx, fy - 8, 5, 8, "#ffe1b5");
      c.fillStyle = "#d87436";
      c.beginPath();
      c.moveTo(fx - 11, fy - 22);
      c.lineTo(fx - 10, fy - 36);
      c.lineTo(fx, fy - 27);
      c.lineTo(fx + 10, fy - 36);
      c.lineTo(fx + 11, fy - 22);
      c.fill();
      oval(fx, fy - 23, 12, 9, "#eea15d");
      oval(fx - 4, fy - 20, 6, 4, "#fff0d3");
      oval(fx + 4, fy - 20, 6, 4, "#fff0d3");
      const blink = Math.sin(t * 0.5) > 0.995;
      oval(fx - 5, fy - 25, 1.7, blink ? 0.4 : 2.2, "#293136");
      oval(fx + 5, fy - 25, 1.7, blink ? 0.4 : 2.2, "#293136");
      oval(fx, fy - 20, 2, 1.5, "#293136");
    }
    // Beaver visits a fallen branch; a sapling grows back before the next visit.
    const cycle = beaverVisit === null ? 90 : beaverVisit * 66,
      trunkX = w * 0.91,
      bankY = surface - 9;
    const growth = cycle < 58 ? 1 : Math.min(1, (cycle - 58) / 25);
    c.strokeStyle = "#99734a";
    c.lineWidth = 6;
    c.beginPath();
    c.moveTo(trunkX - 13, bankY);
    c.lineTo(
      trunkX + 14 * (cycle < 35 ? 1 : Math.max(0.15, 1 - (cycle - 35) / 23)),
      bankY - 4,
    );
    c.stroke();
    c.strokeStyle = "#759048";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(trunkX + 9, bankY - 3);
    c.lineTo(trunkX + 8, bankY - 3 - growth * 26);
    c.stroke();
    oval(
      trunkX + 3,
      bankY - 5 - growth * 20,
      7 * growth + 0.1,
      3 * growth + 0.1,
      "#91b34f",
      -0.5,
    );
    oval(
      trunkX + 13,
      bankY - 7 - growth * 24,
      7 * growth + 0.1,
      3 * growth + 0.1,
      "#669746",
      0.5,
    );
    if (beaverVisit !== null) {
      const approach =
        cycle < 15 ? cycle / 15 : cycle > 52 ? 1 - (cycle - 52) / 14 : 1;
      const bx = w + 30 - (w + 30 - trunkX + 22) * approach;
      const chewing = cycle > 18 && cycle < 52;
      const by =
        bankY - 7 + (chewing ? Math.sin(t * 11) * 0.8 : Math.sin(t * 6) * 0.8);
      oval(bx + 16, by + 4, 12, 5, "#645044", -0.3);
      c.strokeStyle = "#453b34";
      c.lineWidth = 0.7;
      for (let n = 0; n < 4; n++) {
        c.beginPath();
        c.moveTo(bx + 9 + n * 4, by);
        c.lineTo(bx + 12 + n * 4, by + 7);
        c.stroke();
      }
      oval(bx, by, 12, 10, "#947052");
      oval(bx - 8, by - 7, 9, 8, "#a7815e");
      oval(bx - 7, by - 14, 3, 3, "#765438");
      oval(bx - 13, by - 5, 5, 4, "#d0b18b");
      oval(bx - 11, by - 9, 1.5, 2, "#283533");
      oval(bx - 17, by - 6, 2, 1.4, "#3d3932");
      c.fillStyle = "#fff0cd";
      c.fillRect(bx - 15, by - 2, 2, 3);
      c.fillRect(bx - 12, by - 2, 2, 3);
      if (chewing)
        for (let n = 0; n < 3; n++) {
          const chip = (t * 1.5 + n * 0.33) % 1;
          oval(
            bx - 15 - chip * (8 + n * 2),
            by + chip * 7 - Math.sin(chip * Math.PI) * 7,
            1.5,
            0.7,
            "#ebc786",
            chip * 3,
          );
        }
    }
    // A pair of bright kingfishers share their lookout.
    if (birdVisit !== null && day > 0.3)
      for (let i = 0; i < 2; i++) {
        const home = w * 0.81 + i * 16;
        c.fillStyle = "#76583e";
        c.fillRect(home - 2, surface - 19 - i * 3, 4, 20);
        const phase = ((t + i * 13) % 43) / 43;
        const flying = phase > 0.5;
        const arc = flying ? Math.sin((phase - 0.5) * Math.PI * 2) : 0;
        const bx = home - arc * w * (0.2 + i * 0.04),
          by = surface - 22 - i * 3 - arc * surface * 0.52;
        if (flying) {
          c.strokeStyle = "#218aa8";
          c.lineWidth = 5;
          c.beginPath();
          c.moveTo(bx - 1, by);
          c.quadraticCurveTo(
            bx - 12,
            by - 8 - Math.sin(t * 16) * 8,
            bx - 17,
            by - Math.sin(t * 16) * 12,
          );
          c.stroke();
        }
        oval(bx, by, 6, 9, "#f3b34c");
        oval(bx - 2, by - 2, 5, 7, "#2389a9");
        oval(bx + 2, by - 8, 6, 5, "#37bad0");
        oval(bx + 4, by - 9, 1.2, 1.2, "#16333f");
        c.fillStyle = "#3e5260";
        c.beginPath();
        c.moveTo(bx + 6, by - 9);
        c.lineTo(bx + 13, by - 6);
        c.lineTo(bx + 6, by - 5);
        c.fill();
      }
  }
  // Evening shade keeps foliage saturated; fireflies emerge only at dusk/night.
  if (day < 1) {
    c.fillStyle = `rgba(19,26,61,${(1 - day) * 0.43})`;
    c.fillRect(0, 0, w, surface);
  }
  if (sea && day < 0.65)
    for (let i = 0; i < w / 70; i++) {
      c.globalAlpha = (0.65 - day) * (0.5 + Math.sin(t * 1.4 + i * 3) * 0.45);
      oval(
        noise(i + 18) * w + Math.sin(t * 0.6 + i) * 6,
        surface * (0.35 + noise(i + 20) * 0.5) + Math.cos(t * 0.4 + i) * 4,
        1.8,
        1.8,
        "#f5f7a0",
      );
    }
  c.restore();
}
