import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getContentCached } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";
import Breadcrumbs from "@/components/Breadcrumbs";
import RecruitForm from "@/app/components/RecruitForm";
import { ROLES } from "@/lib/recruit-roles";
import Reveal from "@/app/components/recruit/Reveal";
import StickyRecruitCTA from "@/app/components/recruit/StickyRecruitCTA";
import StatNumber from "@/app/components/recruit/StatNumber";
import { Blob, Smiley, Squiggle, Spark, VibesSticker, PopLabel } from "@/app/components/recruit/PopDecor";
import { M_PLUS_Rounded_1c, Caveat } from "next/font/google";

const popFont = M_PLUS_Rounded_1c({ weight: ["400", "700", "800"], subsets: ["latin"], display: "swap", preload: false });
const handFont = Caveat({ weight: ["600"], subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "採用情報 | 高知市・香南市の美容師・アイリスト求人",
  description:
    "高知市・香南市で美容師・アイリストを募集中。香南市の美容室fleur ami、高知市の美容室Riv. by fleur ami、高知市のまつげサロンRaffine。髪質改善・白髪ぼかし・まつげパーマなど技術が学べる職場。美容学生・20代美容師・アイリスト・転職希望者歓迎。サロン見学だけでもOK。",
  alternates: { canonical: "https://fleur-group.jp/recruit" },
  openGraph: {
    title: "「ここで働きたい」と思える職場へ | fleur GROUP 採用情報",
    description:
      "高知市・香南市で美容師・アイリスト募集。香南市 美容室求人 / 高知市 美容師求人 / 高知市 アイリスト求人。まずはサロン見学から。",
    url: "https://fleur-group.jp/recruit",
    type: "website",
    images: ["/images/admin/salon-fleurami-1782197558743.jpg"],
  },
};

const crumbs = [
  { name: "ホーム", url: "https://fleur-group.jp" },
  { name: "採用情報", url: "https://fleur-group.jp/recruit" },
];

/* ───────── 以下は content.json の recruit が未設定のときのデフォルト ───────── */
const DEFAULT_HERO_TITLE = "「ここで働きたい」と\n思える場所で。";
const DEFAULT_HERO_LEAD =
  "高知市・香南市で美容師・アイリストを募集しています。\n技術も、働き方も、人間関係も。\nあなたの「好き」を続けられる環境を。";
const DEFAULT_ABOUT_LEAD =
  "技術が上手いだけのサロンではなく、働く人が満たされ、長く笑顔で続けられる会社でありたい。\nfleur GROUPは「スタッフの幸せ」を起点に、サロンづくりをしています。";

const DEFAULT_BRANDS = [
  { key: "fleurami", name: "fleurami", area: "香南市", type: "美容室", copy: "美容師として、もっと\n好きな仕事を楽しめる場所。", strengths: ["髪質改善", "カット", "艶カラー", "地域密着"], image: "/images/admin/salon-fleurami-1782197558743.jpg", instagram: "https://www.instagram.com/fleurami_info" },
  { key: "riv", name: "Riv. by fleur ami", area: "高知市", type: "美容室", copy: "大人女性に支持される技術を、\nあなたの強みに。", strengths: ["白髪ぼかし", "髪質改善", "艶カラー", "大人女性向け"], image: "/images/admin/salon-riv-1782197568767.jpg", instagram: "https://www.instagram.com/riv.kochi" },
  { key: "raffine", name: "Raffine", area: "高知市", type: "アイラッシュサロン", copy: "好きな美容を、好きな仲間と、\n好きな働き方で。", strengths: ["まつ毛パーマ", "LEDエクステ", "眉WAX", "全席半個室"], image: "/images/admin/salon-raffine-1782206000346.JPG", instagram: "https://www.instagram.com/raffine0815" },
];

const DEFAULT_VALUES = [
  { icon: "♡", title: "スタッフの幸せを第一に", text: "技術や売上の前に、まず働く人が満たされていること。心に余裕があるからこそ、お客様にも良い時間をお届けできると考えています。" },
  { icon: "↗", title: "成長できる環境", text: "営業時間内のレッスンや外部講習支援など、技術を磨ける仕組みを整えています。なりたい自分に、最短で近づける環境です。" },
  { icon: "◎", title: "人間関係を大切に", text: "感じよく、思いやりを持って働ける仲間と一緒に。ギスギスしない、相談しやすい雰囲気づくりを大切にしています。" },
  { icon: "∞", title: "長く働ける会社づくり", text: "ライフステージが変わっても続けられるよう、休日・産育休・働き方の選択肢を広げています。長いキャリアを一緒に。" },
];

const DEFAULT_STAFF_VOICES = [
  { name: "川上 凛", role: "スタイリスト", brand: "fleur ami", years: "美容師歴4年", image: "/images/admin/staff-2-1782195045005.webp", reason: "「艶カラーの仕上がりに憧れて」見学に来たのが入社のきっかけ。", joy: "お客様の『可愛い！』の一言が何よりのやりがいです。", holiday: "休日はカフェ巡りと、新しいカラーの研究をしています。", goal: "髪質改善で指名される、頼られるスタイリストになること。" },
  { name: "山岡 悠弥", role: "店長 / トップスタイリスト", brand: "fleur ami", years: "美容師歴14年", image: "/images/admin/staff-1-1782195037653.webp", reason: "技術と人を育てられる環境に惹かれて。", joy: "スタッフの成長を間近で見られること。", holiday: "家族と過ごす時間と、外部講習でのインプット。", goal: "香南市で一番『働きたい』と言われるサロンに。" },
  { name: "細川 彩香", role: "スタイリスト", brand: "Riv. by fleur ami", years: "美容師歴8年", image: "/images/admin/staff-4-1782195059188.webp", reason: "長く続けられる働き方ができると感じたから。", joy: "『ここに来ると元気になる』と言ってもらえること。", holiday: "ゆっくり読書とおいしいごはん。", goal: "後輩が安心して相談できる先輩でいること。" },
  { name: "やすい", role: "アイリスト", brand: "Raffine", years: "", image: "/images/admin/staff-7-1782195080215.webp", reason: "半個室で自分のペースで施術に集中できる環境が魅力でした。", joy: "目元が変わるだけで自信を持ってもらえること。", holiday: "韓国コスメとカフェ巡りでトレンド収集。", goal: "まつ毛パーマのデザインで指名される存在に。" },
  { name: "おざき", role: "アイリスト", brand: "Raffine", years: "", image: "/images/admin/staff-8-1782195085415.webp", reason: "同世代の仲間と楽しく働けそうだと思って。", joy: "『また来ます』と笑顔で帰ってもらえる時間。", holiday: "友達とランチ、たまに眉毛の勉強会。", goal: "眉WAXまでトータルで提案できるアイリストへ。" },
];
const DEFAULT_STAFF_VOICE_NOTE = "※掲載の内容はスタッフへのインタビューに基づきます。";

const DEFAULT_STATS: { label: string; value: string; suffix?: string }[] = [
  { label: "スタッフ平均年齢", value: "26", suffix: "歳" },
  { label: "女性スタッフ比率", value: "8:2" },
  { label: "有給取得率", value: "100", suffix: "%" },
  { label: "月平均新規来店数（全店）", value: "200", suffix: "名" },
  { label: "店舗数", value: "3", suffix: "店舗" },
  { label: "平均退勤", value: "定時" },
];

const DEFAULT_DAY_HAIR = [
  { time: "8:30", text: "出勤・朝礼／店内準備" },
  { time: "9:30", text: "営業開始・お客様対応" },
  { time: "13:00", text: "交代で昼休憩" },
  { time: "15:00", text: "施術の合間にレッスン" },
  { time: "17:30", text: "最終受付・片付け" },
  { time: "18:00", text: "退勤" },
];
const DEFAULT_DAY_EYE = [
  { time: "9:00", text: "出勤・半個室の準備" },
  { time: "9:30", text: "営業開始・施術" },
  { time: "13:00", text: "昼休憩" },
  { time: "15:00", text: "デザイン練習・撮影" },
  { time: "18:00", text: "最終受付・片付け" },
  { time: "18:30", text: "退勤" },
];

const DEFAULT_EDUCATION = [
  { step: "01", title: "営業時間内レッスン", text: "営業後に残って…ではなく、勤務時間内に技術を学べます。" },
  { step: "02", title: "モデル制度", text: "カットやカラー、まつ毛のモデル施術で実践を積みます。" },
  { step: "03", title: "技術チェック", text: "段階ごとのチェックで、今の自分の位置が明確に。" },
  { step: "04", title: "デビューサポート", text: "一人立ちまで先輩がしっかり伴走します。" },
  { step: "05", title: "外部講習支援", text: "学びたい講習・セミナーへの参加をサポート。" },
];

const DEFAULT_CAREER_HAIR = ["アシスタント", "スタイリスト", "副店長", "店長", "マネージャー"];
const DEFAULT_CAREER_EYE = ["アシスタント", "アイリスト", "リーダー", "副店長", "店長"];

const DEFAULT_REQUIREMENTS = [
  { label: "募集職種", value: "美容師（スタイリスト／アシスタント）・アイリスト" },
  { label: "給与", value: "スタイリスト：月給23万円＋歩合\nアシスタント：月給22万円\nアイリスト：月給22万円＋歩合\nアイリスト（未経験）：月給20万円" },
  { label: "勤務時間", value: "シフト制（実働時間は面談時にご相談）" },
  { label: "休日", value: "完全週休2日制" },
  { label: "有給・休暇", value: "有給休暇／産休・育休制度あり" },
  { label: "社会保険", value: "社会保険完備" },
  { label: "手当・福利厚生", value: "技術研修あり／外部講習支援／アシスタントからの育成制度" },
  { label: "勤務地", value: "香南市（fleur ami）／高知市（Riv. by fleur ami・Raffine）" },
];

const DEFAULT_FAQ = [
  { q: "未経験でも大丈夫ですか？", a: "はい。アシスタントからしっかり育成する制度があり、営業時間内のレッスンで基礎から学べます。アイリストも未経験スタートの方が活躍しています。" },
  { q: "見学だけでも可能ですか？", a: "もちろんです。応募の前に、まずは雰囲気を見にきていただくサロン見学を歓迎しています。お気軽にお申し込みください。" },
  { q: "ブランクがあります。復帰できますか？", a: "問題ありません。これまでのご経験をうかがいながら、無理のないペースで感覚を取り戻せるようサポートします。" },
  { q: "休日はしっかり取れますか？", a: "完全週休2日制で、有給や産休・育休も整えています。長く働き続けられる環境づくりを大切にしています。" },
  { q: "レッスンや研修はありますか？", a: "営業時間内のレッスン、モデル制度、技術チェック、外部講習支援など、成長をサポートする仕組みを用意しています。" },
];

/* ───────── JobPosting 構造化データ（SEO用・固定） ───────── */
const HIRING_ORG = { "@type": "Organization", name: "fleur GROUP", sameAs: "https://fleur-group.jp" };
const datePosted = "2026-06-01";
const validThrough = "2027-06-30";
function jobPosting(title: string, desc: string, locality: string, streetAddress: string, postalCode: string, occupation: string, salaryMin: number, salaryMax: number) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title, description: desc, datePosted, validThrough,
    employmentType: "FULL_TIME", hiringOrganization: HIRING_ORG,
    industry: "美容業", occupationalCategory: occupation,
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressRegion: "高知県", addressLocality: locality, streetAddress, postalCode, addressCountry: "JP" } },
    baseSalary: { "@type": "MonetaryAmount", currency: "JPY", value: { "@type": "QuantitativeValue", minValue: salaryMin, maxValue: salaryMax, unitText: "MONTH" } },
    directApply: true,
  };
}
const jobPostings = [
  jobPosting("美容師（スタイリスト・アシスタント）", "香南市の美容室fleur amiで美容師を募集。髪質改善・カット・艶カラーが学べる地域密着型サロン。香南市 美容室求人。完全週休2日制・社会保険完備・アシスタントから育成。未経験・ブランクOK。スタイリスト月給23万円＋歩合、アシスタント月給22万円。", "香南市", "野市町西野230", "781-5232", "美容師", 220000, 230000),
  jobPosting("美容師（大人女性向けサロン）", "高知市の美容室Riv. by fleur amiで美容師を募集。白髪ぼかし・髪質改善・艶カラーが強みの大人女性向けサロン。高知市 美容師求人。完全週休2日制・社会保険完備。スタイリスト月給23万円＋歩合、アシスタント月給22万円。", "高知市", "南川添9-21 フルールアミー3 2F", "781-0082", "美容師", 220000, 230000),
  jobPosting("アイリスト", "高知市のまつげサロンRaffineでアイリストを募集。まつ毛パーマ・LEDエクステ・眉WAX。全席半個室、20代女性スタッフ中心。高知市 アイリスト求人。未経験歓迎。経験者は月給22万円＋歩合、未経験は月給20万円。", "高知市", "はりまや町1-4-8 TNはりまやビル3F", "780-0822", "アイリスト", 200000, 220000),
];

export default async function RecruitPage() {
  const { salonOrder, salons, recruit } = await getContentCached();
  const salonNames = salonOrder.map((key) => salons[key as keyof typeof salons]?.name).filter((n): n is string => Boolean(n));
  const stickyInstagram = "https://www.instagram.com/fleurami_info";

  // content.json に値があればそれを、なければデフォルトを使用
  const heroTitle = recruit.heroTitle || DEFAULT_HERO_TITLE;
  const heroLead = recruit.heroLead || DEFAULT_HERO_LEAD;
  const aboutLead = recruit.aboutLead || DEFAULT_ABOUT_LEAD;
  const brands = recruit.brands?.length ? recruit.brands : DEFAULT_BRANDS;
  const values = recruit.values?.length ? recruit.values : DEFAULT_VALUES;
  const staffVoices = recruit.staffVoices?.length ? recruit.staffVoices : DEFAULT_STAFF_VOICES;
  const staffVoiceNote = recruit.staffVoiceNote ?? DEFAULT_STAFF_VOICE_NOTE;
  const stats = recruit.stats?.length ? recruit.stats : DEFAULT_STATS;
  const dayHair = recruit.dayHair?.length ? recruit.dayHair : DEFAULT_DAY_HAIR;
  const dayEye = recruit.dayEye?.length ? recruit.dayEye : DEFAULT_DAY_EYE;
  const dayHairNote = recruit.dayHairNote ?? "fleur amiの例";
  const dayEyeNote = recruit.dayEyeNote ?? "Raffineの例";
  const education = recruit.education?.length ? recruit.education : DEFAULT_EDUCATION;
  const careerHair = recruit.careerHair?.length ? recruit.careerHair : DEFAULT_CAREER_HAIR;
  const careerEye = recruit.careerEye?.length ? recruit.careerEye : DEFAULT_CAREER_EYE;
  const requirements = recruit.requirements?.length ? recruit.requirements : DEFAULT_REQUIREMENTS;
  const faq = recruit.faq?.length ? recruit.faq : DEFAULT_FAQ;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }} />
      {jobPostings.map((jp, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jp) }} />
      ))}

      <StickyRecruitCTA instagramUrl={stickyInstagram} />

      <main className={`bg-white text-site-text overflow-hidden recruit-pop ${popFont.className}`}>
        <Breadcrumbs theme="site" items={[{ name: "ホーム", url: "/" }, { name: "採用情報", url: "/recruit" }]} />
        {/* ══════ 1. ファーストビュー ══════ */}
        <section className="relative overflow-hidden">
          <Blob variant={0} color="lav" className="absolute -top-16 -left-20 w-56 sm:w-80 opacity-90" />
          <Blob variant={2} color="lime" className="absolute top-6 right-[-60px] w-52 sm:w-72" />
          <Blob variant={1} color="lime" className="absolute top-[340px] -left-16 w-36 sm:w-48" />
          <Blob variant={1} color="lav" className="absolute top-[300px] -right-10 w-32 sm:w-44 opacity-90" />
          <Spark className="absolute top-24 left-[22%] w-5 h-5 hidden sm:block" />
          <Spark shape="x" className="absolute top-14 right-[30%] w-4 h-4" />
          <Spark className="absolute top-[260px] right-[12%] w-5 h-5" />
          <Smiley className="absolute top-[200px] left-[8%] w-9 h-9 sm:w-11 sm:h-11 -rotate-12" />
          <Squiggle color="lav" className="absolute top-[150px] right-[6%] w-24 sm:w-32 rotate-12" />
          <p aria-hidden className={`${handFont.className} absolute top-[110px] left-[4%] sm:left-[12%] text-2xl sm:text-3xl leading-[0.95] text-site-text -rotate-12 hidden sm:block`}>Meet<br />&nbsp;Connect<br />&nbsp;&nbsp;Create</p>
          <p aria-hidden className={`${handFont.className} absolute top-[70px] right-[8%] sm:right-[14%] text-xl sm:text-2xl leading-tight text-site-text rotate-6 hidden sm:block`}>同じ「好き」から、<br />新しい仲間を。</p>
          <div className="max-w-3xl mx-auto px-5 pt-16 sm:pt-24 pb-10 text-center relative">
            <span className="inline-block bg-site-text text-lime font-black text-[11px] tracking-[0.3em] uppercase rounded-full px-5 py-1.5 mb-6 -rotate-3 animate-fadeinup">Recruit</span>
            <h1 className="text-[30px] leading-[1.55] sm:text-5xl sm:leading-[1.45] font-black text-balance animate-fadeinup-slow">
              {heroTitle.split("\n").map((line, i) => (
                <span key={i} className="block"><span className="bg-[linear-gradient(transparent_58%,#C7F500_58%,#C7F500_92%,transparent_92%)] px-1">{line}</span></span>
              ))}
            </h1>
            <p className="mt-6 text-sm sm:text-base text-site-text font-bold leading-loose whitespace-pre-line animate-fadeinup-late">{heroLead}</p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center animate-fadeinup-late">
              <a href="#entry" className="bg-lime text-site-text px-8 py-3.5 text-sm font-black tracking-wider rounded-full border-[3px] border-site-text shadow-[4px_4px_0_#2A2A2A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#2A2A2A] transition-all">サロン見学はこちら</a>
              <a href={stickyInstagram} target="_blank" rel="noopener noreferrer" className="bg-lav text-site-text px-8 py-3.5 text-sm font-black tracking-wider rounded-full border-[3px] border-site-text shadow-[4px_4px_0_#2A2A2A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#2A2A2A] transition-all">Instagramで見る</a>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-2 animate-fadeinup-late">
              {["月給22万円〜", "残業ゼロ", "週休2日制", "有給100%消化", "社保完備"].map((tag, ti) => (
                <span key={tag} className={`text-xs text-site-text border-2 border-site-text px-4 py-1.5 rounded-full font-black ${ti % 2 ? "bg-lav rotate-2" : "bg-lime -rotate-2"}`}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="relative space-y-8 sm:space-y-10 px-5 sm:px-8 max-w-5xl mx-auto pb-14">
            <VibesSticker className="absolute -right-1 sm:-right-4 -top-6 z-10" />
            {brands.map((b, i) => (
              <Reveal key={b.key || i} delay={i * 80}>
                <div className={`relative h-[64vw] max-h-[440px] sm:h-[360px] rounded-[2rem] overflow-hidden group border-[3px] border-site-text ${i % 2 ? "shadow-[8px_8px_0_#C7F500] sm:rotate-[0.8deg]" : "shadow-[8px_8px_0_#C697EF] sm:rotate-[-0.8deg]"}`}>
                  <Image src={b.image} alt={`${b.name}（${b.area}の${b.type}）`} fill className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" sizes="(max-width: 768px) 100vw, 960px" priority={i === 0} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-9">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] tracking-[0.25em] text-white/80 uppercase">{b.name}</span>
                      <span className="w-1 h-1 rounded-full bg-white/50" />
                      <span className="text-[10px] tracking-[0.15em] text-white/70">{b.area}・{b.type}</span>
                    </div>
                    <p className="text-white text-xl sm:text-3xl font-black leading-[1.55] whitespace-pre-line text-balance">{b.copy}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {b.strengths.map((s) => (
                        <span key={s} className="text-[10px] sm:text-xs text-site-text bg-lime font-bold rounded-full px-3 py-1">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══════ 働き方ハイライト ══════ */}
        <section className="relative overflow-hidden py-16 sm:py-20 px-5 bg-lime">
          <Blob variant={2} color="lav" className="absolute -bottom-16 -left-16 w-56 opacity-80" />
          <Smiley className="absolute top-8 right-[8%] w-10 h-10 rotate-12" />
          <div className="relative max-w-4xl mx-auto">
            <Reveal className="text-center mb-12">
              <PopLabel dark>Working Conditions</PopLabel>
              <h2 className="text-xl sm:text-2xl font-black text-site-text">選ばれる理由は、<span className="text-lav-deep">働き方</span>にある。</h2>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: "月給22万〜", label: "給与" },
                { value: "定時退勤", label: "退勤" },
                { value: "週休2日", label: "休日" },
                { value: "有給100%", label: "有給" },
              ].map((b, i) => (
                <Reveal key={b.label} delay={i * 80} className="text-center bg-white rounded-3xl py-8 px-4 border-[3px] border-site-text shadow-[5px_5px_0_#2A2A2A]">
                  <p className="text-3xl font-bold text-lav-deep leading-tight">{b.value}</p>
                  <div className="w-6 h-px bg-lime mx-auto mt-3 mb-2.5" />
                  <p className="text-[10px] tracking-widest text-site-muted uppercase">{b.label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ こんな方へ ══════ */}
        <section className="py-20 sm:py-24 px-5 bg-lav-soft">
          <div className="max-w-3xl mx-auto">
            <Reveal className="text-center mb-10">
              <PopLabel>For You</PopLabel>
              <h2 className="text-2xl sm:text-3xl font-black">こんな方、歓迎します</h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "今の職場に残業・給与・人間関係の悩みがある",
                "美容師・アイリストとして長く働き続けたい",
                "もっと技術を磨ける環境を探している",
                "ブランクがあって復帰できるか不安",
                "未経験だけどアイリストに挑戦したい",
                "まずはどんな雰囲気か見てみたい",
              ].map((text, i) => (
                <Reveal key={i} delay={i * 50}>
                  <div className="flex items-start gap-3 bg-white rounded-2xl px-5 py-4 border-[3px] border-site-text shadow-[4px_4px_0_#C697EF]">
                    <span className="w-6 h-6 rounded-full bg-lime border-2 border-site-text flex items-center justify-center text-site-text font-black text-xs flex-shrink-0">✓</span>
                    <p className="text-sm text-site-text leading-relaxed">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-8 text-center">
              <p className="text-sm text-site-muted leading-loose">一つでも当てはまれば、まずはサロン見学へ。<br />「ちょっと気になる」だけで大丈夫です。</p>
            </Reveal>
          </div>
        </section>

        {/* ══════ 代表メッセージ ══════ */}
        <section className="py-20 sm:py-28 px-5">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              <Reveal>
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border-[3px] border-site-text shadow-[8px_8px_0_#C7F500] -rotate-1">
                  <Image src="/images/admin/salon-fleurami-1782197558743.jpg" alt="fleur GROUP 代表メッセージ" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              </Reveal>
              <Reveal delay={100}>
                <PopLabel>Our Message</PopLabel>
                <h2 className="text-xl sm:text-[1.625rem] font-black mb-6 leading-relaxed">
                  美容師・アイリストとして<br />長く、輝き続けてほしい。
                </h2>
                <div className="space-y-4 text-sm text-site-muted leading-loose">
                  <p>fleur GROUPを選んでくださるスタッフには、仕事を「続けられる場所」を提供したいと思っています。</p>
                  <p>技術が上手いだけでなく、心に余裕があって、笑顔で働けること。お客様に「また来たい」と思っていただくには、まずスタッフ自身が満たされていることが大切だと考えています。</p>
                  <p>高知で美容を仕事にしたいと思う方に、素敵なキャリアを積める場所を提供し続けたい。そう思いながら、サロンをつくっています。</p>
                </div>
                <p className="mt-6 text-xs text-site-muted font-medium">fleur GROUP 代表</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ══════ 2. 私たちについて ══════ */}
        <section className="bg-lime-soft py-20 sm:py-28 px-5">
          <div className="max-w-4xl mx-auto">
            <Reveal className="text-center mb-12 sm:mb-16">
              <PopLabel>About us</PopLabel>
              <h2 className="text-2xl sm:text-3xl font-black mb-6">私たちについて</h2>
              <div className="max-w-2xl mx-auto space-y-3">
                {aboutLead.split("\n").filter((l) => l.trim()).map((line, i) => (
                  <p key={i} className="text-sm sm:text-base text-site-muted leading-loose text-balance">{line}</p>
                ))}
              </div>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {values.map((v, i) => (
                <Reveal key={v.title || i} delay={i * 70}>
                  <div className="h-full bg-white rounded-3xl p-7 border-[3px] border-site-text shadow-[5px_5px_0_#C697EF]">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-lav border-2 border-site-text text-site-text font-black text-lg mb-4">{v.icon}</span>
                    <h3 className="text-lg font-black mb-2.5">{v.title}</h3>
                    <p className="text-sm text-site-muted leading-relaxed">{v.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ 3. スタッフ紹介 ══════ */}
        <section className="py-20 sm:py-28 px-5 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none select-none flex items-start justify-center overflow-hidden pt-4">
            <p className="text-[110px] sm:text-[190px] leading-none text-lav-soft font-black tracking-wider">MEMBERS</p>
          </div>
          <div className="max-w-5xl mx-auto relative">
            <Reveal className="text-center mb-12 sm:mb-16">
              <PopLabel>Members</PopLabel>
              <h2 className="text-2xl sm:text-3xl font-black mb-4">スタッフ紹介</h2>
              <p className="text-sm text-site-muted leading-loose">一緒に働く仲間の、リアルな声。</p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {staffVoices.map((s, i) => (
                <Reveal key={s.name || i} delay={(i % 3) * 80}>
                  <article className={`h-full bg-white rounded-3xl overflow-hidden border-[3px] border-site-text ${i % 2 ? "shadow-[6px_6px_0_#C697EF]" : "shadow-[6px_6px_0_#C7F500]"}`}>
                    {s.joy && (
                      <div className={`px-5 py-3.5 border-b-[3px] border-site-text ${i % 2 ? "bg-lav" : "bg-lime"}`}>
                        <p className="text-[13px] text-site-text font-bold text-center leading-snug text-balance">{s.joy}</p>
                      </div>
                    )}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image src={s.image} alt={`${s.name}（${s.brand}・${s.role}）`} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/65 to-transparent p-4">
                        <p className="text-white text-base">{s.name}</p>
                        <p className="text-white/80 text-[11px] mt-0.5">{s.role}・{s.brand}{s.years ? `／${s.years}` : ""}</p>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      {[
                        { k: "入社理由", v: s.reason },
                        { k: "休日の過ごし方", v: s.holiday },
                        { k: "将来の目標", v: s.goal },
                      ].map((row) => (
                        <div key={row.k}>
                          <p className="text-[10px] tracking-wider text-lav-deep mb-1">{row.k}</p>
                          <p className="text-[13px] text-site-text leading-relaxed">{row.v}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            {staffVoiceNote && <p className="text-center text-[11px] text-site-muted/70 mt-8">{staffVoiceNote}</p>}
          </div>
        </section>

        {/* ══════ 4. 数字で見る ══════ */}
        <section className="relative overflow-hidden bg-site-text text-white py-20 sm:py-28 px-5">
          <Blob variant={0} color="lav" className="absolute -top-24 -right-24 w-52 sm:w-64 opacity-90" />
          <Blob variant={2} color="lime" className="absolute -bottom-28 -left-36 w-56 sm:w-64 opacity-90" />
          <div className="relative max-w-4xl mx-auto">
            <Reveal className="text-center mb-12 sm:mb-16">
              <PopLabel>Numbers</PopLabel>
              <h2 className="text-2xl sm:text-3xl font-black">数字で見るfleur GROUP</h2>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-4">
              {stats.map((s, i) => (
                <Reveal key={s.label || i} delay={(i % 3) * 70} className="text-center">
                  <StatNumber value={s.value} suffix={s.suffix} />
                  <p className="text-[11px] sm:text-xs text-white/70 mt-3 tracking-wide">{s.label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ 5. 1日の流れ ══════ */}
        <section className="py-20 sm:py-28 px-5">
          <div className="max-w-4xl mx-auto">
            <Reveal className="text-center mb-12 sm:mb-16">
              <PopLabel>A day</PopLabel>
              <h2 className="text-2xl sm:text-3xl font-black">1日の流れ</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
              {[
                { title: "美容師", note: dayHairNote, data: dayHair },
                { title: "アイリスト", note: dayEyeNote, data: dayEye },
              ].map((col) => (
                <Reveal key={col.title}>
                  <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                    <span className="w-8 h-2 rounded-full bg-lime" />{col.title}の1日
                    {col.note && <span className="text-[11px] text-site-muted font-sans">（{col.note}）</span>}
                  </h3>
                  <ol className="relative border-l-[3px] border-dashed border-lav ml-2">
                    {col.data.map((d, di) => (
                      <li key={di} className="relative pl-6 pb-7 last:pb-0">
                        <span className="absolute -left-[8px] top-1 w-4 h-4 rounded-full bg-lime border-2 border-site-text" />
                        <p className="text-sm font-bold text-lav-deep">{d.time}</p>
                        <p className="text-sm text-site-text mt-0.5">{d.text}</p>
                      </li>
                    ))}
                  </ol>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ 6. 教育制度 ══════ */}
        <section className="bg-lav-soft py-20 sm:py-28 px-5">
          <div className="max-w-4xl mx-auto">
            <Reveal className="text-center mb-12 sm:mb-16">
              <PopLabel>Education</PopLabel>
              <h2 className="text-2xl sm:text-3xl font-black mb-4">教育制度</h2>
              <p className="text-sm text-site-muted leading-loose">未経験から一人立ちまで、段階を踏んで成長できます。</p>
            </Reveal>
            <div className="space-y-3">
              {education.map((e, i) => (
                <Reveal key={e.step || i} delay={i * 60}>
                  <div className="flex items-center gap-4 bg-white rounded-3xl p-5 border-[3px] border-site-text shadow-[4px_4px_0_#C7F500]">
                    <span className="w-12 h-12 rounded-full bg-lav border-2 border-site-text flex items-center justify-center text-lg font-black text-site-text flex-shrink-0">{e.step}</span>
                    <div>
                      <h3 className="text-base font-black mb-1">{e.title}</h3>
                      <p className="text-sm text-site-muted leading-relaxed">{e.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ 7. キャリアプラン ══════ */}
        <section className="py-20 sm:py-28 px-5">
          <div className="max-w-4xl mx-auto">
            <Reveal className="text-center mb-12 sm:mb-16">
              <PopLabel>Career</PopLabel>
              <h2 className="text-2xl sm:text-3xl font-black">キャリアプラン</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { title: "美容師", steps: careerHair },
                { title: "アイリスト", steps: careerEye },
              ].map((c) => (
                <Reveal key={c.title}>
                  <h3 className="text-lg font-black mb-6 text-center">{c.title}</h3>
                  <div className="flex flex-col items-center gap-0">
                    {c.steps.map((step, i) => (
                      <div key={i} className="w-full flex flex-col items-center">
                        <div className={`w-full max-w-xs text-center border-[3px] border-site-text rounded-full py-3 text-sm font-black shadow-[3px_3px_0_#2A2A2A] ${i === c.steps.length - 1 ? "bg-lime" : "bg-white"}`}>{step}</div>
                        {i < c.steps.length - 1 && <span className="text-lav-deep font-black my-1.5 text-xl">↓</span>}
                      </div>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ 8. 募集要項 ══════ */}
        <section className="bg-lime-soft py-20 sm:py-28 px-5">
          <div className="max-w-3xl mx-auto">
            <Reveal className="text-center mb-12 sm:mb-16">
              <PopLabel>Requirements</PopLabel>
              <h2 className="text-2xl sm:text-3xl font-black">募集要項</h2>
            </Reveal>
            <div className="bg-white rounded-3xl border-[3px] border-site-text shadow-[6px_6px_0_#C697EF] overflow-hidden">
              {requirements.map((r, i) => (
                <Reveal key={r.label || i} delay={i * 40}>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 px-6 py-5 border-b border-site-greige last:border-b-0">
                    <p className="text-xs font-bold text-lav-deep sm:w-32 flex-shrink-0 sm:pt-0.5">{r.label}</p>
                    <p className="text-sm text-site-text leading-relaxed whitespace-pre-line">{r.value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="text-center text-[11px] text-site-muted/70 mt-5">※勤務時間・歩合・手当などの詳細は、見学・面談時に丁寧にご案内します。</p>

            {/* 職種別の詳しい求人情報 */}
            <Reveal className="mt-12">
              <p className="text-center text-sm text-site-text mb-5">職種別の詳しい求人情報（給与・キャリア・仕事内容）</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ROLES.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/recruit/${r.slug}`}
                    className="bg-lime border-[3px] border-site-text rounded-2xl p-5 shadow-[4px_4px_0_#2A2A2A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#2A2A2A] transition-all group text-center"
                  >
                    <span className="block text-sm font-black text-site-text">{r.title}</span>
                    <span className="block text-[11px] text-site-text mt-1">{r.areas.join("・")}</span>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══════ 9. FAQ ══════ */}
        <section className="py-20 sm:py-28 px-5">
          <div className="max-w-2xl mx-auto">
            <Reveal className="text-center mb-12 sm:mb-16">
              <PopLabel>FAQ</PopLabel>
              <h2 className="text-2xl sm:text-3xl font-black">よくある質問</h2>
            </Reveal>
            <div className="space-y-3">
              {faq.map((f, i) => (
                <details key={i} className="group bg-white rounded-2xl border-[3px] border-site-text px-5 py-4 shadow-[4px_4px_0_#C7F500]">
                  <summary className="flex items-start justify-between gap-5 cursor-pointer list-none">
                    <span className="text-base font-black leading-relaxed">
                      <span className="text-lav-deep font-bold mr-2.5 text-sm">Q</span>{f.q}
                    </span>
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-lime border-2 border-site-text flex font-black items-center justify-center text-site-text text-sm group-open:rotate-45 transition-transform duration-300 mt-1">+</span>
                  </summary>
                  <p className="mt-4 text-sm text-site-muted leading-loose pl-5 border-l-2 border-lav whitespace-pre-line">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ 10. 最終CTA / 応募フォーム ══════ */}
        <section id="entry" className="relative overflow-hidden bg-site-text text-white pt-20 sm:pt-28 px-5 scroll-mt-20">
          <Blob variant={1} color="lime" className="absolute -top-16 -left-16 w-60" />
          <Blob variant={0} color="lav" className="absolute top-40 -right-24 w-72 opacity-90" />
          <Spark shape="x" className="absolute top-16 right-[20%] w-5 h-5 invert" />
          <div className="relative max-w-2xl mx-auto text-center">
            <Reveal>
              <PopLabel>Entry</PopLabel>
              <h2 className="text-2xl sm:text-4xl font-black leading-snug mb-6">まずは、サロン見学から。</h2>
              <p className="text-sm text-white/70 leading-loose mb-10">
                「ちょっと気になる」で大丈夫です。
                <br />応募の前に、まずは雰囲気を見にきてください。
                <br className="sm:hidden" />Instagramのお気軽なDMでもお待ちしています。
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
                {brands.map((b) => (
                  <a key={b.key} href={b.instagram} target="_blank" rel="noopener noreferrer" className="bg-white text-site-text border-[3px] border-site-text px-5 py-3 text-xs font-black tracking-wide rounded-full shadow-[4px_4px_0_#C7F500] hover:bg-lime transition-all">{b.name} のInstagram</a>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="relative max-w-2xl mx-auto pb-20 sm:pb-28">
            <RecruitForm salons={salonNames} />
            <p className="text-center text-xs text-white/50 mt-6">
              一般的なお問い合わせは
              <Link href="/contact" className="text-lime underline underline-offset-2 mx-1">お問い合わせフォーム</Link>
              をご利用ください。
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
