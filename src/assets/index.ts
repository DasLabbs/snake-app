// src/assets/index.ts
import instagramImg from '@assets/images/instagram.png';
import tiktokImg from '@assets/images/tiktok.png';
import bodyImg from '@assets/svgs/body.svg';
import closeSvg from '@assets/svgs/close.svg';
import cnLang from '@assets/svgs/cn.svg';
import enLang from '@assets/svgs/en.svg';
import foodImg from '@assets/svgs/food.svg';
import headImg from '@assets/svgs/head.svg';
import heartShadow from '@assets/svgs/heart-shadow.svg';
import heartIcon from '@assets/svgs/pixel-heart.svg';
import plusSvg from '@assets/svgs/plus.svg';
import pointIcon from '@assets/svgs/point.svg';
import snakeImg from '@assets/svgs/snake.svg';
import snakeWithTailImg from '@assets/svgs/snake-with-tail.svg';
import tailImg from '@assets/svgs/tail.svg';
import videoAd1 from '@assets/videos/ad-1.mp4';
import videoAd2 from '@assets/videos/ad-2.mp4';

export const ASSETS = {
  head: headImg,
  tail: tailImg,
  body: bodyImg,
  food: foodImg,
  heartIcon: heartIcon,
  pointIcon: pointIcon,
  snakeImg: snakeImg,
  heartShadowIcon: heartShadow,
  tiktokImg: tiktokImg,
  instagramImg: instagramImg,
  snakeWithTailImg: snakeWithTailImg,
  enLang: enLang,
  cnLang: cnLang,
  closeSvg: closeSvg,
  plusSvg: plusSvg,
} as const;

export const VIDEOS = [videoAd1, videoAd2] as const;
