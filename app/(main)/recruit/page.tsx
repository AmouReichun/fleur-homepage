import type { Metadata } from "next";
import Link from "next/link";
import { getContentCached } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/structured-data";
import RecruitForm from "@/app/components/RecruitForm";
import { ROLES } from "@/lib/recruit-roles";
import Reveal from "@/app/components/recruit/Reveal";
import StickyRecruitCTA from "@/app/components/recruit/StickyRecruitCTA";
import StatNumber from "@/app/components/recruit/StatNumber";

export const metadata: Metadata = {
  title: "採用情報 | 高知市・香南市の美容師・アイリスト求人 - fleur GROUP",
  description:
    "高知市・香南市で美容師・アイリストを募集中。香南市の美容室fleurami、高知市の美容室Riv. by fleurami、高知市のまつげサロンRaffine。髪質改善・白髪ぼかし・まつげパーマなど技術が学べる職場。美容学生・20代美容師・アイリスト・転職希望者歓迎。サロン見学だけでもOK。",
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
  { key: "riv", name: "Riv. by fleurami", area: "高知市", type: "美容室", copy: "大人女性に支持される技術を、\nあなたの強みに。", strengths: ["白髪ぼかし", "髪質改善", "艶カラー", "大人女性向け"], image: "/images/admin/salon-riv-1782197568767.jpg", instagram: "https://www.instagram.com/riv.kochi" },
  { key: "raffine", name: "Raffine", area: "高知市", type: "アイラッシュサロン", copy: "好きな美容を、好きな仲間と、\n好きな働き方で。", strengths: ["まつ毛パーマ", "LEDエクステ", "眉WAX", "全席半個室"], image: "/images/admin/salon-raffine-1782206000346.JPG", instagram: "https://www.instagram.com/raffine0815" },
];

const DEFAULT_VALUES = [
  { icon: "♡", title: "スタッフの幸せを第一に", text: "技術や売上の前に、まず働く人が満たされていること。心に余裕があるからこそ、お客様にも良い時間をお届けできると考えています。" },
  { icon: "↗", title: "成長できる環境", text: "営業時間内のレッスンや外部講習支援など、技術を磨ける仕組みを整えています。なりたい自分に、最短で近づける環境です。" },
  { icon: "◎", title: "人間関係を大切に", text: "感じよく、思いやりを持って働ける仲間と一緒に。ギスギスしない、相談しやすい雰囲気づくりを大切にしています。" },
  { icon: "∞", title: "長く働ける会社づくり", text: "ライフステージが変わっても続けられるよう、休日・産育休・働き方の選択肢を広げています。長いキャリアを一緒に。" },
];

const DEFAULT_STAFF_VOICES = [
  { name: "川上 凛", role: "スタイリスト", brand: "fleurami", years: "美容師歴4年", image: "/images/admin/staff-2-1782195045005.jpg", reason: "「艶カラーの仕上がりに憧れて」見学に来たのが入社のきっかけ。", joy: "お客様の『可愛い！』の一言が何よりのやりがいです。", holiday: "休日はカフェ巡りと、新しいカラーの研究をしています。", goal: "髪質改善で指名される、頼られるスタイリストになること。" },
  { name: "山岡 悠弥", role: "店長 / トップスタイリスト", brand: "fleurami", years: "美容師歴14年", image: "/images/admin/staff-1-1782195037653.jpg", reason: "技術と人を育てられる環境に惹かれて。", joy: "スタッフの成長を間近で見られること。", holiday: "家族と過ごす時間と、外部講習でのインプット。", goal: "香南市で一番『働きたい』と言われるサロンに。" },
  { name: "西田 ななみ", role: "スタイリスト", brand: "Riv. by fleurami", years: "美容師歴3年", image: "/images/admin/staff-6-1782195072738.jpg", reason: "大人女性向けの上質な接客を学びたくて入社しました。", joy: "白髪ぼかしでお客様が明るい表情になる瞬間。", holiday: "美術館やインテリアショップで感性をリフレッシュ。", goal: "デザインカラーでも指名いただけるようになりたい。" },
  { name: "細川 彩香", role: "スタイリスト", brand: "Riv. by fleurami", years: "美容師歴8年", image: "/images/admin/staff-4-1782195059188.jpg", reason: "長く続けられる働き方ができると感じたから。", joy: "『ここに来ると元気になる』と言ってもらえること。", holiday: "ゆっくり読書とおいしいごはん。", goal: "後輩が安心して相談できる先輩でいること。" },
  { name: "やすい", role: "アイリスト", brand: "Raffine", years: "", image: "/images/admin/staff-7-1782195080215.jpg", reason: "半個室で自分のペースで施術に集中できる環境が魅力でした。", joy: "目元が変わるだけで自信を持ってもらえること。", holiday: "韓国コスメとカフェ巡りでトレンド収集。", goal: "まつ毛パーマのデザインで指名される存在に。" },
  { name: "おざき", role: "アイリスト", brand: "Raffine", years: "", image: "/images/admin/staff-8-1782195085415.jpg", reason: "同世代の仲間と楽しく働けそうだと思って。", joy: "『また来ます』と笑顔で帰ってもらえる時間。", holiday: "友達とランチ、たまに眉毛の勉強会。", goal: "眉WAXまでトータルで提案できるアイリストへ。" },
];
const DEFAULT_STAFF_VOICE_NOTE = "※スタッフの声は一例です。実際の声は順次掲載予定です。";

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
  { label: "勤務地", value: "香南市（fleurami）／高知市（Riv. by fleurami・Raffine）" },
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
  jobPosting("美容師（スタイリスト・アシスタント）", "香南市の美容室fleuramiで美容師を募集。髪質改善・カット・艶カラーが学べる地域密着型サロン。香南市 美容室求人。完全週休2日制・社会保険完備・アシスタントから育成。未経験・ブランクOK。スタイリスト月給23万円＋歩合、アシスタント月給22万円。", "香南市", "野市町西野230", "781-5233", "美容師", 220000, 230000),
  jobPosting("美容師（大人女性向けサロン）", "高知市の美容室Riv. by fleuramiで美容師を募集。白髪ぼかし・髪質改善・艶カラーが強みの大人女性向けサロン。高知市 美容師求人。完全週休2日制・社会保険完備。スタイリスト月給23万円＋歩合、アシスタント月給22万円。", "高知市", "南川添9-21 フルールアミー3 2F", "781-0082", "美容師", 220000, 230000),
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
  const dayHairNote = recruit.dayHairNote ?? "fleuramiの例";
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

      <main className="bg-white text-site-text overflow-hidden">
        {/* ══════ 1. ファーストビュー ══════ */}
        <section className="relative">
          <div className="max-w-3xl mx-auto px-5 pt-16 sm:pt-24 pb-10 text-center">
            <p className="text-[11px] tracking-[0.4em] text-site-accent uppercase mb-5 animate-fadeinup">Recruit</p>
            <h1 className="font-serif text-[26px] leading-[1.5] sm:text-4xl sm:leading-[1.5] font-medium text-balance whitespace-pre-line animate-fadeinup-slow">{heroTitle}</h1>
            <p className="mt-6 text-sm sm:text-base text-site-muted leading-loose whitespace-pre-line animate-fadeinup-late">{heroLead}</p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center animate-fadeinup-late">
              <a href="#entry" className="bg-site-accent text-white px-8 py-3.5 text-sm font-medium tracking-wider rounded-sm hover:bg-opacity-90 transition-all">サロン見学はこちら</a>
              <a href={stickyInstagram} target="_blank" rel="noopener noreferrer" className="border border-site-greige text-site-text px-8 py-3.5 text-sm font-medium tracking-wider rounded-sm hover:border-site-accent transition-all">Instagramで見る</a>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 max-w-5xl mx-auto pb-8">
            {brands.map((b, i) => (
              <Reveal key={b.key || i} delay={i * 80}>
                <div className="relative h-[64vw] max-h-[440px] sm:h-[360px] rounded-2xl overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.image} alt={`${b.name}（${b.area}の${b.type}）`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" loading={i === 0 ? "eager" : "lazy"} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-9">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] tracking-[0.25em] text-white/80 uppercase">{b.name}</span>
                      <span className="w-1 h-1 rounded-full bg-white/50" />
                      <span className="text-[10px] tracking-[0.15em] text-white/70">{b.area}・{b.type}</span>
                    </div>
                    <p className="font-serif text-white text-xl sm:text-3xl font-medium leading-[1.55] whitespace-pre-line text-balance">{b.copy}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {b.strengths.map((s) => (
                        <span key={s} className="text-[10px] sm:text-xs text-white/90 border border-white/40 rounded-full px-3 py-1">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══════ 2. 私たちについて ══════ */}
        <section className="bg-site-light py-20 sm:py-28 px-5">
          <div className="max-w-4xl mx-auto">
            <Reveal className="text-center mb-12 sm:mb-16">
              <p className="text-[11px] tracking-[0.35em] text-site-accent uppercase mb-4">About us</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-6">私たちについて</h2>
              <p className="text-sm sm:text-base text-site-muted leading-loose max-w-2xl mx-auto whitespace-pre-line">{aboutLead}</p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {values.map((v, i) => (
                <Reveal key={v.title || i} delay={i * 70}>
                  <div className="h-full bg-white rounded-xl p-7 border border-site-greige">
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-site-light text-site-accent text-lg mb-4">{v.icon}</span>
                    <h3 className="font-serif text-lg font-medium mb-2.5">{v.title}</h3>
                    <p className="text-sm text-site-muted leading-relaxed">{v.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ 3. スタッフ紹介 ══════ */}
        <section className="py-20 sm:py-28 px-5">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-12 sm:mb-16">
              <p className="text-[11px] tracking-[0.35em] text-site-accent uppercase mb-4">Members</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-4">スタッフ紹介</h2>
              <p className="text-sm text-site-muted leading-loose">一緒に働く仲間の、リアルな声。</p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {staffVoices.map((s, i) => (
                <Reveal key={s.name || i} delay={(i % 3) * 80}>
                  <article className="h-full bg-white rounded-2xl overflow-hidden border border-site-greige">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.image} alt={`${s.name}（${s.brand}・${s.role}）`} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/65 to-transparent p-4">
                        <p className="text-white font-serif text-base">{s.name}</p>
                        <p className="text-white/80 text-[11px] mt-0.5">{s.role}・{s.brand}{s.years ? `／${s.years}` : ""}</p>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      {[
                        { k: "入社理由", v: s.reason },
                        { k: "やりがい", v: s.joy },
                        { k: "休日の過ごし方", v: s.holiday },
                        { k: "将来の目標", v: s.goal },
                      ].map((row) => (
                        <div key={row.k}>
                          <p className="text-[10px] tracking-wider text-site-accent mb-1">{row.k}</p>
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
        <section className="bg-site-text text-white py-20 sm:py-28 px-5">
          <div className="max-w-4xl mx-auto">
            <Reveal className="text-center mb-12 sm:mb-16">
              <p className="text-[11px] tracking-[0.35em] text-site-accent uppercase mb-4">Numbers</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium">数字で見るfleur GROUP</h2>
            </Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-4">
              {stats.map((s, i) => (
                <Reveal key={s.label || i} delay={(i % 4) * 70} className="text-center">
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
              <p className="text-[11px] tracking-[0.35em] text-site-accent uppercase mb-4">A day</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium">1日の流れ</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
              {[
                { title: "美容師", note: dayHairNote, data: dayHair },
                { title: "アイリスト", note: dayEyeNote, data: dayEye },
              ].map((col) => (
                <Reveal key={col.title}>
                  <h3 className="font-serif text-lg font-medium mb-6 flex items-center gap-2">
                    <span className="w-6 h-px bg-site-accent" />{col.title}の1日
                    {col.note && <span className="text-[11px] text-site-muted font-sans">（{col.note}）</span>}
                  </h3>
                  <ol className="relative border-l border-site-greige ml-2">
                    {col.data.map((d, di) => (
                      <li key={di} className="relative pl-6 pb-7 last:pb-0">
                        <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-site-accent" />
                        <p className="text-sm font-serif text-site-accent">{d.time}</p>
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
        <section className="bg-site-light py-20 sm:py-28 px-5">
          <div className="max-w-4xl mx-auto">
            <Reveal className="text-center mb-12 sm:mb-16">
              <p className="text-[11px] tracking-[0.35em] text-site-accent uppercase mb-4">Education</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-4">教育制度</h2>
              <p className="text-sm text-site-muted leading-loose">未経験から一人立ちまで、段階を踏んで成長できます。</p>
            </Reveal>
            <div className="space-y-3">
              {education.map((e, i) => (
                <Reveal key={e.step || i} delay={i * 60}>
                  <div className="flex items-start gap-4 bg-white rounded-xl p-5 border border-site-greige">
                    <span className="font-serif text-2xl text-site-accent/50 leading-none w-10 flex-shrink-0">{e.step}</span>
                    <div>
                      <h3 className="font-serif text-base font-medium mb-1">{e.title}</h3>
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
              <p className="text-[11px] tracking-[0.35em] text-site-accent uppercase mb-4">Career</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium">キャリアプラン</h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { title: "美容師", steps: careerHair },
                { title: "アイリスト", steps: careerEye },
              ].map((c) => (
                <Reveal key={c.title}>
                  <h3 className="font-serif text-lg font-medium mb-6 text-center">{c.title}</h3>
                  <div className="flex flex-col items-center gap-0">
                    {c.steps.map((step, i) => (
                      <div key={i} className="w-full flex flex-col items-center">
                        <div className="w-full max-w-xs text-center bg-white border border-site-greige rounded-full py-3 text-sm font-medium shadow-sm">{step}</div>
                        {i < c.steps.length - 1 && <span className="text-site-accent my-1.5 text-lg">↓</span>}
                      </div>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ 8. 募集要項 ══════ */}
        <section className="bg-site-light py-20 sm:py-28 px-5">
          <div className="max-w-3xl mx-auto">
            <Reveal className="text-center mb-12 sm:mb-16">
              <p className="text-[11px] tracking-[0.35em] text-site-accent uppercase mb-4">Requirements</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium">募集要項</h2>
            </Reveal>
            <div className="bg-white rounded-2xl border border-site-greige overflow-hidden">
              {requirements.map((r, i) => (
                <Reveal key={r.label || i} delay={i * 40}>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 px-6 py-5 border-b border-site-greige last:border-b-0">
                    <p className="text-xs font-medium text-site-accent sm:w-32 flex-shrink-0 sm:pt-0.5">{r.label}</p>
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
                    className="bg-white border border-site-greige rounded-xl p-5 hover:border-site-accent transition-colors group text-center"
                  >
                    <span className="block text-sm font-medium text-site-text group-hover:text-site-accent transition-colors">{r.title}</span>
                    <span className="block text-[11px] text-site-muted mt-1">{r.areas.join("・")}</span>
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
              <p className="text-[11px] tracking-[0.35em] text-site-accent uppercase mb-4">FAQ</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium">よくある質問</h2>
            </Reveal>
            <div className="divide-y divide-site-greige border-y border-site-greige">
              {faq.map((f, i) => (
                <details key={i} className="group py-5">
                  <summary className="flex items-start justify-between gap-5 cursor-pointer list-none">
                    <span className="font-serif text-base font-medium leading-relaxed">
                      <span className="text-site-accent mr-2.5 text-sm">Q</span>{f.q}
                    </span>
                    <span className="flex-shrink-0 w-5 h-5 border border-site-greige flex items-center justify-center text-site-muted text-sm group-open:rotate-45 transition-transform duration-300 mt-1">+</span>
                  </summary>
                  <p className="mt-4 text-sm text-site-muted leading-loose pl-5 border-l border-site-accent/40 whitespace-pre-line">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ 10. 最終CTA / 応募フォーム ══════ */}
        <section id="entry" className="bg-site-text text-white pt-20 sm:pt-28 px-5 scroll-mt-20">
          <div className="max-w-2xl mx-auto text-center">
            <Reveal>
              <p className="text-[11px] tracking-[0.35em] text-site-accent uppercase mb-5">Entry</p>
              <h2 className="font-serif text-2xl sm:text-4xl font-medium leading-snug mb-6">まずは、サロン見学から。</h2>
              <p className="text-sm text-white/70 leading-loose mb-10">
                「ちょっと気になる」で大丈夫です。
                <br />応募の前に、まずは雰囲気を見にきてください。
                <br className="sm:hidden" />Instagramのお気軽なDMでもお待ちしています。
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
                {brands.map((b) => (
                  <a key={b.key} href={b.instagram} target="_blank" rel="noopener noreferrer" className="border border-white/30 text-white px-5 py-3 text-xs font-medium tracking-wide rounded-sm hover:border-white transition-all">{b.name} のInstagram</a>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="max-w-2xl mx-auto pb-20 sm:pb-28">
            <RecruitForm salons={salonNames} />
            <p className="text-center text-xs text-white/50 mt-6">
              一般的なお問い合わせは
              <Link href="/contact" className="text-site-accent underline underline-offset-2 mx-1">お問い合わせフォーム</Link>
              をご利用ください。
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
