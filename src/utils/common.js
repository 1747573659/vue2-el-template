/**
 * 验证手机号
 * @param { string } value
 */
export const isMPRelaxed = value => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/g.test(value)

/**
 * 验证email(邮箱)
 * @param { string } value
 */
export const isEmail = value => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g.test(value)

/**
 * 验证非零的正整数
 * @param { string or number } value
 */
export const isPositiveInteger = value => /^\+?[1-9][0-9]*$/g.test(value)

/**
 * 验证数字（包括小数）
 * @param { string or number } value
 */
export const isPositiveNumber = value => /^\d+(?=\.{0,1}\d+$|$)/g.test(value)