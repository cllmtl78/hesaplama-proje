import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, city, note, naceKodu, sektorTanimi } = body;

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
      naceKodu: naceKodu || "Bilinmiyor",
      sektorTanimi: sektorTanimi || "Bilinmiyor",
      createdAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || "Bilinmiyor",
    };

    // Sunucu logu (Webhook veya veritabanı eklemek için hazır)
    console.log("=== YENİ KOSGEB HİBE TALEP LEAD'İ ===");
    console.log(JSON.stringify(leadPayload, null, 2));

    /*
      İleride Webhook bağlamak için örnek:
      if (process.env.CRM_WEBHOOK_URL) {
        await fetch(process.env.CRM_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadPayload),
        });
      }
    */

    return NextResponse.json(
      {
        success: true,
        message: "Hibe analiz talebiniz başarıyla kaydedildi.",
        data: { naceKodu, fullName },
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
