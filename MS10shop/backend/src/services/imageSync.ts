import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const IMAGES_DIR = path.resolve(__dirname, "../../../frontend/public/images");

interface ParsedImage {
  filename: string;
  teamSlug: string;
  type: "domicile" | "exterieur" | "third";
  brand: string;
}

const BRANDS: Record<string, string> = {
  adidas: "adidas",
  nike: "nike",
  puma: "puma",
  "new-balance": "New Balance",
  mizuno: "Mizuno",
  ea7: "EA7",
  kelme: "Kelme",
  umbro: "Umbro",
  "capelli-sport": "Capelli Sport",
  "marathon-sports": "Marathon Sports",
  reebok: "Reebok",
  saeta: "Saeta",
  majid: "Majid",
  jako: "Jako",
  kappa: "Kappa",
  "7saber": "7Saber",
};

const TEAM_META: Record<string, {
  name: string;
  nameAr: string;
  nameEn: string;
  country: string;
  countryAr: string;
  league: string;
  leagueAr: string;
  confederation: string;
  type: "CLUB" | "NATIONAL";
}> = {
  "ac-milan": { name: "AC Milan", nameAr: "إيه سي ميلان", nameEn: "AC Milan", country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي", confederation: "UEFA", type: "CLUB" },
  "afrique-du-sud": { name: "Afrique du Sud", nameAr: "جنوب أفريقيا", nameEn: "South Africa", country: "Afrique du Sud", countryAr: "جنوب أفريقيا", league: "National", leagueAr: "منتخب", confederation: "CAF", type: "NATIONAL" },
  "algerie": { name: "Algérie", nameAr: "الجزائر", nameEn: "Algeria", country: "Algérie", countryAr: "الجزائر", league: "National", leagueAr: "منتخب", confederation: "CAF", type: "NATIONAL" },
  "allemagne": { name: "Allemagne", nameAr: "ألمانيا", nameEn: "Germany", country: "Allemagne", countryAr: "ألمانيا", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "angleterre": { name: "Angleterre", nameAr: "إنجلترا", nameEn: "England", country: "Angleterre", countryAr: "إنجلترا", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "arabie-saoudite": { name: "Arabie Saoudite", nameAr: "السعودية", nameEn: "Saudi Arabia", country: "Arabie Saoudite", countryAr: "السعودية", league: "National", leagueAr: "منتخب", confederation: "AFC", type: "NATIONAL" },
  "argentine": { name: "Argentine", nameAr: "الأرجنتين", nameEn: "Argentina", country: "Argentine", countryAr: "الأرجنتين", league: "National", leagueAr: "منتخب", confederation: "CONMEBOL", type: "NATIONAL" },
  "arsenal": { name: "Arsenal FC", nameAr: "أرسنال", nameEn: "Arsenal", country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي", confederation: "UEFA", type: "CLUB" },
  "aston-villa": { name: "Aston Villa", nameAr: "أستون فيلا", nameEn: "Aston Villa", country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي", confederation: "UEFA", type: "CLUB" },
  "atletico-madrid": { name: "Atlético Madrid", nameAr: "أتلتيكو مدريد", nameEn: "Atlético Madrid", country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني", confederation: "UEFA", type: "CLUB" },
  "australie": { name: "Australie", nameAr: "أستراليا", nameEn: "Australia", country: "Australie", countryAr: "أستراليا", league: "National", leagueAr: "منتخب", confederation: "AFC", type: "NATIONAL" },
  "autriche": { name: "Autriche", nameAr: "النمسا", nameEn: "Austria", country: "Autriche", countryAr: "النمسا", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "barca": { name: "FC Barcelona", nameAr: "برشلونة", nameEn: "FC Barcelona", country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني", confederation: "UEFA", type: "CLUB" },
  "bayer-leverkusen": { name: "Bayer Leverkusen", nameAr: "باير ليفركوزن", nameEn: "Bayer Leverkusen", country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني", confederation: "UEFA", type: "CLUB" },
  "bayern-munich": { name: "Bayern Munich", nameAr: "بايرن ميونخ", nameEn: "Bayern Munich", country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني", confederation: "UEFA", type: "CLUB" },
  "belgique": { name: "Belgique", nameAr: "بلجيكا", nameEn: "Belgium", country: "Belgique", countryAr: "بلجيكا", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "borussia-dortmund": { name: "Borussia Dortmund", nameAr: "بوروسيا دورتموند", nameEn: "Borussia Dortmund", country: "Allemagne", countryAr: "ألمانيا", league: "Bundesliga", leagueAr: "الدوري الألماني", confederation: "UEFA", type: "CLUB" },
  "bosnie-herzegovine": { name: "Bosnie-Herzégovine", nameAr: "البوسنة والهرسك", nameEn: "Bosnia and Herzegovina", country: "Bosnie-Herzégovine", countryAr: "البوسنة والهرسك", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "bresil": { name: "Brésil", nameAr: "البرازيل", nameEn: "Brazil", country: "Brésil", countryAr: "البرازيل", league: "National", leagueAr: "منتخب", confederation: "CONMEBOL", type: "NATIONAL" },
  "canada": { name: "Canada", nameAr: "كندا", nameEn: "Canada", country: "Canada", countryAr: "كندا", league: "National", leagueAr: "منتخب", confederation: "CONCACAF", type: "NATIONAL" },
  "cap-vert": { name: "Cap-Vert", nameAr: "الرأس الأخضر", nameEn: "Cape Verde", country: "Cap-Vert", countryAr: "الرأس الأخضر", league: "National", leagueAr: "منتخب", confederation: "CAF", type: "NATIONAL" },
  "chelsea": { name: "Chelsea FC", nameAr: "تشيلسي", nameEn: "Chelsea", country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي", confederation: "UEFA", type: "CLUB" },
  "colombie": { name: "Colombie", nameAr: "كولومبيا", nameEn: "Colombia", country: "Colombie", countryAr: "كولومبيا", league: "National", leagueAr: "منتخب", confederation: "CONMEBOL", type: "NATIONAL" },
  "congo": { name: "Congo", nameAr: "الكونغو", nameEn: "Congo", country: "Congo", countryAr: "الكونغو", league: "National", leagueAr: "منتخب", confederation: "CAF", type: "NATIONAL" },
  "coree-du-sud": { name: "Corée du Sud", nameAr: "كوريا الجنوبية", nameEn: "South Korea", country: "Corée du Sud", countryAr: "كوريا الجنوبية", league: "National", leagueAr: "منتخب", confederation: "AFC", type: "NATIONAL" },
  "cote-ivoire": { name: "Côte d'Ivoire", nameAr: "ساحل العاج", nameEn: "Ivory Coast", country: "Côte d'Ivoire", countryAr: "ساحل العاج", league: "National", leagueAr: "منتخب", confederation: "CAF", type: "NATIONAL" },
  "croatie": { name: "Croatie", nameAr: "كرواتيا", nameEn: "Croatia", country: "Croatie", countryAr: "كرواتيا", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "curacao": { name: "Curaçao", nameAr: "كوراساو", nameEn: "Curaçao", country: "Curaçao", countryAr: "كوراساو", league: "National", leagueAr: "منتخب", confederation: "CONCACAF", type: "NATIONAL" },
  "ecosse": { name: "Écosse", nameAr: "اسكتلندا", nameEn: "Scotland", country: "Écosse", countryAr: "اسكتلندا", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "egypte": { name: "Égypte", nameAr: "مصر", nameEn: "Egypt", country: "Égypte", countryAr: "مصر", league: "National", leagueAr: "منتخب", confederation: "CAF", type: "NATIONAL" },
  "equateur": { name: "Équateur", nameAr: "الإكوادور", nameEn: "Ecuador", country: "Équateur", countryAr: "الإكوادور", league: "National", leagueAr: "منتخب", confederation: "CONMEBOL", type: "NATIONAL" },
  "equipe-de-france": { name: "Équipe de France", nameAr: "منتخب فرنسا", nameEn: "France", country: "France", countryAr: "فرنسا", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "espagne": { name: "Espagne", nameAr: "إسبانيا", nameEn: "Spain", country: "Espagne", countryAr: "إسبانيا", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "etats-unis": { name: "États-Unis", nameAr: "الولايات المتحدة", nameEn: "USA", country: "États-Unis", countryAr: "الولايات المتحدة", league: "National", leagueAr: "منتخب", confederation: "CONCACAF", type: "NATIONAL" },
  "fc-seville": { name: "FC Séville", nameAr: "إشبيلية", nameEn: "Sevilla FC", country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني", confederation: "UEFA", type: "CLUB" },
  "ghana": { name: "Ghana", nameAr: "غانا", nameEn: "Ghana", country: "Ghana", countryAr: "غانا", league: "National", leagueAr: "منتخب", confederation: "CAF", type: "NATIONAL" },
  "haiti": { name: "Haïti", nameAr: "هايتي", nameEn: "Haiti", country: "Haïti", countryAr: "هايتي", league: "National", leagueAr: "منتخب", confederation: "CONCACAF", type: "NATIONAL" },
  "inter-milan": { name: "Inter Milan", nameAr: "إنتر ميلان", nameEn: "Inter Milan", country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي", confederation: "UEFA", type: "CLUB" },
  "irak": { name: "Irak", nameAr: "العراق", nameEn: "Iraq", country: "Irak", countryAr: "العراق", league: "National", leagueAr: "منتخب", confederation: "AFC", type: "NATIONAL" },
  "iran": { name: "Iran", nameAr: "إيران", nameEn: "Iran", country: "Iran", countryAr: "إيران", league: "National", leagueAr: "منتخب", confederation: "AFC", type: "NATIONAL" },
  "japon": { name: "Japon", nameAr: "اليابان", nameEn: "Japan", country: "Japon", countryAr: "اليابان", league: "National", leagueAr: "منتخب", confederation: "AFC", type: "NATIONAL" },
  "jordanie": { name: "Jordanie", nameAr: "الأردن", nameEn: "Jordan", country: "Jordanie", countryAr: "الأردن", league: "National", leagueAr: "منتخب", confederation: "AFC", type: "NATIONAL" },
  "juventus": { name: "Juventus Turin", nameAr: "يوفنتوس", nameEn: "Juventus", country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي", confederation: "UEFA", type: "CLUB" },
  "liverpool": { name: "Liverpool FC", nameAr: "ليفربول", nameEn: "Liverpool", country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي", confederation: "UEFA", type: "CLUB" },
  "manchester-city": { name: "Manchester City", nameAr: "مانشستر سيتي", nameEn: "Manchester City", country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي", confederation: "UEFA", type: "CLUB" },
  "manchester-united": { name: "Manchester United", nameAr: "مانشستر يونايتد", nameEn: "Manchester United", country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي", confederation: "UEFA", type: "CLUB" },
  "maroc": { name: "Maroc", nameAr: "المغرب", nameEn: "Morocco", country: "Maroc", countryAr: "المغرب", league: "National", leagueAr: "منتخب", confederation: "CAF", type: "NATIONAL" },
  "mexique": { name: "Mexique", nameAr: "المكسيك", nameEn: "Mexico", country: "Mexique", countryAr: "المكسيك", league: "National", leagueAr: "منتخب", confederation: "CONCACAF", type: "NATIONAL" },
  "monaco": { name: "AS Monaco", nameAr: "موناكو", nameEn: "AS Monaco", country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي", confederation: "UEFA", type: "CLUB" },
  "napoli": { name: "SSC Napoli", nameAr: "نابولي", nameEn: "Napoli", country: "Italie", countryAr: "إيطاليا", league: "Serie A", leagueAr: "الدوري الإيطالي", confederation: "UEFA", type: "CLUB" },
  "newcastle": { name: "Newcastle United", nameAr: "نيوكاسل يونايتد", nameEn: "Newcastle United", country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي", confederation: "UEFA", type: "CLUB" },
  "norvege": { name: "Norvège", nameAr: "النرويج", nameEn: "Norway", country: "Norvège", countryAr: "النرويج", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "nouvelle-zelande": { name: "Nouvelle-Zélande", nameAr: "نيوزيلندا", nameEn: "New Zealand", country: "Nouvelle-Zélande", countryAr: "نيوزيلندا", league: "National", leagueAr: "منتخب", confederation: "OFC", type: "NATIONAL" },
  "om": { name: "Olympique de Marseille", nameAr: "مارسيليا", nameEn: "Olympique de Marseille", country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي", confederation: "UEFA", type: "CLUB" },
  "ouzbekhistan": { name: "Ouzbékistan", nameAr: "أوزبكستان", nameEn: "Uzbekistan", country: "Ouzbékistan", countryAr: "أوزبكستان", league: "National", leagueAr: "منتخب", confederation: "AFC", type: "NATIONAL" },
  "panama": { name: "Panama", nameAr: "بنما", nameEn: "Panama", country: "Panama", countryAr: "بنما", league: "National", leagueAr: "منتخب", confederation: "CONCACAF", type: "NATIONAL" },
  "paraguay": { name: "Paraguay", nameAr: "باراغواي", nameEn: "Paraguay", country: "Paraguay", countryAr: "باراغواي", league: "National", leagueAr: "منتخب", confederation: "CONMEBOL", type: "NATIONAL" },
  "pays-bas": { name: "Pays-Bas", nameAr: "هولندا", nameEn: "Netherlands", country: "Pays-Bas", countryAr: "هولندا", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "portugal": { name: "Portugal", nameAr: "البرتغال", nameEn: "Portugal", country: "Portugal", countryAr: "البرتغال", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "psg": { name: "Paris Saint-Germain", nameAr: "باريس سان جيرمان", nameEn: "Paris Saint-Germain", country: "France", countryAr: "فرنسا", league: "Ligue 1", leagueAr: "الدوري الفرنسي", confederation: "UEFA", type: "CLUB" },
  "qatar": { name: "Qatar", nameAr: "قطر", nameEn: "Qatar", country: "Qatar", countryAr: "قطر", league: "National", leagueAr: "منتخب", confederation: "AFC", type: "NATIONAL" },
  "real-madrid": { name: "Real Madrid", nameAr: "ريال مدريد", nameEn: "Real Madrid", country: "Espagne", countryAr: "إسبانيا", league: "La Liga", leagueAr: "الدوري الإسباني", confederation: "UEFA", type: "CLUB" },
  "senegal": { name: "Sénégal", nameAr: "السنغال", nameEn: "Senegal", country: "Sénégal", countryAr: "السنغال", league: "National", leagueAr: "منتخب", confederation: "CAF", type: "NATIONAL" },
  "suede": { name: "Suède", nameAr: "السويد", nameEn: "Sweden", country: "Suède", countryAr: "السويد", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "suisse": { name: "Suisse", nameAr: "سويسرا", nameEn: "Switzerland", country: "Suisse", countryAr: "سويسرا", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "tchequie": { name: "Tchéquie", nameAr: "التشيك", nameEn: "Czech Republic", country: "Tchéquie", countryAr: "التشيك", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "tottenham": { name: "Tottenham Hotspur", nameAr: "توتنهام", nameEn: "Tottenham Hotspur", country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي", confederation: "UEFA", type: "CLUB" },
  "tunisie": { name: "Tunisie", nameAr: "تونس", nameEn: "Tunisia", country: "Tunisie", countryAr: "تونس", league: "National", leagueAr: "منتخب", confederation: "CAF", type: "NATIONAL" },
  "turquie": { name: "Turquie", nameAr: "تركيا", nameEn: "Turkey", country: "Turquie", countryAr: "تركيا", league: "National", leagueAr: "منتخب", confederation: "UEFA", type: "NATIONAL" },
  "uruguay": { name: "Uruguay", nameAr: "أوروغواي", nameEn: "Uruguay", country: "Uruguay", countryAr: "أوروغواي", league: "National", leagueAr: "منتخب", confederation: "CONMEBOL", type: "NATIONAL" },
  "west-ham": { name: "West Ham United", nameAr: "وست هام", nameEn: "West Ham United", country: "Angleterre", countryAr: "إنجلترا", league: "Premier League", leagueAr: "الدوري الإنجليزي", confederation: "UEFA", type: "CLUB" },
};

const TYPE_LABELS: Record<string, { fr: string; en: string; ar: string }> = {
  domicile: { fr: "Domicile", en: "Home", ar: "الديو" },
  exterieur: { fr: "Extérieur", en: "Away", ar: "الخارجي" },
  third: { fr: "Third", en: "Third", ar: "الثالث" },
};

function parseImageFile(filename: string): ParsedImage | null {
  let name = filename.toLowerCase();
  const ext = path.extname(name);
  if (![".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext)) return null;

  name = path.basename(name, ext);

  if (name.startsWith("maillot-") || name.startsWith("maillots-")) {
    name = name.replace(/^maillots?-/, "");
  } else {
    return null;
  }

  let type: "domicile" | "exterieur" | "third" = "domicile";
  if (/\bexterieur\b/.test(name)) {
    type = "exterieur";
    name = name.replace(/-exterieur|-exterieur-/, "-");
  } else if (/\bthird\b/.test(name)) {
    type = "third";
    name = name.replace(/-third|-third-/, "-");
  }

  name = name.replace(/-domicile$/, "").replace(/-domicile-/, "-");

  name = name.replace(/coupe-du-monde/g, "");
  name = name.replace(/2026[-_]?2027/g, "");
  name = name.replace(/2025[-_]?2026/g, "");
  name = name.replace(/2026/g, "");
  name = name.replace(/2025/g, "");

  name = name.replace(/-{2,}/g, "-");
  name = name.replace(/^-|-$/g, "");

  if (/\bdomicile\b/.test(name)) {
    type = "domicile";
    name = name.replace(/-domicile/g, "").replace(/domicile-/g, "-").replace(/domicile/g, "");
  }

  name = name.replace(/-{2,}/g, "-");
  name = name.replace(/^-|-$/g, "");

  let brand = "";
  const brandKeys = Object.keys(BRANDS);
  for (const bk of brandKeys) {
    const re = new RegExp(`(?:^|-)${bk}(?:-|$)`, "i");
    if (re.test(name)) {
      brand = BRANDS[bk];
      name = name.replace(re, "-");
      break;
    }
  }

  name = name.replace(/-lbox-\d+x\d+-fff/gi, "");
  name = name.replace(/-\d{3,}x\d{3,}/g, "");
  name = name.replace(/-\d+-lbox.*/i, "");
  name = name.replace(/-\d+$/, "");

  name = name.replace(/-{2,}/g, "-");
  name = name.replace(/^-|-$/g, "");

  if (!name) return null;

  return { filename, teamSlug: name, type, brand };
}

function getSeason(): string {
  const now = new Date();
  const year = now.getFullYear();
  return `${year - 1}/${year}`;
}

export async function syncImages(): Promise<void> {
  console.log("📸 Starting image sync...");

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Images directory not found: ${IMAGES_DIR}`);
    return;
  }

  const files = fs.readdirSync(IMAGES_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp", ".avif"].includes(ext);
  });
  console.log(`  Found ${files.length} image files`);

  const parsed: ParsedImage[] = [];
  for (const file of files) {
    const result = parseImageFile(file);
    if (result) {
      parsed.push(result);
    } else {
      console.warn(`  ⚠️ Could not parse: ${file}`);
    }
  }
  console.log(`  Successfully parsed ${parsed.length} images`);

  const teamImages: Record<string, ParsedImage[]> = {};
  for (const img of parsed) {
    if (!teamImages[img.teamSlug]) teamImages[img.teamSlug] = [];
    teamImages[img.teamSlug].push(img);
  }

  const teamSlugs = Object.keys(teamImages);
  console.log(`  Found ${teamSlugs.length} unique teams from images`);

  const footballShirtsCategory = await prisma.category.upsert({
    where: { slug: "football-shirts" },
    update: {},
    create: {
      name: "Football Shirts",
      nameAr: "قمصان كرة القدم",
      slug: "football-shirts",
      description: "Maillots officiels de football",
    },
  });

  const brandCache: Record<string, string> = {};
  for (const [brandSlug, brandName] of Object.entries(BRANDS)) {
    const existing = await prisma.brand.findUnique({ where: { slug: brandSlug } });
    if (existing) {
      brandCache[brandSlug] = existing.id;
    } else {
      const created = await prisma.brand.create({
        data: { name: brandName, slug: brandSlug },
      });
      brandCache[brandSlug] = created.id;
    }
  }

  const season = getSeason();
  let teamsCreated = 0;
  let teamsUpdated = 0;
  let productsCreated = 0;
  let imagesCreated = 0;
  const slugsToKeep = new Set<string>();

  for (const slug of teamSlugs) {
    const meta = TEAM_META[slug];
    if (!meta) {
      console.warn(`  ⚠️ No metadata for team: ${slug}`);
      continue;
    }
    slugsToKeep.add(slug);

    const teamName = meta.name;
    const teamSlug = slug;

    let team = await prisma.team.findUnique({ where: { slug: teamSlug } });
    if (!team) {
      team = await prisma.team.create({
        data: {
          name: teamName,
          nameAr: meta.nameAr,
          nameEn: meta.nameEn,
          slug: teamSlug,
          country: meta.country,
          countryAr: meta.countryAr,
          league: meta.league,
          leagueAr: meta.leagueAr,
          confederation: meta.confederation,
          type: meta.type,
          isActive: true,
        },
      });
      teamsCreated++;
      console.log(`  ✅ Team created: ${teamName}`);
    } else {
      await prisma.team.update({
        where: { id: team.id },
        data: {
          name: teamName,
          nameAr: meta.nameAr,
          nameEn: meta.nameEn,
          country: meta.country,
          countryAr: meta.countryAr,
          league: meta.league,
          leagueAr: meta.leagueAr,
          confederation: meta.confederation,
          type: meta.type,
          isActive: true,
        },
      });
      teamsUpdated++;
    }

    const images = teamImages[slug];
    const typeGroups: Record<string, ParsedImage[]> = {};
    for (const img of images) {
      if (!typeGroups[img.type]) typeGroups[img.type] = [];
      typeGroups[img.type].push(img);
    }

    for (const [typeKey, typeImages] of Object.entries(typeGroups)) {
      const typeLabel = TYPE_LABELS[typeKey];
      const productName = `${teamName} - Maillot ${typeLabel.fr} ${season}`;
      const productSlugBase = `${teamSlug}-maillot-${typeKey}-${season.replace("/", "-")}`;

      const existingProduct = await prisma.product.findFirst({
        where: { teamId: team.id, name: productName },
      });

      if (existingProduct) continue;

      const brandImage = typeImages.find((i) => i.brand);
      const brandSlug = brandImage ? Object.keys(BRANDS).find((k) => BRANDS[k] === brandImage.brand) : null;
      const brandId = brandSlug && brandCache[brandSlug] ? brandCache[brandSlug] : null;

      const primaryImage = typeImages[0];
      const imageUrl = `/images/${primaryImage.filename}`;

      const product = await prisma.product.create({
        data: {
          name: productName,
          nameAr: `قميص ${meta.nameAr} - ${typeLabel.ar} ${season}`,
          nameEn: `${teamName} - ${typeLabel.en} Jersey ${season}`,
          slug: `${productSlugBase}-${Date.now()}`,
          description: `Maillot officiel ${typeLabel.fr.toLowerCase()} de la saison ${season} de ${teamName}. Fabrication premium, matériaux haute qualité, confort optimal pour les supporters.`,
          descriptionAr: `قميص رسمي ${typeLabel.ar} للموسم ${season} لـ ${meta.nameAr}. تصنيع ممتاز، مواد عالية الجودة، راحة مثالية للمشجعين.`,
          descriptionEn: `Official ${typeLabel.en.toLowerCase()} jersey for the ${season} season of ${teamName}. Premium manufacturing, high quality materials, optimal comfort for supporters.`,
          price: 300,
          isActive: true,
          isFeatured: teamsCreated <= 12,
          isNewArrival: teamsCreated <= 24,
          isBestSeller: teamsCreated <= 8,
          isOnSale: false,
          stock: Math.floor(Math.random() * 50) + 10,
          categoryId: footballShirtsCategory.id,
          brandId,
          teamId: team.id,
          sku: `MS10-${teamSlug.toUpperCase().substring(0, 10)}-${typeKey.toUpperCase().substring(0, 3)}-${Date.now()}`,
          tags: ["maillot", typeKey, season, teamName.toLowerCase()],
        },
      });

      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: imageUrl,
          alt: `${teamName} Maillot ${typeLabel.fr} ${season}`,
          sortOrder: 0,
          isPrimary: true,
        },
      });
      imagesCreated++;

      for (let i = 1; i < typeImages.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: `/images/${typeImages[i].filename}`,
            alt: `${teamName} Maillot ${typeLabel.fr} ${season} - Vue ${i + 1}`,
            sortOrder: i,
            isPrimary: false,
          },
        });
        imagesCreated++;
      }

      const defaultSizes = ["S", "M", "L", "XL", "XXL"];
      await prisma.productSize.createMany({
        data: defaultSizes.map((size) => ({
          productId: product.id,
          size,
          stock: Math.floor(Math.random() * 20) + 5,
          isActive: true,
        })),
      });

      productsCreated++;
    }
  }

  console.log(`\n🗑️  Removing teams without images...`);
  const allTeams = await prisma.team.findMany({ select: { id: true, slug: true, name: true } });
  let deletedTeams = 0;
  let deletedProducts = 0;

  for (const team of allTeams) {
    if (!slugsToKeep.has(team.slug)) {
      const productCount = await prisma.product.count({ where: { teamId: team.id } });
      await prisma.productImage.deleteMany({ where: { product: { teamId: team.id } } });
      await prisma.productSize.deleteMany({ where: { product: { teamId: team.id } } });
      await prisma.product.deleteMany({ where: { teamId: team.id } });
      await prisma.team.delete({ where: { id: team.id } });
      deletedTeams++;
      deletedProducts += productCount;
    }
  }

  console.log(`\n📸 Image sync completed:`);
  console.log(`  Teams created: ${teamsCreated}`);
  console.log(`  Teams updated: ${teamsUpdated}`);
  console.log(`  Teams deleted: ${deletedTeams}`);
  console.log(`  Products created: ${productsCreated}`);
  console.log(`  Products deleted (orphans): ${deletedProducts}`);
  console.log(`  Images referenced: ${imagesCreated}`);
}
