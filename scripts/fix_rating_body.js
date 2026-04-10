const fs = require('fs');
const path = require('path');

const jmxPath = path.join(__dirname, '..', 'Policysense.jmx');
let jmx = fs.readFileSync(jmxPath, 'utf8');

// XML-encode a string (replace " with &quot;)
function xe(s) { return s.replace(/"/g, '&quot;'); }

// Build the full body XML-encoded
// JMeter variables like ${lob_code} are NOT quoted because they resolve to integers
const parts = [
  xe('"LineOfBusinessCode"') + ':${lob_code}',
  xe('"ProductCode"') + ':${product_code}',
  xe('"CalculationDate"') + ':' + xe('"2025-10-01T00:00:00.000Z"'),
  xe('"EffectiveDate"') + ':' + xe('"2025-10-01T00:00:00.000Z"'),
  xe('"ExpirationDate"') + ':' + xe('"2026-10-01T00:00:00.000Z"'),
  xe('"OriginalEffectiveDate"') + ':' + xe('"2025-10-01T00:00:00.000Z"'),
  xe('"SumInsured"') + ':0',
  xe('"SumInsuredAccumulationOfRisk"') + ':${sum_insured}',
  xe('"SumInsuredTaxes"') + ':${sum_insured}',
  xe('"AnnualPremium"') + ':323.04',
  // ParticularData is a JSON string - inner quotes need \&quot; in XML
  xe('"ParticularData"') + ':' + xe('"') + '{\\' + xe('"') + 'Specie\\' + xe('"') + ':\\' + xe('"') + 'Dog\\' + xe('"') + ',\\' + xe('"') + 'Sex\\' + xe('"') + ':\\' + xe('"') + 'Male\\' + xe('"') + ',\\' + xe('"') + 'DateOfBirth\\' + xe('"') + ':\\' + xe('"') + '2012-12-16T00:00:00.000Z\\' + xe('"') + ',\\' + xe('"') + 'Size\\' + xe('"') + ':\\' + xe('"') + 'Medium\\' + xe('"') + ',\\' + xe('"') + 'HasPedigree\\' + xe('"') + ':true,\\' + xe('"') + 'Neutering\\' + xe('"') + ':true,\\' + xe('"') + 'Dangerousness\\' + xe('"') + ':\\' + xe('"') + 'Medium\\' + xe('"') + ',\\' + xe('"') + 'PetValue\\' + xe('"') + ':30000,\\' + xe('"') + 'PureBreed\\' + xe('"') + ':true}' + xe('"'),
  xe('"InsuranceDuration"') + ':1',
  xe('"InsuranceDurationUnit"') + ':' + xe('"Years"'),
  xe('"OpportunityId"') + ':2179',
  xe('"ExecutionTime"') + ':1466',
  xe('"FirstAdditionalInformation"') + ':' + xe('""'),
  xe('"SecondAdditionalInformation"') + ':' + xe('""'),
  xe('"CalculatedCoverages"') + ':[' +
    '{' + xe('"ClientRoleCode"') + ':1,' + xe('"CoverageCode"') + ':4,' + xe('"CoverageDescription"') + ':' + xe('"Asistencia por fallecimiento de la mascota"') + ',' + xe('"IsRequired"') + ':true,' + xe('"IsSelectedByDefault"') + ':true,' + xe('"IsSelected"') + ':true,' + xe('"SumInsured"') + ':2000,' + xe('"Rate"') + ':0.16152,' + xe('"TypeOfCoefficient"') + ':' + xe('"Multiplier"') + ',' + xe('"AnnualPremium"') + ':323.04},' +
    '{' + xe('"ClientRoleCode"') + ':1,' + xe('"CoverageCode"') + ':1,' + xe('"CoverageDescription"') + ':' + xe('"Robo de la mascota"') + ',' + xe('"IsRequired"') + ':false,' + xe('"IsSelectedByDefault"') + ':false,' + xe('"IsSelected"') + ':false,' + xe('"SumInsured"') + ':30000,' + xe('"Rate"') + ':0.16152,' + xe('"TypeOfCoefficient"') + ':' + xe('"Multiplier"') + ',' + xe('"AnnualPremium"') + ':4845.6,' + xe('"VariationIDSelected"') + ':0,' + xe('"ClientId"') + ':' + xe('""') + '},' +
    '{' + xe('"ClientRoleCode"') + ':1,' + xe('"CoverageCode"') + ':3,' + xe('"CoverageDescription"') + ':' + xe('"Gastos por Sacrificio"') + ',' + xe('"IsRequired"') + ':false,' + xe('"IsSelectedByDefault"') + ':false,' + xe('"IsSelected"') + ':false,' + xe('"SumInsured"') + ':2000,' + xe('"Rate"') + ':0.16152,' + xe('"TypeOfCoefficient"') + ':' + xe('"Multiplier"') + ',' + xe('"AnnualPremium"') + ':323.04,' + xe('"VariationIDSelected"') + ':0,' + xe('"ClientId"') + ':' + xe('""') + '},' +
    '{' + xe('"ClientRoleCode"') + ':1,' + xe('"CoverageCode"') + ':2,' + xe('"CoverageDescription"') + ':' + xe('"Gastos veterinarios"') + ',' + xe('"IsRequired"') + ':false,' + xe('"IsSelectedByDefault"') + ':false,' + xe('"IsSelected"') + ':false,' + xe('"SumInsured"') + ':30000,' + xe('"Rate"') + ':0.16152,' + xe('"TypeOfCoefficient"') + ':' + xe('"Multiplier"') + ',' + xe('"AnnualPremium"') + ':4845.6,' + xe('"VariationIDSelected"') + ':0,' + xe('"ClientId"') + ':' + xe('""') + '},' +
    '{' + xe('"ClientRoleCode"') + ':1,' + xe('"CoverageCode"') + ':5,' + xe('"CoverageDescription"') + ':' + xe('"Responsabilidad Civil Mascotas"') + ',' + xe('"IsRequired"') + ':false,' + xe('"IsSelectedByDefault"') + ':false,' + xe('"IsSelected"') + ':false,' + xe('"SumInsured"') + ':2000,' + xe('"Rate"') + ':42.8948,' + xe('"TypeOfCoefficient"') + ':' + xe('"Pormilage"') + ',' + xe('"AnnualPremium"') + ':85.7896,' + xe('"VariationIDSelected"') + ':0,' + xe('"ClientId"') + ':' + xe('""') + '}' +
  ']',
  xe('"Roles"') + ':[{' + xe('"ClientRoleCode"') + ':1,' + xe('"BirthDate"') + ':' + xe('"2005-05-05T00:00:00.000Z"') + ',' + xe('"GenderCode"') + ':2,' + xe('"IsSmoker"') + ':false,' + xe('"ClientId"') + ':' + xe('"7109"') + '}]',
  xe('"GrossPremiumByFrequencies"') + ':[' +
    '{' + xe('"CalculationOption"') + ':' + xe('"AllCoverages"') + ',' + xe('"DataOption"') + ':' + xe('"Totals_BillingItems_Details"') + ',' + xe('"PaymentFrequencyCode"') + ':1,' + xe('"PaymentFrequencyDescription"') + ':' + xe('"Anual"') + ',' + xe('"BillEffectiveDate"') + ':' + xe('"2025-10-01T00:00:00.000Z"') + ',' + xe('"BillExpirationDate"') + ':' + xe('"2026-10-01T00:00:00.000Z"') + ',' + xe('"BasicAnnualPremium"') + ':323.04,' + xe('"BasicModalPremium"') + ':323.04,' + xe('"AnnualPremiumNetOfTaxes"') + ':323.04,' + xe('"GrossAnnualPremium"') + ':369.8808,' + xe('"ModalPremiumNetOfTaxes"') + ':323.04,' + xe('"GrossModalPremium"') + ':369.8808,' + xe('"GrossPremiumByBillItems"') + ':[{' + xe('"BillingItemCode"') + ':1,' + xe('"BillingItemDescription"') + ':' + xe('"Prima total"') + ',' + xe('"AnnualBillingAmount"') + ':323.04,' + xe('"ModalBillingAmount"') + ':323.04},{' + xe('"BillingItemCode"') + ':2,' + xe('"BillingItemDescription"') + ':' + xe('"Impuestos"') + ',' + xe('"AnnualBillingAmount"') + ':46.8408,' + xe('"ModalBillingAmount"') + ':46.8408}]},' +
    '{' + xe('"CalculationOption"') + ':' + xe('"AllCoverages"') + ',' + xe('"DataOption"') + ':' + xe('"Totals_BillingItems_Details"') + ',' + xe('"PaymentFrequencyCode"') + ':2,' + xe('"PaymentFrequencyDescription"') + ':' + xe('"Semestral"') + ',' + xe('"BillEffectiveDate"') + ':' + xe('"2025-10-01T00:00:00.000Z"') + ',' + xe('"BillExpirationDate"') + ':' + xe('"2026-04-01T00:00:00.000Z"') + ',' + xe('"BasicAnnualPremium"') + ':323.04,' + xe('"BasicModalPremium"') + ':193.824,' + xe('"AnnualPremiumNetOfTaxes"') + ':323.04,' + xe('"GrossAnnualPremium"') + ':369.8808,' + xe('"ModalPremiumNetOfTaxes"') + ':193.824,' + xe('"GrossModalPremium"') + ':240.6648,' + xe('"GrossPremiumByBillItems"') + ':[{' + xe('"BillingItemCode"') + ':1,' + xe('"BillingItemDescription"') + ':' + xe('"Prima total"') + ',' + xe('"AnnualBillingAmount"') + ':323.04,' + xe('"ModalBillingAmount"') + ':193.824},{' + xe('"BillingItemCode"') + ':2,' + xe('"BillingItemDescription"') + ':' + xe('"Impuestos"') + ',' + xe('"AnnualBillingAmount"') + ':46.8408,' + xe('"ModalBillingAmount"') + ':46.8408}]},' +
    '{' + xe('"CalculationOption"') + ':' + xe('"AllCoverages"') + ',' + xe('"DataOption"') + ':' + xe('"Totals_BillingItems_Details"') + ',' + xe('"PaymentFrequencyCode"') + ':3,' + xe('"PaymentFrequencyDescription"') + ':' + xe('"Trimestral"') + ',' + xe('"BillEffectiveDate"') + ':' + xe('"2025-10-01T00:00:00.000Z"') + ',' + xe('"BillExpirationDate"') + ':' + xe('"2026-01-01T00:00:00.000Z"') + ',' + xe('"BasicAnnualPremium"') + ':323.04,' + xe('"BasicModalPremium"') + ':113.064,' + xe('"AnnualPremiumNetOfTaxes"') + ':323.04,' + xe('"GrossAnnualPremium"') + ':369.8808,' + xe('"ModalPremiumNetOfTaxes"') + ':113.064,' + xe('"GrossModalPremium"') + ':159.9048,' + xe('"GrossPremiumByBillItems"') + ':[{' + xe('"BillingItemCode"') + ':1,' + xe('"BillingItemDescription"') + ':' + xe('"Prima total"') + ',' + xe('"AnnualBillingAmount"') + ':323.04,' + xe('"ModalBillingAmount"') + ':113.064},{' + xe('"BillingItemCode"') + ':2,' + xe('"BillingItemDescription"') + ':' + xe('"Impuestos"') + ',' + xe('"AnnualBillingAmount"') + ':46.8408,' + xe('"ModalBillingAmount"') + ':46.8408}]}' +
  ']',
  xe('"ExtrapremiumDiscountTaxRisks"') + ':[{' + xe('"ExtrapremiumDiscountTaxCode"') + ':1,' + xe('"ApplicationOrder"') + ':10,' + xe('"Description"') + ':' + xe('"Impuesto al valor agregado"') + ',' + xe('"IsRequired"') + ':true,' + xe('"IsSelectedByDefault"') + ':true,' + xe('"IsSelected"') + ':true}]',
  xe('"ReturnValueOptionList"') + ':true'
];

const fullBodyXml = '{' + parts.join(',') + '}';

// Find the specific sampler by name
const samplerMarker = 'testname="POST Rating BasicAnnualPremiumForAllCoverage"';
const samplerIdx = jmx.indexOf(samplerMarker);
console.log('Sampler at:', samplerIdx);

const argTag = '<stringProp name="Argument.value">';
const argStart = jmx.indexOf(argTag, samplerIdx);
const argEnd = jmx.indexOf('</stringProp>', argStart) + '</stringProp>'.length;

const newArgProp = argTag + fullBodyXml + '</stringProp>';
const updated = jmx.substring(0, argStart) + newArgProp + jmx.substring(argEnd);

fs.writeFileSync(jmxPath, updated, 'utf8');

// Verify
const vIdx = updated.indexOf(samplerMarker);
const vArgStart = updated.indexOf(argTag, vIdx);
console.log('NEW body preview:', updated.substring(vArgStart + argTag.length, vArgStart + argTag.length + 200));
console.log('CalculatedCoverages in TG01 sampler:', updated.substring(vArgStart, vArgStart + fullBodyXml.length + 100).includes('CalculatedCoverages') ? 'YES' : 'NO');
console.log('GrossPremiumByFrequencies present:', updated.includes('GrossPremiumByFrequencies') ? 'YES' : 'NO');
