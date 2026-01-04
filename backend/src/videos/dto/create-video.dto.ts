import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  videoId: string;

  @IsString()
  @Length(0, 10000)
  content: string;

  @IsString()
  @IsNotEmpty({ message: '아티클 제목은 필수입니다.' })
  @Length(1, 200, { message: '제목은 1자 이상 200자 이하로 입력해주세요.' })
  articleTitle: string;

  @IsArray()
  @IsString({ each: true }) // 배열의 각 요소가 문자열인지 확인
  @ArrayMaxSize(5, { message: '태그는 최대 5개까지만 등록 가능합니다.' })
  @IsNotEmpty({ message: '아티클 제목은 필수입니다.' })
  topics: string[];
}
