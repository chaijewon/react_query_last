import {useState,Fragment,useRef} from "react";
import {useQuery} from "@tanstack/react-query";
import boardClient from "../../board-commons";
import {AxiosResponse} from "axios";
/*
  {
  "lastBuildDate": "Thu, 12 Feb 2026 14:30:20 +0900",
  "total": 5458539,
  "start": 1,
  "display": 10,
  "items": [
    {
      "title": "넷마블, 설 연휴 맞아 게임 13종 이벤트 진행",
      "originallink": "https://www.newstopkorea.com/news/articleView.html?idxno=43206",
      "link": "https://www.newstopkorea.com/news/articleView.html?idxno=43206",
      "description": "\u003Cb\u003E야구\u003C/b\u003E 게임 '마구마구 2025'는 2월 26일까지 접속 및 미션 보상을 통해 보석과 게임 재화를 제공하고, 강화권 등 교환 아이템을 지급하는 설 이벤트를 진행한다. 넷마블은 이번 설 이벤트를 통해 주요 타이틀 이용자... ",
      "pubDate": "Thu, 12 Feb 2026 14:28:00 +0900"
    }
 */
interface NewsItem{
    title: string,
    originallink:string,
    link: string,
    description: string,
    pubDate: string
}
interface NewsResponse{
    lastBuildDate: string,
    total: number,
    start:number,
    display:number,
    items:NewsItem[]
}
interface NewsProps{
    data:NewsResponse;
}
function NewsFind() {
    const [fd,setFd] = useState<string>("여행");
    const fdRef=useRef<HTMLInputElement>(null);
    // 서버 연결
    const {isLoading,isError,error,data,refetch:newsFind}=useQuery<AxiosResponse,Error>({
        queryKey:['new-find'],
        queryFn: async ()=> await boardClient.get(`/news/find_node?query=${fd}`)
    })
    const find=()=>{
        if(!fd.trim()){
            return fdRef.current?.focus();
        }
        if(fdRef.current){
            setFd(fdRef.current?.value);
        }
        newsFind()
    }

    if(isLoading){
        return <h1 className={"text-center"}>Loading...</h1>;
    }
    if(isError){
        return <h1 className={"text-center"}>Error:{error?.message}</h1>;
    }

    return (
        <Fragment>
            <div className="breadcumb-area" style={{"backgroundImage": "url(../../img/bg-img/breadcumb.jpg)"}}>
                <div className="container h-100">
                    <div className="row h-100 align-items-center">
                        <div className="col-12">
                            <div className="bradcumb-title text-center">
                                <h2>네이버 뉴스 검색</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="breadcumb-nav">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <input type={"text"} size={20} className={"input-sm"}
                              ref={fdRef}
                              value={fd}
                              onChange={e=>setFd(e.currentTarget.value)}
                            />
                            <button className={"btn-sm btn-outline-primary"} onClick={find}>검색</button>
                        </div>
                    </div>
                </div>
            </div>

            <section className="archive-area section_padding_80">
                <div className="container">
                    <div className="row" style={{"width": "900px","margin": "0px auto"}}>
                      <table className="table">
                          <tbody>
                            <tr>
                                <td>
                                    {
                                        data?.data.items &&
                                        data?.data.items.map((item:NewsItem)=>
                                          <table className="table table-striped">
                                              <tbody>
                                               <tr>
                                                   <td><a href={item.link}><h4 style={{"color":"orange"}} dangerouslySetInnerHTML={{__html:item.title}}></h4></a></td>
                                               </tr>
                                               <tr>
                                                  <td dangerouslySetInnerHTML={{__html:item.description}}></td>
                                               </tr>
                                              </tbody>
                                          </table>
                                        )
                                    }
                                </td>
                            </tr>
                          </tbody>
                      </table>
                    </div>
                </div>
            </section>
        </Fragment>
    )
}
export default NewsFind