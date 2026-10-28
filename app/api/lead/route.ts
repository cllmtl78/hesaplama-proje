import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, city, note, naceKodu, sektorTanimi, toolName, calculationSummary } = body;

    // Basit doğrulama (Validation)
    if (!fullName || !phone || !city) {
      return NextResponse.json(
        { error: "Ad, telefon ve il alanları zorunludur." },
        { status: 400 }
      );
    }

    const leadPayload = {
      fullName,
      phone,
      city,
      note: note || "Belirtilmedi",
      toolName: toolName || "Genel Hesaplama & Danışmanlık",
      naceKodu: naceKodu || null,
      sektorTanimi: sektorTanimi || null,
      calculationSummary: calculationSummary || null,
      createdAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || "Bilinmiyor",
    };

    console.log("=== YENİ HESAPLAMA PORTALI DANIŞMANLIK TALEBİ ===");
    console.log(JSON.stringify(leadPayload, null, 2));

    return NextResponse.json(
      {
        success: true,
        message: "Danışmanlık ve analiz talebiniz başarıyla kaydedildi.",
        data: { fullName, toolName: leadPayload.toolName },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lead API Hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası meydana geldi. Lütfen daha sonra tekrar deneyiniz." },
      { status: 500 }
    );
  }
}
