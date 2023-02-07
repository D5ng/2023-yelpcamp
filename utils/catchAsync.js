// callback 함수를 받고, (req, res, next)를 callback(req, res, next) 인자에다가 넣어주는 패턴.
module.exports = (func) => (req, res, next) => func(req, res, next).catch(next);
