// Deterministic Auditing Logic - Anti-Hallucination Engine
export function runDeterministicAudit(po, invoice) {
  const traces = [];
  const discrepancies = [];

  traces.push({
    step: "METADATA_VERIFICATION",
    message: `Cross-checking Vendor GSTIN and PO References for ${invoice.invoice_number}`,
    status: "SUCCESS",
    timestamp: new Date().toISOString()
  });

  // 1. Vendor & Reference Match
  if (po.vendor_gstin !== invoice.vendor_gstin) {
    discrepancies.push({
      type: "VENDOR_MISMATCH",
      severity: "CRITICAL",
      details: `GSTIN mismatch: PO has ${po.vendor_gstin} but Invoice has ${invoice.vendor_gstin}`
    });
  }

  // 2. Line Item Audit (Deterministic Math)
  let calculatedSubtotal = 0;

  invoice.line_items.forEach((invItem) => {
    const poItem = po.line_items.find((p) => p.item_id === invItem.item_id);

    if (!poItem) {
      discrepancies.push({
        type: "UNAUTHORIZED_LINE_ITEM",
        severity: "CRITICAL",
        details: `Item ID ${invItem.item_id} (${invItem.description}) was not in original PO.`
      });
      return;
    }

    // Rate Inflation Check
    if (invItem.billed_unit_price > poItem.agreed_unit_price) {
      const priceDiff = invItem.billed_unit_price - poItem.agreed_unit_price;
      const totalOvercharge = priceDiff * invItem.quantity;
      discrepancies.push({
        type: "UNIT_PRICE_INFLATION",
        severity: "HIGH",
        item_id: invItem.item_id,
        description: invItem.description,
        authorized_rate: poItem.agreed_unit_price,
        billed_rate: invItem.billed_unit_price,
        overcharge_amount: totalOvercharge,
        details: `Billed at $${invItem.billed_unit_price}/unit instead of agreed $${poItem.agreed_unit_price}/unit. Overcharge: $${totalOvercharge}`
      });
    }

    // Quantity Surplus Check
    if (invItem.quantity > poItem.quantity) {
      discrepancies.push({
        type: "QUANTITY_OVERFLOW",
        severity: "HIGH",
        item_id: invItem.item_id,
        details: `Claimed ${invItem.quantity} units, PO authorized only ${poItem.quantity}`
      });
    }

    calculatedSubtotal += invItem.billed_unit_price * invItem.quantity;
  });

  // 3. Tax & Grand Total Math Trap Audit
  const authorizedTaxRate = po.tax_rate_percent;
  const expectedTax = (calculatedSubtotal * authorizedTaxRate) / 100;
  const expectedGrandTotal = calculatedSubtotal + expectedTax;

  if (Math.abs(invoice.claimed_grand_total - expectedGrandTotal) > 0.01) {
    discrepancies.push({
      type: "MATH_TRAP_DISCREPANCY",
      severity: "CRITICAL",
      claimed_total: invoice.claimed_grand_total,
      expected_total: expectedGrandTotal,
      difference: invoice.claimed_grand_total - expectedGrandTotal,
      details: `Invoice math discrepancy! Claimed $${invoice.claimed_grand_total}, actual calculated authorized total is $${expectedGrandTotal.toFixed(2)}`
    });
  }

  traces.push({
    step: "DETERMINISTIC_AUDIT_COMPLETE",
    discrepancies_found: discrepancies.length,
    status: discrepancies.length > 0 ? "FLAGGED" : "PASSED",
    timestamp: new Date().toISOString()
  });

  return {
    is_valid: discrepancies.length === 0,
    risk_score: discrepancies.length === 0 ? 0 : discrepancies.length > 2 ? 95 : 60,
    discrepancies,
    traces
  };
}