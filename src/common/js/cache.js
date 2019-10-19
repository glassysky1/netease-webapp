import storage from "good-storage";


const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const UID = '__uid__'
//插入数据

function insertArray(arr,val,compare,maxLen) {
  const index = arr.findIndex(compare)
  //如果插入的数组的第一条，则
  if(index ===0){
    return
  }

  //如果插入的不是第一条，则把arr的这条删除掉，并插入到第一个
  if(index > 0){
    arr.splice(index,1)
  }
  //并且插入到第一个
  arr.unshift(val)

  //如果数组的长度大于最大长度
  if(maxLen && arr.length >maxLen){
    //把数组的最后一个元素给移除掉
    arr.pop()
  }
}
//删除数据
function delateFromArray(arr,compare) {
  //查询数组里面是否有数据
  const index = arr.findIndex(compare)
  if(index > -1){
    arr.splice(index,1)
  }
}

//搜索历史
export function saveSearch(query) {
  //如果数组没有存，则为空
  let searches = storage.get(SEARCH_KEY,[])
  insertArray(searches,query,(item)=>{
    return item === query
  },SEARCH_MAX_LENGTH)

  //把数据存储
  storage.set(SEARCH_KEY,searches)
  //返回新数组
  return searches
}

//删除搜素历史
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY,[])
  delateFromArray(searches,(item) =>{
    return item === query
  })

  storage.set(SEARCH_KEY,searches)
  return searches
}

//清空历史
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}
//读取搜索历史
export function loadSearch() {
  return storage.get(SEARCH_KEY,[])
}

//存储用户信息
export function saveUserId(uid) {
  let userId = storage.set(UID,uid)
  return userId
}

//清除用户信息
export function clearUserId(uid) {
  let userId = storage.remove(UID)
  return userId
}
//读取用户信息
export function loadUserId() {
  return storage.get(UID,'')
}