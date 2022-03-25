const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const objectid = require('objectid')

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://test:test1234@cluster0.aye3a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(async err => {
    if(err){
        console.log(err)
        return;
    }else{
        console.log("DB ready");
    }
  });


const app = new Koa();
const router = new Router();

app.use(koaBody());

router
    .post('/api/v1/urls', async ctx => {
        // 把資料分別存在url和expireAt變數
        const {url} = ctx.request.body;
        const {expireAt} = ctx.request.body;
        
        
        if (url && expireAt) {
            // 如果必填資料都有，就塞進database裡面，回傳 201
            const db=client.db("url_shorten");
            const collection=db.collection("urls");

            //為新資料產生一個unique id
            var _id = objectid();   
            shortUrl = "http://localhost:3000/"+_id

            //存取的資料有id, shortUrl, original_url, expireAt
            newdata = {
                _id,
                shortUrl,
                original_url:url,
                expireAt : new Date(expireAt),
            }

            await collection.insertOne(newdata);
            ctx.status = 201;
            ctx.body = {_id,shortUrl};
        } else {
            // 如果有欄位沒有填回傳 400
            ctx.status = 400;
        }
    })
    .put('/:id', async ctx => {
        // 把資料分別存在id, url和expireAt變數
        const id = objectid(ctx.params.id);
        const {url} = ctx.request.body;
        const {expireAt} = ctx.request.body;
        
        
        if (url && expireAt) {
            // 如果必填資料都有，就編輯資料
            
            const db=client.db("url_shorten");
            const collection=db.collection("urls");

            // 首先找出要被編輯的資料
            let url_ = await collection.findOne({id:id});
            
            if (url_) {
                // 如果有資料的話就編輯，並回傳 205
                url_._id = id;
                url_.shortUrl = "http://localhost:3000/"+id;
                url_.original_url = url;
                url_.expireAt = new Date(expireAt);
                ctx.status = 205;
                ctx.body = {id,shortUrl};
            } else {
                // 沒有找到的話就回傳 404
                ctx.status = 404;
            }
        } else {
            // 如果有欄位沒有填，就回傳 400
            ctx.status = 400;
        }       
    })
    .get('/:id', async ctx => {
        // 把資料分別存在 id 變數
        const id = objectid(ctx.params.id);

        //取得使用者發出請求的時間
        const time = new Date();
        
        if (id) {
            const db=client.db("url_shorten");
            const collection=db.collection("urls");

            //找出id對應的資料
            let url = await collection.findOne({_id:id});
            
            //如果有找到該筆資料且發處請求的時間還沒超過expireAt
            if (url && time<=url.expireAt){
                // 重新導向original_url且回傳200
                ctx.status = 200;
                ctx.redirect(url.original_url);
                ctx.body = 'Redirecting to '+url.original_url;   
            } else {
                // 沒有找到的話就回傳 404
                ctx.status = 404;
            }
        } else {
            // 如果沒送 id，回傳 404
            ctx.status = 404;
        }
    })
    .delete('/:id', async ctx => {
        // 把資料存在 id 變數
        const id = objectid(ctx.params.id);
            
        if (id) {
            const db=client.db("url_shorten");
            const collection=db.collection("urls");

            // 找出id對應的資料
            let url = await collection.findOne({_id:id});
            
            if (url) {
                // 如果有資料的話就刪除該筆資料，然後回傳 205
                await collection.deleteOne({id:id});
                ctx.status = 205;
            } else {
                // 沒有找到的話回傳 404
                ctx.status = 404;
            }
        } else {
            // 如果沒送 id，回傳 404
            ctx.status = 404;
        }    
    });

app.use(router.routes());
app.listen(3000);
