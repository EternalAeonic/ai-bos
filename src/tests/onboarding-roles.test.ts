import { describe, it, expect, vi, beforeEach } from 'vitest';
import { completeOnboardingAction } from '@/app/actions/onboarding';
import { prisma } from '@/lib/prisma';
import * as getSessionMod from '@/lib/get-session';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    role: {
      count: vi.fn(),
      createMany: vi.fn(),
    },
    business: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    ledgerAccount: {
      count: vi.fn(),
      createMany: vi.fn(),
    },
    department: {
      count: vi.fn(),
      createMany: vi.fn(),
    },
    employee: { count: vi.fn() },
    supplier: { count: vi.fn() },
    customer: { count: vi.fn() },
    businessLocation: { count: vi.fn() },
    businessSettings: { findUnique: vi.fn() },
    aISettings: { findUnique: vi.fn() },
    businessKnowledgeBase: { upsert: vi.fn() },
    auditLog: { create: vi.fn() },
  }
}));

vi.mock('@/lib/get-session', () => ({
  getSession: vi.fn()
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

describe('Onboarding - Roles Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getSessionMod.getSession as any).mockResolvedValue({
      businessId: 'test-business',
      userId: 'test-user'
    });
  });

  it('creates default roles with correct schema during onboarding completion', async () => {
    // Setup mocks so roles don't exist yet
    (prisma.role.count as any).mockResolvedValue(0);
    // Other counts return >0 to skip their createMany branches for focused testing
    (prisma.ledgerAccount.count as any).mockResolvedValue(1);
    (prisma.department.count as any).mockResolvedValue(1);
    
    await completeOnboardingAction();

    // Verify createMany was called
    expect(prisma.role.createMany).toHaveBeenCalledOnce();

    // Inspect the exact argument passed to createMany
    const createManyCall = (prisma.role.createMany as any).mock.calls[0][0];
    const createdRoles = createManyCall.data;

    // Verify it creates the expected number of roles
    expect(createdRoles.length).toBeGreaterThan(0);

    // Verify EVERY role object passed to Prisma strictly matches the expected schema
    createdRoles.forEach((role: any) => {
      // 1. name MUST be a string (This prevents the bug where name was passed as an object)
      expect(typeof role.name).toBe('string');
      // 2. businessId MUST be present
      expect(role.businessId).toBe('test-business');
      // 3. isSystemRole MUST be true for defaults
      expect(role.isSystemRole).toBe(true);
      // 4. permissions MUST be an array/valid json
      expect(Array.isArray(role.permissions)).toBe(true);
      // 5. the object should NOT contain an invalid nested name object
      expect(role.name).not.toBeInstanceOf(Object);
    });

    // Check specific default roles are present
    const roleNames = createdRoles.map((r: any) => r.name);
    expect(roleNames).toContain('Owner');
    expect(roleNames).toContain('Admin');
    expect(roleNames).toContain('Employee');
  });

  it('skips role creation if roles already exist', async () => {
    // Setup mock so roles ALREADY exist
    (prisma.role.count as any).mockResolvedValue(5);
    
    await completeOnboardingAction();

    expect(prisma.role.createMany).not.toHaveBeenCalled();
  });
});
