const Node = (value) => {
  let left = null;
  let right = null;
  return { value, left, right };
};

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) return;
  if (node.right) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.left) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

const BST = (list) => {
  const buildTree = (list) => {
    // sort list and dedupe
    list.sort((a, b) => a - b);
    list = [...new Set(list)];

    // set exit condition for recursion (list length is 1 or 2)
    if (list.length === 1) {
      const node = Node(list[0]);
      return node;
    } else if (list.length === 2) {
      const [x, y] = list;
      // if first value is less than second
      if (x < y) {
        // second value becomes node, first becomes left
        const node = Node(y);
        node.left = Node(x);
        return node;
      } else {
        // otherwise, second value becomes left, first becomes node
        const node = Node(x);
        node.left = Node(y);
        return node;
      }
    } else {
      // get midpoint, make a node with value equal to midpoint
      const mid =
        list.length % 2 === 0 ? list.length / 2 : Math.floor(list.length / 2);
      const node = Node(list[mid]);
      // get left of midpoint and call buildTree again L list
      const leftArr = list.slice(0, mid);
      node.left = buildTree(leftArr);
      // get right of midpoint and call buildTree with R list
      const rightArr = list.slice(mid + 1);
      node.right = buildTree(rightArr);
      return node;
    }
  };

  const insert = (node, value) => {
    if (node === null) {
      const node = Node(value);
      return node;
    }

    if (value === node.value) {
      console.log("Value already in tree, aborting");
      return node;
    }

    if (value < node.value) {
      node.left = insert(node.left, value);
    } else {
      node.right = insert(node.right, value);
    }
    return node;
  };

  const find = (node, value) => {
    if (node === null) {
      console.log("Value not found");
      return;
    }

    if (node.value === value) {
      return node;
    } else if (value < node.value) {
      node = find(node.left, value);
    } else if (value > node.value) {
      node = find(node.right, value);
    }
    return node;
  };

  const del = (node, value, parent = undefined) => {
    if (node === null) console.log("Value not found");
    if (node.value === value) {
      // case 1: node does not have children
      if (node.left === null && node.right === null) {
        parent.left = null;
        parent.right = null;
      } else if (node.value === value && node.left && node.right) {
        // case 2: node has left and right child
        // get minimum of right tree and replace on node value
        const nodeParent = node;
        let previous;
        let successor = nodeParent.right;
        while (successor.left) {
          previous = successor;
          successor = successor.left;
        }
        nodeParent.value = successor.value;
        // delete left value of previous
        previous.left = null;
        node = nodeParent;
      } else if (parent && node.value === value && (node.left || node.right)) {
        // case 3: node has one child
        console.log("case 2 triggered");
        // get left or right child and assign as parent's left or right val
        let child;
        if (node.left) {
          child = node.left;
          parent.left = child;
        } else if (node.right) {
          child = node.right;
          parent.right = child;
        }
      }
      return;
    }
    if (value < node.value) {
      del(node.left, value, node);
    } else {
      del(node.right, value, node);
    }
  };

  const levelOrder = (queue = [root], res = []) => {
    /*
    traverses all nodes by level (all zeros first, 1st levels, etc)
    uses a queue to keep track of nodes to traverse
    */
    if (queue.length > 0) {
      const elem = queue.shift();
      res.push(elem.value);
      if (elem.left) queue.push(elem.left);
      if (elem.right) queue.push(elem.right);
      levelOrder(queue, res);
    }
    return res;
  };

  const preOrder = (node = root, res = []) => {
    /*
    traverses tree from root to leaves. visited node
    is noted first, left node is prioritized to visit
    */
    if (!node) return;
    res.push(node.value);
    preOrder(node.left, res);
    preOrder(node.right, res);
    return res;
  };

  const inOrder = (node = root, res = []) => {
    /*
    traverses tree from root to leaves. push to left is 
    prioritized, then value of node is read, and right side is traversed
    */
    if (!node) return;
    inOrder(node.left, res);
    res.push(node.value);
    inOrder(node.right, res);
    return res;
  };

  const postOrder = (node = root, res = []) => {
    if (!node) return;
    postOrder(node.left, res);
    postOrder(node.right, res);
    res.push(node.value);
    return res;
  };

  const root = buildTree(list);
  return { root, insert, find, del, levelOrder, inOrder, preOrder, postOrder };
};

const arr = [1, 2, 3, 4, 5, 6, 6, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
// // test for buildTree function
// const tree = BST(arr);
// prettyPrint(tree.root);

// // test for insert
// console.log("completed tree, with insert");
// tree.insert(tree.root, 69);
// tree.insert(tree.root, 0);
// prettyPrint(tree.root);

// // test for find
// console.log("searching");
// const exists = tree.find(tree.root, 69);
// console.log(exists);
// const doesNotExist = tree.find(tree.root, 1000);
// console.log(doesNotExist);

// // // test for delete
// prettyPrint(tree.root);
// console.log("deletions");
// // leaf case
// const leaf = 69;
// console.log("deletion of leaf ", leaf);
// tree.del(tree.root, leaf);
// prettyPrint(tree.root);

// // single child case
// const bestChild = 1;
// console.log("deletion of parent with 1 child ", bestChild);
// tree.del(tree.root, bestChild);
// prettyPrint(tree.root);

// // 2 children case A
// const parent = 4;
// console.log("deletion of parent with 2 children ", parent);
// tree.del(tree.root, parent);
// prettyPrint(tree.root);

// // 2 children case B
// const grandparent = 8;
// console.log("deletion of parent with 2 children ", grandparent);
// tree.del(tree.root, grandparent);
// prettyPrint(tree.root);

// // traversals
const tree2 = BST(arr);
prettyPrint(tree2.root);
// console.log("breadth first");
// console.log(tree2.levelOrder());
// console.log("depth first, preorder");
// console.log(tree2.preOrder());
// console.log("depth first, inorder");
// console.log(tree2.inOrder());
// console.log("depth first, postorder");
// console.log(tree2.postOrder());
