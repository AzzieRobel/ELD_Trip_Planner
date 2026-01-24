type DutyStatus = "off_duty" | "sleeper" | "driving" | "on_duty";

type Segment = {
  start: number;
  end: number;
  status: DutyStatus;
};

type Props = {
  day: number;
  segments: Segment[];
  driverName?: string;
};

const WIDTH = 720;
const HEIGHT = 280;
const HOUR_WIDTH = 30;
const LEFT_MARGIN = 90;
const RIGHT_MARGIN = 90;

/* duty rows */
const ROW_Y: Record<DutyStatus, number> = {
  off_duty: 60,
  sleeper: 90,
  driving: 120,
  on_duty: 150
};

/* signature row geometry (THIS IS THE FIX) */
const SIGN_TOP = 180;
const SIGN_MID = 220;

function buildPath(segments: Segment[]) {
  let d = "";
  let lastY = ROW_Y[segments[0].status];

  d += `M ${LEFT_MARGIN + segments[0].start * HOUR_WIDTH} ${lastY}`;

  segments.forEach(seg => {
    const x1 = LEFT_MARGIN + seg.start * HOUR_WIDTH;
    const x2 = LEFT_MARGIN + seg.end * HOUR_WIDTH;
    const y = ROW_Y[seg.status];

    d += ` L ${x1} ${lastY}`;
    d += ` L ${x1} ${y}`;
    d += ` L ${x2} ${y}`;

    lastY = y;
  });

  return d;
}

function calcTotals(segments: Segment[]) {
  const totals = { off_duty: 0, sleeper: 0, driving: 0, on_duty: 0 };
  segments.forEach(s => (totals[s.status] += s.end - s.start));
  return totals;
}

export default function ELDLogSheet({
  day,
  segments,
  driverName = "AUTO SIGNED"
}: Props) {
  const totals = calcTotals(segments);

  return (
    <div>
      <h3>Day {day}</h3>

      <svg
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH + LEFT_MARGIN + RIGHT_MARGIN} ${HEIGHT}`}
        className="p-1"
      >
        {/* VERTICAL BORDERS */}
        <line x1={LEFT_MARGIN} y1={30} x2={LEFT_MARGIN} y2={180} stroke="#000" />
        <line x1={LEFT_MARGIN + WIDTH} y1={30} x2={LEFT_MARGIN + WIDTH} y2={180} stroke="#000" />

        {/* GRID – STOP BEFORE SIGNATURE */}
        {Array.from({ length: 96 }).map((_, i) => (
          <line
            key={i}
            x1={LEFT_MARGIN + (i * HOUR_WIDTH) / 4}
            y1={30}
            x2={LEFT_MARGIN + (i * HOUR_WIDTH) / 4}
            y2={SIGN_TOP}
            stroke="#ddd"
            strokeWidth={i % 4 === 0 ? 1 : 0.5}
          />
        ))}

        {/* DUTY ROW LINES */}
        <line key={0} x1={LEFT_MARGIN} y1={30} x2={LEFT_MARGIN + WIDTH} y2={30} stroke="#000" />
        <line key={0} x1={LEFT_MARGIN} y1={180} x2={LEFT_MARGIN + WIDTH} y2={180} stroke="#000" />
        {Object.values(ROW_Y).map(y => (
          <line key={y} x1={LEFT_MARGIN} y1={y} x2={LEFT_MARGIN + WIDTH} y2={y} stroke="#000" />
        ))}

        {/* HOUR LABELS */}
        {Array.from({ length: 25 }).map((_, i) => (
          <text key={i} x={LEFT_MARGIN + i * HOUR_WIDTH + 2} y={20} fontSize={10}>
            {i}
          </text>
        ))}

        {/* LEFT STATUS LABELS */}
        <text x={10} y={ROW_Y.off_duty + 4} fontSize={11} fontWeight="bold">OFF DUTY</text>
        <text x={10} y={ROW_Y.sleeper + 4} fontSize={11} fontWeight="bold">SLEEPER</text>
        <text x={10} y={ROW_Y.driving + 4} fontSize={11} fontWeight="bold">DRIVING</text>
        <text x={10} y={ROW_Y.on_duty + 4} fontSize={11} fontWeight="bold">ON DUTY</text>

        {/* RIGHT TOTALS */}
        <text x={LEFT_MARGIN + WIDTH + 20} y={ROW_Y.off_duty + 4} fontSize={11}>{totals.off_duty.toFixed(2)}</text>
        <text x={LEFT_MARGIN + WIDTH + 20} y={ROW_Y.sleeper + 4} fontSize={11}>{totals.sleeper.toFixed(2)}</text>
        <text x={LEFT_MARGIN + WIDTH + 20} y={ROW_Y.driving + 4} fontSize={11}>{totals.driving.toFixed(2)}</text>
        <text x={LEFT_MARGIN + WIDTH + 20} y={ROW_Y.on_duty + 4} fontSize={11}>{totals.on_duty.toFixed(2)}</text>

        {/* DUTY PATH */}
        <path d={buildPath(segments)} fill="none" stroke="#000" strokeWidth={2} />

        {/* SIGNATURE LABEL — LEFT OF DIVIDER (FIXED) */}
        <text x={90} y={SIGN_MID} fontSize={16} fontWeight="bold">
          Driver Signature:
        </text>

        {/* AUTO SIGN TEXT — NEVER CROSSES DIVIDER */}
        <text x={LEFT_MARGIN + 140} y={SIGN_MID} fontSize={12}>
          {driverName}
        </text>
      </svg>
    </div>
  );
}
