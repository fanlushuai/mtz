//

console.log(targetIndex);
console.log(accArr[targetIndex]);

function getNext(accArr, cuAcc) {
  let currentIndex = accArr.indexOf(cuAcc);
  let targetIndex;
  if (currentIndex < 0) {
    targetIndex = 0; //如果不存在，就设置到第一个
  } else {
    targetIndex = currentIndex + 1 > accArr.length - 1 ? 0 : currentIndex + 1;
  }
  return accArr[targetIndex];
}
