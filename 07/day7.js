// -*- node -*-

let input = ''
process.stdin.on('readable', () => input += process.stdin.read() || '')
process.stdin.on('end', () => main())

function parseChildren(line) {
  const parts = line.split('->')
  if (parts.length < 2) return []
  
  return parts[1].split(',').map(p => p.trim())
}

function buildTree(inputStr) {
  const programs = {}
  const lines = inputStr.split('\n')
  const re = /([a-z]+)\s\(([0-9]+)\)/

  lines.forEach(line => {
    const m = line.match(re)
    const program = m[1]
    const weight = ~~m[2]
    if (!programs[program]) {
      programs[program] = { weight, children: [] }
    } else {
      programs[program].weight = weight
    }

    const children = parseChildren(line)
    children.forEach(c => {
      if (!programs[c]) {
        programs[c] = { parent: program, children: [] }
      } else {
        programs[c].parent = program
      }
    })
  })
  
  return programs
}

function childrenOf(program, tree) {
  let children = []
  for (t in tree) {
    const p = tree[t]
    if (p.parent = program) {
      children.push(p)
    }
  }
  return children
}

function weightsOf(programs) {
  return programs.map(p => p.weight)
}

function findBottom(tree) {
  for (program in tree) {
    if (!tree[program].parent) {
      return program
    }
  }
  return null
}

function buildChildrenRefs(inTree) {
  const tree = Object.assign({}, inTree)
  for (program in tree) {
    const { parent } = tree[program]
    if (parent) {
      tree[parent].children.push(program)
    }
  }
  return tree
}

function correctChildrenWeights(tree, program) {
  const p = tree[program]
  if (p.children.length <= 1) return true

  const childrenWeightsEq = p.children
  .map(child => tree[child].totalWeight)
  .every((c, i, arr) => c === arr[0])
  return childrenWeightsEq
}

function calcSubTowerWeight(tree, program) {
  const p = tree[program]

  const childrenWeights = p.children
  .map(child => {
    const c = tree[child].totalWeight
    if (c === undefined) {
      return calcSubTowerWeight(tree, child)
    } else {
      return c
    }
  })
  .reduce((p, c) => p + c, 0)

  return p.weight + childrenWeights
}

function buildTowerWeights(tree, program) {
  const p = tree[program]
  p.totalWeight = calcSubTowerWeight(tree, program)
  p.children.forEach(c => buildTowerWeights(tree, c))
}

function findYoungestParents(tree) {
  let rents = []
  for (program in tree) {
    const p = tree[program]
    // children don't have children
    const notGrandparents = p.children
    .map(child => tree[child].children.length)
    .every(c => c === 0)
    if (notGrandparents) {
      rents.push(program)
    }
  }
  return rents
}

function parentsOf(children, tree) {
  return children.filter(c => !!tree[c].parent).map(c => tree[c].parent)
}

function main() {
  const tree = buildChildrenRefs(buildTree(input))
  const bottom = findBottom(tree)
  const bottomP = tree[bottom]
  console.log('Bottom:', bottom)

  buildTowerWeights(tree, bottom)

  const youngestParents = findYoungestParents(tree)
  youngestParents.forEach(program => {
    const p = tree[program]
    p.totalWeight = calcSubTowerWeight(tree, program)
  })

  let parents = youngestParents
  while (true) {
    let found = false
    parents = parentsOf(parents, tree)
    parents.forEach(program => {
      const p = tree[program]
      if (!correctChildrenWeights(tree, program)) {
        // console.log('\n', program, p, p.children.map(child => tree[child].totalWeight))
        found = true
      }
    })
    if (found) break
  }

  console.log(tree['obxrn'])
  console.log(tree['obxrn'].children.map(c => tree[c]))
}
