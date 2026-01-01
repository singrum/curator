import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
} from "@/components/ui/item";
import Image from "next/image";
import Link from "next/link";

const data: {
  id: string;
  videoId: string;
  title: string;
  createdBy: string;
}[] = [
  {
    id: "1",
    videoId: "kRuIZUpk8vs",
    title: "이 기계는 무료로 적분 해줍니다.",
    createdBy: "Singrum",
  },
  {
    id: "2",
    videoId: "Vn7Sx6TUJfs",
    title: "단 1초의 실수로 쌓아둔 모든 것을 잃어버린 랭커 사건들",
    createdBy: "Singrum",
  },
  {
    id: "3",
    videoId: "Gm8v_MR7TGk",
    title: "The Bubble Sort Curve",
    createdBy: "Singrum",
  },
  {
    id: "4",
    videoId: "p_di4Zn4wz4",
    title: "Differential equations, a tourist's guide | DE1",
    createdBy: "Singrum",
  },
  {
    id: "5",
    videoId: "KnjRFC_aQB4",
    title: "Symmetry in Art and Physics",
    createdBy: "Singrum",
  },
  {
    id: "6",
    videoId: "7KYwi2F5Ce4",
    title: `The "Geometry" of Colours`,
    createdBy: "Singrum",
  },
  {
    id: "7",
    videoId: "7KYwi2F5Ce4",
    title: `The "Geometry" of Coloursddddddddddddddddddddddddddddddddddddddddddddㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ,The "Geometry" of Coloursddddddddddddddddddddddddddddddddddddddddddddㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ`,
    createdBy: "Singrum",
  },
  {
    id: "8",
    videoId: "7KYwi2F5Ce4",
    title: `The "Geometry" of Coloursddddddddddddddddddddddddddddddddddddddddddddㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ,The "Geometry" of Coloursddddddddddddddddddddddddddddddddddddddddddddㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ`,
    createdBy: "Singrum",
  },
];

export default function Page() {
  return (
    <div className="space-y-6">
      {data.map((item) => (
        <Item key={item.id} className="p-0 flex-nowrap items-stretch">
          <a
            href={`https://www.youtube.com/watch?v=${item.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ItemMedia variant="image" className="h-20 w-auto aspect-video">
              <Image
                src={`https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg`}
                alt={"main image"}
                width={160}
                height={200}
                className="mx-auto rounded-lg "
              />
            </ItemMedia>
          </a>

          <ItemContent className="flex flex-col justify-between">
            <div className="flex">
              <Link href={`/${item.id}`} className="space-y-1">
                <ItemHeader className="break-all max-w-full overflow-hidden text-ellipsis">
                  {item.title}
                </ItemHeader>
                <ItemDescription className="break-all">
                  asdfsadf
                </ItemDescription>
              </Link>
            </div>
            <div className="text-xs text-muted-foreground">
              curated by <span className="font-semibold">{item.createdBy}</span>{" "}
              | 8 up
            </div>
          </ItemContent>
        </Item>
      ))}
    </div>
  );
}
