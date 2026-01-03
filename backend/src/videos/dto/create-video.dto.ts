import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11) // 유튜브 ID는 항상 11자입니다.
  videoId: string;

  @IsString()
  @Length(0, 10000) // 설명은 최대 10000자까지 허용
  content: string;
}
