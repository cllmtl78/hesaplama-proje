/**
 * T.C. Resmi Mevzuat Parametreleri, Alt/Üst Sınırlar (Edge Cases) ve İstisna Kuralları
 * 2026 Yürürlükteki Yasal Dayanaklar:
 * - 4447 Sayılı İşsizlik Sigortası Kanunu
 * - 4857 Sayılı İş Kanunu
 * - 193 Sayılı Gelir Vergisi Kanunu (GMSİ & Ücret İstisnaları)
 * - 5510 Sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu
 * - 3065 Sayılı Katma Değer Vergisi Kanunu
 */

// ==========================================
// 1. GENEL RESMİ PARAMETRELER (2026)
// ==========================================

export const MEVZUAT_2026 = {
  // Brüt Asgari Ücret (Aylık)
  ASGARI_UCRET_BRUT: 26005.50,

  // Damga Vergisi Oranı (Binde 7,59)
  DAMGA_VERGISI_ORANI: 0.00759,

  // Kıdem Tazminatı Tavanı (2026 Yasal Tavanı - TL)
  KIDEM_TAVANI: 46000.00,

  // Konut (Mesken) Kira Geliri İstisnası (193 GVK md. 21)
  MESKEN_KIRA_ISTISNASI: 45000.00,

  // Gelir Vergisi Beyannamesi Damga Pulu
  BEYANNAME_DAMGA_VERGISI: 650.00,

  // Fazla Mesai Aylık Standart Çalışma Saati Böleni (4857 SK md. 41)
  // Haftalık 45 saat / 6 iş günü = 7.5 saat/gün * 30 gün = 225 saat
  FAZLA_MESAI_BOLENI: 225,

  // Gelir Vergisi Dilimleri (Ücret Gelirleri için 2026)
  GELIR_VERGISI_DILIMLERI: [
    { limit: 158000, rate: 0.15 },
    { limit: 380000, rate: 0.20 },
    { limit: 1400000, rate: 0.27 },
    { limit: 4300000, rate: 0.35 },
    { limit: Infinity, rate: 0.40 },
  ],

  // Resmi Mevzuat Bilgi Rozeti Metni
  MEVZUAT_ROZETI: "T.C. Resmi Mevzuatı, yürürlükteki tavan/taban sınırları ve yasal istisnalar dikkate alınarak hesaplanmıştır.",
} as const;

// ==========================================
// 2. İŞSİZLİK MAAŞI HESAPLAMA & EDGE CASES
// Yasal Dayanak: 4447 SK Madde 50
// ==========================================

export interface IssizlikMaasiSonucu {
  ortalamaBrut: number;
  hakEdilenAy: number;
  primMetni: string;
  hamMaas: number;
  tabanMaas: number;
  tavanMaas: number;
  uygulananBrutMaas: number;
  isCapped: boolean;
  isFloored: boolean;
  damgaVergisi: number;
  netAylikMaas: number;
  toplamAlinacakMaas: number;
  mevzuatRozeti: string;
}

export function hesaplaIssizlikMaasi(
  ortalamaBrut: number,
  primGun: "600" | "900" | "1080"
): IssizlikMaasiSonucu {
  const brut = Math.max(0, ortalamaBrut || 0);

  // Hak Edilen Süre Kontrolü
  let hakEdilenAy = 6;
  let primMetni = "600 - 899 Gün (6 Ay)";
  if (primGun === "900") {
    hakEdilenAy = 8;
    primMetni = "900 - 1079 Gün (8 Ay)";
  } else if (primGun === "1080") {
    hakEdilenAy = 10;
    primMetni = "1080+ Gün (10 Ay)";
  }

  // Ham Maaş = Son 4 aylık ortalama brüt maaşın %40'ı
  const hamMaas = brut * 0.40;

  // 4447 SK Edge Cases:
  // Taban: Brüt Asgari Ücret * 0.40 (Hiçbir şekilde bunun altına inemez)
  // Tavan: Brüt Asgari Ücret * 0.80 (Asgari ücretin %80'ini aşamaz)
  const tabanMaas = MEVZUAT_2026.ASGARI_UCRET_BRUT * 0.40;
  const tavanMaas = MEVZUAT_2026.ASGARI_UCRET_BRUT * 0.80;

  let uygulananBrutMaas = hamMaas;
  let isCapped = false;
  let isFloored = false;

  if (brut > 0) {
    if (hamMaas > tavanMaas) {
      uygulananBrutMaas = tavanMaas;
      isCapped = true;
    } else if (hamMaas < tabanMaas) {
      uygulananBrutMaas = tabanMaas;
      isFloored = true;
    }
  } else {
    uygulananBrutMaas = 0;
  }

  // Kesinti: 4447 SK uyarınca YALNIZCA Damga Vergisi (%0.00759) kesilir
  const damgaVergisi = uygulananBrutMaas * MEVZUAT_2026.DAMGA_VERGISI_ORANI;
  const netAylikMaas = Math.max(0, uygulananBrutMaas - damgaVergisi);
  const toplamAlinacakMaas = netAylikMaas * hakEdilenAy;

  return {
    ortalamaBrut: brut,
    hakEdilenAy,
    primMetni,
    hamMaas,
    tabanMaas,
    tavanMaas,
    uygulananBrutMaas,
    isCapped,
    isFloored,
    damgaVergisi,
    netAylikMaas,
    toplamAlinacakMaas,
    mevzuatRozeti: MEVZUAT_2026.MEVZUAT_ROZETI,
  };
}

// ==========================================
// 3. KIDEM VE İHBAR TAZMİNATI & EDGE CASES
// Yasal Dayanak: 1475 SK md. 14, 4857 SK md. 17
// ==========================================

export interface KidemIhbarSonucu {
  totalDays: number;
  years: number;
  months: number;
  days: number;
  monthlyGross: number;
  appliedSalary: number;
  isCapped: boolean;
  eligibleForKidem: boolean;
  brutKidem: number;
  kidemDamgaVergisi: number;
  netKidem: number;
  noticeWeeks: number;
  noticeDays: number;
  brutIhbar: number;
  ihbarGelirVergisi: number;
  ihbarDamgaVergisi: number;
  netIhbar: number;
  totalNet: number;
  mevzuatRozeti: string;
}

export function hesaplaKidemIhbar(
  startDateStr: string,
  endDateStr: string,
  grossSalary: number,
  additionalBenefits: number = 0
): KidemIhbarSonucu | null {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    return null;
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // Giydirilmiş Brüt Ücret
  const monthlyGross = Math.max(0, (grossSalary || 0) + (additionalBenefits || 0));

  // 1 yılı doldurmayan işçinin kıdem tazminatı hakkı doğmaz
  const eligibleForKidem = totalDays >= 365;

  // Kıdem Tavanı Edge Case Kontrolü:
  // Maaş tavanı aşarsa hesaplama tavan üzerinden yapılır
  const appliedSalary = Math.min(monthlyGross, MEVZUAT_2026.KIDEM_TAVANI);
  const isCapped = monthlyGross > MEVZUAT_2026.KIDEM_TAVANI;

  let brutKidem = 0;
  if (eligibleForKidem) {
    brutKidem = (appliedSalary / 365) * totalDays;
  }

  // Yasal Kural: Kıdem tazminatından Gelir Vergisi KESİLMEZ, yalnızca binde 7,59 Damga Vergisi kesilir
  const kidemDamgaVergisi = brutKidem * MEVZUAT_2026.DAMGA_VERGISI_ORANI;
  const netKidem = brutKidem - kidemDamgaVergisi;

  // İhbar Tazminatı Süreleri (4857 SK md. 17)
  const totalMonths = years * 12 + months;
  let noticeWeeks = 2;
  let noticeDays = 14;

  if (totalMonths >= 36) {
    noticeWeeks = 8;
    noticeDays = 56;
  } else if (totalMonths >= 18) {
    noticeWeeks = 6;
    noticeDays = 42;
  } else if (totalMonths >= 6) {
    noticeWeeks = 4;
    noticeDays = 28;
  }

  // İhbar brüt ücreti (tavan sınırı yoktur, giydirilmiş brütten hesaplanır)
  const brutIhbar = (monthlyGross / 30) * noticeDays;
  const ihbarGelirVergisi = brutIhbar * 0.15; // Stopaj %15
  const ihbarDamgaVergisi = brutIhbar * MEVZUAT_2026.DAMGA_VERGISI_ORANI;
  const netIhbar = brutIhbar - ihbarGelirVergisi - ihbarDamgaVergisi;

  const totalNet = netKidem + netIhbar;

  return {
    totalDays,
    years,
    months,
    days,
    monthlyGross,
    appliedSalary,
    isCapped,
    eligibleForKidem,
    brutKidem,
    kidemDamgaVergisi,
    netKidem,
    noticeWeeks,
    noticeDays,
    brutIhbar,
    ihbarGelirVergisi,
    ihbarDamgaVergisi,
    netIhbar,
    totalNet,
    mevzuatRozeti: MEVZUAT_2026.MEVZUAT_ROZETI,
  };
}

// ==========================================
// 4. BRÜTTEN NETE MAAŞ & ASGARİ ÜCRET İSTİSNASI
// Yasal Dayanak: 5510 SK & 193 GVK (Asgari Ücret İstisnası)
// ==========================================

export function calculateBracketTax(cumBefore: number, cumAfter: number): number {
  let tax = 0;
  let prevLimit = 0;

  for (const b of MEVZUAT_2026.GELIR_VERGISI_DILIMLERI) {
    const overlapStart = Math.max(cumBefore, prevLimit);
    const overlapEnd = Math.min(cumAfter, b.limit);

    if (overlapEnd > overlapStart) {
      tax += (overlapEnd - overlapStart) * b.rate;
    }

    prevLimit = b.limit;
  }

  return tax;
}

export interface MonthSalaryDetail {
  monthIndex: number;
  monthName: string;
  brut: number;
  sgkWorker: number;
  unempWorker: number;
  cumTaxBase: number;
  rawIncomeTax: number;
  minWageTaxExemption: number;
  netIncomeTax: number;
  stampTax: number;
  netSalary: number;
}

export interface BruttenNeteSonucu {
  list: MonthSalaryDetail[];
  ocaNet: number;
  araNet: number;
  annualNet: number;
  avgNet: number;
  brut: number;
  mevzuatRozeti: string;
}

export function hesaplaBruttenNete12Ay(
  brutMaas: number,
  engellilikDerecesi: number = 0
): BruttenNeteSonucu {
  const brut = Math.max(brutMaas || 0, MEVZUAT_2026.ASGARI_UCRET_BRUT);

  let disabilityDeduction = 0;
  if (engellilikDerecesi === 1) disabilityDeduction = 8000;
  else if (engellilikDerecesi === 2) disabilityDeduction = 4700;
  else if (engellilikDerecesi === 3) disabilityDeduction = 2000;

  let cumTaxBase = 0;
  let cumMinWageTaxBase = 0;

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  const list: MonthSalaryDetail[] = [];

  for (let m = 0; m < 12; m++) {
    const sgkWorker = brut * 0.14;
    const unempWorker = brut * 0.01;
    const taxBase = Math.max(0, brut - sgkWorker - unempWorker - disabilityDeduction);

    const beforeCum = cumTaxBase;
    const afterCum = cumTaxBase + taxBase;
    cumTaxBase = afterCum;

    const rawIncomeTax = calculateBracketTax(beforeCum, afterCum);

    // Asgari Ücret İstisnası Takibi (193 GVK md. 23/18)
    const minWageSgk = MEVZUAT_2026.ASGARI_UCRET_BRUT * 0.15;
    const minWageTaxBase = MEVZUAT_2026.ASGARI_UCRET_BRUT - minWageSgk;
    const beforeMinWage = cumMinWageTaxBase;
    const afterMinWage = cumMinWageTaxBase + minWageTaxBase;
    cumMinWageTaxBase = afterMinWage;

    const minWageTaxExemption = calculateBracketTax(beforeMinWage, afterMinWage);
    const netIncomeTax = Math.max(0, rawIncomeTax - minWageTaxExemption);

    // Asgari ücreti aşan kısım için Damga Vergisi
    const excessBrut = Math.max(0, brut - MEVZUAT_2026.ASGARI_UCRET_BRUT);
    const stampTax = excessBrut * MEVZUAT_2026.DAMGA_VERGISI_ORANI;

    const netSalary = brut - sgkWorker - unempWorker - netIncomeTax - stampTax;

    list.push({
      monthIndex: m,
      monthName: monthNames[m],
      brut,
      sgkWorker,
      unempWorker,
      cumTaxBase: afterCum,
      rawIncomeTax,
      minWageTaxExemption,
      netIncomeTax,
      stampTax,
      netSalary,
    });
  }

  const ocaNet = list[0].netSalary;
  const araNet = list[11].netSalary;
  const annualNet = list.reduce((acc, x) => acc + x.netSalary, 0);
  const avgNet = annualNet / 12;

  return {
    list,
    ocaNet,
    araNet,
    annualNet,
    avgNet,
    brut,
    mevzuatRozeti: MEVZUAT_2026.MEVZUAT_ROZETI,
  };
}

// ==========================================
// 5. FAZLA MESAİ & TATİL ÜCRETİ (225 BÖLENİ)
// Yasal Dayanak: 4857 SK Madde 41 ve 47
// ==========================================

export interface FazlaMesaiSonucu {
  brut: number;
  normalSaatUcreti: number;
  saatlikFazlaMesai: number;
  aylikToplamMesaiSaati: number;
  brutFazlaMesai: number;
  netFazlaMesai: number;
  gunlukNormalUcret: number;
  brutTatilUcreti: number;
  netTatilUcreti: number;
  toplamNet: number;
  mesaiGelirVergisi: number;
  mesaiDamgaVergisi: number;
  tatilGelirVergisi: number;
  tatilDamgaVergisi: number;
  mevzuatRozeti: string;
}

export function hesaplaFazlaMesai(
  brutMaas: number,
  haftalikMesaiSaati: number = 0,
  tatilGunSayisi: number = 0
): FazlaMesaiSonucu {
  const brut = Math.max(0, brutMaas || 0);
  const haftalikSaat = Math.max(0, haftalikMesaiSaati || 0);
  const tatilGun = Math.max(0, tatilGunSayisi || 0);

  // Kural: Saatlik ücret bulunurken aylık brüt 225'e bölünmelidir
  const normalSaatUcreti = brut > 0 ? brut / MEVZUAT_2026.FAZLA_MESAI_BOLENI : 0;
  const saatlikFazlaMesai = normalSaatUcreti * 1.5; // %50 zamlı
  const aylikToplamMesaiSaati = haftalikSaat * 4.33;
  const brutFazlaMesai = aylikToplamMesaiSaati * saatlikFazlaMesai;

  // UBGT Tatil günlük ücreti (Brüt / 30 gün) -> 1 tam yevmiye ilave
  const gunlukNormalUcret = brut > 0 ? brut / 30 : 0;
  const brutTatilUcreti = tatilGun * gunlukNormalUcret;

  const gelirVergisiOrani = 0.15;
  const mesaiGelirVergisi = brutFazlaMesai * gelirVergisiOrani;
  const mesaiDamgaVergisi = brutFazlaMesai * MEVZUAT_2026.DAMGA_VERGISI_ORANI;
  const netFazlaMesai = brutFazlaMesai - mesaiGelirVergisi - mesaiDamgaVergisi;

  const tatilGelirVergisi = brutTatilUcreti * gelirVergisiOrani;
  const tatilDamgaVergisi = brutTatilUcreti * MEVZUAT_2026.DAMGA_VERGISI_ORANI;
  const netTatilUcreti = brutTatilUcreti - tatilGelirVergisi - tatilDamgaVergisi;

  const toplamNet = netFazlaMesai + netTatilUcreti;

  return {
    brut,
    normalSaatUcreti,
    saatlikFazlaMesai,
    aylikToplamMesaiSaati,
    brutFazlaMesai,
    netFazlaMesai,
    gunlukNormalUcret,
    brutTatilUcreti,
    netTatilUcreti,
    toplamNet,
    mesaiGelirVergisi,
    mesaiDamgaVergisi,
    tatilGelirVergisi,
    tatilDamgaVergisi,
    mevzuatRozeti: MEVZUAT_2026.MEVZUAT_ROZETI,
  };
}

// ==========================================
// 6. KİRA GELİR VERGİSİ (GMSİ) & İSTİSNA KONTROLÜ
// Yasal Dayanak: 193 GVK Madde 21
// ==========================================

export interface KiraGelirVergisiSonucu {
  kira: number;
  istisnaGecerli: boolean;
  istisnaKapsamindaMi: boolean;
  durumAciklamasi: string;
  uygulananIstisna: number;
  indirilecekGider: number;
  vergiMatrahi: number;
  hesaplananVergi: number;
  toplamVergi: number;
  taksit1: number;
  taksit2: number;
  mevzuatRozeti: string;
}

export function hesaplaKiraGelirVergisi(
  yillikKira: number,
  giderTuru: "goturu" | "gercek",
  gercekGider: number = 0
): KiraGelirVergisiSonucu {
  const kira = Math.max(0, yillikKira || 0);

  // Kural: Yıllık toplam kira geliri yasal konut istisna tutarından (45.000 TL)
  // küçük veya eşitse sonuç: "0 TL (İstisna Kapsamında, Beyanname Verilmez)"
  const istisnaKapsamindaMi = kira <= MEVZUAT_2026.MESKEN_KIRA_ISTISNASI;
  const istisnaGecerli = !istisnaKapsamindaMi;

  if (istisnaKapsamindaMi) {
    return {
      kira,
      istisnaGecerli: false,
      istisnaKapsamindaMi: true,
      durumAciklamasi: "0 TL (İstisna Kapsamında, Beyanname Verilmez)",
      uygulananIstisna: kira,
      indirilecekGider: 0,
      vergiMatrahi: 0,
      hesaplananVergi: 0,
      toplamVergi: 0,
      taksit1: 0,
      taksit2: 0,
      mevzuatRozeti: MEVZUAT_2026.MEVZUAT_ROZETI,
    };
  }

  const uygulananIstisna = MEVZUAT_2026.MESKEN_KIRA_ISTISNASI;
  const istisnaSonrasiKalan = Math.max(0, kira - uygulananIstisna);

  let indirilecekGider = 0;
  if (giderTuru === "goturu") {
    // 193 GVK md. 74 uyarınca %15 götürü gider
    indirilecekGider = istisnaSonrasiKalan * 0.15;
  } else {
    indirilecekGider = Math.min(gercekGider || 0, istisnaSonrasiKalan);
  }

  const vergiMatrahi = Math.max(0, istisnaSonrasiKalan - indirilecekGider);

  let kalanMatrah = vergiMatrahi;
  let hesaplananVergi = 0;
  let prevLimit = 0;

  for (const b of MEVZUAT_2026.GELIR_VERGISI_DILIMLERI) {
    if (kalanMatrah <= 0) break;
    const span = b.limit - prevLimit;
    const chunk = Math.min(kalanMatrah, span);
    hesaplananVergi += chunk * b.rate;
    kalanMatrah -= chunk;
    prevLimit = b.limit;
  }

  const toplamVergi = hesaplananVergi + MEVZUAT_2026.BEYANNAME_DAMGA_VERGISI;
  const taksit1 = hesaplananVergi / 2 + MEVZUAT_2026.BEYANNAME_DAMGA_VERGISI;
  const taksit2 = hesaplananVergi / 2;

  return {
    kira,
    istisnaGecerli: true,
    istisnaKapsamindaMi: false,
    durumAciklamasi: `${Math.round(toplamVergi).toLocaleString("tr-TR")} TL`,
    uygulananIstisna,
    indirilecekGider,
    vergiMatrahi,
    hesaplananVergi,
    toplamVergi,
    taksit1,
    taksit2,
    mevzuatRozeti: MEVZUAT_2026.MEVZUAT_ROZETI,
  };
}
