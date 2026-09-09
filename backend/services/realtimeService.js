const streams = new Map();

function subscribe(userId, res) {
  const key = userId.toString();
  if (!streams.has(key)) streams.set(key, new Set());
  streams.get(key).add(res);
  return () => {
    const set = streams.get(key);
    if (!set) return;
    set.delete(res);
    if (!set.size) streams.delete(key);
  };
}

function publish(userIds, event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  [...new Set(userIds.map(String))].forEach((id) => {
    const set = streams.get(id);
    if (!set) return;
    for (const res of set) {
      try { res.write(payload); } catch { set.delete(res); }
    }
  });
}

function heartbeat(res) {
  try { res.write(`: heartbeat ${Date.now()}\n\n`); } catch {}
}

module.exports = { subscribe, publish, heartbeat };
