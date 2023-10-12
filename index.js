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

  let root = buildTree(list);

  const insert = (node, value) => {
    if (node === null) {
      const node = Node(value);
      return node;
    }

    if (value === node.value) {
      console.log("Value already in tree, aborting");
      return;
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
    /*
    checks for each exit condition when value is found: 
    Case 1: node to delete is a leaf
    Case 2: node to delete has left and right children
    Case 3: node only has 1 child
    If value is not found the node is updated and the delete 
    function is called
    */
    if (node === null) console.log("Value not found");
    if (node.value === value) {
      // case 1
      if (node.left === null && node.right === null) {
        parent.left = null;
        parent.right = null;
      } else if (node.value === value && node.left && node.right) {
        // case 2
        const nodeParent = node;
        let previous;
        let successor = nodeParent.right;
        // get minimum of right tree
        while (successor.left) {
          previous = successor;
          successor = successor.left;
        }
        // switch values of minimum from right tree and node to del
        nodeParent.value = successor.value;
        // delete left value of previous
        previous.left = null;
        node = nodeParent;
      } else if (parent && node.value === value && (node.left || node.right)) {
        // case 3
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
    /*
    traverses tree from root to leaves, values from left and right are read 
    first prior to read of parent
    */
    if (!node) return;
    postOrder(node.left, res);
    postOrder(node.right, res);
    res.push(node.value);
    return res;
  };

  const height = (node = root) => {
    // determines the distance of the root node to the furthest leaf node.
    if (!node) return 0;
    const leftHeight = height(node.left) + 1;
    const rightHeight = height(node.right) + 1;
    return Math.max(leftHeight, rightHeight);
  };

  const depth = (value, level = 0, node = root) => {
    // determines the distance of root node to node with value
    if (!node) return "not found";
    if (node.value === value) return level;

    level += 1;
    if (value > node.value) return depth(value, level, node.right);
    else if (value < node.value) return depth(value, level, node.left);
    return level;
  };

  const isBalanced = (node = root, isBal = false) => {
    /* 
    determines if height difference of each node is within 1
    tree is assumed unbalanced, and unless all nodes are marked balanced
    he assumption is maintained.
    */
    if (!node) return true;

    // check the left and right children balance
    const left = isBalanced(node.left, isBal);
    const right = isBalanced(node.right, isBal);
    // calculate height difference between left and right
    const leftHt = height(node.left);
    const rightHt = height(node.right);
    const decision = Math.abs(leftHt - rightHt) <= 1;
    // if height diff does not exceed 1, and both left and right children are
    // balanced, balance value is updated to true
    if (decision && left && right) {
      isBal = decision;
    }
    return isBal;
  };

  const rebalance = () => {
    const newlist = inOrder(root);
    root = buildTree(newlist);
  };

  return {
    get root() {
      return root;
    },
    insert,
    find,
    del,
    levelOrder,
    inOrder,
    preOrder,
    postOrder,
    height,
    depth,
    isBalanced,
    rebalance,
  };
};

(() => {
  const arr = new Array(15)
    .fill(null)
    .map(() => Math.floor(Math.random() * 101));
  console.log("The original array: ", arr);

  const tree = BST(arr);
  prettyPrint(tree.root);
  console.log("Is balanced? ", tree.isBalanced());

  console.log("Level Order traversal: ", tree.levelOrder());
  console.log("Preorder traversal: ", tree.preOrder());
  console.log("Postorder traversal: ", tree.postOrder());
  console.log("Inorder traversal: ", tree.inOrder());

  console.log("Unbalancing the tree!!!");
  tree.insert(tree.root, -1100);
  tree.insert(tree.root, -200);
  tree.insert(tree.root, 1000);
  tree.insert(tree.root, 2000);
  tree.insert(tree.root, 3000);
  prettyPrint(tree.root);
  console.log("Is balanced? ", tree.isBalanced());

  console.log("Balancing tree!");
  tree.rebalance();
  prettyPrint(tree.root);
  console.log("Is balanced? ", tree.isBalanced());

  console.log("Level Order traversal: ", tree.levelOrder());
  console.log("Preorder traversal: ", tree.preOrder());
  console.log("Postorder traversal: ", tree.postOrder());
  console.log("Inorder traversal: ", tree.inOrder());
})();
