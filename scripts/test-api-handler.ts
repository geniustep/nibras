import { POST } from "../src/app/api/applications/route";

async function run() {
  const emptyReq = new Request("http://localhost/api/applications", {
    method: "POST",
    body: new FormData(),
  });
  const emptyRes = await POST(emptyReq);
  const emptyBody = await emptyRes.json();
  console.log(
    emptyRes.status === 400 && emptyBody.errors
      ? "[PASS] POST فارغ → 400 + errors"
      : `[FAIL] POST فارغ → ${emptyRes.status} ${JSON.stringify(emptyBody)}`
  );

  const fd = new FormData();
  fd.set("studentFirstName", "يوسف");
  fd.set("studentLastName", "العلوي");
  fd.set("studentDateOfBirth", "2015-06-15");
  fd.set("studentGender", "MALE");
  fd.set("parentFullName", "أحمد العلوي");
  fd.set("parentPhone", "0612345678");
  fd.set("schoolCycle", "PRIMARY");
  fd.set("schoolLevel", "PRIMARY_1");
  fd.set("needsTransport", "false");
  fd.set("needsCanteen", "false");
  fd.set("referralSource", "WEBSITE");

  const validReq = new Request("http://localhost/api/applications", {
    method: "POST",
    body: fd,
  });
  const validRes = await POST(validReq);
  const validBody = await validRes.json();

  if (!process.env.DATABASE_URL) {
    console.log(
      validRes.status === 500
        ? "[SKIP] POST صالح → 500 (لا DATABASE_URL — متوقع محلياً)"
        : `[INFO] POST صالح → ${validRes.status} ${JSON.stringify(validBody)}`
    );
  } else if (validRes.status === 200 && validBody.trackingNumber) {
    console.log(`[PASS] POST صالح → 200 tracking=${validBody.trackingNumber}`);
  } else {
    console.log(`[FAIL] POST صالح → ${validRes.status} ${JSON.stringify(validBody)}`);
  }
}

run().catch((e) => {
  console.error("[FAIL]", e);
  process.exit(1);
});
