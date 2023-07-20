/**
 * 数字
 */
var REG_NUMBER = '.*\\d+.*'
/**
 * 小写字母
 */
var REG_UPPERCASE = '.*[A-Z]+.*'
/**
 * 大写字母
 */
var REG_LOWERCASE = '.*[a-z]+.*'
/**
 * 特殊符号(~!@#$%^&*()_+|<>,.?/:;'[]{}\)
 */
// const REG_SYMBOL = '.*[~!@#$%^&*()_+|<>,.?/:;\'\\[\\]{}"]+.*'
/**
 * 键盘字符表(小写)
 * 非shift键盘字符表
 */
var CHAR_TABLE1 = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '\0', '\0'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '\0', '\0', '\0']
]
/**
 * shift键盘的字符表
 */
var CHAR_TABLE2 = [
  ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '\0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', '|'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '"', '\0', '\0'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?', '\0', '\0', '\0']
]
/**
 * 校验密码是否符合条件
 * @param password 密码
 */
var checkPasswordRule = function(password) {
  if (password === '' || password.length < 8 || password.length > 32) {
    // console.log("长度小于8，或大于32");
    // return '密码长度应大于8小于32'
    return '密码长度应大于8位'
  }
  var i = 0
  if (password.match(REG_NUMBER)) { i++ }
  if (password.match(REG_LOWERCASE)) { i++ }
  if (password.match(REG_UPPERCASE)) { i++ }
  // if (password.match(REG_SYMBOL)) i++;
  if (i < 2) {
    // console.log(("数字、小写字母、大写字母、特殊字符，至少包含两种"));
    return '数字、小写字母、大写字母，至少包含两种'
  }
  // console.log(i);
  return '校验通过'
}
exports.checkPasswordRule = checkPasswordRule
/**
 * 是否包含3个及以上相同或字典连续字符
 */
var isContinuousChar = function(password) {
  var chars = password.split('')
  var charCode = []
  for (var i = 0; i < chars.length - 2; i++) {
    charCode[i] = chars[i].charCodeAt(0)
  }
  for (var i = 0; i < charCode.length - 2; i++) {
    var n1 = charCode[i]
    var n2 = charCode[i + 1]
    var n3 = charCode[i + 2]
    // 判断重复字符
    if (n1 === n2 && n1 === n3) {
      return true
    }
    // 判断连续字符： 正序 + 倒序
    if ((n1 + 1 === n2 && n1 + 2 === n3) || (n1 - 1 === n2 && n1 - 2 === n3)) {
      return true
    }
  }
  return false
}
/**
 * 是否包含3个及以上键盘连续字符
 * @param password 待匹配的字符串
 */
var isKeyBoardContinuousChar = function(password) {
  if (password === '') {
    return false
  }
  // 考虑大小写，都转换成小写字母
  var lpStrChars = password.toLowerCase().split('')
  // 获取字符串长度
  var nStrLen = lpStrChars.length
  // 定义位置数组：row - 行，col - column 列
  var pRowCharPos = new Array(nStrLen).fill('')
  var pColCharPos = new Array(nStrLen).fill('')
  for (var i = 0; i < nStrLen; i++) {
    var chLower = lpStrChars[i]
    pColCharPos[i] = -1
    // 检索在表1中的位置，构建位置数组
    for (var nRowTable1Idx = 0; nRowTable1Idx < 4; nRowTable1Idx++) {
      for (var nColTable1Idx = 0; nColTable1Idx < 13; nColTable1Idx++) {
        if (chLower === CHAR_TABLE1[nRowTable1Idx][nColTable1Idx]) {
          pRowCharPos[i] = nRowTable1Idx
          pColCharPos[i] = nColTable1Idx
        }
      }
    }
    // 在表1中没找到，到表二中去找，找到则continue
    if (pColCharPos[i] >= 0) {
      continue
    }
    // 检索在表2中的位置，构建位置数组
    for (var nRowTable2Idx = 0; nRowTable2Idx < 4; nRowTable2Idx++) {
      for (var nColTable2Idx = 0; nColTable2Idx < 13; nColTable2Idx++) {
        if (chLower === CHAR_TABLE2[nRowTable2Idx][nColTable2Idx]) {
          pRowCharPos[i] = nRowTable2Idx
          pColCharPos[i] = nColTable2Idx
        }
      }
    }
  }
  // 匹配坐标连线
  for (var j = 1; j <= nStrLen - 2; j++) {
    // 同一行
    if (pRowCharPos[j - 1] === pRowCharPos[j] && pRowCharPos[j] === pRowCharPos[j + 1]) {
      // 键盘行正向连续（asd）或者键盘行反向连续（dsa）
      if ((pColCharPos[j - 1] + 1 === pColCharPos[j] && pColCharPos[j] + 1 === pColCharPos[j + 1]) ||
        (pColCharPos[j + 1] + 1 === pColCharPos[j] && pColCharPos[j] + 1 === pColCharPos[j - 1])) {
        return true
      }
    }
    // 同一列
    if (pColCharPos[j - 1] === pColCharPos[j] && pColCharPos[j] === pColCharPos[j + 1]) {
      // 键盘列连续（qaz）或者键盘列反向连续（zaq）
      if ((pRowCharPos[j - 1] + 1 === pRowCharPos[j] && pRowCharPos[j] + 1 === pRowCharPos[j + 1]) ||
        (pRowCharPos[j - 1] - 1 === pRowCharPos[j] && pRowCharPos[j] - 1 === pRowCharPos[j + 1])) {
        return true
      }
    }
  }
  return false
}
/**
 * 密码强度校验
 */
/**
 * 长度
 * @param str
 */
var length = function(str) {
  if (str.length < 5) {
    return 5
  } else if (str.length < 8) {
    return 15
  } else {
    return 25
  }
}
/**
 * 字母
 * @param str
 */
var letters = function(str) {
  var count1 = 0; var count2 = 0
  for (var i = 0; i < str.length; i++) {
    if (str.charAt(i) >= 'a' && str.charAt(i) <= 'z') {
      count1++
    }
    if (str.charAt(i) >= 'A' && str.charAt(i) <= 'Z') {
      count2++
    }
  }
  if (count1 === 0 && count2 === 0) {
    return 10
  }
  if (count1 !== 0 && count2 !== 0) {
    return 30
  }
  return 20
}
/**
 * 数字
 * @param str
 */
var numbers = function(str) {
  var count = 0
  for (var i = 0; i < str.length; i++) {
    if (str.charAt(i) >= '0' && str.charAt(i) <= '9') {
      count++
    }
  }
  if (count === 0) {
    return 10
  }
  if (count === 1) {
    return 20
  }
  return 30
}
/**
 * 符号
 * @param str
 */
var symbols = function(str) {
  var count = 0
  for (var i = 0; i < str.length; i++) {
    if ((str.charCodeAt(i) >= 0x21 && str.charCodeAt(i) <= 0x2f) ||
      (str.charCodeAt(i) >= 0x3a && str.charCodeAt(i) <= 0x40) ||
      (str.charCodeAt(i) >= 0x5b && str.charCodeAt(i) <= 0x60) ||
      (str.charCodeAt(i) >= 0x7b && str.charCodeAt(i) <= 0x7e)) {
      count++
    }
  }
  if (count === 0) {
    return 0
  }
  if (count === 1) {
    return 10
  }
  return 25
}
/**
 * 得分机制
 * @param str
 */
var rewards = function(str) {
  var letter = letters(str) // 字母
  var number = numbers(str) // 数字
  var symbol = symbols(str) // 符号
  if (letter > 0 && number > 0 && symbol === 0) {
    // 字母和数字
    return 2
  }
  if (letter === 10 && number > 0 && symbol > 0) {
    // 字母、数字和符号
    return 3
  }
  if (letter === 20 && number > 0 && symbol > 0) {
    // 大小写字母、数字和符号
    return 5
  }
  return 0
}
/**
 * 最终评分
 * @param str
 */
var level = function(str) {
  var lengths = length(str) // 长度
  var letter = letters(str) // 字母
  var number = numbers(str) // 数字
  // let symbol=symbols(str);//符号
  // let reward=rewards(str);//奖励
  var sum = lengths + letter + number
  if (sum >= 80) {
    return '强'
  } else if (sum >= 60) {
    return '中'
  } else {
    return '弱'
  }
}
exports.level = level
