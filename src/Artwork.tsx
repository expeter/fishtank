import { useEffect, useRef } from "react";
import { drawFish, drawDecor } from "./Scene";
import { makeFish, type World, type Fish } from "./game";
export default function Artwork({
  animal,
  fish,
  decor,
  world,
}: {
  animal?: string;
  fish?: Fish;
  decor?: string;
  world?: World;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const draw = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      if (!w || !h) return;
      el.width = w * 2;
      el.height = h * 2;
      const c = el.getContext("2d")!;
      c.scale(2, 2);
      if (world) {
        const gradient = c.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(
          0,
          ["#b7d2c5", "#b3ced7", "#cec1d4"][world.background],
        );
        gradient.addColorStop(1, "#719e91");
        c.fillStyle = gradient;
        c.fillRect(0, 0, w, h);
        c.fillStyle = ["#ded5b1", "#c4cebb", "#c8b5a8"][world.ground];
        c.beginPath();
        c.moveTo(0, h * 0.83);
        c.quadraticCurveTo(w / 2, h * 0.95, w, h * 0.82);
        c.lineTo(w, h);
        c.lineTo(0, h);
        c.fill();
        for (const d of world.decor)
          drawDecor(c, { ...d, scale: d.scale * 0.45 }, w, h, 0);
        for (const f of world.fish.slice(0, 15))
          drawFish(c, f, f.x * w, f.y * h, 0.45, 0);
      } else if (animal || fish) {
        const f = fish ?? { ...makeFish(animal!, true), seed: 50 };
        const lateSpecies = [
          "pearl_gourami",
          "rainbowfish",
          "ghostknife",
          "regal_angelfish",
          "achilles_tang",
          "zebra_shark",
        ].includes(f.species);
        const longTail = ["ghostknife", "zebra_shark"].includes(f.species);
        drawFish(
          c,
          f,
          longTail ? w * 0.4 : w / 2,
          lateSpecies ? h / 2 : h / 2 + 3,
          Math.min(
            1,
            w / (longTail ? 145 : lateSpecies ? 110 : 95),
            h / (lateSpecies ? 100 : 85),
          ),
          0,
        );
      } else if (decor)
        drawDecor(
          c,
          {
            id: "",
            kind: decor,
            x: 0.5,
            y: 0.88,
            scale: Math.min(0.65, h / 130),
            flip: false,
            layer: 0,
          },
          w,
          h,
          0,
        );
    };
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(el);
    return () => observer.disconnect();
  }, [animal, fish, decor, world]);
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
