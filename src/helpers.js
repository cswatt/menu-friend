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
      else{
        throw new Error('Invalid yaml');
      }
      
      return [createNestedMenu(result), inputBlob.api]
}

const createNestedMenu = (arr = [], parent = 0) => {
    let fix = [];
  
    for (let i in arr) {
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
  
const generateFlatMenu = (arr = [], parent = 0, index = 0, recursive = 1) => {
    let fix = [],
      parentTemp = parent,
      indexTemp = Number(index),
      recursiveTemp = recursive + 1;
  
    for (let i in arr) {
      const idx = Number(i) + 1;
      if (arr.hasOwnProperty(i)) {
        let indexFix =
          recursive === 1
            ? idx * 1000
            : recursive === 2
            ? idx * 100 + indexTemp
            : idx + indexTemp;
        let fixTemp = Object();
        for (const j in arr[i]){
          if (j != 'children'){
          fixTemp[j] = arr[i][j]}
        }
        fixTemp['parent'] = parentTemp
        fixTemp['weight'] = indexFix
  
        fix.push(fixTemp);
  
        if (Array.isArray(arr[i].children)) {
          fix = fix.concat(
            generateFlatMenu(arr[i].children, arr[i].id, indexFix, recursiveTemp)
          );
        }
      }
    }
  
    return fix;
  };

const parseOutput = (items, api) => {
    const flatMenu = generateFlatMenu(items);
    for (var i in flatMenu){
        if (flatMenu[i]['parent'] == 0){
          delete flatMenu[i]['parent']
        }
        delete flatMenu[i]['id']
    }

    const output = new Object();
    output['main'] = flatMenu
    output['api'] = api
    return yaml.dump(output)
}
  
  export { createNestedMenu, generateFlatMenu, parseInput, parseOutput };
  