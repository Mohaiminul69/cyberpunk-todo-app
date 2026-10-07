import { RARITIES } from "../game";
import type { Rarity } from "../types";

/** Outlined tag; Legendary is a solid fill with dark text */
const RarityTag = ({ rarity }: { rarity: Rarity }) => {
  const { label, color } = RARITIES[rarity];
  const solid = rarity === "legendary";

  return (
    <span
      className="border px-1.5 py-0.5 text-[10px] font-bold tracking-[.12em]"
      style={{
        borderColor: color,
        background: solid ? color : "transparent",
        color: solid ? "var(--color-hud-bg)" : color,
      }}
    >
      {label}
    </span>
  );
};

export default RarityTag;
