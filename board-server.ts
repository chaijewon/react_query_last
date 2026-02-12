import express from "express";
//import type,{Request,Response} from "express";

import cors from "cors";
import oracledb ,{Connection} from "oracledb";

const app = express();
// CrossOrigin(origins="*")
app.use(cors({
    origin:"*",
    methods:["GET","POST","PUT","PATCH","DELETE"]
}));
app.use(express.json());

app.listen(3355,()=>{
    console.log("Server is running:","http://localhost:3355");
})

oracledb.outFormat=oracledb.OUT_FORMAT_OBJECT

async function getConnection(){
    return await oracledb.getConnection({
        user:'hr',
        password:'happy',
        connectionString:"211.238.142.22:1521/xe"
    });
}

app.get("/board/list_node", async  (req, res) => {
   let conn;
   // /board/list_node?page=1
   const page=parseInt(req.query.page as string)||1
    const rowSize=10;
   const start=(page-1)*rowSize;


   try {
       conn = await getConnection();
       const listSql=`
                    SELECT no,subject,name,TO_CHAR(regdate,'YYYY-MM-DD') as dbday,hit
                    FROM board
                    ORDER BY no DESC
                    OFFSET ${start} ROWS FETCH NEXT 10 ROWS ONLY
                 `
       const totalSql=`
                        SELECT CEIL(COUNT(*)/12.0) AS totalpage
                        FROM board
                      `
       const result=await conn.execute(listSql)
       const total=await  conn.execute(totalSql)
       const totalpage=(total.rows as {TOTALPAGE:number}[])[0].TOTALPAGE
       console.log(result.rows)
       res.json({
           curpage:page,
           totalpage,
           list: result.rows
       })
   }catch(error){
       console.log(error);
   }
   finally{
       if(conn){
           await conn.close()
       }

   }
})

app.post("/board/insert_node",async (req,res)=>{
    let conn
    const {name,subject,content,pwd}=req.body;

    try {
        conn = await getConnection();
        const sql=`
                    INSERT INTO board (no,name,subject,content,pwd)
                    VALUES(BR_NO_SEQ.nextval,:name,:subject,:content,:pwd)
                  `
        await conn.execute(
             sql,
             {name,subject,content,pwd},
             {autoCommit:true}
            )
        res.json({msg:'yes'})
    }catch(err){
        console.error(err);
        res.status(500).json({msg:'no'})
    }
    finally {
        if(conn){
            await conn.close()
        }
    }
})
// 상세보기
app.get("/board/detail_node",async (req,res)=>{
    let conn
    const no=req.query.no||1
    try {
        conn = await getConnection();
        const sql1=`UPDATE board SET hit=hit+1 WHERE no=${no}`
        await conn.execute(
            sql1,
            {},
            {autoCommit:true}
        )

        const sql2=`SELECT no,subject,TO_CHAR(content) as content,name,hit,
                    TO_CHAR(regdate,'YYYY-MM-DD') as dbday
                   FROM board
                   WHERE no=${no}`
        const result=await conn.execute(sql2)

        res.json(result.rows?.[0])
    }catch(err){
        console.error(err);
    }finally {
        if(conn){
            await conn.close()
        }
    }
})

app.get("/board/update_node",async (req,res)=>{
    let conn
    const no=req.query.no
    try {
           // 오라클 연동
           conn = await getConnection();
           const sql=`
             SELECT no,name,subject,TO_CHAR(content) as content FROM board
             WHERE no=${no}
           `
           const result= await conn.execute(sql)
           console.log(result)
           res.json(result.rows?.[0])

    }catch(err){
        console.error(err);
    }
    finally {
        if(conn){
            await conn.close()
        }
    }

})
// 실제 수정
app.put("/board/update_ok_node",async (req,res)=>{
    let conn
    const {no, name,subject,content,pwd}=req.body;
    try {
          conn = await getConnection();
          const checkSql=`SELECT COUNT(*) as res FROM board
                     WHERE no=${no} AND pwd=${pwd}
                `
          const check=await conn.execute(checkSql)
          console.log(check.rows)
          //console.log(check.rows?[0][0])
          const count=(check.rows as any[])[0].RES

          if( count === 0)
          {
              //console.log("비밀번호가 틀립니다:"+count)
              res.json({msg:'no'})
              return
          }
          const updateSql=`UPDATE board SET 
                     name='${name}',
                     subject='${subject}',
                     content='${content}'
                   WHERE no=${no}
                 `
          await conn.execute(
              updateSql,
              {},
              {autoCommit:true}
          )
          res.json({msg:'yes'})
    }catch(err){
        console.error(err);
    }
    finally {
        if(conn){
            await conn.close()
        }
    }
})

app.delete("/board/delete_node/:no/:pwd",async (req,res)=>{
    const no=req.params.no
    const pwd=req.params.pwd

    let conn
    try {
         conn = await getConnection();
        const checkSql=`SELECT COUNT(*) as res FROM board
                     WHERE no=${no} AND pwd=${pwd}
                `
        const check=await conn.execute(checkSql)
        console.log(check.rows)
        //console.log(check.rows?[0][0])
        const count=(check.rows as any[])[0].RES

        if( count === 0)
        {
            res.json({msg:'no'})
            return
        }

        const deleteSql=`DELETE FROM board 
                         WHERE no=${no}
                  `
        await conn.execute(deleteSql,{},{autoCommit:true})

        res.json({msg:'yes'})


    }catch(err){
        console.error(err);
    }
    finally {
        if(conn){
            await conn.close()
        }
    }

})
