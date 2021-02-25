import fileDownloadName from "./fileDownloadName";

export default function(file){
  return file.type == 'text/html' ? true : false
}