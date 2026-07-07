import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InventoryIntelligenceService } from '@/modules/business/services/inventory-intelligence-service';
import { prisma } from '@/lib/prisma';

// Mock prisma
vi.mock('@/lib/prisma', () => {
  return {
    prisma: {
      product: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
      supplier: {
        findMany: vi.fn(),
      }
    }
  };
});

describe('Inventory Intelligence Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('determines inventory health accurately', async () => {
    const mockProducts = [
      {
        id: 'p1', reorderLevel: 10,
        movements: [
          { movementType: 'IN', quantity: 50, createdAt: new Date() },
          { movementType: 'OUT', quantity: 45, createdAt: new Date() } // current stock: 5, sold: 45 (Low Stock, Fast Moving)
        ]
      },
      {
        id: 'p2', reorderLevel: 5,
        movements: [
          { movementType: 'IN', quantity: 100, createdAt: new Date() },
          { movementType: 'OUT', quantity: 2, createdAt: new Date() } // current stock: 98, sold: 2 (Overstock, Slow Moving)
        ]
      },
      {
        id: 'p3', reorderLevel: 5,
        movements: [
          { movementType: 'IN', quantity: 20, createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000) } 
          // current stock: 20, sold last 30 days: 0 (Dead Stock)
        ]
      }
    ];

    (prisma.product.findMany as any).mockResolvedValue(mockProducts);

    const result = await InventoryIntelligenceService.analyzeInventoryHealth('biz1');

    expect(result.lowStock.length).toBe(1);
    expect(result.lowStock[0].product.id).toBe('p1');
    
    expect(result.fastMoving.length).toBe(1);
    expect(result.fastMoving[0].product.id).toBe('p1');

    expect(result.overstock.length).toBe(1);
    expect(result.overstock[0].product.id).toBe('p2');

    expect(result.slowMoving.length).toBe(1);
    expect(result.slowMoving[0].product.id).toBe('p2');

    expect(result.deadStock.length).toBe(1);
    expect(result.deadStock[0].product.id).toBe('p3');
  });

  it('provides deterministic supplier scoring', async () => {
    const mockSuppliers = [
      { id: 'supplierA', name: 'Alpha Tech', leadTimeDays: 5 },
      { id: 'supplierB', name: 'Beta Supplies', leadTimeDays: 14 }
    ];

    (prisma.supplier.findMany as any).mockResolvedValue(mockSuppliers);

    const result1 = await InventoryIntelligenceService.scoreSuppliers('biz1');
    const result2 = await InventoryIntelligenceService.scoreSuppliers('biz1');

    // Should return same array length
    expect(result1.length).toBe(2);
    expect(result2.length).toBe(2);

    // Should be deterministic
    expect(result1[0].totalScore).toBe(result2[0].totalScore);
    expect(result1[1].totalScore).toBe(result2[1].totalScore);

    // Score components should be predictable and consistent
    const alphaScore = result1.find(s => s.supplierId === 'supplierA')!;
    const betaScore = result1.find(s => s.supplierId === 'supplierB')!;
    
    // Alpha has shorter lead time (5 days), leadTimeScore = 100 - 10 = 90
    expect(alphaScore.leadTimeScore).toBe(90);
    // Beta has longer lead time (14 days), leadTimeScore = 100 - 28 = 72
    expect(betaScore.leadTimeScore).toBe(72);
  });

  it('predicts stockout date correctly', async () => {
    const mockProduct = {
      id: 'p1',
      movements: [
        { movementType: 'IN', quantity: 150, createdAt: new Date() },
        { movementType: 'OUT', quantity: 90, createdAt: new Date() }
      ]
    };

    (prisma.product.findUnique as any).mockResolvedValue(mockProduct);

    const result = await InventoryIntelligenceService.predictStockoutDate('biz1', 'p1');
    
    // Current stock: 60. Sold 90 in 30 days = daily demand of 3.
    // Stockout in 60 / 3 = 20 days.
    expect(result.currentStock).toBe(60);
    expect(result.dailyDemand).toBe(3);
    expect(result.daysUntilStockout).toBe(20);
    expect(result.estimatedDate).toBeInstanceOf(Date);
  });
});
