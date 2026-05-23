import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { AuthAdmin } from "../src/lib/admission/admission-permissions";
import {
  canAssignRequest,
  canChangeStatus,
  canModifyRequest,
  canStaffViewRequest,
} from "../src/lib/admission/admission-permissions";

const superAdmin: AuthAdmin = {
  id: "1",
  email: "sa@test.ma",
  name: "SA",
  role: "SUPER_ADMIN",
  status: "ACTIVE",
};

const admin: AuthAdmin = {
  id: "2",
  email: "admin@test.ma",
  name: "Admin",
  role: "ADMIN",
  status: "ACTIVE",
};

const staff: AuthAdmin = {
  id: "3",
  email: "staff@test.ma",
  name: "Staff",
  role: "ADMISSION_STAFF",
  status: "ACTIVE",
};

const viewer: AuthAdmin = {
  id: "4",
  email: "view@test.ma",
  name: "View",
  role: "VIEWER",
  status: "ACTIVE",
};

describe("Phase 4 permissions", () => {
  it("ADMIN can change any request status", () => {
    assert.equal(canChangeStatus(admin, null), true);
    assert.equal(canChangeStatus(admin, "other-id"), true);
  });

  it("VIEWER cannot change status", () => {
    assert.equal(canChangeStatus(viewer, null), false);
  });

  it("ADMISSION_STAFF cannot modify unassigned request", () => {
    assert.equal(canModifyRequest(staff, null), false);
    assert.equal(canChangeStatus(staff, null), false);
  });

  it("ADMISSION_STAFF can modify assigned request", () => {
    assert.equal(canModifyRequest(staff, staff.id), true);
  });

  it("only SUPER_ADMIN and ADMIN can assign", () => {
    assert.equal(canAssignRequest(superAdmin), true);
    assert.equal(canAssignRequest(admin), true);
    assert.equal(canAssignRequest(staff), false);
    assert.equal(canAssignRequest(viewer), false);
  });

  it("VIEWER can view all requests", () => {
    assert.equal(canStaffViewRequest(viewer, null), true);
  });
});

describe("Status separation", () => {
  it("user role labels are not admission statuses", async () => {
    const { ROLE_LABELS } = await import("../src/lib/user-labels");
    const { ADMISSION_STATUS_LABELS } = await import("../src/lib/admission-labels");
    assert.ok(!Object.values(ROLE_LABELS).includes("نشط"));
    assert.equal(ADMISSION_STATUS_LABELS.NEW, "جديد");
    assert.ok(!Object.values(ADMISSION_STATUS_LABELS).includes("Admin"));
  });
});
