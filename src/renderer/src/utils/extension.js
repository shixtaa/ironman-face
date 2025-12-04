//数字千分符-解决保留小数位问题
Number.prototype.toSeparatorString = function () {
    return this.toLocaleString(undefined, { maximumFractionDigits: 20 });
}
//字符串数字也可以直接转换成千分符格式
String.prototype.toSeparatorString = function () {
    let str = this;
    if (isNaN(str)) {
        return "";
    }
    return (+str).toSeparatorString();
}