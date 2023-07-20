/**
 * 数字
 */
const REG_NUMBER = '.*\\d+.*'
/**
 * 小写字母
 */
const REG_UPPERCASE = '.*[A-Z]+.*'
/**
 * 大写字母
 */
const REG_LOWERCASE = '.*[a-z]+.*'

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
 * 最终评分
 * @param str
 */
var level = function(str) {
  var lengths = length(str) // 长度
  var letter = letters(str) // 字母
  var number = numbers(str) // 数字
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
