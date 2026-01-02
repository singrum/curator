import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11) // 유튜브 ID는 항상 11자입니다.
  videoId: string;
}
