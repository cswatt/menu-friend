const yaml = require('js-yaml');

const parseInput = (input) => {
    var result = [];

    let inputBlob = yaml.load(input);
    // check if we've got a 'main'
    if (inputBlob.hasOwnProperty('main')){
        let items = inputBlob.main
        for (const i in items){
            if (items.hasOwnProperty(i)){
                let entry = new Object();
                for (const j in items[i]){
                    entry[j] = items[i][j]
                }
                // Nestable wants everything to have an id
                entry['id'] = items[i]['identifier']
                if (typeof items[i]['identifier'] === 'undefined'){
                    entry['id'] = items[i]['name']
                    console.log(items[i]['name'] + " has no identifier.")
                }
                // Nestable also wants top-levels to have parent:0
                if (typeof items[i]['parent'] === 'undefined'){
                    entry['parent'] = 0
                }
                // we'll strip these out later
                result.push(entry)
            }
            }
      }
      else {
        throw new Error('Invalid yaml');
      }
      return [createNestedMenu(result), inputBlob.api]
}

const createNestedMenu = (arr = [], parent = 0) => {
    let fix = [];
  
    for (let i in arr.sort((a, b) => {return Number(a.weight) - Number(b.weight)})) {
      if (arr.hasOwnProperty(i)) {
        if (arr[i].parent === parent) {
          let children = createNestedMenu(arr, arr[i].id);
          if (children.length) {
            arr[i].children = children;
          }
  
          fix.push(arr[i]);
        }
      }
    }
  
    return fix;
  };
  

const generateFlat = (arr0 = []) => {
    let fix=[]
    for (let i in arr0) {
        let fixTemp = Object();
        for (const j in arr0[i]){
            if (j != 'children'){
                fixTemp[j] = arr0[i][j]
            }
        }
        fixTemp['weight'] = (Number(i)+1)*1000000
        fix.push(fixTemp);
    }

    for (let i in arr0) {

        if (Array.isArray(arr0[i].children)) {
            let arr1 = arr0[i].children,
                parentTemp = arr0[i]['id'];
            for (let k in arr1){
                let fixTemp = Object();
                for (const l in arr1[k]){
                    if (l != 'children'){
                        fixTemp[l] = arr1[k][l]
                    }
                }
                fixTemp['weight'] = (Number(k)+1)*10000
                fixTemp['parent'] = parentTemp;
                fix.push(fixTemp)
                
                if (Array.isArray(arr1[k].children)) {
                    let arr2 = arr1[k].children,
                        parentTemp = arr1[k]['id'];
                    for (let m in arr2){
                        let fixTemp = Object();
                        for (const n in arr2[m]){
                            if (n != 'children'){
                                fixTemp[n] = arr2[m][n]
                            }
                        }
                        fixTemp['weight'] = (Number(m)+1)
                        fixTemp['parent'] = parentTemp;
                        fix.push(fixTemp)


                        if (arr2[m]['children'].length > 0){
                            let arr3 = arr2[m].children,
                                parentTemp = arr2[m]['id'];
                            for (let o in arr3){
                                let fixTemp = Object();
                                for (const p in arr3[o]){
                                    if (p != 'children'){
                                        fixTemp[p] = arr3[o][p]
                                    }
                                }
                                fixTemp['weight'] = (Number(m)+1)*100 + (Number(o)+1)
                                fixTemp['parent'] = parentTemp;
                                fix.push(fixTemp)
                            }
                        } 
                    }
                }
            }
        }
    }
    return fix;
}
const parseOutput = (items, api) => {
    const output = new Object();
    
    const flatMenu = generateFlat(items.items);
    for (var i in flatMenu){
        if (flatMenu[i]['parent'] == 0){
          delete flatMenu[i]['parent']
        }
        delete flatMenu[i]['id']
    }

    output['main'] = flatMenu
    output['api'] = api

    return yaml.dump(output)
}
  
  export { parseInput, parseOutput };
  