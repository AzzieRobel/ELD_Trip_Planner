type Segment = {
    start: number;
    end: number;
    status: "driving" | "on_duty" | "off_duty";
};

type Props = {
    day: number;
    segments: Segment[];
};

const ROW_Y = {
    off_duty: 20,
    on_duty: 60,
    driving: 100
};

const ROW_COLOR = {
    off_duty: "#9CA3AF",
    on_duty: "#F59E0B",
    driving: "#10B981"
};

function ELDLogSheet({ day, segments }: Props) {
    const width = 720;   // 24 hours * 30px
    const hourWidth = 30;

    return (
        <div style={{ marginBottom: "30px" }}>
            <h3>Day {day}</h3>

            <svg width={width} height={140} style={{ border: "1px solid #ccc" }}>
                {/* Hour grid */}
                {Array.from({ length: 25 }).map((_, i) => (
                    <line
                        key={i}
                        x1={i * hourWidth}
                        y1={0}
                        x2={i * hourWidth}
                        y2={140}
                        stroke="#e5e7eb"
                    />
                ))}

                {/* Rows */}
                <text x={5} y={30} fontSize={10}>Off</text>
                <text x={5} y={70} fontSize={10}>On</text>
                <text x={5} y={110} fontSize={10}>Drive</text>

                {/* Segments */}
                {segments.map((seg, idx) => (
                    <rect
                        key={idx}
                        x={seg.start * hourWidth}
                        y={ROW_Y[seg.status]}
                        width={(seg.end - seg.start) * hourWidth}
                        height={20}
                        fill={ROW_COLOR[seg.status]}
                    />
                ))}
            </svg>
        </div>
    );
}

export default ELDLogSheet;
