fs=require('fs')
getSubStrings = (str, minLength) ->
  return [] if str.length < minLength
  origString = str
  (str.substr start,minLength for start in [0..str.length-minLength]).concat getSubStrings(str,minLength+1)
  
index={}

for line in require('fs').readFileSync('regName.csv').toString().split('\n')
  
  continue unless line.length #This is for the final newline inserted by every editor
  [regNo,name] = line.split(",")
  for str in name.split(' ')
    for searchString in getSubStrings(str,3)
      if index[searchString]
        index[searchString].push regNo 
      else
        index[searchString] = [regNo]

superIndex ={}

for key of index
  superIndex[key.substr(0,2)] = superIndex[key.substr(0,2)] ? {}
  superIndex[key.substr(0,2)][key] = index[key]

index={}

for key of superIndex
  fs.writeFile  "index/"+key+".json" ,JSON.stringify(superIndex[key])
