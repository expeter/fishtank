import {
  celestialPosition,
  clockAngles,
  type WorldEnvironment,
} from "./environment";

/** An illustrated room beyond the glass. Positions scale to narrow phones and wide worlds. */
export function drawApartment(
  c: CanvasRenderingContext2D,
  w: number,
  h: number,
  theme = 0,
  environment?: WorldEnvironment,
) {
  c.save();
  const day = environment?.daylight ?? 1,
    hour = environment?.hour ?? 9;
  const wall = c.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, ["#d9be8d", "#abc4bd", "#c7adc1"][theme % 3]);
  wall.addColorStop(1, ["#f1dcb0", "#d7e3ce", "#ebd4da"][theme % 3]);
  c.fillStyle = wall;
  c.fillRect(0, 0, w, h);
  c.strokeStyle = "#fff4d53d";
  c.lineWidth = 1;
  for (let x = 10; x < w; x += 22) {
    c.beginPath();
    c.moveTo(x, 0);
    c.lineTo(x, h);
    c.stroke();
  }
  const circle = (x: number, y: number, r: number, colour: string) => {
    c.fillStyle = colour;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
  };
  const floor = h - 12;
  // Keep one complete room vignette within each phone-width stretch of a big world.
  const bays = Math.max(1, Math.round(w / 430)),
    bay = w / bays;
  for (let i = 0; i < bays; i++) {
    const left = i * bay,
      scale = Math.min(1, bay / 350, h / 110);
    const wx = left + bay * 0.36,
      wy = h * 0.1,
      ww = bay * 0.3,
      wh = h * 0.62;
    c.fillStyle = "#735640";
    c.fillRect(wx - 5, wy - 5, ww + 10, wh + 10);
    c.save();
    c.beginPath();
    c.rect(wx, wy, ww, wh);
    c.clip();
    const sky = c.createLinearGradient(0, wy, 0, wy + wh);
    sky.addColorStop(0, day > 0.4 ? "#609ac3" : "#182e56");
    sky.addColorStop(1, day > 0.4 ? "#d8deab" : "#6d7690");
    c.fillStyle = sky;
    c.fillRect(wx, wy, ww, wh);
    const body = celestialPosition(hour);
    circle(
      wx + ww * body.x,
      wy + wh * body.y,
      Math.max(4, wh * 0.12),
      body.sun ? "#fff2b0" : "#f0ebd7",
    );
    if (day < 0.5)
      for (let s = 0; s < 6; s++)
        circle(
          wx + ww * ((s * 0.173 + 0.12) % 1),
          wy + wh * ((s * 0.27 + 0.08) % 0.55),
          0.7,
          "#fff7d9",
        );
    c.fillStyle = day > 0.4 ? "#6b8e8d" : "#283b58";
    for (let b = 0; b < 5; b++) {
      const bh = wh * (0.16 + (b % 3) * 0.07);
      c.fillRect(wx + (b * ww) / 5, wy + wh - bh, ww / 5 + 1, bh);
    }
    c.restore();
    c.fillStyle = "#f6e4bc";
    c.fillRect(wx + ww / 2 - 2, wy, 4, wh);
    c.fillRect(wx, wy + wh * 0.48, ww, 3);
    c.fillRect(wx - 8, wy + wh + 4, ww + 16, 5);
    // Gathered fabric curtains, rather than another outdoor border.
    for (const x of [wx - 9, wx + ww - 3]) {
      c.fillStyle = "#b36552";
      c.beginPath();
      c.moveTo(x, wy - 5);
      c.lineTo(x + 13, wy - 5);
      c.lineTo(x + 8, wy + wh * 0.8);
      c.lineTo(x - 3, wy + wh);
      c.closePath();
      c.fill();
      c.strokeStyle = "#e3aa84";
      c.beginPath();
      c.moveTo(x + 5, wy);
      c.lineTo(x + 3, wy + wh * 0.75);
      c.stroke();
    }
    // Wall clock is an actual clock: both hands use the same storybook time as the sky.
    const cx = left + bay * 0.25,
      cy = Math.max(h * 0.35, Math.min(74, h - 20)),
      cr = 14 * scale;
    circle(cx, cy, cr + 3, "#825a3e");
    circle(cx, cy, cr, "#fff0cc");
    for (let mark = 0; mark < 12; mark++) {
      const a = (mark * Math.PI) / 6;
      circle(
        cx + Math.cos(a) * cr * 0.8,
        cy + Math.sin(a) * cr * 0.8,
        0.9 * scale,
        "#775b46",
      );
    }
    const hands = clockAngles(hour);
    c.lineCap = "round";
    c.strokeStyle = "#425f62";
    for (const [angle, length, width] of [
      [hands.hour, 0.47, 2.7],
      [hands.minute, 0.7, 1.5],
    ]) {
      c.lineWidth = width * scale;
      c.beginPath();
      c.moveTo(cx, cy);
      c.lineTo(
        cx + Math.cos(angle) * cr * length,
        cy + Math.sin(angle) * cr * length,
      );
      c.stroke();
    }
    circle(cx, cy, 2 * scale, "#b66b49");
    // Desk, books and favourite teddy beside a hinged reading lamp.
    c.fillStyle = "#956443";
    c.fillRect(left + 12, floor - 3, bay - 24, 5);
    for (let b = 0; b < 4; b++) {
      c.fillStyle = ["#467b83", "#b96751", "#c09b3d", "#789053"][b];
      c.fillRect(
        left + 15 + b * 9 * scale,
        floor - (24 + (b % 2) * 7) * scale,
        7 * scale,
        (24 + (b % 2) * 7) * scale,
      );
    }
    const tx = left + bay * 0.18;
    circle(tx - 6 * scale, floor - 25 * scale, 4 * scale, "#aa754f");
    circle(tx + 6 * scale, floor - 25 * scale, 4 * scale, "#aa754f");
    circle(tx, floor - 10 * scale, 9 * scale, "#ba895b");
    circle(tx, floor - 22 * scale, 8 * scale, "#c79965");
    circle(tx - 3 * scale, floor - 23 * scale, scale, "#413c37");
    circle(tx + 3 * scale, floor - 23 * scale, scale, "#413c37");
    circle(tx, floor - 19 * scale, 2 * scale, "#ebc595");
    const lx = left + bay * 0.82,
      ly = floor - 35 * scale;
    c.strokeStyle = "#465f61";
    c.lineWidth = 4 * scale;
    c.beginPath();
    c.moveTo(lx + 8 * scale, floor);
    c.lineTo(lx + 10 * scale, ly + 8 * scale);
    c.lineTo(lx - 5 * scale, ly);
    c.stroke();
    c.fillStyle = "#527f79";
    c.beginPath();
    c.moveTo(lx - 13 * scale, ly - 4 * scale);
    c.lineTo(lx - 2 * scale, ly - 4 * scale);
    c.lineTo(lx + 7 * scale, ly + 7 * scale);
    c.lineTo(lx - 22 * scale, ly + 7 * scale);
    c.closePath();
    c.fill();
    c.fillStyle = "#527f79";
    c.fillRect(lx - 2 * scale, floor - 3 * scale, 25 * scale, 4 * scale);
    if (day < 0.95) {
      c.fillStyle = `rgba(255,220,133,${(1 - day) * 0.38})`;
      c.beginPath();
      c.moveTo(lx - 20 * scale, ly + 7 * scale);
      c.lineTo(lx + 5 * scale, ly + 7 * scale);
      c.lineTo(lx + 27 * scale, floor);
      c.lineTo(lx - 47 * scale, floor);
      c.closePath();
      c.fill();
      circle(lx - 7 * scale, ly + 7 * scale, 3 * scale, "#fff0af");
    }
  }
  c.fillStyle = `rgba(30,35,65,${(1 - day) * 0.19})`;
  c.fillRect(0, 0, w, h);
  c.fillStyle = "#e2bd7b";
  c.fillRect(0, h - 8, w, 4);
  c.fillStyle = "#76533c";
  c.fillRect(0, h - 4, w, 4);
  c.restore();
}
