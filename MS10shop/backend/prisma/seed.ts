import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(text: string, counter: number): string {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    counter
  );
}

let slugCounter = 1;
function makeSlug(name: string): string {
  return slugify(name, slugCounter++);
}

interface TeamData {
  name: string;
  nameAr: string;
  nameEn: string;
  country: string;
  countryAr: string;
  league: string;
  leagueAr: string;
  confederation: string;
  confederationAr: string;
  stadium: string;
  stadiumAr: string;
  founded: string;
  history: string;
  historyAr: string;
  website?: string;
  type: "CLUB" | "NATIONAL";
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

async function main() {
  console.log("🚀 Starting seed...");

  console.log("🗑️  Clearing existing data...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.product.deleteMany();
  await prisma.team.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.address.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Data cleared.");

  console.log("👤 Creating admin user...");
  const hashedPassword = await bcrypt.hash("nizar2011", 12);
  await prisma.user.create({
    data: {
      email: "nizarelkaddouri@email.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "MS10",
      role: "ADMIN",
      isVerified: true,
      isActive: true,
    },
  });
  console.log("✅ Admin user created.");

  console.log("📁 Creating categories...");
  const categoriesData = [
    { name: "Football Shirts", nameAr: "قمصان كرة القدم", slug: "football-shirts", description: "Maillots officiels de football" },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created.id;
  }
  console.log("✅ Categories created.");

  console.log("⚽ Skipping teams (handled by imageSync on startup)...");

  // Teams and products are now created by imageSync service on backend startup.
  // The sync scans frontend/public/images/ and creates only teams/products with real images.

  console.log("⚙️ Creating site settings...");
  await prisma.siteSettings.createMany({
    data: [
      { key: "customization_enabled", value: "true", type: "boolean" },
      { key: "customization_price", value: "50", type: "number" },
      { key: "site_name", value: "MS10 Shop", type: "string" },
      { key: "site_description", value: "Votre boutique de maillots et accessoires de football", type: "string" },
      { key: "currency", value: "MAD", type: "string" },
      { key: "shipping_cost", value: "30", type: "number" },
      { key: "free_shipping_threshold", value: "500", type: "number" },
    ],
  });
  console.log("✅ Site settings created.");

  console.log("🎉 Seed completed successfully! Teams/products will be synced on backend startup.");

  // Return early - no teams/products in seed anymore
  return;

  // === BELOW THIS LINE IS OLD SEED DATA (teams, products) - KEPT FOR REFERENCE ===

  console.log("⚽ Creating teams...");

  const teams: TeamData[] = [
    // ═══════════════════════════════════════════
    // MOROCCAN BOTOLA PRO (CAF)
    // ═══════════════════════════════════════════
    {
      name: "Wydad AC", nameAr: "الوداد الرياضي", nameEn: "Wydad Athletic Club",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Mohammed V", stadiumAr: "الملعب الشرفي محمد الخامس",
      founded: "1937", history: "Club historique marocain, multiple champion du Maroc et d'Afrique.", historyAr: "نادي تاريخي مغربي، بطل المغرب وأفريقيا عدة مرات.", website: "https://www.wydadac.ma", type: "CLUB",
    },
    {
      name: "Raja CA", nameAr: "الرجاء الرياضي", nameEn: "Raja Club Athletic",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Mohammed V", stadiumAr: "الملعب الشرفي محمد الخامس",
      founded: "1949", history: "Club emblematique de Casablanca, connu pour sa grande ambiance et ses supports passionnes.", historyAr: "نادي أيقوني في الدار البيضاء، معروف ب atmosphère الرائع ومشجعيه الحماسين.", website: "https://www.rajaclubathletic.com", type: "CLUB",
    },
    {
      name: "AS FAR", nameAr: "القوات المسلحة الملكية", nameEn: "Association Sportive des Forces Armees Royales",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Moulay Abdallah", stadiumAr: "الملعب مولاي عبدالله",
      founded: "1958", history: "Club militaire le plus titre du Maroc, fonde au sein des forces armees royales.", historyAr: "النادي العسكري الأكثر تتويجاً في المغرب.", type: "CLUB",
    },
    {
      name: "Hassania Agadir", nameAr: "حسنية أكادير", nameEn: "Hassania Agadir",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Adrar", stadiumAr: "ملعب أدرار",
      founded: "1946", history: "Club sud-marocain base a Agadir, representant fierement la region du Souss.", historyAr: "نادي جنوب مغربي مقره أكادير، يمثل منطقة سوس بفخر.", type: "CLUB",
    },
    {
      name: "RS Berkane", nameAr: "نادي الرجاء الرياضي البركاني", nameEn: "Renaissance Sportive de Berkane",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Municipal", stadiumAr: "الملعب البلدي",
      founded: "1938", history: "Club de l'Orient marocain, connu pour ses performances remarquables en Coupe de la CAF.", historyAr: "نادي الشرق المغربي، معروف بأدائه المتميز في كأس الكونفدرالية الأفريقية.", type: "CLUB",
    },
    {
      name: "FUS Rabat", nameAr: "الفتح الرياضي الرباطي", nameEn: "Fath Union Sport",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Moulay Hassan", stadiumAr: "الملعب مولاي الحسن",
      founded: "1946", history: "Club historique de Rabat, fonde par des etudiants.", historyAr: "نادي تاريخي من الرباط، أسسه طلاب.", type: "CLUB",
    },
    {
      name: "Moghreb Tetouan", nameAr: "المغرب التطواني", nameEn: "Moghreb Tetouan",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Saniat Rmel", stadiumAr: "ملعب سانية الرمل",
      founded: "1922", history: "L'un des plus anciens clubs du Maroc, base dans la ville nord de Tetouan.", historyAr: "أحد أقدم الأندية في المغرب، مقره في مدينة تطوان الشمالية.", type: "CLUB",
    },
    {
      name: "Ittihad Tanger", nameAr: "إتحاد طنجة", nameEn: "Ittihad Tanger",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Ibn Batouta", stadiumAr: "ملعب طنجة",
      founded: "2014", history: "Club recent de Tanger, champions du Maroc en 2018.", historyAr: "نادي حديث من طنجة، بطل المغرب عام 2018.", type: "CLUB",
    },
    {
      name: "OC Safi", nameAr: "أولمبيك آسفي", nameEn: "Olympique Club de Safi",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade El Massira", stadiumAr: "ملعب المسيرة",
      founded: "1928", history: "Club cotier de la ville de Safi.", historyAr: "نادي ساحلي من مدينة آسفي.", type: "CLUB",
    },
    {
      name: "JS Soualem", nameAr: "ج.س. سليم", nameEn: "Jeunesse Sportive de Soualem",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Municipal", stadiumAr: "الملعب البلدي",
      founded: "1960", history: "Club de la ville de Soualam dans la region de Dar-Beida.", historyAr: "نادي مدينة سليم في منطقة الدار البيضاء.", type: "CLUB",
    },
    {
      name: "Renaissance Zemamra", nameAr: "النهضة الزمامرة", nameEn: "Renaissance Zemamra",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Municipal", stadiumAr: "الملعب البلدي",
      founded: "1970", history: "Club promu recemment en Botola Pro.", historyAr: "نادي صعد مؤخراً إلى البطولة الاحترافية.", type: "CLUB",
    },
    {
      name: "MAT Tetouan", nameAr: "ن.أ.ت. تطوان", nameEn: "Mouloudia Athletic de Tetouan",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Saniat Rmel", stadiumAr: "ملعب سانية الرمل",
      founded: "1950", history: "Club sportif de Tetouan.", historyAr: "نادي رياضي من تطوان.", type: "CLUB",
    },
    {
      name: "KACM Marrakech", nameAr: "الكوكب المراكشي", nameEn: "Kawkab Athletique Club de Marrakech",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade de Marrakech", stadiumAr: "ملعب مراكش",
      founded: "1947", history: "Club historique de Marrakech.", historyAr: "نادي تاريخي من مراكش.", type: "CLUB",
    },
    {
      name: "OC Khouribga", nameAr: "أولمبيك خريبكة", nameEn: "Olympique Club de Khouribga",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Municipal", stadiumAr: "الملعب البلدي",
      founded: "1968", history: "Club de la ville miniere de Khouribga.", historyAr: "نادي مدينة خريبكة المنجمية.", type: "CLUB",
    },
    {
      name: "Wydad Fes", nameAr: "الوداد الفاسي", nameEn: "Wydad Athletic de Fes",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Hassan II", stadiumAr: "ملعب الحسن الثاني",
      founded: "1946", history: "Club sportif de la ville imperiale de Fes.", historyAr: "نادي رياضي من المدينة الإمبراطورية فاس.", type: "CLUB",
    },
    {
      name: "Difaa El Jadidi", nameAr: "الدفاع الحسني الجديدي", nameEn: "Difaa El Jadidi",
      country: "Maroc", countryAr: "المغرب", league: "Botola Pro", leagueAr: "البطولة الاحترافية",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade El Abdi", stadiumAr: "ملعب العبدي",
      founded: "1955", history: "Club de la ville cotiere d'El Jadida.", historyAr: "نادي المدينة الساحلية الجديدة.", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // SAUDI PRO LEAGUE (AFC)
    // ═══════════════════════════════════════════
    {
      name: "Al Nassr FC", nameAr: "النصر", nameEn: "Al Nassr FC",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade de l'Universite King Saud", stadiumAr: "ملعب جامعة الملك سعود",
      founded: "1955", history: "Club emblematique de Riyad, accueillant des joueurs de renommee mondiale.", historyAr: "نادي أيقوني من الرياض، يستقطب لاعبين عالميين.", website: "https://www.alnassr.sa", type: "CLUB",
    },
    {
      name: "Al Hilal SFC", nameAr: "الهلال", nameEn: "Al Hilal Saudi Football Club",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade King Fahd", stadiumAr: "ملعب الملك فهد",
      founded: "1957", history: "Le plus titre d'Arabie Saoudite et d'Asie.", historyAr: "الأكثر تتويجاً في المملكة العربية السعودية وآسيا.", website: "https://www.alhilal.com", type: "CLUB",
    },
    {
      name: "Al Ittihad Club", nameAr: "الاتحاد", nameEn: "Al Ittihad Club",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade King Abdullah Sports City", stadiumAr: "ملعب الملك عبدالله الرياضي",
      founded: "1927", history: "L'un des plus anciens clubs d'Arabie Saoudite, base a Djeddah.", historyAr: "أحد أقدم الأندية في المملكة العربية السعودية، مقره جدة.", website: "https://www.alittihadclub.sa", type: "CLUB",
    },
    {
      name: "Al Ahli SFC", nameAr: "الأهلي", nameEn: "Al Ahli Saudi Football Club",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade King Abdullah Sports City", stadiumAr: "ملعب الملك عبدالله الرياضي",
      founded: "1937", history: "Club prestigieux de Djeddah avec une large base de supporters.", historyAr: "نادي مرموق من جدة بقاعدة جماهيرية واسعة.", type: "CLUB",
    },
    {
      name: "Al Shabab FC", nameAr: "الشباب", nameEn: "Al Shabab FC",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade Prince Khalid bin Sultan", stadiumAr: "ملعب الأمير خالد بن سلطان",
      founded: "1947", history: "Club de Riyad connu pour sa formation de jeunes talents.", historyAr: "نادي من الرياض معروف بتكوين اللاعبين الشباب.", type: "CLUB",
    },
    {
      name: "Al Ettifaq FC", nameAr: "الاتفاق", nameEn: "Al Ettifaq FC",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade Prince Mohammad bin Fahd", stadiumAr: "ملعب الأمير محمد بن فهد",
      founded: "1944", history: "Club historique de Dammam, l'un des piliers du football est-saoudien.", historyAr: "نادي تاريخي من الدمام، أحد أعمدة كرة القدم في الشرقية.", type: "CLUB",
    },
    {
      name: "Al Riyadh SC", nameAr: "الرياض", nameEn: "Al Riyadh SC",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade Prince Faisal bin Fahd", stadiumAr: "ملعب الأمير فيصل بن فهد",
      founded: "1954", history: "Club de la capitale saoudienne.", historyAr: "نادي العاصمة السعودية.", type: "CLUB",
    },
    {
      name: "Al Fateh SC", nameAr: "الفتح", nameEn: "Al Fateh SC",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade Prince Abdullah bin Jalawi", stadiumAr: "ملعب الأمير عبدالله بن جلوي",
      founded: "1958", history: "Club d'Al-Hasa, champion d'Arabie Saoudite en 2013.", historyAr: "نادي الأحساء، بطل السعودية عام 2013.", type: "CLUB",
    },
    {
      name: "Al Taawoun FC", nameAr: "الطائي", nameEn: "Al Taawoun FC",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade King Abdullah Sport City", stadiumAr: "ملعب الملك عبدالله الرياضي",
      founded: "1956", history: "Club de Buraidah dans la region de Qassim.", historyAr: "نادي من بريدة في منطقة القصيم.", type: "CLUB",
    },
    {
      name: "Al Khaleej FC", nameAr: "الخليج", nameEn: "Al Khaleej FC",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade Prince Mohammad bin Fahd", stadiumAr: "ملعب الأمير محمد بن فهد",
      founded: "1960", history: "Club de Saihat dans la province orientale.", historyAr: "نادي من ساهات في المنطقة الشرقية.", type: "CLUB",
    },
    {
      name: "Al Wehda FC", nameAr: "الوحدة", nameEn: "Al Wehda FC",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade King Abdulaziz", stadiumAr: "ملعب الملك عبدالعزيز",
      founded: "1934", history: "Club de La Mecque, l'une des plus anciennes formations du royaume.", historyAr: "نادي من مكة المكرمة، أحد أقدم الفرق في المملكة.", type: "CLUB",
    },
    {
      name: "Damac FC", nameAr: "ضمك", nameEn: "Damac FC",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade Prince Sultan bin Abdul Aziz", stadiumAr: "ملعب الأمير سلطان بن عبدالعزيز",
      founded: "1972", history: "Club de Khamis Mushait dans la region d'Asir.", historyAr: "نادي من خميس مشيط في منطقة عسير.", type: "CLUB",
    },
    {
      name: "Al Okhdood Club", nameAr: "الأخدود", nameEn: "Al Okhdood Club",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade Prince Hathloul bin Abdul Aziz", stadiumAr: "ملعب الأمير حثلول بن عبدالعزيز",
      founded: "1958", history: "Club de Najran dans le sud du royaume.", historyAr: "نادي من نجران في جنوب المملكة.", type: "CLUB",
    },
    {
      name: "Al Hazem FC", nameAr: "الحزم", nameEn: "Al Hazem FC",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade Al Hazem", stadiumAr: "ملعب الحزم",
      founded: "1957", history: "Club d'Ar Rass dans la region de Qassim.", historyAr: "نادي من عرفة في منطقة القصيم.", type: "CLUB",
    },
    {
      name: "Al Akhdoud SC", nameAr: "الأخضر", nameEn: "Al Akhdoud SC",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade Prince Hathloul bin Abdul Aziz", stadiumAr: "ملعب الأمير حثلول بن عبدالعزيز",
      founded: "1961", history: "Club de Najran avec une tradition sportive locale.", historyAr: "نادي من نجران بتقاليد رياضية محلية.", type: "CLUB",
    },
    {
      name: "Al Tai FC", nameAr: "الطائي", nameEn: "Al Tai FC",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade Prince Abdul Aziz bin Musaed", stadiumAr: "ملعب الأمير عبدالعزيز بن مساعد",
      founded: "1961", history: "Club de Ha'il dans le nord du royaume.", historyAr: "نادي من حائل في شمال المملكة.", type: "CLUB",
    },
    {
      name: "Al Orubah FC", nameAr: "العروبة", nameEn: "Al Orubah FC",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade Prince Abdullah bin Faisal", stadiumAr: "ملعب الأمير عبدالله بن فيصل",
      founded: "1960", history: "Club de Jizan dans le sud-ouest du royaume.", historyAr: "نادي من جيزان في جنوب غرب المملكة.", type: "CLUB",
    },
    {
      name: "Al Kholood FC", nameAr: "الخlood", nameEn: "Al Kholood FC",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Saudi Pro League", leagueAr: "دوري روشن السعودي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade Al Kholood", stadiumAr: "ملعب الخlood",
      founded: "1962", history: "Club d'Ar Rass recemment promu en premiere division.", historyAr: "نادي من عرفة صعد مؤخراً إلى الدرجة الأولى.", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // MLS (CONCACAF)
    // ═══════════════════════════════════════════
    {
      name: "Inter Miami CF", nameAr: "إنتر ميامي", nameEn: "Inter Miami CF",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Chase Stadium", stadiumAr: "ستاديوم تشيس",
      founded: "2018", history: "Club fonde par David Beckham a Fort Lauderdale, Floride.", historyAr: "نادي أسسه ديفيد بيكهام في فورت لودرديل.", type: "CLUB",
    },
    {
      name: "LA Galaxy", nameAr: "لا غالاكسي", nameEn: "LA Galaxy",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Dignity Health Sports Park", stadiumAr: "ديغنيتي هيلث سبورتس بارك",
      founded: "1994", history: "Le club le plus titre de l'histoire de la MLS.", historyAr: "الأكثر تتويجاً في تاريخ الدوري الأمريكي.", type: "CLUB",
    },
    {
      name: "New York City FC", nameAr: "نيويورك سيتي", nameEn: "New York City FC",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Yankee Stadium", stadiumAr: "ملعب يانكي",
      founded: "2013", history: "Club de New York co-propriete de City Football Group.", historyAr: "نادي نيويورك المملوك جزئياً لمجموعة سيتي فوتبول.", type: "CLUB",
    },
    {
      name: "Atlanta United FC", nameAr: "أتلانتا يونايتد", nameEn: "Atlanta United FC",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Mercedes-Benz Stadium", stadiumAr: "ستاديوم مرسيدس بنز",
      founded: "2014", history: "Champions MLS en 2018, record d'affluence.", historyAr: "بطل MLS عام 2018، رقم قياسي في الحضور.", type: "CLUB",
    },
    {
      name: "Seattle Sounders FC", nameAr: "سياتل ساوندرز", nameEn: "Seattle Sounders FC",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Lumen Field", stadiumAr: "لومين فيلد",
      founded: "2007", history: "Champions MLS et de la CONCACAF Champions Cup.", historyAr: "بطل MLS ودوري أبطال الكونكاكاف.", type: "CLUB",
    },
    {
      name: "Portland Timbers", nameAr: "بورتلاند تيمبرز", nameEn: "Portland Timbers",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Providence Park", stadiumAr: "بروفيدنس بارك",
      founded: "2008", history: "Club de Portland connu pour ses supporters passionnes.", historyAr: "نادي بورتلاند معروف بمشجعيه الحماسين.", type: "CLUB",
    },
    {
      name: "Philadelphia Union", nameAr: "فيلادلفيا يونيون", nameEn: "Philadelphia Union",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Subaru Park", stadiumAr: "سوبرو بارك",
      founded: "2008", history: "Club de Philadelphie base a Chester.", historyAr: "نادي فيلادلفيا المقره فيسستر.", type: "CLUB",
    },
    {
      name: "St. Louis City SC", nameAr: "سانت لويس سيتي", nameEn: "St. Louis City SC",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "CityPark", stadiumAr: "سيتي بارك",
      founded: "2019", history: "Le plus recent ajout a la MLS, base a St. Louis.", historyAr: "أحدث إضافة إلى MLS، مقره سانت لويس.", type: "CLUB",
    },
    {
      name: "Columbus Crew", nameAr: "كولومبوس كرو", nameEn: "Columbus Crew",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Lower.com Field", stadiumAr: "لورر.كوم فيلد",
      founded: "1994", history: "L'un des clubs fondateurs de la MLS.", historyAr: "אחד מה клубים المؤسسين لـ MLS.", type: "CLUB",
    },
    {
      name: "FC Cincinnati", nameAr: "إف سي سينسيناتي", nameEn: "FC Cincinnati",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "TQL Stadium", stadiumAr: "تي كيو إل ستاديوم",
      founded: "2018", history: "Club de l'Ohio, meilleur record de la MLS en 2023.", historyAr: "نادي من أوهايو، أفضل سجل في MLS عام 2023.", type: "CLUB",
    },
    {
      name: "Nashville SC", nameAr: "ناشفيل", nameEn: "Nashville SC",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Geodis Park", stadiumAr: "جيوديس بارك",
      founded: "2017", history: "Club du Tennessee avec un stade dedie.", historyAr: "نادي من تينيسي بملعب مخصص.", type: "CLUB",
    },
    {
      name: "Austin FC", nameAr: "أوستن", nameEn: "Austin FC",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Q2 Stadium", stadiumAr: "كيو تو ستاديوم",
      founded: "2018", history: "Club du Texas avec un environnement de match unique.", historyAr: "نادي من تكساس بتجربة مباراة فريدة.", type: "CLUB",
    },
    {
      name: "Charlotte FC", nameAr: "شارلوت", nameEn: "Charlotte FC",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Bank of America Stadium", stadiumAr: "ستاديوم بنك أمريكا",
      founded: "2019", history: "Club de Caroline du Nord, meilleure premiere saison en MLS.", historyAr: "نادي من كارولاينا الشمالية، أفضل موسم أول في MLS.", type: "CLUB",
    },
    {
      name: "CF Montreal", nameAr: "سي إف مونتريال", nameEn: "CF Montreal",
      country: "Canada", countryAr: "كندا", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Saputo Stadium", stadiumAr: "ستاديوم سابوتو",
      founded: "2010", history: "Club canadien representant Montreal en MLS.", historyAr: "نادي كندي يمثل مونتريال في MLS.", type: "CLUB",
    },
    {
      name: "Toronto FC", nameAr: "تورنتو", nameEn: "Toronto FC",
      country: "Canada", countryAr: "كندا", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "BMO Field", stadiumAr: "بي إم أو فيلد",
      founded: "2006", history: "Premier club canadien a gagner le MLS Cup.", historyAr: "أول نادي كندي يفوز بكأس MLS.", type: "CLUB",
    },
    {
      name: "New York Red Bulls", nameAr: "نيويورك ريد بولز", nameEn: "New York Red Bulls",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Red Bull Arena", stadiumAr: "ريد بول أرينا",
      founded: "1994", history: "Club historique de la MLS, base a Harrison.", historyAr: "نادي تاريخي في MLS، مقره هاريسون.", type: "CLUB",
    },
    {
      name: "Chicago Fire FC", nameAr: "شيكاغو فاير", nameEn: "Chicago Fire FC",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Soldier Field", stadiumAr: "سولجير فيلد",
      founded: "1997", history: "Club de Chicago avec une riche histoire en MLS.", historyAr: "نادي شيكاغو بتاريخ غني في MLS.", type: "CLUB",
    },
    {
      name: "Houston Dynamo FC", nameAr: "هيوستن دينامو", nameEn: "Houston Dynamo FC",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Shell Energy Stadium", stadiumAr: "شل إنرجي ستاديوم",
      founded: "2005", history: "Double champion MLS en 2006 et 2007.", historyAr: "بطل MLS مرتين متتاليتين في 2006 و2007.", type: "CLUB",
    },
    {
      name: "FC Dallas", nameAr: "إف سي دالاس", nameEn: "FC Dallas",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Toyota Stadium", stadiumAr: "تويوتا ستاديوم",
      founded: "1996", history: "Club texan connu pour sa formation de jeunes.", historyAr: "نادي تكساسي معروف بتكوين الشباب.", type: "CLUB",
    },
    {
      name: "Real Salt Lake", nameAr: "ريال سولت ليك", nameEn: "Real Salt Lake",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "America First Field", stadiumAr: "أميركا فيرست فيلد",
      founded: "2004", history: "Champions MLS en 2009.", historyAr: "بطل MLS عام 2009.", type: "CLUB",
    },
    {
      name: "San Jose Earthquakes", nameAr: "سان خوسيه إيرثكويكس", nameEn: "San Jose Earthquakes",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "PayPal Park", stadiumAr: "باي بال بارك",
      founded: "1994", history: "Club historique de la Californie.", historyAr: "نادي تاريخي من كاليفورنيا.", type: "CLUB",
    },
    {
      name: "D.C. United", nameAr: "دي سي يونايتد", nameEn: "D.C. United",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Audi Field", stadiumAr: "أودي فيلد",
      founded: "1995", history: "Le club le plus titre de l'histoire de la MLS avec 4 titres.", historyAr: "الأكثر تتويجاً في تاريخ MLS بأربعة ألقاب.", type: "CLUB",
    },
    {
      name: "Sporting Kansas City", nameAr: "سبورتينغ كانساس سيتي", nameEn: "Sporting Kansas City",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Children's Mercy Park", stadiumAr: "تشيلدرنز ميرسي بارك",
      founded: "1995", history: "Club de Kansas City avec plusieurs titres MLS.", historyAr: "نادي كانساس سيتي بعدة ألقاب MLS.", type: "CLUB",
    },
    {
      name: "Colorado Rapids", nameAr: "كولورادو رابيدز", nameEn: "Colorado Rapids",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Dick's Sporting Goods Park", stadiumAr: "ديكس سبورتنغ غودز بارك",
      founded: "1995", history: "Champions MLS en 2010.", historyAr: "بطل MLS عام 2010.", type: "CLUB",
    },
    {
      name: "Minnesota United FC", nameAr: "مينيسوتا يونايتد", nameEn: "Minnesota United FC",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Allianz Field", stadiumAr: "اليانز فيلد",
      founded: "2015", history: "Club du Minnesota avec un stade moderne.", historyAr: "نادي من مينيسوتا بملعب حديث.", type: "CLUB",
    },
    {
      name: "Orlando City SC", nameAr: "أورلاندو سيتي", nameEn: "Orlando City SC",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Exploria Stadium", stadiumAr: "إكسبلوريا ستاديوم",
      founded: "2013", history: "Club de Floride avec des supporters tres actifs.", historyAr: "نادي من فلوريدا بمشجعين نشطين جداً.", type: "CLUB",
    },
    {
      name: "New England Revolution", nameAr: "نيو إنجلاند ريفولوشن", nameEn: "New England Revolution",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Gillette Stadium", stadiumAr: "جيليت ستاديوم",
      founded: "1994", history: "Club de la Nouvelle-Angleterre, finaliste MLS a plusieurs reprises.", historyAr: "نادي نيو إنجلاند، نهائي MLS عدة مرات.", type: "CLUB",
    },
    {
      name: "Vancouver Whitecaps FC", nameAr: "فانكوفر وايتكابس", nameEn: "Vancouver Whitecaps FC",
      country: "Canada", countryAr: "كندا", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "BC Place", stadiumAr: "بي سي بلاس",
      founded: "1979", history: "L'un des plus anciens clubs de football en Amerique du Nord.", historyAr: "أحد أقدم أندية كرة القدم في أمريكا الشمالية.", type: "CLUB",
    },
    {
      name: "LAFC", nameAr: "إل أي إف سي", nameEn: "Los Angeles Football Club",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "MLS", leagueAr: "الدوري الأمريكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "BMO Stadium", stadiumAr: "بي إم أو ستاديوم",
      founded: "2014", history: "Club de Los Angeles, vainqueur du Supporters' Shield.", historyAr: "نادي لوس أنجلوس، فائز بدرع المشجعين.", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // PREMIER LEAGUE (UEFA)
    // ═══════════════════════════════════════════
    {
      name: "Manchester United", nameAr: "مانشستر يونايتد", nameEn: "Manchester United",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Old Trafford", stadiumAr: "أولد ترافورد",
      founded: "1878", history: "L'un des clubs les plus titres au monde, 20 titres de champion d'Angleterre.", historyAr: "واحد من أكثر الأندية تتويجاً في العالم، 20 لقباً إنجليزياً.", website: "https://www.manutd.com", type: "CLUB",
    },
    {
      name: "Manchester City", nameAr: "مانشستر سيتي", nameEn: "Manchester City",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Etihad Stadium", stadiumAr: "ستاديوم الاتحاد",
      founded: "1880", history: "Dominateur de la Premier League moderne, sextuple champion.", historyAr: "المهيمن على الدوري الإنجليزي الحديث، بطل ست مرات.", website: "https://www.mancity.com", type: "CLUB",
    },
    {
      name: "Liverpool FC", nameAr: "ليفربول", nameEn: "Liverpool Football Club",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Anfield", stadiumAr: "آنفيلد",
      founded: "1892", history: "6 fois champion d'Europe, historique d'Anfield.", historyAr: "6 مرات بطل أوروبا، تاريخ أنفيلد.", website: "https://www.liverpoolfc.com", type: "CLUB",
    },
    {
      name: "Chelsea FC", nameAr: "تشيلسي", nameEn: "Chelsea Football Club",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stamford Bridge", stadiumAr: "ستامفورد بريدج",
      founded: "1905", history: "Club de Londres, champion d'Europe en 2012 et 2021.", historyAr: "نادي لندن، بطل أوروبا في 2012 و2021.", website: "https://www.chelseafc.com", type: "CLUB",
    },
    {
      name: "Arsenal FC", nameAr: "أرسنال", nameEn: "Arsenal Football Club",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Emirates Stadium", stadiumAr: "ستاديوم الإمارات",
      founded: "1886", history: "The Gunners, 13 titres de champion d'Angleterre.", historyAr: "المدفعجية، 13 لقباً إنجليزياً.", website: "https://www.arsenal.com", type: "CLUB",
    },
    {
      name: "Tottenham Hotspur", nameAr: "توتنهام هوتسبير", nameEn: "Tottenham Hotspur",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Tottenham Hotspur Stadium", stadiumAr: "ستاديوم توتنهام هوتسبير",
      founded: "1882", history: "Club londonien avec un stade ultramoderne.", historyAr: "نادي لندني بملعب عصري.", website: "https://www.tottenhamhotspur.com", type: "CLUB",
    },
    {
      name: "Newcastle United", nameAr: "نيوكاسل يونايتد", nameEn: "Newcastle United",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "St James' Park", stadiumAr: "ست جيمس بارك",
      founded: "1892", history: "Club historique du nord de l'Angleterre.", historyAr: "نادي تاريخي من شمال إنجلترا.", website: "https://www.newcastleunited.com", type: "CLUB",
    },
    {
      name: "Brighton and Hove Albion", nameAr: "برايتون أند هوف ألبيون", nameEn: "Brighton and Hove Albion",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "American Express Stadium", stadiumAr: "ستاديوم أمريكان إكسبريس",
      founded: "1901", history: "Club cotier en pleine ascension.", historyAr: "نادي ساحلي في صعود مستمر.", website: "https://www.brightonandhovealbion.com", type: "CLUB",
    },
    {
      name: "Aston Villa", nameAr: "أستون فيلا", nameEn: "Aston Villa",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Villa Park", stadiumAr: "فيل بارك",
      founded: "1874", history: "L'un des plus anciens clubs d'Angleterre, champion d'Europe en 1982.", historyAr: "أحد أقدم الأندية في إنجلترا، بطل أوروبا عام 1982.", website: "https://www.avfc.co.uk", type: "CLUB",
    },
    {
      name: "West Ham United", nameAr: "وست هام يونايتد", nameEn: "West Ham United",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "London Stadium", stadiumAr: "ستاديوم لندن",
      founded: "1895", history: "Les Hammers, bases a Londres, vainqueurs de la Conference League.", historyAr: "المطارق، مقرهم لندن، فائزون بدوري المؤتمر.", website: "https://www.whufc.com", type: "CLUB",
    },
    {
      name: "Brentford FC", nameAr: "برينتفورد", nameEn: "Brentford Football Club",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Gtech Community Stadium", stadiumAr: "ستاديوم جي تك المجتمعي",
      founded: "1889", history: "Club promu en Premier League avec un modele innovant.", historyAr: "نادي صعد إلى الدوري الإنجليزي بنموذج مبتكر.", website: "https://www.brentfordfc.com", type: "CLUB",
    },
    {
      name: "Crystal Palace", nameAr: "كريستال بالاس", nameEn: "Crystal Palace",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Selhurst Park", stadiumAr: "سيلهيرست بارك",
      founded: "1905", history: "Club londonien fonde sur les ruines du Crystal Palace.", historyAr: "نادي لندني أسس على أنقاض قصر كريستال.", website: "https://www.crystalpalace.com", type: "CLUB",
    },
    {
      name: "Fulham FC", nameAr: "فولهام", nameEn: "Fulham Football Club",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Craven Cottage", stadiumAr: "كريفين كوتاج",
      founded: "1879", history: "Le plus ancien club de Londres encore en activite.", historyAr: "أقدم نادي لندني لا يزال نشطاً.", website: "https://www.fulhamfc.com", type: "CLUB",
    },
    {
      name: "Wolverhampton Wanderers", nameAr: "وولفرهامبتون واندررز", nameEn: "Wolverhampton Wanderers",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Molineux", stadiumAr: "مولينيو",
      founded: "1877", history: "L'un des clubs fondateurs de la Football League.", historyAr: "أحد الأندية المؤسسة للدوري الإنجليزي.", website: "https://www.wolves.co.uk", type: "CLUB",
    },
    {
      name: "Everton FC", nameAr: "إيفرتون", nameEn: "Everton Football Club",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Goodison Park", stadiumAr: "غوديسون بارك",
      founded: "1878", history: "9 fois champion d'Angleterre, club historique de Liverpool.", historyAr: "9 مرات بطل إنجلترا، نادي تاريخي من ليفربول.", website: "https://www.everton.com", type: "CLUB",
    },
    {
      name: "Nottingham Forest", nameAr: "نوتنغهام فورست", nameEn: "Nottingham Forest",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "City Ground", stadiumAr: "السيتي غراوند",
      founded: "1865", history: "2 fois champion d'Europe, le club le plus ancien de Premier League.", historyAr: "مراتان بطل أوروبا، أقدم نادي في الدوري الإنجليزي الممتاز.", website: "https://www.nottinghamforest.co.uk", type: "CLUB",
    },
    {
      name: "Leicester City", nameAr: "ليستر سيتي", nameEn: "Leicester City",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "King Power Stadium", stadiumAr: "ستاديوم كينغ باور",
      founded: "1884", history: "Miracle de 2016, champions improbables de la Premier League.", historyAr: "معجزة 2016، أبطال غير متوقعين للدوري الإنجليزي.", website: "https://www.lcfc.com", type: "CLUB",
    },
    {
      name: "Ipswich Town", nameAr: "إيبسويتش تاون", nameEn: "Ipswich Town",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Portman Road", stadiumAr: "بورتمان رود",
      founded: "1878", history: "Champion d'Angleterre en 1962 et 1992, de retour en Premier League.", historyAr: "بطل إنجلترا في 1962 و1992، عاد إلى الدوري الإنجليزي الممتاز.", website: "https://www.itfc.co.uk", type: "CLUB",
    },
    {
      name: "AFC Bournemouth", nameAr: "ايه اف سي بورنموث", nameEn: "AFC Bournemouth",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Vitality Stadium", stadiumAr: "ستاديوم فايتياليتي",
      founded: "1899", history: "Petit club maintenant son statut en Premier League.", historyAr: "نادي صغير يحافظ على مكانته في الدوري الإنجليزي.", website: "https://www.afcb.co.uk", type: "CLUB",
    },
    {
      name: "Southampton FC", nameAr: "ساوثامبتون", nameEn: "Southampton Football Club",
      country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "St Mary's Stadium", stadiumAr: "ستاديوم سانت ماري",
      founded: "1885", history: "Club cotier repuTE pour sa formation.", historyAr: "نادي ساحلي مشهور بالتكوين.", website: "https://www.southamptonfc.com", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // LA LIGA (UEFA)
    // ═══════════════════════════════════════════
    {
      name: "Real Madrid CF", nameAr: "ريال مدريد", nameEn: "Real Madrid Club de Futbol",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Santiago Bernabeu", stadiumAr: "سانتياغو بيرنابيو",
      founded: "1902", history: "Le club le plus titre de l'histoire du football, 15 titres de la Champions League.", historyAr: "أكثر الأندية تتويجاً في تاريخ كرة القدم، 15 لقباً في دوري الأبطال.", website: "https://www.realmadrid.com", type: "CLUB",
    },
    {
      name: "FC Barcelona", nameAr: "برشلونة", nameEn: "Futbol Club Barcelona",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Spotify Camp Nou", stadiumAr: "كامب نو",
      founded: "1899", history: "Mes que un club, 5 titres de Champions League.", historyAr: "أكثر من نادي، 5 ألقاب في دوري الأبطال.", website: "https://www.fcbarcelona.com", type: "CLUB",
    },
    {
      name: "Atletico de Madrid", nameAr: "أتلتيكو مدريد", nameEn: "Club Atletico de Madrid",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Metropolitano", stadiumAr: "المتروبوليتانو",
      founded: "1903", history: "Club madrilene au caractere guerrier, 11 titres de Liga.", historyAr: "نادي مدريد بروح قتالية، 11 لقباً في الليغا.", website: "https://www.atleticodemadrid.com", type: "CLUB",
    },
    {
      name: "Sevilla FC", nameAr: "إشبيلية", nameEn: "Sevilla Futbol Club",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Ramon Sanchez Pizjuan", stadiumAr: "رامون سانشيز بيزخوان",
      founded: "1890", history: "Le roi de la Ligue Europa, 7 titres.", historyAr: "ملك الدوري الأوروبي، 7 ألقاب.", website: "https://www.sevillafc.com", type: "CLUB",
    },
    {
      name: "Real Sociedad", nameAr: "ريال سوسيداد", nameEn: "Real Sociedad de Futbol",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Reale Arena", stadiumAr: "ريالي أرينا",
      founded: "1909", history: "Club du Pays Basque espagnol, champion d'Espagne en 2020.", historyAr: "نادي الباسك الإسباني، بطل إسبانيا عام 2020.", website: "https://www.realsociedad.com", type: "CLUB",
    },
    {
      name: "Real Betis", nameAr: "ريال بيتيس", nameEn: "Real Betis Balompie",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Benito Villamarin", stadiumAr: "بينيتو فيلamarin",
      founded: "1907", history: "Club sevillan aux supporters verdiblancos passionnes.", historyAr: "نادي إشبيلي بمشجعين حماسين.", website: "https://www.realbetisbalompie.es", type: "CLUB",
    },
    {
      name: "Villarreal CF", nameAr: "فياريال", nameEn: "Villarreal Club de Futbol",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio de la Ceramica", stadiumAr: "ملعب السيراميكا",
      founded: "1923", history: "Le sous-marin jaune, vainqueur de la Ligue Europa en 2021.", historyAr: "الغواصة الصفراء، فائز بالدوري الأوروبي عام 2021.", website: "https://www.villarrealcf.com", type: "CLUB",
    },
    {
      name: "Athletic Bilbao", nameAr: "أتلتيك بيلباو", nameEn: "Athletic Club",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "San Mames", stadiumAr: "سان ماميس",
      founded: "1898", history: "Club unique ne jouant qu'avec des joueurs basques.", historyAr: "نادي فريد لا يلعب إلا بلاعبين باسكين.", website: "https://www.athletic-club.eus", type: "CLUB",
    },
    {
      name: "Valencia CF", nameAr: "فالنسيا", nameEn: "Valencia Club de Futbol",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Mestalla", stadiumAr: "ميستايا",
      founded: "1919", history: "Club historique de Valence, 6 titres de Liga.", historyAr: "نادي تاريخي من فالنسيا، 6 ألقاب في الليغا.", website: "https://www.valenciacf.com", type: "CLUB",
    },
    {
      name: "Celta Vigo", nameAr: "سيلتا فيغو", nameEn: "Real Club Celta de Vigo",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Balaidos", stadiumAr: "بالاييدوس",
      founded: "1923", history: "Club galicien au jeu offensif attractif.", historyAr: "نادي غاليكي بهجوم جذاب.", website: "https://www.celtavigo.net", type: "CLUB",
    },
    {
      name: "CA Osasuna", nameAr: "أوساسونا", nameEn: "Club Atletico Osasuna",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "El Sadar", stadiumAr: "السادار",
      founded: "1920", history: "Club navarrais au caractere bien trempe.", historyAr: "نادي نافاري بشخصية قوية.", website: "https://www.osasuna.es", type: "CLUB",
    },
    {
      name: "RCD Mallorca", nameAr: "مايوركا", nameEn: "Real Club Deportivo Mallorca",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Son Moix", stadiumAr: "سون مويس",
      founded: "1916", history: "Club des iles Baleares.", historyAr: "نادي جزر البليار.", website: "https://www.rcdmallorca.com", type: "CLUB",
    },
    {
      name: "Getafe CF", nameAr: "خيتافي", nameEn: "Getafe Club de Futbol",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Coliseum", stadiumAr: "كولوسيوم",
      founded: "1983", history: "Club de la banlieue madrilene au style combatif.", historyAr: "نادي من ضواحي مدريد بأسلوب قتالي.", website: "https://www.getafecf.com", type: "CLUB",
    },
    {
      name: "Girona FC", nameAr: "جيرونا", nameEn: "Girona Futbol Club",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Montilivi", stadiumAr: "مونتيليبي",
      founded: "1930", history: "Revelation de la saison 2023-2024, podium en Liga.", historyAr: "مفاجأة موسم 2023-2024، مركز على المنصة في الليغا.", website: "https://www.gironafc.com", type: "CLUB",
    },
    {
      name: "UD Las Palmas", nameAr: "لاس بالاس", nameEn: "Union Deportiva Las Palmas",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Gran Canaria", stadiumAr: "غران كناريا",
      founded: "1949", history: "Club des iles Canaries.", historyAr: "نادي جزر الكناري.", website: "https://www.udlaspalmas.com", type: "CLUB",
    },
    {
      name: "Rayo Vallecano", nameAr: "رايو فاليكانو", nameEn: "Rayo Vallecano de Madrid",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Vallecas", stadiumAr: "فاليكاس",
      founded: "1924", history: "Club populaire du quartier de Vallecas.", historyAr: "نادي شعبي من حي فاليكاس.", website: "https://www.rayovallecano.com", type: "CLUB",
    },
    {
      name: "RCD Espanyol", nameAr: "إسبانيول", nameEn: "Reial Club Deportiu Espanyol",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "RCDE Stadium", stadiumAr: "آر سي دي إي ستاديوم",
      founded: "1900", history: "Club barcelonais rival du FC Barcelona.", historyAr: "نادي برشلوني منافس لبرشلونة.", website: "https://www.rcdespanyol.com", type: "CLUB",
    },
    {
      name: "Real Valladolid", nameAr: " بلد الوليد", nameEn: "Real Valladolid Club de Futbol",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Jose Zorrilla", stadiumAr: "خوسيه زوريلا",
      founded: "1928", history: "Club de Castille et Leon.", historyAr: "نادي قشتالة وليون.", website: "https://www.realvalladolid.com", type: "CLUB",
    },
    {
      name: "Deportivo Alaves", nameAr: "ديبورتيفو ألافيس", nameEn: "Deportivo Alaves",
      country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Mendizorroza", stadiumAr: "مينديزوروزا",
      founded: "1921", history: "Club basque finaliste de la Ligue Europa en 2018.", historyAr: "نادي باسك نهائي الدوري الأوروبي 2018.", website: "https://www.deportivoalaves.com", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // SERIE A (UEFA)
    // ═══════════════════════════════════════════
    {
      name: "AC Milan", nameAr: "إيه سي ميلان", nameEn: "Associazione Calcio Milan",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "San Siro", stadiumAr: "سان سيرو",
      founded: "1899", history: "7 fois champion d'Europe, l'un des plus grands clubs au monde.", historyAr: "مرات سبعة بطل أوروبا، أحد أعظم الأندية في العالم.", website: "https://www.acmilan.com", type: "CLUB",
    },
    {
      name: "Inter Milan", nameAr: "إنتر ميلان", nameEn: "Football Club Internazionale Milano",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "San Siro", stadiumAr: "سان سيرو",
      founded: "1908", history: "Les Nerazzurri, champions d'Europe en 2010.", historyAr: "النيرازوري، بطل أوروبا في 2010.", website: "https://www.inter.it", type: "CLUB",
    },
    {
      name: "Juventus", nameAr: "يوفنتوس", nameEn: "Juventus Football Club",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Allianz Stadium", stadiumAr: "ستاديوم أليانز",
      founded: "1897", history: "Le club le plus titre d'Italie avec 36 scudetti.", historyAr: "أكثر الأندية تتويجاً في إيطاليا بـ36 لقباً.", website: "https://www.juventus.com", type: "CLUB",
    },
    {
      name: "SSC Napoli", nameAr: "نابولي", nameEn: "Societa Sportiva Calcio Napoli",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadio Diego Armando Maradona", stadiumAr: "ملعب دييغو أرماندو مارادونا",
      founded: "1926", history: "Champions d'Italie 2023, hommage a Maradona.", historyAr: "بطل إيطاليا 2023، تكريم لمارادونا.", website: "https://www.sscnapoli.it", type: "CLUB",
    },
    {
      name: "AS Roma", nameAr: "روما", nameEn: "Associazione Sportiva Roma",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadio Olimpico", stadiumAr: "الملعب الأولمبي",
      founded: "1927", history: "La Louve, club emblematique de la capitale italienne.", historyAr: "الذئبة، نادي أيقوني من العاصمة الإيطالية.", website: "https://www.asroma.com", type: "CLUB",
    },
    {
      name: "SS Lazio", nameAr: "لاتسيو", nameEn: "Societa Sportiva Lazio",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadio Olimpico", stadiumAr: "الملعب الأولمبي",
      founded: "1900", history: "Rival historique de la Roma, derbys epiques.", historyAr: "منافس روما التاريخي، ديربيات ملحمية.", website: "https://www.sslazio.it", type: "CLUB",
    },
    {
      name: "ACF Fiorentina", nameAr: "فيورنتينا", nameEn: "Associazione Calcio Firenze",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadio Artemio Franchi", stadiumAr: "ملعب أرتيمو فرانكي",
      founded: "1926", history: "La Viola, club de Florence au style elegant.", historyAr: "البنفسجي، نادي فلورنسا بأناقة راقية.", website: "https://www.acffiorentina.com", type: "CLUB",
    },
    {
      name: "Atalanta BC", nameAr: "أتالانتا", nameEn: "Atalanta Bergamasca Calcio",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Gewiss Stadium", stadiumAr: "جيويس ستاديوم",
      founded: "1907", history: "Revelation italienne, champion de la Ligue Europa 2024.", historyAr: "الصاعدين الإيطالي، بطل الدوري الأوروبي 2024.", website: "https://www.atalanta.it", type: "CLUB",
    },
    {
      name: "Torino FC", nameAr: "تورينو", nameEn: "Torino Football Club",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadio Olimpico Grande Torino", stadiumAr: "الملعب الأولمبي غراندي تورينو",
      founded: "1906", history: "Les Granata, heritiers du Grand Torino.", historyAr: "القراناتا، ورثة غراندي تورينو.", website: "https://www.torinofc.it", type: "CLUB",
    },
    {
      name: "Bologna FC", nameAr: "بولونيا", nameEn: "Bologna Football Club 1909",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadio Renato Dall'Ara", stadiumAr: "ملعب ريناتو دالارا",
      founded: "1909", history: "Club historique de l'Emilie-Romagne, 7 scudetti.", historyAr: "نادي إيميليا-رومانيا التاريخي، 7 ألقاب.", website: "https://www.bolognafc.it", type: "CLUB",
    },
    {
      name: "US Lecce", nameAr: "ليتشي", nameEn: "Unione Sportiva Lecce",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadio Via del Mare", stadiumAr: "ملعب فيا دل ماري",
      founded: "1908", history: "Club des Pouilles, les Giallorossi.", historyAr: "نادي بوليا، الجيلوروسي.", website: "https://www.uslecce.it", type: "CLUB",
    },
    {
      name: "Genoa CFC", nameAr: "جنوة", nameEn: "Genoa Cricket and Football Club",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadio Luigi Ferraris", stadiumAr: "ملعب لويجي فيراريس",
      founded: "1893", history: "Le plus ancien club d'Italie, fonde par des Anglais.", historyAr: "أقدم نادي في إيطاليا، أسسه إنجليز.", website: "https://www.genoa-cfc.it", type: "CLUB",
    },
    {
      name: "AC Monza", nameAr: "مونتزا", nameEn: "Associazione Calcio Monza",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "U-Power Stadium", stadiumAr: "يو باور ستاديوم",
      founded: "1912", history: "Club lombard soutenu par Silvio Berlusconi.", historyAr: "نادي لومباردي مدعوم من سيلفيو برلوسكوني.", website: "https://www.acmonza.com", type: "CLUB",
    },
    {
      name: "Parma Calcio", nameAr: "بارما", nameEn: "Parma Calcio 1913",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadio Ennio Tardini", stadiumAr: "ملعب إنيو تارديني",
      founded: "1913", history: "Ancien grand club europeen, vainqueur de la Coupe UEFA.", historyAr: "نادي أوروبي عريق، فائز بالكأس الأوروبية.", website: "https://www.parmacalcio.com", type: "CLUB",
    },
    {
      name: "Udinese Calcio", nameAr: "أودينيزي", nameEn: "Udinese Calcio",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Bluenergy Stadium", stadiumAr: "بلو إنرجي ستاديوم",
      founded: "1896", history: "Club frioulan repuTE pour ses talents sud-americains.", historyAr: "نادي فريولي معروف بمواهب أمريكا الجنوبية.", website: "https://www.udinese.it", type: "CLUB",
    },
    {
      name: "Cagliari Calcio", nameAr: "كالياري", nameEn: "Cagliari Calcio",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Unipol Domus", stadiumAr: "يونيبول دوموس",
      founded: "1920", history: "Club sarde, champion d'Italie en 1970.", historyAr: "نادي سردي، بطل إيطاليا عام 1970.", website: "https://www.cagliaricalcio.it", type: "CLUB",
    },
    {
      name: "Empoli FC", nameAr: "إمبولي", nameEn: "Empoli Football Club",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadio Carlo Castellani", stadiumAr: "ملعب كارلو كاستيلاني",
      founded: "1920", history: "Club toscan connu pour sa formation.", historyAr: "نادي توسكي معروف بالتكوين.", website: "https://www.empolifc.com", type: "CLUB",
    },
    {
      name: "Hellas Verona", nameAr: "هلاس فيرونا", nameEn: "Hellas Verona Football Club",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadio Marcantonio Bentegodi", stadiumAr: "ملعب ماركانتونيو بينتيغودي",
      founded: "1903", history: "Champion d'Italie en 1985.", historyAr: "بطل إيطاليا عام 1985.", website: "https://www.hellasverona.it", type: "CLUB",
    },
    {
      name: "US Sassuolo", nameAr: "ساسولو", nameEn: "Unione Sportiva Sassuolo",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Mapei Stadium", stadiumAr: "ماباي ستاديوم",
      founded: "1920", history: "Club emilien monte en puissance.", historyAr: "نادي إيميلي في صعود.", website: "https://www.sassuolocalcio.it", type: "CLUB",
    },
    {
      name: "Venezia FC", nameAr: "فينزيا", nameEn: "Venezia Football Club",
      country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadio Pier Luigi Penzo", stadiumAr: "ملعب بيير لويجي بينزو",
      founded: "1907", history: "Club de la cite des Doges, connu pour ses maillots elegants.", historyAr: "نادي مدينة الدوجي، معروف بقمصانه الأنيقة.", website: "https://www.veneziafc.com", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // BUNDESLIGA (UEFA)
    // ═══════════════════════════════════════════
    {
      name: "FC Bayern Munich", nameAr: "بايرن ميونخ", nameEn: "Fußball-Club Bayern München",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Allianz Arena", stadiumAr: "أليانز أرينا",
      founded: "1900", history: "Le club le plus titre d'Allemagne, 6 Ligues des Champions.", historyAr: "أكثر الأندية تتويجاً في ألمانيا، 6 دوري أبطال.", website: "https://www.fcbayern.com", type: "CLUB",
    },
    {
      name: "Borussia Dortmund", nameAr: "بوروسيا دورتموند", nameEn: "Ballspielverein Borussia 09 e.V. Dortmund",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Signal Iduna Park", stadiumAr: "سيغنال إيدونا بارك",
      founded: "1909", history: "Le Borussia, connu pour la Yellow Wall, champion d'Europe en 1997.", historyAr: "البوروسيا، معروف بالجدار الأصفر، بطل أوروبا 1997.", website: "https://www.bvb.de", type: "CLUB",
    },
    {
      name: "RB Leipzig", nameAr: "آر بي لايبزيغ", nameEn: "RasenBallsport Leipzig",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Red Bull Arena", stadiumAr: "ريد بول أرينا",
      founded: "2009", history: "Club controvers mais performant, finale de Champions League.", historyAr: "نادي مثير للجدل لكنه ناجح، نهائي دوري الأبطال.", website: "https://www.rbleipzig.com", type: "CLUB",
    },
    {
      name: "Bayer Leverkusen", nameAr: "باير ليفركوزن", nameEn: "Bayer 04 Leverkusen",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "BayArena", stadiumAr: "باي أرينا",
      founded: "1904", history: "Champion d'Allemagne invaincu en 2024.", historyAr: "بطل ألمانيا دون هزيمة عام 2024.", website: "https://www.bayer04.de", type: "CLUB",
    },
    {
      name: "Eintracht Frankfurt", nameAr: "إينتراخت فرانكفورت", nameEn: "Sportgemeinschaft Eintracht Frankfurt",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Deutsche Bank Park", stadiumAr: "ديويتشه بانك بارك",
      founded: "1899", history: "Vainqueur de la Ligue Europa 2022.", historyAr: "فائز بالدوري الأوروبي 2022.", website: "https://www.eintracht.de", type: "CLUB",
    },
    {
      name: "VfL Wolfsburg", nameAr: "فولفسبورغ", nameEn: "Verein für Leibesuebungen Wolfsburg",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Volkswagen Arena", stadiumAr: "فولكس فاغن أرينا",
      founded: "1945", history: "Club soutenu par Volkswagen, champion en 2009.", historyAr: "نادي مدعوم من فولكس فاغن، بطل عام 2009.", website: "https://www.vfl-wolfsburg.de", type: "CLUB",
    },
    {
      name: "Borussia Monchengladbach", nameAr: "بوروسيا مونشنغلادباخ", nameEn: "Borussia Monchengladbach",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Borussia-Park", stadiumAr: "بوروسيا بارك",
      founded: "1900", history: "Les Fohlen, grand club des annees 70-80.", historyAr: "الفوهلن، نادي عظيم من سنوات 70-80.", website: "https://www.borussia.de", type: "CLUB",
    },
    {
      name: "SC Freiburg", nameAr: "فرايبورغ", nameEn: "Sport-Club Freiburg",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Europa-Park Stadion", stadiumAr: "أوروبا بارك ستاديون",
      founded: "1904", history: "Club bien gere connu pour son modele durable.", historyAr: "نادي جيد الإدارة معروف بنموذجه المستدام.", website: "https://www.scfreiburg.com", type: "CLUB",
    },
    {
      name: "TSG Hoffenheim", nameAr: "هوفنهايم", nameEn: "Turn- und Sportgemeinschaft 1899 Hoffenheim",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "PreZero Arena", stadiumAr: "بري زيرو أرينا",
      founded: "1899", history: "Club soutenu par Dietmar Hopp.", historyAr: "نادي مدعوم من ديتمار هوب.", website: "https://www.tsg-hoffenheim.de", type: "CLUB",
    },
    {
      name: "VfB Stuttgart", nameAr: "شتوتغارت", nameEn: "Verein fuer Bewegungsspiele Stuttgart",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "MHPArena", stadiumAr: "إم إتش بي أرينا",
      founded: "1893", history: "Champion d'Allemagne 5 fois, finaliste de la C1 en 2024.", historyAr: "بطل ألمانيا 5 مرات، نهائي دوري الأبطال 2024.", website: "https://www.vfb.de", type: "CLUB",
    },
    {
      name: "1. FC Union Berlin", nameAr: "يونيون برلين", nameEn: "1. Fussball-Club Union Berlin",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadion An der Alten Forsterei", stadiumAr: "ستاديون أن دير ألتن فورستيري",
      founded: "1966", history: "Club populaire de l'est de Berlin.", historyAr: "نادي شعبي من شرق برلين.", website: "https://www.union-berlin.de", type: "CLUB",
    },
    {
      name: "Werder Bremen", nameAr: "فيردر بريمن", nameEn: "Sportverein Werder Bremen",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Weserstadion", stadiumAr: "فيزرستاديون",
      founded: "1899", history: "Club historique du nord, 4 championnats d'Allemagne.", historyAr: "نادي تاريخي من الشمال، 4 بطولات ألمانية.", website: "https://www.werder.de", type: "CLUB",
    },
    {
      name: "1. FC Heidenheim", nameAr: "هايدنهايم", nameEn: "1. Fussball-Club Heidenheim 1846",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Voith-Arena", stadiumAr: "فويث أرينا",
      founded: "1846", history: "Club qui a fait l'ascenseur remarquable jusqu'a la Bundesliga.", historyAr: "نادي صعد بشكل ملحوظ حتى Bundesliga.", website: "https://www.fc-heidenheim.de", type: "CLUB",
    },
    {
      name: "SV Darmstadt 98", nameAr: "دارمشتات", nameEn: "Sportverein Darmstadt 1898",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Merck-Stadion am Boellenfalltor", stadiumAr: "ميرك ستاديون أم بولنفالتور",
      founded: "1898", history: "Club historique de Hesse.", historyAr: "نادي تاريخي من هيس.", website: "https://www.svd98.de", type: "CLUB",
    },
    {
      name: "FC Augsburg", nameAr: "آوغسبورغ", nameEn: "Fussball-Club Augsburg 1907",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "WWK Arena", stadiumAr: "دبليو دبليو كيه أرينا",
      founded: "1907", history: "Club de Baviere stable en Bundesliga depuis 2011.", historyAr: "نادي بافري ثابت في Bundesliga منذ 2011.", website: "https://www.fcaugsburg.de", type: "CLUB",
    },
    {
      name: "1. FSV Mainz 05", nameAr: "ماينز", nameEn: "1. Fussball- und Sportverein Mainz 05",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "MEWA Arena", stadiumAr: "ميوا أرينا",
      founded: "1905", history: "Club du Rhin avec un passe en Ligue Europa.", historyAr: "نادي من نهر الراين بسجل في الدوري الأوروبي.", website: "https://www.mainz05.de", type: "CLUB",
    },
    {
      name: "VfL Bochum", nameAr: "بوخوم", nameEn: "Verein fuer Leibesuebungen Bochum 1848",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Vonovia Ruhrstadion", stadiumAr: "فونوفيا رورستاديون",
      founded: "1848", history: "Club de la Ruhr avec une longue tradition.", historyAr: "نادي من منطقة الرور بتقاليد طويلة.", website: "https://www.vfl-bochum.de", type: "CLUB",
    },
    {
      name: "1. FC Koln", nameAr: "كولن", nameEn: "1. Fussball-Club Koln",
      country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "RheinEnergieStadion", stadiumAr: "راين إنرجي ستاديوم",
      founded: "1948", history: "Les Geissboecke, premier champion d'Allemagne de l'Ouest.", historyAr: "الجيسبوكي، أول بطل لألمانيا الغربية.", website: "https://www.koeln.de", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // LIGUE 1 (UEFA)
    // ═══════════════════════════════════════════
    {
      name: "Paris Saint-Germain", nameAr: "باريس سان جيرمان", nameEn: "Paris Saint-Germain Football",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Parc des Princes", stadiumAr: "بارك دي برانس",
      founded: "1970", history: "Le club dominant de France, multiples titres consecutifs.", historyAr: "النادي المهيمن في فرنسا، ألقاب متعددة متتالية.", website: "https://www.psg.fr", type: "CLUB",
    },
    {
      name: "Olympique de Marseille", nameAr: "مارسيليا", nameEn: "Olympique de Marseille",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade Velodrome", stadiumAr: "ستاد فيلودروم",
      founded: "1899", history: "Seul club francais champion d'Europe en 1993.", historyAr: "النادي الفرنسي الوحيد بطل أوروبا عام 1993.", website: "https://www.olweb.fr", type: "CLUB",
    },
    {
      name: "Olympique Lyonnais", nameAr: "ليون", nameEn: "Olympique Lyonnais",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Groupama Stadium", stadiumAr: "غروباما ستاديوم",
      founded: "1950", history: "7 titres de champion de France consecutifs (2002-2008).", historyAr: "7 ألقاب متتالية في الدوري الفرنسي (2002-2008).", website: "https://www.olympiquelyonnais.com", type: "CLUB",
    },
    {
      name: "AS Monaco", nameAr: "موناكو", nameEn: "Association Sportive de Monaco",
      country: "Monaco", countryAr: "موناكو", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade Louis-II", stadiumAr: "ستاد لويس الثاني",
      founded: "1924", history: "Club de la principaute, champion de France et finaliste europeen.", historyAr: "نادي إمارة موناكو، بطل فرنسا ونهائي أوروبي.", website: "https://www.asmonaco.com", type: "CLUB",
    },
    {
      name: "RC Lens", nameAr: "لانس", nameEn: "Racing Club de Lens",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade Bollaert-Delelis", stadiumAr: "ستاد بولار ديليلي",
      founded: "1906", history: "Les Sang et Or, champion de France 1998.", historyAr: "الدم والذهب، بطل فرنسا 1998.", website: "https://www.rclensing.fr", type: "CLUB",
    },
    {
      name: "Stade Rennais", nameAr: "رين", nameEn: "Stade Rennais Football Club",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Roazhon Park", stadiumAr: "روازون بارك",
      founded: "1901", history: "Club breton, vainqueur de la Coupe de France a plusieurs reprises.", historyAr: "نادي بريتوني، فائز بكأس فرنسا عدة مرات.", website: "https://www.staderennais.com", type: "CLUB",
    },
    {
      name: "LOSC Lille", nameAr: "ليل", nameEn: "Lille Olympique Sporting Club",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade Pierre-Mauroy", stadiumAr: "ستاد بيير ماورو",
      founded: "1944", history: "Champion de France 2021, le Dogues.", historyAr: "بطل فرنسا 2021، الدوغ.", website: "https://www.lille.fr", type: "CLUB",
    },
    {
      name: "OGC Nice", nameAr: "نيس", nameEn: "Olympique Gymnaste Club de Nice",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Allianz Riviera", stadiumAr: "أليانز ريفيرا",
      founded: "1904", history: "Club de la Cote d'Azur, les Aiglons.", historyAr: "نادي كوت دازور، العقاب.", website: "https://www.ogcnice.com", type: "CLUB",
    },
    {
      name: "Stade Brestois 29", nameAr: "بريست", nameEn: "Stade Brestois 29",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade Francis-Le Ble", stadiumAr: "ستاد فرانسيس لو بلي",
      founded: "1950", history: "Revelation de Ligue 1, finaliste historique de la Champions League.", historyAr: "صاعد في الليغ 1، نهائي دوري أبطال تاريخي.", website: "https://www.stade-brestois.com", type: "CLUB",
    },
    {
      name: "RC Strasbourg", nameAr: "ستراسبورغ", nameEn: "Racing Club de Strasbourg Alsace",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade de la Meinau", stadiumAr: "ستاد دي لا مينو",
      founded: "1906", history: "Club alsacien avec une riche histoire.", historyAr: "نادي ألساسي بتاريخ غني.", website: "https://www.rcstrasbourgalsace.com", type: "CLUB",
    },
    {
      name: "Montpellier HSC", nameAr: "مونبلييه", nameEn: "Montpellier Herault Sport Club",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade de la Mosson", stadiumAr: "ستاد دي لا موسون",
      founded: "1919", history: "Champion de France 2012.", historyAr: "بطل فرنسا 2012.", website: "https://www.montpellier-hsc.com", type: "CLUB",
    },
    {
      name: "Toulouse FC", nameAr: "تولوز", nameEn: "Toulouse Football Club",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadium de Toulouse", stadiumAr: "ستاديوم تولوز",
      founded: "1937", history: "Vainqueur de la Coupe de France 2023.", historyAr: "فائز بكأس فرنسا 2023.", website: "https://www.tfc.info", type: "CLUB",
    },
    {
      name: "Nantes FC", nameAr: "نانت", nameEn: "Football Club de Nantes",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade de la Beaujoire", stadiumAr: "ستاد دي لا بوجوار",
      founded: "1943", history: "Les Canaris, 8 championnats de France.", historyAr: "الكناريو، 8 بطولات فرنسية.", website: "https://www.fc-nantes.com", type: "CLUB",
    },
    {
      name: "Le Havre AC", nameAr: "لوفال", nameEn: "Le Havre Athletic Club",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade Oceane", stadiumAr: "ستاد أوسيان",
      founded: "1872", history: "Le plus ancien club de football francais.", historyAr: "أقدم نادي كرة قدم فرنسي.", website: "https://www.havreac.net", type: "CLUB",
    },
    {
      name: "AJ Auxerre", nameAr: "أوكسير", nameEn: "Association de la Jeunesse Auxerroise",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade de l'Abbe-Deschamps", stadiumAr: "ستاد دي لآبي ديشامب",
      founded: "1905", history: "Champion de France 1996, formateur de talents.", historyAr: "بطل فرنسا 1996، مكون للمواهب.", website: "https://www.ajauxerre.fr", type: "CLUB",
    },
    {
      name: "FC Lorient", nameAr: "لوريان", nameEn: "Football Club Lorient-Bretagne Sud",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade du Moustoir", stadiumAr: "ستاد دو موستوار",
      founded: "1926", history: "Club breton, vainqueur de la Coupe de France 2002.", historyAr: "نادي بريتوني، فائز بكأس فرنسا 2002.", website: "https://www.fclorient.fr", type: "CLUB",
    },
    {
      name: "Clermont Foot", nameAr: "كليرمون", nameEn: "Clermont Foot Auvergne 63",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade Gabriel Montpied", stadiumAr: "ستاد غابرييل مونتيه",
      founded: "1990", history: "Club auvergnat en ascension.", historyAr: "نادي أوفيرني في صعود.", website: "https://www.clermontfoot.com", type: "CLUB",
    },
    {
      name: "FC Metz", nameAr: "ميتز", nameEn: "Football Club de Metz",
      country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade Saint-Symphorien", stadiumAr: "ستاد سان سيمفوريان",
      founded: "1932", history: "Club lorrain avec une histoire riche.", historyAr: "نادي لورين ب تاريخ غني.", website: "https://www.fcmetz.com", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // EREDIVISIE (UEFA)
    // ═══════════════════════════════════════════
    {
      name: "PSV Eindhoven", nameAr: "آيندهوفن", nameEn: "Philips Sport Vereniging",
      country: "Pays-Bas", countryAr: "هولندا", league: "Eredivisie", leagueAr: "الدوري الهولندي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Philips Stadion", stadiumAr: "فيليبس ستاديون",
      founded: "1913", history: "25 championnats des Pays-Bas, champion d'Europe 1988.", historyAr: "25 بطولة هولندية، بطل أوروبا 1988.", website: "https://www.psv.nl", type: "CLUB",
    },
    {
      name: "Ajax Amsterdam", nameAr: "أياكس", nameEn: "Amsterdamsche Football Club Ajax",
      country: "Pays-Bas", countryAr: "هولندا", league: "Eredivisie", leagueAr: "الدوري الهولندي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Johan Cruyff Arena", stadiumAr: "يوهان كرويف أرينا",
      founded: "1900", history: "L'un des plus grands clubs du monde, 4 Ligues des Champions.", historyAr: "واحد من أعظم الأندية في العالم، 4 دوري أبطال.", website: "https://www.ajax.nl", type: "CLUB",
    },
    {
      name: "Feyenoord", nameAr: "فيناورد", nameEn: "Feyenoord Rotterdam",
      country: "Pays-Bas", countryAr: "هولندا", league: "Eredivisie", leagueAr: "الدوري الهولندي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "De Kuip", stadiumAr: "دي كيب",
      founded: "1908", history: "Champion d'Europe en 1970, les Rotterdammers.", historyAr: "بطل أوروبا 1970، روتيردام.", website: "https://www.feyenoord.nl", type: "CLUB",
    },
    {
      name: "AZ Alkmaar", nameAr: "إيه زد ألكمار", nameEn: "Alkmaar Zaanstreek",
      country: "Pays-Bas", countryAr: "هولندا", league: "Eredivisie", leagueAr: "الدوري الهولندي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "AFAS Stadion", stadiumAr: "إيه إف إيه إس ستاديون",
      founded: "1967", history: "Club regional performant aux Pays-Bas.", historyAr: "نادي إقليمي ناجح في هولندا.", website: "https://www.az.nl", type: "CLUB",
    },
    {
      name: "FC Twente", nameAr: "توينته", nameEn: "Football Club Twente",
      country: "Pays-Bas", countryAr: "هولندا", league: "Eredivisie", leagueAr: "الدوري الهولندي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "De Grolsch Veste", stadiumAr: "دي غرولش فيسته",
      founded: "1965", history: "Champion des Pays-Bas 2010.", historyAr: "بطل هولندا 2010.", website: "https://www.fctwente.nl", type: "CLUB",
    },
    {
      name: "FC Utrecht", nameAr: "أوترخت", nameEn: "Football Club Utrecht",
      country: "Pays-Bas", countryAr: "هولندا", league: "Eredivisie", leagueAr: "الدوري الهولندي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadion Galgenwaard", stadiumAr: "ستاديون غالجنفارد",
      founded: "1970", history: "Club de la ville d'Utrecht.", historyAr: "نادي مدينة أوترخت.", website: "https://www.fc-utrecht.nl", type: "CLUB",
    },
    {
      name: "Vitesse", nameAr: "فيتيسه", nameEn: "Stichting Voetbal Club Vitesse",
      country: "Pays-Bas", countryAr: "هولندا", league: "Eredivisie", leagueAr: "الدوري الهولندي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "GelreDome", stadiumAr: "غيلريدوم",
      founded: "1892", history: "Club d'Arnhem, finaliste de la KNVB Cup.", historyAr: "نادي أرنهم، نهائي كأس الكأس الهولندي.", website: "https://www.vitesse.nl", type: "CLUB",
    },
    {
      name: "SC Heerenveen", nameAr: "هيرنفين", nameEn: "Sportclub Heerenveen",
      country: "Pays-Bas", countryAr: "هولندا", league: "Eredivisie", leagueAr: "الدوري الهولندي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Abe Lenstra Stadion", stadiumAr: "أبي لينسترا ستاديون",
      founded: "1920", history: "Club de Frise connu pour ses maillots a rayures.", historyAr: "نادي فريزيا معروف بقمصانه المخططة.", website: "https://www.heerenveen.nl", type: "CLUB",
    },
    {
      name: "FC Groningen", nameAr: "غرونينغن", nameEn: "Football Club Groningen",
      country: "Pays-Bas", countryAr: "هولندا", league: "Eredivisie", leagueAr: "الدوري الهولندي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Euroborg", stadiumAr: "يورو بورغ",
      founded: "1971", history: "Vainqueur de la KNVB Cup en 2024.", historyAr: "فائز بكأس KNVB عام 2024.", website: "https://www.fcgroningen.nl", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // BRASILEIRAO (CONMEBOL)
    // ═══════════════════════════════════════════
    {
      name: "Flamengo", nameAr: "فلامينغو", nameEn: "Clube de Regatas do Flamengo",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Maracana", stadiumAr: "ماراكانا",
      founded: "1895", history: "Le plus populaire du Bresil, 3 Libertadores.", historyAr: "الأكثر شعبية في البرازيل، 3 ليبرتادورس.", website: "https://www.flamengo.com.br", type: "CLUB",
    },
    {
      name: "Palmeiras", nameAr: "بالميراس", nameEn: "Sociedade Esportiva Palmeiras",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Allianz Parque", stadiumAr: "أليانز بارك",
      founded: "1914", history: "12 titres du Brasileirao, champion de la Libertadores 2021.", historyAr: "12 لقباً في الدوري البرازيلي، بطل الليبرتادورس 2021.", website: "https://www.palmeiras.com.br", type: "CLUB",
    },
    {
      name: "Corinthians", nameAr: "كورينثيانز", nameEn: "Sport Club Corinthians Paulista",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Neo Quimica Arena", stadiumAr: "نيو كيميتشا أرينا",
      founded: "1910", history: "Club populaire de Sao Paulo, champion du monde 2012.", historyAr: "نادي شعبي من ساو باولو، بطل العالم 2012.", website: "https://www.corinthians.com.br", type: "CLUB",
    },
    {
      name: "Sao Paulo FC", nameAr: "ساو باولو", nameEn: "Sao Paulo Futebol Clube",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Morumbi", stadiumAr: "مورومبي",
      founded: "1930", history: "3 Copa Libertadores, club le plus titre du Bresil en competitions internationales.", historyAr: "3 كوبا ليبرتادورس، أكثر الأندية تتويجاً في البرازيل في المسابقات الدولية.", website: "https://www.spfc.com", type: "CLUB",
    },
    {
      name: "Santos FC", nameAr: "سانتوس", nameEn: "Santos Futebol Clube",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Vila Belmiro", stadiumAr: "فيلا بيلميرو",
      founded: "1912", history: "Club de Pele, 2 Copa Libertadores.", historyAr: "نادي بيليه، 2 كوبا ليبرتادورس.", website: "https://www.santosfc.com.br", type: "CLUB",
    },
    {
      name: "Atletico Mineiro", nameAr: "أتلتيكو مينيرو", nameEn: "Clube Atletico Mineiro",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Arena Independencia", stadiumAr: "أرينا استقلالية",
      founded: "1908", history: "Champion du Bresil 2021.", historyAr: "بطل البرازيل 2021.", website: "https://www.atletico.com.br", type: "CLUB",
    },
    {
      name: "Fluminense FC", nameAr: "فولينينسي", nameEn: "Fluminense Football Club",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Maracana", stadiumAr: "ماراكانا",
      founded: "1902", history: "Champion de la Libertadores 2023.", historyAr: "بطل الليبرتادورس 2023.", website: "https://www.fluminense.com.br", type: "CLUB",
    },
    {
      name: "Gremio", nameAr: "غريميو", nameEn: "Gremio Foot-Ball Porto Alegrense",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Arena do Gremio", stadiumAr: "أرينا غريميو",
      founded: "1903", history: "3 Copa Libertadores, champion du monde 1983.", historyAr: "3 كوبا ليبرتادورس، بطل العالم 1983.", website: "https://www.gremio.net", type: "CLUB",
    },
    {
      name: "Internacional", nameAr: "إنترناسيونال", nameEn: "Sport Club Internacional",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Beira-Rio", stadiumAr: "بييرا ريو",
      founded: "1909", history: "2 Copa Libertadores, champion du monde 2010.", historyAr: "2 كوبا ليبرتادورس، بطل العالم 2010.", website: "https://www.internacional.com.br", type: "CLUB",
    },
    {
      name: "Vasco da Gama", nameAr: "فاسكو دا غاما", nameEn: "Club de Regatas Vasco da Gama",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Sao Januario", stadiumAr: "سانتو جانواريو",
      founded: "1898", history: "Club historique de Rio de Janeiro.", historyAr: "نادي تاريخي من ريو دي جانيرو.", website: "https://www.vascodagama.com.br", type: "CLUB",
    },
    {
      name: "Botafogo FR", nameAr: "بوتافوغو", nameEn: "Botafogo de Futebol e Regatas",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Nilton Santos", stadiumAr: "ملعب نيلتون سانتوس",
      founded: "1904", history: "Champion du Bresil en 2024.", historyAr: "بطل البرازيل في 2024.", website: "https://www.botafogo.com.br", type: "CLUB",
    },
    {
      name: "Cruzeiro EC", nameAr: "كروزيرو", nameEn: "Cruzeiro Esporte Clube",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Mineirao", stadiumAr: "مينيراو",
      founded: "1921", history: "4 titres du Brasileirao, 2 Copa Libertadores.", historyAr: "4 ألقاب في الدوري البرازيلي، 2 كوبا ليبرتادورس.", website: "https://www.cruzeiro.com.br", type: "CLUB",
    },
    {
      name: "EC Bahia", nameAr: "باهيا", nameEn: "Esporte Clube Bahia",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Arena Fonte Nova", stadiumAr: "أرينا فونتي نوفا",
      founded: "1931", history: "Club historique du Nordeste bresilien.", historyAr: "نادي تاريخي من شمال شرق البرازيل.", website: "https://www.ecbahia.com.br", type: "CLUB",
    },
    {
      name: "Sport Recife", nameAr: "سبورت ريسيفي", nameEn: "Sport Club do Recife",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Arena Pernambuco", stadiumAr: "أريما بيرنامبوكو",
      founded: "1931", history: "Club historique du Pernambouc.", historyAr: "نادي تاريخي من بيرنامبوكو.", website: "https://www.sportrecife.com.br", type: "CLUB",
    },
    {
      name: "Athletico Paranaense", nameAr: "أتلتيكو بارانينسي", nameEn: "Club Athletico Paranaense",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Arena da Baixada", stadiumAr: "أرينا دا بايكسيدا",
      founded: "1924", history: "Champion de la Copa do Brasil en 2019.", historyAr: "بطل كأس البرازيل في 2019.", website: "https://www.athletico.com.br", type: "CLUB",
    },
    {
      name: "Fortaleza EC", nameAr: "فورتاليزا", nameEn: "Fortaleza Esporte Clube",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Arena Castelao", stadiumAr: "أرينا كاستيليو",
      founded: "1913", history: "Club du Ceara en pleine ascension.", historyAr: "نادي من سيارا في صعود.", website: "https://www.fortaleza1913.com.br", type: "CLUB",
    },
    {
      name: "RB Bragantino", nameAr: "براغانتينو", nameEn: "Red Bull Bragantino",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Nabi Abi Chedid", stadiumAr: "ملعب نابي عبي شديد",
      founded: "1928", history: "Club du Sao Paulo soutenu par Red Bull.", historyAr: "نادي من ساو باولو مدعوم من ريد بول.", website: "https://www.redbullbragantino.com.br", type: "CLUB",
    },
    {
      name: "Goias EC", nameAr: "غوياس", nameEn: "Goias Esporte Clube",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Serra Dourada", stadiumAr: "ملعب سيرا دورادا",
      founded: "1943", history: "Club de Goiania.", historyAr: "نادي من غويانيا.", website: "https://www.goiasesporteclube.com.br", type: "CLUB",
    },
    {
      name: "Cuiaba EC", nameAr: "كويابا", nameEn: "Cuiaba Esporte Clube",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Arena Pantanal", stadiumAr: "أرينا بنتانال",
      founded: "2001", history: "Club du Mato Grosso, recent en Serie A.", historyAr: "نادي من ماتو غروسو، حديث في الدرجة الأولى.", website: "https://www.cuiabaec.com.br", type: "CLUB",
    },
    {
      name: "Sao Bernardo FC", nameAr: "ساو بيرناردو", nameEn: "Sao Bernardo Futebol Clube",
      country: "Bresil", countryAr: "البرازيل", league: "Brasileirao", leagueAr: "الدوري البرازيلي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio 1 de Maio", stadiumAr: "ملعب الأول من مايو",
      founded: "2004", history: "Club de la region metropolitaine de Sao Paulo.", historyAr: "نادي من المنطقة الحضرية لساو باولو.", website: "https://www.saobernardofc.com.br", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // LIGA PORTUGAL (UEFA)
    // ═══════════════════════════════════════════
    {
      name: "Sporting CP", nameAr: "سبورتينغ", nameEn: "Sporting Clube de Portugal",
      country: "Portugal", countryAr: "البرتغال", league: "Liga Portugal", leagueAr: "الدوري البرتغالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio Jose Alvalade", stadiumAr: "ملعب جوزيه ألفالادي",
      founded: "1906", history: "Les Leoes, 19 championnats du Portugal.", historyAr: "الأسود، 19 بطولة برتغالية.", website: "https://www.sporting.pt", type: "CLUB",
    },
    {
      name: "FC Porto", nameAr: "بورتو", nameEn: "Futebol Clube do Porto",
      country: "Portugal", countryAr: "البرتغال", league: "Liga Portugal", leagueAr: "الدوري البرتغالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio do Dragao", stadiumAr: "ملعب التنين",
      founded: "1893", history: "2 titres de Champions League, 30 championnats du Portugal.", historyAr: "2 لقب في دوري الأبطال، 30 بطولة برتغالية.", website: "https://www.fcporto.pt", type: "CLUB",
    },
    {
      name: "SL Benfica", nameAr: "بنفيكا", nameEn: "Sport Lisboa e Benfica",
      country: "Portugal", countryAr: "البرتغال", league: "Liga Portugal", leagueAr: "الدوري البرتغالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio da Luz", stadiumAr: "ملعب النور",
      founded: "1904", history: "Le club le plus titre du Portugal, 2 Champions League.", historyAr: "أكثر الأندية تتويجاً في البرتغال، 2 دوري أبطال.", website: "https://www.slbenfica.pt", type: "CLUB",
    },
    {
      name: "SC Braga", nameAr: "براغا", nameEn: "Sporting Clube de Braga",
      country: "Portugal", countryAr: "البرتغال", league: "Liga Portugal", leagueAr: "الدوري البرتغالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio Municipal de Braga", stadiumAr: "الملعب البلدي لبراغا",
      founded: "1921", history: "Club du Minho, vainqueur de la Taca de Portugal.", historyAr: "نادي من مينهو، فائز بكأس البرتغال.", website: "https://www.scbraga.pt", type: "CLUB",
    },
    {
      name: "Vitoria SC", nameAr: "فيتوريا", nameEn: "Vitoria Sport Clube",
      country: "Portugal", countryAr: "البرتغال", league: "Liga Portugal", leagueAr: "الدوري البرتغالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio D. Afonso Henriques", stadiumAr: "ملعب د. أفونسو هنريques",
      founded: "1922", history: "Les Conquistadores, club historique de Guimaraes.", historyAr: "الغزاة، نادي تاريخي من غيمارايش.", website: "https://www.vitoriasc.com", type: "CLUB",
    },
    {
      name: "Boavista FC", nameAr: "بوافيستا", nameEn: "Boavista Futebol Clube",
      country: "Portugal", countryAr: "البرتغال", league: "Liga Portugal", leagueAr: "الدوري البرتغالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio do Bessa", stadiumAr: "ملعب بيسا",
      founded: "1903", history: "Champion du Portugal en 2001, le Club des As.", historyAr: "بطل البرتغال عام 2001، نادي الأسات.", website: "https://www.boavista.pt", type: "CLUB",
    },
    {
      name: "Gil Vicente FC", nameAr: "غيل فيسنتي", nameEn: "Gil Vicente Futebol Clube",
      country: "Portugal", countryAr: "البرتغال", league: "Liga Portugal", leagueAr: "الدوري البرتغالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio Cidade de Barcelos", stadiumAr: "ملعب مدينة بارسيلوس",
      founded: "1923", history: "Club de Barcelos nomme d'apres le dramaturge.", historyAr: "نادي من بارسيلوس سمّي على اسم كاتب المسرح.", website: "https://www.gilvicente.fc.pt", type: "CLUB",
    },
    {
      name: "Casa Pia AC", nameAr: "كازا بيا", nameEn: "Casa Pia Atletico Clube",
      country: "Portugal", countryAr: "البرتغال", league: "Liga Portugal", leagueAr: "الدوري البرتغالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio Nacional", stadiumAr: "الملعب الوطني",
      founded: "1920", history: "Club lisboete en pleine ascension.", historyAr: "نادي لشبوني في صعود.", website: "https://www.casapia.pt", type: "CLUB",
    },
    {
      name: "Estoril Praia", nameAr: "إستوريل", nameEn: "Grupo Desportivo Estoril Praia",
      country: "Portugal", countryAr: "البرتغال", league: "Liga Portugal", leagueAr: "الدوري البرتغالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio Antonio Coimbra da Mota", stadiumAr: "ملعب أنطونيو كيمبرا دا موتا",
      founded: "1939", history: "Club de la Cote d'Estoril.", historyAr: "نادي ساحل إستوريل.", website: "https://www.gdeportivoestorilpraia.com", type: "CLUB",
    },
    {
      name: "Rio Ave FC", nameAr: "ريو أفي", nameEn: "Rio Ave Futebol Clube",
      country: "Portugal", countryAr: "البرتغال", league: "Liga Portugal", leagueAr: "الدوري البرتغالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio dos Arcos", stadiumAr: "ملعب أركوس",
      founded: "1939", history: "Club de Vila do Conde.", historyAr: "نادي من فيلا دو كوندي.", website: "https://www.rioavefc.pt", type: "CLUB",
    },
    {
      name: "Portimonense SC", nameAr: "بورتيمونينسي", nameEn: "Portimonense Sporting Clube",
      country: "Portugal", countryAr: "البرتغار", league: "Liga Portugal", leagueAr: "الدوري البرتغالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio Municipal de Portimao", stadiumAr: "الملعب البلدي لبورتيماو",
      founded: "1914", history: "Club de l'Algarve.", historyAr: "نادي الغرب.", website: "https://www.portimonensesc.com", type: "CLUB",
    },
    {
      name: "Arouca FC", nameAr: "أروكا", nameEn: "Futebol Clube de Arouca",
      country: "Portugal", countryAr: "البرتغال", league: "Liga Portugal", leagueAr: "الدوري البرتغالي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio Municipal de Arouca", stadiumAr: "الملعب البلدي لأروكا",
      founded: "1951", history: "Club de l'Aveiro en finale de Taca de Portugal.", historyAr: "نادي من أفييرو في نهائي كأس البرتغال.", website: "https://www.fcarouca.pt", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // LIGA PROFESIONAL ARGENTINA (CONMEBOL)
    // ═══════════════════════════════════════════
    {
      name: "Boca Juniors", nameAr: "بوكا جونيورز", nameEn: "Club Atletico Boca Juniors",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "La Bombonera", stadiumAr: "لا بومبونيرا",
      founded: "1905", history: "Le club le plus populaire d'Argentine, 6 Libertadores.", historyAr: "أكثر الأندية شعبية في الأرجنتين، 6 ليبرتادورس.", website: "https://www.bocajuniors.com.ar", type: "CLUB",
    },
    {
      name: "River Plate", nameAr: "ريفر بليت", nameEn: "Club Atletico River Plate",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Mas Monumental", stadiumAr: "الملعب الأكبر نهائياً",
      founded: "1901", history: "Le Grand, champion d'Amerique du Sud.", historyAr: "العملاق، بطل أمريكا الجنوبية.", website: "https://www.cariverplate.com.ar", type: "CLUB",
    },
    {
      name: "Velez Sarsfield", nameAr: "فيليز سارسفيلد", nameEn: "Club Atletico Velez Sarsfield",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Jose Amalfitani", stadiumAr: "ملعب خوسيه أمالفيتاني",
      founded: "1910", history: "Champion de la Copa Libertadores 1994.", historyAr: "بطل كوبا ليبرتادورس 1994.", website: "https://www.velezsarfield.com.ar", type: "CLUB",
    },
    {
      name: "Racing Club", nameAr: "رايسينغ", nameEn: "Racing Club de Avellaneda",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Presidente Peron", stadiumAr: "ملعب الرئيس بيرون",
      founded: "1903", history: "La Academia, champion de la Copa Sudamericana 2024.", historyAr: "الأكاديمية، بطل كوبا سود أمريكانا 2024.", website: "https://www.racingclub.com.ar", type: "CLUB",
    },
    {
      name: "Independiente", nameAr: "إنديبندينتي", nameEn: "Club Atletico Independiente",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Libertadores de America", stadiumAr: "ملعب أبطال الليبرتادورس",
      founded: "1905", history: "El Rey de Copas, 7 Copa Libertadores, record absolu.", historyAr: "ملك الكؤوس، 7 كوبا ليبرتادورس، رقم قياسي.", website: "https://www.clubaindependiente.com", type: "CLUB",
    },
    {
      name: "San Lorenzo", nameAr: "سان لورينزو", nameEn: "Club Atletico San Lorenzo de Almagro",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Pedro Bidegain", stadiumAr: "ملعب بيدرو بيدغيين",
      founded: "1908", history: "Les Ciclones, champion de la Copa Libertadores 2014.", historyAr: "الإعاصير، بطل كوبا ليبرتادورس 2014.", website: "https://www.sanlorenzo.com.ar", type: "CLUB",
    },
    {
      name: "Estudiantes", nameAr: "إستوديانتس", nameEn: "Club Estudiantes de La Plata",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Jorge Luis Hirschi", stadiumAr: "ملعب خورخي لويس هيرشي",
      founded: "1905", history: "4 Copa Libertadores, club historique de La Plata.", historyAr: "4 كوبا ليبرتادورس، نادي تاريخي من لا بلاتا.", website: "https://www.edlp.com.ar", type: "CLUB",
    },
    {
      name: "Lanus", nameAr: "لانوس", nameEn: "Club Atletico Lanus",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Ciudad de Lanus", stadiumAr: "ملعب مدينة لانوس",
      founded: "1915", history: "Champion de la Copa Sudamericana 2013.", historyAr: "بطل كوبا سود أمريكانا 2013.", website: "https://www.clublanus.com.ar", type: "CLUB",
    },
    {
      name: "Newell's Old Boys", nameAr: "نولز أولد بويز", nameEn: "Club Atletico Newell's Old Boys",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Marcelo Bielsa", stadiumAr: "ملعب مارسيلو بيلسا",
      founded: "1903", history: "Club de Rosario, forme Messi et Maradona.", historyAr: "نادي من روساريو، كوّن ميسي ومارادونا.", website: "https://www.newellsoldboys.com.ar", type: "CLUB",
    },
    {
      name: "Gimnasia La Plata", nameAr: "غيمناسيا", nameEn: "Club de Gimnasia y Esgrima La Plata",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Juan Carmelo Zerillo", stadiumAr: "ملعب خوان كارميلو زيرييو",
      founded: "1887", history: "L'un des plus anciens clubs d'Amerique du Sud.", historyAr: "أحد أقدم الأندية في أمريكا الجنوبية.", website: "https://www.gimnasia.org.ar", type: "CLUB",
    },
    {
      name: "Defensa y Justicia", nameAr: "ديفينسا وخيستيسيا", nameEn: "Club Social y Deportivo Defensa y Justicia",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Norberto Tomaghello", stadiumAr: "ملعب نوربيرتو توماغيلو",
      founded: "1935", history: "Vainqueur de la Copa Sudamericana 2020.", historyAr: "فائز بكوبا سود أمريكانا 2020.", website: "https://www.defensayjusticia.com.ar", type: "CLUB",
    },
    {
      name: "Colon", nameAr: "كولون", nameEn: "Club Atletico Colon",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Brigadier General Estanislao Lopez", stadiumAr: "ملعب الجنرال إستانيسلاو لوبيز",
      founded: "1905", history: "Champion de la Copa Sudamericana 2021, club de Santa Fe.", historyAr: "بطل كوبا سود أمريكانا 2021، نادي سانتا في.", website: "https://www.clubcolon.com.ar", type: "CLUB",
    },
    {
      name: "Argentinos Juniors", nameAr: "أرجنتينوس جونيورز", nameEn: "Club Atletico Argentinos Juniors",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Diego Armando Maradona", stadiumAr: "ملعب دييغو أرماندو مارادونا",
      founded: "1904", history: "Club de Maradona, champion de la Copa Libertadores 1985.", historyAr: "نادي مارادونا، بطل كوبا ليبرتادورس 1985.", website: "https://www.argentinosjuniors.com.ar", type: "CLUB",
    },
    {
      name: "Belgrano", nameAr: "بلغرانو", nameEn: "Club Atletico Belgrano",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Julio Cesar Villagra", stadiumAr: "ملعب خوليو سيزار فيلاقرة",
      founded: "1905", history: "Club de Cordoue, le Pirata.", historyAr: "نادي من قرطبة، القراصنة.", website: "https://www.belgrano.com.ar", type: "CLUB",
    },
    {
      name: "Talleres", nameAr: "تاليما", nameEn: "Club Atletico Talleres",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Mario Alberto Kempes", stadiumAr: "ملعب ماريو ألبرتو كيمبس",
      founded: "1913", history: "Club historique de Cordoue, finaliste de la Libertadores.", historyAr: "نادي تاريخي من قرطبة، نهائي الليبرتادورس.", website: "https://www.clubtalleres.com.ar", type: "CLUB",
    },
    {
      name: "Union", nameAr: "يونيون", nameEn: "Club Atletico Union",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio 15 de Abril", stadiumAr: "ملعب 15 أبريل",
      founded: "1907", history: "Club de Santa Fe, champion argentin 2023.", historyAr: "نادي سانتا في، بطل الأرجنتين 2023.", website: "https://www.uniondecor.com.ar", type: "CLUB",
    },
    {
      name: "Banfield", nameAr: "بانفيلد", nameEn: "Club Atletico Banfield",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Florencio Sola", stadiumAr: "ملعب فلورينسيو سولا",
      founded: "1896", history: "Club historique du Grand Buenos Aires.", historyAr: "نادي تاريخي من بوينس آيرس الكبرى.", website: "https://www.clubbanfield.com.ar", type: "CLUB",
    },
    {
      name: "Tigre", nameAr: "تيغر", nameEn: "Club Atletico Tigre",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Jose Dellagiovanna", stadiumAr: "ملعب خوسيه ديلاغيوفانا",
      founded: "1902", history: "Club de Victoria, champion de la Copa de la Superliga 2019.", historyAr: "نادي فيكتوريا، بطل كوبا سوبر ليغا 2019.", website: "https://www.clubtigre.com.ar", type: "CLUB",
    },
    {
      name: "Sarmiento", nameAr: "سارمينتو", nameEn: "Club Atletivo Sarmiento",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Eva Peron", stadiumAr: "ملعب إيفا بيرون",
      founded: "1911", history: "Club de Junin, recent en Serie A.", historyAr: "نادي من خونين، حديث في الدرجة الأولى.", website: "https://www.clubsarmiento.com.ar", type: "CLUB",
    },
    {
      name: "Central Cordoba", nameAr: "سنترال قرطبة", nameEn: "Club Atletico Central Cordoba",
      country: "Argentine", countryAr: "الأرجنتين", league: "Liga Profesional", leagueAr: "الدوري الأرجنتيني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Alfredo Terrera", stadiumAr: "ملعب ألفريدو تيريرا",
      founded: "1906", history: "Club de Santiago del Estero.", historyAr: "نادي من سانتياغو ديل إيستيرو.", website: "https://www.centralcordoba.com.ar", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // SUPER LIG TURKEY (UEFA)
    // ═══════════════════════════════════════════
    {
      name: "Galatasaray SK", nameAr: "غالاتاسراي", nameEn: "Galatasaray Spor Kulubu",
      country: "Turquie", countryAr: "تركيا", league: "Super Lig", leagueAr: "الدوري التركي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "RAMS Park", stadiumAr: "رامز بارك",
      founded: "1905", history: "Le club le plus titre de Turquie, vainqueur de la Coupe UEFA 2000.", historyAr: "أكثر الأندية تتويجاً في تركيا، فائز بكأس الاتحاد الأوروبي 2000.", website: "https://www.galatasaray.org", type: "CLUB",
    },
    {
      name: "Fenerbahce SK", nameAr: "فنربختشه", nameEn: "Fenerbahce Spor Kulubu",
      country: "Turquie", countryAr: "تركيا", league: "Super Lig", leagueAr: "الدوري التركي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Sukru Saracoglu", stadiumAr: "شوكرو ساراش أوغلو",
      founded: "1907", history: "19 championnats turcs, rival historique de Galatasaray.", historyAr: "19 بطولة تركية، منافس غالاتاسراي التاريخي.", website: "https://www.fenerbahce.org", type: "CLUB",
    },
    {
      name: "Besiktas JK", nameAr: "بشكتاش", nameEn: "Besiktas Jimnastik Kulubu",
      country: "Turquie", countryAr: "تركيا", league: "Super Lig", leagueAr: "الدوري التركي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Tupras Stadyumu", stadiumAr: "توبراش ستاديوم",
      founded: "1903", history: "Les Aigles Noirs, club historique d'Istanbul.", historyAr: "النسور السوداء، نادي تاريخي من إسطنبول.", website: "https://www.besiktas.com.tr", type: "CLUB",
    },
    {
      name: "Trabzonspor", nameAr: "طرابزون سبور", nameEn: "Trabzonspor Kulubu",
      country: "Turquie", countryAr: "تركيا", league: "Super Lig", leagueAr: "الدوري التركي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Senol Gunes Stadium", stadiumAr: "ستاد شينول غونيش",
      founded: "1967", history: "Champion de Turquie 2022, le grand rival anatolien.", historyAr: "بطل تركيا 2022، المنافس الأناضولي الكبير.", website: "https://www.trabzonspor.com.tr", type: "CLUB",
    },
    {
      name: "Istanbul Basaksehir", nameAr: "إسطنبول باشاكشهير", nameEn: "Istanbul Basaksehir Futbol Kulubu",
      country: "Turquie", countryAr: "تركيا", league: "Super Lig", leagueAr: "الدوري التركي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Basaksehir Fatih Terim", stadiumAr: "باشاكشهير فاتح تيريم",
      founded: "2014", history: "Champion de Turquie en 2020.", historyAr: "بطل تركيا عام 2020.", website: "https://www.ibfk.gov.tr", type: "CLUB",
    },
    {
      name: "Antalyaspor", nameAr: "أنطاليا سبور", nameEn: "Antalyaspor Kulubu",
      country: "Turquie", countryAr: "تركيا", league: "Super Lig", leagueAr: "الدوري التركي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Antalya Stadium", stadiumAr: "ملعب أنطاليا",
      founded: "1966", history: "Club de la cote mediterraneenne turque.", historyAr: "نادي ساحل البحر الأبيض المتوسط التركي.", website: "https://www.antalyaspor.com.tr", type: "CLUB",
    },
    {
      name: "Adana Demirspor", nameAr: "أضنة دمير سبور", nameEn: "Adana Demirspor Kulubu",
      country: "Turquie", countryAr: "تركيا", league: "Super Lig", leagueAr: "الدوري التركي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Yeni Adana Stadium", stadiumAr: "ستاديوم أضنة الجديد",
      founded: "1940", history: "Club historique d'Adana de retour en Super Lig.", historyAr: "نادي تاريخي من أضنة عاد إلى الدوري الممتاز.", website: "https://www.adanademirspor.com.tr", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // OTHER LEAGUES (UEFA)
    // ═══════════════════════════════════════════
    {
      name: "Celtic FC", nameAr: "سيلتيك", nameEn: "The Celtic Football Club",
      country: "Ecosse", countryAr: "اسكتلندا", league: "Scottish Premiership", leagueAr: "الدوري الاسكتلندي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Celtic Park", stadiumAr: "سيلتيك بارك",
      founded: "1887", history: "Club historique de Glasgow, finaliste europeen en 1967.", historyAr: "نادي تاريخي من غلاسكو، نهائي أوروبي 1967.", website: "https://www.celticfc.com", type: "CLUB",
    },
    {
      name: "Rangers FC", nameAr: "رينجرز", nameEn: "Rangers Football Club",
      country: "Ecosse", countryAr: "اسكتلندا", league: "Scottish Premiership", leagueAr: "الدوري الاسكتلندي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Ibrox Stadium", stadiumAr: "إيبروكس ستاديوم",
      founded: "1872", history: "55 titres de champion d'Ecosse, record mondial.", historyAr: "55 لقباً في الدوري الاسكتلندي، رقم قياسي عالمي.", website: "https://www.rangers.co.uk", type: "CLUB",
    },
    {
      name: "RSC Anderlecht", nameAr: "أندرلخت", nameEn: "Royal Sporting Club Anderlecht",
      country: "Belgique", countryAr: "بلجيكا", league: "Jupiler Pro League", leagueAr: "الدوري البلجيكي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Lotto Park", stadiumAr: "لوتو بارك",
      founded: "1908", history: "Le club le plus titre de Belgique, 34 championnats.", historyAr: "أكثر الأندية تتويجاً في بلجيكا، 34 بطولة.", website: "https://www.anderlecht.be", type: "CLUB",
    },
    {
      name: "Club Brugge", nameAr: "كلوب بروج", nameEn: "Club Brugge Koninklijke Voetbalvereniging",
      country: "Belgique", countryAr: "بلجيكا", league: "Jupiler Pro League", leagueAr: "الدوري البلجيكي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Jan Breydel Stadium", stadiumAr: "يان بريدل ستاديوم",
      founded: "1891", history: "Champion de Belgique, finaliste de la Champions League 1978.", historyAr: "بطل بلجيكا، نهائي دوري الأبطال 1978.", website: "https://www.clubbrugge.be", type: "CLUB",
    },
    {
      name: "Standard Liege", nameAr: "ستاندارد لييج", nameEn: "Royal Standard de Liege",
      country: "Belgique", countryAr: "بلجيكا", league: "Jupiler Pro League", leagueAr: "الدوري البلجيكي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade Maurice Dufrasne", stadiumAr: "ستاد موريس دوفراسن",
      founded: "1898", history: "Club historique de Liege, 10 titres de champion.", historyAr: "نادي تاريخي من لييج، 10 ألقاب.", website: "https://www.standard.be", type: "CLUB",
    },
    {
      name: "Red Bull Salzburg", nameAr: "ريد بول سالزبورغ", nameEn: "FC Red Bull Salzburg",
      country: "Autriche", countryAr: "النمسا", league: "Austrian Bundesliga", leagueAr: "الدوري النمساوي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Red Bull Arena", stadiumAr: "ريد بول أرينا",
      founded: "1933", history: "Club dominant du football autrichien, 17 titres.", historyAr: "النادي المهيمن في كرة القدم النمساوية، 17 لقباً.", website: "https://www.redbullsalzburg.at", type: "CLUB",
    },
    {
      name: "SK Sturm Graz", nameAr: "شتو름 غراتس", nameEn: "SK Sturm Graz",
      country: "Autriche", countryAr: "النمسا", league: "Austrian Bundesliga", leagueAr: "الدوري النمساوي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Merkur Arena", stadiumAr: "مركور أرينا",
      founded: "1909", history: "Champion d'Autriche en 2024.", historyAr: "بطل النمسا عام 2024.", website: "https://www.sksturm.at", type: "CLUB",
    },
    {
      name: "Slavia Prague", nameAr: "슬라비ا براغ", nameEn: "SK Slavia Praha",
      country: "Republique tcheque", countryAr: "التشيك", league: "Czech First League", leagueAr: "الدوري التشيكي الأول",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadion Eden", stadiumAr: "ستاديون إيدن",
      founded: "1892", history: "Club le plus titre de Republique tcheque.", historyAr: "أكثر الأندية تتويجاً في جمهورية التشيك.", website: "https://www.slavia.cz", type: "CLUB",
    },
    {
      name: "Sparta Prague", nameAr: "سبارتا براغ", nameEn: "AC Sparta Praha",
      country: "Republique tcheque", countryAr: "التشيك", league: "Czech First League", leagueAr: "الدوري التشيكي الأول",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadion Letna", stadiumAr: "ستاديون ليتنا",
      founded: "1893", history: "Rival historique du Slavia, 37 championnats.", historyAr: "منافس سلافا التاريخي، 37 بطولة.", website: "https://www.sparta.cz", type: "CLUB",
    },
    {
      name: "Legia Warsaw", nameAr: "ليغيا وارسو", nameEn: "Legia Warszawa",
      country: "Pologne", countryAr: "بولندا", league: "Ekstraklasa", leagueAr: "الدوري البولندي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadion Wojska Polskiego", stadiumAr: "ستاديون ووجيكا بولسكيغو",
      founded: "1916", history: "Le club le plus titre de Pologne, 16 championnats.", historyAr: "أكثر الأندية تتويجاً في بولندا، 16 بطولة.", website: "https://www.legia.com", type: "CLUB",
    },
    {
      name: "Lech Poznan", nameAr: "ليخ بوزنان", nameEn: "Kolejorz Lech Poznan",
      country: "Pologne", countryAr: "بولندا", league: "Ekstraklasa", leagueAr: "الدوري البولندي",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadion Miejski", stadiumAr: "ستاديون مييسكي",
      founded: "1922", history: "Champion de Pologne a plusieurs reprises.", historyAr: "بطل بولندا عدة مرات.", website: "https://www.lechpoznan.pl", type: "CLUB",
    },
    {
      name: "Shakhtar Donetsk", nameAr: "شاختار دونيتسك", nameEn: "FC Shakhtar Donetsk",
      country: "Ukraine", countryAr: "أوكرانيا", league: "Ukrainian Premier League", leagueAr: "الدوري الأوكراني الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Arena Lviv", stadiumAr: "أرينا لفيف",
      founded: "1936", history: "Champion d'Europe 2009 (Copa Europa), club ukrainien le plus titré.", historyAr: "بطل أوروبا 2009 (كأس الاتحاد)، أكثر الأندية الأوكرانية تتويجاً.", website: "https://www.shakhtar.com", type: "CLUB",
    },
    {
      name: "Dynamo Kyiv", nameAr: "دينامو كييف", nameEn: "FC Dynamo Kyiv",
      country: "Ukraine", countryAr: "أوكرانيا", league: "Ukrainian Premier League", leagueAr: "الدوري الأوكراني الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "NSK Olimpiyskiy", stadiumAr: "إن إس كيه أولمبيسكي",
      founded: "1927", history: "Club historique d'Ukraine, demi-finaliste de la C1.", historyAr: "نادي تاريخي من أوكرانيا، نصف نهائي دوري الأبطال.", website: "https://www.fcdynamo.kiev.ua", type: "CLUB",
    },
    {
      name: "FC Copenhagen", nameAr: "كوبنهاغن", nameEn: "Fodbold Club Kobenhavn",
      country: "Danemark", countryAr: "الدنمارك", league: "Danish Superliga", leagueAr: "الدوري الدنماركي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Parken Stadium", stadiumAr: "باركين ستاديوم",
      founded: "1992", history: "Club dominant du Danemark, quarts de finale de Ligue des Champions.", historyAr: "النادي المهيمن في الدنمارك، ربع نهائي دوري الأبطال.", website: "https://www.fck.dk", type: "CLUB",
    },
    {
      name: "Rosenborg BK", nameAr: "روزنبورغ", nameEn: "Rosenborg Ballklub",
      country: "Norvege", countryAr: "النرويج", league: "Eliteserien", leagueAr: "الدوري النرويجي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Lerkendal Stadion", stadiumAr: "ليركنDAL ستاديون",
      founded: "1917", history: "26 titres de champion de Norvege, record.", historyAr: "26 بطولة نرويجية، رقم قياسي.", website: "https://www.rbk.no", type: "CLUB",
    },
    {
      name: "Malmö FF", nameAr: "مالمو", nameEn: "Malmo Fotbollforening",
      country: "Suede", countryAr: "السويد", league: "Allsvenskan", leagueAr: "الدوري السويدي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Eleda Stadion", stadiumAr: "إيليدا ستاديون",
      founded: "1910", history: "Le plus titre de Suede, finaliste de la C1 en 1979.", historyAr: "الأكثر تتويجاً في السويد، نهائي دوري الأبطال 1979.", website: "https://www.mff.se", type: "CLUB",
    },
    {
      name: "Dinamo Zagreb", nameAr: "دينامو زغرب", nameEn: "Građanski nogometni klub Dinamo Zagreb",
      country: "Croatie", countryAr: "كرواتيا", league: "Croatian First Football League", leagueAr: "الدوري الكرواتي الأول",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadion Maksimir", stadiumAr: "ستاديون ماكسيمير",
      founded: "1911", history: "24 titres de champion de Croatie.", historyAr: "24 بطولة كرواتية.", website: "https://www.gnkdinamo.hr", type: "CLUB",
    },
    {
      name: "Hajduk Split", nameAr: "هايدوك سبليت", nameEn: "Hajduk Split",
      country: "Croatie", countryAr: "كرواتيا", league: "Croatian First Football League", leagueAr: "الدوري الكرواتي الأول",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadion Poljud", stadiumAr: "ستاديون بولجود",
      founded: "1911", history: "Club historique de Split, rival de Dinamo Zagreb.", historyAr: "نادي تاريخي من سبليت، منافس دينامو زغرب.", website: "https://www.hajduk.hr", type: "CLUB",
    },
    {
      name: "Red Star Belgrade", nameAr: "النجم الأحمر", nameEn: "Fudbalski klub Crvena Zvezda",
      country: "Serbie", countryAr: "صربيا", league: "Serbian SuperLiga", leagueAr: "الدوري الصربي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Rajko Mitić Stadium", stadiumAr: "ستاديون رايكو ميتيتش",
      founded: "1945", history: "Champion d'Europe en 1991, club le plus titré de Serbie.", historyAr: "بطل أوروبا 1991، أكثر الأندية تتويجاً في صربيا.", website: "https://www.crvenazvezdafk.com", type: "CLUB",
    },
    {
      name: "Partizan Belgrade", nameAr: "بارتيزان بلغراد", nameEn: "Fudbalski klub Partizan",
      country: "Serbie", countryAr: "صربيا", league: "Serbian SuperLiga", leagueAr: "الدوري الصربي الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Partizan Stadium", stadiumAr: "ستاديون بارتيزان",
      founded: "1945", history: "Finaliste de la C1 en 1966, rival historique du Red Star.", historyAr: "نهائي دوري الأبطال 1966، منافس النجم الأحمر التاريخي.", website: "https://www.partizan.rs", type: "CLUB",
    },
    {
      name: "Olympiacos FC", nameAr: "أوليمبياكوس", nameEn: "Olympiacos Football Club",
      country: "Grece", countryAr: "اليونان", league: "Super League Greece", leagueAr: "الدوري اليوناني الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Georgios Karaiskakis", stadiumAr: "جورجيوس كارايسكاكيس",
      founded: "1925", history: "47 championnats de Grece, record absolu.", historyAr: "47 بطولة يونانية، رقم قياسي.", website: "https://www.olympiacosfc.gr", type: "CLUB",
    },
    {
      name: "Panathinaikos FC", nameAr: "باناثينايكوس", nameEn: "Panathinaikos Football Club",
      country: "Grece", countryAr: "اليونان", league: "Super League Greece", leagueAr: "الدوري اليوناني الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Apostolos Nikolaidis Stadium", stadiumAr: "ستاديون أوبوستولوس نيكولايدس",
      founded: "1908", history: "Finaliste de la C1 en 1971, club historique d'Athenes.", historyAr: "نهائي دوري الأبطال 1971، نادي تاريخي من أثينا.", website: "https://www.panh.gr", type: "CLUB",
    },
    {
      name: "AEK Athens", nameAr: "AEK أثينا", nameEn: "AEK Athens Football Club",
      country: "Grece", countryAr: "اليونان", league: "Super League Greece", leagueAr: "الدوري اليوناني الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Agia Sophia Stadium", stadiumAr: "ستاديون آيا صوفيا",
      founded: "1924", history: "Club d'Athenes fondé par des refugies grecs.", historyAr: "نادي أثينا أسسه لاجئون يونانيون.", website: "https://www.aekfc.gr", type: "CLUB",
    },
    {
      name: "PAOK FC", nameAr: "باوك", nameEn: "PAOK Football Club",
      country: "Grece", countryAr: "اليونان", league: "Super League Greece", leagueAr: "الدوري اليوناني الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Toumba Stadium", stadiumAr: "ستاديون تومبا",
      founded: "1926", history: "Club de Thessalonique, champion de Grece 2019.", historyAr: "نادي من سالونيك، بطل اليونان 2019.", website: "https://www.paokfc.gr", type: "CLUB",
    },
    {
      name: "Ferencvaros TC", nameAr: "فرنتسفاروشي", nameEn: "Ferencvarosi Torna Club",
      country: "Hongrie", countryAr: "المجر", league: "NB I", leagueAr: "الدوري المجري الأول",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Groupama Arena", stadiumAr: "غروباما أرينا",
      founded: "1899", history: "Le plus titre de Hongrie, 33 championnats.", historyAr: "الأكثر تتويجاً في المجر، 33 بطولة.", website: "https://www.fradi.hu", type: "CLUB",
    },
    {
      name: "FCSB", nameAr: "إف سي إس بي", nameEn: "Fotbal Club FCSB",
      country: "Roumanie", countryAr: "رومانيا", league: "Liga I", leagueAr: "الدوري الروماني الأول",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Arena Nationala", stadiumAr: "الملعب الوطني",
      founded: "1947", history: "Anciennement Steaua Bucarest, champion d'Europe en 1986.", historyAr: "سابقاً ستيوا بوخارست، بطل أوروبا 1986.", website: "https://www.fcsb.com", type: "CLUB",
    },
    {
      name: "CFR Cluj", nameAr: "CFR كلوج", nameEn: "Fotbal Club CFR 1907 Cluj",
      country: "Roumanie", countryAr: "رومانيا", league: "Liga I", leagueAr: "الدوري الروماني الأول",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadionul Dr. Constantin Radulescu", stadiumAr: "ستاديونول د. كونستانتين رادوليسكو",
      founded: "1907", history: "Club dominant en Roumanie ces dernieres annees.", historyAr: "النادي المهيمن في رومانيا في السنوات الأخيرة.", website: "https://www.cfrcluj.ro", type: "CLUB",
    },
    {
      name: "BSC Young Boys", nameAr: "يونغ بويز", nameEn: "Berner Sport Club Young Boys",
      country: "Suisse", countryAr: "سويسرا", league: "Swiss Super League", leagueAr: "الدوري السويسري الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadion Wankdorf", stadiumAr: "ستاديون وانكورف",
      founded: "1898", history: "Champion de Suisse en 2023, surprise europeenne.", historyAr: "بطل سويسرا 2023، مفاجأة أوروبية.", website: "https://www.bscyb.ch", type: "CLUB",
    },
    {
      name: "FC Basel", nameAr: "بازل", nameEn: "Fussball-Club Basel 1893",
      country: "Suisse", countryAr: "سويسرا", league: "Swiss Super League", leagueAr: "الدوري السويسري الممتاز",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "St. Jakob-Park", stadiumAr: "سانت ياكوب بارك",
      founded: "1893", history: "20 titres de champion de Suisse.", historyAr: "20 بطولة سويسرية.", website: "https://www.fcb.ch", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // SOUTH AMERICAN CLUBS (CONMEBOL)
    // ═══════════════════════════════════════════
    {
      name: "Club Nacional", nameAr: "ناسيونال", nameEn: "Club Nacional de Football",
      country: "Uruguay", countryAr: "أوروغواي", league: "Primera Division", leagueAr: "الدوري الأوروغواياني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Gran Parque Central", stadiumAr: "الملعب الكبير بارك سنت럴",
      founded: "1899", history: "Club le plus titré d'Uruguay, 3 Libertadores.", historyAr: "أكثر الأندية تتويجاً في أوروغواي، 3 ليبرتادورس.", website: "https://www.nacional.uy", type: "CLUB",
    },
    {
      name: "Penarol", nameAr: "بينارول", nameEn: "Club Atletico Penarol",
      country: "Uruguay", countryAr: "أوروغواي", league: "Primera Division", leagueAr: "الدوري الأوروغواياني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Campeon del Siglo", stadiumAr: "ملعب بطل القرن",
      founded: "1891", history: "3 Libertadores, 50 championnats d'Uruguay.", historyAr: "3 ليبرتادورس، 50 بطولة أوروغوايانية.", website: "https://www.peñarol.org", type: "CLUB",
    },
    {
      name: "Atletico Nacional", nameAr: "أتلتيكو ناسيونال", nameEn: "Atletico Nacional S.A.",
      country: "Colombie", countryAr: "كولومبيا", league: "Liga BetPlay", leagueAr: "الدوري الكولومبي",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Atanasio Girardot", stadiumAr: "ملعب أتاناسيو غيراردوت",
      founded: "1947", history: "Le plus titré de Colombie, 2 Copa Libertadores.", historyAr: "الأكثر تتويجاً في كولومبيا، 2 كوبا ليبرتادورس.", website: "https://www.atnacional.com", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // OTHER INTERNATIONAL CLUBS
    // ═══════════════════════════════════════════
    {
      name: "CD Guadalajara", nameAr: "غوادالاخارا", nameEn: "Club Deportivo Guadalajara",
      country: "Mexique", countryAr: "المكسيك", league: "Liga MX", leagueAr: "الدوري المكسيكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Estadio Akron", stadiumAr: "ملعب أكرون",
      founded: "1906", history: "Chivas, le club le plus titré du Mexique.", historyAr: "شيفاس، أكثر الأندية تتويجاً في المكسيك.", website: "https://www.chivasdecorazon.com", type: "CLUB",
    },
    {
      name: "Club America", nameAr: " أمريكا", nameEn: "Club America",
      country: "Mexique", countryAr: "المكسيك", league: "Liga MX", leagueAr: "الدوري المكسيكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Estadio Azteca", stadiumAr: "ملعب أزتيكا",
      founded: "1916", history: "Club le plus titré d'Amerique centrale, Las Aguilas.", historyAr: "أكثر الأندية تتويجاً في أمريكا الوسطى، النسور.", website: "https://www.americamx.com", type: "CLUB",
    },
    {
      name: "Cruz Azul", nameAr: "كروز آزول", nameEn: "Club Deportivo Cruz Azul",
      country: "Mexique", countryAr: "المكسيك", league: "Liga MX", leagueAr: "الدوري المكسيكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Estadio Azteca", stadiumAr: "ملعب أزتيكا",
      founded: "1927", history: "Les Cementeros, briser la malédiction en 2021.", historyAr: "الأسمنت، كسر اللعنة عام 2021.", website: "https://www.cruzazul.com", type: "CLUB",
    },
    {
      name: "Tigres UANL", nameAr: "تيغرز", nameEn: "Club de Futbol Tigres de la Universidad Autonoma de Nuevo Leon",
      country: "Mexique", countryAr: "المكسيك", league: "Liga MX", leagueAr: "الدوري المكسيكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Estadio Universitario", stadiumAr: "الملعب الجامعي",
      founded: "1960", history: "Club de Monterrey, finaliste de la Copa du monde des clubs 2020.", historyAr: "نادي مونتيري، نهائي كأس العالم للأندية 2020.", website: "https://www.tigres.com.mx", type: "CLUB",
    },
    {
      name: "CF Monterrey", nameAr: "مونتيري", nameEn: "Club de Futbol Monterrey",
      country: "Mexique", countryAr: "المكسيك", league: "Liga MX", leagueAr: "الدوري المكسيكي",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Estadio BBVA", stadiumAr: "ملعب بي بي في أي",
      founded: "1945", history: "Rayados, 5 titres de CONCACAF Champions League.", historyAr: "رايادوس، 5 ألقاب في دوري أبطال الكونكاكاف.", website: "https://www.mty.com", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // AFC CLUBS
    // ═══════════════════════════════════════════
    {
      name: "Al Ain FC", nameAr: "العين", nameEn: "Al Ain Football Club",
      country: "EAU", countryAr: "الإمارات", league: "UAE Pro League", leagueAr: "دوري المحترفين الإماراتي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Hazza bin Zayed Stadium", stadiumAr: "ستاديوم هزاع بن زايد",
      founded: "1968", history: "Champion de la Champions League asiatique 2024.", historyAr: "بطل دوري أبطال آسيا 2024.", website: "https://www.alainfc.ae", type: "CLUB",
    },
    {
      name: "Al Jazira Club", nameAr: "الجزيرة", nameEn: "Al Jazira Club",
      country: "EAU", countryAr: "الإمارات", league: "UAE Pro League", leagueAr: "دوري المحترفين الإماراتي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Mohammed bin Zayed Stadium", stadiumAr: "ستاديوم محمد بن زايد",
      founded: "1974", history: "Club d'Abu Dhabi, champion des EAU.", historyAr: "نادي من أبوظبي، بطل الإمارات.", website: "https://www.aljaziraclub.ae", type: "CLUB",
    },
    {
      name: "Al Wahda FC", nameAr: "الوحدة", nameEn: "Al Wahda Football Club",
      country: "EAU", countryAr: "الإمارات", league: "UAE Pro League", leagueAr: "دوري المحترفين الإماراتي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Al Nahyan Stadium", stadiumAr: "ستاديوم آل نهيان",
      founded: "1984", history: "Club historique d'Abu Dhabi.", historyAr: "نادي تاريخي من أبوظبي.", type: "CLUB",
    },
    {
      name: "Sharjah FC", nameAr: "الشارقة", nameEn: "Sharjah Football Club",
      country: "EAU", countryAr: "الإمارات", league: "UAE Pro League", leagueAr: "دوري المحترفين الإماراتي",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Sharjah Stadium", stadiumAr: "ستاديوم الشارقة",
      founded: "1966", history: "Club historique de Sharjah.", historyAr: "نادي تاريخي من الشارقة.", type: "CLUB",
    },
    {
      name: "Al Duhail SC", nameAr: "الدحيل", nameEn: "Al Duhail Sports Club",
      country: "Qatar", countryAr: "قطر", league: "Qatar Stars League", leagueAr: "دوري نجوم قطر",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Abdullah bin Khalifa Stadium", stadiumAr: "ستاديوم عبدالله بن خليفة",
      founded: "2009", history: "Club dominant du Qatar.", historyAr: "النادي المهيمن في قطر.", type: "CLUB",
    },
    {
      name: "Al Sadd SC", nameAr: "السد", nameEn: "Al Sadd Sports Club",
      country: "Qatar", countryAr: "قطر", league: "Qatar Stars League", leagueAr: "دوري نجوم قطر",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Jassim bin Hamad Stadium", stadiumAr: "ستاديوم جاسم بن حمد",
      founded: "1969", history: "Le plus titré du Qatar, anciennement club de Xavi.", historyAr: "الأكثر تتويجاً في قطر، سابقاً نادي تشافي.", type: "CLUB",
    },
    {
      name: "Al Rayyan SC", nameAr: "الريان", nameEn: "Al Rayyan Sports Club",
      country: "Qatar", countryAr: "قطر", league: "Qatar Stars League", leagueAr: "دوري نجوم قطر",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Ahmad bin Ali Stadium", stadiumAr: "ستاديوم أحمد بن علي",
      founded: "1967", history: "Club historique du Qatar, les Lions.", historyAr: "نادي تاريخي من قطر، الأسود.", type: "CLUB",
    },
    {
      name: "Persepolis FC", nameAr: "بيرسيبوليس", nameEn: "Persepolis Football Club",
      country: "Iran", countryAr: "إيران", league: "Iran Pro League", leagueAr: "دوري المحترفين الإيراني",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Azadi Stadium", stadiumAr: "ستاديوم آزادي",
      founded: "1963", history: "Le plus populaire d'Iran, finaliste de la Ligue des Champions.", historyAr: "الأكثر شعبية في إيران، نهائي دوري الأبطال.", website: "https://www.persepolisfc.com", type: "CLUB",
    },
    {
      name: "Esteghlal FC", nameAr: "استقلال", nameEn: "Esteghlal Football Club",
      country: "Iran", countryAr: "إيران", league: "Iran Pro League", leagueAr: "دوري المحترفين الإيراني",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Azadi Stadium", stadiumAr: "ستاديوم آزادي",
      founded: "1945", history: "Le Derby d'Iran contre Persepolis.", historyAr: "ديربي إيران ضد بيرسيبوليس.", website: "https://www.esteghlal.com", type: "CLUB",
    },
    {
      name: "Al-Shorta SC", nameAr: "الshorta", nameEn: "Al-Shorta Sports Club",
      country: "Irak", countryAr: "العراق", league: "Iraqi Premier League", leagueAr: "الدوري العراقي الممتاز",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Al-Shaab Stadium", stadiumAr: "ستاديوم الشعب",
      founded: "1932", history: "Club historique d'Irak, champion irakien.", historyAr: "نادي تاريخي من العراق، بطل عراقي.", type: "CLUB",
    },
    {
      name: "Al-Zawraa SC", nameAr: "الزوراء", nameEn: "Al-Zawraa Sports Club",
      country: "Irak", countryAr: "العراق", league: "Iraqi Premier League", leagueAr: "الدوري العراقي الممتاز",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Al-Zawraa Stadium", stadiumAr: "ستاديوم الزوراء",
      founded: "1969", history: "Le plus titré d'Irak, 14 championnats.", historyAr: "الأكثر تتويجاً في العراق، 14 بطولة.", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // CAF CLUBS
    // ═══════════════════════════════════════════
    {
      name: "Al Ahly SC", nameAr: "الأهلي", nameEn: "Al Ahly Sporting Club",
      country: "Egypte", countryAr: "مصر", league: "Egyptian Premier League", leagueAr: "الدوري المصري الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Cairo International Stadium", stadiumAr: "ستاديوم القاهرة الدولي",
      founded: "1907", history: "Le plus titre d'Afrique, 12 Ligues des Champions.", historyAr: "الأكثر تتويجاً في أفريقيا، 12 دوري أبطال.", website: "https://www.alahly.com", type: "CLUB",
    },
    {
      name: "Zamalek SC", nameAr: "الزمالك", nameEn: "Zamalek Sporting Club",
      country: "Egypte", countryAr: "مصر", league: "Egyptian Premier League", leagueAr: "الدوري المصري الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Cairo International Stadium", stadiumAr: "ستاديوم القاهرة الدولي",
      founded: "1911", history: "5 Ligues des Champions, rival historique de l'Ahly.", historyAr: "5 دوري أبطال، منافس الأهلي التاريخي.", website: "https://www.zamaleksc.com", type: "CLUB",
    },
    {
      name: "Espérance ST", nameAr: "الترجي", nameEn: "Espérance Sportive de Tunis",
      country: "Tunisie", countryAr: "تونس", league: "Tunisian Ligue 1", leagueAr: "الدوري التونسي الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Olympique de Rades", stadiumAr: "الملعب الأولمبي برادس",
      founded: "1919", history: "4 Ligues des Champions, le plus titre de Tunisie.", historyAr: "4 دوري أبطال، الأكثر تتويجاً في تونس.", website: "https://www.estransmission.tn", type: "CLUB",
    },
    {
      name: "Club Africain", nameAr: "النادي الأفريقي", nameEn: "Club Africain",
      country: "Tunisie", countryAr: "تونس", league: "Tunisian Ligue 1", leagueAr: "الدوري التونسي الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Olympique de Rades", stadiumAr: "الملعب الأولمبي برادس",
      founded: "1920", history: "Club historique de Tunis, les Aiglons.", historyAr: "نادي تاريخي من تونس، العقبور.", type: "CLUB",
    },
    {
      name: "CS Sfaxien", nameAr: "النجم الساحلي", nameEn: "Club Sportif Sfaxien",
      country: "Tunisie", countryAr: "تونس", league: "Tunisian Ligue 1", leagueAr: "الدوري التونسي الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Taieb Mhiri", stadiumAr: "ستاد الطيب المهيري",
      founded: "1928", history: "3 Coupe de la CAF, club de Sfax.", historyAr: "3 كأس الكونفدرالية، نادي صفاقس.", type: "CLUB",
    },
    {
      name: "Etoile du Sahel", nameAr: "النجم الساحلي", nameEn: "Etoile Sportive du Sahel",
      country: "Tunisie", countryAr: "تونس", league: "Tunisian Ligue 1", leagueAr: "الدوري التونسي الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Olympique de Sousse", stadiumAr: "الملعب الأولمبي بسوسة",
      founded: "1925", history: "Club de Sousse, champion de la CAF.", historyAr: "نادي سوسة، بطل الكونفدرالية.", type: "CLUB",
    },
    {
      name: "US Monastir", nameAr: "النادي الرياضي المنستيري", nameEn: "Union Sportive Monastirienne",
      country: "Tunisie", countryAr: "تونس", league: "Tunisian Ligue 1", leagueAr: "الدوري التونسي الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Mustapha Ben Jannet", stadiumAr: "ستاد مصطفى بن جنات",
      founded: "1923", history: "Club de Monastir en pleine ascension.", historyAr: "نادي المنستير في صعود.", type: "CLUB",
    },
    {
      name: "TP Mazembe", nameAr: "تي بي مازيمبي", nameEn: "Tout Puissant Mazembe",
      country: "RDC", countryAr: "جمهورية الكونغو الديمقراطية", league: "Linafoot", leagueAr: "الدوري الكونغولي",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade TP Mazembe", stadiumAr: "ستاديوم تي بي مازيمبي",
      founded: "1939", history: "5 Ligues des Champions, club le plus titre de RDC.", historyAr: "5 دوري أبطال، أكثر الأندية تتويجاً في جمهورية الكونغو الديمقراطية.", type: "CLUB",
    },
    {
      name: "Kaizer Chiefs", nameAr: "كايزر تشيفز", nameEn: "Kaizer Chiefs Football Club",
      country: "Afrique du Sud", countryAr: "جنوب أفريقيا", league: "DStv Premiership", leagueAr: "دوري جنوب أفريقيا الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "FNB Stadium", stadiumAr: "إف إن بي ستاديوم",
      founded: "1970", history: "Le plus populaire d'Afrique du Sud, les Amakhosi.", historyAr: "الأكثر شعبية في جنوب أفريقيا، أماخوزي.", website: "https://www.kaizerchiefs.com", type: "CLUB",
    },
    {
      name: "Orlando Pirates", nameAr: "أورلاندو بايراتس", nameEn: "Orlando Pirates Football Club",
      country: "Afrique du Sud", countryAr: "جنوب أفريقيا", league: "DStv Premiership", leagueAr: "دوري جنوب أفريقيا الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Orlando Stadium", stadiumAr: "ستاديوم أورلاندو",
      founded: "1937", history: "Les Buccaneers, rival des Kaizer Chiefs.", historyAr: "القراصنة، منافس كايزر تشيفز.", website: "https://www.piratesfc.co.za", type: "CLUB",
    },
    {
      name: "Mamelodi Sundowns", nameAr: "ماميلودي صانداونز", nameEn: "Mamelodi Sundowns Football Club",
      country: "Afrique du Sud", countryAr: "جنوب أفريقيا", league: "DStv Premiership", leagueAr: "دوري جنوب أفريقيا الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Loftus Versfeld", stadiumAr: "لوفتوس فيرسفيلد",
      founded: "1970", history: "Club le plus titré recent d'Afrique du Sud.", historyAr: "أكثر الأندية تتويجاً مؤخراً في جنوب أفريقيا.", website: "https://www.sundownsfc.co.za", type: "CLUB",
    },
    {
      name: "Simba SC", nameAr: "simba", nameEn: "Simba Sports Club",
      country: "Tanzanie", countryAr: "تنزانيا", league: "Tanzania Premier League", leagueAr: "الدوري التنزاني الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Benjamin Mkapa Stadium", stadiumAr: "ستاديوم بنيامين مكابا",
      founded: "1936", history: "Club le plus populaire de Tanzanie, les Lions.", historyAr: "أكثر الأندية شعبية في تنزانيا، الأسود.", type: "CLUB",
    },
    {
      name: "Yanga SC", nameAr: "يانغا", nameEn: "Young Africans Sports Club",
      country: "Tanzanie", countryAr: "تنزانيا", league: "Tanzania Premier League", leagueAr: "الدوري التنزاني الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Benjamin Mkapa Stadium", stadiumAr: "ستاديوم بنيامين مكابا",
      founded: "1935", history: "Rival historique de Simba, les黄黄.", historyAr: "منافس سيمبا التاريخي.", type: "CLUB",
    },
    {
      name: "Asante Kotoko SC", nameAr: "أسانتي كوتوكو", nameEn: "Asante Kotoko Sporting Club",
      country: "Ghana", countryAr: "غانا", league: "Ghana Premier League", leagueAr: "الدوري الغاني الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Baba Yara Stadium", stadiumAr: "ستاديوم بابا يارا",
      founded: "1935", history: "Les Porcupines, le plus titré du Ghana.", historyAr: "الporcupines، الأكثر تتويجاً في غانا.", type: "CLUB",
    },
    {
      name: "Hearts of Oak SC", nameAr: "هارتس أوف أوك", nameEn: "Accra Hearts of Oak Sporting Club",
      country: "Ghana", countryAr: "غانا", league: "Ghana Premier League", leagueAr: "الدوري الغاني الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Accra Sports Stadium", stadiumAr: "ستاديوم أكرا الرياضي",
      founded: "1911", history: "Le plus ancien club du Ghana, les Phobians.", historyAr: "أقدم نادي في غانا، الفوبيون.", type: "CLUB",
    },
    {
      name: "Enyimba FC", nameAr: "إنيمبا", nameEn: "Enyimba International Football Club",
      country: "Nigeria", countryAr: "نيجيريا", league: "NPFL", leagueAr: "الدوري النيجيري الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Enyimba International Stadium", stadiumAr: "ستاديوم إنيمبا الدولي",
      founded: "1976", history: "2 Ligues des Champions, club le plus titre du Nigeria.", historyAr: "2 دوري أبطال، أكثر الأندية تتويجاً في نيجيريا.", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // ALGERIAN LIGUE 1 (CAF)
    // ═══════════════════════════════════════════
    {
      name: "JS Kabylie", nameAr: "جي إس قبايلي", nameEn: "Jeunesse Sportive de Kabylie",
      country: "Algerie", countryAr: "الجزائر", league: "Algerian Ligue 1", leagueAr: "الدوري الجزائري الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade du 1er Novembre", stadiumAr: "الملعب الأول من نوفمبر",
      founded: "1946", history: "2 Coupe de la CAF, club historique de Tizi Ouzou.", historyAr: "2 كأس الكونفدرالية، نادي تاريخي من تيزي وزو.", type: "CLUB",
    },
    {
      name: "MC Alger", nameAr: "مولودية الجزائر", nameEn: "Mouloudia Club d'Alger",
      country: "Algerie", countryAr: "الجزائر", league: "Algerian Ligue 1", leagueAr: "الدوري الجزائري الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade du 5 Juillet", stadiumAr: "الملعب الخامس من يوليو",
      founded: "1921", history: "Club historique d'Alger, 7 titres de champion.", historyAr: "نادي تاريخي من الجزائر، 7 ألقاب.", type: "CLUB",
    },
    {
      name: "USM Alger", nameAr: "اتحاد الجزائر", nameEn: "Union Sportive de la Medina d'Alger",
      country: "Algerie", countryAr: "الجزائر", league: "Algerian Ligue 1", leagueAr: "الدوري الجزائري الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade du 5 Juillet", stadiumAr: "الملعب الخامس من يوليو",
      founded: "1937", history: "Vainqueur de la Coupe de la CAF 2023.", historyAr: "فائز بكأس الكونفدرالية 2023.", type: "CLUB",
    },
    {
      name: "CR Belouizdad", nameAr: "شبيبة القبائل", nameEn: "Chabab Riadhi Belouizdad",
      country: "Algerie", countryAr: "الجزائر", league: "Algerian Ligue 1", leagueAr: "الدوري الجزائري الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade du 20 Aout 1955", stadiumAr: "الملعب 20 أغسطس 1955",
      founded: "1935", history: "Club en pleine domination du football algerien.", historyAr: "نادي يهيمن على كرة القدم الجزائرية.", type: "CLUB",
    },
    {
      name: "ES Setif", nameAr: "الإتحاد السوفي", nameEn: "Entente Sportive de Setif",
      country: "Algerie", countryAr: "الجزائر", league: "Algerian Ligue 1", leagueAr: "الدوري الجزائري الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade du 8 Mai 1945", stadiumAr: "الملعب 8 مايو 1945",
      founded: "1958", history: "2 Ligues des Champions africaines.", historyAr: "2 دوري أبطال أفريقيا.", type: "CLUB",
    },
    {
      name: "MC Oran", nameAr: "مولودية وهران", nameEn: "Mouloudia Club d'Oran",
      country: "Algerie", countryAr: "الجزائر", league: "Algerian Ligue 1", leagueAr: "الدوري الجزائري الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Habib Bouakeul", stadiumAr: "ستاد حبيب بوكعول",
      founded: "1946", history: "Club historique d'Oran, les Serpents.", historyAr: "نادي تاريخي من وهران، الأفاعي.", type: "CLUB",
    },
    {
      name: "CS Constantine", nameAr: "شبيبة القبائل", nameEn: "Club Sportif Constantinois",
      country: "Algerie", countryAr: "الجزائر", league: "Algerian Ligue 1", leagueAr: "الدوري الجزائري الممتاز",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Chahid Hamlaoui", stadiumAr: "ستاد الشهيد حملاوي",
      founded: "1898", history: "Club historique de Constantine.", historyAr: "نادي تاريخي من قسنطينة.", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // IRANIAN LEAGUE
    // ═══════════════════════════════════════════
    {
      name: "Tractor SC", nameAr: "تراكتور", nameEn: "Tractor Sazi Tabriz",
      country: "Iran", countryAr: "إيران", league: "Iran Pro League", leagueAr: "دوري المحترفين الإيراني",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Yadegar-e Emam Stadium", stadiumAr: "ستاديوم يدغار الإمام",
      founded: "1970", history: "Club populaire de Tabriz.", historyAr: "نادي شعبي من تبريز.", type: "CLUB",
    },
    {
      name: "Sepahan SC", nameAr: "سبحان", nameEn: "Foolad Mobarakeh Sepahan SC",
      country: "Iran", countryAr: "إيران", league: "Iran Pro League", leagueAr: "دوري المحترفين الإيراني",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Naghsh-e Jahan Stadium", stadiumAr: "ستاديوم نقش جهان",
      founded: "1953", history: "Champion d'Iran a plusieurs reprises.", historyAr: "بطل إيران عدة مرات.", type: "CLUB",
    },
    // ═══════════════════════════════════════════
    // NATIONAL TEAMS - CAF
    // ═══════════════════════════════════════════
    {
      name: "Maroc", nameAr: "المغرب", nameEn: "Morocco",
      country: "Maroc", countryAr: "المغرب", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Mohammed V", stadiumAr: "الملعب الشرفي محمد الخامس",
      founded: "1955", history: "Semi-finaliste de la Coupe du Monde 2022, le premier pays africain a atteindre ce stade.", historyAr: "نصف نهائي كأس العالم 2022، أول منتخب أفريقيا يصل هذه المرحلة.", type: "NATIONAL",
    },
    {
      name: "Algerie", nameAr: "الجزائر", nameEn: "Algeria",
      country: "Algerie", countryAr: "الجزائر", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade du 5 Juillet", stadiumAr: "الملعب الخامس من يوليو",
      founded: "1962", history: "Champion d'Afrique 2019, invaincu pendant 35 matchs.", historyAr: "بطل أفريقيا 2019، دون هزيمة في 35 مباراة.", type: "NATIONAL",
    },
    {
      name: "Tunisie", nameAr: "تونس", nameEn: "Tunisia",
      country: "Tunisie", countryAr: "تونس", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Olympique de Rades", stadiumAr: "الملعب الأولمبي برادس",
      founded: "1960", history: "Regular en Coupe du Monde, champion d'Afrique 2004.", historyAr: "منتظم في كأس العالم، بطل أفريقيا 2004.", type: "NATIONAL",
    },
    {
      name: "Egypte", nameAr: "مصر", nameEn: "Egypt",
      country: "Egypte", countryAr: "مصر", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Cairo International Stadium", stadiumAr: "ستاديوم القاهرة الدولي",
      founded: "1921", history: "7 fois champion d'Afrique, record absolu, Mohamed Salah.", historyAr: "7 مرات بطل أفريقيا، رقم قياسي، محمد صلاح.", type: "NATIONAL",
    },
    {
      name: "Senegal", nameAr: "السنغال", nameEn: "Senegal",
      country: "Senegal", countryAr: "السنغال", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Leopold Sedar Senghor", stadiumAr: "ستاد ليوبولد سيدار سينغور",
      founded: "1960", history: "Champion d'Afrique 2022, quart de finale en Coupe du Monde 2002.", historyAr: "بطل أفريقيا 2022، ربع نهائي كأس العالم 2002.", type: "NATIONAL",
    },
    {
      name: "Cameroun", nameAr: "الكاميرون", nameEn: "Cameroon",
      country: "Cameroun", countryAr: "الكاميرون", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Paul Biya", stadiumAr: "ستاد بول بيا",
      founded: "1959", history: "5 fois champion d'Afrique, les Lions Indomptables.", historyAr: "5 مرات بطل أفريقيا، الأسود غير المروّضة.", type: "NATIONAL",
    },
    {
      name: "Nigeria", nameAr: "نيجيريا", nameEn: "Nigeria",
      country: "Nigeria", countryAr: "نيجيريا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Moshood Abiola National Stadium", stadiumAr: "الملعب الوطني موسход أبيولا",
      founded: "1960", history: "3 fois champion d'Afrique, les Super Eagles.", historyAr: "3 مرات بطل أفريقيا، السوبر إيغلز.", type: "NATIONAL",
    },
    {
      name: "Cote d'Ivoire", nameAr: "ساحل العاج", nameEn: "Ivory Coast",
      country: "Cote d'Ivoire", countryAr: "ساحل العاج", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade Felix Houphouet-Boigny", stadiumAr: "ستاد فيليكس هويفيت بوانيي",
      founded: "1960", history: "Champion d'Afrique 2023, les Elephants.", historyAr: "بطل أفريقيا 2023، الفيلة.", type: "NATIONAL",
    },
    {
      name: "Ghana", nameAr: "غانا", nameEn: "Ghana",
      country: "Ghana", countryAr: "غانا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Accra Sports Stadium", stadiumAr: "ستاديوم أكرا الرياضي",
      founded: "1957", history: "4 fois champion d'Afrique, les Black Stars.", historyAr: "4 مرات بطل أفريقيا، البلاك ستارز.", type: "NATIONAL",
    },
    {
      name: "Mali", nameAr: "مالي", nameEn: "Mali",
      country: "Mali", countryAr: "مالي", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade du 26 Mars", stadiumAr: "ستاد 26 مارس",
      founded: "1960", history: "Equipe reguliere en Coupe d'Afrique.", historyAr: "منتظم في كأس أفريقيا.", type: "NATIONAL",
    },
    {
      name: "Guinee", nameAr: "غينيا", nameEn: "Guinea",
      country: "Guinee", countryAr: "غينيا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade du 28 Septembre", stadiumAr: "ستاد 28 سبتمبر",
      founded: "1960", history: "Les Syli Nationaux, finaliste de la Coupe d'Afrique.", historyAr: "السيلي الوطني، نهائي كأس أفريقيا.", type: "NATIONAL",
    },
    {
      name: "RD Congo", nameAr: "الكونغو الديمقراطية", nameEn: "DR Congo",
      country: "RDC", countryAr: "جمهورية الكونغو الديمقراطية", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade des Martyrs", stadiumAr: "ستاد الشهداء",
      founded: "1963", history: "2 fois champion d'Afrique, les Leopards.", historyAr: "مراتان بطل أفريقيا، الفهود.", type: "NATIONAL",
    },
    {
      name: "Afrique du Sud", nameAr: "جنوب أفريقيا", nameEn: "South Africa",
      country: "Afrique du Sud", countryAr: "جنوب أفريقيا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "FNB Stadium", stadiumAr: "إف إن بي ستاديوم",
      founded: "1992", history: "Champion d'Afrique 1996, pays hote de la Coupe du Monde 2010.", historyAr: "بطل أفريقيا 1996، مستضيف كأس العالم 2010.", type: "NATIONAL",
    },
    {
      name: "Burkina Faso", nameAr: "بوركينافاسو", nameEn: "Burkina Faso",
      country: "Burkina Faso", countryAr: "بوركينافاسو", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade du 4 Aout", stadiumAr: "ستاد 4 أغسطس",
      founded: "1984", history: "Finaliste de la Coupe d'Afrique 2022.", historyAr: "نهائي كأس أفريقيا 2022.", type: "NATIONAL",
    },
    {
      name: "Gabon", nameAr: "الغابون", nameEn: "Gabon",
      country: "Gabon", countryAr: "الغابون", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Stade de l'Amitie", stadiumAr: "ستاد الصداقة",
      founded: "1962", history: "Les Panthères, avec Pierre-Emerick Aubameyang.", historyAr: "النمور، مع بيير إميريك أوباميانغ.", type: "NATIONAL",
    },
    {
      name: "Mozambique", nameAr: "موزمبيق", nameEn: "Mozambique",
      country: "Mozambique", countryAr: "موزمبيق", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CAF", confederationAr: "الكونفدرالية الأفريقية لكرة القدم",
      stadium: "Estadio do Zimpeto", stadiumAr: "ستاديوم زيمبيتو",
      founded: "1975", history: "Les Mambas, representation de l'Afrique australe.", historyAr: "المامبا، تمثيل أفريقيا الجنوبية.", type: "NATIONAL",
    },
    // ═══════════════════════════════════════════
    // NATIONAL TEAMS - UEFA
    // ═══════════════════════════════════════════
    {
      name: "France", nameAr: "فرنسا", nameEn: "France",
      country: "France", countryAr: "فرنسا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade de France", stadiumAr: "ملعب فرنسا",
      founded: "1904", history: "Champion du Monde 2018, 2 Coupe du Monde, Euro 2000.", historyAr: "بطل العالم 2018، كأس عالمين، يورو 2000.", type: "NATIONAL",
    },
    {
      name: "Angleterre", nameAr: "إنجلترا", nameEn: "England",
      country: "Angleterre", countryAr: "إنجلترا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Wembley Stadium", stadiumAr: "ستاديوم ويمبلي",
      founded: "1872", history: "Champion du Monde 1966, finaliste du Euro 2020 et 2024.", historyAr: "بطل العالم 1966، نهائي يورو 2020 و2024.", type: "NATIONAL",
    },
    {
      name: "Espagne", nameAr: "إسبانيا", nameEn: "Spain",
      country: "Espagne", countryAr: "إسبانيا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio Santiago Bernabeu", stadiumAr: "سانتياغو بيرنابيو",
      founded: "1920", history: "Champion du Monde 2010, Euro 2008 et 2012, Euro 2024.", historyAr: "بطل العالم 2010، يورو 2008 و2012، يورو 2024.", type: "NATIONAL",
    },
    {
      name: "Allemagne", nameAr: "ألمانيا", nameEn: "Germany",
      country: "Allemagne", countryAr: "ألمانيا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Allianz Arena", stadiumAr: "أليانز أرينا",
      founded: "1900", history: "4 Coupe du Monde, 3 Euro, nation la plus titree d'Europe.", historyAr: "4 كأس عالم، 3 يورو، الأكثر تتويجاً في أوروبا.", type: "NATIONAL",
    },
    {
      name: "Italie", nameAr: "إيطاليا", nameEn: "Italy",
      country: "Italie", countryAr: "إيطاليا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadio Olimpico", stadiumAr: "الملعب الأولمبي",
      founded: "1910", history: "4 Coupe du Monde, 2 Euro, les Azzurri.", historyAr: "4 كأس عالم، 2 يورو، الأزوري.", type: "NATIONAL",
    },
    {
      name: "Portugal", nameAr: "البرتغال", nameEn: "Portugal",
      country: "Portugal", countryAr: "البرتغال", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Estadio da Luz", stadiumAr: "ملعب النور",
      founded: "1921", history: "Euro 2016 et Nations League, avec Cristiano Ronaldo.", historyAr: "يورو 2016 ودوري الأمم، مع كريستيانو رونالدو.", type: "NATIONAL",
    },
    {
      name: "Pays-Bas", nameAr: "هولندا", nameEn: "Netherlands",
      country: "Pays-Bas", countryAr: "هولندا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Johan Cruyff Arena", stadiumAr: "يوهان كرويف أرينا",
      founded: "1905", history: "Euro 1988, 3 finales de Coupe du Monde, le Football Total.", historyAr: "يورو 1988، 3 نهائيات كأس عالم، كرة القدم الشاملة.", type: "NATIONAL",
    },
    {
      name: "Belgique", nameAr: "بلجيكا", nameEn: "Belgium",
      country: "Belgique", countryAr: "بلجيكا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "King Baudouin Stadium", stadiumAr: "ستاديوم الملك بوودوان",
      founded: "1904", history: "Generation dorée, 3e a la Coupe du Monde 2018.", historyAr: "الجيل الذهبي، ثالث كأس العالم 2018.", type: "NATIONAL",
    },
    {
      name: "Croatie", nameAr: "كرواتيا", nameEn: "Croatia",
      country: "Croatie", countryAr: "كرواتيا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stadion Maksimir", stadiumAr: "ستاديون ماكسيمير",
      founded: "1992", history: "Finaliste de la Coupe du Monde 2018 et 3e en 2022.", historyAr: "نهائي كأس العالم 2018 وثالث 2022.", type: "NATIONAL",
    },
    {
      name: "Danemark", nameAr: "الدنمارك", nameEn: "Denmark",
      country: "Danemark", countryAr: "الدنمارك", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Parken Stadium", stadiumAr: "باركين ستاديوم",
      founded: "1889", history: "Euro 1992, surprise totale.", historyAr: "يورو 1992، مفاجأة كاملة.", type: "NATIONAL",
    },
    {
      name: "Suisse", nameAr: "سويسرا", nameEn: "Switzerland",
      country: "Suisse", countryAr: "سويسرا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Stade de Suisse", stadiumAr: "ملعب سويسرا",
      founded: "1904", history: "Regular en finales de coupe du monde et Euro.", historyAr: "منتظم في نهائيات كأس العالم واليورو.", type: "NATIONAL",
    },
    {
      name: "Pologne", nameAr: "بولندا", nameEn: "Poland",
      country: "Pologne", countryAr: "بولندا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "National Stadium Warsaw", stadiumAr: "الملعب الوطني وارسو",
      founded: "1921", history: "3e place a la Coupe du Monde 1974 et 1982, Lewandowski.", historyAr: "ثالث كأس العالم 1974 و1982، ليفاندوفسكي.", type: "NATIONAL",
    },
    {
      name: "Suede", nameAr: "السويد", nameEn: "Sweden",
      country: "Suede", countryAr: "السويد", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Friends Arena", stadiumAr: "فريندز أرينا",
      founded: "1908", history: "Finaliste de la Coupe du Monde 1958, les BLEUS et JAUNES.", historyAr: "نهائي كأس العالم 1958.", type: "NATIONAL",
    },
    {
      name: "Norvege", nameAr: "النرويج", nameEn: "Norway",
      country: "Norvege", countryAr: "النرويج", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Ullevaal Stadion", stadiumAr: "أوليفال ستاديون",
      founded: "1908", history: "Champion olympique 2000, avec Haaland et Odegaard.", historyAr: "بطل أولمبي 2000، مع هالاند وأوديغارد.", type: "NATIONAL",
    },
    {
      name: "Serbie", nameAr: "صربيا", nameEn: "Serbia",
      country: "Serbie", countryAr: "صربيا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Rajko Mitic Stadium", stadiumAr: "ستاديون رايكو ميتيتش",
      founded: "1920", history: "Heritage yougoslave, presence reguliere en Coupe du Monde.", historyAr: "تراث يوغوسلافي، حضور منتظم في كأس العالم.", type: "NATIONAL",
    },
    {
      name: "Republique tcheque", nameAr: "التشيك", nameEn: "Czech Republic",
      country: "Republique tcheque", countryAr: "التشيك", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Eden Arena", stadiumAr: "إيدن أرينا",
      founded: "1994", history: "Finaliste du Euro 1996, forte tradition.", historyAr: "نهائي يورو 1996، تقليد قوي.", type: "NATIONAL",
    },
    {
      name: "Ukraine", nameAr: "أوكرانيا", nameEn: "Ukraine",
      country: "Ukraine", countryAr: "أوكرانيا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "NSK Olimpiyskiy", stadiumAr: "إن إس كيه أولمبيسكي",
      founded: "1992", history: "Demi-finaliste du Euro 2020, les Bleus et Jaunes.", historyAr: "نصف نهائي يورو 2020.", type: "NATIONAL",
    },
    {
      name: "Turquie", nameAr: "تركيا", nameEn: "Turkey",
      country: "Turquie", countryAr: "تركيا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Ataturk Olympic Stadium", stadiumAr: "الملعب الأولمبي أتاتورك",
      founded: "1923", history: "3e place a la Coupe du Monde 2002.", historyAr: "ثالث كأس العالم 2002.", type: "NATIONAL",
    },
    {
      name: "Grece", nameAr: "اليونان", nameEn: "Greece",
      country: "Grece", countryAr: "اليونان", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Olympic Stadium Athens", stadiumAr: "الملعب الأولمبي أثينا",
      founded: "1927", history: "Euro 2004, miracle grec.", historyAr: "يورو 2004، معجزة يونانية.", type: "NATIONAL",
    },
    {
      name: "Ecosse", nameAr: "اسكتلندا", nameEn: "Scotland",
      country: "Ecosse", countryAr: "اسكتلندا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Hampden Park", stadiumAr: "هامبدن بارك",
      founded: "1873", history: "L'une des plus anciennes equipes nationales.", historyAr: "أحد أقدم المنتخبات.", type: "NATIONAL",
    },
    {
      name: "Autriche", nameAr: "النمسا", nameEn: "Austria",
      country: "Autriche", countryAr: "النمسا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Ernst Happel Stadion", stadiumAr: "إرنست هابل ستاديون",
      founded: "1902", history: "3e place a la Coupe du Monde 1954.", historyAr: "ثالث كأس العالم 1954.", type: "NATIONAL",
    },
    {
      name: "Russie", nameAr: "روسيا", nameEn: "Russia",
      country: "Russie", countryAr: "روسيا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "UEFA", confederationAr: "الاتحاد الأوروبي لكرة القدم",
      stadium: "Luzhniki Stadium", stadiumAr: "ستاديوم لوجنيكي",
      founded: "1912", history: "Hotes de la Coupe du Monde 2018, quarts de finale.", historyAr: "مستضيفو كأس العالم 2018، ربع النهائي.", type: "NATIONAL",
    },
    // ═══════════════════════════════════════════
    // NATIONAL TEAMS - CONMEBOL
    // ═══════════════════════════════════════════
    {
      name: "Bresil", nameAr: "البرازيل", nameEn: "Brazil",
      country: "Bresil", countryAr: "البرازيل", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Maracana", stadiumAr: "ماراكانا",
      founded: "1914", history: "5 Coupe du Monde, le pays le plus titré de l'histoire.", historyAr: "5 كأس عالم، الدولة الأكثر تتويجاً في التاريخ.", type: "NATIONAL",
    },
    {
      name: "Argentine", nameAr: "الأرجنتين", nameEn: "Argentina",
      country: "Argentine", countryAr: "الأرجنتين", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Mas Monumental", stadiumAr: "الملعب الأكبر نهائياً",
      founded: "1902", history: "3 Coupe du Monde, champion 2022 avec Messi.", historyAr: "3 كأس عالم، بطل 2022 مع ميسي.", type: "NATIONAL",
    },
    {
      name: "Uruguay", nameAr: "أوروغواي", nameEn: "Uruguay",
      country: "Uruguay", countryAr: "أوروغواي", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Centenario", stadiumAr: "الملعب المئوي",
      founded: "1900", history: "2 Coupe du Monde (1930, 1950), 15 Copa America.", historyAr: "2 كأس عالم (1930، 1950)، 15 كوبا أمريكا.", type: "NATIONAL",
    },
    {
      name: "Colombie", nameAr: "كولومبيا", nameEn: "Colombia",
      country: "Colombie", countryAr: "كولومبيا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio El Campin", stadiumAr: "ملعب إل كامبين",
      founded: "1924", history: "Champion de la Copa America 2024, generation talentueuse.", historyAr: "بطل كوبا أمريكا 2024، جيل موهوب.", type: "NATIONAL",
    },
    {
      name: "Chili", nameAr: "تشيلي", nameEn: "Chile",
      country: "Chili", countryAr: "تشيلي", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Nacional", stadiumAr: "الملعب الوطني",
      founded: "1926", history: "Champion de la Copa America 2015 et 2016.", historyAr: "بطل كوبا أمريكا 2015 و2016.", type: "NATIONAL",
    },
    {
      name: "Perou", nameAr: "بيرو", nameEn: "Peru",
      country: "Perou", countryAr: "بيرو", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Nacional de Lima", stadiumAr: "الملعب الوطني ليما",
      founded: "1927", history: "2 fois Copa America, forte tradition.", historyAr: "مراتان كوبا أمريكا، تقليد قوي.", type: "NATIONAL",
    },
    {
      name: "Paraguay", nameAr: "باراغواي", nameEn: "Paraguay",
      country: "Paraguay", countryAr: "باراغواي", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CONMEBOL", confederationAr: "الكونميبول",
      stadium: "Estadio Defensores del Chaco", stadiumAr: "ملعب دافينسوريس ديل تشاكو",
      founded: "1910", history: "2 Copa America, tradition forte en Amerique du Sud.", historyAr: "2 كوبا أمريكا، تقليد قوي في أمريكا الجنوبية.", type: "NATIONAL",
    },
    // ═══════════════════════════════════════════
    // NATIONAL TEAMS - CONCACAF
    // ═══════════════════════════════════════════
    {
      name: "Mexique", nameAr: "المكسيك", nameEn: "Mexico",
      country: "Mexique", countryAr: "المكسيك", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Estadio Azteca", stadiumAr: "ملعب أزتيكا",
      founded: "1923", history: "Les Tri, quarts de finale en Coupe du Monde a domicile en 1970 et 1986.", historyAr: "الثلاثي، ربع نهائي كأس العالم في الوطن في 1970 و1986.", type: "NATIONAL",
    },
    {
      name: "Etats-Unis", nameAr: "الولايات المتحدة", nameEn: "United States",
      country: "Etats-Unis", countryAr: "الولايات المتحدة", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "Mercedes-Benz Stadium", stadiumAr: "ستاديوم مرسيدس بنز",
      founded: "1885", history: "Hote de la Coupe du Monde 2026, generation prometteuse.", historyAr: "مضيف كأس العالم 2026، جيل واعد.", type: "NATIONAL",
    },
    {
      name: "Canada", nameAr: "كندا", nameEn: "Canada",
      country: "Canada", countryAr: "كندا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "CONCACAF", confederationAr: "الكونكاكاف",
      stadium: "BMO Field", stadiumAr: "بي إم أو فيلد",
      founded: "1921", history: "Retour en Coupe du Monde 2022, co-hote en 2026.", historyAr: "عاد إلى كأس العالم 2022، مضيف مشترك 2026.", type: "NATIONAL",
    },
    // ═══════════════════════════════════════════
    // NATIONAL TEAMS - AFC
    // ═══════════════════════════════════════════
    {
      name: "Japon", nameAr: "اليابان", nameEn: "Japan",
      country: "Japon", countryAr: "اليابان", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Japan National Stadium", stadiumAr: "الملعب الوطني الياباني",
      founded: "1921", history: "Blue Samurai, quarts de finale en Coupe du Monde 2022.", historyAr: "الساموراي الأزرق، ربع نهائي كأس العالم 2022.", type: "NATIONAL",
    },
    {
      name: "Coree du Sud", nameAr: "كوريا الجنوبية", nameEn: "South Korea",
      country: "Coree du Sud", countryAr: "كوريا الجنوبية", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Seoul World Cup Stadium", stadiumAr: "ستاديوم سيول لكأس العالم",
      founded: "1928", history: "Demi-finaliste de la Coupe du Monde 2002, les Guerriers de Taegeuk.", historyAr: "نصف نهائي كأس العالم 2002، محاربو تايغوك.", type: "NATIONAL",
    },
    {
      name: "Australie", nameAr: "أستراليا", nameEn: "Australia",
      country: "Australie", countryAr: "أستراليا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stadium Australia", stadiumAr: "ستاديوم أستراليا",
      founded: "1921", history: "Les Socceroos, quarts de finale en Coupe du Monde 2006.", historyAr: "السقراطيون، ربع نهائي كأس العالم 2006.", type: "NATIONAL",
    },
    {
      name: "Chine", nameAr: "الصين", nameEn: "China",
      country: "Chine", countryAr: "الصين", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Stade des Travailleurs de Pekin", stadiumAr: "ستاديوم عمال بكين",
      founded: "1924", history: "Une seule presence en Coupe du Monde (2002), immense potentiel.", historyAr: "حضور واحد في كأس العالم (2002)، إمكانات هائلة.", type: "NATIONAL",
    },
    {
      name: "Iran", nameAr: "إيران", nameEn: "Iran",
      country: "Iran", countryAr: "إيران", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Azadi Stadium", stadiumAr: "ستاديوم آزادي",
      founded: "1920", history: "Team Melli, presence reguliere en Coupe du Monde.", historyAr: "تيم ميلي، حضور منتظم في كأس العالم.", type: "NATIONAL",
    },
    {
      name: "Arabie Saoudite", nameAr: "السعودية", nameEn: "Saudi Arabia",
      country: "Arabie Saoudite", countryAr: "المملكة العربية السعودية", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "King Fahd International Stadium", stadiumAr: "الملعب الدولي الملك فهد",
      founded: "1956", history: "3 Coupe d'Asie, victoire historique contre l'Argentine en 2022.", historyAr: "3 كأس آسيا، انتصار تاريخي على الأرجنتين 2022.", type: "NATIONAL",
    },
    {
      name: "EAU", nameAr: "الإمارات", nameEn: "United Arab Emirates",
      country: "EAU", countryAr: "الإمارات", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Zayed Sports City", stadiumAr: "مدينة زايد الرياضية",
      founded: "1971", history: "Les Aigles, finale de la Coupe d'Asie 1996.", historyAr: "النسور، نهائي كأس آسيا 1996.", type: "NATIONAL",
    },
    {
      name: "Qatar", nameAr: "قطر", nameEn: "Qatar",
      country: "Qatar", countryAr: "قطر", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Lusail Stadium", stadiumAr: "ستاديوم لوسيل",
      founded: "1960", history: "Hote de la Coupe du Monde 2022, champion d'Asie 2019.", historyAr: "مضيف كأس العالم 2022، بطل آسيا 2019.", type: "NATIONAL",
    },
    {
      name: "Irak", nameAr: "العراق", nameEn: "Iraq",
      country: "Irak", countryAr: "العراق", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "AFC", confederationAr: "الاتحاد الآسيوي لكرة القدم",
      stadium: "Basra International Stadium", stadiumAr: "ستاديوم البصرة الدولي",
      founded: "1948", history: "Champion d'Asie 2007, les Lions de Mesopotamie.", historyAr: "بطل آسيا 2007، أسود بلاد الرافدين.", type: "NATIONAL",
    },
    // ═══════════════════════════════════════════
    // NATIONAL TEAMS - OFC
    // ═══════════════════════════════════════════
    {
      name: "Nouvelle-Zelande", nameAr: "نيوزيلندا", nameEn: "New Zealand",
      country: "Nouvelle-Zelande", countryAr: "نيوزيلندا", league: "Equipe Nationale", leagueAr: "المنتخب الوطني",
      confederation: "OFC", confederationAr: "اتحاد أوقيانوسيا لكرة القدم",
      stadium: "Sky Stadium", stadiumAr: "سكاي ستاديوم",
      founded: "1908", history: "All Whites, dominant en Oceanie, Coupe du Monde 2010.", historyAr: "الأبيض الكامل، المهيمن في أوقيانوسيا، كأس العالم 2010.", type: "NATIONAL",
    },
  ];
  console.log(`✅ Created ${teams.length} teams.`);

  // Create teams in DB
  const createdTeams: { id: string; name: string }[] = [];
  for (const team of teams) {
    const slug = makeSlug(team.name);
    const created = await prisma.team.create({
      data: {
        name: team.name,
        nameAr: team.nameAr,
        nameEn: team.nameEn,
        slug,
        logo: `/logos/${slug}.png`,
        country: team.country,
        countryAr: team.countryAr,
        league: team.league,
        leagueAr: team.leagueAr,
        confederation: team.confederation,
        confederationAr: team.confederationAr,
        stadium: team.stadium,
        stadiumAr: team.stadiumAr,
        founded: team.founded,
        history: team.history,
        historyAr: team.historyAr,
        website: team.website || null,
        type: team.type,
        isActive: true,
      },
    });
    createdTeams.push({ id: created.id, name: created.name });
  }
  console.log(`✅ ${createdTeams.length} teams inserted in database.`);

  console.log("🛍️ Creating products...");
  const jerseyCategoryId = categories["football-shirts"];

  let productCount = 0;
  for (const team of createdTeams) {
    const teamSlug = slugify(team.name, 0);
    const productSlug = makeSlug(`${team.name} - Maillot Domicile 2025/26`);
    const price = 300;
    const stock = Math.floor(Math.random() * 50) + 10;

    const product = await prisma.product.create({
      data: {
        name: `${team.name} - Maillot Domicile 2025/26`,
        nameAr: `قميص ${team.name} - الديو 2025/26`,
        nameEn: `${team.name} - Home Jersey 2025/26`,
        slug: productSlug,
        description: `Maillot officiel domicile de la saison 2025/26 de ${team.name}. Fabrication premium, materiaux haute qualite, confort optimal pour les supporters.`,
        descriptionAr: `قميص رسمي للفريق المحلي للموسم 2025/26 لـ ${team.name}. تصنيع ممتاز، مواد عالية الجودة، راحة مثالية للمشجعين.`,
        descriptionEn: `Official home jersey for the 2025/26 season of ${team.name}. Premium manufacturing, high quality materials, optimal comfort for supporters.`,
        price,
        comparePrice: null,
        sku: `MS10-${teamSlug.toUpperCase().substring(0, 10)}-HJ25-${productCount}`,
        isActive: true,
        isFeatured: productCount < 12,
        isNewArrival: productCount < 24,
        isBestSeller: productCount < 8,
        isOnSale: false,
        stock,
        lowStockThreshold: 5,
        categoryId: jerseyCategoryId,
        teamId: (await prisma.team.findFirst({ where: { name: team.name } }))?.id || null,
        tags: ["maillot", "domicile", "2025/26", team.name.toLowerCase()],
      },
    });

    // Create product images
    await prisma.productImage.createMany({
      data: [
        { productId: product.id, url: `/products/${productSlug}-front.jpg`, alt: `${team.name} Maillot Domicile Front`, sortOrder: 0, isPrimary: true },
        { productId: product.id, url: `/products/${productSlug}-back.jpg`, alt: `${team.name} Maillot Domicile Dos`, sortOrder: 1, isPrimary: false },
        { productId: product.id, url: `/products/${productSlug}-detail.jpg`, alt: `${team.name} Maillot Domicile Detail`, sortOrder: 2, isPrimary: false },
      ],
    });

    // Create product sizes
    await prisma.productSize.createMany({
      data: sizes.map((size) => ({
        productId: product.id,
        size,
        stock: Math.floor(Math.random() * 20) + 5,
        isActive: true,
      })),
    });

    productCount++;
    if (productCount % 50 === 0) {
      console.log(`  ... ${productCount} products created`);
    }
  }
  console.log(`✅ ${productCount} products created.`);

  console.log("⚙️ Creating site settings...");
  await prisma.siteSettings.createMany({
    data: [
      { key: "customization_enabled", value: "true", type: "boolean" },
      { key: "customization_price", value: "50", type: "number" },
      { key: "site_name", value: "MS10 Shop", type: "string" },
      { key: "site_description", value: "Votre boutique de maillots et accessoires de football", type: "string" },
      { key: "currency", value: "MAD", type: "string" },
      { key: "shipping_cost", value: "30", type: "number" },
      { key: "free_shipping_threshold", value: "500", type: "number" },
    ],
  });
  console.log("✅ Site settings created.");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
