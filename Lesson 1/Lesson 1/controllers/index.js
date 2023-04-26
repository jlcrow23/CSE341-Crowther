const awesomeFunction = (req, res, next) => {
    res.json('Wayne Crowther');
};

const returnAnotherPerson = (req, res, next) => {
    res.json('Super awesome person');
};

module.exports = { awesomeFunction, returnAnotherPerson };