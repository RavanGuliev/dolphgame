export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { game, user_id, server_id, charname } = body;

  if (!game || !user_id) {
    throw createError({ statusCode: 400, message: "game və user_id tələb olunur" });
  }

  const res = await fetch("https://api.g2bulk.com/v1/games/checkPlayerId", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ game, user_id, server_id, charname }),
  });

  if (!res.ok) {
    throw createError({ statusCode: res.status, message: "G2Bulk API xətası" });
  }

  return res.json();
});
