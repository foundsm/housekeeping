'use client';

import { useMemo, useState } from 'react';

type RoomType = 'King' | 'Queen' | 'Double' | 'Suite' | 'Bunk';
type Room = {
  id: string;
  room: string;
  type: RoomType;
  sf: number;
  lateCheckout: string;
  notes: string;
  linen: boolean;
  dnd: boolean;
};

type Board = {
  id: string;
  name: string;
  departures: Room[];
  stayovers: Room[];
};

const ROOM_TYPE_SF: Record<RoomType, number> = {
  King: 300,
  Queen: 320,
  Double: 340,
  Suite: 450,
  Bunk: 360
};

const SAMPLE_DEPARTURES: Room[] = [
  { id: 'd1', room: '101', type: 'King', sf: 300, lateCheckout: '', notes: 'VIP arrival', linen: false, dnd: false },
  { id: 'd2', room: '104', type: 'Queen', sf: 320, lateCheckout: '12:00 PM', notes: 'Late check-out', linen: false, dnd: false },
  { id: 'd3', room: '108', type: 'Suite', sf: 450, lateCheckout: '', notes: 'Deep clean check', linen: false, dnd: false },
  { id: 'd4', room: '112', type: 'Double', sf: 340, lateCheckout: '', notes: '', linen: false, dnd: false },
  { id: 'd5', room: '215', type: 'King', sf: 300, lateCheckout: '', notes: '', linen: false, dnd: false },
  { id: 'd6', room: '220', type: 'Bunk', sf: 360, lateCheckout: '', notes: '', linen: false, dnd: false },
  { id: 'd7', room: '302', type: 'Queen', sf: 320, lateCheckout: '', notes: '', linen: false, dnd: false },
  { id: 'd8', room: '306', type: 'King', sf: 300, lateCheckout: '1:00 PM', notes: 'Late check-out', linen: false, dnd: false }
];

const SAMPLE_STAYOVERS: Room[] = [
  { id: 's1', room: '103', type: 'King', sf: 300, lateCheckout: '', notes: '', linen: true, dnd: false },
  { id: 's2', room: '106', type: 'Queen', sf: 320, lateCheckout: '', notes: 'Extra towels', linen: false, dnd: false },
  { id: 's3', room: '109', type: 'Double', sf: 340, lateCheckout: '', notes: '', linen: true, dnd: false },
  { id: 's4', room: '114', type: 'King', sf: 300, lateCheckout: '', notes: 'DND until 2 PM', linen: false, dnd: true },
  { id: 's5', room: '210', type: 'Queen', sf: 320, lateCheckout: '', notes: '', linen: false, dnd: false },
  { id: 's6', room: '214', type: 'Suite', sf: 450, lateCheckout: '', notes: '', linen: true, dnd: false },
  { id: 's7', room: '218', type: 'King', sf: 300, lateCheckout: '', notes: '', linen: false, dnd: false },
  { id: 's8', room: '304', type: 'Double', sf: 340, lateCheckout: '', notes: 'Baby crib', linen: true, dnd: false },
  { id: 's9', room: '309', type: 'Queen', sf: 320, lateCheckout: '', notes: '', linen: false, dnd: false },
  { id: 's10', room: '315', type: 'King', sf: 300, lateCheckout: '', notes: '', linen: true, dnd: false }
];

function createBoards(count: number): Board[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `board-${i + 1}`,
    name: `Board ${i + 1}`,
    departures: [],
    stayovers: []
  }));
}

function getBoardStats(board: Board) {
  const departuresSf = board.departures.reduce((sum, room) => sum + room.sf, 0);
  const stayoversSf = board.stayovers.reduce((sum, room) => sum + room.sf, 0);
  return {
    totalRooms: board.departures.length + board.stayovers.length,
    departures: board.departures.length,
    stayovers: board.stayovers.length,
    totalSf: departuresSf + stayoversSf
  };
}

function newRoom(prefix: string): Room {
  return {
    id: `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    room: '',
    type: 'King',
    sf: ROOM_TYPE_SF.King,
    lateCheckout: '',
    notes: '',
    linen: false,
    dnd: false
  };
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<'setup' | 'rooms' | 'assignments' | 'boards'>('setup');
  const [hotelName, setHotelName] = useState('FOUND Hotel Santa Monica');
  const [businessDate, setBusinessDate] = useState('2026-04-05');
  const [attendantCount, setAttendantCount] = useState(4);
  const [departureCap, setDepartureCap] = useState(6);
  const [maxSf, setMaxSf] = useState(3500);
  const [floatEnabled, setFloatEnabled] = useState(true);
  const [boards, setBoards] = useState<Board[]>(createBoards(4));
  const [floatBoard, setFloatBoard] = useState<Board>({ id: 'float', name: 'Float Board', departures: [], stayovers: [] });
  const [departures, setDepartures] = useState<Room[]>(SAMPLE_DEPARTURES);
  const [stayovers, setStayovers] = useState<Room[]>(SAMPLE_STAYOVERS);

  const dndRooms = useMemo(() => stayovers.filter((room) => room.dnd), [stayovers]);
  const activeStayovers = useMemo(() => stayovers.filter((room) => !room.dnd), [stayovers]);

  const totals = useMemo(() => {
    const boardSf = boards.reduce((sum, board) => sum + getBoardStats(board).totalSf, 0);
    return {
      totalDepartures: departures.length,
      totalStayovers: activeStayovers.length,
      totalDnd: dndRooms.length,
      totalFloat: floatBoard.departures.length + floatBoard.stayovers.length,
      totalAssigned:
        boards.reduce((sum, board) => sum + board.departures.length + board.stayovers.length, 0) +
        floatBoard.departures.length +
        floatBoard.stayovers.length,
      averageSf: boards.length ? Math.round(boardSf / boards.length) : 0
    };
  }, [activeStayovers, boards, departures.length, dndRooms.length, floatBoard.departures.length, floatBoard.stayovers.length]);

  function createTodayBoards() {
    setBoards(createBoards(attendantCount));
    setFloatBoard({ id: 'float', name: 'Float Board', departures: [], stayovers: [] });
  }

  function resetBoards() {
    setBoards((prev) => prev.map((board, i) => ({ ...board, name: `Board ${i + 1}`, departures: [], stayovers: [] })));
    setFloatBoard({ id: 'float', name: 'Float Board', departures: [], stayovers: [] });
  }

  function assignDepartures() {
    const freshBoards = createBoards(attendantCount).map((board, index) => ({
      ...board,
      name: boards[index]?.name || `Board ${index + 1}`
    }));
    const nextFloat: Board = { id: 'float', name: 'Float Board', departures: [], stayovers: [] };
    const sorted = [...departures].sort((a, b) => b.sf - a.sf);

    sorted.forEach((room) => {
      let chosen = -1;
      let lowestSf = Number.POSITIVE_INFINITY;

      freshBoards.forEach((board, index) => {
        const stats = getBoardStats(board);
        const withinDepartureCap = stats.departures < departureCap;
        const withinSf = stats.totalSf + room.sf <= maxSf;
        if (withinDepartureCap && withinSf && stats.totalSf < lowestSf) {
          lowestSf = stats.totalSf;
          chosen = index;
        }
      });

      if (chosen >= 0) {
        freshBoards[chosen].departures.push(room);
      } else if (floatEnabled) {
        nextFloat.departures.push(room);
      }
    });

    setBoards(freshBoards);
    setFloatBoard(nextFloat);
    setActiveTab('boards');
  }

  function assignStayovers() {
    const updatedBoards = boards.map((board) => ({ ...board, departures: [...board.departures], stayovers: [] }));
    const nextFloat = { ...floatBoard, departures: [...floatBoard.departures], stayovers: [] };
    const sorted = [...activeStayovers].sort((a, b) => b.sf - a.sf);

    sorted.forEach((room) => {
      let chosen = -1;
      let lowestSf = Number.POSITIVE_INFINITY;
      updatedBoards.forEach((board, index) => {
        const stats = getBoardStats(board);
        const withinSf = stats.totalSf + room.sf <= maxSf;
        if (withinSf && stats.totalSf < lowestSf) {
          lowestSf = stats.totalSf;
          chosen = index;
        }
      });
      if (chosen >= 0) {
        updatedBoards[chosen].stayovers.push(room);
      } else if (floatEnabled) {
        nextFloat.stayovers.push(room);
      }
    });

    setBoards(updatedBoards);
    setFloatBoard(nextFloat);
    setActiveTab('boards');
  }

  function updateRoom(kind: 'departure' | 'stayover', id: string, field: keyof Room, value: string | boolean | number) {
    const setter = kind === 'departure' ? setDepartures : setStayovers;
    setter((prev) =>
      prev.map((room) => {
        if (room.id !== id) return room;
        if (field === 'type') {
          const nextType = value as RoomType;
          return { ...room, type: nextType, sf: ROOM_TYPE_SF[nextType] };
        }
        return { ...room, [field]: value } as Room;
      })
    );
  }

  function renderRoomTable(kind: 'departure' | 'stayover', data: Room[], title: string) {
    return (
      <section className="panel">
        <div className="panel-header-row">
          <h3>{title}</h3>
          <button className="secondary-btn" onClick={() => (kind === 'departure' ? setDepartures((prev) => [...prev, newRoom('d')]) : setStayovers((prev) => [...prev, newRoom('s')]))}>
            Add room
          </button>
        </div>
        <div className="table-wrap">
          <table className="room-table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th>
                <th>SF</th>
                <th>Late CO</th>
                <th>Notes</th>
                <th>Linen</th>
                <th>DND</th>
              </tr>
            </thead>
            <tbody>
              {data.map((room) => (
                <tr key={room.id}>
                  <td><input value={room.room} onChange={(e) => updateRoom(kind, room.id, 'room', e.target.value)} /></td>
                  <td>
                    <select value={room.type} onChange={(e) => updateRoom(kind, room.id, 'type', e.target.value as RoomType)}>
                      {Object.keys(ROOM_TYPE_SF).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </td>
                  <td><input type="number" value={room.sf} onChange={(e) => updateRoom(kind, room.id, 'sf', Number(e.target.value) || 0)} /></td>
                  <td><input value={room.lateCheckout} onChange={(e) => updateRoom(kind, room.id, 'lateCheckout', e.target.value)} /></td>
                  <td><input value={room.notes} onChange={(e) => updateRoom(kind, room.id, 'notes', e.target.value)} /></td>
                  <td className="center-cell"><input type="checkbox" checked={room.linen} onChange={(e) => updateRoom(kind, room.id, 'linen', e.target.checked)} /></td>
                  <td className="center-cell"><input type="checkbox" checked={room.dnd} disabled={kind === 'departure'} onChange={(e) => updateRoom(kind, room.id, 'dnd', e.target.checked)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <main className="page-shell">
      <header className="hero-card">
        <div>
          <div className="eyebrow">Hotel housekeeping assignment tool</div>
          <h1>Daily board builder</h1>
          <p>Assign departures first, then stayovers, hold DND rooms, and push overflow to Float.</p>
        </div>
        <div className="hero-actions">
          <button className="primary-btn" onClick={createTodayBoards}>Create boards</button>
          <button className="secondary-btn" onClick={resetBoards}>Reset boards</button>
          <button className="secondary-btn" onClick={() => window.print()}>Print</button>
        </div>
      </header>

      <section className="stats-grid">
        <StatCard label="Departures" value={totals.totalDepartures} />
        <StatCard label="Stayovers" value={totals.totalStayovers} />
        <StatCard label="DND" value={totals.totalDnd} />
        <StatCard label="Float rooms" value={totals.totalFloat} />
        <StatCard label="Assigned" value={totals.totalAssigned} />
        <StatCard label="Avg SF / board" value={totals.averageSf} />
      </section>

      <nav className="tabs">
        {(['setup', 'rooms', 'assignments', 'boards'] as const).map((tab) => (
          <button key={tab} className={activeTab === tab ? 'tab active' : 'tab'} onClick={() => setActiveTab(tab)}>
            {tab === 'setup' ? 'Daily Setup' : tab === 'rooms' ? 'Room Input' : tab === 'assignments' ? 'Assignments' : 'Boards'}
          </button>
        ))}
      </nav>

      {activeTab === 'setup' && (
        <section className="two-col">
          <div className="panel">
            <h3>Daily setup</h3>
            <div className="form-grid">
              <label>
                <span>Business date</span>
                <input type="date" value={businessDate} onChange={(e) => setBusinessDate(e.target.value)} />
              </label>
              <label>
                <span>Hotel name</span>
                <input value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
              </label>
              <label>
                <span>Room attendants</span>
                <input type="number" value={attendantCount} onChange={(e) => setAttendantCount(Number(e.target.value) || 1)} />
              </label>
              <label>
                <span>Departure cap per board</span>
                <input type="number" value={departureCap} onChange={(e) => setDepartureCap(Number(e.target.value) || 0)} />
              </label>
              <label>
                <span>Max square footage per board</span>
                <input type="number" value={maxSf} onChange={(e) => setMaxSf(Number(e.target.value) || 0)} />
              </label>
              <label className="checkbox-row">
                <input type="checkbox" checked={floatEnabled} onChange={(e) => setFloatEnabled(e.target.checked)} />
                <span>Enable Float Board</span>
              </label>
            </div>
          </div>
          <div className="panel">
            <h3>How this version works</h3>
            <ul className="plain-list">
              <li>Set attendants and board limits.</li>
              <li>Enter departures and stayovers.</li>
              <li>Assign departures first.</li>
              <li>Assign stayovers after that.</li>
              <li>DND rooms stay off active boards.</li>
              <li>Overflow goes to Float.</li>
            </ul>
            <div className="summary-box">
              <strong>{hotelName}</strong>
              <div>{businessDate}</div>
              <div>{attendantCount} attendant boards</div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'rooms' && (
        <div className="stack-gap">
          {renderRoomTable('departure', departures, 'Departures')}
          {renderRoomTable('stayover', stayovers, 'Stayovers')}
        </div>
      )}

      {activeTab === 'assignments' && (
        <section className="two-col assignments-cols">
          <div className="panel">
            <h3>Assignment controls</h3>
            <div className="button-row">
              <button className="primary-btn" onClick={assignDepartures}>Assign departures</button>
              <button className="primary-btn alt" onClick={assignStayovers}>Assign stayovers</button>
              <button className="secondary-btn" onClick={resetBoards}>Clear assignments</button>
            </div>
            <div className="info-grid">
              <div className="info-box">
                <strong>Current rules</strong>
                <div>Departure cap: {departureCap}</div>
                <div>Max SF per board: {maxSf}</div>
                <div>Float board: {floatEnabled ? 'On' : 'Off'}</div>
              </div>
              <div className="info-box">
                <strong>Manager notes</strong>
                <div>Late check-outs stay visible on the board.</div>
                <div>Linen changes are marked on stayovers.</div>
                <div>DND rooms remain in a hold list.</div>
              </div>
            </div>
          </div>
          <div className="panel">
            <h3>Hold / overflow summary</h3>
            <div className="pill-group-block">
              <div className="subhead">DND hold list</div>
              <div className="pill-group">
                {dndRooms.length ? dndRooms.map((room) => <span key={room.id} className="pill dnd">Room {room.room || '(blank)'}</span>) : <span className="muted">No DND rooms today.</span>}
              </div>
            </div>
            <div className="pill-group-block">
              <div className="subhead">Float board rooms</div>
              <div className="pill-group">
                {floatBoard.departures.map((room) => <span key={room.id} className="pill float">Departure {room.room || '(blank)'}</span>)}
                {floatBoard.stayovers.map((room) => <span key={room.id} className="pill float">Stayover {room.room || '(blank)'}</span>)}
                {!floatBoard.departures.length && !floatBoard.stayovers.length && <span className="muted">No float rooms assigned yet.</span>}
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'boards' && (
        <section className="board-grid">
          {boards.map((board, index) => {
            const stats = getBoardStats(board);
            return (
              <article className="panel board-card" key={board.id}>
                <div className="board-top">
                  <input
                    className="board-name"
                    value={board.name}
                    onChange={(e) => setBoards((prev) => prev.map((item, i) => (i === index ? { ...item, name: e.target.value } : item)))}
                  />
                  <button className="secondary-btn" onClick={() => window.print()}>Print</button>
                </div>
                <div className="pill-group compact">
                  <span className="pill neutral">Rooms {stats.totalRooms}</span>
                  <span className="pill neutral">Dep {stats.departures}</span>
                  <span className="pill neutral">Stay {stats.stayovers}</span>
                  <span className="pill neutral">SF {stats.totalSf}</span>
                </div>
                <div className="board-sections">
                  <div className="board-block dep-block">
                    <div className="subhead">Departures</div>
                    {board.departures.length ? board.departures.map((room) => (
                      <div className="room-card" key={room.id}>
                        <div className="room-card-top"><strong>Room {room.room || '(blank)'}</strong><span>{room.sf} SF</span></div>
                        <div className="muted-line">{room.type}{room.lateCheckout ? ` - Late CO ${room.lateCheckout}` : ''}</div>
                        {room.notes ? <div className="muted-line">{room.notes}</div> : null}
                      </div>
                    )) : <div className="muted">No departures assigned.</div>}
                  </div>
                  <div className="board-block stay-block">
                    <div className="subhead">Stayovers</div>
                    {board.stayovers.length ? board.stayovers.map((room) => (
                      <div className="room-card" key={room.id}>
                        <div className="room-card-top"><strong>Room {room.room || '(blank)'}</strong><span>{room.sf} SF</span></div>
                        <div className="muted-line">{room.type}{room.linen ? ' - Linen change' : ''}</div>
                        {room.notes ? <div className="muted-line">{room.notes}</div> : null}
                      </div>
                    )) : <div className="muted">No stayovers assigned.</div>}
                  </div>
                </div>
              </article>
            );
          })}

          <article className="panel board-card float-card">
            <div className="board-top">
              <div className="board-title">{floatBoard.name}</div>
              <button className="secondary-btn" onClick={() => window.print()}>Print</button>
            </div>
            <div className="board-sections">
              <div className="board-block float-block">
                <div className="subhead">Float departures</div>
                {floatBoard.departures.length ? floatBoard.departures.map((room) => (
                  <div className="room-card" key={room.id}><div className="room-card-top"><strong>Room {room.room || '(blank)'}</strong><span>{room.sf} SF</span></div></div>
                )) : <div className="muted">No float departures.</div>}
              </div>
              <div className="board-block float-block">
                <div className="subhead">Float stayovers</div>
                {floatBoard.stayovers.length ? floatBoard.stayovers.map((room) => (
                  <div className="room-card" key={room.id}><div className="room-card-top"><strong>Room {room.room || '(blank)'}</strong><span>{room.sf} SF</span></div></div>
                )) : <div className="muted">No float stayovers.</div>}
              </div>
            </div>
          </article>
        </section>
      )}
    </main>
  );
}
