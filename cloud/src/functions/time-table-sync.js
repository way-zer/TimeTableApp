const AV = require('leanengine');

const MAX_TIME = 5*60*1000;
const MAX_TRY_TIMES = 5;

class SyncData extends AV.Object{
  code;//int | six-digit
  data;//object
}

function random(i){
  return Math.floor(Math.random()*i);
}

async function getData(code){
  const date = new Date();
  date.setTime(date.getTime()-MAX_TIME);
  const q = new AV.Query(SyncData);
  q.equalTo("code",code);
  q.greaterThanOrEqualTo("updatedAt",date);
  return q.first()
}

AV.Cloud.define("upload", async(req)=>{
  const {data} = req.params;
  if(typeof data !== 'object')
    return Promise.reject("Error request!");
  let code = random(1e6);
  let i = 1;
  while ((await getData(code))){
    if(i++>5)
      return Promise.reject("Can't find a code in "+MAX_TRY_TIMES+", try later again");
    code=random(1e6)
  }
  const obj = new SyncData();
  obj.set({
    code,
    data,
  });
  await obj.save();
  return Promise.resolve(code);
});

AV.Cloud.define("getData", async (req)=>{
  const {code} = req.params;
  if(typeof code !== "number" || code<0 || code >= 1e6)
    return Promise.reject("Error request!");
  const obj  = await getData(code);
  if(obj)
    return Promise.resolve(obj.get("data"));
  else
    return Promise.reject("Can't find data. May be your code has expired!");
});
