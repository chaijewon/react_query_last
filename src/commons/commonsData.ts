/*
   public int getContentid();
   public String getTitle();
   public String getAddress();
   public String getImage1();
   public int getHit();
   public int getContenttype();
   public int getRownum();
 */
export interface MainItem {
    contentid:number;
    title:string;
    address:string;
    image1:string;
    hit:number;
    contenttype:number;
}
export interface TravelItem {
    contentid:number;
    title:string;
    address:string;
    image1:string;
    hit:number;
    contenttype:number;
}
export interface MainData{
    main:MainItem;
    sList:TravelItem[];
    bList:TravelItem[];
    jList:TravelItem[];
}

/*
   {
  "totalpage": 17,
  "startPage": 1,
  "curpage": 1,
  "endPage": 10,
  "list": [
    {
      "address": "제주특별자치도 서귀포시 성산읍 일출로 284-12 ",
      "title": "성산일출봉 [유네스코 세계자연유산]",
      "image1": "http://tong.visitkorea.or.kr/cms/resource/82/2944282_image2_1.bmp",
      "x": 126.9415156012,
      "y": 33.4581111174,
      "hit": 0,
      "contenttype": 12,
      "contentid": 126435,
      "restdate": "매달 첫째 주 월요일\u003Cbr\u003E※ 공휴일인 경우 다음날 휴무",
      "infocenter": "064-783-0959",
      "parking": "가능",
      "msg":
 */
export interface JejuItem{
    address:string;
    title:string;
    image1:string;
    x:number,
    y:number,
    hit:number;
    contenttype:number;
    contentid:number;
    restdate:string;
    infocenter:string;
    parking:string;
    msg:string;
    usetime:string;
}
export interface JejuData{
    list:JejuItem[];
    curpage:number;
    totalpage:number;
    startPage:number;
    endPage:number;
}