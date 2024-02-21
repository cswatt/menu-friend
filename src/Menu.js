const yaml = require('js-yaml');

class Menu {
  blob;

  constructor(blob) {
    this.blob = blob;
    [this.main, this.api] = this.parseBlob(blob)
    this.flat = this.createFlat(this.createNest(this.main))
    this.nest = this.createNest(this.flat)
  }

  updateFromNest(nest) {
    this.flat = this.createFlat(nest)
    this.nest = this.createNest(this.flat)
  }

  editItem(item, changes) {
    let itemIndex = this.flat.findIndex((obj => obj.id === item.id))
    for (const [k, v] of Object.entries(changes)){
      this.flat[itemIndex][k] = v
      if (k === "identifier"){
        this.flat[itemIndex]['id'] = v
        console.log(this.flat[itemIndex]['id'])
        let children = this.flat.filter((obj) => obj.parent === item.identifier)
        for (let i in children){
          let ind = this.flat.findIndex((obj => obj.id === children[i].id))
          this.flat[ind]['parent'] = v
          console.log(this.flat[itemIndex]['id'])
        }
      }
    }
    this.nest = this.createNest(this.flat)

  }

  addItem(item, changes) {
    let newItem = {};
    for (let [k, v] of Object.entries(changes)){
      newItem[k] = v
    }
    newItem['parent'] = item.parent
    newItem['id'] = newItem['identifier']
    newItem['weight'] = Number(item.weight) + 1
    let siblings = this.flat.filter((obj) => obj.parent === item.identifier)
    for (let i in siblings){
      if (Number(siblings[i].weight) > Number(item.weight)){
        siblings[i].weight = Number(siblings[i].weight) + 1;
      }
    }
    this.flat.push(newItem)
    this.nest = this.createNest(this.flat)
    this.updateFromNest(this.nest)
   
  }

  deleteItem(item){

    let itemIndex = this.flat.findIndex((obj => obj.identifier === item.identifier))
    for (let i in this.flat){
      if (this.flat.hasOwnProperty(i) && this.flat[i].parent === item.identifier){
        this.deleteItem(this.flat[i])
      }
    }

    this.flat = this.flat.slice(0, itemIndex).concat(this.flat.slice(itemIndex + 1))
    this.nest = this.createNest([...this.flat])
    this.updateFromNest(this.nest)

  }

  parseBlob (_blob) {
    let result = [];
    let inputBlob = yaml.load(_blob);
    // check if we've got a 'main'
    if (inputBlob.hasOwnProperty('main')){
        let items = inputBlob.main
        for (const i in items){
            if (items.hasOwnProperty(i)){
                let entry = {};
                for (const j in items[i]){
                    entry[j] = items[i][j]
                }
                // Nestable wants everything to have an id
                entry['id'] = items[i]['identifier']
                if (typeof items[i]['identifier'] === 'undefined'){
                    entry['id'] = items[i]['name']
                    // console.log(items[i]['name'] + " has no identifier.")
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
      return [result, inputBlob.api]

  };

  createNest (_arr = [], parent = 0) {
    let nest = [];
    let arr = JSON.parse(JSON.stringify(_arr))
    for (let i in arr.sort((a, b) => {return Number(a.weight) - Number(b.weight)})) {
      if (arr.hasOwnProperty(i)) {

        if (arr[i].parent === parent) {
          let temp = Object();
          for (let j in arr[i]){
            temp[j] = arr[i][j];
          }
          let children = this.createNest(arr, arr[i].id);
          if (children.length) {
            temp.children = children;
          }
  
          nest.push(temp);
        }
      }
    }
    return nest;
  };

  createFlat(_arr0) {
    let arr0 = JSON.parse(JSON.stringify(_arr0))
    let fix=[]
    for (let i in arr0) {
        let fixTemp = Object();
        for (const j in arr0[i]){
            if (j !== 'children'){
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
                    if (l !== 'children'){
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
                        let fixTemp = {};
                        for (const n in arr2[m]){
                            if (n !== 'children'){
                                fixTemp[n] = arr2[m][n]
                            }
                        }
                        fixTemp['weight'] = (Number(m)+1)
                        fixTemp['parent'] = parentTemp;
                        fix.push(fixTemp)

                        if (Array.isArray(arr2[m].children)) {
                        if (arr2[m]['children'].length > 0){
                            let arr3 = arr2[m].children,
                                parentTemp = arr2[m]['id'];
                            for (let o in arr3){
                                let fixTemp = {};
                                for (const p in arr3[o]){
                                    if (p !== 'children'){
                                        fixTemp[p] = arr3[o][p]
                                    }
                                }
                                fixTemp['weight'] = (Number(m)+1)*100 + (Number(o)+1)
                                fixTemp['parent'] = parentTemp;
                                fix.push(fixTemp)

                                if (Array.isArray(arr3[o].children)) {
                                  if (arr3[o]['children'].length > 0){
                                      let arr4 = arr3[o].children,
                                          parentTemp = arr3[o]['id'];
                                      for (let q in arr4){
                                          let fixTemp = {};
                                          for (const r in arr4[q]){
                                              if (r !== 'children'){
                                                  fixTemp[r] = arr4[q][r]
                                              }
                                          }
                                          fixTemp['weight'] = (Number(o)+1)*100 + (Number(q)+1)
                                          fixTemp['parent'] = parentTemp;
                                          fix.push(fixTemp)
                                      }
                                  }
                                  } 
                            }
                        }
                      } 
                    }
                }
            }
        }
    }
    return fix;
  };

  parseOutput() {
    let output = {};
    let temp = JSON.parse(JSON.stringify(this.flat))
    for (var i in temp){
      if (temp[i]['parent'] === 0) {
        delete temp[i]['parent']
      }
      delete temp[i]['id']
    }

    output['main'] = temp
    output['api'] = this.api

    return yaml.dump(output)
  }

  getIdentifiers() {
    let identifiers = new Set(this.flat.map((obj) => obj.identifier))
    return identifiers;
  }


}

export default Menu;