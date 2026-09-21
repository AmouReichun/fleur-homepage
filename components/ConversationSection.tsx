import Image from "next/image";
import type { ConversationItem } from "@/lib/blog/posts";
import { getStylistImage, getCustomerImage } from "@/lib/blog/staff-characters";

type Props = {
  conversation: ConversationItem[];
  author: string;
  authorRole?: string;
  world?: "hair" | "eyelash";
};

export default function ConversationSection({ conversation, author, authorRole, world = "hair" }: Props) {
  if (!conversation || conversation.length === 0) return null;

  const stylistImg = getStylistImage(author);
  const isHair = world === "hair";

  const sectionBg    = isHair ? "bg-[#FDFAF6]"        : "bg-[#F8F4FC]";
  const borderColor  = isHair ? "border-[#DDD0BC]/60"  : "border-[#D4C8E8]/60";
  const labelColor   = isHair ? "text-[#B89566]"       : "text-[#9B7EC8]";
  const stylistBg    = isHair ? "bg-[#FBF5EC]"         : "bg-[#F3EEF9]";
  const stylistBorder= isHair ? "border-[#D9C8A8]/50"  : "border-[#C8B8E0]/50";
  const stylistTail  = isHair ? "border-r-[#FBF5EC]"   : "border-r-[#F3EEF9]";
  const customerBg   = "bg-white";
  const customerBorder = "border-[#E0E0E0]/60";
  const customerTail = "border-l-white";

  return (
    <div className={`${sectionBg} border ${borderColor} rounded-2xl px-5 py-7 my-8`}>
      <p className={`text-center text-[11px] tracking-[0.18em] font-medium ${labelColor} mb-6`}>
        ✦ よくあるお悩み — スタイリストに聞いてみた ✦
      </p>

      <div className="flex flex-col gap-5">
        {conversation.map((item, i) => {
          const isStylist = item.speaker === "stylist";

          if (isStylist) {
            return (
              <div key={i} className="flex items-end gap-3">
                {/* スタイリスト画像（左） */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1.5 w-[64px]">
                  {stylistImg ? (
                    <div className="w-[64px] h-[64px] overflow-hidden rounded-xl">
                      <Image
                        src={stylistImg}
                        alt={author}
                        width={64}
                        height={64}
                        className="object-cover object-top w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-[64px] h-[64px] rounded-xl bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                      {author.slice(0, 2)}
                    </div>
                  )}
                  <span className="text-[10px] text-gray-400 whitespace-nowrap leading-none">
                    {author.split(" ")[0] || author}
                  </span>
                </div>

                {/* 吹き出し（右） */}
                <div className="relative max-w-[calc(100%-88px)]">
                  {/* 吹き出しの尻尾 */}
                  <span
                    className={`absolute bottom-3 -left-2 w-0 h-0 border-t-[7px] border-t-transparent border-r-[10px] ${stylistTail} border-b-[7px] border-b-transparent`}
                  />
                  <div
                    className={`${stylistBg} border ${stylistBorder} rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed text-[#3A2A1A] shadow-sm`}
                  >
                    {item.text}
                  </div>
                </div>
              </div>
            );
          }

          // お客様
          const customerType = item.customer_type ?? (world === "eyelash" ? "eyelash" : "hair-young");
          const customerImg = getCustomerImage(customerType);

          return (
            <div key={i} className="flex items-end gap-3 flex-row-reverse">
              {/* お客様画像（右） */}
              <div className="flex-shrink-0 flex flex-col items-center gap-1.5 w-[64px]">
                <div className="w-[64px] h-[64px] overflow-hidden rounded-xl">
                  <Image
                    src={customerImg}
                    alt="お客様"
                    width={64}
                    height={64}
                    className="object-cover object-top w-full h-full"
                  />
                </div>
                <span className="text-[10px] text-gray-400 whitespace-nowrap leading-none">お客様</span>
              </div>

              {/* 吹き出し（左） */}
              <div className="relative max-w-[calc(100%-88px)]">
                <span
                  className={`absolute bottom-3 -right-2 w-0 h-0 border-t-[7px] border-t-transparent border-l-[10px] ${customerTail} border-b-[7px] border-b-transparent`}
                />
                <div
                  className={`${customerBg} border ${customerBorder} rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed text-[#2A2A2A] shadow-sm`}
                >
                  {item.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className={`text-center text-[10px] ${labelColor} mt-6 tracking-wider`}>
        {authorRole || "スタイリスト"} {author} がお答えします
      </p>
    </div>
  );
}
