import { useEffect, useRef, useState, type RefObject } from "react";

interface Props {
  scrollRef: RefObject<HTMLElement | null>;
}

/** Custom horizontal scrollbar for the board: a 2px track with a draggable 4px thumb */
const ScrollTrack = ({ scrollRef }: Props) => {
  const [thumb, setThumb] = useState({ left: 0, width: 100 });
  const dragRef = useRef<{ startX: number; startScroll: number } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setThumb({
        left: scrollWidth ? (scrollLeft / scrollWidth) * 100 : 0,
        width: scrollWidth ? Math.min(clientWidth / scrollWidth, 1) * 100 : 100,
      });
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    // Watch the board and its content so adding/removing columns resizes the thumb
    const observer = new ResizeObserver(update);
    observer.observe(el);
    Array.from(el.children).forEach((child) => observer.observe(child));

    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [scrollRef]);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startScroll: el.scrollLeft };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track || !dragRef.current) return;
    const ratio = el.scrollWidth / track.clientWidth;
    el.scrollLeft =
      dragRef.current.startScroll + (e.clientX - dragRef.current.startX) * ratio;
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div ref={trackRef} className="relative mb-5.5 h-0.5 shrink-0 bg-hud-line">
      {thumb.width < 100 && (
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          // The visible thumb is 4px; the padding gives a bigger grab area
          className="absolute -top-2.25 cursor-grab touch-none py-2 active:cursor-grabbing"
          style={{ left: `${thumb.left}%`, width: `${thumb.width}%` }}
        >
          <div className="h-1 bg-hud-accent" />
        </div>
      )}
    </div>
  );
};

export default ScrollTrack;
