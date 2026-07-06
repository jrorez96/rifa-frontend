import { Grid, useGridRef } from 'react-window';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

const COLUMNS_DESKTOP = 20;
const COLUMNS_MOBILE = 8;

function statusClasses(status, isSelected) {
  if (status === 'sold') {
    return 'bg-[var(--color-sold)] text-[var(--color-sold-text)] cursor-not-allowed border-transparent';
  }
  if (status === 'reserved') {
    return 'bg-[var(--color-reserved)] text-[var(--color-reserved-text)] cursor-not-allowed border-transparent';
  }
  if (isSelected) {
    return 'bg-[var(--color-gold-bright)] text-[var(--color-void)] border-transparent font-bold scale-95';
  }
  return 'bg-[var(--color-card)] text-[var(--color-ink)] border border-dashed border-[var(--color-available-border)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold-bright)]';
}

function Cell({ columnIndex, rowIndex, style, columns, numbers, selected, toggle }) {
  const idx = rowIndex * columns + columnIndex;
  if (idx >= 10000) return <div style={style} />;

  const num = String(idx).padStart(4, '0');
  const status = numbers[num] || 'available';
  const isSelected = selected.has(num);

  return (
    <div style={style} className="p-[3px]">
      <button
        type="button"
        disabled={status !== 'available'}
        onClick={() => toggle(num)}
        aria-pressed={isSelected}
        aria-label={`Número ${num}, ${status === 'available' ? 'disponible' : status === 'reserved' ? 'reservado' : 'vendido'}`}
        className={`ticket-stub font-ticket text-[13px] w-full h-full rounded-sm flex items-center justify-center transition-transform duration-100 ${statusClasses(status, isSelected)}`}
      >
        {num}
      </button>
    </div>
  );
}

const NumberGrid = forwardRef(function NumberGrid({ numbers, selected, toggle }, ref) {
  const containerRef = useRef(null);
  const gridRef = useGridRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function measure() {
      if (containerRef.current) setWidth(containerRef.current.offsetWidth);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const columns = width < 640 ? COLUMNS_MOBILE : COLUMNS_DESKTOP;
  const cellSize = width > 0 ? Math.floor(width / columns) : 0;
  const rows = Math.ceil(10000 / columns);
  const gridHeight = Math.min(rows * cellSize, 640) || 640;

  // Permite que el padre (Home.jsx) le pida "salta al número X"
  // desde los botones de rango, sin exponer toda la Grid interna.
  useImperativeHandle(ref, () => ({
    scrollToNumber(numStr) {
      const idx = Number(numStr);
      if (Number.isNaN(idx) || !gridRef.current) return;
      const rowIndex = Math.floor(idx / columns);
      gridRef.current.scrollToRow({ index: rowIndex, align: 'start', behavior: 'smooth' });
    }
  }), [columns, gridRef]);

  return (
    <div ref={containerRef} className="w-full">
      {width > 0 && (
        <Grid
          gridRef={gridRef}
          cellComponent={Cell}
          cellProps={{ columns, numbers, selected, toggle }}
          columnCount={columns}
          columnWidth={cellSize}
          rowCount={rows}
          rowHeight={cellSize}
          style={{ width: '100%', height: gridHeight }}
        />
      )}
    </div>
  );
});

export default NumberGrid;
