import { getFishVariant } from "./fishVariants";
import { terrainSurface, TERRAIN_BINS } from "./terrain";
import { drawShore } from "./forest";
import {
  glassPatch,
  glassDirt,
  litterPosition,
  litterPresent,
  type CleanupKind,
} from "./cleanup";
import { drawToy } from "./toys";
import {
  addTrailPoint,
  bubbleTarget,
  placeBubble,
  learnableTrail,
  playTarget,
  canPlaySpecies,
  invitedPlayer,
  type PlayCommand,
  type ActivePlayCommand,
} from "./play";
import {
  animalBehavior,
  jumpPosition,
  frogSnack,
  waterSurface,
  type Point,
} from "./behaviors";
import { fishColor, fishSize, fishMarkings } from "./appearance";
import {
  scatterFood,
  advanceFood,
  foodForFish,
  type FoodParticle,
  type FoodKind,
} from "./feeding";
import { worldEnvironment, drawWeather, drawBubbles } from "./environment";
import { swimStep, pickDecoration } from "./sceneGeometry";
import { useEffect, useRef } from "react";
import {
  animals,
  decorations,
  progress,
  type Save,
  type Fish,
  type Decoration,
} from "./game";
type Props = {
  save: Save;
  tool: string;
  label: string;
  reduced: boolean;
  selectedDecor: string | null;
  photoMode?: boolean;
  onFish: (id: string) => void;
  onEat: (id: string) => void;
  onFeed?: () => boolean;
  onClean?: (kind: CleanupKind, indices: number[]) => void;
  onLearn?: (points: Point[], fishIds: string[]) => void;
  playCommand?: PlayCommand;
  playGroup?: string[];
  foodKind?: FoodKind;
  pumpOn?: boolean;
  invitedFishId?: string | null;
  onInvitation?: (id: string | null) => void;
  onPoint: (x: number, y: number) => void;
  onSandStart?: () => void;
  onSand?: (x: number) => void;
  onDecor: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
};
export function drawFish(
  c: CanvasRenderingContext2D,
  f: Fish,
  x: number,
  y: number,
  size: number,
  time: number,
  dir = 1,
  sleepingOverride?: boolean,
  eating = false,
) {
  const a = {
    ...animals.find((a) => a.id === f.species)!,
    color: fishColor(f),
  };
  c.save();
  c.translate(x, y);
  const markings = fishMarkings(f);
  const variant = getFishVariant(f.species, f.variant);
  const individualSize = size * fishSize(f);
  c.scale(dir * individualSize, individualSize);
  const sleeping =
    sleepingOverride ??
    (f.careUntil < Date.now() && Math.sin(time * 0.06 + f.seed) > 0.93);
  const wiggle = Math.sin(time * 3 + f.seed) * (sleeping ? 0.035 : 0.13);
  c.rotate(wiggle * 0.35);
  if (
    [
      "pearl_gourami",
      "rainbowfish",
      "ghostknife",
      "regal_angelfish",
      "achilles_tang",
      "zebra_shark",
    ].includes(a.id)
  ) {
    // Each late discovery has its own silhouette and identifying markings.
    const oval = (
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      color: string,
    ) => {
      c.fillStyle = color;
      c.beginPath();
      c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      c.fill();
    };
    const outline = () => {
      c.strokeStyle = "#203b49";
      c.lineWidth = 1.8;
      c.stroke();
    };
    const tailWave = Math.sin(time * 3 + f.seed) * 4;
    let faceX = -25,
      faceY = -5;
    if (a.id === "ghostknife") {
      c.fillStyle = "#6773a0";
      c.beginPath();
      c.moveTo(-28, 9);
      for (let i = 0; i < 12; i++)
        c.lineTo(-28 + i * 8, 18 + Math.sin(time * 4 + i * 0.8) * 3 - i * 0.8);
      c.lineTo(53, 0);
      c.closePath();
      c.fill();
      c.fillStyle = "#263347";
      c.beginPath();
      c.moveTo(-40, -4);
      c.bezierCurveTo(-35, -23, 1, -23, 30, -8);
      c.quadraticCurveTo(48, -1, 68, tailWave);
      c.quadraticCurveTo(48, 9, 25, 11);
      c.bezierCurveTo(-3, 18, -37, 20, -40, -4);
      c.fill();
      outline();
      c.strokeStyle = "#fff9df";
      c.lineWidth = 5;
      for (const tx of [46, 57]) {
        c.beginPath();
        c.moveTo(tx, -1);
        c.lineTo(tx, 7);
        c.stroke();
      }
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(-34, -10);
      c.quadraticCurveTo(-21, -21, -8, -15);
      c.stroke();
      faceX = -29;
      faceY = -3;
    } else if (a.id === "zebra_shark") {
      c.fillStyle = a.color;
      c.beginPath();
      c.moveTo(17, -4);
      c.bezierCurveTo(44, -13, 61, -1, 80, -17 + tailWave);
      c.quadraticCurveTo(65, 17 + tailWave, 31, 10);
      c.fill();
      outline();
      c.beginPath();
      c.moveTo(-5, -10);
      c.quadraticCurveTo(-9, -39, 7, -24);
      c.lineTo(18, -7);
      c.fill();
      outline();
      c.beginPath();
      c.moveTo(20, -4);
      c.quadraticCurveTo(25, -24, 34, -14);
      c.lineTo(38, 0);
      c.fill();
      outline();
      c.beginPath();
      c.moveTo(-8, 7);
      c.quadraticCurveTo(12, 39, 24, 32);
      c.lineTo(13, 3);
      c.fill();
      outline();
      c.beginPath();
      c.moveTo(-41, 0);
      c.bezierCurveTo(-44, -18, -14, -26, 19, -10);
      c.quadraticCurveTo(47, 0, 31, 10);
      c.bezierCurveTo(8, 20, -32, 22, -41, 0);
      c.fill();
      outline();
      c.save();
      c.clip();
      oval(-13, 13, 37, 7, "#fbe9bd");
      if (progress(f) < 0.45) {
        c.strokeStyle = "#705a42";
        c.lineWidth = 5;
        for (let i = 0; i < 6; i++) {
          c.beginPath();
          c.moveTo(-29 + i * 13, -23);
          c.quadraticCurveTo(-35 + i * 13, -3, -23 + i * 13, 22);
          c.stroke();
        }
      } else {
        c.fillStyle = "#655444";
        for (let i = 0; i < 23; i++) {
          c.beginPath();
          c.arc(
            -28 + (i % 8) * 8,
            -9 + Math.floor(i / 8) * 8 + Math.sin(i) * 3,
            1.5 + (i % 3) * 0.35,
            0,
            Math.PI * 2,
          );
          c.fill();
        }
      }
      c.restore();
      c.strokeStyle = "#866e4e";
      c.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        c.beginPath();
        c.moveTo(-13 + i * 4, -1);
        c.lineTo(-12 + i * 4, 6);
        c.stroke();
      }
      faceX = -30;
      faceY = -3;
    } else {
      const disk = a.id === "regal_angelfish",
        achilles = a.id === "achilles_tang";
      const base = achilles
        ? "#303b4b"
        : a.id === "rainbowfish"
          ? "#397ec2"
          : a.color;
      c.fillStyle = disk
        ? "#ffce45"
        : achilles
          ? "#f79a48"
          : a.id === "rainbowfish"
            ? "#ffce51"
            : "#dfaf82";
      c.beginPath();
      c.moveTo(24, 0);
      if (a.id === "rainbowfish" || achilles) {
        c.lineTo(59, -23 + tailWave);
        c.lineTo(47, tailWave);
        c.lineTo(59, 23 + tailWave);
      } else {
        c.bezierCurveTo(61, -30 + tailWave, 63, 30 + tailWave, 24, 0);
      }
      c.closePath();
      c.fill();
      outline();
      c.fillStyle = disk ? "#428ed0" : achilles ? "#f1eee0" : "#f2ac6588";
      c.beginPath();
      c.moveTo(-16, -13);
      c.quadraticCurveTo(16, disk ? -44 : -35, 29, -10);
      c.fill();
      c.beginPath();
      c.moveTo(-6, 12);
      c.quadraticCurveTo(14, disk ? 42 : 33, 28, 9);
      c.fill();
      c.fillStyle = base;
      c.beginPath();
      c.ellipse(-1, 0, disk ? 31 : 37, disk ? 29 : 23, 0, 0, Math.PI * 2);
      c.fill();
      outline();
      c.save();
      c.clip();
      if (a.id === "pearl_gourami") {
        oval(-22, 9, 22, 15, "#ee976e88");
        c.strokeStyle = "#6b696b";
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(-39, 1);
        c.lineTo(36, 2);
        c.stroke();
        for (let i = 0; i < 33; i++)
          oval(
            -29 + (i % 9) * 7.3,
            -17 + Math.floor(i / 9) * 10 + (i % 2) * 3,
            1.5,
            1.1,
            "#fff9db",
          );
      } else if (a.id === "rainbowfish") {
        c.fillStyle = "#ffc14b";
        c.fillRect(1, -30, 38, 60);
        c.fillStyle = "#f39239";
        c.fillRect(17, -30, 24, 60);
        c.strokeStyle = "#fff3b16b";
        c.lineWidth = 1.2;
        for (let i = 0; i < 5; i++) {
          c.beginPath();
          c.moveTo(-32, -13 + i * 6);
          c.quadraticCurveTo(1, -6 + i * 4, 35, -13 + i * 6);
          c.stroke();
        }
      } else if (disk) {
        for (let i = 0; i < 5; i++) {
          c.strokeStyle = "#f7f4df";
          c.lineWidth = 7;
          c.beginPath();
          c.moveTo(-27 + i * 13, -36);
          c.quadraticCurveTo(-35 + i * 13, 0, -18 + i * 13, 34);
          c.stroke();
          c.strokeStyle = "#397ab8";
          c.lineWidth = 2;
          c.stroke();
        }
      } else {
        oval(24, 3, 7, 10, "#ff8b3d");
        c.strokeStyle = "#e5d5ae";
        c.lineWidth = 2;
        c.beginPath();
        c.ellipse(-1, 0, 35, 21, 0, -1.8, 1.9);
        c.stroke();
        c.strokeStyle = "#ee993e";
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(-32, 13);
        c.quadraticCurveTo(-5, 31, 18, 17);
        c.stroke();
      }
      oval(-9, -13, 21, 4, "#ffffff25");
      c.restore();
      if (a.id === "pearl_gourami") {
        c.strokeStyle = "#fbe6ba";
        c.lineWidth = 1.5;
        for (let i = 0; i < 2; i++) {
          c.beginPath();
          c.moveTo(-14 + i * 7, 16);
          c.quadraticCurveTo(
            -8 + i * 9,
            35,
            16 + i * 14,
            39 + Math.sin(time * 2 + i) * 3,
          );
          c.stroke();
        }
      }
      oval(6, 6, 8, 4, "#fff0c940");
      faceX = disk ? -21 : -26;
    }
    if (sleeping) {
      c.strokeStyle = "#edf8e9";
      c.lineWidth = 2;
      c.beginPath();
      c.arc(faceX, faceY, 4, 0.15, Math.PI - 0.15);
      c.stroke();
      c.font = "11px sans-serif";
      c.fillStyle = "#fff7d3";
      c.fillText("z", faceX + 7, faceY - 19);
    } else {
      oval(faceX, faceY, 5.5, 6, "#fff8e8");
      oval(faceX - 1.5, faceY, 2.8, 3.3, "#173442");
      oval(faceX - 2.2, faceY - 1.4, 1, 1.2, "#ffffff");
    }
    c.strokeStyle = "#e6b19e88";
    c.lineWidth = 1.5;
    c.beginPath();
    c.arc(faceX - 4, faceY + 9, 4, 0.1, 1.4);
    c.stroke();
    if (eating) oval(faceX - 9, faceY + 8, 3, 2.5, "#aa635e");
    c.restore();
    return;
  }
  if (["discus", "puffer"].includes(a.id)) c.scale(0.86, 1.35);
  if (["zebrafish", "firefish", "swordtail"].includes(a.id)) c.scale(1.15, 0.7);
  if (a.id === "cory") c.scale(1, 0.75);
  c.fillStyle = a.color;
  c.strokeStyle = "#102c40";
  c.lineWidth = 2.5;
  if (a.id === "jelly") {
    c.globalAlpha = 0.8;
    for (let i = 0; i < 7; i++) {
      c.strokeStyle = i % 2 ? "#f5afff" : a.color;
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(-22 + i * 7, 5);
      c.bezierCurveTo(
        -25 + i * 7 + Math.sin(time + i) * 8,
        24,
        -18 + i * 7,
        35,
        -24 + i * 7 + Math.sin(time + i) * 12,
        48,
      );
      c.stroke();
    }
    c.fillStyle = a.color;
    c.beginPath();
    c.ellipse(0, 0, 32, 23, 0, Math.PI, Math.PI * 2);
    c.quadraticCurveTo(0, 15, -32, 0);
    c.fill();
    c.strokeStyle = "#ffd7ff";
    c.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      c.beginPath();
      c.ellipse((i % 2) * 12 - 6, Math.floor(i / 2) * 8 - 10, 6, 4, 0, 0, 7);
      c.stroke();
    }
  } else if (a.id === "ray") {
    c.strokeStyle = a.color;
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(15, 0);
    c.quadraticCurveTo(52, 8, 70, Math.sin(time) * 10);
    c.stroke();
    c.fillStyle = a.color;
    c.beginPath();
    c.moveTo(-28, 0);
    c.quadraticCurveTo(-5, -15, 8, -38 - Math.sin(time * 2) * 5);
    c.quadraticCurveTo(30, 0, 8, 38 + Math.sin(time * 2) * 5);
    c.quadraticCurveTo(-5, 15, -28, 0);
    c.fill();
    c.strokeStyle = "#16394c";
    c.lineWidth = 2;
    c.stroke();
    c.fillStyle = variant ? "#329bd1" : "#e7f6ff";
    for (let i = 0; i < 12; i++) {
      c.beginPath();
      c.arc(-2 + (i % 3) * 7, -22 + Math.floor(i / 3) * 14, 2, 0, 7);
      c.fill();
    }
    c.fillStyle = "#102c40";
    c.beginPath();
    c.arc(-17, -5, 3, 0, 7);
    c.fill();
  } else if (a.id === "snail") {
    c.fillStyle = "#a4b183";
    c.beginPath();
    c.ellipse(0, 8, 25, 9, 0, 0, 7);
    c.fill();
    c.fillStyle = a.color;
    c.beginPath();
    c.arc(0, -3, 18, 0, 7);
    c.fill();
    c.strokeStyle = "#9d7753";
    c.lineWidth = 2;
    c.beginPath();
    for (let t = 0; t < 15; t += 0.1) {
      const r = t;
      c.lineTo(Math.cos(t) * r, -3 + Math.sin(t) * r);
    }
    c.stroke();
    c.strokeStyle = "#a4b183";
    c.beginPath();
    c.moveTo(-17, 5);
    c.lineTo(-26, -16);
    c.moveTo(-13, 4);
    c.lineTo(-16, -17);
    c.stroke();
  } else if (a.id === "crab") {
    c.strokeStyle = a.color;
    c.lineWidth = 5;
    c.lineCap = "round";
    for (const side of [-1, 1]) {
      for (let leg = 0; leg < 3; leg++) {
        c.beginPath();
        c.moveTo(side * 18, leg * 5 - 2);
        c.lineTo(side * (32 + leg * 2), leg * 8 - 1);
        c.lineTo(side * (39 + leg * 2), leg * 8 + 6);
        c.stroke();
      }
      c.beginPath();
      c.moveTo(side * 20, -5);
      c.lineTo(side * 35, -20);
      c.stroke();
      c.fillStyle = a.color;
      c.beginPath();
      c.arc(side * 38, -26, 12, 0, 7);
      c.fill();
      c.fillStyle = "#eff1e7";
      c.beginPath();
      c.moveTo(side * 38, -27);
      c.lineTo(side * 48, -40);
      c.lineTo(side * 34, -39);
      c.closePath();
      c.fill();
      c.beginPath();
      c.moveTo(side * 11, -14);
      c.lineTo(side * 13, -26);
      c.stroke();
    }
    c.fillStyle = a.color;
    c.beginPath();
    c.ellipse(0, 0, 27, 17, 0, 0, 7);
    c.fill();
    for (const side of [-1, 1]) {
      c.fillStyle = "#fff9e8";
      c.beginPath();
      c.arc(side * 13, -25, 6, 0, 7);
      c.fill();
      c.fillStyle = "#23464b";
      c.beginPath();
      c.arc(side * 13, -25, 3, 0, 7);
      c.fill();
    }
    c.strokeStyle = "#935f59";
    c.lineWidth = 1.5;
    c.beginPath();
    c.arc(0, 0, 8, 0.2, Math.PI - 0.2);
    c.stroke();
  } else if (a.id === "shrimp") {
    c.strokeStyle = a.color;
    c.lineWidth = 2;
    c.lineCap = "round";
    for (let i = 0; i < 5; i++) {
      c.beginPath();
      c.moveTo(-15 + i * 8, 5);
      c.lineTo(-19 + i * 7, 22 + Math.sin(time * 3 + i) * 2);
      c.stroke();
    }
    for (let i = 5; i >= 0; i--) {
      c.fillStyle = a.color;
      c.beginPath();
      c.ellipse(
        -17 + i * 8,
        -5 + Math.pow(i / 2, 2),
        12 - i * 0.8,
        11 - i * 0.5,
        i * 0.15,
        0,
        7,
      );
      c.fill();
      c.strokeStyle = "#fff3e655";
      c.lineWidth = 1.5;
      c.beginPath();
      c.arc(-17 + i * 8, -5 + Math.pow(i / 2, 2), 8, 0, Math.PI);
      c.stroke();
    }
    c.fillStyle = a.color;
    c.beginPath();
    c.moveTo(25, 10);
    c.lineTo(45, 3);
    c.lineTo(40, 19);
    c.lineTo(25, 20);
    c.fill();
    c.strokeStyle = a.color;
    c.lineWidth = 2;
    for (const lift of [0, 10]) {
      c.beginPath();
      c.moveTo(-27, -6);
      c.quadraticCurveTo(-44, -42 - lift, -63, -25 - lift);
      c.stroke();
    }
    c.fillStyle = "#fff9e8";
    c.beginPath();
    c.arc(-24, -9, 6, 0, 7);
    c.fill();
    c.fillStyle = "#23464b";
    c.beginPath();
    c.arc(-26, -9, 3, 0, 7);
    c.fill();
  } else if (a.id === "frog") {
    c.fillStyle = a.color;
    c.beginPath();
    c.ellipse(0, 0, 25, 17, 0, 0, 7);
    c.fill();
    for (const sign of [-1, 1]) {
      c.beginPath();
      c.ellipse(sign * 24, 10, 13, 7, sign * 0.5, 0, 7);
      c.fill();
      c.beginPath();
      c.arc(sign * 13, -16, 9, 0, 7);
      c.fill();
      c.fillStyle = "#fff9e8";
      c.beginPath();
      c.arc(sign * 13, -17, 6, 0, 7);
      c.fill();
      c.fillStyle = "#23464b";
      c.beginPath();
      c.arc(sign * 13, -17, 3, 0, 7);
      c.fill();
      c.fillStyle = a.color;
    }
  } else if (a.id === "seahorse") {
    c.lineWidth = 13;
    c.strokeStyle = a.color;
    c.beginPath();
    c.moveTo(0, -22);
    c.bezierCurveTo(-25, 0, 22, 8, 3, 27);
    c.bezierCurveTo(-13, 39, -18, 17, -5, 19);
    c.stroke();
    c.beginPath();
    c.ellipse(-6, -23, 14, 12, 0, 0, 7);
    c.fill();
    c.fillRect(-30, -25, 20, 7);
    if (variant?.pattern === "freckles") {
      c.fillStyle = variant.accent;
      for (const [x, y] of [
        [-7, -17],
        [-10, -7],
        [-5, 2],
        [5, 12],
      ]) {
        c.beginPath();
        c.arc(x, y, 1.6, 0, 7);
        c.fill();
      }
    }
    c.fillStyle = "#254149";
    c.beginPath();
    c.arc(-10, -27, 3, 0, 7);
    c.fill();
  } else {
    c.scale(markings.bodyWidth, markings.bodyHeight);
    if (a.id === "cherry_barb") c.scale(1.05, 0.75);
    if (a.id === "harlequin") c.scale(0.95, 0.85);
    c.fillStyle = a.id === "tang" ? "#f2d476" : (variant?.fin ?? a.color);
    c.save();
    c.translate(26, 0);
    c.rotate(wiggle);
    c.scale(markings.tailLength, markings.tailFan);
    c.beginPath();
    if (a.id === "molly") {
      c.ellipse(12, 0, 18, 16, 0, 0, Math.PI * 2);
    } else {
      c.moveTo(-5, 0);
      c.quadraticCurveTo(29, -30, 29, -19);
      c.quadraticCurveTo(22, 0, 29, 19);
      c.quadraticCurveTo(29, 30, -5, 0);
    }
    c.fill();
    c.restore();
    if (a.id === "betta") {
      c.fillStyle = variant?.fin ?? "#db235d";
      c.beginPath();
      c.moveTo(17, -10);
      c.bezierCurveTo(75, -65, 65, 45, 15, 15);
      c.fill();
    }
    if (a.id === "swordtail") {
      c.fillStyle = a.color;
      c.beginPath();
      c.moveTo(25, 10);
      c.lineTo(72, 29);
      c.lineTo(35, 17);
      c.fill();
    }
    if (a.id === "firefish") {
      c.strokeStyle = "#ffeec6";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(-8, -12);
      c.lineTo(5, -49);
      c.stroke();
    }
    if (a.id === "cory") {
      c.strokeStyle = "#fce5b0";
      c.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        c.beginPath();
        c.moveTo(-30, 5);
        c.lineTo(-42 + i * 6, 17);
        c.stroke();
      }
    }
    c.fillStyle = a.color;
    if (a.id === "angelfish") {
      for (const side of [-1, 1]) {
        c.beginPath();
        c.moveTo(-8, side * 15);
        c.lineTo(5, side * 47);
        c.lineTo(20, side * 14);
        c.fill();
      }
    }
    c.beginPath();
    c.moveTo(-8, -17);
    c.quadraticCurveTo(
      8,
      ["molly", "harlequin", "cherry_barb"].includes(a.id) ? -28 : -38,
      24,
      -13,
    );
    c.fill();
    c.fillStyle = a.color;
    c.beginPath();
    c.ellipse(
      0,
      0,
      a.id === "angelfish" ? 24 : 34,
      a.id === "angelfish" ? 30 : 20,
      0,
      0,
      7,
    );
    c.fill();
    c.strokeStyle = "#143748";
    c.lineWidth = 2;
    c.stroke();
    c.save();
    c.beginPath();
    c.ellipse(
      0,
      0,
      a.id === "angelfish" ? 24 : 33,
      a.id === "angelfish" ? 30 : 20,
      0,
      0,
      7,
    );
    c.clip();
    c.fillStyle = markings.accent;
    c.strokeStyle = markings.accent;
    if (markings.pattern === "freckles" || markings.pattern === "patches") {
      for (const mark of markings.marks) {
        c.beginPath();
        c.ellipse(
          mark.x,
          mark.y,
          mark.size * (markings.pattern === "patches" ? 2.2 : 0.65),
          mark.size,
          0.3,
          0,
          Math.PI * 2,
        );
        c.fill();
      }
    } else if (markings.pattern === "bands") {
      c.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        c.beginPath();
        c.moveTo(-9 + i * 12, -25);
        c.quadraticCurveTo(-17 + i * 12, 0, -7 + i * 12, 25);
        c.stroke();
      }
    } else if (markings.pattern === "shimmer") {
      c.fillStyle = markings.pale;
      for (const mark of markings.marks) {
        c.beginPath();
        c.ellipse(mark.x, mark.y, mark.size * 1.3, 1.2, -0.3, 0, Math.PI * 2);
        c.fill();
      }
    }
    if (a.id === "harlequin") {
      c.fillStyle = "#303a38";
      c.beginPath();
      c.moveTo(1, -15);
      c.lineTo(30, 0);
      c.lineTo(1, 13);
      c.closePath();
      c.fill();
    }
    if (a.id === "cherry_barb") {
      c.strokeStyle = "#493c2e";
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(-33, 1);
      c.lineTo(31, 1);
      c.stroke();
    }
    if (variant && a.id === "guppy") {
      c.fillStyle = "#303b35";
      for (const [x, y] of [
        [-12, 5],
        [15, 2],
      ]) {
        c.beginPath();
        c.ellipse(x, y, 3, 4, 0, 0, 7);
        c.fill();
      }
    }
    if (variant && a.id === "swordtail") {
      c.strokeStyle = variant.accent;
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(-33, 1);
      c.lineTo(33, 1);
      c.stroke();
    }
    if (["zebrafish", "discus", "mandarin"].includes(a.id)) {
      c.strokeStyle =
        a.id === "mandarin"
          ? "#ff8f21"
          : a.id === "discus" && variant
            ? variant.accent
            : "#163f78";
      c.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        c.beginPath();
        c.moveTo(-35, -17 + i * 8);
        c.bezierCurveTo(-5, -28 + i * 8, 6, 3 + i * 5, 35, -18 + i * 8);
        c.stroke();
      }
    }
    if (["gramma", "firefish"].includes(a.id)) {
      c.fillStyle = a.id === "gramma" ? "#ffce2c" : "#fff5d3";
      c.fillRect(a.id === "gramma" ? 0 : -35, -30, 35, 60);
    }
    if (["cory", "puffer", "platy"].includes(a.id)) {
      c.fillStyle = "#293d4f";
      for (let i = 0; i < 9; i++) {
        c.beginPath();
        c.arc(
          -6 + (i % 3) * 10,
          -12 + Math.floor(i / 3) * 10,
          a.id === "platy" ? 4 : 2,
          0,
          7,
        );
        c.fill();
      }
    }
    if (a.id === "clownfish" || a.id === "tetra" || a.id === "butterfly") {
      c.fillStyle = a.id === "tetra" ? "#fa8985" : "#fff2d3";
      c.fillRect(
        a.id === "tetra" ? -35 : -8,
        a.id === "tetra" ? 0 : -25,
        a.id === "tetra" ? 60 : 9,
        a.id === "tetra" ? 8 : 50,
      );
      if (a.id === "clownfish") c.fillRect(17, -25, 7, 50);
    }
    if (a.id === "tang") {
      c.strokeStyle = "#3e5f89";
      c.lineWidth = 5;
      c.beginPath();
      c.ellipse(4, 0, 15, 11, 0, -1.5, 1.8);
      c.stroke();
    }
    if (a.id === "angelfish") {
      c.fillStyle = "#66568855";
      c.fillRect(-6, -32, 6, 64);
      c.fillRect(9, -32, 4, 64);
    }
    if (a.id === "butterfly") {
      c.fillStyle = "#897742";
      c.fillRect(-23, -27, 6, 54);
    }
    c.fillStyle = "#ffffff20";
    c.beginPath();
    c.ellipse(-3, -9, 23, 7, -0.15, 0, 7);
    c.fill();
    c.restore();
    c.fillStyle = "#ffffff50";
    c.beginPath();
    c.moveTo(2, 0);
    c.quadraticCurveTo(22, 1, 10, 13);
    c.fill();
    c.fillStyle = "#fff9e9";
    c.beginPath();
    c.arc(-19, -4, 7, 0, 7);
    c.fill();
    c.fillStyle = "#23434a";
    c.beginPath();
    c.arc(-21, -4, 3.7, 0, 7);
    c.fill();
    c.fillStyle = "white";
    c.beginPath();
    c.arc(-22, -6, 1.1, 0, 7);
    c.fill();
    c.strokeStyle = "#945f5244";
    c.lineWidth = 1.5;
    c.beginPath();
    c.arc(-24, 4, 6, 0.2, 1.4);
    c.stroke();
  }
  if (
    eating &&
    !["frog", "crab", "snail", "shrimp", "seahorse"].includes(a.id)
  ) {
    c.fillStyle = "#965e50";
    c.beginPath();
    c.ellipse(-31, 5, 4, 3, 0, 0, 7);
    c.fill();
  }
  if (
    sleeping &&
    !["frog", "crab", "snail", "seahorse", "shrimp"].includes(a.id)
  ) {
    c.fillStyle = a.color;
    c.beginPath();
    c.arc(-19, -4, 8, 0, 7);
    c.fill();
    c.strokeStyle = "#23434a";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(-24, -3);
    c.quadraticCurveTo(-19, 0, -14, -3);
    c.stroke();
    c.font = "12px sans-serif";
    c.fillStyle = "#fff8de";
    c.fillText("z", 0, -30);
  }
  c.restore();
}
export function drawDecor(
  c: CanvasRenderingContext2D,
  d: Decoration,
  w: number,
  h: number,
  time: number,
) {
  const def = decorations.find((a) => a.id === d.kind)!;
  const sea = def.habitat === "sea";
  c.save();
  c.translate(d.x * w, d.y * h);
  c.rotate(((d.rotation ?? 0) * Math.PI) / 180);
  c.scale(d.scale * (d.flip ? -1 : 1), d.scale);
  if (drawToy(c, d.kind, time)) {
    c.restore();
    return;
  }
  const kind = def.kind;
  const item = Number(d.kind.slice(1));
  const ellipse = (
    x: number,
    y: number,
    rx: number,
    ry: number,
    color: string,
  ) => {
    c.fillStyle = color;
    c.beginPath();
    c.ellipse(x, y, rx, ry, 0, 0, 7);
    c.fill();
  };
  if ([6, 7, 8, 9, 10, 11, 16, 18, 19, 20, 21, 22, 23].includes(item)) {
    if (item === 6) {
      c.fillStyle = "#b4a991";
      c.fillRect(-12, -48, 24, 47);
      c.strokeStyle = "#75a7a4";
      c.lineWidth = 2;
      for (let j = 0; j < 5; j++) {
        c.beginPath();
        c.arc(
          Math.sin(time + j) * 12,
          -50 - ((time * 15 + j * 20) % 65),
          3 + (j % 3),
          0,
          7,
        );
        c.stroke();
      }
    }
    if (item === 7 || item === 22) {
      c.fillStyle = item === 22 ? "#e768a0" : "#d6be97";
      c.fillRect(-31, -48, 62, 47);
      for (const side of [-1, 1]) {
        c.fillRect(side * 31 - 11, -66, 22, 66);
        for (let j = 0; j < 3; j++)
          c.fillRect(side * 31 - 12 + j * 9, -73, 6, 12);
      }
      c.fillStyle = "#54786f";
      c.beginPath();
      c.roundRect(-10, -25, 20, 27, [10, 10, 0, 0]);
      c.fill();
    }
    if (item === 8) {
      c.fillStyle = "#c88e70";
      c.beginPath();
      c.moveTo(-21, -28);
      c.lineTo(21, -28);
      c.lineTo(14, 0);
      c.lineTo(-14, 0);
      c.fill();
      c.fillRect(-24, -32, 48, 8);
      c.strokeStyle = "#72986b";
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(0, -29);
      c.lineTo(0, -72);
      c.stroke();
      for (let j = 0; j < 6; j++)
        ellipse(
          Math.cos((j * Math.PI) / 3) * 11,
          -74 + Math.sin((j * Math.PI) / 3) * 11,
          8,
          8,
          "#ecc896",
        );
      ellipse(0, -74, 6, 6, "#d09e64");
    }
    if (item === 9) {
      c.strokeStyle = "#b0b5a0";
      c.lineWidth = 17;
      c.beginPath();
      c.arc(0, 0, 42, Math.PI, 0);
      c.stroke();
    }
    if (item === 10 || item === 21) {
      for (let j = 0; j < 7; j++)
        ellipse(
          (j - 3) * 17,
          Math.sin(j) * 7 - 4,
          10,
          5,
          item === 10 ? "#bdc0aa" : "#e8cbb4",
        );
    }
    if (item === 11) {
      c.strokeStyle = "#e7dcba";
      c.lineWidth = 7;
      c.beginPath();
      c.arc(25, -20, 13, 0, 7);
      c.stroke();
      c.fillStyle = "#ece4ce";
      c.beginPath();
      c.roundRect(-27, -43, 53, 41, [2, 2, 20, 20]);
      c.fill();
      c.strokeStyle = "#a7bfb1";
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(-22, -25);
      c.lineTo(21, -25);
      c.stroke();
    }
    if (item === 16) {
      for (let n = 0; n < 3; n++) {
        c.save();
        c.translate((n - 1) * 35, -10 - (n % 2) * 15);
        c.rotate(n);
        c.fillStyle = ["#e8b581", "#d79382", "#e3c486"][n];
        c.beginPath();
        for (let j = 0; j < 10; j++) {
          const r = j % 2 ? 7 : 19;
          c.lineTo(
            Math.cos((j * Math.PI) / 5) * r,
            Math.sin((j * Math.PI) / 5) * r,
          );
        }
        c.closePath();
        c.fill();
        c.restore();
      }
    }
    if (item === 18) {
      c.strokeStyle = "#d294ac";
      c.lineWidth = 4;
      for (let j = 0; j < 12; j++) {
        c.beginPath();
        c.moveTo(0, 0);
        c.quadraticCurveTo(
          (j - 5.5) * 8,
          -45,
          (j - 5.5) * 9,
          -75 + Math.abs(j - 5.5) * 4,
        );
        c.stroke();
      }
      c.strokeStyle = "#e7adc0";
      c.lineWidth = 2;
      for (let k = 1; k < 5; k++) {
        c.beginPath();
        c.ellipse(0, -k * 14, k * 11, 9, 0, Math.PI, Math.PI * 2);
        c.stroke();
      }
    }
    if (item === 19) {
      c.fillStyle = "#a8866e";
      c.beginPath();
      c.moveTo(-55, -30);
      c.lineTo(55, -30);
      c.lineTo(33, 0);
      c.lineTo(-35, 0);
      c.fill();
      c.strokeStyle = "#856e5b";
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(0, -29);
      c.lineTo(0, -98);
      c.stroke();
      c.fillStyle = "#e6d7b3";
      c.beginPath();
      c.moveTo(4, -95);
      c.lineTo(4, -40);
      c.lineTo(39, -40);
      c.closePath();
      c.fill();
    }
    if (item === 20) {
      for (let j = 0; j < 15; j++) {
        c.strokeStyle = ["#be93b3", "#daabbd", "#ac9dbf"][j % 3];
        c.lineWidth = 6;
        c.lineCap = "round";
        c.beginPath();
        c.moveTo((j - 7) * 4, 0);
        c.quadraticCurveTo(
          (j - 7) * 8,
          -25,
          (j - 7) * 6 + Math.sin(time + j) * 5,
          -40 - (j % 3) * 10,
        );
        c.stroke();
      }
    }
    if (item === 23) {
      c.rotate(0.5);
      c.fillStyle = "#b7d4b4aa";
      c.beginPath();
      c.roundRect(-16, -56, 32, 54, 9);
      c.fill();
      c.fillRect(-7, -73, 14, 25);
      c.fillStyle = "#c3a780";
      c.fillRect(-7, -76, 14, 10);
      c.fillStyle = "#e9dec2";
      c.fillRect(-9, -43, 18, 26);
    }
    c.restore();
    return;
  }
  if (item === 12) {
    c.strokeStyle = "#d48e9d";
    c.lineCap = "round";
    c.lineWidth = 10;
    for (const side of [-1, 1]) {
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(side * 12, -43);
      c.lineTo(side * 31, -65);
      c.lineTo(side * 34, -88);
      c.stroke();
      c.beginPath();
      c.moveTo(side * 14, -46);
      c.lineTo(side * 39, -44);
      c.lineTo(side * 49, -64);
      c.stroke();
      c.beginPath();
      c.moveTo(side * 25, -59);
      c.lineTo(side * 15, -80);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(0, -93);
    c.stroke();
    c.restore();
    return;
  }
  if (item === 14) {
    ellipse(0, -4, 40, 11, "#d4ad99");
    c.fillStyle = "#f1d2ba";
    c.beginPath();
    c.moveTo(0, -3);
    c.bezierCurveTo(-70, -42, -38, -77, 0, -55);
    c.bezierCurveTo(38, -77, 70, -42, 0, -3);
    c.fill();
    c.strokeStyle = "#d3a593";
    c.lineWidth = 2;
    for (let j = -2; j <= 2; j++) {
      c.beginPath();
      c.moveTo(0, -7);
      c.lineTo(j * 15, -51 - Math.abs(j) * 2);
      c.stroke();
    }
    ellipse(0, -14, 13, 13, "#fff7e5");
    ellipse(-4, -19, 4, 3, "#ffffff");
    c.restore();
    return;
  }
  if (item === 15) {
    c.strokeStyle = "#d1b59e";
    c.lineWidth = 18;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(-43, 0);
    c.bezierCurveTo(-50, -85, 48, -85, 43, 0);
    c.stroke();
    ellipse(-39, -2, 20, 8, "#c4ab94");
    ellipse(39, -2, 20, 8, "#c4ab94");
    c.restore();
    return;
  }
  if (item === 4) {
    c.strokeStyle = "#aa9071";
    c.lineWidth = 20;
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(-43, -3);
    c.quadraticCurveTo(4, -25, 47, -16);
    c.stroke();
    c.lineWidth = 10;
    c.beginPath();
    c.moveTo(2, -14);
    c.lineTo(15, -43);
    c.stroke();
    c.restore();
    return;
  }
  if (item === 5) {
    ellipse(0, -5, 43, 10, "#7d9e72");
    ellipse(0, -13, 12, 9, "#e9c9c5");
    ellipse(0, -18, 7, 7, "#f3ded0");
    c.restore();
    return;
  }
  if (kind === 0 || kind === 1 || kind === 4) {
    const colors = sea
      ? ["#438e8a", "#66aaa0", "#87b79d"]
      : ["#397e70", "#59957a", "#76ab88"];
    for (let j = 0; j < 7; j++) {
      const len = 60 + (j % 3) * 26,
        lean = (j - 3) * 14 + Math.sin(time * 0.6 + j) * 4;
      c.strokeStyle = colors[j % 3];
      c.lineWidth = kind === 1 ? 9 : 4;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(lean, -len * 0.6, lean * 0.7, -len);
      c.stroke();
      if (kind !== 1)
        for (let k = 1; k < 5; k++) {
          const yy = (-k * len) / 5,
            xx = (lean * k) / 6;
          for (const side of [-1, 1]) {
            c.fillStyle = colors[(j + k) % 3];
            c.beginPath();
            c.ellipse(xx + side * 10, yy, 17, 6, side * 0.65, 0, 7);
            c.fill();
          }
        }
    }
  } else if (kind === 2) {
    for (let j = 0; j < 4; j++) {
      c.fillStyle = ["#adb3a0", "#c1c1aa", "#929e92", "#cfd0b8"][j];
      c.beginPath();
      c.ellipse((j - 1.5) * 19, -8 - (j % 2) * 7, 24, 15, j * 0.3, 0, 7);
      c.fill();
    }
    if (sea) {
      c.fillStyle = "#f2d7b7";
      c.beginPath();
      c.arc(0, -18, 23, Math.PI, 0);
      c.lineTo(0, 0);
      c.fill();
    }
  } else if (kind === 3) {
    c.fillStyle = sea ? "#d9b69d" : "#678b89";
    c.beginPath();
    c.roundRect(-45, -62, 90, 65, [35, 35, 8, 8]);
    c.fill();
    c.fillStyle = "#285b59";
    c.beginPath();
    c.roundRect(-23, -40, 46, 44, [23, 23, 0, 0]);
    c.fill();
  } else {
    c.fillStyle = sea ? "#bd9475" : "#c19475";
    c.beginPath();
    c.roundRect(-35, -40, 70, 39, 7);
    c.fill();
    c.fillStyle = "#e2c18a";
    c.fillRect(-36, -34, 72, 7);
    c.fillRect(-4, -34, 8, 20);
    c.strokeStyle = "#846c55";
    c.lineWidth = 3;
    c.strokeRect(-35, -40, 70, 39);
  }
  c.restore();
}
export default function Scene(p: Props) {
  const worldSize = p.save.worlds[p.save.habitat].viewSize;
  const worldRatio = { small: 1, medium: 1.6, large: 2.4 }[
    p.save.worlds[p.save.habitat].size ?? "small"
  ];
  const latest = useRef(p);
  latest.current = p;
  const pan = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
    moved: boolean;
  } | null>(null);
  const positions = useRef<Record<string, { x: number; y: number }>>({});
  const pendingFishClick = useRef<string | null>(null);
  const feedFishTap = useRef<string | null>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const drag = useRef<string | null>(null);
  const particles = useRef<FoodParticle[]>([]);
  const foodBatch = useRef(0);
  const lastBite = useRef<Record<string, number>>({});
  const jumpStarts = useRef<Record<string, Point>>({});
  const trail = useRef<Point[]>([]);
  const drawing = useRef(false);
  const trailUntil = useRef(0);
  const pointerUntil = useRef(0);
  const learners = useRef(new Set<string>());
  const command = useRef<ActivePlayCommand | null>(null);
  const lastInvitation = useRef<string | null>(null);
  const cleanedGlass = useRef<Record<number, number>>({});
  const cleanedLitter = useRef<Record<number, number>>({});
  const sandStroke = useRef(false);
  const sandLast = useRef(0);
  const cleaning = useRef(false);
  const lastCleanPoint = useRef<Point | null>(null);
  const cleanSparkles = useRef<{ x: number; y: number; t: number }[]>([]);
  useEffect(() => {
    pointer.current = null;
    pointerUntil.current = 0;
    drawing.current = false;
    learners.current.clear();
    trail.current = [];
    if (!p.playCommand) {
      command.current = null;
      return;
    }
    const canvas = p.canvasRef.current,
      viewport = canvas?.parentElement;
    command.current = {
      ...p.playCommand,
      startedAt: Date.now(),
      center: {
        x:
          canvas && viewport
            ? (viewport.scrollLeft +
                Math.min(viewport.clientWidth, canvas.clientWidth) / 2) /
              canvas.clientWidth
            : 0.5,
        y:
          canvas && viewport
            ? (viewport.scrollTop +
                Math.min(viewport.clientHeight, canvas.clientHeight) * 0.58) /
              canvas.clientHeight
            : 0.58,
      },
    };
  }, [p.playCommand?.nonce]);
  useEffect(() => {
    const viewport = p.canvasRef.current?.parentElement;
    if (viewport) {
      viewport.scrollLeft = 0;
      viewport.scrollTop = 0;
    }
  }, [p.save.id, p.save.habitat, p.save.worlds[p.save.habitat].size]);
  useEffect(() => {
    const canvas = p.canvasRef.current;
    const viewport = canvas?.parentElement;
    if (!canvas || !viewport) return;
    let width = viewport.clientWidth,
      height = viewport.clientHeight;
    let center = {
      x: viewport.scrollLeft + Math.min(width, canvas.clientWidth) / 2,
      y: viewport.scrollTop + Math.min(height, canvas.clientHeight) / 2,
    };
    const remember = () => {
      // A resize may clamp scroll offsets before its observer runs.
      if (width !== viewport.clientWidth || height !== viewport.clientHeight)
        return;
      center = {
        x: viewport.scrollLeft + Math.min(width, canvas.clientWidth) / 2,
        y: viewport.scrollTop + Math.min(height, canvas.clientHeight) / 2,
      };
    };
    const observer = new ResizeObserver(() => {
      width = viewport.clientWidth;
      height = viewport.clientHeight;
      viewport.scrollLeft = center.x - Math.min(width, canvas.clientWidth) / 2;
      viewport.scrollTop = center.y - Math.min(height, canvas.clientHeight) / 2;
      remember();
    });
    observer.observe(viewport);
    viewport.addEventListener("scroll", remember);
    return () => {
      observer.disconnect();
      viewport.removeEventListener("scroll", remember);
    };
  }, [p.save.id, p.save.habitat, worldSize?.width, worldSize?.height]);
  useEffect(() => {
    cleanedGlass.current = {};
    cleanedLitter.current = {};
    cleaning.current = false;
    cleanSparkles.current = [];
    particles.current = [];
    lastBite.current = {};
    pointer.current = null;
    drag.current = null;
    jumpStarts.current = {};
    drawing.current = false;
    trail.current = [];
    learners.current.clear();
    command.current = null;
  }, [p.save.id, p.save.habitat]);
  useEffect(() => {
    const live = new Set(
      Object.values(p.save.worlds).flatMap((w) => w.fish.map((f) => f.id)),
    );
    for (const id of Object.keys(positions.current))
      if (!live.has(id)) {
        delete positions.current[id];
        delete jumpStarts.current[id];
        delete lastBite.current[id];
      }
  }, [p.save]);
  useEffect(() => {
    const canvas = p.canvasRef.current!;
    const c = canvas.getContext("2d")!;
    let raf = 0,
      last = 0,
      previousWidth = 0,
      previousHeight = 0;
    const render = (ms: number) => {
      raf = requestAnimationFrame(render);
      const z = latest.current;
      if (z.reduced && ms - last < 60) return;
      const elapsed = last ? Math.min(100, ms - last) : 1000 / 60;
      last = ms;
      const rect = canvas.getBoundingClientRect(),
        w = rect.width,
        h = rect.height;
      if (!w || !h) return;
      if (
        previousWidth &&
        previousHeight &&
        (w !== previousWidth || h !== previousHeight)
      ) {
        for (const position of [
          ...Object.values(positions.current),
          ...Object.values(jumpStarts.current),
        ]) {
          position.x *= w / previousWidth;
          position.y *= h / previousHeight;
        }
      }
      previousWidth = w;
      previousHeight = h;
      const ratio = Math.min(
        devicePixelRatio || 1,
        z.save.worlds[z.save.habitat].fish.length > 60 ? 1 : 2,
      );
      if (
        canvas.width !== Math.round(w * ratio) ||
        canvas.height !== Math.round(h * ratio)
      ) {
        canvas.width = Math.round(w * ratio);
        canvas.height = Math.round(h * ratio);
      }
      c.setTransform(ratio, 0, 0, ratio, 0, 0);
      const t = z.reduced ? 0 : ms / 1000,
        world = z.save.worlds[z.save.habitat],
        sea = z.save.habitat === "sea";
      const ambience = worldEnvironment(z.save.created, Date.now());
      const palettes = sea
        ? [
            ["#168e9f", "#052b48"],
            ["#287db4", "#102252"],
            ["#835cb8", "#191741"],
          ]
        : [
            ["#1dadb0", "#073e58"],
            ["#209cce", "#092f60"],
            ["#8d62cc", "#291a52"],
          ];
      const pal = palettes[world.background];
      const bg = c.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, pal[0]);
      bg.addColorStop(1, pal[1]);
      c.fillStyle = bg;
      c.fillRect(0, 0, w, h);
      c.save();
      c.globalAlpha = 0.025 + ambience.daylight * 0.065;
      c.fillStyle = "#fffce2";
      for (let i = 0; i < 5; i++) {
        c.beginPath();
        c.moveTo(w * (i * 0.28 - 0.1), 0);
        c.lineTo(w * (i * 0.28 + 0.03), 0);
        c.lineTo(w * (i * 0.28 + 0.26) + Math.sin(t * 0.15) * 20, h);
        c.lineTo(w * (i * 0.28 + 0.1), h);
        c.fill();
      }
      c.restore();
      // Soft silhouettes make the aquarium feel deep.
      c.globalAlpha = 0.16;
      for (let i = 0; i < 10; i++)
        drawDecor(
          c,
          {
            id: "",
            kind: sea ? "d13" : "d1",
            x: i / 9,
            y: 0.88,
            scale: 1.2 + (i % 3) * 0.4,
            flip: false,
            layer: 0,
          },
          w,
          h,
          t,
        );
      c.globalAlpha = 1;
      const sand = ["#b59151", "#677e65", "#91716b"][world.ground];
      c.fillStyle = sand;
      c.beginPath();
      c.moveTo(0, h * terrainSurface(world.sand, 0));
      for (let i = 1; i < TERRAIN_BINS; i++) {
        const x = i / (TERRAIN_BINS - 1);
        c.lineTo(x * w, terrainSurface(world.sand, x) * h);
      }
      c.lineTo(w, h);
      c.lineTo(0, h);
      c.fill();
      c.fillStyle = "#fff6d326";
      c.beginPath();
      c.moveTo(0, h * (terrainSurface(world.sand, 0) + 0.035));
      for (let i = 1; i < TERRAIN_BINS; i++) {
        const x = i / (TERRAIN_BINS - 1);
        c.lineTo(x * w, (terrainSurface(world.sand, x) + 0.035) * h);
      }
      c.lineTo(w, h);
      c.lineTo(0, h);
      c.fill();
      for (let i = 0; i < 95; i++) {
        c.fillStyle = i % 2 ? "#8c937332" : "#fff7d650";
        c.beginPath();
        c.ellipse(
          (i * 137.3) % w,
          h *
            (terrainSurface(world.sand, ((i * 137.3) % w) / w) +
              0.015 +
              (i % 7) / 110),
          1.5,
          1,
          0,
          0,
          7,
        );
        c.fill();
      }
      for (const d of [...world.decor].sort((a, b) => a.layer - b.layer)) {
        drawDecor(c, d, w, h, t);
        if (d.id === z.selectedDecor) {
          c.strokeStyle = "#fff8db";
          c.setLineDash([5, 5]);
          c.lineWidth = 2;
          c.save();
          c.translate(d.x * w, d.y * h);
          c.rotate(((d.rotation ?? 0) * Math.PI) / 180);
          c.strokeRect(
            -48 * d.scale,
            -110 * d.scale,
            96 * d.scale,
            115 * d.scale,
          );
          c.restore();
          c.setLineDash([]);
        }
      }
      const surface = waterSurface(h);
      c.fillStyle = (
        sea
          ? ["#dde9d7", "#e3e7f2", "#e8d8e9"]
          : ["#e5ead9", "#dfeaf0", "#e9dfe9"]
      )[world.background];
      c.fillRect(0, 0, w, surface);
      drawShore(c, w, surface, t, sea, world.background, ambience);
      c.strokeStyle = "#f4ffffcc";
      c.lineWidth = 2;
      c.beginPath();
      for (let x = 0; x <= w + 8; x += 8) {
        const y = surface + Math.sin(x * 0.022 + t * 0.8) * (sea ? 2.5 : 1);
        if (x === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
      if (!sea) {
        c.strokeStyle = "#ffffff35";
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(12, 7);
        c.lineTo(12, h - 12);
        c.moveTo(w - 12, 7);
        c.lineTo(w - 12, h - 12);
        c.stroke();
      }
      if (sea) drawWeather(c, w, surface, ambience, z.reduced);
      for (const pellet of particles.current) advanceFood(pellet, elapsed, ms);
      particles.current = particles.current.filter(
        (food) => ms - food.t < 120000,
      );
      const celebrating = world.fish.filter(
        (f) =>
          f.parents && Date.now() - f.born >= 0 && Date.now() - f.born < 12000,
      );
      const parentHearts = new Set(celebrating.flatMap((f) => f.parents!));
      const babyHearts = new Set(celebrating.map((f) => f.id));
      const neighbors = world.fish.map((fish) => ({
        fish,
        x: (positions.current[fish.id]?.x ?? fish.x * w) / w,
        y: (positions.current[fish.id]?.y ?? fish.y * h) / h,
      }));
      const selectedId = world.fish.find(
        (f) => f.id === z.playGroup?.[0] && canPlaySpecies(f),
      )?.id;
      const invitation = selectedId
        ? null
        : z.onInvitation
          ? invitedPlayer(world.fish, Date.now(), z.save.created)
          : (z.invitedFishId ??
            invitedPlayer(world.fish, Date.now(), z.save.created));
      if (invitation !== lastInvitation.current) {
        lastInvitation.current = invitation;
        z.onInvitation?.(invitation);
      }
      const commandActive = command.current !== null;
      for (const f of world.fish) {
        const a = animals.find((a) => a.id === f.species)!;
        const currentPosition = positions.current[f.id];
        const foodTarget = foodForFish(
          f,
          particles.current,
          ms,
          currentPosition
            ? { x: currentPosition.x / w, y: currentPosition.y / h }
            : undefined,
        );
        const selected = f.id === selectedId;
        const invited = f.id === invitation;
        const manualTarget =
          z.tool === "play" && (drawing.current || ms < pointerUntil.current)
            ? pointer.current
            : null;
        if (
          selected &&
          command.current?.kind === "bubbles" &&
          command.current.bubble?.reachedAt === undefined
        ) {
          const bubble = command.current.bubble;
          if (
            bubble &&
            currentPosition &&
            Math.hypot(
              currentPosition.x - bubble.x * w,
              currentPosition.y - bubble.y * h,
            ) < 34
          )
            bubble.reachedAt = Date.now();
        }
        const toyTarget = selected
          ? playTarget(f, Date.now(), command.current, true, w, h)
          : null;
        const target = selected
          ? commandActive
            ? toyTarget
            : (manualTarget ?? toyTarget)
          : invited && z.tool === "play"
            ? pointer.current
            : null;
        const behavior = animalBehavior(f, {
          width: w,
          height: h,
          time: ms / 1000,
          now: Date.now(),
          reduced: z.reduced,
          daylight: ambience.daylight,
          tool: target ? "play" : z.tool,
          pointer: target,
          food: selected && target ? null : foodTarget,
          forcePlay: selected,
          habitat: z.save.habitat,
          neighbors,
        });
        if (f.species === "frog" && foodTarget) {
          behavior.x = Math.max(35, Math.min(w - 35, foodTarget.x * w));
          behavior.y = surface - 7;
          behavior.activity = "eating";
        }
        const size =
          (0.48 + progress(f) * 0.65) *
          (z.reduced
            ? 1
            : Math.min(1, Math.max(0.1, (Date.now() - f.born) / 700))) *
          Math.min(
            1.2,
            (latest.current.save.worlds[latest.current.save.habitat].viewSize
              ?.width ?? canvas.parentElement!.clientWidth) /
              600 +
              0.45,
            h / 230,
          );
        const pos = positions.current[f.id] ?? {
          x:
            Date.now() - f.born < 1500
              ? canvas.parentElement!.scrollLeft +
                Math.min(canvas.parentElement!.clientWidth, w) / 2
              : f.x * w,
          y:
            f.species === "frog"
              ? surface - 7
              : f.species === "snail"
                ? h * 0.85
                : Math.max(surface + 22, Math.min(h * 0.87, f.y * h)),
        };
        if (f.species === "snail") {
          // Reach the glass along the floor before climbing; return down the same edge.
          const floorHere = h * terrainSurface(world.sand, pos.x / w) - 5;
          if (
            behavior.activity === "sliding" &&
            Math.abs(behavior.x - pos.x) > 12
          )
            behavior.y = h * terrainSurface(world.sand, behavior.x / w) - 5;
          if (pos.y < floorHere - 12 && behavior.activity !== "sliding") {
            behavior.x = pos.x;
            behavior.y = floorHere;
          }
        }
        if (
          ["snail", "crab", "shrimp", "cory", "ray"].includes(f.species) &&
          behavior.y >= h * 0.82
        ) {
          behavior.y = h * terrainSurface(world.sand, behavior.x / w) - 5;
        }
        const dx = behavior.x - pos.x;
        let splash = false;
        if (behavior.jumpPhase !== null) {
          jumpStarts.current[f.id] ??= { ...pos };
          const jumping = jumpPosition(
            jumpStarts.current[f.id],
            behavior.jumpPhase,
            w,
            h,
            size,
          );
          pos.x = jumping.x;
          pos.y = jumping.y;
          splash = jumping.splash;
        } else {
          delete jumpStarts.current[f.id];
          const interested =
            behavior.activity === "eating" ||
            behavior.activity === "following" ||
            behavior.activity === "chasing";
          const gentleSpeed = ["snail", "crab", "shrimp"].includes(f.species)
            ? 9
            : 34 - progress(f) * 8;
          Object.assign(
            pos,
            swimStep(
              pos,
              behavior,
              elapsed,
              gentleSpeed * (interested ? 1.2 : 1),
            ),
          );
        }
        positions.current[f.id] = pos;
        if (drawing.current && selected) learners.current.add(f.id);
        const nibbling =
          behavior.activity === "eating" &&
          foodTarget !== null &&
          Math.hypot(pos.x - foodTarget.x * w, pos.y - foodTarget.y * h) < 24;
        if (
          nibbling &&
          ms - (lastBite.current[f.id] ?? -Infinity) > 600 + (f.seed % 1) * 450
        ) {
          particles.current = particles.current.filter(
            (pellet) => pellet.id !== foodTarget!.id,
          );
          lastBite.current[f.id] = ms;
          z.onEat(f.id);
        }
        if (f.species === "frog") {
          c.fillStyle = "#779e76";
          c.beginPath();
          c.ellipse(pos.x, surface + 10 * size, 31 * size, 7 * size, 0, 0, 7);
          c.fill();
          c.strokeStyle = "#4e8170";
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(pos.x, surface + 10 * size);
          c.lineTo(pos.x + 24 * size, surface + 8 * size);
          c.stroke();
        }
        if (selected && !z.photoMode) {
          c.save();
          c.strokeStyle = "#ffe578";
          c.lineWidth = 2;
          c.setLineDash([]);
          c.beginPath();
          c.ellipse(pos.x, pos.y, 58 * size, 35 * size, 0, 0, Math.PI * 2);
          c.stroke();
          c.restore();
        }
        c.save();
        if (
          f.species === "snail" &&
          pos.y < h * terrainSurface(world.sand, pos.x / w) - 17
        ) {
          c.translate(pos.x, pos.y);
          c.rotate(pos.x < w / 2 ? Math.PI / 2 : -Math.PI / 2);
          c.translate(-pos.x, -pos.y);
        }
        drawFish(
          c,
          f,
          pos.x,
          pos.y,
          size,
          t,
          dx > 0 ? -1 : 1,
          behavior.sleeping,
          nibbling,
        );
        c.restore();
        if (invited && !selected && !z.photoMode) {
          c.save();
          c.translate(pos.x, Math.max(surface + 16, pos.y - 48 * size));
          c.fillStyle = "#fff9db";
          c.strokeStyle = "#173c46";
          c.lineWidth = 2;
          c.beginPath();
          c.arc(0, 0, 12, 0, Math.PI * 2);
          c.fill();
          c.stroke();
          c.beginPath();
          c.font = "bold 15px sans-serif";
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.fillStyle = "#173c46";
          c.fillText("?", 0, 1);
          c.restore();
        }
        if (f.species === "frog") {
          const snack = frogSnack(f.seed, ms / 1000, pos, h, z.reduced);
          if (snack.visible) {
            c.fillStyle = "#fffef0";
            c.beginPath();
            c.ellipse(snack.x - 3, snack.y - 3, 4, 2, -0.6, 0, 7);
            c.ellipse(snack.x + 3, snack.y - 3, 4, 2, 0.6, 0, 7);
            c.fill();
            c.fillStyle = "#496957";
            c.beginPath();
            c.arc(snack.x, snack.y, 2, 0, 7);
            c.fill();
          }
          if (snack.tongue > 0) {
            c.strokeStyle = "#dca2a0";
            c.lineWidth = 3;
            c.beginPath();
            c.moveTo(pos.x, pos.y + 3);
            c.lineTo(
              pos.x + (snack.x - pos.x) * snack.tongue,
              pos.y + 3 + (snack.y - pos.y - 3) * snack.tongue,
            );
            c.stroke();
          }
        }
        if (splash) {
          c.strokeStyle = "#efffffd0";
          c.lineWidth = 2;
          c.beginPath();
          c.ellipse(pos.x, surface, 23, 5, 0, 0, 7);
          c.stroke();
        }
        const familyMoment = parentHearts.has(f.id) || babyHearts.has(f.id);
        if (
          familyMoment ||
          (f.careUntil > Date.now() && (t + f.seed) % 3 < 1.3)
        ) {
          const lift =
            familyMoment && !z.reduced ? Math.sin(t * 2 + f.seed) * 4 : 0;
          c.save();
          c.translate(pos.x, pos.y - 34 + lift);
          c.fillStyle = familyMoment ? "#ffe0df" : "#fff2c3";
          c.beginPath();
          c.moveTo(0, 5);
          c.bezierCurveTo(-15, -3, -6, -15, 0, -7);
          c.bezierCurveTo(6, -15, 15, -3, 0, 5);
          c.fill();
          c.restore();
        }
      }
      const selectedPath = world.fish.find((f) => f.id === selectedId)?.trick
        ?.points;
      if (selectedPath?.length && !drawing.current && !z.photoMode) {
        c.save();
        c.strokeStyle = "#ffe57870";
        c.lineWidth = 2;
        c.setLineDash([5, 8]);
        c.beginPath();
        selectedPath.forEach((q, i) =>
          i ? c.lineTo(q.x * w, q.y * h) : c.moveTo(q.x * w, q.y * h),
        );
        c.stroke();
        c.restore();
      }
      if (
        !z.photoMode &&
        trail.current.length > 1 &&
        (drawing.current || ms < trailUntil.current)
      ) {
        c.save();
        c.strokeStyle = "#fff3acb0";
        c.lineWidth = 2;
        c.setLineDash([3, 7]);
        c.beginPath();
        trail.current.forEach((q, i) =>
          i ? c.lineTo(q.x * w, q.y * h) : c.moveTo(q.x * w, q.y * h),
        );
        c.stroke();
        c.restore();
      }
      const toyBubble = selectedId
        ? bubbleTarget(command.current, Date.now())
        : null;
      if (toyBubble) {
        c.save();
        const bx = toyBubble.x * w,
          by = toyBubble.y * h;
        c.strokeStyle = "#c5faff";
        c.lineWidth = 2.5;
        c.fillStyle = "#c5faff1a";
        c.beginPath();
        c.arc(bx, by, 14, 0, Math.PI * 2);
        c.fill();
        c.stroke();
        c.strokeStyle = "#fffbe8";
        c.lineWidth = 3;
        c.beginPath();
        c.arc(bx - 1, by - 1, 9, 3.7, 4.8);
        c.stroke();
        c.restore();
      }
      if (!sea) {
        const snails = world.fish
          .filter((f) => f.species === "snail")
          .map((f) => positions.current[f.id])
          .filter(Boolean);
        const snailCleaned: number[] = [];
        for (let i = 0; i < 16; i++) {
          const patch = glassPatch(i, z.save.created);
          const cleanedAt = Math.max(
            cleanedGlass.current[i] ?? 0,
            world.cleanup?.glass[i] ?? 0,
          );
          let level = glassDirt(i, z.save.created, Date.now(), cleanedAt);
          if (
            level > 0.12 &&
            snails.some(
              (pos) =>
                Math.hypot(pos.x - patch.x * w, pos.y - patch.y * h) < 38,
            )
          ) {
            cleanedGlass.current[i] = Date.now();
            snailCleaned.push(i);
            level = 0;
          }
          const alpha = level * 0.27;
          if (alpha < 0.002) continue;
          c.fillStyle = `rgba(113,158,59,${alpha})`;
          for (let j = 0; j < 5; j++) {
            c.beginPath();
            c.ellipse(
              patch.x * w + Math.sin(i + j) * 13,
              patch.y * h + Math.cos(i * 2 + j) * 15,
              11 + j * 1.5,
              7 + j,
              0.4,
              0,
              Math.PI * 2,
            );
            c.fill();
          }
        }
        if (snailCleaned.length) z.onClean?.("glass", snailCleaned);
        c.save();
        const px = w - 35,
          py = h * 0.84;
        c.strokeStyle = "#436879";
        c.lineWidth = 5;
        c.beginPath();
        c.moveTo(px + 8, py - 40);
        c.lineTo(px + 8, surface + 14);
        c.stroke();
        c.fillStyle = "#244551";
        c.strokeStyle = "#8aa9a9";
        c.lineWidth = 2;
        c.beginPath();
        c.roundRect(px - 18, py - 35, 36, 48, 7);
        c.fill();
        c.stroke();
        c.fillStyle = z.pumpOn !== false ? "#bde772" : "#577277";
        c.beginPath();
        c.arc(px, py - 23, 3, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = "#709393";
        c.lineWidth = 2;
        for (let j = 0; j < 4; j++) {
          c.beginPath();
          c.moveTo(px - 10, py - 11 + j * 5);
          c.lineTo(px + 10, py - 11 + j * 5);
          c.stroke();
        }
        if (z.pumpOn !== false) {
          c.strokeStyle = "#d9ffffad";
          c.lineWidth = 1.4;
          for (let i = 0; i < 10; i++) {
            const phase = ((z.reduced ? 0 : ms / 6500) + i * 0.113) % 1;
            c.beginPath();
            c.arc(
              px - 5 + Math.sin(phase * 12 + i) * 7,
              py - 38 - phase * (py - surface - 40),
              1.8 + (i % 3) * 0.9,
              0,
              Math.PI * 2,
            );
            c.stroke();
          }
        }
        c.restore();
      }
      if (sea)
        for (let i = 0; i < 16; i++) {
          if (
            !litterPresent(
              i,
              z.save.created,
              Date.now(),
              Math.max(
                cleanedLitter.current[i] ?? 0,
                world.cleanup?.litter[i] ?? 0,
              ),
            )
          )
            continue;
          const item = litterPosition(i, z.save.created);
          c.save();
          c.translate(item.x * w, surface + item.offset);
          c.rotate(Math.sin(i) * 0.35);
          c.strokeStyle = "#39546a";
          c.lineWidth = 1.4;
          if (item.kind === 0) {
            c.fillStyle = "#a7d9d5";
            c.beginPath();
            c.roundRect(-8, -4, 16, 9, 3);
            c.fill();
            c.stroke();
            c.fillStyle = "#f1cf70";
            c.fillRect(7, -2, 5, 5);
            c.fillStyle = "#fffbe5";
            c.fillRect(-4, -3, 5, 7);
          } else if (item.kind === 1) {
            c.fillStyle = "#e6a5a0";
            c.beginPath();
            c.moveTo(-8, -5);
            c.lineTo(8, -4);
            c.lineTo(5, 6);
            c.lineTo(-5, 5);
            c.closePath();
            c.fill();
            c.stroke();
            c.strokeStyle = "#fff7d4";
            c.beginPath();
            c.moveTo(-4, -1);
            c.lineTo(4, 0);
            c.stroke();
          } else {
            c.fillStyle = "#efe4b8";
            c.beginPath();
            c.moveTo(-8, -5);
            c.lineTo(1, -7);
            c.lineTo(8, -1);
            c.lineTo(5, 6);
            c.lineTo(-6, 4);
            c.closePath();
            c.fill();
            c.stroke();
          }
          c.restore();
        }
      cleanSparkles.current = cleanSparkles.current.filter(
        (q) => ms - q.t < 1000,
      );
      for (const sparkle of cleanSparkles.current) {
        c.save();
        c.globalAlpha = 1 - (ms - sparkle.t) / 1000;
        c.strokeStyle = "#fff9c8";
        c.lineWidth = 2;
        const sx = sparkle.x * w,
          sy = sparkle.y * h - (ms - sparkle.t) / 80;
        c.beginPath();
        c.moveTo(sx - 5, sy);
        c.lineTo(sx + 5, sy);
        c.moveTo(sx, sy - 5);
        c.lineTo(sx, sy + 5);
        c.stroke();
        c.restore();
      }
      if (cleaning.current && pointer.current) {
        c.save();
        c.translate(pointer.current.x * w, pointer.current.y * h);
        c.rotate(-0.2);
        c.fillStyle = "#f6d267";
        c.strokeStyle = "#7caa87";
        c.lineWidth = 4;
        c.beginPath();
        c.roundRect(-17, -10, 34, 20, 5);
        c.fill();
        c.stroke();
        c.restore();
      }
      // Keep night gentle enough that young players can still see every resident.
      c.fillStyle = `rgba(13, 22, 70, ${(1 - ambience.daylight) * 0.23})`;
      c.fillRect(0, surface + 2, w, h - surface - 2);
      drawBubbles(
        c,
        w,
        h,
        surface,
        t,
        z.save.created / 1000,
        z.reduced,
        world.fish.length > 60 ? 8 : 22,
      );
      for (const dot of particles.current) {
        c.save();
        c.translate(dot.x * w, dot.y * h);
        c.rotate(dot.rotation);
        c.fillStyle = dot.color;
        c.beginPath();
        if (dot.kind === "worms") {
          c.strokeStyle = dot.color;
          c.lineWidth = 2.5;
          c.lineCap = "round";
          const bend = z.reduced ? 1 : Math.sin(ms / 180 + dot.id) * 2.5;
          c.moveTo(-dot.size * 1.6, 0);
          c.bezierCurveTo(
            -dot.size,
            -3 - bend,
            dot.size,
            3 + bend,
            dot.size * 1.6,
            0,
          );
          c.stroke();
          c.beginPath();
        } else if (dot.kind === "insects") {
          c.fillStyle = "#f6edceb8";
          c.ellipse(-2, -2, 4, 2, -0.5, 0, Math.PI * 2);
          c.ellipse(2, -2, 4, 2, 0.5, 0, Math.PI * 2);
          c.fill();
          c.beginPath();
          c.fillStyle = dot.color;
          c.ellipse(0, 1, 2.5, 1.7, 0, 0, Math.PI * 2);
        } else if (dot.kind === "algae") {
          c.ellipse(0, 0, dot.size * 1.2, dot.size * 0.7, 0, 0, Math.PI * 2);
        } else if (dot.kind === "pellets") {
          c.arc(0, 0, dot.size * 0.75, 0, Math.PI * 2);
        } else if (dot.shape === "flake") {
          c.moveTo(-dot.size, -dot.size * 0.45);
          c.lineTo(dot.size * 0.7, -dot.size * 0.8);
          c.lineTo(dot.size, dot.size * 0.6);
          c.lineTo(-dot.size * 0.4, dot.size);
          c.closePath();
        } else if (dot.shape === "crumb") {
          c.ellipse(0, 0, dot.size, dot.size * 0.55, 0, 0, Math.PI * 2);
        } else {
          c.arc(0, 0, dot.size * 0.7, 0, Math.PI * 2);
        }
        c.fill();
        c.restore();
      }
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, []);
  const hitFish = (q: Point, canvas: HTMLCanvasElement) =>
    [...p.save.worlds[p.save.habitat].fish].reverse().find((f) => {
      const pos = positions.current[f.id];
      return (
        pos &&
        Math.hypot(
          pos.x - q.x * canvas.clientWidth,
          pos.y - q.y * canvas.clientHeight,
        ) <
          Math.max(
            28,
            76 *
              fishSize(f) *
              Math.max(1, fishMarkings(f).bodyWidth) *
              (0.48 + progress(f) * 0.65) *
              Math.min(
                1.2,
                (latest.current.save.worlds[latest.current.save.habitat]
                  .viewSize?.width ?? canvas.parentElement!.clientWidth) /
                  600 +
                  0.45,
                canvas.clientHeight / 230,
              ),
          )
      );
    });
  const point = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / r.width,
      y: (e.clientY - r.top) / r.height,
    };
  };
  const wipeGlass = (q: Point) => {
    const canvas = p.canvasRef.current;
    if (!canvas) return;
    const world = p.save.worlds[p.save.habitat],
      now = Date.now(),
      changed = new Set<number>();
    const previous = lastCleanPoint.current ?? q;
    if (p.save.habitat === "sea") {
      // A shore tap picks up one item, even where pieces overlap.
      const surface = waterSurface(canvas.clientHeight);
      for (let i = 0; i < 16; i++) {
        const cleanedAt = Math.max(
          cleanedLitter.current[i] ?? 0,
          world.cleanup?.litter[i] ?? 0,
        );
        if (!litterPresent(i, p.save.created, now, cleanedAt)) continue;
        const item = litterPosition(i, p.save.created);
        if (
          Math.hypot(
            (item.x - q.x) * canvas.clientWidth,
            surface + item.offset - q.y * canvas.clientHeight,
          ) < 26
        ) {
          cleanedLitter.current[i] = now;
          changed.add(i);
          break;
        }
      }
      if (changed.size) p.onClean?.("litter", [...changed]);
    } else {
      const steps = Math.max(
        1,
        Math.ceil(
          Math.hypot(
            (q.x - previous.x) * canvas.clientWidth,
            (q.y - previous.y) * canvas.clientHeight,
          ) / 20,
        ),
      );
      for (let step = 1; step <= steps; step++) {
        const at = {
          x: previous.x + ((q.x - previous.x) * step) / steps,
          y: previous.y + ((q.y - previous.y) * step) / steps,
        };
        for (let i = 0; i < 16; i++) {
          const patch = glassPatch(i, p.save.created),
            cleanedAt = Math.max(
              cleanedGlass.current[i] ?? 0,
              world.cleanup?.glass[i] ?? 0,
            );
          if (
            glassDirt(i, p.save.created, now, cleanedAt) > 0.03 &&
            Math.hypot(
              (patch.x - at.x) * canvas.clientWidth,
              (patch.y - at.y) * canvas.clientHeight,
            ) < 45
          ) {
            cleanedGlass.current[i] = now;
            changed.add(i);
          }
        }
      }
      if (changed.size) p.onClean?.("glass", [...changed]);
    }
    if (changed.size || p.save.habitat === "aquarium") {
      cleanSparkles.current.push({ ...q, t: performance.now() });
      cleanSparkles.current = cleanSparkles.current.slice(-20);
    }
    lastCleanPoint.current = q;
  };
  return (
    <canvas
      ref={p.canvasRef}
      style={{
        width: worldSize
          ? `${worldSize.width * worldRatio}px`
          : `${worldRatio * 100}%`,
        height: worldSize ? `${worldSize.height}px` : "100%",
        touchAction: "none",
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (
          ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
        ) {
          e.preventDefault();
          e.currentTarget.parentElement!.scrollBy({
            left:
              e.key === "ArrowRight" ? 100 : e.key === "ArrowLeft" ? -100 : 0,
            top: e.key === "ArrowDown" ? 100 : e.key === "ArrowUp" ? -100 : 0,
          });
        }
      }}
      aria-label={p.label}
      onClick={() => {
        const id = pendingFishClick.current;
        pendingFishClick.current = null;
        if (id) p.onFish(id);
      }}
      onPointerDown={(e) => {
        pendingFishClick.current = null;
        feedFishTap.current = null;
        const q = point(e);
        pointer.current = q;
        if (
          p.tool === "play" &&
          command.current?.kind === "bubbles" &&
          p.save.worlds[p.save.habitat].fish.some(
            (f) => f.id === p.playGroup?.[0] && canPlaySpecies(f),
          )
        ) {
          command.current = placeBubble(
            command.current,
            q,
            Date.now(),
            waterSurface(e.currentTarget.clientHeight) /
              e.currentTarget.clientHeight +
              0.025,
          );
          drawing.current = false;
          pointer.current = null;
          pointerUntil.current = 0;
          return;
        }
        if (p.tool.startsWith("sand-")) {
          sandStroke.current = q.y >= 0.4;
          if (sandStroke.current) {
            p.onSandStart?.();
            p.onSand?.(q.x);
            sandLast.current = performance.now();
          }
          e.currentTarget.setPointerCapture(e.pointerId);
          return;
        }
        if (p.tool === "clean") {
          if (p.save.habitat === "sea") {
            wipeGlass(q);
            return;
          }
          cleaning.current = true;
          lastCleanPoint.current = null;
          wipeGlass(q);
          e.currentTarget.setPointerCapture(e.pointerId);
          return;
        }
        if (p.tool === "explore") {
          pan.current = {
            x: e.clientX,
            y: e.clientY,
            top: e.currentTarget.parentElement!.scrollTop,
            left: e.currentTarget.parentElement!.scrollLeft,
            moved: false,
          };
          e.currentTarget.setPointerCapture(e.pointerId);
          return;
        }

        if (p.tool === "decorate") {
          const r = e.currentTarget.getBoundingClientRect();
          const d = pickDecoration(
            p.save.worlds[p.save.habitat].decor,
            q.x,
            q.y,
            r.width,
            r.height,
          );
          if (d) {
            drag.current = d.id;
            p.onDecor(d.id);
            e.currentTarget.setPointerCapture(e.pointerId);
          }
          return;
        }
        if (p.tool === "feed") {
          const tappedFish = hitFish(q, e.currentTarget);
          if (tappedFish) {
            feedFishTap.current = tappedFish.id;
            return;
          }
          if (p.onFeed?.() === false) return;
          const foodY = Math.max(
            waterSurface(e.currentTarget.clientHeight) /
              e.currentTarget.clientHeight +
              0.055,
            Math.min(0.84, q.y),
          );
          particles.current.push(
            ...scatterFood(
              q.x,
              p.foodKind === "insects"
                ? waterSurface(e.currentTarget.clientHeight) /
                    e.currentTarget.clientHeight +
                    0.004
                : foodY,
              performance.now(),
              ++foodBatch.current,
              p.foodKind,
            ),
          );
          particles.current = particles.current.slice(-200);
          p.onPoint(q.x, q.y);
          return;
        }
        if (p.tool === "play") {
          drawing.current = true;
          trail.current = addTrailPoint([], q);
          learners.current.clear();
          e.currentTarget.setPointerCapture(e.pointerId);
          p.onPoint(q.x, q.y);
          return;
        }
      }}
      onPointerMove={(e) => {
        const q = point(e);
        pointer.current = q;
        if (sandStroke.current) {
          if (q.y >= 0.4 && performance.now() - sandLast.current >= 25) {
            p.onSand?.(q.x);
            sandLast.current = performance.now();
          }
          return;
        }
        if (cleaning.current) {
          wipeGlass(q);
          return;
        }
        if (drawing.current) {
          trail.current = addTrailPoint(trail.current, q);
        }
        if (pan.current) {
          const distance = e.clientX - pan.current.x;
          const vertical = e.clientY - pan.current.y;
          pan.current.moved ||= Math.hypot(distance, vertical) > 5;
          e.currentTarget.parentElement!.scrollTop = pan.current.top - vertical;
          e.currentTarget.parentElement!.scrollLeft =
            pan.current.left - distance;
          return;
        }
        if (drag.current)
          p.onMove(
            drag.current,
            Math.max(0.05, Math.min(0.95, q.x)),
            Math.max(0.25, Math.min(0.97, q.y)),
          );
      }}
      onPointerCancel={() => {
        sandStroke.current = false;
        pendingFishClick.current = null;
        feedFishTap.current = null;
        cleaning.current = false;
        lastCleanPoint.current = null;
        pan.current = null;
        drag.current = null;
        pointer.current = null;
        drawing.current = false;
        trail.current = [];
        learners.current.clear();
      }}
      onLostPointerCapture={() => {
        sandStroke.current = false;
        cleaning.current = false;
        lastCleanPoint.current = null;
        drag.current = null;
      }}
      onPointerUp={(e) => {
        if (p.tool === "feed") {
          pendingFishClick.current = feedFishTap.current;
          feedFishTap.current = null;
          return;
        }
        if (p.tool.startsWith("sand-")) {
          sandStroke.current = false;
          return;
        }
        if (!["play", "decorate", "explore", "clean"].includes(p.tool))
          pendingFishClick.current =
            hitFish(point(e), e.currentTarget)?.id ?? null;
        if (cleaning.current) {
          wipeGlass(point(e));
          cleaning.current = false;
          lastCleanPoint.current = null;
          return;
        }
        if (drawing.current) {
          trail.current = addTrailPoint(trail.current, point(e));
          if (learnableTrail(trail.current))
            p.onLearn?.(trail.current, [...learners.current]);
          trailUntil.current = performance.now() + 1800;
          pointerUntil.current =
            performance.now() + (trail.current.length < 4 ? 2500 : 0);
          drawing.current = false;
          if (trail.current.length < 3) {
            const hit = hitFish(point(e), e.currentTarget);
            if (hit) pendingFishClick.current = hit.id;
          }
        }
        if (pan.current && !pan.current.moved) {
          const hit = hitFish(point(e), e.currentTarget);
          if (hit) pendingFishClick.current = hit.id;
        }
        pan.current = null;
        drag.current = null;
      }}
      onPointerLeave={() => {
        if (!drawing.current) pointer.current = null;
      }}
    />
  );
}
