/**
 * Seed script — populates MongoDB and ClickHouse with sample data.
 * Run with:  npm run seed
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db';
import { getClickHouseClient, initClickHouse } from './config/clickhouse';
import Worker from './models/Worker';
import Participant from './models/Participant';
import Shift from './models/Shift';
import Link from './models/Link';

// ─── Sample data (mirrors shift-scheduling.html) ──────────────────────────────

const workerSeed = [
  { name: 'Sarah Mitchell',  avatar: 'SM', color: '#3B82F6', skills: ['Personal Care', 'Medication'],           availability: 'Full-time' as const, rating: 4.9 },
  { name: 'James Chen',      avatar: 'JC', color: '#10B981', skills: ['Community Access', 'Transport'],          availability: 'Part-time' as const, rating: 4.7 },
  { name: 'Emma Wilson',     avatar: 'EW', color: '#8B5CF6', skills: ['Personal Care', 'Domestic'],              availability: 'Full-time' as const, rating: 4.8 },
  { name: 'Michael Brown',   avatar: 'MB', color: '#F59E0B', skills: ['Behaviour Support', 'Personal Care'],     availability: 'Casual'    as const, rating: 4.6 },
  { name: 'Lisa Thompson',   avatar: 'LT', color: '#EC4899', skills: ['Nursing', 'Medication'],                  availability: 'Full-time' as const, rating: 5.0 },
];

const participantSeed = [
  { name: 'David Parker',  avatar: 'DP', color: '#0EA5E9', ndisNumber: '431234567', needs: ['Personal Care', 'Medication'],        location: 'Parramatta' },
  { name: 'Sophie Adams',  avatar: 'SA', color: '#14B8A6', ndisNumber: '431234568', needs: ['Community Access', 'Transport'],       location: 'Chatswood'  },
  { name: 'Robert Lee',    avatar: 'RL', color: '#A855F7', ndisNumber: '431234569', needs: ['Personal Care', 'Domestic'],           location: 'Blacktown'  },
  { name: 'Jennifer Wu',   avatar: 'JW', color: '#F97316', ndisNumber: '431234570', needs: ['Behaviour Support'],                   location: 'Sydney CBD' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function byName<T extends { name: string }>(list: T[], name: string): T {
  const found = list.find((x) => x.name === name);
  if (!found) throw new Error(`Seed: "${name}" not found`);
  return found;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  await connectDB();
  await initClickHouse();

  // ── 1. Clear existing data ──────────────────────────────────────────────────
  console.log('🗑  Clearing existing data…');
  await Promise.all([
    Worker.deleteMany({}),
    Participant.deleteMany({}),
    Shift.deleteMany({}),
    Link.deleteMany({}),
  ]);

  // ── 2. Insert Workers ───────────────────────────────────────────────────────
  console.log('👷 Seeding workers…');
  const workers = await Worker.insertMany(workerSeed);

  // ── 3. Insert Participants ──────────────────────────────────────────────────
  console.log('🧑 Seeding participants…');
  const participants = await Participant.insertMany(participantSeed);

  // ── 4. Build lookup maps ────────────────────────────────────────────────────
  const w = (name: string) => byName(workers, name);
  const p = (name: string) => byName(participants, name);

  // ── 5. Insert Worker–Participant Links ──────────────────────────────────────
  console.log('🔗 Seeding links…');
  await Link.insertMany([
    { workerId: w('Sarah Mitchell')._id,  participantId: p('David Parker')._id,  isPrimary: true  },
    { workerId: w('Sarah Mitchell')._id,  participantId: p('Sophie Adams')._id,  isPrimary: false },
    { workerId: w('Sarah Mitchell')._id,  participantId: p('Robert Lee')._id,    isPrimary: false },
    { workerId: w('James Chen')._id,      participantId: p('Sophie Adams')._id,  isPrimary: true  },
    { workerId: w('James Chen')._id,      participantId: p('Jennifer Wu')._id,   isPrimary: false },
    { workerId: w('Emma Wilson')._id,     participantId: p('David Parker')._id,  isPrimary: false },
    { workerId: w('Emma Wilson')._id,     participantId: p('Robert Lee')._id,    isPrimary: true  },
    { workerId: w('Michael Brown')._id,   participantId: p('Robert Lee')._id,    isPrimary: false },
    { workerId: w('Michael Brown')._id,   participantId: p('Jennifer Wu')._id,   isPrimary: true  },
    { workerId: w('Lisa Thompson')._id,   participantId: p('David Parker')._id,  isPrimary: false },
  ]);

  // ── 6. Insert Shifts (MongoDB) ──────────────────────────────────────────────
  console.log('📅 Seeding shifts…');
  const shiftData = [
    // ── Week 1: Mon 9 Mar – Sun 15 Mar ───────────────────────────────────────
    { workerId: w('Sarah Mitchell')._id,  participantId: p('David Parker')._id,  date: '2026-03-09', startTime: '08:00', endTime: '12:00', serviceType: 'Personal Care',     status: 'confirmed' },
    { workerId: w('Sarah Mitchell')._id,  participantId: p('Robert Lee')._id,    date: '2026-03-09', startTime: '13:00', endTime: '17:00', serviceType: 'Personal Care',     status: 'confirmed' },
    { workerId: w('James Chen')._id,      participantId: p('Sophie Adams')._id,  date: '2026-03-09', startTime: '09:00', endTime: '15:00', serviceType: 'Community Access',  status: 'pending'   },
    { workerId: w('Emma Wilson')._id,     participantId: p('David Parker')._id,  date: '2026-03-10', startTime: '08:00', endTime: '12:00', serviceType: 'Personal Care',     status: 'confirmed' },
    { workerId: w('Emma Wilson')._id,     participantId: p('Robert Lee')._id,    date: '2026-03-10', startTime: '14:00', endTime: '18:00', serviceType: 'Domestic',          status: 'confirmed' },
    { workerId: w('Michael Brown')._id,   participantId: p('Jennifer Wu')._id,   date: '2026-03-10', startTime: '10:00', endTime: '14:00', serviceType: 'Behaviour Support', status: 'pending'   },
    { workerId: w('Lisa Thompson')._id,   participantId: p('David Parker')._id,  date: '2026-03-11', startTime: '07:00', endTime: '11:00', serviceType: 'Medication',        status: 'confirmed' },
    { workerId: w('James Chen')._id,      participantId: p('Jennifer Wu')._id,   date: '2026-03-11', startTime: '13:00', endTime: '17:00', serviceType: 'Transport',         status: 'confirmed' },
    { workerId: w('Sarah Mitchell')._id,  participantId: p('Sophie Adams')._id,  date: '2026-03-12', startTime: '09:00', endTime: '13:00', serviceType: 'Personal Care',     status: 'pending'   },
    { workerId: w('Michael Brown')._id,   participantId: p('Robert Lee')._id,    date: '2026-03-12', startTime: '14:00', endTime: '18:00', serviceType: 'Behaviour Support', status: 'confirmed' },
    { workerId: w('Emma Wilson')._id,     participantId: p('Sophie Adams')._id,  date: '2026-03-13', startTime: '10:00', endTime: '14:00', serviceType: 'Community Access',  status: 'confirmed' },
    { workerId: w('Lisa Thompson')._id,   participantId: p('David Parker')._id,  date: '2026-03-14', startTime: '08:00', endTime: '16:00', serviceType: 'Medication',        status: 'pending'   },
    { workerId: w('James Chen')._id,      participantId: p('Sophie Adams')._id,  date: '2026-03-15', startTime: '09:00', endTime: '13:00', serviceType: 'Community Access',  status: 'confirmed' },

    // ── Week 2: Mon 16 Mar – Sun 22 Mar ──────────────────────────────────────
    { workerId: w('Sarah Mitchell')._id,  participantId: p('David Parker')._id,  date: '2026-03-16', startTime: '08:00', endTime: '12:00', serviceType: 'Personal Care',     status: 'confirmed' },
    { workerId: w('Sarah Mitchell')._id,  participantId: p('Robert Lee')._id,    date: '2026-03-16', startTime: '13:00', endTime: '17:00', serviceType: 'Personal Care',     status: 'confirmed' },
    { workerId: w('James Chen')._id,      participantId: p('Sophie Adams')._id,  date: '2026-03-16', startTime: '09:00', endTime: '15:00', serviceType: 'Community Access',  status: 'pending'   },
    { workerId: w('Emma Wilson')._id,     participantId: p('David Parker')._id,  date: '2026-03-17', startTime: '08:00', endTime: '12:00', serviceType: 'Personal Care',     status: 'confirmed' },
    { workerId: w('Emma Wilson')._id,     participantId: p('Robert Lee')._id,    date: '2026-03-17', startTime: '14:00', endTime: '18:00', serviceType: 'Domestic',          status: 'confirmed' },
    { workerId: w('Michael Brown')._id,   participantId: p('Jennifer Wu')._id,   date: '2026-03-17', startTime: '10:00', endTime: '14:00', serviceType: 'Behaviour Support', status: 'pending'   },
    { workerId: w('Lisa Thompson')._id,   participantId: p('David Parker')._id,  date: '2026-03-18', startTime: '07:00', endTime: '11:00', serviceType: 'Medication',        status: 'confirmed' },
    { workerId: w('James Chen')._id,      participantId: p('Jennifer Wu')._id,   date: '2026-03-18', startTime: '13:00', endTime: '17:00', serviceType: 'Transport',         status: 'confirmed' },
    { workerId: w('Sarah Mitchell')._id,  participantId: p('Sophie Adams')._id,  date: '2026-03-19', startTime: '09:00', endTime: '13:00', serviceType: 'Personal Care',     status: 'pending'   },
    { workerId: w('Michael Brown')._id,   participantId: p('Robert Lee')._id,    date: '2026-03-19', startTime: '14:00', endTime: '18:00', serviceType: 'Behaviour Support', status: 'confirmed' },
    { workerId: w('Lisa Thompson')._id,   participantId: p('Sophie Adams')._id,  date: '2026-03-20', startTime: '08:00', endTime: '12:00', serviceType: 'Medication',        status: 'confirmed' },
    { workerId: w('Emma Wilson')._id,     participantId: p('Jennifer Wu')._id,   date: '2026-03-20', startTime: '13:00', endTime: '17:00', serviceType: 'Domestic',          status: 'pending'   },
    { workerId: w('James Chen')._id,      participantId: p('Sophie Adams')._id,  date: '2026-03-21', startTime: '09:00', endTime: '15:00', serviceType: 'Community Access',  status: 'confirmed' },
    { workerId: w('Michael Brown')._id,   participantId: p('Jennifer Wu')._id,   date: '2026-03-22', startTime: '10:00', endTime: '14:00', serviceType: 'Behaviour Support', status: 'pending'   },

    // ── Week 3: Mon 23 Mar – Fri 28 Mar ──────────────────────────────────────
    { workerId: w('Sarah Mitchell')._id,  participantId: p('David Parker')._id,  date: '2026-03-23', startTime: '08:00', endTime: '12:00', serviceType: 'Personal Care',     status: 'confirmed' },
    { workerId: w('Emma Wilson')._id,     participantId: p('Robert Lee')._id,    date: '2026-03-23', startTime: '13:00', endTime: '17:00', serviceType: 'Domestic',          status: 'confirmed' },
    { workerId: w('James Chen')._id,      participantId: p('Sophie Adams')._id,  date: '2026-03-24', startTime: '09:00', endTime: '13:00', serviceType: 'Community Access',  status: 'pending'   },
    { workerId: w('Lisa Thompson')._id,   participantId: p('David Parker')._id,  date: '2026-03-24', startTime: '14:00', endTime: '18:00', serviceType: 'Medication',        status: 'confirmed' },
    { workerId: w('Michael Brown')._id,   participantId: p('Jennifer Wu')._id,   date: '2026-03-25', startTime: '10:00', endTime: '14:00', serviceType: 'Behaviour Support', status: 'confirmed' },
    { workerId: w('Sarah Mitchell')._id,  participantId: p('Sophie Adams')._id,  date: '2026-03-25', startTime: '08:00', endTime: '12:00', serviceType: 'Personal Care',     status: 'pending'   },
    { workerId: w('Emma Wilson')._id,     participantId: p('David Parker')._id,  date: '2026-03-26', startTime: '09:00', endTime: '13:00', serviceType: 'Personal Care',     status: 'confirmed' },
    { workerId: w('James Chen')._id,      participantId: p('Jennifer Wu')._id,   date: '2026-03-26', startTime: '13:00', endTime: '17:00', serviceType: 'Transport',         status: 'confirmed' },
    { workerId: w('Lisa Thompson')._id,   participantId: p('Sophie Adams')._id,  date: '2026-03-27', startTime: '07:00', endTime: '11:00', serviceType: 'Medication',        status: 'pending'   },
    { workerId: w('Michael Brown')._id,   participantId: p('Robert Lee')._id,    date: '2026-03-27', startTime: '14:00', endTime: '18:00', serviceType: 'Behaviour Support', status: 'confirmed' },
    { workerId: w('Sarah Mitchell')._id,  participantId: p('David Parker')._id,  date: '2026-03-28', startTime: '08:00', endTime: '16:00', serviceType: 'Personal Care',     status: 'confirmed' },
    { workerId: w('Emma Wilson')._id,     participantId: p('Robert Lee')._id,    date: '2026-03-28', startTime: '09:00', endTime: '13:00', serviceType: 'Domestic',          status: 'pending'   },
  ];

  const shifts = await Shift.insertMany(shiftData);

  // ── 7. Seed ClickHouse logs for every inserted shift ───────────────────────
  console.log('📊 Seeding ClickHouse logs…');
  const ch = getClickHouseClient();

  const logRows = shifts.map((s, i) => {
    const workerDoc  = workers.find((wk) => wk._id.equals(s.workerId))!;
    const partDoc    = participants.find((pt) => pt._id.equals(s.participantId))!;
    const actions    = ['CREATE', 'UPDATE', 'STATUS_CHANGE'];
    return {
      action:           actions[i % actions.length],
      shift_id:         String(s._id),
      worker_id:        String(s.workerId),
      worker_name:      workerDoc.name,
      participant_id:   String(s.participantId),
      participant_name: partDoc.name,
      shift_date:       s.date,
      start_time:       s.startTime,
      end_time:         s.endTime,
      service_type:     s.serviceType,
      status:           s.status,
      performed_by:     'seed-script',
    };
  });

  await ch.insert({ table: 'shift_logs', values: logRows, format: 'JSONEachRow' });

  // ── 8. Summary ──────────────────────────────────────────────────────────────
  console.log('\n✅ Seed complete!');
  console.log(`   Workers:      ${workers.length}`);
  console.log(`   Participants: ${participants.length}`);
  console.log(`   Shifts:       ${shifts.length}`);
  console.log(`   CH log rows:  ${logRows.length}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
