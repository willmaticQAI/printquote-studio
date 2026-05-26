-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "defaultProfitMargin" REAL NOT NULL,
    "defaultWastePercent" REAL NOT NULL,
    "machineRate" REAL NOT NULL,
    "laborRate" REAL NOT NULL,
    "electricityCostPerKwh" REAL NOT NULL,
    "powerDrawWatts" REAL NOT NULL,
    "minimumPriceFloor" REAL NOT NULL,
    "roundingMode" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Filament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brand" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "colorName" TEXT NOT NULL,
    "colorHex" TEXT NOT NULL,
    "costPerKg" REAL NOT NULL,
    "spoolWeightGrams" REAL NOT NULL,
    "remainingGrams" REAL NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quoteNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "filamentId" TEXT NOT NULL,
    "filamentLabel" TEXT NOT NULL,
    "gramsUsed" REAL NOT NULL,
    "wastePercent" REAL NOT NULL,
    "printHours" REAL NOT NULL,
    "machineRate" REAL NOT NULL,
    "powerDrawWatts" REAL NOT NULL,
    "electricityCostPerKwh" REAL NOT NULL,
    "laborMinutes" REAL NOT NULL,
    "laborRate" REAL NOT NULL,
    "profitMargin" REAL NOT NULL,
    "minimumPriceFloor" REAL NOT NULL,
    "bulkEnabled" BOOLEAN NOT NULL,
    "tier2Qty" INTEGER NOT NULL,
    "tier2DiscountPercent" REAL NOT NULL,
    "notes" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "materialCost" REAL NOT NULL,
    "wasteCost" REAL NOT NULL,
    "machineCost" REAL NOT NULL,
    "electricityCost" REAL NOT NULL,
    "laborCost" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "bulkDiscount" REAL NOT NULL,
    "suggestedPrice" REAL NOT NULL,
    "finalTotal" REAL NOT NULL,
    "profitAmount" REAL NOT NULL,
    "marginPercent" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PrintJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "printNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "filamentId" TEXT NOT NULL,
    "filamentLabel" TEXT NOT NULL,
    "gramsUsed" REAL NOT NULL,
    "wastePercent" REAL NOT NULL,
    "printHours" REAL NOT NULL,
    "machineRate" REAL NOT NULL,
    "powerDrawWatts" REAL NOT NULL,
    "electricityCostPerKwh" REAL NOT NULL,
    "laborMinutes" REAL NOT NULL,
    "laborRate" REAL NOT NULL,
    "profitMargin" REAL NOT NULL,
    "minimumPriceFloor" REAL NOT NULL,
    "bulkEnabled" BOOLEAN NOT NULL,
    "tier2Qty" INTEGER NOT NULL,
    "tier2DiscountPercent" REAL NOT NULL,
    "notes" TEXT NOT NULL,
    "materialCost" REAL NOT NULL,
    "wasteCost" REAL NOT NULL,
    "machineCost" REAL NOT NULL,
    "electricityCost" REAL NOT NULL,
    "laborCost" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    "bulkDiscount" REAL NOT NULL,
    "suggestedPrice" REAL NOT NULL,
    "finalTotal" REAL NOT NULL,
    "profitAmount" REAL NOT NULL,
    "marginPercent" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Quote_quoteNumber_key" ON "Quote"("quoteNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PrintJob_printNumber_key" ON "PrintJob"("printNumber");
