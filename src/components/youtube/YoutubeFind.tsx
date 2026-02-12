import {useState, Fragment, useRef} from "react";
import {useQuery} from "@tanstack/react-query";
import {YoutubeApi} from "./youtubeApi";
import {YoutubeItem} from "../../commons/commonsData";

function YoutubeFind(){
    const [fd,setFd] = useState<string>("제주여행");
    const fdRef = useRef<HTMLInputElement>(null);
    const {isLoading,isError,error,data}=useQuery({
        queryKey:['youtube',fd],
        queryFn:()=>YoutubeApi(fd)
    })

    const findClick=(e:Event)=>{
        if(!fd.trim())
            return fdRef.current?.focus();
        //setFd(e.currentTarget.value)
    }


    console.log(data)
    if(isLoading){
        return <h1 className={"text-center"}>Loading...</h1>
    }
    if(isError){
        return <h1 className={"text-center"}>Error:{error.message}</h1>
    }
    return (
        <Fragment>
            <div className="breadcumb-area" style={{"backgroundImage": "url(../../img/bg-img/breadcumb.jpg)"}}>
                <div className="container h-100">
                    <div className="row h-100 align-items-center">
                        <div className="col-12">
                            <div className="bradcumb-title text-center">
                                <h2>Youtube 동영상 검색</h2>
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
                              value={fd}
                              ref={fdRef}
                            />
                            <button className={"btn-sm btn-outline-primary"} onClick={findClick}>검색</button>
                        </div>
                    </div>
                </div>
            </div>

            <section className="archive-area section_padding_80">
                <div className="container">
                    <div className="row" style={{"width": "400px","margin": "0px auto"}}>
                        {
                            data?.items.map((item:YoutubeItem)=>
                               <div className="col-12" key={item.id.videoId}>
                                   <div className="single-post">
                                       <div className="post-thumb">
                                         <iframe
                                           src={"https://www.youtube.com/embed/" + item.id.videoId}
                                           title={item.snippet.title}
                                           allowFullScreen={true}
                                           width="450px" height={"300px"}
                                         />

                                       </div>
                                       <div className="post-content">
                                           <h4 className="post-content">
                                               {item.snippet.title}
                                           </h4>
                                       </div>
                                   </div>
                               </div>
                            )
                        }
                    </div>
                </div>
            </section>
        </Fragment>
    )
}
export default YoutubeFind